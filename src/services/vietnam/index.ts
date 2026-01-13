/**
 * Vietnam Market Rules - Main Export
 * Centralized access to all Vietnam market-specific logic
 */

export * from './priceLimit';
export * from './lotSize';
export * from './tradingSession';
export * from './settlement';
export * from './commission';
export * from './positionSize';

// Re-export commonly used functions
export {
  validateStopPrice,
  validatePrice,
  calculatePriceLimits,
  type Exchange,
  type PriceLimitResult
} from './priceLimit';

export {
  adjustToLotSize,
  calculateLots,
  isValidLotSize,
  LOT_SIZE
} from './lotSize';

export {
  getCurrentSession,
  isMarketOpen,
  canPlaceOrder,
  type TradingSession,
  type SessionInfo
} from './tradingSession';

export {
  calculateSettlementDate,
  canSellShares,
  getDaysUntilSettlement
} from './settlement';

export {
  calculateEntryCommission,
  calculateExitCommission,
  calculateExitTax,
  calculateEntryCost,
  calculateExitProceeds,
  calculateNetPnL,
  calculateBreakevenPrice,
  COMMISSION_RATE,
  TAX_RATE,
  MIN_COMMISSION
} from './commission';

export {
  calculatePositionSize,
  calculatePositionValue,
  calculateMaxPositionSize,
  calculateRMultiple,
  calculatePortfolioHeat,
  calculateSharesForValue
} from './positionSize';
