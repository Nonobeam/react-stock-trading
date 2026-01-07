# Backend API Requirements

## Overview
The frontend expects the backend to provide REST APIs for all trading functionality. Stock calculation logic has been removed from the frontend.

## Base URL
```
http://localhost:3000/api
```

## Required API Endpoints

### 1. Market Data APIs

#### GET /market/quotes/:symbol
Get current quote for a symbol
```json
{
  "symbol": "VNM",
  "price": 85000,
  "change": 500,
  "changePercent": 0.59,
  "volume": 1500000,
  "value": 127500000000,
  "high": 86000,
  "low": 84500,
  "open": 84800,
  "lastUpdated": "2026-01-07T14:30:00Z"
}
```

#### GET /market/candles/:symbol
Get candlestick data
- Query params: `timeframe` (1m, 5m, 15m, 30m, 1h, 4h, 1d), `limit` (default 100)
```json
{
  "symbol": "VNM",
  "timeframe": "15m",
  "candles": [
    {
      "time": "2026-01-07T09:00:00Z",
      "open": 84800,
      "high": 85200,
      "low": 84500,
      "close": 85000,
      "volume": 150000
    }
  ]
}
```

#### GET /market/indicators/:symbol
Get technical indicators
- Query params: `timeframe`, `indicators` (comma-separated: rsi,macd,bb,atr,etc)
```json
{
  "symbol": "VNM",
  "timeframe": "15m",
  "indicators": {
    "rsi": { "value": 65.5, "signal": "neutral" },
    "macd": { "macd": 120, "signal": 100, "histogram": 20 },
    "bb": { "upper": 86500, "middle": 85000, "lower": 83500 },
    "atr": { "value": 800 }
  }
}
```

### 2. Market Regime APIs

#### GET /regime/:symbol
Get market regime analysis
```json
{
  "symbol": "VNM",
  "regime": "trending_bullish",
  "confidence": 0.85,
  "volatility": "medium",
  "volume": "high",
  "trend": {
    "direction": "up",
    "strength": 0.78
  },
  "lastUpdated": "2026-01-07T14:30:00Z"
}
```

### 3. Trade Setup Scanner APIs

#### GET /scanner/setups
Get all trade setups
- Query params: `minScore` (0-13), `type` (all, breakout, pullback, reversal), `sector`
```json
{
  "setups": [
    {
      "id": "setup-001",
      "symbol": "VNM",
      "type": "breakout",
      "score": 11,
      "entryPrice": 85000,
      "stopPrice": 83000,
      "targetPrice": 91000,
      "riskReward": 3.0,
      "sector": "Consumer Staples",
      "createdAt": "2026-01-07T09:00:00Z"
    }
  ]
}
```

#### GET /scanner/setups/:id
Get setup details with full scorecard
```json
{
  "id": "setup-001",
  "symbol": "VNM",
  "type": "breakout",
  "score": 11,
  "scorecard": {
    "trend": 3,
    "momentum": 2,
    "support": 2,
    "volume": 2,
    "risk": 2
  },
  "entryPrice": 85000,
  "stopPrice": 83000,
  "targetPrice": 91000,
  "riskReward": 3.0,
  "description": "Strong breakout above resistance"
}
```

### 4. Risk & Position APIs

#### POST /risk/calculate
Calculate position size and risk
```json
// Request
{
  "capital": 100000000,
  "riskPercent": 2,
  "entryPrice": 85000,
  "stopPrice": 83000,
  "symbol": "VNM"
}

// Response
{
  "positionSize": 25000,
  "shares": 200,
  "lots": 2,
  "riskAmount": 2000000,
  "stopDistance": 2000,
  "stopPercent": 2.35,
  "positionValue": 17000000,
  "capitalUsed": 17.0
}
```

#### POST /risk/validate-levels
Validate price levels against Vietnam market rules
```json
// Request
{
  "symbol": "VNM",
  "exchange": "HOSE",
  "referencePrice": 84000,
  "entryPrice": 85000,
  "stopPrice": 83000,
  "targetPrice": 91000
}

// Response
{
  "valid": true,
  "priceLimit": {
    "floor": 78000,
    "ceiling": 90000
  },
  "warnings": [],
  "errors": []
}
```

### 5. Position Monitoring APIs

#### GET /positions
Get all open positions
```json
{
  "positions": [
    {
      "id": "pos-001",
      "symbol": "VNM",
      "entryPrice": 85000,
      "currentPrice": 87000,
      "shares": 200,
      "stopPrice": 83000,
      "targetPrice": 91000,
      "unrealizedPL": 400000,
      "unrealizedPLPercent": 2.35,
      "rMultiple": 1.0,
      "openDate": "2026-01-07T09:30:00Z"
    }
  ],
  "summary": {
    "totalValue": 17400000,
    "totalPL": 400000,
    "totalPLPercent": 2.35,
    "portfolioRisk": 1.8
  }
}
```

#### PUT /positions/:id/stop
Update stop loss
```json
// Request
{
  "newStopPrice": 85500,
  "method": "trailing_atr",
  "reason": "Lock in profit"
}

// Response
{
  "id": "pos-001",
  "stopPrice": 85500,
  "updatedAt": "2026-01-07T14:30:00Z"
}
```

#### POST /positions/:id/close
Close position (full or partial)
```json
// Request
{
  "closeType": "full",
  "exitPrice": 87000,
  "reason": "Target reached"
}

// Response
{
  "id": "pos-001",
  "closedAt": "2026-01-07T14:30:00Z",
  "exitPrice": 87000,
  "realizedPL": 400000,
  "rMultiple": 1.0
}
```

### 6. Performance Analytics APIs

#### GET /analytics/overview
Get performance overview
```json
{
  "totalTrades": 50,
  "winningTrades": 35,
  "losingTrades": 15,
  "winRate": 0.70,
  "expectancy": 45000,
  "profitFactor": 2.5,
  "maxDrawdown": 0.12,
  "totalPL": 2250000,
  "avgWin": 100000,
  "avgLoss": 40000
}
```

#### GET /analytics/equity-curve
Get equity curve data
```json
{
  "equity": [
    {
      "date": "2026-01-01",
      "equity": 100000000,
      "trades": 0
    },
    {
      "date": "2026-01-02",
      "equity": 100500000,
      "trades": 2
    }
  ]
}
```

#### GET /analytics/r-multiples
Get R-multiple distribution
```json
{
  "distribution": [
    { "range": "-3 to -2", "count": 2 },
    { "range": "-2 to -1", "count": 8 },
    { "range": "-1 to 0", "count": 5 },
    { "range": "0 to 1", "count": 10 },
    { "range": "1 to 2", "count": 15 },
    { "range": "2 to 3", "count": 8 },
    { "range": "3+", "count": 2 }
  ]
}
```

#### GET /analytics/setups
Get performance by setup type
```json
{
  "setups": [
    {
      "type": "breakout",
      "count": 20,
      "winRate": 0.75,
      "avgRMultiple": 1.8,
      "totalPL": 1200000
    },
    {
      "type": "pullback",
      "count": 18,
      "winRate": 0.67,
      "avgRMultiple": 1.5,
      "totalPL": 800000
    }
  ]
}
```

### 7. WebSocket APIs

#### WS /ws/market
Real-time market data stream
```json
{
  "type": "quote",
  "symbol": "VNM",
  "price": 85000,
  "volume": 1500000,
  "timestamp": "2026-01-07T14:30:00Z"
}
```

#### WS /ws/positions
Real-time position updates
```json
{
  "type": "position_update",
  "positionId": "pos-001",
  "currentPrice": 87000,
  "unrealizedPL": 400000
}
```

## Vietnam Market Rules (Backend should enforce)

1. **Price Limits**: ±7% for HOSE, ±10% for HNX
2. **Lot Size**: Minimum 100 shares per order
3. **Settlement**: T+2 business days
4. **Trading Sessions**:
   - ATO: 9:00-9:15
   - Morning: 9:15-11:30
   - Afternoon: 13:00-15:00

## Error Responses

All errors should return:
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid price level",
    "details": {}
  }
}
```

Common error codes:
- `VALIDATION_ERROR`
- `NOT_FOUND`
- `MARKET_CLOSED`
- `INSUFFICIENT_CAPITAL`
- `INVALID_PRICE_LEVEL`
- `POSITION_NOT_FOUND`

## Authentication

All requests should include:
```
Authorization: Bearer <token>
```

## Rate Limiting

- 100 requests per minute per user
- WebSocket: 1 connection per user
