# GST (General Stock Trading) System

## Frontend-Oriented Project Proposal & Functional Specification

---

## 1. Executive Summary

GST is a **trading intelligence and decision-support platform** designed for the **Vietnam stock market (HOSE/HNX via DNSE broker)**. The system provides structured analysis, scoring, and risk management so traders can make better, more disciplined decisions.

The platform integrates:

* **Real-time market data** via WebSocket
* **Technical analysis** with proven indicators
* **Market regime detection** to adapt strategies
* **Trade scoring** for objective quality assessment
* **Risk management** with position sizing and stop management
* **Performance analytics** to track and improve

This document focuses on:

* What the system does
* How it helps in real trading
* **What the frontend must implement for every phase**

Backend APIs and implementation details are intentionally abstracted. This document is intended to be used directly as a **frontend generation proposal**.

---

## 2. Real-World Problems GST Solves

Most traders in Vietnam struggle with:

| Problem | Impact |
|---------|--------|
| **Information overload** | Too many indicators, no clear decision framework |
| **Emotional trading** | FOMO, revenge trading, holding losers too long |
| **Poor risk management** | Overleveraging, no position sizing, undefined stops |
| **No feedback loop** | Can't identify what works and what doesn't |
| **Market-specific rules** | ±7% daily limits, T+2 settlement, gap risk |

Existing tools:

* **Charting platforms** show data but don't decide
* **Trading bots** decide but don't explain
* **Manual tracking** is tedious and inconsistent

**GST sits in the middle**: structured logic + human control + Vietnam market adaptation.

---

## 3. Core User Value

GST helps users:

| Value | How |
|-------|-----|
| **See market context at a glance** | Regime detection (Bull/Bear/Range) with scoring |
| **Find high-quality setups** | Automated signal scanning with 13-point scoring |
| **Control risk before entering** | Position sizing, stop placement, R:R calculation |
| **Manage trades objectively** | Trailing stops, breakeven, time-based exits |
| **Track performance** | Win rate, expectancy, Sharpe ratio, drawdown analysis |
| **Improve over time** | Distribution analysis by strategy, regime, sector |

---

## 4. Target Users

* **Retail traders** (intermediate → advanced) trading Vietnam stocks
* **Discretionary traders** who want rules-based discipline
* **Part-time traders** who need efficient, focused analysis
* **Strategy developers** building and validating trading systems

---

## 5. Vietnam Market Specifics

GST is designed specifically for Vietnam's unique market conditions:

| Feature | Vietnam Rules | GST Handling |
|---------|---------------|--------------|
| **Daily Price Limits** | ±7% for HOSE, ±10% for HNX | Auto-enforces limits in order placement |
| **Gap Risk** | Overnight gaps common | Gap-adjusted position sizing |
| **Settlement** | T+2.5 settlement | Tracks buying power accurately |
| **Trading Hours** | 9:00-15:00 (with break) | Session timing indicator |
| **VN-Index Context** | Market-wide regime matters | VN-Index health affects all analysis |

---

## 6. High-Level Frontend Architecture

Frontend is organized around **functional domains**, not code modules.

### Global UI Layout

```
┌─────────────────────────────────────────────────────────────────┐
│  Top Navigation: Market │ Scanner │ Trade │ Portfolio │         │
│                 Journal │ Analytics │ Settings                  │
├─────────────────────────────────────────────────────────────────┤
│ ┌──────────┐  ┌────────────────────────────────────────────────┐│
│ │          │  │                                                ││
│ │  Left    │  │            Main Workspace                      ││
│ │ Sidebar  │  │                                                ││
│ │          │  │  Charts, Tables, Scorecards, Dashboards        ││
│ │ Watchlist│  │                                                ││
│ │ Alerts   │  │                                                ││
│ │ Quick    │  │                                                ││
│ │ Stats    │  │                                                ││
│ │          │  │                                                ││
│ └──────────┘  └────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

---

## 7. Frontend Requirements by Phase

---

### Phase 1: Market Data & Technical Indicators ✅ (COMPLETE)

#### Purpose

Provide raw market visibility with enriched technical context. Transform price data into actionable insights.

#### Backend Capabilities (Implemented)

* **9 Technical Indicators**: SMA, EMA, RSI, MACD, Stochastic, ADX, Bollinger Bands, ATR, OBV, VWAP
* **Real-time WebSocket**: Stock info, top price, OHLC, tick data, market index
* **Data Management**: OHLCV time series with aggregation

#### Frontend Components

##### 1. Price Chart Module

| Component | Description | Priority |
|-----------|-------------|----------|
| Candlestick Chart | Main price visualization with zoom/pan | P0 |
| Overlay Indicators | SMA/EMA lines (toggleable periods: 10/20/50/200) | P0 |
| Bollinger Bands | Upper/middle/lower bands overlay | P1 |
| VWAP Line | Volume-weighted average price | P1 |
| Volume Panel | Volume bars with MA overlay | P0 |

##### 2. Technical Indicator Panel

| Indicator | Display | Interpretation |
|-----------|---------|----------------|
| **RSI** | 0-100 gauge | <30 oversold (green), >70 overbought (red) |
| **MACD** | Histogram + lines | Bullish/bearish crossover highlighting |
| **Stochastic** | %K/%D lines | Oversold/overbought zones |
| **ADX** | 0-100 bar | <20 weak, 20-40 trending, >40 strong |
| **ATR** | Value + % of price | Volatility classification (Low/Normal/High/Extreme) |

##### 3. Indicator Explanation Tooltip

For each indicator, show on hover:
* **What it measures**: Simple explanation
* **Current state**: Bullish / Bearish / Neutral
* **Suggested action**: Based on current reading

#### UI Specifications

```
┌─────────────────────────────────────────────────────────────────┐
│                    [Symbol: FPT ▼]   [Interval: D ▼]           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│    ████████████████████████████████████████████                │
│    █       CANDLESTICK CHART (70% height)     █                │
│    █  with SMA/EMA overlays                    █                │
│    ████████████████████████████████████████████                │
│                                                                 │
│    ▂▂▃▂▅▇▃▂▁▂▃▂  VOLUME PANEL (15% height)                     │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  RSI: 45 ●     MACD: ↑ Bullish    Stoch: 32 ●    ADX: 28 ●    │
│  [Neutral]     [+0.23 histogram]   [Oversold]    [Trending]   │
└─────────────────────────────────────────────────────────────────┘
```

#### User Value

> Users stop guessing and start seeing **quantified market conditions**. Every indicator has context and interpretation.

---

### Phase 2: Market Context & Regime ⚠️ (PARTIAL - 33%)

#### Purpose

Tell users *what kind of market they are trading in*. Wrong strategy in wrong regime = losses.

#### Backend Capabilities (Implemented)

* **Market Regime Detection**: Bull / Bear / Range / Transition classification
* **Multi-factor scoring**: ADX, directional movement, volatility, volume patterns
* **VN-Index analysis**: Market-wide health assessment
* **Position multipliers**: Regime-adjusted sizing recommendations

#### Backend To Be Implemented

* Multi-timeframe alignment (Weekly/Daily/H4)
* Volume profile and climax detection

#### Frontend Components

##### 1. Market Regime Dashboard Widget

| Element | Description |
|---------|-------------|
| **Current Regime** | Large badge: 🟢 BULL / 🔴 BEAR / 🟡 RANGE / 🔵 TRANSITION |
| **Regime Score** | 3-12 scale with color gradient |
| **VN-Index Status** | Index value, trend direction, distance from MA50 |
| **Recommended Strategy** | Based on regime (e.g., "Trade pullbacks in uptrend") |

##### 2. Regime Detail Panel

| Factor | Display |
|--------|---------|
| ADX Score | Trend strength indicator (1-3 points) |
| Directional Movement | +DI vs -DI bias indicator |
| Volatility | ATR% classification |
| Volume Confirmation | Volume pattern analysis |
| **Total Score** | Sum with breakdown |

##### 3. Trend Strength Meter

```
Weak                              Strong
 ├────────────────────●─────────────┤
         ADX: 28 (Trending)
```

##### 4. Multi-Timeframe Alignment (Future Phase)

| Timeframe | Trend | Structure | Alignment |
|-----------|-------|-----------|-----------|
| Weekly | ↑ Bullish | Higher highs | ✅ |
| Daily | ↑ Bullish | Pullback | ✅ |
| 4H | →Neutral | Consolidating | ⚠️ |
| **Overall** | | | 2/3 Aligned |

#### UI Specifications

```
┌─────────────────────────────────────────────────┐
│          MARKET REGIME                          │
├─────────────────────────────────────────────────┤
│  ┌─────────────────────────────┐               │
│  │    🟢 BULL MARKET           │  Score: 9/12  │
│  │    "Strong uptrend"         │               │
│  └─────────────────────────────┘               │
│                                                 │
│  VN-Index: 1,250.5 (+1.2%)    Above MA50 ✅    │
│                                                 │
│  Strategy: "Favor trend-following setups"      │
│  Position Size: 100% normal                    │
├─────────────────────────────────────────────────┤
│  Factor Breakdown:                              │
│  ● ADX: 32 [█████████░] Trending (+2)          │
│  ● +DI > -DI [████████░░] Bullish (+2)         │
│  ● Volatility [██████░░░░] Normal (+1)         │
│  ● Volume [███████░░░] Confirming (+2)         │
└─────────────────────────────────────────────────┘
```

#### User Value

> Users avoid using the **wrong strategy in the wrong market**. Trade with the regime, not against it.

---

### Phase 3: Trade Setup Discovery ⚠️ (PARTIAL - 50%)

#### Purpose

Help users find *good trades faster and more consistently*. Automated pattern recognition with quality scoring.

#### Backend Capabilities (Implemented)

* **Pullback Detection**: EMA structure, support identification, trigger detection
* **Breakout Detection**: Consolidation patterns, volume confirmation
* **13-Point Trade Scoring**: Trend (3) + Setup (3) + Momentum (2) + R:R (2) + Context (3)
* **Liquidity Filters**: Volume, turnover, zero-volume day checks
* **Confidence Levels**: Based on trigger count and pattern quality

#### Backend To Be Implemented

* MA crossover signals
* Mean reversion patterns
* Entry trigger confirmation system

#### Frontend Components

##### 1. Trade Scanner Table

| Column | Description |
|--------|-------------|
| Symbol | Stock ticker with sector badge |
| Setup Type | Pullback / Breakout / (Future: Crossover, Mean Reversion) |
| Score | 0-13 with color coding (7+ tradeable) |
| Trend | Weekly/Daily alignment status |
| Volume | Confirmation status |
| R:R | Risk/Reward ratio |
| Entry Price | Suggested entry |
| Action | "View Details" button |

**Sorting & Filtering:**
* Sort by: Score (desc), R:R (desc), Volume confirmation
* Filter by: Sector, Setup type, Min score

##### 2. Scorecard Display

```
┌─────────────────────────────────────────────────────────────────┐
│  TRADE SCORECARD: FPT                        TOTAL: 10/13 ✅   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Trend Alignment        ████████░░  3/3   "Perfect alignment"  │
│  Setup Quality          ██████░░░░  2/3   "Valid pullback"     │
│  Momentum               ██████████  2/2   "MACD bullish"       │
│  Risk/Reward            █████░░░░░  1/2   "1.8:1 ratio"       │
│  Market Context         ████████░░  2/3   "VN-Index bullish"  │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  💪 Strengths:                                                  │
│    • Perfect weekly/daily trend alignment                       │
│    • Strong MACD momentum                                       │
│    • Supportive market context                                  │
│                                                                 │
│  ⚠️ Watch:                                                      │
│    • Risk/Reward could be better                                │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  Recommendation: BUY - Score 10/13 (Risk 1.5%)                 │
│  Quality: Good                                                  │
└─────────────────────────────────────────────────────────────────┘
```

##### 3. Setup Detail Drawer

When clicking a setup:

| Section | Content |
|---------|---------|
| **Chart** | Mini chart with entry/stop/target marked |
| **Setup Narrative** | "Pullback to EMA20 with volume drying up..." |
| **Rule Checklist** | ✅/❌ for each criterion |
| **Entry Triggers** | Which signals confirmed |
| **Quick Actions** | "Plan Trade" → goes to Risk Calculator |

##### 4. Score Interpretation Guide

| Score Range | Label | Color | Meaning |
|-------------|-------|-------|---------|
| 11-13 | Excellent | 🟢 Green | Strong buy, max position |
| 9-10 | Good | 🟢 Light Green | Buy, normal position |
| 7-8 | Acceptable | 🟡 Yellow | Cautious, reduced position |
| 0-6 | Poor | 🔴 Red | Don't trade |

#### User Value

> Users focus only on **high-quality opportunities**. No more paralysis from too many choices.

---

### Phase 4: Risk & Position Planning ⚠️ (PARTIAL - 75%) **CRITICAL**

#### Purpose

Ensure every trade is survivable. **This is the most important phase for capital preservation.**

#### Backend Capabilities (Implemented)

* **Position Sizing Methods**: Fixed-risk, volatility-adjusted, score-based, capital-constrained
* **Volatility Classification**: Low (<3%), Normal (3-5%), High (5-8%), Extreme (>8%)
* **Correlation Factor**: Reduces size when correlated with existing positions
* **Gap Risk Multiplier**: Vietnam-specific overnight gap adjustment
* **Stop Loss Methods**: ATR-based, percentage, swing-based
* **Target Calculators**: R-multiple, ATR extension, Fibonacci, technical resistance, measured move
* **Trailing Stops**: ATR, EMA, percentage, swing methods
* **Comprehensive Consensus**: Finds targets where multiple methods agree

#### Backend To Be Implemented

* Portfolio-level risk aggregation

#### Frontend Components

##### 1. Position Size Calculator UI

| Input | Description | Default |
|-------|-------------|---------|
| Capital | Total account value | From account |
| Risk % | Max risk per trade | 1-2% based on score |
| Entry Price | Planned entry | From scanner |
| Stop Price | Planned stop | From calculator |

| Output | Description |
|--------|-------------|
| Position Size | Number of shares (lot-size adjusted) |
| Position Value | Total capital allocated |
| Risk Amount | VND at risk |
| Risk % of Capital | Actual risk percentage |

##### 2. Stop Loss Planner

```
┌─────────────────────────────────────────────────────────────────┐
│  STOP LOSS CALCULATOR                                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Entry Price: 85,000 VND                                        │
│                                                                 │
│  Stop Method: [ATR ▼] [Swing] [Percentage] [Technical]         │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                         │   │
│  │         ▲ Entry: 85,000                                │   │
│  │         │                                               │   │
│  │    ─ ─ ─│─ ─ ─  ATR Stop: 81,400 (4.2%)               │   │
│  │    - - -│- - -  Swing Stop: 80,500 (5.3%)              │   │
│  │         │                                               │   │
│  │         ▼ Vietnam Daily Limit: 79,050 (-7%)            │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ⚠️ WARNING: Stop distance 5.3% approaching 7% limit           │
│                                                                 │
│  Selected Stop: 81,400 VND (-4.2%)                              │
│  Risk Amount: 360 VND per share                                 │
└─────────────────────────────────────────────────────────────────┘
```

##### 3. Target Planner with Consensus

| Target Method | Level | R-Multiple | Confidence |
|---------------|-------|------------|------------|
| R-Multiple (2R) | 92,200 | 2.0R | - |
| Technical Resistance | 91,500 | 1.8R | Key level |
| Fibonacci 1.618 | 93,800 | 2.4R | Extension |
| ATR Extension | 92,000 | 2.0R | Volatility |
| **CONSENSUS** | 91,500-92,200 | ~2R | ⭐ HIGH (3 methods agree) |

##### 4. Scaling Strategy Display

```
Target Distribution (100 shares):
├── T1 (25%): 89,000  [1R]   Sell 25 shares
├── T2 (25%): 91,500  [1.8R] Sell 25 shares (Move stop to breakeven)
├── T3 (25%): 92,200  [2R]   Sell 25 shares
└── T4 (25%): Trail   [3R+]  Trail remaining with ATR stop
```

##### 5. Risk Summary Panel

| Metric | Value | Status |
|--------|-------|--------|
| Entry Price | 85,000 VND | |
| Stop Price | 81,400 VND | 4.2% distance |
| Target (consensus) | 92,000 VND | 8.2% upside |
| Risk Amount | 1,800,000 VND | 1.5% of capital |
| Risk:Reward | 1:2.0 | ✅ Good |
| Position Size | 500 shares | |
| Position Value | 42,500,000 VND | 35% of capital |
| **Trade Viability** | ✅ VIABLE | All checks pass |

##### 6. Pre-Trade Risk Checklist

```
✅ Stop < 7% from entry (Vietnam limit)
✅ Position < 40% of capital
✅ Risk < 2% of capital
✅ R:R >= 1.5
⚠️ Correlation: 0.65 with VNM (in portfolio)
   → Position reduced by 20%
```

#### User Value

> Losses become **controlled events**, not disasters. Every trade has defined risk before entry.

---

### Phase 5: Trade Execution Assistance ❌ (NOT STARTED)

#### Purpose

Support correct order placement with Vietnam-specific considerations.

#### Frontend Components

##### 1. Order Form

| Field | Description |
|-------|-------------|
| Order Type | Limit / ATC / ATO / MP |
| Price | With ±7% limit indicator |
| Quantity | Lot-size adjusted |
| Session | Morning / Afternoon / ATC |

##### 2. Price Limit Visualization

```
               ▲ +7%: 90,950
               │
    ──────────►│ Suggested Entry: 85,000
               │
               ▼ -7%: 79,050

⚠️ Stop at 78,000 exceeds -7% limit!
   Earliest execution: Next trading day
```

##### 3. Order Confirmation Modal

* Summary of order details
* Risk recap
* "This trade risks X VND (Y% of capital)"
* Confirm / Cancel buttons

##### 4. Session Timing Indicator

```
Current Session: MORNING ● 10:45:23
├── ATO: 09:00-09:15 ✓ (Ended)
├── Trading: 09:15-11:30 ◉ (Active)
├── Break: 11:30-13:00
└── Trading: 13:00-14:45
```

#### User Value

> Fewer execution mistakes. Correct price limits, proper timing, clear confirmations.

---

### Phase 6: Trade Monitoring ⚠️ (PARTIAL - Implemented)

#### Purpose

Help users manage trades objectively, not emotionally.

#### Backend Capabilities (Implemented)

* **Position Tracker**: Real-time P&L, R-multiple, time tracking
* **Stop Management Engine**: Breakeven, trailing (ATR/EMA/percentage/swing), time-based, volatility-adjusted
* **Adjustment History**: Full audit trail of stop changes

#### Frontend Components

##### 1. Open Positions Dashboard

| Column | Description |
|--------|-------------|
| Symbol | Stock with entry date |
| Entry | Entry price |
| Current | Live price |
| P&L | Unrealized profit/loss (VND and %) |
| R-Multiple | Current profit in R units |
| Stop | Current stop level |
| Days Held | Time in trade |
| Status | 🟢 Profit / 🔴 Loss / 🟡 Breakeven |
| Actions | Adjust / Close buttons |

##### 2. Stop Management Panel

```
┌─────────────────────────────────────────────────────────────────┐
│  STOP MANAGEMENT: FPT                                           │
├─────────────────────────────────────────────────────────────────┤
│  Entry: 85,000   Current: 92,500 (+8.8%)   R: +2.1R            │
│                                                                 │
│  Current Stop: 85,200 (Breakeven)                              │
│                                                                 │
│  ⚡ SUGGESTED ADJUSTMENT:                                       │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Trailing ATR Stop: 88,400                              │   │
│  │  Reason: Price 2R above entry, trail to lock profits    │   │
│  │  New Risk: 88,400 → 0 VND (now risk-free!)             │   │
│  │                                                         │   │
│  │  [Apply Adjustment]   [Keep Current]                    │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  Stop Methods:                                                  │
│  ● [x] ATR Trail (2.0x): 88,400                               │
│  ● [ ] EMA Trail (21): 89,200                                  │
│  ● [ ] Percentage (5%): 87,875                                 │
│  ● [ ] Swing Low: 86,500                                       │
└─────────────────────────────────────────────────────────────────┘
```

##### 3. Time-Based Alert

```
⚠️ STAGNATION WARNING: HPG (15 days)

Position showing minimal progress.
Current R: +0.3R over 15 days

Suggested Actions:
• Tighten stop to reduce opportunity cost
• Set time deadline for exit
• Consider partial close

[Tighten Stop]  [Set Deadline]  [Close 50%]
```

##### 4. Emergency Indicators

| Indicator | Trigger | Display |
|-----------|---------|---------|
| Stop Hit | Price crosses stop | 🚨 Red flash + notification |
| Target Hit | Price reaches target | 🎯 Green flash + notification |
| Gap Risk | After-hours news | ⚠️ Yellow alert |

#### User Value

> Users stop interfering emotionally with trades. Clear rules for when to adjust, when to hold.

---

### Phase 7: Performance Analytics ⚠️ (PARTIAL - 70%)

#### Purpose

Turn trades into learning. See what actually works.

#### Backend Capabilities (Implemented)

* **Win Rate**: Works by calculating wins/total
* **Expectancy**: Average win × win rate - Average loss × loss rate
* **Risk-Adjusted Returns**: Sharpe, Sortino, Calmar ratios
* **Drawdown Analysis**: Max drawdown, recovery factor, streak analysis
* **Distribution Analysis**: By R-multiple, signal type, regime
* **Equity Curve Tracking**: Point-by-point equity with returns

#### Backend To Be Implemented

* Time-based metrics (best/worst days, holding periods)
* System validation with statistical tests

#### Frontend Components

##### 1. Performance Overview Cards

```
┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  WIN RATE    │  │  EXPECTANCY  │  │  PROFIT      │  │  MAX DD      │
│              │  │              │  │  FACTOR      │  │              │
│   62.5%      │  │   0.45R      │  │    1.85      │  │   -8.3%      │
│   ✅ Good    │  │  ✅ Positive │  │   ✅ Good    │  │  ✅ Healthy  │
└──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘
```

##### 2. Risk-Adjusted Metrics Dashboard

| Metric | Value | Interpretation |
|--------|-------|----------------|
| Sharpe Ratio | 1.42 | ✅ Good (>1) |
| Sortino Ratio | 1.89 | ✅ Excellent (>1.5) |
| Calmar Ratio | 2.15 | ✅ Excellent (>1) |
| Annual Return | 28.5% | |
| Annual Std Dev | 18.2% | |

##### 3. Equity Curve Chart

```
 Equity (VND)
 120M ┤                                    ╭─────
 115M ┤                              ╭─────╯
 110M ┤                        ╭─────╯
 105M ┤              ╭─────────╯
 100M ┼─────────────╯
  95M ┤
      └──────────────────────────────────────────
         Jan    Feb    Mar    Apr    May    Jun

 ──── Equity    ---- Drawdown Zone
```

##### 4. Distribution Charts

**R-Multiple Distribution:**
```
      │████████████████  32%   (2R-3R)  ⭐ Best
0-1R  │████████████      24%
1R-2R │██████████████    28%
2R-3R │████████████████  32%
3R+   │████████          16%
Losers│██████████████    28%   (negative R)
```

**By Setup Type:**
| Setup | Win Rate | Avg R | Trades |
|-------|----------|-------|--------|
| Pullback | 68% | +1.2R | 45 |
| Breakout | 55% | +1.8R | 22 |

**By Market Regime:**
| Regime | Win Rate | Avg R | Trades |
|--------|----------|-------|--------|
| Bull | 71% | +1.5R | 35 |
| Range | 52% | +0.6R | 18 |
| Bear | 38% | -0.3R | 14 |

##### 5. Drawdown Analysis Panel

```
┌─────────────────────────────────────────────────────────────────┐
│  DRAWDOWN ANALYSIS                                              │
├─────────────────────────────────────────────────────────────────┤
│  Maximum Drawdown: -8.3% (March 15 - April 2)                  │
│  Recovery Factor: 3.4x ✅ Excellent                            │
│                                                                 │
│  Current Drawdown: -2.1%                                       │
│  Consecutive Losses: 2 trades                                  │
│  Max Consecutive Losses: 4 trades (February)                   │
│                                                                 │
│  Drawdown Timeline:                                            │
│  0%  ├────────────────────────────────────                     │
│ -5%  │          ╲_______╱                                      │
│ -10% ├────────────────────────────────────                     │
└─────────────────────────────────────────────────────────────────┘
```

#### User Value

> Users see **what actually works**. Data-driven improvement, not guessing.

---

### Phase 8: Journal & Reviews ❌ (NOT STARTED)

#### Purpose

Build discipline and accountability. Psychology becomes measurable.

#### Frontend Components

##### 1. Trade Journal Entry Form

| Field | Description |
|-------|-------------|
| Pre-Trade Notes | Why entering this trade |
| Emotional State | 1-5 scale (calm → anxious) |
| Setup Quality | Self-assessment |
| Execution Notes | How it was executed |
| Post-Trade Reflection | What did I learn? |
| Screenshot | Chart snapshot |

##### 2. Pre-Trade Checklist (Mandatory)

```
Before entering, confirm:
☐ Market regime supports this trade
☐ Score >= 7
☐ Risk <= 2% of capital
☐ Stop is placed before entry
☐ No correlated positions open
☐ Emotionally calm (not chasing)

[All Checked - Proceed to Trade]
```

##### 3. Post-Trade Review Form

| Question | Input |
|----------|-------|
| Did I follow my rules? | Yes / No / Partially |
| If no, which rules broken? | Multi-select |
| What did I do well? | Text |
| What should I improve? | Text |
| Grade this trade | A / B / C / D |

##### 4. Weekly/Monthly Review Dashboard

**Weekly Summary:**
* Trades taken: 5
* Win rate: 60%
* Net R: +3.2R
* Rules broken: 2 times
* Best trade: FPT (+2.5R)
* Worst trade: HPG (-1R)
* Psychology score: 7/10

**Improvement Focus:**
> "Tendency to move stops too early. Practice patience on next 10 trades."

#### User Value

> Psychology becomes measurable. Build **discipline through accountability**.

---

### Phase 9: Alerts & Notifications ❌ (NOT STARTED)

#### Purpose

Reduce screen time. Trade efficiently.

#### Backend Infrastructure (Ready)

* Email notifications (SMTP)
* Telegram bot integration
* WebSocket for real-time alerts

#### Frontend Components

##### 1. Alert Configuration UI

| Alert Type | Trigger | Channel |
|------------|---------|---------|
| **Setup Alert** | New setup score >= 9 | Push, Email, Telegram |
| **Stop Hit** | Position stop triggered | Push, Email, Telegram |
| **Target Hit** | Position target reached | Push, Telegram |
| **Regime Change** | Market regime transition | Email |
| **Risk Warning** | Portfolio risk > threshold | Push, Email |

##### 2. Alert Center / Feed

```
┌─────────────────────────────────────────────────────────────────┐
│  ALERTS                                     [Mark All Read]     │
├─────────────────────────────────────────────────────────────────┤
│  🎯 10:45  Target T1 hit on FPT (+1R)            [View Trade]  │
│  ⚠️ 10:30  VN-Index regime transitioning to Range [View Market]│
│  📈 09:32  New setup: VNM (Score 11, Pullback)    [View Setup] │
│  🚨 09:15  Stop hit on HPG (-0.8R)                [View Trade] │
│  ──────────────────────────────────────────────────────────────│
│  📊 Yesterday                                                   │
│  📈 15:00  New setup: MWG (Score 10, Breakout)    [Expired]    │
└─────────────────────────────────────────────────────────────────┘
```

##### 3. Priority Tagging

| Priority | Color | Examples |
|----------|-------|----------|
| 🔴 Critical | Red | Stop hit, risk warning |
| 🟡 Important | Yellow | New high-score setup |
| 🟢 Info | Green | Target hit, regime info |

#### User Value

> Trade when opportunities arise, not when staring at screens.

---

### Phase 10: Backtesting & Simulation ❌ (NOT STARTED)

#### Purpose

Validate ideas before risking real money.

#### Frontend Components

##### 1. Strategy Parameter Form

| Section | Parameters |
|---------|------------|
| **Entry Rules** | Setup type, min score, regime filter |
| **Exit Rules** | Stop method, target method, trailing |
| **Position Sizing** | Risk %, max position % |
| **Date Range** | Start date, end date |
| **Universe** | All VN stocks, sector filter, watchlist |

##### 2. Backtest Results Dashboard

| Metric | Value |
|--------|-------|
| Total Trades | 156 |
| Win Rate | 58.3% |
| Profit Factor | 1.72 |
| Expectancy | +0.38R |
| Max Drawdown | -12.4% |
| Sharpe Ratio | 1.15 |
| CAGR | 24.5% |

##### 3. Equity Curve Viewer

Interactive chart with:
* Equity curve over time
* Drawdown periods highlighted
* Trade markers (entries/exits)
* Benchmark comparison (VN-Index)

##### 4. Trade List / Export

* Full list of simulated trades
* Filter by win/loss, R-multiple, setup type
* Export to CSV for further analysis

##### 5. Parameter Optimization (Future)

```
Optimizing: Minimum Score
├── Score 6: Expectancy +0.15R, DD -18%
├── Score 7: Expectancy +0.28R, DD -14%  
├── Score 8: Expectancy +0.35R, DD -11%  ⭐ Best
├── Score 9: Expectancy +0.42R, DD -9%   (fewer trades)
└── Score 10: Expectancy +0.52R, DD -7%  (too few trades)

Recommendation: Min Score = 8 (balance of trades and quality)
```

#### User Value

> Test before risking money. Know your edge statistically.

---

### Phase 11: Advanced Portfolio Intelligence ❌ (NOT STARTED)

#### Purpose

Operate like a professional trading desk.

#### Frontend Components

##### 1. Correlation Heatmap

```
       FPT   VNM   MWG   VCB   HPG
FPT    1.00  0.45  0.32  0.28  0.15
VNM    0.45  1.00  0.52  0.38  0.22
MWG    0.32  0.52  1.00  0.41  0.18
VCB    0.28  0.38  0.41  1.00  0.55
HPG    0.15  0.22  0.18  0.55  1.00

Legend: 🟢 <0.3 | 🟡 0.3-0.6 | 🔴 >0.6
```

##### 2. Sector Exposure Dashboard

```
Portfolio Sector Allocation:
├── Technology    ████████████████  40%  ⚠️ High
├── Banking       ████████          20%
├── Real Estate   ██████            15%
├── Consumer      ██████            15%
└── Materials     ████              10%

Recommendation: Reduce Technology exposure (>30% concentrated)
```

##### 3. Regime-Adaptive Warnings

```
⚠️ REGIME ALERT

Market transitioning from BULL → RANGE

Current Portfolio Impact:
• 3 positions are trend-following setups
• Trend-following underperforms in Range regime
• Consider:
  - Tightening stops
  - Reducing position sizes
  - Taking partial profits

[Review Positions]  [Dismiss]
```

##### 4. Diversification Score

| Metric | Score | Status |
|--------|-------|--------|
| Sector Spread | 6/10 | ⚠️ Concentrated |
| Correlation Avg | 0.42 | ✅ OK |
| Position Count | 5 | ✅ Manageable |
| **Overall Diversification** | 7/10 | ⚠️ Watch sector |

##### 5. Pyramiding Manager (Future)

For adding to winning positions:
* Add rules (2R profit, volume confirmation)
* Size progression (100% → 50% → 25%)
* Stop management for full position

#### User Value

> Manage risk like a **professional**, not a gambler.

---

## 8. Frontend Design Principles

### Visual Hierarchy

| Priority | Focus |
|----------|-------|
| 1️⃣ Risk First | Always show risk metrics prominently |
| 2️⃣ Then Reward | Show potential only after risk is clear |
| 3️⃣ Decisions | Clear action buttons, not just data |
| 4️⃣ Explanation | Every number has context/interpretation |

### Color System

| Element | Color Usage |
|---------|-------------|
| **Profit / Bullish** | Green shades (🟢) |
| **Loss / Bearish** | Red shades (🔴) |
| **Neutral / Caution** | Yellow/Orange (🟡) |
| **Information** | Blue (🔵) |
| **Background** | Dark mode preferred (reduces eye strain) |

### Interaction Patterns

* **Progressive Disclosure**: Simple first → details on demand
* **Confirmation for Risk**: Always confirm before trades
* **Tooltips for Education**: Explain every metric
* **Keyboard Shortcuts**: For power users

### Mobile Considerations

* Critical alerts should work on mobile
* Position monitoring should be mobile-friendly
* Full analysis better on desktop

---

## 9. Phase Priority & MVP Definition

### MVP (Minimum Viable Product) - Phases 1-4

| Phase | Status | Value |
|-------|--------|-------|
| 1. Technical Indicators | ✅ Backend Ready | See what's happening |
| 2. Market Regime | ⚠️ 33% | Know the context |
| 3. Trade Scoring | ⚠️ 50% | Find good trades |
| 4. Risk Management | ⚠️ 75% | Trade safely |

**MVP delivers**: Find good trades → Size correctly → Manage risk

### Phase 2 Extension (Full Loop)

| Phase | Value |
|-------|-------|
| 5. Execution Assistance | Execute properly |
| 6. Trade Monitoring | Manage actively |
| 7. Analytics | Track performance |

**Full Loop delivers**: Complete trade lifecycle from idea to analysis

### Phase 3 Extension (Professional)

| Phase | Value |
|-------|-------|
| 8. Journaling | Build discipline |
| 9. Alerts | Trade efficiently |
| 10. Backtesting | Validate strategies |
| 11. Portfolio Intelligence | Professional-grade risk |

---

## 10. Technical Constraints for Frontend

### Data Flow

```
DNSE API ──► Backend ──► WebSocket/REST ──► Frontend
   │                           │
Real-time               Structured Data
Market Data              for UI Display
```

### Expected API Patterns

* **REST**: CRUD for positions, trades, settings
* **WebSocket**: Real-time prices, alerts
* **Authentication**: JWT with DNSE trading token

### Performance Expectations

* Chart updates: 1-5 second intervals
* Scanner refresh: 30-60 second intervals
* Analytics: On-demand calculation

---

## 11. Success Metrics

### User Success

| Metric | Target |
|--------|--------|
| Trades with score >= 7 | > 90% |
| Trades with defined stop | 100% |
| Average R-multiple | > 0 |
| Max drawdown | < 15% |

### Product Success

| Metric | Target |
|--------|--------|
| Time to find trade | < 5 minutes |
| Time to plan trade | < 2 minutes |
| Trade setup completion | > 80% |
| User retention (weekly) | > 70% |

---

## 12. Conclusion

GST is not just a trading tool—it is a **decision framework** for the Vietnam stock market.

A frontend built on this document can:

* ✅ Deliver immediate user value (Phases 1-4)
* ✅ Scale with backend intelligence as more phases complete
* ✅ Serve as a foundation for professional-grade trading software
* ✅ Handle Vietnam-specific market rules elegantly

This document is suitable for:

* **Product proposal** to stakeholders
* **Frontend backlog creation** for development team
* **UI/UX design generation** for designers
* **MVP planning** for initial release

---

## Appendix A: Current Implementation Status

| Phase | Component | Status | Backend Ready |
|-------|-----------|--------|---------------|
| 1.1 | Technical Indicators | ✅ Complete | ✅ |
| 2.1 | Market Regime Detection | ✅ Complete | ✅ |
| 2.2 | Multi-Timeframe Analysis | ❌ Not Started | ❌ |
| 3.1 | Entry Signals | ⚠️ Partial | ⚠️ |
| 3.2 | Trade Scoring | ✅ Complete | ✅ |
| 4.1 | Position Sizing | ✅ Complete | ✅ |
| 4.2 | Stop Loss Calculator | ✅ Complete | ✅ |
| 4.3 | Target Calculator | ✅ Complete | ✅ |
| 6.1 | Position Tracker | ✅ Complete | ✅ |
| 6.2 | Stop Management | ✅ Complete | ✅ |
| 7.1 | Trade Statistics | ⚠️ Partial | ⚠️ |
| 7.2 | Distribution Analysis | ✅ Complete | ✅ |
| Others | Phases 5, 8-11 | ❌ Not Started | ❌ |

**Overall Progress**: ~25% complete (8 full + 2 partial components)

---

## Appendix B: Glossary

| Term | Definition |
|------|------------|
| **R-Multiple** | Profit/loss in units of initial risk |
| **ATR** | Average True Range (volatility measure) |
| **ADX** | Average Directional Index (trend strength) |
| **Regime** | Current market condition (Bull/Bear/Range) |
| **Drawdown** | Peak-to-trough decline in equity |
| **Expectancy** | Average profit per trade in R |
| **Sharpe Ratio** | Risk-adjusted return (higher = better) |
| **DNSE** | Vietnam stock broker API |
| **HOSE** | Ho Chi Minh Stock Exchange |
| **VN-Index** | Vietnam's main market index |
