import { useState } from "react";
import { Input, Button, Tag, Spin, theme as antTheme, message } from "antd";
import {
  TagOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  LoadingOutlined,
  CloseOutlined,
  GiftOutlined,
} from "@ant-design/icons";
import { validateVoucher } from "../../services/voucherService";
import { checkGiftCardBalance } from "../../services/giftCardService";
import { useCart } from "../../hooks/useCart";
import type { AppliedGiftCard, AppliedVoucher } from "../../store/posStore";
import { usePOSStore } from "../../store/posStore";
import { useAppSettings } from "@/contexts/AppSettingsContext";
import { usePOSTranslations } from "../../i18n/translations";

export function VoucherInput() {
  const { token } = antTheme.useToken();
  const { language } = useAppSettings();
  const t = usePOSTranslations(language);
  const {
    subtotal,
    grandTotal,
    appliedVoucher,
    setAppliedVoucher,
    appliedGiftCards,
    addGiftCard,
    removeGiftCard,
  } = useCart();

  const giftCardDiscount = usePOSStore(s => s.giftCardDiscount);

  const [inputCode, setInputCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleApply() {
    const code = inputCode.trim().toUpperCase();
    if (!code) return;

    // Prevent applying same gift card twice
    if (appliedGiftCards.some(gc => gc.code === code)) {
      setError("This gift card is already applied");
      return;
    }
    // Only one voucher allowed
    if (appliedVoucher) {
      setError("Remove existing voucher before applying another");
      return;
    }

    setLoading(true);
    setError(null);

    // Try gift card first (GC- prefix heuristic, then fallback)
    const looksLikeGiftCard = code.startsWith("GC-");

    if (looksLikeGiftCard) {
      const result = await checkGiftCardBalance(code).catch(() => null);
      if (result?.found && result.giftCard) {
        const gc = result.giftCard;
        if (gc.status === "depleted") {
          setError("This gift card has no remaining balance");
          setLoading(false);
          return;
        }
        if (gc.status === "expired") {
          setError("This gift card has expired");
          setLoading(false);
          return;
        }
        // Use up to the remaining grandTotal amount
        const amountUsed = Math.min(
          gc.remainingBalance,
          grandTotal - giftCardDiscount()
        );
        const applied: AppliedGiftCard = {
          code: gc.code,
          availableBalance: gc.remainingBalance,
          amountUsed,
        };
        addGiftCard(applied);
        setInputCode("");
        message.success(`Gift card applied — $${amountUsed.toFixed(2)} credit`);
        setLoading(false);
        return;
      }
    }

    // Try as voucher
    const vResult = await validateVoucher(code, subtotal);
    if (vResult.valid && vResult.voucher) {
      const applied: AppliedVoucher = {
        code: vResult.voucher.code,
        discountType: vResult.voucher.discountType,
        discountValue: vResult.voucher.discountValue,
        description:
          vResult.voucher.discountType === "percent"
            ? `${vResult.voucher.discountValue}% off`
            : `$${vResult.voucher.discountValue.toFixed(2)} off`,
        discountAmount: vResult.discountAmount ?? 0,
      };
      setAppliedVoucher(applied);
      setInputCode("");
      message.success(`Voucher applied — ${applied.description}`);
      setLoading(false);
      return;
    }

    // Try as gift card (no prefix)
    if (!looksLikeGiftCard) {
      const gcResult = await checkGiftCardBalance(code).catch(() => null);
      if (gcResult?.found && gcResult.giftCard) {
        const gc = gcResult.giftCard;
        if (gc.status === "depleted") {
          setError("This gift card has no remaining balance");
          setLoading(false);
          return;
        }
        if (gc.status === "expired") {
          setError("This gift card has expired");
          setLoading(false);
          return;
        }
        const amountUsed = Math.min(
          gc.remainingBalance,
          grandTotal - giftCardDiscount()
        );
        const applied: AppliedGiftCard = {
          code: gc.code,
          availableBalance: gc.remainingBalance,
          amountUsed,
        };
        addGiftCard(applied);
        setInputCode("");
        message.success(`Gift card applied — $${amountUsed.toFixed(2)} credit`);
        setLoading(false);
        return;
      }
    }

    setError(vResult.message ?? "Code not found");
    setLoading(false);
  }

  const hasApplied = !!appliedVoucher || appliedGiftCards.length > 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {/* Input row */}
      <div style={{ display: "flex", gap: 6 }}>
        <Input
          placeholder={t.voucherCodePlaceholder}
          value={inputCode}
          onChange={e => {
            setInputCode(e.target.value.toUpperCase());
            setError(null);
          }}
          onPressEnter={handleApply}
          prefix={
            <TagOutlined
              style={{ color: token.colorTextTertiary, fontSize: 12 }}
            />
          }
          size="small"
          style={{ flex: 1, borderRadius: 8, fontSize: 12 }}
          status={error ? "error" : undefined}
          disabled={loading}
        />
        <Button
          size="small"
          type="primary"
          ghost
          onClick={handleApply}
          loading={loading}
          disabled={!inputCode.trim()}
          style={{ borderRadius: 8, fontWeight: 600, flexShrink: 0 }}
          icon={loading ? <LoadingOutlined /> : undefined}
        >
          {t.apply}
        </Button>
      </div>

      {/* Error message */}
      {error && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            fontSize: 11,
            color: token.colorError,
          }}
        >
          <CloseCircleOutlined style={{ fontSize: 11 }} />
          {error}
        </div>
      )}

      {/* Applied voucher pill */}
      {appliedVoucher && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "5px 8px",
            borderRadius: 8,
            background: "#10B98110",
            border: "1px solid #10B98130",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <CheckCircleOutlined style={{ color: "#10B981", fontSize: 11 }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: "#10B981" }}>
              {appliedVoucher.code}
            </span>
            <Tag
              style={{
                fontSize: 10,
                lineHeight: "16px",
                padding: "0 5px",
                margin: 0,
              }}
            >
              {appliedVoucher.description}
            </Tag>
          </div>
          <Button
            type="text"
            size="small"
            icon={<CloseOutlined style={{ fontSize: 10 }} />}
            onClick={() => setAppliedVoucher(null)}
            style={{
              width: 20,
              height: 20,
              padding: 0,
              color: token.colorTextTertiary,
            }}
          />
        </div>
      )}

      {/* Applied gift cards */}
      {appliedGiftCards.map(gc => (
        <div
          key={gc.code}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "5px 8px",
            borderRadius: 8,
            background: "#A855F710",
            border: "1px solid #A855F730",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <GiftOutlined style={{ color: "#A855F7", fontSize: 11 }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: "#A855F7" }}>
              {gc.code}
            </span>
            <span style={{ fontSize: 10, color: token.colorTextSecondary }}>
              −${gc.amountUsed.toFixed(2)} of ${gc.availableBalance.toFixed(2)}
            </span>
          </div>
          <Button
            type="text"
            size="small"
            icon={<CloseOutlined style={{ fontSize: 10 }} />}
            onClick={() => removeGiftCard(gc.code)}
            style={{
              width: 20,
              height: 20,
              padding: 0,
              color: token.colorTextTertiary,
            }}
          />
        </div>
      ))}

      {!hasApplied && (
        <div style={{ fontSize: 10, color: token.colorTextTertiary }}>
          Accepts voucher codes and gift cards (e.g. GC-2025-001)
        </div>
      )}
    </div>
  );
}
