import { Button, Tag, Tooltip, theme as antTheme } from "antd";
import { CloseOutlined, PhoneOutlined, StarOutlined, TrophyOutlined } from "@ant-design/icons";
import { usePOSStore } from "../../store/posStore";
import { getTier } from "../../data/mockCustomers";
import { useAppSettings } from "@/contexts/AppSettingsContext";
import { usePOSTranslations } from "../../i18n/translations";

export function CustomerCard() {
  const { token } = antTheme.useToken();
  const { language } = useAppSettings();
  const t = usePOSTranslations(language);
  const attachedCustomer = usePOSStore((s) => s.attachedCustomer);
  const setAttachedCustomer = usePOSStore((s) => s.setAttachedCustomer);
  const pointsEarned = usePOSStore((s) => s.pointsEarned);

  if (!attachedCustomer) return null;

  const tier = getTier(attachedCustomer.loyaltyPoints);
  const willEarn = pointsEarned();

  return (
    <div style={{
      borderRadius: 10,
      border: `1.5px solid ${tier.color}40`,
      background: `linear-gradient(135deg, ${tier.color}08, ${tier.color}14)`,
      padding: "10px 12px",
      display: "flex",
      alignItems: "center",
      gap: 10,
    }}>
      {/* Avatar */}
      <div style={{
        width: 38,
        height: 38,
        borderRadius: "50%",
        background: `linear-gradient(135deg, ${tier.color}44, ${tier.color}99)`,
        border: `2px solid ${tier.color}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 15,
        fontWeight: 900,
        color: token.colorText,
        flexShrink: 0,
      }}>
        {attachedCustomer.name.charAt(0).toUpperCase()}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: token.colorText, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {attachedCustomer.name}
          </span>
          <Tag
            icon={<TrophyOutlined />}
            style={{
              fontSize: 10,
              lineHeight: "18px",
              padding: "0 6px",
              border: `1px solid ${tier.color}40`,
              background: `${tier.color}18`,
              color: tier.color,
              fontWeight: 700,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
            }}
          >
            {tier.name}
          </Tag>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 3, flexWrap: "wrap" }}>
          <span style={{ fontSize: 11, color: token.colorTextSecondary, display: "flex", alignItems: "center", gap: 3 }}>
            <PhoneOutlined style={{ fontSize: 9 }} />
            {attachedCustomer.phone}
          </span>
          <span style={{ fontSize: 11, color: token.colorTextSecondary, display: "flex", alignItems: "center", gap: 3 }}>
            <StarOutlined style={{ fontSize: 9, color: "#F59E0B" }} />
            <span style={{ fontWeight: 600 }}>{attachedCustomer.loyaltyPoints.toLocaleString()}</span> pts balance
          </span>
          {willEarn > 0 && (
            <span style={{
              fontSize: 10,
              color: "#10B981",
              fontWeight: 700,
              background: "#10B98112",
              border: "1px solid #10B98130",
              borderRadius: 6,
              padding: "1px 6px",
            }}>
              +{willEarn} pts to earn
            </span>
          )}
        </div>
      </div>

      {/* Detach button */}
      <Tooltip title={t.detach}>
        <Button
          type="text"
          size="small"
          icon={<CloseOutlined />}
          onClick={() => setAttachedCustomer(null)}
          style={{
            width: 26,
            height: 26,
            padding: 0,
            borderRadius: 6,
            color: token.colorTextTertiary,
            flexShrink: 0,
          }}
        />
      </Tooltip>
    </div>
  );
}
