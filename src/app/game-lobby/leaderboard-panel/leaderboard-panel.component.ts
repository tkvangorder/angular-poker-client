import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlayerState } from '../../game/game-state.service';
import { LangUtils } from '../../lib/lang.utils';

@Component({
  selector: 'app-leaderboard-panel',
  imports: [CommonModule, FormsModule],
  templateUrl: './leaderboard-panel.component.html',
})
export class LeaderboardPanelComponent {
  @Input() players: PlayerState[] = [];
  @Input() currentUserId: string = '';
  @Input() showBuyIn = true;
  @Input() maxBuyIn: number = 0;
  @Output() buyIn = new EventEmitter<number>();
  @Output() joinGame = new EventEmitter<void>();

  buyInAmount: number | null = null;

  get isRegistered(): boolean {
    return this.players.some(p => p.userId === this.currentUserId);
  }

  get maxBuyInDollars(): number {
    return this.maxBuyIn / 100;
  }

  setMaxBuyIn(): void {
    this.buyInAmount = this.maxBuyInDollars;
  }

  onJoinGame(): void {
    this.joinGame.emit();
  }

  onBuyIn(): void {
    if (this.buyInAmount && this.buyInAmount > 0) {
      this.buyIn.emit(this.buyInAmount);
      this.buyInAmount = null;
    }
  }

  formatChips(cents: number): string {
    return LangUtils.formatCurrency(cents);
  }
}
