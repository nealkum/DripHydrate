import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, Calendar, MapPin, Clock, User } from "lucide-react";
import type { Appointment, Treatment, City } from "@shared/schema";
import { Link } from "wouter";

export default function BookingConfirmation() {
  const [, setLocation] = useLocation();
  const appointmentId = sessionStorage.getItem("appointmentId");

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
    }
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
          <h2 className="text-2xl font-semibold mb-4">Appointment not found</h2>
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

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
            <CheckCircle2 className="w-10 h-10 text-primary" data-testid="icon-success" />
          </div>
          <h1 className="text-4xl font-semibold text-foreground mb-2">
            Booking Confirmed!
          </h1>
          <p className="text-lg text-muted-foreground">
            Your appointment has been successfully scheduled
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl">Appointment Details</CardTitle>
            <CardDescription>
              A confirmation email has been sent to {appointment.customerEmail}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-1">Treatment</h3>
                <p className="text-muted-foreground" data-testid="text-treatment-name">
                  {treatment?.name}
                </p>
              </div>
            </div>

            <Separator />

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

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-1">Service Location</h3>
                <p className="text-muted-foreground" data-testid="text-appointment-location">
                  {appointment.streetAddress}
                  {appointment.aptSuite && `, ${appointment.aptSuite}`}
                  <br />
                  {city?.name}, {city?.state}
                </p>
              </div>
            </div>

            <Separator />

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-1">Estimated Arrival</h3>
                <p className="text-muted-foreground">
                  Our licensed nurse will arrive within the scheduled 2-hour window
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

        <Card className="bg-accent/50">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-foreground mb-3">What's Next?</h3>
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
          </CardContent>
        </Card>

        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <Button 
            size="lg" 
            className="flex-1 h-12 font-semibold uppercase"
            asChild
            data-testid="button-book-another"
          >
            <Link href="/treatments">Book Another Treatment</Link>
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="flex-1 h-12 font-semibold uppercase"
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
