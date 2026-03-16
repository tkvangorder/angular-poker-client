import Phaser from 'phaser';

export class TableFelt extends Phaser.GameObjects.Graphics {
  constructor(scene: Phaser.Scene) {
    super(scene);
    scene.add.existing(this);
  }

  draw(cx: number, cy: number, rx: number, ry: number): void {
    this.clear();

    // Outer edge — very subtle lighter border
    this.lineStyle(2, 0x555555, 0.5);
    this.strokeEllipse(cx, cy, rx * 2 + 6, ry * 2 + 6);

    // Felt — dark charcoal base
    this.fillStyle(0x2a2a2e, 1);
    this.fillEllipse(cx, cy, rx * 2, ry * 2);

    // Subtle lighter center for depth
    this.fillStyle(0x323236, 1);
    this.fillEllipse(cx, cy, rx * 1.5, ry * 1.5);

    this.fillStyle(0x38383c, 1);
    this.fillEllipse(cx, cy, rx * 0.9, ry * 0.9);
  }
}
