import { Link, useLocation } from "wouter";
import { Home, Grid3X3, Package, Star, User } from "lucide-react";

const tabs = [
  { label: "Home",       icon: Home,       href: "/" },
  { label: "Treatments", icon: Grid3X3,    href: "/treatments" },
  { label: "Shop",       icon: Package,    href: "/treatments/shipped-to-you" },
  { label: "Membership", icon: Star,       href: "/membership" },
  { label: "Account",    icon: User,       href: "/account" },
];

export function BottomTabBar() {
  const [location] = useLocation();

  const isBookingFlow = location.startsWith("/book/");
  const isConfirmation = location === "/booking/confirmation";

  if (isBookingFlow || isConfirmation) return null;

  const isActive = (href: string) => {
    if (href === "/") return location === "/";
    return location.startsWith(href);
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 md:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      data-testid="bottom-tab-bar"
    >
      <div className="flex items-center justify-around py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = isActive(tab.href);
          const isShop = tab.label === "Shop";
          return (
            <Link
              key={tab.label}
              href={tab.href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 text-[10px] transition-colors ${
                active ? 'text-primary' : 'text-muted-foreground'
              } ${isShop ? 'relative' : ''}`}
              data-testid={`tab-${tab.label.toLowerCase()}`}
            >
              {isShop ? (
                <div className={`w-10 h-10 rounded-full flex items-center justify-center -mt-4 shadow-lg ${
                  active ? 'bg-primary' : 'bg-primary/90'
                }`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
              ) : (
                <Icon className="w-5 h-5" />
              )}
              <span className={`font-medium ${isShop ? 'mt-0.5' : ''}`}>{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
