# Spec: UI Spacing Consistency

**Status:** Draft  
**Category:** Visual Design  
**Related Specs:** `ui-theme-consistency`

## ADDED Requirements

### Requirement: Phase 1 components SHALL use spacing system tokens for all spacing values

Phase 1 UI components (Dashboard, Watchlist, Portfolio, Signals) and shared components (Button, Card, Modal, Table, Navigation) SHALL use CSS spacing tokens (`--gap-xs`, `--gap-sm`, `--gap-md`, `--gap-lg`, `--gap-xl`, `--gap-2xl`) instead of hardcoded `rem` or `px` values for padding, margin, and gap properties to ensure spacing consistency across the application.

#### Scenario: Dashboard major sections use large spacing tokens

**Given** the Dashboard view is rendered  
**When** the user views major content sections  
**Then** section gaps SHALL use `--gap-xl` (32px) or `--gap-2xl` (48px)  
**And** sections SHALL feel distinctly separated with generous breathing space

#### Scenario: Card grids use medium spacing tokens

**Given** any Phase 1 screen with card layouts is rendered  
**When** the user views a grid of cards  
**Then** gaps between cards SHALL use `--gap-lg` (24px) or `--gap-xl` (32px)  
**And** card groups SHALL feel cohesive but not cramped

#### Scenario: Card padding uses medium spacing tokens

**Given** a Card component is rendered  
**When** the user views the card content  
**Then** card padding SHALL use `--gap-lg` (24px) for standard cards  
**And** card padding SHALL use `--gap-md` (16px) for nested or compact cards

#### Scenario: Component groupings use small-medium spacing

**Given** related components are grouped together (e.g., filter buttons, form inputs)  
**When** the user views the component group  
**Then** gaps between related components SHALL use `--gap-sm` (12px) or `--gap-md` (16px)  
**And** grouping SHALL be visually clear without excessive separation

#### Scenario: Icon and text pairing uses small spacing

**Given** a component displays an icon next to text (e.g., button, status indicator)  
**When** the user views the icon + text combination  
**Then** gap between icon and text SHALL use `--gap-xs` (8px) or `--gap-sm` (12px)  
**And** icon and text SHALL feel unified as a single element

---

### Requirement: Application SHALL follow Fintech Neon spacing hierarchy rules

The application SHALL apply spacing tokens according to the hierarchy rules defined in `docs/FINTECH_NEON_THEME.md` to maintain consistent visual rhythm and clear content organization across all screens.

#### Scenario: Major sections have maximum spacing

**Given** a screen has distinct major sections (e.g., Dashboard metrics, chart area, watchlist)  
**When** the user scrolls through the content  
**Then** spacing between major sections SHALL be 32-48px (`--gap-xl` to `--gap-2xl`)  
**And** major sections SHALL feel like separate zones of the interface

#### Scenario: Card collections have medium spacing

**Given** a screen displays multiple cards (e.g., Signals grid, Portfolio summary cards)  
**When** the user views the card collection  
**Then** spacing between cards SHALL be 24-32px (`--gap-lg` to `--gap-xl`)  
**And** cards SHALL be easily distinguishable as individual items

#### Scenario: Card interiors have comfortable padding

**Given** a Card component contains content  
**When** the user reads the card content  
**Then** internal padding SHALL be 16-24px (`--gap-md` to `--gap-lg`)  
**And** content SHALL not feel cramped against card edges

#### Scenario: Form controls are comfortably grouped

**Given** a form or control group is displayed (e.g., filter buttons, modal inputs)  
**When** the user interacts with the controls  
**Then** spacing between controls SHALL be 12-16px (`--gap-sm` to `--gap-md`)  
**And** related controls SHALL feel grouped together

#### Scenario: Inline elements use minimal spacing

**Given** inline elements are displayed (e.g., badge with text, icon button)  
**When** the user views the inline grouping  
**Then** spacing SHALL be 8-12px (`--gap-xs` to `--gap-sm`)  
**And** inline elements SHALL feel like a cohesive unit

---

### Requirement: Shared components SHALL use semantic spacing tokens

Shared UI components (Button, Card, Modal, Table, Navigation, etc.) SHALL use spacing tokens semantically based on their role in the visual hierarchy, ensuring consistent spacing patterns when components are reused across different screens.

#### Scenario: Button icon spacing is consistent

**Given** a Button component is rendered with an icon  
**When** the user views any button with icon across the application  
**Then** gap between icon and text SHALL use `--gap-xs` (8px) or `--gap-sm` (12px)  
**And** all buttons with icons SHALL have identical icon spacing

#### Scenario: Modal content has generous padding

**Given** a Modal component is opened  
**When** the user views the modal content  
**Then** modal content padding SHALL use `--gap-lg` (24px)  
**And** modal SHALL feel spacious and easy to read

#### Scenario: Table cells have balanced padding

**Given** a Table component is rendered  
**When** the user reads table data  
**Then** table cell padding SHALL use `--gap-sm` (12px) or `--gap-md` (16px)  
**And** table rows SHALL be readable without feeling cramped

#### Scenario: Navigation items have consistent spacing

**Given** the Navigation component is rendered  
**When** the user views navigation items  
**Then** nav item padding SHALL use `--gap-sm` (12px) or `--gap-md` (16px)  
**And** gaps between nav items SHALL use `--gap-xs` (8px) or `--gap-sm` (12px)  
**And** all navigation spacing SHALL be consistent

---

### Requirement: Hardcoded spacing values SHALL be minimized

The application SHALL minimize the use of hardcoded spacing values (raw `rem`, `px`, or `em` units for padding/margin/gap), limiting them only to micro-spacing cases (<8px) where spacing tokens are not applicable.

#### Scenario: Major spacing uses tokens exclusively

**Given** a CSS file defines spacing for sections, cards, or components  
**When** a developer inspects spacing values ≥8px  
**Then** at least 90% SHALL use spacing tokens (`--gap-*`)  
**And** hardcoded values SHALL only appear for micro-spacing (<8px)

#### Scenario: Token usage is auditable

**Given** the CSS codebase is complete  
**When** a grep search is run for hardcoded spacing patterns  
**Then** all non-token spacing ≥8px SHALL be documented with comments explaining the exception  
**And** token adoption rate SHALL be verifiable

---

### Requirement: Spacing SHALL be consistent across responsive breakpoints

Spacing tokens SHALL be used consistently across different viewport sizes, with responsive adjustments made by changing which token is used rather than introducing new hardcoded values.

#### Scenario: Mobile spacing uses smaller tokens

**Given** the application is viewed on a mobile viewport  
**When** responsive breakpoints adjust layout  
**Then** spacing MAY reduce by one token level (e.g., `--gap-xl` → `--gap-lg`)  
**And** spacing SHALL NOT use new hardcoded values for mobile

#### Scenario: Desktop spacing maintains hierarchy

**Given** the application is viewed on a desktop viewport  
**When** the user views any screen  
**Then** spacing hierarchy rules SHALL apply at full scale  
**And** major sections SHALL use `--gap-xl` or `--gap-2xl` consistently

---

### Requirement: Production builds SHALL render spacing identically to development

The application SHALL render spacing values identically in production builds as in development mode, with CSS tokens properly resolved in the bundled CSS.

#### Scenario: Production spacing matches development

**Given** the application is built for production  
**When** the production bundle is served and viewed  
**Then** all spacing SHALL render with identical pixel values as development  
**And** CSS bundle SHALL include resolved token values

#### Scenario: DevTools shows token resolution

**Given** a developer inspects an element in DevTools  
**When** viewing computed styles  
**Then** spacing properties SHALL show resolved token values  
**And** CSS variables SHALL be traceable to their definitions
