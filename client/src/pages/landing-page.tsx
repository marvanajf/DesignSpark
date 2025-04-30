import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "wouter";
import Layout from "@/components/Layout";
import { 
  CheckCircle, 
  Sparkles, 
  BarChart3, 
  User, 
  MessageSquare,
  ArrowRight,
  CheckCheck
} from "lucide-react";

// Form validation schema
const formSchema = z.object({
  name: z.string().min(1, {
    message: "Name is required",
  }),
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
  company: z.string().optional(),
  message: z.string().min(1, {
    message: "Message is required",
  }),
});

// TypeScript type for form values
type FormValues = z.infer<typeof formSchema>;

export default function LandingPage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      message: "",
    },
  });

  // Handle form submission
  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      const response = await apiRequest("POST", "/api/lead-contact", data);
      const result = await response.json();
      
      if (result.success) {
        setSubmitted(true);
        toast({
          title: "Message sent",
          description: "Thank you for your message. We will be in touch soon.",
        });
      } else {
        throw new Error(result.error || "Failed to send message");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <div className="py-6 bg-black relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="border border-gray-700/60 rounded-lg py-8 px-6 shadow-[0_0_25px_rgba(116,209,234,0.15)]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="max-w-xl">
                <h1 className="text-4xl tracking-tight font-semibold sm:text-5xl md:text-6xl">
                  <span className="block text-white">Transform Your</span>
                  <span className="block text-[#74d1ea]">Professional Communication</span>
                </h1>
                <p className="mt-6 text-base text-gray-400 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                  Tovably is an AI-powered platform for intelligent content generation and tone analysis. Create engaging, on-brand content that resonates with your audience.
                </p>
                <div className="mt-8 flex flex-wrap gap-x-6 gap-y-4">
                  <Link href="/auth">
                    <Button className="px-8 py-3 md:py-4 md:text-lg md:px-10 bg-[#74d1ea] hover:bg-[#5db8d0] text-black shadow-[0_0_10px_rgba(116,209,234,0.4)]">
                      Get started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/pricing">
                    <Button variant="outline" className="border-gray-700 hover:bg-gray-900 text-gray-300 hover:text-white">
                      View pricing
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="border border-gray-700/60 rounded-lg p-6 shadow-[0_0_25px_rgba(116,209,234,0.15)] bg-black">
                {submitted ? (
                  <div className="flex flex-col items-center justify-center h-full py-12">
                    <div className="rounded-full bg-[#74d1ea]/20 p-4 mb-6 border border-[#74d1ea]/30">
                      <CheckCheck className="h-16 w-16 text-[#74d1ea]" />
                    </div>
                    <h2 className="text-2xl font-bold mb-4 text-center text-white">Message Received!</h2>
                    <p className="text-gray-400 text-center mb-8">
                      Thank you for reaching out. Our team will be in touch with you shortly.
                    </p>
                    <Button 
                      onClick={() => setSubmitted(false)} 
                      variant="outline" 
                      className="border-gray-700 hover:bg-gray-900 text-gray-300 hover:text-white"
                    >
                      Send another message
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="mb-6">
                      <h2 className="text-2xl font-semibold mb-2 text-white">Contact Us</h2>
                      <p className="text-gray-400">
                        Interested in learning more? Fill out the form below and we'll be in touch.
                      </p>
                    </div>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-300">Name</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Your name" 
                                  {...field} 
                                  className="bg-gray-900 border-gray-700 text-white"
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
                              <FormLabel className="text-gray-300">Email</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="your.email@example.com" 
                                  {...field} 
                                  className="bg-gray-900 border-gray-700 text-white"
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
                              <FormLabel className="text-gray-300">Company (Optional)</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Your company" 
                                  {...field} 
                                  className="bg-gray-900 border-gray-700 text-white"
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
                              <FormLabel className="text-gray-300">Message</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="How can we help you?"
                                  className="min-h-32 bg-gray-900 border-gray-700 text-white"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button 
                          type="submit" 
                          className="w-full bg-[#74d1ea] hover:bg-[#5db8d0] text-black shadow-[0_0_10px_rgba(116,209,234,0.4)]"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? "Sending..." : "Send Message"}
                        </Button>
                      </form>
                    </Form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Platform Features Sections */}
      <div className="py-6 bg-black relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="mb-8">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Powerful Features
            </h2>
            <p className="mt-4 text-lg leading-8 text-gray-400">
              Discover how Tovably can transform your professional communication.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3 mt-10">
            {/* Feature 1 */}
            <div className="flex flex-col items-start">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-md bg-[#74d1ea]/20 mb-5 border border-[#74d1ea]/30">
                <BarChart3 className="h-6 w-6 text-[#74d1ea]" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Advanced Tone Analysis</h3>
              <p className="text-gray-400">
                Get detailed insights into your communication style. Analyze tone, sentiment, and engagement potential of your content.
              </p>
              <ul className="space-y-3 mt-4">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-[#74d1ea] mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">Quantitative tone metrics across 5 key dimensions</span>
                </li>
              </ul>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col items-start">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-md bg-[#74d1ea]/20 mb-5 border border-[#74d1ea]/30">
                <Sparkles className="h-6 w-6 text-[#74d1ea]" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">AI Content Generation</h3>
              <p className="text-gray-400">
                Create professional content that matches your brand voice. Generate LinkedIn posts, emails, and more with our AI-powered tools.
              </p>
              <ul className="space-y-3 mt-4">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-[#74d1ea] mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">Generate content based on your unique brand voice</span>
                </li>
              </ul>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col items-start">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-md bg-[#74d1ea]/20 mb-5 border border-[#74d1ea]/30">
                <User className="h-6 w-6 text-[#74d1ea]" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Persona Management</h3>
              <p className="text-gray-400">
                Create and save multiple personas to tailor your communication for different audiences and purposes.
              </p>
              <ul className="space-y-3 mt-4">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-[#74d1ea] mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">Target specific audiences with customized messaging</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="py-6 bg-black relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="mb-8 border border-gray-700/60 rounded-lg overflow-hidden shadow-[0_0_25px_rgba(116,209,234,0.15)]">
            <div className="px-8 py-10">
              <h2 className="text-center text-3xl font-bold tracking-tight text-white sm:text-4xl mb-8">
                What Our Users Say
              </h2>
              <div className="max-w-3xl mx-auto">
                <div className="text-center">
                  <p className="text-lg text-white">
                    "Tovably has transformed the way our marketing team communicates. The tone analysis helps us maintain brand consistency, and the content generation saves us hours of work."
                  </p>
                  <div className="mt-6">
                    <p className="font-semibold text-white">Sarah Johnson</p>
                    <p className="text-sm text-gray-400">Marketing Director, TechCorp</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA section */}
      <div className="py-6 bg-black relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="border border-gray-700/60 rounded-lg py-10 px-6 shadow-[0_0_25px_rgba(116,209,234,0.15)] text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Ready to transform your communication?
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-8">
              Join thousands of professionals who are elevating their communication with Tovably.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/auth">
                <Button className="px-8 py-3 md:py-4 md:text-lg md:px-10 bg-[#74d1ea] hover:bg-[#5db8d0] text-black shadow-[0_0_10px_rgba(116,209,234,0.4)]">
                  Get started for free
                </Button>
              </Link>
              <Link href="/guides-info">
                <Button variant="outline" className="px-8 py-3 md:py-4 md:text-lg md:px-10 border-gray-700 hover:bg-gray-900 text-gray-300 hover:text-white">
                  Learn more
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}