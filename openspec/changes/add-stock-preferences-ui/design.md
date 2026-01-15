# Design: Add Stock Preferences UI

**Change ID:** `add-stock-preferences-ui`  
**Last Updated:** January 15, 2026

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         Settings View                            │
├─────────────────────────────────────────────────────────────────┤
│ [Trading] [Position] [Portfolio] [Risk] [Stock Prefs] [...]    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │              StockPreferencesSettings                       │ │
│  │  ┌─────────────────────────────────────────────────────┐   │ │
│  │  │ [+ Add Stock Preference]          [Search: ____]    │   │ │
│  │  └─────────────────────────────────────────────────────┘   │ │
│  │                                                             │ │
│  │  ┌─────────────────────────────────────────────────────┐   │ │
│  │  │  Symbol  │ Min Score │ Notes           │ Actions    │   │ │
│  │  ├─────────────────────────────────────────────────────┤   │ │
│  │  │  VNM    │    9      │ Blue chip, need  │ ✏️ 🗑️     │   │ │
│  │  │  FPT    │    8      │ Tech growth      │ ✏️ 🗑️     │   │ │
│  │  │  VIC    │    9      │ Large cap        │ ✏️ 🗑️     │   │ │
│  │  └─────────────────────────────────────────────────────┘   │ │
│  │                                                             │ │
│  │  [Empty State: "No stock preferences configured"]          │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Component Hierarchy

```
SettingsView.tsx (existing)
├── TabNavigation (add "Stock Preferences" tab)
└── StockPreferencesSettings.tsx (NEW)
    ├── Header with Add button and Search
    ├── PreferencesTable
    │   └── PreferenceRow (per stock)
    ├── EmptyState (when no preferences)
    ├── AddPreferenceModal
    └── EditPreferenceModal (or inline editing)
```

## Data Flow

```
┌──────────────────┐     ┌───────────────────┐     ┌─────────────────┐
│  UI Components   │────▶│ preferencesApi.ts │────▶│ Backend API     │
│                  │◀────│                   │◀────│                 │
└──────────────────┘     └───────────────────┘     └─────────────────┘
         │                                                  │
         │              Local State                         │
         └─────────────▶ (useState)                         │
                        ─ preferences[]                     │
                        ─ isLoading                         │
                        ─ error                             │
```

## API Integration

### Type Definitions

```typescript
// src/shared/types/preferences.ts

export interface StockPreference {
  symbol: string;
  min_signal_score: number;  // 1-10
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface StockPreferencesResponse {
  preferences: StockPreference[];
  total: number;
}

export interface StockPreferenceRequest {
  min_signal_score: number;
  notes?: string;
}
```

### API Service

```typescript
// src/services/api/preferencesApi.ts

export const preferencesApi = {
  getAll(): Promise<StockPreferencesResponse>;
  getBySymbol(symbol: string): Promise<StockPreference>;
  upsert(symbol: string, data: StockPreferenceRequest): Promise<StockPreference>;
  remove(symbol: string): Promise<void>;
};
```

## Theme Compliance (Fintech Neon)

All UI elements must follow `docs/FINTECH_NEON_THEME.md`:

### Colors Used
- Background: `var(--panel)` for table container
- Row hover: `var(--panel-hover)`
- Primary actions: `var(--accent)` (neon yellow-green)
- Success states: `var(--success)` for save confirmation
- Danger actions: `var(--danger)` for delete
- Text: `var(--text)` primary, `var(--text-secondary)` for hints

### Component Styling
- Table: Use existing `<Table>` component patterns
- Buttons: Use `<Button>` component with `primary`/`secondary`/`danger` variants
- Inputs: Follow theme input patterns with focus glow
- Modal: Use `<Modal>` component with glass effect
- Score display: Use `<Badge>` with color variants based on score

### Spacing
- Card padding: `var(--gap-lg)` (24px)
- Between rows: `var(--gap-sm)` (12px)
- Icon + text: `var(--gap-xs)` (8px)

## Validation Rules

| Field | Rule | Error Message |
|-------|------|---------------|
| Symbol | Required, uppercase, 1-10 chars, alphanumeric | "Enter a valid stock symbol (1-10 uppercase letters)" |
| Min Score | Required, integer 1-10 | "Score must be between 1 and 10" |
| Notes | Optional, max 200 chars | "Notes cannot exceed 200 characters" |

## State Management

Local component state (no global context needed for this feature):

```typescript
interface ComponentState {
  preferences: StockPreference[];
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  sortBy: 'symbol' | 'min_signal_score' | 'updated_at';
  sortOrder: 'asc' | 'desc';
  
  // Modal state
  isAddModalOpen: boolean;
  isEditModalOpen: boolean;
  editingPreference: StockPreference | null;
  isSubmitting: boolean;
}
```

## Error Handling

| Scenario | UI Response |
|----------|-------------|
| API fetch fails | Show error banner with retry button |
| Save fails | Show toast/inline error, keep modal open |
| Delete fails | Show toast error, restore row |
| Duplicate symbol | Show validation error in modal |
| Network offline | Disable actions, show offline indicator |

## Loading States

- Initial load: Show `<LoadingSkeleton>` in table area
- Save/Delete: Disable buttons, show spinner on action button
- Optimistic updates: Update UI immediately, rollback on error

## Accessibility

- All interactive elements keyboard navigable
- ARIA labels on icon buttons ("Edit preference", "Delete preference")
- Focus trap in modals
- Error messages associated with inputs via aria-describedby
- Contrast ratios meet WCAG AA (verified by theme)

## File Structure

```
src/
├── features/
│   └── settings/
│       └── components/
│           ├── StockPreferencesSettings.tsx (NEW)
│           ├── StockPreferencesSettings.css (NEW)
│           └── index.ts (update exports)
├── services/
│   └── api/
│       ├── preferencesApi.ts (NEW)
│       └── index.ts (update exports)
└── shared/
    └── types/
        ├── preferences.ts (NEW)
        └── index.ts (update exports)
```

## Trade-offs & Decisions

### Decision: Tab vs Standalone Page
**Chosen:** Add as Settings tab  
**Rationale:** Consistent with other preferences (notifications, trading params), discoverable location, reuses Settings infrastructure.

### Decision: Inline vs Modal Editing
**Chosen:** Modal for both add and edit  
**Rationale:** More room for notes field, consistent pattern, better mobile experience.

### Decision: Local State vs Context
**Chosen:** Local component state  
**Rationale:** This feature is self-contained, doesn't need to share state with other components. Simpler implementation.

### Decision: No Pagination Initially
**Chosen:** Show all preferences (up to reasonable limit ~100)  
**Rationale:** Most users will have < 50 stock preferences. Add pagination as future enhancement if needed.
