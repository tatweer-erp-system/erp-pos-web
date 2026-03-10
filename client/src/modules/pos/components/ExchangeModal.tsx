import { useState } from "react";
import {
  Modal, Steps, Input, Button, Space, Alert, Descriptions, Tag,
  Divider, theme as antTheme, Checkbox, Select, InputNumber,
} from "antd";
import {
  SearchOutlined,
  SwapOutlined,
  CheckCircleOutlined,
  PlusOutlined,
  MinusOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import { useAppSettings } from "@/contexts/AppSettingsContext";
import { usePOSTranslations } from "../i18n/translations";
import { mockProducts } from "../data/mockProducts";

// ── Mock past orders (same as RefundModal) ───────────────────────────────────
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
      { id: "p1", name: "Coffee", qty: 2, price: 4.5 },
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

// ── New item selection state ──────────────────────────────────────────────────
interface NewItem {
  productId: string;
  name: string;
  price: number;
  qty: number;
}

interface ExchangeModalProps {
  open: boolean;
  onClose: () => void;
}

type ExchangeStep = "lookup" | "select" | "new-items" | "done";

export function ExchangeModal({ open, onClose }: ExchangeModalProps) {
  const { token } = antTheme.useToken();
  const { language } = useAppSettings();
  const t = usePOSTranslations(language);

  const [step, setStep] = useState<ExchangeStep>("lookup");
  const [receiptInput, setReceiptInput] = useState("");
  const [foundOrder, setFoundOrder] = useState<MockOrder | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [returnedItemIds, setReturnedItemIds] = useState<Set<string>>(new Set());
  const [newItems, setNewItems] = useState<NewItem[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [processing, setProcessing] = useState(false);

  function handleLookup() {
    const order = MOCK_ORDERS.find(
      (o) => o.id.toLowerCase() === receiptInput.trim().toLowerCase()
    );
    if (order) {
      setFoundOrder(order);
      setNotFound(false);
      setReturnedItemIds(new Set(order.items.map((i) => i.id)));
      setStep("select");
    } else {
      setNotFound(true);
      setFoundOrder(null);
    }
  }

  function toggleReturnItem(id: string) {
    setReturnedItemIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function addNewItem() {
    if (!selectedProductId) return;
    const product = mockProducts.find((p) => p.id === selectedProductId);
    if (!product) return;
    setNewItems((prev) => {
      const existing = prev.find((i) => i.productId === selectedProductId);
      if (existing) {
        return prev.map((i) => i.productId === selectedProductId ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { productId: product.id, name: product.name, price: product.price, qty: 1 }];
    });
    setSelectedProductId("");
  }

  function updateNewItemQty(productId: string, qty: number) {
    if (qty <= 0) {
      setNewItems((prev) => prev.filter((i) => i.productId !== productId));
    } else {
      setNewItems((prev) => prev.map((i) => i.productId === productId ? { ...i, qty } : i));
    }
  }

  function handleProcess() {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setStep("done");
    }, 1200);
  }

  function handleClose() {
    setStep("lookup");
    setReceiptInput("");
    setFoundOrder(null);
    setNotFound(false);
    setReturnedItemIds(new Set());
    setNewItems([]);
    setSelectedProductId("");
    onClose();
  }

  // ── Computed totals ─────────────────────────────────────────────────────────
  const returnTotal = foundOrder
    ? foundOrder.items
        .filter((i) => returnedItemIds.has(i.id))
        .reduce((sum, i) => sum + i.price * i.qty, 0)
    : 0;

  const newTotal = newItems.reduce((sum, i) => sum + i.price * i.qty, 0);
  const diff = newTotal - returnTotal; // positive = customer owes, negative = credit

  const stepIndex = step === "lookup" ? 0 : step === "select" ? 1 : step === "new-items" ? 2 : 3;

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      title={
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <SwapOutlined style={{ color: token.colorPrimary, fontSize: 18 }} />
          <span style={{ fontSize: 16, fontWeight: 700 }}>{t.processExchange}</span>
        </div>
      }
      footer={null}
      width={560}
      destroyOnClose
    >
      <Steps
        current={stepIndex}
        size="small"
        style={{ marginBottom: 24 }}
        items={[
          { title: t.receiptNumber },
          { title: t.itemsToReturn },
          { title: t.newItems },
          { title: t.done },
        ]}
      />

      {/* Step 1: Lookup */}
      {step === "lookup" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 13, color: token.colorTextSecondary }}>{t.receiptNumber}</div>
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
            <Alert type="error" message={t.receiptNotFound} showIcon style={{ borderRadius: 8 }} />
          )}
        </div>
      )}

      {/* Step 2: Select items to return */}
      {step === "select" && foundOrder && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Descriptions size="small" bordered column={1} style={{ borderRadius: 8, overflow: "hidden" }}>
            <Descriptions.Item label="Order">{foundOrder.id}</Descriptions.Item>
            <Descriptions.Item label="Date">{foundOrder.date}</Descriptions.Item>
          </Descriptions>

          <div>
            <div style={{ fontSize: 12, color: token.colorTextSecondary, marginBottom: 8, fontWeight: 600 }}>
              {t.selectItemsToReturn}
            </div>
            {foundOrder.items.map((item) => (
              <div
                key={item.id}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "10px 12px", borderRadius: 8, marginBottom: 4,
                  background: returnedItemIds.has(item.id) ? `${token.colorError}08` : token.colorFillAlter,
                  border: `1px solid ${returnedItemIds.has(item.id) ? `${token.colorError}30` : token.colorBorderSecondary}`,
                  cursor: "pointer",
                }}
                onClick={() => toggleReturnItem(item.id)}
              >
                <Checkbox checked={returnedItemIds.has(item.id)} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{item.name}</div>
                  <div style={{ fontSize: 11, color: token.colorTextSecondary }}>
                    {item.qty}× ${item.price.toFixed(2)}
                  </div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: token.colorError }}>
                  ${(item.qty * item.price).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <div style={{
            display: "flex", justifyContent: "space-between",
            padding: "8px 12px", borderRadius: 8,
            background: token.colorFillAlter, fontSize: 13,
          }}>
            <span style={{ color: token.colorTextSecondary }}>{t.itemsToReturn}</span>
            <span style={{ fontWeight: 700, color: token.colorError }}>−${returnTotal.toFixed(2)}</span>
          </div>

          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <Button onClick={() => setStep("lookup")}>{t.back}</Button>
            <Button
              type="primary"
              disabled={returnedItemIds.size === 0}
              onClick={() => setStep("new-items")}
            >
              {t.newItems} →
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Select new items */}
      {step === "new-items" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <div style={{ fontSize: 12, color: token.colorTextSecondary, marginBottom: 8, fontWeight: 600 }}>
              {t.newItems}
            </div>
            <Space.Compact style={{ width: "100%" }}>
              <Select
                showSearch
                value={selectedProductId || undefined}
                onChange={setSelectedProductId}
                placeholder="Search product..."
                style={{ flex: 1 }}
                filterOption={(input, option) =>
                  (option?.label as string ?? "").toLowerCase().includes(input.toLowerCase())
                }
                options={mockProducts.map((p) => ({
                  value: p.id,
                  label: `${p.name} — $${p.price.toFixed(2)}`,
                }))}
              />
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={addNewItem}
                disabled={!selectedProductId}
                style={{ borderRadius: "0 8px 8px 0" }}
              >
                {t.add}
              </Button>
            </Space.Compact>
          </div>

          {newItems.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {newItems.map((item) => (
                <div
                  key={item.productId}
                  style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "8px 12px", borderRadius: 8,
                    background: `${token.colorSuccess}08`,
                    border: `1px solid ${token.colorSuccess}30`,
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{item.name}</div>
                    <div style={{ fontSize: 11, color: token.colorTextSecondary }}>${item.price.toFixed(2)} each</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <Button
                      size="small"
                      icon={<MinusOutlined />}
                      onClick={() => updateNewItemQty(item.productId, item.qty - 1)}
                      style={{ width: 26, height: 26, padding: 0, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}
                    />
                    <span style={{ fontSize: 13, fontWeight: 700, minWidth: 20, textAlign: "center" }}>{item.qty}</span>
                    <Button
                      size="small"
                      icon={<PlusOutlined />}
                      onClick={() => updateNewItemQty(item.productId, item.qty + 1)}
                      style={{ width: 26, height: 26, padding: 0, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}
                    />
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: token.colorSuccess, minWidth: 55, textAlign: "right" }}>
                    ${(item.price * item.qty).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          )}

          <Divider style={{ margin: "4px 0" }} />

          {/* Price difference summary */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: token.colorTextSecondary }}>
              <span>{t.itemsToReturn}</span>
              <span style={{ color: token.colorError }}>−${returnTotal.toFixed(2)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: token.colorTextSecondary }}>
              <span>{t.newItems}</span>
              <span style={{ color: token.colorSuccess }}>+${newTotal.toFixed(2)}</span>
            </div>
            <div style={{
              display: "flex", justifyContent: "space-between",
              padding: "10px 14px", borderRadius: 10, marginTop: 4,
              background: diff === 0
                ? `${token.colorSuccess}12`
                : diff > 0
                  ? `${token.colorError}10`
                  : `${token.colorWarning}10`,
              border: `1.5px solid ${diff === 0 ? token.colorSuccess : diff > 0 ? token.colorError : token.colorWarning}30`,
            }}>
              <span style={{ fontSize: 14, fontWeight: 700 }}>{t.exchangeDifference}</span>
              <div style={{ textAlign: "right" }}>
                {diff === 0 && <Tag color="success">{t.evenExchange}</Tag>}
                {diff > 0 && (
                  <div>
                    <div style={{ fontSize: 11, color: token.colorTextSecondary }}>{t.collectAmount}</div>
                    <div style={{ fontSize: 18, fontWeight: 900, color: token.colorError }}>${diff.toFixed(2)}</div>
                  </div>
                )}
                {diff < 0 && (
                  <div>
                    <div style={{ fontSize: 11, color: token.colorTextSecondary }}>{t.creditAmount}</div>
                    <div style={{ fontSize: 18, fontWeight: 900, color: token.colorWarning }}>${Math.abs(diff).toFixed(2)}</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <Button onClick={() => setStep("select")}>{t.back}</Button>
            <Button
              type="primary"
              loading={processing}
              icon={<SwapOutlined />}
              onClick={handleProcess}
            >
              {t.processExchange}
              {diff !== 0 && ` — ${diff > 0 ? "Collect" : "Credit"} $${Math.abs(diff).toFixed(2)}`}
            </Button>
          </div>
        </div>
      )}

      {/* Step 4: Done */}
      {step === "done" && foundOrder && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, padding: "24px 0 8px" }}>
          <CheckCircleOutlined style={{ fontSize: 52, color: token.colorSuccess }} />

          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: token.colorText, marginBottom: 6 }}>
              {t.exchangeSuccess}
            </div>
            {diff === 0 && <Tag color="success" style={{ fontSize: 13 }}>{t.evenExchange}</Tag>}
            {diff > 0 && (
              <div>
                <div style={{ fontSize: 11, color: token.colorTextSecondary }}>{t.collectAmount}</div>
                <div style={{ fontSize: 22, fontWeight: 900, color: token.colorError }}>${diff.toFixed(2)}</div>
              </div>
            )}
            {diff < 0 && (
              <div>
                <div style={{ fontSize: 11, color: token.colorTextSecondary }}>{t.creditAmount}</div>
                <div style={{ fontSize: 22, fontWeight: 900, color: token.colorWarning }}>${Math.abs(diff).toFixed(2)}</div>
              </div>
            )}
          </div>

          {/* Exchange summary */}
          <div style={{
            width: "100%", background: token.colorFillAlter, borderRadius: 10,
            padding: "10px 14px", border: `1px solid ${token.colorBorderSecondary}`,
            display: "flex", flexDirection: "column", gap: 6,
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: token.colorTextSecondary, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              {t.itemsToReturn}
            </div>
            {foundOrder.items
              .filter((i) => returnedItemIds.has(i.id))
              .map((i) => (
                <div key={i.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                  <span>{i.qty}× {i.name}</span>
                  <span style={{ color: token.colorError }}>−${(i.qty * i.price).toFixed(2)}</span>
                </div>
              ))}
            {newItems.length > 0 && (
              <>
                <Divider style={{ margin: "4px 0" }} />
                <div style={{ fontSize: 11, fontWeight: 700, color: token.colorTextSecondary, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  {t.newItems}
                </div>
                {newItems.map((i) => (
                  <div key={i.productId} style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                    <span>{i.qty}× {i.name}</span>
                    <span style={{ color: token.colorSuccess }}>+${(i.qty * i.price).toFixed(2)}</span>
                  </div>
                ))}
              </>
            )}
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <Button icon={<PrinterOutlined />} onClick={() => window.print()}>
              {t.printReceipt}
            </Button>
            <Button type="primary" onClick={handleClose}>{t.done}</Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
