import { useState } from "react";
import { Button, Modal, Tooltip, theme as antTheme } from "antd";
import {
  PlusOutlined,
  CloseOutlined,
  ShoppingCartOutlined,
  MergeCellsOutlined,
} from "@ant-design/icons";
import { usePOSStore } from "../../store/posStore";
import { useAppSettings } from "@/contexts/AppSettingsContext";
import { usePOSTranslations } from "../../i18n/translations";

interface OrderTabsBarProps {
  onMergeClick: () => void;
  isMobile: boolean;
}

export function OrderTabsBar({ onMergeClick, isMobile }: OrderTabsBarProps) {
  const { token } = antTheme.useToken();
  const { language } = useAppSettings();
  const t = usePOSTranslations(language);

  const orders          = usePOSStore((s) => s.orders);
  const activeOrderIndex = usePOSStore((s) => s.activeOrderIndex);
  const maxOrders       = usePOSStore((s) => s.maxOrders);
  const addOrder        = usePOSStore((s) => s.addOrder);
  const removeOrder     = usePOSStore((s) => s.removeOrder);
  const switchOrder     = usePOSStore((s) => s.switchOrder);

  const [confirmCloseIndex, setConfirmCloseIndex] = useState<number | null>(null);

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
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 4,
        padding: "6px 12px",
        background: token.colorBgLayout,
        borderBottom: `1px solid ${token.colorBorderSecondary}`,
        overflowX: "auto",
        flexShrink: 0,
        scrollbarWidth: "none",
      }}>

        {/* Order tabs */}
        {orders.map((order, i) => {
          const isActive = i === activeOrderIndex;
          const total = order.cartItems.reduce(
            (sum, item) => sum + item.product.price * item.quantity,
            0
          );
          const itemCount = order.cartItems.reduce((n, item) => n + item.quantity, 0);

          return (
            <div
              key={order.id}
              onClick={() => switchOrder(i)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: isMobile ? "5px 10px" : "6px 12px",
                borderRadius: 8,
                cursor: "pointer",
                flexShrink: 0,
                background: isActive
                  ? token.colorBgContainer
                  : "transparent",
                border: isActive
                  ? `1.5px solid ${token.colorPrimary}40`
                  : `1.5px solid transparent`,
                boxShadow: isActive ? `0 1px 6px ${token.colorPrimary}18` : "none",
                transition: "all 0.15s",
                position: "relative",
              }}
            >
              {/* Active indicator line */}
              {isActive && (
                <div style={{
                  position: "absolute",
                  bottom: -1,
                  left: 8,
                  right: 8,
                  height: 2,
                  borderRadius: "2px 2px 0 0",
                  background: token.colorPrimary,
                }} />
              )}

              {/* Cart icon */}
              <ShoppingCartOutlined style={{
                fontSize: 12,
                color: isActive ? token.colorPrimary : token.colorTextTertiary,
              }} />

              {/* Label */}
              <div style={{ lineHeight: 1.2 }}>
                <div style={{
                  fontSize: 12,
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? token.colorText : token.colorTextSecondary,
                  whiteSpace: "nowrap",
                }}>
                  {t.order(i + 1)}
                  {itemCount > 0 && (
                    <span style={{
                      marginInlineStart: 4,
                      fontSize: 10,
                      fontWeight: 700,
                      color: isActive ? token.colorPrimary : token.colorTextTertiary,
                      background: isActive ? `${token.colorPrimary}18` : token.colorFillAlter,
                      borderRadius: 4,
                      padding: "0 4px",
                    }}>
                      {itemCount}
                    </span>
                  )}
                </div>
                {!isMobile && (
                  <div style={{
                    fontSize: 11,
                    color: isActive ? token.colorPrimary : token.colorTextTertiary,
                    fontWeight: isActive ? 600 : 400,
                  }}>
                    ${total.toFixed(2)}
                  </div>
                )}
              </div>

              {/* Close button */}
              {orders.length > 1 && (
                <div
                  onClick={(e) => handleCloseTab(i, e)}
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: 4,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: token.colorTextTertiary,
                    cursor: "pointer",
                    flexShrink: 0,
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = token.colorFillSecondary;
                    (e.currentTarget as HTMLElement).style.color = token.colorError;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "transparent";
                    (e.currentTarget as HTMLElement).style.color = token.colorTextTertiary;
                  }}
                >
                  <CloseOutlined style={{ fontSize: 9 }} />
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
              borderRadius: 8,
              height: 32,
              width: 32,
              padding: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              border: `1.5px dashed ${atMax ? token.colorBorderSecondary : token.colorPrimary}40`,
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
                fontSize: 12,
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
              style={{ borderRadius: 8, height: 28, width: 28, padding: 0, flexShrink: 0 }}
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
                orders[confirmCloseIndex]?.cartItems.reduce((n, i) => n + i.quantity, 0) ?? 0
              )
            : ""}
        </div>
      </Modal>
    </>
  );
}
