import { openDB, type IDBPDatabase } from "idb";
import type { Product } from "../data/mockProducts";
import type { OrderPayload } from "./posService";

const DB_NAME = "pos-offline-db";
const DB_VERSION = 1;

export interface QueuedTransaction {
  id: string;
  payload: OrderPayload;
  cashierName: string;
  cashierId: string;
  status: "pending" | "syncing" | "synced" | "failed";
  retries: number;
  timestamp: string;
  localOrderNumber: string;
  isOfflineSale: true;
  errorMessage?: string;
}

let _db: IDBPDatabase | null = null;

export async function getDB(): Promise<IDBPDatabase> {
  if (_db) return _db;
  _db = await openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("products")) {
        db.createObjectStore("products", { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains("transactions")) {
        const store = db.createObjectStore("transactions", { keyPath: "id" });
        store.createIndex("status", "status");
        store.createIndex("timestamp", "timestamp");
      }
      if (!db.objectStoreNames.contains("meta")) {
        db.createObjectStore("meta", { keyPath: "key" });
      }
    },
  });
  return _db;
}

// ── Products ──────────────────────────────────────────────────────────────────

export async function cacheProducts(products: Product[]): Promise<void> {
  const db = await getDB();
  const tx = db.transaction(["products", "meta"], "readwrite");
  await tx.objectStore("products").clear();
  for (const p of products) {
    await tx.objectStore("products").put(p);
  }
  await tx.objectStore("meta").put({
    key: "lastProductCache",
    value: new Date().toISOString(),
  });
  await tx.done;
}

export async function getCachedProducts(): Promise<Product[]> {
  const db = await getDB();
  return db.getAll("products");
}

export async function getLastCacheTime(): Promise<string | null> {
  const db = await getDB();
  const row = await db.get("meta", "lastProductCache");
  return (row?.value as string) ?? null;
}

// ── Transaction queue ─────────────────────────────────────────────────────────

export async function enqueueTransaction(
  txn: Omit<QueuedTransaction, "status" | "retries">
): Promise<void> {
  const db = await getDB();
  await db.put("transactions", { ...txn, status: "pending", retries: 0 });
}

export async function getAllTransactions(): Promise<QueuedTransaction[]> {
  const db = await getDB();
  return db.getAll("transactions");
}

export async function updateTransaction(txn: QueuedTransaction): Promise<void> {
  const db = await getDB();
  await db.put("transactions", txn);
}

export async function deleteSyncedTransactions(): Promise<void> {
  const db = await getDB();
  const all = await db.getAll("transactions");
  const tx = db.transaction("transactions", "readwrite");
  for (const t of all) {
    if (t.status === "synced") await tx.store.delete(t.id);
  }
  await tx.done;
}

export async function resetFailedToRetry(): Promise<void> {
  const db = await getDB();
  const all = await db.getAll("transactions");
  const tx = db.transaction("transactions", "readwrite");
  for (const t of all) {
    if (t.status === "failed") {
      await tx.store.put({
        ...t,
        status: "pending",
        retries: 0,
        errorMessage: undefined,
      });
    }
  }
  await tx.done;
}
