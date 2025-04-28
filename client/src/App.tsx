import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import { AuthModalProvider, useAuthModal } from "@/hooks/use-auth-modal";
import { Switch, Route, useLocation } from "wouter";
import { useEffect } from "react";
import HomePage from "@/pages/home-page";
import DashboardPage from "@/pages/dashboard-page";
import ToneAnalysisPage from "@/pages/tone-analysis-page";
import ToneResultsPage from "@/pages/tone-results-page";
import PersonaSelectionPage from "@/pages/persona-selection-page";
import ContentGeneratorPage from "@/pages/content-generator-page";
import SavedContentPage from "@/pages/saved-content-page";
import NotFound from "@/pages/not-found";
import { ProtectedRoute } from "@/lib/protected-route";
import AuthModal from "@/components/AuthModal";

function Router() {
  const [location, setLocation] = useLocation();
  const { openAuthModal, isAuthModalOpen } = useAuthModal();
  
  // Handle redirect from /auth to home
  useEffect(() => {
    if (location === "/auth") {
      setLocation("/");
      // Open the auth modal when redirected from /auth
      setTimeout(() => {
        openAuthModal();
      }, 0);
    }
  }, [location, setLocation, openAuthModal]);

  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <ProtectedRoute path="/dashboard" component={DashboardPage} />
      <ProtectedRoute path="/tone-analysis" component={ToneAnalysisPage} />
      <ProtectedRoute path="/tone-results/:id" component={ToneResultsPage} />
      <ProtectedRoute path="/personas" component={PersonaSelectionPage} />
      <ProtectedRoute path="/content-generator" component={ContentGeneratorPage} />
      <ProtectedRoute path="/saved-content" component={SavedContentPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const { isAuthModalOpen, closeAuthModal } = useAuthModal();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} />
          <Router />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
