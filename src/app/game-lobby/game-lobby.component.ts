import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { GameStateService, PlayerState, TableState } from '../game/game-state.service';
import { GameWebSocketService, ConnectionStatus } from '../game/game-websocket.service';
import { UserService } from '../user/user-service';
import { GameStatus } from '../game/game-models';
import { LangUtils } from '../lib/lang.utils';

@Component({
  selector: 'app-game-lobby',
  imports: [CommonModule, FormsModule],
  templateUrl: './game-lobby.component.html',
})
export class GameLobbyComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private gameStateService = inject(GameStateService);
  private webSocketService = inject(GameWebSocketService);
  private userService = inject(UserService);

  gameId = '';
  gameStatus$ = this.gameStateService.getGameStatus();
  players$ = this.gameStateService.getPlayers();
  tables$ = this.gameStateService.getTables();
  messages$ = this.gameStateService.getMessages();
  connectionStatus$ = this.webSocketService.getConnectionStatus();

  buyInAmount = 0;

  get isAdmin(): boolean {
    const user = this.userService.getCurrentUser();
    return user?.roles?.includes('ADMIN') ?? false;
  }

  ngOnInit(): void {
    this.gameId = this.route.snapshot.paramMap.get('gameId') ?? '';
    if (this.gameId) {
      this.gameStateService.connectToGame(this.gameId);
    }
  }

  ngOnDestroy(): void {
    this.gameStateService.disconnect();
  }

  sendGameCommand(commandId: string): void {
    this.webSocketService.sendCommand({
      commandId: commandId as any,
      gameId: this.gameId,
    });
  }

  buyIn(): void {
    if (this.buyInAmount > 0) {
      this.webSocketService.sendCommand({
        commandId: 'buy-in',
        gameId: this.gameId,
        amount: LangUtils.asCents(this.buyInAmount),
      });
    }
  }

  leaveGame(): void {
    this.webSocketService.sendCommand({
      commandId: 'leave-game',
      gameId: this.gameId,
    });
    this.router.navigate(['/home']);
  }

  navigateToTable(tableId: string): void {
    this.router.navigate(['/game', this.gameId, 'table', tableId]);
  }

  getPlayersArray(players: Map<string, PlayerState>): PlayerState[] {
    return Array.from(players.values()).sort((a, b) => b.chipCount - a.chipCount);
  }

  getTablesArray(tables: Map<string, TableState>): TableState[] {
    return Array.from(tables.values());
  }

  formatChips(cents: number): string {
    return LangUtils.formatCurrency(cents);
  }

  getStatusBadgeClass(status: GameStatus | null): string {
    switch (status) {
      case 'ACTIVE': return 'badge-success';
      case 'PAUSED': return 'badge-warning';
      case 'SEATING': return 'badge-info';
      case 'SCHEDULED': return 'badge-neutral';
      case 'COMPLETED': return 'badge-ghost';
      default: return 'badge-neutral';
    }
  }

  getConnectionBadgeClass(status: ConnectionStatus): string {
    switch (status) {
      case 'connected': return 'badge-success';
      case 'connecting': return 'badge-warning';
      case 'error': return 'badge-error';
      default: return 'badge-neutral';
    }
  }
}
