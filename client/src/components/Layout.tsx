import { ReactNode } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useLocation } from "wouter";

interface LayoutProps {
  children: ReactNode;
  showSidebar?: boolean;
}

export default function Layout({ children, showSidebar = false }: LayoutProps) {
  const [location] = useLocation();
  const isHomePage = location === "/";
  
  // If on the homepage, render a simpler layout with just the navbar
  if (isHomePage) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <footer className="bg-black border-t border-gray-700/60">
          <div className="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
            <nav className="-mx-5 -my-2 flex flex-wrap justify-center" aria-label="Footer">
              <div className="px-5 py-2">
                <a href="#" className="text-base text-gray-400 hover:text-[#74d1ea]">
                  About
                </a>
              </div>
              <div className="px-5 py-2">
                <a href="#" className="text-base text-gray-400 hover:text-[#74d1ea]">
                  Features
                </a>
              </div>
              <div className="px-5 py-2">
                <a href="#" className="text-base text-gray-400 hover:text-[#74d1ea]">
                  Pricing
                </a>
              </div>
              <div className="px-5 py-2">
                <a href="#" className="text-base text-gray-400 hover:text-[#74d1ea]">
                  Blog
                </a>
              </div>
              <div className="px-5 py-2">
                <a href="#" className="text-base text-gray-400 hover:text-[#74d1ea]">
                  Contact
                </a>
              </div>
            </nav>
            <div className="mt-8 flex justify-center space-x-6">
              <a href="#" className="text-gray-400 hover:text-[#74d1ea]">
                <span className="sr-only">Twitter</span>
                <i className="fab fa-twitter fa-lg"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-[#74d1ea]">
                <span className="sr-only">LinkedIn</span>
                <i className="fab fa-linkedin fa-lg"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-[#74d1ea]">
                <span className="sr-only">GitHub</span>
                <i className="fab fa-github fa-lg"></i>
              </a>
            </div>
            <p className="mt-8 text-center text-base text-gray-400">
              &copy; {new Date().getFullYear()} Tovably. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    );
  }

  // Determine if we're in the app (dashboard, analysis, etc.) or on a marketing page
  const isAppPage = location.startsWith('/dashboard') || 
                    location.startsWith('/tone-analysis') || 
                    location.startsWith('/personas') || 
                    location.startsWith('/content-generator') || 
                    location.startsWith('/saved-content') || 
                    location.startsWith('/account') || 
                    location.startsWith('/support');
  
  // For app pages, only show sidebar; for other non-homepage pages, show both navbar and sidebar
  return (
    <div className="min-h-screen flex flex-col">
      {!isAppPage && <Navbar showDashboardLinks={isAppPage} />}
      <div className="flex flex-1 overflow-hidden">
        {(showSidebar || isAppPage) && <Sidebar />}
        <main className={`flex-1 overflow-y-auto bg-background ${(showSidebar || isAppPage) ? '' : 'container mx-auto py-6'}`}>
          {children}
        </main>
      </div>
    </div>
  );
}