import { useState } from "react";
import { B, T, SANS, SERIF } from "../theme";
import { Btn } from "../components/Btn";
import type { NavProps } from "../MobileApp";
import type { BookingConfirmation } from "../MobileApp";

interface BookingConfirmationScreenProps extends NavProps {
  details: BookingConfirmation;
}

export function BookingConfirmationScreen({ details, goBack, onTabChange, navigate, openBooking }: BookingConfirmationScreenProps) {
  const [addedToCalendar, setAddedToCalendar] = useState(false);
  const [sharedReferral, setSharedReferral] = useState(false);
  const memberSavings = Math.round(details.price * 0.25);
  const memberPrice = details.price - memberSavings;
  const creditsEarned = Math.max(1, Math.round(details.totalCharged * 0.1));
  const isShipped = !!details.isShipped;
  const isSpecialty = /iron iv|ketamine iv|exosome/i.test(details.treatmentName);
  const showMembershipUpsell = !isShipped && !isSpecialty;

  return (
    <div style={{ position: "absolute", inset: 0, background: B.bg, zIndex: 150, display: "flex", flexDirection: "column", fontFamily: SANS, overflowY: "auto" }}>

      {/* Animated success header */}
      <div style={{ background: `linear-gradient(180deg, ${B.bgCard} 0%, ${B.bg} 100%)`, padding: "40px 24px 32px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -40, left: "50%", transform: "translateX(-50%)", width: 200, height: 200, background: `radial-gradient(circle, ${B.cyan}12, transparent 70%)` }} />

        {/* Check circle */}
        <div style={{
          width: 80, height: 80, borderRadius: "50%",
          background: `linear-gradient(135deg, ${B.tealAccent}, ${B.cyan})`,
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 20px",
          boxShadow: `0 0 0 12px ${B.cyan}12, 0 0 0 24px ${B.cyan}06`,
          fontSize: 36,
        }}>
          ✓
        </div>

        <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 30, color: B.textPrimary, marginBottom: 8, letterSpacing: "-0.02em" }}>
          {isShipped ? "Order Placed!" : "You're Booked!"}
        </div>
        <div style={{ ...T.body, fontSize: 14, color: B.textSecondary }}>
          {isShipped ? "Your order is confirmed" : "Your appointment is confirmed"}
        </div>
      </div>

      {/* Appointment / Order card */}
      <div style={{ padding: "0 20px 20px" }}>
        <div style={{ background: B.bgCard, border: `1px solid ${B.cyan}25`, borderRadius: 16, padding: 20, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, right: 0, width: 80, height: 80, background: `radial-gradient(circle at top right, ${B.cyan}10, transparent 70%)` }} />

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
            <div style={{ flex: 1, paddingRight: 12 }}>
              <div style={{ ...T.over, fontSize: 9, color: B.cyan, marginBottom: 6 }}>{isShipped ? "ORDER CONFIRMED" : "CONFIRMED APPOINTMENT"}</div>
              <div style={{ ...T.product, fontSize: 18, color: B.textPrimary, lineHeight: 1.3 }}>{details.treatmentName}</div>
            </div>
            <span style={{ ...T.tag, fontSize: 9, color: B.cyan, background: `${B.cyan}15`, padding: "4px 12px", borderRadius: 20, border: `1px solid ${B.cyan}25`, flexShrink: 0 }}>
              {isShipped ? "Processing" : "Confirmed"}
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: `${B.cyan}12`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 15 }}>{isShipped ? "📦" : "📅"}</div>
              <div>
                <div style={{ ...T.ui, fontSize: 13, fontWeight: 600, color: B.textPrimary }}>{details.date}</div>
                {details.time && (
                  <div style={{ ...T.ui, fontSize: 11, color: B.textMuted, fontWeight: 400 }}>{details.time}</div>
                )}
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: `${B.cyan}12`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 15 }}>📍</div>
              <div>
                <div style={{ ...T.ui, fontSize: 13, fontWeight: 600, color: B.textPrimary }}>{details.address}</div>
                <div style={{ ...T.ui, fontSize: 11, color: B.textMuted, fontWeight: 400 }}>{isShipped ? "Ships to your address" : "Nurse comes to you"}</div>
              </div>
            </div>
            {!isShipped && (
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: `${B.cyan}12`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 15 }}>👩‍⚕️</div>
              <div>
                <div style={{ ...T.ui, fontSize: 13, fontWeight: 600, color: B.textPrimary }}>Licensed nurse being assigned</div>
                <div style={{ ...T.ui, fontSize: 11, color: B.textMuted, fontWeight: 400 }}>You'll get a notification when confirmed</div>
              </div>
            </div>
            )}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: `${B.cyan}12`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 15 }}>💳</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {details.creditsApplied > 0 && (
                    <span style={{ ...T.ui, fontSize: 12, color: B.textMuted, fontWeight: 400, textDecoration: "line-through" }}>${details.price}</span>
                  )}
                  <span style={{ ...T.ui, fontSize: 13, fontWeight: 700, color: details.creditsApplied > 0 ? B.cyan : B.textPrimary }}>
                    ${details.totalCharged} charged
                  </span>
                </div>
                {details.creditsApplied > 0 ? (
                  <div style={{ ...T.ui, fontSize: 11, color: B.cyan, fontWeight: 500 }}>
                    ${details.creditsApplied} Drip Credits applied · Visa •••• 4242
                  </div>
                ) : (
                  <div style={{ ...T.ui, fontSize: 11, color: B.textMuted, fontWeight: 400 }}>Visa •••• 4242</div>
                )}
              </div>
            </div>
          </div>

          <div style={{ borderTop: `1px solid ${B.borderLight}`, paddingTop: 14, display: "flex", gap: 8 }}>
            <button
              onClick={() => setAddedToCalendar(true)}
              style={{ flex: 1, padding: "10px 0", borderRadius: 10, background: addedToCalendar ? `${B.cyan}12` : B.bg, border: `1px solid ${addedToCalendar ? B.cyan : B.border}`, color: addedToCalendar ? B.cyan : B.textSecondary, ...T.ui, fontSize: 11, cursor: "pointer", fontFamily: SANS }}
            >
              {addedToCalendar ? "✓ Added" : "📅 Add to Calendar"}
            </button>
            <button
              onClick={() => onTabChange("ord")}
              style={{ flex: 1, padding: "10px 0", borderRadius: 10, background: B.bg, border: `1px solid ${B.border}`, color: B.textSecondary, ...T.ui, fontSize: 11, cursor: "pointer", fontFamily: SANS }}
            >
              📋 View Orders
            </button>
          </div>
        </div>
      </div>

      {/* Credits earned banner */}
      <div style={{ padding: "0 20px 20px" }}>
        <div style={{ background: `linear-gradient(135deg, ${B.cyan}12, ${B.tealAccent}10)`, border: `1px solid ${B.cyan}30`, borderRadius: 14, padding: "14px 18px", display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: `${B.cyan}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>⭐</div>
          <div style={{ flex: 1 }}>
            <div style={{ ...T.ui, fontSize: 13, fontWeight: 700, color: B.textPrimary, marginBottom: 2 }}>
              You earned <span style={{ color: B.cyan }}>${creditsEarned} in Drip Credits</span>
            </div>
            <div style={{ ...T.body, fontSize: 11, color: B.textMuted }}>
              10% back on every visit · Balance updates after your appointment
            </div>
          </div>
          {details.creditsApplied > 0 && (
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <div style={{ ...T.ui, fontSize: 10, color: B.textMuted, marginBottom: 2 }}>Used today</div>
              <div style={{ ...T.ui, fontSize: 13, color: B.cyan, fontWeight: 700 }}>−${details.creditsApplied}</div>
            </div>
          )}
        </div>
      </div>

      {/* What to expect */}
      <div style={{ padding: "0 20px 20px" }}>
        <div style={{ ...T.heading, fontSize: 18, color: B.textPrimary, marginBottom: 14 }}>What Happens Next</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {[
            { icon: "📧", time: "Right now",      title: "Confirmation email sent",       desc: "Check neal@driphydration.com for your booking details" },
            { icon: "👩‍⚕️", time: "~1 hour before", title: "Nurse assignment notification", desc: "We'll let you know your nurse's name and ETA" },
            { icon: "🚗", time: "Day of",          title: "Nurse en route alert",          desc: "Real-time tracking so you know exactly when to expect them" },
            { icon: "💉", time: "During session",  title: "45–60 min treatment",           desc: "Relax while your IV drips — most clients watch TV or work" },
            { icon: "⭐", time: "After session",   title: "Rate your experience",          desc: "A quick review helps us assign your favorite nurses" },
          ].map((step, i, arr) => (
            <div key={i} style={{ display: "flex", gap: 14, paddingBottom: i < arr.length - 1 ? 16 : 0 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: B.bgCard, border: `1px solid ${B.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, flexShrink: 0 }}>
                  {step.icon}
                </div>
                {i < arr.length - 1 && <div style={{ width: 1, flex: 1, background: `${B.cyan}20`, marginTop: 4 }} />}
              </div>
              <div style={{ paddingTop: 4, paddingBottom: i < arr.length - 1 ? 12 : 0 }}>
                <div style={{ ...T.ui, fontSize: 10, color: B.cyan, fontWeight: 600, marginBottom: 2, textTransform: "uppercase", letterSpacing: "0.06em" }}>{step.time}</div>
                <div style={{ ...T.ui, fontSize: 13, fontWeight: 700, color: B.textPrimary }}>{step.title}</div>
                <div style={{ ...T.body, fontSize: 12, color: B.textMuted, marginTop: 2 }}>{step.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Membership upsell */}
      {showMembershipUpsell && (
      <div style={{ padding: "0 20px 20px" }}>
        <div style={{ background: `linear-gradient(135deg, ${B.bgCard}, ${B.tealLight})`, border: `1px solid ${B.gold}25`, borderRadius: 16, padding: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <span style={{ fontSize: 20 }}>💎</span>
            <div style={{ ...T.product, fontSize: 15, color: B.textPrimary }}>You could have paid ${memberPrice} today</div>
          </div>
          <div style={{ ...T.body, fontSize: 12, color: B.textSecondary, marginBottom: 16, lineHeight: 1.6 }}>
            Members save <span style={{ color: B.gold, fontWeight: 700 }}>${memberSavings}</span> on this treatment alone. Join and save from your next booking.
          </div>
          <Btn variant="ghost" fullWidth style={{ padding: "12px 0", fontSize: 12 }} onClick={() => navigate({ type: "membership" })}>
            VIEW MEMBERSHIP PLANS
          </Btn>
        </div>
      </div>
      )}

      {/* Referral card */}
      <div style={{ padding: "0 20px 20px" }}>
        <div style={{ background: B.bgCard, border: `1px solid ${B.border}`, borderRadius: 16, padding: 18, display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: `${B.gold}12`, border: `1px solid ${B.gold}20`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>
            🎁
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ ...T.ui, fontSize: 13, fontWeight: 700, color: B.textPrimary, marginBottom: 2 }}>Give $25, Get $25</div>
            <div style={{ ...T.body, fontSize: 12, color: B.textMuted }}>Refer a friend and you both save on your next session</div>
          </div>
          <button
            onClick={() => { setSharedReferral(true); navigate({ type: "referral" }); }}
            style={{ background: "none", border: "none", color: B.cyan, ...T.ui, fontSize: 12, cursor: "pointer", fontFamily: SANS, fontWeight: 700, flexShrink: 0 }}
          >
            {sharedReferral ? "Shared ✓" : "Share →"}
          </button>
        </div>
      </div>

      {/* Cancellation info */}
      <div style={{ padding: "0 20px 20px" }}>
        <div style={{ background: B.bgCard, border: `1px solid ${B.border}`, borderRadius: 14, padding: 16, display: "flex", gap: 12, alignItems: "flex-start" }}>
          <span style={{ fontSize: 18, flexShrink: 0 }}>ℹ️</span>
          <div>
            <div style={{ ...T.ui, fontSize: 13, fontWeight: 600, color: B.textPrimary, marginBottom: 4 }}>Free Cancellation</div>
            <div style={{ ...T.body, fontSize: 12, color: B.textMuted, lineHeight: 1.6 }}>
              Cancel or reschedule for free up to 2 hours before your appointment. Tap "View Orders" above to manage your booking.
            </div>
          </div>
        </div>
      </div>

      {/* Done button */}
      <div style={{ padding: "4px 20px 36px" }}>
        <Btn fullWidth style={{ padding: "15px 0", fontSize: 14 }} onClick={() => { onTabChange("home"); }}>
          DONE — GO TO HOME
        </Btn>
      </div>
    </div>
  );
}
