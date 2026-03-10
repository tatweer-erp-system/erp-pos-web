import { useState, useMemo, useEffect } from "react";
import {
  Modal,
  Checkbox,
  Button,
  Radio,
  Tag,
  Divider,
  theme as antTheme,
  Avatar,
} from "antd";
import {
  MergeCellsOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { usePOSStore, TAX_RATE } from "../../store/posStore";

interface MergeOrdersModalProps {
  open: boolean;
  onClose: () => void;
}

export function MergeOrdersModal({ open, onClose }: MergeOrdersModalProps) {
  const { token } = antTheme.useToken();

  const orders      = usePOSStore((s) => s.orders);
  const mergeOrders = usePOSStore((s) => s.mergeOrders);

  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [keepCustomerIdx, setKeepCustomerIdx] = useState<number | null>(null);

  // Reset + pre-select all whenever the modal opens
  useEffect(() => {
    if (open) {
      setSelectedIndices(orders.map((_, i) => i));
      setKeepCustomerIdx(null);
    }
  }, [open]);

  function toggleOrder(index: number) {
    setSelectedIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
    setKeepCustomerIdx(null);
  }

  // Guard: only keep indices that still exist in the orders array
  const selectedOrders = selectedIndices
    .filter((i) => i >= 0 && i < orders.length && orders[i] !== undefined)
    .map((i) => ({ index: i, order: orders[i] }));

  // Check for customer conflict: multiple different non-null customers
  const customersInSelected = selectedOrders
    .map((s) => s.order.attachedCustomer)
    .filter(Boolean);

  const uniqueCustomerIds = new Set(customersInSelected.map((c) => c!.id));
  const hasCustomerConflict = uniqueCustomerIds.size > 1;

  // Combined totals preview
  const mergedItemCount = useMemo(() => {
    const map = new Map<string, number>();
    for (const { order } of selectedOrders) {
      for (const item of order.cartItems) {
        map.set(item.product.id, (map.get(item.product.id) ?? 0) + item.quantity);
      }
    }
    return Array.from(map.values()).reduce((n, q) => n + q, 0);
  }, [selectedIndices, orders]);

  const mergedSubtotal = useMemo(() => {
    const map = new Map<string, { price: number; qty: number }>();
    for (const { order } of selectedOrders) {
      for (const item of order.cartItems) {
        const existing = map.get(item.product.id);
        if (existing) {
          map.set(item.product.id, { price: item.product.price, qty: existing.qty + item.quantity });
        } else {
          map.set(item.product.id, { price: item.product.price, qty: item.quantity });
        }
      }
    }
    return Array.from(map.values()).reduce((sum, { price, qty }) => sum + price * qty, 0);
  }, [selectedIndices, orders]);

  const mergedTotal = mergedSubtotal * (1 + TAX_RATE);

  function handleMerge() {
    if (selectedIndices.length < 2) return;

    let keepFrom: number | undefined;
    if (hasCustomerConflict) {
      if (keepCustomerIdx === null) return; // must choose
      // keepCustomerIdx is a selectedOrders array index, map to actual order index
      keepFrom = keepCustomerIdx;
    }

    mergeOrders(selectedIndices, keepFrom);
    onClose();
  }

  const canMerge =
    selectedIndices.length >= 2 &&
    (!hasCustomerConflict || keepCustomerIdx !== null);

  function getOrderTotal(idx: number) {
    return orders[idx].cartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
  }

  function getOrderItemCount(idx: number) {
    return orders[idx].cartItems.reduce((n, item) => n + item.quantity, 0);
  }

  return (
    <Modal
      open={open}
      onCancel={onClose}
      closeIcon={null}
      footer={null}
      width={480}
      centered
      title={null}
      style={{ padding: 0 }}
    >
      {/* Header */}
      <div style={{
        position: "relative",
        background: `linear-gradient(135deg, ${token.colorPrimary}, ${token.colorPrimary}cc)`,
        padding: "20px 24px 16px",
        borderRadius: "8px 8px 0 0",
        color: "#fff",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <MergeCellsOutlined style={{ fontSize: 22 }} />
          <div>
            <div style={{ fontSize: 16, fontWeight: 800 }}>Merge Orders</div>
            <div style={{ fontSize: 12, opacity: 0.8, marginTop: 1 }}>
              Select 2 or more orders to combine into one
            </div>
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

      <div style={{ padding: "20px 24px 24px" }}>

        {/* Order selection */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: token.colorTextSecondary, marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Select Orders to Merge
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {orders.map((order, i) => {
              const isSelected = selectedIndices.includes(i);
              const itemCount = getOrderItemCount(i);
              const total = getOrderTotal(i);
              const hasCustomer = !!order.attachedCustomer;

              return (
                <div
                  key={order.id}
                  onClick={() => toggleOrder(i)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "12px 14px",
                    borderRadius: 10,
                    cursor: "pointer",
                    border: `1.5px solid ${isSelected ? token.colorPrimary : token.colorBorderSecondary}`,
                    background: isSelected ? `${token.colorPrimary}06` : token.colorBgContainer,
                    transition: "all 0.15s",
                  }}
                >
                  <Checkbox
                    checked={isSelected}
                    onChange={() => toggleOrder(i)}
                    onClick={(e) => e.stopPropagation()}
                  />

                  {/* Order icon */}
                  <div style={{
                    width: 34,
                    height: 34,
                    borderRadius: 8,
                    background: isSelected ? `${token.colorPrimary}18` : token.colorFillAlter,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 14,
                    color: isSelected ? token.colorPrimary : token.colorTextSecondary,
                    flexShrink: 0,
                  }}>
                    <ShoppingCartOutlined />
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: token.colorText }}>
                        Order #{i + 1}
                      </span>
                      {itemCount === 0 && (
                        <Tag color="default" style={{ fontSize: 10, borderRadius: 4 }}>
                          Empty
                        </Tag>
                      )}
                    </div>
                    <div style={{ fontSize: 12, color: token.colorTextSecondary, marginTop: 1 }}>
                      {itemCount} item{itemCount !== 1 ? "s" : ""} · ${total.toFixed(2)}
                    </div>
                    {hasCustomer && (
                      <div style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4,
                        marginTop: 4,
                        fontSize: 11,
                        color: token.colorPrimary,
                        background: `${token.colorPrimary}10`,
                        padding: "1px 7px",
                        borderRadius: 10,
                      }}>
                        <UserOutlined style={{ fontSize: 10 }} />
                        {order.attachedCustomer?.name}
                      </div>
                    )}
                  </div>

                  {/* Total badge */}
                  <div style={{
                    fontSize: 14,
                    fontWeight: 800,
                    color: isSelected ? token.colorPrimary : token.colorTextSecondary,
                    flexShrink: 0,
                  }}>
                    ${total.toFixed(2)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Customer conflict resolution */}
        {hasCustomerConflict && selectedIndices.length >= 2 && (
          <>
            <Divider style={{ margin: "12px 0" }} />
            <div style={{
              padding: "12px 14px",
              borderRadius: 10,
              background: "#F59E0B10",
              border: "1px solid #F59E0B30",
              marginBottom: 16,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <WarningOutlined style={{ color: "#F59E0B", fontSize: 14 }} />
                <span style={{ fontSize: 13, fontWeight: 700, color: "#92400E" }}>
                  Multiple customers detected
                </span>
              </div>
              <div style={{ fontSize: 12, color: token.colorTextSecondary, marginBottom: 10 }}>
                Which customer should be attached to the merged order?
              </div>

              <Radio.Group
                value={keepCustomerIdx}
                onChange={(e) => setKeepCustomerIdx(e.target.value)}
                style={{ display: "flex", flexDirection: "column", gap: 8 }}
              >
                {selectedOrders
                  .filter((s) => s.order.attachedCustomer)
                  .map((s) => (
                    <Radio key={s.order.id} value={selectedOrders.indexOf(s)}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <Avatar size={22} icon={<UserOutlined />} style={{ background: token.colorPrimary }} />
                        <span style={{ fontSize: 13 }}>{s.order.attachedCustomer!.name}</span>
                        <Tag color="blue" style={{ fontSize: 10, borderRadius: 4 }}>Order #{s.index + 1}</Tag>
                      </div>
                    </Radio>
                  ))}
                <Radio value={-1}>
                  <span style={{ fontSize: 13, color: token.colorTextSecondary }}>No customer (walk-in)</span>
                </Radio>
              </Radio.Group>
            </div>
          </>
        )}

        {/* Merged order preview */}
        {selectedIndices.length >= 2 && (
          <>
            <Divider style={{ margin: "12px 0" }} />
            <div style={{
              padding: "12px 14px",
              borderRadius: 10,
              background: `${token.colorPrimary}06`,
              border: `1px solid ${token.colorPrimary}20`,
              marginBottom: 16,
            }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: token.colorTextSecondary, marginBottom: 8 }}>
                MERGED ORDER PREVIEW
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                <span style={{ color: token.colorTextSecondary }}>Total items</span>
                <span style={{ fontWeight: 700, color: token.colorText }}>{mergedItemCount}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginTop: 4 }}>
                <span style={{ color: token.colorTextSecondary }}>Subtotal</span>
                <span style={{ fontWeight: 700, color: token.colorText }}>${mergedSubtotal.toFixed(2)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginTop: 4 }}>
                <span style={{ color: token.colorTextSecondary }}>Est. Total (incl. tax)</span>
                <span style={{ fontSize: 15, fontWeight: 800, color: token.colorPrimary }}>${mergedTotal.toFixed(2)}</span>
              </div>
            </div>
          </>
        )}

        {/* Actions */}
        <div style={{ display: "flex", gap: 8 }}>
          <Button
            block
            onClick={onClose}
            style={{ borderRadius: 8, height: 40 }}
          >
            Cancel
          </Button>
          <Button
            type="primary"
            block
            icon={<MergeCellsOutlined />}
            onClick={handleMerge}
            disabled={!canMerge}
            style={{ borderRadius: 8, height: 40, fontWeight: 700 }}
          >
            Merge {selectedIndices.length >= 2 ? `${selectedIndices.length} Orders` : "Orders"}
          </Button>
        </div>

        {selectedIndices.length < 2 && (
          <div style={{ textAlign: "center", fontSize: 12, color: token.colorTextTertiary, marginTop: 8 }}>
            Select at least 2 orders to merge
          </div>
        )}
      </div>
    </Modal>
  );
}
