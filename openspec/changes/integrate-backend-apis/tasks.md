# Implementation Tasks: Integrate Backend APIs

## Overview
This document outlines the sequential tasks for integrating missing backend REST and WebSocket APIs into the frontend, adding Account/Portfolio and Trading views.

**Total Estimated Time:** 11 days (1 developer, full-time)

---

## Phase 1: API Client Extensions (Days 1-2)

### Account & Portfolio Endpoints
- [ ] **T1-001**: Add type definitions to `src/shared/types/index.ts`
  - `AccountInfo` interface (accountNo, accountName, balance)
  - `PortfolioHolding` interface (symbol, quantity, avgPrice, marketPrice, profit, profitPercent)
  - Export types

- [ ] **T1-002**: Add API client methods to `src/services/api/client.ts`
  - `async getAccountInfo(): Promise<AccountInfo>` → GET /account/info
  - `async getPortfolio(): Promise<PortfolioHolding[]>` → GET /account/portfolio
  - Add JSDoc comments for each method

- [ ] **T1-003**: Test account API methods
  - Create mock responses for testing
  - Test error handling (401, 404, 500)
  - Verify JWT token is sent in headers

### Trading Endpoints
- [ ] **T1-004**: Add trading type definitions to `src/shared/types/index.ts`
  - `OrderSide` type ('BUY' | 'SELL')
  - `OrderType` type ('LO' | 'MP' | 'ATO' | 'ATC')
  - `OrderStatus` type (PENDING, FILLED, etc.)
  - `OrderRequest` interface
  - `Order` interface
  - Export types

- [ ] **T1-005**: Add trading API methods to `src/services/api/client.ts`
  - `async placeOrder(request: OrderRequest): Promise<{ orderId: string }>` → POST /orders
  - `async cancelOrder(orderId: string): Promise<void>` → POST /orders/{id}/cancel
  - `async getOrders(): Promise<Order[]>` → GET /orders [ASSUME EXISTS]
  - Add JSDoc comments

- [ ] **T1-006**: Test trading API methods
  - Mock order placement responses
  - Test validation errors (400)
  - Test cancellation flow

### Market Data Endpoints
- [ ] **T1-007**: Add market data type definitions to `src/shared/types/index.ts`
  - `DailyBar` interface (symbol, date, OHLCV)
  - `IntradayBar` interface (symbol, timestamp, OHLCV)
  - `SymbolInfo` interface (lastPrice, ceiling, floor, etc.)
  - Export types

- [ ] **T1-008**: Add market data API methods to `src/services/api/client.ts`
  - `async getHistoricalDaily(symbol, from, to): Promise<DailyBar[]>` → GET /market/history/daily
  - `async getHistoricalIntraday(symbol, interval, from, to): Promise<IntradayBar[]>` → GET /market/history/intraday
  - `async getSymbolInfo(symbol): Promise<SymbolInfo>` → GET /market/symbol/{symbol}
  - Add JSDoc comments

- [ ] **T1-009**: Test market data API methods
  - Mock historical bar responses
  - Test date range validation
  - Test invalid symbol handling

---

## Phase 2: WebSocket Client Enhancements (Day 3)

### Subscription Management
- [ ] **T2-001**: Add WebSocket message type definitions to `src/shared/types/index.ts`
  - `WebSocketMessageType` type
  - `StockInfoData` interface
  - `TopPriceData` interface
  - `OHLCData` interface
  - `MarketIndexData` interface
  - `WebSocketMessage` interface
  - Export types

- [ ] **T2-002**: Enhance `src/services/websocket/client.ts`
  - Add `private subscriptions: Set<string>` property
  - Add `private messageHandlers: Map<string, Function[]>` property
  - Implement `subscribe(topics: string[]): void` method
  - Implement `unsubscribe(topics: string[]): void` method
  - Send subscribe/unsubscribe messages to backend

- [ ] **T2-003**: Implement message type routing
  - Add `on(messageType, handler): void` method
  - Add `off(messageType, handler): void` method
  - Modify `handleMessage()` to route by type
  - Support multiple handlers per type

- [ ] **T2-004**: Implement subscription restoration on reconnect
  - Store subscriptions in Set during subscribe()
  - On reconnect event, read Set and resubscribe
  - Test reconnection flow

### Message Processing
- [ ] **T2-005**: Add throttling for high-frequency messages
  - Throttle STOCK_INFO updates to 1 per second per symbol
  - Use lodash.throttle or custom throttle function
  - Ensure latest update is always processed

- [ ] **T2-006**: Add error handling for malformed messages
  - Wrap JSON.parse in try-catch
  - Handle missing `type` field gracefully
  - Log errors without crashing

- [ ] **T2-007**: Test WebSocket enhancements
  - Test subscribe/unsubscribe flow
  - Test message routing to multiple handlers
  - Test reconnection with subscription restore
  - Test throttling behavior

---

## Phase 3: Account & Portfolio View (Days 4-5)

### Context Setup
- [ ] **T3-001**: Create `src/context/AccountContext.tsx`
  - Define `AccountContextValue` interface
  - Create `AccountContext` with createContext
  - Implement `AccountProvider` component
  - Initialize state: account, portfolio, isLoading, error
  - Export `useAccount()` hook

- [ ] **T3-002**: Implement account fetching in AccountContext
  - Add `fetchAccount()` function
  - Call `apiClient.getAccountInfo()`
  - Update state on success/error
  - Add `fetchPortfolio()` function
  - Call `apiClient.getPortfolio()`
  - Update state

- [ ] **T3-003**: Implement WebSocket price updates in AccountContext
  - Add `updateHoldingPrice(symbol, price)` function
  - Find symbol in portfolio array
  - Recalculate profit and profitPercent
  - Update state

- [ ] **T3-004**: Add AccountContext to provider tree in `src/main.tsx`
  - Import AccountProvider
  - Wrap app with AccountProvider
  - Test context is accessible

### Account Info Card Component
- [ ] **T3-005**: Create `src/features/account/components/AccountInfoCard.tsx`
  - Implement AccountInfoCard component
  - Display account number (optionally masked)
  - Display account name
  - Display balance with formatting
  - Add "Refresh" button

- [ ] **T3-006**: Create `src/features/account/components/AccountInfoCard.css`
  - Follow navy theme design system
  - Use `var(--panel)` background
  - Use `var(--text)` for main text
  - Use `var(--muted)` for labels
  - Add box shadow

### Portfolio Table Component
- [ ] **T3-007**: Create `src/features/account/components/PortfolioTable.tsx`
  - Implement PortfolioTable component
  - Display table with columns: Symbol, Qty, Avg Price, Market, P&L, P&L %
  - Calculate P&L: (marketPrice - avgPrice) × quantity
  - Calculate P&L %: ((marketPrice - avgPrice) / avgPrice) × 100
  - Color-code: green for profit, red for loss
  - Add summary row at bottom

- [ ] **T3-008**: Create `src/features/account/components/PortfolioTable.css`
  - Follow navy theme design system
  - Use `var(--panel-elevated)` for header
  - Use `var(--success)` for positive P&L
  - Use `var(--danger)` for negative P&L
  - Add hover effects on rows

- [ ] **T3-009**: Handle empty portfolio state
  - Check if portfolio array is empty
  - Display EmptyState component
  - Show message: "No holdings in your portfolio"
  - Link to Trading view

### Account View Integration
- [ ] **T3-010**: Create `src/features/account/AccountView.tsx`
  - Import and use `useAccount()` hook
  - Display AccountInfoCard
  - Display PortfolioTable
  - Handle loading state (show LoadingSkeleton)
  - Handle error state (show ErrorBoundary)
  - Fetch account and portfolio on mount

- [ ] **T3-011**: Create `src/features/account/AccountView.css`
  - Follow navy theme design system
  - Use `var(--bg)` for background
  - Add spacing and layout styles
  - Ensure responsive design

- [ ] **T3-012**: Create `src/features/account/index.ts`
  - Export AccountView component
  - Export reusable components if needed

- [ ] **T3-013**: Add Account view to `src/App.tsx`
  - Import AccountView (lazy load)
  - Add 'account' to ViewType union
  - Add routing for account view
  - Test navigation

- [ ] **T3-014**: Add "Account" to navigation in `src/shared/components/Navigation.tsx`
  - Add { id: 'account', label: 'Account' } to navItems
  - Test navigation link

---

## Phase 4: Trading View (Days 6-8)

### Context Setup
- [ ] **T4-001**: Create `src/context/TradingContext.tsx`
  - Define `TradingContextValue` interface
  - Create `TradingContext`
  - Implement `TradingProvider` component
  - Initialize state: orders, isLoading, error
  - Export `useTrading()` hook

- [ ] **T4-002**: Implement order functions in TradingContext
  - Add `fetchOrders()` function
  - Add `placeOrder(request)` async function
  - Call `apiClient.placeOrder()`
  - Update orders state on success
  - Add `cancelOrder(orderId)` async function
  - Call `apiClient.cancelOrder()`
  - Remove from orders on success

- [ ] **T4-003**: Implement WebSocket order updates in TradingContext
  - Add `updateOrderStatus(orderId, status)` function
  - Find order by ID
  - Update status or remove if FILLED/CANCELLED
  - Update state

- [ ] **T4-004**: Add TradingContext to provider tree in `src/main.tsx`
  - Import TradingProvider
  - Wrap app with TradingProvider
  - Test context is accessible

### Order Form Component
- [ ] **T4-005**: Create `src/features/trading/components/OrderForm.tsx`
  - Implement OrderForm component
  - Add symbol dropdown (fetch from getStockList)
  - Add side radio buttons (BUY/SELL)
  - Add order type dropdown (LO, MP, ATO, ATC)
  - Add quantity input (number, step 100)
  - Add price input (number, disabled for MP)
  - Display estimated cost (calculated)
  - Add "Place Order" button

- [ ] **T4-006**: Implement order form validation
  - Validate quantity is multiple of 100
  - Fetch symbol info to get ceiling/floor
  - Validate price is within ceiling/floor
  - Validate price is provided for LO/ATO/ATC
  - Disable button if validation fails
  - Show error messages

- [ ] **T4-007**: Calculate estimated cost dynamically
  - Watch form fields for changes
  - Calculate: quantity × price × 1000 (for VND)
  - Display with thousands separators
  - Update in real-time

- [ ] **T4-008**: Create `src/features/trading/components/OrderForm.css`
  - Follow navy theme design system
  - Use `var(--panel)` for form background
  - Use transparent inputs with `var(--border)` bottom border
  - Use `var(--accent)` for focus states
  - Use `var(--danger)` for error messages
  - Navy gradient for Place Order button

### Order Confirmation Modal
- [ ] **T4-009**: Create `src/features/trading/components/OrderConfirmModal.tsx`
  - Implement OrderConfirmModal component
  - Display order summary (symbol, side, type, quantity, price, total cost)
  - Add "Confirm" and "Cancel" buttons
  - Handle confirm click → call placeOrder()
  - Show loading spinner during submission
  - Close modal on success
  - Show error message on failure

- [ ] **T4-010**: Create `src/features/trading/components/OrderConfirmModal.css`
  - Follow navy theme design system
  - Use `var(--panel)` for modal background
  - Add backdrop overlay with rgba(0,0,0,0.5)
  - Center modal on screen
  - Add box shadow

### Pending Orders Table
- [ ] **T4-011**: Create `src/features/trading/components/OrdersTable.tsx`
  - Implement OrdersTable component
  - Display table with columns: Order ID, Symbol, Side, Type, Qty, Price, Status, Actions
  - Color-code side: BUY green, SELL red
  - Show status badges (PENDING yellow, etc.)
  - Add "Cancel" button per row
  - Handle empty state

- [ ] **T4-012**: Implement order cancellation
  - Add cancel button click handler
  - Show confirmation dialog: "Cancel order {orderId}?"
  - On confirm, call cancelOrder()
  - Remove from table on success
  - Show error toast on failure

- [ ] **T4-013**: Create `src/features/trading/components/OrdersTable.css`
  - Follow navy theme design system
  - Use `var(--success)` for BUY side
  - Use `var(--danger)` for SELL side
  - Use `var(--warning)` for PENDING badge
  - Add hover effects

### Trading View Integration
- [ ] **T4-014**: Create `src/features/trading/TradingView.tsx`
  - Import and use `useTrading()` hook
  - Display OrderForm
  - Display OrdersTable
  - Handle loading state
  - Handle error state
  - Fetch orders on mount

- [ ] **T4-015**: Create `src/features/trading/TradingView.css`
  - Follow navy theme design system
  - Use `var(--bg)` for background
  - Layout: OrderForm top, OrdersTable bottom
  - Add spacing and responsive design

- [ ] **T4-016**: Create `src/features/trading/index.ts`
  - Export TradingView component
  - Export reusable components

- [ ] **T4-017**: Add Trading view to `src/App.tsx`
  - Import TradingView (lazy load)
  - Add 'trading' to ViewType union
  - Add routing for trading view
  - Test navigation

- [ ] **T4-018**: Add "Trading" to navigation in `src/shared/components/Navigation.tsx`
  - Add { id: 'trading', label: 'Trading' } to navItems
  - Test navigation link

---

## Phase 5: Market Data Integration (Day 9)

### Historical Bars Integration
- [ ] **T5-001**: Update `src/features/market/MarketDataView.tsx`
  - Add timeframe selector (1m, 5m, 15m, 30m, 1h, D)
  - Add date range selector for daily bars
  - Fetch historical data based on selected timeframe
  - Call `apiClient.getHistoricalDaily()` for daily
  - Call `apiClient.getHistoricalIntraday()` for intraday
  - Pass data to chart component

- [ ] **T5-002**: Integrate historical bars into existing chart
  - Update chart component to accept dailyBars or intradayBars prop
  - Render candlestick chart with OHLCV data
  - Add volume bar chart below candlesticks
  - Add hover tooltip with OHLC values

### Symbol Info Integration
- [ ] **T5-003**: Add symbol info display to MarketDataView
  - Create SymbolInfoHeader component
  - Fetch symbol info on mount: `apiClient.getSymbolInfo(symbol)`
  - Display: symbol, lastPrice, change, changePercent
  - Display: ceiling, floor, reference price
  - Display: bid/ask spread, volume

- [ ] **T5-004**: Create `src/features/market/components/SymbolInfoHeader.tsx`
  - Implement SymbolInfoHeader component
  - Color-code change: green for positive, red for negative
  - Show up/down arrow icon
  - Highlight if at ceiling (red badge) or floor (green badge)

- [ ] **T5-005**: Create `src/features/market/components/SymbolInfoHeader.css`
  - Follow navy theme design system
  - Use `var(--panel)` for background
  - Use `var(--success)` for positive change
  - Use `var(--danger)` for negative change
  - Use `var(--muted)` for labels

### Real-Time Updates via WebSocket
- [ ] **T5-006**: Subscribe to STOCK_INFO topic in MarketDataView
  - On mount, call `wsClient.subscribe(["quotes/krx/mdds/v2/stockinfo/{symbol}"])`
  - Register handler: `wsClient.on('STOCK_INFO', updateSymbolInfo)`
  - Update symbol info display in real-time
  - Add price flash animation (green for increase, red for decrease)
  - On unmount, unsubscribe

- [ ] **T5-007**: Subscribe to OHLC topic for intraday updates
  - On mount (if intraday timeframe), subscribe to OHLC topic
  - Register handler: `wsClient.on('OHLC', appendBar)`
  - Append new bars to chart data
  - Aggregate 1m bars to 5m/15m if needed
  - On unmount, unsubscribe

- [ ] **T5-008**: Subscribe to MARKET_INDEX topic
  - Subscribe to VN-Index topic
  - Register handler: `wsClient.on('MARKET_INDEX', updateIndex)`
  - Display VN-Index in dashboard header
  - Show change in green/red

---

## Phase 6: Testing & Refinement (Days 10-11)

### Unit Tests
- [ ] **T6-001**: Write unit tests for API client methods
  - Test account endpoints (getAccountInfo, getPortfolio)
  - Test trading endpoints (placeOrder, cancelOrder)
  - Test market data endpoints (getHistoricalDaily, etc.)
  - Mock fetch responses
  - Test error handling

- [ ] **T6-002**: Write unit tests for WebSocket client
  - Test subscribe/unsubscribe
  - Test message routing
  - Test reconnection with subscription restore
  - Test throttling

- [ ] **T6-003**: Write unit tests for contexts
  - Test AccountContext state updates
  - Test TradingContext order placement flow
  - Mock API responses

### Component Tests
- [ ] **T6-004**: Write component tests for Account view
  - Test AccountInfoCard rendering
  - Test PortfolioTable P&L calculations
  - Test empty state

- [ ] **T6-005**: Write component tests for Trading view
  - Test OrderForm validation
  - Test OrderConfirmModal flow
  - Test OrdersTable rendering and cancellation

- [ ] **T6-006**: Write component tests for Market Data
  - Test SymbolInfoHeader display
  - Test timeframe selector
  - Test chart rendering

### Integration Tests
- [ ] **T6-007**: Test end-to-end order placement flow
  - Fill order form
  - Open confirmation modal
  - Submit order
  - Verify order appears in pending table
  - Cancel order
  - Verify order removed

- [ ] **T6-008**: Test account and portfolio display
  - Load Account view
  - Verify account info displays
  - Verify portfolio table displays with correct P&L
  - Simulate WebSocket price update
  - Verify P&L recalculates

- [ ] **T6-009**: Test real-time market data updates
  - Load MarketDataView
  - Simulate STOCK_INFO WebSocket message
  - Verify symbol info updates
  - Verify price flash animation

### Navy Theme Validation
- [ ] **T6-010**: Audit all new components for navy theme compliance
  - Check no hardcoded colors (white, black, light grays)
  - Verify all use CSS variables from `src/index.css`
  - Check hover states use `var(--panel-elevated)`
  - Check focus states use `var(--accent)`
  - Verify success/danger colors match design system

- [ ] **T6-011**: Test in browser for visual consistency
  - Navigate to Account view → check styling
  - Navigate to Trading view → check styling
  - Navigate to Market Data view → check updates
  - Test dark theme appearance
  - Take screenshots for documentation

### Bug Fixes & Polish
- [ ] **T6-012**: Fix any console errors
  - Check for React warnings
  - Fix TypeScript errors
  - Remove debug console.log statements

- [ ] **T6-013**: Optimize performance
  - Check for unnecessary re-renders (use React DevTools)
  - Memoize expensive calculations (useMemo)
  - Throttle WebSocket updates if needed

- [ ] **T6-014**: Add loading states and error handling
  - Ensure all API calls show loading spinners
  - Ensure all errors display user-friendly messages
  - Add retry buttons for failed fetches

- [ ] **T6-015**: Update documentation
  - Update BACKEND_API_REQUIREMENTS.md if needed
  - Add screenshots to proposal.md
  - Document new components in DESIGN_SYSTEM.md

---

## Phase 7: Deployment Preparation

### Environment Configuration
- [ ] **T7-001**: Add environment variables to `.env`
  - `VITE_API_BASE_URL` (default: http://localhost:8080/api/v1)
  - `VITE_WS_URL` (default: ws://localhost:8080/ws)
  - `VITE_ENABLE_ACCOUNT_VIEW` (feature flag)
  - `VITE_ENABLE_TRADING_VIEW` (feature flag)

- [ ] **T7-002**: Test with different API base URLs
  - Test with localhost
  - Test with staging server (if available)
  - Verify CORS settings

### Documentation
- [ ] **T7-003**: Update README.md
  - Add section for Account & Trading features
  - Document environment variables
  - Add usage instructions

- [ ] **T7-004**: Create migration guide
  - Document new API endpoints required
  - List new WebSocket topics
  - Provide backend setup instructions

---

## Success Criteria

All tasks complete when:
- [ ] All 9 backend REST endpoints integrated and functional
- [ ] WebSocket client supports all 4 message types
- [ ] Users can view account balance and portfolio holdings
- [ ] Users can place orders (LO, MP, ATO, ATC)
- [ ] Users can cancel pending orders
- [ ] Historical market data displays correctly (daily and intraday)
- [ ] Real-time updates work via WebSocket (prices, orders, indices)
- [ ] Navy theme consistency maintained (no off-brand colors)
- [ ] Zero console errors related to API calls
- [ ] All TypeScript types properly defined
- [ ] All tests passing (unit, component, integration)

---

## Dependencies & Blockers

### External Dependencies
- Backend API must be running at `http://localhost:8080/api/v1`
- WebSocket server must be running at `ws://localhost:8080/ws`
- JWT authentication configured (token management assumed handled)

### Potential Blockers
- Backend endpoints not ready → Use mock data temporarily
- WebSocket topics not implemented → Skip real-time updates initially
- Authentication issues → Add clear error messages and retry logic
- Vietnam trading rules not documented → Research VPS/HSX regulations

---

## Notes

- Follow existing code patterns (contexts, feature views, shared components)
- Reuse existing UI components (Button, Card, LoadingSkeleton, etc.) where possible
- Maintain backward compatibility with existing features
- Prioritize user experience (loading states, error messages, confirmations)
- Keep components small and focused (single responsibility)
- Write tests as you implement (test-driven development)
