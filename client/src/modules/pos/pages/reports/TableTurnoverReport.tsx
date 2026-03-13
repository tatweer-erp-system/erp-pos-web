import { useState, useMemo } from "react";
import {
  Card,
  Col,
  DatePicker,
  Row,
  Select,
  Table,
  theme as antTheme,
  Button,
  Space,
  Empty,
  Result,
} from "antd";
import {
  PrinterOutlined,
  DownloadOutlined,
  LockOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { usePOSStore } from "../../store/posStore";
import { mockSections } from "../../data/mockRestaurant";

const { RangePicker } = DatePicker;
const { Option } = Select;

// ── Types & mock data ─────────────────────────────────────────────────────────

interface TableTurnoverRow {
  id: string;
  tableName: string;
  section: string;
  totalSeatings: number;
  avgDurationMinutes: number;
  totalRevenue: number;
  revenuePerHour: number;
  avgGuestsPerSeating: number;
}

const MOCK_TURNOVER_DATA: TableTurnoverRow[] = [
  {
    id: "tbl-1",
    tableName: "T-01",
    section: "Main Hall",
    totalSeatings: 8,
    avgDurationMinutes: 52,
    totalRevenue: 680.5,
    revenuePerHour: 47.75,
    avgGuestsPerSeating: 3.2,
  },
  {
    id: "tbl-2",
    tableName: "T-02",
    section: "Main Hall",
    totalSeatings: 14,
    avgDurationMinutes: 38,
    totalRevenue: 420.0,
    revenuePerHour: 66.3,
    avgGuestsPerSeating: 2.0,
  },
  {
    id: "tbl-3",
    tableName: "T-03",
    section: "Main Hall",
    totalSeatings: 5,
    avgDurationMinutes: 75,
    totalRevenue: 870.25,
    revenuePerHour: 69.6,
    avgGuestsPerSeating: 5.4,
  },
  {
    id: "tbl-4",
    tableName: "T-04",
    section: "Main Hall",
    totalSeatings: 10,
    avgDurationMinutes: 48,
    totalRevenue: 735.0,
    revenuePerHour: 91.88,
    avgGuestsPerSeating: 3.1,
  },
  {
    id: "tbl-5",
    tableName: "T-05",
    section: "Main Hall",
    totalSeatings: 3,
    avgDurationMinutes: 90,
    totalRevenue: 540.0,
    revenuePerHour: 36.0,
    avgGuestsPerSeating: 7.0,
  },
  {
    id: "tbl-6",
    tableName: "T-06",
    section: "Main Hall",
    totalSeatings: 11,
    avgDurationMinutes: 30,
    totalRevenue: 310.5,
    revenuePerHour: 62.1,
    avgGuestsPerSeating: 1.8,
  },
  {
    id: "tbl-7",
    tableName: "P-01",
    section: "Terrace",
    totalSeatings: 7,
    avgDurationMinutes: 65,
    totalRevenue: 980.75,
    revenuePerHour: 90.53,
    avgGuestsPerSeating: 3.7,
  },
  {
    id: "tbl-8",
    tableName: "P-02",
    section: "Terrace",
    totalSeatings: 9,
    avgDurationMinutes: 50,
    totalRevenue: 620.0,
    revenuePerHour: 74.4,
    avgGuestsPerSeating: 3.3,
  },
  {
    id: "tbl-9",
    tableName: "P-03",
    section: "Terrace",
    totalSeatings: 6,
    avgDurationMinutes: 42,
    totalRevenue: 270.0,
    revenuePerHour: 38.57,
    avgGuestsPerSeating: 1.8,
  },
  {
    id: "tbl-10",
    tableName: "P-04",
    section: "Terrace",
    totalSeatings: 4,
    avgDurationMinutes: 80,
    totalRevenue: 640.0,
    revenuePerHour: 48.0,
    avgGuestsPerSeating: 5.5,
  },
  {
    id: "tbl-11",
    tableName: "B-01",
    section: "Bar",
    totalSeatings: 20,
    avgDurationMinutes: 25,
    totalRevenue: 480.0,
    revenuePerHour: 115.2,
    avgGuestsPerSeating: 1.2,
  },
  {
    id: "tbl-12",
    tableName: "B-02",
    section: "Bar",
    totalSeatings: 18,
    avgDurationMinutes: 22,
    totalRevenue: 390.0,
    revenuePerHour: 106.36,
    avgGuestsPerSeating: 1.1,
  },
  {
    id: "tbl-13",
    tableName: "B-03",
    section: "Bar",
    totalSeatings: 16,
    avgDurationMinutes: 28,
    totalRevenue: 340.0,
    revenuePerHour: 72.86,
    avgGuestsPerSeating: 1.0,
  },
  {
    id: "tbl-14",
    tableName: "V-01",
    section: "VIP Room",
    totalSeatings: 2,
    avgDurationMinutes: 120,
    totalRevenue: 1240.0,
    revenuePerHour: 62.0,
    avgGuestsPerSeating: 8.5,
  },
  {
    id: "tbl-15",
    tableName: "V-02",
    section: "VIP Room",
    totalSeatings: 3,
    avgDurationMinutes: 95,
    totalRevenue: 980.0,
    revenuePerHour: 61.89,
    avgGuestsPerSeating: 7.0,
  },
];

const SECTION_OPTIONS = ["All Sections", ...mockSections.map(s => s.name)];

// ── Component ─────────────────────────────────────────────────────────────────

export default function TableTurnoverReport() {
  const { token } = antTheme.useToken();
  const restaurantMode = usePOSStore(s => s.restaurantMode);

  const [sectionFilter, setSectionFilter] = useState("All Sections");

  const filtered = useMemo(() => {
    if (sectionFilter === "All Sections") return MOCK_TURNOVER_DATA;
    return MOCK_TURNOVER_DATA.filter(r => r.section === sectionFilter);
  }, [sectionFilter]);

  // Summary stats
  const busiestTable = [...filtered].sort(
    (a, b) => b.totalSeatings - a.totalSeatings
  )[0];
  const avgTurnover =
    filtered.length > 0
      ? filtered.reduce((s, r) => s + r.avgDurationMinutes, 0) / filtered.length
      : 0;
  const totalCovers = filtered.reduce(
    (s, r) => s + r.totalSeatings * r.avgGuestsPerSeating,
    0
  );

  // Bar chart data — top 10 by revenue
  const chartData = [...filtered]
    .sort((a, b) => b.totalRevenue - a.totalRevenue)
    .slice(0, 10);

  // Color by section
  const sectionColors: Record<string, string> = {
    "Main Hall": token.colorPrimary,
    Terrace: "#10B981",
    Bar: "#F59E0B",
    "VIP Room": "#A855F7",
  };

  const columns: ColumnsType<TableTurnoverRow> = [
    {
      title: "Table",
      dataIndex: "tableName",
      key: "tableName",
      width: 90,
      render: (v: string) => (
        <span style={{ fontWeight: 700, color: token.colorText }}>{v}</span>
      ),
    },
    {
      title: "Section",
      dataIndex: "section",
      key: "section",
      width: 120,
      render: (v: string) => (
        <span
          style={{
            fontWeight: 600,
            color: sectionColors[v] ?? token.colorPrimary,
            fontSize: 13,
          }}
        >
          {v}
        </span>
      ),
    },
    {
      title: "Total Seatings",
      dataIndex: "totalSeatings",
      key: "seatings",
      width: 130,
      sorter: (a, b) => a.totalSeatings - b.totalSeatings,
      render: (v: number) => (
        <span style={{ fontWeight: 700, color: token.colorText }}>{v}</span>
      ),
    },
    {
      title: "Avg Duration (min)",
      dataIndex: "avgDurationMinutes",
      key: "duration",
      width: 160,
      sorter: (a, b) => a.avgDurationMinutes - b.avgDurationMinutes,
      render: (v: number) => (
        <span style={{ color: token.colorTextSecondary }}>{v} min</span>
      ),
    },
    {
      title: "Total Revenue",
      dataIndex: "totalRevenue",
      key: "revenue",
      width: 130,
      sorter: (a, b) => a.totalRevenue - b.totalRevenue,
      render: (v: number) => (
        <span style={{ fontWeight: 700, color: token.colorText }}>
          ${v.toFixed(2)}
        </span>
      ),
    },
    {
      title: "Revenue / Hour",
      dataIndex: "revenuePerHour",
      key: "revenuePerHour",
      width: 140,
      sorter: (a, b) => a.revenuePerHour - b.revenuePerHour,
      render: (v: number) => (
        <span style={{ fontWeight: 600, color: "#10B981" }}>
          ${v.toFixed(2)}/hr
        </span>
      ),
    },
    {
      title: "Avg Guests / Seating",
      dataIndex: "avgGuestsPerSeating",
      key: "avgGuests",
      width: 170,
      sorter: (a, b) => a.avgGuestsPerSeating - b.avgGuestsPerSeating,
      render: (v: number) => (
        <span style={{ color: token.colorTextSecondary }}>
          {v.toFixed(1)} guests
        </span>
      ),
    },
  ];

  // ── Restaurant mode gate ───────────────────────────────────────────────────
  if (!restaurantMode) {
    return (
      <div
        style={{ display: "flex", justifyContent: "center", padding: "60px 0" }}
      >
        <Result
          icon={<LockOutlined style={{ color: token.colorTextTertiary }} />}
          title="Restaurant Mode Required"
          subTitle="This report is only available when Restaurant Mode is enabled. Enable it in POS Settings."
          extra={null}
        />
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Summary cards + Export */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        <Row gutter={[16, 16]} style={{ flex: 1 }}>
          {[
            {
              title: "Busiest Table",
              value: busiestTable?.tableName ?? "—",
              sub: `${busiestTable?.totalSeatings ?? 0} seatings`,
              color: token.colorPrimary,
            },
            {
              title: "Avg Turnover Time",
              value: `${Math.round(avgTurnover)} min`,
              sub: "per seating",
              color: "#F59E0B",
            },
            {
              title: "Total Covers",
              value: Math.round(totalCovers).toString(),
              sub: "guests served",
              color: "#10B981",
            },
          ].map(s => (
            <Col xs={12} sm={12} md={8} key={s.title}>
              <Card
                style={{
                  border: `1px solid ${s.color}30`,
                  borderRadius: token.borderRadiusLG,
                  background: `${s.color}08`,
                }}
                styles={{ body: { padding: "16px 20px" } }}
              >
                <div
                  style={{
                    fontSize: 12,
                    color: token.colorTextSecondary,
                    marginBottom: 6,
                  }}
                >
                  {s.title}
                </div>
                <div
                  style={{
                    fontSize: 22,
                    fontWeight: 800,
                    color: s.color,
                    lineHeight: 1,
                  }}
                >
                  {s.value}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: token.colorTextTertiary,
                    marginTop: 4,
                  }}
                >
                  {s.sub}
                </div>
              </Card>
            </Col>
          ))}
        </Row>

        <Space style={{ flexShrink: 0 }}>
          <Button icon={<PrinterOutlined />} onClick={() => window.print()}>
            Print
          </Button>
          <Button icon={<DownloadOutlined />} type="primary">
            Export Excel
          </Button>
        </Space>
      </div>

      {/* Filters */}
      <Card
        style={{
          border: `1px solid ${token.colorBorderSecondary}`,
          borderRadius: token.borderRadiusLG,
        }}
        styles={{ body: { padding: "14px 20px" } }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <span
            style={{ fontSize: 13, fontWeight: 600, color: token.colorText }}
          >
            Filters:
          </span>
          <RangePicker
            style={{ borderRadius: 8 }}
            placeholder={["From date", "To date"]}
          />
          <Select
            value={sectionFilter}
            onChange={setSectionFilter}
            style={{ width: 180, borderRadius: 8 }}
          >
            {SECTION_OPTIONS.map(s => (
              <Option key={s} value={s}>
                {s}
              </Option>
            ))}
          </Select>
          <span
            style={{
              marginInlineStart: "auto",
              fontSize: 12,
              color: token.colorTextSecondary,
            }}
          >
            {filtered.length} tables
          </span>
        </div>
      </Card>

      {/* Bar Chart */}
      <Card
        title={
          <span style={{ fontWeight: 700 }}>Revenue by Table (Top 10)</span>
        }
        style={{
          border: `1px solid ${token.colorBorderSecondary}`,
          borderRadius: token.borderRadiusLG,
        }}
      >
        {chartData.length === 0 ? (
          <Empty
            description="No data for selected filters"
            style={{ padding: 40 }}
          />
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={token.colorBorderSecondary}
              />
              <XAxis
                dataKey="tableName"
                tick={{ fontSize: 12, fill: token.colorTextSecondary }}
              />
              <YAxis
                tick={{ fontSize: 11, fill: token.colorTextTertiary }}
                tickFormatter={v => `$${v}`}
              />
              <Tooltip
                formatter={(value: number) => [
                  `$${value.toFixed(2)}`,
                  "Revenue",
                ]}
                contentStyle={{
                  borderRadius: 8,
                  border: `1px solid ${token.colorBorderSecondary}`,
                  background: token.colorBgContainer,
                }}
              />
              <Bar dataKey="totalRevenue" radius={[4, 4, 0, 0]}>
                {chartData.map(entry => (
                  <Cell
                    key={entry.id}
                    fill={sectionColors[entry.section] ?? token.colorPrimary}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </Card>

      {/* Data Table */}
      <Card
        style={{
          border: `1px solid ${token.colorBorderSecondary}`,
          borderRadius: token.borderRadiusLG,
        }}
        styles={{ body: { padding: 0 } }}
      >
        <div
          style={{
            padding: "14px 20px",
            borderBottom: `1px solid ${token.colorBorderSecondary}`,
            fontWeight: 700,
            fontSize: 14,
          }}
        >
          Table Turnover Details
        </div>
        <Table<TableTurnoverRow>
          dataSource={filtered}
          columns={columns}
          rowKey="id"
          scroll={{ x: "max-content" }}
          locale={{
            emptyText: (
              <Empty
                description="No data for selected filters"
                style={{ padding: 40 }}
              />
            ),
          }}
          pagination={{
            pageSize: 10,
            showSizeChanger: false,
            showTotal: (total, range) => (
              <span style={{ fontSize: 12, color: token.colorTextSecondary }}>
                {range[0]}–{range[1]} of {total} tables
              </span>
            ),
          }}
        />
      </Card>
    </div>
  );
}
