# Market Data Visualization

## ADDED Requirements

### Requirement: Display Real-Time Price Charts
**Priority**: P0  
**Dependencies**: Backend OHLCV API, WebSocket market data

The system SHALL display candlestick price charts with historical data and real-time updates so users can understand price action and make informed trading decisions.

#### Scenario: View Candlestick Chart
**Given** a user selects a stock symbol (e.g., "FPT")  
**When** the chart module loads  
**Then** the system displays:
- Candlestick chart with OHLCV data for the selected timeframe
- Time axis (x) and price axis (y) with appropriate scaling
- Volume bars below the price chart (15% of chart height)
- Interactive zoom and pan controls
- Current price highlighted on the latest candle

#### Scenario: Switch Timeframe
**Given** a user is viewing a daily chart  
**When** the user selects "Weekly" from the interval dropdown  
**Then** the system:
- Fetches weekly OHLCV data from the backend
- Re-renders the chart with weekly candles
- Adjusts the time axis scale appropriately
- Maintains the same symbol selection

#### Scenario: Real-Time Price Updates
**Given** a user is viewing a chart with WebSocket connected  
**When** a new price tick arrives for the current symbol  
**Then** the system:
- Updates the latest candle's OHLC values
- Animates the price change (color flash)
- Updates the current price label
- Does NOT cause the entire chart to re-render

---

### Requirement: Overlay Technical Indicators
**Priority**: P0  
**Dependencies**: Backend technical indicators API

The system SHALL allow users to overlay multiple technical indicators (SMA, EMA, Bollinger Bands, VWAP) on the price chart to analyze trends and support/resistance levels.

#### Scenario: Enable Moving Average Overlays
**Given** a user is viewing a price chart  
**When** the user enables "SMA 20" from the indicators menu  
**Then** the system:
- Fetches SMA(20) data from the backend
- Renders a line overlay on the chart with distinct color
- Shows a legend indicating "SMA(20)" with its color
- Allows toggling the indicator on/off without reloading data

#### Scenario: Display Bollinger Bands
**Given** a user enables "Bollinger Bands (20, 2)" indicator  
**When** the chart renders  
**Then** the system displays:
- Upper band line (light blue)
- Middle band line (SMA 20, gray)
- Lower band line (light blue)
- Shaded area between upper and lower bands
- Legend entry "BB(20,2)"

#### Scenario: Overlay Multiple Indicators
**Given** a user has enabled SMA(20), EMA(50), and VWAP  
**When** the chart renders  
**Then** the system:
- Displays all three indicators with distinct colors
- Maintains chart readability (no overlapping legends)
- Updates all indicators in real-time with new price data
- Allows independent toggling of each indicator

---

### Requirement: Display Technical Indicator Panels
**Priority**: P0  
**Dependencies**: Backend technical indicators API

The system MUST display key momentum and volatility indicators (RSI, MACD, Stochastic, ADX, ATR) in dedicated panels with clear interpretations.

#### Scenario: Display RSI Indicator
**Given** a user is viewing a stock chart  
**When** the technical indicator panel loads  
**Then** the system displays:
- RSI value (0-100 scale) with a gauge visualization
- Color coding: Green (<30 oversold), Yellow (30-70 neutral), Red (>70 overbought)
- Current reading (e.g., "RSI: 45")
- Interpretation label (e.g., "Neutral")
- Tooltip on hover explaining RSI meaning

#### Scenario: Display MACD Indicator
**Given** a user is viewing the indicator panel  
**When** MACD data is available  
**Then** the system shows:
- MACD line (blue)
- Signal line (red)
- Histogram bars (green for positive, red for negative)
- Current values: "MACD: +0.23, Signal: +0.18, Hist: +0.05"
- Bullish/Bearish crossover indicator (↑ Bullish or ↓ Bearish)

#### Scenario: Display ADX Trend Strength
**Given** a user views the ADX indicator  
**When** ADX value is calculated  
**Then** the system displays:
- ADX value (0-100) as a horizontal bar
- Color zones: <20 (Gray - No Trend), 20-40 (Yellow - Trending), >40 (Green - Strong Trend)
- Current reading (e.g., "ADX: 28")
- Interpretation (e.g., "Trending")

#### Scenario: Display ATR Volatility
**Given** a user views the ATR indicator  
**When** ATR data is available  
**Then** the system shows:
- ATR value (absolute)
- ATR as percentage of current price
- Volatility classification: Low (<3%), Normal (3-5%), High (5-8%), Extreme (>8%)
- Color coding: Green (Low), Yellow (Normal), Orange (High), Red (Extreme)

---

### Requirement: Provide Indicator Explanations
**Priority**: P1  
**Dependencies**: None (static content)

The system SHALL provide clear, educational explanations for each indicator so users can understand what they measure and how to interpret them.

#### Scenario: View Indicator Tooltip
**Given** a user hovers over an indicator name (e.g., "RSI")  
**When** the tooltip appears  
**Then** the system displays:
- **What it measures**: "Relative Strength Index measures momentum"
- **Current state**: "Neutral (45/100)"
- **Suggested action**: "No clear signal - wait for <30 or >70"
- **Reference**: Link to learn more

#### Scenario: View MACD Interpretation
**Given** a user clicks the info icon next to "MACD"  
**When** the explanation modal opens  
**Then** the system shows:
- Full name: "Moving Average Convergence Divergence"
- Purpose: "Identifies trend direction and momentum"
- How to read: Crossovers, histogram interpretation
- Current state with context
- Common trading strategies

---

### Requirement: Optimize Chart Performance
**Priority**: P0  
**Dependencies**: Charting library selection

The chart MUST render smoothly with real-time updates and handle large datasets without performance degradation.

#### Scenario: Handle Large Dataset
**Given** a user loads 2 years of daily OHLCV data (500+ candles)  
**When** the chart renders  
**Then** the system:
- Renders the chart in <2 seconds
- Maintains 60 FPS during pan/zoom interactions
- Implements data decimation for distant candles
- Loads additional data lazily on scroll

#### Scenario: Efficient Real-Time Updates
**Given** the chart is displaying live data with WebSocket connected  
**When** price updates arrive every second  
**Then** the system:
- Updates only the affected candle, not entire chart
- Uses React.memo to prevent unnecessary re-renders
- Maintains smooth animations
- Does not block user interactions

---

### Requirement: Support Symbol Selection
**Priority**: P0  
**Dependencies**: Backend stock list API

The system SHALL allow users to search and select stocks to view their charts and indicators.

#### Scenario: Search for Stock Symbol
**Given** a user clicks the symbol selector dropdown  
**When** the user types "FPT"  
**Then** the system:
- Filters the stock list to show matches
- Displays "FPT - FPT Corporation"
- Shows sector badge (e.g., "Technology")
- Allows selection with click or Enter key

#### Scenario: Switch Stock Symbol
**Given** a user is viewing "FPT" chart  
**When** the user selects "VNM" from the dropdown  
**Then** the system:
- Unsubscribes from "FPT" WebSocket channel
- Subscribes to "VNM" WebSocket channel
- Fetches "VNM" OHLCV and indicator data
- Re-renders chart with new data
- Maintains selected timeframe and indicator settings
