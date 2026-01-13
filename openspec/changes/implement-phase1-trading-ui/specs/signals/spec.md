# Spec Delta: Signals View

## ADDED Requirements

### Requirement: Active signals tab display ready signals`nThe active signals tab SHALL display all ready-to-act signals with complete entry details, position sizing, AI reasoning, and action buttons.

#### Scenario: High-conviction signal display
GIVEN system generates BUY signal for VCB at 10:23 AM
AND signal score is 9/10
AND all entry criteria met
WHEN signal appears in Active tab
THEN detailed signal card shows:
- Header: "BUY SIGNAL" badge with priority icon
- Symbol: "VCB - Vietcombank"
- Score: "9/10" (green badge) "HIGH CONVICTION"
- Current price: 85,600₫ (+2.1%) [live updating every 3s]
- Valid until: "11:00 AM (37 minutes)"
- Freshness indicator: "FRESH" in green
- Setup description: "Pullback to 20 EMA in Strong Uptrend"
- Entry & Risk panel:
  * Suggested Entry: 85,500 - 85,800
  * Stop Loss: 81,100 (below swing low)
  * Risk per share: 4,400₫
  * Risk distance: 5.1%
  * Targets: T1 (2R): 94,300 | T2 (3R): 98,700 | T3: Trail with 20 EMA
  * Risk/Reward: 2.8:1 ✓
- Position sizing panel:
  * Your capital: 100,000,000₫
  * Risk amount: 1,500,000₫ (1.5%)
  * Position size: 341 shares
  * Position value: 29,205,800₫ (29.2% of capital)
  * Worst case (3-day floor): -5,115,000₫ (-5.1%)
  * After entry impacts:
    - Open positions: 5 (was 4)
    - Aggregate risk: 5.7% (was 4.2%) [⚠️ High warning]
    - Available cash: 5.8M (was 35M)
- AI reasoning panel:
  * ✓ Weekly uptrend confirmed
  * ✓ Daily pullback perfect
  * ✓ Volume decreased during pullback
  * ✓ Hammer candle formed
  * ✓ Volume spike today (87th percentile)
  * ✓ RSI reset to 48
  * ✓ Banking sector strong (+1.8%)
  * ⚠️ Banking exposure will be 38% (near 40% limit)
  * Matches your 3 best historical trades
  * Win probability (ML model): 72%
- Action buttons: [EXECUTE TRADE] [VIEW CHART] [SNOOZE] [DISMISS]

#### Scenario: Signal validity expiration
GIVEN signal was generated at 10:00 AM
AND signal valid for 60 minutes
WHEN current time reaches 11:00 AM
THEN signal card shows:
- "EXPIRED" badge in red
- Price stops updating
- Action buttons disabled except [DISMISS]
- Warning message: "This signal has expired. Market conditions may have changed."
AND signal automatically moves to dismissed tab after 5 minutes

### Requirement: Watch signals tab display forming setups`nThe watch signals tab SHALL display setups that are forming but not yet ready for entry (score 8-9, 80-95% ready).

#### Scenario: User views watch signal
GIVEN HPG is setting up
AND score is 8/10
AND status is "WATCH - 1-2 days to entry"
WHEN signal appears in Watch tab
THEN card shows:
- "WATCH" badge in amber
- Symbol: "HPG - Hoa Phat Group"
- Score: 8/10 (amber badge)
- Current price with % change
- Progress indicator: "85% ready"
- What's missing: "Waiting for: Volume confirmation"
- Estimated time: "Expected entry signal in 1-2 days"
- Mini chart showing setup formation
- Button: [SET ALERT WHEN READY]

#### Scenario: Watch signal becomes active
GIVEN HPG watch signal
WHEN all entry criteria become met
THEN signal automatically moves to Active tab
AND user receives notification: "HPG setup complete - now ready to enter"
AND signal card updates to "BUY NOW" status

### Requirement: Dismissed signals tab support restore`nUsers SHALL be able to dismiss signals they don't want to act on, with the ability to view and restore dismissed signals.

#### Scenario: User dismisses signal
GIVEN active VCB signal
WHEN user clicks [DISMISS] button
THEN confirmation prompt appears: "Dismiss VCB signal? You can restore it from Dismissed tab."
WHEN user confirms
THEN signal moves to Dismissed tab
AND shows timestamp: "Dismissed at 10:45 AM"
AND shows reason dropdown: "Not interested", "Already have position", "Risk too high", "Other"

#### Scenario: User restores dismissed signal
GIVEN VCB signal was dismissed 30 minutes ago
AND signal is still valid
WHEN user clicks [RESTORE] in Dismissed tab
THEN signal moves back to Active tab
AND all data refreshes to current values

### Requirement: Signal history tab track outcomes`nThe history tab SHALL show all past signals (acted on, expired, or dismissed) with outcome tracking for signals that led to trades.

#### Scenario: User reviews signal outcomes
GIVEN user executed VNM signal on Jan 2
AND trade closed on Jan 17 with +2.1R profit
WHEN user views signal in History tab
THEN entry shows:
- Signal generation date/time
- Signal details (entry, stop, targets)
- Outcome badge: "TRADED" in green
- Trade result: "+2.1R profit" linked to trade review
- Click link opens full trade detail from portfolio history

#### Scenario: User analyzes missed opportunities
GIVEN HPG signal expired on Jan 10 without user action
AND stock subsequently moved up +15% in 5 days
WHEN user views History tab
THEN HPG signal shows:
- Outcome badge: "EXPIRED - NOT TAKEN"
- What happened: "Stock moved +15% after signal (missed opportunity)"
- Analysis: "This setup matched your best performers - consider similar signals"

## MODIFIED Requirements
None (new capability)

## REMOVED Requirements
None (new capability)

