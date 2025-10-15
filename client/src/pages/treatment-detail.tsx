import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Check, Clock, DollarSign } from "lucide-react";
import type { Treatment } from "@shared/schema";

export default function TreatmentDetail() {
  const [, params] = useRoute("/treatment/:slug");
  const treatmentSlug = params?.slug;

  const { data: treatments, isLoading } = useQuery<Treatment[]>({
    queryKey: ["/api/treatments"],
  });

  const treatment = treatments?.find((t) => t.slug === treatmentSlug);

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
          <h2 className="text-2xl font-semibold mb-4">Treatment not found</h2>
          <Button asChild>
            <Link href="/treatments">Browse All Treatments</Link>
          </Button>
        </div>
      </div>
    );
  }

  const formattedPrice = (treatment.price / 100).toFixed(2);
  const formattedDuration = treatment.duration >= 60 
    ? `${Math.floor(treatment.duration / 60)}-${Math.floor(treatment.duration / 60) + 1} hours`
    : `${treatment.duration} minutes`;

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
            <h1 className="text-4xl md:text-5xl font-semibold text-foreground mb-4" data-testid="text-treatment-name">
              {treatment.name}
            </h1>
            <div className="flex items-center gap-6 text-muted-foreground">
              <div className="flex items-center gap-2" data-testid="text-duration">
                <Clock className="w-5 h-5" />
                <span className="text-lg">{formattedDuration}</span>
              </div>
              <div className="flex items-center gap-2" data-testid="text-price">
                <DollarSign className="w-5 h-5" />
                <span className="text-lg font-semibold text-foreground">${formattedPrice}</span>
              </div>
            </div>
          </div>

          {/* Image */}
          {treatment.imageUrl && (
            <div className="aspect-video rounded-lg bg-muted overflow-hidden">
              <img 
                src={treatment.imageUrl} 
                alt={treatment.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Description */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">About This Treatment</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {treatment.description}
            </p>
          </div>

          {/* Benefits */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Benefits</h2>
            <ul className="space-y-3">
              {treatment.benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-3" data-testid={`benefit-${index}`}>
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                    <Check className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-lg text-muted-foreground">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <div className="sticky bottom-0 py-6 bg-background border-t">
            <Button 
              size="lg" 
              className="w-full h-12 text-base font-semibold uppercase"
              asChild
              data-testid="button-book-now"
            >
              <Link href={`/book/${treatment.slug}/location`}>Book This Treatment</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
