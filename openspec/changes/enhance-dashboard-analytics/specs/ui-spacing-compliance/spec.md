# Capability: UI Spacing Compliance

## ADDED Requirements

### Requirement: Dashboard Spacing System Compliance
**ID:** `DASH-SPACING-001`  
**Priority:** Critical  
**Component:** DashboardView CSS

The dashboard MUST use only valid spacing tokens from the Fintech Neon theme system and apply spacing hierarchy rules consistently to ensure premium visual presentation.

**Valid Spacing Tokens:**
- `--gap-xs`: 8px (icon + text, tight grouping)
- `--gap-sm`: 12px (related components)
- `--gap-md`: 16px (component grouping, minimum card padding)
- `--gap-lg`: 24px (comfortable card padding, card gaps on tablet)
- `--gap-xl`: 32px (section separation, card gaps on desktop)
- `--gap-2xl`: 48px (major layout splits)

**Undefined Variables (MUST NOT USE):**
- `--gap-1`, `--gap-2`, `--gap-3`, `--gap-4`, `--gap-6` are not defined in theme

#### Scenario: Desktop Card Spacing (≥1024px)
**Given** a user views the dashboard on a desktop screen (≥1024px width)  
**When** the page renders  
**Then** cards MUST have 32px gaps between them (use `gap: var(--gap-xl)`)  
**And** card padding MUST be minimum 24px (use `padding: var(--gap-lg)`)  
**And** major sections MUST have 32-48px margins (use `margin-bottom: var(--gap-xl)` or `var(--gap-2xl)`)  
**And** content MUST NOT touch card edges

#### Scenario: Tablet Card Spacing (768-1023px)
**Given** a user views the dashboard on a tablet screen (768-1023px width)  
**When** the page renders  
**Then** cards MUST have 24px gaps between them (use `gap: var(--gap-lg)`)  
**And** card padding MUST be 20-24px (use `padding: var(--gap-lg)`)  
**And** major sections MUST have 24-32px margins  
**And** cards MUST NOT touch each other

#### Scenario: Mobile Card Spacing (<768px)
**Given** a user views the dashboard on a mobile screen (<768px width)  
**When** the page renders  
**Then** cards MUST have 16px gaps between them (use `gap: var(--gap-md)`)  
**And** card padding MUST be minimum 16px (use `padding: var(--gap-md)`)  
**And** major sections MUST have 16-24px margins  
**And** content MUST remain readable with adequate breathing space

#### Scenario: Component Internal Spacing
**Given** a dashboard card contains grouped components (labels, values, buttons)  
**When** the card renders  
**Then** related components MUST have 12-16px spacing (use `gap: var(--gap-sm)` or `var(--gap-md)`)  
**And** icon + text combinations MUST have 8-12px spacing (use `gap: var(--gap-xs)` or `var(--gap-sm)`)  
**And** text rows MUST have 8-12px bottom margin for readability  
**And** line-height MUST be 1.4-1.6 for body text

#### Scenario: No Undefined Variables
**Given** the DashboardView.css file  
**When** a developer searches for spacing variables  
**Then** NO instances of `--gap-1`, `--gap-2`, `--gap-3`, `--gap-4`, or `--gap-6` SHALL exist  
**And** ALL spacing values MUST use valid theme tokens from `src/index.css`

---

### Requirement: Visual Breathing Space Rule
**ID:** `DASH-SPACING-002`  
**Priority:** High  
**Component:** All Dashboard Cards

All dashboard cards MUST maintain adequate "breathing space" to prevent claustrophobic layouts and ensure premium visual quality.

#### Scenario: Content Edge Safety
**Given** a dashboard card contains text, numbers, or interactive elements  
**When** the card renders at any screen size  
**Then** content MUST NOT appear to touch or be near the card edges  
**And** minimum 16px padding MUST be maintained on all sides  
**And** if content "looks like it might touch edges" → spacing is insufficient

#### Scenario: Cards Never Touch
**Given** multiple cards in a grid or column layout  
**When** the layout renders at any screen size  
**Then** cards MUST maintain minimum gaps (32px desktop, 24px tablet, 16px mobile)  
**And** cards MUST NEVER touch each other  
**And** white space between cards MUST be clearly visible

#### Scenario: Premium Spacing Perception
**Given** a designer reviews the dashboard layout  
**When** evaluating spacing decisions  
**Then** if spacing feels "slightly too spacious" → it is likely correct  
**And** if spacing feels "just right" → it may be too tight  
**And** the overall impression MUST be "premium and professional"

---

### Requirement: Text Readability Spacing
**ID:** `DASH-SPACING-003`  
**Priority:** High  
**Component:** Dashboard Text Content

Text content MUST have adequate line-height and row spacing to ensure readability and prevent visual crowding.

#### Scenario: Body Text Line Height
**Given** body text, labels, or descriptions in dashboard cards  
**When** the text renders  
**Then** line-height MUST be between 1.4 and 1.6  
**And** paragraphs or multi-line text MUST have 8-12px bottom margin between rows

#### Scenario: Number Display Line Height
**Given** large numeric displays (prices, balances, statistics)  
**When** the numbers render  
**Then** line-height MAY be tighter (1.2) for visual impact  
**And** surrounding labels MUST have 8-12px spacing from the number  
**And** font-variant-numeric: tabular-nums SHOULD be applied

#### Scenario: Stacked Text Rows
**Given** multiple rows of text stacked vertically (e.g., label above value)  
**When** the rows render  
**Then** minimum 8px spacing MUST separate rows  
**And** recommended 12px spacing SHOULD be used for comfortable reading  
**And** text MUST NOT appear cramped or overlapping

---

## Context & Relationships

**Related Capabilities:**
- `portfolio-visualization` — Chart component must follow spacing rules
- `summary-statistics` — StatCard padding and gaps must comply
- `watchlist-management` — Watchlist items must use correct spacing
- `ai-recommendations` — Modal and button spacing must comply

**Depends On:**
- Fintech Neon theme system defined in `src/index.css`
- Spacing rules documented in `docs/FINTECH_NEON_THEME.md`

**Impacts:**
- All new dashboard components must follow these rules
- Existing dashboard cards may need spacing adjustments
- Responsive breakpoints must maintain spacing hierarchy
