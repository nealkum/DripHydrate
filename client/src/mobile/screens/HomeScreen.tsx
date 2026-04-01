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


export function HomeScreen({ navigate, onTabChange, openBooking, openRebook }: NavProps) {
  return (
    <div style={{ fontFamily: SANS }}>
      {/* Address bar */}
      <div style={{ padding: "10px 20px 4px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button
          style={{ background: "none", border: "none", padding: 0, cursor: "pointer", display: "flex", alignItems: "center", gap: 5, textAlign: "left" }}
        >
          <div>
            <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 15, color: B.textPrimary, display: "flex", alignItems: "center", gap: 4 }}>
              2847 Oak Street
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ marginTop: 1, flexShrink: 0 }}>
                <path d="M3 4.5L6 7.5L9 4.5" stroke={B.textPrimary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div style={{ fontFamily: SANS, fontSize: 11, color: B.textMuted, fontWeight: 400, marginTop: 1 }}>Los Angeles, CA</div>
          </div>
        </button>
        <button
          onClick={() => navigate({ type: "notifications" })}
          style={{ width: 38, height: 38, borderRadius: "50%", background: B.bgCard, border: `1px solid ${B.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, cursor: "pointer", position: "relative", flexShrink: 0 }}
        >
          🔔
          <span style={{ position: "absolute", top: 7, right: 7, width: 7, height: 7, borderRadius: "50%", background: B.cyan, border: `2px solid ${B.bg}` }} />
        </button>
      </div>

      {/* Greeting */}
      <div style={{ padding: "8px 20px 6px" }}>
        <div style={{ ...T.hero, fontSize: 26, color: B.textPrimary }}>Good morning, Neal</div>
      </div>

      {/* Past treatments */}
      <div style={{ padding: "16px 0 20px" }}>
        <div style={{ padding: "0 20px 10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ ...T.heading, fontSize: 20, color: B.textPrimary }}>Your Treatments</div>
          <span
            onClick={() => onTabChange("ord")}
            style={{ ...T.ui, fontSize: 12, color: B.cyan, fontWeight: 600, cursor: "pointer" }}
          >
            View All →
          </span>
        </div>
        <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingLeft: 20, paddingRight: 20, paddingBottom: 4 }}>
          {pastTreatments.map((t, i) => (
            <div key={i} style={{ minWidth: 156, background: B.bgCard, border: `1px solid ${B.border}`, borderRadius: 14, padding: 14, flexShrink: 0 }}>
              <div
                onClick={() => navigate({ type: "treatment-detail", slug: t.slug })}
                style={{ ...T.product, fontSize: 14, color: B.textPrimary, marginBottom: 4, cursor: "pointer" }}
              >
                {t.name}
              </div>
              <div style={{ ...T.ui, fontSize: 11, color: B.textMuted, fontWeight: 400, marginBottom: 6 }}>{t.date} · {t.price}</div>
              <div style={{ marginBottom: 10 }}>
                {t.rated
                  ? <Stars rating={t.rating} size={10} />
                  : <span style={{ ...T.ui, fontSize: 11, color: B.gold, fontWeight: 600 }}>⭐ Rate</span>
                }
              </div>
              <Btn variant="ghost" style={{ width: "100%", padding: "9px 0", fontSize: 11 }} onClick={() => openRebook(t.slug)}>Rebook</Btn>
            </div>
          ))}
        </div>
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
            Recovery IV
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

    </div>
  );
}
