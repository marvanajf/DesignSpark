import { useQuery } from "@tanstack/react-query";
import { Campaign } from "@shared/schema";
import { useLocation } from "wouter";
import { CampaignList } from "@/components/CampaignList";
import { Button } from "@/components/ui/button";
import { Briefcase, FileSpreadsheet } from "lucide-react";

export default function CampaignsPage() {
  const [, navigate] = useLocation();
  const { data: campaigns, isLoading } = useQuery<Campaign[]>({
    queryKey: ["/api/campaigns"],
    staleTime: 1000 * 60, // 1 minute
  });

  return (
    <div className="container py-6">
      {/* Header section with breadcrumb */}
      <div className="mb-6">
        <nav className="flex mb-4" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <span className="inline-flex items-center text-sm font-medium text-muted-foreground">
                <Briefcase className="w-4 h-4 mr-2" />
                Dashboard
              </span>
            </li>
            <li>
              <div className="flex items-center">
                <span className="mx-2 text-muted-foreground">/</span>
                <span className="text-sm font-medium">Campaigns</span>
              </div>
            </li>
          </ol>
        </nav>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Campaigns</h1>
            <p className="text-muted-foreground mt-1">
              Create and manage your marketing campaigns
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => navigate("/saved-content")}
          >
            <FileSpreadsheet className="h-4 w-4" />
            View All Content
          </Button>
        </div>
      </div>

      {/* Feature Banner */}
      <div className="relative mb-8 overflow-hidden rounded-lg border border-[#1a1e29] bg-gradient-to-r from-[#0f1219] to-[#131a2a] p-8">
        <div className="relative z-10 max-w-3xl">
          <h2 className="text-2xl font-bold mb-2">Organize Your Marketing Campaigns</h2>
          <p className="text-muted-foreground mb-6">
            Group related content together, associate personas and tone analyses with campaigns, 
            and keep your marketing assets organized.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-lg bg-[#0e1015]/50 p-4 backdrop-blur-sm">
              <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-[#1a1e29]">
                <svg
                  className="h-5 w-5 text-[#74d1ea]"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <h3 className="font-medium">Organize Content</h3>
              <p className="text-sm text-muted-foreground">
                Group related marketing assets into campaigns for better organization
              </p>
            </div>
            <div className="rounded-lg bg-[#0e1015]/50 p-4 backdrop-blur-sm">
              <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-[#1a1e29]">
                <svg
                  className="h-5 w-5 text-[#74d1ea]"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="font-medium">Associate Personas</h3>
              <p className="text-sm text-muted-foreground">
                Link personas to campaigns for consistent audience targeting
              </p>
            </div>
            <div className="rounded-lg bg-[#0e1015]/50 p-4 backdrop-blur-sm">
              <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-[#1a1e29]">
                <svg
                  className="h-5 w-5 text-[#74d1ea]"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="font-medium">Apply Tone Analysis</h3>
              <p className="text-sm text-muted-foreground">
                Ensure consistent tone and voice across campaign materials
              </p>
            </div>
          </div>
        </div>
        <div
          className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#172242]/20 via-transparent to-transparent"
          aria-hidden="true"
        />
      </div>

      {/* Campaign management section */}
      <div className="p-6 rounded-xl border border-[#1a1e29] bg-[#0e1015]">
        <CampaignList />
      </div>
    </div>
  );
}