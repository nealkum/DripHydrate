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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StepIndicator } from "@/components/booking/step-indicator";
import { Skeleton } from "@/components/ui/skeleton";
import type { Treatment, City } from "@shared/schema";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";

const locationSchema = z.object({
  cityId: z.string().min(1, "Please select a city"),
  streetAddress: z.string().min(5, "Please enter your street address"),
  aptSuite: z.string().optional(),
  specialInstructions: z.string().optional(),
});

type LocationForm = z.infer<typeof locationSchema>;

export default function BookingLocation() {
  const [, params] = useRoute("/book/:treatmentSlug/location");
  const [, setLocation] = useLocation();
  const treatmentSlug = params?.treatmentSlug;

  const { data: treatments, isLoading: treatmentsLoading } = useQuery<Treatment[]>({
    queryKey: ["/api/treatments"],
  });

  const { data: cities, isLoading: citiesLoading } = useQuery<City[]>({
    queryKey: ["/api/cities"],
  });

  const treatment = treatments?.find((t) => t.slug === treatmentSlug);

  const form = useForm<LocationForm>({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      cityId: "",
      streetAddress: "",
      aptSuite: "",
      specialInstructions: "",
    },
  });

  const onSubmit = (data: LocationForm) => {
    // Store in session storage for next step
    sessionStorage.setItem("bookingLocation", JSON.stringify(data));
    sessionStorage.setItem("treatmentSlug", treatmentSlug || "");
    setLocation(`/book/${treatmentSlug}/schedule`);
  };

  const steps = [
    { id: "location", name: "Location", status: "current" as const },
    { id: "schedule", name: "Schedule", status: "upcoming" as const },
    { id: "payment", name: "Payment", status: "upcoming" as const },
  ];

  if (treatmentsLoading || citiesLoading) {
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

  // Group cities by region
  const groupedCities = cities?.reduce((acc, city) => {
    if (!acc[city.region]) {
      acc[city.region] = [];
    }
    acc[city.region].push(city);
    return acc;
  }, {} as Record<string, City[]>);

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

        <StepIndicator steps={steps} />

        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Service Location</CardTitle>
              <CardDescription>
                Where should we deliver your {treatment.name} treatment?
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="cityId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-city">
                              <SelectValue placeholder="Select your city" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.entries(groupedCities || {}).map(([region, regionCities]) => (
                              <div key={region}>
                                <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
                                  {region}
                                </div>
                                {regionCities.map((city) => (
                                  <SelectItem 
                                    key={city.id} 
                                    value={city.id}
                                    data-testid={`option-city-${city.id}`}
                                  >
                                    {city.name}, {city.state}
                                  </SelectItem>
                                ))}
                              </div>
                            ))}
                          </SelectContent>
                        </Select>
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

                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full h-12 font-semibold uppercase"
                    data-testid="button-continue"
                  >
                    Continue to Schedule
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
