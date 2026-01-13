# Specification: UI Theme Consistency

**Capability:** `ui-theme-consistency`  
**Related Change:** `fix-css-theme-application`  
**Version:** 1.0.0  
**Status:** Draft

## Overview

This specification defines the requirements for consistent application of the Fintech Neon theme across all Phase 1 Trading UI screens, ensuring visual styling renders correctly in both development and production environments.

---

## ADDED Requirements

### Requirement: Phase 1 components SHALL import component-specific CSS files

Phase 1 feature components (Dashboard, Watchlist, Portfolio, Signals) SHALL import their corresponding CSS files to ensure component-specific styles are loaded and applied correctly in the browser.

#### Scenario: Dashboard component imports its CSS stylesheet

**Given** the DashboardView component exists at `src/features/dashboard/DashboardView.tsx`  
**And** the DashboardView stylesheet exists at `src/features/dashboard/DashboardView.css`  
**When** the DashboardView component is rendered  
**Then** the component file MUST include `import './DashboardView.css';` statement  
**And** the stylesheet MUST be loaded in the browser  
**And** all dashboard CSS rules MUST be applied to dashboard elements

#### Scenario: Watchlist component imports its CSS stylesheet

**Given** the WatchlistView component exists at `src/features/watchlist/WatchlistView.tsx`  
**And** the WatchlistView stylesheet exists at `src/features/watchlist/WatchlistView.css`  
**When** the WatchlistView component is rendered  
**Then** the component file MUST include `import './WatchlistView.css';` statement  
**And** the stylesheet MUST be loaded in the browser  
**And** all watchlist CSS rules MUST be applied to watchlist elements

#### Scenario: Portfolio component imports its CSS stylesheet

**Given** the PortfolioView component exists at `src/features/portfolio/PortfolioView.tsx`  
**And** the PortfolioView stylesheet exists at `src/features/portfolio/PortfolioView.css`  
**When** the PortfolioView component is rendered  
**Then** the component file MUST include `import './PortfolioView.css';` statement  
**And** the stylesheet MUST be loaded in the browser  
**And** all portfolio CSS rules MUST be applied to portfolio elements

#### Scenario: Signals component imports its CSS stylesheet

**Given** the SignalsView component exists at `src/features/signals/SignalsView.tsx`  
**And** the SignalsView stylesheet exists at `src/features/signals/SignalsView.css`  
**When** the SignalsView component is rendered  
**Then** the component file MUST include `import './SignalsView.css';` statement  
**And** the stylesheet MUST be loaded in the browser  
**And** all signals CSS rules MUST be applied to signals elements

---

### Requirement: Application SHALL maintain single source for theme CSS variables

The application SHALL maintain theme CSS variables in a single authoritative source (`src/index.css`) to prevent duplication and cascade conflicts.

#### Scenario: Theme variables defined in single location

**Given** the application uses CSS custom properties for theming  
**When** the application initializes  
**Then** all Fintech Neon theme variables MUST be defined in `src/index.css`  
**And** no other CSS file MUST contain duplicate `:root` variable definitions  
**And** theme variables MUST be available globally to all components

#### Scenario: Theme variables cascade to all elements

**Given** theme variables are defined in `src/index.css`  
**When** any component renders with elements using theme variables  
**Then** all CSS custom properties (e.g., `var(--bg)`, `var(--accent)`) MUST resolve correctly  
**And** computed styles MUST show theme color values (e.g., `#0f0f10`, `#dadd56`)  
**And** no elements MUST show default browser colors (e.g., blue links, white backgrounds)

---

### Requirement: Phase 1 screens SHALL render with Fintech Neon color palette

Phase 1 screens (Dashboard, Watchlist, Portfolio, Signals) SHALL render with the exact Fintech Neon color palette as specified in `docs/FINTECH_NEON_THEME.md`, with no deviations or default browser colors.

#### Scenario: Application background uses theme color

**Given** the user opens the application  
**When** any Phase 1 screen is displayed  
**Then** the page background color MUST be `#0f0f10` (--bg)  
**And** no white or default background colors MUST be visible  
**And** the background MUST remain consistent across all screens

#### Scenario: Navigation accent color is applied

**Given** the user views the top navigation bar  
**When** a navigation link is in active state  
**Then** the active link background MUST use `#dadd56` (--accent)  
**And** the active link text color MUST use `#0f0f10` (--bg)  
**And** inactive link colors MUST use `#9396a3` (--text-secondary)

#### Scenario: Card panels use theme styling

**Given** any Phase 1 screen displays cards or panels  
**When** the cards are rendered  
**Then** card backgrounds MUST use `#1e1f23` (--panel)  
**And** card borders MUST use `rgba(255, 255, 255, 0.06)` (--border)  
**And** card shadows MUST use `0 4px 16px rgba(0, 0, 0, 0.4)` (--shadow)  
**And** no white or default card backgrounds MUST be visible

#### Scenario: Text colors follow theme hierarchy

**Given** any Phase 1 screen displays text content  
**When** the text is rendered  
**Then** primary text MUST use `#e8e9ed` (--text)  
**And** secondary text MUST use `#9396a3` (--text-secondary)  
**And** muted text MUST use `#6b6d7a` (--muted)  
**And** no black text on white background MUST be visible

#### Scenario: Status colors indicate data states

**Given** any screen displays profit/loss or trading indicators  
**When** positive values are shown  
**Then** positive indicators MUST use `#4ade80` (--success, green)  
**When** negative values are shown  
**Then** negative indicators MUST use `#ef4444` (--danger, red)  
**When** warning states are shown  
**Then** warning indicators MUST use `#fbbf24` (--warning, yellow)

---

### Requirement: Interactive elements SHALL display theme-compliant states

Interactive elements (buttons, links, table rows, tabs, filters) SHALL display visible hover and active states using Fintech Neon theme colors, transforms, and effects as specified in the design system.

#### Scenario: Primary buttons have hover states

**Given** a primary button is rendered with class `.button--primary`  
**When** the user hovers over the button  
**Then** the button background MUST change to `#e8eb7a` (--accent-light)  
**And** the button MUST apply `translateY(-2px)` transform  
**And** the button MUST show neon glow shadow effect  
**And** the transition MUST be smooth (250ms cubic-bezier)

#### Scenario: Table rows have hover effects

**Given** a table is rendered with class `.table`  
**When** the user hovers over a table row  
**Then** the row background MUST change to `#2b2d33` (--panel-hover)  
**And** the row MUST show subtle elevation or highlight  
**And** the cursor MUST change to `pointer` if row is clickable

#### Scenario: Navigation links have active states

**Given** navigation links are rendered in the app navigation  
**When** a link represents the current active page  
**Then** the link background MUST use `#dadd56` (--accent)  
**And** the link text MUST use `#0f0f10` (--bg) for contrast  
**And** the link MUST have `font-weight: 600` to indicate active state

---

### Requirement: Text elements SHALL follow Fintech Neon typography scale

Text elements (headings, body text, labels, captions) SHALL use the Fintech Neon typography scale CSS variables for sizing, weights, and line-heights to ensure visual consistency.

#### Scenario: Heading hierarchy uses correct font sizes

**Given** any Phase 1 screen contains headings  
**When** headings are rendered  
**Then** h1 elements MUST use `--text-4xl` (2.5rem / 40px)  
**And** h2 elements MUST use `--text-3xl` (2rem / 32px)  
**And** h3 elements MUST use `--text-2xl` (1.5rem / 24px)  
**And** all headings MUST have `font-weight: 700`  
**And** all headings MUST use `color: var(--text)`

#### Scenario: Body text uses base font size

**Given** any Phase 1 screen contains body text or paragraph content  
**When** the text is rendered  
**Then** body text MUST use `--text-base` (1rem / 16px)  
**And** line-height MUST be `1.5` for readability  
**And** font-family MUST be sans-serif (system font stack)

#### Scenario: Small text and labels use consistent sizing

**Given** any screen contains labels, captions, or metadata text  
**When** small text is rendered  
**Then** small text MUST use `--text-sm` (0.875rem / 14px)  
**And** extra small text MUST use `--text-xs` (0.75rem / 12px)  
**And** small text colors MUST use `var(--text-secondary)` or `var(--muted)`

---

### Requirement: Layouts SHALL use 8px-based spacing system

All Phase 1 screens SHALL use the 8px-based spacing system CSS variables (--gap-xs through --gap-2xl) for padding, margins, and gaps to maintain visual rhythm and consistency.

#### Scenario: Cards use standard padding

**Given** a card or panel component is rendered  
**When** the card displays content  
**Then** the card padding MUST use `1.5rem` (24px) on all sides  
**And** nested content MUST respect the spacing system  
**And** no arbitrary or non-system spacing values MUST be used

#### Scenario: Grid and flex gaps use theme tokens

**Given** a grid or flex container is rendered  
**When** child elements are arranged  
**Then** gaps between elements MUST use CSS variables:
  - `--gap-xs` (8px) for tight spacing
  - `--gap-sm` (12px) for compact layouts
  - `--gap-md` (16px) for standard spacing
  - `--gap-lg` (24px) for generous spacing
**And** no hardcoded pixel gap values outside the system MUST be used

---

### Requirement: Production builds SHALL include all CSS with consistent styling

The application SHALL render with identical Fintech Neon styling in both development (npm run dev) and production (npm run build) environments, with all CSS assets properly bundled and loaded without errors.

#### Scenario: Production build includes all CSS

**Given** the application is built for production using `npm run build`  
**When** the build process completes  
**Then** the `dist/assets/` directory MUST contain CSS bundle files  
**And** the CSS bundle MUST include all component styles  
**And** the HTML output MUST reference the CSS bundle correctly  
**And** no CSS files MUST be missing or return 404 errors

#### Scenario: Production preview renders styled UI

**Given** the production build exists in the `dist/` directory  
**When** the production preview is served using `npm run preview`  
**Then** all Phase 1 screens MUST render with full Fintech Neon styling  
**And** styling MUST be identical to the development build  
**And** no regressions or unstyled elements MUST appear

#### Scenario: CSS bundle size is optimized

**Given** the production build is created  
**When** CSS assets are generated  
**Then** the total CSS bundle size MUST be under 100KB  
**And** CSS MUST be properly minified (if minification enabled)  
**And** unused CSS SHOULD be tree-shaken (if PurgeCSS or similar is configured)

---

## MODIFIED Requirements

None. This is a new capability specification.

---

## REMOVED Requirements

None. This is a new capability specification.

---

## Related Capabilities

- **Phase 1 Trading UI**: Depends on proper CSS application for visual rendering
- **Component Library**: Shared components (Button, Card, Table, etc.) must render with theme styling
- **Navigation**: Active navigation states require theme accent colors

---

## Acceptance Criteria

To accept this specification as implemented, the following must be verified:

1. ✅ All Phase 1 component files import their corresponding CSS files
2. ✅ Theme variables are defined in a single location without duplication
3. ✅ All screens render with Fintech Neon color palette (navy backgrounds, neon accents)
4. ✅ Interactive elements show proper hover and active states
5. ✅ Typography follows the design system scale
6. ✅ Spacing uses the 8px-based system consistently
7. ✅ Production build includes all CSS and renders identically to dev build
8. ✅ No console errors related to CSS loading or application
9. ✅ Browser DevTools shows all CSS rules properly applied
10. ✅ Manual visual inspection confirms full theme compliance

---

## Testing Strategy

### Manual Testing

1. **Visual Regression**: Open each Phase 1 screen and compare against Fintech Neon spec screenshots
2. **Interactive Testing**: Hover over buttons, links, table rows to verify state changes
3. **DevTools Inspection**: Use browser inspector to verify computed styles match theme variables
4. **Build Testing**: Create production build and verify styling in preview mode

### Automated Testing (Future)

- Screenshot comparison tests using tools like Percy or Chromatic
- CSS validation linting with stylelint to enforce theme variable usage
- Build smoke tests to ensure CSS assets are generated

---

## Migration Notes

### From Previous State

Before this change:
- Component CSS files existed but were not imported
- Multiple CSS files defined duplicate theme variables
- Styling did not render, resulting in unstyled HTML

After this change:
- Each component imports its own CSS file
- Single source of truth for theme variables
- Full Fintech Neon theme styling applied correctly

### Backward Compatibility

This change does not affect:
- Component functionality or logic
- Data structures or APIs
- User workflows or interactions

This change only fixes CSS application; all existing functionality remains unchanged.

---

## References

- **Theme Documentation**: `docs/FINTECH_NEON_THEME.md` - Complete Fintech Neon design system specification
- **Phase 1 Screens**: Dashboard, Watchlist, Portfolio, Signals components
- **CSS Files**: Component-specific stylesheets in `src/features/*/​*.css`
