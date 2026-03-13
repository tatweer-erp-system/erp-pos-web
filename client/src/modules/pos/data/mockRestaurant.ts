// ── Restaurant types ──────────────────────────────────────────────────────────

export interface RestaurantSection {
  id: string;
  name: string;
  color: string;
}

export interface RestaurantTable {
  id: string;
  name: string;
  sectionId: string;
  capacity: number;
  shape: "square" | "round";
  status: "available" | "occupied" | "reserved";
  /** ISO timestamp when guests were seated */
  seatedAt?: string;
  guestCount?: number;
  /** Running order total for occupied table */
  orderTotal?: number;
}

export interface CourseType {
  id: string;
  name: string;
  order: number;
}

export type CourseStatus = "pending" | "sent" | "ready" | "served";

export interface KitchenPrinter {
  id: string;
  name: string;
  type: "receipt" | "kitchen";
  connection: "usb" | "network";
  ipAddress?: string;
  /** Product category IDs this printer handles */
  categories: string[];
  status: "active" | "inactive";
}

// ── Mock sections ─────────────────────────────────────────────────────────────

export const mockSections: RestaurantSection[] = [
  { id: "sec-1", name: "Main Hall", color: "#6366F1" },
  { id: "sec-2", name: "Terrace", color: "#10B981" },
  { id: "sec-3", name: "Bar", color: "#F59E0B" },
  { id: "sec-4", name: "VIP Room", color: "#A855F7" },
];

// ── Mock tables ───────────────────────────────────────────────────────────────

export const mockTables: RestaurantTable[] = [
  // Main Hall
  {
    id: "tbl-1",
    name: "T-01",
    sectionId: "sec-1",
    capacity: 4,
    shape: "square",
    status: "available",
  },
  {
    id: "tbl-2",
    name: "T-02",
    sectionId: "sec-1",
    capacity: 2,
    shape: "round",
    status: "occupied",
    seatedAt: new Date(Date.now() - 42 * 60000).toISOString(),
    guestCount: 2,
    orderTotal: 38.5,
  },
  {
    id: "tbl-3",
    name: "T-03",
    sectionId: "sec-1",
    capacity: 6,
    shape: "square",
    status: "reserved",
  },
  {
    id: "tbl-4",
    name: "T-04",
    sectionId: "sec-1",
    capacity: 4,
    shape: "square",
    status: "occupied",
    seatedAt: new Date(Date.now() - 18 * 60000).toISOString(),
    guestCount: 3,
    orderTotal: 72.0,
  },
  {
    id: "tbl-5",
    name: "T-05",
    sectionId: "sec-1",
    capacity: 8,
    shape: "square",
    status: "available",
  },
  {
    id: "tbl-6",
    name: "T-06",
    sectionId: "sec-1",
    capacity: 2,
    shape: "round",
    status: "available",
  },

  // Terrace
  {
    id: "tbl-7",
    name: "P-01",
    sectionId: "sec-2",
    capacity: 4,
    shape: "square",
    status: "occupied",
    seatedAt: new Date(Date.now() - 65 * 60000).toISOString(),
    guestCount: 4,
    orderTotal: 124.75,
  },
  {
    id: "tbl-8",
    name: "P-02",
    sectionId: "sec-2",
    capacity: 4,
    shape: "square",
    status: "available",
  },
  {
    id: "tbl-9",
    name: "P-03",
    sectionId: "sec-2",
    capacity: 2,
    shape: "round",
    status: "reserved",
  },
  {
    id: "tbl-10",
    name: "P-04",
    sectionId: "sec-2",
    capacity: 6,
    shape: "square",
    status: "available",
  },

  // Bar
  {
    id: "tbl-11",
    name: "B-01",
    sectionId: "sec-3",
    capacity: 2,
    shape: "round",
    status: "occupied",
    seatedAt: new Date(Date.now() - 12 * 60000).toISOString(),
    guestCount: 1,
    orderTotal: 15.0,
  },
  {
    id: "tbl-12",
    name: "B-02",
    sectionId: "sec-3",
    capacity: 2,
    shape: "round",
    status: "available",
  },
  {
    id: "tbl-13",
    name: "B-03",
    sectionId: "sec-3",
    capacity: 2,
    shape: "round",
    status: "available",
  },

  // VIP Room
  {
    id: "tbl-14",
    name: "V-01",
    sectionId: "sec-4",
    capacity: 10,
    shape: "square",
    status: "reserved",
  },
  {
    id: "tbl-15",
    name: "V-02",
    sectionId: "sec-4",
    capacity: 8,
    shape: "square",
    status: "available",
  },
];

// ── Mock courses ──────────────────────────────────────────────────────────────

export const mockCourses: CourseType[] = [
  { id: "course-starter", name: "Starter", order: 1 },
  { id: "course-main", name: "Main", order: 2 },
  { id: "course-dessert", name: "Dessert", order: 3 },
];

// ── Mock kitchen printers ─────────────────────────────────────────────────────

export const mockKitchenPrinters: KitchenPrinter[] = [
  {
    id: "kp-1",
    name: "Main Kitchen",
    type: "kitchen",
    connection: "network",
    ipAddress: "192.168.1.50",
    categories: ["cat-food"],
    status: "active",
  },
  {
    id: "kp-2",
    name: "Bar Printer",
    type: "kitchen",
    connection: "usb",
    categories: ["cat-drinks"],
    status: "active",
  },
  {
    id: "kp-3",
    name: "Receipt Desk",
    type: "receipt",
    connection: "usb",
    categories: [],
    status: "active",
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

export function getSection(sectionId: string): RestaurantSection {
  return (
    mockSections.find(s => s.id === sectionId) ?? {
      id: "",
      name: "Unknown",
      color: "#888",
    }
  );
}

export function formatSeatedDuration(seatedAt: string): string {
  const mins = Math.floor((Date.now() - new Date(seatedAt).getTime()) / 60000);
  if (mins < 60) return `${mins}m`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}
