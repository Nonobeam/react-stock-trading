# Specification: Settings Screen

**Capability**: `settings-screen`  
**Status**: New  
**Related Changes**: `implement-phase2-trading-features`

## Overview

The Settings Screen provides comprehensive configuration of trading parameters, risk limits, notifications, and system preferences. All settings persist to localStorage and affect behavior across all features.

## ADDED Requirements

### Requirement: SETTINGS-UI-001 - Navigation and Organization

The system shall organize settings into logical categories accessible via tab navigation.

#### Scenario: Viewing settings categories
**Given** the user navigates to Settings screen  
**When** the page loads  
**Then** the system displays horizontal tab navigation with categories:
- General
- Trading Parameters
- Risk Management
- Notifications
- Integrations (future)
- Data & Privacy
- Appearance
- Account  
**And** "Trading Parameters" tab is active by default  
**And** unsaved changes indicator appears on tabs with pending changes

#### Scenario: Switching between categories
**Given** the user is viewing a settings category  
**When** the user clicks a different tab  
**And** there are unsaved changes in current tab  
**Then** the system displays confirmation dialog:
"You have unsaved changes. Save before switching?"
[Save & Switch] [Discard Changes] [Cancel]  
**When** user chooses "Save & Switch"  
**Then** settings are saved and new tab loads

---

### Requirement: SETTINGS-UI-002 - Trading Parameters Configuration

The system shall allow modification of all core trading parameters (MA periods, indicators, entry criteria).

#### Scenario: Configuring moving averages
**Given** the user is on "Trading Parameters" tab  
**When** the user views "Moving Averages" section  
**Then** the system displays number inputs for:
- Fast EMA (default: 20, range: 5-50)
- Slow EMA (default: 50, range: 20-200)
- Long-term SMA (default: 200, range: 100-300)  
**And** validates Slow > Fast  
**When** user enters invalid values (e.g., Fast EMA = 60, Slow EMA = 50)  
**Then** system displays error "Slow EMA must be greater than Fast EMA"

#### Scenario: Configuring indicators
**Given** the user views "Indicators" section  
**Then** the system displays inputs for:
- RSI Period (default: 14, range: 7-30)
- MACD (Fast: 12, Slow: 26, Signal: 9)
- ATR Period (default: 14, range: 7-30)  
**And** provides tooltips explaining each indicator  
**And** shows preview of how changes affect current watchlist signals

#### Scenario: Setting entry criteria
**Given** the user views "Entry Criteria" section  
**Then** the system displays:
- Minimum Score slider (1-10, default: 7)
- Volume Threshold dropdown (50th, 75th, 90th percentile)
- Checkbox for "Require trend alignment"
- Checkbox for "Require volume confirmation"  
**And** provides "Test with Current Watchlist" button  
**When** clicked, simulates how many current watchlist items would trigger with new settings

#### Scenario: Resetting to defaults
**Given** the user has modified trading parameters  
**When** the user clicks "Reset to Defaults" button  
**Then** the system displays confirmation "Reset all trading parameters to system defaults?"  
**When** confirmed  
**Then** all values revert to original defaults  
**And** displays toast "Parameters reset to defaults"

---

### Requirement: SETTINGS-UI-003 - Position Sizing Configuration

The system shall allow configuration of risk per trade and stop loss methodology.

#### Scenario: Setting risk by signal score
**Given** the user views "Position Sizing" section  
**Then** the system displays inputs for:
- Risk for Score 7-8 (default: 1.0%, range: 0.5-2.0%)
- Risk for Score 9 (default: 1.5%, range: 0.5-2.5%)
- Risk for Score 10 (default: 2.0%, range: 0.5-3.0%)  
**And** validates Score10Risk ≥ Score9Risk ≥ Score7Risk  
**And** displays explanation: "Higher scores get more risk due to higher probability"

#### Scenario: Choosing stop loss method
**Given** the user views stop loss section  
**Then** the system provides radio options:
- ATR-based (with multiplier input, default: 2.0)
- Percentage (with % input)
- Technical (manual per trade)  
**When** user selects "ATR-based"  
**Then** multiplier input becomes enabled  
**And** displays calculator: "Example: VCB at 85,000 with ATR 2,500 → Stop at 80,000 (2.0 × 2,500)"

#### Scenario: Vietnam gap risk adjustment
**Given** the user views "Gap Risk Adjustment" section  
**Then** the system displays multiplier input (default: 3.0)  
**And** explains: "Vietnam stocks can hit floor/ceiling for multiple days. Multiplier accounts for worst-case gap-down scenario."  
**And** provides calculator showing effective risk with gap adjustment

---

### Requirement: SETTINGS-UI-004 - Portfolio Limits Configuration

The system shall enforce configurable portfolio-level risk limits.

#### Scenario: Setting maximum aggregate risk
**Given** the user views "Portfolio Limits" section  
**Then** the system displays input for "Maximum Aggregate Risk" (default: 6.0%, range: 3-10%)  
**And** explains: "Sum of all open position risks cannot exceed this value"  
**And** shows current aggregate risk level  
**And** warning if current open positions exceed new limit

#### Scenario: Setting position and sector limits
**Given** the user configures portfolio limits  
**Then** the system displays inputs for:
- Max Single Position (default: 25% of capital, range: 10-40%)
- Max Open Positions (default: 6, range: 3-10)
- Max Sector Exposure (default: 40%, range: 20-60%)  
**When** user attempts to set Max Single Position > 40%  
**Then** system displays warning "High single position risk not recommended"  
**And** requires confirmation checkbox "I understand the risk"

#### Scenario: Setting correlation limit
**Given** the user views correlation settings  
**Then** the system displays slider for "Max Correlation Between Positions" (default: 0.70, range: 0.50-0.90)  
**And** explains: "System warns if adding a position with correlation above this threshold"  
**And** provides "Test Current Portfolio" button showing current correlations

---

### Requirement: SETTINGS-UI-005 - Loss Limits Configuration

The system shall allow configuration of daily, weekly, and monthly loss limits with actions.

#### Scenario: Setting daily loss limits
**Given** the user views "Daily Loss Limits" section  
**Then** the system displays inputs for:
- Stop new trades at (default: -2.0% daily loss)
- Close all positions at (default: -3.0% daily loss)  
**And** validates "close all" threshold > "stop new trades" threshold  
**And** displays radio options for action:
- Lock trading (require manual override)
- Alert only
- Close all positions

#### Scenario: Configuring loss limit notifications
**Given** the user sets loss limits  
**Then** the system displays checkboxes for:
- Send alert email
- Send SMS (premium feature, grayed out if not available)
- Browser notification
- Sound alarm  
**When** limit is hit during trading  
**Then** all enabled notification methods activate

#### Scenario: Weekly and monthly limits
**Given** the user views loss limits section  
**Then** the system displays additional inputs:
- Weekly loss limit (default: -5.0%)
- Monthly loss limit (default: -10.0%)  
**And** these are tracked cumulatively  
**And** reset at start of new week/month  
**And** current period loss displays next to limit

---

### Requirement: SETTINGS-UI-006 - Notification Preferences

The system shall provide granular control over notification types and delivery methods.

#### Scenario: Configuring entry signal notifications
**Given** the user views "Notifications" tab  
**When** "Entry Signals" section loads  
**Then** the system displays checkboxes for score ranges:
- Score 9-10 (High conviction) - default ON
- Score 8-9 (Good opportunity) - default ON
- Score 7-8 (Acceptable) - default OFF  
**And** explains: "You'll be notified when signals in selected ranges are generated"

#### Scenario: Configuring exit signal notifications
**Given** the user views exit notifications section  
**Then** the system displays checkboxes for:
- Stop loss hit (default: ON)
- Target reached (default: ON)
- Time stop triggered (default: ON)
- Thesis invalidation (default: ON)  
**And** all defaulted to ON for risk management

#### Scenario: Configuring risk alert notifications
**Given** the user views risk alerts section  
**Then** the system displays checkboxes for:
- Aggregate risk > 5% (default: ON)
- Daily loss approaching limit (default: ON)
- Correlation warning (default: ON)
- Position size limit approaching (default: ON)

#### Scenario: Setting delivery methods
**Given** the user views "Delivery Methods" section  
**Then** the system displays checkboxes for:
- Browser notification (default: ON)
- Email (default: ON, requires email config)
- SMS (premium feature)
- Mobile push (future)  
**And** provides "Test Notification" button for each enabled method

#### Scenario: Configuring quiet hours
**Given** the user wants to avoid notifications at night  
**When** the user enables "Quiet Hours"  
**Then** the system displays time pickers for:
- From: (default: 22:00)
- To: (default: 07:00)  
**And** explains: "Only critical alerts (stop loss hit) will notify during quiet hours"  
**And** provides "Exceptions" list for alert types that bypass quiet hours

---

### Requirement: SETTINGS-UI-007 - Appearance Settings

The system shall allow customization of visual preferences.

#### Scenario: Theme selection (future)
**Given** the user views "Appearance" tab  
**Then** the system displays theme selector (currently only "Fintech Neon" available)  
**And** grays out other themes with "Coming Soon" label  
**And** future options: Light mode, Dark mode, Custom

#### Scenario: Display preferences
**Given** the user configures display  
**Then** the system provides toggles for:
- Compact mode (reduces spacing, fits more on screen)
- Show animations (smooth transitions and effects)
- High contrast (increases text contrast for accessibility)  
**When** user toggles "Compact mode"  
**Then** preview updates showing condensed layout  
**And** changes apply immediately without save

---

### Requirement: SETTINGS-UI-008 - Data & Privacy Settings

The system shall provide transparency and control over data storage and usage.

#### Scenario: Viewing storage usage
**Given** the user views "Data & Privacy" tab  
**When** the page loads  
**Then** the system displays storage usage breakdown:
- Trades: X MB / 5 MB limit
- Backtests: X MB / 2 MB limit
- Settings: X KB
- Chat history: X MB / 2 MB limit
- Total: X MB / 10 MB limit  
**And** provides progress bars for each category  
**And** highlights categories approaching limits (>80%) in yellow

#### Scenario: Exporting all data
**Given** the user wants to backup their data  
**When** the user clicks "Export All Data"  
**Then** the system packages all localStorage data into JSON file  
**And** triggers download: "trading-data-backup-YYYY-MM-DD.json"  
**And** displays success message

#### Scenario: Importing data
**Given** the user has a backup file  
**When** the user clicks "Import Data" and selects file  
**Then** the system validates file format  
**And** displays preview of data to be imported  
**And** warns: "This will overwrite existing data. Continue?"  
**When** confirmed, imports data and refreshes all contexts

#### Scenario: Clearing all data
**Given** the user wants to reset the system  
**When** the user clicks "Clear All Data"  
**Then** the system displays critical warning:
"⚠️ This will permanently delete:
- All trades and journal entries
- All backtest results
- All chat history
- All custom settings
This action CANNOT be undone. Export data first if needed."  
**And** requires typing "DELETE" to confirm  
**When** confirmed, clears all localStorage and reloads app

---

### Requirement: SETTINGS-UI-009 - Settings Persistence

The system shall automatically save settings to localStorage and apply changes to all features.

#### Scenario: Auto-saving settings
**Given** the user modifies any setting  
**When** the user clicks "Save Changes" button  
**Then** the system serializes all settings to JSON  
**And** saves to localStorage under key "settings:v1"  
**And** updates SettingsContext immediately  
**And** broadcasts change event to all feature components  
**And** displays success toast "Settings saved successfully"  
**And** marks form as clean (no unsaved changes)

#### Scenario: Settings validation before save
**Given** the user has modified settings  
**When** validation errors exist (e.g., Fast EMA > Slow EMA)  
**Then** "Save Changes" button is disabled  
**And** error messages display inline next to invalid fields  
**And** error summary appears at top of form

#### Scenario: Applying settings across features
**Given** the user changes "Fast EMA" from 20 to 25  
**When** settings are saved  
**Then** Dashboard immediately uses new EMA in calculations  
**And** Watchlist recalculates setups with new EMA  
**And** Signals regenerates with new parameters  
**And** Backtest default configuration updates  
**And** no page reload required

---

### Requirement: SETTINGS-UI-010 - Theme Compliance

The system shall strictly follow Fintech Neon theme design system.

#### Scenario: Settings visual elements follow theme
**Given** any settings screen element is rendered  
**Then** all backgrounds use theme variables (--bg, --panel, --panel-elevated)  
**And** all inputs use theme input styling (--panel bg, --border, focus --accent)  
**And** all text uses theme colors (--text, --text-secondary)  
**And** all buttons use accent color (--accent)  
**And** all spacing uses gap tokens  
**And** all cards use --radius-lg borders  
**And** all hover states include --glow-accent  
**And** section headers use --text-xl or --text-2xl  
**And** no emojis in production UI

---

### Requirement: SETTINGS-UI-011 - Mobile Responsive Layout

The system shall provide mobile-optimized settings interface.

#### Scenario: Settings on mobile (<768px)
**Given** the user accesses settings on mobile  
**Then** tab navigation converts to dropdown menu  
**And** all form sections stack vertically  
**And** number inputs have larger touch targets  
**And** sliders are thumb-friendly (minimum 44px touch target)  
**And** save button is sticky at bottom of viewport  
**And** sections collapse into accordions to reduce scrolling

---

## Non-Functional Requirements

### Performance
- Settings page loads <300ms
- Settings save operation <100ms
- Changes apply to contexts <200ms
- No page reload required for setting changes

### Validation
- All numerical inputs validated for ranges
- Interdependent settings cross-validated (e.g., EMA order)
- Dangerous settings require confirmation
- Invalid states prevent saving

### Accessibility
- All form inputs have labels and ARIA attributes
- Keyboard navigation fully supported
- Screen reader announces validation errors
- Focus management on error states

---

## Related Capabilities

- **All Phase 1 & 2 features**: Settings affect behavior across entire application
- **trading-parameters**: Dashboard, Watchlist, Signals use these values
- **risk-management**: Portfolio enforces these limits
- **notifications**: All features use notification preferences

---

## Future Enhancements (Out of Scope)

- Cloud settings sync across devices
- Settings versioning and rollback
- Team/shared settings (multi-user accounts)
- Advanced user mode with more parameters
- Settings presets/profiles (conservative, moderate, aggressive)
- A/B testing different settings combinations
- Machine learning parameter optimization suggestions
