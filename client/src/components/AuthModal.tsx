import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { Loader2 } from "lucide-react";

import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CustomDialogContent } from "@/components/ui/custom-dialog";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Define form validation schemas
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const registerSchema = z.object({
  email: z.string().email("Invalid email address")
    .refine((email) => {
      // This regex checks for common personal email domains and rejects them
      const personalEmailRegex = /@(gmail|yahoo|hotmail|outlook|aol|icloud|protonmail|zoho|gmx|mail|inbox|yandex|tutanota)\./i;
      return !personalEmailRegex.test(email);
    }, { message: "Please use a company email address" }),
  password: z.string().min(8, "Password must be at least 8 characters"),
  full_name: z.string().min(2, "Full name is required"),
  company: z.string().min(2, "Company name is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Login form component
function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const { loginMutation } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  function onSubmit(data: LoginFormValues) {
    // Clear any existing error messages
    setErrorMessage(null);
    
    loginMutation.mutate(data, {
      onSuccess: () => {
        form.reset();
        onSuccess();
      },
      onError: (error) => {
        if (error.message.includes("Database connection")) {
          setErrorMessage("We're experiencing temporary connection issues. Please try again in a moment.");
        } else if (error.message.includes("Network connection")) {
          setErrorMessage("Please check your internet connection and try again.");
        } else {
          setErrorMessage(error.message || "Login failed. Please check your credentials.");
        }
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Show error alert if there's an error */}
        {errorMessage && (
          <div className="bg-red-900/40 border border-red-500/50 text-red-200 px-4 py-3 rounded-md text-sm mb-4">
            <p>{errorMessage}</p>
          </div>
        )}
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  {...field}
                  className="bg-black border-gray-700/60 text-white focus:border-[#74d1ea]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Enter your password"
                  {...field}
                  className="bg-black border-gray-700/60 text-white focus:border-[#74d1ea]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="pt-4">
          <Button
            type="submit"
            className="w-full bg-[#74d1ea] hover:bg-[#5db8d0] text-black shadow-[0_0_10px_rgba(116,209,234,0.4)]"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Sign in
          </Button>
        </div>
      </form>
    </Form>
  );
}

// Register form component
function RegisterForm({ onSuccess }: { onSuccess: () => void }) {
  const { registerMutation } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      full_name: "",
      company: "",
    },
    mode: "onChange",
  });

  function onSubmit(data: RegisterFormValues) {
    // Clear any existing error messages
    setErrorMessage(null);
    
    registerMutation.mutate(data, {
      onSuccess: () => {
        form.reset();
        onSuccess();
      },
      onError: (error) => {
        if (error.message.includes("Database connection")) {
          setErrorMessage("We're experiencing temporary connection issues. Please try again in a moment.");
        } else if (error.message.includes("Network connection")) {
          setErrorMessage("Please check your internet connection and try again.");
        } else if (error.message.includes("Username already exists") || error.message.includes("Email already exists")) {
          setErrorMessage("This email is already registered. Please log in instead.");
        } else {
          setErrorMessage(error.message || "Registration failed. Please check your information.");
        }
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Show error alert if there's an error */}
        {errorMessage && (
          <div className="bg-red-900/40 border border-red-500/50 text-red-200 px-4 py-3 rounded-md text-sm mb-4">
            <p>{errorMessage}</p>
          </div>
        )}
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  {...field}
                  className="bg-black border-gray-700/60 text-white focus:border-[#74d1ea]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="full_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Full Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your full name"
                  {...field}
                  className="bg-black border-gray-700/60 text-white focus:border-[#74d1ea]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="company"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Company</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your company name"
                  {...field}
                  className="bg-black border-gray-700/60 text-white focus:border-[#74d1ea]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Create a password"
                  {...field}
                  className="bg-black border-gray-700/60 text-white focus:border-[#74d1ea]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="pt-4">
          <Button
            type="submit"
            className="w-full bg-[#74d1ea] hover:bg-[#5db8d0] text-black shadow-[0_0_10px_rgba(116,209,234,0.4)]"
            disabled={registerMutation.isPending}
          >
            {registerMutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Create account
          </Button>
        </div>
      </form>
    </Form>
  );
}

// Main AuthModal component
export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);

  // When user successfully logs in or registers
  const handleSuccess = () => {
    onClose();
  };

  // Toggle between login and register forms
  const handleModeToggle = () => {
    setIsLogin(!isLogin);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <CustomDialogContent 
        hideCloseButton={true} 
        className="sm:max-w-md bg-black border border-gray-700/60 text-white overflow-hidden shadow-[0_0_20px_rgba(116,209,234,0.15)]"
      >
        <div className="relative z-10">
          <DialogHeader className="flex flex-row items-center justify-between">
            <div>
              <DialogTitle className="text-white text-xl font-semibold" style={{ fontFamily: "'Open Sans', sans-serif" }}>
                {isLogin ? "Log in to Tovably" : "Create your account"}
              </DialogTitle>
              <DialogDescription className="text-gray-400">
                {isLogin ? "Enter your credentials below" : "Fill out the form to get started"}
              </DialogDescription>
            </div>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 border-gray-700/60 text-gray-400 hover:text-white hover:bg-gray-900"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>

          <div className="mt-6">
            {/* Render either LoginForm or RegisterForm based on state */}
            {isLogin ? (
              <LoginForm onSuccess={handleSuccess} />
            ) : (
              <RegisterForm onSuccess={handleSuccess} />
            )}

            <div className="mt-4 text-center">
              <Button
                variant="link"
                onClick={handleModeToggle}
                className="text-[#74d1ea] hover:text-[#5db8d0]"
              >
                {isLogin
                  ? "Don't have an account? Sign up"
                  : "Already have an account? Sign in"}
              </Button>
            </div>
          </div>
        </div>
      </CustomDialogContent>
    </Dialog>
  );
}