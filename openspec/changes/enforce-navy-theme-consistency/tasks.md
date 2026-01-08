# Tasks: Enforce Navy Theme Consistency

**Change ID:** `enforce-navy-theme-consistency`  
**Last Updated:** 2026-01-07

This document breaks down the navy theme enforcement into small, verifiable work items. Each task should be completable in < 2 hours and have clear validation steps.

---

## Phase 1: CSS Variables Foundation

### Task 1.1: Update Root CSS Variables
**File:** `src/index.css`

**Actions:**
1. Replace existing `:root` color variables with navy palette:
   ```css
   --bg: #071033;
   --panel: #0b1a3a;
   --accent: #1e4db3;
   --muted: #6b80a6;
   --text: #DDEBFF;
   ```
2. Add derived color variables:
   ```css
   --panel-elevated: #0e1f45;
   --accent-dark: #153b8f;
   --accent-light: #2b5dc9;
   --border: rgba(255, 255, 255, 0.06);
   ```
3. Add status colors:
   ```css
   --success: #4ade80;
   --warning: #fbbf24;
   --danger: #ef4444;
   --info: #3b82f6;
   ```
4. Add shadow variables:
   ```css
   --shadow-sm: 0 2px 4px rgba(4, 8, 20, 0.4);
   --shadow: 0 6px 20px rgba(4, 8, 20, 0.6);
   --shadow-lg: 0 12px 48px rgba(4, 8, 20, 0.8);
   ```
5. Add spacing variables:
   ```css
   --gap: 12px;
   --gap-sm: 8px;
   --gap-lg: 16px;
   --gap-xl: 24px;
   ```
6. Add typography scale:
   ```css
   --text-xs: 0.75rem;
   --text-sm: 0.875rem;
   --text-base: 1rem;
   --text-lg: 1.125rem;
   --text-xl: 1.25rem;
   --text-2xl: 1.5rem;
   ```

**Validation:**
- [ ] Run `npm run dev` → no errors
- [ ] Inspect `:root` in browser DevTools → all variables present
- [ ] No visual regression (app still renders)

**Estimated Time:** 30 minutes

---

### Task 1.2: Add Deprecated Variable Aliases
**File:** `src/index.css`

**Actions:**
1. Add backward compatibility aliases below new variables:
   ```css
   /* DEPRECATED - Remove after migration complete */
   --color-bg-primary: var(--bg);
   --color-bg-secondary: var(--panel);
   --color-primary: var(--accent);
   --color-text-primary: var(--text);
   --color-text-muted: var(--muted);
   --color-border: var(--border);
   ```

**Validation:**
- [ ] Components using old variables still render correctly
- [ ] No console warnings about undefined variables

**Estimated Time:** 10 minutes

---

### Task 1.3: Update Border Radius Variable
**File:** `src/index.css`

**Actions:**
1. Ensure `--radius: 8px;` is defined
2. Check if any components use hardcoded `border-radius` values
3. Document standard: 8px for most elements, 12px for elevated panels

**Validation:**
- [ ] `--radius` variable exists
- [ ] All cards/panels have consistent rounded corners

**Estimated Time:** 15 minutes

---

## Phase 2: Core Component Updates

### Task 2.1: Update Button Component
**File:** `src/shared/components/Button.css`

**Actions:**
1. Update `.btn-primary` (or primary button class):
   ```css
   background: linear-gradient(180deg, var(--accent), var(--accent-dark));
   color: var(--text);
   border-radius: var(--radius);
   box-shadow: var(--shadow-sm);
   ```
2. Update hover state:
   ```css
   background: linear-gradient(180deg, var(--accent-light), var(--accent));
   box-shadow: 0 4px 12px rgba(30, 77, 179, 0.4);
   ```
3. Update secondary button:
   ```css
   background: transparent;
   border: 1px solid var(--border);
   color: var(--text);
   ```
4. Remove any hardcoded colors

**Validation:**
- [ ] Buttons render with navy gradient
- [ ] Hover effect works (gradient shifts, shadow increases)
- [ ] Active state works (slight press effect)
- [ ] Secondary buttons have transparent background with border
- [ ] No hardcoded hex colors in Button.css

**Estimated Time:** 45 minutes

---

### Task 2.2: Update Card Component
**File:** `src/shared/components/Card.css`

**Actions:**
1. Update `.card` class:
   ```css
   background: var(--panel);
   border: 1px solid var(--border);
   box-shadow: var(--shadow);
   border-radius: var(--radius);
   ```
2. Add optional card gradient variant:
   ```css
   .card-gradient {
     background: linear-gradient(180deg, #091233, #081a2e);
   }
   ```
3. Update hover effect:
   ```css
   .card:hover {
     box-shadow: var(--shadow-lg);
     transform: translateY(-2px);
   }
   ```

**Validation:**
- [ ] All cards have navy background (no white/light gray)
- [ ] Cards use `var(--panel)` or gradient
- [ ] Hover effect smooth (elevation increases)
- [ ] Border subtle but visible

**Estimated Time:** 30 minutes

---

### Task 2.3: Update Tooltip Component
**File:** `src/shared/components/Tooltip.css`

**Actions:**
1. Replace hardcoded `#1f2937` with `var(--panel)`:
   ```css
   .tooltip {
     background: var(--panel);
     color: var(--text);
     border: 1px solid var(--border);
     box-shadow: var(--shadow-lg);
   }
   ```
2. Update transparent variant:
   ```css
   .tooltip-transparent {
     background: rgba(11, 26, 58, 0.8); /* --panel at 80% */
     backdrop-filter: blur(8px);
   }
   ```

**Validation:**
- [ ] Tooltips have navy background (not gray-blue `#1f2937`)
- [ ] Transparent tooltips have 80% opacity + blur
- [ ] Text readable on tooltip background
- [ ] TradingTerm tooltips render correctly

**Estimated Time:** 20 minutes

---

### Task 2.4: Update Navigation Component
**File:** `src/shared/components/Navigation.css`

**Actions:**
1. Update navigation container:
   ```css
   .navigation {
     background: var(--panel);
     border-bottom: 1px solid var(--border);
   }
   ```
2. Update nav item:
   ```css
   .nav-item {
     color: var(--muted);
   }
   .nav-item:hover {
     color: var(--text);
     background: rgba(30, 77, 179, 0.1);
   }
   .nav-item.active {
     color: var(--text);
     background: var(--accent);
     font-weight: 600;
   }
   ```

**Validation:**
- [ ] Navigation bar has navy background
- [ ] Active item has accent color background
- [ ] Hover effect visible
- [ ] Text color contrasts well

**Estimated Time:** 25 minutes

---

### Task 2.5: Update Badge Component
**File:** `src/shared/components/Badge.css`

**Actions:**
1. Update badge variants to use CSS variables:
   ```css
   .badge-success { background: var(--success); color: #000; }
   .badge-warning { background: var(--warning); color: #000; }
   .badge-danger { background: var(--danger); color: var(--text); }
   .badge-info { background: var(--info); color: var(--text); }
   ```
2. Update default badge:
   ```css
   .badge {
     background: var(--panel-elevated);
     color: var(--text);
     border: 1px solid var(--border);
   }
   ```

**Validation:**
- [ ] Badges use status color variables
- [ ] Default badge has navy background
- [ ] Text readable on all badge variants

**Estimated Time:** 20 minutes

---

### Task 2.6: Update LoadingSpinner Component
**File:** `src/shared/components/LoadingSpinner.css`

**Actions:**
1. Update spinner color:
   ```css
   .spinner {
     border-color: var(--muted);
     border-top-color: var(--accent);
   }
   ```

**Validation:**
- [ ] Spinner uses accent color
- [ ] Animation smooth
- [ ] Visible on navy background

**Estimated Time:** 10 minutes

---

### Task 2.7: Update LoadingSkeleton Component
**File:** `src/shared/components/LoadingSkeleton.css`

**Actions:**
1. Update skeleton background:
   ```css
   .skeleton {
     background: linear-gradient(90deg, var(--panel) 25%, var(--panel-elevated) 50%, var(--panel) 75%);
     background-size: 200% 100%;
     animation: shimmer 1.5s infinite;
   }
   ```

**Validation:**
- [ ] Skeleton has navy gradient
- [ ] Shimmer animation works
- [ ] Contrast sufficient to see loading state

**Estimated Time:** 15 minutes

---

### Task 2.8: Update ConnectionStatus Component
**File:** `src/shared/components/ConnectionStatus.css`

**Actions:**
1. Update status indicator:
   ```css
   .status-connected { color: var(--success); }
   .status-disconnected { color: var(--danger); }
   .status-connecting { color: var(--warning); }
   ```
2. Update container background:
   ```css
   .connection-status {
     background: var(--panel);
     border: 1px solid var(--border);
   }
   ```

**Validation:**
- [ ] Status colors use CSS variables
- [ ] Container has navy background
- [ ] Status visible in header

**Estimated Time:** 15 minutes

---

## Phase 3: Feature Component Updates

### Task 3.1: Update Market View Styles
**File:** `src/features/market/MarketDataView.css`

**Actions:**
1. Replace hardcoded colors with variables:
   - Background → `var(--bg)`
   - Panels → `var(--panel)`
   - Borders → `var(--border)`
2. Update any custom button/card styles to match global patterns

**Validation:**
- [ ] Market view has consistent navy theme
- [ ] No hardcoded hex colors
- [ ] All elements use CSS variables

**Estimated Time:** 30 minutes

---

### Task 3.2: Update IndicatorsPanel Styles
**File:** `src/features/market/components/IndicatorsPanel.css` (if exists)

**Actions:**
1. Update indicator cards to use `var(--panel)` background
2. Update indicator labels to use `var(--text)` color
3. Update borders to use `var(--border)`

**Validation:**
- [ ] Indicator cards have navy background
- [ ] RSI, MACD, etc. display correctly with TradingTerm tooltips
- [ ] Text readable

**Estimated Time:** 20 minutes

---

### Task 3.3: Update Performance View Styles
**File:** `src/features/analytics/PerformanceView.css`

**Actions:**
1. Replace hardcoded colors with variables
2. Update metric cards to use `var(--panel)` background
3. Update profit/loss colors:
   - Positive → `var(--success)`
   - Negative → `var(--danger)`

**Validation:**
- [ ] Performance cards have navy background
- [ ] Win Rate, Sharpe Ratio metrics visible
- [ ] Profit/loss colors semantic (green/red)

**Estimated Time:** 30 minutes

---

### Task 3.4: Update PerformanceOverviewCards Styles
**File:** `src/features/analytics/components/PerformanceOverviewCards.css` (if exists)

**Actions:**
1. Update card backgrounds to `var(--panel)`
2. Update metric value colors (green for positive, red for negative)
3. Ensure TradingTerm tooltips render correctly

**Validation:**
- [ ] Overview cards consistent with theme
- [ ] Tooltips display correctly on hover
- [ ] No visual regression from previous implementation

**Estimated Time:** 20 minutes

---

### Task 3.5: Update Risk View Styles
**File:** `src/features/risk/RiskView.css`

**Actions:**
1. Replace hardcoded colors with variables
2. Update risk level indicators:
   - Low risk → `var(--success)`
   - Medium risk → `var(--warning)`
   - High risk → `var(--danger)`
3. Update panels to `var(--panel)` background

**Validation:**
- [ ] Risk view has navy theme
- [ ] Risk indicators use status colors
- [ ] Position size calculator visible

**Estimated Time:** 30 minutes

---

### Task 3.6: Update Scanner View Styles
**File:** `src/features/scanner/ScannerView.css`

**Actions:**
1. Replace hardcoded colors with variables
2. Update trade setup cards to `var(--panel)` background
3. Update setup status badges to use status colors

**Validation:**
- [ ] Scanner view has navy theme
- [ ] Setup cards display correctly
- [ ] Badges use semantic colors

**Estimated Time:** 30 minutes

---

### Task 3.7: Update Regime View Styles
**File:** `src/features/regime/RegimeView.css`

**Actions:**
1. Replace hardcoded colors with variables
2. Update regime indicator backgrounds
3. Update trend indicators to use accent colors

**Validation:**
- [ ] Regime view has navy theme
- [ ] Regime indicators visible
- [ ] No light backgrounds

**Estimated Time:** 30 minutes

---

### Task 3.8: Update Monitoring View Styles
**File:** `src/features/monitoring/MonitoringView.css`

**Actions:**
1. Replace hardcoded colors with variables
2. Update monitoring panels to `var(--panel)` background
3. Update alert/warning indicators to use status colors

**Validation:**
- [ ] Monitoring view has navy theme
- [ ] Alert indicators use danger color
- [ ] WebSocket status visible

**Estimated Time:** 30 minutes

---

## Phase 4: App-Level Styles

### Task 4.1: Update App.css
**File:** `src/App.css`

**Actions:**
1. Update `.app-container` or root container:
   ```css
   background: var(--bg);
   color: var(--text);
   ```
2. Update dashboard grid/layout to use `var(--gap)` spacing
3. Remove any hardcoded colors

**Validation:**
- [ ] App background is navy (`#071033`)
- [ ] Layout spacing consistent
- [ ] No white flashes on load

**Estimated Time:** 20 minutes

---

### Task 4.2: Review index.css
**File:** `src/index.css`

**Actions:**
1. Review global styles (body, html, etc.)
2. Ensure body background uses `var(--bg)`
3. Ensure default text color uses `var(--text)`
4. Verify scrollbar styling (if customized) uses navy colors

**Validation:**
- [ ] Body background is navy
- [ ] No global styles conflict with theme
- [ ] Scrollbars match theme (if styled)

**Estimated Time:** 15 minutes

---

## Phase 5: Documentation

### Task 5.1: Create Design System Documentation
**File:** `docs/DESIGN_SYSTEM.md`

**Actions:**
1. Create file with sections:
   - Color Palette Reference (table with swatches)
   - Component Patterns (buttons, cards, inputs)
   - Gradient Library (approved patterns)
   - Do's and Don'ts (code examples)
   - Migration Guide
   - Validation Checklist
2. Include visual examples where possible
3. Add contrast ratio information for accessibility

**Validation:**
- [ ] File exists and is complete
- [ ] All color variables documented
- [ ] Component patterns clear with code examples
- [ ] Migration guide actionable

**Estimated Time:** 2 hours

---

### Task 5.2: Update README
**File:** `README.md`

**Actions:**
1. Add section on theme/design system
2. Link to `docs/DESIGN_SYSTEM.md`
3. Mention navy theme as project standard
4. Note: dark mode only, no light theme

**Validation:**
- [ ] README mentions theme system
- [ ] Link to design docs works

**Estimated Time:** 10 minutes

---

## Phase 6: Validation & Testing

### Task 6.1: Audit All CSS Files
**Command:** `grep -r "#[0-9a-f]\{6\}" src/ --include="*.css" | grep -v "index.css"`

**Actions:**
1. Run grep search for hardcoded hex colors
2. For each match, replace with appropriate CSS variable
3. Re-run search until zero matches (excluding `:root`)

**Validation:**
- [ ] Zero hardcoded hex colors in component CSS files
- [ ] All colors use `var(--)` syntax

**Estimated Time:** 1 hour

---

### Task 6.2: Check for Light Backgrounds
**Command:** `grep -r "#fff\|#ffffff\|white\|#f0f0f0" src/ --include="*.css"`

**Actions:**
1. Run grep search for light colors
2. Verify no light backgrounds exist
3. Replace any findings with navy variables

**Validation:**
- [ ] Zero light background colors found
- [ ] All backgrounds navy-toned

**Estimated Time:** 20 minutes

---

### Task 6.3: Visual Regression Testing
**Manual Process:**

**Actions:**
1. Open app in browser (npm run dev)
2. Navigate to each view:
   - Market Data
   - Performance
   - Risk Management
   - Scanner
   - Regime
   - Monitoring
3. For each view, verify:
   - Background is navy (no white)
   - Cards have consistent panel background
   - Buttons have gradient pattern
   - Text readable (good contrast)
   - Interactive elements use accent color
   - Hover states work correctly
4. Take screenshots for documentation

**Validation:**
- [ ] All 6 views pass visual check
- [ ] No light backgrounds anywhere
- [ ] Interactive states work (hover, focus, active)
- [ ] No layout shifts or visual bugs

**Estimated Time:** 1 hour

---

### Task 6.4: Accessibility Testing
**Tool:** axe DevTools browser extension

**Actions:**
1. Install axe DevTools extension
2. Open each view in browser
3. Run axe scan
4. Check for color contrast violations
5. Verify all violations are addressed
6. Ensure WCAG AA compliance minimum (prefer AAA)

**Validation:**
- [ ] Zero color contrast violations
- [ ] All text meets 4.5:1 ratio (normal text)
- [ ] All interactive elements meet 3:1 ratio
- [ ] Focus indicators visible

**Estimated Time:** 45 minutes

---

### Task 6.5: Cross-Browser Testing
**Browsers:** Chrome, Firefox, Safari, Edge

**Actions:**
1. Open app in each browser
2. Verify theme renders correctly
3. Check gradient support
4. Check backdrop-filter support (Tooltip)
5. Document any browser-specific issues

**Validation:**
- [ ] Theme consistent across Chrome, Firefox, Safari, Edge
- [ ] Gradients render smoothly (no banding)
- [ ] Shadows appear consistent

**Estimated Time:** 30 minutes

---

### Task 6.6: Performance Testing
**Tool:** Browser DevTools Performance tab

**Actions:**
1. Record page load performance
2. Verify no FOUC (Flash of Unstyled Content)
3. Check CSS variable lookup doesn't impact render time
4. Compare before/after theme update (if possible)

**Validation:**
- [ ] No white flash on page load
- [ ] Time to first paint < 300ms
- [ ] No layout shifts due to theme

**Estimated Time:** 20 minutes

---

## Phase 7: Cleanup

### Task 7.1: Remove Deprecated Variable Aliases
**File:** `src/index.css`

**Actions:**
1. Search codebase for usage of old variables:
   - `--color-bg-primary`
   - `--color-bg-secondary`
   - `--color-primary`
   - `--color-text-primary`
   - `--color-text-muted`
   - `--color-border`
2. If ZERO matches found, remove aliases from `:root`
3. If matches found, create separate task to migrate remaining usages

**Validation:**
- [ ] No code uses deprecated variables
- [ ] Aliases removed from index.css
- [ ] App still renders correctly

**Estimated Time:** 30 minutes

---

### Task 7.2: Final Code Review
**Manual Review:**

**Actions:**
1. Review all CSS files changed in this effort
2. Verify adherence to design system patterns
3. Check for any missed hardcoded colors
4. Ensure consistent spacing, shadows, typography
5. Verify documentation is accurate

**Validation:**
- [ ] All CSS follows design system
- [ ] No hardcoded colors
- [ ] Documentation matches implementation
- [ ] Code review approved

**Estimated Time:** 1 hour

---

### Task 7.3: Update OpenSpec Proposal Status
**File:** `openspec/changes/enforce-navy-theme-consistency/proposal.md`

**Actions:**
1. Mark proposal as "Implemented"
2. Add completion date
3. Link to documentation (`docs/DESIGN_SYSTEM.md`)
4. Archive proposal to `openspec/changes/archive/` if applicable

**Validation:**
- [ ] Proposal status updated
- [ ] Completion date recorded
- [ ] Documentation linked

**Estimated Time:** 5 minutes

---

## Summary

**Total Tasks:** 37  
**Estimated Total Time:** ~18 hours (2-3 days of focused work)

**Critical Path:**
1. Phase 1 (CSS variables) → Phase 2 (core components) → Phase 3 (feature components) → Phase 4 (app-level) → Phase 6 (validation)
2. Phase 5 (documentation) can be done in parallel with Phase 3/4
3. Phase 7 (cleanup) only after all validation passes

**Dependencies:**
- Task 1.1 must complete before any other task (defines variables)
- Task 1.2 should complete early to prevent regressions
- Phase 6 validation tasks must complete before Phase 7 cleanup
- Task 6.1 and 6.2 can catch any missed hardcoded colors before final review

**Success Criteria:**
- ✅ All CSS variables defined and used consistently
- ✅ Zero hardcoded hex colors in component files
- ✅ Zero light backgrounds anywhere in UI
- ✅ All views render with navy theme
- ✅ WCAG AA accessibility compliance
- ✅ Design system documentation complete
- ✅ All tests pass (visual, accessibility, cross-browser, performance)
