import { Modal, Button, Divider, theme as antTheme, Tag } from "antd";
import {
  PrinterOutlined,
  PlusOutlined,
  StarOutlined,
  TagOutlined,
  GiftOutlined,
} from "@ant-design/icons";
import { useCart } from "../hooks/useCart";
import { usePOSStore, TAX_RATE } from "../store/posStore";
import type { OrderResult } from "../services/posService";
import { getTier } from "../data/mockCustomers";
import { useAppSettings } from "@/contexts/AppSettingsContext";
import { usePOSTranslations } from "../i18n/translations";

interface ReceiptModalProps {
  open: boolean;
  order: OrderResult | null;
  onClose: () => void;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function ReceiptModal({ open, order, onClose }: ReceiptModalProps) {
  const { token } = antTheme.useToken();
  const { language } = useAppSettings();
  const t = usePOSTranslations(language);
  const isRTL = language === "ar";
  const {
    cartItems,
    subtotal,
    discountAmount,
    taxAmount,
    grandTotal,
    amountDue,
    discount,
    redemptionDiscount,
    voucherDiscount,
    giftCardDiscount,
    appliedVoucher,
    appliedGiftCards,
    pointsEarned,
    attachedCustomer,
  } = useCart();
  const paymentMethod = usePOSStore(s => s.paymentMethod);
  const cashGiven = usePOSStore(s => s.cashGiven);
  const cardRef = usePOSStore(s => s.cardRef);
  const splitCash = usePOSStore(s => s.splitCash);
  const splitCard = usePOSStore(s => s.splitCard);
  const redeemPoints = usePOSStore(s => s.redeemPoints);
  const change = usePOSStore(s => s.change);

  if (!order) return null;

  const tier = attachedCustomer
    ? getTier(attachedCustomer.loyaltyPoints)
    : null;

  return (
    <>
      <style>{`
        @media print {
          body > * { display: none !important; }
          .pos-receipt-print { display: block !important; }
          .pos-receipt-print * { display: revert !important; }
        }
      `}</style>

      <Modal
        open={open}
        onCancel={onClose}
        closeIcon={null}
        footer={null}
        width={420}
        centered
        title={null}
        style={{ padding: 0, borderRadius: 16, overflow: "hidden" }}
      >
        {/* Header */}
        <div
          style={{
            position: "relative",
            background: `linear-gradient(135deg, ${token.colorPrimary}, ${token.colorPrimary}cc)`,
            padding: "20px 24px 16px",
            textAlign: "center",
            color: "#fff",
          }}
        >
          <div style={{ fontSize: 13, opacity: 0.85, marginBottom: 4 }}>
            {t.receipt.toUpperCase()}
          </div>
          <div
            style={{ fontSize: 22, fontWeight: 900, letterSpacing: "0.04em" }}
          >
            {order.orderNumber}
          </div>
          <div style={{ fontSize: 12, opacity: 0.75, marginTop: 4 }}>
            {formatDate(order.createdAt)}
          </div>
          <button
            onClick={onClose}
            style={{
              position: "absolute",
              top: 14,
              insetInlineEnd: 14,
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.2)",
              border: "1px solid rgba(255,255,255,0.3)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: 13,
              lineHeight: 1,
              transition: "background 0.15s",
              padding: 0,
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "rgba(255,255,255,0.35)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "rgba(255,255,255,0.2)";
            }}
          >
            ✕
          </button>
        </div>

        {/* Receipt content */}
        <div
          className="pos-receipt-print"
          dir={isRTL ? "rtl" : "ltr"}
          style={{ padding: "16px 24px" }}
        >
          {/* Customer info */}
          {attachedCustomer && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 10px",
                borderRadius: 8,
                background: tier ? `${tier.color}10` : token.colorFillAlter,
                border: `1px solid ${tier?.color ?? token.colorBorderSecondary}30`,
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  background: `${tier?.color ?? token.colorPrimary}30`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 13,
                  fontWeight: 800,
                  color: token.colorText,
                  flexShrink: 0,
                }}
              >
                {attachedCustomer.name.charAt(0)}
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: token.colorText,
                  }}
                >
                  {attachedCustomer.name}
                </div>
                <div style={{ fontSize: 10, color: token.colorTextSecondary }}>
                  {attachedCustomer.phone}
                  {tier && (
                    <span
                      style={{
                        marginInlineStart: 6,
                        color: tier.color,
                        fontWeight: 700,
                      }}
                    >
                      · {tier.name}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Items table */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 40px 70px 70px",
                gap: 4,
                padding: "4px 0",
                borderBottom: `1px solid ${token.colorBorderSecondary}`,
              }}
            >
              {[t.item, t.qty, t.price, t.itemTotal].map(h => (
                <span
                  key={h}
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: token.colorTextSecondary,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                  }}
                >
                  {h}
                </span>
              ))}
            </div>
            {cartItems.map(item => (
              <div
                key={item.product.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 40px 70px 70px",
                  gap: 4,
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    fontSize: 12,
                    color: token.colorText,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.product.name}
                </span>
                <span
                  style={{
                    fontSize: 12,
                    color: token.colorTextSecondary,
                    textAlign: "center",
                  }}
                >
                  {item.quantity}
                </span>
                <span
                  style={{
                    fontSize: 12,
                    color: token.colorTextSecondary,
                    textAlign: "end",
                  }}
                >
                  ${item.product.price.toFixed(2)}
                </span>
                <span
                  style={{ fontSize: 12, fontWeight: 600, textAlign: "end" }}
                >
                  ${(item.product.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <Divider style={{ margin: "10px 0" }} />

          {/* Totals */}
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            <Row label="Subtotal" value={`$${subtotal.toFixed(2)}`} />
            {discountAmount > 0 && (
              <Row
                label={`Discount${discount.type === "percent" ? ` (${discount.value}%)` : ""}`}
                value={`−$${discountAmount.toFixed(2)}`}
                color="#10B981"
              />
            )}
            {redemptionDiscount > 0 && (
              <Row
                label={`Points Redeemed (${redeemPoints.toLocaleString()} pts)`}
                value={`−$${redemptionDiscount.toFixed(2)}`}
                color="#F59E0B"
              />
            )}
            {voucherDiscount > 0 && appliedVoucher && (
              <Row
                label={`Voucher (${appliedVoucher.code})`}
                value={`−$${voucherDiscount.toFixed(2)}`}
                color="#10B981"
              />
            )}
            <Row
              label={`Tax (${(TAX_RATE * 100).toFixed(0)}% VAT)`}
              value={`$${taxAmount.toFixed(2)}`}
            />
            {giftCardDiscount > 0 &&
              appliedGiftCards.map(gc => (
                <Row
                  key={gc.code}
                  label={`Gift Card (${gc.code})`}
                  value={`−$${gc.amountUsed.toFixed(2)}`}
                  color="#A855F7"
                />
              ))}
            <Divider style={{ margin: "4px 0" }} dashed />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ fontSize: 15, fontWeight: 800 }}>
                {giftCardDiscount > 0
                  ? t.amountDue.toUpperCase()
                  : t.total.toUpperCase()}
              </span>
              <span
                style={{
                  fontSize: 18,
                  fontWeight: 900,
                  color: token.colorPrimary,
                }}
              >
                ${amountDue.toFixed(2)}
              </span>
            </div>
          </div>

          <Divider style={{ margin: "10px 0" }} />

          {/* Payment */}
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: token.colorTextSecondary,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: 2,
              }}
            >
              {t.payment}
            </div>
            {paymentMethod === "cash" && (
              <>
                <Row label={t.method} value={t.cash} />
                <Row label={t.tendered} value={`$${cashGiven.toFixed(2)}`} />
                <Row
                  label={t.change}
                  value={`$${change().toFixed(2)}`}
                  color="#10B981"
                  bold
                />
              </>
            )}
            {paymentMethod === "card" && (
              <>
                <Row label={t.method} value={t.card} />
                {cardRef && <Row label={t.refTxn} value={cardRef} />}
              </>
            )}
            {paymentMethod === "split" && (
              <>
                <Row label={t.method} value={t.cashPlusCard} />
                <Row label={t.cash} value={`$${splitCash.toFixed(2)}`} />
                <Row label={t.card} value={`$${splitCard.toFixed(2)}`} />
              </>
            )}
          </div>

          {/* Voucher applied */}
          {appliedVoucher && (
            <>
              <Divider style={{ margin: "10px 0" }} dashed />
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "8px 10px",
                  borderRadius: 8,
                  background: "#10B98110",
                  border: "1px solid #10B98130",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <TagOutlined style={{ color: "#10B981", fontSize: 13 }} />
                  <span
                    style={{ fontSize: 12, color: token.colorTextSecondary }}
                  >
                    {t.voucherApplied}
                  </span>
                </div>
                <Tag
                  style={{
                    background: "#10B981",
                    color: "#fff",
                    border: "none",
                    fontWeight: 800,
                    fontSize: 12,
                    padding: "2px 10px",
                    borderRadius: 8,
                  }}
                >
                  {appliedVoucher.code}
                </Tag>
              </div>
            </>
          )}

          {/* Gift cards applied */}
          {appliedGiftCards.length > 0 && (
            <>
              <Divider style={{ margin: "10px 0" }} dashed />
              {appliedGiftCards.map(gc => (
                <div
                  key={gc.code}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "6px 10px",
                    borderRadius: 8,
                    marginBottom: 4,
                    background: "#A855F710",
                    border: "1px solid #A855F730",
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 6 }}
                  >
                    <GiftOutlined style={{ color: "#A855F7", fontSize: 13 }} />
                    <span
                      style={{ fontSize: 11, color: token.colorTextSecondary }}
                    >
                      {t.giftCard}
                    </span>
                  </div>
                  <div style={{ textAlign: "end" }}>
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: "#A855F7",
                      }}
                    >
                      {gc.code}
                    </div>
                    <div
                      style={{ fontSize: 10, color: token.colorTextSecondary }}
                    >
                      −${gc.amountUsed.toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}

          {/* Loyalty points earned */}
          {attachedCustomer && pointsEarned > 0 && (
            <>
              <Divider style={{ margin: "10px 0" }} dashed />
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "8px 10px",
                  borderRadius: 8,
                  background: "#F59E0B10",
                  border: "1px solid #F59E0B30",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <StarOutlined style={{ color: "#F59E0B", fontSize: 13 }} />
                  <span
                    style={{ fontSize: 12, color: token.colorTextSecondary }}
                  >
                    {t.pointsEarnedLabel}
                  </span>
                </div>
                <Tag
                  style={{
                    background: "#F59E0B",
                    color: "#fff",
                    border: "none",
                    fontWeight: 800,
                    fontSize: 12,
                    padding: "2px 10px",
                    borderRadius: 8,
                  }}
                >
                  +{pointsEarned} pts
                </Tag>
              </div>
            </>
          )}

          <Divider style={{ margin: "10px 0" }} dashed />
          <div
            style={{
              textAlign: "center",
              fontSize: 11,
              color: token.colorTextTertiary,
            }}
          >
            {t.thankYou}
          </div>
        </div>

        {/* Action buttons */}
        <div
          style={{
            display: "flex",
            gap: 10,
            padding: "12px 24px 20px",
            borderTop: `1px solid ${token.colorBorderSecondary}`,
          }}
        >
          <Button
            size="large"
            icon={<PrinterOutlined />}
            onClick={() => window.print()}
            style={{ flex: 1, borderRadius: 10, height: 46, fontWeight: 600 }}
          >
            {t.printReceipt}
          </Button>
          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            onClick={onClose}
            style={{
              flex: 1,
              borderRadius: 10,
              height: 46,
              fontWeight: 700,
              background: `linear-gradient(135deg, ${token.colorPrimary}, ${token.colorPrimaryHover})`,
              border: "none",
            }}
          >
            {t.newSale}
          </Button>
        </div>
      </Modal>
    </>
  );
}

function Row({
  label,
  value,
  color,
  bold = false,
}: {
  label: string;
  value: string;
  color?: string;
  bold?: boolean;
}) {
  const { token } = antTheme.useToken();
  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <span style={{ fontSize: 12, color: token.colorTextSecondary }}>
        {label}
      </span>
      <span
        style={{
          fontSize: 12,
          fontWeight: bold ? 700 : 500,
          color: color ?? token.colorText,
        }}
      >
        {value}
      </span>
    </div>
  );
}
