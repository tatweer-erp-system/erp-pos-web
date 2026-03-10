# POS Hooks

Custom React hooks that encapsulate POS business logic and connect UI components to the store and services.

---

## useCart.ts

Provides cart operations and computed cart totals.

**Wraps**: `posStore` cart state + computed helpers

```ts
const {
  cartItems,
  addToCart,
  removeFromCart,
  updateQuantity,
  setItemDiscount,
  clearCart,
  subtotal,
  grandTotal,
  // ... other computed values
} = useCart();
```

**Key behaviors**:
- Adding an existing product increments quantity instead of duplicating
- Quantity set to 0 automatically removes the item
- Line-item discounts are per-item overrides (not the order-level discount)

---

## useCheckout.ts

Handles the full order submission flow, including online and offline paths.

```ts
const { checkout, isLoading, error } = useCheckout();

// Call when customer confirms payment
await checkout();
```

**Flow**:
1. Validates cart is not empty and payment is complete
2. Builds `OrderPayload` from posStore state
3. If online: calls `posService.submitOrder()` → sets `completedOrder`
4. If offline: calls `offlineService.queueTransaction()` → shows queued confirmation
5. On success: clears cart, resets payment state, updates customer loyalty points
6. On failure: shows error message, leaves cart intact for retry

---

## useProducts.ts

Manages product catalog loading and filtering.

```ts
const {
  products,
  categories,
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
  isLoading,
} = useProducts();
```

**Features**:
- Loads products from `posService.getProducts()` on mount
- Falls back to `offlineService.getCachedProducts()` when offline
- Client-side filtering by category and search query
- Barcode lookup: `getProductByBarcode(barcode)` triggers a scan event

---

## useOfflineSync.ts

Orchestrates automatic syncing of queued transactions when the device comes back online.

```ts
// Used internally by POSPage — no need to call manually
useOfflineSync();
```

**Behavior**:
- Listens to `window` online/offline events
- Updates `posStore.isOnline` accordingly
- When `isOnline` transitions from false → true: triggers `syncService.syncPendingTransactions()`
- Updates `pendingCount`, `failedCount`, `isSyncing`, `lastCacheSync` in posStore
- Also periodically refreshes product cache based on `cacheRefreshInterval` setting

---

## useRestaurantMode.ts

Provides restaurant-mode feature flags and table/course state.

```ts
const {
  isRestaurantMode,
  tableManagementEnabled,
  courseManagementEnabled,
  kitchenPrintingEnabled,
  attachedTable,
  guestCount,
} = useRestaurantMode();
```

**Use this hook** in components that conditionally render restaurant-specific UI to avoid accessing posStore directly.

---

## Adding New Hooks

When adding a new hook to this module:

1. Create file as `useFeatureName.ts` in this directory
2. Keep hooks focused — one concern per hook
3. If it accesses posStore, import `usePOSStore` and select only needed slices
4. If it calls a service, handle loading and error states locally
5. Export a single named function (no default exports)
6. Document with a JSDoc comment above the function signature
