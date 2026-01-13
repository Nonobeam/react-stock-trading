# Spec Delta: Watchlist View

## ADDED Requirements

### Requirement: Watchlist Stock Monitoring
The watchlist SHALL allow users to monitor multiple stocks simultaneously, tracking their setup progress, scores, and readiness for entry.

#### Scenario: User views watchlist with multiple stocks
GIVEN user has 15 stocks in watchlist
AND 3 stocks are ready to enter (score 9-10, ready status)
AND 5 stocks are setting up (score 8-9, watch status)
WHEN user views watchlist
THEN table displays all 15 stocks with columns:
- Checkbox for selection
- Symbol (clickable)
- Current price (updating every 3 seconds)
- Price change % (color-coded)
- Volume percentile
- Score (0-10 with color badge)
- Setup type
- Distance/status (e.g., "0.5% to 20 EMA READY")
- Days in setup
- Alert icon
AND header shows: "Showing: 15 stocks | 3 Near Entry | 5 Setting Up"

#### Scenario: Stock becomes ready for entry
GIVEN VCB is in watchlist with score 8/10 and status "WATCH"
AND VCB price pulls back to within 0.5% of 20 EMA
WHEN setup criteria are fully met
THEN VCB row updates to:
- Score: 9/10 (green badge)
- Status: "READY" in green
- Alert icon: Lightning bolt (⚡)
AND row background pulses green briefly
AND user receives browser notification: "VCB is ready to enter (Score 9/10)"
AND optional sound notification plays

### Requirement: Watchlist Filtering and Sorting
The watchlist shall support comprehensive filtering by setup type, score, readiness, and sector, plus sorting by multiple criteria.

#### Scenario: User filters for high-conviction ready setups
GIVEN user has 15 stocks in watchlist
WHEN user selects filter: "Score 9-10" AND "Ready Now"
THEN table displays only 3 stocks meeting criteria
AND header updates: "Showing: 3 stocks (filtered)"
AND filter badge appears with [×] to clear

#### Scenario: User sorts by readiness
GIVEN watchlist has mixed readiness levels
WHEN user selects sort: "Readiness"
THEN stocks reorder:
- READY stocks first (with score 9-10 at top)
- WATCH stocks second (score 8-9)
- SOON stocks third (score 7)
- NOT YET stocks last (score <7)

### Requirement: Stock Detail Panel
Clicking a watchlist row shall open a detail panel showing mini chart, setup analysis checklist, entry details, and action buttons.

#### Scenario: User clicks stock to view details
GIVEN user clicks VCB row in watchlist
WHEN detail panel opens
THEN panel slides in from right (400-500px width)
AND displays:
- Header: "VCB - Vietcombank" with current price 85,600 (+2.1%)
- Score: 9/10 (green badge)
- Mini chart: 30-day price with 20 EMA and 50 EMA shown
- Setup checklist:
  * ✓ Weekly uptrend
  * ✓ Daily pullback to 20 EMA
  * ✓ Volume decreasing
  * ✓ RSI reset to 48
  * ⚠️ Banking sector at 38% exposure
- Entry details: Entry range, stop, targets, position size
- Buttons: [SET ALERT] [VIEW FULL CHART] [ASK AI] [EXECUTE TRADE]

#### Scenario: User closes detail panel
GIVEN detail panel is open
WHEN user clicks [×] button OR presses Escape key OR clicks outside panel
THEN panel slides out to right and disappears
AND table width expands back to full width

### Requirement: Watchlist Management
Users shall be able to add stocks via search, remove stocks, and perform bulk actions on selected stocks.

#### Scenario: User adds stock to watchlist
GIVEN user clicks [+ ADD STOCK] button
WHEN search modal opens
AND user types "VCB"
THEN autocomplete shows "VCB - Vietcombank"
WHEN user clicks suggestion or presses Enter
THEN VCB is added to watchlist
AND appears in table
AND system begins monitoring VCB for setups

#### Scenario: User removes stock from watchlist
GIVEN user selects 2 stocks via checkboxes
WHEN user clicks "BULK ACTIONS" → "Remove from watchlist"
THEN confirmation modal appears: "Remove 2 stocks from watchlist?"
WHEN user confirms
THEN selected stocks are removed from table
AND monitoring stops for those stocks

### Requirement: Empty Watchlist State
When watchlist is empty, the system shall display an encouraging empty state with quick-add suggestions.

#### Scenario: New user with empty watchlist
GIVEN user's watchlist is empty
WHEN user navigates to watchlist screen
THEN empty state displays:
- Icon: 📋 (clipboard)
- Title: "Your watchlist is empty"
- Description: "Add stocks you want to monitor for trading opportunities"
- Button: [+ ADD YOUR FIRST STOCK]
- Suggestion chips: [VCB] [VPB] [HPG] [VNM] [FPT]
WHEN user clicks [VCB] chip
THEN VCB is added to watchlist
AND empty state disappears
AND table appears with VCB row

## MODIFIED Requirements
None (new capability)

## REMOVED Requirements
None (new capability)

