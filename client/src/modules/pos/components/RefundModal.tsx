import { useState } from "react";
import {
  Modal, Steps, Input, Button, Radio, Select,
  InputNumber, Alert, Tag, Divider,
  theme as antTheme, Space, Checkbox,
} from "antd";
import {
  SearchOutlined,
  RollbackOutlined,
  CheckCircleOutlined,
  SafetyOutlined,
  PrinterOutlined,
  MinusOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useAppSettings } from "@/contexts/AppSettingsContext";
import { usePOSTranslations } from "../i18n/translations";

interface MockOrderItem {
  id: string;
  name: string;
  qty: number;
  price: number;
}
interface MockOrder {
  id: string;
  date: string;
  items: MockOrderItem[];
  total: number;
  paymentMethod: string;
}

const MOCK_ORDERS: MockOrder[] = [
  {
    id: "ORD-1001",
    date: "2026-03-08 14:22",
    items: [
      { id: "p1", name: "Coffee",    qty: 2, price: 4.5  },
      { id: "p2", name: "Croissant", qty: 1, price: 3.75 },
    ],
    total: 12.75,
    paymentMethod: "card",
  },
  {
    id: "ORD-1002",
    date: "2026-03-09 09:15",
    items: [{ id: "p3", name: "Burger Meal", qty: 1, price: 14.99 }],
    total: 14.99,
    paymentMethod: "cash",
  },
];

interface RefundModalProps {
  open: boolean;
  onClose: () => void;
}

type RefundStep   = "lookup" | "review" | "done";
type RefundMethod = "original" | "cash" | "credit";

export function RefundModal({ open, onClose }: RefundModalProps) {
  const { token } = antTheme.useToken();
  const { language } = useAppSettings();
  const t = usePOSTranslations(language);

  const [step,         setStep]         = useState<RefundStep>("lookup");
  const [receiptInput, setReceiptInput] = useState("");
  const [foundOrder,   setFoundOrder]   = useState<MockOrder | null>(null);
  const [notFound,     setNotFound]     = useState(false);

  // Per-item qty to refund (0 = not selected)
  const [selectedQtys, setSelectedQtys] = useState<Record<string, number>>({});
  const [useCustomAmt, setUseCustomAmt] = useState(false);
  const [customAmount, setCustomAmount] = useState<number>(0);

  const [refundMethod, setRefundMethod] = useState<RefundMethod>("original");
  const [refundReason, setRefundReason] = useState<string>("");
  const [processing,   setProcessing]   = useState(false);

  // ── Computed totals ──────────────────────────────────────────────────────
  const itemsTotal = foundOrder
    ? foundOrder.items.reduce((s, i) => s + i.price * (selectedQtys[i.id] ?? 0), 0)
    : 0;
  const refundAmount = useCustomAmt ? customAmount : itemsTotal;
  const anySelected  = itemsTotal > 0;

  function initSelection(order: MockOrder) {
    const init: Record<string, number> = {};
    order.items.forEach((i) => { init[i.id] = i.qty; });
    setSelectedQtys(init);
    setCustomAmount(order.total);
  }

  function adjustQty(itemId: string, delta: number, maxQty: number) {
    setSelectedQtys((prev) => {
      const cur  = prev[itemId] ?? 0;
      const next = Math.max(0, Math.min(maxQty, cur + delta));
      return { ...prev, [itemId]: next };
    });
    setUseCustomAmt(false);
  }

  function handleLookup() {
    const order = MOCK_ORDERS.find(
      (o) => o.id.toLowerCase() === receiptInput.trim().toLowerCase()
    );
    if (order) {
      setFoundOrder(order);
      initSelection(order);
      setNotFound(false);
      setStep("review");
    } else {
      setNotFound(true);
      setFoundOrder(null);
    }
  }

  function handleProcess() {
    if (!refundReason || refundAmount <= 0) return;
    setProcessing(true);
    setTimeout(() => { setProcessing(false); setStep("done"); }, 1200);
  }

  function handleClose() {
    setStep("lookup");
    setReceiptInput("");
    setFoundOrder(null);
    setNotFound(false);
    setSelectedQtys({});
    setUseCustomAmt(false);
    setCustomAmount(0);
    setRefundMethod("original");
    setRefundReason("");
    onClose();
  }

  const stepIndex = step === "lookup" ? 0 : step === "review" ? 1 : 2;

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      closeIcon={null}
      footer={null}
      width={540}
      centered
      title={null}
      styles={{ body: { padding: 0 } }}
      destroyOnClose
    >
      {/* Header */}
      <div style={{
        position: "relative",
        background: `linear-gradient(135deg, ${token.colorError}, ${token.colorError}cc)`,
        padding: "20px 24px 16px",
        borderRadius: "8px 8px 0 0",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        gap: 12,
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: 10,
          background: "rgba(255,255,255,0.2)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 18,
        }}>
          <RollbackOutlined />
        </div>
        <div>
          <div style={{ fontSize: 16, fontWeight: 800 }}>{t.processRefund}</div>
          <div style={{ fontSize: 12, opacity: 0.85, marginTop: 2 }}>
            {t.refundManagerRequired}
          </div>
        </div>
        <button
          onClick={handleClose}
          style={{
            position: "absolute", top: 14, insetInlineEnd: 14,
            width: 28, height: 28, borderRadius: "50%",
            background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.3)",
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontSize: 13, lineHeight: 1, transition: "background 0.15s", padding: 0,
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.35)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.2)"; }}
        >✕</button>
      </div>

      <div style={{ padding: "20px 24px 24px" }}>
      <Steps
        current={stepIndex}
        size="small"
        style={{ marginBottom: 20 }}
        items={[
          { title: t.receiptNumber },
          { title: t.refund },
          { title: t.done },
        ]}
      />

      {/* ── Step 1: Lookup ───────────────────────────────────────────────── */}
      {step === "lookup" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <div style={{ fontSize: 13, color: token.colorTextSecondary, marginBottom: 8 }}>
              {t.receiptNumber}
            </div>
            <Space.Compact style={{ width: "100%" }}>
              <Input
                placeholder="ORD-1001"
                value={receiptInput}
                onChange={(e) => { setReceiptInput(e.target.value); setNotFound(false); }}
                onPressEnter={handleLookup}
                style={{ borderRadius: "8px 0 0 8px" }}
              />
              <Button
                type="primary"
                icon={<SearchOutlined />}
                onClick={handleLookup}
                style={{ borderRadius: "0 8px 8px 0" }}
              >
                {t.lookupReceipt}
              </Button>
            </Space.Compact>
            {notFound && (
              <Alert type="error" message={t.receiptNotFound} showIcon
                style={{ marginTop: 10, borderRadius: 8 }} />
            )}
          </div>
          <Alert
            type="warning"
            icon={<SafetyOutlined />}
            message={t.refundManagerRequired}
            showIcon
            style={{ borderRadius: 8 }}
          />
        </div>
      )}

      {/* ── Step 2: Review & configure ───────────────────────────────────── */}
      {step === "review" && foundOrder && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Order header */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "10px 14px", borderRadius: 10,
            background: `${token.colorError}06`, border: `1px solid ${token.colorError}20`,
          }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: token.colorText }}>{foundOrder.id}</div>
              <div style={{ fontSize: 11, color: token.colorTextSecondary, marginTop: 1 }}>{foundOrder.date}</div>
            </div>
            <Tag color={foundOrder.paymentMethod === "cash" ? "green" : "blue"} style={{ borderRadius: 6, fontWeight: 700, fontSize: 11 }}>
              {foundOrder.paymentMethod.toUpperCase()}
            </Tag>
          </div>

          <Divider style={{ margin: "4px 0" }} />

          {/* Per-item selection */}
          <div>
            <div style={{ fontSize: 12, color: token.colorTextSecondary, marginBottom: 8, fontWeight: 600 }}>
              {t.refundItemsLabel}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {foundOrder.items.map((item) => {
                const selQty    = selectedQtys[item.id] ?? 0;
                const isChecked = selQty > 0;
                return (
                  <div
                    key={item.id}
                    style={{
                      display: "flex", alignItems: "center", gap: 10,
                      padding: "10px 12px", borderRadius: 8,
                      background: isChecked ? `${token.colorError}08` : token.colorFillAlter,
                      border: `1px solid ${isChecked ? `${token.colorError}30` : token.colorBorderSecondary}`,
                      transition: "all 0.15s",
                    }}
                  >
                    <Checkbox
                      checked={isChecked}
                      onChange={(e) => {
                        setSelectedQtys((prev) => ({ ...prev, [item.id]: e.target.checked ? item.qty : 0 }));
                        setUseCustomAmt(false);
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{item.name}</div>
                      <div style={{ fontSize: 11, color: token.colorTextSecondary }}>
                        ${item.price.toFixed(2)} · max {item.qty}
                      </div>
                    </div>
                    {/* Qty stepper */}
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <Button
                        size="small"
                        icon={<MinusOutlined />}
                        disabled={selQty <= 0}
                        onClick={() => adjustQty(item.id, -1, item.qty)}
                        style={{ width: 26, height: 26, padding: 0, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}
                      />
                      <span style={{ fontSize: 13, fontWeight: 700, minWidth: 20, textAlign: "center" }}>
                        {selQty}
                      </span>
                      <Button
                        size="small"
                        icon={<PlusOutlined />}
                        disabled={selQty >= item.qty}
                        onClick={() => adjustQty(item.id, 1, item.qty)}
                        style={{ width: 26, height: 26, padding: 0, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}
                      />
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: token.colorError, minWidth: 58, textAlign: "right" }}>
                      ${(item.price * selQty).toFixed(2)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Items subtotal row */}
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "8px 12px", borderRadius: 8, background: token.colorFillAlter, fontSize: 13,
          }}>
            <span style={{ color: token.colorTextSecondary }}>{t.refundAmount}</span>
            <span style={{ fontWeight: 700, fontSize: 15, color: token.colorError }}>
              −${itemsTotal.toFixed(2)}
            </span>
          </div>

          {/* Custom amount override */}
          <div>
            <Checkbox
              checked={useCustomAmt}
              onChange={(e) => {
                setUseCustomAmt(e.target.checked);
                if (e.target.checked) setCustomAmount(itemsTotal > 0 ? itemsTotal : foundOrder.total);
              }}
              style={{ fontSize: 12, color: token.colorTextSecondary }}
            >
              {t.customAmount}
            </Checkbox>
            {useCustomAmt && (
              <InputNumber
                prefix="$"
                min={0.01}
                max={foundOrder.total}
                precision={2}
                value={customAmount}
                onChange={(v) => setCustomAmount(v ?? 0)}
                style={{ marginTop: 8, width: "100%", borderRadius: 8 }}
                autoFocus
              />
            )}
          </div>

          <Divider style={{ margin: "4px 0" }} />

          {/* Refund method */}
          <div>
            <div style={{ fontSize: 12, color: token.colorTextSecondary, marginBottom: 6, fontWeight: 600 }}>
              {t.refundMethod}
            </div>
            <Radio.Group value={refundMethod} onChange={(e) => setRefundMethod(e.target.value)}>
              <Space direction="vertical" size={4}>
                <Radio value="original">{t.refundToOriginal}</Radio>
                <Radio value="cash">{t.refundToCash}</Radio>
                <Radio value="credit">{t.refundToCredit}</Radio>
              </Space>
            </Radio.Group>
          </div>

          {/* Reason */}
          <div>
            <div style={{ fontSize: 12, color: token.colorTextSecondary, marginBottom: 6, fontWeight: 600 }}>
              {t.refundReason} *
            </div>
            <Select
              value={refundReason || undefined}
              onChange={setRefundReason}
              placeholder={t.selectRefundReason}
              style={{ width: "100%", borderRadius: 8 }}
              options={t.refundReasons.map((r) => ({ label: r, value: r }))}
            />
          </div>

          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <Button onClick={() => setStep("lookup")}>{t.back}</Button>
            <Button
              type="primary"
              danger
              loading={processing}
              disabled={!refundReason || !anySelected || refundAmount <= 0}
              icon={<RollbackOutlined />}
              onClick={handleProcess}
            >
              {t.processRefund} — ${refundAmount.toFixed(2)}
            </Button>
          </div>
        </div>
      )}

      {/* ── Step 3: Done ─────────────────────────────────────────────────── */}
      {step === "done" && foundOrder && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, padding: "24px 0 8px" }}>
          <CheckCircleOutlined style={{ fontSize: 52, color: token.colorSuccess }} />

          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: token.colorText, marginBottom: 4 }}>
              {t.refundSuccess}
            </div>
            <div style={{ fontSize: 24, fontWeight: 900, color: token.colorError }}>
              −${refundAmount.toFixed(2)}
            </div>
            <div style={{ fontSize: 12, color: token.colorTextSecondary, marginTop: 4 }}>
              {refundMethod === "original" ? t.refundToOriginal
                : refundMethod === "cash"   ? t.refundToCash
                : t.refundToCredit}
            </div>
          </div>

          {/* Refunded items summary */}
          <div style={{
            width: "100%", background: token.colorFillAlter, borderRadius: 10,
            padding: "10px 14px", border: `1px solid ${token.colorBorderSecondary}`,
          }}>
            {foundOrder.items
              .filter((i) => (selectedQtys[i.id] ?? 0) > 0)
              .map((i) => (
                <div key={i.id} style={{
                  display: "flex", justifyContent: "space-between",
                  fontSize: 12, padding: "4px 0",
                  borderBottom: `1px solid ${token.colorBorderSecondary}`,
                }}>
                  <span>{selectedQtys[i.id]}× {i.name}</span>
                  <span style={{ fontWeight: 600, color: token.colorError }}>
                    −${(i.price * (selectedQtys[i.id] ?? 0)).toFixed(2)}
                  </span>
                </div>
              ))}
            <div style={{
              display: "flex", justifyContent: "space-between",
              fontSize: 12, paddingTop: 6, color: token.colorTextSecondary,
            }}>
              <span>{t.refundReason}</span>
              <span style={{ fontWeight: 600, color: token.colorText }}>{refundReason}</span>
            </div>
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <Button icon={<PrinterOutlined />} onClick={() => window.print()}>
              {t.printReceipt}
            </Button>
            <Button type="primary" onClick={handleClose}>{t.done}</Button>
          </div>
        </div>
      )}
      </div>
    </Modal>
  );
}
