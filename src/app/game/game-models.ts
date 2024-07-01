import { User } from '../user/user-models';

export enum GameStatus {
  'ACTIVE',
  'COMPLETED',
  'PAUSED',
  'SCHEDULED',
}

export enum GameFormat {
  'CASH',
  'TOURNAMENT',
}
export enum GameType {
  'TEXAS_HOLDEM',
}

export type PlayerStatus =
  | 'ACTIVE'
  | 'OUT'
  | 'AWAY'
  | 'REGISTERED'
  | 'OBSERVER';

export interface GameCriteria {
  name: string;
  status: GameStatus;
  startDate: Date;
  endDate: Date;
}

export interface Player {
  user: User;
  confirmed: boolean;
  status: PlayerStatus;
  chipCount: number;
}
export interface Table {}

export interface Game {
  id: string;
  name: string;
  status: GameStatus;
  format: GameFormat;
  type: GameType;
  startTimestamp: Date;
  endTimestamp: Date | undefined;
  owner: User;
  players: Map<string, Player>;
  tables: Table[];
}

export interface CashGameConfiguration {
  name: string | undefined;
  gameType: GameType | undefined;
  startTimestamp: Date;
  maxBuyIn: number;
  smallBlind: number;
  bigBlind: number;
}

export interface CashGameDetails {
  id: string;
  name: string;
  gameType: GameType;
  startTimestamp: Date;
  maxBuyIn: number;
  owner: User;
  smallBlind: number;
  bigBlind: number;
  players: Player[];
}

export class CashGame implements Game {
  public readonly format = GameFormat.CASH;

  constructor(
    public id: string,
    public name: string,
    public status: GameStatus,
    public type: GameType,
    public owner: User,
    public startTimestamp: Date,
    public endTimestamp: Date | undefined,
    public players: Map<string, Player>,
    public tables: Table[],
    public smallBlind: number,
    public bigBlind: number,
    public maxBuyIn: number
  ) {}
}
