import { Button, theme as antTheme, message } from "antd";
import { PrinterOutlined, SendOutlined, LoadingOutlined } from "@ant-design/icons";
import { useState } from "react";
import type { CartItem } from "../../store/posStore";
import { usePOSStore } from "../../store/posStore";
import { printKitchenTicket, sendToKitchen } from "../../services/kitchenService";
import { useAppSettings } from "@/contexts/AppSettingsContext";
import { usePOSTranslations } from "../../i18n/translations";

interface KitchenTicketProps {
  items: CartItem[];
  orderNumber?: string;
  /** If true shows only the "Send" button (no separate print) */
  compact?: boolean;
}

export function KitchenTicket({ items, orderNumber, compact = false }: KitchenTicketProps) {
  const { token } = antTheme.useToken();
  const { language } = useAppSettings();
  const t = usePOSTranslations(language);
  const cashierSession = usePOSStore((s) => s.cashierSession);
  const attachedTable  = usePOSStore((s) => s.attachedTable);
  const guestCount     = usePOSStore((s) => s.guestCount);
  const orderType      = usePOSStore((s) => s.orderType);

  const [sending, setSending] = useState(false);

  const orderTypeLabel = { "dine-in": t.dineIn, "takeaway": t.takeaway, "delivery": t.delivery }[orderType];

  const ticketData = {
    orderNumber: orderNumber ?? `ORD-${Date.now().toString().slice(-5)}`,
    orderType:   orderTypeLabel,
    tableName:   attachedTable?.name,
    guestCount,
    timestamp:   new Date().toISOString(),
    cashierName: cashierSession?.cashierName ?? "Cashier",
    items,
  };

  async function handleSend() {
    if (items.length === 0) {
      message.warning("Cart is empty");
      return;
    }
    setSending(true);
    try {
      await sendToKitchen(ticketData);
      message.success(t.sentToKitchen);
    } catch {
      message.error("Failed to send to kitchen");
    } finally {
      setSending(false);
    }
  }

  function handlePrint() {
    if (items.length === 0) {
      message.warning("Cart is empty");
      return;
    }
    printKitchenTicket(ticketData);
    message.success("Kitchen ticket printed");
  }

  if (compact) {
    return (
      <Button
        block
        icon={sending ? <LoadingOutlined /> : <SendOutlined />}
        onClick={handleSend}
        disabled={items.length === 0 || sending}
        style={{
          height: 38,
          borderRadius: 10,
          fontWeight: 600,
          fontSize: 13,
          background: items.length === 0
            ? undefined
            : `linear-gradient(135deg, #F59E0B, #D97706)`,
          border: "none",
          color: items.length === 0 ? undefined : "#fff",
        }}
      >
        {t.sendToKitchen}
      </Button>
    );
  }

  return (
    <div style={{
      display: "flex",
      gap: 6,
    }}>
      <Button
        icon={sending ? <LoadingOutlined /> : <SendOutlined />}
        onClick={handleSend}
        disabled={items.length === 0 || sending}
        style={{
          flex: 1,
          height: 36,
          borderRadius: 10,
          fontWeight: 600,
          fontSize: 12,
          background: items.length === 0
            ? undefined
            : `linear-gradient(135deg, #F59E0B, #D97706)`,
          border: "none",
          color: items.length === 0 ? undefined : "#fff",
        }}
      >
        {t.sendToKitchen}
      </Button>
      <Button
        icon={<PrinterOutlined />}
        onClick={handlePrint}
        disabled={items.length === 0}
        style={{ height: 36, borderRadius: 10 }}
        title="Print kitchen ticket"
      />
    </div>
  );
}
