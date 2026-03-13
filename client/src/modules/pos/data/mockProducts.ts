export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  barcode: string;
  unit: string;
  color: string; // placeholder avatar color
  image?: string; // optional product image URL
}

export const CATEGORIES = [
  "All",
  "Electronics",
  "Food & Beverage",
  "Office Supplies",
  "Clothing",
  "Personal Care",
];

export const mockProducts: Product[] = [
  {
    id: "P001",
    name: "Wireless Mouse",
    price: 29.99,
    category: "Electronics",
    stock: 42,
    barcode: "4901234567890",
    unit: "pcs",
    color: "#0066CC",
    image:
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=200&h=200&fit=crop&auto=format",
  },
  {
    id: "P002",
    name: "USB-C Hub 7-in-1",
    price: 54.99,
    category: "Electronics",
    stock: 18,
    barcode: "4901234567891",
    unit: "pcs",
    color: "#6366F1",
    image:
      "https://images.unsplash.com/photo-1591370874773-6702e8f12fd8?w=200&h=200&fit=crop&auto=format",
  },
  {
    id: "P003",
    name: "Mechanical Keyboard",
    price: 89.99,
    category: "Electronics",
    stock: 7,
    barcode: "4901234567892",
    unit: "pcs",
    color: "#8B5CF6",
    image:
      "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=200&h=200&fit=crop&auto=format",
  },
  {
    id: "P004",
    name: "Bottled Water 1.5L",
    price: 1.25,
    category: "Food & Beverage",
    stock: 200,
    barcode: "4901234567893",
    unit: "bottle",
    color: "#06B6D4",
    image:
      "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=200&h=200&fit=crop&auto=format",
  },
  {
    id: "P005",
    name: "Ground Coffee 500g",
    price: 12.5,
    category: "Food & Beverage",
    stock: 35,
    barcode: "4901234567894",
    unit: "pack",
    color: "#92400E",
    image:
      "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=200&h=200&fit=crop&auto=format",
  },
  {
    id: "P006",
    name: "Energy Drink 250ml",
    price: 2.75,
    category: "Food & Beverage",
    stock: 120,
    barcode: "4901234567895",
    unit: "can",
    color: "#10B981",
    image:
      "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=200&h=200&fit=crop&auto=format",
  },
  {
    id: "P007",
    name: "A4 Paper Ream 500s",
    price: 8.99,
    category: "Office Supplies",
    stock: 60,
    barcode: "4901234567896",
    unit: "ream",
    color: "#F59E0B",
    image:
      "https://images.unsplash.com/photo-1568667256549-094345857637?w=200&h=200&fit=crop&auto=format",
  },
  {
    id: "P008",
    name: "Ballpoint Pen (12pk)",
    price: 4.5,
    category: "Office Supplies",
    stock: 90,
    barcode: "4901234567897",
    unit: "pack",
    color: "#EF4444",
    image:
      "https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=200&h=200&fit=crop&auto=format",
  },
  {
    id: "P009",
    name: "Sticky Notes 3x3",
    price: 3.25,
    category: "Office Supplies",
    stock: 0,
    barcode: "4901234567898",
    unit: "pack",
    color: "#F97316",
  },
  {
    id: "P010",
    name: "Cotton T-Shirt (L)",
    price: 19.99,
    category: "Clothing",
    stock: 24,
    barcode: "4901234567899",
    unit: "pcs",
    color: "#0EA5E9",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=200&fit=crop&auto=format",
  },
  {
    id: "P011",
    name: "Slim Fit Chinos",
    price: 44.99,
    category: "Clothing",
    stock: 12,
    barcode: "4901234567900",
    unit: "pcs",
    color: "#475569",
    image:
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=200&h=200&fit=crop&auto=format",
  },
  {
    id: "P012",
    name: "Running Socks (3pk)",
    price: 9.99,
    category: "Clothing",
    stock: 55,
    barcode: "4901234567901",
    unit: "pack",
    color: "#64748B",
  },
  {
    id: "P013",
    name: "Hand Sanitizer 250ml",
    price: 3.99,
    category: "Personal Care",
    stock: 80,
    barcode: "4901234567902",
    unit: "bottle",
    color: "#22C55E",
    image:
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&h=200&fit=crop&auto=format",
  },
  {
    id: "P014",
    name: "Face Mask (50pk)",
    price: 14.99,
    category: "Personal Care",
    stock: 5,
    barcode: "4901234567903",
    unit: "box",
    color: "#A855F7",
    image:
      "https://images.unsplash.com/photo-1584634428259-b1749803b3c2?w=200&h=200&fit=crop&auto=format",
  },
  {
    id: "P015",
    name: "Shampoo 400ml",
    price: 7.5,
    category: "Personal Care",
    stock: 33,
    barcode: "4901234567904",
    unit: "bottle",
    color: "#EC4899",
    image:
      "https://images.unsplash.com/photo-1556227834-09f1de7a7d14?w=200&h=200&fit=crop&auto=format",
  },
];
