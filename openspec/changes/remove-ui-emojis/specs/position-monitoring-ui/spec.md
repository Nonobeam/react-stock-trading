# Spec: Position Monitoring UI Components

## MODIFIED Requirements

### Requirement: Position Status Display
Position status indicators SHALL use Badge components with semantic text instead of emoji-prefixed labels.

#### Scenario: Target Hit Status
```
GIVEN a position that has reached its target price
WHEN displaying the position status
THEN the system shall show:
  - Badge component with variant="success"
  - Text "Target Hit"
AND shall NOT use "🎯 TARGET HIT" with emoji prefix
```

#### Scenario: Stagnant Position Status
```
GIVEN a position with stagnant price movement
WHEN displaying the position status
THEN the system shall show:
  - Badge component with variant="warning"
  - Text "Stagnant"
AND shall NOT use "⚠️ STAGNANT" with emoji prefix
```

### Requirement: Portfolio Summary Cards
Portfolio summary cards SHALL use text labels and CSS indicators instead of emoji icons.

#### Scenario: Card Type Identification
```
GIVEN different portfolio summary card types
WHEN displaying card headers
THEN the system shall show:
  - Text label for card type ("Positions", "Capital", "P&L", "Target", "Risk")
  - CSS left border indicator in theme color
  - No emoji icons in card header
WHERE previous emoji mappings were:
  - 📊 → "Positions"
  - 💰 → "Capital"
  - 📈/📉 → "P&L" (color-coded by positive/negative)
  - 🎯 → "Target"
  - ⚠️ → "Risk"
```

#### Scenario: P&L Direction Indicator
```
GIVEN portfolio profit/loss value
WHEN displaying P&L card
THEN the system shall show:
  - Text label "P&L"
  - Value colored by sign (green for positive, red for negative)
  - Optional small indicator dot matching text color
AND shall NOT use 📈 emoji for positive or 📉 emoji for negative
```

### Requirement: Alert and Warning Display
Alerts and warnings SHALL use styled text and Badge components instead of emoji prefixes.

#### Scenario: Error State Display
```
GIVEN an error condition in monitoring view
WHEN displaying the error
THEN the system shall show:
  - CSS danger indicator (red dot or border)
  - Error message text
  - Appropriate styling with var(--color-danger)
AND shall NOT use ⚠️ emoji icon
```

#### Scenario: Stagnation Alert Header
```
GIVEN a stagnation alerts section
WHEN displaying the section header
THEN the system shall show:
  - <h3> with text "Stagnation Alerts"
  - CSS class for warning emphasis
  - No emoji in header text
AND shall NOT use "⚠️ Stagnation Alerts"
```

#### Scenario: Target Alert Display
```
GIVEN a target hit alert
WHEN displaying the alert item
THEN the system shall show:
  - Text label "Target Alert" or similar
  - Appropriate Badge or CSS indicator
  - Alert details and timestamp
AND shall NOT use 🎯 emoji icon
```

### Requirement: Stop Management Indicators
Stop management panel SHALL use Badge components for status display instead of emoji-prefixed text.

#### Scenario: Risk-Free Position Badge
```
GIVEN a position with stop price above entry (risk-free)
WHEN displaying the risk status
THEN the system shall show:
  - Badge component with variant="success"
  - Text "Risk-Free Position"
AND shall NOT use "🎯 Risk-Free!" with emoji prefix
```

### Requirement: Close Position Modal
Position close warnings SHALL use styled warning sections instead of emoji prefixes.

#### Scenario: Loss Warning Display
```
GIVEN a user attempting to close a losing position
WHEN displaying the warning
THEN the system shall show:
  - Prominently styled warning section with danger background
  - Bold text "Warning:" prefix
  - Loss amount and percentage clearly displayed
  - Confirmation required before proceeding
AND shall NOT use ⚠️ emoji prefix
```

### Requirement: Empty States
Empty state displays SHALL use text messages without emoji icons.

#### Scenario: No Positions Empty State
```
GIVEN no active positions
WHEN displaying the positions table
THEN the system shall show:
  - Text message "No positions"
  - Optional helpful context or call-to-action
  - Styled empty state container
AND shall NOT use 📊 emoji icon
```

## REMOVED Requirements

- Emoji-Based Status Icons: Position monitoring components may use emoji characters (🎯, ⚠️, 📊, 💰, 📈, 📉) for visual indicators.
**Priority**: N/A  
**Category**: Position Monitoring UI

~~Position monitoring components may use emoji characters (🎯, ⚠️, 📊, 💰, 📈, 📉) for visual indicators.~~

**Rationale**: Emojis compromise professional appearance and accessibility of a trading application.

## ADDED Requirements

### Requirement: Consistent Badge Usage
Position monitoring components SHALL consistently use the Badge component for status display.

#### Scenario: Badge Variant Mapping
```
GIVEN different position and portfolio states
WHEN selecting Badge variant for display
THEN the system shall use this mapping:
  - "success" variant for: target hit, profit states, risk-free positions
  - "warning" variant for: stagnant positions, cautionary states
  - "danger" variant for: loss states, critical warnings, errors
  - "info" variant for: informational states, neutral status
```

#### Scenario: Badge Text Guidelines
```
GIVEN a status to display in a Badge
WHEN determining badge text
THEN the text shall be:
  - Concise (1-3 words ideal)
  - Clear and unambiguous
  - Capitalized appropriately (Title Case or sentence case)
  - Free of emoji characters
  - Descriptive of the actual state
```
