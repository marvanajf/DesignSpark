import React, { useState } from "react";
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import PricingModal from "@/components/PricingModal";
import { subscriptionPlans } from "@shared/schema";
import { SubscriptionPlanType } from "@shared/schema";

const PricingPage: React.FC = () => {
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
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      {/* Heading with glow effect */}
      <div className="text-center mb-12">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold tracking-tight text-white mb-3"
        >
          Choose Your Subscription Plan
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-muted-foreground max-w-2xl mx-auto"
        >
          Select the plan that best fits your needs. All plans include access to our core features,
          with higher tiers offering more usage allowances and premium features.
        </motion.p>
      </div>

      {/* Pricing cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {Object.entries(subscriptionPlans).map(([planId, plan], index) => (
          <motion.div
            key={planId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 * (index + 1) }}
          >
            <Card className={`flex flex-col h-full ${user?.subscription_plan === planId ? 'border-primary border-2' : ''}`}>
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-center">
                  {plan.name}
                  {user?.subscription_plan === planId && (
                    <span className="ml-2 text-xs px-2 py-1 bg-primary text-black rounded-full">Current</span>
                  )}
                </CardTitle>
                <div className="text-center mt-2">
                  <span className="text-3xl font-bold text-white">{plan.displayPrice}</span>
                  {planId !== 'free' && <span className="text-sm text-muted-foreground">/month</span>}
                </div>
                <CardDescription className="text-center mt-1">
                  {planId === 'free' ? 'Get started with basic features' : 
                   planId === 'standard' ? 'Perfect for professionals' : 
                   planId === 'professional' ? 'Ideal for growing businesses' : 
                   'For demanding content creators'}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-emerald-500" />
                    <span>{plan.personas} AI Personas</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-emerald-500" />
                    <span>{plan.toneAnalyses} Tone Analyses</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-emerald-500" />
                    <span>{plan.contentGeneration} Content Pieces</span>
                  </li>
                  <li className="flex items-center">
                    {planId === 'free' ? (
                      <X className="mr-2 h-4 w-4 text-red-500" />
                    ) : (
                      <Check className="mr-2 h-4 w-4 text-emerald-500" />
                    )}
                    <span>Email Support</span>
                  </li>
                  <li className="flex items-center">
                    {['free', 'standard'].includes(planId) ? (
                      <X className="mr-2 h-4 w-4 text-red-500" />
                    ) : (
                      <Check className="mr-2 h-4 w-4 text-emerald-500" />
                    )}
                    <span>Priority Support</span>
                  </li>
                  <li className="flex items-center">
                    {planId === 'premium' ? (
                      <Check className="mr-2 h-4 w-4 text-emerald-500" />
                    ) : (
                      <X className="mr-2 h-4 w-4 text-red-500" />
                    )}
                    <span>API Access</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  size="lg"
                  variant={planId !== 'free' ? "default" : "outline"}
                  disabled={user?.subscription_plan === planId}
                  onClick={() => handleSelectPlan(planId as SubscriptionPlanType)}
                >
                  {user?.subscription_plan === planId 
                    ? "Current Plan" 
                    : planId === 'free' 
                      ? "Get Started" 
                      : "Subscribe"}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
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
      <div className="mt-16 text-center">
        <div className="rounded-xl border border-border p-6 max-w-3xl mx-auto">
          <h3 className="text-xl font-semibold mb-3">
            <span className="mr-2">💯</span> 14-Day Money-Back Guarantee
          </h3>
          <p className="text-muted-foreground">
            Not satisfied with our service? Get a full refund within 14 days of your subscription.
            No questions asked. We're confident you'll love Tovably.
          </p>
        </div>
      </div>

      {/* FAQ section */}
      <div className="mt-16 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Can I upgrade or downgrade my plan?</h3>
            <p className="text-muted-foreground">Yes, you can upgrade or downgrade your subscription at any time. Changes will take effect at the beginning of your next billing cycle.</p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">How does billing work?</h3>
            <p className="text-muted-foreground">Your subscription is billed monthly. You'll be charged on the same date each month. If you upgrade mid-cycle, we'll prorate the cost.</p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">What happens if I exceed my plan limits?</h3>
            <p className="text-muted-foreground">You'll need to upgrade to a higher tier or wait until your next billing cycle when your usage limits are reset.</p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">Is there an enterprise option?</h3>
            <p className="text-muted-foreground">Yes, for organizations with more extensive needs, contact us at <a href="mailto:sales@tovably.com" className="text-primary hover:underline">sales@tovably.com</a> for custom pricing and features.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;