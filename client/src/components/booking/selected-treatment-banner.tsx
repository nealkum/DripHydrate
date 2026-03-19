import { Droplets, Package, Clock } from "lucide-react";
import type { Treatment } from "@shared/schema";
import { shippedToYouSlugs } from "@/lib/treatment-data";

interface SelectedTreatmentBannerProps {
  treatment: Treatment;
}

export function SelectedTreatmentBanner({ treatment }: SelectedTreatmentBannerProps) {
  const isShipped = shippedToYouSlugs.has(treatment.slug);
  const Icon = isShipped ? Package : Droplets;
  const price = `$${(treatment.price / 100).toFixed(0)}`;
  const durationText = isShipped
    ? "Ships to you"
    : treatment.duration >= 60
      ? `${Math.floor(treatment.duration / 60)}–${Math.floor(treatment.duration / 60) + 1} hr session`
      : `${treatment.duration} min session`;

  return (
    <div
      className="flex items-center gap-3 px-4 py-3 mt-6 rounded-md border border-primary/20 bg-primary/10"
      data-testid="banner-selected-treatment"
    >
      <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0">
        <Icon className="w-4 h-4 text-primary" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-primary/70 leading-none mb-0.5">
          {isShipped ? "Ordering" : "Booking"}
        </p>
        <p className="font-semibold text-foreground text-sm leading-snug truncate" data-testid="banner-treatment-name">
          {treatment.name}
        </p>
      </div>

      <div className="flex items-center gap-3 flex-shrink-0 text-right">
        {!isShipped && (
          <div className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            {durationText}
          </div>
        )}
        {isShipped && (
          <span className="hidden sm:block text-xs text-muted-foreground">{durationText}</span>
        )}
        <div className="text-right">
          <span className="text-base font-bold text-foreground" data-testid="banner-treatment-price">
            {price}
          </span>
        </div>
      </div>
    </div>
  );
}
