import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Check, 
  X, 
  MessagesSquare, 
  Zap, 
  LineChart, 
  BarChart4, 
  Users 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import PricingModal from "@/components/PricingModal";
import { subscriptionPlans } from "@shared/schema";
import { SubscriptionPlanType } from "@shared/schema";
import Layout from "@/components/Layout";
import { queryClient } from "@/lib/queryClient";
import ConfirmationModal from "@/components/ConfirmationModal";

export default function PricingPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlanType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState<boolean>(false);

  const handleSelectPlan = (planId: SubscriptionPlanType) => {
    // Check if user is trying to downgrade to free plan
    if (planId === 'free' && user?.subscription_plan !== 'free') {
      // Open the confirmation modal instead of using the browser's confirm
      setIsCancelModalOpen(true);
      return;
    }

    // If they're already on the free plan and selecting free plan again
    if (planId === 'free' && user?.subscription_plan === 'free') {
      toast({
        title: "Free Plan Selected",
        description: "You're already on the free plan. Enjoy your experience with Tovably!",
      });
      return;
    }
    
    // Allow any user to select a paid plan, whether logged in or not
    setSelectedPlan(planId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPlan(null);
  };
  
  const closeCancelModal = () => {
    setIsCancelModalOpen(false);
  };
  
  const handleCancelSubscription = async () => {
    try {
      setIsLoading(true);
      
      // Call our API endpoint
      const response = await fetch('/api/cancel-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to cancel subscription');
      }
      
      // Success - refresh the user query to get updated plan info
      await queryClient.invalidateQueries({ queryKey: ['/api/user'] });
      
      // Close the modal
      setIsCancelModalOpen(false);
      
      toast({
        title: "Subscription Canceled",
        description: "Your subscription has been canceled and you have been downgraded to the free plan.",
      });
    } catch (error) {
      console.error("Error canceling subscription:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to cancel subscription",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="py-12 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Heading section inspired by the screenshot */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              <span className="block text-white">Choose Your</span>
              <span className="block text-[#74d1ea]">Subscription Plan</span>
            </h1>
            <p className="text-gray-400 max-w-3xl mx-auto text-lg">
              Select the plan that best fits your needs. All plans include access to our core features, with
              higher tiers offering more usage allowances and premium features.
            </p>
          </div>

          {/* Pricing cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {Object.entries(subscriptionPlans).map(([planId, plan], index) => {
              // Calculate different visual styling based on plan
              const isProPlan = planId === 'premium'; // Pro plan is now the premium tier
              const isPremiumPlan = planId === 'professional'; // Premium plan is now the professional tier
              const isFreePlan = planId === 'free';
              const isPaidPlan = !isFreePlan;
              
              return (
                <div 
                  key={planId} 
                  className={`relative group transform transition-all duration-300 hover:scale-105 bg-black rounded-lg overflow-hidden h-full ${
                    isProPlan 
                      ? 'border-[1.5px] border-[#74d1ea] shadow-[0_0_35px_rgba(116,209,234,0.4)]' 
                      : isPremiumPlan
                        ? 'border-[1.5px] border-[#5db8d0] shadow-[0_0_25px_rgba(116,209,234,0.25)]'
                        : 'border border-gray-700/60'
                  }`}
                >
                  {/* Glowing background effect */}
                  {isPaidPlan && (
                    <div 
                      className="absolute inset-0 opacity-5 bg-[#74d1ea] blur-3xl rounded-full -z-10 group-hover:opacity-10 transition-opacity"
                      style={{
                        width: '150%',
                        height: '150%',
                        top: '-25%',
                        left: '-25%',
                      }}
                    ></div>
                  )}
                  
                  {/* Top accent gradient */}
                  <div className={`h-2 w-full bg-gradient-to-r ${
                    isFreePlan ? 'from-gray-800 to-gray-700' :
                    planId === 'standard' ? 'from-[#53b0c9] to-[#74d1ea]' :
                    isProPlan ? 'from-[#74d1ea] via-[#53b0c9] to-[#74d1ea]' :
                    'from-[#74d1ea] via-[#53b0c9] to-[#40a3bd]'
                  }`}></div>
                  
                  {/* Professional plan highlighted styling with extra glow */}
                  {isProPlan && (
                    <>
                      {/* Top glow bar */}
                      <div className="absolute -top-1 -left-1 -right-1 h-1 bg-gradient-to-r from-[#74d1ea]/30 via-[#74d1ea] to-[#74d1ea]/30 blur-md"></div>
                      
                      {/* Subtle corner glows */}
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#74d1ea]/20 rounded-full blur-md"></div>
                      <div className="absolute -top-2 -left-2 w-8 h-8 bg-[#74d1ea]/20 rounded-full blur-md"></div>
                      
                      {/* Extra border brightness */}
                      <div className="absolute inset-0 border border-[#74d1ea]/30 rounded-[7px] pointer-events-none"></div>
                    </>
                  )}
                  
                  <div className="p-6 text-center mt-2">
                    {/* Plan name with current indicator */}
                    <h3 className={`text-xl font-bold mb-2 ${isPaidPlan ? 'text-[#74d1ea]' : 'text-white'}`}>
                      {plan.name}
                      {user?.subscription_plan === planId && (
                        <span className="ml-2 text-xs px-2 py-1 bg-[#74d1ea] text-black rounded-full">
                          Current
                        </span>
                      )}
                    </h3>
                    
                    {/* Price display */}
                    <div className="text-center mb-3">
                      <span className="text-4xl font-bold text-white">{plan.displayPrice}</span>
                      {!isFreePlan && <span className="text-xl text-gray-400 ml-1">/month</span>}
                    </div>
                    
                    {/* Plan description */}
                    <p className="text-gray-400 text-sm mb-5 pb-3 border-b border-gray-800/50">
                      {isFreePlan ? 'Get started with basic features' : 
                      planId === 'standard' ? 'Perfect for professionals' : 
                      isProPlan ? 'Ideal for growing businesses' : 
                      'For demanding content creators'}
                    </p>

                    {/* Features list */}
                    <ul className="space-y-3 text-sm text-left mb-8">
                      <li className="flex items-center">
                        <div className="flex-shrink-0 w-5 h-5 rounded-full mr-2 flex items-center justify-center bg-[#74d1ea]/20">
                          <Check className="h-3 w-3 text-[#74d1ea]" />
                        </div>
                        <span className="text-gray-300">{plan.personas} AI Personas</span>
                      </li>
                      <li className="flex items-center">
                        <div className="flex-shrink-0 w-5 h-5 rounded-full mr-2 flex items-center justify-center bg-[#74d1ea]/20">
                          <Check className="h-3 w-3 text-[#74d1ea]" />
                        </div>
                        <span className="text-gray-300">{plan.toneAnalyses} Tone Analyses</span>
                      </li>
                      <li className="flex items-center">
                        <div className="flex-shrink-0 w-5 h-5 rounded-full mr-2 flex items-center justify-center bg-[#74d1ea]/20">
                          <Check className="h-3 w-3 text-[#74d1ea]" />
                        </div>
                        <span className="text-gray-300">{plan.contentGeneration} Content Creations</span>
                      </li>
                      <li className="flex items-center">
                        <div className="flex-shrink-0 w-5 h-5 rounded-full mr-2 flex items-center justify-center bg-[#74d1ea]/20">
                          <Check className="h-3 w-3 text-[#74d1ea]" />
                        </div>
                        <span className="text-gray-300">{plan.campaigns} Campaigns</span>
                      </li>
                      <li className="flex items-center">
                        <div className="flex-shrink-0 w-5 h-5 rounded-full mr-2 flex items-center justify-center bg-[#74d1ea]/20">
                          {plan.campaignFactory > 0 ? (
                            <Check className="h-3 w-3 text-[#74d1ea]" />
                          ) : (
                            <X className="h-3 w-3 text-red-500" />
                          )}
                        </div>
                        <span className="text-gray-300">
                          {plan.campaignFactory > 0 
                            ? `${plan.campaignFactory} Campaign Factory Credits` 
                            : 'No Campaign Factory Access'}
                        </span>
                      </li>
                      <li className="flex items-center">
                        <div className="flex-shrink-0 w-5 h-5 rounded-full mr-2 flex items-center justify-center bg-[#74d1ea]/20">
                          <Check className="h-3 w-3 text-[#74d1ea]" />
                        </div>
                        <span className="text-gray-300">{planId === 'free' ? 'Standard Support' : 'Priority Support'}</span>
                      </li>

                    </ul>
                  </div>

                  <div className="px-6 pb-6">
                    <Button 
                      className={`w-full font-medium transition-all duration-300 ${
                        !isFreePlan 
                          ? 'bg-[#74d1ea] hover:bg-[#5db8d0] text-black shadow-[0_0_15px_rgba(116,209,234,0.4)] hover:shadow-[0_0_20px_rgba(116,209,234,0.6)]' 
                          : 'bg-transparent border border-[#74d1ea]/30 hover:border-[#74d1ea] text-[#74d1ea] hover:text-white hover:shadow-[0_0_15px_rgba(116,209,234,0.3)]'
                      }`}
                      disabled={user?.subscription_plan === planId}
                      onClick={() => handleSelectPlan(planId as SubscriptionPlanType)}
                    >
                      {user?.subscription_plan === planId 
                        ? "Current Plan" 
                        : (() => {
                            // No user or on free plan trying to upgrade
                            if (!user || user.subscription_plan === 'free') {
                              return isFreePlan ? "Get Started" : "Upgrade to " + plan.name;
                            }
                            
                            // User on paid plan
                            if (isFreePlan) {
                              return "Go Back to Free";
                            }
                            
                            // User changing between paid plans - determine if upgrade or downgrade
                            const currentPlanIndex = Object.keys(subscriptionPlans).indexOf(user.subscription_plan);
                            const targetPlanIndex = Object.keys(subscriptionPlans).indexOf(planId);
                            
                            if (targetPlanIndex > currentPlanIndex) {
                              return "Upgrade to " + plan.name;
                            } else {
                              return "Downgrade to " + plan.name;
                            }
                          })()}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          {selectedPlan && (
            <PricingModal 
              isOpen={isModalOpen} 
              onClose={closeModal} 
              plan={subscriptionPlans[selectedPlan]}
              planId={selectedPlan}
            />
          )}
          
          {/* Confirmation modal for subscription cancellation */}
          <ConfirmationModal
            isOpen={isCancelModalOpen}
            onClose={closeCancelModal}
            onConfirm={handleCancelSubscription}
            title="Cancel Subscription"
            description="Are you sure you want to cancel your subscription and downgrade to the free plan? You will lose access to premium features and your usage limits will be reduced."
            confirmText="Yes, Cancel Subscription"
            cancelText="No, Keep My Plan"
            isLoading={isLoading}
          />

          {/* Feature promo sections */}
          <div className="mb-20">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-white mb-4">
                Master <span className="text-[#74d1ea]">AI-powered</span> communication
              </h2>
              <p className="text-gray-400 max-w-3xl mx-auto">
                Leverage advanced AI technologies for more effective content creation, audience targeting, and professional communication.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
              {/* Feature 1: AI Personas */}
              <div className="relative bg-gradient-to-b from-black via-black to-black/90 border border-gray-700/60 rounded-lg p-8 overflow-hidden transform transition-all duration-300 hover:scale-105 group">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[#74d1ea]/5"></div>
                <div className="absolute -inset-1 opacity-0 group-hover:opacity-30 blur-xl bg-[#74d1ea]/20 group-hover:animate-pulse transition-opacity duration-700"></div>
                
                <div className="relative">
                  <div className="h-14 w-14 rounded-full bg-[#74d1ea]/10 flex items-center justify-center mb-5 group-hover:shadow-[0_0_15px_rgba(116,209,234,0.4)] transition-all duration-300">
                    <Users className="h-7 w-7 text-[#74d1ea] group-hover:animate-pulse" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#74d1ea] transition-colors duration-300">AI Personas</h3>
                  <p className="text-gray-400 mb-6">
                    Create and customize AI personas tailored to your target audience. Generate content that resonates with specific demographics and communication styles.
                  </p>
                  <div className="flex items-center text-[#74d1ea] group-hover:translate-x-1 transition-transform duration-300">
                    <span className="text-sm font-medium">Learn more</span>
                    <Zap className="ml-2 h-4 w-4 group-hover:animate-pulse" />
                  </div>
                </div>
              </div>
              
              {/* Feature 2: Tone Analysis */}
              <div className="relative bg-gradient-to-b from-black via-black to-black/90 border border-gray-700/60 rounded-lg p-8 overflow-hidden transform transition-all duration-300 hover:scale-105 group">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[#74d1ea]/5"></div>
                <div className="absolute -inset-1 opacity-0 group-hover:opacity-30 blur-xl bg-[#74d1ea]/20 group-hover:animate-pulse transition-opacity duration-700"></div>
                
                <div className="relative">
                  <div className="h-14 w-14 rounded-full bg-[#74d1ea]/10 flex items-center justify-center mb-5 group-hover:shadow-[0_0_15px_rgba(116,209,234,0.4)] transition-all duration-300">
                    <BarChart4 className="h-7 w-7 text-[#74d1ea] group-hover:animate-pulse" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#74d1ea] transition-colors duration-300">Tone Analysis</h3>
                  <p className="text-gray-400 mb-6">
                    Analyze and optimize your content's tone for maximum impact. Identify key characteristics and patterns to ensure your message connects effectively.
                  </p>
                  <div className="flex items-center text-[#74d1ea] group-hover:translate-x-1 transition-transform duration-300">
                    <span className="text-sm font-medium">Learn more</span>
                    <Zap className="ml-2 h-4 w-4 group-hover:animate-pulse" />
                  </div>
                </div>
              </div>
              
              {/* Feature 3: Content Generation */}
              <div className="relative bg-gradient-to-b from-black via-black to-black/90 border border-gray-700/60 rounded-lg p-8 overflow-hidden transform transition-all duration-300 hover:scale-105 group">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[#74d1ea]/5"></div>
                <div className="absolute -inset-1 opacity-0 group-hover:opacity-30 blur-xl bg-[#74d1ea]/20 group-hover:animate-pulse transition-opacity duration-700"></div>
                
                <div className="relative">
                  <div className="h-14 w-14 rounded-full bg-[#74d1ea]/10 flex items-center justify-center mb-5 group-hover:shadow-[0_0_15px_rgba(116,209,234,0.4)] transition-all duration-300">
                    <MessagesSquare className="h-7 w-7 text-[#74d1ea] group-hover:animate-pulse" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#74d1ea] transition-colors duration-300">Content Generation</h3>
                  <p className="text-gray-400 mb-6">
                    Generate professional content instantly based on your tone analysis and personas. Create emails, posts, and more tailored to your brand voice.
                  </p>
                  <div className="flex items-center text-[#74d1ea] group-hover:translate-x-1 transition-transform duration-300">
                    <span className="text-sm font-medium">Learn more</span>
                    <Zap className="ml-2 h-4 w-4 group-hover:animate-pulse" />
                  </div>
                </div>
              </div>
              
              {/* Feature 4: Campaign Factory */}
              <div className="relative bg-gradient-to-b from-black via-black to-black/90 border border-[#74d1ea]/40 rounded-lg p-8 overflow-hidden transform transition-all duration-300 hover:scale-105 group shadow-[0_0_15px_rgba(116,209,234,0.2)]">
                <div className="absolute inset-0 opacity-5 group-hover:opacity-100 transition-opacity duration-500 bg-[#74d1ea]/5"></div>
                <div className="absolute -inset-1 opacity-10 group-hover:opacity-30 blur-xl bg-[#74d1ea]/20 group-hover:animate-pulse transition-opacity duration-700"></div>
                
                <div className="absolute top-0 right-0 bg-[#74d1ea] text-black text-xs font-bold px-3 py-1 rounded-bl-lg">
                  PREMIUM
                </div>
                
                <div className="relative">
                  <div className="h-14 w-14 rounded-full bg-[#74d1ea]/20 flex items-center justify-center mb-5 group-hover:shadow-[0_0_20px_rgba(116,209,234,0.6)] transition-all duration-300">
                    <LineChart className="h-7 w-7 text-[#74d1ea] group-hover:animate-pulse" />
                  </div>
                  <h3 className="text-xl font-bold text-[#74d1ea] mb-3 group-hover:text-white transition-colors duration-300">Campaign Factory</h3>
                  <p className="text-gray-300 mb-6">
                    Generate complete marketing campaigns with our premium Campaign Factory feature. Create targeted content across multiple channels with a few clicks.
                  </p>
                  <div className="flex items-center text-[#74d1ea] group-hover:translate-x-1 transition-transform duration-300">
                    <span className="text-sm font-medium">Learn more</span>
                    <Zap className="ml-2 h-4 w-4 group-hover:animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Guarantee section */}
          <div className="mb-16">
            <div className="border border-gray-700/60 rounded-lg p-6 max-w-3xl mx-auto text-center">
              <h3 className="text-xl font-semibold mb-3 text-white">
                14-Day Money-Back Guarantee
              </h3>
              <p className="text-gray-400">
                Not satisfied with our service? Get a full refund within 14 days of your subscription.
                No questions asked. We're confident you'll love Tovably.
              </p>
            </div>
          </div>

          {/* FAQ section */}
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8 text-white">Frequently Asked Questions</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2 text-white">Can I upgrade or downgrade my plan?</h3>
                <p className="text-gray-400">Yes, you can upgrade or downgrade your subscription at any time. Changes will take effect at the beginning of your next billing cycle.</p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2 text-white">How does billing work?</h3>
                <p className="text-gray-400">Your subscription is billed monthly. You'll be charged on the same date each month. If you upgrade mid-cycle, we'll prorate the cost.</p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2 text-white">What happens if I exceed my plan limits?</h3>
                <p className="text-gray-400">You'll need to upgrade to a higher tier or wait until your next billing cycle when your usage limits are reset.</p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2 text-white">Is there an enterprise option?</h3>
                <p className="text-gray-400">
                  Yes, for organizations with more extensive needs, <a href="/contact" className="text-[#74d1ea] hover:underline">contact us</a> for custom pricing and features.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}