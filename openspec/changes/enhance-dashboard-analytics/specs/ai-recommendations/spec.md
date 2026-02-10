# AI Recommendations Spec

**Capability:** `ai-recommendations`  
**Parent Change:** `enhance-dashboard-analytics`  
**Status:** Proposed

## ADDED Requirements

### Requirement: Recommendation Button
**ID:** `DASH-REC-001`  
**Priority:** High  
**Type:** Functional

The system SHALL display a prominent recommendation button that triggers AI-powered trade suggestions.

#### Scenario: Display recommendation button
**Given** the dashboard is loaded  
**When** the summary stats section renders  
**Then** a button SHALL appear with:
- Label: "Get AI Recommendation"
- Background: `--accent` (#dadd56)
- Text color: `--bg` (high contrast)
- Border radius: `--radius` (16px)
- Padding: `--gap-sm` `--gap-lg` (12px 24px)
- Hover effect: `--glow-accent` shadow with scale(1.02)
- Position: Below summary stats, above watchlist

#### Scenario: Trigger recommendation request
**Given** the recommendation button is displayed  
**When** the user clicks the button  
**Then** the system SHALL:
- Disable button immediately
- Change label to "Generating..." with spinner icon
- Send POST request to `/api/recommendations`
- Set timeout of 10 seconds
- Show loading state with pulse animation

### Requirement: Loading State
**ID:** `DASH-REC-002`  
**Priority:** Medium  
**Type:** UI/UX

The button SHALL display a loading state while the recommendation request is processing.

#### Scenario: Show loading spinner
**Given** the user has clicked the recommendation button  
**When** the API request is in progress  
**Then** the button SHALL:
- Replace sparkle icon with spinning loader
- Change text to "Generating recommendation..."
- Disable pointer events (non-clickable)
- Show animated spinner (1s rotation, infinite)
- Maintain button dimensions (no layout shift)

#### Scenario: Handle timeout
**Given** the recommendation request has been processing for 10 seconds  
**When** the timeout threshold is reached  
**Then** the system SHALL:
- Cancel the pending request
- Show error toast: "Request timed out. Please try again."
- Re-enable button with original state
- Log timeout event to console

### Requirement: Recommendation Modal
**ID:** `DASH-REC-003`  
**Priority:** High  
**Type:** Functional

The system SHALL display a modal with AI recommendation details including symbol, action, confidence, and rationale.

#### Scenario: Display recommendation result
**Given** the API returns recommendation: {symbol: "VNM", action: "buy", confidence: 78, rationale: "Strong momentum..."}  
**When** the response is received  
**Then** a modal SHALL appear with:
- Glass morphism overlay (`--glass-bg` with `--glass-blur`)
- Centered modal (max-width: 500px, `--panel-elevated` background)
- Header: "AI Recommendation" with close button (×)
- Content:
  - Symbol badge: "VNM" (large, `--accent` background)
  - Action pill: "BUY" (green background, `--success`)
  - Confidence bar: 78% (gradient from `--danger` to `--success`)
  - Rationale text: Multi-line paragraph with `--text-secondary`
- Footer: "Add to Watchlist" button + "Dismiss" button

#### Scenario: Display action-specific styling
**Given** the recommendation action is "sell"  
**When** the modal renders  
**Then** the action pill SHALL:
- Display "SELL" text
- Use `--danger` background (#ef4444)
- Show downward arrow icon

**Given** the recommendation action is "hold"  
**When** the modal renders  
**Then** the action pill SHALL:
- Display "HOLD" text
- Use `--warning` background (#fbbf24)
- Show horizontal dash icon

#### Scenario: Show confidence visualization
**Given** the recommendation has 85% confidence  
**When** the modal content renders  
**Then** the confidence indicator SHALL:
- Display horizontal bar (100% width container)
- Fill 85% width with gradient (red→yellow→green)
- Show percentage label: "85% Confidence"
- Animate fill from 0% to 85% over 500ms on modal open

### Requirement: Modal Interactions
**ID:** `DASH-REC-004`  
**Priority:** High  
**Type:** UI/UX

Users SHALL be able to close the modal, add symbol to watchlist, or dismiss the recommendation.

#### Scenario: Close modal with × button
**Given** the recommendation modal is open  
**When** the user clicks the × button in the header  
**Then** the modal SHALL:
- Fade out over 250ms
- Scale down to 95% (exit animation)
- Remove from DOM after animation
- Re-enable body scroll
- Return focus to recommendation button

#### Scenario: Close modal with Escape key
**Given** the recommendation modal is open and focused  
**When** the user presses the Escape key  
**Then** the modal SHALL close with same animation as × button

#### Scenario: Close modal by clicking backdrop
**Given** the recommendation modal is open  
**When** the user clicks outside the modal (on glass overlay)  
**Then** the modal SHALL close with animation

#### Scenario: Add recommendation to watchlist
**Given** the modal shows recommendation for "VNM"  
**When** the user clicks "Add to Watchlist" button  
**Then** the system SHALL:
- Add "VNM" to watchlist (if not already present)
- Show success toast: "VNM added to watchlist"
- Close modal automatically
- Scroll to watchlist panel and highlight new item

#### Scenario: Prevent duplicate watchlist addition
**Given** "VNM" is already in the watchlist  
**When** the user clicks "Add to Watchlist"  
**Then** the button SHALL:
- Change to disabled state
- Show tooltip: "Already in watchlist"
- Not attempt to add duplicate

### Requirement: Error Handling
**ID:** `DASH-REC-005`  
**Priority:** High  
**Type:** Functional

The system SHALL handle API errors gracefully with user-friendly messages and retry options.

#### Scenario: Handle network error
**Given** the user is offline  
**When** the recommendation button is clicked  
**Then** the system SHALL:
- Detect network unavailability
- Show error toast: "No internet connection. Please check your network."
- Re-enable button immediately
- Log error to console

#### Scenario: Handle API error response
**Given** the API returns 500 Internal Server Error  
**When** the response is received  
**Then** the system SHALL:
- Show modal with error state
- Display message: "Unable to generate recommendation. Please try again."
- Provide "Retry" button in modal
- Provide "Cancel" button to close
- Log error details to console

#### Scenario: Retry failed request
**Given** the error modal is displayed  
**When** the user clicks "Retry"  
**Then** the system SHALL:
- Close error modal
- Re-enable loading state on button
- Send new API request
- Reset timeout counter

### Requirement: Mock API (Phase 1)
**ID:** `DASH-REC-006`  
**Priority:** High  
**Type:** Implementation

For Phase 1, the system SHALL use a mock API response to simulate recommendation generation.

#### Scenario: Return mock recommendation after delay
**Given** the recommendation API endpoint is not yet implemented  
**When** the button is clicked  
**Then** the system SHALL:
- Wait 1.5 seconds (simulate network delay)
- Return hardcoded response:
  ```json
  {
    "symbol": "VNM",
    "action": "buy",
    "confidence": 78,
    "rationale": "Technical indicators show bullish divergence with increasing volume. Market regime supports upward movement.",
    "targetPrice": 92500,
    "stopLoss": 86000
  }
  ```
- Display in modal as if from real API

#### Scenario: Randomly vary mock responses
**Given** multiple recommendation requests  
**When** the mock API is called  
**Then** it SHALL:
- Rotate through 3-4 different symbols ["VNM", "VIC", "HPG"]
- Vary actions ["buy", "sell", "hold"]
- Generate confidence: random(65-95)
- Use template rationales with symbol substitution

### Requirement: Accessibility
**ID:** `DASH-REC-007`  
**Priority:** Medium  
**Type:** Accessibility

The recommendation feature SHALL be fully accessible via keyboard and screen readers.

#### Scenario: Keyboard navigation in modal
**Given** the recommendation modal is open  
**When** the user presses Tab  
**Then** focus SHALL move through elements in order:
1. Close button (×)
2. "Add to Watchlist" button
3. "Dismiss" button
4. Back to close button (loop)

#### Scenario: Screen reader announcements
**Given** a screen reader is active  
**When** the modal opens  
**Then** the screen reader SHALL announce:
- "Dialog opened: AI Recommendation"
- Read symbol: "V N M"
- Read action: "Buy recommendation"
- Read confidence: "78 percent confidence"
- Read rationale text

#### Scenario: Focus management
**Given** the recommendation modal opens  
**When** the modal appears  
**Then** focus SHALL automatically move to the close button (×)  
**When** the modal closes  
**Then** focus SHALL return to the "Get AI Recommendation" button

---

## Related Capabilities
- `watchlist-management` (add recommendation symbol to watchlist)
- `dashboard-theme-compliance` (glass effect, colors, animations)
