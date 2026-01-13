# Proposal: Apply Spacing System Rules

**Change ID:** `apply-spacing-system-rules`  
**Status:** Draft  
**Created:** 2026-01-13  
**Author:** AI Assistant

## Why

The codebase currently uses inconsistent spacing values (hardcoded `rem` units like `0.5rem`, `0.75rem`, `1rem`) instead of the defined spacing system tokens (`--gap-xs`, `--gap-sm`, `--gap-md`, etc.). This leads to:

1. **Visual inconsistency** - spacing between similar components varies unpredictably
2. **Maintenance burden** - no single source of truth for spacing decisions
3. **Theme violations** - doesn't follow the 8px-based spacing system defined in `FINTECH_NEON_THEME.md`
4. **Hard to scale** - changing spacing hierarchy requires hunting through hardcoded values

The Fintech Neon theme defines clear spacing rules:
- Major sections: 32-48px (`--gap-xl` to `--gap-2xl`)
- Between cards: 24-32px (`--gap-lg` to `--gap-xl`)
- Card padding: 16-24px (`--gap-md` to `--gap-lg`)
- Related components: 12-16px (`--gap-sm` to `--gap-md`)
- Icon + text: 8-12px (`--gap-xs` to `--gap-sm`)

These rules must be consistently applied across all Phase 1 UI components to achieve the premium, professional aesthetic the theme is designed for.

## What Changes

**Documentation:**
- ✅ Updated `docs/FINTECH_NEON_THEME.md` with detailed spacing rules and scale reference table

**Code Changes (CSS only):**
- Replace hardcoded spacing values with semantic spacing tokens in all Phase 1 components
- Apply spacing hierarchy rules consistently:
  - Major sections/layout splits: `--gap-xl` (32px) or `--gap-2xl` (48px)
  - Between cards: `--gap-lg` (24px) or `--gap-xl` (32px)
  - Card padding: `--gap-md` (16px) or `--gap-lg` (24px)
  - Component grouping: `--gap-sm` (12px) or `--gap-md` (16px)
  - Icon + text gaps: `--gap-xs` (8px) or `--gap-sm` (12px)
- Update shared components (Button, Card, Modal, Table, Navigation) to use spacing tokens
- Update Phase 1 feature CSS files (Dashboard, Watchlist, Portfolio, Signals) to follow spacing rules

**Affected Specs:**
- `ui-spacing-consistency` (NEW) - Spacing token usage and hierarchy requirements

**Affected Files:**
- `src/shared/components/*.css` (Button, Card, Modal, Table, Navigation, etc.)
- `src/features/dashboard/DashboardView.css`
- `src/features/watchlist/WatchlistView.css`
- `src/features/portfolio/PortfolioView.css`
- `src/features/signals/SignalsView.css`
- `src/App.css`

## Impact

**User Impact:**
- **Visual improvement**: More consistent, professional spacing throughout the UI
- **Better hierarchy**: Clear visual rhythm with predictable spacing patterns
- **No functional changes**: Layout stays the same, only spacing values refined

**Developer Impact:**
- **Easier maintenance**: Spacing changes managed through CSS variables
- **Better compliance**: All spacing follows Fintech Neon design system
- **Consistent patterns**: Clear rules for future component development

**Breaking Changes:** None

**Risk:** Low - CSS-only changes, no logic modifications, visual refinements only

**Estimated Effort:** ~2-3 hours
- Audit current spacing usage: 30 min
- Update shared components: 45 min
- Update Phase 1 features: 45 min
- Visual testing and verification: 30-45 min
