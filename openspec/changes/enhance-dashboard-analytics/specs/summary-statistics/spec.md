# Summary Statistics Spec

**Capability:** `summary-statistics`  
**Parent Change:** `enhance-dashboard-analytics`  
**Status:** Proposed

## ADDED Requirements

### Requirement: Stat Card Display
**ID:** `DASH-STAT-001`  
**Priority:** High  
**Type:** Functional

The system SHALL display four summary statistic cards showing total money, total earnings, total losses, and net P/L with proper formatting and trend indicators.

#### Scenario: Display total money card with trend
**Given** the account balance is $123,456.78 with +3.5% change from previous period  
**When** the dashboard renders  
**Then** the "Total Money" stat card SHALL display:
- Label: "Total Money" in `--text-secondary` (0.875rem)
- Value: "$123,456.78" in `--text` (2.5rem, bold)
- Trend indicator: "↑ 3.5%" in `--success` color
- Card SHALL use `--panel-elevated` background with `--glow-accent` on hover
- Card SHALL have priority emphasis (largest of 4 cards)

#### Scenario: Display earnings card with positive trend
**Given** total earnings are $15,234.50  
**When** the dashboard renders  
**Then** the "Total Earn" stat card SHALL display:
- Label: "Total Earn"
- Value: "$15,234.50" formatted with 2 decimals and thousands separator
- Trend: Upward arrow in `--success`
- Font size: 2rem (smaller than Total Money)

#### Scenario: Display losses card with negative trend
**Given** total losses are $3,421.25  
**When** the dashboard renders  
**Then** the "Total Loss" stat card SHALL display:
- Value: "$3,421.25" in standard format
- Trend: Downward arrow in `--danger`
- Background: `--panel` (standard elevation)

#### Scenario: Calculate and display net P/L
**Given** earnings=$15,234.50 and losses=$3,421.25  
**When** the dashboard calculates net P/L  
**Then** the "Net P/L" card SHALL display:
- Value: "$11,813.25" (earnings - losses)
- Percentage: "+345.5%" relative to losses
- Trend: Upward arrow if net positive, downward if net negative

### Requirement: Loading State
**ID:** `DASH-STAT-002`  
**Priority:** Medium  
**Type:** UI/UX

Stat cards SHALL display skeleton loaders while fetching data to indicate progress.

#### Scenario: Show skeleton during data fetch
**Given** the AccountContext is loading (isLoading=true)  
**When** the dashboard renders  
**Then** each stat card SHALL show:
- Animated skeleton for label (60% width)
- Animated skeleton for value (80% width)
- Pulse animation (1.5s duration, infinite)
- Background: `--panel` with `--shadow-sm`

### Requirement: Hover Interactions
**ID:** `DASH-STAT-003`  
**Priority:** Medium  
**Type:** UI/UX

Stat cards SHALL provide visual feedback on hover with smooth transitions.

#### Scenario: Hover effect on stat card
**Given** a stat card is displayed  
**When** the user hovers over the card  
**Then** the card SHALL:
- Scale to 102% (transform: scale(1.02))
- Apply `--glow-accent` box-shadow for primary card
- Apply `--shadow-lg` for standard cards
- Transition over 250ms cubic-bezier(0.4, 0, 0.2, 1)
- Cursor change to pointer if card is clickable

### Requirement: Responsive Grid Layout
**ID:** `DASH-STAT-004`  
**Priority:** High  
**Type:** UI/UX

Stat cards SHALL arrange in a responsive grid that adapts to viewport width with proper spacing per theme system.

#### Scenario: Desktop layout (≥1024px)
**Given** viewport width is 1920px  
**When** the dashboard renders  
**Then** stat cards SHALL:
- Display in a horizontal row (4 columns) or 2×2 grid
- **Grid gap: `var(--gap-xl)` (32px) between cards**
- **Card padding: `var(--gap-lg)` (24px) internal padding**
- Each card width: equal flex distribution
- Border-radius: `--radius-lg` (20px)

#### Scenario: Tablet layout (768px - 1023px)
**Given** viewport width is 800px  
**When** the dashboard renders  
**Then** stat cards SHALL:
- Display in 2×2 grid
- **Grid gap: `var(--gap-lg)` (24px) between cards**
- **Card padding: `var(--gap-lg)` (24px) internal padding**
- Maintain aspect ratio

#### Scenario: Mobile layout (<768px)
**Given** viewport width is 375px  
**When** the dashboard renders  
**Then** stat cards SHALL:
- Display in vertical stack (1 column)
- **Grid gap: `var(--gap-md)` (16px) between cards**
- **Card padding: `var(--gap-md)` (16px) internal padding**
- Full width cards

#### Scenario: Card internal spacing
**Given** a stat card with label, value, and trend indicator  
**When** the card renders  
**Then** internal elements SHALL have:
- **Label to value gap: `var(--gap-sm)` (12px)**
- **Value to trend gap: `var(--gap-xs)` (8px)**
- Line-height: 1.2 for numbers, 1.4-1.6 for labels
- **Content MUST NOT touch card edges (minimum 16px clearance)**

### Requirement: Number Formatting
**ID:** `DASH-STAT-005`  
**Priority:** High  
**Type:** Functional

All financial values SHALL be formatted consistently with currency symbols, decimals, and thousands separators.

#### Scenario: Format large currency values
**Given** a value of 1234567.89  
**When** displayed in a stat card  
**Then** the formatted output SHALL be "$1,234,567.89"  
**And** thousands separators SHALL use commas  
**And** decimal precision SHALL be exactly 2 digits

#### Scenario: Format small currency values
**Given** a value of 42.5  
**When** displayed in a stat card  
**Then** the formatted output SHALL be "$42.50"  
**And** trailing zero SHALL be preserved

#### Scenario: Format zero or negative values
**Given** a net P/L value of -500.00  
**When** displayed  
**Then** the formatted output SHALL be "-$500.00"  
**And** trend indicator SHALL show downward arrow in `--danger`

---

## Related Capabilities
- `portfolio-visualization` (consumes stat data for chart)
- `dashboard-theme-compliance` (color and spacing tokens)
- **`ui-spacing-compliance` (enforces spacing rules for stat cards)**
