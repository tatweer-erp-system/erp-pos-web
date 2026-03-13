# POS Module

The Point of Sale module is the main feature of this application. It provides a complete terminal experience for retail and restaurant operations.

---

## Directory Structure

```
modules/pos/
├── POSPage.tsx                    # Main layout — sidebar, product grid, cart panel
├── pages/                         # Full-page POS views (reports, tables, etc.)
├── components/                    # Feature UI components
├── context/                       # POSContext (manager override modal state)
├── hooks/                         # Business logic hooks
├── store/                         # Zustand global POS state
├── services/                      # API/data access layer (mocked)
├── data/                          # Mock data (products, customers, restaurant)
└── i18n/                          # EN/AR translations
```

See sub-directory READMEs for details:

- [components/README.md](components/README.md)
- [store/README.md](store/README.md)
- [services/README.md](services/README.md)
- [hooks/README.md](hooks/README.md)
- [i18n/README.md](i18n/README.md)
- [pages/README.md](pages/README.md)

---

## POSPage.tsx — Entry Point

The main POS terminal layout. It composes all major panel components:

| Region       | Component                                            | Description                            |
| ------------ | ---------------------------------------------------- | -------------------------------------- |
| Left sidebar | `ProductGrid` + `OrderTabsBar`                       | Browse/search products, switch orders  |
| Right panel  | `CartPanel` + `PaymentSection`                       | Cart items, discounts, payment         |
| Modals       | `ReceiptModal`, `RefundModal`, `ExchangeModal`, etc. | Contextual dialogs                     |
| Navbar       | Top action bar                                       | Cash in/out, gift cards, reports, lock |

---

## Key Features

### Multi-Order Management

- Up to 10 concurrent open orders (tabs)
- Each order is a snapshot of cart items + customer + payment
- Orders can be merged into one
- Orders can be held and resumed

### Payment Processing

- **Cash**: Enter amount given, auto-calculates change
- **Card**: Reference number entry, no change
- **Split**: Partial cash + partial card with dual entry

### Customer & Loyalty

- Search customers by name/phone
- Attach a customer to the order
- Loyalty tier system: Bronze → Silver → Gold → Platinum
- Points earned per dollar spent; points redeemable as discount
- Loyalty report available in reports section

### Vouchers & Gift Cards

- Validate and redeem voucher codes (percentage or fixed discounts)
- Gift cards: check balance, issue new cards, redeem against order total
- Multiple gift cards can be applied to a single order

### Cashier Authentication

- PIN-based cashier login (separate from ERP user login)
- Three cashier roles: Cashier, Senior Cashier, Manager
- Terminal auto-locks on inactivity
- Manager override required for certain actions (e.g., high discounts)

### Cash Drawer

- Opening float recorded at session start
- Cash in / cash out movements with reason and note
- Live balance = opening float + all movements
- Full cash movements report

### Restaurant Mode

- Table-based ordering with floor map view
- Guest count tracking per table
- Course management (Appetizer, Entrée, Dessert, Beverages)
- Kitchen ticket printing per course
- Split bill across multiple customers

### Offline Support

- Products cached to IndexedDB on load
- Transactions queued locally when offline
- Auto-sync when connection restored
- Sync status indicator with error details

### Reports

- Cash Movements
- Hourly Sales Breakdown
- Payment Method Breakdown
- Gift Cards Sales
- Voucher Usage
- Table Turnover (restaurant)

---

## Data Flow

```
User Action
  → Component (UI)
  → posStore action (Zustand)
  → Service call (mock API)
  → Store state updates
  → UI re-renders reactively
```

For offline scenarios:

```
User Action (offline)
  → offlineService (IndexedDB queue)
  → syncService (on reconnect)
  → API submission
  → Store updated
```

---

## Localization

All UI text uses `usePOSTranslations(language)` from `i18n/translations.ts`.

```tsx
const { language } = useAppSettings();
const t = usePOSTranslations(language);
const isRTL = language === "ar";
```

- Use `dir={isRTL ? "rtl" : "ltr"}` on custom HTML wrappers
- Use CSS logical properties for RTL-safe positioning: `insetInlineEnd`, `textAlign: "end"`
- Ant Design handles its own RTL via `ConfigProvider` at the app root

---

## Theming

- All accent colors use Ant Design `theme.useToken()` for dark/light awareness
- Modal backgrounds use `var(--card)` CSS variable (white in light, dark in dark mode)
- Purple `#A855F7` is used specifically for gift card features
- Red `#EF4444` for cash-out and refund actions
- Green `#10B981` for cash-in and success states
