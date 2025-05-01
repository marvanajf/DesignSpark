import Layout from "@/components/Layout";
import SavedContentList from "@/components/SavedContentList";
import { FileText } from "lucide-react";

export default function SavedContentPage() {
  return (
    <Layout showSidebar={true}>
      <div className="flex-1 overflow-y-auto bg-black">
        <div className="p-6">
          {/* Header Section with Breadcrumbs */}
          <div className="mb-6">
            <div className="flex justify-between items-center">
              <div>
                <div className="flex items-center text-sm text-gray-400">
                  <span>Tovably</span>
                  <span className="mx-2">›</span>
                  <span>Saved Content</span>
                </div>
                <h1 className="text-2xl font-semibold text-white mt-1">Saved Content</h1>
              </div>
            </div>
          </div>
          
          {/* Content Management Promo Banner - matched with content-generator page */}
          <div className="mb-8 bg-[#0a0c10] border border-gray-800/60 rounded-xl p-8 relative overflow-hidden shadow-[0_0_25px_rgba(116,209,234,0.05)]">
            <div className="absolute inset-0 bg-gradient-to-t from-[#0e1b33]/60 via-transparent to-transparent pointer-events-none"></div>
            
            <div className="relative z-10 flex items-start">
              <div className="mr-6 bg-[#0e131f] border border-[#74d1ea]/20 rounded-lg p-3 shadow-[0_0_15px_rgba(116,209,234,0.15)]">
                <FileText className="h-6 w-6 text-[#74d1ea]" />
              </div>
              
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-white mb-3">AI-Powered Content Management</h2>
                <p className="text-gray-300 mb-6 max-w-3xl">
                  View, edit, and organize your generated content. Group related pieces into campaigns for better 
                  workflow management or access individual content items directly.
                </p>
                
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="text-[#74d1ea] mr-3">✓</div>
                    <span className="text-gray-300">Categorize content into campaigns for organized access</span>
                  </div>
                  <div className="flex items-center">
                    <div className="text-[#74d1ea] mr-3">✓</div>
                    <span className="text-gray-300">Easy content management with one-click copying</span>
                  </div>
                  <div className="flex items-center">
                    <div className="text-[#74d1ea] mr-3">✓</div>
                    <span className="text-gray-300">Create themed campaigns for specific marketing initiatives</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <SavedContentList />
        </div>
      </div>
    </Layout>
  );
}
