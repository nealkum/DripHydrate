import type { CSSProperties } from "react";

// Brand palette sourced from the Drip Hydration logo (navy droplet).
// Legacy key names (teal/cyan/gold) are preserved so existing screens pick up the
// new colors without needing mass edits.
export const B = {
  teal: "#12243f",        // legacy key → now navy (brand primary)
  tealLight: "#1c3358",   // legacy key → lifted navy
  tealAccent: "#355b8a",  // legacy key → mid navy
  cyan: "#6ea8d4",        // legacy key → hydration blue (softer, logo-adjacent)
  cyanLight: "#9cc4e4",
  gold: "#c9a96e",        // kept as-is; most screens have been migrated off
  goldLight: "#e8d5a8",
  cream: "#faf8f5",
  warmWhite: "#faf8f5",
  white: "#ffffff",
  bg: "#0a1728",          // deep navy ink (was deep teal)
  bgCard: "#12243f",
  bgSurface: "#0f1e36",
  textPrimary: "#ffffff",
  textSecondary: "rgba(255,255,255,0.72)",
  textMuted: "rgba(255,255,255,0.48)",
  textDark: "#12243f",
  border: "rgba(255,255,255,0.1)",
  borderLight: "rgba(255,255,255,0.06)",
  success: "#6ea8d4",
  cardR: "16px",
} as const;

export const SERIF = "'Playfair Display', Georgia, 'Times New Roman', serif";
export const SANS = "'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

export const T = {
  hero:    { fontFamily: SERIF, fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.15 } as CSSProperties,
  heading: { fontFamily: SERIF, fontWeight: 700, letterSpacing: "-0.01em", lineHeight: 1.2 } as CSSProperties,
  product: { fontFamily: SANS, fontWeight: 700, letterSpacing: "-0.01em" } as CSSProperties,
  body:    { fontFamily: SANS, fontWeight: 400, lineHeight: 1.5 } as CSSProperties,
  ui:      { fontFamily: SANS, fontWeight: 500 } as CSSProperties,
  price:   { fontFamily: SANS, fontWeight: 700 } as CSSProperties,
  btn:     { fontFamily: SANS, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.08em" },
  tag:     { fontFamily: SANS, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.06em" },
  over:    { fontFamily: SANS, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.12em" },
};
