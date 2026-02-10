# Design: Phase 3 Trade Setup Discovery UI

## Architecture

### Component Hierarchy
- `ScannerView`: Container component that manages local state (filters, selected setup) and coordinates layout.
  - `ScannerFilters`: UI for filtering by status, pattern, and sorting.
  - `SetupGrid`: Responsive grid of `SetupCard` components.
    - `SetupCard`: Displays high-level setup info (symbol, score, pattern, R:R).
  - `SetupDetailModal`: Modal containing the detailed scorecard and technical analysis.
    - `Scorecard13Point`: Visual breakdown of the 13-point scoring system.
    - `TechnicalAnalysisView`: Details on pattern, timeframe, and reason.

### Data Flow
1. **Source**: `SetupsContext` provides the `setups` array and `isLoading` status.
2. **Persistence**: Setups are currently provided by a mock service (which supports the `Setup` interface) and can be polled/updated in real-time.
3. **Filtering**: Done locally in `ScannerView` using the `filterSetups` helper from context or custom logic if multi-criteria filtering is needed.

### Interaction Logic
- **Hover**: Setup cards show a subtle neon glow.
- **Click**: Opens `SetupDetailModal`.
- **Plan Trade**: (Future) Button in detail view that navigates to the Risk Calculator (Phase 4) with pre-filled parameters.

## Visual Design

### Theme Adherence
- **Colors**: Use `--bg`, `--accent`, `--panel`, and `--text-primary` CSS variables.
- **Glassmorphism**: Apply `backdrop-filter: blur()` and semi-transparent backgrounds to cards and modals.
- **Typography**: Clean, sans-serif fonts with distinct weights for data points.

### Scorecard Visualization
- Use a 13-point scale visualized with a progress ring or a segmented bar.
- Individual criteria (e.g., Trend, Volume, Volatility) should have clear pass/fail or score indicators.

## Migration Plan
- Replaces `src/features/scanner.old/`.
- New directory: `src/features/scanner/`.
- Register the new `ScannerView` in `App.tsx`.
- Update navigation links in `App.tsx` to include "Scanner" (or rename "Signals" if they overlap, but based on `App.tsx` they are currently separate).
- *Correction*: `App.tsx` already has "Signals". I will add "Scanner" as a new navigation item for Phase 3.
