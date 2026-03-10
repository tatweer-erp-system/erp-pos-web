import { useState, useCallback, useEffect } from "react";
import { Modal, Tag, theme as antTheme } from "antd";
import {
  SafetyOutlined,
  WarningOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { getManagers, apiValidatePIN, getCashier } from "../../services/cashierAuthService";
import { usePOSStore } from "../../store/posStore";
import { PINPad } from "./PINPad";

export interface OverrideRequest {
  reason: string;
  action: string;
  onApprove: (managerName: string) => void;
  onDeny: () => void;
}

interface Props {
  request: OverrideRequest | null;
  onClose: () => void;
}

export function ManagerOverrideModal({ request, onClose }: Props) {
  const { token } = antTheme.useToken();
  const addOverrideLog  = usePOSStore((s) => s.addOverrideLog);
  const posSettings     = usePOSStore((s) => s.posSessionSettings);
  const cashierSession  = usePOSStore((s) => s.cashierSession);

  const managers = getManagers();

  const [selectedManagerId, setSelectedManagerId] = useState<string | null>(null);
  const [pinError,    setPinError]    = useState<string | null>(null);
  const [pinResetKey, setPinResetKey] = useState(0);
  const [attempts,    setAttempts]    = useState(0);
  const [approved,    setApproved]    = useState(false);
  const [validating,  setValidating]  = useState(false);

  // Reset when opening
  useEffect(() => {
    if (request) {
      setSelectedManagerId(managers.length === 1 ? managers[0].id : null);
      setPinError(null);
      setPinResetKey((k) => k + 1);
      setAttempts(0);
      setApproved(false);
    }
  }, [request]);

  const handlePIN = useCallback(
    async (pin: string) => {
      if (!selectedManagerId || !request || validating) return;
      setValidating(true);

      const ok = await apiValidatePIN(selectedManagerId, pin);

      if (ok) {
        const manager = getCashier(selectedManagerId);
        const managerName = manager?.name ?? "Manager";

        addOverrideLog({
          managerName,
          reason: request.reason,
          action: request.action,
          timestamp: new Date(),
        });

        setApproved(true);
        setTimeout(() => {
          request.onApprove(managerName);
          onClose();
        }, 800);
      } else {
        const next = attempts + 1;
        setAttempts(next);
        if (next >= posSettings.maxPINAttempts) {
          setPinError("Too many failed attempts. Override denied.");
          setTimeout(() => {
            request.onDeny();
            onClose();
          }, 1500);
        } else {
          setPinError(`Incorrect PIN. ${posSettings.maxPINAttempts - next} attempt${posSettings.maxPINAttempts - next !== 1 ? "s" : ""} left.`);
        }
        setPinResetKey((k) => k + 1);
      }

      setValidating(false);
    },
    [selectedManagerId, request, attempts, validating, posSettings.maxPINAttempts, addOverrideLog, onClose]
  );

  function handleClose() {
    request?.onDeny();
    onClose();
  }

  return (
    <Modal
      open={!!request}
      onCancel={handleClose}
      closeIcon={null}
      footer={null}
      width={400}
      centered
      title={null}
      style={{ padding: 0 }}
    >
      {/* Header */}
      <div style={{
        position: "relative",
        background: `linear-gradient(135deg, #F59E0B, #F59E0Bcc)`,
        padding: "20px 24px 16px",
        borderRadius: "8px 8px 0 0",
        color: "#fff",
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
      }}>
        <WarningOutlined style={{ fontSize: 26, flexShrink: 0, marginTop: 2 }} />
        <div>
          <div style={{ fontSize: 16, fontWeight: 800 }}>Manager Override Required</div>
          <div style={{ fontSize: 12, opacity: 0.9, marginTop: 2 }}>
            This action requires manager authorization
          </div>
        </div>
        <button
          onClick={handleClose}
          style={{
            position: "absolute",
            top: 14,
            insetInlineEnd: 14,
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.2)",
            border: "1px solid rgba(255,255,255,0.3)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontSize: 13,
            lineHeight: 1,
            transition: "background 0.15s",
            padding: 0,
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.35)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.2)"; }}
        >
          ✕
        </button>
      </div>

      <div style={{ padding: "20px 24px 24px" }}>

        {/* Reason */}
        <div style={{
          padding: "12px 14px",
          borderRadius: 10,
          background: "#F59E0B08",
          border: "1px solid #F59E0B30",
          marginBottom: 20,
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#92400E", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>
            Reason
          </div>
          <div style={{ fontSize: 13, color: token.colorText, lineHeight: 1.5 }}>
            {request?.reason}
          </div>
          <div style={{ marginTop: 8 }}>
            <Tag color="warning" style={{ borderRadius: 6, fontSize: 10, fontWeight: 700 }}>
              {request?.action}
            </Tag>
          </div>
        </div>

        {/* Manager select (if multiple managers) */}
        {managers.length > 1 && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: token.colorTextSecondary, marginBottom: 8 }}>
              Select Manager
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {managers.map((m) => (
                <div
                  key={m.id}
                  onClick={() => { setSelectedManagerId(m.id); setPinError(null); setPinResetKey(k => k+1); setAttempts(0); }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "8px 12px",
                    borderRadius: 10,
                    border: `1.5px solid ${selectedManagerId === m.id ? token.colorPrimary : token.colorBorderSecondary}`,
                    background: selectedManagerId === m.id ? `${token.colorPrimary}08` : token.colorBgContainer,
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                >
                  <div style={{
                    width: 28, height: 28, borderRadius: "50%",
                    background: m.color,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#fff", fontSize: 11, fontWeight: 800,
                  }}>
                    {m.initials}
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 600, color: token.colorText }}>{m.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Approved state */}
        {approved ? (
          <div style={{
            textAlign: "center",
            padding: "24px 0",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 10,
          }}>
            <CheckCircleOutlined style={{ fontSize: 40, color: "#10B981" }} />
            <div style={{ fontSize: 15, fontWeight: 700, color: "#10B981" }}>
              Override Approved
            </div>
          </div>
        ) : (
          selectedManagerId && (
            <>
              <div style={{ fontSize: 13, color: token.colorTextSecondary, textAlign: "center", marginBottom: 16 }}>
                Manager PIN required
              </div>
              <PINPad
                onComplete={handlePIN}
                error={pinError}
                loading={validating}
                resetKey={pinResetKey}
              />
            </>
          )
        )}

        {!selectedManagerId && !approved && (
          <div style={{ textAlign: "center", fontSize: 12, color: token.colorTextTertiary, padding: "12px 0" }}>
            Select a manager above to continue
          </div>
        )}

        {/* Cashier info */}
        {cashierSession && (
          <div style={{
            marginTop: 20,
            paddingTop: 14,
            borderTop: `1px solid ${token.colorBorderSecondary}`,
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: 11,
            color: token.colorTextTertiary,
          }}>
            <SafetyOutlined />
            <span>Requested by: <strong style={{ color: token.colorTextSecondary }}>{cashierSession.cashierName}</strong></span>
          </div>
        )}
      </div>
    </Modal>
  );
}
