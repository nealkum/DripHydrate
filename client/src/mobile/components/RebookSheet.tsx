import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Treatment } from "@shared/schema";
import { B, T, SANS } from "../theme";
import { Btn } from "./Btn";
import { Stars } from "./Stars";
import { memberPriceMap, addOns as addOnDefs, shippedToYouSlugs } from "@/lib/treatment-data";
import type { BookingConfirmation } from "../MobileApp";

interface RebookSheetProps {
  slug: string;
  previousAddOns?: string[];
  onClose: () => void;
  onConfirmed: (details: BookingConfirmation) => void;
}

const NEXT_AVAILABLE = { label: "Today, Apr 1", time: "2:00 PM", value: "Today, Apr 1" };

const ALL_DATES = ["Today, Apr 1","Tomorrow, Apr 2","Thu, Apr 3","Fri, Apr 4","Sat, Apr 5","Sun, Apr 6"];
const ALL_TIMES = ["9:00 AM","10:00 AM","11:00 AM","12:00 PM","1:00 PM","2:00 PM","3:00 PM","4:00 PM","5:00 PM","6:00 PM"];

const SAVED_ADDRESSES = [
  { label: "Home", street: "123 Main St", city: "Los Angeles, CA", full: "123 Main St, Los Angeles, CA" },
  { label: "Office", street: "456 Wilshire Blvd", city: "Los Angeles, CA", full: "456 Wilshire Blvd, Los Angeles, CA" },
];
const SAVED_PAYMENTS = [
  { brand: "Visa", last4: "4242", icon: "💳" },
  { brand: "Amex", last4: "1001", icon: "💳" },
];
const USER_CREDITS = 75;

export function RebookSheet({ slug, previousAddOns = [], onClose, onConfirmed }: RebookSheetProps) {
  const { data: treatments = [] } = useQuery<Treatment[]>({ queryKey: ["/api/treatments"] });
  const treatment = treatments.find((t) => t.slug === slug);

  const isShipped = shippedToYouSlugs.has(slug);
  const [selectedDate, setSelectedDate] = useState(NEXT_AVAILABLE.value);
  const [selectedTime, setSelectedTime] = useState(NEXT_AVAILABLE.time);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [membershipOn, setMembershipOn] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(SAVED_ADDRESSES[0]);
  const [addingNewAddress, setAddingNewAddress] = useState(false);
  const [newStreet, setNewStreet] = useState("");
  const [newCity, setNewCity] = useState("");
  const [selectedPayment, setSelectedPayment] = useState(SAVED_PAYMENTS[0]);

  // Accordion: only one section open at a time
  type Section = "time" | "address" | "payment" | null;
  const [activeSection, setActiveSection] = useState<Section>(null);
  const editingAddress = activeSection === "address";
  const editingPayment = activeSection === "payment";
  function toggleSection(s: Section) {
    setActiveSection((prev) => prev === s ? null : s);
    if (s !== "address") setAddingNewAddress(false);
  }

  if (!treatment) {
    return (
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 400, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
        <div onClick={(e) => e.stopPropagation()} style={{ background: B.bgCard, borderRadius: "24px 24px 0 0", padding: "24px 20px 36px" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
            <div style={{ width: 36, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.15)" }} />
          </div>
          <div style={{ ...T.body, fontSize: 14, color: B.textMuted, textAlign: "center", padding: "20px 0" }}>Loading...</div>
        </div>
      </div>
    );
  }

  const basePrice = Math.round(treatment.price / 100);
  const memberPrice = memberPriceMap[slug] ? Math.round(memberPriceMap[slug] / 100) : Math.round(basePrice * 0.75);
  const savings = basePrice - memberPrice;
  const activePrice = membershipOn ? memberPrice : basePrice;

  // Add-on total from previous booking
  const addOnTotal = previousAddOns.reduce((sum, id) => {
    const ao = addOnDefs.find((a) => a.id === id);
    return sum + (ao ? Math.round(ao.price / 100) : 0);
  }, 0);
  const total = activePrice + addOnTotal;

  function handleConfirm() {
    setProcessing(true);
    // Simulate brief processing delay for tactile feel
    setTimeout(() => {
      onConfirmed({
        treatmentName: treatment!.name,
        date: isShipped ? "Ships in 3–5 business days" : selectedDate,
        time: isShipped ? "" : selectedTime,
        address: selectedAddress.full,
        price: total,
        creditsApplied: 0,
        totalCharged: total,
        isShipped,
      });
    }, 600);
  }

  return (
    <div
      onClick={onClose}
      style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 400, display: "flex", flexDirection: "column", justifyContent: "flex-end", fontFamily: SANS }}
    >
      <div onClick={(e) => e.stopPropagation()} style={{ background: B.bgCard, borderRadius: "24px 24px 0 0", maxHeight: "85%", overflowY: "auto" }}>
        {/* Handle */}
        <div style={{ display: "flex", justifyContent: "center", padding: "14px 0 4px", position: "sticky", top: 0, background: B.bgCard, borderRadius: "24px 24px 0 0", zIndex: 1 }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.15)" }} />
        </div>

        <div style={{ padding: "8px 20px 36px" }}>
          {/* Treatment header */}
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: `linear-gradient(135deg, ${B.tealAccent}, ${B.cyan})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>
              {isShipped ? "📦" : "💉"}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ ...T.product, fontSize: 17, color: B.textPrimary }}>{treatment.name}</div>
              <div style={{ ...T.ui, fontSize: 12, color: B.textMuted, fontWeight: 400, marginTop: 2 }}>
                {isShipped ? "Shipped to your door" : `${treatment.duration} min · In-home visit`}
              </div>
            </div>
          </div>

          {/* Pricing with membership */}
          <div style={{
            background: membershipOn ? `${B.cyan}06` : B.bg,
            border: `1px solid ${membershipOn ? B.cyan + "25" : B.border}`,
            borderRadius: 14,
            padding: 16,
            marginBottom: 16,
            transition: "all 0.2s",
          }}>
            {/* Price lines — hierarchy: 1) final price (largest) 2) savings 3) original (de-emphasized) */}
            <div style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: membershipOn ? 4 : 0 }}>
                <span style={{ ...T.price, fontSize: 28, fontWeight: 800, color: B.textPrimary, letterSpacing: "-0.02em" }}>
                  ${membershipOn ? memberPrice : basePrice}
                </span>
                {membershipOn && (
                  <span style={{ ...T.ui, fontSize: 13, color: B.textMuted, fontWeight: 400, textDecoration: "line-through", textDecorationColor: "rgba(255,255,255,0.25)" }}>
                    ${basePrice}
                  </span>
                )}
              </div>
              {membershipOn && (
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ ...T.tag, fontSize: 10, color: B.cyan, fontWeight: 700, background: `${B.cyan}12`, padding: "3px 8px", borderRadius: 6 }}>
                    SAVE ${savings}
                  </span>
                  <span style={{ ...T.ui, fontSize: 11, color: B.textMuted, fontWeight: 400 }}>with membership</span>
                </div>
              )}
            </div>

            {/* Toggle row */}
            <div
              onClick={() => setMembershipOn(!membershipOn)}
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", padding: "10px 12px", borderRadius: 10, background: membershipOn ? `${B.cyan}10` : "rgba(255,255,255,0.04)", border: `1px solid ${membershipOn ? B.cyan + "20" : B.borderLight}` }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 14 }}>💎</span>
                <span style={{ ...T.ui, fontSize: 12, fontWeight: 600, color: membershipOn ? B.cyan : B.textSecondary }}>
                  {membershipOn ? "Member pricing applied" : "Apply member pricing"}
                </span>
              </div>
              <div style={{
                width: 40, height: 22, borderRadius: 11,
                background: membershipOn ? B.cyan : B.border,
                position: "relative", transition: "background 0.2s", flexShrink: 0,
              }}>
                <div style={{
                  width: 18, height: 18, borderRadius: "50%", background: "#fff",
                  position: "absolute", top: 2,
                  left: membershipOn ? 20 : 2,
                  transition: "left 0.2s",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
                }} />
              </div>
            </div>
          </div>

          {/* Previous add-ons */}
          {previousAddOns.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
              <span style={{ ...T.ui, fontSize: 11, color: B.textMuted, fontWeight: 400, marginRight: 4 }}>Add-ons:</span>
              {previousAddOns.map((id) => {
                const ao = addOnDefs.find((a) => a.id === id);
                return ao ? (
                  <span key={id} style={{ ...T.ui, fontSize: 10, color: B.cyan, background: `${B.cyan}10`, padding: "3px 8px", borderRadius: 6, fontWeight: 600 }}>
                    {ao.name} +${Math.round(ao.price / 100)}
                  </span>
                ) : null;
              })}
            </div>
          )}

          {/* Appointment time (IV) or Shipping (shipped) */}
          {isShipped ? (
            <div style={{ background: B.bg, border: `1px solid ${B.border}`, borderRadius: 12, padding: "14px 16px", marginBottom: 16, display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 16 }}>🚚</span>
              <div>
                <div style={{ ...T.ui, fontSize: 13, fontWeight: 600, color: B.textPrimary }}>Ships in 1–2 business days</div>
                <div style={{ ...T.ui, fontSize: 11, color: B.textMuted, fontWeight: 400 }}>Priority mail · Tracking included</div>
              </div>
            </div>
          ) : (
            <div
              onClick={() => { setShowTimePicker(true); setActiveSection(null); }}
              style={{ background: B.bg, border: `1px solid ${B.border}`, borderRadius: 12, padding: "14px 16px", marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 16 }}>📅</span>
                <div>
                  <div style={{ ...T.ui, fontSize: 13, fontWeight: 600, color: B.textPrimary }}>{selectedDate} · {selectedTime}</div>
                  <div style={{ ...T.ui, fontSize: 11, color: B.cyan, fontWeight: 500, marginTop: 1 }}>Next available</div>
                </div>
              </div>
              <span style={{ ...T.ui, fontSize: 11, color: B.cyan, fontWeight: 600, flexShrink: 0 }}>Change</span>
            </div>
          )}

          {/* Address */}
          <div style={{ background: B.bg, border: `1px solid ${editingAddress ? B.cyan + "40" : B.border}`, borderRadius: 12, padding: "14px 16px", marginBottom: 16, transition: "all 0.2s" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 16 }}>📍</span>
                <div>
                  <div style={{ ...T.ui, fontSize: 13, fontWeight: 600, color: B.textPrimary }}>{selectedAddress.label} · {selectedAddress.street}</div>
                  <div style={{ ...T.ui, fontSize: 11, color: B.textMuted, fontWeight: 400 }}>{selectedAddress.city}</div>
                </div>
              </div>
              <span onClick={() => toggleSection("address")} style={{ ...T.ui, fontSize: 11, color: B.cyan, fontWeight: 600, cursor: "pointer", flexShrink: 0 }}>{editingAddress ? "Done" : "Edit"}</span>
            </div>
            {editingAddress && (
              <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${B.borderLight}`, display: "flex", flexDirection: "column", gap: 8 }}>
                {SAVED_ADDRESSES.map((addr, i) => {
                  const active = selectedAddress.full === addr.full;
                  return (
                    <div
                      key={i}
                      onClick={() => { setSelectedAddress(addr); setActiveSection(null); setAddingNewAddress(false); }}
                      style={{
                        display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, cursor: "pointer",
                        background: active ? `${B.cyan}10` : "transparent",
                        border: `1px solid ${active ? B.cyan : B.borderLight}`,
                      }}
                    >
                      <div style={{ width: 18, height: 18, borderRadius: "50%", border: `2px solid ${active ? B.cyan : B.border}`, background: active ? B.cyan : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        {active && <span style={{ color: B.bg, fontSize: 10, lineHeight: 1 }}>✓</span>}
                      </div>
                      <div>
                        <div style={{ ...T.ui, fontSize: 12, fontWeight: 600, color: B.textPrimary }}>{addr.label} · {addr.street}</div>
                        <div style={{ ...T.ui, fontSize: 10, color: B.textMuted, fontWeight: 400 }}>{addr.city}</div>
                      </div>
                    </div>
                  );
                })}

                {/* Add new address */}
                {!addingNewAddress ? (
                  <div
                    onClick={() => setAddingNewAddress(true)}
                    style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", cursor: "pointer" }}
                  >
                    <span style={{ fontSize: 14, color: B.cyan }}>＋</span>
                    <span style={{ ...T.ui, fontSize: 12, color: B.cyan, fontWeight: 600 }}>Add new address</span>
                  </div>
                ) : (
                  <div style={{ padding: "10px 12px", borderRadius: 10, border: `1px solid ${B.cyan}30`, background: `${B.cyan}06` }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      <input
                        value={newStreet}
                        onChange={(e) => setNewStreet(e.target.value)}
                        placeholder="Street address"
                        style={{ width: "100%", padding: "10px 12px", background: B.bgCard, border: `1px solid ${B.border}`, borderRadius: 10, color: B.textPrimary, fontSize: 13, fontFamily: SANS, outline: "none", boxSizing: "border-box" as const }}
                      />
                      <input
                        value={newCity}
                        onChange={(e) => setNewCity(e.target.value)}
                        placeholder="City, State"
                        style={{ width: "100%", padding: "10px 12px", background: B.bgCard, border: `1px solid ${B.border}`, borderRadius: 10, color: B.textPrimary, fontSize: 13, fontFamily: SANS, outline: "none", boxSizing: "border-box" as const }}
                      />
                      <div style={{ display: "flex", gap: 8 }}>
                        <div
                          onClick={() => setAddingNewAddress(false)}
                          style={{ ...T.ui, fontSize: 12, color: B.textMuted, fontWeight: 600, padding: "8px 16px", cursor: "pointer" }}
                        >
                          Cancel
                        </div>
                        <div
                          onClick={() => {
                            if (newStreet && newCity) {
                              const addr = { label: "New", street: newStreet, city: newCity, full: `${newStreet}, ${newCity}` };
                              setSelectedAddress(addr);
                              setAddingNewAddress(false);
                              setActiveSection(null);
                              setNewStreet("");
                              setNewCity("");
                            }
                          }}
                          style={{
                            ...T.ui, fontSize: 12, fontWeight: 700, padding: "8px 16px", borderRadius: 8, cursor: "pointer",
                            background: newStreet && newCity ? B.cyan : B.border,
                            color: newStreet && newCity ? B.bg : B.textMuted,
                          }}
                        >
                          Use this address
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Payment */}
          <div style={{ background: B.bg, border: `1px solid ${editingPayment ? B.cyan + "40" : B.border}`, borderRadius: 12, padding: "14px 16px", marginBottom: 24, transition: "all 0.2s" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 16 }}>{selectedPayment.icon}</span>
                <div>
                  <div style={{ ...T.ui, fontSize: 13, fontWeight: 600, color: B.textPrimary }}>{selectedPayment.brand} •••• {selectedPayment.last4}</div>
                  <div style={{ ...T.ui, fontSize: 11, color: B.textMuted, fontWeight: 400 }}>Default payment method</div>
                </div>
              </div>
              <span onClick={() => toggleSection("payment")} style={{ ...T.ui, fontSize: 11, color: B.cyan, fontWeight: 600, cursor: "pointer", flexShrink: 0 }}>{editingPayment ? "Done" : "Change"}</span>
            </div>
            {editingPayment && (
              <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${B.borderLight}`, display: "flex", flexDirection: "column", gap: 8 }}>
                {SAVED_PAYMENTS.map((pm, i) => {
                  const active = selectedPayment.last4 === pm.last4;
                  return (
                    <div
                      key={i}
                      onClick={() => { setSelectedPayment(pm); setActiveSection(null); }}
                      style={{
                        display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, cursor: "pointer",
                        background: active ? `${B.cyan}10` : "transparent",
                        border: `1px solid ${active ? B.cyan : B.borderLight}`,
                      }}
                    >
                      <div style={{ width: 18, height: 18, borderRadius: "50%", border: `2px solid ${active ? B.cyan : B.border}`, background: active ? B.cyan : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        {active && <span style={{ color: B.bg, fontSize: 10, lineHeight: 1 }}>✓</span>}
                      </div>
                      <div>
                        <div style={{ ...T.ui, fontSize: 12, fontWeight: 600, color: B.textPrimary }}>{pm.icon} {pm.brand} •••• {pm.last4}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* CTA */}
          <Btn
            fullWidth
            style={{
              padding: "16px 0",
              fontSize: 14,
              opacity: processing ? 0.7 : 1,
              pointerEvents: processing ? "none" : "auto",
            }}
            onClick={handleConfirm}
          >
            {processing
              ? "BOOKING..."
              : `CONFIRM BOOKING — $${total}`
            }
          </Btn>

          <div style={{ ...T.body, fontSize: 11, color: B.textMuted, textAlign: "center", marginTop: 10 }}>
            {isShipped ? "Free returns within 30 days" : "Free cancellation up to 2 hours before"}
          </div>
        </div>
      </div>

      {/* Full-screen time picker */}
      {showTimePicker && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{ position: "absolute", inset: 0, background: B.bg, zIndex: 410, display: "flex", flexDirection: "column", fontFamily: SANS }}
        >
          {/* Header */}
          <div style={{ padding: "16px 20px 12px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${B.border}`, flexShrink: 0 }}>
            <button
              onClick={() => setShowTimePicker(false)}
              style={{ background: "none", border: "none", color: B.cyan, fontSize: 14, cursor: "pointer", fontFamily: SANS, ...T.ui, padding: 0 }}
            >
              ← Back
            </button>
            <div style={{ ...T.product, fontSize: 16, color: B.textPrimary }}>Choose a Time</div>
            <span style={{ width: 40 }} />
          </div>

          {/* Scrollable body */}
          <div style={{ flex: 1, overflowY: "auto", padding: "20px 20px" }}>
            {/* Date selection */}
            <div style={{ ...T.over, fontSize: 9, color: B.textMuted, marginBottom: 10 }}>DATE</div>
            <div style={{ display: "flex", gap: 8, overflowX: "auto", marginBottom: 24, paddingBottom: 4 }}>
              {ALL_DATES.map((d) => (
                <button
                  key={d}
                  onClick={() => setSelectedDate(d)}
                  style={{
                    padding: "12px 16px", borderRadius: 12, flexShrink: 0, cursor: "pointer",
                    border: `1px solid ${selectedDate === d ? B.cyan : B.border}`,
                    background: selectedDate === d ? `${B.cyan}15` : B.bgCard,
                    color: selectedDate === d ? B.cyan : B.textSecondary,
                    fontSize: 13, fontFamily: SANS, fontWeight: 600, whiteSpace: "nowrap" as const,
                  }}
                >
                  {d}
                </button>
              ))}
            </div>

            {/* Time grid */}
            <div style={{ ...T.over, fontSize: 9, color: B.textMuted, marginBottom: 10 }}>TIME</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {ALL_TIMES.map((time) => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  style={{
                    padding: "14px", borderRadius: 12, cursor: "pointer",
                    border: `1px solid ${selectedTime === time ? B.cyan : B.border}`,
                    background: selectedTime === time ? `${B.cyan}15` : B.bgCard,
                    color: selectedTime === time ? B.cyan : B.textSecondary,
                    fontSize: 14, fontFamily: SANS, fontWeight: 600,
                  }}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          {/* Confirm selection */}
          <div style={{ padding: "12px 20px 28px", borderTop: `1px solid ${B.border}`, flexShrink: 0 }}>
            <Btn fullWidth style={{ padding: "15px 0", fontSize: 13 }} onClick={() => setShowTimePicker(false)}>
              CONFIRM — {selectedDate} · {selectedTime}
            </Btn>
          </div>
        </div>
      )}
    </div>
  );
}
