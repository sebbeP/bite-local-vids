// ============================================
// MAIN APPLICATION COMPONENT - JavaScript Version
// ============================================
// This is the root component that sets up routing, providers, and global state
// Organized by functionality: App Setup, Routing Configuration, Provider Wrapping

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";

// ============================================
// PAGE COMPONENT IMPORTS
// ============================================
// TODO: Convert remaining .tsx files to .js when needed

import Index from "./pages/Index";
import Welcome from "./pages/Welcome";
import Auth from "./pages/Auth";
import ConsumerOnboarding from "./pages/ConsumerOnboarding";
import RestaurantOnboarding from "./pages/RestaurantOnboarding";
import Profile from "./pages/Profile"; // Now using JavaScript version
import RestaurantDashboard from "./pages/RestaurantDashboard";
import Search from "./pages/Search";
import NotFound from "./pages/NotFound";

// ============================================
// GLOBAL CONFIGURATION
// ============================================

/**
 * React Query Client Configuration
 * Manages server state and caching for API calls to C# backend
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // TODO: Configure for C# backend API calls
      retry: 3,
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 10, // 10 minutes
    },
    mutations: {
      // TODO: Configure for C# backend mutations
      retry: 1,
    }
  }
});

// ============================================
// MAIN APPLICATION COMPONENT
// ============================================

/**
 * Main App Component
 * Sets up the entire application with providers and routing
 * 
 * Provider Hierarchy:
 * 1. QueryClientProvider - Manages API state and caching
 * 2. AuthProvider - Manages user authentication and session
 * 3. TooltipProvider - Manages UI tooltip functionality
 * 4. BrowserRouter - Handles client-side routing
 * 
 * @returns {React.Component} Main application component
 */
const App = () => (
  
  // ============================================
  // API STATE MANAGEMENT PROVIDER
  // ============================================
  <QueryClientProvider client={queryClient}>
    
    {/* ============================================ */}
    {/* USER AUTHENTICATION PROVIDER */}
    {/* ============================================ */}
    <AuthProvider>
      
      {/* ============================================ */}
      {/* UI COMPONENTS PROVIDER */}
      {/* ============================================ */}
      <TooltipProvider>
        
        {/* ============================================ */}
        {/* GLOBAL NOTIFICATION SYSTEMS */}
        {/* ============================================ */}
        
        {/* Toast notifications for user feedback */}
        <Toaster />
        
        {/* Sonner notifications for advanced alerts */}
        <Sonner />
        
        {/* ============================================ */}
        {/* CLIENT-SIDE ROUTING CONFIGURATION */}
        {/* ============================================ */}
        <BrowserRouter>
          <Routes>
            
            {/* ============================================ */}
            {/* PUBLIC ROUTES - No Authentication Required */}
            {/* ============================================ */}
            
            {/* Landing/Welcome Page */}
            <Route path="/" element={<Welcome />} />
            
            {/* Authentication Page - Login/Register */}
            <Route path="/auth" element={<Auth />} />
            
            {/* ============================================ */}
            {/* PROTECTED ROUTES - Authentication Required */}
            {/* TODO: Add authentication guards for C# backend */}
            {/* ============================================ */}
            
            {/* Main Feed Page - Primary app interface */}
            <Route path="/feed" element={<Index />} />
            
            {/* User Profile Page - JavaScript version */}
            <Route path="/profile" element={<Profile />} />
            
            {/* Search/Discovery Page */}
            <Route path="/search" element={<Search />} />
            
            {/* ============================================ */}
            {/* ONBOARDING ROUTES - New User Setup */}
            {/* ============================================ */}
            
            {/* Consumer User Onboarding Flow */}
            <Route path="/onboarding/consumer" element={<ConsumerOnboarding />} />
            
            {/* Restaurant Owner Onboarding Flow */}
            <Route path="/onboarding/restaurant" element={<RestaurantOnboarding />} />
            
            {/* ============================================ */}
            {/* RESTAURANT MANAGEMENT ROUTES */}
            {/* ============================================ */}
            
            {/* Restaurant Dashboard - Business Management */}
            <Route path="/restaurant-dashboard" element={<RestaurantDashboard />} />
            
            {/* ============================================ */}
            {/* ERROR HANDLING */}
            {/* ============================================ */}
            
            {/* IMPORTANT: Keep this route last - catches all undefined routes */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
