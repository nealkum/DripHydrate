import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { Category } from "@shared/schema";
import { Route, Switch, Link } from "wouter";
import CategoryTreatments from "./category-treatments";
import { Droplet, Zap } from "lucide-react";

export default function Treatments() {
  const { data: categories, isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  if (categoriesLoading) {
    return (
      <div className="min-h-screen py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          <Skeleton className="h-12 w-64 mb-4" />
          <Skeleton className="h-6 w-96 mb-12" />
          <div className="grid md:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-64" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const categoryIcons = {
    "vitamin-wellness": Droplet,
    "nad-therapy": Zap,
  } as const;

  return (
    <Switch>
      <Route path="/treatments/:categorySlug" component={CategoryTreatments} />
      <Route path="/treatments">
        <div className="min-h-screen py-12">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="mb-12">
              <h1 className="text-4xl md:text-5xl font-semibold text-foreground mb-4">
                Service Overview
              </h1>
              <p className="text-lg text-muted-foreground">
                Explore our range of in-home vitamin IV treatments designed for optimal health.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {categories?.map((category) => {
                const Icon = categoryIcons[category.slug as keyof typeof categoryIcons] || Droplet;
                return (
                  <Card 
                    key={category.id} 
                    className="hover-elevate transition-all duration-200 cursor-pointer"
                    data-testid={`card-category-${category.id}`}
                  >
                    <Link href={`/treatments/${category.slug}`}>
                      <CardHeader className="space-y-4">
                        <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Icon className="w-7 h-7 text-primary" />
                        </div>
                        <CardTitle className="text-xl">{category.name}</CardTitle>
                        <CardDescription className="text-base leading-relaxed">
                          {category.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button variant="ghost" className="w-full justify-between font-semibold uppercase" data-testid={`button-view-${category.id}`}>
                          View Treatments
                          <span className="ml-2">→</span>
                        </Button>
                      </CardContent>
                    </Link>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </Route>
    </Switch>
  );
}
