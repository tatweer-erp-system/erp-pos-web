import { useState, useCallback } from "react";
import { theme as antTheme } from "antd";
import { LockOutlined } from "@ant-design/icons";
import { apiValidatePIN, apiRecordLogin } from "../../services/cashierAuthService";
import { usePOSStore } from "../../store/posStore";
import { PINPad } from "./PINPad";
import { useAppSettings } from "@/contexts/AppSettingsContext";
import { usePOSTranslations } from "../../i18n/translations";

const attemptsKey = (id: string) => `pos-lock-attempts-${id}`;

export function LockScreen() {
  const { token } = antTheme.useToken();
  const { language } = useAppSettings();
  const t = usePOSTranslations(language);
  const isRTL = language === "ar";
  const cashierSession = usePOSStore((s) => s.cashierSession);
  const unlockSession  = usePOSStore((s) => s.unlockSession);
  const posSettings    = usePOSStore((s) => s.posSessionSettings);

  const maxAttempts = posSettings.maxPINAttempts;

  const storedAttempts = (() => {
    if (!cashierSession) return 0;
    try { return parseInt(localStorage.getItem(attemptsKey(cashierSession.cashierId)) ?? "0", 10); }
    catch { return 0; }
  })();

  const [pinError,    setPinError]    = useState<string | null>(
    storedAttempts >= maxAttempts ? t.tooManyAttempts : null
  );
  const [pinResetKey, setPinResetKey] = useState(0);
  const [attempts,    setAttempts]    = useState(storedAttempts);
  const [hardLocked,  setHardLocked]  = useState(storedAttempts >= maxAttempts);
  const [validating,  setValidating]  = useState(false);

  const handlePIN = useCallback(
    async (pin: string) => {
      if (!cashierSession || hardLocked || validating) return;
      setValidating(true);

      const ok = await apiValidatePIN(cashierSession.cashierId, pin);

      if (ok) {
        localStorage.removeItem(attemptsKey(cashierSession.cashierId));
        setPinError(null);
        unlockSession();
      } else {
        const next = attempts + 1;
        setAttempts(next);
        localStorage.setItem(attemptsKey(cashierSession.cashierId), String(next));
        if (next >= maxAttempts) {
          setHardLocked(true);
          setPinError(t.tooManyAttempts);
        } else {
          setPinError(`${t.incorrectPIN}. ${t.attempts(maxAttempts - next)} remaining.`);
        }
        setPinResetKey((k) => k + 1);
      }

      setValidating(false);
    },
    [cashierSession, attempts, hardLocked, validating, maxAttempts, unlockSession]
  );

  const initials = cashierSession?.cashierName
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("") ?? "??";

  return (
    <div dir={isRTL ? "rtl" : "ltr"} style={{
      position: "fixed",
      inset: 0,
      zIndex: 8000,
      background: "rgba(0,0,0,0.72)",
      backdropFilter: "blur(6px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 24,
    }}>
      <div style={{
        background: token.colorBgContainer,
        borderRadius: 20,
        padding: "36px 40px 32px",
        width: "100%",
        maxWidth: 340,
        textAlign: "center",
        boxShadow: "0 24px 64px rgba(0,0,0,0.35)",
        border: `1px solid ${token.colorBorderSecondary}`,
      }}>

        {/* Lock icon */}
        <div style={{
          width: 52, height: 52, borderRadius: "50%", margin: "0 auto 16px",
          background: `${token.colorPrimary}15`,
          border: `2px solid ${token.colorPrimary}30`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 22, color: token.colorPrimary,
        }}>
          <LockOutlined />
        </div>

        <div style={{ fontSize: 18, fontWeight: 800, color: token.colorText, marginBottom: 4 }}>
          {t.terminalLocked}
        </div>
        <div style={{ fontSize: 12, color: token.colorTextSecondary, marginBottom: 24 }}>
          {t.reenterPIN}
        </div>

        {/* Cashier badge */}
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          background: `${token.colorPrimary}10`,
          border: `1px solid ${token.colorPrimary}25`,
          borderRadius: 10,
          padding: "8px 14px",
          marginBottom: 28,
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: "50%",
            background: `linear-gradient(135deg, ${token.colorPrimary}, ${token.colorPrimary}cc)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontSize: 12, fontWeight: 800,
          }}>
            {initials}
          </div>
          <div style={{ textAlign: isRTL ? "end" : "start" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: token.colorText }}>
              {cashierSession?.cashierName}
            </div>
            <div style={{ fontSize: 11, color: token.colorTextSecondary }}>
              {cashierSession?.cashierRole === "manager"
                ? t.managerRole
                : cashierSession?.cashierRole === "senior_cashier"
                ? "Senior Cashier"
                : "Cashier"}
            </div>
          </div>
        </div>

        <PINPad
          onComplete={handlePIN}
          error={pinError}
          loading={hardLocked || validating}
          resetKey={pinResetKey}
        />
      </div>
    </div>
  );
}
