export type CashierRole = "cashier" | "senior_cashier" | "manager";

export interface Cashier {
  id: string;
  name: string;
  role: CashierRole;
  roleLabel: string;
  initials: string;
  color: string;
  pinSet: boolean;
  lastLogin?: string;
}

// ─── Mock cashier roster ──────────────────────────────────────────────────────
const CASHIERS: Cashier[] = [
  {
    id: "c1",
    name: "Alex Johnson",
    role: "cashier",
    roleLabel: "Cashier",
    initials: "AJ",
    color: "#0066CC",
    pinSet: true,
    lastLogin: "Today, 09:15 AM",
  },
  {
    id: "c2",
    name: "Sara Ahmed",
    role: "cashier",
    roleLabel: "Cashier",
    initials: "SA",
    color: "#10B981",
    pinSet: true,
    lastLogin: "Today, 08:30 AM",
  },
  {
    id: "c3",
    name: "Mohammed Al-Rashid",
    role: "senior_cashier",
    roleLabel: "Senior Cashier",
    initials: "MR",
    color: "#F59E0B",
    pinSet: true,
    lastLogin: "Yesterday",
  },
  {
    id: "c4",
    name: "Layla Hassan",
    role: "cashier",
    roleLabel: "Cashier",
    initials: "LH",
    color: "#EC4899",
    pinSet: true,
  },
  {
    id: "mgr",
    name: "Omar Al-Manager",
    role: "manager",
    roleLabel: "Manager",
    initials: "OM",
    color: "#A855F7",
    pinSet: true,
    lastLogin: "Today, 07:00 AM",
  },
];

// ─── PIN storage — all PINs default to "0000" ─────────────────────────────────
const PIN_MAP: Record<string, string> = {
  c1: "0000",
  c2: "0000",
  c3: "0000",
  c4: "0000",
  mgr: "0000",
};

// ─── Simulated API delay ──────────────────────────────────────────────────────
const API_DELAY_MS = 600;

function delay(ms = API_DELAY_MS): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ─── Sync helpers (internal / non-network usage) ──────────────────────────────

export function getCashiers(): Cashier[] {
  return CASHIERS;
}

export function getCashier(id: string): Cashier | undefined {
  return CASHIERS.find(c => c.id === id);
}

export function getManagers(): Cashier[] {
  return CASHIERS.filter(c => c.role === "manager");
}

export function cashierHasPIN(cashierId: string): boolean {
  return cashierId in PIN_MAP;
}

// ─── Async API — simulate network round-trips ─────────────────────────────────

/** Fetch cashier list (simulates GET /api/pos/cashiers) */
export async function apiGetCashiers(): Promise<Cashier[]> {
  await delay();
  return [...CASHIERS];
}

/**
 * Validate a PIN against the server (simulates POST /api/pos/auth/validate-pin).
 * Resolves to `true` on match, `false` on mismatch.
 */
export async function apiValidatePIN(
  cashierId: string,
  pin: string
): Promise<boolean> {
  await delay();
  // Fall back to "0000" for any user not in the PIN map (e.g. ERP users)
  const stored = PIN_MAP[cashierId] ?? "0000";
  return stored === pin;
}

/**
 * Record a successful login (simulates POST /api/pos/auth/record-login).
 * Updates the in-memory last-login timestamp.
 */
export async function apiRecordLogin(cashierId: string): Promise<void> {
  await delay(200);
  const cashier = CASHIERS.find(c => c.id === cashierId);
  if (cashier) {
    cashier.lastLogin = new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }
}

export interface LoginResult {
  success: boolean;
  cashier?: Cashier;
  /** Remaining allowed attempts on failure */
  attemptsLeft?: number;
  /** Error message on failure */
  error?: string;
}

/**
 * Full login request (simulates POST /api/pos/auth/login).
 * Validates PIN and records login on success.
 */
export async function apiLogin(
  cashierId: string,
  pin: string,
  maxAttempts = 3
): Promise<LoginResult> {
  await delay();
  const cashier = CASHIERS.find(c => c.id === cashierId);
  if (!cashier) return { success: false, error: "Cashier not found." };

  const ok = PIN_MAP[cashierId] === pin;
  if (ok) {
    cashier.lastLogin = new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return { success: true, cashier };
  }
  return {
    success: false,
    error: "Incorrect PIN.",
    attemptsLeft: maxAttempts - 1,
  };
}

/**
 * Reset a cashier's PIN (simulates PUT /api/pos/cashiers/:id/pin).
 */
export async function apiSetPIN(
  cashierId: string,
  newPin: string
): Promise<void> {
  await delay();
  PIN_MAP[cashierId] = newPin;
  const cashier = CASHIERS.find(c => c.id === cashierId);
  if (cashier) cashier.pinSet = true;
}

// ─── Legacy sync wrappers (kept for backward compatibility) ───────────────────

/** @deprecated Use apiValidatePIN instead */
export function validatePIN(cashierId: string, pin: string): boolean {
  return PIN_MAP[cashierId] === pin;
}

/** @deprecated Use apiRecordLogin instead */
export function recordLogin(cashierId: string): void {
  const cashier = CASHIERS.find(c => c.id === cashierId);
  if (cashier) {
    cashier.lastLogin = new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }
}

/** @deprecated Use apiSetPIN instead */
export function setPIN(cashierId: string, newPin: string): void {
  PIN_MAP[cashierId] = newPin;
  const cashier = CASHIERS.find(c => c.id === cashierId);
  if (cashier) cashier.pinSet = true;
}
