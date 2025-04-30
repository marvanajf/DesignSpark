import { useState, useEffect } from 'react';
import { useStripe, useElements, CardElement, Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { useMutation } from '@tanstack/react-query';
import { SubscriptionPlanType } from '@shared/schema';
import { useAuth } from '@/hooks/use-auth';

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface PlanInfo {
  name: string;
  personas: number;
  toneAnalyses: number;
  contentGeneration: number;
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

const CheckoutForm = ({ 
  planId, 
  plan, 
  clientSecret, 
  onClose 
}: { 
  planId: SubscriptionPlanType; 
  plan: PlanInfo; 
  clientSecret: string; 
  onClose: () => void;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { user } = useAuth();
  
  const subscriptionMutation = useMutation({
    mutationFn: (data: { plan: SubscriptionPlanType, customerId: string }) => {
      return apiRequest("POST", "/api/update-subscription", data)
        .then(res => {
          if (!res.ok) throw new Error("Failed to update subscription");
          return res.json();
        });
    },
    onSuccess: () => {
      // Close modal and show success message
      onClose();
    },
    onError: (error: Error) => {
      setErrorMessage(`Subscription update failed: ${error.message}`);
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }
    
    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setErrorMessage("Card element not found");
      return;
    }
    
    setIsProcessing(true);
    setErrorMessage(null);
    
    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: user?.username,
            email: user?.email
          }
        }
      });

      if (error) {
        setErrorMessage(error.message || "Payment failed. Please try again.");
      } else if (paymentIntent.status === "succeeded") {
        // Payment succeeded, update user subscription in our database
        // Use payment ID as identifier for the subscription
        subscriptionMutation.mutate({ 
          plan: planId, 
          customerId: paymentIntent.id
        });
      }
    } catch (err) {
      setErrorMessage("An unexpected error occurred. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="border border-border rounded-md p-4">
        <CardElement 
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#FFFFFF',
                '::placeholder': {
                  color: '#8F8F8F',
                },
              },
              invalid: {
                color: '#EF4444',
              },
            },
          }}
        />
      </div>
      
      {errorMessage && (
        <div className="text-red-500 text-sm">{errorMessage}</div>
      )}
      
      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onClose} disabled={isProcessing}>
          Cancel
        </Button>
        <Button type="submit" disabled={!stripe || isProcessing}>
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing
            </>
          ) : (
            `Pay ${plan.displayPrice}`
          )}
        </Button>
      </div>
    </form>
  );
};

const PricingModal: React.FC<PricingModalProps> = ({ isOpen, onClose, plan, planId }) => {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen && planId !== 'free') {
      setIsLoading(true);
      setError(null);

      // Create a payment intent when the modal opens
      apiRequest("POST", "/api/create-payment-intent", { 
        plan: planId,
        amount: plan.price,
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Failed to initiate payment process");
          }
          return res.json();
        })
        .then((data) => {
          setClientSecret(data.clientSecret);
        })
        .catch((err) => {
          setError(err.message || "Failed to initiate payment. Please try again.");
          toast({
            title: "Payment Initialization Failed",
            description: err.message || "Failed to initiate payment. Please try again.",
            variant: "destructive",
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [isOpen, planId, plan.price, toast]);

  if (!stripePromise) {
    return (
      <Dialog open={isOpen} onOpenChange={() => onClose()}>
        <DialogContent className="sm:max-w-[425px] border border-border">
          <DialogHeader>
            <DialogTitle>Stripe Configuration Missing</DialogTitle>
            <DialogDescription>
              The Stripe public key is missing. Please contact the administrator.
            </DialogDescription>
          </DialogHeader>
          <div className="text-center">
            <Button onClick={onClose}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[425px] border border-border">
        <DialogHeader>
          <DialogTitle>Subscribe to {plan.name} Plan</DialogTitle>
          <DialogDescription>
            You'll be charged {plan.displayPrice} monthly to access premium features.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center py-4">
            <div className="text-red-500 mb-4">{error}</div>
            <Button onClick={onClose}>Close</Button>
          </div>
        ) : clientSecret ? (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm 
              planId={planId} 
              plan={plan} 
              clientSecret={clientSecret} 
              onClose={onClose} 
            />
          </Elements>
        ) : (
          <div className="text-center py-4">
            <div className="text-red-500 mb-4">Unable to initialize payment. Please try again.</div>
            <Button onClick={onClose}>Close</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PricingModal;