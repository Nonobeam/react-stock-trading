# Implementation Tasks: Phase 2 Trading Features

**Change ID**: `implement-phase2-trading-features`  
**Estimated Duration**: 4-5 weeks  
**Implementation Order**: Sequential (Journal → Settings → Backtest → AI Coach)

## Overview

This tasks list breaks Phase 2 into incremental, verifiable deliveries. Each task should result in working, testable functionality that provides immediate value.

---

## Phase 2A: Foundation & Data Models (Week 1)

### Task Group: Shared Infrastructure

- [ ] **TASK-001**: Create storage service abstraction
  - Create `/services/storage/StorageService.ts` interface
  - Implement `LocalStorageProvider` with serialization/deserialization
  - Add storage limit detection and warnings
  - Add error handling for QuotaExceeded
  - Write unit tests
  - **Verification**: Can save/load JSON objects to localStorage with error handling

- [ ] **TASK-002**: Create shared components for Phase 2
  - Implement `TabNavigation` component (reusable tabs)
  - Implement `MarkdownRenderer` component (for AI Coach)
  - Implement `CodeBlock` component with syntax highlighting
  - Implement `ChartContainer` wrapper component
  - Implement `EmptyState` component
  - All components follow Fintech Neon theme strictly
  - **Verification**: Components render correctly in Storybook/isolation

- [ ] **TASK-003**: Define TypeScript data models
  - Create `src/shared/types/Trade.ts` (Journal trade model)
  - Create `src/shared/types/Settings.ts` (Settings model)
  - Create `src/shared/types/Backtest.ts` (Backtest config/results models)
  - Create `src/shared/types/ChatMessage.ts` (AI Coach message model)
  - Add validation schemas using Zod or similar
  - **Verification**: TypeScript compiles without errors, models fully typed

---

## Phase 2B: Journal Screen (Week 1-2)

### Task Group: Journal Core

- [ ] **TASK-004**: Create TradesContext
  - Create `src/context/TradesContext.tsx`
  - Implement state management for trades array
  - Implement CRUD operations (add, update, delete trade)
  - Integrate with StorageService for persistence
  - Add trade filtering logic (by tag, favorite, date range)
  - **Verification**: Context can manage 100+ trades without performance issues

- [ ] **TASK-005**: Build Journal layout and navigation
  - Create `src/features/journal/JournalView.tsx`
  - Implement tab navigation (All Trades, Tagged, Favorites, Case Studies)
  - Implement search and filter controls
  - Implement sort dropdown (date, P/L, R-multiple)
  - Add "Add Manual Entry" and "Export Journal" buttons
  - **Verification**: Navigation works, filters respond correctly

- [ ] **TASK-006**: Build trade list component
  - Create `src/features/journal/components/TradeList.tsx`
  - Render trades as cards or compact list items
  - Show: symbol, date, P/L, R-multiple, days held, win/loss indicator
  - Implement selection (clicking highlights and loads detail)
  - Add visual indicators (green for wins, red for losses)
  - **Verification**: List renders 500 trades smoothly, selection works

- [ ] **TASK-007**: Build trade detail panel - Overview tab
  - Create `src/features/journal/components/TradeDetail.tsx`
  - Implement multi-tab interface (Overview, Chart, Analysis, Notes, Lessons)
  - Build Overview tab: Entry details, Exit details, Setup info
  - Display Vietnam financials with accurate calculations:
    - Commission: 0.25% (min 500 VND)
    - Tax: 0.1% on exit value
    - Gross/Net P/L and R-multiple
  - **Verification**: Overview displays all data correctly, financials accurate

- [ ] **TASK-008**: Build trade detail panel - Chart tab
  - Create `src/features/journal/components/TradeChart.tsx`
  - Integrate chart library (use existing from Phase 1)
  - Display annotated price chart with entry/exit markers
  - Show stop loss and target lines
  - Overlay 20 EMA and 50 EMA
  - Add volume bars
  - **Verification**: Chart displays correctly with all annotations

- [ ] **TASK-009**: Build trade detail panel - Analysis tab
  - Create `src/features/journal/components/TradeAnalysis.tsx`
  - Display performance metrics (MFE, MAE, days to each)
  - Implement comparison to similar trades logic
  - Display correlation analysis with concurrent positions
  - **Verification**: Metrics calculate correctly, comparisons make sense

- [ ] **TASK-010**: Build trade detail panel - Notes tab
  - Create `src/features/journal/components/TradeNotes.tsx`
  - Implement three text area sections (pre-trade, during-trade, post-trade)
  - Add structured reflection prompts
  - Implement auto-save on blur
  - **Verification**: Notes persist correctly, prompts guide user input

- [ ] **TASK-011**: Build trade detail panel - Lessons tab
  - Create `src/features/journal/components/TradeLessons.tsx`
  - Implement mock AI lesson generation (pattern-based)
  - Display insights with actionable recommendations
  - Add "Add to Trading Rules" button (logs to console for now)
  - **Verification**: Lessons generate for various trade outcomes

- [ ] **TASK-012**: Build manual trade entry form
  - Create `src/features/journal/components/ManualTradeEntry.tsx`
  - Implement form with all required fields (symbol, dates, prices, shares, setup type)
  - Add automatic P/L calculation on input change
  - Implement validation (required fields, price logic, date logic)
  - **Verification**: Can enter trade manually, calculations accurate, validation works

- [ ] **TASK-013**: Implement trade tagging and organization
  - Add tag input with autocomplete from existing tags
  - Implement favorite toggle (star icon)
  - Implement case study designation
  - Update filtering to respect tags/favorites/case studies
  - **Verification**: Tags, favorites, case studies filter correctly

- [ ] **TASK-014**: Build performance summary dashboard
  - Create `src/features/journal/components/PerformanceSummary.tsx`
  - Display aggregate metrics: total trades, win rate, total P/L, avg R
  - Show best and worst trades
  - Implement date range filtering for metrics
  - **Verification**: Metrics accurate, updates in real-time with changes

- [ ] **TASK-015**: Implement trade export functionality
  - Add CSV export utility function
  - Generate CSV with all trade fields
  - Trigger browser download
  - Handle filtered exports (export only visible trades)
  - **Verification**: CSV downloads correctly, opens in Excel/Sheets

- [ ] **TASK-016**: Implement mobile responsive layout for Journal
  - Apply mobile-first responsive CSS (<768px breakpoint)
  - Convert table to card stack on mobile
  - Full-screen trade detail overlay on mobile
  - Collapsible summary metrics
  - **Verification**: Journal usable on mobile device (test on real phone)

- [ ] **TASK-017**: Connect Journal with Portfolio (integration)
  - When position closes in Portfolio, auto-create Journal entry
  - Add "View in Journal" button on closed positions in Portfolio
  - Link opens Journal with trade highlighted
  - **Verification**: Closing position creates journal entry automatically

- [ ] **TASK-018**: Theme compliance audit for Journal
  - Review all Journal components against Fintech Neon theme checklist
  - Fix any hardcoded colors, spacing, or styles
  - Ensure hover states have glow effect
  - Ensure no emojis in UI
  - **Verification**: All Journal screens pass theme checklist

---

## Phase 2C: Settings Screen (Week 2)

### Task Group: Settings Core

- [ ] **TASK-019**: Create SettingsContext
  - Create `src/context/SettingsContext.tsx`
  - Implement state management for all settings
  - Load defaults on initialization
  - Integrate with StorageService for persistence
  - Broadcast changes to other contexts when saved
  - **Verification**: Settings load/save to localStorage, contexts update

- [ ] **TASK-020**: Build Settings layout and navigation
  - Create `src/features/settings/SettingsView.tsx`
  - Implement tab navigation for all categories
  - Add "Save Changes" and "Reset to Defaults" buttons
  - Implement unsaved changes indicator on tabs
  - Add confirmation dialog when switching tabs with unsaved changes
  - **Verification**: Tab navigation works, unsaved changes warning appears

- [ ] **TASK-021**: Build Trading Parameters settings
  - Create `src/features/settings/components/TradingParametersSettings.tsx`
  - Implement inputs for MA periods (Fast EMA, Slow EMA, Long-term SMA)
  - Implement inputs for indicators (RSI, MACD, ATR periods)
  - Implement entry criteria inputs (minimum score, volume threshold)
  - Add validation (Slow EMA > Fast EMA)
  - Add "Test with Current Watchlist" simulation button
  - **Verification**: All inputs work, validation prevents invalid states

- [ ] **TASK-022**: Build Position Sizing settings
  - Create `src/features/settings/components/PositionSizingSettings.tsx`
  - Implement risk per trade by score inputs (7-8, 9, 10)
  - Implement stop loss method radio buttons (ATR, Percentage, Technical)
  - Add ATR multiplier input
  - Add Vietnam gap risk adjustment multiplier
  - Add position size calculator with examples
  - **Verification**: All inputs work, calculator shows accurate results

- [ ] **TASK-023**: Build Portfolio Limits settings
  - Create `src/features/settings/components/PortfolioLimitsSettings.tsx`
  - Implement max aggregate risk input
  - Implement max single position input
  - Implement max open positions input
  - Implement max sector exposure input
  - Implement max correlation slider
  - Add warning if current portfolio exceeds new limits
  - **Verification**: All limits configurable, warnings appear appropriately

- [ ] **TASK-024**: Build Loss Limits settings
  - Create `src/features/settings/components/LossLimitsSettings.tsx`
  - Implement daily loss limit inputs (stop new trades, close all)
  - Implement weekly and monthly loss limit inputs
  - Implement loss limit action radio buttons
  - Add notification method checkboxes
  - Display current period loss next to limits
  - **Verification**: Limits set correctly, validation prevents illogical values

- [ ] **TASK-025**: Build Notification Preferences settings
  - Create `src/features/settings/components/NotificationSettings.tsx`
  - Implement entry signal checkboxes (by score range)
  - Implement exit signal checkboxes (stop, target, time, thesis)
  - Implement risk alert checkboxes
  - Implement delivery method checkboxes (browser, email, SMS)
  - Implement quiet hours time pickers
  - Add "Test Notification" buttons
  - **Verification**: All preferences configurable, test buttons work

- [ ] **TASK-026**: Build Appearance settings
  - Create `src/features/settings/components/AppearanceSettings.tsx`
  - Display theme selector (Fintech Neon only for now, others grayed)
  - Implement display preference toggles (compact mode, animations, high contrast)
  - Apply changes immediately without requiring save
  - **Verification**: Compact mode and animation toggles affect UI immediately

- [ ] **TASK-027**: Build Data & Privacy settings
  - Create `src/features/settings/components/DataPrivacySettings.tsx`
  - Display storage usage breakdown with progress bars
  - Implement "Export All Data" button (JSON backup)
  - Implement "Import Data" button with validation and preview
  - Implement "Clear All Data" button with critical warning and confirmation
  - **Verification**: Export/import works, clear data resets system

- [ ] **TASK-028**: Implement settings persistence and broadcasting
  - Add save functionality that updates localStorage
  - Broadcast SettingsContext changes to all feature contexts
  - Validate all settings before save
  - Show success toast on save
  - **Verification**: Saving settings applies changes across all features without reload

- [ ] **TASK-029**: Implement mobile responsive layout for Settings
  - Convert tabs to dropdown menu on mobile
  - Stack all form sections vertically
  - Increase touch targets for inputs/sliders
  - Sticky save button at bottom
  - **Verification**: Settings usable on mobile device

- [ ] **TASK-030**: Theme compliance audit for Settings
  - Review all Settings components against theme checklist
  - Fix any violations
  - **Verification**: All Settings screens pass theme checklist

---

## Phase 2D: Backtest Lab Screen (Week 3)

### Task Group: Backtest Core

- [ ] **TASK-031**: Create BacktestContext
  - Create `src/context/BacktestContext.tsx`
  - Implement state for backtest configs and results
  - Integrate with StorageService (limit: 20 backtests)
  - **Verification**: Context manages backtest lifecycle

- [ ] **TASK-032**: Build Backtest Lab layout
  - Create `src/features/backtest/BacktestView.tsx`
  - Implement main navigation (My Backtests, New Backtest, Templates)
  - **Verification**: Navigation structure works

- [ ] **TASK-033**: Build backtest configuration form
  - Create `src/features/backtest/components/BacktestConfigForm.tsx`
  - Implement "Basic Settings" section (name, date range, symbols, capital)
  - Implement "Strategy Parameters" section (setup types, MAs, indicators, criteria)
  - Implement "Risk Management" section (stop method, targets)
  - Implement "Costs" section (commission, tax, slippage)
  - Load current settings from SettingsContext as defaults
  - Add "Load Template" dropdown
  - **Verification**: All config options work, validation prevents invalid configs

- [ ] **TASK-034**: Implement backtest engine (client-side)
  - Create `src/services/backtest/BacktestEngine.ts`
  - Implement core backtest algorithm:
    - Setup detection based on config params
    - Entry/exit simulation
    - Position sizing calculations
    - Vietnam cost calculations (0.25% commission, 0.1% tax, slippage)
    - R-multiple tracking
  - Use Web Worker for non-blocking execution
  - Add progress reporting
  - **Verification**: Backtest completes <30s for 3-year, 30-stock test, results accurate

- [ ] **TASK-035**: Create mock historical data service
  - Create `src/services/mock/historicalDataService.ts`
  - Generate realistic mock daily price data for VN30 stocks (3+ years)
  - Include OHLCV (Open, High, Low, Close, Volume)
  - **Verification**: Backtest engine can consume mock data

- [ ] **TASK-036**: Build backtest results - Overview tab
  - Create `src/features/backtest/components/BacktestResults.tsx`
  - Implement tab navigation (Overview, Equity Curve, Trade List, Analytics, Comparison)
  - Build Overview tab with key metrics cards:
    - Total return, CAGR, expectancy, win rate, profit factor
    - Max drawdown, Sharpe ratio, avg win/loss, total trades
  - Display benchmark comparison table
  - Display monthly returns heatmap
  - **Verification**: Metrics calculate correctly, display clearly

- [ ] **TASK-037**: Build backtest results - Equity Curve tab
  - Create `src/features/backtest/components/EquityCurve.tsx`
  - Display line chart showing portfolio value over time
  - Mark each trade as dot on line
  - Shade drawdown periods
  - Implement display mode toggle (absolute, %, R-multiple)
  - Implement benchmark overlay toggle
  - Display underwater equity (drawdown chart)
  - Show drawdown statistics table
  - **Verification**: Charts render correctly, interactive, informative

- [ ] **TASK-038**: Build backtest results - Trade List tab
  - Create `src/features/backtest/components/BacktestTradeList.tsx`
  - Display table with all backtest trades
  - Implement sorting by any column
  - Implement filtering (All, Winners, Losers)
  - Use virtual scrolling for performance (100+ trades)
  - **Verification**: Table performs well with large trade counts

- [ ] **TASK-039**: Build trade replay modal
  - Create `src/features/backtest/components/TradeReplay.tsx`
  - Display annotated chart for selected trade
  - Show entry conditions checklist
  - Show outcome metrics (MFE, MAE, R-multiple)
  - Implement Previous/Next navigation
  - Add "Add to Case Study" button (creates Journal entry)
  - **Verification**: Trade replay works, navigation smooth

- [ ] **TASK-040**: Build backtest results - Analytics tab
  - Create `src/features/backtest/components/BacktestAnalytics.tsx`
  - Display setup type breakdown table
  - Display R-multiple distribution histogram
  - Display holding period analysis table
  - Display MAE vs Final R scatter plot
  - Provide insights for each analysis
  - **Verification**: Analytics accurate, insights helpful

- [ ] **TASK-041**: Build backtest results - Comparison tab
  - Create `src/features/backtest/components/BacktestComparison.tsx`
  - Allow selecting 2-4 backtests to compare
  - Display side-by-side metrics table with highlighting
  - Overlay equity curves on single chart
  - Identify and recommend optimal parameters
  - Add "Adopt Parameters" button to update Settings
  - **Verification**: Comparison works, recommendations reasonable

- [ ] **TASK-042**: Implement backtest save/load/delete
  - Add save functionality (to BacktestContext and localStorage)
  - Build "My Backtests" list view
  - Implement load saved backtest
  - Implement "Run Again" button
  - Implement delete with confirmation
  - Add storage limit warnings (max 20)
  - **Verification**: CRUD operations work, limits enforced

- [ ] **TASK-043**: Implement backtest templates
  - Create preset configurations for common strategies
  - Templates: "Conservative Swing", "Aggressive Breakout", "Balanced"
  - Allow saving current config as template
  - **Verification**: Templates load and save correctly

- [ ] **TASK-044**: Implement mobile responsive layout for Backtest
  - Simplify config form to wizard-style on mobile
  - Card stack for results metrics
  - Simplified charts with touch-zoom
  - Table to card view conversion
  - **Verification**: Backtest usable on mobile

- [ ] **TASK-045**: Theme compliance audit for Backtest
  - Review all Backtest components against theme checklist
  - Fix violations
  - **Verification**: All Backtest screens pass theme checklist

---

## Phase 2E: AI Coach Screen (Week 4)

### Task Group: AI Coach Core

- [ ] **TASK-046**: Create ChatContext
  - Create `src/context/ChatContext.tsx`
  - Implement state for messages, conversations, artifacts
  - Integrate with StorageService (limit: 50 conversations)
  - **Verification**: Context manages chat state correctly

- [ ] **TASK-047**: Build AI Coach layout
  - Create `src/features/ai-coach/AICoachView.tsx`
  - Implement main chat area with message list
  - Implement conversation history sidebar (collapsible)
  - Implement artifacts panel (collapsible, appears when needed)
  - **Verification**: Layout responsive, panels toggle correctly

- [ ] **TASK-048**: Build chat message components
  - Create `src/features/ai-coach/components/ChatMessage.tsx`
  - Implement user message component (right-aligned)
  - Implement AI message component (left-aligned, with avatar)
  - Implement markdown rendering in AI messages
  - Implement action buttons within messages
  - Add message actions (copy, regenerate, thumbs up/down)
  - **Verification**: Messages render correctly, markdown formats properly

- [ ] **TASK-049**: Build chat input component
  - Create `src/features/ai-coach/components/ChatInput.tsx`
  - Implement text input with auto-resize
  - Add send button (enabled only when text present)
  - Implement loading indicator (typing dots)
  - Add attachment, mention, voice icons (voice functional, others placeholder)
  - **Verification**: Input works, smooth UX

- [ ] **TASK-050**: Implement @mentions autocomplete
  - Create `src/features/ai-coach/components/MentionAutocomplete.tsx`
  - Detect "@" trigger in input
  - Show dropdown with: symbols, @Portfolio, @Watchlist, trades
  - Filter as user types
  - On selection, inject context data into message
  - **Verification**: Autocomplete works, context injected correctly

- [ ] **TASK-051**: Implement mock AI response system
  - Create `src/services/ai/mockAIService.ts`
  - Implement pattern matching for common queries:
    - Trade analysis ("Should I take [symbol]?")
    - Performance review ("How am I doing?")
    - Educational queries ("Explain [concept]")
    - Psychological support (frustrated, losing streak)
  - Generate structured mock responses with markdown
  - Include action buttons where appropriate
  - Add fallback for unrecognized queries
  - **Verification**: Mock responses feel intelligent, cover most common cases

- [ ] **TASK-052**: Build artifacts panel
  - Create `src/features/ai-coach/components/ArtifactsPanel.tsx`
  - Implement tab system for multiple artifacts
  - Support chart artifacts (equity curve, etc.)
  - Support table artifacts (trade comparison, etc.)
  - Add full-screen and download options
  - **Verification**: Artifacts display correctly, stay visible during chat

- [ ] **TASK-053**: Build conversation history sidebar
  - Create `src/features/ai-coach/components/ConversationHistory.tsx`
  - Display conversations organized by date
  - Implement search functionality
  - Implement star/unstar
  - Implement delete with confirmation
  - Auto-generate conversation titles from first message
  - **Verification**: History management works, search performs well

- [ ] **TASK-054**: Implement suggested questions
  - Create `src/features/ai-coach/components/SuggestedQuestions.tsx`
  - Display initial suggestions in new conversation
  - Update suggestions contextually after AI responses
  - Clicking suggestion populates and sends message
  - **Verification**: Suggestions helpful, guide users effectively

- [ ] **TASK-055**: Implement voice input (optional)
  - Add speech-to-text using Web Speech API
  - Display recording indicator
  - Transcribe to text in input field
  - Allow review/edit before send
  - **Verification**: Voice input works on supported browsers

- [ ] **TASK-056**: Implement message persistence
  - Auto-save conversations to localStorage as messages are sent
  - Assign conversation IDs and timestamps
  - Implement max 50 conversations limit with auto-archive
  - **Verification**: Conversations persist across sessions

- [ ] **TASK-057**: Add mock AI disclaimer
  - Display disclaimer in first AI response of each conversation
  - Add "Mock AI" badge in AI avatar area
  - Add tooltip explaining limitation
  - **Verification**: Users aware responses are simulated

- [ ] **TASK-058**: Implement cross-feature integrations
  - "Ask AI Coach" button on Dashboard insights
  - "@Symbol" links to Watchlist/Signals in AI responses
  - "[VIEW TRADE]" button navigates to Journal
  - Pre-populate queries from other features
  - **Verification**: Integration points work smoothly

- [ ] **TASK-059**: Implement mobile responsive layout for AI Coach
  - Full-screen chat on mobile
  - Hide conversation history in drawer (swipe or button to open)
  - Artifacts open full-screen modal
  - Larger touch targets for buttons
  - **Verification**: AI Coach usable on mobile

- [ ] **TASK-060**: Theme compliance audit for AI Coach
  - Review all AI Coach components against theme checklist
  - Fix violations
  - **Verification**: All AI Coach screens pass theme checklist

---

## Phase 2F: Integration & Polish (Week 5)

### Task Group: Cross-Feature Integration

- [ ] **TASK-061**: Update main app navigation
  - Add 4 new tabs to main navigation: Journal, AI Coach, Backtest, Settings
  - Update routing configuration
  - Add active tab highlighting
  - Add notification badges where appropriate (e.g., AI Coach if new insights)
  - **Verification**: All 8 tabs accessible, routing works

- [ ] **TASK-062**: Implement Dashboard → Phase 2 integrations
  - Add "View All Trades" link from Dashboard to Journal
  - Add "Configure Risk" link from Dashboard to Settings
  - Add "Ask AI Coach" from AI Insights card to AI Coach
  - **Verification**: Links navigate correctly with context

- [ ] **TASK-063**: Implement Portfolio → Journal integration
  - Auto-create Journal entry when position closes
  - "View in Journal" button on closed positions
  - Link highlights and opens specific trade
  - **Verification**: Closed positions appear in Journal automatically

- [ ] **TASK-064**: Implement Signals → Backtest integration
  - "Backtest this setup" button on signal cards
  - Pre-populates Backtest config with signal's setup type
  - **Verification**: Button opens Backtest with correct config

- [ ] **TASK-065**: Implement Settings broadcasting
  - When Settings saved, broadcast to all contexts
  - Dashboard recalculates metrics with new params
  - Watchlist recalculates setups
  - Signals regenerates with new params
  - Backtest defaults update
  - **Verification**: Changing MA period in Settings updates all features immediately

### Task Group: Polish & Quality

- [ ] **TASK-066**: Implement loading states
  - Add skeleton screens for initial loads (Journal, Backtest results, Settings)
  - Add inline spinners for actions (saving, calculating, generating)
  - Add progress bars for long operations (backtest execution)
  - **Verification**: Loading states smooth, informative

- [ ] **TASK-067**: Implement error handling
  - Add error boundaries around each feature module
  - Implement toast notifications for transient errors
  - Implement inline error messages for form validation
  - Handle localStorage quota exceeded gracefully
  - **Verification**: Errors handled gracefully, user guided to recovery

- [ ] **TASK-068**: Implement empty states
  - Add empty states for: No trades yet, No backtests, No conversations
  - Each empty state includes icon, explanation, and CTA button
  - **Verification**: Empty states helpful, guide users to first action

- [ ] **TASK-069**: Performance optimization
  - Implement React.memo for expensive components
  - Add virtual scrolling to long lists (trade list, backtest trade list)
  - Lazy load feature modules (code splitting)
  - Debounce search inputs
  - **Verification**: App remains responsive with large datasets

- [ ] **TASK-070**: Accessibility audit
  - Ensure all interactive elements keyboard navigable
  - Add ARIA labels to all form inputs
  - Verify color contrast ratios (already good with theme)
  - Test with screen reader
  - **Verification**: WCAG AA compliance, keyboard-only navigation works

- [ ] **TASK-071**: Browser compatibility testing
  - Test on Chrome 90+
  - Test on Firefox 88+
  - Test on Safari 14+
  - Test on Edge 90+
  - Fix any browser-specific issues
  - **Verification**: All features work on all target browsers

- [ ] **TASK-072**: Mobile device testing
  - Test on actual Android phone (<768px)
  - Test on actual iPhone
  - Test on iPad (768-1024px)
  - Fix any mobile-specific issues
  - **Verification**: All features usable on real devices

- [ ] **TASK-073**: Final theme compliance audit
  - Review every screen against Fintech Neon theme checklist
  - Fix any remaining violations (colors, spacing, shadows, etc.)
  - Verify hover states have glow effect
  - Verify no emojis in production UI
  - **Verification**: 100% theme compliance across all Phase 2 features

- [ ] **TASK-074**: Documentation
  - Add JSDoc comments to all public functions/components
  - Update README with Phase 2 features
  - Create user guide or FAQ for new features
  - Document data models and schemas
  - **Verification**: Code well-documented, README up-to-date

- [ ] **TASK-075**: Create demo data
  - Add "Load Demo Data" button in Settings (dev mode)
  - Generate realistic sample trades, backtests, conversations
  - Useful for testing and demonstrations
  - **Verification**: Demo data loads correctly, realistic

### Task Group: Deployment Preparation

- [ ] **TASK-076**: Code review preparation
  - Self-review all code
  - Run linter and fix issues
  - Run formatter (Prettier)
  - Remove console.logs (or gate behind debug flag)
  - Remove commented-out code
  - **Verification**: Code clean, follows conventions

- [ ] **TASK-077**: Testing
  - Write unit tests for critical functions (Vietnam financials, backtest engine, etc.)
  - Write integration tests for context + component interactions
  - Manual testing of all user journeys (morning routine, responding to signal, etc.)
  - **Verification**: Test coverage >60%, all journeys work

- [ ] **TASK-078**: Build and bundle optimization
  - Run production build
  - Analyze bundle size
  - Ensure tree-shaking working
  - Optimize any large dependencies
  - **Verification**: Bundle size reasonable (+150-200KB gzipped is acceptable)

- [ ] **TASK-079**: Feature flags and rollout plan
  - Implement feature flags for gradual rollout if needed
  - Prepare rollback plan
  - **Verification**: Can enable/disable Phase 2 features via flags

- [ ] **TASK-080**: Final QA checklist
  - All 4 screens accessible and functional
  - All integration points work
  - Theme 100% compliant
  - Mobile responsive
  - No console errors
  - localStorage persistence works
  - **Verification**: Complete QA pass, no critical bugs

---

## Success Criteria

Phase 2 is complete when:
- [ ] All 80 tasks completed and verified
- [ ] All 4 new screens (Journal, AI Coach, Backtest, Settings) fully functional
- [ ] Integration with Phase 1 features working
- [ ] Fintech Neon theme compliance at 100%
- [ ] Mobile responsive on real devices
- [ ] No critical bugs
- [ ] Documentation complete
- [ ] Code reviewed and approved
- [ ] Deployment ready

---

## Notes

- **Dependencies**: Requires Phase 1 completion (Dashboard, Watchlist, Portfolio, Signals)
- **Team Size**: Estimate assumes 1-2 full-time developers
- **Adjustments**: Tasks can be parallelized if multiple developers available
- **Flexibility**: AI Coach can be deprioritized if backend LLM integration delayed
- **Iteration**: After MVP, gather user feedback and iterate on UX

---

**Last Updated**: 2026-01-13  
**Status**: Ready for implementation
