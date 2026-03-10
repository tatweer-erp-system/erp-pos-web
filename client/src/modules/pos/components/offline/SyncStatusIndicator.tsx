import { useState } from "react";
import { Tooltip, theme as antTheme } from "antd";
import { usePOSStore } from "../../store/posStore";
import { SyncStatusDrawer } from "./SyncStatusDrawer";
import { useAppSettings } from "@/contexts/AppSettingsContext";
import { usePOSTranslations } from "../../i18n/translations";

export function SyncStatusIndicator() {
  const { token } = antTheme.useToken();
  const { language } = useAppSettings();
  const t = usePOSTranslations(language);
  const isOnline     = usePOSStore((s) => s.isOnline);
  const isSyncing    = usePOSStore((s) => s.isSyncing);
  const pendingCount = usePOSStore((s) => s.pendingCount);
  const failedCount  = usePOSStore((s) => s.failedCount);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const dotColor = !isOnline
    ? "#EF4444"
    : isSyncing || pendingCount > 0
    ? "#F59E0B"
    : failedCount > 0
    ? "#EF4444"
    : "#10B981";

  const label = !isOnline
    ? pendingCount > 0 ? `${t.offline} (${pendingCount})` : t.offline
    : isSyncing
    ? t.syncingN(pendingCount)
    : failedCount > 0
    ? t.viewSyncErrors(failedCount)
    : pendingCount > 0
    ? t.syncingN(pendingCount)
    : t.allSynced;

  return (
    <>
      <Tooltip title={t.syncStatus}>
        <button
          onClick={() => setDrawerOpen(true)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: "transparent",
            border: `1px solid ${token.colorBorderSecondary}`,
            borderRadius: 8,
            padding: "4px 10px",
            cursor: "pointer",
            fontSize: 11,
            color: token.colorTextSecondary,
            height: 28,
            flexShrink: 0,
          }}
        >
          <span style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: dotColor,
            flexShrink: 0,
            boxShadow: `0 0 0 2px ${dotColor}30`,
            animation: isSyncing ? "pulse 1.5s infinite" : undefined,
          }} />
          <span>{label}</span>
        </button>
      </Tooltip>
      <SyncStatusDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
