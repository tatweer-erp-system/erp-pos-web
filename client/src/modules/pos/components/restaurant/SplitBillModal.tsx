import { useState } from "react";
import { Modal, InputNumber, Button, Tabs, Select, Divider, theme as antTheme, message, Tag } from "antd";
import { ScissorOutlined, TeamOutlined } from "@ant-design/icons";
import type { CartItem } from "../../store/posStore";
import { useAppSettings } from "@/contexts/AppSettingsContext";
import { usePOSTranslations } from "../../i18n/translations";

interface SplitBillModalProps {
  open: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  grandTotal: number;
  isMobile: boolean;
}

export function SplitBillModal({ open, onClose, cartItems, grandTotal, isMobile }: SplitBillModalProps) {
  const { token } = antTheme.useToken();
  const { language } = useAppSettings();
  const t = usePOSTranslations(language);
  const isRTL = language === "ar";

  // Equal split
  const [ways, setWays] = useState(2);

  // By-items split
  const [billCount, setBillCount] = useState(2);
  const [itemBills, setItemBills] = useState<Record<string, number>>(() =>
    Object.fromEntries(cartItems.map((i) => [i.product.id, 1]))
  );

  const amountPerPerson = ways > 0 ? grandTotal / ways : 0;

  function billTotal(billNum: number): number {
    return cartItems
      .filter((item) => itemBills[item.product.id] === billNum)
      .reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }

  function handleProcess() {
    message.success(`Bill split into ${ways} parts of $${amountPerPerson.toFixed(2)} each`);
    onClose();
  }

  function handleProcessByItems() {
    message.success(`Bill split into ${billCount} separate payments`);
    onClose();
  }

  const BILL_COLORS = ["#6366F1", "#10B981", "#F59E0B", "#EF4444"];

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      title={null}
      width={isMobile ? "95vw" : 520}
      styles={{ body: { padding: 0 } }}
      centered
    >
      {/* Header */}
      <div style={{
        background: `linear-gradient(135deg, #6366F1, #8B5CF6)`,
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
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
        }}>
          <ScissorOutlined />
        </div>
        <div>
          <div style={{ fontSize: 16, fontWeight: 800 }}>{t.splitBill}</div>
          <div style={{ fontSize: 12, opacity: 0.85 }}>Total: ${grandTotal.toFixed(2)}</div>
        </div>
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 14,
            insetInlineEnd: 14,
            width: 28, height: 28,
            border: "none",
            background: "rgba(255,255,255,0.2)",
            borderRadius: 6,
            color: "#fff",
            cursor: "pointer",
            fontSize: 14,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          ✕
        </button>
      </div>

      <div style={{ padding: "20px 24px 24px" }} dir={isRTL ? "rtl" : "ltr"}>
        <Tabs
          defaultActiveKey="equal"
          items={[
            {
              key: "equal",
              label: t.splitEqually,
              children: (
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "14px 16px",
                    background: token.colorFillAlter,
                    borderRadius: 10,
                    border: `1px solid ${token.colorBorderSecondary}`,
                  }}>
                    <TeamOutlined style={{ fontSize: 18, color: "#6366F1" }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: token.colorText }}>{t.numberOfWays}</div>
                      <div style={{ fontSize: 11, color: token.colorTextSecondary, marginTop: 2 }}>Split the total equally between guests</div>
                    </div>
                    <InputNumber
                      min={2}
                      max={10}
                      value={ways}
                      onChange={(v) => setWays(v ?? 2)}
                      style={{ width: 80 }}
                    />
                  </div>

                  {/* Per-person amounts */}
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
                    gap: 8,
                  }}>
                    {Array.from({ length: ways }, (_, i) => (
                      <div key={i} style={{
                        padding: "12px 8px",
                        background: `${BILL_COLORS[i % BILL_COLORS.length]}10`,
                        border: `1px solid ${BILL_COLORS[i % BILL_COLORS.length]}30`,
                        borderRadius: 10,
                        textAlign: "center",
                      }}>
                        <div style={{ fontSize: 11, color: token.colorTextSecondary, marginBottom: 4 }}>{t.bill(i + 1)}</div>
                        <div style={{ fontSize: 16, fontWeight: 800, color: BILL_COLORS[i % BILL_COLORS.length] }}>
                          ${amountPerPerson.toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>

                  <Divider style={{ margin: "4px 0" }} />

                  <Button
                    type="primary"
                    block
                    onClick={handleProcess}
                    style={{
                      height: 44, fontWeight: 700,
                      background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
                      border: "none", borderRadius: 10,
                    }}
                    icon={<ScissorOutlined />}
                  >
                    {t.processSplit}
                  </Button>
                </div>
              ),
            },
            {
              key: "items",
              label: t.splitByItems,
              children: (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {/* Bill count */}
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: token.colorText }}>Number of bills:</span>
                    <Select
                      value={billCount}
                      onChange={(v) => {
                        setBillCount(v);
                        setItemBills(Object.fromEntries(cartItems.map((i) => [i.product.id, 1])));
                      }}
                      style={{ width: 100 }}
                      options={[2, 3, 4].map((n) => ({ value: n, label: `${n} bills` }))}
                    />
                  </div>

                  {/* Bill totals */}
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {Array.from({ length: billCount }, (_, i) => (
                      <Tag key={i} style={{
                        background: `${BILL_COLORS[i % BILL_COLORS.length]}12`,
                        border: `1px solid ${BILL_COLORS[i % BILL_COLORS.length]}40`,
                        color: BILL_COLORS[i % BILL_COLORS.length],
                        fontWeight: 700, fontSize: 12, padding: "4px 10px",
                      }}>
                        {t.bill(i + 1)}: ${billTotal(i + 1).toFixed(2)}
                      </Tag>
                    ))}
                  </div>

                  {/* Items assignment */}
                  <div style={{
                    maxHeight: 240,
                    overflowY: "auto",
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                  }}>
                    {cartItems.map((item) => {
                      const billNum = itemBills[item.product.id] ?? 1;
                      const billColor = BILL_COLORS[(billNum - 1) % BILL_COLORS.length];
                      return (
                        <div key={item.product.id} style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          padding: "10px 12px",
                          background: `${billColor}08`,
                          border: `1px solid ${billColor}25`,
                          borderRadius: 10,
                          transition: "all 0.15s",
                        }}>
                          <div style={{
                            width: 28, height: 28, borderRadius: 8,
                            background: `linear-gradient(135deg, ${item.product.color}, ${item.product.color}bb)`,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            color: "#fff", fontSize: 11, fontWeight: 800, flexShrink: 0,
                          }}>
                            {item.quantity}×
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 12, fontWeight: 600, color: token.colorText, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {item.product.name}
                            </div>
                            <div style={{ fontSize: 11, color: token.colorTextSecondary }}>
                              ${(item.product.price * item.quantity).toFixed(2)}
                            </div>
                          </div>
                          <Select
                            value={billNum}
                            onChange={(v) => setItemBills((prev) => ({ ...prev, [item.product.id]: v }))}
                            style={{ width: 90 }}
                            size="small"
                            options={Array.from({ length: billCount }, (_, i) => ({
                              value: i + 1,
                              label: t.bill(i + 1),
                            }))}
                          />
                        </div>
                      );
                    })}
                  </div>

                  <Divider style={{ margin: "4px 0" }} />

                  <Button
                    type="primary"
                    block
                    onClick={handleProcessByItems}
                    style={{
                      height: 44, fontWeight: 700,
                      background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
                      border: "none", borderRadius: 10,
                    }}
                    icon={<ScissorOutlined />}
                  >
                    {t.processSplit}
                  </Button>
                </div>
              ),
            },
          ]}
        />
      </div>
    </Modal>
  );
}
