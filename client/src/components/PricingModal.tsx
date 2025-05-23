import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CustomDialogContent } from '@/components/ui/custom-dialog';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { useMutation } from '@tanstack/react-query';
import { SubscriptionPlanType } from '@shared/schema';
import { useAuth } from '@/hooks/use-auth';

interface PlanInfo {
  name: string;
  personas: number;
  toneAnalyses: number;
  contentGeneration: number;
  campaigns: number;
  support: boolean;
  price: number;
  currency: string;
  displayPrice: string;
  stripePrice?: string;
}

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: PlanInfo;
  planId: SubscriptionPlanType;
}

const PricingModal: React.FC<PricingModalProps> = ({ isOpen, onClose, plan, planId }) => {
  const [isLoading, setIsLoading] = useState(false); 
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Create a simplified request to Stripe via a GET request
  const handleCheckout = async () => {
    try {
      setIsLoading(true);
      setError("");
      
      console.log("Creating direct checkout request for plan:", planId);
      
      // Use a simpler approach - create a direct GET endpoint that redirects to Stripe
      // This avoids form submission issues
      window.location.href = `/api/direct-stripe-redirect?plan=${planId}`;
      
      // The page will redirect, so no need to set loading to false
    } catch (err) {
      console.error("Checkout error:", err);
      setError(err instanceof Error ? err.message : "Failed to start checkout process");
      toast({
        title: "Checkout Failed",
        description: "Could not initialize checkout. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <CustomDialogContent hideCloseButton={true} className="sm:max-w-[425px] border border-border">
        <DialogHeader>
          <DialogTitle>Subscribe to {plan.name} Plan</DialogTitle>
          <DialogDescription>
            You'll be charged {plan.displayPrice} monthly to access premium features.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="rounded-md bg-black/20 p-4 border border-border/50">
            <h3 className="font-medium text-white mb-2">Plan Details:</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>• {plan.personas} AI Personas</li>
              <li>• {plan.toneAnalyses} Tone Analyses</li>
              <li>• {plan.contentGeneration} Content Pieces per month</li>
              <li>• {plan.campaigns} Campaigns</li>
              {plan.campaignFactory > 0 ? (
                <li className="text-[#74d1ea] font-medium">
                  • {plan.campaignFactory} Campaign Factory Credits
                  <span className="block text-xs text-gray-400 ml-2 mt-0.5">Save 20+ hours per campaign!</span>
                </li>
              ) : (
                <li className="text-gray-500">• No Campaign Factory Access</li>
              )}
              {planId === 'free' && <li>• Standard Support</li>}
              {planId !== 'free' && <li>• Priority Support</li>}
              {planId === 'premium' && <li>• API Access</li>}
            </ul>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-4">
              <Loader2 className="h-8 w-8 animate-spin text-[#74d1ea]" />
            </div>
          ) : error ? (
            <div className="text-center">
              <div className="text-red-500 mb-4">{error}</div>
              <Button onClick={onClose}>Close</Button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <p className="text-sm text-gray-400">
                You'll be redirected to our secure payment provider to complete your subscription.
                {!user && " An account will be automatically created for you after payment."}
              </p>
              
              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  onClick={handleCheckout}
                  disabled={isLoading}
                  className="bg-[#74d1ea] hover:bg-[#5db8d0] text-black"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    `Continue to Checkout`
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </CustomDialogContent>
    </Dialog>
  );
};

export default PricingModal;