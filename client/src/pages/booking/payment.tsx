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
import { ArrowLeft, ArrowRight, CreditCard, Lock, Shield, Star, Stethoscope, Check, Droplets } from "lucide-react";
import { Link } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { memberPriceMap } from "@/lib/treatment-data";

const paymentSchema = z.object({
  customerName: z.string().min(2, "Name must be at least 2 characters"),
  customerEmail: z.string().email("Invalid email address"),
  customerPhone: z.string().min(10, "Phone number must be at least 10 digits"),
  cardNumber: z.string().regex(/^\d{16}$/, "Card number must be 16 digits"),
  expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Format: MM/YY"),
  cvv: z.string().regex(/^\d{3,4}$/, "CVV must be 3 or 4 digits"),
});

type PaymentForm = z.infer<typeof paymentSchema>;

export default function BookingPayment() {
  const [, params] = useRoute("/book/:treatmentSlug/payment");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const treatmentSlug = params?.treatmentSlug;
  const [subscribeAndSave, setSubscribeAndSave] = useState(false);
  const [upsellDismissed, setUpsellDismissed] = useState(false);

  const [locationData, setLocationData] = useState<any>(null);
  const [scheduleData, setScheduleData] = useState<any>(null);

  const { data: treatments, isLoading: treatmentsLoading } = useQuery<Treatment[]>({
    queryKey: ["/api/treatments"],
  });

  const { data: cities } = useQuery<City[]>({
    queryKey: ["/api/cities"],
  });

  const treatment = treatments?.find((t) => t.slug === treatmentSlug);

  useEffect(() => {
    const location = sessionStorage.getItem("bookingLocation");
    const schedule = sessionStorage.getItem("bookingSchedule");
    
    if (!location || !schedule) {
      setLocation(`/book/${treatmentSlug}/location`);
      return;
    }
    
    setLocationData(JSON.parse(location));
    setScheduleData(JSON.parse(schedule));
  }, [treatmentSlug, setLocation]);

  const createAppointmentMutation = useMutation({
    mutationFn: async (data: InsertAppointment) => {
      const response = await apiRequest("POST", "/api/appointments", data);
      return await response.json();
    },
    onSuccess: (data) => {
      sessionStorage.setItem("appointmentId", data.id);
      sessionStorage.removeItem("bookingLocation");
      sessionStorage.removeItem("bookingSchedule");
      sessionStorage.removeItem("treatmentSlug");
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

  const onSubmit = (data: PaymentForm) => {
    if (!treatment || !locationData || !scheduleData) return;

    const finalPrice = subscribeAndSave && memberPriceMap[treatment.slug] 
      ? memberPriceMap[treatment.slug] 
      : treatment.price;

    const appointmentData: InsertAppointment = {
      treatmentId: treatment.id,
      cityId: locationData.cityId,
      streetAddress: locationData.streetAddress,
      aptSuite: locationData.aptSuite || null,
      specialInstructions: locationData.specialInstructions || null,
      appointmentDate: scheduleData.date,
      appointmentTime: scheduleData.time,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone,
      totalPrice: finalPrice,
    };

    createAppointmentMutation.mutate(appointmentData);
  };

  const steps = [
    { id: "location", name: "Location", status: "complete" as const },
    { id: "schedule", name: "Schedule", status: "complete" as const },
    { id: "payment", name: "Payment", status: "current" as const },
  ];

  if (treatmentsLoading || !locationData || !scheduleData) {
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
          <h2 className="text-2xl font-semibold mb-4">Treatment not found</h2>
          <Button asChild>
            <Link href="/treatments">Browse Treatments</Link>
          </Button>
        </div>
      </div>
    );
  }

  const selectedCity = cities?.find((c) => c.id === locationData.cityId);
  const memberPrice = memberPriceMap[treatment.slug];
  const regularPrice = (treatment.price / 100).toFixed(2);
  const memberPriceFormatted = memberPrice ? (memberPrice / 100).toFixed(2) : null;
  const savings = memberPrice ? ((treatment.price - memberPrice) / 100).toFixed(0) : "0";
  const displayPrice = subscribeAndSave && memberPriceFormatted ? memberPriceFormatted : regularPrice;

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <Button 
          variant="ghost" 
          className="mb-6" 
          asChild
          data-testid="button-back"
        >
          <Link href={`/book/${treatmentSlug}/schedule`}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Schedule
          </Link>
        </Button>

        <StepIndicator steps={steps} />

        <div className="mt-8 grid lg:grid-cols-2 gap-6">
          {/* Payment Form */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Payment Details</CardTitle>
                <CardDescription>
                  Complete your booking information
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
                              <Input 
                                placeholder="John Doe" 
                                {...field}
                                data-testid="input-customer-name"
                              />
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
                              <Input 
                                type="email"
                                placeholder="john@example.com" 
                                {...field}
                                data-testid="input-customer-email"
                              />
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
                              <Input 
                                type="tel"
                                placeholder="(555) 123-4567" 
                                {...field}
                                data-testid="input-customer-phone"
                              />
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
                              <Input 
                                placeholder="1234 5678 9012 3456" 
                                maxLength={16}
                                {...field}
                                data-testid="input-card-number"
                              />
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
                                <Input 
                                  placeholder="MM/YY" 
                                  maxLength={5}
                                  {...field}
                                  data-testid="input-expiry-date"
                                />
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
                                <Input 
                                  placeholder="123" 
                                  maxLength={4}
                                  {...field}
                                  data-testid="input-cvv"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Lock className="w-4 h-4" />
                      <span>Secure checkout - Your payment information is encrypted</span>
                    </div>

                    <Button 
                      type="submit" 
                      size="lg" 
                      className="w-full font-semibold uppercase"
                      disabled={createAppointmentMutation.isPending}
                      data-testid="button-confirm-booking"
                    >
                      {createAppointmentMutation.isPending ? "Processing..." : `Confirm Booking — $${displayPrice}`}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            {/* Checkout trust bar */}
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

          {/* Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Treatment</h3>
                  <p className="text-muted-foreground" data-testid="text-summary-treatment">{treatment.name}</p>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold text-foreground mb-2">Location</h3>
                  <p className="text-muted-foreground" data-testid="text-summary-location">
                    {locationData.streetAddress}
                    {locationData.aptSuite && `, ${locationData.aptSuite}`}
                    <br />
                    {selectedCity?.name}, {selectedCity?.state}
                  </p>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold text-foreground mb-2">Date & Time</h3>
                  <p className="text-muted-foreground" data-testid="text-summary-datetime">
                    {new Date(scheduleData.date).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                    <br />
                    {scheduleData.time}
                  </p>
                </div>

                <Separator />

                <div className="flex items-center justify-between pt-2">
                  <span className="text-lg font-semibold text-foreground">Total</span>
                  <div className="text-right">
                    {subscribeAndSave && memberPriceFormatted ? (
                      <>
                        <span className="text-sm line-through text-muted-foreground mr-2">${regularPrice}</span>
                        <span className="text-2xl font-bold text-primary" data-testid="text-summary-total">
                          ${memberPriceFormatted}
                        </span>
                      </>
                    ) : (
                      <span className="text-2xl font-bold text-primary" data-testid="text-summary-total">
                        ${regularPrice}
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Membership Upsell Card */}
            {memberPrice && !subscribeAndSave && !upsellDismissed && (
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

                  <div className="bg-muted/50 rounded-md p-3 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">This IV session (member rate)</span>
                      <span className="font-semibold">${memberPriceFormatted}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Mobile delivery fee</span>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground line-through text-xs">$25</span>
                        <span className="text-primary font-semibold text-xs">FREE</span>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex justify-between pt-1">
                      <span className="text-primary font-semibold">Your total savings today</span>
                      <span className="text-primary font-bold">${Number(savings) + 25}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5"><Check className="w-3 h-3 text-primary flex-shrink-0" /> Priority scheduling</div>
                    <div className="flex items-center gap-1.5"><Check className="w-3 h-3 text-primary flex-shrink-0" /> Free delivery always</div>
                    <div className="flex items-center gap-1.5"><Check className="w-3 h-3 text-primary flex-shrink-0" /> 10-20% off boosters</div>
                    <div className="flex items-center gap-1.5"><Check className="w-3 h-3 text-primary flex-shrink-0" /> Cancel anytime</div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      className="flex-1 font-semibold uppercase text-xs"
                      onClick={() => setSubscribeAndSave(true)}
                      data-testid="button-switch-membership"
                    >
                      Switch to Membership
                    </Button>
                    <Button
                      variant="outline"
                      className="text-xs"
                      onClick={() => setUpsellDismissed(true)}
                      data-testid="button-dismiss-upsell"
                    >
                      No thanks
                    </Button>
                  </div>
                  <p className="text-center text-[10px] text-muted-foreground">
                    No contracts · Cancel anytime · First session today
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Mini upsell reminder (after dismiss) */}
            {memberPrice && !subscribeAndSave && upsellDismissed && (
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

            {/* Active membership selection */}
            {memberPrice && subscribeAndSave && (
              <Card 
                className="border-primary bg-primary/5"
                data-testid="card-subscribe-save"
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-md border-2 border-primary bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-primary-foreground" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <p className="font-semibold text-foreground text-sm">Membership Applied</p>
                        <Badge variant="outline" className="text-[10px] font-semibold border-green-300 bg-green-50 text-green-700 no-default-hover-elevate no-default-active-elevate">
                          Saving ${savings}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Paying <span className="font-semibold text-primary">${memberPriceFormatted}</span> instead of ${regularPrice}. Free delivery included.
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs text-muted-foreground"
                      onClick={() => setSubscribeAndSave(false)}
                      data-testid="button-remove-membership"
                    >
                      Remove
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
