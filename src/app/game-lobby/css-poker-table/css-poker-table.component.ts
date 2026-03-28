import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule, CurrencyPipe, NgClass } from '@angular/common';
import { TableState, PlayerState } from '../../game/game-state.service';
import { CardSuit, CardValue } from '../../poker/poker-models';
import { SeatCard } from '../../game/game-models';

const MAX_SEATS = 9;
const MAX_COMMUNITY_CARDS = 5;

const SUIT_SYMBOLS: Record<string, string> = {
  [CardSuit.HEARTS]: '\u2665',
  [CardSuit.DIAMONDS]: '\u2666',
  [CardSuit.CLUBS]: '\u2663',
  [CardSuit.SPADES]: '\u2660',
};

const SUIT_COLORS: Record<string, string> = {
  [CardSuit.HEARTS]: '#e74c3c',
  [CardSuit.DIAMONDS]: '#3498db',
  [CardSuit.CLUBS]: '#2ecc71',
  [CardSuit.SPADES]: '#f1f1f1',
};

const RANK_LABELS: Record<string, string> = {
  [CardValue.TWO]: '2',
  [CardValue.THREE]: '3',
  [CardValue.FOUR]: '4',
  [CardValue.FIVE]: '5',
  [CardValue.SIX]: '6',
  [CardValue.SEVEN]: '7',
  [CardValue.EIGHT]: '8',
  [CardValue.NINE]: '9',
  [CardValue.TEN]: '10',
  [CardValue.JACK]: 'J',
  [CardValue.QUEEN]: 'Q',
  [CardValue.KING]: 'K',
  [CardValue.ACE]: 'A',
};

/** CSS class for each seat index (0 = bottom-center hero seat, clockwise) */
const SEAT_POSITION_CLASSES: string[] = [
  'seat-bottom-left',    // 0: hero (bottom center-left)
  'seat-left-lower',     // 1: bottom-left
  'seat-left-upper',     // 2: left-lower
  'seat-top-left',       // 3: left-upper / top-left
  'seat-top-center',     // 4: top center
  'seat-top-right',      // 5: top-right
  'seat-right-upper',    // 6: right-upper
  'seat-right-lower',    // 7: right-lower
  'seat-bottom-right',   // 8: bottom-right
];

interface CardViewModel {
  rank: string;
  symbol: string;
  color: string;
  suitColor: string;
  visible: boolean;
}

interface SeatPlayerViewModel {
  displayName: string;
  initial: string;
  chipCount: number;
}

interface SeatViewModel {
  positionClass: string;
  player: SeatPlayerViewModel | null;
  cards: CardViewModel[];
  isActive: boolean;
  isDealer: boolean;
}

/**
 * Dealer button positions on the rail for each seat index.
 * Values are [top%, left%] placing the button on the table edge
 * between the seat and center, with offset to avoid overlap.
 */
const DEALER_BUTTON_POSITIONS: [number, number][] = [
  [88, 38],   // 0: bottom-left (hero)
  [78, 8],    // 1: left-lower
  [25, 8],    // 2: left-upper
  [8, 28],    // 3: top-left
  [5, 50],    // 4: top center
  [8, 72],    // 5: top-right
  [25, 92],   // 6: right-upper
  [78, 92],   // 7: right-lower
  [88, 62],   // 8: bottom-right
];

@Component({
  selector: 'app-css-poker-table',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, NgClass],
  templateUrl: './css-poker-table.component.html',
  styleUrl: './css-poker-table.component.css',
})
export class CssPokerTableComponent implements OnChanges {
  @Input({ required: true }) tableState!: TableState;
  @Input({ required: true }) players!: PlayerState[];
  @Input() currentUserId = '';

  communityCardSlots: (CardViewModel | null)[] = [];
  potTotal = 0;
  seatViewModels: SeatViewModel[] = [];
  dealerButtonStyle: { top: string; left: string } | null = null;

  ngOnChanges(): void {
    this.buildCommunityCards();
    this.buildPot();
    this.buildSeats();
    this.buildDealerButton();
  }

  private buildCommunityCards(): void {
    const cards = this.tableState?.communityCards ?? [];
    this.communityCardSlots = [];
    for (let i = 0; i < MAX_COMMUNITY_CARDS; i++) {
      if (i < cards.length) {
        const card = cards[i];
        const isRed = card.suit === CardSuit.HEARTS || card.suit === CardSuit.DIAMONDS;
        this.communityCardSlots.push({
          rank: RANK_LABELS[card.value] ?? '?',
          symbol: SUIT_SYMBOLS[card.suit] ?? '',
          color: isRed ? '#e74c3c' : '#333',
          suitColor: SUIT_COLORS[card.suit] ?? '#888',
          visible: true,
        });
      } else {
        this.communityCardSlots.push(null);
      }
    }
  }

  private buildPot(): void {
    const pots = this.tableState?.pots ?? [];
    const totalCents = pots.reduce((sum, p) => sum + p.potAmount, 0);
    this.potTotal = totalCents / 100;
  }

  private buildSeats(): void {
    const ts = this.tableState;
    const players = this.players ?? [];

    const seatPlayerMap = new Map<number, PlayerState>();
    for (const p of players) {
      if (p.seatPosition != null) {
        seatPlayerMap.set(p.seatPosition, p);
      }
    }

    this.seatViewModels = [];
    for (let i = 0; i < MAX_SEATS; i++) {
      const player = seatPlayerMap.get(i);
      const seatCards = ts?.seatCards.get(i) ?? null;
      const isActive = ts?.actionPosition === i;
      const isDealer = ts?.dealerPosition === i;

      if (player) {
        const displayName = player.userId === this.currentUserId
          ? 'You'
          : player.displayName;

        this.seatViewModels.push({
          positionClass: SEAT_POSITION_CLASSES[i],
          player: {
            displayName: displayName.length > 10 ? displayName.substring(0, 9) + '\u2026' : displayName,
            initial: displayName.charAt(0).toUpperCase(),
            chipCount: player.chipCount / 100,
          },
          cards: this.buildHoleCards(seatCards),
          isActive,
          isDealer,
        });
      } else {
        this.seatViewModels.push({
          positionClass: SEAT_POSITION_CLASSES[i],
          player: null,
          cards: [],
          isActive: false,
          isDealer: false,
        });
      }
    }
  }

  private buildDealerButton(): void {
    const pos = this.tableState?.dealerPosition ?? -1;
    if (pos >= 0 && pos < MAX_SEATS) {
      const [top, left] = DEALER_BUTTON_POSITIONS[pos];
      this.dealerButtonStyle = { top: `${top}%`, left: `${left}%` };
    } else {
      this.dealerButtonStyle = null;
    }
  }

  private buildHoleCards(seatCards: SeatCard[] | null): CardViewModel[] {
    if (!seatCards || seatCards.length === 0) return [];

    return seatCards.map(sc => {
      if (sc.showCard) {
        const isRed = sc.card.suit === CardSuit.HEARTS || sc.card.suit === CardSuit.DIAMONDS;
        return {
          rank: RANK_LABELS[sc.card.value] ?? '?',
          symbol: SUIT_SYMBOLS[sc.card.suit] ?? '',
          color: isRed ? '#e74c3c' : '#333',
          suitColor: SUIT_COLORS[sc.card.suit] ?? '#888',
          visible: true,
        };
      }
      return { rank: '', symbol: '', color: '', suitColor: '', visible: false };
    });
  }
}
