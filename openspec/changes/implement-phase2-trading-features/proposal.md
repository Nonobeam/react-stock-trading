# Proposal: Implement Phase 2 Trading Features

**Change ID**: `implement-phase2-trading-features`  
**Date**: 2026-01-13  
**Status**: Proposed  
**Owner**: Development Team

## Problem Statement

Phase 1 of the Vietnam Swing Trading System successfully delivered the core trading interface (Dashboard, Watchlist, Portfolio, Signals). However, traders need additional critical capabilities to improve their trading performance:

1. **No trading journal** - Traders cannot systematically log trades, analyze performance, or learn from past trades
2. **No AI coaching** - No conversational interface for real-time guidance, analysis, and learning
3. **No historical testing** - Cannot validate strategies or optimize parameters before risking capital
4. **No configuration interface** - Risk parameters and preferences are hardcoded, limiting flexibility

These gaps prevent traders from:
- Learning from past mistakes and successes
- Getting real-time help during trading decisions
- Validating strategies before live trading
- Customizing the system to their risk tolerance

## Proposed Solution

Implement Phase 2 trading features as documented in [docs/CORE.md](../../../docs/CORE.md#phase-2), consisting of 4 new main screens:

### 1. Journal Screen (`/features/journal`)
**Purpose**: Complete trade logging, performance tracking, and learning system

**Key Features**:
- Trade list with filtering (all trades, tagged, favorites, case studies)
- Detailed trade views with Overview/Chart/Analysis/Notes/Lessons tabs
- Manual trade entry for historical data
- Performance metrics per trade (MFE/MAE, execution quality, comparison to similar trades)
- AI-generated insights and lessons from each trade
- Post-trade reflection prompts

### 2. AI Coach Screen (`/features/ai-coach`)
**Purpose**: Conversational interface for trading questions, analysis, coaching, and learning

**Key Features**:
- Chat interface with markdown formatting and rich content support
- Context injection via @mentions (@VCB, @Portfolio, @Trade-VNM-Jan17)
- Artifacts panel for complex visualizations (charts, tables, calculators)
- Conversation history with search and organization
- Specialized AI modes (Coach, Analyst, Teacher, Drill Sergeant)
- Voice input/output option
- Inline action buttons within AI responses

### 3. Backtest Lab Screen (`/features/backtest`)
**Purpose**: Historical testing of strategies, parameter optimization, and system validation

**Key Features**:
- Visual backtest configuration (no coding required)
- Historical data replay with Vietnam-specific costs (0.25% commission, 0.1% tax, slippage)
- Comprehensive results with equity curves, trade lists, analytics
- Parameter comparison side-by-side
- Trade replay with entry/exit visualization
- Performance breakdown by setup type, holding period, R-multiple distribution

### 4. Settings Screen (`/features/settings`)
**Purpose**: Configure system preferences, risk parameters, notifications, integrations

**Key Features**:
- Trading parameters (MA periods, indicators, entry criteria)
- Position sizing rules (risk per trade by score, stop loss method)
- Portfolio limits (aggregate risk, max positions, sector limits, correlation)
- Daily/weekly/monthly loss limits
- Notification preferences (types, delivery methods, quiet hours)
- Integration configuration (SSI, data sources)
- Appearance settings
- Account management

## Goals & Success Criteria

### Goals
1. Enable systematic trade journaling and performance analysis
2. Provide real-time AI-powered coaching and guidance
3. Allow historical strategy validation before live trading
4. Give traders full control over risk parameters and system behavior

### Success Criteria
- [ ] All 4 screens fully implemented with routing
- [ ] Journal captures manual and system-generated trades with full Vietnam financials
- [ ] AI Coach can answer questions about trades, portfolio, and trading concepts
- [ ] Backtest Lab can replay historical trades with accurate P&L calculations
- [ ] Settings screen allows modification of all key parameters
- [ ] All features comply with Fintech Neon theme design system
- [ ] Mobile responsive layouts for all screens
- [ ] Integration with existing Phase 1 contexts (Portfolio, Market, Setups)

## Scope

### In Scope
- Journal screen with trade logging and analysis
- AI Coach chat interface (UI only, backend integration separate)
- Backtest configuration and results display (UI only, engine integration separate)
- Settings screen with all parameter categories
- Navigation integration (add new tabs to main navigation)
- Theme compliance for all new components
- Mobile responsive designs
- Basic data persistence (localStorage for settings, mock data for trades initially)

### Out of Scope
- AI Coach backend/LLM integration (separate change)
- Backtest calculation engine (separate change)
- Real-time data integration for backtesting
- SSI platform integration
- Mobile native apps
- Export/import functionality (future enhancement)
- Social features or trade sharing
- Third-party integrations beyond SSI
- Automated trading execution

## Impact Analysis

### User Impact
- **Positive**: Traders gain powerful tools for learning, analysis, and optimization
- **Training needed**: AI Coach usage patterns, backtest interpretation, journal best practices
- **Workflow changes**: Adds post-trade reflection step to trading workflow

### Technical Impact
- **New dependencies**: 
  - Chart library for backtest visualization (likely use existing from Phase 1)
  - Markdown renderer for AI Coach responses
  - Possibly LLM SDK for future AI integration
- **Data model changes**: 
  - New Trade model with full lifecycle tracking
  - Settings/preferences data structure
  - Backtest configuration and results schemas
- **Performance considerations**:
  - Large trade history may require pagination
  - Backtest results can be data-heavy (virtual scrolling for tables)
  - Chat history needs efficient storage/retrieval

### Dependencies
- Builds on Phase 1 trading UI foundation
- Requires existing context providers (MarketDataContext, PositionsContext, etc.)
- May inform future backend API design for persistence

## Risks & Mitigation

### Risks
1. **Complexity overload** - Adding 4 screens at once is ambitious
   - *Mitigation*: Break into sequential deliveries (Journal → Settings → Backtest → AI Coach)

2. **AI Coach expectations** - Users may expect fully functional AI before backend exists
   - *Mitigation*: Clear messaging about UI-only delivery, mock responses demonstrate capability

3. **Backtest accuracy** - Vietnam market quirks (floor/ceiling prices) may not be fully captured
   - *Mitigation*: Document limitations clearly, iterate with trader feedback

4. **Data persistence** - localStorage has limits for large trade histories
   - *Mitigation*: Start with localStorage, plan backend migration, add data limits/warnings

5. **Mobile complexity** - These screens are information-dense, mobile UX challenging
   - *Mitigation*: Prioritize desktop experience, simplified mobile views, progressive disclosure

## Alternatives Considered

1. **Separate Phase 2 into multiple smaller changes**
   - Pros: Smaller scope, faster delivery, easier review
   - Cons: More overhead, delayed value delivery, integration complexity
   - Decision: Single change with sequential implementation (tasks ordered for incremental delivery)

2. **Third-party journal/backtest tools**
   - Pros: Faster time to market, proven solutions
   - Cons: Integration complexity, cost, not Vietnam-specific, doesn't match our UX
   - Decision: Build custom to maintain consistency and Vietnam market focus

3. **Simple text-based journal instead of rich interface**
   - Pros: Simpler to build
   - Cons: Less engaging, harder to derive insights, doesn't match Phase 1 quality
   - Decision: Build full-featured journal as designed

## Implementation Plan

High-level phasing (detailed tasks in [tasks.md](./tasks.md)):

### Phase 2A: Journal & Settings (Weeks 1-2)
- Trade data models and mock data
- Journal screen with all tabs
- Settings screen with all categories
- localStorage persistence

### Phase 2B: Backtest UI (Week 3)
- Backtest configuration form
- Mock backtest execution
- Results display with all tabs
- Parameter comparison

### Phase 2C: AI Coach UI (Week 4)
- Chat interface with markdown support
- Artifacts panel
- @mentions context injection (UI only)
- Conversation history
- Mock AI responses

### Phase 2D: Integration & Polish (Week 5)
- Navigation integration
- Cross-feature linking (jump from Signal to Backtest, etc.)
- Mobile responsive refinements
- Theme compliance audit
- Performance optimization

## Related Changes

- **Phase 1 Trading UI** (`implement-phase1-trading-ui`) - Foundation
- **Future: AI Coach Backend** - Will add real LLM integration
- **Future: Backtest Engine** - Will add calculation capabilities
- **Future: Backend API Integration** - Will replace localStorage persistence

## References

- [docs/CORE.md Phase 2 Section](../../../docs/CORE.md#phase-2) - Complete design specifications
- [docs/FINTECH_NEON_THEME.md](../../../docs/FINTECH_NEON_THEME.md) - Design system requirements
- [docs/PHASE1_COMPLETE.md](../../../docs/PHASE1_COMPLETE.md) - Existing implementation patterns
- Phase 1 feature implementations in `/src/features/`

## Open Questions

1. **AI Coach backend timing** - When will LLM integration be ready? Affects scope of mock responses
2. **Trade data source** - Will backend provide historical trade data, or manual entry only initially?
3. **Backtest data requirements** - How much historical price data is available? Format?
4. **Settings persistence** - localStorage acceptable for MVP, or need backend immediately?
5. **Mobile priority** - Is mobile experience required for MVP, or can we prioritize desktop?

## Approval

This proposal requires review and approval before implementation begins.

**Reviewers**: Product Owner, Tech Lead, UX Designer  
**Approval Date**: _Pending_  
**Approved By**: _Pending_
