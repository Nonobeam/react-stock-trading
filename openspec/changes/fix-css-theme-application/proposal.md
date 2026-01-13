# Proposal: Fix CSS Theme Application

**Change ID:** `fix-css-theme-application`  
**Status:** Draft  
**Created:** 2026-01-13  
**Author:** AI Assistant

## Why

The Phase 1 Trading UI currently displays as unstyled HTML text without Fintech Neon theme styling, making it unusable. CSS variables and component CSS files exist but are not being applied because component `.tsx` files are missing CSS import statements.

## What Changes

- Add CSS import statements to Phase 1 component files (Dashboard, Watchlist, Portfolio, Signals)
- Consolidate duplicate CSS variables from `theme.css` into `index.css` 
- Verify CSS import order in `main.tsx` for proper cascade
- Ensure production builds bundle all CSS assets correctly

**Affected Specs:**
- `ui-theme-consistency` (NEW) - CSS application requirements

**Affected Files:**
- `src/features/dashboard/DashboardView.tsx`
- `src/features/watchlist/WatchlistView.tsx`
- `src/features/portfolio/PortfolioView.tsx`
- `src/features/signals/SignalsView.tsx`
- `src/shared/styles/theme.css`
- `src/main.tsx`

## Impact

**User Impact:**
- Users will see fully styled Fintech Neon theme interface
- No functional or data changes - purely visual fix

**Breaking Changes:** None

**Risk:** Low - CSS-only changes, no logic modifications
