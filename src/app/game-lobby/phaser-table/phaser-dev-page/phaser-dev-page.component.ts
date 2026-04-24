import { Component } from '@angular/core';
import { PhaserTableComponent } from '../phaser-table.component';
import { TableState, PlayerState } from '../../../game/game-state.service';
import { CardSuit, CardValue } from '../../../poker/poker-models';

@Component({
  selector: 'app-phaser-dev-page',
  standalone: true,
  imports: [PhaserTableComponent],
  template: `
    <div class="w-screen h-screen bg-neutral-900 p-4">
      <div class="w-full h-full">
        <app-phaser-table
          [tableState]="tableState"
          [players]="players"
          [currentUserId]="currentUserId"
        />
      </div>
    </div>
  `,
})
export class PhaserDevPageComponent {
  readonly currentUserId = 'user-1';

  readonly players: PlayerState[] = [
    { userId: 'user-1', displayName: 'You', chipCount: 24000, tableId: 't1', seatPosition: 1 },
    { userId: 'user-2', displayName: 'Sam', chipCount: 18000, tableId: 't1', seatPosition: 2 },
    { userId: 'user-3', displayName: 'Ari', chipCount: 30000, tableId: 't1', seatPosition: 3 },
    { userId: 'user-4', displayName: 'Jay', chipCount: 22000, tableId: 't1', seatPosition: 4 },
    { userId: 'user-5', displayName: 'Kim', chipCount: 42000, tableId: 't1', seatPosition: 5 },
    { userId: 'user-6', displayName: 'Lee', chipCount: 51000, tableId: 't1', seatPosition: 6 },
  ];

  readonly tableState: TableState = {
    tableId: 't1',
    tableStatus: 'PLAYING',
    handNumber: 42,
    dealerPosition: 1,
    smallBlindPosition: 2,
    bigBlindPosition: 3,
    smallBlindAmount: 100,
    bigBlindAmount: 200,
    communityCards: [
      { value: CardValue.ACE, suit: CardSuit.HEART },
      { value: CardValue.KING, suit: CardSuit.SPADE },
      { value: CardValue.QUEEN, suit: CardSuit.DIAMOND },
    ],
    pots: [{ amount: 1200, seatPositions: [1, 2, 3, 4, 5, 6] }],
    potTotal: 1200,
    phase: 'FLOP',
    potResults: null,
    seatCards: new Map([
      [1, [
        { card: { value: CardValue.ACE, suit: CardSuit.HEART }, showCard: true },
        { card: { value: CardValue.KING, suit: CardSuit.SPADE }, showCard: true },
      ]],
      [2, [
        { card: { value: CardValue.TWO, suit: CardSuit.SPADE }, showCard: false },
        { card: { value: CardValue.TWO, suit: CardSuit.SPADE }, showCard: false },
      ]],
    ]),
    seatSummaries: new Map([
      [1, { seatPosition: 1, userId: 'user-1', status: 'ACTIVE', chipCount: 24000, currentBetAmount: 0 }],
      [2, { seatPosition: 2, userId: 'user-2', status: 'ACTIVE', chipCount: 18000, currentBetAmount: 500 }],
      [3, { seatPosition: 3, userId: 'user-3', status: 'ACTIVE', chipCount: 30000, currentBetAmount: 0 }],
      [4, { seatPosition: 4, userId: 'user-4', status: 'ACTIVE', chipCount: 22000, currentBetAmount: 1000 }],
      [5, { seatPosition: 5, userId: 'user-5', status: 'ACTIVE', chipCount: 42000, currentBetAmount: 0 }],
      [6, { seatPosition: 6, userId: 'user-6', status: 'ACTIVE', chipCount: 51000, currentBetAmount: 2000 }],
    ]),
    lastAction: null,
    actionPosition: 3,
    actionDeadline: new Date(Date.now() + 18000).toISOString(),
    callAmount: 500,
    currentBet: 500,
    minimumRaise: 200,
  };
}
