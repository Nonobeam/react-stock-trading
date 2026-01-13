# Fintech Neon Theme - Design System

**Theme Name:** Fintech Neon  
**Implementation Date:** January 12, 2026  
**Status:** ✅ Active  
**Design Philosophy:** Premium, minimal, data-focused with neon accents

## Design Principles

### 1. Premium & Professional
- Deep charcoal-to-black background reduces eye strain
- Neon yellow-green accent provides energy without harshness
- Soft glows and elevation create depth without clutter
- Clean, modern sans-serif typography

### 2. Minimal & Data-Focused
- No harsh borders — rely on soft contrast and shadows
- Generous padding and breathing space
- Strong visual hierarchy through size and opacity
- Typography clarity over decoration

### 3. Calm & Focused
- Smooth transitions (200-350ms)
- Subtle hover effects with glow
- No flashy animations
- Professional interaction patterns

## Color Palette

### Core Colors

| Variable | Hex | Usage |
|----------|-----|-------|
| `--bg` | `#0f0f10` | Main background, deepest layer |
| `--bg-secondary` | `#1a1a1c` | Secondary background for depth |
| `--panel` | `#1e1f23` | Cards, panels, primary surfaces |
| `--accent` | `#dadd56` | Neon yellow-green - primary actions, highlights |
| `--text` | `#e8e9ed` | Primary text, off-white |
| `--text-secondary` | `#9396a3` | Secondary text, muted |
| `--muted` | `#6b6d7a` | Disabled states, subtle elements |

### Elevation & States

| Variable | Hex | Usage |
|----------|-----|-------|
| `--panel-elevated` | `#25262b` | Elevated surfaces, nested cards |
| `--panel-hover` | `#2b2d33` | Hover states for panels |
| `--accent-dark` | `#c4c748` | Pressed/active button states |
| `--accent-light` | `#e8eb7a` | Highlights, hover states |
| `--accent-muted` | `rgba(218, 221, 86, 0.15)` | Subtle accent backgrounds |

### Borders & Separators

| Variable | Value | Usage |
|----------|-------|-------|
| `--border` | `rgba(255, 255, 255, 0.06)` | Subtle borders |
| `--border-light` | `rgba(255, 255, 255, 0.1)` | More visible borders |

### Status Colors

| Variable | Hex | Usage |
|----------|-----|-------|
| `--success` | `#4ade80` | Profit, buy orders, positive |
| `--warning` | `#fbbf24` | Warnings, pending |
| `--danger` | `#ef4444` | Loss, sell orders, errors |
| `--info` | `#3b82f6` | Informational |

## Design Tokens

### Border Radius
```css
--radius-sm: 8px;    /* Small elements */
--radius: 16px;      /* Standard (buttons, inputs) */
--radius-lg: 20px;   /* Large cards */
--radius-xl: 24px;   /* Extra large panels */
```

### Spacing System (8px base)
```css
--gap-xs: 8px;
--gap-sm: 12px;
--gap-md: 16px;      /* Default */
--gap-lg: 24px;
--gap-xl: 32px;
--gap-2xl: 48px;
```

### Shadows & Elevation
```css
/* Standard shadows */
--shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.3);
--shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
--shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.5);
--shadow-xl: 0 16px 48px rgba(0, 0, 0, 0.6);

/* Inner depth */
--shadow-inner: inset 0 2px 4px rgba(0, 0, 0, 0.3);

/* Neon glow effects */
--glow-accent: 0 0 20px rgba(218, 221, 86, 0.3),
               0 0 40px rgba(218, 221, 86, 0.15);
--glow-accent-strong: 0 0 30px rgba(218, 221, 86, 0.5),
                      0 0 60px rgba(218, 221, 86, 0.25);
```

### Glass Effect (Modals/Overlays)
```css
--glass-bg: rgba(30, 31, 35, 0.7);
--glass-border: rgba(255, 255, 255, 0.08);
--glass-blur: blur(12px);
```

### Transitions
```css
--transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
--transition: 250ms cubic-bezier(0.4, 0, 0.2, 1);
--transition-slow: 350ms cubic-bezier(0.4, 0, 0.2, 1);
```

### Typography Scale
```css
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 2rem;      /* 32px */
--text-4xl: 2.5rem;    /* 40px */
```

## Component Patterns

### Buttons

**Primary Button (CTA)**
```css
background: var(--accent);
color: var(--bg);
border-radius: var(--radius);
padding: 0.75rem 1.5rem;
font-weight: 600;
box-shadow: var(--shadow-sm);

/* Hover */
hover: {
  background: var(--accent-light);
  transform: translateY(-2px);
  box-shadow: var(--glow-accent);
}
```

**Secondary Button**
```css
background: var(--panel-elevated);
color: var(--text);
border: 1px solid var(--border-light);

/* Hover */
hover: {
  background: var(--panel-hover);
  border-color: var(--accent);
  box-shadow: var(--shadow);
}
```

### Cards & Panels

**Standard Card**
```css
background: var(--panel);
border-radius: var(--radius-lg);
padding: 1.5rem;
box-shadow: var(--shadow);
border: 1px solid var(--border);

/* Hover */
hover: {
  background: var(--panel-elevated);
  border-color: var(--accent-muted);
  transform: translateY(-2px);
}
```

**Elevated/Nested Card**
```css
background: var(--panel-elevated);
border-radius: var(--radius);
padding: 1rem;
box-shadow: var(--shadow-inner);
```

### Inputs

```css
background: var(--panel);
color: var(--text);
border: 1px solid var(--border);
border-radius: var(--radius);
padding: 0.75rem 1rem;

/* Focus */
focus: {
  border-color: var(--accent);
  background: var(--panel-elevated);
  box-shadow: 0 0 0 3px var(--accent-muted),
              var(--glow-accent);
}

/* Placeholder */
placeholder: {
  color: var(--text-secondary);
  opacity: 0.6;
}
```

### Typography

**Financial Numbers**
```css
.number-display {
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.03em;
  font-weight: 700;
  font-size: var(--text-3xl);
}
```

**Headings**
```css
h1 { 
  font-size: var(--text-4xl); 
  font-weight: 700;
  letter-spacing: -0.02em;
}
```

**Hierarchy Through Opacity**
```css
/* Primary text */
color: var(--text);
opacity: 1;

/* Secondary text */
color: var(--text-secondary);
opacity: 0.8;

/* Muted text */
color: var(--muted);
opacity: 0.6;
```

### Charts & Data Visualization

```css
/* Line charts with glow */
stroke: var(--accent);
filter: drop-shadow(var(--glow-accent));

/* Grid lines */
stroke: var(--border);
stroke-dasharray: 4 4;
opacity: 0.3;

/* Tooltips */
background: var(--glass-bg);
backdrop-filter: var(--glass-blur);
border: 1px solid var(--glass-border);
border-radius: var(--radius);
```

## Layout Guidelines

### Card-Based Layout
- Main content: Large charts and analytics (60-70% width)
- Side panel: Action area (buy/sell, inputs) (~30% width)
- Use generous padding: `--gap-xl` between major sections
- Clear visual hierarchy through size, not color

### Spacing Consistency
```
Inner padding: 16px-32px
Section gaps: 24px-48px
Component gaps: 16px
Tight groupings: 8px-12px
```

### Navigation
- Top bar: Small, spaced items
- Clean separation with subtle borders
- Active state: accent color + glow

## Interaction Patterns

### Hover States
```css
transition: all var(--transition);
transform: translateY(-2px);
box-shadow: var(--glow-accent);
```

### Active/Pressed States
```css
transform: translateY(0);
box-shadow: var(--shadow-sm);
background: var(--accent-dark);
```

### Focus States
```css
outline: none;
box-shadow: 0 0 0 3px var(--accent-muted);
border-color: var(--accent);
```

## Accessibility

### Contrast Ratios
- **Text on background**: `#e8e9ed` on `#0f0f10` = **15.2:1** (WCAG AAA)
- **Accent on panel**: `#dadd56` on `#1e1f23` = **11.5:1** (WCAG AAA)
- **Secondary text**: `#9396a3` on `#0f0f10` = **6.8:1** (WCAG AA+)

### Visual Hierarchy
1. Size and weight for importance
2. Opacity for secondary elements
3. Color for status/sentiment only
4. Glow for interactive elements

## Browser Support

- ✅ CSS Custom Properties
- ✅ Backdrop filters (glass effect)
- ✅ Drop shadows (glow effects)
- ✅ CSS Grid & Flexbox
- ✅ Smooth transitions

## Implementation Notes

### File Structure
```
src/
├── index.css              # Theme variables & base styles
├── shared/components/     # Themed components
└── features/             # Feature-specific styles
```

### Migration from Previous Theme
All components automatically inherit new theme through CSS variables. No component-level changes required.

### Performance
- Transitions: GPU-accelerated transforms
- Shadows: Optimized blur radii
- Minimal repaints through opacity changes

---

**Last Updated:** January 12, 2026  
**Maintained By:** GST Development Team  
**Design Reference:** Modern fintech/trading platforms (Robinhood, Coinbase, etc.)
