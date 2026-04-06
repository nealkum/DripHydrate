import type { CSSProperties } from "react";

// Brand palette sourced from the Drip Hydration logo (navy droplet) +
// the editorial, sunlit photoshoot. Light theme — cream canvas, navy ink.
// Legacy key names (teal/cyan/gold) preserved so existing screens cascade.
export const B = {
  teal: "#12243f",        // navy ink (for primary dark surfaces still in use)
  tealLight: "#eaf2fb",   // pale hydration tint (light card wash)
  tealAccent: "#355b8a",  // mid navy (accent ink)
  cyan: "#2f6db0",        // hydration blue — shifted darker for contrast on cream
  cyanLight: "#6ea8d4",
  gold: "#b08a3e",        // muted brass, only used sparingly
  goldLight: "#e8d5a8",
  cream: "#faf8f5",
  warmWhite: "#ffffff",
  white: "#ffffff",
  bg: "#faf8f5",          // cream canvas
  bgCard: "#ffffff",      // pure white cards
  bgSurface: "#f2eee8",   // warmer surface wash
  textPrimary: "#12243f", // navy ink
  textSecondary: "rgba(18,36,63,0.72)",
  textMuted: "rgba(18,36,63,0.52)",
  textDark: "#12243f",
  border: "rgba(18,36,63,0.12)",
  borderLight: "rgba(18,36,63,0.07)",
  success: "#2f6db0",
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
