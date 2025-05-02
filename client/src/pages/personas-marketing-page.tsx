import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import { ArrowRight, Target, Users, Layers, Zap } from "lucide-react";
import { useEffect } from "react";
import { useAuthModal } from "@/hooks/use-auth-modal";

export default function PersonasMarketingPage() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const { openAuthModal } = useAuthModal();

  const handleGetStarted = () => {
    if (user) {
      navigate("/personas");
    } else {
      openAuthModal();
    }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <div className="relative py-20 bg-black overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-left max-w-3xl">
            <div className="inline-flex items-center mb-4 text-[#74d1ea]">
              <span className="flex h-2 w-2 bg-[#74d1ea] rounded-full mr-2"></span>
              <span className="text-sm font-medium">Tovably Audience Personas</span>
            </div>
            <h1 className="text-4xl tracking-tight font-semibold sm:text-5xl md:text-6xl text-white mb-6">
              Create <span className="text-[#74d1ea]">targeted personas</span> for precision marketing
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mb-8">
              Define, customize, and generate content for specific audience segments 
              to maximize engagement and conversion rates.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button 
                onClick={handleGetStarted}
                className="px-8 py-3 bg-[#74d1ea] hover:bg-[#5db8d0] text-black shadow-[0_0_10px_rgba(116,209,234,0.4)]"
              >
                Get started
              </Button>
              <Button 
                variant="outline"
                className="px-8 py-3 text-white border-gray-700 hover:bg-gray-900"
                onClick={() => navigate('/contact')}
              >
                Contact us
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-black py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="border-t border-[#74d1ea]/30 pt-6">
              <div className="h-10 w-10 bg-[#74d1ea]/10 rounded-full flex items-center justify-center mb-4">
                <Target className="h-5 w-5 text-[#74d1ea]" />
              </div>
              <h3 className="text-xl font-medium text-white mb-3">Precise Targeting</h3>
              <p className="text-gray-400">
                Create specific personas that match your ideal customers and target audiences.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="border-t border-[#74d1ea]/30 pt-6">
              <div className="h-10 w-10 bg-[#74d1ea]/10 rounded-full flex items-center justify-center mb-4">
                <Users className="h-5 w-5 text-[#74d1ea]" />
              </div>
              <h3 className="text-xl font-medium text-white mb-3">AI-Generated Personas</h3>
              <p className="text-gray-400">
                Generate detailed personas automatically or customize them to match your specific needs.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="border-t border-[#74d1ea]/30 pt-6">
              <div className="h-10 w-10 bg-[#74d1ea]/10 rounded-full flex items-center justify-center mb-4">
                <Layers className="h-5 w-5 text-[#74d1ea]" />
              </div>
              <h3 className="text-xl font-medium text-white mb-3">Multiple Use Cases</h3>
              <p className="text-gray-400">
                Use personas for content generation, campaign targeting, and audience research.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="border-t border-[#74d1ea]/30 pt-6">
              <div className="h-10 w-10 bg-[#74d1ea]/10 rounded-full flex items-center justify-center mb-4">
                <Zap className="h-5 w-5 text-[#74d1ea]" />
              </div>
              <h3 className="text-xl font-medium text-white mb-3">Increased Engagement</h3>
              <p className="text-gray-400">
                Boost response rates by tailoring messages to specific audience characteristics.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-black py-16 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-semibold text-white mb-4">How Audience Personas Work</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Define your ideal audiences and create content that speaks directly to their needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-900/30 backdrop-blur-sm rounded-lg p-6 border border-gray-700/60 shadow-[0_0_15px_rgba(116,209,234,0.15)]">
              <div className="bg-[#74d1ea]/20 rounded-full h-14 w-14 flex items-center justify-center mb-6 border border-[#74d1ea]/30">
                <span className="text-[#74d1ea] font-medium text-lg">1</span>
              </div>
              <h3 className="text-xl font-medium text-white mb-3">Create or Generate Personas</h3>
              <p className="text-gray-400">
                Build custom personas from scratch by defining demographics, pain points, and goals—or let our AI generate them for you.
              </p>
            </div>
            
            <div className="bg-gray-900/30 backdrop-blur-sm rounded-lg p-6 border border-gray-700/60 shadow-[0_0_15px_rgba(116,209,234,0.15)]">
              <div className="bg-[#74d1ea]/20 rounded-full h-14 w-14 flex items-center justify-center mb-6 border border-[#74d1ea]/30">
                <span className="text-[#74d1ea] font-medium text-lg">2</span>
              </div>
              <h3 className="text-xl font-medium text-white mb-3">Personalize & Refine</h3>
              <p className="text-gray-400">
                Customize your personas with specific interests, roles, industries, and communication preferences to match your target audiences.
              </p>
            </div>
            
            <div className="bg-gray-900/30 backdrop-blur-sm rounded-lg p-6 border border-gray-700/60 shadow-[0_0_15px_rgba(116,209,234,0.15)]">
              <div className="bg-[#74d1ea]/20 rounded-full h-14 w-14 flex items-center justify-center mb-6 border border-[#74d1ea]/30">
                <span className="text-[#74d1ea] font-medium text-lg">3</span>
              </div>
              <h3 className="text-xl font-medium text-white mb-3">Generate Targeted Content</h3>
              <p className="text-gray-400">
                Use your personas with Tovably's content generation tools to create messages specifically designed for each audience segment.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Example Personas Section */}
      <div className="bg-black py-16 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-semibold text-white mb-4">Example Personas</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              See how detailed personas can improve your marketing effectiveness
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="border border-gray-700/60 rounded-lg overflow-hidden shadow-[0_0_15px_rgba(116,209,234,0.15)]">
              <div className="px-6 py-4 bg-gray-900/30 border-b border-gray-700/60">
                <h3 className="text-lg font-medium text-white">Tech Director Persona</h3>
              </div>
              <div className="p-6">
                <div className="mb-4">
                  <h4 className="text-white font-medium mb-2">Overview</h4>
                  <p className="text-gray-400">
                    Sarah, 42, Technical Director at a mid-sized SaaS company, responsible for technology strategy and team management.
                  </p>
                </div>
                
                <div className="mb-4">
                  <h4 className="text-white font-medium mb-2">Key Interests</h4>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-[#74d1ea]/10 text-[#74d1ea] text-xs px-2 py-1 rounded-full border border-[#74d1ea]/30">
                      Cloud Infrastructure
                    </span>
                    <span className="bg-[#74d1ea]/10 text-[#74d1ea] text-xs px-2 py-1 rounded-full border border-[#74d1ea]/30">
                      Team Scalability
                    </span>
                    <span className="bg-[#74d1ea]/10 text-[#74d1ea] text-xs px-2 py-1 rounded-full border border-[#74d1ea]/30">
                      Enterprise Security
                    </span>
                    <span className="bg-[#74d1ea]/10 text-[#74d1ea] text-xs px-2 py-1 rounded-full border border-[#74d1ea]/30">
                      DevOps
                    </span>
                    <span className="bg-[#74d1ea]/10 text-[#74d1ea] text-xs px-2 py-1 rounded-full border border-[#74d1ea]/30">
                      Cost Optimization
                    </span>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-white font-medium mb-2">Pain Points</h4>
                  <ul className="text-gray-400 space-y-1">
                    <li className="flex items-start">
                      <ArrowRight className="h-4 w-4 text-[#74d1ea] mr-2 mt-1 flex-shrink-0" />
                      <span>Scaling infrastructure while maintaining performance</span>
                    </li>
                    <li className="flex items-start">
                      <ArrowRight className="h-4 w-4 text-[#74d1ea] mr-2 mt-1 flex-shrink-0" />
                      <span>Balancing technical debt with new feature development</span>
                    </li>
                    <li className="flex items-start">
                      <ArrowRight className="h-4 w-4 text-[#74d1ea] mr-2 mt-1 flex-shrink-0" />
                      <span>Finding and retaining top technical talent</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="border border-gray-700/60 rounded-lg overflow-hidden shadow-[0_0_15px_rgba(116,209,234,0.15)]">
              <div className="px-6 py-4 bg-gray-900/30 border-b border-gray-700/60">
                <h3 className="text-lg font-medium text-white">Marketing Leader Persona</h3>
              </div>
              <div className="p-6">
                <div className="mb-4">
                  <h4 className="text-white font-medium mb-2">Overview</h4>
                  <p className="text-gray-400">
                    Michael, 36, Head of Marketing at a growing e-commerce brand, focused on growth strategies and omnichannel campaigns.
                  </p>
                </div>
                
                <div className="mb-4">
                  <h4 className="text-white font-medium mb-2">Key Interests</h4>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-[#74d1ea]/10 text-[#74d1ea] text-xs px-2 py-1 rounded-full border border-[#74d1ea]/30">
                      Conversion Optimization
                    </span>
                    <span className="bg-[#74d1ea]/10 text-[#74d1ea] text-xs px-2 py-1 rounded-full border border-[#74d1ea]/30">
                      Content Strategy
                    </span>
                    <span className="bg-[#74d1ea]/10 text-[#74d1ea] text-xs px-2 py-1 rounded-full border border-[#74d1ea]/30">
                      Personalization
                    </span>
                    <span className="bg-[#74d1ea]/10 text-[#74d1ea] text-xs px-2 py-1 rounded-full border border-[#74d1ea]/30">
                      Customer Journey
                    </span>
                    <span className="bg-[#74d1ea]/10 text-[#74d1ea] text-xs px-2 py-1 rounded-full border border-[#74d1ea]/30">
                      ROI Measurement
                    </span>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-white font-medium mb-2">Pain Points</h4>
                  <ul className="text-gray-400 space-y-1">
                    <li className="flex items-start">
                      <ArrowRight className="h-4 w-4 text-[#74d1ea] mr-2 mt-1 flex-shrink-0" />
                      <span>Creating consistent messaging across multiple channels</span>
                    </li>
                    <li className="flex items-start">
                      <ArrowRight className="h-4 w-4 text-[#74d1ea] mr-2 mt-1 flex-shrink-0" />
                      <span>Generating enough quality content to maintain engagement</span>
                    </li>
                    <li className="flex items-start">
                      <ArrowRight className="h-4 w-4 text-[#74d1ea] mr-2 mt-1 flex-shrink-0" />
                      <span>Accurately attributing conversions to specific campaigns</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-black py-16 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-semibold text-white mb-4">Why Define Audience Personas?</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Precise targeting delivers measurable business results
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="border border-gray-700/60 rounded-lg p-8 shadow-[0_0_15px_rgba(116,209,234,0.15)]">
              <h3 className="text-xl font-medium text-white mb-4">Marketing Efficiency</h3>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-start">
                  <ArrowRight className="h-5 w-5 text-[#74d1ea] mr-3 mt-0.5 flex-shrink-0" />
                  <span>35% higher engagement rates with persona-targeted messaging</span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-5 w-5 text-[#74d1ea] mr-3 mt-0.5 flex-shrink-0" />
                  <span>Reduce content creation time by 40% with clear audience definitions</span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-5 w-5 text-[#74d1ea] mr-3 mt-0.5 flex-shrink-0" />
                  <span>18% higher conversion rates on outbound campaigns</span>
                </li>
              </ul>
            </div>
            
            <div className="border border-gray-700/60 rounded-lg p-8 shadow-[0_0_15px_rgba(116,209,234,0.15)]">
              <h3 className="text-xl font-medium text-white mb-4">Team Alignment</h3>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-start">
                  <ArrowRight className="h-5 w-5 text-[#74d1ea] mr-3 mt-0.5 flex-shrink-0" />
                  <span>Create shared understanding of target audiences across teams</span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-5 w-5 text-[#74d1ea] mr-3 mt-0.5 flex-shrink-0" />
                  <span>Improve product development with clear user-centered design goals</span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-5 w-5 text-[#74d1ea] mr-3 mt-0.5 flex-shrink-0" />
                  <span>Streamline decision-making with consistent audience prioritization</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-black py-16 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="border border-gray-700/60 rounded-lg py-12 px-6 shadow-[0_0_30px_rgba(116,209,234,0.20)]">
            <h2 className="text-3xl font-semibold text-white mb-6">
              Ready to create audience personas?
            </h2>
            <p className="text-xl text-gray-400 mb-8 max-w-3xl mx-auto">
              Start building detailed audience profiles for more targeted and effective marketing.
            </p>
            <Button 
              onClick={handleGetStarted}
              className="px-8 py-3 md:py-4 md:text-lg md:px-10 bg-[#74d1ea] hover:bg-[#5db8d0] text-black shadow-[0_0_10px_rgba(116,209,234,0.4)]"
            >
              Create personas now
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
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
              <a href="/contact" onClick={(e) => { e.preventDefault(); navigate('/contact'); }} className="text-base text-gray-400 hover:text-[#74d1ea]">
                Contact
              </a>
            </div>
          </nav>
          <div className="mt-8 flex justify-center space-x-6">
            <a href="#" className="text-gray-400 hover:text-[#74d1ea]">
              <span className="sr-only">LinkedIn</span>
              <i className="fab fa-linkedin fa-lg"></i>
            </a>
          </div>
          <p className="mt-8 text-center text-base text-gray-400">
            &copy; {new Date().getFullYear()} Tovably. All rights reserved.
          </p>
        </div>
      </footer>
    </Layout>
  );
}