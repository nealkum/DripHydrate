import { useState } from "react";
import { B, T, SANS } from "../theme";
import { Btn } from "../components/Btn";
import type { NavProps } from "../MobileApp";
import membershipRobe from "@/assets/brand/photos/membership-robe.jpeg";

const plans = [
  {
    id: "basic",
    name: "Basic",
    price: 279,
    savings: "SAVE UP TO 25%",
    sessions: 1,
    color: B.tealAccent,
    features: ["Priority Booking", "15% off all Shipped To You Products", "Free Discovery Call with our Longevity Specialist", "Access to all Active Locations", "Exclusive Monthly Member Promotions"],
  },
  {
    id: "premium",
    name: "Premium",
    price: 499,
    savings: "SAVE UP TO 30%",
    sessions: 2,
    color: B.cyan,
    current: true,
    features: ["Priority Booking", "15% off all Shipped To You Products", "Free Discovery Call with our Longevity Specialist", "Access to all Active Locations", "Exclusive Monthly Member Promotions"],
  },
  {
    id: "elite",
    name: "Elite",
    price: 899,
    savings: "SAVE UP TO 35%",
    sessions: 4,
    color: B.gold,
    features: ["Priority Booking", "15% off all Shipped To You Products", "Free Discovery Call with our Longevity Specialist", "Access to all Active Locations", "Exclusive Monthly Member Promotions"],
  },
];

const benefits = [
  { icon: "💉", title: "Member Pricing",      desc: "Save 25–30% on every IV session" },
  { icon: "📅", title: "Priority Scheduling", desc: "Skip the waitlist, same-day slots" },
  { icon: "👩‍⚕️", title: "Nurse Continuity",   desc: "Request your preferred nurse" },
  { icon: "📦", title: "Shipped Discounts",    desc: "10% off all shipped-to-you products" },
  { icon: "💳", title: "HSA/FSA Eligible",     desc: "Use pre-tax health dollars" },
  { icon: "🎁", title: "Referral Rewards",     desc: "Give $25, get $25 for each friend" },
];

const faqs = [
  { q: "When am I billed?",            a: "Your membership renews automatically on the same date each month. You can cancel anytime from your account." },
  { q: "Can I change my plan?",        a: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect at your next billing cycle." },
  { q: "Do sessions roll over?",       a: "Unused sessions do not roll over, but member pricing applies to any additional sessions you book." },
  { q: "Is there a cancellation fee?", a: "No cancellation fees. Cancel anytime — your benefits remain until the end of your billing period." },
];

export function MembershipScreen({ goBack }: NavProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activePlan, setActivePlan] = useState("premium");
  const [switchBanner, setSwitchBanner] = useState<string | null>(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancelled, setCancelled] = useState(false);

  function handleSwitch(planId: string) {
    if (planId === activePlan) return;
    setActivePlan(planId);
    const plan = plans.find((p) => p.id === planId);
    setSwitchBanner(`Switched to ${plan?.name} plan! Changes take effect Apr 1.`);
    setTimeout(() => setSwitchBanner(null), 4000);
  }

  function handleCancel() {
    setCancelled(true);
    setShowCancelConfirm(false);
  }

  return (
    <div style={{ position: "absolute", inset: 0, background: B.bg, zIndex: 150, display: "flex", flexDirection: "column", fontFamily: SANS }}>
      {/* Header */}
      <div style={{ padding: "16px 20px 12px", display: "flex", alignItems: "center", gap: 12, borderBottom: `1px solid ${B.border}`, flexShrink: 0 }}>
        <button onClick={goBack} style={{ background: "none", border: "none", color: B.cyan, fontSize: 14, cursor: "pointer", fontFamily: SANS, ...T.ui, padding: 0 }}>
          ← Back
        </button>
        <div style={{ ...T.product, fontSize: 16, color: B.textPrimary, flex: 1, textAlign: "center" }}>Membership</div>
        <div style={{ width: 48 }} />
      </div>

      {/* Switch banner */}
      {switchBanner && (
        <div style={{ background: `${B.cyan}18`, borderBottom: `1px solid ${B.cyan}30`, padding: "10px 20px", ...T.ui, fontSize: 13, color: B.cyan, textAlign: "center" }}>
          ✓ {switchBanner}
        </div>
      )}

      <div style={{ flex: 1, overflowY: "auto" }}>
        {/* Cancelled state */}
        {cancelled ? (
          <div style={{ padding: 40, textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>😢</div>
            <div style={{ ...T.heading, fontSize: 22, color: B.textPrimary, marginBottom: 8 }}>Membership Cancelled</div>
            <div style={{ ...T.body, fontSize: 14, color: B.textMuted, marginBottom: 24 }}>
              Your benefits remain active until Apr 1. You can rejoin anytime.
            </div>
            <Btn onClick={() => setCancelled(false)} style={{ padding: "13px 32px" }}>REJOIN MEMBERSHIP</Btn>
          </div>
        ) : (
          <>
            {/* Current plan banner */}
            <div style={{ padding: "20px 20px 0" }}>
              <div style={{
                backgroundImage: `linear-gradient(180deg, rgba(10,23,40,0.25) 0%, rgba(10,23,40,0.75) 50%, rgba(10,23,40,0.95) 100%), url(${membershipRobe})`,
                backgroundSize: "cover",
                backgroundPosition: "center 15%",
                border: `1px solid ${B.cyan}30`,
                borderRadius: 16,
                padding: "120px 20px 20px",
                position: "relative",
                overflow: "hidden",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 22 }}>💎</span>
                    <div>
                      <div style={{ ...T.product, fontSize: 16, color: B.textPrimary }}>
                        {plans.find((p) => p.id === activePlan)?.name} Plan
                      </div>
                      <div style={{ ...T.ui, fontSize: 11, color: B.textMuted, fontWeight: 400 }}>
                        ${plans.find((p) => p.id === activePlan)?.price}/mo · Active since Jan 2025
                      </div>
                    </div>
                  </div>
                  <span style={{ ...T.tag, fontSize: 9, color: B.cyan, background: `${B.cyan}15`, padding: "4px 12px", borderRadius: 20, border: `1px solid ${B.cyan}25` }}>Active</span>
                </div>
                <div style={{ marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", ...T.ui, fontSize: 12, color: B.textSecondary, marginBottom: 8, fontWeight: 400 }}>
                    <span>2 of {plans.find((p) => p.id === activePlan)?.sessions ?? "∞"} sessions used this month</span>
                    <span style={{ color: B.cyan, fontWeight: 600 }}>50%</span>
                  </div>
                  <div style={{ height: 6, borderRadius: 3, background: "rgba(255,255,255,0.08)" }}>
                    <div style={{ height: "100%", width: "50%", borderRadius: 3, background: `linear-gradient(90deg, ${B.tealAccent}, ${B.cyan})` }} />
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div style={{ ...T.ui, fontSize: 12, color: B.textMuted, fontWeight: 400 }}>
                    Savings this year: <span style={{ color: B.gold, fontWeight: 700 }}>$1,080</span>
                  </div>
                  <div style={{ ...T.ui, fontSize: 12, color: B.textMuted, fontWeight: 400 }}>Renews Apr 1</div>
                </div>
              </div>
            </div>

            {/* Plans */}
            <div style={{ padding: "24px 20px 0" }}>
              <div style={{ ...T.heading, fontSize: 22, color: B.textPrimary, marginBottom: 4 }}>Your Plan</div>
              <div style={{ ...T.body, fontSize: 13, color: B.textMuted, marginBottom: 16 }}>Tap any plan to switch — changes take effect next billing cycle</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {plans.map((plan) => {
                  const isActive = plan.id === activePlan;
                  return (
                    <div
                      key={plan.id}
                      style={{
                        background: isActive ? `linear-gradient(135deg, ${B.bgCard}, ${B.tealLight})` : B.bgCard,
                        border: `1px solid ${isActive ? plan.color + "50" : B.border}`,
                        borderRadius: 16,
                        padding: 18,
                        position: "relative",
                        overflow: "hidden",
                      }}
                    >
                      {isActive && (
                        <div style={{ position: "absolute", top: 14, right: 14, ...T.tag, fontSize: 9, color: plan.color, background: `${plan.color}15`, padding: "4px 10px", borderRadius: 20, border: `1px solid ${plan.color}25` }}>
                          CURRENT PLAN
                        </div>
                      )}
                      <div style={{ marginBottom: 14 }}>
                        <div style={{ ...T.product, fontSize: 18, color: B.textPrimary }}>{plan.name}</div>
                        <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginTop: 4 }}>
                          <span style={{ fontFamily: SANS, fontWeight: 700, fontSize: 26, color: isActive ? plan.color : B.textSecondary }}>${plan.price}</span>
                          <span style={{ ...T.ui, fontSize: 12, color: B.textMuted, fontWeight: 400 }}>/month</span>
                        </div>
                        <div style={{ display: "inline-block", marginTop: 8, padding: "4px 12px", borderRadius: 20, background: isActive ? `${plan.color}20` : "rgba(255,255,255,0.07)", border: `1px solid ${isActive ? plan.color + "40" : "rgba(255,255,255,0.12)"}` }}>
                          <span style={{ fontFamily: SANS, fontWeight: 700, fontSize: 10, color: isActive ? plan.color : B.textMuted, letterSpacing: "0.06em" }}>{plan.savings}</span>
                        </div>
                        <div style={{ ...T.ui, fontSize: 13, fontWeight: 600, color: B.textSecondary, marginTop: 10, paddingBottom: 10, borderBottom: `1px solid rgba(255,255,255,0.07)` }}>
                          {plan.sessions} IV Treatment{plan.sessions !== 1 ? "s" : ""} /month
                        </div>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 }}>
                        {plan.features.map((f) => (
                          <div key={f} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ color: isActive ? plan.color : B.tealAccent, fontSize: 12 }}>✓</span>
                            <span style={{ ...T.body, fontSize: 12, color: B.textSecondary }}>{f}</span>
                          </div>
                        ))}
                      </div>
                      <Btn
                        variant={isActive ? "primary" : "outline"}
                        fullWidth
                        style={{ padding: "12px 0", fontSize: 12 }}
                        onClick={() => handleSwitch(plan.id)}
                      >
                        {isActive ? "CURRENT PLAN" : "SWITCH TO THIS PLAN"}
                      </Btn>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Benefits */}
            <div style={{ padding: "28px 20px 0" }}>
              <div style={{ ...T.heading, fontSize: 20, color: B.textPrimary, marginBottom: 16 }}>Member Benefits</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {benefits.map((b) => (
                  <div key={b.title} style={{ background: B.bgCard, border: `1px solid ${B.border}`, borderRadius: 12, padding: 14 }}>
                    <div style={{ fontSize: 20, marginBottom: 8 }}>{b.icon}</div>
                    <div style={{ ...T.ui, fontSize: 13, fontWeight: 700, color: B.textPrimary, marginBottom: 4 }}>{b.title}</div>
                    <div style={{ ...T.body, fontSize: 11, color: B.textMuted }}>{b.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ */}
            <div style={{ padding: "28px 20px 0" }}>
              <div style={{ ...T.heading, fontSize: 20, color: B.textPrimary, marginBottom: 14 }}>FAQ</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {faqs.map((faq, i) => (
                  <div key={i} style={{ borderBottom: `1px solid ${B.borderLight}` }}>
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      style={{ width: "100%", padding: "14px 0", display: "flex", justifyContent: "space-between", alignItems: "center", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}
                    >
                      <span style={{ ...T.ui, fontSize: 14, color: B.textPrimary, fontWeight: 600, fontFamily: SANS }}>{faq.q}</span>
                      <span style={{ color: B.textMuted, fontSize: 16, flexShrink: 0, marginLeft: 10 }}>{openFaq === i ? "−" : "+"}</span>
                    </button>
                    {openFaq === i && (
                      <div style={{ ...T.body, fontSize: 13, color: B.textSecondary, paddingBottom: 14, lineHeight: 1.6 }}>
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Cancel */}
            <div style={{ padding: "20px 20px 32px", textAlign: "center" }}>
              <div style={{ ...T.body, fontSize: 12, color: B.textMuted, marginBottom: 8 }}>
                Need to cancel? No fees, benefits last until end of billing period.
              </div>
              <button
                onClick={() => setShowCancelConfirm(true)}
                style={{ background: "none", border: "none", color: "rgba(239,68,68,0.6)", ...T.ui, fontSize: 13, cursor: "pointer", fontFamily: SANS, textDecoration: "underline" }}
              >
                Cancel membership
              </button>
            </div>
          </>
        )}
      </div>

      {/* Cancel confirmation modal */}
      {showCancelConfirm && (
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "flex-end", zIndex: 200 }}>
          <div style={{ width: "100%", background: B.bgCard, borderRadius: "20px 20px 0 0", padding: 28, borderTop: `1px solid ${B.border}` }}>
            <div style={{ ...T.heading, fontSize: 20, color: B.textPrimary, marginBottom: 8 }}>Cancel Membership?</div>
            <div style={{ ...T.body, fontSize: 14, color: B.textSecondary, marginBottom: 24, lineHeight: 1.6 }}>
              Your benefits continue until Apr 1. After that you'll lose member pricing, priority booking, and your dedicated coordinator.
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <button
                onClick={handleCancel}
                style={{ width: "100%", padding: 14, borderRadius: 12, ...T.btn, fontSize: 13, border: "1px solid rgba(220,38,38,0.3)", background: "rgba(220,38,38,0.08)", color: "#ef4444", cursor: "pointer", fontFamily: SANS }}
              >
                YES, CANCEL MEMBERSHIP
              </button>
              <Btn variant="outline" fullWidth style={{ padding: 14, fontSize: 13 }} onClick={() => setShowCancelConfirm(false)}>
                KEEP MY MEMBERSHIP
              </Btn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
