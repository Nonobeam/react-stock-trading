# Design: Phase 1 Trading UI

## Architecture Overview

This change implements a component-based React architecture with clear separation between:
- **View Components**: Screen-level components (Dashboard, Watchlist, Portfolio, Signals)
- **Feature Components**: Domain-specific components within each feature
- **Shared Components**: Reusable UI primitives
- **Context Providers**: State management for real-time data
- **Mock Services**: Simulated data generation for development

## Component Hierarchy

```
App
├── ErrorBoundary
├── Context Providers
│   ├── MarketDataContext (VN-Index, market status, regime)
│   ├── AccountContext (capital, P&L, risk)
│   ├── PositionsContext (open positions, closed trades)
│   ├── SetupsContext (watchlist, signals)
│   └── PerformanceContext (analytics data)
├── Navigation (horizontal tabs)
└── Routes
    ├── DashboardView
    │   ├── DashboardHeader
    │   ├── PortfolioSummaryCard
    │   ├── RiskGauge
    │   ├── SignalCardList
    │   ├── AIInsightsPanel
    │   └── OpenPositionsTable
    ├── WatchlistView
    │   ├── WatchlistHeader (search, filter, sort)
    │   ├── WatchlistTable
    │   └── StockDetailPanel (slide-in)
    ├── PortfolioView
    │   ├── PortfolioHeader
    │   └── Tabs
    │       ├── CapitalTab (cards, pie chart, risk allocation)
    │       ├── PositionsTab (detailed position cards)
    │       ├── HistoryTab (closed trades table)
    │       └── AnalyticsTab (charts, metrics)
    └── SignalsView
        ├── SignalsTabs (active/watch/dismissed/history)
        ├── SignalCardDetailed
        └── SignalActionPanel
```

## State Management Strategy

### Context Providers (no Redux for Phase 1)

**MarketDataContext**
```typescript
{
  vnIndex: { value: number, change: number, changePercent: number },
  marketStatus: 'OPEN' | 'CLOSED' | 'PRE_OPEN' | 'BREAK',
  marketRegime: 'BULL' | 'BEAR' | 'RANGE' | 'TRANSITION',
  marketScore: number, // 0-12
  lastUpdate: Date
}
```

**AccountContext**
```typescript
{
  totalCapital: number,
  availableCash: number,
  lockedCapital: number,
  inPositions: number,
  totalPnL: number,
  totalPnLPercent: number,
  todayPnL: number,
  todayPnLPercent: number,
  aggregateRisk: number, // percentage
  maxRisk: number, // 6%
  settlementSchedule: Array<{ date: Date, amount: number, source: string }>
}
```

**PositionsContext**
```typescript
{
  openPositions: Array<Position>,
  closedPositions: Array<ClosedPosition>,
  positionById: Map<string, Position>
}

interface Position {
  id: string,
  symbol: string,
  entryPrice: number,
  entryDate: Date,
  shares: number,
  currentPrice: number,
  stopLoss: number,
  targets: Array<{ level: number, percentage: number, action: string }>,
  entryValue: number,
  currentValue: number,
  grossPnL: number,
  entryCommission: number,
  exitCommission: number,
  exitTax: number,
  netPnL: number,
  netPnLPercent: number,
  rMultiple: number,
  daysHeld: number,
  setupType: string,
  risk: number, // percentage of portfolio
}
```

**SetupsContext**
```typescript
{
  watchlist: Array<WatchlistStock>,
  activeSignals: Array<Signal>,
  watchSignals: Array<Signal>,
  dismissedSignals: Array<Signal>,
  signalHistory: Array<Signal>
}

interface WatchlistStock {
  symbol: string,
  companyName: string,
  currentPrice: number,
  priceChange: number,
  priceChangePercent: number,
  volume: number,
  volumePercentile: number,
  score: number, // 0-10
  setupType: string,
  distanceStatus: string,
  distanceValue: string,
  daysInSetup: number,
  readiness: 'READY' | 'WATCH' | 'SOON' | 'NOT_YET',
  alertEnabled: boolean
}
```

## Theme Implementation

### CSS Variables (Applied at :root)
All design tokens from `docs/FINTECH_NEON_THEME.md` will be loaded as CSS custom properties:

```css
:root {
  /* Core Colors */
  --bg: #0f0f10;
  --bg-secondary: #1a1a1c;
  --panel: #1e1f23;
  --accent: #dadd56;
  --text: #e8e9ed;
  --text-secondary: #9396a3;
  --muted: #6b6d7a;
  
  /* Elevation */
  --panel-elevated: #25262b;
  --panel-hover: #2b2d33;
  
  /* Status */
  --success: #4ade80;
  --warning: #fbbf24;
  --danger: #ef4444;
  
  /* Spacing (8px base) */
  --gap-xs: 8px;
  --gap-sm: 12px;
  --gap-md: 16px;
  --gap-lg: 24px;
  --gap-xl: 32px;
  
  /* Radius */
  --radius-sm: 8px;
  --radius: 16px;
  --radius-lg: 20px;
  
  /* Shadows */
  --shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
  --shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.5);
  --glow-accent: 0 0 20px rgba(218, 221, 86, 0.3);
}
```

### Component Styling Approach
- **CSS Modules** for component-specific styles
- All colors reference CSS variables (no hardcoded hex)
- Consistent spacing using --gap-* variables
- Hover effects with 200-300ms transitions

## Vietnam-Specific Calculations

### Commission & Tax Module
```typescript
// src/services/vietnam/commission.ts
const COMMISSION_RATE = 0.0025; // 0.25%
const TAX_RATE = 0.001; // 0.1%
const MINIMUM_COMMISSION = 500; // 500 VND minimum

export function calculateEntryCommission(entryValue: number): number {
  return Math.max(entryValue * COMMISSION_RATE, MINIMUM_COMMISSION);
}

export function calculateExitCommission(exitValue: number): number {
  return Math.max(exitValue * COMMISSION_RATE, MINIMUM_COMMISSION);
}

export function calculateExitTax(exitValue: number): number {
  return exitValue * TAX_RATE;
}

export function calculateNetPnL(
  grossPnL: number,
  entryCommission: number,
  exitCommission: number,
  exitTax: number
): number {
  return grossPnL - entryCommission - exitCommission - exitTax;
}
```

### Settlement Module
```typescript
// src/services/vietnam/settlement.ts
export function getSettlementDate(transactionDate: Date): Date {
  // T+2 settlement in Vietnam
  const settlement = new Date(transactionDate);
  let daysToAdd = 2;
  
  // Skip weekends and holidays
  while (daysToAdd > 0) {
    settlement.setDate(settlement.getDate() + 1);
    if (!isWeekend(settlement) && !isHoliday(settlement)) {
      daysToAdd--;
    }
  }
  
  return settlement;
}
```

## Real-Time Update Strategy

### Mock Real-Time Service
```typescript
// src/services/mock/realtime.ts
class MockRealtimeService {
  private intervals: Map<string, NodeJS.Timer> = new Map();
  
  // Simulate price updates every 3 seconds
  startPriceUpdates(onUpdate: (data: PriceUpdate) => void) {
    const interval = setInterval(() => {
      const randomStock = selectRandomStock();
      const priceChange = (Math.random() - 0.5) * 0.02; // ±1%
      onUpdate({
        symbol: randomStock,
        price: calculateNewPrice(randomStock, priceChange),
        timestamp: new Date()
      });
    }, 3000);
    
    this.intervals.set('prices', interval);
  }
  
  stopAllUpdates() {
    this.intervals.forEach(interval => clearInterval(interval));
    this.intervals.clear();
  }
}
```

### Flash Animation on Price Change
```css
.price-cell {
  transition: background-color 0.5s ease-out;
}

.price-cell.flash-up {
  animation: flashGreen 0.5s;
}

.price-cell.flash-down {
  animation: flashRed 0.5s;
}

@keyframes flashGreen {
  0% { background-color: var(--success); opacity: 0.3; }
  100% { background-color: transparent; opacity: 1; }
}

@keyframes flashRed {
  0% { background-color: var(--danger); opacity: 0.3; }
  100% { background-color: transparent; opacity: 1; }
}
```

## Responsive Design Strategy

### Breakpoints
```typescript
const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
  desktop: 1920
};
```

### Layout Transformations

**Desktop (>1024px):**
- 3-column layout for Dashboard (left panel, center, right panel)
- Full data tables with all columns
- Side panels slide in without covering content

**Tablet (768-1024px):**
- 2-column layouts
- Hide non-essential table columns
- Modals become full-screen overlays

**Mobile (<768px):**
- Single column, vertical stack
- Tables convert to card views
- Full-screen detail panels
- Bottom sheet modals

## Data Flow Patterns

### Loading States
All async data operations show loading skeletons:
```tsx
{isLoading ? <LoadingSkeleton rows={5} /> : <DataTable data={data} />}
```

### Error Handling
```tsx
<ErrorBoundary fallback={<ErrorState />}>
  <FeatureComponent />
</ErrorBoundary>
```

### Empty States
Each view has custom empty state:
```tsx
{data.length === 0 ? (
  <EmptyState
    icon="📋"
    title="No watchlist stocks"
    description="Add stocks to monitor"
    action={<Button onClick={openAddModal}>Add Stock</Button>}
  />
) : (
  <DataView data={data} />
)}
```

## Performance Optimizations

1. **Virtualized Lists**: For tables with >50 rows, use react-window
2. **Memoization**: Wrap expensive calculations with useMemo
3. **Lazy Loading**: Code-split each screen with React.lazy
4. **Debounced Search**: 300ms debounce on search inputs
5. **Throttled Updates**: Real-time updates throttled to 3s minimum interval

## Testing Strategy

### Component Tests
- Each shared component has unit tests
- Test all interactive states (hover, click, disabled)
- Test responsive behavior at each breakpoint

### Integration Tests
- Test data flow from context to components
- Test real-time update propagation
- Test navigation between screens

### Financial Calculation Tests
```typescript
describe('Vietnam Financial Calculations', () => {
  test('calculates net P&L correctly', () => {
    const position = createMockPosition({
      entryPrice: 85000,
      exitPrice: 88400,
      shares: 333
    });
    
    expect(position.netPnL).toBe(946450);
    expect(position.netPnLPercent).toBeCloseTo(3.34, 2);
  });
  
  test('handles T+2 settlement correctly', () => {
    const saleDate = new Date('2025-01-13'); // Monday
    const settlementDate = getSettlementDate(saleDate);
    expect(settlementDate).toEqual(new Date('2025-01-15')); // Wednesday
  });
});
```

## Migration Path

Since this is foundational UI:
1. Implement screens incrementally (Dashboard → Watchlist → Portfolio → Signals)
2. Build shared components first
3. Add mock data and contexts
4. Integrate screens into routing
5. Add responsive layouts
6. Polish animations and transitions

## Open Questions
1. Should we use a charting library (recharts, victory) or wait for Phase 2?
2. Do we need offline support / service worker for Phase 1?
3. Should position detail modals be routes or just modals?

## Decision Log

**2026-01-13: Context API over Redux**
Rationale: Simpler for Phase 1, avoids boilerplate. Can migrate to Redux if state becomes complex in later phases.

**2026-01-13: CSS Modules over styled-components**
Rationale: Better DX with VS Code IntelliSense, smaller bundle, aligns with existing codebase patterns.

**2026-01-13: Mock services with clear interface boundaries**
Rationale: Easy to swap for real APIs in integrate-backend-apis phase. All data fetching goes through service layer.
