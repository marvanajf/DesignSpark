import React, { useState } from "react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { Zap, Check, ArrowRight, Mail, MessageSquare, BarChart4, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";

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
      {/* Hero section */}
      <div className="relative overflow-hidden">
        {/* Background gradient effects */}
        <div className="absolute -top-[30%] -right-[20%] w-[70%] h-[70%] bg-[#74d1ea]/10 rounded-full blur-[120px] opacity-70" />
        <div className="absolute -bottom-[30%] -left-[20%] w-[70%] h-[70%] bg-[#74d1ea]/10 rounded-full blur-[120px] opacity-70" />
        
        <div className="container mx-auto px-4 pt-12 sm:pt-24 pb-20">
          <div className="flex justify-between items-center mb-20">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-[#74d1ea] to-[#5db8d0] rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-black">T</span>
              </div>
              <span className="text-2xl font-bold tracking-tighter">Tovably</span>
            </div>
            
            <motion.div 
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Button 
                className="bg-transparent border border-[#74d1ea]/30 hover:border-[#74d1ea] text-[#74d1ea] hover:bg-[#74d1ea]/10"
              >
                <Mail className="h-4 w-4 mr-2" />
                Contact Us
              </Button>
            </motion.div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="relative z-10"
            >
              <div className="inline-flex items-center rounded-full border border-[#74d1ea]/30 bg-[#74d1ea]/10 px-3 py-1 text-sm text-[#74d1ea] mb-6">
                <span className="mr-1">✨</span> Coming Soon
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
                <span className="text-white">Master AI-Powered </span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#74d1ea] to-[#5db8d0]">
                  Communication
                </span>
              </h1>
              <p className="text-lg text-gray-400 mb-8 max-w-xl">
                Revolutionize your content with AI-driven personas, intelligent tone analysis, and 
                smart content generation. Craft content that resonates with your audience.
              </p>
              
              <div className="space-y-3 mb-8">
                {[
                  "Generate content based on your brand voice and tone",
                  "Create personas tailored to your target audience",
                  "Analyze your content for maximum impact"
                ].map((feature, i) => (
                  <div key={i} className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-[#74d1ea]/20 flex items-center justify-center mr-3 mt-0.5">
                      <Check className="h-3.5 w-3.5 text-[#74d1ea]" />
                    </div>
                    <p className="text-gray-300">{feature}</p>
                  </div>
                ))}
              </div>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-4">
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
                        className="bg-[#74d1ea] hover:bg-[#5db8d0] text-black font-medium h-12 px-6"
                      >
                        {isSubmitting ? (
                          <div className="flex items-center">
                            <div className="h-4 w-4 mr-2 border-2 border-black/20 border-t-black animate-spin rounded-full"></div>
                            <span>Submitting...</span>
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <span>Get Early Access</span>
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </div>
                        )}
                      </Button>
                    </div>
                  </div>
                </form>
              </Form>
              
              <p className="text-xs text-gray-500 mt-3">
                We'll notify you when we launch. No spam, we promise!
              </p>
            </motion.div>
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="relative z-10 hidden lg:block"
            >
              <div className="relative bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 shadow-xl">
                <div className="h-10 bg-zinc-800 flex items-center px-4">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-6">
                    <div className="bg-zinc-800 p-4 rounded-lg">
                      <div className="flex items-center mb-3">
                        <div className="h-8 w-8 rounded-full bg-[#74d1ea]/20 flex items-center justify-center">
                          <BarChart4 className="h-4 w-4 text-[#74d1ea]" />
                        </div>
                        <h3 className="ml-3 font-semibold">Tone Analysis</h3>
                      </div>
                      <p className="text-sm text-gray-400">Your content has a professional tone with technical elements. Recommended for business audiences.</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {["professional", "technical", "formal", "precise", "authoritative"].map((tag) => (
                          <span key={tag} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-[#74d1ea]/20 text-[#74d1ea]">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="bg-zinc-800 p-4 rounded-lg">
                      <div className="flex items-center mb-3">
                        <div className="h-8 w-8 rounded-full bg-[#74d1ea]/20 flex items-center justify-center">
                          <Users className="h-4 w-4 text-[#74d1ea]" />
                        </div>
                        <h3 className="ml-3 font-semibold">AI Persona</h3>
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">Tech Executive</h4>
                          <p className="text-sm text-gray-400">IT Leadership, Strategy</p>
                        </div>
                        <div className="text-[#74d1ea]">Active</div>
                      </div>
                    </div>
                    
                    <div className="bg-zinc-800 p-4 rounded-lg">
                      <div className="flex items-center mb-3">
                        <div className="h-8 w-8 rounded-full bg-[#74d1ea]/20 flex items-center justify-center">
                          <MessageSquare className="h-4 w-4 text-[#74d1ea]" />
                        </div>
                        <h3 className="ml-3 font-semibold">Generated Content</h3>
                      </div>
                      <p className="text-sm text-gray-400">
                        Implementing robust cybersecurity measures is crucial for modern businesses. 
                        Our solution provides enterprise-grade protection while maintaining 
                        operational efficiency.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 h-20 w-20 bg-[#74d1ea]/10 rounded-full blur-xl"></div>
              <div className="absolute -bottom-8 -left-8 h-28 w-28 bg-[#74d1ea]/10 rounded-full blur-xl"></div>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Features section */}
      <div className="bg-zinc-900/50 py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-4">
                <span className="text-white">Transform Your </span>
                <span className="text-[#74d1ea]">Communication</span>
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Tovably combines AI technology with professional communication expertise to 
                help you create content that connects with your audience.
              </p>
            </motion.div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Users className="h-6 w-6 text-[#74d1ea]" />,
                title: "AI Personas",
                description: "Create and customize AI personas tailored to your target audience. Generate content that resonates with specific demographics and communication styles."
              },
              {
                icon: <BarChart4 className="h-6 w-6 text-[#74d1ea]" />,
                title: "Tone Analysis",
                description: "Analyze and optimize your content's tone for maximum impact. Identify key characteristics and patterns to ensure your message connects effectively."
              },
              {
                icon: <MessageSquare className="h-6 w-6 text-[#74d1ea]" />,
                title: "Content Generation",
                description: "Generate professional content instantly based on your tone analysis and personas. Create emails, posts, and more tailored to your brand voice."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-black border border-zinc-800 rounded-xl p-6 hover:border-[#74d1ea]/30 transition-colors"
              >
                <div className="h-12 w-12 rounded-full bg-[#74d1ea]/10 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      
      {/* CTA section */}
      <div className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[#74d1ea]/5 opacity-50"></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 md:p-12 text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center rounded-full border border-[#74d1ea]/30 bg-[#74d1ea]/10 px-3 py-1 text-sm text-[#74d1ea] mb-6">
              <Zap className="h-3.5 w-3.5 mr-1" /> Limited Time Offer
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Be the First to Experience Tovably</h2>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
              Join our early access list to be notified when we launch. Early subscribers will 
              receive exclusive benefits and discounted pricing.
            </p>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
                <div className="flex-grow">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            className="bg-zinc-800 border-zinc-700 focus:border-[#74d1ea] h-12"
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
                  className="bg-[#74d1ea] hover:bg-[#5db8d0] text-black font-medium h-12 px-6"
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
              </form>
            </Form>
          </motion.div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-black border-t border-zinc-800 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-[#74d1ea] to-[#5db8d0] rounded-full flex items-center justify-center">
                <span className="text-xl font-bold text-black">T</span>
              </div>
              <span className="text-xl font-bold tracking-tighter">Tovably</span>
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-sm text-gray-400">
                &copy; {new Date().getFullYear()} Tovably. All rights reserved.
              </p>
              <p className="text-xs text-gray-500 mt-1">
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