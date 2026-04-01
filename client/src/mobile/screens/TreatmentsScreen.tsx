import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { B, T, SANS } from "../theme";
import { Stars } from "../components/Stars";
import { Btn } from "../components/Btn";
import { bestForMap, reviewMap, memberPriceMap, shippedToYouSlugs } from "@/lib/treatment-data";
import type { Treatment } from "@shared/schema";
import type { NavProps } from "../MobileApp";

const CATEGORIES = ["All", "IV Therapy", "Shipped", "Specialty"];

const specialtySlugs = new Set(["iron-iv", "ketamine-iv", "exosome-iv"]);

function getTxCategory(t: Treatment): string {
  if (specialtySlugs.has(t.slug)) return "Specialty";
  if (shippedToYouSlugs.has(t.slug)) return "Shipped";
  return "IV Therapy";
}

function isPopular(slug: string) {
  return ["myers-cocktail-plus", "nad-iv-therapy", "hangover-iv", "recovery-performance"].includes(slug);
}

export function TreatmentsScreen({ navigate, openBooking }: NavProps) {
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
      </div>


      {/* Category pills */}
      <div style={{ display: "flex", gap: 8, padding: "0 20px 18px", overflowX: "auto" }}>
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

      {/* Treatment list */}
      <div style={{ padding: "0 20px 12px", display: "flex", flexDirection: "column", gap: 12 }}>
        {filtered.length === 0 && (
          <div style={{ ...T.body, fontSize: 14, color: B.textMuted, textAlign: "center", padding: "40px 0" }}>
            No treatments found. Try a different search.
          </div>
        )}
        {filtered.map((t) => {
          const shipped = shippedToYouSlugs.has(t.slug);
          const popular = isPopular(t.slug);
          const price = Math.round(t.price / 100);
          const mp = memberPriceMap[t.slug] ? Math.round(memberPriceMap[t.slug] / 100) : null;
          const rv = reviewMap[t.slug];

          return (
            <div
              key={t.id}
              onClick={() => navigate({ type: "treatment-detail", slug: t.slug })}
              style={{ background: B.bgCard, border: `1px solid ${B.border}`, borderRadius: 14, padding: 16, display: "flex", gap: 14, position: "relative", cursor: "pointer" }}
            >
              {shipped && (
                <div style={{ position: "absolute", top: 10, right: 10, ...T.tag, fontSize: 8, color: B.gold, background: `${B.gold}15`, padding: "3px 8px", borderRadius: 6, border: `1px solid ${B.gold}25` }}>
                  📦 SHIPPED
                </div>
              )}
              {popular && !shipped && (
                <div style={{ position: "absolute", top: 10, right: 10, ...T.tag, fontSize: 8, color: B.cyan, background: `${B.cyan}15`, padding: "3px 8px", borderRadius: 6, border: `1px solid ${B.cyan}25` }}>
                  MOST POPULAR
                </div>
              )}
              <div style={{ flex: 1 }}>
                <span style={{ display: "inline-block", ...T.tag, fontSize: 9, color: B.cyan, background: `${B.cyan}10`, padding: "3px 10px", borderRadius: 6, marginBottom: 8, border: `1px solid ${B.cyan}18` }}>
                  {bestForMap[t.slug]?.label.replace("Best for: ", "BEST FOR: ") ?? `BEST FOR: ${t.name.toUpperCase()}`}
                </span>
                <div style={{ ...T.product, fontSize: 16, color: B.textPrimary, marginBottom: 6 }}>{t.name}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 10 }}>
                  <Stars rating={Math.round(rv?.rating ?? 4.9)} size={10} />
                  <span style={{ ...T.ui, fontSize: 11, color: B.textMuted, fontWeight: 400 }}>
                    {rv?.rating ?? "4.9"} ({(rv?.count ?? 1200).toLocaleString()})
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                  <span style={{ ...T.price, fontSize: 20, color: B.textPrimary }}>${price}</span>
                  {mp && <span style={{ ...T.ui, fontSize: 12, fontWeight: 600, color: B.cyan }}>${mp} with {shipped ? "monthly subscription" : "membership"}</span>}
                  {shipped && !mp && <span style={{ ...T.ui, fontSize: 12, color: B.textMuted, fontWeight: 400 }}>/month</span>}
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end", flexShrink: 0 }}>
                <Btn
                  style={{ padding: "11px 22px", fontSize: 12 }}
                  onClick={(e) => { e.stopPropagation(); openBooking(t.slug); }}
                >
                  BOOK NOW
                </Btn>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
