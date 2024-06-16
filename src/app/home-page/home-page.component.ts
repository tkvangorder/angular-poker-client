import { Component } from '@angular/core';
import { CashGameDetailsComponent } from './cash-game-details/cash-game-details/cash-game-details.component';
import { CashGameListComponent } from './cash-game-list/cash-game-list/cash-game-list.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  templateUrl: './home-page.component.html',
  imports: [CashGameDetailsComponent, CashGameListComponent],
})
export class HomePageComponent {}
