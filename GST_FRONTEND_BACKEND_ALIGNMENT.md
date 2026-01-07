# GST Frontend Feature Support & Backend Alignment

**Document Purpose**: This document maps the GST frontend features to backend capabilities, tracking implementation status and identifying gaps.

**Change ID**: `implement-gst-frontend-core`  
**Created**: January 7, 2026  
**Status**: Proposal Phase - Awaiting Approval

---

## Executive Summary

The GST frontend implements a comprehensive trading intelligence platform for the Vietnam stock market. This document ensures alignment between frontend features and backend capabilities across 7 functional phases.

### Overall Implementation Status

| Phase | Frontend | Backend | Alignment Status |
|-------|----------|---------|------------------|
| Phase 1: Market Data & Indicators | Not Started | ✅ Complete | ✅ Ready |
| Phase 2: Market Regime | Not Started | ⚠️ 33% | ⚠️ Partial |
| Phase 3: Trade Setup Scanner | Not Started | ⚠️ 50% | ⚠️ Partial |
| Phase 4: Risk & Position Planning | Not Started | ⚠️ 75% | ⚠️ Mostly Ready |
| Phase 5: Position Monitoring | Not Started | ⚠️ Partial | ⚠️ Needs Work |
| Phase 6: Performance Analytics | Not Started | ⚠️ 70% | ⚠️ Mostly Ready |
| Phase 7-11: Future Features | Not Started | ❌ Not Started | ⏸️ Deferred |

---

## Phase-by-Phase Feature Alignment

### Phase 1: Market Data & Technical Indicators ✅

**Frontend Capability**: `market-data-visualization`

#### Supported Features

| Feature | Frontend | Backend | Status | Notes |
|---------|----------|---------|--------|-------|
| Candlestick Charts | Planned | ✅ OHLCV API | ✅ Ready | |
| SMA Overlays (10/20/50/200) | Planned | ✅ Indicator API | ✅ Ready | |
| EMA Overlays | Planned | ✅ Indicator API | ✅ Ready | |
| Bollinger Bands | Planned | ✅ Indicator API | ✅ Ready | |
| VWAP | Planned | ✅ Indicator API | ✅ Ready | |
| Volume Bars | Planned | ✅ OHLCV API | ✅ Ready | |
| RSI Indicator | Planned | ✅ Indicator API | ✅ Ready | |
| MACD Indicator | Planned | ✅ Indicator API | ✅ Ready | |
| Stochastic Indicator | Planned | ✅ Indicator API | ✅ Ready | |
| ADX Indicator | Planned | ✅ Indicator API | ✅ Ready | |
| ATR Indicator | Planned | ✅ Indicator API | ✅ Ready | |
| OBV Indicator | Planned | ✅ Indicator API | ✅ Ready | Not in MVP UI |
| Real-time WebSocket | Planned | ✅ WebSocket | ✅ Ready | |

#### Backend APIs Required

- `GET /api/market/ohlcv/{symbol}?interval={interval}&limit={limit}`
- `GET /api/indicators/{symbol}?interval={interval}`
- `WS /ws/market` - Subscribe to price updates

#### Backend Status
✅ **Complete** - All APIs implemented and tested

---

### Phase 2: Market Context & Regime ⚠️

**Frontend Capability**: `market-regime-display`

#### Supported Features

| Feature | Frontend | Backend | Status | Notes |
|---------|----------|---------|--------|-------|
| Bull/Bear/Range/Transition Detection | Planned | ✅ Implemented | ✅ Ready | |
| 12-point Regime Scoring | Planned | ✅ Implemented | ✅ Ready | |
| ADX Factor Scoring | Planned | ✅ Implemented | ✅ Ready | |
| Directional Movement Scoring | Planned | ✅ Implemented | ✅ Ready | |
| Volatility Factor | Planned | ✅ Implemented | ✅ Ready | |
| Volume Pattern Analysis | Planned | ✅ Implemented | ✅ Ready | |
| VN-Index Health Status | Planned | ✅ Implemented | ✅ Ready | |
| Position Multiplier | Planned | ✅ Implemented | ✅ Ready | |
| Multi-Timeframe Alignment | Future | ❌ Not Implemented | ⏸️ Deferred | |
| Volume Profile | Future | ❌ Not Implemented | ⏸️ Deferred | |
| Climax Detection | Future | ❌ Not Implemented | ⏸️ Deferred | |

#### Backend APIs Required

- `GET /api/regime/current` - Current regime analysis
- `WS /ws/regime` - Real-time regime updates

#### Backend Status
⚠️ **33% Complete** - Core regime detection done, multi-timeframe and volume analysis pending

#### Gaps to Address
- Multi-timeframe alignment (Weekly/Daily/4H)
- Volume profile analysis
- Climax pattern detection

---

### Phase 3: Trade Setup Discovery ⚠️

**Frontend Capability**: `trade-setup-scanner`

#### Supported Features

| Feature | Frontend | Backend | Status | Notes |
|---------|----------|---------|--------|-------|
| Pullback Detection | Planned | ✅ Implemented | ✅ Ready | |
| Breakout Detection | Planned | ✅ Implemented | ✅ Ready | |
| 13-Point Trade Scoring | Planned | ✅ Implemented | ✅ Ready | |
| Trend Alignment Scoring (3pts) | Planned | ✅ Implemented | ✅ Ready | |
| Setup Quality Scoring (3pts) | Planned | ✅ Implemented | ✅ Ready | |
| Momentum Scoring (2pts) | Planned | ✅ Implemented | ✅ Ready | |
| R:R Scoring (2pts) | Planned | ✅ Implemented | ✅ Ready | |
| Context Scoring (3pts) | Planned | ✅ Implemented | ✅ Ready | |
| Liquidity Filters | Planned | ✅ Implemented | ✅ Ready | |
| Confidence Levels | Planned | ✅ Implemented | ✅ Ready | |
| MA Crossover Signals | Future | ❌ Not Implemented | ⏸️ Deferred | |
| Mean Reversion Patterns | Future | ❌ Not Implemented | ⏸️ Deferred | |
| Entry Trigger Confirmation | Future | ❌ Partial | ⚠️ Needs Work | |

#### Backend APIs Required

- `GET /api/setups/scan?minScore={score}&sector={sector}&setupType={type}` - Scan for setups
- `GET /api/setups/{id}` - Setup details
- `WS /ws/setups` - New setup notifications

#### Backend Status
⚠️ **50% Complete** - Pullback and Breakout implemented, other patterns pending

#### Gaps to Address
- MA crossover signal detection
- Mean reversion pattern recognition
- Entry trigger confirmation system

---

### Phase 4: Risk & Position Planning ⚠️ **CRITICAL**

**Frontend Capability**: `risk-position-calculator`

#### Supported Features

| Feature | Frontend | Backend | Status | Notes |
|---------|----------|---------|--------|-------|
| Fixed-Risk Position Sizing | Planned | ✅ Implemented | ✅ Ready | |
| Volatility-Adjusted Sizing | Planned | ✅ Implemented | ✅ Ready | |
| Score-Based Sizing | Planned | ✅ Implemented | ✅ Ready | |
| Capital-Constrained Sizing | Planned | ✅ Implemented | ✅ Ready | |
| Volatility Classification | Planned | ✅ Implemented | ✅ Ready | |
| ATR-Based Stops | Planned | ✅ Implemented | ✅ Ready | |
| Percentage Stops | Planned | ✅ Implemented | ✅ Ready | |
| Swing-Based Stops | Planned | ✅ Implemented | ✅ Ready | |
| R-Multiple Targets | Planned | ✅ Implemented | ✅ Ready | |
| ATR Extension Targets | Planned | ✅ Implemented | ✅ Ready | |
| Fibonacci Targets | Planned | ✅ Implemented | ✅ Ready | |
| Technical Resistance Targets | Planned | ✅ Implemented | ✅ Ready | |
| Measured Move Targets | Planned | ✅ Implemented | ✅ Ready | |
| Target Consensus Logic | Planned | ✅ Implemented | ✅ Ready | |
| Trailing Stops (ATR/EMA/%) | Planned | ✅ Implemented | ✅ Ready | |
| Gap Risk Multiplier | Planned | ✅ Implemented | ✅ Ready | |
| Vietnam ±7% Limit Validation | Planned | ✅ Implemented | ✅ Ready | **CRITICAL** |
| Lot Size Adjustment (100 shares) | Planned | ✅ Implemented | ✅ Ready | **CRITICAL** |
| Correlation Factor | Future | ❌ Not Implemented | ⏸️ Deferred | |
| Portfolio-Level Risk Aggregation | Future | ❌ Not Implemented | ⏸️ Deferred | |

#### Backend APIs Required

- `POST /api/risk/calculate` - Position size and risk calculation
  ```json
  {
    "capital": 100000000,
    "riskPercent": 2,
    "entryPrice": 85000,
    "stopPrice": 81000,
    "exchange": "HOSE"
  }
  ```
- `POST /api/risk/stops` - Stop loss calculations
- `POST /api/risk/targets` - Target calculations with consensus

#### Backend Status
⚠️ **75% Complete** - Core risk calculations implemented, portfolio-level aggregation pending

#### Gaps to Address
- Correlation-based position adjustment
- Portfolio-level risk aggregation across all positions

---

### Phase 5: Position Monitoring ⚠️

**Frontend Capability**: `position-monitoring`

#### Supported Features

| Feature | Frontend | Backend | Status | Notes |
|---------|----------|---------|--------|-------|
| Real-Time P&L Tracking | Planned | ✅ Implemented | ✅ Ready | |
| R-Multiple Calculation | Planned | ✅ Implemented | ✅ Ready | |
| Time Tracking (Days Held) | Planned | ✅ Implemented | ✅ Ready | |
| Breakeven Stop Suggestions | Planned | ✅ Implemented | ✅ Ready | |
| ATR Trailing Stops | Planned | ✅ Implemented | ✅ Ready | |
| EMA Trailing Stops | Planned | ✅ Implemented | ✅ Ready | |
| Percentage Trailing Stops | Planned | ✅ Implemented | ✅ Ready | |
| Swing Trailing Stops | Planned | ✅ Implemented | ✅ Ready | |
| Time-Based Exit Suggestions | Planned | ✅ Implemented | ✅ Ready | |
| Volatility-Adjusted Stops | Planned | ✅ Implemented | ✅ Ready | |
| Stop Adjustment History | Planned | ✅ Implemented | ✅ Ready | |
| Stagnation Detection | Planned | ⚠️ Partial | ⚠️ Needs Logic | Frontend can implement |
| Stop Hit Detection | Planned | ⚠️ Partial | ⚠️ Needs Alert | WebSocket + frontend |
| Target Hit Detection | Planned | ⚠️ Partial | ⚠️ Needs Alert | WebSocket + frontend |

#### Backend APIs Required

- `GET /api/positions/active` - List active positions
- `GET /api/positions/{id}` - Position details
- `PATCH /api/positions/{id}/stop` - Update stop level
- `POST /api/positions/{id}/close` - Close position (partial or full)
- `WS /ws/positions` - Real-time position updates

#### Backend Status
⚠️ **Partial** - Position tracking implemented, stop management engine implemented, alert system needs integration

#### Gaps to Address
- WebSocket alerts for stop/target hits
- Stagnation detection logic (could be client-side)

---

### Phase 6: Performance Analytics ⚠️

**Frontend Capability**: `performance-analytics`

#### Supported Features

| Feature | Frontend | Backend | Status | Notes |
|---------|----------|---------|--------|-------|
| Win Rate Calculation | Planned | ✅ Implemented | ✅ Ready | |
| Expectancy Calculation | Planned | ✅ Implemented | ✅ Ready | |
| Profit Factor | Planned | ✅ Implemented | ✅ Ready | |
| Sharpe Ratio | Planned | ✅ Implemented | ✅ Ready | |
| Sortino Ratio | Planned | ✅ Implemented | ✅ Ready | |
| Calmar Ratio | Planned | ✅ Implemented | ✅ Ready | |
| Max Drawdown | Planned | ✅ Implemented | ✅ Ready | |
| Recovery Factor | Planned | ✅ Implemented | ✅ Ready | |
| Consecutive Win/Loss Streaks | Planned | ✅ Implemented | ✅ Ready | |
| R-Multiple Distribution | Planned | ✅ Implemented | ✅ Ready | |
| Setup Type Distribution | Planned | ✅ Implemented | ✅ Ready | |
| Regime Distribution | Planned | ✅ Implemented | ✅ Ready | |
| Equity Curve Tracking | Planned | ✅ Implemented | ✅ Ready | |
| Drawdown Timeline | Planned | ✅ Implemented | ✅ Ready | |
| Time-Based Metrics | Future | ❌ Not Implemented | ⏸️ Deferred | |
| Statistical Validation Tests | Future | ❌ Not Implemented | ⏸️ Deferred | |

#### Backend APIs Required

- `GET /api/performance/metrics?period={period}` - Performance overview
- `GET /api/performance/equity-curve?start={date}&end={date}` - Equity data
- `GET /api/performance/distributions` - R-multiple, setup, regime distributions

#### Backend Status
⚠️ **70% Complete** - Core metrics implemented, time-based analysis and statistical tests pending

#### Gaps to Address
- Time-based metrics (best/worst days, holding period analysis)
- Statistical validation (t-tests, Monte Carlo)

---

## Phases 7-11: Future Features (Out of Scope)

### Phase 7: Trade Journal & Reviews ❌
**Status**: Not planned for initial implementation  
**Backend**: Not implemented  
**Notes**: Manual journaling and reflection tools

### Phase 8: Alerts & Notifications ❌
**Status**: Deferred to post-MVP  
**Backend**: Email/Telegram infrastructure ready  
**Notes**: Real-time alerts for setups, stops, targets

### Phase 9: Backtesting & Simulation ❌
**Status**: Future enhancement  
**Backend**: Not implemented  
**Notes**: Strategy validation before live trading

### Phase 10: Advanced Portfolio Intelligence ❌
**Status**: Future enhancement  
**Backend**: Not implemented  
**Notes**: Correlation heatmaps, sector exposure, regime-adaptive warnings

### Phase 11: Trade Execution ❌
**Status**: Future (requires broker integration)  
**Backend**: Not implemented  
**Notes**: Direct order placement via DNSE API

---

## Vietnam Market Requirements ✅

| Requirement | Frontend | Backend | Status |
|-------------|----------|---------|--------|
| ±7% Daily Price Limit (HOSE) | Planned | ✅ | ✅ Ready |
| ±10% Daily Price Limit (HNX) | Planned | ✅ | ✅ Ready |
| 100-Share Lot Size | Planned | ✅ | ✅ Ready |
| T+2 Settlement Tracking | Planned | ✅ | ✅ Ready |
| Trading Session Times | Planned | ⚠️ | ⚠️ Needs API |
| VN-Index Dependency | Planned | ✅ | ✅ Ready |
| Gap Risk Handling | Planned | ✅ | ✅ Ready |

---

## Critical Gaps Summary

### Must-Have Before Frontend Implementation

1. **Multi-Timeframe Alignment** (Phase 2)
   - Backend needs to provide Weekly/Daily/4H trend alignment
   - Frontend will display in Regime panel

2. **Entry Trigger Confirmation** (Phase 3)
   - Backend should validate when all triggers are met
   - Frontend will show trigger checklist

3. **Stop/Target Hit Alerts** (Phase 5)
   - Backend WebSocket needs to emit alerts when levels hit
   - Frontend will display notifications

4. **Trading Session API** (Vietnam Market)
   - Backend should provide current session status
   - Frontend will disable actions outside trading hours

### Nice-to-Have Enhancements

1. **Correlation Analysis** (Phase 4)
   - Backend calculates position correlations
   - Frontend adjusts position sizes

2. **Time-Based Metrics** (Phase 6)
   - Backend provides best/worst day analysis
   - Frontend displays in analytics

3. **Statistical Validation** (Phase 6)
   - Backend runs t-tests, Monte Carlo
   - Frontend displays confidence metrics

---

## Backend API Expectations

### Expected API Response Formats

#### Market Data
```typescript
GET /api/market/ohlcv/FPT?interval=D&limit=500
Response: {
  symbol: "FPT",
  interval: "D",
  data: [
    { time: 1704672000, open: 85000, high: 86500, low: 84200, close: 86000, volume: 2500000 },
    ...
  ]
}
```

#### Technical Indicators
```typescript
GET /api/indicators/FPT?interval=D
Response: {
  symbol: "FPT",
  interval: "D",
  timestamp: 1704672000,
  rsi: 45,
  macd: { value: 250, signal: 180, histogram: 70 },
  stochastic: { k: 32, d: 28 },
  adx: 28,
  atr: 3400,
  sma: { 20: 85000, 50: 82000, 200: 78000 },
  ema: { 20: 85200, 50: 82500 },
  bollingerBands: { upper: 88000, middle: 85000, lower: 82000 },
  vwap: 85300,
  obv: 125000000
}
```

#### Market Regime
```typescript
GET /api/regime/current
Response: {
  regime: "BULL",
  score: 9,
  breakdown: {
    adx: 2,
    directional: 2,
    volatility: 1,
    volume: 2,
    extra: 2
  },
  vnIndex: {
    value: 1250.5,
    change: 1.2,
    aboveMA50: true,
    trend: "BULLISH"
  },
  recommendation: "Favor trend-following setups",
  positionMultiplier: 1.0
}
```

#### Trade Setups
```typescript
GET /api/setups/scan?minScore=7
Response: {
  setups: [
    {
      id: "FPT-20260107-PULLBACK",
      symbol: "FPT",
      setupType: "PULLBACK",
      score: 10,
      scoreBreakdown: { trend: 3, setup: 2, momentum: 2, riskReward: 1, context: 2 },
      entry: 85000,
      stop: 81400,
      targets: [89000, 91500, 92200],
      riskRewardRatio: 2.0,
      confidence: "HIGH",
      narrative: "Pullback to EMA20 with volume contraction...",
      triggers: ["Price bounce from EMA20", "MACD bullish crossover"]
    },
    ...
  ],
  count: 15
}
```

#### Risk Calculation
```typescript
POST /api/risk/calculate
Request: {
  capital: 100000000,
  riskPercent: 2,
  entryPrice: 85000,
  stopPrice: 81000,
  exchange: "HOSE"
}
Response: {
  positionSize: 500,
  positionValue: 42500000,
  riskAmount: 2000000,
  actualRiskPercent: 2.0,
  riskRewardRatio: 1.8,
  viable: true,
  warnings: []
}
```

#### Active Positions
```typescript
GET /api/positions/active
Response: {
  positions: [
    {
      id: "pos-123",
      symbol: "FPT",
      entryPrice: 85000,
      entryDate: "2026-01-05T09:15:00Z",
      size: 500,
      currentPrice: 92500,
      currentStop: 85200,
      targets: [
        { price: 89000, size: 125, hit: true },
        { price: 91500, size: 125, hit: true },
        { price: 92200, size: 125, hit: false }
      ],
      unrealizedPL: 3750000,
      unrealizedPLPercent: 8.8,
      rMultiple: 2.1,
      daysHeld: 2,
      stopHistory: [
        { date: "2026-01-05T09:15:00Z", price: 81400, reason: "Initial stop" },
        { date: "2026-01-06T14:30:00Z", price: 85200, reason: "Breakeven after T1" }
      ],
      trailingSuggestion: {
        price: 88400,
        method: "ATR Trail (2.0x)",
        reason: "Price 2R+ above entry, lock profits"
      }
    }
  ]
}
```

#### Performance Metrics
```typescript
GET /api/performance/metrics
Response: {
  totalTrades: 40,
  winRate: 0.625,
  expectancy: 0.45,
  profitFactor: 1.85,
  sharpeRatio: 1.42,
  sortinoRatio: 1.89,
  calmarRatio: 2.15,
  maxDrawdown: -0.083,
  recoveryFactor: 3.4,
  avgWin: 1.8,
  avgLoss: 0.9,
  largestWin: 3.5,
  largestLoss: -1.8,
  consecutiveWins: 5,
  consecutiveLosses: 2
}
```

---

## Frontend Technology Stack

### Core Framework
- React 19.2.0 with TypeScript
- Vite (Rolldown) for build system
- React Hook Form + Zod for forms

### Charting
- **Lightweight Charts** by TradingView (primary choice)
- Alternative: TradingView Widget (if licensing allows)

### State Management
- React Context API (initial implementation)
- Migration path to Zustand if complexity grows

### Real-Time Data
- Native WebSocket API
- Auto-reconnection logic
- Subscription management

### UI Components
- Custom component library (Card, Badge, Button, Modal, etc.)
- No external UI framework initially
- Focus on performance and Vietnam market UX

### Testing
- Vitest for unit tests
- React Testing Library for component tests
- MSW for API mocking

---

## Next Steps

### For Backend Team

1. **Prioritize Critical Gaps**:
   - Multi-timeframe alignment API
   - Trading session status API
   - Stop/target hit WebSocket alerts

2. **Provide API Documentation**:
   - OpenAPI/Swagger specs for all endpoints
   - WebSocket message schemas
   - Authentication flow documentation

3. **Set Up Test Environment**:
   - Staging API with test data
   - WebSocket test server
   - CORS configuration for local development

### For Frontend Team

1. **Review This Document**:
   - Confirm understanding of all phases
   - Identify any missing requirements
   - Clarify Vietnam market rules

2. **Begin Implementation**:
   - Follow tasks.md sequentially
   - Start with Phase 0 (Foundation)
   - Proceed to Phase 1 (Market Data)

3. **Coordinate with Backend**:
   - Weekly sync meetings
   - API contract reviews
   - Integration testing sessions

---

## Document Maintenance

This document should be updated:
- When backend APIs are completed or changed
- When frontend features are implemented
- When new gaps are discovered
- When requirements change

**Last Updated**: January 7, 2026  
**Next Review**: Before implementation kickoff
