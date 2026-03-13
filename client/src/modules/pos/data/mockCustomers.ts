export interface LoyaltyTier {
  id: string;
  name: string;
  minPoints: number;
  maxPoints: number;
  /** Points earned per 1 currency unit spent */
  earnRatio: number;
  /** Currency value of 1 point (for redemption) */
  redeemRatio: number;
  color: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  loyaltyPoints: number;
  tierId: string;
  joinDate: string;
  lastTransaction?: string;
  totalSpent: number;
  transactionCount: number;
}

/** Default walk-in customer used when no specific customer is selected */
export const WALK_IN_CUSTOMER: Customer = {
  id: "walk-in",
  name: "Walk-in Customer",
  phone: "",
  loyaltyPoints: 0,
  tierId: "bronze",
  joinDate: "",
  totalSpent: 0,
  transactionCount: 0,
};

export const LOYALTY_TIERS: LoyaltyTier[] = [
  {
    id: "bronze",
    name: "Bronze",
    minPoints: 0,
    maxPoints: 500,
    earnRatio: 0.1, // 1 point per $10
    redeemRatio: 0.1, // $0.10 per point
    color: "#CD7F32",
  },
  {
    id: "silver",
    name: "Silver",
    minPoints: 501,
    maxPoints: 2000,
    earnRatio: 0.15,
    redeemRatio: 0.12,
    color: "#A8A9AD",
  },
  {
    id: "gold",
    name: "Gold",
    minPoints: 2001,
    maxPoints: 5000,
    earnRatio: 0.2,
    redeemRatio: 0.15,
    color: "#FFD700",
  },
  {
    id: "platinum",
    name: "Platinum",
    minPoints: 5001,
    maxPoints: 999999,
    earnRatio: 0.25,
    redeemRatio: 0.2,
    color: "#E5E4E2",
  },
];

export const DEFAULT_EARN_RATIO = 0.1; // fallback: 1 pt per $10
export const DEFAULT_REDEEM_RATIO = 0.1; // fallback: $0.10 per point

export function getTier(points: number): LoyaltyTier {
  return (
    LOYALTY_TIERS.find(t => points >= t.minPoints && points <= t.maxPoints) ??
    LOYALTY_TIERS[0]
  );
}

export const mockCustomers: Customer[] = [
  {
    id: "C001",
    name: "Sarah Johnson",
    phone: "+1-555-0101",
    email: "sarah.j@email.com",
    loyaltyPoints: 1240,
    tierId: "silver",
    joinDate: "2024-03-15",
    lastTransaction: "2026-03-05",
    totalSpent: 8200,
    transactionCount: 47,
  },
  {
    id: "C002",
    name: "Mohamed Al-Rashid",
    phone: "+966-55-1234567",
    email: "m.rashid@email.com",
    loyaltyPoints: 3850,
    tierId: "gold",
    joinDate: "2023-08-20",
    lastTransaction: "2026-03-07",
    totalSpent: 24100,
    transactionCount: 132,
  },
  {
    id: "C003",
    name: "Emma Wilson",
    phone: "+44-7700-900123",
    email: "emma.w@email.com",
    loyaltyPoints: 210,
    tierId: "bronze",
    joinDate: "2025-11-01",
    lastTransaction: "2026-02-28",
    totalSpent: 1450,
    transactionCount: 9,
  },
  {
    id: "C004",
    name: "Carlos Mendez",
    phone: "+52-55-12345678",
    email: "c.mendez@email.com",
    loyaltyPoints: 6200,
    tierId: "platinum",
    joinDate: "2022-05-10",
    lastTransaction: "2026-03-08",
    totalSpent: 48500,
    transactionCount: 289,
  },
  {
    id: "C005",
    name: "Amira Hassan",
    phone: "+20-100-1234567",
    email: "amira.h@email.com",
    loyaltyPoints: 875,
    tierId: "silver",
    joinDate: "2024-09-12",
    lastTransaction: "2026-03-01",
    totalSpent: 5800,
    transactionCount: 34,
  },
  {
    id: "C006",
    name: "James Park",
    phone: "+1-555-0202",
    loyaltyPoints: 0,
    tierId: "bronze",
    joinDate: "2026-01-15",
    totalSpent: 320,
    transactionCount: 2,
  },
  {
    id: "C007",
    name: "Fatima Al-Zahra",
    phone: "+971-50-1234567",
    email: "fatima.z@email.com",
    loyaltyPoints: 4100,
    tierId: "gold",
    joinDate: "2023-12-05",
    lastTransaction: "2026-03-06",
    totalSpent: 31000,
    transactionCount: 175,
  },
  {
    id: "C008",
    name: "David Chen",
    phone: "+1-555-0303",
    email: "d.chen@email.com",
    loyaltyPoints: 150,
    tierId: "bronze",
    joinDate: "2025-12-20",
    lastTransaction: "2026-02-15",
    totalSpent: 980,
    transactionCount: 6,
  },
  {
    id: "C009",
    name: "Nour Khalil",
    phone: "+961-70-123456",
    email: "nour.k@email.com",
    loyaltyPoints: 1890,
    tierId: "silver",
    joinDate: "2024-06-18",
    lastTransaction: "2026-03-04",
    totalSpent: 11200,
    transactionCount: 68,
  },
  {
    id: "C010",
    name: "Lisa Thompson",
    phone: "+1-555-0404",
    email: "l.thompson@email.com",
    loyaltyPoints: 7800,
    tierId: "platinum",
    joinDate: "2021-11-30",
    lastTransaction: "2026-03-08",
    totalSpent: 63000,
    transactionCount: 401,
  },
];
