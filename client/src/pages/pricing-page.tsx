import React, { useState } from "react";
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
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
          {/* Heading section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight text-white mb-3">
              Choose Your Subscription Plan
            </h1>
            <p className="text-gray-400 max-w-3xl mx-auto">
              Select the plan that best fits your needs. All plans include access to our core features, with
              higher tiers offering more usage allowances and premium features.
            </p>
          </div>

          {/* Pricing cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {Object.entries(subscriptionPlans).map(([planId, plan], index) => (
              <div 
                key={planId} 
                className={`relative group transform transition-all duration-300 hover:scale-105 bg-black rounded-lg overflow-hidden h-full ${
                  planId === 'professional' 
                    ? 'border-2 border-[#74d1ea] shadow-[0_0_25px_rgba(116,209,234,0.3)]' 
                    : 'border border-gray-700/60'
                }`}
              >
                {/* Accent top border */}
                <div className={`h-1 w-full bg-gradient-to-r ${
                  planId === 'free' ? 'from-gray-700 to-gray-600' :
                  planId === 'standard' ? 'from-[#53b0c9] to-[#74d1ea]' :
                  planId === 'professional' ? 'from-[#74d1ea] to-[#53b0c9]' :
                  'from-[#74d1ea] via-[#53b0c9] to-[#74d1ea]'
                }`}></div>
                
                {planId === 'professional' && (
                  <div className="absolute -top-3 left-0 right-0 mx-auto text-center">
                    <span className="bg-[#74d1ea] text-black text-xs font-bold px-3 py-1 rounded-full">
                      MOST POPULAR
                    </span>
                  </div>
                )}
                
                <div className="p-6 text-center mt-2">
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {plan.name}
                    {user?.subscription_plan === planId && (
                      <span className="ml-2 text-xs px-2 py-1 bg-[#74d1ea] text-black rounded-full">Current</span>
                    )}
                  </h3>
                  
                  <div className="text-center mb-3">
                    <span className="text-4xl font-bold text-white">{plan.displayPrice}</span>
                    {planId !== 'free' && <span className="text-sm text-gray-400">/month</span>}
                  </div>
                  
                  <p className="text-gray-400 text-sm mb-5 pb-2 border-b border-gray-800">
                    {planId === 'free' ? 'Get started with basic features' : 
                     planId === 'standard' ? 'Perfect for professionals' : 
                     planId === 'professional' ? 'Ideal for growing businesses' : 
                     'For demanding content creators'}
                  </p>

                  <ul className="space-y-3 text-sm text-left mb-6">
                    <li className="flex items-center">
                      <Check className={`mr-2 h-4 w-4 ${planId !== 'free' ? 'text-[#74d1ea]' : 'text-emerald-500'}`} />
                      <span className="text-gray-300">{plan.personas} AI Personas</span>
                    </li>
                    <li className="flex items-center">
                      <Check className={`mr-2 h-4 w-4 ${planId !== 'free' ? 'text-[#74d1ea]' : 'text-emerald-500'}`} />
                      <span className="text-gray-300">{plan.toneAnalyses} Tone Analyses</span>
                    </li>
                    <li className="flex items-center">
                      <Check className={`mr-2 h-4 w-4 ${planId !== 'free' ? 'text-[#74d1ea]' : 'text-emerald-500'}`} />
                      <span className="text-gray-300">{plan.contentGeneration} Content Pieces</span>
                    </li>
                    <li className="flex items-center">
                      {planId === 'free' ? (
                        <X className="mr-2 h-4 w-4 text-red-500" />
                      ) : (
                        <Check className="mr-2 h-4 w-4 text-[#74d1ea]" />
                      )}
                      <span className="text-gray-300">Email Support</span>
                    </li>
                    <li className="flex items-center">
                      {['free', 'standard'].includes(planId) ? (
                        <X className="mr-2 h-4 w-4 text-red-500" />
                      ) : (
                        <Check className="mr-2 h-4 w-4 text-[#74d1ea]" />
                      )}
                      <span className="text-gray-300">Priority Support</span>
                    </li>
                    <li className="flex items-center">
                      {planId === 'premium' ? (
                        <Check className="mr-2 h-4 w-4 text-[#74d1ea]" />
                      ) : (
                        <X className="mr-2 h-4 w-4 text-red-500" />
                      )}
                      <span className="text-gray-300">API Access</span>
                    </li>
                  </ul>
                </div>

                <div className="px-6 pb-6">
                  <Button 
                    className={`w-full transition-all duration-300 ${
                      planId !== 'free' 
                        ? 'bg-[#74d1ea] hover:bg-[#5db8d0] text-black shadow-[0_0_10px_rgba(116,209,234,0.3)] hover:shadow-[0_0_15px_rgba(116,209,234,0.5)]' 
                        : 'border-gray-700 hover:border-gray-500 text-gray-300 hover:text-white'
                    }`}
                    disabled={user?.subscription_plan === planId}
                    onClick={() => handleSelectPlan(planId as SubscriptionPlanType)}
                  >
                    {user?.subscription_plan === planId 
                      ? "Current Plan" 
                      : planId === 'free' 
                        ? "Get Started" 
                        : "Subscribe"}
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {selectedPlan && (
            <PricingModal 
              isOpen={isModalOpen} 
              onClose={closeModal} 
              plan={subscriptionPlans[selectedPlan]}
              planId={selectedPlan}
            />
          )}

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