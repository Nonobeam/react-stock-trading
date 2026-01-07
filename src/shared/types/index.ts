/**
 * Core TypeScript Type Definitions for GST
 */

// ============================================================================
// Market Data Types
// ============================================================================

export interface OHLCVBar {
  time: number;        // Unix timestamp
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface TechnicalIndicators {
  rsi: number;
  macd: {
    value: number;
    signal: number;
    histogram: number;
  };
  stochastic: {
    k: number;
    d: number;
  };
  adx: number;
  atr: number;
  sma: Record<number, number>;  // { 20: 85000, 50: 82000 }
  ema: Record<number, number>;
  bollingerBands: {
    upper: number;
    middle: number;
    lower: number;
  };
  vwap: number;
  obv?: number;
}

// ============================================================================
// Market Regime Types
// ============================================================================

export type MarketRegimeType = 'BULL' | 'BEAR' | 'RANGE' | 'TRANSITION';

export interface MarketRegime {
  regime: MarketRegimeType;
  score: number;       // 3-12
  confidence?: number;  // 0-1
  changeDate?: number;  // Unix timestamp of regime change
  factors: {
    trend: number;
    momentum: number;
    volatility: number;
    volumeTrend: number;
  };
  breakdown: {
    adx: number;       // 0-3
    directional: number;  // 0-3
    volatility: number;   // 0-3
    volume: number;       // 0-3
  };
  vnIndexStatus: {
    value: number;
    change: number;
    aboveMA50: boolean;
  };
  recommendation: string;
  positionMultiplier: number;  // 0-1
}

// ============================================================================
// Trade Setup Types
// ============================================================================

export type SetupType = 'PULLBACK' | 'BREAKOUT' | 'CROSSOVER' | 'MEAN_REVERSION';
export type ConfidenceLevel = 'HIGH' | 'MEDIUM' | 'LOW';

export interface TradeSetup {
  id: string;
  symbol: string;
  setupType: SetupType;
  score: number;       // 0-13
  scoreBreakdown: {
    trend: number;     // 0-3
    setup: number;     // 0-3
    momentum: number;  // 0-2
    riskReward: number;  // 0-2
    context: number;   // 0-3
  };
  entry: number;
  stop: number;
  targets: number[];
  riskRewardRatio: number;
  confidence: ConfidenceLevel;
  narrative: string;
  triggers: string[];
  chart?: OHLCVBar[];
}

// ============================================================================
// Risk Calculation Types
// ============================================================================

export interface RiskCalculationParams {
  capital: number;
  riskPercent: number;
  entryPrice: number;
  stopPrice: number;
  exchange: 'HOSE' | 'HNX';
}

export interface RiskCalculation {
  capital: number;
  riskPercent: number;
  entryPrice: number;
  stopPrice: number;
  
  // Calculated
  positionSize: number;     // Shares
  positionValue: number;    // VND
  riskAmount: number;       // VND
  actualRiskPercent: number;
  riskRewardRatio: number;
  viable: boolean;
  warnings: string[];
}

// ============================================================================
// Position Types
// ============================================================================

export interface PositionTarget {
  price: number;
  size: number;
  hit: boolean;
}

export interface StopAdjustment {
  date: string;
  price: number;
  reason: string;
  method: string;
}

export type TrailingStopMethod = 'ATR' | 'EMA' | 'PERCENTAGE' | 'SWING_LOW';

export interface TrailingSuggestion {
  price: number;
  method: TrailingStopMethod;
  reason: string;
  riskReduction: number;
}

export interface Position {
  id: string;
  symbol: string;
  entryPrice: number;
  entryDate: string;
  size: number;
  currentPrice: number;
  currentStop: number;
  targets: PositionTarget[];
  
  // Metrics
  unrealizedPL: number;
  unrealizedPLPercent: number;
  rMultiple: number;
  daysHeld: number;
  
  // Stop management
  stopHistory: StopAdjustment[];
  trailingSuggestions: TrailingSuggestion[];
  
  // Alerts
  isStagnant?: boolean;
  stagnantDays?: number;
  stopHit?: boolean;
  targetHit?: boolean;
  
  // Status
  status: 'PROFIT' | 'LOSS' | 'BREAKEVEN';
}

export interface PortfolioSummary {
  totalPositions: number;
  totalValue: number;
  totalUnrealizedPL: number;
  totalUnrealizedPLPercent: number;
  avgRMultiple: number;
  totalCapitalAtRisk: number;
  riskPercent: number;
  bestPerformer?: {
    symbol: string;
    pl: number;
  };
  worstPerformer?: {
    symbol: string;
    pl: number;
  };
}

export interface StopAdjustmentRequest {
  positionId: string;
  newStop: number;
  method: string;
  reason: string;
}

export interface ClosePositionRequest {
  positionId: string;
  shares?: number;  // If undefined, close all
  reason: string;
}

// ============================================================================
// Performance Metrics Types
// ============================================================================

export interface PerformanceMetrics {
  totalTrades: number;
  winRate: number;
  expectancy: number;
  profitFactor: number;
  sharpeRatio: number;
  sortinoRatio: number;
  calmarRatio: number;
  maxDrawdown: number;
  maxDrawdownDuration: number;
  recoveryFactor: number;
  avgWin: number;
  avgLoss: number;
  largestWin: number;
  largestLoss: number;
  consecutiveWins: number;
  consecutiveLosses: number;
  
  // Distributions
  rMultipleDistribution: Record<string, number>;
  setupTypeDistribution: Record<string, {
    winRate: number;
    avgR: number;
    count: number;
  }>;
  regimeDistribution: Record<string, {
    winRate: number;
    avgR: number;
    count: number;
  }>;
}

export interface EquityPoint {
  date: Date;
  equity: number;
  return: number;
}

// ============================================================================
// WebSocket Message Types
// ============================================================================

export interface PriceUpdateMessage {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  timestamp: number;
}

export interface MarketIndexMessage {
  index: string;
  value: number;
  change: number;
  changePercent: number;
  timestamp: number;
}

export interface TickMessage {
  symbol: string;
  price: number;
  volume: number;
  side: 'BUY' | 'SELL';
  timestamp: number;
}

// ============================================================================
// UI State Types
// ============================================================================

export type TimeInterval = 'D' | 'W' | '4H' | '1H' | '15m';

export interface ChartSettings {
  interval: TimeInterval;
  showVolume: boolean;
  indicators: {
    sma: number[];
    ema: number[];
    showBollinger: boolean;
    showVWAP: boolean;
  };
}

export interface FilterSettings {
  minScore: number;
  setupTypes: SetupType[];
  sectors: string[];
}
