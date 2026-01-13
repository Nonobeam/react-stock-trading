# Watchlist Management Spec

**Capability:** `watchlist-management`  
**Parent Change:** `enhance-dashboard-analytics`  
**Status:** Proposed

## ADDED Requirements

### Requirement: Watchlist Display
**ID:** `DASH-WATCH-001`  
**Priority:** High  
**Type:** Functional

The system SHALL display a watchlist panel showing tracked assets with current price, change percentage, and mini sparkline.

#### Scenario: Render watchlist with items
**Given** the user has 5 symbols in their watchlist: ["VNM", "VIC", "HPG", "VHM", "FPT"]  
**When** the dashboard loads  
**Then** the watchlist panel SHALL display:
- Header: "Watchlist" with item count "(5)"
- Each item SHALL show: symbol (bold), current price, % change, sparkline (60px×24px)
- Items SHALL be sorted by add date (newest first) by default
- Panel SHALL have `--panel` background with `--radius-lg` border radius
- **Panel padding: `var(--gap-lg)` (24px) on all sides**
- **Item spacing: `var(--gap-sm)` to `var(--gap-md)` (12-16px) between items**
- **Item padding: `var(--gap-md)` (16px) internal padding per item**
- Max height: 400px with vertical scroll when needed

#### Scenario: Show price update via WebSocket
**Given** "VNM" is in the watchlist with price $90,000  
**When** WebSocket receives price update: $90,500  
**Then** the watchlist item SHALL:
- Update price to "$90,500" within 100ms
- Animate price change with brief flash (green pulse, 300ms)
- Update % change to "+0.56%"
- Append data point to sparkline

#### Scenario: Display empty watchlist state
**Given** the watchlist is empty  
**When** the dashboard renders  
**Then** the panel SHALL show:
- Icon: Star outline in `--muted`
- Message: "No items in watchlist"
- Subtext: "Click + to add symbols you want to track"
- Add button: Prominent with `--accent` color

### Requirement: Add to Watchlist
**ID:** `DASH-WATCH-002`  
**Priority:** High  
**Type:** Functional

Users SHALL be able to add symbols to the watchlist with validation and duplicate prevention.

#### Scenario: Add valid symbol to watchlist
**Given** the watchlist has 3 items and the limit is 20  
**When** the user clicks the "+" button  
**Then** an input field SHALL appear with placeholder "Enter symbol (e.g., VNM)"  
**When** the user types "VIC" and presses Enter  
**Then** the system SHALL:
- Validate symbol format (3-4 uppercase letters)
- Check for duplicates (none found)
- Add "VIC" to watchlist with timestamp
- Save to LocalStorage under key 'trading-watchlist'
- Animate new item sliding in from top (250ms)
- Clear and hide input field

#### Scenario: Prevent duplicate symbol
**Given** "VNM" is already in the watchlist  
**When** the user attempts to add "VNM" again  
**Then** the system SHALL:
- Show inline error: "VNM is already in your watchlist"
- Not add the duplicate
- Highlight existing "VNM" item briefly (pulse animation)

#### Scenario: Enforce watchlist limit
**Given** the watchlist has 20 items (at limit)  
**When** the user clicks the "+" button  
**Then** the system SHALL:
- Disable the add functionality
- Show toast message: "Watchlist limit reached (20 items). Remove an item to add new ones."
- Keep button visible but disabled with reduced opacity

#### Scenario: Validate symbol format
**Given** the user is adding a symbol  
**When** the user enters "123" (invalid format)  
**Then** the system SHALL:
- Show inline error: "Invalid symbol format. Use 3-4 letters (e.g., VNM)"
- Prevent submission
- Keep input focused for correction

### Requirement: Remove from Watchlist
**ID:** `DASH-WATCH-003`  
**Priority:** High  
**Type:** Functional

Users SHALL be able to remove symbols from the watchlist with confirmation.

#### Scenario: Remove item with hover action
**Given** "HPG" is in the watchlist  
**When** the user hovers over the "HPG" item  
**Then** a remove button (× icon) SHALL appear on the right  
**When** the user clicks the × button  
**Then** the system SHALL:
- Animate item sliding out and fading (250ms)
- Remove "HPG" from watchlist array
- Update LocalStorage
- Show toast: "HPG removed from watchlist"

#### Scenario: Undo remove action
**Given** the user just removed "HPG"  
**When** the toast notification appears with "Undo" action  
**Then** clicking "Undo" SHALL:
- Re-add "HPG" to watchlist at original position
- Update LocalStorage
- Animate item sliding back in
- Dismiss toast

### Requirement: Favorite Toggle
**ID:** `DASH-WATCH-004`  
**Priority:** Medium  
**Type:** Functional

Users SHALL be able to mark watchlist items as favorites with visual distinction.

#### Scenario: Toggle favorite status
**Given** "VNM" is in the watchlist without favorite status  
**When** the user clicks the star icon next to "VNM"  
**Then** the star SHALL:
- Fill with `--accent` color
- Store isFavorite=true in LocalStorage
- Move "VNM" to top of list (favorites first)

**When** the user clicks the filled star again  
**Then** the star SHALL:
- Return to outline style
- Store isFavorite=false
- Resort list (favorites remain at top, others by add date)

### Requirement: Search and Filter
**ID:** `DASH-WATCH-005`  
**Priority:** Medium  
**Type:** Functional

Users SHALL be able to search/filter watchlist items by symbol.

#### Scenario: Filter watchlist by search query
**Given** the watchlist contains ["VNM", "VIC", "HPG", "VHM", "FPT"]  
**When** the user types "V" in the search input  
**Then** the list SHALL filter to show only:
- "VNM"
- "VIC"
- "VHM"
- Filter SHALL be case-insensitive
- Other items SHALL be hidden with smooth transition (200ms)

#### Scenario: Clear search to show all items
**Given** the search query is "V" with filtered results  
**When** the user clears the search input  
**Then** all 5 items SHALL reappear with slide-in animation

### Requirement: Mini Sparkline
**ID:** `DASH-WATCH-006`  
**Priority:** Medium  
**Type:** UI/UX

Each watchlist item SHALL display a mini sparkline chart showing recent price movement.

#### Scenario: Render sparkline with historical data
**Given** "VNM" has 20 price points: [89000, 89500, 90000, 90200, ...]  
**When** the watchlist item renders  
**Then** the sparkline SHALL:
- Display a line chart (60px width × 24px height)
- Use `--success` stroke if latest price > first price
- Use `--danger` stroke if latest price < first price
- Stroke width: 2px
- No axes, grid, or labels (minimal decoration)
- Smooth curve interpolation

#### Scenario: Update sparkline on price change
**Given** the sparkline has 20 data points  
**When** a new price arrives via WebSocket  
**Then** the system SHALL:
- Append new point to data array
- Remove oldest point (keep max 20 points)
- Re-render sparkline with smooth transition (150ms)

### Requirement: Persistent Storage
**ID:** `DASH-WATCH-007`  
**Priority:** High  
**Type:** Functional

Watchlist data SHALL persist across sessions using LocalStorage.

#### Scenario: Load watchlist on mount
**Given** LocalStorage contains watchlist data  
**When** the dashboard component mounts  
**Then** the system SHALL:
- Read from LocalStorage key 'trading-watchlist'
- Parse JSON array of WatchlistItem objects
- Validate data structure
- Render items in the panel

#### Scenario: Save watchlist on changes
**Given** the user adds "VIC" to the watchlist  
**When** the add operation completes  
**Then** the system SHALL:
- Serialize updated watchlist array to JSON
- Write to LocalStorage key 'trading-watchlist'
- Handle storage quota errors gracefully

#### Scenario: Handle corrupted storage data
**Given** LocalStorage contains invalid JSON for watchlist  
**When** the dashboard attempts to load  
**Then** the system SHALL:
- Catch parse error
- Log warning to console
- Initialize empty watchlist
- Continue normal operation

---

## Related Capabilities
- `market-data-integration` (provides real-time prices via WebSocket)
- `dashboard-theme-compliance` (colors, spacing, transitions)
- **`ui-spacing-compliance` (enforces spacing rules for watchlist items and panel)**
