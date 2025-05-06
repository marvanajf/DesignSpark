import React from 'react';
import Layout from '@/components/Layout';
import SavedCampaignsSection from '@/components/SavedCampaignsSection';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import { ArrowLeft, Plus } from 'lucide-react';

export default function CampaignFactorySavedPage() {
  const [, navigate] = useLocation();

  return (
    <Layout>
      <div className="container mx-auto mt-6 max-w-7xl">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              className="mr-4"
              onClick={() => navigate('/campaign-factory')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Campaign Factory
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-white">Your Saved Campaigns</h1>
              <p className="text-gray-400 text-sm">
                View and manage your AI-generated marketing campaigns
              </p>
            </div>
          </div>
          <Button
            onClick={() => navigate('/campaign-factory')}
            className="bg-[#5eead4] hover:bg-[#4ed8c4] text-zinc-900 shadow-[0_0_10px_rgba(94,234,212,0.3)]"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create New Campaign
          </Button>
        </div>

        <div className="space-y-8">
          <SavedCampaignsSection />
        </div>
      </div>
    </Layout>
  );
}