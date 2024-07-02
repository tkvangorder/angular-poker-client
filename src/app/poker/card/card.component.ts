import { Component, Input } from '@angular/core';
import { CardSuit, CardValue } from '../poker-models';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css',
})
export class CardComponent {
  @Input()
  public cardValue?:
    | '2'
    | '3'
    | '4'
    | '5'
    | '6'
    | '7'
    | '8'
    | '9'
    | '10'
    | 'JACK'
    | 'QUEEN'
    | 'KING'
    | 'ACE';
  @Input()
  public cardSuit?: 'HEARTS' | 'DIAMONDS' | 'CLUBS' | 'SPADES';
  @Input()
  public isHidden: boolean = false;

  computeCardImage(): string {
    if (this.isHidden) {
      return "url('../../../assets/cards/back_2.svg')";
    } else if (this.cardValue && this.cardSuit) {
      const url = `url('../../../assets/cards/fronts/${this.cardSuit.toLowerCase()}_${this.cardValue.toLowerCase()}.svg')`;
      console.log(url);
      return `url(\'../../../assets/cards/fronts/${this.cardSuit.toLowerCase()}_${this.cardValue.toLowerCase()}.svg\')`;
    } else {
      return "url('../../../assets/cards/blank_card.svg')";
    }
  }
}
