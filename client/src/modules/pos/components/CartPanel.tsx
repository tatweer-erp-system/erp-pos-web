import { useState } from "react";
import { Select, InputNumber, Button, Empty, Badge, Divider, theme as antTheme, Popconfirm, Tooltip, Tag, Input } from "antd";
import { ShoppingCartOutlined, ClearOutlined, PauseCircleOutlined, ReloadOutlined, WarningOutlined, SafetyOutlined, ScissorOutlined, FileTextOutlined, GiftOutlined } from "@ant-design/icons";
import { CartItem } from "./CartItem";
import { PaymentSection } from "./PaymentSection";
import { CustomerSearch } from "./cart/CustomerSearch";
import { CustomerCard } from "./cart/CustomerCard";
import { LoyaltyRedemption } from "./cart/LoyaltyRedemption";
import { VoucherInput } from "./cart/VoucherInput";
import { CourseManager } from "./restaurant/CourseManager";
import { FireCourseButton } from "./restaurant/FireCourseButton";
import { KitchenTicket } from "./restaurant/KitchenTicket";
import { SplitBillModal } from "./restaurant/SplitBillModal";
import { useRestaurantMode } from "../hooks/useRestaurantMode";
import { useCart } from "../hooks/useCart";
import { useCheckout } from "../hooks/useCheckout";
import { usePOSContext } from "../context/POSContext";
import type { DiscountType, LineDiscount } from "../store/posStore";
import { TAX_RATE, usePOSStore } from "../store/posStore";
import { useAppSettings } from "@/contexts/AppSettingsContext";
import { usePOSTranslations } from "../i18n/translations";

interface CartPanelProps {
  isMobile: boolean;
}

export function CartPanel({ isMobile }: CartPanelProps) {
  const { token } = antTheme.useToken();
  const { language } = useAppSettings();
  const t = usePOSTranslations(language);
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    holdOrder,
    heldOrders,
    resumeOrder,
    discount,
    setDiscount,
    subtotal,
    discountAmount,
    taxAmount,
    grandTotal,
    amountDue,
    itemCount,
    redemptionDiscount,
    voucherDiscount,
    giftCardDiscount,
    appliedGiftCards,
  } = useCart();

  const redeemPoints            = usePOSStore((s) => s.redeemPoints);
  const posSettings             = usePOSStore((s) => s.posSessionSettings);
  const discountOverrideGranted = usePOSStore((s) => s.discountOverrideGranted);
  const setDiscountOverrideGranted = usePOSStore((s) => s.setDiscountOverrideGranted);
  const setItemDiscount         = usePOSStore((s) => s.setItemDiscount);
  const setItemNote             = usePOSStore((s) => s.setItemNote);
  const orderNote               = usePOSStore((s) => s.orderNote);
  const setOrderNote            = usePOSStore((s) => s.setOrderNote);
  const tipAmount               = usePOSStore((s) => s.tipAmount);
  const setTip                  = usePOSStore((s) => s.setTip);
  const finalTotal              = usePOSStore((s) => s.finalTotal);
  const { requestManagerOverride } = usePOSContext();
  const { charge, isCharging } = useCheckout();
  const restaurantMode = useRestaurantMode();
  const isEmpty = cartItems.length === 0;

  const [requestingOverride, setRequestingOverride] = useState(false);
  const [splitBillOpen, setSplitBillOpen] = useState(false);
  const [showNote, setShowNote] = useState(false);
  const [showTip, setShowTip] = useState(false);
  const [customTip, setCustomTip] = useState<number | null>(null);

  const TIP_PRESETS = [0, 10, 15, 18, 20, 25];

  function handleSetDiscount(productId: string, discount: LineDiscount | undefined) {
    setItemDiscount(productId, discount);
  }

  function handleTipPreset(pct: number) {
    setCustomTip(null);
    setTip(amountDue * pct / 100);
  }

  function handleCustomTip(v: number | null) {
    setCustomTip(v);
    setTip(v ?? 0);
  }

  const discountThreshold = posSettings.requireManagerForDiscountsAbove;
  const needsOverride =
    discount.type === "percent" &&
    discount.value > discountThreshold &&
    !discountOverrideGranted;

  async function handleRequestOverride() {
    setRequestingOverride(true);
    const managerName = await requestManagerOverride(
      `Discount of ${discount.value}% exceeds the allowed threshold of ${discountThreshold}%`,
      "Apply High Discount"
    );
    if (managerName) {
      setDiscountOverrideGranted(true);
    }
    setRequestingOverride(false);
  }

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      height: "100%",
      background: token.colorBgContainer,
      borderRadius: 16,
      border: `1px solid ${token.colorBorderSecondary}`,
      overflow: "hidden",
    }}>

      {/* Header */}
      <div style={{
        padding: "12px 14px",
        borderBottom: `1px solid ${token.colorBorderSecondary}`,
        display: "flex",
        flexDirection: "column",
        gap: 10,
        flexShrink: 0,
        background: token.colorFillAlter,
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Badge count={itemCount} color={token.colorPrimary} size="small">
              <ShoppingCartOutlined style={{ fontSize: 18, color: token.colorPrimary }} />
            </Badge>
            <span style={{ fontSize: 14, fontWeight: 700, color: token.colorText }}>{t.cart}</span>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {/* Restaurant: Split Bill */}
            {restaurantMode.isRestaurant && !isEmpty && (
              <Tooltip title={t.splitBill}>
                <Button
                  size="small"
                  icon={<ScissorOutlined />}
                  onClick={() => setSplitBillOpen(true)}
                  style={{ borderRadius: 8, height: 32, fontSize: 11, color: "#6366F1", borderColor: "#6366F140" }}
                >
                  {t.splitBill}
                </Button>
              </Tooltip>
            )}
            {heldOrders.length > 0 && (
              <Tooltip title={t.heldOrdersTooltip(heldOrders.length)}>
                <Button
                  size="small"
                  icon={<ReloadOutlined />}
                  onClick={() => resumeOrder(heldOrders[heldOrders.length - 1].id)}
                  style={{ borderRadius: 8, height: 32, fontSize: 11 }}
                >
                  {t.resumeN(heldOrders.length)}
                </Button>
              </Tooltip>
            )}
            <Tooltip title={t.holdOrder}>
              <Button
                size="small"
                icon={<PauseCircleOutlined />}
                onClick={holdOrder}
                disabled={isEmpty}
                style={{ borderRadius: 8, height: 32, width: 32, padding: 0 }}
              />
            </Tooltip>
            <Popconfirm
              title={t.clearCartConfirm}
              onConfirm={clearCart}
              okText={t.clearCart}
              cancelText={t.cancel}
              okButtonProps={{ danger: true }}
            >
              <Tooltip title={t.clearCartTooltip}>
                <Button
                  size="small"
                  danger
                  icon={<ClearOutlined />}
                  disabled={isEmpty}
                  style={{ borderRadius: 8, height: 32, width: 32, padding: 0 }}
                />
              </Tooltip>
            </Popconfirm>
          </div>
        </div>
        <CustomerSearch isMobile={isMobile} />
        <CustomerCard />
      </div>

      {/* Cart Items */}
      <div style={{ flex: 1, overflowY: "auto", padding: "8px 4px", display: "flex", flexDirection: "column", gap: 2 }}>
        {isEmpty ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={<span style={{ fontSize: 13, color: token.colorTextSecondary }}>{t.emptyCart}<br />{t.emptyCartSub}</span>}
            style={{ marginTop: 40 }}
          />
        ) : (
          cartItems.map((item) => (
            <CartItem
              key={item.product.id}
              item={item}
              onQuantityChange={updateQuantity}
              onRemove={removeFromCart}
              onSetDiscount={handleSetDiscount}
              onSetNote={(productId, note) => setItemNote(productId, note)}
              isMobile={isMobile}
            />
          ))
        )}
      </div>

      {/* Summary & Payment */}
      {!isEmpty && (
        <div style={{
          borderTop: `1px solid ${token.colorBorderSecondary}`,
          padding: "12px 14px",
          display: "flex",
          flexDirection: "column",
          gap: 10,
          flexShrink: 0,
          background: token.colorFillAlter,
        }}>
          <LoyaltyRedemption />
          <VoucherInput />

          {/* Order Note */}
          <div>
            <Button
              type="text"
              size="small"
              icon={<FileTextOutlined />}
              onClick={() => setShowNote((v) => !v)}
              style={{
                color: orderNote ? token.colorPrimary : token.colorTextSecondary,
                fontWeight: orderNote ? 600 : 400,
                fontSize: 12,
                padding: "0 4px",
                height: 26,
              }}
            >
              {orderNote ? t.orderNote : t.addOrderNote}
            </Button>
            {showNote && (
              <Input.TextArea
                rows={2}
                value={orderNote}
                onChange={(e) => setOrderNote(e.target.value)}
                placeholder={t.orderNotePlaceholder}
                style={{ marginTop: 6, borderRadius: 8, fontSize: 12 }}
                autoFocus
              />
            )}
          </div>

          {/* Manual discount */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 12, color: token.colorTextSecondary, flexShrink: 0, width: 68 }}>{t.discount}</span>
            <Select
              size="small"
              value={discount.type}
              onChange={(v: DiscountType) => setDiscount({ ...discount, type: v })}
              style={{ width: 80, borderRadius: 8 }}
              options={[{ value: "percent", label: "%" }, { value: "fixed", label: "$" }]}
            />
            <InputNumber
              size="small"
              min={0}
              max={discount.type === "percent" ? 100 : subtotal}
              value={discount.value}
              onChange={(v) => { setDiscount({ ...discount, value: v ?? 0 }); setDiscountOverrideGranted(false); }}
              precision={2}
              style={{ flex: 1, borderRadius: 8 }}
              placeholder="0.00"
            />
          </div>

          {/* Manager override warning for high discounts */}
          {needsOverride && (
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 8,
              padding: "8px 10px",
              borderRadius: 8,
              background: "#F59E0B10",
              border: "1px solid #F59E0B40",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#92400E" }}>
                <WarningOutlined style={{ color: "#F59E0B" }} />
                <span>{t.managerOverrideMsg(discount.value, discountThreshold)}</span>
              </div>
              <Button
                size="small"
                icon={<SafetyOutlined />}
                loading={requestingOverride}
                onClick={handleRequestOverride}
                style={{ borderRadius: 6, height: 26, fontSize: 11, borderColor: "#F59E0B60", color: "#92400E" }}
              >
                {t.requestOverride}
              </Button>
            </div>
          )}

          {discountOverrideGranted && discount.value > discountThreshold && (
            <Tag color="success" icon={<SafetyOutlined />} style={{ borderRadius: 6, fontSize: 11 }}>
              {t.overrideGranted}
            </Tag>
          )}

          <Divider style={{ margin: "2px 0" }} />

          {/* Totals breakdown */}
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 12, color: token.colorTextSecondary }}>{t.subtotal}</span>
              <span style={{ fontSize: 12, fontWeight: 500 }}>${subtotal.toFixed(2)}</span>
            </div>
            {discountAmount > 0 && (
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 12, color: "#10B981" }}>{t.discount}{discount.type === "percent" ? ` (${discount.value}%)` : ""}</span>
                <span style={{ fontSize: 12, color: "#10B981", fontWeight: 500 }}>−${discountAmount.toFixed(2)}</span>
              </div>
            )}
            {redemptionDiscount > 0 && (
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 12, color: "#F59E0B" }}>{t.pointsRedeemed(redeemPoints)}</span>
                <span style={{ fontSize: 12, color: "#F59E0B", fontWeight: 600 }}>−${redemptionDiscount.toFixed(2)}</span>
              </div>
            )}
            {voucherDiscount > 0 && (
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 12, color: "#10B981" }}>{t.voucher}</span>
                <span style={{ fontSize: 12, color: "#10B981", fontWeight: 600 }}>−${voucherDiscount.toFixed(2)}</span>
              </div>
            )}
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 12, color: token.colorTextSecondary }}>{t.tax} ({(TAX_RATE * 100).toFixed(0)}%)</span>
              <span style={{ fontSize: 12, fontWeight: 500 }}>${taxAmount.toFixed(2)}</span>
            </div>
            {giftCardDiscount > 0 && (
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 12, color: "#A855F7" }}>{t.giftCardLabel(appliedGiftCards.length)}</span>
                <span style={{ fontSize: 12, color: "#A855F7", fontWeight: 600 }}>−${giftCardDiscount.toFixed(2)}</span>
              </div>
            )}
          </div>

          {/* Tip / Gratuity */}
          <div>
            <Button
              type="text"
              size="small"
              icon={<GiftOutlined />}
              onClick={() => setShowTip((v) => !v)}
              style={{
                color: tipAmount > 0 ? token.colorSuccess : token.colorTextSecondary,
                fontWeight: tipAmount > 0 ? 600 : 400,
                fontSize: 12,
                padding: "0 4px",
                height: 26,
              }}
            >
              {tipAmount > 0 ? `${t.tip}: $${tipAmount.toFixed(2)}` : t.tip}
            </Button>
            {showTip && (
              <div style={{ marginTop: 6, display: "flex", flexWrap: "wrap", gap: 5 }}>
                {TIP_PRESETS.map((pct) => (
                  <Button
                    key={pct}
                    size="small"
                    type={tipAmount === amountDue * pct / 100 && customTip === null ? "primary" : "default"}
                    onClick={() => handleTipPreset(pct)}
                    style={{ borderRadius: 8, fontSize: 11, height: 28, flex: "0 0 auto" }}
                  >
                    {pct === 0 ? t.noTip : `${pct}%`}
                  </Button>
                ))}
                <InputNumber
                  size="small"
                  min={0}
                  value={customTip}
                  onChange={handleCustomTip}
                  placeholder={t.customTip}
                  prefix="$"
                  precision={2}
                  style={{ flex: 1, minWidth: 80, borderRadius: 8, fontSize: 11 }}
                />
              </div>
            )}
            {tipAmount > 0 && (
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                <span style={{ fontSize: 12, color: token.colorSuccess }}>{t.tip}</span>
                <span style={{ fontSize: 12, color: token.colorSuccess, fontWeight: 600 }}>+${tipAmount.toFixed(2)}</span>
              </div>
            )}
          </div>

          {/* Strikethrough grand total when gift cards applied */}
          {giftCardDiscount > 0 && (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 12, color: token.colorTextSecondary }}>{t.orderTotal}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: token.colorTextSecondary, textDecoration: "line-through" }}>
                ${grandTotal.toFixed(2)}
              </span>
            </div>
          )}

          {/* Amount Due */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px 14px",
            borderRadius: 12,
            background: `linear-gradient(135deg, ${token.colorPrimary}12, ${token.colorPrimary}20)`,
            border: `1.5px solid ${token.colorPrimary}30`,
          }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: token.colorText }}>
              {giftCardDiscount > 0 ? t.amountDue : t.grandTotal}
            </span>
            <span style={{ fontSize: 22, fontWeight: 900, color: token.colorPrimary }}>
              ${finalTotal().toFixed(2)}
            </span>
          </div>

          <PaymentSection grandTotal={finalTotal()} isMobile={isMobile} />

          {/* Restaurant: Course Management */}
          {restaurantMode.isRestaurant && restaurantMode.courseManagementEnabled && (
            <CourseManager items={cartItems} />
          )}

          {/* Restaurant: Fire Course buttons */}
          {restaurantMode.isRestaurant && restaurantMode.courseManagementEnabled && (
            <FireCourseButton items={cartItems} />
          )}

          {/* Restaurant: Send to Kitchen */}
          {restaurantMode.isRestaurant && restaurantMode.kitchenPrintingEnabled && (
            <KitchenTicket items={cartItems} />
          )}

          <Button
            type="primary"
            size="large"
            loading={isCharging}
            onClick={charge}
            style={{
              width: "100%",
              height: 52,
              borderRadius: 12,
              fontSize: 16,
              fontWeight: 800,
              background: `linear-gradient(135deg, ${token.colorPrimary}, ${token.colorPrimaryHover})`,
              border: "none",
              boxShadow: `0 6px 20px ${token.colorPrimary}40`,
              letterSpacing: "0.02em",
            }}
          >
            {isCharging ? t.processing : `${t.chargeButton} $${finalTotal().toFixed(2)}`}
          </Button>
        </div>
      )}

      {/* Restaurant: Split Bill Modal */}
      {restaurantMode.isRestaurant && (
        <SplitBillModal
          open={splitBillOpen}
          onClose={() => setSplitBillOpen(false)}
          cartItems={cartItems}
          grandTotal={grandTotal}
          isMobile={isMobile}
        />
      )}
    </div>
  );
}
