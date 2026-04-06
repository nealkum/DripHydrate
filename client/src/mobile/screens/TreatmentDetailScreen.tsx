import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Treatment } from "@shared/schema";
import { B, T, SANS } from "../theme";
import { Stars } from "../components/Stars";
import { Btn } from "../components/Btn";
import type { NavProps } from "../MobileApp";
import {
  bestForMap,
  reviewMap,
  memberPriceMap,
  treatmentReviews,
  addOns,
  shippedToYouSlugs,
} from "@/lib/treatment-data";

interface TreatmentDetailScreenProps extends NavProps {
  slug: string;
}

// Per-treatment recommended add-ons (top 3 shown first)
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

// Social proof: "X% of [treatment] customers add this"
const addOnPopularity: Record<string, number> = {
  "glutathione": 73,
  "b12-booster": 68,
  "magnesium":   52,
  "zinc":        47,
  "biotin":      44,
  "vitamin-d":   41,
};

export function TreatmentDetailScreen({ slug, goBack, openBooking }: TreatmentDetailScreenProps) {
  const [selectedAddOns, setSelectedAddOns] = useState<Set<string>>(new Set());
  const [showAllAddOns, setShowAllAddOns] = useState(false);

  const { data: treatments = [] } = useQuery<Treatment[]>({ queryKey: ["/api/treatments"] });
  const treatment = treatments.find((t) => t.slug === slug);

  if (!treatment) {
    return (
      <div style={{ position: "absolute", inset: 0, background: B.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ ...T.body, color: B.textMuted }}>Loading…</div>
      </div>
    );
  }

  const basePrice = Math.round(treatment.price / 100);
  const memberPrice = memberPriceMap[slug] ? Math.round(memberPriceMap[slug] / 100) : Math.round(treatment.price * 0.75 / 100);
  const savings = basePrice - memberPrice;
  const reviews = reviewMap[slug];
  const bestFor = bestForMap[slug];
  const customerReviews = treatmentReviews[slug] ?? [];
  const isShipped = shippedToYouSlugs.has(slug);

  const relevantAddOns = isShipped ? [] : addOns;

  const addOnTotal = [...selectedAddOns].reduce((sum, id) => {
    const ao = addOns.find((a) => a.id === id);
    return sum + (ao ? Math.round(ao.price / 100) : 0);
  }, 0);

  function toggleAddOn(id: string) {
    setSelectedAddOns((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const totalPrice = basePrice + addOnTotal;

  const benefits: string[] = Array.isArray(treatment.benefits)
    ? (treatment.benefits as string[])
    : [];

  return (
    <div style={{ position: "absolute", inset: 0, background: B.bg, zIndex: 150, display: "flex", flexDirection: "column", fontFamily: SANS }}>
      {/* Header */}
      <div style={{ padding: "16px 20px 12px", display: "flex", alignItems: "center", gap: 12, borderBottom: `1px solid ${B.border}`, flexShrink: 0, background: B.bg }}>
        <button onClick={goBack} style={{ background: "none", border: "none", color: B.cyan, fontSize: 14, cursor: "pointer", fontFamily: SANS, ...T.ui, padding: 0 }}>
          ← Back
        </button>
        <div style={{ flex: 1 }} />
        {isShipped && (
          <span style={{ ...T.tag, fontSize: 9, color: B.gold, background: `${B.gold}15`, padding: "4px 10px", borderRadius: 8, border: `1px solid ${B.gold}25` }}>
            📦 SHIPPED
          </span>
        )}
      </div>

      {/* Scrollable body */}
      <div style={{ flex: 1, overflowY: "auto", paddingBottom: 90 }}>
        {/* Hero section */}
        <div style={{ padding: "24px 20px 20px", background: `linear-gradient(180deg, ${B.bgCard} 0%, ${B.bg} 100%)` }}>
          {bestFor && (
            <div style={{ display: "inline-block", ...T.tag, fontSize: 9, color: B.cyan, background: `${B.cyan}12`, padding: "4px 12px", borderRadius: 8, border: `1px solid ${B.cyan}25`, marginBottom: 12 }}>
              {bestFor.label.replace("Best for: ", "BEST FOR: ")}
            </div>
          )}
          <div style={{ ...T.hero, fontSize: 28, color: B.textPrimary, marginBottom: 10 }}>{treatment.name}</div>

          {reviews && (
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 16 }}>
              <Stars rating={Math.round(reviews.rating)} size={13} />
              <span style={{ ...T.ui, fontSize: 12, color: B.textMuted, fontWeight: 400 }}>
                {reviews.rating} ({reviews.count.toLocaleString()} reviews)
              </span>
            </div>
          )}

          <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 8 }}>
            <span style={{ ...T.price, fontSize: 32, color: B.textPrimary }}>${basePrice}</span>
            <div>
              <div style={{ ...T.ui, fontSize: 13, fontWeight: 700, color: B.cyan }}>${memberPrice} member price</div>
              <div style={{ ...T.ui, fontSize: 11, color: B.gold, fontWeight: 600 }}>Save ${savings} with {isShipped ? "monthly subscription" : "membership"}</div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {!isShipped && (
              <span style={{ ...T.tag, fontSize: 9, color: B.textMuted, background: `rgba(255,255,255,0.06)`, padding: "5px 10px", borderRadius: 8 }}>
                ⏱ {treatment.duration} min
              </span>
            )}
            <span style={{ ...T.tag, fontSize: 9, color: B.textMuted, background: `rgba(255,255,255,0.06)`, padding: "5px 10px", borderRadius: 8 }}>
              {isShipped ? "📦 Ships nationwide" : "🏠 In-home visit"}
            </span>
            {!isShipped && (
              <span style={{ ...T.tag, fontSize: 9, color: B.textMuted, background: `rgba(255,255,255,0.06)`, padding: "5px 10px", borderRadius: 8 }}>
                👩‍⚕️ Licensed nurse
              </span>
            )}
          </div>
        </div>


        {/* Benefits */}
        {benefits.length > 0 && (
          <div style={{ padding: "0 20px 24px" }}>
            <div style={{ ...T.over, fontSize: 10, color: B.textMuted, marginBottom: 12 }}>Benefits</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {benefits.map((b, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <span style={{ width: 20, height: 20, borderRadius: "50%", background: `${B.cyan}15`, border: `1px solid ${B.cyan}30`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                    <span style={{ color: B.cyan, fontSize: 10 }}>✓</span>
                  </span>
                  <span style={{ ...T.body, fontSize: 13, color: B.textSecondary }}>{b}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add-ons — recommendation-driven with social proof */}
        {relevantAddOns.length > 0 && (() => {
          const recIds = recommendedAddOns[slug] ?? defaultRecommended;
          const recommended = relevantAddOns.filter((ao) => recIds.includes(ao.id));
          const others = relevantAddOns.filter((ao) => !recIds.includes(ao.id));
          const visibleAddOns = showAllAddOns ? [...recommended, ...others] : recommended;

          return (
            <div style={{ padding: "0 20px 24px" }}>
              <div style={{ ...T.over, fontSize: 10, color: B.textMuted, marginBottom: 4 }}>Recommended Add-Ons</div>
              <div style={{ ...T.body, fontSize: 12, color: B.textMuted, marginBottom: 12 }}>Most popular with this treatment</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {visibleAddOns.map((ao, idx) => {
                  const selected = selectedAddOns.has(ao.id);
                  const popularity = addOnPopularity[ao.id];
                  const isTopPick = idx === 0 && !showAllAddOns;
                  return (
                    <div
                      key={ao.id}
                      onClick={() => toggleAddOn(ao.id)}
                      style={{
                        background: selected ? `${B.cyan}10` : B.bgCard,
                        border: `1px solid ${selected ? B.cyan : isTopPick ? B.cyan + "40" : B.border}`,
                        borderRadius: 12,
                        padding: "12px 14px",
                        cursor: "pointer",
                        position: "relative" as const,
                        overflow: "hidden",
                      }}
                    >
                      {isTopPick && (
                        <div style={{ position: "absolute", top: 0, right: 0, background: `linear-gradient(135deg, ${B.tealAccent}, ${B.cyan})`, padding: "3px 10px", borderRadius: "0 0 0 8px" }}>
                          <span style={{ ...T.tag, fontSize: 8, color: "#fff", fontWeight: 700 }}>MOST ADDED</span>
                        </div>
                      )}
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ width: 22, height: 22, borderRadius: "50%", border: `2px solid ${selected ? B.cyan : B.border}`, background: selected ? B.cyan : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.15s" }}>
                          {selected && <span style={{ color: B.bg, fontSize: 12, lineHeight: 1 }}>✓</span>}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ ...T.ui, fontSize: 13, fontWeight: 600, color: B.textPrimary }}>{ao.name}</div>
                          <div style={{ ...T.body, fontSize: 11, color: B.textMuted }}>{ao.description}</div>
                          {popularity && (
                            <div style={{ ...T.ui, fontSize: 10, color: B.cyan, fontWeight: 600, marginTop: 3 }}>
                              ⚡ {popularity}% of customers add this
                            </div>
                          )}
                        </div>
                        <div style={{ ...T.price, fontSize: 13, color: selected ? B.cyan : B.textSecondary }}>
                          +${Math.round(ao.price / 100)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              {!showAllAddOns && others.length > 0 && (
                <div
                  onClick={() => setShowAllAddOns(true)}
                  style={{ ...T.ui, fontSize: 12, color: B.cyan, fontWeight: 600, cursor: "pointer", textAlign: "center", marginTop: 12 }}
                >
                  See all {relevantAddOns.length} add-ons →
                </div>
              )}
            </div>
          );
        })()}


        {/* Membership upsell */}
        <div style={{ padding: "0 20px 24px" }}>
          <div style={{ background: `linear-gradient(135deg, ${B.bgCard}, ${B.tealLight})`, border: `1px solid ${B.gold}25`, borderRadius: 14, padding: 18 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <span style={{ fontSize: 18 }}>💎</span>
              <div style={{ ...T.product, fontSize: 15, color: B.textPrimary }}>Save ${savings} with a {isShipped ? "Monthly Subscription" : "Membership"}</div>
            </div>
            <div style={{ ...T.body, fontSize: 12, color: B.textSecondary, marginBottom: 14 }}>
              Members pay <span style={{ color: B.cyan, fontWeight: 700 }}>${memberPrice}</span> per session. Cancel anytime, HSA/FSA eligible.
            </div>
            <Btn variant="ghost" style={{ width: "100%", padding: "11px 0", fontSize: 12 }} onClick={() => navigate({ type: "membership" })}>
              VIEW MEMBERSHIP PLANS
            </Btn>
          </div>
        </div>

        {/* Customer reviews */}
        {customerReviews.length > 0 && (
          <div style={{ padding: "0 20px 24px" }}>
            <div style={{ ...T.over, fontSize: 10, color: B.textMuted, marginBottom: 12 }}>Customer Reviews</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {customerReviews.map((r, i) => (
                <div key={i} style={{ background: B.bgCard, border: `1px solid ${B.border}`, borderRadius: 12, padding: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                    <div>
                      <div style={{ ...T.ui, fontSize: 13, fontWeight: 700, color: B.textPrimary }}>{r.name}</div>
                      <div style={{ ...T.ui, fontSize: 11, color: B.textMuted, fontWeight: 400 }}>{r.city}</div>
                    </div>
                    <Stars rating={r.rating} size={11} />
                  </div>
                  <div style={{ ...T.body, fontSize: 13, color: B.textSecondary, lineHeight: 1.5 }}>"{r.text}"</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sticky CTA */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "12px 20px 20px", background: `rgba(15,43,43,0.97)`, backdropFilter: "blur(20px)", borderTop: `1px solid ${B.border}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <div>
            <div style={{ ...T.price, fontSize: 22, color: B.textPrimary }}>${totalPrice}</div>
            {addOnTotal > 0 && <div style={{ ...T.ui, fontSize: 11, color: B.textMuted }}>includes ${addOnTotal} in add-ons</div>}
          </div>
          <Btn style={{ padding: "14px 32px", fontSize: 13 }} onClick={() => openBooking(slug, [...selectedAddOns])}>
            {isShipped ? "ORDER" : "BOOK NOW"}
          </Btn>
        </div>
      </div>
    </div>
  );
}
