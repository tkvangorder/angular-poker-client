import Phaser from 'phaser';
import { Card } from '../../../poker/poker-models';
import { SeatCard } from '../../../game/game-models';
import { getCardTextureKey, CARD_BACK_KEY } from '../utils/card-keys';

export class CardSprite extends Phaser.GameObjects.Image {
  private currentKey = '';

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, CARD_BACK_KEY);
    scene.add.existing(this);
    this.setOrigin(0.5, 0.5);
    this.currentKey = CARD_BACK_KEY;
  }

  showCard(seatCard: SeatCard): void {
    const key = seatCard.showCard
      ? getCardTextureKey(seatCard.card)
      : CARD_BACK_KEY;
    if (key !== this.currentKey) {
      this.setTexture(key);
      this.currentKey = key;
    }
    this.setVisible(true);
  }

  showBack(): void {
    if (this.currentKey !== CARD_BACK_KEY) {
      this.setTexture(CARD_BACK_KEY);
      this.currentKey = CARD_BACK_KEY;
    }
    this.setVisible(true);
  }

  hide(): void {
    this.setVisible(false);
  }

  setCardSize(width: number): void {
    const texWidth = this.texture.getSourceImage().width || 240;
    this.setScale(width / texWidth);
  }
}
