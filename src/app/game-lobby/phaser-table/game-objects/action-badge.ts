import Phaser from 'phaser';
import { BadgeKind, BadgeState } from '../utils/action-badge-state';

interface PaletteEntry {
  bg: number;
  bgAlpha: number;
  border: number;
  textColor: string;
  pulse: boolean;
}

const PALETTE: Record<Exclude<BadgeKind, 'none'>, PaletteEntry> = {
  'to-act':  { bg: 0x000000, bgAlpha: 0.6, border: 0xf5d678, textColor: '#f5d678', pulse: false },
  'fold':    { bg: 0x4a1414, bgAlpha: 0.85, border: 0xb84141, textColor: '#ff8888', pulse: false },
  'check':   { bg: 0x000000, bgAlpha: 0.7, border: 0xcccccc, textColor: '#ffffff', pulse: false },
  'call':    { bg: 0x14304a, bgAlpha: 0.85, border: 0x4488cc, textColor: '#88bbff', pulse: false },
  'bet':     { bg: 0x3a2a0a, bgAlpha: 0.85, border: 0xf5d678, textColor: '#f5d678', pulse: false },
  'raise':   { bg: 0x3a2a0a, bgAlpha: 0.85, border: 0xf5d678, textColor: '#f5d678', pulse: false },
  'all-in':  { bg: 0x3a2a0a, bgAlpha: 0.9, border: 0xf5d678, textColor: '#ffe89a', pulse: true },
  'winner':  { bg: 0x3a2a0a, bgAlpha: 0.9, border: 0xf5d678, textColor: '#ffe89a', pulse: true },
};

const FADE_IN_MS = 150;
const FADE_OUT_MS = 200;
const ACTION_HOLD_MS = 2500;

const TEXT_LINE_GAP = 2;

/** Kinds that auto-fade after ACTION_HOLD_MS. Others are sticky. */
const STICKY_KINDS: BadgeKind[] = ['to-act', 'winner', 'none'];

export class ActionBadge extends Phaser.GameObjects.Container {
  private bg: Phaser.GameObjects.Graphics;
  private line1Text: Phaser.GameObjects.Text;
  private line2Text: Phaser.GameObjects.Text;
  private pulseTween: Phaser.Tweens.Tween | null = null;
  private fadeOutTimer: Phaser.Time.TimerEvent | null = null;
  private currentKind: BadgeKind = 'none';
  private currentSeq = -1;
  private fontSize = 11;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);
    scene.add.existing(this);

    this.bg = new Phaser.GameObjects.Graphics(scene);
    this.add(this.bg);

    this.line1Text = new Phaser.GameObjects.Text(scene, 0, 0, '', {
      fontFamily: 'system-ui, sans-serif',
      fontSize: `${this.fontSize}px`,
      fontStyle: 'bold',
      color: '#ffffff',
    }).setOrigin(0.5);
    this.add(this.line1Text);

    this.line2Text = new Phaser.GameObjects.Text(scene, 0, 0, '', {
      fontFamily: 'system-ui, sans-serif',
      fontSize: `${Math.max(8, this.fontSize - 2)}px`,
      color: '#ffffff',
    }).setOrigin(0.5);
    this.add(this.line2Text);

    this.setVisible(false);
    this.setAlpha(0);
  }

  setFontSize(px: number): void {
    this.fontSize = px;
    this.line1Text.setFontSize(px);
    this.line2Text.setFontSize(Math.max(8, px - 2));
  }

  applyState(state: BadgeState): void {
    if (state.kind === 'none') {
      this.hide();
      return;
    }

    // For action kinds, the actionSeq must change for us to retrigger the
    // fade animation; otherwise an idle re-render keeps the badge in its
    // current fade phase.
    const isAction = !STICKY_KINDS.includes(state.kind);
    if (
      this.currentKind === state.kind &&
      this.currentSeq === state.actionSeq &&
      !isAction // sticky kinds: skip re-show; action kinds: always re-show on same seq is fine (no-op)
    ) {
      return;
    }

    this.currentKind = state.kind;
    this.currentSeq = state.actionSeq;
    this.render(state);
  }

  hide(): void {
    if (this.currentKind === 'none' && !this.visible) return;
    this.currentKind = 'none';
    this.currentSeq = -1;
    this.cancelTimers();
    this.scene.tweens.killTweensOf(this);
    this.setAlpha(0);
    this.setVisible(false);
  }

  private cancelTimers(): void {
    if (this.fadeOutTimer) {
      this.fadeOutTimer.remove(false);
      this.fadeOutTimer = null;
    }
    if (this.pulseTween) {
      this.pulseTween.stop();
      this.pulseTween = null;
    }
  }

  private render(state: BadgeState): void {
    this.cancelTimers();
    this.scene.tweens.killTweensOf(this);

    const palette = PALETTE[state.kind as Exclude<BadgeKind, 'none'>];
    this.line1Text.setColor(palette.textColor);
    this.line2Text.setColor(palette.textColor);
    this.line1Text.setText(state.line1);
    this.line2Text.setText(state.line2);

    const hasLine2 = state.line2.length > 0;
    this.line1Text.setVisible(true);
    this.line2Text.setVisible(hasLine2);

    const padX = 8;
    const padY = 4;
    const lineGap = hasLine2 ? TEXT_LINE_GAP : 0;
    const totalTextH = this.line1Text.height + (hasLine2 ? this.line2Text.height + lineGap : 0);
    const totalTextW = Math.max(this.line1Text.width, hasLine2 ? this.line2Text.width : 0);
    const w = totalTextW + padX * 2;
    const h = totalTextH + padY * 2;

    this.line1Text.setPosition(0, -h / 2 + padY + this.line1Text.height / 2);
    if (hasLine2) {
      this.line2Text.setPosition(0, h / 2 - padY - this.line2Text.height / 2);
    }

    this.bg.clear();
    this.bg.fillStyle(palette.bg, palette.bgAlpha);
    this.bg.fillRoundedRect(-w / 2, -h / 2, w, h, Math.min(h / 2, 8));
    this.bg.lineStyle(1, palette.border, 1);
    this.bg.strokeRoundedRect(-w / 2, -h / 2, w, h, Math.min(h / 2, 8));

    this.setVisible(true);
    this.scene.tweens.add({
      targets: this,
      alpha: 1,
      duration: FADE_IN_MS,
      ease: 'Quad.easeOut',
    });

    if (palette.pulse) {
      this.pulseTween = this.scene.tweens.add({
        targets: this,
        alpha: { from: 1, to: 0.85 },
        duration: 1200,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
    }

    if (!STICKY_KINDS.includes(state.kind)) {
      this.fadeOutTimer = this.scene.time.delayedCall(ACTION_HOLD_MS, () => {
        this.scene.tweens.add({
          targets: this,
          alpha: 0,
          duration: FADE_OUT_MS,
          ease: 'Quad.easeIn',
          onComplete: () => {
            this.setVisible(false);
            this.currentKind = 'none';
          },
        });
      });
    }
  }
}
