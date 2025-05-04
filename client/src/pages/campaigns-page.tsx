import { useState } from "react";
import { Helmet } from "react-helmet";
import { CampaignList } from "@/components/CampaignList";
import { CampaignOverview } from "@/components/CampaignOverview";
import Layout from "@/components/Layout";
import { 
  Megaphone, 
  Rocket, 
  ArrowRight, 
  Users, 
  Zap, 
  Target, 
  Calendar,
  MessageSquare,
  Mail,
  Sparkles,
  FileText
} from "lucide-react";
import { CampaignModal } from "@/components/CampaignModal";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { SiLinkedin } from "react-icons/si";

export default function CampaignsPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [, navigate] = useLocation();

  return (
    <Layout showSidebar={true}>
      <Helmet>
        <title>Campaigns | Tovably</title>
      </Helmet>
      
      <div className="flex-1 overflow-y-auto bg-black">
        <div className="p-6">
          {/* Header Section with Breadcrumbs */}
          <div className="mb-6">
            <div className="flex justify-between items-center">
              <div>
                <div className="flex items-center text-sm text-gray-400">
                  <span>Tovably</span>
                  <span className="mx-2">›</span>
                  <span>Campaigns</span>
                </div>
                <h1 className="text-2xl font-semibold text-white mt-1">Campaigns</h1>
              </div>
            </div>
          </div>
          
          {/* Campaigns Promo Banner */}
          <div className="mb-8 bg-[#0a0c10] border border-gray-800/60 rounded-xl p-8 relative overflow-hidden shadow-[0_0_25px_rgba(116,209,234,0.05)]">
            <div className="absolute inset-0 bg-gradient-to-t from-[#0e1b33]/60 via-transparent to-transparent pointer-events-none"></div>
            
            <div className="relative z-10 flex items-start">
              <div className="mr-6 bg-[#0e131f] border border-[#74d1ea]/20 rounded-lg p-3 shadow-[0_0_15px_rgba(116,209,234,0.15)]">
                <Rocket className="h-6 w-6 text-[#74d1ea]" />
              </div>
              
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-white mb-3">Marketing Campaign Management</h2>
                <p className="text-gray-300 mb-6 max-w-3xl">
                  Create, organize, and execute multi-platform marketing campaigns with our powerful AI tools. Generate consistent messaging across different channels and track all your campaign assets in one place.
                </p>
                
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="text-[#74d1ea] mr-3">✓</div>
                    <span className="text-gray-300">Centralized management for all your marketing campaigns</span>
                  </div>
                  <div className="flex items-center">
                    <div className="text-[#74d1ea] mr-3">✓</div>
                    <span className="text-gray-300">Consistent messaging across emails, social posts, and ads</span>
                  </div>
                  <div className="flex items-center">
                    <div className="text-[#74d1ea] mr-3">✓</div>
                    <span className="text-gray-300">AI-powered content generation for each campaign element</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Create Full Campaign in Minutes section */}
          <div className="mb-8 bg-black border border-[#74d1ea]/20 rounded-xl overflow-hidden">
            <div className="p-5 border-b border-[#74d1ea]/10 bg-gradient-to-r from-[#0e131f] to-black">
              <h2 className="text-lg font-medium text-white flex items-center">
                <Sparkles className="h-5 w-5 mr-3 text-[#74d1ea]" />
                Create Full Campaign in Minutes with Campaign Factory
              </h2>
            </div>
            
            <div className="p-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
                <div className="bg-[#0e131f] rounded-lg p-4 border border-[#0e131f] hover:border-[#74d1ea]/20 transition-colors">
                  <div className="flex items-center mb-3">
                    <div className="mr-3 bg-black h-8 w-8 rounded-md flex items-center justify-center">
                      <MessageSquare className="h-4 w-4 text-[#74d1ea]" />
                    </div>
                    <div>
                      <p className="text-sm text-white font-medium">Step 1: Define Campaign</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400">
                    Specify your campaign goals, target audience, and key messages in one simple form.
                  </p>
                </div>
                
                <div className="bg-[#0e131f] rounded-lg p-4 border border-[#0e131f] hover:border-[#74d1ea]/20 transition-colors">
                  <div className="flex items-center mb-3">
                    <div className="mr-3 bg-black h-8 w-8 rounded-md flex items-center justify-center">
                      <Users className="h-4 w-4 text-[#74d1ea]" />
                    </div>
                    <div>
                      <p className="text-sm text-white font-medium">Step 2: Select Personas</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400">
                    Choose your target personas and our AI will customize content for each audience segment.
                  </p>
                </div>
                
                <div className="bg-[#0e131f] rounded-lg p-4 border border-[#0e131f] hover:border-[#74d1ea]/20 transition-colors">
                  <div className="flex items-center mb-3">
                    <div className="mr-3 bg-black h-8 w-8 rounded-md flex items-center justify-center">
                      <Zap className="h-4 w-4 text-[#74d1ea]" />
                    </div>
                    <div>
                      <p className="text-sm text-white font-medium">Step 3: Generate Assets</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400">
                    Get emails, social posts, and ads with consistent messaging across all channels.
                  </p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="flex space-x-3 mr-3">
                  <div className="h-7 w-7 rounded-md bg-[#0e131f] flex items-center justify-center">
                    <Mail className="h-3.5 w-3.5 text-[#74d1ea]" />
                  </div>
                  <div className="h-7 w-7 rounded-md bg-[#0e131f] flex items-center justify-center">
                    <SiLinkedin className="h-3.5 w-3.5 text-[#0A66C2]" />
                  </div>
                  <div className="h-7 w-7 rounded-md bg-[#0e131f] flex items-center justify-center">
                    <FileText className="h-3.5 w-3.5 text-[#74d1ea]" />
                  </div>
                </div>
                
                <span className="text-gray-400 text-sm mr-5">Generate all campaign assets in one go</span>
                
                <Button
                  onClick={() => navigate('/campaign-factory')}
                  className="bg-[#74d1ea] hover:bg-[#5db8d0] text-black"
                >
                  <Rocket className="h-4 w-4 mr-2" />
                  Launch Campaign Factory
                </Button>
              </div>
            </div>
          </div>
          
          {/* Campaign Overview (Card-Based View) */}
          <div className="mb-8">
            <CampaignOverview onAddCampaign={() => setIsCreateModalOpen(true)} />
          </div>
          
          {/* Hiding the Campaign List to avoid duplicate "No campaigns yet" message */}

          {/* Campaign Modal for creating new campaigns */}
          {isCreateModalOpen && (
            <CampaignModal 
              isOpen={isCreateModalOpen} 
              onClose={() => setIsCreateModalOpen(false)}
            />
          )}
        </div>
      </div>
    </Layout>
  );
}