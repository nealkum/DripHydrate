import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowLeft, Check, Clock, DollarSign, Search, Stethoscope, CheckCircle2, Shield, Star, FlaskConical } from "lucide-react";
import type { Treatment } from "@shared/schema";
import { ingredientMap, bestForMap, reviewMap, memberPriceMap, treatmentReviews, addOns } from "@/lib/treatment-data";

const treatmentFaqs = [
  {
    question: "How quickly can a nurse arrive?",
    answer: "In most areas, a licensed nurse can arrive at your location within 2 hours of booking. Same-day appointments are available.",
  },
  {
    question: "How long does the treatment take?",
    answer: "Treatment duration varies. Most vitamin IVs take 30-45 minutes. NAD+ therapies take 2-3 hours depending on dosage.",
  },
  {
    question: "Is it safe?",
    answer: "Yes, all treatments are administered by licensed Registered Nurses with ER/ICU backgrounds. You'll have a medical screening before your first treatment.",
  },
  {
    question: "Do I need a prescription?",
    answer: "No prescription is needed. However, you will complete a medical screening with one of our providers before treatment.",
  },
];

export default function TreatmentDetail() {
  const [, params] = useRoute("/treatment/:slug");
  const treatmentSlug = params?.slug;
  const [selectedAddOns, setSelectedAddOns] = useState<Set<string>>(new Set());

  const { data: treatments, isLoading } = useQuery<Treatment[]>({
    queryKey: ["/api/treatments"],
  });

  const treatment = treatments?.find((t) => t.slug === treatmentSlug);
  const relatedTreatments = treatments?.filter(
    (t) => t.slug !== treatmentSlug && t.categoryId === treatment?.categoryId
  )?.slice(0, 3);

  if (isLoading) {
    return (
      <div className="min-h-screen py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <Skeleton className="h-10 w-32 mb-8" />
          <Skeleton className="h-12 w-96 mb-4" />
          <Skeleton className="h-6 w-64 mb-8" />
          <Skeleton className="h-64 w-full mb-8" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    );
  }

  if (!treatment) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-serif text-2xl font-bold mb-4">Treatment not found</h2>
          <Button asChild>
            <Link href="/treatments">Browse All Treatments</Link>
          </Button>
        </div>
      </div>
    );
  }

  const formattedPrice = (treatment.price / 100).toFixed(0);
  const ingredients = ingredientMap[treatment.slug] || [];
  const bestFor = bestForMap[treatment.slug];
  const reviews = reviewMap[treatment.slug];
  const memberPrice = memberPriceMap[treatment.slug];
  const memberFormatted = memberPrice ? (memberPrice / 100).toFixed(0) : null;
  const savings = memberPrice ? treatment.price - memberPrice : 0;
  const savingsFormatted = (savings / 100).toFixed(0);
  const savingsPercent = memberPrice ? Math.round((savings / treatment.price) * 100) : 0;
  const specificReviews = treatmentReviews[treatment.slug] || [];
  const formattedDuration = treatment.duration >= 60 
    ? `${Math.floor(treatment.duration / 60)}-${Math.floor(treatment.duration / 60) + 1} hours`
    : `${treatment.duration} minutes`;

  const addOnTotal = Array.from(selectedAddOns).reduce((sum, id) => {
    const addon = addOns.find(a => a.id === id);
    return sum + (addon?.price || 0);
  }, 0);
  const totalPrice = treatment.price + addOnTotal;
  const totalFormatted = (totalPrice / 100).toFixed(0);

  const toggleAddOn = (id: string) => {
    setSelectedAddOns(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <Button 
          variant="ghost" 
          className="mb-8" 
          asChild
          data-testid="button-back"
        >
          <Link href="/treatments">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Treatments
          </Link>
        </Button>

        <div className="space-y-8">
          {/* Header */}
          <div>
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <Badge variant="secondary" className="text-xs font-normal no-default-hover-elevate no-default-active-elevate">
                <Shield className="w-3 h-3 mr-1" />
                Licensed RN Administered
              </Badge>
              <Badge variant="outline" className="text-xs font-medium border-primary/30 text-primary no-default-hover-elevate no-default-active-elevate" data-testid="badge-hsa-fsa">
                HSA/FSA Eligible
              </Badge>
              {bestFor && (
                <Badge variant="outline" className={`text-xs font-medium no-default-hover-elevate no-default-active-elevate ${bestFor.color}`} data-testid="badge-bestfor">
                  {bestFor.label}
                </Badge>
              )}
            </div>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4" data-testid="text-treatment-name">
              {treatment.name}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
              <div className="flex items-center gap-2" data-testid="text-price">
                <DollarSign className="w-5 h-5" />
                <span className="text-2xl font-bold text-foreground">${formattedPrice}</span>
              </div>
              {memberFormatted && (
                <div className="flex items-center gap-2" data-testid="text-member-price">
                  <span className="text-xl font-bold text-primary">${memberFormatted}</span>
                  <Badge variant="outline" className="text-[10px] font-semibold border-emerald-500/30 bg-emerald-500/10 text-emerald-400 no-default-hover-elevate no-default-active-elevate">
                    Save ${savingsFormatted} ({savingsPercent}%)
                  </Badge>
                </div>
              )}
              <div className="flex items-center gap-2" data-testid="text-duration">
                <Clock className="w-5 h-5" />
                <span className="text-lg">{formattedDuration}</span>
              </div>
              {reviews && (
                <div className="flex items-center gap-1.5" data-testid="text-rating">
                  <div className="flex">
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-sm font-semibold">{reviews.rating}</span>
                  <span className="text-xs">({reviews.count.toLocaleString()} reviews)</span>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {treatment.description}
            </p>
          </div>

          {/* Evidence-based positioning */}
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-5" data-testid="section-evidence">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <FlaskConical className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm mb-1">Why IV Therapy?</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    IV therapy delivers 100% bioavailability — compared to just 20-50% with oral supplements. 
                    Physician-formulated and clinically dosed by Dr. Jon Snipes, MD, our treatments are designed 
                    for maximum absorption and rapid results.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ingredients */}
          {ingredients.length > 0 && (
            <div data-testid="section-ingredients">
              <h2 className="text-xl font-semibold mb-3">What's Included</h2>
              <div className="flex flex-wrap gap-2">
                {ingredients.map((ingredient) => (
                  <Badge key={ingredient} variant="secondary" className="text-sm px-3 py-1 no-default-hover-elevate no-default-active-elevate">
                    {ingredient}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Benefits */}
          <div>
            <h2 className="text-xl font-semibold mb-3">Benefits</h2>
            <ul className="space-y-3">
              {treatment.benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-3" data-testid={`benefit-${index}`}>
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                    <Check className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-muted-foreground">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Add-Ons */}
          <div data-testid="section-addons">
            <h2 className="text-xl font-semibold mb-1">Enhance Your Treatment</h2>
            <p className="text-sm text-muted-foreground mb-4">Add a vitamin boost to take your treatment further.</p>
            <div className="grid sm:grid-cols-2 gap-3">
              {addOns.map((addon) => {
                const isSelected = selectedAddOns.has(addon.id);
                return (
                  <button
                    key={addon.id}
                    onClick={() => toggleAddOn(addon.id)}
                    className={`flex items-center gap-3 p-3 rounded-md border text-left transition-colors ${
                      isSelected 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border'
                    }`}
                    data-testid={`addon-${addon.id}`}
                  >
                    <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 ${
                      isSelected ? 'border-primary bg-primary' : 'border-muted-foreground/30'
                    }`}>
                      {isSelected && <Check className="w-3 h-3 text-primary-foreground" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{addon.name}</p>
                      <p className="text-xs text-muted-foreground">{addon.description}</p>
                    </div>
                    <span className="text-sm font-semibold text-primary whitespace-nowrap">
                      +${(addon.price / 100).toFixed(0)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* How It Works mini */}
          <Card className="bg-accent/30">
            <CardContent className="p-6" data-testid="section-how-it-works">
              <h2 className="text-xl font-semibold mb-4">How It Works</h2>
              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  { icon: Search, step: "1", title: "Book", desc: "Choose your date, time & location" },
                  { icon: Stethoscope, step: "2", title: "Relax", desc: "A licensed RN arrives at your door" },
                  { icon: CheckCircle2, step: "3", title: "Feel Better", desc: `Treatment takes ~${formattedDuration}` },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.step} className="flex items-start gap-3">
                      <div className="relative flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-primary" />
                        <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                          {item.step}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-foreground text-sm">{item.title}</p>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Treatment-specific reviews */}
          {specificReviews.length > 0 && (
            <div data-testid="section-reviews">
              <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <h2 className="text-xl font-semibold">What Clients Say</h2>
                {reviews && (
                  <div className="flex items-center gap-1.5">
                    <div className="flex">
                      {[1,2,3,4,5].map(i => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="text-sm font-semibold">{reviews.rating}</span>
                    <span className="text-xs text-muted-foreground">({reviews.count.toLocaleString()} reviews)</span>
                  </div>
                )}
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                {specificReviews.slice(0, 3).map((review, idx) => (
                  <Card key={idx} className="h-full" data-testid={`review-${idx}`}>
                    <CardContent className="p-4 flex flex-col h-full">
                      <div className="flex mb-2">
                        {Array.from({length: review.rating}).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-3">
                        "{review.text}"
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-xs font-semibold text-primary">{review.name[0]}</span>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-foreground">{review.name}</p>
                          <p className="text-[10px] text-muted-foreground">{review.city}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Membership upsell */}
          {memberFormatted && (
            <Card className="border-primary/20 bg-primary/5" data-testid="section-membership-upsell">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Save with a Membership</h3>
                    <p className="text-sm text-muted-foreground">
                      Get this treatment for <span className="font-bold text-primary">${memberFormatted}</span> instead of ${formattedPrice} — save ${savingsFormatted} ({savingsPercent}%) per session.
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Cancel anytime. HSA/FSA eligible.</p>
                  </div>
                  <Button variant="outline" className="font-semibold uppercase whitespace-nowrap" asChild data-testid="button-join-membership">
                    <Link href="/membership">View Plans</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Trust bar for treatment pages */}
          <div className="flex flex-wrap justify-center gap-6 py-4 text-xs text-muted-foreground" data-testid="section-treatment-trust">
            <span className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-primary" />
              Gentle, painless treatment at home
            </span>
            <span className="flex items-center gap-1.5">
              <Stethoscope className="w-3.5 h-3.5 text-primary" />
              Nurse monitors vitals throughout
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-primary" />
              30-60 minute sessions
            </span>
          </div>

          {/* FAQ */}
          <div data-testid="section-faq">
            <h2 className="text-xl font-semibold mb-3">Common Questions</h2>
            <Accordion type="single" collapsible className="w-full">
              {treatmentFaqs.map((item, idx) => (
                <AccordionItem key={idx} value={`faq-${idx}`} data-testid={`treatment-faq-${idx}`}>
                  <AccordionTrigger className="text-left text-sm">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-sm leading-relaxed">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* Related Treatments */}
          {relatedTreatments && relatedTreatments.length > 0 && (
            <div data-testid="section-related">
              <h2 className="text-xl font-semibold mb-3">Customers Also Booked</h2>
              <div className="grid sm:grid-cols-3 gap-4">
                {relatedTreatments.map((related) => {
                  const relMemberPrice = memberPriceMap[related.slug];
                  return (
                    <Card key={related.id} className="hover-elevate cursor-pointer" data-testid={`related-${related.id}`}>
                      <Link href={`/treatment/${related.slug}`}>
                        <CardContent className="p-4">
                          <p className="font-semibold text-foreground text-sm mb-1">{related.name}</p>
                          <div className="flex items-center gap-2">
                            <span className="text-foreground font-bold">${(related.price / 100).toFixed(0)}</span>
                            {relMemberPrice && (
                              <span className="text-xs text-primary font-semibold">${(relMemberPrice / 100).toFixed(0)} member</span>
                            )}
                          </div>
                        </CardContent>
                      </Link>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* Sticky CTA */}
          <div className="sticky bottom-20 py-4 bg-background border-t z-40">
            <Button 
              size="lg" 
              className="w-full font-semibold uppercase"
              asChild
              data-testid="button-book-now"
            >
              <Link href={`/book/${treatment.slug}/location`}>
                Book Now — ${totalFormatted}
                {addOnTotal > 0 && ` (includes add-ons)`}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
