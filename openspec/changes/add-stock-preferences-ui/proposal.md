# Proposal: Add Stock Preferences UI

**Change ID:** `add-stock-preferences-ui`  
**Status:** Draft  
**Created:** January 15, 2026  
**Author:** AI Assistant

## Summary

Add a UI component for managing per-stock signal score preferences, allowing users to set custom minimum signal scores and notes for individual stocks via the new `/api/preferences/stocks` API endpoints.

## Problem Statement

Currently, the application applies a global minimum signal score threshold to all stocks. However, traders often have different quality requirements for different stocks:
- Blue-chip stocks (like VNM) may require higher confidence (score 9+) before acting
- Volatile stocks may need stricter filters
- Familiar stocks may allow lower thresholds based on trader experience

Without per-stock preferences, traders cannot customize their signal filtering strategy on a stock-by-stock basis.

## Proposed Solution

Implement a **Stock Preferences** management UI that:
1. Displays all configured stock preferences in a searchable/sortable table
2. Allows adding new stock preferences with symbol, min_signal_score, and optional notes
3. Allows editing existing preferences inline or via modal
4. Allows removing preferences with confirmation
5. Integrates with the backend API endpoints:
   - `GET /api/preferences/stocks` - List all preferences
   - `GET /api/preferences/stocks/:symbol` - Get single preference
   - `PUT /api/preferences/stocks/:symbol` - Create/update preference
   - `DELETE /api/preferences/stocks/:symbol` - Remove preference

### UI Location

Add as a new **"Stock Preferences"** tab within the existing Settings view (`src/features/settings/SettingsView.tsx`), maintaining consistency with other settings components.

## User Stories

1. **As a trader**, I want to set a higher minimum signal score for blue-chip stocks so I only act on very strong signals for these stable investments.

2. **As a trader**, I want to add notes to my stock preferences so I remember why I configured specific thresholds.

3. **As a trader**, I want to see all my stock preferences in one table so I can review and manage them efficiently.

4. **As a trader**, I want to remove a stock preference when I no longer need custom settings for that symbol.

## Out of Scope

- Bulk import/export of preferences
- Default fallback preferences (handled by backend)
- Symbol search/autocomplete from market data (future enhancement)
- Mobile-specific layouts

## Dependencies

- Backend API endpoints must be implemented and available
- Existing Settings infrastructure (`SettingsView`, `SettingsContext`)

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| API unavailability | Cannot save/load preferences | Show clear error states, allow retry |
| Invalid symbol entry | User confusion | Validate symbol format (uppercase, max 10 chars) |
| Large preference lists | Performance degradation | Implement pagination if > 100 items |

## Success Criteria

- [ ] Users can view all stock preferences in a sortable table
- [ ] Users can add new stock preferences with validation
- [ ] Users can edit existing preferences
- [ ] Users can delete preferences with confirmation
- [ ] UI follows Fintech Neon theme design system
- [ ] Error states are handled gracefully
- [ ] Loading states provide visual feedback

## Related Changes

- None (this is a new standalone feature)

## Approval

- [ ] Approved for implementation
