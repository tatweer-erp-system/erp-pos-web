import { useState, useEffect } from "react";
import { AntProvider } from "@/lib/antd-provider";
import { theme as antTheme } from "antd";

const CUSTOMER_DISPLAY_KEY = "pos-customer-display";

interface DisplayItem {
  product: {
    id: string;
    name: string;
    price: number;
    color: string;
    image?: string;
  };
  quantity: number;
}

interface DisplayData {
  items: DisplayItem[];
  timestamp: number;
}

function Clock() {
  const [time, setTime] = useState(() =>
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  );
  const [date, setDate] = useState(() =>
    new Date().toLocaleDateString([], {
      weekday: "long",
      month: "long",
      day: "numeric",
    })
  );
  useEffect(() => {
    const id = setInterval(() => {
      setTime(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
      setDate(
        new Date().toLocaleDateString([], {
          weekday: "long",
          month: "long",
          day: "numeric",
        })
      );
    }, 10000);
    return () => clearInterval(id);
  }, []);
  return (
    <>
      {time}
      <span style={{ opacity: 0.55, fontSize: "0.8em", marginInlineStart: 8 }}>
        {date}
      </span>
    </>
  );
}

function CustomerDisplayInner() {
  const { token } = antTheme.useToken();
  // direction is inherited from AntProvider's dir attribute
  const [data, setData] = useState<DisplayData | null>(null);

  useEffect(() => {
    function readFromStorage() {
      try {
        const raw = localStorage.getItem(CUSTOMER_DISPLAY_KEY);
        if (raw) setData(JSON.parse(raw));
      } catch {
        // ignore
      }
    }
    readFromStorage();

    function onStorage(e: StorageEvent) {
      if (e.key === CUSTOMER_DISPLAY_KEY) readFromStorage();
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const items = data?.items ?? [];
  const subtotal = items.reduce((s, i) => s + i.product.price * i.quantity, 0);
  const tax = subtotal * 0.15;
  const total = subtotal + tax;
  const isEmpty = items.length === 0;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        overflow: "hidden",
        background: token.colorBgLayout,
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      {/* ── Header ── */}
      <div
        style={{
          background: `linear-gradient(135deg, ${token.colorPrimary} 0%, ${token.colorPrimary}cc 100%)`,
          padding: "16px 28px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
          boxShadow: `0 4px 20px ${token.colorPrimary}44`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 46,
              height: 46,
              borderRadius: 12,
              background: "rgba(255,255,255,0.2)",
              border: "1.5px solid rgba(255,255,255,0.35)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontWeight: 900,
              fontSize: 20,
            }}
          >
            T
          </div>
          <div>
            <div
              style={{
                color: "#fff",
                fontSize: 18,
                fontWeight: 800,
                lineHeight: 1.2,
              }}
            >
              Point of Sale
            </div>
            <div
              style={{
                color: "rgba(255,255,255,0.75)",
                fontSize: 12,
                marginTop: 2,
              }}
            >
              Customer Display
            </div>
          </div>
        </div>
        <div
          style={{
            color: "rgba(255,255,255,0.9)",
            fontSize: 15,
            fontWeight: 600,
            textAlign: "end",
          }}
        >
          <Clock />
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ flex: 1, overflow: "hidden", display: "flex", gap: 0 }}>
        {/* Left — Item List */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            padding: "24px 20px 24px 28px",
          }}
        >
          {isEmpty ? (
            /* Welcome / idle screen */
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 20,
                textAlign: "center",
              }}
            >
              <div
                style={{
                  width: 96,
                  height: 96,
                  borderRadius: "50%",
                  background: `${token.colorPrimary}15`,
                  border: `2px solid ${token.colorPrimary}25`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 44,
                }}
              >
                🛒
              </div>
              <div>
                <div
                  style={{
                    fontSize: 26,
                    fontWeight: 800,
                    color: token.colorText,
                    marginBottom: 8,
                  }}
                >
                  Welcome!
                </div>
                <div
                  style={{
                    fontSize: 15,
                    color: token.colorTextSecondary,
                    maxWidth: 320,
                    lineHeight: 1.6,
                  }}
                >
                  Your order details will appear here as items are added.
                </div>
              </div>
              <div
                style={{
                  marginTop: 12,
                  padding: "10px 24px",
                  borderRadius: 30,
                  background: `${token.colorPrimary}12`,
                  border: `1px solid ${token.colorPrimary}25`,
                  color: token.colorPrimary,
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                Thank you for shopping with us
              </div>
            </div>
          ) : (
            <>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: token.colorTextSecondary,
                  marginBottom: 14,
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                }}
              >
                Your Order ({items.reduce((n, i) => n + i.quantity, 0)} items)
              </div>
              <div
                style={{
                  flex: 1,
                  overflowY: "auto",
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                {items.map((item, idx) => (
                  <div
                    key={`${item.product.id}-${idx}`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                      padding: "12px 14px",
                      borderRadius: 12,
                      background: token.colorBgContainer,
                      border: `1px solid ${token.colorBorderSecondary}`,
                      transition: "transform 0.15s",
                    }}
                  >
                    {/* Product image / avatar */}
                    <div
                      style={{
                        width: 52,
                        height: 52,
                        borderRadius: 10,
                        overflow: "hidden",
                        flexShrink: 0,
                        background: `linear-gradient(135deg, ${item.product.color}22, ${item.product.color}44)`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {item.product.image ? (
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                          onError={e => {
                            (
                              e.currentTarget as HTMLImageElement
                            ).style.display = "none";
                          }}
                        />
                      ) : (
                        <span
                          style={{
                            color: item.product.color,
                            fontWeight: 800,
                            fontSize: 18,
                          }}
                        >
                          {item.product.name.charAt(0)}
                        </span>
                      )}
                    </div>

                    {/* Name */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: 14,
                          fontWeight: 600,
                          color: token.colorText,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {item.product.name}
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          color: token.colorTextSecondary,
                          marginTop: 2,
                        }}
                      >
                        ${item.product.price.toFixed(2)} × {item.quantity}
                      </div>
                    </div>

                    {/* Line total */}
                    <div
                      style={{
                        fontSize: 15,
                        fontWeight: 800,
                        color: token.colorPrimary,
                        flexShrink: 0,
                      }}
                    >
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Right — Totals Panel */}
        <div
          style={{
            width: 280,
            flexShrink: 0,
            background: token.colorBgContainer,
            borderLeft: `1px solid ${token.colorBorderSecondary}`,
            display: "flex",
            flexDirection: "column",
            padding: "24px 24px 28px",
          }}
        >
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: token.colorTextSecondary,
              marginBottom: 20,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
          >
            Order Summary
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
              flex: 1,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 14,
                color: token.colorTextSecondary,
              }}
            >
              <span>Subtotal</span>
              <span style={{ fontWeight: 600, color: token.colorText }}>
                ${subtotal.toFixed(2)}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 14,
                color: token.colorTextSecondary,
              }}
            >
              <span>Tax (15%)</span>
              <span style={{ fontWeight: 600, color: token.colorText }}>
                ${tax.toFixed(2)}
              </span>
            </div>
            <div
              style={{
                height: 1,
                background: token.colorBorderSecondary,
                margin: "4px 0",
              }}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 15,
                fontWeight: 700,
                color: token.colorText,
              }}
            >
              <span>Total</span>
              <span style={{ color: token.colorPrimary }}>
                ${total.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Amount due — large display */}
          <div
            style={{
              marginTop: "auto",
              padding: "20px 16px",
              borderRadius: 16,
              background: `linear-gradient(135deg, ${token.colorPrimary}, ${token.colorPrimary}dd)`,
              textAlign: "center",
              boxShadow: `0 8px 24px ${token.colorPrimary}44`,
            }}
          >
            <div
              style={{
                color: "rgba(255,255,255,0.8)",
                fontSize: 12,
                fontWeight: 600,
                marginBottom: 6,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              Amount Due
            </div>
            <div
              style={{
                color: "#fff",
                fontSize: 36,
                fontWeight: 900,
                lineHeight: 1,
                letterSpacing: "-0.02em",
              }}
            >
              ${total.toFixed(2)}
            </div>
          </div>

          {/* Thank you message */}
          <div
            style={{
              marginTop: 16,
              textAlign: "center",
              fontSize: 12,
              color: token.colorTextTertiary,
              lineHeight: 1.5,
            }}
          >
            Please verify your order details above.
            <br />
            Thank you for your business!
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CustomerDisplayScreen() {
  return (
    <AntProvider>
      <CustomerDisplayInner />
    </AntProvider>
  );
}
