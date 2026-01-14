# Tasks: Redesign Dashboard Two-Column Layout

## Overview
Restructure the Dashboard into a two-column layout with market indices on the left and portfolio/account data on the right.

---

## Phase 1: Extend Mock Data Service

### Task 1.1: Add VN30 and VN100 Index Data
- [x] Update `MarketData` interface in `src/services/mock/marketData.ts`
- [x] Add `vn30` and `vn100` properties with value, change, changePercent
- [x] Generate derived values from VNINDEX (VN30 beta ~1.1, VN100 beta ~0.9)
- [x] Add historical data point generation (50 points for intraday)

**Validation:** Run app, verify console logs show extended market data

### Task 1.2: Update MarketDataContext Types
- [x] Update `MarketDataContextValue` interface if needed
- [x] Ensure backward compatibility with existing consumers

**Validation:** Existing dashboard components still work

---

## Phase 2: Create MarketIndexChart Component

### Task 2.1: Create Component Structure
- [x] Create folder `src/features/dashboard/components/MarketIndexChart/`
- [x] Create `MarketIndexChart.tsx` with props interface
- [x] Create `MarketIndexChart.css` with theme-compliant styles
- [x] Create `index.ts` barrel export

**Validation:** Component renders without errors

### Task 2.2: Implement Tab Navigation
- [x] Add tabs for VNINDEX, VN30, VN100
- [x] Highlight active tab with accent color and glow
- [x] Store active tab in component state
- [x] Apply theme tab styles per FINTECH_NEON_THEME.md

**Validation:** Tabs switch correctly, active tab shows accent styling

### Task 2.3: Implement Line Chart
- [x] Use Recharts `LineChart` with `ResponsiveContainer`
- [x] Configure chart colors per theme (accent, success, danger based on trend)
- [x] Add glow effect via filter on positive trends
- [x] Implement glass-style tooltip
- [x] Add grid lines with theme border color

**Validation:** Chart renders with neon styling, tooltip shows on hover

### Task 2.4: Add Index Summary Display
- [x] Show current value prominently (large, tabular-nums)
- [x] Show change and change percent with color coding
- [x] Add subtle time indicator (e.g., "Last updated: 10:30 AM")

**Validation:** Values update when market data refreshes

### Task 2.5: Handle Loading and Empty States
- [x] Show `LoadingSkeleton` during data fetch
- [x] Handle empty data gracefully with placeholder message

**Validation:** Loading skeleton appears, empty state shows message

---

## Phase 3: Restructure Dashboard Layout

### Task 3.1: Update DashboardView.css Grid
- [x] Add `.dashboard__main` container with two-column grid
- [x] Add `.dashboard__left-column` flex container
- [x] Add `.dashboard__right-column` flex container
- [x] Set gap between columns to `var(--gap-xl)` (32px)
- [x] Set gap between cards to `var(--gap-lg)` (24px)

**Validation:** Layout shows two columns on desktop viewport

### Task 3.2: Add Responsive Breakpoints
- [x] At 1024px: Switch to single column
- [x] At 768px: Reduce padding and gaps
- [x] Ensure mobile layout maintains usability

**Validation:** Layout adapts correctly at breakpoints

### Task 3.3: Reorganize DashboardView.tsx Structure
- [x] Remove current analytics section layout
- [x] Create left column with MarketIndexChart + WatchlistPanel
- [x] Create right column with PortfolioChart + Cards + RecommendButton
- [x] Remove redundant StatCard grid (data now in Account Summary)

**Validation:** All components render in correct positions

---

## Phase 4: Refine Right Column Components

### Task 4.1: Adjust PortfolioChart Position
- [x] Move PortfolioChart to top of right column
- [x] Ensure proper height constraints
- [x] Verify pie chart renders correctly in new layout

**Validation:** Pie chart displays correctly at top of right column

### Task 4.2: Ensure Card Consistency
- [x] Account Summary card uses `Card` component with `variant="elevated"`
- [x] Open Positions card uses same styling
- [x] Latest Signals card uses same styling
- [x] All cards have consistent padding and border radius

**Validation:** All cards have uniform appearance

### Task 4.3: Position AI Recommend Section
- [x] Place RecommendButton at bottom of right column
- [x] Ensure modal still works correctly
- [x] Apply proper spacing below last card

**Validation:** Recommend button functional, modal opens

---

## Phase 5: Testing and Polish

### Task 5.1: Visual QA
- [x] Verify all theme colors are correctly applied
- [x] Check glow effects on charts and buttons
- [x] Verify transitions are smooth (200-350ms)
- [x] Confirm contrast ratios meet accessibility standards

**Validation:** Visual inspection passes all theme requirements

### Task 5.2: Responsive Testing
- [x] Test at 1440px (wide desktop)
- [x] Test at 1024px (breakpoint)
- [x] Test at 768px (tablet)
- [x] Test at 375px (mobile)

**Validation:** Layout works at all tested widths

### Task 5.3: Performance Verification
- [x] Verify no layout thrashing during data updates
- [x] Check chart animations are smooth
- [x] Ensure no memory leaks from chart subscriptions

**Validation:** Performance profiler shows no issues

---

## Dependencies

```
Phase 1 (Mock Data) ──► Phase 2 (MarketIndexChart) ──► Phase 3 (Layout)
                                                            │
                                                            ▼
                                                      Phase 4 (Polish)
                                                            │
                                                            ▼
                                                      Phase 5 (Testing)
```

## Parallelizable Work
- Task 3.1 and 3.2 (CSS) can run in parallel with Task 2.x (Component)
- Task 4.x can start once Task 3.3 skeleton is in place

## Estimated Effort
- Phase 1: 1 hour
- Phase 2: 3 hours
- Phase 3: 2 hours
- Phase 4: 1 hour
- Phase 5: 1 hour
- **Total: ~8 hours**
