// 9-max position names, clockwise from dealer:
// BTN, SB, BB, UTG, UTG+1, MP, LJ, HJ, CO
const POSITION_NAMES_9 = ['BTN', 'SB', 'BB', 'UTG', 'UTG+1', 'MP', 'LJ', 'HJ', 'CO'];

export function getPositionName(
  seatIndex: number,
  dealerPosition: number,
  totalSeats: number
): string {
  if (dealerPosition < 0) return `Seat ${seatIndex + 1}`;
  const offset = (seatIndex - dealerPosition + totalSeats) % totalSeats;
  return POSITION_NAMES_9[offset] ?? `Seat ${seatIndex + 1}`;
}
