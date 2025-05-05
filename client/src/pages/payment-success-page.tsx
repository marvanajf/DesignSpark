import { useEffect, useState } from "react";
import { useLocation, Link } from "wouter";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import AccountSetupModal from "@/components/AccountSetupModal";

export default function PaymentSuccessPage() {
  const [location] = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [accountSetup, setAccountSetup] = useState(false);
  const [autoLoginInProgress, setAutoLoginInProgress] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Extract session ID and plan from URL parameters
  const params = new URLSearchParams(location.split('?')[1]);
  const sessionId = params.get('session_id');
  const plan = params.get('plan');
  
  // Helper function to perform a direct login with credentials
  const performDirectLogin = async (email: string, password: string): Promise<boolean> => {
    try {
      // Enhanced debug logging
      console.log("📤 Starting direct login process for:", email);
      console.log("📤 Request payload:", { email, password: "********" });
      
      // First, make the login API call with debug mode enabled
      const loginResponse = await apiRequest("POST", "/api/login", 
        { email, password }, 
        { debugMode: true, retries: 2 }  // Enable retries and debugging
      );
      
      // Check for login success
      if (!loginResponse.ok) {
        const errorText = await loginResponse.text();
        console.error("❌ Login API call failed:", loginResponse.status, errorText);
        return false;
      }
      
      // Get the user data from the login response
      const loginData = await loginResponse.json();
      console.log("✅ Login API call successful", loginData ? "with user data" : "but no user data returned");
      
      // Clear any stale user data in the cache
      queryClient.removeQueries({ queryKey: ["/api/user"] });
      
      // Refresh TanStack Query cache 
      await queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      
      // Force a direct fetch to confirm login state with debug mode
      const userResponse = await apiRequest("GET", "/api/user", undefined, { debugMode: true });
      
      if (!userResponse.ok) {
        console.error("❌ User verification failed after login:", userResponse.status);
        return false;
      }
      
      const userData = await userResponse.json();
      console.log("👤 User data fetched:", userData ? "Success" : "Failed", userData);
      
      // Extra validation to ensure user is actually logged in
      if (!userData || !userData.id) {
        console.error("❌ Invalid or missing user data after login");
        return false;
      }
      
      console.log("🎉 Login process completed successfully for user ID:", userData.id);
      return true;
    } catch (error) {
      console.error("❌ Login attempt failed with error:", error);
      return false;
    }
  };

  useEffect(() => {
    // Function to handle the test/development mode scenario
    const handleTestMode = () => {
      // Remove this fallback to test@example.com - we want users to always enter their own email
      // or see the email from Stripe checkout
      const customerEmail = params.get('customer_email') || params.get('email') || '';
      
      console.log("Payment success with email:", customerEmail);
      
      setMessage(
        "Your payment was successful! We've created an account for you."
      );
      setEmail(customerEmail);
      setShowSetupModal(true);
      setIsLoading(false);
    };

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
            if (data.accountCreated) {
              setMessage(
                "Your payment was successful! We've created an account for you."
              );
              
              // Get customer email from URL params or session data, but don't require it
              // The important thing is to make the modal always show and let the user enter their email
              const customerEmail = params.get('customer_email') || data.email || '';
              setEmail(customerEmail);
              
              // Always show the account setup modal for new accounts
              setShowSetupModal(true);
            } else {
              setMessage("Your payment was successful and your subscription has been updated.");
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
          // If there's an error in payment verification, fallback to test mode
          console.log("Error verifying payment, falling back to test mode:", err);
          handleTestMode();
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      // No session ID found, but we'll still allow testing the account setup flow
      handleTestMode();
    }
  }, [sessionId, user, params]);

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
              
              <div className="w-full bg-zinc-900 rounded-md p-4 mb-6 border border-zinc-800">
                <h3 className="font-medium text-white mb-2">Your Account Details:</h3>
                {email ? (
                  <p className="text-sm text-gray-300 mb-3">Email: <span className="text-[#74d1ea]">{email}</span></p>
                ) : (
                  <p className="text-sm text-gray-300 mb-3">You'll need to enter your email in the next step.</p>
                )}
                
                {autoLoginInProgress ? (
                  <div className="mt-3 flex items-center justify-center">
                    <Loader2 className="h-5 w-5 animate-spin text-[#74d1ea] mr-2" />
                    <p className="text-sm text-gray-300">Logging you in automatically...</p>
                  </div>
                ) : (
                  <>
                    <p className="text-xs text-gray-400">
                      {accountSetup 
                        ? "Your account has been set up. You will be redirected to the dashboard automatically."
                        : "Set up your account by creating a password using the form. This will allow you to log in immediately."}
                    </p>
                    {!accountSetup && (
                      <Button 
                        onClick={() => setShowSetupModal(true)} 
                        variant="outline" 
                        className="mt-3 w-full border-zinc-700 text-[#74d1ea] hover:text-[#74d1ea] hover:bg-zinc-900"
                      >
                        Set Up Account
                      </Button>
                    )}
                  </>
                )}
              </div>
              
              {plan && (
                <p className="text-sm text-gray-400 mb-6 text-center">
                  You have subscribed to the <span className="text-[#74d1ea] font-medium">{plan.charAt(0).toUpperCase() + plan.slice(1)}</span> plan.
                </p>
              )}
              
              <div className="flex gap-4 relative">
                {/* If user is not logged in and account is not set up, show setup button */}
                {!user && !autoLoginInProgress && !accountSetup && (
                  <Button 
                    onClick={() => setShowSetupModal(true)}
                    className="bg-[#74d1ea] hover:bg-[#5db8d0] text-black"
                  >
                    Set Up Account
                  </Button>
                )}
                
                {/* If user completed account setup but is not logged in, show login button */}
                {!user && !autoLoginInProgress && accountSetup && (
                  <Button 
                    onClick={() => {
                      // Make sure the modal is closed before navigation
                      setShowSetupModal(false);
                      // Use direct navigation instead of Link
                      window.location.href = '/auth';
                    }}
                    className="bg-[#74d1ea] hover:bg-[#5db8d0] text-black"
                  >
                    Log In
                  </Button>
                )}
                
                {/* Main dashboard button - changes based on auto-login state */}
                {autoLoginInProgress ? (
                  <Button disabled className="opacity-70 bg-gray-800">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Redirecting...
                  </Button>
                ) : (
                  <Button 
                    onClick={() => {
                      // Make sure the modal is closed before navigation
                      setShowSetupModal(false);
                      // Use direct navigation instead of Link to ensure state is cleaned up
                      window.location.href = '/dashboard';
                    }}
                    className={user ? "bg-[#74d1ea] hover:bg-[#5db8d0] text-black" : ""}
                  >
                    Go to Dashboard
                  </Button>
                )}
              </div>
              
              {/* If user is already logged in, show a message */}
              {user && (
                <div className="mt-6 bg-green-900/30 text-green-400 px-3 py-2 rounded-md text-sm font-medium border border-green-800/50 text-center">
                  Logged in as <span className="font-semibold">{user.email || user.username}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Account Setup Modal - Only show if explicitly requested and not already set up */}
      {showSetupModal && !accountSetup && (
        <AccountSetupModal 
          email={email}
          plan={plan || 'standard'}
          open={true} 
          onClose={() => {
            // Make sure we properly reset the modal state when closing
            setShowSetupModal(false);
          }}
          onSuccess={async (credentials) => {
            // Mark account as set up FIRST - this prevents reshowing the modal
            setAccountSetup(true);
            
            // IMPORTANT: Close the modal immediately to prevent it from reopening
            setShowSetupModal(false);
            
            // If we received credentials, log the user in automatically
            if (credentials) {
              setAutoLoginInProgress(true);
              
              try {
                // Use our direct login helper function
                const loginSuccess = await performDirectLogin(
                  credentials.email, 
                  credentials.password
                );
                
                if (loginSuccess) {
                  // Show a successful login message in the UI
                  toast({
                    title: "Logged in successfully!",
                    description: "Redirecting you to the dashboard...",
                    variant: "default"
                  });
                  
                  console.log("🎉 Login successful! Preparing to redirect to dashboard");
                  
                  // Issue an additional API call to verify the user object is in the session
                  try {
                    console.log("🔍 Verifying login state with a final user check");
                    const finalCheck = await fetch("/api/user", { 
                      credentials: "include" 
                    });
                    
                    if (finalCheck.ok) {
                      const userData = await finalCheck.json();
                      console.log("✅ Final verification successful, user data:", userData);
                    } else {
                      console.warn("⚠️ Final verification returned non-OK status:", finalCheck.status);
                    }
                  } catch (verifyErr) {
                    console.error("⚠️ Error during final verification:", verifyErr);
                    // Continue with redirect even if verification fails
                  }
                  
                  // Navigate to the dashboard after a short delay to ensure data is loaded
                  console.log("🔄 Redirecting to dashboard in 1.5 seconds...");
                  setTimeout(() => {
                    window.location.href = '/dashboard';
                  }, 1500);
                } else {
                  setAutoLoginInProgress(false);
                  console.error("❌ Auto-login failed - login attempt returned false");
                  toast({
                    title: "Auto-login failed",
                    description: "Please use the login button to access your account.",
                    variant: "destructive"
                  });
                }
              } catch (error) {
                setAutoLoginInProgress(false);
                console.error("❌ Auto-login error:", error);
                
                // Detailed error analysis
                let errorMessage = "There was a problem logging you in.";
                if (error instanceof Error) {
                  console.error("❌ Error message:", error.message);
                  console.error("❌ Error stack:", error.stack);
                  
                  // Customize message based on error type
                  if (error.message.includes("NetworkError") || 
                      error.message.includes("Failed to fetch") || 
                      error.message.includes("Network request failed")) {
                    errorMessage = "Network error during login. Please check your connection.";
                  } else if (error.message.includes("401") || 
                             error.message.includes("Unauthorized") || 
                             error.message.includes("Invalid credentials")) {
                    errorMessage = "Invalid login credentials. Please try logging in manually.";
                  }
                }
                
                toast({
                  title: "Login error",
                  description: errorMessage + " Please try logging in manually.",
                  variant: "destructive"
                });
              }
            }
          }}
        />
      )}
    </Layout>
  );
}