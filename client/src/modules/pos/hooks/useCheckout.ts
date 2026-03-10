import { useState } from "react";
import { message } from "antd";
import { usePOSStore } from "../store/posStore";
import { submitOrder } from "../services/posService";
import { updateCustomerPoints } from "../services/customerService";
import { redeemVoucher } from "../services/voucherService";
import { redeemGiftCard } from "../services/giftCardService";
import { enqueueTransaction } from "../services/offlineService";
import { getPendingCount } from "../services/syncService";

export function useCheckout() {
  const [isCharging, setIsCharging] = useState(false);
  const [receiptVisible, setReceiptVisible] = useState(false);

  const store = usePOSStore();

  async function charge() {
    const {
      cartItems, paymentMethod, amountDue, grandTotal, subtotal, discountAmount, taxAmount,
      discount, cashGiven, cardRef, splitCash, splitCard, splitCardRef,
      setCompletedOrder, redeemPoints, pointsEarned, attachedCustomer,
      appliedVoucher, appliedGiftCards, cashierSession, isOnline,
      setPendingCount,
    } = store;

    if (cartItems.length === 0) {
      message.warning("Cart is empty");
      return;
    }

    const due = amountDue();

    // Validate payment
    if (paymentMethod === "cash" && cashGiven < due) {
      message.error(`Cash given is less than the amount due ($${due.toFixed(2)})`);
      return;
    }
    if (paymentMethod === "split") {
      const splitTotal = splitCash + splitCard;
      if (Math.abs(splitTotal - due) > 0.01) {
        message.error(`Split amounts must equal the amount due ($${due.toFixed(2)})`);
        return;
      }
    }

    const earned = pointsEarned();

    const payload = {
      items: cartItems.map((i) => ({
        productId: i.product.id,
        quantity: i.quantity,
        unitPrice: i.product.price,
      })),
      subtotal: subtotal(),
      discountType: discount.type,
      discountValue: discount.value,
      taxRate: 0.15,
      taxAmount: taxAmount(),
      grandTotal: grandTotal(),
      paymentMethod,
      cashAmount: paymentMethod === "cash" ? cashGiven : paymentMethod === "split" ? splitCash : undefined,
      cardAmount: paymentMethod === "card" ? due : paymentMethod === "split" ? splitCard : undefined,
      cardRef: paymentMethod === "card" ? cardRef : paymentMethod === "split" ? splitCardRef : undefined,
      customerId: attachedCustomer?.id,
      pointsRedeemed: redeemPoints,
      pointsEarned: earned,
      voucherCode: appliedVoucher?.code,
      giftCardCodes: appliedGiftCards.map((gc) => gc.code),
    };

    setIsCharging(true);

    // ── Offline path ───────────────────────────────────────────────────────
    if (!isOnline) {
      try {
        const localId = `OFFLINE-${Date.now()}`;
        const localOrderNumber = `OFFLINE-${Math.floor(100000 + Math.random() * 900000)}`;
        await enqueueTransaction({
          id: localId,
          payload,
          cashierName: cashierSession?.cashierName ?? "Unknown",
          cashierId: cashierSession?.cashierId ?? "unknown",
          timestamp: new Date().toISOString(),
          localOrderNumber,
          isOfflineSale: true,
        });
        setCompletedOrder({
          orderId: localId,
          orderNumber: localOrderNumber,
          createdAt: new Date().toISOString(),
        });
        setReceiptVisible(true);
        setPendingCount(await getPendingCount());
        message.success({
          content: `Order ${localOrderNumber} saved offline — will sync when connected`,
          duration: 4,
        });
      } catch {
        message.error("Failed to save offline transaction.");
      } finally {
        setIsCharging(false);
      }
      return;
    }

    // ── Online path ────────────────────────────────────────────────────────
    try {
      const result = await submitOrder(payload);

      if (attachedCustomer) {
        await updateCustomerPoints({
          customerId: attachedCustomer.id,
          pointsEarned: earned,
          pointsRedeemed: redeemPoints,
          orderNumber: result.orderNumber,
          amount: due,
        });
      }

      if (appliedVoucher) {
        await redeemVoucher(appliedVoucher.code, result.orderNumber, attachedCustomer?.name);
      }

      for (const gc of appliedGiftCards) {
        await redeemGiftCard(gc.code, gc.amountUsed);
      }

      setCompletedOrder(result);
      setReceiptVisible(true);
      message.success(`Order ${result.orderNumber} placed successfully!`);
    } catch {
      message.error("Failed to process payment. Please try again.");
    } finally {
      setIsCharging(false);
    }
  }

  function closeReceipt() {
    setReceiptVisible(false);
    store.clearCart();
    store.setCompletedOrder(null);
  }

  return {
    charge,
    isCharging,
    receiptVisible,
    closeReceipt,
    completedOrder: store.completedOrder,
  };
}
