# POS Services

Data access layer for the POS module. All services are currently **mocked** with in-memory data and simulated network delays. Replace with real API calls when the backend is ready.

---

## Services Overview

| File | Domain | Key Functions |
|------|--------|---------------|
| `posService.ts` | Core orders & products | `submitOrder`, `getProducts`, `getProductByBarcode` |
| `customerService.ts` | Customer CRM | `searchCustomers`, `createCustomer`, `updateLoyaltyPoints` |
| `voucherService.ts` | Promotional discounts | `validateVoucher`, `redeemVoucher` |
| `giftCardService.ts` | Gift card lifecycle | `checkBalance`, `issueGiftCard`, `redeemGiftCard` |
| `cashierAuthService.ts` | Terminal access | `validatePIN`, `getCashiers`, `recordLogin` |
| `tableService.ts` | Restaurant tables | `getTables`, `occupyTable`, `releaseTable`, `updateTableTotal` |
| `kitchenService.ts` | Kitchen tickets | `sendToKitchen`, `getActiveTickets`, `markTicketComplete` |
| `offlineService.ts` | IndexedDB persistence | `cacheProducts`, `queueTransaction`, `getQueuedTransactions` |
| `syncService.ts` | Offline → Online sync | `syncPendingTransactions`, `getSyncStatus` |

---

## posService.ts

Handles product retrieval and order submission.

```ts
// Get all products (with optional category filter)
getProducts(category?: string): Promise<Product[]>

// Barcode lookup
getProductByBarcode(barcode: string): Promise<Product | null>

// Submit completed order to backend
submitOrder(order: OrderPayload): Promise<OrderResult>
```

**Mock behavior**: Products come from `data/mockProducts.ts`. Order submission returns a generated receipt number after a simulated delay.

---

## customerService.ts

Customer search and loyalty management.

```ts
// Search by name or phone (debounce in component)
searchCustomers(query: string): Promise<Customer[]>

// Create new customer
createCustomer(data: NewCustomerData): Promise<Customer>

// Update points after a transaction
updateLoyaltyPoints(customerId: string, points: number): Promise<void>
```

**Loyalty Tiers** (from `mockCustomers.ts`):

| Tier | Points Range | Earn Ratio | Redeem Ratio |
|------|-------------|------------|--------------|
| Bronze | 0 – 500 | 0.10 pts/$ | $0.10/pt |
| Silver | 501 – 2,000 | 0.15 pts/$ | $0.12/pt |
| Gold | 2,001 – 5,000 | 0.20 pts/$ | $0.15/pt |
| Platinum | 5,001+ | 0.25 pts/$ | $0.20/pt |

---

## voucherService.ts

Voucher code validation and redemption.

```ts
// Validate code and return voucher details
validateVoucher(code: string): Promise<VoucherResult>

// Mark voucher as used
redeemVoucher(code: string, orderId: string): Promise<void>
```

**Voucher types**:
- `percent` — Percentage discount (e.g., 10% off)
- `fixed` — Fixed dollar amount (e.g., $15 off)
- Vouchers may have expiry dates and usage limits

---

## giftCardService.ts

Full gift card lifecycle management.

```ts
// Check remaining balance on a card
checkBalance(code: string): Promise<GiftCardBalance>

// Issue a new gift card
issueGiftCard(params: {
  amount: number;
  issuedTo?: string;
  expiryDate?: string;
}): Promise<GiftCard>

// Redeem a gift card (partial or full)
redeemGiftCard(code: string, amount: number): Promise<RedeemResult>
```

**Mock denominations**: $10, $25, $50, $100 (configurable active/inactive status)

**GiftCard shape**:
```ts
{
  code: string;           // Generated unique code (e.g., "GC-A1B2C3D4")
  issuedAmount: number;
  remainingBalance: number;
  issuedTo?: string;
  expiryDate?: string;
  status: "active" | "redeemed" | "expired";
}
```

---

## cashierAuthService.ts

PIN-based cashier terminal authentication (separate from ERP user login).

```ts
// Get list of available cashiers for the terminal
getCashiers(): Promise<Cashier[]>

// Validate a PIN for a given cashier
validatePIN(cashierId: string, pin: string): Promise<boolean>

// Record successful login event
recordLogin(cashierId: string): Promise<void>
```

**Cashier roles**:
- `cashier` — Standard POS operations
- `senior_cashier` — Can apply higher discounts
- `manager` — Can approve overrides, access reports

---

## tableService.ts

Restaurant table management (only active in restaurant mode).

```ts
// Get all tables (optionally filtered by section/status)
getTables(sectionId?: string): Promise<RestaurantTable[]>

// Mark table as occupied with guest count
occupyTable(tableId: string, guestCount: number): Promise<void>

// Release table back to available
releaseTable(tableId: string): Promise<void>

// Update running total on table
updateTableTotal(tableId: string, total: number): Promise<void>
```

**Table statuses**: `available`, `occupied`, `reserved`

---

## kitchenService.ts

Kitchen Display System (KDS) integration.

```ts
// Send items from a course to the kitchen
sendToKitchen(ticket: KitchenTicket): Promise<void>

// Get all active (unprepared) kitchen tickets
getActiveTickets(): Promise<KitchenTicket[]>

// Mark a ticket/item as prepared
markTicketComplete(ticketId: string): Promise<void>
```

---

## offlineService.ts

IndexedDB-backed offline persistence layer using the `idb` library.

```ts
// Save product catalog for offline use
cacheProducts(products: Product[]): Promise<void>

// Get cached products
getCachedProducts(): Promise<Product[]>

// Queue a transaction for later sync
queueTransaction(order: OrderPayload): Promise<string> // returns queue ID

// Get all queued transactions
getQueuedTransactions(): Promise<QueuedTransaction[]>

// Remove a transaction from queue after successful sync
dequeueTransaction(queueId: string): Promise<void>
```

**IndexedDB stores**:
- `products` — Cached product catalog
- `transactions` — Pending orders queue
- `metadata` — Last sync timestamps, version info

---

## syncService.ts

Orchestrates syncing queued offline transactions when back online.

```ts
// Attempt to sync all pending transactions
syncPendingTransactions(): Promise<SyncResult>

// Get current sync status
getSyncStatus(): { pending: number; failed: number; lastSync: string | null }
```

**Sync flow**:
1. `navigator.onLine` returns true
2. `useOfflineSync` hook triggers `syncPendingTransactions()`
3. Each queued transaction is submitted via `posService.submitOrder()`
4. On success: removed from queue, `pendingCount` decremented
5. On failure: marked as failed, `failedCount` incremented
6. Store updated with final counts and `lastCacheSync` timestamp

---

## Migrating to Real APIs

When the backend is ready:

1. Replace mock data in each service with actual HTTP calls:
   ```ts
   // Before (mock)
   await new Promise(resolve => setTimeout(resolve, 200));
   return mockProducts;

   // After (real)
   const { data } = await axios.get<Product[]>("/api/products");
   return data;
   ```

2. Add authentication headers from `AuthContext`
3. Handle API errors with proper error types from `types/api.ts`
4. Use `TanStack Query` for caching and background refetch where appropriate
5. Set `VITE_API_URL` in `.env`
