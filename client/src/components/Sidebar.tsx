import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import {
  Home,
  BarChart2,
  Users,
  Edit3,
  Archive,
  Settings,
  LogOut,
  HelpCircle,
  Book,
  UserCog,
  ShieldAlert,
  CreditCard,
  Menu,
  X,
  PieChart,
  Megaphone,
  Sparkles
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import tovablyLogo from "@/assets/tovably-logo.png";
import { useUserAvatar } from "@/contexts/user-avatar-context";
import { useState, useEffect } from "react";

export default function Sidebar() {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const { avatarColor } = useUserAvatar();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if we're on mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
      // Auto-collapse on mobile
      if (window.innerWidth < 768) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
      }
    };

    // Initial check
    checkIfMobile();
    
    // Listen for window resize
    window.addEventListener("resize", checkIfMobile);
    
    // Cleanup
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const initials = user && user.username ? user.username.slice(0, 2).toUpperCase() : "?";

  // Define types for menu items
  type MenuItem = {
    href: string;
    icon: JSX.Element;
    label: string;
    badge?: string | null;
    onClick?: () => void;
  };

  const menuItems: MenuItem[] = [
    { href: "/dashboard", icon: <Home className="h-5 w-5" />, label: "Dashboard" },
    { href: "/campaigns", icon: <Megaphone className="h-5 w-5" />, label: "Campaigns" },
    { href: "/prospecting-factory", icon: <Sparkles className="h-5 w-5" />, label: "Campaign Factory" },
    { href: "/tone-analysis", icon: <BarChart2 className="h-5 w-5" />, label: "Tone Analysis" },
    { href: "/personas", icon: <Users className="h-5 w-5" />, label: "Personas" },
    { href: "/content-generator", icon: <Edit3 className="h-5 w-5" />, label: "Content Generator" },
    { href: "/saved-content", icon: <Archive className="h-5 w-5" />, label: "Saved Content" },
    { href: "/guides", icon: <Book className="h-5 w-5" />, label: "Guides" }
  ];
  
  // Determine if the current user is an admin
  const isAdmin = user?.role === "admin";
  
  // Get subscription plan details to display in the menu
  const subscriptionPlan = user?.subscription_plan || 'free';
  const formatPlanName = (plan: string) => {
    return plan.charAt(0).toUpperCase() + plan.slice(1);
  };
  
  const bottomMenuItems: MenuItem[] = [
    { href: "/account", icon: <UserCog className="h-5 w-5" />, label: "Account" },
    { href: "/usage", icon: <PieChart className="h-5 w-5" />, label: "Usage Monitor" },
    { 
      href: "/pricing", 
      icon: <CreditCard className="h-5 w-5" />, 
      label: `Plan: ${formatPlanName(subscriptionPlan)}`,
      badge: subscriptionPlan === 'free' ? 'Upgrade' : null
    },
    { href: "/support", icon: <HelpCircle className="h-5 w-5" />, label: "Support" },
    ...(isAdmin ? [{ href: "/admin", icon: <ShieldAlert className="h-5 w-5" />, label: "Admin" }] : [])
  ];

  // Navigate and collapse sidebar on mobile
  const handleNavigation = (href: string) => {
    if (isMobile) {
      setIsCollapsed(true);
    }
  };

  // Toggle sidebar
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      {/* Mobile toggle button - minimal design */}
      {isMobile && (
        <button 
          onClick={toggleSidebar}
          className={`md:hidden fixed z-50 p-2 bg-black transition-all duration-300 ${
            isCollapsed ? 'left-0 top-4' : 'left-64 top-4'
          }`}
        >
          {isCollapsed ? (
            <Menu className="h-5 w-5 text-zinc-400" />
          ) : (
            <X className="h-5 w-5 text-zinc-400" />
          )}
        </button>
      )}

      {/* Main sidebar container */}
      <div 
        className={`flex flex-col justify-between bg-black transition-all duration-300 ${
          isCollapsed ? 'w-0 -translate-x-full md:w-auto md:translate-x-0 md:w-16' : 'w-64'
        } relative z-40 h-full`}
      >
        {/* Logo section */}
        <div className="h-16 flex items-center px-4">
          <Link href="/dashboard" className="flex items-center">
            {!isCollapsed && <img src={tovablyLogo} alt="Tovably Logo" className="h-7 w-auto" />}
            {isCollapsed && <div className="text-white font-bold text-lg">T</div>}
          </Link>
        </div>
        
        {/* Top section with menu items */}
        <div className="flex-1 py-4 overflow-hidden">
          {/* Main navigation */}
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const isActive = location === item.href;
              return (
                <Link 
                  key={item.href} 
                  href={item.href}
                  onClick={() => handleNavigation(item.href)}
                  className={`group flex items-center px-4 py-2 text-sm ${
                    isActive 
                      ? "bg-zinc-800 text-white" 
                      : "text-zinc-400 hover:text-white"
                  } ${item.label === "Campaign Factory" ? "relative" : ""}`}
                >
                  {item.label === "Campaign Factory" && (
                    <div className="absolute inset-0 bg-[#74d1ea]/5 opacity-50 pointer-events-none shadow-[0_0_8px_#74d1ea40] rounded"></div>
                  )}
                  <span className={`${isActive ? "text-white" : "text-zinc-500 group-hover:text-white"} ${!isCollapsed && 'mr-3'} ${item.label === "Campaign Factory" ? "text-[#74d1ea] z-10" : ""}`}>
                    {item.icon}
                  </span>
                  {!isCollapsed && (
                    <span className={item.label === "Campaign Factory" ? "text-[#74d1ea] z-10" : ""}>
                      {item.label}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
          
          {/* Settings navigation items */}
          <div className="mt-8">
            {!isCollapsed && (
              <h3 className="px-4 text-xs text-zinc-500 font-medium mb-2">Settings</h3>
            )}
            <nav className="space-y-1">
              {bottomMenuItems.map((item) => {
                const isActive = location === item.href;
                
                return (
                  <Link 
                    key={item.href} 
                    href={item.href}
                    onClick={() => handleNavigation(item.href)}
                    className={`group flex items-center justify-between px-4 py-2 text-sm ${
                      isActive 
                        ? "bg-zinc-800 text-white" 
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center">
                      <span className={`${isActive ? "text-white" : "text-zinc-500 group-hover:text-white"}`}>
                        {item.icon}
                      </span>
                      {!isCollapsed && <span className="ml-3">{item.label}</span>}
                    </div>
                    {!isCollapsed && item.badge && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#74d1ea] text-black">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
        
        {/* Bottom section with logout and profile */}
        <div className="py-2">
          {/* Logout button */}
          <div className="border-t border-zinc-900 pt-4">
            <button
              onClick={() => logoutMutation.mutate()}
              className="w-full group flex items-center px-4 py-2 text-sm text-zinc-400 hover:text-white"
            >
              <span className="text-zinc-500 group-hover:text-white">
                <LogOut className="h-5 w-5" />
              </span>
              {!isCollapsed && <span className="ml-3">Logout</span>}
            </button>
          </div>
          
          {/* User profile section simplified to match design */}
          {!isCollapsed && (
            <div className="flex items-center px-4 py-3">
              <div>
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-black text-zinc-400 text-sm border border-zinc-800">{initials}</AvatarFallback>
                </Avatar>
              </div>
              <div className="ml-3">
                <p className="text-sm text-zinc-400">
                  {user?.username || "User"}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Overlay for mobile - closes sidebar when clicking outside */}
      {!isCollapsed && isMobile && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
}