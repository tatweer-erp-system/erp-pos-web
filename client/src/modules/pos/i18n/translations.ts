type Fn1 = (a: string) => string;
type Fn2 = (a: number, b: number) => string;
type Fn1N = (a: number) => string;
type Fn1S = (a: string) => string;

interface POSTranslations {
  // Top bar
  backToERP: string;
  pointOfSale: string;
  cashIn: string;
  cashOut: string;
  recordCashIn: string;
  recordCashOut: string;
  issueGiftCard: string;
  checkBalance: string;
  loyaltyReport: string;
  noCashier: string;
  lockTerminal: string;
  cart: string;
  customerDisplay: string;
  fullscreen: string;
  exitFullscreen: string;
  // ProductGrid
  searchProducts: string;
  scanBarcode: string;
  noProductsFound: string;
  offlineShowingCache: string;
  // ProductCard
  outOfStock: string;
  low: string;
  addToCart: Fn1;
  // OrderTabsBar
  order: Fn1N;
  mergeOrders: string;
  newOrder: string;
  maxOrdersReached: Fn1N;
  mergeSelectedOrders: string;
  closeOrder: string;
  keep: string;
  closeThisOrder: string;
  orderHasItems: Fn2;
  // CartPanel
  yourCart: string;
  holdOrder: string;
  resumeOrder: string;
  resumeN: Fn1N;
  heldOrdersTooltip: Fn1N;
  clearCart: string;
  clearCartTooltip: string;
  clearCartConfirm: string;
  cancel: string;
  searchCustomer: string;
  loyaltyPoints: string;
  pointsRedeemed: Fn1N;
  voucher: string;
  discount: string;
  percent: string;
  fixed: string;
  subtotal: string;
  tax: string;
  giftCardLabel: Fn1N;
  orderTotal: string;
  grandTotal: string;
  total: string;
  amountDue: string;
  chargeButton: string;
  processing: string;
  emptyCart: string;
  emptyCartSub: string;
  managerOverrideMsg: Fn2;
  requestOverride: string;
  overrideGranted: string;
  // Payment
  cash: string;
  card: string;
  split: string;
  amountGiven: string;
  change: string;
  refTxnId: string;
  cashAmount: string;
  cardAmount: string;
  cardRef: string;
  splitMatch: string;
  splitRemaining: string;
  // LockScreen
  terminalLocked: string;
  reenterPIN: string;
  tooManyAttempts: string;
  incorrectPIN: string;
  managerRole: string;
  enterPIN: string;
  unlock: string;
  forgotPIN: string;
  // CheckBalanceModal
  checkGiftCardBalance: string;
  giftCardCode: string;
  check: string;
  close: string;
  balance: string;
  expires: string;
  validCard: string;
  cardNotFound: string;
  enterCodeToCheck: string;
  // IssueGiftCardModal
  newGiftCard: string;
  amount: string;
  recipientName: string;
  recipientPhone: string;
  issueCard: string;
  giftCardIssued: string;
  generatedCode: string;
  issuedTo: string;
  issueAnother: string;
  done: string;
  amountRequired: string;
  // CashInOutModal
  cashMovementIn: string;
  cashMovementOut: string;
  reason: string;
  note: string;
  noteOptional: string;
  recordMovement: string;
  cashInReasons: string[];
  cashOutReasons: string[];
  // ReceiptModal
  receipt: string;
  item: string;
  qty: string;
  price: string;
  itemTotal: string;
  payment: string;
  method: string;
  tendered: string;
  cashPlusCard: string;
  refTxn: string;
  voucherApplied: string;
  giftCard: string;
  pointsEarnedLabel: string;
  thankYou: string;
  printReceipt: string;
  newSale: string;
  // Offline / Sync
  offline: string;
  online: string;
  syncingN: Fn1N;
  offlineWithPending: Fn1N;
  offlineSavingLocally: string;
  syncStatus: string;
  statusPending: string;
  statusSyncing: string;
  statusSynced: string;
  statusFailed: string;
  allSynced: string;
  pendingAndFailed: (pending: number, failed: number) => string;
  queue: string;
  noTransactionsInQueue: string;
  viewSyncErrors: Fn1N;
  syncErrors: string;
  transactionsFailedToSync: Fn1N;
  noFailedTransactions: string;
  retryAllFailed: string;
  failedMarkedForRetry: string;
  failedToReset: string;
  attempts: Fn1N;
  // CustomerSearch
  searchCustomerPlaceholder: string;
  quickAddCustomer: string;
  addAndAttach: string;
  noCustomerFound: string;
  customerAttached: Fn1S;
  customerRemoved: string;
  detach: string;
  phone: string;
  email: string;
  // CustomerCard / Loyalty
  redeemLoyaltyPoints: string;
  loyaltyTooltip: string;
  pointsToUse: string;
  max: string;
  pointsWorth: (pts: number, val: string) => string;
  notEnoughPoints: string;
  redeem: string;
  stopRedeeming: string;
  // VoucherInput
  voucherCode: string;
  voucherCodePlaceholder: string;
  apply: string;
  remove: string;
  voucherAppliedSuccess: Fn1S;
  giftCardApplied: Fn1S;
  giftCardNotFound: string;
  voucherNotFound: string;
  addGiftCard: string;
  giftCardPlaceholder: string;
  // CartItem
  removeItem: string;
  editPrice: string;
  itemNote: string;
  itemNotePlaceholder: string;
  removeItemNote: string;
  allergyFlag: string;
  itemDiscount: string;
  removeDiscount: string;
  // Order Note
  orderNote: string;
  addOrderNote: string;
  orderNotePlaceholder: string;
  // Tips / Gratuity
  tip: string;
  noTip: string;
  customTip: string;
  tipAdded: (amount: string) => string;
  // Refund
  refund: string;
  processRefund: string;
  receiptNumber: string;
  refundReason: string;
  fullRefund: string;
  partialRefund: string;
  refundAmount: string;
  refundMethod: string;
  refundSuccess: string;
  refundToOriginal: string;
  refundToCash: string;
  refundToCredit: string;
  refundReasons: string[];
  selectRefundReason: string;
  lookupReceipt: string;
  receiptNotFound: string;
  refundManagerRequired: string;
  // Exchange
  exchange: string;
  processExchange: string;
  itemsToReturn: string;
  newItems: string;
  exchangeDifference: string;
  collectAmount: string;
  creditAmount: string;
  evenExchange: string;
  exchangeSuccess: string;
  selectItemsToReturn: string;
  back: string;
  add: string;
  refundItemsLabel: string;
  customAmount: string;
  // Restaurant — Table Map
  tableMap: string;
  takeAway: string;
  allSections: string;
  noTablesFound: string;
  availableStatus: string;
  occupiedStatus: string;
  reservedStatus: string;
  tableCapacity: (n: number) => string;
  tableSeated: (dur: string) => string;
  tableGuests: (n: number) => string;
  openTable: string;
  resumeTableOrder: string;
  selectTable: string;
  // Restaurant — POS header
  tableAttached: (name: string) => string;
  transferTable: string;
  releaseTable: string;
  guestCount: string;
  // Restaurant — Split Bill
  splitBill: string;
  splitEqually: string;
  splitByItems: string;
  numberOfWays: string;
  amountPerPerson: string;
  processSplit: string;
  assignBill: string;
  bill: (n: number) => string;
  // Restaurant — Kitchen
  sendToKitchen: string;
  sentToKitchen: string;
  kitchenNote: string;
  // Restaurant — Courses
  assignCourse: string;
  noCourse: string;
  courseStarter: string;
  courseMain: string;
  courseDessert: string;
  fireCourse: (name: string) => string;
  courseStatusPending: string;
  courseStatusSent: string;
  courseStatusReady: string;
  courseStatusServed: string;
  fireAll: string;
  // Order Type
  dineIn: string;
  takeaway: string;
  delivery: string;
  // Walk-in Customer
  walkInCustomer: string;
  // Table Actions
  editGuests: string;
  guestsUpdated: string;
  tableReleased: string;
  confirmReleaseTable: string;
  reserveTable: string;
  tableReserved: string;
  cancelReservation: string;
  reservationCancelled: string;
  numberOfGuests: string;
  // Delivery
  deliveryAddress: string;
  deliveryAddressPlaceholder: string;
  deliveryFee: string;
  estimatedTime: string;
  minutes: string;
  // Misc
  confirm: string;
  save: string;
  edit: string;
  delete: string;
  yes: string;
  no: string;
}

const en: POSTranslations = {
  // Top bar
  backToERP: "Back to ERP",
  pointOfSale: "Point of Sale",
  cashIn: "Cash In",
  cashOut: "Cash Out",
  recordCashIn: "Record Cash In",
  recordCashOut: "Record Cash Out",
  issueGiftCard: "Issue Gift Card",
  checkBalance: "Check Balance",
  loyaltyReport: "Loyalty Report",
  noCashier: "No cashier",
  lockTerminal: "Lock terminal",
  cart: "Cart",
  customerDisplay: "Customer Display",
  fullscreen: "Fullscreen",
  exitFullscreen: "Exit Fullscreen",
  // ProductGrid
  searchProducts: "Search products by name or barcode...",
  scanBarcode: "Scan barcode",
  noProductsFound: "No products found",
  offlineShowingCache: "Offline — showing cached products",
  // ProductCard
  outOfStock: "Out of Stock",
  low: "Low",
  addToCart: (name) => `Add ${name} to cart`,
  // OrderTabsBar
  order: (n) => `Order #${n}`,
  mergeOrders: "Merge Orders",
  newOrder: "New Order",
  maxOrdersReached: (n) => `Maximum ${n} orders reached`,
  mergeSelectedOrders: "Merge selected orders into one",
  closeOrder: "Close Order",
  keep: "Keep",
  closeThisOrder: "Close this order?",
  orderHasItems: (n, count) =>
    `Order #${n} has ${count} item(s) in the cart. Closing it will discard all items.`,
  // CartPanel
  yourCart: "Your Cart",
  holdOrder: "Hold order",
  resumeOrder: "Resume",
  resumeN: (n) => `Resume #${n}`,
  heldOrdersTooltip: (n) => `${n} held order(s) — click to resume`,
  clearCart: "Clear",
  clearCartTooltip: "Clear cart",
  clearCartConfirm: "Clear all items from cart?",
  cancel: "Cancel",
  searchCustomer: "Search customer...",
  loyaltyPoints: "Loyalty Points",
  pointsRedeemed: (pts) => `Points Redeemed (${pts.toLocaleString()} pts)`,
  voucher: "Voucher",
  discount: "Discount",
  percent: "Percent",
  fixed: "Fixed",
  subtotal: "Subtotal",
  tax: "Tax",
  giftCardLabel: (n) => n > 1 ? `Gift Cards (×${n})` : "Gift Card",
  orderTotal: "Order Total",
  grandTotal: "Grand Total",
  total: "Total",
  amountDue: "Amount Due",
  chargeButton: "Charge",
  processing: "Processing...",
  emptyCart: "Cart is empty.",
  emptyCartSub: "Tap a product to add it.",
  managerOverrideMsg: (value, threshold) => `Requires manager approval (${value}% > ${threshold}%)`,
  requestOverride: "Request",
  overrideGranted: "Manager override granted",
  // Payment
  cash: "Cash",
  card: "Card",
  split: "Split",
  amountGiven: "Amount Given",
  change: "Change",
  refTxnId: "Reference / TXN ID",
  cashAmount: "Cash Amount",
  cardAmount: "Card Amount",
  cardRef: "Card Ref",
  splitMatch: "Split amounts match total",
  splitRemaining: "Remaining",
  // LockScreen
  terminalLocked: "Terminal Locked",
  reenterPIN: "Re-enter your PIN to unlock",
  tooManyAttempts: "Too many failed attempts. Please contact manager.",
  incorrectPIN: "Incorrect PIN",
  managerRole: "Manager",
  enterPIN: "Enter PIN",
  unlock: "Unlock",
  forgotPIN: "Forgot PIN?",
  // CheckBalanceModal
  checkGiftCardBalance: "Check Gift Card Balance",
  giftCardCode: "Gift Card Code",
  check: "Check",
  close: "Close",
  balance: "Balance",
  expires: "Expires",
  validCard: "Valid card",
  cardNotFound: "Card not found",
  enterCodeToCheck: "Enter a gift card code to check its balance",
  // IssueGiftCardModal
  newGiftCard: "New Gift Card",
  amount: "Amount",
  recipientName: "Recipient Name",
  recipientPhone: "Recipient Phone",
  issueCard: "Issue Card",
  giftCardIssued: "Gift Card Issued",
  generatedCode: "Generated Code",
  issuedTo: "Issued to",
  issueAnother: "Issue Another",
  done: "Done",
  amountRequired: "Amount is required",
  // CashInOutModal
  cashMovementIn: "Record Cash In",
  cashMovementOut: "Record Cash Out",
  reason: "Reason",
  note: "Note",
  noteOptional: "Note (optional)",
  recordMovement: "Record",
  cashInReasons: ["Opening Float", "Cash Advance", "Customer Refund", "Other"],
  cashOutReasons: ["Petty Cash", "Supplier Payment", "Expense", "Bank Deposit", "Other"],
  // ReceiptModal
  receipt: "Receipt",
  item: "Item",
  qty: "Qty",
  price: "Price",
  itemTotal: "Total",
  payment: "Payment",
  method: "Method",
  tendered: "Tendered",
  cashPlusCard: "Cash + Card",
  refTxn: "Ref / TXN",
  voucherApplied: "Voucher applied",
  giftCard: "Gift Card",
  pointsEarnedLabel: "Points earned this sale",
  thankYou: "Thank you for your purchase!",
  printReceipt: "Print Receipt",
  newSale: "New Sale",
  // Offline / Sync
  offline: "Offline",
  online: "Online",
  syncingN: (n) => `Syncing ${n} transaction${n !== 1 ? "s" : ""}...`,
  offlineWithPending: (n) => `You are offline — ${n} transaction${n !== 1 ? "s" : ""} saved locally, will sync when reconnected`,
  offlineSavingLocally: "You are offline — transactions are being saved locally",
  syncStatus: "Sync Status",
  statusPending: "Pending",
  statusSyncing: "Syncing",
  statusSynced: "Synced",
  statusFailed: "Failed",
  allSynced: "All transactions synced",
  pendingAndFailed: (pending, failed) => `${pending} pending, ${failed} failed`,
  queue: "Queue",
  noTransactionsInQueue: "No transactions in queue",
  viewSyncErrors: (n) => `View ${n} Sync Error${n !== 1 ? "s" : ""}`,
  syncErrors: "Sync Errors",
  transactionsFailedToSync: (n) => `${n} transaction${n !== 1 ? "s" : ""} failed to sync`,
  noFailedTransactions: "No failed transactions",
  retryAllFailed: "Retry All Failed",
  failedMarkedForRetry: "Failed transactions marked for retry — they will sync when online",
  failedToReset: "Failed to reset transactions",
  attempts: (n) => `${n} attempt${n !== 1 ? "s" : ""}`,
  // CustomerSearch
  searchCustomerPlaceholder: "Search by name or phone...",
  quickAddCustomer: "Quick Add Customer",
  addAndAttach: "Add & Attach",
  noCustomerFound: "No customer found",
  customerAttached: (name) => `${name} attached`,
  customerRemoved: "Customer removed",
  detach: "Detach",
  phone: "Phone",
  email: "Email",
  // CustomerCard / Loyalty
  redeemLoyaltyPoints: "Redeem Loyalty Points",
  loyaltyTooltip: "Use points as a discount",
  pointsToUse: "Points to use",
  max: "Max",
  pointsWorth: (pts, val) => `${pts.toLocaleString()} pts = ${val}`,
  notEnoughPoints: "Not enough points",
  redeem: "Redeem",
  stopRedeeming: "Stop Redeeming",
  // VoucherInput
  voucherCode: "Voucher Code",
  voucherCodePlaceholder: "Enter voucher code...",
  apply: "Apply",
  remove: "Remove",
  voucherAppliedSuccess: (code) => `Voucher ${code} applied`,
  giftCardApplied: (code) => `Gift card ${code} applied`,
  giftCardNotFound: "Gift card not found or expired",
  voucherNotFound: "Voucher not found or expired",
  addGiftCard: "Add Gift Card",
  giftCardPlaceholder: "Enter gift card code...",
  // CartItem
  removeItem: "Remove item",
  editPrice: "Edit price",
  itemNote: "Add note",
  itemNotePlaceholder: "e.g. no onions, extra sauce, allergy: nuts...",
  removeItemNote: "Remove note",
  allergyFlag: "⚠ Allergy",
  itemDiscount: "Item discount",
  removeDiscount: "Remove discount",
  // Order Note
  orderNote: "Order Note",
  addOrderNote: "Add order note",
  orderNotePlaceholder: "e.g. rush order, gift wrap, allergy alert...",
  // Tips / Gratuity
  tip: "Tip",
  noTip: "No Tip",
  customTip: "Custom",
  tipAdded: (amount) => `Tip added: ${amount}`,
  // Refund
  refund: "Refund",
  processRefund: "Process Refund",
  receiptNumber: "Receipt / Order #",
  refundReason: "Reason",
  fullRefund: "Full Refund",
  partialRefund: "Partial Refund",
  refundAmount: "Refund Amount",
  refundMethod: "Refund Method",
  refundSuccess: "Refund processed successfully",
  refundToOriginal: "Original payment method",
  refundToCash: "Cash",
  refundToCredit: "Store credit",
  refundReasons: ["Customer dissatisfied", "Wrong item", "Defective product", "Duplicate charge", "Other"],
  selectRefundReason: "Select a reason",
  lookupReceipt: "Look Up",
  receiptNotFound: "Receipt not found",
  refundManagerRequired: "Manager approval required for refunds",
  // Exchange
  exchange: "Exchange",
  processExchange: "Process Exchange",
  itemsToReturn: "Items to Return",
  newItems: "New Items",
  exchangeDifference: "Price Difference",
  collectAmount: "Collect from customer",
  creditAmount: "Credit to customer",
  evenExchange: "Even exchange — no payment needed",
  exchangeSuccess: "Exchange processed successfully",
  selectItemsToReturn: "Select items to return",
  back: "Back",
  add: "Add",
  refundItemsLabel: "Items to Refund",
  customAmount: "Custom amount",
  // Restaurant — Table Map
  tableMap: "Table Map",
  takeAway: "Take Away",
  allSections: "All Sections",
  noTablesFound: "No tables found",
  availableStatus: "Available",
  occupiedStatus: "Occupied",
  reservedStatus: "Reserved",
  tableCapacity: (n) => `${n} seats`,
  tableSeated: (dur) => `Seated ${dur} ago`,
  tableGuests: (n) => `${n} guest${n !== 1 ? "s" : ""}`,
  openTable: "Open Table",
  resumeTableOrder: "Resume Order",
  selectTable: "Select a table to begin",
  // Restaurant — POS header
  tableAttached: (name) => `Table ${name}`,
  transferTable: "Transfer Table",
  releaseTable: "Release Table",
  guestCount: "Guests",
  // Restaurant — Split Bill
  splitBill: "Split Bill",
  splitEqually: "Split Equally",
  splitByItems: "Split by Items",
  numberOfWays: "Number of ways",
  amountPerPerson: "Amount per person",
  processSplit: "Process Split",
  assignBill: "Assign to bill",
  bill: (n) => `Bill ${n}`,
  // Restaurant — Kitchen
  sendToKitchen: "Send to Kitchen",
  sentToKitchen: "Sent to kitchen",
  kitchenNote: "Kitchen note",
  // Restaurant — Courses
  assignCourse: "Course",
  noCourse: "No Course",
  courseStarter: "Starter",
  courseMain: "Main",
  courseDessert: "Dessert",
  fireCourse: (name) => `Fire ${name}`,
  courseStatusPending: "Pending",
  courseStatusSent: "Sent",
  courseStatusReady: "Ready",
  courseStatusServed: "Served",
  fireAll: "Fire All",
  // Order Type
  dineIn: "Dine-in",
  takeaway: "Takeaway",
  delivery: "Delivery",
  // Walk-in Customer
  walkInCustomer: "Walk-in Customer",
  // Table Actions
  editGuests: "Edit Guests",
  guestsUpdated: "Guest count updated",
  tableReleased: "Table released",
  confirmReleaseTable: "Release this table and clear the order?",
  reserveTable: "Reserve Table",
  tableReserved: "Table reserved",
  cancelReservation: "Cancel Reservation",
  reservationCancelled: "Reservation cancelled",
  numberOfGuests: "Number of guests",
  // Delivery
  deliveryAddress: "Delivery Address",
  deliveryAddressPlaceholder: "Enter delivery address...",
  deliveryFee: "Delivery Fee",
  estimatedTime: "Est. Time",
  minutes: "min",
  // Misc
  confirm: "Confirm",
  save: "Save",
  edit: "Edit",
  delete: "Delete",
  yes: "Yes",
  no: "No",
};

const ar: POSTranslations = {
  // Top bar
  backToERP: "العودة إلى النظام",
  pointOfSale: "نقطة البيع",
  cashIn: "إيداع نقدي",
  cashOut: "سحب نقدي",
  recordCashIn: "تسجيل إيداع نقدي",
  recordCashOut: "تسجيل سحب نقدي",
  issueGiftCard: "إصدار بطاقة هدية",
  checkBalance: "التحقق من الرصيد",
  loyaltyReport: "تقرير الولاء",
  noCashier: "لا يوجد كاشير",
  lockTerminal: "قفل الشاشة",
  cart: "السلة",
  customerDisplay: "شاشة العميل",
  fullscreen: "ملء الشاشة",
  exitFullscreen: "الخروج من ملء الشاشة",
  // ProductGrid
  searchProducts: "ابحث عن المنتجات بالاسم أو الباركود...",
  scanBarcode: "امسح الباركود",
  noProductsFound: "لا توجد منتجات",
  offlineShowingCache: "غير متصل — عرض المنتجات المخزنة",
  // ProductCard
  outOfStock: "نفد المخزون",
  low: "منخفض",
  addToCart: (name) => `أضف ${name} إلى السلة`,
  // OrderTabsBar
  order: (n) => `طلب #${n}`,
  mergeOrders: "دمج الطلبات",
  newOrder: "طلب جديد",
  maxOrdersReached: (n) => `الحد الأقصى ${n} طلبات`,
  mergeSelectedOrders: "دمج الطلبات المحددة في طلب واحد",
  closeOrder: "إغلاق الطلب",
  keep: "إبقاء",
  closeThisOrder: "إغلاق هذا الطلب؟",
  orderHasItems: (n, count) =>
    `الطلب #${n} يحتوي على ${count} عنصر. سيتم حذف جميع العناصر عند الإغلاق.`,
  // CartPanel
  yourCart: "السلة",
  holdOrder: "تعليق الطلب",
  resumeOrder: "استئناف",
  resumeN: (n) => `استئناف #${n}`,
  heldOrdersTooltip: (n) => `${n} طلب معلق — انقر للاستئناف`,
  clearCart: "مسح",
  clearCartTooltip: "مسح السلة",
  clearCartConfirm: "مسح جميع العناصر من السلة؟",
  cancel: "إلغاء",
  searchCustomer: "ابحث عن عميل...",
  loyaltyPoints: "نقاط الولاء",
  pointsRedeemed: (pts) => `نقاط مستردة (${pts.toLocaleString()} نقطة)`,
  voucher: "قسيمة",
  discount: "خصم",
  percent: "نسبة",
  fixed: "ثابت",
  subtotal: "المجموع الفرعي",
  tax: "الضريبة",
  giftCardLabel: (n) => n > 1 ? `بطاقات الهدايا (×${n})` : "بطاقة الهدية",
  orderTotal: "إجمالي الطلب",
  grandTotal: "الإجمالي الكلي",
  total: "الإجمالي",
  amountDue: "المبلغ المستحق",
  chargeButton: "تحصيل",
  processing: "جارٍ المعالجة...",
  emptyCart: "السلة فارغة.",
  emptyCartSub: "انقر على منتج لإضافته.",
  managerOverrideMsg: (value, threshold) => `يلزم موافقة المدير (${value}% > ${threshold}%)`,
  requestOverride: "طلب",
  overrideGranted: "تمت موافقة المدير",
  // Payment
  cash: "نقدي",
  card: "بطاقة",
  split: "مقسّم",
  amountGiven: "المبلغ المدفوع",
  change: "الباقي",
  refTxnId: "رقم المرجع / المعاملة",
  cashAmount: "مبلغ نقدي",
  cardAmount: "مبلغ البطاقة",
  cardRef: "مرجع البطاقة",
  splitMatch: "مبالغ التقسيم تتطابق مع الإجمالي",
  splitRemaining: "المتبقي",
  // LockScreen
  terminalLocked: "الشاشة مقفلة",
  reenterPIN: "أدخل رمز PIN للفتح",
  tooManyAttempts: "محاولات فاشلة كثيرة. يرجى التواصل مع المدير.",
  incorrectPIN: "رمز PIN غير صحيح",
  managerRole: "مدير",
  enterPIN: "أدخل الرمز",
  unlock: "فتح القفل",
  forgotPIN: "نسيت الرمز؟",
  // CheckBalanceModal
  checkGiftCardBalance: "التحقق من رصيد بطاقة الهدية",
  giftCardCode: "رمز بطاقة الهدية",
  check: "تحقق",
  close: "إغلاق",
  balance: "الرصيد",
  expires: "تنتهي في",
  validCard: "بطاقة صالحة",
  cardNotFound: "البطاقة غير موجودة",
  enterCodeToCheck: "أدخل رمز بطاقة الهدية للتحقق من رصيدها",
  // IssueGiftCardModal
  newGiftCard: "بطاقة هدية جديدة",
  amount: "المبلغ",
  recipientName: "اسم المستلم",
  recipientPhone: "هاتف المستلم",
  issueCard: "إصدار البطاقة",
  giftCardIssued: "تم إصدار بطاقة الهدية",
  generatedCode: "الرمز المُولَّد",
  issuedTo: "صادرة إلى",
  issueAnother: "إصدار بطاقة أخرى",
  done: "تم",
  amountRequired: "المبلغ مطلوب",
  // CashInOutModal
  cashMovementIn: "تسجيل إيداع نقدي",
  cashMovementOut: "تسجيل سحب نقدي",
  reason: "السبب",
  note: "ملاحظة",
  noteOptional: "ملاحظة (اختياري)",
  recordMovement: "تسجيل",
  cashInReasons: ["رصيد افتتاحي", "سلفة نقدية", "استرداد عميل", "أخرى"],
  cashOutReasons: ["مصروف صغير", "دفع مورد", "مصروف", "إيداع بنكي", "أخرى"],
  // ReceiptModal
  receipt: "إيصال",
  item: "المنتج",
  qty: "الكمية",
  price: "السعر",
  itemTotal: "الإجمالي",
  payment: "الدفع",
  method: "الطريقة",
  tendered: "المدفوع",
  cashPlusCard: "نقدي + بطاقة",
  refTxn: "المرجع / المعاملة",
  voucherApplied: "تم تطبيق القسيمة",
  giftCard: "بطاقة الهدية",
  pointsEarnedLabel: "النقاط المكتسبة في هذه العملية",
  thankYou: "شكراً لتسوقكم معنا!",
  printReceipt: "طباعة الإيصال",
  newSale: "عملية جديدة",
  // Offline / Sync
  offline: "غير متصل",
  online: "متصل",
  syncingN: (n) => `جارٍ مزامنة ${n} معاملة...`,
  offlineWithPending: (n) => `غير متصل — ${n} معاملة محفوظة محلياً، ستتم المزامنة عند الاتصال`,
  offlineSavingLocally: "غير متصل — يتم حفظ المعاملات محلياً",
  syncStatus: "حالة المزامنة",
  statusPending: "قيد الانتظار",
  statusSyncing: "جارٍ المزامنة",
  statusSynced: "تمت المزامنة",
  statusFailed: "فشلت",
  allSynced: "تمت مزامنة جميع المعاملات",
  pendingAndFailed: (pending, failed) => `${pending} قيد الانتظار، ${failed} فشلت`,
  queue: "قائمة الانتظار",
  noTransactionsInQueue: "لا توجد معاملات في قائمة الانتظار",
  viewSyncErrors: (n) => `عرض ${n} خطأ مزامنة`,
  syncErrors: "أخطاء المزامنة",
  transactionsFailedToSync: (n) => `${n} معاملة فشلت في المزامنة`,
  noFailedTransactions: "لا توجد معاملات فاشلة",
  retryAllFailed: "إعادة محاولة جميع الفاشلة",
  failedMarkedForRetry: "المعاملات الفاشلة معلّمة لإعادة المحاولة — ستتم المزامنة عند الاتصال",
  failedToReset: "فشل في إعادة تعيين المعاملات",
  attempts: (n) => `${n} محاولة`,
  // CustomerSearch
  searchCustomerPlaceholder: "ابحث بالاسم أو رقم الهاتف...",
  quickAddCustomer: "إضافة عميل سريعة",
  addAndAttach: "إضافة وربط",
  noCustomerFound: "لم يُعثر على عميل",
  customerAttached: (name) => `تم ربط ${name}`,
  customerRemoved: "تم إزالة العميل",
  detach: "فك الربط",
  phone: "الهاتف",
  email: "البريد الإلكتروني",
  // CustomerCard / Loyalty
  redeemLoyaltyPoints: "استرداد نقاط الولاء",
  loyaltyTooltip: "استخدم النقاط كخصم",
  pointsToUse: "النقاط المراد استخدامها",
  max: "الحد الأقصى",
  pointsWorth: (pts, val) => `${pts.toLocaleString()} نقطة = ${val}`,
  notEnoughPoints: "نقاط غير كافية",
  redeem: "استرداد",
  stopRedeeming: "إيقاف الاسترداد",
  // VoucherInput
  voucherCode: "رمز القسيمة",
  voucherCodePlaceholder: "أدخل رمز القسيمة...",
  apply: "تطبيق",
  remove: "إزالة",
  voucherAppliedSuccess: (code) => `تم تطبيق القسيمة ${code}`,
  giftCardApplied: (code) => `تم تطبيق بطاقة الهدية ${code}`,
  giftCardNotFound: "بطاقة الهدية غير موجودة أو منتهية الصلاحية",
  voucherNotFound: "القسيمة غير موجودة أو منتهية الصلاحية",
  addGiftCard: "إضافة بطاقة هدية",
  giftCardPlaceholder: "أدخل رمز بطاقة الهدية...",
  // CartItem
  removeItem: "إزالة المنتج",
  editPrice: "تعديل السعر",
  itemNote: "إضافة ملاحظة",
  itemNotePlaceholder: "مثال: بدون بصل، صوص إضافي، حساسية: مكسرات...",
  removeItemNote: "إزالة الملاحظة",
  allergyFlag: "⚠ حساسية",
  itemDiscount: "خصم البند",
  removeDiscount: "إزالة الخصم",
  // Order Note
  orderNote: "ملاحظة الطلب",
  addOrderNote: "إضافة ملاحظة للطلب",
  orderNotePlaceholder: "مثال: طلب عاجل، تغليف هدية، تنبيه حساسية...",
  // Tips / Gratuity
  tip: "إكرامية",
  noTip: "بدون إكرامية",
  customTip: "مخصصة",
  tipAdded: (amount) => `تمت إضافة الإكرامية: ${amount}`,
  // Refund
  refund: "استرداد",
  processRefund: "تنفيذ الاسترداد",
  receiptNumber: "رقم الإيصال / الطلب",
  refundReason: "السبب",
  fullRefund: "استرداد كامل",
  partialRefund: "استرداد جزئي",
  refundAmount: "مبلغ الاسترداد",
  refundMethod: "طريقة الاسترداد",
  refundSuccess: "تم تنفيذ الاسترداد بنجاح",
  refundToOriginal: "طريقة الدفع الأصلية",
  refundToCash: "نقدي",
  refundToCredit: "رصيد المتجر",
  refundReasons: ["العميل غير راضٍ", "صنف خاطئ", "منتج معيب", "تحصيل مكرر", "أخرى"],
  selectRefundReason: "اختر سبباً",
  lookupReceipt: "بحث",
  receiptNotFound: "الإيصال غير موجود",
  refundManagerRequired: "يلزم موافقة المدير للاسترداد",
  // Exchange
  exchange: "استبدال",
  processExchange: "تنفيذ الاستبدال",
  itemsToReturn: "المنتجات المرتجعة",
  newItems: "المنتجات الجديدة",
  exchangeDifference: "فرق السعر",
  collectAmount: "تحصيل من العميل",
  creditAmount: "رصيد للعميل",
  evenExchange: "استبدال متكافئ — لا حاجة لدفع",
  exchangeSuccess: "تم تنفيذ الاستبدال بنجاح",
  selectItemsToReturn: "حدد المنتجات المرتجعة",
  back: "رجوع",
  add: "إضافة",
  refundItemsLabel: "المنتجات المراد استردادها",
  customAmount: "مبلغ مخصص",
  // Restaurant — Table Map
  tableMap: "خريطة الطاولات",
  takeAway: "طلب خارجي",
  allSections: "جميع الأقسام",
  noTablesFound: "لا توجد طاولات",
  availableStatus: "متاحة",
  occupiedStatus: "مشغولة",
  reservedStatus: "محجوزة",
  tableCapacity: (n) => `${n} مقاعد`,
  tableSeated: (dur) => `جلس منذ ${dur}`,
  tableGuests: (n) => `${n} ضيف`,
  openTable: "فتح الطاولة",
  resumeTableOrder: "استئناف الطلب",
  selectTable: "اختر طاولة للبدء",
  // Restaurant — POS header
  tableAttached: (name) => `طاولة ${name}`,
  transferTable: "نقل الطاولة",
  releaseTable: "تحرير الطاولة",
  guestCount: "الضيوف",
  // Restaurant — Split Bill
  splitBill: "تقسيم الفاتورة",
  splitEqually: "تقسيم متساوٍ",
  splitByItems: "تقسيم حسب الأصناف",
  numberOfWays: "عدد الأجزاء",
  amountPerPerson: "المبلغ للشخص",
  processSplit: "تنفيذ التقسيم",
  assignBill: "إسناد للفاتورة",
  bill: (n) => `فاتورة ${n}`,
  // Restaurant — Kitchen
  sendToKitchen: "إرسال للمطبخ",
  sentToKitchen: "تم الإرسال للمطبخ",
  kitchenNote: "ملاحظة المطبخ",
  // Restaurant — Courses
  assignCourse: "المرحلة",
  noCourse: "بدون مرحلة",
  courseStarter: "مقبلات",
  courseMain: "طبق رئيسي",
  courseDessert: "حلويات",
  fireCourse: (name) => `إرسال ${name}`,
  courseStatusPending: "قيد الانتظار",
  courseStatusSent: "أُرسل",
  courseStatusReady: "جاهز",
  courseStatusServed: "قُدِّم",
  fireAll: "إرسال الكل",
  // Order Type
  dineIn: "محلي",
  takeaway: "سفري",
  delivery: "توصيل",
  // Walk-in Customer
  walkInCustomer: "عميل زائر",
  // Table Actions
  editGuests: "تعديل الضيوف",
  guestsUpdated: "تم تحديث عدد الضيوف",
  tableReleased: "تم تحرير الطاولة",
  confirmReleaseTable: "تحرير الطاولة ومسح الطلب؟",
  reserveTable: "حجز الطاولة",
  tableReserved: "تم حجز الطاولة",
  cancelReservation: "إلغاء الحجز",
  reservationCancelled: "تم إلغاء الحجز",
  numberOfGuests: "عدد الضيوف",
  // Delivery
  deliveryAddress: "عنوان التوصيل",
  deliveryAddressPlaceholder: "أدخل عنوان التوصيل...",
  deliveryFee: "رسوم التوصيل",
  estimatedTime: "الوقت المتوقع",
  minutes: "دقيقة",
  // Misc
  confirm: "تأكيد",
  save: "حفظ",
  edit: "تعديل",
  delete: "حذف",
  yes: "نعم",
  no: "لا",
};

export function usePOSTranslations(language: string): POSTranslations {
  return language === "ar" ? ar : en;
}
