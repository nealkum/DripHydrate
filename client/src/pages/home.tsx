import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  Droplet, Zap, MapPin, Clock, Shield, Star,
  Search, Heart, Battery, Brain, Dumbbell, Sparkles,
  Stethoscope, CheckCircle2, Users, Award, Package, ArrowRight
} from "lucide-react";
import heroPhoto from "@assets/photoshoot/drip-shoot-8241.jpeg";

const symptomFilters = [
  { label: "Hangover", icon: Droplet, slug: "hangover-iv" },
  { label: "Low Energy", icon: Battery, slug: "energy-boost" },
  { label: "Dehydration", icon: Droplet, slug: "hydration-package" },
  { label: "Immune Boost", icon: Shield, slug: "immunity-boost" },
  { label: "Recovery", icon: Dumbbell, slug: "recovery-performance" },
  { label: "Anti-Aging", icon: Sparkles, slug: "nad-iv-therapy" },
  { label: "Headache", icon: Brain, slug: "migraine-relief" },
  { label: "Beauty", icon: Heart, slug: "beauty-drip" },
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

const membershipPlans = [
  {
    name: "Essential",
    sessions: 1,
    price: 149,
    singlePrice: 249,
    savings: 100,
    featured: false,
  },
  {
    name: "Performance",
    sessions: 2,
    price: 259,
    singlePrice: 498,
    savings: 239,
    featured: true,
  },
  {
    name: "VIP Unlimited",
    sessions: 4,
    price: 449,
    singlePrice: 996,
    savings: 547,
    featured: false,
  },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section — full bleed photo */}
      <section className="relative min-h-[88vh] flex items-center" data-testid="section-hero">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={heroPhoto}
            alt="Woman relaxing during in-home IV therapy session"
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        </div>

        <div className="relative container mx-auto px-4 max-w-7xl py-20 md:py-28">
          <div className="max-w-lg space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider bg-white/10 text-white/90 border border-white/20 backdrop-blur-sm">
              <Shield className="w-3 h-3" />
              Licensed RNs &middot; Same-Day Appointments
            </div>

            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white">
              Premium IV Therapy —{" "}
              <span className="text-primary italic">Delivered to You</span>
            </h1>

            <p className="text-lg text-white/75 leading-relaxed">
              Licensed nurses at your door in as little as 2 hours. 100+ cities worldwide.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Button
                size="lg"
                className="font-semibold uppercase"
                asChild
                data-testid="button-browse-treatments"
              >
                <Link href="/treatments">Browse Treatments</Link>
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
              <span><span className="font-semibold text-foreground">100,000+</span> treatments</span>
            </div>
            <div className="flex items-center gap-1.5" data-testid="trust-cities">
              <MapPin className="w-4 h-4 text-primary" />
              <span><span className="font-semibold text-foreground">100+</span> cities</span>
            </div>
            <div className="flex items-center gap-1.5" data-testid="trust-nurses">
              <Stethoscope className="w-4 h-4 text-primary" />
              <span><span className="font-semibold text-foreground">Doctor-Owned</span> &amp; Directed</span>
            </div>
            <div className="flex items-center gap-1.5" data-testid="trust-years">
              <Award className="w-4 h-4 text-primary" />
              <span>Celebrating <span className="font-semibold text-foreground">10 Years</span></span>
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
                  className="gap-2 text-sm hover:bg-primary hover:text-primary-foreground hover:border-primary"
                  asChild
                  data-testid={`button-symptom-${symptom.label.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <Link href={`/treatment/${symptom.slug}`}>
                    <Icon className="w-4 h-4" />
                    {symptom.label}
                  </Link>
                </Button>
              );
            })}
          </div>
        </div>
      </section>

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
                description: "Essential vitamins and hydration for energy, immunity, and recovery. Starting at $149.",
                icon: Droplet,
                slug: "vitamin-wellness",
                count: "8 treatments",
              },
              {
                id: "nad-therapy",
                name: "NAD+ Therapy",
                description: "Advanced anti-aging and cellular health treatments for peak mental and physical performance.",
                icon: Zap,
                slug: "nad-therapy",
                count: "2 treatments",
              },
              {
                id: "shipped-to-you",
                name: "Shipped To You",
                description: "At-home treatments shipped to your door — peptides, weight loss, testosterone, and more.",
                icon: Package,
                slug: "shipped-to-you",
                count: "13 treatments",
              },
            ].map((category) => {
              const Icon = category.icon;
              return (
                <Card
                  key={category.id}
                  className="hover-elevate transition-all duration-200 cursor-pointer"
                  data-testid={`card-category-${category.id}`}
                >
                  <Link href={`/treatments/${category.slug}`}>
                    <div className="p-6 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-primary/15 flex items-center justify-center">
                          <Icon className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-foreground">{category.name}</h3>
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
              <span>on Google</span>
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
                  Membership — Save up to 40%
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
                    "HSA / FSA eligible &middot; Cancel anytime",
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

              {/* Right column — plan price cards */}
              <div className="p-8 md:p-12 flex flex-col justify-center space-y-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
                  Membership plans
                </p>
                {membershipPlans.map((plan) => (
                  <div
                    key={plan.name}
                    className={`relative rounded-xl border p-5 flex items-center justify-between gap-4 transition-all ${
                      plan.featured
                        ? "border-primary bg-primary/15 shadow-md"
                        : "border-border bg-card/50"
                    }`}
                    data-testid={`membership-plan-${plan.name.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {plan.featured && (
                      <div className="absolute -top-3 left-4">
                        <Badge className="text-[10px] font-semibold uppercase px-2.5 py-0.5 no-default-hover-elevate no-default-active-elevate">
                          Most Popular
                        </Badge>
                      </div>
                    )}

                    <div>
                      <p className={`font-semibold text-base ${plan.featured ? 'text-foreground' : 'text-foreground'}`}>
                        {plan.name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {plan.sessions} IV session{plan.sessions > 1 ? 's' : ''} / month
                      </p>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <div className="text-xs text-muted-foreground line-through">
                        ${plan.singlePrice}/mo single
                      </div>
                      <div className="text-xl font-bold text-foreground">
                        ${plan.price}
                        <span className="text-sm font-normal text-muted-foreground">/mo</span>
                      </div>
                      <div className="inline-flex items-center gap-1 mt-0.5 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2 py-0.5">
                        Save ${plan.savings}
                      </div>
                    </div>
                  </div>
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
