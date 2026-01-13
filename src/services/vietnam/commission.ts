/**
 * Vietnam Commission & Tax Calculation
 * 
 * Vietnam stock market fees:
 * - Entry commission: 0.25% (minimum 500 VND)
 * - Exit commission: 0.25% (minimum 500 VND)
 * - Exit tax: 0.1%
 * - T+2 settlement system
 */

export const COMMISSION_RATE = 0.0025; // 0.25%
export const TAX_RATE = 0.001; // 0.1%
export const MIN_COMMISSION = 500; // VND

/**
 * Calculate entry commission for buying shares
 * 
 * @param entryValue - Total value of shares being purchased (price * quantity)
 * @returns Commission amount in VND
 */
export function calculateEntryCommission(entryValue: number): number {
  if (entryValue <= 0) return 0;
  
  const commission = entryValue * COMMISSION_RATE;
  return Math.max(commission, MIN_COMMISSION);
}

/**
 * Calculate exit commission for selling shares
 * 
 * @param exitValue - Total value of shares being sold (price * quantity)
 * @returns Commission amount in VND
 */
export function calculateExitCommission(exitValue: number): number {
  if (exitValue <= 0) return 0;
  
  const commission = exitValue * COMMISSION_RATE;
  return Math.max(commission, MIN_COMMISSION);
}

/**
 * Calculate exit tax on stock sales
 * 
 * @param exitValue - Total value of shares being sold (price * quantity)
 * @returns Tax amount in VND
 */
export function calculateExitTax(exitValue: number): number {
  if (exitValue <= 0) return 0;
  
  return exitValue * TAX_RATE;
}

/**
 * Calculate total entry cost including commission
 * 
 * @param price - Entry price per share
 * @param quantity - Number of shares
 * @returns Object with entry value, commission, and total cost
 */
export function calculateEntryCost(price: number, quantity: number) {
  const entryValue = price * quantity;
  const commission = calculateEntryCommission(entryValue);
  const totalCost = entryValue + commission;
  
  return {
    entryValue,
    commission,
    totalCost
  };
}

/**
 * Calculate total exit proceeds after commission and tax
 * 
 * @param price - Exit price per share
 * @param quantity - Number of shares
 * @returns Object with exit value, commission, tax, and net proceeds
 */
export function calculateExitProceeds(price: number, quantity: number) {
  const exitValue = price * quantity;
  const commission = calculateExitCommission(exitValue);
  const tax = calculateExitTax(exitValue);
  const netProceeds = exitValue - commission - tax;
  
  return {
    exitValue,
    commission,
    tax,
    netProceeds
  };
}

/**
 * Calculate net profit/loss for a completed trade
 * 
 * @param entryPrice - Entry price per share
 * @param exitPrice - Exit price per share
 * @param quantity - Number of shares
 * @returns Object with all costs and net P&L
 */
export function calculateNetPnL(
  entryPrice: number,
  exitPrice: number,
  quantity: number
) {
  const entryCost = calculateEntryCost(entryPrice, quantity);
  const exitProceeds = calculateExitProceeds(exitPrice, quantity);
  
  const grossPnL = exitProceeds.exitValue - entryCost.entryValue;
  const totalCosts = entryCost.commission + exitProceeds.commission + exitProceeds.tax;
  const netPnL = grossPnL - totalCosts;
  const netPnLPercent = (netPnL / entryCost.totalCost) * 100;
  
  return {
    entryCost: entryCost.totalCost,
    entryCommission: entryCost.commission,
    exitValue: exitProceeds.exitValue,
    exitCommission: exitProceeds.commission,
    exitTax: exitProceeds.tax,
    netProceeds: exitProceeds.netProceeds,
    grossPnL,
    totalCosts,
    netPnL,
    netPnLPercent
  };
}

/**
 * Calculate breakeven price considering all costs
 * 
 * @param entryPrice - Entry price per share
 * @param quantity - Number of shares
 * @returns Breakeven price per share
 */
export function calculateBreakevenPrice(
  entryPrice: number,
  quantity: number
): number {
  const entryCost = calculateEntryCost(entryPrice, quantity);
  
  // Breakeven: exitValue - exitCommission - exitTax = entryCost.totalCost
  // exitValue * (1 - COMMISSION_RATE - TAX_RATE) - MIN_COMMISSION = entryCost.totalCost
  // exitValue = (entryCost.totalCost + MIN_COMMISSION) / (1 - COMMISSION_RATE - TAX_RATE)
  
  const netRate = 1 - COMMISSION_RATE - TAX_RATE;
  const breakeven = (entryCost.totalCost + MIN_COMMISSION) / (quantity * netRate);
  
  return Math.round(breakeven * 100) / 100; // Round to 2 decimals
}

/**
 * Calculate R-multiple for a position
 * 
 * @param entryPrice - Entry price per share
 * @param currentPrice - Current/exit price per share
 * @param stopPrice - Initial stop loss price per share
 * @param quantity - Number of shares
 * @returns R-multiple value
 */
export function calculateRMultiple(
  entryPrice: number,
  currentPrice: number,
  stopPrice: number,
  quantity: number
): number {
  const entryCost = calculateEntryCost(entryPrice, quantity);
  const currentValue = currentPrice * quantity;
  const stopValue = stopPrice * quantity;
  
  const riskAmount = entryCost.totalCost - stopValue;
  const currentPnL = currentValue - entryCost.totalCost;
  
  if (riskAmount <= 0) return 0;
  
  return currentPnL / riskAmount;
}
