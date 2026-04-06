import { useState } from "react";
import { B, T, SERIF, SANS } from "../theme";
import type { NavProps } from "../MobileApp";

const sections = [
  {
    title: "Personal Info",
    icon: "👤",
    items: ["Neal Kumar", "neal@driphydration.com", "(310) 555-0100"],
  },
  {
    title: "Saved Addresses",
    icon: "📍",
    items: ["Home · 123 Main St, Los Angeles", "Office · 456 Wilshire Blvd"],
  },
  {
    title: "Payment Methods",
    icon: "💳",
    items: ["Visa •••• 4242", "Apple Pay"],
  },
  {
    title: "Notifications",
    icon: "🔔",
    items: ["Appointment reminders on", "Nurse en route alerts on", "Promotions off"],
  },
];

const links = [
  { label: "Membership",                       icon: "💎", action: "membership" },
  { label: "Referral Program — Give $25, Get $25", icon: "🎁", action: "referral" },
  { label: "Medical Profile",                  icon: "🏥", action: "edit-profile" },
  { label: "Help & FAQ",                       icon: "❓", action: "help" },
  { label: "About Drip Hydration",             icon: "ℹ️", action: null },
  { label: "Privacy & Terms",                  icon: "🔒", action: null },
];

export function AccountScreen({ navigate }: NavProps) {
  const [loggedOut, setLoggedOut] = useState(false);

  if (loggedOut) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", padding: 40, fontFamily: SANS }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>👋</div>
        <div style={{ ...T.heading, fontSize: 24, color: B.textPrimary, marginBottom: 8, textAlign: "center" }}>You've been logged out</div>
        <div style={{ ...T.body, fontSize: 14, color: B.textMuted, textAlign: "center", marginBottom: 24 }}>Sign back in to access your account and bookings</div>
        <button
          onClick={() => setLoggedOut(false)}
          style={{ padding: "14px 32px", borderRadius: 12, background: `linear-gradient(135deg, ${B.tealAccent}, ${B.cyan})`, color: "#fff", border: "none", cursor: "pointer", fontFamily: SANS, fontWeight: 700, fontSize: 14, textTransform: "uppercase", letterSpacing: "0.08em" }}
        >
          Sign Back In
        </button>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: SANS }}>
      <div style={{ padding: "16px 20px 4px" }}>
        <div style={{ ...T.hero, fontSize: 28, color: B.textPrimary }}>Account</div>
      </div>

      {/* Profile row */}
      <div style={{ padding: "12px 20px 20px", display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 58, height: 58, borderRadius: "50%", background: `linear-gradient(135deg, ${B.tealAccent}, ${B.cyan})`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 22, fontWeight: 700, fontFamily: SERIF, border: "3px solid rgba(18,36,63,0.1)", flexShrink: 0 }}>
          NK
        </div>
        <div>
          <div style={{ ...T.product, fontSize: 18, color: B.textPrimary }}>Neal Kumar</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
            <span
              onClick={() => navigate({ type: "membership" })}
              style={{ ...T.tag, fontSize: 10, color: B.gold, background: `${B.gold}15`, padding: "3px 10px", borderRadius: 10, border: `1px solid ${B.gold}20`, cursor: "pointer" }}
            >
              💎 IV MEMBER
            </span>
            <span style={{ ...T.ui, fontSize: 11, color: B.textMuted, fontWeight: 400 }}>Since Jan 2025</span>
          </div>
        </div>
      </div>

      {/* Settings sections */}
      {sections.map((s, i) => (
        <div key={i} style={{ padding: "0 20px", marginBottom: 10 }}>
          <div style={{ background: B.bgCard, border: `1px solid ${B.border}`, borderRadius: 14, overflow: "hidden" }}>
            <div style={{ padding: "12px 16px", display: "flex", alignItems: "center", gap: 10, borderBottom: `1px solid ${B.borderLight}` }}>
              <span style={{ fontSize: 15 }}>{s.icon}</span>
              <span style={{ ...T.ui, fontSize: 14, fontWeight: 700, color: B.textPrimary }}>{s.title}</span>
              <span onClick={() => navigate({ type: "edit-profile" })} style={{ marginLeft: "auto", ...T.ui, fontSize: 12, color: B.cyan, fontWeight: 600, cursor: "pointer" }}>Edit</span>
            </div>
            {s.items.map((it, j) => (
              <div
                key={j}
                style={{ padding: "11px 16px 11px 42px", ...T.body, fontSize: 13, color: B.textSecondary, borderBottom: j < s.items.length - 1 ? `1px solid ${B.borderLight}` : "none" }}
              >
                {it}
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Links */}
      <div style={{ padding: "8px 20px" }}>
        <div style={{ background: B.bgCard, border: `1px solid ${B.border}`, borderRadius: 14, overflow: "hidden" }}>
          {links.map((l, i) => (
            <div
              key={i}
              onClick={() => {
                if (l.action === "membership") navigate({ type: "membership" });
                else if (l.action === "referral") navigate({ type: "referral" });
                else if (l.action === "help") navigate({ type: "help" });
                else if (l.action === "edit-profile") navigate({ type: "edit-profile" });
              }}
              style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 16px", borderBottom: i < links.length - 1 ? `1px solid ${B.borderLight}` : "none", cursor: "pointer" }}
            >
              <span style={{ fontSize: 15 }}>{l.icon}</span>
              <span style={{ ...T.ui, fontSize: 14, color: B.textPrimary, fontWeight: 500, flex: 1 }}>{l.label}</span>
              <span style={{ color: B.textMuted, fontSize: 14 }}>›</span>
            </div>
          ))}
        </div>
      </div>

      {/* Log out */}
      <div style={{ padding: "16px 20px 24px" }}>
        <button
          onClick={() => setLoggedOut(true)}
          style={{ width: "100%", padding: "14px", borderRadius: 12, ...T.btn, fontSize: 13, border: "1px solid rgba(220,38,38,0.25)", background: "rgba(220,38,38,0.06)", color: "#ef4444", cursor: "pointer", fontFamily: SANS }}
        >
          LOG OUT
        </button>
      </div>
    </div>
  );
}
