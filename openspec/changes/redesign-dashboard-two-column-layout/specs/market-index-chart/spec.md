# Market Index Chart Capability

**Capability ID:** `market-index-chart`
**Status:** New (ADDED)
**Category:** Dashboard Components
**Last Updated:** 2026-01-14

---

## ADDED Requirements

### Requirement: System SHALL provide MarketIndexChart Component with Tab Navigation

The system SHALL provide a React component that displays Vietnamese market indices (VNINDEX, VN30, VN100) with tab-based navigation for switching between indices.

**Rationale:** Traders need quick access to major market indices to assess overall market conditions before making trading decisions.

**Acceptance Criteria:**
- Component renders with VNINDEX as default active tab
- Component provides clickable tabs for VNINDEX, VN30, and VN100
- Active tab displays accent color with glow effect per theme
- Switching tabs updates the displayed chart and values
- Component consumes data from MarketDataContext

#### Scenario: User views default VNINDEX

**Given** the dashboard is loaded
**When** the MarketIndexChart component renders
**Then** VNINDEX tab is active by default
**And** the VNINDEX line chart is displayed
**And** current value, change, and change percent are shown

#### Scenario: User switches to VN30 tab

**Given** the MarketIndexChart is displaying VNINDEX
**When** user clicks the "VN30" tab
**Then** the VN30 tab becomes active with accent color and glow
**And** the VN30 line chart replaces the VNINDEX chart
**And** VN30 current value and change are displayed

#### Scenario: User switches to VN100 tab

**Given** the MarketIndexChart is displaying any index
**When** user clicks the "VN100" tab
**Then** the VN100 tab becomes active
**And** the VN100 line chart is displayed
**And** VN100 current value and change are shown

---

### Requirement: System SHALL render Line Chart with Fintech Neon Theme Styling

The system SHALL render line charts following the Fintech Neon Theme design system with appropriate colors and glow effects based on trend direction.

**Rationale:** Consistent theme application ensures professional appearance and quick visual identification of positive vs negative trends.

**Acceptance Criteria:**
- Positive trend uses success color (#4ade80) with glow effect
- Negative trend uses danger color (#ef4444) without glow
- Chart uses glass-style tooltip with backdrop blur
- Grid lines use theme border color with dash pattern
- Chart container uses panel background with proper border radius

#### Scenario: Chart renders with positive trend

**Given** the selected index has positive change percent
**When** the chart renders
**Then** the line uses `var(--success)` color (#4ade80)
**And** a glow effect is applied via drop-shadow
**And** the change value displays in green

#### Scenario: Chart renders with negative trend

**Given** the selected index has negative change percent
**When** the chart renders
**Then** the line uses `var(--danger)` color (#ef4444)
**And** no glow effect is applied
**And** the change value displays in red

#### Scenario: Chart displays tooltip on hover

**Given** the chart is rendered
**When** user hovers over a data point
**Then** a glass-effect tooltip appears
**And** tooltip shows the value and timestamp
**And** tooltip uses backdrop-filter blur

---

### Requirement: System SHALL display Current Index Value Prominently

The system SHALL display the current index value with large typography and change information with appropriate color coding.

**Rationale:** Quick readability of current values enables fast trading decisions.

**Acceptance Criteria:**
- Current value displayed in large font (--text-3xl)
- Numbers use tabular-nums font variant for alignment
- Change and change percent displayed with color coding
- Positive values show in success color with + prefix
- Negative values show in danger color

#### Scenario: Value display formatting

**Given** an index with value 1265.43 and change +3.21 (+0.25%)
**When** the component renders
**Then** "1,265.43" is displayed in large font (--text-3xl)
**And** "+3.21 (+0.25%)" is displayed below in success color
**And** numbers use tabular-nums font variant

---

### Requirement: System SHALL handle Loading and Empty States

The system SHALL show appropriate loading skeleton and empty state messages when data is unavailable.

**Rationale:** Users need visual feedback during data loading to understand system status.

**Acceptance Criteria:**
- Loading skeleton displays during data fetch
- Skeleton matches chart dimensions
- Empty state shows informative message when no data

#### Scenario: Initial data loading

**Given** the market data is loading
**When** the component renders
**Then** a LoadingSkeleton is displayed
**And** the skeleton matches the chart dimensions

---

### Requirement: System SHALL update on MarketDataContext Changes

The system SHALL reactively update when MarketDataContext provides new market data values.

**Rationale:** Real-time updates keep traders informed of market movements.

**Acceptance Criteria:**
- Chart updates when context emits new data
- Value displays update immediately
- No unnecessary re-renders on unrelated context changes

#### Scenario: Real-time data update

**Given** the chart is displaying VNINDEX
**When** MarketDataContext emits new data
**Then** the chart line updates with new data point
**And** current value updates immediately
**And** change and changePercent recalculate

---

## Theme Compliance

| Element | CSS Variable | Expected Value |
|---------|--------------|----------------|
| Card background | `--panel` | `#1e1f23` |
| Active tab | `--accent` | `#dadd56` |
| Tab glow | `--glow-accent` | neon shadow |
| Positive line | `--success` | `#4ade80` |
| Negative line | `--danger` | `#ef4444` |
| Grid lines | `--border` | `rgba(255,255,255,0.06)` |
| Tooltip bg | `--glass-bg` | `rgba(30,31,35,0.7)` |
| Border radius | `--radius-lg` | `20px` |
| Padding | `--gap-lg` | `24px` |

---

## Related Capabilities

- `dashboard-layout` - Parent layout that positions this component
