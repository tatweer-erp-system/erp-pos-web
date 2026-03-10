import { useState, useEffect } from "react";
import { Button, Input, Spin, theme as antTheme, message } from "antd";
import { SearchOutlined, ShoppingOutlined } from "@ant-design/icons";
import { getTables } from "../../services/tableService";
import { mockSections } from "../../data/mockRestaurant";
import type { RestaurantTable } from "../../data/mockRestaurant";
import { TableCard } from "./TableCard";
import { useAppSettings } from "@/contexts/AppSettingsContext";
import { usePOSTranslations } from "../../i18n/translations";

interface TableMapProps {
  onSelectTable: (table: RestaurantTable) => void;
  onTakeAway: () => void;
  allowTakeAway: boolean;
}

export function TableMap({ onSelectTable, onTakeAway, allowTakeAway }: TableMapProps) {
  const { token } = antTheme.useToken();
  const { language } = useAppSettings();
  const t = usePOSTranslations(language);

  const [tables, setTables] = useState<RestaurantTable[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<string>("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    getTables().then((rows) => { setTables(rows); setLoading(false); });
  }, []);

  function handleTableClick(table: RestaurantTable) {
    if (table.status === "reserved") return;
    onSelectTable(table);
  }

  const filtered = tables.filter((t) => {
    const sectionMatch = activeSection === "all" || t.sectionId === activeSection;
    const searchMatch = !search.trim() || t.name.toLowerCase().includes(search.toLowerCase());
    return sectionMatch && searchMatch;
  });

  const sectionCounts = tables.reduce<Record<string, number>>((acc, tbl) => {
    acc[tbl.sectionId] = (acc[tbl.sectionId] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Controls */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "12px 16px",
        background: token.colorBgContainer,
        borderBottom: `1px solid ${token.colorBorderSecondary}`,
        flexShrink: 0,
        flexWrap: "wrap",
      }}>
        {/* Section filter */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", flex: 1 }}>
          {/* All button */}
          <button
            onClick={() => setActiveSection("all")}
            style={{
              padding: "5px 14px",
              borderRadius: 20,
              border: activeSection === "all" ? `1.5px solid ${token.colorPrimary}` : `1px solid ${token.colorBorderSecondary}`,
              background: activeSection === "all" ? token.colorPrimaryBg : "transparent",
              color: activeSection === "all" ? token.colorPrimary : token.colorTextSecondary,
              cursor: "pointer",
              fontSize: 12,
              fontWeight: activeSection === "all" ? 700 : 400,
              transition: "all 0.15s",
            }}
          >
            {t.allSections} ({tables.length})
          </button>
          {mockSections.map((sec) => {
            const isActive = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => setActiveSection(sec.id)}
                style={{
                  padding: "5px 14px",
                  borderRadius: 20,
                  border: isActive ? `1.5px solid ${sec.color}` : `1px solid ${token.colorBorderSecondary}`,
                  background: isActive ? `${sec.color}15` : "transparent",
                  color: isActive ? sec.color : token.colorTextSecondary,
                  cursor: "pointer",
                  fontSize: 12,
                  fontWeight: isActive ? 700 : 400,
                  transition: "all 0.15s",
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                }}
              >
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: sec.color }} />
                {sec.name} ({sectionCounts[sec.id] ?? 0})
              </button>
            );
          })}
        </div>

        {/* Search */}
        <Input
          placeholder="Search table..."
          prefix={<SearchOutlined style={{ color: token.colorTextTertiary }} />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: 160, borderRadius: 8 }}
          allowClear
        />

        {/* Take Away */}
        {allowTakeAway && (
          <Button
            type="primary"
            icon={<ShoppingOutlined />}
            onClick={() => {
              message.success("Take away order started");
              onTakeAway();
            }}
            style={{
              borderRadius: 10,
              fontWeight: 600,
              background: `linear-gradient(135deg, #10B981, #059669)`,
              border: "none",
              flexShrink: 0,
            }}
          >
            {t.takeAway}
          </Button>
        )}
      </div>

      {/* Stats bar */}
      <div style={{
        display: "flex",
        gap: 16,
        padding: "8px 16px",
        background: token.colorBgLayout,
        borderBottom: `1px solid ${token.colorBorderSecondary}`,
        fontSize: 12,
        color: token.colorTextSecondary,
        flexShrink: 0,
      }}>
        {(["available", "occupied", "reserved"] as const).map((status) => {
          const count = tables.filter((tbl) => tbl.status === status).length;
          const colors = { available: "#10B981", occupied: "#F59E0B", reserved: "#6366F1" };
          const labels = { available: t.availableStatus, occupied: t.occupiedStatus, reserved: t.reservedStatus };
          return (
            <span key={status} style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: colors[status] }} />
              <strong style={{ color: colors[status] }}>{count}</strong> {labels[status]}
            </span>
          );
        })}
      </div>

      {/* Table grid */}
      <div style={{ flex: 1, overflow: "auto", padding: 16 }}>
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: 60 }}>
            <Spin size="large" />
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: 60, color: token.colorTextSecondary, fontSize: 14 }}>
            {t.noTablesFound}
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
            gap: 12,
          }}>
            {filtered.map((table) => (
              <TableCard key={table.id} table={table} onClick={handleTableClick} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
