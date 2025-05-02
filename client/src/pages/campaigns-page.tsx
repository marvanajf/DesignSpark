import { useState } from "react";
import { Helmet } from "react-helmet";
import { CampaignList } from "@/components/CampaignList";
import Layout from "@/components/Layout";
import FeatureBreadcrumbs from "@/components/FeatureBreadcrumbs";
import FeatureBanner from "@/components/FeatureBanner";
import { BookMarked } from "lucide-react";

export default function CampaignsPage() {
  const [pageTitle] = useState("Campaigns");
  const crumbs = [{ label: "Dashboard", href: "/" }, { label: "Campaigns", href: "/campaigns" }];
  
  return (
    <Layout>
      <Helmet>
        <title>{pageTitle} | Tovably</title>
      </Helmet>
      
      <div className="container py-6 space-y-6">
        <FeatureBreadcrumbs crumbs={crumbs} />
        
        <FeatureBanner
          title="Campaign Management"
          description="Create and manage content campaigns for your marketing initiatives. Assign personas and tone analyses to maintain consistent messaging."
          icon={<BookMarked className="h-6 w-6 text-[#74d1ea]" />}
        />
        
        <div className="mt-6">
          <CampaignList />
        </div>
      </div>
    </Layout>
  );
}