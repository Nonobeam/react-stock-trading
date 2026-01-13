# Tasks: Implement Phase 1 Trading UI

## Overview
Incremental implementation of Phase 1 UI starting with foundation (theme, shared components) and building up to complete screens. Each task is independently verifiable and delivers user-visible progress.

---

## Phase A: Foundation (Theme & Shared Components)

### Task A1: Set up theme CSS variables
- [ ] Create `src/shared/styles/theme.css` with all Fintech Neon design tokens
- [ ] Import theme in `src/main.tsx`
- [ ] Verify all CSS variables load in browser dev tools
- [ ] Create `src/shared/styles/globals.css` for base resets and typography

**Validation:** Open app, inspect `:root` element, confirm all --var-* custom properties exist

### Task A2: Build Button component
- [ ] Create `src/shared/components/Button.tsx` and `Button.css`
- [ ] Implement variants: primary, secondary, outline, ghost, danger
- [ ] Add size prop: small, medium, large
- [ ] Add disabled state
- [ ] Add loading state with spinner
- [ ] Write component tests
- [ ] Update `src/shared/components/index.ts`

**Validation:** Render all button variants in isolated story/demo page, test all interactive states

### Task A3: Build Card component
- [ ] Create `src/shared/components/Card.tsx` and `Card.css`
- [ ] Implement variants: default, elevated, hoverable
- [ ] Add padding prop
- [ ] Add onClick handler (optional)
- [ ] Write component tests
- [ ] Export from index

**Validation:** Create demo page showing cards in different configurations

### Task A4: Build Badge component
- [ ] Create `src/shared/components/Badge.tsx` and `Badge.css`
- [ ] Implement variants: success, warning, danger, neutral, info
- [ ] Add size prop: small, medium
- [ ] Add dynamic color by score (9-10=green, 8=amber, 7=gray, <7=red)
- [ ] Write tests
- [ ] Export from index

**Validation:** Render badges with all variants and score-based colors

### Task A5: Build Table component
- [ ] Create `src/shared/components/Table/` directory
- [ ] Implement `Table.tsx`, `TableHeader.tsx`, `TableRow.tsx`, `TableCell.tsx`
- [ ] Add sortable columns with arrow indicators
- [ ] Add row hover effects
- [ ] Add row selection checkboxes (optional)
- [ ] Add sticky header (position: sticky)
- [ ] Write tests
- [ ] Export from index

**Validation:** Create demo table with 20 rows, test sorting, hover states, sticky header on scroll

### Task A6: Build Modal component
- [ ] Create `src/shared/components/Modal.tsx` and `Modal.css`
- [ ] Implement backdrop with blur
- [ ] Add open/close animations (slide-up on mobile, fade on desktop)
- [ ] Implement focus trap
- [ ] Add Escape key and backdrop click handlers
- [ ] Add close button (×) in header
- [ ] Write tests including accessibility
- [ ] Export from index

**Validation:** Open/close modal, test Escape key, Tab navigation stays inside, click backdrop closes

### Task A7: Build LoadingSkeleton component
- [ ] Create `src/shared/components/LoadingSkeleton.tsx` and `LoadingSkeleton.css`
- [ ] Implement shimmer animation
- [ ] Add variants: text, card, table
- [ ] Add rows prop for table variant
- [ ] Write tests
- [ ] Export from index

**Validation:** Show loading skeleton that matches table structure, verify shimmer animation

### Task A8: Build EmptyState component
- [ ] Create `src/shared/components/EmptyState.tsx` and `EmptyState.css`
- [ ] Accept props: icon, title, description, action button
- [ ] Center layout with proper spacing
- [ ] Write tests
- [ ] Export from index

**Validation:** Display empty state, verify centered layout and styling

---

## Phase B: Vietnam Finance Services

### Task B1: Implement commission calculation service
- [ ] Create `src/services/vietnam/commission.ts`
- [ ] Implement `calculateEntryCommission(entryValue)` (0.25%, min 500 VND)
- [ ] Implement `calculateExitCommission(exitValue)`
- [ ] Implement `calculateExitTax(exitValue)` (0.1%)
- [ ] Write comprehensive unit tests with edge cases

**Validation:** Run tests, verify calculations match spec examples exactly

### Task B2: Implement net P&L calculation service
- [ ] Create `src/services/vietnam/pnl.ts`
- [ ] Implement `calculateNetPnL(grossPnL, entryComm, exitComm, exitTax)`
- [ ] Implement `calculateNetPnLPercent(netPnL, entryValue)`
- [ ] Implement `calculateRMultiple(currentPrice, entryPrice, stopPrice)`
- [ ] Write tests for winning and losing trades

**Validation:** Test with spec examples, verify net P&L = 3,971,464 for VCB example

### Task B3: Implement position sizing service
- [ ] Create `src/services/vietnam/positionSize.ts`
- [ ] Implement `calculatePositionSize(capital, riskPercent, entry, stop)`
- [ ] Implement `adjustForLotSize(shares, lotSize)` (round down to nearest lot)
- [ ] Implement `calculatePositionValue(shares, price)`
- [ ] Write tests

**Validation:** Test: 100M capital, 1.5% risk, entry 85,600, stop 81,100 → 333 shares

### Task B4: Implement T+2 settlement service
- [ ] Create `src/services/vietnam/settlement.ts`
- [ ] Implement `getSettlementDate(tradeDate)` accounting for weekends
- [ ] Create Vietnam holiday calendar (2025-2026)
- [ ] Implement `isHoliday(date)` and `isWeekend(date)`
- [ ] Write tests for weekday, weekend, holiday scenarios

**Validation:** Monday Jan 13 → settles Wednesday Jan 15, Friday Jan 10 → settles Tuesday Jan 14

---

## Phase C: Context Providers & Mock Data

### Task C1: Create MarketDataContext
- [ ] Create `src/context/MarketDataContext.tsx`
- [ ] Define state interface (vnIndex, marketStatus, regime, score)
- [ ] Implement provider with useState
- [ ] Create mock service: `src/services/mock/marketData.ts`
- [ ] Generate realistic VN-Index data with fluctuations
- [ ] Implement simulated real-time updates (every 3 seconds)
- [ ] Export useMarketData hook

**Validation:** Log context values, verify real-time updates, check data structure

### Task C2: Create AccountContext
- [ ] Create `src/context/AccountContext.tsx`
- [ ] Define state (capital, cash, locked, P&L, risk)
- [ ] Create mock service: `src/services/mock/account.ts`
- [ ] Generate realistic account data
- [ ] Calculate aggregate risk from positions
- [ ] Export useAccount hook

**Validation:** Log context, verify capital calculations, test risk percentage updates

### Task C3: Create PositionsContext
- [ ] Create `src/context/PositionsContext.tsx`
- [ ] Define Position and ClosedPosition interfaces
- [ ] Create mock service: `src/services/mock/positions.ts`
- [ ] Generate 4-5 realistic open positions with Vietnam financials
- [ ] Generate 20+ closed positions for history
- [ ] Implement real-time price updates for open positions
- [ ] Calculate net P&L, R-multiples for all positions
- [ ] Export usePositions hook

**Validation:** Log positions, verify P&L calculations match Vietnam rules, test real-time updates

### Task C4: Create SetupsContext (Watchlist & Signals)
- [ ] Create `src/context/SetupsContext.tsx`
- [ ] Define WatchlistStock and Signal interfaces
- [ ] Create mock service: `src/services/mock/setups.ts`
- [ ] Generate 15-20 watchlist stocks with varied readiness
- [ ] Generate 3-5 active signals
- [ ] Implement signal expiration logic
- [ ] Export useSetups hook

**Validation:** Log setups, verify score distribution, test signal state transitions

### Task C5: Create PerformanceContext
- [ ] Create `src/context/PerformanceContext.tsx`
- [ ] Define analytics interfaces
- [ ] Create mock service: `src/services/mock/analytics.ts`
- [ ] Generate equity curve data
- [ ] Calculate win rate, expectancy, profit factor
- [ ] Generate setup type breakdown
- [ ] Export usePerformance hook

**Validation:** Log analytics, verify calculations, check data integrity

---

## Phase D: Dashboard Screen

### Task D1: Build DashboardHeader component
- [ ] Create `src/features/dashboard/components/DashboardHeader.tsx`
- [ ] Display personalized greeting (Good Morning/Afternoon/Evening)
- [ ] Show current date/time (update every minute)
- [ ] Display market status badge (OPEN/CLOSED)
- [ ] Show VN-Index with color-coded change
- [ ] Display market regime badge and score
- [ ] Add click handlers for regime explanation modal (stub for now)
- [ ] Make header sticky on scroll

**Validation:** View header, verify real-time clock updates, check market status styling

### Task D2: Build PortfolioSummaryCard component
- [ ] Create `src/features/dashboard/components/PortfolioSummaryCard.tsx`
- [ ] Display total capital, today P&L, total P&L
- [ ] Show open position count
- [ ] Display aggregate risk with percentage
- [ ] Add click handlers (stubs)
- [ ] Use Card component
- [ ] Apply color coding for P&L (green/red)

**Validation:** Card shows correct data from AccountContext, colors match P&L sign

### Task D3: Build RiskGauge component
- [ ] Create `src/features/dashboard/components/RiskGauge.tsx`
- [ ] Implement horizontal segmented bar (10 segments)
- [ ] Fill segments based on risk percentage
- [ ] Color code: green (0-3%), yellow (3-5%), red (5-6%)
- [ ] Add hover tooltip showing risk breakdown by position
- [ ] Add pulsing animation if risk > 5%

**Validation:** Display with 4.2% risk → 7 segments filled in yellow, tooltip shows breakdown

### Task D4: Build SignalCard component
- [ ] Create `src/features/dashboard/components/SignalCard.tsx`
- [ ] Display priority badge, symbol, score
- [ ] Show entry, stop, setup description
- [ ] Display risk and R:R ratio
- [ ] Add action buttons (VIEW DETAILS, EXECUTE TRADE, DISMISS)
- [ ] Implement card expansion on click
- [ ] Use Card component with hover effects

**Validation:** Render 3 signal cards, test hover, click expansion, button interactions

### Task D5: Build AIInsightsPanel component
- [ ] Create `src/features/dashboard/components/AIInsightsPanel.tsx`
- [ ] Create InsightCard sub-component
- [ ] Implement card types: insight, warning, success, news
- [ ] Display icon, title, message, optional action button
- [ ] Add swipe-to-dismiss on mobile (optional)
- [ ] Generate mock insights

**Validation:** Display panel with 3-5 insight cards, verify icon colors and styling

### Task D6: Build OpenPositionsTable component
- [ ] Create `src/features/dashboard/components/OpenPositionsTable.tsx`
- [ ] Use shared Table component
- [ ] Display columns: Symbol, Entry, Current, P&L, Days, Next, Actions
- [ ] Implement row color tinting (green winners, red losers, amber stagnant)
- [ ] Add row click handler → position detail modal (stub)
- [ ] Add chart and alert action icons
- [ ] Implement sorting

**Validation:** Table shows 4 positions, correct colors, sorting works, hover effects present

### Task D7: Assemble DashboardView
- [ ] Create `src/features/dashboard/DashboardView.tsx`
- [ ] Arrange components in 3-column layout (left panel, center, right panel)
- [ ] Wire up all context providers
- [ ] Implement responsive breakpoints
- [ ] Add error boundary
- [ ] Add loading states

**Validation:** Full dashboard renders, all data flows correctly, responsive layout works

---

## Phase E: Watchlist Screen

### Task E1: Build WatchlistHeader component
- [ ] Create `src/features/watchlist/components/WatchlistHeader.tsx`
- [ ] Implement search bar with autocomplete
- [ ] Add filter dropdown (setup type, score, readiness, sector)
- [ ] Add sort dropdown (score, readiness, price change, volume)
- [ ] Display quick stats (total, near entry, setting up)
- [ ] Wire up filter/sort state

**Validation:** Search suggests stocks, filters update table, sort reorders rows

### Task E2: Build WatchlistTable component
- [ ] Create `src/features/watchlist/components/WatchlistTable.tsx`
- [ ] Implement 10-column table (checkbox, symbol, price, change, vol, score, setup, distance, days, alert)
- [ ] Add real-time price updates with flash animation
- [ ] Implement row selection checkboxes
- [ ] Add volume percentile color coding
- [ ] Add score badge with dynamic colors
- [ ] Implement distance/status display logic
- [ ] Add alert icon states (⚡ ready, 🔔 set, 🔕 none)

**Validation:** Table shows 15 stocks, prices update, flash animations work, colors correct

### Task E3: Build StockDetailPanel component
- [ ] Create `src/features/watchlist/components/StockDetailPanel.tsx`
- [ ] Implement slide-in animation from right
- [ ] Display header with symbol, price, score
- [ ] Add mini chart placeholder (static for Phase 1)
- [ ] Show setup analysis checklist (✓ ✗ ⚠️)
- [ ] Display entry details if ready
- [ ] Add action buttons
- [ ] Implement close handlers (×, Escape, click outside)

**Validation:** Click row → panel slides in, close works, data displays correctly

### Task E4: Build watchlist management actions
- [ ] Create add stock modal
- [ ] Implement stock search with autocomplete
- [ ] Create remove confirmation modal
- [ ] Implement bulk actions (remove selected, set alerts)
- [ ] Add empty state component

**Validation:** Add stock, remove stock, bulk remove, empty state appears when list is empty

### Task E5: Assemble WatchlistView
- [ ] Create `src/features/watchlist/WatchlistView.tsx`
- [ ] Arrange header and table
- [ ] Wire up detail panel overlay
- [ ] Implement filter/sort logic
- [ ] Add responsive layout
- [ ] Add error boundary and loading states

**Validation:** Full watchlist screen works, all interactions function, responsive

---

## Phase F: Portfolio Screen

### Task F1: Build PortfolioHeader component
- [ ] Create `src/features/portfolio/components/PortfolioHeader.tsx`
- [ ] Display total portfolio value (large, prominent)
- [ ] Show all-time P&L with % and color
- [ ] Implement tab navigation (Capital, Positions, History, Analytics)
- [ ] Add hover tooltips for value calculations

**Validation:** Header displays correct totals, tabs switch content panels

### Task F2: Build Capital tab components
- [ ] Create CapitalSummaryCards (Available Cash, Locked, In Positions)
- [ ] Build CapitalBreakdownChart (pie chart using lightweight library or custom SVG)
- [ ] Create RiskAllocationPanel
- [ ] Display settlement schedule in Locked card
- [ ] Implement card interactions (expand, click for details)

**Validation:** Capital tab shows all 3 cards, pie chart renders, risk panel displays

### Task F3: Build PositionDetailCard component
- [ ] Create `src/features/portfolio/components/PositionDetailCard.tsx`
- [ ] Display comprehensive position info
- [ ] Build P&L breakdown panel with all costs
- [ ] Show stop loss and targets with progress bar
- [ ] Add days held and metadata
- [ ] Implement action buttons (ADJUST STOP, TAKE PROFIT, CLOSE, NOTES)
- [ ] Add warning states (amber/red backgrounds)

**Validation:** Card shows all position details, P&L breakdown matches calculations, colors correct

### Task F4: Build Positions tab
- [ ] Create PositionsTab component
- [ ] Implement filter tabs (All, Winners, Losers, Break-even)
- [ ] Add sort dropdown
- [ ] Render PositionDetailCard for each position
- [ ] Add empty state

**Validation:** Positions tab shows 4 positions, filters work, detailed cards display

### Task F5: Build History tab components
- [ ] Create HistoryTab component
- [ ] Build ClosedTradesTable
- [ ] Implement filter controls (date range, outcome, stock, setup)
- [ ] Add summary statistics bar
- [ ] Create TradeReviewModal for detailed review

**Validation:** History shows 20+ trades, filters work, clicking row opens detail modal

### Task F6: Build Analytics tab components
- [ ] Create AnalyticsTab component
- [ ] Build key metrics cards (trades, win rate, expectancy, risk)
- [ ] Create EquityCurve chart component
- [ ] Build SetupTypeBreakdown chart
- [ ] Create RMultipleHistogram
- [ ] Add MAE vs MFE scatter plot placeholder
- [ ] Implement time period selector

**Validation:** Analytics shows all charts, metrics calculate correctly, charts render

### Task F7: Assemble PortfolioView
- [ ] Create `src/features/portfolio/PortfolioView.tsx`
- [ ] Wire up tab navigation state
- [ ] Implement responsive layouts for each tab
- [ ] Add error boundaries
- [ ] Add loading states

**Validation:** Full portfolio screen works, all tabs function, data flows correctly

---

## Phase G: Signals Screen

### Task G1: Build SignalCardDetailed component
- [ ] Create `src/features/signals/components/SignalCardDetailed.tsx`
- [ ] Display comprehensive signal info (all fields from spec)
- [ ] Build Entry & Risk panel
- [ ] Build Position Sizing panel with portfolio impact warnings
- [ ] Build AI Reasoning panel with checklist
- [ ] Add action buttons with appropriate states
- [ ] Implement freshness indicator and expiration logic

**Validation:** Detailed signal card shows all information, warnings display, calculations correct

### Task G2: Build Active Signals tab
- [ ] Create ActiveSignalsTab component
- [ ] Render SignalCardDetailed for each active signal
- [ ] Implement real-time price updates
- [ ] Add signal expiration countdown
- [ ] Implement action button handlers (EXECUTE, VIEW CHART, SNOOZE, DISMISS)
- [ ] Add empty state

**Validation:** Active tab shows 3 signals, prices update, expiration works, actions function

### Task G3: Build Watch Signals tab
- [ ] Create WatchSignalsTab component
- [ ] Display watch signals with progress indicators
- [ ] Show "What's missing" and "Estimated time"
- [ ] Implement [SET ALERT WHEN READY] action
- [ ] Handle transition to Active when ready

**Validation:** Watch tab shows setting-up signals, progress indicators work

### Task G4: Build Dismissed and History tabs
- [ ] Create DismissedSignalsTab component
- [ ] Show dismissed signals with timestamp and reason
- [ ] Implement [RESTORE] action
- [ ] Create HistoryTab component
- [ ] Display past signals with outcomes
- [ ] Link outcomes to trade results

**Validation:** Dismissed tab shows dismissed signals, restore works, history shows outcomes

### Task G5: Assemble SignalsView
- [ ] Create `src/features/signals/SignalsView.tsx`
- [ ] Implement tab navigation (Active, Watch, Dismissed, History)
- [ ] Add tab badges with counts
- [ ] Wire up filter and sort controls
- [ ] Add responsive layouts
- [ ] Add error boundary and loading states

**Validation:** Full signals screen works, all tabs function, interactions work

---

## Phase H: Integration & Polish

### Task H1: Set up routing
- [ ] Install react-router-dom (if not already)
- [ ] Create routes in App.tsx:
  - / → redirect to /dashboard
  - /dashboard → DashboardView
  - /watchlist → WatchlistView
  - /portfolio → PortfolioView
  - /signals → SignalsView
- [ ] Create navigation component with horizontal tabs
- [ ] Add active tab indicator
- [ ] Test navigation between screens

**Validation:** Click navigation tabs, URLs change, correct screens load

### Task H2: Implement responsive layouts
- [ ] Test all screens at 1920px (desktop)
- [ ] Test all screens at 1024px (tablet)
- [ ] Test all screens at 768px (mobile)
- [ ] Adjust layouts as needed per CORE.md specs
- [ ] Implement table → card view transformation on mobile
- [ ] Test modals on mobile (full screen)

**Validation:** All screens work correctly at all breakpoints

### Task H3: Add animations and transitions
- [ ] Implement price flash animations (green up, red down)
- [ ] Add card hover elevations
- [ ] Polish modal open/close animations
- [ ] Add detail panel slide-in/out animations
- [ ] Implement smooth tab transitions
- [ ] Add loading skeleton transitions

**Validation:** All animations smooth, no jank, transitions polished

### Task H4: Real-time update system
- [ ] Create MockRealtimeService in `src/services/mock/realtime.ts`
- [ ] Implement price update simulation (every 3 seconds)
- [ ] Wire up to PositionsContext
- [ ] Wire up to SetupsContext (watchlist, signals)
- [ ] Wire up to MarketDataContext
- [ ] Add start/stop controls

**Validation:** Prices update every 3 seconds, flash animations trigger, no memory leaks

### Task H5: Error handling and boundaries
- [ ] Wrap each feature in ErrorBoundary
- [ ] Create error fallback components
- [ ] Add try-catch in all data services
- [ ] Implement retry logic for failed operations
- [ ] Test by throwing errors in components

**Validation:** Errors caught gracefully, fallback UI shows, app doesn't crash

### Task H6: Loading states
- [ ] Add loading skeletons to all data-dependent components
- [ ] Implement suspense boundaries
- [ ] Add spinner for button loading states
- [ ] Test with simulated slow data loading

**Validation:** Loading states appear correctly, no layout shift when data loads

### Task H7: Accessibility audit
- [ ] Check keyboard navigation (Tab, Enter, Escape)
- [ ] Verify focus trap in modals
- [ ] Add aria-labels where needed
- [ ] Test with screen reader (basic)
- [ ] Ensure color contrast meets WCAG AA
- [ ] Add focus indicators

**Validation:** Keyboard navigation works, modals accessible, screen reader usable

### Task H8: Performance optimization
- [ ] Wrap expensive calculations in useMemo
- [ ] Wrap callbacks in useCallback
- [ ] Implement React.memo for pure components
- [ ] Check for unnecessary re-renders (React DevTools Profiler)
- [ ] Test with 100+ watchlist items
- [ ] Test with 50+ position history items

**Validation:** No performance issues, smooth scrolling, fast interactions

### Task H9: Component documentation
- [ ] Add JSDoc comments to all shared components
- [ ] Document prop interfaces
- [ ] Create README.md in src/shared/components/
- [ ] Add usage examples for complex components

**Validation:** Components are well-documented, examples are clear

### Task H10: Final testing and validation
- [ ] Test all success criteria from proposal.md
- [ ] Verify theme consistency across all screens
- [ ] Check all Vietnam financial calculations
- [ ] Test all user interactions
- [ ] Verify responsive layouts
- [ ] Check real-time updates
- [ ] Test error scenarios
- [ ] Verify no emojis in production UI

**Validation:** All acceptance criteria met, no critical bugs

---

## Total Tasks: 79

**Estimated Completion:**
- Phase A (Foundation): 8 tasks = 2-3 days
- Phase B (Finance): 4 tasks = 1 day
- Phase C (Context): 5 tasks = 2 days
- Phase D (Dashboard): 7 tasks = 3-4 days
- Phase E (Watchlist): 5 tasks = 2-3 days
- Phase F (Portfolio): 7 tasks = 4-5 days
- Phase G (Signals): 5 tasks = 2-3 days
- Phase H (Integration): 10 tasks = 3-4 days

**Total Estimated Time: 19-27 days** (assuming 1 developer working full-time)
