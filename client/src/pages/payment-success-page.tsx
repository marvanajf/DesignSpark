import { useEffect, useState } from "react";
import { useLocation, Link } from "wouter";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";

export default function PaymentSuccessPage() {
  const [location] = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  const { user } = useAuth();

  // Extract session ID and plan from URL parameters
  const params = new URLSearchParams(location.split('?')[1]);
  const sessionId = params.get('session_id');
  const plan = params.get('plan');

  useEffect(() => {
    if (sessionId) {
      // Verify the session ID by checking its status
      apiRequest("GET", `/api/checkout-sessions/${sessionId}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error("Failed to verify payment session");
          }
          return res.json();
        })
        .then((data) => {
          if (data.status === "complete") {
            setMessage(
              data.accountCreated 
                ? "Your payment was successful and we've created an account for you."
                : "Your payment was successful and your subscription has been updated."
            );
            
            if (data.accountCreated) {
              setEmail(data.email);
              setPassword(data.password);
            }
            
            // Refresh user data if the user is logged in
            if (user) {
              queryClient.invalidateQueries({ queryKey: ["/api/user"] });
            }
          } else {
            setMessage("Your payment is being processed. We'll update your account shortly.");
          }
        })
        .catch((err) => {
          setMessage(
            "There was a problem verifying your payment. If your card was charged, please contact support."
          );
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setMessage("No payment session found. Please try subscribing again.");
      setIsLoading(false);
    }
  }, [sessionId, user]);

  return (
    <Layout>
      <div className="min-h-screen py-16 flex items-center justify-center">
        <div className="max-w-md w-full mx-auto bg-black/20 rounded-lg border border-border/50 shadow-lg p-8">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="h-16 w-16 animate-spin text-[#74d1ea] mb-4" />
              <p className="text-gray-300 text-center">Verifying your payment...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
              <h1 className="text-2xl font-bold text-white mb-4 text-center">Payment Successful!</h1>
              <p className="text-gray-300 text-center mb-6">{message}</p>
              
              {email && password && (
                <div className="w-full bg-zinc-900 rounded-md p-4 mb-6 border border-zinc-800">
                  <h3 className="font-medium text-white mb-2">Your Account Details:</h3>
                  <p className="text-sm text-gray-300 mb-1">Email: <span className="text-[#74d1ea]">{email}</span></p>
                  <p className="text-sm text-gray-300 mb-3">Temporary Password: <span className="text-[#74d1ea] font-mono">{password}</span></p>
                  <p className="text-xs text-gray-400">Please log in using these credentials and change your password immediately.</p>
                </div>
              )}
              
              {plan && (
                <p className="text-sm text-gray-400 mb-6 text-center">
                  You have subscribed to the <span className="text-[#74d1ea] font-medium">{plan.charAt(0).toUpperCase() + plan.slice(1)}</span> plan.
                </p>
              )}
              
              <div className="flex gap-4">
                {!user && (
                  <Button asChild className="bg-[#74d1ea] hover:bg-[#5db8d0] text-black">
                    <Link href="/auth">Log In</Link>
                  </Button>
                )}
                <Button asChild>
                  <Link href="/">Go to Dashboard</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}