import React, { useState } from "react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, FileText, MessageSquare, BarChart, Zap, BellRing } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import tovablyLogo from '../assets/tovably-logo.png';

// Create a company email validator
const isCompanyEmail = (email: string) => {
  const domain = email.split('@')[1];
  if (!domain) return false;
  
  // List of common personal email domains to reject
  const personalDomains = [
    'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com', 
    'icloud.com', 'me.com', 'mac.com', 'msn.com', 'live.com', 
    'googlemail.com', 'ymail.com', 'protonmail.com', 'zoho.com'
  ];
  
  return !personalDomains.includes(domain.toLowerCase());
};

// Email form schema
const formSchema = z.object({
  email: z.string()
    .email({ message: "Please enter a valid email address" })
    .refine(isCompanyEmail, { 
      message: "Please use a company email address (personal email domains like gmail.com are not accepted)" 
    }),
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  company: z.string().min(2, { message: "Company name is required" }),
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
      company: "",
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
          company: values.company,
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
    <div className="min-h-screen bg-black text-white flex flex-col items-center">
      {/* Hero section */}
      <div className="w-full relative overflow-hidden">
        {/* Background gradient effects */}
        <div className="absolute -top-[30%] -right-[20%] w-[70%] h-[70%] bg-[#74d1ea]/10 rounded-full blur-[120px] opacity-70" />
        <div className="absolute -bottom-[30%] -left-[20%] w-[70%] h-[70%] bg-[#74d1ea]/10 rounded-full blur-[120px] opacity-70" />
        
        <div className="max-w-screen-xl w-full mx-auto px-6 py-16 md:py-20 text-center">
          <div className="flex justify-center mb-12">
            <img src={tovablyLogo} alt="Tovably" className="h-10" />
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="text-[#74d1ea] text-sm mb-4 flex items-center justify-center">
              <span className="mr-1.5">•</span> Launching Soon
            </div>
            
            <h1 className="text-4xl md:text-5xl font-medium tracking-tight leading-tight mb-6">
              <span className="text-white">Revolutionise your comms</span><br />
              <span className="text-white">with </span>
              <span className="text-[#74d1ea]">AI-powered personas</span><br />
              <span className="text-white">and </span>
              <span className="text-[#74d1ea]">TOV analysis</span>
            </h1>
            
            <p className="text-zinc-400 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
              Tovably is a cutting-edge AI platform that helps you analyze your content's tone, 
              create targeted personas, and generate powerful messages that connect with your audience.
            </p>

            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-8 mb-14 max-w-xl mx-auto">
              <h3 className="font-medium text-xl mb-5 flex items-center justify-center">
                <BellRing className="h-5 w-5 text-[#74d1ea] mr-2" /> 
                <span>Find out when we go live</span>
              </h3>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            className="bg-zinc-900 border-zinc-800 focus:border-[#74d1ea] h-10"
                            placeholder="Your name"
                            {...field}
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
                        <FormControl>
                          <Input
                            className="bg-zinc-900 border-zinc-800 focus:border-[#74d1ea] h-10"
                            placeholder="Your company"
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
                                className="bg-zinc-900 border-zinc-800 focus:border-[#74d1ea] h-10"
                                placeholder="yourname@company.com"
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
                      className="bg-[#74d1ea] hover:bg-[#74d1ea]/90 text-black font-normal text-sm rounded h-10 px-4"
                    >
                      {isSubmitting ? (
                        <div className="h-4 w-4 border-2 border-black/20 border-t-black animate-spin rounded-full"></div>
                      ) : (
                        <div className="flex items-center whitespace-nowrap">
                          <span>Notify Me</span>
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </div>
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-zinc-500 text-center">
                    Be the first to know when Tovably launches. Early access subscribers will receive exclusive benefits.
                  </p>
                </form>
              </Form>
            </div>

            <h2 className="text-2xl font-medium mb-8 text-center">A glimpse of what's coming</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20 max-w-5xl mx-auto">
              <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-lg p-6 text-center">
                <div className="text-[#74d1ea] mb-4 flex justify-center">
                  <FileText className="h-5 w-5" />
                </div>
                <h3 className="font-medium text-white text-lg mb-2">AI-Powered Tone Analysis</h3>
                <p className="text-sm text-zinc-400">
                  Analyze how your brand's tone connects with your audience using our advanced AI tools that uncover patterns in your communication style.
                </p>
              </div>
              
              <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-lg p-6 text-center">
                <div className="text-[#74d1ea] mb-4 flex justify-center">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <h3 className="font-medium text-white text-lg mb-2">Intelligent Content Creation</h3>
                <p className="text-sm text-zinc-400">
                  Generate targeted content aligned with your brand voice for emails, social posts, and more with our AI-assisted content engine.
                </p>
              </div>
              
              <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-lg p-6 text-center">
                <div className="text-[#74d1ea] mb-4 flex justify-center">
                  <BarChart className="h-5 w-5" />
                </div>
                <h3 className="font-medium text-white text-lg mb-2">Audience Persona Builder</h3>
                <p className="text-sm text-zinc-400">
                  Create detailed audience personas to tailor your content for specific demographics and communication preferences.
                </p>
              </div>
              
              <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-lg p-6 text-center">
                <div className="text-[#74d1ea] mb-4 flex justify-center">
                  <Zap className="h-5 w-5" />
                </div>
                <h3 className="font-medium text-white text-lg mb-2">Actionable Insights</h3>
                <p className="text-sm text-zinc-400">
                  Get detailed recommendations to improve your content strategy and enhance audience engagement based on data-driven analysis.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Pricing preview */}
      <div className="w-full border-t border-zinc-800">
        <div className="max-w-screen-xl w-full mx-auto px-6 py-20 text-center">
          <div className="mb-14">
            <h2 className="text-2xl md:text-3xl font-medium mb-5">Simple, transparent pricing</h2>
            <p className="text-zinc-400 max-w-xl mx-auto">
              Choose the plan that fits your needs, from individual creators to enterprise teams
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-zinc-900/30 rounded-lg p-8 border border-zinc-800/50">
              <div className="mb-4">
                <h3 className="text-lg font-medium">Free</h3>
                <p className="text-3xl font-medium mt-2">£0<span className="text-sm text-zinc-400">/month</span></p>
              </div>
              <p className="text-zinc-400 text-sm mb-6">Perfect for trying out the platform</p>
              <ul className="space-y-2 text-sm text-zinc-400 mb-6">
                <li className="flex items-center justify-center">
                  <span className="text-[#74d1ea] mr-2">✓</span> 5 persona creations
                </li>
                <li className="flex items-center justify-center">
                  <span className="text-[#74d1ea] mr-2">✓</span> 3 tone analyses
                </li>
                <li className="flex items-center justify-center">
                  <span className="text-[#74d1ea] mr-2">✓</span> 10 content generations
                </li>
              </ul>
            </div>

            <div className="bg-zinc-900/30 rounded-lg p-8 border border-[#74d1ea]/30 ring-1 ring-[#74d1ea]/20 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[#74d1ea] text-black text-xs py-1 px-3 rounded-full">
                Most Popular
              </div>
              <div className="mb-4">
                <h3 className="text-lg font-medium">Standard</h3>
                <p className="text-3xl font-medium mt-2">£9.99<span className="text-sm text-zinc-400">/month</span></p>
              </div>
              <p className="text-zinc-400 text-sm mb-6">For individuals and small teams</p>
              <ul className="space-y-2 text-sm text-zinc-400 mb-6">
                <li className="flex items-center justify-center">
                  <span className="text-[#74d1ea] mr-2">✓</span> Unlimited personas
                </li>
                <li className="flex items-center justify-center">
                  <span className="text-[#74d1ea] mr-2">✓</span> 20 tone analyses per month
                </li>
                <li className="flex items-center justify-center">
                  <span className="text-[#74d1ea] mr-2">✓</span> 100 content generations
                </li>
              </ul>
            </div>

            <div className="bg-zinc-900/30 rounded-lg p-8 border border-zinc-800/50">
              <div className="mb-4">
                <h3 className="text-lg font-medium">Professional</h3>
                <p className="text-3xl font-medium mt-2">£24.99<span className="text-sm text-zinc-400">/month</span></p>
              </div>
              <p className="text-zinc-400 text-sm mb-6">For professionals and growing teams</p>
              <ul className="space-y-2 text-sm text-zinc-400 mb-6">
                <li className="flex items-center justify-center">
                  <span className="text-[#74d1ea] mr-2">✓</span> Everything in Standard plus
                </li>
                <li className="flex items-center justify-center">
                  <span className="text-[#74d1ea] mr-2">✓</span> Advanced analytics
                </li>
                <li className="flex items-center justify-center">
                  <span className="text-[#74d1ea] mr-2">✓</span> Priority support
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-16 text-center max-w-3xl mx-auto">
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
              <h3 className="font-medium mb-3">Want to be notified when we launch?</h3>
              <p className="text-zinc-400 text-sm mb-5">
                Join our early access list to receive exclusive launch discounts and benefits.
              </p>
              <Button onClick={() => document.querySelector('form')?.scrollIntoView({ behavior: 'smooth' })} className="bg-[#74d1ea] hover:bg-[#74d1ea]/90 text-black font-normal">
                <div className="flex items-center">
                  <BellRing className="mr-2 h-4 w-4" />
                  <span>Join the waiting list</span>
                </div>
              </Button>
            </div>
            
            <p className="text-xs text-zinc-500 mt-10">
              &copy; {new Date().getFullYear()} Tovably. All rights reserved. <a href="/contact" className="hover:text-[#74d1ea]">Contact us</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}