# MQTT Market Data Capability

## ADDED Requirements

### Requirement: MQTT Message Types

The system SHALL support parsing and handling multiple MQTT message types from the DNSE broker.

#### Scenario: Parse MARKET_INDEX message

- **GIVEN** the system receives a message on an index topic
- **WHEN** the message type is MARKET_INDEX
- **THEN** the payload is parsed as MarketIndex data
- **AND** the index information is made available to subscribers

#### Scenario: Parse STOCK_INFO message

- **GIVEN** the system receives a message on a stock topic
- **WHEN** the message type is STOCK_INFO
- **THEN** the payload is parsed as StockInfo data containing price information

#### Scenario: Parse TOP_PRICE message

- **GIVEN** the system receives a message with bid/offer data
- **WHEN** the message type is TOP_PRICE
- **THEN** the payload is parsed as TopPrice data with bid/offer information

#### Scenario: Parse BOARD_EVENT message

- **GIVEN** the system receives a session change notification
- **WHEN** the message type is BOARD_EVENT
- **THEN** the payload is parsed as BoardEvent data indicating session changes

#### Scenario: Parse OHLC message

- **GIVEN** the system receives candlestick data
- **WHEN** the message type is OHLC
- **THEN** the payload is parsed as OHLC data with open/high/low/close values

#### Scenario: Parse TICK message

- **GIVEN** the system receives order matching data
- **WHEN** the message type is TICK
- **THEN** the payload is parsed as Tick data with matching information

### Requirement: MQTT Broker Connection

The system SHALL establish a secure WebSocket connection to the DNSE MQTT broker on application startup for receiving real-time market data.

#### Scenario: Automatic connection on startup

- **GIVEN** the application starts
- **WHEN** MQTT is enabled in configuration
- **THEN** a WSS connection is automatically initiated to `wss://datafeed-lts-krx.dnse.com.vn:443/wss`
- **AND** the connection status is set to "connecting"

#### Scenario: Successful connection

- **GIVEN** valid MQTT credentials are available
- **WHEN** the application initiates MQTT connection
- **THEN** a WSS connection is established to `wss://datafeed-lts-krx.dnse.com.vn:443/wss`
- **AND** the connection status is set to "connected"

#### Scenario: Connection with dynamic password

- **GIVEN** the MQTT password must be retrieved from an API
- **WHEN** the application initiates MQTT connection
- **THEN** the password is fetched from `GET /api/jwt-token` before connecting
- **AND** the connection uses username `1001986205` with the retrieved JWT token as password

#### Scenario: Connection failure handling

- **GIVEN** the MQTT broker is unavailable or credentials are invalid
- **WHEN** the connection attempt fails
- **THEN** the system logs the error
- **AND** the connection status is set to "disconnected"
- **AND** the application continues to function with fallback data sources

### Requirement: Automatic Reconnection

The system SHALL automatically attempt to reconnect when the MQTT connection is lost.

#### Scenario: Reconnection after disconnect

- **GIVEN** an established MQTT connection
- **WHEN** the connection is unexpectedly lost
- **THEN** the system attempts to reconnect with exponential backoff
- **AND** the connection status is set to "reconnecting"

#### Scenario: Subscription restoration

- **GIVEN** the system was subscribed to topics before disconnection
- **WHEN** reconnection is successful
- **THEN** all previous topic subscriptions are automatically restored

#### Scenario: Max reconnection attempts

- **GIVEN** multiple reconnection attempts have failed
- **WHEN** the maximum retry limit is reached
- **THEN** the system stops reconnection attempts
- **AND** the connection status remains "disconnected"
- **AND** the user may be notified of the connection issue

### Requirement: Dynamic Index Subscription UI

The system SHALL provide a user interface for subscribing to additional market indices beyond the defaults.

#### Scenario: Display subscription input

- **GIVEN** the user is viewing the market data section
- **WHEN** the index subscription component renders
- **THEN** an input field is displayed for entering index names
- **AND** an "Add" button is available to subscribe
- **AND** the component follows the Fintech Neon theme styling

#### Scenario: Add custom index subscription

- **GIVEN** the user enters an index name in the input field
- **WHEN** the user clicks the "Add" button
- **THEN** the system subscribes to topic `plaintext/quotes/krx/mdds/index/{indexName}`
- **AND** the index is added to the list of subscribed indices
- **AND** the input field is cleared

#### Scenario: Display subscribed indices

- **GIVEN** the user has subscribed to one or more indices
- **WHEN** the subscription component renders
- **THEN** a list of all subscribed indices is displayed
- **AND** each index has a remove button

#### Scenario: Remove custom index subscription

- **GIVEN** a list of subscribed indices is displayed
- **WHEN** the user clicks the remove button for an index
- **THEN** the system unsubscribes from that index topic
- **AND** the index is removed from the displayed list

#### Scenario: Persist custom subscriptions

- **GIVEN** the user has added custom index subscriptions
- **WHEN** the application reloads
- **THEN** the custom subscriptions are restored from storage
- **AND** the system resubscribes to the stored indices

### Requirement: Index Quote Subscription

The system SHALL subscribe to VNINDEX and VN30 topics to receive real-time index quotes.

#### Scenario: Subscribe to VNINDEX

- **GIVEN** an established MQTT connection
- **WHEN** the market data feature requests VNINDEX data
- **THEN** the system subscribes to topic `plaintext/quotes/krx/mdds/index/VNINDEX`
- **AND** incoming messages are parsed and made available to the application

#### Scenario: Subscribe to VN30

- **GIVEN** an established MQTT connection
- **WHEN** the market data feature requests VN30 data
- **THEN** the system subscribes to topic `plaintext/quotes/krx/mdds/index/VN30`
- **AND** incoming messages are parsed and made available to the application

#### Scenario: Receive index quote update

- **GIVEN** the system is subscribed to an index topic
- **WHEN** a new quote message is received
- **THEN** the message is parsed to extract index values
- **AND** the market data context is updated with the new values
- **AND** subscribed components receive the update

### Requirement: MQTT Context Provider

The system SHALL provide a React context for MQTT functionality accessible throughout the application.

#### Scenario: Access MQTT status from component

- **GIVEN** a component wrapped in MQTTProvider
- **WHEN** the component uses the useMQTT hook
- **THEN** it receives the current connection status
- **AND** it receives methods to subscribe/unsubscribe from topics

#### Scenario: Subscribe to topic via hook

- **GIVEN** an MQTT connection is established
- **WHEN** a component calls subscribe with a topic and handler
- **THEN** the component receives messages for that topic via the handler callback

#### Scenario: Cleanup on unmount

- **GIVEN** a component has subscribed to MQTT topics
- **WHEN** the component unmounts
- **THEN** the subscriptions are automatically cleaned up
- **AND** no memory leaks occur

### Requirement: Market Data Integration

The system SHALL integrate MQTT real-time data with the existing MarketDataContext for seamless consumption.

#### Scenario: Use MQTT data when available

- **GIVEN** MQTT connection is established and receiving data
- **WHEN** components request market data via useMarketData hook
- **THEN** they receive real-time data from MQTT
- **AND** the data format is consistent with existing MarketData interface

#### Scenario: Fallback to polling when MQTT unavailable

- **GIVEN** MQTT connection is not available or disabled
- **WHEN** components request market data via useMarketData hook
- **THEN** the system falls back to polling HTTP APIs or mock data
- **AND** components continue to function without errors

#### Scenario: Feature flag control

- **GIVEN** an MQTT feature flag exists in configuration
- **WHEN** the feature flag is disabled
- **THEN** MQTT connection is not attempted
- **AND** the system uses fallback data sources exclusively

### Requirement: Graceful Disconnection

The system SHALL cleanly disconnect from the MQTT broker when appropriate.

#### Scenario: Disconnect on app unmount

- **GIVEN** an established MQTT connection
- **WHEN** the application unmounts or navigates away
- **THEN** the MQTT connection is properly closed
- **AND** all subscriptions are unsubscribed
- **AND** resources are released

#### Scenario: Manual disconnect

- **GIVEN** an established MQTT connection
- **WHEN** the disconnect method is called
- **THEN** the connection is closed gracefully
- **AND** the connection status is set to "disconnected"
