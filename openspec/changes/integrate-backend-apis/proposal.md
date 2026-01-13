# Proposal: Integrate Backend APIs

## Change ID
`integrate-backend-apis`

## Status
Proposed

## Overview
Integrate missing backend API endpoints into the frontend application based on `BACKEND_API_REQUIREMENTS.md`. The frontend currently lacks support for:
1. **Account & Portfolio Management** - Account info and holdings display
2. **Order Placement & Management** - UI for placing/canceling orders
3. **Real-time Market Data** - Historical daily/intraday bars and symbol info
4. **WebSocket Subscriptions** - Enhanced subscription management for stock info, top price, OHLC bars, and market indices

## Problem Statement
The `golang-stock-trading` backend exposes comprehensive REST and WebSocket APIs (documented in BACKEND_API_REQUIREMENTS.md), but the frontend lacks UI components and API client methods to consume these endpoints. Currently:
- No account balance or holdings view exists
- Users cannot place or cancel orders through the UI
- Historical market data APIs (daily/intraday bars, symbol info) are not integrated
- WebSocket subscriptions are limited and don't support all available topics

This creates a significant gap between backend capabilities and frontend functionality, preventing users from executing trades, viewing account information, and accessing full market data.

## Goals
1. Add API client methods for all documented backend endpoints
2. Create Account & Portfolio view to display balance and holdings
3. Create Trading view with order placement and management UI
4. Integrate historical market data endpoints into Market Data view
5. Enhance WebSocket client to support all documented topics
6. Follow navy theme design system consistently across all new UI components

## Non-Goals
- Implementing backend authentication (assume JWT token management is handled)
- Creating advanced charting beyond OHLCV bars
- Building algorithmic trading features
- Supporting futures, options, or derivatives trading

## Proposed Solution

### 1. API Client Enhancements
Extend `src/services/api/client.ts` to include:
- Account endpoints (`GET /account/info`, `GET /account/portfolio`)
- Order endpoints (`POST /orders`, `POST /orders/{id}/cancel`)
- Market data endpoints (`GET /market/history/daily`, `GET /market/history/intraday`, `GET /market/symbol/{symbol}`)

### 2. WebSocket Client Enhancements
Update `src/services/websocket/client.ts` to support:
- Subscription management for multiple topics
- Topic-based message routing (STOCK_INFO, TOP_PRICE, OHLC, MARKET_INDEX)
- Reconnection with subscription restoration

### 3. New Feature: Account & Portfolio View
Create `src/features/account/` with:
- `AccountView.tsx` - Display account info, balance, and portfolio holdings
- `AccountView.css` - Navy theme styling
- Components:
  - `AccountInfoCard.tsx` - Account number, name, balance
  - `PortfolioTable.tsx` - Holdings table with profit/loss calculations

### 4. New Feature: Trading View
Create `src/features/trading/` with:
- `TradingView.tsx` - Order placement and management interface
- `TradingView.css` - Navy theme styling
- Components:
  - `OrderForm.tsx` - Place orders (LO, MP, ATO, ATC)
  - `OrdersTable.tsx` - View and cancel pending orders
  - `OrderConfirmModal.tsx` - Confirm before placing orders

### 5. Market Data Integration
Enhance `src/features/market/MarketDataView.tsx` to:
- Fetch historical daily bars for larger timeframes
- Fetch intraday bars for minute-level data
- Display current symbol info (ceiling, floor, reference price)
- Use WebSocket for real-time price updates

### 6. Context Additions
- `AccountContext.tsx` - Manage account info and portfolio holdings
- `TradingContext.tsx` - Manage order placement and order list

### 7. Navigation Updates
Add new views to navigation:
- "Account" - View account and portfolio
- "Trading" - Place and manage orders

## Impact Assessment

### User Impact
**Positive:**
- Users can view account balance and holdings
- Users can place and cancel orders directly from the UI
- Enhanced market data with historical bars and real-time updates
- Complete WebSocket integration for all backend topics

**Neutral/Negative:**
- Navigation bar has 2 additional items (may need UI adjustment for space)
- Users need to learn new Trading and Account views

### Technical Impact
**Files Modified:**
- `src/services/api/client.ts` - Add ~150 lines for new endpoints
- `src/services/websocket/client.ts` - Add ~100 lines for topic management
- `src/shared/components/Navigation.tsx` - Add 2 navigation items
- `src/App.tsx` - Add routing for new views

**Files Created:**
- `src/features/account/` - ~400 lines total (AccountView, components, CSS)
- `src/features/trading/` - ~600 lines total (TradingView, components, CSS)
- `src/context/AccountContext.tsx` - ~200 lines
- `src/context/TradingContext.tsx` - ~250 lines
- `src/shared/types/index.ts` - Add AccountInfo, Order, OrderRequest types (~50 lines)

**Total Addition:** ~1,750 lines of code

### Testing Requirements
- Unit tests for API client methods
- Integration tests for contexts (AccountContext, TradingContext)
- Component tests for new UI elements
- E2E tests for order placement flow

## Dependencies
- Backend API must be running at `http://localhost:8080/api/v1`
- WebSocket server must be running at `ws://localhost:8080/ws`
- JWT authentication must be configured (token management handled externally)
- Backend must support all documented endpoints in BACKEND_API_REQUIREMENTS.md

## Risks & Mitigations

### Risk: Backend API Not Ready
**Likelihood:** Medium  
**Impact:** High  
**Mitigation:** Create mock implementations in API client that can be toggled via environment variable (`VITE_USE_MOCK_API=true`)

### Risk: Authentication Issues
**Likelihood:** Medium  
**Impact:** High  
**Mitigation:** Add clear error messages for 401/403 responses, guide users to login flow

### Risk: UI Complexity Overload
**Likelihood:** Low  
**Impact:** Medium  
**Mitigation:** Keep Trading view simple (order form + list), hide advanced features initially

### Risk: WebSocket Message Overload
**Likelihood:** Medium  
**Impact:** Medium  
**Mitigation:** Implement subscription throttling, allow users to select specific symbols to watch

## Alternatives Considered

### Alternative 1: External Trading Terminal
Use third-party trading platform instead of building order placement.
- **Pros:** No need to build complex order UI
- **Cons:** Disconnected experience, users leave the app for trading
- **Decision:** Rejected - defeats purpose of integrated trading system

### Alternative 2: Minimal API Integration
Only integrate account view, skip order placement.
- **Pros:** Simpler, less risk
- **Cons:** Incomplete solution, users still can't trade
- **Decision:** Rejected - doesn't fully leverage backend capabilities

### Alternative 3: Progressive Enhancement
Add endpoints to API client but delay UI implementation.
- **Pros:** API client ready immediately
- **Cons:** Users can't access functionality without UI
- **Decision:** Rejected - provides no user value without UI

## Success Metrics
- [ ] All 9 backend REST endpoints integrated and functional
- [ ] WebSocket client supports all 4 message types
- [ ] Users can view account balance and portfolio holdings
- [ ] Users can place orders (LO, MP, ATO, ATC)
- [ ] Users can cancel pending orders
- [ ] Historical market data displays correctly
- [ ] Real-time updates work across all views
- [ ] Navy theme consistency maintained (no off-brand colors)
- [ ] Zero console errors related to API calls
- [ ] All TypeScript types properly defined

## Timeline Estimate
- **Phase 1:** API Client Extensions (2 days)
- **Phase 2:** WebSocket Enhancements (1 day)
- **Phase 3:** Account & Portfolio View (2 days)
- **Phase 4:** Trading View (3 days)
- **Phase 5:** Market Data Integration (1 day)
- **Phase 6:** Testing & Refinement (2 days)

**Total:** ~11 days (assuming 1 developer, full-time focus)

## Open Questions
1. Should order placement require two-factor authentication or additional confirmation?
2. What should be the default order type (LO vs MP)?
3. Should we support order modification (amend) or only place/cancel?
4. How should we handle partial fills for orders?
5. Should portfolio holdings show only current positions or include closed trades?

## Approval Needed From
- Product Owner (for UI/UX decisions)
- Backend Team (to confirm API readiness)
- Security Team (for order placement flow review)

## Related Changes
- May need to update `enforce-navy-theme-consistency` if new components are added
- Should align with `implement-gst-frontend-core` for consistency
