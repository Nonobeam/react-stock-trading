# Spec Delta: Shared Component Library

## ADDED Requirements

### Requirement: System provide Button component`nThe system SHALL provide a reusable Button component with multiple variants following the Fintech Neon theme.

#### Scenario: Primary button rendering
GIVEN Button component with variant="primary"
WHEN button renders
THEN button displays:
- Background: var(--accent) (neon yellow-green)
- Text color: var(--bg) (dark)
- Border radius: var(--radius) (16px)
- Padding: 12px 24px
- Font weight: 600
- Hover state: background lightens to var(--accent-light)
- Active state: background darkens to var(--accent-dark)
- Transition: 200ms ease
- Cursor: pointer

#### Scenario: Disabled button state
GIVEN Button with disabled={true}
WHEN button renders
THEN button displays:
- Background: var(--muted)
- Text color: var(--text-secondary)
- Cursor: not-allowed
- Opacity: 0.5
- No hover effects
AND click events are prevented

### Requirement: System provide Card component`nThe system SHALL provide a Card component for consistent panel styling with elevation and hover effects.

#### Scenario: Standard card rendering
GIVEN Card component
WHEN card renders with default props
THEN card displays:
- Background: var(--panel) (#1e1f23)
- Border radius: var(--radius-lg) (20px)
- Padding: var(--gap-lg) (24px)
- Box shadow: var(--shadow)
- No border (borderless design per theme)

#### Scenario: Elevated card variant
GIVEN Card with variant="elevated"
WHEN card renders
THEN card displays:
- Background: var(--panel-elevated)
- Box shadow: var(--shadow-lg) (larger shadow)
- Subtle glow: var(--glow-accent) when hovered

### Requirement: System provide Table component`nThe system SHALL provide a data Table component with sorting, hover states, and action columns.

#### Scenario: Sortable table column
GIVEN Table with sortable column "Price"
AND initial sort is ascending
WHEN user clicks "Price" column header
THEN:
- Data re-sorts by price descending
- Header shows down arrow icon
- Transition animates row reordering (300ms)
WHEN user clicks "Price" header again
THEN:
- Data re-sorts by price ascending
- Header shows up arrow icon

#### Scenario: Row hover interaction
GIVEN Table with multiple rows
WHEN user hovers over a row
THEN row displays:
- Background changes to var(--panel-hover)
- Subtle elevation (shadow increases)
- Action buttons fade in on right side
- Transition: 200ms ease
- Cursor: pointer

### Requirement: System provide Badge component`nThe system SHALL provide a Badge component for status indicators, scores, and tags.

#### Scenario: Success badge rendering
GIVEN Badge with variant="success" and text="9/10"
WHEN badge renders
THEN badge displays:
- Background: var(--success) with 15% opacity
- Text color: var(--success) (solid)
- Border radius: var(--radius-sm) (8px)
- Padding: 4px 12px
- Font size: 14px
- Font weight: 600

#### Scenario: Dynamic badge color by score
GIVEN Badge with score={9}
WHEN component determines color
THEN:
- Score 9-10: variant="success" (green)
- Score 8: variant="warning" (amber)
- Score 7: variant="neutral" (gray)
- Score <7: variant="danger" (red)

### Requirement: System provide Modal component`nThe system SHALL provide a Modal component with backdrop, animations, and accessibility features.

#### Scenario: Modal open animation
GIVEN Modal component with isOpen={true}
WHEN modal renders
THEN modal displays:
- Backdrop: rgba(0,0,0,0.7) overlay with blur effect
- Modal panel: slides up from bottom (mobile) or fades in (desktop)
- Animation duration: 300ms
- Focus traps inside modal (tab navigation stays within)
- Escape key closes modal

#### Scenario: Modal close interaction
GIVEN open modal
WHEN user clicks backdrop OR presses Escape
THEN modal triggers onClose callback
AND modal animates out (reverse of open animation)
AND focus returns to trigger element

### Requirement: System provide LoadingSkeleton component`nThe system SHALL provide a LoadingSkeleton component for loading states that match content structure.

#### Scenario: Table loading skeleton
GIVEN Table with isLoading={true}
WHEN component renders loading state
THEN displays:
- 5 skeleton rows by default
- Each row has shimmer animation
- Skeleton matches table structure (same column widths)
- Shimmer gradient: from var(--panel) to var(--panel-elevated)
- Animation: 1.5s infinite pulse

### Requirement: System provide EmptyState component`nThe system SHALL provide an EmptyState component for when data collections are empty.

#### Scenario: Empty watchlist state
GIVEN EmptyState with type="watchlist"
WHEN component renders
THEN displays:
- Centered layout
- Icon: 📋 (large, 64px)
- Title: "Your watchlist is empty" (var(--text))
- Description: "Add stocks to monitor" (var(--text-secondary))
- Call-to-action button: "Add Your First Stock"
- Optional: Suggestion chips below button

## MODIFIED Requirements
None (new capability)

## REMOVED Requirements
None (new capability)

