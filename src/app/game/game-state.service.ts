import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { distinctUntilChanged, filter, map, take } from 'rxjs/operators';
import { Card } from '../poker/poker-models';
import { GameStatus, Table } from './game-models';
import { GameWebSocketService } from './game-websocket.service';
import {
  GameEvent,
  GameSnapshotEvent,
  TableSnapshotEvent,
  PotInfo,
  PotResult,
  SeatCard,
  HandPhase,
  GameMessageEvent,
  UserMessageEvent,
} from './game-events';

export interface TableState {
  tableId: string;
  handNumber: number;
  dealerPosition: number;
  smallBlindPosition: number;
  bigBlindPosition: number;
  smallBlindAmount: number;
  bigBlindAmount: number;
  communityCards: Card[];
  pots: PotInfo[];
  phase: HandPhase | null;
  potResults: PotResult[] | null;
  seatCards: Map<number, SeatCard[]>;
  lastAction: { seatPosition: number; action: string } | null;
}

export interface PlayerState {
  userId: string;
  chipCount: number;
  tableId: string | null;
  seatPosition: number | null;
}

export interface GameState {
  gameId: string | null;
  status: GameStatus | null;
  players: Map<string, PlayerState>;
  tables: Map<string, TableState>;
  messages: Array<GameMessageEvent | UserMessageEvent>;
}

function createInitialState(): GameState {
  return {
    gameId: null,
    status: null,
    players: new Map(),
    tables: new Map(),
    messages: [],
  };
}

function createInitialTableState(tableId: string): TableState {
  return {
    tableId,
    handNumber: 0,
    dealerPosition: -1,
    smallBlindPosition: -1,
    bigBlindPosition: -1,
    smallBlindAmount: 0,
    bigBlindAmount: 0,
    communityCards: [],
    pots: [],
    phase: null,
    potResults: null,
    seatCards: new Map(),
    lastAction: null,
  };
}

@Injectable({
  providedIn: 'root',
})
export class GameStateService implements OnDestroy {
  private state$ = new BehaviorSubject<GameState>(createInitialState());
  private subscription: Subscription | null = null;

  private statusSubscription: Subscription | null = null;

  constructor(private webSocketService: GameWebSocketService) {}

  connectToGame(gameId: string): void {
    this.disconnect();

    const state = createInitialState();
    state.gameId = gameId;
    this.state$.next(state);

    // Subscribe to connection status BEFORE connecting so we don't miss the
    // 'connected' event (connectionStatus$ is a plain Subject).
    this.statusSubscription = this.webSocketService
      .getConnectionStatus()
      .pipe(
        filter((status) => status === 'connected'),
        take(1)
      )
      .subscribe(() => {
        this.webSocketService.sendCommand({
          commandId: 'get-game-state',
          gameId,
        });
      });

    this.subscription = this.webSocketService
      .connect(gameId)
      .subscribe((event) => this.handleEvent(event));
  }

  disconnect(): void {
    this.subscription?.unsubscribe();
    this.subscription = null;
    this.statusSubscription?.unsubscribe();
    this.statusSubscription = null;
    this.webSocketService.disconnect();
    this.state$.next(createInitialState());
  }

  ngOnDestroy(): void {
    this.disconnect();
  }

  // --- Selectors ---

  getState(): Observable<GameState> {
    return this.state$.asObservable();
  }

  getGameStatus(): Observable<GameStatus | null> {
    return this.state$.pipe(
      map((s) => s.status),
      distinctUntilChanged()
    );
  }

  getPlayers(): Observable<Map<string, PlayerState>> {
    return this.state$.pipe(map((s) => s.players));
  }

  getTableState(tableId: string): Observable<TableState | undefined> {
    return this.state$.pipe(
      map((s) => s.tables.get(tableId)),
      distinctUntilChanged()
    );
  }

  getTables(): Observable<Map<string, TableState>> {
    return this.state$.pipe(map((s) => s.tables));
  }

  getMessages(): Observable<Array<GameMessageEvent | UserMessageEvent>> {
    return this.state$.pipe(map((s) => s.messages));
  }

  // --- Event Handling ---

  private handleEvent(event: GameEvent): void {
    const state = { ...this.state$.value };

    switch (event.eventType) {
      case 'game-status-changed':
        state.status = event.newStatus;
        break;

      case 'game-message':
        state.messages = [...state.messages, event];
        break;

      case 'user-message':
        state.messages = [...state.messages, event];
        break;

      case 'player-buy-in': {
        const players = new Map(state.players);
        const existing = players.get(event.userId);
        players.set(event.userId, {
          userId: event.userId,
          chipCount: event.newChipCount,
          tableId: existing?.tableId ?? null,
          seatPosition: existing?.seatPosition ?? null,
        });
        state.players = players;
        break;
      }

      case 'player-moved': {
        const players = new Map(state.players);
        const existing = players.get(event.userId);
        players.set(event.userId, {
          userId: event.userId,
          chipCount: existing?.chipCount ?? 0,
          tableId: event.toTableId,
          seatPosition: existing?.seatPosition ?? null,
        });
        state.players = players;

        // Ensure target table state exists
        if (!state.tables.has(event.toTableId)) {
          const tables = new Map(state.tables);
          tables.set(event.toTableId, createInitialTableState(event.toTableId));
          state.tables = tables;
        }
        break;
      }

      case 'hand-started': {
        const tables = new Map(state.tables);
        const table = tables.get(event.tableId) ?? createInitialTableState(event.tableId);
        tables.set(event.tableId, {
          ...table,
          handNumber: event.handNumber,
          dealerPosition: event.dealerPosition,
          smallBlindPosition: event.smallBlindPosition,
          bigBlindPosition: event.bigBlindPosition,
          smallBlindAmount: event.smallBlindAmount,
          bigBlindAmount: event.bigBlindAmount,
          communityCards: [],
          pots: [],
          phase: 'PREDEAL',
          potResults: null,
          seatCards: new Map(),
          lastAction: null,
        });
        state.tables = tables;
        break;
      }

      case 'hole-cards-dealt': {
        const tables = new Map(state.tables);
        const table = tables.get(event.tableId);
        if (table) {
          const seatCards = new Map(table.seatCards);
          seatCards.set(event.seatPosition, event.cards);
          tables.set(event.tableId, { ...table, seatCards });
          state.tables = tables;
        }
        break;
      }

      case 'community-cards-dealt': {
        const tables = new Map(state.tables);
        const table = tables.get(event.tableId);
        if (table) {
          tables.set(event.tableId, {
            ...table,
            communityCards: [...table.communityCards, ...event.cards],
          });
          state.tables = tables;
        }
        break;
      }

      case 'player-acted': {
        const tables = new Map(state.tables);
        const table = tables.get(event.tableId);
        if (table) {
          tables.set(event.tableId, {
            ...table,
            lastAction: {
              seatPosition: event.seatPosition,
              action: event.action.type,
            },
          });
          state.tables = tables;
        }

        // Update player chip count
        const players = new Map(state.players);
        const existing = players.get(event.userId);
        if (existing) {
          players.set(event.userId, { ...existing, chipCount: event.chipCount });
          state.players = players;
        }
        break;
      }

      case 'player-timed-out': {
        const tables = new Map(state.tables);
        const table = tables.get(event.tableId);
        if (table) {
          tables.set(event.tableId, {
            ...table,
            lastAction: {
              seatPosition: event.seatPosition,
              action: event.defaultAction.type,
            },
          });
          state.tables = tables;
        }
        break;
      }

      case 'betting-round-complete': {
        const tables = new Map(state.tables);
        const table = tables.get(event.tableId);
        if (table) {
          tables.set(event.tableId, {
            ...table,
            pots: event.pots,
            phase: event.completedPhase,
            lastAction: null,
          });
          state.tables = tables;
        }
        break;
      }

      case 'showdown-result': {
        const tables = new Map(state.tables);
        const table = tables.get(event.tableId);
        if (table) {
          tables.set(event.tableId, {
            ...table,
            potResults: event.potResults,
          });
          state.tables = tables;
        }
        break;
      }

      case 'hand-complete': {
        const tables = new Map(state.tables);
        const table = tables.get(event.tableId);
        if (table) {
          tables.set(event.tableId, {
            ...table,
            phase: 'HAND_COMPLETE',
          });
          state.tables = tables;
        }
        break;
      }

      case 'game-snapshot': {
        state.status = event.status;

        const players = new Map<string, PlayerState>();
        for (const player of event.players) {
          players.set(player.user.loginId!, {
            userId: player.user.loginId!,
            chipCount: player.chipCount,
            tableId: player.tableId,
            seatPosition: null,
          });
        }
        state.players = players;

        // Ensure table entries exist for all table IDs and request each table's state
        const tables = new Map(state.tables);
        for (const tableId of event.tableIds) {
          if (!tables.has(tableId)) {
            tables.set(tableId, createInitialTableState(tableId));
          }
          this.webSocketService.sendCommand({
            commandId: 'get-table-state',
            gameId: event.gameId,
            tableId,
          });
        }
        state.tables = tables;
        break;
      }

      case 'table-snapshot': {
        const tables = new Map(state.tables);
        const t = event.table;
        const seatCards = new Map<number, SeatCard[]>();
        for (let i = 0; i < t.seats.length; i++) {
          if (t.seats[i].cards) {
            seatCards.set(i, t.seats[i].cards!);
          }
        }
        tables.set(t.id, {
          tableId: t.id,
          handNumber: t.handNumber,
          dealerPosition: t.dealerPosition ?? -1,
          smallBlindPosition: t.smallBlindPosition ?? -1,
          bigBlindPosition: t.bigBlindPosition ?? -1,
          smallBlindAmount: 0,
          bigBlindAmount: 0,
          communityCards: t.communityCards,
          pots: t.pots.map((p, i) => ({ potIndex: i, potAmount: p.amount })),
          phase: t.handPhase,
          potResults: null,
          seatCards,
          lastAction: null,
        });
        state.tables = tables;

        // Update player seat positions from the table snapshot
        const players = new Map(state.players);
        for (let i = 0; i < t.seats.length; i++) {
          const seat = t.seats[i];
          if (seat.player) {
            const userId = seat.player.user.loginId!;
            const existing = players.get(userId);
            if (existing) {
              players.set(userId, { ...existing, seatPosition: i, tableId: t.id });
            }
          }
        }
        state.players = players;
        break;
      }
    }

    this.state$.next(state);
  }
}
