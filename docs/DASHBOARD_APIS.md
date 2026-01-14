# Dashboard API Requirements

This document lists all backend APIs required for the Dashboard feature to function with real data.

## Overview

The dashboard currently uses **mock data** through Context providers. These APIs need to be implemented on the backend to replace mock data with real services.

| Category | API Count |
|----------|-----------|
| Market Data | 3 |
| Account | 2 |
| Portfolio/Positions | 2 |
| Signals | 1 |
| Watchlist | 5 |
| AI Recommendations | 1 |
| **Total** | **14 APIs** |

---

## 1. Market Data APIs

### GET /api/market/indices

Get all market indices with current values and intraday chart data.

**Used by:** `MarketIndexChart` component

**Response:**
```json
{
  "vnIndex": {
    "name": "VNINDEX",
    "value": 1265.43,
    "change": 2.56,
    "changePercent": 0.20,
    "data": [
      { "timestamp": 1705200000000, "value": 1262.87 },
      { "timestamp": 1705200060000, "value": 1263.12 }
    ]
  },
  "vn30": {
    "name": "VN30",
    "value": 1320.15,
    "change": 4.73,
    "changePercent": 0.36,
    "data": [...]
  },
  "vn100": {
    "name": "VN100",
    "value": 1185.67,
    "change": 3.33,
    "changePercent": 0.28,
    "data": [...]
  },
  "lastUpdate": "2026-01-14T10:30:00.000Z"
}
```

---

### GET /api/market/indices/{indexKey}/history

Get historical intraday data for a specific index.

**Path Parameters:**
- `indexKey`: `vnIndex` | `vn30` | `vn100`

**Query Parameters:**
- `interval`: Data interval (`1m`, `5m`, `15m`, `1h`) - default: `1m`
- `limit`: Number of data points - default: `50`

**Response:**
```json
{
  "name": "VNINDEX",
  "data": [
    { "timestamp": 1705200000000, "value": 1262.87 },
    { "timestamp": 1705200060000, "value": 1263.12 }
  ]
}
```

---

### GET /api/market/regime

Get current market regime analysis.

**Used by:** Dashboard context, market analysis

**Response:**
```json
{
  "regime": "trending-up",
  "regimeScore": 7,
  "breadth": {
    "advances": 245,
    "declines": 123,
    "unchanged": 32
  },
  "marketStatus": "open",
  "lastUpdate": "2026-01-14T10:30:00.000Z"
}
```

**Regime Values:** `trending-up` | `trending-down` | `choppy` | `volatile`

**Market Status Values:** `pre-market` | `open` | `closed` | `ato` | `atc`

---

## 2. Account APIs

### GET /api/account/info

Get account information including capital and balances.

**Used by:** Account Summary card

**Response:**
```json
{
  "capital": 102500000,
  "cash": 52500000,
  "lockedCash": 5000000,
  "positionsValue": 45000000,
  "buyingPower": 78750000,
  "marginUsed": 13500000,
  "marginAvailable": 26250000
}
```

---

### GET /api/account/summary

Get account P&L summary and risk metrics.

**Used by:** Account Summary card

**Response:**
```json
{
  "totalPnL": 2500000,
  "totalPnLPercent": 2.50,
  "dayPnL": 150000,
  "dayPnLPercent": 0.15,
  "riskExposure": 4500000,
  "riskPercent": 4.39
}
```

---

## 3. Portfolio/Positions APIs

### GET /api/positions/active

Get all open/active positions.

**Used by:** Open Positions card, Portfolio context

**Response:**
```json
{
  "positions": [
    {
      "id": "pos-001",
      "symbol": "VCB",
      "name": "Vietcombank",
      "exchange": "HOSE",
      "shares": 100,
      "entryPrice": 85600,
      "currentPrice": 87200,
      "entryDate": "2026-01-10T09:00:00.000Z",
      "stopPrice": 81320,
      "targetPrice": 98440,
      "entryValue": 8560000,
      "currentValue": 8720000,
      "grossPnL": 160000,
      "netPnL": 145000,
      "netPnLPercent": 1.69,
      "rMultiple": 0.34,
      "risk": 428000,
      "status": "green",
      "daysHeld": 4
    }
  ]
}
```

---

### GET /api/positions/summary

Get portfolio summary metrics.

**Used by:** Open Positions card, PortfolioChart

**Response:**
```json
{
  "totalPositions": 5,
  "totalValue": 45000000,
  "totalPnL": 2500000,
  "totalPnLPercent": 5.88,
  "avgRMultiple": 0.85,
  "totalRisk": 2250000,
  "riskPercent": 5.00
}
```

---

## 4. Signals APIs

### GET /api/signals

Get trading signals with optional filtering.

**Used by:** Latest Signals card

**Query Parameters:**
- `limit`: Number of signals to return - default: `10`
- `sort`: Sort field (`score`, `generatedAt`) - default: `score`
- `type`: Filter by signal type (`buy`, `sell`, `watch`)
- `strength`: Filter by strength (`weak`, `moderate`, `strong`)

**Response:**
```json
{
  "signals": [
    {
      "id": "sig-001",
      "symbol": "FPT",
      "name": "FPT Corporation",
      "exchange": "HOSE",
      "currentPrice": 128000,
      "signalType": "buy",
      "strength": "strong",
      "score": 8,
      "indicators": ["RSI > 60", "MACD Bullish", "Volume Spike"],
      "generatedAt": "2026-01-14T09:30:00.000Z",
      "expiresAt": "2026-01-15T09:30:00.000Z",
      "reason": "Breakout above resistance with strong volume confirmation"
    }
  ],
  "count": 5
}
```

---

## 5. Watchlist APIs

### GET /api/watchlist

Get user's watchlist items.

**Used by:** `WatchlistPanel` component

**Response:**
```json
{
  "items": [
    {
      "symbol": "VNM",
      "addedAt": 1705200000000,
      "isFavorite": true,
      "price": 62800,
      "change": 1.25,
      "changePercent": 2.03,
      "sparklineData": [61500, 61800, 62100, 62500, 62800]
    }
  ]
}
```

---

### POST /api/watchlist

Add a symbol to the watchlist.

**Used by:** `WatchlistPanel` add button

**Request:**
```json
{
  "symbol": "VCB"
}
```

**Response:**
```json
{
  "symbol": "VCB",
  "addedAt": 1705200000000,
  "isFavorite": false,
  "message": "Symbol added to watchlist"
}
```

---

### DELETE /api/watchlist/{symbol}

Remove a symbol from the watchlist.

**Used by:** `WatchlistPanel` remove button

**Path Parameters:**
- `symbol`: Stock symbol (e.g., `VCB`)

**Response:**
```json
{
  "symbol": "VCB",
  "message": "Symbol removed from watchlist"
}
```

---

### PATCH /api/watchlist/{symbol}/favorite

Toggle favorite status for a watchlist item.

**Used by:** `WatchlistPanel` star button

**Path Parameters:**
- `symbol`: Stock symbol (e.g., `VCB`)

**Request:**
```json
{
  "isFavorite": true
}
```

**Response:**
```json
{
  "symbol": "VCB",
  "isFavorite": true,
  "message": "Favorite status updated"
}
```

---

### GET /api/market/quote/{symbol}

Get real-time price quote for a symbol.

**Used by:** `WatchlistPanel` price display

**Path Parameters:**
- `symbol`: Stock symbol (e.g., `VCB`)

**Response:**
```json
{
  "symbol": "VCB",
  "price": 85600,
  "open": 85000,
  "high": 86200,
  "low": 84800,
  "volume": 1250000,
  "change": 600,
  "changePercent": 0.71,
  "ceiling": 91600,
  "floor": 79600,
  "lastUpdate": "2026-01-14T10:30:00.000Z"
}
```

---

## 6. AI Recommendations APIs

### POST /api/recommendations

Get AI-powered trading recommendation.

**Used by:** `RecommendButton`, `RecommendModal`

**Request:**
```json
{
  "context": {
    "portfolio": true,
    "marketRegime": true,
    "signals": true
  }
}
```

**Response:**
```json
{
  "symbol": "VNM",
  "action": "buy",
  "confidence": 78,
  "rationale": "Technical indicators show bullish divergence with increasing volume. Market regime supports upward movement with strong fundamentals.",
  "targetPrice": 92500,
  "stopLoss": 86000,
  "timeframe": "short-term",
  "generatedAt": "2026-01-14T10:30:00.000Z"
}
```

**Action Values:** `buy` | `sell` | `hold`

**Timeframe Values:** `short-term` | `medium-term` | `long-term`

---

## WebSocket Events (Optional Real-time Updates)

For real-time updates, the following WebSocket events can be implemented:

| Event | Description | Payload |
|-------|-------------|---------|
| `market:indices` | Market indices update | `{ vnIndex, vn30, vn100 }` |
| `portfolio:update` | Position price update | `{ positions: [...] }` |
| `signal:new` | New signal generated | `{ signal: {...} }` |
| `quote:update` | Watchlist quote update | `{ symbol, price, change }` |

---

## Error Responses

All APIs should return consistent error responses:

```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication required",
    "status": 401
  }
}
```

**Common Error Codes:**
- `400` - Bad Request (invalid parameters)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource doesn't exist)
- `429` - Too Many Requests (rate limited)
- `500` - Internal Server Error

---

## Authentication

All APIs require Bearer token authentication:

```
Authorization: Bearer <access_token>
```

---

## Related Files

- Dashboard View: `src/features/dashboard/DashboardView.tsx`
- Market Data Context: `src/context/MarketDataContext.tsx`
- Account Context: `src/context/AccountContext.tsx`
- Positions Context: `src/context/PositionsContext.tsx`
- Setups Context: `src/context/SetupsContext.tsx`
- API Client: `src/services/api/client.ts`
- Mock Services: `src/services/mock/`
