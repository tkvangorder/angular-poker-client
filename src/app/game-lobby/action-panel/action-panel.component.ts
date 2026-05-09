import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlayerAction } from '../../game/game-commands';
import { TableState } from '../../game/game-state.service';
import { LangUtils } from '../../lib/lang.utils';

@Component({
  selector: 'app-action-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './action-panel.component.html',
})
export class ActionPanelComponent implements OnChanges {
  @Input() tableState: TableState | null = null;
  @Input() playerChipCount: number = 0;
  @Input() seatPosition: number | null = null;

  @Output() playerAction = new EventEmitter<PlayerAction>();

  betAmount: number = 0;
  minBet: number = 0;
  maxBet: number = 0;
  step: number = 0;

  get isMyTurn(): boolean {
    return (
      this.tableState != null &&
      this.seatPosition != null &&
      this.tableState.actionPosition === this.seatPosition
    );
  }

  get isBettingPhase(): boolean {
    const phase = this.tableState?.phase;
    return (
      phase === 'PRE_FLOP_BETTING' ||
      phase === 'FLOP_BETTING' ||
      phase === 'TURN_BETTING' ||
      phase === 'RIVER_BETTING'
    );
  }

  /** True when this seat owes chips to match the current bet. False when the seat has already
   *  matched (e.g. BB after SB calls) — in that case Check is the correct action. */
  get hasBetToCall(): boolean {
    return this.callAmount > 0;
  }

  get callAmount(): number {
    return this.tableState?.callAmount ?? 0;
  }

  /** True when there is an outstanding bet on the table (open or matched). Discriminates
   *  Raise from Bet — independent of whether *this* seat still owes chips. */
  get hasOpenBet(): boolean {
    return (this.tableState?.currentBet ?? 0) > 0;
  }

  get totalPot(): number {
    if (!this.tableState?.pots) return 0;
    return this.tableState.pots.reduce((sum, p) => sum + p.amount, 0);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tableState'] || changes['playerChipCount']) {
      this.recalculateBetRange();
    }
  }

  fold(): void {
    this.playerAction.emit({ type: 'fold' });
  }

  checkOrCall(): void {
    if (this.hasBetToCall) {
      this.playerAction.emit({ type: 'call', amount: this.callAmount });
    } else {
      this.playerAction.emit({ type: 'check' });
    }
  }

  submitBet(): void {
    if (this.hasOpenBet) {
      this.playerAction.emit({ type: 'raise', amount: this.betAmount });
    } else {
      this.playerAction.emit({ type: 'bet', amount: this.betAmount });
    }
  }

  setHalfPot(): void {
    const half = Math.floor(this.totalPot / 2);
    this.betAmount = this.clampBet(half);
  }

  setFullPot(): void {
    this.betAmount = this.clampBet(this.totalPot);
  }

  allIn(): void {
    this.betAmount = this.maxBet;
  }

  formatCents(cents: number): string {
    return LangUtils.formatCurrency(cents);
  }

  private recalculateBetRange(): void {
    const ts = this.tableState;
    if (!ts) return;

    this.step = ts.bigBlindAmount || 1;

    if (this.hasOpenBet) {
      // Raise: minimum raise amount, capped at player's stack
      this.minBet = ts.minimumRaise || ts.currentBet * 2;
    } else {
      // Open bet: minimum is the big blind
      this.minBet = ts.bigBlindAmount || 1;
    }

    this.maxBet = this.playerChipCount;
    this.minBet = Math.min(this.minBet, this.maxBet);
    this.betAmount = this.clampBet(this.minBet);
  }

  private clampBet(value: number): number {
    return Math.max(this.minBet, Math.min(value, this.maxBet));
  }
}
