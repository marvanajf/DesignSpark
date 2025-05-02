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
  Megaphone
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
    { href: "/tone-analysis", icon: <BarChart2 className="h-5 w-5" />, label: "Tone Analysis" },
    { href: "/personas", icon: <Users className="h-5 w-5" />, label: "Personas" },
    { href: "/content-generator", icon: <Edit3 className="h-5 w-5" />, label: "Content Generator" },
    { href: "/saved-content", icon: <Archive className="h-5 w-5" />, label: "Saved Content" },
    { href: "/campaigns", icon: <Megaphone className="h-5 w-5" />, label: "Campaigns" },
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
    ...(isAdmin ? [{ href: "/admin", icon: <ShieldAlert className="h-5 w-5" />, label: "Admin" }] : []),
    // Add logout as a menu item for better visibility
    { 
      href: "#", 
      icon: <LogOut className="h-5 w-5" />, 
      label: "Logout",
      onClick: () => logoutMutation.mutate()
    }
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
      {/* Mobile toggle button - fixed to the side of the screen */}
      {isMobile && (
        <button 
          onClick={toggleSidebar}
          className={`md:hidden fixed z-50 p-2 bg-black border border-gray-700/60 rounded-r-md transition-all duration-300 ${
            isCollapsed ? 'left-0 top-4' : 'left-64 top-4'
          }`}
        >
          {isCollapsed ? (
            <Menu className="h-5 w-5 text-[#74d1ea]" />
          ) : (
            <X className="h-5 w-5 text-[#74d1ea]" />
          )}
        </button>
      )}

      {/* Main sidebar container */}
      <div 
        className={`flex flex-col border-r border-gray-700/60 bg-black transition-all duration-300 ${
          isCollapsed ? 'w-0 -translate-x-full md:w-auto md:translate-x-0 md:w-16' : 'w-64'
        } fixed md:relative z-40 h-full`}
      >
        {/* Logo section */}
        <div className="h-16 flex items-center px-4 border-b border-gray-700/60">
          <Link href="/dashboard" className="flex items-center">
            {!isCollapsed && <img src={tovablyLogo} alt="Tovably Logo" className="h-7 w-auto" />}
            {isCollapsed && <div className="text-white font-bold text-lg">T</div>}
          </Link>
        </div>
        
        {/* Navigation section */}
        <div className="flex-grow overflow-y-auto py-4">
          <nav className="px-2 space-y-1">
            {menuItems.map((item) => {
              const isActive = location === item.href;
              return (
                <Link 
                  key={item.href} 
                  href={item.href}
                  onClick={() => handleNavigation(item.href)}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive 
                      ? "bg-[#74d1ea]/10 text-[#74d1ea]" 
                      : "text-gray-300 hover:bg-gray-900 hover:text-white"
                  }`}
                >
                  <span className={`${isActive ? "text-[#74d1ea]" : "text-gray-400 group-hover:text-white"} ${!isCollapsed && 'mr-3'}`}>
                    {item.icon}
                  </span>
                  {!isCollapsed && item.label}
                </Link>
              );
            })}
          </nav>
          
          {/* Bottom navigation items */}
          <div className={`mt-8 pt-6 border-t border-gray-700/60 ${isCollapsed ? 'px-2' : ''}`}>
            {!isCollapsed && (
              <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Settings</h3>
            )}
            <nav className="px-2 space-y-1">
              {bottomMenuItems.map((item) => {
                const isActive = location === item.href;
                // For items with onClick handlers like logout
                if (item.onClick) {
                  return (
                    <button
                      key={item.href}
                      onClick={item.onClick}
                      className={`w-full group flex items-center justify-between px-2 py-2 text-sm font-medium rounded-md
                        text-gray-300 hover:bg-gray-900 hover:text-white`}
                    >
                      <div className="flex items-center">
                        <span className="text-gray-400 group-hover:text-white">
                          {item.icon}
                        </span>
                        {!isCollapsed && <span className="ml-3">{item.label}</span>}
                      </div>
                      {!isCollapsed && item.badge && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#74d1ea] text-black">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                }
                
                // Regular navigation links
                return (
                  <Link 
                    key={item.href} 
                    href={item.href}
                    onClick={() => handleNavigation(item.href)}
                    className={`group flex items-center justify-between px-2 py-2 text-sm font-medium rounded-md ${
                      isActive 
                        ? "bg-[#74d1ea]/10 text-[#74d1ea]" 
                        : "text-gray-300 hover:bg-gray-900 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center">
                      <span className={`${isActive ? "text-[#74d1ea]" : "text-gray-400 group-hover:text-white"}`}>
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
        
        {/* User profile section */}
        {!isCollapsed && (
          <div className="flex-shrink-0 flex border-t border-gray-700/60 p-4">
            <div className="flex-shrink-0 w-full group block">
              <div className="flex items-center">
                <div>
                  <Avatar className="border border-gray-700/60">
                    <AvatarFallback className={`${avatarColor} text-white`}>{initials}</AvatarFallback>
                  </Avatar>
                </div>
                <div className="ml-3 flex flex-col">
                  <p className="text-sm font-medium text-white">
                    {user?.username || "User"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
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