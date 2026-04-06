import badge from "@/assets/brand/logo/badge.png";
import wordmark from "@/assets/brand/logo/wordmark.png";
import badgeWhite from "@/assets/brand/logo/badge-white.png";
import wordmarkWhite from "@/assets/brand/logo/wordmark-white.png";

interface LogoProps {
  variant?: "badge" | "wordmark";
  color?: "navy" | "white";
  height?: number;
  style?: React.CSSProperties;
}

export function Logo({ variant = "wordmark", color = "navy", height = 20, style }: LogoProps) {
  const src =
    variant === "badge"
      ? color === "white" ? badgeWhite : badge
      : color === "white" ? wordmarkWhite : wordmark;
  return (
    <img
      src={src}
      alt="Drip Hydration"
      style={{ height, width: "auto", display: "block", objectFit: "contain", ...style }}
    />
  );
}
