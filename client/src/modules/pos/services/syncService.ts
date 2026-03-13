import {
  getAllTransactions,
  updateTransaction,
  deleteSyncedTransactions,
  resetFailedToRetry,
  type QueuedTransaction,
} from "./offlineService";
import { submitOrder } from "./posService";

const MAX_RETRIES = 3;

export async function getPendingCount(): Promise<number> {
  const all = await getAllTransactions();
  return all.filter(t => t.status === "pending" || t.status === "failed")
    .length;
}

export async function getFailedCount(): Promise<number> {
  const all = await getAllTransactions();
  return all.filter(t => t.status === "failed" && t.retries >= MAX_RETRIES)
    .length;
}

export async function syncAllPending(
  onProgress?: (done: number, total: number) => void
): Promise<{ synced: number; failed: number }> {
  const all = await getAllTransactions();
  const pending = all.filter(
    t => t.status === "pending" || t.status === "syncing"
  );
  let synced = 0;
  let failed = 0;

  for (let i = 0; i < pending.length; i++) {
    const txn = pending[i];
    try {
      await updateTransaction({ ...txn, status: "syncing" });
      await submitOrder(txn.payload);
      await updateTransaction({ ...txn, status: "synced" });
      synced++;
    } catch (err) {
      const retries = txn.retries + 1;
      const status: QueuedTransaction["status"] =
        retries >= MAX_RETRIES ? "failed" : "pending";
      await updateTransaction({
        ...txn,
        status,
        retries,
        errorMessage: err instanceof Error ? err.message : "Sync failed",
      });
      failed++;
    }
    onProgress?.(i + 1, pending.length);
  }

  await deleteSyncedTransactions();
  return { synced, failed };
}

export async function retryAllFailed(): Promise<void> {
  await resetFailedToRetry();
}

export { getAllTransactions, type QueuedTransaction };
