import { User } from '../user/user-models';

export type GameStatus = 'SCHEDULED' | 'SEATING' | 'ACTIVE' | 'BALANCING' | 'PAUSED' | 'COMPLETED';

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
  name?: string;
  statuses?: GameStatus[];
  startTime?: string;
  endTime?: string;
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
  startTime: string;
  endTime: string | undefined;
  owner: User;
  players: Map<string, Player>;
  tables: Table[];
}

export interface CashGameConfiguration {
  name: string | undefined;
  gameType: GameType | undefined;
  startTime: Date;
  maxBuyIn: number;
  smallBlind: number;
  bigBlind: number;
}

export interface CashGameDetails {
  id: string;
  name: string;
  type: GameType;
  status: GameStatus;
  startTime: string;
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
    public startTime: string,
    public endTime: string | undefined,
    public players: Map<string, Player>,
    public tables: Table[],
    public smallBlind: number,
    public bigBlind: number,
    public maxBuyIn: number
  ) {}
}
