# Design: GST Frontend Core Architecture

## Overview
This document captures the architectural decisions for building the GST frontend, a React-based trading intelligence platform for the Vietnam stock market.

## Architecture Principles

### 1. Component-Driven Development
**Decision**: Build UI as a composition of small, reusable components.

**Rationale**:
- Testability: Each component can be tested in isolation
- Maintainability: Changes are localized to specific components
- Reusability: Common patterns (cards, charts, meters) used across features
- Developer experience: Clear separation of concerns

**Trade-offs**:
- ✅ Better testing coverage
- ✅ Easier to reason about individual pieces
- ⚠️ More files to manage
- ⚠️ Need clear naming conventions

### 2. Functional Domain Organization
**Decision**: Organize code by trading domain, not technical layers.

**Structure**:
```
src/
├── features/
│   ├── market/          # Phase 1: Charts, indicators
│   ├── regime/          # Phase 2: Market context
│   ├── scanner/         # Phase 3: Setup discovery
│   ├── risk/            # Phase 4: Position planning
│   ├── execution/       # Phase 5: Order placement
│   ├── monitoring/      # Phase 6: Position tracking
│   └── analytics/       # Phase 7: Performance review
├── shared/
│   ├── components/      # Reusable UI (Card, Badge, Chart)
│   ├── hooks/           # Custom React hooks
│   ├── utils/           # Helper functions
│   └── types/           # TypeScript definitions
├── services/
│   ├── api/             # REST API client
│   ├── websocket/       # Real-time data client
│   └── vietnam/         # Vietnam market rules engine
└── context/             # Global state management
```

**Rationale**:
- Maps directly to user mental model (market → analysis → execution → review)
- Each domain can be developed/tested independently
- Easy to locate features when debugging
- Aligns with the 11-phase structure in project proposal

**Trade-offs**:
- ✅ Intuitive for developers
- ✅ Easier onboarding
- ⚠️ Some code duplication across domains
- ⚠️ Shared utilities need careful management

### 3. State Management Strategy
**Decision**: Use React Context for global state, local state for component-specific data.

**Context Providers**:
- `MarketDataContext`: Real-time prices, OHLCV, indicators
- `RegimeContext`: Current regime, scores, VN-Index status
- `SetupsContext`: Scanned setups, filters, selections
- `PositionsContext`: Active trades, P&L, stop levels
- `PerformanceContext`: Metrics, equity curve
- `WebSocketContext`: Connection status, subscriptions

**Rationale**:
- Simple enough for current complexity level
- Native React solution, no additional library
- Easy to debug with React DevTools
- Can migrate to Zustand later if needed

**Trade-offs**:
- ✅ No external dependencies
- ✅ Simple mental model
- ⚠️ Context re-renders can be inefficient (mitigate with memoization)
- ⚠️ May need refactor if state grows significantly

**Future Consideration**: If we see performance issues or state complexity grows, migrate to Zustand for better performance and DevTools.

### 4. Real-Time Data Flow
**Decision**: WebSocket connection managed by context, components subscribe to specific data streams.

**Architecture**:
```
WebSocket Server
      ↓
WebSocketContext (connection manager)
      ↓
MarketDataContext (data normalizer)
      ↓
Individual Components (subscribers)
```

**Data Flow**:
1. WebSocketContext establishes connection on mount
2. Components register subscriptions (e.g., "FPT price updates")
3. WebSocketContext routes messages to appropriate contexts
4. Contexts normalize and store data
5. Components re-render with new data

**Rationale**:
- Centralized connection management
- Automatic reconnection on disconnect
- Efficient subscription model (only get what you need)
- Easy to add/remove data streams

**Trade-offs**:
- ✅ Single WebSocket connection
- ✅ Automatic reconnection logic
- ⚠️ Need careful subscription cleanup to avoid memory leaks
- ⚠️ Message routing adds small overhead

### 5. Vietnam Market Rules Engine
**Decision**: Create a dedicated `vietnam/` service module that encapsulates all market-specific logic.

**Module Responsibilities**:
- Price limit validation (±7% HOSE, ±10% HNX)
- Trading session detection
- T+2 settlement calculations
- Gap risk calculations
- Lot size adjustments (100 shares minimum)

**Example**:
```typescript
// services/vietnam/priceLimit.ts
export function validateStopPrice(
  entryPrice: number,
  stopPrice: number,
  exchange: 'HOSE' | 'HNX'
): { valid: boolean; reason?: string } {
  const limit = exchange === 'HOSE' ? 0.07 : 0.10;
  const minPrice = entryPrice * (1 - limit);
  
  if (stopPrice < minPrice) {
    return {
      valid: false,
      reason: `Stop ${stopPrice} below ${exchange} daily limit ${minPrice}`
    };
  }
  
  return { valid: true };
}
```

**Rationale**:
- Vietnam rules are complex and non-negotiable
- Centralized logic prevents bugs from scattered validation
- Easy to test in isolation
- Can be reused across all features

**Trade-offs**:
- ✅ Single source of truth
- ✅ Comprehensive testing possible
- ⚠️ Need to keep updated with regulatory changes
- ⚠️ All developers must use this module

### 6. Charting Library Selection
**Decision**: Use **Lightweight Charts** by TradingView (tentative).

**Options Considered**:
| Library | Pros | Cons | Decision |
|---------|------|------|----------|
| Recharts | Simple, React-native | Limited financial chart support | ❌ |
| Lightweight Charts | Fast, financial-focused, free | Lower-level API | ✅ Preferred |
| TradingView Widget | Professional, full-featured | Paid for advanced features | ⚠️ Backup |
| D3.js | Maximum flexibility | Steep learning curve | ❌ |

**Rationale**:
- Lightweight Charts is optimized for financial data
- Handles large datasets efficiently
- Free and open-source
- Can render candlesticks, volume, overlays
- Good documentation

**Trade-offs**:
- ✅ Performance optimized for OHLCV data
- ✅ Free tier sufficient for our needs
- ⚠️ Not React-native (need wrapper component)
- ⚠️ Custom styling required

**Open Question**: Need to test with Vietnam market data volume to confirm performance.

### 7. Form Management
**Decision**: Use **React Hook Form** + **Zod** for forms and validation.

**Rationale**:
- React Hook Form: Minimal re-renders, good performance
- Zod: Type-safe schema validation that integrates with TypeScript
- Combined: Strong typing + runtime validation

**Example**:
```typescript
const riskCalculatorSchema = z.object({
  capital: z.number().positive(),
  riskPercent: z.number().min(0.1).max(5),
  entryPrice: z.number().positive(),
  stopPrice: z.number().positive()
}).refine(
  (data) => data.stopPrice < data.entryPrice,
  { message: "Stop must be below entry" }
);
```

**Trade-offs**:
- ✅ Type safety across form lifecycle
- ✅ Excellent DX with autocomplete
- ⚠️ Two dependencies to learn
- ⚠️ Schema definitions add boilerplate

### 8. Error Boundary Strategy
**Decision**: Wrap each major domain in an ErrorBoundary with contextual fallback UI.

**Structure**:
```tsx
<App>
  <ErrorBoundary fallback={<AppCrashFallback />}>
    <MarketFeature />  {/* Has own ErrorBoundary */}
    <RiskFeature />    {/* Has own ErrorBoundary */}
    ...
  </ErrorBoundary>
</App>
```

**Rationale**:
- One feature crashing shouldn't break entire app
- Users can continue using other features
- Better error reporting with contextual information

**Trade-offs**:
- ✅ Resilient to component failures
- ✅ Better UX during errors
- ⚠️ Need fallback UI for each boundary
- ⚠️ Slightly more complex setup

### 9. Testing Strategy
**Decision**: Multi-layer testing approach.

**Test Pyramid**:
```
    /\
   /E2E\        ← 10% (Critical user flows)
  /──────\
 /Integra.\     ← 30% (Component + context)
/──────────\
  Unit Tests    ← 60% (Utils, hooks, services)
```

**Testing Library Choices**:
- Unit/Integration: Vitest + React Testing Library
- E2E: Playwright (when needed)
- Mocking: MSW (Mock Service Worker) for API

**Priority Testing Areas**:
1. **Critical**: Vietnam market rules (price limits, settlement)
2. **Critical**: Risk calculations (position sizing, R:R)
3. **High**: Technical indicator calculations
4. **High**: Trade scoring logic
5. **Medium**: UI component rendering
6. **Medium**: WebSocket message handling

**Rationale**:
- Financial calculations must be 100% correct
- Market rules violations could cause real losses
- UI bugs are lower priority than calculation bugs

### 10. Performance Considerations

#### Memoization Strategy
```tsx
// Expensive calculations
const positionSize = useMemo(() => 
  calculatePositionSize(capital, risk, entry, stop),
  [capital, risk, entry, stop]
);

// Expensive renders
const ChartComponent = memo(({ data }) => {
  return <LightweightChart data={data} />;
});
```

#### Virtual Scrolling
For large datasets (e.g., scanner with 100+ setups), use `react-window` or `@tanstack/react-virtual`.

#### Code Splitting
```tsx
const AnalyticsFeature = lazy(() => import('./features/analytics'));
const BacktestingFeature = lazy(() => import('./features/backtesting'));
```

**Rationale**:
- Real-time data updates can cause frequent re-renders
- Large datasets (historical OHLCV) need efficient rendering
- Not all features used simultaneously (split bundles)

## Data Models

### Key TypeScript Interfaces

```typescript
// Market Data
interface OHLCVBar {
  time: number;        // Unix timestamp
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface TechnicalIndicators {
  rsi: number;
  macd: { value: number; signal: number; histogram: number };
  stochastic: { k: number; d: number };
  adx: number;
  atr: number;
  sma: Record<number, number>;  // { 20: 85000, 50: 82000 }
  ema: Record<number, number>;
  bollingerBands: { upper: number; middle: number; lower: number };
  vwap: number;
}

// Market Regime
interface MarketRegime {
  regime: 'BULL' | 'BEAR' | 'RANGE' | 'TRANSITION';
  score: number;       // 3-12
  breakdown: {
    adx: number;       // 0-3
    directional: number;  // 0-3
    volatility: number;   // 0-3
    volume: number;       // 0-3
  };
  vnIndexStatus: {
    value: number;
    change: number;
    aboveMA50: boolean;
  };
  recommendation: string;
  positionMultiplier: number;  // 0-1
}

// Trade Setup
interface TradeSetup {
  symbol: string;
  setupType: 'PULLBACK' | 'BREAKOUT' | 'CROSSOVER' | 'MEAN_REVERSION';
  score: number;       // 0-13
  scoreBreakdown: {
    trend: number;     // 0-3
    setup: number;     // 0-3
    momentum: number;  // 0-2
    riskReward: number;  // 0-2
    context: number;   // 0-3
  };
  entry: number;
  stop: number;
  targets: number[];
  riskRewardRatio: number;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  narrative: string;
  triggers: string[];
  chart?: OHLCVBar[];
}

// Risk Calculation
interface RiskCalculation {
  capital: number;
  riskPercent: number;
  entryPrice: number;
  stopPrice: number;
  
  // Calculated
  positionSize: number;     // Shares
  positionValue: number;    // VND
  riskAmount: number;       // VND
  actualRiskPercent: number;
  riskRewardRatio: number;
  viable: boolean;
  warnings: string[];
}

// Position
interface Position {
  id: string;
  symbol: string;
  entryPrice: number;
  entryDate: Date;
  size: number;
  currentPrice: number;
  currentStop: number;
  targets: { price: number; size: number; hit: boolean }[];
  
  // Metrics
  unrealizedPL: number;
  unrealizedPLPercent: number;
  rMultiple: number;
  daysHeld: number;
  
  // Stop management
  stopHistory: { date: Date; price: number; reason: string }[];
  trailingSuggestion?: { price: number; method: string; reason: string };
}

// Performance Metrics
interface PerformanceMetrics {
  totalTrades: number;
  winRate: number;
  expectancy: number;
  profitFactor: number;
  sharpeRatio: number;
  sortinoRatio: number;
  calmarRatio: number;
  maxDrawdown: number;
  maxDrawdownDuration: number;
  recoveryFactor: number;
  avgWin: number;
  avgLoss: number;
  largestWin: number;
  largestLoss: number;
  consecutiveWins: number;
  consecutiveLosses: number;
  
  // Distributions
  rMultipleDistribution: Record<string, number>;
  setupTypeDistribution: Record<string, { winRate: number; avgR: number; count: number }>;
  regimeDistribution: Record<string, { winRate: number; avgR: number; count: number }>;
}
```

## API Integration

### REST API Client
```typescript
// services/api/client.ts
class APIClient {
  private baseURL: string;
  
  async getOHLCV(symbol: string, interval: string, limit: number) {
    return this.get<OHLCVBar[]>(`/market/ohlcv/${symbol}`, { interval, limit });
  }
  
  async getIndicators(symbol: string, interval: string) {
    return this.get<TechnicalIndicators>(`/indicators/${symbol}`, { interval });
  }
  
  async getCurrentRegime() {
    return this.get<MarketRegime>('/regime/current');
  }
  
  async scanSetups(filters: SetupFilters) {
    return this.get<TradeSetup[]>('/setups/scan', filters);
  }
  
  async calculateRisk(params: RiskCalculationParams) {
    return this.post<RiskCalculation>('/risk/calculate', params);
  }
  
  async getActivePositions() {
    return this.get<Position[]>('/positions/active');
  }
  
  async getPerformanceMetrics(period?: string) {
    return this.get<PerformanceMetrics>('/performance/metrics', { period });
  }
}
```

### WebSocket Client
```typescript
// services/websocket/client.ts
class WebSocketClient {
  private ws: WebSocket;
  private subscriptions: Map<string, Set<Callback>>;
  
  connect(url: string): Promise<void>
  disconnect(): void
  
  subscribe(channel: string, callback: Callback): () => void
  unsubscribe(channel: string, callback: Callback): void
  
  // Channels
  subscribeToPrice(symbol: string, callback: (price: number) => void)
  subscribeToTick(symbol: string, callback: (tick: Tick) => void)
  subscribeToMarketIndex(callback: (index: MarketIndex) => void)
}
```

## Security Considerations

### 1. Input Validation
- All user inputs validated with Zod schemas
- Vietnam market rules enforced client-side (UX) and server-side (security)
- Price inputs sanitized to prevent injection

### 2. API Authentication
- JWT tokens stored in httpOnly cookies (backend handles this)
- Token refresh on 401 responses
- Logout clears all client-side state

### 3. WebSocket Security
- Authentication required for WebSocket connection
- Subscribe to only authorized symbols
- Rate limiting on subscription requests

### 4. Sensitive Data
- Account balances never logged
- P&L data cleared on logout
- No PII stored in localStorage

## Accessibility

### WCAG 2.1 AA Compliance (Progressive)
- Color contrast ratio ≥ 4.5:1
- Keyboard navigation support
- Screen reader labels for charts
- Focus indicators on interactive elements

**Note**: Initial version focuses on desktop traders with good vision. Accessibility improvements planned for future iterations.

## Internationalization

### Phase 1: Vietnamese + English
- UI text: Vietnamese primary, English secondary
- Numbers: Vietnam format (85.000 VND)
- Dates: Vietnamese locale (dd/MM/yyyy)
- Currency: VND symbol

**Note**: Full i18n system deferred to avoid over-engineering. Current approach uses simple const objects.

## Monitoring & Observability

### Error Tracking
- Sentry integration for production errors
- Custom error boundaries with context
- API error logging

### Analytics (Future)
- Feature usage tracking
- Performance metrics (chart render time)
- User journey flows

**Note**: Analytics deferred to post-MVP to focus on core functionality.

## Migration Path

### Future Scalability Considerations

**If State Grows Complex**:
- Migrate from Context to Zustand
- Keep Context API structure (minimal code changes)

**If Bundle Size Grows**:
- Implement route-based code splitting
- Lazy load heavy features (backtesting, advanced analytics)

**If Real-time Performance Degrades**:
- Implement WebWorkers for indicator calculations
- Use canvas-based rendering for charts (instead of SVG)

**If Need Mobile Support**:
- Implement responsive breakpoints
- Consider separate mobile app (React Native)

## Conclusion

This architecture prioritizes:
1. **Correctness**: Vietnam market rules and risk calculations must be perfect
2. **Developer Experience**: Clear organization, strong typing, good tooling
3. **Performance**: Efficient rendering for real-time data
4. **Maintainability**: Modular, testable, well-documented

Trade-offs are made consciously, with migration paths identified for future needs.
