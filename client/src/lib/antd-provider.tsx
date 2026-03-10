/**
 * AntProvider — wraps Ant Design ConfigProvider + StyleProvider.
 * Reads the active CSS variables so antd tokens match the existing theme.
 * Usage: wrap the DashboardLayout shell — covers sidebar, navbar, and all pages.
 */
import * as React from "react";
import { ConfigProvider, theme as antTheme } from "antd";
import { StyleProvider } from "@ant-design/cssinjs";
import { useAppSettings } from "@/contexts/AppSettingsContext";

const LIGHT = {
  primary:        "#3B82F6",
  bgBase:         "#F8FAFC",
  bgCard:         "#FFFFFF",
  border:         "#E2E8F0",
  borderSub:      "#EFF3F7",
  text:           "#1E293B",
  textSub:        "#64748B",
  muted:          "#F1F5F9",
  headerBg:       "#F8FAFC",
  rowHover:       "#F1F5F9",
  sidebarBg:      "#FFFFFF",
  sidebarAccent:  "#F1F5F9",
  sidebarAccentFg:"#3B82F6",
  sidebarFg:      "#1E293B",
};

const DARK = {
  primary:        "#37D399",
  bgBase:         "#060D08",
  bgCard:         "#2C2E2D",
  border:         "#1a201a",
  borderSub:      "#232923",
  text:           "#e8ede8",
  textSub:        "#8a9a8a",
  muted:          "#0E120E",
  headerBg:       "#0E120E",
  rowHover:       "#1a201a",
  sidebarBg:      "#141714",
  sidebarAccent:  "#0E120E",
  sidebarAccentFg:"#37D399",
  sidebarFg:      "#e8ede8",
};

export function AntProvider({ children }: { children: React.ReactNode }) {
  const { theme, accentColor, themeRadius, language } = useAppSettings();
  const isDark = theme === "dark";
  const isRTL = language === "ar";
  const t = isDark ? DARK : LIGHT;
  const primary = accentColor || t.primary;

  const config = React.useMemo(() => ({
    algorithm: isDark ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm,
    token: {
      colorPrimary:           primary,
      colorBgBase:            t.bgBase,
      colorBgContainer:       t.bgCard,
      colorBgLayout:          t.bgBase,
      colorBorder:            t.border,
      colorBorderSecondary:   t.borderSub,
      colorText:              t.text,
      colorTextSecondary:     t.textSub,
      colorTextTertiary:      t.textSub,
      colorTextQuaternary:    t.textSub,
      colorFill:              t.muted,
      colorFillAlter:         isDark ? "#1a1f1a" : "#F8FAFC",
      colorFillSecondary:     t.muted,
      borderRadius:           themeRadius,
      borderRadiusLG:         Math.min(themeRadius + 2, 20),
      borderRadiusSM:         Math.max(themeRadius - 2, 0),
      borderRadiusXS:         Math.max(themeRadius - 4, 0),
      fontFamily:             "inherit",
      fontSize:               14,
      fontSizeSM:             12,
      lineHeight:             1.5,
      colorError:             "#EF4444",
      colorWarning:           "#F59E0B",
      colorSuccess:           "#10B981",
      colorInfo:              "#3B82F6",
      controlHeight:          34,
      controlHeightSM:        28,
      controlHeightLG:        40,
      paddingContentVertical: 10,
      boxShadow:              "0 1px 3px 0 rgb(0 0 0 / 0.08), 0 1px 2px -1px rgb(0 0 0 / 0.05)",
      boxShadowSecondary:     "0 4px 6px -1px rgb(0 0 0 / 0.07), 0 2px 4px -2px rgb(0 0 0 / 0.05)",
    },
    components: {
      Menu: {
        itemBg:               "transparent",
        subMenuItemBg:        "transparent",
        itemSelectedBg:       t.sidebarAccent,
        itemHoverBg:          isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
        itemSelectedColor:    primary,
        itemColor:            isDark ? "rgba(232,237,232,0.6)" : "rgba(30,41,59,0.6)",
        itemHoverColor:       t.sidebarFg,
        groupTitleColor:      isDark ? "rgba(138,154,138,0.45)" : "rgba(100,116,139,0.5)",
        groupTitleFontSize:   10,
        activeBarBorderSize:  0,
        activeBarWidth:       0,
        itemBorderRadius:     8,
        itemMarginInline:     6,
        itemMarginBlock:      1,
        itemPaddingInline:    12,
        iconSize:             15,
        iconMarginInlineEnd:  10,
        popupBg:              t.sidebarBg,
        darkPopupBg:          t.sidebarBg,
      },
      Table: {
        headerBg:             t.headerBg,
        rowHoverBg:           t.rowHover,
        borderColor:          t.border,
        headerSplitColor:     "transparent",
        headerColor:          t.textSub,
        rowSelectedBg:        isDark ? "#1a2a1a" : "#EFF6FF",
        rowSelectedHoverBg:   isDark ? "#1f2f1f" : "#DBEAFE",
        cellPaddingBlock:     10,
        cellPaddingInline:    14,
      },
      Card: {
        paddingLG:            16,
        headerBg:             "transparent",
      },
      Modal: {
        titleFontSize:        15,
        paddingMD:            24,
        headerBg:             t.bgCard,
      },
      Form: {
        labelFontSize:        13,
        verticalLabelPadding: "0 0 5px",
        itemMarginBottom:     16,
      },
      Button: {
        primaryShadow:        "none",
        defaultShadow:        "none",
        dangerShadow:         "none",
      },
      Input: {
        paddingInline:        12,
        colorBgContainer:     t.bgCard,
        activeBorderColor:    primary,
        hoverBorderColor:     t.borderSub,
      },
      InputNumber: {
        paddingInline:        12,
        colorBgContainer:     t.bgCard,
      },
      Select: {
        optionPadding:        "6px 12px",
        colorBgContainer:     t.bgCard,
        selectorBg:           t.bgCard,
      },
      DatePicker: {
        colorBgContainer:     t.bgCard,
        colorBgElevated:      t.bgCard,
      },
      Segmented: {
        trackBg:              t.muted,
        itemSelectedBg:       t.bgCard,
        itemSelectedColor:    t.text,
      },
      Statistic: {
        titleFontSize:        13,
        contentFontSize:      24,
      },
      Tag: {
        defaultBg:            t.muted,
      },
      Progress: {
        defaultColor:         primary,
      },
      Breadcrumb: {
        linkColor:            t.textSub,
        linkHoverColor:       primary,
        lastItemColor:        t.text,
        separatorColor:       t.borderSub,
        fontSize:             13,
      },
      Layout: {
        headerBg:             t.bgCard,
        headerHeight:         56,
        siderBg:              t.sidebarBg,
        triggerBg:            t.sidebarAccent,
        triggerColor:         t.sidebarFg,
      },
      Dropdown: {
        colorBgElevated:      t.bgCard,
      },
      Popover: {
        colorBgElevated:      t.bgCard,
      },
    },
  }), [isDark, t, primary, themeRadius]);

  return (
    <StyleProvider layer>
      <ConfigProvider theme={config} direction={isRTL ? "rtl" : "ltr"}>
        <div className="antd-scope" dir={isRTL ? "rtl" : "ltr"} style={{ display: "contents" }}>
          {children}
        </div>
      </ConfigProvider>
    </StyleProvider>
  );
}
