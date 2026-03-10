import { useState, useCallback } from "react";
import { theme as antTheme, Tooltip } from "antd";
import { ArrowLeftOutlined, ArrowRightOutlined, ClockCircleOutlined, LockOutlined } from "@ant-design/icons";
import {
  getCashiers,
  apiLogin,
  type Cashier,
} from "../../services/cashierAuthService";
import { usePOSStore } from "../../store/posStore";
import { useAppSettings } from "@/contexts/AppSettingsContext";
import { PINPad } from "./PINPad";

export function CashierLoginScreen() {
  const { token } = antTheme.useToken();
  const { language } = useAppSettings();
  const isRTL = language === "ar";
  const setCashierSession = usePOSStore((s) => s.setCashierSession);
  const posSettings       = usePOSStore((s) => s.posSessionSettings);

  const cashiers = getCashiers();

  // ── State ─────────────────────────────────────────────────────────────────
  const [step, setStep]               = useState<"select" | "pin">("select");
  const [selected, setSelected]       = useState<Cashier | null>(null);
  const [pinError, setPinError]       = useState<string | null>(null);
  const [pinResetKey, setPinResetKey] = useState(0);
  const [attempts, setAttempts]       = useState(0);
  const [locked, setLocked]           = useState(false);
  const [validating, setValidating]   = useState(false);

  const maxAttempts = posSettings.maxPINAttempts;

  // ── Time display ──────────────────────────────────────────────────────────
  const now = new Date();
  const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  const dateStr = now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  // ── Handlers ──────────────────────────────────────────────────────────────
  function selectCashier(cashier: Cashier) {
    if (!cashier.pinSet) return; // can't login without PIN
    setSelected(cashier);
    setStep("pin");
    setPinError(null);
    setAttempts(0);
    setLocked(false);
    setPinResetKey((k) => k + 1);
  }

  const handlePIN = useCallback(
    async (pin: string) => {
      if (!selected || locked || validating) return;
      setValidating(true);

      const result = await apiLogin(selected.id, pin, maxAttempts);

      if (result.success) {
        setCashierSession({
          cashierId:   selected.id,
          cashierName: selected.name,
          cashierRole: selected.role,
          loginTime:   new Date(),
          isLocked:    false,
        });
      } else {
        const next = attempts + 1;
        setAttempts(next);
        if (next >= maxAttempts) {
          setLocked(true);
          setPinError("Too many attempts. This terminal is locked.");
        } else {
          setPinError(`Incorrect PIN. ${maxAttempts - next} attempt${maxAttempts - next !== 1 ? "s" : ""} remaining.`);
        }
        setPinResetKey((k) => k + 1);
      }

      setValidating(false);
    },
    [selected, attempts, locked, validating, maxAttempts, setCashierSession]
  );

  // ── Layout helpers ────────────────────────────────────────────────────────
  function roleColor(role: Cashier["role"]) {
    if (role === "manager")       return "#A855F7";
    if (role === "senior_cashier") return "#F59E0B";
    return token.colorPrimary;
  }

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      zIndex: 9999,
      background: `linear-gradient(135deg, ${token.colorBgLayout} 0%, ${token.colorBgContainer} 100%)`,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: 24,
      overflow: "auto",
    }}>

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{
          width: 56, height: 56, borderRadius: 16, margin: "0 auto 12px",
          background: `linear-gradient(135deg, ${token.colorPrimary}, ${token.colorPrimary}cc)`,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#fff", fontSize: 24, fontWeight: 900,
          boxShadow: `0 8px 24px ${token.colorPrimary}40`,
        }}>
          T
        </div>
        <div style={{ fontSize: 22, fontWeight: 800, color: token.colorText }}>
          Point of Sale
        </div>
        <div style={{ fontSize: 13, color: token.colorTextSecondary, marginTop: 4 }}>
          Terminal 1 · Main Branch
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 8, color: token.colorTextTertiary, fontSize: 12 }}>
          <ClockCircleOutlined />
          <span>{timeStr} · {dateStr}</span>
        </div>
      </div>

      {/* ── Step 1: Select cashier ── */}
      {step === "select" && (
        <div style={{ width: "100%", maxWidth: 520 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: token.colorText, textAlign: "center", marginBottom: 20 }}>
            Who are you?
          </div>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))",
            gap: 12,
          }}>
            {cashiers.map((c) => {
              const hasPin = c.pinSet;
              return (
                <Tooltip
                  key={c.id}
                  title={!hasPin ? "No PIN set — contact manager" : c.lastLogin ? `Last login: ${c.lastLogin}` : undefined}
                >
                  <div
                    onClick={() => hasPin && selectCashier(c)}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      padding: "16px 12px",
                      borderRadius: 14,
                      border: `1.5px solid ${hasPin ? token.colorBorderSecondary : token.colorFillSecondary}`,
                      background: hasPin ? token.colorBgContainer : token.colorFillAlter,
                      cursor: hasPin ? "pointer" : "not-allowed",
                      opacity: hasPin ? 1 : 0.5,
                      transition: "all 0.15s",
                      gap: 10,
                    }}
                    onMouseEnter={(e) => {
                      if (!hasPin) return;
                      (e.currentTarget as HTMLElement).style.borderColor = c.color;
                      (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 16px ${c.color}30`;
                      (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = token.colorBorderSecondary;
                      (e.currentTarget as HTMLElement).style.boxShadow = "none";
                      (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                    }}
                  >
                    {/* Avatar */}
                    <div style={{
                      width: 52, height: 52, borderRadius: "50%",
                      background: `linear-gradient(135deg, ${c.color}, ${c.color}cc)`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "#fff", fontSize: 18, fontWeight: 800,
                      boxShadow: `0 4px 12px ${c.color}40`,
                    }}>
                      {c.initials}
                    </div>

                    {/* Name */}
                    <div style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: token.colorText,
                      textAlign: "center",
                      lineHeight: 1.3,
                    }}>
                      {c.name.split(" ")[0]}
                      <br />
                      <span style={{ fontWeight: 400, color: token.colorTextSecondary }}>
                        {c.name.split(" ").slice(1).join(" ")}
                      </span>
                    </div>

                    {/* Role badge */}
                    <div style={{
                      fontSize: 9,
                      fontWeight: 700,
                      color: roleColor(c.role),
                      background: `${roleColor(c.role)}15`,
                      padding: "2px 7px",
                      borderRadius: 6,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}>
                      {c.roleLabel}
                    </div>

                    {!hasPin && (
                      <LockOutlined style={{ fontSize: 12, color: token.colorTextTertiary }} />
                    )}
                  </div>
                </Tooltip>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Step 2: PIN entry ── */}
      {step === "pin" && selected && (
        <div style={{ width: "100%", maxWidth: 300, textAlign: "center" }}>

          {/* Back button */}
          <button
            onClick={() => { setStep("select"); setSelected(null); setPinError(null); }}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              background: "transparent", border: "none", cursor: "pointer",
              color: token.colorTextSecondary, fontSize: 13,
              marginBottom: 24, padding: "4px 8px", borderRadius: 8,
            }}
          >
            {isRTL ? <ArrowRightOutlined style={{ fontSize: 11 }} /> : <ArrowLeftOutlined style={{ fontSize: 11 }} />} {isRTL ? "رجوع" : "Back"}
          </button>

          {/* Cashier avatar */}
          <div style={{ marginBottom: 20 }}>
            <div style={{
              width: 64, height: 64, borderRadius: "50%", margin: "0 auto 10px",
              background: `linear-gradient(135deg, ${selected.color}, ${selected.color}cc)`,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontSize: 22, fontWeight: 800,
              boxShadow: `0 6px 20px ${selected.color}50`,
            }}>
              {selected.initials}
            </div>
            <div style={{ fontSize: 16, fontWeight: 800, color: token.colorText }}>
              {selected.name}
            </div>
            <div style={{ fontSize: 12, color: token.colorTextSecondary, marginTop: 2 }}>
              {selected.roleLabel}
            </div>
          </div>

          <div style={{ fontSize: 13, color: token.colorTextSecondary, marginBottom: 20 }}>
            {locked ? "Terminal locked. Contact manager." : "Enter your 4-digit PIN"}
          </div>

          <PINPad
            onComplete={handlePIN}
            error={pinError}
            loading={locked || validating}
            resetKey={pinResetKey}
          />
        </div>
      )}
    </div>
  );
}
