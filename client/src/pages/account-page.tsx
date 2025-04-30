import { useAuth } from "@/hooks/use-auth";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  User, 
  Mail, 
  Building, 
  Calendar, 
  ChevronDown, 
  Filter, 
  UserCog, 
  ShieldCheck,
  Bell,
  Key,
  CreditCard,
  Camera,
  X,
  ImageIcon
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useUserAvatar } from "@/contexts/user-avatar-context";

export default function AccountPage() {
  const { user } = useAuth();
  const [avatarDialogOpen, setAvatarDialogOpen] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const { avatarColor, setAvatarColor } = useUserAvatar();
  const [currentAvatar, setCurrentAvatar] = useState<string>(avatarColor);
  const { toast } = useToast();
  
  // Helper function to format the plan name (same as in sidebar)
  const formatPlanName = (plan: string) => {
    return plan.charAt(0).toUpperCase() + plan.slice(1);
  };
  
  // Avatar colors
  const avatarColors = [
    'bg-[#74d1ea]', // Mint Blue (Brand)
    'bg-purple-500',
    'bg-pink-500',
    'bg-amber-500',
    'bg-emerald-500',
    'bg-rose-500',
    'bg-indigo-500',
    'bg-cyan-500',
    'bg-orange-500'
  ];
  
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
                  <span>Account Settings</span>
                </div>
                <h1 className="text-2xl font-semibold text-white mt-1">Account Settings</h1>
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

          {/* Account Settings Section Title - Exactly like dashboard */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white">Account Settings</h2>
            <p className="text-sm text-gray-400 mt-1">Manage your profile, security, and preferences</p>
          </div>
          
          {/* Account Settings Tabs */}
          <Tabs defaultValue="profile" className="mb-10">
            <TabsList className="bg-black/50 border border-gray-800/60 rounded-lg p-1 mb-6">
              <TabsTrigger 
                value="profile" 
                className="rounded-md data-[state=active]:bg-[#182030] data-[state=active]:text-[#74d1ea] data-[state=active]:shadow-[0_0_10px_rgba(116,209,234,0.15)]"
              >
                <UserCog className="mr-2 h-4 w-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger 
                value="security" 
                className="rounded-md data-[state=active]:bg-[#182030] data-[state=active]:text-[#74d1ea] data-[state=active]:shadow-[0_0_10px_rgba(116,209,234,0.15)]"
              >
                <ShieldCheck className="mr-2 h-4 w-4" />
                Security
              </TabsTrigger>
              <TabsTrigger 
                value="notifications" 
                className="rounded-md data-[state=active]:bg-[#182030] data-[state=active]:text-[#74d1ea] data-[state=active]:shadow-[0_0_10px_rgba(116,209,234,0.15)]"
              >
                <Bell className="mr-2 h-4 w-4" />
                Notifications
              </TabsTrigger>
              <TabsTrigger 
                value="billing" 
                className="rounded-md data-[state=active]:bg-[#182030] data-[state=active]:text-[#74d1ea] data-[state=active]:shadow-[0_0_10px_rgba(116,209,234,0.15)]"
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Billing
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile">
              <div className="group relative bg-[#0a0c10] border border-gray-800/60 rounded-xl overflow-hidden transition-all duration-300 shadow-[0_0_25px_rgba(116,209,234,0.05)]">
                <div className="absolute inset-0 bg-gradient-to-t from-[#74d1ea]/5 via-transparent to-transparent pointer-events-none opacity-50"></div>
                <div className="p-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="bg-[#0e131f] border border-[#74d1ea]/20 rounded-lg p-2.5 shadow-[0_0_15px_rgba(116,209,234,0.15)]">
                      <UserCog className="h-5 w-5 text-[#74d1ea]" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">Profile Information</h3>
                  </div>
                  
                  <div className="space-y-8">
                    <div className="flex items-center space-x-4">
                      <div className={`h-24 w-24 rounded-xl ${currentAvatar} border border-[#74d1ea]/20 shadow-[0_0_15px_rgba(116,209,234,0.1)] flex items-center justify-center text-white text-xl font-medium transition-all duration-300`}>
                        {user?.username?.slice(0, 2).toUpperCase() || "U"}
                      </div>
                      <div>
                        <p className="text-white font-medium">{user?.username}</p>
                        <p className="text-gray-400 text-sm">{user?.email}</p>
                        <Badge className="bg-[#74d1ea]/10 text-[#74d1ea] border border-[#74d1ea]/30 mt-2 hover:bg-[#74d1ea]/20">
                          {formatPlanName(user?.subscription_plan || 'free')}
                        </Badge>
                        <div className="mt-3">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-8 border-gray-700/60 text-gray-300 text-xs hover:text-white hover:bg-[#0e131f]"
                            onClick={() => setAvatarDialogOpen(true)}
                          >
                            Change Colour
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <Separator className="bg-gray-800/60" />
                    
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <div className="space-y-2">
                        <label htmlFor="username" className="text-sm font-medium text-white">
                          Username
                        </label>
                        <div className="flex">
                          <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-800/60 bg-[#0e131f] text-gray-400 text-sm">
                            <User className="h-4 w-4" />
                          </span>
                          <Input
                            id="username"
                            className="rounded-l-none bg-black/30 border-gray-800/60 focus:border-[#74d1ea]/50 focus:ring-[#74d1ea]/20 text-white"
                            defaultValue={user?.username}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium text-white">
                          Email
                        </label>
                        <div className="flex">
                          <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-800/60 bg-[#0e131f] text-gray-400 text-sm">
                            <Mail className="h-4 w-4" />
                          </span>
                          <Input
                            id="email"
                            type="email"
                            className="rounded-l-none bg-black/30 border-gray-800/60 focus:border-[#74d1ea]/50 focus:ring-[#74d1ea]/20 text-white"
                            defaultValue={user?.email}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="company" className="text-sm font-medium text-white">
                        Company
                      </label>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-800/60 bg-[#0e131f] text-gray-400 text-sm">
                          <Building className="h-4 w-4" />
                        </span>
                        <Input
                          id="company"
                          className="rounded-l-none bg-black/30 border-gray-800/60 focus:border-[#74d1ea]/50 focus:ring-[#74d1ea]/20 text-white"
                          placeholder="Your company name"
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-end pt-4">
                      <Button 
                        variant="outline"
                        className="border-gray-800/60 text-gray-300 hover:text-white hover:bg-[#0e131f] mr-3"
                      >
                        Cancel
                      </Button>
                      <Button className="bg-[#74d1ea] hover:bg-[#5db8d0] text-black font-medium shadow-[0_0_25px_rgba(116,209,234,0.25)]">
                        Save Changes
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="security">
              <div className="group relative bg-[#0a0c10] border border-gray-800/60 rounded-xl overflow-hidden transition-all duration-300 shadow-[0_0_25px_rgba(116,209,234,0.05)]">
                <div className="absolute inset-0 bg-gradient-to-t from-[#74d1ea]/5 via-transparent to-transparent pointer-events-none opacity-50"></div>
                <div className="p-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="bg-[#0e131f] border border-[#74d1ea]/20 rounded-lg p-2.5 shadow-[0_0_15px_rgba(116,209,234,0.15)]">
                      <ShieldCheck className="h-5 w-5 text-[#74d1ea]" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">Security Settings</h3>
                  </div>
                  
                  <div className="space-y-8">
                    <div className="space-y-2">
                      <label htmlFor="current-password" className="text-sm font-medium text-white">
                        Current Password
                      </label>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-800/60 bg-[#0e131f] text-gray-400 text-sm">
                          <Key className="h-4 w-4" />
                        </span>
                        <Input
                          id="current-password"
                          type="password"
                          className="rounded-l-none bg-black/30 border-gray-800/60 focus:border-[#74d1ea]/50 focus:ring-[#74d1ea]/20 text-white"
                          placeholder="Enter your current password"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <div className="space-y-2">
                        <label htmlFor="new-password" className="text-sm font-medium text-white">
                          New Password
                        </label>
                        <Input
                          id="new-password"
                          type="password"
                          className="bg-black/30 border-gray-800/60 focus:border-[#74d1ea]/50 focus:ring-[#74d1ea]/20 text-white"
                          placeholder="Enter new password"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="confirm-password" className="text-sm font-medium text-white">
                          Confirm New Password
                        </label>
                        <Input
                          id="confirm-password"
                          type="password"
                          className="bg-black/30 border-gray-800/60 focus:border-[#74d1ea]/50 focus:ring-[#74d1ea]/20 text-white"
                          placeholder="Confirm new password"
                        />
                      </div>
                    </div>
                    
                    <div className="bg-[#0e131f]/50 border border-[#74d1ea]/10 rounded-xl p-4 shadow-[0_0_15px_rgba(116,209,234,0.05)]">
                      <h4 className="text-white font-medium mb-2">Password Requirements</h4>
                      <ul className="text-sm text-gray-300 space-y-1">
                        <li>• Minimum 8 characters</li>
                        <li>• At least one uppercase letter</li>
                        <li>• At least one number</li>
                        <li>• At least one special character</li>
                      </ul>
                    </div>
                    
                    <div className="flex justify-end pt-4">
                      <Button className="bg-[#74d1ea] hover:bg-[#5db8d0] text-black font-medium shadow-[0_0_25px_rgba(116,209,234,0.25)]">
                        Update Password
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="notifications">
              <div className="group relative bg-[#0a0c10] border border-gray-800/60 rounded-xl overflow-hidden transition-all duration-300 shadow-[0_0_25px_rgba(116,209,234,0.05)]">
                <div className="absolute inset-0 bg-gradient-to-t from-[#74d1ea]/5 via-transparent to-transparent pointer-events-none opacity-50"></div>
                <div className="p-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="bg-[#0e131f] border border-[#74d1ea]/20 rounded-lg p-2.5 shadow-[0_0_15px_rgba(116,209,234,0.15)]">
                      <Bell className="h-5 w-5 text-[#74d1ea]" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">Notification Preferences</h3>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="flex items-center justify-between py-3 border-b border-gray-800/60">
                      <div>
                        <p className="text-white font-medium">Email Notifications</p>
                        <p className="text-gray-400 text-sm">Receive activity updates via email</p>
                      </div>
                      <Switch />
                    </div>
                    
                    <div className="flex items-center justify-between py-3 border-b border-gray-800/60">
                      <div>
                        <p className="text-white font-medium">Product Updates</p>
                        <p className="text-gray-400 text-sm">Be notified about new features and improvements</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between py-3 border-b border-gray-800/60">
                      <div>
                        <p className="text-white font-medium">Usage Reports</p>
                        <p className="text-gray-400 text-sm">Weekly summary of your account activity</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between py-3">
                      <div>
                        <p className="text-white font-medium">Marketing Communications</p>
                        <p className="text-gray-400 text-sm">Receive offers, promotions, and newsletter</p>
                      </div>
                      <Switch />
                    </div>
                    
                    <div className="flex justify-end pt-4">
                      <Button className="bg-[#74d1ea] hover:bg-[#5db8d0] text-black font-medium shadow-[0_0_25px_rgba(116,209,234,0.25)]">
                        Save Preferences
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="billing">
              <div className="group relative bg-[#0a0c10] border border-gray-800/60 rounded-xl overflow-hidden transition-all duration-300 shadow-[0_0_25px_rgba(116,209,234,0.05)]">
                <div className="absolute inset-0 bg-gradient-to-t from-[#74d1ea]/5 via-transparent to-transparent pointer-events-none opacity-50"></div>
                <div className="p-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="bg-[#0e131f] border border-[#74d1ea]/20 rounded-lg p-2.5 shadow-[0_0_15px_rgba(116,209,234,0.15)]">
                      <CreditCard className="h-5 w-5 text-[#74d1ea]" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">Billing Information</h3>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="bg-[#0e131f]/50 border border-[#74d1ea]/10 rounded-xl p-5 shadow-[0_0_15px_rgba(116,209,234,0.05)]">
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <h4 className="text-white font-medium">Current Plan</h4>
                          <p className="text-gray-400 text-sm">Your subscription details</p>
                        </div>
                        <Badge className="bg-[#74d1ea] text-black">{formatPlanName(user?.subscription_plan || 'free')}</Badge>
                      </div>
                      
                      <div className="mt-4 space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Plan Price</span>
                          <span className="text-white font-medium">{user?.subscription_plan === 'free' ? 'Free' : '£24.99/month'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Billing Cycle</span>
                          <span className="text-white font-medium">Monthly</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Next Billing Date</span>
                          <span className="text-white font-medium">May 29, 2025</span>
                        </div>
                      </div>
                      
                      <div className="mt-6 flex">
                        <Button className="bg-[#74d1ea] hover:bg-[#5db8d0] text-black font-medium shadow-[0_0_25px_rgba(116,209,234,0.25)] w-full">
                          {user?.subscription_plan === 'free' ? 'Upgrade Plan' : 'Manage Subscription'}
                        </Button>
                      </div>
                    </div>
                    
                    <div className="bg-[#0e131f]/50 border border-[#74d1ea]/10 rounded-xl p-5 shadow-[0_0_15px_rgba(116,209,234,0.05)]">
                      <h4 className="text-white font-medium mb-4">Payment Method</h4>
                      
                      {user?.subscription_plan !== 'free' ? (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-10 h-6 bg-white rounded flex items-center justify-center mr-3">
                              <svg className="h-4" viewBox="0 0 32 21" xmlns="http://www.w3.org/2000/svg">
                                <g fill="none" fillRule="evenodd">
                                  <g fillRule="nonzero">
                                    <rect fill="#252525" width="32" height="21" rx="2"/>
                                    <path d="M21.5 13.4h-11l-.1-5.8h11.2l-.1 5.8z" fill="#fff"/>
                                  </g>
                                </g>
                              </svg>
                            </div>
                            <div>
                              <p className="text-white text-sm">Visa ending in 4242</p>
                              <p className="text-gray-400 text-xs">Expires 12/2025</p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm" className="h-8 border-gray-700/60 text-gray-300 text-xs hover:text-white hover:bg-[#0e131f]">
                            Change
                          </Button>
                        </div>
                      ) : (
                        <div className="text-center py-4">
                          <p className="text-gray-400 text-sm">No payment method on file</p>
                          <Button variant="outline" size="sm" className="mt-3 border-gray-700/60 text-gray-300 text-xs hover:text-white hover:bg-[#0e131f]">
                            Add Payment Method
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Avatar Selection Dialog */}
      <Dialog open={avatarDialogOpen} onOpenChange={setAvatarDialogOpen}>
        <DialogContent className="bg-[#0a0c10] border border-gray-800/60 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center">
              <Camera className="h-5 w-5 text-[#74d1ea] mr-2" />
              Change Colour
            </DialogTitle>
            <DialogClose className="absolute right-4 top-4 text-gray-400 hover:text-white">
              <X className="h-4 w-4" />
            </DialogClose>
          </DialogHeader>
          
          <div className="py-4 space-y-6">
            <div className="grid grid-cols-3 gap-4">
              {avatarColors.map((color, index) => (
                <div 
                  key={index}
                  className={`h-16 w-16 rounded-xl ${color} border border-gray-800/30 flex items-center justify-center text-white text-lg font-medium cursor-pointer transition-all duration-200 hover:scale-105 ${selectedAvatar === color ? 'ring-2 ring-[#74d1ea] ring-offset-2 ring-offset-[#0a0c10]' : ''}`}
                  onClick={() => setSelectedAvatar(color)}
                >
                  {user?.username?.slice(0, 2).toUpperCase() || "U"}
                </div>
              ))}
              
              <div 
                className="h-16 w-16 rounded-xl bg-[#182030] border border-gray-800/60 flex items-center justify-center text-gray-400 cursor-pointer hover:text-white hover:border-gray-600 transition-all duration-200"
                onClick={() => setSelectedAvatar('custom')}
              >
                <ImageIcon className="h-6 w-6" />
              </div>
            </div>
            
            <div className="pt-2 flex justify-end space-x-3">
              <Button 
                variant="outline" 
                size="sm" 
                className="border-gray-700/60 text-gray-300 hover:text-white hover:bg-[#0e131f]"
                onClick={() => {
                  setSelectedAvatar(null);
                  setAvatarDialogOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button 
                className="bg-[#74d1ea] hover:bg-[#5db8d0] text-black font-medium shadow-[0_0_15px_rgba(116,209,234,0.25)]"
                size="sm"
                onClick={() => {
                  if (selectedAvatar) {
                    setCurrentAvatar(selectedAvatar);
                    // Update the context for global state
                    setAvatarColor(selectedAvatar);
                    toast({
                      title: "Colour Updated",
                      description: "Your profile colour has been updated successfully.",
                    });
                    setAvatarDialogOpen(false);
                    // Reset the selection for next time
                    setSelectedAvatar(null);
                  } else {
                    toast({
                      title: "Please Select a Colour",
                      description: "Choose a colour to continue.",
                      variant: "destructive",
                    });
                  }
                }}
              >
                Save Colour
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}