import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, formatDate } from '@angular/common';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import {
  Modal,
  ModalComponent,
  ModalOptions,
} from '../../../modal/modal.component';
import { ModalService } from '../../../modal/modal.service';
import { UserService } from '../../../user/user-service';
import { ValidationError } from '../../../error-handling/error-models';
import { CashGameService } from '../../../game/cash-game.service';
import { GameType } from '../../../game/game-models';
import { CalendarUtils } from '../../../lib/calendar-utils';

@Component({
  selector: 'app-create-cash-game-dialog',
  standalone: true,
  templateUrl: './create-cash-game-dialog.component.html',
  imports: [ModalComponent, ReactiveFormsModule],
})
export class CreateCashGameDialogComponent implements Modal {
  modalOptions: ModalOptions = {
    id: 'create-cash-game',
    title: 'Create Cash Game',
    buttons: [
      { label: 'Create Game', type: 'submit' },
      { label: 'Cancel', type: 'cancel' },
    ],
  };

  gameConfigurationForm: FormGroup;

  public error: string | undefined;

  constructor(
    private modalService: ModalService,
    private router: Router,
    private userService: UserService,
    private cashGameService: CashGameService
  ) {
    const currentDate = new Date();

    this.gameConfigurationForm = new FormGroup({
      name: new FormControl(''),
      gameType: new FormControl("Texas Hold'em"),
      startDate: new FormControl(formatDate(currentDate, 'yyyy-MM-dd', 'en')),
      startTime: new FormControl(formatDate(currentDate, 'HH:mm', 'en')),
      buyIn: new FormControl(''),
      smallBlind: new FormControl(''),
      bigBlind: new FormControl(''),
    });
  }

  createGame() {
    const gameDetails = this.cashGameService
      .createGame({
        name: this.gameConfigurationForm.value.name ?? undefined,
        gameType: this.stringToType(
          this.gameConfigurationForm.value.gameType ?? undefined
        ),
        startTimestamp: CalendarUtils.combineDateTime(
          this.gameConfigurationForm.value.startDate ?? undefined,
          this.gameConfigurationForm.value.startTime ?? undefined
        ),
        buyInAmount: this.gameConfigurationForm.value.buyIn ?? undefined,
        smallBlind: this.gameConfigurationForm.value.smallBlind ?? undefined,
        bigBlind: this.gameConfigurationForm.value.bigBlind ?? undefined,
      })
      .pipe(
        catchError((error: ValidationError) => {
          this.error = error.message;
          return throwError(() => error);
        })
      )
      .subscribe({
        next: (user) => {
          this.modalService.close(this);
        },
      });
  }

  stringToType(gameType: string | undefined): GameType {
    switch (gameType) {
      case "Texas Hold'em":
        return GameType.TEXAS_HOLDEM;
      default:
        return GameType.TEXAS_HOLDEM;
    }
  }
}
