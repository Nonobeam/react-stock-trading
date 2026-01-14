# Tasks: add-reusable-icon-button-component

## Implementation Tasks

### 1. Create IconButton Component
- [x] Create `src/shared/components/IconButton.tsx`
  - Define `IconButtonProps` interface with required `ariaLabel`
  - Implement component with variant, size, disabled, loading props
  - Add proper className composition
  - Handle keyboard events (Enter/Space)
- [x] Create `src/shared/components/IconButton.css`
  - Base styles (flexbox centering, cursor, transition)
  - Size modifiers (small: 24px, medium: 32px, large: 40px)
  - Variant styles (primary, secondary, ghost, danger)
  - State styles (hover, active, focus, disabled, loading)
  - Loading spinner animation

### 2. Export Component
- [x] Update `src/shared/components/index.ts`
  - Add IconButton export

### 3. Migrate WatchlistPanel
- [x] Update `src/features/dashboard/components/WatchlistPanel/WatchlistPanel.tsx`
  - Import IconButton from shared components
  - Replace inline `<button className="watchlist-panel__add-btn">` with `<IconButton>`
  - Pass appropriate props (icon, ariaLabel, disabled, onClick)
- [x] Update `src/features/dashboard/components/WatchlistPanel/WatchlistPanel.css`
  - Remove `.watchlist-panel__add-btn` styles (no longer needed)

### 4. Validation
- [x] Run `npm run build` to verify no TypeScript errors
- [x] Verify button appearance matches existing WatchlistPanel style
- [x] Test keyboard navigation (Tab to focus, Enter/Space to activate)
- [x] Test disabled state when watchlist is full

## Verification Checklist

- [x] IconButton renders with all variants (primary, secondary, ghost, danger)
- [x] IconButton renders at all sizes (small, medium, large)
- [x] Focus state shows accent ring
- [x] Hover states include proper glow effects
- [x] Disabled state prevents interaction
- [x] WatchlistPanel add button works identically to before
- [x] Build passes with no errors

