import { B, T, SANS } from "../theme";
import type { TabId } from "../MobileApp";

interface TabBarProps {
  active: TabId;
  onSelect: (id: TabId) => void;
  onMenu: () => void;
}

const tabs = [
  { id: "home" as TabId, label: "Home",       icon: "⌂" },
  { id: "tx"   as TabId, label: "Treatments", icon: "⊕" },
];

export function TabBar({ active, onSelect, onMenu }: TabBarProps) {
  const menuActive = active === "ord" || active === "acc";

  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        background: "rgba(15,43,43,0.97)",
        backdropFilter: "blur(20px)",
        borderTop: `1px solid ${B.border}`,
        display: "flex",
        justifyContent: "space-around",
        alignItems: "flex-start",
        padding: "6px 0 20px",
        zIndex: 100,
      }}
    >
      {tabs.map((t) => (
        <button
          key={t.id}
          onClick={() => onSelect(t.id)}
          style={{
            border: "none",
            background: "none",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            cursor: "pointer",
            padding: "4px 20px",
            fontFamily: SANS,
          }}
        >
          <span style={{ fontSize: 20, lineHeight: 1, opacity: active === t.id ? 1 : 0.5, color: active === t.id ? B.cyan : B.textMuted }}>
            {t.icon}
          </span>
          <span style={{ ...T.ui, fontSize: 10, fontWeight: active === t.id ? 600 : 400, color: active === t.id ? B.cyan : B.textMuted }}>
            {t.label}
          </span>
        </button>
      ))}

      {/* Hamburger menu button */}
      <button
        onClick={onMenu}
        style={{
          border: "none",
          background: "none",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
          cursor: "pointer",
          padding: "4px 20px",
          fontFamily: SANS,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 4, width: 20, height: 20, justifyContent: "center" }}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ height: 2, borderRadius: 1, background: menuActive ? B.cyan : `rgba(255,255,255,0.5)`, transition: "background 0.2s" }} />
          ))}
        </div>
        <span style={{ ...T.ui, fontSize: 10, fontWeight: menuActive ? 600 : 400, color: menuActive ? B.cyan : B.textMuted }}>
          Menu
        </span>
      </button>
    </div>
  );
}
