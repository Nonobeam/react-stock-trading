# Design: Trading Terminology Component

**Change ID:** `add-trading-terminology-component`  
**Last Updated:** 2026-01-07

## Overview

This document outlines the technical design for implementing a reusable TradingTerm component that provides in-context hover definitions for trading terminology throughout the GST application.

## Architecture

### Component Hierarchy

```
TradingTerm (new)
  └── Tooltip (existing, enhanced)
      └── Tooltip content with 80% transparency
```

### Data Layer

```
tradingTerms.ts (new)
  └── TRADING_TERMS dictionary
      └── Category-organized term definitions
```

## Component Design

### TradingTerm Component

**Location:** `src/shared/components/TradingTerm.tsx`

**Purpose:** Wraps trading terminology with hover-activated definition tooltips

**Props Interface:**

```typescript
interface TradingTermProps {
  term: TermKey;                    // Required: term identifier
  display?: string;                 // Optional: custom display text
  position?: 'top' | 'bottom' | 'left' | 'right';  // Tooltip position
  children?: React.ReactNode;       // Alternative to display
  className?: string;               // Additional styling
  showCategory?: boolean;           // Show term category badge
}
```

**Behavior:**
- Renders term text inline with subtle underline dotting (CSS: `border-bottom: 1px dotted`)
- On hover, displays Tooltip with term definition
- Falls back gracefully if term not found in dictionary
- Supports keyboard focus for accessibility

**Example Usage:**

```tsx
// Simple usage
<TradingTerm term="RSI" />
// Output: RSI (with hover definition)

// Custom display
<TradingTerm term="ATR" display="ATR (14)" />
// Output: ATR (14) (with hover definition)

// With children
<TradingTerm term="SHARPE_RATIO">
  <strong>Sharpe Ratio</strong>
</TradingTerm>
```

### Terminology Dictionary

**Location:** `src/shared/constants/tradingTerms.ts`

**Structure:**

```typescript
export type TermCategory = 'INDICATOR' | 'METRIC' | 'METHOD' | 'PATTERN' | 'CONCEPT';

export type TermKey = 
  // Technical Indicators
  | 'RSI' | 'MACD' | 'ADX' | 'ATR' | 'STOCHASTIC' 
  | 'BOLLINGER_BANDS' | 'VWAP' | 'OBV' | 'SMA' | 'EMA'
  // Performance Metrics
  | 'WIN_RATE' | 'SHARPE_RATIO' | 'PROFIT_FACTOR' | 'DRAWDOWN'
  | 'EXPECTANCY' | 'SORTINO_RATIO' | 'CALMAR_RATIO'
  // Risk Concepts
  | 'R_MULTIPLE' | 'RISK_REWARD_RATIO' | 'POSITION_SIZING'
  // Setup Types
  | 'PULLBACK' | 'BREAKOUT' | 'MEAN_REVERSION' | 'CROSSOVER'
  // Other
  | 'P_E_RATIO' | 'MAE' | 'MFE';

interface TermDefinition {
  name: string;           // Full display name
  definition: string;     // 1-2 sentence definition
  category: TermCategory; // Term category
  aka?: string;           // Alternative name/abbreviation
}

export const TRADING_TERMS: Record<TermKey, TermDefinition> = {
  RSI: {
    name: 'RSI',
    definition: 'Relative Strength Index. Momentum indicator measuring speed and magnitude of price changes. Values above 70 indicate overbought, below 30 oversold.',
    category: 'INDICATOR',
  },
  // ... 20+ more terms
};
```

**Initial Terms Coverage (20+ terms):**

**Indicators (10):**
- RSI, MACD, ADX, ATR, Stochastic, Bollinger Bands, VWAP, OBV, SMA, EMA

**Metrics (7):**
- Win Rate, Sharpe Ratio, Profit Factor, Drawdown, Expectancy, Sortino Ratio, Calmar Ratio

**Risk Concepts (3):**
- R-Multiple, Risk:Reward Ratio, Position Sizing

**Setup Types (4):**
- Pullback, Breakout, Mean Reversion, Crossover

**Future Terms (not in initial scope):**
- P/E Ratio, MAE, MFE

## Tooltip Enhancement

### Enhanced Tooltip Component

**Location:** `src/shared/components/Tooltip.tsx` (existing, modified)

**New Props:**

```typescript
interface TooltipProps {
  children: React.ReactNode;
  content: string | React.ReactNode;  // Enhanced: support ReactNode
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
  transparent?: boolean;              // NEW: 80% transparency mode
  maxWidth?: number;                  // NEW: max width control
}
```

**CSS Changes:**

```css
/* New transparent variant */
.tooltip--transparent {
  background: rgba(31, 41, 55, 0.8);
  backdrop-filter: blur(8px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

/* Max width control */
.tooltip--wide {
  max-width: 300px;
  white-space: normal;
}
```

## Integration Points

### 1. Market Data View - Indicators Panel

**File:** `src/features/market/components/IndicatorsPanel.tsx`

**Changes:**
- Wrap all indicator labels with `<TradingTerm>`
- Example: `<TradingTerm term="RSI">RSI (14)</TradingTerm>`

**Affected Labels:** RSI, MACD, Stochastic, ADX, ATR, VWAP, Bollinger Bands, OBV

### 2. Performance Analytics View

**File:** `src/features/analytics/PerformanceView.tsx`

**Changes:**
- Replace metric labels with TradingTerm components
- Example: `<TradingTerm term="SHARPE_RATIO">Sharpe Ratio</TradingTerm>`

**Affected Metrics:** Sharpe Ratio, Win Rate, Profit Factor, Expectancy, Drawdown

**File:** `src/features/analytics/components/PerformanceOverviewCards.tsx`

**Changes:**
- Replace existing title tooltips with TradingTerm wrapper
- Remove redundant tooltip prop logic

### 3. Risk Management View

**File:** `src/features/risk/components/PositionSizeCalculator.tsx`

**Changes:**
- Wrap labels like "Position Size", "R-Multiple", "Risk:Reward"
- Example: `<TradingTerm term="POSITION_SIZING">Position Size</TradingTerm>`

**Files:**
- `RiskView.tsx`
- `PositionSizeCalculator.tsx`
- `StopLossPlanner.tsx`
- `TargetPlanner.tsx`

### 4. Trade Scanner View

**File:** `src/features/scanner/components/TradeScannerTable.tsx`

**Changes:**
- Wrap setup type labels (Pullback, Breakout, etc.)
- Example: `<TradingTerm term="BREAKOUT">Breakout</TradingTerm>`

## Styling Guidelines

### Visual Indicators

**Hoverable Terms:**
- Subtle dotted underline: `border-bottom: 1px dotted currentColor`
- Cursor: `cursor: help`
- Opacity: 0.8 by default, 1.0 on hover
- Color: Inherit from parent (no special color)

**Tooltip Appearance:**
- Background: `rgba(31, 41, 55, 0.8)` (80% opacity dark gray)
- Backdrop blur: `blur(8px)` for glassmorphism effect
- Border radius: `6px`
- Padding: `0.75rem 1rem`
- Font size: `0.875rem`
- Max width: `300px`
- Line height: `1.5`
- Box shadow: `0 4px 12px rgba(0, 0, 0, 0.3)`

**Animation:**
- Fade in: 200ms ease
- No delay on show
- 100ms delay on hide (prevents flicker)

## Type System

### Type Exports

```typescript
// src/shared/components/TradingTerm.tsx
export type { TermKey, TermCategory, TermDefinition };
export { TRADING_TERMS };
export { TradingTerm };

// Usage in other files
import { TradingTerm, type TermKey } from '@/shared/components';
```

### Type Safety

- All term references must use `TermKey` type
- TypeScript will error if undefined term is used
- Dictionary lookup returns `TermDefinition | undefined`
- Component handles undefined gracefully with fallback

## Performance Considerations

### Optimization Strategies

1. **Lazy Tooltip Rendering:** Tooltip content only renders on hover (existing behavior)
2. **No Re-renders:** Dictionary is constant, no useState/useEffect needed
3. **Memoization:** Not needed - component is simple and fast
4. **Bundle Size:** ~5KB for component + dictionary (acceptable)

### Measurement

- Target: <16ms render time per TradingTerm instance
- Test with 50+ simultaneous instances (worst case)
- No jank on hover activation

## Accessibility

### ARIA Attributes

```tsx
<span
  role="term"
  aria-label={definition.name}
  aria-describedby={`tooltip-${term}`}
  tabIndex={0}
>
  {displayText}
</span>
```

### Keyboard Navigation

- Tab to focus TradingTerm
- Hover tooltip shows on focus (CSS `:focus` state)
- Escape key closes tooltip (if we add dismissible behavior)
- No keyboard trap

### Screen Readers

- Term text is read aloud
- Definition available via aria-describedby
- Optional: Toggle for "always show definitions" mode

## Testing Strategy

### Unit Tests

**File:** `src/shared/components/TradingTerm.test.tsx`

**Test Cases:**
1. Renders term text correctly
2. Shows tooltip on hover
3. Handles undefined term gracefully
4. Respects custom display prop
5. Applies custom className
6. Supports children prop
7. Falls back to term key if definition missing

### Integration Tests

**File:** `src/features/market/components/IndicatorsPanel.test.tsx`

**Test Cases:**
1. All indicators wrapped in TradingTerm
2. Tooltips appear on hover
3. No visual regressions

### Visual Regression Tests (Manual)

- Tooltip appears correctly in all 4 positions
- Transparency at 80%
- No overflow on small screens
- Readable on light/dark backgrounds

## Migration Guide

### Step-by-Step Refactoring

1. **Create TradingTerm component**
2. **Create terminology dictionary**
3. **Enhance Tooltip component**
4. **Update IndicatorsPanel** (10 terms)
5. **Update PerformanceView** (5 terms)
6. **Update RiskView** (3 terms)
7. **Update ScannerView** (4 terms)

### Before & After Examples

**Before:**
```tsx
<h4>RSI (14)</h4>
```

**After:**
```tsx
<h4>
  <TradingTerm term="RSI">RSI (14)</TradingTerm>
</h4>
```

**Before:**
```tsx
<div className="metric-label">Sharpe Ratio</div>
```

**After:**
```tsx
<div className="metric-label">
  <TradingTerm term="SHARPE_RATIO">Sharpe Ratio</TradingTerm>
</div>
```

## Dependencies

### New Files
- `src/shared/components/TradingTerm.tsx` (new)
- `src/shared/components/TradingTerm.css` (new)
- `src/shared/constants/tradingTerms.ts` (new)

### Modified Files
- `src/shared/components/Tooltip.tsx` (enhanced)
- `src/shared/components/Tooltip.css` (enhanced)
- `src/shared/components/index.ts` (export TradingTerm)
- 4+ feature view files (integration)

### No External Dependencies
- Uses existing React, TypeScript, CSS
- No new npm packages required

## Rollout Plan

### Phase 1: Foundation
- Create TradingTerm component
- Build dictionary with 20+ terms
- Enhance Tooltip

### Phase 2: Integration
- Update Market view (highest priority)
- Update Performance view
- Update Risk view
- Update Scanner view

### Phase 3: Polish
- Add remaining terms (30+ total)
- Accessibility audit
- Performance testing
- Documentation

## Future Enhancements (Out of Scope)

1. **Rich Tooltips:** Images, formulas, examples
2. **Deep Links:** Click to glossary page with full details
3. **Context-Aware Definitions:** Different definitions based on where term appears
4. **User Customization:** Hide/show definitions, edit definitions
5. **Analytics:** Track which terms users hover over most
6. **Onboarding:** First-time user tour of key terms
7. **External Resources:** Links to Investopedia, TradingView, etc.

## Questions & Decisions

| Question | Decision | Rationale |
|----------|----------|-----------|
| Should tooltips be dismissible? | No, hover-only | Keeps interaction simple |
| Support markdown in definitions? | No, plain text only | Simplicity for v1 |
| Category badges visible? | No, tooltip only | Reduces visual clutter |
| Support custom tooltip colors? | No, use theme colors | Maintain consistency |
| Add icon next to hoverable terms? | No | Dotted underline is sufficient |

---

**Review Checklist:**
- [x] Component API defined
- [x] Data structure designed
- [x] Integration points identified
- [x] Styling guidelines documented
- [x] Accessibility considered
- [x] Performance strategy outlined
- [x] Testing approach defined
- [x] Migration path clear
