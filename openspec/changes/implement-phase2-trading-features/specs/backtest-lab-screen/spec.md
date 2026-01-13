# Specification: Backtest Lab Screen

**Capability**: `backtest-lab-screen`  
**Status**: New  
**Related Changes**: `implement-phase2-trading-features`

## Overview

The Backtest Lab Screen provides historical strategy testing with visual configuration (no coding required). This Phase 2 implementation delivers the UI with client-side calculations, preparing for future server-side optimization.

## ADDED Requirements

### Requirement: BACKTEST-UI-001 - Backtest Configuration

The system shall provide a comprehensive form for configuring backtest parameters without requiring code.

#### Scenario: Creating a new backtest
**Given** the user clicks "New Backtest" button  
**When** the configuration form loads  
**Then** the system displays sections for:
- Basic settings (name, date range, symbols, starting capital)
- Strategy parameters (setup types, MA periods, indicators, entry criteria)
- Risk management (stop loss method, targets, position sizing)
- Costs (commission, tax, slippage)  
**And** all fields are pre-populated with current live settings from SettingsContext  
**And** provides "Load Template" dropdown for common configurations

#### Scenario: Selecting stocks to backtest
**Given** the user is in the configuration form  
**When** the user views the "Stocks to Test" section  
**Then** the system provides radio options:
- "All VN30" (30 largest stocks)
- "Custom List" with multi-select dropdown
- "Single Stock" with autocomplete input  
**When** the user selects "Custom List"  
**Then** the system displays a multi-select with all available symbols  
**And** allows adding symbols one by one or by typing comma-separated list  
**And** displays count of selected symbols

#### Scenario: Configuring entry criteria
**Given** the user configures strategy parameters  
**When** the user views "Entry Criteria" section  
**Then** the system allows selection of:
- Minimum score (slider 1-10, default 7)
- Setup types (checkboxes: Pullback 20EMA, Pullback 50EMA, Breakout, Mean Reversion)
- Volume confirmation (checkbox)
- Trend alignment (checkbox)  
**And** provides tooltip explanations for each criterion

#### Scenario: Setting up targets and exits
**Given** the user configures exits  
**When** the user views "Profit Targets" section  
**Then** the system displays three target inputs:
- T1: R-multiple (number input) and exit percentage (e.g., 2R, 25%)
- T2: R-multiple and exit percentage (e.g., 3R, 25%)
- T3: Method dropdown (Fixed R-multiple or Trail with indicator) and value  
**And** validates that T1 < T2 < T3 if all fixed  
**And** validates exit percentages sum to ≤100%

#### Scenario: Including Vietnam-specific costs
**Given** the user views "Costs & Slippage" section  
**Then** the system displays pre-filled values:
- Commission: 0.25% per side (editable)
- Tax: 0.1% on sells only (editable)
- Slippage: 0.3% per side (editable)  
**And** calculates total round-trip cost automatically (0.7%)  
**And** provides tooltip: "Vietnam market costs - adjust if testing other markets"

---

### Requirement: BACKTEST-UI-002 - Backtest Execution

The system shall execute backtests using client-side calculations with Web Workers for non-blocking performance.

#### Scenario: Running a backtest
**Given** the user has configured a backtest  
**When** the user clicks "Run Backtest"  
**Then** the system validates all required fields  
**And** displays loading modal with progress bar  
**And** spawns Web Worker to perform calculations  
**And** updates progress as historical data is processed  
**And** completes within reasonable time (<30 seconds for 3-year, 30-stock backtest)  
**When** calculations complete  
**Then** the system displays results screen  
**And** logs execution time in console for performance monitoring

#### Scenario: Validation errors before running
**Given** the user has incomplete configuration  
**When** the user clicks "Run Backtest"  
**Then** the system validates and highlights errors:
- Missing backtest name
- No stocks selected
- Date range invalid (end before start)
- T1/T2/T3 R-multiples not in ascending order  
**And** displays error summary at top of form  
**And** scrolls to first error field  
**And** does not start backtest until all errors resolved

---

### Requirement: BACKTEST-UI-003 - Results Overview

The system shall display comprehensive backtest results with key performance metrics.

#### Scenario: Viewing summary metrics
**Given** a backtest has completed successfully  
**When** the results load with "Overview" tab active  
**Then** the system displays key metrics in card grid:
- Total Return (% and VND)
- Annual Return (CAGR %)
- Expectancy (R-multiple per trade)
- Win Rate (%)
- Profit Factor (ratio)
- Max Drawdown (%)
- Sharpe Ratio
- Avg Win/Loss (R-multiples)
- Total Trades count  
**And** each card highlights whether metric is Good/Acceptable/Poor with color coding  
**And** compares to VN-Index buy-and-hold benchmark

#### Scenario: Benchmark comparison
**Given** results include VN-Index benchmark data  
**When** the user views the comparison section  
**Then** the system displays side-by-side table:
- Strategy return vs benchmark return
- Strategy max DD vs benchmark max DD
- Strategy Sharpe vs benchmark Sharpe  
**And** highlights metrics where strategy outperforms (green checkmark)  
**And** displays summary: "Your strategy BEATS buy-and-hold by +X percentage points"

#### Scenario: Monthly returns heatmap
**Given** backtest spans multiple months/years  
**When** the user scrolls to monthly returns section  
**Then** the system displays calendar heatmap:
- Rows for each year
- Columns for each month
- Cells colored by return (green=positive, red=negative, intensity=magnitude)  
**And** hovering cell shows tooltip with exact return percentage  
**And** clicking cell filters trade list to that month

---

### Requirement: BACKTEST-UI-004 - Equity Curve Visualization

The system shall provide interactive equity curve charts showing portfolio growth over time.

#### Scenario: Viewing equity curve
**Given** the user clicks "Equity Curve" tab  
**When** the tab loads  
**Then** the system displays line chart showing:
- Starting capital to ending capital over full date range
- Each trade marked as dot on the line
- Drawdown periods shaded in red overlay  
**And** hovering over any point shows:
- Date
- Equity value
- Trade executed (if on that date)
- Drawdown percentage (if in drawdown)  
**And** provides zoom and pan controls

#### Scenario: Toggling equity curve display modes
**Given** the equity curve is displayed  
**When** the user views display options  
**Then** radio buttons allow switching between:
- Absolute value (VND)
- Percentage gain (%)
- R-multiples  
**When** the user toggles "Show Benchmark"  
**Then** VN-Index buy-and-hold line overlays for comparison

#### Scenario: Drawdown analysis
**Given** the user scrolls to drawdown section  
**When** the underwater equity chart loads  
**Then** the system displays area chart showing:
- Distance from peak equity at each point
- Shaded area between 0% and current drawdown  
**And** displays drawdown statistics table:
- Maximum drawdown (% and duration)
- Average drawdown
- Average recovery time
- Time underwater (% of total period)
- List of longest drawdowns with dates

---

### Requirement: BACKTEST-UI-005 - Trade List and Replay

The system shall provide a detailed list of all backtest trades with replay capability.

#### Scenario: Viewing trade list
**Given** the user clicks "Trade List" tab  
**When** the tab loads  
**Then** the system displays table with columns:
- Trade # (sequential)
- Symbol
- Entry Date/Price
- Exit Date/Price
- Days Held
- Net P/L (VND and %)
- R-multiple
- Exit Reason  
**And** table is sortable by any column  
**And** provides filters: All / Winners / Losers  
**And** uses virtual scrolling for performance with 100+ trades

#### Scenario: Trade replay visualization
**Given** the user clicks a trade row  
**When** the trade replay modal opens  
**Then** the system displays:
- Price chart from 60 days before entry to 30 days after exit
- Entry point marked with green arrow
- Stop loss as horizontal red line
- Targets (T1, T2, T3) as horizontal blue lines
- Exit point marked with arrow (green if profit, red if loss)
- All indicators (EMAs, RSI, volume) at entry time  
**And** displays entry conditions checklist showing what criteria were met  
**And** displays outcome summary (MFE, MAE, R-multiple)  
**And** provides "Previous Trade" / "Next Trade" navigation  
**And** provides "Add to Case Study" button to copy to Journal

---

### Requirement: BACKTEST-UI-006 - Performance Analytics

The system shall break down performance by setup type, holding period, and other dimensions.

#### Scenario: Setup type analysis
**Given** the user clicks "Analytics" tab  
**When** the tab loads  
**Then** the system displays table breaking down results by setup type:
- Setup name (e.g., "Pullback 20EMA")
- Number of trades
- Win rate (%)
- Average R-multiple
- Total R-multiple
- Best trade (highest R)  
**And** highlights best-performing setup  
**And** provides insight: "Pullback to 20 EMA is your best setup! Focus here."

#### Scenario: R-multiple distribution histogram
**Given** backtest results are displayed  
**When** the user scrolls to R-multiple distribution section  
**Then** the system displays histogram chart:
- X-axis: R-multiple buckets (-2R, -1R, 0R, +1R, +2R, +3R, +4R, +5R+)
- Y-axis: Number of trades in each bucket
- Bars colored (red for negative, green for positive)  
**And** displays pattern analysis:
- "Losers cluster tightly around -1R (good stop discipline)"
- "Winners have long tail (excellent for expectancy)"

#### Scenario: Holding period analysis
**Given** backtest results are displayed  
**When** the user views holding period section  
**Then** the system displays table:
- Days held ranges (1-7, 8-14, 15-21, 22-30, 30+)
- Trades count in each range
- Win rate for each range
- Average R-multiple for each range  
**And** highlights optimal holding period range  
**And** provides insight if applicable (e.g., "Best hold time is 8-21 days")

#### Scenario: MAE vs Final R scatter plot
**Given** backtest results are displayed  
**When** the user views MAE analysis section  
**Then** the system displays scatter plot:
- X-axis: MAE (Max Adverse Excursion in R-multiples)
- Y-axis: Final R-multiple
- Each trade plotted as a point (green if winner, red if loser)  
**And** displays regression line  
**And** provides finding: "Most winners had MAE < 0.6R → Current stops well-positioned"

---

### Requirement: BACKTEST-UI-007 - Parameter Comparison

The system shall allow side-by-side comparison of multiple backtest results to optimize parameters.

#### Scenario: Selecting backtests to compare
**Given** the user has run multiple backtests  
**When** the user clicks "Comparison" tab  
**Then** the system displays checkboxes for all saved backtests  
**When** the user selects 2-4 backtests  
**Then** the system displays comparison table with columns for each backtest  
**And** rows for each key metric  
**And** highlights best value in each row (green)  
**And** highlights worst value in each row (red)

#### Scenario: Overlaying equity curves
**Given** the user has selected multiple backtests for comparison  
**When** the comparison view loads  
**Then** the system overlays all equity curves on single chart  
**And** each curve has distinct color and label  
**And** legend allows toggling visibility of each curve  
**And** displays final returns for each in legend

#### Scenario: Identifying optimal parameters
**Given** comparison shows clear winner  
**When** the winner is identified  
**Then** the system displays summary panel:
"Winner: Test B (2.5 ATR stops)
→ Higher returns and better risk-adjusted performance
→ Slightly larger drawdown is acceptable tradeoff"  
**And** provides "Adopt Test B Parameters" button  
**When** clicked, updates Settings to use those parameters

---

### Requirement: BACKTEST-UI-008 - Backtest Management

The system shall allow saving, loading, and organizing backtest configurations and results.

#### Scenario: Saving a backtest
**Given** a backtest has completed  
**When** the user clicks "Save Backtest"  
**Then** the system prompts for a name (pre-filled with config name)  
**And** saves configuration + results to localStorage  
**And** adds to "My Backtests" list  
**And** displays toast "Backtest saved successfully"

#### Scenario: Loading a saved backtest
**Given** the user has saved backtests  
**When** the user clicks "My Backtests" tab  
**Then** the system displays list of saved backtests with:
- Name
- Date range
- Symbols tested
- Final return
- Date run  
**When** the user clicks a backtest  
**Then** the system loads and displays full results  
**And** provides "Run Again" button to re-execute with same config

#### Scenario: Deleting old backtests
**Given** localStorage is approaching limit  
**When** the user views "My Backtests"  
**Then** the system displays warning: "Storage approaching limit (18/20 backtests)"  
**And** each backtest has delete icon  
**When** user deletes a backtest  
**Then** system confirms "Delete backtest 'Test A'?"  
**And** removes from localStorage  
**And** updates count

---

### Requirement: BACKTEST-UI-009 - Theme Compliance

The system shall strictly adhere to Fintech Neon theme for all backtest components.

#### Scenario: Backtest visual elements follow theme
**Given** any backtest screen is rendered  
**Then** all colors use CSS variables (--bg, --panel, --accent, --text, etc.)  
**And** all spacing uses gap tokens (--gap-xs to --gap-2xl)  
**And** all border radius uses --radius tokens  
**And** all shadows use --shadow tokens  
**And** charts use accent color (--accent) for primary lines with --glow-accent  
**And** positive returns use --success color  
**And** negative returns use --danger color  
**And** all interactive elements have hover states with accent glow  
**And** no emojis in production UI

---

### Requirement: BACKTEST-UI-010 - Mobile Responsive Layout

The system shall provide simplified mobile views for backtest access on smaller devices.

#### Scenario: Configuration form on mobile (<768px)
**Given** the user accesses backtest configuration on mobile  
**When** the page loads  
**Then** the system displays form as vertical single-column layout  
**And** collapses sections into accordions  
**And** uses native mobile pickers for dates  
**And** provides "Quick Templates" as simplified button grid

#### Scenario: Results view on mobile
**Given** the user views backtest results on mobile  
**Then** key metrics display as card stack (not grid)  
**And** charts are simplified with touch-zoom enabled  
**And** tables switch to card view with "View More" expansion  
**And** comparison feature shows one backtest at a time with swipe navigation

---

## Non-Functional Requirements

### Performance
- Backtest configuration form loads <300ms
- Backtest execution for 3-year, 30-stock test <30 seconds
- Results rendering <500ms
- Chart interactions maintain 60fps

### Accuracy
- Vietnam financial calculations must be exact (0.25% commission, 0.1% tax)
- R-multiple calculations accurate to 2 decimal places
- Slippage applied consistently to all entries/exits

### Data Limits
- Max 20 saved backtests in localStorage
- Max 3-year date range per backtest
- Max 50 symbols per backtest
- Warning when approaching limits

---

## Related Capabilities

- **journal-screen** (Phase 2): Compare backtest to live trades
- **settings-screen** (Phase 2): Load/save default backtest parameters
- **signals-screen** (Phase 1): Test signal generation strategies

---

## Future Enhancements (Out of Scope)

- Server-side backtest engine for faster execution
- Walk-forward optimization
- Monte Carlo simulation
- Portfolio-level backtesting (multiple simultaneous positions)
- Custom indicator creation
- Strategy scripting (for advanced users)
- Backtest sharing and community library
