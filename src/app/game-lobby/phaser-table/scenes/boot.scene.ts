import Phaser from 'phaser';
import { getAllCardAssets } from '../utils/card-keys';

const CARD_SVG_WIDTH = 240;
const CARD_SVG_HEIGHT = 336;

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload(): void {
    const assets = getAllCardAssets();
    for (const { key, path } of assets) {
      this.load.svg(key, path, {
        width: CARD_SVG_WIDTH,
        height: CARD_SVG_HEIGHT,
      });
    }
  }

  create(): void {
    this.scene.start('PokerTableScene');
  }
}
