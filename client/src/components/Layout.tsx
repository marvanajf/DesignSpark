import { ReactNode } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useLocation } from "wouter";

interface LayoutProps {
  children: ReactNode;
  showSidebar?: boolean;
}

export function Layout({ children, showSidebar = false }: LayoutProps) {
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
                <a href="/about" className="text-base text-gray-400 hover:text-[#74d1ea]">
                  About
                </a>
              </div>
              <div className="px-5 py-2">
                <a href="/features" className="text-base text-gray-400 hover:text-[#74d1ea]">
                  Features
                </a>
              </div>
              <div className="px-5 py-2">
                <a href="/pricing" className="text-base text-gray-400 hover:text-[#74d1ea]">
                  Pricing
                </a>
              </div>
              <div className="px-5 py-2">
                <a href="/blog" className="text-base text-gray-400 hover:text-[#74d1ea]">
                  Blog
                </a>
              </div>
              <div className="px-5 py-2">
                <a href="/contact" className="text-base text-gray-400 hover:text-[#74d1ea]">
                  Contact
                </a>
              </div>
              <div className="px-5 py-2">
                <a href="/privacy-policy" className="text-base text-gray-400 hover:text-[#74d1ea]">
                  Privacy Policy
                </a>
              </div>
            </nav>

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
                    (location.startsWith('/tone-analysis') && !location.startsWith('/tone-analysis-info')) || 
                    (location.startsWith('/personas') && !location.startsWith('/personas-info')) || 
                    (location.startsWith('/content-generator') && !location.startsWith('/content-generation-info')) || 
                    location.startsWith('/saved-content') || 
                    location.startsWith('/account') || 
                    location.startsWith('/support') ||
                    (location.startsWith('/guides') && !location.startsWith('/guides-info')) ||
                    location.startsWith('/usage') ||
                    (location.startsWith('/campaigns') && !location.startsWith('/campaigns-info')) ||
                    location.startsWith('/campaign/') ||
                    location.startsWith('/campaign-factory');
  
  // For app pages, only show sidebar; for other non-homepage pages, show navbar
  return (
    <div className="min-h-screen flex flex-col">
      {!isAppPage && <Navbar />}
      <div className="flex flex-1 overflow-hidden bg-black">
        {(showSidebar || isAppPage) && <Sidebar />}
        <div className="flex flex-col flex-1 overflow-y-auto">
          <main className={`flex-1 bg-background ${(showSidebar || isAppPage) ? '' : 'container mx-auto py-6'}`}>
            {children}
          </main>
          
          {!isAppPage && (
            <footer className="bg-black border-t border-gray-700/60">
              <div className="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
                <nav className="-mx-5 -my-2 flex flex-wrap justify-center" aria-label="Footer">
                  <div className="px-5 py-2">
                    <a href="/about" className="text-base text-gray-400 hover:text-[#74d1ea]">
                      About
                    </a>
                  </div>
                  <div className="px-5 py-2">
                    <a href="/features" className="text-base text-gray-400 hover:text-[#74d1ea]">
                      Features
                    </a>
                  </div>
                  <div className="px-5 py-2">
                    <a href="/pricing" className="text-base text-gray-400 hover:text-[#74d1ea]">
                      Pricing
                    </a>
                  </div>
                  <div className="px-5 py-2">
                    <a href="/blog" className="text-base text-gray-400 hover:text-[#74d1ea]">
                      Blog
                    </a>
                  </div>
                  <div className="px-5 py-2">
                    <a href="/contact" className="text-base text-gray-400 hover:text-[#74d1ea]">
                      Contact
                    </a>
                  </div>
                  <div className="px-5 py-2">
                    <a href="/privacy-policy" className="text-base text-gray-400 hover:text-[#74d1ea]">
                      Privacy Policy
                    </a>
                  </div>
                </nav>
                <p className="mt-8 text-center text-base text-gray-400">
                  &copy; {new Date().getFullYear()} Tovably. All rights reserved.
                </p>
              </div>
            </footer>
          )}
        </div>
      </div>
    </div>
  );
}

// Also export as default for backward compatibility
export default Layout;