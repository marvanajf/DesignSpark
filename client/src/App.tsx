import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import { Switch, Route, useLocation } from "wouter";
import { createContext, useContext, useState, useEffect } from "react";
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

// Create an authentication modal context
interface AuthModalContextType {
  openAuthModal: () => void;
  closeAuthModal: () => void;
  isAuthModalOpen: boolean;
}

export const AuthModalContext = createContext<AuthModalContextType>({
  openAuthModal: () => {},
  closeAuthModal: () => {},
  isAuthModalOpen: false,
});

export const useAuthModal = () => useContext(AuthModalContext);

function Router() {
  const [location, setLocation] = useLocation();
  const { openAuthModal } = useAuthModal();
  
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
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  
  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <AuthModalContext.Provider value={{ openAuthModal, closeAuthModal, isAuthModalOpen }}>
            <Toaster />
            <AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} />
            <Router />
          </AuthModalContext.Provider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
