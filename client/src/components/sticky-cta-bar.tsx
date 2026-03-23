import { Link, useLocation, useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Clock, Package } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Treatment } from "@shared/schema";

export function StickyCTABar() {
  const [location] = useLocation();
  const [isTreatmentDetail, treatmentParams] = useRoute("/treatment/:slug");
  const [isShippedCategory] = useRoute("/treatments/shipped-to-you");

  const isBookingFlow = location.startsWith("/book/");
  const isConfirmation = location === "/booking/confirmation";
  const isAccountPage = location === "/account";

  const { data: treatments } = useQuery<Treatment[]>({
    queryKey: ["/api/treatments"],
    enabled: !!isTreatmentDetail && !!treatmentParams?.slug,
  });

  if (isBookingFlow || isConfirmation || isAccountPage) return null;

  const slug = treatmentParams?.slug;
  const treatment = isTreatmentDetail && slug
    ? treatments?.find((t) => t.slug === slug)
    : null;

  const price = treatment ? `$${(treatment.price / 100).toFixed(0)}` : null;

  let label: string;
  let subtext: string;
  let href: string;

  if (isTreatmentDetail && treatment) {
    label = "Book Now";
    subtext = `${treatment.name} · ${price}`;
    href = `/book/${slug}/location`;
  } else if (isShippedCategory) {
    label = "Get Started";
    subtext = "Ships nationwide · No nurse visit required";
    href = "/treatments/shipped-to-you";
  } else if (location === "/membership") {
    label = "Join Now — Save up to 45%";
    subtext = "HSA/FSA eligible · Cancel anytime";
    href = "/membership#plans";
  } else {
    label = "Book IV Therapy";
    subtext = "Same-Day Available · Nurse in 2 Hours";
    href = "/treatments";
  }

  return (
    <div
      className="fixed left-0 right-0 z-[49] border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 shadow-[0_-2px_12px_rgba(0,0,0,0.25)] bottom-[60px] md:bottom-0"
      data-testid="sticky-cta-bar"
    >
      <div className="px-4 py-2.5 md:py-3 md:container md:mx-auto md:max-w-7xl">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground min-w-0">
            {isShippedCategory
              ? <Package className="w-4 h-4 text-primary flex-shrink-0" />
              : <Clock className="w-4 h-4 text-primary flex-shrink-0" />
            }
            <span className="truncate text-xs md:text-sm">{subtext}</span>
          </div>
          <Button
            size="default"
            className="font-semibold uppercase flex-shrink-0 text-xs md:text-sm"
            asChild
            data-testid="sticky-button-book-now"
          >
            <Link href={href}>{label}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
