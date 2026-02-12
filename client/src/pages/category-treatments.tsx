import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { TreatmentCard } from "@/components/treatments/treatment-card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Treatment, Category } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function CategoryTreatments() {
  const [, params] = useRoute("/treatments/:categorySlug");
  const categorySlug = params?.categorySlug;

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

        <div className="mb-12">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
            {category.name}
          </h1>
          <p className="text-lg text-muted-foreground">
            {category.description}
          </p>
        </div>

        {categoryTreatments && categoryTreatments.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryTreatments.map((treatment) => (
              <TreatmentCard 
                key={treatment.id} 
                treatment={{ ...treatment, categorySlug: category.slug }} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No treatments available in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
