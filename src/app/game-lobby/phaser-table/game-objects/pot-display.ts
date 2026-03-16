import Phaser from 'phaser';
import { PotInfo } from '../../../game/game-events';

export class PotDisplay extends Phaser.GameObjects.Text {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, '', {
      fontSize: '14px',
      fontFamily: 'Arial, sans-serif',
      color: '#ffffff',
      align: 'center',
      stroke: '#000000',
      strokeThickness: 3,
    });
    scene.add.existing(this);
    this.setOrigin(0.5, 0);
  }

  updatePots(pots: PotInfo[]): void {
    if (!pots || pots.length === 0) {
      this.setText('');
      return;
    }

    const total = pots.reduce((sum, p) => sum + p.potAmount, 0);
    if (total === 0) {
      this.setText('');
      return;
    }

    const dollars = total / 100;
    let text = `Pot: $${dollars.toFixed(2)}`;
    if (pots.length > 1) {
      const sides = pots
        .slice(1)
        .map((p, i) => `Side ${i + 1}: $${(p.potAmount / 100).toFixed(2)}`);
      text += '\n' + sides.join('  ');
    }
    this.setText(text);
  }
}
