# Design: Integrate Backend APIs

## Architecture Overview

This change integrates missing backend REST and WebSocket APIs into the React frontend, adding Account/Portfolio and Trading capabilities. The design follows the existing pattern of feature views with dedicated contexts for state management.

## Component Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        App.tsx                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Navigation (Add: Account, Trading)                   │  │
│  └───────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Existing Views: Market, Regime, Scanner, Risk, etc.  │  │
│  └───────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  NEW: AccountView                                      │  │
│  │    - AccountInfoCard (balance, account details)       │  │
│  │    - PortfolioTable (holdings with P&L)               │  │
│  └───────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  NEW: TradingView                                      │  │
│  │    - OrderForm (place orders: LO, MP, ATO, ATC)       │  │
│  │    - OrdersTable (view/cancel pending orders)         │  │
│  │    - OrderConfirmModal (confirmation dialog)          │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    Context Layer                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Account      │  │ Trading      │  │ Existing     │      │
│  │ Context      │  │ Context      │  │ Contexts     │      │
│  │ - account    │  │ - orders     │  │ (Market,     │      │
│  │ - portfolio  │  │ - placeOrder │  │  Positions,  │      │
│  │ - refresh    │  │ - cancelOrder│  │  Setups)     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    Services Layer                            │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  API Client (client.ts)                             │    │
│  │  - getAccountInfo()                                 │    │
│  │  - getPortfolio()                                   │    │
│  │  - placeOrder(request)                              │    │
│  │  - cancelOrder(orderId)                             │    │
│  │  - getHistoricalDaily(symbol, from, to)            │    │
│  │  - getHistoricalIntraday(symbol, interval, ...)   │    │
│  │  - getSymbolInfo(symbol)                            │    │
│  └─────────────────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  WebSocket Client (client.ts)                       │    │
│  │  - subscribe(topics[])                              │    │
│  │  - unsubscribe(topics[])                            │    │
│  │  - on(messageType, handler)                         │    │
│  │  Message Types:                                     │    │
│  │    - STOCK_INFO (real-time price/stats)            │    │
│  │    - TOP_PRICE (bid/ask queues)                    │    │
│  │    - OHLC (1m candle updates)                      │    │
│  │    - MARKET_INDEX (VN-Index updates)               │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

### Account & Portfolio Flow
```
1. User navigates to Account view
   └─> AccountView mounts
       └─> useAccount() hook
           └─> AccountContext.fetchAccount()
               └─> apiClient.getAccountInfo()
                   └─> Backend: GET /account/info
                       └─> Returns { accountNo, accountName, balance }
           └─> AccountContext.fetchPortfolio()
               └─> apiClient.getPortfolio()
                   └─> Backend: GET /account/portfolio
                       └─> Returns [{ symbol, quantity, avgPrice, ... }]
   
2. Context updates state
   └─> AccountView re-renders
       └─> AccountInfoCard displays balance
       └─> PortfolioTable displays holdings with calculated P&L

3. WebSocket updates (optional)
   └─> Receive STOCK_INFO messages for portfolio symbols
       └─> AccountContext.updateHoldingPrice(symbol, price)
           └─> Recalculate P&L in real-time
```

### Order Placement Flow
```
1. User navigates to Trading view
   └─> TradingView mounts
       └─> useTrading() hook
           └─> TradingContext.fetchOrders()
               └─> apiClient.getOrders() [NOT IN SPEC YET - ASSUME IT EXISTS]
   
2. User fills order form
   └─> Selects: symbol, side (BUY/SELL), type (LO/MP/ATO/ATC), quantity, price
       └─> OrderForm validates input
           └─> Check lot size (100 shares minimum for Vietnam)
           └─> Check price limits (ceiling/floor)
           └─> Check available balance (for BUY orders)
   
3. User clicks "Place Order"
   └─> OrderConfirmModal shows summary
       └─> User confirms
           └─> TradingContext.placeOrder(orderRequest)
               └─> apiClient.placeOrder(orderRequest)
                   └─> Backend: POST /orders
                       └─> Returns { orderId, status, message }
           └─> Context adds order to local state (PENDING)
           └─> Show success toast
   
4. WebSocket updates (optional)
   └─> Receive order status updates
       └─> TradingContext.updateOrderStatus(orderId, newStatus)
           └─> Update order in list (FILLED, CANCELLED, REJECTED)
```

### Historical Market Data Flow
```
1. User selects daily timeframe in Market Data view
   └─> MarketDataView.handleTimeframeChange("D")
       └─> useMarketData() hook
           └─> MarketDataContext.fetchHistoricalDaily(symbol, from, to)
               └─> apiClient.getHistoricalDaily(symbol, from, to)
                   └─> Backend: GET /market/history/daily?symbol=VNM&from=...&to=...
                       └─> Returns [{ date, open, high, low, close, volume }]
       └─> Chart component renders candlesticks
   
2. User selects intraday timeframe (1m, 5m, 15m)
   └─> MarketDataView.handleTimeframeChange("5m")
       └─> MarketDataContext.fetchHistoricalIntraday(symbol, "5m", from, to)
           └─> apiClient.getHistoricalIntraday(symbol, "5m", from, to)
               └─> Backend: GET /market/history/intraday?symbol=VNM&interval=5m&...
                   └─> Returns [{ timestamp, open, high, low, close, volume }]
   
3. Display symbol info
   └─> MarketDataContext.fetchSymbolInfo(symbol)
       └─> apiClient.getSymbolInfo(symbol)
           └─> Backend: GET /market/symbol/VNM
               └─> Returns { lastPrice, ceiling, floor, reference, ... }
       └─> Display in header: "VNM: 69.0 (+0.5 / +0.72%) | Ceiling: 73.8 | Floor: 64.2"
```

## State Management

### AccountContext State
```typescript
interface AccountContextValue {
  account: AccountInfo | null;      // { accountNo, accountName, balance }
  portfolio: PortfolioHolding[];    // [{ symbol, quantity, avgPrice, marketPrice, profit }]
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchAccount: () => Promise<void>;
  fetchPortfolio: () => Promise<void>;
  updateHoldingPrice: (symbol: string, price: number) => void;  // From WebSocket
}
```

### TradingContext State
```typescript
interface TradingContextValue {
  orders: Order[];                  // [{ orderId, symbol, side, type, quantity, price, status }]
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchOrders: () => Promise<void>;
  placeOrder: (request: OrderRequest) => Promise<{ orderId: string }>;
  cancelOrder: (orderId: string) => Promise<void>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;  // From WebSocket
}
```

## API Client Extensions

### New Methods
```typescript
// Account & Portfolio
async getAccountInfo(): Promise<AccountInfo>
  → GET /account/info

async getPortfolio(): Promise<PortfolioHolding[]>
  → GET /account/portfolio

// Trading
async placeOrder(request: OrderRequest): Promise<{ orderId: string; status: string; message: string }>
  → POST /orders
  Body: { symbol, side, orderType, quantity, price }

async cancelOrder(orderId: string): Promise<{ orderId: string; status: string; message: string }>
  → POST /orders/{orderId}/cancel

// Market Data
async getHistoricalDaily(symbol: string, from: string, to: string): Promise<DailyBar[]>
  → GET /market/history/daily?symbol={symbol}&from={from}&to={to}

async getHistoricalIntraday(symbol: string, interval: string, from: string, to: string): Promise<IntradayBar[]>
  → GET /market/history/intraday?symbol={symbol}&interval={interval}&from={from}&to={to}

async getSymbolInfo(symbol: string): Promise<SymbolInfo>
  → GET /market/symbol/{symbol}
```

## WebSocket Enhancements

### Subscription Management
```typescript
class WebSocketClient {
  private subscriptions: Set<string> = new Set();
  private messageHandlers: Map<string, ((data: any) => void)[]> = new Map();
  
  subscribe(topics: string[]): void {
    topics.forEach(topic => this.subscriptions.add(topic));
    this.send({
      action: 'subscribe',
      topics: topics
    });
  }
  
  unsubscribe(topics: string[]): void {
    topics.forEach(topic => this.subscriptions.delete(topic));
    this.send({
      action: 'unsubscribe',
      topics: topics
    });
  }
  
  on(messageType: 'STOCK_INFO' | 'TOP_PRICE' | 'OHLC' | 'MARKET_INDEX', handler: (data: any) => void): void {
    if (!this.messageHandlers.has(messageType)) {
      this.messageHandlers.set(messageType, []);
    }
    this.messageHandlers.get(messageType)!.push(handler);
  }
  
  private handleMessage(message: WebSocketMessage): void {
    const handlers = this.messageHandlers.get(message.type);
    if (handlers) {
      handlers.forEach(handler => handler(message.data));
    }
  }
}
```

### Topic Patterns
```
Stock quotes:      quotes/krx/mdds/v2/stockinfo/{symbol}
Top price:         quotes/krx/mdds/v2/topprice/{symbol}
OHLC bars:         quotes/krx/mdds/v2/ohlc/intraday/1m/{symbol}
Market index:      quotes/krx/mdds/v2/index/VNINDEX
```

## UI/UX Design

### Account View Layout
```
┌─────────────────────────────────────────────────────────────┐
│  Account Overview                                            │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ Account Info Card                                   │    │
│  │ Account No: 000123456                               │    │
│  │ Name: Nguyen Van A                                  │    │
│  │ Balance: 1,500,000,000 VND                          │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
│  Portfolio Holdings                                          │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ Symbol | Qty   | Avg Price | Market | P&L     | %   │    │
│  ├─────────────────────────────────────────────────────┤    │
│  │ HPG    | 10000 | 25,500   | 26,200  | +700K   | +2.7│    │
│  │ VNM    | 5000  | 68,000   | 69,100  | +550K   | +1.6│    │
│  │ FPT    | 2000  | 85,000   | 84,200  | -160K   | -0.9│    │
│  └─────────────────────────────────────────────────────┘    │
│  Total Portfolio Value: 1,842,500,000 VND                   │
│  Total Unrealized P&L: +1,090,000 VND (+0.06%)              │
└─────────────────────────────────────────────────────────────┘
```

### Trading View Layout
```
┌─────────────────────────────────────────────────────────────┐
│  Trading                                                     │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ Order Form                                          │    │
│  │ Symbol:   [VNM    ▼]                                │    │
│  │ Side:     [●BUY  ○SELL]                             │    │
│  │ Type:     [LO ▼]  (LO, MP, ATO, ATC)                │    │
│  │ Quantity: [1000___]  (min 100)                      │    │
│  │ Price:    [68.5___]  (Ceiling: 73.8, Floor: 64.2)   │    │
│  │ Est Cost: 68,500,000 VND                            │    │
│  │                                                      │    │
│  │ [Preview Order]                                     │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
│  Pending Orders                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ Order ID | Symbol | Side | Type | Qty | Price|Status│    │
│  ├─────────────────────────────────────────────────────┤    │
│  │ ORD-123  | HPG   | BUY  | LO   | 100 | 26.5 |PENDING│    │
│  │ ORD-124  | VNM   | SELL | LO   | 500 | 70.0 |PENDING│    │
│  └─────────────────────────────────────────────────────┘    │
│  [Cancel Selected]                                           │
└─────────────────────────────────────────────────────────────┘
```

## Styling Guidelines (Navy Theme)

All new components must follow the navy theme design system:

### Colors (from `src/index.css`)
```css
--bg: #071033           /* Deep navy background */
--panel: #0b1a3a        /* Panel background */
--accent: #1e4db3       /* Primary accent blue */
--text: #DDEBFF         /* Primary text */
--muted: #6b80a6        /* Muted text */
--success: #4ade80      /* Green for profit */
--danger: #ef4444       /* Red for loss */
--warning: #fbbf24      /* Yellow for warnings */
```

### Component Patterns
- **Cards**: Use `var(--panel)` background, `var(--border)` for subtle borders
- **Buttons**: Navy gradient `linear-gradient(135deg, var(--accent), var(--accent-dark))`
- **Tables**: Alternating row backgrounds, hover states with `var(--panel-elevated)`
- **Inputs**: Transparent background, bottom border, accent focus state
- **Status Colors**: Green for profit/buy, red for loss/sell, yellow for pending

### Example CSS
```css
.account-view {
  background: var(--bg);
  color: var(--text);
  padding: 2rem;
}

.account-info-card {
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
}

.portfolio-table {
  width: 100%;
  border-collapse: collapse;
}

.portfolio-table th {
  background: var(--panel-elevated);
  color: var(--muted);
  text-align: left;
  padding: 0.75rem;
  border-bottom: 2px solid var(--border);
}

.portfolio-table td {
  padding: 0.75rem;
  border-bottom: 1px solid var(--border);
}

.portfolio-table tr:hover {
  background: var(--panel-elevated);
}

.profit-positive {
  color: var(--success);
}

.profit-negative {
  color: var(--danger);
}

.order-form__input {
  background: transparent;
  border: none;
  border-bottom: 2px solid var(--border);
  color: var(--text);
  padding: 0.5rem 0;
  width: 100%;
}

.order-form__input:focus {
  border-bottom-color: var(--accent);
  outline: none;
}

.btn-place-order {
  background: linear-gradient(135deg, var(--accent), var(--accent-dark));
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s;
}

.btn-place-order:hover {
  transform: translateY(-2px);
}

.btn-cancel-order {
  background: transparent;
  color: var(--danger);
  border: 1px solid var(--danger);
  border-radius: 6px;
  padding: 0.5rem 1rem;
  cursor: pointer;
}
```

## Type Definitions

### Account Types
```typescript
interface AccountInfo {
  accountNo: string;        // "000123456"
  accountName: string;      // "Nguyen Van A"
  balance: number;          // 1500000000 (in VND)
}

interface PortfolioHolding {
  symbol: string;           // "HPG"
  quantity: number;         // 10000
  averagePrice: number;     // 25.5
  marketPrice: number;      // 26.2
  profit: number;           // 7000000
  profitPercent: number;    // 2.74
}
```

### Trading Types
```typescript
type OrderSide = 'BUY' | 'SELL';
type OrderType = 'LO' | 'MP' | 'ATO' | 'ATC';  // Limit, Market, At-The-Open, At-The-Close
type OrderStatus = 'PENDING' | 'FILLED' | 'PARTIALLY_FILLED' | 'CANCELLED' | 'REJECTED';

interface OrderRequest {
  symbol: string;           // "VNM"
  side: OrderSide;          // "BUY"
  orderType: OrderType;     // "LO"
  quantity: number;         // 100 (must be multiple of 100 for Vietnam)
  price?: number;           // 68.5 (optional for MP orders)
}

interface Order {
  orderId: string;          // "ORD-123456789"
  symbol: string;
  side: OrderSide;
  orderType: OrderType;
  quantity: number;
  price?: number;
  status: OrderStatus;
  message?: string;
  createdTime: string;      // ISO 8601
  filledQuantity?: number;  // For partial fills
}
```

### Market Data Types
```typescript
interface DailyBar {
  symbol: string;           // "VNM"
  date: string;             // "2023-10-27T00:00:00Z"
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  turnover: number;
}

interface IntradayBar {
  symbol: string;
  timestamp: string;        // "2023-10-27T10:30:00Z"
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface SymbolInfo {
  symbol: string;
  lastPrice: number;
  change: number;
  changePercent: number;
  ceiling: number;          // Upper price limit
  floor: number;            // Lower price limit
  reference: number;        // Reference price
  bidPrice: number;
  askPrice: number;
  volume: number;
  timestamp: string;
}
```

### WebSocket Message Types
```typescript
type WebSocketMessageType = 'STOCK_INFO' | 'TOP_PRICE' | 'OHLC' | 'MARKET_INDEX';

interface WebSocketMessage {
  type: WebSocketMessageType;
  data: StockInfoData | TopPriceData | OHLCData | MarketIndexData;
}

interface StockInfoData {
  symbol: string;
  lastPrice: number;
  change: number;
  changePercent: number;
  ceiling: number;
  floor: number;
  volume: number;
  hitCeiling: boolean;
  hitFloor: boolean;
  timestamp: string;
}

interface TopPriceData {
  symbol: string;
  bidPrice1: number;
  bidVolume1: number;
  askPrice1: number;
  askVolume1: number;
  timestamp: string;
}

interface OHLCData {
  symbol: string;
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
  value: number;
  change: number;
  timestamp: string;
}
```

## Error Handling

### API Errors
```typescript
try {
  await apiClient.placeOrder(orderRequest);
} catch (error) {
  if (error instanceof APIError) {
    if (error.status === 401) {
      // Unauthorized - redirect to login
      showError('Your session has expired. Please log in again.');
    } else if (error.status === 400) {
      // Validation error
      showError(error.data?.message || 'Invalid order parameters');
    } else if (error.status === 503) {
      // Service unavailable
      showError('Trading service is temporarily unavailable. Please try again later.');
    } else {
      showError('Failed to place order: ' + error.message);
    }
  }
}
```

### WebSocket Errors
```typescript
wsClient.on('error', (error) => {
  console.error('WebSocket error:', error);
  showError('Lost connection to market data. Reconnecting...');
});

wsClient.on('close', () => {
  // Attempt reconnection after 3 seconds
  setTimeout(() => {
    wsClient.connect();
    // Restore subscriptions
    wsClient.subscribe(Array.from(previousSubscriptions));
  }, 3000);
});
```

## Testing Strategy

### Unit Tests
- API client methods (mock fetch)
- Context reducers and actions
- Utility functions (price formatting, validation)

### Component Tests
- OrderForm validation
- PortfolioTable P&L calculations
- AccountInfoCard rendering

### Integration Tests
- AccountContext fetching and state updates
- TradingContext order placement flow
- WebSocket message routing

### E2E Tests
- Complete order placement flow
- Account view data loading
- Real-time price updates

## Performance Considerations

### Optimization Strategies
1. **Lazy Loading**: Account and Trading views loaded only when navigated to
2. **Memoization**: Use `useMemo` for P&L calculations in portfolio
3. **Throttling**: Throttle WebSocket price updates to 1 update per second per symbol
4. **Selective Subscriptions**: Only subscribe to symbols visible in current view
5. **Pagination**: If order history grows large, paginate orders table

### Memory Management
- Unsubscribe from WebSocket topics when component unmounts
- Clear large data arrays (historical bars) when switching symbols
- Implement virtual scrolling for tables with >100 rows

## Security Considerations

### Order Placement
- Always show confirmation modal before placing orders
- Validate order parameters client-side (lot size, price limits)
- Display estimated cost prominently to prevent fat-finger errors
- Rate limit order placement (max 10 orders per minute)

### Data Privacy
- Never log account numbers or sensitive data
- Mask account number in UI (show last 4 digits only)
- Clear sensitive data from state on logout

### Authentication
- Check for valid JWT token before API calls
- Handle 401 responses gracefully (redirect to login)
- Implement token refresh mechanism if backend supports it

## Rollback Plan

If issues arise after deployment:
1. Disable new views via feature flag (hide "Account" and "Trading" nav items)
2. Revert API client changes if causing errors
3. Fall back to mock data for development/testing
4. Roll back WebSocket enhancements if causing connection issues

Feature flags:
```typescript
const ENABLE_ACCOUNT_VIEW = import.meta.env.VITE_ENABLE_ACCOUNT_VIEW !== 'false';
const ENABLE_TRADING_VIEW = import.meta.env.VITE_ENABLE_TRADING_VIEW !== 'false';
```

## Future Enhancements (Out of Scope)

- Order modification (amend price/quantity)
- Advanced order types (OCO, trailing stop)
- Order history view (closed orders)
- Trade journal integration
- Portfolio analytics (sector allocation, performance over time)
- Alerts for price targets
- Multi-account support
