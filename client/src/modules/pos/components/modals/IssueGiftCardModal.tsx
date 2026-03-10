import { useState } from "react";
import {
  Modal,
  Form,
  InputNumber,
  DatePicker,
  Button,
  Divider,
  Tag,
  message,
  theme as antTheme,
  Grid,
} from "antd";

const { useBreakpoint } = Grid;
import {
  GiftOutlined,
  PrinterOutlined,
  CopyOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { CustomerSearch } from "../cart/CustomerSearch";
import { issueGiftCard, mockDenominations, type GiftCard } from "../../services/giftCardService";
import { usePOSStore } from "../../store/posStore";
import { useAppSettings } from "@/contexts/AppSettingsContext";
import { usePOSTranslations } from "../../i18n/translations";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function IssueGiftCardModal({ open, onClose }: Props) {
  const { token } = antTheme.useToken();
  const screens = useBreakpoint();
  const isMobile = !screens.sm;
  const { language } = useAppSettings();
  const t = usePOSTranslations(language);
  const isRTL = language === "ar";
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [issuedCard, setIssuedCard] = useState<GiftCard | null>(null);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const attachedCustomer = usePOSStore((s) => s.attachedCustomer);

  const activeDenominations = mockDenominations.filter((d) => d.status === "active");

  async function handleIssue() {
    const values = await form.validateFields();
    setLoading(true);
    try {
      const card = await issueGiftCard({
        amount: values.amount,
        issuedTo: attachedCustomer?.name ?? values.recipientName,
        expiryDate: values.expiryDate
          ? (values.expiryDate as { format: (f: string) => string }).format("YYYY-MM-DD")
          : undefined,
      });
      setIssuedCard(card);
      message.success(`Gift card ${card.code} issued for $${card.issuedAmount.toFixed(2)}`);
    } catch {
      message.error("Failed to issue gift card");
    } finally {
      setLoading(false);
    }
  }

  function handleClose() {
    setIssuedCard(null);
    setSelectedAmount(null);
    form.resetFields();
    onClose();
  }

  function copyCode() {
    if (issuedCard) {
      navigator.clipboard.writeText(issuedCard.code);
      message.success("Code copied!");
    }
  }

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      closeIcon={null}
      footer={null}
      width="min(420px, 95vw)"
      centered
      title={null}
      styles={{ body: { padding: 0 } }}
    >
      {/* Header */}
      <div style={{
        position: "relative",
        background: `linear-gradient(135deg, #A855F7, #A855F7cc)`,
        padding: isMobile ? "16px 16px 14px" : "20px 24px 16px",
        textAlign: "center",
        color: "#fff",
        borderRadius: "8px 8px 0 0",
        direction: isRTL ? "rtl" : "ltr",
      }}>
        <GiftOutlined style={{ fontSize: 28, marginBottom: 8 }} />
        <div style={{ fontSize: 16, fontWeight: 800 }}>{t.issueGiftCard}</div>
        <div style={{ fontSize: 12, opacity: 0.8, marginTop: 2 }}>
          {t.newGiftCard}
        </div>
        <button
          onClick={handleClose}
          style={{
            position: "absolute",
            top: 14,
            insetInlineEnd: 14,
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.2)",
            border: "1px solid rgba(255,255,255,0.3)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontSize: 13,
            lineHeight: 1,
            transition: "background 0.15s",
            padding: 0,
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.35)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.2)"; }}
        >
          ✕
        </button>
      </div>

      <div dir={isRTL ? "rtl" : "ltr"} style={{ padding: isMobile ? "16px 16px 20px" : "20px 24px 24px" }}>
        {issuedCard ? (
          /* ── Success view ── */
          <div style={{ textAlign: "center" }}>
            <CheckCircleOutlined style={{ fontSize: 40, color: "#10B981", marginBottom: 12 }} />
            <div style={{ fontSize: 15, fontWeight: 700, color: token.colorText, marginBottom: 4 }}>
              {t.giftCardIssued}
            </div>
            <div style={{ fontSize: 13, color: token.colorTextSecondary, marginBottom: 20 }}>
              {t.generatedCode}
            </div>

            {/* Code box */}
            <div style={{
              background: "#A855F710",
              border: "2px dashed #A855F750",
              borderRadius: 12,
              padding: "16px 20px",
              marginBottom: 16,
            }}>
              <div style={{ fontSize: 11, color: token.colorTextSecondary, marginBottom: 6 }}>GIFT CARD CODE</div>
              <div style={{ fontSize: isMobile ? 16 : 20, fontWeight: 900, letterSpacing: isMobile ? "0.05em" : "0.1em", color: "#A855F7", marginBottom: 8, wordBreak: "break-all" }}>
                {issuedCard.code}
              </div>
              <div style={{ fontSize: 22, fontWeight: 800, color: token.colorText }}>
                ${issuedCard.issuedAmount.toFixed(2)}
              </div>
              {issuedCard.issuedTo && (
                <div style={{ fontSize: 12, color: token.colorTextSecondary, marginTop: 4 }}>
                  {t.issuedTo}: {issuedCard.issuedTo}
                </div>
              )}
              {issuedCard.expiryDate && (
                <div style={{ fontSize: 11, color: token.colorTextTertiary, marginTop: 2 }}>
                  {t.expires}: {issuedCard.expiryDate}
                </div>
              )}
            </div>

            <div style={{ display: "flex", gap: 8, flexWrap: isMobile ? "wrap" : "nowrap" }}>
              <Button
                icon={<CopyOutlined />}
                onClick={copyCode}
                style={{ flex: 1, minWidth: 80, borderRadius: 8 }}
              >
                Copy Code
              </Button>
              <Button
                icon={<PrinterOutlined />}
                onClick={() => window.print()}
                style={{ flex: 1, minWidth: 80, borderRadius: 8 }}
              >
                Print
              </Button>
              <Button
                type="primary"
                onClick={handleClose}
                style={{
                  flex: isMobile ? "1 1 100%" : 1, minWidth: 80, borderRadius: 8,
                  background: "#A855F7", borderColor: "#A855F7",
                }}
              >
                {t.done}
              </Button>
            </div>
          </div>
        ) : (
          /* ── Issue form ── */
          <Form form={form} layout="vertical">
            {/* Quick denominations */}
            <Form.Item label="Quick Amount" style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {activeDenominations.map((d) => (
                  <Tag
                    key={d.id}
                    style={{
                      cursor: "pointer",
                      padding: "4px 12px",
                      borderRadius: 8,
                      fontSize: 13,
                      fontWeight: 600,
                      background: selectedAmount === d.amount ? "#A855F7" : token.colorFillAlter,
                      color: selectedAmount === d.amount ? "#fff" : token.colorText,
                      border: selectedAmount === d.amount ? "1px solid #A855F7" : `1px solid ${token.colorBorderSecondary}`,
                      transition: "all 0.15s",
                    }}
                    onClick={() => {
                      setSelectedAmount(d.amount);
                      form.setFieldValue("amount", d.amount);
                    }}
                  >
                    ${d.amount}
                  </Tag>
                ))}
              </div>
            </Form.Item>

            <Form.Item
              name="amount"
              label={t.amount}
              rules={[{ required: true, message: t.amountRequired }, { type: "number", min: 1 }]}
            >
              <InputNumber
                min={1}
                precision={2}
                prefix="$"
                style={{ width: "100%", borderRadius: 8 }}
                placeholder="Enter amount"
                onChange={(v) => setSelectedAmount(v)}
              />
            </Form.Item>

            {!attachedCustomer && (
              <Form.Item label="Recipient (optional)">
                <CustomerSearch isMobile={isMobile} />
              </Form.Item>
            )}

            {attachedCustomer && (
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 12px",
                background: token.colorFillAlter,
                borderRadius: 8,
                marginBottom: 16,
                fontSize: 12,
                color: token.colorTextSecondary,
              }}>
                <CheckCircleOutlined style={{ color: "#10B981" }} />
                Issuing to: <strong style={{ color: token.colorText }}>{attachedCustomer.name}</strong>
              </div>
            )}

            <Form.Item name="expiryDate" label="Expiry Date (optional)" style={{ marginBottom: 20 }}>
              <DatePicker style={{ width: "100%", borderRadius: 8 }} />
            </Form.Item>

            <Divider style={{ margin: "0 0 16px" }} />

            <div style={{ display: "flex", gap: 8 }}>
              <Button onClick={handleClose} style={{ flex: 1, borderRadius: 8 }}>
                {t.cancel}
              </Button>
              <Button
                type="primary"
                loading={loading}
                onClick={handleIssue}
                style={{
                  flex: 2, borderRadius: 8, fontWeight: 700,
                  background: "#A855F7", borderColor: "#A855F7",
                }}
                icon={<GiftOutlined />}
              >
                {t.issueCard}
              </Button>
            </div>
          </Form>
        )}
      </div>
    </Modal>
  );
}
