import React from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { ArrowRight, FileText, BarChart3, Sparkles } from "lucide-react";
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

  const handleContactUs = () => {
    navigate("/contact");
  };

  return (
    <Layout showSidebar={false}>
      <div className="min-h-screen bg-black">
        <div className="max-w-7xl mx-auto px-4 pt-12 pb-20">
          {/* Header */}
          <div className="flex items-center mb-16">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-[#74d1ea]/10 text-[#74d1ea] border border-[#74d1ea]/30">
              <Sparkles className="w-4 h-4 mr-2" />
              <span>Tovably Campaign Factory</span>
            </div>
          </div>

          {/* Main Content */}
          <div className="mb-12">
            <h1 className="text-5xl font-bold mb-6">
              Create complete <span className="text-[#74d1ea]">campaigns</span> in minutes
            </h1>
            <p className="text-gray-400 text-xl max-w-3xl mb-10">
              Analyze your content's objectives, uncover patterns in your target audience, and generate entire multi-channel campaigns through our OpenAI-powered platform.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button 
                onClick={handleGetStarted}
                className="bg-[#74d1ea] hover:bg-[#5db8d0] text-black px-6 py-3"
              >
                Get started
              </Button>
              <Button 
                onClick={handleContactUs}
                variant="outline" 
                className="border-gray-700 text-white hover:bg-gray-900"
              >
                Contact us
              </Button>
            </div>
          </div>

          {/* Feature Icons Row */}
          <div className="grid grid-cols-4 border-t border-b border-gray-800 py-8 mt-20">
            <div className="flex justify-center">
              <FileText className="w-8 h-8 text-[#74d1ea]" />
            </div>
            <div className="flex justify-center">
              <BarChart3 className="w-8 h-8 text-[#74d1ea]" />
            </div>
            <div className="flex justify-center">
              <Sparkles className="w-8 h-8 text-[#74d1ea]" />
            </div>
            <div className="flex justify-center">
              <ArrowRight className="w-8 h-8 text-[#74d1ea]" />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}