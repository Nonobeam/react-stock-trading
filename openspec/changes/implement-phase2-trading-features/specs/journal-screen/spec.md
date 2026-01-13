# Specification: Journal Screen

**Capability**: `journal-screen`  
**Status**: New  
**Related Changes**: `implement-phase2-trading-features`

## Overview

The Journal Screen provides comprehensive trade logging, performance tracking, and learning capabilities. Traders can log trades (manual or system-generated), analyze performance metrics, review past trades with annotated charts, and extract lessons to improve their trading.

## ADDED Requirements

### Requirement: JOURNAL-UI-001 - Trade List View

The system shall display a comprehensive list of all logged trades with filtering and search capabilities.

#### Scenario: Viewing all trades in chronological order
**Given** the user has logged multiple trades  
**When** the user navigates to the Journal screen  
**Then** the system displays all trades in a list sorted by date (most recent first)  
**And** each trade shows symbol, entry date, P/L amount, R-multiple, and days held  
**And** winning trades display with green indicator  
**And** losing trades display with red indicator

#### Scenario: Filtering trades by category
**Given** the user is viewing the trade list  
**When** the user clicks "Tagged" filter  
**Then** the system displays only trades with user-assigned tags  
**When** the user clicks "Favorites" filter  
**Then** the system displays only trades marked as favorites  
**When** the user clicks "Case Studies" filter  
**Then** the system displays only trades marked as case studies

#### Scenario: Searching trades by symbol or criteria
**Given** the user is viewing the trade list  
**When** the user enters "VCB" in the search field  
**Then** the system filters the list to show only VCB trades  
**When** the user selects "Date range" filter  
**Then** the system allows selection of start and end dates  
**And** displays only trades within the selected range

---

### Requirement: JOURNAL-UI-002 - Trade Detail View

The system shall provide detailed trade analysis in a multi-tab interface when a trade is selected.

#### Scenario: Viewing trade overview details
**Given** the user has selected a trade from the list  
**When** the trade detail panel opens with "Overview" tab active  
**Then** the system displays entry details (date, time, price, shares, value)  
**And** displays exit details (date, time, price, reason) if trade is closed  
**And** displays setup information (type, score, market regime, sector)  
**And** displays financial outcome with Vietnam-specific calculations:
- Entry commission (0.25% of entry value, min 500 VND)
- Exit commission (0.25% of exit value, min 500 VND)  
- Exit tax (0.1% of exit value)
- Gross P/L and Net P/L in VND and percentage
- R-multiple calculation  
**And** displays execution quality score (0-10) if available  
**And** displays all user-assigned tags

#### Scenario: Viewing trade chart analysis
**Given** the user is viewing a closed trade detail  
**When** the user clicks the "Chart" tab  
**Then** the system displays an annotated price chart showing:
- 30 days before entry to 30 days after exit
- Entry point marked with green arrow and label
- Stop loss level as horizontal red dashed line
- Target levels (T1, T2, T3) as horizontal blue dashed lines
- Exit point marked with arrow (green if profit, red if loss)
- 20 EMA and 50 EMA overlaid
- Volume bars below price chart
- Annotations for key events (e.g., "Maximum favorable: 94,200")  
**And** provides full-screen chart option  
**And** provides download chart as image option

#### Scenario: Viewing trade performance analysis
**Given** the user is viewing a closed trade detail  
**When** the user clicks the "Analysis" tab  
**Then** the system displays performance metrics:
- Max Favorable Excursion (MFE) in VND, %, and R-multiple
- Max Adverse Excursion (MAE) in VND, %, and R-multiple
- Days from entry to MFE and MAE  
**And** displays comparison to similar trades (same setup type)  
**And** shows average performance for that setup type  
**And** identifies whether trade performed above/below average  
**And** displays correlation analysis with concurrent positions

#### Scenario: Viewing and editing trade notes
**Given** the user is viewing trade detail  
**When** the user clicks the "Notes" tab  
**Then** the system displays three note sections:
- Pre-trade notes (entered before opening position)
- During-trade notes (journal entries while position open)
- Post-trade notes (reflection after closing)  
**And** each section has editable text areas  
**And** provides prompts for structured reflection:
- "Why am I entering this trade?"
- "What could go wrong?"
- "What went right?"
- "What went wrong?"
- "What did I learn?"
- "Would I take this trade again?"  
**When** the user saves notes  
**Then** the system persists notes to localStorage  
**And** updates the trade's "updatedAt" timestamp

#### Scenario: Viewing AI-generated lessons
**Given** the user is viewing a closed trade detail  
**When** the user clicks the "Lessons" tab  
**Then** the system displays AI-generated insights based on:
- Trade outcome vs user's historical performance
- Pattern recognition (e.g., "6th winning pullback in a row")
- Identified mistakes or excellent executions
- Behavioral patterns (e.g., cutting winners early)  
**And** each lesson includes an actionable recommendation  
**And** provides option to add lesson to trading rules checklist

---

### Requirement: JOURNAL-UI-003 - Manual Trade Entry

The system shall allow users to manually log historical trades not captured by the system.

#### Scenario: Adding a historical trade manually
**Given** the user clicks "Add Manual Entry" button  
**When** the manual entry form opens  
**Then** the system displays input fields for:
- Symbol (required, text input with autocomplete)
- Entry date and time (required, date/time pickers)
- Entry price (required, number input in VND)
- Number of shares (required, positive integer)
- Exit date and time (optional for open positions)
- Exit price (optional)
- Setup type (dropdown: pullback-20ema, pullback-50ema, breakout, etc.)
- Stop loss price (number input)
- Exit reason (dropdown if exited: target, stop, time, thesis-invalidated, manual)
- Notes (optional, textarea)  
**When** the user clicks "Calculate P/L"  
**Then** the system automatically calculates:
- Entry commission (0.25%, min 500 VND)
- Exit commission (0.25%, min 500 VND)
- Exit tax (0.1% on exit value)
- Gross P/L
- Net P/L
- P/L percentage
- R-multiple (if stop price provided)  
**When** the user clicks "Save Trade"  
**Then** the system validates all required fields  
**And** saves the trade to localStorage  
**And** adds trade to the main trade list  
**And** closes the manual entry form

#### Scenario: Validation errors on manual entry
**Given** the user is filling the manual entry form  
**When** the user enters an entry price of 0 or negative  
**Then** the system displays error "Entry price must be greater than 0"  
**When** the user enters an exit price lower than entry for a winning trade designation  
**Then** the system displays warning "Exit price is lower than entry - verify this is correct"  
**When** the user attempts to save with missing required fields  
**Then** the system highlights missing fields with red borders  
**And** displays error message listing required fields

---

### Requirement: JOURNAL-UI-004 - Trade Tagging and Organization

The system shall allow users to organize trades with tags, favorites, and case study designations.

#### Scenario: Adding tags to a trade
**Given** the user is viewing trade detail  
**When** the user clicks "Add Tag" button  
**Then** the system displays tag input with autocomplete from existing tags  
**When** the user types a new tag and presses Enter  
**Then** the system adds the tag to the trade  
**And** displays the tag as a badge below trade details  
**When** the user clicks the "×" on a tag badge  
**Then** the system removes the tag from the trade

#### Scenario: Marking trade as favorite
**Given** the user is viewing trade detail  
**When** the user clicks the star icon  
**Then** the system marks the trade as favorite  
**And** the star icon changes to filled/highlighted state  
**And** the trade appears in the "Favorites" filtered view

#### Scenario: Designating trade as case study
**Given** the user is viewing a significant trade (big win or instructive loss)  
**When** the user clicks "Add to Case Study" button  
**Then** the system marks the trade as a case study  
**And** the trade appears in the "Case Studies" filtered view  
**And** displays a special "Case Study" badge on the trade card

---

### Requirement: JOURNAL-UI-005 - Performance Summary Dashboard

The system shall display aggregate performance metrics for all logged trades.

#### Scenario: Viewing overall performance statistics
**Given** the user has multiple logged trades  
**When** the user views the Journal screen  **Then** the system displays a summary panel with:
- Total trades count (open + closed)
- Win rate percentage (wins / total closed trades)
- Total net P/L in VND and percentage
- Average R-multiple across all trades
- Best trade (highest R-multiple) with symbol and date
- Worst trade (lowest R-multiple) with symbol and date  
**And** updates metrics in real-time as trades are added/edited

#### Scenario: Filtering performance by date range
**Given** the user wants to analyze a specific period  
**When** the user selects "This Month" date filter  
**Then** the system recalculates all metrics for trades within current month  
**When** the user selects "Last Quarter"  
**Then** the system shows metrics for previous 3-month period  
**When** the user selects "Custom Range"  
**Then** the system allows date picker selection  
**And** updates metrics for the selected range

---

### Requirement: JOURNAL-UI-006 - Trade Export Functionality

The system shall allow users to export trade history for external analysis or record-keeping.

#### Scenario: Exporting all trades to CSV
**Given** the user has logged trades  
**When** the user clicks "Export Journal" button  
**Then** the system generates a CSV file containing:
- All trade fields (symbol, dates, prices, P/L, etc.)
- One row per trade with column headers  
**And** triggers browser download with filename "trading-journal-YYYY-MM-DD.csv"  
**And** displays success toast "Journal exported successfully"

#### Scenario: Exporting filtered subset of trades
**Given** the user has applied filters (e.g., "Tagged" or date range)  
**When** the user clicks "Export Journal"  
**Then** the system exports only the currently filtered trades  
**And** includes filter criteria in the filename (e.g., "trading-journal-VCB-2025.csv")

---

### Requirement: JOURNAL-UI-007 - Responsive Mobile Layout

The system shall provide a mobile-optimized layout for journal access on smaller devices.

#### Scenario: Viewing journal on mobile device (<768px width)
**Given** the user accesses the journal on a mobile device  
**When** the page loads  
**Then** the system displays trades as vertical card stack (no table)  
**And** each trade card shows: symbol, date, P/L, R-multiple, status badge  
**When** the user taps a trade card  
**Then** the system opens trade detail in full-screen overlay  
**And** provides swipe gestures to navigate between trades  
**And** summary metrics collapse into scrollable horizontal row

---

### Requirement: JOURNAL-UI-008 - Data Persistence and Limits

The system shall persist all trade data to browser localStorage with appropriate limits and warnings.

#### Scenario: Saving trades to localStorage
**Given** a user adds or edits a trade  
**When** the save action completes  
**Then** the system serializes the trade object to JSON  
**And** stores it in localStorage under key "trades:v1"  
**And** includes timestamp for sync tracking

#### Scenario: Approaching storage limits
**Given** the user has logged 450 trades (approaching 500 limit)  
**When** the user adds a new trade  
**Then** the system displays a warning banner:
"You're approaching the 500-trade limit (450/500). Consider exporting old trades or archiving them."  
**And** provides "Export Old Trades" button

#### Scenario: Exceeding storage limits
**Given** localStorage is at 95% capacity  
**When** the user attempts to save a trade  **Then** the system displays error modal:
"Cannot save trade - storage limit reached. Please export and delete old trades to free space."  
**And** provides "Export All" and "View Oldest Trades" options  
**And** does not save the new trade until space is available

---

### Requirement: JOURNAL-UI-009 - Theme Compliance

The system shall strictly adhere to the Fintech Neon theme design system for all journal components.

#### Scenario: Journal visual elements follow theme
**Given** the user views any journal screen or component  
**Then** all background colors use theme variables (--bg, --panel, --panel-elevated)  
**And** all text colors use theme variables (--text, --text-secondary, --muted)  
**And** all accent colors use --accent (#dadd56)  
**And** all spacing uses gap tokens (--gap-xs to --gap-2xl)  
**And** all border radius uses radius tokens (--radius, --radius-lg, etc.)  
**And** all shadows use shadow tokens (--shadow, --shadow-lg, etc.)  
**And** profit indicators use --success (#4ade80)  
**And** loss indicators use --danger (#ef4444)  
**And** all interactive elements have hover states with --glow-accent  
**And** no emojis appear in production UI  
**And** typography uses scale tokens (--text-base, --text-lg, etc.)

#### Scenario: Trade cards have neon theme styling
**Given** a trade card is displayed  
**Then** the card background is --panel  
**And** hover state changes background to --panel-hover  
**And** hover state adds --glow-accent shadow  
**And** border is --border with --radius-lg  
**And** winning trade has subtle green accent (--success with 15% opacity background)  
**And** losing trade has subtle red accent (--danger with 15% opacity background)

---

### Requirement: JOURNAL-UI-010 - Integration with Existing Features

The system shall integrate seamlessly with Phase 1 features (Portfolio, Dashboard, Signals).

#### Scenario: Creating journal entry from closed position
**Given** the user closes a position in the Portfolio screen  
**When** the position status changes to "closed"  
**Then** the system automatically creates a journal entry with:
- All position data (entry/exit prices, dates, shares)
- Setup type if available from signal
- Calculated Vietnam financials  
**And** the user can later add notes and tags to the generated entry

#### Scenario: Navigating from portfolio to journal
**Given** the user is viewing a closed position in Portfolio  
**When** the user clicks "View in Journal" button  
**Then** the system navigates to Journal screen  
**And** opens the corresponding trade detail automatically  
**And** highlights the trade in the list

#### Scenario: Linking journal trade to original signal
**Given** a trade was initiated from a system signal  
**When** the user views the trade in Journal  
**Then** the system displays "Original Signal" section showing:
- Signal generation date and time
- Signal score at entry
- Setup description from signal  
**And** provides "View Original Signal" link to Signals screen

---

## Non-Functional Requirements

### Performance
- Trade list should render <300ms for up to 500 trades
- Search/filter operations should complete <100ms
- Chart rendering should complete <500ms
- Manual trade entry form should open <200ms

### Accessibility
- All interactive elements keyboard navigable
- ARIA labels on all form inputs
- Color contrast ratios meet WCAG AA standards (already satisfied by Fintech Neon theme)
- Screen reader support for trade status and P/L announcements

### Browser Compatibility
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Data Integrity
- All Vietnam financial calculations must be accurate to the VND (no rounding errors)
- Trade timestamps must preserve timezone information
- Data validation prevents impossible states (e.g., exit before entry)

---

## Related Capabilities

- **portfolio-screen** (Phase 1): Source of position data for journal entries
- **ai-coach-screen** (Phase 2): Consumes journal data for performance analysis
- **backtest-lab-screen** (Phase 2): Compares live trade performance to backtests
- **settings-screen** (Phase 2): Journal display preferences

---

## Future Enhancements (Out of Scope)

- Cloud sync across devices
- Collaborative journal sharing
- Automated trade import from SSI API
- PDF report generation
- Trade screenshots/attachments
- Voice note recording
- Integration with trading psychology apps
