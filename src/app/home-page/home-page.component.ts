import { Component, inject } from '@angular/core';
import { CashGameDetailsComponent } from './cash-game-details/cash-game-details/cash-game-details.component';
import { CashGameListComponent } from './cash-game-list/cash-game-list/cash-game-list.component';
import { UserService } from '../user/user-service';
import { ModalService } from '../modal/modal.service';
import { CreateCashGameDialogComponent } from './create-cash-game-dialog/create-cash-game-dialog/create-cash-game-dialog.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  templateUrl: './home-page.component.html',
  imports: [CashGameDetailsComponent, CashGameListComponent],
})
export class HomePageComponent {
  private userService = inject(UserService);
  private modalService = inject(ModalService);

  openCreateCashGameModal() {
    this.modalService.openDialog(CreateCashGameDialogComponent);
  }
}
