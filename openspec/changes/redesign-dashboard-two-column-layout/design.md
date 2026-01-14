# Design: Redesign Dashboard Two-Column Layout

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Dashboard Header                             │
├──────────────────────────────┬──────────────────────────────────────┤
│       LEFT COLUMN (50%)      │        RIGHT COLUMN (50%)            │
├──────────────────────────────┼──────────────────────────────────────┤
│  ┌────────────────────────┐  │  ┌────────────────────────────────┐  │
│  │   Market Index Charts  │  │  │     Portfolio Pie Chart        │  │
│  │  VNINDEX | VN30 | VN100│  │  │    (existing PortfolioChart)   │  │
│  │  [Line charts with     │  │  │                                │  │
│  │   sparklines/full]     │  │  └────────────────────────────────┘  │
│  └────────────────────────┘  │  ┌────────────────────────────────┐  │
│  ┌────────────────────────┐  │  │      Account Summary Card      │  │
│  │    Watchlist Panel     │  │  └────────────────────────────────┘  │
│  │  (existing component)  │  │  ┌────────────────────────────────┐  │
│  │                        │  │  │      Open Positions Card       │  │
│  │                        │  │  └────────────────────────────────┘  │
│  │                        │  │  ┌────────────────────────────────┐  │
│  │                        │  │  │      Latest Signals Card       │  │
│  │                        │  │  └────────────────────────────────┘  │
│  │                        │  │  ┌────────────────────────────────┐  │
│  └────────────────────────┘  │  │    AI Recommend Button/Card    │  │
│                              │  └────────────────────────────────┘  │
└──────────────────────────────┴──────────────────────────────────────┘
```

## Component Design

### 1. MarketIndexChart Component (New)

**Location:** `src/features/dashboard/components/MarketIndexChart/`

**Purpose:** Display priority line charts for Vietnamese market indices

**Props Interface:**
```typescript
interface MarketIndexChartProps {
  indices: IndexData[];
  timeframe?: '1D' | '1W' | '1M';
  isLoading?: boolean;
}

interface IndexData {
  name: string;           // "VNINDEX", "VN30", "VN100"
  value: number;          // Current value
  change: number;         // Point change
  changePercent: number;  // Percentage change
  data: DataPoint[];      // Historical data for chart
}

interface DataPoint {
  timestamp: number;
  value: number;
}
```

**Visual Design (per Fintech Neon Theme):**
- Background: `var(--panel)` with `var(--shadow)` elevation
- Chart lines: `var(--accent)` for primary, status colors for trend indication
- Glow effect: `drop-shadow(var(--glow-accent))` on positive indices
- Grid lines: `var(--border)` with `stroke-dasharray: 4 4`
- Tooltips: Glass effect with `var(--glass-bg)` and backdrop-filter
- Tab navigation for switching between indices

### 2. Extended Mock Data Service

**Location:** `src/services/mock/marketData.ts`

**Additions:**
```typescript
interface ExtendedMarketData extends MarketData {
  indices: {
    vnIndex: IndexData;
    vn30: IndexData;
    vn100: IndexData;
  };
}
```

**Data Generation:**
- VN30: Derived from VNINDEX with slight variation (beta ~1.1)
- VN100: Derived from VNINDEX with lower volatility (beta ~0.9)
- Historical data: Generate 50 data points for intraday view

### 3. Dashboard Layout Structure

**CSS Grid Layout:**
```css
.dashboard__main {
  display: grid;
  grid-template-columns: 1fr 1fr;  /* 50% / 50% */
  gap: var(--gap-xl);              /* 32px between columns */
}

.dashboard__left-column {
  display: flex;
  flex-direction: column;
  gap: var(--gap-lg);              /* 24px between cards */
}

.dashboard__right-column {
  display: flex;
  flex-direction: column;
  gap: var(--gap-lg);              /* 24px between cards */
}
```

**Responsive Breakpoints:**
- Desktop (≥1024px): Two-column layout
- Tablet (768-1023px): Single column, index charts first
- Mobile (<768px): Single column, compact cards

## Theme Compliance

All new components must adhere to `docs/FINTECH_NEON_THEME.md`:

| Element | Token | Value |
|---------|-------|-------|
| Card background | `--panel` | `#1e1f23` |
| Card border | `--border` | `rgba(255, 255, 255, 0.06)` |
| Chart line (accent) | `--accent` | `#dadd56` |
| Positive trend | `--success` | `#4ade80` |
| Negative trend | `--danger` | `#ef4444` |
| Card padding | `--gap-lg` | `24px` |
| Border radius | `--radius-lg` | `20px` |

## Data Flow

```
MarketDataContext
       │
       ├──► MarketIndexChart
       │         └── Displays VNINDEX, VN30, VN100
       │
       ├──► WatchlistPanel (existing)
       │
AccountContext
       │
       ├──► PortfolioChart (existing)
       │
       ├──► AccountSummaryCard (inline, existing)
       │
PositionsContext
       │
       └──► OpenPositionsCard (inline, existing)
       
SetupsContext
       │
       └──► LatestSignalsCard (inline, existing)
       
RecommendModal (existing)
       │
       └──► RecommendButton (existing)
```

## File Changes Summary

| File | Action | Description |
|------|--------|-------------|
| `src/features/dashboard/components/MarketIndexChart/` | Create | New component folder |
| `src/features/dashboard/components/MarketIndexChart/MarketIndexChart.tsx` | Create | Main chart component |
| `src/features/dashboard/components/MarketIndexChart/MarketIndexChart.css` | Create | Component styles |
| `src/features/dashboard/components/MarketIndexChart/index.ts` | Create | Barrel export |
| `src/services/mock/marketData.ts` | Modify | Add VN30, VN100 data |
| `src/features/dashboard/DashboardView.tsx` | Modify | Restructure layout |
| `src/features/dashboard/DashboardView.css` | Modify | Two-column grid layout |

## Trade-offs

### Decision 1: Separate MarketIndexChart vs Tabs in Single Card
**Chosen:** Tabs in single card with chart view toggle
**Rationale:** 
- Reduces vertical space consumption
- Professional trading platforms use tabbed index views
- Single card provides cohesive visual unit

### Decision 2: Real-time vs Periodic Updates
**Chosen:** Periodic updates (3-second intervals via existing mock service)
**Rationale:**
- Consistent with existing MarketDataContext pattern
- Avoids over-engineering before WebSocket integration
- Sufficient for current mock data setup

### Decision 3: Chart Library
**Chosen:** Recharts (existing dependency)
**Rationale:**
- Already used in PortfolioChart and WatchlistPanel
- No additional bundle size
- Consistent API across dashboard

## Performance Considerations

1. **Chart Rendering**: Use `ResponsiveContainer` with fixed height to prevent layout thrashing
2. **Data Updates**: Throttle chart updates to max 1Hz to prevent excessive re-renders
3. **Lazy Loading**: Consider lazy loading chart components for initial page load optimization
