import { useAuth } from "@/hooks/use-auth";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  HelpCircle, 
  MessageSquare, 
  FileText, 
  BookOpen, 
  Mail, 
  Phone, 
  Calendar, 
  ChevronDown, 
  Filter,
  Users,
  MoveRight,
  AlertCircle,
  Clock,
  YoutubeIcon,
  Headphones
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function SupportPage() {
  const { user } = useAuth();
  
  return (
    <Layout showSidebar={true}>
      <div className="flex-1 overflow-y-auto bg-black">
        <div className="p-6">
          {/* Header Section with Breadcrumbs - Exactly like dashboard */}
          <div className="mb-6">
            <div className="flex justify-between items-center">
              <div>
                <div className="flex items-center text-sm text-gray-400">
                  <span>Tovably</span>
                  <span className="mx-2">›</span>
                  <span>Support</span>
                </div>
                <h1 className="text-2xl font-semibold text-white mt-1">Help & Support</h1>
              </div>
              <div className="flex space-x-3">
                <div className="flex items-center space-x-2 bg-[#111] border border-gray-800 rounded-md px-3 py-1.5 text-sm text-gray-300">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span>Last 24 hours</span>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </div>
                <Button variant="outline" className="text-sm h-9 border-gray-800 bg-[#111] hover:bg-gray-900">
                  <Filter className="h-4 w-4 mr-2" />
                  <span>Filter</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Support Section Title - Exactly like dashboard */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white">Help & Support</h2>
            <p className="text-sm text-gray-400 mt-1">Get help with your account, billing, and feature questions</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Support - Using dashboard styling */}
            <div className="lg:col-span-2">
              <div className="group relative bg-[#0a0c10] border border-gray-800/60 rounded-xl overflow-hidden transition-all duration-300 shadow-[0_0_25px_rgba(116,209,234,0.05)] h-full">
                <div className="absolute inset-0 bg-gradient-to-t from-[#74d1ea]/5 via-transparent to-transparent pointer-events-none opacity-50"></div>
                <div className="p-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="bg-[#0e131f] border border-[#74d1ea]/20 rounded-lg p-2.5 shadow-[0_0_15px_rgba(116,209,234,0.15)]">
                      <MessageSquare className="h-5 w-5 text-[#74d1ea]" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">Contact Support</h3>
                  </div>
                  
                  <form className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium text-white">
                          Name
                        </label>
                        <Input
                          id="name"
                          className="bg-black/30 border-gray-800/60 focus:border-[#74d1ea]/50 focus:ring-[#74d1ea]/20 text-white"
                          defaultValue={user?.username}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium text-white">
                          Email
                        </label>
                        <Input
                          id="email"
                          type="email"
                          className="bg-black/30 border-gray-800/60 focus:border-[#74d1ea]/50 focus:ring-[#74d1ea]/20 text-white"
                          defaultValue={user?.email}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="subject" className="text-sm font-medium text-white">
                        Subject
                      </label>
                      <Select>
                        <SelectTrigger className="bg-black/30 border-gray-800/60 focus:border-[#74d1ea]/50 focus:ring-[#74d1ea]/20 text-white">
                          <SelectValue placeholder="Select a topic" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="account">Account Issues</SelectItem>
                          <SelectItem value="billing">Billing Questions</SelectItem>
                          <SelectItem value="feature">Feature Request</SelectItem>
                          <SelectItem value="bug">Bug Report</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="message" className="text-sm font-medium text-white">
                        Message
                      </label>
                      <Textarea
                        id="message"
                        rows={6}
                        className="bg-black/30 border-gray-800/60 focus:border-[#74d1ea]/50 focus:ring-[#74d1ea]/20 text-white"
                        placeholder="Describe your issue or question in detail..."
                      />
                    </div>
                    
                    <div className="bg-[#0e131f]/50 border border-[#74d1ea]/10 rounded-xl p-4 shadow-[0_0_15px_rgba(116,209,234,0.05)]">
                      <div className="flex items-start">
                        <div className="bg-[#182030] border border-[#74d1ea]/20 rounded-md p-1.5 mr-3">
                          <AlertCircle className="h-4 w-4 text-[#74d1ea]" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-white">What happens next?</h4>
                          <p className="text-xs text-gray-400 mt-1">
                            Our support team aims to respond to all inquiries within 24 hours. 
                            You'll receive a confirmation email when your request is submitted.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end pt-4">
                      <Button className="bg-[#74d1ea] hover:bg-[#5db8d0] text-black font-medium shadow-[0_0_25px_rgba(116,209,234,0.25)]">
                        Submit Request
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            
            {/* Right Support Column - Using dashboard styling */}
            <div className="lg:col-span-1 space-y-8">
              {/* Quick Help Card */}
              <div className="group relative bg-[#0a0c10] border border-gray-800/60 rounded-xl overflow-hidden transition-all duration-300 shadow-[0_0_25px_rgba(116,209,234,0.05)]">
                <div className="absolute inset-0 bg-gradient-to-t from-[#74d1ea]/5 via-transparent to-transparent pointer-events-none opacity-50"></div>
                <div className="p-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="bg-[#0e131f] border border-[#74d1ea]/20 rounded-lg p-2.5 shadow-[0_0_15px_rgba(116,209,234,0.15)]">
                      <HelpCircle className="h-5 w-5 text-[#74d1ea]" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">Quick Help</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <a href="#" className="flex items-center p-3 rounded-lg border border-gray-800/60 bg-black/30 hover:bg-[#0e131f]/80 transition-colors">
                      <div className="w-10 h-10 rounded-lg bg-[#182030] border border-[#74d1ea]/20 shadow-[0_0_10px_rgba(116,209,234,0.1)] flex items-center justify-center">
                        <FileText className="h-5 w-5 text-[#74d1ea]" />
                      </div>
                      <div className="ml-3 flex-1">
                        <p className="text-white font-medium">Documentation</p>
                        <p className="text-gray-400 text-sm">Read our detailed guides</p>
                      </div>
                      <MoveRight className="h-4 w-4 text-gray-500" />
                    </a>
                    
                    <a href="#" className="flex items-center p-3 rounded-lg border border-gray-800/60 bg-black/30 hover:bg-[#0e131f]/80 transition-colors">
                      <div className="w-10 h-10 rounded-lg bg-[#182030] border border-[#74d1ea]/20 shadow-[0_0_10px_rgba(116,209,234,0.1)] flex items-center justify-center">
                        <BookOpen className="h-5 w-5 text-[#74d1ea]" />
                      </div>
                      <div className="ml-3 flex-1">
                        <p className="text-white font-medium">Tutorials</p>
                        <p className="text-gray-400 text-sm">Step-by-step guides</p>
                      </div>
                      <MoveRight className="h-4 w-4 text-gray-500" />
                    </a>
                  </div>
                </div>
              </div>
              
              {/* Contact Info Card */}
              <div className="group relative bg-[#0a0c10] border border-gray-800/60 rounded-xl overflow-hidden transition-all duration-300 shadow-[0_0_25px_rgba(116,209,234,0.05)]">
                <div className="absolute inset-0 bg-gradient-to-t from-[#74d1ea]/5 via-transparent to-transparent pointer-events-none opacity-50"></div>
                <div className="p-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="bg-[#0e131f] border border-[#74d1ea]/20 rounded-lg p-2.5 shadow-[0_0_15px_rgba(116,209,234,0.15)]">
                      <Headphones className="h-5 w-5 text-[#74d1ea]" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">Contact Information</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="p-4 border border-gray-800/60 rounded-lg bg-black/30">
                      <div className="flex items-center">
                        <Mail className="h-5 w-5 text-[#74d1ea] mr-3" />
                        <p className="text-white">support@tovably.com</p>
                      </div>
                    </div>
                    
                    <div className="p-4 border border-gray-800/60 rounded-lg bg-black/30">
                      <div className="flex items-center">
                        <Clock className="h-5 w-5 text-[#74d1ea] mr-3" />
                        <div>
                          <p className="text-white">Support Hours</p>
                          <p className="text-gray-400 text-sm">Monday-Friday, 9am-5pm BST</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 bg-[#0e131f]/50 border border-[#74d1ea]/10 rounded-xl p-4 shadow-[0_0_15px_rgba(116,209,234,0.05)]">
                    <p className="text-sm text-gray-300">
                      For urgent matters outside of business hours, please use our emergency support form and our on-call team will respond.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}