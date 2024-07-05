import { Component } from '@angular/core';
import { CashTableComponent } from './cash-table/cash-table.component';

@Component({
  selector: 'app-game-page',
  standalone: true,
  templateUrl: './game-page.component.html',
  styleUrl: './game-page.component.css',
  imports: [CashTableComponent],
})
export class GamePageComponent {}
