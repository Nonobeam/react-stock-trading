# Implementation Tasks

**Change ID:** `add-trading-terminology-component`  
**Status:** Not Started  
**Progress:** 0/25 tasks completed

---

## Phase 1: Foundation (Tasks 1-7)

### Task 1: Create terminology dictionary file
- [ ] Create `src/shared/constants/tradingTerms.ts`
- [ ] Define `TermKey` type with 20+ literal union types
- [ ] Define `TermCategory` type (INDICATOR, METRIC, METHOD, PATTERN, CONCEPT)
- [ ] Define `TermDefinition` interface (name, definition, category, aka?)
- [ ] Export `TRADING_TERMS` constant as `Record<TermKey, TermDefinition>`
- [ ] Add JSDoc comments for each term type

**Validation:**
- TypeScript compiles without errors
- All 20+ terms have definitions under 200 characters
- Run: `npm run typecheck`

---

### Task 2: Add technical indicator definitions
- [ ] Add RSI definition
- [ ] Add MACD definition
- [ ] Add ADX definition
- [ ] Add ATR definition
- [ ] Add Stochastic definition
- [ ] Add Bollinger Bands definition
- [ ] Add VWAP definition
- [ ] Add OBV definition
- [ ] Add SMA definition
- [ ] Add EMA definition

**Validation:**
- All definitions are 1-3 sentences
- Definitions use plain language for non-experts
- Category set to 'INDICATOR' for all

---

### Task 3: Add performance metric definitions
- [ ] Add Win Rate definition
- [ ] Add Sharpe Ratio definition
- [ ] Add Profit Factor definition
- [ ] Add Drawdown definition
- [ ] Add Expectancy definition
- [ ] Add Sortino Ratio definition
- [ ] Add Calmar Ratio definition

**Validation:**
- All definitions include practical interpretation
- Category set to 'METRIC' for all

---

### Task 4: Add risk and setup type definitions
- [ ] Add R-Multiple definition
- [ ] Add Risk:Reward Ratio definition
- [ ] Add Position Sizing definition
- [ ] Add Pullback definition
- [ ] Add Breakout definition
- [ ] Add Mean Reversion definition
- [ ] Add Crossover definition

**Validation:**
- Total term count ≥ 24
- All categories represented
- No duplicate definitions

---

### Task 5: Enhance Tooltip component for transparency
- [ ] Open `src/shared/components/Tooltip.tsx`
- [ ] Add `transparent?: boolean` prop to TooltipProps interface
- [ ] Add `maxWidth?: number` prop to TooltipProps interface
- [ ] Update content prop to accept `string | React.ReactNode`
- [ ] Conditionally apply `tooltip--transparent` className when prop is true
- [ ] Pass maxWidth as inline style if provided
- [ ] Update JSDoc comments

**Validation:**
- TypeScript compiles without errors
- Existing usages of Tooltip still work
- Run: `npm run typecheck`

---

### Task 6: Add transparent tooltip styles
- [ ] Open `src/shared/components/Tooltip.css`
- [ ] Add `.tooltip--transparent` class with `background: rgba(31, 41, 55, 0.8)`
- [ ] Add `backdrop-filter: blur(8px)` to transparent variant
- [ ] Add `box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3)` for depth
- [ ] Add `.tooltip--wide` class with `max-width: 300px` and `white-space: normal`
- [ ] Ensure transparency works on light and dark backgrounds

**Validation:**
- Tooltip appears transparent in browser
- Text remains readable with sufficient contrast
- Visual inspection in both light/dark themes

---

### Task 7: Create TradingTerm component
- [ ] Create `src/shared/components/TradingTerm.tsx`
- [ ] Define `TradingTermProps` interface (term, display?, position?, children?, className?, showCategory?)
- [ ] Import `TRADING_TERMS` and `TermKey` from constants
- [ ] Import `Tooltip` component
- [ ] Implement hover-activated tooltip using Tooltip component
- [ ] Add dotted underline styling with `border-bottom: 1px dotted`
- [ ] Add `cursor: help` style
- [ ] Handle undefined terms gracefully (fallback message or no tooltip)
- [ ] Support custom display text via `display` or `children` props
- [ ] Add accessibility attributes (role="term", aria-label, aria-describedby, tabIndex={0})
- [ ] Add JSDoc documentation with usage examples

**Validation:**
- Component renders without errors
- Tooltip appears on hover
- TypeScript enforces valid TermKey
- Run: `npm run typecheck`

---

## Phase 2: Styling & Component Setup (Tasks 8-10)

### Task 8: Create TradingTerm styles
- [ ] Create `src/shared/components/TradingTerm.css`
- [ ] Add `.trading-term` base class
- [ ] Style with `border-bottom: 1px dotted currentColor`
- [ ] Add `cursor: help`
- [ ] Add `opacity: 0.8` default, `opacity: 1.0` on hover/focus
- [ ] Add smooth transition for opacity change (150ms)
- [ ] Add focus outline for keyboard navigation
- [ ] Import in TradingTerm.tsx

**Validation:**
- Visual inspection shows dotted underline
- Cursor changes on hover
- Smooth opacity transition

---

### Task 9: Export TradingTerm from shared components
- [ ] Open `src/shared/components/index.ts`
- [ ] Add `export { TradingTerm } from './TradingTerm';`
- [ ] Add `export type { TermKey, TermCategory } from '../constants/tradingTerms';`
- [ ] Verify imports work from `@/shared/components`

**Validation:**
- Run: `npm run typecheck`
- Import statement works: `import { TradingTerm } from '@/shared/components'`

---

### Task 10: Create TradingTerm unit tests
- [ ] Create `src/shared/components/TradingTerm.test.tsx`
- [ ] Test: Renders term text correctly
- [ ] Test: Shows tooltip on hover
- [ ] Test: Handles undefined term gracefully
- [ ] Test: Respects custom display prop
- [ ] Test: Applies custom className
- [ ] Test: Supports children prop
- [ ] Test: Adds accessibility attributes
- [ ] Test: Keyboard focus shows tooltip

**Validation:**
- Run: `npm test TradingTerm`
- All tests pass
- Coverage ≥ 80%

---

## Phase 3: Market View Integration (Tasks 11-12)

### Task 11: Update IndicatorsPanel with TradingTerm
- [ ] Open `src/features/market/components/IndicatorsPanel.tsx`
- [ ] Import `TradingTerm` from `@/shared/components`
- [ ] Wrap RSI label: `<TradingTerm term="RSI">RSI (14)</TradingTerm>`
- [ ] Wrap MACD label: `<TradingTerm term="MACD">MACD</TradingTerm>`
- [ ] Wrap Stochastic label: `<TradingTerm term="STOCHASTIC">Stochastic</TradingTerm>`
- [ ] Wrap ADX label: `<TradingTerm term="ADX">ADX (14)</TradingTerm>`
- [ ] Wrap ATR label: `<TradingTerm term="ATR">ATR (14)</TradingTerm>`
- [ ] Wrap VWAP label: `<TradingTerm term="VWAP">VWAP</TradingTerm>`
- [ ] Wrap Bollinger Bands label: `<TradingTerm term="BOLLINGER_BANDS">Bollinger Bands</TradingTerm>`
- [ ] Wrap OBV label: `<TradingTerm term="OBV">OBV</TradingTerm>`

**Validation:**
- Visual inspection: All indicators have dotted underlines
- Hover shows correct definitions
- Layout unchanged
- Run: `npm run dev` and test manually

---

### Task 12: Verify Market View functionality
- [ ] Navigate to Market Data View in browser
- [ ] Hover over each indicator label (RSI, MACD, etc.)
- [ ] Verify tooltip appears with 80% transparency
- [ ] Verify tooltip content matches dictionary definition
- [ ] Verify no layout shifts when tooltip appears
- [ ] Test keyboard navigation (Tab to focus, see tooltip)
- [ ] Test on different screen sizes (mobile, tablet, desktop)

**Validation:**
- All 8+ indicators show definitions
- No visual regressions
- Tooltips readable on all backgrounds

---

## Phase 4: Performance View Integration (Tasks 13-15)

### Task 13: Update PerformanceView with TradingTerm
- [ ] Open `src/features/analytics/PerformanceView.tsx`
- [ ] Import `TradingTerm` from `@/shared/components`
- [ ] Wrap "Sharpe Ratio" label: `<TradingTerm term="SHARPE_RATIO">Sharpe Ratio</TradingTerm>`
- [ ] Wrap other metric labels as needed
- [ ] Ensure existing layout preserved

**Validation:**
- Metrics display with TradingTerm
- Hover shows definitions
- Run: `npm run dev` and inspect

---

### Task 14: Update PerformanceOverviewCards with TradingTerm
- [ ] Open `src/features/analytics/components/PerformanceOverviewCards.tsx`
- [ ] Import `TradingTerm` from `@/shared/components`
- [ ] Replace "Win Rate" with `<TradingTerm term="WIN_RATE">Win Rate</TradingTerm>`
- [ ] Replace "Expectancy" with `<TradingTerm term="EXPECTANCY">Expectancy</TradingTerm>`
- [ ] Replace "Profit Factor" with `<TradingTerm term="PROFIT_FACTOR">Profit Factor</TradingTerm>`
- [ ] Replace "Drawdown" with `<TradingTerm term="DRAWDOWN">Max Drawdown</TradingTerm>`
- [ ] Remove old `tooltip` prop logic (redundant with TradingTerm)
- [ ] Remove `title` attribute from metric cards

**Validation:**
- All metric cards show definitions on hover
- Old tooltip implementation removed
- TypeScript compiles without errors

---

### Task 15: Verify Performance View functionality
- [ ] Navigate to Performance Analytics View in browser
- [ ] Hover over each metric label
- [ ] Verify tooltip appears with 80% transparency
- [ ] Verify tooltip content matches dictionary
- [ ] Verify no overlap with metric values
- [ ] Test keyboard navigation

**Validation:**
- All 5+ metrics show definitions
- Old tooltips completely removed
- No visual regressions

---

## Phase 5: Risk View Integration (Tasks 16-18)

### Task 16: Update PositionSizeCalculator with TradingTerm
- [ ] Open `src/features/risk/components/PositionSizeCalculator.tsx`
- [ ] Import `TradingTerm` from `@/shared/components`
- [ ] Wrap "Position Size" label: `<TradingTerm term="POSITION_SIZING">Position Size</TradingTerm>`
- [ ] Wrap "R-Multiple" label if present
- [ ] Wrap other risk-related labels

**Validation:**
- Risk labels show definitions
- Form layout unchanged
- Run: `npm run dev` and test

---

### Task 17: Update StopLossPlanner with TradingTerm
- [ ] Open `src/features/risk/components/StopLossPlanner.tsx`
- [ ] Import `TradingTerm` from `@/shared/components`
- [ ] Wrap "ATR Stop" label: `<TradingTerm term="ATR">ATR Stop</TradingTerm>`
- [ ] Verify tooltips position correctly near form fields

**Validation:**
- Stop loss methods show definitions
- Layout preserved

---

### Task 18: Verify Risk View functionality
- [ ] Navigate to Risk Management View in browser
- [ ] Hover over each risk term label
- [ ] Verify tooltip appears correctly
- [ ] Verify tooltips don't break calculator layout
- [ ] Test keyboard navigation

**Validation:**
- All 3+ risk terms show definitions
- No layout issues

---

## Phase 6: Scanner View Integration (Tasks 19-20)

### Task 19: Update TradeScannerTable with TradingTerm
- [ ] Open `src/features/scanner/components/TradeScannerTable.tsx`
- [ ] Import `TradingTerm` from `@/shared/components`
- [ ] Wrap setup type labels in filter/display:
  - `<TradingTerm term="PULLBACK">Pullback</TradingTerm>`
  - `<TradingTerm term="BREAKOUT">Breakout</TradingTerm>`
  - `<TradingTerm term="MEAN_REVERSION">Mean Reversion</TradingTerm>`
  - `<TradingTerm term="CROSSOVER">Crossover</TradingTerm>`
- [ ] Ensure table layout not affected

**Validation:**
- Setup type labels show definitions
- Table structure unchanged
- Run: `npm run dev` and test

---

### Task 20: Verify Scanner View functionality
- [ ] Navigate to Trade Scanner View in browser
- [ ] Hover over setup type labels in filters
- [ ] Hover over setup types in table rows
- [ ] Verify tooltips don't cause table cells to expand
- [ ] Test keyboard navigation

**Validation:**
- All 4 setup types show definitions
- Table remains responsive

---

## Phase 7: Testing & Validation (Tasks 21-25)

### Task 21: Performance testing
- [ ] Open Performance View (20+ TradingTerms)
- [ ] Open React DevTools Profiler
- [ ] Record render performance
- [ ] Verify page renders in <100ms
- [ ] Verify commit time <16ms
- [ ] Hover over multiple terms rapidly
- [ ] Verify no frame drops or jank
- [ ] Check bundle size increase (<10KB gzipped)

**Validation:**
- Performance metrics within targets
- No measurable degradation
- Run: `npm run build` and check bundle size

---

### Task 22: Accessibility audit
- [ ] Test keyboard navigation (Tab through all TradingTerms)
- [ ] Verify focus indicators visible
- [ ] Verify tooltips appear on focus (not just hover)
- [ ] Test with screen reader (NVDA or VoiceOver)
- [ ] Verify aria-label and role="term" announced
- [ ] Verify aria-describedby links to definitions
- [ ] Check color contrast ratios meet WCAG AA

**Validation:**
- All accessibility requirements met
- No keyboard traps
- Screen reader announces terms correctly

---

### Task 23: Cross-browser testing
- [ ] Test in Chrome (latest)
- [ ] Test in Firefox (latest)
- [ ] Test in Safari (latest)
- [ ] Test in Edge (latest)
- [ ] Verify tooltip transparency works in all browsers
- [ ] Verify backdrop-filter blur works (or graceful fallback)

**Validation:**
- Consistent behavior across browsers
- No visual glitches

---

### Task 24: Responsive design testing
- [ ] Test on mobile (320px width)
- [ ] Test on tablet (768px width)
- [ ] Test on desktop (1920px width)
- [ ] Verify tooltips position correctly on small screens
- [ ] Verify tooltips don't overflow viewport
- [ ] Verify touch interactions work on mobile (tap to show tooltip)

**Validation:**
- Tooltips responsive on all screen sizes
- No overflow or layout breaks

---

### Task 25: Documentation and cleanup
- [ ] Add usage examples to TradingTerm JSDoc comments
- [ ] Update README.md with TradingTerm component documentation
- [ ] Add inline code comments for complex logic
- [ ] Remove any commented-out code
- [ ] Run linter and fix any warnings: `npm run lint`
- [ ] Run TypeScript checks: `npm run typecheck`
- [ ] Final visual inspection of all 4 views

**Validation:**
- All code documented
- No linter warnings
- TypeScript compiles cleanly
- All views functioning correctly

---

## Completion Checklist

After all tasks complete, verify:

- [x] All 25 tasks marked complete
- [ ] All 4 views (Market, Performance, Risk, Scanner) integrated
- [ ] All 20+ trading terms have definitions
- [ ] Tooltip transparency set to 80%
- [ ] TypeScript compiles without errors
- [ ] No linter warnings
- [ ] Performance targets met (<100ms render, <10KB bundle)
- [ ] Accessibility requirements met (keyboard nav, ARIA)
- [ ] Cross-browser testing passed
- [ ] Responsive design testing passed
- [ ] Documentation complete

---

## Dependencies Between Tasks

**Sequential Dependencies:**
- Task 1 → Task 2, 3, 4 (dictionary must exist before adding definitions)
- Task 5 → Task 6 (Tooltip props before styles)
- Task 1-7 → Task 8-10 (foundation before component setup)
- Task 8-10 → Task 11-20 (component ready before integration)
- Task 11-20 → Task 21-25 (integration before testing)

**Parallelizable Work:**
- Tasks 2, 3, 4 can be done in parallel (different definition categories)
- Tasks 5, 6 can be done in parallel (TypeScript and CSS)
- Tasks 11-20 can be done in parallel (different view integrations)
- Tasks 21-24 can be done in parallel (different testing types)

---

## Rollback Plan

If issues arise during implementation:

1. **Phase 1-2 Issues:** Revert TradingTerm component, keep Tooltip enhancements
2. **Phase 3-6 Issues:** Revert individual view integrations, keep component
3. **Performance Issues:** Add React.memo() to TradingTerm, lazy load definitions
4. **Accessibility Issues:** Add focus-visible polyfill, enhance ARIA attributes

---

## Future Enhancements (Not in Current Tasks)

- Add "Copy definition" button to tooltip
- Add "Learn more" link to external resources
- Implement glossary modal with all terms
- Add search/filter functionality for terms
- Track which terms users hover over most (analytics)
- Support custom user-defined terms
- Add video tutorials linked from terms
- Implement context-aware definitions (different definitions based on usage)
