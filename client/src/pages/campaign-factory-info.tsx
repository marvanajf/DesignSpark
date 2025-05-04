import React from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  CheckCircle, 
  MessageSquare, 
  FileText, 
  Zap, 
  LineChart,
  Sparkles,
  Clock
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";

export default function CampaignFactoryInfo() {
  const { user } = useAuth();
  const [, navigate] = useLocation();

  const handleGetStarted = () => {
    if (user) {
      navigate("/campaign-factory");
    } else {
      navigate("/auth");
    }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <div className="relative bg-black py-12 sm:py-16 lg:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0e1b33]/20 via-transparent to-transparent"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start mb-4">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#74d1ea]/10 text-[#74d1ea] border border-[#74d1ea]/30">
              <Sparkles className="w-4 h-4 mr-2" />
              Tovably Campaign Factory
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 md:mb-6">
            Transform your <span className="text-[#74d1ea]">campaigns</span> with AI-powered simplicity
          </h1>
          
          <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-3xl">
            Create complete marketing campaigns in minutes, not weeks. Our platform helps you build comprehensive multi-channel campaigns that deliver consistent messaging and drive results.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center sm:justify-start">
            <Button 
              onClick={handleGetStarted}
              className="bg-[#74d1ea] hover:bg-[#5db8d0] text-black font-medium px-8 py-3 rounded-md shadow-[0_0_12px_rgba(116,209,234,0.3)]"
            >
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            
            <Button 
              onClick={() => navigate("/pricing")}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/5"
            >
              View Pricing
            </Button>
          </div>
        </div>
      </div>

      {/* Key Features Section */}
      <div className="py-16 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white">Generate your entire campaign at once</h2>
            <p className="mt-4 text-xl text-gray-300 max-w-3xl mx-auto">
              Our OpenAI-powered Campaign Factory creates perfectly aligned content across multiple channels from a single prompt.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-black border border-gray-800/60 rounded-lg p-6 shadow-[0_0_20px_rgba(116,209,234,0.10)]">
              <div className="h-12 w-12 rounded-full bg-[#74d1ea]/10 border border-[#74d1ea]/30 flex items-center justify-center mb-4">
                <MessageSquare className="h-6 w-6 text-[#74d1ea]" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">LinkedIn Posts</h3>
              <p className="text-gray-400">
                Create engaging LinkedIn content that resonates with your professional audience and drives engagement.
              </p>
            </div>
            
            <div className="bg-black border border-gray-800/60 rounded-lg p-6 shadow-[0_0_20px_rgba(116,209,234,0.10)]">
              <div className="h-12 w-12 rounded-full bg-[#74d1ea]/10 border border-[#74d1ea]/30 flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-[#74d1ea]" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Blog Articles</h3>
              <p className="text-gray-400">
                Generate complete blog posts that establish your authority and drive organic traffic to your site.
              </p>
            </div>
            
            <div className="bg-black border border-gray-800/60 rounded-lg p-6 shadow-[0_0_20px_rgba(116,209,234,0.10)]">
              <div className="h-12 w-12 rounded-full bg-[#74d1ea]/10 border border-[#74d1ea]/30 flex items-center justify-center mb-4">
                <MessageSquare className="h-6 w-6 text-[#74d1ea]" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Email Sequences</h3>
              <p className="text-gray-400">
                Build entire email sequences that nurture leads and convert prospects with consistent messaging.
              </p>
            </div>
            
            <div className="bg-black border border-gray-800/60 rounded-lg p-6 shadow-[0_0_20px_rgba(116,209,234,0.10)]">
              <div className="h-12 w-12 rounded-full bg-[#74d1ea]/10 border border-[#74d1ea]/30 flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-[#74d1ea]" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Webinar Content</h3>
              <p className="text-gray-400">
                Develop webinar scripts, presentations, and follow-up materials that establish your expertise.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-16 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white">How Campaign Factory works</h2>
            <p className="mt-4 text-xl text-gray-300 max-w-3xl mx-auto">
              Three simple steps to creating complete marketing campaigns in minutes.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-black border border-gray-800/60 rounded-lg p-6 relative shadow-[0_0_20px_rgba(116,209,234,0.10)]">
              <div className="absolute -top-5 -left-5 h-12 w-12 rounded-full bg-[#74d1ea] text-black font-bold text-xl flex items-center justify-center">
                1
              </div>
              <div className="pt-4">
                <h3 className="text-xl font-semibold text-white mb-4">Define your campaign</h3>
                <p className="text-gray-400">
                  Describe your campaign objectives, target audience, and key messages in our intuitive interface.
                </p>
              </div>
            </div>
            
            <div className="bg-black border border-gray-800/60 rounded-lg p-6 relative shadow-[0_0_20px_rgba(116,209,234,0.10)]">
              <div className="absolute -top-5 -left-5 h-12 w-12 rounded-full bg-[#74d1ea] text-black font-bold text-xl flex items-center justify-center">
                2
              </div>
              <div className="pt-4">
                <h3 className="text-xl font-semibold text-white mb-4">Choose your channels</h3>
                <p className="text-gray-400">
                  Select which marketing channels you want to include in your campaign from our supported options.
                </p>
              </div>
            </div>
            
            <div className="bg-black border border-gray-800/60 rounded-lg p-6 relative shadow-[0_0_20px_rgba(116,209,234,0.10)]">
              <div className="absolute -top-5 -left-5 h-12 w-12 rounded-full bg-[#74d1ea] text-black font-bold text-xl flex items-center justify-center">
                3
              </div>
              <div className="pt-4">
                <h3 className="text-xl font-semibold text-white mb-4">Generate & refine</h3>
                <p className="text-gray-400">
                  Our OpenAI-powered system generates all your campaign content, ready for you to review and refine.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-16 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center mb-4 px-4 py-1.5 bg-[#74d1ea]/10 border border-[#74d1ea]/30 rounded-full">
              <Clock className="h-4 w-4 text-[#74d1ea] mr-2" />
              <span className="text-[#74d1ea] text-sm font-medium">Save Time & Resources</span>
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Why use Campaign Factory?</h2>
            <p className="text-gray-300 text-lg max-w-3xl mx-auto">
              Our platform helps you create more content in less time using OpenAI's advanced language models to automate repetitive tasks.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="border border-gray-800/60 rounded-lg p-6 bg-black">
              <div className="flex items-start mb-4">
                <div className="flex-shrink-0 bg-[#74d1ea]/10 p-2 rounded-lg border border-[#74d1ea]/20 mr-4">
                  <Clock className="h-5 w-5 text-[#74d1ea]" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Save 20+ hours per campaign</h3>
                  <p className="text-gray-400">
                    What would normally take weeks of planning, writing, and coordination now happens in minutes with our AI-driven workflow.
                  </p>
                </div>
              </div>
              
              <ul className="space-y-3 pl-14">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-[#74d1ea] mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">Eliminate content bottlenecks</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-[#74d1ea] mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">Create campaigns 95% faster</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-[#74d1ea] mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">Reduce coordination overhead</span>
                </li>
              </ul>
            </div>
            
            <div className="border border-gray-800/60 rounded-lg p-6 bg-black">
              <div className="flex items-start mb-4">
                <div className="flex-shrink-0 bg-[#74d1ea]/10 p-2 rounded-lg border border-[#74d1ea]/20 mr-4">
                  <LineChart className="h-5 w-5 text-[#74d1ea]" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Boost your marketing impact</h3>
                  <p className="text-gray-400">
                    Drive better results with comprehensive, coordinated campaigns that deliver consistent messaging across all touchpoints.
                  </p>
                </div>
              </div>
              
              <ul className="space-y-3 pl-14">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-[#74d1ea] mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">Maintain consistent brand voice</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-[#74d1ea] mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">Create coordinated multi-channel experiences</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-[#74d1ea] mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">Improve campaign performance</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border border-gray-700/60 rounded-lg py-12 px-8 shadow-[0_0_30px_rgba(116,209,234,0.15)] text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to transform your marketing campaigns?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Join thousands of marketers who are saving time and increasing their impact with Tovably's Campaign Factory.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={handleGetStarted}
                className="bg-[#74d1ea] hover:bg-[#5db8d0] text-black font-medium px-8 py-3 rounded-md shadow-[0_0_12px_rgba(116,209,234,0.3)]"
              >
                Get Started Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              
              <Button 
                onClick={() => navigate("/pricing")}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/5"
              >
                View Plans & Pricing
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}