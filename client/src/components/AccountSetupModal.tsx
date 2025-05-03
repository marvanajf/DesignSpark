import { useState } from "react";
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
  onSuccess: () => void;
}

export default function AccountSetupModal({ email, open, onClose, onSuccess }: AccountSetupModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();

  const form = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const handleSubmit = async (data: PasswordFormData) => {
    if (!email) {
      setError("Email is missing. Please try again.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Check if we're in development/test mode
      const testMode = process.env.NODE_ENV === 'development';
      const queryParams = testMode ? '?testMode=true' : '';
      
      const response = await apiRequest("POST", `/api/setup-account${queryParams}`, {
        email,
        password: data.password
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to setup account");
      }

      setSuccess(true);
      toast({
        title: "Account setup successful!",
        description: "Your password has been set. You can now log in to your account.",
        variant: "default",
      });
      
      // Wait a moment before closing the modal to show success state
      setTimeout(() => {
        onSuccess();
      }, 1500);
    } catch (err) {
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

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && !isLoading && onClose()}>
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
                // Ensure modal properly closes
                setSuccess(false);
                onSuccess();
              }} 
              className="bg-[#74d1ea] hover:bg-[#5db8d0] text-black"
            >
              Continue
            </Button>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">Email</Label>
                <Input
                  id="email"
                  value={email || ""}
                  disabled
                  className="bg-zinc-900 border-zinc-800 text-white"
                />
                <p className="text-xs text-gray-500">This is the email address from your payment details.</p>
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
                  onClick={onClose}
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