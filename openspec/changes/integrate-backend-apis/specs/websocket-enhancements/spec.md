# WebSocket Enhancements

## MODIFIED Requirements

### Requirement: Enhanced WebSocket Subscription Management
**Priority**: P0  
**Dependencies**: Backend WebSocket server at `ws://localhost:8080/ws`

The system SHALL support subscribing and unsubscribing to multiple topic patterns for real-time market data.

#### Scenario: Subscribe to Multiple Topics on Connect
**Given** WebSocket connection established  
**When** MarketDataView needs VNM quotes and VN-Index updates  
**Then** the system:
- Calls `wsClient.subscribe([
    "quotes/krx/mdds/v2/stockinfo/VNM",
    "quotes/krx/mdds/v2/index/VNINDEX"
  ])`
- Sends subscription message:
  ```json
  {
    "action": "subscribe",
    "topics": [
      "quotes/krx/mdds/v2/stockinfo/VNM",
      "quotes/krx/mdds/v2/index/VNINDEX"
    ]
  }
  ```
- Tracks subscriptions in internal `Set<string>`
- Starts receiving messages for those topics

#### Scenario: Unsubscribe from Topics on Component Unmount
**Given** MarketDataView subscribed to VNM topics  
**When** user navigates away (component unmounts)  
**Then** the system:
- Calls `wsClient.unsubscribe(["quotes/krx/mdds/v2/stockinfo/VNM"])`
- Sends unsubscription message:
  ```json
  {
    "action": "unsubscribe",
    "topics": ["quotes/krx/mdds/v2/stockinfo/VNM"]
  }
  ```
- Removes topics from internal subscription set
- Stops receiving messages for those topics

#### Scenario: Restore Subscriptions After Reconnect
**Given** WebSocket connected with active subscriptions: VNM, HPG, VNINDEX  
**When** connection drops and reconnects  
**Then** the system:
- Detects reconnection event
- Reads stored subscriptions from `Set`
- Automatically resubscribes to all topics:
  ```json
  {
    "action": "subscribe",
    "topics": [
      "quotes/krx/mdds/v2/stockinfo/VNM",
      "quotes/krx/mdds/v2/stockinfo/HPG",
      "quotes/krx/mdds/v2/index/VNINDEX"
    ]
  }
  ```
- Resumes real-time updates without user intervention

---

### Requirement: Message Type Routing
**Priority**: P0  
**Dependencies**: None

The system SHALL route incoming WebSocket messages to registered handlers based on message type.

#### Scenario: Register Handler for STOCK_INFO Messages
**Given** MarketDataContext needs to handle stock price updates  
**When** context initializes  
**Then** the system:
- Calls `wsClient.on('STOCK_INFO', (data) => { updateSymbolInfo(data) })`
- Stores handler in `messageHandlers` Map: `"STOCK_INFO" => [handler1, handler2, ...]`
- Allows multiple handlers for same message type

#### Scenario: Route STOCK_INFO Message to Handlers
**Given** two handlers registered for STOCK_INFO (MarketDataView, AccountView)  
**When** WebSocket receives message:
```json
{
  "type": "STOCK_INFO",
  "data": {
    "symbol": "VNM",
    "lastPrice": 69.2,
    "change": 0.7,
    "changePercent": 1.01,
    "timestamp": "2023-10-27T11:01:00Z"
  }
}
```  
**Then** the system:
- Parses message and identifies type: "STOCK_INFO"
- Looks up handlers in `messageHandlers.get("STOCK_INFO")`
- Calls all registered handlers with `data` object
- MarketDataView updates header price
- AccountView updates portfolio holding price (if VNM held)

#### Scenario: Handle Unknown Message Type
**Given** WebSocket receives message with type "ORDER_UPDATE" (not yet supported)  
**When** message is parsed  
**Then** the system:
- Checks `messageHandlers.has("ORDER_UPDATE")`
- Finds no registered handlers
- Logs warning: "No handler registered for message type: ORDER_UPDATE"
- Does not throw error (graceful degradation)

---

### Requirement: Support STOCK_INFO Messages
**Priority**: P0  
**Dependencies**: Backend WebSocket topics

The system SHALL process STOCK_INFO messages for real-time price and stats updates.

#### Scenario: Process STOCK_INFO Message
**Given** subscribed to `quotes/krx/mdds/v2/stockinfo/VNM`  
**When** WebSocket receives:
```json
{
  "type": "STOCK_INFO",
  "data": {
    "symbol": "VNM",
    "lastPrice": 69.1,
    "change": 0.6,
    "changePercent": 0.87,
    "ceiling": 73.8,
    "floor": 64.2,
    "volume": 2005000,
    "hitCeiling": false,
    "hitFloor": false,
    "timestamp": "2023-10-27T11:00:05Z"
  }
}
```  
**Then** registered handlers receive data and can:
- Update symbol info display
- Update portfolio holding prices
- Update chart indicators
- Trigger alerts if price hits targets

#### Scenario: Detect Ceiling Hit
**Given** STOCK_INFO message with `hitCeiling: true`  
**When** handlers process message  
**Then** the system:
- Displays "🔴 CEILING" badge in symbol header
- Highlights price in red
- Optionally shows notification: "VNM has hit ceiling price 73.8"

---

### Requirement: Support TOP_PRICE Messages
**Priority**: P1  
**Dependencies**: Backend WebSocket topics

The system SHALL process TOP_PRICE messages for bid/ask queue updates.

#### Scenario: Process TOP_PRICE Message
**Given** subscribed to `quotes/krx/mdds/v2/topprice/VNM`  
**When** WebSocket receives:
```json
{
  "type": "TOP_PRICE",
  "data": {
    "symbol": "VNM",
    "bidPrice1": 69.0,
    "bidVolume1": 5000,
    "askPrice1": 69.1,
    "askVolume1": 2000,
    "timestamp": "2023-10-27T11:00:05Z"
  }
}
```  
**Then** registered handlers can:
- Update bid/ask spread display
- Calculate spread percentage: (69.1 - 69.0) / 69.0 = 0.14%
- Display order book depth (if UI implemented)

#### Scenario: Display Best Bid/Ask
**Given** TOP_PRICE data received  
**When** symbol header renders  
**Then** the system displays:
- **Bid**: 69,000 VND (5,000 shares) in green
- **Ask**: 69,100 VND (2,000 shares) in red
- **Spread**: 100 VND (0.14%)

---

### Requirement: Support OHLC Messages
**Priority**: P1  
**Dependencies**: Backend WebSocket topics

The system SHALL process OHLC messages for real-time 1-minute bar updates.

#### Scenario: Process OHLC Message
**Given** subscribed to `quotes/krx/mdds/v2/ohlc/intraday/1m/VNM`  
**When** WebSocket receives new 1-minute bar:
```json
{
  "type": "OHLC",
  "data": {
    "symbol": "VNM",
    "interval": "1m",
    "open": 69.0,
    "high": 69.1,
    "low": 69.0,
    "close": 69.1,
    "volume": 1500,
    "timestamp": "2023-10-27T11:01:00Z"
  }
}
```  
**Then** registered handlers can:
- Append bar to chart data (if 1m chart active)
- Update aggregated 5m/15m bars if needed
- Update volume indicators

#### Scenario: Aggregate 1m Bars to 5m
**Given** chart displays 5-minute bars  
**When** five 1-minute OHLC messages received (11:01, 11:02, 11:03, 11:04, 11:05)  
**Then** the system:
- Aggregates into single 5m bar:
  - Open: first 1m bar's open (11:01 open)
  - High: max of all 5 bars' highs
  - Low: min of all 5 bars' lows
  - Close: last 1m bar's close (11:05 close)
  - Volume: sum of all 5 bars' volumes
- Appends aggregated bar to chart

---

### Requirement: Support MARKET_INDEX Messages
**Priority**: P1  
**Dependencies**: Backend WebSocket topics

The system SHALL process MARKET_INDEX messages for VN-Index updates.

#### Scenario: Process MARKET_INDEX Message
**Given** subscribed to `quotes/krx/mdds/v2/index/VNINDEX`  
**When** WebSocket receives:
```json
{
  "type": "MARKET_INDEX",
  "data": {
    "indexName": "VNINDEX",
    "value": 1150.25,
    "change": 5.5,
    "timestamp": "2023-10-27T11:00:05Z"
  }
}
```  
**Then** registered handlers can:
- Update index display in header
- Show "Market Up +5.5 pts" indicator
- Color-code: green if change > 0, red if change < 0

#### Scenario: Display Market Index in Dashboard
**Given** MARKET_INDEX data received  
**When** dashboard header renders  
**Then** the system displays:
- **VN-Index**: 1,150.25
- **Change**: +5.50 (+0.48%) in **green**
- **Icon**: ▲ (up arrow)

---

### Requirement: Connection State Management
**Priority**: P0  
**Dependencies**: None

The system SHALL manage WebSocket connection state and handle reconnections gracefully.

#### Scenario: Detect Connection Loss
**Given** WebSocket connected and receiving messages  
**When** connection drops (network issue, server restart)  
**Then** the system:
- Detects `close` event
- Updates connection status to "Disconnected"
- Shows notification: "Lost connection to market data. Reconnecting..."
- Triggers automatic reconnection after 3 seconds

#### Scenario: Automatic Reconnection
**Given** connection lost  
**When** 3 seconds elapsed  
**Then** the system:
- Attempts to reconnect: `wsClient.connect()`
- On success:
  - Updates status to "Connected"
  - Restores subscriptions (see earlier scenario)
  - Shows success notification: "Reconnected to market data"
- On failure:
  - Waits another 5 seconds
  - Retries with exponential backoff (max 30s)

#### Scenario: Max Reconnection Attempts
**Given** connection lost and 5 reconnection attempts failed  
**When** max retries reached  
**Then** the system:
- Updates status to "Connection Failed"
- Shows error: "Unable to connect to market data. Please refresh the page."
- Provides "Retry Now" button for manual reconnection
- Stops automatic retries

---

### Requirement: Throttle Message Processing
**Priority**: P1  
**Dependencies**: None

The system SHALL throttle high-frequency messages to prevent UI performance issues.

#### Scenario: Throttle STOCK_INFO Updates
**Given** STOCK_INFO messages arriving at 10 updates per second  
**When** WebSocket processes messages  
**Then** the system:
- Throttles handler calls to max 1 per second per symbol
- Discards intermediate updates if arriving faster
- Always processes the latest update (not first)
- Prevents excessive re-renders

#### Scenario: No Throttling for Critical Messages
**Given** OHLC message with completed bar  
**When** message received  
**Then** the system:
- Processes immediately without throttling
- Ensures chart updates promptly (bars don't aggregate properly if dropped)

---

### Requirement: Error Handling
**Priority**: P0  
**Dependencies**: None

The system SHALL handle WebSocket errors gracefully without crashing the application.

#### Scenario: Handle Malformed Message
**Given** WebSocket receives invalid JSON  
**When** message parser fails  
**Then** the system:
- Catches JSON parse error
- Logs error: "Failed to parse WebSocket message: {raw message}"
- Does not crash
- Continues processing subsequent messages

#### Scenario: Handle Missing Message Type
**Given** WebSocket receives message without `type` field  
**When** router attempts to route message  
**Then** the system:
- Logs warning: "Received message without type field"
- Does not call any handlers
- Does not crash

---

### Requirement: Navy Theme Consistency
**Priority**: P1  
**Dependencies**: Design System

WebSocket-related UI elements SHALL follow the navy theme.

#### Scenario: Connection Status Indicator
**Given** ConnectionStatus component displays WebSocket state  
**When** rendered in navigation bar  
**Then** the component uses:
- **Connected**: `var(--success)` (#4ade80) green dot
- **Disconnected**: `var(--danger)` (#ef4444) red dot
- **Connecting**: `var(--warning)` (#fbbf24) yellow dot, blinking animation
- **Text**: `var(--muted)` (#6b80a6)
- **Background**: Transparent

---

## Type Definitions

```typescript
type WebSocketMessageType = 'STOCK_INFO' | 'TOP_PRICE' | 'OHLC' | 'MARKET_INDEX';

interface WebSocketMessage {
  type: WebSocketMessageType;
  data: StockInfoData | TopPriceData | OHLCData | MarketIndexData;
}

interface StockInfoData {
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

interface TopPriceData {
  symbol: string;           // "VNM"
  bidPrice1: number;        // 69.0
  bidVolume1: number;       // 5000
  askPrice1: number;        // 69.1
  askVolume1: number;       // 2000
  timestamp: string;
}

interface OHLCData {
  symbol: string;           // "VNM"
  interval: string;         // "1m"
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  timestamp: string;
}

interface MarketIndexData {
  indexName: string;        // "VNINDEX"
  value: number;            // 1150.25
  change: number;           // 5.5
  timestamp: string;
}

interface WebSocketClient {
  subscribe(topics: string[]): void;
  unsubscribe(topics: string[]): void;
  on(messageType: WebSocketMessageType, handler: (data: any) => void): void;
  off(messageType: WebSocketMessageType, handler: (data: any) => void): void;
  connect(): void;
  disconnect(): void;
  getConnectionState(): 'CONNECTED' | 'CONNECTING' | 'DISCONNECTED';
}
```

## Topic Patterns

```
Stock quotes:      quotes/krx/mdds/v2/stockinfo/{symbol}
Top price:         quotes/krx/mdds/v2/topprice/{symbol}
OHLC bars:         quotes/krx/mdds/v2/ohlc/intraday/1m/{symbol}
Market index:      quotes/krx/mdds/v2/index/VNINDEX
```
