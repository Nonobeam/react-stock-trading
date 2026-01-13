# Spec Delta: Dashboard View

## ADDED Requirements

### Requirement: Dashboard Overview Display
The dashboard SHALL provide a consolidated view of the trader's current trading status including market conditions, portfolio summary, active signals, AI insights, and open positions.

#### Scenario: User opens dashboard during market hours
GIVEN market is open
AND user has 4 open positions
AND there are 3 active buy signals
WHEN user navigates to dashboard
THEN dashboard displays:
- Market status header with VN-Index, regime, and score
- Portfolio summary card showing capital and P&L
- Risk gauge showing 4.2% of 6% max risk
- 3 signal cards sorted by priority
- AI insights panel with 3-5 insight cards
- Open positions table with all 4 positions

#### Scenario: Dashboard updates in real-time
GIVEN dashboard is open
AND market is open
WHEN 30 seconds elapse
THEN system updates:
- All position current prices
- Portfolio P&L values
- Signal card prices
- VN-Index value
AND price changes show flash animation (green for up, red for down)

### Requirement: Portfolio Summary Card
The portfolio summary card SHALL display total capital, today's P&L, total P&L, open position count, and current risk percentage with visual risk gauge.

#### Scenario: User views portfolio summary with profit
GIVEN user has total capital of 100,000,000 VND
AND today's P&L is +240,000 VND (+0.24%)
AND total P&L is +8,200,000 VND (+8.2%)
AND user has 4 open positions
AND aggregate risk is 4.2%
WHEN user views portfolio summary card
THEN card displays:
- Total Capital: "100,000,000₫" (large, bold)
- P&L Today: "+240,000₫ (+0.24%)" in green with up arrow
- Total P&L: "+8,200,000₫ (+8.2%)" in green
- Open Pos: "4" with icon
- Risk: "4.2%/6%" with gauge showing 70% filled in yellow

#### Scenario: User exceeds risk threshold
GIVEN user's aggregate risk reaches 5.5%
WHEN risk calculation updates
THEN risk gauge changes to red color
AND gauge shows pulsing animation
AND warning message appears: "High risk - approaching 6% limit"

### Requirement: Signal Cards Display
Signal cards SHALL display active trading signals with priority badges, entry/stop/target prices, setup descriptions, and action buttons.

#### Scenario: High-priority signal display
GIVEN system generates signal for VCB
AND signal score is 9/10
AND all entry criteria are met
WHEN signal appears on dashboard
THEN signal card shows:
- Priority badge: "BUY NOW" in green with target icon
- Symbol: "VCB - SCORE 9/10"
- Entry: "85,600" | Stop: "81,100"
- Setup: "Pullback to 20 EMA"
- Risk: "1.5%" | R:R: "2.8:1"
- Buttons: [VIEW DETAILS] [EXECUTE TRADE] [DISMISS]
AND card appears at top of signal list

#### Scenario: Signal expires
GIVEN signal was generated at 10:00 AM
AND signal validity period is 1 hour
WHEN current time reaches 11:00 AM
THEN signal shows "EXPIRED" badge
AND signal moves to dismissed section
AND user receives notification: "VCB signal expired"

### Requirement: Open Positions Table
The open positions table SHALL display all current holdings with entry info, current prices, P&L breakdown, days held, next targets, and quick action icons.

#### Scenario: Display winning position
GIVEN user holds VCB position
AND entry was 85,000 on Jan 3
AND current price is 88,400
AND position has gained +3.2R
WHEN position displays in table
THEN row shows:
- Symbol: "VCB"
- Entry: "85,000" with "Jan 3" below
- Current: "88,400 (+4.0%)" in green
- P&L: "+1,360K" / "+3.2R" in green
- Days: "10 days"
- Next: "T1:91K"
- Actions: Chart icon, Alert icon
AND row has green background tint

#### Scenario: Position approaching stop loss
GIVEN user holds FPT position
AND current price is 87,500
AND stop loss is 87,000
WHEN price is within 2% of stop
THEN row shows amber background tint
AND alert icon shows warning indicator
AND tooltip shows: "Approaching stop loss - monitor closely"

### Requirement: AI Insights Panel
The AI insights panel SHALL display contextual insights, warnings, success messages, and news relevant to the user's trading activity.

#### Scenario: Correlation warning
GIVEN user has VCB position (banking sector)
AND new signal appears for VPB (banking sector)
AND VCB-VPB correlation is 74%
WHEN AI generates insights
THEN insight card displays:
- Icon: Warning (amber)
- Title: "Sector Concentration Alert"
- Message: "VCB and VPB are 74% correlated. Taking both positions increases sector risk. Consider taking only one."
- Action button: "View Correlation Details"

#### Scenario: Positive reinforcement
GIVEN user closed VNM position yesterday
AND exit was at stop loss
AND user followed trading rules
WHEN AI generates insights
THEN insight card displays:
- Icon: Success (green checkmark)
- Title: "Great Discipline"
- Message: "You followed your stop on VNM yesterday. Protecting capital is key to long-term success."
AND card appears in insights panel

## MODIFIED Requirements
None (new capability)

## REMOVED Requirements
None (new capability)

