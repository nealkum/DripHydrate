import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Check, Star, ArrowRight, Droplets, ArrowDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const DARK_BG = "#1a2420";
const DARK_CARD = "#243330";
const DARK_CARD_BORDER = "#2e4340";
const TEAL_ACCENT = "#5eb8a3";
const TEAL_LIGHT = "#7dd4c0";
const TEXT_WHITE = "#f0f0ee";
const TEXT_GRAY = "#a0a89e";
const TEXT_MUTED = "#7a8580";
const SAVINGS_BG = "rgba(94, 184, 163, 0.12)";

interface PlanData {
  name: string;
  tagline: string;
  price: number;
  sessions: number;
  perSession: string;
  savingsAmount: string;
  singlePrice: string;
  featured: boolean;
  features: string[];
}

const plans: PlanData[] = [
  {
    name: "Essential",
    tagline: "Perfect for monthly maintenance",
    price: 149,
    sessions: 1,
    perSession: "$149",
    savingsAmount: "$100",
    singlePrice: "$249",
    featured: false,
    features: [
      "1 premium IV session per month",
      "Choice of any standard IV drip",
      "Free mobile delivery to your location",
      "Priority scheduling",
      "10% off add-on boosters",
    ],
  },
  {
    name: "Performance",
    tagline: "For the committed wellness enthusiast",
    price: 259,
    sessions: 2,
    perSession: "$129.50",
    savingsAmount: "$239",
    singlePrice: "$498",
    featured: true,
    features: [
      "2 premium IV sessions per month",
      "Choice of any IV drip including premium blends",
      "Free mobile delivery to your location",
      "Same-day scheduling availability",
      "15% off add-on boosters",
      "Free vitamin B12 shot each visit",
    ],
  },
  {
    name: "VIP Unlimited",
    tagline: "The ultimate wellness experience",
    price: 449,
    sessions: 4,
    perSession: "$112.25",
    savingsAmount: "$547",
    singlePrice: "$996",
    featured: false,
    features: [
      "4 premium IV sessions per month",
      "Full access to all drip formulations",
      "Free mobile delivery, any location",
      "On-demand scheduling (24hr notice)",
      "20% off all add-on boosters",
      "Complimentary vitamin shots each visit",
      "Dedicated wellness concierge",
      "Guest pass: 1 free friend session/month",
    ],
  },
];

const comparisonRows = [
  { feature: "Price per IV session", single: "$249", member: "From $112/session" },
  { feature: "Mobile delivery fee", single: "$25-50", member: "Always free" },
  { feature: "Scheduling priority", single: "Standard (48hr)", member: "Same-day available" },
  { feature: "Add-on booster discounts", single: "None", member: "10-20% off" },
  { feature: "Complimentary vitamin shots", single: "\u2014", member: "Included" },
  { feature: "Cancel anytime", single: "\u2014", member: "No contracts" },
];

const faqs = [
  {
    q: "How does the membership billing work?",
    a: "Your membership renews monthly on the date you sign up. You'll be charged automatically each month. Sessions that aren't used don't roll over, so we encourage you to book early each month!",
  },
  {
    q: "Can I cancel or pause my membership?",
    a: "Absolutely. There are no long-term contracts. You can pause for up to 2 months or cancel anytime from your member dashboard. Cancellations take effect at the end of your current billing cycle.",
  },
  {
    q: "Can I upgrade or downgrade my plan?",
    a: "Yes! Plan changes take effect at the start of your next billing cycle. If you upgrade mid-cycle, we'll prorate the difference so you can start enjoying your new benefits immediately.",
  },
  {
    q: "Which IV drips are included?",
    a: "Essential members can choose from our standard menu (Hydration, Energy, Immunity, Recovery). Performance and VIP members get access to our full menu including premium formulations like NAD+, Myers' Cocktail Plus, and custom blends.",
  },
  {
    q: "Where do you deliver?",
    a: "We deliver anywhere within our service area \u2014 your home, office, hotel, or event venue. Our nurses come to you with all necessary equipment. No clinic visit needed.",
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
  "Not sure \u2014 help me choose",
];

const dayOptions = ["Any day", "Weekdays", "Weekends", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const timeOptions = ["Any time", "Morning (8\u201311am)", "Midday (11am\u20132pm)", "Afternoon (2\u20135pm)", "Evening (5\u20138pm)"];

export default function Membership() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanData | null>(null);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    treatment: "",
    address: "",
    prefDay: "",
    prefTime: "",
    healthNotes: "",
    agreeTerms: false,
    agreeHealth: false,
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const openSignup = (plan: PlanData) => {
    setSelectedPlan(plan);
    setStep(1);
    setShowSuccess(false);
    setFormData({
      firstName: "", lastName: "", email: "", phone: "",
      treatment: "", address: "", prefDay: "", prefTime: "",
      healthNotes: "", agreeTerms: false, agreeHealth: false,
    });
    setModalOpen(true);
  };

  const closeSignup = () => {
    setModalOpen(false);
    setShowSuccess(false);
    setStep(1);
  };

  const { toast } = useToast();

  const handleSubmit = () => {
    if (!formData.agreeTerms || !formData.agreeHealth) {
      toast({
        variant: "destructive",
        title: "Required",
        description: "Please agree to both checkboxes to continue.",
      });
      return;
    }
    setShowSuccess(true);
  };

  const updateField = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: DARK_BG, color: TEXT_WHITE }}>
      {/* Hero */}
      <section className="relative py-16 md:py-24 lg:py-32" style={{ background: `linear-gradient(180deg, ${DARK_BG} 0%, #1e2e28 50%, ${DARK_BG} 100%)` }}>
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div
              className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-wider"
              style={{ backgroundColor: SAVINGS_BG, color: TEAL_ACCENT, border: `1px solid ${TEAL_ACCENT}30` }}
              data-testid="badge-hero-savings"
            >
              <Star className="w-3.5 h-3.5 fill-current" />
              Members save up to 40%
            </div>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold leading-tight" style={{ color: TEXT_WHITE }}>
              Your Wellness, <span className="italic" style={{ color: TEAL_ACCENT }}>On Autopilot</span>
            </h1>
            <p className="text-lg md:text-xl leading-relaxed max-w-xl mx-auto" style={{ color: TEXT_GRAY }}>
              Subscribe to a monthly IV membership and get premium hydration therapy delivered to your door — for a fraction of the single-session price.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-2">
              <a
                href="#plans"
                className="inline-flex items-center justify-center h-12 px-8 text-base font-semibold uppercase rounded-full transition-opacity hover:opacity-90"
                style={{ backgroundColor: TEAL_ACCENT, color: DARK_BG }}
                data-testid="button-join-now"
              >
                Join Now
              </a>
              <a
                href="#plans"
                className="inline-flex items-center justify-center h-12 px-8 text-base font-semibold uppercase rounded-full transition-opacity hover:opacity-80"
                style={{ border: `1px solid ${TEXT_MUTED}`, color: TEXT_WHITE }}
                data-testid="button-view-plans"
              >
                View Plans
              </a>
            </div>
            <p className="text-sm pt-2" style={{ color: TEXT_MUTED }}>
              100,000+ happy patients served
            </p>
          </div>
        </div>
      </section>

      {/* Plans */}
      <section id="plans" className="py-16 md:py-20">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                className="relative flex flex-col overflow-visible"
                style={{
                  backgroundColor: DARK_CARD,
                  borderColor: plan.featured ? TEAL_ACCENT : DARK_CARD_BORDER,
                  borderWidth: plan.featured ? '2px' : '1px',
                }}
                data-testid={`card-plan-${plan.name.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {plan.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                    <Badge
                      className="rounded-full px-4 py-1 text-xs font-semibold uppercase no-default-hover-elevate no-default-active-elevate"
                      style={{ backgroundColor: TEAL_ACCENT, color: DARK_BG }}
                      data-testid="badge-most-popular"
                    >
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardContent className="flex flex-col flex-1 p-6 pt-8">
                  <h3 className="font-serif text-xl font-bold" style={{ color: TEXT_WHITE }} data-testid={`text-plan-name-${plan.name.toLowerCase().replace(/\s+/g, '-')}`}>{plan.name}</h3>
                  <p className="text-sm mb-4" style={{ color: TEXT_MUTED }}>{plan.tagline}</p>

                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-4xl font-bold" style={{ color: TEXT_WHITE }} data-testid={`text-plan-price-${plan.name.toLowerCase().replace(/\s+/g, '-')}`}>${plan.price}</span>
                    <span className="text-sm" style={{ color: TEXT_MUTED }}>/month</span>
                  </div>
                  <p className="text-sm font-semibold mb-3" style={{ color: TEAL_ACCENT }}>
                    {plan.sessions} IV session{plan.sessions > 1 ? 's' : ''}/month &middot; {plan.perSession}/session
                  </p>
                  <Badge
                    variant="outline"
                    className="rounded-full px-4 py-2 text-xs font-semibold mb-5 w-fit no-default-hover-elevate no-default-active-elevate"
                    style={{ backgroundColor: SAVINGS_BG, color: TEAL_ACCENT, borderColor: `${TEAL_ACCENT}40` }}
                    data-testid={`badge-savings-${plan.name.toLowerCase()}`}
                  >
                    <ArrowDown className="w-3 h-3 mr-1.5" />
                    Save {plan.savingsAmount} vs. single booking ({plan.singlePrice})
                  </Badge>

                  <Separator className="mb-5" style={{ backgroundColor: DARK_CARD_BORDER }} />

                  <ul className="space-y-3 mb-6 flex-1">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-sm" style={{ color: TEXT_GRAY }}>
                        <Check className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: TEAL_ACCENT }} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    variant={plan.featured ? "default" : "outline"}
                    className="w-full font-semibold uppercase"
                    style={plan.featured
                      ? { backgroundColor: TEAL_ACCENT, color: DARK_BG, borderColor: TEAL_ACCENT }
                      : { backgroundColor: 'transparent', borderColor: TEXT_MUTED, color: TEXT_WHITE }
                    }
                    onClick={() => openSignup(plan)}
                    data-testid={`button-get-started-${plan.name.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-16 md:py-20" style={{ backgroundColor: '#16201c' }}>
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-center mb-10" style={{ color: TEXT_WHITE }}>
            Single Session vs. Membership
          </h2>
          <Card className="overflow-hidden" style={{ backgroundColor: DARK_CARD, borderColor: DARK_CARD_BORDER }}>
            <div className="overflow-x-auto">
              <table className="w-full" data-testid="table-comparison">
                <thead>
                  <tr style={{ borderBottom: `1px solid ${DARK_CARD_BORDER}` }}>
                    <th className="text-left p-4 font-semibold text-sm" style={{ color: TEXT_WHITE }}>Feature</th>
                    <th className="text-center p-4 font-semibold text-sm" style={{ color: TEXT_MUTED }}>Single Booking</th>
                    <th className="text-center p-4 font-semibold text-sm" style={{ color: TEAL_ACCENT }}>Membership</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row, idx) => (
                    <tr key={idx} style={idx < comparisonRows.length - 1 ? { borderBottom: `1px solid ${DARK_CARD_BORDER}` } : {}}>
                      <td className="p-4 text-sm" style={{ color: TEXT_GRAY }}>{row.feature}</td>
                      <td className="p-4 text-sm text-center" style={{ color: TEXT_MUTED }}>{row.single}</td>
                      <td className="p-4 text-sm text-center font-semibold" style={{ color: TEAL_ACCENT }}>{row.member}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-20" id="faq">
        <div className="container mx-auto px-4 max-w-2xl">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-center mb-10" style={{ color: TEXT_WHITE }}>
            Questions? We've Got Answers
          </h2>
          <Accordion type="single" collapsible className="space-y-2" data-testid="section-membership-faq">
            {faqs.map((faq, idx) => (
              <AccordionItem
                key={idx}
                value={`faq-${idx}`}
                className="rounded-md px-4"
                style={{ backgroundColor: DARK_CARD, border: `1px solid ${DARK_CARD_BORDER}` }}
              >
                <AccordionTrigger className="text-left text-sm font-medium" style={{ color: TEXT_WHITE }} data-testid={`faq-trigger-${idx}`}>
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed" style={{ color: TEXT_GRAY }}>
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 md:py-20" style={{ backgroundColor: '#16201c' }}>
        <div className="container mx-auto px-4 max-w-3xl text-center space-y-6">
          <h2 className="font-serif text-3xl md:text-4xl font-bold" style={{ color: TEXT_WHITE }}>
            Ready to start your wellness journey?
          </h2>
          <p className="text-lg" style={{ color: TEXT_GRAY }}>
            Join thousands of members who have transformed their health with Drip Hydration's IV therapy membership.
          </p>
          <a
            href="#plans"
            className="inline-flex items-center justify-center h-12 px-8 text-base font-semibold uppercase rounded-full transition-opacity hover:opacity-90"
            style={{ backgroundColor: TEAL_ACCENT, color: DARK_BG }}
            data-testid="button-get-started-bottom"
          >
            Get Started Today
          </a>
        </div>
      </section>

      {/* Signup Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto" data-testid="modal-signup">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {showSuccess ? "Welcome!" : "Join Drip Membership"}
            </DialogTitle>
          </DialogHeader>

          {selectedPlan && !showSuccess && (
            <div className="flex items-center justify-between p-3 rounded-md bg-muted mb-4" data-testid="modal-plan-preview">
              <span className="font-semibold text-sm">{selectedPlan.name} Plan</span>
              <span className="text-primary font-bold">${selectedPlan.price}/mo</span>
            </div>
          )}

          {!showSuccess && (
            <div className="flex gap-2 mb-6">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`flex-1 h-1 rounded-full transition-colors ${
                    s < step ? 'bg-primary/50' : s === step ? 'bg-primary' : 'bg-muted'
                  }`}
                  data-testid={`step-dot-${s}`}
                />
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
              <Button className="uppercase font-semibold" onClick={closeSignup} data-testid="button-done">
                Done
              </Button>
            </div>
          ) : step === 1 ? (
            <div className="space-y-4" data-testid="form-step-1">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" placeholder="Jane" value={formData.firstName} onChange={(e) => updateField("firstName", e.target.value)} data-testid="input-first-name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" placeholder="Doe" value={formData.lastName} onChange={(e) => updateField("lastName", e.target.value)} data-testid="input-last-name" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" placeholder="jane@email.com" value={formData.email} onChange={(e) => updateField("email", e.target.value)} data-testid="input-email" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" placeholder="(555) 123-4567" value={formData.phone} onChange={(e) => updateField("phone", e.target.value)} data-testid="input-phone" />
              </div>
              <Button className="w-full uppercase font-semibold" onClick={() => setStep(2)} data-testid="button-continue-1">
                Continue <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          ) : step === 2 ? (
            <div className="space-y-4" data-testid="form-step-2">
              <div className="space-y-2">
                <Label htmlFor="treatment">Preferred IV Treatment</Label>
                <select id="treatment" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={formData.treatment} onChange={(e) => updateField("treatment", e.target.value)} data-testid="select-treatment">
                  <option value="">Select your go-to drip...</option>
                  {treatmentOptions.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Delivery Address</Label>
                <Input id="address" placeholder="123 Main St, City, State ZIP" value={formData.address} onChange={(e) => updateField("address", e.target.value)} data-testid="input-address" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="prefDay">Preferred Day</Label>
                  <select id="prefDay" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={formData.prefDay} onChange={(e) => updateField("prefDay", e.target.value)} data-testid="select-pref-day">
                    <option value="">Any day</option>
                    {dayOptions.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prefTime">Preferred Time</Label>
                  <select id="prefTime" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={formData.prefTime} onChange={(e) => updateField("prefTime", e.target.value)} data-testid="select-pref-time">
                    <option value="">Any time</option>
                    {timeOptions.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="healthNotes">Health Notes <span className="text-muted-foreground font-normal">(allergies, conditions, medications)</span></Label>
                <textarea id="healthNotes" rows={3} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-y" placeholder="Any information our nurses should know..." value={formData.healthNotes} onChange={(e) => updateField("healthNotes", e.target.value)} data-testid="textarea-health-notes" />
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(1)} data-testid="button-back-2">Back</Button>
                <Button className="flex-1 uppercase font-semibold" onClick={() => setStep(3)} data-testid="button-continue-2">
                  Continue <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          ) : step === 3 ? (
            <div className="space-y-4" data-testid="form-step-3">
              <div className="space-y-3">
                {[
                  { label: "Name", value: `${formData.firstName} ${formData.lastName}` },
                  { label: "Email", value: formData.email },
                  { label: "Phone", value: formData.phone },
                  { label: "Plan", value: selectedPlan ? `${selectedPlan.name} \u2014 $${selectedPlan.price}/mo` : "" },
                  { label: "Treatment", value: formData.treatment || "Not selected" },
                  { label: "Address", value: formData.address || "Not provided" },
                ].map((row) => (
                  <div key={row.label} className="flex justify-between items-center py-2 border-b text-sm">
                    <span className="text-muted-foreground">{row.label}</span>
                    <span className="font-medium text-right max-w-[60%]">{row.value}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-2">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" className="mt-1 accent-primary" checked={formData.agreeTerms} onChange={(e) => updateField("agreeTerms", e.target.checked)} data-testid="checkbox-terms" />
                  <span className="text-sm text-muted-foreground">
                    I agree to the membership terms and authorize monthly billing. I understand I can cancel anytime.
                  </span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" className="mt-1 accent-primary" checked={formData.agreeHealth} onChange={(e) => updateField("agreeHealth", e.target.checked)} data-testid="checkbox-health" />
                  <span className="text-sm text-muted-foreground">
                    I confirm the health information I provided is accurate and understand a nurse will review it before my first session.
                  </span>
                </label>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(2)} data-testid="button-back-3">Back</Button>
                <Button className="flex-1 uppercase font-semibold" onClick={handleSubmit} data-testid="button-confirm-membership">
                  Confirm Membership <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
