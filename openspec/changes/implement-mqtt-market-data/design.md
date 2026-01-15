# Design: MQTT Real-Time Market Data

## Context

The application needs real-time market index data (VNINDEX, VN30) from DNSE's MQTT broker. This is a cross-cutting change that introduces a new communication pattern (MQTT) alongside the existing WebSocket infrastructure.

**Stakeholders:**
- End users requiring real-time market data
- Dashboard components displaying index values
- Trading components needing up-to-date market context

**Constraints:**
- Must use WSS protocol (secure WebSocket) for MQTT transport
- Password must be fetched dynamically from API before connecting
- Must handle reconnection and subscription restoration gracefully
- Must align with existing React context patterns in the codebase

## Goals / Non-Goals

### Goals
- Establish reliable MQTT connection to DNSE broker over WSS on application startup
- Subscribe to VNINDEX and VN30 topics for real-time index quotes
- Support dynamic subscription to additional indices via user input
- Handle multiple message types: MARKET_INDEX, STOCK_INFO, TOP_PRICE, BOARD_EVENT, OHLC, TICK
- Expose MQTT data through React context for component consumption
- Handle connection lifecycle (connect, disconnect, reconnect)
- Integrate with existing `MarketDataContext` for seamless data flow

### Non-Goals
- Publishing messages to MQTT (read-only subscription for now)
- Supporting other brokers or protocols beyond DNSE's WSS endpoint
- Replacing existing WebSocket client (MQTT is additive, not a replacement)
- Implementing full MQTT QoS 2 (will use QoS 0 or 1 for simplicity)
- Historical data retrieval (real-time only)

## Message Types

The MQTT broker sends different message types:

| Type         | Payload     | Description              |
| ------------ | ----------- | ------------------------ |
| MARKET_INDEX | MarketIndex | Index information        |
| STOCK_INFO   | StockInfo   | Stock price information  |
| TOP_PRICE    | TopPrice    | Bid/Offer information    |
| BOARD_EVENT  | BoardEvent  | Session change events    |
| OHLC         | OHLC        | Candlestick information  |
| TICK         | Tick        | Order matching info      |

## Decisions

### Decision 1: Separate MQTTClient Service

**What:** Create a standalone `MQTTClient` class in `src/services/mqtt/client.ts`

**Why:** 
- Follows existing pattern (`src/services/websocket/client.ts`)
- Separates MQTT protocol handling from React lifecycle
- Enables unit testing of connection logic
- Can be reused outside React context if needed

**Alternatives considered:**
- Inline MQTT logic in context: Rejected due to poor separation of concerns
- Extend existing WebSocketClient: Rejected as MQTT is fundamentally different protocol

### Decision 2: MQTTContext for React Integration

**What:** Create `MQTTContext.tsx` following the same pattern as `WebSocketContext.tsx`

**Why:**
- Consistent architecture with existing codebase
- Provides connection state, status, and message callbacks
- Enables any component to access MQTT functionality
- Supports hot-swapping between mock and real data

### Decision 3: Dynamic Password Retrieval

**What:** Fetch MQTT password from API before establishing connection

**Why:**
- Security: Password should not be hardcoded or exposed in client bundle
- Flexibility: Password/token may expire and need refresh
- Aligns with existing authentication patterns in the app

**Implementation:**
```typescript
// GET /api/jwt-token
const password = await mqttApi.getJwtToken();
mqttClient.connect({ username, password });
```

### Decision 4: Topic Subscription Management

**What:** Centralized topic registry with typed handlers

**Why:**
- Type-safe message handling for different topic patterns
- Easy to add new topics without modifying core client
- Supports wildcard topics if needed in future

**Topic Pattern:**
```
plaintext/quotes/krx/mdds/index/{indexName}
```

### Decision 5: Integration with MarketDataContext

**What:** `MarketDataContext` will consume MQTT data when available, falling back to polling/mock

**Why:**
- Transparent upgrade path for existing components
- No changes needed to dashboard components consuming market data
- Graceful degradation if MQTT unavailable

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        React App                             │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                    MQTTProvider                         │ │
│  │  ┌────────────────┐    ┌─────────────────────────────┐ │ │
│  │  │   MQTTClient   │───▶│   Connection State/Status   │ │ │
│  │  │   (service)    │    │   Message Callbacks         │ │ │
│  │  └───────┬────────┘    └─────────────────────────────┘ │ │
│  │          │                                              │ │
│  └──────────┼──────────────────────────────────────────────┘ │
│             │                                                │
│             ▼                                                │
│  ┌──────────────────────────────────────────────────────────┐│
│  │                  MarketDataProvider                       ││
│  │  • Consumes MQTT index updates                           ││
│  │  • Falls back to polling if MQTT unavailable             ││
│  │  • Provides unified marketData to components             ││
│  └──────────────────────────────────────────────────────────┘│
│             │                                                │
│             ▼                                                │
│  ┌──────────────────────────────────────────────────────────┐│
│  │           Dashboard / Trading Components                  ││
│  │  • useMarketData() hook (unchanged API)                  ││
│  └──────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘

                            │
                            │ WSS (port 443)
                            ▼
              ┌─────────────────────────────┐
              │   DNSE MQTT Broker          │
              │   datafeed-lts-krx.dnse.com.vn │
              │                             │
              │   Topics:                   │
              │   • .../index/VNINDEX       │
              │   • .../index/VN30          │
              └─────────────────────────────┘
```

## Risks / Trade-offs

| Risk | Impact | Mitigation |
|------|--------|------------|
| MQTT broker unavailable | No real-time data | Graceful fallback to polling/mock data |
| Password API fails | Cannot connect | Retry logic with exponential backoff; show user notification |
| Message format changes | Parse errors | Defensive parsing with validation; log unknown formats |
| High message frequency | Performance issues | Throttle updates (max 1/sec per topic); use requestAnimationFrame |
| Memory leaks | App slowdown | Proper cleanup on unmount; unsubscribe on disconnect |

## Migration Plan

1. **Phase 1:** Add MQTT service and context (no integration yet)
2. **Phase 2:** Integrate with MarketDataContext as optional data source
3. **Phase 3:** Enable MQTT by default when credentials available
4. **Rollback:** Feature flag to disable MQTT and revert to polling

## File Structure

```
src/
├── services/
│   └── mqtt/
│       ├── index.ts          # Barrel export
│       ├── client.ts         # MQTTClient class
│       ├── types.ts          # MQTT-specific types
│       └── api.ts            # API for password retrieval
├── context/
│   └── MQTTContext.tsx       # React context provider
└── shared/
    ├── types/
    │   └── mqtt.ts           # Index message types
    └── constants/
        └── config.ts         # MQTT config (existing file, add MQTT section)
```
