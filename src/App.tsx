
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Welcome from "./pages/Welcome";
import ConsumerOnboarding from "./pages/ConsumerOnboarding";
import RestaurantOnboarding from "./pages/RestaurantOnboarding";
import Profile from "./pages/Profile";
import RestaurantDashboard from "./pages/RestaurantDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/feed" element={<Index />} />
          <Route path="/onboarding/consumer" element={<ConsumerOnboarding />} />
          <Route path="/onboarding/restaurant" element={<RestaurantOnboarding />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/restaurant-dashboard" element={<RestaurantDashboard />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
