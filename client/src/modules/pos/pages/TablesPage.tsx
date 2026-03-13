import { useState, useEffect } from "react";
import { Button, theme as antTheme, Tooltip, message } from "antd";
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  ShopOutlined,
  UserOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { useLocation } from "wouter";
import { AntProvider } from "@/lib/antd-provider";
import { useAppSettings } from "@/contexts/AppSettingsContext";
import { usePOSTranslations } from "../i18n/translations";
import { usePOSStore } from "../store/posStore";
import { useRestaurantMode } from "../hooks/useRestaurantMode";
import { TableMap } from "../components/restaurant/TableMap";
import { occupyTable } from "../services/tableService";
import type { RestaurantTable } from "../data/mockRestaurant";

function Clock() {
  const [time, setTime] = useState(() =>
    new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  );
  useEffect(() => {
    const id = setInterval(() => {
      setTime(
        new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    }, 10000);
    return () => clearInterval(id);
  }, []);
  return <span>{time}</span>;
}

function TablesLayout() {
  const { token } = antTheme.useToken();
  const [, setLocation] = useLocation();
  const { language, currentBranch } = useAppSettings();
  const isRTL = language === "ar";
  const t = usePOSTranslations(language);
  const mode = useRestaurantMode();

  const cashierSession = usePOSStore(s => s.cashierSession);
  const setAttachedTable = usePOSStore(s => s.setAttachedTable);
  const setGuestCount = usePOSStore(s => s.setGuestCount);
  const defaultGuests = usePOSStore(s => s.defaultGuests);

  // Redirect to POS if restaurant mode is off
  useEffect(() => {
    if (!mode.isRestaurant) {
      setLocation("/pos");
    }
  }, [mode.isRestaurant]);

  async function handleSelectTable(table: RestaurantTable) {
    if (table.status === "occupied") {
      // Resume existing order
      setAttachedTable(table);
      setGuestCount(table.guestCount ?? defaultGuests);
      message.success(`Resuming order for ${table.name}`);
      setLocation("/pos");
      return;
    }

    // Occupy the table
    try {
      const updated = await occupyTable(table.id, defaultGuests);
      setAttachedTable(updated);
      setGuestCount(defaultGuests);
      message.success(`Table ${table.name} opened`);
      setLocation("/pos");
    } catch {
      message.error("Failed to open table");
    }
  }

  function handleTakeAway() {
    setAttachedTable(null);
    setGuestCount(0);
    setLocation("/pos");
  }

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        overflow: "hidden",
        background: token.colorBgLayout,
      }}
    >
      {/* Top bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "0 16px",
          height: 54,
          background: token.colorBgContainer,
          borderBottom: `1px solid ${token.colorBorderSecondary}`,
          flexShrink: 0,
          boxShadow: "0 1px 8px rgba(0,0,0,0.06)",
        }}
      >
        {/* Back to ERP */}
        <Tooltip title={t.backToERP}>
          <Button
            icon={isRTL ? <ArrowRightOutlined /> : <ArrowLeftOutlined />}
            onClick={() => setLocation("/")}
            style={{
              borderRadius: 10,
              height: 36,
              width: 36,
              padding: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          />
        </Tooltip>

        {/* Logo + Title */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: 8,
              background: `linear-gradient(135deg, #F59E0B, #D97706)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontWeight: 900,
              fontSize: 14,
              flexShrink: 0,
            }}
          >
            <ShopOutlined />
          </div>
          <div>
            <div
              style={{
                fontSize: 14,
                fontWeight: 800,
                color: token.colorText,
                lineHeight: 1.2,
              }}
            >
              {t.tableMap}
            </div>
            <div
              style={{
                fontSize: 10,
                color: token.colorTextSecondary,
                lineHeight: 1.2,
              }}
            >
              {currentBranch.name}
            </div>
          </div>
          <span
            style={{
              fontSize: 9,
              fontWeight: 800,
              letterSpacing: "0.06em",
              background: "#FEF3C710",
              color: "#D97706",
              borderRadius: 5,
              padding: "2px 6px",
              textTransform: "uppercase",
              border: "1px solid #D9770630",
            }}
          >
            Restaurant
          </span>
        </div>

        <div style={{ flex: 1 }} />

        {/* Cashier + Clock */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            color: token.colorTextSecondary,
            fontSize: 12,
          }}
        >
          <UserOutlined style={{ fontSize: 12 }} />
          <span>{cashierSession?.cashierName ?? t.noCashier}</span>
          <div
            style={{
              width: 1,
              height: 16,
              background: token.colorBorderSecondary,
            }}
          />
          <ClockCircleOutlined style={{ fontSize: 12 }} />
          <Clock />
        </div>
      </div>

      {/* Table Map */}
      <div
        style={{
          flex: 1,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <TableMap
          onSelectTable={handleSelectTable}
          onTakeAway={handleTakeAway}
          allowTakeAway={mode.allowTakeAway}
        />
      </div>
    </div>
  );
}

export default function TablesPage() {
  return (
    <AntProvider>
      <TablesLayout />
    </AntProvider>
  );
}
