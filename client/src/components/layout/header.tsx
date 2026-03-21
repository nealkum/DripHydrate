import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X, User } from "lucide-react";
import { useState, useEffect } from "react";
import logoPath from "@assets/drip logo_1760551470270.png";

export function Header() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const check = () => setIsLoggedIn(!!sessionStorage.getItem("dripAccount"));
    check();
    window.addEventListener("storage", check);
    const interval = setInterval(check, 1000);
    return () => { window.removeEventListener("storage", check); clearInterval(interval); };
  }, []);

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Treatments", href: "/treatments" },
    { label: "Membership", href: "/membership" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link href="/" className="group flex-shrink-0 flex items-center gap-3" data-testid="link-logo">
            <img
              src={logoPath}
              alt="Drip Hydration Logo"
              className="h-14 w-auto transition-transform group-hover:scale-105"
              style={{ filter: 'brightness(0) invert(1)' }}
            />
            <span className="hidden sm:inline font-serif text-lg font-bold text-foreground tracking-tight leading-none">
              Drip<span className="text-primary">.</span>
            </span>
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

          <div className="hidden md:flex items-center gap-2 flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="font-semibold"
              data-testid="button-account"
            >
              <Link href="/account">
                <User className="w-4 h-4 mr-1.5" />
                {isLoggedIn ? "Account" : "Sign In"}
              </Link>
            </Button>
            <Button
              asChild
              className="font-semibold uppercase"
              data-testid="button-join-now"
            >
              <Link href="/membership">Join Now</Link>
            </Button>
            <Button
              variant="outline"
              asChild
              className="font-semibold uppercase"
              data-testid="button-book-treatment"
            >
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
              variant="ghost"
              className="w-full justify-start font-semibold"
              asChild
              onClick={() => setMobileMenuOpen(false)}
              data-testid="mobile-button-account"
            >
              <Link href="/account">
                <User className="w-4 h-4 mr-2" />
                {isLoggedIn ? "My Account" : "Sign In"}
              </Link>
            </Button>
            <div className="flex gap-2 pt-1">
              <Button
                className="flex-1 font-semibold uppercase"
                asChild
                onClick={() => setMobileMenuOpen(false)}
                data-testid="mobile-button-join-now"
              >
                <Link href="/membership">Join Now</Link>
              </Button>
              <Button
                variant="outline"
                className="flex-1 font-semibold uppercase"
                asChild
                onClick={() => setMobileMenuOpen(false)}
                data-testid="mobile-button-book-treatment"
              >
                <Link href="/treatments">Book Now</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
