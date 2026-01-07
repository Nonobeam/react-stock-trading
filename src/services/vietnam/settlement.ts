/**
 * Vietnam T+2 Settlement Calculator
 * Trades settle on T+2 (two business days after trade date)
 * Actually T+2.5 considering next day 9am cut-off
 */

/**
 * Check if a date is a weekend
 */
function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6; // Sunday or Saturday
}

/**
 * Add business days to a date (skipping weekends)
 */
function addBusinessDays(date: Date, days: number): Date {
  const result = new Date(date);
  let addedDays = 0;
  
  while (addedDays < days) {
    result.setDate(result.getDate() + 1);
    if (!isWeekend(result)) {
      addedDays++;
    }
  }
  
  return result;
}

/**
 * Calculate settlement date for a trade
 * @param tradeDate - The date the trade was executed
 * @returns Settlement date (T+2 business days)
 */
export function calculateSettlementDate(tradeDate: Date = new Date()): Date {
  return addBusinessDays(tradeDate, 2);
}

/**
 * Calculate when buying power will be available
 * For sells: T+2 settlement
 * For buys: Immediate (but can't sell until T+2)
 */
export function calculateBuyingPowerAvailable(
  tradeDate: Date,
  isSell: boolean
): Date {
  if (isSell) {
    return calculateSettlementDate(tradeDate);
  }
  
  // For buys, capital is immediately locked but can't sell until T+2
  return tradeDate;
}

/**
 * Check if shares are settled and can be sold
 */
export function canSellShares(purchaseDate: Date, now: Date = new Date()): boolean {
  const settlementDate = calculateSettlementDate(purchaseDate);
  return now >= settlementDate;
}

/**
 * Get days until settlement
 */
export function getDaysUntilSettlement(tradeDate: Date, now: Date = new Date()): number {
  const settlementDate = calculateSettlementDate(tradeDate);
  
  if (now >= settlementDate) {
    return 0;
  }
  
  // Count business days
  let days = 0;
  const current = new Date(now);
  
  while (current < settlementDate) {
    current.setDate(current.getDate() + 1);
    if (!isWeekend(current)) {
      days++;
    }
  }
  
  return days;
}
