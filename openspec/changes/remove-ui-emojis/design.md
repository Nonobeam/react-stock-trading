# Design: Remove UI Emojis

## Overview

This change removes all emoji characters from feature components and replaces them with professional, semantic UI elements using CSS-based indicators, text labels, and the existing Badge component.

## Design Principles

1. **Semantic Over Pictographic** - Use meaningful text and HTML structure instead of visual symbols
2. **CSS-Driven Styling** - Leverage existing theme colors and CSS for visual distinction
3. **Component Reuse** - Use existing Badge component rather than creating new components
4. **Accessibility First** - Ensure screen readers can announce status clearly
5. **Consistency** - Apply uniform patterns across all features

## Architecture

### Status Representation Strategy

```
Emoji → Replacement Strategy
─────────────────────────────────────────
✅    → <Badge variant="success">Passed</Badge>
❌    → <Badge variant="danger">Failed</Badge>
⚠️    → <Badge variant="warning">Warning</Badge>
🎯    → <Badge variant="info">Target</Badge>
📊    → Text label + CSS class
📈    → Text "Bullish" + green indicator
📉    → Text "Bearish" + red indicator  
🔄    → Text "Transition" + yellow indicator
💰    → Text label "Capital"
🔔    → Text "No alerts"
```

### Component Patterns

#### Pattern 1: Status Badges (Check Marks, Warnings)
**Before:**
```tsx
<span className="check-icon">{check.passed ? '✅' : '❌'}</span>
```

**After:**
```tsx
<Badge variant={check.passed ? 'success' : 'danger'}>
  {check.passed ? 'Passed' : 'Failed'}
</Badge>
```

#### Pattern 2: Inline Warnings
**Before:**
```tsx
<strong>⚠️ Cannot proceed with trade</strong>
```

**After:**
```tsx
<Badge variant="danger">Cannot proceed with trade</Badge>
```

#### Pattern 3: Section Headers
**Before:**
```tsx
<h4>⚠️ Warnings</h4>
```

**After:**
```tsx
<h4 className="section-header section-header--warning">Warnings</h4>
```

#### Pattern 4: Card Icons
**Before:**
```tsx
<div className="card-icon">📊</div>
<div className="card-title">Positions</div>
```

**After:**
```tsx
<div className="card-header">
  <div className="card-indicator card-indicator--positions"></div>
  <div className="card-title">Positions</div>
</div>
```

#### Pattern 5: Regime Indicators
**Before:**
```tsx
icon: '📈'
```

**After:**
```tsx
<div className="regime-indicator regime-indicator--bullish">
  <span className="regime-dot"></span>
  <span className="regime-label">Bullish</span>
</div>
```

### CSS Structure

```css
/* Status Indicators - Small colored dots */
.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 0.5rem;
}

.status-indicator--success {
  background: var(--color-success);
  box-shadow: 0 0 6px var(--color-success);
}

.status-indicator--warning {
  background: var(--color-warning);
  box-shadow: 0 0 6px var(--color-warning);
}

.status-indicator--danger {
  background: var(--color-danger);
  box-shadow: 0 0 6px var(--color-danger);
}

/* Regime Indicators */
.regime-indicator {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.regime-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.regime-indicator--bullish .regime-dot {
  background: var(--color-success);
}

.regime-indicator--bearish .regime-dot {
  background: var(--color-danger);
}

.regime-indicator--transition .regime-dot {
  background: var(--color-warning);
}

/* Section Headers with Visual Emphasis */
.section-header--warning {
  color: var(--color-warning);
  border-left: 4px solid var(--color-warning);
  padding-left: 0.75rem;
}

/* Card Indicators */
.card-indicator {
  width: 4px;
  height: 100%;
  border-radius: 2px;
  margin-right: 0.75rem;
}

.card-indicator--positions {
  background: var(--color-primary);
}

.card-indicator--capital {
  background: var(--color-info);
}

.card-indicator--target {
  background: var(--color-success);
}

.card-indicator--risk {
  background: var(--color-warning);
}
```

## Component-Specific Decisions

### Risk Calculator

**ViabilityChecklist**
- Use Badge component for overall pass/fail status
- Use inline status indicators (colored dots) for individual checks
- Warning messages use warning Badge variant
- Rationale: Clear pass/fail states critical for trading decisions

**TargetPlanner & StopLossPlanner**
- Remove emojis from method labels (just use text)
- Replace warning emojis with "Warning:" prefix + styled span
- Rationale: Method names are self-explanatory without icons

**RiskSummaryPanel**
- Section header uses CSS styling for emphasis
- Individual warnings remain text-based
- Rationale: Panel header needs visual weight without emoji

### Regime Analysis

**RegimeView, RegimeIndicator, RegimeAlerts, RegimeHistory**
- Regime states (bullish/bearish/transition) use colored dot + text label
- Empty states use simple text ("No alerts")
- Rationale: Color + text provides clearer meaning than pictographs

**Design Decision: Icon Removal Pattern**
1. Remove `icon` property from regime config objects
2. Add `cssClass` property for styling
3. Update rendering to use dot + label pattern
4. Maintain color associations (green=bull, red=bear, yellow=transition)

### Position Monitoring

**MonitoringView**
- Error states use CSS danger indicators
- Alert headings use styled text without emojis
- Target alerts use Badge with "info" or "success" variant
- Rationale: Clear, accessible status communication

**StopManagementPanel**
- "Risk-Free" state uses success Badge
- Rationale: Important positive status deserves emphasis

**PositionsTable**
- Status badges replace emoji-prefixed text
- Empty state uses EmptyState component (no emoji)
- Rationale: Table cells need compact, scannable status

**PortfolioSummaryCards**
- Card type indicated by left border color (existing pattern)
- Labels are text-only
- P&L direction shown by text color (green/red)
- Rationale: Cards already have visual hierarchy, don't need icons

**ClosePositionModal**
- Warning section uses prominent Badge or alert-style container
- Rationale: Critical warning for potentially costly action

## Accessibility Considerations

### Screen Reader Support
- Badge text is announced naturally
- Status indicators have `aria-label` where needed
- Color is supplemented with text, not sole indicator

### Visual Contrast
- All indicators use theme colors with sufficient contrast
- Text labels ensure meaning isn't lost in grayscale
- Focus indicators remain visible

### Keyboard Navigation
- No impact on navigation (removing display-only emojis)
- Interactive elements retain keyboard accessibility

## Theme Integration

All color choices use existing CSS variables:
- `--color-success` - Green for positive/passed states
- `--color-danger` - Red for negative/failed states
- `--color-warning` - Yellow/orange for caution states
- `--color-info` - Blue for informational states
- `--color-primary` - Brand blue for neutral indicators

No new colors needed; design leverages existing palette.

## Component Dependencies

### Existing Components Used
- `Badge` from `src/shared/components/Badge.tsx`
  - Already supports: success, warning, danger, info, neutral variants
  - Already styled for dark theme
  - No modifications needed

### No New Components Required
- All replacements use existing Badge or plain HTML + CSS
- No need for custom icon component or SVG library

## Migration Pattern

Each emoji replacement follows this checklist:
1. Identify emoji's semantic meaning (status, warning, type, etc.)
2. Choose appropriate replacement (Badge, CSS indicator, text label)
3. Apply consistent styling using theme variables
4. Verify accessibility (screen reader, contrast, keyboard)
5. Test visual appearance in all states
6. Confirm no functionality broken

## Rollback Plan

If issues arise:
1. Each component change is isolated (no cross-dependencies)
2. Git history allows reverting individual files
3. Build process will catch TypeScript errors immediately
4. Visual regressions easily spotted in dev server

## Performance Impact

**Expected: None**
- Removing emojis → fewer Unicode characters to render
- Adding CSS → negligible (few classes, small rules)
- Using Badge component → already in bundle, no new imports
- No new dependencies → bundle size unchanged

## Testing Strategy

### Manual Testing
- View each feature in all possible states
- Verify emojis are gone, replacements are clear
- Check empty states, error states, success states
- Confirm color coding is intuitive

### Automated Testing
- Build must pass (TypeScript, CSS compilation)
- No console errors or warnings
- Existing component tests should still pass (no functionality changes)

### Accessibility Testing
- Run with screen reader (NVDA/JAWS on Windows, VoiceOver on Mac)
- Verify all status announcements are clear
- Check color contrast with browser tools

## Future Enhancements (Out of Scope)

These are explicitly NOT part of this change:
- Adding SVG icon library (would increase complexity)
- Creating new custom indicator components (Badge is sufficient)
- Redesigning feature layouts (only replacing emojis)
- Changing color scheme (using existing theme)
- Adding animations (can be done separately if desired)

## Open Questions

None - design is straightforward replacement with existing tools.

## References

- Existing Badge component: `src/shared/components/Badge.tsx`
- Theme colors: `src/index.css` (CSS variables)
- Recent emoji removal from core components (Navigation, EmptyState, etc.)
