import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Star } from "lucide-react";
import type { Treatment } from "@shared/schema";
import { ingredientMap, bestForMap, reviewMap, memberPriceMap, shippedToYouSlugs } from "@/lib/treatment-data";

interface TreatmentCardProps {
  treatment: Treatment & { categorySlug?: string };
}

export function TreatmentCard({ treatment }: TreatmentCardProps) {
  const formattedPrice = (treatment.price / 100).toFixed(0);
  const ingredients = ingredientMap[treatment.slug] || [];
  const bestFor = bestForMap[treatment.slug];
  const reviews = reviewMap[treatment.slug];
  const memberPrice = memberPriceMap[treatment.slug];
  const isShipped = shippedToYouSlugs.has(treatment.slug);
  const memberFormatted = memberPrice ? (memberPrice / 100).toFixed(0) : null;
  const savings = memberPrice ? treatment.price - memberPrice : 0;
  const savingsFormatted = (savings / 100).toFixed(0);

  const MOST_POPULAR_SLUGS = new Set(["hangover-iv", "recovery-performance", "myers-cocktail-plus"]);
  const isFeatured = MOST_POPULAR_SLUGS.has(treatment.slug);

  const durationText = treatment.duration >= 60 
    ? `${Math.floor(treatment.duration / 60)}-${Math.floor(treatment.duration / 60) + 1} hrs`
    : `${treatment.duration} min`;

  return (
    <Card 
      className="hover-elevate transition-all duration-200 overflow-visible group h-full flex flex-col"
      data-testid={`card-treatment-${treatment.id}`}
    >
      <div className="p-6 flex flex-col flex-1 relative">
        <div className="flex items-center gap-2 absolute top-3 right-3 flex-wrap justify-end">
          {isFeatured && (
            <Badge className="bg-primary text-primary-foreground font-semibold uppercase text-xs" data-testid={`badge-popular-${treatment.id}`}>
              Most Popular
            </Badge>
          )}
        </div>

        {bestFor && (
          <Badge variant="outline" className={`self-start text-xs font-medium mb-2 no-default-hover-elevate no-default-active-elevate ${bestFor.color}`} data-testid={`badge-bestfor-${treatment.id}`}>
            {bestFor.label}
          </Badge>
        )}
        
        <h3 
          className={`text-xl font-semibold mb-1 ${isFeatured ? 'pr-24' : ''}`}
          data-testid={`text-treatment-name-${treatment.id}`}
        >
          {treatment.name}
        </h3>

        {reviews && (
          <div className="flex items-center gap-1.5 mb-2" data-testid={`rating-${treatment.id}`}>
            <div className="flex">
              {[1,2,3,4,5].map(i => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-sm font-semibold text-foreground">{reviews.rating}</span>
            <span className="text-xs text-muted-foreground">({reviews.count.toLocaleString()} reviews)</span>
          </div>
        )}

        <div className="flex items-center gap-3 mb-1 flex-wrap">
          <span 
            className="text-2xl font-bold text-foreground"
            data-testid={`text-price-${treatment.id}`}
          >
            ${formattedPrice}
          </span>
          {!isShipped && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              {durationText}
            </span>
          )}
          <Badge variant="outline" className="text-[10px] font-medium border-primary/30 text-primary no-default-hover-elevate no-default-active-elevate" data-testid={`badge-hsa-${treatment.id}`}>
            HSA/FSA
          </Badge>
        </div>

        {memberFormatted && (
          <div className="flex items-center gap-2 mb-3" data-testid={`member-price-${treatment.id}`}>
            <span className="text-lg font-bold text-primary">${memberFormatted}</span>
            <span className="text-xs text-muted-foreground">with {isShipped ? "subscription" : "membership"}</span>
            <Badge variant="outline" className="text-[10px] font-semibold border-emerald-500/30 bg-emerald-500/10 text-emerald-400 no-default-hover-elevate no-default-active-elevate">
              Save ${savingsFormatted}
            </Badge>
          </div>
        )}

        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {treatment.description}
        </p>

        {ingredients.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4" data-testid={`ingredients-${treatment.id}`}>
            {ingredients.slice(0, 4).map((ingredient) => (
              <Badge key={ingredient} variant="secondary" className="text-xs font-normal no-default-hover-elevate no-default-active-elevate">
                {ingredient}
              </Badge>
            ))}
            {ingredients.length > 4 && (
              <Badge variant="secondary" className="text-xs font-normal no-default-hover-elevate no-default-active-elevate">
                +{ingredients.length - 4} more
              </Badge>
            )}
          </div>
        )}

        <div className="mt-auto pt-3 flex gap-2">
          <Button 
            className="flex-1 font-semibold uppercase" 
            asChild
            data-testid={`button-book-${treatment.id}`}
          >
            <Link href={`/book/${treatment.slug}/location`}>{isShipped ? "Order Now" : "Book Now"}</Link>
          </Button>
          <Button 
            variant="outline" 
            className="font-semibold uppercase"
            asChild
            data-testid={`button-details-${treatment.id}`}
          >
            <Link href={`/treatment/${treatment.slug}`}>Details</Link>
          </Button>
        </div>
      </div>
    </Card>
  );
}
