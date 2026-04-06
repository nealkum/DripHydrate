import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Treatment } from "@shared/schema";
import { B, T, SANS } from "../theme";
import { Btn } from "../components/Btn";
import { Stars } from "../components/Stars";
import type { NavProps } from "../MobileApp";
import { reviewMap, shippedToYouSlugs } from "@/lib/treatment-data";
import treatmentHero from "@/assets/brand/photos/treatment-hero.jpeg";
import treatmentSmile from "@/assets/brand/photos/treatment-smile.jpeg";
import robeCoffee from "@/assets/brand/photos/robe-coffee.jpeg";
import membershipRobe from "@/assets/brand/photos/membership-robe.jpeg";
import heroCouch from "@/assets/brand/photos/hero-couch.jpeg";

type Weights = Record<string, number>;
type Option = { label: string; emoji: string; weights: Weights };
type Question = { key: string; title: string; subtitle?: string; options: Option[] };

const QUESTIONS: Question[] = [
  {
    key: "goal",
    title: "What's your main goal?",
    subtitle: "Pick whatever feels closest",
    options: [
      { label: "More energy & focus",     emoji: "⚡", weights: { "energy-boost": 3, "nad-iv-therapy": 2, "vitamin-b12": 2, "myers-cocktail-plus": 1 } },
      { label: "Recover faster",          emoji: "💪", weights: { "recovery-performance": 3, "myers-cocktail-plus": 2, "hydration-package": 1 } },
      { label: "Immunity & stay healthy", emoji: "🛡️", weights: { "immunity-boost": 3, "myers-cocktail-plus": 2 } },
      { label: "Glow up — skin & hair",   emoji: "✨", weights: { "beauty-drip": 3, "peptide-ghk-cu": 2 } },
      { label: "Hangover relief",         emoji: "🤕", weights: { "hangover-iv": 4, "hydration-package": 2, "migraine-relief": 1 } },
      { label: "Anti-aging & longevity",  emoji: "🧬", weights: { "nad-iv-therapy": 3, "nad-boost": 3, "peptide-sermorelin": 2 } },
      { label: "Weight management",       emoji: "⚖️", weights: { "weight-loss-semaglutide": 3, "weight-loss-tirzepatide": 3, "vitamin-lipostat": 1 } },
      { label: "Mood & mental health",    emoji: "🧠", weights: { "ketamine-therapy": 3, "ketamine-iv": 2 } },
    ],
  },
  {
    key: "delivery",
    title: "How do you want it?",
    options: [
      { label: "In-home IV visit",          emoji: "🏠", weights: { "energy-boost": 1, "myers-cocktail-plus": 1, "hangover-iv": 1, "recovery-performance": 1, "immunity-boost": 1, "beauty-drip": 1, "nad-iv-therapy": 1, "nad-boost": 1, "hydration-package": 1, "migraine-relief": 1, "iron-iv": 2, "ketamine-iv": 2 } },
      { label: "Shipped to my door",        emoji: "📦", weights: { "weight-loss-semaglutide": 2, "weight-loss-tirzepatide": 2, "peptide-sermorelin": 2, "peptide-ghk-cu": 2, "nad-injections": 2, "nad-nasal-spray": 2, "vitamin-b12": 2, "vitamin-lipostat": 2, "ketamine-therapy": 2, "testosterone-trt": 2 } },
      { label: "No preference",             emoji: "🤷", weights: {} },
    ],
  },
  {
    key: "frequency",
    title: "How often do you want it?",
    options: [
      { label: "One-time pick-me-up",  emoji: "1️⃣", weights: { "hangover-iv": 2, "hydration-package": 2, "migraine-relief": 2, "myers-cocktail-plus": 1, "beauty-drip": 1 } },
      { label: "Monthly tune-up",      emoji: "🔁", weights: { "myers-cocktail-plus": 2, "energy-boost": 2, "immunity-boost": 2, "nad-boost": 1, "iron-iv": 1 } },
      { label: "Ongoing protocol",     emoji: "📈", weights: { "nad-iv-therapy": 2, "nad-boost": 2, "weight-loss-semaglutide": 2, "weight-loss-tirzepatide": 2, "peptide-sermorelin": 2, "testosterone-trt": 2, "ketamine-therapy": 2 } },
    ],
  },
  {
    key: "speed",
    title: "How fast do you need results?",
    options: [
      { label: "Right now — under an hour",   emoji: "⚡", weights: { "hangover-iv": 3, "migraine-relief": 3, "hydration-package": 2, "energy-boost": 2 } },
      { label: "This week",                    emoji: "📅", weights: { "myers-cocktail-plus": 2, "immunity-boost": 2, "beauty-drip": 2, "recovery-performance": 2 } },
      { label: "Long-term wellness",           emoji: "🌱", weights: { "nad-iv-therapy": 2, "nad-boost": 2, "weight-loss-semaglutide": 2, "peptide-sermorelin": 2, "testosterone-trt": 2 } },
    ],
  },
];

const heroMap: Record<string, string> = {
  "nad-iv-therapy": robeCoffee,
  "nad-boost": robeCoffee,
  "myers-cocktail-plus": treatmentSmile,
  "hangover-iv": treatmentHero,
  "recovery-performance": heroCouch,
  "immunity-boost": treatmentSmile,
  "beauty-drip": membershipRobe,
  "energy-boost": treatmentHero,
};

export function TreatmentQuizScreen({ goBack, navigate, openBooking }: NavProps) {
  const { data: treatments = [] } = useQuery<Treatment[]>({ queryKey: ["/api/treatments"] });
  const [step, setStep] = useState(0);
  const [picks, setPicks] = useState<Record<string, number>>({}); // questionKey -> optionIdx

  const isResults = step >= QUESTIONS.length;

  const recommendedSlug = useMemo(() => {
    if (!isResults) return null;
    const totals: Record<string, number> = {};
    for (const q of QUESTIONS) {
      const idx = picks[q.key];
      if (idx == null) continue;
      const opt = q.options[idx];
      for (const [slug, w] of Object.entries(opt.weights)) {
        totals[slug] = (totals[slug] ?? 0) + w;
      }
    }
    const ranked = Object.entries(totals).sort((a, b) => b[1] - a[1]);
    return ranked[0]?.[0] ?? "myers-cocktail-plus";
  }, [isResults, picks]);

  const treatment = treatments.find((t) => t.slug === recommendedSlug);
  const isShipped = recommendedSlug ? shippedToYouSlugs.has(recommendedSlug) : false;
  const reviews = recommendedSlug ? reviewMap[recommendedSlug] : null;

  function pick(qKey: string, idx: number) {
    setPicks((prev) => ({ ...prev, [qKey]: idx }));
    // auto-advance
    setTimeout(() => setStep((s) => s + 1), 180);
  }

  function reset() {
    setPicks({});
    setStep(0);
  }

  const progress = isResults ? 1 : step / QUESTIONS.length;

  return (
    <div style={{ position: "absolute", inset: 0, background: B.bg, zIndex: 150, display: "flex", flexDirection: "column", fontFamily: SANS }}>
      {/* Header */}
      <div style={{ padding: "16px 20px 12px", display: "flex", alignItems: "center", gap: 12, borderBottom: `1px solid ${B.border}`, flexShrink: 0, background: B.bg }}>
        <button onClick={goBack} style={{ background: "none", border: "none", color: B.cyan, fontSize: 14, cursor: "pointer", fontFamily: SANS, ...T.ui, padding: 0 }}>
          ← Back
        </button>
        <div style={{ flex: 1, ...T.ui, fontSize: 13, fontWeight: 700, color: B.textPrimary, textAlign: "center" }}>
          {isResults ? "Your Match" : `Question ${step + 1} of ${QUESTIONS.length}`}
        </div>
        <div style={{ width: 40 }} />
      </div>

      {/* Progress */}
      <div style={{ height: 4, background: B.borderLight, flexShrink: 0 }}>
        <div style={{ height: "100%", width: `${progress * 100}%`, background: `linear-gradient(90deg, ${B.tealAccent}, ${B.cyan})`, transition: "width 0.3s ease" }} />
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflowY: "auto", padding: "24px 20px 32px" }}>
        {!isResults && (() => {
          const q = QUESTIONS[step];
          const selectedIdx = picks[q.key];
          return (
            <div>
              <div style={{ ...T.hero, fontSize: 24, color: B.textPrimary, marginBottom: 6 }}>{q.title}</div>
              {q.subtitle && (
                <div style={{ ...T.body, fontSize: 13, color: B.textMuted, marginBottom: 20 }}>{q.subtitle}</div>
              )}
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 8 }}>
                {q.options.map((opt, idx) => {
                  const active = selectedIdx === idx;
                  return (
                    <div
                      key={idx}
                      onClick={() => pick(q.key, idx)}
                      style={{
                        background: active ? `${B.cyan}10` : B.bgCard,
                        border: `1px solid ${active ? B.cyan : B.border}`,
                        borderRadius: 14,
                        padding: "16px 16px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 14,
                        transition: "all 0.15s",
                      }}
                    >
                      <div style={{
                        width: 40, height: 40, borderRadius: 12,
                        background: active ? `${B.cyan}18` : `rgba(18,36,63,0.05)`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 20, flexShrink: 0,
                      }}>{opt.emoji}</div>
                      <div style={{ flex: 1, ...T.ui, fontSize: 14, fontWeight: 600, color: B.textPrimary }}>
                        {opt.label}
                      </div>
                      <div style={{
                        width: 22, height: 22, borderRadius: "50%",
                        border: `2px solid ${active ? B.cyan : B.border}`,
                        background: active ? B.cyan : "transparent",
                        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                      }}>
                        {active && <span style={{ color: "#fff", fontSize: 12, lineHeight: 1 }}>✓</span>}
                      </div>
                    </div>
                  );
                })}
              </div>

              {step > 0 && (
                <div
                  onClick={() => setStep((s) => Math.max(0, s - 1))}
                  style={{ ...T.ui, fontSize: 12, color: B.textMuted, fontWeight: 600, textAlign: "center", marginTop: 20, cursor: "pointer" }}
                >
                  ← Previous question
                </div>
              )}
            </div>
          );
        })()}

        {isResults && treatment && (
          <div>
            <div style={{ ...T.over, fontSize: 10, color: B.cyan, marginBottom: 8, textAlign: "center", letterSpacing: "0.12em" }}>
              ✨ YOUR PERFECT MATCH
            </div>
            <div style={{ ...T.hero, fontSize: 26, color: B.textPrimary, textAlign: "center", marginBottom: 18 }}>
              {treatment.name}
            </div>

            {/* Hero card */}
            <div style={{
              borderRadius: 18,
              overflow: "hidden",
              border: `1px solid ${B.border}`,
              marginBottom: 18,
              backgroundImage: `linear-gradient(180deg, rgba(10,23,40,0.05) 0%, rgba(10,23,40,0.7) 60%, rgba(10,23,40,0.95) 100%), url(${heroMap[recommendedSlug!] ?? treatmentHero})`,
              backgroundSize: "cover",
              backgroundPosition: "center 30%",
              minHeight: 220,
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              padding: 20,
            }}>
              <div style={{ ...T.body, fontSize: 13, color: "rgba(255,255,255,0.9)", marginBottom: 10 }}>
                {treatment.description}
              </div>
              {reviews && (
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                  <Stars rating={Math.round(reviews.rating)} size={13} />
                  <span style={{ ...T.ui, fontSize: 12, color: "rgba(255,255,255,0.8)", fontWeight: 400 }}>
                    {reviews.rating} ({reviews.count.toLocaleString()})
                  </span>
                </div>
              )}
              <div style={{ ...T.price, fontSize: 28, color: "#fff" }}>
                ${Math.round(treatment.price / 100)}{isShipped && <span style={{ fontSize: 14, fontWeight: 400, color: "rgba(255,255,255,0.72)" }}> /mo</span>}
              </div>
            </div>

            {/* CTAs */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <Btn fullWidth style={{ padding: "15px 0", fontSize: 13 }} onClick={() => openBooking(recommendedSlug!)}>
                {isShipped ? "ORDER NOW" : "BOOK NOW"}
              </Btn>
              <Btn variant="ghost" fullWidth style={{ padding: "13px 0", fontSize: 12 }} onClick={() => navigate({ type: "treatment-detail", slug: recommendedSlug! })}>
                LEARN MORE
              </Btn>
              <div
                onClick={reset}
                style={{ ...T.ui, fontSize: 12, color: B.textMuted, fontWeight: 600, textAlign: "center", marginTop: 6, cursor: "pointer" }}
              >
                Retake quiz
              </div>
            </div>
          </div>
        )}

        {isResults && !treatment && (
          <div style={{ ...T.body, color: B.textMuted, textAlign: "center", padding: "40px 0" }}>Loading your match…</div>
        )}
      </div>
    </div>
  );
}
