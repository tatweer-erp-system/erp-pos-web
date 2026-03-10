import { InputNumber, Input, theme as antTheme, Alert } from "antd";
import {
  DollarOutlined,
  BankOutlined,
  SplitCellsOutlined,
} from "@ant-design/icons";
import { usePOSStore, type PaymentMethod } from "../store/posStore";
import { useAppSettings } from "@/contexts/AppSettingsContext";
import { usePOSTranslations } from "../i18n/translations";

interface PaymentSectionProps {
  grandTotal: number;
  isMobile: boolean;
}

export function PaymentSection({ grandTotal, isMobile }: PaymentSectionProps) {
  const { token } = antTheme.useToken();
  const { language } = useAppSettings();
  const t = usePOSTranslations(language);

  const PAYMENT_METHODS: { value: PaymentMethod; label: string; icon: React.ReactNode }[] = [
    { value: "cash",  label: t.cash,  icon: <DollarOutlined /> },
    { value: "card",  label: t.card,  icon: <BankOutlined /> },
    { value: "split", label: t.split, icon: <SplitCellsOutlined /> },
  ];
  const paymentMethod  = usePOSStore((s) => s.paymentMethod);
  const setPaymentMethod = usePOSStore((s) => s.setPaymentMethod);
  const cashGiven      = usePOSStore((s) => s.cashGiven);
  const setCashGiven   = usePOSStore((s) => s.setCashGiven);
  const cardRef        = usePOSStore((s) => s.cardRef);
  const setCardRef     = usePOSStore((s) => s.setCardRef);
  const splitCash      = usePOSStore((s) => s.splitCash);
  const setSplitCash   = usePOSStore((s) => s.setSplitCash);
  const splitCard      = usePOSStore((s) => s.splitCard);
  const setSplitCard   = usePOSStore((s) => s.setSplitCard);
  const splitCardRef   = usePOSStore((s) => s.splitCardRef);
  const setSplitCardRef = usePOSStore((s) => s.setSplitCardRef);

  const change = paymentMethod === "cash"
    ? Math.max(0, cashGiven - grandTotal)
    : paymentMethod === "split"
    ? Math.max(0, splitCash - (grandTotal - splitCard))
    : 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>

      {/* Method selector */}
      <div style={{ display: "flex", gap: 6 }}>
        {PAYMENT_METHODS.map(({ value, label, icon }) => {
          const active = paymentMethod === value;
          return (
            <button
              key={value}
              onClick={() => setPaymentMethod(value)}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 3,
                padding: "8px 4px",
                borderRadius: 10,
                border: `1.5px solid ${active ? token.colorPrimary : token.colorBorderSecondary}`,
                background: active ? token.colorPrimaryBg : "transparent",
                color: active ? token.colorPrimary : token.colorTextSecondary,
                cursor: "pointer",
                transition: "all 0.18s",
                fontSize: 11,
                fontWeight: active ? 700 : 500,
                minHeight: 52,
              }}
            >
              <span style={{ fontSize: 15 }}>{icon}</span>
              <span>{label}</span>
            </button>
          );
        })}
      </div>

      {/* Cash fields */}
      {paymentMethod === "cash" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 12, color: token.colorTextSecondary, width: 90, flexShrink: 0 }}>
              {t.amountGiven}
            </span>
            <InputNumber
              style={{ flex: 1, borderRadius: 8 }}
              min={0}
              precision={2}
              value={cashGiven || undefined}
              onChange={(v) => setCashGiven(v ?? 0)}
              prefix="$"
              placeholder="0.00"
              size="middle"
            />
          </div>
          {cashGiven > 0 && (
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "8px 12px",
              borderRadius: 8,
              background: change >= 0
                ? "#10B98112"
                : "#EF444412",
              border: `1px solid ${change >= 0 ? "#10B98130" : "#EF444430"}`,
            }}>
              <span style={{ fontSize: 12, color: token.colorTextSecondary }}>{t.change}</span>
              <span style={{
                fontSize: 14,
                fontWeight: 800,
                color: change >= 0 ? "#10B981" : "#EF4444",
              }}>
                ${change.toFixed(2)}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Card fields */}
      {paymentMethod === "card" && (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 12, color: token.colorTextSecondary, width: 90, flexShrink: 0 }}>
            {t.refTxnId}
          </span>
          <Input
            style={{ flex: 1, borderRadius: 8 }}
            value={cardRef}
            onChange={(e) => setCardRef(e.target.value)}
            placeholder="Transaction ID"
          />
        </div>
      )}

      {/* Split fields */}
      {paymentMethod === "split" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 12, color: token.colorTextSecondary, width: 90, flexShrink: 0 }}>
              {t.cashAmount}
            </span>
            <InputNumber
              style={{ flex: 1, borderRadius: 8 }}
              min={0}
              max={grandTotal}
              precision={2}
              value={splitCash || undefined}
              onChange={(v) => {
                const cash = v ?? 0;
                setSplitCash(cash);
                setSplitCard(Math.max(0, parseFloat((grandTotal - cash).toFixed(2))));
              }}
              prefix="$"
              placeholder="0.00"
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 12, color: token.colorTextSecondary, width: 90, flexShrink: 0 }}>
              {t.cardAmount}
            </span>
            <InputNumber
              style={{ flex: 1, borderRadius: 8 }}
              min={0}
              max={grandTotal}
              precision={2}
              value={splitCard || undefined}
              onChange={(v) => {
                const card = v ?? 0;
                setSplitCard(card);
                setSplitCash(Math.max(0, parseFloat((grandTotal - card).toFixed(2))));
              }}
              prefix="$"
              placeholder="0.00"
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 12, color: token.colorTextSecondary, width: 90, flexShrink: 0 }}>
              {t.cardRef}
            </span>
            <Input
              style={{ flex: 1, borderRadius: 8 }}
              value={splitCardRef}
              onChange={(e) => setSplitCardRef(e.target.value)}
              placeholder="Transaction ID"
            />
          </div>

          {/* Split balance check */}
          {(splitCash > 0 || splitCard > 0) && (() => {
            const diff = Math.abs(splitCash + splitCard - grandTotal);
            if (diff > 0.01) {
              return (
                <Alert
                  type={splitCash + splitCard < grandTotal ? "warning" : "error"}
                  message={`${t.splitRemaining}: $${(grandTotal - splitCash - splitCard).toFixed(2)}`}
                  banner
                  style={{ borderRadius: 8, fontSize: 11 }}
                />
              );
            }
            return (
              <Alert
                type="success"
                message={t.splitMatch}
                banner
                style={{ borderRadius: 8, fontSize: 11 }}
              />
            );
          })()}
        </div>
      )}
    </div>
  );
}
