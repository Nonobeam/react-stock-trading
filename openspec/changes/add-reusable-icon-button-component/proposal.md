# Proposal: add-reusable-icon-button-component

## Summary

Create a reusable `IconButton` component in `src/shared/components/` for icon-only actions like add (+), remove (×), edit, refresh, and other icon-based interactions across the application.

## Why

Currently, icon buttons like the "add" button in WatchlistPanel are implemented inline with component-specific CSS (`.watchlist-panel__add-btn`). This pattern:

1. **Duplicates code** — Each feature reimplements the same button styling
2. **Inconsistent UX** — Different features may style icon buttons differently
3. **Harder maintenance** — Theme updates require touching multiple files
4. **Not accessible** — Missing consistent ARIA patterns and keyboard handling

A shared `IconButton` component will provide consistent styling, accessibility, and reduce code duplication as more features need icon-based actions.

## Scope

- Create `IconButton` component with multiple variants (primary, secondary, ghost, danger)
- Support common sizes (small, medium, large)
- Include proper accessibility attributes (aria-label, focus states)
- Follow FINTECH_NEON_THEME.md design tokens exactly
- Migrate WatchlistPanel's add button to use the new component

## Out of Scope

- Full icon library integration (uses string/ReactNode for icon content)
- Complex button groups or dropdown buttons
- Animation beyond theme-defined transitions

## Dependencies

- None (standalone component)

## Risks

- Low: Simple component with no external dependencies

