/**
 * Vietnam Position Sizing Calculator
 * 
 * Calculates optimal position sizes based on:
 * - Account capital
 * - Risk percentage per trade
 * - Entry and stop loss prices
 * - Vietnam lot size rules (100 shares per lot)
 */

import { adjustToLotSize } from './lotSize';

/**
 * Calculate position size based on risk parameters
 * 
 * Formula: shares = (capital * riskPercent) / (entryPrice - stopPrice)
 * Then adjust to nearest lot size (round down)
 * 
 * @param capital - Total account capital in VND
 * @param riskPercent - Risk percentage (e.g., 1.5 for 1.5%)
 * @param entryPrice - Entry price per share
 * @param stopPrice - Stop loss price per share
 * @returns Number of shares (adjusted to lot size)
 */
export function calculatePositionSize(
  capital: number,
  riskPercent: number,
  entryPrice: number,
  stopPrice: number
): number {
  if (capital <= 0 || riskPercent <= 0 || entryPrice <= stopPrice) {
    return 0;
  }
  
  const riskAmount = capital * (riskPercent / 100);
  const riskPerShare = entryPrice - stopPrice;
  const shares = Math.floor(riskAmount / riskPerShare);
  
  // Adjust to lot size (round down to nearest 100)
  return adjustToLotSize(shares);
}

/**
 * Calculate position value in VND
 * 
 * @param shares - Number of shares
 * @param price - Price per share
 * @returns Total position value
 */
export function calculatePositionValue(shares: number, price: number): number {
  return shares * price;
}

/**
 * Calculate maximum position size based on capital
 * Ensures position doesn't exceed a percentage of total capital
 * 
 * @param capital - Total account capital
 * @param maxPositionPercent - Maximum position size as % of capital (default 20%)
 * @param price - Entry price per share
 * @returns Maximum shares allowed (adjusted to lot size)
 */
export function calculateMaxPositionSize(
  capital: number,
  price: number,
  maxPositionPercent: number = 20
): number {
  if (capital <= 0 || price <= 0) {
    return 0;
  }
  
  const maxValue = capital * (maxPositionPercent / 100);
  const shares = Math.floor(maxValue / price);
  
  return adjustToLotSize(shares);
}

/**
 * Calculate R-multiple for a position
 * R-multiple = (currentPrice - entryPrice) / (entryPrice - stopPrice)
 * 
 * @param entryPrice - Entry price per share
 * @param stopPrice - Stop loss price
 * @param currentPrice - Current market price
 * @returns R-multiple value
 */
export function calculateRMultiple(
  entryPrice: number,
  stopPrice: number,
  currentPrice: number
): number {
  const risk = entryPrice - stopPrice;
  if (risk <= 0) return 0;
  
  const profit = currentPrice - entryPrice;
  return profit / risk;
}

/**
 * Calculate portfolio heat (total risk exposure)
 * Sum of all position risks as % of capital
 * 
 * @param positions - Array of positions with their risk amounts
 * @param capital - Total account capital
 * @returns Total portfolio heat as percentage
 */
export function calculatePortfolioHeat(
  positions: Array<{ shares: number; entryPrice: number; stopPrice: number }>,
  capital: number
): number {
  if (capital <= 0) return 0;
  
  const totalRisk = positions.reduce((sum, pos) => {
    const riskPerShare = Math.max(0, pos.entryPrice - pos.stopPrice);
    const positionRisk = pos.shares * riskPerShare;
    return sum + positionRisk;
  }, 0);
  
  return (totalRisk / capital) * 100;
}

/**
 * Calculate shares needed for a specific capital allocation
 * 
 * @param targetValue - Target position value in VND
 * @param price - Entry price per share
 * @returns Shares adjusted to lot size
 */
export function calculateSharesForValue(
  targetValue: number,
  price: number
): number {
  if (targetValue <= 0 || price <= 0) {
    return 0;
  }
  
  const shares = Math.floor(targetValue / price);
  return adjustToLotSize(shares);
}
