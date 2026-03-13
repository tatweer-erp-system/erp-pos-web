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
  ClockCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { getAllVouchers, type Voucher } from "../../services/voucherService";

const { RangePicker } = DatePicker;
const { Option } = Select;

const STATUS_CONFIG = {
  active: {
    color: "#10B981",
    bg: "#10B98110",
    label: "Active",
    icon: <CheckCircleOutlined />,
  },
  used: {
    color: "#0066CC",
    bg: "#0066CC10",
    label: "Used",
    icon: <ClockCircleOutlined />,
  },
  expired: {
    color: "#EF4444",
    bg: "#EF444410",
    label: "Expired",
    icon: <CloseCircleOutlined />,
  },
} as const;

export default function VouchersReport() {
  const { token } = antTheme.useToken();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const { data: vouchers = [], isLoading } = useQuery({
    queryKey: ["vouchers-report"],
    queryFn: getAllVouchers,
    staleTime: 30_000,
  });

  // Summary stats
  const totalIssued = vouchers.length;
  const totalRedeemed = vouchers.filter(v => v.status === "used").length;
  const totalActive = vouchers.filter(v => v.status === "active").length;
  const totalDiscountGiven = vouchers
    .filter(v => v.status === "used")
    .reduce((sum, v) => sum + v.discountValue, 0);

  // Filtered rows
  const filtered = vouchers.filter(v => {
    const matchSearch =
      !search.trim() ||
      v.code.toLowerCase().includes(search.toLowerCase()) ||
      (v.usedBy?.toLowerCase().includes(search.toLowerCase()) ?? false) ||
      (v.orderRef?.toLowerCase().includes(search.toLowerCase()) ?? false);
    const matchStatus = statusFilter === "all" || v.status === statusFilter;
    const matchType = typeFilter === "all" || v.discountType === typeFilter;
    return matchSearch && matchStatus && matchType;
  });

  const columns: ColumnsType<Voucher> = [
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
      render: (code: string) => (
        <span
          style={{
            fontFamily: "monospace",
            fontWeight: 700,
            fontSize: 13,
            background: token.colorFillAlter,
            padding: "2px 8px",
            borderRadius: 6,
            color: token.colorPrimary,
          }}
        >
          {code}
        </span>
      ),
    },
    {
      title: "Type",
      key: "type",
      width: 130,
      render: (_, r) => (
        <Tag
          color={r.discountType === "percent" ? "blue" : "green"}
          style={{ borderRadius: 6, fontWeight: 600, fontSize: 11 }}
        >
          {r.discountType === "percent"
            ? `${r.discountValue}% Off`
            : `$${r.discountValue.toFixed(2)} Off`}
        </Tag>
      ),
    },
    {
      title: "Min Order",
      dataIndex: "minOrderAmount",
      key: "minOrder",
      width: 100,
      render: (v: number) => (v > 0 ? `$${v.toFixed(2)}` : "—"),
    },
    {
      title: "Used By",
      dataIndex: "usedBy",
      key: "usedBy",
      render: (v?: string) =>
        v ? (
          <span style={{ fontSize: 13, color: token.colorText }}>{v}</span>
        ) : (
          <span style={{ color: token.colorTextTertiary }}>—</span>
        ),
    },
    {
      title: "Used Date",
      dataIndex: "usedDate",
      key: "usedDate",
      width: 115,
      render: (v?: string) =>
        v ? (
          <span style={{ fontSize: 12, color: token.colorTextSecondary }}>
            {v}
          </span>
        ) : (
          <span style={{ color: token.colorTextTertiary }}>—</span>
        ),
    },
    {
      title: "Order Ref",
      dataIndex: "orderRef",
      key: "orderRef",
      render: (v?: string) =>
        v ? (
          <span
            style={{
              fontFamily: "monospace",
              fontSize: 12,
              color: token.colorPrimary,
            }}
          >
            {v}
          </span>
        ) : (
          <span style={{ color: token.colorTextTertiary }}>—</span>
        ),
    },
    {
      title: "Expiry",
      dataIndex: "expiryDate",
      key: "expiry",
      width: 110,
      render: (v?: string) =>
        v ? (
          <span style={{ fontSize: 12, color: token.colorTextSecondary }}>
            {v}
          </span>
        ) : (
          <span style={{ color: token.colorTextTertiary }}>No expiry</span>
        ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (s: Voucher["status"]) => {
        const cfg = STATUS_CONFIG[s];
        return (
          <Tag
            style={{
              background: cfg.bg,
              color: cfg.color,
              border: `1px solid ${cfg.color}40`,
              borderRadius: 6,
              fontWeight: 700,
              fontSize: 11,
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
            }}
          >
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
          {
            title: "Total Issued",
            value: totalIssued,
            color: token.colorPrimary,
            suffix: "vouchers",
          },
          {
            title: "Redeemed",
            value: totalRedeemed,
            color: "#10B981",
            suffix: "used",
          },
          {
            title: "Active",
            value: totalActive,
            color: "#F59E0B",
            suffix: "available",
          },
          {
            title: "Total Discount Given",
            value: `$${totalDiscountGiven.toFixed(2)}`,
            color: "#EF4444",
            suffix: "given out",
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

      {/* Table */}
      <Card
        style={{
          border: `1px solid ${token.colorBorderSecondary}`,
          borderRadius: token.borderRadiusLG,
        }}
        styles={{ body: { padding: 0 } }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "16px 20px",
            borderBottom: `1px solid ${token.colorBorderSecondary}`,
            flexWrap: "wrap",
          }}
        >
          <Input
            placeholder="Search code, customer, order ref…"
            prefix={
              <SearchOutlined style={{ color: token.colorTextTertiary }} />
            }
            value={search}
            onChange={e => setSearch(e.target.value)}
            allowClear
            style={{ width: 260, borderRadius: 8 }}
          />
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            style={{ width: 130, borderRadius: 8 }}
          >
            <Option value="all">All Statuses</Option>
            <Option value="active">Active</Option>
            <Option value="used">Used</Option>
            <Option value="expired">Expired</Option>
          </Select>
          <Select
            value={typeFilter}
            onChange={setTypeFilter}
            style={{ width: 150, borderRadius: 8 }}
          >
            <Option value="all">All Types</Option>
            <Option value="percent">Percentage</Option>
            <Option value="fixed">Fixed Amount</Option>
          </Select>
          <RangePicker
            style={{ borderRadius: 8 }}
            placeholder={["From date", "To date"]}
          />
          <span
            style={{
              marginInlineStart: "auto",
              fontSize: 12,
              color: token.colorTextSecondary,
            }}
          >
            {filtered.length} of {vouchers.length} vouchers
          </span>
        </div>
        <Table<Voucher>
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
