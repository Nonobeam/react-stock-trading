# Order Placement & Management

## ADDED Requirements

### Requirement: Display Order Form
**Priority**: P0  
**Dependencies**: Backend `/orders` endpoint, Vietnam trading rules

The system SHALL provide an order form for users to place buy/sell orders with validation.

#### Scenario: Render Order Form
**Given** a user navigates to Trading view  
**When** the page loads  
**Then** the system displays an order form with fields:
- **Symbol** (dropdown with available stocks)
- **Side** (radio buttons: BUY / SELL)
- **Order Type** (dropdown: LO, MP, ATO, ATC)
- **Quantity** (number input, increment by 100)
- **Price** (number input, only for LO/ATO/ATC orders)
- **Estimated Cost** (calculated display, read-only)
- **Place Order** button

#### Scenario: Select Symbol and Display Price Limits
**Given** the order form is rendered  
**When** the user selects symbol "VNM"  
**Then** the system:
- Fetches symbol info from `GET /market/symbol/VNM`
- Displays price limits: "Ceiling: 73.8 | Floor: 64.2 | Reference: 69.0"
- Pre-fills price field with reference price (69.0)
- Validates future price inputs against ceiling/floor

#### Scenario: Validate Lot Size (Vietnam Rule)
**Given** the user enters quantity  
**When** quantity is NOT a multiple of 100  
**Then** the system:
- Shows error: "Quantity must be a multiple of 100 shares"
- Disables "Place Order" button
- Highlights quantity field in red

**When** quantity is 100 or multiple of 100  
**Then** the system:
- Removes error message
- Enables "Place Order" button
- Highlights quantity field in green (valid)

#### Scenario: Validate Price Limits
**Given** VNM has ceiling 73.8 and floor 64.2  
**When** user enters price 75.0 (above ceiling)  
**Then** the system:
- Shows error: "Price 75.0 exceeds ceiling price 73.8"
- Disables "Place Order" button

**When** user enters price 60.0 (below floor)  
**Then** the system:
- Shows error: "Price 60.0 is below floor price 64.2"
- Disables "Place Order" button

**When** user enters price 68.5 (within limits)  
**Then** the system:
- Removes error messages
- Enables "Place Order" button

#### Scenario: Calculate Estimated Cost (BUY Order)
**Given** user selects:
- Symbol: VNM
- Side: BUY
- Quantity: 1000
- Price: 68.5  
**When** any field changes  
**Then** the system calculates and displays:
- **Estimated Cost**: 1000 × 68.5 × 1000 = **68,500,000 VND**
- Formatted with thousands separators: "68,500,000 VND"

#### Scenario: Calculate Estimated Proceeds (SELL Order)
**Given** user selects:
- Symbol: HPG
- Side: SELL
- Quantity: 500
- Price: 26.2  
**When** side is SELL  
**Then** the system calculates and displays:
- **Estimated Proceeds**: 500 × 26.2 × 1000 = **13,100,000 VND**
- Formatted: "13,100,000 VND"

#### Scenario: Disable Price Field for Market Orders
**Given** user selects Order Type "MP" (Market Price)  
**When** the order type changes  
**Then** the system:
- Disables price input field (grayed out)
- Shows helper text: "Market orders execute at best available price"
- Sets price to `null` in form state

---

### Requirement: Order Confirmation Modal
**Priority**: P0  
**Dependencies**: Order Form validation

The system SHALL display a confirmation modal before placing any order to prevent accidental submissions.

#### Scenario: Show Order Confirmation
**Given** user fills valid order form:
- Symbol: VNM, Side: BUY, Type: LO, Quantity: 1000, Price: 68.5  
**When** user clicks "Place Order" button  
**Then** the system:
- Displays confirmation modal with summary:
  - **Symbol**: VNM
  - **Action**: BUY 1,000 shares
  - **Price**: 68,500 VND per share
  - **Total Cost**: 68,500,000 VND
  - **Order Type**: Limit Order (LO)
- Shows two buttons: "Confirm" | "Cancel"
- Blocks interaction with background form

#### Scenario: Confirm Order Placement
**Given** confirmation modal is open  
**When** user clicks "Confirm"  
**Then** the system:
- Calls `apiClient.placeOrder(orderRequest)`
- Shows loading spinner on modal
- Sends POST request to `/orders` with body:
  ```json
  {
    "symbol": "VNM",
    "side": "BUY",
    "orderType": "LO",
    "quantity": 1000,
    "price": 68.5
  }
  ```
- On success (200 response):
  - Closes modal
  - Shows success toast: "Order ORD-123456789 placed successfully"
  - Clears order form
  - Refreshes pending orders table
- On failure:
  - Shows error message in modal: "Failed to place order: {reason}"
  - Keeps modal open with "Retry" and "Cancel" buttons

#### Scenario: Cancel Order Confirmation
**Given** confirmation modal is open  
**When** user clicks "Cancel" or presses Escape key  
**Then** the system:
- Closes modal
- Returns to order form with all fields intact
- Does not place order

---

### Requirement: Display Pending Orders
**Priority**: P0  
**Dependencies**: Backend `/orders` endpoint (assumed to exist)

The system SHALL display a list of pending orders with the ability to cancel them.

#### Scenario: View Pending Orders Table
**Given** user has 2 pending orders  
**When** Trading view loads  
**Then** the system displays a table with columns:
- **Order ID** (e.g., "ORD-123")
- **Symbol** (e.g., "HPG")
- **Side** (BUY/SELL)
- **Type** (LO/MP/ATO/ATC)
- **Quantity** (e.g., 100)
- **Price** (e.g., 26.5, or "Market" for MP orders)
- **Status** (PENDING, PARTIALLY_FILLED, etc.)
- **Actions** (Cancel button)

#### Scenario: Pending Order Row Display
**Given** order ORD-123: HPG, BUY, LO, 100 shares @ 26.5, PENDING  
**When** the row renders  
**Then** the system shows:
- **Order ID**: ORD-123 (clickable for details)
- **Symbol**: HPG
- **Side**: BUY (in green text)
- **Type**: LO
- **Quantity**: 100
- **Price**: 26,500 VND
- **Status**: 🟡 PENDING (yellow badge)
- **Actions**: [Cancel Order] button (red outline)

#### Scenario: Empty Pending Orders
**Given** user has no pending orders  
**When** Trading view loads  
**Then** the system displays:
- Empty state message: "No pending orders"
- Suggestion: "Use the order form above to place an order"
- No table shown

---

### Requirement: Cancel Order
**Priority**: P0  
**Dependencies**: Backend `/orders/{id}/cancel` endpoint

The system SHALL allow users to cancel pending orders with confirmation.

#### Scenario: Request Order Cancellation
**Given** order ORD-123 is PENDING  
**When** user clicks "Cancel Order" button  
**Then** the system:
- Shows confirmation dialog: "Are you sure you want to cancel order ORD-123?"
- Displays order details: HPG BUY 100 @ 26.5
- Shows two buttons: "Yes, Cancel" | "No, Keep"

#### Scenario: Confirm Order Cancellation
**Given** cancellation dialog is open for ORD-123  
**When** user clicks "Yes, Cancel"  
**Then** the system:
- Calls `apiClient.cancelOrder("ORD-123")`
- Sends POST request to `/orders/ORD-123/cancel`
- On success (200 response):
  - Removes order from pending orders table
  - Shows success toast: "Order ORD-123 cancelled"
  - Closes dialog
- On failure:
  - Shows error: "Failed to cancel order: {reason}"
  - Keeps dialog open with "Retry" option

#### Scenario: Cancel Already Filled Order
**Given** order ORD-124 status changed to FILLED before cancellation  
**When** user attempts to cancel ORD-124  
**Then** the system:
- Receives error response from backend (400 or 409)
- Shows error message: "Cannot cancel order ORD-124: Order already filled"
- Refreshes pending orders table to update status

---

### Requirement: Real-Time Order Updates
**Priority**: P1  
**Dependencies**: WebSocket connection

The system SHALL update order status in real-time when order events occur.

#### Scenario: Order Filled via WebSocket
**Given** order ORD-123 is PENDING in the table  
**When** WebSocket receives message:
```json
{
  "type": "ORDER_UPDATE",
  "data": {
    "orderId": "ORD-123",
    "status": "FILLED",
    "filledQuantity": 100,
    "filledPrice": 26.5
  }
}
```  
**Then** the system:
- Removes ORD-123 from pending orders table
- Shows success notification: "Order ORD-123 filled at 26,500 VND"
- Optionally adds to order history (if implemented)

#### Scenario: Partial Fill Update
**Given** order ORD-125: VNM BUY 1000 @ 69.0 PENDING  
**When** WebSocket receives partial fill:
```json
{
  "type": "ORDER_UPDATE",
  "data": {
    "orderId": "ORD-125",
    "status": "PARTIALLY_FILLED",
    "filledQuantity": 500,
    "remainingQuantity": 500
  }
}
```  
**Then** the system:
- Updates order status to 🟡 PARTIALLY_FILLED
- Shows in table: "500 / 1000 filled"
- Keeps order in pending table (not yet complete)

---

### Requirement: Trading Context State Management
**Priority**: P0  
**Dependencies**: API Client

The system SHALL provide a TradingContext to manage order state across the application.

#### Scenario: Initialize Trading Context
**Given** the app starts  
**When** TradingProvider mounts  
**Then** the context initializes with:
- `orders: []`
- `isLoading: false`
- `error: null`

#### Scenario: Place Order via Context
**Given** user submits valid order form  
**When** `placeOrder(orderRequest)` is called  
**Then** the context:
- Sets `isLoading: true`
- Calls `apiClient.placeOrder(orderRequest)`
- On success:
  - Adds new order to `orders` array with status PENDING
  - Sets `isLoading: false`
  - Returns `{ orderId: "ORD-123" }`
- On failure:
  - Sets `error: "Failed to place order"`
  - Sets `isLoading: false`
  - Throws error for component to handle

#### Scenario: Update Order Status from WebSocket
**Given** order ORD-123 exists in `orders` array  
**When** WebSocket calls `updateOrderStatus("ORD-123", "FILLED")`  
**Then** the context:
- Finds order with id "ORD-123"
- Updates `status: "FILLED"`
- Removes from `orders` array (since no longer pending)
- Triggers re-render of components using `orders`

---

### Requirement: Order Form Validation Summary
**Priority**: P0  
**Dependencies**: None

The system SHALL validate all order form inputs before enabling submission.

#### Scenario: All Validations Pass
**Given** order form with:
- Symbol: VNM (selected)
- Side: BUY (selected)
- Type: LO (selected)
- Quantity: 1000 (valid, multiple of 100)
- Price: 68.5 (within ceiling/floor)  
**When** all fields are valid  
**Then** the system:
- Enables "Place Order" button (navy gradient, clickable)
- Shows no error messages
- Displays estimated cost: "68,500,000 VND"

#### Scenario: Validation Errors Present
**Given** order form with:
- Symbol: VNM (selected)
- Side: BUY (selected)
- Type: LO (selected)
- Quantity: 150 (invalid, not multiple of 100)
- Price: 75.0 (above ceiling 73.8)  
**When** validation runs  
**Then** the system:
- Disables "Place Order" button (grayed out)
- Shows errors:
  - Quantity: "Must be multiple of 100"
  - Price: "Exceeds ceiling price 73.8"
- Does not calculate estimated cost (shows "---")

---

### Requirement: Navy Theme Consistency
**Priority**: P1  
**Dependencies**: Design System

All trading UI components SHALL follow the navy theme design system.

#### Scenario: Order Form Styling
**Given** Order Form renders  
**When** displayed on screen  
**Then** the form uses:
- **Background**: `var(--panel)` (#0b1a3a)
- **Input Fields**: Transparent background, `var(--border)` bottom border
- **Focus State**: `var(--accent)` (#1e4db3) border
- **Labels**: `var(--muted)` (#6b80a6)
- **Error Text**: `var(--danger)` (#ef4444)
- **Place Order Button**: Navy gradient `linear-gradient(135deg, var(--accent), var(--accent-dark))`

#### Scenario: Pending Orders Table Styling
**Given** Pending Orders Table renders  
**When** displayed on screen  
**Then** the table uses:
- **Header Background**: `var(--panel-elevated)`
- **BUY Side**: `var(--success)` (#4ade80) text
- **SELL Side**: `var(--danger)` (#ef4444) text
- **PENDING Status**: `var(--warning)` (#fbbf24) badge
- **Cancel Button**: Transparent with `var(--danger)` border

---

## Type Definitions

```typescript
type OrderSide = 'BUY' | 'SELL';
type OrderType = 'LO' | 'MP' | 'ATO' | 'ATC';
type OrderStatus = 'PENDING' | 'FILLED' | 'PARTIALLY_FILLED' | 'CANCELLED' | 'REJECTED';

interface OrderRequest {
  symbol: string;           // "VNM"
  side: OrderSide;          // "BUY"
  orderType: OrderType;     // "LO"
  quantity: number;         // 1000 (must be multiple of 100)
  price?: number;           // 68.5 (optional for MP orders)
}

interface Order {
  orderId: string;          // "ORD-123456789"
  symbol: string;
  side: OrderSide;
  orderType: OrderType;
  quantity: number;
  price?: number;
  status: OrderStatus;
  message?: string;
  createdTime: string;      // ISO 8601 timestamp
  filledQuantity?: number;  // For partial fills
  filledPrice?: number;     // Actual execution price
}

interface TradingContextValue {
  orders: Order[];
  isLoading: boolean;
  error: string | null;
  
  fetchOrders: () => Promise<void>;
  placeOrder: (request: OrderRequest) => Promise<{ orderId: string }>;
  cancelOrder: (orderId: string) => Promise<void>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
}
```
