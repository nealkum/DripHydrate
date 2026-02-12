import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Users, Percent, Calendar, Check, Star, Shield } from "lucide-react";

const groupSizes = [
  { label: "2-4 guests", value: "2-4", discount: "10% off" },
  { label: "5-9 guests", value: "5-9", discount: "15% off" },
  { label: "10-19 guests", value: "10-19", discount: "20% off" },
  { label: "20+ guests", value: "20+", discount: "Contact us" },
];

const groupEvents = [
  "Bachelorette / Bachelor Party",
  "Corporate Wellness Event",
  "Sports Team Recovery",
  "Birthday Party",
  "Wedding Party Prep",
  "Conference / Trade Show",
  "Other",
];

export default function GroupBooking() {
  const [selectedSize, setSelectedSize] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen py-12">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
            <Check className="w-10 h-10 text-primary" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-foreground mb-3">Request Submitted</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Our team will reach out within 24 hours to help plan your group experience.
          </p>
          <Button size="lg" className="font-semibold uppercase" asChild data-testid="button-browse-treatments">
            <Link href="/treatments">Browse Treatments</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <Button variant="ghost" className="mb-8" asChild data-testid="button-back">
          <Link href="/">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </Button>

        <div className="text-center mb-10">
          <Badge variant="secondary" className="mb-3 no-default-hover-elevate no-default-active-elevate">
            <Users className="w-3 h-3 mr-1" />
            Group Bookings
          </Badge>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4" data-testid="text-group-heading">
            Group IV Therapy
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Book IV therapy for your group event and save. Perfect for bachelorette parties, corporate wellness, team recovery, and more.
          </p>
        </div>

        {/* Group size options */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10" data-testid="section-group-sizes">
          {groupSizes.map((size) => (
            <button
              key={size.value}
              onClick={() => setSelectedSize(size.value)}
              className={`p-4 rounded-md border text-left transition-colors ${
                selectedSize === size.value 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border'
              }`}
              data-testid={`group-size-${size.value}`}
            >
              <p className="font-semibold text-foreground mb-1">{size.label}</p>
              <div className="flex items-center gap-1 text-sm text-primary">
                <Percent className="w-3 h-3" />
                <span className="font-medium">{size.discount}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Trust signals */}
        <div className="flex flex-wrap justify-center gap-6 mb-10 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            4.9 rating from 100,000+ treatments
          </span>
          <span className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-primary" />
            Licensed ER/ICU nurses
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-primary" />
            Same-day availability
          </span>
        </div>

        {/* Inquiry form */}
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-xl">Request Group Booking</CardTitle>
            <CardDescription>Fill out the form and our events team will contact you within 24 hours.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Your Name</Label>
                  <Input id="name" placeholder="Jane Smith" required data-testid="input-group-name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="jane@example.com" required data-testid="input-group-email" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" type="tel" placeholder="(555) 123-4567" required data-testid="input-group-phone" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="guests">Number of Guests</Label>
                  <Input id="guests" type="number" min={2} placeholder="e.g. 6" required data-testid="input-group-guests" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="event">Event Type</Label>
                <select
                  id="event"
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  required
                  data-testid="select-event-type"
                >
                  <option value="">Select event type</option>
                  {groupEvents.map(e => (
                    <option key={e} value={e}>{e}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City / Location</Label>
                <Input id="city" placeholder="e.g. Miami, FL" required data-testid="input-group-city" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Preferred Date</Label>
                <Input id="date" type="date" required data-testid="input-group-date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Input id="notes" placeholder="Any special requests or questions" data-testid="input-group-notes" />
              </div>
              <Button type="submit" size="lg" className="w-full font-semibold uppercase" data-testid="button-submit-group">
                Submit Group Request
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
