import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, Calendar, MapPin, Clock, User, Star, Users, Gift, ArrowRight, Package } from "lucide-react";
import type { Appointment, Treatment, City } from "@shared/schema";
import { Link } from "wouter";
import { shippedToYouSlugs } from "@/lib/treatment-data";

interface AdditionalItem { id: string; slug: string; name: string; price: number; }

export default function BookingConfirmation() {
  const [, setLocation] = useLocation();
  const appointmentId = sessionStorage.getItem("appointmentId");

  // Read additional shipped items once on mount (stored in state so it survives re-renders)
  const [additionalShippedItems] = useState<AdditionalItem[]>(() => {
    try {
      const raw = sessionStorage.getItem("additionalShippedItems");
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  });

  const { data: appointment, isLoading: appointmentLoading, error } = useQuery<Appointment>({
    queryKey: ["/api/appointments", appointmentId],
    enabled: !!appointmentId,
  });

  const { data: treatments } = useQuery<Treatment[]>({
    queryKey: ["/api/treatments"],
  });

  const { data: cities } = useQuery<City[]>({
    queryKey: ["/api/cities"],
  });

  useEffect(() => {
    if (!appointmentId) {
      setLocation("/");
      return;
    }
    // Clear add-ons from session once page mounts
    sessionStorage.removeItem("additionalShippedItems");
  }, [appointmentId, setLocation]);

  if (appointmentLoading) {
    return (
      <div className="min-h-screen py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (error || !appointment) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-serif text-2xl font-bold mb-4">Appointment not found</h2>
          <p className="text-muted-foreground mb-6">
            We couldn't find your appointment details.
          </p>
          <Button asChild>
            <Link href="/treatments">Browse Treatments</Link>
          </Button>
        </div>
      </div>
    );
  }

  const treatment = treatments?.find((t) => t.id === appointment.treatmentId);
  const city = cities?.find((c) => c.id === appointment.cityId);
  const formattedPrice = (appointment.totalPrice / 100).toFixed(2);
  const isShipped = treatment ? shippedToYouSlugs.has(treatment.slug) : false;

  // Only use add-ons for shipped orders; guard against stale sessionStorage for IV bookings
  const safeAddOns = isShipped ? additionalShippedItems : [];
  const addOnTotal = safeAddOns.reduce((s, i) => s + i.price, 0);
  const primaryPrice = appointment.totalPrice - addOnTotal;

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
            <CheckCircle2 className="w-10 h-10 text-primary" data-testid="icon-success" />
          </div>
          <h1 className="font-serif text-4xl font-bold text-foreground mb-2">
            {isShipped ? "Order Confirmed!" : "Booking Confirmed!"}
          </h1>
          <p className="text-lg text-muted-foreground">
            {isShipped
              ? "Your order has been placed and is being prepared for shipment"
              : "Your appointment has been successfully scheduled"}
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl">{isShipped ? "Order Details" : "Appointment Details"}</CardTitle>
            <CardDescription>
              A confirmation email has been sent to {appointment.customerEmail}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Package className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-2">
                  {isShipped ? "Items Ordered" : "Treatment"}
                </h3>
                {/* Primary product */}
                <div className="flex justify-between items-center text-sm" data-testid="text-treatment-name">
                  <p className="text-muted-foreground">{treatment?.name}</p>
                  {isShipped && (
                    <p className="font-medium text-foreground">${(primaryPrice / 100).toFixed(2)}</p>
                  )}
                </div>
                {/* Add-on items — shipped orders only */}
                {safeAddOns.map(item => (
                  <div key={item.id} className="flex justify-between items-center text-sm mt-1" data-testid={`text-addon-confirmed-${item.slug}`}>
                    <p className="text-muted-foreground">{item.name}</p>
                    <p className="font-medium text-foreground">${(item.price / 100).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {!isShipped && (
              <>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1">Date & Time</h3>
                    <p className="text-muted-foreground" data-testid="text-appointment-datetime">
                      {new Date(appointment.appointmentDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                      <br />
                      {appointment.appointmentTime}
                    </p>
                  </div>
                </div>
                <Separator />
              </>
            )}

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-1">
                  {isShipped ? "Shipping Address" : "Service Location"}
                </h3>
                <p className="text-muted-foreground" data-testid="text-appointment-location">
                  {appointment.streetAddress}
                  {appointment.aptSuite && `, ${appointment.aptSuite}`}
                  <br />
                  {city ? `${city.name}, ${city.state}` : appointment.cityId}
                </p>
              </div>
            </div>

            <Separator />

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-1">
                  {isShipped ? "Estimated Delivery" : "Estimated Arrival"}
                </h3>
                <p className="text-muted-foreground">
                  {isShipped
                    ? "Orders typically ship within 2–5 business days. You'll receive a tracking number via email."
                    : "Our licensed nurse will arrive within the scheduled 2-hour window"}
                </p>
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between pt-2">
              <span className="text-lg font-semibold text-foreground">Total Paid</span>
              <span className="text-2xl font-bold text-primary" data-testid="text-total-paid">
                ${formattedPrice}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-accent/30 mb-6">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-foreground mb-3">What's Next?</h3>
            {isShipped ? (
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>You'll receive a confirmation email with your order details</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>Your order will be processed and shipped within 1–2 business days</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>You'll receive a tracking number via email once your order ships</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>Delivery typically takes 2–5 business days</span>
                </li>
              </ul>
            ) : (
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>You'll receive a confirmation email with all appointment details</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>Our nurse will contact you 30 minutes before arrival</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>Treatment typically takes {treatment?.duration} minutes to complete</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>Relax and enjoy your premium wellness experience</span>
                </li>
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Upsell Cards */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8" data-testid="section-upsells">
          <Card className="border-primary/20 bg-primary/5" data-testid="card-upsell-membership">
            <CardContent className="p-4 flex flex-col h-full">
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <Star className="w-5 h-5 text-primary" />
              </div>
              <h4 className="font-semibold text-foreground text-sm mb-1">Save with Membership</h4>
              <p className="text-xs text-muted-foreground flex-1 mb-3">
                Save up to 40% on every treatment with a monthly plan. Starting at $295/mo.
              </p>
              <Button variant="outline" size="sm" className="w-full font-semibold uppercase text-xs" asChild data-testid="button-upsell-membership">
                <Link href="/membership">
                  View Plans <ArrowRight className="w-3 h-3 ml-1" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card data-testid="card-upsell-group">
            <CardContent className="p-4 flex flex-col h-full">
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <h4 className="font-semibold text-foreground text-sm mb-1">Group Booking</h4>
              <p className="text-xs text-muted-foreground flex-1 mb-3">
                Book for 2+ people and save up to 20% per person. Great for events.
              </p>
              <Button variant="outline" size="sm" className="w-full font-semibold uppercase text-xs" asChild data-testid="button-upsell-group">
                <Link href="/group-booking">
                  Learn More <ArrowRight className="w-3 h-3 ml-1" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card data-testid="card-upsell-refer">
            <CardContent className="p-4 flex flex-col h-full">
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <Gift className="w-5 h-5 text-primary" />
              </div>
              <h4 className="font-semibold text-foreground text-sm mb-1">Refer a Friend</h4>
              <p className="text-xs text-muted-foreground flex-1 mb-3">
                Give $25, get $25 when you refer friends to Drip Hydration.
              </p>
              <Button variant="outline" size="sm" className="w-full font-semibold uppercase text-xs" data-testid="button-upsell-refer">
                Share <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button 
            size="lg" 
            className="flex-1 font-semibold uppercase"
            asChild
            data-testid="button-book-another"
          >
            <Link href="/treatments">{isShipped ? "Shop More Products" : "Book Another Treatment"}</Link>
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="flex-1 font-semibold uppercase"
            asChild
            data-testid="button-home"
          >
            <Link href="/">Return to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
