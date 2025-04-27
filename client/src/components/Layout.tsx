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
        <footer className="bg-card">
          <div className="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
            <nav className="-mx-5 -my-2 flex flex-wrap justify-center" aria-label="Footer">
              <div className="px-5 py-2">
                <a href="#" className="text-base text-muted-foreground hover:text-foreground">
                  About
                </a>
              </div>
              <div className="px-5 py-2">
                <a href="#" className="text-base text-muted-foreground hover:text-foreground">
                  Features
                </a>
              </div>
              <div className="px-5 py-2">
                <a href="#" className="text-base text-muted-foreground hover:text-foreground">
                  Pricing
                </a>
              </div>
              <div className="px-5 py-2">
                <a href="#" className="text-base text-muted-foreground hover:text-foreground">
                  Blog
                </a>
              </div>
              <div className="px-5 py-2">
                <a href="#" className="text-base text-muted-foreground hover:text-foreground">
                  Contact
                </a>
              </div>
            </nav>
            <div className="mt-8 flex justify-center space-x-6">
              <a href="#" className="text-muted-foreground hover:text-foreground">
                <span className="sr-only">Twitter</span>
                <i className="fab fa-twitter fa-lg"></i>
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                <span className="sr-only">LinkedIn</span>
                <i className="fab fa-linkedin fa-lg"></i>
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                <span className="sr-only">GitHub</span>
                <i className="fab fa-github fa-lg"></i>
              </a>
            </div>
            <p className="mt-8 text-center text-base text-muted-foreground">
              &copy; {new Date().getFullYear()} ContentPersona. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    );
  }

  // For other pages, render dashboard layout with sidebar if needed
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar showDashboardLinks={true} />
      <div className="flex flex-1 overflow-hidden">
        {showSidebar && <Sidebar />}
        <main className={`flex-1 overflow-y-auto bg-background ${showSidebar ? '' : 'container mx-auto py-6'}`}>
          {children}
        </main>
      </div>
    </div>
  );
}
