import { B, T, SERIF, SANS } from "../theme";
import { Stars } from "../components/Stars";
import { SectionHeader } from "../components/SectionHeader";
import { Btn } from "../components/Btn";
import type { NavProps } from "../MobileApp";

const pastTreatments = [
  { name: "Recovery IV",  date: "Mar 15", price: "$209", rated: true,  rating: 5, slug: "recovery-performance" },
  { name: "Hangover IV",  date: "Feb 28", price: "$179", rated: true,  rating: 5, slug: "hangover-iv" },
  { name: "NAD+ IV",      date: "Feb 1",  price: "$559", rated: false, rating: 0, slug: "nad-iv-therapy" },
  { name: "Immune Boost", date: "Jan 18", price: "$179", rated: true,  rating: 5, slug: "immunity-boost" },
];

const recommendations = [
  { name: "NAD+ Boost IV",    reason: "Pairs with your Recovery IV",      price: "$699", memberPrice: "$559", icon: "🧬", slug: "nad-boost" },
  { name: "Glutathione Push", reason: "87% of Recovery clients add this", price: "+$35",  memberPrice: null,   icon: "✨", slug: null },
  { name: "Semaglutide",      reason: "Shipped to your door monthly",     price: "$299/mo", memberPrice: null, icon: "📦", slug: "weight-loss-semaglutide" },
];

const pressLogos = [
  { name: "The New York Times",     style: { fontFamily: "'Times New Roman', Georgia, serif", fontStyle: "italic" as const, fontWeight: 700, fontSize: 12 } },
  { name: "The Wall Street Journal.", style: { fontFamily: "Georgia, serif", fontWeight: 400, fontSize: 10 } },
  { name: "VICE",                   style: { fontFamily: SANS, fontWeight: 900, fontSize: 13, letterSpacing: "0.04em" } },
  { name: "Yahoo!",                 style: { fontFamily: SANS, fontWeight: 800, fontSize: 13 } },
  { name: "New York Post",          style: { fontFamily: "Georgia, serif", fontWeight: 800, fontSize: 11 } },
  { name: "POPSUGAR",               style: { fontFamily: SANS, fontWeight: 400, fontSize: 10, letterSpacing: "0.18em" } },
];

export function HomeScreen({ navigate, onTabChange, openBooking }: NavProps) {
  const quickActions = [
    { icon: "↻", label: "Rebook",   sub: "Last IV",  grad: `linear-gradient(135deg, #2d5a5a, #3d8b8b)`, action: () => openBooking("recovery-performance") },
    { icon: "📅", label: "Schedule", sub: "New Appt", grad: `linear-gradient(135deg, #3d5a2d, #5b8b3d)`, action: () => openBooking() },
    { icon: "📦", label: "Shop",     sub: "Shipped",  grad: `linear-gradient(135deg, #5a4a2d, #c9a96e)`,  action: () => onTabChange("tx") },
  ];

  return (
    <div style={{ fontFamily: SANS }}>
      {/* Promo banner */}
      <div style={{ background: `linear-gradient(90deg, ${B.gold}, #d4b878)`, padding: "8px 20px", textAlign: "center" }}>
        <span style={{ ...T.ui, fontSize: 11, color: B.teal }}>Celebrating 10 Years of Drip | 10% OFF with code </span>
        <span style={{ ...T.tag, fontSize: 10, color: B.teal, background: "rgba(255,255,255,0.4)", padding: "2px 8px", borderRadius: 4 }}>DRIPDECADE</span>
      </div>

      {/* Greeting */}
      <div style={{ padding: "20px 20px 6px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ ...T.hero, fontSize: 26, color: B.textPrimary }}>Good morning, Neal</div>
          <div style={{ ...T.ui, fontSize: 13, color: B.textSecondary, marginTop: 4, display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4, color: B.gold, fontWeight: 600, fontSize: 12 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: B.cyan, boxShadow: `0 0 8px ${B.cyan}`, display: "inline-block" }} />
              IV Member
            </span>
            <span style={{ color: B.textMuted }}>·</span>
            <span>Next treatment tomorrow</span>
          </div>
        </div>
        <button
          onClick={() => navigate({ type: "notifications" })}
          style={{ width: 42, height: 42, borderRadius: "50%", background: B.bgCard, border: `1px solid ${B.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, cursor: "pointer", position: "relative" }}
        >
          🔔
          <span style={{ position: "absolute", top: 8, right: 8, width: 8, height: 8, borderRadius: "50%", background: B.cyan, border: `2px solid ${B.bg}` }} />
        </button>
      </div>

      {/* Quick actions */}
      <div style={{ padding: "16px 20px 20px", display: "flex", gap: 10 }}>
        {quickActions.map((a, i) => (
          <button
            key={i}
            onClick={a.action}
            style={{ flex: 1, border: `1px solid ${B.border}`, background: B.bgCard, borderRadius: 16, padding: "16px 4px 12px", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, cursor: "pointer" }}
          >
            <div style={{ width: 46, height: 46, borderRadius: 14, background: a.grad, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, boxShadow: "0 4px 12px rgba(0,0,0,0.3)" }}>
              {a.icon}
            </div>
            <div style={{ ...T.ui, fontSize: 12, fontWeight: 600, color: B.textPrimary }}>{a.label}</div>
            <div style={{ ...T.ui, fontSize: 10, color: B.textMuted, fontWeight: 400 }}>{a.sub}</div>
          </button>
        ))}
      </div>

      {/* Upcoming appointment */}
      <div style={{ padding: "0 20px 20px" }}>
        <div style={{ background: B.bgCard, border: `1px solid ${B.border}`, borderRadius: B.cardR, padding: 20, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, right: 0, width: 140, height: 140, background: `radial-gradient(circle at top right, ${B.tealAccent}15, transparent 70%)` }} />
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <div style={{ ...T.over, fontSize: 10, color: B.cyan }}>Upcoming Appointment</div>
            <div style={{ marginLeft: "auto", ...T.tag, fontSize: 9, color: B.cyan, background: `${B.cyan}18`, padding: "3px 10px", borderRadius: 20, border: `1px solid ${B.cyan}30` }}>Confirmed</div>
          </div>
          <div
            onClick={() => navigate({ type: "treatment-detail", slug: "recovery-performance" })}
            style={{ ...T.product, fontSize: 19, color: B.textPrimary, marginBottom: 14, cursor: "pointer" }}
          >
            Recovery & Performance IV
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 18 }}>
            <div style={{ ...T.body, fontSize: 13, color: B.textSecondary, display: "flex", alignItems: "center", gap: 10 }}>
              <span>📅</span><span>Tomorrow, Mar 26 · 2:00 PM</span>
            </div>
            <div style={{ ...T.body, fontSize: 13, color: B.textSecondary, display: "flex", alignItems: "center", gap: 10 }}>
              <span>📍</span><span>Your home · 123 Main St, LA</span>
            </div>
            <div style={{ ...T.body, fontSize: 13, color: B.textSecondary, display: "flex", alignItems: "center", gap: 10 }}>
              <span>👩‍⚕️</span><span>Nurse Sarah K. · <Stars rating={5} size={10} /></span>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Btn variant="outline" style={{ flex: 1, padding: "11px 0" }} onClick={() => onTabChange("ord")}>Manage</Btn>
            <Btn variant="outline" style={{ flex: 1, padding: "11px 0" }} onClick={() => openBooking("recovery-performance")}>Reschedule</Btn>
            <Btn style={{ flex: 1, padding: "11px 0" }} onClick={() => openBooking("recovery-performance")}>Add-On</Btn>
          </div>
        </div>
      </div>

      {/* Membership card */}
      <div style={{ padding: "24px 20px" }}>
        <div style={{ background: `linear-gradient(135deg, ${B.bgCard} 0%, ${B.tealLight} 100%)`, border: `1px solid ${B.gold}30`, borderRadius: B.cardR, padding: 20, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, background: `radial-gradient(circle, ${B.gold}12, transparent 70%)` }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 20 }}>💎</span>
              <div>
                <div style={{ ...T.product, fontSize: 15, color: B.textPrimary }}>IV Membership</div>
                <div style={{ ...T.ui, fontSize: 11, color: B.textMuted, fontWeight: 400 }}>Active since Jan 2025</div>
              </div>
            </div>
            <span style={{ ...T.tag, fontSize: 10, color: B.cyan, background: `${B.cyan}15`, padding: "4px 12px", borderRadius: 20, border: `1px solid ${B.cyan}25` }}>Active</span>
          </div>
          <div style={{ marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", ...T.ui, fontSize: 12, color: B.textSecondary, marginBottom: 8, fontWeight: 400 }}>
              <span>2 of 4 sessions this month</span>
              <span style={{ color: B.cyan, fontWeight: 600 }}>50%</span>
            </div>
            <div style={{ height: 6, borderRadius: 3, background: "rgba(255,255,255,0.08)" }}>
              <div style={{ height: "100%", width: "50%", borderRadius: 3, background: `linear-gradient(90deg, ${B.tealAccent}, ${B.cyan})` }} />
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ ...T.ui, fontSize: 12, color: B.textMuted, fontWeight: 400 }}>
              Savings this year: <span style={{ color: B.gold, fontWeight: 700 }}>$1,080</span>
            </div>
            <span
              onClick={() => navigate({ type: "membership" })}
              style={{ ...T.ui, fontSize: 12, color: B.cyan, fontWeight: 600, cursor: "pointer" }}
            >
              Benefits →
            </span>
          </div>
        </div>
      </div>

      {/* Press logos */}
      <div style={{ padding: "0 20px 24px" }}>
        <div style={{ ...T.over, textAlign: "center", fontSize: 9, color: B.textMuted, marginBottom: 14 }}>As Featured In</div>
        <div style={{ display: "flex", justifyContent: "center", gap: 20, flexWrap: "wrap", opacity: 0.35 }}>
          {pressLogos.map((p) => (
            <span key={p.name} style={{ ...p.style, color: B.textPrimary, whiteSpace: "nowrap" }}>{p.name}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
