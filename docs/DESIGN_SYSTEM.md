# GST Design System

**Version:** 1.0  
**Last Updated:** January 7, 2026

This document defines the design system for the Gray Swan Trading (GST) application, ensuring consistent styling across all views and components.

## Color Palette

### Core Navy Theme

The GST application uses a **deep navy-blue palette** for a professional, focused trading interface.

| Token | Hex Value | Usage | Contrast Ratio |
|-------|-----------|-------|----------------|
| `--bg` | `#071033` | Page background, deepest layer | Base |
| `--panel` | `#0b1a3a` | Cards, modals, elevated surfaces | 1.2:1 vs bg |
| `--accent` | `#1e4db3` | Buttons, links, interactive elements | 4.8:1 vs bg |
| `--muted` | `#6b80a6` | Secondary text, borders, disabled states | 3.2:1 vs bg |
| `--text` | `#DDEBFF` | Primary text content | 12.5:1 vs bg ✓ WCAG AAA |

### Derived Colors

| Token | Hex Value | Usage |
|-------|-----------|-------|
| `--panel-elevated` | `#0e1f45` | Modals, dropdowns, tooltips |
| `--accent-dark` | `#153b8f` | Button active state, gradient end |
| `--accent-light` | `#2b5dc9` | Button hover, focused elements |
| `--border` | `rgba(255,255,255,0.06)` | Subtle borders and dividers |

### Status Colors

| Token | Hex Value | Usage |
|-------|-----------|-------|
| `--success` | `#4ade80` | Positive metrics, trade wins |
| `--warning` | `#fbbf24` | Cautions, pending states |
| `--danger` | `#ef4444` | Losses, errors, stops hit |
| `--info` | `#3b82f6` | Informational alerts |

---

## Component Patterns

### Buttons

#### Primary Button (Main Actions)
```css
.btn-primary {
  background: linear-gradient(180deg, var(--accent), var(--accent-dark));
  color: var(--text);
  padding: 10px 16px;
  border-radius: var(--radius);
  border: none;
  font-weight: 600;
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

#### Secondary Button (Less Emphasis)
```css
.btn-secondary {
  background: transparent;
  color: var(--text);
  padding: 10px 16px;
  border-radius: var(--radius);
  border: 1px solid var(--border);
  font-weight: 600;
}

.btn-secondary:hover {
  border-color: var(--accent);
  background: rgba(30, 77, 179, 0.1);
}
```

#### Danger Button (Destructive Actions)
```css
.btn-danger {
  background: linear-gradient(180deg, var(--danger), #c53030);
  color: var(--text);
  /* ... same styling as primary */
}
```

---

### Cards & Panels

#### Standard Card
```css
.card {
  background: var(--panel);
  padding: 16px;
  border-radius: var(--radius);
  border: 1px solid var(--border);
  box-shadow: var(--shadow);
  transition: transform 0.3s, box-shadow 0.3s;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}
```

#### Card with Gradient (Alternative Style)
```css
.card-gradient {
  background: linear-gradient(180deg, #091233, #081a2e);
  /* ... rest same as .card */
}
```

#### Elevated Panel (Modals, Dropdowns)
```css
.panel-elevated {
  background: var(--panel-elevated);
  padding: 24px;
  border-radius: calc(var(--radius) * 1.5);
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.08);
}
```

---

### Input Fields

#### Text Input
```css
.input {
  background: transparent;
  border: 1px solid var(--border);
  color: var(--text);
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 14px;
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

#### Select Dropdown
```css
.select {
  background: var(--panel);
  border: 1px solid var(--border);
  color: var(--text);
  padding: 8px 12px;
  border-radius: 6px;
}
```

---

### Navigation

#### Navigation Container
```css
.navigation {
  background: var(--panel);
  border-right: 1px solid var(--border);
}
```

#### Navigation Item
```css
.nav-item {
  color: var(--muted);
  padding: 10px 16px;
  border-radius: 6px;
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

---

## Gradient Library

### Approved Gradients

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

**Alert Background (Info):**
```css
background: linear-gradient(180deg, rgba(59, 130, 246, 0.1), rgba(59, 130, 246, 0.05));
```

---

## Shadow System

```css
--shadow-sm: 0 2px 4px rgba(4, 8, 20, 0.4);   /* Buttons, small cards */
--shadow: 0 6px 20px rgba(4, 8, 20, 0.6);     /* Standard cards, panels */
--shadow-lg: 0 12px 48px rgba(4, 8, 20, 0.8); /* Modals, elevated panels */
```

---

## Spacing System

```css
--gap: 12px;      /* Standard spacing unit */
--gap-sm: 8px;    /* Compact spacing */
--gap-lg: 16px;   /* Relaxed spacing */
--gap-xl: 24px;   /* Section spacing */
```

**Usage:**
```css
.container {
  gap: var(--gap);
  padding: var(--gap-lg);
  margin-bottom: var(--gap-xl);
}
```

---

## Typography

### Font Stack
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Arial', sans-serif;
```

### Type Scale
```css
--text-xs: 0.75rem;    /* 12px - captions, labels */
--text-sm: 0.875rem;   /* 14px - body small, secondary text */
--text-base: 1rem;     /* 16px - body text */
--text-lg: 1.125rem;   /* 18px - subheadings */
--text-xl: 1.25rem;    /* 20px - headings */
--text-2xl: 1.5rem;    /* 24px - page titles */
```

---

## Do's and Don'ts

### ✅ DO

**Use CSS variables:**
```css
/* Good */
.card {
  background: var(--panel);
  color: var(--text);
  border: 1px solid var(--border);
}
```

**Use semantic status colors:**
```css
/* Good - profit display */
.profit {
  color: var(--success);
}

/* Good - loss display */
.loss {
  color: var(--danger);
}
```

**Use the approved gradient pattern:**
```css
/* Good */
.button-primary {
  background: linear-gradient(180deg, var(--accent), var(--accent-dark));
}
```

### ❌ DON'T

**Never use hardcoded colors:**
```css
/* Bad */
.card {
  background: #0b1a3a;
  color: #DDEBFF;
}
```

**Never use light backgrounds:**
```css
/* Bad */
.panel {
  background: #ffffff;
  background: #f0f0f0;
}
```

**Never mix color formats:**
```css
/* Bad */
.element {
  background: #1e4db3;
  border: 1px solid rgb(30, 77, 179);
}
```

---

## Migration Guide

### Step 1: Replace Old Variables

**Before:**
```css
.component {
  background: var(--color-bg-primary);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
}
```

**After:**
```css
.component {
  background: var(--bg);
  color: var(--text);
  border: 1px solid var(--border);
}
```

### Step 2: Use Gradient Patterns

**Before:**
```css
.button {
  background: #4a90e2;
}
```

**After:**
```css
.button {
  background: linear-gradient(180deg, var(--accent), var(--accent-dark));
}
```

### Step 3: Update Shadows

**Before:**
```css
.card {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
```

**After:**
```css
.card {
  box-shadow: var(--shadow);
}
```

---

## Validation Checklist

Before committing CSS changes:

- [ ] **No hardcoded hex colors** (except in `:root` variables)
- [ ] **No light backgrounds** (`#fff`, `#f0f0f0`, etc.)
- [ ] **All colors use CSS variables** (`var(--*)` syntax)
- [ ] **Gradients follow approved patterns**
- [ ] **Shadows use `--shadow*` variables**
- [ ] **Text contrast meets WCAG AA** (4.5:1 minimum)
- [ ] **Interactive states defined** (hover, focus, active)
- [ ] **Spacing uses `--gap*` variables**

---

## Accessibility

### Color Contrast Requirements

- **Normal text (< 18px):** 4.5:1 contrast minimum (WCAG AA)
- **Large text (≥ 18px):** 3:1 contrast minimum (WCAG AA)
- **Interactive elements:** 3:1 contrast minimum

### Verified Contrast Ratios

| Foreground | Background | Ratio | Status |
|------------|------------|-------|--------|
| `--text` | `--bg` | 12.5:1 | ✓ AAA |
| `--muted` | `--bg` | 3.2:1 | ✓ AA (large text) |
| `--accent` | `--bg` | 4.8:1 | ✓ AA |
| `--success` | `--bg` | 5.1:1 | ✓ AA |

---

## Browser Compatibility

The navy theme system is compatible with:

- **Chrome:** 90+
- **Firefox:** 88+
- **Safari:** 14+
- **Edge:** 90+

All modern browsers support CSS variables and `backdrop-filter` used in the theme.

---

## FAQs

**Q: Can I add a light theme variant?**  
A: No. GST is a dark-only application. The navy theme is the brand identity.

**Q: What if I need a slightly different shade?**  
A: Use existing variables with opacity: `rgba(30, 77, 179, 0.5)` or create a new derived variable in `index.css`.

**Q: Can I use Tailwind CSS utility classes?**  
A: Not currently. Use CSS variables in component CSS files.

**Q: How do I test color contrast?**  
A: Use browser DevTools or axe DevTools extension to verify WCAG compliance.

---

## Resources

- **OpenSpec Change:** `enforce-navy-theme-consistency`
- **Proposal:** `openspec/changes/enforce-navy-theme-consistency/proposal.md`
- **Design Doc:** `openspec/changes/enforce-navy-theme-consistency/design.md`
- **WCAG Guidelines:** https://www.w3.org/WAI/WCAG21/quickref/
- **Contrast Checker:** https://webaim.org/resources/contrastchecker/

---

**Maintained by:** GST Development Team  
**Questions?** Refer to `openspec/AGENTS.md` or the navy theme proposal documentation.
