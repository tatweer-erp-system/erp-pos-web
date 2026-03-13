import { useState } from "react";
import {
  InputNumber,
  Switch,
  Select,
  Button,
  theme as antTheme,
  message,
} from "antd";
import {
  WifiOutlined,
  ReloadOutlined,
  CheckCircleOutlined,
  DisconnectOutlined,
} from "@ant-design/icons";
import { usePOSStore } from "../../store/posStore";
import { cacheProducts } from "../../services/offlineService";
import { getProducts } from "../../services/posService";

export function OfflineSettingsTab({ onDirty }: { onDirty?: () => void } = {}) {
  const { token } = antTheme.useToken();
  const isOnline = usePOSStore(s => s.isOnline);
  const offlineModeEnabled = usePOSStore(s => s.offlineModeEnabled);
  const setOfflineModeEnabled = usePOSStore(s => s.setOfflineModeEnabled);
  const cacheRefreshInterval = usePOSStore(s => s.cacheRefreshInterval);
  const setCacheRefreshInterval = usePOSStore(s => s.setCacheRefreshInterval);
  const lastCacheSync = usePOSStore(s => s.lastCacheSync);
  const setLastCacheSync = usePOSStore(s => s.setLastCacheSync);
  const [refreshing, setRefreshing] = useState(false);
  const [maxQueueSize, setMaxQueueSize] = useState(500);

  async function handleRefreshCache() {
    if (!isOnline) {
      message.warning("Cannot refresh cache while offline");
      return;
    }
    setRefreshing(true);
    try {
      const products = await getProducts();
      await cacheProducts(products);
      const now = new Date().toISOString();
      setLastCacheSync(now);
      message.success(
        `Product cache refreshed — ${products.length} products cached`
      );
    } catch {
      message.error("Failed to refresh cache");
    } finally {
      setRefreshing(false);
    }
  }

  const settingRow = (
    label: string,
    sublabel: string,
    control: React.ReactNode
  ) => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "14px 16px",
        background: token.colorBgContainer,
        border: `1px solid ${token.colorBorderSecondary}`,
        borderRadius: 10,
      }}
    >
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: token.colorText }}>
          {label}
        </div>
        <div
          style={{
            fontSize: 12,
            color: token.colorTextSecondary,
            marginTop: 2,
          }}
        >
          {sublabel}
        </div>
      </div>
      {control}
    </div>
  );

  return (
    <div style={{ maxWidth: 560, padding: "4px 0" }}>
      {/* Status banner */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "12px 16px",
          background: isOnline ? "#ECFDF5" : "#FEF2F2",
          border: `1px solid ${isOnline ? "#10B98130" : "#FECACA"}`,
          borderRadius: 10,
          marginBottom: 16,
          fontSize: 13,
          color: isOnline ? "#10B981" : "#EF4444",
          fontWeight: 600,
        }}
      >
        {isOnline ? <WifiOutlined /> : <DisconnectOutlined />}
        {isOnline ? "Connected — online" : "Disconnected — offline"}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {settingRow(
          "Enable Offline Mode",
          "Save transactions locally when disconnected and sync when online",
          <Switch
            checked={offlineModeEnabled}
            onChange={v => {
              setOfflineModeEnabled(v);
              onDirty?.();
            }}
            checkedChildren="ON"
            unCheckedChildren="OFF"
          />
        )}

        {offlineModeEnabled && (
          <>
            {settingRow(
              "Product Cache Refresh Interval",
              "How often to update the local product database",
              <Select
                value={cacheRefreshInterval}
                onChange={v => {
                  setCacheRefreshInterval(v);
                  onDirty?.();
                }}
                style={{ width: 140 }}
                options={[
                  { value: 15, label: "Every 15 min" },
                  { value: 30, label: "Every 30 min" },
                  { value: 60, label: "Every 60 min" },
                  { value: 0, label: "Manual only" },
                ]}
              />
            )}

            {settingRow(
              "Max Offline Queue Size",
              "Maximum number of transactions held locally before sync is required",
              <InputNumber
                min={50}
                max={5000}
                step={50}
                value={maxQueueSize}
                onChange={v => {
                  setMaxQueueSize(v ?? 500);
                  onDirty?.();
                }}
                addonAfter="transactions"
                style={{ width: 200 }}
              />
            )}

            <div
              style={{
                padding: "14px 16px",
                background: token.colorBgContainer,
                border: `1px solid ${token.colorBorderSecondary}`,
                borderRadius: 10,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 8,
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: token.colorText,
                    }}
                  >
                    Product Cache
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: token.colorTextSecondary,
                      marginTop: 2,
                    }}
                  >
                    {lastCacheSync ? (
                      <>
                        Last updated:{" "}
                        <strong>
                          {new Date(lastCacheSync).toLocaleString()}
                        </strong>
                      </>
                    ) : (
                      "Cache not yet populated"
                    )}
                  </div>
                </div>
                <Button
                  icon={<ReloadOutlined />}
                  onClick={handleRefreshCache}
                  loading={refreshing}
                  disabled={!isOnline}
                  style={{ borderRadius: 8 }}
                >
                  Refresh Now
                </Button>
              </div>
              {lastCacheSync && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: 12,
                    color: "#10B981",
                  }}
                >
                  <CheckCircleOutlined />
                  Cache is ready — products available offline
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
