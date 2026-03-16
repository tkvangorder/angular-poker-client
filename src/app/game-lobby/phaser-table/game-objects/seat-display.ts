import Phaser from 'phaser';
import { CardSprite } from './card-sprite';
import { SeatCard } from '../../../game/game-models';

export class SeatDisplay extends Phaser.GameObjects.Container {
  private background: Phaser.GameObjects.Graphics;
  private nameText: Phaser.GameObjects.Text;
  private chipText: Phaser.GameObjects.Text;
  private card1: CardSprite;
  private card2: CardSprite;
  private activeGlow: Phaser.GameObjects.Graphics;
  private seatWidth = 120;
  private seatHeight = 80;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);
    scene.add.existing(this);

    // Active glow (behind everything)
    this.activeGlow = new Phaser.GameObjects.Graphics(scene);
    this.add(this.activeGlow);

    // Background rounded rect
    this.background = new Phaser.GameObjects.Graphics(scene);
    this.add(this.background);

    // Player name
    this.nameText = new Phaser.GameObjects.Text(scene, 0, -12, '', {
      fontSize: '12px',
      fontFamily: 'Arial, sans-serif',
      color: '#ffffff',
      align: 'center',
    }).setOrigin(0.5, 0.5);
    this.add(this.nameText);

    // Chip count
    this.chipText = new Phaser.GameObjects.Text(scene, 0, 6, '', {
      fontSize: '11px',
      fontFamily: 'Arial, sans-serif',
      color: '#ffd54f',
      align: 'center',
    }).setOrigin(0.5, 0.5);
    this.add(this.chipText);

    // Hole cards — positioned above the seat box
    this.card1 = new CardSprite(scene, -16, -48);
    this.add(this.card1);
    this.card1.hide();

    this.card2 = new CardSprite(scene, 16, -48);
    this.add(this.card2);
    this.card2.hide();

    this.drawBackground(false);
    this.setVisible(false);
  }

  updateSeat(
    playerName: string | null,
    chipCount: number | null,
    cards: SeatCard[] | null,
    isActive: boolean,
    isDealer: boolean
  ): void {
    if (!playerName) {
      this.setVisible(false);
      return;
    }

    this.setVisible(true);
    this.nameText.setText(this.truncateName(playerName));
    this.chipText.setText(chipCount != null ? this.formatChips(chipCount) : '');
    this.drawBackground(isActive);

    // Cards
    if (cards && cards.length >= 1) {
      this.card1.showCard(cards[0]);
      this.card1.setCardSize(this.seatWidth * 0.25);
    } else {
      this.card1.hide();
    }
    if (cards && cards.length >= 2) {
      this.card2.showCard(cards[1]);
      this.card2.setCardSize(this.seatWidth * 0.25);
    } else {
      this.card2.hide();
    }
  }

  resize(width: number, height: number): void {
    this.seatWidth = width;
    this.seatHeight = height;

    const fontSize = Math.max(10, Math.round(width * 0.1));
    this.nameText.setFontSize(fontSize);
    this.nameText.setY(-height * 0.15);

    this.chipText.setFontSize(Math.max(9, fontSize - 1));
    this.chipText.setY(height * 0.08);

    const cardWidth = width * 0.25;
    const cardY = -height * 0.6;
    this.card1.setPosition(-cardWidth * 0.55, cardY);
    this.card1.setCardSize(cardWidth);
    this.card2.setPosition(cardWidth * 0.55, cardY);
    this.card2.setCardSize(cardWidth);
  }

  private drawBackground(isActive: boolean): void {
    const w = this.seatWidth;
    const h = this.seatHeight;

    this.activeGlow.clear();
    if (isActive) {
      this.activeGlow.fillStyle(0xffd54f, 0.25);
      this.activeGlow.fillRoundedRect(-w / 2 - 4, -h / 2 - 4, w + 8, h + 8, 10);
    }

    this.background.clear();
    this.background.fillStyle(0x000000, 0.55);
    this.background.fillRoundedRect(-w / 2, -h / 2, w, h, 8);
    this.background.lineStyle(1.5, isActive ? 0xffd54f : 0x666666, 0.8);
    this.background.strokeRoundedRect(-w / 2, -h / 2, w, h, 8);
  }

  private truncateName(name: string): string {
    return name.length > 12 ? name.substring(0, 11) + '…' : name;
  }

  private formatChips(cents: number): string {
    const dollars = cents / 100;
    return '$' + dollars.toFixed(2);
  }
}
