import { useState } from "react";
import { X, LifeBuoy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export function SupportRequestModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields to submit a support request.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await apiRequest("POST", "/api/support-request", formData);
      
      if (response.ok) {
        toast({
          title: "Support request sent",
          description: "We've received your request and will get back to you shortly.",
        });
        setFormData({ name: "", email: "", message: "" });
        setIsOpen(false);
      } else {
        const error = await response.json();
        throw new Error(error.message || "Something went wrong");
      }
    } catch (error) {
      toast({
        title: "Failed to send request",
        description: error.message || "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Floating support button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-[#74d1ea] hover:bg-[#5db8d0] text-black rounded-full p-3 shadow-lg transition-all hover:scale-105"
      >
        <LifeBuoy size={24} />
      </button>

      {/* Support modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-[#0e131f] border border-gray-800 rounded-lg w-full max-w-md p-6 shadow-xl relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>
            
            <div className="flex items-center mb-6">
              <LifeBuoy className="h-6 w-6 text-[#74d1ea] mr-3" />
              <h2 className="text-xl font-bold text-white">Request Support</h2>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                    Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="bg-[#090e17] border-gray-800 focus:border-[#74d1ea] text-white"
                    placeholder="Your name"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                    Email
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="bg-[#090e17] border-gray-800 focus:border-[#74d1ea] text-white"
                    placeholder="your.email@example.com"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">
                    How can we help?
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className="bg-[#090e17] border-gray-800 focus:border-[#74d1ea] text-white h-32"
                    placeholder="Describe your issue or question..."
                  />
                </div>
                
                <Button
                  type="submit"
                  className="w-full bg-[#74d1ea] hover:bg-[#5db8d0] text-black font-medium"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Submit Request"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}