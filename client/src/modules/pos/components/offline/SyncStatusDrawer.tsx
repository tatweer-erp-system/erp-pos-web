import { useEffect, useState } from "react";
import { Drawer, Tag, Button, Empty, Spin, theme as antTheme } from "antd";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  SyncOutlined,
  CloseCircleOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { usePOSStore } from "../../store/posStore";
import {
  getAllTransactions,
  type QueuedTransaction,
} from "../../services/syncService";
import { SyncErrorsModal } from "./SyncErrorsModal";
import { useAppSettings } from "@/contexts/AppSettingsContext";
import { usePOSTranslations } from "../../i18n/translations";

interface Props {
  open: boolean;
  onClose: () => void;
}

function statusTag(
  status: QueuedTransaction["status"],
  t: ReturnType<typeof usePOSTranslations>
) {
  const configs = {
    pending: {
      color: "#F59E0B",
      bg: "#FFFBEB",
      icon: <ClockCircleOutlined />,
      label: t.statusPending,
    },
    syncing: {
      color: "#0066CC",
      bg: "#EFF6FF",
      icon: <SyncOutlined spin />,
      label: t.statusSyncing,
    },
    synced: {
      color: "#10B981",
      bg: "#ECFDF5",
      icon: <CheckCircleOutlined />,
      label: t.statusSynced,
    },
    failed: {
      color: "#EF4444",
      bg: "#FEF2F2",
      icon: <CloseCircleOutlined />,
      label: t.statusFailed,
    },
  }[status];

  return (
    <Tag
      style={{
        background: configs.bg,
        color: configs.color,
        border: `1px solid ${configs.color}30`,
        borderRadius: 6,
        fontSize: 11,
        fontWeight: 600,
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
      }}
    >
      {configs.icon} {configs.label}
    </Tag>
  );
}

export function SyncStatusDrawer({ open, onClose }: Props) {
  const { token } = antTheme.useToken();
  const { language } = useAppSettings();
  const t = usePOSTranslations(language);
  const isRTL = language === "ar";
  const isOnline = usePOSStore(s => s.isOnline);
  const isSyncing = usePOSStore(s => s.isSyncing);
  const pendingCount = usePOSStore(s => s.pendingCount);
  const failedCount = usePOSStore(s => s.failedCount);
  const [items, setItems] = useState<QueuedTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [errModalOpen, setErrModalOpen] = useState(false);

  async function loadItems() {
    setLoading(true);
    try {
      const all = await getAllTransactions();
      setItems(all.sort((a, b) => b.timestamp.localeCompare(a.timestamp)));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (open) loadItems();
  }, [open, pendingCount, failedCount]);

  const dotColor = !isOnline
    ? "#EF4444"
    : isSyncing || pendingCount > 0
      ? "#F59E0B"
      : "#10B981";
  const statusText = !isOnline
    ? t.offline
    : isSyncing
      ? t.syncingN(pendingCount)
      : pendingCount === 0 && failedCount === 0
        ? t.allSynced
        : t.pendingAndFailed(pendingCount, failedCount);

  return (
    <>
      <Drawer
        open={open}
        onClose={onClose}
        title={null}
        placement={isRTL ? "left" : "right"}
        width={400}
        styles={{
          body: { padding: 0 },
          header: { display: "none" },
        }}
      >
        {/* Header */}
        <div
          style={{
            background: `linear-gradient(135deg, ${token.colorPrimary}, ${token.colorPrimary}cc)`,
            padding: "20px 20px 16px",
            color: "#fff",
            direction: isRTL ? "rtl" : "ltr",
          }}
        >
          <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 4 }}>
            {t.syncStatus}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 12,
              opacity: 0.85,
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: dotColor,
                boxShadow: `0 0 0 2px ${dotColor}50`,
                flexShrink: 0,
              }}
            />
            {statusText}
          </div>
          <button
            onClick={onClose}
            style={{
              position: "absolute",
              top: 14,
              right: 14,
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
          >
            ✕
          </button>
        </div>

        {/* Summary cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 8,
            padding: 12,
            background: token.colorBgLayout,
          }}
        >
          {[
            { label: t.statusPending, count: pendingCount, color: "#F59E0B" },
            { label: t.statusFailed, count: failedCount, color: "#EF4444" },
            {
              label: t.online,
              count: isOnline ? 1 : 0,
              color: isOnline ? "#10B981" : "#EF4444",
              isStatus: true,
            },
          ].map(({ label, count, color, isStatus }) => (
            <div
              key={label}
              style={{
                background: token.colorBgContainer,
                border: `1px solid ${token.colorBorderSecondary}`,
                borderRadius: 10,
                padding: "10px 12px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 18, fontWeight: 900, color }}>
                {isStatus ? (count ? "●" : "●") : count}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: token.colorTextSecondary,
                  marginTop: 2,
                }}
              >
                {label}
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        {failedCount > 0 && (
          <div style={{ padding: "0 12px 8px" }}>
            <Button
              danger
              icon={<CloseCircleOutlined />}
              onClick={() => setErrModalOpen(true)}
              block
              style={{ borderRadius: 8 }}
            >
              {t.viewSyncErrors(failedCount)}
            </Button>
          </div>
        )}

        {/* Transaction list */}
        <div style={{ padding: "8px 12px 12px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <div
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: token.colorTextSecondary,
              }}
            >
              {t.queue.toUpperCase()}
            </div>
            <Button
              size="small"
              icon={<ReloadOutlined />}
              onClick={loadItems}
              type="text"
            />
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: 32 }}>
              <Spin />
            </div>
          ) : items.length === 0 ? (
            <Empty
              description={t.noTransactionsInQueue}
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {items.map(item => (
                <div
                  key={item.id}
                  style={{
                    background: token.colorBgContainer,
                    border: `1px solid ${token.colorBorderSecondary}`,
                    borderRadius: 8,
                    padding: "10px 12px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 4,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: token.colorText,
                      }}
                    >
                      {item.localOrderNumber}
                    </span>
                    {statusTag(item.status, t)}
                  </div>
                  <div
                    style={{ fontSize: 11, color: token.colorTextSecondary }}
                  >
                    {item.cashierName} ·{" "}
                    {new Date(item.timestamp).toLocaleString()}
                  </div>
                  {item.errorMessage && (
                    <div
                      style={{ fontSize: 11, color: "#EF4444", marginTop: 4 }}
                    >
                      {item.errorMessage}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </Drawer>

      <SyncErrorsModal
        open={errModalOpen}
        onClose={() => {
          setErrModalOpen(false);
          loadItems();
        }}
      />
    </>
  );
}
