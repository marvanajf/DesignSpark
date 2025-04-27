import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import {
  Home,
  BarChart2,
  Users,
  Edit3,
  Archive,
  Settings,
  LogOut
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

  return (
    <div className="flex flex-col w-64 border-r border-border bg-sidebar">
      <div className="h-16 flex items-center px-4 border-b border-border">
        <svg className="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path>
        </svg>
        <span className="ml-2 text-lg font-bold">ContentPersona</span>
      </div>
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
                    ? "bg-primary/10 text-primary" 
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
                }`}
              >
                <span className={`mr-3 ${isActive ? "text-primary" : "text-muted-foreground group-hover:text-sidebar-foreground"}`}>
                  {item.icon}
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="flex-shrink-0 flex border-t border-border p-4">
        <div className="flex-shrink-0 w-full group block">
          <div className="flex items-center">
            <div>
              <Avatar>
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
            </div>
            <div className="ml-3 flex flex-col">
              <p className="text-sm font-medium text-sidebar-foreground">
                {user?.username || "User"}
              </p>
              <button 
                onClick={handleLogout}
                className="text-xs font-medium text-muted-foreground hover:text-sidebar-foreground flex items-center"
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
