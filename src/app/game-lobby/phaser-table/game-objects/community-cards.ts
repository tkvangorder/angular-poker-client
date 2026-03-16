import Phaser from 'phaser';
import { Card } from '../../../poker/poker-models';
import { CardSprite } from './card-sprite';

const MAX_COMMUNITY_CARDS = 5;

export class CommunityCards extends Phaser.GameObjects.Container {
  private cards: CardSprite[] = [];
  private cardWidth = 48;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);
    scene.add.existing(this);

    for (let i = 0; i < MAX_COMMUNITY_CARDS; i++) {
      const card = new CardSprite(scene, 0, 0);
      card.hide();
      this.cards.push(card);
      this.add(card);
    }
  }

  updateCards(communityCards: Card[]): void {
    const spacing = this.cardWidth * 1.15;
    const totalWidth = (Math.max(communityCards.length, 1) - 1) * spacing;
    const startX = -totalWidth / 2;

    for (let i = 0; i < MAX_COMMUNITY_CARDS; i++) {
      if (i < communityCards.length) {
        this.cards[i].setPosition(startX + i * spacing, 0);
        this.cards[i].showCard({ card: communityCards[i], showCard: true });
        this.cards[i].setCardSize(this.cardWidth);
      } else {
        this.cards[i].hide();
      }
    }
  }

  resize(cardWidth: number): void {
    this.cardWidth = cardWidth;
  }
}
