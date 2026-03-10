import { useState, useEffect } from "react";
import { Modal, InputNumber, Select, Input, Button, theme as antTheme, Tag } from "antd";
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import { usePOSStore } from "../../store/posStore";
import { useAppSettings } from "@/contexts/AppSettingsContext";
import { usePOSTranslations } from "../../i18n/translations";

const { TextArea } = Input;
const { Option } = Select;

interface Props {
  type: "in" | "out";
  open: boolean;
  onClose: () => void;
}

export function CashInOutModal({ type, open, onClose }: Props) {
  const { token } = antTheme.useToken();
  const { language } = useAppSettings();
  const t = usePOSTranslations(language);
  const isRTL = language === "ar";
  const cashierSession  = usePOSStore((s) => s.cashierSession);
  const addCashMovement = usePOSStore((s) => s.addCashMovement);
  const cashDrawerTotal = usePOSStore((s) => s.cashDrawerTotal);

  const [amount,       setAmount]       = useState<number | null>(null);
  const [reason,       setReason]       = useState<string>("");
  const [customReason, setCustomReason] = useState("");
  const [note,         setNote]         = useState("");

  const reasons = type === "in" ? t.cashInReasons : t.cashOutReasons;
  const isIn    = type === "in";
  const color   = isIn ? "#10B981" : "#EF4444";
  const icon    = isIn ? <ArrowDownOutlined /> : <ArrowUpOutlined />;
  const label   = isIn ? t.cashIn : t.cashOut;

  // Reset on open
  useEffect(() => {
    if (open) {
      setAmount(null);
      setReason("");
      setCustomReason("");
      setNote("");
    }
  }, [open]);

  const otherLabel  = reasons[reasons.length - 1]; // last item is always "Other" / "أخرى"
  const finalReason = reason === otherLabel ? customReason.trim() : reason;
  const canSubmit   = amount != null && amount > 0 && finalReason.length > 0;

  function handleSubmit() {
    if (!canSubmit || !cashierSession) return;

    addCashMovement({
      type,
      amount: amount!,
      reason: finalReason,
      note: note.trim(),
      timestamp: new Date(),
      cashierName: cashierSession.cashierName,
    });

    onClose();
  }

  const currentTotal = cashDrawerTotal();

  return (
    <Modal
      open={open}
      onCancel={onClose}
      closeIcon={null}
      footer={null}
      width="min(420px, 95vw)"
      centered
      title={null}
      styles={{ body: { padding: 0 } }}
    >
      {/* Header */}
      <div style={{
        position: "relative",
        background: `linear-gradient(135deg, ${color}, ${color}cc)`,
        padding: "20px 24px 16px",
        borderRadius: "8px 8px 0 0",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        gap: 12,
        direction: isRTL ? "rtl" : "ltr",
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: 10,
          background: "rgba(255,255,255,0.2)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 18,
        }}>
          {icon}
        </div>
        <div>
          <div style={{ fontSize: 16, fontWeight: 800 }}>{label}</div>
          <div style={{ fontSize: 12, opacity: 0.85, marginTop: 2 }}>
            {isIn ? t.cashMovementIn : t.cashMovementOut}
          </div>
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
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.35)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.2)"; }}
        >
          ✕
        </button>
      </div>

      <div dir={isRTL ? "rtl" : "ltr"} style={{ padding: "20px 24px 24px" }}>

        {/* Current drawer balance */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 14px",
          borderRadius: 10,
          background: token.colorFillAlter,
          border: `1px solid ${token.colorBorderSecondary}`,
          marginBottom: 20,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: token.colorTextSecondary }}>
            <WalletOutlined />
            <span>{t.balance}</span>
          </div>
          <span style={{ fontSize: 16, fontWeight: 800, color: token.colorText }}>
            ${currentTotal.toFixed(2)}
          </span>
        </div>

        {/* Amount */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: token.colorTextSecondary, marginBottom: 6 }}>
            {t.amount} <span style={{ color: "#EF4444" }}>*</span>
          </div>
          <InputNumber
            value={amount}
            onChange={(v) => setAmount(v)}
            min={0.01}
            precision={2}
            prefix={<span style={{ color: color, fontWeight: 700 }}>$</span>}
            style={{ width: "100%", borderRadius: 8, fontSize: 18, fontWeight: 700 }}
            size="large"
            placeholder="0.00"
          />
          {amount != null && amount > 0 && (
            <div style={{
              marginTop: 6,
              fontSize: 12,
              color: token.colorTextSecondary,
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}>
              New balance:
              <strong style={{ color }}>
                ${(isIn ? currentTotal + amount : currentTotal - amount).toFixed(2)}
              </strong>
              {!isIn && currentTotal - amount < 0 && (
                <Tag color="error" style={{ fontSize: 10, borderRadius: 4, marginLeft: 4 }}>
                  Negative balance
                </Tag>
              )}
            </div>
          )}
        </div>

        {/* Reason */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: token.colorTextSecondary, marginBottom: 6 }}>
            {t.reason} <span style={{ color: "#EF4444" }}>*</span>
          </div>
          <Select
            value={reason || undefined}
            onChange={setReason}
            placeholder="Select a reason…"
            style={{ width: "100%", borderRadius: 8 }}
            size="large"
          >
            {reasons.map((r) => (
              <Option key={r} value={r}>{r}</Option>
            ))}
          </Select>
          {reason === otherLabel && (
            <Input
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
              placeholder="Describe the reason…"
              style={{ marginTop: 8, borderRadius: 8 }}
              maxLength={100}
            />
          )}
        </div>

        {/* Note */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: token.colorTextSecondary, marginBottom: 6 }}>
            {t.noteOptional}
          </div>
          <TextArea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
            placeholder="Additional notes…"
            style={{ borderRadius: 8 }}
            maxLength={200}
          />
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 8 }}>
          <Button block onClick={onClose} style={{ borderRadius: 8, height: 44 }}>
            {t.cancel}
          </Button>
          <Button
            type="primary"
            block
            onClick={handleSubmit}
            disabled={!canSubmit}
            style={{
              borderRadius: 8,
              height: 44,
              fontWeight: 700,
              background: canSubmit ? color : undefined,
              border: "none",
            }}
          >
            {t.recordMovement}
          </Button>
        </div>

        {/* Cashier stamp */}
        {cashierSession && (
          <div style={{
            marginTop: 14,
            fontSize: 11,
            color: token.colorTextTertiary,
            textAlign: "center",
          }}>
            Cashier: <strong>{cashierSession.cashierName}</strong> · {new Date().toLocaleTimeString()}
          </div>
        )}
      </div>
    </Modal>
  );
}
