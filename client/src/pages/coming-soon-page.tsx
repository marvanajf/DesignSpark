import React, { useState } from "react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, FileText, MessageSquare, BarChart, Zap } from "lucide-react";
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
    <div className="min-h-screen bg-black text-white">
      {/* Global navigation */}
      <header className="border-b border-zinc-800 bg-black">
        <div className="container max-w-screen-xl mx-auto px-4 py-3 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <img src={tovablyLogo} alt="Tovably" className="h-6" />
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm text-zinc-400 hover:text-white px-3 py-1">
              Log in
            </Link>
            <Button size="sm" className="bg-[#74d1ea] hover:bg-[#5db8d0] text-black rounded text-sm font-normal">
              Get started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero section */}
      <div className="relative overflow-hidden">
        <div className="container max-w-screen-xl mx-auto px-6 py-16 md:py-20">
          <div className="max-w-3xl">
            <div className="text-[#74d1ea] text-sm mb-4 flex items-center">
              <span className="mr-1.5">•</span> Tovably Coming Soon
            </div>
            
            <h1 className="text-4xl md:text-5xl font-medium tracking-tight leading-tight mb-6">
              <span className="text-white">Understand how your brand's<br /></span>
              <span className="text-[#74d1ea]">tone</span>
              <span className="text-white"> connects with your<br />audience</span>
            </h1>
            
            <p className="text-zinc-400 text-lg mb-10 max-w-2xl leading-relaxed">
              Analyze your content's tone, uncover patterns in your communication style, 
              and discover how to enhance your brand's presence through precise language.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-16">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col sm:flex-row gap-3 max-w-lg">
                  <div className="flex-1">
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
                  </div>
                  
                  <div className="flex flex-1 gap-2">
                    <div className="flex-grow">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                className="bg-zinc-900 border-zinc-800 focus:border-[#74d1ea] h-10"
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
                      className="bg-[#74d1ea] hover:bg-[#74d1ea]/90 text-black font-normal text-sm rounded h-10 px-4"
                    >
                      {isSubmitting ? (
                        <div className="h-4 w-4 border-2 border-black/20 border-t-black animate-spin rounded-full"></div>
                      ) : "Get started"}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-4 border-t border-zinc-800 pt-16">
              <div className="flex flex-col">
                <div className="text-[#74d1ea] mb-3">
                  <FileText className="h-5 w-5" />
                </div>
                <h3 className="font-medium text-white mb-2">Analyze Your Content</h3>
                <p className="text-sm text-zinc-400">
                  See how your brand's tone comes across in your content and identify key characteristics.
                </p>
              </div>
              
              <div className="flex flex-col">
                <div className="text-[#74d1ea] mb-3">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <h3 className="font-medium text-white mb-2">Discover Language Patterns</h3>
                <p className="text-sm text-zinc-400">
                  Understand your vocabulary choices, sentence structure, and overall communication style.
                </p>
              </div>
              
              <div className="flex flex-col">
                <div className="text-[#74d1ea] mb-3">
                  <BarChart className="h-5 w-5" />
                </div>
                <h3 className="font-medium text-white mb-2">Uncover Insights</h3>
                <p className="text-sm text-zinc-400">
                  Find out which tonal elements resonate with your audience and how to leverage them.
                </p>
              </div>
              
              <div className="flex flex-col">
                <div className="text-[#74d1ea] mb-3">
                  <Zap className="h-5 w-5" />
                </div>
                <h3 className="font-medium text-white mb-2">Take Action</h3>
                <p className="text-sm text-zinc-400">
                  Improve your content's effectiveness with AI-generated recommendations based on your analysis.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary content - How it works */}
      <div className="border-t border-zinc-800">
        <div className="container max-w-screen-xl mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-3xl font-medium mb-5">How Tone Analysis Works</h2>
            <p className="text-zinc-400 max-w-xl mx-auto">
              Our AI-powered tone analysis provides deep insights into your brand's voice
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-zinc-900/30 rounded-lg p-8 border border-zinc-800/50">
              <div className="h-10 w-10 rounded-full bg-[#74d1ea]/20 flex items-center justify-center mb-6 text-white">
                1
              </div>
              <h3 className="text-lg font-medium mb-3">Input Your Content</h3>
              <p className="text-zinc-400 text-sm">
                Upload a sample of your existing content, enter a URL to your website, or provide blog posts, emails, or any text content you'd like to analyze.
              </p>
            </div>

            <div className="bg-zinc-900/30 rounded-lg p-8 border border-zinc-800/50">
              <div className="h-10 w-10 rounded-full bg-[#74d1ea]/20 flex items-center justify-center mb-6 text-white">
                2
              </div>
              <h3 className="text-lg font-medium mb-3">AI Analysis</h3>
              <p className="text-zinc-400 text-sm">
                Our advanced AI analyzes your content for tone, formality, technical complexity, friendliness, and other key attributes that define your brand's voice.
              </p>
            </div>

            <div className="bg-zinc-900/30 rounded-lg p-8 border border-zinc-800/50">
              <div className="h-10 w-10 rounded-full bg-[#74d1ea]/20 flex items-center justify-center mb-6 text-white">
                3
              </div>
              <h3 className="text-lg font-medium mb-3">Actionable Results</h3>
              <p className="text-zinc-400 text-sm">
                Receive a comprehensive analysis with visual breakdowns and actionable insights to refine your content strategy and enhance audience engagement.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="border-t border-zinc-800 py-8">
        <div className="container max-w-screen-xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <img src={tovablyLogo} alt="Tovably" className="h-5" />
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-sm text-zinc-500">
                &copy; {new Date().getFullYear()} Tovably. All rights reserved.
              </p>
              <p className="text-xs text-zinc-600 mt-1">
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