import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import { useAuthModal } from "@/hooks/use-auth-modal";
import { PricingModalProvider } from "@/hooks/use-pricing-modal";
import { UserAvatarProvider } from "@/contexts/user-avatar-context";
import { Switch, Route, useLocation } from "wouter";
import { useEffect } from "react";
import HomePage from "@/pages/home-page";
import DashboardPage from "@/pages/dashboard-page";
import ToneAnalysisPage from "@/pages/tone-analysis-page-new";
import ToneResultsPage from "@/pages/tone-results-page";
import PersonaSelectionPage from "@/pages/persona-selection-page";
import ContentGeneratorPage from "@/pages/content-generator-page";
import SavedContentPage from "@/pages/saved-content-page";
import AccountPage from "@/pages/account-page";
import SupportPage from "@/pages/support-page";
import GuidesPage from "@/pages/guides-page";
import UsagePage from "@/pages/usage-page";
import CampaignFactoryPage from "@/pages/campaign-factory-page";
import CampaignFactoryInfo from "@/pages/campaign-factory-info";
import GuidesMarketingPage from "@/pages/guides-marketing-page";
import ToneAnalysisMarketingPage from "@/pages/tone-analysis-marketing-page";
import ContentGenerationMarketingPage from "@/pages/content-generation-marketing-page";
import PersonasMarketingPage from "@/pages/personas-marketing-page";
import LandingPage from "@/pages/landing-page";
import ComingSoonPage from "@/pages/coming-soon-page";
import ContactPage from "@/pages/contact-page";
import PricingPage from "@/pages/pricing-page";
import PaymentSuccessPage from "@/pages/payment-success-page";
import PrivacyPolicyPage from "@/pages/privacy-policy-page";
import AboutPage from "@/pages/about-page";
import FeaturesPage from "@/pages/features-page";
import BlogPage from "@/pages/blog-page";
import BlogPostPage from "@/pages/blog-post-page";
import CampaignPage from "@/pages/campaign-page";
import CampaignsPage from "@/pages/campaigns-page";
import CampaignsInfoPage from "@/pages/campaigns-info";
import AdminPage from "@/pages/admin-page";
import ModalPreviewPage from "@/pages/modal-preview-page";
import NotFound from "@/pages/not-found";
import { ProtectedRoute } from "@/lib/protected-route";
import AuthModal from "@/components/AuthModal";
import { CookieConsent } from "@/components/CookieConsent";

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
      <Route path="/coming-soon" component={ComingSoonPage} />
      <ProtectedRoute path="/dashboard" component={DashboardPage} />
      <Route path="/tone-analysis-info" component={ToneAnalysisMarketingPage} />
      <Route path="/content-generation-info" component={ContentGenerationMarketingPage} />
      <Route path="/personas-info" component={PersonasMarketingPage} />
      <Route path="/campaigns-info" component={CampaignsInfoPage} />
      <Route path="/campaign-factory-info" component={CampaignFactoryInfo} />
      <Route path="/guides-info" component={GuidesMarketingPage} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/pricing" component={PricingPage} />
      <Route path="/payment-success" component={PaymentSuccessPage} />
      <Route path="/privacy-policy" component={PrivacyPolicyPage} />
      <Route path="/about" component={AboutPage} />
      <Route path="/features" component={FeaturesPage} />
      <Route path="/blog" component={BlogPage} />
      <Route path="/blog/:id" component={BlogPostPage} />
      <ProtectedRoute path="/tone-analysis" component={ToneAnalysisPage} />
      <ProtectedRoute path="/tone-results/:id" component={ToneResultsPage} />
      <ProtectedRoute path="/personas" component={PersonaSelectionPage} />
      <ProtectedRoute path="/content-generator" component={ContentGeneratorPage} />
      <ProtectedRoute path="/saved-content" component={SavedContentPage} />
      <ProtectedRoute path="/campaigns" component={CampaignsPage} />
      <ProtectedRoute path="/campaign/:id" component={CampaignPage} />
      <ProtectedRoute path="/guides" component={GuidesPage} />
      <ProtectedRoute path="/campaign-factory" component={CampaignFactoryPage} />
      <ProtectedRoute path="/account" component={AccountPage} />
      <ProtectedRoute path="/usage" component={UsagePage} />
      <ProtectedRoute path="/support" component={SupportPage} />
      <ProtectedRoute path="/admin" component={AdminPage} />
      <ProtectedRoute path="/modal-preview" component={ModalPreviewPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // Get the modal state and close function
  const { isAuthModalOpen, closeAuthModal } = useAuthModal();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <PricingModalProvider>
            <UserAvatarProvider>
              <Toaster />
              {isAuthModalOpen && (
                <AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} />
              )}
              <CookieConsent />
              <Router />
            </UserAvatarProvider>
          </PricingModalProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
