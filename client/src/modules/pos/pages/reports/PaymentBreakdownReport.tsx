import { useState, useMemo } from "react";
import {
  Card,
  Col,
  DatePicker,
  Row,
  Select,
  Table,
  Tag,
  theme as antTheme,
  Button,
  Space,
} from "antd";
import {
  CreditCardOutlined,
  DollarOutlined,
  GiftOutlined,
  TagOutlined,
  PrinterOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const { RangePicker } = DatePicker;
const { Option } = Select;

// ── Types & mock data ─────────────────────────────────────────────────────────

type PaymentMethod = "cash" | "card" | "gift_card" | "voucher";

interface PaymentRow {
  id: string;
  method: PaymentMethod;
  transactionCount: number;
  totalAmount: number;
  percentage: number;
}

const METHOD_CONFIG: Record<
  PaymentMethod,
  { label: string; color: string; bg: string; icon: React.ReactNode }
> = {
  cash: {
    label: "Cash",
    color: "#10B981",
    bg: "#10B98110",
    icon: <DollarOutlined />,
  },
  card: {
    label: "Card",
    color: "#0066CC",
    bg: "#0066CC10",
    icon: <CreditCardOutlined />,
  },
  gift_card: {
    label: "Gift Card",
    color: "#A855F7",
    bg: "#A855F710",
    icon: <GiftOutlined />,
  },
  voucher: {
    label: "Voucher",
    color: "#F59E0B",
    bg: "#F59E0B10",
    icon: <TagOutlined />,
  },
};

const MOCK_CASHIERS = [
  "All Cashiers",
  "Sarah M.",
  "John D.",
  "Ali K.",
  "Fatima H.",
];
const MOCK_TERMINALS = [
  "All Terminals",
  "Terminal 1",
  "Terminal 2",
  "Terminal 3",
];

function generateMockPaymentData(): PaymentRow[] {
  const raw: [PaymentMethod, number, number][] = [
    ["cash", 148, 3210.5],
    ["card", 215, 6870.25],
    ["gift_card", 38, 980.0],
    ["voucher", 24, 420.75],
  ];
  const grandTotal = raw.reduce((s, [, , amt]) => s + amt, 0);
  return raw.map(([method, txCount, totalAmount]) => ({
    id: method,
    method,
    transactionCount: txCount,
    totalAmount,
    percentage: parseFloat(((totalAmount / grandTotal) * 100).toFixed(1)),
  }));
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function PaymentBreakdownReport() {
  const { token } = antTheme.useToken();

  const [cashierFilter, setCashierFilter] = useState("All Cashiers");
  const [terminalFilter, setTerminalFilter] = useState("All Terminals");

  const data = useMemo(() => generateMockPaymentData(), []);

  const totalCash = data.find(r => r.method === "cash")?.totalAmount ?? 0;
  const totalCard = data.find(r => r.method === "card")?.totalAmount ?? 0;
  const totalGiftCard =
    data.find(r => r.method === "gift_card")?.totalAmount ?? 0;
  const totalVoucher = data.find(r => r.method === "voucher")?.totalAmount ?? 0;

  const pieData = data.map(r => ({
    name: METHOD_CONFIG[r.method].label,
    value: r.totalAmount,
    color: METHOD_CONFIG[r.method].color,
  }));

  const columns: ColumnsType<PaymentRow> = [
    {
      title: "Payment Method",
      dataIndex: "method",
      key: "method",
      render: (m: PaymentMethod) => {
        const cfg = METHOD_CONFIG[m];
        return (
          <Tag
            style={{
              background: cfg.bg,
              color: cfg.color,
              border: `1px solid ${cfg.color}40`,
              borderRadius: 6,
              fontWeight: 700,
              fontSize: 12,
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              padding: "3px 10px",
            }}
          >
            {cfg.icon} {cfg.label}
          </Tag>
        );
      },
    },
    {
      title: "Transaction Count",
      dataIndex: "transactionCount",
      key: "txCount",
      width: 160,
      sorter: (a, b) => a.transactionCount - b.transactionCount,
      render: (v: number) => (
        <span style={{ fontWeight: 600, color: token.colorText }}>{v}</span>
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
          style={{ fontWeight: 700, color: METHOD_CONFIG[record.method].color }}
        >
          ${v.toFixed(2)}
        </span>
      ),
    },
    {
      title: "% of Total",
      dataIndex: "percentage",
      key: "percentage",
      width: 130,
      sorter: (a, b) => a.percentage - b.percentage,
      render: (v: number, record) => (
        <div>
          <span style={{ fontWeight: 700, color: token.colorText }}>{v}%</span>
          <div
            style={{
              height: 4,
              borderRadius: 2,
              background: token.colorFillSecondary,
              marginTop: 4,
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${v}%`,
                background: METHOD_CONFIG[record.method].color,
                borderRadius: 2,
              }}
            />
          </div>
        </div>
      ),
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Summary cards + Export */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        <Row gutter={[16, 16]} style={{ flex: 1 }}>
          {[
            {
              title: "Total Cash",
              value: `$${totalCash.toFixed(2)}`,
              color: "#10B981",
              suffix: "cash payments",
            },
            {
              title: "Total Card",
              value: `$${totalCard.toFixed(2)}`,
              color: "#0066CC",
              suffix: "card payments",
            },
            {
              title: "Total Gift Card",
              value: `$${totalGiftCard.toFixed(2)}`,
              color: "#A855F7",
              suffix: "gift card payments",
            },
            {
              title: "Total Voucher Disc.",
              value: `$${totalVoucher.toFixed(2)}`,
              color: "#F59E0B",
              suffix: "voucher discounts",
            },
          ].map(s => (
            <Col xs={12} sm={12} md={6} key={s.title}>
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
                  {s.suffix}
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
            value={terminalFilter}
            onChange={setTerminalFilter}
            style={{ width: 160, borderRadius: 8 }}
          >
            {MOCK_TERMINALS.map(t => (
              <Option key={t} value={t}>
                {t}
              </Option>
            ))}
          </Select>
          <Select
            value={cashierFilter}
            onChange={setCashierFilter}
            style={{ width: 160, borderRadius: 8 }}
          >
            {MOCK_CASHIERS.map(c => (
              <Option key={c} value={c}>
                {c}
              </Option>
            ))}
          </Select>
        </div>
      </Card>

      {/* Chart + Table side by side on large screens */}
      <Row gutter={[16, 16]}>
        {/* Pie Chart */}
        <Col xs={24} md={10}>
          <Card
            title={<span style={{ fontWeight: 700 }}>Payment Split</span>}
            style={{
              border: `1px solid ${token.colorBorderSecondary}`,
              borderRadius: token.borderRadiusLG,
              height: "100%",
            }}
          >
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={120}
                  paddingAngle={3}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  labelLine={false}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
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
                <Legend
                  formatter={value => (
                    <span style={{ fontSize: 13, color: token.colorText }}>
                      {value}
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* Table */}
        <Col xs={24} md={14}>
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
              Breakdown by Method
            </div>
            <Table<PaymentRow>
              dataSource={data}
              columns={columns}
              rowKey="id"
              scroll={{ x: "max-content" }}
              pagination={false}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
