import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { StepIndicator } from "@/components/booking/step-indicator";
import { SelectedTreatmentBanner } from "@/components/booking/selected-treatment-banner";
import { Skeleton } from "@/components/ui/skeleton";
import type { Treatment } from "@shared/schema";
import { ArrowLeft, MapPin, CheckCircle2, Pencil } from "lucide-react";
import { Link } from "wouter";
import { shippedToYouSlugs } from "@/lib/treatment-data";

interface RebookData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  streetAddress: string;
  aptSuite: string;
  cityName: string;
}

const locationSchema = z.object({
  customerName: z.string().min(2, "Please enter your full name"),
  dateOfBirth: z.string()
    .min(1, "Please enter your date of birth")
    .refine((val) => {
      const dob = new Date(val);
      if (isNaN(dob.getTime())) return false;
      const age = (Date.now() - dob.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
      return age >= 18;
    }, "You must be 18 or older to book a treatment"),
  customerEmail: z.string().email("Please enter a valid email address"),
  customerPhone: z.string().min(10, "Please enter a valid phone number"),
  cityName: z.string().min(2, "Please enter your city name"),
  streetAddress: z.string().min(5, "Please enter your street address"),
  aptSuite: z.string().optional(),
  specialInstructions: z.string().optional(),
});

type LocationForm = z.infer<typeof locationSchema>;

export default function BookingLocation() {
  const [, params] = useRoute("/book/:treatmentSlug/location");
  const [, setLocation] = useLocation();
  const treatmentSlug = params?.treatmentSlug;
  const isShipped = treatmentSlug ? shippedToYouSlugs.has(treatmentSlug) : false;

  const { data: treatments, isLoading: treatmentsLoading } = useQuery<Treatment[]>({
    queryKey: ["/api/treatments"],
  });

  const treatment = treatments?.find((t) => t.slug === treatmentSlug);

  // Read rebook data (set by confirmation page "Rebook" button) once on mount
  const [rebookData] = useState<RebookData | null>(() => {
    try {
      const raw = sessionStorage.getItem("bookingRebook");
      if (raw) {
        sessionStorage.removeItem("bookingRebook");
        return JSON.parse(raw) as RebookData;
      }
    } catch { /* ignore */ }
    return null;
  });

  // Show the "use previous details" banner when rebook data is present
  const [showRebookBanner, setShowRebookBanner] = useState(!!rebookData);

  // Pre-fill from rebook data first, then fall back to saved contact
  const saved = (() => {
    try {
      const raw = sessionStorage.getItem("bookingContact");
      return raw ? JSON.parse(raw) : {};
    } catch { return {}; }
  })();

  const form = useForm<LocationForm>({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      customerName: rebookData?.customerName || saved.customerName || "",
      dateOfBirth: saved.dateOfBirth || "",
      customerEmail: rebookData?.customerEmail || saved.customerEmail || "",
      customerPhone: rebookData?.customerPhone || saved.customerPhone || "",
      cityName: rebookData?.cityName || "",
      streetAddress: rebookData?.streetAddress || "",
      aptSuite: rebookData?.aptSuite || "",
      specialInstructions: "",
    },
  });

  // Save contact info to sessionStorage as soon as all three contact fields have values,
  // so partial data is captured even if the user abandons before submitting.
  const watchName = form.watch("customerName");
  const watchEmail = form.watch("customerEmail");
  const watchPhone = form.watch("customerPhone");

  const saveContactIfPresent = () => {
    const name = form.getValues("customerName");
    const dob = form.getValues("dateOfBirth");
    const email = form.getValues("customerEmail");
    const phone = form.getValues("customerPhone");
    if (name || email || phone) {
      sessionStorage.setItem("bookingContact", JSON.stringify({ customerName: name, dateOfBirth: dob, customerEmail: email, customerPhone: phone }));
    }
  };

  const onSubmit = (data: LocationForm) => {
    const { customerName, dateOfBirth, customerEmail, customerPhone, ...locationFields } = data;

    // Persist contact data separately so payment page can pre-fill
    sessionStorage.setItem("bookingContact", JSON.stringify({ customerName, dateOfBirth, customerEmail, customerPhone }));
    sessionStorage.setItem("bookingLocation", JSON.stringify(locationFields));
    sessionStorage.setItem("treatmentSlug", treatmentSlug || "");

    if (isShipped) {
      setLocation(`/book/${treatmentSlug}/payment`);
    } else {
      setLocation(`/book/${treatmentSlug}/schedule`);
    }
  };

  const stepsIV = [
    { id: "location", name: "Location", status: "current" as const },
    { id: "schedule", name: "Schedule", status: "upcoming" as const },
    { id: "payment", name: "Payment", status: "upcoming" as const },
  ];

  const stepsShipped = [
    { id: "location", name: "Address", status: "current" as const },
    { id: "payment", name: "Payment", status: "upcoming" as const },
  ];

  if (treatmentsLoading) {
    return (
      <div className="min-h-screen py-12">
        <div className="container mx-auto px-4 max-w-3xl">
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

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <Button
          variant="ghost"
          className="mb-6"
          asChild
          data-testid="button-back"
        >
          <Link href={`/treatment/${treatmentSlug}`}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Treatment
          </Link>
        </Button>

        <StepIndicator steps={isShipped ? stepsShipped : stepsIV} />

        <SelectedTreatmentBanner treatment={treatment} />

        {/* Rebook banner — shown when returning from confirmation with saved details */}
        {showRebookBanner && rebookData && (
          <Card className="mt-6 border-primary/30 bg-primary/5" data-testid="rebook-banner">
            <CardContent className="p-5">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground text-sm mb-0.5">Use your previous details?</p>
                  <p className="text-sm text-muted-foreground">{rebookData.customerName} &middot; {rebookData.customerEmail}</p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {rebookData.streetAddress}{rebookData.aptSuite ? `, ${rebookData.aptSuite}` : ""}{rebookData.cityName ? `, ${rebookData.cityName}` : ""}
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  size="default"
                  className="flex-1 font-semibold uppercase"
                  onClick={() => form.handleSubmit(onSubmit)()}
                  data-testid="button-rebook-confirm"
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  {isShipped ? "Ship to This Address" : "Yes, Use This Address"}
                </Button>
                <Button
                  size="default"
                  variant="outline"
                  className="font-semibold uppercase"
                  onClick={() => setShowRebookBanner(false)}
                  data-testid="button-rebook-change"
                >
                  <Pencil className="w-4 h-4 mr-2" />
                  Change
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className={`${showRebookBanner && rebookData ? "mt-4 hidden" : "mt-6"}`}>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                {isShipped ? "Shipping Details" : "Your Details"}
              </CardTitle>
              <CardDescription>
                {isShipped
                  ? `Where should we ship your ${treatment.name}?`
                  : `Tell us about yourself and where you'd like your ${treatment.name} delivered.`
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                  {/* Contact info */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-foreground text-sm uppercase tracking-wider text-muted-foreground">
                      Contact Information
                    </h3>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="customerName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Jane Doe"
                                {...field}
                                onBlur={(e) => { field.onBlur(); saveContactIfPresent(); }}
                                data-testid="input-customer-name"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="dateOfBirth"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Date of Birth</FormLabel>
                            <FormControl>
                              <Input
                                type="date"
                                max={new Date(Date.now() - 18 * 365.25 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]}
                                {...field}
                                onBlur={(e) => { field.onBlur(); saveContactIfPresent(); }}
                                data-testid="input-date-of-birth"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="customerEmail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="jane@example.com"
                                {...field}
                                onBlur={(e) => { field.onBlur(); saveContactIfPresent(); }}
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
                                onBlur={(e) => { field.onBlur(); saveContactIfPresent(); }}
                                data-testid="input-customer-phone"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Address info */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-foreground text-sm uppercase tracking-wider text-muted-foreground">
                      {isShipped ? "Shipping Address" : "Service Address"}
                    </h3>

                    <FormField
                      control={form.control}
                      name="cityName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your city"
                              {...field}
                              data-testid="input-city"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="streetAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Street Address</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="123 Main Street"
                              {...field}
                              data-testid="input-street-address"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="aptSuite"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Apartment / Suite (Optional)</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Apt 4B"
                              {...field}
                              data-testid="input-apt-suite"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {!isShipped && (
                      <FormField
                        control={form.control}
                        name="specialInstructions"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Special Instructions (Optional)</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Gate code, parking instructions, etc."
                                className="resize-none"
                                rows={3}
                                {...field}
                                data-testid="input-special-instructions"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full h-12 font-semibold uppercase"
                    data-testid="button-continue"
                  >
                    {isShipped ? "Continue to Payment" : "Continue to Schedule"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
