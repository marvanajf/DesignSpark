import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Layout from "@/components/Layout";
import { CheckCheck, MessageSquare } from "lucide-react";

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

export default function ContactPage() {
  const { toast } = useToast();
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
        form.reset();
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
      <div className="container mx-auto py-12 px-4 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left column - Contact info */}
          <div>
            <h1 className="text-4xl font-bold text-white mb-6">Get In Touch</h1>
            <p className="text-gray-400 text-lg mb-8">
              Have questions about Tovably? Want to learn more about how our platform can help your business?
              We'd love to hear from you.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-[#0e131f] border border-[#74d1ea]/20 rounded-lg p-2.5 shadow-[0_0_15px_rgba(116,209,234,0.15)]">
                  <MessageSquare className="h-5 w-5 text-[#74d1ea]" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white">Email Us</h3>
                  <p className="text-gray-400 mt-1">
                    <a href="mailto:sales@tovably.com" className="text-[#74d1ea] hover:underline">
                      sales@tovably.com
                    </a>
                  </p>
                </div>
              </div>
              
              <div className="border-t border-gray-800 pt-6">
                <h3 className="text-lg font-medium text-white mb-4">What happens next?</h3>
                <ol className="space-y-4">
                  <li className="flex items-start">
                    <span className="flex-shrink-0 font-bold text-[#74d1ea] mr-2">1.</span>
                    <p className="text-gray-400">We'll respond to your inquiry within 24 hours</p>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 font-bold text-[#74d1ea] mr-2">2.</span>
                    <p className="text-gray-400">We'll schedule a call to understand your needs better</p>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 font-bold text-[#74d1ea] mr-2">3.</span>
                    <p className="text-gray-400">We'll provide you with a custom solution proposal</p>
                  </li>
                </ol>
              </div>
            </div>
          </div>
          
          {/* Right column - Contact form */}
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
                    Fill out the form below and we'll be in touch soon.
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
                              className="resize-none h-32 bg-gray-900 border-gray-700 text-white"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="submit" 
                      className="w-full bg-[#74d1ea] hover:bg-[#5db8d0] text-black font-medium shadow-[0_0_25px_rgba(116,209,234,0.25)]"
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
    </Layout>
  );
}