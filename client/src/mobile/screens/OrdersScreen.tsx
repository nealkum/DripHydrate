import { B, T, SANS } from "../theme";
import { Stars } from "../components/Stars";
import { Btn } from "../components/Btn";
import type { NavProps } from "../MobileApp";

const upcoming = [
  { name: "Recovery IV", slug: "recovery-performance", date: "Mar 26, 2026", time: "2:00 PM", location: "Your home · 123 Main St", nurse: "Sarah K.", status: "Confirmed" },
];

const shipped = [
  { name: "Semaglutide — Monthly", slug: "weight-loss-semaglutide", shippedDate: "Shipped Mar 10", status: "Delivered Mar 13", next: "Next shipment: Apr 10" },
];

const past = [
  { name: "Recovery IV", slug: "recovery-performance", date: "Mar 15, 2026", price: "$209", nurse: "Sarah K.",  rating: 5 },
  { name: "Hangover IV",               slug: "hangover-iv",          date: "Feb 28, 2026", price: "$179", nurse: "Maria G.",  rating: 5 },
  { name: "NAD+ IV Therapy",           slug: "nad-iv-therapy",       date: "Feb 1, 2026",  price: "$559", nurse: "David R.",  rating: 5 },
];

const stats = [
  { label: "Treatments",    value: "8",        icon: "💉" },
  { label: "Saved",         value: "$1,080",   icon: "💰" },
  { label: "Top Treatment", value: "Recovery", icon: "🏆" },
  { label: "Streak",        value: "3 months", icon: "🔥" },
];

export function OrdersScreen({ navigate, openBooking }: NavProps) {
  return (
    <div style={{ fontFamily: SANS }}>
      <div style={{ padding: "16px 20px 16px" }}>
        <div style={{ ...T.hero, fontSize: 28, color: B.textPrimary }}>Orders & Activity</div>
      </div>

      {/* Upcoming */}
      <div style={{ padding: "0 20px 12px" }}>
        <div style={{ ...T.over, fontSize: 10, color: B.textMuted, marginBottom: 10 }}>Upcoming</div>
        {upcoming.map((o, i) => (
          <div key={i} style={{ background: B.bgCard, border: `1px solid ${B.cyan}20`, borderRadius: 14, padding: 16, marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <div
                onClick={() => navigate({ type: "treatment-detail", slug: o.slug })}
                style={{ ...T.product, fontSize: 17, color: B.textPrimary, cursor: "pointer" }}
              >
                {o.name}
              </div>
              <span style={{ ...T.tag, fontSize: 9, color: B.cyan, background: `${B.cyan}15`, padding: "3px 10px", borderRadius: 20, border: `1px solid ${B.cyan}25`, flexShrink: 0, marginLeft: 8 }}>{o.status}</span>
            </div>
            <div style={{ ...T.body, fontSize: 13, color: B.textSecondary, lineHeight: 1.9 }}>
              📅 {o.date} · {o.time}<br />
              📍 {o.location}<br />
              👩‍⚕️ Nurse {o.nurse}
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
              <Btn variant="outline" style={{ flex: 1, padding: "11px 0" }} onClick={() => openBooking(o.slug)}>RESCHEDULE</Btn>
              <Btn style={{ flex: 1, padding: "11px 0" }} onClick={() => openBooking(o.slug)}>ADD ADD-ONS</Btn>
            </div>
          </div>
        ))}
      </div>

      {/* Shipped orders */}
      <div style={{ padding: "0 20px 12px" }}>
        <div style={{ ...T.over, fontSize: 10, color: B.textMuted, marginBottom: 10 }}>Shipped Orders</div>
        {shipped.map((o, i) => (
          <div key={i} style={{ background: B.bgCard, border: `1px solid ${B.border}`, borderRadius: 14, padding: 16, marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span>📦</span>
              <div
                onClick={() => navigate({ type: "treatment-detail", slug: o.slug })}
                style={{ ...T.product, fontSize: 15, color: B.textPrimary, cursor: "pointer" }}
              >
                {o.name}
              </div>
            </div>
            <div style={{ ...T.body, fontSize: 12, color: B.textSecondary, lineHeight: 1.9 }}>
              {o.shippedDate} · {o.status}<br />{o.next}
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <Btn variant="outline" style={{ flex: 1, padding: "10px 0", fontSize: 11 }}>MANAGE</Btn>
              <Btn variant="ghost" style={{ flex: 1, padding: "10px 0", fontSize: 11 }} onClick={() => openBooking(o.slug)}>REORDER</Btn>
            </div>
          </div>
        ))}
      </div>

      {/* Past treatments */}
      <div style={{ padding: "0 20px" }}>
        <div style={{ ...T.over, fontSize: 10, color: B.textMuted, marginBottom: 10 }}>Past Treatments</div>
        {past.map((o, i) => (
          <div
            key={i}
            onClick={() => navigate({ type: "treatment-detail", slug: o.slug })}
            style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 0", borderBottom: `1px solid ${B.borderLight}`, cursor: "pointer" }}
          >
            <div style={{ width: 42, height: 42, borderRadius: 12, background: B.bgCard, border: `1px solid ${B.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
              💉
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ ...T.ui, fontSize: 14, fontWeight: 600, color: B.textPrimary }}>{o.name}</div>
              <div style={{ ...T.ui, fontSize: 11, color: B.textMuted, fontWeight: 400 }}>{o.date} · Nurse {o.nurse}</div>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <div style={{ ...T.price, fontSize: 14, color: B.textPrimary }}>{o.price}</div>
              <Stars rating={o.rating} size={9} />
            </div>
          </div>
        ))}
      </div>

      {/* Wellness summary */}
      <div style={{ padding: "24px 20px" }}>
        <div style={{ background: B.bgCard, border: `1px solid ${B.border}`, borderRadius: 14, padding: 18 }}>
          <div style={{ ...T.heading, fontSize: 16, color: B.textPrimary, marginBottom: 14 }}>2026 Wellness Summary</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {stats.map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 20 }}>{s.icon}</span>
                <div>
                  <div style={{ ...T.price, fontSize: 17, color: B.textPrimary }}>{s.value}</div>
                  <div style={{ ...T.ui, fontSize: 10, color: B.textMuted, fontWeight: 400 }}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
