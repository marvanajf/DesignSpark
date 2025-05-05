import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

// Password requirements schema
const passwordSchema = z.object({
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type PasswordFormData = z.infer<typeof passwordSchema>;

interface AccountSetupModalProps {
  email: string | null;
  open: boolean;
  onClose: () => void;
  onSuccess: (credentials?: { email: string; password: string }) => void;
  plan?: string;
}

export default function AccountSetupModal({ email, open, onClose, onSuccess, plan = 'standard' }: AccountSetupModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [editedEmail, setEditedEmail] = useState<string>(email || "");
  const { toast } = useToast();

  // Update editedEmail when email prop changes
  // Reset edited email when modal open state or provided email changes
  useEffect(() => {
    // Use the provided email or set to empty string to enable input
    setEditedEmail(email || '');
  }, [email, open]);

  const form = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const handleSubmit = async (data: PasswordFormData) => {
    if (!editedEmail || editedEmail.trim() === '') {
      setError("Please enter a valid email address.");
      return;
    }
    
    // Enhanced email validation
    if (!/^\S+@\S+\.\S+$/.test(editedEmail.trim())) {
      setError("Please enter a valid email address in the format: example@domain.com");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log("🔐 Starting account setup for email:", editedEmail.trim());
      
      // Check if we're in development/test mode
      const testMode = process.env.NODE_ENV === 'development';
      const queryParams = new URLSearchParams();
      
      if (testMode) {
        queryParams.append('testMode', 'true');
        console.log("🧪 Running in test mode");
      }
      
      // Add the subscription plan to the query parameters
      if (plan) {
        queryParams.append('plan', plan);
        console.log("💰 Setting up account with plan:", plan);
      }
      
      const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
      
      console.log(`📤 Sending account setup request to /api/setup-account${queryString}`);
      console.log("📤 Request payload:", { 
        email: editedEmail.trim(), 
        password: "********" 
      });
      
      const response = await apiRequest("POST", `/api/setup-account${queryString}`, 
        {
          email: editedEmail.trim(),
          password: data.password
        },
        { debugMode: true, retries: 2 } // Enable debugging and retries
      );

      // Check the response status
      if (!response.ok) {
        const responseText = await response.text();
        console.error("❌ Account setup API failed with status:", response.status);
        console.error("❌ Response body:", responseText);
        
        let errorMessage;
        try {
          // Try to parse as JSON
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.error || errorData.message || "Failed to setup account";
        } catch (parseError) {
          // If not JSON, use the raw text
          errorMessage = responseText || "Failed to setup account";
        }
        
        throw new Error(errorMessage);
      }

      // Parse the response
      let responseData;
      try {
        responseData = await response.json();
        console.log("✅ Account setup successful, response data:", responseData);
      } catch (jsonError) {
        console.warn("⚠️ Could not parse JSON response, but request was successful");
      }

      setSuccess(true);
      toast({
        title: "Account setup successful!",
        description: "Your password has been set. You can now log in to your account.",
        variant: "default",
      });
      
      // Save the credentials to pass back to the parent component
      const credentials = {
        email: editedEmail.trim(),
        password: data.password
      };
      
      console.log("🔑 Preparing login credentials for auto-login");
      
      // Wait a moment before closing the modal to show success state
      setTimeout(() => {
        console.log("⏱️ Timeout complete, triggering onSuccess callback with credentials");
        onSuccess(credentials);
      }, 1500);
    } catch (err) {
      console.error("❌ Account setup error:", err);
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
      toast({
        title: "Account setup failed",
        description: err instanceof Error ? err.message : "Failed to setup your account",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form when opening the modal
  useEffect(() => {
    if (open) {
      // Reset the form state when the modal is opened
      form.reset({
        password: "",
        confirmPassword: "",
      });
      setError(null);
      
      // Don't reset success state here - we need to maintain it
      // if the user just completed their account setup
    }
  }, [open, form]);

  // Safe close handler
  const handleClose = () => {
    if (isLoading) return; // Don't close while processing
    
    // Reset all form state
    form.reset();
    setError(null);
    
    // Don't reset success state here to avoid flashing issues
    
    // Trigger close
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onOpenChange={(isOpen) => {
        if (!isOpen && !isLoading) {
          handleClose();
        }
      }}
    >
      <DialogContent className="max-w-md bg-black border border-border/50">
        <DialogTitle className="text-xl font-semibold text-white">Set Up Your Account</DialogTitle>
        <DialogDescription className="text-gray-400">
          Create a password to complete your account setup.
        </DialogDescription>

        {success ? (
          <div className="flex flex-col items-center py-6 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
            <p className="text-white text-lg font-medium mb-2">Account Setup Complete!</p>
            <p className="text-gray-400 mb-4">You can now log in with your email and password.</p>
            <Button 
              onClick={() => {
                // Get the user credentials
                const credentials = form.getValues() ? {
                  email: editedEmail.trim(),
                  password: form.getValues().password
                } : undefined;
                
                // Enhanced debugging
                console.log("🔄 Success button clicked, preparing for auto-login");
                if (credentials) {
                  console.log("✅ Credentials available for auto-login:", {
                    email: credentials.email,
                    password: credentials.password ? "********" : "missing"
                  });
                } else {
                  console.warn("⚠️ No credentials available for auto-login, form values missing");
                }
                
                // Show a loading state on the button to indicate progress
                setIsLoading(true);
                
                // First close the dialog directly by triggering an immediate close
                // This ensures the modal disappears without waiting for further processes
                console.log("🚪 Closing modal first");
                setTimeout(() => {
                  onClose();
                  console.log("🚪 Modal close triggered");
                }, 0);
                
                // Then pass credentials to parent for auto-login
                // We use a small delay to ensure closing happens first
                console.log("⏱️ Scheduling auto-login callback");
                setTimeout(() => {
                  console.log("🔐 Executing auto-login callback");
                  setIsLoading(false);
                  onSuccess(credentials);
                }, 100);  // Increased delay to ensure modal is fully closed
              }}
              disabled={isLoading}
              className="bg-[#74d1ea] hover:bg-[#5db8d0] text-black"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Continue to Dashboard"
              )}
            </Button>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">Email Address <span className="text-[#74d1ea]">*</span></Label>
                <Input
                  id="email"
                  value={editedEmail}
                  onChange={(e) => setEditedEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="bg-zinc-900 border-zinc-800 text-white"
                  required
                  autoFocus
                />
                <p className="text-xs text-gray-500">Please enter a valid email address where you can receive account notifications.</p>
              </div>

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="Create a strong password"
                        className="bg-zinc-900 border-zinc-800 text-white"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="Confirm your password"
                        className="bg-zinc-900 border-zinc-800 text-white"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {error && (
                <div className="flex items-start p-3 rounded bg-red-900/30 border border-red-900 text-red-400 gap-2">
                  <XCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <p className="text-sm">{error}</p>
                </div>
              )}

              <div className="p-3 rounded bg-zinc-900 border border-zinc-800">
                <p className="text-sm text-gray-400 mb-2 font-medium">Password requirements:</p>
                <ul className="text-xs text-gray-500 space-y-1">
                  <li>• At least 8 characters long</li>
                  <li>• At least one uppercase letter</li>
                  <li>• At least one lowercase letter</li>
                  <li>• At least one number</li>
                </ul>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleClose}
                  disabled={isLoading}
                  className="border-zinc-700 text-gray-300 hover:bg-zinc-900"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="bg-[#74d1ea] hover:bg-[#5db8d0] text-black"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Setting up...
                    </>
                  ) : "Create Account"}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}