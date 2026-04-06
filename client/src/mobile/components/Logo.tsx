import badge from "@/assets/brand/logo/badge-white.png";
import wordmark from "@/assets/brand/logo/wordmark-white.png";

interface LogoProps {
  variant?: "badge" | "wordmark";
  height?: number;
  style?: React.CSSProperties;
}

export function Logo({ variant = "wordmark", height = 20, style }: LogoProps) {
  const src = variant === "badge" ? badge : wordmark;
  return (
    <img
      src={src}
      alt="Drip Hydration"
      style={{ height, width: "auto", display: "block", objectFit: "contain", ...style }}
    />
  );
}
