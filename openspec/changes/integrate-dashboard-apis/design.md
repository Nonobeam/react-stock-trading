# Design: Integrate Dashboard APIs

## Overview
This document describes the architectural decisions for integrating backend APIs into the Dashboard feature, replacing mock data with live services while maintaining backward compatibility.

## Design Principles

### 1. Layered Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                    Dashboard Components                      │
│   (MarketIndexChart, Portfolio, WatchlistPanel, Signals)    │
├─────────────────────────────────────────────────────────────┤
│                    Context Providers                         │
│   (MarketDataContext, AccountContext, PositionsContext)     │
├─────────────────────────────────────────────────────────────┤
│                    API Service Layer                         │
│   (marketApi, accountApi, positionsApi, signalsApi, etc.)   │
├─────────────────────────────────────────────────────────────┤
│                    Base API Client                           │
│   (apiClient with auth, error handling, retries)            │
└─────────────────────────────────────────────────────────────┘
```

### 2. Data Source Strategy
Use environment-based configuration with runtime fallback:

```typescript
// Configuration
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true';

// In context providers
async function fetchData() {
  if (USE_MOCK_DATA) {
    return generateMockData();
  }
  try {
    return await apiService.getData();
  } catch (error) {
    console.warn('API unavailable, falling back to mock data');
    return generateMockData();
  }
}
```

### 3. Type Safety
All API responses are typed with TypeScript interfaces that match the backend contracts documented in `API_DOCUMENT.md`.

## API Service Design

### Service Module Pattern
Each API category gets its own service module:

```typescript
// src/services/api/marketApi.ts
import { apiClient } from './client';
import type { MarketIndicesResponse, MarketRegimeResponse } from '../../shared/types/dashboard';

export const marketApi = {
  async getIndices(): Promise<MarketIndicesResponse> {
    return apiClient.get('/market/indices');
  },

  async getIndexHistory(
    indexKey: 'vnIndex' | 'vn30' | 'vn100',
    options?: { interval?: string; limit?: number }
  ): Promise<IndexHistoryResponse> {
    return apiClient.get(`/market/indices/${indexKey}/history`, options);
  },

  async getRegime(): Promise<MarketRegimeResponse> {
    return apiClient.get('/market/regime');
  },

  async getQuote(symbol: string): Promise<QuoteResponse> {
    return apiClient.get(`/market/quote/${symbol}`);
  }
};
```

### Error Handling Strategy
Centralized error handling in the API client with context-specific handling:

```typescript
// API Client level - handles HTTP errors
class APIClient {
  async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(url, { ...options, headers });
    
    if (!response.ok) {
      throw new APIError(response.status, await response.json());
    }
    
    return response.json();
  }
}

// Context level - handles business logic
function useDataFetching() {
  const [state, setState] = useState({ data: null, loading: true, error: null });
  
  async function fetch() {
    try {
      const data = await apiService.getData();
      setState({ data, loading: false, error: null });
    } catch (error) {
      if (USE_FALLBACK_MODE) {
        setState({ data: getMockData(), loading: false, error: null });
      } else {
        setState({ data: null, loading: false, error: error.message });
      }
    }
  }
}
```

## Context Provider Architecture

### State Management Pattern
Each context follows a consistent pattern:

```typescript
interface ContextState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

interface ContextActions {
  refresh: () => Promise<void>;
  clearError: () => void;
}
```

### MarketDataContext Refactoring

**Current Implementation:**
```typescript
// Uses mock data generator
const data = generateMarketData();
```

**New Implementation:**
```typescript
const refresh = useCallback(async () => {
  setIsLoading(true);
  setError(null);
  
  try {
    const [indices, regime] = await Promise.all([
      marketApi.getIndices(),
      marketApi.getRegime()
    ]);
    
    setMarketData({
      vnIndex: indices.vnIndex.value,
      change: indices.vnIndex.change,
      changePercent: indices.vnIndex.changePercent,
      regime: regime.regime,
      regimeScore: regime.regimeScore,
      breadth: regime.breadth,
      marketStatus: regime.marketStatus,
      lastUpdate: new Date(regime.lastUpdate),
      indices: {
        vnIndex: indices.vnIndex,
        vn30: indices.vn30,
        vn100: indices.vn100
      }
    });
  } catch (err) {
    if (USE_MOCK_DATA) {
      setMarketData(generateMarketData());
    } else {
      setError(err.message);
    }
  } finally {
    setIsLoading(false);
  }
}, []);
```

### Polling Strategy
For real-time data without WebSocket:

```typescript
useEffect(() => {
  refresh(); // Initial fetch
  
  const intervalId = setInterval(refresh, REFRESH_INTERVAL);
  
  return () => clearInterval(intervalId);
}, [refresh]);

// Constants
const REFRESH_INTERVALS = {
  MARKET_DATA: 5000,     // 5 seconds during market hours
  POSITIONS: 10000,      // 10 seconds
  SIGNALS: 30000,        // 30 seconds
  WATCHLIST: 15000       // 15 seconds for price updates
};
```

## Watchlist Integration Design

### Current Architecture
```
WatchlistPanel → localStorage
```

### New Architecture
```
WatchlistPanel → WatchlistContext → watchlistApi → Backend
                                  ↓
                             localStorage (offline cache)
```

### Sync Strategy
1. On mount: Fetch from API, update localStorage cache
2. On add/remove/favorite: Optimistic update → API call → Rollback on failure
3. On error: Use localStorage cache with stale indicator

```typescript
// Optimistic update pattern
async function addToWatchlist(symbol: string) {
  // 1. Optimistic update
  const tempItem = { symbol, addedAt: Date.now(), isFavorite: false };
  setItems(prev => [tempItem, ...prev]);
  
  try {
    // 2. API call
    const result = await watchlistApi.add(symbol);
    // 3. Update with server response
    setItems(prev => 
      prev.map(item => 
        item.symbol === symbol ? { ...item, ...result } : item
      )
    );
  } catch (error) {
    // 4. Rollback on failure
    setItems(prev => prev.filter(item => item.symbol !== symbol));
    showError('Failed to add to watchlist');
  }
}
```

## AI Recommendations Integration

### Request/Response Flow
```
RecommendButton 
    → click event
    → POST /api/recommendations with context
    → Display in RecommendModal
```

### Context Building
```typescript
async function handleGetRecommendation() {
  setIsLoadingRec(true);
  
  try {
    const recommendation = await recommendationsApi.get({
      IncludePortfolio: true,
      IncludeMarketRegime: true,
      IncludeSignals: true
    });
    
    setRecommendation(recommendation);
    setIsModalOpen(true);
  } catch (error) {
    showError('Failed to get recommendation');
  } finally {
    setIsLoadingRec(false);
  }
}
```

## Caching Strategy

### Cache Levels
1. **HTTP Cache:** Leverage browser caching with appropriate headers
2. **Memory Cache:** In-context state persists during session
3. **Local Storage:** Watchlist cache for offline access

### Cache Invalidation
- Market data: Auto-invalidate every 5 seconds
- Account/Positions: Invalidate on user action or every 30 seconds
- Signals: Invalidate every 30 seconds
- Watchlist: Invalidate on CRUD operations

## Configuration

### Environment Variables
```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8080
VITE_USE_MOCK_DATA=false

# Feature Flags
VITE_ENABLE_FALLBACK=true  # Fall back to mock on API failure
VITE_REFRESH_ENABLED=true  # Enable auto-refresh polling
```

### Runtime Configuration
```typescript
// src/shared/constants/config.ts
export const API_CONFIG = {
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  useMockData: import.meta.env.VITE_USE_MOCK_DATA === 'true',
  enableFallback: import.meta.env.VITE_ENABLE_FALLBACK !== 'false',
};

export const REFRESH_CONFIG = {
  enabled: import.meta.env.VITE_REFRESH_ENABLED !== 'false',
  intervals: {
    marketData: 5000,
    positions: 10000,
    signals: 30000,
    watchlist: 15000,
  },
};
```

## Theme Compliance

### Loading States
Follow fintech neon theme loading skeleton pattern:
```css
.loading-skeleton {
  background: var(--panel);
  background-image: linear-gradient(
    90deg,
    var(--panel) 0%,
    var(--panel-elevated) 50%,
    var(--panel) 100%
  );
  animation: shimmer 1.5s infinite;
}
```

### Error States
```css
.error-state {
  background: var(--panel);
  border: 1px solid var(--danger);
  color: var(--danger);
  padding: var(--gap-md);
  border-radius: var(--radius);
}

.error-state__retry {
  /* Secondary button pattern */
  background: var(--panel-elevated);
  color: var(--text);
  border: 1px solid var(--border-light);
}
```

### Stale Data Indicator
```css
.stale-indicator {
  color: var(--warning);
  font-size: var(--text-xs);
}
```

## Trade-offs

### Decision 1: Polling vs WebSocket
**Chosen:** Polling with configurable intervals

**Rationale:**
- Simpler implementation
- Works without backend WebSocket support
- Sufficient for dashboard use case
- Can be upgraded to WebSocket later

### Decision 2: Fallback to Mock Data
**Chosen:** Enable fallback with visual indicator

**Rationale:**
- Better UX when backend unavailable
- Allows frontend development without backend
- Clear indication when using mock data

### Decision 3: Optimistic Updates for Watchlist
**Chosen:** Optimistic with rollback

**Rationale:**
- Faster perceived performance
- Handles network latency gracefully
- Rollback ensures data consistency

## Migration Path

1. **Phase 1:** Add API services and types (no UI changes)
2. **Phase 2:** Refactor contexts one by one (feature flag controlled)
3. **Phase 3:** Enable by default, test thoroughly
4. **Phase 4:** Remove mock fallback option (after backend stabilizes)

## Testing Strategy

### Unit Tests
- API service modules with mocked fetch
- Context providers with mocked API services
- Error handling and retry logic

### Integration Tests
- Context + API service integration
- Loading/error state transitions
- Fallback behavior

### E2E Tests
- Full dashboard with real backend
- Network failure scenarios
- Data refresh cycles
