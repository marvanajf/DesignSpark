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

export default function PricingPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlanType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleSelectPlan = (planId: SubscriptionPlanType) => {
    if (planId === 'free') {
      toast({
        title: "Free Plan Selected",
        description: "You're already on the free plan. Enjoy your experience with Tovably!",
      });
      return;
    }
    
    setSelectedPlan(planId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPlan(null);
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
              const isProPlan = planId === 'professional';
              const isPremiumPlan = planId === 'premium';
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
                  
                  {/* Popular tag */}
                  {isProPlan && (
                    <div className="absolute -top-3 left-0 right-0 mx-auto text-center">
                      <span className="bg-[#74d1ea] text-black text-xs font-bold px-4 py-1 rounded-full shadow-[0_0_10px_rgba(116,209,234,0.5)]">
                        MOST POPULAR
                      </span>
                    </div>
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
                      {!isFreePlan && <span className="text-sm text-gray-400">/month</span>}
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
                        <span className="text-gray-300">{plan.contentGeneration} Content Pieces</span>
                      </li>
                      <li className="flex items-center">
                        {isFreePlan ? (
                          <div className="flex-shrink-0 w-5 h-5 rounded-full mr-2 flex items-center justify-center bg-red-500/20">
                            <X className="h-3 w-3 text-red-500" />
                          </div>
                        ) : (
                          <div className="flex-shrink-0 w-5 h-5 rounded-full mr-2 flex items-center justify-center bg-[#74d1ea]/20">
                            <Check className="h-3 w-3 text-[#74d1ea]" />
                          </div>
                        )}
                        <span className="text-gray-300">Email Support</span>
                      </li>
                      <li className="flex items-center">
                        {['free', 'standard'].includes(planId) ? (
                          <div className="flex-shrink-0 w-5 h-5 rounded-full mr-2 flex items-center justify-center bg-red-500/20">
                            <X className="h-3 w-3 text-red-500" />
                          </div>
                        ) : (
                          <div className="flex-shrink-0 w-5 h-5 rounded-full mr-2 flex items-center justify-center bg-[#74d1ea]/20">
                            <Check className="h-3 w-3 text-[#74d1ea]" />
                          </div>
                        )}
                        <span className="text-gray-300">Priority Support</span>
                      </li>
                      <li className="flex items-center">
                        {isPremiumPlan ? (
                          <div className="flex-shrink-0 w-5 h-5 rounded-full mr-2 flex items-center justify-center bg-[#74d1ea]/20">
                            <Check className="h-3 w-3 text-[#74d1ea]" />
                          </div>
                        ) : (
                          <div className="flex-shrink-0 w-5 h-5 rounded-full mr-2 flex items-center justify-center bg-red-500/20">
                            <X className="h-3 w-3 text-red-500" />
                          </div>
                        )}
                        <span className="text-gray-300">API Access</span>
                      </li>
                    </ul>
                  </div>

                  <div className="px-6 pb-6">
                    <Button 
                      className={`w-full font-medium transition-all duration-300 ${
                        !isFreePlan 
                          ? 'bg-[#74d1ea] hover:bg-[#5db8d0] text-black shadow-[0_0_15px_rgba(116,209,234,0.4)] hover:shadow-[0_0_20px_rgba(116,209,234,0.6)]' 
                          : 'border-gray-700 hover:border-gray-500 text-gray-300 hover:text-white'
                      }`}
                      disabled={user?.subscription_plan === planId}
                      onClick={() => handleSelectPlan(planId as SubscriptionPlanType)}
                    >
                      {user?.subscription_plan === planId 
                        ? "Current Plan" 
                        : isFreePlan 
                          ? "Get Started" 
                          : "Subscribe"}
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
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1: AI Personas */}
              <div className="bg-black border border-gray-700/60 rounded-lg p-8 transform transition-all duration-300 hover:scale-105 hover:shadow-[0_0_25px_rgba(116,209,234,0.2)]">
                <div className="h-12 w-12 rounded-full bg-[#74d1ea]/10 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-[#74d1ea]" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">AI Personas</h3>
                <p className="text-gray-400 mb-4">
                  Create and customize AI personas tailored to your target audience. Generate content that resonates with specific demographics and communication styles.
                </p>
                <div className="flex items-center text-[#74d1ea]">
                  <span className="text-sm font-medium">Learn more</span>
                  <Zap className="ml-2 h-4 w-4" />
                </div>
              </div>
              
              {/* Feature 2: Tone Analysis */}
              <div className="bg-black border border-gray-700/60 rounded-lg p-8 transform transition-all duration-300 hover:scale-105 hover:shadow-[0_0_25px_rgba(116,209,234,0.2)]">
                <div className="h-12 w-12 rounded-full bg-[#74d1ea]/10 flex items-center justify-center mb-4">
                  <BarChart4 className="h-6 w-6 text-[#74d1ea]" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Tone Analysis</h3>
                <p className="text-gray-400 mb-4">
                  Analyze and optimize your content's tone for maximum impact. Identify key characteristics and patterns to ensure your message connects effectively.
                </p>
                <div className="flex items-center text-[#74d1ea]">
                  <span className="text-sm font-medium">Learn more</span>
                  <Zap className="ml-2 h-4 w-4" />
                </div>
              </div>
              
              {/* Feature 3: Content Generation */}
              <div className="bg-black border border-gray-700/60 rounded-lg p-8 transform transition-all duration-300 hover:scale-105 hover:shadow-[0_0_25px_rgba(116,209,234,0.2)]">
                <div className="h-12 w-12 rounded-full bg-[#74d1ea]/10 flex items-center justify-center mb-4">
                  <MessagesSquare className="h-6 w-6 text-[#74d1ea]" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Content Generation</h3>
                <p className="text-gray-400 mb-4">
                  Generate professional content instantly based on your tone analysis and personas. Create emails, posts, and more tailored to your brand voice.
                </p>
                <div className="flex items-center text-[#74d1ea]">
                  <span className="text-sm font-medium">Learn more</span>
                  <Zap className="ml-2 h-4 w-4" />
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
                  Yes, for organizations with more extensive needs, contact us at <a href="mailto:sales@tovably.com" className="text-[#74d1ea] hover:underline">sales@tovably.com</a> for custom pricing and features.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}