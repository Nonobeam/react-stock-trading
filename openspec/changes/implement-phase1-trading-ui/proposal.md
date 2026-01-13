# Proposal: Implement Phase 1 Trading UI

## Summary
Implement the core trading platform UI as specified in docs/CORE.md Phase 1, including the Dashboard, Watchlist, Portfolio, and Signals screens with their complete component hierarchies, layouts, interactions, and Vietnam-specific financial calculations.

## Why
The trading platform needs a foundational UI to enable users to monitor markets, track positions, analyze performance, and act on trading signals. Without these core screens, users cannot effectively use the platform for swing trading. This Phase 1 implementation establishes the UI foundation that all future features (AI coaching, backtesting, journaling) will build upon.

## Problem
The trading platform needs its foundational UI to enable users to:
- Monitor market status and trading positions at a glance (Dashboard)
- Track and analyze stocks for potential entry (Watchlist)
- Manage capital allocation and review trading performance (Portfolio)
- Act on AI-generated buy/sell signals (Signals)

Currently, the application has basic scaffolding but lacks the complete feature-rich screens described in the product design document.

## Proposed Solution
Build out the four core screens (Dashboard, Watchlist, Portfolio, Signals) following the detailed specifications in docs/CORE.md Phase 1, ensuring:

1. **Strict adherence to Fintech Neon theme** (docs/FINTECH_NEON_THEME.md)
   - Navy/charcoal backgrounds with neon yellow-green accents
   - Minimal borders, soft shadows, professional elevation
   - Consistent color palette and design tokens

2. **Vietnam-specific financial calculations**
   - 0.25% commission on entry and exit
   - 0.1% tax on exit
   - T+2 settlement tracking
   - VND currency formatting
   - Floor/ceiling price limits

3. **Complete component library** with reusable elements:
   - Cards, tables, modals, panels
   - Risk gauges, progress bars, charts
   - Real-time price displays with flash animations

4. **Comprehensive data interactions**:
   - Real-time updates during market hours
   - Sortable/filterable tables
   - Detail panels with slide-in animations
   - Responsive layouts for mobile/tablet/desktop

## Scope

### In Scope
- Dashboard screen with summary cards, signal cards, positions table
- Watchlist screen with comprehensive table, detail panel, filtering
- Portfolio screen with Capital, Positions, History, and Analytics tabs
- Signals screen with active/watch/dismissed signal management
- Shared component library (Button, Card, Table, Badge, Modal, etc.)
- Theme implementation matching FINTECH_NEON_THEME.md
- Responsive layouts (desktop, tablet, mobile)
- Mock data generation for development/testing

### Out of Scope (Future Phases)
- Backend API integration (stub/mock data only)
- Real WebSocket connections (simulated real-time updates)
- AI chat interface (Phase 2)
- Backtesting features (Phase 2)
- Journal/notes features (Phase 2)
- Settings screen (Phase 2)
- User authentication (Phase 2)
- Chart visualization components (Phase 2)

## Success Criteria
- [ ] All four screens render correctly on desktop (1920x1080)
- [ ] All components follow Fintech Neon theme specifications
- [ ] Responsive layouts work on tablet (768-1024px) and mobile (<768px)
- [ ] Vietnam financial calculations are accurate (commission, tax, settlement)
- [ ] Real-time price updates simulate correctly with flash animations
- [ ] All interactive elements (hover, click, sort, filter) function properly
- [ ] No emojis in production UI (per remove-ui-emojis change)
- [ ] Component library is documented and reusable
- [ ] Mock data is realistic and comprehensive

## Risks & Dependencies
**Risks:**
- Large scope may require phased implementation
- Complex financial calculations need thorough testing
- Real-time simulation needs performance optimization

**Dependencies:**
- Requires completion of "remove-ui-emojis" change
- Requires "enforce-navy-theme-consistency" for proper theme setup
- Requires mock data structure decisions for development

**Mitigation:**
- Break into small, testable increments per tasks.md
- Create comprehensive test cases for financial calculations
- Use React performance best practices (memo, useCallback)

## Related Changes
- Builds on: `enforce-navy-theme-consistency`
- Blocks: `integrate-backend-apis` (needs UI first)
- Related to: `implement-gst-frontend-core` (may share some components)

## Notes
This is the foundational UI that all future features will build upon. Priority is on correctness, theme consistency, and component reusability over feature completeness. We'll implement with mock data and create clear integration points for backend APIs in future phases.
