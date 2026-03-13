import { useState, useEffect } from "react";
import { Modal, Button, Empty, theme as antTheme, message } from "antd";
import { CloseCircleOutlined, ReloadOutlined } from "@ant-design/icons";
import { usePOSStore } from "../../store/posStore";
import {
  getAllTransactions,
  retryAllFailed,
  type QueuedTransaction,
} from "../../services/syncService";
import { getPendingCount, getFailedCount } from "../../services/syncService";
import { useAppSettings } from "@/contexts/AppSettingsContext";
import { usePOSTranslations } from "../../i18n/translations";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function SyncErrorsModal({ open, onClose }: Props) {
  const { token } = antTheme.useToken();
  const { language } = useAppSettings();
  const t = usePOSTranslations(language);
  const isRTL = language === "ar";
  const setIsSyncing = usePOSStore(s => s.setIsSyncing);
  const setPendingCount = usePOSStore(s => s.setPendingCount);
  const setFailedCount = usePOSStore(s => s.setFailedCount);
  const [items, setItems] = useState<QueuedTransaction[]>([]);
  const [retrying, setRetrying] = useState(false);

  async function load() {
    const all = await getAllTransactions();
    setItems(all.filter(t => t.status === "failed"));
  }

  useEffect(() => {
    if (open) load();
  }, [open]);

  async function handleRetry() {
    setRetrying(true);
    try {
      await retryAllFailed();
      message.success(t.failedMarkedForRetry);
      const [pending, failed] = await Promise.all([
        getPendingCount(),
        getFailedCount(),
      ]);
      setPendingCount(pending);
      setFailedCount(failed);
      onClose();
    } catch {
      message.error(t.failedToReset);
    } finally {
      setRetrying(false);
    }
  }

  return (
    <Modal
      open={open}
      onCancel={onClose}
      closeIcon={null}
      footer={null}
      width={420}
      centered
      title={null}
      style={{ padding: 0 }}
    >
      {/* Header */}
      <div
        style={{
          position: "relative",
          background: "linear-gradient(135deg, #EF4444, #DC2626)",
          padding: "20px 24px 16px",
          textAlign: "center",
          color: "#fff",
          borderRadius: "8px 8px 0 0",
          direction: isRTL ? "rtl" : "ltr",
        }}
      >
        <CloseCircleOutlined style={{ fontSize: 28, marginBottom: 8 }} />
        <div style={{ fontSize: 16, fontWeight: 800 }}>{t.syncErrors}</div>
        <div style={{ fontSize: 12, opacity: 0.8, marginTop: 2 }}>
          {t.transactionsFailedToSync(items.length)}
        </div>
        <button
          onClick={onClose}
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

      <div style={{ padding: "20px 24px 24px" }}>
        {items.length === 0 ? (
          <Empty
            description={t.noFailedTransactions}
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              marginBottom: 16,
            }}
          >
            {items.map(item => (
              <div
                key={item.id}
                style={{
                  background: "#FEF2F2",
                  border: "1px solid #FECACA",
                  borderRadius: 10,
                  padding: "12px 14px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: token.colorText,
                    }}
                  >
                    {item.localOrderNumber}
                  </span>
                  <span
                    style={{ fontSize: 11, color: token.colorTextSecondary }}
                  >
                    {t.attempts(item.retries)}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: token.colorTextSecondary,
                    marginTop: 2,
                  }}
                >
                  {item.cashierName} ·{" "}
                  {new Date(item.timestamp).toLocaleString()}
                </div>
                {item.errorMessage && (
                  <div
                    style={{
                      fontSize: 11,
                      color: "#EF4444",
                      marginTop: 4,
                      fontStyle: "italic",
                    }}
                  >
                    {item.errorMessage}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <Button
          type="primary"
          icon={<ReloadOutlined />}
          onClick={handleRetry}
          loading={retrying}
          disabled={items.length === 0}
          block
          style={{ borderRadius: 8, marginBottom: 8 }}
        >
          {t.retryAllFailed}
        </Button>
        <Button block onClick={onClose} style={{ borderRadius: 8 }}>
          {t.close}
        </Button>
      </div>
    </Modal>
  );
}
