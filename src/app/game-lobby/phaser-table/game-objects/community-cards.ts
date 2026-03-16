import Phaser from 'phaser';
import { Card } from '../../../poker/poker-models';
import { CardSprite } from './card-sprite';

const MAX_COMMUNITY_CARDS = 5;

export class CommunityCards extends Phaser.GameObjects.Container {
  private cards: CardSprite[] = [];
  private cardWidth = 48;
  // Placeholder outlines for undealt slots
  private placeholders: Phaser.GameObjects.Graphics;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);
    scene.add.existing(this);

    this.placeholders = new Phaser.GameObjects.Graphics(scene);
    this.add(this.placeholders);

    for (let i = 0; i < MAX_COMMUNITY_CARDS; i++) {
      const card = new CardSprite(scene, 0, 0);
      card.hide();
      this.cards.push(card);
      this.add(card);
    }
  }

  updateCards(communityCards: Card[]): void {
    const spacing = this.cardWidth * 1.2;
    const totalWidth = (MAX_COMMUNITY_CARDS - 1) * spacing;
    const startX = -totalWidth / 2;
    const h = this.cardWidth * 1.4;
    const r = Math.max(3, this.cardWidth * 0.1);

    // Draw placeholder outlines for all 5 positions
    this.placeholders.clear();
    this.placeholders.lineStyle(1.5, 0x555555, 0.3);
    for (let i = 0; i < MAX_COMMUNITY_CARDS; i++) {
      const px = startX + i * spacing;
      this.placeholders.strokeRoundedRect(
        px - this.cardWidth / 2, -h / 2,
        this.cardWidth, h, r
      );
    }

    for (let i = 0; i < MAX_COMMUNITY_CARDS; i++) {
      this.cards[i].setCardSize(this.cardWidth);
      if (i < communityCards.length) {
        this.cards[i].setPosition(startX + i * spacing, 0);
        this.cards[i].showCard({ card: communityCards[i], showCard: true });
      } else {
        this.cards[i].hide();
      }
    }
  }

  resize(cardWidth: number): void {
    this.cardWidth = cardWidth;
  }
}
