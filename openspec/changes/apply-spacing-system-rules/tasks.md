# Tasks: Apply Spacing System Rules

**Change ID:** `apply-spacing-system-rules`  
**Status:** Draft  
**Total Tasks:** 16

## Task Breakdown

### Phase 1: Audit & Inventory (Tasks 1-2)

- [x] **Task 1**: Audit all CSS files for hardcoded spacing values
  - Run grep search: `padding:|margin:|gap:` across `src/**/*.css`
  - Create inventory list categorizing by:
    - Major sections (should be 32-48px)
    - Between cards (should be 24-32px)
    - Inside cards (should be 16-24px)
    - Component grouping (should be 12-16px)
    - Icon + text (should be 8-12px)
  - Flag ambiguous or non-standard values for review
  - **Validation**: Complete inventory document with categorized spacing values
  - **Expected**: ~50-100 hardcoded spacing instances identified

- [x] **Task 2**: Map hardcoded values to spacing tokens
  - For each hardcoded value, determine appropriate token:
    - `0.5rem` (8px) → `--gap-xs`
    - `0.75rem` (12px) → `--gap-sm`
    - `1rem` (16px) → `--gap-md`
    - `1.5rem` (24px) → `--gap-lg`
    - `2rem` (32px) → `--gap-xl`
    - `3rem` (48px) → `--gap-2xl`
  - Note cases where semantic adjustment is needed (e.g., upgrading for hierarchy)
  - **Validation**: Mapping table complete with token assignments
  - **Expected**: Clear plan for each file's spacing updates

### Phase 2: Shared Components (Tasks 3-7)

- [x] **Task 3**: Update Button.css spacing
  - Replace icon gap hardcoded values with `--gap-xs` or `--gap-sm`
  - Update button padding to use `--gap-sm` and `--gap-md`
  - Ensure consistent spacing between icon + text in all button variants
  - **Validation**: Inspect buttons in dev tools, verify token usage
  - **Expected**: All button spacing uses tokens, no visual regression

- [x] **Task 4**: Update Card.css spacing
  - Replace card padding with `--gap-lg` (24px) for standard cards
  - Use `--gap-md` (16px) for nested/compact cards
  - Update gaps between card sections with `--gap-md` or `--gap-sm`
  - **Validation**: Check card layouts across different screens
  - **Expected**: Consistent card padding, clear hierarchy

- [x] **Task 5**: Update Modal.css spacing
  - Replace modal content padding with `--gap-lg` (24px)
  - Update modal footer button gaps with `--gap-sm` (12px)
  - Use `--gap-md` for spacing between modal sections
  - **Validation**: Open various modals, check padding consistency
  - **Expected**: Modal spacing follows hierarchy rules

- [x] **Task 6**: Update Table.css spacing
  - Replace table cell padding with `--gap-sm` and `--gap-md`
  - Update table header gaps with `--gap-sm`
  - Use appropriate tokens for empty state padding
  - **Validation**: Check tables in Watchlist and Portfolio views
  - **Expected**: Table spacing consistent and readable

- [x] **Task 7**: Update Navigation.css spacing
  - Replace nav item padding with `--gap-sm` and `--gap-md`
  - Update nav item gaps with `--gap-xs` or `--gap-sm`
  - Fix non-standard values (0.875rem, 0.625rem) to closest tokens
  - Update major layout padding to use `--gap-xl` or `--gap-2xl`
  - **Validation**: Check navigation at all screen sizes
  - **Expected**: Navigation spacing follows theme hierarchy

### Phase 3: Feature Component CSS (Tasks 8-11)

- [x] **Task 8**: Update DashboardView.css spacing
  - Replace section gaps with `--gap-xl` (32px) or `--gap-2xl` (48px)
  - Update card grid gaps with `--gap-lg` (24px) or `--gap-xl` (32px)
  - Fix metric card internal spacing to use `--gap-md`
  - **Validation**: View Dashboard, check visual hierarchy
  - **Expected**: Clear section separation, cohesive card grouping

- [x] **Task 9**: Update WatchlistView.css spacing
  - Replace filter button gaps with `--gap-sm` (12px)
  - Update table container padding with `--gap-lg` (24px)
  - Fix modal content spacing to use tokens consistently
  - **Validation**: View Watchlist, test filter interactions
  - **Expected**: Filter groups clear, table layout spacious

- [x] **Task 10**: Update PortfolioView.css spacing
  - Replace tab bar gaps with `--gap-sm` or `--gap-md`
  - Update summary card padding with `--gap-lg` (24px)
  - Fix position table spacing to use `--gap-md` for grouping
  - **Validation**: View Portfolio, switch tabs, check summary cards
  - **Expected**: Tab spacing consistent, summary cards well-padded

- [x] **Task 11**: Update SignalsView.css spacing
  - Replace signal card grid gaps with `--gap-lg` (24px) or `--gap-xl` (32px)
  - Update filter group spacing with `--gap-sm` (12px)
  - Fix signal detail modal padding to use `--gap-lg`
  - **Validation**: View Signals, check card grid layout
  - **Expected**: Card grid feels spacious, filters clearly grouped

### Phase 4: Layout Wrapper (Task 12)

- [x] **Task 12**: Update App.css spacing
  - Replace top-level layout padding with `--gap-xl` or `--gap-2xl`
  - Ensure navigation → content spacing uses major section tokens
  - Fix any remaining hardcoded layout spacing
  - **Validation**: Check overall app layout padding
  - **Expected**: Top-level spacing follows major section rules

### Phase 5: Verification & Testing (Tasks 13-16)

- [x] **Task 13**: Manual visual regression testing
  - Test all Phase 1 screens (Dashboard, Watchlist, Portfolio, Signals)
  - Verify spacing hierarchy checklist per screen:
    - ✓ Major sections: 32-48px spacing
    - ✓ Card gaps: 24-32px
    - ✓ Card padding: 16-24px
    - ✓ Component groups: 12-16px
    - ✓ Icon + text: 8-12px
  - Check for layout breaks, overflows, cramped areas
  - **Validation**: All screens pass visual hierarchy checklist
  - **Expected**: Consistent, professional spacing throughout

- [x] **Task 14**: Verify token usage completeness
  - Search for remaining hardcoded spacing: `grep "padding: [0-9]" src/**/*.css`
  - Verify 90%+ of spacing uses tokens (excluding micro-spacing <8px)
  - Document any intentional hardcoded values with comments
  - **Validation**: Less than 10% hardcoded spacing remains
  - **Expected**: Comprehensive token adoption

- [x] **Task 15**: Production build and preview testing
  - Run `npm run build` to verify build succeeds
  - Run `npm run preview` to test production bundle
  - Verify spacing renders identically in production vs development
  - Check CSS bundle size (should be similar, ~52-54KB)
  - **Validation**: Production build identical to dev
  - **Expected**: No spacing regressions in production

- [x] **Task 16**: Cross-browser and DevTools validation
  - Test in Chrome (primary), Firefox, Edge
  - Inspect computed styles in DevTools for token resolution
  - Verify no CSS warnings or errors in console
  - Check responsive behavior at different viewport widths
  - **Validation**: Consistent rendering across browsers
  - **Expected**: No browser-specific spacing issues

## Task Dependencies

```
Phase 1 (Audit & Inventory)
  Task 1 → Task 2 (mapping depends on inventory)
  Task 2 → Tasks 3-12 (all implementation tasks need mapping complete)

Phase 2 (Shared Components)
  Task 2 → Task 3, 4, 5, 6, 7 (all need mapping)
  Tasks 3-7 can run in parallel (independent files)

Phase 3 (Feature Components)
  Task 2 → Task 8, 9, 10, 11 (all need mapping)
  Tasks 8-11 can run in parallel (independent files)

Phase 4 (Layout Wrapper)
  Task 2 → Task 12 (needs mapping)
  Task 12 can run in parallel with Tasks 3-11

Phase 5 (Verification)
  Tasks 3-12 → Task 13 (needs implementation complete)
  Task 13 → Task 14 (visual test before token audit)
  Task 14 → Task 15 (completeness check before build)
  Task 15 → Task 16 (build test before final validation)
```

## Parallelizable Work

Tasks that can be done simultaneously:
- **Phase 2**: Tasks 3, 4, 5, 6, 7 (different shared component files)
- **Phase 3**: Tasks 8, 9, 10, 11 (different feature CSS files)
- **Phase 4**: Task 12 can overlap with Phase 2/3 tasks

## Estimated Time

- Phase 1 (Tasks 1-2): 30 minutes
- Phase 2 (Tasks 3-7): 45 minutes (5 files × ~9 min each)
- Phase 3 (Tasks 8-11): 45 minutes (4 files × ~11 min each)
- Phase 4 (Task 12): 10 minutes (1 file, minimal changes)
- Phase 5 (Tasks 13-16): 30-45 minutes (comprehensive testing)

**Total**: ~2.5-3 hours

## Success Criteria Checklist

After completing all tasks, verify:

- [x] All major sections use `--gap-xl` (32px) or `--gap-2xl` (48px)
- [x] Card gaps use `--gap-lg` (24px) or `--gap-xl` (32px)
- [x] Card padding uses `--gap-md` (16px) or `--gap-lg` (24px)
- [x] Component grouping uses `--gap-sm` (12px) or `--gap-md` (16px)
- [x] Icon + text gaps use `--gap-xs` (8px) or `--gap-sm` (12px)
- [x] 90%+ of spacing values use tokens (vs hardcoded rem)
- [x] Visual hierarchy is clear and consistent across all Phase 1 screens
- [x] No layout breaks, overflows, or visual regressions
- [x] Spacing follows `docs/FINTECH_NEON_THEME.md` hierarchy rules exactly
- [x] Production build succeeds and renders identically to dev
- [x] No console errors or CSS warnings
- [x] Cross-browser testing passes (Chrome, Firefox, Edge)

## Rollback Procedure

If issues arise during implementation:

1. **After Phase 2**: If shared component spacing breaks layouts:
   - Revert individual CSS file causing issue
   - Review token mapping for that component
   - Adjust token choice or add exception comment

2. **After Phase 3**: If feature component spacing breaks specific screen:
   - Revert specific feature CSS file
   - Review hierarchy rules application
   - Document edge case for future consideration

3. **After Phase 5**: If production build has spacing issues:
   - Compare dev vs production computed styles
   - Check CSS bundle for missing tokens
   - Revert entire change if critical visual regression

## Notes

- **CSS-Only Changes**: No TypeScript or component logic modifications
- **Theme Compliance**: All changes strictly follow `FINTECH_NEON_THEME.md` spacing rules
- **Visual Testing Critical**: Manual verification required since this is pure UI refinement
- **Semantic Token Usage**: Prioritize semantic meaning over exact pixel match
- **Document Exceptions**: Any hardcoded spacing that remains must have comment explaining why
- **Micro-Spacing (<8px)**: Acceptable to keep hardcoded since no token exists
- **Dev Server Running**: Keep `npm run dev` running for hot reload during implementation

