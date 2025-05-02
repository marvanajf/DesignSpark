import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { usePricingModal } from "@/hooks/use-pricing-modal";
import { subscriptionPlans } from "@shared/schema";
import { CalendarClock, CreditCard, PieChart } from "lucide-react";
import { Link } from "wouter";

export interface SubscriptionLimitModalProps {
  isOpen: boolean;
  onClose: () => void;
  limitType: "personas" | "toneAnalyses" | "contentGeneration" | "campaigns";
  currentUsage: number;
  limit: number;
  currentPlan: string;
}

export function SubscriptionLimitModal({
  isOpen,
  onClose,
  limitType,
  currentUsage,
  limit,
  currentPlan
}: SubscriptionLimitModalProps) {
  const { openPricingModal } = usePricingModal();

  // Get available upgrade plan details
  const planTiers = Object.entries(subscriptionPlans).sort((a, b) => a[1].price - b[1].price);
  const currentPlanIndex = planTiers.findIndex(([key]) => key === currentPlan);
  const nextPlan = currentPlanIndex < planTiers.length - 1 ? planTiers[currentPlanIndex + 1] : null;

  const getFeatureLabel = () => {
    switch (limitType) {
      case "personas":
        return "AI Personas";
      case "toneAnalyses":
        return "Tone Analyses";
      case "contentGeneration":
        return "Content Generations";
      case "campaigns":
        return "Campaigns";
    }
  };

  const handleUpgrade = () => {
    onClose();
    openPricingModal(limitType);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-[#0e1015] border-0">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center text-[#74d1ea]">
            <CreditCard className="w-5 h-5 mr-2" />
            Subscription Limit Reached
          </DialogTitle>
          <DialogDescription className="text-gray-400 pt-2">
            You've reached your {getFeatureLabel()} limit for your current plan.
          </DialogDescription>
        </DialogHeader>

        <div className="bg-[#181c25] rounded-md p-4 my-2 border border-gray-800">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-medium">Current usage</div>
            <div className="text-sm font-bold">
              {currentUsage} / {limit} {getFeatureLabel()}
            </div>
          </div>
          <div className="w-full bg-gray-700/30 rounded-full h-2.5">
            <div
              className="bg-[#74d1ea] h-2.5 rounded-full"
              style={{ width: "100%" }}
            ></div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 pt-0.5">
              <CalendarClock className="h-5 w-5 text-gray-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium">Wait for monthly reset</h3>
              <p className="text-xs text-gray-400 mt-1">
                Your usage limits will reset at the beginning of your next billing period.
              </p>
            </div>
          </div>

          {nextPlan && (
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <CreditCard className="h-5 w-5 text-[#74d1ea]" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium">Upgrade your plan</h3>
                <p className="text-xs text-gray-400 mt-1">
                  Upgrade to {nextPlan[1].name} plan to get {nextPlan[1][limitType]} {getFeatureLabel()} 
                  (that's {nextPlan[1][limitType] - limit} more than your current plan).
                </p>
              </div>
            </div>
          )}

          <div className="flex items-start">
            <div className="flex-shrink-0 pt-0.5">
              <PieChart className="h-5 w-5 text-gray-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium">Monitor your usage</h3>
              <p className="text-xs text-gray-400 mt-1">
                Check your current usage across all features to better plan your work.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="sm:justify-between flex flex-col sm:flex-row gap-2">
          <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Close
            </Button>
            <Button 
              variant="outline" 
              className="text-[#74d1ea] border-[#74d1ea] hover:bg-[#74d1ea]/10 flex-1"
              asChild
            >
              <Link href="/usage">
                View Usage
              </Link>
            </Button>
          </div>
          {nextPlan && (
            <Button
              type="submit"
              onClick={handleUpgrade}
              className="w-full sm:w-auto"
              style={{ backgroundColor: "#74d1ea", color: "black" }}
            >
              Upgrade Plan
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}