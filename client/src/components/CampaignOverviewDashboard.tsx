import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Plus, PenLine, ArrowRight, BarChart3, Loader2 } from "lucide-react";

export function CampaignOverviewDashboard() {
  const { 
    data: campaigns,
    isLoading,
    error
  } = useQuery({
    queryKey: ['/api/campaigns'],
  });

  // Find active campaigns 
  const activeCampaigns = campaigns?.filter((campaign: any) => 
    campaign.status === 'active' || campaign.status === 'running'
  ) || [];

  // Show only 5 campaigns
  const displayedCampaigns = activeCampaigns.slice(0, 5);

  const statusColors: Record<string, { color: string, bgColor: string }> = {
    'draft': { color: '#8b8b8b', bgColor: '#282828' },
    'planning': { color: '#74d1ea', bgColor: '#2a3e45' },
    'active': { color: '#74d1ea', bgColor: '#2a3e45' },
    'running': { color: '#4caf50', bgColor: '#2d3b2d' },
    'completed': { color: '#8bc34a', bgColor: '#2d3b2d' },
    'archived': { color: '#9e9e9e', bgColor: '#282828' }
  };

  // Helper function to get a display name for campaign status
  const getStatusDisplay = (status: string): string => {
    const statusMap: Record<string, string> = {
      'draft': 'Draft',
      'planning': 'Planning',
      'active': 'Active',
      'running': 'Running',
      'completed': 'Completed',
      'archived': 'Archived'
    };
    return statusMap[status] || status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <Card className="border-[#1a1e29] shadow-lg bg-black">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-xl font-bold">
            Active Campaigns
          </CardTitle>
          <CardDescription>
            Your currently active and running campaigns
          </CardDescription>
        </div>
        <Link href="/campaigns">
          <Button variant="outline" className="gap-1" size="sm">
            <BarChart3 className="h-4 w-4" /> Manage Campaigns
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <Skeleton className="h-10 w-10 rounded" />
                <div className="space-y-1 flex-1">
                  <Skeleton className="h-4 w-4/5" />
                  <Skeleton className="h-3 w-3/5" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-6 text-muted-foreground">
            Error loading campaigns
          </div>
        ) : campaigns?.length === 0 ? (
          <div className="text-center py-8 space-y-3">
            <BarChart3 className="h-10 w-10 mx-auto text-muted-foreground" />
            <div className="text-lg font-medium">No campaigns created yet</div>
            <p className="text-sm text-muted-foreground max-w-xs mx-auto">
              Create campaigns to organize and track your marketing efforts.
            </p>
            <Button 
              asChild
              className="mt-2 gap-1"
              style={{ backgroundColor: "#74d1ea", color: "black" }}
            >
              <Link href="/campaigns/new">
                <Plus className="h-4 w-4" /> Create Campaign
              </Link>
            </Button>
          </div>
        ) : activeCampaigns.length === 0 ? (
          <div className="text-center py-8 space-y-3">
            <BarChart3 className="h-10 w-10 mx-auto text-muted-foreground" />
            <div className="text-lg font-medium">No active campaigns</div>
            <p className="text-sm text-muted-foreground max-w-xs mx-auto">
              All your campaigns are currently in draft, planning, completed, or archived states.
            </p>
            <Button 
              asChild
              variant="outline"
              className="mt-2 gap-1"
            >
              <Link href="/campaigns">
                <PenLine className="h-4 w-4" /> View All Campaigns
              </Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {displayedCampaigns.map((campaign: any) => (
              <div 
                key={campaign.id} 
                className="flex items-start p-3 rounded-lg border border-[#1a1e29] bg-black hover:bg-[#0a0a0a] transition-colors"
              >
                <div className="mr-3 h-10 w-10 rounded bg-black border border-[#1a1e29] flex items-center justify-center text-[#74d1ea]">
                  <BarChart3 className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium truncate">{campaign.name}</h4>
                    <Badge 
                      variant="outline" 
                      style={{
                        color: statusColors[campaign.status]?.color || '#74d1ea',
                        backgroundColor: statusColors[campaign.status]?.bgColor || '#1a1e29',
                        borderColor: statusColors[campaign.status]?.color || '#74d1ea',
                      }}
                      className="ml-2 whitespace-nowrap"
                    >
                      {getStatusDisplay(campaign.status)}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                    {campaign.description || 'No description'}
                  </p>
                  <div className="flex items-center mt-2 gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <span className="font-medium">Contents:</span>
                      <span>{campaign.content_count || 0}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-medium">Created:</span>
                      <span>{new Date(campaign.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {campaigns?.length > 0 && (
              <Button
                variant="ghost"
                className="w-full text-[#74d1ea] justify-between mt-2"
                asChild
              >
                <Link href="/campaigns">
                  View all {campaigns.length} campaigns
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}