import { useEffect, useRef, useCallback } from "react";
import { message } from "antd";
import { usePOSStore } from "../store/posStore";
import { cacheProducts, getLastCacheTime } from "../services/offlineService";
import {
  syncAllPending,
  getPendingCount,
  getFailedCount,
} from "../services/syncService";
import { getProducts } from "../services/posService";

export function useOfflineSync() {
  const isOnline = usePOSStore(s => s.isOnline);
  const setIsOnline = usePOSStore(s => s.setIsOnline);
  const offlineModeEnabled = usePOSStore(s => s.offlineModeEnabled);
  const cacheRefreshInterval = usePOSStore(s => s.cacheRefreshInterval);
  const setLastCacheSync = usePOSStore(s => s.setLastCacheSync);
  const setPendingCount = usePOSStore(s => s.setPendingCount);
  const setFailedCount = usePOSStore(s => s.setFailedCount);
  const setIsSyncing = usePOSStore(s => s.setIsSyncing);

  const cacheTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Refresh counts ─────────────────────────────────────────────────────────
  const refreshCounts = useCallback(async () => {
    const [pending, failed] = await Promise.all([
      getPendingCount(),
      getFailedCount(),
    ]);
    setPendingCount(pending);
    setFailedCount(failed);
  }, [setPendingCount, setFailedCount]);

  // ── Cache products ─────────────────────────────────────────────────────────
  const refreshCache = useCallback(async () => {
    if (!navigator.onLine) return;
    try {
      const products = await getProducts();
      await cacheProducts(products);
      const now = new Date().toISOString();
      setLastCacheSync(now);
    } catch {
      // ignore cache errors silently
    }
  }, [setLastCacheSync]);

  // ── Trigger sync queue ─────────────────────────────────────────────────────
  const triggerSync = useCallback(async () => {
    const pending = await getPendingCount();
    if (pending === 0) return;
    setIsSyncing(true);
    try {
      const { synced, failed } = await syncAllPending();
      if (synced > 0)
        message.success(
          `Synced ${synced} offline transaction${synced !== 1 ? "s" : ""}`
        );
      if (failed > 0)
        message.warning(
          `${failed} transaction${failed !== 1 ? "s" : ""} failed to sync`
        );
    } catch {
      // handled per-transaction
    } finally {
      setIsSyncing(false);
      await refreshCounts();
    }
  }, [setIsSyncing, refreshCounts]);

  // ── Online/offline listeners ───────────────────────────────────────────────
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      triggerSync();
      refreshCache();
    };
    const handleOffline = () => {
      setIsOnline(false);
    };
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [setIsOnline, triggerSync, refreshCache]);

  // ── Initial load ───────────────────────────────────────────────────────────
  useEffect(() => {
    refreshCounts();

    if (!offlineModeEnabled) return;

    // Restore last cache time from IndexedDB
    getLastCacheTime().then(t => {
      if (t) setLastCacheSync(t);
    });

    // Initial cache refresh
    refreshCache();
  }, [offlineModeEnabled]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Auto cache refresh interval ────────────────────────────────────────────
  useEffect(() => {
    if (!offlineModeEnabled || cacheRefreshInterval === 0) return;
    const ms = cacheRefreshInterval * 60 * 1000;
    cacheTimer.current = setInterval(refreshCache, ms);
    return () => {
      if (cacheTimer.current) clearInterval(cacheTimer.current);
    };
  }, [offlineModeEnabled, cacheRefreshInterval, refreshCache]);

  return { refreshCache, triggerSync, refreshCounts };
}
