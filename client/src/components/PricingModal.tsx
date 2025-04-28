import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { subscriptionPlans } from "@shared/schema";
import { useLocation } from "wouter";
import { CheckCircle } from "lucide-react";

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
  const [, navigate] = useLocation();
  
  // Get friendly name for the limit type
  const getLimitName = (type: typeof limitType) => {
    switch (type) {
      case "personas":
        return "persona";
      case "toneAnalyses":
        return "tone analysis";
      case "contentGeneration":
        return "content generation";
    }
  };
  
  const handleViewPricing = () => {
    navigate("/pricing");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-gray-900 border border-gray-700/60 shadow-[0_0_25px_rgba(116,209,234,0.15)]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-white">
            Upgrade Your Plan
          </DialogTitle>
          <DialogDescription className="text-gray-400 mt-2">
            You've reached your {getLimitName(limitType)} limit on the Free plan.
            Upgrade to continue creating amazing content!
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          <div className="bg-gray-800/50 p-5 rounded-lg border border-gray-700/60 shadow-[0_0_15px_rgba(116,209,234,0.10)]">
            <div className="text-lg font-medium text-white mb-2">Current Plan: Free</div>
            <ul className="space-y-2 mb-4">
              <li className="flex items-start text-sm text-gray-400">
                <CheckCircle className="h-4 w-4 text-[#74d1ea] mr-2 mt-0.5 flex-shrink-0" />
                <span>{subscriptionPlans.free.personas} personas</span>
              </li>
              <li className="flex items-start text-sm text-gray-400">
                <CheckCircle className="h-4 w-4 text-[#74d1ea] mr-2 mt-0.5 flex-shrink-0" />
                <span>{subscriptionPlans.free.toneAnalyses} tone analyses</span>
              </li>
              <li className="flex items-start text-sm text-gray-400">
                <CheckCircle className="h-4 w-4 text-[#74d1ea] mr-2 mt-0.5 flex-shrink-0" />
                <span>{subscriptionPlans.free.contentGeneration} generated content pieces</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-[#74d1ea]/10 p-5 rounded-lg border border-[#74d1ea]/30 shadow-[0_0_15px_rgba(116,209,234,0.15)]">
            <div className="text-lg font-medium text-white mb-2">
              Recommended: {subscriptionPlans.standard.name}
            </div>
            <ul className="space-y-2 mb-4">
              <li className="flex items-start text-sm text-gray-300">
                <CheckCircle className="h-4 w-4 text-[#74d1ea] mr-2 mt-0.5 flex-shrink-0" />
                <span><strong>{subscriptionPlans.standard.personas}</strong> personas</span>
              </li>
              <li className="flex items-start text-sm text-gray-300">
                <CheckCircle className="h-4 w-4 text-[#74d1ea] mr-2 mt-0.5 flex-shrink-0" />
                <span><strong>{subscriptionPlans.standard.toneAnalyses}</strong> tone analyses</span>
              </li>
              <li className="flex items-start text-sm text-gray-300">
                <CheckCircle className="h-4 w-4 text-[#74d1ea] mr-2 mt-0.5 flex-shrink-0" />
                <span><strong>{subscriptionPlans.standard.contentGeneration}</strong> generated content pieces</span>
              </li>
            </ul>
            <div className="text-[#74d1ea] font-semibold">
              {subscriptionPlans.standard.displayPrice}
            </div>
          </div>
        </div>
        
        <DialogFooter className="flex justify-between sm:justify-between flex-row flex-wrap gap-2">
          <Button
            variant="ghost"
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            Maybe Later
          </Button>
          <Button
            onClick={handleViewPricing}
            className="bg-[#74d1ea] hover:bg-[#5db8d0] text-black shadow-[0_0_10px_rgba(116,209,234,0.4)]"
          >
            View All Plans
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}