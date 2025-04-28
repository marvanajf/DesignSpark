import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import { useAuthModal } from "@/hooks/use-auth-modal";
import { Switch, Route, useLocation } from "wouter";
import { useEffect } from "react";
import HomePage from "@/pages/home-page";
import DashboardPage from "@/pages/dashboard-page";
import ToneAnalysisPage from "@/pages/tone-analysis-page";
import ToneResultsPage from "@/pages/tone-results-page";
import PersonaSelectionPage from "@/pages/persona-selection-page";
import ContentGeneratorPage from "@/pages/content-generator-page";
import SavedContentPage from "@/pages/saved-content-page";
import AccountPage from "@/pages/account-page";
import SupportPage from "@/pages/support-page";
import ToneAnalysisMarketingPage from "@/pages/tone-analysis-marketing-page";
import ContentGenerationMarketingPage from "@/pages/content-generation-marketing-page";
import PersonasMarketingPage from "@/pages/personas-marketing-page";
import BlogPage from "@/pages/blog-page";
import BlogPostPage from "@/pages/blog-post-page";
import AdminPage from "@/pages/admin-page";
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
      <Route path="/tone-analysis-info" component={ToneAnalysisMarketingPage} />
      <Route path="/content-generation-info" component={ContentGenerationMarketingPage} />
      <Route path="/personas-info" component={PersonasMarketingPage} />
      <Route path="/blog" component={BlogPage} />
      <Route path="/blog/:id" component={BlogPostPage} />
      <ProtectedRoute path="/tone-analysis" component={ToneAnalysisPage} />
      <ProtectedRoute path="/tone-results/:id" component={ToneResultsPage} />
      <ProtectedRoute path="/personas" component={PersonaSelectionPage} />
      <ProtectedRoute path="/content-generator" component={ContentGeneratorPage} />
      <ProtectedRoute path="/saved-content" component={SavedContentPage} />
      <ProtectedRoute path="/account" component={AccountPage} />
      <ProtectedRoute path="/support" component={SupportPage} />
      <ProtectedRoute path="/admin" component={AdminPage} />
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
