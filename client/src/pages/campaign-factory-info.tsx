import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Target, Users, Layers, Zap } from "lucide-react";
import Layout from "@/components/Layout";
import { useEffect } from "react";
import { useAuthModal } from "@/hooks/use-auth-modal";

export default function CampaignFactoryInfoPage() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const { openAuthModal } = useAuthModal();

  const handleGetStarted = () => {
    if (user) {
      navigate("/campaign-factory");
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
              <span className="text-sm font-medium">Tovably Campaign Factory</span>
            </div>
            <h1 className="text-4xl tracking-tight font-semibold sm:text-5xl md:text-6xl text-white mb-6">
              Create <span className="text-[#74d1ea]">automated campaigns</span> for effective marketing
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mb-8">
              Design, schedule, and execute multi-channel marketing campaigns with AI-powered tools that save time and increase effectiveness.
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
              <h3 className="text-xl font-medium text-white mb-3">Automated Creation</h3>
              <p className="text-gray-400">
                Design and schedule complete campaigns with AI-generated content for each stage.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="border-t border-[#74d1ea]/30 pt-6">
              <div className="h-10 w-10 bg-[#74d1ea]/10 rounded-full flex items-center justify-center mb-4">
                <Users className="h-5 w-5 text-[#74d1ea]" />
              </div>
              <h3 className="text-xl font-medium text-white mb-3">Multi-Channel Delivery</h3>
              <p className="text-gray-400">
                Distribute campaign content across email, social media, and other platforms automatically.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="border-t border-[#74d1ea]/30 pt-6">
              <div className="h-10 w-10 bg-[#74d1ea]/10 rounded-full flex items-center justify-center mb-4">
                <Layers className="h-5 w-5 text-[#74d1ea]" />
              </div>
              <h3 className="text-xl font-medium text-white mb-3">Performance Tracking</h3>
              <p className="text-gray-400">
                Monitor campaign metrics in real-time to optimize for maximum engagement and conversions.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="border-t border-[#74d1ea]/30 pt-6">
              <div className="h-10 w-10 bg-[#74d1ea]/10 rounded-full flex items-center justify-center mb-4">
                <Zap className="h-5 w-5 text-[#74d1ea]" />
              </div>
              <h3 className="text-xl font-medium text-white mb-3">Adaptive Optimization</h3>
              <p className="text-gray-400">
                Leverage AI-driven insights to continuously improve campaign performance over time.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-black py-16 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-semibold text-white mb-4">How Campaign Factory Works</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              A streamlined workflow for creating, executing, and optimizing your marketing campaigns
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-900/30 backdrop-blur-sm rounded-lg p-6 border border-gray-700/60 shadow-[0_0_15px_rgba(116,209,234,0.15)]">
              <div className="bg-[#74d1ea]/20 rounded-full h-14 w-14 flex items-center justify-center mb-6 border border-[#74d1ea]/30">
                <span className="text-[#74d1ea] font-medium text-lg">1</span>
              </div>
              <h3 className="text-xl font-medium text-white mb-3">Define Campaign Goals</h3>
              <p className="text-gray-400">
                Set specific objectives, target personas, and success metrics for your campaign to guide the AI content generation.
              </p>
            </div>
            
            <div className="bg-gray-900/30 backdrop-blur-sm rounded-lg p-6 border border-gray-700/60 shadow-[0_0_15px_rgba(116,209,234,0.15)]">
              <div className="bg-[#74d1ea]/20 rounded-full h-14 w-14 flex items-center justify-center mb-6 border border-[#74d1ea]/30">
                <span className="text-[#74d1ea] font-medium text-lg">2</span>
              </div>
              <h3 className="text-xl font-medium text-white mb-3">Build Content Sequence</h3>
              <p className="text-gray-400">
                Create a series of messaging touchpoints that move your audience through awareness, consideration, and conversion.
              </p>
            </div>
            
            <div className="bg-gray-900/30 backdrop-blur-sm rounded-lg p-6 border border-gray-700/60 shadow-[0_0_15px_rgba(116,209,234,0.15)]">
              <div className="bg-[#74d1ea]/20 rounded-full h-14 w-14 flex items-center justify-center mb-6 border border-[#74d1ea]/30">
                <span className="text-[#74d1ea] font-medium text-lg">3</span>
              </div>
              <h3 className="text-xl font-medium text-white mb-3">Deploy and Track</h3>
              <p className="text-gray-400">
                Launch your campaign and monitor performance in real-time, with detailed analytics on engagement and conversion metrics.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Campaign Types Section */}
      <div className="bg-black py-16 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-semibold text-white mb-4">Campaign Types</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Design different campaign types for every marketing objective
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="border border-gray-700/60 rounded-lg overflow-hidden shadow-[0_0_15px_rgba(116,209,234,0.15)]">
              <div className="px-6 py-4 bg-gray-900/30 border-b border-gray-700/60">
                <h3 className="text-lg font-medium text-white">Lead Generation Campaigns</h3>
              </div>
              <div className="p-6">
                <div className="mb-4">
                  <h4 className="text-white font-medium mb-2">Overview</h4>
                  <p className="text-gray-400">
                    Generate a steady flow of qualified prospects with targeted content that addresses specific pain points.
                  </p>
                </div>
                
                <div className="mb-4">
                  <h4 className="text-white font-medium mb-2">Key Components</h4>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-[#74d1ea]/10 text-[#74d1ea] text-xs px-2 py-1 rounded-full border border-[#74d1ea]/30">
                      Lead Magnets
                    </span>
                    <span className="bg-[#74d1ea]/10 text-[#74d1ea] text-xs px-2 py-1 rounded-full border border-[#74d1ea]/30">
                      Landing Pages
                    </span>
                    <span className="bg-[#74d1ea]/10 text-[#74d1ea] text-xs px-2 py-1 rounded-full border border-[#74d1ea]/30">
                      Email Nurture Sequence
                    </span>
                    <span className="bg-[#74d1ea]/10 text-[#74d1ea] text-xs px-2 py-1 rounded-full border border-[#74d1ea]/30">
                      Retargeting Ads
                    </span>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-white font-medium mb-2">Timeline</h4>
                  <ul className="text-gray-400 space-y-1">
                    <li className="flex items-start">
                      <ArrowRight className="h-4 w-4 text-[#74d1ea] mr-2 mt-1 flex-shrink-0" />
                      <span>Typically 30-45 days for full execution</span>
                    </li>
                    <li className="flex items-start">
                      <ArrowRight className="h-4 w-4 text-[#74d1ea] mr-2 mt-1 flex-shrink-0" />
                      <span>Starts with audience targeting and content creation</span>
                    </li>
                    <li className="flex items-start">
                      <ArrowRight className="h-4 w-4 text-[#74d1ea] mr-2 mt-1 flex-shrink-0" />
                      <span>Includes ongoing optimization based on response rates</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="border border-gray-700/60 rounded-lg overflow-hidden shadow-[0_0_15px_rgba(116,209,234,0.15)]">
              <div className="px-6 py-4 bg-gray-900/30 border-b border-gray-700/60">
                <h3 className="text-lg font-medium text-white">Product Launch Campaigns</h3>
              </div>
              <div className="p-6">
                <div className="mb-4">
                  <h4 className="text-white font-medium mb-2">Overview</h4>
                  <p className="text-gray-400">
                    Build anticipation and maximize conversions for new product or service launches with coordinated messaging.
                  </p>
                </div>
                
                <div className="mb-4">
                  <h4 className="text-white font-medium mb-2">Key Components</h4>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-[#74d1ea]/10 text-[#74d1ea] text-xs px-2 py-1 rounded-full border border-[#74d1ea]/30">
                      Teaser Content
                    </span>
                    <span className="bg-[#74d1ea]/10 text-[#74d1ea] text-xs px-2 py-1 rounded-full border border-[#74d1ea]/30">
                      Announcement Materials
                    </span>
                    <span className="bg-[#74d1ea]/10 text-[#74d1ea] text-xs px-2 py-1 rounded-full border border-[#74d1ea]/30">
                      Sales Pages
                    </span>
                    <span className="bg-[#74d1ea]/10 text-[#74d1ea] text-xs px-2 py-1 rounded-full border border-[#74d1ea]/30">
                      Social Campaigns
                    </span>
                    <span className="bg-[#74d1ea]/10 text-[#74d1ea] text-xs px-2 py-1 rounded-full border border-[#74d1ea]/30">
                      Follow-up Sequence
                    </span>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-white font-medium mb-2">Timeline</h4>
                  <ul className="text-gray-400 space-y-1">
                    <li className="flex items-start">
                      <ArrowRight className="h-4 w-4 text-[#74d1ea] mr-2 mt-1 flex-shrink-0" />
                      <span>60-90 day comprehensive launch cycle</span>
                    </li>
                    <li className="flex items-start">
                      <ArrowRight className="h-4 w-4 text-[#74d1ea] mr-2 mt-1 flex-shrink-0" />
                      <span>Pre-launch, launch, and post-launch phases</span>
                    </li>
                    <li className="flex items-start">
                      <ArrowRight className="h-4 w-4 text-[#74d1ea] mr-2 mt-1 flex-shrink-0" />
                      <span>Includes early adopter incentives and special offers</span>
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
            <h2 className="text-3xl font-semibold text-white mb-4">Why Use Campaign Factory?</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Streamline your marketing execution with measurable results
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="border border-gray-700/60 rounded-lg p-8 shadow-[0_0_15px_rgba(116,209,234,0.15)]">
              <h3 className="text-xl font-medium text-white mb-4">Efficiency Gains</h3>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-start">
                  <ArrowRight className="h-5 w-5 text-[#74d1ea] mr-3 mt-0.5 flex-shrink-0" />
                  <span>Reduce campaign planning time by up to 60%</span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-5 w-5 text-[#74d1ea] mr-3 mt-0.5 flex-shrink-0" />
                  <span>Automate content creation across multiple touchpoints</span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-5 w-5 text-[#74d1ea] mr-3 mt-0.5 flex-shrink-0" />
                  <span>Eliminate manual scheduling and publishing tasks</span>
                </li>
              </ul>
            </div>
            
            <div className="border border-gray-700/60 rounded-lg p-8 shadow-[0_0_15px_rgba(116,209,234,0.15)]">
              <h3 className="text-xl font-medium text-white mb-4">Marketing Performance</h3>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-start">
                  <ArrowRight className="h-5 w-5 text-[#74d1ea] mr-3 mt-0.5 flex-shrink-0" />
                  <span>25% higher engagement from AI-optimized messaging</span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-5 w-5 text-[#74d1ea] mr-3 mt-0.5 flex-shrink-0" />
                  <span>Improve conversion rates through personalized sequences</span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-5 w-5 text-[#74d1ea] mr-3 mt-0.5 flex-shrink-0" />
                  <span>Gain detailed performance insights for continuous improvement</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}