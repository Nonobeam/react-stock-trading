# Performance Analytics

## ADDED Requirements

### Requirement: Display Performance Overview Metrics
**Priority**: P1  
**Dependencies**: Backend performance metrics API

The system SHALL display key trading performance metrics (win rate, expectancy, profit factor, Sharpe ratio, max drawdown) to evaluate strategy effectiveness.

#### Scenario: View Performance Cards
**Given** user has completed 40 trades  
**When** analytics dashboard loads  
**Then** the system displays metric cards:
- **Win Rate**: 62.5% ✅ Good
- **Expectancy**: +0.45R ✅ Positive
- **Profit Factor**: 1.85 ✅ Good
- **Max Drawdown**: -8.3% ✅ Healthy

#### Scenario: Win Rate Card Details
**Given** user has 25 wins, 15 losses (40 total)  
**When** win rate card renders  
**Then** the system shows:
- **Value**: 62.5%
- **Label**: "Win Rate"
- **Status**: ✅ Good (green badge)
- **Context**: "25 wins / 40 trades"
- **Benchmark**: ">50% is positive expectancy"

#### Scenario: Expectancy Card Details
**Given** average win is 1.8R, average loss is 0.9R, win rate 62.5%  
**When** expectancy is calculated  
**Then** the system displays:
- **Value**: +0.45R
- **Calculation**: (1.8 × 0.625) - (0.9 × 0.375) = +0.45R
- **Status**: ✅ Positive (green)
- **Meaning**: "You make 0.45R per trade on average"
- **Interpretation**: "System has positive edge"

#### Scenario: Poor Performance Warning
**Given** profit factor is 0.85 (losses exceed wins)  
**When** profit factor card displays  
**Then** the system shows:
- **Value**: 0.85
- **Status**: ⚠️ Poor (red badge)
- **Warning**: "Profit factor < 1 means net losses"
- **Suggestion**: "Review trade selection and risk management"

---

### Requirement: Display Risk-Adjusted Performance
**Priority**: P1  
**Dependencies**: Backend Sharpe, Sortino, Calmar calculations

The system SHALL display performance relative to risk taken through standard financial ratios.

#### Scenario: View Risk-Adjusted Metrics Table
**Given** user has sufficient trading history  
**When** risk metrics section loads  
**Then** the system displays:
- **Sharpe Ratio**: 1.42 ✅ Good (>1)
- **Sortino Ratio**: 1.89 ✅ Excellent (>1.5)
- **Calmar Ratio**: 2.15 ✅ Excellent (>1)
- **Annual Return**: 28.5%
- **Annual Std Dev**: 18.2%

#### Scenario: Sharpe Ratio Interpretation
**Given** Sharpe ratio is 1.42  
**When** user hovers over metric  
**Then** tooltip displays:
- **Formula**: (Return - Risk-Free Rate) / Standard Deviation
- **Your Value**: 1.42
- **Interpretation**: "Good - Returns justify the risk"
- **Benchmark**: "<1 Poor, 1-2 Good, >2 Excellent"

#### Scenario: Sortino Ratio Details
**Given** Sortino ratio is 1.89  
**When** user clicks info icon  
**Then** the system explains:
- **What it measures**: "Risk-adjusted return considering only downside volatility"
- **Why it matters**: "Better than Sharpe for asymmetric strategies"
- **Your value**: 1.89 (Excellent)
- **Meaning**: "Strong returns with controlled downside risk"

---

### Requirement: Display Equity Curve
**Priority**: P1  
**Dependencies**: Backend equity tracking data

The system SHALL visualize account equity progression over time to show growth trajectory and drawdown periods.

#### Scenario: Render Equity Curve Chart
**Given** user has 3 months of trading history  
**When** equity curve displays  
**Then** the system renders:
- Line chart with time (x-axis) and equity (y-axis)
- Starting equity marked (e.g., 100M VND)
- Current equity marked (e.g., 108.5M VND)
- Drawdown periods shaded in red
- Peaks and troughs labeled
- Hover tooltip showing date and equity value

#### Scenario: Highlight Drawdown Periods
**Given** equity curve shows 2 drawdown periods  
**When** chart renders  
**Then** the system:
- Shades drawdown zones in light red
- Labels max drawdown: "-8.3% (Mar 15 - Apr 2)"
- Shows recovery period: "12 days to recover"
- Displays current drawdown: "-2.1%" (if in one)

#### Scenario: Benchmark Comparison
**Given** equity curve is displayed  
**When** user enables "Compare to VN-Index"  
**Then** the system:
- Overlays VN-Index performance as dashed line
- Shows relative performance: "+12.3% vs VN-Index"
- Uses different colors (blue for equity, gray for benchmark)
- Syncs time ranges

---

### Requirement: Display R-Multiple Distribution
**Priority**: P1  
**Dependencies**: Backend trade history with R-multiples

The system SHALL display distribution of trades by R-multiple to identify where profits and losses cluster.

#### Scenario: View R-Multiple Histogram
**Given** user has 40 completed trades  
**When** distribution chart renders  
**Then** the system displays:
- **Bar Chart** with R-multiple ranges on x-axis
- Ranges: <-2R, -2R to -1R, -1R to 0, 0-1R, 1R-2R, 2R-3R, >3R
- Bar height = number of trades in each range
- Color coding: Red (negative R), Yellow (0-1R), Green (1R+)
- Percentages shown: "32% of trades in 2R-3R range ⭐"

#### Scenario: Identify Best Performing Range
**Given** R-multiple distribution is displayed  
**When** system analyzes data  
**Then** the system highlights:
- Tallest green bar: "2R-3R range (32% of trades) ⭐ Best"
- Shows count: "13 trades in this range"
- Average of range: "~2.4R average"
- Insight: "Most profitable trades cluster here"

#### Scenario: Loss Distribution Analysis
**Given** 15 losing trades (37.5%)  
**When** negative R section displays  
**Then** the system shows:
- Red bars for -2R to 0R range
- Largest loss: "-1.8R (HPG trade, April 5)"
- Average loss: "-0.9R"
- Insight: "Losses are well-controlled (avg < -1R)"

---

### Requirement: Display Performance by Setup Type
**Priority**: P1  
**Dependencies**: Backend setup type tracking

The system SHALL display which setup types (Pullback, Breakout, etc.) perform best to focus on winners.

#### Scenario: View Setup Type Table
**Given** user has traded multiple setup types  
**When** distribution by setup displays  
**Then** the system shows table:

| Setup Type | Win Rate | Avg R | Total Trades | Total Profit |
|------------|----------|-------|--------------|--------------|
| Pullback | 68% ✅ | +1.2R | 45 | +54R |
| Breakout | 55% | +1.8R | 22 | +39.6R |
| Crossover | 45% ⚠️ | +0.3R | 18 | +5.4R |
| Mean Reversion | 40% ❌ | -0.2R | 8 | -1.6R |

#### Scenario: Identify Best Strategy
**Given** setup type table is displayed  
**When** system ranks by total profit  
**Then** the system:
- Highlights "Pullback" row in green
- Shows badge: "⭐ Best Strategy"
- Displays insight: "Pullback setups have highest win rate (68%) and solid R-multiple (+1.2R)"
- Suggests: "Focus more on Pullback opportunities"

#### Scenario: Identify Underperforming Strategy
**Given** "Mean Reversion" has negative expectancy  
**When** row displays  
**Then** the system:
- Highlights row in red
- Shows warning: "❌ Negative expectancy"
- Displays: "40% win rate, -0.2R average"
- Suggests: "Avoid Mean Reversion setups or refine entry criteria"

---

### Requirement: Display Performance by Market Regime
**Priority**: P1  
**Dependencies**: Backend regime tracking per trade

The system SHALL display how performance varies by market regime to enable trading with appropriate context.

#### Scenario: View Regime Performance Table
**Given** user has traded across different regimes  
**When** regime distribution displays  
**Then** the system shows:

| Regime | Win Rate | Avg R | Total Trades | Best Setup |
|--------|----------|-------|--------------|------------|
| Bull | 71% ✅ | +1.5R | 35 | Pullback |
| Range | 52% | +0.6R | 18 | Mean Reversion |
| Bear | 38% ❌ | -0.3R | 14 | (Avoid) |
| Transition | 45% | +0.2R | 8 | Breakout |

#### Scenario: Regime-Specific Insights
**Given** regime table is displayed  
**When** user clicks on "Bull" regime row  
**Then** the system shows details:
- **Win Rate**: 71% (25 wins / 35 trades)
- **Average R**: +1.5R
- **Best Setup**: Pullback (75% win rate in Bull)
- **Worst Setup**: Mean Reversion (50% win rate in Bull)
- **Recommendation**: "Focus on trend-following in Bull markets"

#### Scenario: Regime Warning
**Given** user's Bear regime performance is poor (38% WR, -0.3R)  
**When** regime table displays  
**Then** the system:
- Highlights "Bear" row in red
- Shows: "⚠️ Avoid trading in Bear regime"
- Displays: "Historical performance shows negative expectancy"
- Suggests: "Wait for regime change or develop Bear-specific strategy"

---

### Requirement: Display Drawdown Analysis
**Priority**: P1  
**Dependencies**: Backend drawdown tracking

The system SHALL display drawdown severity, duration, and recovery patterns.

#### Scenario: View Drawdown Panel
**Given** user has experienced drawdowns  
**When** drawdown analysis section loads  
**Then** the system displays:
- **Max Drawdown**: -8.3% (March 15 - April 2)
- **Max Duration**: 18 days
- **Recovery Factor**: 3.4x ✅ Excellent
- **Current Drawdown**: -2.1%
- **Consecutive Losses**: 2 trades (current)
- **Max Consecutive Losses**: 4 trades (February)

#### Scenario: Drawdown Timeline Chart
**Given** drawdown panel is displayed  
**When** timeline chart renders  
**Then** the system shows:
- Line chart with time on x-axis, drawdown % on y-axis
- 0% line as baseline (equity peaks)
- Drawdown periods as negative area below line
- Max drawdown point labeled: "-8.3% (Mar 28)"
- Recovery periods highlighted in green
- Current position marked

#### Scenario: Recovery Factor Calculation
**Given** max drawdown is -8.3% and total return is +28.5%  
**When** recovery factor displays  
**Then** the system shows:
- **Calculation**: 28.5% / 8.3% = 3.4x
- **Interpretation**: ✅ Excellent (>3x is strong)
- **Meaning**: "You recover drawdowns quickly relative to their size"

#### Scenario: Current Drawdown Alert
**Given** user is currently in -2.1% drawdown  
**When** panel displays  
**Then** the system:
- Shows current status: "In Drawdown: -2.1%"
- Days in drawdown: "5 days"
- Suggestions: "Review recent trades, avoid over-trading"
- Color: Yellow (caution, not critical)

---

### Requirement: Export Performance Data
**Priority**: P2  
**Dependencies**: None (client-side export)

The system SHALL enable users to export performance data for external analysis.

#### Scenario: Export to CSV
**Given** user wants to analyze data in Excel  
**When** user clicks "Export" → "CSV"  
**Then** the system:
- Generates CSV file with all performance metrics
- Includes: Date, Symbol, Entry, Exit, P&L, R-Multiple, Setup Type, Regime
- Downloads file: "gst-performance-2026-01-07.csv"
- Shows success message: "Exported 40 trades"

#### Scenario: Export Charts as Images
**Given** user wants to save equity curve  
**When** user clicks "Export" → "Image"  
**Then** the system:
- Generates PNG of equity curve chart
- High resolution (1200×600)
- Downloads file: "equity-curve-2026-01-07.png"
