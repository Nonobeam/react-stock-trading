# Spec Delta: UI Theme System

**Feature ID:** `ui-theme-system`  
**Change ID:** `enforce-navy-theme-consistency`  
**Last Updated:** 2026-01-07

---

## ADDED Requirements

### Color System

#### Requirement: Navy Color Palette Variables

The application SHALL define exactly five core color variables in `:root` of `src/index.css`:
- `--bg` set to `#071033` (page background)
- `--panel` set to `#0b1a3a` (card/panel backgrounds)
- `--accent` set to `#1e4db3` (interactive elements)
- `--muted` set to `#6b80a6` (secondary text, borders)
- `--text` set to `#DDEBFF` (primary text)

These variables SHALL be the single source of truth for all color usage.

##### Scenario: Root Variables Defined

**Given** the file `src/index.css` exists  
**When** parsing the `:root` selector  
**Then** the following CSS variables MUST be present with exact values:
```css
--bg: #071033;
--panel: #0b1a3a;
--accent: #1e4db3;
--muted: #6b80a6;
--text: #DDEBFF;
```

##### Scenario: No Hardcoded Colors in Components

**Given** any CSS file in `src/` directory  
**When** searching for color declarations (background, color, border properties)  
**Then** all color values MUST reference CSS variables (e.g., `var(--bg)`)  
**And** no hardcoded hex colors SHALL be present (except in `:root`)  
**And** no RGB/HSL values SHALL be used (except rgba for transparency)

---

#### Requirement: Derived Color Variables

The application SHALL define derived colors for specific use cases:
- `--panel-elevated` set to `#0e1f45` (modals, dropdowns)
- `--accent-dark` set to `#153b8f` (gradient end, active states)
- `--accent-light` set to `#2b5dc9` (hover states)
- `--border` set to `rgba(255, 255, 255, 0.06)` (subtle borders)

##### Scenario: Elevated Panel Background

**Given** a modal or dropdown component  
**When** rendering its background  
**Then** it SHALL use `var(--panel-elevated)` instead of `var(--panel)`  
**And** visual inspection MUST show it appears slightly brighter than `--panel`

---

#### Requirement: Status Colors

The application SHALL define semantic status colors:
- `--success` set to `#4ade80` (positive metrics, wins)
- `--warning` set to `#fbbf24` (cautions, pending)
- `--danger` set to `#ef4444` (losses, errors)
- `--info` set to `#3b82f6` (informational alerts)

##### Scenario: Profit Display Uses Success Color

**Given** a metric displays a positive profit value  
**When** rendering the text color  
**Then** it SHALL use `var(--success)`  
**And** the text MUST appear green (#4ade80)

##### Scenario: Loss Display Uses Danger Color

**Given** a metric displays a negative loss value  
**When** rendering the text color  
**Then** it SHALL use `var(--danger)`  
**And** the text MUST appear red (#ef4444)

---

#### Requirement: Prohibited Light Backgrounds

The application SHALL NOT use any of the following colors:
- White: `#ffffff`, `#fafafa`, `#f9f9f9`
- Light grays: `#f0f0f0`, `#e0e0e0`, `#cccccc`, `#d0d0d0`
- Off-brand blues: `#1f2937`, `#374151`

##### Scenario: No White Backgrounds

**Given** any CSS file in the project  
**When** searching for background declarations  
**Then** no value SHALL be `#fff`, `#ffffff`, `white`, or `#fafafa`  
**And** all backgrounds MUST use navy tones (`#071033` to `#0e1f45` range)

---

### Component Patterns

#### Requirement: Button Gradient Pattern

Primary buttons SHALL use the gradient pattern:
```css
background: linear-gradient(180deg, var(--accent), var(--accent-dark));
```

##### Scenario: Primary Button Background

**Given** a button with class `.btn-primary` or similar  
**When** inspecting computed background  
**Then** it SHALL be a gradient from `#1e4db3` to `#153b8f` (180deg direction)  
**And** hover state SHALL use `var(--accent-light)` as gradient start

---

#### Requirement: Card Background Pattern

Cards and panels SHALL use either:
- Solid: `background: var(--panel);`
- Gradient: `background: linear-gradient(180deg, #091233, #081a2e);`

##### Scenario: Card Uses Panel Variable

**Given** a card component with class `.card`  
**When** rendering the background  
**Then** it SHALL use `var(--panel)` or the approved card gradient  
**And** it SHALL NOT use hardcoded colors like `#0f1535`

---

#### Requirement: Input Field Transparency

Text inputs and select fields SHALL use transparent backgrounds with borders:
```css
background: transparent;
border: 1px solid var(--border);
```

##### Scenario: Input Field Styling

**Given** an input element with class `.input`  
**When** user focuses the input  
**Then** background SHALL transition to `rgba(30, 77, 179, 0.05)`  
**And** border color SHALL change to `var(--accent)`  
**And** outline SHALL be `none` (focus ring via border only)

---

#### Requirement: Navigation Active State

Active navigation items SHALL have:
- Background: `var(--accent)`
- Color: `var(--text)`
- Font weight: `600`

##### Scenario: Active Navigation Indicator

**Given** a navigation item with class `.nav-item.active`  
**When** rendering the element  
**Then** background MUST be `#1e4db3` (var(--accent))  
**And** text color MUST be `#DDEBFF` (var(--text))  
**And** font-weight MUST be `600`

---

### Shadow System

#### Requirement: Standardized Shadow Variables

The application SHALL define three shadow levels:
- `--shadow-sm: 0 2px 4px rgba(4, 8, 20, 0.4);` (buttons, small cards)
- `--shadow: 0 6px 20px rgba(4, 8, 20, 0.6);` (standard cards)
- `--shadow-lg: 0 12px 48px rgba(4, 8, 20, 0.8);` (modals, elevated panels)

##### Scenario: Card Shadow Usage

**Given** a card component  
**When** applying box-shadow  
**Then** it SHALL use `var(--shadow)` instead of hardcoded values  
**And** hover state MAY use `var(--shadow-lg)` for elevation effect

---

### Spacing System

#### Requirement: Gap Variables

The application SHALL define spacing variables:
- `--gap: 12px;` (standard spacing)
- `--gap-sm: 8px;` (compact)
- `--gap-lg: 16px;` (relaxed)
- `--gap-xl: 24px;` (section spacing)

##### Scenario: Consistent Gap Usage

**Given** a flex container with multiple children  
**When** setting the gap property  
**Then** it SHALL use `var(--gap)` or variant instead of hardcoded pixels  
**And** components SHALL NOT use `10px` or `15px` spacing values

---

### Typography

#### Requirement: Text Size Variables

The application SHALL define typography scale:
- `--text-xs: 0.75rem;` (12px - captions)
- `--text-sm: 0.875rem;` (14px - body small)
- `--text-base: 1rem;` (16px - body)
- `--text-lg: 1.125rem;` (18px - subheadings)
- `--text-xl: 1.25rem;` (20px - headings)
- `--text-2xl: 1.5rem;` (24px - page titles)

##### Scenario: Heading Size Consistency

**Given** a page title element  
**When** setting font-size  
**Then** it SHALL use `var(--text-2xl)` instead of `24px` or `1.5rem`

---

### Accessibility

#### Requirement: Text Contrast Ratio

All text SHALL meet WCAG AA standards:
- Normal text (< 18px): 4.5:1 contrast minimum
- Large text (≥ 18px): 3:1 contrast minimum
- Interactive elements: 3:1 contrast minimum

##### Scenario: Primary Text Readability

**Given** text with color `var(--text)` on background `var(--bg)`  
**When** calculating contrast ratio  
**Then** ratio MUST be ≥ 4.5:1  
**And** actual ratio with `#DDEBFF` on `#071033` is 12.5:1 (passes WCAG AAA)

##### Scenario: Muted Text Readability

**Given** text with color `var(--muted)` on background `var(--bg)`  
**When** calculating contrast ratio  
**Then** ratio MUST be ≥ 3:1  
**And** actual ratio with `#6b80a6` on `#071033` is 3.2:1 (passes AA for large text)

---

### Documentation

#### Requirement: Design System Documentation

A file `docs/DESIGN_SYSTEM.md` SHALL exist containing:
1. Color palette table with hex values and usage guidelines
2. Component pattern examples (buttons, cards, inputs)
3. Gradient library with approved patterns
4. Do's and Don'ts section with code examples
5. Migration guide for updating components
6. Validation checklist for code reviews

##### Scenario: Documentation Includes Color Swatches

**Given** the file `docs/DESIGN_SYSTEM.md` exists  
**When** reading the Color Palette section  
**Then** it MUST include a table with columns: Token, Value, Usage, Contrast Ratio  
**And** each row MUST show a color variable with its hex value and description

---

## MODIFIED Requirements

### Existing Color Variables (Backward Compatibility)

#### Requirement: Deprecated Variable Aliases

The application SHALL maintain backward compatibility by aliasing old variables:
```css
--color-bg-primary: var(--bg);
--color-bg-secondary: var(--panel);
--color-primary: var(--accent);
--color-text-primary: var(--text);
--color-text-muted: var(--muted);
--color-border: var(--border);
```

These aliases SHALL be marked as deprecated in comments and removed after full migration.

##### Scenario: Old Variables Still Work

**Given** a component uses `var(--color-bg-primary)`  
**When** rendering the background  
**Then** it SHALL resolve to `#071033` (via alias to `var(--bg)`)  
**And** no visual regression SHALL occur during migration period

##### Scenario: Migration Complete, Aliases Removed

**Given** all components have migrated to new variables  
**When** searching codebase for `--color-bg-primary` usage  
**Then** no matches SHALL be found  
**And** aliases MAY be removed from `src/index.css`

---

### Tooltip Component

#### Requirement: Tooltip Uses Navy Theme

The Tooltip component in `src/shared/components/Tooltip.css` SHALL use:
- Background: `var(--panel)` instead of `#1f2937`
- Transparent variant: `rgba(11, 26, 58, 0.8)` (--panel at 80% opacity)

##### Scenario: Tooltip Background Updated

**Given** the Tooltip component renders  
**When** inspecting `.tooltip` background  
**Then** it SHALL be `#0b1a3a` (var(--panel))  
**And** NOT `#1f2937` (old gray-blue)

##### Scenario: Transparent Tooltip Opacity

**Given** a Tooltip with `transparent={true}` prop  
**When** rendering with class `.tooltip-transparent`  
**Then** background SHALL be `rgba(11, 26, 58, 0.8)`  
**And** backdrop-filter SHALL be `blur(8px)` for glass effect

---

### Button Component

#### Requirement: Button Uses Gradient Pattern

The Button component in `src/shared/components/Button.css` SHALL apply the navy gradient:

**Primary Button:**
- Background: `linear-gradient(180deg, var(--accent), var(--accent-dark))`
- Hover: `linear-gradient(180deg, var(--accent-light), var(--accent))`

##### Scenario: Primary Button Gradient

**Given** a Button with variant="primary"  
**When** rendering in normal state  
**Then** background MUST be gradient from `#1e4db3` to `#153b8f`  
**And** on hover MUST be gradient from `#2b5dc9` to `#1e4db3`

---

### Card Component

#### Requirement: Card Uses Panel Background

The Card component in `src/shared/components/Card.css` SHALL use:
- Background: `var(--panel)` or card gradient pattern
- Border: `1px solid var(--border)`
- Shadow: `var(--shadow)`

##### Scenario: Card Elevation Effect

**Given** a Card component  
**When** user hovers over the card  
**Then** it SHALL apply `transform: translateY(-2px)`  
**And** shadow SHALL transition to `var(--shadow-lg)`  
**And** border MAY brighten slightly

---

## REMOVED Requirements

### Deprecated Color Usage

#### Requirement: Remove Hardcoded Colors

The following SHALL be removed from all CSS files (except `:root`):
- Hardcoded hex colors (e.g., `#0a0e27`, `#0f1535`, `#1f2937`)
- Named colors (e.g., `white`, `black`, `blue`)
- RGB values without variable reference (e.g., `rgb(15, 21, 53)`)

##### Scenario: No Hardcoded Hex in Component CSS

**Given** any CSS file outside `src/index.css`  
**When** searching for `/background.*#[0-9a-f]{6}/i`  
**Then** no matches SHALL be found  
**And** all backgrounds MUST use `var(--)` syntax

---

### Old Theme System

#### Requirement: Remove Inconsistent Variables

The following inconsistent variable patterns SHALL be removed after migration:
- `--color-bg-*` (multiple background variants)
- `--color-accent-*` (multiple accent variants)
- Any variable not part of the standard navy palette

##### Scenario: Cleanup Deprecated Variables

**Given** migration is complete  
**When** reviewing `src/index.css` `:root` block  
**Then** only approved variables SHALL remain  
**And** deprecated aliases SHALL be removed  
**And** no unused variables SHALL exist

---

## Validation Rules

### Pre-Commit Checks

Before committing CSS changes, the following SHALL be verified:

1. **No Hardcoded Colors**: Grep for `#[0-9a-f]{6}` in non-root CSS files → zero matches
2. **No Light Backgrounds**: Grep for `#fff|#f0f0f0|white` → zero matches
3. **Variable Usage**: All color properties reference `var(--*)` → 100% coverage
4. **Contrast Ratios**: Run axe DevTools → zero color contrast violations
5. **Visual Regression**: Compare screenshots before/after → no unintended changes

##### Scenario: Validation Script Passes

**Given** a developer runs `npm run validate:theme`  
**When** the script checks all CSS files  
**Then** it SHALL report zero violations  
**And** exit code SHALL be 0 (success)

---

## Test Scenarios

### Integration Testing

#### Scenario: Theme Consistency Across All Views

**Given** the application is running  
**When** navigating to Market, Performance, Risk, Scanner, Regime, and Monitoring views  
**Then** all views SHALL have navy backgrounds (no white/light surfaces)  
**And** all interactive elements SHALL use `var(--accent)` color  
**And** visual inspection SHALL show consistent spacing, shadows, and typography

#### Scenario: Dark Mode Only

**Given** browser with light mode preference  
**When** loading the application  
**Then** it SHALL display navy theme (ignore OS preference)  
**And** no light theme toggle SHALL be present  
**And** documentation SHALL state "dark mode only"

#### Scenario: Button Interaction States

**Given** a primary button on any view  
**When** hovering the button  
**Then** gradient SHALL transition to lighter variant  
**And** box-shadow SHALL increase  
**And** transform SHALL apply `translateY(-1px)`  
**When** clicking (active state)  
**Then** transform SHALL reset to `translateY(0)`  
**And** shadow SHALL reduce slightly

---

## Migration Acceptance Criteria

The theme enforcement change SHALL be considered complete when:

1. ✅ All CSS variables defined in `src/index.css` with exact values
2. ✅ Zero hardcoded hex colors in component CSS files
3. ✅ All components use `var(--*)` syntax exclusively
4. ✅ Tooltip component updated to use `var(--panel)`
5. ✅ Button component uses navy gradient pattern
6. ✅ Card component uses `var(--panel)` background
7. ✅ Navigation uses `var(--accent)` for active state
8. ✅ All text meets WCAG AA contrast standards (axe DevTools passes)
9. ✅ Documentation file `docs/DESIGN_SYSTEM.md` exists with complete content
10. ✅ Visual regression testing passes across all 6 views
11. ✅ No light backgrounds visible anywhere in the UI
12. ✅ Deprecated variable aliases functional during migration, removed after

---

## Non-Functional Requirements

### Performance

The theme system SHALL NOT impact render performance:
- CSS variable lookups are native browser operations (< 1ms)
- No JavaScript theme calculation required
- No FOUC (Flash of Unstyled Content) during page load

##### Scenario: Fast Page Load

**Given** the application is deployed  
**When** loading any view for the first time  
**Then** theme SHALL be applied immediately (no white flash)  
**And** time to first paint SHALL be < 300ms  
**And** no layout shifts SHALL occur due to theme loading

### Browser Compatibility

The theme system SHALL work in:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

CSS variables and backdrop-filter are supported in all these versions.

##### Scenario: Cross-Browser Consistency

**Given** the application running in Chrome, Firefox, Safari, and Edge  
**When** rendering the same view in each browser  
**Then** colors SHALL be identical (within ±2 RGB units)  
**And** gradients SHALL render smoothly without banding  
**And** shadows SHALL appear consistent

---

## Out of Scope

The following are explicitly NOT part of this change:

1. ❌ Light theme support
2. ❌ User-selectable theme variants (purple, teal, etc.)
3. ❌ CSS-in-JS migration (styled-components, Emotion)
4. ❌ Tailwind CSS integration
5. ❌ Design tokens export to Figma/Sketch
6. ❌ Animation system standardization
7. ❌ Storybook component showcase
8. ❌ Automated visual regression testing setup

These MAY be addressed in future changes but are not required for navy theme enforcement.

---

**Spec Review Checklist:**
- [x] All requirements use SHALL/MUST in body text
- [x] Each requirement has at least one scenario
- [x] Scenarios follow Given/When/Then format
- [x] Validation rules clearly defined
- [x] Acceptance criteria measurable
- [x] Out of scope items listed
- [x] Test scenarios cover happy and edge cases
