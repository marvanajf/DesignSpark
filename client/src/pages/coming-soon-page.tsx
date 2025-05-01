import React, { useState } from "react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import tovablyLogo from '../assets/tovably-logo.png';
import { Link } from "wouter";

// Email form schema
const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
});

type FormValues = z.infer<typeof formSchema>;

export default function ComingSoonPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      name: "",
    },
  });
  
  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    
    try {
      const response = await fetch("/api/lead-contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: values.email,
          name: values.name,
          message: "Early access request from coming soon page",
          status: "new_lead",
        }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to submit. Please try again.");
      }
      
      toast({
        title: "Thanks for your interest!",
        description: "We'll notify you when Tovably launches.",
        variant: "default",
      });
      
      form.reset();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Something went wrong",
        description: error instanceof Error ? error.message : "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      {/* Header/Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-black">
        <div className="container flex h-14 items-center px-4 md:px-6">
          <div className="mr-8">
            <Link to="/">
              <img src={tovablyLogo} alt="Tovably" className="h-7" />
            </Link>
          </div>
          <nav className="hidden md:flex flex-1 items-center justify-between">
            <div className="flex gap-6 text-sm">
              <Link to="/" className="text-zinc-400 hover:text-white transition-colors">
                Platform
              </Link>
              <Link to="/" className="text-zinc-400 hover:text-white transition-colors">
                Resources
              </Link>
              <Link to="/pricing" className="text-zinc-400 hover:text-white transition-colors">
                Pricing
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" className="text-zinc-400 border-zinc-800 hover:text-white hover:border-zinc-700">
                Log in
              </Button>
              <Button size="sm" className="bg-[#74d1ea] hover:bg-[#5db8d0] text-black font-medium">
                Get started
              </Button>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero section */}
      <div className="flex-1 relative overflow-hidden">
        {/* Background gradient effects */}
        <div className="absolute -top-[30%] -right-[20%] w-[70%] h-[70%] bg-[#74d1ea]/10 rounded-full blur-[120px] opacity-70" />
        <div className="absolute -bottom-[30%] -left-[20%] w-[70%] h-[70%] bg-[#74d1ea]/10 rounded-full blur-[120px] opacity-70" />
        
        <div className="container mx-auto px-4 pt-16 pb-16 md:pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <motion.div 
              className="lg:col-span-7 relative z-10"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="space-y-6">
                <div className="inline-flex items-center rounded-full border border-[#74d1ea]/30 bg-[#74d1ea]/10 px-3 py-1 text-sm text-[#74d1ea]">
                  <span className="mr-1">✨</span> Coming Soon
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
                  <span className="text-white">Understand how your brand's </span>
                  <span className="text-[#74d1ea]">tone</span>
                  <span className="text-white"> connects with your audience</span>
                </h1>
                <p className="text-lg text-zinc-400 max-w-xl">
                  Analyze your content's tone, uncover patterns in your communication style, and discover how to enhance your brand's presence through precise language.
                </p>
                
                <div className="space-y-3">
                  {[
                    "Generate content based on your brand voice and tone",
                    "Create personas tailored to your target audience",
                    "Analyze your content for maximum impact"
                  ].map((feature, i) => (
                    <div key={i} className="flex items-start">
                      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-[#74d1ea]/20 flex items-center justify-center mr-3 mt-0.5">
                        <Check className="h-3.5 w-3.5 text-[#74d1ea]" />
                      </div>
                      <p className="text-zinc-300">{feature}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mt-10 max-w-md">
                <h3 className="text-lg font-semibold mb-4">Find out when we go live</h3>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              className="bg-zinc-900 border-zinc-700 focus:border-[#74d1ea] h-12"
                              placeholder="Your name"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex space-x-2">
                      <div className="flex-grow">
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  className="bg-zinc-900 border-zinc-700 focus:border-[#74d1ea] h-12"
                                  placeholder="Enter your email"
                                  type="email"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-[#74d1ea] hover:bg-[#5db8d0] text-black font-medium h-12 px-6 whitespace-nowrap"
                      >
                        {isSubmitting ? (
                          <div className="h-4 w-4 border-2 border-black/20 border-t-black animate-spin rounded-full"></div>
                        ) : (
                          <div className="flex items-center">
                            <span>Get Notified</span>
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </div>
                        )}
                      </Button>
                    </div>
                    <p className="text-xs text-zinc-500">
                      We'll notify you when we launch. No spam, we promise!
                    </p>
                  </form>
                </Form>
              </div>
            </motion.div>
            
            <motion.div
              className="lg:col-span-5 relative z-10"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              <div className="grid grid-cols-1 gap-4">
                {/* Feature Cards */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 shadow-lg">
                  <h3 className="font-semibold text-lg mb-2">Analyze Your Content</h3>
                  <p className="text-zinc-400 text-sm mb-4">
                    See how your brand's tone comes across in your content and identify key characteristics.
                  </p>
                </div>
                
                <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 shadow-lg">
                  <h3 className="font-semibold text-lg mb-2">Discover Language Patterns</h3>
                  <p className="text-zinc-400 text-sm mb-4">
                    Understand your vocabulary choices, sentence structure, and overall communication style.
                  </p>
                </div>
                
                <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 shadow-lg">
                  <h3 className="font-semibold text-lg mb-2">Uncover Insights</h3>
                  <p className="text-zinc-400 text-sm mb-4">
                    Find out which tonal elements resonate with your audience and how to leverage them.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="border-t border-zinc-800 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <img src={tovablyLogo} alt="Tovably" className="h-6" />
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-sm text-zinc-400">
                &copy; {new Date().getFullYear()} Tovably. All rights reserved.
              </p>
              <p className="text-xs text-zinc-500 mt-1">
                <a href="mailto:sales@tovably.com" className="hover:text-[#74d1ea]">
                  sales@tovably.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}