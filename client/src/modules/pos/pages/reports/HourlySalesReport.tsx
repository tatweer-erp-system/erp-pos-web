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
} from "antd";
import {
  PrinterOutlined,
  DownloadOutlined,
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
import dayjs from "dayjs";

const { Option } = Select;

// ── Mock data generation ──────────────────────────────────────────────────────

interface HourlyRow {
  hour: number;
  label: string;
  transactionCount: number;
  totalAmount: number;
  avgTransactionValue: number;
}

function generateMockHourlyData(): HourlyRow[] {
  // Simulate a realistic restaurant/retail sales day pattern
  const baseData: [number, number][] = [
    [0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0],
    [6, 2], [7, 5], [8, 12], [9, 18], [10, 22], [11, 35],
    [12, 58], [13, 61], [14, 42], [15, 30], [16, 28], [17, 33],
    [18, 55], [19, 72], [20, 65], [21, 48], [22, 30], [23, 10],
  ];
  return baseData.map(([hour, txCount]) => {
    const avgTx = txCount > 0 ? 18 + Math.random() * 30 : 0;
    const total = txCount * avgTx;
    const label =
      hour === 0 ? "12 AM" :
      hour < 12 ? `${hour} AM` :
      hour === 12 ? "12 PM" :
      `${hour - 12} PM`;
    return {
      hour,
      label,
      transactionCount: txCount,
      totalAmount: parseFloat(total.toFixed(2)),
      avgTransactionValue: parseFloat(avgTx.toFixed(2)),
    };
  });
}

const MOCK_CASHIERS = ["All Cashiers", "Sarah M.", "John D.", "Ali K.", "Fatima H."];
const MOCK_TERMINALS = ["All Terminals", "Terminal 1", "Terminal 2", "Terminal 3"];

// ── Component ─────────────────────────────────────────────────────────────────

export default function HourlySalesReport() {
  const { token } = antTheme.useToken();

  const [cashierFilter, setCashierFilter] = useState("All Cashiers");
  const [terminalFilter, setTerminalFilter] = useState("All Terminals");

  const data = useMemo(() => generateMockHourlyData(), []);

  // Determine peak hours (top 3 by totalAmount)
  const sortedByRevenue = [...data].sort((a, b) => b.totalAmount - a.totalAmount);
  const peakHourSet = new Set(sortedByRevenue.slice(0, 3).map((r) => r.hour));

  // Summary stats
  const busiestHour = sortedByRevenue[0];
  const slowestHour = [...data]
    .filter((r) => r.transactionCount > 0)
    .sort((a, b) => a.totalAmount - b.totalAmount)[0];
  const peakRevenueHour = busiestHour;
  const totalRevenue = data.reduce((s, r) => s + r.totalAmount, 0);

  const columns: ColumnsType<HourlyRow> = [
    {
      title: "Hour",
      dataIndex: "label",
      key: "hour",
      width: 90,
      render: (v: string) => (
        <span style={{ fontWeight: 600, color: token.colorText }}>{v}</span>
      ),
    },
    {
      title: "Transactions",
      dataIndex: "transactionCount",
      key: "txCount",
      width: 130,
      sorter: (a, b) => a.transactionCount - b.transactionCount,
      render: (v: number) => (
        <span style={{ color: v === 0 ? token.colorTextTertiary : token.colorText }}>
          {v === 0 ? "—" : v}
        </span>
      ),
    },
    {
      title: "Total Amount",
      dataIndex: "totalAmount",
      key: "totalAmount",
      width: 140,
      sorter: (a, b) => a.totalAmount - b.totalAmount,
      render: (v: number, record) => (
        <span
          style={{
            fontWeight: 700,
            color: peakHourSet.has(record.hour) ? token.colorPrimary : token.colorText,
          }}
        >
          {v === 0 ? "—" : `$${v.toFixed(2)}`}
        </span>
      ),
    },
    {
      title: "Avg Transaction",
      dataIndex: "avgTransactionValue",
      key: "avgTx",
      width: 150,
      sorter: (a, b) => a.avgTransactionValue - b.avgTransactionValue,
      render: (v: number) => (
        <span style={{ color: v === 0 ? token.colorTextTertiary : token.colorTextSecondary }}>
          {v === 0 ? "—" : `$${v.toFixed(2)}`}
        </span>
      ),
    },
  ];

  const PEAK_COLOR = token.colorPrimary;
  const NORMAL_COLOR = `${token.colorPrimary}60`;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* Summary cards + Export buttons */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        <Row gutter={[16, 16]} style={{ flex: 1 }}>
          {[
            {
              title: "Busiest Hour",
              value: busiestHour?.label ?? "—",
              sub: `${busiestHour?.transactionCount ?? 0} transactions`,
              color: token.colorPrimary,
            },
            {
              title: "Slowest Hour",
              value: slowestHour?.label ?? "—",
              sub: `${slowestHour?.transactionCount ?? 0} transactions`,
              color: "#F59E0B",
            },
            {
              title: "Peak Revenue Hour",
              value: peakRevenueHour?.label ?? "—",
              sub: `$${peakRevenueHour?.totalAmount?.toFixed(2) ?? "0.00"}`,
              color: "#10B981",
            },
            {
              title: "Day Total Revenue",
              value: `$${totalRevenue.toFixed(2)}`,
              sub: `${data.reduce((s, r) => s + r.transactionCount, 0)} transactions`,
              color: "#A855F7",
            },
          ].map((s) => (
            <Col xs={12} sm={12} md={6} key={s.title}>
              <Card
                style={{
                  border: `1px solid ${s.color}30`,
                  borderRadius: token.borderRadiusLG,
                  background: `${s.color}08`,
                }}
                styles={{ body: { padding: "16px 20px" } }}
              >
                <div style={{ fontSize: 12, color: token.colorTextSecondary, marginBottom: 6 }}>
                  {s.title}
                </div>
                <div style={{ fontSize: 22, fontWeight: 800, color: s.color, lineHeight: 1 }}>
                  {s.value}
                </div>
                <div style={{ fontSize: 11, color: token.colorTextTertiary, marginTop: 4 }}>
                  {s.sub}
                </div>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Export/Print buttons */}
        <Space style={{ flexShrink: 0, marginTop: 0 }}>
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
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: token.colorText }}>Filters:</span>
          <DatePicker
            defaultValue={dayjs()}
            style={{ borderRadius: 8 }}
            placeholder="Select date"
          />
          <Select
            value={cashierFilter}
            onChange={setCashierFilter}
            style={{ width: 160, borderRadius: 8 }}
          >
            {MOCK_CASHIERS.map((c) => (
              <Option key={c} value={c}>{c}</Option>
            ))}
          </Select>
          <Select
            value={terminalFilter}
            onChange={setTerminalFilter}
            style={{ width: 160, borderRadius: 8 }}
          >
            {MOCK_TERMINALS.map((t) => (
              <Option key={t} value={t}>{t}</Option>
            ))}
          </Select>
          <div style={{ marginInlineStart: "auto", display: "flex", alignItems: "center", gap: 8 }}>
            <span
              style={{
                display: "inline-block", width: 12, height: 12, borderRadius: 3,
                background: PEAK_COLOR,
              }}
            />
            <span style={{ fontSize: 12, color: token.colorTextSecondary }}>Peak hours</span>
            <span
              style={{
                display: "inline-block", width: 12, height: 12, borderRadius: 3,
                background: NORMAL_COLOR, marginInlineStart: 8,
              }}
            />
            <span style={{ fontSize: 12, color: token.colorTextSecondary }}>Regular hours</span>
          </div>
        </div>
      </Card>

      {/* Bar Chart */}
      <Card
        title={<span style={{ fontWeight: 700 }}>Sales by Hour</span>}
        style={{
          border: `1px solid ${token.colorBorderSecondary}`,
          borderRadius: token.borderRadiusLG,
        }}
      >
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={token.colorBorderSecondary} />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: token.colorTextTertiary }}
              interval={0}
              angle={-45}
              textAnchor="end"
              height={55}
            />
            <YAxis
              tick={{ fontSize: 11, fill: token.colorTextTertiary }}
              tickFormatter={(v) => `$${v}`}
            />
            <Tooltip
              formatter={(value: number) => [`$${value.toFixed(2)}`, "Revenue"]}
              contentStyle={{
                borderRadius: 8,
                border: `1px solid ${token.colorBorderSecondary}`,
                background: token.colorBgContainer,
              }}
            />
            <Bar dataKey="totalAmount" radius={[4, 4, 0, 0]}>
              {data.map((entry) => (
                <Cell
                  key={`cell-${entry.hour}`}
                  fill={peakHourSet.has(entry.hour) ? PEAK_COLOR : NORMAL_COLOR}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Data Table */}
      <Card
        style={{
          border: `1px solid ${token.colorBorderSecondary}`,
          borderRadius: token.borderRadiusLG,
        }}
        styles={{ body: { padding: 0 } }}
      >
        <div style={{
          padding: "14px 20px",
          borderBottom: `1px solid ${token.colorBorderSecondary}`,
          fontWeight: 700, fontSize: 14,
        }}>
          Hourly Breakdown
        </div>
        <Table<HourlyRow>
          dataSource={data}
          columns={columns}
          rowKey="hour"
          scroll={{ x: "max-content" }}
          rowClassName={(record) =>
            peakHourSet.has(record.hour) ? "" : ""
          }
          onRow={(record) => ({
            style: {
              background: peakHourSet.has(record.hour)
                ? `${token.colorPrimary}08`
                : undefined,
            },
          })}
          pagination={{
            pageSize: 24,
            showSizeChanger: false,
            showTotal: (total, range) => (
              <span style={{ fontSize: 12, color: token.colorTextSecondary }}>
                {range[0]}–{range[1]} of {total} hours
              </span>
            ),
          }}
        />
      </Card>
    </div>
  );
}
