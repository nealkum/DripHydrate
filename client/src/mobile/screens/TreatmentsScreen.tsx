import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { B, T, SANS } from "../theme";
import { Stars } from "../components/Stars";
import { bestForMap, reviewMap, memberPriceMap, shippedToYouSlugs } from "@/lib/treatment-data";
import type { Treatment } from "@shared/schema";
import type { NavProps } from "../MobileApp";

const CATEGORIES = ["All", "In-Home IVs", "Shipped to You", "Specialty"];

const specialtySlugs = new Set(["iron-iv", "ketamine-iv", "exosome-iv"]);

// Short one-liners so users can compare without tapping into each treatment
const shortDescriptions: Record<string, string> = {
  "myers-cocktail-plus": "Full-spectrum vitamin infusion for energy & immunity",
  "hangover-iv":         "Fast relief from nausea, headache & dehydration",
  "recovery-performance":"Replenish electrolytes & reduce muscle soreness",
  "nad-iv-therapy":      "500mg NAD+ for cellular repair & anti-aging",
  "nad-boost":           "NAD+ with vitamins for peak mental clarity",
  "energy-boost":        "B-vitamins & vitamin C to fight fatigue",
  "immunity-boost":      "High-dose vitamin C & zinc for immune defense",
  "beauty-drip":         "Biotin & glutathione for skin, hair & nails",
  "hydration-package":   "Pure IV fluids & electrolytes for fast rehydration",
  "migraine-relief":     "Magnesium & anti-nausea meds for headache relief",
  "iron-iv":             "Medical-grade iron infusion for anemia",
  "ketamine-iv":         "Supervised ketamine therapy for mood disorders",
  "exosome-iv":          "Regenerative exosome therapy for tissue repair",
  "weight-loss-semaglutide": "Weekly GLP-1 injections for weight management",
  "weight-loss-tirzepatide": "Dual-action GLP-1/GIP for weight loss",
  "testosterone-trt":    "Testosterone replacement therapy",
  "testosterone-enclomiphene":"Natural testosterone optimization",
  "peptide-sermorelin":  "Growth hormone peptide for anti-aging",
  "peptide-cjc-ipamorelin":"Dual peptide for recovery & body composition",
  "peptide-ghk-cu":      "Copper peptide for skin healing & collagen",
  "nad-injections":      "At-home NAD+ injections for longevity",
  "nad-nasal-spray":     "Daily NAD+ nasal spray for mental clarity",
  "niagen-nr-injections":"Nicotinamide riboside for cellular energy",
  "vitamin-b12":         "Methylcobalamin shots for energy & focus",
  "vitamin-lipostat":    "Lipotropic injections for fat metabolism",
  "ketamine-therapy":    "At-home ketamine for depression & anxiety",
};

function getTxCategory(t: Treatment): string {
  if (specialtySlugs.has(t.slug)) return "Specialty";
  if (shippedToYouSlugs.has(t.slug)) return "Shipped to You";
  return "In-Home IVs";
}

function isPopular(slug: string) {
  return ["myers-cocktail-plus", "nad-iv-therapy", "hangover-iv", "recovery-performance"].includes(slug);
}

export function TreatmentsScreen({ navigate }: NavProps) {
  const [activeCategory, setActiveCategory] = useState("All");

  const { data: treatments = [] } = useQuery<Treatment[]>({
    queryKey: ["/api/treatments"],
  });

  const filtered = treatments.filter((t) => {
    const cat = getTxCategory(t);
    return activeCategory === "All" || cat === activeCategory;
  });

  return (
    <div style={{ fontFamily: SANS }}>
      <div style={{ padding: "16px 20px 10px" }}>
        <div style={{ ...T.hero, fontSize: 28, color: B.textPrimary }}>Treatments</div>
        <div style={{ ...T.body, fontSize: 13, color: B.textMuted, marginTop: 4 }}>Browse by category</div>
      </div>

      {/* Category pills */}
      <div style={{ display: "flex", gap: 8, padding: "0 20px 14px", overflowX: "auto" }}>
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setActiveCategory(c)}
            style={{
              ...T.btn,
              padding: "9px 20px",
              borderRadius: 24,
              border: activeCategory === c ? "none" : `1px solid ${B.border}`,
              background: activeCategory === c ? `linear-gradient(135deg, ${B.tealAccent}, ${B.cyan})` : "transparent",
              color: activeCategory === c ? "#fff" : B.textSecondary,
              fontSize: 12,
              cursor: "pointer",
              whiteSpace: "nowrap",
              fontFamily: SANS,
            }}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Help me choose */}
      <div style={{ padding: "0 20px 14px" }}>
        <div
          style={{ background: `linear-gradient(135deg, ${B.bgCard}, ${B.tealLight})`, border: `1px solid ${B.cyan}20`, borderRadius: 12, padding: "12px 16px", display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}
        >
          <span style={{ fontSize: 20 }}>🩺</span>
          <div style={{ flex: 1 }}>
            <div style={{ ...T.ui, fontSize: 13, fontWeight: 700, color: B.textPrimary }}>Not sure which treatment?</div>
            <div style={{ ...T.body, fontSize: 12, color: B.textMuted }}>Take a 30-second quiz to find your match</div>
          </div>
          <svg width="7" height="12" viewBox="0 0 7 12" fill="none">
            <path d="M1 1L6 6L1 11" stroke={B.cyan} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      {/* Treatment list — grouped by popularity */}
      <div style={{ padding: "0 20px 12px" }}>
        {filtered.length === 0 && (
          <div style={{ ...T.body, fontSize: 14, color: B.textMuted, textAlign: "center", padding: "40px 0" }}>
            No treatments found. Try a different category.
          </div>
        )}
        {(() => {
          const popular = filtered.filter((t) => isPopular(t.slug));
          const rest = filtered.filter((t) => !isPopular(t.slug));

          function renderCard(t: Treatment) {
            const shipped = shippedToYouSlugs.has(t.slug);
            const pop = isPopular(t.slug);
            const price = Math.round(t.price / 100);
            const mp = memberPriceMap[t.slug] ? Math.round(memberPriceMap[t.slug] / 100) : null;
            const rv = reviewMap[t.slug];
            const desc = shortDescriptions[t.slug];

            return (
              <div
                key={t.id}
                onClick={() => navigate({ type: "treatment-detail", slug: t.slug })}
                style={{ background: B.bgCard, border: `1px solid ${B.border}`, borderRadius: 12, padding: "12px 14px", cursor: "pointer", position: "relative" }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                      <span style={{ ...T.product, fontSize: 15, color: B.textPrimary }}>{t.name}</span>
                      {pop && !shipped && (
                        <span style={{ ...T.tag, fontSize: 8, color: B.cyan, background: `${B.cyan}15`, padding: "2px 7px", borderRadius: 4, border: `1px solid ${B.cyan}25`, flexShrink: 0 }}>
                          POPULAR
                        </span>
                      )}
                      {shipped && (
                        <span style={{ ...T.tag, fontSize: 8, color: B.gold, background: `${B.gold}15`, padding: "2px 7px", borderRadius: 4, border: `1px solid ${B.gold}25`, flexShrink: 0 }}>
                          📦 SHIPPED
                        </span>
                      )}
                    </div>
                    {desc && (
                      <div style={{ ...T.body, fontSize: 12, color: B.textMuted, lineHeight: 1.3, marginBottom: 6 }}>{desc}</div>
                    )}
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <Stars rating={Math.round(rv?.rating ?? 4.9)} size={9} />
                      <span style={{ ...T.ui, fontSize: 11, color: B.textMuted, fontWeight: 400 }}>
                        {rv?.rating ?? "4.9"} ({(rv?.count ?? 1200).toLocaleString()})
                      </span>
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", flexShrink: 0, paddingTop: 2 }}>
                    <span style={{ ...T.price, fontSize: 18, color: B.textPrimary }}>${price}</span>
                    {mp && <span style={{ ...T.ui, fontSize: 11, fontWeight: 600, color: B.cyan }}>${mp} member</span>}
                    {shipped && !mp && <span style={{ ...T.ui, fontSize: 11, color: B.textMuted, fontWeight: 400 }}>/month</span>}
                  </div>
                </div>
                <svg width="7" height="12" viewBox="0 0 7 12" fill="none" style={{ position: "absolute", right: 6, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
                  <path d="M1 1L6 6L1 11" stroke={B.textMuted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.3"/>
                </svg>
              </div>
            );
          }

          return (
            <>
              {popular.length > 0 && (
                <>
                  <div style={{ ...T.over, fontSize: 10, color: B.textMuted, marginBottom: 8 }}>Most Popular</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: rest.length > 0 ? 20 : 0 }}>
                    {popular.map(renderCard)}
                  </div>
                </>
              )}
              {rest.length > 0 && (
                <>
                  <div style={{ ...T.over, fontSize: 10, color: B.textMuted, marginBottom: 8 }}>
                    {popular.length > 0 ? "More Treatments" : "Treatments"}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {rest.map(renderCard)}
                  </div>
                </>
              )}
            </>
          );
        })()}
      </div>
    </div>
  );
}
