import { Button } from "@/components/ui/button";
import { useState } from "react";
import { SubscriptionLimitModal } from "@/components/SubscriptionLimitModal";
import { Layout } from "@/components/Layout";

export default function ModalPreviewPage() {
  const [showPersonasModal, setShowPersonasModal] = useState(false);
  const [showToneAnalysisModal, setShowToneAnalysisModal] = useState(false);
  const [showContentGenerationModal, setShowContentGenerationModal] = useState(false);
  const [showCampaignsModal, setShowCampaignsModal] = useState(false);

  return (
    <Layout>
      <div className="container py-10 space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-4">Subscription Limit Modal Preview</h1>
          <p className="text-muted-foreground mb-6">
            Click on the buttons below to preview different subscription limit modals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-6 border rounded-xl bg-[#0e1015] hover:bg-[#181c25] transition-colors duration-200">
            <h2 className="text-xl font-bold mb-3">Personas Limit</h2>
            <p className="text-muted-foreground mb-4">
              Preview the modal shown when a user reaches their personas limit.
            </p>
            <Button 
              onClick={() => setShowPersonasModal(true)}
              style={{ backgroundColor: "#74d1ea", color: "black" }}
            >
              Show Personas Modal
            </Button>
          </div>

          <div className="p-6 border rounded-xl bg-[#0e1015] hover:bg-[#181c25] transition-colors duration-200">
            <h2 className="text-xl font-bold mb-3">Tone Analysis Limit</h2>
            <p className="text-muted-foreground mb-4">
              Preview the modal shown when a user reaches their tone analysis limit.
            </p>
            <Button 
              onClick={() => setShowToneAnalysisModal(true)}
              style={{ backgroundColor: "#74d1ea", color: "black" }}
            >
              Show Tone Analysis Modal
            </Button>
          </div>

          <div className="p-6 border rounded-xl bg-[#0e1015] hover:bg-[#181c25] transition-colors duration-200">
            <h2 className="text-xl font-bold mb-3">Content Generation Limit</h2>
            <p className="text-muted-foreground mb-4">
              Preview the modal shown when a user reaches their content generation limit.
            </p>
            <Button 
              onClick={() => setShowContentGenerationModal(true)}
              style={{ backgroundColor: "#74d1ea", color: "black" }}
            >
              Show Content Generation Modal
            </Button>
          </div>

          <div className="p-6 border rounded-xl bg-[#0e1015] hover:bg-[#181c25] transition-colors duration-200">
            <h2 className="text-xl font-bold mb-3">Campaigns Limit</h2>
            <p className="text-muted-foreground mb-4">
              Preview the modal shown when a user reaches their campaigns limit.
            </p>
            <Button 
              onClick={() => setShowCampaignsModal(true)}
              style={{ backgroundColor: "#74d1ea", color: "black" }}
            >
              Show Campaigns Modal
            </Button>
          </div>
        </div>

        {/* Subscription Limit Modals */}
        {showPersonasModal && (
          <SubscriptionLimitModal
            isOpen={showPersonasModal}
            onClose={() => setShowPersonasModal(false)}
            limitType="personas"
            currentUsage={5}
            limit={5}
            currentPlan="starter"
          />
        )}

        {showToneAnalysisModal && (
          <SubscriptionLimitModal
            isOpen={showToneAnalysisModal}
            onClose={() => setShowToneAnalysisModal(false)}
            limitType="toneAnalyses"
            currentUsage={5}
            limit={5}
            currentPlan="starter"
          />
        )}

        {showContentGenerationModal && (
          <SubscriptionLimitModal
            isOpen={showContentGenerationModal}
            onClose={() => setShowContentGenerationModal(false)}
            limitType="contentGeneration"
            currentUsage={10}
            limit={10}
            currentPlan="starter"
          />
        )}

        {showCampaignsModal && (
          <SubscriptionLimitModal
            isOpen={showCampaignsModal}
            onClose={() => setShowCampaignsModal(false)}
            limitType="campaigns"
            currentUsage={2}
            limit={2}
            currentPlan="starter"
          />
        )}
      </div>
    </Layout>
  );
}