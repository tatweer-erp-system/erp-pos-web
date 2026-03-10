import { useState } from "react";
import { theme as antTheme, Tag } from "antd";
import { ShoppingCartOutlined, StopOutlined, PlusOutlined } from "@ant-design/icons";
import type { Product } from "../data/mockProducts";
import { useAppSettings } from "@/contexts/AppSettingsContext";
import { usePOSTranslations } from "../i18n/translations";

interface ProductCardProps {
  product: Product;
  onAdd: (product: Product) => void;
}

function ProductImage({
  product, size, hovered, outOfStock,
}: { product: Product; size: number; hovered: boolean; outOfStock: boolean }) {
  const [imgError, setImgError] = useState(false);
  const showImage = !!product.image && !imgError;

  return showImage ? (
    <img
      src={product.image}
      alt={product.name}
      onError={() => setImgError(true)}
      style={{
        width: "100%", height: "100%", objectFit: "cover",
        transition: "transform 0.22s",
        transform: hovered && !outOfStock ? "scale(1.06)" : "scale(1)",
      }}
    />
  ) : (
    <div style={{
      width: size, height: size, borderRadius: size * 0.28,
      background: `linear-gradient(135deg, ${product.color}, ${product.color}bb)`,
      display: "flex", alignItems: "center", justifyContent: "center",
      color: "#fff", fontSize: size * 0.42, fontWeight: 800,
      boxShadow: `0 4px 14px ${product.color}55`,
      transition: "transform 0.18s",
      transform: hovered && !outOfStock ? "scale(1.1) rotate(-4deg)" : "scale(1)",
      flexShrink: 0,
    }}>
      {product.name.charAt(0)}
    </div>
  );
}

/** ── Style 1: CARD — tall image + info below (default) ── */
function CardStyle({ product, onAdd }: ProductCardProps) {
  const { token } = antTheme.useToken();
  const { language } = useAppSettings();
  const t = usePOSTranslations(language);
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [imgError, setImgError] = useState(false);
  const outOfStock = product.stock === 0;
  const lowStock = product.stock > 0 && product.stock <= 10;
  const showImage = !!product.image && !imgError;

  function handleClick() {
    if (outOfStock) return;
    onAdd(product);
    setPressed(true);
    setTimeout(() => setPressed(false), 160);
  }

  const stockBadge = outOfStock ? (
    <Tag icon={<StopOutlined />} color="error" style={{ fontSize: 10, lineHeight: "18px", padding: "0 5px", border: "none" }}>{t.outOfStock}</Tag>
  ) : lowStock ? (
    <Tag color="warning" style={{ fontSize: 10, lineHeight: "18px", padding: "0 5px", border: "none" }}>{t.low}: {product.stock}</Tag>
  ) : (
    <Tag color="success" style={{ fontSize: 10, lineHeight: "18px", padding: "0 5px", border: "none" }}>{product.stock} {product.unit}</Tag>
  );

  return (
    <div
      role="button" tabIndex={outOfStock ? -1 : 0}
      aria-label={t.addToCart(product.name)}
      onClick={handleClick}
      onKeyDown={(e) => e.key === "Enter" && handleClick()}
      onMouseEnter={() => !outOfStock && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: 14,
        border: `1.5px solid ${hovered && !outOfStock ? token.colorPrimary + "60" : token.colorBorderSecondary}`,
        background: outOfStock ? token.colorFillAlter : hovered ? token.colorPrimaryBg : token.colorBgContainer,
        cursor: outOfStock ? "not-allowed" : "pointer",
        transition: "all 0.18s ease",
        transform: pressed ? "scale(0.96)" : hovered && !outOfStock ? "translateY(-2px)" : "none",
        boxShadow: hovered && !outOfStock ? `0 8px 24px ${token.colorPrimary}18, 0 2px 8px rgba(0,0,0,0.06)` : "0 1px 4px rgba(0,0,0,0.04)",
        overflow: "hidden", opacity: outOfStock ? 0.65 : 1,
        userSelect: "none", minHeight: 160, display: "flex", flexDirection: "column",
      }}
    >
      {/* Image area */}
      <div style={{
        height: 96, flexShrink: 0, overflow: "hidden", position: "relative",
        background: showImage ? token.colorFillAlter : `linear-gradient(135deg, ${product.color}22, ${product.color}44)`,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {showImage ? (
          <img src={product.image} alt={product.name} onError={() => setImgError(true)}
            style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.22s", transform: hovered && !outOfStock ? "scale(1.06)" : "scale(1)" }} />
        ) : (
          <div style={{
            width: 52, height: 52, borderRadius: 14,
            background: `linear-gradient(135deg, ${product.color}, ${product.color}bb)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontSize: 20, fontWeight: 800,
            boxShadow: `0 4px 14px ${product.color}55`,
            transition: "transform 0.18s",
            transform: hovered && !outOfStock ? "scale(1.1) rotate(-4deg)" : "scale(1)",
          }}>{product.name.charAt(0)}</div>
        )}
        {!outOfStock && (
          <div style={{
            position: "absolute", inset: 0,
            background: `linear-gradient(to top, ${token.colorPrimary}44 0%, transparent 60%)`,
            opacity: hovered ? 1 : 0, transition: "opacity 0.18s",
            display: "flex", alignItems: "flex-end", justifyContent: "flex-end", padding: 8,
          }}>
            <div style={{ background: token.colorPrimary, color: "#fff", borderRadius: 8, width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>
              <ShoppingCartOutlined />
            </div>
          </div>
        )}
        {outOfStock && (
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <StopOutlined style={{ color: "#fff", fontSize: 20, opacity: 0.7 }} />
          </div>
        )}
      </div>
      {/* Info */}
      <div style={{ padding: "10px", flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: token.colorText, lineHeight: 1.35, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
          {product.name}
        </div>
        <div style={{ fontSize: 15, fontWeight: 800, color: outOfStock ? token.colorTextDisabled : token.colorPrimary, marginTop: "auto", letterSpacing: "-0.01em" }}>
          ${product.price.toFixed(2)}
        </div>
        <div>{stockBadge}</div>
      </div>
    </div>
  );
}

/** ── Style 2: COMPACT — horizontal tile, image left, info right ── */
function CompactStyle({ product, onAdd }: ProductCardProps) {
  const { token } = antTheme.useToken();
  const { language } = useAppSettings();
  const t = usePOSTranslations(language);
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  const outOfStock = product.stock === 0;
  const lowStock = product.stock > 0 && product.stock <= 10;

  function handleClick() {
    if (outOfStock) return;
    onAdd(product);
    setPressed(true);
    setTimeout(() => setPressed(false), 140);
  }

  const stockColor = outOfStock ? token.colorError : lowStock ? "#F59E0B" : "#10B981";
  const stockText = outOfStock ? t.outOfStock : lowStock ? `${t.low} ${product.stock}` : `${product.stock} ${product.unit}`;

  return (
    <div
      role="button" tabIndex={outOfStock ? -1 : 0}
      aria-label={t.addToCart(product.name)}
      onClick={handleClick}
      onKeyDown={(e) => e.key === "Enter" && handleClick()}
      onMouseEnter={() => !outOfStock && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: 12,
        border: `1.5px solid ${hovered && !outOfStock ? token.colorPrimary + "55" : token.colorBorderSecondary}`,
        background: outOfStock ? token.colorFillAlter : hovered ? token.colorPrimaryBg : token.colorBgContainer,
        cursor: outOfStock ? "not-allowed" : "pointer",
        transition: "all 0.15s ease",
        transform: pressed ? "scale(0.97)" : "none",
        boxShadow: hovered && !outOfStock ? `0 4px 16px ${token.colorPrimary}18` : "0 1px 3px rgba(0,0,0,0.04)",
        opacity: outOfStock ? 0.6 : 1, userSelect: "none",
        padding: "10px 12px",
        display: "flex", alignItems: "center", gap: 10,
      }}
    >
      {/* Small image/avatar */}
      <div style={{
        width: 48, height: 48, borderRadius: 10, overflow: "hidden", flexShrink: 0,
        background: `linear-gradient(135deg, ${product.color}22, ${product.color}44)`,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <ProductImage product={product} size={34} hovered={hovered} outOfStock={outOfStock} />
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: token.colorText, lineHeight: 1.3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {product.name}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 3 }}>
          <span style={{ fontSize: 14, fontWeight: 800, color: outOfStock ? token.colorTextDisabled : token.colorPrimary }}>
            ${product.price.toFixed(2)}
          </span>
          <span style={{ fontSize: 10, color: stockColor, fontWeight: 600 }}>· {stockText}</span>
        </div>
      </div>

      {/* Add button */}
      {!outOfStock && (
        <div style={{
          width: 28, height: 28, borderRadius: 8, flexShrink: 0,
          background: hovered ? token.colorPrimary : `${token.colorPrimary}18`,
          color: hovered ? "#fff" : token.colorPrimary,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 13, transition: "all 0.15s",
        }}>
          <PlusOutlined />
        </div>
      )}
    </div>
  );
}

/** ── Style 3: LIST — full-width row, large image, category label, always-visible add ── */
function ListStyle({ product, onAdd }: ProductCardProps) {
  const { token } = antTheme.useToken();
  const { language } = useAppSettings();
  const t = usePOSTranslations(language);
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  const outOfStock = product.stock === 0;
  const lowStock = product.stock > 0 && product.stock <= 10;

  function handleClick() {
    if (outOfStock) return;
    onAdd(product);
    setPressed(true);
    setTimeout(() => setPressed(false), 140);
  }

  return (
    <div
      role="button" tabIndex={outOfStock ? -1 : 0}
      aria-label={t.addToCart(product.name)}
      onClick={handleClick}
      onKeyDown={(e) => e.key === "Enter" && handleClick()}
      onMouseEnter={() => !outOfStock && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: 12,
        border: `1.5px solid ${hovered && !outOfStock ? token.colorPrimary + "55" : token.colorBorderSecondary}`,
        background: outOfStock ? token.colorFillAlter : hovered ? token.colorPrimaryBg : token.colorBgContainer,
        cursor: outOfStock ? "not-allowed" : "pointer",
        transition: "all 0.15s ease",
        transform: pressed ? "scale(0.99)" : "none",
        boxShadow: hovered && !outOfStock ? `0 4px 16px ${token.colorPrimary}18` : "0 1px 3px rgba(0,0,0,0.04)",
        opacity: outOfStock ? 0.6 : 1, userSelect: "none",
        display: "flex", alignItems: "center", gap: 12, padding: "8px 14px 8px 8px",
        overflow: "hidden",
      }}
    >
      {/* Image */}
      <div style={{
        width: 64, height: 64, borderRadius: 10, overflow: "hidden", flexShrink: 0,
        background: `linear-gradient(135deg, ${product.color}22, ${product.color}44)`,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <ProductImage product={product} size={44} hovered={hovered} outOfStock={outOfStock} />
      </div>

      {/* Name + category + stock */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: token.colorText, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {product.name}
        </div>
        <div style={{ fontSize: 11, color: token.colorTextTertiary, marginTop: 2 }}>
          {product.category}
        </div>
        <div style={{ marginTop: 3 }}>
          {outOfStock ? (
            <span style={{ fontSize: 10, color: token.colorError, fontWeight: 600 }}>{t.outOfStock}</span>
          ) : lowStock ? (
            <span style={{ fontSize: 10, color: "#F59E0B", fontWeight: 600 }}>{t.low}: {product.stock} {product.unit}</span>
          ) : (
            <span style={{ fontSize: 10, color: "#10B981", fontWeight: 600 }}>{product.stock} {product.unit}</span>
          )}
        </div>
      </div>

      {/* Price + add */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, flexShrink: 0 }}>
        <span style={{ fontSize: 16, fontWeight: 900, color: outOfStock ? token.colorTextDisabled : token.colorPrimary, letterSpacing: "-0.02em" }}>
          ${product.price.toFixed(2)}
        </span>
        {!outOfStock && (
          <div style={{
            height: 26, paddingInline: 10, borderRadius: 7,
            background: hovered ? token.colorPrimary : `${token.colorPrimary}18`,
            color: hovered ? "#fff" : token.colorPrimary,
            display: "flex", alignItems: "center", gap: 4,
            fontSize: 11, fontWeight: 700, transition: "all 0.15s",
          }}>
            <PlusOutlined style={{ fontSize: 10 }} />
            {t.cart}
          </div>
        )}
      </div>
    </div>
  );
}

export function ProductCard({ product, onAdd }: ProductCardProps) {
  const { posCardStyle } = useAppSettings();

  if (posCardStyle === "compact") return <CompactStyle product={product} onAdd={onAdd} />;
  if (posCardStyle === "list") return <ListStyle product={product} onAdd={onAdd} />;
  return <CardStyle product={product} onAdd={onAdd} />;
}
