# Change: Redesign Dashboard Two-Column Layout

## Why

The current dashboard layout presents information in a linear flow that doesn't optimize screen real estate for professional trading. A two-column layout improves data density and separates market indices (left) from portfolio/account data (right) for quick decision-making.

## What Changes

- **NEW** `MarketIndexChart` component displaying VNINDEX, VN30, VN100 line charts with tabs
- **MODIFIED** Dashboard layout from single-column to two-column grid (50%/50%)
- **MODIFIED** Mock market data service to include VN30 and VN100 indices
- **REMOVED** Horizontal StatCard analytics section (consolidated into Account Summary)
- Left column: MarketIndexChart + WatchlistPanel
- Right column: PortfolioChart, Account Summary, Open Positions, Latest Signals, AI Recommend

## Impact

- Affected specs: `dashboard-layout`, `market-index-chart` (new)
- Affected code: `DashboardView.tsx`, `DashboardView.css`, `marketData.ts`

## Scope

### In Scope
- New `MarketIndexChart` component for displaying VNINDEX, VN30, VN100 line charts
- Dashboard layout restructure to two-column grid
- Extended mock data service for VN30 and VN100 indices
- Reorganize existing components into the new layout

### Out of Scope
- Real-time WebSocket integration for indices (uses existing mock service)
- Backend API integration
- Mobile layout changes (existing responsive behavior maintained)

## Stakeholders
- Frontend team
- UX/Design team

## Success Criteria
- Dashboard displays two-column layout on desktop (≥1024px)
- Left column shows market index charts and watchlist
- Right column shows pie chart, account summary, positions, signals, AI recommend
- All components follow Fintech Neon Theme guidelines
- Responsive fallback to single column on mobile/tablet

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Performance with multiple live charts | Medium | Use optimized recharts with throttled updates |
| Layout complexity on smaller screens | Low | Progressive collapse to single column |
| Mock data doesn't include VN30/VN100 | Low | Extend mock service with derived values |

## Timeline
- Estimated: 1-2 days implementation

## Related Changes
- `enhance-dashboard-analytics` - may need coordination

## Approval
- [ ] Approved by stakeholder
