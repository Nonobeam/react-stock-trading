# Risk & Position Calculator

## ADDED Requirements

### Requirement: Calculate Position Size
**Priority**: P0 (CRITICAL)  
**Dependencies**: Backend risk calculation API, Vietnam market rules

The system SHALL calculate appropriate position sizes based on account capital, risk percentage, entry price, and stop price to ensure survivable losses.

#### Scenario: Basic Position Size Calculation
**Given** a user inputs:
- Capital: 100,000,000 VND
- Risk %: 2%
- Entry Price: 85,000 VND
- Stop Price: 81,000 VND (4.7% below entry)
**When** the calculation runs  
**Then** the system displays:
- **Position Size**: 488 shares (adjusted to lot size 100)
- **Position Value**: 41,480,000 VND (48.8% of capital)
- **Risk Amount**: 1,952,000 VND (2% of capital)
- **Actual Risk %**: 1.95% (adjusted after lot sizing)

#### Scenario: Lot Size Adjustment
**Given** calculation yields 487.3 shares  
**When** lot size is 100 shares (Vietnam requirement)  
**Then** the system:
- Rounds down to 400 shares (4 lots)
- Shows original: "487 shares (calculated)"
- Shows adjusted: "400 shares (4 lots)"
- Recalculates actual risk: 1.6% instead of 2%
- Displays difference: "⚠️ Adjusted for lot size"

#### Scenario: Insufficient Capital
**Given** a user has 10,000,000 VND capital  
**When** position sizing requires 50,000,000 VND  
**Then** the system:
- Shows error: "❌ Insufficient capital"
- Displays: "Position requires 50M VND, you have 10M VND"
- Suggests: "Reduce position or find cheaper stock"
- Disables "Proceed to Trade" button

---

### Requirement: Stop Loss Planning
**Priority**: P0 (CRITICAL)  
**Dependencies**: Backend stop calculation methods, Vietnam price limits

The system SHALL calculate and validate stop loss levels using multiple methods (ATR, swing, percentage) while respecting Vietnam's ±7% daily limits.

#### Scenario: ATR-Based Stop Calculation
**Given** a user selects "ATR Stop" method  
**When** entry is 85,000 VND and ATR is 3,400 VND  
**Then** the system calculates:
- **Stop Price**: 85,000 - (2 × 3,400) = 78,200 VND
- **Distance**: 6,800 VND (8% below entry)
- **Warning**: "⚠️ Stop exceeds -7% Vietnam daily limit (79,050 VND)"
- **Suggestion**: "Consider tighter stop or enter at lower price"

#### Scenario: Swing Low Stop
**Given** user selects "Swing Low" method  
**When** recent swing low is 80,500 VND (entry at 85,000)  
**Then** the system displays:
- **Stop Price**: 80,500 VND (just below swing)
- **Distance**: 4,500 VND (5.3% below entry)
- **Status**: "✅ Within Vietnam daily limit"
- **Chart**: Visualizes entry and stop on mini chart

#### Scenario: Percentage Stop
**Given** user selects "Percentage" method and inputs 3%  
**When** entry is 85,000 VND  
**Then** the system calculates:
- **Stop Price**: 82,450 VND (3% below entry)
- **Distance**: 2,550 VND
- **Status**: "✅ Within limits"
- **Risk Assessment**: "Tight stop - good for low volatility"

#### Scenario: Vietnam Limit Validation
**Given** any stop calculation method  
**When** stop is calculated  
**Then** the system:
- Checks if stop < entry × 0.93 (7% limit for HOSE)
- Shows visual indicator of limit: "Daily Limit Floor: 79,050"
- Colors stop red if exceeds limit
- Blocks trade entry if stop is invalid

---

### Requirement: Target Planning with Consensus
**Priority**: P0  
**Dependencies**: Backend target calculation methods

The system SHALL identify profit targets using multiple methods and find consensus zones where methods agree.

#### Scenario: Calculate Multiple Targets
**Given** entry at 85,000 VND, stop at 81,400 VND (risk = 3,600 VND)  
**When** target calculator runs  
**Then** the system displays a table:

| Method | Target Price | R-Multiple | Notes |
|--------|--------------|------------|-------|
| 2R-Multiple | 92,200 | 2.0R | 2× risk distance |
| Technical Resistance | 91,500 | 1.8R | Key level from chart |
| Fibonacci 1.618 | 93,800 | 2.4R | Extension target |
| ATR Extension | 92,000 | 2.0R | Volatility-based |
| **CONSENSUS** | **91,500-92,200** | **~2R** | ⭐ **HIGH** (3 agree) |

#### Scenario: Consensus Target Highlighted
**Given** multiple target methods calculated  
**When** 3 or more methods agree within 2% range  
**Then** the system:
- Highlights consensus zone in green
- Shows confidence: "⭐ HIGH (3 methods agree)"
- Recommends: "Target: 91,500-92,200 VND"
- Displays on chart with shaded zone

#### Scenario: No Clear Consensus
**Given** target methods spread widely  
**When** no 3 methods agree within 5% range  
**Then** the system:
- Shows: "⚠️ No clear consensus"
- Lists all targets individually
- Suggests: "Consider conservative 1.5R target or trail stops"

---

### Requirement: Risk:Reward Ratio Validation
**Priority**: P0 (CRITICAL)  
**Dependencies**: None (derived from entry/stop/target)

The system SHALL display risk:reward ratios and provide warnings if R:R is unfavorable.

#### Scenario: Favorable R:R Display
**Given** entry 85,000, stop 81,400, target 92,200  
**When** R:R is calculated  
**Then** the system displays:
- **Risk**: 3,600 VND
- **Reward**: 7,200 VND
- **R:R Ratio**: 1:2.0 ✅
- **Label**: "Good Risk/Reward"
- **Color**: Green

#### Scenario: Unfavorable R:R Warning
**Given** entry 85,000, stop 81,400, target 87,500  
**When** R:R is 1:0.7  
**Then** the system:
- Displays: **R:R Ratio**: 1:0.7 ⚠️
- Shows warning: "⚠️ Poor risk/reward - Not recommended"
- Colors ratio orange/red
- Suggests: "Find better entry or tighter stop"
- Disables "Proceed" unless user confirms override

#### Scenario: Minimum R:R Threshold
**Given** system minimum R:R is 1:1.5  
**When** calculated R:R is below threshold  
**Then** the system:
- Shows error: "❌ R:R below 1:1.5 minimum"
- Blocks trade entry
- Requires user to adjust entry/stop/target

---

### Requirement: Scaling Strategy Configuration
**Priority**: P1  
**Dependencies**: None (client-side logic)

The system SHALL enable planning of partial exits at multiple target levels to lock in profits progressively.

#### Scenario: Define Target Distribution
**Given** user wants to scale out of 400 shares  
**When** scaling configuration opens  
**Then** the system displays inputs:
- **T1 (25%)**: 89,000 VND [1R] → Sell 100 shares
- **T2 (25%)**: 91,500 VND [1.8R] → Sell 100 shares (Move stop to breakeven)
- **T3 (25%)**: 92,200 VND [2R] → Sell 100 shares
- **T4 (25%)**: Trail [3R+] → Trail remaining 100 shares

#### Scenario: Breakeven Stop Rule
**Given** user configures scaling strategy  
**When** T2 is set at 91,500 (1.8R)  
**Then** the system:
- Adds instruction: "Move stop to breakeven when T2 hit"
- Calculates breakeven: 85,000 VND (entry price)
- Shows: "After T2, risk = 0 (locked profit)"

#### Scenario: Trailing Stop for Final Position
**Given** 75% of position closed at T1-T3  
**When** T4 is configured as "Trail"  
**Then** the system:
- Suggests trailing method: "ATR Trail (2x)" or "EMA Trail (21)"
- Shows potential: "Let winners run to 3R+"
- Displays visual: "100 shares remaining with trailing stop"

---

### Requirement: Pre-Trade Viability Checklist
**Priority**: P0 (CRITICAL)  
**Dependencies**: All risk calculation components

The system SHALL display a comprehensive checklist validating all trade parameters before entry.

#### Scenario: All Checks Pass
**Given** a fully configured trade plan  
**When** viability checklist runs  
**Then** the system displays:
- ✅ "Stop within -7% Vietnam limit"
- ✅ "Position < 40% of capital (35%)"
- ✅ "Risk < 2% of capital (1.8%)"
- ✅ "R:R >= 1:1.5 (1:2.0)"
- ✅ "Lot size adjusted (400 shares)"
- ✅ "Sufficient buying power"
- **Result**: "🟢 TRADE VIABLE - Ready to Execute"

#### Scenario: Risk Checks Fail
**Given** position risk exceeds 2% or R:R is poor  
**When** checklist runs  
**Then** the system shows:
- ✅ "Stop within limit"
- ❌ "Risk 3.5% exceeds 2% maximum"
- ✅ "R:R is 1:1.8"
- **Result**: "🔴 TRADE NOT VIABLE - Adjust parameters"
- Disables "Proceed to Trade" button

#### Scenario: Correlation Warning
**Given** user already has VNM position (correlation 0.65 with new stock)  
**When** checklist runs  
**Then** the system adds:
- ⚠️ "Correlation: 0.65 with VNM (in portfolio)"
- Suggestion: "Position reduced by 20% due to correlation"
- Adjusted position: 400 → 320 shares
- Explanation: "Avoid overexposure to correlated stocks"

---

### Requirement: Risk Summary Panel
**Priority**: P0  
**Dependencies**: All calculation components

The system SHALL display a clear, comprehensive summary of all risk metrics before making trade decisions.

#### Scenario: Display Risk Summary
**Given** all trade parameters are configured  
**When** summary panel renders  
**Then** the system displays:
- **Symbol**: FPT
- **Entry Price**: 85,000 VND
- **Stop Price**: 81,400 VND (4.2% distance)
- **Target (consensus)**: 92,000 VND (8.2% upside)
- **Risk Amount**: 1,800,000 VND (1.8% of capital)
- **Risk:Reward**: 1:2.0 ✅
- **Position Size**: 500 shares (5 lots)
- **Position Value**: 42,500,000 VND (35% of capital)
- **Trade Viability**: ✅ VIABLE - All checks pass

#### Scenario: Summary with Warnings
**Given** trade has warnings but is still viable  
**When** summary displays  
**Then** the system shows warnings section:
- **Warnings**:
  - ⚠️ "Stop distance 5.3% approaching 7% limit"
  - ⚠️ "Position value 38% approaching 40% limit"
- **Status**: 🟡 CAUTION - Trade viable but watch limits
