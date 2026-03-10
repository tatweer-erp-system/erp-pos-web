import type { CartItem } from "../store/posStore";
import type { KitchenPrinter } from "../data/mockRestaurant";
import { mockKitchenPrinters } from "../data/mockRestaurant";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface KitchenTicketData {
  orderNumber: string;
  tableName?: string;
  guestCount?: number;
  timestamp: string;
  cashierName: string;
  items: CartItem[];
  notes?: string;
}

// ── In-memory printer state ───────────────────────────────────────────────────

let printers: KitchenPrinter[] = [...mockKitchenPrinters];

function delay(ms = 200): Promise<void> {
  return new Promise((res) => setTimeout(res, ms));
}

// ── Printer CRUD ──────────────────────────────────────────────────────────────

export async function getKitchenPrinters(): Promise<KitchenPrinter[]> {
  await delay(150);
  return [...printers];
}

export async function createKitchenPrinter(
  payload: Omit<KitchenPrinter, "id">
): Promise<KitchenPrinter> {
  await delay(250);
  const p: KitchenPrinter = { ...payload, id: `kp-${Date.now()}` };
  printers = [...printers, p];
  return p;
}

export async function updateKitchenPrinter(
  id: string,
  payload: Partial<Omit<KitchenPrinter, "id">>
): Promise<KitchenPrinter> {
  await delay(200);
  printers = printers.map((p) => (p.id === id ? { ...p, ...payload } : p));
  return printers.find((p) => p.id === id)!;
}

export async function deleteKitchenPrinter(id: string): Promise<void> {
  await delay(200);
  printers = printers.filter((p) => p.id !== id);
}

// ── Kitchen ticket printing ───────────────────────────────────────────────────

/**
 * Builds the kitchen ticket HTML and triggers window.print().
 * Uses a hidden iframe so the main window styles are not affected.
 */
export function printKitchenTicket(data: KitchenTicketData): void {
  const { orderNumber, tableName, guestCount, timestamp, cashierName, items, notes } = data;

  const groupedByCourse = items.reduce<Record<string, CartItem[]>>((acc, item) => {
    const course = item.course ?? "no-course";
    if (!acc[course]) acc[course] = [];
    acc[course].push(item);
    return acc;
  }, {});

  const courseLabel: Record<string, string> = {
    "course-starter": "STARTER",
    "course-main":    "MAIN",
    "course-dessert": "DESSERT",
    "no-course":      "ALL ITEMS",
  };

  const courseRows = Object.entries(groupedByCourse)
    .map(([courseId, courseItems]) => {
      const rows = courseItems
        .map(
          (item) => `
          <tr>
            <td style="font-size:22px;font-weight:900;padding:4px 8px;">${item.quantity}×</td>
            <td style="font-size:18px;padding:4px 8px;">${item.product.name}${item.note ? `<br/><span style="font-size:14px;font-style:italic;">↳ ${item.note}</span>` : ""}</td>
          </tr>`
        )
        .join("");

      return `
        <div style="margin-bottom:16px;">
          <div style="font-size:13px;font-weight:700;letter-spacing:0.08em;border-bottom:2px dashed #000;padding-bottom:4px;margin-bottom:8px;">
            ── ${courseLabel[courseId] ?? courseId.toUpperCase()} ──
          </div>
          <table style="width:100%;border-collapse:collapse;">${rows}</table>
        </div>`;
    })
    .join("");

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>Kitchen Ticket</title>
  <style>
    @media print { @page { margin: 8mm; } }
    body { font-family: 'Courier New', monospace; margin: 0; padding: 0; color: #000; }
    .ticket { max-width: 280px; margin: 0 auto; padding: 8px; }
    .header { text-align: center; border-bottom: 3px solid #000; padding-bottom: 10px; margin-bottom: 12px; }
    .header h1 { font-size: 20px; margin: 0; letter-spacing: 0.1em; }
    .meta { font-size: 13px; margin-bottom: 4px; }
    .meta strong { font-weight: 900; }
    .notes { font-size: 13px; border: 2px solid #000; padding: 6px; margin-top: 12px; }
  </style>
</head>
<body>
  <div class="ticket">
    <div class="header">
      <h1>KITCHEN TICKET</h1>
      <div style="font-size:16px;font-weight:900;">ORDER #${orderNumber}</div>
      ${tableName ? `<div style="font-size:18px;font-weight:900;margin-top:4px;">TABLE: ${tableName}</div>` : "<div style='font-size:14px;'>TAKE AWAY</div>"}
    </div>
    <div class="meta"><strong>Time:</strong> ${new Date(timestamp).toLocaleTimeString()}</div>
    ${guestCount ? `<div class="meta"><strong>Guests:</strong> ${guestCount}</div>` : ""}
    <div class="meta"><strong>Cashier:</strong> ${cashierName}</div>
    <hr style="border:1px dashed #000;margin:10px 0;"/>
    ${courseRows}
    ${notes ? `<div class="notes"><strong>Notes:</strong> ${notes}</div>` : ""}
  </div>
</body>
</html>`;

  // Print via a hidden iframe
  const iframe = document.createElement("iframe");
  iframe.style.cssText = "position:fixed;left:-9999px;top:-9999px;width:1px;height:1px;";
  document.body.appendChild(iframe);
  iframe.contentDocument!.open();
  iframe.contentDocument!.write(html);
  iframe.contentDocument!.close();
  iframe.contentWindow!.focus();
  iframe.contentWindow!.print();
  setTimeout(() => document.body.removeChild(iframe), 2000);
}

/** Returns mock "sent to kitchen" confirmation */
export async function sendToKitchen(data: KitchenTicketData): Promise<{ sentAt: string }> {
  await delay(300);
  return { sentAt: new Date().toISOString() };
}
