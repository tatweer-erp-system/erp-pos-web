import { useState } from "react";
import {
  InputNumber,
  Button,
  theme as antTheme,
  Tooltip,
  Select,
  Input,
  Tag,
} from "antd";
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

const ALLERGY_KEYWORDS = [
  "allergy",
  "allergen",
  "nut",
  "gluten",
  "dairy",
  "lactose",
  "vegan",
  "halal",
  "حساسية",
  "مكسرات",
  "جلوتين",
];

function hasAllergyFlag(note: string) {
  return ALLERGY_KEYWORDS.some(kw => note.toLowerCase().includes(kw));
}

interface CartItemProps {
  item: CartItemType;
  onQuantityChange: (productId: string, qty: number) => void;
  onRemove: (productId: string) => void;
  onSetDiscount: (
    productId: string,
    discount: LineDiscount | undefined
  ) => void;
  onSetNote: (productId: string, note: string) => void;
  isMobile: boolean;
}

export function CartItem({
  item,
  onQuantityChange,
  onRemove,
  onSetDiscount,
  onSetNote,
  isMobile,
}: CartItemProps) {
  const { token } = antTheme.useToken();
  const { language } = useAppSettings();
  const t = usePOSTranslations(language);
  const [hovered, setHovered] = useState(false);
  const [showDiscount, setShowDiscount] = useState(!!item.lineDiscount?.value);
  const [discType, setDiscType] = useState<"percent" | "fixed">(
    item.lineDiscount?.type ?? "percent"
  );
  const [discValue, setDiscValue] = useState<number>(
    item.lineDiscount?.value ?? 0
  );
  const [showNote, setShowNote] = useState(false);
  const [noteValue, setNoteValue] = useState(item.note ?? "");

  const rawTotal = item.product.price * item.quantity;
  const lineTotal = getLineTotal(item);
  const hasDiscount = !!item.lineDiscount && item.lineDiscount.value > 0;
  const hasNote = !!item.note && item.note.trim().length > 0;
  const isAllergy = hasNote && hasAllergyFlag(item.note!);

  function applyDiscount() {
    if (discValue > 0)
      onSetDiscount(item.product.id, { type: discType, value: discValue });
    else onSetDiscount(item.product.id, undefined);
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
    setNoteValue(current ? `${current}, ${mod}` : mod);
  }

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: 8,
        background: hovered ? token.colorFillAlter : "transparent",
        transition: "background 0.15s",
        overflow: "hidden",
        borderInlineStart: `3px solid ${isAllergy ? "#F59E0B" : item.product.color}`,
      }}
    >
      {/* Main row: name + right side */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "7px 8px 7px 10px",
          gap: 8,
        }}
      >
        {/* Left: name + subtitle */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: 12.5,
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
              fontSize: 11,
              color: token.colorTextSecondary,
              marginTop: 1,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            {hasDiscount ? (
              <>
                <span
                  style={{
                    textDecoration: "line-through",
                    fontSize: 10,
                    color: token.colorTextQuaternary,
                  }}
                >
                  ${rawTotal.toFixed(2)}
                </span>
                <span style={{ fontWeight: 700, color: token.colorSuccess }}>
                  ${lineTotal.toFixed(2)}
                </span>
              </>
            ) : (
              <span style={{ fontWeight: 600 }}>${lineTotal.toFixed(2)}</span>
            )}
            <span style={{ color: token.colorTextQuaternary }}>·</span>
            <span>
              ${item.product.price.toFixed(2)} × {item.quantity}
            </span>
            {hasNote && (
              <span
                style={{
                  marginInlineStart: 2,
                  color: isAllergy ? "#D97706" : token.colorTextTertiary,
                  fontStyle: "italic",
                  fontSize: 10,
                }}
              >
                {isAllergy && (
                  <WarningOutlined
                    style={{ marginInlineEnd: 2, fontSize: 9 }}
                  />
                )}
                {item.note}
              </span>
            )}
          </div>
        </div>

        {/* Right: actions always visible */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 3,
            flexShrink: 0,
          }}
        >
          {/* Qty stepper */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: token.colorBgContainer,
              borderRadius: 6,
              border: `1px solid ${token.colorBorderSecondary}`,
              overflow: "hidden",
            }}
          >
            <button
              onClick={() =>
                onQuantityChange(item.product.id, item.quantity - 1)
              }
              style={{
                width: 22,
                height: 22,
                border: "none",
                background: "transparent",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: token.colorTextSecondary,
                fontSize: 9,
                padding: 0,
              }}
            >
              <MinusOutlined />
            </button>
            <span
              style={{
                minWidth: 20,
                textAlign: "center",
                fontSize: 11,
                fontWeight: 700,
                color: token.colorText,
                lineHeight: "22px",
                borderInline: `1px solid ${token.colorBorderSecondary}`,
              }}
            >
              {item.quantity}
            </span>
            <button
              onClick={() =>
                onQuantityChange(item.product.id, item.quantity + 1)
              }
              disabled={item.quantity >= item.product.stock}
              style={{
                width: 22,
                height: 22,
                border: "none",
                background: "transparent",
                cursor:
                  item.quantity >= item.product.stock ? "default" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color:
                  item.quantity >= item.product.stock
                    ? token.colorTextQuaternary
                    : token.colorTextSecondary,
                fontSize: 9,
                padding: 0,
              }}
            >
              <PlusOutlined />
            </button>
          </div>

          {/* Note */}
          <Tooltip title={hasNote ? item.note : t.itemNote}>
            <button
              onClick={() => {
                setNoteValue(item.note ?? "");
                setShowNote(v => !v);
                setShowDiscount(false);
              }}
              style={{
                width: 24,
                height: 24,
                borderRadius: 6,
                border: "none",
                background: hasNote ? `${token.colorPrimary}15` : "transparent",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: isAllergy
                  ? "#D97706"
                  : hasNote
                    ? token.colorPrimary
                    : token.colorTextSecondary,
                fontSize: 12,
              }}
            >
              <MessageOutlined />
            </button>
          </Tooltip>

          {/* Discount */}
          <Tooltip title={hasDiscount ? t.removeDiscount : t.itemDiscount}>
            <button
              onClick={() => {
                if (hasDiscount && !showDiscount) removeDiscount();
                else {
                  setShowDiscount(v => !v);
                  setShowNote(false);
                }
              }}
              style={{
                width: 24,
                height: 24,
                borderRadius: 6,
                border: "none",
                background: hasDiscount
                  ? `${token.colorSuccess}15`
                  : "transparent",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: hasDiscount
                  ? token.colorSuccess
                  : token.colorTextSecondary,
                fontSize: 12,
              }}
            >
              <TagOutlined />
            </button>
          </Tooltip>

          {/* Delete */}
          <Tooltip title={t.removeItem}>
            <button
              onClick={() => onRemove(item.product.id)}
              style={{
                width: 24,
                height: 24,
                borderRadius: 6,
                border: "none",
                background: "transparent",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: token.colorError,
                fontSize: 12,
              }}
            >
              <DeleteOutlined />
            </button>
          </Tooltip>
        </div>
      </div>

      {/* Item note editor */}
      {showNote && (
        <div
          style={{
            padding: "6px 10px 8px",
            borderTop: `1px dashed ${token.colorBorderSecondary}`,
            background: token.colorFillQuaternary,
            display: "flex",
            flexDirection: "column",
            gap: 6,
          }}
        >
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            {QUICK_MODIFIERS.map(mod => (
              <Tag
                key={mod}
                onClick={() => applyModifier(mod)}
                style={{
                  cursor: "pointer",
                  borderRadius: 12,
                  fontSize: 10,
                  padding: "1px 8px",
                  lineHeight: "18px",
                  borderColor: token.colorBorderSecondary,
                  color: token.colorTextSecondary,
                  userSelect: "none",
                }}
              >
                {mod}
              </Tag>
            ))}
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <Input
              size="small"
              value={noteValue}
              onChange={e => setNoteValue(e.target.value)}
              placeholder={t.itemNotePlaceholder}
              onPressEnter={saveNote}
              autoFocus
              style={{ borderRadius: 6, fontSize: 12, flex: 1 }}
              prefix={
                <MessageOutlined
                  style={{ color: token.colorTextTertiary, fontSize: 11 }}
                />
              }
            />
            <Button
              size="small"
              type="primary"
              icon={<CheckOutlined />}
              onClick={saveNote}
              style={{
                borderRadius: 6,
                height: 28,
                width: 28,
                padding: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            />
            <Button
              size="small"
              danger={hasNote}
              icon={<CloseOutlined />}
              onClick={hasNote ? clearNote : () => setShowNote(false)}
              style={{
                borderRadius: 6,
                height: 28,
                width: 28,
                padding: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            />
          </div>
        </div>
      )}

      {/* Inline discount editor */}
      {showDiscount && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "6px 10px 8px",
            borderTop: `1px dashed ${token.colorBorderSecondary}`,
            background: token.colorFillQuaternary,
          }}
        >
          <TagOutlined
            style={{ color: token.colorTextSecondary, fontSize: 12 }}
          />
          <Select
            size="small"
            value={discType}
            onChange={setDiscType}
            options={[
              { label: "%", value: "percent" },
              { label: "$", value: "fixed" },
            ]}
            style={{ width: 60 }}
          />
          <InputNumber
            size="small"
            min={0}
            max={discType === "percent" ? 100 : rawTotal}
            precision={discType === "percent" ? 0 : 2}
            value={discValue}
            onChange={v => setDiscValue(v ?? 0)}
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
            style={{
              borderRadius: 6,
              height: 28,
              width: 28,
              padding: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          />
          <Button
            size="small"
            icon={<CloseOutlined />}
            onClick={() => setShowDiscount(false)}
            style={{
              borderRadius: 6,
              height: 28,
              width: 28,
              padding: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          />
        </div>
      )}
    </div>
  );
}
