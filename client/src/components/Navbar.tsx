import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useAuthModal } from "@/hooks/use-auth-modal";
import { Button } from "@/components/ui/button";
import React, { useState, useRef } from "react";
import { 
  Menu, 
  X, 
  ChevronDown, 
  Users, 
  BookOpen, 
  HelpCircle, 
  CalendarClock, 
  Factory, 
  Sparkles, 
  FileEdit, 
  BarChart4, 
  MessageSquareText,
  FileText
} from "lucide-react";
import tovablyLogo from "@/assets/tovably-logo.png";

interface NavbarProps {
  showDashboardLinks?: boolean;
}

export default function Navbar({ showDashboardLinks = false }: NavbarProps) {
  const [location] = useLocation();
  const { user } = useAuth();
  const { openAuthModal } = useAuthModal();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showPlatformDropdown, setShowPlatformDropdown] = useState(false);
  const [showResourcesDropdown, setShowResourcesDropdown] = useState(false);
  
  // Add timeouts to prevent immediate closing when moving between elements
  const platformTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const resourcesTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const handlePlatformMouseEnter = () => {
    if (platformTimeoutRef.current) clearTimeout(platformTimeoutRef.current);
    setShowPlatformDropdown(true);
  };
  
  const handlePlatformMouseLeave = () => {
    platformTimeoutRef.current = setTimeout(() => {
      setShowPlatformDropdown(false);
    }, 300);
  };
  
  const handleResourcesMouseEnter = () => {
    if (resourcesTimeoutRef.current) clearTimeout(resourcesTimeoutRef.current);
    setShowResourcesDropdown(true);
  };
  
  const handleResourcesMouseLeave = () => {
    resourcesTimeoutRef.current = setTimeout(() => {
      setShowResourcesDropdown(false);
    }, 300);
  };

  return (
    <nav className="bg-black border-b border-gray-700/60 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center">
                <img src={tovablyLogo} alt="Tovably Logo" className="h-8 w-auto" />
              </Link>
            </div>
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              {!showDashboardLinks && (
                <>
                  {/* Platform dropdown */}
                  <div className="relative">
                    <button 
                      onMouseEnter={handlePlatformMouseEnter}
                      onMouseLeave={handlePlatformMouseLeave}
                      className={`inline-flex items-center px-1 pt-1 border-b-2 ${location === "/" ? "border-white text-white" : "border-transparent text-gray-300 hover:text-white"} text-sm font-medium`}
                    >
                      Platform <ChevronDown className="ml-1 h-4 w-4" />
                    </button>
                    {showPlatformDropdown && (
                      <div 
                        onMouseEnter={handlePlatformMouseEnter} 
                        onMouseLeave={handlePlatformMouseLeave}
                        className="absolute left-0 mt-2 w-72 rounded-md shadow-[0_0_15px_rgba(116,209,234,0.2)] bg-[#0a0d14] border border-gray-700/60 py-4 z-50"
                      >
                        <div className="space-y-2">
                          <Link href="/tone-analysis-info" className="group flex items-center px-5 py-2 text-sm text-gray-300 hover:bg-[#090c13]">
                            <div className="flex-shrink-0 w-10 h-10 rounded bg-[#5db8d0]/20 flex items-center justify-center mr-4">
                              <BarChart4 className="h-5 w-5 text-[#5db8d0]" />
                            </div>
                            <div>
                              <p className="font-medium text-white">Tone Analysis</p>
                              <p className="text-xs text-gray-400">Analyze content tone and style</p>
                            </div>
                          </Link>
                          <Link href="/personas-info" className="group flex items-center px-5 py-2 text-sm text-gray-300 hover:bg-[#090c13]">
                            <div className="flex-shrink-0 w-10 h-10 rounded bg-[#74d1ea]/20 flex items-center justify-center mr-4">
                              <Users className="h-5 w-5 text-[#74d1ea]" />
                            </div>
                            <div>
                              <p className="font-medium text-white">Persona Factory</p>
                              <p className="text-xs text-gray-400">Create targeted personas</p>
                            </div>
                          </Link>
                          <Link href="/content-generation-info" className="group flex items-center px-5 py-2 text-sm text-gray-300 hover:bg-[#090c13]">
                            <div className="flex-shrink-0 w-10 h-10 rounded bg-[#4fa3bb]/20 flex items-center justify-center mr-4">
                              <MessageSquareText className="h-5 w-5 text-[#4fa3bb]" />
                            </div>
                            <div>
                              <p className="font-medium text-white">Content</p>
                              <p className="text-xs text-gray-400">Create tailored content</p>
                            </div>
                          </Link>
                          <Link href="/campaign-factory-info" className="group flex items-center px-5 py-2 text-sm text-gray-300 hover:bg-[#090c13]">
                            <div className="flex-shrink-0 w-10 h-10 rounded bg-[#74d1ea]/20 flex items-center justify-center mr-4">
                              <Sparkles className="h-5 w-5 text-[#74d1ea]" />
                            </div>
                            <div>
                              <p className="font-medium text-white">Campaign Factory</p>
                              <p className="text-xs text-gray-400">Automate marketing campaigns</p>
                            </div>
                          </Link>
                          <Link href="/campaigns-info" className="group flex items-center px-5 py-2 text-sm text-gray-300 hover:bg-[#090c13]">
                            <div className="flex-shrink-0 w-10 h-10 rounded bg-[#5db8d0]/20 flex items-center justify-center mr-4">
                              <CalendarClock className="h-5 w-5 text-[#5db8d0]" />
                            </div>
                            <div>
                              <p className="font-medium text-white">Campaigns</p>
                              <p className="text-xs text-gray-400">Organize marketing campaigns</p>
                            </div>
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Resources dropdown */}
                  <div className="relative">
                    <button 
                      onMouseEnter={handleResourcesMouseEnter}
                      onMouseLeave={handleResourcesMouseLeave}
                      className="border-transparent text-gray-300 hover:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                    >
                      Resources <ChevronDown className="ml-1 h-4 w-4" />
                    </button>
                    {showResourcesDropdown && (
                      <div 
                        onMouseEnter={handleResourcesMouseEnter} 
                        onMouseLeave={handleResourcesMouseLeave}
                        className="absolute left-0 mt-2 w-72 rounded-md shadow-[0_0_15px_rgba(116,209,234,0.2)] bg-[#0a0d14] border border-gray-700/60 py-4 z-50"
                      >
                        <div className="space-y-2">
                          <Link href="/blog" className="group flex items-center px-5 py-2 text-sm text-gray-300 hover:bg-[#090c13]">
                            <div className="flex-shrink-0 w-10 h-10 rounded bg-[#74d1ea]/20 flex items-center justify-center mr-4">
                              <FileText className="h-5 w-5 text-[#74d1ea]" />
                            </div>
                            <div>
                              <p className="font-medium text-white">Blog</p>
                              <p className="text-xs text-gray-400">News and updates</p>
                            </div>
                          </Link>
                          <Link href="/guides-info" className="group flex items-center px-5 py-2 text-sm text-gray-300 hover:bg-[#090c13]">
                            <div className="flex-shrink-0 w-10 h-10 rounded bg-[#5db8d0]/20 flex items-center justify-center mr-4">
                              <BookOpen className="h-5 w-5 text-[#5db8d0]" />
                            </div>
                            <div>
                              <p className="font-medium text-white">Knowledge Base</p>
                              <p className="text-xs text-gray-400">Best AI practices</p>
                            </div>
                          </Link>
                          <Link href="/contact" className="group flex items-center px-5 py-2 text-sm text-gray-300 hover:bg-[#090c13]">
                            <div className="flex-shrink-0 w-10 h-10 rounded bg-[#4fa3bb]/20 flex items-center justify-center mr-4">
                              <HelpCircle className="h-5 w-5 text-[#4fa3bb]" />
                            </div>
                            <div>
                              <p className="font-medium text-white">Contact Us</p>
                              <p className="text-xs text-gray-400">Get in touch with our team</p>
                            </div>
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>

                  <Link href="/pricing" className="border-transparent text-gray-300 hover:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                    Pricing
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center">
            {user ? (
              <div className="hidden md:flex items-center">
                {!showDashboardLinks && (
                  <Link href="/dashboard">
                    <Button variant="ghost" className="text-white hover:text-gray-300">Dashboard</Button>
                  </Link>
                )}
                <Link href="/account">
                  <Button variant="ghost" className="text-white hover:text-gray-300">Account</Button>
                </Link>
                <Link href="/support">
                  <Button 
                    className="ml-2 bg-[#74d1ea]/10 hover:bg-[#74d1ea]/20 text-[#74d1ea] border border-[#74d1ea]/30"
                  >
                    <HelpCircle className="h-4 w-4 mr-1" />
                    Support
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="hidden md:flex items-center">
                <Button 
                  variant="ghost" 
                  className="text-white hover:text-gray-300"
                  onClick={openAuthModal}
                >
                  Log in
                </Button>
                <Button 
                  className="ml-3 bg-[#74d1ea] hover:bg-[#5db8d0] text-black shadow-[0_0_10px_rgba(116,209,234,0.4)]"
                  onClick={openAuthModal}
                >
                  Get started
                </Button>
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
        <div className="md:hidden bg-black border-b border-gray-700/60">
          <div className="px-4 py-3 flex items-center justify-between border-b border-gray-700/40">
            <Link href="/">
              <img src={tovablyLogo} alt="Tovably" className="h-8" />
            </Link>
            <button
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-900"
              onClick={() => setMobileMenuOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="px-2 pt-2 pb-3 space-y-1">
            {!showDashboardLinks && (
              <>
                <div className="px-3 py-2">
                  <div className="font-medium text-white text-base mb-3">Platform</div>
                  <div className="space-y-2">
                    <Link href="/tone-analysis-info" className="flex items-center px-3 py-2 text-sm text-gray-300 hover:bg-[#090c13] rounded">
                      <div className="flex-shrink-0 w-8 h-8 rounded bg-[#5db8d0]/20 flex items-center justify-center mr-3">
                        <BarChart4 className="h-4 w-4 text-[#5db8d0]" />
                      </div>
                      <div>
                        <p className="font-medium text-white">Tone Analysis</p>
                        <p className="text-xs text-gray-400">Analyze content tone and style</p>
                      </div>
                    </Link>
                    <Link href="/personas-info" className="flex items-center px-3 py-2 text-sm text-gray-300 hover:bg-[#090c13] rounded">
                      <div className="flex-shrink-0 w-8 h-8 rounded bg-[#74d1ea]/20 flex items-center justify-center mr-3">
                        <Users className="h-4 w-4 text-[#74d1ea]" />
                      </div>
                      <div>
                        <p className="font-medium text-white">Persona Factory</p>
                        <p className="text-xs text-gray-400">Create targeted personas</p>
                      </div>
                    </Link>
                    <Link href="/content-generation-info" className="flex items-center px-3 py-2 text-sm text-gray-300 hover:bg-[#090c13] rounded">
                      <div className="flex-shrink-0 w-8 h-8 rounded bg-[#4fa3bb]/20 flex items-center justify-center mr-3">
                        <MessageSquareText className="h-4 w-4 text-[#4fa3bb]" />
                      </div>
                      <div>
                        <p className="font-medium text-white">Content</p>
                        <p className="text-xs text-gray-400">Create tailored content</p>
                      </div>
                    </Link>
                    <Link href="/campaign-factory-info" className="flex items-center px-3 py-2 text-sm text-gray-300 hover:bg-[#090c13] rounded">
                      <div className="flex-shrink-0 w-8 h-8 rounded bg-[#74d1ea]/20 flex items-center justify-center mr-3">
                        <Sparkles className="h-4 w-4 text-[#74d1ea]" />
                      </div>
                      <div>
                        <p className="font-medium text-white">Campaign Factory</p>
                        <p className="text-xs text-gray-400">Automate marketing campaigns</p>
                      </div>
                    </Link>
                    <Link href="/campaigns-info" className="flex items-center px-3 py-2 text-sm text-gray-300 hover:bg-[#090c13] rounded">
                      <div className="flex-shrink-0 w-8 h-8 rounded bg-[#5db8d0]/20 flex items-center justify-center mr-3">
                        <CalendarClock className="h-4 w-4 text-[#5db8d0]" />
                      </div>
                      <div>
                        <p className="font-medium text-white">Campaigns</p>
                        <p className="text-xs text-gray-400">Organize marketing campaigns</p>
                      </div>
                    </Link>
                  </div>
                </div>
                
                <div className="px-3 py-2 mt-4">
                  <div className="font-medium text-white text-base mb-3">Resources</div>
                  <div className="space-y-2">
                    <Link href="/blog" className="flex items-center px-3 py-2 text-sm text-gray-300 hover:bg-[#090c13] rounded">
                      <div className="flex-shrink-0 w-8 h-8 rounded bg-[#74d1ea]/20 flex items-center justify-center mr-3">
                        <FileText className="h-4 w-4 text-[#74d1ea]" />
                      </div>
                      <div>
                        <p className="font-medium text-white">Blog</p>
                        <p className="text-xs text-gray-400">News and updates</p>
                      </div>
                    </Link>
                    <Link href="/guides-info" className="flex items-center px-3 py-2 text-sm text-gray-300 hover:bg-[#090c13] rounded">
                      <div className="flex-shrink-0 w-8 h-8 rounded bg-[#5db8d0]/20 flex items-center justify-center mr-3">
                        <BookOpen className="h-4 w-4 text-[#5db8d0]" />
                      </div>
                      <div>
                        <p className="font-medium text-white">Knowledge Base</p>
                        <p className="text-xs text-gray-400">Best AI practices</p>
                      </div>
                    </Link>
                    <Link href="/contact" className="flex items-center px-3 py-2 text-sm text-gray-300 hover:bg-[#090c13] rounded">
                      <div className="flex-shrink-0 w-8 h-8 rounded bg-[#4fa3bb]/20 flex items-center justify-center mr-3">
                        <HelpCircle className="h-4 w-4 text-[#4fa3bb]" />
                      </div>
                      <div>
                        <p className="font-medium text-white">Contact Us</p>
                        <p className="text-xs text-gray-400">Get in touch with our team</p>
                      </div>
                    </Link>
                  </div>
                </div>
                
                <div className="px-3 py-2 mt-4">
                  <Link
                    href="/pricing"
                    className="flex items-center px-3 py-2 text-sm text-gray-300 hover:bg-[#090c13] rounded"
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded bg-[#5db8d0]/20 flex items-center justify-center mr-3">
                      <BarChart4 className="h-4 w-4 text-[#5db8d0]" />
                    </div>
                    <div>
                      <p className="font-medium text-white">Pricing</p>
                      <p className="text-xs text-gray-400">View subscription plans</p>
                    </div>
                  </Link>
                </div>
              </>
            )}
            
            {user ? (
              <>
                {!showDashboardLinks && (
                  <Link
                    href="/dashboard"
                    className="text-white hover:bg-gray-900 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                  >
                    Dashboard
                  </Link>
                )}
                <Link
                  href="/account"
                  className="text-white hover:bg-gray-900 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                >
                  Account
                </Link>
                <Link
                  href="/support"
                  className="text-[#74d1ea] bg-[#74d1ea]/10 hover:bg-[#74d1ea]/20 block px-3 py-2 rounded-md text-base font-medium flex items-center mt-2"
                >
                  <HelpCircle className="h-4 w-4 mr-2" />
                  Support
                </Link>
              </>
            ) : (
              <>
                <button
                  onClick={openAuthModal}
                  className="text-white hover:bg-gray-900 hover:text-white block w-full text-left px-3 py-2 rounded-md text-base font-medium"
                >
                  Log In
                </button>
                <button
                  onClick={openAuthModal}
                  className="bg-[#74d1ea] hover:bg-[#5db8d0] text-black block w-full text-left px-3 py-2 rounded-md text-base font-medium mt-2 shadow-[0_0_10px_rgba(116,209,234,0.4)]"
                >
                  Get Started
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
