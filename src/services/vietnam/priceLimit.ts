/**
 * Vietnam Price Limit Validation
 * Handles ±7% (HOSE) and ±10% (HNX) daily price limits
 */

export type Exchange = 'HOSE' | 'HNX';

export interface PriceLimitResult {
  valid: boolean;
  reason?: string;
  floor: number;
  ceiling: number;
}

/**
 * Calculate price floor and ceiling based on reference price
 */
export function calculatePriceLimits(
  referencePrice: number,
  exchange: Exchange
): { floor: number; ceiling: number } {
  const limit = exchange === 'HOSE' ? 0.07 : 0.10;
  
  return {
    floor: referencePrice * (1 - limit),
    ceiling: referencePrice * (1 + limit)
  };
}

/**
 * Validate if a price is within daily limits
 */
export function validatePrice(
  price: number,
  referencePrice: number,
  exchange: Exchange
): PriceLimitResult {
  const { floor, ceiling } = calculatePriceLimits(referencePrice, exchange);
  
  if (price < floor) {
    return {
      valid: false,
      reason: `Price ${price} below ${exchange} daily limit floor ${floor.toFixed(0)}`,
      floor,
      ceiling
    };
  }
  
  if (price > ceiling) {
    return {
      valid: false,
      reason: `Price ${price} above ${exchange} daily limit ceiling ${ceiling.toFixed(0)}`,
      floor,
      ceiling
    };
  }
  
  return { valid: true, floor, ceiling };
}

/**
 * Validate stop loss price against daily limits
 * Critical for risk management
 */
export function validateStopPrice(
  entryPrice: number,
  stopPrice: number,
  exchange: Exchange
): PriceLimitResult {
  const { floor } = calculatePriceLimits(entryPrice, exchange);
  
  if (stopPrice < floor) {
    const limitPercent = exchange === 'HOSE' ? '7%' : '10%';
    return {
      valid: false,
      reason: `Stop ${stopPrice} exceeds -${limitPercent} ${exchange} daily limit (floor: ${floor.toFixed(0)})`,
      floor,
      ceiling: 0
    };
  }
  
  return { valid: true, floor, ceiling: 0 };
}

/**
 * Get distance from entry to limit as percentage
 */
export function getDistanceToLimit(
  entryPrice: number,
  stopPrice: number,
  _exchange: Exchange
): number {
  return Math.abs((stopPrice - entryPrice) / entryPrice);
}

/**
 * Check if stop is approaching the daily limit (within 1%)
 */
export function isApproachingLimit(
  entryPrice: number,
  stopPrice: number,
  exchange: Exchange
): boolean {
  const distance = getDistanceToLimit(entryPrice, stopPrice, exchange);
  const limit = exchange === 'HOSE' ? 0.07 : 0.10;
  
  // Within 1% of hitting the limit
  return distance > (limit - 0.01);
}
