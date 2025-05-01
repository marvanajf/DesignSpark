import { Helmet } from "react-helmet";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { CheckCircle } from "lucide-react";

export default function FeaturesPage() {
  return (
    <Layout>
      <Helmet>
        <title>Features | Tovably</title>
        <meta name="description" content="Explore the powerful features of Tovably that help you analyze tone of voice and generate tailored content." />
      </Helmet>
      
      <div className="max-w-6xl mx-auto py-16 px-6">
        <h1 className="text-4xl font-semibold mb-8 text-center">Tovably Features</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mt-16">
          {/* AI Tone Analysis */}
          <div className="space-y-6">
            <div className="w-16 h-16 rounded-full bg-[#74d1ea]/10 flex items-center justify-center mb-6">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 17.5824V12.0253C20 6.61029 17.5 3 12 3C6.5 3 4 6.61029 4 12.0253V17.5824C4 19.1119 5.5 20.1358 6.5 20.6723C7.5 21.2088 9 21.7454 12 21.7454C15 21.7454 16.5 21.2088 17.5 20.6723C18.5 20.1358 20 19.1119 20 17.5824Z" stroke="#74d1ea" strokeWidth="2"/>
                <path d="M8.5 15C8.5 15 10 16.5 12 16.5C14 16.5 15.5 15 15.5 15" stroke="#74d1ea" strokeWidth="2" strokeLinecap="round"/>
                <path d="M9 11.5V10.5" stroke="#74d1ea" strokeWidth="2" strokeLinecap="round"/>
                <path d="M15 11.5V10.5" stroke="#74d1ea" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <h2 className="text-2xl font-medium text-white">AI-Powered Tone Analysis</h2>
            <p className="text-gray-400">
              Our sophisticated AI algorithms analyze your content's tone of voice, providing detailed insights into its professional, conversational, technical, friendly, and formal characteristics.
            </p>
            <ul className="space-y-3">
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-[#74d1ea] mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300">Comprehensive tone breakdown across five key dimensions</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-[#74d1ea] mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300">Analysis of sentence structure and vocabulary patterns</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-[#74d1ea] mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300">Identification of common phrases and keywords</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-[#74d1ea] mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300">Content recommendations based on tone results</span>
              </li>
            </ul>
          </div>

          {/* Persona Generation */}
          <div className="space-y-6">
            <div className="w-16 h-16 rounded-full bg-[#74d1ea]/10 flex items-center justify-center mb-6">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="#74d1ea" strokeWidth="2"/>
                <path d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z" stroke="#74d1ea" strokeWidth="2"/>
              </svg>
            </div>
            <h2 className="text-2xl font-medium text-white">AI Persona Creation</h2>
            <p className="text-gray-400">
              Create detailed AI-powered personas that represent your target audience with unique interests, motivations, and communication preferences.
            </p>
            <ul className="space-y-3">
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-[#74d1ea] mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300">Quick generation of personas from simple descriptions</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-[#74d1ea] mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300">Detailed persona profiles with unique characteristics</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-[#74d1ea] mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300">Save and organize multiple personas for different campaigns</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-[#74d1ea] mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300">Customizable persona details for precise targeting</span>
              </li>
            </ul>
          </div>

          {/* Content Generation */}
          <div className="space-y-6">
            <div className="w-16 h-16 rounded-full bg-[#74d1ea]/10 flex items-center justify-center mb-6">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z" stroke="#74d1ea" strokeWidth="2"/>
                <path d="M7 7H17" stroke="#74d1ea" strokeWidth="2" strokeLinecap="round"/>
                <path d="M7 12H17" stroke="#74d1ea" strokeWidth="2" strokeLinecap="round"/>
                <path d="M7 17H13" stroke="#74d1ea" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <h2 className="text-2xl font-medium text-white">Smart Content Generation</h2>
            <p className="text-gray-400">
              Generate tailored content specifically designed for your target personas, using your analyzed tone of voice for consistent brand communication.
            </p>
            <ul className="space-y-3">
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-[#74d1ea] mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300">Multiple content formats including LinkedIn posts and cold emails</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-[#74d1ea] mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300">Webinar and workshop content creation</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-[#74d1ea] mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300">Content customized to match your brand's unique tone</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-[#74d1ea] mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300">One-click regeneration for alternative content options</span>
              </li>
            </ul>
          </div>

          {/* Campaign Organization */}
          <div className="space-y-6">
            <div className="w-16 h-16 rounded-full bg-[#74d1ea]/10 flex items-center justify-center mb-6">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 6C3 4.34315 4.34315 3 6 3H18C19.6569 3 21 4.34315 21 6V18C21 19.6569 19.6569 21 18 21H6C4.34315 21 3 19.6569 3 18V6Z" stroke="#74d1ea" strokeWidth="2"/>
                <path d="M9 8H7V16H9V8Z" fill="#74d1ea"/>
                <path d="M13 8H11V16H13V8Z" fill="#74d1ea"/>
                <path d="M17 8H15V16H17V8Z" fill="#74d1ea"/>
              </svg>
            </div>
            <h2 className="text-2xl font-medium text-white">Campaign Organization</h2>
            <p className="text-gray-400">
              Organize your content into campaigns for better management and tracking of your marketing efforts across different initiatives.
            </p>
            <ul className="space-y-3">
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-[#74d1ea] mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300">Group related content pieces into organized campaigns</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-[#74d1ea] mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300">Streamlined interface for campaign management</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-[#74d1ea] mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300">Track campaign performance and content usage</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-[#74d1ea] mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300">Easily add and remove content from campaigns</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-20 text-center">
          <h2 className="text-2xl font-medium mb-6">Ready to transform your communication strategy?</h2>
          <Link href="/pricing">
            <Button className="bg-[#74d1ea] hover:bg-[#74d1ea]/80 text-black font-medium px-8 py-6 text-lg rounded-lg">
              View Pricing Options
            </Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
}