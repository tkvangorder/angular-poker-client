import Phaser from 'phaser';

export class TableFelt extends Phaser.GameObjects.Graphics {
  constructor(scene: Phaser.Scene) {
    super(scene);
    scene.add.existing(this);
  }

  draw(cx: number, cy: number, rx: number, ry: number): void {
    this.clear();

    // Outer rail — dark brown
    this.fillStyle(0x3e2723, 1);
    this.fillEllipse(cx, cy, rx * 2 + 28, ry * 2 + 28);

    // Rail highlight — lighter brown
    this.fillStyle(0x5d4037, 1);
    this.fillEllipse(cx, cy, rx * 2 + 20, ry * 2 + 20);

    // Rail inner edge
    this.fillStyle(0x3e2723, 1);
    this.fillEllipse(cx, cy, rx * 2 + 8, ry * 2 + 8);

    // Felt — dark green base
    this.fillStyle(0x1b5e20, 1);
    this.fillEllipse(cx, cy, rx * 2, ry * 2);

    // Felt — lighter center for gradient effect
    this.fillStyle(0x2e7d32, 1);
    this.fillEllipse(cx, cy, rx * 1.6, ry * 1.6);

    this.fillStyle(0x388e3c, 1);
    this.fillEllipse(cx, cy, rx * 1.1, ry * 1.1);

    // Gold betting line
    this.lineStyle(1.5, 0xffd54f, 0.35);
    this.strokeEllipse(cx, cy, rx * 1.2, ry * 1.2);
  }
}
