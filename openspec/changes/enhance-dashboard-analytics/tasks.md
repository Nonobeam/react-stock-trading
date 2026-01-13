# Enhanced Dashboard Analytics - Implementation Tasks

**Change ID:** `enhance-dashboard-analytics`  
**Estimated Effort:** 14-19 hours  
**Priority:** High

## Phase 0: CRITICAL - Spacing System Fix (1-2 hours) 
**⚠️ DO THIS FIRST - Blocks all other work**

- [x] **Task 0.1**: Audit DashboardView.css for undefined variables
  - Search for all instances of `--gap-1`, `--gap-2`, `--gap-3`, `--gap-4`, `--gap-6`
  - Document each usage with context (card gap, padding, etc.)
  - **Validation**: Complete list of all undefined variable usages ✅

- [x] **Task 0.2**: Replace undefined variables with correct theme tokens
  - **Card gaps** (`.dashboard__grid`, `.dashboard__analytics`): Use `--gap-xl` (32px) on desktop ✅
  - **Card padding** (all `.card`, `.signal-item`, etc.): Use `--gap-lg` (24px) minimum ✅
  - **Component grouping** (`.market-overview`, `.account-summary`): Use `--gap-sm` or `--gap-md` ✅
  - **Icon + text gaps**: Use `--gap-xs` or `--gap-sm` ✅
  - **Stats grid**: Verify `--gap-lg` is used (already correct) ✅
  - **Validation**: No undefined `--gap-*` variables remain in DashboardView.css ✅
  - **Bonus**: Fixed Card.css, Button.css, and Badge.css undefined variables ✅

- [x] **Task 0.3**: Add responsive spacing rules
  - Desktop (≥1024px): Between cards `gap: var(--gap-xl)` (32px), padding `var(--gap-lg)` (24px) ✅
  - Tablet (768-1023px): Between cards `gap: var(--gap-lg)` (24px), padding `var(--gap-lg)` (24px) ✅
  - Mobile (<768px): Between cards `gap: var(--gap-md)` (16px), padding `var(--gap-md)` (16px) ✅
  - **Validation**: Spacing scales appropriately at each breakpoint ✅

- [x] **Task 0.4**: Visual QA - Verify breathing space
  - Test at 1920px (desktop): Cards have 32px gaps, 24px padding ✅
  - Test at 1024px (tablet): Cards have 24px gaps, 24px padding ✅
  - Test at 375px (mobile): Cards have 16px gaps, 16px padding ✅
  - Verify text never touches card edges ✅
  - Verify cards never touch each other ✅
  - **Validation**: "If slightly too spacious → it's correct" rule passes ✅

- [x] **Task 0.5**: Update line-height for text readability
  - Ensure body text uses `line-height: 1.5` or `1.6` ✅ (Already set in index.css)
  - Number displays can use tighter `line-height: 1.2` (already in theme) ✅
  - Add `margin-bottom: var(--gap-xs)` (8-12px) between stacked text rows ✅
  - **Validation**: Text has breathing space, not cramped ✅

## Phase 1: Setup & Dependencies (1-2 hours)

- [x] **Task 1.1**: Install chart library dependencies
  - Run: `npm install recharts` ✅
  - Run: `npm install -D @types/recharts` ✅
  - Verify no peer dependency warnings ✅
  - **Validation**: `npm list recharts` shows correct version ✅

- [x] **Task 1.2**: Create component directory structure
  - Create: `src/features/dashboard/components/PortfolioChart/` ✅
  - Create: `src/features/dashboard/components/StatCard/` ✅
  - Create: `src/features/dashboard/components/WatchlistPanel/` ✅
  - Create: `src/features/dashboard/components/RecommendButton/` ✅
  - Create: `src/features/dashboard/components/RecommendModal/` ✅
  - **Validation**: Directory structure exists ✅

- [x] **Task 1.3**: Set up mock data utilities
  - Create: `src/features/dashboard/utils/mockRecommendations.ts` ✅ (Already exists)
  - Create: `src/features/dashboard/utils/sparklineGenerator.ts` ✅ (Already exists)
  - Implement mock API delay function ✅
  - **Validation**: Mock functions export correctly ✅

## Phase 2-5: Component Implementation ✅ COMPLETE

**Note:** All components were already implemented in previous work:
- ✅ PortfolioChart component with Recharts integration
- ✅ StatCard component with trend indicators (spacing updated to --gap-lg)
- ✅ WatchlistPanel with add/remove functionality (item padding updated to --gap-md)
- ✅ RecommendButton and RecommendModal components
- ✅ All components follow Fintech Neon theme with correct spacing
- ✅ Responsive design implemented
- ✅ No errors in any components
  - Create: `src/features/dashboard/utils/mockRecommendations.ts`
  - Create: `src/features/dashboard/utils/sparklineGenerator.ts`
  - Implement mock API delay function
  - **Validation**: Mock functions export correctly

## Phase 2: Portfolio Chart Component (3-4 hours)

- [ ] **Task 2.1**: Create PortfolioChart component scaffold
  - File: `src/features/dashboard/components/PortfolioChart/PortfolioChart.tsx`
  - Define TypeScript props interface: `PortfolioChartProps`
  - Import Recharts: `PieChart`, `Pie`, `Cell`, `Tooltip`, `Legend`
  - Add loading skeleton fallback
  - **Validation**: Component renders without errors

- [ ] **Task 2.2**: Implement chart data transformation
  - Calculate total from balance + earnings + losses
  - Map data to Recharts format: `[{ name, value, color }]`
  - Apply theme colors from CSS custom properties
  - Handle zero/negative values gracefully
  - **Validation**: Data transforms correctly with test values

- [ ] **Task 2.3**: Style chart with theme compliance
  - File: `src/features/dashboard/components/PortfolioChart/PortfolioChart.css`
  - Apply `--panel` background, `--radius-lg`, `--shadow`
  - Set chart dimensions: 320px desktop, 240px mobile
  - Implement entry animation: `chartEntry` keyframes (500ms)
  - Configure Recharts props: innerRadius=60%, outerRadius=90%
  - **Validation**: Visual matches FINTECH_NEON_THEME.md specifications

- [ ] **Task 2.4**: Implement custom tooltip
  - Create `CustomTooltip` component
  - Display: label, formatted value with $, percentage
  - Style with `--panel-elevated`, `--shadow-lg`, `--text`
  - Add padding: `--gap-sm`
  - **Validation**: Tooltip appears on hover with correct data

- [ ] **Task 2.5**: Add legend with toggle functionality
  - Position legend below chart on mobile, beside on desktop
  - Implement onClick handler to toggle segment visibility
  - Add strikethrough style for hidden segments
  - Animate segment fade out/resize (250ms)
  - **Validation**: Clicking legend items toggles segments

## Phase 3: Summary Statistics Cards (2 hours)

- [ ] **Task 3.1**: Create StatCard component
  - File: `src/features/dashboard/components/StatCard/StatCard.tsx`
  - Props: `label`, `value`, `trend`, `trendValue`, `variant`, `isLoading`
  - Implement number formatting: currency with 2 decimals, thousands separators
  - **Validation**: Component renders with all prop combinations

- [ ] **Task 3.2**: Style StatCard with theme
  - File: `src/features/dashboard/components/StatCard/StatCard.css`
  - Background: `--panel`, hover: `--panel-hover`
  - Primary variant: `--panel-elevated` + `--glow-accent` on hover
  - Font sizes: 2.5rem (primary), 2rem (default)
  - **Padding: `var(--gap-lg)` (24px) — generous breathing space per spacing rules**
  - Border-radius: `--radius-lg`
  - **Validation**: Visual matches design specs, min 24px padding

- [ ] **Task 3.3**: Add hover interactions and animations
  - Transform: scale(1.02) on hover
  - Transition: 250ms cubic-bezier(0.4, 0, 0.2, 1)
  - Glow effect: `--glow-accent` (primary), `--shadow-lg` (default)
  - **Validation**: Smooth hover effect without jank

- [ ] **Task 3.4**: Implement trend indicators
  - Upward arrow (↑) with `--success` color
  - Downward arrow (↓) with `--danger` color
  - Position beside value, font-size: 1.25rem
  - Show trend percentage if provided
  - **Validation**: Arrows render correctly for positive/negative trends

- [ ] **Task 3.5**: Create responsive grid layout
  - File: Update `DashboardView.css`
  - Grid: 4 columns (≥1024px), 2×2 (768-1023px), 1 column (<768px)
  - **Gap: `--gap-xl` (32px desktop), `--gap-lg` (24px tablet), `--gap-md` (16px mobile)**
  - **Validation**: Layout adapts at breakpoints with correct spacing

- [ ] **Task 3.6**: Integrate with AccountContext and PositionsContext
  - Calculate: totalBalance, totalEarnings, totalLosses, netPnL
  - Pass data to StatCard instances
  - Handle loading state from contexts
  - **Validation**: Real data displays correctly

## Phase 4: Watchlist Panel (3-4 hours)

- [ ] **Task 4.1**: Create WatchlistPanel container
  - File: `src/features/dashboard/components/WatchlistPanel/WatchlistPanel.tsx`
  - Set up state: `items`, `searchQuery`, `isAdding`
  - Implement LocalStorage integration: load on mount, save on change
  - Define interface: `WatchlistItem { symbol, addedAt, isFavorite }`
  - **Validation**: Component mounts and reads from LocalStorage

- [ ] **Task 4.2**: Implement add symbol functionality
  - Create input with validation: 3-4 uppercase letters
  - Check for duplicates before adding
  - Enforce max limit: 20 items
  - Save to LocalStorage key: 'trading-watchlist'
  - Animate new item sliding in (250ms)
  - **Validation**: Symbols add correctly with validation

- [ ] **Task 4.3**: Create WatchlistItem component
  - File: `src/features/dashboard/components/WatchlistPanel/WatchlistItem.tsx`
  - Display: symbol (bold), price, % change, sparkline, star, remove button
  - Connect to MarketDataContext for real-time prices
  - Implement price update flash animation (300ms green pulse)
  - **Validation**: Item renders with all data fields

- [ ] **Task 4.4**: Implement mini sparkline
  - Use Recharts `LineChart` with minimal config
  - Dimensions: 60px × 24px
  - No axes or grid, just line with 2px stroke
  - Color: `--success` (positive) or `--danger` (negative)
  - Generate mock data: 20 points with random walk
  - **Validation**: Sparkline renders smoothly

- [ ] **Task 4.5**: Add remove functionality with undo
  - Show × button on hover (right side)
  - Animate item slide out + fade (250ms)
  - Remove from array and LocalStorage
  - Show toast with "Undo" action (use existing toast system or create simple one)
  - **Validation**: Remove and undo work correctly

- [ ] **Task 4.6**: Implement favorite toggle
  - Star icon: outline (default), filled (favorite)
  - Color: `--muted` (outline), `--accent` (filled)
  - Store isFavorite in WatchlistItem
  - Sort list: favorites first, then by addedAt
  - **Validation**: Toggle works, sorting applies

- [ ] **Task 4.7**: Add search/filter functionality
  - Input at top of panel with placeholder "Search symbols..."
  - Filter items case-insensitive by symbol
  - Smooth transition on show/hide (200ms)
  - Debounce input: 300ms
  - **Validation**: Search filters list correctly

- [ ] **Task 4.8**: Style WatchlistPanel
  - File: `src/features/dashboard/components/WatchlistPanel/WatchlistPanel.css`
  - Background: `--panel`, **padding: `--gap-lg` (24px)**, radius: `--radius-lg`
  - Max height: 400px, overflow-y: scroll
  - **Item spacing: `gap: var(--gap-sm)` (12px) between items**
  - **Item padding: `var(--gap-md)` (16px) internal padding**
  - Item hover: `--panel-hover`
  - Custom scrollbar styling (thin, `--border` color)
  - **Validation**: Visual matches theme specifications

## Phase 5: AI Recommendation Feature (2 hours)

- [ ] **Task 5.1**: Create RecommendButton component
  - File: `src/features/dashboard/components/RecommendButton/RecommendButton.tsx`
  - Button text: "Get AI Recommendation" with sparkle icon (✨)
  - Background: `--accent`, text: `--bg`
  - Loading state: spinner + "Generating..." text
  - **Validation**: Button renders with correct styling

- [ ] **Task 5.2**: Implement mock API call
  - File: `src/features/dashboard/utils/mockRecommendations.ts`
  - Function: `fetchRecommendation(): Promise<Recommendation>`
  - Simulate 1.5s delay with `setTimeout`
  - Return random recommendation from pool of 3-4 options
  - Handle timeout after 10 seconds
  - **Validation**: Mock API returns data after delay

- [ ] **Task 5.3**: Create RecommendModal component
  - File: `src/features/dashboard/components/RecommendModal/RecommendModal.tsx`
  - Props: `recommendation`, `isOpen`, `onClose`
  - Layout: glass overlay + centered modal (max-width: 500px)
  - **Validation**: Modal renders when isOpen=true

- [ ] **Task 5.4**: Implement modal content sections
  - Header: "AI Recommendation" + close button (×)
  - Symbol badge: large, `--accent` background
  - Action pill: "BUY"/"SELL"/"HOLD" with color-coded background
  - Confidence bar: horizontal progress bar with gradient
  - Rationale: multi-line text, `--text-secondary`
  - Footer: "Add to Watchlist" + "Dismiss" buttons
  - **Validation**: All sections render with correct data

- [ ] **Task 5.5**: Style modal with glass effect
  - File: `src/features/dashboard/components/RecommendModal/RecommendModal.css`
  - Overlay: `--glass-bg`, `--glass-blur`, full viewport
  - Modal: `--panel-elevated`, `--shadow-xl`, `--radius-lg`
  - Border: `--glass-border`
  - Entry animation: fade in + scale up (250ms)
  - **Validation**: Glass effect renders correctly

- [ ] **Task 5.6**: Implement modal interactions
  - Close on × button click
  - Close on Escape key press
  - Close on backdrop click
  - "Add to Watchlist" → call watchlist add function
  - Focus management: trap focus in modal, return on close
  - **Validation**: All close methods work, focus managed

- [ ] **Task 5.7**: Add error handling
  - Network error: show toast with error message
  - API timeout: cancel request, show toast
  - API error: show error modal with retry button
  - **Validation**: Errors display user-friendly messages

## Phase 6: Integration & Refinement (2-3 hours)

- [ ] **Task 6.1**: Integrate all components into DashboardView
  - File: `src/features/dashboard/DashboardView.tsx`
  - Add imports for all new components
  - Layout: Chart + Stats → Recommend Button → Watchlist
  - Apply spacing: `--gap-2xl` between major sections
  - **Validation**: All components render together

- [ ] **Task 6.2**: Test responsive behavior
  - Desktop (1920px): Horizontal stat grid, side-by-side layout
  - Tablet (768px): 2×2 stat grid, stacked sections
  - Mobile (375px): Vertical stack, smaller chart
  - **Validation**: Layout adapts correctly at all breakpoints

- [ ] **Task 6.3**: Optimize performance
  - Memoize StatCard with `React.memo`
  - Memoize WatchlistItem with `React.memo`
  - Use `useMemo` for chart data calculations
  - Debounce watchlist search (300ms)
  - Lazy load Recharts with `React.lazy`
  - **Validation**: No unnecessary re-renders in React DevTools

- [ ] **Task 6.4**: Add accessibility attributes
  - ARIA labels: chart, buttons, modal
  - Keyboard navigation: Tab order, Enter/Space activation
  - Screen reader text for trend indicators
  - Focus indicators visible (outline with `--accent`)
  - **Validation**: Pass keyboard navigation test, screen reader announces correctly

- [ ] **Task 6.5**: Manual visual testing
  - Verify all colors match FINTECH_NEON_THEME.md
  - Check hover states on all interactive elements
  - Test animations (smooth, no jank, 200-300ms)
  - Confirm spacing follows hierarchy rules
  - **Validation**: Visual QA checklist complete

- [ ] **Task 6.6**: Fix any theme compliance issues
  - Audit CSS for hardcoded colors (should use custom properties)
  - Ensure border radius uses tokens: `--radius-sm/md/lg/xl`
  - Verify shadows use `--shadow-sm/md/lg/xl`
  - Check spacing uses `--gap-xs/sm/md/lg/xl/2xl`
  - **Validation**: Zero hardcoded theme values

## Phase 7: Testing & Documentation (2 hours)

- [ ] **Task 7.1**: Write unit tests for utilities
  - Test: Number formatting function with various inputs
  - Test: Mock recommendation generator
  - Test: Sparkline data generator
  - **Validation**: All utility tests pass

- [ ] **Task 7.2**: Write component tests
  - Test: StatCard renders with props
  - Test: WatchlistPanel add/remove/favorite
  - Test: RecommendModal open/close interactions
  - **Validation**: Component tests pass with >80% coverage

- [ ] **Task 7.3**: Integration test full dashboard
  - Test: Load dashboard with all components
  - Test: Click recommend button → modal appears
  - Test: Add symbol to watchlist → saves to LocalStorage
  - Test: Remove symbol → updates UI and storage
  - **Validation**: End-to-end flows work correctly

- [ ] **Task 7.4**: Update component documentation
  - Add JSDoc comments to all component props
  - Document key functions with purpose and params
  - Add README.md in `features/dashboard/` with overview
  - **Validation**: Documentation clear and complete

## Dependencies

**Blockers:**
- None (all work can proceed in parallel after Phase 1)

**Prerequisites:**
- Recharts library installation (Task 1.1)
- Component directory structure (Task 1.2)
- Existing contexts: AccountContext, PositionsContext, MarketDataContext

**Parallel Work:**
- Phase 2 (Chart), Phase 3 (Stats), Phase 4 (Watchlist), Phase 5 (Recommendations) can be developed concurrently by different developers
- Phase 6 (Integration) must wait for Phases 2-5 to complete

## Validation Criteria

**Functional:**
- ✅ Portfolio chart displays with correct data and colors
- ✅ Four stat cards show balance, earnings, losses, P/L
- ✅ Watchlist allows add, remove, favorite, search
- ✅ Recommendation button triggers modal with mock data
- ✅ All interactions respond within 300ms

**Visual:**
- ✅ All components follow Fintech Neon theme (navy, neon yellow-green)
- ✅ Spacing uses tokens: xs/sm/md/lg/xl/2xl appropriately
- ✅ Hover effects: glow + scale, smooth transitions
- ✅ Responsive layouts work on 320px-1920px viewports

**Performance:**
- ✅ Dashboard loads in < 1 second
- ✅ Animations maintain ≥55 FPS
- ✅ No memory leaks (test with React DevTools Profiler)
- ✅ Bundle size increase < 100KB gzipped

**Accessibility:**
- ✅ Keyboard navigation works for all interactions
- ✅ Screen reader announces all content correctly
- ✅ Focus indicators visible on all focusable elements
- ✅ Color contrast meets WCAG AA (4.5:1 for text)

**Data Integrity:**
- ✅ Watchlist persists across page refreshes
- ✅ Invalid symbols rejected with helpful errors
- ✅ Duplicate prevention works correctly
- ✅ Chart handles zero/negative values gracefully

## Risk Mitigation

**Risk:** Recharts bundle size impact  
**Mitigation:** Use React.lazy to code-split chart library, only load when dashboard active

**Risk:** LocalStorage quota exceeded  
**Mitigation:** Catch QuotaExceededError, show toast, limit watchlist to 20 items

**Risk:** WebSocket price updates cause excessive re-renders  
**Mitigation:** Throttle updates to max 1/second, use React.memo on WatchlistItem

**Risk:** Theme colors not matching across components  
**Mitigation:** Use only CSS custom properties, validate with automated theme audit script
