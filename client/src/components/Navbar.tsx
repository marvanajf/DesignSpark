import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Menu, X } from "lucide-react";

interface NavbarProps {
  showDashboardLinks?: boolean;
}

export default function Navbar({ showDashboardLinks = false }: NavbarProps) {
  const [location] = useLocation();
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-black border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <svg className="w-8 h-8 text-green-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path>
              </svg>
              <Link href="/" className="ml-2 text-xl font-bold text-white">ContentPersona</Link>
            </div>
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              {!showDashboardLinks && (
                <>
                  <a href="#features" className={`inline-flex items-center px-1 pt-1 border-b-2 ${location === "/" ? "border-green-500 text-green-500" : "border-transparent text-gray-300 hover:text-white"} text-sm font-medium`}>
                    Platform
                  </a>
                  <a href="#testimonials" className="border-transparent text-gray-300 hover:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                    Resources
                  </a>
                  <a href="#" className="border-transparent text-gray-300 hover:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                    Enterprise
                  </a>
                  <a href="#" className="border-transparent text-gray-300 hover:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                    Pricing
                  </a>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center">
            {user ? (
              <div className="hidden md:flex items-center">
                <Link href="/dashboard">
                  <Button variant="ghost" className="text-white hover:text-gray-300">Dashboard</Button>
                </Link>
              </div>
            ) : (
              <div className="hidden md:flex items-center">
                <Link href="/auth">
                  <Button variant="ghost" className="text-white hover:text-gray-300">Log In</Button>
                </Link>
                <Link href="/auth">
                  <Button className="ml-3 bg-green-600 hover:bg-green-700 text-white">Get Started</Button>
                </Link>
              </div>
            )}
            
            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-md text-gray-400 hover:text-white focus:outline-none"
              >
                <span className="sr-only">Open main menu</span>
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-black border-b border-gray-800">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {!showDashboardLinks && (
              <>
                <a
                  href="#features"
                  className="text-white hover:bg-green-600 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                >
                  Platform
                </a>
                <a
                  href="#testimonials"
                  className="text-gray-300 hover:bg-green-600 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                >
                  Resources
                </a>
                <a
                  href="#"
                  className="text-gray-300 hover:bg-green-600 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                >
                  Enterprise
                </a>
                <a
                  href="#"
                  className="text-gray-300 hover:bg-green-600 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                >
                  Pricing
                </a>
              </>
            )}
            
            {user ? (
              <Link
                href="/dashboard"
                className="text-white hover:bg-green-600 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/auth"
                  className="text-white hover:bg-green-600 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                >
                  Log In
                </Link>
                <Link
                  href="/auth"
                  className="bg-green-600 text-white block px-3 py-2 rounded-md text-base font-medium mt-2"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
