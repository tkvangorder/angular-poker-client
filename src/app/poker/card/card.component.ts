import { Component, ElementRef, Input, OnInit, inject } from '@angular/core';
import { CardSuitString, CardValueString } from '../poker-models';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { CardService } from './card.service';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css',
})
export class CardComponent implements OnInit {
  @Input()
  public cardValue?: CardValueString;

  @Input()
  public cardSuit?: CardSuitString;

  @Input()
  public isHidden: boolean = false;

  @Input()
  public onlyShowTop: boolean = false;

  private cardService = inject(CardService);
  private elementRef = inject(ElementRef);

  ngOnInit(): void {
    let cardImage$: Observable<SVGElement>;
    if (this.onlyShowTop) {
      if (this.isHidden) {
        cardImage$ = this.cardService.getTopCardImage('hidden');
      } else if (this.cardValue && this.cardSuit) {
        cardImage$ = this.cardService.getTopCardImage(
          this.cardValue,
          this.cardSuit
        );
      } else {
        cardImage$ = this.cardService.getTopCardImage('blank');
      }
      cardImage$.subscribe((cardSvg) => {
        this.elementRef.nativeElement.appendChild(cardSvg);
      });
    } else {
      if (this.isHidden) {
        cardImage$ = this.cardService.getCardImage('hidden');
      } else if (this.cardValue && this.cardSuit) {
        cardImage$ = this.cardService.getCardImage(
          this.cardValue,
          this.cardSuit
        );
      } else {
        cardImage$ = this.cardService.getCardImage('blank');
      }
      cardImage$.subscribe((cardSvg) => {
        this.elementRef.nativeElement.appendChild(cardSvg);
      });
    }
  }
}
