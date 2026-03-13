import {
  Drawer,
  Button,
  Divider,
  Tooltip,
  Typography,
  theme as antTheme,
} from "antd";
import {
  BgColorsOutlined,
  SunOutlined,
  MoonOutlined,
  CheckOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { useAppSettings } from "@/contexts/AppSettingsContext";

const { Text } = Typography;

interface ThemeCustomizerProps {
  open: boolean;
  onClose: () => void;
}

const PALETTE: { hex: string; label: string }[] = [
  { hex: "#3B82F6", label: "Blue" },
  { hex: "#10B981", label: "Emerald" },
  { hex: "#A855F7", label: "Purple" },
  { hex: "#F97316", label: "Orange" },
  { hex: "#EC4899", label: "Pink" },
  { hex: "#14B8A6", label: "Teal" },
  { hex: "#6366F1", label: "Indigo" },
  { hex: "#06B6D4", label: "Cyan" },
  { hex: "#F59E0B", label: "Amber" },
  { hex: "#F43F5E", label: "Rose" },
  { hex: "#64748B", label: "Slate" },
  { hex: "#84CC16", label: "Lime" },
  { hex: "#0EA5E9", label: "Sky" },
  { hex: "#D946EF", label: "Fuchsia" },
  { hex: "#25671E", label: "Forest" },
  { hex: "#0D1A63", label: "Dark Blue" },
  { hex: "#7C3AED", label: "Violet" },
  { hex: "#DC2626", label: "Red" },
  { hex: "#059669", label: "Green" },
  { hex: "#09122C", label: "Navy" },
];

const RADIUS_PRESETS = [
  { label: "Sharp", value: 2, preview: 2 },
  { label: "Default", value: 6, preview: 6 },
  { label: "Rounded", value: 10, preview: 10 },
  { label: "Pill", value: 16, preview: 16 },
];

function OptionButton({
  isActive,
  onClick,
  children,
  style,
}: {
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  const { token } = antTheme.useToken();
  return (
    <button
      onClick={onClick}
      style={{
        border: `2px solid ${isActive ? token.colorPrimary : token.colorBorderSecondary}`,
        borderRadius: token.borderRadius,
        background: isActive ? token.colorPrimaryBg : token.colorBgContainer,
        color: isActive ? token.colorPrimary : token.colorText,
        cursor: "pointer",
        fontSize: 11,
        fontWeight: isActive ? 600 : 400,
        transition: "all 0.15s",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
        ...style,
      }}
    >
      {children}
    </button>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  const { token } = antTheme.useToken();
  return (
    <div
      style={{
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color: token.colorTextTertiary,
        marginBottom: 10,
      }}
    >
      {children}
    </div>
  );
}

export function ThemeCustomizer({ open, onClose }: ThemeCustomizerProps) {
  const { token } = antTheme.useToken();
  const {
    language,
    theme,
    setMode,
    preset,
    setPreset,
    presets,
    accentColor,
    setAccentColor,
    themeRadius,
    setThemeRadius,
    posCardStyle,
    setPOSCardStyle,
    posGridCols,
    setPOSGridCols,
  } = useAppSettings();
  const isRTL = language === "ar";

  const isDark = theme === "dark";
  const activeColor = accentColor || token.colorPrimary;

  function reset() {
    setPreset(null);
    setAccentColor("");
    setThemeRadius(6);
  }

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <BgColorsOutlined
            style={{ color: token.colorPrimary, fontSize: 16 }}
          />
          <span style={{ fontWeight: 700, fontSize: 15 }}>
            Theme Customizer
          </span>
        </div>
      }
      extra={
        <Tooltip title="Reset to default theme">
          <Button size="small" icon={<ReloadOutlined />} onClick={reset}>
            Reset
          </Button>
        </Tooltip>
      }
      placement={isRTL ? "left" : "right"}
      width={300}
      styles={{
        body: {
          padding: "20px 16px",
          display: "flex",
          flexDirection: "column",
          gap: 20,
          overflowX: "hidden",
        },
      }}
    >
      {/* ── Appearance ─────────────────────────────────────────────────────── */}
      <div>
        <SectionLabel>Appearance</SectionLabel>
        <div style={{ display: "flex", gap: 8 }}>
          <Button
            block
            type={!isDark ? "primary" : "default"}
            icon={<SunOutlined />}
            onClick={() => setMode("light")}
            style={{ borderRadius: 8, fontWeight: 600 }}
          >
            Light
          </Button>
          <Button
            block
            type={isDark ? "primary" : "default"}
            icon={<MoonOutlined />}
            onClick={() => setMode("dark")}
            style={{ borderRadius: 8, fontWeight: 600 }}
          >
            Dark
          </Button>
        </div>
      </div>

      <Divider style={{ margin: 0 }} />

      {/* ── Theme Presets ───────────────────────────────────────────────────── */}
      <div>
        <SectionLabel>Theme Presets</SectionLabel>
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}
        >
          {/* Default (no preset) option */}
          <div
            onClick={() => {
              setPreset(null);
              setAccentColor("");
            }}
            style={{
              padding: "10px 12px",
              borderRadius: 10,
              cursor: "pointer",
              border: `2px solid ${!preset ? token.colorPrimary : token.colorBorderSecondary}`,
              background: !preset
                ? `${token.colorPrimary}12`
                : token.colorFillAlter,
              transition: "all 0.15s",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div style={{ display: "flex", gap: 3, marginBottom: 5 }}>
                {["#3B82F6", "#10B981", "#F59E0B", "#EF4444"].map((c, i) => (
                  <div
                    key={i}
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      background: c,
                    }}
                  />
                ))}
              </div>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: !preset ? token.colorPrimary : token.colorText,
                }}
              >
                Default
              </div>
            </div>
            {!preset && (
              <CheckOutlined
                style={{ color: token.colorPrimary, fontSize: 12 }}
              />
            )}
          </div>

          {presets.map(p => {
            const colors = p[theme];
            const isActive = preset === p.id;
            return (
              <div
                key={p.id}
                onClick={() => {
                  setPreset(isActive ? null : p.id);
                  setAccentColor("");
                }}
                style={{
                  padding: "10px 12px",
                  borderRadius: 10,
                  cursor: "pointer",
                  border: `2px solid ${isActive ? colors.primary : token.colorBorderSecondary}`,
                  background: isActive
                    ? `${colors.primary}12`
                    : token.colorFillAlter,
                  transition: "all 0.15s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div style={{ display: "flex", gap: 3, marginBottom: 5 }}>
                    {[
                      colors.primary,
                      colors.secondary,
                      colors.accent,
                      colors.background,
                    ].map((c, i) => (
                      <div
                        key={i}
                        style={{
                          width: 12,
                          height: 12,
                          borderRadius: "50%",
                          background: c,
                          border: `1px solid ${token.colorBorder}`,
                        }}
                      />
                    ))}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: isActive ? colors.primary : token.colorText,
                    }}
                  >
                    {p.name}
                  </div>
                </div>
                {isActive && (
                  <CheckOutlined
                    style={{ color: colors.primary, fontSize: 12 }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <Divider style={{ margin: 0 }} />

      {/* ── Primary Color ───────────────────────────────────────────────────── */}
      <div>
        <SectionLabel>Primary Color</SectionLabel>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: 7,
            marginBottom: 12,
          }}
        >
          {PALETTE.map(c => {
            const isActive = accentColor === c.hex;
            return (
              <Tooltip key={c.hex} title={c.label} placement="top">
                <button
                  onClick={() => {
                    setAccentColor(c.hex);
                    setPreset(null);
                  }}
                  style={{
                    width: "100%",
                    aspectRatio: "1",
                    borderRadius: 7,
                    background: c.hex,
                    border: isActive
                      ? `2px solid ${token.colorBgContainer}`
                      : "2px solid transparent",
                    outline: isActive
                      ? `2px solid ${c.hex}`
                      : "2px solid transparent",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transform: isActive ? "scale(1.12)" : "scale(1)",
                    transition: "transform 0.15s, outline 0.15s",
                  }}
                >
                  {isActive && (
                    <CheckOutlined style={{ fontSize: 10, color: "#fff" }} />
                  )}
                </button>
              </Tooltip>
            );
          })}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "9px 12px",
            background: token.colorFillAlter,
            borderRadius: token.borderRadiusLG,
            border: `1px solid ${token.colorBorderSecondary}`,
          }}
        >
          <div style={{ position: "relative", flexShrink: 0 }}>
            <div
              style={{
                width: 26,
                height: 26,
                borderRadius: 6,
                background: activeColor,
                border: `1px solid ${token.colorBorderSecondary}`,
              }}
            />
            <input
              type="color"
              value={activeColor}
              onChange={e => {
                setAccentColor(e.target.value);
                setPreset(null);
              }}
              style={{
                position: "absolute",
                inset: 0,
                opacity: 0,
                cursor: "pointer",
                width: "100%",
                height: "100%",
              }}
            />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <Text style={{ fontSize: 11, display: "block", fontWeight: 500 }}>
              Custom color
            </Text>
            <Text
              type="secondary"
              style={{ fontSize: 11, fontFamily: "monospace" }}
            >
              {activeColor.toUpperCase()}
            </Text>
          </div>
        </div>
      </div>

      <Divider style={{ margin: 0 }} />

      {/* ── Border Radius ───────────────────────────────────────────────────── */}
      <div>
        <SectionLabel>Border Radius</SectionLabel>
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}
        >
          {RADIUS_PRESETS.map(p => {
            const isActive = themeRadius === p.value;
            return (
              <OptionButton
                key={p.value}
                isActive={isActive}
                onClick={() => setThemeRadius(p.value)}
                style={{ padding: "10px 8px", borderRadius: p.preview }}
              >
                <div
                  style={{
                    width: 32,
                    height: 12,
                    background: isActive
                      ? token.colorPrimary
                      : token.colorFillSecondary,
                    borderRadius: p.preview,
                  }}
                />
                {p.label}
              </OptionButton>
            );
          })}
        </div>
      </div>

      <Divider style={{ margin: 0 }} />

      {/* ── POS Display ─────────────────────────────────────────────────────── */}
      <div>
        <SectionLabel>POS Display</SectionLabel>

        {/* Card Style */}
        <div style={{ marginBottom: 16 }}>
          <Text
            type="secondary"
            style={{
              fontSize: 10,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              display: "block",
              marginBottom: 8,
            }}
          >
            Card Style
          </Text>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 8,
            }}
          >
            {[
              {
                value: "card" as const,
                label: "Card",
                preview: (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 2,
                      width: "100%",
                    }}
                  >
                    {[1, 2].map(i => (
                      <div
                        key={i}
                        style={{
                          borderRadius: 3,
                          overflow: "hidden",
                          border: `1px solid currentColor`,
                          opacity: 0.5,
                        }}
                      >
                        <div
                          style={{
                            height: 12,
                            background: "currentColor",
                            opacity: 0.3,
                          }}
                        />
                        <div style={{ padding: "2px 3px" }}>
                          <div
                            style={{
                              height: 2.5,
                              background: "currentColor",
                              borderRadius: 1,
                              marginBottom: 2,
                              opacity: 0.5,
                              width: "80%",
                            }}
                          />
                          <div
                            style={{
                              height: 2.5,
                              background: "currentColor",
                              borderRadius: 1,
                              opacity: 0.9,
                              width: "50%",
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ),
              },
              {
                value: "compact" as const,
                label: "Compact",
                preview: (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 2,
                      width: "100%",
                    }}
                  >
                    {[1, 2, 3].map(i => (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          border: `1px solid currentColor`,
                          borderRadius: 3,
                          padding: "2px 3px",
                          opacity: 0.5,
                        }}
                      >
                        <div
                          style={{
                            width: 9,
                            height: 9,
                            borderRadius: 2,
                            background: "currentColor",
                            flexShrink: 0,
                            opacity: 0.6,
                          }}
                        />
                        <div style={{ flex: 1 }}>
                          <div
                            style={{
                              height: 2,
                              background: "currentColor",
                              borderRadius: 1,
                              marginBottom: 1,
                              width: "70%",
                              opacity: 0.5,
                            }}
                          />
                          <div
                            style={{
                              height: 2,
                              background: "currentColor",
                              borderRadius: 1,
                              width: "40%",
                              opacity: 0.9,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ),
              },
              {
                value: "list" as const,
                label: "List",
                preview: (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 2,
                      width: "100%",
                    }}
                  >
                    {[1, 2, 3].map(i => (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          border: `1px solid currentColor`,
                          borderRadius: 3,
                          padding: "2px 3px",
                          opacity: 0.5,
                        }}
                      >
                        <div
                          style={{
                            width: 11,
                            height: 11,
                            borderRadius: 2,
                            background: "currentColor",
                            flexShrink: 0,
                            opacity: 0.6,
                          }}
                        />
                        <div style={{ flex: 1 }}>
                          <div
                            style={{
                              height: 2,
                              background: "currentColor",
                              borderRadius: 1,
                              marginBottom: 1,
                              width: "65%",
                              opacity: 0.5,
                            }}
                          />
                          <div
                            style={{
                              height: 2,
                              background: "currentColor",
                              borderRadius: 1,
                              width: "35%",
                              opacity: 0.4,
                            }}
                          />
                        </div>
                        <div
                          style={{
                            width: 11,
                            height: 7,
                            borderRadius: 2,
                            background: "currentColor",
                            opacity: 0.7,
                          }}
                        />
                      </div>
                    ))}
                  </div>
                ),
              },
            ].map(opt => {
              const isActive = posCardStyle === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => setPOSCardStyle(opt.value)}
                  style={{
                    padding: "10px 6px 8px",
                    border: `2px solid ${isActive ? token.colorPrimary : token.colorBorderSecondary}`,
                    borderRadius: token.borderRadius,
                    background: isActive
                      ? token.colorPrimaryBg
                      : token.colorBgContainer,
                    color: isActive
                      ? token.colorPrimary
                      : token.colorTextSecondary,
                    cursor: "pointer",
                    fontSize: 10,
                    fontWeight: isActive ? 700 : 400,
                    transition: "all 0.15s",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  {opt.preview}
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Grid Columns — hidden when list style is active */}
        {posCardStyle !== "list" && (
          <div>
            <Text
              type="secondary"
              style={{
                fontSize: 10,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                display: "block",
                marginBottom: 8,
              }}
            >
              Grid Columns
            </Text>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: 6,
              }}
            >
              {([2, 3, 4, 5] as const).map(cols => {
                const isActive = posGridCols === cols;
                return (
                  <button
                    key={cols}
                    onClick={() => setPOSGridCols(cols)}
                    style={{
                      padding: "8px 4px",
                      border: `2px solid ${isActive ? token.colorPrimary : token.colorBorderSecondary}`,
                      borderRadius: token.borderRadius,
                      background: isActive
                        ? token.colorPrimaryBg
                        : token.colorBgContainer,
                      color: isActive
                        ? token.colorPrimary
                        : token.colorTextSecondary,
                      cursor: "pointer",
                      fontSize: 10,
                      fontWeight: isActive ? 700 : 400,
                      transition: "all 0.15s",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 5,
                    }}
                  >
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: `repeat(${cols}, 1fr)`,
                        gap: 1.5,
                        width: "100%",
                      }}
                    >
                      {Array.from({ length: cols * 2 }).map((_, i) => (
                        <div
                          key={i}
                          style={{
                            height: 5,
                            borderRadius: 1,
                            background: "currentColor",
                            opacity: isActive ? 0.7 : 0.3,
                          }}
                        />
                      ))}
                    </div>
                    {cols}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </Drawer>
  );
}
