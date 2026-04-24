import Phaser from 'phaser';
import { Subscription } from 'rxjs';
import { PhaserBridgeService } from '../phaser-bridge.service';
import { TableState, PlayerState } from '../../../game/game-state.service';
import { TableFelt } from '../game-objects/table-felt';
import { SeatDisplay } from '../game-objects/seat-display';
import { CommunityCards } from '../game-objects/community-cards';
import { PotDisplay } from '../game-objects/pot-display';
import { DealerButton } from '../game-objects/dealer-button';
import { BetChip } from '../game-objects/bet-chip';
import { getAllSeatPositions, MAX_SEATS, SeatPosition } from '../utils/seat-layout';

export class PokerTableScene extends Phaser.Scene {
  private bridge!: PhaserBridgeService;
  private tableFelt!: TableFelt;
  private seats: SeatDisplay[] = [];
  private betChips: BetChip[] = [];
  private communityCards!: CommunityCards;
  private potDisplay!: PotDisplay;
  private dealerButton!: DealerButton;

  private subscriptions: Subscription[] = [];
  private currentTableState: TableState | null = null;
  private currentPlayers: PlayerState[] = [];
  private currentUserId = '';

  // Layout cache
  private cx = 0;
  private cy = 0;
  private tableRx = 0;
  private tableRy = 0;
  private seatPositions: SeatPosition[] = [];

  // Timer tracking
  private timerDeadlineMs: number | null = null;
  private timerTotalMs = 30000;

  constructor() {
    super({ key: 'PokerTableScene' });
  }

  init(data: { bridge: PhaserBridgeService }): void {
    this.bridge = data.bridge;
  }

  create(): void {
    this.tableFelt = new TableFelt(this);

    for (let i = 0; i < MAX_SEATS; i++) {
      const seat = new SeatDisplay(this, 0, 0);
      seat.setDepth(5);
      this.seats.push(seat);
      const chip = new BetChip(this, 0, 0);
      chip.setDepth(4);
      this.betChips.push(chip);
    }

    this.communityCards = new CommunityCards(this, 0, 0).setDepth(2);
    this.potDisplay = new PotDisplay(this, 0, 0).setDepth(2);
    this.dealerButton = new DealerButton(this);
    this.dealerButton.setDepth(4);

    this.layoutAll(this.scale.width, this.scale.height);

    this.scale.on('resize', (gameSize: Phaser.Structs.Size) => {
      this.layoutAll(gameSize.width, gameSize.height);
      this.renderState();
    });

    this.subscriptions.push(
      this.bridge.tableState$.subscribe((state) => {
        this.handleTableStateChange(state);
      }),
      this.bridge.players$.subscribe((players) => {
        this.currentPlayers = players;
        this.renderState();
      }),
      this.bridge.currentUserId$.subscribe((userId) => {
        this.currentUserId = userId;
        this.renderState();
      })
    );
  }

  override update(): void {
    if (this.timerDeadlineMs == null) return;
    const remainingMs = Math.max(0, this.timerDeadlineMs - Date.now());
    const frac = this.timerTotalMs > 0 ? remainingMs / this.timerTotalMs : 0;
    const pos = this.currentTableState?.actionPosition;
    if (pos != null && pos >= 1 && pos <= MAX_SEATS) {
      this.seats[pos - 1].setTimer(frac);
    }
  }

  private handleTableStateChange(state: TableState | null): void {
    this.currentTableState = state;

    if (state?.actionDeadline) {
      const deadlineMs = Date.parse(state.actionDeadline);
      if (deadlineMs > Date.now()) {
        const justObserved = deadlineMs - Date.now();
        if (this.timerDeadlineMs !== deadlineMs) {
          this.timerTotalMs = Math.max(1000, justObserved);
        }
        this.timerDeadlineMs = deadlineMs;
      } else {
        this.timerDeadlineMs = null;
      }
    } else {
      this.timerDeadlineMs = null;
    }

    this.renderState();
  }

  private layoutAll(width: number, height: number): void {
    this.cx = width / 2;
    this.cy = height / 2;
    this.tableRx = width * 0.30;
    this.tableRy = this.tableRx / 2.4;

    const railWidth = Math.max(6, width * 0.01);
    this.tableFelt.draw(this.cx, this.cy, this.tableRx, this.tableRy, railWidth);

    const seatRx = this.tableRx * 1.22;
    const seatRy = this.tableRy * 1.35;
    this.seatPositions = getAllSeatPositions(this.cx, this.cy, seatRx, seatRy);

    const seatSizing = {
      podPadX: Math.max(6, width * 0.007),
      podPadY: Math.max(4, width * 0.004),
      podRadius: Math.max(8, width * 0.009),
      avatarSize: Math.max(28, width * 0.026),
      avatarRingWidth: 2,
      nameSize: Math.max(10, Math.round(width * 0.008)),
      stackSize: Math.max(9, Math.round(width * 0.007)),
      holeWidth: Math.max(32, width * 0.031),
      emptySize: Math.max(20, width * 0.02),
      timerHeight: Math.max(2, Math.round(width * 0.002)),
    };

    const betFontSize = Math.max(9, Math.round(width * 0.008));

    for (let i = 0; i < MAX_SEATS; i++) {
      this.seats[i].setPosition(this.seatPositions[i].x, this.seatPositions[i].y);
      this.seats[i].applySizing(seatSizing);
      const dx = this.cx - this.seatPositions[i].x;
      const dy = this.cy - this.seatPositions[i].y;
      const t = 0.25;
      this.betChips[i].setPosition(
        this.seatPositions[i].x + dx * t,
        this.seatPositions[i].y + dy * t
      );
      this.betChips[i].resize(betFontSize);
    }

    const communityCardWidth = Math.max(36, width * 0.051);
    this.communityCards.setPosition(this.cx, this.cy - communityCardWidth * 0.15);
    this.communityCards.resize(communityCardWidth);

    this.potDisplay.setPosition(this.cx, this.cy + communityCardWidth * 0.85);
    const chipSize = Math.max(10, width * 0.013);
    const labelSize = Math.max(8, Math.round(width * 0.007));
    const amountSize = Math.max(13, Math.round(width * 0.011));
    this.potDisplay.resize(chipSize, labelSize, amountSize);

    this.dealerButton.resize(Math.max(8, width * 0.008));
  }

  private renderState(): void {
    const ts = this.currentTableState;
    const players = this.currentPlayers;

    if (!ts) {
      for (const seat of this.seats) seat.updateSeat(null, null, null, false);
      for (const chip of this.betChips) chip.setAmount(0);
      this.communityCards.updateCards([]);
      this.potDisplay.updatePots([]);
      this.dealerButton.hide();
      return;
    }

    const seatPlayerMap = new Map<number, PlayerState>();
    for (const p of players) {
      if (p.seatPosition != null) seatPlayerMap.set(p.seatPosition, p);
    }

    for (let pos = 1; pos <= MAX_SEATS; pos++) {
      const idx = pos - 1;
      const player = seatPlayerMap.get(pos);
      const cards = ts.seatCards.get(pos) ?? null;
      const isActive = ts.actionPosition === pos;

      if (player) {
        const name = player.userId === this.currentUserId ? 'You' : player.displayName;
        this.seats[idx].updateSeat(name, player.chipCount, cards, isActive);
      } else {
        this.seats[idx].updateSeat(null, null, null, false);
      }

      const summary = ts.seatSummaries.get(pos);
      this.betChips[idx].setAmount(summary?.currentBetAmount ?? 0);
    }

    this.communityCards.updateCards(ts.communityCards);
    this.potDisplay.updatePots(ts.pots);

    if (ts.dealerPosition != null && ts.dealerPosition >= 1 && ts.dealerPosition <= MAX_SEATS) {
      const seatPos = this.seatPositions[ts.dealerPosition - 1];
      const dx = this.cx - seatPos.x;
      const dy = this.cy - seatPos.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > 0) {
        const t = 0.3;
        this.dealerButton.show(seatPos.x + dx * t, seatPos.y + dy * t);
      }
    } else {
      this.dealerButton.hide();
    }
  }

  shutdown(): void {
    for (const sub of this.subscriptions) sub.unsubscribe();
    this.subscriptions = [];
  }
}
