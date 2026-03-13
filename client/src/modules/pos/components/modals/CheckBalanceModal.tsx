import { useState } from "react";
import {
  Modal,
  Input,
  Button,
  Divider,
  Tag,
  theme as antTheme,
  message,
} from "antd";
import {
  GiftOutlined,
  BarcodeOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import {
  checkGiftCardBalance,
  type GiftCard,
} from "../../services/giftCardService";
import { useAppSettings } from "@/contexts/AppSettingsContext";
import { usePOSTranslations } from "../../i18n/translations";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function CheckBalanceModal({ open, onClose }: Props) {
  const { token } = antTheme.useToken();
  const { language } = useAppSettings();
  const t = usePOSTranslations(language);
  const isRTL = language === "ar";
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GiftCard | null>(null);
  const [notFound, setNotFound] = useState(false);

  async function handleCheck() {
    if (!code.trim()) return;
    setLoading(true);
    setResult(null);
    setNotFound(false);
    try {
      const res = await checkGiftCardBalance(code.trim());
      if (res.found && res.giftCard) {
        setResult(res.giftCard);
      } else {
        setNotFound(true);
      }
    } catch {
      message.error("Failed to check balance");
    } finally {
      setLoading(false);
    }
  }

  function handleClose() {
    setCode("");
    setResult(null);
    setNotFound(false);
    onClose();
  }

  const usedAmount = result ? result.issuedAmount - result.remainingBalance : 0;
  const pct =
    result && result.issuedAmount > 0
      ? (result.remainingBalance / result.issuedAmount) * 100
      : 0;

  function statusColor(s: GiftCard["status"]) {
    if (s === "active") return "#10B981";
    if (s === "expired") return "#EF4444";
    return token.colorTextSecondary;
  }

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      closeIcon={null}
      footer={null}
      width="min(380px, 95vw)"
      centered
      title={null}
      styles={{ body: { padding: 0 } }}
    >
      {/* Header */}
      <div
        style={{
          position: "relative",
          background: `linear-gradient(135deg, ${token.colorPrimary}, ${token.colorPrimary}cc)`,
          padding: "20px 24px 16px",
          textAlign: "center",
          color: "#fff",
          borderRadius: "8px 8px 0 0",
          direction: isRTL ? "rtl" : "ltr",
        }}
      >
        <GiftOutlined style={{ fontSize: 28, marginBottom: 8 }} />
        <div style={{ fontSize: 16, fontWeight: 800 }}>
          {t.checkGiftCardBalance}
        </div>
        <div style={{ fontSize: 12, opacity: 0.8, marginTop: 2 }}>
          {t.enterCodeToCheck}
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
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.background =
              "rgba(255,255,255,0.35)";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.background =
              "rgba(255,255,255,0.2)";
          }}
        >
          ✕
        </button>
      </div>

      <div dir={isRTL ? "rtl" : "ltr"} style={{ padding: "20px 24px 24px" }}>
        {/* Search input */}
        <div style={{ marginBottom: 16 }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: token.colorTextSecondary,
              marginBottom: 8,
              letterSpacing: "0.03em",
            }}
          >
            {t.giftCardCode}
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <Input
              value={code}
              onChange={e => {
                setCode(e.target.value.toUpperCase());
                setResult(null);
                setNotFound(false);
              }}
              onPressEnter={handleCheck}
              placeholder="EX: GC-2025-001"
              prefix={
                <BarcodeOutlined
                  style={{ color: token.colorTextTertiary, fontSize: 15 }}
                />
              }
              size="large"
              style={{ flex: 1, borderRadius: 8 }}
              status={notFound ? "error" : undefined}
            />
            <Button
              type="primary"
              size="large"
              icon={loading ? <LoadingOutlined /> : <BarcodeOutlined />}
              onClick={handleCheck}
              loading={loading}
              disabled={!code.trim()}
              style={{ borderRadius: 8, fontWeight: 600, flexShrink: 0 }}
            >
              {t.check}
            </Button>
          </div>
        </div>

        {/* Not found */}
        {notFound && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "12px 16px",
              background: "#EF444410",
              border: "1px solid #EF444430",
              borderRadius: 10,
              color: "#EF4444",
              fontSize: 13,
              marginBottom: 12,
            }}
          >
            <CloseCircleOutlined />
            {t.cardNotFound}
          </div>
        )}

        {/* Result */}
        {result && (
          <>
            <div
              style={{
                background:
                  result.status === "active"
                    ? "#10B98108"
                    : token.colorFillAlter,
                border: `1px solid ${result.status === "active" ? "#10B98130" : token.colorBorderSecondary}`,
                borderRadius: 12,
                padding: "16px 20px",
              }}
            >
              {/* Code + status */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: 12,
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 11,
                      color: token.colorTextSecondary,
                      marginBottom: 2,
                    }}
                  >
                    GIFT CARD
                  </div>
                  <div
                    style={{
                      fontSize: 15,
                      fontWeight: 800,
                      letterSpacing: "0.05em",
                      color: token.colorText,
                    }}
                  >
                    {result.code}
                  </div>
                </div>
                <Tag
                  style={{
                    background: `${statusColor(result.status)}20`,
                    color: statusColor(result.status),
                    border: "none",
                    fontWeight: 700,
                    fontSize: 11,
                    borderRadius: 6,
                  }}
                >
                  {result.status.charAt(0).toUpperCase() +
                    result.status.slice(1)}
                </Tag>
              </div>

              {/* Balance bar */}
              <div style={{ marginBottom: 12 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 6,
                  }}
                >
                  <span
                    style={{ fontSize: 12, color: token.colorTextSecondary }}
                  >
                    {t.balance}
                  </span>
                  <span
                    style={{ fontSize: 12, color: token.colorTextSecondary }}
                  >
                    ${result.remainingBalance.toFixed(2)} / $
                    {result.issuedAmount.toFixed(2)}
                  </span>
                </div>
                <div
                  style={{
                    height: 8,
                    borderRadius: 4,
                    background: token.colorFillSecondary,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${pct}%`,
                      borderRadius: 4,
                      background:
                        result.status === "active"
                          ? `linear-gradient(90deg, #10B981, #34D399)`
                          : token.colorTextTertiary,
                      transition: "width 0.5s ease",
                    }}
                  />
                </div>
              </div>

              {/* Amount display */}
              <div style={{ textAlign: "center", margin: "8px 0 12px" }}>
                <div
                  style={{
                    fontSize: 32,
                    fontWeight: 900,
                    color:
                      result.status === "active"
                        ? "#10B981"
                        : token.colorTextSecondary,
                  }}
                >
                  ${result.remainingBalance.toFixed(2)}
                </div>
                <div style={{ fontSize: 12, color: token.colorTextSecondary }}>
                  available · ${usedAmount.toFixed(2)} used
                </div>
              </div>

              <Divider style={{ margin: "8px 0" }} />

              {/* Details */}
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {result.issuedTo && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: 12,
                    }}
                  >
                    <span style={{ color: token.colorTextSecondary }}>
                      {t.issuedTo}
                    </span>
                    <span style={{ color: token.colorText, fontWeight: 500 }}>
                      {result.issuedTo}
                    </span>
                  </div>
                )}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 12,
                  }}
                >
                  <span style={{ color: token.colorTextSecondary }}>
                    Issue date
                  </span>
                  <span style={{ color: token.colorText }}>
                    {result.issuedDate}
                  </span>
                </div>
                {result.expiryDate && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: 12,
                    }}
                  >
                    <span style={{ color: token.colorTextSecondary }}>
                      {t.expires}
                    </span>
                    <span
                      style={{
                        color:
                          result.status === "expired"
                            ? "#EF4444"
                            : token.colorText,
                        fontWeight: result.status === "expired" ? 600 : 400,
                      }}
                    >
                      {result.expiryDate}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {result.status === "active" && (
              <div
                style={{
                  marginTop: 10,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 12,
                  color: "#10B981",
                }}
              >
                <CheckCircleOutlined />
                {t.validCard}
              </div>
            )}
          </>
        )}

        <Divider style={{ margin: "16px 0 12px" }} />
        <Button block onClick={handleClose} style={{ borderRadius: 8 }}>
          {t.close}
        </Button>
      </div>
    </Modal>
  );
}
