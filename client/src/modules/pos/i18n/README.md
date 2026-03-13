# POS i18n (Internationalization)

Translation strings for all POS UI text in English and Arabic.

**File**: `translations.ts`

---

## Usage

```tsx
import { usePOSTranslations } from "../i18n/translations";
import { useAppSettings } from "@/contexts/AppSettingsContext";

function MyComponent() {
  const { language } = useAppSettings();
  const t = usePOSTranslations(language);
  const isRTL = language === "ar";

  return <div dir={isRTL ? "rtl" : "ltr"}>{t.someKey}</div>;
}
```

---

## Supported Languages

| Code | Language | Direction |
| ---- | -------- | --------- |
| `en` | English  | LTR       |
| `ar` | Arabic   | RTL       |

Language is set globally in `AppSettingsContext` and persists across sessions.

---

## Translation Categories

### Top Bar

```ts
t.back; // Back button
t.pos; // Page title "Point of Sale"
t.cashIn; // Cash In action
t.cashOut; // Cash Out action
t.giftCards; // Gift Cards section
t.reports; // Reports section
t.lockTerminal; // Lock terminal action
t.cart; // Cart label
t.customerDisplay; // Customer display toggle
```

### Product Grid

```ts
t.searchProducts; // Search placeholder
t.scanBarcode; // Barcode scan prompt
t.noProducts; // Empty state
t.offlineCache; // "Showing cached products" indicator
t.allCategories; // Category filter "All"
```

### Product Card

```ts
t.outOfStock; // Out of stock badge
t.lowStock; // Low stock warning
t.addToCart; // Add to cart button
```

### Order Tabs

```ts
t.order; // "Order" label
t.newOrder; // New order tab button
t.mergeOrders; // Merge orders action
t.closeOrder; // Close tab action
t.itemsCount; // "{n} items" label
```

### Cart Panel

```ts
t.hold; // Hold order
t.resume; // Resume held order
t.clearCart; // Clear cart action
t.orderNote; // Order note placeholder
t.tipAmount; // Tip amount label
t.discount; // Discount label
t.subtotal; // Subtotal line
t.tax; // Tax line
t.total; // Total line
```

### Payment

```ts
t.cash; // Cash payment method
t.card; // Card payment method
t.split; // Split payment method
t.cashGiven; // "Cash given" field label
t.change; // Change label
t.cardReference; // Card reference label
t.processPayment; // Process payment button
t.splitCash; // Split cash portion
t.splitCard; // Split card portion
```

### Gift Cards

```ts
t.issueGiftCard; // Modal title
t.newGiftCard; // Modal subtitle
t.checkBalance; // Check balance modal title
t.giftCardIssued; // Success state heading
t.generatedCode; // "Your gift card code" label
t.issuedTo; // Issued to name label
t.expires; // Expiry label
t.amount; // Amount field
t.amountRequired; // Validation message
t.issueCard; // Submit button
t.done; // Done button
t.cancel; // Cancel button
```

### Cash In/Out

```ts
t.cashMovementIn; // "Cash added to drawer" subtitle
t.cashMovementOut; // "Cash removed from drawer" subtitle
t.balance; // Current balance label
t.reason; // Reason field label
t.noteOptional; // "Note (optional)" label
t.recordMovement; // Submit button
t.cashInReasons; // Array of reason options for cash-in
t.cashOutReasons; // Array of reason options for cash-out
```

### Loyalty

```ts
t.loyaltyPoints; // Points balance display
t.redeem; // Redeem action
t.pointsEarned; // Points earned this purchase
t.tier; // Tier name (Bronze/Silver/Gold/Platinum)
```

### Reports

```ts
t.cashMovements; // Cash Movements report
t.hourlySales; // Hourly Sales report
t.paymentBreakdown; // Payment Methods report
t.giftCardsReport; // Gift Cards report
t.vouchersReport; // Vouchers report
t.tableTurnover; // Table Turnover report
```

### Restaurant

```ts
t.tables; // Tables section
t.selectTable; // "Select a table" prompt
t.guests; // Guest count label
t.courses; // Courses section
t.sendToKitchen; // Send to kitchen action
t.splitBill; // Split bill action
t.availableTable; // Available status
t.occupiedTable; // Occupied status
t.reservedTable; // Reserved status
```

### Offline

```ts
t.offline; // "You are offline" banner
t.syncing; // "Syncing..." status
t.pendingSync; // "{n} transactions pending sync"
t.syncFailed; // Sync failure message
t.retrySync; // Retry sync action
t.lastSync; // "Last synced: {time}" label
```

---

## Adding a New Translation

1. Open `translations.ts`
2. Add the key to the `POSTranslations` interface
3. Add the English string to the `en` object
4. Add the Arabic string to the `ar` object
5. Use it via `t.yourNewKey` in components

```ts
// In translations.ts
export interface POSTranslations {
  // ... existing keys
  myNewFeature: string;
}

export const translations = {
  en: {
    // ... existing
    myNewFeature: "My New Feature",
  },
  ar: {
    // ... existing
    myNewFeature: "ميزتي الجديدة",
  },
};
```

---

## RTL Layout Notes

Adding a translation key is only half the job. Make sure the component using it also handles RTL layout:

- Wrap custom HTML with `dir={isRTL ? "rtl" : "ltr"}`
- Use CSS logical properties: `insetInlineEnd` instead of `right`, `textAlign: "end"` instead of `"right"`
- Do not hardcode `borderRadius` on `Space.Compact` children — Ant Design auto-adjusts for RTL
- Ant Design components (Input, Select, Button, etc.) handle RTL automatically via `ConfigProvider`
