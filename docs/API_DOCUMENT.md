# Dashboard API Documentation

**Base URL:** `http://localhost:8080`

**Version:** 1.0.0

---

## Table of Contents

1. [Authentication](#authentication)
2. [Common Responses](#common-responses)
3. [Market Data APIs](#1-market-data-apis)
4. [Account APIs](#2-account-apis)
5. [Position APIs](#3-position-apis)
6. [Signal APIs](#4-signal-apis)
7. [Watchlist APIs](#5-watchlist-apis)
8. [Recommendation APIs](#6-recommendation-apis)

---

## Authentication

All API endpoints (except `/health`) require Bearer token authentication.

### Header Format

```
Authorization: Bearer <your_jwt_token>
```

### JWT Token Requirements

Your JWT token must include:

- `user_id`: Integer user identifier
- `exp`: Token expiration timestamp

**Example Token Payload:**

```json
{
  "user_id": 1,
  "exp": 1705276800
}
```

Sign with the `JWT_SECRET` configured in your `.env` file.

---

## Common Responses

### Health Check

**Endpoint:** `GET /health`  
**Auth Required:** ❌ No

```bash
curl http://localhost:8080/health
```

**Response:**

```json
{
  "status": "ok",
  "service": "dashboard-api"
}
```

### Error Responses

**401 Unauthorized**

```json
{
  "error": "Missing authorization header"
}
```

**400 Bad Request**

```json
{
  "error": "Invalid request body"
}
```

**500 Internal Server Error**

```json
{
  "error": "Failed to retrieve data"
}
```

---

## 1. Market Data APIs

### 1.1 Get All Market Indices

Get current values and intraday chart data for all market indices.

**Endpoint:** `GET /api/market/indices`  
**Auth Required:** ✅ Yes

**cURL Example:**

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:8080/api/market/indices
```

**Response:**

```json
{
  "vnIndex": {
    "name": "VNINDEX",
    "value": 1265.43,
    "change": 2.56,
    "changePercent": 0.20,
    "data": [
      {
        "timestamp": 1705200000000,
        "value": 1262.87
      },
      {
        "timestamp": 1705200060000,
        "value": 1263.12
      }
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
  "lastUpdate": "2026-01-14T10:30:00Z"
}
```

**Data Points:** Last 390 minutes (1 trading day) of 1-minute snapshots

---

### 1.2 Get Index History

Get historical intraday data for a specific index.

**Endpoint:** `GET /api/market/indices/{indexKey}/history`  
**Auth Required:** ✅ Yes

**Path Parameters:**

- `indexKey`: `vnIndex` | `vn30` | `vn100`

**Query Parameters:**

- `interval` (optional): `1m` | `5m` | `15m` | `1h` - Default: `1m`
- `limit` (optional): Number of data points - Default: `50`

**cURL Example:**

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
     "http://localhost:8080/api/market/indices/vnIndex/history?interval=5m&limit=100"
```

**Response:**

```json
{
  "name": "VNINDEX",
  "data": [
    {
      "timestamp": 1705200000000,
      "value": 1262.87
    },
    {
      "timestamp": 1705200300000,
      "value": 1263.45
    }
  ]
}
```

---

### 1.3 Get Market Regime

Get current market regime analysis and breadth metrics.

**Endpoint:** `GET /api/market/regime`  
**Auth Required:** ✅ Yes

**cURL Example:**

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:8080/api/market/regime
```

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
  "lastUpdate": "2026-01-14T10:30:00Z"
}
```

**Regime Values:**

- `trending-up`: Bullish market
- `trending-down`: Bearish market
- `choppy`: Sideways/ranging
- `volatile`: High volatility

**Market Status:**

- `pre-market`: Before 9:00 AM
- `open`: Trading hours
- `closed`: After 3:00 PM
- `ato`: Opening auction
- `atc`: Closing auction

---

### 1.4 Get Stock Quote

Get real-time price quote for a specific symbol.

**Endpoint:** `GET /api/market/quote/{symbol}`  
**Auth Required:** ✅ Yes

**Path Parameters:**

- `symbol`: Stock symbol (e.g., `VCB`, `FPT`)

**cURL Example:**

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:8080/api/market/quote/VCB
```

**Response:**

```json
{
  "symbol": "VCB",
  "price": 87500,
  "open": 86000,
  "high": 88200,
  "low": 85800,
  "volume": 1250000,
  "change": 1500,
  "changePercent": 1.74,
  "ceiling": 92880,
  "floor": 79920,
  "lastUpdate": "2026-01-14T15:30:00Z"
}
```

---

## 2. Account APIs

### 2.1 Get Account Info

Get account capital and balance information.

**Endpoint:** `GET /api/account/info`  
**Auth Required:** ✅ Yes

**cURL Example:**

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:8080/api/account/info
```

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

**Field Descriptions:**

- `capital`: Total account value (cash + positions)
- `cash`: Available cash balance
- `lockedCash`: Cash locked in pending orders
- `positionsValue`: Current value of all positions
- `buyingPower`: Available buying power (with margin)
- `marginUsed`: Currently used margin
- `marginAvailable`: Available margin

---

### 2.2 Get Account Summary

Get account P&L summary and risk metrics.

**Endpoint:** `GET /api/account/summary`  
**Auth Required:** ✅ Yes

**cURL Example:**

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:8080/api/account/summary
```

**Response:**

```json
{
  "totalPnL": 2500000,
  "totalPnLPercent": 2.5,
  "dayPnL": 150000,
  "dayPnLPercent": 0.15,
  "riskExposure": 4500000,
  "riskPercent": 4.39
}
```

**Field Descriptions:**

- `totalPnL`: Total unrealized P&L (VND)
- `totalPnLPercent`: Total P&L percentage
- `dayPnL`: Today's P&L
- `dayPnLPercent`: Today's P&L percentage
- `riskExposure`: Total risk amount (distance to stop loss)
- `riskPercent`: Risk as % of account

---

## 3. Position APIs

### 3.1 Get Active Positions

Get all open/active positions.

**Endpoint:** `GET /api/positions/active`  
**Auth Required:** ✅ Yes

**cURL Example:**

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:8080/api/positions/active
```

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
      "entryDate": "2026-01-10T09:00:00Z",
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

**Status Values:**

- `green`: Profitable, above entry
- `yellow`: Below entry, above stop
- `red`: At or below stop loss

**Fees Included:** 0.15% commission (buy/sell) + 0.1% tax (sell)

---

### 3.2 Get Portfolio Summary

Get aggregate portfolio metrics.

**Endpoint:** `GET /api/positions/summary`  
**Auth Required:** ✅ Yes

**cURL Example:**

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:8080/api/positions/summary
```

**Response:**

```json
{
  "totalPositions": 5,
  "totalValue": 45000000,
  "totalPnL": 2500000,
  "totalPnLPercent": 5.88,
  "avgRMultiple": 0.85,
  "totalRisk": 2250000,
  "riskPercent": 5.0
}
```

---

## 4. Signal APIs

### 4.1 Get Trading Signals

Get trading signals with optional filtering.

**Endpoint:** `GET /api/signals`  
**Auth Required:** ✅ Yes

**Query Parameters:**

- `limit` (optional): Number of signals - Default: `10`
- `sort` (optional): `score` | `generatedAt` - Default: `score`
- `type` (optional): `buy` | `sell` | `watch`
- `strength` (optional): `weak` | `moderate` | `strong`

**cURL Examples:**

```bash
# Get top 10 signals by score
curl -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:8080/api/signals

# Get strong buy signals
curl -H "Authorization: Bearer YOUR_TOKEN" \
     "http://localhost:8080/api/signals?type=buy&strength=strong&limit=5"

# Get latest signals by time
curl -H "Authorization: Bearer YOUR_TOKEN" \
     "http://localhost:8080/api/signals?sort=generatedAt&limit=20"
```

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
      "indicators": ["Strong Score", "Regime: trending-up", "Entry: 128000"],
      "generatedAt": "2026-01-14T09:30:00.000Z",
      "expiresAt": "2026-01-15T09:30:00.000Z",
      "reason": "buy signal with score 8 in trending-up regime"
    }
  ],
  "count": 5
}
```

**Signal Expiry:** Signals expire after 24 hours

---

## 5. Watchlist APIs

### 5.1 Get Watchlist

Get user's watchlist items with live quotes.

**Endpoint:** `GET /api/watchlist`  
**Auth Required:** ✅ Yes

**cURL Example:**

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:8080/api/watchlist
```

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

**Sparkline Data:** Last 5-10 price points for mini chart

---

### 5.2 Add to Watchlist

Add a symbol to the watchlist.

**Endpoint:** `POST /api/watchlist`  
**Auth Required:** ✅ Yes

**Request Body:**

```json
{
  "symbol": "VCB"
}
```

**cURL Example:**

```bash
curl -X POST \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"symbol":"VCB"}' \
     http://localhost:8080/api/watchlist
```

**Response:**

```json
{
  "symbol": "VCB",
  "message": "Added to watchlist successfully",
  "isFavorite": false
}
```

**Status Code:** `201 Created`

---

### 5.3 Remove from Watchlist

Remove a symbol from the watchlist.

**Endpoint:** `DELETE /api/watchlist/{symbol}`  
**Auth Required:** ✅ Yes

**Path Parameters:**

- `symbol`: Stock symbol to remove

**cURL Example:**

```bash
curl -X DELETE \
     -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:8080/api/watchlist/VCB
```

**Response:**

```json
{
  "symbol": "VCB",
  "message": "Removed from watchlist successfully"
}
```

---

### 5.4 Toggle Favorite

Toggle favorite status for a watchlist item.

**Endpoint:** `PATCH /api/watchlist/{symbol}/favorite`  
**Auth Required:** ✅ Yes

**Path Parameters:**

- `symbol`: Stock symbol

**Request Body:**

```json
{
  "isFavorite": true
}
```

**cURL Example:**

```bash
curl -X PATCH \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"isFavorite":true}' \
     http://localhost:8080/api/watchlist/VCB/favorite
```

**Response:**

```json
{
  "symbol": "VCB",
  "isFavorite": true,
  "message": "Favorite status updated successfully"
}
```

---

## 6. Recommendation APIs

### 6.1 Get AI Recommendation

Get AI-powered trading recommendation based on context.

**Endpoint:** `POST /api/recommendations`  
**Auth Required:** ✅ Yes

**Request Body:**

```json
{
  "IncludePortfolio": true,
  "IncludeMarketRegime": true,
  "IncludeSignals": true
}
```

**cURL Example:**

```bash
curl -X POST \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"IncludePortfolio":true,"IncludeMarketRegime":true,"IncludeSignals":true}' \
     http://localhost:8080/api/recommendations
```

**Response:**

```json
{
  "symbol": "VNM",
  "action": "buy",
  "confidence": 78,
  "rationale": "Strong buy signal (score 8) detected. Market regime is trending-up which supports this setup. Current portfolio has 3 positions (moderate exposure). Technical indicators show bullish divergence with increasing volume.",
  "targetPrice": 92500,
  "stopLoss": 86000,
  "timeframe": "short-term",
  "generatedAt": "2026-01-14T10:30:00Z"
}
```

**Action Values:**

- `buy`: Recommend entering position
- `sell`: Recommend exiting position
- `hold`: Maintain current positions

**Timeframe Values:**

- `short-term`: 1-5 days
- `medium-term`: 1-4 weeks
- `long-term`: 1-3 months

**Confidence Score:** 0-100 (higher = more confident)

---

## Quick Start Guide

### 1. Start the Server

```bash
./bin/api-server.exe
```

### 2. Generate JWT Token

Use your preferred JWT library with this payload:

```json
{
  "user_id": 1,
  "exp": 1705276800
}
```

Sign with your `JWT_SECRET` from `.env`

### 3. Test Connection

```bash
# Health check (no auth)
curl http://localhost:8080/health

# Test authenticated endpoint
curl -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:8080/api/market/indices
```

---

## Rate Limiting

Currently no rate limiting is implemented. Future versions may add:

- 100 requests per minute per user
- 429 Too Many Requests response

---

## Environment Variables

Required configuration in `.env`:

```env
SERVER_PORT=:8080
JWT_SECRET=your-secret-key
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
DB_HOST=localhost
DB_PORT=5432
DB_USER=trading_user
DB_PASSWORD=trading_pass
DB_NAME=trading
```

---

## Support

For issues or questions:

- Check server logs for errors
- Verify JWT token is valid and not expired
- Ensure database is running and accessible
- Confirm user_id in token matches database records
