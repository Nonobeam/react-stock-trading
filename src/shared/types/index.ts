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

// ============================================================================
// Account & Portfolio Types
// ============================================================================

export interface AccountInfo {
  accountNo: string;        // "000123456"
  accountName: string;      // "Nguyen Van A"
  balance: number;          // 1500000000 (VND)
}

export interface PortfolioHolding {
  symbol: string;           // "HPG"
  quantity: number;         // 10000
  averagePrice: number;     // 25.5 (thousand VND)
  marketPrice: number;      // 26.2 (thousand VND)
  profit: number;           // 7000000 (VND)
  profitPercent: number;    // 2.74
}

// ============================================================================
// Trading / Order Types
// ============================================================================

export type OrderSide = 'BUY' | 'SELL';
export type OrderType = 'LO' | 'MP' | 'ATO' | 'ATC';  // Limit, Market, At-The-Open, At-The-Close
export type OrderStatus = 'PENDING' | 'FILLED' | 'PARTIALLY_FILLED' | 'CANCELLED' | 'REJECTED';

export interface OrderRequest {
  symbol: string;           // "VNM"
  side: OrderSide;          // "BUY"
  orderType: OrderType;     // "LO"
  quantity: number;         // 1000 (must be multiple of 100 for Vietnam)
  price?: number;           // 68.5 (optional for MP orders)
}

export interface Order {
  orderId: string;          // "ORD-123456789"
  symbol: string;
  side: OrderSide;
  orderType: OrderType;
  quantity: number;
  price?: number;
  status: OrderStatus;
  message?: string;
  createdTime: string;      // ISO 8601 timestamp
  timestamp: number;        // Unix timestamp for sorting
  filledQuantity?: number;  // For partial fills
  filledPrice?: number;     // Actual execution price
}

// ============================================================================
// Market Data Types (Historical & Symbol Info)
// ============================================================================

export interface DailyBar {
  symbol: string;           // "VNM"
  date: string;             // "2023-10-27T00:00:00Z" (ISO 8601)
  open: number;             // 68.5 (thousand VND)
  high: number;             // 69.2
  low: number;              // 68.1
  close: number;            // 69.0
  volume: number;           // 1500000 (shares)
  turnover: number;         // 10350000000 (VND)
}

export interface IntradayBar {
  symbol: string;           // "VNM"
  timestamp: string;        // "2023-10-27T10:30:00Z"
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface SymbolInfo {
  symbol: string;           // "VNM"
  lastPrice: number;        // 69.0 (thousand VND)
  change: number;           // 0.5 (absolute change)
  changePercent: number;    // 0.72 (percentage)
  ceiling: number;          // 73.8 (max price for the day)
  floor: number;            // 64.2 (min price for the day)
  reference: number;        // 69.0 (reference price)
  bidPrice: number;         // 68.9 (best bid)
  askPrice: number;         // 69.1 (best ask)
  volume: number;           // 2000000 (total shares traded)
  timestamp: string;        // ISO 8601
}

// ============================================================================
// Enhanced WebSocket Message Types
// ============================================================================

export type WebSocketMessageType = 'STOCK_INFO' | 'TOP_PRICE' | 'OHLC' | 'MARKET_INDEX' | 'ORDER_UPDATE';

export interface WebSocketMessage {
  type: WebSocketMessageType;
  data: StockInfoData | TopPriceData | OHLCData | MarketIndexData | Order;
}

export interface StockInfoData {
  symbol: string;           // "VNM"
  lastPrice: number;        // 69.1 (thousand VND)
  change: number;           // 0.6 (absolute change)
  changePercent: number;    // 0.87 (percentage)
  ceiling: number;          // 73.8
  floor: number;            // 64.2
  volume: number;           // 2005000
  hitCeiling: boolean;      // false
  hitFloor: boolean;        // false
  timestamp: string;        // ISO 8601
}

export interface TopPriceData {
  symbol: string;           // "VNM"
  bidPrice1: number;        // 69.0
  bidVolume1: number;       // 5000
  askPrice1: number;        // 69.1
  askVolume1: number;       // 2000
  timestamp: string;
}

export interface OHLCData {
  symbol: string;           // "VNM"
  interval: string;         // "1m"
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  timestamp: string;
}

export interface MarketIndexData {
  indexName: string;        // "VNINDEX"
  value: number;            // 1150.25
  change: number;           // 5.5
  timestamp: string;
}
