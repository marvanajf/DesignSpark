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
  UserCog,
  ShieldAlert
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Sidebar() {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();

  const initials = user ? user.username.slice(0, 2).toUpperCase() : "?";

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const menuItems = [
    { href: "/dashboard", icon: <Home className="h-5 w-5" />, label: "Dashboard" },
    { href: "/tone-analysis", icon: <BarChart2 className="h-5 w-5" />, label: "Tone Analysis" },
    { href: "/personas", icon: <Users className="h-5 w-5" />, label: "Personas" },
    { href: "/content-generator", icon: <Edit3 className="h-5 w-5" />, label: "Content Generator" },
    { href: "/saved-content", icon: <Archive className="h-5 w-5" />, label: "Saved Content" }
  ];
  
  // Determine if the current user is an admin
  const isAdmin = user?.role === "admin";
  
  const bottomMenuItems = [
    { href: "/account", icon: <UserCog className="h-5 w-5" />, label: "Account" },
    { href: "/support", icon: <HelpCircle className="h-5 w-5" />, label: "Support" },
    ...(isAdmin ? [{ href: "/admin", icon: <ShieldAlert className="h-5 w-5" />, label: "Admin" }] : [])
  ];

  return (
    <div className="flex flex-col w-64 border-r border-gray-700/60 bg-black">
      {/* Logo section */}
      <div className="h-16 flex items-center px-4 border-b border-gray-700/60">
        <span className="text-lg font-semibold text-white" style={{ fontFamily: "'Open Sans', sans-serif" }}>Tovably</span>
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
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  isActive 
                    ? "bg-[#74d1ea]/10 text-[#74d1ea]" 
                    : "text-gray-300 hover:bg-gray-900 hover:text-white"
                }`}
              >
                <span className={`mr-3 ${isActive ? "text-[#74d1ea]" : "text-gray-400 group-hover:text-white"}`}>
                  {item.icon}
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>
        
        {/* Bottom navigation items */}
        <div className="mt-8 pt-6 border-t border-gray-700/60">
          <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Settings</h3>
          <nav className="px-2 space-y-1">
            {bottomMenuItems.map((item) => {
              const isActive = location === item.href;
              return (
                <Link 
                  key={item.href} 
                  href={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive 
                      ? "bg-[#74d1ea]/10 text-[#74d1ea]" 
                      : "text-gray-300 hover:bg-gray-900 hover:text-white"
                  }`}
                >
                  <span className={`mr-3 ${isActive ? "text-[#74d1ea]" : "text-gray-400 group-hover:text-white"}`}>
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
      
      {/* User profile section */}
      <div className="flex-shrink-0 flex border-t border-gray-700/60 p-4">
        <div className="flex-shrink-0 w-full group block">
          <div className="flex items-center">
            <div>
              <Avatar className="border border-gray-700/60">
                <AvatarFallback className="bg-[#74d1ea]/20 text-[#74d1ea]">{initials}</AvatarFallback>
              </Avatar>
            </div>
            <div className="ml-3 flex flex-col">
              <p className="text-sm font-medium text-white">
                {user?.username || "User"}
              </p>
              <button 
                onClick={handleLogout}
                className="text-xs font-medium text-gray-400 hover:text-[#74d1ea] flex items-center"
              >
                <LogOut className="h-3 w-3 mr-1" /> 
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}