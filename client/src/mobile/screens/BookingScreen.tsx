import { useState } from "react";
import { B, T, SANS } from "../theme";
import { Btn } from "../components/Btn";
import { useQuery } from "@tanstack/react-query";
import type { Treatment } from "@shared/schema";
import type { BookingConfirmation } from "../MobileApp";
import { addOns as addOnDefs } from "@/lib/treatment-data";

interface BookingScreenProps {
  slug?: string;
  initialAddOns?: string[];
  onClose: () => void;
  onConfirmed: (details: BookingConfirmation) => void;
}

type Step = "select" | "schedule" | "confirm";

const TIMES = ["9:00 AM","10:00 AM","11:00 AM","12:00 PM","1:00 PM","2:00 PM","3:00 PM","4:00 PM","5:00 PM","6:00 PM"];
const TIME_SECTIONS = [
  { label: "Morning", times: ["9:00 AM","10:00 AM","11:00 AM"] },
  { label: "Afternoon", times: ["12:00 PM","1:00 PM","2:00 PM","3:00 PM"] },
  { label: "Evening", times: ["4:00 PM","5:00 PM","6:00 PM"] },
];
const DATES = ["Today, Mar 25","Tomorrow, Mar 26","Thu, Mar 27","Fri, Mar 28","Sat, Mar 29","Sun, Mar 30"];

const shippedSlugs = new Set([
  "weight-loss-semaglutide","weight-loss-tirzepatide","ketamine-therapy",
  "nad-injections","nad-nasal-spray","niagen-nr-injections",
  "peptide-sermorelin","peptide-cjc-ipamorelin","peptide-ghk-cu",
  "testosterone-trt","testosterone-enclomiphene","vitamin-b12","vitamin-lipostat",
]);

const USER_CREDITS = 75; // mock loyalty balance

const FILTER_TAGS = [
  { label: "All",        slugs: null },
  { label: "Recovery",   slugs: ["hangover-iv", "recovery-performance", "myers-cocktail-plus"] },
  { label: "Energy",     slugs: ["energy-boost", "nad-iv-therapy", "nad-boost"] },
  { label: "Immunity",   slugs: ["immunity-boost"] },
  { label: "Beauty",     slugs: ["beauty-drip"] },
  { label: "Hydration",  slugs: ["hydration-package"] },
  { label: "Specialty",  slugs: ["migraine-relief", "iron-iv", "ketamine-iv", "exosome-iv"] },
] as const;

export function BookingScreen({ slug, initialAddOns, onClose, onConfirmed }: BookingScreenProps) {
  const [step, setStep] = useState<Step>(slug ? "schedule" : "select");
  const [selectedSlug, setSelectedSlug] = useState(slug ?? "");
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [address, setAddress] = useState("123 Main St, Los Angeles");
  const [city, setCity] = useState("Los Angeles, CA");
  const [editingAddress, setEditingAddress] = useState(false);
  const [selectedDate, setSelectedDate] = useState(DATES[0]);
  const [selectedTime, setSelectedTime] = useState(TIMES[0]);
  const [selectedAddOns] = useState<Set<string>>(new Set(initialAddOns ?? []));

  // Credits state — default ON when user has credits, pre-apply max available
  const [creditsOn, setCreditsOn] = useState(USER_CREDITS > 0);
  const [creditsApplied, setCreditsApplied] = useState(USER_CREDITS > 0 ? USER_CREDITS : 0);

  const { data: treatments = [] } = useQuery<Treatment[]>({ queryKey: ["/api/treatments"] });
  const treatment = treatments.find((t) => t.slug === selectedSlug);
  const ivTreatments = treatments.filter((t) => !shippedSlugs.has(t.slug));

  const isShipped = shippedSlugs.has(selectedSlug);

  const rawPrice = treatment ? Math.round(treatment.price / 100) : 0;
  const addOnTotal = [...selectedAddOns].reduce((sum, id) => {
    const ao = addOnDefs.find((a) => a.id === id);
    return sum + (ao ? Math.round(ao.price / 100) : 0);
  }, 0);
  const subtotal = rawPrice + addOnTotal;
  const discount = creditsOn ? creditsApplied : 0;
  const totalDue = Math.max(0, subtotal - discount);

  // Shipped products skip scheduling — go straight to confirm
  const baseSteps: Step[] = isShipped
    ? ["confirm"]
    : ["schedule", "confirm"];
  const flowSteps: Step[] = slug ? baseSteps : ["select", ...baseSteps];
  const stepIdx = flowSteps.indexOf(step);

  function toggleCredits() {
    const next = !creditsOn;
    setCreditsOn(next);
    if (!next) setCreditsApplied(0);
    else {
      // Default to full available credits up to price
      const max = Math.min(USER_CREDITS, rawPrice);
      setCreditsApplied(max);
    }
  }

  function handleConfirm() {
    onConfirmed({
      treatmentName: treatment?.name ?? selectedSlug,
      date: isShipped ? "Ships in 3–5 business days" : selectedDate,
      time: isShipped ? "" : selectedTime,
      address: `${address}, ${city}`,
      price: subtotal,
      creditsApplied: discount,
      totalCharged: totalDue,
      isShipped,
    });
  }

  // Inline address card — used on both schedule and confirm (shipped) steps
  function renderAddressCard() {
    return (
      <div style={{ marginBottom: 20 }}>
        {!editingAddress && address && city ? (
          <div style={{ background: B.bgCard, border: `1px solid ${B.border}`, borderRadius: 12, padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 14 }}>📍</span>
              <div>
                <div style={{ ...T.ui, fontSize: 13, fontWeight: 600, color: B.textPrimary }}>Home · {address}</div>
                <div style={{ ...T.ui, fontSize: 11, color: B.textMuted, fontWeight: 400 }}>{city}</div>
              </div>
            </div>
            <span onClick={() => setEditingAddress(true)} style={{ ...T.ui, fontSize: 11, color: B.cyan, fontWeight: 600, cursor: "pointer", flexShrink: 0 }}>Change</span>
          </div>
        ) : (
          <div style={{ background: B.bgCard, border: `1px solid ${B.cyan}25`, borderRadius: 12, padding: 16 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Street address"
                style={{ width: "100%", padding: "11px 12px", background: B.bg, border: `1px solid ${B.border}`, borderRadius: 10, color: B.textPrimary, fontSize: 13, fontFamily: SANS, outline: "none", boxSizing: "border-box" as const }}
              />
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City, State"
                style={{ width: "100%", padding: "11px 12px", background: B.bg, border: `1px solid ${B.border}`, borderRadius: 10, color: B.textPrimary, fontSize: 13, fontFamily: SANS, outline: "none", boxSizing: "border-box" as const }}
              />
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
              {[
                { label: "Home", street: "123 Main St, Los Angeles", city: "Los Angeles, CA" },
                { label: "Office", street: "456 Wilshire Blvd", city: "Los Angeles, CA" },
              ].map((a, i) => (
                <div
                  key={i}
                  onClick={() => { setAddress(a.street); setCity(a.city); setEditingAddress(false); }}
                  style={{ ...T.ui, fontSize: 11, color: B.cyan, fontWeight: 600, cursor: "pointer", padding: "6px 12px", borderRadius: 8, background: `${B.cyan}10`, border: `1px solid ${B.cyan}20` }}
                >
                  📍 {a.label}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ position: "absolute", inset: 0, background: B.bg, zIndex: 200, display: "flex", flexDirection: "column", fontFamily: SANS }}>
      {/* Header */}
      <div style={{ padding: "16px 20px 12px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${B.border}`, flexShrink: 0 }}>
        {stepIdx > 0
          ? <button onClick={() => setStep(flowSteps[stepIdx - 1])} style={{ background: "none", border: "none", color: B.cyan, fontSize: 14, cursor: "pointer", fontFamily: SANS, ...T.ui }}>← Back</button>
          : <span />
        }
        <div style={{ ...T.product, fontSize: 16, color: B.textPrimary }}>{isShipped ? "Place Order" : "Book IV Therapy"}</div>
        <button onClick={onClose} style={{ background: "none", border: "none", color: B.textMuted, fontSize: 22, cursor: "pointer", lineHeight: 1 }}>×</button>
      </div>

      {/* Progress bar */}
      <div style={{ display: "flex", gap: 6, justifyContent: "center", padding: "12px 0", flexShrink: 0 }}>
        {flowSteps.map((s, i) => (
          <div key={s} style={{ width: 28, height: 4, borderRadius: 2, background: stepIdx >= i ? B.cyan : `${B.cyan}25`, transition: "background 0.3s" }} />
        ))}
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: "auto", padding: "8px 20px 20px" }}>

        {/* Step 1: Select treatment */}
        {step === "select" && (
          <div>
            <div style={{ ...T.heading, fontSize: 22, color: B.textPrimary, marginBottom: 6 }}>Choose a Treatment</div>
            <div style={{ ...T.body, fontSize: 13, color: B.textMuted, marginBottom: 14 }}>All IV treatments include a licensed nurse visit</div>

            {/* Filter tags */}
            <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4, marginBottom: 16, marginLeft: -20, paddingLeft: 20, marginRight: -20, paddingRight: 20 }}>
              {FILTER_TAGS.map((tag) => {
                const active = activeFilter === tag.label;
                return (
                  <button
                    key={tag.label}
                    onClick={() => setActiveFilter(tag.label)}
                    style={{
                      padding: "7px 16px",
                      borderRadius: 20,
                      border: `1px solid ${active ? B.cyan : B.border}`,
                      background: active ? `${B.cyan}18` : B.bgCard,
                      color: active ? B.cyan : B.textSecondary,
                      fontSize: 12,
                      fontFamily: SANS,
                      fontWeight: active ? 700 : 500,
                      cursor: "pointer",
                      whiteSpace: "nowrap" as const,
                      transition: "all 0.15s",
                      flexShrink: 0,
                    }}
                  >
                    {tag.label}
                  </button>
                );
              })}
            </div>

            {/* 2-column grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {ivTreatments
                .filter((t) => {
                  const tag = FILTER_TAGS.find((f) => f.label === activeFilter);
                  if (!tag || tag.slugs === null) return true;
                  return (tag.slugs as readonly string[]).includes(t.slug);
                })
                .map((t) => (
                  <div
                    key={t.id}
                    onClick={() => { setSelectedSlug(t.slug); setStep("schedule"); }}
                    style={{
                      background: selectedSlug === t.slug ? `${B.cyan}12` : B.bgCard,
                      border: `1px solid ${selectedSlug === t.slug ? B.cyan : B.border}`,
                      borderRadius: 14,
                      padding: "14px 12px",
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      gap: 6,
                    }}
                  >
                    <div style={{ ...T.product, fontSize: 13, color: B.textPrimary, lineHeight: 1.3 }}>{t.name}</div>
                    <div style={{ ...T.ui, fontSize: 11, color: B.textMuted, fontWeight: 400 }}>{t.duration} min</div>
                    <div style={{ marginTop: "auto", paddingTop: 4 }}>
                      <div style={{ ...T.price, fontSize: 15, color: B.textPrimary }}>${Math.round(t.price / 100)}</div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Step 2: Schedule + Address (merged) */}
        {step === "schedule" && (
          <div>
            <div style={{ ...T.heading, fontSize: 22, color: B.textPrimary, marginBottom: 4 }}>Pick a Date & Time</div>
            <div style={{ ...T.body, fontSize: 13, color: B.textMuted, marginBottom: 16 }}>A licensed nurse comes to you — book as early as today</div>

            {/* Address card — inline at top */}
            {renderAddressCard()}

            <div style={{ ...T.over, fontSize: 10, color: B.textMuted, marginBottom: 10 }}>DATE</div>
            <div style={{ display: "flex", gap: 8, overflowX: "auto", marginBottom: 20, paddingBottom: 4 }}>
              {DATES.map((d) => (
                <button
                  key={d}
                  onClick={() => setSelectedDate(d)}
                  style={{ padding: "10px 14px", borderRadius: 12, border: `1px solid ${selectedDate === d ? B.cyan : B.border}`, background: selectedDate === d ? `${B.cyan}15` : B.bgCard, color: selectedDate === d ? B.cyan : B.textSecondary, fontSize: 12, fontFamily: SANS, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}
                >
                  {d}
                </button>
              ))}
            </div>

            {TIME_SECTIONS.map((section) => (
              <div key={section.label} style={{ marginBottom: 16 }}>
                <div style={{ ...T.over, fontSize: 10, color: B.textMuted, marginBottom: 10 }}>{section.label.toUpperCase()}</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                  {section.times.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      style={{ padding: "12px 8px", borderRadius: 12, border: `1px solid ${selectedTime === time ? B.cyan : B.border}`, background: selectedTime === time ? `${B.cyan}15` : B.bgCard, color: selectedTime === time ? B.cyan : B.textSecondary, fontSize: 13, fontFamily: SANS, fontWeight: 600, cursor: "pointer" }}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <Btn fullWidth style={{ padding: "14px 0", fontSize: 13 }} onClick={() => { if (selectedDate && selectedTime && address && city) setStep("confirm"); }}>
              CONTINUE
            </Btn>
            {(!address || !city) && (
              <div style={{ ...T.body, fontSize: 12, color: B.textMuted, textAlign: "center", marginTop: 8 }}>
                Please enter your address to continue
              </div>
            )}
          </div>
        )}

        {/* Step 3: Confirm */}
        {step === "confirm" && (
          <div>
            <div style={{ ...T.heading, fontSize: 22, color: B.textPrimary, marginBottom: 16 }}>{isShipped ? "Confirm Order" : "Confirm Booking"}</div>

            {/* Compact booking summary — single card */}
            <div style={{ background: B.bgCard, border: `1px solid ${B.border}`, borderRadius: 14, padding: 16, marginBottom: 14 }}>
              {/* Compact details row */}
              {isShipped ? (
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                  <span style={{ fontSize: 14 }}>📦</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ ...T.ui, fontSize: 14, fontWeight: 700, color: B.textPrimary }}>{treatment?.name ?? selectedSlug}</div>
                    <div style={{ ...T.ui, fontSize: 11, color: B.textMuted, fontWeight: 400 }}>Ships to {address} · 3–5 business days</div>
                  </div>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 12 }}>
                  <div style={{ ...T.ui, fontSize: 15, fontWeight: 700, color: B.textPrimary }}>{treatment?.name ?? selectedSlug}</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    <span style={{ ...T.ui, fontSize: 11, color: B.textMuted, fontWeight: 400, display: "flex", alignItems: "center", gap: 4 }}>
                      📅 {selectedDate} · Nurse arrives {selectedTime}–{(() => {
                        const m = selectedTime.match(/^(\d+):(\d+)\s*(AM|PM)$/);
                        if (!m) return selectedTime;
                        let h = parseInt(m[1], 10);
                        let min = parseInt(m[2], 10) + 15;
                        let per = m[3];
                        if (min >= 60) { min -= 60; h += 1; if (h === 12) per = per === "AM" ? "PM" : "AM"; if (h > 12) h -= 12; }
                        return `${h}:${min.toString().padStart(2, "0")} ${per}`;
                      })()}
                    </span>
                    <span style={{ color: B.border }}>·</span>
                    <span style={{ ...T.ui, fontSize: 11, color: B.textMuted, fontWeight: 400, display: "flex", alignItems: "center", gap: 4 }}>
                      📍 {address.split(",")[0]}
                    </span>
                  </div>
                </div>
              )}

              {/* Price breakdown */}
              <div style={{ paddingTop: 12, borderTop: `1px solid ${B.border}`, display: "flex", flexDirection: "column", gap: 6 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ ...T.ui, fontSize: 13, color: B.textMuted, fontWeight: 400 }}>Treatment</span>
                  <span style={{ ...T.ui, fontSize: 13, color: B.textPrimary, fontWeight: 600 }}>${rawPrice}</span>
                </div>
                {addOnTotal > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <span style={{ ...T.ui, fontSize: 13, color: B.textMuted, fontWeight: 400 }}>Add-ons ({selectedAddOns.size})</span>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 4 }}>
                        {[...selectedAddOns].map((id) => {
                          const ao = addOnDefs.find((a) => a.id === id);
                          return ao ? (
                            <span key={id} style={{ ...T.ui, fontSize: 10, color: B.cyan, background: `${B.cyan}10`, padding: "2px 8px", borderRadius: 6, fontWeight: 600 }}>
                              {ao.name}
                            </span>
                          ) : null;
                        })}
                      </div>
                    </div>
                    <span style={{ ...T.ui, fontSize: 13, color: B.textPrimary, fontWeight: 600 }}>+${addOnTotal}</span>
                  </div>
                )}
                {creditsOn && creditsApplied > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ ...T.ui, fontSize: 13, color: B.cyan, fontWeight: 500 }}>Drip Credits</span>
                    <span style={{ ...T.ui, fontSize: 13, color: B.cyan, fontWeight: 700 }}>−${creditsApplied}</span>
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 8, borderTop: `1px solid ${B.borderLight}` }}>
                  <span style={{ ...T.product, fontSize: 15, color: B.textPrimary }}>Total</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {(creditsOn && creditsApplied > 0) && (
                      <span style={{ ...T.ui, fontSize: 13, color: B.textMuted, fontWeight: 400, textDecoration: "line-through" }}>${subtotal}</span>
                    )}
                    <span style={{ ...T.price, fontSize: 20, color: creditsOn && creditsApplied > 0 ? B.cyan : B.textPrimary }}>${totalDue}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Drip Credits — auto-applied, simple */}
            {USER_CREDITS > 0 && (
              <div style={{
                background: creditsOn ? `${B.cyan}08` : B.bgCard,
                border: `1px solid ${creditsOn ? B.cyan + "40" : B.border}`,
                borderRadius: 14,
                padding: "14px 16px",
                marginBottom: 14,
                transition: "all 0.2s",
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 16 }}>⭐</span>
                    <div>
                      {creditsOn && creditsApplied > 0 ? (
                        <>
                          <div style={{ ...T.ui, fontSize: 13, fontWeight: 700, color: B.cyan }}>
                            ✓ ${creditsApplied} Drip Credits applied
                          </div>
                          <div style={{ ...T.ui, fontSize: 11, color: B.textMuted, fontWeight: 400 }}>
                            ${USER_CREDITS - creditsApplied} remaining after booking
                          </div>
                        </>
                      ) : (
                        <>
                          <div style={{ ...T.ui, fontSize: 13, fontWeight: 600, color: B.textPrimary }}>Drip Credits</div>
                          <div style={{ ...T.ui, fontSize: 11, color: B.textMuted, fontWeight: 400 }}>
                            <span style={{ color: B.cyan, fontWeight: 600 }}>${USER_CREDITS}</span> available
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  <span
                    onClick={toggleCredits}
                    style={{ ...T.ui, fontSize: 11, color: B.cyan, fontWeight: 600, cursor: "pointer", flexShrink: 0 }}
                  >
                    {creditsOn ? "Remove" : "Apply"}
                  </span>
                </div>
              </div>
            )}

            {/* Payment method */}
            <div style={{ background: B.bgCard, border: `1px solid ${B.border}`, borderRadius: 12, padding: "14px 16px", marginBottom: 14, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 16 }}>💳</span>
                <div>
                  <div style={{ ...T.ui, fontSize: 13, fontWeight: 600, color: B.textPrimary }}>Visa •••• 4242</div>
                  <div style={{ ...T.ui, fontSize: 11, color: B.textMuted, fontWeight: 400 }}>Default payment method</div>
                </div>
              </div>
              <span style={{ ...T.ui, fontSize: 11, color: B.cyan, fontWeight: 600, cursor: "pointer", flexShrink: 0 }}>Change</span>
            </div>

            <Btn fullWidth style={{ padding: "15px 0", fontSize: 14 }} onClick={handleConfirm}>
              {isShipped
                ? (totalDue === 0 ? "PLACE ORDER — FREE WITH CREDITS" : `PLACE ORDER · $${totalDue}`)
                : (totalDue === 0 ? "CONFIRM — FREE WITH CREDITS" : `CONFIRM & PAY $${totalDue}`)}
            </Btn>

            <div style={{ ...T.body, fontSize: 11, color: B.textMuted, textAlign: "center", marginTop: 12 }}>
              {isShipped ? "Ships in 3–5 business days · Free returns within 30 days" : "Free cancellation up to 2 hours before appointment"}
            </div>

            {/* Membership nudge — in-home IVs only */}
            {!isShipped && !["iron-iv","ketamine-iv","exosome-iv"].includes(selectedSlug) && (
              <div style={{ ...T.ui, fontSize: 12, color: B.gold, fontWeight: 600, textAlign: "center", marginTop: 16, cursor: "pointer" }}>
                💎 Members save ${treatment ? Math.round(treatment.price * 0.25 / 100) : "—"} on this treatment →
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
