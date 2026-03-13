import { mockProducts, type Product } from "../data/mockProducts";

// Simulates async API calls — swap with real ERP endpoints later

export async function getProducts(): Promise<Product[]> {
  await new Promise(r => setTimeout(r, 300));
  return mockProducts;
}

export async function getProductByBarcode(
  barcode: string
): Promise<Product | null> {
  await new Promise(r => setTimeout(r, 80));
  return mockProducts.find(p => p.barcode === barcode) ?? null;
}

export async function getProductsByCategory(
  category: string
): Promise<Product[]> {
  await new Promise(r => setTimeout(r, 200));
  if (category === "All") return mockProducts;
  return mockProducts.filter(p => p.category === category);
}

export interface OrderPayload {
  items: Array<{ productId: string; quantity: number; unitPrice: number }>;
  subtotal: number;
  discountType: "percent" | "fixed";
  discountValue: number;
  taxRate: number;
  taxAmount: number;
  grandTotal: number;
  paymentMethod: "cash" | "card" | "split";
  cashAmount?: number;
  cardAmount?: number;
  cardRef?: string;
  branchId?: string;
  customerId?: string;
  pointsRedeemed?: number;
  pointsEarned?: number;
  voucherCode?: string;
  giftCardCodes?: string[];
}

export interface OrderResult {
  orderId: string;
  orderNumber: string;
  createdAt: string;
}

export async function submitOrder(payload: OrderPayload): Promise<OrderResult> {
  await new Promise(r => setTimeout(r, 400));
  const orderId = `ORD-${Date.now()}`;
  const num = Math.floor(100000 + Math.random() * 900000);
  return {
    orderId,
    orderNumber: `POS-${num}`,
    createdAt: new Date().toISOString(),
  };
}
