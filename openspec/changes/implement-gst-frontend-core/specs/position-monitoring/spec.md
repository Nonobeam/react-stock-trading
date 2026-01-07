# Position Monitoring

## ADDED Requirements

### Requirement: Display Open Positions Dashboard
**Priority**: P0  
**Dependencies**: Backend active positions API, WebSocket price updates

The system SHALL display all active trades with real-time P&L, R-multiple, and time held to monitor performance objectively.

#### Scenario: View Open Positions Table
**Given** a user has 3 active positions  
**When** the monitoring dashboard loads  
**Then** the system displays a table with columns:
- **Symbol**: Stock ticker with entry date
- **Entry**: Entry price
- **Current**: Live current price
- **P&L**: Unrealized profit/loss (VND and %)
- **R-Multiple**: Current profit in R units
- **Stop**: Current stop level
- **Days Held**: Time in trade
- **Status**: 🟢 Profit / 🔴 Loss / 🟡 Breakeven
- **Actions**: "Adjust" | "Close" buttons

#### Scenario: Profitable Position Display
**Given** FPT position: Entry 85,000, Current 92,500, Stop 85,200  
**When** the row renders  
**Then** the system shows:
- **P&L**: +3,750,000 VND (+8.8%) in green
- **R-Multiple**: +2.1R in green
- **Status**: 🟢 Profit
- **Background**: Subtle green highlight

#### Scenario: Losing Position Display
**Given** HPG position: Entry 28,000, Current 26,500, Stop 27,200  
**When** the row renders  
**Then** the system shows:
- **P&L**: -600,000 VND (-5.4%) in red
- **R-Multiple**: -1.9R in red
- **Status**: 🔴 Loss
- **Warning**: "⚠️ Near stop level"

---

### Requirement: Real-Time P&L Updates
**Priority**: P0  
**Dependencies**: WebSocket price feed

The system SHALL update position P&L in real-time as prices change without manual refresh.

#### Scenario: Price Update via WebSocket
**Given** a position is open and WebSocket is connected  
**When** a price tick arrives for that symbol  
**Then** the system:
- Updates "Current" price column
- Recalculates P&L instantly
- Recalculates R-Multiple instantly
- Animates the change (flash green for up, red for down)
- Updates without full page re-render

#### Scenario: Multiple Positions Update Simultaneously
**Given** user has 5 open positions  
**When** market is active with frequent price updates  
**Then** the system:
- Updates each position independently
- Maintains smooth UI (no jank or lag)
- Batches updates if ticks arrive faster than 100ms
- Shows overall portfolio P&L summary

---

### Requirement: Stop Management Suggestions
**Priority**: P0  
**Dependencies**: Backend stop management engine

The system SHALL provide automated suggestions for adjusting stops (breakeven, trailing) based on profit levels.

#### Scenario: Breakeven Stop Suggestion
**Given** FPT position at +1.2R profit (reached T1)  
**When** stop management panel displays  
**Then** the system suggests:
- **Current Stop**: 81,400 VND (original)
- **Suggested**: 85,200 VND (breakeven + buffer)
- **Reason**: "Price hit T1 (+1R), move stop to breakeven"
- **New Risk**: 0 VND (risk-free trade)
- **Actions**: [Apply Adjustment] [Keep Current]

#### Scenario: ATR Trailing Stop Suggestion
**Given** position at +2.5R profit  
**When** trailing stop calculation runs  
**Then** the system displays:
- **Current Stop**: 85,200 (breakeven)
- **Suggested ATR Trail**: 88,400 (2× ATR below current price)
- **Reason**: "Price 2R+ above entry, trail to lock profits"
- **Locked Profit**: 3,400 VND per share
- **Trailing Method**: ATR (2.0x)
- **Actions**: [Apply Trail] [Choose Different Method]

#### Scenario: Multiple Trailing Methods
**Given** position is in profit and ready for trailing  
**When** user opens stop adjustment panel  
**Then** the system offers:
- ☐ ATR Trail (2.0x): 88,400 VND
- ☐ EMA Trail (21): 89,200 VND
- ☐ Percentage (5%): 87,875 VND
- ☐ Swing Low: 86,500 VND
- User selects one method
- System applies and logs the change

---

### Requirement: Stop History and Audit Trail
**Priority**: P1  
**Dependencies**: Backend position tracking

The system SHALL display a complete history of stop adjustments to understand trade management decisions.

#### Scenario: View Stop History
**Given** a position has had 3 stop adjustments  
**When** user clicks "History" on position  
**Then** the system displays timeline:
1. **Jan 5, 10:00**: Initial stop 81,400 VND (Entry)
2. **Jan 7, 14:30**: Moved to 85,200 VND (Breakeven after T1 hit)
3. **Jan 9, 11:15**: Trailed to 88,400 VND (ATR trail, +2.5R)
4. **Current**: 88,400 VND (Trailing)

#### Scenario: Stop Adjustment Reasoning
**Given** stop history is displayed  
**When** user hovers over an adjustment  
**Then** the system shows tooltip:
- **Date/Time**: Jan 7, 14:30
- **From**: 81,400 → **To**: 85,200
- **Reason**: "Breakeven after T1 hit"
- **Method**: Manual adjustment
- **User**: Auto (system suggestion applied)

---

### Requirement: Time-Based Stagnation Alerts
**Priority**: P1  
**Dependencies**: Backend time tracking

The system SHALL alert users when positions show minimal progress over extended periods to avoid opportunity cost.

#### Scenario: Stagnation Warning
**Given** HPG position held for 15 days with only +0.3R progress  
**When** monitoring dashboard checks stagnation  
**Then** the system displays:
- **Alert**: "⚠️ STAGNATION WARNING: HPG (15 days)"
- **Progress**: "Current R: +0.3R over 15 days"
- **Suggested Actions**:
  - "Tighten stop to reduce opportunity cost"
  - "Set time deadline for exit (e.g., 5 more days)"
  - "Consider partial close to free capital"
- **Buttons**: [Tighten Stop] [Set Deadline] [Close 50%]

#### Scenario: Set Time Deadline
**Given** user receives stagnation warning  
**When** user clicks "Set Deadline"  
**Then** the system:
- Opens modal: "Exit by: [Date Picker]"
- Suggests: "Exit in 5 days if no progress to 1R"
- Sets reminder/alert for deadline
- Adds deadline to position card

---

### Requirement: Emergency Indicators
**Priority**: P0 (CRITICAL)  
**Dependencies**: Real-time price comparison

The system SHALL immediately notify users when critical price levels (stop, target) are hit.

#### Scenario: Stop Hit Alert
**Given** position stop is 81,400 and price falls to 81,350  
**When** stop is triggered  
**Then** the system:
- Flashes position row red (urgent)
- Shows modal: "🚨 STOP HIT: FPT at 81,350"
- Displays: "Stop was 81,400, close position immediately"
- Plays alert sound (if enabled)
- Shows "Close Position" button (high priority)
- Logs event in trade history

#### Scenario: Target Hit Alert
**Given** T1 target is 89,000 and price reaches 89,100  
**When** target is hit  
**Then** the system:
- Flashes position row green (success)
- Shows notification: "🎯 TARGET HIT: FPT T1 at 89,100"
- Displays: "T1 (89,000) reached, consider taking partial profit"
- Shows "Close 25%" button (scaling strategy)
- Reminds: "Move stop to breakeven per plan"

#### Scenario: Gap Risk Alert (After Hours)
**Given** position is open and market is closed  
**When** significant news breaks for that stock  
**Then** the system:
- Shows: "⚠️ GAP RISK ALERT: FPT news after hours"
- Displays news headline
- Warns: "Monitor opening price for gap"
- Suggests: "Review stop placement before market opens"

---

### Requirement: Position Adjustment Controls
**Priority**: P0  
**Dependencies**: Backend position update API

The system SHALL enable users to adjust stop levels, close positions partially or fully through the UI.

#### Scenario: Adjust Stop Level
**Given** a user wants to tighten stop on VNM  
**When** user clicks "Adjust" button  
**Then** the system opens modal:
- **Current Stop**: 82,000 VND
- **New Stop**: [Input field] VND
- **Methods**: [ATR] [EMA] [Percentage] [Manual]
- **Preview**: "New risk: X VND per share"
- **Validation**: Ensures new stop < current price
- **Actions**: [Save] [Cancel]

#### Scenario: Close Position Partially
**Given** user wants to take partial profit on FPT (500 shares)  
**When** user clicks "Close" → "Partial"  
**Then** the system shows:
- **Current Size**: 500 shares
- **Close Amount**: [Input] shares or [25%] [50%] [75%] buttons
- **Remaining**: Calculated automatically
- **P&L on Closed**: Shows profit on partial close
- **Confirm**: "Close 125 shares (25%) at 92,500?"
- **Actions**: [Confirm] [Cancel]

#### Scenario: Close Position Fully
**Given** user wants to exit HPG completely  
**When** user clicks "Close" → "Full"  
**Then** the system displays:
- **Confirm Modal**: "Close full HPG position?"
- **Details**:
  - Size: 300 shares
  - Entry: 28,000
  - Current: 26,500
  - **Total P&L**: -450,000 VND (-5.4%)
  - **R-Multiple**: -1.9R
- **Warning**: "This will lock in a loss"
- **Actions**: [Confirm Close] [Cancel]

---

### Requirement: Portfolio Summary
**Priority**: P1  
**Dependencies**: Aggregated position data

The system SHALL display overall portfolio metrics to enable understanding of total exposure and risk.

#### Scenario: View Portfolio Summary Cards
**Given** user has multiple open positions  
**When** summary section displays  
**Then** the system shows cards:
- **Total Positions**: 5
- **Total Capital at Risk**: 4,200,000 VND (4.2%)
- **Total Unrealized P&L**: +1,850,000 VND (+1.85%)
- **Average R-Multiple**: +0.8R
- **Best Performer**: FPT (+2.1R) 🟢
- **Worst Performer**: HPG (-1.9R) 🔴

#### Scenario: Portfolio Risk Warning
**Given** total risk across all positions exceeds 8%  
**When** summary calculates  
**Then** the system:
- Highlights "Total Capital at Risk" in red
- Shows: "⚠️ Portfolio risk 8.5% exceeds recommended 8% maximum"
- Suggests: "Consider reducing position sizes or closing weak trades"
- Disables new trade entries until risk is reduced

---

### Requirement: Empty State Handling
**Priority**: P1  
**Dependencies**: None

The system SHALL display helpful messages when no positions are open.

#### Scenario: No Open Positions
**Given** user has closed all positions  
**When** monitoring dashboard loads  
**Then** the system displays:
- Icon: 📊 (chart)
- Message: "No open positions"
- Explanation: "You have no active trades right now."
- Action: "Scan for Setups →" button linking to scanner
- Recent closed trades: Shows last 3 closed positions
