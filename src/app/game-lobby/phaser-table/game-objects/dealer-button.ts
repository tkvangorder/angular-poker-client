import Phaser from 'phaser';

export class DealerButton extends Phaser.GameObjects.Container {
  private circle: Phaser.GameObjects.Graphics;
  private label: Phaser.GameObjects.Text;
  private radius = 12;

  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0);
    scene.add.existing(this);

    this.circle = new Phaser.GameObjects.Graphics(scene);
    this.add(this.circle);

    this.label = new Phaser.GameObjects.Text(scene, 0, 0, 'D', {
      fontSize: '11px',
      fontFamily: 'Arial, sans-serif',
      fontStyle: 'bold',
      color: '#000000',
      align: 'center',
    }).setOrigin(0.5, 0.5);
    this.add(this.label);

    this.drawChip();
    this.setVisible(false);
  }

  show(x: number, y: number): void {
    this.setPosition(x, y);
    this.setVisible(true);
  }

  hide(): void {
    this.setVisible(false);
  }

  resize(radius: number): void {
    this.radius = radius;
    this.label.setFontSize(Math.max(8, Math.round(radius * 0.9)));
    this.drawChip();
  }

  private drawChip(): void {
    this.circle.clear();
    this.circle.fillStyle(0xffffff, 1);
    this.circle.fillCircle(0, 0, this.radius);
    this.circle.lineStyle(1.5, 0x333333, 1);
    this.circle.strokeCircle(0, 0, this.radius);
  }
}
