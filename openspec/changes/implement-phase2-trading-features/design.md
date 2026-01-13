# Design Document: Phase 2 Trading Features

**Change ID**: `implement-phase2-trading-features`  
**Date**: 2026-01-13  
**Status**: Proposed

## Architecture Overview

Phase 2 extends the existing React + TypeScript frontend with 4 new feature modules following the established Phase 1 patterns. All features maintain strict adherence to the Fintech Neon theme design system.

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Main App Router                           │
│  Phase 1: Dashboard, Watchlist, Portfolio, Signals          │
│  Phase 2: Journal, AI Coach, Backtest, Settings  ← NEW      │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                   Context Providers                          │
│  - MarketDataContext (existing)                              │
│  - AccountContext (existing)                                 │
│  - PositionsContext (existing)                               │
│  - SetupsContext (existing)                                  │
│  - TradesContext ← NEW (journal trades)                      │
│  - SettingsContext ← NEW (user preferences)                  │
│  - ChatContext ← NEW (AI conversation state)                 │
│  - BacktestContext ← NEW (backtest configs & results)        │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                   Feature Modules                            │
│  /features/journal/     - Trade logging & analysis           │
│  /features/ai-coach/    - Conversational interface           │
│  /features/backtest/    - Strategy testing UI                │
│  /features/settings/    - Configuration screens              │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                   Shared Components                          │
│  - Card, Table, Modal, Button, Input (existing)             │
│  - MarkdownRenderer ← NEW (AI responses)                     │
│  - CodeBlock ← NEW (syntax highlighting)                     │
│  - ChartContainer ← NEW (backtest charts wrapper)            │
│  - TabNavigation ← NEW (reusable tab system)                 │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                   Services Layer                             │
│  /services/api/          - API client (existing)             │
│  /services/mock/         - Mock data generators              │
│  /services/storage/      ← NEW (localStorage wrapper)        │
│  /services/vietnam/      - VN calculations (existing)        │
│  /services/backtest/     ← NEW (backtest calculations)       │
└─────────────────────────────────────────────────────────────┘
```

## Design Decisions

### 1. Context Architecture

**Decision**: Create 4 new React contexts for Phase 2 features

**Rationale**:
- Maintains consistency with Phase 1 pattern
- Provides clean separation of concerns
- Enables easy testing and mocking
- Facilitates future backend integration

**Trade-offs**:
- More contexts = more providers in component tree
- Potential prop drilling if deeply nested
- Context updates cause re-renders of consumers

**Mitigation**: Use context splitting (separate state/actions), memoization, and selective subscriptions

### 2. Data Persistence Strategy

**Decision**: Use localStorage for Phase 2 MVP, design for future backend migration

**Rationale**:
- Enables immediate user value without backend dependency
- Settings and trades are relatively small data sets
- localStorage is synchronous and simple
- Can iterate on UX before committing to backend schema

**Trade-offs**:
- Limited to ~5-10MB storage
- No cross-device sync
- Manual serialization/deserialization
- Migration required later

**Mitigation**:
- Abstract persistence behind service layer interface
- Document data schemas clearly
- Add storage limit warnings
- Plan backend API design in parallel

**Storage Allocation**:
```typescript
interface StorageAllocation {
  settings: '~50KB',           // User preferences
  trades: '~2-5MB',            // Historical trades (limit to 500 trades)
  backtests: '~1-2MB',         // Backtest configs & results (limit to 20)
  chatHistory: '~1-2MB',       // AI conversations (limit to 50)
  watchlist: '~100KB',         // Existing from Phase 1
  positions: '~200KB',         // Existing from Phase 1
}
```

### 3. AI Coach Interface Design

**Decision**: Build full chat UI now, integrate backend LLM later

**Rationale**:
- UI is the primary user experience
- Can demonstrate value with mock responses
- Allows UX iteration without LLM costs
- Defines requirements for backend team

**Mock Response Strategy**:
```typescript
// Phase 2: Rule-based mock responses
const mockAIResponse = (message: string, context: any) => {
  if (message.includes('should I take')) {
    return generateMockTradeAnalysis(context);
  }
  if (message.includes('how am I doing')) {
    return generateMockPerformanceReview(context);
  }
  // ... pattern matching for common queries
  return 'I can help with that. [Mock response]';
};

// Future: Real LLM integration
const realAIResponse = async (message: string, context: any) => {
  return await apiClient.post('/ai/chat', { message, context });
};
```

**Trade-offs**:
- Mock responses won't be as intelligent
- May set wrong user expectations
- Extra work building mock logic

**Mitigation**:
- Clear UI indicator: "AI responses are simulated for now"
- Focus mocks on most common queries
- Design API contract clearly for future integration

### 4. Backtest Calculation Approach

**Decision**: Client-side calculations for MVP, server-side for production

**Rationale**:
- Historical data is relatively small for swing trading (years, not minutes)
- Client calculation enables offline use
- No server costs during MVP
- Can validate accuracy before backend build

**Trade-offs**:
- Performance limited by client hardware
- Large backtests (thousands of trades) may be slow
- Data must be downloaded to client

**Mitigation**:
- Use Web Workers for heavy calculations (non-blocking)
- Limit backtest scope (date range, stock count)
- Add progress indicators
- Plan server-side option for production

**Calculation Architecture**:
```typescript
// services/backtest/engine.ts
export class BacktestEngine {
  async run(config: BacktestConfig): Promise<BacktestResults> {
    // Use Web Worker for calculations
    const worker = new Worker('/workers/backtest.worker.ts');
    
    return new Promise((resolve) => {
      worker.postMessage({ config, historicalData });
      worker.onmessage = (e) => resolve(e.data);
    });
  }
}
```

### 5. Component Reusability Strategy

**Decision**: Extract common patterns into shared components immediately

**Rationale**:
- Journal, Backtest, and Settings all use tables, modals, tabs heavily
- Consistency improves UX
- Reduces code duplication
- Easier theming compliance

**New Shared Components**:

1. **TabNavigation** - Reusable tab system
   ```tsx
   <TabNavigation
     tabs={[
       { id: 'overview', label: 'Overview', icon: 'chart' },
       { id: 'details', label: 'Details', icon: 'info' }
     ]}
     activeTab={activeTab}
     onChange={setActiveTab}
   />
   ```

2. **MarkdownRenderer** - For AI responses
   ```tsx
   <MarkdownRenderer 
     content={aiMessage.content}
     components={{
       code: CodeBlock,
       table: ThemedTable,
     }}
   />
   ```

3. **ChartContainer** - Consistent chart wrapper
   ```tsx
   <ChartContainer
     title="Equity Curve"
     subtitle="3-year backtest results"
     actions={[{ label: 'Export', onClick: handleExport }]}
   >
     <ResponsiveContainer>
       <LineChart data={equityData}>...</LineChart>
     </ResponsiveContainer>
   </ChartContainer>
   ```

### 6. Theme Compliance Strategy

**Decision**: Strict enforcement of Fintech Neon theme from day 1

**Rationale**:
- Consistency across all features is critical for professional appearance
- Theme violations hard to fix retroactively
- Design system already well-documented

**Enforcement Mechanisms**:
1. **CSS Variables Only** - No hardcoded colors
2. **Spacing Tokens** - Use `--gap-*` variables exclusively
3. **Component Library** - Build on existing themed components
4. **Design Review Checklist** - Review before PR

**Theme Compliance Checklist**:
```markdown
- [ ] All colors use CSS variables (--accent, --bg, --panel, etc.)
- [ ] Spacing uses gap tokens (--gap-xs to --gap-2xl)
- [ ] Border radius uses radius tokens (--radius, --radius-lg, etc.)
- [ ] Shadows use shadow tokens (--shadow, --glow-accent, etc.)
- [ ] Transitions use transition tokens (--transition, --transition-fast)
- [ ] Typography uses scale tokens (--text-base, --text-lg, etc.)
- [ ] Hover states include glow effect
- [ ] Focus states have accent outline
- [ ] Status colors follow convention (green=profit, red=loss)
- [ ] No emojis in production UI
```

### 7. Mobile Responsiveness Approach

**Decision**: Desktop-first design, progressive mobile simplification

**Rationale**:
- Swing traders primarily use desktop/laptop during market hours
- Information density of Journal/Backtest/AI Coach suits larger screens
- Mobile can be simplified views of desktop features

**Responsive Strategy**:

**Desktop (>1024px)**:
- Full feature set
- Split panels (e.g., Journal: list + detail)
- Rich visualizations
- Multi-column layouts

**Tablet (768-1024px)**:
- Slightly simplified
- Collapsible panels
- Reduced columns in tables
- Touch-friendly targets

**Mobile (<768px)**:
- Significantly simplified
- Single column, vertical stack
- Card views replace tables
- Full-screen modals
- Progressive disclosure (show less by default)

**Example - Journal Screen Responsive**:
```
Desktop:    [Trade List | Trade Detail Panel]
Tablet:     [Trade List with expandable cards]
Mobile:     [Trade Cards] → Tap → [Full-screen detail]
```

### 8. Navigation Integration

**Decision**: Extend existing horizontal tab navigation with 4 new tabs

**Rationale**:
- Maintains Phase 1 navigation pattern
- Traders expect consistent navigation
- Horizontal tabs proven effective for trading apps (TradingView, Webull)

**New Navigation Structure**:
```
┌───────────────────────────────────────────────────────────────┐
│ [Logo]  Dashboard | Watchlist | Portfolio | Signals |         │
│         Journal | AI Coach | Backtest | Settings  [User] [🔔] │
└───────────────────────────────────────────────────────────────┘
```

**Responsive Navigation**:
- Desktop: Show all 8 tabs
- Tablet: Show all tabs with smaller spacing
- Mobile: Hamburger menu with all options

### 9. Error Handling & Loading States

**Decision**: Consistent error/loading patterns across all features

**Rationale**:
- localStorage can fail (quota exceeded)
- Calculations can be slow (backtests)
- Context providers may have async initialization

**Patterns**:

**Loading States**:
```tsx
// Skeleton screens for initial load
<JournalSkeleton />

// Inline spinners for actions
<Button loading={isSaving}>Save Trade</Button>

// Progress bars for long operations
<ProgressBar value={backtestProgress} max={100} />
```

**Error States**:
```tsx
// Toast notifications for transient errors
toast.error('Failed to save trade. Please try again.');

// Inline error messages for form validation
<Input error="Entry price must be greater than 0" />

// Error boundaries for catastrophic failures
<ErrorBoundary fallback={<ErrorScreen />}>
  <JournalView />
</ErrorBoundary>
```

**Empty States**:
```tsx
// Meaningful empty states with actions
<EmptyState
  icon="journal"
  title="No trades yet"
  description="Start logging your trades to track performance"
  action={{ label: 'Add First Trade', onClick: openTradeForm }}
/>
```

## Data Models

### Trade Model (Journal)
```typescript
interface Trade {
  id: string;
  symbol: string;
  companyName: string;
  
  // Entry
  entryDate: Date;
  entryTime: string;
  entryPrice: number;
  shares: number;
  
  // Exit
  exitDate?: Date;
  exitTime?: string;
  exitPrice?: number;
  exitReason?: 'target' | 'stop' | 'time' | 'thesis-invalidated' | 'manual';
  
  // Setup
  setupType: string; // 'pullback-20ema', 'breakout', etc.
  setupScore?: number; // 0-10
  marketRegime?: string; // 'bull', 'bear', 'range'
  sector?: string;
  
  // Risk Management
  initialStopPrice: number;
  currentStopPrice?: number;
  target1Price?: number;
  target2Price?: number;
  target3Price?: number;
  
  // Financials (Vietnam-specific)
  entryCommission: number; // VND
  exitCommission?: number; // VND
  exitTax?: number; // VND
  grossPL?: number; // VND
  netPL?: number; // VND
  plPercent?: number;
  rMultiple?: number;
  
  // Performance Metrics
  mfe?: number; // Max Favorable Excursion (VND or R)
  mae?: number; // Max Adverse Excursion (VND or R)
  daysHeld?: number;
  
  // Notes & Learning
  entryThesis: string;
  exitThesis?: string;
  preTradeNotes?: string;
  duringTradeNotes?: string[];
  postTradeNotes?: string;
  emotionalState?: string;
  executionQuality?: number; // 0-10
  
  // Metadata
  tags: string[];
  isFavorite: boolean;
  isCaseStudy: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### Settings Model
```typescript
interface Settings {
  // Trading Parameters
  trading: {
    fastEMA: number;          // default 20
    slowEMA: number;          // default 50
    longTermSMA: number;      // default 200
    rsiPeriod: number;        // default 14
    atrPeriod: number;        // default 14
    minimumScore: number;     // default 7
  };
  
  // Position Sizing
  positionSizing: {
    riskPerTradeByScore: {
      score7to8: number;      // default 1.0%
      score9: number;         // default 1.5%
      score10: number;        // default 2.0%
    };
    stopLossMethod: 'atr' | 'percentage' | 'technical';
    atrMultiplier: number;    // default 2.0
    percentageStop?: number;
    gapRiskMultiplier: number; // default 3.0 (Vietnam-specific)
  };
  
  // Portfolio Limits
  portfolioLimits: {
    maxAggregateRisk: number;     // default 6.0%
    maxSinglePosition: number;    // default 25%
    maxOpenPositions: number;     // default 6
    maxSectorExposure: number;    // default 40%
    maxCorrelation: number;       // default 0.70
  };
  
  // Loss Limits
  lossLimits: {
    dailyLossLimit: number;       // default -2.0%
    dailyLossAction: 'lock' | 'alert' | 'close-all';
    weeklyLossLimit: number;      // default -5.0%
    monthlyLossLimit: number;     // default -10.0%
    lockTrading: boolean;
    sendAlertEmail: boolean;
    sendAlertSMS: boolean;
  };
  
  // Notifications
  notifications: {
    entrySignals: {
      score9to10: boolean;        // default true
      score8to9: boolean;         // default true
      score7to8: boolean;         // default false
    };
    exitSignals: {
      stopLoss: boolean;          // default true
      targetReached: boolean;     // default true
      timeStop: boolean;          // default true
      thesisInvalidated: boolean; // default true
    };
    riskAlerts: {
      aggregateRiskHigh: boolean; // default true (>5%)
      dailyLossWarning: boolean;  // default true
      correlationWarning: boolean; // default true
    };
    deliveryMethods: {
      browser: boolean;           // default true
      email: boolean;             // default true
      sms: boolean;               // default false
      pushMobile: boolean;        // default false
    };
    quietHours: {
      enabled: boolean;
      from: string;               // "22:00"
      to: string;                 // "07:00"
    };
  };
  
  // Appearance
  appearance: {
    theme: 'fintech-neon' | 'light' | 'dark'; // fintech-neon only for now
    compactMode: boolean;
    showAnimations: boolean;
  };
  
  // Metadata
  version: string;
  lastUpdated: Date;
}
```

### Backtest Configuration Model
```typescript
interface BacktestConfig {
  id: string;
  name: string;
  
  // Basic Settings
  dateRange: {
    from: Date;
    to: Date;
  };
  symbols: string[];            // ['VCB', 'HPG', ...] or 'VN30'
  startingCapital: number;      // VND
  
  // Strategy Parameters
  setupTypes: string[];         // ['pullback-20ema', 'breakout', ...]
  fastEMA: number;
  slowEMA: number;
  rsiPeriod: number;
  atrPeriod: number;
  minimumScore: number;
  requireVolumeConfirmation: boolean;
  requireTrendAlignment: boolean;
  
  // Risk Management
  stopLossMethod: 'atr' | 'percentage' | 'technical';
  atrMultiplier: number;
  percentageStop?: number;
  
  // Targets & Exits
  target1: { rMultiple: number; exitPercent: number }; // e.g., 2R, 25%
  target2: { rMultiple: number; exitPercent: number }; // e.g., 3R, 25%
  target3: { method: 'trail' | 'fixed'; value: number | string }; // trail with 20EMA
  
  // Position Sizing
  riskPerTrade: number;         // % of capital
  maxPositions: number;
  maxAggregateRisk: number;
  
  // Costs (Vietnam-specific)
  commission: number;           // default 0.25%
  tax: number;                  // default 0.1%
  slippage: number;             // default 0.3%
  
  createdAt: Date;
}
```

### Backtest Results Model
```typescript
interface BacktestResults {
  configId: string;
  
  // Summary Metrics
  summary: {
    totalReturn: number;        // %
    totalReturnVND: number;
    annualReturn: number;       // CAGR
    winRate: number;            // %
    totalTrades: number;
    winningTrades: number;
    losingTrades: number;
    profitFactor: number;
    expectancy: number;         // R-multiple
    maxDrawdown: number;        // %
    sharpeRatio: number;
    avgWin: number;             // R-multiple
    avgLoss: number;            // R-multiple
    avgWinToLoss: number;       // ratio
  };
  
  // Equity Curve
  equityCurve: {
    date: Date;
    equity: number;
    drawdown: number;
  }[];
  
  // Trade List
  trades: BacktestTrade[];
  
  // Analytics
  analytics: {
    bySetupType: Map<string, SetupPerformance>;
    byHoldingPeriod: HoldingPeriodAnalysis;
    rMultipleDistribution: number[];
    monthlyReturns: Map<string, number>;
    maeVsRMultiple: { mae: number; rMultiple: number }[];
  };
  
  // Comparison
  benchmark: {
    name: string;               // "VN-Index Buy & Hold"
    return: number;
    maxDrawdown: number;
    sharpeRatio: number;
  };
  
  executedAt: Date;
}
```

## Integration Points

### With Phase 1 Features

1. **Dashboard → Journal**: "View All Trades" link
2. **Portfolio → Journal**: Click position opens journal detail
3. **Signals → Backtest**: "Backtest this setup" button
4. **Watchlist → AI Coach**: "@Symbol ask about this stock"
5. **Settings**: Affects all features (risk limits, parameters)

### With Future Backend

```typescript
// Abstract interface for future migration
interface DataProvider {
  // Trades
  getTrades(): Promise<Trade[]>;
  saveTrade(trade: Trade): Promise<void>;
  
  // Settings
  getSettings(): Promise<Settings>;
  saveSettings(settings: Settings): Promise<void>;
  
  // Backtest
  runBacktest(config: BacktestConfig): Promise<BacktestResults>;
  
  // AI
  sendChatMessage(message: string, context: any): Promise<string>;
}

// Phase 2: Local implementation
class LocalStorageProvider implements DataProvider {
  // ... localStorage-based methods
}

// Future: API implementation
class APIProvider implements DataProvider {
  // ... fetch-based methods
}
```

## Performance Considerations

### Optimization Strategies

1. **Virtual Scrolling**: For long trade lists and backtest results
2. **Lazy Loading**: Load trade details only when opened
3. **Memoization**: React.memo for expensive components
4. **Web Workers**: For backtest calculations
5. **Debouncing**: For search and filter inputs
6. **Code Splitting**: Dynamic imports for each feature module

```typescript
// Route-based code splitting
const JournalView = lazy(() => import('./features/journal/JournalView'));
const AICoachView = lazy(() => import('./features/ai-coach/AICoachView'));
const BacktestView = lazy(() => import('./features/backtest/BacktestView'));
const SettingsView = lazy(() => import('./features/settings/SettingsView'));
```

### Bundle Size Management

- Estimated bundle impact: +150-200KB (gzipped)
- Mitigations:
  - Tree-shaking for unused chart components
  - Lazy load markdown renderer
  - Defer AI Coach until first use
  - CDN for chart libraries if large

## Testing Strategy

### Unit Tests
- Data models and validators
- Vietnam financial calculations
- Backtest engine logic
- Context state management
- Utility functions

### Integration Tests
- Context provider + component integration
- localStorage persistence
- Form submission flows
- Navigation between features

### E2E Tests (Future)
- Complete user journeys (morning routine, responding to signal)
- Cross-feature workflows
- Mobile responsive behavior

### Manual Testing Checklist
- [ ] Theme compliance audit
- [ ] Mobile responsive on real devices
- [ ] localStorage limits and errors
- [ ] Performance with large datasets (500 trades)
- [ ] Browser compatibility (Chrome, Firefox, Safari, Edge)

## Security Considerations

### Data Privacy
- All data stored locally in browser
- No transmission of personal data (until backend)
- Clear browser storage = data loss (warn users)

### Input Validation
- Sanitize all user inputs (trade notes, chat messages)
- Validate numerical inputs (prices, percentages)
- Prevent XSS in markdown rendering

### Future API Security
- JWT authentication
- HTTPS only
- Rate limiting on AI endpoints
- Input validation on server

## Deployment Strategy

### Phased Rollout
1. **Alpha**: Internal team testing (Week 1-2)
2. **Beta**: Select power users (Week 3-4)
3. **GA**: All users (Week 5+)

### Feature Flags
```typescript
const featureFlags = {
  enableJournal: true,
  enableAICoach: true,  // May gate behind beta flag initially
  enableBacktest: true,
  enableSettings: true,
  enableAIRealBackend: false, // Future
};
```

### Rollback Plan
- Feature flags allow disabling individual features
- Navigation can hide tabs if features disabled
- localStorage data persists through rollbacks

## Maintenance & Iteration

### Known Limitations (MVP)
1. AI responses are mock/rule-based
2. Backtest runs client-side (slow for large tests)
3. No cloud sync (localStorage only)
4. Limited to 500 trades in journal
5. No export/import functionality

### Post-MVP Enhancements
1. Real LLM integration for AI Coach
2. Server-side backtest engine
3. Cloud persistence with sync
4. Unlimited trade history
5. Export to CSV/PDF
6. Trade sharing and social features
7. Mobile native apps
8. Advanced charting tools
9. Custom indicator creation
10. Multi-account support

### Monitoring & Metrics
- localStorage usage (warn before limits)
- Feature usage (which screens most visited)
- Performance metrics (time to interactive)
- Error rates (track context failures, storage errors)

---

**Next Steps**: See [tasks.md](./tasks.md) for detailed implementation checklist.
