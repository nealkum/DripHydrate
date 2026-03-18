import { useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/layout/layout";
import { BottomTabBar } from "@/components/bottom-tab-bar";

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location]);
  return null;
}
import Home from "@/pages/home";
import Treatments from "@/pages/treatments";
import CategoryTreatments from "@/pages/category-treatments";
import Membership from "@/pages/membership";
import TreatmentDetail from "@/pages/treatment-detail";
import BookingLocation from "@/pages/booking/location";
import BookingSchedule from "@/pages/booking/schedule";
import BookingPayment from "@/pages/booking/payment";
import BookingConfirmation from "@/pages/booking/confirmation";
import GroupBooking from "@/pages/group-booking";
import Account from "@/pages/account";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Layout>
      <ScrollToTop />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/treatments/:categorySlug" component={CategoryTreatments} />
        <Route path="/treatments" component={Treatments} />
        <Route path="/membership" component={Membership} />
        <Route path="/treatment/:slug" component={TreatmentDetail} />
        <Route path="/book/:treatmentSlug/location" component={BookingLocation} />
        <Route path="/book/:treatmentSlug/schedule" component={BookingSchedule} />
        <Route path="/book/:treatmentSlug/payment" component={BookingPayment} />
        <Route path="/booking/confirmation" component={BookingConfirmation} />
        <Route path="/group-booking" component={GroupBooking} />
        <Route path="/account" component={Account} />
        <Route component={NotFound} />
      </Switch>
      <BottomTabBar />
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
