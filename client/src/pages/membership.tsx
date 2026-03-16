import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Check, Star, ArrowRight, Droplets, Dna, FlaskConical } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import membershipHero from "@assets/photoshoot/drip-shoot-9362.jpeg";
import membershipPhoto from "@assets/photoshoot/drip-shoot-2089.jpeg";

interface PlanTier {
  name: string;
  price: number;
  sessions: number;
  savingsPercent: number;
  featured: boolean;
}

interface MembershipType {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  icon: React.ElementType;
  plans: PlanTier[];
  features: string[];
}

const membershipTypes: MembershipType[] = [
  {
    id: "iv",
    name: "IV Membership",
    subtitle: "Vitamin IV Membership",
    description: "Our Vitamin IV Membership plans are designed to optimize your health & wellness while giving you VIP perks and savings.",
    icon: Droplets,
    plans: [
      { name: "Basic",    price: 279,  sessions: 1, savingsPercent: 25, featured: false },
      { name: "Premium",  price: 499,  sessions: 2, savingsPercent: 30, featured: true  },
      { name: "Elite",    price: 899,  sessions: 4, savingsPercent: 35, featured: false },
      { name: "Platinum", price: 1699, sessions: 8, savingsPercent: 40, featured: false },
    ],
    features: [
      "Priority Booking",
      "15% off all Shipped To You Products",
      "Free Discovery Call with our Longevity Doctor",
      "Service available across 100+ active locations",
      "Exclusive Monthly Member Promotions",
    ],
  },
  {
    id: "nad",
    name: "NAD IV Membership",
    subtitle: "NAD IV Membership",
    description: "Designed to optimize your body and mind, our NAD IV memberships deliver results—plus VIP perks and serious savings.",
    icon: Dna,
    plans: [
      { name: "NAD Basic",    price: 749,  sessions: 1, savingsPercent: 15, featured: false },
      { name: "NAD Premium",  price: 1399, sessions: 2, savingsPercent: 20, featured: true  },
      { name: "NAD Elite",    price: 2499, sessions: 4, savingsPercent: 25, featured: false },
      { name: "NAD Platinum", price: 4799, sessions: 8, savingsPercent: 30, featured: false },
    ],
    features: [
      "Priority Booking",
      "Vitamin Boost Included with every session",
      "15% off all Shipped To You Products",
      "Free Discovery Call with our Longevity Doctor",
      "Service available across 100+ active locations",
      "Exclusive Monthly Member Promotions",
    ],
  },
  {
    id: "niagen",
    name: "Niagen IV Membership",
    subtitle: "Niagen IV Membership",
    description: "Power up your daily health with Niagen NR through targeted, science-backed support optimized for routine wellness.",
    icon: FlaskConical,
    plans: [
      { name: "Niagen Basic",    price: 749,  sessions: 1, savingsPercent: 30, featured: false },
      { name: "Niagen Premium",  price: 1399, sessions: 2, savingsPercent: 35, featured: true  },
      { name: "Niagen Elite",    price: 2499, sessions: 4, savingsPercent: 40, featured: false },
      { name: "Niagen Platinum", price: 4799, sessions: 8, savingsPercent: 45, featured: false },
    ],
    features: [
      "Priority Booking",
      "Vitamin Boost Included with every session",
      "15% off all Shipped To You Products",
      "Free Discovery Call with our Longevity Doctor",
      "Service available across 100+ active locations",
      "Exclusive Monthly Member Promotions",
    ],
  },
];

const comparisonRows = [
  { feature: "Price per IV session", single: "$249+", member: "From $93/session" },
  { feature: "Mobile delivery fee",   single: "$25–50", member: "Always free" },
  { feature: "Scheduling priority",   single: "Standard (48hr)", member: "Same-day available" },
  { feature: "Vitamin Boost add-on",  single: "$35 extra", member: "Included (NAD & Niagen)" },
  { feature: "Shipped To You savings",single: "None", member: "15% off" },
  { feature: "Cancel anytime",        single: "—", member: "No contracts" },
];

const faqs = [
  {
    q: "How does membership billing work?",
    a: "Your membership renews monthly on the date you sign up. You'll be charged automatically each month. Sessions that aren't used don't roll over, so we encourage you to book early each month.",
  },
  {
    q: "Can I cancel or pause my membership?",
    a: "Absolutely. There are no long-term contracts. You can pause for up to 2 months or cancel anytime from your member dashboard. Cancellations take effect at the end of your current billing cycle.",
  },
  {
    q: "Can I switch between membership types?",
    a: "Yes! You can switch between IV, NAD IV, and Niagen IV membership types as well as upgrade or downgrade your tier at any time. Changes take effect at the start of your next billing cycle.",
  },
  {
    q: "What's the difference between NAD IV and Niagen IV memberships?",
    a: "NAD IV memberships include in-home infusions of NAD+, which requires a full IV session. Niagen IV (NR) memberships use Nicotinamide Riboside — a precursor to NAD+ — and are great for routine maintenance. Both include a Vitamin Boost with every session.",
  },
  {
    q: "Is IV therapy HSA/FSA eligible?",
    a: "Yes — all of our IV membership plans are HSA/FSA eligible. You can use your health savings account or flexible spending account funds to cover membership costs.",
  },
  {
    q: "Where do you deliver?",
    a: "We deliver anywhere within our service area — your home, office, hotel, or event venue. Our nurses come to you with all necessary equipment. No clinic visit needed. We serve 100+ cities nationwide.",
  },
];

const treatmentOptions = [
  "Hydration Therapy",
  "Energy Boost",
  "Immunity Defense",
  "Athletic Recovery",
  "Myers' Cocktail",
  "NAD+ Infusion",
  "Beauty Glow",
  "Not sure — help me choose",
];
const dayOptions  = ["Any day","Weekdays","Weekends","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
const timeOptions = ["Any time","Morning (8–11am)","Midday (11am–2pm)","Afternoon (2–5pm)","Evening (5–8pm)"];

interface SelectedPlan {
  typeName: string;
  tierName: string;
  price: number;
  sessions: number;
}

export default function Membership() {
  const [activeTypeId, setActiveTypeId]   = useState("iv");
  const [modalOpen, setModalOpen]         = useState(false);
  const [selectedPlan, setSelectedPlan]   = useState<SelectedPlan | null>(null);
  const [step, setStep]                   = useState(1);
  const [showSuccess, setShowSuccess]     = useState(false);
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    treatment: "", address: "", prefDay: "", prefTime: "",
    healthNotes: "", agreeTerms: false, agreeHealth: false,
  });

  const { toast } = useToast();
  const activeType = membershipTypes.find(t => t.id === activeTypeId)!;

  const openSignup = (type: MembershipType, tier: PlanTier) => {
    setSelectedPlan({ typeName: type.name, tierName: tier.name, price: tier.price, sessions: tier.sessions });
    setStep(1);
    setShowSuccess(false);
    setFormData({ firstName: "", lastName: "", email: "", phone: "", treatment: "", address: "", prefDay: "", prefTime: "", healthNotes: "", agreeTerms: false, agreeHealth: false });
    setModalOpen(true);
  };

  const closeSignup = () => { setModalOpen(false); setShowSuccess(false); setStep(1); };

  const handleSubmit = () => {
    if (!formData.agreeTerms || !formData.agreeHealth) {
      toast({ variant: "destructive", title: "Required", description: "Please agree to both checkboxes to continue." });
      return;
    }
    setShowSuccess(true);
  };

  const updateField = (field: string, value: string | boolean) =>
    setFormData(prev => ({ ...prev, [field]: value }));

  return (
    <div className="min-h-screen">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[70vh] flex items-center" data-testid="section-hero">
        <div className="absolute inset-0 overflow-hidden">
          <img src={membershipHero} alt="Drip Hydration IV bag — premium in-home therapy" className="w-full h-full object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>
        <div className="relative container mx-auto px-4 max-w-7xl py-20 md:py-28">
          <div className="max-w-xl space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider bg-white/10 text-white/90 border border-white/20 backdrop-blur-sm" data-testid="badge-hero-savings">
              <Star className="w-3.5 h-3.5 fill-current" />
              Members save up to 45%
            </div>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white">
              Monthly IV{" "}
              <span className="italic text-primary">Membership Plans</span>
            </h1>
            <p className="text-lg md:text-xl leading-relaxed text-white/75">
              From hydration to high performance — there's a plan for you. Enjoy up to 45% off Drip Hydration's cutting-edge treatments with priority access and VIP perks.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Button size="lg" className="font-semibold uppercase" asChild data-testid="button-join-now">
                <a href="#plans">Join Now</a>
              </Button>
              <Button size="lg" variant="outline" className="font-semibold uppercase text-white border-white/40 bg-white/5 backdrop-blur-sm" asChild data-testid="button-view-plans">
                <a href="#plans">View Plans</a>
              </Button>
            </div>
            <p className="text-sm text-white/60">150,000+ happy patients served</p>
          </div>
        </div>
      </section>

      {/* ── Membership Type Selector ─────────────────────────────────────── */}
      <section id="plans" className="py-14 md:py-18 bg-accent/10">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-10 space-y-3">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
              Get up to 45% off IVs
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Enjoy our convenient in-home service, flexible scheduling, and priority access — bundled into our best values yet.
            </p>
          </div>

          {/* Type tabs */}
          <div className="grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto mb-12">
            {membershipTypes.map((type) => {
              const Icon = type.icon;
              const isActive = type.id === activeTypeId;
              return (
                <button
                  key={type.id}
                  onClick={() => setActiveTypeId(type.id)}
                  className={`group flex flex-col items-center gap-3 p-5 rounded-md border text-center transition-colors cursor-pointer
                    ${isActive
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-card text-muted-foreground hover-elevate"
                    }`}
                  data-testid={`tab-membership-${type.id}`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isActive ? "bg-primary/20" : "bg-muted"}`}>
                    <Icon className={`w-5 h-5 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                  </div>
                  <span className={`font-semibold text-sm leading-tight ${isActive ? "text-primary" : "text-foreground"}`}>
                    {type.name}
                  </span>
                  <p className={`text-xs leading-snug ${isActive ? "text-primary/80" : "text-muted-foreground"}`}>
                    {type.description}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Plan tier cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-7xl mx-auto">
            {activeType.plans.map((tier) => (
              <Card
                key={tier.name}
                className={`relative flex flex-col overflow-visible ${tier.featured ? "border-primary border-2" : ""}`}
                data-testid={`card-plan-${tier.name.toLowerCase().replace(/\s+/g, "-")}`}
              >
                {tier.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                    <Badge className="rounded-full px-4 py-1 text-xs font-semibold uppercase no-default-hover-elevate no-default-active-elevate" data-testid="badge-most-popular">
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardContent className="flex flex-col flex-1 p-6 pt-8">
                  <div className="mb-1">
                    <Badge
                      variant="outline"
                      className="rounded-full text-xs font-semibold bg-primary/10 text-primary border-primary/30 no-default-hover-elevate no-default-active-elevate"
                    >
                      SAVE UP TO {tier.savingsPercent}%
                    </Badge>
                  </div>

                  <h3 className="font-serif text-xl font-bold text-foreground mt-3" data-testid={`text-plan-name-${tier.name.toLowerCase().replace(/\s+/g, "-")}`}>
                    {tier.name}
                  </h3>

                  <div className="flex items-baseline gap-1 mt-2 mb-1">
                    <span className="text-3xl font-bold text-foreground" data-testid={`text-plan-price-${tier.name.toLowerCase().replace(/\s+/g, "-")}`}>
                      ${tier.price.toLocaleString()}
                    </span>
                    <span className="text-sm text-muted-foreground">/month</span>
                  </div>
                  <p className="text-sm font-semibold text-primary mb-5">
                    {tier.sessions} IV Treatment{tier.sessions > 1 ? "s" : ""}
                  </p>

                  <Separator className="mb-5" />

                  <ul className="space-y-3 mb-6 flex-1">
                    {activeType.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                        <Check className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    variant={tier.featured ? "default" : "outline"}
                    className="w-full font-semibold uppercase"
                    onClick={() => openSignup(activeType, tier)}
                    data-testid={`button-join-${tier.name.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    Join Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── Comparison Table ─────────────────────────────────────────────── */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="rounded-md overflow-hidden aspect-[3/4] hidden md:block">
              <img src={membershipPhoto} alt="Member enjoying IV therapy at home" className="w-full h-full object-cover" />
            </div>
            <div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold mb-8 text-foreground">
                Single Session vs.{" "}
                <span className="text-primary italic">Membership</span>
              </h2>
              <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full" data-testid="table-comparison">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-4 font-semibold text-sm text-foreground">Feature</th>
                        <th className="text-center p-4 font-semibold text-sm text-muted-foreground">Single</th>
                        <th className="text-center p-4 font-semibold text-sm text-primary">Member</th>
                      </tr>
                    </thead>
                    <tbody>
                      {comparisonRows.map((row, idx) => (
                        <tr key={idx} className={idx < comparisonRows.length - 1 ? "border-b" : ""}>
                          <td className="p-4 text-sm text-muted-foreground">{row.feature}</td>
                          <td className="p-4 text-sm text-center text-muted-foreground">{row.single}</td>
                          <td className="p-4 text-sm text-center font-semibold text-primary">{row.member}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section className="py-16 md:py-20 bg-accent/10" id="faq">
        <div className="container mx-auto px-4 max-w-2xl">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-center mb-10 text-foreground">
            Questions? We've Got Answers
          </h2>
          <Accordion type="single" collapsible className="w-full" data-testid="section-membership-faq">
            {faqs.map((faq, idx) => (
              <AccordionItem key={idx} value={`faq-${idx}`}>
                <AccordionTrigger className="text-left text-sm font-medium text-foreground" data-testid={`faq-trigger-${idx}`}>
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────────────────────── */}
      <section className="py-16 md:py-20 bg-accent/20">
        <div className="container mx-auto px-4 max-w-3xl text-center space-y-6">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
            Ready to start your wellness journey?
          </h2>
          <p className="text-lg text-muted-foreground">
            Join thousands of members who have transformed their health with Drip Hydration's IV therapy memberships.
          </p>
          <Button size="lg" className="font-semibold uppercase px-8" asChild data-testid="button-get-started-bottom">
            <a href="#plans">Get Started Today</a>
          </Button>
        </div>
      </section>

      {/* ── Signup Modal ─────────────────────────────────────────────────── */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto" data-testid="modal-signup">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {showSuccess ? "Welcome to Drip!" : "Join Drip Membership"}
            </DialogTitle>
          </DialogHeader>

          {selectedPlan && !showSuccess && (
            <div className="flex items-center justify-between p-3 rounded-md bg-muted mb-2" data-testid="modal-plan-preview">
              <div>
                <p className="font-semibold text-sm text-foreground">{selectedPlan.tierName}</p>
                <p className="text-xs text-muted-foreground">{selectedPlan.typeName} · {selectedPlan.sessions} session{selectedPlan.sessions > 1 ? "s" : ""}/month</p>
              </div>
              <span className="text-primary font-bold">${selectedPlan.price.toLocaleString()}/mo</span>
            </div>
          )}

          {!showSuccess && (
            <div className="flex gap-2 mb-5">
              {[1, 2, 3].map((s) => (
                <div key={s} className={`flex-1 h-1 rounded-full transition-colors ${s < step ? "bg-primary/50" : s === step ? "bg-primary" : "bg-muted"}`} data-testid={`step-dot-${s}`} />
              ))}
            </div>
          )}

          {showSuccess ? (
            <div className="text-center py-8 space-y-4" data-testid="section-signup-success">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <Droplets className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">Welcome to the Drip Family!</h3>
              <p className="text-muted-foreground text-sm max-w-sm mx-auto">
                Check your email for confirmation details and a link to schedule your first IV session. We can't wait to see you.
              </p>
              <Button className="uppercase font-semibold" onClick={closeSignup} data-testid="button-done">Done</Button>
            </div>

          ) : step === 1 ? (
            <div className="space-y-4" data-testid="form-step-1">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" placeholder="Jane" value={formData.firstName} onChange={e => updateField("firstName", e.target.value)} data-testid="input-first-name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" placeholder="Doe" value={formData.lastName} onChange={e => updateField("lastName", e.target.value)} data-testid="input-last-name" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" placeholder="jane@email.com" value={formData.email} onChange={e => updateField("email", e.target.value)} data-testid="input-email" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" placeholder="(555) 123-4567" value={formData.phone} onChange={e => updateField("phone", e.target.value)} data-testid="input-phone" />
              </div>
              <Button className="w-full uppercase font-semibold" onClick={() => setStep(2)} data-testid="button-continue-1">
                Continue <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

          ) : step === 2 ? (
            <div className="space-y-4" data-testid="form-step-2">
              <div className="space-y-2">
                <Label htmlFor="treatment">Preferred IV Treatment</Label>
                <select id="treatment" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={formData.treatment} onChange={e => updateField("treatment", e.target.value)} data-testid="select-treatment">
                  <option value="">Select your go-to drip...</option>
                  {treatmentOptions.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Delivery Address</Label>
                <Input id="address" placeholder="123 Main St, City, State ZIP" value={formData.address} onChange={e => updateField("address", e.target.value)} data-testid="input-address" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="prefDay">Preferred Day</Label>
                  <select id="prefDay" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={formData.prefDay} onChange={e => updateField("prefDay", e.target.value)} data-testid="select-pref-day">
                    <option value="">Any day</option>
                    {dayOptions.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prefTime">Preferred Time</Label>
                  <select id="prefTime" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={formData.prefTime} onChange={e => updateField("prefTime", e.target.value)} data-testid="select-pref-time">
                    <option value="">Any time</option>
                    {timeOptions.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="healthNotes">Health Notes <span className="text-muted-foreground font-normal">(allergies, conditions, medications)</span></Label>
                <textarea id="healthNotes" rows={3} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-y" placeholder="Any information our nurses should know..." value={formData.healthNotes} onChange={e => updateField("healthNotes", e.target.value)} data-testid="textarea-health-notes" />
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(1)} data-testid="button-back-2">Back</Button>
                <Button className="flex-1 uppercase font-semibold" onClick={() => setStep(3)} data-testid="button-continue-2">
                  Continue <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>

          ) : (
            <div className="space-y-4" data-testid="form-step-3">
              <h4 className="font-semibold text-foreground text-sm">Review Your Details</h4>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-muted-foreground">
                <span>Name:</span>      <span className="text-foreground">{formData.firstName} {formData.lastName}</span>
                <span>Email:</span>     <span className="text-foreground">{formData.email}</span>
                <span>Phone:</span>     <span className="text-foreground">{formData.phone}</span>
                {formData.treatment && <><span>Treatment:</span><span className="text-foreground">{formData.treatment}</span></>}
                {formData.address   && <><span>Address:</span>  <span className="text-foreground">{formData.address}</span></>}
                {selectedPlan && (
                  <>
                    <span>Plan:</span>
                    <span className="text-foreground">{selectedPlan.tierName} — ${selectedPlan.price.toLocaleString()}/mo</span>
                  </>
                )}
              </div>
              <Separator />
              <div className="space-y-3">
                <label className="flex items-start gap-2.5 cursor-pointer text-sm text-muted-foreground">
                  <input type="checkbox" checked={formData.agreeTerms} onChange={e => updateField("agreeTerms", e.target.checked)} className="mt-0.5" data-testid="checkbox-terms" />
                  I agree to the Terms of Service and authorize the recurring monthly charge.
                </label>
                <label className="flex items-start gap-2.5 cursor-pointer text-sm text-muted-foreground">
                  <input type="checkbox" checked={formData.agreeHealth} onChange={e => updateField("agreeHealth", e.target.checked)} className="mt-0.5" data-testid="checkbox-health" />
                  I confirm I have no contraindications to IV therapy and consent to treatment.
                </label>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(2)} data-testid="button-back-3">Back</Button>
                <Button className="flex-1 uppercase font-semibold" onClick={handleSubmit} data-testid="button-confirm">
                  Confirm Membership <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
