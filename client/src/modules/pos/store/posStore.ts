import { create } from "zustand";
import type { Product } from "../data/mockProducts";
import type { OrderResult } from "../services/posService";
import type { Customer } from "../data/mockCustomers";
import { getTier, DEFAULT_EARN_RATIO, DEFAULT_REDEEM_RATIO } from "../data/mockCustomers";
import type { CashierRole } from "../services/cashierAuthService";
import type { RestaurantTable } from "../data/mockRestaurant";

export type PaymentMethod = "cash" | "card" | "split";
export type DiscountType = "percent" | "fixed";

export interface LineDiscount {
  type: DiscountType;
  value: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  /** Per-item discount applied to this line */
  lineDiscount?: LineDiscount;
  /** Restaurant: course assignment (courseId) */
  course?: string;
  /** Restaurant: kitchen special note */
  note?: string;
}

/** Compute the discounted line total for a single cart item */
export function getLineTotal(item: CartItem): number {
  const raw = item.product.price * item.quantity;
  if (!item.lineDiscount || item.lineDiscount.value === 0) return raw;
  if (item.lineDiscount.type === "percent")
    return raw * (1 - item.lineDiscount.value / 100);
  return Math.max(0, raw - item.lineDiscount.value);
}

export interface Discount {
  type: DiscountType;
  value: number;
}

export const TAX_RATE = 0.15; // 15% VAT

export interface HeldOrder {
  id: string;
  items: CartItem[];
  customer: Customer | null;
  savedAt: string;
}

// ── Voucher / Gift Card applied to cart ──────────────────────────────────────
export interface AppliedVoucher {
  code: string;
  discountType: "percent" | "fixed";
  discountValue: number;
  description: string;
  /** Pre-computed discount amount in currency, set at apply time */
  discountAmount: number;
}

export interface AppliedGiftCard {
  code: string;
  availableBalance: number;
  /** How much of this card is being used for this sale */
  amountUsed: number;
}

// ── Cashier session ───────────────────────────────────────────────────────────
export interface CashierSession {
  cashierId: string;
  cashierName: string;
  cashierRole: CashierRole;
  loginTime: Date;
  isLocked: boolean;
}

// ── Cash drawer movement ──────────────────────────────────────────────────────
export interface CashMovement {
  id: string;
  type: "in" | "out";
  amount: number;
  reason: string;
  note: string;
  timestamp: Date;
  cashierName: string;
}

// ── Manager override log entry ────────────────────────────────────────────────
export interface OverrideRecord {
  id: string;
  managerName: string;
  reason: string;
  action: string;
  timestamp: Date;
}

// ── POS session settings ──────────────────────────────────────────────────────
export interface POSSessionSettings {
  /** Minutes of inactivity before auto-lock. 0 = disabled */
  inactivityLockMinutes: number;
  requireManagerForRefunds: boolean;
  /** If manual discount % exceeds this, manager override is required. 0 = disabled */
  requireManagerForDiscountsAbove: number;
  maxPINAttempts: number;
}

// ── Per-order state snapshot ──────────────────────────────────────────────────
export interface OrderTab {
  id: string;
  cartItems: CartItem[];
  attachedCustomer: Customer | null;
  redeemPoints: number;
  appliedVoucher: AppliedVoucher | null;
  appliedGiftCards: AppliedGiftCard[];
  paymentMethod: PaymentMethod;
  cashGiven: number;
  cardRef: string;
  splitCash: number;
  splitCard: number;
  splitCardRef: string;
  discount: Discount;
  /** Order-level note visible on receipt and kitchen ticket */
  orderNote: string;
  /** Tip / gratuity amount added on top of amountDue */
  tipAmount: number;
  /** Restaurant: table attached to this order */
  attachedTable: RestaurantTable | null;
  /** Restaurant: number of guests at this table */
  guestCount: number;
}

export function createEmptyOrder(id?: string): OrderTab {
  return {
    id: id ?? `order-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    cartItems: [],
    attachedCustomer: null,
    redeemPoints: 0,
    appliedVoucher: null,
    appliedGiftCards: [],
    paymentMethod: "cash",
    cashGiven: 0,
    cardRef: "",
    splitCash: 0,
    splitCard: 0,
    splitCardRef: "",
    discount: { type: "percent", value: 0 },
    orderNote: "",
    tipAmount: 0,
    attachedTable: null,
    guestCount: 1,
  };
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Extract the flat-state fields for the active order from a full order tab */
function flatFromOrder(order: OrderTab): Partial<POSState> {
  return {
    cartItems: order.cartItems,
    attachedCustomer: order.attachedCustomer,
    redeemPoints: order.redeemPoints,
    appliedVoucher: order.appliedVoucher,
    appliedGiftCards: order.appliedGiftCards,
    paymentMethod: order.paymentMethod,
    cashGiven: order.cashGiven,
    cardRef: order.cardRef,
    splitCash: order.splitCash,
    splitCard: order.splitCard,
    splitCardRef: order.splitCardRef,
    discount: order.discount,
    orderNote: order.orderNote,
    tipAmount: order.tipAmount,
    attachedTable: order.attachedTable,
    guestCount: order.guestCount,
  };
}

/** Write the current flat-state back into orders[idx] */
function syncOrder(state: POSState, idx: number, patch: Partial<OrderTab>): OrderTab[] {
  const newOrders = [...state.orders];
  newOrders[idx] = { ...newOrders[idx], ...patch };
  return newOrders;
}

/** Merge multiple CartItem arrays, summing quantities for duplicate products */
function mergeCartItems(arrays: CartItem[][]): CartItem[] {
  const map = new Map<string, CartItem>();
  for (const items of arrays) {
    for (const item of items) {
      const existing = map.get(item.product.id);
      if (existing) {
        map.set(item.product.id, { ...existing, quantity: existing.quantity + item.quantity });
      } else {
        map.set(item.product.id, { ...item });
      }
    }
  }
  return Array.from(map.values());
}

// ── Store interface ───────────────────────────────────────────────────────────

interface POSState {
  // ── Multi-order ───────────────────────────────────────────────────────────
  /** Snapshots of all open order tabs (always kept in sync with flat state) */
  orders: OrderTab[];
  /** Index of the currently active tab */
  activeOrderIndex: number;
  /** Maximum tabs allowed (configurable from Settings) */
  maxOrders: number;

  addOrder: () => void;
  removeOrder: (index: number) => void;
  switchOrder: (index: number) => void;
  /** Merge selected order indices into one tab */
  mergeOrders: (indices: number[], keepCustomerFromIndex?: number) => void;
  /** Restore orders from sessionStorage on mount */
  restoreOrders: (orders: OrderTab[], activeIndex: number) => void;
  setMaxOrders: (n: number) => void;

  // ── Cart ──────────────────────────────────────────────────────────────────
  cartItems: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  setItemDiscount: (productId: string, discount: LineDiscount | undefined) => void;
  clearCart: () => void;

  // ── Customer ──────────────────────────────────────────────────────────────
  attachedCustomer: Customer | null;
  setAttachedCustomer: (customer: Customer | null) => void;

  // ── Loyalty redemption ────────────────────────────────────────────────────
  redeemPoints: number;
  setRedeemPoints: (points: number) => void;

  // ── Voucher ───────────────────────────────────────────────────────────────
  appliedVoucher: AppliedVoucher | null;
  setAppliedVoucher: (v: AppliedVoucher | null) => void;

  // ── Gift Cards ────────────────────────────────────────────────────────────
  appliedGiftCards: AppliedGiftCard[];
  addGiftCard: (gc: AppliedGiftCard) => void;
  removeGiftCard: (code: string) => void;

  // ── Payment ───────────────────────────────────────────────────────────────
  paymentMethod: PaymentMethod;
  setPaymentMethod: (method: PaymentMethod) => void;
  cashGiven: number;
  setCashGiven: (amount: number) => void;
  cardRef: string;
  setCardRef: (ref: string) => void;
  splitCash: number;
  setSplitCash: (amount: number) => void;
  splitCard: number;
  setSplitCard: (amount: number) => void;
  splitCardRef: string;
  setSplitCardRef: (ref: string) => void;

  // ── Order note ────────────────────────────────────────────────────────────
  orderNote: string;
  setOrderNote: (note: string) => void;

  // ── Tip / gratuity ────────────────────────────────────────────────────────
  tipAmount: number;
  setTip: (amount: number) => void;

  // ── Discount ──────────────────────────────────────────────────────────────
  discount: Discount;
  setDiscount: (discount: Discount) => void;

  // ── Hold orders ───────────────────────────────────────────────────────────
  heldOrders: HeldOrder[];
  holdOrder: () => void;
  resumeOrder: (id: string) => void;

  // ── Cashier session ───────────────────────────────────────────────────────
  cashierSession: CashierSession | null;
  setCashierSession: (session: CashierSession | null) => void;
  lockSession: () => void;
  unlockSession: () => void;

  // ── Cash drawer ───────────────────────────────────────────────────────────
  openingFloat: number;
  setOpeningFloat: (n: number) => void;
  cashMovements: CashMovement[];
  addCashMovement: (m: Omit<CashMovement, "id">) => void;
  cashDrawerTotal: () => number;

  // ── Override log ──────────────────────────────────────────────────────────
  overrideLog: OverrideRecord[];
  addOverrideLog: (r: Omit<OverrideRecord, "id">) => void;
  /** Granted for the lifetime of the current order tab when manager approves discount */
  discountOverrideGranted: boolean;
  setDiscountOverrideGranted: (v: boolean) => void;

  // ── POS session settings ──────────────────────────────────────────────────
  posSessionSettings: POSSessionSettings;
  setPOSSessionSettings: (s: Partial<POSSessionSettings>) => void;

  // ── Completed order (for receipt) ─────────────────────────────────────────
  completedOrder: OrderResult | null;
  setCompletedOrder: (order: OrderResult | null) => void;

  // ── Offline mode ──────────────────────────────────────────────────────────
  isOnline: boolean;
  setIsOnline: (v: boolean) => void;
  offlineModeEnabled: boolean;
  setOfflineModeEnabled: (v: boolean) => void;
  cacheRefreshInterval: 15 | 30 | 60 | 0;
  setCacheRefreshInterval: (v: 15 | 30 | 60 | 0) => void;
  lastCacheSync: string | null;
  setLastCacheSync: (t: string | null) => void;
  pendingCount: number;
  setPendingCount: (n: number) => void;
  failedCount: number;
  setFailedCount: (n: number) => void;
  isSyncing: boolean;
  setIsSyncing: (v: boolean) => void;

  // ── Restaurant — attached table ───────────────────────────────────────────
  attachedTable: RestaurantTable | null;
  setAttachedTable: (table: RestaurantTable | null) => void;
  guestCount: number;
  setGuestCount: (n: number) => void;
  setItemCourse: (productId: string, courseId: string) => void;
  setItemNote: (productId: string, note: string) => void;

  // ── Restaurant — settings ─────────────────────────────────────────────────
  restaurantMode: boolean;
  setRestaurantMode: (v: boolean) => void;
  tableManagementEnabled: boolean;
  setTableManagementEnabled: (v: boolean) => void;
  courseManagementEnabled: boolean;
  setCourseManagementEnabled: (v: boolean) => void;
  kitchenPrintingEnabled: boolean;
  setKitchenPrintingEnabled: (v: boolean) => void;
  autoSendKitchen: boolean;
  setAutoSendKitchen: (v: boolean) => void;
  allowTakeAway: boolean;
  setAllowTakeAway: (v: boolean) => void;
  defaultGuests: number;
  setDefaultGuests: (n: number) => void;

  // ── Computed helpers ──────────────────────────────────────────────────────
  subtotal: () => number;
  discountAmount: () => number;
  /** Monetary value of redeemed loyalty points */
  redemptionDiscount: () => number;
  /** Voucher discount applied pre-tax */
  voucherDiscount: () => number;
  taxAmount: () => number;
  /** Grand total before gift card offset */
  grandTotal: () => number;
  /** Sum of all applied gift card amounts (post-tax offset) */
  giftCardDiscount: () => number;
  /** Final amount the customer owes after gift cards (before tip) */
  amountDue: () => number;
  /** Total the customer actually pays including tip */
  finalTotal: () => number;
  change: () => number;
  /** Points customer will earn from this sale */
  pointsEarned: () => number;
  /** Earn ratio for the attached customer's tier */
  earnRatio: () => number;
  /** Redeem ratio for the attached customer's tier */
  redeemRatio: () => number;
}

// ── Store implementation ──────────────────────────────────────────────────────

const INITIAL_ORDER = createEmptyOrder("order-1");

export const usePOSStore = create<POSState>()((set, get) => ({
  // ── Multi-order ───────────────────────────────────────────────────────────
  orders: [INITIAL_ORDER],
  activeOrderIndex: 0,
  maxOrders: 5,

  addOrder() {
    set((state) => {
      if (state.orders.length >= state.maxOrders) return state;
      const newOrder = createEmptyOrder();
      const newOrders = [...state.orders, newOrder];
      return {
        orders: newOrders,
        activeOrderIndex: newOrders.length - 1,
        ...flatFromOrder(newOrder),
      };
    });
  },

  removeOrder(index) {
    set((state) => {
      if (state.orders.length <= 1) return state;
      const newOrders = state.orders.filter((_, i) => i !== index);
      let newActive = state.activeOrderIndex;
      if (index < state.activeOrderIndex) newActive--;
      else if (index === state.activeOrderIndex) newActive = Math.max(0, index - 1);
      newActive = Math.min(newActive, newOrders.length - 1);
      const target = newOrders[newActive];
      return {
        orders: newOrders,
        activeOrderIndex: newActive,
        ...flatFromOrder(target),
      };
    });
  },

  switchOrder(index) {
    set((state) => {
      if (index === state.activeOrderIndex) return state;
      const target = state.orders[index];
      if (!target) return state;
      return {
        activeOrderIndex: index,
        ...flatFromOrder(target),
      };
    });
  },

  mergeOrders(indices, keepCustomerFromIndex) {
    set((state) => {
      if (indices.length < 2) return state;
      const toMerge = indices.map((i) => state.orders[i]);
      const mergedItems = mergeCartItems(toMerge.map((o) => o.cartItems));

      // Resolve customer
      let customer: Customer | null = null;
      if (keepCustomerFromIndex !== undefined) {
        customer = toMerge[keepCustomerFromIndex]?.attachedCustomer ?? null;
      } else {
        customer = toMerge.find((o) => o.attachedCustomer)?.attachedCustomer ?? null;
      }

      const mergedOrder: OrderTab = {
        ...createEmptyOrder(),
        cartItems: mergedItems,
        attachedCustomer: customer,
      };

      // Remove all selected orders, insert merged at the first selected slot
      const sortedIndices = [...indices].sort((a, b) => a - b);
      const insertAt = sortedIndices[0];
      const newOrders = state.orders.filter((_, i) => !indices.includes(i));
      newOrders.splice(insertAt, 0, mergedOrder);

      const newActive = Math.min(insertAt, newOrders.length - 1);
      return {
        orders: newOrders,
        activeOrderIndex: newActive,
        ...flatFromOrder(newOrders[newActive]),
      };
    });
  },

  restoreOrders(orders, activeIndex) {
    const validIndex = Math.min(activeIndex, orders.length - 1);
    const target = orders[validIndex];
    set({
      orders,
      activeOrderIndex: validIndex,
      ...flatFromOrder(target),
    });
  },

  setMaxOrders(n) {
    set({ maxOrders: Math.min(10, Math.max(1, n)) });
  },

  // ── Cart ──────────────────────────────────────────────────────────────────
  cartItems: INITIAL_ORDER.cartItems,

  addToCart(product) {
    set((state) => {
      const idx = state.activeOrderIndex;
      const existing = state.cartItems.find((i) => i.product.id === product.id);
      const newCartItems = existing
        ? state.cartItems.map((i) =>
            i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
          )
        : [...state.cartItems, { product, quantity: 1 }];
      return {
        cartItems: newCartItems,
        orders: syncOrder(state, idx, { cartItems: newCartItems }),
      };
    });
  },

  removeFromCart(productId) {
    set((state) => {
      const idx = state.activeOrderIndex;
      const newCartItems = state.cartItems.filter((i) => i.product.id !== productId);
      return {
        cartItems: newCartItems,
        orders: syncOrder(state, idx, { cartItems: newCartItems }),
      };
    });
  },

  updateQuantity(productId, quantity) {
    if (quantity <= 0) {
      get().removeFromCart(productId);
      return;
    }
    set((state) => {
      const idx = state.activeOrderIndex;
      const newCartItems = state.cartItems.map((i) =>
        i.product.id === productId ? { ...i, quantity } : i
      );
      return {
        cartItems: newCartItems,
        orders: syncOrder(state, idx, { cartItems: newCartItems }),
      };
    });
  },

  setItemDiscount(productId, discount) {
    set((state) => {
      const idx = state.activeOrderIndex;
      const newCartItems = state.cartItems.map((i) =>
        i.product.id === productId ? { ...i, lineDiscount: discount } : i
      );
      return {
        cartItems: newCartItems,
        orders: syncOrder(state, idx, { cartItems: newCartItems }),
      };
    });
  },

  clearCart() {
    const empty = createEmptyOrder();
    set((state) => {
      const idx = state.activeOrderIndex;
      const clearedOrder: OrderTab = { ...empty, id: state.orders[idx].id };
      return {
        cartItems: [],
        attachedCustomer: null,
        redeemPoints: 0,
        appliedVoucher: null,
        appliedGiftCards: [],
        discount: { type: "percent", value: 0 },
        paymentMethod: "cash",
        cashGiven: 0,
        cardRef: "",
        splitCash: 0,
        splitCard: 0,
        splitCardRef: "",
        discountOverrideGranted: false,
        orderNote: "",
        tipAmount: 0,
        attachedTable: null,
        guestCount: 1,
        orders: syncOrder(state, idx, clearedOrder),
      };
    });
  },

  // ── Customer ──────────────────────────────────────────────────────────────
  attachedCustomer: INITIAL_ORDER.attachedCustomer,

  setAttachedCustomer(customer) {
    set((state) => ({
      attachedCustomer: customer,
      redeemPoints: 0,
      orders: syncOrder(state, state.activeOrderIndex, { attachedCustomer: customer, redeemPoints: 0 }),
    }));
  },

  // ── Loyalty redemption ────────────────────────────────────────────────────
  redeemPoints: 0,

  setRedeemPoints(points) {
    const { attachedCustomer } = get();
    const maxPoints = attachedCustomer?.loyaltyPoints ?? 0;
    const clamped = Math.max(0, Math.min(Math.floor(points), maxPoints));
    set((state) => ({
      redeemPoints: clamped,
      orders: syncOrder(state, state.activeOrderIndex, { redeemPoints: clamped }),
    }));
  },

  // ── Voucher ───────────────────────────────────────────────────────────────
  appliedVoucher: null,

  setAppliedVoucher(v) {
    set((state) => ({
      appliedVoucher: v,
      orders: syncOrder(state, state.activeOrderIndex, { appliedVoucher: v }),
    }));
  },

  // ── Gift Cards ────────────────────────────────────────────────────────────
  appliedGiftCards: [],

  addGiftCard(gc) {
    set((state) => {
      if (state.appliedGiftCards.some((c) => c.code === gc.code)) return state;
      const newCards = [...state.appliedGiftCards, gc];
      return {
        appliedGiftCards: newCards,
        orders: syncOrder(state, state.activeOrderIndex, { appliedGiftCards: newCards }),
      };
    });
  },

  removeGiftCard(code) {
    set((state) => {
      const newCards = state.appliedGiftCards.filter((c) => c.code !== code);
      return {
        appliedGiftCards: newCards,
        orders: syncOrder(state, state.activeOrderIndex, { appliedGiftCards: newCards }),
      };
    });
  },

  // ── Payment ───────────────────────────────────────────────────────────────
  paymentMethod: "cash",
  setPaymentMethod(method) {
    set((state) => ({
      paymentMethod: method,
      orders: syncOrder(state, state.activeOrderIndex, { paymentMethod: method }),
    }));
  },

  cashGiven: 0,
  setCashGiven(amount) {
    set((state) => ({
      cashGiven: amount,
      orders: syncOrder(state, state.activeOrderIndex, { cashGiven: amount }),
    }));
  },

  cardRef: "",
  setCardRef(ref) {
    set((state) => ({
      cardRef: ref,
      orders: syncOrder(state, state.activeOrderIndex, { cardRef: ref }),
    }));
  },

  splitCash: 0,
  setSplitCash(amount) {
    set((state) => ({
      splitCash: amount,
      orders: syncOrder(state, state.activeOrderIndex, { splitCash: amount }),
    }));
  },

  splitCard: 0,
  setSplitCard(amount) {
    set((state) => ({
      splitCard: amount,
      orders: syncOrder(state, state.activeOrderIndex, { splitCard: amount }),
    }));
  },

  splitCardRef: "",
  setSplitCardRef(ref) {
    set((state) => ({
      splitCardRef: ref,
      orders: syncOrder(state, state.activeOrderIndex, { splitCardRef: ref }),
    }));
  },

  // ── Order note ────────────────────────────────────────────────────────────
  orderNote: INITIAL_ORDER.orderNote,

  setOrderNote(note) {
    set((state) => ({
      orderNote: note,
      orders: syncOrder(state, state.activeOrderIndex, { orderNote: note }),
    }));
  },

  // ── Tip / gratuity ────────────────────────────────────────────────────────
  tipAmount: INITIAL_ORDER.tipAmount,

  setTip(amount) {
    set((state) => ({
      tipAmount: amount,
      orders: syncOrder(state, state.activeOrderIndex, { tipAmount: amount }),
    }));
  },

  // ── Discount ──────────────────────────────────────────────────────────────
  discount: { type: "percent", value: 0 },

  setDiscount(discount) {
    set((state) => ({
      discount,
      orders: syncOrder(state, state.activeOrderIndex, { discount }),
    }));
  },

  // ── Hold ──────────────────────────────────────────────────────────────────
  heldOrders: [],

  holdOrder() {
    const { cartItems, attachedCustomer } = get();
    if (cartItems.length === 0) return;
    const heldOrder: HeldOrder = {
      id: `hold-${Date.now()}`,
      items: cartItems,
      customer: attachedCustomer,
      savedAt: new Date().toLocaleTimeString(),
    };
    set((state) => ({ heldOrders: [...state.heldOrders, heldOrder] }));
    get().clearCart();
  },

  resumeOrder(id) {
    const { heldOrders } = get();
    const order = heldOrders.find((o) => o.id === id);
    if (!order) return;
    set((state) => ({
      cartItems: order.items,
      attachedCustomer: order.customer,
      redeemPoints: 0,
      appliedVoucher: null,
      appliedGiftCards: [],
      heldOrders: heldOrders.filter((o) => o.id !== id),
      orders: syncOrder(state, state.activeOrderIndex, {
        cartItems: order.items,
        attachedCustomer: order.customer,
        redeemPoints: 0,
        appliedVoucher: null,
        appliedGiftCards: [],
      }),
    }));
  },

  // ── Cashier session ───────────────────────────────────────────────────────
  cashierSession: (() => {
    try {
      const stored = localStorage.getItem("pos-cashier-session");
      if (!stored) return null;
      const s = JSON.parse(stored) as CashierSession;
      return { ...s, loginTime: new Date(s.loginTime) };
    } catch { return null; }
  })(),

  setCashierSession(session) {
    if (session) localStorage.setItem("pos-cashier-session", JSON.stringify(session));
    else localStorage.removeItem("pos-cashier-session");
    set({ cashierSession: session });
  },

  lockSession() {
    set((state) => {
      const updated = state.cashierSession ? { ...state.cashierSession, isLocked: true } : null;
      if (updated) localStorage.setItem("pos-cashier-session", JSON.stringify(updated));
      return { cashierSession: updated };
    });
  },

  unlockSession() {
    set((state) => {
      const updated = state.cashierSession ? { ...state.cashierSession, isLocked: false } : null;
      if (updated) localStorage.setItem("pos-cashier-session", JSON.stringify(updated));
      return { cashierSession: updated };
    });
  },

  // ── Cash drawer ───────────────────────────────────────────────────────────
  openingFloat: 0,
  setOpeningFloat: (n) => set({ openingFloat: n }),
  cashMovements: [],

  addCashMovement(m) {
    set((state) => ({
      cashMovements: [
        ...state.cashMovements,
        { ...m, id: `cm-${Date.now()}` },
      ],
    }));
  },

  cashDrawerTotal() {
    const { openingFloat, cashMovements } = get();
    return cashMovements.reduce(
      (total, m) => (m.type === "in" ? total + m.amount : total - m.amount),
      openingFloat
    );
  },

  // ── Override log ──────────────────────────────────────────────────────────
  overrideLog: [],

  addOverrideLog(r) {
    set((state) => ({
      overrideLog: [...state.overrideLog, { ...r, id: `ovr-${Date.now()}` }],
    }));
  },

  discountOverrideGranted: false,
  setDiscountOverrideGranted: (v) => set({ discountOverrideGranted: v }),

  // ── Restaurant — attached table ───────────────────────────────────────────
  attachedTable: INITIAL_ORDER.attachedTable,

  setAttachedTable(table) {
    set((state) => ({
      attachedTable: table,
      guestCount: table ? state.guestCount : 1,
      orders: syncOrder(state, state.activeOrderIndex, { attachedTable: table }),
    }));
  },

  guestCount: INITIAL_ORDER.guestCount,

  setGuestCount(n) {
    set((state) => ({
      guestCount: n,
      orders: syncOrder(state, state.activeOrderIndex, { guestCount: n }),
    }));
  },

  setItemCourse(productId, courseId) {
    set((state) => {
      const idx = state.activeOrderIndex;
      const newCartItems = state.cartItems.map((i) =>
        i.product.id === productId ? { ...i, course: courseId } : i
      );
      return {
        cartItems: newCartItems,
        orders: syncOrder(state, idx, { cartItems: newCartItems }),
      };
    });
  },

  setItemNote(productId, note) {
    set((state) => {
      const idx = state.activeOrderIndex;
      const newCartItems = state.cartItems.map((i) =>
        i.product.id === productId ? { ...i, note } : i
      );
      return {
        cartItems: newCartItems,
        orders: syncOrder(state, idx, { cartItems: newCartItems }),
      };
    });
  },

  // ── Restaurant — settings ─────────────────────────────────────────────────
  restaurantMode: (() => {
    try {
      const v = localStorage.getItem("pos-restaurant-mode");
      return v === null ? true : v === "true";
    } catch { return true; }
  })(),
  setRestaurantMode: (v) => {
    try { localStorage.setItem("pos-restaurant-mode", String(v)); } catch { /* noop */ }
    set({ restaurantMode: v });
  },

  tableManagementEnabled: (() => {
    try {
      const v = localStorage.getItem("pos-restaurant-table-management");
      return v === null ? true : v === "true";
    } catch { return true; }
  })(),
  setTableManagementEnabled: (v) => {
    try { localStorage.setItem("pos-restaurant-table-management", String(v)); } catch { /* noop */ }
    set({ tableManagementEnabled: v });
  },

  courseManagementEnabled: (() => {
    try { return localStorage.getItem("pos-restaurant-course-management") === "true"; } catch { return false; }
  })(),
  setCourseManagementEnabled: (v) => {
    try { localStorage.setItem("pos-restaurant-course-management", String(v)); } catch { /* noop */ }
    set({ courseManagementEnabled: v });
  },

  kitchenPrintingEnabled: (() => {
    try { return localStorage.getItem("pos-restaurant-kitchen-printing") === "true"; } catch { return false; }
  })(),
  setKitchenPrintingEnabled: (v) => {
    try { localStorage.setItem("pos-restaurant-kitchen-printing", String(v)); } catch { /* noop */ }
    set({ kitchenPrintingEnabled: v });
  },

  autoSendKitchen: (() => {
    try { return localStorage.getItem("pos-restaurant-auto-send-kitchen") === "true"; } catch { return false; }
  })(),
  setAutoSendKitchen: (v) => {
    try { localStorage.setItem("pos-restaurant-auto-send-kitchen", String(v)); } catch { /* noop */ }
    set({ autoSendKitchen: v });
  },

  allowTakeAway: (() => {
    try {
      const v = localStorage.getItem("pos-restaurant-allow-takeaway");
      return v === null ? true : v === "true";
    } catch { return true; }
  })(),
  setAllowTakeAway: (v) => {
    try { localStorage.setItem("pos-restaurant-allow-takeaway", String(v)); } catch { /* noop */ }
    set({ allowTakeAway: v });
  },

  defaultGuests: (() => {
    try { return parseInt(localStorage.getItem("pos-restaurant-default-guests") ?? "2", 10); } catch { return 2; }
  })(),
  setDefaultGuests: (n) => {
    try { localStorage.setItem("pos-restaurant-default-guests", String(n)); } catch { /* noop */ }
    set({ defaultGuests: n });
  },

  // ── POS session settings ──────────────────────────────────────────────────
  posSessionSettings: {
    inactivityLockMinutes: 5,
    requireManagerForRefunds: false,
    requireManagerForDiscountsAbove: 20,
    maxPINAttempts: 3,
  },

  setPOSSessionSettings(s) {
    set((state) => ({ posSessionSettings: { ...state.posSessionSettings, ...s } }));
  },

  // ── Offline mode ──────────────────────────────────────────────────────────
  isOnline: typeof navigator !== "undefined" ? navigator.onLine : true,
  setIsOnline: (v) => set({ isOnline: v }),

  offlineModeEnabled: (() => {
    try { return localStorage.getItem("pos-offline-enabled") === "true"; } catch { return false; }
  })(),
  setOfflineModeEnabled: (v) => {
    try { localStorage.setItem("pos-offline-enabled", String(v)); } catch { /* noop */ }
    set({ offlineModeEnabled: v });
  },

  cacheRefreshInterval: (() => {
    try {
      const v = parseInt(localStorage.getItem("pos-cache-interval") ?? "60", 10);
      return ([15, 30, 60, 0] as const).includes(v as 15 | 30 | 60 | 0) ? (v as 15 | 30 | 60 | 0) : 60;
    } catch { return 60; }
  })(),
  setCacheRefreshInterval: (v) => {
    try { localStorage.setItem("pos-cache-interval", String(v)); } catch { /* noop */ }
    set({ cacheRefreshInterval: v });
  },

  lastCacheSync: (() => {
    try { return localStorage.getItem("pos-last-cache-sync"); } catch { return null; }
  })(),
  setLastCacheSync: (t) => {
    try {
      if (t) localStorage.setItem("pos-last-cache-sync", t);
      else localStorage.removeItem("pos-last-cache-sync");
    } catch { /* noop */ }
    set({ lastCacheSync: t });
  },

  pendingCount: 0,
  setPendingCount: (n) => set({ pendingCount: n }),
  failedCount: 0,
  setFailedCount: (n) => set({ failedCount: n }),
  isSyncing: false,
  setIsSyncing: (v) => set({ isSyncing: v }),

  // ── Completed order ───────────────────────────────────────────────────────
  completedOrder: null,
  setCompletedOrder: (order) => set({ completedOrder: order }),

  // ── Computed ──────────────────────────────────────────────────────────────
  subtotal() {
    return get().cartItems.reduce((sum, i) => sum + getLineTotal(i), 0);
  },

  discountAmount() {
    const { discount } = get();
    const sub = get().subtotal();
    if (discount.type === "percent") return (sub * discount.value) / 100;
    return Math.min(discount.value, sub);
  },

  earnRatio() {
    const { attachedCustomer } = get();
    if (!attachedCustomer) return DEFAULT_EARN_RATIO;
    return getTier(attachedCustomer.loyaltyPoints).earnRatio;
  },

  redeemRatio() {
    const { attachedCustomer } = get();
    if (!attachedCustomer) return DEFAULT_REDEEM_RATIO;
    return getTier(attachedCustomer.loyaltyPoints).redeemRatio;
  },

  redemptionDiscount() {
    const { redeemPoints } = get();
    if (redeemPoints <= 0) return 0;
    return redeemPoints * get().redeemRatio();
  },

  voucherDiscount() {
    const { appliedVoucher } = get();
    return appliedVoucher?.discountAmount ?? 0;
  },

  taxAmount() {
    const taxBase =
      get().subtotal() -
      get().discountAmount() -
      get().redemptionDiscount() -
      get().voucherDiscount();
    return Math.max(0, taxBase) * TAX_RATE;
  },

  grandTotal() {
    const taxBase =
      get().subtotal() -
      get().discountAmount() -
      get().redemptionDiscount() -
      get().voucherDiscount();
    return Math.max(0, taxBase) + get().taxAmount();
  },

  giftCardDiscount() {
    const { appliedGiftCards } = get();
    return appliedGiftCards.reduce((sum, gc) => sum + gc.amountUsed, 0);
  },

  amountDue() {
    return Math.max(0, get().grandTotal() - get().giftCardDiscount());
  },

  finalTotal() {
    return get().amountDue() + get().tipAmount;
  },

  pointsEarned() {
    const { attachedCustomer } = get();
    if (!attachedCustomer) return 0;
    return Math.floor(get().amountDue() * get().earnRatio());
  },

  change() {
    const { paymentMethod, cashGiven, splitCash } = get();
    const due = get().finalTotal();
    if (paymentMethod === "cash") return Math.max(0, cashGiven - due);
    if (paymentMethod === "split") return Math.max(0, splitCash - (due - get().splitCard));
    return 0;
  },
}));
