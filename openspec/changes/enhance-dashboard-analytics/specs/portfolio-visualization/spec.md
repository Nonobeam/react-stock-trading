# Portfolio Visualization Spec

**Capability:** `portfolio-visualization`  
**Parent Change:** `enhance-dashboard-analytics`  
**Status:** Proposed

## ADDED Requirements

### Requirement: Chart Component Rendering
**ID:** `DASH-CHART-001`  
**Priority:** High  
**Type:** Functional

The system SHALL render a donut chart component that displays portfolio allocation with balance, earnings, losses, and optional watchlist segments using theme-compliant colors.

#### Scenario: Render donut chart with portfolio data
**Given** the user has an account with balance=$50000, earnings=$5000, and losses=$2000  
**When** the dashboard loads  
**Then** a donut chart SHALL be displayed with:
- Balance segment in `--accent` color (#dadd56) representing $50000 (85.7%)
- Earnings segment in `--success` color (#4ade80) representing $5000 (8.6%)
- Losses segment in `--danger` color (#ef4444) representing $2000 (3.4%)
- Chart SHALL have inner radius of 60% and outer radius of 90%
- Chart SHALL animate smoothly on mount over 500ms

#### Scenario: Show tooltip on segment hover
**Given** the donut chart is rendered  
**When** the user hovers over the balance segment  
**Then** a tooltip SHALL appear showing:
- Label: "Total Balance"
- Value: "$50,000.00"
- Percentage: "85.7%"
- Tooltip SHALL use `--panel-elevated` background with `--shadow-lg`

#### Scenario: Toggle segment via legend
**Given** the donut chart is rendered with a legend  
**When** the user clicks the "Earnings" legend item  
**Then** the earnings segment SHALL fade out over 250ms  
**And** remaining segments SHALL resize proportionally  
**And** the legend item SHALL show a strikethrough style

### Requirement: Empty State Handling
**ID:** `DASH-CHART-002`  
**Priority:** Medium  
**Type:** Functional

The system SHALL display an empty state message when portfolio data is unavailable or invalid.

#### Scenario: Show empty state for missing data
**Given** the AccountContext returns null balance  
**When** the dashboard loads  
**Then** the chart area SHALL display:
- Message: "No portfolio data available"
- Icon: Chart placeholder icon in `--muted` color
- Call-to-action: "Connect your account to see portfolio breakdown"

### Requirement: Responsive Layout
**ID:** `DASH-CHART-003`  
**Priority:** High  
**Type:** UI/UX

The chart component SHALL adapt size and layout across desktop, tablet, and mobile breakpoints while maintaining readability and proper spacing.

#### Scenario: Adjust chart size for mobile
**Given** the viewport width is < 768px  
**When** the dashboard renders  
**Then** the chart SHALL:
- Reduce diameter to 240px (from 320px desktop)
- Position legend below chart (not beside)
- Maintain minimum touch target size of 44px for legend items

#### Scenario: Chart container spacing
**Given** the PortfolioChart component renders  
**When** displaying at any screen size  
**Then** the chart card SHALL have:
- **Padding: `var(--gap-lg)` (24px) on all sides**
- Border-radius: `var(--radius-lg)` (20px)
- Background: `var(--panel)` with `var(--shadow)` elevation
- **Minimum 16px spacing between chart and card edges**

## ADDED Interactions

### Requirement: Chart Animation Performance
**ID:** `DASH-CHART-004`  
**Priority:** Medium  
**Type:** Performance

The chart animations SHALL complete within acceptable performance thresholds without blocking the main thread.

#### Scenario: Measure animation frame rate
**Given** the dashboard is loading with chart animation  
**When** performance metrics are captured  
**Then** the animation SHALL maintain ≥ 55 FPS  
**And** total animation time SHALL be 500ms ± 50ms  
**And** the main thread SHALL not block for > 16ms

---

## Related Capabilities
- `summary-statistics` (provides data for chart segments)
- `dashboard-theme-compliance` (defines color tokens used)
- **`ui-spacing-compliance` (defines spacing rules for chart container)**
