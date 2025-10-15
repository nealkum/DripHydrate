import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

export default function Membership() {
  const perks = [
    {
      title: "Up to 40% off all IVs",
      description: "Your exclusive member discount",
    },
    {
      title: "Plus 15% off all services",
      description: "Your exclusive member discount",
    },
    {
      title: "Exclusive member promos",
      description: "Your exclusive member benefits",
    },
    {
      title: "Priority booking",
      description: "Your exclusive booking privilege",
    },
  ];

  const plans = [
    {
      name: "Basic",
      price: 295,
      treatments: 1,
      savings: "SAVE UP TO 25%",
      popular: false,
    },
    {
      name: "Premium",
      price: 550,
      treatments: 2,
      savings: "SAVE UP TO 30%",
      popular: true,
    },
    {
      name: "Elite",
      price: 1000,
      treatments: 4,
      savings: "SAVE UP TO 35%",
      popular: false,
    },
    {
      name: "Platinum",
      price: 1800,
      treatments: 8,
      savings: "SAVE UP TO 40%",
      popular: false,
    },
  ];

  const features = [
    "Priority Booking",
    "15% off all Shipped To You Products",
    "Two-Month Free Trial of our Concierge MD Membership Plan",
    "Traveling? See a full list of our Active Locations!",
    "Exclusive Monthly Member Promotions",
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-primary py-16 md:py-24 lg:py-32">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center max-w-4xl mx-auto space-y-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-primary-foreground">
              Maximize your health and save big
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/90 leading-relaxed max-w-3xl mx-auto">
              Our Vitamin IV Membership plans are designed to optimize your health & wellness while giving you VIP perks and savings.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                variant="secondary"
                className="h-12 px-8 text-base font-semibold uppercase"
                asChild
                data-testid="button-join-now"
              >
                <Link href="#plans">Join Now</Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="h-12 px-8 text-base font-semibold uppercase bg-transparent text-primary-foreground border-primary-foreground hover:bg-primary-foreground/10"
                asChild
                data-testid="button-view-plans"
              >
                <Link href="#plans">View Plans</Link>
              </Button>
            </div>
            <p className="text-primary-foreground/80 font-medium pt-4">
              150,000+ happy patients served
            </p>
          </div>
        </div>
      </section>

      {/* Membership Perks */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Membership perks
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {perks.map((perk) => (
              <div key={perk.title} className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                    <Check className="w-6 h-6 text-primary-foreground" />
                  </div>
                </div>
                <h3 className="font-semibold text-foreground mb-2">{perk.title}</h3>
                <p className="text-sm text-muted-foreground">{perk.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Membership Plans */}
      <section id="plans" className="py-16 md:py-20 bg-muted/30">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Vitamin Drip <span className="text-primary">membership</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Keep your health top priority while saving money with our monthly membership IV plans.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan) => (
              <Card 
                key={plan.name} 
                className={`relative hover-elevate transition-all duration-200 ${plan.popular ? 'border-primary border-2' : ''}`}
                data-testid={`card-plan-${plan.name.toLowerCase()}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground font-semibold uppercase text-xs px-4 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardHeader className="space-y-2 pt-6">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="space-y-1">
                    <p className="text-3xl font-bold text-primary">${plan.price}</p>
                    <p className="text-sm text-muted-foreground">/month</p>
                  </div>
                  <Badge variant="secondary" className="font-semibold uppercase text-xs">
                    {plan.savings}
                  </Badge>
                  <CardDescription className="text-base pt-2">
                    {plan.treatments} IV Treatment{plan.treatments > 1 ? 's' : ''}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full font-semibold uppercase" 
                    variant={plan.popular ? "default" : "outline"}
                    asChild
                    data-testid={`button-join-${plan.name.toLowerCase()}`}
                  >
                    <Link href="/treatments">Join Now</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Ready to start your wellness journey?
            </h2>
            <p className="text-lg text-muted-foreground">
              Join thousands of members who have transformed their health with Drip Hydration's IV therapy membership.
            </p>
            <Button 
              size="lg" 
              className="h-12 px-8 text-base font-semibold uppercase"
              asChild
              data-testid="button-get-started"
            >
              <Link href="/treatments">Get Started Today</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
