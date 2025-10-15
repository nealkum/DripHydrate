import { useQuery } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StepIndicator } from "@/components/booking/step-indicator";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import type { Treatment } from "@shared/schema";
import { ArrowLeft, Clock } from "lucide-react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

const TIME_SLOTS = [
  "8:00 AM", "10:00 AM", "12:00 PM", "2:00 PM", "4:00 PM", "6:00 PM", "8:00 PM"
];

export default function BookingSchedule() {
  const [, params] = useRoute("/book/:treatmentSlug/schedule");
  const [, setLocation] = useLocation();
  const treatmentSlug = params?.treatmentSlug;
  
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>("");

  const { data: treatments, isLoading } = useQuery<Treatment[]>({
    queryKey: ["/api/treatments"],
  });

  const treatment = treatments?.find((t) => t.slug === treatmentSlug);

  // Check if location data exists
  useEffect(() => {
    const locationData = sessionStorage.getItem("bookingLocation");
    if (!locationData) {
      setLocation(`/book/${treatmentSlug}/location`);
    }
  }, [treatmentSlug, setLocation]);

  const handleContinue = () => {
    if (selectedDate && selectedTime) {
      const scheduleData = {
        date: selectedDate.toISOString().split('T')[0],
        time: selectedTime,
      };
      sessionStorage.setItem("bookingSchedule", JSON.stringify(scheduleData));
      setLocation(`/book/${treatmentSlug}/payment`);
    }
  };

  const steps = [
    { id: "location", name: "Location", status: "complete" as const },
    { id: "schedule", name: "Schedule", status: "current" as const },
    { id: "payment", name: "Payment", status: "upcoming" as const },
  ];

  const isSameDay = selectedDate?.toDateString() === new Date().toDateString();

  if (isLoading) {
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
          <h2 className="text-2xl font-semibold mb-4">Treatment not found</h2>
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
          <Link href={`/book/${treatmentSlug}/location`}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Location
          </Link>
        </Button>

        <StepIndicator steps={steps} />

        <div className="mt-8 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Select Date & Time</CardTitle>
              <CardDescription>
                Choose when you'd like to receive your {treatment.name} treatment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Date Selection */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-foreground">Choose Date</h3>
                  {isSameDay && (
                    <Badge variant="secondary" className="gap-1" data-testid="badge-same-day">
                      <Clock className="w-3 h-3" />
                      Same-day available
                    </Badge>
                  )}
                </div>
                <div className="flex justify-center">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                    className="rounded-lg border"
                    data-testid="calendar"
                  />
                </div>
              </div>

              {/* Time Selection */}
              {selectedDate && (
                <div>
                  <h3 className="font-semibold text-foreground mb-4">Choose Time</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {TIME_SLOTS.map((time) => (
                      <Button
                        key={time}
                        variant={selectedTime === time ? "default" : "outline"}
                        onClick={() => setSelectedTime(time)}
                        className="h-12"
                        data-testid={`button-time-${time.replace(/\s/g, '-').toLowerCase()}`}
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              <Button
                size="lg"
                className="w-full h-12 font-semibold uppercase"
                disabled={!selectedDate || !selectedTime}
                onClick={handleContinue}
                data-testid="button-continue"
              >
                Continue to Payment
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
