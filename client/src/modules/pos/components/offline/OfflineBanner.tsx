import { Alert } from "antd";
import { WifiOutlined, DisconnectOutlined } from "@ant-design/icons";
import { usePOSStore } from "../../store/posStore";
import { useAppSettings } from "@/contexts/AppSettingsContext";
import { usePOSTranslations } from "../../i18n/translations";

export function OfflineBanner() {
  const { language } = useAppSettings();
  const t = usePOSTranslations(language);
  const isOnline = usePOSStore(s => s.isOnline);
  const pendingCount = usePOSStore(s => s.pendingCount);
  const isSyncing = usePOSStore(s => s.isSyncing);

  if (isOnline && !isSyncing) return null;

  if (isOnline && isSyncing) {
    return (
      <Alert
        type="info"
        banner
        icon={<WifiOutlined />}
        message={t.syncingN(pendingCount)}
        style={{ borderRadius: 0, flexShrink: 0 }}
      />
    );
  }

  return (
    <Alert
      type="warning"
      banner
      icon={<DisconnectOutlined />}
      message={
        pendingCount > 0
          ? t.offlineWithPending(pendingCount)
          : t.offlineSavingLocally
      }
      style={{ borderRadius: 0, flexShrink: 0 }}
    />
  );
}
