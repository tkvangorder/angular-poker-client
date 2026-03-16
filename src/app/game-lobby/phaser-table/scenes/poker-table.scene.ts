import Phaser from 'phaser';
import { Subscription } from 'rxjs';
import { PhaserBridgeService } from '../phaser-bridge.service';
import { TableState, PlayerState } from '../../../game/game-state.service';
import { TableFelt } from '../game-objects/table-felt';
import { SeatDisplay } from '../game-objects/seat-display';
import { CommunityCards } from '../game-objects/community-cards';
import { PotDisplay } from '../game-objects/pot-display';
import { DealerButton } from '../game-objects/dealer-button';
import { getAllSeatPositions, MAX_SEATS } from '../utils/seat-layout';

export class PokerTableScene extends Phaser.Scene {
  private bridge!: PhaserBridgeService;
  private tableFelt!: TableFelt;
  private seats: SeatDisplay[] = [];
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

  constructor() {
    super({ key: 'PokerTableScene' });
  }

  init(data: { bridge: PhaserBridgeService }): void {
    this.bridge = data.bridge;
  }

  create(): void {
    // Create game objects
    this.tableFelt = new TableFelt(this);

    for (let i = 0; i < MAX_SEATS; i++) {
      this.seats.push(new SeatDisplay(this, 0, 0));
    }

    this.communityCards = new CommunityCards(this, 0, 0);
    this.potDisplay = new PotDisplay(this, 0, 0);
    this.dealerButton = new DealerButton(this);

    // Initial layout
    this.layoutAll(this.scale.width, this.scale.height);

    // Listen for resize
    this.scale.on('resize', (gameSize: Phaser.Structs.Size) => {
      this.layoutAll(gameSize.width, gameSize.height);
      this.renderState();
    });

    // Subscribe to bridge data
    this.subscriptions.push(
      this.bridge.tableState$.subscribe((state) => {
        this.currentTableState = state;
        this.renderState();
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

  private layoutAll(width: number, height: number): void {
    this.cx = width / 2;
    this.cy = height / 2;
    this.tableRx = width * 0.37;
    this.tableRy = height * 0.34;

    // Draw table
    this.tableFelt.draw(this.cx, this.cy, this.tableRx, this.tableRy);

    // Position seats on a slightly larger ellipse
    const seatRx = this.tableRx * 1.18;
    const seatRy = this.tableRy * 1.28;
    const positions = getAllSeatPositions(this.cx, this.cy, seatRx, seatRy);

    const seatWidth = Math.max(80, width * 0.1);
    const seatHeight = Math.max(55, height * 0.1);

    for (let i = 0; i < MAX_SEATS; i++) {
      this.seats[i].setPosition(positions[i].x, positions[i].y);
      this.seats[i].resize(seatWidth, seatHeight);
    }

    // Community cards at table center
    const cardWidth = Math.max(32, width * 0.05);
    this.communityCards.setPosition(this.cx, this.cy - height * 0.03);
    this.communityCards.resize(cardWidth);

    // Pot below community cards
    const potFontSize = Math.max(11, Math.round(width * 0.015));
    this.potDisplay.setPosition(this.cx, this.cy + height * 0.08);
    this.potDisplay.setFontSize(potFontSize);

    // Dealer button
    this.dealerButton.resize(Math.max(8, width * 0.012));
  }

  private renderState(): void {
    const ts = this.currentTableState;
    const players = this.currentPlayers;

    if (!ts) {
      // No table state — hide everything except felt
      for (const seat of this.seats) {
        seat.setVisible(false);
      }
      this.communityCards.updateCards([]);
      this.potDisplay.updatePots([]);
      this.dealerButton.hide();
      return;
    }

    // Build a map of seatPosition → PlayerState for quick lookup
    const seatPlayerMap = new Map<number, PlayerState>();
    for (const p of players) {
      if (p.seatPosition != null) {
        seatPlayerMap.set(p.seatPosition, p);
      }
    }

    // Update seats
    // The "actionPosition" comes from the table model — not on TableState directly,
    // so we check lastAction for now.
    for (let i = 0; i < MAX_SEATS; i++) {
      const player = seatPlayerMap.get(i);
      const cards = ts.seatCards.get(i) ?? null;
      const isActive = ts.lastAction?.seatPosition === i;

      this.seats[i].updateSeat(
        player ? (player.userId === this.currentUserId ? 'You' : player.userId) : null,
        player?.chipCount ?? null,
        cards,
        isActive,
        ts.dealerPosition === i
      );
    }

    // Community cards
    this.communityCards.updateCards(ts.communityCards);

    // Pots
    this.potDisplay.updatePots(ts.pots);

    // Dealer button — position near the dealer's seat
    if (ts.dealerPosition >= 0 && ts.dealerPosition < MAX_SEATS) {
      const seatPos = this.seats[ts.dealerPosition];
      // Place the button offset from the seat toward the table center
      const dx = this.cx - seatPos.x;
      const dy = this.cy - seatPos.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const offsetDist = Math.min(35, dist * 0.3);
      const btnX = seatPos.x + (dx / dist) * offsetDist;
      const btnY = seatPos.y + (dy / dist) * offsetDist;
      this.dealerButton.show(btnX, btnY);
    } else {
      this.dealerButton.hide();
    }
  }

  shutdown(): void {
    for (const sub of this.subscriptions) {
      sub.unsubscribe();
    }
    this.subscriptions = [];
  }
}
