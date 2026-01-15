/**
 * MQTT Type Definitions for Real-Time Market Data
 */

// ============================================================================
// Connection Types
// ============================================================================

/**
 * MQTT connection status
 */
export type MQTTConnectionStatus = 
  | 'disconnected' 
  | 'connecting' 
  | 'connected' 
  | 'reconnecting' 
  | 'error';

/**
 * MQTT subscription options
 */
export interface MQTTSubscriptionOptions {
  topic: string;
  qos?: 0 | 1 | 2;
}

// ============================================================================
// Message Types
// ============================================================================

/**
 * MQTT message type identifiers from DNSE broker
 */
export type MQTTMessageType = 
  | 'MARKET_INDEX'
  | 'STOCK_INFO'
  | 'TOP_PRICE'
  | 'BOARD_EVENT'
  | 'OHLC'
  | 'TICK';

/**
 * Base message structure for all MQTT messages
 */
export interface MQTTBaseMessage<T extends MQTTMessageType, P> {
  type: T;
  payload: P;
}

// ============================================================================
// Payload Types
// ============================================================================

/**
 * Market Index payload - Index information (VNINDEX, VN30, etc.)
 */
export interface MarketIndexPayload {
  /** Index code (e.g., "VNINDEX", "VN30") */
  indexCode: string;
  
  /** Current index value */
  indexValue: number;
  
  /** Previous close value */
  priorIndexValue?: number;
  
  /** Change from previous close */
  change?: number;
  
  /** Percentage change */
  changePercent?: number;
  
  /** Total trading volume */
  totalVolume?: number;
  
  /** Total trading value */
  totalValue?: number;
  
  /** Number of advancing stocks */
  advances?: number;
  
  /** Number of declining stocks */
  declines?: number;
  
  /** Number of unchanged stocks */
  noChanges?: number;
  
  /** Timestamp of the data */
  time?: number;
}

/**
 * Stock Info payload - Stock price information
 */
export interface StockInfoPayload {
  /** Stock symbol */
  symbol: string;
  
  /** Current price */
  price: number;
  
  /** Reference price */
  refPrice?: number;
  
  /** Ceiling price */
  ceilingPrice?: number;
  
  /** Floor price */
  floorPrice?: number;
  
  /** Open price */
  open?: number;
  
  /** High price */
  high?: number;
  
  /** Low price */
  low?: number;
  
  /** Close/last price */
  close?: number;
  
  /** Trading volume */
  volume?: number;
  
  /** Trading value */
  value?: number;
  
  /** Price change */
  change?: number;
  
  /** Price change percentage */
  changePercent?: number;
  
  /** Timestamp */
  time?: number;
}

/**
 * Top Price payload - Bid/Offer information
 */
export interface TopPricePayload {
  /** Stock symbol */
  symbol: string;
  
  /** Best bid prices (up to 3 levels) */
  bidPrices: number[];
  
  /** Best bid volumes */
  bidVolumes: number[];
  
  /** Best offer/ask prices (up to 3 levels) */
  offerPrices: number[];
  
  /** Best offer/ask volumes */
  offerVolumes: number[];
  
  /** Timestamp */
  time?: number;
}

/**
 * Board Event payload - Session change events
 */
export interface BoardEventPayload {
  /** Event type (e.g., "SESSION_CHANGE", "HALT", "RESUME") */
  eventType: string;
  
  /** Board/exchange identifier */
  board?: string;
  
  /** Session name (e.g., "ATO", "CONTINUOUS", "ATC") */
  session?: string;
  
  /** Event description */
  description?: string;
  
  /** Timestamp */
  time?: number;
}

/**
 * OHLC payload - Candlestick information
 */
export interface OHLCPayload {
  /** Stock symbol or index code */
  symbol: string;
  
  /** Open price */
  open: number;
  
  /** High price */
  high: number;
  
  /** Low price */
  low: number;
  
  /** Close price */
  close: number;
  
  /** Volume */
  volume?: number;
  
  /** Candle timestamp (start of period) */
  time: number;
  
  /** Candle interval (e.g., "1m", "5m", "1h", "1d") */
  interval?: string;
}

/**
 * Tick payload - Order matching information
 */
export interface TickPayload {
  /** Stock symbol */
  symbol: string;
  
  /** Match price */
  price: number;
  
  /** Match volume */
  volume: number;
  
  /** Cumulative volume */
  totalVolume?: number;
  
  /** Match type ("BUY" | "SELL" | "UNKNOWN") */
  side?: 'BUY' | 'SELL' | 'UNKNOWN';
  
  /** Timestamp */
  time: number;
}

// ============================================================================
// Message Type Aliases
// ============================================================================

export type MarketIndexMessage = MQTTBaseMessage<'MARKET_INDEX', MarketIndexPayload>;
export type StockInfoMessage = MQTTBaseMessage<'STOCK_INFO', StockInfoPayload>;
export type TopPriceMessage = MQTTBaseMessage<'TOP_PRICE', TopPricePayload>;
export type BoardEventMessage = MQTTBaseMessage<'BOARD_EVENT', BoardEventPayload>;
export type OHLCMessage = MQTTBaseMessage<'OHLC', OHLCPayload>;
export type TickMessage = MQTTBaseMessage<'TICK', TickPayload>;

/**
 * Union type of all MQTT messages
 */
export type MQTTMessage = 
  | MarketIndexMessage
  | StockInfoMessage
  | TopPriceMessage
  | BoardEventMessage
  | OHLCMessage
  | TickMessage;

// ============================================================================
// Handler Types
// ============================================================================

/**
 * Generic message handler callback
 */
export type MQTTMessageHandler<T = MQTTMessage> = (message: T) => void;

/**
 * Typed message handlers for specific message types
 */
export interface MQTTTypedHandlers {
  onMarketIndex?: MQTTMessageHandler<MarketIndexMessage>;
  onStockInfo?: MQTTMessageHandler<StockInfoMessage>;
  onTopPrice?: MQTTMessageHandler<TopPriceMessage>;
  onBoardEvent?: MQTTMessageHandler<BoardEventMessage>;
  onOHLC?: MQTTMessageHandler<OHLCMessage>;
  onTick?: MQTTMessageHandler<TickMessage>;
}

// ============================================================================
// Index Subscription Types
// ============================================================================

/**
 * Index subscription state
 */
export interface IndexSubscription {
  /** Index code */
  indexCode: string;
  
  /** Full topic path */
  topic: string;
  
  /** Whether this is a default subscription */
  isDefault: boolean;
  
  /** Subscription timestamp */
  subscribedAt: Date;
}

/**
 * Index quote data (derived from MarketIndexPayload)
 */
export interface IndexQuote {
  indexCode: string;
  value: number;
  change: number;
  changePercent: number;
  volume?: number;
  lastUpdated: Date;
}
