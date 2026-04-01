import { useState } from "react";
import { B, T, SANS } from "../theme";
import { Btn } from "../components/Btn";
import { useQuery } from "@tanstack/react-query";
import type { Treatment } from "@shared/schema";
import type { BookingConfirmation } from "../MobileApp";
import { addOns as addOnDefs } from "@/lib/treatment-data";

// Recommended add-ons per treatment (top 3 most relevant)
const recommendedAddOns: Record<string, string[]> = {
  "myers-cocktail-plus": ["glutathione", "b12-booster", "magnesium"],
  "hangover-iv":         ["glutathione", "b12-booster", "magnesium"],
  "recovery-performance":["b12-booster", "magnesium", "zinc"],
  "nad-iv-therapy":      ["glutathione", "b12-booster", "vitamin-d"],
  "nad-boost":           ["glutathione", "b12-booster", "vitamin-d"],
  "energy-boost":        ["b12-booster", "vitamin-d", "magnesium"],
  "immunity-boost":      ["zinc", "vitamin-d", "glutathione"],
  "beauty-drip":         ["biotin", "glutathione", "vitamin-d"],
  "hydration-package":   ["b12-booster", "magnesium", "zinc"],
  "migraine-relief":     ["magnesium", "b12-booster", "zinc"],
  "iron-iv":             ["b12-booster", "vitamin-d", "zinc"],
  "ketamine-iv":         ["magnesium", "b12-booster", "glutathione"],
  "exosome-iv":          ["glutathione", "biotin", "vitamin-d"],
};
const defaultRecommended = ["glutathione", "b12-booster", "magnesium"];

interface BookingScreenProps {
  slug?: string;
  initialAddOns?: string[];
  onClose: () => void;
  onConfirmed: (details: BookingConfirmation) => void;
}

type Step = "select" | "location" | "schedule" | "confirm";

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
  const [step, setStep] = useState<Step>(slug ? "location" : "select");
  const [selectedSlug, setSelectedSlug] = useState(slug ?? "");
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [address, setAddress] = useState("123 Main St, Los Angeles");
  const [city, setCity] = useState("Los Angeles, CA");
  const [editingAddress, setEditingAddress] = useState(false);
  const [selectedDate, setSelectedDate] = useState(DATES[0]);
  const [selectedTime, setSelectedTime] = useState(TIMES[4]);
  const [selectedAddOns, setSelectedAddOns] = useState<Set<string>>(new Set(initialAddOns ?? []));
  const [addOnsExpanded, setAddOnsExpanded] = useState(false);
  const [showAllAddOns, setShowAllAddOns] = useState(false);

  function toggleAddOn(id: string) {
    setSelectedAddOns((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

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

  // Shipped products skip the date/time scheduling step
  const baseSteps: Step[] = isShipped
    ? ["location", "confirm"]
    : ["location", "schedule", "confirm"];
  const flowSteps: Step[] = slug ? baseSteps : ["select", ...baseSteps];
  const stepIdx = flowSteps.indexOf(step);

  // Quick-pick credit amounts capped to available balance and price
  function creditOptions(price: number) {
    const max = Math.min(USER_CREDITS, price);
    const opts: number[] = [];
    if (max >= 10) opts.push(10);
    if (max >= 25) opts.push(25);
    if (max >= 50) opts.push(50);
    if (!opts.includes(max)) opts.push(max);
    return opts;
  }

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
                    onClick={() => { setSelectedSlug(t.slug); setStep("location"); }}
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

        {/* Step 2: Location */}
        {step === "location" && (
          <div>
            <div style={{ ...T.heading, fontSize: 22, color: B.textPrimary, marginBottom: 4 }}>{isShipped ? "Shipping Address" : "Where should we go?"}</div>
            <div style={{ ...T.body, fontSize: 13, color: B.textMuted, marginBottom: 24 }}>{isShipped ? "We'll ship your order directly to you" : "Our nurse will come to you"}</div>

            {treatment && (
              <div style={{ background: `${B.cyan}10`, border: `1px solid ${B.cyan}25`, borderRadius: 12, padding: "12px 16px", marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ ...T.product, fontSize: 14, color: B.textPrimary }}>{treatment.name}</div>
                <div style={{ ...T.price, fontSize: 14, color: B.cyan }}>${Math.round(treatment.price / 100)}</div>
              </div>
            )}

            {/* Pre-filled saved address card (default view) */}
            {!editingAddress && address && city ? (
              <div>
                <div style={{ background: B.bg, border: `1px solid ${B.cyan}25`, borderRadius: 12, padding: "14px 16px", marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontSize: 16 }}>📍</span>
                    <div>
                      <div style={{ ...T.ui, fontSize: 13, fontWeight: 600, color: B.textPrimary }}>Home · {address}</div>
                      <div style={{ ...T.ui, fontSize: 11, color: B.textMuted, fontWeight: 400 }}>{city}</div>
                    </div>
                  </div>
                  <span onClick={() => setEditingAddress(true)} style={{ ...T.ui, fontSize: 11, color: B.cyan, fontWeight: 600, cursor: "pointer", flexShrink: 0 }}>Change</span>
                </div>

                <div style={{ ...T.over, fontSize: 9, color: B.textMuted, marginBottom: 10 }}>OTHER ADDRESSES</div>
                {[{ label: "Office", street: "456 Wilshire Blvd", city: "Los Angeles, CA" }].map((a, i) => (
                  <div
                    key={i}
                    onClick={() => { setAddress(a.street); setCity(a.city); }}
                    style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 0", borderBottom: `1px solid ${B.borderLight}`, cursor: "pointer" }}
                  >
                    <span>📍</span>
                    <span style={{ ...T.ui, fontSize: 13, color: B.textSecondary }}>{a.label} · {a.street}</span>
                  </div>
                ))}
                <div
                  onClick={() => { setAddress(""); setCity(""); setEditingAddress(true); }}
                  style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 0", cursor: "pointer" }}
                >
                  <span style={{ fontSize: 14, color: B.cyan }}>＋</span>
                  <span style={{ ...T.ui, fontSize: 13, color: B.cyan, fontWeight: 600 }}>Add new address</span>
                </div>
              </div>
            ) : (
              /* Manual address entry (for editing or new address) */
              <div>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <div>
                    <label style={{ ...T.ui, fontSize: 12, color: B.textMuted, display: "block", marginBottom: 6 }}>STREET ADDRESS</label>
                    <input
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="123 Main St, Apt 4B"
                      style={{ width: "100%", padding: "13px 14px", background: B.bgCard, border: `1px solid ${B.border}`, borderRadius: 12, color: B.textPrimary, fontSize: 14, fontFamily: SANS, outline: "none", boxSizing: "border-box" }}
                    />
                  </div>
                  <div>
                    <label style={{ ...T.ui, fontSize: 12, color: B.textMuted, display: "block", marginBottom: 6 }}>CITY</label>
                    <input
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Los Angeles, CA"
                      style={{ width: "100%", padding: "13px 14px", background: B.bgCard, border: `1px solid ${B.border}`, borderRadius: 12, color: B.textPrimary, fontSize: 14, fontFamily: SANS, outline: "none", boxSizing: "border-box" }}
                    />
                  </div>
                </div>

                <div style={{ marginTop: 16 }}>
                  <div style={{ ...T.over, fontSize: 9, color: B.textMuted, marginBottom: 10 }}>SAVED ADDRESSES</div>
                  {["Home · 123 Main St, Los Angeles", "Office · 456 Wilshire Blvd"].map((a, i) => (
                    <div
                      key={i}
                      onClick={() => { setAddress(a.split("·")[1].trim()); setCity("Los Angeles, CA"); setEditingAddress(false); }}
                      style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 0", borderBottom: `1px solid ${B.borderLight}`, cursor: "pointer" }}
                    >
                      <span>📍</span>
                      <span style={{ ...T.ui, fontSize: 13, color: B.textSecondary }}>{a}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Btn fullWidth style={{ marginTop: 24, padding: "14px 0", fontSize: 13 }} onClick={() => { if (address && city) setStep(isShipped ? "confirm" : "schedule"); }}>
              CONTINUE
            </Btn>
            {(!address || !city) && (
              <div style={{ ...T.body, fontSize: 12, color: B.textMuted, textAlign: "center", marginTop: 8 }}>
                Please enter your address to continue
              </div>
            )}
          </div>
        )}

        {/* Step 3: Schedule */}
        {step === "schedule" && (
          <div>
            <div style={{ ...T.heading, fontSize: 22, color: B.textPrimary, marginBottom: 4 }}>Pick a Date & Time</div>
            <div style={{ ...T.body, fontSize: 13, color: B.textMuted, marginBottom: 20 }}>Same-day appointments often available</div>

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

            <Btn fullWidth style={{ padding: "14px 0", fontSize: 13 }} onClick={() => { if (selectedDate && selectedTime) setStep("confirm"); }}>
              CONTINUE
            </Btn>
            {(!selectedDate || !selectedTime) && (
              <div style={{ ...T.body, fontSize: 12, color: B.textMuted, textAlign: "center", marginTop: 8 }}>
                Please select a date and time
              </div>
            )}
          </div>
        )}

        {/* Step 4: Confirm */}
        {step === "confirm" && (
          <div>
            <div style={{ ...T.heading, fontSize: 22, color: B.textPrimary, marginBottom: 20 }}>{isShipped ? "Confirm Order" : "Confirm Booking"}</div>

            {/* Booking summary */}
            <div style={{ background: B.bgCard, border: `1px solid ${B.border}`, borderRadius: 14, padding: 18, marginBottom: 14 }}>
              <div style={{ ...T.over, fontSize: 10, color: B.textMuted, marginBottom: 14 }}>{isShipped ? "ORDER SUMMARY" : "BOOKING SUMMARY"}</div>
              {(isShipped
                ? [
                    { label: "Product",   value: treatment?.name ?? selectedSlug },
                    { label: "Ships to",  value: `${address}, ${city}` },
                    { label: "Delivery",  value: "3–5 business days" },
                  ]
                : [
                    { label: "Treatment", value: treatment?.name ?? selectedSlug },
                    { label: "Date",      value: selectedDate },
                    { label: "Time",      value: selectedTime },
                    { label: "Address",   value: `${address}, ${city}` },
                  ]
              ).map((row, i, arr) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: i < arr.length - 1 ? `1px solid ${B.borderLight}` : "none" }}>
                  <span style={{ ...T.ui, fontSize: 13, color: B.textMuted, fontWeight: 400 }}>{row.label}</span>
                  <span style={{ ...T.ui, fontSize: 13, color: B.textPrimary, fontWeight: 600, maxWidth: "55%", textAlign: "right" }}>{row.value}</span>
                </div>
              ))}

              {/* Price breakdown */}
              <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${B.border}`, display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ ...T.ui, fontSize: 13, color: B.textMuted, fontWeight: 400 }}>Treatment price</span>
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
                    <span style={{ ...T.ui, fontSize: 13, color: B.cyan, fontWeight: 500 }}>Drip Credits applied</span>
                    <span style={{ ...T.ui, fontSize: 13, color: B.cyan, fontWeight: 700 }}>−${creditsApplied}</span>
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 8, borderTop: `1px solid ${B.borderLight}` }}>
                  <span style={{ ...T.product, fontSize: 15, color: B.textPrimary }}>Total due</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {(creditsOn && creditsApplied > 0) && (
                      <span style={{ ...T.ui, fontSize: 13, color: B.textMuted, fontWeight: 400, textDecoration: "line-through" }}>${subtotal}</span>
                    )}
                    <span style={{ ...T.price, fontSize: 20, color: creditsOn && creditsApplied > 0 ? B.cyan : B.textPrimary }}>${totalDue}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Drip Credits card */}
            <div style={{
              background: creditsOn ? `${B.cyan}08` : B.bgCard,
              border: `1px solid ${creditsOn ? B.cyan + "40" : B.border}`,
              borderRadius: 14,
              padding: 16,
              marginBottom: 14,
              transition: "all 0.2s",
            }}>
              {/* Header row */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: creditsOn ? 14 : 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: `${B.cyan}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
                    ⭐
                  </div>
                  <div>
                    <div style={{ ...T.ui, fontSize: 14, fontWeight: 700, color: B.textPrimary }}>Drip Credits</div>
                    <div style={{ ...T.ui, fontSize: 11, color: B.textMuted, fontWeight: 400 }}>
                      <span style={{ color: B.cyan, fontWeight: 600 }}>${USER_CREDITS}.00</span> available
                    </div>
                  </div>
                </div>

                {/* Toggle */}
                <div
                  onClick={toggleCredits}
                  style={{
                    width: 46, height: 26, borderRadius: 13,
                    background: creditsOn ? B.cyan : B.border,
                    position: "relative", cursor: "pointer",
                    transition: "background 0.2s", flexShrink: 0,
                  }}
                >
                  <div style={{
                    width: 20, height: 20, borderRadius: "50%", background: "#fff",
                    position: "absolute", top: 3,
                    left: creditsOn ? 23 : 3,
                    transition: "left 0.2s",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
                  }} />
                </div>
              </div>

              {/* Credit amount selector — shown when toggled on */}
              {creditsOn && (
                <div>
                  <div style={{ ...T.over, fontSize: 9, color: B.textMuted, marginBottom: 10 }}>APPLY AMOUNT</div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
                    {creditOptions(rawPrice).map((amt) => (
                      <button
                        key={amt}
                        onClick={() => setCreditsApplied(amt)}
                        style={{
                          padding: "8px 14px", borderRadius: 10,
                          border: `1px solid ${creditsApplied === amt ? B.cyan : B.border}`,
                          background: creditsApplied === amt ? `${B.cyan}18` : B.bg,
                          color: creditsApplied === amt ? B.cyan : B.textSecondary,
                          fontSize: 13, fontFamily: SANS, fontWeight: 700, cursor: "pointer",
                          transition: "all 0.15s",
                        }}
                      >
                        {amt === Math.min(USER_CREDITS, rawPrice) ? `$${amt} (max)` : `$${amt}`}
                      </button>
                    ))}
                    <button
                      onClick={() => setCreditsApplied(0)}
                      style={{
                        padding: "8px 14px", borderRadius: 10,
                        border: `1px solid ${creditsApplied === 0 ? B.border : B.border}`,
                        background: creditsApplied === 0 ? `rgba(255,255,255,0.06)` : B.bg,
                        color: B.textMuted,
                        fontSize: 13, fontFamily: SANS, fontWeight: 600, cursor: "pointer",
                      }}
                    >
                      None
                    </button>
                  </div>

                  {/* Savings callout */}
                  {creditsApplied > 0 && (
                    <div style={{ background: `${B.cyan}12`, borderRadius: 10, padding: "10px 12px", display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 15 }}>✓</span>
                      <span style={{ ...T.ui, fontSize: 12, color: B.cyan, fontWeight: 600 }}>
                        Saving ${creditsApplied} today — ${USER_CREDITS - creditsApplied} remaining after booking
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Add-ons upsell (IV only) */}
            {!isShipped && (
              <div style={{ background: B.bgCard, border: `1px solid ${selectedAddOns.size > 0 ? B.cyan + "40" : B.border}`, borderRadius: 14, padding: 16, marginBottom: 14, transition: "all 0.2s" }}>
                <div
                  onClick={() => setAddOnsExpanded(!addOnsExpanded)}
                  style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: `${B.cyan}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
                      💊
                    </div>
                    <div>
                      <div style={{ ...T.ui, fontSize: 14, fontWeight: 700, color: B.textPrimary }}>Vitamin Add-Ons</div>
                      <div style={{ ...T.ui, fontSize: 11, color: B.textMuted, fontWeight: 400 }}>
                        {selectedAddOns.size > 0
                          ? <span style={{ color: B.cyan, fontWeight: 600 }}>{selectedAddOns.size} selected · +${addOnTotal}</span>
                          : "Customize your IV treatment"
                        }
                      </div>
                    </div>
                  </div>
                  <span style={{ ...T.ui, fontSize: 18, color: B.textMuted, transition: "transform 0.2s", transform: addOnsExpanded ? "rotate(180deg)" : "rotate(0deg)" }}>▾</span>
                </div>

                {addOnsExpanded && (() => {
                  const recIds = recommendedAddOns[selectedSlug] ?? defaultRecommended;
                  const recommended = addOnDefs.filter((ao) => recIds.includes(ao.id));
                  const others = addOnDefs.filter((ao) => !recIds.includes(ao.id));
                  const visibleAddOns = showAllAddOns ? [...recommended, ...others] : recommended;

                  return (
                    <div style={{ marginTop: 14 }}>
                      <div style={{ ...T.over, fontSize: 9, color: B.cyan, marginBottom: 8 }}>RECOMMENDED FOR THIS TREATMENT</div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {visibleAddOns.map((ao) => {
                          const selected = selectedAddOns.has(ao.id);
                          const isRec = recIds.includes(ao.id);
                          return (
                            <div
                              key={ao.id}
                              onClick={() => toggleAddOn(ao.id)}
                              style={{
                                background: selected ? `${B.cyan}10` : B.bg,
                                border: `1px solid ${selected ? B.cyan : B.border}`,
                                borderRadius: 12,
                                padding: "10px 12px",
                                display: "flex",
                                alignItems: "center",
                                gap: 10,
                                cursor: "pointer",
                                transition: "all 0.15s",
                              }}
                            >
                              <div style={{ width: 20, height: 20, borderRadius: "50%", border: `2px solid ${selected ? B.cyan : B.border}`, background: selected ? B.cyan : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.15s" }}>
                                {selected && <span style={{ color: B.bg, fontSize: 11, lineHeight: 1 }}>✓</span>}
                              </div>
                              <div style={{ flex: 1 }}>
                                <div style={{ ...T.ui, fontSize: 12, fontWeight: 600, color: B.textPrimary }}>{ao.name}</div>
                                <div style={{ ...T.body, fontSize: 10, color: B.textMuted }}>{ao.description}</div>
                              </div>
                              <div style={{ ...T.price, fontSize: 12, color: selected ? B.cyan : B.textSecondary, flexShrink: 0 }}>
                                +${Math.round(ao.price / 100)}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      {!showAllAddOns && others.length > 0 && (
                        <div
                          onClick={(e) => { e.stopPropagation(); setShowAllAddOns(true); }}
                          style={{ ...T.ui, fontSize: 12, color: B.cyan, fontWeight: 600, textAlign: "center", padding: "12px 0 4px", cursor: "pointer" }}
                        >
                          See all {addOnDefs.length} add-ons →
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Membership upsell hint */}
            <div style={{ background: `${B.gold}08`, border: `1px solid ${B.gold}25`, borderRadius: 12, padding: "12px 16px", marginBottom: 20 }}>
              {isShipped ? (
                <>
                  <div style={{ ...T.ui, fontSize: 12, color: B.gold, fontWeight: 600, marginBottom: 4 }}>
                    💎 Members get free shipping + priority fulfillment
                  </div>
                  <div style={{ ...T.body, fontSize: 12, color: B.textMuted }}>
                    Join a membership to pay ${treatment ? Math.round(treatment.price * 0.75 / 100) : "—"} per shipment
                  </div>
                </>
              ) : (
                <>
                  <div style={{ ...T.ui, fontSize: 12, color: B.gold, fontWeight: 600, marginBottom: 4 }}>
                    💎 Members save ${treatment ? Math.round(treatment.price * 0.25 / 100) : "—"}
                  </div>
                  <div style={{ ...T.body, fontSize: 12, color: B.textMuted }}>
                    Join a membership to pay ${treatment ? Math.round(treatment.price * 0.75 / 100) : "—"} instead
                  </div>
                </>
              )}
            </div>

            {/* Payment method */}
            <div style={{ background: B.bgCard, border: `1px solid ${B.border}`, borderRadius: 12, padding: "14px 16px", marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
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
          </div>
        )}
      </div>
    </div>
  );
}
