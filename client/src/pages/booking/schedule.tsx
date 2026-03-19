import { useQuery } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StepIndicator } from "@/components/booking/step-indicator";
import { SelectedTreatmentBanner } from "@/components/booking/selected-treatment-banner";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import type { Treatment } from "@shared/schema";
import { ArrowLeft, Clock } from "lucide-react";
import { Link } from "wouter";
import { shippedToYouSlugs } from "@/lib/treatment-data";

const TIME_SLOTS = [
  "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM",
  "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM",
  "4:00 PM", "5:00 PM", "6:00 PM", "7:00 PM",
];

const TIME_WINDOWS = [
  { label: "Early Morning",  value: "Early Morning (7–9 AM)",   detail: "7:00 AM – 9:00 AM"   },
  { label: "Morning",        value: "Morning (9 AM–12 PM)",     detail: "9:00 AM – 12:00 PM"  },
  { label: "Midday",         value: "Midday (12–3 PM)",         detail: "12:00 PM – 3:00 PM"  },
  { label: "Afternoon",      value: "Afternoon (3–6 PM)",       detail: "3:00 PM – 6:00 PM"   },
  { label: "Evening",        value: "Evening (6–9 PM)",         detail: "6:00 PM – 9:00 PM"   },
  { label: "Anytime",        value: "Anytime",                  detail: "Flexible — any time" },
];

export default function BookingSchedule() {
  const [, params] = useRoute("/book/:treatmentSlug/schedule");
  const [, setLocation] = useLocation();
  const treatmentSlug = params?.treatmentSlug;

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [timeMode, setTimeMode] = useState<"exact" | "window">("exact");

  const { data: treatments, isLoading } = useQuery<Treatment[]>({
    queryKey: ["/api/treatments"],
  });

  const treatment = treatments?.find((t) => t.slug === treatmentSlug);
  const isShipped = treatmentSlug ? shippedToYouSlugs.has(treatmentSlug) : false;

  // Check if location data exists; also skip schedule step for shipped products
  useEffect(() => {
    const locationData = sessionStorage.getItem("bookingLocation");
    if (!locationData) {
      setLocation(`/book/${treatmentSlug}/location`);
      return;
    }
    if (isShipped) {
      setLocation(`/book/${treatmentSlug}/payment`);
    }
  }, [treatmentSlug, setLocation, isShipped]);

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

  if (isLoading || isShipped) {
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
          <Link href={`/book/${treatmentSlug}/location`}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Location
          </Link>
        </Button>

        <StepIndicator steps={steps} />

        <SelectedTreatmentBanner treatment={treatment} />

        <div className="mt-6 space-y-6">
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
                  <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                    <h3 className="font-semibold text-foreground">Choose Time</h3>
                    {/* Mode toggle */}
                    <div className="flex rounded-md border border-border overflow-hidden text-sm">
                      <button
                        type="button"
                        onClick={() => { setTimeMode("exact"); setSelectedTime(""); }}
                        className={`px-4 py-1.5 font-medium transition-colors ${
                          timeMode === "exact"
                            ? "bg-primary text-primary-foreground"
                            : "bg-background text-muted-foreground hover:bg-accent"
                        }`}
                        data-testid="button-mode-exact"
                      >
                        Exact Time
                      </button>
                      <button
                        type="button"
                        onClick={() => { setTimeMode("window"); setSelectedTime(""); }}
                        className={`px-4 py-1.5 font-medium transition-colors border-l border-border ${
                          timeMode === "window"
                            ? "bg-primary text-primary-foreground"
                            : "bg-background text-muted-foreground hover:bg-accent"
                        }`}
                        data-testid="button-mode-window"
                      >
                        Time Window
                      </button>
                    </div>
                  </div>

                  {timeMode === "exact" ? (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {TIME_SLOTS.map((time) => (
                        <Button
                          key={time}
                          variant={selectedTime === time ? "default" : "outline"}
                          onClick={() => setSelectedTime(time)}
                          data-testid={`button-time-${time.replace(/[\s:]/g, '-').toLowerCase()}`}
                        >
                          {time}
                        </Button>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {TIME_WINDOWS.map((w) => (
                        <button
                          key={w.value}
                          type="button"
                          onClick={() => setSelectedTime(w.value)}
                          className={`flex items-start gap-3 p-4 rounded-md border text-left transition-colors ${
                            selectedTime === w.value
                              ? "border-primary bg-primary/10"
                              : "border-border bg-card hover-elevate"
                          }`}
                          data-testid={`button-window-${w.label.toLowerCase().replace(/\s/g, '-')}`}
                        >
                          <Clock className={`w-4 h-4 mt-0.5 flex-shrink-0 ${selectedTime === w.value ? "text-primary" : "text-muted-foreground"}`} />
                          <div>
                            <p className={`font-semibold text-sm ${selectedTime === w.value ? "text-primary" : "text-foreground"}`}>
                              {w.label}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">{w.detail}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
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
