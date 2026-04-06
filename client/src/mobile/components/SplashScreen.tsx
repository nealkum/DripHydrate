import { useEffect, useState } from "react";
import { B, T, SANS } from "../theme";
import badge from "@/assets/brand/logo/badge-white.png";

export function SplashScreen({ onDone }: { onDone: () => void }) {
  const [fade, setFade] = useState(false);
  useEffect(() => {
    const t1 = setTimeout(() => setFade(true), 1100);
    const t2 = setTimeout(onDone, 1500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onDone]);
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: `radial-gradient(circle at 50% 45%, ${B.tealLight} 0%, ${B.bg} 70%)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        opacity: fade ? 0 : 1,
        transition: "opacity 0.4s ease",
        fontFamily: SANS,
      }}
    >
      <img
        src={badge}
        alt="Drip Hydration"
        style={{
          width: 180,
          height: 180,
          objectFit: "contain",
          animation: "dh-fade-in 0.6s ease",
        }}
      />
      <div style={{ ...T.over, fontSize: 10, color: B.cyan, marginTop: 18, letterSpacing: "0.24em" }}>
        WELLNESS DELIVERED
      </div>
      <style>{`
        @keyframes dh-fade-in {
          from { opacity: 0; transform: scale(0.92); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
