import React, { createContext, useContext, useState, useEffect } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

export type ThemeMode = "light" | "dark";

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

// ─── Default Base Colors ──────────────────────────────────────────────────────

const BASE_COLORS = {
  light: {
    background:      "#F8FAFC",
    foreground:      "#1E293B",
    card:            "#FFFFFF",
    cardForeground:  "#1E293B",
    primary:         "#3B82F6",
    primaryFg:       "#FFFFFF",
    secondary:       "#FFFFFF",
    secondaryFg:     "#1E293B",
    muted:           "#F8FAFC",
    mutedFg:         "#64748B",
    accent:          "#3B82F6",
    accentFg:        "#FFFFFF",
    border:          "#E2E8F0",
    input:           "#F8FAFC",
    sidebar:         "#FFFFFF",
  },
  dark: {
    background:      "#060D08",
    foreground:      "#e8ede8",
    card:            "#2C2E2D",
    cardForeground:  "#e8ede8",
    primary:         "#37D399",
    primaryFg:       "#0f1f16",
    secondary:       "#2C2E2D",
    secondaryFg:     "#e8ede8",
    muted:           "#060D08",
    mutedFg:         "#8a9a8a",
    accent:          "#37D399",
    accentFg:        "#0f1f16",
    border:          "#1a201a",
    input:           "#060D08",
    sidebar:         "#141714",
  },
};

function applyBaseColors(mode: ThemeMode) {
  const c = BASE_COLORS[mode];
  const root = document.documentElement;
  root.style.setProperty("--background",                 c.background);
  root.style.setProperty("--foreground",                 c.foreground);
  root.style.setProperty("--card",                       c.card);
  root.style.setProperty("--card-foreground",            c.cardForeground);
  root.style.setProperty("--popover",                    c.card);
  root.style.setProperty("--popover-foreground",         c.cardForeground);
  root.style.setProperty("--primary",                    c.primary);
  root.style.setProperty("--primary-foreground",         c.primaryFg);
  root.style.setProperty("--secondary",                  c.secondary);
  root.style.setProperty("--secondary-foreground",       c.secondaryFg);
  root.style.setProperty("--muted",                      c.muted);
  root.style.setProperty("--muted-foreground",           c.mutedFg);
  root.style.setProperty("--accent",                     c.accent);
  root.style.setProperty("--accent-foreground",          c.accentFg);
  root.style.setProperty("--border",                     c.border);
  root.style.setProperty("--input",                      c.input);
  root.style.setProperty("--ring",                       c.primary);
  root.style.setProperty("--sidebar",                    c.sidebar);
  root.style.setProperty("--sidebar-foreground",         c.foreground);
  root.style.setProperty("--sidebar-primary",            c.primary);
  root.style.setProperty("--sidebar-primary-foreground", c.primaryFg);
  root.style.setProperty("--sidebar-accent",             c.background);
  root.style.setProperty("--sidebar-accent-foreground",  c.accent);
  root.style.setProperty("--sidebar-border",             c.border);
  root.style.setProperty("--sidebar-ring",               c.primary);
}

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

  // Freeform accent color (hex) — drives antd colorPrimary
  accentColor: string;
  setAccentColor: (hex: string) => void;

  // Border radius (drives antd borderRadius token + CSS --radius vars)
  themeRadius: number;
  setThemeRadius: (r: number) => void;

  // Theme presets
  preset: string | null;
  setPreset: (presetId: string | null) => void;
  presets: ThemePreset[];
  currentPreset: ThemePreset | null;

  // Locale
  language: string;
  setLanguage: (lang: string) => void;
  financialYear: string;
  setFinancialYear: (year: string) => void;

  // Branch
  branches: Branch[];
  currentBranch: Branch;
  setBranch: (branchId: string) => void;

  // POS display
  posCardStyle: "card" | "compact" | "list";
  setPOSCardStyle: (style: "card" | "compact" | "list") => void;
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

// ─── Branches ─────────────────────────────────────────────────────────────────

const BRANCHES: Branch[] = [
  { id: "hq",  name: "Main Branch",   location: "New York, USA", initials: "HQ" },
  { id: "cai", name: "Cairo Branch",  location: "Cairo, Egypt",  initials: "CA" },
  { id: "dxb", name: "Dubai Branch",  location: "Dubai, UAE",    initials: "DB" },
  { id: "lon", name: "London Branch", location: "London, UK",    initials: "LN" },
];

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AppSettingsProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    return (localStorage.getItem("app-theme") as ThemeMode) ?? "dark";
  });

  const [accentColor, setAccentColorState] = useState<string>(() => {
    return localStorage.getItem("app-accent-color") ?? "";
  });

  const [themeRadius, setThemeRadiusState] = useState<number>(() => {
    const stored = localStorage.getItem("app-theme-radius");
    return stored ? Number(stored) : 6;
  });

  const [preset, setPresetState] = useState<string | null>(() => {
    return localStorage.getItem("app-preset") ?? null;
  });

  const [language, setLanguageState] = useState<string>(() => {
    return localStorage.getItem("app-language") ?? "en";
  });

  const [financialYear, setFinancialYearState] = useState("2025-2026");

  const [currentBranchId, setCurrentBranchId] = useState<string>(() => {
    return localStorage.getItem("app-branch") ?? "hq";
  });

  const [posCardStyle, setPOSCardStyleState] = useState<"card" | "compact" | "list">(() => {
    return (localStorage.getItem("app-pos-card-style") as "card" | "compact" | "list") ?? "card";
  });

  const [posGridCols, setPOSGridColsState] = useState<2 | 3 | 4 | 5>(() => {
    const stored = localStorage.getItem("app-pos-grid-cols");
    return stored ? (Number(stored) as 2 | 3 | 4 | 5) : 4;
  });

  // Toggle dark/light class + apply base colors
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    localStorage.setItem("app-theme", theme);
    applyBaseColors(theme);
  }, [theme]);

  // Apply preset CSS vars, or fall back to base colors when no preset
  useEffect(() => {
    const found = preset ? THEME_PRESETS.find((p) => p.id === preset) ?? null : null;

    if (!found) {
      applyBaseColors(theme);
      if (!preset) localStorage.removeItem("app-preset");
      return;
    }

    const root = document.documentElement;
    const c = found[theme];
    root.style.setProperty("--primary",              c.primary);
    root.style.setProperty("--primary-foreground",   c.primaryForeground);
    root.style.setProperty("--secondary",            c.secondary);
    root.style.setProperty("--secondary-foreground", c.secondaryForeground);
    root.style.setProperty("--background",           c.background);
    root.style.setProperty("--foreground",           c.foreground);
    root.style.setProperty("--card",                 c.card);
    root.style.setProperty("--card-foreground",      c.cardForeground);
    root.style.setProperty("--muted",                c.muted);
    root.style.setProperty("--muted-foreground",     c.mutedForeground);
    root.style.setProperty("--accent",               c.accent);
    root.style.setProperty("--accent-foreground",    c.accentForeground);
    root.style.setProperty("--border",               c.border);
    root.style.setProperty("--input",                c.input);
    root.style.setProperty("--chart-1",              c.chart1);
    root.style.setProperty("--chart-2",              c.chart2);
    root.style.setProperty("--chart-3",              c.chart3);
    root.style.setProperty("--chart-4",              c.chart4);
    root.style.setProperty("--chart-5",              c.chart5);
    if (preset) localStorage.setItem("app-preset", preset);
  }, [preset, theme]);

  // Apply radius CSS vars
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--radius",    `${themeRadius}px`);
    root.style.setProperty("--radius-sm", `${Math.max(themeRadius - 4, 0)}px`);
    root.style.setProperty("--radius-md", `${Math.max(themeRadius - 2, 0)}px`);
    root.style.setProperty("--radius-lg", `${themeRadius + 2}px`);
    root.style.setProperty("--radius-xl", `${themeRadius + 4}px`);
  }, [themeRadius]);

  // Sync dir + lang to <html>
  useEffect(() => {
    document.documentElement.setAttribute("dir",  language === "ar" ? "rtl" : "ltr");
    document.documentElement.setAttribute("lang", language);
  }, [language]);

  const toggleTheme = () => setTheme((p) => (p === "light" ? "dark" : "light"));
  const setMode     = (mode: ThemeMode) => setTheme(mode);

  const setAccentColor = (hex: string) => {
    setAccentColorState(hex);
    if (hex) {
      localStorage.setItem("app-accent-color", hex);
      document.documentElement.style.setProperty("--primary",         hex);
      document.documentElement.style.setProperty("--ring",            hex);
      document.documentElement.style.setProperty("--sidebar-primary", hex);
    } else {
      localStorage.removeItem("app-accent-color");
    }
  };

  const setThemeRadius = (r: number) => {
    setThemeRadiusState(r);
    localStorage.setItem("app-theme-radius", String(r));
    const root = document.documentElement;
    root.style.setProperty("--radius",    `${r}px`);
    root.style.setProperty("--radius-sm", `${Math.max(r - 4, 0)}px`);
    root.style.setProperty("--radius-md", `${Math.max(r - 2, 0)}px`);
    root.style.setProperty("--radius-lg", `${r + 2}px`);
    root.style.setProperty("--radius-xl", `${r + 4}px`);
  };

  const setPreset = (presetId: string | null) => setPresetState(presetId);

  const setLanguage = (lang: string) => {
    setLanguageState(lang);
    localStorage.setItem("app-language", lang);
  };

  const setFinancialYear = (year: string) => setFinancialYearState(year);

  const setBranch = (branchId: string) => {
    setCurrentBranchId(branchId);
    localStorage.setItem("app-branch", branchId);
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
  const currentPreset = preset ? THEME_PRESETS.find((p) => p.id === preset) ?? null : null;

  return (
    <AppSettingsContext.Provider
      value={{
        theme,
        toggleTheme,
        setMode,
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

/** @deprecated Use useAppSettings() */
export function useSettings() {
  const { theme, toggleTheme, language, setLanguage, financialYear, setFinancialYear } =
    useAppSettings();
  return { theme, toggleTheme, language, setLanguage, financialYear, setFinancialYear };
}

/** @deprecated Use useAppSettings() */
export function useThemePreset() {
  const { currentPreset, setPreset, presets } = useAppSettings();
  return { currentPreset: currentPreset ?? presets[0], setPreset, presets };
}
