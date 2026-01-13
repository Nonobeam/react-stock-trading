/**
 * Mock Account Data Service
 * Generates realistic Vietnamese trading account data
 */

export interface AccountData {
  capital: number; // Total account value
  cash: number; // Available cash
  lockedCash: number; // Cash locked in pending orders
  positionsValue: number; // Current value of all positions
  totalPnL: number; // Total unrealized P&L
  totalPnLPercent: number; // P&L as percentage
  dayPnL: number; // Today's P&L
  dayPnLPercent: number; // Today's P&L percentage
  riskExposure: number; // Total risk in VND
  riskPercent: number; // Risk as % of capital
  buyingPower: number; // Available buying power
  marginUsed: number; // Margin currently used
  marginAvailable: number; // Available margin
}

/**
 * Generate realistic account data
 */
export function generateAccountData(
  baseCapital: number = 100_000_000, // 100M VND default
  positionsValue: number = 45_000_000,
  totalPnL: number = 2_500_000
): AccountData {
  const capital = baseCapital + totalPnL;
  const lockedCash = Math.floor(Math.random() * 5_000_000); // 0-5M locked
  const cash = capital - positionsValue - lockedCash;
  const totalPnLPercent = (totalPnL / baseCapital) * 100;
  
  // Day P&L is a fraction of total (simulate today's movement)
  const dayPnL = Math.floor((Math.random() - 0.5) * 1_000_000); // -500K to +500K
  const dayPnLPercent = (dayPnL / capital) * 100;
  
  // Risk exposure (typically 3-6% of capital for 2-4 positions)
  const riskExposure = Math.floor(capital * (Math.random() * 0.03 + 0.03)); // 3-6%
  const riskPercent = (riskExposure / capital) * 100;
  
  // Buying power (cash + available margin)
  const marginAvailable = cash * 0.5; // Assume 2:1 margin
  const marginUsed = positionsValue * 0.3; // Assume 30% margin usage
  const buyingPower = cash + marginAvailable;
  
  return {
    capital: Math.round(capital),
    cash: Math.round(cash),
    lockedCash: Math.round(lockedCash),
    positionsValue: Math.round(positionsValue),
    totalPnL: Math.round(totalPnL),
    totalPnLPercent: Math.round(totalPnLPercent * 100) / 100,
    dayPnL: Math.round(dayPnL),
    dayPnLPercent: Math.round(dayPnLPercent * 100) / 100,
    riskExposure: Math.round(riskExposure),
    riskPercent: Math.round(riskPercent * 100) / 100,
    buyingPower: Math.round(buyingPower),
    marginUsed: Math.round(marginUsed),
    marginAvailable: Math.round(marginAvailable)
  };
}

/**
 * Update account data based on position changes
 */
export function updateAccountFromPositions(
  baseAccount: AccountData,
  positions: Array<{ value: number; pnl: number; risk: number }>
): AccountData {
  const positionsValue = positions.reduce((sum, p) => sum + p.value, 0);
  const totalPnL = positions.reduce((sum, p) => sum + p.pnl, 0);
  const riskExposure = positions.reduce((sum, p) => sum + p.risk, 0);
  
  const capital = baseAccount.capital + totalPnL;
  const cash = capital - positionsValue;
  const totalPnLPercent = (totalPnL / baseAccount.capital) * 100;
  const riskPercent = (riskExposure / capital) * 100;
  
  return {
    ...baseAccount,
    capital: Math.round(capital),
    cash: Math.round(cash),
    positionsValue: Math.round(positionsValue),
    totalPnL: Math.round(totalPnL),
    totalPnLPercent: Math.round(totalPnLPercent * 100) / 100,
    riskExposure: Math.round(riskExposure),
    riskPercent: Math.round(riskPercent * 100) / 100
  };
}

/**
 * Create mock performance metrics
 */
export interface PerformanceMetrics {
  winRate: number; // Percentage of winning trades
  profitFactor: number; // Gross profit / gross loss
  avgWin: number; // Average winning trade
  avgLoss: number; // Average losing trade
  avgRMultiple: number; // Average R-multiple
  largestWin: number;
  largestLoss: number;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  expectancy: number; // Expected value per trade
}

export function generatePerformanceMetrics(): PerformanceMetrics {
  const totalTrades = Math.floor(Math.random() * 50) + 50; // 50-100 trades
  const winRate = Math.random() * 0.25 + 0.45; // 45-70% win rate
  const winningTrades = Math.floor(totalTrades * winRate);
  const losingTrades = totalTrades - winningTrades;
  
  const avgWin = Math.floor(Math.random() * 2_000_000) + 1_000_000; // 1M-3M
  const avgLoss = Math.floor(Math.random() * 1_000_000) + 500_000; // 500K-1.5M
  
  const grossProfit = winningTrades * avgWin;
  const grossLoss = losingTrades * avgLoss;
  const profitFactor = grossProfit / Math.max(grossLoss, 1);
  
  const expectancy = ((winRate * avgWin) - ((1 - winRate) * avgLoss));
  const avgRMultiple = avgWin / Math.max(avgLoss, 1);
  
  return {
    winRate: Math.round(winRate * 10000) / 100,
    profitFactor: Math.round(profitFactor * 100) / 100,
    avgWin: Math.round(avgWin),
    avgLoss: Math.round(avgLoss),
    avgRMultiple: Math.round(avgRMultiple * 100) / 100,
    largestWin: Math.round(avgWin * 2.5),
    largestLoss: Math.round(avgLoss * 2),
    totalTrades,
    winningTrades,
    losingTrades,
    expectancy: Math.round(expectancy)
  };
}
