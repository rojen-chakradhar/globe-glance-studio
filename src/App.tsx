import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
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
          <Route path="/interested-guides/:requestId" element={<InterestedGuides />} />
          <Route path="/meeting-route/:requestId" element={<MeetingRoute />} />
          
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
  </QueryClientProvider>
);

export default App;
