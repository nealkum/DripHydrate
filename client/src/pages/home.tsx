import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Droplet, Zap, Heart, MapPin, Clock, Shield } from "lucide-react";

export default function Home() {
  const categories = [
    {
      id: "vitamin-wellness",
      name: "Vitamin & Wellness IVs",
      description: "Essential vitamins and hydration for energy, immunity, and recovery",
      icon: Droplet,
      slug: "vitamin-wellness",
    },
    {
      id: "nad-therapy",
      name: "NAD+ Therapy",
      description: "Advanced anti-aging and cellular health treatments",
      icon: Zap,
      slug: "nad-therapy",
    },
  ];

  const features = [
    {
      icon: MapPin,
      title: "100+ Cities",
      description: "Available nationwide and internationally",
    },
    {
      icon: Clock,
      title: "Same-Day Booking",
      description: "Appointments available within 2 hours",
    },
    {
      icon: Shield,
      title: "Licensed Nurses",
      description: "ER/ICU experienced RNs at your service",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-background py-16 md:py-24 lg:py-32">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center max-w-4xl mx-auto space-y-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-foreground">
              The Global Leader in{" "}
              <span className="text-primary">Mobile IV Therapy</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              Drip Hydration offers a wide variety of in-home IV therapy services, as well as a selection of cutting-edge wellness treatments delivered nationwide.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                className="h-12 px-8 text-base font-semibold uppercase"
                asChild
                data-testid="button-book-now"
              >
                <Link href="/treatments">Book IV Therapy</Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="h-12 px-8 text-base font-semibold uppercase"
                asChild
                data-testid="button-membership"
              >
                <Link href="/membership">Become A Member</Link>
              </Button>
            </div>
            <p className="text-muted-foreground font-medium pt-4">
              150,000+ happy patients served
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 md:py-16 border-b">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid sm:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div key={feature.title} className="flex gap-4" data-testid={`feature-${feature.title.toLowerCase().replace(/\s+/g, '-')}`}>
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 md:py-20 bg-muted/30">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              The first step to better health <span className="text-primary">is just a drip away</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore our range of in-home vitamin IV treatments designed for optimal health.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {categories.map((category) => {
              const Icon = category.icon;
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
      </section>
    </div>
  );
}
