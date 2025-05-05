import { useState } from "react";
import Layout from "@/components/Layout";
import { Helmet } from "react-helmet";
import { Link } from "wouter";
import { 
  ChevronDown, 
  ChevronRight, 
  Globe, 
  ShieldCheck,
  LayoutDashboard,
  MessageSquarePlus,
  Users,
  BarChart3,
  Megaphone,
  BookText,
  Zap,
  UserCog,
  ActivitySquare,
  CreditCard,
  HelpCircle,
  FileText,
  Home,
  Phone,
  Info,
  ListChecks,
  ShoppingBag,
} from "lucide-react";

export default function SitemapPage() {
  const [marketingExpanded, setMarketingExpanded] = useState(true);
  const [appExpanded, setAppExpanded] = useState(true);
  const [featuresExpanded, setFeaturesExpanded] = useState(true);
  const [userExpanded, setUserExpanded] = useState(true);
  const [resourcesExpanded, setResourcesExpanded] = useState(true);
  
  // Function to handle section toggle
  const toggleSection = (section: string) => {
    switch(section) {
      case 'marketing':
        setMarketingExpanded(!marketingExpanded);
        break;
      case 'app':
        setAppExpanded(!appExpanded);
        break;
      case 'features':
        setFeaturesExpanded(!featuresExpanded);
        break;
      case 'user':
        setUserExpanded(!userExpanded);
        break;
      case 'resources':
        setResourcesExpanded(!resourcesExpanded);
        break;
    }
  };

  return (
    <>
      <Helmet>
        <title>Sitemap | Tovably - AI Content Generation Platform</title>
        <meta 
          name="description" 
          content="Complete sitemap of Tovably - Navigate through our marketing pages, features, application dashboards, and resources. Find all available sections and pages to explore our AI content generation platform." 
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://tovably.com/sitemap" />
        {/* Structured data for sitemap */}
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "WebSite",
              "url": "https://tovably.com/",
              "name": "Tovably - AI Content Generation Platform",
              "description": "Tovably is an AI-powered platform for marketing and content generation, offering tone analysis, persona creation, and campaign management.",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://tovably.com/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            }
          `}
        </script>
      </Helmet>
      
      <Layout>
        <div className="container mx-auto px-4 py-12 max-w-7xl">
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-white mb-2">Tovably Sitemap</h1>
            <p className="text-gray-400 max-w-3xl">
              This sitemap provides an overview of all available pages on Tovably, organized by sections. 
              Use it to navigate our website or to get a better understanding of our platform structure.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Marketing Pages Section */}
            <div className="bg-black border border-gray-800 rounded-lg p-6 shadow-lg">
              <div 
                className="flex items-center justify-between cursor-pointer mb-6"
                onClick={() => toggleSection('marketing')}
              >
                <div className="flex items-center">
                  <div className="bg-[#74d1ea]/10 p-2 rounded-lg mr-3">
                    <Globe className="h-5 w-5 text-[#74d1ea]" />
                  </div>
                  <h2 className="text-xl font-semibold text-white">Marketing Pages</h2>
                </div>
                {marketingExpanded ? (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                )}
              </div>
              
              {marketingExpanded && (
                <div className="space-y-4 pl-4">
                  <div className="sitemap-item">
                    <Link href="/" className="flex items-center text-gray-300 hover:text-[#74d1ea] transition">
                      <Home className="h-4 w-4 mr-2" />
                      <span>Home</span>
                    </Link>
                    <p className="text-xs text-gray-500 mt-1 ml-6">Main landing page with platform overview</p>
                  </div>
                  
                  <div className="sitemap-item">
                    <Link href="/landing" className="flex items-center text-gray-300 hover:text-[#74d1ea] transition">
                      <Globe className="h-4 w-4 mr-2" />
                      <span>Landing Page</span>
                    </Link>
                    <p className="text-xs text-gray-500 mt-1 ml-6">Feature-focused landing page</p>
                  </div>
                  
                  <div className="sitemap-item">
                    <Link href="/about" className="flex items-center text-gray-300 hover:text-[#74d1ea] transition">
                      <Info className="h-4 w-4 mr-2" />
                      <span>About Us</span>
                    </Link>
                    <p className="text-xs text-gray-500 mt-1 ml-6">Learn about our company and mission</p>
                  </div>
                  
                  <div className="sitemap-item">
                    <Link href="/pricing" className="flex items-center text-gray-300 hover:text-[#74d1ea] transition">
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      <span>Pricing</span>
                    </Link>
                    <p className="text-xs text-gray-500 mt-1 ml-6">Subscription plans and pricing details</p>
                  </div>
                  
                  <div className="sitemap-item">
                    <Link href="/contact" className="flex items-center text-gray-300 hover:text-[#74d1ea] transition">
                      <Phone className="h-4 w-4 mr-2" />
                      <span>Contact Us</span>
                    </Link>
                    <p className="text-xs text-gray-500 mt-1 ml-6">Get in touch with our team</p>
                  </div>
                  
                  <div className="sitemap-item">
                    <Link href="/blog" className="flex items-center text-gray-300 hover:text-[#74d1ea] transition">
                      <FileText className="h-4 w-4 mr-2" />
                      <span>Blog</span>
                    </Link>
                    <p className="text-xs text-gray-500 mt-1 ml-6">Articles, guides, and company updates</p>
                  </div>
                  
                  <div className="sitemap-item">
                    <Link href="/features" className="flex items-center text-gray-300 hover:text-[#74d1ea] transition">
                      <ListChecks className="h-4 w-4 mr-2" />
                      <span>Features</span>
                    </Link>
                    <p className="text-xs text-gray-500 mt-1 ml-6">Overview of all platform features</p>
                  </div>
                  
                  <div className="sitemap-item">
                    <Link href="/privacy-policy" className="flex items-center text-gray-300 hover:text-[#74d1ea] transition">
                      <ShieldCheck className="h-4 w-4 mr-2" />
                      <span>Privacy Policy</span>
                    </Link>
                    <p className="text-xs text-gray-500 mt-1 ml-6">Our data protection and privacy practices</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* App Pages Section */}
            <div className="bg-black border border-gray-800 rounded-lg p-6 shadow-lg">
              <div 
                className="flex items-center justify-between cursor-pointer mb-6"
                onClick={() => toggleSection('app')}
              >
                <div className="flex items-center">
                  <div className="bg-[#74d1ea]/10 p-2 rounded-lg mr-3">
                    <LayoutDashboard className="h-5 w-5 text-[#74d1ea]" />
                  </div>
                  <h2 className="text-xl font-semibold text-white">Application Dashboard</h2>
                </div>
                {appExpanded ? (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                )}
              </div>
              
              {appExpanded && (
                <div className="space-y-4 pl-4">
                  <div className="sitemap-item">
                    <Link href="/dashboard" className="flex items-center text-gray-300 hover:text-[#74d1ea] transition">
                      <LayoutDashboard className="h-4 w-4 mr-2" />
                      <span>Dashboard</span>
                    </Link>
                    <p className="text-xs text-gray-500 mt-1 ml-6">Main application dashboard with activity overview</p>
                  </div>
                  
                  <div 
                    className="sitemap-item flex items-center justify-between cursor-pointer mt-6"
                    onClick={() => toggleSection('features')}
                  >
                    <div className="flex items-center text-white">
                      <ListChecks className="h-4 w-4 mr-2" />
                      <span>Core Features</span>
                    </div>
                    {featuresExpanded ? (
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                  
                  {featuresExpanded && (
                    <div className="space-y-3 pl-6 mt-2">
                      <div className="sitemap-item">
                        <Link href="/campaigns" className="flex items-center text-gray-300 hover:text-[#74d1ea] transition">
                          <Megaphone className="h-4 w-4 mr-2" />
                          <span>Campaigns</span>
                        </Link>
                        <p className="text-xs text-gray-500 mt-1 ml-6">Manage your marketing campaigns</p>
                      </div>
                      
                      <div className="sitemap-item">
                        <Link href="/campaign-factory" className="flex items-center text-gray-300 hover:text-[#74d1ea] transition">
                          <Zap className="h-4 w-4 mr-2" />
                          <span>Campaign Factory</span>
                        </Link>
                        <p className="text-xs text-gray-500 mt-1 ml-6">Generate comprehensive marketing campaigns</p>
                      </div>
                      
                      <div className="sitemap-item">
                        <Link href="/tone-analysis" className="flex items-center text-gray-300 hover:text-[#74d1ea] transition">
                          <BarChart3 className="h-4 w-4 mr-2" />
                          <span>Tone Analysis</span>
                        </Link>
                        <p className="text-xs text-gray-500 mt-1 ml-6">Analyze content tone and style</p>
                      </div>
                      
                      <div className="sitemap-item">
                        <Link href="/personas" className="flex items-center text-gray-300 hover:text-[#74d1ea] transition">
                          <Users className="h-4 w-4 mr-2" />
                          <span>Personas</span>
                        </Link>
                        <p className="text-xs text-gray-500 mt-1 ml-6">Create and manage audience personas</p>
                      </div>
                      
                      <div className="sitemap-item">
                        <Link href="/content-generator" className="flex items-center text-gray-300 hover:text-[#74d1ea] transition">
                          <MessageSquarePlus className="h-4 w-4 mr-2" />
                          <span>Content Generator</span>
                        </Link>
                        <p className="text-xs text-gray-500 mt-1 ml-6">Generate various types of marketing content</p>
                      </div>
                      
                      <div className="sitemap-item">
                        <Link href="/saved-content" className="flex items-center text-gray-300 hover:text-[#74d1ea] transition">
                          <FileText className="h-4 w-4 mr-2" />
                          <span>Saved Content</span>
                        </Link>
                        <p className="text-xs text-gray-500 mt-1 ml-6">Access your previously generated content</p>
                      </div>
                    </div>
                  )}
                  
                  <div 
                    className="sitemap-item flex items-center justify-between cursor-pointer mt-6"
                    onClick={() => toggleSection('user')}
                  >
                    <div className="flex items-center text-white">
                      <UserCog className="h-4 w-4 mr-2" />
                      <span>User Settings</span>
                    </div>
                    {userExpanded ? (
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                  
                  {userExpanded && (
                    <div className="space-y-3 pl-6 mt-2">
                      <div className="sitemap-item">
                        <Link href="/account" className="flex items-center text-gray-300 hover:text-[#74d1ea] transition">
                          <UserCog className="h-4 w-4 mr-2" />
                          <span>Account Settings</span>
                        </Link>
                        <p className="text-xs text-gray-500 mt-1 ml-6">Manage your account details</p>
                      </div>
                      
                      <div className="sitemap-item">
                        <Link href="/usage" className="flex items-center text-gray-300 hover:text-[#74d1ea] transition">
                          <ActivitySquare className="h-4 w-4 mr-2" />
                          <span>Usage Monitor</span>
                        </Link>
                        <p className="text-xs text-gray-500 mt-1 ml-6">Track your platform usage and limits</p>
                      </div>
                      
                      <div className="sitemap-item">
                        <Link href="/pricing" className="flex items-center text-gray-300 hover:text-[#74d1ea] transition">
                          <CreditCard className="h-4 w-4 mr-2" />
                          <span>Subscription</span>
                        </Link>
                        <p className="text-xs text-gray-500 mt-1 ml-6">Manage your subscription plan</p>
                      </div>
                    </div>
                  )}
                  
                  <div 
                    className="sitemap-item flex items-center justify-between cursor-pointer mt-6"
                    onClick={() => toggleSection('resources')}
                  >
                    <div className="flex items-center text-white">
                      <BookText className="h-4 w-4 mr-2" />
                      <span>Resources</span>
                    </div>
                    {resourcesExpanded ? (
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                  
                  {resourcesExpanded && (
                    <div className="space-y-3 pl-6 mt-2">
                      <div className="sitemap-item">
                        <Link href="/knowledge-base" className="flex items-center text-gray-300 hover:text-[#74d1ea] transition">
                          <BookText className="h-4 w-4 mr-2" />
                          <span>Knowledge Base</span>
                        </Link>
                        <p className="text-xs text-gray-500 mt-1 ml-6">Guides and tutorials for using the platform</p>
                      </div>
                      
                      <div className="sitemap-item">
                        <Link href="/support" className="flex items-center text-gray-300 hover:text-[#74d1ea] transition">
                          <HelpCircle className="h-4 w-4 mr-2" />
                          <span>Support</span>
                        </Link>
                        <p className="text-xs text-gray-500 mt-1 ml-6">Contact customer support</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* Feature Information Pages Section */}
          <div className="bg-black border border-gray-800 rounded-lg p-6 shadow-lg mb-12">
            <h2 className="text-xl font-semibold text-white mb-6">Feature Information Pages</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="border border-gray-800 rounded-lg p-4 hover:border-[#74d1ea]/30 transition">
                <Link href="/tone-analysis-info" className="block text-white hover:text-[#74d1ea]">
                  <div className="flex items-center mb-3">
                    <div className="bg-[#74d1ea]/10 p-2 rounded-lg mr-3">
                      <BarChart3 className="h-5 w-5 text-[#74d1ea]" />
                    </div>
                    <h3 className="font-medium">Tone Analysis</h3>
                  </div>
                  <p className="text-sm text-gray-400">
                    Analyze content to understand tone, sentiment, and style characteristics.
                  </p>
                </Link>
              </div>
              
              <div className="border border-gray-800 rounded-lg p-4 hover:border-[#74d1ea]/30 transition">
                <Link href="/personas-info" className="block text-white hover:text-[#74d1ea]">
                  <div className="flex items-center mb-3">
                    <div className="bg-[#74d1ea]/10 p-2 rounded-lg mr-3">
                      <Users className="h-5 w-5 text-[#74d1ea]" />
                    </div>
                    <h3 className="font-medium">Personas</h3>
                  </div>
                  <p className="text-sm text-gray-400">
                    Create detailed audience personas for targeted content creation.
                  </p>
                </Link>
              </div>
              
              <div className="border border-gray-800 rounded-lg p-4 hover:border-[#74d1ea]/30 transition">
                <Link href="/content-generation-info" className="block text-white hover:text-[#74d1ea]">
                  <div className="flex items-center mb-3">
                    <div className="bg-[#74d1ea]/10 p-2 rounded-lg mr-3">
                      <MessageSquarePlus className="h-5 w-5 text-[#74d1ea]" />
                    </div>
                    <h3 className="font-medium">Content Generation</h3>
                  </div>
                  <p className="text-sm text-gray-400">
                    Generate professional marketing content with AI assistance.
                  </p>
                </Link>
              </div>
              
              <div className="border border-gray-800 rounded-lg p-4 hover:border-[#74d1ea]/30 transition">
                <Link href="/campaigns-info" className="block text-white hover:text-[#74d1ea]">
                  <div className="flex items-center mb-3">
                    <div className="bg-[#74d1ea]/10 p-2 rounded-lg mr-3">
                      <Megaphone className="h-5 w-5 text-[#74d1ea]" />
                    </div>
                    <h3 className="font-medium">Campaigns</h3>
                  </div>
                  <p className="text-sm text-gray-400">
                    Organize and manage marketing campaigns with strategic planning tools.
                  </p>
                </Link>
              </div>
              
              <div className="border border-gray-800 rounded-lg p-4 hover:border-[#74d1ea]/30 transition">
                <Link href="/campaign-factory-info" className="block text-white hover:text-[#74d1ea]">
                  <div className="flex items-center mb-3">
                    <div className="bg-[#74d1ea]/10 p-2 rounded-lg mr-3">
                      <Zap className="h-5 w-5 text-[#74d1ea]" />
                    </div>
                    <h3 className="font-medium">Campaign Factory</h3>
                  </div>
                  <p className="text-sm text-gray-400">
                    Generate complete multi-channel marketing campaigns in minutes.
                  </p>
                </Link>
              </div>
              
              <div className="border border-gray-800 rounded-lg p-4 hover:border-[#74d1ea]/30 transition">
                <Link href="/knowledge-base-info" className="block text-white hover:text-[#74d1ea]">
                  <div className="flex items-center mb-3">
                    <div className="bg-[#74d1ea]/10 p-2 rounded-lg mr-3">
                      <BookText className="h-5 w-5 text-[#74d1ea]" />
                    </div>
                    <h3 className="font-medium">Knowledge Base</h3>
                  </div>
                  <p className="text-sm text-gray-400">
                    Access a library of guides, tutorials, and best practices.
                  </p>
                </Link>
              </div>
            </div>
          </div>
          
          {/* XML Sitemap Information */}
          <div className="bg-black border border-gray-800 rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-white mb-4">Technical Sitemap Information</h2>
            <p className="text-gray-400 mb-4">
              For search engines and technical users, our XML sitemap is available at:
            </p>
            <div className="bg-gray-900 p-3 rounded-lg mb-4 font-mono text-sm text-gray-300">
              https://tovably.com/sitemap.xml
            </div>
            <p className="text-gray-400 mb-4">
              The XML sitemap contains URLs with the following priorities:
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex">
                <span className="w-32 text-gray-500">Homepage:</span>
                <span className="text-white">1.0 (highest)</span>
              </div>
              <div className="flex">
                <span className="w-32 text-gray-500">Feature pages:</span>
                <span className="text-white">0.8</span>
              </div>
              <div className="flex">
                <span className="w-32 text-gray-500">Pricing/Contact:</span>
                <span className="text-white">0.7</span>
              </div>
              <div className="flex">
                <span className="w-32 text-gray-500">Blog posts:</span>
                <span className="text-white">0.6</span>
              </div>
              <div className="flex">
                <span className="w-32 text-gray-500">Other pages:</span>
                <span className="text-white">0.5 (lowest)</span>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}