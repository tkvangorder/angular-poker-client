import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CashGameService } from '../../../game/cash-game.service';
import { CashGameDetails, GameStatus } from '../../../game/game-models';
import { UserService } from '../../../user/user-service';
import { LangUtils } from '../../../lib/lang.utils';

@Component({
    selector: 'app-cash-game-details',
    imports: [CommonModule],
    templateUrl: './cash-game-details.component.html'
})
export class CashGameDetailsComponent {
  private cashGameService = inject(CashGameService);
  private userService = inject(UserService);
  private router = inject(Router);

  selectedGame$ = this.cashGameService.getSelectedGame();

  formatBlinds(game: CashGameDetails): string {
    return `${LangUtils.formatCurrency(game.smallBlind)}/${LangUtils.formatCurrency(game.bigBlind)}`;
  }

  formatBuyIn(game: CashGameDetails): string {
    return LangUtils.formatCurrency(game.maxBuyIn);
  }

  isRegistered(game: CashGameDetails): boolean {
    const user = this.userService.getCurrentUser();
    if (!user?.loginId || !game.players) return false;
    return game.players.some((p) => p.user?.loginId === user.loginId);
  }

  canJoin(game: CashGameDetails): boolean {
    return this.isRegistered(game);
  }

  register(game: CashGameDetails): void {
    this.cashGameService.registerForGame(game.id).subscribe();
  }

  unregister(game: CashGameDetails): void {
    this.cashGameService.unregisterFromGame(game.id).subscribe();
  }

  joinGame(game: CashGameDetails): void {
    this.router.navigate(['/game', game.id]);
  }
}
