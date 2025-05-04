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
          
          {/* Campaign Overview (Card-Based View) */}
          <div className="mb-8">
            <CampaignOverview onAddCampaign={() => setIsCreateModalOpen(true)} />
          </div>

          {/* Campaign List */}
          <div className="mt-6">
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