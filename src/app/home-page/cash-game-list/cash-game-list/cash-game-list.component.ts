import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CashGameService } from '../../../game/cash-game.service';
import { CashGameDetails } from '../../../game/game-models';
import { LangUtils } from '../../../lib/lang.utils';
import { UserService } from '../../../user/user-service';

@Component({
    selector: 'app-cash-game-list',
    imports: [CommonModule],
    templateUrl: './cash-game-list.component.html'
})
export class CashGameListComponent {
  private cashGameService = inject(CashGameService);
  private userService = inject(UserService);

  games$ = this.cashGameService.getGames();
  selectedGame$ = this.cashGameService.getSelectedGame();

  selectGame(game: CashGameDetails): void {
    this.cashGameService.selectGame(game);
  }

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
}
