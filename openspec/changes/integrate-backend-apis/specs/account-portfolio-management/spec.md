# Account & Portfolio Management

## ADDED Requirements

### Requirement: Display Account Information
**Priority**: P0  
**Dependencies**: Backend `/account/info` endpoint

The system SHALL display the user's account details including account number, name, and available balance.

#### Scenario: View Account Info Card
**Given** a user with account "000123456"  
**When** the Account view loads  
**Then** the system displays an Account Info Card showing:
- **Account No**: 000123456 (masked as "***3456" optionally)
- **Account Name**: Nguyen Van A
- **Balance**: 1,500,000,000 VND (formatted with thousands separators)
- **Currency**: VND clearly indicated

#### Scenario: Refresh Account Balance
**Given** the Account view is open  
**When** the user clicks "Refresh" button  
**Then** the system:
- Fetches latest account info from `GET /account/info`
- Updates balance display immediately
- Shows loading indicator during fetch
- Displays timestamp of last refresh

#### Scenario: Handle Account Fetch Error
**Given** the backend API is unavailable  
**When** account info fetch fails  
**Then** the system:
- Displays error message: "Failed to load account information. Please try again."
- Provides "Retry" button
- Does not show stale data unless explicitly marked as cached

---

### Requirement: Display Portfolio Holdings
**Priority**: P0  
**Dependencies**: Backend `/account/portfolio` endpoint, WebSocket for real-time prices

The system SHALL display all portfolio holdings with quantity, average price, current market price, and profit/loss calculations.

#### Scenario: View Portfolio Table
**Given** a user has 3 holdings: HPG, VNM, FPT  
**When** the Account view loads  
**Then** the system displays a table with columns:
- **Symbol**: Stock ticker (e.g., "HPG")
- **Quantity**: Number of shares held (e.g., 10,000)
- **Avg Price**: Average purchase price (e.g., 25,500 VND)
- **Market Price**: Current market price (e.g., 26,200 VND)
- **Unrealized P&L**: Profit/loss in VND (e.g., +700,000 VND)
- **P&L %**: Percentage gain/loss (e.g., +2.74%)

#### Scenario: Calculate Unrealized P&L
**Given** HPG holding: quantity 10,000, avg price 25,500, market price 26,200  
**When** the table renders  
**Then** the system calculates:
- **P&L (VND)**: (26,200 - 25,500) × 10,000 = **+700,000 VND**
- **P&L %**: ((26,200 - 25,500) / 25,500) × 100 = **+2.74%**
- **Display**: Both values in **green** (positive profit)

#### Scenario: Display Losing Position
**Given** FPT holding: quantity 2,000, avg price 85,000, market price 84,200  
**When** the table renders  
**Then** the system calculates:
- **P&L (VND)**: (84,200 - 85,000) × 2,000 = **-160,000 VND**
- **P&L %**: ((84,200 - 85,000) / 85,000) × 100 = **-0.94%**
- **Display**: Both values in **red** (negative loss)

#### Scenario: Real-Time Price Updates
**Given** portfolio contains VNM at market price 69,000  
**When** WebSocket receives STOCK_INFO message with VNM price 69,500  
**Then** the system:
- Updates market price to 69,500 immediately
- Recalculates P&L: (69,500 - 68,000) × 5,000 = +750,000 VND
- Highlights the updated row briefly (flash effect)
- Does not trigger full portfolio refetch

#### Scenario: Empty Portfolio Display
**Given** a user has no holdings  
**When** the Account view loads  
**Then** the system displays:
- Empty state message: "No holdings in your portfolio"
- Suggestion: "Visit the Trading view to place your first order"
- No portfolio table shown

#### Scenario: Portfolio Summary Totals
**Given** portfolio with multiple holdings  
**When** the portfolio table displays  
**Then** the system shows summary row at bottom:
- **Total Portfolio Value**: Sum of (quantity × market price) for all holdings
- **Total Unrealized P&L (VND)**: Sum of all P&L values
- **Total P&L %**: (Total P&L / Total Cost) × 100
- **Color-coded**: Green if total P&L positive, red if negative, gray if zero

---

### Requirement: Account Context State Management
**Priority**: P0  
**Dependencies**: API Client

The system SHALL provide an AccountContext to manage account and portfolio state across the application.

#### Scenario: Initialize Account Context
**Given** the app starts  
**When** AccountProvider mounts  
**Then** the context initializes with:
- `account: null`
- `portfolio: []`
- `isLoading: false`
- `error: null`

#### Scenario: Fetch Account and Portfolio on Mount
**Given** AccountContext is initialized  
**When** AccountView mounts  
**Then** the context:
- Sets `isLoading: true`
- Calls `apiClient.getAccountInfo()`
- Calls `apiClient.getPortfolio()`
- Updates `account` and `portfolio` state
- Sets `isLoading: false`

#### Scenario: Update Holdings from WebSocket
**Given** portfolio contains VNM with market price 69,000  
**When** WebSocket receives VNM price update to 69,500  
**Then** the context:
- Finds VNM in portfolio array
- Updates `marketPrice: 69,500`
- Recalculates `profit` and `profitPercent`
- Triggers re-render of components using `portfolio`

---

### Requirement: Navy Theme Consistency
**Priority**: P1  
**Dependencies**: Design System

All account and portfolio UI components SHALL follow the navy theme design system.

#### Scenario: Account Info Card Styling
**Given** Account Info Card renders  
**When** displayed on screen  
**Then** the card uses:
- **Background**: `var(--panel)` (#0b1a3a)
- **Border**: `1px solid var(--border)`
- **Text Color**: `var(--text)` (#DDEBFF)
- **Muted Labels**: `var(--muted)` (#6b80a6)
- **Box Shadow**: `0 4px 6px rgba(0, 0, 0, 0.3)`

#### Scenario: Portfolio Table Styling
**Given** Portfolio Table renders  
**When** displayed on screen  
**Then** the table uses:
- **Header Background**: `var(--panel-elevated)`
- **Header Text**: `var(--muted)`
- **Row Borders**: `1px solid var(--border)`
- **Hover Background**: `var(--panel-elevated)`
- **Profit Color**: `var(--success)` (#4ade80)
- **Loss Color**: `var(--danger)` (#ef4444)

#### Scenario: No Off-Brand Colors
**Given** any Account view component  
**When** inspecting CSS styles  
**Then** there are no hardcoded colors like:
- `white`, `#fff`, `#ffffff`
- `black`, `#000`, `#000000`
- Light grays like `#f9fafb`, `#e5e7eb`
- Off-brand blues/purples like `#667eea`, `#1976d2`

---

## Type Definitions

```typescript
interface AccountInfo {
  accountNo: string;        // "000123456"
  accountName: string;      // "Nguyen Van A"
  balance: number;          // 1500000000 (VND)
}

interface PortfolioHolding {
  symbol: string;           // "HPG"
  quantity: number;         // 10000
  averagePrice: number;     // 25.5 (thousand VND)
  marketPrice: number;      // 26.2 (thousand VND)
  profit: number;           // 7000000 (VND)
  profitPercent: number;    // 2.74
}

interface AccountContextValue {
  account: AccountInfo | null;
  portfolio: PortfolioHolding[];
  isLoading: boolean;
  error: string | null;
  
  fetchAccount: () => Promise<void>;
  fetchPortfolio: () => Promise<void>;
  updateHoldingPrice: (symbol: string, price: number) => void;
}
```
