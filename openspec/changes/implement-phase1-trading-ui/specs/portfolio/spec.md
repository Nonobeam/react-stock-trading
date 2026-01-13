# Spec Delta: Portfolio View

## ADDED Requirements

### Requirement: Capital overview tab display breakdown`nThe portfolio capital tab SHALL display available cash, locked capital in T+2 settlement, capital in positions, visual breakdown, and risk allocation.

#### Scenario: User views capital breakdown
GIVEN user has total portfolio value of 108,200,000 VND
AND available cash is 35,000,000 VND (32.3%)
AND locked capital is 15,200,000 VND (14.0%)
AND capital in positions is 58,000,000 VND (53.6%)
WHEN user views Capital tab
THEN display shows:
- Three summary cards (Available Cash, Locked Capital, In Positions)
- Pie chart showing capital distribution by position
- Risk allocation panel showing 4.2% of 6% max risk used

#### Scenario: Settlement schedule display
GIVEN user sold VNM on Jan 12
AND settlement is T+2 (Jan 14)
AND sale proceeds were 8,000,000 VND
WHEN user views Locked Capital card
THEN card shows:
- Total locked: 15,200,000 VND
- Settlement schedule:
  * "Settles Jan 14: 8,000,000₫ (VNM sale)"
  * "Settles Jan 15: 7,200,000₫ (FPT sale)"
AND day before settlement, user receives notification: "8M VND available tomorrow"

### Requirement: Positions tab display detailed cards`nThe positions tab SHALL display each open position as a detailed card with complete P&L breakdown, targets, and management actions.

#### Scenario: User views winning position details
GIVEN user has VCB position
AND entry: 333 shares @ 85,000 on Jan 3
AND current price: 97,480 (+14.7%)
AND position has gained +3.2R
WHEN user views Positions tab
THEN VCB card displays:
- Header: "VCB - Vietcombank" with [CHART] [MANAGE] buttons
- Entry info: "85,000₫ on Jan 3, 2025 (10 days ago)"
- Current: "97,480₫ (+14.7%)" in large green text
- Position size: "333 shares"
- P&L breakdown:
  * Gross P&L: +4,155,840₫
  * Entry Commission: -70,762₫
  * Exit Commission: -81,152₫ (estimated)
  * Exit Tax: -32,461₫ (estimated)
  * NET P&L: +3,971,465₫ (+14.0%) [large, bold, green]
  * R-Multiple: +3.2R [green badge]
- Stop loss: 81,100₫ with progress bar showing distance to T1
- Targets: T1: 91,000₫ (+2R), T2: 97,000₫ (+3R), T3: Trail with 20 EMA
- Buttons: [ADJUST STOP] [TAKE PROFIT] [CLOSE POSITION] [NOTES]

#### Scenario: Position approaching stop loss
GIVEN user has FPT position
AND current price is 87,500
AND stop loss is 87,000 (within 2%)
WHEN position displays
THEN card shows:
- Amber background tint
- Warning icon and message: "Approaching stop loss - monitor closely"
- Stop loss highlighted in red with pulsing effect

### Requirement: Trade history tab display closed trades`nThe history tab SHALL display all closed trades with filtering, sorting, and detailed trade review modals.

#### Scenario: User filters closed trades
GIVEN user has 23 closed trades (15 winners, 8 losers)
WHEN user selects filter: "Winners Only"
AND date range: "Last 30 Days"
THEN table displays 15 winning trades
AND summary bar shows:
- Total: 15 trades
- Win rate: 100% (filtered)
- Average R: +2.1R
- Total profit: +18,400,000₫

#### Scenario: User views detailed trade review
GIVEN user clicks closed VNM trade in history
WHEN trade review modal opens
THEN modal displays:
- Left panel: Trade data (entry, exit, financial breakdown, performance metrics)
- Right panel: Chart showing entry point, stop, exit marked on price action
- MAE (Maximum Adverse Excursion): -0.2R
- MFE (Maximum Favorable Excursion): +2.3R
- Journal notes: Entry reason and exit notes
- Export button for trade data

### Requirement: Analytics tab provide performance dashboards`nThe analytics tab SHALL provide comprehensive performance dashboards with equity curve, setup type breakdown, R-multiple distribution, and MAE vs MFE analysis.

#### Scenario: User views performance analytics
GIVEN user has 23 closed trades over 3 months
WHEN user views Analytics tab
THEN dashboard displays:
- Key metrics cards (23 trades, 65% win rate, +1.2R expectancy)
- Equity curve showing account growth from 100M to 118.4M
- Setup type breakdown:
  * Pullback: 12 trades, 75% win rate, +1.8R avg
  * Breakout: 8 trades, 50% win rate, +0.8R avg
  * MA Bounce: 3 trades, 67% win rate, +1.5R avg
- R-multiple histogram showing distribution
- MAE vs MFE scatter plot with insight: "Most winners had MAE < 0.5R"

#### Scenario: User compares time periods
GIVEN user selects "Last 3 Months"
AND enables "Compare to Previous Period"
WHEN analytics loads
THEN dashboard shows:
- Current period: 23 trades, +18.4%, +1.2R avg
- Previous period: 18 trades, +12.1%, +0.9R avg
- Improvement indicators: ▲ Win rate +10%, ▲ Expectancy +0.3R

## MODIFIED Requirements
None (new capability)

## REMOVED Requirements
None (new capability)

