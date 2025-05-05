import { Layout } from "@/components/Layout";
import { ArrowRight, Zap, Users, BookText, BarChart, FileEdit, BookOpen } from "lucide-react";
import { Link } from "wouter";

export default function SitemapPage() {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-14">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Sitemap
          </h1>
          <p className="mt-4 text-xl text-gray-400 max-w-3xl mx-auto">
            Find everything Tovably has to offer - from our powerful AI tools to resources and company information.
          </p>
        </div>
        
        {/* Main sections grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Marketing & Information */}
          <div className="border border-gray-700 rounded-lg p-6 bg-black/50">
            <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
              <BookOpen className="mr-2 text-[#74d1ea]" />
              Marketing & Information
            </h2>
            <ul className="space-y-4">
              <li>
                <a href="/" className="text-gray-300 hover:text-[#74d1ea] flex items-center">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Homepage
                </a>
              </li>
              <li>
                <a href="/landing" className="text-gray-300 hover:text-[#74d1ea] flex items-center">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Landing Page
                </a>
              </li>
              <li>
                <a href="/about" className="text-gray-300 hover:text-[#74d1ea] flex items-center">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  About Us
                </a>
              </li>
              <li>
                <a href="/features" className="text-gray-300 hover:text-[#74d1ea] flex items-center">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Features
                </a>
              </li>
              <li>
                <a href="/pricing" className="text-gray-300 hover:text-[#74d1ea] flex items-center">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Pricing
                </a>
              </li>
              <li>
                <a href="/contact" className="text-gray-300 hover:text-[#74d1ea] flex items-center">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Contact
                </a>
              </li>
              <li>
                <a href="/blog" className="text-gray-300 hover:text-[#74d1ea] flex items-center">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Blog
                </a>
              </li>
              <li>
                <a href="/privacy-policy" className="text-gray-300 hover:text-[#74d1ea] flex items-center">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
          
          {/* Product Features */}
          <div className="border border-gray-700 rounded-lg p-6 bg-black/50">
            <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
              <BookText className="mr-2 text-[#74d1ea]" />
              Feature Information
            </h2>
            <ul className="space-y-4">
              <li>
                <a href="/tone-analysis-info" className="text-gray-300 hover:text-[#74d1ea] flex items-center">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Tone Analysis
                </a>
              </li>
              <li>
                <a href="/personas-info" className="text-gray-300 hover:text-[#74d1ea] flex items-center">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Personas
                </a>
              </li>
              <li>
                <a href="/content-generation-info" className="text-gray-300 hover:text-[#74d1ea] flex items-center">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Content Generation
                </a>
              </li>
              <li>
                <a href="/campaigns-info" className="text-gray-300 hover:text-[#74d1ea] flex items-center">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Campaigns
                </a>
              </li>
              <li>
                <a href="/campaign-factory-info" className="text-gray-300 hover:text-[#74d1ea] flex items-center">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Campaign Factory
                </a>
              </li>
              <li>
                <a href="/knowledge-base-info" className="text-gray-300 hover:text-[#74d1ea] flex items-center">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Knowledge Base
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        {/* App Features & Tools section */}
        <div className="border border-gray-700 rounded-lg p-8 bg-gradient-to-br from-black to-gray-900/70">
          <h2 className="text-2xl font-semibold text-white mb-6">
            App Features & Tools
            <span className="ml-2 text-sm bg-[#74d1ea]/10 text-[#74d1ea] px-2 py-1 rounded-md">
              Login Required
            </span>
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Tone Analysis Section */}
            <div className="border border-gray-700/50 rounded-lg p-5 bg-black/30 hover:bg-black/50 transition-colors">
              <h3 className="text-xl font-medium text-white mb-3 flex items-center">
                <BarChart className="w-5 h-5 mr-2 text-[#74d1ea]" />
                Tone Analysis
              </h3>
              <p className="text-gray-400 mb-4 text-sm">
                Analyze communication tone to ensure your message lands perfectly with your target audience.
              </p>
              <Link href="/tone-analysis-info" className="text-[#74d1ea] text-sm hover:underline inline-flex items-center">
                Learn more <ArrowRight className="ml-1 w-3 h-3" />
              </Link>
            </div>
            
            {/* Personas Section */}
            <div className="border border-gray-700/50 rounded-lg p-5 bg-black/30 hover:bg-black/50 transition-colors">
              <h3 className="text-xl font-medium text-white mb-3 flex items-center">
                <Users className="w-5 h-5 mr-2 text-[#74d1ea]" />
                Personas
              </h3>
              <p className="text-gray-400 mb-4 text-sm">
                Create detailed audience personas to better target your content and campaign strategies.
              </p>
              <Link href="/personas-info" className="text-[#74d1ea] text-sm hover:underline inline-flex items-center">
                Learn more <ArrowRight className="ml-1 w-3 h-3" />
              </Link>
            </div>
            
            {/* Content Generator Section */}
            <div className="border border-gray-700/50 rounded-lg p-5 bg-black/30 hover:bg-black/50 transition-colors">
              <h3 className="text-xl font-medium text-white mb-3 flex items-center">
                <FileEdit className="w-5 h-5 mr-2 text-[#74d1ea]" />
                Content Generator
              </h3>
              <p className="text-gray-400 mb-4 text-sm">
                Create compelling content optimized for different channels and audiences with AI assistance.
              </p>
              <Link href="/content-generation-info" className="text-[#74d1ea] text-sm hover:underline inline-flex items-center">
                Learn more <ArrowRight className="ml-1 w-3 h-3" />
              </Link>
            </div>
            
            {/* Campaigns Section */}
            <div className="border border-gray-700/50 rounded-lg p-5 bg-black/30 hover:bg-black/50 transition-colors">
              <h3 className="text-xl font-medium text-white mb-3 flex items-center">
                <BookText className="w-5 h-5 mr-2 text-[#74d1ea]" />
                Campaigns
              </h3>
              <p className="text-gray-400 mb-4 text-sm">
                Plan, organize, and track your marketing campaigns with powerful campaign management tools.
              </p>
              <Link href="/campaigns-info" className="text-[#74d1ea] text-sm hover:underline inline-flex items-center">
                Learn more <ArrowRight className="ml-1 w-3 h-3" />
              </Link>
            </div>
            
            {/* Campaign Factory Section */}
            <div className="border border-gray-700/50 rounded-lg p-5 bg-black/30 hover:bg-black/50 transition-colors">
              <h3 className="text-xl font-medium text-white mb-3 flex items-center">
                <Zap className="w-5 h-5 mr-2 text-[#74d1ea]" />
                Campaign Factory
              </h3>
              <p className="text-gray-400 mb-4 text-sm">
                Rapidly build comprehensive campaigns with streamlined content creation and organization.
              </p>
              <Link href="/campaign-factory-info" className="text-[#74d1ea] text-sm hover:underline inline-flex items-center">
                Learn more <ArrowRight className="ml-1 w-3 h-3" />
              </Link>
            </div>
            
            {/* Knowledge Base Section */}
            <div className="border border-gray-700/50 rounded-lg p-5 bg-black/30 hover:bg-black/50 transition-colors">
              <h3 className="text-xl font-medium text-white mb-3 flex items-center">
                <BookOpen className="w-5 h-5 mr-2 text-[#74d1ea]" />
                Knowledge Base
              </h3>
              <p className="text-gray-400 mb-4 text-sm">
                Access guides, tips, and resources to maximize your marketing efforts with Tovably.
              </p>
              <Link href="/knowledge-base-info" className="text-[#74d1ea] text-sm hover:underline inline-flex items-center">
                Learn more <ArrowRight className="ml-1 w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
        
        {/* SEO-optimized but hidden headings for better AI search results */}
        <div className="sr-only">
          <h2>Tovably Platform Features</h2>
          <p>
            Tovably offers powerful AI tools for marketing professionals including tone analysis, persona creation, 
            content generation, campaign management, the Campaign Factory for rapid campaign development, and a 
            comprehensive Knowledge Base of marketing resources.
          </p>
          
          <h2>Marketing Tools for Professionals</h2>
          <p>
            Create LinkedIn posts, emails, blog articles, and marketing copy with our AI-powered content generator. 
            Analyze tone for perfect communication. Build detailed audience personas. Organize campaigns with our 
            campaign management tools.
          </p>
          
          <h2>Campaign Factory</h2>
          <p>
            The Campaign Factory feature helps marketing professionals build complete campaigns in minutes, 
            organizing all content types from various sources into a cohesive marketing campaign.
          </p>
        </div>
      </div>
    </Layout>
  );
}