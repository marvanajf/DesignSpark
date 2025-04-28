import { useAuth } from "@/hooks/use-auth";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Mail, Building } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function AccountPage() {
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
              <span>Account Settings</span>
            </div>
            <h1 className="text-2xl font-semibold text-white mt-1">Account Settings</h1>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <Card className="bg-[#111] border-gray-800 rounded-lg overflow-hidden">
              <CardHeader className="p-4 border-b border-gray-800">
                <CardTitle className="text-lg font-medium text-white">Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="h-24 w-24 rounded-md bg-[#74d1ea]/20 flex items-center justify-center text-[#74d1ea] text-xl font-medium">
                      {user?.username?.slice(0, 2).toUpperCase() || "U"}
                    </div>
                    <div>
                      <p className="text-white font-medium">{user?.username}</p>
                      <p className="text-gray-400 text-sm">{user?.email}</p>
                      <Button variant="outline" size="sm" className="mt-2 h-8 border-gray-700 text-gray-300 text-xs hover:text-white hover:bg-gray-900">
                        Change Avatar
                      </Button>
                    </div>
                  </div>
                  
                  <Separator className="bg-gray-800" />
                  
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label htmlFor="username" className="text-sm font-medium text-gray-300">
                        Username
                      </label>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-700 bg-black text-gray-500 text-sm">
                          <User className="h-4 w-4" />
                        </span>
                        <Input
                          id="username"
                          className="rounded-l-none bg-black border-gray-700 text-white"
                          defaultValue={user?.username}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium text-gray-300">
                        Email
                      </label>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-700 bg-black text-gray-500 text-sm">
                          <Mail className="h-4 w-4" />
                        </span>
                        <Input
                          id="email"
                          type="email"
                          className="rounded-l-none bg-black border-gray-700 text-white"
                          defaultValue={user?.email}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="company" className="text-sm font-medium text-gray-300">
                      Company
                    </label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-700 bg-black text-gray-500 text-sm">
                        <Building className="h-4 w-4" />
                      </span>
                      <Input
                        id="company"
                        className="rounded-l-none bg-black border-gray-700 text-white"
                        placeholder="Your company name"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end pt-5">
                    <Button 
                      variant="outline"
                      className="border-gray-700 text-gray-300 hover:text-white hover:bg-gray-900"
                    >
                      Cancel
                    </Button>
                    <Button className="ml-3 bg-[#74d1ea] hover:bg-[#5db8d0] text-black">
                      Save Changes
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}