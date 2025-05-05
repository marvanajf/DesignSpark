import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, Sparkles, ArrowRight } from "lucide-react";
// Using string type since SubscriptionPlanType might not include all plans we want to support
type PlanType = "standard" | "premium" | "pro" | "free" | "professional" | string;

interface PlanUpgradeSuccessModalProps {
  open: boolean;
  onClose: () => void;
  plan: PlanType;
}

interface PlanFeature {
  name: string;
  standard: boolean | string;
  premium: boolean | string;
  pro: boolean | string;
}

const planFeatures: PlanFeature[] = [
  {
    name: "Campaign Factory",
    standard: "5 credits",
    premium: "15 credits",
    pro: "30 credits"
  },
  {
    name: "Tone Analysis & Keywords",
    standard: true,
    premium: true,
    pro: true
  },
  {
    name: "LinkedIn Content",
    standard: true,
    premium: true,
    pro: true
  },
  {
    name: "Social Media Templates",
    standard: true,
    premium: true,
    pro: true
  },
  {
    name: "Email Sequences",
    standard: true,
    premium: true,
    pro: true
  },
  {
    name: "Landing Page Content",
    standard: false,
    premium: true,
    pro: true
  },
  {
    name: "Priority Support",
    standard: false,
    premium: true,
    pro: true
  },
  {
    name: "Custom Templates",
    standard: false,
    premium: false,
    pro: true
  },
  {
    name: "Advanced Analytics",
    standard: false,
    premium: false,
    pro: true
  }
];

export default function PlanUpgradeSuccessModal({ open, onClose, plan }: PlanUpgradeSuccessModalProps) {
  const [planTitle, setPlanTitle] = useState<string>("");
  const [planColor, setPlanColor] = useState<string>("");
  const [isClosing, setIsClosing] = useState(false);
  
  // Set plan-specific details
  useEffect(() => {
    if (plan === "standard") {
      setPlanTitle("Standard Plan");
      setPlanColor("bg-gradient-to-r from-[#74d1ea] to-[#5db8d0]");
    } else if (plan === "premium") {
      setPlanTitle("Premium Plan");
      setPlanColor("bg-gradient-to-r from-[#8C65F7] to-[#6D45E8]");
    } else if (plan === "pro") {
      setPlanTitle("Professional Plan");
      setPlanColor("bg-gradient-to-r from-[#F7A54F] to-[#F58F32]");
    }
  }, [plan]);

  // Handle the smooth closing of the modal
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300);
  };

  // Get the features available for the current plan
  const getAvailableFeatures = () => {
    return planFeatures.filter(feature => {
      if (plan === "standard") return feature.standard;
      if (plan === "premium") return feature.premium;
      if (plan === "pro" || plan === "professional") return feature.pro;
      // Default to standard features for unknown plan types
      return feature.standard;
    });
  };

  return (
    <Dialog 
      open={open} 
      onOpenChange={(isOpen) => {
        if (!isOpen) handleClose();
      }}
    >
      <DialogContent className={`max-w-2xl bg-black border-2 border-[#74d1ea]/30 shadow-[0_0_15px_rgba(116,209,234,0.15)] ${isClosing ? 'opacity-0 scale-95' : 'opacity-100 scale-100'} transition-all duration-300`}>
        <div className="flex flex-col">
          {/* Header with Sparkle Animation */}
          <div className="relative overflow-hidden rounded-t-lg">
            <div className={`${planColor} py-10 px-6 text-center relative overflow-hidden`}>
              <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJzcGFya2xlcyIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSg0NSkiPjxjaXJjbGUgZmlsbD0iI2ZmZiIgb3BhY2l0eT0iMC4xNSIgY3g9IjEwIiBjeT0iMTAiIHI9IjEiIC8+PGNpcmNsZSBmaWxsPSIjZmZmIiBvcGFjaXR5PSIwLjE1IiBjeD0iMzAiIGN5PSIzMCIgcj0iMC44IiAvPjxjaXJjbGUgZmlsbD0iI2ZmZiIgb3BhY2l0eT0iMC4xIiBjeD0iNTAiIGN5PSI1MCIgcj0iMiIgLz48Y2lyY2xlIGZpbGw9IiNmZmYiIG9wYWNpdHk9IjAuMSIgY3g9IjcwIiBjeT0iNzAiIHI9IjEuMiIgLz48Y2lyY2xlIGZpbGw9IiNmZmYiIG9wYWNpdHk9IjAuMSIgY3g9IjkwIiBjeT0iOTAiIHI9IjAuNSIgLz48Y2lyY2xlIGZpbGw9IiNmZmYiIG9wYWNpdHk9IjAuMSIgY3g9IjExMCIgY3k9IjExMCIgcj0iMS41IiAvPjxjaXJjbGUgZmlsbD0iI2ZmZiIgb3BhY2l0eT0iMC4xIiBjeD0iMTMwIiBjeT0iMTMwIiByPSIwLjgiIC8+PGNpcmNsZSBmaWxsPSIjZmZmIiBvcGFjaXR5PSIwLjEiIGN4PSIxNTAiIGN5PSIxNTAiIHI9IjEiIC8+PGNpcmNsZSBmaWxsPSIjZmZmIiBvcGFjaXR5PSIwLjEiIGN4PSIxNzAiIGN5PSIxNzAiIHI9IjAuNiIgLz48Y2lyY2xlIGZpbGw9IiNmZmYiIG9wYWNpdHk9IjAuMSIgY3g9IjE5MCIgY3k9IjE5MCIgcj0iMS4yIiAvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNzcGFya2xlcykiIC8+PC9zdmc+')]"></div>
              <div className="relative z-10">
                <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center mx-auto mb-4 border border-white/20">
                  <Sparkles className="h-10 w-10 text-white" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white">Welcome to Your {planTitle}!</h2>
                <p className="text-white/80 mt-2 max-w-md mx-auto">Your account has been successfully upgraded. You now have access to these amazing features:</p>
              </div>
            </div>
          </div>
          
          {/* Features List */}
          <div className="p-6 bg-gradient-to-b from-zinc-900 to-black">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {getAvailableFeatures().map((feature, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-zinc-900/50 border border-zinc-800">
                  <CheckCircle className="h-5 w-5 text-[#74d1ea] mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-white font-medium">{feature.name}</span>
                    {plan === "standard" && typeof feature.standard === 'string' && (
                      <span className="ml-2 text-sm text-[#74d1ea]">({feature.standard})</span>
                    )}
                    {plan === "premium" && typeof feature.premium === 'string' && (
                      <span className="ml-2 text-sm text-[#74d1ea]">({feature.premium})</span>
                    )}
                    {(plan === "pro" || plan === "professional") && typeof feature.pro === 'string' && (
                      <span className="ml-2 text-sm text-[#74d1ea]">({feature.pro})</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 text-center">
              <Button 
                onClick={handleClose}
                className="bg-gradient-to-r from-[#74d1ea] to-[#5db8d0] hover:bg-gradient-to-r hover:from-[#5db8d0] hover:to-[#4ca5bd] text-black font-medium shadow-lg shadow-[#74d1ea]/20 border border-[#74d1ea]/10 px-8"
              >
                Start Using Your New Features
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}