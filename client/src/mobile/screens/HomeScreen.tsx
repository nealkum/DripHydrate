import { B, T, SANS } from "../theme";
import { Stars } from "../components/Stars";
import { Btn } from "../components/Btn";
import type { NavProps } from "../MobileApp";

const popularTreatments = [
  { name: "Myers Cocktail", desc: "Full-spectrum vitamin infusion", price: "$299", rating: 4.9, reviews: 2150, slug: "myers-cocktail-plus" },
  { name: "Hangover IV",    desc: "Fast nausea & headache relief",  price: "$179", rating: 4.9, reviews: 2840, slug: "hangover-iv" },
  { name: "Recovery IV",    desc: "Post-workout recovery",          price: "$229", rating: 4.9, reviews: 1520, slug: "recovery-performance" },
  { name: "NAD+",           desc: "Anti-aging & cellular repair",   price: "$599", rating: 4.8, reviews: 620,  slug: "nad-iv-therapy" },
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
      <div style={{ padding: "8px 20px 4px" }}>
        <div style={{ ...T.ui, fontSize: 14, color: B.textMuted, fontWeight: 400 }}>Good morning, Neal</div>
      </div>

      {/* Promo hero */}
      <div style={{ padding: "6px 20px 8px" }}>
        <div
          onClick={() => openBooking("immunity-boost")}
          style={{
            background: `linear-gradient(135deg, ${B.bgCard} 0%, ${B.tealLight} 60%, ${B.bgCard} 100%)`,
            border: `1px solid ${B.cyan}25`,
            borderRadius: 16,
            padding: "20px 18px",
            position: "relative",
            overflow: "hidden",
            cursor: "pointer",
          }}
        >
          <div style={{ position: "absolute", top: -30, right: -20, width: 160, height: 160, background: `radial-gradient(circle, ${B.cyan}12, transparent 65%)`, pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: -20, left: -10, width: 100, height: 100, background: `radial-gradient(circle, ${B.gold}08, transparent 65%)`, pointerEvents: "none" }} />
          <div style={{ ...T.tag, fontSize: 9, color: B.gold, background: `${B.gold}18`, padding: "3px 10px", borderRadius: 6, border: `1px solid ${B.gold}25`, display: "inline-block", marginBottom: 10 }}>
            SPRING WELLNESS
          </div>
          <div style={{ ...T.hero, fontSize: 22, color: B.textPrimary, marginBottom: 6, lineHeight: 1.2 }}>
            25% off Immunity Boost
          </div>
          <div style={{ ...T.body, fontSize: 13, color: B.textSecondary, marginBottom: 14, lineHeight: 1.4 }}>
            Strengthen your immune system this season. <span style={{ color: B.cyan, fontWeight: 600 }}>$199 → $149</span>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <Btn style={{ padding: "11px 24px", fontSize: 12 }} onClick={(e) => { e.stopPropagation(); openBooking("immunity-boost"); }}>
              Book Now
            </Btn>
            <Btn variant="outline" style={{ padding: "11px 20px", fontSize: 12 }} onClick={(e) => { e.stopPropagation(); onTabChange("tx"); }}>
              Browse All
            </Btn>
          </div>
        </div>
      </div>

      {/* Popular treatments */}
      <div style={{ padding: "14px 0 20px" }}>
        <div style={{ padding: "0 20px 10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ ...T.heading, fontSize: 18, color: B.textPrimary }}>Popular Treatments</div>
          <span
            onClick={() => onTabChange("tx")}
            style={{ ...T.ui, fontSize: 12, color: B.cyan, fontWeight: 600, cursor: "pointer" }}
          >
            See All →
          </span>
        </div>
        <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingLeft: 20, paddingRight: 20, paddingBottom: 4 }}>
          {popularTreatments.map((t, i) => (
            <div
              key={i}
              onClick={() => navigate({ type: "treatment-detail", slug: t.slug })}
              style={{ minWidth: 148, background: B.bgCard, border: `1px solid ${B.border}`, borderRadius: 12, padding: 12, flexShrink: 0, cursor: "pointer" }}
            >
              <div style={{ ...T.product, fontSize: 14, color: B.textPrimary, marginBottom: 3 }}>{t.name}</div>
              <div style={{ ...T.body, fontSize: 11, color: B.textMuted, marginBottom: 6, lineHeight: 1.3 }}>{t.desc}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 8 }}>
                <Stars rating={Math.round(t.rating)} size={9} />
                <span style={{ ...T.ui, fontSize: 10, color: B.textMuted, fontWeight: 400 }}>{t.rating}</span>
              </div>
              <div style={{ ...T.price, fontSize: 16, color: B.textPrimary }}>{t.price}</div>
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
          <Btn variant="outline" style={{ width: "100%", padding: "10px 0" }} onClick={() => onTabChange("ord")}>View Details</Btn>
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
