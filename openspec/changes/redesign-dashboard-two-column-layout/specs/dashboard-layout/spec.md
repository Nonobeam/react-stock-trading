# Dashboard Layout Capability

**Capability ID:** `dashboard-layout`
**Status:** Modified
**Category:** Layout
**Last Updated:** 2026-01-14

---

## MODIFIED Requirements

### Requirement: Dashboard SHALL use Two-Column Grid Layout on Desktop

The dashboard SHALL display content in a two-column grid layout on desktop viewports (≥1024px) with responsive single-column fallback for smaller screens.

**Rationale:** Two-column layout optimizes screen real estate for professional trading by separating market data from portfolio data.

**Acceptance Criteria:**
- Desktop (≥1024px): Two equal columns (50%/50%)
- Gap between columns: 32px (--gap-xl)
- Tablet (768-1023px): Single column layout
- Mobile (<768px): Single column with reduced padding

#### Scenario: Desktop two-column layout

**Given** the viewport width is 1024px or greater
**When** the dashboard renders
**Then** a two-column grid layout is displayed
**And** left column occupies 50% width
**And** right column occupies 50% width
**And** gap between columns is 32px (--gap-xl)

#### Scenario: Tablet single-column layout

**Given** the viewport width is between 768px and 1023px
**When** the dashboard renders
**Then** a single-column layout is displayed
**And** left column content appears first
**And** right column content appears below
**And** gap between sections is 24px (--gap-lg)

#### Scenario: Mobile single-column layout

**Given** the viewport width is less than 768px
**When** the dashboard renders
**Then** a single-column layout is displayed
**And** page padding reduces to 16px (--gap-md)
**And** gap between cards is 16px (--gap-md)

---

### Requirement: Left Column SHALL contain Market Index Charts and Watchlist

The left column SHALL contain the MarketIndexChart component at the top and WatchlistPanel below, with proper spacing between components.

**Rationale:** Market data grouping provides traders with market context before reviewing portfolio data.

**Acceptance Criteria:**
- MarketIndexChart appears at top of left column
- WatchlistPanel appears below MarketIndexChart
- Gap between components: 24px (--gap-lg)

#### Scenario: Left column component order

**Given** the dashboard is rendered on desktop
**When** viewing the left column
**Then** MarketIndexChart appears at the top
**And** WatchlistPanel appears below it
**And** gap between them is 24px (--gap-lg)

---

### Requirement: Right Column SHALL contain Portfolio and Account Information

The right column SHALL contain portfolio visualization and account data components in a specific order for logical information hierarchy.

**Rationale:** Logical ordering from portfolio overview to actionable signals supports trading workflow.

**Acceptance Criteria:**
- Components ordered: PortfolioChart, Account Summary, Open Positions, Latest Signals, AI Recommend
- Gap between each component: 24px (--gap-lg)
- All cards use elevated variant styling

#### Scenario: Right column component order

**Given** the dashboard is rendered on desktop
**When** viewing the right column
**Then** components appear in this order from top to bottom:
1. PortfolioChart (pie chart)
2. Account Summary card
3. Open Positions card
4. Latest Signals card
5. AI Recommend button
**And** gap between each is 24px (--gap-lg)

---

## REMOVED Requirements

### Requirement: Dashboard SHALL NOT display Horizontal Analytics StatCards Section

The previous horizontal analytics layout with StatCards grid is removed. This data is consolidated into the Account Summary card.

**Reason:** Two-column layout consolidates stat information into existing cards.
**Migration:** StatCard data (Total Money, Total Earn, Total Loss, Net P/L) moves to Account Summary.

#### Scenario: StatCards grid no longer renders

**Given** the dashboard is loaded
**When** the layout renders
**Then** the StatCards grid (Total Money, Total Earn, Total Loss, Net P/L) is not displayed as a separate section
**And** this data is consolidated in Account Summary card

---

## Theme Compliance

| Element | CSS Variable | Expected Value |
|---------|--------------|----------------|
| Main container padding | `--gap-lg` | `24px` |
| Column gap | `--gap-xl` | `32px` |
| Card gap | `--gap-lg` | `24px` |
| Mobile padding | `--gap-md` | `16px` |
| Mobile gaps | `--gap-md` | `16px` |

---

## Related Capabilities

- `market-index-chart` - Component displayed in left column
