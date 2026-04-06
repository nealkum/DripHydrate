export const ingredientMap: Record<string, string[]> = {
  "myers-cocktail-plus": ["B-Complex", "B12", "Vitamin C", "Magnesium", "Glutathione", "Biotin", "Zinc"],
  "immunity-boost": ["B-Complex", "B12", "Vitamin C", "Glutathione"],
  "energy-boost": ["B-Complex", "B12", "Vitamin C"],
  "hydration-package": ["IV Fluids", "Electrolytes"],
  "beauty-drip": ["B-Complex", "B12", "Vitamin C", "Biotin", "Glutathione"],
  "hangover-iv": ["B-Complex", "B12", "Vitamin C", "Anti-Nausea", "Anti-Inflammatory"],
  "recovery-performance": ["B-Complex", "B12", "Vitamin C", "Magnesium", "Glutathione"],
  "migraine-relief": ["B12", "Magnesium", "Anti-Nausea", "Anti-Inflammatory", "Diphenhydramine"],
  "nad-iv-therapy": ["500mg NAD+"],
  "nad-boost": ["NAD+", "B-Complex", "B12", "Vitamin C", "Magnesium", "Glutathione Push"],
  // Shipped To You
  "nad-injections": ["NAD+"],
  "nad-nasal-spray": ["NAD+"],
  "niagen-nr-injections": ["Niagen® NR (Nicotinamide Riboside)"],
  "peptide-sermorelin": ["Sermorelin Acetate"],
  "peptide-cjc-ipamorelin": ["CJC-1295", "Ipamorelin"],
  "peptide-ghk-cu": ["GHK-Cu (Copper Peptide)"],
  "weight-loss-semaglutide": ["Semaglutide", "Glycine or Vitamin B12"],
  "weight-loss-tirzepatide": ["Tirzepatide", "Glycine or Niacinamide"],
  "testosterone-trt": ["Testosterone Cypionate"],
  "testosterone-enclomiphene": ["Enclomiphene Citrate"],
  "vitamin-b12": ["Methylcobalamin (B12)"],
  "vitamin-lipostat": ["Methionine", "Inositol", "Choline"],
  "ketamine-therapy": ["Ketamine HCl"],
  // Specialty IVs
  "iron-iv": ["Iron Sucrose (Venofer)", "Saline Solution"],
  "ketamine-iv": ["Ketamine HCl", "Saline Solution", "Midazolam (if needed)"],
  "exosome-iv": ["Exosomes", "Growth Factors", "Saline Solution"],
};

export const bestForMap: Record<string, { label: string; color: string }> = {
  "hangover-iv": { label: "Best for: Hangovers", color: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30" },
  "recovery-performance": { label: "Best for: Recovery", color: "bg-green-100 text-green-800 border-green-200 dark:bg-green-500/15 dark:text-green-300 dark:border-green-500/30" },
  "immunity-boost": { label: "Best for: Immune Support", color: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-500/15 dark:text-blue-300 dark:border-blue-500/30" },
  "energy-boost": { label: "Best for: Low Energy", color: "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-500/15 dark:text-orange-300 dark:border-orange-500/30" },
  "beauty-drip": { label: "Best for: Skin & Beauty", color: "bg-pink-100 text-pink-800 border-pink-200 dark:bg-pink-500/15 dark:text-pink-300 dark:border-pink-500/30" },
  "hydration-package": { label: "Best for: Dehydration", color: "bg-cyan-100 text-cyan-800 border-cyan-200 dark:bg-cyan-500/15 dark:text-cyan-300 dark:border-cyan-500/30" },
  "migraine-relief": { label: "Best for: Headaches", color: "bg-violet-100 text-violet-800 border-violet-200 dark:bg-violet-500/15 dark:text-violet-300 dark:border-violet-500/30" },
  "myers-cocktail-plus": { label: "Best for: Overall Wellness", color: "bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-500/15 dark:text-teal-300 dark:border-teal-500/30" },
  "nad-iv-therapy": { label: "Best for: Anti-Aging", color: "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-500/15 dark:text-purple-300 dark:border-purple-500/30" },
  "nad-boost": { label: "Best for: Peak Performance", color: "bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-500/15 dark:text-indigo-300 dark:border-indigo-500/30" },
  // Shipped To You
  "nad-injections": { label: "Best for: Anti-Aging", color: "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-500/15 dark:text-purple-300 dark:border-purple-500/30" },
  "nad-nasal-spray": { label: "Best for: Mental Clarity", color: "bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-500/15 dark:text-indigo-300 dark:border-indigo-500/30" },
  "niagen-nr-injections": { label: "Best for: Longevity", color: "bg-violet-100 text-violet-800 border-violet-200 dark:bg-violet-500/15 dark:text-violet-300 dark:border-violet-500/30" },
  "peptide-sermorelin": { label: "Best for: Anti-Aging", color: "bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-500/15 dark:text-rose-300 dark:border-rose-500/30" },
  "peptide-cjc-ipamorelin": { label: "Best for: Performance", color: "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-500/15 dark:text-orange-300 dark:border-orange-500/30" },
  "peptide-ghk-cu": { label: "Best for: Skin & Beauty", color: "bg-pink-100 text-pink-800 border-pink-200 dark:bg-pink-500/15 dark:text-pink-300 dark:border-pink-500/30" },
  "weight-loss-semaglutide": { label: "Best for: Weight Loss", color: "bg-green-100 text-green-800 border-green-200 dark:bg-green-500/15 dark:text-green-300 dark:border-green-500/30" },
  "weight-loss-tirzepatide": { label: "Best for: Weight Loss", color: "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30" },
  "testosterone-trt": { label: "Best for: Low Testosterone", color: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-500/15 dark:text-blue-300 dark:border-blue-500/30" },
  "testosterone-enclomiphene": { label: "Best for: Low Testosterone", color: "bg-sky-100 text-sky-800 border-sky-200 dark:bg-sky-500/15 dark:text-sky-300 dark:border-sky-500/30" },
  "vitamin-b12": { label: "Best for: Low Energy", color: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30" },
  "vitamin-lipostat": { label: "Best for: Fat Burning", color: "bg-lime-100 text-lime-800 border-lime-200 dark:bg-lime-500/15 dark:text-lime-300 dark:border-lime-500/30" },
  "ketamine-therapy": { label: "Best for: Depression/Anxiety", color: "bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-500/15 dark:text-teal-300 dark:border-teal-500/30" },
  // Specialty IVs
  "iron-iv": { label: "Best for: Iron Deficiency", color: "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-500/15 dark:text-orange-300 dark:border-orange-500/30" },
  "ketamine-iv": { label: "Best for: Depression & PTSD", color: "bg-violet-100 text-violet-800 border-violet-200 dark:bg-violet-500/15 dark:text-violet-300 dark:border-violet-500/30" },
  "exosome-iv": { label: "Best for: Regeneration", color: "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30" },
};

export const reviewMap: Record<string, { rating: number; count: number }> = {
  "hangover-iv": { rating: 4.9, count: 2840 },
  "recovery-performance": { rating: 4.9, count: 1520 },
  "immunity-boost": { rating: 4.8, count: 1890 },
  "energy-boost": { rating: 4.8, count: 1340 },
  "beauty-drip": { rating: 4.9, count: 980 },
  "hydration-package": { rating: 4.7, count: 3210 },
  "migraine-relief": { rating: 4.9, count: 760 },
  "myers-cocktail-plus": { rating: 4.9, count: 2150 },
  "nad-iv-therapy": { rating: 4.8, count: 620 },
  "nad-boost": { rating: 4.9, count: 440 },
  // Shipped To You
  "nad-injections": { rating: 4.8, count: 340 },
  "nad-nasal-spray": { rating: 4.7, count: 220 },
  "niagen-nr-injections": { rating: 4.8, count: 180 },
  "peptide-sermorelin": { rating: 4.8, count: 560 },
  "peptide-cjc-ipamorelin": { rating: 4.9, count: 820 },
  "peptide-ghk-cu": { rating: 4.9, count: 640 },
  "weight-loss-semaglutide": { rating: 4.8, count: 1240 },
  "weight-loss-tirzepatide": { rating: 4.9, count: 960 },
  "testosterone-trt": { rating: 4.8, count: 740 },
  "testosterone-enclomiphene": { rating: 4.9, count: 580 },
  "vitamin-b12": { rating: 4.7, count: 1890 },
  "vitamin-lipostat": { rating: 4.8, count: 430 },
  "ketamine-therapy": { rating: 4.9, count: 290 },
  // Specialty IVs
  "iron-iv": { rating: 4.9, count: 380 },
  "ketamine-iv": { rating: 4.9, count: 520 },
  "exosome-iv": { rating: 5.0, count: 140 },
};

export const memberPriceMap: Record<string, number> = {
  "hangover-iv": 17900,
  "recovery-performance": 20900,
  "immunity-boost": 17900,
  "energy-boost": 13900,
  "beauty-drip": 20900,
  "hydration-package": 10900,
  "migraine-relief": 17900,
  "myers-cocktail-plus": 27900,
  "nad-iv-therapy": 55900,
  "nad-boost": 69900,
  // Shipped To You
  "nad-injections": 19900,
  "nad-nasal-spray": 14900,
  "niagen-nr-injections": 31900,
  "peptide-sermorelin": 31900,
  "peptide-cjc-ipamorelin": 39900,
  "peptide-ghk-cu": 23900,
  "weight-loss-semaglutide": 15900,
  "weight-loss-tirzepatide": 23900,
  "testosterone-trt": 15900,
  "testosterone-enclomiphene": 15900,
  "vitamin-b12": 14900,
  "vitamin-lipostat": 14900,
  "ketamine-therapy": 31900,
};

export const treatmentReviews: Record<string, { name: string; city: string; rating: number; text: string }[]> = {
  "hangover-iv": [
    { name: "Mike D.", city: "Las Vegas", rating: 5, text: "Lifesaver after a night out. Felt 100% within an hour. The nurse was so professional and kind." },
    { name: "Rachel P.", city: "Miami", rating: 5, text: "I swear by this IV. Used it for my bachelorette weekend and was ready to go again by noon!" },
    { name: "Chris L.", city: "New York", rating: 5, text: "Way better than suffering all day. Worth every penny. Nurse arrived in under 90 minutes." },
  ],
  "recovery-performance": [
    { name: "Jake T.", city: "Los Angeles", rating: 5, text: "Game changer for my marathon training. Recovery time cut in half after my long runs." },
    { name: "Amanda S.", city: "Denver", rating: 5, text: "I get this monthly now. My gym performance has noticeably improved." },
    { name: "David R.", city: "Austin", rating: 4, text: "Great for post-workout recovery. The magnesium and glutathione really help with soreness." },
  ],
  "immunity-boost": [
    { name: "Lisa M.", city: "Chicago", rating: 5, text: "Got this before cold season and haven't been sick once! My whole family does it now." },
    { name: "Kevin W.", city: "Seattle", rating: 5, text: "I travel weekly for work and this keeps me from catching every bug on the plane." },
    { name: "Priya K.", city: "San Francisco", rating: 5, text: "The vitamin C and glutathione combo is amazing. I feel protected all winter." },
  ],
  "energy-boost": [
    { name: "Sarah J.", city: "Dallas", rating: 5, text: "Better than 10 cups of coffee. Sustained energy without the crash. Incredible!" },
    { name: "Tom H.", city: "Phoenix", rating: 5, text: "As a busy CEO, this is my secret weapon. Mental clarity and energy for days." },
  ],
  "beauty-drip": [
    { name: "Jessica R.", city: "Los Angeles", rating: 5, text: "My skin was literally glowing the next day. My aesthetician even noticed the difference!" },
    { name: "Maria G.", city: "Miami", rating: 5, text: "I get this before every big event. The biotin and glutathione work wonders for skin and hair." },
  ],
  "nad-iv-therapy": [
    { name: "Robert C.", city: "New York", rating: 5, text: "The mental clarity after NAD+ is unbelievable. I feel 10 years younger and sharper." },
    { name: "Sandra L.", city: "Los Angeles", rating: 5, text: "Worth the investment. My energy, focus, and overall well-being improved dramatically." },
    { name: "Dr. Mark T.", city: "Boston", rating: 5, text: "As a physician myself, I'm impressed by the quality and professionalism. NAD+ is the real deal." },
  ],
  "nad-boost": [
    { name: "Alex P.", city: "San Diego", rating: 5, text: "The NAD+ with vitamins combo is the ultimate wellness treatment. Feel incredible after every session." },
    { name: "Jennifer W.", city: "Atlanta", rating: 5, text: "I've tried NAD alone but the boost version is so much better with all the added vitamins." },
  ],
  "iron-iv": [
    { name: "Diana R.", city: "Houston", rating: 5, text: "I struggled with iron supplements for years due to nausea. This IV gave me my energy back in one session." },
    { name: "Monica S.", city: "Chicago", rating: 5, text: "Post-pregnancy anemia completely addressed. My hemoglobin levels improved dramatically after just two sessions." },
    { name: "Karen T.", city: "Boston", rating: 5, text: "No side effects at all unlike oral iron. The nurse was gentle and professional throughout." },
  ],
  "ketamine-iv": [
    { name: "James F.", city: "Denver", rating: 5, text: "After years of treatment-resistant depression, this has been the only thing that's made a real difference." },
    { name: "Natalie B.", city: "Seattle", rating: 5, text: "I was nervous at first but the nurse made me feel completely safe. Life-changing results for my PTSD." },
    { name: "Marcus W.", city: "Austin", rating: 5, text: "The rapid improvement in my mood was remarkable. Finally something that actually works." },
  ],
  "exosome-iv": [
    { name: "Patricia L.", city: "Miami", rating: 5, text: "My chronic joint inflammation has reduced significantly. This is truly cutting-edge medicine delivered at home." },
    { name: "Dr. Steve H.", city: "Los Angeles", rating: 5, text: "As a physician I was skeptical, but the regenerative results have been genuinely impressive." },
    { name: "Angela M.", city: "New York", rating: 5, text: "Worth every penny for the cellular rejuvenation. My energy and skin quality improved noticeably." },
  ],
};

export const addOns = [
  { id: "glutathione", name: "Extra Glutathione Push", price: 3500, description: "Powerful antioxidant for detox and skin health" },
  { id: "b12-booster", name: "B12 Booster", price: 2500, description: "Supports energy and nervous system function" },
  { id: "zinc", name: "Zinc", price: 2000, description: "Supports immune function and wound healing" },
  { id: "biotin", name: "Biotin", price: 2500, description: "Supports healthy hair, skin, and nails" },
  { id: "magnesium", name: "Magnesium", price: 2000, description: "Supports muscle relaxation and sleep quality" },
  { id: "vitamin-d", name: "Vitamin D", price: 2500, description: "Supports bone health and immune function" },
];

// All "Shipped To You" treatment slugs
export const shippedToYouSlugs = new Set([
  "nad-injections",
  "nad-nasal-spray",
  "niagen-nr-injections",
  "peptide-sermorelin",
  "peptide-cjc-ipamorelin",
  "peptide-ghk-cu",
  "weight-loss-semaglutide",
  "weight-loss-tirzepatide",
  "testosterone-trt",
  "testosterone-enclomiphene",
  "vitamin-b12",
  "vitamin-lipostat",
  "ketamine-therapy",
]);

export type SubscriptionPlanId = "one-month" | "three-month" | "monthly";

export type SubscriptionPlan = {
  id: SubscriptionPlanId;
  label: string;
  billingNote: string;
  discountMultiplier: number;
  savingsPercent: number;
  badge?: string;
  description: string;
};

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: "one-month",
    label: "1-Month Supply",
    billingNote: "One-time order",
    discountMultiplier: 1.0,
    savingsPercent: 0,
    description: "Single shipment, no commitment required.",
  },
  {
    id: "three-month",
    label: "3-Month Supply",
    billingNote: "Billed every 3 months",
    discountMultiplier: 0.90,
    savingsPercent: 10,
    badge: "Save 10%",
    description: "Recommended for best results. Ships once, covers 3 months.",
  },
  {
    id: "monthly",
    label: "Monthly Subscription",
    billingNote: "Billed monthly · Cancel anytime",
    discountMultiplier: 0.80,
    savingsPercent: 20,
    badge: "Best Value",
    description: "Lowest per-month price. Auto-ships, cancel anytime.",
  },
];
