# Tasks: Fix CSS Theme Application

**Change ID:** `fix-css-theme-application`  
**Status:** Draft  
**Total Tasks:** 12

## Task Breakdown

### Phase 1: Diagnostic & Investigation (Tasks 1-3)

- [x] **Task 1**: Verify CSS import presence in Phase 1 components
  - Check `DashboardView.tsx` for `import './DashboardView.css'`
  - Check `WatchlistView.tsx` for `import './WatchlistView.css'`
  - Check `PortfolioView.tsx` for `import './PortfolioView.css'`
  - Check `SignalsView.tsx` for `import './SignalsView.css'`
  - **Validation**: Run `rg "import.*\.css" src/features/dashboard src/features/watchlist src/features/portfolio src/features/signals`
  - **Expected**: Each component should have its CSS import statement

- [x] **Task 2**: Inspect browser DevTools for CSS loading issues
  - Open http://localhost:5173 in browser
  - Open DevTools (F12) → Network tab
  - Filter by CSS files
  - Verify all Phase 1 component CSS files load (200 status)
  - Check Console for any CSS-related errors
  - **Validation**: Screenshot or note which CSS files are missing/404
  - **Expected**: All component CSS files loaded successfully

- [x] **Task 3**: Audit CSS class names vs JSX className usage
  - For each Phase 1 component, list all `className` values used in JSX
  - Cross-reference with corresponding CSS file rules
  - Document any mismatches (typos, missing rules, etc.)
  - **Validation**: Create checklist of matched vs unmatched classes
  - **Expected**: 100% of className values have matching CSS rules

### Phase 2: CSS Variable Consolidation (Tasks 4-5)

- [x] **Task 4**: Consolidate duplicate CSS variable definitions
  - Keep `src/index.css` as single source of truth for theme variables
  - Remove duplicate `:root` variables from `src/shared/styles/theme.css`
  - Verify `theme.css` only contains non-duplicate utility rules if any
  - Consider deleting `theme.css` entirely if fully duplicate
  - **Validation**: Search for `:root` blocks across CSS files: `rg ":root" src --type css`
  - **Expected**: Only one `:root` block in `index.css`

- [x] **Task 5**: Optimize CSS import order in main.tsx
  - Ensure theme variables load first (index.css)
  - Load global resets second (globals.css)
  - Load indicators/utility styles last
  - Remove `theme.css` import if file deleted
  - **Validation**: Check `main.tsx` import order matches optimal cascade
  - **Expected**: Clean, ordered CSS imports without duplication

### Phase 3: Component CSS Import Fix (Tasks 6-9)

- [x] **Task 6**: Add CSS import to DashboardView component
  - Open `src/features/dashboard/DashboardView.tsx`
  - Add `import './DashboardView.css';` after React import
  - Verify file saves and dev server hot-reloads
  - Check browser to see if Dashboard styling appears
  - **Validation**: Dashboard should show navy background, styled cards
  - **Expected**: Dashboard fully styled with Fintech Neon theme

- [x] **Task 7**: Add CSS import to WatchlistView component
  - Open `src/features/watchlist/WatchlistView.tsx`
  - Add `import './WatchlistView.css';` after React import
  - Verify file saves and dev server hot-reloads
  - Check browser to see if Watchlist styling appears
  - **Validation**: Watchlist should show styled table, filter buttons
  - **Expected**: Watchlist fully styled with theme

- [x] **Task 8**: Add CSS import to PortfolioView component
  - Open `src/features/portfolio/PortfolioView.tsx`
  - Add `import './PortfolioView.css';` after React import
  - Verify file saves and dev server hot-reloads
  - Check browser to see if Portfolio styling appears
  - **Validation**: Portfolio should show tabs, styled tables, summary cards
  - **Expected**: Portfolio fully styled with theme

- [x] **Task 9**: Add CSS import to SignalsView component
  - Open `src/features/signals/SignalsView.tsx`
  - Add `import './SignalsView.css';` after React import
  - Verify file saves and dev server hot-reloads
  - Check browser to see if Signals styling appears
  - **Validation**: Signals should show card grid, filter buttons, score bars
  - **Expected**: Signals fully styled with theme

### Phase 4: Verification & Testing (Tasks 10-12)

- [x] **Task 10**: Manual visual regression testing
  - Open each Phase 1 screen in browser
  - Verify against Fintech Neon theme checklist:
    - ✓ Deep navy background (#0f0f10)
    - ✓ Neon accent (#dadd56) on active nav and buttons
    - ✓ Card elevations with shadows
    - ✓ Proper typography (sizes, weights, colors)
    - ✓ Table borders and zebra striping
    - ✓ Modal glass overlay effect
    - ✓ Hover states on interactive elements
  - Take screenshots for documentation
  - **Validation**: All checklist items pass visual inspection
  - **Expected**: UI matches Fintech Neon theme specification exactly

- [x] **Task 11**: Build and production preview testing
  - Run `npm run build` to create production bundle
  - Verify build succeeds without errors
  - Check `dist/assets/` contains CSS bundle files
  - Run `npm run preview` to test production build
  - Verify production version is fully styled
  - **Validation**: Production build renders identical to dev build
  - **Expected**: Production bundle includes all CSS, no styling regressions

- [x] **Task 12**: Browser DevTools final validation
  - Open app in browser with DevTools
  - Elements tab: Inspect random elements from each screen
    - Verify computed styles use CSS variables correctly
    - Check backgrounds resolve to theme colors
    - Verify no default browser styles remain
  - Console tab: Verify no CSS warnings or errors
  - Network tab: Check CSS bundle size (should be ~54KB)
  - **Validation**: DevTools shows clean, properly applied styles
  - **Expected**: All CSS properly loaded and applied, no errors

## Task Dependencies

```
Phase 1 (Diagnostic)
  Task 1 → Task 6, 7, 8, 9 (identify what needs fixing)
  Task 2 → Task 10, 12 (baseline for comparison)
  Task 3 → Task 6, 7, 8, 9 (identify class name fixes)

Phase 2 (Consolidation)
  Task 4 → Task 5 (must consolidate before optimizing imports)
  Task 5 → Task 6, 7, 8, 9 (clean imports before adding more)

Phase 3 (Component Fixes)
  Task 5 → Task 6, 7, 8, 9 (need clean imports first)
  Tasks 6, 7, 8, 9 can run in parallel (independent components)

Phase 4 (Verification)
  Tasks 6, 7, 8, 9 → Task 10 (need styled UI to test)
  Task 10 → Task 11 (manual test before build)
  Task 11 → Task 12 (build before final DevTools check)
```

## Parallelizable Work

Tasks that can be done simultaneously:
- Tasks 6, 7, 8, 9 (adding CSS imports to each component)

## Estimated Time

- Phase 1 (Tasks 1-3): 20 minutes
- Phase 2 (Tasks 4-5): 15 minutes
- Phase 3 (Tasks 6-9): 20 minutes
- Phase 4 (Tasks 10-12): 30 minutes

**Total**: ~1.5 hours

## Success Criteria Checklist

After completing all tasks, verify:

- [x] All Phase 1 screens (Dashboard, Watchlist, Portfolio, Signals) are fully styled
- [x] Deep navy background (#0f0f10) is visible throughout the app
- [x] Neon yellow-green accent (#dadd56) appears on navigation, buttons, and highlights
- [x] Cards have proper panel backgrounds, borders, and shadow elevation
- [x] Typography follows design system (sizes, weights, colors, line-heights)
- [x] Interactive elements (buttons, tables, tabs) have proper hover and active states
- [x] Modals have glass effect overlay with blur
- [x] Tables have borders, zebra striping, and sortable column headers
- [x] No unstyled HTML or default browser styles visible
- [x] No console errors or CSS warnings
- [x] Production build succeeds and includes all CSS assets
- [x] CSS bundle size is reasonable (~54KB)

## Rollback Procedure

If issues arise during implementation:

1. **After Task 5**: If CSS import consolidation breaks styles:
   - Revert changes to `main.tsx` and `theme.css`
   - Restore original import order
   - Document specific conflict for further investigation

2. **After Tasks 6-9**: If component CSS imports cause errors:
   - Remove CSS import from failing component
   - Check for typos in import path or filename
   - Verify CSS file exists at expected location

3. **After Task 11**: If production build fails:
   - Revert any Vite config changes
   - Use `npm run dev` for continued development
   - Document build error for separate investigation

## Notes

- **No Code Changes Beyond CSS**: This change only fixes CSS application; no component logic changes
- **Theme Compliance**: All styles must use CSS variables from Fintech Neon palette
- **Manual Testing Required**: Visual verification is critical since this is UI-focused fix
- **Dev Server Must Be Running**: Keep `npm run dev` running throughout implementation for hot reload
