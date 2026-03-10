import { useState } from "react";
import { InputNumber, Button, theme as antTheme, Tooltip, Select, Input, Tag } from "antd";
import {
  DeleteOutlined,
  MinusOutlined,
  PlusOutlined,
  TagOutlined,
  CheckOutlined,
  CloseOutlined,
  MessageOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import type { CartItem as CartItemType, LineDiscount } from "../store/posStore";
import { getLineTotal } from "../store/posStore";
import { useAppSettings } from "@/contexts/AppSettingsContext";
import { usePOSTranslations } from "../i18n/translations";

// Common predefined modifiers — cashier can tap to quickly fill the note
const QUICK_MODIFIERS = [
  "No onions",
  "No ice",
  "Extra sauce",
  "Well done",
  "Medium rare",
  "Extra shot",
  "Soy milk",
  "Gluten-free",
];

// If note contains any of these words it gets flagged as an allergy alert
const ALLERGY_KEYWORDS = ["allergy", "allergen", "nut", "gluten", "dairy", "lactose", "vegan", "halal", "حساسية", "مكسرات", "جلوتين"];

function hasAllergyFlag(note: string) {
  const lower = note.toLowerCase();
  return ALLERGY_KEYWORDS.some((kw) => lower.includes(kw));
}

interface CartItemProps {
  item: CartItemType;
  onQuantityChange: (productId: string, qty: number) => void;
  onRemove: (productId: string) => void;
  onSetDiscount: (productId: string, discount: LineDiscount | undefined) => void;
  onSetNote: (productId: string, note: string) => void;
  isMobile: boolean;
}

export function CartItem({ item, onQuantityChange, onRemove, onSetDiscount, onSetNote, isMobile }: CartItemProps) {
  const { token } = antTheme.useToken();
  const { language } = useAppSettings();
  const t = usePOSTranslations(language);
  const [hovered, setHovered] = useState(false);
  const [showDiscount, setShowDiscount] = useState(!!item.lineDiscount?.value);
  const [discType, setDiscType] = useState<"percent" | "fixed">(item.lineDiscount?.type ?? "percent");
  const [discValue, setDiscValue] = useState<number>(item.lineDiscount?.value ?? 0);
  const [showNote, setShowNote] = useState(false);
  const [noteValue, setNoteValue] = useState(item.note ?? "");

  const rawTotal = item.product.price * item.quantity;
  const lineTotal = getLineTotal(item);
  const hasDiscount = !!item.lineDiscount && item.lineDiscount.value > 0;
  const hasNote = !!item.note && item.note.trim().length > 0;
  const isAllergy = hasNote && hasAllergyFlag(item.note!);

  function applyDiscount() {
    if (discValue > 0) {
      onSetDiscount(item.product.id, { type: discType, value: discValue });
    } else {
      onSetDiscount(item.product.id, undefined);
    }
    setShowDiscount(false);
  }

  function removeDiscount() {
    onSetDiscount(item.product.id, undefined);
    setDiscValue(0);
    setDiscType("percent");
    setShowDiscount(false);
  }

  function saveNote() {
    onSetNote(item.product.id, noteValue.trim());
    setShowNote(false);
  }

  function clearNote() {
    setNoteValue("");
    onSetNote(item.product.id, "");
    setShowNote(false);
  }

  function applyModifier(mod: string) {
    const current = noteValue.trim();
    const next = current ? `${current}, ${mod}` : mod;
    setNoteValue(next);
  }

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: 10,
        background: hovered ? token.colorFillAlter : "transparent",
        border: `1px solid ${isAllergy ? "#F59E0B60" : hovered ? token.colorBorderSecondary : "transparent"}`,
        transition: "all 0.15s",
        overflow: "hidden",
      }}
    >
      <div style={{ padding: "8px 10px" }}>
        {/* Top row: icon + name + line total */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {/* Product color dot */}
          <div style={{
            width: 28, height: 28, borderRadius: 7,
            background: `linear-gradient(135deg, ${item.product.color}, ${item.product.color}bb)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontSize: 11, fontWeight: 800, flexShrink: 0,
          }}>
            {item.product.name.charAt(0)}
          </div>

          {/* Name + unit price */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: 12, fontWeight: 600, color: token.colorText,
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", lineHeight: 1.3,
            }}>
              {item.product.name}
              {isAllergy && (
                <span style={{ marginLeft: 5, fontSize: 10, color: "#D97706", fontWeight: 700 }}>
                  {t.allergyFlag}
                </span>
              )}
            </div>
            <div style={{ fontSize: 11, color: token.colorTextSecondary, marginTop: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              ${item.product.price.toFixed(2)} / {item.product.unit}
              {hasNote && !isAllergy && (
                <span style={{ marginLeft: 6, color: token.colorTextTertiary, fontStyle: "italic" }}>
                  · {item.note}
                </span>
              )}
            </div>
            {hasNote && isAllergy && (
              <div style={{ fontSize: 10, color: "#D97706", marginTop: 2, fontStyle: "italic", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {item.note}
              </div>
            )}
          </div>

          {/* Line total */}
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            {hasDiscount ? (
              <>
                <div style={{ fontSize: 10, color: token.colorTextTertiary, textDecoration: "line-through", lineHeight: 1.2 }}>
                  ${rawTotal.toFixed(2)}
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: token.colorSuccess }}>
                  ${lineTotal.toFixed(2)}
                </div>
              </>
            ) : (
              <div style={{ fontSize: 13, fontWeight: 700, color: token.colorText }}>
                ${lineTotal.toFixed(2)}
              </div>
            )}
          </div>
        </div>

        {/* Bottom row: qty controls + action buttons */}
        <div style={{ display: "flex", alignItems: "center", marginTop: 6, paddingLeft: 36 }}>
          {/* Quantity controls */}
          <div style={{
            display: "flex", alignItems: "center", gap: 0,
            background: token.colorFillAlter,
            borderRadius: 6,
            border: `1px solid ${token.colorBorderSecondary}`,
            overflow: "hidden",
          }}>
            <button
              onClick={() => onQuantityChange(item.product.id, item.quantity - 1)}
              style={{
                width: 26, height: 24, border: "none",
                background: "transparent", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: token.colorTextSecondary, fontSize: 10,
              }}
            >
              <MinusOutlined />
            </button>
            <span style={{
              minWidth: 28, textAlign: "center", fontSize: 12, fontWeight: 700,
              color: token.colorText, lineHeight: "24px",
              borderInline: `1px solid ${token.colorBorderSecondary}`,
            }}>
              {item.quantity}
            </span>
            <button
              onClick={() => onQuantityChange(item.product.id, item.quantity + 1)}
              disabled={item.quantity >= item.product.stock}
              style={{
                width: 26, height: 24, border: "none",
                background: "transparent",
                cursor: item.quantity >= item.product.stock ? "default" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: item.quantity >= item.product.stock ? token.colorTextQuaternary : token.colorTextSecondary,
                fontSize: 10,
              }}
            >
              <PlusOutlined />
            </button>
          </div>

          {/* Spacer */}
          <div style={{ flex: 1 }} />

          {/* Action buttons */}
          <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Tooltip title={hasNote ? item.note : t.itemNote}>
              <button
                onClick={() => { setNoteValue(item.note ?? ""); setShowNote((v) => !v); setShowDiscount(false); }}
                style={{
                  width: 24, height: 24, borderRadius: 6, border: "none",
                  background: "transparent", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: isAllergy ? "#D97706" : hasNote ? token.colorPrimary : token.colorTextTertiary,
                  fontSize: 12,
                  opacity: hovered || hasNote ? 1 : 0.4,
                  transition: "opacity 0.15s",
                }}
              >
                {hasNote && isAllergy ? <WarningOutlined /> : <MessageOutlined />}
              </button>
            </Tooltip>
            <Tooltip title={hasDiscount ? t.removeDiscount : t.itemDiscount}>
              <button
                onClick={() => {
                  if (hasDiscount && !showDiscount) { removeDiscount(); }
                  else { setShowDiscount((v) => !v); setShowNote(false); }
                }}
                style={{
                  width: 24, height: 24, borderRadius: 6, border: "none",
                  background: "transparent", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: hasDiscount ? token.colorSuccess : token.colorTextTertiary,
                  fontSize: 12,
                  opacity: hovered || hasDiscount ? 1 : 0.4,
                  transition: "opacity 0.15s",
                }}
              >
                <TagOutlined />
              </button>
            </Tooltip>
            <Tooltip title={t.removeItem}>
              <button
                onClick={() => onRemove(item.product.id)}
                style={{
                  width: 24, height: 24, borderRadius: 6, border: "none",
                  background: "transparent", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: token.colorError,
                  fontSize: 12,
                  opacity: hovered ? 1 : 0.4,
                  transition: "opacity 0.15s",
                }}
              >
                <DeleteOutlined />
              </button>
            </Tooltip>
          </div>
        </div>
      </div>

      {/* Item note editor */}
      {showNote && (
        <div style={{
          padding: "8px 12px 10px",
          borderTop: `1px dashed ${token.colorBorderSecondary}`,
          background: token.colorFillQuaternary,
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}>
          {/* Quick modifier chips */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            {QUICK_MODIFIERS.map((mod) => (
              <Tag
                key={mod}
                onClick={() => applyModifier(mod)}
                style={{
                  cursor: "pointer", borderRadius: 12, fontSize: 10,
                  padding: "1px 8px", lineHeight: "18px",
                  borderColor: token.colorBorderSecondary,
                  color: token.colorTextSecondary,
                  userSelect: "none",
                }}
              >
                {mod}
              </Tag>
            ))}
          </div>

          {/* Free-text input */}
          <div style={{ display: "flex", gap: 6 }}>
            <Input
              size="small"
              value={noteValue}
              onChange={(e) => setNoteValue(e.target.value)}
              placeholder={t.itemNotePlaceholder}
              onPressEnter={saveNote}
              autoFocus
              style={{ borderRadius: 6, fontSize: 12, flex: 1 }}
              prefix={<MessageOutlined style={{ color: token.colorTextTertiary, fontSize: 11 }} />}
            />
            <Button
              size="small"
              type="primary"
              icon={<CheckOutlined />}
              onClick={saveNote}
              style={{ borderRadius: 6, height: 28, width: 28, padding: 0, display: "flex", alignItems: "center", justifyContent: "center" }}
            />
            {hasNote && (
              <Button
                size="small"
                danger
                icon={<CloseOutlined />}
                onClick={clearNote}
                style={{ borderRadius: 6, height: 28, width: 28, padding: 0, display: "flex", alignItems: "center", justifyContent: "center" }}
              />
            )}
            {!hasNote && (
              <Button
                size="small"
                icon={<CloseOutlined />}
                onClick={() => setShowNote(false)}
                style={{ borderRadius: 6, height: 28, width: 28, padding: 0, display: "flex", alignItems: "center", justifyContent: "center" }}
              />
            )}
          </div>
        </div>
      )}

      {/* Inline discount editor */}
      {showDiscount && (
        <div style={{
          display: "flex", alignItems: "center", gap: 6,
          padding: "6px 12px 10px",
          borderTop: `1px dashed ${token.colorBorderSecondary}`,
          background: token.colorFillQuaternary,
        }}>
          <TagOutlined style={{ color: token.colorTextSecondary, fontSize: 12 }} />
          <Select
            size="small"
            value={discType}
            onChange={setDiscType}
            options={[{ label: "%", value: "percent" }, { label: "$", value: "fixed" }]}
            style={{ width: 60 }}
          />
          <InputNumber
            size="small"
            min={0}
            max={discType === "percent" ? 100 : rawTotal}
            precision={discType === "percent" ? 0 : 2}
            value={discValue}
            onChange={(v) => setDiscValue(v ?? 0)}
            placeholder="0"
            style={{ flex: 1, borderRadius: 6 }}
            onPressEnter={applyDiscount}
            autoFocus
          />
          <Button
            size="small"
            type="primary"
            icon={<CheckOutlined />}
            onClick={applyDiscount}
            style={{ borderRadius: 6, height: 28, width: 28, padding: 0, display: "flex", alignItems: "center", justifyContent: "center" }}
          />
          <Button
            size="small"
            icon={<CloseOutlined />}
            onClick={() => setShowDiscount(false)}
            style={{ borderRadius: 6, height: 28, width: 28, padding: 0, display: "flex", alignItems: "center", justifyContent: "center" }}
          />
        </div>
      )}
    </div>
  );
}
