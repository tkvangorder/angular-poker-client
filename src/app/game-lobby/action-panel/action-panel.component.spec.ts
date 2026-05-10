import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SimpleChange } from '@angular/core';

import {
  ActionPanelComponent,
  STEP_UNIT_STORAGE_KEY,
} from './action-panel.component';
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
    localStorage.clear();
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

  describe('preset bet sizing', () => {
    it('Min snaps to the minimum allowed bet', () => {
      const ts = tableState({ currentBet: 50, callAmount: 25, minimumRaise: 100 });
      setInputs(fixture, cmp, ts, 1000, 2);
      cmp.setMin();
      expect(cmp.betAmount).toBe(100);
    });

    it('½ Pot snaps to half the total pot, clamped to legal range', () => {
      const ts = tableState({
        phase: 'FLOP_BETTING',
        currentBet: 0,
        callAmount: 0,
        pots: [{ amount: 400, seatPositions: [2, 3] }],
        minimumRaise: 50,
      });
      setInputs(fixture, cmp, ts, 1000, 3);
      cmp.setHalfPot();
      expect(cmp.betAmount).toBe(200);
    });

    it('Pot snaps to the full pot, clamped to legal range', () => {
      const ts = tableState({
        phase: 'FLOP_BETTING',
        currentBet: 0,
        callAmount: 0,
        pots: [{ amount: 300, seatPositions: [2, 3] }],
        minimumRaise: 50,
      });
      setInputs(fixture, cmp, ts, 1000, 3);
      cmp.setFullPot();
      expect(cmp.betAmount).toBe(300);
    });

    it('Max snaps to the player chip count (all-in)', () => {
      const ts = tableState({ currentBet: 50, callAmount: 25, minimumRaise: 100 });
      setInputs(fixture, cmp, ts, 750, 2);
      cmp.setMax();
      expect(cmp.betAmount).toBe(750);
    });
  });

  describe('slider step unit toggle', () => {
    it('defaults to BB step', () => {
      const ts = tableState({ smallBlindAmount: 25, bigBlindAmount: 50 });
      setInputs(fixture, cmp, ts, 1000, 3);
      expect(cmp.stepUnit).toBe('BB');
      expect(cmp.step).toBe(50);
    });

    it('switches step to small blind on toggle', () => {
      const ts = tableState({ smallBlindAmount: 25, bigBlindAmount: 50 });
      setInputs(fixture, cmp, ts, 1000, 3);
      cmp.toggleStepUnit();
      expect(cmp.stepUnit).toBe('SB');
      expect(cmp.step).toBe(25);
    });

    it('persists the step unit choice across sessions', () => {
      const ts = tableState({ smallBlindAmount: 25, bigBlindAmount: 50 });
      setInputs(fixture, cmp, ts, 1000, 3);
      cmp.toggleStepUnit();
      expect(localStorage.getItem(STEP_UNIT_STORAGE_KEY)).toBe('SB');

      // New component instance — should pick up the saved preference.
      const fixture2 = TestBed.createComponent(ActionPanelComponent);
      const cmp2 = fixture2.componentInstance;
      cmp2.tableState = ts;
      cmp2.playerChipCount = 1000;
      cmp2.seatPosition = 3;
      fixture2.detectChanges();
      expect(cmp2.stepUnit).toBe('SB');
    });
  });
});
