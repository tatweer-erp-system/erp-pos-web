import { useRef, useEffect } from "react";
import { Input, Spin, Empty, theme as antTheme, message, type InputRef } from "antd";
import { SearchOutlined, BarcodeOutlined, DisconnectOutlined } from "@ant-design/icons";
import { ProductCard } from "./ProductCard";
import { useProducts } from "../hooks/useProducts";
import { getProductByBarcode } from "../services/posService";
import type { Product } from "../data/mockProducts";
import { useAppSettings } from "@/contexts/AppSettingsContext";
import { usePOSTranslations } from "../i18n/translations";

interface ProductGridProps {
  onAdd: (product: Product) => void;
  isMobile: boolean;
}

export function ProductGrid({ onAdd, isMobile }: ProductGridProps) {
  const { token } = antTheme.useToken();
  const { language, posCardStyle, posGridCols } = useAppSettings();
  const t = usePOSTranslations(language);
  const isList = isMobile || posCardStyle === "list";
  const {
    products,
    isLoading,
    isFromCache,
    search,
    setSearch,
    activeCategory,
    setActiveCategory,
    categories,
  } = useProducts();

  const barcodeRef = useRef<InputRef>(null);
  const barcodeBuffer = useRef("");
  const barcodeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-focus barcode input on mount
  useEffect(() => {
    barcodeRef.current?.focus?.();
  }, []);

  async function handleBarcodeSubmit(barcode: string) {
    if (!barcode.trim()) return;
    const product = await getProductByBarcode(barcode.trim());
    if (product) {
      if (product.stock === 0) {
        message.warning(`${product.name} is out of stock`);
      } else {
        onAdd(product);
        message.success({ content: `Added: ${product.name}`, duration: 1.5 });
      }
    } else {
      message.error(`Barcode not found: ${barcode}`);
    }
  }

  // Handle scanner input (rapid keystrokes ending with Enter)
  function handleBarcodeKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      const val = e.currentTarget.value;
      handleBarcodeSubmit(val);
      e.currentTarget.value = "";
      e.preventDefault();
    }
  }

  // Capture scanner input on any focused element (scanner sends as keydown globally)
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const active = document.activeElement;
      const isInput = active instanceof HTMLInputElement || active instanceof HTMLTextAreaElement;
      if (isInput) return; // let normal inputs handle it
      if (e.key === "Enter") {
        if (barcodeBuffer.current) {
          handleBarcodeSubmit(barcodeBuffer.current);
          barcodeBuffer.current = "";
        }
        return;
      }
      if (e.key.length === 1) {
        barcodeBuffer.current += e.key;
        if (barcodeTimer.current) clearTimeout(barcodeTimer.current);
        barcodeTimer.current = setTimeout(() => {
          barcodeBuffer.current = "";
        }, 200);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", gap: 12 }}>
      {/* Search + Barcode row */}
      <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
        <Input
          placeholder={t.searchProducts}
          prefix={<SearchOutlined style={{ color: token.colorTextPlaceholder }} />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          allowClear
          style={{ flex: 1, height: 44, borderRadius: 10 }}
        />
        <Input
          ref={barcodeRef}
          placeholder={t.scanBarcode}
          prefix={<BarcodeOutlined style={{ color: token.colorTextPlaceholder }} />}
          onKeyDown={handleBarcodeKeyDown}
          style={{ width: isMobile ? 120 : 160, height: 44, borderRadius: 10 }}
        />
      </div>

      {/* Offline cache notice */}
      {isFromCache && (
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "6px 12px",
          background: "#FEF2F2",
          border: "1px solid #FECACA",
          borderRadius: 8,
          fontSize: 12,
          color: "#EF4444",
          fontWeight: 500,
          flexShrink: 0,
        }}>
          <DisconnectOutlined />
          {t.offlineShowingCache}
        </div>
      )}

      {/* Category filter pills */}
      <div style={{
        display: "flex",
        gap: 6,
        overflowX: "auto",
        flexShrink: 0,
        paddingBottom: 2,
        scrollbarWidth: "none",
      }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              flexShrink: 0,
              padding: "6px 14px",
              borderRadius: 20,
              border: `1.5px solid ${activeCategory === cat ? token.colorPrimary : token.colorBorderSecondary}`,
              background: activeCategory === cat ? token.colorPrimary : "transparent",
              color: activeCategory === cat ? "#fff" : token.colorTextSecondary,
              fontSize: 12,
              fontWeight: activeCategory === cat ? 700 : 500,
              cursor: "pointer",
              transition: "all 0.18s",
              whiteSpace: "nowrap",
              minHeight: 32,
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product grid */}
      <div style={{ flex: 1, overflowY: "auto", paddingInlineEnd: 2 }}>
        {isLoading ? (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 200 }}>
            <Spin size="large" />
          </div>
        ) : products.length === 0 ? (
          <Empty description={t.noProductsFound} style={{ marginTop: 60 }} />
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: isList ? "1fr" : `repeat(${posGridCols}, 1fr)`,
            gap: isList ? 6 : 10,
          }}>
            {products.map((product) => (
              <ProductCard key={product.id} product={product} onAdd={onAdd} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
