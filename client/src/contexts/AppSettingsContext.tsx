import React, { createContext, useContext, useState, useEffect } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

export type ThemeMode = "light" | "dark";
export type ColorScheme = "default" | "darkgreen";
export type ThemeColor = "blue" | "purple" | "green" | "orange" | "red" | "pink";

export interface ThemeColors {
  background: string;
  surface: string;
  border: string;
  accent: string;
  textPrimary: string;
  textSecondary: string;
  sidebar: string;
}

export interface ColorSchemeDefinition {
  id: ColorScheme;
  name: string;
  light: ThemeColors;
  dark: ThemeColors;
}

export interface ThemePreset {
  id: string;
  name: string;
  label: string;
  light: {
    primary: string;
    primaryForeground: string;
    primaryLight: string;
    primaryDark: string;
    secondary: string;
    secondaryForeground: string;
    secondaryLight: string;
    background: string;
    foreground: string;
    card: string;
    cardForeground: string;
    muted: string;
    mutedForeground: string;
    accent: string;
    accentForeground: string;
    border: string;
    input: string;
    success: string;
    warning: string;
    error: string;
    info: string;
    chart1: string;
    chart2: string;
    chart3: string;
    chart4: string;
    chart5: string;
  };
  dark: {
    primary: string;
    primaryForeground: string;
    primaryLight: string;
    primaryDark: string;
    secondary: string;
    secondaryForeground: string;
    secondaryLight: string;
    background: string;
    foreground: string;
    card: string;
    cardForeground: string;
    muted: string;
    mutedForeground: string;
    accent: string;
    accentForeground: string;
    border: string;
    input: string;
    success: string;
    warning: string;
    error: string;
    info: string;
    chart1: string;
    chart2: string;
    chart3: string;
    chart4: string;
    chart5: string;
  };
}

// ─── Color Scheme Definitions ─────────────────────────────────────────────────

const COLOR_SCHEMES: Record<ColorScheme, ColorSchemeDefinition> = {
  default: {
    id: "default",
    name: "Default",
    light: {
      background: "#F8FAFC",
      surface: "#FFFFFF",
      border: "#E2E8F0",
      accent: "#3B82F6",
      textPrimary: "#1E293B",
      textSecondary: "#64748B",
      sidebar: "#FFFFFF",
    },
    dark: {
      background: "#0F1729",
      surface: "#1a2847",
      border: "#2d3e5f",
      accent: "#3B82F6",
      textPrimary: "#E8EAED",
      textSecondary: "#B0B5C0",
      sidebar: "#0d1420",
    },
  },
  darkgreen: {
    id: "darkgreen",
    name: "Dark Green",
    light: {
      background: "#F0FDF4",
      surface: "#FFFFFF",
      border: "#BBFBEE",
      accent: "#3ddc84",
      textPrimary: "#0F2F1F",
      textSecondary: "#4B5563",
      sidebar: "#ECFDF5",
    },
    dark: {
      background: "#060D08",
      surface: "#2C2E2D",
      border: "#1a201a",
      accent: "#37D399",
      textPrimary: "#e8ede8",
      textSecondary: "#8a9a8a",
      sidebar: "#141714",
    },
  },
};

// ─── Theme Color (Accent Color Override) ──────────────────────────────────────

const THEME_COLOR_MAP: Record<ThemeColor, { primary: string; sidebar: string; chart: string[] }> = {
  blue: {
    primary: "#0066CC",
    sidebar: "#0052A3",
    chart: ["#3B82F6", "#0066CC", "#0052A3", "#003D7A", "#002E5C"],
  },
  purple: {
    primary: "#7C3AED",
    sidebar: "#6D28D9",
    chart: ["#A78BFA", "#7C3AED", "#6D28D9", "#5B21B6", "#4C1D95"],
  },
  green: {
    primary: "#10B981",
    sidebar: "#059669",
    chart: ["#6EE7B7", "#10B981", "#059669", "#047857", "#065F46"],
  },
  orange: {
    primary: "#F97316",
    sidebar: "#EA580C",
    chart: ["#FDBA74", "#F97316", "#EA580C", "#C2410C", "#92220C"],
  },
  red: {
    primary: "#EF4444",
    sidebar: "#DC2626",
    chart: ["#FCA5A5", "#EF4444", "#DC2626", "#B91C1C", "#7F1D1D"],
  },
  pink: {
    primary: "#EC4899",
    sidebar: "#DB2777",
    chart: ["#F472B6", "#EC4899", "#DB2777", "#BE185D", "#831843"],
  },
};

// ─── Theme Presets ────────────────────────────────────────────────────────────

const THEME_PRESETS: ThemePreset[] = [
  {
    id: "ocean",
    name: "Ocean",
    label: "Ocean Blue",
    light: {
      primary: "#0066CC", primaryForeground: "#FFFFFF", primaryLight: "#E6F2FF", primaryDark: "#004499",
      secondary: "#00B4D8", secondaryForeground: "#FFFFFF", secondaryLight: "#E0F7FF",
      background: "#FFFFFF", foreground: "#1A1A1A", card: "#F8FBFF", cardForeground: "#1A1A1A",
      muted: "#F0F4F8", mutedForeground: "#666666", accent: "#0099FF", accentForeground: "#FFFFFF",
      border: "#E0E8F0", input: "#FFFFFF",
      success: "#10B981", warning: "#F59E0B", error: "#EF4444", info: "#3B82F6",
      chart1: "#0066CC", chart2: "#00B4D8", chart3: "#0099FF", chart4: "#004499", chart5: "#003366",
    },
    dark: {
      primary: "#4DA6FF", primaryForeground: "#000000", primaryLight: "#1A3A66", primaryDark: "#0052A3",
      secondary: "#00D4FF", secondaryForeground: "#000000", secondaryLight: "#1A4D5C",
      background: "#0F1419", foreground: "#E8EAED", card: "#1A2332", cardForeground: "#E8EAED",
      muted: "#2A3340", mutedForeground: "#9CA3AF", accent: "#4DA6FF", accentForeground: "#000000",
      border: "#2A3F5F", input: "#1A2332",
      success: "#34D399", warning: "#FBBF24", error: "#F87171", info: "#60A5FA",
      chart1: "#4DA6FF", chart2: "#00D4FF", chart3: "#0099FF", chart4: "#6BB6FF", chart5: "#99CCFF",
    },
  },
  {
    id: "forest",
    name: "Forest",
    label: "Forest Green",
    light: {
      primary: "#059669", primaryForeground: "#FFFFFF", primaryLight: "#ECFDF5", primaryDark: "#047857",
      secondary: "#10B981", secondaryForeground: "#FFFFFF", secondaryLight: "#D1FAE5",
      background: "#FFFFFF", foreground: "#1A1A1A", card: "#F0FDF4", cardForeground: "#1A1A1A",
      muted: "#F3F4F6", mutedForeground: "#666666", accent: "#34D399", accentForeground: "#000000",
      border: "#D1E7DD", input: "#FFFFFF",
      success: "#059669", warning: "#F59E0B", error: "#EF4444", info: "#0EA5E9",
      chart1: "#059669", chart2: "#10B981", chart3: "#34D399", chart4: "#6EE7B7", chart5: "#A7F3D0",
    },
    dark: {
      primary: "#4ADE80", primaryForeground: "#000000", primaryLight: "#1B4D2E", primaryDark: "#15803D",
      secondary: "#86EFAC", secondaryForeground: "#000000", secondaryLight: "#1F4D2A",
      background: "#0F1419", foreground: "#E8EAED", card: "#1A2E1F", cardForeground: "#E8EAED",
      muted: "#2A3F2F", mutedForeground: "#9CA3AF", accent: "#4ADE80", accentForeground: "#000000",
      border: "#2D5A3D", input: "#1A2E1F",
      success: "#4ADE80", warning: "#FBBF24", error: "#F87171", info: "#38BDF8",
      chart1: "#4ADE80", chart2: "#86EFAC", chart3: "#6EE7B7", chart4: "#A7F3D0", chart5: "#BBFBAC",
    },
  },
  {
    id: "sunset",
    name: "Sunset",
    label: "Sunset Orange",
    light: {
      primary: "#EA580C", primaryForeground: "#FFFFFF", primaryLight: "#FEF3C7", primaryDark: "#D97706",
      secondary: "#F59E0B", secondaryForeground: "#FFFFFF", secondaryLight: "#FEF3C7",
      background: "#FFFFFF", foreground: "#1A1A1A", card: "#FFFBF0", cardForeground: "#1A1A1A",
      muted: "#F9F5F0", mutedForeground: "#666666", accent: "#FB923C", accentForeground: "#FFFFFF",
      border: "#FED7AA", input: "#FFFFFF",
      success: "#10B981", warning: "#EA580C", error: "#EF4444", info: "#0EA5E9",
      chart1: "#EA580C", chart2: "#F59E0B", chart3: "#FB923C", chart4: "#FBBF24", chart5: "#FCD34D",
    },
    dark: {
      primary: "#FB923C", primaryForeground: "#000000", primaryLight: "#4D2F1A", primaryDark: "#B45309",
      secondary: "#FBBF24", secondaryForeground: "#000000", secondaryLight: "#4D3A1A",
      background: "#0F1419", foreground: "#E8EAED", card: "#2A1F14", cardForeground: "#E8EAED",
      muted: "#3A2F24", mutedForeground: "#9CA3AF", accent: "#FB923C", accentForeground: "#000000",
      border: "#5A4A3A", input: "#2A1F14",
      success: "#34D399", warning: "#FB923C", error: "#F87171", info: "#38BDF8",
      chart1: "#FB923C", chart2: "#FBBF24", chart3: "#FCD34D", chart4: "#FDE047", chart5: "#FEFCE8",
    },
  },
  {
    id: "amethyst",
    name: "Amethyst",
    label: "Purple Amethyst",
    light: {
      primary: "#7C3AED", primaryForeground: "#FFFFFF", primaryLight: "#F5F3FF", primaryDark: "#6D28D9",
      secondary: "#A78BFA", secondaryForeground: "#FFFFFF", secondaryLight: "#EDE9FE",
      background: "#FFFFFF", foreground: "#1A1A1A", card: "#FAF5FF", cardForeground: "#1A1A1A",
      muted: "#F4F3F6", mutedForeground: "#666666", accent: "#C4B5FD", accentForeground: "#000000",
      border: "#E9D5FF", input: "#FFFFFF",
      success: "#10B981", warning: "#F59E0B", error: "#EF4444", info: "#0EA5E9",
      chart1: "#7C3AED", chart2: "#A78BFA", chart3: "#C4B5FD", chart4: "#D8B4FE", chart5: "#E9D5FF",
    },
    dark: {
      primary: "#C4B5FD", primaryForeground: "#000000", primaryLight: "#3F2A5F", primaryDark: "#5B21B6",
      secondary: "#D8B4FE", secondaryForeground: "#000000", secondaryLight: "#4A3A5F",
      background: "#0F1419", foreground: "#E8EAED", card: "#1F1A2E", cardForeground: "#E8EAED",
      muted: "#2F2A3F", mutedForeground: "#9CA3AF", accent: "#C4B5FD", accentForeground: "#000000",
      border: "#4A3F5F", input: "#1F1A2E",
      success: "#34D399", warning: "#FBBF24", error: "#F87171", info: "#38BDF8",
      chart1: "#C4B5FD", chart2: "#D8B4FE", chart3: "#E9D5FF", chart4: "#F3E8FF", chart5: "#FAF5FF",
    },
  },
  {
    id: "slate",
    name: "Slate",
    label: "Professional Slate",
    light: {
      primary: "#475569", primaryForeground: "#FFFFFF", primaryLight: "#F1F5F9", primaryDark: "#334155",
      secondary: "#64748B", secondaryForeground: "#FFFFFF", secondaryLight: "#E2E8F0",
      background: "#FFFFFF", foreground: "#1E293B", card: "#F8FAFC", cardForeground: "#1E293B",
      muted: "#F1F5F9", mutedForeground: "#64748B", accent: "#94A3B8", accentForeground: "#FFFFFF",
      border: "#CBD5E1", input: "#FFFFFF",
      success: "#10B981", warning: "#F59E0B", error: "#EF4444", info: "#0EA5E9",
      chart1: "#475569", chart2: "#64748B", chart3: "#94A3B8", chart4: "#CBD5E1", chart5: "#E2E8F0",
    },
    dark: {
      primary: "#CBD5E1", primaryForeground: "#000000", primaryLight: "#334155", primaryDark: "#1E293B",
      secondary: "#E2E8F0", secondaryForeground: "#000000", secondaryLight: "#475569",
      background: "#0F172A", foreground: "#F1F5F9", card: "#1E293B", cardForeground: "#F1F5F9",
      muted: "#334155", mutedForeground: "#94A3B8", accent: "#CBD5E1", accentForeground: "#000000",
      border: "#475569", input: "#1E293B",
      success: "#34D399", warning: "#FBBF24", error: "#F87171", info: "#38BDF8",
      chart1: "#CBD5E1", chart2: "#E2E8F0", chart3: "#94A3B8", chart4: "#64748B", chart5: "#475569",
    },
  },
];

// ─── Context Type ─────────────────────────────────────────────────────────────

interface AppSettingsContextType {
  // Dark/Light mode
  theme: ThemeMode;
  toggleTheme: () => void;
  setMode: (mode: ThemeMode) => void;

  // Color scheme (darkgreen / default)
  colorScheme: ColorScheme;
  setColorScheme: (scheme: ColorScheme) => void;
  colorSchemes: ColorSchemeDefinition[];
  currentColors: ThemeColors;

  // Accent color override
  themeColor: ThemeColor;
  setThemeColor: (color: ThemeColor) => void;

  // Freeform accent color (hex) — drives antd colorPrimary
  accentColor: string;
  setAccentColor: (hex: string) => void;

  // Border radius preset (drives antd borderRadius token)
  themeRadius: number;
  setThemeRadius: (r: number) => void;

  // Presets
  preset: string | null;
  setPreset: (presetId: string | null) => void;
  presets: ThemePreset[];
  currentPreset: ThemePreset | null;

  // App settings
  language: string;
  setLanguage: (lang: string) => void;
  financialYear: string;
  setFinancialYear: (year: string) => void;

  // Branch
  branches: Branch[];
  currentBranch: Branch;
  setBranch: (branchId: string) => void;

  // PIN lock screen style
  pinStyle: 1 | 2 | 3;
  setPinStyle: (style: 1 | 2 | 3) => void;

  // Definitions tab orientation
  definitionsTabPosition: "top" | "left";
  setDefinitionsTabPosition: (pos: "top" | "left") => void;

  // Definitions page layout (vertical left-nav vs horizontal top-nav)
  definitionsLayout: "vertical" | "horizontal";
  setDefinitionsLayout: (layout: "vertical" | "horizontal") => void;

  // Settings page layout (vertical left-nav vs horizontal top-nav)
  settingsLayout: "vertical" | "horizontal";
  setSettingsLayout: (layout: "vertical" | "horizontal") => void;

  // Definitions CRUD form style (drawer or modal)
  definitionsCrudStyle: "drawer" | "modal";
  setDefinitionsCrudStyle: (style: "drawer" | "modal") => void;

  // POS product card visual style
  posCardStyle: "card" | "compact" | "list";
  setPOSCardStyle: (style: "card" | "compact" | "list") => void;

  // POS product grid columns (per row)
  posGridCols: 2 | 3 | 4 | 5;
  setPOSGridCols: (cols: 2 | 3 | 4 | 5) => void;
}

export interface Branch {
  id: string;
  name: string;
  location: string;
  initials: string;
}

const AppSettingsContext = createContext<AppSettingsContextType | undefined>(undefined);

// ─── CSS Variable Application ─────────────────────────────────────────────────

function applyColorScheme(colors: ThemeColors, mode: ThemeMode) {
  const root = document.documentElement;
  root.style.setProperty("--background", colors.background);
  root.style.setProperty("--foreground", colors.textPrimary);
  root.style.setProperty("--card", colors.surface);
  root.style.setProperty("--card-foreground", colors.textPrimary);
  root.style.setProperty("--popover", colors.surface);
  root.style.setProperty("--popover-foreground", colors.textPrimary);
  root.style.setProperty("--primary", colors.accent);
  root.style.setProperty("--primary-foreground", mode === "dark" ? "#0f1f16" : "#FFFFFF");
  root.style.setProperty("--secondary", colors.surface);
  root.style.setProperty("--secondary-foreground", colors.textPrimary);
  root.style.setProperty("--muted", colors.background);
  root.style.setProperty("--muted-foreground", colors.textSecondary);
  root.style.setProperty("--accent", colors.accent);
  root.style.setProperty("--accent-foreground", mode === "dark" ? "#0f1f16" : "#FFFFFF");
  root.style.setProperty("--border", colors.border);
  root.style.setProperty("--input", colors.background);
  root.style.setProperty("--ring", colors.accent);
  root.style.setProperty("--sidebar", colors.sidebar);
  root.style.setProperty("--sidebar-foreground", colors.textPrimary);
  root.style.setProperty("--sidebar-primary", colors.accent);
  root.style.setProperty("--sidebar-primary-foreground", mode === "dark" ? "#0f1f16" : "#FFFFFF");
  root.style.setProperty("--sidebar-accent", colors.background);
  root.style.setProperty("--sidebar-accent-foreground", colors.accent);
  root.style.setProperty("--sidebar-border", colors.border);
  root.style.setProperty("--sidebar-ring", colors.accent);
  root.style.setProperty("--form-bg", colors.sidebar);
  root.style.setProperty("--form-text", colors.textPrimary);
  root.style.setProperty("--form-border", colors.border);
}

// ─── Branches ─────────────────────────────────────────────────────────────────

const BRANCHES: Branch[] = [
  { id: "hq",   name: "Main Branch",       location: "New York, USA",   initials: "HQ" },
  { id: "cai",  name: "Cairo Branch",      location: "Cairo, Egypt",    initials: "CA" },
  { id: "dxb",  name: "Dubai Branch",      location: "Dubai, UAE",      initials: "DB" },
  { id: "lon",  name: "London Branch",     location: "London, UK",      initials: "LN" },
];

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AppSettingsProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    return (localStorage.getItem("app-theme") as ThemeMode) ?? "dark";
  });

  const [colorScheme, setColorSchemeState] = useState<ColorScheme>(() => {
    return (localStorage.getItem("app-color-scheme") as ColorScheme) ?? "darkgreen";
  });

  const [themeColor, setThemeColorState] = useState<ThemeColor>("blue");

  const [accentColor, setAccentColorState] = useState<string>(() => {
    return localStorage.getItem("app-accent-color") ?? "";
  });

  const [themeRadius, setThemeRadiusState] = useState<number>(() => {
    const stored = localStorage.getItem("app-theme-radius");
    return stored ? Number(stored) : 6;
  });

  const [preset, setPresetState] = useState<string | null>(() => {
    return localStorage.getItem("app-preset");
  });

  const [language, setLanguageState] = useState<string>(() => {
    return localStorage.getItem("app-language") ?? "en";
  });

  const [financialYear, setFinancialYearState] = useState("2025-2026");

  const [currentBranchId, setCurrentBranchId] = useState<string>(() => {
    return localStorage.getItem("app-branch") ?? "hq";
  });

  const [pinStyle, setPinStyleState] = useState<1 | 2 | 3>(() => {
    const stored = localStorage.getItem("app-pin-style");
    return stored ? (Number(stored) as 1 | 2 | 3) : 3;
  });

  const [definitionsTabPosition, setDefinitionsTabPositionState] = useState<"top" | "left">(() => {
    return (localStorage.getItem("app-definitions-tab-pos") as "top" | "left") ?? "left";
  });

  const [definitionsLayout, setDefinitionsLayoutState] = useState<"vertical" | "horizontal">(() => {
    return (localStorage.getItem("app-definitions-layout") as "vertical" | "horizontal") ?? "vertical";
  });

  const [settingsLayout, setSettingsLayoutState] = useState<"vertical" | "horizontal">(() => {
    return (localStorage.getItem("app-settings-layout") as "vertical" | "horizontal") ?? "vertical";
  });

  const [definitionsCrudStyle, setDefinitionsCrudStyleState] = useState<"drawer" | "modal">(() => {
    return (localStorage.getItem("app-definitions-crud-style") as "drawer" | "modal") ?? "drawer";
  });

  const [posCardStyle, setPOSCardStyleState] = useState<"card" | "compact" | "list">(() => {
    return (localStorage.getItem("app-pos-card-style") as "card" | "compact" | "list") ?? "card";
  });

  const [posGridCols, setPOSGridColsState] = useState<2 | 3 | 4 | 5>(() => {
    const stored = localStorage.getItem("app-pos-grid-cols");
    return stored ? (Number(stored) as 2 | 3 | 4 | 5) : 4;
  });

  // Apply dark/light class + CSS variables whenever theme or colorScheme changes
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    // Apply the color scheme CSS variables
    const colors = COLOR_SCHEMES[colorScheme][theme];
    applyColorScheme(colors, theme);

    localStorage.setItem("app-theme", theme);
    localStorage.setItem("app-color-scheme", colorScheme);
  }, [theme, colorScheme]);

  // Apply preset CSS variables on top of color scheme (if a preset is active)
  useEffect(() => {
    if (!preset) return;
    const found = THEME_PRESETS.find((p) => p.id === preset);
    if (!found) return;
    const root = document.documentElement;
    const colors = found[theme];
    root.style.setProperty("--primary", colors.primary);
    root.style.setProperty("--primary-foreground", colors.primaryForeground);
    root.style.setProperty("--secondary", colors.secondary);
    root.style.setProperty("--secondary-foreground", colors.secondaryForeground);
    root.style.setProperty("--background", colors.background);
    root.style.setProperty("--foreground", colors.foreground);
    root.style.setProperty("--card", colors.card);
    root.style.setProperty("--card-foreground", colors.cardForeground);
    root.style.setProperty("--muted", colors.muted);
    root.style.setProperty("--muted-foreground", colors.mutedForeground);
    root.style.setProperty("--accent", colors.accent);
    root.style.setProperty("--accent-foreground", colors.accentForeground);
    root.style.setProperty("--border", colors.border);
    root.style.setProperty("--input", colors.input);
    root.style.setProperty("--chart-1", colors.chart1);
    root.style.setProperty("--chart-2", colors.chart2);
    root.style.setProperty("--chart-3", colors.chart3);
    root.style.setProperty("--chart-4", colors.chart4);
    root.style.setProperty("--chart-5", colors.chart5);
    localStorage.setItem("app-preset", preset);
  }, [preset, theme]);

  const toggleTheme = () => setTheme((p) => (p === "light" ? "dark" : "light"));
  const setMode = (mode: ThemeMode) => setTheme(mode);

  const setColorScheme = (scheme: ColorScheme) => {
    setPresetState(null); // clear preset when switching base scheme
    localStorage.removeItem("app-preset");
    setColorSchemeState(scheme);
  };

  const setThemeColor = (color: ThemeColor) => {
    const colors = THEME_COLOR_MAP[color];
    document.documentElement.style.setProperty("--primary", colors.primary);
    document.documentElement.style.setProperty("--sidebar-primary", colors.sidebar);
    document.documentElement.style.setProperty("--chart-1", colors.chart[0]);
    document.documentElement.style.setProperty("--chart-2", colors.chart[1]);
    document.documentElement.style.setProperty("--chart-3", colors.chart[2]);
    document.documentElement.style.setProperty("--chart-4", colors.chart[3]);
    document.documentElement.style.setProperty("--chart-5", colors.chart[4]);
    setThemeColorState(color);
  };

  const setAccentColor = (hex: string) => {
    setAccentColorState(hex);
    localStorage.setItem("app-accent-color", hex);
    const root = document.documentElement;
    root.style.setProperty("--primary", hex);
    root.style.setProperty("--ring", hex);
    root.style.setProperty("--sidebar-primary", hex);
  };

  const setThemeRadius = (r: number) => {
    setThemeRadiusState(r);
    localStorage.setItem("app-theme-radius", String(r));
  };

  const setPreset = (presetId: string | null) => {
    setPresetState(presetId);
    if (!presetId) {
      localStorage.removeItem("app-preset");
      // Re-apply base color scheme
      const colors = COLOR_SCHEMES[colorScheme][theme];
      applyColorScheme(colors, theme);
    }
  };

  // Apply dir + lang to <html> whenever language changes
  useEffect(() => {
    const isRTL = language === "ar";
    document.documentElement.setAttribute("dir", isRTL ? "rtl" : "ltr");
    document.documentElement.setAttribute("lang", language);
  }, [language]);

  const setLanguage = (lang: string) => {
    setLanguageState(lang);
    localStorage.setItem("app-language", lang);
  };

  const setFinancialYear = (year: string) => setFinancialYearState(year);

  const setBranch = (branchId: string) => {
    setCurrentBranchId(branchId);
    localStorage.setItem("app-branch", branchId);
  };

  const setPinStyle = (style: 1 | 2 | 3) => {
    setPinStyleState(style);
    localStorage.setItem("app-pin-style", String(style));
  };

  const setDefinitionsTabPosition = (pos: "top" | "left") => {
    setDefinitionsTabPositionState(pos);
    localStorage.setItem("app-definitions-tab-pos", pos);
  };

  const setDefinitionsLayout = (layout: "vertical" | "horizontal") => {
    setDefinitionsLayoutState(layout);
    localStorage.setItem("app-definitions-layout", layout);
  };

  const setSettingsLayout = (layout: "vertical" | "horizontal") => {
    setSettingsLayoutState(layout);
    localStorage.setItem("app-settings-layout", layout);
  };

  const setDefinitionsCrudStyle = (style: "drawer" | "modal") => {
    setDefinitionsCrudStyleState(style);
    localStorage.setItem("app-definitions-crud-style", style);
  };

  const setPOSCardStyle = (style: "card" | "compact" | "list") => {
    setPOSCardStyleState(style);
    localStorage.setItem("app-pos-card-style", style);
  };

  const setPOSGridCols = (cols: 2 | 3 | 4 | 5) => {
    setPOSGridColsState(cols);
    localStorage.setItem("app-pos-grid-cols", String(cols));
  };

  const currentBranch = BRANCHES.find((b) => b.id === currentBranchId) ?? BRANCHES[0];
  const currentColors = COLOR_SCHEMES[colorScheme][theme];
  const currentPreset = preset ? THEME_PRESETS.find((p) => p.id === preset) ?? null : null;

  return (
    <AppSettingsContext.Provider
      value={{
        theme,
        toggleTheme,
        setMode,
        colorScheme,
        setColorScheme,
        colorSchemes: Object.values(COLOR_SCHEMES),
        currentColors,
        themeColor,
        setThemeColor,
        accentColor,
        setAccentColor,
        themeRadius,
        setThemeRadius,
        preset,
        setPreset,
        presets: THEME_PRESETS,
        currentPreset,
        language,
        setLanguage,
        financialYear,
        setFinancialYear,
        branches: BRANCHES,
        currentBranch,
        setBranch,
        pinStyle,
        setPinStyle,
        definitionsTabPosition,
        setDefinitionsTabPosition,
        definitionsLayout,
        setDefinitionsLayout,
        settingsLayout,
        setSettingsLayout,
        definitionsCrudStyle,
        setDefinitionsCrudStyle,
        posCardStyle,
        setPOSCardStyle,
        posGridCols,
        setPOSGridCols,
      }}
    >
      {children}
    </AppSettingsContext.Provider>
  );
}

// ─── Primary Hook ─────────────────────────────────────────────────────────────

export function useAppSettings() {
  const ctx = useContext(AppSettingsContext);
  if (!ctx) throw new Error("useAppSettings must be used within AppSettingsProvider");
  return ctx;
}

// ─── Backward-Compatible Hook Aliases ────────────────────────────────────────
// These keep existing consumers working without changes.

/** @deprecated Use useAppSettings() */
export function useSettings() {
  const { theme, toggleTheme, language, setLanguage, financialYear, setFinancialYear } =
    useAppSettings();
  return { theme, toggleTheme, language, setLanguage, financialYear, setFinancialYear };
}

/** @deprecated Use useAppSettings() */
export function useThemeColor() {
  const { themeColor, setThemeColor } = useAppSettings();
  return { themeColor, setThemeColor };
}

/** @deprecated Use useAppSettings() */
export function useThemePreset() {
  const { currentPreset, setPreset, presets } = useAppSettings();
  return {
    currentPreset: currentPreset ?? presets[0],
    setPreset,
    presets,
  };
}

/** @deprecated Use useAppSettings() */
export function useThemeSystem() {
  const { colorScheme, theme, setColorScheme, setMode, toggleTheme, colorSchemes, currentColors } =
    useAppSettings();
  return {
    theme: colorScheme,
    mode: theme,
    setTheme: setColorScheme,
    setMode,
    toggleMode: toggleTheme,
    themes: colorSchemes,
    currentColors,
  };
}
