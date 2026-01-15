# Tasks: Implement MQTT Real-Time Market Data

## 1. Setup & Configuration

- [x] 1.1 Add MQTT configuration constants to `src/shared/constants/config.ts`
  - Broker URL: `wss://datafeed-lts-krx.dnse.com.vn:443/wss`
  - Username: `1001986205`
  - Default topic patterns for VNINDEX/VN30
  - Auto-connect on startup: `true`
- [x] 1.2 Create MQTT-specific types in `src/shared/types/mqtt.ts`
  - Connection status type
  - Message type enum: MARKET_INDEX, STOCK_INFO, TOP_PRICE, BOARD_EVENT, OHLC, TICK
  - MarketIndex payload interface
  - StockInfo payload interface
  - TopPrice payload interface
  - BoardEvent payload interface
  - OHLC payload interface
  - Tick payload interface
  - Subscription options interface
- [x] 1.3 Export types from `src/shared/types/index.ts`

## 2. MQTT Service Layer

- [x] 2.1 Create `src/services/mqtt/` directory structure
- [x] 2.2 Implement `src/services/mqtt/types.ts` with service-level types
  - MQTTClientOptions interface
  - MessageHandler callback types for each message type
- [x] 2.3 Implement `src/services/mqtt/api.ts` for password retrieval
  - `getJwtToken()` function to call `GET /api/jwt-token` for MQTT password
- [x] 2.4 Implement `src/services/mqtt/client.ts` MQTTClient class
  - Constructor with broker configuration
  - `connect(options)` - Establish WSS connection with credentials
  - `disconnect()` - Clean disconnect and resource cleanup
  - `subscribe(topic, qos, handler)` - Topic subscription with callback
  - `unsubscribe(topic)` - Unsubscribe from topic
  - Connection status management and callbacks
  - Automatic reconnection with exponential backoff
  - Subscription restoration after reconnect
  - Message type parsing and routing
- [x] 2.5 Create `src/services/mqtt/index.ts` barrel export
- [x] 2.6 Export MQTT service from `src/services/api/index.ts`

## 3. React Context Integration

- [x] 3.1 Create `src/context/MQTTContext.tsx`
  - MQTTProvider component
  - useMQTT hook
  - Connection state management (connecting, connected, disconnected, reconnecting)
  - Auto-connect on mount (enabled by default)
  - Subscribe/unsubscribe methods exposed via context
  - Message payload state for subscribed topics
  - Support for dynamic topic subscription
- [x] 3.2 Add MQTTProvider to context barrel export `src/context/index.tsx`
- [x] 3.3 Add MQTTProvider to app root component tree (in `App.tsx`)

## 4. Market Data Integration

- [x] 4.1 Create specialized hook `useIndexQuotes()` in `src/shared/hooks/`
  - Subscribe to VNINDEX and VN30 topics by default
  - Support subscribing to additional indices dynamically
  - Parse MARKET_INDEX messages and transform to app format
  - Handle subscription lifecycle
- [x] 4.2 Modify `MarketDataContext.tsx` to consume MQTT data
  - Check for MQTT availability
  - Use real-time data when MQTT connected
  - Fallback to polling/mock when MQTT unavailable
  - Merge MQTT updates with existing market data structure
- [x] 4.3 Add feature flag for MQTT enable/disable in config

## 5. Index Subscription UI

- [x] 5.1 Create `IndexSubscriptionInput` component in `src/shared/components/`
  - Text input field for entering index name
  - Add button to subscribe to new index
  - List of currently subscribed indices
  - Remove button for each subscribed index
  - Follow Fintech Neon theme styling
- [x] 5.2 Integrate `IndexSubscriptionInput` into dashboard or market view
- [x] 5.3 Persist user's custom index subscriptions (localStorage or API)

## 6. Testing & Validation

- [ ] 6.1 Manual test: Connect to DNSE MQTT broker on app startup
- [ ] 6.2 Manual test: Subscribe to VNINDEX topic and verify messages received
- [ ] 6.3 Manual test: Subscribe to VN30 topic and verify messages received
- [ ] 6.4 Manual test: Add custom index via input box and verify subscription
- [ ] 6.5 Manual test: Remove custom index and verify unsubscription
- [ ] 6.6 Manual test: Verify reconnection after network interruption
- [ ] 6.7 Manual test: Verify subscription restoration after reconnect
- [ ] 6.8 Manual test: Verify graceful fallback when MQTT unavailable
- [ ] 6.9 Verify no memory leaks on component unmount

## 7. Documentation

- [ ] 7.1 Add MQTT configuration section to project README or docs
- [ ] 7.2 Document message types and payload structures
- [ ] 7.3 Update API_DOCUMENT.md with JWT token endpoint details

## Dependencies

- Tasks 2.x must complete before 3.x (service before context)
- Task 1.x can run in parallel with early 2.x tasks
- Task 4.x depends on 3.x completion
- Task 5.x depends on 3.x and 4.x completion
- Task 6.x requires all prior tasks complete
