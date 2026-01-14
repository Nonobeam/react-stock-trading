# Design: add-reusable-icon-button-component

## Overview

A compact, accessible icon-only button component following the FINTECH_NEON_THEME design system. Used for add, remove, edit, close, and similar icon-based actions.

## Component API

```tsx
interface IconButtonProps {
  /** Icon content - string (e.g., '+', '×') or ReactNode */
  icon: React.ReactNode;
  
  /** Click handler */
  onClick?: () => void;
  
  /** Visual variant */
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  
  /** Button size */
  size?: 'small' | 'medium' | 'large';
  
  /** Disabled state */
  disabled?: boolean;
  
  /** Loading state */
  loading?: boolean;
  
  /** Required for accessibility */
  ariaLabel: string;
  
  /** Optional tooltip text (defaults to ariaLabel) */
  title?: string;
  
  /** Additional CSS class */
  className?: string;
  
  /** Button type */
  type?: 'button' | 'submit' | 'reset';
}
```

## Visual Specifications

### Sizes (following 8px spacing grid)

| Size | Dimensions | Font Size | Border Radius |
|------|------------|-----------|---------------|
| small | 24×24px | 14px | var(--radius-sm) |
| medium | 32×32px | 18px | var(--radius) |
| large | 40×40px | 22px | var(--radius) |

### Variants

**Primary (default)**
- Background: `var(--accent)` (#dadd56)
- Color: `var(--bg)` (#0f0f10)
- Hover: `var(--accent-light)` + scale(1.05) + glow
- Active: `var(--accent-dark)` + scale(1)

**Secondary**
- Background: `var(--panel-elevated)` (#25262b)
- Color: `var(--text)` (#e8e9ed)
- Border: 1px solid `var(--border)`
- Hover: `var(--panel-hover)` + border-color: `var(--accent)`

**Ghost**
- Background: transparent
- Color: `var(--text-secondary)`
- Hover: `var(--panel-hover)` + color: `var(--text)`

**Danger**
- Background: `var(--danger)` (#ef4444)
- Color: `var(--text)` (#e8e9ed)
- Hover: brightness(1.1) + red glow

### States

**Disabled**
- Opacity: 0.5
- Cursor: not-allowed
- No hover effects

**Loading**
- Show spinner replacing icon
- Disabled behavior

**Focus**
- box-shadow: 0 0 0 3px var(--accent-muted)
- outline: none

## File Structure

```
src/shared/components/
├── IconButton.tsx
├── IconButton.css
└── index.ts (add export)
```

## Accessibility

- Requires `ariaLabel` prop (enforced via TypeScript)
- Focus visible state with accent ring
- Keyboard accessible (Enter/Space triggers click)
- `title` attribute for tooltip on hover

## Usage Examples

```tsx
// Add button (primary)
<IconButton
  icon="+"
  ariaLabel="Add symbol to watchlist"
  onClick={handleAdd}
/>

// Close button (ghost)
<IconButton
  icon="×"
  variant="ghost"
  size="small"
  ariaLabel="Close modal"
  onClick={handleClose}
/>

// Delete button (danger)
<IconButton
  icon="🗑"
  variant="danger"
  ariaLabel="Delete item"
  onClick={handleDelete}
/>

// With ReactNode icon
<IconButton
  icon={<RefreshIcon />}
  variant="secondary"
  ariaLabel="Refresh data"
  onClick={handleRefresh}
/>
```

## Migration Path

1. Create IconButton component
2. Update WatchlistPanel to use IconButton instead of inline button
3. Document component in shared components index

## Theme Compliance

All values use CSS custom properties from FINTECH_NEON_THEME.md:
- Colors: `--accent`, `--panel`, `--text`, `--danger`
- Spacing: `--gap-xs`, `--gap-sm`
- Borders: `--border`, `--radius`, `--radius-sm`
- Effects: `--transition`, `--glow-accent`, `--shadow-sm`
- Focus: `--accent-muted` for focus ring

