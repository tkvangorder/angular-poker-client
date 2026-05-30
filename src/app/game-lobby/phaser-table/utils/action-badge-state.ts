import { TableState } from '../../../game/game-state.service';
import { PotResult, Winner } from '../../../game/game-events';

export type BadgeKind =
  | 'none'
  | 'to-act'
  | 'fold'
  | 'check'
  | 'call'
  | 'bet'
  | 'raise'
  | 'all-in'
  | 'winner';

export interface BadgeState {
  kind: BadgeKind;
  /** Line 1 text. Empty when kind === 'none'. */
  line1: string;
  /** Line 2 text. Empty when not used (winner with hand description). */
  line2: string;
  /**
   * Monotonic per-seat freshness counter, used by the renderer to retrigger
   * fade animations on repeated actions. Equals tableState.actionSeq at the
   * moment the seat became the actor, or 0 otherwise.
   */
  actionSeq: number;
}

const NONE: BadgeState = { kind: 'none', line1: '', line2: '', actionSeq: 0 };
const MAX_DESC_CHARS = 28;

function formatCents(cents: number): string {
  return '$' + (cents / 100).toFixed(2);
}

function truncateDesc(s: string): string {
  if (s.length <= MAX_DESC_CHARS) return s;
  return s.substring(0, MAX_DESC_CHARS - 1) + '…';
}

function computeWinnerBadge(seatPos: number, potResults: PotResult[]): BadgeState | null {
  const wins: Array<{ pot: PotResult; winner: Winner }> = [];
  for (const pot of potResults) {
    for (const w of pot.winners) {
      if (w.seatPosition === seatPos) wins.push({ pot, winner: w });
    }
  }
  if (wins.length === 0) return null;

  const totalAmount = wins.reduce((sum, w) => sum + w.winner.amount, 0);
  const description = wins.reduce(
    (longest, w) => (w.pot.potAmount > (longest.pot.potAmount ?? 0) ? w : longest),
    wins[0],
  ).winner.handDescription;

  let line1: string;
  if (wins.length > 1) {
    line1 = `WON ${formatCents(totalAmount)} (${wins.length} pots)`;
  } else if (potResults.length > 1) {
    const potNumber = potResults.indexOf(wins[0].pot) + 1;
    line1 = `WON POT ${potNumber} — ${formatCents(wins[0].winner.amount)}`;
  } else {
    line1 = `WON ${formatCents(totalAmount)}`;
  }

  const line2 = description ? truncateDesc(description) : '';
  return { kind: 'winner', line1, line2, actionSeq: 0 };
}

export function computeBadgeState(
  seatPosition: number,
  tableState: TableState | null,
): BadgeState {
  if (!tableState) return NONE;

  // 1. Winner takes precedence over any in-progress action state.
  if (tableState.potResults && tableState.potResults.length > 0) {
    const winnerBadge = computeWinnerBadge(seatPosition, tableState.potResults);
    if (winnerBadge) return winnerBadge;
  }

  // 2. If this seat is the most recent actor, show their action. This must
  //    win over to-act because between `player-acted` and the next
  //    `action-on-player`, both flags are briefly true for this seat.
  const la = tableState.lastAction;
  if (la && la.seatPosition === seatPosition) {
    const seq = tableState.actionSeq;
    const seat = tableState.seatSummaries.get(seatPosition);
    const isAllIn = seat?.status === 'ALL_IN';
    const totalBet = seat?.currentBetAmount ?? 0;

    switch (la.action) {
      case 'fold':
        return { kind: 'fold', line1: 'FOLD', line2: '', actionSeq: seq };
      case 'check':
        return { kind: 'check', line1: 'CHECK', line2: '', actionSeq: seq };
      case 'call':
        // Display the total amount matched (the seat's currentBetAmount after
        // acting). This always equals the table's currentBet for a call and is
        // stable across subsequent action-on-player events.
        return isAllIn
          ? { kind: 'all-in', line1: 'ALL IN', line2: '', actionSeq: seq }
          : { kind: 'call', line1: `CALL ${formatCents(totalBet)}`, line2: '', actionSeq: seq };
      case 'bet':
        return isAllIn
          ? { kind: 'all-in', line1: 'ALL IN', line2: '', actionSeq: seq }
          : { kind: 'bet', line1: `BET ${formatCents(totalBet)}`, line2: '', actionSeq: seq };
      case 'raise':
        return isAllIn
          ? { kind: 'all-in', line1: 'ALL IN', line2: '', actionSeq: seq }
          : { kind: 'raise', line1: `RAISE → ${formatCents(totalBet)}`, line2: '', actionSeq: seq };
      default:
        return NONE;
    }
  }

  // 3. If this seat is the action position (and didn't just act), show TO ACT.
  if (tableState.actionPosition === seatPosition) {
    return { kind: 'to-act', line1: 'TO ACT', line2: '', actionSeq: 0 };
  }

  return NONE;
}
