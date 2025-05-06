import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Rocket, 
  Plus, 
  MoreVertical, 
  ExternalLink, 
  Trash2,
  Calendar,
  Users, 
  MessageSquare
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow } from 'date-fns';

// Interface for Campaign Factory campaigns
export interface CampaignFactoryCampaign {
  id: number;
  user_id: number;
  name: string;
  objective: string;
  target_audience: string[];
  channels: string[];
  timeline_start: string;
  timeline_end: string;
  contents: string; // JSON stringified content array
  tone_profile: string; // JSON stringified tone profile
  created_at: string;
}

// Interface for the parsed content of a campaign
interface CampaignContent {
  id: number;
  type: 'email' | 'social' | 'blog' | 'webinar';
  title: string;
  content: string;
  persona: string;
  deliveryDate?: string;
  channel?: string;
}

// Content Type Icon Mapping
const contentTypeIcons: Record<string, React.ReactNode> = {
  email: <MessageSquare className="h-4 w-4" />,
  social: <ExternalLink className="h-4 w-4" />,
  blog: <MessageSquare className="h-4 w-4" />,
  webinar: <Calendar className="h-4 w-4" />
};

export function CampaignFactoryOverview() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [selectedCampaign, setSelectedCampaign] = useState<CampaignFactoryCampaign | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  
  // Fetch campaign factory campaigns
  const { 
    data: campaigns = [], 
    isLoading,
    error 
  } = useQuery<CampaignFactoryCampaign[]>({
    queryKey: ['/api/campaign-factory'],
    enabled: !!user
  });

  // Delete campaign mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/campaign-factory/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/campaign-factory'] });
      toast({
        title: 'Campaign deleted',
        description: 'The campaign has been successfully deleted'
      });
    },
    onError: (error) => {
      toast({
        title: 'Error deleting campaign',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive'
      });
    }
  });

  // Handle opening the campaign details modal
  const handleViewCampaignDetails = (campaign: CampaignFactoryCampaign) => {
    setSelectedCampaign(campaign);
    setIsDetailsModalOpen(true);
  };

  // Handle deleting a campaign
  const handleDeleteCampaign = (id: number) => {
    if (confirm('Are you sure you want to delete this campaign? This action cannot be undone.')) {
      deleteMutation.mutate(id);
    }
  };

  // Parse stringified JSON content safely
  const parseContent = (jsonString: string) => {
    try {
      return JSON.parse(jsonString);
    } catch (e) {
      console.error('Error parsing JSON:', e);
      return [];
    }
  };

  // Parse selected campaign contents
  const getSelectedCampaignContents = (): CampaignContent[] => {
    if (!selectedCampaign) return [];
    return parseContent(selectedCampaign.contents);
  };

  // Helper to parse tone profile
  const getToneProfile = () => {
    if (!selectedCampaign) return {};
    try {
      return JSON.parse(selectedCampaign.tone_profile);
    } catch (e) {
      console.error('Error parsing tone profile:', e);
      return {};
    }
  };

  // Get time ago string
  const getTimeAgo = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (e) {
      return 'some time ago';
    }
  };

  // Calculate campaign duration
  const getCampaignDuration = (campaign: CampaignFactoryCampaign) => {
    try {
      const startDate = new Date(campaign.timeline_start);
      const endDate = new Date(campaign.timeline_end);
      
      // Calculate difference in weeks 
      const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const diffWeeks = Math.ceil(diffDays / 7);
      
      return `${diffWeeks} week${diffWeeks !== 1 ? 's' : ''}`;
    } catch (e) {
      return 'Unknown duration';
    }
  };

  // If loading, show skeleton
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">
            <Skeleton className="h-6 w-40" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  // If error, show error state
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Campaign Factory</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">Error loading campaigns. Please try again later.</p>
        </CardContent>
      </Card>
    );
  }

  // Display either campaigns or empty state
  return (
    <Card className="shadow-sm border-gray-800/60 bg-black">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl text-white">Campaign Factory</CardTitle>
          <Button 
            className="bg-[#74d1ea] hover:bg-[#5db8d0] text-black shadow-[0_0_10px_rgba(116,209,234,0.3)]"
            onClick={() => navigate('/campaign-factory')}
          >
            <Plus className="h-4 w-4 mr-2" />
            New Campaign
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {campaigns.length > 0 ? (
          <div className="space-y-4">
            {campaigns.slice(0, 3).map((campaign) => (
              <div
                key={campaign.id}
                className="p-4 border border-gray-800/60 rounded-lg bg-zinc-900/30 hover:bg-zinc-900/50 transition-colors group"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center">
                    <div className="mr-3 bg-[#0e131f] border border-[#74d1ea]/30 h-8 w-8 rounded-md flex items-center justify-center">
                      <Rocket className="h-4 w-4 text-[#74d1ea]" />
                    </div>
                    <div>
                      <h3 className="text-white font-medium">{campaign.name}</h3>
                      <p className="text-xs text-gray-400">{getTimeAgo(campaign.created_at)}</p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem 
                        onClick={() => handleViewCampaignDetails(campaign)}
                        className="cursor-pointer"
                      >
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDeleteCampaign(campaign.id)}
                        className="cursor-pointer text-red-500"
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="mt-3">
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="flex items-center text-xs text-gray-300">
                      <Calendar className="h-3 w-3 mr-1 text-[#74d1ea]/70" />
                      <span>Duration: {getCampaignDuration(campaign)}</span>
                    </div>
                    <div className="flex items-center text-xs text-gray-300">
                      <Users className="h-3 w-3 mr-1 text-[#74d1ea]/70" />
                      <span>Audience: {campaign.target_audience.length}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-1">
                  {campaign.channels.slice(0, 3).map((channel, index) => (
                    <Badge 
                      key={index}
                      variant="outline"
                      className="bg-[#0e131f] text-[#74d1ea] border-[#74d1ea]/30 text-xs"
                    >
                      {channel}
                    </Badge>
                  ))}
                  {campaign.channels.length > 3 && (
                    <Badge 
                      variant="outline"
                      className="bg-[#0e131f] text-gray-400 border-gray-700 text-xs"
                    >
                      +{campaign.channels.length - 3}
                    </Badge>
                  )}
                </div>
                <div className="mt-3">
                  <Button
                    variant="link"
                    className="text-[#74d1ea] p-0 h-auto text-xs font-normal"
                    onClick={() => handleViewCampaignDetails(campaign)}
                  >
                    View Campaign Details →
                  </Button>
                </div>
              </div>
            ))}
            
            {campaigns.length > 3 && (
              <Button 
                variant="outline" 
                className="w-full text-[#74d1ea] border-[#74d1ea]/30 hover:bg-[#74d1ea]/10"
                onClick={() => navigate('/campaign-factory/saved')}
              >
                View All ({campaigns.length}) Campaigns
              </Button>
            )}
          </div>
        ) : (
          <div className="text-center py-8 border border-dashed border-gray-800 rounded-lg">
            <Rocket className="h-10 w-10 text-gray-600 mx-auto mb-4" />
            <h3 className="text-white font-medium mb-2">No campaigns created yet</h3>
            <p className="text-gray-400 text-sm mb-4">
              Create your first AI-powered marketing campaign with Campaign Factory
            </p>
            <Button 
              className="bg-[#74d1ea] hover:bg-[#5db8d0] text-black shadow-[0_0_10px_rgba(116,209,234,0.3)]"
              onClick={() => navigate('/campaign-factory')}
            >
              <Rocket className="h-4 w-4 mr-2" />
              Launch Campaign Factory
            </Button>
          </div>
        )}
      </CardContent>

      {/* Campaign Details Modal */}
      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-black border border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-xl text-white">
              {selectedCampaign?.name}
            </DialogTitle>
          </DialogHeader>
          
          {selectedCampaign && (
            <div className="space-y-6">
              {/* Campaign Overview Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border border-gray-800 rounded-lg bg-zinc-900/30">
                  <h3 className="text-sm text-gray-400 mb-2">Objective</h3>
                  <p className="text-white text-sm">{selectedCampaign.objective}</p>
                </div>
                <div className="p-4 border border-gray-800 rounded-lg bg-zinc-900/30">
                  <h3 className="text-sm text-gray-400 mb-2">Timeline</h3>
                  <p className="text-white text-sm">
                    {new Date(selectedCampaign.timeline_start).toLocaleDateString()} to {new Date(selectedCampaign.timeline_end).toLocaleDateString()}
                  </p>
                </div>
                <div className="p-4 border border-gray-800 rounded-lg bg-zinc-900/30">
                  <h3 className="text-sm text-gray-400 mb-2">Channels</h3>
                  <div className="flex flex-wrap gap-1">
                    {selectedCampaign.channels.map((channel, index) => (
                      <Badge 
                        key={index}
                        variant="outline"
                        className="bg-[#0e131f] text-[#74d1ea] border-[#74d1ea]/30 text-xs"
                      >
                        {channel}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Target Audience */}
              <div>
                <h3 className="text-white font-medium mb-2">Target Audience</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedCampaign.target_audience.map((audience, index) => (
                    <Badge 
                      key={index}
                      variant="outline"
                      className="bg-[#5eead4]/10 text-[#5eead4] border-[#5eead4]/30"
                    >
                      {audience}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {/* Content Overview */}
              <div>
                <h3 className="text-white font-medium mb-2">Generated Content</h3>
                <div className="space-y-3">
                  {getSelectedCampaignContents().map((content, index) => (
                    <div 
                      key={index}
                      className="p-3 border border-gray-800 rounded-lg bg-zinc-900/30 group hover:bg-zinc-900/70 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-center">
                          <div className="h-7 w-7 rounded-md bg-[#0e131f] border border-gray-800 flex items-center justify-center mr-3">
                            {contentTypeIcons[content.type] || <MessageSquare className="h-4 w-4" />}
                          </div>
                          <div>
                            <h4 className="text-white text-sm">{content.title || `${content.type.charAt(0).toUpperCase() + content.type.slice(1)} Content`}</h4>
                            <p className="text-xs text-gray-400">{content.persona}</p>
                          </div>
                        </div>
                        {content.deliveryDate && (
                          <span className="text-xs text-gray-400">
                            {new Date(content.deliveryDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Tone Profile */}
              <div>
                <h3 className="text-white font-medium mb-2">Tone Profile</h3>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {Object.entries(getToneProfile()).map(([key, value]) => (
                    <div key={key} className="p-3 border border-gray-800 rounded-lg bg-zinc-900/30">
                      <h4 className="text-xs text-gray-400 mb-1 capitalize">{key}</h4>
                      <p className="text-white text-sm">{value as number}%</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDetailsModalOpen(false)}
            >
              Close
            </Button>
            {selectedCampaign && (
              <Button
                variant="destructive"
                onClick={() => {
                  handleDeleteCampaign(selectedCampaign.id);
                  setIsDetailsModalOpen(false);
                }}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Campaign
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}