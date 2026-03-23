import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useQuery } from "@tanstack/react-query";
import type { Treatment } from "@shared/schema";
import {
  Droplet, Zap, MapPin, Clock, Shield, Star, X,
  Search, Heart, Battery, Brain, Dumbbell, Sparkles,
  Stethoscope, CheckCircle2, Users, Package, ArrowRight, TrendingUp, CreditCard
} from "lucide-react";
import heroPhoto from "@assets/photoshoot/drip-shoot-8241.jpeg";
import { bestForMap, reviewMap, memberPriceMap, shippedToYouSlugs } from "@/lib/treatment-data";

const symptomFilters = [
  { label: "Hangover",    icon: Droplet,    slug: "hangover-iv",              href: "/treatment/hangover-iv" },
  { label: "Low Energy",  icon: Battery,    slug: "energy-boost",             href: "/treatment/energy-boost" },
  { label: "Dehydration", icon: Droplet,    slug: "hydration-package",        href: "/treatment/hydration-package" },
  { label: "Immune Boost",icon: Shield,     slug: "immunity-boost",           href: "/treatment/immunity-boost" },
  { label: "Recovery",    icon: Dumbbell,   slug: "recovery-performance",     href: "/treatment/recovery-performance" },
  { label: "Weight Loss", icon: TrendingUp, slug: "weight-loss-semaglutide",  href: "/treatment/weight-loss-semaglutide" },
  { label: "Anti-Aging",  icon: Sparkles,   slug: "nad-iv-therapy",           href: "/treatment/nad-iv-therapy" },
  { label: "Headache",    icon: Brain,      slug: "migraine-relief",          href: "/treatment/migraine-relief" },
  { label: "Beauty",      icon: Heart,      slug: "beauty-drip",              href: "/treatment/beauty-drip" },
];

const POPULAR_SLUGS = [
  "hangover-iv",
  "recovery-performance",
  "immunity-boost",
  "myers-cocktail-plus",
  "nad-iv-therapy",
];

const testimonials = [
  {
    name: "Sarah M.",
    city: "Los Angeles",
    rating: 5,
    text: "The nurse arrived within 2 hours and was incredibly professional. My hangover was gone in 30 minutes. Will definitely book again!",
  },
  {
    name: "James R.",
    city: "New York",
    rating: 5,
    text: "I get the NAD+ therapy monthly now. The mental clarity and energy boost is unreal. Drip Hydration makes it so easy with in-home service.",
  },
  {
    name: "Emily T.",
    city: "Miami",
    rating: 5,
    text: "Booked for our bachelorette party and everyone loved it. The beauty drip had us all glowing for the weekend. 10/10 experience!",
  },
];

const faqItems = [
  {
    question: "Is IV therapy safe?",
    answer: "Yes, all treatments are administered by licensed Registered Nurses with ER/ICU backgrounds. Our medical team is directed by Dr. Jon Snipes, MD. Every patient receives a medical screening before treatment.",
  },
  {
    question: "How quickly can a nurse arrive?",
    answer: "In most areas, a licensed nurse can arrive at your location within 2 hours of booking. Same-day appointments are available in 100+ cities worldwide.",
  },
  {
    question: "How long does treatment take?",
    answer: "Most IV treatments take 30-60 minutes to complete. NAD+ therapies may take 2-3 hours depending on dosage. You can relax, work, or watch TV during your session.",
  },
  {
    question: "Do I need a prescription?",
    answer: "No prescription is needed. However, you will complete a medical screening with one of our providers before your first treatment to ensure safety and effectiveness.",
  },
  {
    question: "What if I have an allergic reaction?",
    answer: "Our nurses carry emergency supplies and are trained in emergency response protocols. All patients are monitored throughout the infusion, and vitals are checked before and during treatment.",
  },
  {
    question: "Where do you provide service?",
    answer: "We operate in 100+ cities across the United States and internationally. Our nurses come to your home, hotel, office, or event venue — wherever is most convenient for you.",
  },
];

const homeMembershipTypes = [
  {
    id: "iv",
    name: "IV Membership",
    tagline: "Vitamin IV wellness",
    startingPrice: 279,
    savingsPercent: 25,
    featured: false,
  },
  {
    id: "nad",
    name: "NAD IV Membership",
    tagline: "Cellular energy & longevity",
    startingPrice: 749,
    savingsPercent: 15,
    featured: true,
  },
  {
    id: "niagen",
    name: "Niagen IV Membership",
    tagline: "NR-powered daily health",
    startingPrice: 749,
    savingsPercent: 30,
    featured: false,
  },
];

export default function Home() {
  const [promoDismissed, setPromoDismissed] = useState(false);

  const { data: allTreatments } = useQuery<Treatment[]>({
    queryKey: ["/api/treatments"],
  });

  const popularTreatments = POPULAR_SLUGS
    .map((slug) => allTreatments?.find((t) => t.slug === slug))
    .filter(Boolean) as Treatment[];

  return (
    <div className="min-h-screen">

      {/* Promo Banner */}
      {!promoDismissed && (
        <div className="relative flex items-center justify-center px-10 py-2 text-xs font-medium text-white" style={{ background: "hsl(181 48% 35%)" }} data-testid="promo-banner">
          <span>
            Celebrating 10 Years &mdash; <span className="font-bold">10% off your first service</span> with code{" "}
            <span className="font-bold tracking-wider">DRIPDECADE</span>
          </span>
          <button
            onClick={() => setPromoDismissed(true)}
            className="absolute right-3 top-1/2 -translate-y-1/2 opacity-70 hover:opacity-100 transition-opacity"
            aria-label="Dismiss banner"
            data-testid="button-dismiss-promo"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Hero Section — full bleed photo */}
      <section className="relative flex items-center" style={{ minHeight: 'clamp(380px, 58vh, 92vh)' }} data-testid="section-hero">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={heroPhoto}
            alt="Woman relaxing during in-home IV therapy session"
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        </div>

        <div className="relative container mx-auto px-4 max-w-7xl pt-14 pb-8 md:py-28">
          <div className="max-w-lg space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider bg-white/10 text-white/90 border border-white/20 backdrop-blur-sm">
              <Shield className="w-3 h-3" />
              Licensed RNs &middot; Nurse at Your Door in 2 Hours
            </div>

            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white">
              Premium IV Therapy —{" "}
              <span className="text-primary italic">Delivered to You</span>
            </h1>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Button
                size="lg"
                className="font-semibold uppercase"
                asChild
                data-testid="button-browse-treatments"
              >
                <Link href="/treatments">Book IV Therapy</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="font-semibold uppercase text-white border-white/40 bg-white/5 backdrop-blur-sm"
                asChild
                data-testid="button-membership"
              >
                <Link href="/membership">Become A Member</Link>
              </Button>
            </div>
            <p className="text-sm">
              <Link
                href="/treatments/shipped-to-you"
                className="text-white/60 hover:text-white/90 transition-colors underline underline-offset-4"
                data-testid="link-shipped-to-you"
              >
                or shop treatments shipped to your door &rarr;
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-5 border-b border-t bg-card" data-testid="section-trust-bar">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5" data-testid="trust-rating">
              <div className="flex">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="font-semibold text-foreground">4.9</span>
              <span>rating</span>
            </div>
            <div className="flex items-center gap-1.5" data-testid="trust-treatments">
              <Users className="w-4 h-4 text-primary" />
              <span><span className="font-semibold text-foreground">200,000+</span> treatments</span>
            </div>
            <div className="flex items-center gap-1.5" data-testid="trust-cities">
              <MapPin className="w-4 h-4 text-primary" />
              <span><span className="font-semibold text-foreground">100+</span> cities</span>
            </div>
            <div className="flex items-center gap-1.5" data-testid="trust-nurses">
              <Stethoscope className="w-4 h-4 text-primary" />
              <span><span className="font-semibold text-foreground">Doctor-Owned</span> &amp; Directed</span>
            </div>

            <div className="flex items-center gap-1.5" data-testid="trust-hsa">
              <CreditCard className="w-4 h-4 text-primary" />
              <span><span className="font-semibold text-foreground">HSA / FSA</span> Eligible</span>
            </div>
          </div>
        </div>
      </section>

      {/* Symptom-Based Navigation */}
      <section className="py-12 md:py-16" data-testid="section-symptoms">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-8">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-3">
              What do you need <span className="text-primary italic">help with?</span>
            </h2>
            <p className="text-muted-foreground">
              Select a concern and we'll recommend the best treatment for you.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
            {symptomFilters.map((symptom) => {
              const Icon = symptom.icon;
              return (
                <Button
                  key={symptom.label}
                  variant="outline"
                  className="gap-2 text-sm"
                  asChild
                  data-testid={`button-symptom-${symptom.label.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <Link href={symptom.href}>
                    <Icon className="w-4 h-4" />
                    {symptom.label}
                  </Link>
                </Button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Popular Treatments Row */}
      {popularTreatments.length > 0 && (
        <section className="py-8 md:py-10 bg-accent/10" data-testid="section-popular-treatments">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-serif text-xl md:text-2xl font-bold text-foreground">
                Most Popular <span className="text-primary italic">Treatments</span>
              </h2>
              <Button variant="ghost" size="sm" className="font-semibold text-primary uppercase text-xs" asChild>
                <Link href="/treatments">View All &rarr;</Link>
              </Button>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 snap-x snap-mandatory scrollbar-none" style={{ scrollbarWidth: 'none' }}>
              {popularTreatments.map((t) => {
                const bestFor = bestForMap[t.slug];
                const reviews = reviewMap[t.slug];
                const memberPrice = memberPriceMap[t.slug];
                const memberFormatted = memberPrice ? `$${(memberPrice / 100).toFixed(0)}` : null;
                return (
                  <Card
                    key={t.id}
                    className="flex-shrink-0 snap-start w-[220px] md:w-[240px] hover-elevate transition-all"
                    data-testid={`card-popular-${t.slug}`}
                  >
                    <div className="p-4 flex flex-col h-full gap-2">
                      {bestFor && (
                        <Badge variant="outline" className={`self-start text-[10px] font-medium no-default-hover-elevate no-default-active-elevate ${bestFor.color}`}>
                          {bestFor.label}
                        </Badge>
                      )}
                      <h3 className="font-semibold text-sm text-foreground leading-tight">{t.name}</h3>
                      {reviews && (
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span className="text-xs font-semibold text-foreground">{reviews.rating}</span>
                          <span className="text-[10px] text-muted-foreground">({reviews.count.toLocaleString()})</span>
                        </div>
                      )}
                      <div className="mt-auto pt-1">
                        <div className="flex items-baseline gap-1.5 mb-1">
                          <span className="text-lg font-bold text-foreground">${(t.price / 100).toFixed(0)}</span>
                          {memberFormatted && (
                            <span className="text-xs text-primary font-semibold">{memberFormatted} w/ {shippedToYouSlugs.has(t.slug) ? "subscription" : "membership"}</span>
                          )}
                        </div>
                        <Button size="sm" className="w-full font-semibold uppercase text-xs" asChild data-testid={`button-popular-book-${t.slug}`}>
                          <Link href={`/book/${t.slug}/location`}>Book Now</Link>
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Categories */}
      <section className="py-12 md:py-16 bg-accent/20" data-testid="section-categories">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-10">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-3">
              The first step to better health <span className="text-primary italic">is just a drip away</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore our range of in-home vitamin IV treatments designed for optimal health.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                id: "vitamin-wellness",
                name: "Vitamin & Wellness IVs",
                description: "Essential vitamins, hydration, and NAD+ therapy for energy, immunity, and recovery. Starting at $149.",
                icon: Droplet,
                slug: "vitamin-wellness",
                count: "10 treatments",
                badge: null,
              },
              {
                id: "specialty-ivs",
                name: "Specialty IVs",
                description: "Next-level treatments — Iron, Ketamine, and Exosome IV therapy for advanced medical and regenerative needs.",
                icon: Zap,
                slug: "specialty-ivs",
                count: "3 treatments",
                badge: null,
              },
              {
                id: "shipped-to-you",
                name: "Shipped To You",
                description: "Doctor-prescribed weight loss, peptides, testosterone & NAD+ — shipped nationwide. No nurse visit required.",
                icon: Package,
                slug: "shipped-to-you",
                count: "13+ treatments",
                badge: "Ships Free",
              },
            ].map((category) => {
              const Icon = category.icon;
              return (
                <Card
                  key={category.id}
                  className="hover-elevate transition-all duration-200 cursor-pointer overflow-visible"
                  data-testid={`card-category-${category.id}`}
                >
                  <Link href={`/treatments/${category.slug}`}>
                    <div className="p-6 space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-lg bg-primary/15 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-xl font-semibold text-foreground">{category.name}</h3>
                            {category.badge && (
                              <Badge className="text-[10px] font-semibold uppercase no-default-hover-elevate no-default-active-elevate">
                                {category.badge}
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">{category.count}</p>
                        </div>
                      </div>
                      <p className="text-muted-foreground leading-relaxed">{category.description}</p>
                      <Button variant="ghost" className="w-full justify-between font-semibold uppercase" data-testid={`button-view-${category.id}`}>
                        View Treatments
                        <span className="ml-2">&rarr;</span>
                      </Button>
                    </div>
                  </Link>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 md:py-16" data-testid="section-how-it-works">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-10">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-3">
              How it <span className="text-primary italic">works</span>
            </h2>
            <p className="text-muted-foreground">
              Experience seamless wellness with our at-home IV therapy.
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                step: "1",
                icon: Search,
                title: "Choose",
                description: "Browse our treatments and select what fits your needs.",
              },
              {
                step: "2",
                icon: Clock,
                title: "Book",
                description: "Pick a time that works. Same-day appointments available.",
              },
              {
                step: "3",
                icon: CheckCircle2,
                title: "Feel Better",
                description: "A licensed RN arrives at your location. Treatment takes 30-60 min.",
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.step} className="text-center" data-testid={`step-${item.step}`}>
                  <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/15 mb-4">
                    <Icon className="w-7 h-7 text-primary" />
                    <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="font-semibold text-foreground text-lg mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 md:py-16 bg-accent/20" data-testid="section-testimonials">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-10">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-3">
              Hear from our <span className="text-primary italic">clients</span>
            </h2>
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <div className="flex">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="font-semibold text-foreground">4.9 stars</span>
              <span>· Based on 10,000+ verified reviews on Google</span>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((review, idx) => (
              <Card key={idx} className="h-full" data-testid={`testimonial-${idx}`}>
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="flex mb-3">
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed flex-1 mb-4">
                    &ldquo;{review.text}&rdquo;
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center">
                      <span className="text-xs font-semibold text-primary">{review.name[0]}</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{review.name}</p>
                      <p className="text-xs text-muted-foreground">{review.city}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Membership CTA — High-conversion two-column layout */}
      <section className="py-14 md:py-20" data-testid="section-membership-cta">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-accent/20 border border-primary/20 overflow-hidden">
            <div className="grid lg:grid-cols-2 gap-0">

              {/* Left column — value proposition */}
              <div className="p-8 md:p-12 flex flex-col justify-center space-y-6 border-b lg:border-b-0 lg:border-r border-primary/20">
                <div className="inline-flex items-center gap-2 w-fit rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider bg-primary/20 text-primary border border-primary/30">
                  <Star className="w-3 h-3 fill-current" />
                  Membership — Save up to 45%
                </div>

                <div>
                  <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground leading-tight mb-3">
                    Stop paying full price for{" "}
                    <span className="text-primary italic">every session</span>
                  </h2>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    Get premium IV therapy delivered monthly at member-only rates — with perks that single bookings can't offer.
                  </p>
                </div>

                <ul className="space-y-3">
                  {[
                    "Free mobile delivery to your location — always",
                    "Priority same-day scheduling, no wait",
                    "10–20% off all vitamin add-on boosters",
                    "Complimentary vitamin shots included",
                    "HSA / FSA eligible &middot; No contracts &middot; Cancel anytime",
                  ].map((perk, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary" />
                      <span dangerouslySetInnerHTML={{ __html: perk }} />
                    </li>
                  ))}
                </ul>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Button
                    size="lg"
                    className="font-semibold uppercase"
                    asChild
                    data-testid="button-view-membership"
                  >
                    <Link href="/membership">
                      View All Plans
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="font-semibold uppercase"
                    asChild
                    data-testid="button-compare-plans"
                  >
                    <Link href="/membership#plans">Compare Plans</Link>
                  </Button>
                </div>
              </div>

              {/* Right column — membership type cards */}
              <div className="p-8 md:p-12 flex flex-col justify-center space-y-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
                  Choose your membership type
                </p>
                {homeMembershipTypes.map((type) => (
                  <Link
                    key={type.id}
                    href={`/membership`}
                    className={`relative rounded-xl border p-5 flex items-center justify-between gap-4 transition-all hover-elevate cursor-pointer no-underline ${
                      type.featured
                        ? "border-primary bg-primary/15"
                        : "border-border bg-card/50"
                    }`}
                    data-testid={`membership-type-${type.id}`}
                  >
                    {type.featured && (
                      <div className="absolute -top-3 left-4">
                        <Badge className="text-[10px] font-semibold uppercase px-2.5 py-0.5 no-default-hover-elevate no-default-active-elevate">
                          Most Popular
                        </Badge>
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-base text-foreground">{type.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{type.tagline}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-xl font-bold text-foreground">
                        From ${type.startingPrice.toLocaleString()}
                        <span className="text-sm font-normal text-muted-foreground">/mo</span>
                      </div>
                      <div className="inline-flex items-center gap-1 mt-0.5 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2 py-0.5">
                        Save up to {type.savingsPercent}%
                      </div>
                    </div>
                  </Link>
                ))}

                <p className="text-xs text-muted-foreground text-center pt-1">
                  3-month minimum &middot; HSA/FSA accepted &middot; No setup fee
                </p>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 md:py-16 bg-accent/20" data-testid="section-faq">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-10">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-3">
              Frequently asked <span className="text-primary italic">questions</span>
            </h2>
          </div>
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, idx) => (
              <AccordionItem key={idx} value={`faq-${idx}`} data-testid={`faq-item-${idx}`}>
                <AccordionTrigger className="text-left text-base">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </div>
  );
}
