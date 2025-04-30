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
import { 
  CheckCircle2, 
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
    <div className="flex flex-col min-h-screen bg-background">
      {/* Hero section */}
      <div className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_50%_at_50%_50%,rgba(25,232,181,0.15),transparent)]" />
        <div className="absolute inset-y-0 right-1/2 -z-10 mr-16 w-[200%] origin-bottom-left -rotate-[30deg] bg-background skew-x-12" />
        
        <div className="mx-auto max-w-7xl px-6 py-16 sm:py-24 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0 lg:grid lg:max-w-none lg:grid-cols-2 lg:gap-x-16 lg:gap-y-6 xl:grid-cols-1 xl:grid-rows-1 xl:gap-x-8">
            <div className="mt-6 max-w-xl lg:mt-0 xl:col-end-1 xl:row-start-1">
              <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:col-span-2 xl:col-auto">
                Transform Your Professional Communication
              </h1>
              <div className="mt-6 max-w-xl">
                <p className="text-lg leading-8 text-muted-foreground">
                  Tovably is an AI-powered platform for intelligent content generation and tone analysis. Create engaging, on-brand content that resonates with your audience.
                </p>
                <div className="mt-8 flex flex-wrap gap-x-6 gap-y-4">
                  <Link href="/auth">
                    <Button className="text-white bg-primary hover:bg-primary/90 px-6">
                      Get started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/pricing">
                    <Button variant="outline">
                      View pricing
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            <div className="mt-10 border border-border p-8 rounded-xl bg-card shadow-lg lg:mt-0 xl:col-start-2 xl:row-span-2">
              {submitted ? (
                <div className="flex flex-col items-center justify-center h-full py-12">
                  <div className="rounded-full bg-primary/10 p-4 mb-6">
                    <CheckCheck className="h-16 w-16 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold mb-4 text-center">Message Received!</h2>
                  <p className="text-muted-foreground text-center mb-8">
                    Thank you for reaching out. Our team will be in touch with you shortly.
                  </p>
                  <Button onClick={() => setSubmitted(false)} variant="outline">
                    Send another message
                  </Button>
                </div>
              ) : (
                <>
                  <div className="mb-8">
                    <h2 className="text-2xl font-semibold mb-2">Contact Us</h2>
                    <p className="text-muted-foreground">
                      Interested in learning more? Fill out the form below and we'll be in touch.
                    </p>
                  </div>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Your name" {...field} />
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
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="your.email@example.com" {...field} />
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
                            <FormLabel>Company (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="Your company" {...field} />
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
                            <FormLabel>Message</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="How can we help you?"
                                className="min-h-32"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button 
                        type="submit" 
                        className="w-full"
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

      {/* Features section */}
      <div className="mx-auto max-w-7xl px-6 mt-8 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Powerful Features
          </h2>
          <p className="mt-4 text-lg leading-8 text-muted-foreground">
            Discover how Tovably can transform your professional communication.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 border-t border-border pt-10 sm:mt-16 sm:pt-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {/* Feature 1 */}
          <div className="flex flex-col items-start">
            <div className="rounded-md bg-primary/10 p-3 mb-4">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold">Advanced Tone Analysis</h3>
            <p className="mt-2 leading-7 text-muted-foreground">
              Get detailed insights into your communication style. Analyze tone, sentiment, and engagement potential of your content.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="flex flex-col items-start">
            <div className="rounded-md bg-primary/10 p-3 mb-4">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold">AI Content Generation</h3>
            <p className="mt-2 leading-7 text-muted-foreground">
              Create professional content that matches your brand voice. Generate LinkedIn posts, emails, and more with our AI-powered tools.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="flex flex-col items-start">
            <div className="rounded-md bg-primary/10 p-3 mb-4">
              <User className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold">Persona Management</h3>
            <p className="mt-2 leading-7 text-muted-foreground">
              Create and save multiple personas to tailor your communication for different audiences and purposes.
            </p>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="relative isolate mt-16 sm:mt-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:max-w-4xl">
            <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
              What Our Users Say
            </h2>
            <div className="mt-16 space-y-10">
              <div className="flex flex-col items-center">
                <div className="rounded-xl bg-card p-8 text-center shadow-sm ring-1 ring-border">
                  <p className="text-lg font-semibold text-foreground">
                    "Tovably has transformed the way our marketing team communicates. The tone analysis helps us maintain brand consistency, and the content generation saves us hours of work."
                  </p>
                  <div className="mt-6">
                    <p className="font-semibold text-foreground">Sarah Johnson</p>
                    <p className="text-sm text-muted-foreground">Marketing Director, TechCorp</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA section */}
      <div className="mt-16 sm:mt-24 mb-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Ready to transform your communication?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
              Join thousands of professionals who are elevating their communication with Tovably.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link href="/auth">
                <Button className="text-white px-6">
                  Get started for free
                </Button>
              </Link>
              <Link href="/guides">
                <Button variant="outline">
                  Learn more
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}