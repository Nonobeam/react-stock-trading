/**
 * Dashboard API Type Definitions
 * Types for dashboard-specific API responses
 */

// ============================================================================
// Market Data Types
// ============================================================================

/** Data point for time series charts */
export interface DataPoint {
  timestamp: number;
  value: number;
}

/** Index data with chart points */
export interface IndexData {
  name: string;
  value: number;
  change: number;
  changePercent: number;
  data: DataPoint[];
}

/** Response from GET /api/market/indices */
export interface MarketIndicesResponse {
  vnIndex: IndexData;
  vn30: IndexData;
  vn100: IndexData;
  lastUpdate: string;
}

/** Response from GET /api/market/indices/{key}/history */
export interface IndexHistoryResponse {
  name: string;
  data: DataPoint[];
}

/** Response from GET /api/market/regime */
export interface MarketRegimeResponse {
  regime: 'trending-up' | 'trending-down' | 'choppy' | 'volatile';
  regimeScore: number;
  breadth: {
    advances: number;
    declines: number;
    unchanged: number;
  };
  marketStatus: 'pre-market' | 'open' | 'closed' | 'ato' | 'atc';
  lastUpdate: string;
}

/** Response from GET /api/market/quote/{symbol} */
export interface StockQuoteResponse {
  symbol: string;
  price: number;
  open: number;
  high: number;
  low: number;
  volume: number;
  change: number;
  changePercent: number;
  ceiling: number;
  floor: number;
  lastUpdate: string;
}

// ============================================================================
// Account Types
// ============================================================================

/** Response from GET /api/account/info */
export interface AccountInfoResponse {
  capital: number;
  cash: number;
  lockedCash: number;
  positionsValue: number;
  buyingPower: number;
  marginUsed: number;
  marginAvailable: number;
}

/** Response from GET /api/account/summary */
export interface AccountSummaryResponse {
  totalPnL: number;
  totalPnLPercent: number;
  dayPnL: number;
  dayPnLPercent: number;
  riskExposure: number;
  riskPercent: number;
}

// ============================================================================
// Positions Types
// ============================================================================

/** Position status indicator */
export type PositionStatus = 'green' | 'yellow' | 'red';

/** Single position from API */
export interface PositionResponse {
  id: string;
  symbol: string;
  name: string;
  exchange: 'HOSE' | 'HNX';
  shares: number;
  entryPrice: number;
  currentPrice: number;
  entryDate: string;
  stopPrice: number;
  targetPrice: number;
  entryValue: number;
  currentValue: number;
  grossPnL: number;
  netPnL: number;
  netPnLPercent: number;
  rMultiple: number;
  risk: number;
  status: PositionStatus;
  daysHeld: number;
}

/** Response from GET /api/positions/active */
export interface ActivePositionsResponse {
  positions: PositionResponse[];
}

/** Response from GET /api/positions/summary */
export interface PositionsSummaryResponse {
  totalPositions: number;
  totalValue: number;
  totalPnL: number;
  totalPnLPercent: number;
  avgRMultiple: number;
  totalRisk: number;
  riskPercent: number;
}

// ============================================================================
// Signals Types
// ============================================================================

/** Signal type */
export type SignalType = 'buy' | 'sell' | 'watch';

/** Signal strength */
export type SignalStrength = 'weak' | 'moderate' | 'strong';

/** Single signal from API */
export interface SignalResponse {
  id: string;
  symbol: string;
  name: string;
  exchange: 'HOSE' | 'HNX';
  currentPrice: number;
  signalType: SignalType;
  strength: SignalStrength;
  score: number;
  indicators: string[];
  generatedAt: string;
  expiresAt: string;
  reason: string;
}

/** Response from GET /api/signals */
export interface SignalsListResponse {
  signals: SignalResponse[];
  count: number;
}

/** Query options for signals API */
export interface SignalsQueryOptions {
  limit?: number;
  sort?: 'score' | 'generatedAt';
  type?: SignalType;
  strength?: SignalStrength;
}

// ============================================================================
// Watchlist Types
// ============================================================================

/** Watchlist item from API */
export interface WatchlistItemResponse {
  symbol: string;
  addedAt: number;
  isFavorite: boolean;
  price?: number;
  change?: number;
  changePercent?: number;
  sparklineData?: number[];
}

/** Response from GET /api/watchlist */
export interface WatchlistResponse {
  items: WatchlistItemResponse[];
}

/** Response from POST /api/watchlist */
export interface WatchlistAddResponse {
  symbol: string;
  isFavorite: boolean;
  message: string;
}

/** Response from DELETE /api/watchlist/{symbol} */
export interface WatchlistRemoveResponse {
  symbol: string;
  message: string;
}

/** Response from PATCH /api/watchlist/{symbol}/favorite */
export interface WatchlistFavoriteResponse {
  symbol: string;
  isFavorite: boolean;
  message: string;
}

// ============================================================================
// Recommendation Types
// ============================================================================

/** Request body for POST /api/recommendations */
export interface RecommendationRequest {
  IncludePortfolio: boolean;
  IncludeMarketRegime: boolean;
  IncludeSignals: boolean;
}

/** Recommendation action */
export type RecommendationAction = 'buy' | 'sell' | 'hold';

/** Recommendation timeframe */
export type RecommendationTimeframe = 'short-term' | 'medium-term' | 'long-term';

/** Response from POST /api/recommendations */
export interface RecommendationResponse {
  symbol: string;
  action: RecommendationAction;
  confidence: number;
  rationale: string;
  targetPrice?: number;
  stopLoss?: number;
  timeframe?: RecommendationTimeframe;
  generatedAt: string;
}
