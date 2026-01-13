/**
 * Backtest Models - Configuration and results
 */

export interface BacktestConfig {
  id: string;
  name: string;
  
  // Basic Settings
  dateRange: {
    from: string; // ISO 8601
    to: string;   // ISO 8601
  };
  symbols: string[];            // ['VCB', 'HPG', ...] or ['VN30']
  startingCapital: number;      // VND
  
  // Strategy Parameters
  setupTypes: string[];         // ['pullback-20ema', 'breakout', ...]
  fastEMA: number;
  slowEMA: number;
  rsiPeriod: number;
  atrPeriod: number;
  minimumScore: number;
  requireVolumeConfirmation: boolean;
  requireTrendAlignment: boolean;
  
  // Risk Management
  stopLossMethod: 'atr' | 'percentage' | 'technical';
  atrMultiplier: number;
  percentageStop?: number;
  
  // Targets & Exits
  target1: { rMultiple: number; exitPercent: number }; // e.g., 2R, 25%
  target2: { rMultiple: number; exitPercent: number }; // e.g., 3R, 25%
  target3: { method: 'trail' | 'fixed'; value: number | string }; // trail with 20EMA
  
  // Position Sizing
  riskPerTrade: number;         // % of capital
  maxPositions: number;
  maxAggregateRisk: number;
  
  // Costs (Vietnam-specific)
  commission: number;           // default 0.25%
  tax: number;                  // default 0.1%
  slippage: number;             // default 0.3%
  
  createdAt: string; // ISO 8601
}

export interface BacktestResults {
  configId: string;
  
  // Summary Metrics
  summary: BacktestSummary;
  
  // Equity Curve
  equityCurve: EquityPoint[];
  
  // Trade List
  trades: BacktestTrade[];
  
  // Analytics
  analytics: BacktestAnalytics;
  
  // Comparison
  benchmark: BenchmarkData;
  
  executedAt: string; // ISO 8601
}

export interface BacktestSummary {
  totalReturn: number;        // %
  totalReturnVND: number;
  annualReturn: number;       // CAGR %
  winRate: number;            // %
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  profitFactor: number;
  expectancy: number;         // R-multiple
  maxDrawdown: number;        // %
  sharpeRatio: number;
  avgWin: number;             // R-multiple
  avgLoss: number;            // R-multiple
  avgWinToLoss: number;       // ratio
}

export interface EquityPoint {
  date: string; // ISO 8601
  equity: number;
  drawdown: number; // %
}

export interface BacktestTrade {
  tradeNumber: number;
  symbol: string;
  entryDate: string;
  entryPrice: number;
  exitDate: string;
  exitPrice: number;
  shares: number;
  daysHeld: number;
  netPL: number;
  plPercent: number;
  rMultiple: number;
  exitReason: string;
  mfe: number; // Max Favorable Excursion
  mae: number; // Max Adverse Excursion
}

export interface BacktestAnalytics {
  bySetupType: SetupPerformance[];
  byHoldingPeriod: HoldingPeriodAnalysis[];
  rMultipleDistribution: { bucket: string; count: number }[];
  monthlyReturns: { month: string; return: number }[];
  maeVsRMultiple: { mae: number; rMultiple: number }[];
}

export interface SetupPerformance {
  setupType: string;
  trades: number;
  winRate: number;
  avgRMultiple: number;
  totalRMultiple: number;
  bestTrade: number;
}

export interface HoldingPeriodAnalysis {
  daysRange: string; // e.g., "1-7 days"
  trades: number;
  winRate: number;
  avgRMultiple: number;
}

export interface BenchmarkData {
  name: string;               // "VN-Index Buy & Hold"
  return: number;
  maxDrawdown: number;
  sharpeRatio: number;
}

/**
 * Default backtest configuration
 */
export function createDefaultBacktestConfig(name: string): BacktestConfig {
  const now = new Date();
  const threeYearsAgo = new Date(now);
  threeYearsAgo.setFullYear(now.getFullYear() - 3);

  return {
    id: `backtest-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name,
    dateRange: {
      from: threeYearsAgo.toISOString(),
      to: now.toISOString(),
    },
    symbols: ['VN30'], // Default to VN30 index stocks
    startingCapital: 100000000, // 100M VND
    setupTypes: ['pullback-20ema', 'pullback-50ema', 'breakout'],
    fastEMA: 20,
    slowEMA: 50,
    rsiPeriod: 14,
    atrPeriod: 14,
    minimumScore: 7,
    requireVolumeConfirmation: true,
    requireTrendAlignment: true,
    stopLossMethod: 'atr',
    atrMultiplier: 2.0,
    target1: { rMultiple: 2.0, exitPercent: 25 },
    target2: { rMultiple: 3.0, exitPercent: 25 },
    target3: { method: 'trail', value: '20EMA' },
    riskPerTrade: 1.5,
    maxPositions: 6,
    maxAggregateRisk: 6.0,
    commission: 0.25,
    tax: 0.1,
    slippage: 0.3,
    createdAt: new Date().toISOString(),
  };
}
