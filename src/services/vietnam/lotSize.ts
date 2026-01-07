/**
 * Vietnam Lot Size Adjustment
 * Vietnam stocks trade in minimum lots of 100 shares
 */

export const LOT_SIZE = 100;

/**
 * Round down to nearest lot size (100 shares)
 */
export function adjustToLotSize(shares: number): number {
  return Math.floor(shares / LOT_SIZE) * LOT_SIZE;
}

/**
 * Calculate number of lots
 */
export function calculateLots(shares: number): number {
  return Math.floor(shares / LOT_SIZE);
}

/**
 * Check if shares are lot-size compliant
 */
export function isValidLotSize(shares: number): boolean {
  return shares % LOT_SIZE === 0 && shares > 0;
}

/**
 * Get the difference after lot size adjustment
 */
export function getLotSizeAdjustment(original: number): {
  adjusted: number;
  difference: number;
  lots: number;
} {
  const adjusted = adjustToLotSize(original);
  return {
    adjusted,
    difference: original - adjusted,
    lots: calculateLots(adjusted)
  };
}
