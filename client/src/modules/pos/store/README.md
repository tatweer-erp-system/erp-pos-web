# POS Store

Centralized state management for the entire POS module using **Zustand**.

**File**: `posStore.ts` (~1048 lines)

---

## Usage

```tsx
import { usePOSStore } from "../store/posStore";

// Access a single state slice
const cartItems = usePOSStore((s) => s.cartItems);

// Access an action
const addToCart = usePOSStore((s) => s.addToCart);

// Access a computed helper
const grandTotal = usePOSStore((s) => s.grandTotal());
```

Always select only what you need to prevent unnecessary re-renders.

---

## State Sections

### 1. Multi-Order Management

| State | Type | Description |
|-------|------|-------------|
| `orders` | `OrderTab[]` | All open order tabs |
| `activeOrderIndex` | `number` | Currently active tab index |

| Action | Description |
|--------|-------------|
| `addOrder()` | Open a new blank order tab |
| `removeOrder(index)` | Close an order tab |
| `switchOrder(index)` | Activate a different order tab |
| `mergeOrders(indices)` | Combine selected orders into one |

---

### 2. Shopping Cart

| State | Type | Description |
|-------|------|-------------|
| `cartItems` | `CartItem[]` | Products with quantities and line discounts |

| Action | Description |
|--------|-------------|
| `addToCart(product)` | Add product or increment quantity |
| `removeFromCart(productId)` | Remove product completely |
| `updateQuantity(productId, qty)` | Set specific quantity |
| `setItemDiscount(productId, discount)` | Apply line-item discount |
| `clearCart()` | Remove all items |

---

### 3. Customer & Loyalty

| State | Type | Description |
|-------|------|-------------|
| `attachedCustomer` | `Customer \| null` | Customer linked to current order |
| `redeemPoints` | `number` | Points chosen for redemption |

| Action | Description |
|--------|-------------|
| `setAttachedCustomer(customer)` | Link or unlink customer |
| `setRedeemPoints(points)` | Set redemption amount |

---

### 4. Promotions

| State | Type | Description |
|-------|------|-------------|
| `appliedVoucher` | `AppliedVoucher \| null` | Single voucher applied |
| `appliedGiftCards` | `AppliedGiftCard[]` | Multiple gift cards applied |

| Action | Description |
|--------|-------------|
| `setAppliedVoucher(voucher)` | Apply or clear voucher |
| `addGiftCard(card)` | Add a redeemed gift card |
| `removeGiftCard(code)` | Remove a gift card |

---

### 5. Payment

| State | Type | Description |
|-------|------|-------------|
| `paymentMethod` | `"cash" \| "card" \| "split"` | Selected payment method |
| `cashGiven` | `number` | Cash amount tendered by customer |
| `cardRef` | `string` | Card transaction reference number |
| `splitCash` | `number` | Cash portion in split payment |
| `splitCard` | `number` | Card portion in split payment |
| `splitCardRef` | `string` | Card reference for split |

| Action | Description |
|--------|-------------|
| `setPaymentMethod(method)` | Switch payment method |
| `setCashGiven(amount)` | Update cash tendered |
| `setCardRef(ref)` | Update card reference |
| `setSplitCash(amount)` | Update split cash portion |
| `setSplitCard(amount)` | Update split card portion |
| `setSplitCardRef(ref)` | Update split card reference |

---

### 6. Order Extras

| State | Type | Description |
|-------|------|-------------|
| `orderNote` | `string` | Optional note on the order |
| `tipAmount` | `number` | Tip amount added by customer |
| `discount` | `{ type: "percent" \| "fixed"; value: number }` | Order-level discount |

| Action | Description |
|--------|-------------|
| `setOrderNote(note)` | Update order note |
| `setTip(amount)` | Update tip |
| `setDiscount(discount)` | Apply order-level discount |

---

### 7. Held Orders

| State | Type | Description |
|-------|------|-------------|
| `heldOrders` | `HeldOrder[]` | Paused orders saved for later |

| Action | Description |
|--------|-------------|
| `holdOrder()` | Save current cart as a held order |
| `resumeOrder(id)` | Restore a held order to cart |

---

### 8. Cashier Session

| State | Type | Description |
|-------|------|-------------|
| `cashierSession` | `CashierSession \| null` | Active cashier session info |

| Action | Description |
|--------|-------------|
| `setCashierSession(session)` | Start or end session |
| `lockSession()` | Lock the terminal (triggers lock screen) |
| `unlockSession()` | Unlock after PIN validation |

Session is persisted to `localStorage`.

---

### 9. Cash Drawer

| State | Type | Description |
|-------|------|-------------|
| `openingFloat` | `number` | Starting cash in drawer at session start |
| `cashMovements` | `CashMovement[]` | All cash in/out records |

| Action | Description |
|--------|-------------|
| `setOpeningFloat(amount)` | Record opening float |
| `addCashMovement(movement)` | Add a cash in/out record |

| Computed | Description |
|----------|-------------|
| `cashDrawerTotal()` | Opening float + sum of all movements |

---

### 10. Manager Override Log

| State | Type | Description |
|-------|------|-------------|
| `overrideLog` | `OverrideRecord[]` | Audit trail of manager approvals |
| `discountOverrideGranted` | `boolean` | Whether current discount was override-approved |

| Action | Description |
|--------|-------------|
| `addOverrideLog(record)` | Append override record |
| `setDiscountOverrideGranted(val)` | Set override flag |

---

### 11. POS Session Settings

| State | Type | Description |
|-------|------|-------------|
| `posSessionSettings` | `POSSessionSettings` | Session config (lock timeout, PIN attempts, etc.) |

| Action | Description |
|--------|-------------|
| `setPOSSessionSettings(settings)` | Update session configuration |

---

### 12. Completed Order

| State | Type | Description |
|-------|------|-------------|
| `completedOrder` | `OrderResult \| null` | Result of last checkout |

| Action | Description |
|--------|-------------|
| `setCompletedOrder(result)` | Store completed order (triggers receipt display) |

---

### 13. Offline Mode

| State | Type | Description |
|-------|------|-------------|
| `isOnline` | `boolean` | Network connectivity status |
| `offlineModeEnabled` | `boolean` | Offline mode toggle |
| `cacheRefreshInterval` | `number` | How often to refresh product cache (minutes) |
| `lastCacheSync` | `string \| null` | ISO timestamp of last successful sync |
| `pendingCount` | `number` | Queued transactions pending sync |
| `failedCount` | `number` | Failed sync attempts |
| `isSyncing` | `boolean` | Sync in progress flag |

---

### 14. Restaurant Mode

| State | Type | Description |
|-------|------|-------------|
| `restaurantMode` | `boolean` | Enable/disable restaurant features |
| `tableManagementEnabled` | `boolean` | Table management feature flag |
| `courseManagementEnabled` | `boolean` | Course sequencing feature flag |
| `kitchenPrintingEnabled` | `boolean` | Auto-print to kitchen on fire |
| `autoSendKitchen` | `boolean` | Automatically send all items to kitchen |
| `allowTakeAway` | `boolean` | Allow takeaway orders |
| `defaultGuests` | `number` | Default guest count for new orders |
| `attachedTable` | `RestaurantTable \| null` | Table linked to current order |
| `guestCount` | `number` | Guests at current table |

| Action | Description |
|--------|-------------|
| `setRestaurantMode(val)` | Toggle restaurant mode |
| `setAttachedTable(table)` | Attach/detach table from order |
| `setGuestCount(count)` | Update guest count |
| `setItemCourse(productId, course)` | Assign cart item to a course |
| `setItemNote(productId, note)` | Add note to a cart item |

---

## Computed Helpers

All computed values are functions (not cached values) — call them as `store.grandTotal()`.

| Helper | Description |
|--------|-------------|
| `subtotal()` | Sum of (item price × qty) for all cart items |
| `discountAmount()` | Order-level discount in dollars |
| `redemptionDiscount()` | Loyalty points redemption discount |
| `voucherDiscount()` | Voucher discount amount |
| `giftCardDiscount()` | Total gift card credit applied |
| `taxAmount()` | Tax on discounted subtotal |
| `grandTotal()` | subtotal − discounts + tax + tip |
| `amountDue()` | grandTotal − gift cards |
| `finalTotal()` | Final amount after all deductions |
| `change()` | Cash given − amount due (for cash payments) |
| `pointsEarned()` | Loyalty points earned from this purchase |
| `earnRatio()` | Points earned per dollar (from customer tier) |
| `redeemRatio()` | Dollar value per redeemed point |

---

## Persistence

- **Cashier session**: saved to `localStorage` to survive page refresh
- **Restaurant mode flags**: cached in `localStorage`
- **Last sync timestamp**: stored in `localStorage`
- All other state: in-memory, lost on refresh (by design for POS sessions)
