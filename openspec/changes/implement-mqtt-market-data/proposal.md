# Change: Implement MQTT Real-Time Market Data

## Why

The application currently relies on mock data or polling HTTP APIs for market data. To provide real-time index quotes (VNINDEX, VN30) with low latency, we need to integrate with DNSE's MQTT broker for live market data streaming via the WebSocket Secure (WSS) protocol.

## What Changes

- Add new `MQTTClient` service class for MQTT connectivity over WSS
- Create `MQTTContext` React context for application-wide MQTT state management
- Integrate MQTT data feed into `MarketDataContext` for real-time index updates
- Add configuration for DNSE MQTT broker credentials (with dynamic password retrieval from API)
- Subscribe to index topics: `plaintext/quotes/krx/mdds/index/VNINDEX`, `plaintext/quotes/krx/mdds/index/VN30`

## Impact

- **Affected code:**
  - `src/services/` - New `mqtt/` service module
  - `src/context/` - New `MQTTContext.tsx` + modified `MarketDataContext.tsx`
  - `src/shared/types/` - New market data types for MQTT messages
  - `src/shared/constants/config.ts` - MQTT configuration constants

- **Dependencies:**
  - Uses existing `mqtt` package (already installed, v5.14.1)
  - Requires API endpoint for retrieving MQTT password

## Configuration

**MQTT Broker Details:**
- **Protocol:** WSS (WebSocket Secure)
- **Server:** `datafeed-lts-krx.dnse.com.vn`
- **Port:** 443
- **Path:** `/wss`
- **Username:** `1001986205`
- **Password:** Retrieved dynamically from authentication API

**Topic Subscriptions:**
- `plaintext/quotes/krx/mdds/index/VNINDEX` - VN-Index quotes
- `plaintext/quotes/krx/mdds/index/VN30` - VN30 index quotes

## Message Types

| Type         | Payload     | Description              | MQTT Topic   |
| ------------ | ----------- | ------------------------ | ------------ |
| MARKET_INDEX | MarketIndex | Index information        | Market Index |
| STOCK_INFO   | StockInfo   | Stock price information  | Stock Info   |
| TOP_PRICE    | TopPrice    | Bid/Offer information    | Top Price    |
| BOARD_EVENT  | BoardEvent  | Session change events    | Board Event  |
| OHLC         | OHLC        | Candlestick information  | OHLC         |
| TICK         | Tick        | Order matching info      | Tick         |

## Open Questions

1. ~~What is the exact API endpoint to retrieve the MQTT password?~~ **Resolved:** `GET /api/jwt-token`
2. ~~What is the expected message format/schema for index data on the MQTT topics?~~ **Resolved:** See Message Types table above
3. ~~Should MQTT connection be established on app startup or on-demand when viewing market data?~~ **Resolved:** On startup
4. ~~Is there a need to support additional topics beyond VNINDEX/VN30 (e.g., individual stock quotes)?~~ **Resolved:** Yes, provide UI input box for additional index names
