import { Home, Droplet, Menu as MenuIcon } from "lucide-react";
import { B, T, SANS } from "../theme";
import type { TabId } from "../MobileApp";

interface TabBarProps {
  active: TabId;
  onSelect: (id: TabId) => void;
  onMenu: () => void;
}

const tabs = [
  { id: "home" as TabId, label: "Home",       Icon: Home },
  { id: "tx"   as TabId, label: "Treatments", Icon: Droplet },
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
        background: "rgba(255,255,255,0.95)",
        backdropFilter: "blur(20px)",
        borderTop: `1px solid ${B.border}`,
        display: "flex",
        justifyContent: "space-around",
        alignItems: "flex-start",
        padding: "6px 0 20px",
        zIndex: 100,
      }}
    >
      {tabs.map((t) => {
        const isActive = active === t.id;
        return (
          <button
            key={t.id}
            onClick={() => onSelect(t.id)}
            style={{
              border: "none", background: "none", display: "flex", flexDirection: "column",
              alignItems: "center", gap: 4, cursor: "pointer", padding: "4px 20px", fontFamily: SANS,
            }}
          >
            <t.Icon size={20} strokeWidth={isActive ? 2.2 : 1.6} color={isActive ? B.cyan : B.textMuted} />
            <span style={{ ...T.ui, fontSize: 10, fontWeight: isActive ? 600 : 400, color: isActive ? B.cyan : B.textMuted }}>
              {t.label}
            </span>
          </button>
        );
      })}

      {/* Hamburger menu button */}
      <button
        onClick={onMenu}
        style={{
          border: "none", background: "none", display: "flex", flexDirection: "column",
          alignItems: "center", gap: 4, cursor: "pointer", padding: "4px 20px", fontFamily: SANS,
        }}
      >
        <MenuIcon size={20} strokeWidth={menuActive ? 2.2 : 1.6} color={menuActive ? B.cyan : B.textMuted} />
        <span style={{ ...T.ui, fontSize: 10, fontWeight: menuActive ? 600 : 400, color: menuActive ? B.cyan : B.textMuted }}>
          Menu
        </span>
      </button>
    </div>
  );
}
