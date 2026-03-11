import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import logoPath from "@assets/drip logo_1760551470270.png";

export function Header() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Treatments", href: "/treatments" },
    { label: "Membership", href: "/membership" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link href="/" className="group flex-shrink-0" data-testid="link-logo">
            <img
              src={logoPath}
              alt="Drip Hydration Logo"
              className="h-14 w-auto transition-transform group-hover:scale-105"
              style={{ filter: 'brightness(0) invert(1)' }}
            />
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Button
                key={item.href}
                variant={location === item.href ? "secondary" : "ghost"}
                asChild
                data-testid={`nav-${item.label.toLowerCase()}`}
              >
                <Link href={item.href}>{item.label}</Link>
              </Button>
            ))}
          </nav>

          <div className="hidden md:block flex-shrink-0">
            <Button asChild size="lg" className="font-semibold uppercase" data-testid="button-book-treatment">
              <Link href="/treatments">Book Now</Link>
            </Button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="button-mobile-menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t py-4 space-y-2" data-testid="mobile-menu">
            {navItems.map((item) => (
              <Button
                key={item.href}
                variant={location === item.href ? "secondary" : "ghost"}
                className="w-full justify-start"
                asChild
                onClick={() => setMobileMenuOpen(false)}
                data-testid={`mobile-nav-${item.label.toLowerCase()}`}
              >
                <Link href={item.href}>{item.label}</Link>
              </Button>
            ))}
            <Button
              className="w-full font-semibold uppercase"
              asChild
              onClick={() => setMobileMenuOpen(false)}
              data-testid="mobile-button-book-treatment"
            >
              <Link href="/treatments">Book Now</Link>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
