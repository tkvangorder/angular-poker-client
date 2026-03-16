import Phaser from 'phaser';
import { CardSprite } from './card-sprite';
import { SeatCard } from '../../../game/game-models';

const ACTIVE_COLOR = 0x14b8a6;   // teal
const INACTIVE_COLOR = 0x555555;
const BG_COLOR = 0x1e1e22;

export class SeatDisplay extends Phaser.GameObjects.Container {
  private background: Phaser.GameObjects.Graphics;
  private nameText: Phaser.GameObjects.Text;
  private chipText: Phaser.GameObjects.Text;
  private card1: CardSprite;
  private card2: CardSprite;
  private seatWidth = 100;
  private seatHeight = 48;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);
    scene.add.existing(this);

    // Background pill
    this.background = new Phaser.GameObjects.Graphics(scene);
    this.add(this.background);

    // Player name
    this.nameText = new Phaser.GameObjects.Text(scene, 0, -6, '', {
      fontSize: '13px',
      fontFamily: 'Arial, sans-serif',
      fontStyle: 'bold',
      color: '#cccccc',
      align: 'center',
    }).setOrigin(0.5, 0.5);
    this.add(this.nameText);

    // Chip count
    this.chipText = new Phaser.GameObjects.Text(scene, 0, 12, '', {
      fontSize: '14px',
      fontFamily: 'Arial, sans-serif',
      fontStyle: 'bold',
      color: '#ffffff',
      align: 'center',
    }).setOrigin(0.5, 0.5);
    this.add(this.chipText);

    // Hole cards — positioned above the seat pill
    this.card1 = new CardSprite(scene, -22, -50);
    this.add(this.card1);
    this.card1.hide();

    this.card2 = new CardSprite(scene, 22, -50);
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
    } else {
      this.card1.hide();
    }
    if (cards && cards.length >= 2) {
      this.card2.showCard(cards[1]);
    } else {
      this.card2.hide();
    }
  }

  resize(width: number, height: number): void {
    this.seatWidth = width;
    this.seatHeight = height;

    const nameFontSize = Math.max(10, Math.round(width * 0.12));
    this.nameText.setFontSize(nameFontSize);
    this.nameText.setY(-height * 0.14);

    const chipFontSize = Math.max(11, Math.round(width * 0.14));
    this.chipText.setFontSize(chipFontSize);
    this.chipText.setY(height * 0.2);

    const cardWidth = Math.max(24, width * 0.32);
    const cardGap = cardWidth * 0.6;
    const cardY = -(height / 2) - cardWidth * 0.9;
    this.card1.setCardSize(cardWidth);
    this.card1.setPosition(-cardGap, cardY);
    this.card2.setCardSize(cardWidth);
    this.card2.setPosition(cardGap, cardY);
  }

  private drawBackground(isActive: boolean): void {
    const w = this.seatWidth;
    const h = this.seatHeight;
    const r = h / 2;

    this.background.clear();
    this.background.fillStyle(BG_COLOR, 0.9);
    this.background.fillRoundedRect(-w / 2, -h / 2, w, h, r);
    this.background.lineStyle(2, isActive ? ACTIVE_COLOR : INACTIVE_COLOR, isActive ? 1 : 0.6);
    this.background.strokeRoundedRect(-w / 2, -h / 2, w, h, r);
  }

  private truncateName(name: string): string {
    return name.length > 10 ? name.substring(0, 9) + '\u2026' : name;
  }

  private formatChips(cents: number): string {
    const dollars = cents / 100;
    return dollars.toFixed(2);
  }
}
