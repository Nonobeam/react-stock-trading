# Design: Apply Spacing System Rules

**Change ID:** `apply-spacing-system-rules`  
**Status:** Draft  
**Created:** 2026-01-13

## Overview

This change systematically applies the Fintech Neon spacing system rules across all Phase 1 UI components, replacing hardcoded `rem` values with semantic spacing tokens to achieve visual consistency and maintainability.

## Problem Analysis

### Current State Issues

1. **Inconsistent token usage**: Mix of hardcoded values (`0.5rem`, `1rem`) and tokens (`var(--gap-4)`)
2. **Arbitrary spacing**: Values chosen ad-hoc without clear hierarchy
3. **Theme divergence**: Doesn't follow the documented spacing rules in `FINTECH_NEON_THEME.md`
4. **Maintenance complexity**: Global spacing changes require file-by-file edits

### Examples of Current Issues

```css
/* Navigation.css - mixed approaches */
padding: 1rem 0.75rem;          /* Hardcoded */
gap: 0.5rem;                     /* Hardcoded */
padding: 0.875rem 1rem;         /* Non-standard value */

/* Modal.css - some tokens used */
padding: var(--gap-4);          /* Token (good) */
gap: var(--gap-3);               /* Token (good) */

/* Table.css - mixed */
padding: var(--gap-3) var(--gap-4);  /* Tokens (good) */
padding: var(--gap-8);               /* Token but wrong scale */
```

## Design Decisions

### 1. Spacing Token Mapping Strategy

**Principle**: Map hardcoded values to closest semantic token, then adjust if needed for visual hierarchy.

| Current Value | Semantic Meaning | Recommended Token |
|---------------|------------------|-------------------|
| `0.25rem` (4px) | Micro spacing | No token (use raw or line-height) |
| `0.5rem` (8px) | Small gap, icon+text | `--gap-xs` |
| `0.75rem` (12px) | Label-input, small grouping | `--gap-sm` |
| `1rem` (16px) | Component grouping, min padding | `--gap-md` |
| `1.5rem` (24px) | Card padding, card gaps | `--gap-lg` |
| `2rem` (32px) | Section separation | `--gap-xl` |
| `3rem` (48px) | Major layout splits | `--gap-2xl` |

### 2. Hierarchy Rules Application

**Major Sections (48px / 32px)**
- Top-level layout splits (nav → content)
- Between distinct dashboard sections
- Use: `--gap-2xl` (48px) for spacious, `--gap-xl` (32px) for standard

**Between Cards (32px / 24px)**
- Grid gaps in card layouts
- Vertical spacing between card rows
- Use: `--gap-xl` (32px) for dashboard, `--gap-lg` (24px) for dense views

**Inside Cards (24px / 16px)**
- Card padding (outer shell)
- Nested card padding can be smaller
- Use: `--gap-lg` (24px) for main cards, `--gap-md` (16px) for nested

**Component Grouping (16px / 12px)**
- Related inputs in a form
- Button groups
- Filter button rows
- Use: `--gap-md` (16px) for standard, `--gap-sm` (12px) for compact

**Icon + Text (12px / 8px)**
- Icons beside labels
- Status indicators with text
- Use: `--gap-sm` (12px) for readable, `--gap-xs` (8px) for tight

### 3. File-by-File Strategy

**Phase 1: Shared Components**
- `Button.css`: Icon gaps, padding
- `Card.css`: Padding, nested card gaps
- `Modal.css`: Content padding, button group gaps
- `Table.css`: Cell padding, header gaps
- `Navigation.css`: Nav item gaps, padding
- Priority: High (affects all screens)

**Phase 2: Feature Components**
- `DashboardView.css`: Section gaps, card grid
- `WatchlistView.css`: Filter gaps, table spacing
- `PortfolioView.css`: Tab gaps, summary cards
- `SignalsView.css`: Card grid, filter groups
- Priority: Medium (specific to each screen)

**Phase 3: Layout Wrapper**
- `App.css`: Top-level layout padding
- Priority: Low (minimal spacing)

### 4. Edge Cases & Special Handling

**Micro Spacing (4px)**
- Not tokenized (too small for general use)
- Use raw `4px` or rely on line-height for text lines
- Examples: Tight inline elements, badge spacing

**Non-Standard Current Values**
- `0.875rem` (14px) → Map to `--gap-sm` (12px)
- `4.5rem` (72px) → Evaluate context, likely reduce to `--gap-2xl` (48px)
- `0.625rem` (10px) → Map to `--gap-sm` (12px)

**Responsive Adjustments**
- Keep tokens consistent across breakpoints
- Adjust number of tokens if needed (e.g., `--gap-lg` → `--gap-md` on mobile)
- Don't create new hardcoded values for responsive

### 5. Non-Goals

**Out of Scope:**
- Typography line-height adjustments (separate concern)
- Border widths (not part of spacing system)
- Icon sizes (separate token system)
- Padding inside `<input>` elements (form control spec)
- Chart/visualization spacing (data-driven layouts)

**Future Enhancements (not this change):**
- Adding micro-spacing token (`--gap-2xs: 4px`)
- Responsive spacing scale adjustments
- Component-specific spacing presets (e.g., `--card-padding-default`)

## Implementation Approach

### Phase-by-Phase Execution

**Phase 1: Audit & Inventory (30 min)**
1. Grep all CSS files for hardcoded spacing: `padding:`, `margin:`, `gap:`
2. Create spreadsheet/list of current values per file
3. Categorize by hierarchy level (major section, card, component, etc.)
4. Flag ambiguous cases for review

**Phase 2: Shared Components (45 min)**
1. Update Button.css (icon gaps, padding)
2. Update Card.css (padding, nested gaps)
3. Update Modal.css (dialog padding, footer gaps)
4. Update Table.css (cell padding, row gaps)
5. Update Navigation.css (nav item padding, gaps)
6. Visual test each component in isolation

**Phase 3: Feature CSS Files (45 min)**
1. Update DashboardView.css (section gaps, card grid)
2. Update WatchlistView.css (filter groups, table layout)
3. Update PortfolioView.css (tab bar, summary cards)
4. Update SignalsView.css (signal cards grid, filters)
5. Visual test each screen for spacing hierarchy

**Phase 4: Verification (30-45 min)**
1. Manual visual regression (all Phase 1 screens)
2. Check spacing consistency with theme rules
3. Verify no layout breaks or overflows
4. Production build test
5. Cross-browser check (Chrome, Firefox, Edge)

### Validation Checklist

After implementation, verify:
- [ ] No hardcoded `rem` values remain for spacing (except micro-spacing `<8px`)
- [ ] Major sections use `--gap-xl` or `--gap-2xl`
- [ ] Cards use `--gap-lg` for padding
- [ ] Card grids use `--gap-lg` or `--gap-xl` for gaps
- [ ] Component groups use `--gap-sm` or `--gap-md`
- [ ] Icon + text uses `--gap-xs` or `--gap-sm`
- [ ] Visual hierarchy is clear and consistent across all screens
- [ ] No layout breaks or overflows introduced
- [ ] Production build succeeds

## Rollback Plan

If spacing changes cause visual issues:

1. **Isolated Component Issue**: Revert specific CSS file to previous version
2. **Widespread Layout Break**: Revert entire change via git
3. **Token Value Mismatch**: Adjust token definition in `index.css` rather than reverting

Recovery is low-risk since changes are CSS-only with no logic modifications.

## Testing Strategy

### Manual Visual Testing

**Per-Screen Checklist:**
- Dashboard: Section spacing, card grid, metric card padding
- Watchlist: Filter button gaps, table cell padding, modal content
- Portfolio: Tab spacing, summary card layout, position table
- Signals: Signal card grid, filter groups, detail modal

**Hierarchy Verification:**
- Major sections feel distinct and separated
- Card groups feel cohesive but not cramped
- Component groupings are clear
- Icon + text feels balanced
- No awkward gaps or cramped areas

### Automated Testing

- Build test: `npm run build` succeeds
- No CSS lint errors
- DevTools computed styles show correct token values

### Cross-Browser Testing

- Chrome (primary)
- Firefox (secondary)
- Edge (tertiary)

## Theme Compliance Verification

All spacing changes MUST follow `docs/FINTECH_NEON_THEME.md`:

✅ **Core Spacing Tokens Used:**
- `--gap-xs: 8px` for icon + text
- `--gap-sm: 12px` for small groupings
- `--gap-md: 16px` for component grouping
- `--gap-lg: 24px` for card padding
- `--gap-xl: 32px` for section separation
- `--gap-2xl: 48px` for major splits

✅ **Hierarchy Rules Applied:**
- Major sections: 32-48px
- Between cards: 24-32px
- Inside cards: 16-24px
- Related components: 12-16px
- Icon + text: 8-12px

✅ **Visual Principles Maintained:**
- Generous padding and breathing space
- Clear visual hierarchy through spacing
- Professional, premium feel
- No cramped or awkward layouts

## Success Metrics

**Quantitative:**
- 90%+ of spacing values use tokens (vs hardcoded)
- 100% of major sections use `--gap-xl` or `--gap-2xl`
- 100% of card padding uses `--gap-md` or `--gap-lg`
- 0 layout breaks or visual regressions

**Qualitative:**
- Spacing feels consistent across all Phase 1 screens
- Visual hierarchy is clear and intentional
- UI feels more premium and polished
- Easier to maintain spacing in future changes
