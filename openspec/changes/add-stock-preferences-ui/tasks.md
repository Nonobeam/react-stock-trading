# Tasks: Add Stock Preferences UI

**Change ID:** `add-stock-preferences-ui`  
**Last Updated:** January 15, 2026

## Prerequisites

- [x] **PREREQ-001**: Verify backend API endpoints are implemented and accessible
  - Test `GET /api/preferences/stocks` returns valid response
  - Test `PUT /api/preferences/stocks/:symbol` accepts and saves data
  - Test `DELETE /api/preferences/stocks/:symbol` removes preference

---

## Phase 1: Types & API Service

- [x] **TASK-001**: Create stock preference type definitions
  - **File**: `src/shared/types/preferences.ts`
  - **Work**:
    - Define `StockPreference` interface
    - Define `StockPreferencesResponse` interface
    - Define `StockPreferenceRequest` interface
  - **Verification**: TypeScript compiles without errors

- [x] **TASK-002**: Export preference types from shared types index
  - **File**: `src/shared/types/index.ts`
  - **Work**: Add `export * from './preferences';`
  - **Verification**: Types importable from `@/shared/types`

- [x] **TASK-003**: Create preferences API service
  - **File**: `src/services/api/preferencesApi.ts`
  - **Work**:
    - Implement `getAll()` → `GET /api/preferences/stocks`
    - Implement `getBySymbol(symbol)` → `GET /api/preferences/stocks/:symbol`
    - Implement `upsert(symbol, data)` → `PUT /api/preferences/stocks/:symbol`
    - Implement `remove(symbol)` → `DELETE /api/preferences/stocks/:symbol`
  - **Verification**: API calls execute correctly in network tab

- [x] **TASK-004**: Export preferences API from services index
  - **File**: `src/services/api/index.ts`
  - **Work**: Add `export * from './preferencesApi';`
  - **Verification**: API importable from `@/services/api`

---

## Phase 2: Settings Component

- [x] **TASK-005**: Create StockPreferencesSettings component structure
  - **File**: `src/features/settings/components/StockPreferencesSettings.tsx`
  - **Work**:
    - Create component scaffold with loading/error states
    - Implement `useEffect` to fetch preferences on mount
    - Set up local state management (preferences, loading, error)
  - **Verification**: Component renders loading skeleton, then data or empty state

- [x] **TASK-006**: Implement preferences table display
  - **File**: `src/features/settings/components/StockPreferencesSettings.tsx`
  - **Work**:
    - Create table with columns: Symbol, Min Score, Notes, Actions
    - Implement sorting by symbol and score
    - Style score with Badge component (color by score level)
    - Add action buttons (edit, delete) with IconButton
  - **Verification**: Table displays preferences correctly, sorting works

- [x] **TASK-007**: Implement search/filter functionality
  - **File**: `src/features/settings/components/StockPreferencesSettings.tsx`
  - **Work**:
    - Add search input in header
    - Filter preferences by symbol as user types
  - **Verification**: Search filters table rows in real-time

- [x] **TASK-008**: Create Add Preference Modal
  - **File**: `src/features/settings/components/StockPreferencesSettings.tsx`
  - **Work**:
    - Modal with fields: Symbol input, Score slider/input (1-10), Notes textarea
    - Form validation (symbol format, score range, notes length)
    - Submit calls `preferencesApi.upsert()`
    - Success closes modal and refreshes list
    - Error shows inline message
  - **Verification**: Can add new preference, validation prevents invalid data

- [x] **TASK-009**: Create Edit Preference Modal
  - **File**: `src/features/settings/components/StockPreferencesSettings.tsx`
  - **Work**:
    - Reuse modal component with pre-filled values
    - Symbol field disabled (read-only) when editing
    - Submit updates preference via API
  - **Verification**: Can edit existing preference, changes persist

- [x] **TASK-010**: Implement Delete functionality
  - **File**: `src/features/settings/components/StockPreferencesSettings.tsx`
  - **Work**:
    - Confirmation dialog before delete
    - Call `preferencesApi.remove(symbol)`
    - Remove from local state on success
    - Show error toast on failure
  - **Verification**: Delete removes preference, confirmation prevents accidental deletion

- [x] **TASK-011**: Create component styles
  - **File**: `src/features/settings/components/StockPreferencesSettings.css`
  - **Work**:
    - Style header with add button and search
    - Style table container
    - Style action buttons (consistent with other settings)
    - Follow Fintech Neon theme variables
    - Ensure proper spacing using theme tokens
  - **Verification**: Component matches theme, visual consistency with other settings tabs

---

## Phase 3: Integration

- [x] **TASK-012**: Export component from settings components index
  - **File**: `src/features/settings/components/index.ts`
  - **Work**: Add `export * from './StockPreferencesSettings';`
  - **Verification**: Component importable from components index

- [x] **TASK-013**: Add Stock Preferences tab to SettingsView
  - **File**: `src/features/settings/SettingsView.tsx`
  - **Work**:
    - Import `StockPreferencesSettings` component
    - Add tab to tabs array: `{ id: 'stock-preferences', label: 'Stock Preferences' }`
    - Add case in `renderContent()` switch
  - **Verification**: Tab appears in Settings navigation, clicking shows component

---

## Phase 4: Polish & Edge Cases

- [x] **TASK-014**: Implement empty state
  - **File**: `src/features/settings/components/StockPreferencesSettings.tsx`
  - **Work**:
    - Show EmptyState component when no preferences
    - Include call-to-action button to add first preference
  - **Verification**: Empty state displays correctly with helpful message

- [x] **TASK-015**: Handle API errors gracefully
  - **File**: `src/features/settings/components/StockPreferencesSettings.tsx`
  - **Work**:
    - Show error banner when fetch fails with retry button
    - Show inline errors in modals when save fails
    - Maintain form state on error for retry
  - **Verification**: Errors are visible and actionable

- [x] **TASK-016**: Add loading indicators
  - **File**: `src/features/settings/components/StockPreferencesSettings.tsx`
  - **Work**:
    - Show LoadingSkeleton during initial fetch
    - Disable and show spinner on submit buttons during save
    - Disable row actions during delete
  - **Verification**: Loading states provide clear feedback

- [x] **TASK-017**: Verify theme compliance
  - **Work**:
    - Review all colors against `docs/FINTECH_NEON_THEME.md`
    - Verify spacing follows theme tokens
    - Check hover/focus states have proper transitions
    - Validate contrast ratios
  - **Verification**: Component passes visual review against theme spec

---

## Validation Checklist

- [x] All TypeScript types compile without errors
- [x] Component renders in Settings view
- [x] CRUD operations work with backend API
- [x] Search/filter works correctly
- [x] Validation prevents invalid data entry
- [x] Error states are handled gracefully
- [x] Loading states provide feedback
- [x] Theme compliance verified
- [x] Keyboard navigation works
- [x] No console errors or warnings

---

## Dependencies

```
TASK-001 ─┬──▶ TASK-002
          │
TASK-003 ─┴──▶ TASK-004
               │
TASK-005 ◀─────┘
    │
    ├──▶ TASK-006 ──▶ TASK-007
    │
    ├──▶ TASK-008 ──▶ TASK-009 ──▶ TASK-010
    │
    └──▶ TASK-011
               │
TASK-012 ◀─────┤
               │
TASK-013 ◀─────┘
    │
    └──▶ TASK-014 ──▶ TASK-015 ──▶ TASK-016 ──▶ TASK-017
```

**Parallelizable Work:**
- TASK-001, TASK-003 can run in parallel
- TASK-006, TASK-008, TASK-011 can run in parallel after TASK-005
- TASK-014, TASK-015, TASK-016 can run in parallel after TASK-013
