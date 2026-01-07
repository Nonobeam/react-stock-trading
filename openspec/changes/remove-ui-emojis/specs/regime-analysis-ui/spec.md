# Spec: Regime Analysis UI Components

## MODIFIED Requirements

### Requirement: Regime State Indicators
Market regime states SHALL be displayed using colored indicators and text labels instead of emoji characters.

#### Scenario: Bullish Regime Display
```
GIVEN a bullish market regime
WHEN displaying the regime state
THEN the system shall show:
  - Colored dot indicator in green (var(--color-success))
  - Text label "Bullish"
  - CSS class "regime-indicator--bullish"
AND shall NOT use 📈 emoji
```

#### Scenario: Bearish Regime Display
```
GIVEN a bearish market regime
WHEN displaying the regime state
THEN the system shall show:
  - Colored dot indicator in red (var(--color-danger))
  - Text label "Bearish"
  - CSS class "regime-indicator--bearish"
AND shall NOT use 📉 emoji
```

#### Scenario: Transition Regime Display
```
GIVEN a transitioning market regime
WHEN displaying the regime state
THEN the system shall show:
  - Colored dot indicator in yellow (var(--color-warning))
  - Text label "Transition"
  - CSS class "regime-indicator--transition"
AND shall NOT use 🔄 emoji
```

### Requirement: Regime Configuration Objects
Regime configuration objects SHALL not contain emoji icon properties.

#### Scenario: Regime Config Structure
```
GIVEN regime type configurations (BULLISH, BEARISH, NEUTRAL, RANGING, TRANSITION)
WHEN defining regime properties
THEN the configuration shall include:
  - label: string (regime name)
  - color: string (theme color variable)
  - description: string
  - cssClass: string (for styling)
AND shall NOT include:
  - icon: string (with emoji value)
```

### Requirement: Regime Alerts Display
Regime alerts SHALL display regime types using Badge components instead of emoji icons.

#### Scenario: Alert with Regime Type
```
GIVEN a regime change alert
WHEN displaying the alert item
THEN the system shall show:
  - Badge component with appropriate variant based on regime type
  - Text label for regime type ("Bullish", "Bearish", "Transition")
  - Alert message and timestamp
AND shall NOT use emoji icons from REGIME_ICONS mapping
```

#### Scenario: Empty Alerts State
```
GIVEN no active regime alerts
WHEN displaying the alerts section
THEN the system shall show:
  - Text message "No alerts"
  - Styled empty state container
AND shall NOT use 🔔 emoji icon
```

### Requirement: Regime History Display
Regime history entries SHALL display regime types using colored text and indicators instead of emoji icons.

#### Scenario: History Entry Rendering
```
GIVEN a regime history entry
WHEN displaying the history item
THEN the system shall show:
  - Colored indicator dot matching regime type
  - Text label for regime type
  - Date and time information
  - Duration information
AND shall NOT use emoji icons from REGIME_ICONS mapping
```

## REMOVED Requirements

- Emoji-Based Regime Icons: Regime components may use emoji characters (📈, 📉, 🔄, 🔔) for visual representation of market states.
**Priority**: N/A  
**Category**: Regime Analysis UI

~~Regime components may use emoji characters (📈, 📉, 🔄, 🔔) for visual representation of market states.~~

**Rationale**: Emojis are not accessible and don't align with professional trading application UI standards.

## ADDED Requirements

### Requirement: Regime Indicator Component Pattern
The system SHALL provide a consistent pattern for displaying regime states across all components.

#### Scenario: Regime Indicator Structure
```
GIVEN any component displaying a regime state
WHEN rendering the regime indicator
THEN the system shall use this structure:
  - Container with class "regime-indicator regime-indicator--{type}"
  - Colored dot span with class "regime-dot"
  - Text label span with class "regime-label"
  - Appropriate ARIA labels for accessibility
WHERE {type} is: bullish, bearish, ranging, neutral, or transition
```

#### Scenario: Regime Color Associations
```
GIVEN regime type to color mappings
WHEN applying colors to regime indicators
THEN the system shall use:
  - Bullish → var(--color-success) / Green
  - Bearish → var(--color-danger) / Red
  - Transition → var(--color-warning) / Yellow
  - Neutral → var(--color-text-muted) / Gray
  - Ranging → var(--color-info) / Blue
AND these associations shall be consistent across all regime components
```
