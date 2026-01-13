# Enhanced Dashboard Analytics - Design Document

**Change ID:** `enhance-dashboard-analytics`  
**Last Updated:** 2026-01-13

## Architecture Overview

This change enhances the existing `DashboardView` component with five major areas:
1. **Spacing System Fix (CRITICAL - Phase 0)**: Replace undefined CSS variables with proper theme tokens
2. Portfolio visualization chart
3. Summary statistics cards
4. Watchlist management panel
5. AI recommendation integration

All components follow a composable architecture, reusing shared components and integrating with existing React contexts.

## Design Decisions

### 0. Spacing System Fix: **Direct Replacement Strategy**

**Critical Problem:**
The current `DashboardView.css` uses undefined CSS variables (`--gap-1`, `--gap-2`, `--gap-3`, `--gap-4`, `--gap-6`) that don't exist in the Fintech Neon theme system. The theme only defines:
- `--gap-xs`: 8px
- `--gap-sm`: 12px
- `--gap-md`: 16px
- `--gap-lg`: 24px
- `--gap-xl`: 32px
- `--gap-2xl`: 48px

**Current Issues:**
- Cards appear cramped (16px gaps instead of 32px)
- Card padding too tight (12px instead of 24px)
- Text too close to edges
- Violates "breathing space" principle from FINTECH_NEON_THEME.md

**Solution: Context-Aware Mapping**

Don't just do 1:1 variable replacement. Apply spacing hierarchy rules:

| Current (Undefined) | Context | Correct Replacement | Desktop | Tablet | Mobile |
|---------------------|---------|---------------------|---------|---------|--------|
| `--gap-1` (4px) | N/A | `--gap-xs` (8px) | 8px | 8px | 8px |
| `--gap-2` (8px) | Icon + text | `--gap-xs` (8px) | 8px | 8px | 8px |
| `--gap-3` (12px) | Card padding | `--gap-lg` (24px) | 24px | 20px | 16px |
| `--gap-4` (16px) | Between cards | `--gap-xl` (32px) | 32px | 24px | 16px |
| `--gap-6` (24px) | Main padding | `--gap-lg` (24px) | 24px | 24px | 16px |

**Key Rules (from FINTECH_NEON_THEME.md + user requirements):**
- Space between cards: 24-32px (desktop: 32px, tablet: 24px, mobile: 16px)
- Padding inside cards: 20-24px minimum (never less than 16px)
- Line height: 1.4-1.6 for text readability
- Visual rule: If content might touch edges → it's wrong
- Cards should NEVER touch

**Implementation Priority:**
1. Fix `.dashboard__grid { gap: var(--gap-xl); }` (was `--gap-4`)
2. Fix `.dashboard__analytics { gap: var(--gap-xl); }` (was `--gap-lg`)
3. Fix `.dashboard__stats-grid { gap: var(--gap-lg); }` (already correct, verify)
4. Fix all card padding to use `--gap-lg` minimum
5. Fix component grouping to use `--gap-sm` or `--gap-md`

**Rationale for Direct Replacement:**
- ✅ Enforces design system compliance
- ✅ Eliminates tech debt
- ✅ No undefined variables
- ⚠️ Requires visual QA to ensure no regressions

**Alternative Rejected: Add Missing Variables**
- ❌ Would perpetuate inconsistency
- ❌ Violates Fintech Neon theme principles
- ❌ Creates ongoing maintenance burden

### 1. Chart Library Selection: **Recharts**

**Rationale:**
- Native React/TypeScript support
- Declarative API matches React patterns
- Customizable styling for theme compliance
- Tree-shakable (only import needed chart types)
- Active maintenance and community support
- Built-in animations and tooltips

**Alternatives Rejected:**
- Chart.js: Imperative API, harder to customize colors
- Victory: Larger bundle size, steeper learning curve
- Nivo: Over-featured for our needs

### 2. Watchlist Storage: **LocalStorage (Phase 1)**

**Rationale:**
- Immediate functionality without backend changes
- Fast read/write performance
- Survives page refreshes
- Easy migration path to backend later

**Structure:**
```typescript
interface WatchlistItem {
  symbol: string;
  addedAt: number; // Unix timestamp
  isFavorite: boolean;
}

// LocalStorage key: 'trading-watchlist'
// Format: JSON array of WatchlistItem[]
```

### 3. Component Structure

```
DashboardView (main container)
├── PortfolioChart (new)
│   └── PieChart (Recharts)
├── SummaryStatsGrid (new)
│   ├── StatCard (new, reusable)
│   ├── StatCard
│   ├── StatCard
│   └── StatCard
├── WatchlistPanel (new)
│   ├── WatchlistSearch (new)
│   ├── WatchlistItem (new, reusable)
│   └── AddWatchlistButton (new)
├── RecommendButton (new)
└── RecommendModal (new, conditionally rendered)
```

### 4. Data Flow

**Portfolio Chart:**
```
AccountContext (balance) 
    + PositionsContext (portfolioSummary: { totalEarnings, totalLosses })
    → Calculate allocation percentages
    → Pass to PortfolioChart
    → Recharts renders with theme colors
```

**Summary Stats:**
```
AccountContext → totalBalance → StatCard
PositionsContext → totalEarnings, totalLosses, netPnL → StatCard (×3)
Calculate trends from historical data (mock for Phase 1)
```

**Watchlist:**
```
LocalStorage → Load watchlist on mount
MarketDataContext → Real-time price updates via WebSocket
User interaction → Update LocalStorage + React state
```

**AI Recommendation:**
```
User clicks "Recommend" button
→ POST /api/recommendations (mocked response for Phase 1)
→ Show loading spinner
→ Parse response → Display in modal
```

## Component Specifications

### PortfolioChart Component

**Props:**
```typescript
interface PortfolioChartProps {
  balance: number;
  earnings: number;
  losses: number;
  watchlistValue?: number; // Optional
  isLoading?: boolean;
}
```

**Behavior:**
- Renders donut chart (inner radius: 60%, outer radius: 90%)
- Colors: 
  - Balance: `--accent` (#dadd56)
  - Earnings: `--success` (#4ade80)
  - Losses: `--danger` (#ef4444)
  - Watchlist: `--info` (#3b82f6)
- Hover: Show tooltip with label + value + percentage
- Animation: Smooth transition on mount (500ms ease-out)
- Legend: Below chart, clickable to toggle segments

**Theme Compliance:**
- Background: `--panel` (#1e1f23)
- Border radius: `--radius-lg` (20px)
- Shadow: `--shadow` for elevation
- Text: `--text` for labels, `--text-secondary` for percentages

### StatCard Component

**Props:**
```typescript
interface StatCardProps {
  label: string;
  value: number;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: number; // Percentage change
  variant?: 'default' | 'primary'; // Primary = larger emphasis
  isLoading?: boolean;
}
```

**Behavior:**
- Display large number (font-size: 2.5rem for primary, 2rem for default)
- Small label above (font-size: 0.875rem, `--text-secondary`)
- Trend arrow (↑/↓) with color: up = `--success`, down = `--danger`
- Hover: Soft glow (`--glow-accent` on primary, `--shadow-lg` on default)
- Format: Currency with 2 decimals, thousands separators

**Layout:**
```
┌─────────────────────────┐
│ Total Money             │ ← label
│ $123,456.78        ↑ 3% │ ← value + trend
└─────────────────────────┘
```

### WatchlistPanel Component

**Props:**
```typescript
interface WatchlistPanelProps {
  maxItems?: number; // Default: 20
}
```

**State:**
```typescript
interface WatchlistState {
  items: WatchlistItem[];
  searchQuery: string;
  isAdding: boolean;
}
```

**Behavior:**
- Header: "Watchlist" + Add button (+ icon)
- Search bar: Filter items by symbol (case-insensitive)
- List: Scrollable (max-height: 400px), each item shows:
  - Symbol (bold, `--text`)
  - Current price (from MarketDataContext)
  - % change with color (green/red)
  - Mini sparkline (20 data points, 60px × 24px)
  - Star icon (toggle favorite)
  - Remove button (× icon, hover only)
- Add flow: Click + → Input appears → Enter symbol → Validate → Add to list
- Empty state: "No items in watchlist. Click + to add."

**Sparkline Implementation:**
- Use Recharts `LineChart` with minimal config
- No axes, no grid, just line
- Stroke: `--success` (positive) or `--danger` (negative)
- Data: Last 20 price points (mock random walk for Phase 1)

### RecommendButton Component

**Props:**
```typescript
interface RecommendButtonProps {
  onRecommend: () => Promise<Recommendation>;
}
```

**Behavior:**
- Large button: "Get AI Recommendation" with sparkle icon
- Position: Below summary stats, above watchlist
- Style: `--accent` background, `--bg` text, `--glow-accent` on hover
- Loading: Replace text with spinner, disable button
- Error: Show toast notification (reuse existing toast system if available)

### RecommendModal Component

**Props:**
```typescript
interface RecommendModalProps {
  recommendation: Recommendation | null;
  isOpen: boolean;
  onClose: () => void;
}

interface Recommendation {
  symbol: string;
  action: 'buy' | 'sell' | 'hold';
  confidence: number; // 0-100
  rationale: string;
  targetPrice?: number;
  stopLoss?: number;
}
```

**Behavior:**
- Glass morphism overlay (--glass-bg with --glass-blur)
- Centered modal (max-width: 500px)
- Header: "AI Recommendation" + close button (×)
- Content:
  - Large symbol badge
  - Action pill (Buy = green, Sell = red, Hold = yellow)
  - Confidence bar (0-100%, gradient from red to green)
  - Rationale text (multi-line)
  - Optional: Target price and stop loss
- Footer: "Add to Watchlist" button + "Dismiss" button
- Click outside or ESC key → close modal

## Responsive Breakpoints

**Desktop (≥1024px):**
```
┌────────────────────────────────────────┐
│ [Chart]          [Stat][Stat][Stat][Stat] │
│                  [Recommend Button]      │
│                  [Watchlist Panel]       │
└────────────────────────────────────────┘
```

**Tablet (768px - 1023px):**
```
┌──────────────────────┐
│ [Chart]              │
│ [Stat] [Stat]        │
│ [Stat] [Stat]        │
│ [Recommend Button]   │
│ [Watchlist Panel]    │
└──────────────────────┘
```

**Mobile (< 768px):**
```
┌─────────────┐
│ [Chart]     │
│ [Stat]      │
│ [Stat]      │
│ [Stat]      │
│ [Stat]      │
│ [Recommend] │
│ [Watchlist] │
└─────────────┘
```

## Spacing Application (from FINTECH_NEON_THEME.md)

**Between major sections** (Chart → Stats → Watchlist):
- Desktop/Tablet: `--gap-2xl` (48px)
- Mobile: `--gap-xl` (32px)

**Between cards** (Stat cards):
- Grid gap: `--gap-lg` (24px)

**Inside cards** (padding):
- Chart/Watchlist: `--gap-lg` (24px)
- Stat cards: `--gap-md` (16px)

**Between components** (labels, values):
- `--gap-sm` (12px)

**Icon + text**:
- `--gap-xs` (8px)

## Animation Specifications

**Chart Entry:**
```css
@keyframes chartEntry {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
/* Duration: 500ms, ease-out */
```

**Stat Card Hover:**
```css
.stat-card:hover {
  transform: scale(1.02);
  box-shadow: var(--glow-accent);
  transition: var(--transition);
}
```

**Watchlist Item Add:**
```css
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
/* Duration: 250ms, ease-out */
```

**Recommend Button Pulse (idle):**
```css
@keyframes pulse {
  0%, 100% {
    box-shadow: var(--glow-accent);
  }
  50% {
    box-shadow: var(--glow-accent-strong);
  }
}
/* Duration: 2s, infinite */
```

## Color Mappings (Theme Compliance)

**Chart Segments:**
- Total Balance: `--accent` (#dadd56) - Primary neon color
- Total Earned: `--success` (#4ade80) - Positive indicator
- Total Lost: `--danger` (#ef4444) - Negative indicator
- Watchlist Allocation: `--info` (#3b82f6) - Neutral indicator

**Stat Cards:**
- Background: `--panel` (#1e1f23)
- Hover: `--panel-hover` (#2b2d33)
- Primary card: `--panel-elevated` (#25262b) + `--glow-accent`
- Text: `--text` (#e8e9ed)
- Labels: `--text-secondary` (#9396a3)
- Trend up: `--success` (#4ade80)
- Trend down: `--danger` (#ef4444)

**Watchlist:**
- Background: `--panel` (#1e1f23)
- Item hover: `--panel-hover` (#2b2d33)
- Borders: `--border` (rgba(255, 255, 255, 0.06))
- Star favorite: `--accent` (#dadd56)
- Remove button: `--danger` (#ef4444) on hover

**Modal:**
- Overlay: `--glass-bg` (rgba(30, 31, 35, 0.7))
- Modal: `--panel-elevated` (#25262b)
- Border: `--glass-border` (rgba(255, 255, 255, 0.08))
- Backdrop blur: `--glass-blur` (12px)

## API Contracts

### Recommendation Endpoint (Phase 1: Mocked)

**Request:**
```typescript
POST /api/recommendations
Content-Type: application/json

{
  "accountId": "string",
  "riskTolerance": "low" | "medium" | "high",
  "preferences": {
    "sectors": string[],
    "maxPositions": number
  }
}
```

**Response:**
```typescript
{
  "recommendations": [
    {
      "symbol": "VNM",
      "action": "buy",
      "confidence": 85,
      "rationale": "Strong fundamental indicators with positive momentum...",
      "targetPrice": 95000,
      "stopLoss": 88000,
      "timeframe": "short-term" | "medium-term" | "long-term"
    }
  ],
  "timestamp": "2026-01-13T10:30:00Z"
}
```

**Phase 1 Mock:**
```typescript
// Mock response after 1.5s delay
const mockRecommendation = {
  symbol: "VNM",
  action: "buy" as const,
  confidence: 78,
  rationale: "Technical indicators show bullish divergence with increasing volume. Market regime supports upward movement.",
  targetPrice: 92500,
  stopLoss: 86000
};
```

## Error Handling

**Chart Rendering:**
- If data invalid/missing → Show empty state: "No portfolio data available"
- If chart lib fails → Fallback to simple table view

**Watchlist:**
- Max items reached → Disable add button, show toast: "Watchlist limit reached (20 items)"
- Invalid symbol → Show inline error: "Invalid symbol format"
- Duplicate symbol → Prevent add, show toast: "Symbol already in watchlist"

**Recommendations:**
- API timeout (>10s) → Cancel request, show error: "Request timed out. Please try again."
- API error → Show modal with error message + retry button
- Network offline → Detect and show: "No internet connection"

## Performance Considerations

**Chart Optimization:**
- Memoize chart data calculations with `useMemo`
- Debounce watchlist search (300ms)
- Lazy load Recharts (code-split with React.lazy)

**Bundle Impact:**
- Recharts: ~80KB gzipped (acceptable for feature value)
- Chart components: ~15KB
- Total addition: ~95KB gzipped

**Render Optimization:**
- Use React.memo for StatCard, WatchlistItem
- Virtualize watchlist if >50 items (react-window)
- Throttle sparkline updates to 1/second

## Testing Strategy

**Unit Tests:**
- StatCard: Renders with all prop combinations
- WatchlistItem: Add/remove/favorite interactions
- PortfolioChart: Data transformation logic
- RecommendModal: Open/close, data display

**Integration Tests:**
- Full dashboard render with all components
- Watchlist CRUD operations with LocalStorage
- Recommendation flow from button click to modal display
- Responsive layout breakpoints

**Visual Regression:**
- Chart rendering with various data sets
- Hover states on all interactive elements
- Modal overlay and backdrop blur
- Dark theme color compliance

## Migration Strategy

**Phase 1 (This Change):**
- Add new components to existing DashboardView
- Use mocked recommendation API
- LocalStorage for watchlist
- Static sparkline data (random walk)

**Phase 2 (Future):**
- Replace mock API with real backend integration
- Add historical data for sparklines
- Backend watchlist persistence
- Advanced chart interactions (zoom, pan)

**Phase 3 (Future):**
- Multiple chart types (bar, line, area)
- Customizable dashboard layouts
- Export/print functionality
- Performance metrics (Sharpe ratio, alpha, beta)

## Rollback Plan

If critical issues arise:
1. Feature flag: Add `ENABLE_ENHANCED_DASHBOARD` env var
2. Conditional render: `{ENABLE_ENHANCED_DASHBOARD ? <EnhancedDashboard /> : <BasicDashboard />}`
3. Quick disable: Set flag to `false` and redeploy
4. Full rollback: Revert commit, no data loss (LocalStorage preserved)

## Accessibility

**ARIA Labels:**
- Chart: `aria-label="Portfolio allocation chart"`
- Stat cards: `aria-label="Total money: $123,456.78, up 3%"`
- Watchlist: `role="list"`, items have `role="listitem"`
- Recommend button: `aria-label="Get AI trading recommendation"`
- Modal: `role="dialog"`, `aria-labelledby="modal-title"`, `aria-modal="true"`

**Keyboard Navigation:**
- Tab order: Stats → Recommend → Watchlist search → Watchlist items → Add button
- Enter/Space: Activate buttons
- Escape: Close modal
- Arrow keys: Navigate chart legend (optional)

**Screen Reader:**
- Chart data read as list: "Balance: 70%, Earnings: 20%, Losses: 10%"
- Trend indicators: "up 3%" vs "down 2%"
- Sparklines: `aria-hidden="true"` (decorative), price change read instead

## Security Considerations

**LocalStorage:**
- No sensitive data stored (only symbols)
- Max size check to prevent abuse (< 1MB)

**API Calls:**
- CSRF token included in recommendation requests
- Rate limiting: Max 10 requests/minute
- Input validation: Symbol format (3-4 uppercase letters)

**XSS Prevention:**
- Sanitize rationale text from API (use DOMPurify)
- Escape user input in watchlist search
