import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useAuthModal } from "@/App";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Menu, X, ChevronDown, Users, BookOpen, FileText } from "lucide-react";

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

  return (
    <nav className="bg-black border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path>
              </svg>
              <Link href="/" className="ml-2 text-xl font-medium text-white">ContentPersona</Link>
            </div>
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              {!showDashboardLinks && (
                <>
                  {/* Platform dropdown */}
                  <div className="relative">
                    <button 
                      onMouseEnter={() => setShowPlatformDropdown(true)}
                      onMouseLeave={() => setShowPlatformDropdown(false)}
                      className={`inline-flex items-center px-1 pt-1 border-b-2 ${location === "/" ? "border-white text-white" : "border-transparent text-gray-300 hover:text-white"} text-sm font-medium`}
                    >
                      Platform <ChevronDown className="ml-1 h-4 w-4" />
                    </button>
                    {showPlatformDropdown && (
                      <div 
                        onMouseEnter={() => setShowPlatformDropdown(true)} 
                        onMouseLeave={() => setShowPlatformDropdown(false)}
                        className="absolute left-0 mt-2 w-64 rounded-md shadow-lg bg-black border border-gray-800 ring-1 ring-black ring-opacity-5 z-50"
                      >
                        <div className="py-1">
                          <Link href="/tone-analysis">
                            <a className="group flex items-center px-4 py-3 text-sm text-gray-300 hover:bg-gray-900 hover:text-white">
                              <FileText className="mr-3 h-5 w-5 text-gray-400 group-hover:text-white" />
                              <div>
                                <p className="font-medium">Tone Analysis</p>
                                <p className="text-xs text-gray-500">Analyze content tone and style</p>
                              </div>
                            </a>
                          </Link>
                          <Link href="/content-generation">
                            <a className="group flex items-center px-4 py-3 text-sm text-gray-300 hover:bg-gray-900 hover:text-white">
                              <FileText className="mr-3 h-5 w-5 text-gray-400 group-hover:text-white" />
                              <div>
                                <p className="font-medium">Content Generation</p>
                                <p className="text-xs text-gray-500">Create tailored content</p>
                              </div>
                            </a>
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Resources dropdown */}
                  <div className="relative">
                    <button 
                      onMouseEnter={() => setShowResourcesDropdown(true)}
                      onMouseLeave={() => setShowResourcesDropdown(false)}
                      className="border-transparent text-gray-300 hover:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                    >
                      Resources <ChevronDown className="ml-1 h-4 w-4" />
                    </button>
                    {showResourcesDropdown && (
                      <div 
                        onMouseEnter={() => setShowResourcesDropdown(true)} 
                        onMouseLeave={() => setShowResourcesDropdown(false)}
                        className="absolute left-0 mt-2 w-64 rounded-md shadow-lg bg-black border border-gray-800 ring-1 ring-black ring-opacity-5 z-50"
                      >
                        <div className="py-1">
                          <Link href="/customers">
                            <a className="group flex items-center px-4 py-3 text-sm text-gray-300 hover:bg-gray-900 hover:text-white">
                              <Users className="mr-3 h-5 w-5 text-gray-400 group-hover:text-white" />
                              <div>
                                <p className="font-medium">Customers</p>
                                <p className="text-xs text-gray-500">Teams using ContentPersona</p>
                              </div>
                            </a>
                          </Link>
                          <Link href="/blog">
                            <a className="group flex items-center px-4 py-3 text-sm text-gray-300 hover:bg-gray-900 hover:text-white">
                              <FileText className="mr-3 h-5 w-5 text-gray-400 group-hover:text-white" />
                              <div>
                                <p className="font-medium">Blog</p>
                                <p className="text-xs text-gray-500">News and updates</p>
                              </div>
                            </a>
                          </Link>
                          <Link href="/guides">
                            <a className="group flex items-center px-4 py-3 text-sm text-gray-300 hover:bg-gray-900 hover:text-white">
                              <BookOpen className="mr-3 h-5 w-5 text-gray-400 group-hover:text-white" />
                              <div>
                                <p className="font-medium">Guides</p>
                                <p className="text-xs text-gray-500">Best AI practices</p>
                              </div>
                            </a>
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>

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
                <Button 
                  variant="ghost" 
                  className="text-white hover:text-gray-300"
                  onClick={openAuthModal}
                >
                  Log in
                </Button>
                <Button 
                  className="ml-3 bg-white hover:bg-gray-200 text-black"
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
        <div className="md:hidden bg-black border-b border-gray-800">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {!showDashboardLinks && (
              <>
                <div className="px-3 py-2">
                  <div className="font-medium text-white text-base">Platform</div>
                  <Link href="/tone-analysis">
                    <a className="block px-3 py-2 text-sm text-gray-300 hover:bg-gray-900 hover:text-white rounded mt-1">
                      Tone Analysis
                    </a>
                  </Link>
                  <Link href="/content-generation">
                    <a className="block px-3 py-2 text-sm text-gray-300 hover:bg-gray-900 hover:text-white rounded">
                      Content Generation
                    </a>
                  </Link>
                </div>
                
                <div className="px-3 py-2">
                  <div className="font-medium text-white text-base">Resources</div>
                  <Link href="/customers">
                    <a className="block px-3 py-2 text-sm text-gray-300 hover:bg-gray-900 hover:text-white rounded mt-1">
                      Customers
                    </a>
                  </Link>
                  <Link href="/blog">
                    <a className="block px-3 py-2 text-sm text-gray-300 hover:bg-gray-900 hover:text-white rounded">
                      Blog
                    </a>
                  </Link>
                  <Link href="/guides">
                    <a className="block px-3 py-2 text-sm text-gray-300 hover:bg-gray-900 hover:text-white rounded">
                      Guides
                    </a>
                  </Link>
                </div>
                
                <a
                  href="#"
                  className="text-gray-300 hover:bg-gray-900 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                >
                  Enterprise
                </a>
                <a
                  href="#"
                  className="text-gray-300 hover:bg-gray-900 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                >
                  Pricing
                </a>
              </>
            )}
            
            {user ? (
              <Link
                href="/dashboard"
                className="text-white hover:bg-gray-900 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              >
                Dashboard
              </Link>
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
                  className="bg-white text-black block w-full text-left px-3 py-2 rounded-md text-base font-medium mt-2"
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
