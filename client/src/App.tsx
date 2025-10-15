import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/layout/layout";
import Home from "@/pages/home";
import Treatments from "@/pages/treatments";
import Membership from "@/pages/membership";
import TreatmentDetail from "@/pages/treatment-detail";
import BookingLocation from "@/pages/booking/location";
import BookingSchedule from "@/pages/booking/schedule";
import BookingPayment from "@/pages/booking/payment";
import BookingConfirmation from "@/pages/booking/confirmation";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/treatments" component={Treatments} />
        <Route path="/treatments/:categorySlug" component={Treatments} />
        <Route path="/membership" component={Membership} />
        <Route path="/treatment/:slug" component={TreatmentDetail} />
        <Route path="/book/:treatmentSlug/location" component={BookingLocation} />
        <Route path="/book/:treatmentSlug/schedule" component={BookingSchedule} />
        <Route path="/book/:treatmentSlug/payment" component={BookingPayment} />
        <Route path="/booking/confirmation" component={BookingConfirmation} />
        <Route component={NotFound} />
      </Switch>
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
