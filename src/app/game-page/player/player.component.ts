import { Component } from '@angular/core';
import { CardComponent } from '../../poker/card/card.component';

@Component({
  selector: 'app-player',
  standalone: true,
  templateUrl: './player.component.html',
  styleUrl: './player.component.css',
  imports: [CardComponent],
})
export class PlayerComponent {}
