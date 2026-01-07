# Spec: UI Status Indicators

## MODIFIED Requirements

### Requirement: Status Visual Representation
The system SHALL represent status information using semantic text labels and CSS-based visual indicators instead of emoji characters.

#### Scenario: Success Status Display
```
GIVEN a successful operation or passed check
WHEN the status is displayed to the user
THEN the system shall show:
  - A text label indicating success (e.g., "Passed", "Success")
  - A green colored indicator (dot, badge, or border)
  - A Badge component with variant="success" for emphasis
AND shall NOT display emoji characters (✅, 🎯, etc.)
```

#### Scenario: Warning Status Display
```
GIVEN a warning condition or cautionary state
WHEN the status is displayed to the user
THEN the system shall show:
  - A text label indicating the warning (e.g., "Warning", "Caution")
  - A yellow/orange colored indicator
  - A Badge component with variant="warning" for emphasis
AND shall NOT display emoji characters (⚠️, etc.)
```

#### Scenario: Error Status Display
```
GIVEN a failed operation or error condition
WHEN the status is displayed to the user
THEN the system shall show:
  - A text label indicating failure (e.g., "Failed", "Error")
  - A red colored indicator
  - A Badge component with variant="danger" for emphasis
AND shall NOT display emoji characters (❌, etc.)
```

### Requirement: Accessibility Compliance
Status indicators SHALL be accessible to screen readers and keyboard users, with meaning conveyed through both color and text.

#### Scenario: Screen Reader Announcement
```
GIVEN a status indicator using CSS and text
WHEN a screen reader user encounters the element
THEN the screen reader shall announce:
  - The status text clearly (e.g., "Passed", "Warning: High Risk")
  - Any associated labels or context
AND shall provide meaningful information without requiring visual interpretation
```

#### Scenario: Color Contrast Requirements
```
GIVEN any status indicator using color
WHEN displayed on the dark blue theme background
THEN the color contrast shall:
  - Meet WCAG AA standards (minimum 4.5:1 for normal text)
  - Use theme color variables (--color-success, --color-warning, --color-danger)
  - Supplement color with text labels for colorblind users
```

## REMOVED Requirements

- Emoji Character Usage: The system may use emoji characters for visual status indication.
**Priority**: N/A  
**Category**: User Interface

~~The system may use emoji characters for visual status indication.~~

**Rationale**: Emojis are not professional, inaccessible, and inconsistent with the application's design system.

## ADDED Requirements

### Requirement: Badge Component Integration
The system SHALL use the existing Badge component from `src/shared/components/Badge.tsx` for prominent status display.

#### Scenario: Badge Variant Selection
```
GIVEN a status type to display
WHEN rendering a prominent status indicator
THEN the system shall use Badge component with appropriate variant:
  - variant="success" for positive/passed states
  - variant="danger" for negative/failed states
  - variant="warning" for cautionary states
  - variant="info" for informational states
  - variant="neutral" for neutral states
```

### Requirement: CSS Indicator Styling
The system SHALL provide CSS classes for small status indicators (dots, borders) that complement text labels.

#### Scenario: Status Indicator Dot
```
GIVEN a compact status display requirement
WHEN rendering inline status
THEN the system shall provide:
  - `.status-indicator` base class with 8px circular dot
  - Variant classes: `--success`, `--warning`, `--danger`, `--info`
  - Use of theme color variables for background
  - Subtle glow effect using box-shadow
  - Proper spacing (margin-right: 0.5rem)
```

### Requirement: Theme Color Consistency
All status indicators SHALL use existing theme color variables for consistency across the application.

#### Scenario: Theme Variable Usage
```
GIVEN any status indicator or badge
WHEN applying colors for status types
THEN the system shall use these CSS variables:
  - var(--color-success) for positive states (#4ade80)
  - var(--color-danger) for negative states (#ef4444)
  - var(--color-warning) for cautionary states (#fbbf24)
  - var(--color-info) for informational states (#3b82f6)
AND shall NOT introduce new hardcoded color values
```
