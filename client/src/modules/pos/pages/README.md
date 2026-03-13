# POS Pages

Full-page views within the POS module (not modal dialogs). These are navigated to from the main POS terminal.

---

## Pages Overview

```
pages/
├── CustomerDisplayScreen.tsx     # Secondary display screen for customers
├── TablesPage.tsx                # Restaurant table management view
├── LoyaltyReport.tsx             # Loyalty program analytics
└── reports/
    ├── CashMovementsReport.tsx   # Cash in/out history
    ├── GiftCardsReport.tsx       # Gift card issuance & redemption report
    ├── HourlySalesReport.tsx     # Sales by hour breakdown
    ├── PaymentBreakdownReport.tsx # Revenue by payment method
    ├── TableTurnoverReport.tsx   # Restaurant table utilization
    └── VouchersReport.tsx        # Voucher usage analytics
```

---

## CustomerDisplayScreen.tsx

A dedicated view designed to be shown on a secondary monitor or customer-facing display.

**Shows**:

- Cart items with prices
- Running subtotal and total
- Loyalty points being earned
- Promotions / applied discounts
- Thank you / idle screen when no active order

**Usage**: Opened from the top bar "Customer Display" toggle. Runs in a separate browser window or on a second connected display.

---

## TablesPage.tsx

Restaurant table management view (only relevant when `restaurantMode` is enabled).

**Features**:

- Visual floor plan organized by section tabs (Main Hall, Terrace, Bar, VIP)
- Table cards showing: number, status, occupancy, running total
- Click a table to open an order for that table
- Status filters: All / Available / Occupied / Reserved
- Real-time updates as tables are occupied/released

**Data source**: `tableService.ts`

---

## LoyaltyReport.tsx

Analytics view for the loyalty program.

**Shows**:

- Total points issued today / this week / this month
- Points redeemed vs earned ratio
- Customer tier distribution (Bronze / Silver / Gold / Platinum)
- Top customers by points earned
- Points expiring soon

---

## reports/

All reports share a common layout structure:

- Date range filter (today / this week / this month / custom)
- Summary stats at the top (key numbers)
- Data table or chart below

### CashMovementsReport.tsx

- Timeline of all cash-in and cash-out movements for the current session
- Columns: Time, Type (In/Out), Amount, Reason, Cashier
- Running balance column
- Session summary: opening float, total in, total out, closing balance

### HourlySalesReport.tsx

- Bar chart of transactions and revenue by hour (00:00 – 23:00)
- Useful for identifying peak hours and staffing needs
- Toggle between transaction count and revenue views

### PaymentBreakdownReport.tsx

- Pie or bar chart of revenue split by payment method
- Cash vs Card vs Split breakdown
- Total amounts and percentages
- Useful for reconciliation

### GiftCardsReport.tsx

- Gift cards issued this session (code, amount, recipient, date)
- Gift cards redeemed (code, redemption amount, order reference)
- Outstanding gift card liability total

### VouchersReport.tsx

- Vouchers applied this session
- Each row: code, discount type, discount amount, order reference
- Total discount given via vouchers

### TableTurnoverReport.tsx (Restaurant only)

- Each table: times seated, average occupancy duration, total revenue
- Section-level aggregates
- Helps optimize seating and table rotation

---

## Accessing Reports

Reports are accessible from the **Reports** button in the POS top navigation bar. They open as full-page views (not modals) and navigate back to the POS with the back button.
