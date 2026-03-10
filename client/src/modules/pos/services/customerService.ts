import { mockCustomers, getTier, type Customer } from "../data/mockCustomers";

// In-memory store — replace with real ERP API calls later
let customers = [...mockCustomers];

export async function searchCustomers(query: string): Promise<Customer[]> {
  await new Promise((r) => setTimeout(r, 120));
  if (!query.trim()) return [];
  const q = query.trim().toLowerCase();
  return customers.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.phone.includes(q) ||
      (c.email?.toLowerCase().includes(q) ?? false)
  );
}

export async function getCustomerById(id: string): Promise<Customer | null> {
  await new Promise((r) => setTimeout(r, 80));
  return customers.find((c) => c.id === id) ?? null;
}

export interface NewCustomerPayload {
  name: string;
  phone: string;
  email?: string;
}

export async function createCustomer(payload: NewCustomerPayload): Promise<Customer> {
  await new Promise((r) => setTimeout(r, 300));
  const newCustomer: Customer = {
    id: `C${String(customers.length + 1).padStart(3, "0")}`,
    name: payload.name,
    phone: payload.phone,
    email: payload.email,
    loyaltyPoints: 0,
    tierId: "bronze",
    joinDate: new Date().toISOString().split("T")[0],
    totalSpent: 0,
    transactionCount: 0,
  };
  customers = [...customers, newCustomer];
  return newCustomer;
}

export interface PointsUpdatePayload {
  customerId: string;
  pointsEarned: number;
  pointsRedeemed: number;
  orderNumber: string;
  amount: number;
}

export async function updateCustomerPoints(payload: PointsUpdatePayload): Promise<Customer> {
  await new Promise((r) => setTimeout(r, 150));
  customers = customers.map((c) => {
    if (c.id !== payload.customerId) return c;
    const newPoints = Math.max(0, c.loyaltyPoints + payload.pointsEarned - payload.pointsRedeemed);
    const newTier = getTier(newPoints);
    return {
      ...c,
      loyaltyPoints: newPoints,
      tierId: newTier.id,
      lastTransaction: new Date().toISOString().split("T")[0],
      totalSpent: c.totalSpent + payload.amount,
      transactionCount: c.transactionCount + 1,
    };
  });
  return customers.find((c) => c.id === payload.customerId)!;
}

export async function getAllCustomers(): Promise<Customer[]> {
  await new Promise((r) => setTimeout(r, 200));
  return [...customers];
}

export interface LoyaltyReportRow {
  customer: Customer;
  pointsEarned: number;
  pointsRedeemed: number;
}

export async function getLoyaltyReport(): Promise<LoyaltyReportRow[]> {
  await new Promise((r) => setTimeout(r, 300));
  // Mock report data
  return customers.map((c) => ({
    customer: c,
    pointsEarned: Math.round(c.totalSpent * 0.1),
    pointsRedeemed: Math.round(c.loyaltyPoints * 0.15),
  }));
}
