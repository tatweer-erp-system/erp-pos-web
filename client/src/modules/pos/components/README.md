# POS Components

All UI components for the POS module. Organized by feature area.

---

## Directory Structure

```
components/
├── ProductGrid.tsx              # Category-filtered product browsing grid
├── ProductCard.tsx              # Single product card with add-to-cart action
├── CartPanel.tsx                # Full cart display (items, totals, actions)
├── CartItem.tsx                 # Individual cart item with quantity editor
├── PaymentSection.tsx           # Payment method selector and entry
├── ReceiptModal.tsx             # Post-checkout receipt display
├── RefundModal.tsx              # Refund processing workflow
├── ExchangeModal.tsx            # Product exchange workflow
├── ThemeCustomizer.tsx          # Theme/accent color switcher panel
│
├── auth/                        # Cashier authentication screens
│   ├── CashierLoginScreen.tsx   # PIN-based cashier login
│   ├── LockScreen.tsx           # Terminal inactivity lock overlay
│   ├── ManagerOverrideModal.tsx # Manager approval dialog
│   └── PINPad.tsx               # Numeric PIN input component
│
├── cart/                        # Cart-related sub-components
│   ├── CustomerCard.tsx         # Display attached customer info + loyalty tier
│   ├── CustomerSearch.tsx       # Customer search/add input
│   ├── LoyaltyRedemption.tsx    # Points redemption slider/input
│   └── VoucherInput.tsx         # Voucher code entry and validation
│
├── cashier/
│   └── CashInOutModal.tsx       # Cash drawer movement dialog (in/out)
│
├── modals/
│   ├── CheckBalanceModal.tsx    # Gift card balance lookup
│   └── IssueGiftCardModal.tsx   # Issue new gift card
│
├── offline/                     # Offline & sync UI
│   ├── OfflineBanner.tsx        # Top-of-page offline indicator bar
│   ├── OfflineSettingsTab.tsx   # Settings tab for offline configuration
│   ├── SyncErrorsModal.tsx      # Failed sync details dialog
│   ├── SyncStatusDrawer.tsx     # Detailed sync progress drawer
│   └── SyncStatusIndicator.tsx  # Small status badge/icon
│
├── orders/                      # Order management UI
│   ├── OrderTabsBar.tsx         # Horizontal tab bar for multiple open orders
│   └── MergeOrdersModal.tsx     # Select and merge open orders
│
└── restaurant/                  # Restaurant-mode components
    ├── TableCard.tsx            # Single table display (status, occupancy)
    ├── TableMap.tsx             # Visual floor plan with section tabs
    ├── KitchenTicket.tsx        # Kitchen order ticket view
    ├── CourseManager.tsx        # Course sequencing UI per order
    ├── FireCourseButton.tsx     # Send a course to kitchen
    └── SplitBillModal.tsx       # Split bill across customers
```

---

## Component Guidelines

### Modal Design Pattern

All modals follow this consistent structure:

```tsx
<Modal
  open={open}
  onCancel={onClose}
  closeIcon={null}
  footer={null}
  width="min(420px, 95vw)"
  centered
  title={null}
  styles={{ body: { padding: 0 } }}
>
  {/* Gradient Header */}
  <div
    style={{
      position: "relative",
      background: `linear-gradient(135deg, COLOR, COLORcc)`,
      padding: "20px 24px 16px",
      borderRadius: "8px 8px 0 0",
      direction: isRTL ? "rtl" : "ltr",
    }}
  >
    <IconComponent />
    <div>Title</div>
    <div>Subtitle</div>
    {/* Circular close button (top-right/top-left in RTL) */}
    <button style={{ position: "absolute", insetInlineEnd: 14 }}>✕</button>
  </div>

  {/* Body */}
  <div dir={isRTL ? "rtl" : "ltr"} style={{ padding: "20px 24px 24px" }}>
    {/* Content */}
  </div>
</Modal>
```

**Color coding by feature:**

- Gift cards: `#A855F7` (purple)
- Cash in: `#10B981` (green)
- Cash out / Refund: `#EF4444` (red)
- Exchange: `#3B82F6` (blue)
- Neutral / Info: primary token color

### Localization Pattern

Every component that renders text must support RTL:

```tsx
const { language } = useAppSettings();
const t = usePOSTranslations(language);
const isRTL = language === "ar";
```

Use `dir={isRTL ? "rtl" : "ltr"}` on wrapper divs.
Use `direction: isRTL ? "rtl" : "ltr"` on modal headers.

### Responsive Pattern

For mobile-specific layout adjustments:

```tsx
import { Grid } from "antd";
const { useBreakpoint } = Grid;

const screens = useBreakpoint();
const isMobile = !screens.sm;
```

Then use `isMobile` to conditionally adjust:

- `padding: isMobile ? "16px" : "24px"`
- `flexWrap: isMobile ? "wrap" : "nowrap"`
- `fontSize: isMobile ? 14 : 16`

### Space.Compact + RTL

When using `Space.Compact` (e.g., InputNumber + Select together), do NOT hardcode `borderRadius` on child elements. Ant Design automatically adjusts border-radius based on RTL direction. Hardcoded values break this behavior.

---

## Auth Components

### CashierLoginScreen

- Shows a roster of available cashiers
- Each cashier selects their name then enters PIN via `PINPad`
- Validates against `cashierAuthService`
- On success: sets `cashierSession` in posStore

### LockScreen

- Full-screen overlay when terminal is inactive
- Requires PIN to unlock
- Shows cashier name and lock reason
- After N failed attempts, requires manager override

### ManagerOverrideModal

- Triggered when an action requires elevated permissions (e.g., discount > threshold)
- Manager enters their PIN or badge ID
- Records override in `overrideLog` in posStore

### PINPad

- Numeric 0-9 grid with delete and confirm buttons
- Shows PIN as masked dots
- Supports configurable max length

---

## Cart Components

### CustomerSearch

- Debounced search by name or phone
- Shows results as dropdown list
- Can attach customer to current order
- `isMobile` prop adjusts layout

### LoyaltyRedemption

- Shows available points and redemption ratio
- Slider or input to choose redemption amount
- Calculates equivalent dollar discount

### VoucherInput

- Text input for voucher code
- Calls `voucherService.validateVoucher()`
- On success: stores applied voucher in posStore

---

## Offline Components

### SyncStatusIndicator

- Small badge shown in top bar
- Colors: green (synced), orange (pending), red (failed)
- Click opens `SyncStatusDrawer`

### SyncStatusDrawer

- Full details: pending count, failed count, last sync time
- Retry button for failed items
- Link to `SyncErrorsModal` for error details

### OfflineSettingsTab

- Toggle offline mode on/off
- Set cache refresh interval
- Manual "refresh cache now" button

---

## Restaurant Components

### TableMap

- Grid of `TableCard` components organized by section
- Section tabs: Main Hall, Terrace, Bar, VIP Room
- Filter by: all tables / available / occupied / reserved

### TableCard

- Shows table number, status badge, occupancy
- Color: green (available), orange (occupied), gray (reserved)
- Click to attach table to current order

### CourseManager

- Groups cart items by course (Appetizer, Entrée, etc.)
- Drag or assign each item to a course
- Show "Fire" button to send course to kitchen

### SplitBillModal

- Enter number of splits
- Choose equal split or custom amounts per person
- Generates individual receipts/payment requests
