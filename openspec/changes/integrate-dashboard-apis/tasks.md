# Implementation Tasks: Integrate Dashboard APIs

## Overview
This document outlines sequential tasks for integrating backend APIs into the Dashboard feature, replacing mock data with live services.

**Total Estimated Time:** 6 days (1 developer, full-time)

---

## Phase 1: Type Definitions & API Services (Days 1-2)

### Type Definitions
- [ ] **T1-001**: Create `src/shared/types/dashboard.ts` with market data types
  - `DataPoint` interface (timestamp, value)
  - `IndexData` interface (name, value, change, changePercent, data)
  - `MarketIndicesResponse` interface (vnIndex, vn30, vn100, lastUpdate)
  - `IndexHistoryResponse` interface (name, data)
  - `MarketRegimeResponse` interface (regime, regimeScore, breadth, marketStatus, lastUpdate)
  - `StockQuoteResponse` interface (symbol, price, open, high, low, volume, change, changePercent, ceiling, floor, lastUpdate)
  - Export all types

- [ ] **T1-002**: Add account types to `src/shared/types/dashboard.ts`
  - `AccountInfoResponse` interface (capital, cash, lockedCash, positionsValue, buyingPower, marginUsed, marginAvailable)
  - `AccountSummaryResponse` interface (totalPnL, totalPnLPercent, dayPnL, dayPnLPercent, riskExposure, riskPercent)
  - Export types

- [ ] **T1-003**: Add positions types to `src/shared/types/dashboard.ts`
  - `PositionResponse` interface (id, symbol, name, exchange, shares, entryPrice, currentPrice, entryDate, stopPrice, targetPrice, entryValue, currentValue, grossPnL, netPnL, netPnLPercent, rMultiple, risk, status, daysHeld)
  - `ActivePositionsResponse` interface (positions: PositionResponse[])
  - `PositionsSummaryResponse` interface (totalPositions, totalValue, totalPnL, totalPnLPercent, avgRMultiple, totalRisk, riskPercent)
  - Export types

- [ ] **T1-004**: Add signals types to `src/shared/types/dashboard.ts`
  - `SignalResponse` interface (id, symbol, name, exchange, currentPrice, signalType, strength, score, indicators, generatedAt, expiresAt, reason)
  - `SignalsListResponse` interface (signals: SignalResponse[], count)
  - Export types

- [ ] **T1-005**: Add watchlist types to `src/shared/types/dashboard.ts`
  - `WatchlistItemResponse` interface (symbol, addedAt, isFavorite, price, change, changePercent, sparklineData)
  - `WatchlistResponse` interface (items: WatchlistItemResponse[])
  - `WatchlistAddResponse` interface (symbol, isFavorite, message)
  - `WatchlistRemoveResponse` interface (symbol, message)
  - `WatchlistFavoriteResponse` interface (symbol, isFavorite, message)
  - Export types

- [ ] **T1-006**: Add recommendation types to `src/shared/types/dashboard.ts`
  - `RecommendationRequest` interface (IncludePortfolio, IncludeMarketRegime, IncludeSignals)
  - `RecommendationResponse` interface (symbol, action, confidence, rationale, targetPrice, stopLoss, timeframe, generatedAt)
  - Export types

- [ ] **T1-007**: Update `src/shared/types/index.ts` to export dashboard types
  - Add `export * from './dashboard'`

### API Service Modules
- [ ] **T1-008**: Create `src/services/api/marketApi.ts`
  - Import `apiClient` from `./client`
  - Import types from `../../shared/types/dashboard`
  - Implement `getIndices(): Promise<MarketIndicesResponse>`
  - Implement `getIndexHistory(indexKey, options?): Promise<IndexHistoryResponse>`
  - Implement `getRegime(): Promise<MarketRegimeResponse>`
  - Implement `getQuote(symbol): Promise<StockQuoteResponse>`
  - Export `marketApi` object
  - Add JSDoc comments

- [ ] **T1-009**: Create `src/services/api/accountApi.ts`
  - Import `apiClient` from `./client`
  - Import types from `../../shared/types/dashboard`
  - Implement `getInfo(): Promise<AccountInfoResponse>`
  - Implement `getSummary(): Promise<AccountSummaryResponse>`
  - Export `accountApi` object
  - Add JSDoc comments

- [ ] **T1-010**: Create `src/services/api/positionsApi.ts`
  - Import `apiClient` from `./client`
  - Import types from `../../shared/types/dashboard`
  - Implement `getActive(): Promise<ActivePositionsResponse>`
  - Implement `getSummary(): Promise<PositionsSummaryResponse>`
  - Export `positionsApi` object
  - Add JSDoc comments

- [ ] **T1-011**: Create `src/services/api/signalsApi.ts`
  - Import `apiClient` from `./client`
  - Import types from `../../shared/types/dashboard`
  - Implement `getSignals(options?): Promise<SignalsListResponse>`
  - Options: limit, sort, type, strength
  - Export `signalsApi` object
  - Add JSDoc comments

- [ ] **T1-012**: Create `src/services/api/watchlistApi.ts`
  - Import `apiClient` from `./client`
  - Import types from `../../shared/types/dashboard`
  - Implement `getAll(): Promise<WatchlistResponse>`
  - Implement `add(symbol): Promise<WatchlistAddResponse>`
  - Implement `remove(symbol): Promise<WatchlistRemoveResponse>`
  - Implement `toggleFavorite(symbol, isFavorite): Promise<WatchlistFavoriteResponse>`
  - Export `watchlistApi` object
  - Add JSDoc comments

- [ ] **T1-013**: Create `src/services/api/recommendationsApi.ts`
  - Import `apiClient` from `./client`
  - Import types from `../../shared/types/dashboard`
  - Implement `get(request): Promise<RecommendationResponse>`
  - Export `recommendationsApi` object
  - Add JSDoc comments

- [ ] **T1-014**: Update `src/services/api/client.ts` base URL
  - Change default URL from `http://localhost:8000/api` to `http://localhost:8080`
  - Add private `delete<T>` method for DELETE requests
  - Ensure consistent error handling

- [ ] **T1-015**: Create `src/services/api/index.ts` barrel export
  - Export `apiClient` from `./client`
  - Export `marketApi` from `./marketApi`
  - Export `accountApi` from `./accountApi`
  - Export `positionsApi` from `./positionsApi`
  - Export `signalsApi` from `./signalsApi`
  - Export `watchlistApi` from `./watchlistApi`
  - Export `recommendationsApi` from `./recommendationsApi`

### Configuration
- [ ] **T1-016**: Create `src/shared/constants/config.ts`
  - Define `API_CONFIG` object (baseUrl, useMockData, enableFallback)
  - Define `REFRESH_CONFIG` object (enabled, intervals for each data type)
  - Read from `import.meta.env` with defaults
  - Export configuration objects

- [ ] **T1-017**: Update `.env.example` with new variables
  - Add `VITE_API_BASE_URL=http://localhost:8080`
  - Add `VITE_USE_MOCK_DATA=false`
  - Add `VITE_ENABLE_FALLBACK=true`
  - Add `VITE_REFRESH_ENABLED=true`
  - Add comments explaining each variable

---

## Phase 2: Context Provider Refactoring (Days 3-4)

### MarketDataContext
- [ ] **T2-001**: Refactor `src/context/MarketDataContext.tsx` to use API
  - Import `marketApi` from `../services/api`
  - Import `API_CONFIG`, `REFRESH_CONFIG` from `../shared/constants/config`
  - Keep mock import for fallback: `import { generateMarketData } from '../services/mock/marketData'`
  - Update `refresh()` to call `marketApi.getIndices()` and `marketApi.getRegime()`
  - Combine responses into existing `MarketData` format
  - Add try/catch with fallback to mock when `enableFallback` is true
  - Log warning when falling back to mock data

- [ ] **T2-002**: Add error state to `MarketDataContext`
  - Add `error` state to context value
  - Add `clearError()` function to context
  - Return error in context value
  - Update `useMarketData` hook return type

- [ ] **T2-003**: Update MarketDataContext refresh interval
  - Use `REFRESH_CONFIG.intervals.marketData` for polling interval
  - Only enable interval when `REFRESH_CONFIG.enabled` is true
  - Clear interval on unmount

### AccountContext
- [ ] **T2-004**: Refactor `src/context/AccountContext.tsx` to use API
  - Import `accountApi` from `../services/api`
  - Import `API_CONFIG`, `REFRESH_CONFIG` from `../shared/constants/config`
  - Keep mock import for fallback
  - Update `refresh()` to call `accountApi.getInfo()` and `accountApi.getSummary()`
  - Merge responses into `AccountData` format
  - Add try/catch with fallback to mock data

- [ ] **T2-005**: Add additional fields to AccountContext
  - Ensure `totalPnL`, `dayPnL`, `riskExposure` from summary are included
  - Map API response fields to existing context structure
  - Maintain backward compatibility with components

### PositionsContext
- [ ] **T2-006**: Refactor `src/context/PositionsContext.tsx` to use API
  - Import `positionsApi` from `../services/api`
  - Import `API_CONFIG`, `REFRESH_CONFIG` from `../shared/constants/config`
  - Keep mock import for fallback
  - Update `refresh()` to call `positionsApi.getActive()` and `positionsApi.getSummary()`
  - Map API `PositionResponse` to existing `Position` type
  - Set `portfolioSummary` directly from API response

- [ ] **T2-007**: Update position type mapping
  - Map API `status` ('green', 'yellow', 'red') to existing status type
  - Ensure all fields are mapped correctly
  - Add type guard for position status

- [ ] **T2-008**: Remove client-side summary calculation
  - Use `positionsApi.getSummary()` response directly
  - Remove or deprecate `calculateSummary()` function
  - Keep function for fallback mock data path

### SetupsContext (Signals)
- [ ] **T2-009**: Refactor `src/context/SetupsContext.tsx` to use signals API
  - Import `signalsApi` from `../services/api`
  - Import `API_CONFIG`, `REFRESH_CONFIG` from `../shared/constants/config`
  - Keep mock import for fallback
  - Update `refresh()` to call `signalsApi.getSignals()`
  - Map API `SignalResponse` to existing `Signal` type

- [ ] **T2-010**: Update signal type mapping
  - Map API `signalType` to existing type ('buy', 'sell', 'watch')
  - Map API `strength` to existing type ('weak', 'moderate', 'strong')
  - Ensure `indicators` array is passed through
  - Add `expiresAt` field to Signal type if not present

- [ ] **T2-011**: Remove setups-related code from SetupsContext
  - The dashboard only uses signals, not setups
  - Keep setups functionality for other features
  - Or split into SignalsContext if needed

---

## Phase 3: Watchlist Integration (Day 5)

### Create WatchlistContext
- [ ] **T3-001**: Create `src/context/WatchlistContext.tsx`
  - Create `WatchlistContextValue` interface
  - Create `WatchlistContext` with createContext
  - Implement `WatchlistProvider` component
  - Add states: items, isLoading, error, isSynced
  - Export `useWatchlist()` hook

- [ ] **T3-002**: Implement watchlist fetch in WatchlistContext
  - Call `watchlistApi.getAll()` on mount
  - Update localStorage cache on successful fetch
  - Fall back to localStorage if API fails
  - Set `isSynced: false` when using cached data

- [ ] **T3-003**: Implement add to watchlist with optimistic update
  - Immediately add item to state
  - Call `watchlistApi.add(symbol)`
  - Update item with server response on success
  - Rollback and show error on failure

- [ ] **T3-004**: Implement remove from watchlist with optimistic update
  - Immediately remove item from state
  - Call `watchlistApi.remove(symbol)`
  - Show success message on completion
  - Rollback and show error on failure

- [ ] **T3-005**: Implement toggle favorite with optimistic update
  - Immediately toggle `isFavorite` in state
  - Call `watchlistApi.toggleFavorite(symbol, newValue)`
  - Rollback on failure

- [ ] **T3-006**: Implement price updates for watchlist
  - Periodically call `marketApi.getQuote()` for each symbol
  - Use `REFRESH_CONFIG.intervals.watchlist` interval
  - Batch requests or use debouncing for performance
  - Update price, change, changePercent in items

- [ ] **T3-007**: Add WatchlistContext to provider tree
  - Import `WatchlistProvider` in `src/context/index.tsx`
  - Add to provider composition
  - Ensure proper nesting order

### Update WatchlistPanel Component
- [ ] **T3-008**: Refactor `WatchlistPanel.tsx` to use WatchlistContext
  - Remove localStorage logic from component
  - Import and use `useWatchlist()` hook
  - Replace local state with context state
  - Update handlers to use context functions

- [ ] **T3-009**: Add sync status indicator to WatchlistPanel
  - Show subtle indicator when `isSynced: false`
  - Use `var(--warning)` color for indicator
  - Tooltip: "Using cached data - sync failed"

- [ ] **T3-010**: Add loading state to WatchlistPanel
  - Show skeleton items while loading
  - Match fintech neon theme skeleton style
  - Smooth transition to loaded state

- [ ] **T3-011**: Add error handling UI to WatchlistPanel
  - Show inline error for failed operations
  - Add retry button for sync failures
  - Clear error after successful operation

---

## Phase 4: Recommendations & Polish (Day 6)

### AI Recommendations Integration
- [ ] **T4-001**: Update `RecommendButton` and recommendation flow
  - Import `recommendationsApi` from `../../services/api`
  - Replace `fetchRecommendation()` mock call
  - Call `recommendationsApi.get({ IncludePortfolio: true, IncludeMarketRegime: true, IncludeSignals: true })`
  - Handle API errors with user-friendly message

- [ ] **T4-002**: Update `RecommendModal` type compatibility
  - Ensure `RecommendationResponse` type matches modal props
  - Update `Recommendation` type or create mapping
  - Handle optional fields (targetPrice, stopLoss)

- [ ] **T4-003**: Add fallback for recommendations
  - Keep `mockRecommendations.ts` as fallback
  - Use mock when `API_CONFIG.useMockData` is true
  - Fall back to mock on API error if fallback enabled

### Error Toast Notifications
- [ ] **T4-004**: Create error notification utility
  - Create `src/shared/utils/notifications.ts`
  - Implement `showError(message)` function
  - Implement `showSuccess(message)` function
  - Use console.error/log as placeholder (can integrate toast lib later)

- [ ] **T4-005**: Add error notifications to contexts
  - Import notification utility in each context
  - Call `showError()` when API fails
  - Do not show error when falling back to mock data

### Loading State Improvements
- [ ] **T4-006**: Create `LoadingCard` component for dashboard
  - Create `src/shared/components/LoadingCard/LoadingCard.tsx`
  - Match card dimensions and styling
  - Use fintech neon theme skeleton pattern
  - Export from `src/shared/components/index.ts`

- [ ] **T4-007**: Add loading states to dashboard cards
  - Use `LoadingCard` in Open Positions card
  - Use `LoadingCard` in Latest Signals card
  - Smooth transitions using `var(--transition)`

### Stale Data Indicators
- [ ] **T4-008**: Add lastUpdated tracking to contexts
  - Add `lastUpdated: Date | null` to each context value
  - Set on successful data fetch
  - Expose in context value

- [ ] **T4-009**: Create `StaleIndicator` component
  - Create `src/shared/components/StaleIndicator/StaleIndicator.tsx`
  - Show "Updated X seconds ago" text
  - Show warning when data older than threshold
  - Style with `var(--text-secondary)` or `var(--warning)`

### Final Testing & Cleanup
- [ ] **T4-010**: Test all API integrations with backend
  - Start backend server
  - Verify market indices display correctly
  - Verify account data displays correctly
  - Verify positions display correctly
  - Verify signals display correctly
  - Verify watchlist CRUD operations
  - Verify recommendations work

- [ ] **T4-011**: Test fallback to mock data
  - Stop backend server
  - Verify dashboard loads with mock data
  - Check warning logs in console
  - Verify UI indicates mock/cached data

- [ ] **T4-012**: Test error handling
  - Simulate API errors (401, 500)
  - Verify error messages display
  - Verify retry functionality works
  - Verify no crashes or freezes

- [ ] **T4-013**: Remove deprecated code
  - Remove unused mock data imports if fallback disabled
  - Clean up console.log statements
  - Update comments and documentation

- [ ] **T4-014**: Update documentation
  - Update README with new environment variables
  - Document API integration in code comments
  - Add inline documentation for new services

---

## Validation Checklist

Before marking complete:
- [ ] All 14 APIs integrated and working
- [ ] Dashboard displays real data with backend running
- [ ] Fallback to mock data works when backend unavailable
- [ ] No TypeScript errors
- [ ] No console errors in browser
- [ ] Loading states display correctly
- [ ] Error states display correctly
- [ ] Theme consistency maintained (fintech neon)
- [ ] Performance acceptable (no lag or freezes)

---

## Dependencies

**Required before starting:**
- Backend server runnable at `http://localhost:8080`
- Valid JWT token generation mechanism
- CORS configured on backend

**Parallelizable tasks:**
- T1-001 through T1-007 (type definitions) can be done together
- T1-008 through T1-013 (API services) can be done together after types
- T2-001 through T2-011 (context refactoring) should be sequential
- T3-001 through T3-011 (watchlist) can start after T1 is complete
- T4-001 through T4-014 (polish) should be done after core integration
