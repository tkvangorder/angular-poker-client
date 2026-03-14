import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CashGameService } from '../../../game/cash-game.service';
import { CashGameDetails, GameStatus } from '../../../game/game-models';
import { UserService } from '../../../user/user-service';
import { ToasterService } from '../../../toaster/toaster.service';
import { LangUtils } from '../../../lib/lang.utils';

@Component({
    selector: 'app-cash-game-details',
    imports: [CommonModule],
    templateUrl: './cash-game-details.component.html'
})
export class CashGameDetailsComponent {
  private cashGameService = inject(CashGameService);
  private userService = inject(UserService);
  private toasterService = inject(ToasterService);
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
    this.cashGameService.registerForGame(game.id).subscribe({
      error: (err) => this.toasterService.displayToast({ message: err.message, type: 'error' }),
    });
  }

  unregister(game: CashGameDetails): void {
    this.cashGameService.unregisterFromGame(game.id).subscribe({
      error: (err) => this.toasterService.displayToast({ message: err.message, type: 'error' }),
    });
  }

  joinGame(game: CashGameDetails): void {
    this.router.navigate(['/game', game.id]);
  }

  statusBadgeClass(status: GameStatus): string {
    switch (status) {
      case 'ACTIVE':
      case 'SEATING':
        return 'badge-success';
      case 'SCHEDULED':
        return 'badge-info';
      case 'PAUSED':
      case 'BALANCING':
        return 'badge-warning';
      case 'COMPLETED':
        return 'badge-ghost';
      default:
        return 'badge-ghost';
    }
  }

  statusLabel(status: GameStatus): string {
    return status.charAt(0) + status.slice(1).toLowerCase();
  }

  playerInitials(player: { user?: { alias?: string; name?: string } }): string {
    const name = player.user?.alias || player.user?.name || '?';
    return name.substring(0, 2).toUpperCase();
  }
}
