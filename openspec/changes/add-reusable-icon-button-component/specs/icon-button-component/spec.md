# Spec: IconButton Component

## ADDED Requirements

### Requirement: IconButton component SHALL provide icon-only action buttons

The system SHALL provide an `IconButton` component in `src/shared/components/` that renders a compact, accessible button for icon-based actions.

#### Scenario: Rendering a primary add button

**Given** a developer imports IconButton from shared components  
**When** they render `<IconButton icon="+" ariaLabel="Add item" onClick={handler} />`  
**Then** a 32×32px button SHALL appear with accent background and dark icon  
**And** the button SHALL have `aria-label="Add item"`

#### Scenario: Rendering a ghost close button

**Given** a developer needs a subtle close button  
**When** they render `<IconButton icon="×" variant="ghost" size="small" ariaLabel="Close" />`  
**Then** a 24×24px transparent button SHALL appear  
**And** the icon color SHALL be `var(--text-secondary)`

---

### Requirement: IconButton SHALL support four visual variants

The system SHALL support `primary`, `secondary`, `ghost`, and `danger` variants following FINTECH_NEON_THEME.md colors.

#### Scenario: Primary variant styling

**Given** an IconButton with `variant="primary"` (default)  
**When** the button renders  
**Then** background SHALL be `var(--accent)` (#dadd56)  
**And** icon color SHALL be `var(--bg)` (#0f0f10)

#### Scenario: Secondary variant styling

**Given** an IconButton with `variant="secondary"`  
**When** the button renders  
**Then** background SHALL be `var(--panel-elevated)`  
**And** border SHALL be 1px solid `var(--border)`  
**And** icon color SHALL be `var(--text)`

#### Scenario: Ghost variant styling

**Given** an IconButton with `variant="ghost"`  
**When** the button renders  
**Then** background SHALL be transparent  
**And** icon color SHALL be `var(--text-secondary)`

#### Scenario: Danger variant styling

**Given** an IconButton with `variant="danger"`  
**When** the button renders  
**Then** background SHALL be `var(--danger)` (#ef4444)  
**And** icon color SHALL be `var(--text)`

---

### Requirement: IconButton SHALL support three sizes

The system SHALL support `small`, `medium`, and `large` sizes following the 8px spacing grid.

#### Scenario: Small size dimensions

**Given** an IconButton with `size="small"`  
**When** the button renders  
**Then** dimensions SHALL be 24×24px  
**And** border-radius SHALL be `var(--radius-sm)`

#### Scenario: Medium size dimensions (default)

**Given** an IconButton with `size="medium"` or no size prop  
**When** the button renders  
**Then** dimensions SHALL be 32×32px  
**And** border-radius SHALL be `var(--radius)`

#### Scenario: Large size dimensions

**Given** an IconButton with `size="large"`  
**When** the button renders  
**Then** dimensions SHALL be 40×40px  
**And** border-radius SHALL be `var(--radius)`

---

### Requirement: IconButton SHALL provide accessible hover states

The system SHALL provide theme-compliant hover effects.

#### Scenario: Primary button hover

**Given** a primary IconButton  
**When** the user hovers over it  
**Then** background SHALL transition to `var(--accent-light)`  
**And** transform SHALL apply scale(1.05)  
**And** box-shadow SHALL apply `var(--glow-accent)`

#### Scenario: Ghost button hover

**Given** a ghost IconButton  
**When** the user hovers over it  
**Then** background SHALL transition to `var(--panel-hover)`  
**And** icon color SHALL transition to `var(--text)`

---

### Requirement: IconButton SHALL enforce accessibility

The system SHALL require an `ariaLabel` prop and provide proper focus states.

#### Scenario: TypeScript enforcement of ariaLabel

**Given** a developer uses IconButton without `ariaLabel`  
**When** TypeScript compiles  
**Then** a compile error SHALL occur indicating `ariaLabel` is required

#### Scenario: Keyboard focus state

**Given** an IconButton receives keyboard focus  
**When** the user tabs to the button  
**Then** box-shadow SHALL show `0 0 0 3px var(--accent-muted)`  
**And** outline SHALL be none

#### Scenario: Keyboard activation

**Given** an IconButton has focus  
**When** the user presses Enter or Space  
**Then** the onClick handler SHALL execute

---

### Requirement: IconButton SHALL support disabled state

The system SHALL visually indicate and prevent interaction when disabled.

#### Scenario: Disabled button appearance

**Given** an IconButton with `disabled={true}`  
**When** the button renders  
**Then** opacity SHALL be 0.5  
**And** cursor SHALL be not-allowed  
**And** hover effects SHALL NOT apply

#### Scenario: Disabled button interaction

**Given** an IconButton with `disabled={true}`  
**When** the user clicks the button  
**Then** the onClick handler SHALL NOT execute

