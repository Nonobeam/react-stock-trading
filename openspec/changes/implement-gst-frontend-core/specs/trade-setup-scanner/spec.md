# Trade Setup Scanner

## ADDED Requirements

### Requirement: Display Scanned Trade Setups
**Priority**: P0  
**Dependencies**: Backend setup scanner API

The system SHALL display a list of trade opportunities with quality scores, setup types, and key metrics to quickly identify high-probability trades.

#### Scenario: View Setup Scanner Table
**Given** the backend returns 15 trade setups  
**When** the scanner page loads  
**Then** the system displays a table with columns:
- **Symbol**: Stock ticker with sector badge
- **Setup Type**: Pullback / Breakout / Crossover / Mean Reversion
- **Score**: 0-13 with color coding (Red <7, Yellow 7-8, Green 9-10, Dark Green 11+)
- **Trend**: Weekly/Daily alignment (✅/⚠️/❌)
- **Volume**: Confirmation status (✅ Confirmed / ⚠️ Weak / ❌ No)
- **R:R**: Risk/Reward ratio
- **Entry**: Suggested entry price
- **Action**: "View Details" button

#### Scenario: Color-Coded Score Display
**Given** a setup has score 11/13  
**When** the row renders  
**Then** the system:
- Displays "11" in bold dark green
- Shows "/13" in lighter text
- Adds "✅ Excellent" badge
- Highlights row with subtle green background

#### Scenario: Low Score Setup
**Given** a setup has score 5/13  
**When** the row renders  
**Then** the system:
- Displays "5" in red
- Shows "/13" in gray
- Adds "❌ Poor" badge
- Dims the row (lower opacity)

---

### Requirement: Filter and Sort Setups
**Priority**: P0  
**Dependencies**: None (client-side filtering)

The system SHALL enable filtering and sorting of setups to focus on specific criteria and find the best opportunities quickly.

#### Scenario: Filter by Minimum Score
**Given** the scanner shows 15 setups  
**When** the user sets "Min Score: 9"  
**Then** the system:
- Filters table to show only setups with score ≥9
- Updates count: "Showing 6 of 15 setups"
- Maintains current sort order

#### Scenario: Filter by Setup Type
**Given** the scanner shows mixed setup types  
**When** the user selects "Pullback" filter  
**Then** the system:
- Shows only Pullback setups
- Updates count accordingly
- Allows combining with other filters

#### Scenario: Filter by Sector
**Given** setups span multiple sectors  
**When** the user selects "Technology" sector filter  
**Then** the system:
- Shows only Technology stocks
- Displays sector badge on each row
- Allows multi-sector selection

#### Scenario: Sort by Score Descending
**Given** setups are displayed  
**When** the user clicks "Score" column header  
**Then** the system:
- Sorts table by score (highest first)
- Shows sort indicator (↓) on column
- Toggles to ascending on second click

#### Scenario: Sort by R:R Ratio
**Given** the user wants to find best risk/reward  
**When** the user clicks "R:R" column header  
**Then** the system:
- Sorts by R:R ratio (highest first)
- Highlights the column
- Updates sort indicator

---

### Requirement: Display Trade Scorecard
**Priority**: P0  
**Dependencies**: Backend scoring breakdown

The system SHALL display a detailed breakdown of the 13-point scoring system to explain why a setup received its score.

#### Scenario: View Full Scorecard
**Given** a user clicks "View Details" on FPT setup (score 10/13)  
**When** the scorecard modal opens  
**Then** the system displays:
- **Header**: "TRADE SCORECARD: FPT | Total: 10/13 ✅"
- **Trend Alignment**: "3/3 points | Perfect alignment" with progress bar
- **Setup Quality**: "2/3 points | Valid pullback" with progress bar
- **Momentum**: "2/2 points | MACD bullish" with progress bar
- **Risk/Reward**: "1/2 points | 1.8:1 ratio" with progress bar
- **Market Context**: "2/3 points | VN-Index bullish" with progress bar

#### Scenario: Scorecard Strengths and Weaknesses
**Given** the scorecard is displayed  
**When** strengths/weaknesses section renders  
**Then** the system shows:
- **💪 Strengths** (green section):
  - "Perfect weekly/daily trend alignment"
  - "Strong MACD momentum"
  - "Supportive market context"
- **⚠️ Watch** (yellow section):
  - "Risk/Reward could be better"
  - "Consider tighter stop for improved R:R"

#### Scenario: Scorecard Recommendation
**Given** score is 10/13  
**When** recommendation section displays  
**Then** the system shows:
- **Action**: "BUY"
- **Quality Label**: "Good"
- **Suggested Risk**: "1.5% of capital"
- **Rationale**: "High-quality setup with good trend alignment"

---

### Requirement: Show Setup Detail Drawer
**Priority**: P0  
**Dependencies**: Backend setup details API

The system SHALL provide detailed information about a setup including chart visualization, narrative explanation, and rule checklist.

#### Scenario: Open Setup Detail Drawer
**Given** a user clicks on a setup row  
**When** the drawer slides in from the right  
**Then** the system displays:
- Mini candlestick chart with entry/stop/targets marked
- Setup narrative text
- Rule checklist with ✅/❌ indicators
- Entry trigger list
- Quick action button "Plan Trade →"

#### Scenario: Setup Narrative Display
**Given** setup detail drawer is open for VNM Pullback  
**When** narrative section renders  
**Then** the system shows:
- **Title**: "Pullback Setup on VNM"
- **Description**: "Stock pulled back to EMA20 after strong uptrend. Volume dried up during pullback, showing no selling pressure. Price now bouncing from support with bullish MACD crossover."
- **Context**: "Daily chart in uptrend, weekly chart confirming"

#### Scenario: Rule Checklist Display
**Given** setup is a Pullback with score 9/13  
**When** checklist section renders  
**Then** the system shows:
- ✅ "Price above EMA50 (uptrend confirmed)"
- ✅ "Pullback to EMA20 (entry zone)"
- ✅ "Volume contraction during pullback"
- ✅ "MACD bullish crossover"
- ❌ "RSI not yet oversold (45)"
- ✅ "ADX > 25 (trending market)"

#### Scenario: Entry Triggers Confirmation
**Given** setup has multiple triggers  
**When** triggers section displays  
**Then** the system shows:
- **Confirmed Triggers** (green):
  - "Price bounce from EMA20"
  - "MACD bullish crossover"
  - "Volume increase on reversal"
- **Pending Triggers** (gray):
  - "None - Setup is ready"

#### Scenario: Quick Action to Risk Calculator
**Given** user reviews setup details  
**When** user clicks "Plan Trade" button  
**Then** the system:
- Opens Risk Calculator
- Pre-fills symbol (VNM)
- Pre-fills entry price from setup
- Pre-fills stop price from setup
- Focuses on position size input

---

### Requirement: Setup Quality Labels
**Priority**: P1  
**Dependencies**: Score ranges

The system SHALL display visual labels and color coding to quickly convey setup quality.

#### Scenario: Excellent Setup Label
**Given** a setup has score 11-13  
**When** the label renders  
**Then** the system displays:
- Badge: "✅ Excellent"
- Color: Dark Green (#059669)
- Tooltip: "Strong buy - Maximum position size"

#### Scenario: Good Setup Label
**Given** a setup has score 9-10  
**When** the label renders  
**Then** the system displays:
- Badge: "✅ Good"
- Color: Green (#10B981)
- Tooltip: "Buy - Normal position size"

#### Scenario: Acceptable Setup Label
**Given** a setup has score 7-8  
**When** the label renders  
**Then** the system displays:
- Badge: "⚠️ Acceptable"
- Color: Yellow (#F59E0B)
- Tooltip: "Cautious - Reduced position size"

#### Scenario: Poor Setup Label
**Given** a setup has score 0-6  
**When** the label renders  
**Then** the system displays:
- Badge: "❌ Poor"
- Color: Red (#EF4444)
- Tooltip: "Don't trade - Score too low"

---

### Requirement: Real-Time Setup Updates
**Priority**: P1  
**Dependencies**: WebSocket or polling

The system SHALL update the scanner when new setups emerge or existing setups change quality.

#### Scenario: New Setup Appears
**Given** the scanner is displaying 10 setups  
**When** a new high-score setup emerges (backend push)  
**Then** the system:
- Adds new row at the top (if sorted by score)
- Highlights row with animation (fade-in with green glow)
- Shows toast notification: "🎯 New setup: MWG (Score 11)"
- Plays subtle sound (if enabled)

#### Scenario: Setup Score Degrades
**Given** a setup was score 10, now drops to 6  
**When** update is received  
**Then** the system:
- Updates score display
- Changes badge from "Good" to "Poor"
- Changes row color from green to red
- Optionally shows warning: "⚠️ VCB setup quality degraded"

#### Scenario: Setup No Longer Valid
**Given** a setup is in the table  
**When** it no longer meets minimum criteria (backend removes it)  
**Then** the system:
- Removes row with fade-out animation
- Updates count: "Showing 9 of 14 setups"
- Does NOT show disruptive notification

---

### Requirement: Empty State Handling
**Priority**: P1  
**Dependencies**: None

The system SHALL display helpful messages when no setups meet criteria.

#### Scenario: No Setups Found
**Given** scanner returns zero results  
**When** the page loads  
**Then** the system displays:
- Icon: 🔍 (magnifying glass)
- Message: "No trade setups found"
- Explanation: "No stocks meet the minimum quality criteria (score ≥7) right now."
- Suggestion: "Try lowering filters or check back later."

#### Scenario: All Setups Filtered Out
**Given** user applied filters that exclude all results  
**When** table is empty  
**Then** the system shows:
- Message: "No setups match your filters"
- Active filters list
- Button: "Clear Filters"
- Suggestion: "Try adjusting score or sector filters"
