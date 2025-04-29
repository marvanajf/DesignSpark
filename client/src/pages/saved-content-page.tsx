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
          
          {/* Summary Section */}
          <div className="mb-8">
            <div className="group relative bg-[#0a0c10] border border-gray-800/60 rounded-xl overflow-hidden transition-all duration-300 shadow-[0_0_25px_rgba(116,209,234,0.05)]">
              <div className="absolute inset-0 bg-gradient-to-t from-[#74d1ea]/5 via-transparent to-transparent pointer-events-none opacity-50"></div>
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="bg-[#0e131f] border border-[#74d1ea]/20 rounded-lg p-2.5 shadow-[0_0_15px_rgba(116,209,234,0.15)]">
                    <FileText className="h-5 w-5 text-[#74d1ea]" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-white">Content Library</h3>
                    <p className="text-sm text-gray-400">View, edit, and manage all your generated content</p>
                  </div>
                </div>
                
                <div className="text-sm text-gray-300">
                  <p className="mb-2">
                    Your generated LinkedIn posts and cold emails are saved here for quick access. 
                    You can easily copy, edit, or download content for use in your marketing campaigns.
                  </p>
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
