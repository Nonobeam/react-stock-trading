# Proposal: Implement Phase 3 Trade Setup Discovery UI

## Problem
The backend has implemented Phase 3 (Trade Setup Discovery) with breakout detection, scoring, and liquidity filters, but the UI only has a legacy `scanner.old` feature that doesn't follow the current architecture or theme. Traders need a modern, integrated view to discover and evaluate high-probability trade setups based on technical patterns and automated scoring.

## Proposed Solution
Migrate and reimplement the Trade Setup Discovery feature as a first-class `ScannerView` in the modern React architecture. This view will integrate with the existing `SetupsContext` and follow the Fintech Neon theme.

### Key Features
- **Trade Setup Grid/List**: Display discovered setups with symbol, price, score, and pattern.
- **Filtering & Sorting**: Filter by status (Pending, Triggered, Invalidated) and sort by setup score or risk/reward ratio.
- **13-Point Scorecard**: A detailed breakdown of the setup quality based on backend scoring logic.
- **Technical Detail View**: Show pattern analysis, timeframe, and specific technical reasons for the setup.
- **Trade Planning Integration**: A bridge to the upcoming Risk & Position Planning (Phase 4).

## Impact
- **User Experience**: Provides a centralized hub for finding trades, improving discipline by focusing on high-score setups.
- **Consistency**: Brings the scanner feature in line with the rest of the application's look and feel.
- **Architecture**: Completes the migration of one of the most critical "discovery" features to the new architecture.

## Risks & Mitigations
- **Data Freshness**: Setups may change quickly. *Mitigation*: Use the existing `SetupsContext` polling/real-time update mechanism.
- **Mobile Usability**: The 13-point scorecard might be complex for small screens. *Mitigation*: Use a responsive modal or drawer for the scorecard detail.
