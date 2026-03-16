export interface SeatPosition {
  x: number;
  y: number;
}

// Seat angles in degrees — 0 is at the right (3 o'clock), clockwise.
// These are arranged to place seat 0 at bottom-center (the current user's seat)
// and distribute the rest around an ellipse.
const SEAT_ANGLES_DEG: number[] = [
  90,    // 0: bottom center (current user)
  135,   // 1: bottom-left
  170,   // 2: left-lower
  190,   // 3: left-upper
  225,   // 4: top-left
  270,   // 5: top center
  315,   // 6: top-right
  350,   // 7: right-upper
  10,    // 8: right-lower
];

export const MAX_SEATS = 9;

export function getSeatPosition(
  index: number,
  cx: number,
  cy: number,
  rx: number,
  ry: number
): SeatPosition {
  const angleDeg = SEAT_ANGLES_DEG[index % MAX_SEATS];
  const angleRad = (angleDeg * Math.PI) / 180;
  return {
    x: cx + rx * Math.cos(angleRad),
    y: cy + ry * Math.sin(angleRad),
  };
}

export function getAllSeatPositions(
  cx: number,
  cy: number,
  rx: number,
  ry: number
): SeatPosition[] {
  return Array.from({ length: MAX_SEATS }, (_, i) =>
    getSeatPosition(i, cx, cy, rx, ry)
  );
}
