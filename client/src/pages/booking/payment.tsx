import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { StepIndicator } from "@/components/booking/step-indicator";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import type { Treatment, City, InsertAppointment } from "@shared/schema";
import { ArrowLeft, ArrowRight, CreditCard, Lock, Shield, Star, Stethoscope, Check, Droplets, Package, ChevronDown, ChevronUp, Plus, Minus } from "lucide-react";
import { Link } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { memberPriceMap, shippedToYouSlugs } from "@/lib/treatment-data";

const paymentSchema = z.object({
  customerName: z.string().min(2, "Name must be at least 2 characters"),
  customerEmail: z.string().email("Invalid email address"),
  customerPhone: z.string().min(10, "Phone number must be at least 10 digits"),
  cardNumber: z.string().optional(),
  expiryDate: z.string().optional(),
  cvv: z.string().optional(),
});

type PaymentForm = z.infer<typeof paymentSchema>;

export default function BookingPayment() {
  const [, params] = useRoute("/book/:treatmentSlug/payment");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const treatmentSlug = params?.treatmentSlug;
  const [subscribeAndSave, setSubscribeAndSave] = useState(false);
  const [upsellDismissed, setUpsellDismissed] = useState(false);
  const [additionalItems, setAdditionalItems] = useState<Treatment[]>([]);
  const [addMoreOpen, setAddMoreOpen] = useState(false);

  const [locationData, setLocationData] = useState<any>(null);
  const [scheduleData, setScheduleData] = useState<any>(null);
  const [shippingPlan, setShippingPlan] = useState<any>(null);
  const [contactData, setContactData] = useState<any>(null);
  const [dataLoaded, setDataLoaded] = useState(false);

  const isShipped = treatmentSlug ? shippedToYouSlugs.has(treatmentSlug) : false;

  const { data: treatments, isLoading: treatmentsLoading } = useQuery<Treatment[]>({
    queryKey: ["/api/treatments"],
  });

  const { data: cities } = useQuery<City[]>({
    queryKey: ["/api/cities"],
  });

  const treatment = treatments?.find((t) => t.slug === treatmentSlug);

  useEffect(() => {
    // Always clear any stale add-on data from a previous checkout
    sessionStorage.removeItem("additionalShippedItems");
    // Reset add-on UI state to empty for this fresh checkout
    setAdditionalItems([]);

    const location = sessionStorage.getItem("bookingLocation");

    if (!location) {
      setLocation(`/book/${treatmentSlug}/location`);
      return;
    }

    setLocationData(JSON.parse(location));

    // Load pre-captured contact info from step 1
    const contact = sessionStorage.getItem("bookingContact");
    if (contact) {
      const parsed = JSON.parse(contact);
      setContactData(parsed);
      form.reset({
        customerName: parsed.customerName || "",
        customerEmail: parsed.customerEmail || "",
        customerPhone: parsed.customerPhone || "",
        cardNumber: "",
        expiryDate: "",
        cvv: "",
      });
    }

    if (isShipped) {
      const plan = sessionStorage.getItem("shippingPlan");
      if (plan) setShippingPlan(JSON.parse(plan));
      setDataLoaded(true);
    } else {
      const schedule = sessionStorage.getItem("bookingSchedule");
      if (!schedule) {
        setLocation(`/book/${treatmentSlug}/schedule`);
        return;
      }
      setScheduleData(JSON.parse(schedule));
      setDataLoaded(true);
    }
  }, [treatmentSlug, setLocation, isShipped]);

  const createAppointmentMutation = useMutation({
    mutationFn: async (data: InsertAppointment) => {
      const response = await apiRequest("POST", "/api/appointments", data);
      return await response.json();
    },
    onSuccess: (data) => {
      sessionStorage.setItem("appointmentId", data.id);
      sessionStorage.removeItem("bookingLocation");
      sessionStorage.removeItem("bookingSchedule");
      sessionStorage.removeItem("shippingPlan");
      sessionStorage.removeItem("bookingContact");
      sessionStorage.removeItem("treatmentSlug");
      // additionalShippedItems is intentionally NOT removed here so confirmation page can read it
      setLocation("/booking/confirmation");
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Booking failed",
        description: "There was an error processing your booking. Please try again.",
      });
    },
  });

  const form = useForm<PaymentForm>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      cardNumber: "",
      expiryDate: "",
      cvv: "",
    },
  });

  const toggleAddOn = (t: Treatment) => {
    setAdditionalItems(prev => {
      const exists = prev.find(i => i.id === t.id);
      const updated = exists ? prev.filter(i => i.id !== t.id) : [...prev, t];
      sessionStorage.setItem(
        "additionalShippedItems",
        JSON.stringify(updated.map(i => ({ id: i.id, slug: i.slug, name: i.name, price: i.price })))
      );
      return updated;
    });
  };

  const onSubmit = (data: PaymentForm) => {
    if (!treatment || !locationData) return;

    const addOnTotal = additionalItems.reduce((sum, i) => sum + i.price, 0);

    let finalPrice: number;
    if (isShipped && shippingPlan) {
      finalPrice = shippingPlan.pricePerMonth + addOnTotal;
    } else if (subscribeAndSave && memberPriceMap[treatment.slug]) {
      finalPrice = memberPriceMap[treatment.slug] + addOnTotal;
    } else {
      finalPrice = treatment.price + addOnTotal;
    }

    const appointmentData: InsertAppointment = {
      treatmentId: treatment.id,
      cityId: selectedCity?.id || locationData.cityName || "",
      streetAddress: locationData.streetAddress,
      aptSuite: locationData.aptSuite || null,
      specialInstructions: locationData.specialInstructions || null,
      appointmentDate: isShipped ? new Date().toISOString().split('T')[0] : scheduleData?.date,
      appointmentTime: isShipped ? "Ship ASAP" : scheduleData?.time,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone,
      totalPrice: finalPrice,
    };

    createAppointmentMutation.mutate(appointmentData);
  };

  const stepsIV = [
    { id: "location", name: "Location", status: "complete" as const },
    { id: "schedule", name: "Schedule", status: "complete" as const },
    { id: "payment", name: "Payment", status: "current" as const },
  ];

  const stepsShipped = [
    { id: "location", name: "Address", status: "complete" as const },
    { id: "payment", name: "Payment", status: "current" as const },
  ];

  if (treatmentsLoading || !dataLoaded) {
    return (
      <div className="min-h-screen py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <Skeleton className="h-12 w-full mb-8" />
          <Skeleton className="h-96 w-full" />
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
            <Link href="/treatments">Browse Treatments</Link>
          </Button>
        </div>
      </div>
    );
  }

  const selectedCity = cities?.find((c) => c.id === locationData?.cityId);
  const memberPrice = memberPriceMap[treatment.slug];
  const regularPrice = (treatment.price / 100).toFixed(2);
  const memberPriceFormatted = memberPrice ? (memberPrice / 100).toFixed(2) : null;
  const savings = memberPrice ? ((treatment.price - memberPrice) / 100).toFixed(0) : "0";
  const displayPrice = isShipped
    ? `$${(shippingPlan?.pricePerMonth / 100 || treatment.price / 100).toFixed(2)}/mo`
    : subscribeAndSave && memberPriceFormatted
      ? memberPriceFormatted
      : regularPrice;

  // Shipped-only: other shipped products available to add
  const availableAddOns = (treatments ?? []).filter(
    t => shippedToYouSlugs.has(t.slug) && t.slug !== treatmentSlug
  );

  // Live total including add-ons
  const primaryPrice = isShipped && shippingPlan
    ? shippingPlan.pricePerMonth
    : subscribeAndSave && memberPrice
      ? memberPrice
      : treatment.price;
  const addOnTotal = additionalItems.reduce((sum, i) => sum + i.price, 0);
  const grandTotal = primaryPrice + addOnTotal;

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <Button
          variant="ghost"
          className="mb-6"
          asChild
          data-testid="button-back"
        >
          <Link href={isShipped ? `/book/${treatmentSlug}/location` : `/book/${treatmentSlug}/schedule`}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            {isShipped ? "Back to Address" : "Back to Schedule"}
          </Link>
        </Button>

        <StepIndicator steps={isShipped ? stepsShipped : stepsIV} />

        <div className="mt-8 max-w-2xl mx-auto space-y-6">
          {/* Membership Upsell — IV only */}
          {!isShipped && memberPrice && !subscribeAndSave && !upsellDismissed && (
            <Card className="border-primary/20 overflow-hidden" data-testid="card-membership-upsell">
              <div className="bg-primary/5 border-b border-primary/10 px-4 py-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                  <Droplets className="w-4 h-4 text-primary-foreground" />
                </div>
                <p className="text-sm font-semibold">
                  You'd <span className="text-primary">save ${savings} today</span> with a membership
                </p>
              </div>
              <CardContent className="p-4 space-y-4">
                <div className="grid grid-cols-[1fr_auto_1fr] gap-2 items-center">
                  <div className="text-center p-3 rounded-md bg-muted/50 border">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-1">Single session</p>
                    <p className="text-xl font-bold text-muted-foreground line-through decoration-red-400">${regularPrice}</p>
                    <p className="text-[10px] text-muted-foreground">One-time price</p>
                  </div>
                  <div className="text-primary text-xl font-bold px-1">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                  <div className="text-center p-3 rounded-md border-2 border-primary bg-primary/5">
                    <p className="text-[10px] uppercase tracking-wider text-primary font-semibold mb-1">As a member</p>
                    <p className="text-xl font-bold text-foreground">${memberPriceFormatted}</p>
                    <p className="text-[10px] text-primary font-semibold">Save ${savings}/session</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5"><Check className="w-3 h-3 text-primary flex-shrink-0" /> Priority scheduling</div>
                  <div className="flex items-center gap-1.5"><Check className="w-3 h-3 text-primary flex-shrink-0" /> Free delivery always</div>
                  <div className="flex items-center gap-1.5"><Check className="w-3 h-3 text-primary flex-shrink-0" /> 10-20% off boosters</div>
                  <div className="flex items-center gap-1.5"><Check className="w-3 h-3 text-primary flex-shrink-0" /> 3-month minimum</div>
                </div>
                <div className="flex gap-2">
                  <Button className="flex-1 font-semibold uppercase text-xs" onClick={() => setSubscribeAndSave(true)} data-testid="button-switch-membership">
                    Switch to Membership
                  </Button>
                  <Button variant="outline" className="text-xs" onClick={() => setUpsellDismissed(true)} data-testid="button-dismiss-upsell">
                    No thanks
                  </Button>
                </div>
                <p className="text-center text-[10px] text-muted-foreground">3-month minimum · First session today</p>
              </CardContent>
            </Card>
          )}

          {/* Mini upsell reminder */}
          {!isShipped && memberPrice && !subscribeAndSave && upsellDismissed && (
            <button
              className="w-full flex items-center justify-between p-3 rounded-md border text-left hover-elevate transition-colors"
              onClick={() => setUpsellDismissed(false)}
              data-testid="button-restore-upsell"
            >
              <span className="text-sm text-muted-foreground">
                Members save <span className="text-primary font-semibold">${savings}+</span> on this session
              </span>
              <span className="text-xs text-primary font-semibold whitespace-nowrap ml-2">See offer</span>
            </button>
          )}

          {/* Membership applied — IV only */}
          {!isShipped && memberPrice && subscribeAndSave && (
            <Card className="border-primary bg-primary/5" data-testid="card-subscribe-save">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-md border-2 border-primary bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <p className="font-semibold text-foreground text-sm">Membership Applied</p>
                      <Badge variant="outline" className="text-[10px] font-semibold border-emerald-500/30 bg-emerald-500/10 text-emerald-400 no-default-hover-elevate no-default-active-elevate">
                        Saving ${savings}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Paying <span className="font-semibold text-primary">${memberPriceFormatted}</span> instead of ${regularPrice}. Free delivery included.
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" className="text-xs text-muted-foreground" onClick={() => setSubscribeAndSave(false)} data-testid="button-remove-membership">
                    Remove
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Shipping plan badge — shipped only */}
          {isShipped && shippingPlan && (
            <Card className="border-primary/30 bg-primary/5" data-testid="card-shipping-plan">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0">
                    <Package className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-foreground text-sm">{shippingPlan.planLabel}</p>
                      {shippingPlan.savingsPercent > 0 && (
                        <Badge variant="outline" className="text-[10px] font-semibold border-emerald-500/30 bg-emerald-500/10 text-emerald-400 no-default-hover-elevate no-default-active-elevate">
                          Save {shippingPlan.savingsPercent}%
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{shippingPlan.billingNote}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-foreground">${(shippingPlan.pricePerMonth / 100).toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">/month</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Order Summary */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold text-foreground text-base mb-3">
                {isShipped ? "Order Summary" : "Booking Summary"}
              </h3>
              <div className="space-y-2 text-sm">
                {/* Ship-to / Location row */}
                <div className="flex justify-between gap-2">
                  <span className="text-muted-foreground">
                    {isShipped ? "Ship to" : "Location"}
                  </span>
                  <span className="font-medium text-foreground text-right" data-testid="text-summary-location">
                    {locationData?.streetAddress}{locationData?.aptSuite && `, ${locationData.aptSuite}`}
                    {selectedCity && `, ${selectedCity.name}`}
                  </span>
                </div>

                {/* Schedule row (IV only) */}
                {scheduleData && (
                  <div className="flex justify-between gap-2">
                    <span className="text-muted-foreground">Date & Time</span>
                    <span className="font-medium text-foreground text-right" data-testid="text-summary-datetime">
                      {new Date(scheduleData.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}, {scheduleData.time}
                    </span>
                  </div>
                )}

                {/* Plan row (shipped only) */}
                {isShipped && shippingPlan && (
                  <div className="flex justify-between gap-2">
                    <span className="text-muted-foreground">Plan</span>
                    <span className="font-medium text-foreground text-right" data-testid="text-summary-plan">
                      {shippingPlan.planLabel}
                    </span>
                  </div>
                )}

                <Separator className="my-2" />

                {/* Primary product line */}
                <div className="flex justify-between gap-2">
                  <span className="text-foreground font-medium" data-testid="text-summary-treatment">{treatment.name}</span>
                  <span className="font-medium text-foreground text-right">
                    {isShipped && shippingPlan
                      ? `$${(shippingPlan.pricePerMonth / 100).toFixed(2)}/mo`
                      : subscribeAndSave && memberPriceFormatted
                        ? `$${memberPriceFormatted}`
                        : `$${regularPrice}`
                    }
                  </span>
                </div>

                {/* Add-on line items */}
                {additionalItems.map(item => (
                  <div key={item.id} className="flex justify-between gap-2" data-testid={`text-addon-${item.slug}`}>
                    <span className="text-foreground font-medium">{item.name}</span>
                    <span className="font-medium text-foreground">${(item.price / 100).toFixed(2)}</span>
                  </div>
                ))}

                <Separator className="my-2" />

                {/* Grand total */}
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground">
                    {isShipped ? "Total" : "Total"}
                  </span>
                  <div className="text-right">
                    {!isShipped && subscribeAndSave && memberPriceFormatted && addOnTotal === 0 ? (
                      <>
                        <span className="text-xs line-through text-muted-foreground mr-2">${regularPrice}</span>
                        <span className="text-xl font-bold text-primary" data-testid="text-summary-total">${memberPriceFormatted}</span>
                      </>
                    ) : (
                      <span className="text-xl font-bold text-primary" data-testid="text-summary-total">
                        ${(grandTotal / 100).toFixed(2)}
                        {isShipped && shippingPlan && addOnTotal === 0 && "/mo"}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Add More Products — shipped orders only */}
          {isShipped && availableAddOns.length > 0 && (
            <Card data-testid="card-add-more-products">
              <button
                type="button"
                className="w-full flex items-center justify-between p-4 text-left"
                onClick={() => setAddMoreOpen(o => !o)}
                data-testid="button-toggle-add-more"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Plus className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">Add More Products</p>
                    <p className="text-xs text-muted-foreground">
                      {additionalItems.length > 0
                        ? `${additionalItems.length} product${additionalItems.length > 1 ? "s" : ""} added to this shipment`
                        : "Bundle additional shipped products in one order"}
                    </p>
                  </div>
                </div>
                {addMoreOpen
                  ? <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  : <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                }
              </button>

              {addMoreOpen && (
                <CardContent className="px-4 pb-4 pt-0 space-y-2">
                  <Separator className="mb-3" />
                  {availableAddOns.map(addon => {
                    const selected = !!additionalItems.find(i => i.id === addon.id);
                    return (
                      <div
                        key={addon.id}
                        className={`flex items-center justify-between gap-3 p-3 rounded-md border transition-colors ${
                          selected ? "border-primary bg-primary/5" : "border-border bg-card"
                        }`}
                        data-testid={`row-addon-${addon.slug}`}
                      >
                        <div className="flex-1 min-w-0">
                          <p className={`font-medium text-sm truncate ${selected ? "text-primary" : "text-foreground"}`}>
                            {addon.name}
                          </p>
                          <p className="text-xs text-muted-foreground">${(addon.price / 100).toFixed(2)}</p>
                        </div>
                        <Button
                          type="button"
                          size="sm"
                          variant={selected ? "default" : "outline"}
                          className="text-xs font-semibold flex-shrink-0"
                          onClick={() => toggleAddOn(addon)}
                          data-testid={`button-addon-${addon.slug}`}
                        >
                          {selected ? (
                            <><Minus className="w-3 h-3 mr-1" />Remove</>
                          ) : (
                            <><Plus className="w-3 h-3 mr-1" />Add</>
                          )}
                        </Button>
                      </div>
                    );
                  })}
                </CardContent>
              )}
            </Card>
          )}

          {/* Payment Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Payment Details</CardTitle>
              <CardDescription>
                {isShipped ? "Complete your order" : "Complete your booking information"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-foreground">Contact Information</h3>

                    <FormField
                      control={form.control}
                      name="customerName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} data-testid="input-customer-name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="customerEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="john@example.com" {...field} data-testid="input-customer-email" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="customerPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input type="tel" placeholder="(555) 123-4567" {...field} data-testid="input-customer-phone" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="font-semibold text-foreground flex items-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      Card Information (Demo)
                    </h3>

                    <FormField
                      control={form.control}
                      name="cardNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Card Number</FormLabel>
                          <FormControl>
                            <Input placeholder="1234 5678 9012 3456" maxLength={16} {...field} data-testid="input-card-number" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="expiryDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Expiry Date</FormLabel>
                            <FormControl>
                              <Input placeholder="MM/YY" maxLength={5} {...field} data-testid="input-expiry-date" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="cvv"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>CVV</FormLabel>
                            <FormControl>
                              <Input placeholder="123" maxLength={4} {...field} data-testid="input-cvv" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Lock className="w-4 h-4" />
                    <span>Secure checkout — Your payment information is encrypted</span>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full font-semibold uppercase"
                    disabled={createAppointmentMutation.isPending}
                    data-testid="button-confirm-booking"
                  >
                    {createAppointmentMutation.isPending
                      ? "Processing..."
                      : isShipped
                        ? `Place Order — $${(grandTotal / 100).toFixed(2)}`
                        : `Confirm Booking — $${displayPrice}`
                    }
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Trust bar */}
          <div className="flex flex-wrap justify-center gap-4 text-xs text-muted-foreground" data-testid="section-checkout-trust">
            <span className="flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-primary" />
              256-bit SSL Encrypted
            </span>
            <span className="flex items-center gap-1">
              <Stethoscope className="w-3.5 h-3.5 text-primary" />
              Licensed ER/ICU Nurses
            </span>
            <span className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              4.9 Stars (100K+ treatments)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
