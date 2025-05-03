import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Campaign } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CampaignModal } from "@/components/CampaignModal"; 
import { 
  Calendar, 
  CalendarDays, 
  Users, 
  FileText, 
  Share2, 
  ChevronRight,
  Edit2,
  PlusCircle
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CampaignOverviewProps {
  onAddCampaign?: () => void;
}

export function CampaignOverview({ onAddCampaign }: CampaignOverviewProps) {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();
  const [selectedCampaignId, setSelectedCampaignId] = useState<number | null>(null);
  
  // Get all campaigns for the user
  const { data: campaigns, isLoading } = useQuery<Campaign[]>({
    queryKey: ["/api/campaigns"],
    staleTime: 1000 * 60, // 1 minute
  });

  // Function to get status badge based on campaign status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-[#4CAF50] hover:bg-[#4CAF50] text-white">Active</Badge>;
      case 'draft':
        return <Badge className="bg-slate-600 hover:bg-slate-600 text-white">Draft</Badge>;
      case 'planning':
        return <Badge className="bg-[#2196F3] hover:bg-[#2196F3] text-white">Planning</Badge>;
      case 'running':
        return <Badge className="bg-[#4CAF50] hover:bg-[#4CAF50] text-white">Running</Badge>;
      case 'completed':
        return <Badge className="bg-[#9C27B0] hover:bg-[#9C27B0] text-white">Completed</Badge>;
      case 'archived':
        return <Badge className="bg-[#795548] hover:bg-[#795548] text-white">Archived</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Update campaign status
  const updateCampaignStatusMutation = useMutation({
    mutationFn: async ({ id, status, statusDisplay }: { id: number; status: string; statusDisplay: string }) => {
      const res = await apiRequest("PATCH", `/api/campaigns/${id}`, { 
        status, 
        status_display: statusDisplay 
      });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/campaigns"] });
      toast({
        title: "Status updated",
        description: "Campaign status has been updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to update status",
        description: error.message || "An error occurred",
        variant: "destructive",
      });
    },
  });

  const handleStatusChange = (campaign: Campaign, newStatus: string, statusDisplay: string) => {
    updateCampaignStatusMutation.mutateAsync({
      id: campaign.id,
      status: newStatus,
      statusDisplay
    });
  };

  // Format date range
  const formatDateRange = (startDate?: Date | string | null, endDate?: Date | string | null) => {
    if (!startDate && !endDate) return "No dates set";
    
    const formatDate = (date: Date | string | null | undefined) => {
      if (!date) return "";
      const d = new Date(date);
      return `${d.toLocaleString('default', { month: 'short' })} ${d.getFullYear()}`;
    };
    
    if (startDate && endDate) {
      return `${formatDate(startDate)} - ${formatDate(endDate)}`;
    } else if (startDate) {
      return `From ${formatDate(startDate)}`;
    } else {
      return `Until ${formatDate(endDate)}`;
    }
  };

  const getStatusDotColor = (status: string) => {
    switch (status) {
      case 'running':
        return "bg-[#4CAF50]";
      case 'planning':
        return "bg-[#2196F3]";
      case 'active': 
        return "bg-[#4CAF50]";
      case 'draft':
        return "bg-slate-500";
      case 'completed':
        return "bg-[#9C27B0]";
      case 'archived':
        return "bg-[#795548]";
      default:
        return "bg-gray-400";
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-6">
        <div className="animate-spin w-8 h-8 border-4 border-[#74d1ea] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!campaigns || campaigns.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <div className="rounded-full bg-[#181c25] p-4">
          <Calendar className="h-8 w-8 text-[#74d1ea]" />
        </div>
        <h2 className="text-xl font-bold">No campaigns yet</h2>
        <p className="text-muted-foreground text-center max-w-md">
          Create your first campaign to organize your content for different marketing initiatives
        </p>
        <Button 
          onClick={onAddCampaign} 
          className="gap-1"
          style={{ backgroundColor: "#74d1ea", color: "black" }}
        >
          Create Your First Campaign
        </Button>
      </div>
    );
  }

  // Get active campaigns first (limit to 5)
  const activeCampaigns = campaigns
    .filter(campaign => campaign.status === 'active')
    .slice(0, 5);
  
  // Get remaining campaigns if there are fewer than 5 active campaigns
  const displayedCampaigns = activeCampaigns.length < 5 
    ? [...activeCampaigns, ...campaigns.filter(campaign => campaign.status !== 'active').slice(0, 5 - activeCampaigns.length)]
    : activeCampaigns;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-white mb-4">Campaign Management</h2>
      
      {displayedCampaigns.map((campaign) => (
        <div key={campaign.id} className="bg-black border border-gray-800 rounded-lg p-5 hover:border-gray-700 transition-colors">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-medium text-white mb-4">{campaign.name}</h3>
            <div>
              {getStatusBadge(campaign.status)}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-2">
            <div>
              <div className="text-sm text-gray-500 mb-1">Timeframe</div>
              <div className="text-white flex items-center">
                <CalendarDays className="h-4 w-4 mr-2 text-[#74d1ea]" />
                {formatDateRange(campaign.start_date, campaign.end_date)}
              </div>
            </div>
            
            <div>
              <div className="text-sm text-gray-500 mb-1">Status</div>
              <div className="text-white flex items-center">
                <div className={`h-2.5 w-2.5 rounded-full ${getStatusDotColor(campaign.status)} mr-2`}></div>
                {campaign.status_display || campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
              </div>
            </div>
            
            <div className="md:flex md:gap-8">
              <div className="mb-2 md:mb-0">
                <div className="text-sm text-gray-500 mb-1">Personas</div>
                <div className="text-white flex items-center">
                  <Users className="h-4 w-4 mr-2 text-[#74d1ea]" />
                  {campaign.personas_count || "0"}
                </div>
              </div>
              
              <div className="mb-2 md:mb-0">
                <div className="text-sm text-gray-500 mb-1">Content</div>
                <div className="text-white flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-[#74d1ea]" />
                  {campaign.content_count || "0"}
                </div>
              </div>
              
              <div>
                <div className="text-sm text-gray-500 mb-1">Channels</div>
                <div className="text-white flex items-center">
                  <Share2 className="h-4 w-4 mr-2 text-[#74d1ea]" />
                  {campaign.channels_count || "0"}
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 flex justify-between items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="text-sm">
                  <Edit2 className="h-3.5 w-3.5 mr-1" />
                  Change Status
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Set Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleStatusChange(campaign, 'draft', 'Draft')}>
                  <div className="h-2 w-2 rounded-full bg-slate-500 mr-2"></div>
                  Draft
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange(campaign, 'planning', 'Planning')}>
                  <div className="h-2 w-2 rounded-full bg-[#2196F3] mr-2"></div>
                  Planning
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange(campaign, 'active', 'Active')}>
                  <div className="h-2 w-2 rounded-full bg-[#4CAF50] mr-2"></div>
                  Active
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange(campaign, 'running', 'Running')}>
                  <div className="h-2 w-2 rounded-full bg-[#4CAF50] mr-2"></div>
                  Running
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange(campaign, 'completed', 'Completed')}>
                  <div className="h-2 w-2 rounded-full bg-[#9C27B0] mr-2"></div>
                  Completed
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange(campaign, 'archived', 'Archived')}>
                  <div className="h-2 w-2 rounded-full bg-[#795548] mr-2"></div>
                  Archived
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button
              variant="ghost"
              size="sm"
              className="text-[#74d1ea] hover:bg-[#0a0a0a] hover:text-[#74d1ea]"
              onClick={() => setSelectedCampaignId(campaign.id)}
            >
              View Details
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
      
      {/* View Details Modal */}
      {selectedCampaignId && (
        <CampaignModal 
          isOpen={true} 
          onClose={() => setSelectedCampaignId(null)}
          campaignId={selectedCampaignId}
          mode="view"
        />
      )}
      
      {/* Show message if more campaigns are available */}
      {campaigns.length > 5 && (
        <div className="mt-4 text-center">
          <Button
            variant="link"
            className="text-[#74d1ea]"
            onClick={() => navigate('/campaigns')}
          >
            View All Campaigns ({campaigns.length})
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}