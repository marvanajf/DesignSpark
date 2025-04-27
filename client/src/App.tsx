import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import { Switch, Route } from "wouter";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import DashboardPage from "@/pages/dashboard-page";
import ToneAnalysisPage from "@/pages/tone-analysis-page";
import ToneResultsPage from "@/pages/tone-results-page";
import PersonaSelectionPage from "@/pages/persona-selection-page";
import ContentGeneratorPage from "@/pages/content-generator-page";
import SavedContentPage from "@/pages/saved-content-page";
import NotFound from "@/pages/not-found";
import { ProtectedRoute } from "@/lib/protected-route";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/auth" component={AuthPage} />
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
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Router />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
