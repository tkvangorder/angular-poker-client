/**
 * Game events received from the server via WebSocket.
 * All events use `eventType` as the discriminator (kebab-case).
 */

import { Card } from '../poker/poker-models';
import { GameStatus, HandPhase, Player, SeatCard, Table } from './game-models';
import { PlayerAction } from './game-commands';

// --- Game-Level Events ---

export type MessageSeverity = 'INFO' | 'WARNING' | 'ERROR';

export { HandPhase, SeatCard };

export interface GameStatusChangedEvent {
  eventType: 'game-status-changed';
  timestamp: string;
  gameId: string;
  oldStatus: GameStatus;
  newStatus: GameStatus;
}

export interface GameMessageEvent {
  eventType: 'game-message';
  timestamp: string;
  gameId: string;
  message: string;
}

export interface PlayerBuyInEvent {
  eventType: 'player-buy-in';
  timestamp: string;
  gameId: string;
  userId: string;
  amount: number;
  newChipCount: number;
}

export interface PlayerJoinedEvent {
  eventType: 'player-joined';
  timestamp: string;
  gameId: string;
  userId: string;
}

export interface PlayerSeatedEvent {
  eventType: 'player-seated';
  timestamp: string;
  gameId: string;
  userId: string;
  tableId: string;
}

export interface PlayerMovedEvent {
  eventType: 'player-moved';
  timestamp: string;
  gameId: string;
  userId: string;
  fromTableId: string | null;
  toTableId: string;
}

// --- Table-Level Events ---

export interface HandStartedEvent {
  eventType: 'hand-started';
  timestamp: string;
  gameId: string;
  tableId: string;
  handNumber: number;
  dealerPosition: number;
  smallBlindPosition: number;
  bigBlindPosition: number;
  smallBlindAmount: number;
  bigBlindAmount: number;
}


export interface HoleCardsDealtEvent {
  eventType: 'hole-cards-dealt';
  timestamp: string;
  gameId: string;
  tableId: string;
  userId: string;
  seatPosition: number;
  cards: SeatCard[];
}

export interface CommunityCardsDealtEvent {
  eventType: 'community-cards-dealt';
  timestamp: string;
  gameId: string;
  tableId: string;
  cards: Card[];
  phase: string;
}

export interface PlayerActedEvent {
  eventType: 'player-acted';
  timestamp: string;
  gameId: string;
  tableId: string;
  seatPosition: number;
  userId: string;
  action: PlayerAction;
  chipCount: number;
}

export interface PlayerTimedOutEvent {
  eventType: 'player-timed-out';
  timestamp: string;
  gameId: string;
  tableId: string;
  seatPosition: number;
  userId: string;
  defaultAction: PlayerAction;
}

export interface PotInfo {
  potIndex: number;
  potAmount: number;
}

export interface BettingRoundCompleteEvent {
  eventType: 'betting-round-complete';
  timestamp: string;
  gameId: string;
  tableId: string;
  completedPhase: HandPhase;
  pots: PotInfo[];
}

export interface Winner {
  seatPosition: number;
  userId: string;
  amount: number;
  handDescription: string;
}

export interface PotResult {
  potIndex: number;
  potAmount: number;
  winners: Winner[];
}

export interface ShowdownResultEvent {
  eventType: 'showdown-result';
  timestamp: string;
  gameId: string;
  tableId: string;
  potResults: PotResult[];
}

export interface HandCompleteEvent {
  eventType: 'hand-complete';
  timestamp: string;
  gameId: string;
  tableId: string;
  handNumber: number;
}

// --- User Events ---

export interface UserMessageEvent {
  eventType: 'user-message';
  timestamp: string;
  userId: string;
  severity: MessageSeverity;
  message: string;
}

// --- Snapshot Events ---

export interface GameSnapshotEvent {
  eventType: 'game-snapshot';
  timestamp: string;
  userId: string;
  gameId: string;
  gameName: string;
  status: GameStatus;
  startTime: string;
  smallBlind: number;
  bigBlind: number;
  players: Player[];
  tableIds: string[];
}

export interface TableSnapshotEvent {
  eventType: 'table-snapshot';
  timestamp: string;
  userId: string;
  gameId: string;
  table: Table;
}

// --- Discriminated Union ---

export type GameEvent =
  | GameStatusChangedEvent
  | GameMessageEvent
  | PlayerJoinedEvent
  | PlayerSeatedEvent
  | PlayerBuyInEvent
  | PlayerMovedEvent
  | HandStartedEvent
  | HoleCardsDealtEvent
  | CommunityCardsDealtEvent
  | PlayerActedEvent
  | PlayerTimedOutEvent
  | BettingRoundCompleteEvent
  | ShowdownResultEvent
  | HandCompleteEvent
  | UserMessageEvent
  | GameSnapshotEvent
  | TableSnapshotEvent;
