# Market Data Integration

## ADDED Requirements

### Requirement: Fetch Historical Daily Bars
**Priority**: P0  
**Dependencies**: Backend `/market/history/daily` endpoint

The system SHALL fetch and display historical daily OHLCV bars for selected symbols.

#### Scenario: Fetch Daily Bars for Last 90 Days
**Given** user selects symbol "VNM" and timeframe "D" (daily)  
**When** MarketDataView loads  
**Then** the system:
- Calculates date range: from = today - 90 days, to = today
- Calls `apiClient.getHistoricalDaily("VNM", "2023-07-29", "2023-10-27")`
- Sends GET request to `/market/history/daily?symbol=VNM&from=2023-07-29&to=2023-10-27`
- Receives array of daily bars:
  ```json
  [
    {
      "symbol": "VNM",
      "date": "2023-10-27T00:00:00Z",
      "open": 68.5,
      "high": 69.2,
      "low": 68.1,
      "close": 69.0,
      "volume": 1500000,
      "turnover": 10350000000
    },
    ...
  ]
  ```
- Displays candlestick chart with 90 daily bars

#### Scenario: Display Daily Bars in Chart
**Given** daily bars fetched successfully  
**When** chart component renders  
**Then** the system displays:
- **Candlestick Chart**: Green candles (close > open), red candles (close < open)
- **X-Axis**: Dates formatted as "DD/MM" (e.g., "27/10")
- **Y-Axis**: Price in thousands VND (e.g., "68", "69", "70")
- **Volume Bar Chart**: Below candlesticks, scaled to max volume
- **Hover Tooltip**: Shows OHLCV values for selected candle

#### Scenario: Handle No Data Response
**Given** user selects a newly listed stock with no historical data  
**When** daily bars fetch returns empty array  
**Then** the system:
- Displays message: "No historical data available for this symbol"
- Shows empty chart with axis labels
- Provides "Refresh" button to retry

---

### Requirement: Fetch Historical Intraday Bars
**Priority**: P0  
**Dependencies**: Backend `/market/history/intraday` endpoint

The system SHALL fetch and display intraday minute-level OHLCV bars for selected intervals.

#### Scenario: Fetch 5-Minute Bars
**Given** user selects symbol "VNM" and timeframe "5m"  
**When** MarketDataView loads  
**Then** the system:
- Calculates time range: from = today 9:00 AM, to = current time
- Calls `apiClient.getHistoricalIntraday("VNM", "5m", "2023-10-27T09:00:00Z", "2023-10-27T14:30:00Z")`
- Sends GET request to `/market/history/intraday?symbol=VNM&interval=5m&from=...&to=...`
- Receives array of 5-minute bars:
  ```json
  [
    {
      "symbol": "VNM",
      "timestamp": "2023-10-27T10:30:00Z",
      "open": 68.8,
      "high": 68.9,
      "low": 68.7,
      "close": 68.8,
      "volume": 50000
    },
    ...
  ]
  ```
- Displays candlestick chart with intraday bars

#### Scenario: Support Multiple Intervals
**Given** user can select timeframe  
**When** user chooses from dropdown  
**Then** the system supports:
- **1m**: 1-minute bars (max 240 bars, 4 hours)
- **5m**: 5-minute bars (max 480 bars, 40 hours ~2 days)
- **15m**: 15-minute bars (max 672 bars, 7 days)
- **30m**: 30-minute bars (max 960 bars, 20 days)
- **1h**: 1-hour bars (max 720 bars, 30 days)

#### Scenario: Intraday Chart Display
**Given** 5-minute bars fetched successfully  
**When** chart component renders  
**Then** the system displays:
- **Candlestick Chart**: Same styling as daily (green/red candles)
- **X-Axis**: Time formatted as "HH:MM" (e.g., "10:30", "11:00")
- **Y-Axis**: Price in thousands VND
- **Volume Bars**: Below candlesticks
- **Trading Session Markers**: Vertical lines at 9:00, 11:30, 13:00, 15:00

---

### Requirement: Display Symbol Information
**Priority**: P0  
**Dependencies**: Backend `/market/symbol/{symbol}` endpoint

The system SHALL display current price, price limits, and real-time stats for the selected symbol.

#### Scenario: Fetch and Display Symbol Info
**Given** user selects symbol "VNM"  
**When** MarketDataView loads  
**Then** the system:
- Calls `apiClient.getSymbolInfo("VNM")`
- Sends GET request to `/market/symbol/VNM`
- Receives symbol info:
  ```json
  {
    "symbol": "VNM",
    "lastPrice": 69.0,
    "change": 0.5,
    "changePercent": 0.72,
    "ceiling": 73.8,
    "floor": 64.2,
    "reference": 69.0,
    "bidPrice": 68.9,
    "askPrice": 69.1,
    "volume": 2000000,
    "timestamp": "2023-10-27T11:00:00Z"
  }
  ```
- Displays in header section

#### Scenario: Symbol Info Header Display
**Given** symbol info fetched for VNM  
**When** header renders  
**Then** the system displays:
- **Symbol Name**: VNM (large, bold)
- **Last Price**: 69,000 VND (formatted with thousands separator)
- **Change**: +500 VND (+0.72%) in **green** (positive change)
- **Price Limits**: 
  - Ceiling: 73,800 VND (red indicator)
  - Floor: 64,200 VND (green indicator)
  - Reference: 69,000 VND (yellow indicator)
- **Bid/Ask Spread**: 68.9 / 69.1 (formatted as "Bid: 68,900 | Ask: 69,100")
- **Volume**: 2,000,000 shares

#### Scenario: Negative Price Change Display
**Given** symbol HPG with change -0.3 (-1.15%)  
**When** symbol info displays  
**Then** the system shows:
- **Last Price**: 25,900 VND
- **Change**: -300 VND (-1.15%) in **red** (negative change)
- Down arrow icon: ▼ in red

#### Scenario: Symbol at Ceiling Price
**Given** symbol VNM hits ceiling price 73.8  
**When** symbol info displays  
**Then** the system:
- Highlights last price in **red**
- Shows badge: "🔴 CEILING" in red
- Displays warning: "Price has reached maximum daily limit"

#### Scenario: Symbol at Floor Price
**Given** symbol FPT hits floor price 64.2  
**When** symbol info displays  
**Then** the system:
- Highlights last price in **green**
- Shows badge: "🟢 FLOOR" in green
- Displays warning: "Price has reached minimum daily limit"

---

### Requirement: Update Symbol Info from WebSocket
**Priority**: P1  
**Dependencies**: WebSocket STOCK_INFO messages

The system SHALL update symbol information in real-time as price changes occur.

#### Scenario: Receive STOCK_INFO WebSocket Message
**Given** MarketDataView displays VNM with price 69.0  
**When** WebSocket receives message:
```json
{
  "type": "STOCK_INFO",
  "data": {
    "symbol": "VNM",
    "lastPrice": 69.2,
    "change": 0.7,
    "changePercent": 1.01,
    "ceiling": 73.8,
    "floor": 64.2,
    "volume": 2050000,
    "hitCeiling": false,
    "hitFloor": false,
    "timestamp": "2023-10-27T11:01:00Z"
  }
}
```  
**Then** the system:
- Updates last price to 69,200 VND
- Updates change to +700 VND (+1.01%)
- Updates volume to 2,050,000
- Flashes price in **green** briefly (0.5s) to indicate increase
- Does NOT refetch historical bars (only updates header)

#### Scenario: Price Flash Animation
**Given** last price updates from 69.0 to 69.2  
**When** update occurs  
**Then** the system:
- Applies CSS animation to price element
- Flashes background in **green** (positive change) for 0.5 seconds
- Fades back to normal background
- If price decreases, flash in **red** instead

---

### Requirement: Chart Integration with Live Updates
**Priority**: P1  
**Dependencies**: WebSocket OHLC messages

The system SHALL append new intraday bars to the chart as they complete.

#### Scenario: Receive OHLC WebSocket Message
**Given** chart displays 5-minute bars for VNM  
**When** WebSocket receives new completed bar:
```json
{
  "type": "OHLC",
  "data": {
    "symbol": "VNM",
    "interval": "5m",
    "open": 69.0,
    "high": 69.3,
    "low": 68.9,
    "close": 69.2,
    "volume": 52000,
    "timestamp": "2023-10-27T11:05:00Z"
  }
}
```  
**Then** the system:
- Appends new bar to chart data
- Re-renders chart with updated data
- Maintains scroll position (does not jump to start)
- Removes oldest bar if max limit reached (e.g., 480 bars for 5m)

#### Scenario: Update Current Bar in Progress
**Given** current 5-minute bar is still forming (10:35:30)  
**When** WebSocket receives price update  
**Then** the system:
- Updates current bar's high/low/close if new price exceeds
- Does not add new bar (wait until 10:40:00)
- Shows "live" indicator on chart (e.g., blinking dot)

---

### Requirement: Error Handling for Market Data
**Priority**: P0  
**Dependencies**: None

The system SHALL handle errors gracefully when market data APIs fail.

#### Scenario: Historical Data Fetch Fails
**Given** backend API is unavailable  
**When** `getHistoricalDaily()` or `getHistoricalIntraday()` fails  
**Then** the system:
- Displays error message: "Failed to load historical data. Please try again."
- Shows "Retry" button
- Logs error to console for debugging
- Does not show stale data

#### Scenario: Symbol Info Fetch Fails
**Given** symbol does not exist or API error  
**When** `getSymbolInfo("INVALID")` fails with 404  
**Then** the system:
- Displays error: "Symbol 'INVALID' not found"
- Suggests: "Please select a different symbol from the dropdown"
- Disables chart display until valid symbol selected

---

### Requirement: Navy Theme Consistency
**Priority**: P1  
**Dependencies**: Design System

All market data UI components SHALL follow the navy theme design system.

#### Scenario: Symbol Info Header Styling
**Given** Symbol Info Header renders  
**When** displayed on screen  
**Then** the header uses:
- **Background**: `var(--panel)` (#0b1a3a)
- **Symbol Name**: `var(--text)` (#DDEBFF), bold, 24px
- **Price**: `var(--text)`, 20px
- **Positive Change**: `var(--success)` (#4ade80)
- **Negative Change**: `var(--danger)` (#ef4444)
- **Labels** (Ceiling, Floor, Bid, Ask): `var(--muted)` (#6b80a6)

#### Scenario: Chart Styling
**Given** Candlestick Chart renders  
**When** displayed on screen  
**Then** the chart uses:
- **Background**: `var(--panel)`
- **Grid Lines**: `var(--border)` with low opacity (0.1)
- **Axis Labels**: `var(--muted)`
- **Green Candles**: `var(--success)` fill, `var(--success)` border
- **Red Candles**: `var(--danger)` fill, `var(--danger)` border
- **Volume Bars**: `var(--accent)` (#1e4db3) with 50% opacity

---

## Type Definitions

```typescript
interface DailyBar {
  symbol: string;           // "VNM"
  date: string;             // "2023-10-27T00:00:00Z" (ISO 8601)
  open: number;             // 68.5 (thousand VND)
  high: number;             // 69.2
  low: number;              // 68.1
  close: number;            // 69.0
  volume: number;           // 1500000 (shares)
  turnover: number;         // 10350000000 (VND)
}

interface IntradayBar {
  symbol: string;           // "VNM"
  timestamp: string;        // "2023-10-27T10:30:00Z"
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface SymbolInfo {
  symbol: string;           // "VNM"
  lastPrice: number;        // 69.0 (thousand VND)
  change: number;           // 0.5 (absolute change)
  changePercent: number;    // 0.72 (percentage)
  ceiling: number;          // 73.8 (max price for the day)
  floor: number;            // 64.2 (min price for the day)
  reference: number;        // 69.0 (reference price)
  bidPrice: number;         // 68.9 (best bid)
  askPrice: number;         // 69.1 (best ask)
  volume: number;           // 2000000 (total shares traded)
  timestamp: string;        // ISO 8601
}

interface MarketDataContextValue {
  dailyBars: DailyBar[];
  intradayBars: IntradayBar[];
  symbolInfo: SymbolInfo | null;
  isLoading: boolean;
  error: string | null;
  
  fetchHistoricalDaily: (symbol: string, from: string, to: string) => Promise<void>;
  fetchHistoricalIntraday: (symbol: string, interval: string, from: string, to: string) => Promise<void>;
  fetchSymbolInfo: (symbol: string) => Promise<void>;
  updateSymbolInfo: (data: StockInfoData) => void;  // From WebSocket
  appendOHLCBar: (data: OHLCData) => void;          // From WebSocket
}
```
