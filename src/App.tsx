import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { supabase } from "./integrations/supabase/client";
import { StrictMode } from "react";
import Index from "./pages/Index";
import Venues from "./pages/Venues";
import VenueDetails from "./pages/VenueDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AddVenue from "./pages/AddVenue";
import UserDashboard from "./pages/UserDashboard";
import UserProfile from "./pages/UserProfile";
import VenueOwnerDashboard from "./pages/VenueOwnerDashboard";
import BookingManagement from "./pages/BookingManagement";
import Reviews from "./pages/Reviews";
import Support from "./pages/Support";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const AppContent = () => (
  <QueryClientProvider client={queryClient}>
    <SessionContextProvider supabaseClient={supabase}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/venue-booking" element={<Index />} />
            <Route path="/venues" element={<Venues />} />
            <Route path="/venues/:id" element={<VenueDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/add-venue" element={<AddVenue />} />
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/venue-owner" element={<VenueOwnerDashboard />} />
            <Route path="/bookings" element={<BookingManagement />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/support" element={<Support />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </SessionContextProvider>
  </QueryClientProvider>
);

const App = () => (
  <StrictMode>
    <AppContent />
  </StrictMode>
);

export default App;