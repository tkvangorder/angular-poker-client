import { Component } from '@angular/core';
import { CardComponent } from '../../poker/card/card.component';

@Component({
  selector: 'app-cash-table',
  standalone: true,
  templateUrl: './cash-table.component.html',
  styleUrl: './cash-table.component.css',
  imports: [CardComponent],
})
export class CashTableComponent {}
