import { useState, useRef, useEffect, useCallback } from "react";
import { Input, Spin, Button, Modal, Form, message, theme as antTheme, Tooltip } from "antd";
import {
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { searchCustomers, createCustomer } from "../../services/customerService";
import { usePOSStore } from "../../store/posStore";
import type { Customer } from "../../data/mockCustomers";
import { getTier } from "../../data/mockCustomers";
import { useAppSettings } from "@/contexts/AppSettingsContext";
import { usePOSTranslations } from "../../i18n/translations";

interface CustomerSearchProps {
  isMobile: boolean;
}

export function CustomerSearch({ isMobile }: CustomerSearchProps) {
  const { token } = antTheme.useToken();
  const { language } = useAppSettings();
  const t = usePOSTranslations(language);
  const setAttachedCustomer = usePOSStore((s) => s.setAttachedCustomer);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Customer[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [addForm] = Form.useForm();

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const doSearch = useCallback(async (q: string) => {
    if (!q.trim()) { setResults([]); setShowDropdown(false); return; }
    setIsSearching(true);
    try {
      const found = await searchCustomers(q);
      setResults(found);
      setShowDropdown(true);
    } finally {
      setIsSearching(false);
    }
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const q = e.target.value;
    setQuery(q);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doSearch(q), 300);
  }

  function handleSelect(customer: Customer) {
    setAttachedCustomer(customer);
    setQuery("");
    setResults([]);
    setShowDropdown(false);
    message.success(t.customerAttached(customer.name));
  }

  async function handleQuickAdd() {
    setAddLoading(true);
    try {
      const values = await addForm.validateFields();
      const newCustomer = await createCustomer(values);
      setAttachedCustomer(newCustomer);
      setAddModalOpen(false);
      addForm.resetFields();
      message.success(t.customerAttached(newCustomer.name));
    } catch {
      // validation errors shown inline
    } finally {
      setAddLoading(false);
    }
  }

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <>
      <div ref={containerRef} style={{ position: "relative" }}>
        <Input
          placeholder={t.searchCustomerPlaceholder}
          prefix={
            isSearching
              ? <Spin size="small" />
              : <UserOutlined style={{ color: token.colorTextPlaceholder }} />
          }
          suffix={
            <Tooltip title={t.quickAddCustomer}>
              <Button
                type="text"
                size="small"
                icon={<PlusOutlined />}
                onClick={() => setAddModalOpen(true)}
                style={{ height: 24, width: 24, padding: 0 }}
              />
            </Tooltip>
          }
          value={query}
          onChange={handleChange}
          onFocus={() => query && setShowDropdown(true)}
          style={{ borderRadius: 10, height: 40 }}
          allowClear
          onClear={() => { setQuery(""); setResults([]); setShowDropdown(false); }}
        />

        {/* Results dropdown */}
        {showDropdown && (
          <div style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            right: 0,
            zIndex: 1000,
            background: token.colorBgContainer,
            border: `1px solid ${token.colorBorderSecondary}`,
            borderRadius: 10,
            boxShadow: `0 8px 24px rgba(0,0,0,0.12)`,
            overflow: "hidden",
            maxHeight: 280,
            overflowY: "auto",
          }}>
            {results.length === 0 ? (
              <div style={{ padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                <span style={{ fontSize: 12, color: token.colorTextSecondary }}>
                  {t.noCustomerFound}
                </span>
                <Button
                  size="small"
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => { setShowDropdown(false); setAddModalOpen(true); addForm.setFieldValue("phone", query); }}
                  style={{ borderRadius: 8, fontSize: 11 }}
                >
                  {t.quickAddCustomer}
                </Button>
              </div>
            ) : (
              results.map((c) => {
                const tier = getTier(c.loyaltyPoints);
                return (
                  <div
                    key={c.id}
                    onClick={() => handleSelect(c)}
                    style={{
                      padding: "10px 14px",
                      cursor: "pointer",
                      borderBottom: `1px solid ${token.colorBorderSecondary}`,
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      transition: "background 0.12s",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = token.colorFillAlter; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                  >
                    {/* Avatar */}
                    <div style={{
                      width: 34,
                      height: 34,
                      borderRadius: "50%",
                      background: `linear-gradient(135deg, ${tier.color}44, ${tier.color}88)`,
                      border: `2px solid ${tier.color}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 13,
                      fontWeight: 800,
                      color: token.colorText,
                      flexShrink: 0,
                    }}>
                      {c.name.charAt(0).toUpperCase()}
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: token.colorText, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {c.name}
                      </div>
                      <div style={{ fontSize: 11, color: token.colorTextSecondary, display: "flex", alignItems: "center", gap: 6, marginTop: 1 }}>
                        <PhoneOutlined style={{ fontSize: 9 }} />{c.phone}
                      </div>
                    </div>

                    {/* Tier + points */}
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div style={{
                        fontSize: 10, fontWeight: 700,
                        color: tier.color,
                        background: `${tier.color}18`,
                        border: `1px solid ${tier.color}40`,
                        borderRadius: 6,
                        padding: "1px 6px",
                        display: "inline-block",
                        letterSpacing: "0.04em",
                        textTransform: "uppercase",
                      }}>
                        {tier.name}
                      </div>
                      <div style={{ fontSize: 11, color: token.colorTextSecondary, marginTop: 2 }}>
                        {c.loyaltyPoints.toLocaleString()} pts
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Quick Add Customer Modal */}
      <Modal
        open={addModalOpen}
        onCancel={() => { setAddModalOpen(false); addForm.resetFields(); }}
        title={
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 28, height: 28, borderRadius: 8,
              background: `linear-gradient(135deg, ${token.colorPrimary}, ${token.colorPrimary}cc)`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <UserOutlined style={{ color: "#fff", fontSize: 13 }} />
            </div>
            <span style={{ fontSize: 14, fontWeight: 700 }}>{t.quickAddCustomer}</span>
          </div>
        }
        width={isMobile ? "95vw" : 420}
        centered
        footer={
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <Button onClick={() => { setAddModalOpen(false); addForm.resetFields(); }} style={{ borderRadius: 8 }}>
              {t.cancel}
            </Button>
            <Button
              type="primary"
              loading={addLoading}
              onClick={handleQuickAdd}
              style={{ borderRadius: 8, background: `linear-gradient(135deg, ${token.colorPrimary}, ${token.colorPrimaryHover})`, border: "none" }}
            >
              {t.addAndAttach}
            </Button>
          </div>
        }
      >
        <Form form={addForm} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item
            name="name"
            label={t.searchCustomer}
            rules={[{ required: true, message: "Name is required" }]}
          >
            <Input
              prefix={<UserOutlined style={{ color: token.colorTextPlaceholder }} />}
              placeholder="Customer full name"
              style={{ borderRadius: 8 }}
            />
          </Form.Item>
          <Form.Item
            name="phone"
            label={t.phone}
            rules={[{ required: true, message: "Phone is required" }]}
          >
            <Input
              prefix={<PhoneOutlined style={{ color: token.colorTextPlaceholder }} />}
              placeholder="+1-555-0000"
              style={{ borderRadius: 8 }}
            />
          </Form.Item>
          <Form.Item name="email" label={t.email} style={{ marginBottom: 0 }}>
            <Input
              prefix={<MailOutlined style={{ color: token.colorTextPlaceholder }} />}
              placeholder="customer@email.com"
              style={{ borderRadius: 8 }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
