# Spec Delta: Vietnam Financial Calculations

## ADDED Requirements

### Requirement: System calculate transaction commission`nThe system SHALL calculate entry and exit commissions at 0.25% of transaction value with a 500 VND minimum per trade.

#### Scenario: Calculate commission for standard trade
GIVEN user enters VCB position
AND entry value is 28,305,000 VND (333 shares @ 85,000)
WHEN system calculates entry commission
THEN commission = 28,305,000 × 0.0025 = 70,762.50 VND
AND system rounds to 70,763 VND (round up to nearest VND)
AND commission is deducted from available cash

#### Scenario: Calculate commission for small trade
GIVEN user enters position with value 150,000 VND
WHEN system calculates commission
THEN calculated commission = 150,000 × 0.0025 = 375 VND
BUT minimum commission is 500 VND
THEN final commission = 500 VND

### Requirement: System calculate exit tax`nThe system SHALL calculate 0.1% tax on all exit transactions (Vietnamese securities transaction tax).

#### Scenario: Calculate exit tax
GIVEN user exits VCB position
AND exit value is 32,460,840 VND (333 shares @ 97,480)
WHEN system calculates exit tax
THEN tax = 32,460,840 × 0.001 = 32,460.84 VND
AND system rounds to 32,461 VND
AND tax is included in net P&L calculation

### Requirement: System calculate net profit and loss`nThe system SHALL calculate net profit/loss accounting for all transaction costs: entry commission, exit commission, and exit tax.

#### Scenario: Calculate net P&L for winning trade
GIVEN position details:
- Entry: 333 shares @ 85,000 = 28,305,000 VND
- Exit: 333 shares @ 97,480 = 32,460,840 VND
- Entry commission: 70,763 VND (already paid)
- Exit commission: 81,152 VND (estimated)
- Exit tax: 32,461 VND (estimated)
WHEN system calculates net P&L
THEN:
- Gross P&L = 32,460,840 - 28,305,000 = 4,155,840 VND
- Total costs = 70,763 + 81,152 + 32,461 = 184,376 VND
- Net P&L = 4,155,840 - 184,376 = 3,971,464 VND
- Net P&L % = 3,971,464 / 28,305,000 × 100 = 14.03%

#### Scenario: Real-time net P&L updates for open position
GIVEN user has open VCB position
AND current price changes from 88,400 to 88,600
WHEN price updates
THEN system recalculates:
- New current value = 333 × 88,600 = 29,503,800 VND
- New exit commission = 29,503,800 × 0.0025 = 73,760 VND
- New exit tax = 29,503,800 × 0.001 = 29,504 VND
- New net P&L = (29,503,800 - 28,305,000) - 70,763 - 73,760 - 29,504
- New net P&L = 1,024,773 VND (+3.62%)
AND display updates in real-time

### Requirement: System track T+2 settlement`nThe system SHALL track T+2 settlement dates for all sell transactions, accounting for weekends and Vietnamese public holidays.

#### Scenario: Calculate settlement date for mid-week trade
GIVEN user sells VNM position on Monday Jan 13, 2025
WHEN system calculates settlement date
THEN:
- T+0 = Monday Jan 13 (trade date)
- T+1 = Tuesday Jan 14 (skip, count business days only)
- T+2 = Wednesday Jan 15 (settlement date)
AND system creates settlement schedule entry:
- Date: Jan 15, 2025
- Amount: 8,000,000 VND
- Source: "VNM position sale"
AND cash remains "locked" until Jan 15

#### Scenario: Calculate settlement spanning weekend
GIVEN user sells FPT position on Friday Jan 10, 2025
WHEN system calculates settlement date
THEN:
- T+0 = Friday Jan 10
- Skip Saturday Jan 11 (weekend)
- Skip Sunday Jan 12 (weekend)
- T+1 = Monday Jan 13 (first business day)
- T+2 = Tuesday Jan 14 (settlement date)

#### Scenario: Settlement notification
GIVEN settlement date is tomorrow (Jan 14)
WHEN daily notification check runs at 8:00 PM Jan 13
THEN system sends notification: "8,000,000₫ from VNM sale will be available tomorrow"
AND notification appears in app
WHEN settlement date arrives (Jan 14)
THEN at market open:
- Cash moves from "Locked Capital" to "Available Cash"
- User receives notification: "8,000,000₫ now available for trading"
- Portfolio summary cards update

### Requirement: System calculate R-multiple`nThe system SHALL calculate R-multiple (risk-adjusted return) for all positions and trades.

#### Scenario: Calculate R-multiple for open position
GIVEN position details:
- Entry price: 85,000 VND
- Current price: 97,480 VND
- Stop loss: 81,100 VND
WHEN system calculates R-multiple
THEN:
- 1R (initial risk) = Entry - Stop = 85,000 - 81,100 = 3,900 VND per share
- Current gain = Current - Entry = 97,480 - 85,000 = 12,480 VND per share
- R-multiple = 12,480 / 3,900 = 3.2R
AND display shows: "+3.2R" with green badge

#### Scenario: Calculate R-multiple for closed losing trade
GIVEN closed position:
- Entry: 24,500 VND
- Exit: 22,100 VND
- Stop loss: 22,000 VND
WHEN system calculates final R-multiple
THEN:
- 1R = 24,500 - 22,000 = 2,500 VND
- Loss = 22,100 - 24,500 = -2,400 VND
- R-multiple = -2,400 / 2,500 = -0.96R
AND history shows: "-0.96R" in red

### Requirement: System calculate position size`nThe system SHALL calculate appropriate position size based on user's risk percentage, account size, entry price, and stop loss.

#### Scenario: Calculate position size for 1.5% risk
GIVEN:
- Total capital: 100,000,000 VND
- Risk percentage: 1.5%
- Entry price: 85,600 VND
- Stop loss: 81,100 VND
WHEN system calculates position size
THEN:
- Risk amount = 100,000,000 × 0.015 = 1,500,000 VND
- Risk per share = 85,600 - 81,100 = 4,500 VND
- Shares = 1,500,000 / 4,500 = 333.33
- Round down to 333 shares (must be whole shares)
- Actual position value = 333 × 85,600 = 28,504,800 VND
- Actual risk = 333 × 4,500 = 1,498,500 VND (≈1.5%)

#### Scenario: Adjust for lot size requirements
GIVEN calculated position size is 333 shares
AND Vietnam lot size for stock is 100 shares
WHEN system adjusts to lot size
THEN position size becomes 300 shares (round down to nearest 100)
OR displays warning: "Note: Position adjusted to 300 shares (3 lots) to meet lot size requirement"

## MODIFIED Requirements
None (new capability)

## REMOVED Requirements
None (new capability)

