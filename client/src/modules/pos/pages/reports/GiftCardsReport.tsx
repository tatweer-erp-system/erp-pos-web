import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  Col,
  DatePicker,
  Input,
  Row,
  Select,
  Table,
  Tag,
  theme as antTheme,
} from "antd";
import {
  SearchOutlined,
  CheckCircleOutlined,
  MinusCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { getAllGiftCards, type GiftCard } from "../../services/giftCardService";

const { RangePicker } = DatePicker;
const { Option } = Select;

const STATUS_CONFIG = {
  active:   { color: "#10B981", bg: "#10B98110", label: "Active",   icon: <CheckCircleOutlined /> },
  depleted: { color: "#F59E0B", bg: "#F59E0B10", label: "Depleted", icon: <MinusCircleOutlined /> },
  expired:  { color: "#EF4444", bg: "#EF444410", label: "Expired",  icon: <CloseCircleOutlined /> },
} as const;

export default function GiftCardsReport() {
  const { token } = antTheme.useToken();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: cards = [], isLoading } = useQuery({
    queryKey: ["gift-cards-report"],
    queryFn: getAllGiftCards,
    staleTime: 30_000,
  });

  // Summary stats
  const totalIssuedValue = cards.reduce((sum, c) => sum + c.issuedAmount, 0);
  const totalRedeemed = cards.reduce((sum, c) => sum + (c.issuedAmount - c.remainingBalance), 0);
  const totalOutstanding = cards.reduce((sum, c) => sum + c.remainingBalance, 0);
  const activeCount = cards.filter((c) => c.status === "active").length;

  // Filtered rows
  const filtered = cards.filter((c) => {
    const matchSearch =
      !search.trim() ||
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      (c.issuedTo?.toLowerCase().includes(search.toLowerCase()) ?? false);
    const matchStatus = statusFilter === "all" || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const columns: ColumnsType<GiftCard> = [
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
      render: (code: string) => (
        <span style={{
          fontFamily: "monospace", fontWeight: 700, fontSize: 13,
          background: "#A855F710", padding: "2px 8px",
          borderRadius: 6, color: "#A855F7",
        }}>
          {code}
        </span>
      ),
    },
    {
      title: "Issued Amount",
      dataIndex: "issuedAmount",
      key: "issuedAmount",
      width: 130,
      sorter: (a, b) => a.issuedAmount - b.issuedAmount,
      render: (v: number) => <span style={{ fontWeight: 700, color: token.colorText }}>${v.toFixed(2)}</span>,
    },
    {
      title: "Remaining",
      dataIndex: "remainingBalance",
      key: "remaining",
      width: 120,
      sorter: (a, b) => a.remainingBalance - b.remainingBalance,
      render: (v: number, record) => {
        const pct = record.issuedAmount > 0 ? (v / record.issuedAmount) * 100 : 0;
        return (
          <div>
            <span style={{ fontWeight: 700, color: v > 0 ? "#10B981" : token.colorTextTertiary }}>
              ${v.toFixed(2)}
            </span>
            <div style={{ height: 3, borderRadius: 2, background: token.colorFillSecondary, marginTop: 3 }}>
              <div style={{ height: "100%", width: `${pct}%`, background: "#10B981", borderRadius: 2 }} />
            </div>
          </div>
        );
      },
    },
    {
      title: "Issued To",
      dataIndex: "issuedTo",
      key: "issuedTo",
      render: (v?: string) => v
        ? <span style={{ fontSize: 13, color: token.colorText }}>{v}</span>
        : <span style={{ color: token.colorTextTertiary }}>Walk-in</span>,
    },
    {
      title: "Issue Date",
      dataIndex: "issuedDate",
      key: "issuedDate",
      width: 110,
      render: (v: string) => <span style={{ fontSize: 12, color: token.colorTextSecondary }}>{v}</span>,
    },
    {
      title: "Expiry Date",
      dataIndex: "expiryDate",
      key: "expiry",
      width: 110,
      render: (v?: string, record?: GiftCard) => {
        if (!v) return <span style={{ color: token.colorTextTertiary }}>No expiry</span>;
        const expired = record?.status === "expired";
        return (
          <span style={{ fontSize: 12, color: expired ? "#EF4444" : token.colorTextSecondary, fontWeight: expired ? 600 : 400 }}>
            {v}
          </span>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 110,
      render: (s: GiftCard["status"]) => {
        const cfg = STATUS_CONFIG[s];
        return (
          <Tag style={{
            background: cfg.bg, color: cfg.color,
            border: `1px solid ${cfg.color}40`,
            borderRadius: 6, fontWeight: 700, fontSize: 11,
            display: "inline-flex", alignItems: "center", gap: 4,
          }}>
            {cfg.icon} {cfg.label}
          </Tag>
        );
      },
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* Summary cards */}
      <Row gutter={[16, 16]}>
        {[
          { title: "Total Issued Value",  value: `$${totalIssuedValue.toFixed(2)}`,  color: "#A855F7",          suffix: "issued" },
          { title: "Total Redeemed",      value: `$${totalRedeemed.toFixed(2)}`,      color: "#10B981",          suffix: "used" },
          { title: "Outstanding Balance", value: `$${totalOutstanding.toFixed(2)}`,   color: "#F59E0B",          suffix: "remaining" },
          { title: "Active Cards",        value: activeCount,                          color: token.colorPrimary, suffix: "in circulation" },
        ].map((s) => (
          <Col xs={12} sm={12} md={6} key={s.title}>
            <Card
              style={{ border: `1px solid ${s.color}30`, borderRadius: token.borderRadiusLG, background: `${s.color}08` }}
              styles={{ body: { padding: "16px 20px" } }}
            >
              <div style={{ fontSize: 12, color: token.colorTextSecondary, marginBottom: 6 }}>{s.title}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 11, color: token.colorTextTertiary, marginTop: 4 }}>{s.suffix}</div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Table */}
      <Card
        style={{ border: `1px solid ${token.colorBorderSecondary}`, borderRadius: token.borderRadiusLG }}
        styles={{ body: { padding: 0 } }}
      >
        <div style={{
          display: "flex", alignItems: "center", gap: 12,
          padding: "16px 20px", borderBottom: `1px solid ${token.colorBorderSecondary}`, flexWrap: "wrap",
        }}>
          <Input
            placeholder="Search code or recipient…"
            prefix={<SearchOutlined style={{ color: token.colorTextTertiary }} />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            allowClear
            style={{ width: 260, borderRadius: 8 }}
          />
          <Select value={statusFilter} onChange={setStatusFilter} style={{ width: 130, borderRadius: 8 }}>
            <Option value="all">All Statuses</Option>
            <Option value="active">Active</Option>
            <Option value="depleted">Depleted</Option>
            <Option value="expired">Expired</Option>
          </Select>
          <RangePicker style={{ borderRadius: 8 }} placeholder={["Issue from", "Issue to"]} />
          <span style={{ marginInlineStart: "auto", fontSize: 12, color: token.colorTextSecondary }}>
            {filtered.length} of {cards.length} cards
          </span>
        </div>
        <Table<GiftCard>
          dataSource={filtered}
          columns={columns}
          rowKey="id"
          loading={isLoading}
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
