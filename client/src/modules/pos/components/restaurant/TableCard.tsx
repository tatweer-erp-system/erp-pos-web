import { theme as antTheme, Tag, Tooltip } from "antd";
import { TeamOutlined, ClockCircleOutlined, DollarOutlined } from "@ant-design/icons";
import type { RestaurantTable } from "../../data/mockRestaurant";
import { getSection, formatSeatedDuration } from "../../data/mockRestaurant";
import { TableActions } from "./TableActions";
import { useAppSettings } from "@/contexts/AppSettingsContext";
import { usePOSTranslations } from "../../i18n/translations";

interface TableCardProps {
  table: RestaurantTable;
  onClick: (table: RestaurantTable) => void;
  onUpdated?: () => void;
  availableTables?: RestaurantTable[];
}

const STATUS_CONFIG = {
  available: { color: "#10B981", bg: "#ECFDF5", border: "#10B98130", label: "availableStatus" },
  occupied:  { color: "#F59E0B", bg: "#FFFBEB", border: "#F59E0B30", label: "occupiedStatus"  },
  reserved:  { color: "#6366F1", bg: "#EEF2FF", border: "#6366F130", label: "reservedStatus"  },
} as const;

export function TableCard({ table, onClick, onUpdated, availableTables }: TableCardProps) {
  const { token } = antTheme.useToken();
  const { language } = useAppSettings();
  const t = usePOSTranslations(language);
  const section = getSection(table.sectionId);
  const cfg = STATUS_CONFIG[table.status];

  const isClickable = table.status !== "reserved";

  return (
    <Tooltip
      title={
        table.status === "reserved"
          ? t.reservedStatus
          : table.status === "occupied"
          ? t.resumeTableOrder
          : t.openTable
      }
    >
      <div
        onClick={() => isClickable && onClick(table)}
        style={{
          background: token.colorBgContainer,
          border: `2px solid ${cfg.border}`,
          borderRadius: 14,
          padding: "14px 16px",
          cursor: isClickable ? "pointer" : "default",
          transition: "all 0.18s",
          opacity: table.status === "reserved" ? 0.65 : 1,
          position: "relative",
          overflow: "hidden",
        }}
        onMouseEnter={(e) => {
          if (!isClickable) return;
          (e.currentTarget as HTMLDivElement).style.borderColor = cfg.color;
          (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
          (e.currentTarget as HTMLDivElement).style.boxShadow = `0 6px 20px ${cfg.color}20`;
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.borderColor = cfg.border;
          (e.currentTarget as HTMLDivElement).style.transform = "";
          (e.currentTarget as HTMLDivElement).style.boxShadow = "";
        }}
      >
        {/* Section color bar */}
        <div style={{
          position: "absolute",
          top: 0, left: 0, right: 0,
          height: 3,
          background: section.color,
          borderRadius: "14px 14px 0 0",
        }} />

        {/* Table shape + number */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10 }}>
          <div style={{
            width: table.shape === "round" ? 44 : 40,
            height: table.shape === "round" ? 44 : 40,
            borderRadius: table.shape === "round" ? "50%" : 10,
            background: `${cfg.color}18`,
            border: `2px solid ${cfg.color}40`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 14,
            fontWeight: 900,
            color: cfg.color,
          }}>
            {table.name}
          </div>

          <Tag
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.04em",
              background: cfg.bg,
              color: cfg.color,
              border: `1px solid ${cfg.border}`,
              borderRadius: 6,
              padding: "2px 8px",
              textTransform: "uppercase",
            }}
          >
            {t[cfg.label]}
          </Tag>
        </div>

        {/* Section label */}
        <div style={{
          fontSize: 11,
          color: section.color,
          fontWeight: 700,
          marginBottom: 6,
          display: "flex",
          alignItems: "center",
          gap: 4,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: section.color, flexShrink: 0 }} />
          {section.name}
        </div>

        {/* Capacity */}
        <div style={{ fontSize: 11, color: token.colorTextSecondary, display: "flex", alignItems: "center", gap: 4 }}>
          <TeamOutlined style={{ fontSize: 10 }} />
          {t.tableCapacity(table.capacity)}
        </div>

        {/* Occupied details */}
        {table.status === "occupied" && (
          <div style={{
            marginTop: 10,
            paddingTop: 10,
            borderTop: `1px solid ${token.colorBorderSecondary}`,
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}>
            {table.seatedAt && (
              <div style={{ fontSize: 11, color: "#F59E0B", display: "flex", alignItems: "center", gap: 4 }}>
                <ClockCircleOutlined style={{ fontSize: 10 }} />
                {t.tableSeated(formatSeatedDuration(table.seatedAt))}
              </div>
            )}
            {table.guestCount !== undefined && (
              <div style={{ fontSize: 11, color: token.colorTextSecondary, display: "flex", alignItems: "center", gap: 4 }}>
                <TeamOutlined style={{ fontSize: 10 }} />
                {t.tableGuests(table.guestCount)}
              </div>
            )}
            {table.orderTotal !== undefined && table.orderTotal > 0 && (
              <div style={{ fontSize: 12, fontWeight: 700, color: token.colorText, display: "flex", alignItems: "center", gap: 4 }}>
                <DollarOutlined style={{ fontSize: 10, color: "#10B981" }} />
                ${table.orderTotal.toFixed(2)}
              </div>
            )}
          </div>
        )}

        {/* Table Actions */}
        {onUpdated && (
          <TableActions
            table={table}
            onUpdated={onUpdated}
            availableTables={availableTables}
          />
        )}
      </div>
    </Tooltip>
  );
}
