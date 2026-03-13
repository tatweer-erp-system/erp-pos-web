import { usePOSStore } from "../store/posStore";
import type { Product } from "../data/mockProducts";

export function useCart() {
  const cartItems = usePOSStore(s => s.cartItems);
  const addToCart = usePOSStore(s => s.addToCart);
  const removeFromCart = usePOSStore(s => s.removeFromCart);
  const updateQuantity = usePOSStore(s => s.updateQuantity);
  const clearCart = usePOSStore(s => s.clearCart);
  const holdOrder = usePOSStore(s => s.holdOrder);
  const heldOrders = usePOSStore(s => s.heldOrders);
  const resumeOrder = usePOSStore(s => s.resumeOrder);
  const discount = usePOSStore(s => s.discount);
  const setDiscount = usePOSStore(s => s.setDiscount);
  const subtotal = usePOSStore(s => s.subtotal);
  const discountAmount = usePOSStore(s => s.discountAmount);
  const redemptionDiscount = usePOSStore(s => s.redemptionDiscount);
  const voucherDiscount = usePOSStore(s => s.voucherDiscount);
  const giftCardDiscount = usePOSStore(s => s.giftCardDiscount);
  const taxAmount = usePOSStore(s => s.taxAmount);
  const grandTotal = usePOSStore(s => s.grandTotal);
  const amountDue = usePOSStore(s => s.amountDue);
  const pointsEarned = usePOSStore(s => s.pointsEarned);
  const attachedCustomer = usePOSStore(s => s.attachedCustomer);
  const appliedVoucher = usePOSStore(s => s.appliedVoucher);
  const setAppliedVoucher = usePOSStore(s => s.setAppliedVoucher);
  const appliedGiftCards = usePOSStore(s => s.appliedGiftCards);
  const addGiftCard = usePOSStore(s => s.addGiftCard);
  const removeGiftCard = usePOSStore(s => s.removeGiftCard);

  function handleAddToCart(product: Product) {
    if (product.stock === 0) return;
    addToCart(product);
  }

  return {
    cartItems,
    addToCart: handleAddToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    holdOrder,
    heldOrders,
    resumeOrder,
    discount,
    setDiscount,
    subtotal: subtotal(),
    discountAmount: discountAmount(),
    redemptionDiscount: redemptionDiscount(),
    voucherDiscount: voucherDiscount(),
    giftCardDiscount: giftCardDiscount(),
    taxAmount: taxAmount(),
    grandTotal: grandTotal(),
    amountDue: amountDue(),
    pointsEarned: pointsEarned(),
    attachedCustomer,
    appliedVoucher,
    setAppliedVoucher,
    appliedGiftCards,
    addGiftCard,
    removeGiftCard,
    itemCount: cartItems.reduce((n, i) => n + i.quantity, 0),
  };
}
