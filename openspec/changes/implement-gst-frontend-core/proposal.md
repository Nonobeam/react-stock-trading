# Proposal: Implement GST Frontend Core

## Change ID
`implement-gst-frontend-core`

## Summary
Implement the core frontend capabilities for the GST (General Stock Trading) system, a trading intelligence and decision-support platform designed for the Vietnam stock market. This change establishes the foundational UI components and data flow architecture that align with the existing backend capabilities across multiple phases of the trading workflow.

## Background

### Current State
- React + TypeScript + Vite project initialized
- No UI components implemented
- Backend capabilities exist for market data, technical analysis, regime detection, trade scoring, risk management, position tracking, and performance analytics

### Problem Statement
The GST backend provides comprehensive trading intelligence, but without a frontend, users cannot:
- Visualize real-time market data and technical indicators
- Understand current market regime and context
- Discover and evaluate trade setups with quality scoring
- Plan risk and position sizing before entering trades
- Monitor active positions with trailing stop management
- Analyze trading performance over time

### Vietnam Market Context
The system must handle Vietnam-specific constraints:
- Daily price limits: ±7% (HOSE), ±10% (HNX)
- T+2.5 settlement cycle
- Trading sessions with breaks (9:00-11:30, 13:00-15:00)
- VN-Index dependency for market-wide regime analysis
- Common overnight gap risk

## Objectives

### Primary Goals
1. **Market Visibility**: Display real-time market data with technical indicator overlays
2. **Context Awareness**: Show market regime, trend strength, and VN-Index health
3. **Setup Discovery**: Present trade opportunities with 13-point scoring system
4. **Risk Planning**: Provide position sizing, stop placement, and target calculators
5. **Position Monitoring**: Track active trades with automated stop management suggestions
6. **Performance Tracking**: Visualize trading metrics and distribution analysis

### Success Criteria
- [ ] Users can view candlestick charts with 9 technical indicators
- [ ] Users can see current market regime with scoring breakdown
- [ ] Users can discover trade setups with quality scores ≥7
- [ ] Users can calculate position sizes and R:R ratios before trading
- [ ] Users can monitor positions with real-time P&L and R-multiple tracking
- [ ] Users can view performance metrics (win rate, expectancy, Sharpe ratio, drawdown)
- [ ] All features adapt to Vietnam market constraints (price limits, settlement)

### Non-Goals (Out of Scope)
- Trade journal and psychological tracking (Phase 8)
- Alert and notification system (Phase 9)
- Backtesting and simulation UI (Phase 10)
- Advanced portfolio correlation analysis (Phase 11)
- Mobile/responsive design (future iteration)
- Dark/light theme system (initial version uses single theme)

## Proposed Solution

### High-Level Approach
Build a modular React frontend organized around functional trading domains:

```
Market Domain → Analysis Domain → Execution Domain → Review Domain
     ↓               ↓                  ↓                 ↓
  Price Chart    Regime View      Risk Calculator   Performance
  Indicators     Setup Scanner    Position Tracker    Dashboard
```

### Architecture Pattern
- **Component-driven**: Reusable, testable UI components
- **Data flow**: Unidirectional data flow (props down, events up)
- **State management**: React Context for global state, local state for components
- **Real-time updates**: WebSocket connection for live market data
- **Vietnam market rules**: Embedded in validation logic, not user-configurable

### Key Components by Phase

#### Phase 1: Market Data & Technical Indicators (P0)
- `PriceChartModule`: Candlestick chart with zoom/pan
- `TechnicalIndicatorPanel`: RSI, MACD, Stochastic, ADX, ATR displays
- `VolumePanel`: Volume bars with moving average overlay
- `IndicatorOverlay`: SMA/EMA/Bollinger Bands/VWAP on chart

#### Phase 2: Market Context & Regime (P0)
- `MarketRegimeDashboard`: Current regime badge and score
- `RegimeDetailPanel`: Factor breakdown (ADX, DI, volatility, volume)
- `TrendStrengthMeter`: Visual strength indicator
- `VNIndexStatus`: Market-wide health widget

#### Phase 3: Trade Setup Discovery (P0)
- `TradeScannerTable`: Sortable/filterable setup list
- `ScorecardDisplay`: 13-point scoring visualization
- `SetupDetailDrawer`: Full setup analysis with chart
- `QualityFilter`: Score threshold controls

#### Phase 4: Risk & Position Planning (P0 - CRITICAL)
- `PositionSizeCalculator`: Capital allocation with risk %
- `StopLossPlanner`: Multi-method stop calculation
- `TargetPlanner`: Consensus target finder
- `RiskSummaryPanel`: Pre-trade viability check
- `VietnamLimitValidator`: ±7% enforcement

#### Phase 5: Trade Execution (P1)
- `OrderForm`: Limit/ATC/ATO order types
- `PriceLimitVisualizer`: Price ceiling/floor indicators
- `SessionTimingIndicator`: Trading hours display
- `OrderConfirmationModal`: Final risk recap

#### Phase 6: Trade Monitoring (P0)
- `OpenPositionsDashboard`: Active trades with live P&L
- `StopManagementPanel`: Trailing stop suggestions
- `TimeBasedAlert`: Stagnation warnings
- `EmergencyIndicators`: Stop/target hit notifications

#### Phase 7: Performance Analytics (P1)
- `PerformanceOverviewCards`: Win rate, expectancy, Sharpe, drawdown
- `EquityCurveChart`: Point-by-point equity tracking
- `DistributionCharts`: R-multiple, setup type, regime distribution
- `DrawdownAnalysisPanel`: Max DD, recovery factor, streaks

### Data Requirements

#### Backend APIs (Expected)
- `GET /api/market/ohlcv/{symbol}` - Historical price data
- `GET /api/indicators/{symbol}` - Technical indicator values
- `GET /api/regime/current` - Current market regime analysis
- `GET /api/setups/scan` - Scored trade opportunities
- `POST /api/risk/calculate` - Position sizing and R:R
- `GET /api/positions/active` - Open positions with P&L
- `GET /api/performance/metrics` - Trading performance stats
- `WS /ws/market` - Real-time market data stream

#### State Management
- **MarketContext**: Real-time prices, indicators, OHLCV
- **RegimeContext**: Current regime, score breakdown, VN-Index
- **SetupsContext**: Scanned opportunities, filters
- **PositionsContext**: Active trades, stop levels, P&L
- **PerformanceContext**: Metrics, equity curve, distributions

### Vietnam Market Adaptations
- **Price Limit Enforcement**: Validate all orders and stops against ±7% daily limits
- **Gap Risk Display**: Show overnight gap exposure on position cards
- **Settlement Tracking**: Display T+2 buying power availability
- **Session Awareness**: Disable order placement outside trading hours
- **VN-Index Dependency**: Regime scores weight VN-Index heavily

## Impact Analysis

### Benefits
- **User Value**: Disciplined, data-driven trading decisions
- **Risk Reduction**: Mandatory risk calculation before every trade
- **Consistency**: Standardized evaluation across all opportunities
- **Learning**: Performance feedback loop for improvement
- **Vietnam-specific**: Proper handling of local market rules

### Risks
- **Complexity**: 7 phases with many interconnected components
- **Real-time performance**: WebSocket latency could affect UX
- **Data accuracy**: Wrong indicators or calculations could lead to losses
- **User trust**: Must be highly reliable for users to depend on it

### Mitigation
- Phased rollout with P0 features first
- Extensive testing of all calculations
- Clear disclaimers about tool limitations
- Audit trail for all recommendations

## Alternatives Considered

### Alternative 1: Build Phases Sequentially
**Rejected**: Too slow, users need end-to-end workflow quickly

### Alternative 2: Start with Backtesting First
**Rejected**: Users need live trading support first, validation later

### Alternative 3: Third-party Charting Library
**Considered**: Would accelerate Phase 1 but lacks Vietnam-specific customizations

## Dependencies

### Technical Dependencies
- React charting library (e.g., Recharts, Lightweight Charts)
- WebSocket client for real-time data
- Form validation library (e.g., React Hook Form, Zod)
- Date/time utilities (e.g., date-fns)

### Backend Dependencies
- All Phase 1-7 backend APIs must be available
- WebSocket endpoint for real-time market data
- Authentication/authorization system

### External Dependencies
- DNSE broker API access (backend handles this)
- VN-Index data feed (backend handles this)

## Open Questions

1. **Charting Library**: Which library provides best performance for Vietnam market data volume?
2. **State Management**: Is React Context sufficient or should we use Zustand/Redux?
3. **Real-time Updates**: What is acceptable WebSocket latency for live P&L?
4. **Mobile Support**: Timeline for responsive design implementation?
5. **Backend Readiness**: Are all Phase 1-7 APIs fully implemented and tested?
6. **Historical Data**: How much OHLCV history should we fetch for charts?

## Affected Capabilities

This change creates new capabilities:
- `market-data-visualization`
- `market-regime-display`
- `trade-setup-scanner`
- `risk-position-calculator`
- `trade-execution-ui`
- `position-monitoring`
- `performance-analytics`

No existing capabilities are modified (first frontend implementation).

## Related Changes
None (initial frontend implementation).

## References
- [GST Project Proposal](../../../GST_PROJECT_PROPOSAL.md) - Complete functional specification
- Backend API documentation (TBD - should be provided)
- Vietnam market trading rules (HOSE/HNX regulations)
