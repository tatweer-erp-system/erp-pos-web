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
  ArrowUpOutlined,
  ArrowDownOutlined,
  PrinterOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { usePOSStore, type CashMovement } from "../../store/posStore";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;
const { Option } = Select;

const MOCK_CASHIERS = ["All Cashiers", "Sarah M.", "John D.", "Ali K.", "Fatima H."];
const MOCK_TERMINALS = ["All Terminals", "Terminal 1", "Terminal 2", "Terminal 3"];

// ── Mock fallback data (shown when store has no movements) ────────────────────

const MOCK_MOVEMENTS: CashMovement[] = [
  {
    id: "cm-1",
    type: "in",
    amount: 500,
    reason: "Opening Float",
    note: "Starting cash for the day",
    timestamp: new Date("2026-03-09T08:00:00"),
    cashierName: "Sarah M.",
  },
  {
    id: "cm-2",
    type: "in",
    amount: 200,
    reason: "Bank Deposit",
    note: "Extra change added",
    timestamp: new Date("2026-03-09T10:30:00"),
    cashierName: "John D.",
  },
  {
    id: "cm-3",
    type: "out",
    amount: 150,
    reason: "Petty Cash",
    note: "Office supplies purchase",
    timestamp: new Date("2026-03-09T12:15:00"),
    cashierName: "Sarah M.",
  },
  {
    id: "cm-4",
    type: "out",
    amount: 80,
    reason: "Safe Drop",
    note: "Routine safe drop",
    timestamp: new Date("2026-03-09T14:00:00"),
    cashierName: "Ali K.",
  },
  {
    id: "cm-5",
    type: "in",
    amount: 100,
    reason: "Change Fund",
    note: "Added change for busy period",
    timestamp: new Date("2026-03-09T17:45:00"),
    cashierName: "Fatima H.",
  },
  {
    id: "cm-6",
    type: "out",
    amount: 350,
    reason: "Bank Deposit",
    note: "End-of-shift deposit",
    timestamp: new Date("2026-03-09T20:00:00"),
    cashierName: "John D.",
  },
];

// ── Component ─────────────────────────────────────────────────────────────────

export default function CashMovementsReport() {
  const { token } = antTheme.useToken();

  const [cashierFilter, setCashierFilter] = useState("All Cashiers");
  const [terminalFilter, setTerminalFilter] = useState("All Terminals");
  const [typeFilter, setTypeFilter] = useState<"all" | "in" | "out">("all");

  // Use real store movements if any, else fall back to mock data
  const storeMovements = usePOSStore((s) => s.cashMovements);
  const rawMovements = storeMovements.length > 0 ? storeMovements : MOCK_MOVEMENTS;

  const filtered = useMemo(() => {
    return rawMovements.filter((m) => {
      const matchType = typeFilter === "all" || m.type === typeFilter;
      const matchCashier =
        cashierFilter === "All Cashiers" || m.cashierName === cashierFilter;
      return matchType && matchCashier;
    });
  }, [rawMovements, typeFilter, cashierFilter]);

  // Summary stats
  const totalIn  = filtered.filter((m) => m.type === "in" ).reduce((s, m) => s + m.amount, 0);
  const totalOut = filtered.filter((m) => m.type === "out").reduce((s, m) => s + m.amount, 0);
  const netMovement = totalIn - totalOut;

  const columns: ColumnsType<CashMovement> = [
    {
      title: "Date / Time",
      dataIndex: "timestamp",
      key: "timestamp",
      width: 160,
      sorter: (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
      render: (v: Date) => (
        <span style={{ fontSize: 12, color: token.colorTextSecondary }}>
          {dayjs(v).format("YYYY-MM-DD HH:mm")}
        </span>
      ),
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      width: 100,
      render: (type: "in" | "out") =>
        type === "in" ? (
          <Tag
            style={{
              background: "#10B98110", color: "#10B981",
              border: "1px solid #10B98140", borderRadius: 6,
              fontWeight: 700, fontSize: 11,
              display: "inline-flex", alignItems: "center", gap: 4,
            }}
          >
            <ArrowDownOutlined /> Cash In
          </Tag>
        ) : (
          <Tag
            style={{
              background: "#EF444410", color: "#EF4444",
              border: "1px solid #EF444440", borderRadius: 6,
              fontWeight: 700, fontSize: 11,
              display: "inline-flex", alignItems: "center", gap: 4,
            }}
          >
            <ArrowUpOutlined /> Cash Out
          </Tag>
        ),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      width: 120,
      sorter: (a, b) => a.amount - b.amount,
      render: (v: number, record) => (
        <span
          style={{
            fontWeight: 700,
            color: record.type === "in" ? "#10B981" : "#EF4444",
          }}
        >
          {record.type === "in" ? "+" : "−"}${v.toFixed(2)}
        </span>
      ),
    },
    {
      title: "Reason",
      dataIndex: "reason",
      key: "reason",
      render: (v: string) => (
        <span style={{ fontWeight: 600, color: token.colorText }}>{v}</span>
      ),
    },
    {
      title: "Note",
      dataIndex: "note",
      key: "note",
      render: (v: string) => (
        <span style={{ color: token.colorTextSecondary, fontSize: 13 }}>
          {v || <span style={{ color: token.colorTextTertiary }}>—</span>}
        </span>
      ),
    },
    {
      title: "Cashier",
      dataIndex: "cashierName",
      key: "cashier",
      width: 130,
      render: (v: string) => (
        <span style={{ fontSize: 13, color: token.colorText }}>{v}</span>
      ),
    },
    {
      title: "Terminal",
      key: "terminal",
      width: 120,
      render: () => (
        <span style={{ color: token.colorTextSecondary, fontSize: 12 }}>Terminal 1</span>
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
              title: "Total Cash In",
              value: `$${totalIn.toFixed(2)}`,
              color: "#10B981",
              suffix: `${filtered.filter((m) => m.type === "in").length} movements`,
            },
            {
              title: "Total Cash Out",
              value: `$${totalOut.toFixed(2)}`,
              color: "#EF4444",
              suffix: `${filtered.filter((m) => m.type === "out").length} movements`,
            },
            {
              title: "Net Cash Movement",
              value: `${netMovement >= 0 ? "+" : ""}$${netMovement.toFixed(2)}`,
              color: netMovement >= 0 ? token.colorPrimary : "#EF4444",
              suffix: netMovement >= 0 ? "net inflow" : "net outflow",
            },
          ].map((s) => (
            <Col xs={12} sm={12} md={8} key={s.title}>
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
                  {s.suffix}
                </div>
              </Card>
            </Col>
          ))}
        </Row>

        <Space style={{ flexShrink: 0 }}>
          <Button icon={<PrinterOutlined />} onClick={() => window.print()}>Print</Button>
          <Button icon={<DownloadOutlined />} type="primary">Export Excel</Button>
        </Space>
      </div>

      {/* Table with filters */}
      <Card
        style={{ border: `1px solid ${token.colorBorderSecondary}`, borderRadius: token.borderRadiusLG }}
        styles={{ body: { padding: 0 } }}
      >
        <div style={{
          display: "flex", alignItems: "center", gap: 12,
          padding: "16px 20px", borderBottom: `1px solid ${token.colorBorderSecondary}`, flexWrap: "wrap",
        }}>
          <RangePicker style={{ borderRadius: 8 }} placeholder={["From date", "To date"]} />
          <Select value={cashierFilter} onChange={setCashierFilter} style={{ width: 160, borderRadius: 8 }}>
            {MOCK_CASHIERS.map((c) => <Option key={c} value={c}>{c}</Option>)}
          </Select>
          <Select value={terminalFilter} onChange={setTerminalFilter} style={{ width: 160, borderRadius: 8 }}>
            {MOCK_TERMINALS.map((t) => <Option key={t} value={t}>{t}</Option>)}
          </Select>
          <Select
            value={typeFilter}
            onChange={(v) => setTypeFilter(v as "all" | "in" | "out")}
            style={{ width: 140, borderRadius: 8 }}
          >
            <Option value="all">All Types</Option>
            <Option value="in">Cash In</Option>
            <Option value="out">Cash Out</Option>
          </Select>
          <span style={{ marginInlineStart: "auto", fontSize: 12, color: token.colorTextSecondary }}>
            {filtered.length} of {rawMovements.length} movements
          </span>
        </div>
        <Table<CashMovement>
          dataSource={filtered}
          columns={columns}
          rowKey="id"
          scroll={{ x: "max-content" }}
          pagination={{
            pageSize: 10,
            showSizeChanger: false,
            showTotal: (total, range) => (
              <span style={{ fontSize: 12, color: token.colorTextSecondary }}>
                {range[0]}–{range[1]} of {total} records
              </span>
            ),
          }}
        />
      </Card>
    </div>
  );
}
