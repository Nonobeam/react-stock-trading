# Capability: Stock Preferences Management

**Capability ID:** `stock-preferences`  
**Status:** Draft  
**Related Change:** `add-stock-preferences-ui`

## Overview

The Stock Preferences capability allows users to configure per-stock minimum signal score thresholds and notes. This enables traders to require different signal quality levels for different stocks based on their trading strategy.

---

## ADDED Requirements

### Requirement: STOCKPREF-UI-001 - Preferences Table Display SHALL Display All Preferences

The system SHALL display all configured stock preferences in a sortable table within the Settings view.

**Acceptance Criteria:**
- Table displays columns: Symbol, Min Score, Notes, Actions
- Table is sortable by Symbol and Min Score
- Score displays with visual indicator (badge with color based on score level)
- Actions include Edit and Delete buttons

#### Scenario: View existing preferences

**Given** the user has configured stock preferences  
**When** the user navigates to Settings → Stock Preferences  
**Then** a table displays all preferences with Symbol, Min Score, Notes, and Actions columns  
**And** the table is sorted by symbol alphabetically by default

#### Scenario: Empty preferences state

**Given** the user has no configured stock preferences  
**When** the user navigates to Settings → Stock Preferences  
**Then** an empty state message is shown with guidance text  
**And** a call-to-action button to add the first preference is displayed

---

### Requirement: STOCKPREF-UI-002 - System SHALL Allow Adding Stock Preferences

The system SHALL allow users to add a new stock preference via a modal form.

**Acceptance Criteria:**
- Modal contains fields: Symbol (required), Min Score (required, 1-10), Notes (optional, max 200 chars)
- Symbol is validated as uppercase alphanumeric, 1-10 characters
- Duplicate symbols are prevented with validation error
- Save button calls PUT API and refreshes list on success
- Cancel button closes modal without changes

#### Scenario: Add valid preference

**Given** the user is on the Stock Preferences tab  
**When** the user clicks "Add Stock Preference"  
**And** enters Symbol "VNM", Min Score 9, Notes "Blue chip, need strong signals"  
**And** clicks Save  
**Then** the preference is saved via PUT `/api/preferences/stocks/VNM`  
**And** the modal closes  
**And** the preferences table shows the new entry

#### Scenario: Validation error on invalid symbol

**Given** the user has opened the Add Preference modal  
**When** the user enters Symbol "vnm123!" (invalid characters)  
**And** attempts to save  
**Then** a validation error is shown: "Enter a valid stock symbol (1-10 uppercase letters)"  
**And** the modal remains open

#### Scenario: Validation error on invalid score

**Given** the user has opened the Add Preference modal  
**When** the user enters Symbol "VNM" and Min Score 15  
**And** attempts to save  
**Then** a validation error is shown: "Score must be between 1 and 10"  
**And** the modal remains open

---

### Requirement: STOCKPREF-UI-003 - System SHALL Allow Editing Stock Preferences

The system SHALL allow users to edit an existing stock preference.

**Acceptance Criteria:**
- Edit action opens modal pre-filled with current values
- Symbol field is read-only (cannot change the stock)
- Min Score and Notes are editable
- Save updates preference via PUT API
- Changes reflect immediately in table

#### Scenario: Edit existing preference

**Given** the user has a preference for "VNM" with Min Score 9  
**When** the user clicks Edit on the VNM row  
**And** changes Min Score to 8  
**And** clicks Save  
**Then** the preference is updated via PUT `/api/preferences/stocks/VNM`  
**And** the table shows Min Score as 8

---

### Requirement: STOCKPREF-UI-004 - System SHALL Allow Deleting Stock Preferences

The system SHALL allow users to delete a stock preference with confirmation.

**Acceptance Criteria:**
- Delete action shows confirmation dialog
- Confirmation includes the stock symbol for clarity
- Confirming deletes via DELETE API
- Row is removed from table on success
- Canceling closes dialog without changes

#### Scenario: Delete preference with confirmation

**Given** the user has a preference for "VNM"  
**When** the user clicks Delete on the VNM row  
**Then** a confirmation dialog appears asking "Delete preference for VNM?"  
**When** the user confirms  
**Then** DELETE `/api/preferences/stocks/VNM` is called  
**And** the VNM row is removed from the table

#### Scenario: Cancel delete operation

**Given** the user has clicked Delete on a preference  
**When** the user clicks Cancel on the confirmation dialog  
**Then** the dialog closes  
**And** the preference remains unchanged

---

### Requirement: STOCKPREF-UI-005 - System SHALL Support Search and Filter

The system SHALL allow users to search/filter preferences by symbol.

**Acceptance Criteria:**
- Search input in header filters table in real-time
- Filter is case-insensitive
- Partial matches are supported (e.g., "VN" matches "VNM", "VNINDEX")
- Empty search shows all preferences

#### Scenario: Filter by symbol

**Given** the user has preferences for VNM, FPT, and VIC  
**When** the user types "V" in the search input  
**Then** only VNM and VIC are shown in the table  
**And** FPT is hidden

#### Scenario: Clear search

**Given** the user has filtered the table  
**When** the user clears the search input  
**Then** all preferences are shown

---

### Requirement: STOCKPREF-UI-006 - System SHALL Display Loading States

The system SHALL display appropriate loading indicators during API operations.

**Acceptance Criteria:**
- Initial page load shows skeleton loader
- Save/Update shows spinner on submit button
- Delete shows loading state on action
- All buttons disabled during loading

#### Scenario: Initial load

**Given** the user navigates to Stock Preferences  
**When** the API is fetching data  
**Then** a skeleton loader is displayed  
**When** data loads successfully  
**Then** the table is displayed with preferences

---

### Requirement: STOCKPREF-UI-007 - System SHALL Handle Errors Gracefully

The system SHALL handle API errors gracefully with actionable feedback.

**Acceptance Criteria:**
- Fetch errors show error banner with Retry button
- Save errors show inline error in modal (modal stays open)
- Delete errors show error message and restore row
- Network offline disables actions with indicator

#### Scenario: Handle fetch error

**Given** the preferences API returns an error  
**When** the user is on the Stock Preferences tab  
**Then** an error banner is shown with the error message  
**And** a Retry button is available

#### Scenario: Handle save error

**Given** the user is saving a new preference  
**When** the API returns an error  
**Then** the modal remains open  
**And** an error message is displayed in the modal  
**And** the user can modify and retry

---

### Requirement: STOCKPREF-UI-008 - UI MUST Follow Fintech Neon Theme

The Stock Preferences UI MUST follow the Fintech Neon design system.

**Acceptance Criteria:**
- Uses theme color variables for all colors
- Follows spacing system (8px base)
- Uses theme-compliant components (Button, Modal, Badge, Table)
- Hover/focus states include glow effects
- Transitions follow theme timing (200-350ms)

#### Scenario: Visual consistency

**Given** the user is viewing the Stock Preferences tab  
**Then** the UI uses consistent colors from `docs/FINTECH_NEON_THEME.md`  
**And** score badges use color variants (success for 8+, warning for 5-7, neutral for 1-4)  
**And** primary action buttons use accent color (`--accent`)  
**And** delete buttons use danger color (`--danger`)

---

## Related Capabilities

- **settings-screen** (Phase 2): Stock Preferences is a new tab within Settings
- **signal-filtering** (future): Stock preferences affect which signals are displayed

## API Dependencies

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/preferences/stocks` | GET | List all preferences |
| `/api/preferences/stocks/:symbol` | GET | Get single preference |
| `/api/preferences/stocks/:symbol` | PUT | Create/update preference |
| `/api/preferences/stocks/:symbol` | DELETE | Remove preference |
