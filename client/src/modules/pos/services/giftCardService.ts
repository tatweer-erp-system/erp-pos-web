// ─── Types ────────────────────────────────────────────────────────────────────

export interface GiftCardDenomination {
  id: string;
  amount: number;
  label: string;
  status: "active" | "inactive";
}

export interface GiftCard {
  id: string;
  code: string;
  issuedAmount: number;
  remainingBalance: number;
  issuedTo?: string;   // customer name
  issuedDate: string;
  expiryDate?: string;
  status: "active" | "depleted" | "expired";
}

export interface IssueGiftCardPayload {
  amount: number;
  issuedTo?: string;
  expiryDate?: string;
}

export interface GiftCardBalanceResult {
  found: boolean;
  giftCard?: GiftCard;
  message?: string;
}

// ─── Mock data ────────────────────────────────────────────────────────────────

export const mockDenominations: GiftCardDenomination[] = [
  { id: "D001", amount: 10,  label: "$10 Gift Card",  status: "active" },
  { id: "D002", amount: 25,  label: "$25 Gift Card",  status: "active" },
  { id: "D003", amount: 50,  label: "$50 Gift Card",  status: "active" },
  { id: "D004", amount: 100, label: "$100 Gift Card", status: "active" },
  { id: "D005", amount: 200, label: "$200 Gift Card", status: "active" },
  { id: "D006", amount: 500, label: "$500 Gift Card", status: "inactive" },
];

let mockGiftCards: GiftCard[] = [
  {
    id: "GC001", code: "GC-2025-001",
    issuedAmount: 50, remainingBalance: 50,
    issuedTo: "Emma Wilson",
    issuedDate: "2026-01-10", expiryDate: "2027-01-10",
    status: "active",
  },
  {
    id: "GC002", code: "GC-2025-002",
    issuedAmount: 100, remainingBalance: 80,
    issuedTo: "Carlos Mendez",
    issuedDate: "2025-12-15", expiryDate: "2026-12-15",
    status: "active",
  },
  {
    id: "GC003", code: "GC-2025-003",
    issuedAmount: 200, remainingBalance: 0,
    issuedDate: "2025-11-01", expiryDate: "2026-11-01",
    status: "depleted",
  },
  {
    id: "GC004", code: "GC-TEST-001",
    issuedAmount: 25, remainingBalance: 25,
    issuedDate: "2026-02-20", status: "active",
  },
  {
    id: "GC005", code: "GC-EXP-001",
    issuedAmount: 50, remainingBalance: 30,
    issuedDate: "2024-01-01", expiryDate: "2025-01-01",
    status: "expired",
  },
  {
    id: "GC006", code: "GC-2026-001",
    issuedAmount: 150, remainingBalance: 150,
    issuedTo: "Sarah Johnson",
    issuedDate: "2026-03-01", expiryDate: "2027-03-01",
    status: "active",
  },
];

// ─── Service functions ────────────────────────────────────────────────────────

export async function checkGiftCardBalance(
  code: string
): Promise<GiftCardBalanceResult> {
  await new Promise((r) => setTimeout(r, 250));

  const gc = mockGiftCards.find(
    (c) => c.code.toUpperCase() === code.trim().toUpperCase()
  );

  if (!gc) return { found: false, message: "Gift card not found" };
  return { found: true, giftCard: gc };
}

export async function issueGiftCard(
  payload: IssueGiftCardPayload
): Promise<GiftCard> {
  await new Promise((r) => setTimeout(r, 350));

  const year = new Date().getFullYear();
  const seq = String(mockGiftCards.length + 1).padStart(3, "0");
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  const code = `GC-${year}-${rand}${seq}`;

  const newCard: GiftCard = {
    id: `GC${String(mockGiftCards.length + 1).padStart(3, "0")}`,
    code,
    issuedAmount: payload.amount,
    remainingBalance: payload.amount,
    issuedTo: payload.issuedTo,
    issuedDate: new Date().toISOString().split("T")[0],
    expiryDate: payload.expiryDate,
    status: "active",
  };
  mockGiftCards = [...mockGiftCards, newCard];
  return newCard;
}

export async function redeemGiftCard(
  code: string,
  amount: number
): Promise<GiftCard> {
  await new Promise((r) => setTimeout(r, 150));

  mockGiftCards = mockGiftCards.map((gc) => {
    if (gc.code.toUpperCase() !== code.toUpperCase()) return gc;
    const newBalance = Math.max(0, gc.remainingBalance - amount);
    return {
      ...gc,
      remainingBalance: newBalance,
      status: newBalance === 0 ? ("depleted" as const) : gc.status,
    };
  });

  return mockGiftCards.find(
    (gc) => gc.code.toUpperCase() === code.toUpperCase()
  )!;
}

export async function getAllGiftCards(): Promise<GiftCard[]> {
  await new Promise((r) => setTimeout(r, 200));
  return [...mockGiftCards];
}

export async function getDenominations(): Promise<GiftCardDenomination[]> {
  await new Promise((r) => setTimeout(r, 100));
  return [...mockDenominations];
}
