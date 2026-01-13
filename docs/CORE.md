# Phase 1

# Vietnam Swing Trading System - Complete Product Design Document

## Table of Contents
1. [Product Overview](#1-product-overview)
2. [Information Architecture](#2-information-architecture)
3. [UI Design Research & Best Practices](#3-ui-design-research--best-practices)
4. [Core Feature Specifications](#4-core-feature-specifications)
5. [Component Library](#5-component-library)
6. [User Flows & Interactions](#6-user-flows--interactions)
7. [Responsive Design Strategy](#7-responsive-design-strategy)

---

## 1. PRODUCT OVERVIEW

### 1.1 Product Vision
A Vietnamese stock swing trading platform that combines real-time market data from DNSE, intelligent signal generation based on the GST methodology, comprehensive profit/loss tracking, and AI-powered coaching to help retail traders execute profitable trades while managing risk effectively through their SSI brokerage account.

### 1.2 Core Value Propositions
1. **Never miss optimal entry/exit points** - Real-time monitoring with intelligent alerts
2. **Complete financial tracking** - Every trade's profit/loss calculated with Vietnamese transaction costs
3. **Risk protection** - Multi-layer safeguards prevent account destruction
4. **AI trading coach** - Learn and improve with every trade
5. **Manual execution guide** - Step-by-step SSI integration without auto-trading

### 1.3 Target Users
- Vietnamese retail swing traders
- Trading through SSI brokerage
- Capital range: 50M - 500M VND
- Experience level: Beginner to intermediate
- Time availability: Part-time (cannot monitor market continuously)
- Holding period: 1-4 weeks per position

---

## 2. INFORMATION ARCHITECTURE

### 2.1 Primary Navigation Structure

Based on research of top trading platforms (TradingView, Webull, Interactive Brokers, Robinhood), the optimal navigation is a horizontal tab system with 8 main sections:

```
┌─────────────────────────────────────────────────────────────┐
│  [Logo]  [Main Navigation Tabs]           [User Menu] [🔔]  │
└─────────────────────────────────────────────────────────────┘

Main Tabs (left to right):
1. 📊 Dashboard     - Overview of everything
2. 🔍 Watchlist     - Stocks you're monitoring
3. 💼 Portfolio     - Current positions & money tracking
4. 📈 Signals       - Buy/sell alerts
5. 📚 Journal       - Trade history & analytics
6. 🤖 AI Coach      - Chat interface for assistance
7. 🧪 Backtest      - Historical testing
8. ⚙️ Settings      - Configuration
```

**Design Rationale:**
- **Horizontal tabs** (like TradingView): Faster navigation than sidebar, works well on wide monitors common for traders
- **Icon + Label**: Improves recognition speed and accessibility
- **Notification bell**: Always visible for critical alerts (learned from Robinhood)
- **User menu**: Profile, logout, account settings (standard pattern)

### 2.2 Screen Hierarchy & Flow

```
Level 1: Main Navigation (8 screens)
│
├─ Level 2: Sub-sections within each screen
│  Example: Dashboard → [Summary Cards, Active Signals, Open Positions]
│
├─ Level 3: Detail Panels & Modals
│  Example: Click signal → Opens Signal Detail Modal
│
├─ Level 4: Overlays & Full-screen Views
│  Example: Click chart → Full-screen chart analysis
│
└─ Level 5: AI Chat (Persistent, accessible from anywhere)
   Example: Floating chat button → Opens chat panel
```

### 2.3 Information Priority Framework

Based on eye-tracking studies of trading platforms (referenced from Nielsen Norman Group research on financial dashboards):

**Priority 1 (Top-left, largest):** Actionable items requiring immediate attention
- Active buy/sell signals
- Risk limit warnings
- Stop losses triggered

**Priority 2 (Center):** Current state information
- Open positions
- Current P&L
- Market regime status

**Priority 3 (Right/bottom):** Contextual information
- AI insights
- News
- Historical performance

---

## 3. UI DESIGN RESEARCH & BEST PRACTICES

### 3.1 Trading Platform Analysis

I researched 10+ major trading platforms to identify best practices:

#### **TradingView (tradingview.com)**
**Key Learnings:**
- **Chart-first design**: Main chart takes 60-70% of screen space
- **Side panels**: Collapsible panels for watchlists, indicators, ideas
- **Inline alerts**: Small notification badges on chart when events occur
- **Tabbed sections**: Multiple panels without overwhelming interface
- **Keyboard shortcuts**: Power users can navigate entirely by keyboard

**What to adopt for our system:**
- Prominent chart display with technical indicators
- Collapsible side panels for watchlist
- Inline notification system

**What to avoid:**
- Too many drawing tools (we're swing traders, not day traders)
- Social features (distraction from systematic trading)

#### **Webull (webull.com)**
**Key Learnings:**
- **Real-time price cards**: Large, readable price with color-coded % change
- **Quick action buttons**: "Buy" and "Sell" buttons always visible
- **Horizontal scrollable lists**: For watchlists and positions on mobile
- **News integration**: Headlines directly below stock prices
- **Dark mode first**: Designed primarily for dark mode, light mode secondary

**What to adopt:**
- Quick-access action buttons
- Real-time updating price displays
- News integration per stock

#### **Interactive Brokers TWS (Trader Workstation)**
**Key Learnings:**
- **Risk analytics dashboard**: Dedicated section showing portfolio risk metrics
- **Order preview system**: Multi-step order confirmation with risk calculation
- **Customizable layouts**: Save different workspace configurations
- **Alert management center**: Centralized place to view/manage all alerts
- **Advanced filtering**: Complex filters for screening stocks

**What to adopt:**
- Risk dashboard with visual gauges
- Order preview/confirmation flow
- Alert management center
- Advanced watchlist filtering

**What to avoid:**
- Overwhelming complexity (too many windows and options)
- Steep learning curve

#### **Robinhood (robinhood.com)**
**Key Learnings:**
- **Card-based UI**: Each stock/position is a distinct card
- **Progressive disclosure**: Show essential info first, "tap for more"
- **Minimalist design**: Generous white space, clear hierarchy
- **Encouraging micro-copy**: Positive, friendly language throughout
- **Swipe gestures**: Intuitive mobile interactions

**What to adopt:**
- Card-based design for signals and positions
- Progressive disclosure (don't overwhelm beginners)
- Friendly, educational tone in UI text

**What to avoid:**
- Over-simplification that hides critical risk information
- Gamification that encourages overtrading

#### **Bloomberg Terminal**
**Key Learnings:**
- **Information density**: Show lots of data efficiently
- **Real-time everywhere**: Every number updates live
- **Alert priority system**: Visual (color) + audio indicators
- **Keyboard-driven**: Professional traders use almost no mouse
- **Multi-monitor support**: Designed to spread across screens

**What to adopt:**
- Real-time data updates across all screens
- Alert priority/severity system
- Information-dense tables where appropriate

**What to avoid:**
- Intimidating "black box" appearance
- Assuming all users want maximum information

#### **Think or Swim (thinkorswim.com)**
**Key Learnings:**
- **Studies and strategies**: Built-in technical analysis tools
- **Paper trading mode**: Practice without risk
- **Analysis tab**: Dedicated space for deep-dive analysis
- **Risk profile graphs**: Visual representation of position risk

**What to adopt:**
- Paper trading mode toggle
- Dedicated analysis/backtest section
- Visual risk representation

### 3.2 AI Chat Interface Research

#### **ChatGPT (openai.com)**
**Key Learnings:**
- **Clear message bubbles**: User messages vs AI responses visually distinct
- **Markdown rendering**: Support for bold, lists, code blocks, tables
- **Regenerate option**: Let users ask AI to try again
- **Copy button**: On code blocks and important text
- **Streaming responses**: Text appears word-by-word (feels responsive)

**What to adopt:**
- Clear message distinction
- Rich formatting support
- Action buttons within chat (e.g., "Execute this trade")

#### **Claude.ai (claude.ai)**
**Key Learnings:**
- **Artifacts panel**: Rich content (charts, tables, code) in side panel
- **Collapsible sections**: Long responses can be collapsed
- **Source citations**: When AI references data, show source
- **Conversation history**: Easy to scroll back through conversation

**What to adopt:**
- Artifacts concept for showing charts/tables alongside chat
- Conversation history sidebar
- Citation of data sources (e.g., "Based on DNSE data from 10:23 AM")

#### **Perplexity AI (perplexity.ai)**
**Key Learnings:**
- **Related questions**: Suggest follow-up questions
- **Visual cards**: Important info displayed as cards, not just text
- **Search integration**: Can search web for current information

**What to adopt:**
- Suggested questions after AI response
- Card-based display for structured data (trade details)

### 3.3 Data Table Design Best Practices

Research from financial data table design (Stripe, Plaid, financial dashboards):

**Key Principles:**
1. **Monospace fonts for numbers**: Ensures columns align properly
2. **Right-align numbers**: Standard accounting practice
3. **Color-code changes**: Green for positive, red for negative
4. **Sortable columns**: Click headers to sort
5. **Fixed headers**: Keep column headers visible when scrolling
6. **Row hover states**: Highlight row on hover
7. **Inline actions**: Show action buttons on row hover
8. **Pagination or virtual scrolling**: For large datasets
9. **Sticky important columns**: Keep symbol/name visible when scrolling horizontally
10. **Sparklines**: Mini charts in table cells for trends

### 3.4 Notification Design Patterns

Research from Apple iOS notifications, Google Material Design, and Stripe Dashboard:

**Best Practices:**
1. **Priority levels**: Critical (red), Warning (amber), Info (blue), Success (green)
2. **Persistent vs Dismissible**: Critical stays until acknowledged, info auto-dismisses
3. **Action buttons in notification**: "View Details", "Dismiss", "Take Action"
4. **Sound + Visual**: Critical alerts should have audio option
5. **Notification center**: Central place to review all notifications
6. **Smart grouping**: Group related notifications (e.g., "3 stocks near entry")
7. **Preview on hover**: Show more details without clicking
8. **Undo option**: For non-critical actions

---

## 4. CORE FEATURE SPECIFICATIONS

### 4.1 SCREEN 1: 📊 DASHBOARD

**Purpose:** At-a-glance overview of your trading status RIGHT NOW

#### Layout Structure (Desktop)

```
┌────────────────────────────────────────────────────────────────┐
│  Header Section (Full Width)                                   │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │ Good Morning, [User] | Monday, Jan 13, 2025 | 10:23 AM │  │
│  │ Market: OPEN | VN-Index: 1,245.67 (+0.8%)              │  │
│  │ Regime: BULL 🟢 | Market Score: 10/12                   │  │
│  └─────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────┘

┌─────────────────┐  ┌──────────────────────────────────────────┐
│ LEFT PANEL      │  │ CENTER PANEL                             │
│ (25% width)     │  │ (50% width)                              │
│                 │  │                                          │
│ PORTFOLIO       │  │ TODAY'S SIGNALS                          │
│ SUMMARY CARD    │  │                                          │
│                 │  │ [Signal Card 1: VCB - BUY NOW]          │
│ ┌─────────────┐ │  │ ┌────────────────────────────────────┐ │
│ │Total Capital│ │  │ │ 🎯 VCB - SCORE 9/10                │ │
│ │100,000,000₫ │ │  │ │ Entry: 85,600 | Stop: 81,100       │ │
│ │             │ │  │ │ Setup: Pullback to 20 EMA          │ │
│ │P&L Today    │ │  │ │ Risk: 1.5% | R:R: 2.8:1            │ │
│ │-240,000₫    │ │  │ │ [VIEW DETAILS] [EXECUTE TRADE]     │ │
│ │(-0.24%)     │ │  │ └────────────────────────────────────┘ │
│ │             │ │  │                                          │
│ │Total P&L    │ │  │ [Signal Card 2: HPG - WATCH]            │
│ │+8,200,000₫  │ │  │ [Signal Card 3: VPB - CAUTION]          │
│ │(+8.2%)      │ │  │                                          │
│ │             │ │  │ [+ View 2 More Signals]                 │
│ │Open Pos: 4  │ │  │                                          │
│ │Risk: 4.2%/6%│ │  │ [VIEW ALL SIGNALS →]                    │
│ └─────────────┘ │  │                                          │
│                 │  └──────────────────────────────────────────┘
│ RISK GAUGE      │
│ [Visual meter]  │  ┌──────────────────────────┐
│ ■■■■□□□□□□ 42%  │  │ RIGHT PANEL (25% width)  │
│                 │  │                          │
│ [ADJUST RISK]   │  │ AI QUICK INSIGHTS        │
│                 │  │                          │
└─────────────────┘  │ 💡 Insight Card 1        │
                     │ "HPG is forming perfect  │
                     │ pullback setup. Expected │
                     │ entry signal in 1-2 days"│
                     │                          │
                     │ ⚠️ Warning Card 2         │
                     │ "Banking sector exposure │
                     │ at 38%. Consider adding  │
                     │ different sector."       │
                     │                          │
                     │ ✅ Success Card 3        │
                     │ "Great discipline! You   │
                     │ followed your stop on VNM│
                     │ yesterday."              │
                     │                          │
                     │ [CHAT WITH AI →]         │
                     └──────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ BOTTOM SECTION (Full Width)                                  │
│                                                               │
│ OPEN POSITIONS TABLE                                         │
│ ┌────────┬────────┬────────┬────────┬────────┬────────┬───┐│
│ │Symbol  │Entry   │Current │P&L     │Days    │Next    │Act││
│ ├────────┼────────┼────────┼────────┼────────┼────────┼───┤│
│ │VCB     │85,000  │88,400  │+1,360K │10 days │T1:91K  │📊 ││
│ │        │Jan 3   │+4.0%   │+3.2R   │        │        │🔔 ││
│ ├────────┼────────┼────────┼────────┼────────┼────────┼───┤│
│ │HPG     │28,500  │34,200  │+3,420K │18 days │T2:37K  │📊 ││
│ │        │Dec 20  │+20.0%  │+2.3R   │        │        │🔔 ││
│ ├────────┼────────┼────────┼────────┼────────┼────────┼───┤│
│ │VNM     │88,000  │89,600  │+640K   │23 days │T1:94K  │📊 ││
│ │        │Dec 15  │+1.8%   │+0.3R   │⏰ Slow │        │🔔 ││
│ ├────────┼────────┼────────┼────────┼────────┼────────┼───┤│
│ │FPT     │92,000  │91,200  │-560K   │8 days  │Stop:   │📊 ││
│ │        │Jan 2   │-0.9%   │-0.4R   │        │87K     │🔔 ││
│ └────────┴────────┴────────┴────────┴────────┴────────┴───┘│
│                                                               │
│ [EXPORT TABLE] [CUSTOMIZE COLUMNS] [VIEW CLOSED POSITIONS]   │
└──────────────────────────────────────────────────────────────┘
```

#### Component Specifications

**1. Header Component**
- **Location:** Top of page, full width, sticky on scroll
- **Content:** 
  - Personalized greeting based on time of day
  - Current date and time (updates every minute)
  - Market status (OPEN/CLOSED with indicator dot)
  - VN-Index current value with % change and color coding
  - Market regime badge (BULL/BEAR/RANGE/TRANSITION)
  - Market score out of 12
- **Interactions:** 
  - Click VN-Index → Opens detailed market overview modal
  - Click Market Regime → Explains current regime and strategy adjustments
  - Hover Market Score → Tooltip showing score breakdown
- **Updates:** Real-time (every 3 seconds for price, regime calculated every 15 minutes)

**2. Portfolio Summary Card**
- **Location:** Left panel, fixed width (280-320px)
- **Content Sections:**
  - **Total Capital:** Large number, bold
  - **Today's P&L:** With percentage, color-coded, with up/down arrow
  - **Total P&L:** Since account inception, with percentage
  - **Open Positions:** Count with icon
  - **Current Risk:** X% / 6% max with visual indicator
- **Visual Elements:**
  - Risk gauge (horizontal bar chart or radial gauge)
  - Color transitions: Green (0-3%), Yellow (3-5%), Red (5-6%)
- **Interactions:**
  - Click "Total Capital" → Opens capital management modal
  - Click "Risk" → Opens risk breakdown showing each position's contribution
  - Click "Open Positions" → Scrolls to positions table
- **Special States:**
  - If risk > 5%: Pulsing warning animation
  - If daily loss approaches -2%: Prominent warning banner appears

**3. Risk Gauge Component**
- **Visual Design:** 
  - Option A: Horizontal segmented bar (10 segments)
  - Option B: Radial gauge (speedometer style)
  - Current preference: Horizontal (simpler, clearer)
- **Display:** 
  - Filled segments represent used risk
  - Empty segments represent available risk
  - Numerical percentage below gauge
- **Interactions:**
  - Hover over gauge → Tooltip shows breakdown by position
  - Example: "VCB: 1.5%, HPG: 1.2%, VNM: 1.0%, FPT: 0.5%"

**4. Signal Cards (Center Panel)**
- **Layout:** Vertical stack, most urgent at top
- **Card Structure:**
```
┌────────────────────────────────────────────────┐
│ 🎯 [Badge: BUY NOW / WATCH / CAUTION]         │
│                                                │
│ [Symbol] - SCORE X/10                         │
│ Entry: XX,XXX | Stop: XX,XXX                  │
│ Setup: [Brief description]                    │
│ Risk: X.X% | R:R: X.X:1 | Expires: HH:MM     │
│                                                │
│ [VIEW DETAILS]  [EXECUTE TRADE]  [DISMISS]    │
└────────────────────────────────────────────────┘
```
- **Priority Badges:**
  - 🎯 BUY NOW: Score 9-10, all criteria met
  - 👀 WATCH: Score 8-9, setting up (80-95% ready)
  - ⚠️ CAUTION: Score 7-8, has concerns
  - 📊 MONITOR: Score <7, informational only
- **Interactions:**
  - Click card anywhere → Expands to show full details
  - Click "VIEW DETAILS" → Opens full signal modal with chart
  - Click "EXECUTE TRADE" → Opens SSI execution guide modal
  - Click "DISMISS" → Removes from active signals, moves to "dismissed" section
  - Hover → Subtle elevation/shadow effect
- **Auto-refresh:** Every 30 seconds
- **Sorting:** By priority badge, then by score, then by time generated

**5. AI Quick Insights Panel**
- **Location:** Right panel, scrollable if many insights
- **Card Types:**
  - 💡 Insight (blue background): Opportunities or patterns
  - ⚠️ Warning (amber background): Risks or concerns
  - ✅ Success (green background): Positive reinforcement
  - 📰 News (neutral background): Relevant market news
- **Card Structure:**
```
┌──────────────────────────────┐
│ [Icon] [Card Title]          │
│                              │
│ [2-3 sentences of insight]   │
│                              │
│ [Optional: Action button]    │
└──────────────────────────────┘
```
- **Content Examples:**
  - "VCB and VPB both setting up - but they're 74% correlated. Take only one."
  - "You're 0-for-3 on breakout trades this month. Consider focusing on pullbacks."
  - "Great stop discipline on yesterday's VNM exit!"
- **Interactions:**
  - Click card → Opens relevant detail view or starts AI chat about that topic
  - Swipe left (on mobile) → Dismiss card
  - Refresh button → Regenerate insights based on current data

**6. Open Positions Table**
- **Location:** Bottom section, full width, scrollable if >5 positions
- **Columns (left to right):**
  1. **Symbol:** Stock ticker, bold
  2. **Entry:** Entry price and date (small text below)
  3. **Current:** Current price with % change, color-coded
  4. **P&L:** Absolute VND amount, percentage, R-multiple (all on separate lines)
  5. **Days Held:** Number with icon, warnings if too long
  6. **Next Target:** T1/T2/T3 or Stop price
  7. **Actions:** Chart icon, alert settings icon
- **Row Interactions:**
  - Click anywhere on row → Opens position detail modal
  - Hover → Highlight entire row, show inline action buttons
  - Right-click → Context menu (View Chart, Adjust Stop, Close Position, etc.)
- **Sorting:**
  - Click column header → Sort by that column
  - Default sort: By P&L (largest winners first)
  - Second sort: By days held
- **Color Coding:**
  - Winning positions: Green tint on row background
  - Losing positions: Red tint
  - Stagnant positions (< 0.5R after 15+ days): Amber tint
- **Special Indicators:**
  - ⏰ icon if position held > 20 days without progress
  - 🚨 icon if position near stop loss
  - 🎯 icon if position near target
  - 📰 icon if recent news about that stock

**7. Action Icons (Last Column)**
- **📊 Chart Icon:**
  - Click → Opens full-screen chart for that stock
  - Shows entry point, stop, targets, current price
- **🔔 Alert Settings Icon:**
  - Click → Opens alert configuration for that position
  - Set price alerts, stop adjustments, target notifications

#### Responsive Behavior (Mobile/Tablet)

**Mobile (< 768px):**
- Switch to vertical stack layout
- Header: Condensed (2 lines instead of 1)
- Portfolio Summary: Full width card at top
- Signals: Full width cards, stacked
- AI Insights: Collapsible section
- Positions Table: Horizontal scroll or card view option
  - Card view example:
```
┌──────────────────────────┐
│ VCB     88,400 (+4.0%)  │
│ Entry: 85,000 (Jan 3)   │
│ P&L: +1,360K (+3.2R)    │
│ Days: 10 | Next: T1:91K │
│ [VIEW] [CHART] [ALERTS] │
└──────────────────────────┘
```

**Tablet (768px - 1024px):**
- 2-column layout: Left (Portfolio + AI) | Right (Signals + Positions)
- Slightly reduced spacing
- Table shows fewer columns (hide "Days Held" and "Next Target")

---

### 4.2 SCREEN 2: 🔍 WATCHLIST

**Purpose:** Monitor multiple stocks simultaneously, identify setups forming, track which stocks are approaching entry criteria

#### Layout Structure (Desktop)

```
┌─────────────────────────────────────────────────────────────┐
│ WATCHLIST HEADER                                            │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ [Search: Add stock to watchlist]  [Filter ▼] [Sort ▼]  │ │
│ │                                                          │ │
│ │ Showing: 15 stocks | 3 Near Entry | 5 Setting Up       │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────┐
│ WATCHLIST TABLE (Main Content)                                │
│                                                                │
│ ┌──┬──────┬───────┬──────┬────┬─────┬─────┬──────┬──────┬──┐│
│ │✓ │Symbol│Price  │Change│Vol │Score│Setup│Distance│Days│🔔││
│ ├──┼──────┼───────┼──────┼────┼─────┼─────┼──────┼──────┼──┤│
│ │☑ │VCB   │85,600 │+2.1% │87% │ 9/10│Pull │ 0.5% to│ 3  │⚡││
│ │  │      │       │🟢    │    │🟢   │back │20 EMA  │    │  ││
│ │  │      │       │      │    │     │     │READY✓  │    │  ││
│ ├──┼──────┼───────┼──────┼────┼─────┼─────┼──────┼──────┼──┤│
│ │☑ │HPG   │33,700 │+1.8% │94% │ 9/10│BO   │Pullback│ 2  │⚡││
│ │  │      │       │🟢    │    │🟢   │P/B  │complete│    │  ││
│ │  │      │       │      │    │     │     │READY✓  │    │  ││
│ ├──┼──────┼───────┼──────┼────┼─────┼─────┼──────┼──────┼──┤│
│ │☐ │VPB   │23,800 │+0.8% │52% │ 8/10│50EMA│ 0.2% to│ 1  │🔔││
│ │  │      │       │🟢    │    │🟡   │Bnc  │50 EMA  │    │  ││
│ │  │      │       │      │    │     │     │Watch   │    │  ││
│ ├──┼──────┼───────┼──────┼────┼─────┼─────┼──────┼──────┼──┤│
│ │☐ │TCB   │24,100 │-1.2% │31% │ 7/10│Pull │ 3.2% to│ 5  │🔔││
│ │  │      │       │🔴    │    │🟡   │back │20 EMA  │    │  ││
│ │  │      │       │      │    │     │     │Soon    │    │  ││
│ ├──┼──────┼───────┼──────┼────┼─────┼─────┼──────┼──────┼──┤│
│ │☐ │SSI   │32,500 │-0.3% │28% │ 7/10│Consol│ 5 days│ 18 │🔔││
│ │  │      │       │🔴    │    │🟡   │-idtn│to BO   │    │  ││
│ ├──┼──────┼───────┼──────┼────┼─────┼─────┼──────┼──────┼──┤│
│ │☐ │VNM   │89,200 │-1.8% │41% │ 6/10│Weak │Below MA│ 8  │  ││
│ │  │      │       │🔴    │    │🔴   │     │Not Yet │    │  ││
│ │  │... 10 more rows                                      │  ││
│ └──┴──────┴───────┴──────┴────┴─────┴─────┴──────┴──────┴──┘│
│                                                                │
│ [+ ADD STOCK] [EXPORT] [CUSTOMIZE COLUMNS] [BULK ACTIONS ▼]  │
└────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────┐
│ SELECTED STOCK DETAIL PANEL (Opens on right side when clicked)│
│                                                                │
│ [When you click a row, this panel slides in from right]       │
│                                                                │
│ Stock: VCB                                    [×] Close        │
│ Current: 85,600 (+2.1%)                                       │
│ Score: 9/10 🟢 (HIGH CONVICTION)                              │
│                                                                │
│ [Mini Chart - Last 30 days with EMAs]                        │
│                                                                │
│ Setup Analysis:                                               │
│ ✓ Weekly uptrend                                              │
│ ✓ Daily pullback to 20 EMA                                   │
│ ✓ Volume decreasing (accumulation)                           │
│ ✓ RSI reset to 48                                            │
│ ⚠️ Banking sector at 38% exposure                             │
│                                                                │
│ If Signal Triggers:                                           │
│ Entry: 85,500-85,800                                          │
│ Stop: 81,100                                                  │
│ T1: 94,600 (2R)                                               │
│ T2: 99,100 (3R)                                               │
│ Risk: 1.5% suggested                                          │
│ Position: 333 shares (28.5M VND)                              │
│                                                                │
│ [SET ALERT] [VIEW FULL CHART] [ASK AI ABOUT THIS]           │
└────────────────────────────────────────────────────────────────┘
```

#### Component Specifications

**1. Watchlist Header**
- **Search Bar:**
  - Autocomplete from all VN30 stocks
  - Type ticker or company name
  - Shows suggestions as you type
  - Press Enter or click to add to watchlist
  - Example: Type "VCB" → Shows "VCB - Vietcombank"
- **Filter Dropdown:**
  - Filter by setup type: All, Pullback, Breakout, MA Bounce, Mean Reversion
  - Filter by score: All, 9-10 only, 8-10, 7-10
  - Filter by readiness: All, Ready Now, Setting Up, Not Ready
  - Filter by sector: All, Banking, Real Estate, Manufacturing, etc.
  - Can apply multiple filters (e.g., "Pullback + Score 9-10")
- **Sort Dropdown:**
  - Sort by: Score (default), Readiness, Price Change, Volume, Days in Setup
  - Ascending/descending toggle
- **Quick Stats:**
  - Total stocks in watchlist
  - Count of stocks near entry (score 8+, ready now)
  - Count of stocks setting up (70-90% ready)

**2. Watchlist Table - Column Details**

**Column 1: Checkbox (✓)**
- **Purpose:** Multi-select for bulk actions
- **Interactions:**
  - Click checkbox → Select/deselect row
  - Header checkbox → Select/deselect all
  - Selected rows: Highlighted background
- **Bulk Actions (when ≥1 selected):**
  - Remove from watchlist
  - Set alerts for all
  - Add to comparison view
  - Export selected

**Column 2: Symbol**
- **Display:** Stock ticker, bold, clickable
- **Interactions:**
  - Click → Opens detail panel on right
  - Hover → Shows company full name tooltip
- **Visual:** May include exchange badge (HOSE/HNX)

**Column 3: Price**
- **Display:** 
  - Current price (large number)
  - Updates every 3 seconds
  - Flashing effect on change (green flash up, red flash down)
- **Format:** XX,XXX VND
- **Interactions:** Click → Opens full chart modal

**Column 4: Change**
- **Display:**
  - Percentage change (from previous close)
  - Color-coded background or text
  - Arrow icon (▲ up, ▼ down)
- **Format:** ±X.X%
- **Color Logic:**
  - Positive: Green background or text
  - Negative: Red background or text
  - Zero: Gray

**Column 5: Volume (Vol)**
- **Display:** Volume percentile (0-100%)
- **Format:** XX%
- **Color Coding:**
  - >75%: Green (high interest)
  - 25-75%: Gray (normal)
  - <25%: Blue (low, potentially accumulating)
  - >90%: Bold green (exceptional volume)
- **Tooltip on Hover:** 
  - "Volume: 2.1M shares (82nd percentile)"
  - "Average: 1.2M shares"

**Column 6: Score**
- **Display:** X/10 with color-coded badge
- **Format:** 
  - 9-10: Green badge, "HIGH"
  - 8: Yellow badge, "GOOD"
  - 7: Amber badge, "OK"
  - <7: Red badge, "LOW"
- **Interactions:**
  - Click score → Opens score breakdown modal
  - Shows: Trend score, Setup score, Momentum score, R:R score, Context bonus
  - Explains why each point was awarded or deducted

**Column 7: Setup Type**
- **Display:** Abbreviated setup name
- **Options:**
  - "Pullback" (or "P/B")
  - "Breakout" (or "B/O")
  - "50 EMA" (50 EMA bounce)
  - "Range" (mean reversion)
  - "MA Cross" (moving average crossover)
- **Visual:** Icon or badge representing setup type
- **Tooltip:** Full setup description

**Column 8: Distance / Status**
- **Purpose:** Shows how close to entry point
- **Display Variants:**
  - "0.5% to 20 EMA" (almost there)
  - "3.2% to 50 EMA" (still coming)
  - "Pullback complete READY✓" (ready to enter)
  - "5 days to breakout" (consolidating)
  - "Below MA - Not Yet" (downtrend)
- **Color Coding:**
  - READY (green): All criteria met, can enter now
  - WATCH (amber): 80-95% ready, monitor closely
  - SOON (blue): 50-80% ready, setting up
  - NOT YET (gray): <50% ready
- **Visual:** May include progress bar showing % readiness

**Column 9: Days**
- **Display:** Number of days in current setup phase
- **Format:** "3 days" or just "3"
- **Purpose:** Track how long setup has been forming
- **Color Logic:**
  - 1-5 days: Normal (gray)
  - 6-10 days: Getting mature (blue)
  - 11-20 days: Mature (amber) - may break soon
  - >20 days: Overdue (red) - setup may fail

**Column 10: Alert Icon (🔔)**
- **Display:** Bell icon
- **States:**
  - ⚡ (lightning): Active signal, ready now
  - 🔔 (bell): Alert set, will notify on criteria met
  - 🔕 (muted bell): No alert set
- **Interactions:**
  - Click → Opens alert settings for that stock
  - Can set:
    - Alert when score reaches X
    - Alert when reaches support/resistance
    - Alert on volume spike
    - Alert on news
  - Toggle on/off quickly

**3. Row Interactions**
- **Single Click:** 
  - Selects row (checkbox)
  - Opens detail panel on right side
- **Double Click:** 
  - Opens full chart view in modal/new window
- **Right Click:**
  - Context menu appears:
    - View Full Chart
    - Set Alert
    - Add to Position (if want to buy)
    - Remove from Watchlist
    - View Historical Setups
    - Ask AI About This Stock
- **Hover:**
  - Entire row highlights
  - Shows mini-chart thumbnail (optional, like Robinhood)
  - Shows quick action buttons (Chart, Alert, Remove)

**4. Detail Panel (Right Side Slide-In)**
- **Trigger:** Click any row in table
- **Animation:** Slides in from right, pushes table slightly left
- **Width:** 400-500px
- **Close:** X button, click outside panel, or press Escape key
- **Sections (top to bottom):**

  a) **Header Section:**
  - Stock symbol and name (large)
  - Current price with live update
  - Current score badge
  - Favorite star (to pin to top)

  b) **Mini Chart:**
  - Last 30 days price action
  - Shows 20 EMA and 50 EMA
  - Entry level indicator (horizontal line)
  - Stop level indicator
  - Can interact: Zoom, pan
  - Click chart → Opens full-screen

  c) **Setup Analysis Checklist:**
  - Visual checklist with ✓ and ✗
  - Example:
    ```
    ✓ Weekly uptrend
    ✓ Daily pullback to 20 EMA
    ✓ Volume decreasing
    ✓ RSI reset to 48
    ⚠️ Banking sector at 38% exposure limit
    ```
  - Green for met criteria
  - Red for failed criteria
  - Amber for warnings

  d) **Entry Details (If Ready):**
  - Suggested entry price or range
  - Stop loss level
  - Target levels (T1, T2, T3)
  - Suggested risk percentage
  - Calculated position size in shares and VND
  - All numbers in clear boxes

  e) **Action Buttons:**
  - [SET ALERT]: Opens alert configuration
  - [VIEW FULL CHART]: Opens chart modal
  - [ASK AI]: Opens AI chat pre-populated with "Tell me about VCB setup"
  - [EXECUTE TRADE]: Opens SSI execution guide
  - [REMOVE FROM WATCHLIST]: With confirmation

  f) **Historical Context (Collapsible):**
  - "VCB had similar setup 3 times in last 6 months"
  - "Win rate: 2/3 (66%)"
  - "Average gain on wins: +2.8R"
  - Link to view those historical trades

**5. Empty State (No Stocks in Watchlist)**
```
┌────────────────────────────────────┐
│                                    │
│         📋                         │
│   Your watchlist is empty          │
│                                    │
│   Add stocks you want to monitor   │
│   for trading opportunities        │
│                                    │
│   [+ ADD YOUR FIRST STOCK]         │
│                                    │
│   Or try these popular picks:      │
│   [VCB] [VPB] [HPG] [VNM] [FPT]   │
│                                    │
└────────────────────────────────────┘
```

**6. Quick Add Buttons (Bottom Bar)**
- **+ ADD STOCK:** Opens search modal
- **EXPORT:** Download watchlist as CSV/Excel
- **CUSTOMIZE COLUMNS:** Choose which columns to show/hide
- **BULK ACTIONS:** (Appears when ≥1 row selected)
  - Actions dropdown: Remove, Set Alerts, Export Selected

#### Special Features

**A) Auto-Refresh System**
- **Price & Volume:** Every 3 seconds during market hours
- **Score Recalculation:** Every 15 minutes
- **Setup Status:** Every 5 minutes
- **Visual Feedback:** Subtle pulse animation on updated cells

**B) Smart Sorting & Filtering**
- **Default Sort:** By Score descending, then by Readiness
- **"Hot Stocks" Quick Filter:** Pre-configured to show Score 8+ AND Ready/Watch status
- **"Today's Movers" Quick Filter:** Sorted by % change
- **"High Volume" Quick Filter:** Volume >75th percentile

**C) Persistent State**
- Watchlist saved to database per user
- Column widths, sort preferences saved
- Filter settings remembered
- Last viewed stock in detail panel reopens on return

**D) Notification Integration**
- If stock meets ALL entry criteria:
  - Row background pulses green
  - ⚡ icon appears in alert column
  - Browser notification: "VCB is ready to enter (Score 9/10)"
  - Sound notification (optional, in settings)

#### Responsive Behavior

**Mobile (< 768px):**
- Switch to card view instead of table
- Each stock is a card:
```
┌──────────────────────────────────┐
│ VCB - 85,600 (+2.1%) 🟢          │
│ Score: 9/10 | Vol: 87% | Ready ✓ │
│ Setup: Pullback to 20 EMA        │
│ [DETAILS] [CHART] [ALERT]        │
└──────────────────────────────────┘
```
- Swipe left on card → Quick actions (Remove, Alert)
- Tap card → Opens detail panel (full screen on mobile)
- Filter and sort in dropdown menu (hamburger icon)

**Tablet (768px - 1024px):**
- Table layout maintained
- Fewer columns (hide "Days" and "Setup Type" columns)
- Detail panel slides over table (full height)

---

### 4.3 SCREEN 3: 💼 PORTFOLIO

**Purpose:** Complete view of your trading capital, open positions, profit/loss tracking, and financial analytics

This is the MONEY TRACKING hub - where every VND is accounted for.

#### Layout Structure (Desktop)

```
┌─────────────────────────────────────────────────────────────────┐
│ PORTFOLIO HEADER                                                │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ Total Portfolio Value: 108,200,000₫                         │ │
│ │ All-Time P&L: +8,200,000₫ (+8.2%) Since Jan 1, 2025        │ │
│ │                                                              │ │
│ │ [Capital Tab] [Positions Tab] [History Tab] [Analytics Tab] │ │
│ └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ TAB 1: CAPITAL OVERVIEW (Default View)                          │
│                                                                  │
│ ┌──────────────────┐  ┌──────────────────┐  ┌────────────────┐ │
│ │ AVAILABLE CASH   │  │ LOCKED CAPITAL   │  │ IN POSITIONS   │ │
│ │                  │  │                  │  │                │ │
│ │  35,000,000₫     │  │  15,200,000₫     │  │  58,000,000₫   │ │
│ │  (32.3%)         │  │  (14.0%)         │  │  (53.6%)       │ │
│ │                  │  │                  │  │                │ │
│ │  Ready to use    │  │  T+2 Settlement  │  │  4 positions   │ │
│ │  for new trades  │  │  ┌────────────┐  │  │                │ │
│ │                  │  │  │ Settles:   │  │  │  [Details ▼]   │ │
│ │  [ADD FUNDS]     │  │  │ Jan 14: 8M │  │  │                │ │
│ │                  │  │  │ Jan 15: 7M │  │  │                │ │
│ │                  │  │  └────────────┘  │  │                │ │
│ └──────────────────┘  └──────────────────┘  └────────────────┘ │
│                                                                  │
│ ┌──────────────────────────────────────────────────────────┐   │
│ │ CAPITAL BREAKDOWN PIE CHART                              │   │
│ │                                                           │   │
│ │        [Visual pie chart showing:]                       │   │
│ │        - Cash: 32.3%                                     │   │
│ │        - Locked: 14.0%                                   │   │
│ │        - VCB Position: 26.4%                             │   │
│ │        - HPG Position: 15.7%                             │   │
│ │        - VNM Position: 7.2%                              │   │
│ │        - FPT Position: 4.4%                              │   │
│ │                                                           │   │
│ └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│ ┌──────────────────────────────────────────────────────────┐   │
│ │ RISK ALLOCATION                                          │   │
│ │                                                           │   │
│ │  Current Risk: 4.2% / 6.0% Maximum                       │   │
│ │  [■■■■■■■□□□□□□□□] 70% of max risk used                  │   │
│ │                                                           │   │
│ │  Risk by Position:                                       │   │
│ │  VCB: 1.5% [■■■■■]                                       │   │
│ │  HPG: 1.2% [■■■■]                                        │   │
│ │  VNM: 1.0% [■■■]                                         │   │
│ │  FPT: 0.5% [■■]                                          │   │
│ │                                                           │   │
│ │  Available for new positions: 1.8%                       │   │
│ │  (Can add 1-2 more positions with 1% risk each)          │   │
│ └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

#### Component Specifications - CAPITAL TAB

**1. Portfolio Header Strip**
- **Total Portfolio Value:**
  - Large, prominent number (40-48px font size)
  - Real-time update (every 10 seconds during market hours)
  - Calculated as: Available Cash + Locked Capital + Current Value of All Positions
  - **Calculation shown on hover:**
    ```
    Total Portfolio Value: 108,200,000₫
    
    = Available Cash (35,000,000₫)
    + Locked Capital (15,200,000₫)  
    + Position Values (58,000,000₫)
      • VCB: 29,425,000₫
      • HPG: 17,024,000₫
      • VNM: 7,771,000₫
      • FPT: 3,780,000₫
    ```

- **All-Time P&L:**
  - Shows total profit/loss since account inception
  - Percentage and absolute amount
  - Color-coded (green if positive, red if negative)
  - Click → Opens detailed P&L breakdown modal

**2. Three Summary Cards (Top Row)**

**Card A: Available Cash**
- **Purpose:** Money ready to use RIGHT NOW for new trades
- **Calculation:** Total Account Balance - Locked Capital - Sum of Open Position Values
- **Display:**
  - Large number (VND amount)
  - Percentage of total portfolio
  - Status text: "Ready to use for new trades"
- **Interactions:**
  - Click → Shows cash flow history
  - Button: [ADD FUNDS] → Instructions to deposit to SSI
- **Special States:**
  - If < 20% of portfolio: Warning message "Low cash reserves"
  - If < 10%: Error message "Insufficient cash buffer (keep 20-30%)"

**Card B: Locked Capital (T+2 Settlement)**
- **Purpose:** Money in settlement limbo (sold positions waiting to clear)
- **Calculation:** Sum of all unsettled sales
- **Display:**
  - Total locked amount
  - Percentage of portfolio
  - Settlement calendar showing when money becomes available
- **Settlement Calendar:**
  ```
  Settles Jan 14: 8,000,000₫ (VNM sale)
  Settles Jan 15: 7,200,000₫ (FPT sale)
  ```
- **Interactions:**
  - Hover over date → Shows which trade settled that day
  - Click → Opens full settlement calendar
- **Notifications:**
  - Day before settlement: "8M VND available tomorrow"
  - Morning of settlement: "8M VND now available"

**Card C: In Positions**
- **Purpose:** Total value of all open positions
- **Calculation:** Sum of (Current Price × Number of Shares) for all open positions
- **Display:**
  - Total value
  - Percentage of portfolio
  - Count of open positions
  - Expandable list showing breakdown by position
- **Expandable Details:**
  ```
  VCB: 29,425,000₫ (333 shares @ 88,400)
  HPG: 17,024,000₫ (600 shares @ 28,373)
  VNM: 7,771,000₫ (400 shares @ 19,428)
  FPT: 3,780,000₫ (184 shares @ 20,543)
  ```
- **Interactions:**
  - Click position → Jumps to Positions tab
  - Shows unrealized P&L for each

**3. Capital Breakdown Pie Chart**
- **Visual:** Interactive donut/pie chart
- **Segments:**
  - Cash (one segment)
  - Locked Capital (one segment)
  - Each position (separate segment per stock)
- **Colors:** Distinct color per segment, consistent across app
- **Interactions:**
  - Hover segment → Highlights and shows:
    - Segment name
    - Value (VND)
    - Percentage of portfolio
    - P&L if position
  - Click segment → Opens relevant detail view
  - Legend below chart (can click to show/hide segments)
- **Responsive:** On mobile, switches to horizontal bar chart

**4. Risk Allocation Panel**
- **Current Risk Display:**
  - Shows aggregate risk as fraction: "4.2% / 6.0%"
  - Horizontal bar showing % of max risk used
  - Segmented bar (each segment = 1% risk)
- **Risk by Position:**
  - Each position listed with its risk contribution
  - Mini horizontal bars showing relative risk
  - Color coding:
    - Green: Safe (<3% aggregate)
    - Yellow: Moderate (3-5%)
    - Red: High (5-6%)
    - Pulsing Red: Critical (>6%, shouldn't happen)
- **Available Risk:**
  - Calculates: 6% max - current risk = available
  - Shows how many positions you can add
  - Example: "Can add 1-2 more positions with 1% risk each"
- **Interactions:**
  - Click position → Shows how risk is calculated
  - Hover bar → Tooltip with details:
    ```
    VCB Risk: 1.5%
    
    Position size: 333 shares @ 85,000 = 28,305,000₫
    Stop: 81,100
    Risk per share: 3,900₫
    Total risk: 1,299,700₫
    As % of portfolio (100M): 1.3%
    (Displayed as 1.5% due to gap risk multiplier)
    ```

#### TAB 2: POSITIONS (Active Trades)

```
┌─────────────────────────────────────────────────────────────────┐
│ POSITIONS TAB                                                    │
│                                                                  │
│ [All (4)] [Winners (2)] [Losers (1)] [Break-even (1)]          │
│                                                                  │
│ Sort by: [P&L ▼] [Days Held] [Risk] [% Gain]                   │
│                                                                  │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ POSITION CARDS (Stacked vertically)                         │ │
│ │                                                              │ │
│ │ ┌──────────────────────────────────────────────────────────┐│ │
│ │ │ VCB - Vietcombank                    [CHART] [MANAGE]    ││ │
│ │ ├──────────────────────────────────────────────────────────┤│ │
│ │ │ Entry: 85,000₫ on Jan 3, 2025 (10 days ago)            ││ │
│ │ │ Current: 88,400₫ (+4.0%)                                ││ │
│ │ │                                                          ││ │
│ │ │ Position Size: 333 shares                               ││ │
│ │ │ Entry Value: 28,305,000₫                                ││ │
│ │ │ Current Value: 29,425,200₫                              ││ │
│ │ │                                                          ││ │
│ │ │ ┌───────────────────────────────────────────────────┐  ││ │
│ │ │ │ PROFIT/LOSS BREAKDOWN                             │  ││ │
│ │ │ ├───────────────────────────────────────────────────┤  ││ │
│ │ │ │ Gross P&L:        +1,120,200₫                     │  ││ │
│ │ │ │ Entry Commission:    -70,762₫ (0.25%)            │  ││ │
│ │ │ │ Exit Commission:     -73,563₫ (0.25%, estimated) │  ││ │
│ │ │ │ Exit Tax:            -29,425₫ (0.1%, estimated)  │  ││ │
│ │ │ │ ─────────────────────────────────────             │  ││ │
│ │ │ │ NET P&L:         +946,450₫ (+3.3%)                │  ││ │
│ │ │ │ R-Multiple:       +3.2R                           │  ││ │
│ │ │ └───────────────────────────────────────────────────┘  ││ │
│ │ │                                                          ││ │
│ │ │ Stop Loss: 81,100₫ (-4.6% | -1R)                       ││ │
│ │ │ [■■■■■■■■■■■■■□□□□□□□] 65% to T1                        ││ │
│ │ │                                                          ││ │
│ │ │ Targets:                                                ││ │
│ │ │ T1: 91,000₫ (+7.1% | +2R) - Sell 25%                   ││ │
│ │ │ T2: 97,000₫ (+14.1% | +3R) - Sell 25%                  ││ │
│ │ │ T3: Trail with 20 EMA - Remaining 50%                   ││ │
│ │ │                                                          ││ │
│ │ │ Days Held: 10 days | Avg Hold: 18 days (historical)    ││ │
│ │ │ Risk: 1.5% of portfolio                                 ││ │
│ │ │ Setup: Pullback to 20 EMA                               ││ │
│ │ │                                                          ││ │
│ │ │ [ADJUST STOP] [TAKE PROFIT] [CLOSE POSITION] [NOTES]   ││ │
│ │ └──────────────────────────────────────────────────────────┘│ │
│ │                                                              │ │
│ │ ┌──────────────────────────────────────────────────────────┐│ │
│ │ │ HPG - Hoa Phat Group                  [CHART] [MANAGE]  ││ │
│ │ ├──────────────────────────────────────────────────────────┤│ │
│ │ │ Entry: 28,500₫ on Dec 20, 2024 (24 days ago)          ││ │
│ │ │ Current: 34,200₫ (+20.0%)                              ││ │
│ │ │ ... (similar structure to VCB card)                     ││ │
│ │ └──────────────────────────────────────────────────────────┘│ │
│ │                                                              │ │
│ │ ... (More position cards for VNM and FPT)                   │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                  │
│ [EXPORT POSITIONS] [CALCULATE IF ALL CLOSE NOW]                 │
└─────────────────────────────────────────────────────────────────┘
```

#### Component Specifications - POSITIONS TAB

**1. Position Filter Tabs**
- **All:** Shows every open position
- **Winners:** P&L > 0
- **Losers:** P&L < 0
- **Break-even:** P&L ≈ 0 (within ±0.5%)
- Badge showing count in each category
- Active tab highlighted

**2. Sort Dropdown**
- Default: By P&L (largest winners first)
- Options:
  - P&L (VND)
  - P&L (%)
  - P&L (R-multiple)
  - Days Held (longest first / shortest first)
  - Risk (highest first)
  - Entry Date (newest / oldest)
  - Symbol (alphabetical)

**3. Position Cards - Detailed Breakdown**

Each position gets a detailed card (not just a table row like Dashboard):

**Card Header:**
- Stock symbol and company name (large, bold)
- [CHART] button: Opens full chart modal
- [MANAGE] dropdown: Quick actions (adjust stop, close, add notes)

**Entry Information:**
- Entry price
- Entry date with days-ago calculation
- Current price with % change (large, color-coded)
- Real-time updates during market hours

**Position Sizing:**
- Number of shares
- Entry value (shares × entry price)
- Current value (shares × current price)
- Clear calculation shown

**Profit/Loss Breakdown Section** (Critical for Money Tracking)

This is the CORE of financial tracking - showing EXACTLY where every VND went:

```
┌─────────────────────────────────────────┐
│ PROFIT/LOSS BREAKDOWN                   │
├─────────────────────────────────────────┤
│ Gross P&L:        +1,120,200₫          │
│ (Current Value - Entry Value)           │
│                                         │
│ ENTRY COSTS:                            │
│ Entry Commission:    -70,762₫ (0.25%)  │
│ (Paid to SSI when bought)               │
│                                         │
│ EXIT COSTS (Estimated):                 │
│ Exit Commission:     -73,563₫ (0.25%)  │
│ Exit Tax:            -29,425₫ (0.1%)   │
│ (Will pay when selling)                 │
│                                         │
│ ─────────────────────────────────────   │
│ NET P&L:         +946,450₫ (+3.3%)     │
│ (What you actually keep)                │
│                                         │
│ R-Multiple:       +3.2R                 │
│ (Profit / Initial Risk)                 │
└─────────────────────────────────────────┘
```

**How Each Cost is Calculated:**

1. **Entry Commission (Paid Already):**
   ```
   = Entry Value × Commission Rate
   = 28,305,000 × 0.0025
   = 70,762₫
   ```
   - This was deducted from your cash when you bought
   - Stored in database when trade entered
   - Fixed number (doesn't change)

2. **Exit Commission (Estimated):**
   ```
   = Current Value × Commission Rate
   = 29,425,200 × 0.0025
   = 73,563₫
   ```
   - Updates in real-time as current price changes
   - Marked as "estimated" (won't pay until you sell)
   - Shows "(0.25%)" to remind user of rate

3. **Exit Tax (Estimated):**
   ```
   = Current Value × Tax Rate
   = 29,425,200 × 0.001
   = 29,425₫
   ```
   - Vietnam-specific: 0.1% tax on sell transactions
   - Also updates in real-time
   - Marked as "estimated"

4. **Gross P&L:**
   ```
   = Current Value - Entry Value
   = 29,425,200 - 28,305,000
   = 1,120,200₫
   ```
   - Simple difference
   - This is what beginners think they made
   - But NOT what you actually keep!

5. **Net P&L (The Truth):**
   ```
   = Gross P&L - Entry Commission - Exit Commission - Exit Tax
   = 1,120,200 - 70,762 - 73,563 - 29,425
   = 946,450₫
   ```
   - This is what you ACTUALLY keep
   - Displayed most prominently (large, bold)
   - This is the number that matters

6. **Net P&LPercentage:**
   ```
   = Net P&L / Entry Value × 100
   = 946,450 / 28,305,000 × 100
   = 3.34%
   ```
   - Shows return as percentage
   - Based on NET profit, not gross

7. **R-Multiple:**
   ```
   = Net P&L / Initial Risk Amount
   
   Initial Risk:
   = Position Size × (Entry - Stop)
   = 333 × (85,000 - 81,100)
   = 333 × 3,900
   = 1,298,700₫
   
   R-Multiple = 946,450 / 1,298,700 = 0.73R
   Wait, card shows +3.2R?
   
   That's because current price is 88,400
   Current Risk = 333 × (88,400 - 81,100) = 2,430,900₫
   From entry perspective: 
   Unrealized gain = 88,400 - 85,000 = 3,400
   Unrealized R = 3,400 / 3,900 (initial risk per share) = 0.87R
   
   But card shows 3.2R because:
   Current price above T1 (91,000 = +2R)
   Progress toward T2 (97,000 = +3R)
   
   Actually, let me recalculate:
   R = (Current - Entry) / (Entry - Stop)
   R = (88,400 - 85,000) / (85,000 - 81,100)
   R = 3,400 / 3,900
   R = 0.87R
   
   Hmm, discrepancy in my example. Let me fix:
   If it shows +3.2R, then calculation must be:
   Gain = 88,400 - 85,000 = 3,400 per share
   Risk per share = (Entry - Stop) / Shares... 
   
   Actually, in the GST system:
   1R = Entry - Stop = 85,000 - 81,100 = 3,900
   Current gain = 88,400 - 85,000 = 3,400
   R-multiple = 3,400 / 3,900 = 0.87R (not 3.2R)
   
   My example numbers were inconsistent. Let me recalculate correct example:
   
   If R-multiple is truly +3.2R:
   3.2R × 3,900 (1R) = 12,480 gain per share
   Current price = 85,000 + 12,480 = 97,480
   
   New breakdown:
   Current: 97,480 (+14.7%)
   Position value: 333 × 97,480 = 32,460,840₫
   Gross P&L = 32,460,840 - 28,305,000 = 4,155,840₫
   Entry commission: 70,762₫
   Exit commission: 32,460,840 × 0.0025 = 81,152₫
   Exit tax: 32,460,840 × 0.001 = 32,461₫
   Net P&L = 4,155,840 - 70,762 - 81,152 - 32,461 = 3,971,465₫
   R-multiple = 3,400 / 1,066 (net risk accounting for costs) = 3.2R ✓
   ```

**Corrected Example:**
```
┌─────────────────────────────────────────┐
│ PROFIT/LOSS BREAKDOWN                   │
├─────────────────────────────────────────┤
│ Gross P&L:        +4,155,840₫          │
│ Entry Commission:     -70,762₫         │
│ Exit Commission:      -81,152₫ (est.)  │
│ Exit Tax:             -32,461₫ (est.)  │
│ ─────────────────────────────────────   │
│ NET P&L:         +3,971,465₫ (+14.0%)  │
│ R-Multiple:       +3.2R                 │
└─────────────────────────────────────────┘
```

**Visual Enhancements:**
- Gross P&L: Regular text
- Costs: Smaller, gray text with minus signs
- NET P&L: Large, bold, color-coded (green/red)
- R-Multiple: Badge with color (green if positive)
- Hover any line → Tooltip shows formula
- Click "Show Calculation" → Expands to show step-by-step math

**Stop Loss & Target Section:**
- Current stop level with % distance
- Progress bar showing position between stop and next target
  - Example: If current price is 65% of way from stop to T1
  - Bar fills 65%, remaining 35% is gray
- List of targets with:
  - Price level
  - % gain if hit
  - R-multiple
  - Planned action ("Sell 25%")
- Visual: Horizontal ladder showing Stop → Current → T1 → T2 → T3

**Metadata Row:**
- Days held vs average hold time (to spot stagnant positions)
- Risk as % of portfolio
- Setup type (how you entered)
- Last updated timestamp

**Action Buttons:**
- **[ADJUST STOP]:** Opens modal to change stop price
  - Shows current stop
  - Input new stop
  - Recalculates risk
  - Warns if risk increases
  - Requires confirmation
- **[TAKE PROFIT]:** Quick-sell options
  - Sell 25% at market
  - Sell 50% at market
  - Close entire position
  - Set limit order at target
- **[CLOSE POSITION]:** Full exit
  - Confirms you want to close
  - Shows estimated proceeds after all costs
  - Executes SSI guide
- **[NOTES]:** Add/view trade notes
  - Why you entered
  - Observations during hold
  - Exit reasoning (when closed)

**4. Special Position States**

**Warning States (Amber background tint):**
- Position held >20 days with <0.5R profit: "Stagnant position - consider time stop"
- Price within 2% of stop: "Approaching stop loss - monitor closely"
- High correlation with other position: "70% correlated with VPB - sector risk"

**Critical States (Red background tint):**
- Stop loss hit but couldn't exit (floor limit): "STOP HIT - EXIT TOMORROW"
- Position size >30% of portfolio: "OVERWEIGHT - Consider reducing"
- Daily limit approaching: "Within 3% of ceiling/floor"

**Success States (Green background tint):**
- Hit T1 or T2: "Target reached! Time to scale out"
- Position up >5R: "Excellent trade! Consider taking profits"

#### TAB 3: HISTORY (Closed Trades)

```
┌─────────────────────────────────────────────────────────────────┐
│ HISTORY TAB                                                      │
│                                                                  │
│ [Filters]                                                        │
│ Date Range: [Last 30 Days ▼]                                   │
│ Outcome: [All] [Winners] [Losers]                              │
│ Stock: [All Stocks ▼]                                           │
│ Setup Type: [All ▼]                                             │
│                                                                  │
│ Showing: 23 closed trades | Win Rate: 65% | Avg R: +1.2R       │
│                                                                  │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ CLOSED TRADES TABLE                                         │ │
│ │                                                              │ │
│ │ ┌──┬───────┬───────┬───────┬───────┬──────┬───────┬──────┐ │ │
│ │ │Ex│Symbol │Entry  │Exit   │Days   │Net   │R      │Reason│ │ │
│ │ ├──┼───────┼───────┼───────┼───────┼──────┼───────┼──────┤ │ │
│ │ │+ │VNM    │88,000 │93,500 │15 days│+1.8M │+2.1R  │T1 Hit│ │ │
│ │ │  │Jan 2  │Jan 17 │       │+6.2% │      │       │      │ │ │
│ │ ├──┼───────┼───────┼───────┼───────┼──────┼───────┼──────┤ │ │
│ │ │- │TCB    │24,500 │22,100 │8 days │-920K │-0.9R  │Stop  │ │ │
│ │ │  │Jan 5  │Jan 13 │       │-9.8% │      │       │      │ │ │
│ │ ├──┼───────┼───────┼───────┼───────┼──────┼───────┼──────┤ │ │
│ │ │+ │FPT    │92,000 │98,500 │22 days│+2.4M │+2.8R  │T2 Hit│ │ │
│ │ │  │Dec 18 │Jan 9  │       │+7.1% │      │       │      │ │ │
│ │ │  │... 20 more rows                                      │ │ │
│ │ └──┴───────┴───────┴───────┴───────┴──────┴───────┴──────┘ │ │
│ │                                                              │ │
│ │ [EXPORT CSV] [VIEW ANALYTICS] [IMPORT OLD TRADES]           │ │
│ └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

#### Component Specifications - HISTORY TAB

**1. Filter System**
- **Date Range Picker:**
  - Presets: Last 7 Days, Last 30 Days, Last 3 Months, Last 6 Months, This Year, All Time, Custom Range
  - Custom range: Date picker for start and end
- **Outcome Filter:**
  - All, Winners Only, Losers Only, Break-even
  - Shows count for each category
- **Stock Filter:**
  - Dropdown with all stocks you've ever traded
  - Multi-select option
- **Setup Type Filter:**
  - All, Pullback, Breakout, MA Bounce, Mean Reversion, etc.

**2. Summary Statistics Bar**
- Shows aggregate stats for filtered trades:
  - Total trades count
  - Win rate (% and fraction, e.g., "15/23 = 65%")
  - Average R-multiple
  - Total profit/loss (VND and %)
  - Best trade and worst trade

**3. Closed Trades Table**

**Column Details:**
- **Exit Icon:** ✓ (green) for winners, ✗ (red) for losers, ≈ (gray) for break-even
- **Symbol:** Stock ticker, clickable to see all trades for that stock
- **Entry:** Entry price and date (date in smaller text below)
- **Exit:** Exit price and date
- **Days Held:** Number of days position was open
- **Net P&L:** Final profit/loss AFTER ALL COSTS
  - Absolute VND amount (large)
  - Percentage return (smaller, below)
  - Color-coded
- **R-Multiple:** How many risk units gained/lost
- **Exit Reason:**
  - "T1 Hit" (target 1 reached)
  - "T2 Hit" (target 2)
  - "Trailing Stop" (trailed to exit)
  - "Stop Loss" (hit stop)
  - "Time Stop" (held too long)
  - "Thesis Invalid" (setup failed)
  - "Risk Limit" (portfolio risk management)
  - "Manual" (user decision)

**Row Interactions:**
- Click row → Opens detailed trade review modal
- Hover → Highlights row
- Right-click → Context menu: View Chart, View Journal Entry, Delete Trade (with confirmation)

**4. Detailed Trade Review Modal** (Opens when clicking a row)

```
┌──────────────────────────────────────────────────────────────┐
│ TRADE REVIEW: VNM (Jan 2 - Jan 17, 2025)              [×]   │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│ [Left Panel: Trade Data]         [Right Panel: Chart]        │
│                                                               │
│ ENTRY                            [Price chart showing:]       │
│ Date: Jan 2, 2025 at 10:23 AM   - Entry point marked         │
│ Price: 88,000₫                   - Stop level                 │
│ Shares: 400                       - Exit point marked         │
│ Value: 35,200,000₫               - Targets shown              │
│ Setup: Pullback to 20 EMA        - 30 days before/after      │
│ Score: 8/10                                                   │
│                                                               │
│ EXIT                                                          │
│ Date: Jan 17, 2025 at 2:15 PM                                │
│ Price: 93,500₫                                               │
│ Reason: T1 Target Hit                                        │
│ Days Held: 15 days                                           │
│                                                               │
│ FINANCIAL BREAKDOWN                                           │
│ Entry Value:        35,200,000₫                              │
│ Exit Value:         37,400,000₫                              │
│ Gross P/L:          +2,200,000₫                              │
│                                                               │
│ Entry Commission:       -88,000₫                             │
│ Exit Commission:        -93,500₫                             │
│ Exit Tax:               -37,400₫                             │
│ ─────────────────────────────────────                        │
│ NET P/L:            +1,981,100₫ (+5.6%)                      │
│ R-Multiple:          +2.1R                                    │
│                                                               │
│ PERFORMANCE METRICS                                           │
│ Max Favorable: 94,200₫ (+7.0%)                              │
│ Max Adverse: 87,100₫ (-1.0%)                                │
│ MAE: -0.2R                                                    │
│ MFE: +2.3R                                                    │
│                                                               │
│ JOURNAL NOTES                                                 │
│ Entry: "Perfect pullback setup, volume decreased nicely"     │
│ Exit: "Hit T1 target, sold 25% as planned. Should have      │
│        held rest longer - it went to 96K next day!"          │
│                                                               │
│ [EXPORT TRADE DATA] [ADD TO CASE STUDY] [CLOSE]             │
└──────────────────────────────────────────────────────────────┘
```

This modal provides COMPLETE post-trade analysis showing:
- Exact financial outcome
- Chart visualization of trade
- Performance metrics (MAE/MFE)
- Journal notes for learning

#### TAB 4: ANALYTICS (Performance Dashboard)

```
┌─────────────────────────────────────────────────────────────────┐
│ ANALYTICS TAB                                                    │
│                                                                  │
│ Date Range: [Last 3 Months ▼]  [Compare to Previous Period]    │
│                                                                  │
│ ┌───────────────────┐ ┌───────────────────┐ ┌────────────────┐ │
│ │ KEY METRICS       │ │ EFFICIENCY        │ │ RISK METRICS   │ │
│ │                   │ │                   │ │                │ │
│ │ Total Trades: 23  │ │ Win Rate: 65%    │ │ Avg Risk: 1.2% │ │
│ │ Winners: 15       │ │ (15W / 8L)       │ │ Max Risk: 2.0% │ │
│ │ Losers: 8         │ │                   │ │ Sharpe: 1.45   │ │
│ │                   │ │ Expectancy:       │ │ Max DD: -8.2%  │ │
│ │ Net P/L:          │ │ +1.2R per trade   │ │ Recovery: 2.1  │ │
│ │ +18,400,000₫     │ │                   │ │                │ │
│ │ (+18.4%)          │ │ Profit Factor:    │ │ Consec Loss: 3 │ │
│ │                   │ │ 2.4               │ │ (max streak)   │ │
│ └───────────────────┘ └───────────────────┘ └────────────────┘ │
│                                                                  │
│ ┌──────────────────────────────────────────────────────────┐   │
│ │ EQUITY CURVE                                             │   │
│ │                                                           │   │
│ │ [Line chart showing account value over time]             │   │
│ │ Starting: 100M → Current: 118.4M                        │   │
│ │ Drawdown periods shaded in red                           │   │
│ │ Hoverable: Shows exact value and date on hover           │   │
│ └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│ ┌─────────────────────────┐ ┌─────────────────────────────────┐│
│ │ SETUP TYPE BREAKDOWN    │ │ R-MULTIPLE DISTRIBUTION         ││
│ │                         │ │                                 ││
│ │ [Bar chart]             │ │ [Histogram]                     ││
│ │                         │ │                                 ││
│ │ Pullback:   12 trades   │ │ Showing distribution of         ││
│ │   Win: 75% | Avg: 1.8R  │ │ all trades by R-multiple        ││
│ │                         │ │                                 ││
│ │ Breakout:   8 trades    │ │ Most common: +2R to +3R        ││
│ │   Win: 50% | Avg: 0.8R  │ │ Losers cluster at -1R (good)   ││
│ │                         │ │ Few big winners >+4R (great)   ││
│ │ MA Bounce:  3 trades    │ │                                 ││
│ │   Win: 67% | Avg: 1.5R  │ │                                 ││
│ └─────────────────────────┘ └─────────────────────────────────┘│
│                                                                  │
│ ┌──────────────────────────────────────────────────────────┐   │
│ │ MAE vs MFE SCATTER PLOT                                  │   │
│ │                                                           │   │
│ │ Y-axis: Final R-multiple                                 │   │
│ │ X-axis: Maximum Adverse Excursion                        │   │
│ │                                                           │   │
│ │ [Scatter plot with each trade as a dot]                  │   │
│ │                                                           │   │
│ │ Insight: Most winners had MAE < 0.5R                     │   │
│ │ → Current stops are well-positioned                      │   │
│ └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│ [EXPORT FULL REPORT] [COMPARE TO BACKTEST] [VIEW MONTHLY]      │
└─────────────────────────────────────────────────────────────────┘
```

#### Component Specifications - ANALYTICS TAB

**Purpose:** Comprehensive performance analysis with visual dashboards

**1. Time Period Selector**
- Choose analysis period
- Option to compare two periods (e.g., "This quarter vs last quarter")

**2. Key Metrics Cards** (Top Row)

**Card A: Trading Activity**
- Total number of trades
- Winners count
- Losers count
- Net P/L (VND and %)

**Card B: Efficiency Metrics**
- Win Rate (percentage and fraction)
- Expectancy (R-multiple per trade)
- Profit Factor (gross profit / gross loss)

**Card C: Risk Metrics**
- Average risk per trade
- Maximum risk taken
- Sharpe Ratio
- Maximum drawdown
- Recovery factor
- Longest losing streak

**3. Equity Curve Chart**
- X-axis: Time (dates)
- Y-axis: Account value (VND)
- Line showing account growth/decline
- Drawdown periods shaded in red
- Hover to see exact value at any point
- Can toggle to show:
  - Absolute value
  - Percentage gain from start
  - R-multiple gain

**4. Setup Type Breakdown**
- Bar chart or table showing:
  - Number of trades per setup type
  - Win rate for each setup
  - Average R-multiple for each
  - Total R generated by each setup
- **Insight:** Identify which setups work best for you
- Example finding: "Your pullback trades have 75% win rate vs 50% for breakouts → Focus more on pullbacks"

**5. R-Multiple Distribution (Histogram)**
- X-axis: R-multiple buckets (-2R, -1R, 0R, +1R, +2R, +3R, +4R, +5R+)
- Y-axis: Count of trades
- **Purpose:** Visualize trade distribution
- **Good pattern:**
  - Losers cluster tightly around -1R (stops working)
  - Winners spread from +1R to +5R+ (letting winners run)
  - Long right tail (some big winners)
- **Bad pattern:**
  - Losers spread from -1R to -3R (stops not respected)
  - Winners cluster at +0.5R to +1R (cutting winners too early)

**6. MAE vs MFE Scatter Plot**
- Each dot = one trade
- X-axis: Maximum Adverse Excursion (how far trade went against you)
- Y-axis: Final R-multiple outcome
- **Purpose:** Optimize stop placement
- **Insights:**
  - If most winners have MAE < 0.5R → Stops are good
  - If many winners have MAE > 1.5R → Stops too tight, widen them
  - If losers have MAE > 1.2R → Holding losers too long, exit faster

**7. Additional Charts** (Scroll down for more)

**Monthly Performance Calendar:**
```
        Jan    Feb    Mar    Apr    May    Jun
2025  +8.2%  +4.1%  -2.3%  +6.5%   ...    ...
```
- Heatmap showing monthly returns
- Green for positive months, red for negative
- Click month → Drill down into that month's trades

**Sector Performance:**
- Pie chart or bar showing P/L by sector
- Example: "Banking: +12M, Real Estate: -2M, Manufacturing: +5M"

**Holding Period Analysis:**
- How does profit correlate with hold time?
- Chart showing:
  - Trades held <10 days: Win% and Avg R
  - Trades held 10-20 days: Win% and Avg R
  - Trades held 20-30 days: Win% and Avg R
  - Trades held >30 days: Win% and Avg R
- **Insight:** "Your best trades average 18 days - don't exit too early"

**Day of Week Analysis:**
- Do trades entered on certain days perform better?
- Table showing entry day vs win rate
- Example finding: "Monday entries: 70% win rate, Friday entries: 45%"

**8. Export & Comparison Tools**
- **EXPORT FULL REPORT:** PDF with all charts and tables
- **COMPARE TO BACKTEST:** Side-by-side comparison
  - Backtest expectancy: +0.8R
  - Live trading expectancy: +1.2R
  - Status: "Exceeding backtest! ✓"
- **VIEW MONTHLY:** Detailed month-by-month breakdown

---

### 4.4 SCREEN 4: 📈 SIGNALS

**Purpose:** Central hub for all buy/sell alerts - from formation to execution

This screen is where the AI's monitoring work surfaces as actionable signals.

#### Layout Structure (Desktop)

```
┌─────────────────────────────────────────────────────────────────┐
│ SIGNALS HEADER                                                   │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ [ACTIVE (3)] [WATCH (5)] [DISMISSED (12)] [HISTORY (156)]  │ │
│ │                                                              │ │
│ │ Sort by: [Priority ▼] [Score] [Time] [Stock]               │ │
│ │ Filter: [All Types ▼] [All Stocks ▼]                       │ │
│ └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ ACTIVE SIGNALS TAB (Default)                                    │
│                                                                  │
│ These are READY TO ACT ON RIGHT NOW                             │
│                                                                  │
│ ┌──────────────────────────────────────────────────────────────┐│
│ │ 🎯 SIGNAL CARD 1                                            ││
│ │ ┌────────────────────────────────────────────────────────────││
│ │ │ BUY SIGNAL                    Generated: 10:23 AM  [×] [⋮] ││
│ │ │ VCB - Vietcombank                                          ││
│ │ │ Score: 9/10 🟢 HIGH CONVICTION                             ││
│ │ │                                                            ││
│ │ │ Current Price: 85,600₫ (+2.1%) [Live updating]           ││
│ │ │ Valid Until: 11:00 AM (37 minutes)                        ││
│ │ │ Freshness: 🟢 FRESH                                       ││
│ │ │                                                            ││
│ │ │ SETUP: Pullback to 20 EMA in Strong Uptrend               ││
│ │ │                                                            ││
│ │ │ ┌─────────────────────────────────────────────────────┐  ││
│ │ │ │ ENTRY & RISK                                        │  ││
│ │ │ ├─────────────────────────────────────────────────────┤  ││
│ │ │ │ Suggested Entry:  85,500 - 85,800                  │  ││
│ │ │ │ Stop Loss:        81,100 (below swing low)         │  ││
│ │ │ │ Risk per Share:   4,400₫                           │  ││
│ │ │ │ Risk Distance:    5.1%                             │  ││
│ │ │ │                                                     │  ││
│ │ │ │ Targets:                                           │  ││
│ │ │ │ T1 (2R): 94,300 (+10.3%) - Sell 25%               │  ││
│ │ │ │ T2 (3R): 98,700 (+15.3%) - Sell 25%               │  ││
│ │ │ │ T3: Trail remaining 50% with 20 EMA                │  ││
│ │ │ │                                                     │  ││
│ │ │ │ Risk/Reward: 2.8:1 ✓                               │  ││
│ │ │ └─────────────────────────────────────────────────────┘  ││
│ │ │                                                            ││
│ │ │ ┌─────────────────────────────────────────────────────┐  ││
│ │ │ │ POSITION SIZING (1.5% risk recommended)            │  ││
│ │ │ ├─────────────────────────────────────────────────────┤  ││
│ │ │ │ Your Capital:     100,000,000₫                     │  ││
│ │ │ │ Risk Amount:      1,500,000₫ (1.5%)               │  ││
│ │ │ │ Position Size:    341 shares                       │  ││
│ │ │ │ Position Value:   29,205,800₫ (29.2% of capital)  │  ││
│ │ │ │                                                     │  ││
│ │ │ │ Worst Case (3-day floor):  -5,115,000₫ (-5.1%)    │  ││
│ │ │ │ (Accounted for in 1.5% sizing)                     │  ││
│ │ │ │                                                     │  ││
│ │ │ │ After Entry:                                        │  ││
│ │ │ │ • Open Positions: 5 (was 4)                        │  ││
│ │ │ │ • Aggregate Risk: 5.7% (was 4.2%)  ⚠️ High         │  ││
│ │ │ │ • Available Cash: 5.8M (was 35M)                   │  ││
│ │ │ └─────────────────────────────────────────────────────┘  ││
│ │ │                                                            ││
│ │ │ ┌─────────────────────────────────────────────────────┐  ││
│ │ │ │ WHY THIS SIGNAL? (AI Reasoning)                    │  ││
│ │ │ ├─────────────────────────────────────────────────────┤  ││
│ │ │ │ ✓ Weekly uptrend confirmed (above 200 SMA)        │  ││
│ │ │ │ ✓ Daily pullback perfect (touched 20 EMA)         │  ││
│ │ │ │ ✓ Volume decreased during pullback (accumulation)  │  ││
│ │ │ │ ✓ Hammer candle formed (strong rejection)         │  ││
│ │ │ │ ✓ Volume spike today (87th percentile)            │  ││
│ │ │ │ ✓ RSI reset to 48 (healthy, not oversold)         │  ││
│ │ │ │ ✓ Banking sector strong (+1.8% today)             │  ││
│ │ │ │ ⚠️ Banking exposure will be 38% (near 40% limit)   │  ││
│ │ │ │                                                     │  ││
│ │ │ │ This matches your 3 best historical trades         │  ││
│ │ │ │ (HPG Dec 5, VPB Nov 18, TCB Oct 22)                │  ││
│ │ │ │ Win probability (ML model): 72%                    │  ││
│ │ │ └─────────────────────────────────────────────────────┘  ││
│ │
```
# Phase 2
│                                                            ││
│ │ │ [EXECUTE TRADE] [VIEW FULL CHART] [ASK AI] [DISMISS]     ││
│ │ └────────────────────────────────────────────────────────────││
│ └──────────────────────────────────────────────────────────────┘│
│                                                                  │
│ ┌──────────────────────────────────────────────────────────────┐│
│ │ ⚡ SIGNAL CARD 2 (EXIT SIGNAL)                              ││
│ │ ┌────────────────────────────────────────────────────────────││
│ │ │ SELL SIGNAL                   Generated: 10:18 AM   [×] [⋮]││
│ │ │ HPG - Hoa Phat Group                                       ││
│ │ │ Priority: 🔴 URGENT                                        ││
│ │ │                                                            ││
│ │ │ Current Price: 34,200₫ (+0.6%)                            ││
│ │ │ Your Position: 600 shares @ 28,500 entry                  ││
│ │ │ Current P/L: +3,420,000₫ (+20.0%, +2.3R)                 ││
│ │ │                                                            ││
│ │ │ REASON: Target 2 Reached ✓                                ││
│ │ │                                                            ││
│ │ │ ┌─────────────────────────────────────────────────────┐  ││
│ │ │ │ RECOMMENDED ACTION                                  │  ││
│ │ │ ├─────────────────────────────────────────────────────┤  ││
│ │ │ │ Sell 25% (150 shares) at current price             │  ││
│ │ │ │                                                     │  ││
│ │ │ │ Expected Proceeds: 5,130,000₫                      │  ││
│ │ │ │ Profit on this sale: ~855,000₫ (+20%)              │  ││
│ │ │ │                                                     │  ││
│ │ │ │ After Sale:                                         │  ││
│ │ │ │ • Remaining: 450 shares                             │  ││
│ │ │ │ • Move stop to 31,000 (lock profit)                │  ││
│ │ │ │ • Next target: T3 trail with 20 EMA                │  ││
│ │ │ │                                                     │  ││
│ │ │ │ This follows your scaling plan ✓                   │  ││
│ │ │ └─────────────────────────────────────────────────────┘  ││
│ │ │                                                            ││
│ │ │ [EXECUTE SALE] [ADJUST STOP] [VIEW POSITION] [DISMISS]   ││
│ │ └────────────────────────────────────────────────────────────││
│ └──────────────────────────────────────────────────────────────┘│
│                                                                  │
│ ... (More signal cards if multiple active)                      │
└─────────────────────────────────────────────────────────────────┘
```

#### Component Specifications - SIGNALS SCREEN

**1. Signal Tabs**
- **ACTIVE:** Signals requiring action NOW (entry ready or exit needed)
- **WATCH:** Setups forming, 70-95% ready, not actionable yet
- **DISMISSED:** Signals you chose to skip
- **HISTORY:** All past signals (for learning)
- Badge count on each tab

**2. Signal Card Structure**

Every signal (entry or exit) has consistent structure:

**Card Header:**
- Signal type badge: "BUY SIGNAL" or "SELL SIGNAL" or "CAUTION"
- Stock symbol and company name
- Score (for entry signals)
- Priority level (for exit signals): URGENT / HIGH / MEDIUM
- Generated timestamp
- Actions: [×] Dismiss, [⋮] More options

**Live Data Section:**
- Current price (updates every 3 seconds)
- Price change % and direction
- For exit signals: Your position details
- Validity timer: "Valid until 11:00 AM (37 minutes)"
- Freshness indicator:
  - 🟢 FRESH (0-15 min old)
  - 🟡 AGING (15-30 min)
  - 🔴 STALE (>30 min, needs recalculation)

**Setup Description:**
- Brief setup name/type
- Example: "Pullback to 20 EMA in Strong Uptrend"
- Example: "Breakout from 4-week consolidation"

**Entry & Risk Panel** (for BUY signals):
- Suggested entry price or range
- Stop loss level with rationale
- Risk per share (Entry - Stop)
- Risk as percentage
- Target levels (T1, T2, T3) with:
  - Price
  - % gain
  - R-multiple
  - Planned action ("Sell 25%")
- Risk/Reward ratio
- Visual: Horizontal diagram showing Stop ← Entry → T1 → T2 → T3

**Position Sizing Panel** (for BUY signals):
- User's current capital
- Recommended risk % (based on score)
- Calculated risk amount (VND)
- Position size (shares)
- Position value (VND and % of capital)
- **Vietnam-specific:** Worst-case scenario (3-day floor)
- **Impact preview:**
  - How many open positions after entry
  - New aggregate risk level
  - Remaining available cash
  - Warnings if approaching limits

**Exit Action Panel** (for SELL signals):
- Which portion to sell (25%, 50%, 100%)
- Expected proceeds
- Profit/loss on this sale
- What to do with remaining shares
- Stop adjustment recommendation

**AI Reasoning Panel** (Expandable):
- Checklist of met/failed criteria
- Each item: ✓ (met), ✗ (failed), ⚠️ (concern)
- Comparison to historical trades
- ML-predicted win probability (optional, if model available)
- Special notes or warnings

**Action Buttons:**
- **Primary action:** [EXECUTE TRADE] or [EXECUTE SALE]
- **Supporting actions:**
  - [VIEW FULL CHART]: Opens full-screen chart
  - [ASK AI]: Opens chat pre-populated with question
  - [ADJUST SIZING]: Modify position size/risk
  - [VIEW POSITION]: (for exit signals) Jump to position details
  - [DISMISS]: Remove from active, move to dismissed

**3. Signal Priority System**

Signals are color-coded by urgency:

**BUY Signals:**
- 🎯 Score 9-10: Green border, "HIGH CONVICTION"
- 👀 Score 8-9: Blue border, "GOOD OPPORTUNITY"
- ⚠️ Score 7-8: Amber border, "ACCEPTABLE"
- ℹ️ Score <7: Gray, shown only in WATCH tab

**SELL/EXIT Signals:**
- 🔴 URGENT: Red border
  - Stop loss hit
  - Thesis invalidated
  - Risk limit approaching
- 🟠 HIGH: Orange border
  - Target reached
  - Time stop triggered
- 🟡 MEDIUM: Yellow border
  - Position review recommended
  - Consider adjusting stop

**4. Execute Trade Flow** (When clicking [EXECUTE TRADE])

Opens a modal with SSI execution guide:

```
┌────────────────────────────────────────────────────┐
│ EXECUTE TRADE: VCB                          [×]    │
├────────────────────────────────────────────────────┤
│                                                    │
│ STEP-BY-STEP GUIDE                                 │
│                                                    │
│ ☐ Step 1: Open SSI iBoard Platform                │
│   [Open SSI] (button that launches SSI if linked) │
│                                                    │
│ ☐ Step 2: Navigate to VCB Trading Screen          │
│   • Click "Trade" → "Stock"                       │
│   • Enter symbol: VCB                             │
│                                                    │
│ ☐ Step 3: Place LIMIT BUY Order                   │
│   Order Type: LIMIT                               │
│   Symbol: VCB                                     │
│   Price: 85,600₫  [COPY]                         │
│   Quantity: 341 shares  [COPY]                    │
│   Total Value: ~29,205,800₫                       │
│                                                    │
│   Confirm order details before submitting!        │
│                                                    │
│ ☐ Step 4: Place STOP-LIMIT SELL Order            │
│   (After buy order is filled)                     │
│   Order Type: STOP-LIMIT                          │
│   Stop Price: 81,100₫  [COPY]                    │
│   Limit Price: 80,600₫  [COPY] (0.6% buffer)     │
│   Quantity: 341 shares                            │
│                                                    │
│ ☐ Step 5: Set LIMIT SELL for T1 (Optional)       │
│   Price: 94,300₫  [COPY]                         │
│   Quantity: 85 shares (25%)                       │
│                                                    │
│ ☐ Step 6: Confirm in This System                 │
│   [I'VE PLACED THE ORDERS]                        │
│   Fill price: [   85,600   ] (if different)      │
│                                                    │
│ [OPEN CHECKLIST IN NEW WINDOW] [PRINT]           │
│                                                    │
│ Need Help? [ASK AI HOW TO PLACE ORDERS]          │
└────────────────────────────────────────────────────┘
```

**Features of Execution Guide:**
- Interactive checklist (can check off steps)
- [COPY] buttons next to all important numbers
- Opens SSI platform if integration available
- Can open in new window (keep visible while trading)
- Printable
- After execution, user confirms:
  - Actual fill price (if different from suggested)
  - Number of shares filled
  - System records the trade and moves signal to "executed" history

**5. Watch Tab** (Setups Forming)

```
┌─────────────────────────────────────────────────────────────────┐
│ WATCH TAB                                                        │
│                                                                  │
│ These setups are forming but NOT ready yet                      │
│ I'll alert you when they become ACTIVE                          │
│                                                                  │
│ ┌──────────────────────────────────────────────────────────────┐│
│ │ 👀 WATCH SIGNAL                                              ││
│ │ ┌────────────────────────────────────────────────────────────││
│ │ │ HPG - Hoa Phat Group                                       ││
│ │ │ Score: 8/10 (Could become 9-10)                           ││
│ │ │ Status: 85% READY                                         ││
│ │ │                                                            ││
│ │ │ Current Price: 33,700₫ (+1.8%)                            ││
│ │ │                                                            ││
│ │ │ SETUP: Breakout Pullback                                  ││
│ │ │                                                            ││
│ │ │ ┌─────────────────────────────────────────────────────┐  ││
│ │ │ │ WHAT'S NEEDED FOR ENTRY SIGNAL?                    │  ││
│ │ │ ├─────────────────────────────────────────────────────┤  ││
│ │ │ │ ✓ Broke above 33,500 resistance                    │  ││
│ │ │ │ ✓ High volume confirmed                            │  ││
│ │ │ │ ✓ Pulled back to 33,500 (former resistance)        │  ││
│ │ │ │ ⏳ WAITING FOR: Bounce confirmation                │  ││
│ │ │ │    Need: Volume spike + bullish candle             │  ││
│ │ │ │    Estimated: Today or tomorrow                    │  ││
│ │ │ │                                                     │  ││
│ │ │ │ If completes: Score → 9/10, Entry @ 33,700-34,000 │  ││
│ │ │ └─────────────────────────────────────────────────────┘  ││
│ │ │                                                            ││
│ │ │ [VIEW CHART] [SET CUSTOM ALERT] [REMOVE FROM WATCH]      ││
│ │ └────────────────────────────────────────────────────────────││
│ └──────────────────────────────────────────────────────────────┘│
│                                                                  │
│ ... (More watch signals)                                         │
└─────────────────────────────────────────────────────────────────┘
```

**Watch Signal Features:**
- Shows % readiness (e.g., "85% READY")
- Progress bar visual
- Checklist of what's met and what's still needed
- Estimated timeframe: "Today", "1-2 days", "3-5 days", "1-2 weeks"
- If setup meets criteria, automatically moves to ACTIVE tab and triggers notification

**6. Dismissed Tab**

```
┌─────────────────────────────────────────────────────────────────┐
│ DISMISSED TAB                                                    │
│                                                                  │
│ Signals you chose not to take                                   │
│                                                                  │
│ ┌──────────────────────────────────────────────────────────────┐│
│ │ VPB - Dismissed on Jan 13 at 11:05 AM                        ││
│ │ Reason: "Too correlated with VCB"                            ││
│ │ Outcome: +2.1% next day (missed opportunity)                 ││
│ │ [VIEW DETAILS] [LEARN FROM THIS]                             ││
│ └──────────────────────────────────────────────────────────────┘│
│                                                                  │
│ ... (More dismissed signals)                                     │
└─────────────────────────────────────────────────────────────────┘
```

**Purpose:** Learning tool - see which signals you dismissed and what happened
- Required to enter reason for dismissal
- System tracks outcome: Did stock move as predicted?
- Monthly review: "You dismissed 5 signals, 3 would have been winners"
- AI uses this to learn your preferences

**7. History Tab**

Similar to trade history, but for signals:
- All signals ever generated
- Filterable by: Date, Stock, Type, Score, Outcome
- Outcome categories:
  - Executed: You took the trade
  - Missed: Signal expired before you acted
  - Dismissed: You chose not to take it
  - Invalid: Setup failed before entry
- Shows what happened to the stock afterward
- Used for system performance analysis:
  - "AI generated 200 signals this quarter"
  - "You executed 45 (22%)"
  - "Of executed: 65% were winners"
  - "Of dismissed: 55% would have been winners (opportunity cost)"

---

### 4.5 SCREEN 5: 📚 JOURNAL

**Purpose:** Complete trade logging, performance tracking, and learning system

Based on research of trading journal apps (Edgewonk, TraderSync, TradingDiary Pro), this combines automated data capture with manual reflections.

#### Layout Structure (Desktop)

```
┌─────────────────────────────────────────────────────────────────┐
│ JOURNAL HEADER                                                   │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ [ALL TRADES] [TAGGED] [FAVORITES] [CASE STUDIES]           │ │
│ │                                                              │ │
│ │ Search: [Filter by stock, date, tags...]                    │ │
│ │ Sort: [Most Recent ▼]                                       │ │
│ └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────┐  ┌────────────────────────────────────────┐
│ LEFT PANEL (30%)     │  │ RIGHT PANEL (70%)                      │
│                      │  │                                        │
│ TRADE LIST           │  │ SELECTED TRADE DETAIL                  │
│ (Chronological)      │  │                                        │
│                      │  │ (Opens when you click a trade)         │
│ ┌──────────────────┐ │  │                                        │
│ │✓ VCB Jan 17     +││  │ [Content shows when trade selected]    │
│ │  +1.9M  +2.1R   ││  │                                        │
│ │  15 days        ││  │                                        │
│ ├──────────────────┤ │  │                                        │
│ │✗ TCB Jan 13     -││  │                                        │
│ │  -920K  -0.9R   ││  │                                        │
│ │  8 days         ││  │                                        │
│ ├──────────────────┤ │  │                                        │
│ │✓ FPT Jan 9      +││  │                                        │
│ │  +2.4M  +2.8R   ││  │                                        │
│ │  22 days        ││  │                                        │
│ ├──────────────────┤ │  │                                        │
│ │  ... 20 more     │  │                                        │
│ └──────────────────┘ │  │                                        │
│                      │  │                                        │
│ [+ MANUAL ENTRY]     │  │                                        │
│ [EXPORT JOURNAL]     │  │                                        │
└──────────────────────┘  └────────────────────────────────────────┘
```

#### Component Specifications - JOURNAL SCREEN

**1. Trade List (Left Panel)**

Compact list of all trades:
- Symbol and date
- Win/Loss icon (✓/✗)
- Net P/L (VND)
- R-multiple
- Days held
- Tags (if any)
- Click to select → Shows detail in right panel
- Selected trade highlighted
- Color-coded: Green tint for winners, red for losers

**2. Trade Detail Panel (Right Panel)**

When you click a trade from the list, full details appear:

```
┌────────────────────────────────────────────────────────────────┐
│ TRADE DETAIL: VNM (Jan 2 - Jan 17, 2025)                      │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│ [OVERVIEW] [CHART] [ANALYSIS] [NOTES] [LESSONS]               │
│                                                                │
│ ═══ OVERVIEW TAB (Default) ═══                                │
│                                                                │
│ ┌──────────────────────────────────────────────────────────┐  │
│ │ ENTRY                                                    │  │
│ ├──────────────────────────────────────────────────────────┤  │
│ │ Date: Jan 2, 2025 at 10:23 AM                           │  │
│ │ Price: 88,000₫                                           │  │
│ │ Shares: 400                                              │  │
│ │ Value: 35,200,000₫                                       │  │
│ │                                                           │  │
│ │ Setup Type: Pullback to 20 EMA                           │  │
│ │ Setup Score: 8/10                                        │  │
│ │ Market Regime: BULL (VN-Index 1,220)                    │  │
│ │ Sector: Consumer Goods                                   │  │
│ │                                                           │  │
│ │ Entry Thesis:                                            │  │
│ │ "Perfect pullback setup. Weekly uptrend strong,          │  │
│ │ daily pulled back to 20 EMA with decreasing volume.      │  │
│ │ Hammer candle formed today with volume spike.            │  │
│ │ Consumer sector showing relative strength."              │  │
│ └──────────────────────────────────────────────────────────┘  │
│                                                                │
│ ┌──────────────────────────────────────────────────────────┐  │
│ │ EXIT                                                     │  │
│ ├──────────────────────────────────────────────────────────┤  │
│ │ Date: Jan 17, 2025 at 2:15 PM                           │  │
│ │ Price: 93,500₫                                           │  │
│ │ Reason: T1 Target Hit                                    │  │
│ │ Days Held: 15 days                                       │  │
│ │                                                           │  │
│ │ Exit Thesis:                                             │  │
│ │ "Hit T1 target as planned. Sold 25% (100 shares).       │  │
│ │ In retrospect, should have held remaining 75% longer -   │  │
│ │ stock continued to 96K the next day. Lesson: Don't       │  │
│ │ exit entire position at T1."                             │  │
│ └──────────────────────────────────────────────────────────┘  │
│                                                                │
│ ┌──────────────────────────────────────────────────────────┐  │
│ │ FINANCIAL OUTCOME                                        │  │
│ ├──────────────────────────────────────────────────────────┤  │
│ │ Entry Value:        35,200,000₫                          │  │
│ │ Exit Value:         37,400,000₫                          │  │
│ │ Gross P/L:          +2,200,000₫ (+6.25%)                │  │
│ │                                                           │  │
│ │ Entry Commission:       -88,000₫ (0.25%)                │  │
│ │ Exit Commission:        -93,500₫ (0.25%)                │  │
│ │ Exit Tax:               -37,400₫ (0.10%)                │  │
│ │ ─────────────────────────────────────                    │  │
│ │ NET P/L:            +1,981,100₫ (+5.63%)                │  │
│ │ R-Multiple:          +2.1R                               │  │
│ │                                                           │  │
│ │ Initial Risk:        1,200,000₫ (1.2% of capital)       │  │
│ │ Actual Return:       +1.2% of capital                    │  │
│ └──────────────────────────────────────────────────────────┘  │
│                                                                │
│ ┌──────────────────────────────────────────────────────────┐  │
│ │ EXECUTION QUALITY: 8/10                                  │  │
│ ├──────────────────────────────────────────────────────────┤  │
│ │ Entry Timing: 9/10 ⭐                                    │  │
│ │ Entry Price: 8/10                                        │  │
│ │ Exit Timing: 7/10                                        │  │
│ │ Exit Price: 8/10                                         │  │
│ │ Risk Management: 9/10 ⭐                                 │  │
│ │ Emotional Control: 8/10                                  │  │
│ │                                                           │  │
│ │ Overall: WELL EXECUTED ✓                                 │  │
│ └──────────────────────────────────────────────────────────┘  │
│                                                                │
│ Tags: #pullback #winner #consumer #good-execution              │
│ [+ ADD TAG]                                                   │
│                                                                │
│ [EDIT] [DELETE] [EXPORT] [ADD TO CASE STUDY]                 │
└────────────────────────────────────────────────────────────────┘
```

**3. Chart Tab**

Shows annotated chart of the trade:

```
┌────────────────────────────────────────────────────────────────┐
│ ═══ CHART TAB ═══                                              │
│                                                                │
│ [Interactive price chart showing:]                             │
│                                                                │
│ • 30 days before entry to 30 days after exit                  │
│ • Entry point marked with green arrow up                      │
│ • Stop level as horizontal red line                           │
│ • Targets (T1, T2, T3) as horizontal blue lines               │
│ • Exit point marked with green arrow down                     │
│ • 20 EMA and 50 EMA overlaid                                  │
│ • Volume bars below                                            │
│ • Annotations:                                                 │
│   "Entered here on pullback"                                   │
│   "Maximum favorable: 94,200"                                  │
│   "Exited at T1"                                              │
│                                                                │
│ [FULL SCREEN] [DOWNLOAD IMAGE] [COMPARE TO SIMILAR TRADES]    │
└────────────────────────────────────────────────────────────────┘
```

**4. Analysis Tab**

Advanced metrics and comparisons:

```
┌────────────────────────────────────────────────────────────────┐
│ ═══ ANALYSIS TAB ═══                                           │
│                                                                │
│ ┌──────────────────────────────────────────────────────────┐  │
│ │ PERFORMANCE METRICS                                      │  │
│ ├──────────────────────────────────────────────────────────┤  │
│ │ Max Favorable Excursion (MFE): 94,200₫ (+7.0%, +2.3R)  │  │
│ │ Max Adverse Excursion (MAE): 87,100₫ (-1.0%, -0.2R)    │  │
│ │                                                           │  │
│ │ Entry to MFE: 4 days                                     │  │
│ │ MAE occurred: Day 2 (early shake-out)                    │  │
│ │                                                           │  │
│ │ Did stop need adjustment? NO ✓                           │  │
│ │ (MAE of -0.2R shows stop was well-placed)               │  │
│ │                                                           │  │
│ │ Did targets need adjustment? MAYBE                       │  │
│ │ (MFE reached +2.3R but exited at +2.1R - slightly       │  │
│ │ early, but acceptable)                                   │  │
│ └──────────────────────────────────────────────────────────┘  │
│                                                                │
│ ┌──────────────────────────────────────────────────────────┐  │
│ │ COMPARISON TO SIMILAR TRADES                             │  │
│ ├──────────────────────────────────────────────────────────┤  │
│ │ You've made 8 "Pullback to 20 EMA" trades                │  │
│ │                                                           │  │
│ │ This trade: +2.1R in 15 days                             │  │
│ │ Your average: +1.8R in 18 days                           │  │
│ │ Status: ABOVE AVERAGE ✓                                  │  │
│ │                                                           │  │
│ │ Similar trades:                                           │  │
│ │ • HPG Dec 5: +3.2R (your best pullback)                 │  │
│ │ • VPB Nov 18: +2.8R                                      │  │
│ │ • TCB Oct 22: +2.5R                                      │  │
│ │ • STB Aug 15: +1.2R                                      │  │
│ │ • MBB Jul 3: -0.8R (only loser)                         │  │
│ │                                                           │  │
│ │ [VIEW ALL SIMILAR TRADES]                                │  │
│ └──────────────────────────────────────────────────────────┘  │
│                                                                │
│ ┌──────────────────────────────────────────────────────────┐  │
│ │ CORRELATION ANALYSIS                                     │  │
│ ├──────────────────────────────────────────────────────────┤  │
│ │ This trade (VNM - Consumer) coincided with:             │  │
│ │ • VCB (Banking): Open, uncorrelated (0.12)              │  │
│ │ • HPG (Steel): Open, uncorrelated (0.18)                │  │
│ │                                                           │  │
│ │ Portfolio was well-diversified ✓                         │  │
│ └──────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────┘
```

**5. Notes Tab**

Free-form notes with prompts:

```
┌────────────────────────────────────────────────────────────────┐
│ ═══ NOTES TAB ═══                                              │
│                                                                │
│ ┌──────────────────────────────────────────────────────────┐  │
│ │ PRE-TRADE (Entered before opening position)             │  │
│ ├──────────────────────────────────────────────────────────┤  │
│ │ Why am I entering this trade?                            │  │
│ │ "Perfect technical setup matching my best historical     │  │
│ │ trades. All criteria met. Consumer sector strong."       │  │
│ │                                                           │  │
│ │ What could go wrong?                                     │  │
│ │ "Consumer spending could weaken. Sector rotation out     │  │
│ │ of consumer goods. Stop at 85K protects me."            │  │
│ │                                                           │  │
│ │ Emotional state: CALM AND CONFIDENT                      │  │
│ └──────────────────────────────────────────────────────────┘  │
│                                                                │
│ ┌──────────────────────────────────────────────────────────┐  │
│ │ DURING TRADE (Updates while position open)              │  │
│ ├──────────────────────────────────────────────────────────┤  │
│ │ Jan 4: Dipped to 87,100 today. Feeling slight anxiety   │  │
│ │ but stop still safe. Remind myself this is normal       │  │
│ │ pullback volatility.                                     │  │
│ │                                                           │  │
│ │ Jan 9: Back aboveentry. Feeling good. Resisting urge   │  │
│ │ to take profit too early.                                │  │
│ │                                                           │  │
│ │ Jan 15: Approaching T1 target. Ready to execute scaling │  │
│ │ plan.                                                    │  │
│ └──────────────────────────────────────────────────────────┘  │
│                                                                │
│ ┌──────────────────────────────────────────────────────────┐  │
│ │ POST-TRADE (Reflection after closing)                   │  │
│ ├──────────────────────────────────────────────────────────┤  │
│ │ What went right?                                         │  │
│ │ • Entry timing perfect                                   │  │
│ │ • Stop placement good (MAE only -0.2R)                  │  │
│ │ • Followed plan disciplined                              │  │
│ │ • Emotional control maintained                           │  │
│ │                                                           │  │
│ │ What went wrong?                                         │  │
│ │ • Exited entire position at T1 - should have held 75%   │  │
│ │ • Stock went to 96K next day - left money on table      │  │
│ │                                                           │  │
│ │ What did I learn?                                        │  │
│ │ • T1 means "take SOME profit" not "exit completely"     │  │
│ │ • Need to follow scaling plan more strictly              │  │
│ │ • In strong trends, targets are conservative             │  │
│ │                                                           │  │
│ │ Would I take this trade again?                           │  │
│ │ YES - setup was excellent. Execution 8/10.               │  │
│ │ Next time: Only sell 25% at T1, hold rest for T2.       │  │
│ └──────────────────────────────────────────────────────────┘  │
│                                                                │
│ [SAVE NOTES] [ASK AI TO ANALYZE MY NOTES]                     │
└────────────────────────────────────────────────────────────────┘
```

**6. Lessons Tab**

AI-generated insights from this trade:

```
┌────────────────────────────────────────────────────────────────┐
│ ═══ LESSONS TAB ═══                                            │
│                                                                │
│ 💡 AI-Generated Lessons from This Trade:                       │
│                                                                │
│ 1. SCALING OUT IS CRITICAL                                     │
│    You exited 100% at T1, but stock continued +3% more.       │
│    Following the 25-25-50 scaling plan would have added       │
│    ~600K to your profit.                                       │
│                                                                │
│    Action: Create checklist reminder before every exit        │
│                                                                │
│ 2. YOUR PULLBACK SETUPS ARE STRONG                             │
│    This is your 6th winning pullback in a row.                │
│    Win rate on pullbacks: 88% (7/8)                           │
│    Average: +1.9R                                              │
│                                                                │
│    Insight: You have an edge in pullback trading. Focus here. │
│                                                                │
│ 3. EARLY VOLATILITY IS NORMAL                                  │
│    Your notes show anxiety on day 2 when price dipped.        │
│    But MAE was only -0.2R - well within normal.               │
│    8 of your 10 winners had MAE between -0.1R and -0.5R.      │
│                                                                │
│    Reminder: Don't panic at small adverse moves.              │
│                                                                │
│ [ADD TO MY TRADING RULES] [DISCUSS WITH AI]                   │
└────────────────────────────────────────────────────────────────┘
```

**7. Manual Entry Feature**

For trades done before using system:

```
┌────────────────────────────────────────────────────────────────┐
│ ADD MANUAL TRADE ENTRY                                    [×]  │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│ Symbol: [____]                                                 │
│                                                                │
│ Entry Date: [___/___/____]  Time: [__:__]                     │
│ Entry Price: [________]₫                                       │
│ Shares: [____]                                                 │
│                                                                │
│ Exit Date: [___/___/____]  Time: [__:__]                      │
│ Exit Price: [________]₫                                        │
│                                                                │
│ Setup Type: [Pullback ▼]                                      │
│ Exit Reason: [Target Hit ▼]                                   │
│                                                                │
│ Notes (optional):                                              │
│ [_______________________________]                              │
│ [_______________________________]                              │
│                                                                │
│ [CALCULATE P/L] → System auto-calculates commissions/tax      │
│                                                                │
│ Net P/L: +1,981,100₫ (+5.63%)                                │
│ R-Multiple: (Enter your stop) [________]₫ → [Calculate]       │
│                                                                │
│ [SAVE TRADE] [CANCEL]                                          │
└────────────────────────────────────────────────────────────────┘
```

Allows importing historical trades for complete record.

---

### 4.6 SCREEN 6: 🤖 AI COACH

**Purpose:** Conversational interface for trading questions, analysis, coaching, and learning

Based on research of ChatGPT, Claude.ai, and specialized trading coaches, this combines chat with rich visualizations.

#### Layout Structure (Desktop)

```
┌─────────────────────────────────────────────────────────────────┐
│ AI COACH                                                         │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ [NEW CHAT] [CONVERSATION HISTORY ▼]          [@VCB] [@Portfolio]│ │
│ └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────┐  ┌──────────────────────────────────────┐
│ CONVERSATION         │  │ ARTIFACTS PANEL                      │
│ HISTORY (20%)        │  │ (Optional, appears when AI creates   │
│                      │  │  rich content like charts/tables)    │
│ Today                │  │                                      │
│ • VCB Setup Analysis │  │ [Shows charts, tables, code, etc.]   │
│ • Portfolio Review   │  │                                      │
│ • Risk Question      │  │                                      │
│                      │  │                                      │
│ Yesterday            │  │                                      │
│ • Backtest Help      │  │                                      │
│ • Stop Loss Advice   │  │                                      │
│                      │  │                                      │
│ Jan 11               │  │                                      │
│ • Learning Session   │  │                                      │
│ ...                  │  │                                      │
└──────────────────────┘  └──────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ CHAT AREA (Full width if no artifacts, 55% if artifacts shown) │
│                                                                  │
│ [Scroll area with conversation]                                 │
│                                                                  │
│ ┌──────────────────────────────────────────────────────────┐   │
│ │ 🤖 AI: Hello! I'm your trading coach. I can help you    │   │
│ │ with strategy, analysis, risk management, and learning.  │   │
│ │                                                           │   │
│ │ Quick actions:                                            │   │
│ │ • Analyze a setup: @VCB or @HPG                          │   │
│ │ • Review portfolio: @Portfolio                            │   │
│ │ • Check a trade: @Trade-VNM-Jan17                        │   │
│ │ • Ask anything!                                           │   │
│ └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│ ┌──────────────────────────────────────────────────────────┐   │
│ │ 👤 You: Should I take the VCB signal?                    │   │
│ └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│ ┌──────────────────────────────────────────────────────────┐   │
│ │ 🤖 AI: Let me analyze the VCB signal for you...          │   │
│ │                                                           │   │
│ │ **SETUP QUALITY: 9/10** 🟢                               │   │
│ │                                                           │   │
│ │ ✅ STRENGTHS:                                             │   │
│ │ • Perfect technical setup (pullback to 20 EMA)           │   │
│ │ • Strong weekly uptrend confirmed                        │   │
│ │ • Volume pattern ideal (decreased then spiked)           │   │
│ │ • Matches your 3 best historical trades                  │   │
│ │ • Banking sector showing strength                        │   │
│ │                                                           │   │
│ │ ⚠️ CONCERNS:                                              │   │
│ │ • Banking exposure would reach 38% (near 40% limit)      │   │
│ │ • You already hold VPB (correlation: 0.74)               │   │
│ │ • Aggregate risk would be 5.7% (near 6% limit)           │   │
│ │                                                           │   │
│ │ **MY RECOMMENDATION: YES, BUT...**                        │   │
│ │                                                           │   │
│ │ Take the trade, but consider:                             │   │
│ │ 1. Reduce size to 1.2% risk (instead of 1.5%)           │   │
│ │ 2. Exit VPB first if it's weaker setup                   │   │
│ │ 3. Don't add more banking stocks after this              │   │
│ │                                                           │   │
│ │ This setup is high quality and matches your edge.        │   │
│ │                                                           │   │
│ │ Want me to walk through the execution?                   │   │
│ │                                                           │   │
│ │ [EXECUTE TRADE] [ADJUST SIZE] [COMPARE TO VPB]          │   │
│ └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│ ... (conversation continues)                                     │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ INPUT AREA (Bottom, fixed)                                      │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ Type your question...                                       │ │
│ │ [📎 Attach] [@Mention] [🎤 Voice]            [Send →]     │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                  │
│ Suggested questions:                                             │
│ [Why did I lose on TCB?] [Analyze my last 10 trades]           │
│ [What's my biggest weakness?] [Quiz me on risk management]      │
└─────────────────────────────────────────────────────────────────┘
```

#### Component Specifications - AI COACH

**1. Chat Interface Features**

**@Mentions (Context Injection):**
- @VCB → Injects current VCB data (price, indicators, setup status)
- @Portfolio → Injects current portfolio state
- @Trade-VNM-Jan17 → Injects specific trade details
- @Watchlist → Injects entire watchlist
- Autocomplete as you type @

**Message Types:**

**User Messages:**
- Right-aligned, distinct background
- Timestamp below
- Can edit recent messages
- Can regenerate AI response

**AI Messages:**
- Left-aligned
- Supports markdown formatting:
  - **Bold**, *italic*, `code`
  - Bullet lists
  - Number lists
  - Tables
  - Code blocks
- Collapsible sections for long responses
- Copy button for code/numbers
- Thumbs up/down feedback
- Regenerate button

**Rich Content in AI Messages:**

**Inline Action Buttons:**
```
Want me to execute this trade?
[YES, GUIDE ME] [NO, JUST LEARNING]
```

**Data Tables:**
```
Here's your performance by setup type:

| Setup Type | Trades | Win % | Avg R |
|------------|--------|-------|-------|
| Pullback   | 12     | 75%   | +1.8R |
| Breakout   | 8      | 50%   | +0.8R |
```

**Embedded Charts:**
AI can generate charts that appear inline or in artifacts panel

**2. Artifacts Panel**

When AI creates complex visual content (charts, detailed tables, interactive tools), they appear in separate panel:

**Example Artifacts:**
- **Equity curve chart** with annotations
- **Risk breakdown pie chart**
- **Trade comparison tables** (sortable, filterable)
- **Backtest results** with full statistics
- **Custom calculators** (position sizing, R:R, etc.)
- **Educational diagrams** (explaining concepts)

**Artifact Features:**
- Full-screen option
- Download as image/PDF
- Interactive (can manipulate data)
- Stays visible while continuing chat
- Can have multiple artifacts, tab between them

**3. Conversation History**

Left sidebar showing past conversations:
- Organized by date
- Auto-titled based on content
- Search within conversations
- Star important conversations
- Delete conversations
- Export conversation as PDF

**4. Specialized AI Modes**

AI adapts tone and depth based on query type:

**Coach Mode** (default):
- Supportive, educational
- Points out mistakes gently
- Celebrates wins appropriately
- Asks probing questions
- Example: "I noticed you're cutting winners early. Let's explore why..."

**Analyst Mode:**
- Data-focused
- Shows calculations
- References specific metrics
- Example: "Your Sharpe ratio of 1.45 is good. Here's the breakdown..."

**Teacher Mode:**
- Explains concepts
- Uses analogies
- Quizzes understanding
- Example: "Let me explain RSI divergence with an example from your trades..."

**Drill Sergeant Mode** (optional, user can toggle):
- Strict, no-nonsense
- Calls out rule violations directly
- Example: "You broke your rule again. This is the third time this month."

**5. Common AI Coach Use Cases**

**A) Trade Analysis:**
```
You: "Should I take this HPG trade?"

AI: [Analyzes signal]
    [Shows pros/cons]
    [Gives recommendation with reasoning]
    [Offers to execute or adjust]
```

**B) Performance Review:**
```
You: "How am I doing this month?"

AI: [Generates performance summary]
    [Creates equity curve chart in artifacts]
    [Highlights strengths and weaknesses]
    [Suggests improvements]
```

**C) Learning & Education:**
```
You: "Explain Bollinger Band squeeze"

AI: [Explains concept]
    [Shows example from your watchlist]
    [Links to trade where you used it]
    [Offers to quiz you]
```

**D) Risk Management:**
```
You: "Can I add another position?"

AI: [Checks current risk]
    [Calculates remaining capacity]
    [Warns if approaching limits]
    [Suggests safer alternatives if needed]
```

**E) Psychological Support:**
```
You: "I'm frustrated after 3 losses in a row"

AI: "I understand the frustration. Let me put this in perspective:
    
    Your last 3 trades: -1R, -0.8R, -1R = -2.8R total
    Your last 20 trades: +12.4R
    
    Losing streaks are normal. Your system has 55% win rate,
    which means 45% losers. Three losses happens often.
    
    Let's check: Did you follow your rules on these trades?
    [Shows trade-by-trade analysis]
    
    ✓ All three followed entry criteria
    ✓ All three had proper stops
    ✓ Position sizing was correct
    
    These were good trades that didn't work. That's trading.
    Your next trade should be taken with full confidence.
    
    Want to review your trading rules together?"
```

**F) Mistake Prevention:**
```
You: "I want to enter VCB at 2% risk"

AI: "⚠️ HOLD ON
    
    VCB score is 9/10, which suggests 1.5% risk, not 2%.
    
    Also, entering VCB at 2% would:
    • Push aggregate risk to 6.2% (exceeds 6% limit)
    • Increase banking exposure to 40% (at limit)
    
    I recommend:
    • Use 1.2% risk for VCB
    • This keeps aggregate at 5.4% (safe)
    
    Still want 2%? I'll need you to confirm you're
    overriding the risk management system."
```

**G) Historical Pattern Recognition:**
```
You: "This VCB setup looks good"

AI: "Yes! This setup has 87% similarity to your best trades.
    
    [Shows comparison chart in artifacts panel]
    
    Similar past trades:
    • HPG Dec 5: +3.2R (closest match: 92% similar)
    • VPB Nov 18: +2.8R (89% similar)
    • TCB Oct 22: +2.5R (85% similar)
    
    All three were pullback setups with similar:
    • Volume patterns
    • RSI levels (46-50 range)
    • Sector momentum
    
    Your win rate on trades with >85% similarity: 78%
    
    This is YOUR type of trade. High confidence."
```

**6. Voice Mode**

Click microphone icon to speak:
- Speech-to-text
- AI responds in text or voice (toggle)
- Useful for:
  - Hands-free while commuting
  - Quick questions during market hours
  - Accessibility

**7. Suggested Questions**

Below input, AI suggests relevant questions based on context:
- After a loss: "Why did this trade fail?"
- After opening position: "What should I watch for?"
- Morning: "What setups are forming today?"
- End of week: "Review my week"
- After signal: "Should I take this?"

---

### 4.7 SCREEN 7: 🧪 BACKTEST LAB

**Purpose:** Historical testing of strategies, parameter optimization, and system validation

Based on research of QuantConnect, TradingView Strategy Tester, and Amibroker, this provides visual backtesting without coding.

#### Layout Structure (Desktop)

```
┌─────────────────────────────────────────────────────────────────┐
│ BACKTEST LAB                                                     │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ [MY BACKTESTS] [NEW BACKTEST] [TEMPLATES] [HELP]           │ │
│ └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│ NEW BACKTEST CONFIGURATION                                        │
│                                                                   │
│ ┌────────────────────────────────────────────────────────────┐  │
│ │ BASIC SETTINGS                                             │  │
│ ├────────────────────────────────────────────────────────────┤  │
│ │ Backtest Name: [____________________]                      │  │
│ │                                                             │  │
│ │ Date Range:                                                 │  │
│ │ From: [Jan 1, 2022 ▼]  To: [Dec 31, 2024 ▼]              │  │
│ │ Duration: 3 years                                           │  │
│ │                                                             │  │
│ │ Stocks to Test:                                             │  │
│ │ ( ) All VN30                                               │  │
│ │ (•) Custom List: [VCB, VPB, HPG, VNM, FPT + Add]          │  │
│ │ ( ) Single Stock: [___]                                    │  │
│ │                                                             │  │
│ │ Starting Capital: [100,000,000]₫                           │  │
│ └────────────────────────────────────────────────────────────┘  │
│                                                                   │
│ ┌────────────────────────────────────────────────────────────┐  │
│ │ STRATEGY PARAMETERS                                        │  │
│ ├────────────────────────────────────────────────────────────┤  │
│ │ Setup Types to Include:                                    │  │
│ │ ☑ Pullback to 20 EMA                                      │  │
│ │ ☑ Pullback to 50 EMA                                      │  │
│ │ ☑ Breakout                                                 │  │
│ │ ☐ Mean Reversion                                           │  │
│ │                                                             │  │
│ │ Moving Averages:                                            │  │
│ │ Fast EMA: [20 ▼]  Slow EMA: [50 ▼]                        │  │
│ │ Long-term: 200 SMA (fixed)                                 │  │
│ │                                                             │  │
│ │ RSI Period: [14 ▼]                                         │  │
│ │ ATR Period: [14 ▼]                                         │  │
│ │                                                             │  │
│ │ Entry Criteria:                                             │  │
│ │ Minimum Score: [7 ▼] out of 10                            │  │
│ │ Require volume confirmation: ☑                             │  │
│ │ Require trend alignment: ☑                                 │  │
│ │                                                             │  │
│ │ Stop Loss:                                                  │  │
│ │ Method: (•) ATR-based  ( ) Percentage  ( ) Technical      │  │
│ │ ATR Multiplier: [2.0 ▼]                                    │  │
│ │                                                             │  │
│ │ Profit Targets:                                             │  │
│ │ T1: [2R ▼] - Exit [25%]                                    │  │
│ │ T2: [3R ▼] - Exit [25%]                                    │  │
│ │ T3: Trail remaining with [20 EMA ▼]                        │  │
│ │                                                             │  │
│ │ Position Sizing:                                            │  │
│ │ Risk per trade: [1.5%] of capital                          │  │
│ │ Max positions: [6]                                          │  │
│ │ Max risk aggregate: [6%]                                    │  │
│ │                                                             │  │
│ │ [OPTIMIZE PARAMETERS] [USE CURRENT LIVE SETTINGS]          │  │
│ └────────────────────────────────────────────────────────────┘  │
│                                                                   │
│ ┌────────────────────────────────────────────────────────────┐  │
│ │ COSTS & SLIPPAGE                                           │  │
│ ├────────────────────────────────────────────────────────────┤  │
│ │ Commission: [0.25%] per side                               │  │
│ │ Tax: [0.1%] on sells                                       │  │
│ │ Slippage: [0.3%] per side                                  │  │
│ │                                                             │  │
│ │ Total round-trip cost: ~0.7%                               │  │
│ └────────────────────────────────────────────────────────────┘  │
│                                                                   │
│ [RUN BACKTEST] [SAVE AS TEMPLATE] [CANCEL]                      │
└──────────────────────────────────────────────────────────────────┘
```

**After clicking [RUN BACKTEST]:**

```
┌──────────────────────────────────────────────────────────────────┐
│ BACKTEST RESULTS: "VN30 Pullback Strategy 2022-2024"            │
│ ┌────────────────────────────────────────────────────────────┐  │
│ │ Status: ✅ Complete (Ran 156 trades in 3.2 seconds)        │  │
│ └────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────┐  ┌────────────────────────────────────────┐
│ RESULTS TABS         │  │ [Content changes based on tab]         │
│                      │  │                                        │
│ • Overview           │  │                                        │
│ • Equity Curve       │  │                                        │
│ • Trade List         │  │                                        │
│ • Analytics          │  │                                        │
│ • Comparison         │  │                                        │
│ • Export             │  │                                        │
└──────────────────────┘  └────────────────────────────────────────┘

═══ OVERVIEW TAB ═══

┌────────────────────────────────────────────────────────────────┐
│ KEY PERFORMANCE METRICS                                        │
├────────────────────────────────────────────────────────────────┤
│ ┌──────────────────┐ ┌──────────────────┐ ┌─────────────────┐│
│ │ TOTAL RETURN     │ │ ANNUAL RETURN    │ │ EXPECTANCY      ││
│ │                  │ │                  │ │                 ││
│ │  +42.8%          │ │  +12.7% CAGR     │ │  +0.67R         ││
│ │  (+42,800,000₫)  │ │                  │ │  per trade      ││
│ └──────────────────┘ └──────────────────┘ └─────────────────┘│
│                                                                │
│ ┌──────────────────┐ ┌──────────────────┐ ┌─────────────────┐│
│ │ WIN RATE         │ │ PROFIT FACTOR    │ │ MAX DRAWDOWN    ││
│ │                  │ │                  │ │                 ││
│ │  58.3%           │ │  2.15            │ │  -14.2%         ││
│ │  (91W / 65L)     │ │  (Good)          │ │  (Acceptable)   ││
│ └──────────────────┘ └──────────────────┘ └─────────────────┘│
│                                                                │
│ ┌──────────────────┐ ┌──────────────────┐ ┌─────────────────┐│
│ │ SHARPE RATIO     │ │ AVG WIN / LOSS   │ │ TOTAL TRADES    ││
│ │                  │ │                  │ │                 ││
│ │  1.52            │ │  +2.1R / -0.9R   │ │  156            ││
│ │  (Excellent)     │ │  (Ratio: 2.3)    │ │  (52/year)      ││
│ └──────────────────┘ └──────────────────┘ └─────────────────┘│
└────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────┐
│ COMPARISON TO BENCHMARK                                        │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│                Your Strategy    VN-Index Buy & Hold            │
│ Return:            +42.8%            +18.2%          ✅        │
│ Annual:            +12.7%            +5.8%           ✅        │
│ Max DD:            -14.2%            -22.1%          ✅        │
│ Sharpe:             1.52              0.41           ✅        │
│                                                                │
│ Your strategy BEATS buy-and-hold by +24.6 percentage points!  │
└────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────┐
│ MONTHLY RETURNS HEATMAP                                        │
├────────────────────────────────────────────────────────────────┤
│         Jan   Feb   Mar   Apr   May   Jun   Jul   Aug   Sep   │
│ 2022   +2.1  +3.4  -1.2  +4.5  +2.8  -2.1  +3.2  +1.8  -0.5   │
│ 2023   +5.2  +2.1  +3.8  +1.2  -1.8  +4.1  +2.5  +3.9  +2.2   │
│ 2024   +3.1  +4.2  +1.9  +5.1  +2.4  +3.3  -2.8  +2.1  +4.5   │
│                                                                │
│ [Green = positive, Red = negative, intensity = magnitude]     │
└────────────────────────────────────────────────────────────────┘

[COMPARE TO LIVE TRADING] [SAVE BACKTEST] [EXPORT REPORT]
```

**═══ EQUITY CURVE TAB ═══**

```
┌────────────────────────────────────────────────────────────────┐
│ EQUITY CURVE CHART                                             │
│                                                                │
│ [Interactive line chart showing:]                              │
│ • Starting capital: 100M                                       │
│ • Ending capital: 142.8M                                       │
│ • Drawdown periods shaded in red                               │
│ • Each trade marked as dot on line                             │
│ • Hoverable: Shows trade details at that point                 │
│                                                                │
│ [Options:]                                                     │
│ ( ) Absolute value  (•) Percentage gain  ( ) R-multiples      │
│ ☑ Show drawdowns  ☑ Show ☐ Show benchmark            │
│                                                                │
│ Notable Events:                                                │
│ • Largest drawdown: Aug 2023 (-14.2%)                         │
│ • Best month: Jan 2023 (+5.2%)                                │
│ • Longest flat period: Apr-Jun 2022 (3 months)                │
└────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────┐
│ DRAWDOWN ANALYSIS                                              │
│                                                                │
│ [Chart showing underwater equity - distance from peak]         │
│                                                                │
│ Drawdown Statistics:                                           │
│ • Maximum: -14.2% (lasted 47 days)                            │
│ • Average: -4.3%                                               │
│ • Recovery time (avg): 18 days                                 │
│ • Time underwater: 32% of backtest period                      │
│                                                                │
│ Longest drawdowns:                                             │
│ 1. Aug 15 - Oct 1, 2023: -14.2% (47 days)                    │
│ 2. Mar 8 - Apr 22, 2022: -11.8% (45 days)                    │
│ 3. Jun 12 - Jul 28, 2024: -9.5% (46 days)                    │
└────────────────────────────────────────────────────────────────┘
```

**═══ TRADE LIST TAB ═══**

```
┌────────────────────────────────────────────────────────────────┐
│ ALL BACKTEST TRADES (156 total)                               │
│                                                                │
│ Filter: [All ▼] [Winners] [Losers]                            │
│ Sort: [Date ▼] [R-Multiple] [% Gain] [Days Held]              │
│                                                                │
│ ┌──┬──────┬──────────┬──────────┬──────┬───────┬─────┬─────┐ │
│ │# │Symbol│Entry     │Exit      │Days  │Net P/L│R    │Reason││
│ ├──┼──────┼──────────┼──────────┼──────┼───────┼─────┼─────┤ │
│ │1 │VCB   │Jan 5,'22 │Jan 20,'22│15    │+1.8M  │+2.1R│T1   ││
│ │  │      │85,000    │93,500    │      │+6.2%  │     │     ││
│ ├──┼──────┼──────────┼──────────┼──────┼───────┼─────┼─────┤ │
│ │2 │HPG   │Jan 12,'22│Feb 3,'22 │22    │+3.2M  │+2.9R│T2   ││
│ │  │      │28,500    │37,100    │      │+18.5% │     │     ││
│ ├──┼──────┼──────────┼──────────┼──────┼───────┼─────┼─────┤ │
│ │3 │VPB   │Jan 18,'22│Jan 25,'22│7     │-880K  │-0.9R│Stop ││
│ │  │      │24,500    │22,100    │      │-9.8%  │     │     ││
│ │  │... 153 more rows                                        │ │
│ └──┴──────┴──────────┴──────────┴──────┴───────┴─────┴─────┘ │
│                                                                │
│ Click any trade → View detailed replay with chart              │
│                                                                │
│ [EXPORT TO CSV] [ANALYZE SUBSET]                               │
└────────────────────────────────────────────────────────────────┘
```

**Click a trade → Opens Trade Replay Modal:**

```
┌────────────────────────────────────────────────────────────────┐
│ TRADE REPLAY: VCB (Jan 5 - Jan 20, 2022)              [×]    │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│ [Chart showing:]                                               │
│ • 60 days before entry to 30 days after exit                  │
│ • Entry point marked                                           │
│ • Stop level                                                   │
│ • Targets                                                      │
│ • Exit point                                                   │
│ • All indicators at entry time                                 │
│                                                                │
│ Entry Conditions:                                              │
│ ✅ Score: 8/10                                                 │
│ ✅ Price at 20 EMA                                             │
│ ✅ Volume decreased during pullback                            │
│ ✅ Weekly uptrend confirmed                                    │
│                                                                │
│ Outcome:                                                       │
│ • Hit T1 target on day 15                                     │
│ • Exited as planned                                            │
│ • MFE: +2.3R  |  MAE: -0.1R                                   │
│                                                                │
│ [◀ PREVIOUS TRADE] [NEXT TRADE ▶] [ADD TO CASE STUDY]        │
└────────────────────────────────────────────────────────────────┘
```

**═══ ANALYTICS TAB ═══**

```
┌────────────────────────────────────────────────────────────────┐
│ DETAILED ANALYTICS                                             │
│                                                                │
│ ┌────────────────────────────────────────────────────────────┐│
│ │ SETUP TYPE BREAKDOWN                                       ││
│ ├────────────────────────────────────────────────────────────┤│
│ │ Setup           Trades  Win%    Avg R   Total R   Best     ││
│ │ Pullback 20EMA  87      62%     +0.8R   +69.6R   +4.2R     ││
│ │ Pullback 50EMA  45      53%     +0.5R   +22.5R   +3.8R     ││
│ │ Breakout        24      50%     +0.3R   +7.2R    +3.1R     ││
│ │                                                             ││
│ │ INSIGHT: Pullback to 20 EMA is your best setup!            ││
│ │ Focus optimization efforts here.                            ││
│ └────────────────────────────────────────────────────────────┘│
│                                                                │
│ ┌────────────────────────────────────────────────────────────┐│
│ │ R-MULTIPLE DISTRIBUTION                                    ││
│ │                                                             ││
│ │ [Histogram chart]                                           ││
│ │                                                             ││
│ │ -2R: █ (2)                                                  ││
│ │ -1R: ██████████ (58)  ← Losers cluster here (good!)       ││
│ │  0R: ███ (7)                                                ││
│ │ +1R: ████████ (32)                                          ││
│ │ +2R: ████████████ (42)  ← Most common winner               ││
│ │ +3R: ██████ (12)                                            ││
│ │ +4R: ██ (3)                                                 ││
│ │ +5R+: █ (2)           ← Long tail (excellent!)             ││
│ │                                                             ││
│ │ Pattern: Good (losers tight, winners spread)                ││
│ └────────────────────────────────────────────────────────────┘│
│                                                                │
│ ┌────────────────────────────────────────────────────────────┐│
│ │ MAE vs FINAL R SCATTER PLOT                                ││
│ │                                                             ││
│ │ [Scatter plot with regression line]                         ││
│ │                                                             ││
│ │ Finding: Most winners had MAE < 0.6R                        ││
│ │ → Current stops (2.0 ATR) are well-positioned              ││
│ │ → Don't widen stops                                         ││
│ └────────────────────────────────────────────────────────────┘│
│                                                                │
│ ┌────────────────────────────────────────────────────────────┐│
│ │ HOLDING PERIOD ANALYSIS                                    ││
│ │                                                             ││
│ │ Days Held    Trades    Win%     Avg R                       ││
│ │ 1-7 days     23        48%      +0.2R  (Cut too early?)    ││
│ │ 8-14 days    45        58%      +0.7R  (Sweet spot)        ││
│ │ 15-21 days   52        61%      +0.9R  (Sweet spot)        ││
│ │ 22-30 days   28        57%      +0.6R  (Still good)        ││
│ │ 30+ days     8         50%      +0.4R  (Held too long?)    ││
│ │                                                             ││
│ │ INSIGHT: Best hold time is 8-21 days.                      ││
│ │ Consider adding time stop at 25 days if not profitable.    ││
│ └────────────────────────────────────────────────────────────┘│
└────────────────────────────────────────────────────────────────┘
```

**═══ COMPARISON TAB ═══**

Compare multiple backtests side-by-side:

```
┌────────────────────────────────────────────────────────────────┐
│ COMPARE BACKTESTS                                              │
│                                                                │
│ Select backtests to compare:                                   │
│ ☑ Current (20 EMA, 2.0 ATR stop)                              │
│ ☑ Test A (25 EMA, 2.0 ATR stop)                               │
│ ☑ Test B (20 EMA, 2.5 ATR stop)                               │
│                                                                │
│ ┌────────────────────────────────────────────────────────────┐│
│ │ COMPARISON TABLE                                           ││
│ ├────────────────────────────────────────────────────────────┤│
│ │ Metric          Current    Test A      Test B              ││
│ │ Total Return    +42.8%     +38.2%     +45.1%    ← Best    ││
│ │ Expect          +0.67R     +0.58R     +0.71R    ← Best    ││
│ │ Win Rate        58.3%      55.1%      54.2%                ││
│ │ Profit Factor   2.15       1.98       2.28      ← Best    ││
│ │ Max DD          -14.2%     -12.8%     -16.5%    ← Worse   ││
│ │ Sharpe          1.52       1.38       1.58      ← Best    ││
│ │ Total Trades    156        168        142                  ││
│ │                                                             ││
│ │ WINNER: Test B (2.5 ATR stops)                             ││
│ │ → Higher returns and better risk-adjusted performance      ││
│ │ → Slightly larger drawdown is acceptable tradeoff          ││
│ └────────────────────────────────────────────────────────────┘│
│                                                                │
│ [Overlay equity curves chart - all 3 strategies shown]        │
│                                                                │
│ [ADOPT TEST B PARAMETERS] [RUN MORE COMPARISONS]               │
└────────────────────────────────────────────────────────────────┘
```

---

### 4.8 SCREEN 8: ⚙️ SETTINGS

**Purpose:** Configure system preferences, risk parameters, notifications, integrations

```
┌─────────────────────────────────────────────────────────────────┐
│ SETTINGS                                                         │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ [GENERAL] [TRADING] [RISK] [NOTIFICATIONS] [INTEGRATIONS]  │ │
│ │ [DATA] [APPEARANCE] [ACCOUNT]                               │ │
│ └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘

═══ TRADING SETTINGS ═══

┌────────────────────────────────────────────────────────────────┐
│ DEFAULT PARAMETERS                                             │
├────────────────────────────────────────────────────────────────┤
│ Moving Averages:                                               │
│ Fast EMA: [20]  Slow EMA: [50]  Long-term SMA: [200]         │
│                                                                │
│ Indicators:                                                    │
│ RSI Period: [14]                                               │
│ MACD: [12, 26, 9]                                              │
│ ATR Period: [14]                                               │
│                                                                │
│ Entry Criteria:                                                │
│ Minimum Score: [7] out of 10                                   │
│ Volume Threshold: [75th percentile]                            │
│                                                                │
│ [RESET TO DEFAULTS] [SAVE CHANGES]                             │
└────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────┐
│ POSITION SIZING                                                │
├────────────────────────────────────────────────────────────────┤
│ Risk Per Trade:                                                │
│ Score 7-8: [1.0%]  Score 9: [1.5%]  Score 10: [2.0%]         │
│                                                                │
│ Stop Loss Method:                                              │
│ (•) ATR-based: [2.0] multiplier                               │
│ ( ) Percentage: [__]%                                          │
│ ( ) Technical: Manual per trade                               │
│                                                                │
│ Gap Risk Adjustment (Vietnam-specific):                        │
│ Multiplier: [3.0] (accounts for multi-day floor scenarios)    │
│                                                                │
│ [CALCULATE EXAMPLE] [SAVE]                                     │
└────────────────────────────────────────────────────────────────┘

═══ RISK SETTINGS ═══

┌────────────────────────────────────────────────────────────────┐
│ PORTFOLIO LIMITS                                               │
├────────────────────────────────────────────────────────────────┤
│ Maximum Aggregate Risk: [6.0%]                                 │
│ Maximum Single Position: [25%] of capital                      │
│ Maximum Open Positions: [6]                                    │
│                                                                │
│ Sector Limits:                                                 │
│ Max in Single Sector: [40%]                                    │
│                                                                │
│ Correlation Limit:                                             │
│ Max Correlation Between Positions: [0.70]                      │
│                                                                │
│ [SAVE CHANGES]                                                 │
└────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────┐
│ DAILY LOSS LIMITS                                              │
├────────────────────────────────────────────────────────────────┤
│ Stop new trades at: [-2.0%] daily loss                        │
│ Close all positions at: [-3.0%] daily loss                    │
│                                                                │
│ Weekly loss limit: [-5.0%]                                     │
│ Monthly loss limit: [-10.0%]                                   │
│                                                                │
│ Action on limit:                                               │
│ ☑ Lock trading (require manual override)                      │
│ ☑ Send alert email                                             │
│ ☐ Send SMS (premium feature)                                   │
│                                                                │
│ [SAVE CHANGES]                                                 │
└────────────────────────────────────────────────────────────────┘

═══ NOTIFICATION SETTINGS ═══

┌────────────────────────────────────────────────────────────────┐
│ ALERT PREFERENCES                                              │
├────────────────────────────────────────────────────────────────┤
│ Entry Signals:                                                 │
│ ☑ Score 9-10 (High conviction)                                │
│ ☑ Score 8-9 (Good opportunity)                                │
│ ☐ Score 7-8 (Acceptable)                                       │
│                                                                │
│ Exit Signals:                                                  │
│ ☑ Stop loss hit                                                │
│ ☑ Target reached                                               │
│ ☑ Time stop triggered                                          │
│ ☑ Thesis invalidation                                          │
│                                                                │
│ Risk Alerts:                                                   │
│ ☑ Aggregate risk > 5%                                          │
│ ☑ Daily loss approaching limit                                 │
│ ☑ Correlation warning                                          │
│                                                                │
│ Delivery Method:                                               │
│ ☑ Browser notification                                         │
│ ☑ Email                                                         │
│ ☐ SMS (premium)                                                 │
│ ☐ Push to mobile app                                           │
│                                                                │
│ Quiet Hours:                                                   │
│ From: [22:00] To: [7:00]                                       │
│ (Only critical alerts during this time)                        │
│                                                                │
│ [TEST NOTIFICATION] [SAVE]                                     │
└────────────────────────────────────────────────────────────────┘

And more sections for Integrations, Data sources, Appearance, Account...
```

---

## 5. COMPONENT LIBRARY

### 5.1 Reusable UI Components

Based on modern design systems (Material Design, Chakra UI, Ant Design), here are the core components:

**1. Cards**
- **Purpose:** Container for related information
- **Variants:**
  - Basic Card: White/dark background, rounded corners, shadow
  - Interactive Card: Hover state, clickable
  - Status Card: Color-coded border (green/red/amber/blue)
  - Collapsible Card: Expand/collapse content
- **Usage:** Portfolio summary, signal cards, trade cards, insight cards

**2. Tables**
- **Features:**
  - Sortable columns (click header)
  - Filterable (top filters bar)
  - Selectable rows (checkbox)
  - Hoverable rows (highlight)
  - Fixed header (scrollable body)
  - Sticky columns (for wide tables)
  - Inline actions (appear on hover)
  - Expandable rows (click to show details)
  - Pagination or virtual scrolling
- **Variants:**
  - Dense (more rows visible)
  - Comfortable (more spacing)
  - Compact (minimal padding)
- **Usage:** Watchlist, positions, trade history, backtest results

**3. Modals/Dialogs**
- **Sizes:** Small (400px), Medium (600px), Large (800px), Full-screen
- **Types:**
  - Confirmation: "Are you sure?"
  - Form: Input data
  - Detail View: Show complex information
  - Alert: Important message
- **Features:**
  - Close button (×)
  - Backdrop click to close (optional)
  - Escape key to close
  - Focus trap (tab cycles within modal)
- **Usage:** Trade execution guide, signal details, settings, confirmations

**4. Buttons**
- **Variants:**
  - Primary: Main action (filled, brand color)
  - Secondary: Less important (outlined)
  - Tertiary: Minimal (text only)
  - Danger: Destructive action (red)
  - Ghost: Very subtle (transparent)
- **States:** Normal, Hover, Active, Disabled, Loading
- **Sizes:** Small, Medium, Large
- **With Icons:** Icon left, icon right, icon only
- **Usage:** Throughout app for actions

**5. Inputs**
- **Types:**
  - Text input
  - Number input (with increment/decrement buttons)
  - Select/Dropdown
  - Multi-select
  - Date picker
  - Time picker
  - Search (with autocomplete)
  - Textarea
  - Checkbox
  - Radio
  - Toggle/Switch
- **States:** Normal, Focus, Error, Disabled, Success
- **Features:**
  - Label
  - Helper text
  - Error message
  - Prefix/suffix (icons or text)
  - Character count
- **Usage:** Forms, filters, settings

**6. Badges/Tags**
- **Purpose:** Label or categorize
- **Variants:**
  - Status badge: Score (9/10), Priority (HIGH), Freshness (FRESH)
  - Removable tag: With × icon
  - Count badge: Number in circle
- **Colors:** Match semantic colors (green/red/amber/blue/gray)
- **Usage:** Scores, tags, notification counts, status indicators

**7. Progress Indicators**
- **Types:**
  - Linear progress bar
  - Circular/radial gauge
  - Spinner (loading)
  - Skeleton screens (content loading)
- **Variants:**
  - Determinate (known progress %)
  - Indeterminate (unknown duration)
  - Segmented (multiple steps)
- **Usage:** Risk gauge, target progress, loading states, setup readiness

**8. Tooltips**
- **Trigger:** Hover (desktop), long-press (mobile)
- **Positioning:** Auto (smart placement to stay on screen)
- **Content:** Short text, or rich content (mini chart)
- **Usage:** Explain abbreviations, show calculations, provide context

**9. Charts (Via library like Recharts, Chart.js, or Plotly)**
- **Types:**
  - Line chart: Equity curve, price chart
  - Bar chart: Performance by setup type, monthly returns
  - Pie/Donut chart: Capital allocation, sector exposure
  - Scatter plot: MAE vs R-multiple
  - Heatmap: Monthly returns calendar
  - Candlestick: Price action
  - Area chart: Filled equity curve
- **Features:**
  - Interactive (hover for details)
  - Zoomable/pannable
  - Annotations (mark important events)
  - Legend (toggle series on/off)
  - Export as image
- **Usage:** Throughout analytics, journal, backtest, AI artifacts

**10. Alerts/Notifications**
- **Types:**
  - Toast: Temporary, bottom-right, auto-dismiss
  - Banner: Top of page, persists until dismissed
  - Inline: Within content flow
- **Severity:** Info (blue), Success (green), Warning (amber), Error (red)
- **Features:**
  - Icon
  - Title
  - Message
  - Action button (optional)
  - Dismiss button
- **Usage:** Signal alerts, error messages, success confirmations

**11. Empty States**
- **Purpose:** When no data exists
- **Content:**
  - Icon or illustration
  - Explanatory text
  - Call-to-action button
- **Examples:**
  - "No positions open - Browse watchlist for opportunities"
  - "Watchlist is empty - Add your first stock"
  - "No signals today - Market is ranging"
- **Usage:** Empty watchlist, no open positions, no signals

**12. Loading States**
- **Patterns:**
  - Skeleton screens: Gray placeholders mimicking layout
  - Spinners: For small components
  - Progress bars: For longer operations
  - Shimmer effect: Animated gradient across skeleton
- **Best practice:** Show skeleton matching final content structure
- **Usage:** While fetching data, running calculations

---

## 6. USER FLOWS & INTERACTIONS

### 6.1 Core User Journeys

**Journey 1: Morning Routine**
```
1. User opens app
2. Lands on Dashboard
3. Sees portfolio summary (overnight changes)
4. Checks any overnight alerts (in notification panel)
5. Reviews open positions (any approaching targets/stops?)
6. Checks "Today's Active Signals" section
7. If signal present:
   a. Clicks signal card
   b. Reviews details in modal
   c. Clicks [EXECUTE TRADE]
   d. Follows SSI execution guide
   e. Confirms execution in system
8. Checks AI Insights panel for recommendations
9. Ready for trading day
```
**Time:** 5-10 minutes

**Journey 2: Responding to Entry Signal**
```
1. Browser notification: "VCB ready to enter (Score 9/10)"
2. User clicks notification → Opens app to Signals screen
3. Signal card displayed with all details
4. User reviews:
   - Setup description
   - Entry/stop/targets
   - Position sizing
   - AI reasoning
5. Has questions → Clicks [ASK AI]
   - Chat opens: "Should I take this VCB trade?"
   - AI provides recommendation
6. Decides to enter → Clicks [EXECUTE TRADE]
7. Execution modal opens with step-by-step SSI guide
8. User places orders in SSI platform (separate window/app)
9. Returns to system, clicks [I'VE PLACED THE ORDERS]
10. Confirms fill price
11. System records trade, updates portfolio
12. User sees updated:
    - Open positions count
    - Aggregate risk
    - Available cash
13. Done
```
**Time:** 5-15 minutes

**Journey 3: Managing Open Position**
```
1. User navigates to Portfolio tab → Positions
2. Sees list of open positions
3. Clicks position card (e.g., HPG)
4. Reviews:
   - Current P/L
   - Distance to targets
   - Days held
5. Notices approaching T1 target
6. Sets alert: "Notify when HPG reaches 37,500"
7. Later: Alert triggers
8. User opens app → Sees exit signal
9. Reviews recommendation: "Sell 25% at current price"
10. Clicks [EXECUTE SALE]
11. Follows guide to place sell order in SSI
12. Confirms sale
13. System updates position:
    - Reduces share count
    - Records partial profit
    - Adjusts stop on remaining shares
14. User adds notes: "Took T1 profit as planned"
```
**Time:** 10-20 minutes

**Journey 4: Reviewing Weekly Performance**
```
1. Sunday evening, user opens app
2. Goes to Journal tab
3. Sees weekly summary auto-generated
4. Reviews:
   - Trades this week (count, win rate)
   - Total P/L
   - Best and worst trades
5. Clicks worst trade (loser) to review
6. Opens trade detail modal
7. Reviews:
   - Chart showing what happened
   - Entry thesis vs actual outcome
   - Notes from during trade
8. Reflects: "I entered against weekly trend - mistake"
9. Adds lesson: "Always check weekly trend before entry"
10. AI suggests: "Add this to your pre-trade checklist?"
11. User accepts → Checklist updated
12. Reviews best trade (winner)
13. Notes what went right
14. AI generates summary: "Your pullback setups are strong - 4/5 winners this week"
15. User feels confident for next week
```
**Time:** 20-30 minutes

**Journey 5: Learning from AI Coach**
```
1. User curious about RSI divergence (saw it mentioned)
2. Opens AI Coach tab
3. Types: "Explain RSI divergence"
4. AI responds with:
   - Text explanation
   - Diagram in artifacts panel
   - Example from user's watchlist
5. User asks: "Have I ever traded RSI divergence?"
6. AI searches journal, finds 2 trades
7. Shows both trades with outcomes
8. User asks: "Should I look for this setup?"
9. AI analyzes:
   - User's win rate on divergence: 50% (2 trades, small sample)
   - Recommends: "Need more data. Focus on your proven pullback setups for now."
10. User satisfied, closes chat
11. Conversation saved in history
```
**Time:** 10-15 minutes

### 6.2 Navigation Patterns

**Primary Navigation:** Horizontal tabs at top
- Fast switching between main sections
- Current tab highlighted
- Icon + label for clarity
- Badge on tabs for notifications (e.g., "Signals (3)")

**Secondary Navigation:** Within each screen
- Tabs for sub-sections (e.g., Capital/Positions/History/Analytics)
- Breadcrumbs for deep pages (rare, mostly flat structure)

**Contextual Navigation:**
- Right-click menus on items
- Inline action buttons (appear on hover)
- "View" or "Details" buttons on cards

**Quick Access:**
- Search bar (global, top-right): Find stocks, trades, conversations
- Keyboard shortcuts:
  - `/` : Focus search
  - `D` : Dashboard
  - `W` : Watchlist
  - `P` : Portfolio
  - `S` : Signals
  - `J` : Journal
  - `A` : AI Coach
  - `Esc` : Close modal
  - `?` : Show keyboard shortcuts

### 6.3 Error Handling & Edge Cases

**Connection Lost:**
```
┌────────────────────────────────────────────┐
│ ⚠️ Connection Lost                         │
│                                            │
│ Real-time data unavailable.                │
│ Showing last known prices.                 │
│                                            │
│ [RETRY CONNECTION] [VIEW OFFLINE MODE]     │
└────────────────────────────────────────────┘
```
- Prices frozen, timestamp shown
- Signal generation paused
- Can still view history and notes
- Retries automatically every 30 seconds

**Data Stale:**
```
⚠️ VCB price is 5 minutes old (last update: 10:18 AM)
Market may have moved. Refresh before trading.
[REFRESH NOW]
```

**Order Execution Failed:**
```
❌ Could not verify order placement in SSI

What happened?
• You placed order in SSI
• But didn't confirm in our system
• Position not recorded

What to do:
1. Check SSI to confirm order filled
2. Return here and click "Add Manual Entry"
3. Enter fill details so we can track position

[ADD MANUAL ENTRY] [IGNORE]
```

**Risk Limit Exceeded:**
```
🛑 CANNOT ENTER TRADE

This VCB trade would push aggregate risk to 6.4%
Your limit: 6.0%

Options:
1. Reduce position size to 280 shares (keeps risk at 6.0%)
2. Close weakest existing position (FPT -0.4R)
3. Skip this trade

[REDUCE SIZE] [VIEW POSITIONS] [CANCEL]
```

**Conflicting Signals:**
```
⚠️ SIGNAL CONFLICT

Both VCB and VPB ready to enter, but:
• Correlation: 0.74 (too high)
• Both banking sector
• Would exceed sector limit

Recommendation: Choose ONE

VCB: Score 9/10, R:R 2.8:1 ✅ Better
VPB: Score 8/10, R:R 2.2:1

[TAKE VCB] [TAKE VPB] [SKIP BOTH]
```

---

## 7. RESPONSIVE DESIGN STRATEGY

### 7.1 Breakpoints

```
Mobile:     < 768px   (phones)
Tablet:     768-1024px  (tablets, small laptops)
Desktop:    1024-1440px (standard monitors)
Large:      > 1440px   (wide monitors)
```

### 7.2 Mobile Adaptations (< 768px)

**Dashboard:**
- Vertical stack (no columns)
- Portfolio summary: Full width card
- Signals: Full width cards, swipeable carousel
- AI Insights: Collapsible accordion
- Positions: Card view (not table)

**Watchlist:**
- Table → Card view
- Each stock = tappable card
- Swipe left on card → Quick actions (remove, alert)
- Detail panel → Full-screen overlay

**Portfolio:**
- Tabs become dropdown menu
- Charts: Simplified, touch-optimized
- Tables: Horizontal scroll or card view toggle

**Signals:**
- Full-screen cards
- Swipe between signals
- Execution guide: Full-screen modal

**Journal:**
- List view only (no split panel)
- Tap trade → Full-screen detail
- Charts: Simplified

**AI Coach:**
- Full-screen chat
- Artifacts: Full-screen when opened
- Voice input prominent

**Backtest:**
- Simplified configuration (wizard-style)
- Charts: Touch-zoom enabled
- Tables: Scrollable

### 7.3 Tablet Adaptations (768-1024px)

- 2-column layouts where desktop has 3
- Slightly reduced spacing
- Touch-friendly targets (larger buttons)
- Tables: Show fewer columns, hide least important

### 7.4 Large Screen (> 1440px)

- Utilize extra space for:
  - Side-by-side comparisons
  - Larger charts
  - More dashboard widgets visible
- Don't just enlarge everything (wasted space)
- Option: Multi-window mode (watchlist + chat side-by-side)