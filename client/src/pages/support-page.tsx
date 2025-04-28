import { useAuth } from "@/hooks/use-auth";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { HelpCircle, MessageSquare, FileText, BookOpen, Mail, Phone } from "lucide-react";

export default function SupportPage() {
  const { user } = useAuth();
  
  return (
    <Layout showSidebar={true}>
      <div className="flex-1 overflow-y-auto bg-black">
        <div className="p-6">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center text-sm text-gray-400">
              <span>Tovably</span>
              <span className="mx-2">›</span>
              <span>Support</span>
            </div>
            <h1 className="text-2xl font-semibold text-white mt-1">Help & Support</h1>
            <p className="text-gray-400 mt-1">Get help with your account, billing, and feature questions</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Contact Support */}
            <div className="lg:col-span-2">
              <Card className="bg-[#111] border-gray-800 rounded-lg overflow-hidden h-full">
                <CardHeader className="p-4 border-b border-gray-800">
                  <div className="flex items-center">
                    <MessageSquare className="h-5 w-5 text-[#74d1ea] mr-2" />
                    <CardTitle className="text-lg font-medium text-white">Contact Support</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <form className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium text-gray-300">
                          Name
                        </label>
                        <Input
                          id="name"
                          className="bg-black border-gray-700 text-white"
                          defaultValue={user?.username}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium text-gray-300">
                          Email
                        </label>
                        <Input
                          id="email"
                          type="email"
                          className="bg-black border-gray-700 text-white"
                          defaultValue={user?.email}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="subject" className="text-sm font-medium text-gray-300">
                        Subject
                      </label>
                      <Select>
                        <SelectTrigger className="bg-black border-gray-700 text-white">
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
                      <label htmlFor="message" className="text-sm font-medium text-gray-300">
                        Message
                      </label>
                      <Textarea
                        id="message"
                        rows={6}
                        className="bg-black border-gray-700 text-white"
                        placeholder="Describe your issue or question in detail..."
                      />
                    </div>
                    
                    <div className="flex justify-end pt-5">
                      <Button className="bg-[#74d1ea] hover:bg-[#5db8d0] text-black">
                        Submit Request
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
            
            {/* Quick Help */}
            <div className="lg:col-span-1">
              <Card className="bg-[#111] border-gray-800 rounded-lg overflow-hidden mb-6">
                <CardHeader className="p-4 border-b border-gray-800">
                  <div className="flex items-center">
                    <HelpCircle className="h-5 w-5 text-[#74d1ea] mr-2" />
                    <CardTitle className="text-lg font-medium text-white">Quick Help</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    <a href="#" className="flex items-center p-3 rounded-md hover:bg-gray-900 transition-colors">
                      <div className="w-10 h-10 rounded-full bg-[#74d1ea]/10 flex items-center justify-center">
                        <FileText className="h-5 w-5 text-[#74d1ea]" />
                      </div>
                      <div className="ml-3">
                        <p className="text-white font-medium">Documentation</p>
                        <p className="text-gray-400 text-sm">Read our detailed guides</p>
                      </div>
                    </a>
                    
                    <a href="#" className="flex items-center p-3 rounded-md hover:bg-gray-900 transition-colors">
                      <div className="w-10 h-10 rounded-full bg-[#74d1ea]/10 flex items-center justify-center">
                        <BookOpen className="h-5 w-5 text-[#74d1ea]" />
                      </div>
                      <div className="ml-3">
                        <p className="text-white font-medium">Tutorials</p>
                        <p className="text-gray-400 text-sm">Learn with step-by-step guides</p>
                      </div>
                    </a>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-[#111] border-gray-800 rounded-lg overflow-hidden">
                <CardHeader className="p-4 border-b border-gray-800">
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-[#74d1ea] mr-2" />
                    <CardTitle className="text-lg font-medium text-white">Contact Info</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <Mail className="h-5 w-5 text-gray-400 mr-3" />
                      <p className="text-gray-300">support@tovably.com</p>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-5 w-5 text-gray-400 mr-3" />
                      <p className="text-gray-300">+1 (800) 123-4567</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-4 border-t border-gray-800 bg-black/30">
                  <p className="text-sm text-gray-400">
                    Our support team is available Monday-Friday, 9am-5pm EST
                  </p>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}