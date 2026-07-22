/* Manifest design system — dark + gold (from knowledge/BRAND.md).
 * ~80% black/white, ~15% surfaces, ≤5% gold. Gold is the jewel. */

export const colors = {
  bg: "#0a0a0b",
  surface: "#141416",
  surface2: "#1c1c20",
  surface3: "#242429",
  text: "#f5f5f6",
  muted: "#a1a1aa",
  dim: "#71717a",
  gold: "#c2a267",
  goldBright: "#d4b87a",
  goldDim: "#9a7f4f",
  navy: "#003970",
  line: "rgba(255,255,255,0.10)",
  lineGold: "rgba(194,162,103,0.28)",
  goldWash: "rgba(194,162,103,0.06)",
  navyText: "#eaf1fb",
  good: "#5fbf8f",
  warn: "#d8a24a",
};

export const radius = { sm: 8, md: 12, lg: 16, xl: 22, pill: 999 } as const;

/** 4pt spacing scale. */
export const sp = (n: number) => n * 4;

export const type = {
  // Raleway to be loaded via expo-font later; system face for now.
  display: undefined as string | undefined,
  h1: { fontSize: 32, fontWeight: "700" as const, letterSpacing: -0.5, color: colors.text },
  h2: { fontSize: 24, fontWeight: "700" as const, letterSpacing: -0.3, color: colors.text },
  h3: { fontSize: 18, fontWeight: "600" as const, color: colors.text },
  body: { fontSize: 15, fontWeight: "400" as const, color: colors.muted, lineHeight: 23 },
  eyebrow: {
    fontSize: 11, fontWeight: "700" as const, letterSpacing: 2.6,
    textTransform: "uppercase" as const, color: colors.gold,
  },
  label: {
    fontSize: 11, fontWeight: "700" as const, letterSpacing: 1.4,
    textTransform: "uppercase" as const, color: colors.dim,
  },
};
