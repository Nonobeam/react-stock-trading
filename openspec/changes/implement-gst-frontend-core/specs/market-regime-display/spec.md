# Market Regime Display

## ADDED Requirements

### Requirement: Display Current Market Regime
**Priority**: P0  
**Dependencies**: Backend regime detection API

The system SHALL display the current market regime (Bull/Bear/Range/Transition) with a clear visual badge and score to understand the trading context.

#### Scenario: View Market Regime Badge
**Given** the backend reports regime as "BULL" with score 9/12  
**When** the user views the regime dashboard  
**Then** the system displays:
- Large badge with "🟢 BULL MARKET" label
- Regime score "9/12" prominently
- Color coding: Green (Bull), Red (Bear), Yellow (Range), Blue (Transition)
- Descriptive subtitle (e.g., "Strong uptrend")

#### Scenario: Regime Changes to Range
**Given** the user is viewing "BULL" regime  
**When** the backend regime updates to "RANGE" with score 5/12  
**Then** the system:
- Updates badge to "🟡 RANGE MARKET"
- Changes color scheme to yellow
- Updates score to "5/12"
- Shows notification: "Market regime changed to Range"

---

### Requirement: Show Regime Score Breakdown
**Priority**: P0  
**Dependencies**: Backend regime scoring factors

The system SHALL display individual factor contributions (ADX, directional movement, volatility, volume) to explain how the regime score is calculated.

#### Scenario: View Factor Breakdown
**Given** the regime score is 9/12  
**When** the user views the regime detail panel  
**Then** the system displays:
- **ADX Score**: "32 → +2 points" with bar indicator (Trending)
- **Directional Movement**: "+DI > -DI → +2 points" with bar indicator (Bullish)
- **Volatility**: "ATR 4.2% → +1 point" with bar indicator (Normal)
- **Volume**: "Above average → +2 points" with bar indicator (Confirming)
- **Extra Context**: "+2 points" from additional factors
- **Total**: "9/12" with sum visualization

#### Scenario: Hover on Factor for Details
**Given** the regime breakdown is displayed  
**When** the user hovers over "ADX Score"  
**Then** the system shows tooltip:
- "ADX measures trend strength"
- "Current: 32 (Trending)"
- "Scoring: <20 (0pts), 20-25 (1pt), 25-30 (2pts), >30 (3pts)"
- "Your score: 2pts"

---

### Requirement: Display VN-Index Status
**Priority**: P0  
**Dependencies**: Backend VN-Index data

The system SHALL display the overall market health via VN-Index value, trend direction, and relationship to key moving averages.

#### Scenario: Show VN-Index Health
**Given** VN-Index is at 1,250.5 (+1.2%), above MA50  
**When** the regime dashboard loads  
**Then** the system displays:
- **VN-Index Value**: "1,250.5"
- **Change**: "+1.2%" in green with up arrow
- **MA50 Status**: "Above MA50 ✅" in green
- **Trend**: "Bullish" with upward trend icon

#### Scenario: VN-Index Below MA50
**Given** VN-Index is at 1,180.3 (-0.8%), below MA50  
**When** the dashboard renders  
**Then** the system shows:
- **VN-Index Value**: "1,180.3"
- **Change**: "-0.8%" in red with down arrow
- **MA50 Status**: "Below MA50 ⚠️" in orange
- **Trend**: "Bearish" with downward trend icon

---

### Requirement: Show Trend Strength Meter
**Priority**: P1  
**Dependencies**: Backend ADX/trend data

The system SHALL visualize trend strength on a continuous scale to quickly gauge market momentum.

#### Scenario: Display Trend Strength
**Given** ADX is 32 (trending)  
**When** the trend strength meter renders  
**Then** the system displays:
- Horizontal slider from "Weak" (left) to "Strong" (right)
- Indicator positioned at ~65% (ADX 32)
- Color gradient: Gray → Yellow → Green
- Label: "Trending (32)"

#### Scenario: Weak Trend (No Trend)
**Given** ADX is 15 (no clear trend)  
**When** the meter renders  
**Then** the system shows:
- Indicator at ~25% position
- Gray zone highlighted
- Label: "No Trend (15)"
- Warning: "⚠️ Avoid trend-following strategies"

---

### Requirement: Provide Strategy Recommendations
**Priority**: P0  
**Dependencies**: Backend regime-based recommendations

The system SHALL provide actionable trading strategy suggestions based on the current regime.

#### Scenario: Bull Market Recommendation
**Given** regime is "BULL" with score 10/12  
**When** the regime dashboard displays  
**Then** the system shows:
- **Strategy**: "Favor trend-following setups"
- **Specific Advice**: "Buy pullbacks to EMA20/50 in strong stocks"
- **Position Size**: "100% normal size"
- **Avoid**: "Counter-trend shorts, mean reversion in weak stocks"

#### Scenario: Range Market Recommendation
**Given** regime is "RANGE" with score 6/12  
**When** recommendations display  
**Then** the system shows:
- **Strategy**: "Favor mean reversion and support/resistance trading"
- **Specific Advice**: "Buy at support, sell at resistance, tight stops"
- **Position Size**: "70% normal size (reduce exposure)"
- **Avoid**: "Breakout trades, trend-following in choppy conditions"

#### Scenario: Transition Regime Warning
**Given** regime is "TRANSITION" with score 7/12  
**When** recommendations display  
**Then** the system shows:
- **Strategy**: "Reduce activity, wait for clarity"
- **Specific Advice**: "Tighten stops on existing positions, avoid new entries"
- **Position Size**: "50% normal size (high uncertainty)"
- **Avoid**: "Large positions, over-trading"

---

### Requirement: Show Position Multiplier
**Priority**: P1  
**Dependencies**: Backend regime-based sizing

The system SHALL display recommended position size adjustments based on market regime to adapt risk.

#### Scenario: Bull Market Sizing
**Given** regime is "BULL" with high confidence  
**When** position multiplier displays  
**Then** the system shows:
- **Multiplier**: "1.0x (100%)"
- **Meaning**: "Trade at full normal position size"
- **Color**: Green indicator

#### Scenario: Reduced Sizing in Range
**Given** regime is "RANGE" or "TRANSITION"  
**When** position multiplier displays  
**Then** the system shows:
- **Multiplier**: "0.7x (70%)" for Range or "0.5x (50%)" for Transition
- **Meaning**: "Reduce position size due to uncertainty"
- **Color**: Yellow/Orange indicator
- **Rationale**: "Lower conviction environment"

---

### Requirement: Real-Time Regime Updates
**Priority**: P1  
**Dependencies**: WebSocket regime updates

The system SHALL update the regime display automatically when regime changes without requiring page refresh.

#### Scenario: Receive Regime Update via WebSocket
**Given** a user is viewing "BULL" regime  
**When** a WebSocket message indicates regime changed to "RANGE"  
**Then** the system:
- Updates badge to "🟡 RANGE MARKET"
- Re-calculates and displays new score
- Updates factor breakdown
- Shows toast notification: "⚠️ Market regime changed to Range"
- Highlights the change with animation

#### Scenario: Minor Score Update
**Given** regime is "BULL" with score 9/12  
**When** regime score updates to 10/12 (same regime)  
**Then** the system:
- Updates score display to "10/12"
- Maintains "BULL" badge (no regime change)
- Updates factor breakdown if factors changed
- Does NOT show disruptive notification (minor update)

---

### Requirement: Multi-Timeframe Alignment (Future)
**Priority**: P2  
**Dependencies**: Backend multi-timeframe analysis

The system SHALL display trend alignment across multiple timeframes (Weekly, Daily, 4H) for confluence confirmation.

#### Scenario: View Timeframe Alignment Table
**Given** the user opens multi-timeframe view  
**When** alignment data is available  
**Then** the system displays a table:
- **Weekly**: "↑ Bullish | Higher Highs | ✅"
- **Daily**: "↑ Bullish | Pullback | ✅"
- **4H**: "→ Neutral | Consolidating | ⚠️"
- **Overall Alignment**: "2/3 Aligned (Good)"

**Note**: This requirement is deferred to future implementation after core functionality is stable.
