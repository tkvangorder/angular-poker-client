import Phaser from 'phaser';
import { CardSuit, CardValue } from '../../../poker/poker-models';
import { SeatCard } from '../../../game/game-models';

const SUIT_COLORS: Record<CardSuit, number> = {
  [CardSuit.HEART]: 0xb91c1c,
  [CardSuit.DIAMOND]: 0x2563eb,
  [CardSuit.CLUB]: 0x16a34a,
  [CardSuit.SPADE]: 0x6b7280,
};

const SUIT_SYMBOLS: Record<CardSuit, string> = {
  [CardSuit.HEART]: '\u2665',
  [CardSuit.DIAMOND]: '\u2666',
  [CardSuit.CLUB]: '\u2663',
  [CardSuit.SPADE]: '\u2660',
};

const RANK_LABELS: Record<CardValue, string> = {
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

const CARD_BACK_COLOR = 0x1a5c2a;

export class CardSprite extends Phaser.GameObjects.Container {
  private bg: Phaser.GameObjects.Graphics;
  private rankText: Phaser.GameObjects.Text;
  private suitText: Phaser.GameObjects.Text;
  private cardWidth = 40;
  private cardHeight = 56;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);
    scene.add.existing(this);

    this.bg = new Phaser.GameObjects.Graphics(scene);
    this.add(this.bg);

    this.rankText = new Phaser.GameObjects.Text(scene, 0, 2, '', {
      fontSize: '18px',
      fontFamily: 'Arial, sans-serif',
      fontStyle: 'bold',
      color: '#ffffff',
      align: 'center',
    }).setOrigin(0.5, 0.5);
    this.add(this.rankText);

    this.suitText = new Phaser.GameObjects.Text(scene, 0, -16, '', {
      fontSize: '10px',
      fontFamily: 'Arial, sans-serif',
      color: '#ffffff',
      align: 'center',
    }).setOrigin(0.5, 0.5);
    this.add(this.suitText);

    this.setVisible(false);
  }

  showCard(seatCard: SeatCard): void {
    if (seatCard.showCard) {
      const color = SUIT_COLORS[seatCard.card.suit] ?? 0x444444;
      const rank = RANK_LABELS[seatCard.card.value] ?? '?';
      const suit = SUIT_SYMBOLS[seatCard.card.suit] ?? '';
      this.drawCard(color, rank, suit);
    } else {
      this.drawBack();
    }
    this.setVisible(true);
  }

  showBack(): void {
    this.drawBack();
    this.setVisible(true);
  }

  hide(): void {
    this.setVisible(false);
  }

  setCardSize(width: number): void {
    this.cardWidth = width;
    this.cardHeight = width * 1.4;
    // Positions will be redrawn on next showCard/showBack call
  }

  private drawCard(color: number, rank: string, suit: string): void {
    const w = this.cardWidth;
    const h = this.cardHeight;
    const r = Math.max(3, w * 0.1);

    this.bg.clear();
    this.bg.fillStyle(color, 1);
    this.bg.fillRoundedRect(-w / 2, -h / 2, w, h, r);

    const rankSize = Math.max(10, Math.round(w * 0.45));
    this.rankText.setFontSize(rankSize);
    this.rankText.setPosition(0, h * 0.05);
    this.rankText.setText(rank);
    this.rankText.setVisible(true);

    const suitSize = Math.max(7, Math.round(w * 0.25));
    this.suitText.setFontSize(suitSize);
    this.suitText.setPosition(0, -h * 0.28);
    this.suitText.setText(suit);
    this.suitText.setVisible(true);
  }

  private drawBack(): void {
    const w = this.cardWidth;
    const h = this.cardHeight;
    const r = Math.max(3, w * 0.1);

    this.bg.clear();
    this.bg.fillStyle(CARD_BACK_COLOR, 1);
    this.bg.fillRoundedRect(-w / 2, -h / 2, w, h, r);

    // Subtle inner border
    this.bg.lineStyle(1, 0x2d8a44, 0.5);
    const inset = 3;
    this.bg.strokeRoundedRect(
      -w / 2 + inset, -h / 2 + inset,
      w - inset * 2, h - inset * 2,
      r - 1
    );

    this.rankText.setVisible(false);
    this.suitText.setVisible(false);
  }
}
