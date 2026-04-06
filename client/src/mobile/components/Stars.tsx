import { B } from "../theme";

interface StarsProps {
  rating: number;
  size?: number;
}

export function Stars({ rating, size = 11 }: StarsProps) {
  return (
    <span style={{ display: "inline-flex", gap: 1 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          style={{
            color: i <= rating ? B.gold : "rgba(18,36,63,0.12)",
            fontSize: size,
          }}
        >
          ★
        </span>
      ))}
    </span>
  );
}
