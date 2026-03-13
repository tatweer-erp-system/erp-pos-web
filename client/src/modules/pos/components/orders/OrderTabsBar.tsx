import { useState } from "react";
import { Button, Modal, Tooltip, theme as antTheme } from "antd";
import {
  PlusOutlined,
  CloseOutlined,
  MergeCellsOutlined,
  CoffeeOutlined,
  ShoppingOutlined,
  CarOutlined,
} from "@ant-design/icons";
import { usePOSStore, type OrderType } from "../../store/posStore";
import { useAppSettings } from "@/contexts/AppSettingsContext";
import { usePOSTranslations } from "../../i18n/translations";

const ORDER_TYPE_ICON: Record<OrderType, React.ReactNode> = {
  "dine-in": <CoffeeOutlined />,
  takeaway: <ShoppingOutlined />,
  delivery: <CarOutlined />,
};
const ORDER_TYPE_COLOR: Record<OrderType, string> = {
  "dine-in": "#3B82F6",
  takeaway: "#10B981",
  delivery: "#6366F1",
};

interface OrderTabsBarProps {
  onMergeClick: () => void;
  isMobile: boolean;
}

export function OrderTabsBar({ onMergeClick, isMobile }: OrderTabsBarProps) {
  const { token } = antTheme.useToken();
  const { language } = useAppSettings();
  const t = usePOSTranslations(language);

  const orders = usePOSStore(s => s.orders);
  const activeOrderIndex = usePOSStore(s => s.activeOrderIndex);
  const maxOrders = usePOSStore(s => s.maxOrders);
  const addOrder = usePOSStore(s => s.addOrder);
  const removeOrder = usePOSStore(s => s.removeOrder);
  const switchOrder = usePOSStore(s => s.switchOrder);

  const [confirmCloseIndex, setConfirmCloseIndex] = useState<number | null>(
    null
  );

  function handleCloseTab(index: number, e: React.MouseEvent) {
    e.stopPropagation();
    const hasItems = orders[index].cartItems.length > 0;
    if (hasItems) {
      setConfirmCloseIndex(index);
    } else {
      removeOrder(index);
    }
  }

  function confirmClose() {
    if (confirmCloseIndex !== null) {
      removeOrder(confirmCloseIndex);
      setConfirmCloseIndex(null);
    }
  }

  const atMax = orders.length >= maxOrders;

  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "5px 12px",
          background: token.colorBgLayout,
          borderBottom: `1px solid ${token.colorBorderSecondary}`,
          overflowX: "auto",
          flexShrink: 0,
          scrollbarWidth: "none",
        }}
      >
        {/* Order tabs */}
        {orders.map((order, i) => {
          const isActive = i === activeOrderIndex;
          const total = order.cartItems.reduce(
            (sum, item) => sum + item.product.price * item.quantity,
            0
          );
          const itemCount = order.cartItems.reduce(
            (n, item) => n + item.quantity,
            0
          );
          const typeColor = ORDER_TYPE_COLOR[order.orderType];

          return (
            <div
              key={order.id}
              onClick={() => switchOrder(i)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: isMobile ? "6px 10px" : "7px 14px",
                borderRadius: 10,
                cursor: "pointer",
                flexShrink: 0,
                background: isActive ? token.colorBgContainer : "transparent",
                border: isActive
                  ? `1.5px solid ${typeColor}50`
                  : `1.5px solid transparent`,
                boxShadow: isActive ? `0 2px 8px ${typeColor}15` : "none",
                transition: "all 0.18s",
                position: "relative",
              }}
              onMouseEnter={e => {
                if (!isActive) {
                  (e.currentTarget as HTMLElement).style.background =
                    `${token.colorFillAlter}`;
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  (e.currentTarget as HTMLElement).style.background =
                    "transparent";
                }
              }}
            >
              {/* Active bottom accent */}
              {isActive && (
                <div
                  style={{
                    position: "absolute",
                    bottom: -1,
                    left: 10,
                    right: 10,
                    height: 2.5,
                    borderRadius: "2px 2px 0 0",
                    background: `linear-gradient(90deg, ${typeColor}, ${typeColor}80)`,
                  }}
                />
              )}

              {/* Order type icon with colored dot */}
              <div
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 8,
                  background: isActive
                    ? `${typeColor}15`
                    : token.colorFillAlter,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12,
                  color: isActive ? typeColor : token.colorTextTertiary,
                  transition: "all 0.18s",
                  flexShrink: 0,
                }}
              >
                {ORDER_TYPE_ICON[order.orderType]}
              </div>

              {/* Label + total */}
              <div style={{ lineHeight: 1.2 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    fontSize: 12,
                    fontWeight: isActive ? 700 : 500,
                    color: isActive
                      ? token.colorText
                      : token.colorTextSecondary,
                    whiteSpace: "nowrap",
                  }}
                >
                  {t.order(i + 1)}
                  {itemCount > 0 && (
                    <span
                      style={{
                        fontSize: 9,
                        fontWeight: 800,
                        color: "#fff",
                        background: isActive
                          ? typeColor
                          : token.colorTextTertiary,
                        borderRadius: 10,
                        padding: "1px 5px",
                        minWidth: 16,
                        textAlign: "center",
                        lineHeight: "14px",
                      }}
                    >
                      {itemCount}
                    </span>
                  )}
                </div>
                {!isMobile && (
                  <div
                    style={{
                      fontSize: 11,
                      color: isActive ? typeColor : token.colorTextQuaternary,
                      fontWeight: isActive ? 600 : 400,
                      marginTop: 1,
                    }}
                  >
                    ${total.toFixed(2)}
                  </div>
                )}
              </div>

              {/* Close button */}
              {orders.length > 1 && (
                <div
                  onClick={e => handleCloseTab(i, e)}
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: 6,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: token.colorTextQuaternary,
                    cursor: "pointer",
                    flexShrink: 0,
                    transition: "all 0.12s",
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.background =
                      `${token.colorError}15`;
                    (e.currentTarget as HTMLElement).style.color =
                      token.colorError;
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.background =
                      "transparent";
                    (e.currentTarget as HTMLElement).style.color =
                      token.colorTextQuaternary;
                  }}
                >
                  <CloseOutlined style={{ fontSize: 8 }} />
                </div>
              )}
            </div>
          );
        })}

        {/* Add new order button */}
        <Tooltip title={atMax ? t.maxOrdersReached(maxOrders) : t.newOrder}>
          <Button
            type="text"
            size="small"
            icon={<PlusOutlined />}
            onClick={addOrder}
            disabled={atMax}
            style={{
              borderRadius: 10,
              height: 34,
              width: 34,
              padding: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              border: `1.5px dashed ${atMax ? token.colorBorderSecondary : token.colorPrimary}50`,
              color: atMax ? token.colorTextTertiary : token.colorPrimary,
            }}
          />
        </Tooltip>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Merge button — only when 2+ tabs */}
        {orders.length >= 2 && !isMobile && (
          <Tooltip title={t.mergeSelectedOrders}>
            <Button
              size="small"
              icon={<MergeCellsOutlined />}
              onClick={onMergeClick}
              style={{
                borderRadius: 8,
                height: 28,
                fontSize: 11,
                flexShrink: 0,
              }}
            >
              {t.mergeOrders}
            </Button>
          </Tooltip>
        )}

        {orders.length >= 2 && isMobile && (
          <Tooltip title={t.mergeOrders}>
            <Button
              size="small"
              icon={<MergeCellsOutlined />}
              onClick={onMergeClick}
              style={{
                borderRadius: 8,
                height: 28,
                width: 28,
                padding: 0,
                flexShrink: 0,
              }}
            />
          </Tooltip>
        )}
      </div>

      {/* Close confirmation modal */}
      <Modal
        open={confirmCloseIndex !== null}
        title={t.closeThisOrder}
        onOk={confirmClose}
        onCancel={() => setConfirmCloseIndex(null)}
        okText={t.closeOrder}
        okButtonProps={{ danger: true }}
        cancelText={t.keep}
        width={380}
        centered
      >
        <div style={{ padding: "8px 0", fontSize: 13, color: "#64748b" }}>
          {confirmCloseIndex !== null
            ? t.orderHasItems(
                confirmCloseIndex + 1,
                orders[confirmCloseIndex]?.cartItems.reduce(
                  (n, i) => n + i.quantity,
                  0
                ) ?? 0
              )
            : ""}
        </div>
      </Modal>
    </>
  );
}
