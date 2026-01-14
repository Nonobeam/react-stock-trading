# Dashboard API Integration

## Summary
Integrate backend REST APIs into the Dashboard feature to replace mock data with live services from the trading backend.

---

## ADDED Requirements

### Requirement: Market Data API Integration
The dashboard SHALL fetch market indices data from `GET /api/market/indices` endpoint.

#### Scenario: Successful market indices fetch
**Given** the backend is available and user is authenticated  
**When** the MarketDataContext initializes or refreshes  
**Then** it calls `GET /api/market/indices` with Authorization header  
**And** updates state with vnIndex, vn30, vn100 data including chart data points  
**And** sets `isLoading` to false

#### Scenario: Market regime fetch
**Given** the backend is available and user is authenticated  
**When** the MarketDataContext fetches market data  
**Then** it also calls `GET /api/market/regime`  
**And** updates state with regime, regimeScore, breadth, and marketStatus

#### Scenario: Market data polling
**Given** the dashboard is mounted and visible  
**When** the configured refresh interval elapses (default 5 seconds)  
**Then** the market data is automatically refreshed from the API

---

### Requirement: Account Data API Integration
The dashboard SHALL fetch account information from `GET /api/account/info` and `GET /api/account/summary` endpoints.

#### Scenario: Successful account info fetch
**Given** the backend is available and user is authenticated  
**When** the AccountContext initializes or refreshes  
**Then** it calls `GET /api/account/info` with Authorization header  
**And** updates state with capital, cash, lockedCash, positionsValue, buyingPower

#### Scenario: Account summary fetch
**Given** the backend is available and user is authenticated  
**When** the AccountContext fetches account data  
**Then** it also calls `GET /api/account/summary`  
**And** updates state with totalPnL, dayPnL, riskExposure metrics

---

### Requirement: Positions API Integration
The dashboard SHALL fetch active positions from `GET /api/positions/active` and portfolio summary from `GET /api/positions/summary`.

#### Scenario: Successful positions fetch
**Given** the backend is available and user is authenticated  
**When** the PositionsContext initializes or refreshes  
**Then** it calls `GET /api/positions/active` with Authorization header  
**And** updates state with list of open positions including P&L and R-multiple

#### Scenario: Portfolio summary fetch
**Given** the backend is available and user is authenticated  
**When** the PositionsContext fetches positions  
**Then** it also calls `GET /api/positions/summary`  
**And** updates portfolioSummary with totalPositions, totalValue, avgRMultiple, totalRisk

---

### Requirement: Signals API Integration
The dashboard SHALL fetch trading signals from `GET /api/signals` endpoint.

#### Scenario: Successful signals fetch
**Given** the backend is available and user is authenticated  
**When** the SetupsContext initializes or refreshes  
**Then** it calls `GET /api/signals?limit=10&sort=score` with Authorization header  
**And** updates state with list of signals including symbol, type, strength, score

#### Scenario: Signal display in dashboard
**Given** signals have been fetched successfully  
**When** the Latest Signals card renders  
**Then** it displays top 5 signals by score  
**And** shows signal type badge (buy/sell/watch)  
**And** shows strength indicator and score

---

### Requirement: Watchlist API Integration
The dashboard SHALL sync watchlist with backend via watchlist CRUD APIs.

#### Scenario: Watchlist fetch on mount
**Given** the dashboard mounts and user is authenticated  
**When** WatchlistContext initializes  
**Then** it calls `GET /api/watchlist`  
**And** updates local state with server watchlist items  
**And** caches items in localStorage for offline access

#### Scenario: Add symbol to watchlist
**Given** user enters a valid symbol and clicks add  
**When** the add action is triggered  
**Then** the symbol is optimistically added to local state  
**And** `POST /api/watchlist` is called with { symbol }  
**And** on success, the item is updated with server response  
**And** on failure, the item is removed and error is shown

#### Scenario: Remove symbol from watchlist
**Given** user clicks remove on a watchlist item  
**When** the remove action is triggered  
**Then** the item is optimistically removed from local state  
**And** `DELETE /api/watchlist/{symbol}` is called  
**And** on failure, the item is restored and error is shown

#### Scenario: Toggle favorite status
**Given** user clicks favorite star on a watchlist item  
**When** the toggle action is triggered  
**Then** the favorite status is optimistically toggled  
**And** `PATCH /api/watchlist/{symbol}/favorite` is called with { isFavorite }  
**And** on failure, the status is reverted and error is shown

#### Scenario: Real-time price updates for watchlist
**Given** watchlist has symbols  
**When** the refresh interval elapses (default 15 seconds)  
**Then** `GET /api/market/quote/{symbol}` is called for each symbol  
**And** price, change, changePercent are updated in state

---

### Requirement: AI Recommendations API Integration
The dashboard SHALL fetch AI recommendations from `POST /api/recommendations`.

#### Scenario: Request AI recommendation
**Given** user clicks the "Get Recommendation" button  
**When** the recommendation is requested  
**Then** `POST /api/recommendations` is called with context flags  
**And** request body includes { IncludePortfolio: true, IncludeMarketRegime: true, IncludeSignals: true }

#### Scenario: Display recommendation result
**Given** the API returns a recommendation  
**When** the response is received  
**Then** the RecommendModal opens  
**And** displays symbol, action, confidence, rationale  
**And** shows targetPrice and stopLoss if provided

---

### Requirement: API Fallback Mechanism
The dashboard SHALL gracefully handle API failures with fallback to mock data.

#### Scenario: Backend unavailable fallback
**Given** the backend is not reachable  
**When** any dashboard API call fails with network error  
**Then** the context falls back to mock data from `src/services/mock/`  
**And** logs a warning to console  
**And** UI functions normally with mock data

#### Scenario: Fallback disabled
**Given** `VITE_ENABLE_FALLBACK=false` in environment  
**When** an API call fails  
**Then** the context sets error state  
**And** does not fall back to mock data  
**And** error is displayed to user

#### Scenario: Explicit mock mode
**Given** `VITE_USE_MOCK_DATA=true` in environment  
**When** any context initializes  
**Then** it uses mock data generators directly  
**And** does not make API calls

---

### Requirement: Loading States
The dashboard SHALL display loading indicators while fetching data.

#### Scenario: Initial dashboard load
**Given** the dashboard is mounting  
**When** data is being fetched from APIs  
**Then** loading skeletons are displayed for each card  
**And** skeletons match fintech neon theme styling

#### Scenario: Refresh loading
**Given** dashboard data is refreshing in background  
**When** API calls are in progress  
**Then** existing data remains visible  
**And** a subtle refresh indicator may be shown

---

### Requirement: Error Handling
The dashboard SHALL display user-friendly error states when API calls fail.

#### Scenario: API error display
**Given** an API call fails with HTTP error (4xx, 5xx)  
**When** the error is caught by the context  
**Then** an error message is set in context state  
**And** components display error state UI  
**And** a retry option is provided

#### Scenario: Authentication error
**Given** an API call returns 401 Unauthorized  
**When** the error is caught  
**Then** the user is notified of authentication issue  
**And** may be redirected to login (out of scope)

---

## MODIFIED Requirements

### Requirement: MarketDataContext Data Source
MarketDataContext SHALL fetch from `/api/market/indices` and `/api/market/regime` APIs, with fallback to mock data when configured.

#### Scenario: Data source selection
**Given** the application starts  
**When** MarketDataContext initializes  
**Then** it checks `API_CONFIG.useMockData`  
**And** if true, uses mock data generators  
**And** if false, fetches from backend APIs

---

### Requirement: AccountContext Data Source
AccountContext SHALL fetch from `/api/account/info` and `/api/account/summary` APIs, with fallback to mock data when configured.

#### Scenario: Account data source selection
**Given** the application starts  
**When** AccountContext initializes  
**Then** it checks `API_CONFIG.useMockData`  
**And** if true, uses mock data generators  
**And** if false, fetches from backend APIs

---

### Requirement: PositionsContext Data Source
PositionsContext SHALL fetch from `/api/positions/active` and `/api/positions/summary` APIs, receiving pre-calculated summary from backend.

#### Scenario: Positions data source selection
**Given** the application starts  
**When** PositionsContext initializes  
**Then** it checks `API_CONFIG.useMockData`  
**And** if true, uses mock data generators and client-side calculation  
**And** if false, fetches from backend APIs with server-calculated summary

---

### Requirement: SetupsContext Signals Data Source
SetupsContext SHALL fetch signals from `/api/signals` API, with fallback to mock data when configured.

#### Scenario: Signals data source selection
**Given** the application starts  
**When** SetupsContext initializes  
**Then** it checks `API_CONFIG.useMockData`  
**And** if true, uses mock signal generators  
**And** if false, fetches from `/api/signals` endpoint

---

### Requirement: Watchlist Persistence
WatchlistPanel SHALL sync with backend via `/api/watchlist` endpoints, using localStorage as offline cache.

#### Scenario: Watchlist storage selection
**Given** the dashboard loads  
**When** WatchlistPanel mounts  
**Then** it fetches from `/api/watchlist` API  
**And** caches result in localStorage  
**And** uses localStorage as fallback when API unavailable

---

### Requirement: AI Recommendation Source
RecommendButton SHALL call `POST /api/recommendations` API for AI-powered recommendations.

#### Scenario: Recommendation source selection
**Given** user clicks Get Recommendation button  
**When** recommendation is requested  
**Then** it checks `API_CONFIG.useMockData`  
**And** if true, uses mock recommendations  
**And** if false, calls `POST /api/recommendations` endpoint

---

## Test Criteria

### Integration Tests
- All API calls include Authorization header with JWT token
- API responses are correctly mapped to context state
- Fallback to mock data works when backend unavailable
- Loading states display during API calls
- Error states display on API failure
- Watchlist CRUD operations sync with backend
- Optimistic updates rollback on failure
- Polling intervals respect configuration

### Theme Compliance
- Loading skeletons use fintech neon theme colors
- Error states use `var(--danger)` styling
- No visual regressions from current implementation
