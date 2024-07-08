import { Injectable, inject } from '@angular/core';
import { SvgLoaderService } from '../../lib/svg-loader.service';
import { Observable, map } from 'rxjs';
import { CardValueString } from '../poker-models';

@Injectable({
  providedIn: 'root',
})
export class CardService {
  private svgLoader = inject(SvgLoaderService);

  getCardImage(
    cardValue: CardValueString | 'hidden' | 'blank',
    cardSuit?: string
  ): Observable<SVGElement> {
    let card$: Observable<SVGElement>;
    if (cardValue === 'hidden') {
      card$ = this.svgLoader.loadSvg('/assets/cards/back_2.svg');
    } else if (cardValue === 'blank') {
      card$ = this.svgLoader.loadSvg('/assets/cards/blank_card.svg');
    } else if (!cardSuit) {
      throw new Error('Card suit must be provided');
    }
    const url = `/assets/cards/fronts/${cardSuit?.toLowerCase()}_${cardValue.toLowerCase()}.svg`;
    card$ = this.svgLoader.loadSvg(url);
    return card$.pipe(
      map((card) => {
        this.applyCardStyles(card);
        return card;
      })
    );
  }

  getTopCardImage(
    cardValue: CardValueString | 'hidden' | 'blank',
    cardSuit?: string
  ): Observable<SVGElement> {
    return this.getCardImage(cardValue, cardSuit).pipe(
      map((card) => {
        card.setAttribute('viewBox', '-120 -168 240 100');
        card.setAttribute('viewPort', '-120 -168 240 100');
        card.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        return card;
      })
    );
  }

  applyCardStyles(card: SVGElement) {
    card.style.width = '100%';
    card.style.height = '100%';
  }
}
