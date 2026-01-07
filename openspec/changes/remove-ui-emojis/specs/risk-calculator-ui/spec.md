# Spec: Risk Calculator UI Components

## MODIFIED Requirements

### Requirement: Viability Checklist Display
The viability checklist SHALL display pass/fail status using semantic badges and text labels instead of emoji characters.

#### Scenario: Overall Viability Status
```
GIVEN a trade viability assessment result
WHEN displaying the overall status
THEN the system shall show:
  - Badge with variant="success" and text "Viable" for passed trades
  - Badge with variant="danger" and text "Not Viable" for failed critical checks
  - Badge with variant="warning" and text "Caution Required" for non-critical failures
AND shall NOT use emoji characters (✅, ❌, ⚠️)
```

#### Scenario: Individual Check Results
```
GIVEN individual viability check results
WHEN displaying each check item
THEN the system shall show:
  - CSS status indicator dot (green for passed, red for failed)
  - Text label "Passed" or "Failed"
  - Check description and details
AND shall NOT use emoji characters for check status
```

### Requirement: Target Planner Headings
Target planning sections SHALL use clear text headings without emoji prefixes.

#### Scenario: Target Method Labels
```
GIVEN different target calculation methods
WHEN displaying method headers
THEN the system shall show text-only labels:
  - "Risk-Multiple Targets" (not "📊 Risk-Multiple Targets")
  - "ATR-Based Targets" (not "📈 ATR-Based Targets")
  - "Technical Resistance" (not "🎯 Technical Resistance")
  - "Consensus Target Zones" (not "🎯 Consensus Target Zones")
```

### Requirement: Warning Messages
Warning messages in risk calculator components SHALL use styled text or Badge components instead of emoji prefixes.

#### Scenario: Price Level Warning
```
GIVEN an invalid or risky price level
WHEN displaying a warning message
THEN the system shall show:
  - Styled <span> with class "warning-text" and color var(--color-warning)
  - Text prefix "Warning:" followed by the warning message
AND shall NOT use ⚠️ emoji prefix
```

#### Scenario: Warnings Section Header
```
GIVEN a warnings section in risk summary
WHEN displaying the section header
THEN the system shall show:
  - <h4> with text "Warnings"
  - CSS class "section-header--warning"
  - Left border in warning color
AND shall NOT use ⚠️ emoji in heading
```

## REMOVED Requirements

- Emoji-Based Status Icons: Risk calculator components may use emoji characters (✅, ❌, ⚠️, 🎯, 📊, 📈) for visual indicators.
**Priority**: N/A  
**Category**: Risk Calculator UI

~~Risk calculator components may use emoji characters (✅, ❌, ⚠️, 🎯, 📊, 📈) for visual indicators.~~

**Rationale**: Inconsistent with professional UI design and accessibility standards.
