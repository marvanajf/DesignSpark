import { useState } from "react";
import { Helmet } from "react-helmet";
import { CampaignList } from "@/components/CampaignList";
import { CampaignOverview } from "@/components/CampaignOverview";
import Layout from "@/components/Layout";
import { Megaphone } from "lucide-react";
import { CampaignModal } from "@/components/CampaignModal";

export default function CampaignsPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

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
          
          {/* Campaign Management Promo Banner */}
          <div className="mb-8 bg-[#0a0c10] border border-gray-800/60 rounded-xl p-8 relative overflow-hidden shadow-[0_0_25px_rgba(116,209,234,0.05)]">
            <div className="absolute inset-0 bg-gradient-to-t from-[#0e1b33]/60 via-transparent to-transparent pointer-events-none"></div>
            
            <div className="relative z-10 flex items-start">
              <div className="mr-6 bg-[#0e131f] border border-[#74d1ea]/20 rounded-lg p-3 shadow-[0_0_15px_rgba(116,209,234,0.15)]">
                <Megaphone className="h-6 w-6 text-[#74d1ea]" />
              </div>
              
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-white mb-3">AI-Powered Campaign Management</h2>
                <p className="text-gray-300 mb-6 max-w-3xl">
                  Create and manage content campaigns for your marketing initiatives. Assign personas and tone analyses to maintain consistent messaging across your content.
                </p>
                
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="text-[#74d1ea] mr-3">✓</div>
                    <span className="text-gray-300">Organize content with strategic campaigns</span>
                  </div>
                  <div className="flex items-center">
                    <div className="text-[#74d1ea] mr-3">✓</div>
                    <span className="text-gray-300">Apply consistent personas and tone across campaign content</span>
                  </div>
                  <div className="flex items-center">
                    <div className="text-[#74d1ea] mr-3">✓</div>
                    <span className="text-gray-300">Streamline your marketing workflow with themed initiatives</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Campaign Overview (New Card-Based View) */}
          <div className="mb-8">
            <CampaignOverview onAddCampaign={() => setIsCreateModalOpen(true)} />
          </div>

          {/* Traditional Campaign List */}
          <div className="mt-12">
            <h2 className="text-xl font-semibold text-white mb-6">All Campaigns</h2>
            <CampaignList />
          </div>

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