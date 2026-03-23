import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { TreatmentCard } from "@/components/treatments/treatment-card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Treatment, Category } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";

interface ShippedFilter {
  id: string;
  label: string;
  slugs?: string[];
}

const shippedFilters: ShippedFilter[] = [
  { id: "all",          label: "All" },
  { id: "weight-loss",  label: "Weight Loss",  slugs: ["weight-loss-semaglutide", "weight-loss-tirzepatide"] },
  { id: "mental-health",label: "Mental Health", slugs: ["ketamine-therapy"] },
  { id: "nad",          label: "NAD",           slugs: ["nad-injections", "nad-nasal-spray", "niagen-nr-injections"] },
  { id: "peptides",     label: "Peptides",      slugs: ["peptide-sermorelin", "peptide-cjc-ipamorelin", "peptide-ghk-cu"] },
  { id: "trt",          label: "TRT",           slugs: ["testosterone-trt", "testosterone-enclomiphene"] },
  { id: "vitamins",     label: "Vitamins",       slugs: ["vitamin-b12", "vitamin-lipostat"] },
];

export default function CategoryTreatments() {
  const [, params] = useRoute("/treatments/:categorySlug");
  const categorySlug = params?.categorySlug;
  const [activeFilter, setActiveFilter] = useState("all");

  const { data: categories, isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: treatments, isLoading: treatmentsLoading } = useQuery<Treatment[]>({
    queryKey: ["/api/treatments"],
  });

  const category = categories?.find((c) => c.slug === categorySlug);
  const categoryTreatments = treatments?.filter(
    (t) => t.categoryId === category?.id
  );

  const isShipped = categorySlug === "shipped-to-you";

  const visibleTreatments = (() => {
    if (!categoryTreatments) return [];
    if (!isShipped || activeFilter === "all") return categoryTreatments;
    const filter = shippedFilters.find((f) => f.id === activeFilter);
    if (!filter?.slugs) return categoryTreatments;
    return categoryTreatments.filter((t) => filter.slugs!.includes(t.slug));
  })();

  if (categoriesLoading || treatmentsLoading) {
    return (
      <div className="min-h-screen py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          <Skeleton className="h-12 w-64 mb-4" />
          <Skeleton className="h-6 w-96 mb-12" />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-80" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-serif text-2xl font-bold mb-4">Category not found</h2>
          <Button asChild>
            <Link href="/treatments">Browse All Treatments</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        <Button
          variant="ghost"
          className="mb-6"
          asChild
          data-testid="button-back"
        >
          <Link href="/treatments">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to All Treatments
          </Link>
        </Button>

        <div className="mb-8">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
            {category.name}
          </h1>
          <p className="text-lg text-muted-foreground">
            {category.description}
          </p>
        </div>

        {/* Filter pills — Shipped To You only */}
        {isShipped && (
          <div className="mb-8" data-testid="section-filters">
            <div className="flex flex-wrap gap-2">
              {shippedFilters.map((filter) => {
                const isActive = activeFilter === filter.id;
                const count = filter.slugs
                  ? categoryTreatments?.filter((t) => filter.slugs!.includes(t.slug)).length ?? 0
                  : categoryTreatments?.length ?? 0;
                return (
                  <Button
                    key={filter.id}
                    variant={isActive ? "default" : "outline"}
                    size="sm"
                    className="font-semibold rounded-full"
                    onClick={() => setActiveFilter(filter.id)}
                    data-testid={`filter-${filter.id}`}
                  >
                    {filter.label}
                    <span className={`ml-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      isActive
                        ? "bg-primary-foreground/20 text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}>
                      {count}
                    </span>
                  </Button>
                );
              })}
            </div>
          </div>
        )}

        {visibleTreatments.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleTreatments.map((treatment) => (
              <TreatmentCard
                key={treatment.id}
                treatment={{ ...treatment, categorySlug: category.slug }}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg mb-4">No treatments in this category yet.</p>
            <Button variant="outline" onClick={() => setActiveFilter("all")} data-testid="button-clear-filter">
              Show all treatments
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
