import { useState, useEffect } from "react";
import { Select, Input, Button, theme as antTheme } from "antd";
import {
  CoffeeOutlined,
  ShoppingOutlined,
  CarOutlined,
  TableOutlined,
  TeamOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  DollarOutlined,
  MinusOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { usePOSStore, type OrderType } from "../../store/posStore";
import { useAppSettings } from "@/contexts/AppSettingsContext";
import { usePOSTranslations } from "../../i18n/translations";
import { useRestaurantMode } from "../../hooks/useRestaurantMode";
import { getTables } from "../../services/tableService";
import { WALK_IN_CUSTOMER } from "../../data/mockCustomers";
import type { RestaurantTable } from "../../data/mockRestaurant";
import { InputNumber } from "antd";

const ORDER_TYPES: {
  key: OrderType;
  icon: React.ReactNode;
  labelKey: "dineIn" | "takeaway" | "delivery";
}[] = [
  { key: "dine-in", icon: <CoffeeOutlined />, labelKey: "dineIn" },
  { key: "takeaway", icon: <ShoppingOutlined />, labelKey: "takeaway" },
  { key: "delivery", icon: <CarOutlined />, labelKey: "delivery" },
];

const DELIVERY_TIME_OPTIONS = [15, 30, 45, 60, 90];

const STATUS_DOT: Record<string, string> = {
  available: "#10B981",
  occupied: "#F59E0B",
};

export function OrderTypeSelector() {
  const { token } = antTheme.useToken();
  const { language } = useAppSettings();
  const t = usePOSTranslations(language);
  const orderType = usePOSStore(s => s.orderType);
  const setOrderType = usePOSStore(s => s.setOrderType);
  const attachedTable = usePOSStore(s => s.attachedTable);
  const setAttachedTable = usePOSStore(s => s.setAttachedTable);
  const guestCount = usePOSStore(s => s.guestCount);
  const setGuestCount = usePOSStore(s => s.setGuestCount);
  const defaultGuests = usePOSStore(s => s.defaultGuests);
  const attachedCustomer = usePOSStore(s => s.attachedCustomer);
  const setAttachedCustomer = usePOSStore(s => s.setAttachedCustomer);
  const deliveryAddress = usePOSStore(s => s.deliveryAddress);
  const setDeliveryAddress = usePOSStore(s => s.setDeliveryAddress);
  const deliveryFee = usePOSStore(s => s.deliveryFee);
  const setDeliveryFee = usePOSStore(s => s.setDeliveryFee);
  const deliveryTime = usePOSStore(s => s.deliveryTime);
  const setDeliveryTime = usePOSStore(s => s.setDeliveryTime);
  const restaurantMode = useRestaurantMode();

  const [tables, setTables] = useState<RestaurantTable[]>([]);

  useEffect(() => {
    if (orderType === "dine-in" && restaurantMode.isRestaurant) {
      getTables().then(setTables);
    }
  }, [orderType, restaurantMode.isRestaurant]);

  function handleSetType(type: OrderType) {
    setOrderType(type);
    if (type !== "dine-in" && attachedTable) {
      setAttachedTable(null);
    }
    if ((type === "takeaway" || type === "delivery") && !attachedCustomer) {
      setAttachedCustomer(WALK_IN_CUSTOMER);
    }
  }

  function handleTableSelect(tableId: string) {
    if (tableId === "__none__") {
      setAttachedTable(null);
      return;
    }
    const table = tables.find(tbl => tbl.id === tableId);
    if (table) {
      setAttachedTable(table);
      setGuestCount(table.guestCount ?? defaultGuests);
    }
  }

  const isDineIn = orderType === "dine-in";
  const isDelivery = orderType === "delivery";
  const showTableSelect =
    isDineIn &&
    restaurantMode.isRestaurant &&
    restaurantMode.tableManagementEnabled;
  const availableTables = tables.filter(
    tbl => tbl.status === "available" || tbl.status === "occupied"
  );
  const maxGuests = attachedTable?.capacity ?? 20;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {/* Order type segmented control */}
      <div
        style={{
          display: "flex",
          borderRadius: 10,
          padding: 0,
          gap: 6,
        }}
      >
        {ORDER_TYPES.map(({ key, icon, labelKey }) => {
          const isActive = orderType === key;
          return (
            <button
              key={key}
              onClick={() => handleSetType(key)}
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 5,
                padding: "7px 8px",
                borderRadius: 8,
                border: isActive
                  ? `1.5px solid ${token.colorPrimary}`
                  : `1.5px solid ${token.colorBorderSecondary}`,
                cursor: "pointer",
                fontSize: 11,
                fontWeight: isActive ? 700 : 600,
                transition: "all 0.2s",
                background: isActive
                  ? `linear-gradient(135deg, ${token.colorPrimary}, ${token.colorPrimaryHover})`
                  : token.colorBgContainer,
                color: isActive ? "#fff" : token.colorText,
                boxShadow: isActive
                  ? `0 2px 8px ${token.colorPrimary}40`
                  : `0 1px 2px rgba(0,0,0,0.04)`,
                whiteSpace: "nowrap",
              }}
            >
              <span style={{ fontSize: 12 }}>{icon}</span>
              {t[labelKey]}
            </button>
          );
        })}
      </div>

      {/* Dine-in: table selector + guest count stepper */}
      {showTableSelect && (
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Select
            value={attachedTable?.id ?? "__none__"}
            onChange={handleTableSelect}
            style={{ flex: 1 }}
            size="small"
            suffixIcon={
              <TableOutlined
                style={{
                  color: attachedTable ? "#F59E0B" : token.colorTextPlaceholder,
                  fontSize: 11,
                }}
              />
            }
            popupMatchSelectWidth={240}
            options={[
              {
                value: "__none__",
                label: (
                  <span
                    style={{ color: token.colorTextSecondary, fontSize: 11 }}
                  >
                    {t.selectTable}
                  </span>
                ),
              },
              ...availableTables.map(tbl => ({
                value: tbl.id,
                label: (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "2px 0",
                    }}
                  >
                    {/* Status dot */}
                    <span
                      style={{
                        width: 7,
                        height: 7,
                        borderRadius: "50%",
                        background: STATUS_DOT[tbl.status] ?? "#ccc",
                        flexShrink: 0,
                      }}
                    />
                    {/* Table name */}
                    <span style={{ fontWeight: 600, fontSize: 12, flex: 1 }}>
                      {tbl.name}
                    </span>
                    {/* Capacity badge */}
                    <span
                      style={{
                        fontSize: 10,
                        color: token.colorTextSecondary,
                        display: "flex",
                        alignItems: "center",
                        gap: 3,
                      }}
                    >
                      <TeamOutlined style={{ fontSize: 9 }} />
                      {tbl.capacity}
                    </span>
                    {/* Status label */}
                    <span
                      style={{
                        fontSize: 9,
                        fontWeight: 700,
                        color: STATUS_DOT[tbl.status],
                        background: `${STATUS_DOT[tbl.status]}12`,
                        border: `1px solid ${STATUS_DOT[tbl.status]}30`,
                        borderRadius: 4,
                        padding: "1px 5px",
                        textTransform: "uppercase",
                        letterSpacing: "0.03em",
                      }}
                    >
                      {tbl.status === "occupied"
                        ? t.occupiedStatus
                        : t.availableStatus}
                    </span>
                  </div>
                ),
              })),
            ]}
          />

          {/* Guest count stepper with +/- buttons */}
          {attachedTable && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 0,
                background: token.colorFillAlter,
                borderRadius: 8,
                border: `1px solid ${token.colorBorderSecondary}`,
                flexShrink: 0,
                overflow: "hidden",
              }}
            >
              <button
                onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                disabled={guestCount <= 1}
                style={{
                  width: 26,
                  height: 28,
                  border: "none",
                  background: "transparent",
                  cursor: guestCount <= 1 ? "default" : "pointer",
                  color:
                    guestCount <= 1
                      ? token.colorTextQuaternary
                      : token.colorText,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 10,
                  transition: "color 0.15s",
                }}
              >
                <MinusOutlined />
              </button>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 3,
                  padding: "0 4px",
                  borderInline: `1px solid ${token.colorBorderSecondary}`,
                  height: 28,
                  minWidth: 36,
                  justifyContent: "center",
                }}
              >
                <TeamOutlined
                  style={{ fontSize: 10, color: token.colorTextSecondary }}
                />
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: token.colorText,
                  }}
                >
                  {guestCount}
                </span>
              </div>
              <button
                onClick={() =>
                  setGuestCount(Math.min(maxGuests, guestCount + 1))
                }
                disabled={guestCount >= maxGuests}
                style={{
                  width: 26,
                  height: 28,
                  border: "none",
                  background: "transparent",
                  cursor: guestCount >= maxGuests ? "default" : "pointer",
                  color:
                    guestCount >= maxGuests
                      ? token.colorTextQuaternary
                      : token.colorText,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 10,
                  transition: "color 0.15s",
                }}
              >
                <PlusOutlined />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Delivery: address + fee + time */}
      {isDelivery && (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <Input
            prefix={
              <EnvironmentOutlined style={{ color: "#EF4444", fontSize: 11 }} />
            }
            placeholder={t.deliveryAddressPlaceholder}
            value={deliveryAddress}
            onChange={e => setDeliveryAddress(e.target.value)}
            style={{ borderRadius: 8 }}
            size="small"
          />
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <InputNumber
              prefix={
                <DollarOutlined style={{ color: "#10B981", fontSize: 11 }} />
              }
              placeholder={t.deliveryFee}
              value={deliveryFee || undefined}
              onChange={v => setDeliveryFee(v ?? 0)}
              min={0}
              precision={2}
              style={{ flex: 1, borderRadius: 8 }}
              size="small"
            />
            <Select
              value={deliveryTime || undefined}
              onChange={v => setDeliveryTime(v)}
              placeholder={t.estimatedTime}
              size="small"
              style={{ flex: 1 }}
              allowClear
              onClear={() => setDeliveryTime("")}
              suffixIcon={
                <ClockCircleOutlined
                  style={{ color: "#6366F1", fontSize: 11 }}
                />
              }
              options={DELIVERY_TIME_OPTIONS.map(mins => ({
                value: String(mins),
                label: `${mins} ${t.minutes}`,
              }))}
            />
          </div>
        </div>
      )}
    </div>
  );
}
