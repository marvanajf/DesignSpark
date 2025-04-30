import { useState } from 'react';
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Layout from "@/components/Layout";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowRight, 
  Zap, 
  MessageSquare, 
  BarChart3, 
  Brain, 
  CheckCircle,
  Sparkles
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAuthModal } from "@/hooks/use-auth-modal";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  company: z.string().optional(),
  message: z.string().min(10, {
    message: "Message must be at least 10 characters.",
  }).max(500, {
    message: "Message cannot exceed 500 characters."
  }),
});

type FormValues = z.infer<typeof formSchema>;

export default function LandingPage() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { openAuthModal } = useAuthModal();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      message: ""
    },
  });

  const handleGetStarted = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      openAuthModal();
    }
  };

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      // This would ideally call a real endpoint to save leads
      // For now, we'll just simulate a successful submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Information Submitted",
        description: "Thank you for your interest! We'll be in touch soon.",
      });
      
      setSubmitted(true);
      form.reset();
    } catch (error) {
      toast({
        title: "Something went wrong.",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      {/* Hero Section with Glow Effect */}
      <div className="relative min-h-[90vh] flex items-center justify-center bg-black overflow-hidden">
        {/* Animated gradient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#74d1ea]/20 rounded-full blur-[100px] animate-pulse"></div>
        
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 relative z-10 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left content */}
            <div>
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#74d1ea]/10 border border-[#74d1ea]/30 text-[#74d1ea] text-sm font-medium mb-6">
                <Sparkles className="h-4 w-4 mr-2" />
                <span>AI-Powered Communication Platform</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
                Elevate Your <span className="text-[#74d1ea] relative">Content<span className="absolute -bottom-2 left-0 w-full h-1 bg-[#74d1ea]/30 rounded-full"></span></span> with AI-Driven Insights
              </h1>
              
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Tovably helps businesses communicate more effectively with their audience through 
                advanced tone analysis, persona targeting, and AI-powered content generation.
              </p>
              
              <div className="flex flex-wrap gap-4 mb-12">
                <Button 
                  onClick={handleGetStarted}
                  className="px-8 py-3 bg-[#74d1ea] hover:bg-[#5db8d0] text-black shadow-[0_0_15px_rgba(116,209,234,0.4)] text-lg font-medium"
                >
                  Start Free Trial
                </Button>
                <Button 
                  variant="outline"
                  className="px-8 py-3 text-white border-gray-700 hover:bg-gray-900 text-lg font-medium"
                  onClick={() => {
                    const contactForm = document.getElementById('contact-form');
                    contactForm?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Request Demo
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-[#74d1ea] mr-2" />
                  <span className="text-gray-300">No credit card required</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-[#74d1ea] mr-2" />
                  <span className="text-gray-300">Free 7-day trial</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-[#74d1ea] mr-2" />
                  <span className="text-gray-300">Cancel anytime</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-[#74d1ea] mr-2" />
                  <span className="text-gray-300">24/7 support</span>
                </div>
              </div>
            </div>
            
            {/* Right content: Stats/features display */}
            <div className="bg-gradient-to-b from-gray-900/50 to-black/50 p-8 rounded-2xl border border-gray-800/80 shadow-[0_0_30px_rgba(116,209,234,0.1)]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-black/50 p-5 rounded-xl border border-gray-800/60">
                  <div className="bg-[#74d1ea]/10 h-12 w-12 rounded-lg flex items-center justify-center mb-4">
                    <MessageSquare className="h-6 w-6 text-[#74d1ea]" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Tone Analysis</h3>
                  <p className="text-gray-400">Understand how your content resonates with your audience</p>
                </div>
                
                <div className="bg-black/50 p-5 rounded-xl border border-gray-800/60">
                  <div className="bg-[#74d1ea]/10 h-12 w-12 rounded-lg flex items-center justify-center mb-4">
                    <Brain className="h-6 w-6 text-[#74d1ea]" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Persona Creation</h3>
                  <p className="text-gray-400">Target specific audience segments with personalized content</p>
                </div>
                
                <div className="bg-black/50 p-5 rounded-xl border border-gray-800/60">
                  <div className="bg-[#74d1ea]/10 h-12 w-12 rounded-lg flex items-center justify-center mb-4">
                    <Zap className="h-6 w-6 text-[#74d1ea]" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Content Generation</h3>
                  <p className="text-gray-400">Create high-converting content tailored to your brand voice</p>
                </div>
                
                <div className="bg-black/50 p-5 rounded-xl border border-gray-800/60">
                  <div className="bg-[#74d1ea]/10 h-12 w-12 rounded-lg flex items-center justify-center mb-4">
                    <BarChart3 className="h-6 w-6 text-[#74d1ea]" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Analytics</h3>
                  <p className="text-gray-400">Gain insights into content performance and audience engagement</p>
                </div>
              </div>
              
              <div className="text-center mt-6">
                <p className="text-sm text-[#74d1ea]">Trusted by top brands worldwide</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Benefits Section */}
      <div className="bg-black py-20 border-t border-gray-800/50">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Transform Your Communication Strategy</h2>
            <p className="text-xl text-gray-300">See how Tovably empowers your team to create content that truly connects with your audience</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-b from-gray-900/30 to-black/30 rounded-xl p-8 border border-gray-800/60 relative overflow-hidden group hover:shadow-[0_0_30px_rgba(116,209,234,0.15)] transition-all duration-300">
              <div className="absolute top-0 right-0 h-24 w-24 bg-[#74d1ea]/5 rounded-bl-full"></div>
              <div className="relative z-10">
                <div className="bg-[#74d1ea]/10 h-14 w-14 rounded-lg flex items-center justify-center mb-6 border border-[#74d1ea]/20">
                  <MessageSquare className="h-7 w-7 text-[#74d1ea]" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-4">Understand Your Audience</h3>
                <p className="text-gray-300 mb-6">Analyze your existing content to identify the tone and style that resonates most with your target audience.</p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <ArrowRight className="h-5 w-5 text-[#74d1ea] mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-400">Comprehensive tone analysis</span>
                  </li>
                  <li className="flex items-start">
                    <ArrowRight className="h-5 w-5 text-[#74d1ea] mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-400">Audience resonance metrics</span>
                  </li>
                  <li className="flex items-start">
                    <ArrowRight className="h-5 w-5 text-[#74d1ea] mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-400">Sentiment evaluation</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="bg-gradient-to-b from-gray-900/30 to-black/30 rounded-xl p-8 border border-gray-800/60 relative overflow-hidden group hover:shadow-[0_0_30px_rgba(116,209,234,0.15)] transition-all duration-300">
              <div className="absolute top-0 right-0 h-24 w-24 bg-[#74d1ea]/5 rounded-bl-full"></div>
              <div className="relative z-10">
                <div className="bg-[#74d1ea]/10 h-14 w-14 rounded-lg flex items-center justify-center mb-6 border border-[#74d1ea]/20">
                  <Brain className="h-7 w-7 text-[#74d1ea]" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-4">Target Specific Personas</h3>
                <p className="text-gray-300 mb-6">Create detailed audience personas and generate content tailored specifically to each segment.</p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <ArrowRight className="h-5 w-5 text-[#74d1ea] mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-400">AI-generated personas</span>
                  </li>
                  <li className="flex items-start">
                    <ArrowRight className="h-5 w-5 text-[#74d1ea] mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-400">Interest-based segmentation</span>
                  </li>
                  <li className="flex items-start">
                    <ArrowRight className="h-5 w-5 text-[#74d1ea] mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-400">Custom persona creation</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="bg-gradient-to-b from-gray-900/30 to-black/30 rounded-xl p-8 border border-gray-800/60 relative overflow-hidden group hover:shadow-[0_0_30px_rgba(116,209,234,0.15)] transition-all duration-300">
              <div className="absolute top-0 right-0 h-24 w-24 bg-[#74d1ea]/5 rounded-bl-full"></div>
              <div className="relative z-10">
                <div className="bg-[#74d1ea]/10 h-14 w-14 rounded-lg flex items-center justify-center mb-6 border border-[#74d1ea]/20">
                  <Zap className="h-7 w-7 text-[#74d1ea]" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-4">Generate Engaging Content</h3>
                <p className="text-gray-300 mb-6">Produce high-quality content that maintains your brand voice while optimized for each persona.</p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <ArrowRight className="h-5 w-5 text-[#74d1ea] mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-400">LinkedIn posts & emails</span>
                  </li>
                  <li className="flex items-start">
                    <ArrowRight className="h-5 w-5 text-[#74d1ea] mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-400">Tone-consistent generation</span>
                  </li>
                  <li className="flex items-start">
                    <ArrowRight className="h-5 w-5 text-[#74d1ea] mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-400">Unlimited content variations</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Contact Form Section */}
      <div id="contact-form" className="bg-black py-20 border-t border-gray-800/50">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#74d1ea]/10 border border-[#74d1ea]/30 text-[#74d1ea] text-sm font-medium mb-6">
                <MessageSquare className="h-4 w-4 mr-2" />
                <span>Get In Touch</span>
              </div>
              
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">Ready to transform your communication strategy?</h2>
              
              <p className="text-xl text-gray-300 mb-8">
                Fill out the form to request more information, a personalized demo, or to start your free trial today.
              </p>
              
              <div className="space-y-6 mb-8">
                <div className="flex items-start">
                  <div className="bg-[#74d1ea]/10 h-10 w-10 rounded-full flex items-center justify-center mr-4">
                    <CheckCircle className="h-5 w-5 text-[#74d1ea]" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-1">Personalized Onboarding</h4>
                    <p className="text-gray-400">Get a customized tour of the platform tailored to your business needs</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-[#74d1ea]/10 h-10 w-10 rounded-full flex items-center justify-center mr-4">
                    <CheckCircle className="h-5 w-5 text-[#74d1ea]" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-1">Expert Consultation</h4>
                    <p className="text-gray-400">Speak with our communication experts to optimize your strategy</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-[#74d1ea]/10 h-10 w-10 rounded-full flex items-center justify-center mr-4">
                    <CheckCircle className="h-5 w-5 text-[#74d1ea]" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-1">Flexible Pricing Options</h4>
                    <p className="text-gray-400">Choose a plan that fits your needs and scales with your business</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-b from-gray-900/50 to-black/30 p-8 rounded-2xl border border-gray-800/80 shadow-[0_0_30px_rgba(116,209,234,0.1)]">
              {submitted ? (
                <div className="text-center py-12">
                  <div className="bg-[#74d1ea]/20 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="h-10 w-10 text-[#74d1ea]" />
                  </div>
                  <h3 className="text-2xl font-semibold text-white mb-4">Thank You!</h3>
                  <p className="text-gray-300 mb-6">
                    We've received your information and will be in touch shortly.
                  </p>
                  <Button 
                    onClick={() => setSubmitted(false)}
                    className="bg-[#74d1ea]/10 hover:bg-[#74d1ea]/20 text-[#74d1ea] border border-[#74d1ea]/30"
                  >
                    Submit Another Request
                  </Button>
                </div>
              ) : (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <h3 className="text-2xl font-semibold text-white mb-6">Request Information</h3>
                    
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Name</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Your name" 
                              {...field} 
                              className="bg-black/50 border-gray-700 text-white"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Email</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="your.email@example.com" 
                              type="email"
                              {...field} 
                              className="bg-black/50 border-gray-700 text-white"
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
                          <FormLabel className="text-white">Company (Optional)</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Your company name" 
                              {...field} 
                              className="bg-black/50 border-gray-700 text-white"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Message</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Tell us about your needs or any questions you have" 
                              {...field} 
                              className="bg-black/50 border-gray-700 text-white min-h-[120px]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-[#74d1ea] hover:bg-[#5db8d0] text-black shadow-[0_0_15px_rgba(116,209,234,0.2)]"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Submitting..." : "Submit Request"}
                    </Button>
                    
                    <p className="text-gray-400 text-sm text-center">
                      By submitting this form, you agree to our <a href="#" className="text-[#74d1ea] hover:underline">Privacy Policy</a> and <a href="#" className="text-[#74d1ea] hover:underline">Terms of Service</a>.
                    </p>
                  </form>
                </Form>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="bg-black py-20 border-t border-gray-800/50">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">Ready to elevate your communication?</h2>
            <p className="text-xl text-gray-300 mb-10">
              Join thousands of businesses already transforming their content strategy with Tovably.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button 
                onClick={handleGetStarted}
                className="px-8 py-3 bg-[#74d1ea] hover:bg-[#5db8d0] text-black shadow-[0_0_15px_rgba(116,209,234,0.4)] text-lg font-medium"
              >
                Start Free Trial
              </Button>
              <Button 
                variant="outline"
                className="px-8 py-3 text-white border-gray-700 hover:bg-gray-900 text-lg font-medium"
                onClick={() => {
                  const contactForm = document.getElementById('contact-form');
                  contactForm?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Request Demo
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}