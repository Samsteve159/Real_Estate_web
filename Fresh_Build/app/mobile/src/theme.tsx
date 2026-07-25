import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

/* ============================================================= *
 *  Design system — a calm, trustworthy PLATFORM look.
 *  Light + dark, switchable. Neutral base + one confident accent.
 *  Deliberately simple + legible (audience 25+).
 *
 *  NOTE: palette is PROVISIONAL — final colours to be set with AK.
 *  Not black + gold (that's Manifest). Accent = teal.
 *  Everything reads from tokens, so the final palette drops in here.
 * ============================================================= */

export type ThemeColors = {
  bg: string;
  surface: string;
  surface2: string;
  surface3: string;
  text: string;
  muted: string;
  dim: string;
  accent: string;
  accentText: string;   // text/icon colour that sits ON an accent fill
  accentWash: string;   // faint accent tint for gold-wash-style cards
  line: string;
  lineAccent: string;
  good: string;
  warn: string;
  danger: string;
};

const light: ThemeColors = {
  bg: "#f6f8f7",
  surface: "#ffffff",
  surface2: "#eef1f0",
  surface3: "#e3e8e6",
  text: "#141b19",
  muted: "#586460",
  dim: "#8a938f",
  accent: "#0f7d74",
  accentText: "#ffffff",
  accentWash: "rgba(15,125,116,0.08)",
  line: "rgba(20,27,25,0.10)",
  lineAccent: "rgba(15,125,116,0.26)",
  good: "#1f9d63",
  warn: "#b9791f",
  danger: "#c2453c",
};

const dark: ThemeColors = {
  bg: "#0e1513",
  surface: "#161e1b",
  surface2: "#1e2823",
  surface3: "#27332d",
  text: "#eef2f0",
  muted: "#a4aea9",
  dim: "#727d78",
  accent: "#2bb9a4",
  accentText: "#04211d",
  accentWash: "rgba(43,185,164,0.10)",
  line: "rgba(255,255,255,0.10)",
  lineAccent: "rgba(43,185,164,0.28)",
  good: "#3fbd80",
  warn: "#d8a24a",
  danger: "#e06a60",
};

export const palettes = { light, dark };

/* ---- Non-colour tokens ---- */
export const radius = { sm: 8, md: 12, lg: 16, xl: 22, pill: 999 } as const;

/** 4pt spacing scale. */
export const sp = (n: number) => n * 4;

/** Type scale — sizes/weights only; colour is applied from theme at usage. */
export const type = {
  h1: { fontSize: 32, fontWeight: "700" as const, letterSpacing: -0.5 },
  h2: { fontSize: 24, fontWeight: "700" as const, letterSpacing: -0.3 },
  h3: { fontSize: 18, fontWeight: "600" as const },
  body: { fontSize: 15, fontWeight: "400" as const, lineHeight: 23 },
  eyebrow: { fontSize: 11, fontWeight: "700" as const, letterSpacing: 2.4, textTransform: "uppercase" as const },
  label: { fontSize: 11, fontWeight: "700" as const, letterSpacing: 1.4, textTransform: "uppercase" as const },
};

/* ============================================================= *
 *  Theme context — mode + resolved palette + toggle (persisted).
 * ============================================================= */
type Mode = "light" | "dark" | "system";

type ThemeCtx = {
  c: ThemeColors;
  isDark: boolean;
  mode: Mode;
  setMode: (m: Mode) => void;
  toggle: () => void;
};

const Ctx = createContext<ThemeCtx | null>(null);
const KEY = "app.theme.mode.v1";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const system = useColorScheme(); // 'light' | 'dark' | null
  const [mode, setModeState] = useState<Mode>("system");

  useEffect(() => {
    // Web-only deep-link override (?theme=dark|light) — handy for previews/screenshots.
    if (typeof window !== "undefined" && window.location?.search) {
      const q = new URLSearchParams(window.location.search).get("theme");
      if (q === "light" || q === "dark") { setModeState(q); return; }
    }
    AsyncStorage.getItem(KEY).then((v) => {
      if (v === "light" || v === "dark" || v === "system") setModeState(v);
    });
  }, []);

  const setMode = useCallback((m: Mode) => {
    setModeState(m);
    AsyncStorage.setItem(KEY, m).catch(() => {});
  }, []);

  const isDark = mode === "system" ? system !== "light" : mode === "dark";
  const c = isDark ? dark : light;

  const toggle = useCallback(() => setMode(isDark ? "light" : "dark"), [isDark, setMode]);

  const value = useMemo(() => ({ c, isDark, mode, setMode, toggle }), [c, isDark, mode, setMode, toggle]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useTheme(): ThemeCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
