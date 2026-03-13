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
  GiftOutlined,
  SearchOutlined,
  StarOutlined,
  TeamOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { getAllCustomers } from "../services/customerService";
import { getTier, LOYALTY_TIERS, type Customer } from "../data/mockCustomers";

const { RangePicker } = DatePicker;
const { Option } = Select;

export default function LoyaltyReport() {
  const { token } = antTheme.useToken();

  const [search, setSearch] = useState("");
  const [tierFilter, setTierFilter] = useState<string>("all");

  const { data: customers = [], isLoading } = useQuery({
    queryKey: ["loyalty-report-customers"],
    queryFn: getAllCustomers,
    staleTime: 30_000,
  });

  // Derived stats
  const activeCustomers = customers.filter(c => c.transactionCount > 0).length;
  const totalPointsIssued = customers.reduce(
    (sum, c) => sum + Math.round(c.totalSpent * 0.1),
    0
  );
  const totalPointsOutstanding = customers.reduce(
    (sum, c) => sum + c.loyaltyPoints,
    0
  );
  const totalPointsRedeemed = totalPointsIssued - totalPointsOutstanding;

  // Filtered rows
  const filtered = customers.filter(c => {
    const matchSearch =
      !search.trim() ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search);
    const matchTier = tierFilter === "all" || c.tierId === tierFilter;
    return matchSearch && matchTier;
  });

  const columns: ColumnsType<Customer> = [
    {
      title: "Customer",
      dataIndex: "name",
      key: "name",
      render: (name: string, record) => {
        const tier = getTier(record.loyaltyPoints);
        return (
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: "50%",
                background: `${tier.color}20`,
                border: `1.5px solid ${tier.color}60`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 13,
                fontWeight: 800,
                color: tier.color,
                flexShrink: 0,
              }}
            >
              {name.charAt(0)}
            </div>
            <div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: token.colorText,
                }}
              >
                {name}
              </div>
              <div style={{ fontSize: 11, color: token.colorTextSecondary }}>
                {record.phone}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      title: "Tier",
      dataIndex: "tierId",
      key: "tier",
      width: 110,
      render: (_, record) => {
        const tier = getTier(record.loyaltyPoints);
        return (
          <Tag
            style={{
              background: `${tier.color}20`,
              color: tier.color,
              border: `1px solid ${tier.color}40`,
              borderRadius: 6,
              fontWeight: 700,
              fontSize: 11,
            }}
          >
            {tier.name}
          </Tag>
        );
      },
    },
    {
      title: "Points Earned",
      key: "earned",
      width: 130,
      align: "right",
      render: (_, record) => {
        const earned = Math.round(record.totalSpent * 0.1);
        return (
          <span style={{ fontSize: 13, fontWeight: 600, color: "#10B981" }}>
            +{earned.toLocaleString()}
          </span>
        );
      },
      sorter: (a, b) =>
        Math.round(a.totalSpent * 0.1) - Math.round(b.totalSpent * 0.1),
    },
    {
      title: "Points Redeemed",
      key: "redeemed",
      width: 140,
      align: "right",
      render: (_, record) => {
        const earned = Math.round(record.totalSpent * 0.1);
        const redeemed = Math.max(0, earned - record.loyaltyPoints);
        return (
          <span style={{ fontSize: 13, fontWeight: 600, color: "#EF4444" }}>
            −{redeemed.toLocaleString()}
          </span>
        );
      },
    },
    {
      title: "Balance",
      dataIndex: "loyaltyPoints",
      key: "balance",
      width: 110,
      align: "right",
      sorter: (a, b) => a.loyaltyPoints - b.loyaltyPoints,
      defaultSortOrder: "descend",
      render: (pts: number) => (
        <span
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: token.colorPrimary,
            background: `${token.colorPrimary}12`,
            padding: "2px 8px",
            borderRadius: 6,
          }}
        >
          {pts.toLocaleString()} pts
        </span>
      ),
    },
    {
      title: "Total Spent",
      dataIndex: "totalSpent",
      key: "totalSpent",
      width: 120,
      align: "right",
      sorter: (a, b) => a.totalSpent - b.totalSpent,
      render: (v: number) => (
        <span style={{ fontSize: 13, fontWeight: 500, color: token.colorText }}>
          ${v.toLocaleString()}
        </span>
      ),
    },
    {
      title: "Transactions",
      dataIndex: "transactionCount",
      key: "txn",
      width: 110,
      align: "right",
      sorter: (a, b) => a.transactionCount - b.transactionCount,
      render: (v: number) => (
        <span style={{ fontSize: 13, color: token.colorTextSecondary }}>
          {v}
        </span>
      ),
    },
    {
      title: "Last Transaction",
      dataIndex: "lastTransaction",
      key: "lastTxn",
      width: 140,
      render: (v?: string) =>
        v ? (
          <span style={{ fontSize: 12, color: token.colorTextSecondary }}>
            {v}
          </span>
        ) : (
          <span style={{ fontSize: 12, color: token.colorTextTertiary }}>
            —
          </span>
        ),
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Summary cards */}
      <Row gutter={[16, 16]}>
        {[
          {
            title: "Active Members",
            value: activeCustomers,
            icon: <TeamOutlined />,
            color: token.colorPrimary,
            suffix: "customers",
          },
          {
            title: "Points Issued",
            value: totalPointsIssued.toLocaleString(),
            icon: <StarOutlined />,
            color: "#10B981",
            suffix: "pts total",
          },
          {
            title: "Points Redeemed",
            value: Math.max(0, totalPointsRedeemed).toLocaleString(),
            icon: <GiftOutlined />,
            color: "#F59E0B",
            suffix: "pts used",
          },
          {
            title: "Points Outstanding",
            value: totalPointsOutstanding.toLocaleString(),
            icon: <TrophyOutlined />,
            color: "#A855F7",
            suffix: "pts balance",
          },
        ].map(stat => (
          <Col xs={12} sm={12} md={6} key={stat.title}>
            <Card
              style={{
                border: `1px solid ${stat.color}30`,
                borderRadius: token.borderRadiusLG,
                background: `${stat.color}08`,
              }}
              styles={{ body: { padding: "16px 20px" } }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 12,
                      color: token.colorTextSecondary,
                      marginBottom: 6,
                    }}
                  >
                    {stat.title}
                  </div>
                  <div
                    style={{
                      fontSize: 22,
                      fontWeight: 800,
                      color: stat.color,
                      lineHeight: 1,
                    }}
                  >
                    {stat.value}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: token.colorTextTertiary,
                      marginTop: 4,
                    }}
                  >
                    {stat.suffix}
                  </div>
                </div>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: `${stat.color}18`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 16,
                    color: stat.color,
                  }}
                >
                  {stat.icon}
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Tier breakdown */}
      <Card
        style={{
          border: `1px solid ${token.colorBorderSecondary}`,
          borderRadius: token.borderRadiusLG,
        }}
        styles={{ body: { padding: "16px 20px" } }}
      >
        <div
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: token.colorText,
            marginBottom: 12,
          }}
        >
          Members by Tier
        </div>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          {LOYALTY_TIERS.map(tier => {
            const count = customers.filter(c => c.tierId === tier.id).length;
            const pct =
              customers.length > 0
                ? Math.round((count / customers.length) * 100)
                : 0;
            return (
              <div
                key={tier.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  flex: 1,
                  minWidth: 120,
                }}
              >
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: tier.color,
                    flexShrink: 0,
                    boxShadow: `0 0 6px ${tier.color}80`,
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 4,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: tier.color,
                      }}
                    >
                      {tier.name}
                    </span>
                    <span
                      style={{ fontSize: 12, color: token.colorTextSecondary }}
                    >
                      {count} ({pct}%)
                    </span>
                  </div>
                  <div
                    style={{
                      height: 4,
                      borderRadius: 2,
                      background: token.colorFillSecondary,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${pct}%`,
                        background: tier.color,
                        borderRadius: 2,
                        transition: "width 0.6s ease",
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Table with filters */}
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
            placeholder="Search customer or phone…"
            prefix={
              <SearchOutlined style={{ color: token.colorTextTertiary }} />
            }
            value={search}
            onChange={e => setSearch(e.target.value)}
            allowClear
            style={{ width: 260, borderRadius: 8 }}
          />
          <Select
            value={tierFilter}
            onChange={setTierFilter}
            style={{ width: 140, borderRadius: 8 }}
          >
            <Option value="all">All Tiers</Option>
            {LOYALTY_TIERS.map(t => (
              <Option key={t.id} value={t.id}>
                <span style={{ color: t.color, fontWeight: 600 }}>
                  {t.name}
                </span>
              </Option>
            ))}
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
            {filtered.length} of {customers.length} members
          </span>
        </div>
        <Table<Customer>
          dataSource={filtered}
          columns={columns}
          rowKey="id"
          loading={isLoading}
          pagination={{
            pageSize: 10,
            showSizeChanger: false,
            showTotal: (total, range) => (
              <span style={{ fontSize: 12, color: token.colorTextSecondary }}>
                {range[0]}–{range[1]} of {total} records
              </span>
            ),
          }}
          style={{ borderRadius: 0 }}
        />
      </Card>
    </div>
  );
}
