import { useState, useEffect } from "react";
import { theme as antTheme } from "antd";
import { DeleteOutlined, CheckOutlined } from "@ant-design/icons";

const shakeKeyframes = `
@keyframes pin-shake {
  0%,100% { transform: translateX(0); }
  15%      { transform: translateX(-8px); }
  30%      { transform: translateX(8px); }
  45%      { transform: translateX(-6px); }
  60%      { transform: translateX(6px); }
  75%      { transform: translateX(-3px); }
  90%      { transform: translateX(3px); }
}
`;

interface PINPadProps {
  /** Called once 4 digits are entered */
  onComplete: (pin: string) => void;
  /** Displays shake + error message when set */
  error?: string | null;
  loading?: boolean;
  /** Reset the internal pin state when this key changes */
  resetKey?: number;
  maxLength?: number;
}

const DIGITS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "back"];

export function PINPad({ onComplete, error, loading, resetKey, maxLength = 4 }: PINPadProps) {
  const { token } = antTheme.useToken();
  const [pin, setPin] = useState("");
  const [shaking, setShaking] = useState(false);

  // Clear pin on resetKey change or error
  useEffect(() => {
    setPin("");
  }, [resetKey]);

  useEffect(() => {
    if (error) {
      setShaking(true);
      setPin("");
      const t = setTimeout(() => setShaking(false), 600);
      return () => clearTimeout(t);
    }
  }, [error]);

  function pressDigit(d: string) {
    if (loading) return;
    if (pin.length >= maxLength) return;
    const next = pin + d;
    setPin(next);
    if (next.length === maxLength) {
      // Small delay so last dot fills before callback
      setTimeout(() => onComplete(next), 80);
    }
  }

  function pressBack() {
    setPin((p) => p.slice(0, -1));
  }

  return (
    <>
      <style>{shakeKeyframes}</style>

      {/* Dot indicators */}
      <div style={{
        display: "flex",
        justifyContent: "center",
        gap: 14,
        marginBottom: 20,
        animation: shaking ? "pin-shake 0.55s ease" : "none",
      }}>
        {Array.from({ length: maxLength }).map((_, i) => {
          const filled = i < pin.length;
          return (
            <div
              key={i}
              style={{
                width: 14,
                height: 14,
                borderRadius: "50%",
                border: `2px solid ${filled ? token.colorPrimary : token.colorBorderSecondary}`,
                background: filled ? token.colorPrimary : "transparent",
                transition: "all 0.12s ease",
                transform: filled ? "scale(1.15)" : "scale(1)",
              }}
            />
          );
        })}
      </div>

      {/* Error message */}
      <div style={{
        height: 18,
        textAlign: "center",
        fontSize: 12,
        color: "#EF4444",
        fontWeight: 600,
        marginBottom: 16,
        opacity: error ? 1 : 0,
        transition: "opacity 0.2s",
      }}>
        {error || " "}
      </div>

      {/* Digit grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 10,
        maxWidth: 240,
        margin: "0 auto",
      }}>
        {DIGITS.map((d, i) => {
          if (d === "") return <div key={i} />;

          const isBack = d === "back";
          return (
            <button
              key={d}
              onClick={isBack ? pressBack : () => pressDigit(d)}
              disabled={loading || (isBack && pin.length === 0)}
              style={{
                height: 56,
                borderRadius: 12,
                border: `1.5px solid ${token.colorBorderSecondary}`,
                background: isBack ? token.colorFillAlter : token.colorBgContainer,
                cursor: loading || (isBack && pin.length === 0) ? "default" : "pointer",
                fontSize: isBack ? 18 : 22,
                fontWeight: 700,
                color: isBack
                  ? (pin.length === 0 ? token.colorTextTertiary : token.colorTextSecondary)
                  : token.colorText,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.1s",
                opacity: loading ? 0.5 : 1,
                boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
              }}
              onMouseDown={(e) => {
                if (!loading) (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.94)";
              }}
              onMouseUp={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
              }}
            >
              {isBack ? <DeleteOutlined /> : d}
            </button>
          );
        })}
      </div>
    </>
  );
}
