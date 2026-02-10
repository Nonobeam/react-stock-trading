# Spec: Trade Setup Discovery (Scanner)

## ADDED Requirements

### Requirement: Display Discovered Trade Setups
The system MUST display a list of discovered trade setups retrieved from the backend (or mock service).

#### Scenario: Viewing the Scanner Grid
- **Given** the user is on the Scanner page
- **And** there are multiple discovered setups
- **When** the page loads
- **Then** the user SHOULD see a grid of setup cards
- **And** each card MUST show: Symbol, Pattern, Timeframe, Setup Score, and Risk/Reward ratio.

### Requirement: Filter Setups by Status
The system MUST allow users to filter setups based on their current status.

#### Scenario: Filtering for Pending Setups
- **Given** the scanner grid has setups with statuses 'Pending', 'Triggered', and 'Invalidated'
- **When** the user selects the 'Pending' filter
- **Then** ONLY setups with status 'Pending' SHOULD be visible in the grid.

### Requirement: 13-Point Setup Scorecard
The system MUST provide a detailed scorecard for each setup to justify its quality score.

#### Scenario: Inspecting Setup Quality
- **Given** the user has clicked on a setup card
- **When** the detail modal opens
- **Then** it MUST display a 13-point scorecard breakdown
- **And** it SHOULD show individual scores for Trend, Volume, Volatility, and other technical criteria.

### Requirement: Responsive Layout
The scanner view MUST be usable on both desktop and mobile devices.

#### Scenario: Mobile Viewport
- **Given** a mobile screen width (e.g., < 768px)
- **When** the scanner view is rendered
- **Then** the grid SHOULD adapt to a single column layout
- **And** filters SHOULD remain accessible (e.g., via a collapsed menu or scrollable list).
