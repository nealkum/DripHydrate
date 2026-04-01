import { useState, useRef, useEffect } from "react";
import { B, SANS } from "./theme";
import { TabBar } from "./components/TabBar";
import { HomeScreen } from "./screens/HomeScreen";
import { TreatmentsScreen } from "./screens/TreatmentsScreen";
import { OrdersScreen } from "./screens/OrdersScreen";
import { AccountScreen } from "./screens/AccountScreen";
import { BookingScreen } from "./screens/BookingScreen";
import { BookingConfirmationScreen } from "./screens/BookingConfirmationScreen";
import { TreatmentDetailScreen } from "./screens/TreatmentDetailScreen";
import { MembershipScreen } from "./screens/MembershipScreen";
import { NotificationsScreen } from "./screens/NotificationsScreen";
import { ReferralScreen } from "./screens/ReferralScreen";
import { HelpScreen } from "./screens/HelpScreen";
import { EditProfileScreen } from "./screens/EditProfileScreen";
import { RebookSheet } from "./components/RebookSheet";

export type TabId = "home" | "tx" | "ord" | "acc";

export interface BookingConfirmation {
  treatmentName: string;
  date: string;
  time: string;
  address: string;
  price: number;
  creditsApplied: number;
  totalCharged: number;
  isShipped?: boolean;
}

export type NavScreen =
  | { type: "treatment-detail"; slug: string }
  | { type: "membership" }
  | { type: "notifications" }
  | { type: "referral" }
  | { type: "help" }
  | { type: "edit-profile" }
  | { type: "booking-confirmation"; details: BookingConfirmation };

export interface NavProps {
  navigate: (screen: NavScreen) => void;
  goBack: () => void;
  onTabChange: (tab: TabId) => void;
  openBooking: (slug?: string, addOns?: string[]) => void;
  openRebook: (slug: string, addOns?: string[]) => void;
}

export function MobileApp() {
  const [tab, setTab] = useState<TabId>("home");
  const [navStack, setNavStack] = useState<NavScreen[]>([]);
  const [booking, setBooking] = useState<{ open: boolean; slug?: string; addOns?: string[] }>({ open: false });
  const [rebook, setRebook] = useState<{ open: boolean; slug: string; addOns?: string[] }>({ open: false, slug: "" });
  const [menuOpen, setMenuOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const currentScreen = navStack[navStack.length - 1] ?? null;

  // Scroll browser window back to top whenever a new screen layer opens
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [navStack.length, booking.open]);

  function navigate(screen: NavScreen) {
    setNavStack((prev) => [...prev, screen]);
  }

  function goBack() {
    setNavStack((prev) => prev.slice(0, -1));
  }

  function openBooking(slug?: string, addOns?: string[]) {
    setBooking({ open: true, slug, addOns });
  }

  function openRebook(slug: string, addOns?: string[]) {
    setRebook({ open: true, slug, addOns });
  }

  function handleTabSelect(id: TabId) {
    setTab(id);
    setNavStack([]);
    // Reset the shared scroll container so each tab starts at the top
    requestAnimationFrame(() => {
      if (scrollRef.current) scrollRef.current.scrollTop = 0;
    });
  }

  function handleBookingConfirmed(details: BookingConfirmation) {
    setBooking({ open: false });
    setRebook({ open: false, slug: "" });
    setNavStack((prev) => [...prev, { type: "booking-confirmation", details }]);
  }

  const navProps: NavProps = { navigate, goBack, onTabChange: handleTabSelect, openBooking, openRebook };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-start", minHeight: "100vh", background: "#0a1f1f", padding: "16px 0", fontFamily: SANS }}>
      {/* Phone frame */}
      <div
        style={{
          width: 390,
          minHeight: 844,
          background: B.bg,
          borderRadius: 44,
          boxShadow: "0 25px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.06)",
          overflow: "hidden",
          position: "relative",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Status bar notch */}
        <div style={{ height: 54, background: B.bg, display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 4, flexShrink: 0 }}>
          <div style={{ width: 126, height: 5, borderRadius: 3, background: "rgba(255,255,255,0.3)" }} />
        </div>

        {/* Scrollable content */}
        <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", overflowX: "hidden", paddingBottom: currentScreen ? 0 : 84 }}>
          {tab === "home" && <HomeScreen {...navProps} />}
          {tab === "tx" && <TreatmentsScreen {...navProps} />}
          {tab === "ord" && <OrdersScreen {...navProps} />}
          {tab === "acc" && <AccountScreen {...navProps} />}
        </div>

        {/* Bottom tab bar — hidden when a sub-screen is open */}
        {!currentScreen && <TabBar active={tab} onSelect={handleTabSelect} onMenu={() => setMenuOpen(true)} />}

        {/* Hamburger menu sheet */}
        {menuOpen && (
          <div
            onClick={() => setMenuOpen(false)}
            style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 300, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{ background: B.bgCard, borderRadius: "20px 20px 0 0", paddingBottom: 36, overflow: "hidden" }}
            >
              {/* Handle bar */}
              <div style={{ display: "flex", justifyContent: "center", padding: "14px 0 4px" }}>
                <div style={{ width: 36, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.15)" }} />
              </div>

              {/* User row */}
              <div style={{ padding: "12px 24px 16px", display: "flex", alignItems: "center", gap: 14, borderBottom: `1px solid rgba(255,255,255,0.07)` }}>
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: `linear-gradient(135deg, ${B.tealAccent}, ${B.cyan})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>👤</div>
                <div>
                  <div style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: 15, color: B.textPrimary }}>Neal Johnson</div>
                  <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: B.textMuted, fontWeight: 400, marginTop: 1 }}>IV Member · Active</div>
                </div>
              </div>

              {/* Menu items */}
              {[
                { icon: "👤", label: "Account",       sub: "Profile & preferences",  action: () => { setMenuOpen(false); handleTabSelect("acc"); } },
                { icon: "📋", label: "Orders",         sub: "Appointments & shipments", action: () => { setMenuOpen(false); handleTabSelect("ord"); } },
                { icon: "💎", label: "Membership",      sub: "Plans & benefits",       action: () => { setMenuOpen(false); navigate({ type: "membership" }); } },
                { icon: "🎁", label: "Refer a Friend", sub: "Give $25, get $25",      action: () => { setMenuOpen(false); navigate({ type: "referral" }); } },
                { icon: "❓", label: "Help & Support", sub: "FAQs & contact us",      action: () => { setMenuOpen(false); navigate({ type: "help" }); } },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={item.action}
                  style={{ width: "100%", background: "none", border: "none", padding: "14px 24px", display: "flex", alignItems: "center", gap: 16, cursor: "pointer", textAlign: "left" }}
                >
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{item.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: 14, color: B.textPrimary }}>{item.label}</div>
                    <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: B.textMuted, fontWeight: 400, marginTop: 1 }}>{item.sub}</div>
                  </div>
                  <span style={{ color: B.textMuted, fontSize: 16, opacity: 0.4 }}>›</span>
                </button>
              ))}

              {/* Book CTA */}
              <div style={{ padding: "8px 24px 0" }}>
                <button
                  onClick={() => { setMenuOpen(false); openBooking(); }}
                  style={{ width: "100%", padding: "14px 0", borderRadius: 14, background: `linear-gradient(135deg, ${B.tealAccent}, ${B.cyan})`, border: "none", color: "#fff", fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: 14, cursor: "pointer", letterSpacing: "0.04em" }}
                >
                  BOOK IV THERAPY
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Nav stack screens */}
        {currentScreen?.type === "treatment-detail" && (
          <TreatmentDetailScreen slug={currentScreen.slug} {...navProps} />
        )}
        {currentScreen?.type === "membership" && (
          <MembershipScreen {...navProps} />
        )}
        {currentScreen?.type === "notifications" && (
          <NotificationsScreen {...navProps} />
        )}
        {currentScreen?.type === "referral" && (
          <ReferralScreen {...navProps} />
        )}
        {currentScreen?.type === "help" && (
          <HelpScreen {...navProps} />
        )}
        {currentScreen?.type === "edit-profile" && (
          <EditProfileScreen {...navProps} />
        )}
        {currentScreen?.type === "booking-confirmation" && (
          <BookingConfirmationScreen details={currentScreen.details} {...navProps} />
        )}

        {/* Booking overlay */}
        {booking.open && (
          <BookingScreen
            slug={booking.slug}
            initialAddOns={booking.addOns}
            onClose={() => setBooking({ open: false })}
            onConfirmed={handleBookingConfirmed}
          />
        )}

        {/* Rebook bottom sheet (one-tap) */}
        {rebook.open && rebook.slug && (
          <RebookSheet
            slug={rebook.slug}
            previousAddOns={rebook.addOns}
            onClose={() => setRebook({ open: false, slug: "" })}
            onConfirmed={handleBookingConfirmed}
          />
        )}
      </div>
    </div>
  );
}
