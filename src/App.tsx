import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import { useEffect, useState } from "react";
import Index from "./pages/Index";

import Auth from "./pages/Auth";
import Events from "./pages/Events";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Support from "./pages/Support";
import Discounts from "./pages/Discounts";
import Safety from "./pages/Safety";
import NotFound from "./pages/NotFound";
import BrowseTours from "./pages/BrowseTours";
import GuideAuth from "./pages/guide/GuideAuth";
import GuideDashboard from "./pages/guide/GuideDashboard";
import GuideBookings from "./pages/guide/GuideBookings";
import GuideProfile from "./pages/guide/GuideProfile";
import GuideTours from "./pages/guide/GuideTours";
import GuideKYC from "./pages/guide/GuideKYC";
import FindBuddy from "./pages/FindBuddy";
import MyRequests from "./pages/MyRequests";
import InterestedGuides from "./pages/InterestedGuides";
import MeetingRoute from "./pages/MeetingRoute";
import GuideRequests from "./pages/guide/GuideRequests";
import Map from "./pages/Map";
import MyBookings from "./pages/MyBookings";

const queryClient = new QueryClient();

const DomainRouter = () => {
  const [shouldRedirect, setShouldRedirect] = useState<string | null>(null);

  useEffect(() => {
    const hostname = window.location.hostname;
    const pathname = window.location.pathname;
    
    // Route travelone-buddy.vercel.app to guide pages
    if (hostname === 'travelone-buddy.vercel.app' && !pathname.startsWith('/guide')) {
      setShouldRedirect('/guide');
    }
    // Route travelone-home.vercel.app to tourist pages (root)
    else if (hostname === 'travelone-home.vercel.app' && pathname.startsWith('/guide')) {
      setShouldRedirect('/');
    }
  }, []);

  if (shouldRedirect) {
    return <Navigate to={shouldRedirect} replace />;
  }

  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <CurrencyProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <DomainRouter />
        <Routes>
          <Route path="/" element={<Index />} />
          
          <Route path="/tours" element={<BrowseTours />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/events" element={<Events />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/support" element={<Support />} />
          <Route path="/discounts" element={<Discounts />} />
          <Route path="/safety" element={<Safety />} />
          <Route path="/find-buddy" element={<FindBuddy />} />
          <Route path="/my-requests" element={<MyRequests />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/interested-guides/:requestId" element={<InterestedGuides />} />
          <Route path="/meeting-route/:requestId" element={<MeetingRoute />} />
          <Route path="/map" element={<Map />} />
          
          {/* Guide Routes */}
          <Route path="/guide/auth" element={<GuideAuth />} />
        <Route path="/guide" element={<GuideDashboard />} />
        <Route path="/guide/tours" element={<GuideTours />} />
        <Route path="/guide/bookings" element={<GuideBookings />} />
        <Route path="/guide/profile" element={<GuideProfile />} />
        <Route path="/guide/kyc" element={<GuideKYC />} />
        <Route path="/guide/requests" element={<GuideRequests />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
    </CurrencyProvider>
  </QueryClientProvider>
);

export default App;
