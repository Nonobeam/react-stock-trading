# Proposal: Add Trading Terminology Component

**Change ID:** `add-trading-terminology-component`  
**Status:** Proposed  
**Created:** 2026-01-07  
**Author:** AI Assistant

## Why

Trading terminology and metrics (RSI, MACD, Sharpe Ratio, Win Rate, ATR, etc.) are displayed throughout the UI with no contextual help. Users unfamiliar with these technical terms must leave the application to search for definitions, reducing usability for less experienced traders.

## Problem Statement

Currently, trading terminology and metrics (RSI, MACD, Sharpe Ratio, Win Rate, ATR, etc.) are displayed throughout the UI with inconsistent presentation and no contextual help. Users unfamiliar with these technical terms have no in-app way to learn their definitions, reducing the application's usability for less experienced traders.

**Pain Points:**
- Trading metrics appear as raw abbreviations without explanations (e.g., "RSI", "MACD", "ADX")
- Users must leave the application to search for term definitions
- Inconsistent presentation across different views (Market, Performance, Risk, Scanner)
- No standardized way to display terminology with hover definitions
- Duplicate tooltip implementations scattered across components

## Proposed Solution

Create a centralized **TradingTerm** component that:

1. **Encapsulates all trading terminology** in a single, reusable component
2. **Provides hover definitions** with an 80% transparent tooltip overlay
3. **Maintains a terminology dictionary** with concise, practical definitions
4. **Ensures consistent presentation** across all UI views
5. **Leverages existing Tooltip component** for consistent UX

### Key Features

- **Reusable Component:** `<TradingTerm term="RSI">` automatically displays definition on hover
- **Centralized Dictionary:** All definitions maintained in one location for easy updates
- **Visual Consistency:** 80% transparent tooltips with consistent styling
- **Type Safety:** TypeScript enum/type for all supported terms
- **Fallback Handling:** Gracefully handles undefined terms
- **Accessibility:** Proper ARIA labels and keyboard navigation support

## Scope

### In Scope
- Create `TradingTerm` React component with hover definition support
- Create terminology dictionary with definitions for 20+ common trading terms
- Update IndicatorsPanel to use TradingTerm component
- Update PerformanceView metrics to use TradingTerm component
- Update RiskView labels to use TradingTerm component
- Enhance existing Tooltip component to support 80% transparency
- Add TypeScript types for supported terminology
- Basic documentation in component JSDoc

### Out of Scope
- Comprehensive glossary page or modal (future enhancement)
- Multi-language support for definitions
- User-customizable definitions
- External links to detailed resources
- Video tutorials or interactive examples
- Mobile-specific tooltip interactions (use native behavior)
- Definition search or filtering functionality

## Success Criteria

1. **Consistency:** All trading terms use TradingTerm component across 4+ views
2. **Usability:** Hover displays definition within 200ms with 80% transparency
3. **Coverage:** Minimum 20 trading terms have definitions
4. **Performance:** No measurable rendering performance impact
5. **Type Safety:** All terms typed with TypeScript, no runtime errors
6. **Accessibility:** Tooltips work with keyboard navigation (Tab + hover equivalent)

## Technical Approach

### Component Architecture

```tsx
// TradingTerm component wraps term with hover definition
<TradingTerm term="RSI">RSI</TradingTerm>

// Or with custom display text
<TradingTerm term="ATR" display="ATR (14)" />
```

### Terminology Dictionary Structure

```typescript
type TermKey = 'RSI' | 'MACD' | 'ATR' | 'ADX' | ... ;

const TRADING_TERMS: Record<TermKey, {
  name: string;
  definition: string;
  category: 'indicator' | 'metric' | 'method';
}>;
```

### Integration Points

1. **Market View:** Technical indicator labels (RSI, MACD, ADX, ATR, Bollinger Bands, VWAP, Stochastic, OBV)
2. **Performance View:** Metric labels (Win Rate, Sharpe Ratio, Profit Factor, Drawdown, Expectancy, Sortino, Calmar)
3. **Risk View:** Calculation labels (R-Multiple, R:R Ratio, ATR Stop, Position Sizing)
4. **Scanner View:** Setup type labels (Pullback, Breakout, Mean Reversion)

### Transparency Implementation

Enhance existing Tooltip component CSS:
```css
.tooltip--transparent {
  background: rgba(31, 41, 55, 0.8); /* 80% opacity */
  backdrop-filter: blur(8px);
}
```

## Dependencies

- **Existing Tooltip Component:** Extends functionality with transparency option
- **TypeScript Types:** Requires type definitions for term keys
- **No External Libraries:** Uses existing React/CSS infrastructure

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Tooltip overflow on small screens | Medium | Implement responsive positioning |
| Performance with many terms | Low | Lazy render tooltips on hover only |
| Definition maintenance burden | Medium | Clear process for adding/updating terms |
| Inconsistent term usage | Low | ESLint rule suggestion for future |

## Alternative Approaches Considered

1. **Inline popover modals:** Too intrusive, breaks flow
2. **Sidebar glossary:** Requires navigation away from content
3. **Native title attributes:** Limited styling, no transparency control
4. **Separate glossary page:** Breaks in-context learning
5. **Third-party tooltip library:** Unnecessary dependency

**Decision:** Custom TradingTerm component best balances simplicity, control, and user experience.

## Implementation Phases

### Phase 1: Foundation (This Change)
- Create TradingTerm component
- Build terminology dictionary (20+ terms)
- Enhance Tooltip with transparency
- Update Market, Performance, Risk, Scanner views

### Phase 2: Future Enhancements (Not in Scope)
- Comprehensive glossary modal/page
- Definition search functionality
- External learning resources links
- Multi-language support
- User bookmarking of terms

## Open Questions

1. Should definitions be collapsible/expandable for complex terms? **→ No, keep definitions concise (1-2 sentences)**
2. Should we track which terms users hover over most? **→ Not in initial version**
3. Should tooltips auto-appear on first view for onboarding? **→ No, on-demand only**
4. Should we support markdown in definitions (bold, links)? **→ Plain text only for v1**

## Approval

- [ ] Product Owner / Stakeholder Review
- [ ] Technical Lead Review
- [ ] UX/Design Review (if applicable)
- [ ] Security Review (N/A for this change)

---

**Next Steps After Approval:**
1. Implement `TradingTerm` component
2. Create terminology dictionary
3. Update Tooltip component transparency
4. Refactor 4 views to use TradingTerm
5. Add unit tests
6. Update documentation
