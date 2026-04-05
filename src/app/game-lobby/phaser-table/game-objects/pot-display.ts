import Phaser from 'phaser';
import { Pot } from '../../../game/game-models';

export class PotDisplay extends Phaser.GameObjects.Text {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, '', {
      fontSize: '14px',
      fontFamily: 'Arial, sans-serif',
      fontStyle: 'bold',
      color: '#cccccc',
      align: 'center',
    });
    scene.add.existing(this);
    this.setOrigin(0.5, 0);
  }

  updatePots(pots: Pot[]): void {
    if (!pots || pots.length === 0) {
      this.setText('');
      return;
    }

    const total = pots.reduce((sum, p) => sum + p.amount, 0);
    if (total === 0) {
      this.setText('');
      return;
    }

    const dollars = total / 100;
    this.setText(`$${dollars.toFixed(2)}`);
  }
}
