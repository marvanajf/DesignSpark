import React from "react";
import { X, Check, AlertCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { subscriptionPlans } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  limitType: "personas" | "toneAnalyses" | "contentGeneration";
}

export default function PricingModal({ 
  isOpen, 
  onClose,
  limitType 
}: PricingModalProps) {
  const { toast } = useToast();
  const { user } = useAuth();

  const getLimitName = () => {
    switch (limitType) {
      case "personas":
        return "audience personas";
      case "toneAnalyses":
        return "tone analyses";
      case "contentGeneration":
        return "content generations";
    }
  };

  const getCurrentLimit = () => {
    if (!user) return 0;
    
    const plan = user.subscription_plan;
    switch (limitType) {
      case "personas":
        return subscriptionPlans[plan].personas;
      case "toneAnalyses":
        return subscriptionPlans[plan].toneAnalyses;
      case "contentGeneration":
        return subscriptionPlans[plan].contentGeneration;
    }
  };
  
  const getCurrentUsage = () => {
    if (!user) return 0;
    
    switch (limitType) {
      case "personas":
        return user.personas_used;
      case "toneAnalyses":
        return user.tone_analyses_used;
      case "contentGeneration":
        return user.content_generated;
    }
  };

  const handleUpgrade = (plan: string) => {
    toast({
      title: "Upgrade Initiated",
      description: `We'll redirect you to complete your upgrade to the ${subscriptionPlans[plan].name} plan shortly.`,
    });
    
    // In a real implementation, this would redirect to a payment page
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] bg-black border border-gray-700/60 text-white">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="text-2xl font-bold text-white">Upgrade Your Plan</DialogTitle>
            <Button variant="ghost" onClick={onClose} className="h-6 w-6 p-0 rounded-full text-gray-400 hover:text-white">
              <X className="h-4 w-4" />
            </Button>
          </div>
          <DialogDescription className="text-gray-400">
            {user && (
              <div className="mt-2">
                <AlertCircle className="h-5 w-5 text-amber-500 inline-block mr-2" />
                You've reached your limit of {getCurrentLimit()} {getLimitName()} on the {subscriptionPlans[user.subscription_plan].name} plan.
                <span className="block mt-1 ml-7">
                  Current usage: {getCurrentUsage()}/{getCurrentLimit()}
                </span>
              </div>
            )}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {/* Standard Plan */}
          <Card className="bg-black border border-gray-700/60 hover:border-[#74d1ea]/40 hover:shadow-[0_0_15px_rgba(116,209,234,0.15)] transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl text-white">{subscriptionPlans.standard.name}</CardTitle>
              <div className="mt-1">
                <span className="text-2xl font-bold text-white">{subscriptionPlans.standard.displayPrice}</span>
              </div>
              <CardDescription className="text-gray-400">For individuals and small projects</CardDescription>
            </CardHeader>
            <CardContent className="pb-3">
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-[#74d1ea] mr-2 mt-0.5 flex-shrink-0" />
                  <span>{subscriptionPlans.standard.personas} audience personas</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-[#74d1ea] mr-2 mt-0.5 flex-shrink-0" />
                  <span>{subscriptionPlans.standard.toneAnalyses} tone analyses</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-[#74d1ea] mr-2 mt-0.5 flex-shrink-0" />
                  <span>{subscriptionPlans.standard.contentGeneration} generated content pieces</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-[#74d1ea] mr-2 mt-0.5 flex-shrink-0" />
                  <span>Email support</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-[#74d1ea]/10 hover:bg-[#74d1ea]/20 text-[#74d1ea] border border-[#74d1ea]/30"
                onClick={() => handleUpgrade("standard")}
              >
                Choose Plan
              </Button>
            </CardFooter>
          </Card>
          
          {/* Professional Plan */}
          <Card className="bg-black border border-[#74d1ea]/30 shadow-[0_0_20px_rgba(116,209,234,0.2)] hover:shadow-[0_0_25px_rgba(116,209,234,0.3)] transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl text-white">{subscriptionPlans.professional.name}</CardTitle>
                <span className="px-2 py-1 rounded-full bg-[#74d1ea]/10 text-[#74d1ea] text-xs font-medium">Popular</span>
              </div>
              <div className="mt-1">
                <span className="text-2xl font-bold text-white">{subscriptionPlans.professional.displayPrice}</span>
              </div>
              <CardDescription className="text-gray-400">For professionals and growing businesses</CardDescription>
            </CardHeader>
            <CardContent className="pb-3">
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-[#74d1ea] mr-2 mt-0.5 flex-shrink-0" />
                  <span>{subscriptionPlans.professional.personas} audience personas</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-[#74d1ea] mr-2 mt-0.5 flex-shrink-0" />
                  <span>{subscriptionPlans.professional.toneAnalyses} tone analyses</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-[#74d1ea] mr-2 mt-0.5 flex-shrink-0" />
                  <span>{subscriptionPlans.professional.contentGeneration} generated content pieces</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-[#74d1ea] mr-2 mt-0.5 flex-shrink-0" />
                  <span>Priority email support</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-[#74d1ea] mr-2 mt-0.5 flex-shrink-0" />
                  <span>Advanced analytics</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-[#74d1ea] hover:bg-[#5db8d0] text-black shadow-[0_0_10px_rgba(116,209,234,0.4)]"
                onClick={() => handleUpgrade("professional")}
              >
                Choose Plan
              </Button>
            </CardFooter>
          </Card>
          
          {/* Premium Plan */}
          <Card className="bg-black border border-gray-700/60 hover:border-[#74d1ea]/40 hover:shadow-[0_0_15px_rgba(116,209,234,0.15)] transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl text-white">{subscriptionPlans.premium.name}</CardTitle>
              <div className="mt-1">
                <span className="text-2xl font-bold text-white">{subscriptionPlans.premium.displayPrice}</span>
              </div>
              <CardDescription className="text-gray-400">For power users and larger teams</CardDescription>
            </CardHeader>
            <CardContent className="pb-3">
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-[#74d1ea] mr-2 mt-0.5 flex-shrink-0" />
                  <span>{subscriptionPlans.premium.personas} audience personas</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-[#74d1ea] mr-2 mt-0.5 flex-shrink-0" />
                  <span>{subscriptionPlans.premium.toneAnalyses} tone analyses</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-[#74d1ea] mr-2 mt-0.5 flex-shrink-0" />
                  <span>{subscriptionPlans.premium.contentGeneration} generated content pieces</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-[#74d1ea] mr-2 mt-0.5 flex-shrink-0" />
                  <span>Dedicated support</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-[#74d1ea] mr-2 mt-0.5 flex-shrink-0" />
                  <span>Custom integrations</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-[#74d1ea] mr-2 mt-0.5 flex-shrink-0" />
                  <span>Team collaboration</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-[#74d1ea]/10 hover:bg-[#74d1ea]/20 text-[#74d1ea] border border-[#74d1ea]/30"
                onClick={() => handleUpgrade("premium")}
              >
                Choose Plan
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="text-center mt-4 text-sm text-gray-400">
          <p>Need a custom plan for your enterprise? <Button variant="link" className="text-[#74d1ea] p-0 h-auto">Contact us</Button></p>
        </div>
      </DialogContent>
    </Dialog>
  );
}