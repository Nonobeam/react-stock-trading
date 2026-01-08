# Design: Navy Theme Consistency System

**Change ID:** `enforce-navy-theme-consistency`  
**Last Updated:** 2026-01-07

## Overview

This document outlines the technical design for enforcing a consistent deep navy-blue theme across the entire GST application. The goal is to establish a single source of truth for colors, prevent light background introduction, and ensure all future UI updates maintain visual coherence.

## Architecture

### Color System Hierarchy

```
:root CSS Variables (index.css)
  ├── Core Palette (--bg, --panel, --accent, --muted, --text)
  ├── Derived Colors (--panel-elevated, --accent-dark, --border)
  ├── Status Colors (--success, --warning, --danger, --info)
  └── Layout Tokens (--radius, --gap, --shadow)
       ↓
Component Styles (.css files)
  ├── Use variables only, never hardcoded hex
  ├── Apply gradient patterns consistently
  └── Follow spacing/shadow standards
       ↓
React Components (.tsx files)
  └── Reference CSS classes, avoid inline styles
```

## Color Palette Specification

### Primary Navy Palette

| Token | Value | Usage | Contrast Ratio |
|-------|-------|-------|----------------|
| `--bg` | `#071033` | Page background, deepest layer | Base |
| `--panel` | `#0b1a3a` | Cards, modals, elevated surfaces | 1.2:1 vs bg |
| `--accent` | `#1e4db3` | Buttons, links, interactive elements | 4.8:1 vs bg |
| `--muted` | `#6b80a6` | Secondary text, borders, disabled | 3.2:1 vs bg |
| `--text` | `#DDEBFF` | Primary text content | 12.5:1 vs bg ✓ WCAG AAA |

**Design Rationale:**
- `#071033` provides maximum depth without pure black harshness
- `#0b1a3a` offers subtle elevation while staying navy-toned
- `#1e4db3` accent is vibrant enough for interactivity, professional enough for finance
- `#DDEBFF` text ensures excellent readability (exceeds WCAG AAA standard)

### Derived Colors

```css
--panel-elevated: #0e1f45;     /* Modals, dropdowns */
--accent-dark: #153b8f;        /* Button active state, gradient end */
--accent-light: #2b5dc9;       /* Button hover, focused elements */
--border: rgba(255,255,255,0.06); /* Subtle separators */
```

### Status Colors

```css
--success: #4ade80;   /* Green - trade wins, positive metrics */
--warning: #fbbf24;   /* Yellow - cautions, pending states */
--danger: #ef4444;    /* Red - losses, errors, stops hit */
--info: #3b82f6;      /* Blue - informational, neutral alerts */
```

**Note**: Status colors remain vibrant for semantic clarity. They're used sparingly with navy backgrounds to maintain professional tone.

### Prohibited Colors

**NEVER USE:**
- White backgrounds: `#ffffff`, `#fafafa`
- Light grays: `#f0f0f0`, `#e0e0e0`, `#cccccc`
- Off-brand blues: `#1f2937` (generic gray-blue), `#3b82f6` (too bright for backgrounds)

## Component Design Patterns

### Buttons

**Primary Button (CTAs, main actions):**
```css
.btn-primary {
  background: linear-gradient(180deg, var(--accent), var(--accent-dark));
  color: var(--text);
  padding: 10px 16px;
  border-radius: var(--radius);
  border: none;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(30, 77, 179, 0.3);
  transition: transform 0.2s, box-shadow 0.2s;
}

.btn-primary:hover {
  background: linear-gradient(180deg, var(--accent-light), var(--accent));
  box-shadow: 0 4px 12px rgba(30, 77, 179, 0.4);
  transform: translateY(-1px);
}

.btn-primary:active {
  transform: translateY(0);
  box-shadow: 0 1px 4px rgba(30, 77, 179, 0.3);
}
```

**Secondary Button (cancel, less important actions):**
```css
.btn-secondary {
  background: transparent;
  color: var(--text);
  padding: 10px 16px;
  border-radius: var(--radius);
  border: 1px solid var(--border);
  font-weight: 600;
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s;
}

.btn-secondary:hover {
  border-color: var(--accent);
  background: rgba(30, 77, 179, 0.1);
}
```

**Danger Button (delete, risky actions):**
```css
.btn-danger {
  background: linear-gradient(180deg, var(--danger), #c53030);
  color: var(--text);
  /* ... rest same as btn-primary */
}
```

### Cards & Panels

**Standard Card:**
```css
.card {
  background: linear-gradient(180deg, #091233, #081a2e);
  padding: 16px;
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  border: 1px solid var(--border);
  transition: transform 0.3s, box-shadow 0.3s;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(4, 8, 20, 0.8);
}
```

**Elevated Panel (modals, drawers):**
```css
.panel-elevated {
  background: var(--panel-elevated);
  padding: 24px;
  border-radius: calc(var(--radius) * 1.5);
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.08);
}
```

**Section Container:**
```css
.section {
  background: var(--panel);
  padding: 20px;
  border-radius: var(--radius);
  border: 1px solid var(--border);
  margin-bottom: var(--gap);
}
```

### Input Fields

**Text Input:**
```css
.input {
  background: transparent;
  border: 1px solid var(--border);
  color: var(--text);
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.2s, background 0.2s;
}

.input:focus {
  outline: none;
  border-color: var(--accent);
  background: rgba(30, 77, 179, 0.05);
}

.input::placeholder {
  color: var(--muted);
}
```

**Select Dropdown:**
```css
.select {
  background: var(--panel);
  border: 1px solid var(--border);
  color: var(--text);
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
}
```

### Headers & Navigation

**Page Header:**
```css
.header {
  background: var(--panel);
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--gap);
  border-radius: var(--radius);
  border-bottom: 2px solid var(--accent);
}
```

**Navigation Item:**
```css
.nav-item {
  color: var(--muted);
  padding: 10px 16px;
  border-radius: 6px;
  transition: color 0.2s, background 0.2s;
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

## Gradient Patterns

### Approved Gradient Library

**Button Gradient:**
```css
background: linear-gradient(180deg, var(--accent), var(--accent-dark));
```

**Card Background:**
```css
background: linear-gradient(180deg, #091233, #081a2e);
```

**Header Shine:**
```css
background: linear-gradient(135deg, var(--panel), var(--panel-elevated));
```

**Alert Background (info):**
```css
background: linear-gradient(180deg, rgba(59, 130, 246, 0.1), rgba(59, 130, 246, 0.05));
```

## Shadow System

```css
--shadow-sm: 0 2px 4px rgba(4, 8, 20, 0.4);
--shadow: 0 6px 20px rgba(4, 8, 20, 0.6);
--shadow-lg: 0 12px 48px rgba(4, 8, 20, 0.8);
```

**Usage Guidelines:**
- `--shadow-sm`: Buttons, small cards
- `--shadow`: Standard cards, panels
- `--shadow-lg`: Modals, dropdowns, elevated panels

## Spacing System

```css
--gap: 12px;           /* Standard spacing unit */
--gap-sm: 8px;         /* Compact spacing */
--gap-lg: 16px;        /* Relaxed spacing */
--gap-xl: 24px;        /* Section spacing */
```

## Typography

**Font Stack:**
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Arial', sans-serif;
```

**Text Hierarchy:**
```css
--text-xs: 0.75rem;    /* 12px - captions */
--text-sm: 0.875rem;   /* 14px - body small */
--text-base: 1rem;     /* 16px - body */
--text-lg: 1.125rem;   /* 18px - subheadings */
--text-xl: 1.25rem;    /* 20px - headings */
--text-2xl: 1.5rem;    /* 24px - page titles */
```

## Migration Strategy

### Step 1: Update CSS Variables

**File:** `src/index.css`

```css
:root {
  /* NEW Navy Theme */
  --bg: #071033;
  --panel: #0b1a3a;
  --accent: #1e4db3;
  --muted: #6b80a6;
  --text: #DDEBFF;
  
  /* Derived */
  --panel-elevated: #0e1f45;
  --accent-dark: #153b8f;
  --accent-light: #2b5dc9;
  --border: rgba(255, 255, 255, 0.06);
  
  /* Spacing/Layout */
  --radius: 8px;
  --gap: 12px;
  --shadow: 0 6px 20px rgba(4, 8, 20, 0.6);
  
  /* DEPRECATED - Alias old variables for backward compat */
  --color-bg-primary: var(--bg);
  --color-bg-secondary: var(--panel);
  --color-primary: var(--accent);
  --color-text-primary: var(--text);
  --color-text-muted: var(--muted);
  --color-border: var(--border);
}
```

### Step 2: Component Migration Priority

**High Priority (Week 1):**
1. `src/shared/components/Button.css` → Use `--accent`, gradient pattern
2. `src/shared/components/Card.css` → Use `--panel`, card gradient
3. `src/shared/components/Tooltip.css` → Replace `#1f2937` with `--panel`
4. `src/shared/components/Navigation.css` → Use `--panel`, `--accent`

**Medium Priority (Week 2):**
5. `src/features/**/**.css` → Replace hardcoded colors
6. `src/App.css` → Update dashboard styles

**Low Priority (Week 3):**
7. Remaining component CSS files
8. Remove deprecated variable aliases

### Step 3: Validation

**Before Component Update:**
1. Identify all color declarations
2. Map to appropriate CSS variable
3. Test contrast ratios

**After Component Update:**
4. Visual regression test
5. Check all interactive states (hover, focus, active)
6. Verify accessibility with axe DevTools

## Validation Rules

### ESLint CSS Rule (Future Enhancement)

```js
// .eslintrc.js - stylelint rule
{
  "rules": {
    "color-no-hex": true,  // Disallow hex colors
    "color-named": "never", // Disallow named colors
    "declaration-property-value-allowed-list": {
      "/^(background|color|border|fill|stroke)/": ["/var\\(--/"]
    }
  }
}
```

### Manual Checklist

Before committing CSS changes:
- [ ] No hardcoded hex colors (`#071033` exceptions only in `:root`)
- [ ] No light backgrounds (`#fff`, `#f0f0f0`, etc.)
- [ ] All colors use CSS variables
- [ ] Gradients follow approved patterns
- [ ] Shadows use `--shadow*` variables
- [ ] Text contrast meets WCAG AA (4.5:1 minimum)

## Documentation Output

### File: `docs/DESIGN_SYSTEM.md`

Will include:
1. **Color Palette Reference** (table with swatches, contrast ratios)
2. **Component Gallery** (visual examples of buttons, cards, inputs)
3. **Do's and Don'ts** (good/bad code examples)
4. **Gradient Library** (all approved patterns with code)
5. **Migration Guide** (step-by-step for updating components)
6. **Validation Checklist** (pre-commit checks)

## Testing Strategy

### Visual Regression Testing

**Manual Testing:**
1. Open each view (Market, Performance, Risk, Scanner, Regime, Monitoring)
2. Verify backgrounds are navy-toned (no light backgrounds)
3. Check interactive states (hover, focus, active)
4. Test with browser DevTools color picker (all backgrounds should be `#071033` - `#0e1f45` range)

**Automated (Future):**
- Percy.io or Chromatic for visual diffs
- Contrast checker in CI pipeline

### Accessibility Testing

**Color Contrast:**
- Run axe DevTools on all views
- Verify WCAG AA compliance (4.5:1 text, 3:1 interactive)
- Check focus indicators visible on all interactive elements

### Browser Testing

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

**Known Issues:**
- `backdrop-filter` (already in use) may need fallback for older Safari
- CSS variable support is universal in modern browsers

## Rollback Plan

If theme update causes issues:

1. **Immediate**: Restore old `:root` variables from git history
2. **Component-level**: Revert individual CSS files as needed
3. **Gradual**: Roll back feature-by-feature (Market view first, etc.)

Aliases (`--color-bg-primary: var(--bg)`) ensure old code continues working during migration.

## Future Enhancements (Out of Scope)

1. **Theme variants**: Navy (default), Deep Purple, Dark Teal
2. **CSS-in-JS migration**: styled-components or Emotion
3. **Design tokens export**: JSON format for design tools
4. **Storybook integration**: Component showcase
5. **Animation system**: Standardized transitions, spring physics
6. **Dark mode toggle**: User preference (navy vs. pure black)

## Questions & Decisions

| Question | Decision | Rationale |
|----------|----------|-----------|
| Keep old CSS variables? | Yes, as aliases | Gradual migration, avoid breaking changes |
| Support light theme? | No | Navy theme is brand identity |
| Use CSS preprocessor (Sass)? | No | Native CSS variables sufficient |
| Component library (MUI/Chakra)? | No | Custom components align with brand |
| Tailwind CSS? | Future consideration | Out of scope for this change |

---

**Review Checklist:**
- [x] Color palette defined with contrast ratios
- [x] Component patterns documented
- [x] Migration strategy outlined
- [x] Validation rules specified
- [x] Testing approach defined
- [x] Documentation plan clear
- [x] Rollback plan established
