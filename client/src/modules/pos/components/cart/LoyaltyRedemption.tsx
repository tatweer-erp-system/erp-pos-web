import { useState } from "react";
import { Switch, InputNumber, theme as antTheme, Tooltip } from "antd";
import { GiftOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { usePOSStore } from "../../store/posStore";
import { getTier } from "../../data/mockCustomers";
import { useAppSettings } from "@/contexts/AppSettingsContext";
import { usePOSTranslations } from "../../i18n/translations";

export function LoyaltyRedemption() {
  const { token } = antTheme.useToken();
  const { language } = useAppSettings();
  const t = usePOSTranslations(language);
  const attachedCustomer = usePOSStore(s => s.attachedCustomer);
  const redeemPoints = usePOSStore(s => s.redeemPoints);
  const setRedeemPoints = usePOSStore(s => s.setRedeemPoints);
  const redeemRatio = usePOSStore(s => s.redeemRatio);

  const [enabled, setEnabled] = useState(false);

  if (!attachedCustomer || attachedCustomer.loyaltyPoints === 0) return null;

  const tier = getTier(attachedCustomer.loyaltyPoints);
  const ratio = redeemRatio();
  const maxPoints = attachedCustomer.loyaltyPoints;
  const redeemValue = redeemPoints * ratio;

  function handleToggle(on: boolean) {
    setEnabled(on);
    if (!on) setRedeemPoints(0);
  }

  return (
    <div
      style={{
        borderRadius: 10,
        border: `1.5px solid ${enabled ? "#F59E0B50" : token.colorBorderSecondary}`,
        background: enabled ? "#F59E0B08" : token.colorFillAlter,
        padding: "10px 12px",
        transition: "all 0.18s",
      }}
    >
      {/* Toggle row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <GiftOutlined style={{ color: "#F59E0B", fontSize: 14 }} />
          <span
            style={{ fontSize: 12, fontWeight: 600, color: token.colorText }}
          >
            {t.redeemLoyaltyPoints}
          </span>
          <Tooltip title={t.loyaltyTooltip}>
            <QuestionCircleOutlined
              style={{ fontSize: 11, color: token.colorTextTertiary }}
            />
          </Tooltip>
        </div>
        <Switch
          size="small"
          checked={enabled}
          onChange={handleToggle}
          style={{ background: enabled ? "#F59E0B" : undefined }}
        />
      </div>

      {/* Redemption input */}
      {enabled && (
        <div
          style={{
            marginTop: 10,
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span
              style={{
                fontSize: 11,
                color: token.colorTextSecondary,
                flexShrink: 0,
                width: 72,
              }}
            >
              {t.pointsToUse}
            </span>
            <InputNumber
              style={{ flex: 1, borderRadius: 8 }}
              min={0}
              max={maxPoints}
              value={redeemPoints}
              onChange={v => setRedeemPoints(v ?? 0)}
              precision={0}
              addonAfter={
                <span
                  style={{
                    fontSize: 10,
                    cursor: "pointer",
                    color: token.colorPrimary,
                  }}
                  onClick={() => setRedeemPoints(maxPoints)}
                >
                  {t.max}
                </span>
              }
            />
          </div>

          {redeemPoints > 0 && (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "6px 10px",
                borderRadius: 8,
                background: "#F59E0B10",
                border: "1px solid #F59E0B30",
              }}
            >
              <span style={{ fontSize: 11, color: token.colorTextSecondary }}>
                {redeemPoints.toLocaleString()} pts × ${ratio.toFixed(2)} =
              </span>
              <span style={{ fontSize: 13, fontWeight: 800, color: "#F59E0B" }}>
                −${redeemValue.toFixed(2)}
              </span>
            </div>
          )}

          <div style={{ fontSize: 10, color: token.colorTextTertiary }}>
            Remaining after redemption:{" "}
            <strong>{(maxPoints - redeemPoints).toLocaleString()} pts</strong>
          </div>
        </div>
      )}
    </div>
  );
}
