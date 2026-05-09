import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SimpleChange } from '@angular/core';

import { ActionPanelComponent } from './action-panel.component';
import { TableState } from '../../game/game-state.service';
import { PlayerAction } from '../../game/game-commands';

function tableState(overrides: Partial<TableState>): TableState {
  return {
    tableId: 't',
    tableStatus: 'PLAYING',
    handNumber: 1,
    dealerPosition: 1,
    smallBlindPosition: 2,
    bigBlindPosition: 3,
    smallBlindAmount: 25,
    bigBlindAmount: 50,
    communityCards: [],
    pots: [],
    potTotal: 0,
    phase: 'PRE_FLOP_BETTING',
    potResults: null,
    seatCards: new Map(),
    seatSummaries: new Map(),
    lastAction: null,
    actionPosition: 3,
    actionDeadline: null,
    callAmount: 0,
    currentBet: 50,
    minimumRaise: 50,
    ...overrides,
  };
}

function setInputs(
  fixture: ComponentFixture<ActionPanelComponent>,
  cmp: ActionPanelComponent,
  ts: TableState,
  chips: number,
  seat: number
): void {
  cmp.tableState = ts;
  cmp.playerChipCount = chips;
  cmp.seatPosition = seat;
  cmp.ngOnChanges({
    tableState: new SimpleChange(null, ts, true),
    playerChipCount: new SimpleChange(null, chips, true),
  });
  fixture.detectChanges();
}

describe('ActionPanelComponent', () => {
  let fixture: ComponentFixture<ActionPanelComponent>;
  let cmp: ActionPanelComponent;
  let emitted: PlayerAction[];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActionPanelComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(ActionPanelComponent);
    cmp = fixture.componentInstance;
    emitted = [];
    cmp.playerAction.subscribe((a) => emitted.push(a));
  });

  describe('BB option to check after SB calls (the reported bug)', () => {
    it('hasBetToCall is false when this seat already matched the bet', () => {
      // BB seat: currentBet=50, this seat's currentBetAmount=50, so callAmount=0.
      const ts = tableState({ currentBet: 50, callAmount: 0, actionPosition: 3 });
      setInputs(fixture, cmp, ts, 1000, 3);
      expect(cmp.hasBetToCall).toBe(false);
    });

    it('still labels the second action button "Raise" because there is an open bet', () => {
      const ts = tableState({ currentBet: 50, callAmount: 0, actionPosition: 3 });
      setInputs(fixture, cmp, ts, 1000, 3);
      expect(cmp.hasOpenBet).toBe(true);
    });

    it('emits a check action when the call button is clicked', () => {
      const ts = tableState({ currentBet: 50, callAmount: 0, actionPosition: 3 });
      setInputs(fixture, cmp, ts, 1000, 3);
      cmp.checkOrCall();
      expect(emitted).toEqual([{ type: 'check' }]);
    });

    it('emits a raise (not a bet) when submitBet is clicked, since there is an open bet', () => {
      const ts = tableState({ currentBet: 50, callAmount: 0, actionPosition: 3 });
      setInputs(fixture, cmp, ts, 1000, 3);
      cmp.betAmount = 100;
      cmp.submitBet();
      expect(emitted).toEqual([{ type: 'raise', amount: 100 }]);
    });
  });

  describe('Outstanding call', () => {
    it('emits a call with the seat-specific amount, not the table currentBet', () => {
      // SB seat: currentBet=50, SB has 25 in, owes 25 to call.
      const ts = tableState({ currentBet: 50, callAmount: 25, actionPosition: 2 });
      setInputs(fixture, cmp, ts, 1000, 2);
      expect(cmp.hasBetToCall).toBe(true);
      expect(cmp.callAmount).toBe(25);
      cmp.checkOrCall();
      expect(emitted).toEqual([{ type: 'call', amount: 25 }]);
    });
  });

  describe('No bet on table', () => {
    it('shows Check + Bet (not Raise) and emits bet on submit', () => {
      // Post-flop, no one has bet yet.
      const ts = tableState({
        phase: 'FLOP_BETTING',
        currentBet: 0,
        callAmount: 0,
        minimumRaise: 50,
        actionPosition: 3,
      });
      setInputs(fixture, cmp, ts, 1000, 3);
      expect(cmp.hasBetToCall).toBe(false);
      expect(cmp.hasOpenBet).toBe(false);
      cmp.checkOrCall();
      expect(emitted).toEqual([{ type: 'check' }]);

      emitted.length = 0;
      cmp.betAmount = 200;
      cmp.submitBet();
      expect(emitted).toEqual([{ type: 'bet', amount: 200 }]);
    });
  });
});
