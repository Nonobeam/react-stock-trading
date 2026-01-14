# Proposal: Integrate Dashboard APIs

## Change ID
`integrate-dashboard-apis`

## Status
Proposed

## Overview
Integrate real backend APIs into the Dashboard feature to replace mock data with live services. This proposal covers the 14 APIs documented in `docs/API_DOCUMENT.md` and `docs/DASHBOARD_APIS.md` that power the dashboard components.

## Problem Statement
The dashboard currently uses **mock data** through Context providers (`MarketDataContext`, `AccountContext`, `PositionsContext`, `SetupsContext`). The backend has implemented all required APIs (documented in `API_DOCUMENT.md`), but the frontend continues to use:
- `src/services/mock/marketData.ts` for VN-Index and market regime data
- `src/services/mock/account.ts` for account and P&L data
- `src/services/mock/positions.ts` for open positions
- `src/services/mock/setups.ts` for trading signals
- `src/features/dashboard/utils/mockRecommendations.ts` for AI recommendations
- localStorage for watchlist persistence instead of backend sync

This gap prevents users from seeing their real account data, market information, and trading signals on the dashboard.

## Goals
1. Add API service modules for all 14 dashboard endpoints
2. Refactor Context providers to use real APIs with fallback to mock data
3. Implement proper error handling and loading states
4. Add retry logic and caching for better UX
5. Integrate watchlist with backend persistence
6. Connect AI recommendation button to `/api/recommendations` endpoint
7. Follow fintech neon theme design system for all loading/error states

## Non-Goals
- Creating new UI components (existing components are sufficient)
- Implementing WebSocket real-time updates (separate enhancement)
- Authentication/JWT token management (assumed handled separately)
- Modifying backend API contracts

## API Endpoints to Integrate

### Category 1: Market Data (3 APIs)
| Endpoint | Component | Current Source |
|----------|-----------|----------------|
| `GET /api/market/indices` | `MarketIndexChart` | `mock/marketData.ts` |
| `GET /api/market/indices/{key}/history` | `MarketIndexChart` | `mock/marketData.ts` |
| `GET /api/market/regime` | Dashboard context | `mock/marketData.ts` |

### Category 2: Account (2 APIs)
| Endpoint | Component | Current Source |
|----------|-----------|----------------|
| `GET /api/account/info` | `Portfolio` | `mock/account.ts` |
| `GET /api/account/summary` | `Portfolio`, Positions Card | `mock/account.ts` |

### Category 3: Positions (2 APIs)
| Endpoint | Component | Current Source |
|----------|-----------|----------------|
| `GET /api/positions/active` | Open Positions Card | `mock/positions.ts` |
| `GET /api/positions/summary` | Open Positions Card | `mock/positions.ts` |

### Category 4: Signals (1 API)
| Endpoint | Component | Current Source |
|----------|-----------|----------------|
| `GET /api/signals` | Latest Signals Card | `mock/setups.ts` |

### Category 5: Watchlist (5 APIs)
| Endpoint | Component | Current Source |
|----------|-----------|----------------|
| `GET /api/watchlist` | `WatchlistPanel` | localStorage |
| `POST /api/watchlist` | `WatchlistPanel` | localStorage |
| `DELETE /api/watchlist/{symbol}` | `WatchlistPanel` | localStorage |
| `PATCH /api/watchlist/{symbol}/favorite` | `WatchlistPanel` | localStorage |
| `GET /api/market/quote/{symbol}` | `WatchlistPanel` | Mock calculation |

### Category 6: AI Recommendations (1 API)
| Endpoint | Component | Current Source |
|----------|-----------|----------------|
| `POST /api/recommendations` | `RecommendButton`, `RecommendModal` | `mockRecommendations.ts` |

## Proposed Solution

### 1. API Service Layer
Create dedicated API service modules under `src/services/api/`:
- `marketApi.ts` - Market indices, history, regime, quotes
- `accountApi.ts` - Account info and summary
- `positionsApi.ts` - Active positions and portfolio summary
- `signalsApi.ts` - Trading signals
- `watchlistApi.ts` - Watchlist CRUD operations
- `recommendationsApi.ts` - AI recommendations

Each module uses the existing `apiClient` from `client.ts` and adds type-safe wrappers.

### 2. Type Definitions
Add TypeScript interfaces in `src/shared/types/dashboard.ts`:
- `MarketIndicesResponse`, `IndexData`, `DataPoint`
- `MarketRegimeResponse`
- `AccountInfoResponse`, `AccountSummaryResponse`
- `ActivePositionsResponse`, `PositionsSummaryResponse`
- `SignalsResponse`, `Signal`
- `WatchlistResponse`, `WatchlistItem`
- `RecommendationRequest`, `RecommendationResponse`

### 3. Context Provider Refactoring
Update each context to:
1. Import API service module
2. Replace mock function calls with API calls
3. Add loading, error, and data states
4. Implement retry logic with exponential backoff
5. Fallback to mock data when backend unavailable (configurable)

### 4. Error Handling
- Display toast notifications for API errors
- Show inline error states in components
- Implement retry buttons for failed requests
- Log errors for debugging

### 5. Configuration
Add environment variables:
```env
VITE_API_BASE_URL=http://localhost:8080
VITE_USE_MOCK_DATA=false
```

### 6. Theme Compliance
All loading states, error states, and new UI elements will follow the fintech neon theme:
- Loading skeletons use `var(--panel)` background with subtle animation
- Error states use `var(--danger)` for text/icons
- Retry buttons follow secondary button pattern
- Transitions use `var(--transition)` for smooth state changes

## Impact Assessment

### User Impact
**Positive:**
- Dashboard shows real account data and balances
- Live market indices with actual VN-Index values
- Actual trading signals from backend AI
- Watchlist synced across devices/sessions
- AI recommendations based on real portfolio context

**Neutral:**
- Slight initial load time while fetching data
- Network dependency for data freshness

### Technical Impact
**Files Modified:**
```
src/services/api/
├── client.ts (extend with new methods)
├── marketApi.ts (new)
├── accountApi.ts (new)
├── positionsApi.ts (new)
├── signalsApi.ts (new)
├── watchlistApi.ts (new)
└── recommendationsApi.ts (new)

src/shared/types/
└── dashboard.ts (new)

src/context/
├── MarketDataContext.tsx (refactor)
├── AccountContext.tsx (refactor)
├── PositionsContext.tsx (refactor)
└── SetupsContext.tsx (refactor)

src/features/dashboard/
├── components/WatchlistPanel/WatchlistPanel.tsx (refactor)
└── utils/mockRecommendations.ts (deprecated, kept as fallback)
```

**Files Added:** 7 new files
**Files Modified:** 6 existing files
**Files Removed:** 0 (mock files kept as fallback)

### Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Backend unavailable | Medium | High | Fallback to mock data with visual indicator |
| Slow API responses | Medium | Medium | Loading skeletons + request caching |
| JWT token expiration | Low | High | Token refresh logic (out of scope) |
| Type mismatches | Low | Medium | Strict TypeScript + runtime validation |

## Success Criteria
1. All 14 APIs successfully integrated
2. Dashboard displays real data when backend is running
3. Graceful fallback to mock data when backend unavailable
4. No UI regressions from current mock-based implementation
5. Error states display correctly with retry functionality
6. Theme consistency maintained across all states

## Dependencies
- Backend APIs running at `http://localhost:8080`
- Valid JWT token for authenticated requests
- CORS configured on backend for frontend origin

## Related Changes
- `integrate-backend-apis` - Broader API integration (Account/Trading views)
- `enhance-dashboard-analytics` - Dashboard analytics improvements

## Timeline Estimate
- Phase 1: API Service Layer + Types (2 days)
- Phase 2: Context Refactoring (2 days)
- Phase 3: Watchlist Integration (1 day)
- Phase 4: Error Handling + Polish (1 day)
- **Total:** 6 days

## Approval
- [ ] Product Owner
- [ ] Tech Lead
- [ ] QA Lead
