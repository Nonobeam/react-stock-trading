# Implementation Tasks

## Overview
This document outlines the implementation tasks for the GST Frontend Core. Tasks are ordered to deliver user-visible progress incrementally while managing dependencies.

## Task Organization
- **Phase-based**: Tasks grouped by functional phase
- **Dependencies**: Critical dependencies noted with `→` symbol
- **Parallelization**: Tasks marked with `||` can be done in parallel
- **Validation**: Each phase ends with testing and validation

---

## Phase 0: Foundation & Setup (Week 1)

### Infrastructure
- [ ] **F-001**: Install and configure charting library (Lightweight Charts)
  - Evaluate performance with Vietnam market data volume
  - Create wrapper component for React integration
  - Document API and usage patterns

- [ ] **F-002**: Set up TypeScript project structure
  - Create `/src/features/` directory with subdirectories (market, regime, scanner, risk, monitoring, analytics)
  - Create `/src/shared/` for reusable components
  - Create `/src/services/` for API and WebSocket clients
  - Create `/src/context/` for global state
  - Set up path aliases in tsconfig.json

- [ ] **F-003**: Install core dependencies
  - React Hook Form + Zod (forms and validation)
  - date-fns (date utilities)
  - WebSocket client library (if not using native)
  - Testing libraries (Vitest, React Testing Library)

- [ ] **F-004**: Create Vietnam market rules engine (`services/vietnam/`)
  - Implement price limit validation (±7% HOSE, ±10% HNX)
  - Implement lot size adjustment (100 shares minimum)
  - Implement session timing detection
  - Implement T+2 settlement calculator
  - Write comprehensive unit tests (P0 - CRITICAL)

- [ ] **F-005**: Set up API client (`services/api/client.ts`)
  - Create base HTTP client with error handling
  - Implement authentication token management
  - Create typed API methods (getOHLCV, getIndicators, etc.)
  - Add request/response interceptors

- [ ] **F-006**: Set up WebSocket client (`services/websocket/client.ts`)
  - Implement connection manager with auto-reconnect
  - Create subscription/unsubscription system
  - Implement message routing to contexts
  - Add connection status monitoring

- [ ] **F-007**: Create base Context providers
  - WebSocketContext (connection management)
  - MarketDataContext (OHLCV, indicators)
  - Create Provider wrapper component
  - Test context updates and re-renders

### Validation
- [ ] Run `npm run build` successfully
- [ ] All unit tests pass for Vietnam rules engine
- [ ] WebSocket connects and subscribes successfully (test with mock server)

---

## Phase 1: Market Data & Technical Indicators (Week 2-3)

### Core Chart Components
- [ ] **P1-001**: Create `PriceChartModule` component → F-001
  - Integrate Lightweight Charts
  - Implement candlestick rendering
  - Add zoom and pan controls
  - Display volume bars (15% height)
  - Add current price label

- [ ] **P1-002**: Implement symbol selector → F-005
  - Create searchable dropdown
  - Fetch stock list from API
  - Display sector badges
  - Handle symbol switching

- [ ] **P1-003**: Implement timeframe selector
  - Create dropdown with intervals (Daily, Weekly, 4H, etc.)
  - Fetch appropriate data on change
  - Maintain chart state across switches

- [ ] **P1-004**: Add indicator overlays to chart → F-005
  - SMA/EMA lines (configurable periods)
  - Bollinger Bands with shaded area
  - VWAP line
  - Toggle controls with legend

### Technical Indicator Panels
- [ ] **P1-005**: Create `TechnicalIndicatorPanel` component || P1-001
  - Layout with grid for multiple indicators
  - Fetch indicator data from API

- [ ] **P1-006**: Implement RSI indicator display
  - Gauge visualization (0-100)
  - Color zones (<30 green, 30-70 yellow, >70 red)
  - Current value and interpretation label
  - Tooltip with explanation

- [ ] **P1-007**: Implement MACD indicator display
  - Line chart with MACD and signal lines
  - Histogram bars (positive green, negative red)
  - Bullish/bearish crossover indicator

- [ ] **P1-008**: Implement Stochastic indicator display
  - %K and %D lines
  - Oversold/overbought zones
  - Current values

- [ ] **P1-009**: Implement ADX indicator display
  - Horizontal bar (0-100)
  - Color zones (<20 gray, 20-40 yellow, >40 green)
  - Trend strength label

- [ ] **P1-010**: Implement ATR indicator display
  - Absolute value and percentage
  - Volatility classification (Low/Normal/High/Extreme)
  - Color coding

### Real-Time Updates
- [ ] **P1-011**: Connect chart to WebSocket → F-006, P1-001
  - Subscribe to price updates
  - Update latest candle in real-time
  - Animate price changes (flash)
  - Optimize rendering (React.memo)

- [ ] **P1-012**: Connect indicators to WebSocket → P1-006-010
  - Update indicator values in real-time
  - Prevent unnecessary re-renders
  - Batch updates if needed

### Validation
- [ ] Chart renders 500+ candles smoothly (<2s load, 60 FPS)
- [ ] All 9 indicators display correctly
- [ ] Real-time updates work without lag
- [ ] Symbol and timeframe switching works
- [ ] Manual testing with multiple symbols

---

## Phase 2: Market Context & Regime (Week 4)

### Regime Dashboard
- [ ] **P2-001**: Create `MarketRegimeDashboard` component → F-005
  - Large regime badge (Bull/Bear/Range/Transition)
  - Score display (3-12 scale)
  - Color coding by regime
  - Descriptive subtitle

- [ ] **P2-002**: Create `RegimeDetailPanel` component
  - Factor breakdown (ADX, DI, Volatility, Volume)
  - Progress bars for each factor
  - Tooltips with explanations

- [ ] **P2-003**: Create `TrendStrengthMeter` component
  - Horizontal slider visualization
  - Color gradient (gray → yellow → green)
  - ADX value label

- [ ] **P2-004**: Create `VNIndexStatus` widget
  - VN-Index value and change
  - MA50 comparison status
  - Trend direction indicator

### Strategy Recommendations
- [ ] **P2-005**: Display regime-based strategy recommendations → P2-001
  - Strategy text based on regime
  - Specific actionable advice
  - Position multiplier display
  - Avoid list

### Real-Time Regime Updates
- [ ] **P2-006**: Connect regime to WebSocket → F-006, P2-001
  - Subscribe to regime updates
  - Update badge and scores
  - Show toast notification on regime change
  - Animate transitions

### Context Integration
- [ ] **P2-007**: Create `RegimeContext` → F-007
  - Store current regime state
  - Fetch and cache regime data
  - Provide to child components

### Validation
- [ ] Regime dashboard displays correctly for all regime types
- [ ] Factor breakdown matches backend calculations
- [ ] Real-time updates work smoothly
- [ ] Recommendations are contextual and helpful

---

## Phase 3: Trade Setup Scanner (Week 5-6)

### Scanner Table
- [ ] **P3-001**: Create `TradeScannerTable` component → F-005
  - Table with all required columns
  - Fetch setups from backend
  - Row rendering with color coding

- [ ] **P3-002**: Implement score color coding → P3-001
  - Red (<7), Yellow (7-8), Green (9-10), Dark Green (11+)
  - Quality badges (Excellent/Good/Acceptable/Poor)
  - Row highlighting

- [ ] **P3-003**: Implement filtering controls || P3-001
  - Min score filter
  - Setup type filter (multi-select)
  - Sector filter (multi-select)
  - Apply filters client-side

- [ ] **P3-004**: Implement sorting
  - Sort by score, R:R, symbol
  - Toggle ascending/descending
  - Visual sort indicators

### Scorecard Display
- [ ] **P3-005**: Create `ScorecardDisplay` component
  - Modal or drawer layout
  - Header with total score
  - Progress bars for each category
  - Strengths and weaknesses sections
  - Recommendation section

- [ ] **P3-006**: Implement scorecard breakdown logic → F-005
  - Fetch detailed scoring from backend
  - Calculate percentages
  - Generate strengths/weaknesses lists

### Setup Detail Drawer
- [ ] **P3-007**: Create `SetupDetailDrawer` component
  - Slide-in drawer from right
  - Mini chart with entry/stop/targets marked
  - Setup narrative display
  - Rule checklist

- [ ] **P3-008**: Implement rule checklist rendering
  - ✅/❌ indicators for each rule
  - Contextual messages
  - Triggered vs pending separation

- [ ] **P3-009**: Add "Plan Trade" quick action → P3-007
  - Button to open Risk Calculator
  - Pre-fill symbol, entry, stop from setup
  - Navigate to Risk Calculator view

### Real-Time Scanner Updates
- [ ] **P3-010**: Implement setup updates || P3-001
  - WebSocket or polling for new setups
  - Add new rows with animation
  - Update existing scores
  - Remove invalid setups

### Context Integration
- [ ] **P3-011**: Create `SetupsContext` → F-007
  - Store scanned setups
  - Manage filters and sorting
  - Provide selected setup details

### Empty States
- [ ] **P3-012**: Implement empty state components
  - No setups found view
  - All filtered out view
  - Clear filters button

### Validation
- [ ] Scanner displays 15+ setups correctly
- [ ] Filtering works for all criteria
- [ ] Sorting works correctly
- [ ] Scorecard shows accurate breakdowns
- [ ] Detail drawer displays all information
- [ ] Quick actions navigate correctly

---

## Phase 4: Risk & Position Calculator (Week 7-8) **CRITICAL**

### Position Size Calculator
- [ ] **P4-001**: Create `PositionSizeCalculator` component → F-004, F-005
  - Input form (capital, risk %, entry, stop)
  - React Hook Form + Zod validation
  - Real-time calculation

- [ ] **P4-002**: Implement position sizing logic → F-004
  - Calculate shares needed
  - Apply lot size adjustment (100 shares)
  - Calculate position value
  - Calculate actual risk %
  - Handle insufficient capital

- [ ] **P4-003**: Create `RiskSummaryPanel` component
  - Display all calculated metrics
  - Color-coded status indicators
  - Warnings section

### Stop Loss Planning
- [ ] **P4-004**: Create `StopLossPlanner` component → F-004, F-005
  - Method selector (ATR, Swing, Percentage, Technical)
  - Stop price calculation
  - Distance display
  - Chart visualization

- [ ] **P4-005**: Implement ATR stop calculation → F-005
  - Fetch ATR from backend
  - Calculate stop (entry - N×ATR)
  - Validate against Vietnam limit

- [ ] **P4-006**: Implement Vietnam limit validation → F-004
  - Check stop against ±7% limit
  - Visual indicator of limit floor
  - Color red if exceeds
  - Block trade if invalid

- [ ] **P4-007**: Implement other stop methods || P4-005
  - Swing low stop
  - Percentage stop
  - Technical support stop
  - Display all methods in panel

### Target Planning
- [ ] **P4-008**: Create `TargetPlanner` component → F-005
  - Calculate multiple target methods
  - R-multiple targets
  - Technical resistance levels
  - Fibonacci extensions
  - ATR extension targets

- [ ] **P4-009**: Implement consensus target logic
  - Find targets within 2% range
  - Highlight consensus zone
  - Display confidence level
  - Show on chart

### Risk:Reward Validation
- [ ] **P4-010**: Implement R:R calculation → P4-002, P4-008
  - Calculate risk distance
  - Calculate reward distance
  - Display ratio with color coding
  - Warn if R:R < 1:1.5
  - Block trade if below minimum

### Scaling Strategy
- [ ] **P4-011**: Create scaling strategy configuration
  - Multiple target inputs (T1, T2, T3, T4)
  - Percentage distribution
  - Breakeven rule
  - Trailing stop for final portion

### Pre-Trade Viability Checklist
- [ ] **P4-012**: Implement viability checklist → P4-002, P4-006, P4-010
  - All validation checks
  - Display ✅/❌ for each criterion
  - Overall viability status
  - Enable/disable proceed button

### Correlation Check (Future)
- [ ] **P4-013**: Implement correlation warning (P2 - future)
  - Check against open positions
  - Display correlation coefficient
  - Suggest position reduction
  - Adjust size automatically

### Context Integration
- [ ] **P4-014**: Create risk calculation state management
  - Store current calculation
  - Validate on changes
  - Provide to summary panel

### Validation
- [ ] **CRITICAL**: All risk calculations tested with edge cases
- [ ] Vietnam limit validation blocks invalid trades
- [ ] Position sizing respects lot size requirements
- [ ] R:R warnings display correctly
- [ ] Viability checklist accurately reflects trade validity
- [ ] Manual testing with various scenarios

---

## Phase 5: Position Monitoring (Week 9-10)

### Open Positions Dashboard
- [ ] **P5-001**: Create `OpenPositionsDashboard` component → F-005
  - Table with all position columns
  - Fetch active positions from backend
  - Display P&L, R-multiple, days held

- [ ] **P5-002**: Implement P&L calculations → P5-001
  - Calculate unrealized P&L (VND and %)
  - Calculate R-multiple
  - Color coding (green profit, red loss)
  - Status badges

### Real-Time P&L Updates
- [ ] **P5-003**: Connect positions to WebSocket → F-006, P5-001
  - Subscribe to price updates for open positions
  - Update P&L in real-time
  - Animate price changes (flash)
  - Batch updates for performance

### Stop Management
- [ ] **P5-004**: Create `StopManagementPanel` component → F-005
  - Display current stop
  - Show suggested adjustments
  - Multiple trailing methods
  - Apply adjustment button

- [ ] **P5-005**: Implement breakeven stop suggestion
  - Detect when position hits T1
  - Suggest moving stop to breakeven
  - Calculate risk-free status
  - Show new risk amount (0)

- [ ] **P5-006**: Implement trailing stop suggestions → P5-005
  - ATR trailing stop
  - EMA trailing stop
  - Percentage trailing stop
  - Swing low trailing stop
  - Calculate and display each method

- [ ] **P5-007**: Create stop history display
  - Timeline of stop adjustments
  - Date/time of each change
  - Reason for adjustment
  - Audit trail

### Time-Based Alerts
- [ ] **P5-008**: Implement stagnation detection || P5-001
  - Calculate days held vs R-multiple progress
  - Trigger warning if progress < 0.5R in 10+ days
  - Display alert with suggestions
  - Action buttons (Tighten, Deadline, Close)

### Emergency Indicators
- [ ] **P5-009**: Implement stop hit alert → P5-003
  - Detect when price crosses stop
  - Flash position row red
  - Show urgent modal
  - Play alert sound (optional)
  - Log event

- [ ] **P5-010**: Implement target hit alert → P5-003
  - Detect when price reaches target
  - Flash position row green
  - Show success notification
  - Remind about stop adjustment
  - Log event

### Position Adjustment Controls
- [ ] **P5-011**: Create stop adjustment modal
  - Input for new stop price
  - Method selector
  - Preview new risk
  - Validation
  - Save button → API call

- [ ] **P5-012**: Create partial close modal
  - Input for shares to close
  - Preset buttons (25%, 50%, 75%)
  - Calculate remaining position
  - Show P&L on closed portion
  - Confirm button → API call

- [ ] **P5-013**: Create full close modal
  - Confirmation dialog
  - Display full P&L details
  - Warning if locking loss
  - Confirm button → API call

### Portfolio Summary
- [ ] **P5-014**: Create portfolio summary cards || P5-001
  - Total positions count
  - Total capital at risk
  - Total unrealized P&L
  - Average R-multiple
  - Best/worst performers

- [ ] **P5-015**: Implement portfolio risk warning
  - Calculate total risk across positions
  - Warn if > 8%
  - Disable new trades if exceeded

### Context Integration
- [ ] **P5-016**: Create `PositionsContext` → F-007
  - Store active positions
  - Real-time updates
  - Manage adjustments
  - Provide to dashboard

### Empty States
- [ ] **P5-017**: Create no positions view
  - Message and icon
  - Link to scanner
  - Show recent closed trades

### Validation
- [ ] Real-time P&L updates work correctly
- [ ] Stop suggestions are accurate and timely
- [ ] Emergency alerts trigger at correct times
- [ ] Position adjustments save to backend
- [ ] Portfolio summary calculates correctly
- [ ] Manual testing with multiple positions

---

## Phase 6: Performance Analytics (Week 11-12)

### Performance Overview
- [ ] **P6-001**: Create `PerformanceOverviewCards` component → F-005
  - Win rate card
  - Expectancy card
  - Profit factor card
  - Max drawdown card
  - Fetch metrics from backend

- [ ] **P6-002**: Implement metric interpretation logic
  - Status badges (Good/Poor/Excellent)
  - Color coding
  - Benchmark comparisons
  - Tooltips with explanations

### Risk-Adjusted Metrics
- [ ] **P6-003**: Create risk-adjusted metrics table || P6-001
  - Sharpe ratio
  - Sortino ratio
  - Calmar ratio
  - Annual return and std dev
  - Interpretation tooltips

### Equity Curve
- [ ] **P6-004**: Create `EquityCurveChart` component → F-001, F-005
  - Line chart with time series
  - Fetch equity data from backend
  - Mark starting and current equity
  - Shade drawdown periods
  - Hover tooltips

- [ ] **P6-005**: Add benchmark comparison to equity curve
  - Fetch VN-Index performance
  - Overlay as dashed line
  - Show relative performance
  - Toggle on/off

### Distribution Charts
- [ ] **P6-006**: Create `RMultipleDistribution` component || P6-004
  - Bar chart (histogram)
  - R-multiple ranges on x-axis
  - Count on y-axis
  - Color coding (red/yellow/green)
  - Percentages displayed

- [ ] **P6-007**: Create setup type distribution table
  - Table with setup types
  - Win rate, avg R, count, total profit
  - Rank by performance
  - Highlight best/worst

- [ ] **P6-008**: Create regime distribution table || P6-007
  - Table with regimes
  - Win rate, avg R, count
  - Highlight best regime
  - Warnings for poor regimes

### Drawdown Analysis
- [ ] **P6-009**: Create `DrawdownAnalysisPanel` component
  - Max drawdown display
  - Recovery factor
  - Current drawdown
  - Consecutive losses
  - Drawdown timeline chart

### Export Functionality
- [ ] **P6-010**: Implement CSV export (P2 - lower priority)
  - Export all trades with metrics
  - Generate CSV file
  - Download to user

- [ ] **P6-011**: Implement chart image export || P6-010
  - Capture equity curve as PNG
  - High resolution
  - Download to user

### Context Integration
- [ ] **P6-012**: Create `PerformanceContext` → F-007
  - Fetch and store metrics
  - Cache equity curve data
  - Provide to components

### Validation
- [ ] All metrics calculate correctly
- [ ] Equity curve renders smoothly
- [ ] Distribution charts display data accurately
- [ ] Drawdown analysis matches manual calculations
- [ ] Export functions work correctly

---

## Phase 7: Cross-Feature Integration & Polish (Week 13-14)

### Navigation & Routing
- [ ] **P7-001**: Implement main navigation
  - Top navigation bar
  - Links to all features
  - Active state highlighting
  - Responsive collapse (future)

- [ ] **P7-002**: Set up routing (if using React Router)
  - Routes for each feature
  - 404 page
  - Protected routes (if auth exists)

### Global UI Components
- [ ] **P7-003**: Create shared components library
  - Card component
  - Badge component
  - Button variants
  - Modal/Drawer components
  - Tooltip component
  - Loading spinner

- [ ] **P7-004**: Implement global layout
  - Top navigation
  - Left sidebar (watchlist, alerts - future)
  - Main workspace area
  - Responsive grid system

### Error Handling
- [ ] **P7-005**: Implement error boundaries
  - App-level error boundary
  - Feature-level error boundaries
  - Fallback UI components
  - Error logging

- [ ] **P7-006**: Add error toast notifications
  - API error handling
  - Display user-friendly messages
  - Retry mechanisms

### Loading States
- [ ] **P7-007**: Implement loading skeletons
  - Chart loading skeleton
  - Table loading skeleton
  - Card loading skeleton
  - Prevent layout shift

### WebSocket Connection Management
- [ ] **P7-008**: Implement connection status indicator → F-006
  - Display connection state (connected/disconnected/reconnecting)
  - Show in UI header
  - Auto-reconnect logic
  - Queue messages during disconnect

### Accessibility Improvements
- [ ] **P7-009**: Add keyboard navigation support
  - Focus management
  - Tab order
  - Keyboard shortcuts (future)

- [ ] **P7-010**: Improve color contrast
  - Check all text/background combinations
  - Ensure ≥4.5:1 ratio (WCAG AA)

- [ ] **P7-011**: Add ARIA labels
  - Screen reader support for charts
  - Form labels
  - Button descriptions

### Performance Optimization
- [ ] **P7-012**: Implement code splitting
  - Lazy load feature modules
  - Suspense boundaries
  - Optimize bundle size

- [ ] **P7-013**: Optimize re-renders
  - React.memo on expensive components
  - useMemo for calculations
  - useCallback for callbacks

### Testing
- [ ] **P7-014**: Write unit tests for utilities
  - Vietnam market rules (already done in F-004)
  - Calculation helpers
  - Formatting functions

- [ ] **P7-015**: Write integration tests for key flows
  - Scanner → Risk Calculator flow
  - Position monitoring with updates
  - Context providers

### Documentation
- [ ] **P7-016**: Document component API
  - Props documentation
  - Usage examples
  - Storybook (optional, future)

- [ ] **P7-017**: Create developer README
  - Setup instructions
  - Project structure
  - Coding conventions
  - Testing strategy

### Validation
- [ ] All features integrated and navigable
- [ ] Error handling gracefully handles failures
- [ ] Loading states prevent UI jank
- [ ] WebSocket reconnects automatically
- [ ] Performance is acceptable (no lag)
- [ ] Core tests pass
- [ ] End-to-end manual testing complete

---

## Final Validation Checklist

### Functional Testing
- [ ] Market data loads and displays correctly for multiple symbols
- [ ] All 9 technical indicators display and update in real-time
- [ ] Market regime updates automatically and shows correct recommendations
- [ ] Trade scanner finds setups and filters/sorts correctly
- [ ] Risk calculator validates Vietnam limits and produces correct position sizes
- [ ] Position monitoring shows real-time P&L and suggests stop adjustments
- [ ] Performance analytics display accurate metrics and charts

### Vietnam Market Compliance
- [ ] ±7% price limits enforced on HOSE
- [ ] Lot size adjustment (100 shares) works correctly
- [ ] Session timing is accurate
- [ ] T+2 settlement calculations are correct
- [ ] Gap risk warnings display appropriately

### Performance
- [ ] Charts render in <2 seconds with 500+ candles
- [ ] Real-time updates maintain 60 FPS
- [ ] No memory leaks during extended sessions
- [ ] WebSocket handles high-frequency updates

### User Experience
- [ ] Navigation is intuitive
- [ ] Error messages are helpful
- [ ] Loading states prevent confusion
- [ ] Empty states guide users
- [ ] Tooltips provide context

### Code Quality
- [ ] TypeScript compiles without errors
- [ ] Linter passes (no critical issues)
- [ ] All critical tests pass (Vietnam rules, risk calculations)
- [ ] Code is organized and documented

---

## Deployment Preparation

- [ ] **D-001**: Build production bundle
  - Run `npm run build`
  - Check bundle size
  - Verify no console errors

- [ ] **D-002**: Set up environment variables
  - API base URL
  - WebSocket URL
  - Feature flags (if any)

- [ ] **D-003**: Create deployment README
  - Installation steps
  - Environment setup
  - Run instructions

- [ ] **D-004**: Prepare for backend integration
  - Document API requirements
  - Share frontend expectations
  - Coordinate deployment timing

---

## Notes

### Parallelization Opportunities
Tasks marked with `||` can be worked on in parallel by different developers or in separate sessions.

### Critical Path
The critical path for MVP is: F → P1 → P2 → P3 → P4 → P5 (Phases 1-5). Performance analytics (P6) can be deferred if needed.

### Backend Dependencies
All phases require coordination with backend team to ensure APIs are available and match expected contracts.

### Risk Mitigation
- Phase 4 (Risk Calculator) is CRITICAL and must be thoroughly tested
- Vietnam market rules must be validated with real market data
- WebSocket stability is essential for production readiness
