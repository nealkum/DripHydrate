import { useQuery } from "@tanstack/react-query";
import { TreatmentCard } from "@/components/treatments/treatment-card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Treatment, Category } from "@shared/schema";
import { Route, Switch } from "wouter";
import CategoryTreatments from "./category-treatments";

export default function Treatments() {
  const { data: categories, isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: treatments, isLoading: treatmentsLoading } = useQuery<Treatment[]>({
    queryKey: ["/api/treatments"],
  });

  if (categoriesLoading || treatmentsLoading) {
    return (
      <div className="min-h-screen py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          <Skeleton className="h-12 w-64 mb-4" />
          <Skeleton className="h-6 w-96 mb-12" />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-80" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <Switch>
      <Route path="/treatments/:categorySlug" component={CategoryTreatments} />
      <Route path="/treatments">
        <div className="min-h-screen py-12">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="mb-12">
              <h1 className="text-4xl md:text-5xl font-semibold text-foreground mb-4">
                All Treatments
              </h1>
              <p className="text-lg text-muted-foreground">
                Browse our complete collection of IV therapies and wellness treatments
              </p>
            </div>

            {categories?.map((category) => {
              const categoryTreatments = treatments?.filter(
                (t) => t.categoryId === category.id
              );

              if (!categoryTreatments?.length) return null;

              const gridCols = categoryTreatments.length === 2 
                ? "grid md:grid-cols-2 gap-6 max-w-4xl mx-auto" 
                : "grid md:grid-cols-2 lg:grid-cols-3 gap-6";

              return (
                <div key={category.id} className="mb-16" data-testid={`section-${category.slug}`}>
                  <div className="mb-6">
                    <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-2">
                      {category.name}
                    </h2>
                    <p className="text-muted-foreground">{category.description}</p>
                  </div>

                  <div className={gridCols}>
                    {categoryTreatments.map((treatment) => (
                      <TreatmentCard 
                        key={treatment.id} 
                        treatment={{ ...treatment, categorySlug: category.slug }} 
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Route>
    </Switch>
  );
}
