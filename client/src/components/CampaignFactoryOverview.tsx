import React, { useState, useEffect } from 'react';
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

// Separate component for content list to properly use React hooks
function ContentList({ contents }: { contents: CampaignContent[] }) {
  const [expandedContentIndex, setExpandedContentIndex] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      {contents.map((content, index) => (
        <div 
          key={index}
          id={`content-item-${index}`}
          className="p-3 border border-gray-800 rounded-lg bg-zinc-900/30 group hover:bg-zinc-900/70 transition-colors"
        >
          <div className="flex justify-between items-start">
            <div className="flex items-center">
              <div className="h-7 w-7 rounded-md bg-[#0e131f] border border-gray-800 flex items-center justify-center mr-3">
                {contentTypeIcons[content.type] || <MessageSquare className="h-4 w-4" />}
              </div>
              <div>
                <h4 
                  className="text-white text-sm hover:text-[#74d1ea] cursor-pointer flex items-center"
                  onClick={() => setExpandedContentIndex(expandedContentIndex === index ? null : index)}
                >
                  {content.title || `${content.type.charAt(0).toUpperCase() + content.type.slice(1)} Content`}
                  <span className="ml-1 text-xs">
                    {expandedContentIndex === index ? '▲' : '▼'}
                  </span>
                </h4>
                <div className="flex items-center">
                  <p className="text-xs text-gray-400">{content.persona}</p>
                  {content.deliveryDate && (
                    <span className="text-xs text-gray-400 ml-2 inline-flex items-center">
                      <Calendar className="h-3 w-3 mr-1 opacity-70" />
                      {new Date(content.deliveryDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <Badge variant="outline" className="bg-[#0e131f] text-[#74d1ea] border-[#74d1ea]/30 text-xs">
              {content.type}
            </Badge>
          </div>
          
          {expandedContentIndex === index && content.content && (
            <div className="mt-3 border-t border-gray-800 pt-3">
              <p className="text-sm text-gray-300 whitespace-pre-wrap">
                {content.content}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

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
  const parseContent = (jsonString: string | any) => {
    if (!jsonString) return [];
    
    // If it's already an array, return it
    if (Array.isArray(jsonString)) {
      return jsonString;
    }
    
    // If it's a string, try to parse it
    if (typeof jsonString === 'string') {
      try {
        const parsed = JSON.parse(jsonString);
        if (Array.isArray(parsed)) {
          return parsed;
        }
        return [];
      } catch (e) {
        console.error('Error parsing JSON:', e);
        return [];
      }
    }
    
    // Fallback: return empty array
    return [];
  };

  // Parse selected campaign contents
  const getSelectedCampaignContents = (): CampaignContent[] => {
    if (!selectedCampaign) return [];
    
    const contents = selectedCampaign.contents;
    console.log('Campaign contents type:', typeof contents);
    console.log('Campaign contents:', contents);
    
    return parseContent(contents);
  };

  // Helper to parse tone profile 
  const getToneProfile = () => {
    if (!selectedCampaign) return {};
    console.log('Tone profile type:', typeof selectedCampaign.tone_profile);
    console.log('Tone profile:', selectedCampaign.tone_profile);
    
    try {
      // Default fallback tone profile in case parsing fails
      const defaultToneProfile = {
        'professional': 80,
        'authoritative': 65,
        'friendly': 50,
        'direct': 75,
        'persuasive': 70
      };
      
      // Handle different formats of tone_profile
      if (typeof selectedCampaign.tone_profile === 'string') {
        // Try to parse the string as JSON
        try {
          const parsed = JSON.parse(selectedCampaign.tone_profile);
          return Object.keys(parsed).length > 0 ? parsed : defaultToneProfile;
        } catch (parseError) {
          console.error('Error parsing tone profile string:', parseError);
          return defaultToneProfile;
        }
      } else if (selectedCampaign.tone_profile && typeof selectedCampaign.tone_profile === 'object') {
        // It's already an object
        return Object.keys(selectedCampaign.tone_profile).length > 0 
          ? selectedCampaign.tone_profile 
          : defaultToneProfile;
      }
      return defaultToneProfile;
    } catch (e) {
      console.error('Error processing tone profile:', e);
      return {
        'professional': 80,
        'authoritative': 65,
        'friendly': 50,
        'direct': 75,
        'persuasive': 70
      };
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
        <DialogContent 
          className="max-w-4xl max-h-[80vh] overflow-y-auto bg-black border border-gray-800 shadow-[0_0_20px_rgba(116,209,234,0.1)]"
          aria-describedby="campaign-details-description"
        >
          <div id="campaign-details-description" className="sr-only">
            Campaign details showing all content, timeline, audience and tone profile
          </div>
          {/* Branding watermark */}
          <div className="absolute top-3 right-3 opacity-10 pointer-events-none">
            <div className="flex items-center">
              <Rocket className="h-6 w-6 text-[#74d1ea]" />
              <span className="text-xs font-bold ml-1 text-[#74d1ea]">Tovably Campaign Factory</span>
            </div>
          </div>
          <DialogHeader className="border-b border-gray-800 pb-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <DialogTitle className="text-xl text-white flex items-center group">
                  <input 
                    className="bg-transparent border-none outline-none focus:ring-0 text-xl font-semibold w-full group-hover:text-[#74d1ea] transition-colors" 
                    value={selectedCampaign?.name || ''}
                    onChange={(e) => {
                      if (selectedCampaign) {
                        setSelectedCampaign({
                          ...selectedCampaign,
                          name: e.target.value
                        });
                      }
                    }}
                  />
                  <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-xs text-gray-400">(click to edit)</span>
                  </span>
                </DialogTitle>
                <p className="text-gray-400 text-sm mt-1">
                  Created {selectedCampaign && getTimeAgo(selectedCampaign.created_at)}
                </p>
              </div>
            </div>
          </DialogHeader>
          
          {selectedCampaign && (
            <div className="space-y-6">
              {/* Campaign Overview Section */}
              <div className="grid grid-cols-1 gap-4">
                {/* Objective with nicer formatting */}
                <div className="p-6 border border-gray-800 rounded-lg bg-zinc-900/30">
                  <h3 className="text-md font-medium text-white mb-3 flex items-center">
                    <span className="inline-block w-2 h-2 rounded-full bg-[#74d1ea] mr-2"></span>
                    Campaign Objective
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed">{selectedCampaign.objective}</p>
                </div>
                
                {/* Timeline and channels in a single row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-6 border border-gray-800 rounded-lg bg-zinc-900/30">
                    <h3 className="text-md font-medium text-white mb-3 flex items-center">
                      <span className="inline-block w-2 h-2 rounded-full bg-[#74d1ea] mr-2"></span>
                      Timeline
                    </h3>
                    <div className="flex items-center">
                      <div className="bg-black/40 rounded-md px-3 py-2 border border-gray-800">
                        {new Date(selectedCampaign.timeline_start).toLocaleDateString()}
                      </div>
                      <div className="mx-3 text-gray-500">to</div>
                      <div className="bg-black/40 rounded-md px-3 py-2 border border-gray-800">
                        {new Date(selectedCampaign.timeline_end).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6 border border-gray-800 rounded-lg bg-zinc-900/30">
                    <h3 className="text-md font-medium text-white mb-3 flex items-center">
                      <span className="inline-block w-2 h-2 rounded-full bg-[#74d1ea] mr-2"></span>
                      Channels
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedCampaign.channels.map((channel, index) => (
                        <Badge 
                          key={index}
                          variant="outline"
                          className="bg-black/40 text-[#74d1ea] border-[#74d1ea]/30 text-xs px-3 py-1"
                        >
                          {channel}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Target Audience */}
              <div>
                <h3 className="text-white font-medium mb-4 flex items-center">
                  <span className="inline-block w-2 h-2 rounded-full bg-[#5eead4] mr-2"></span>
                  Target Audience
                </h3>
                <div className="p-5 border border-gray-800 rounded-lg bg-zinc-900/30">
                  <div className="flex flex-wrap gap-2">
                    {selectedCampaign.target_audience.map((audience, index) => (
                      <Badge 
                        key={index}
                        variant="outline"
                        className="bg-black/40 text-[#5eead4] border-[#5eead4]/30 text-xs px-3 py-1"
                      >
                        <Users className="h-3 w-3 mr-1.5" />
                        {audience}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Content Timeline Waterfall */}
              <div>
                <h3 className="text-white font-medium mb-4 flex items-center">
                  <span className="inline-block w-2 h-2 rounded-full bg-[#74d1ea] mr-2"></span>
                  Content Timeline
                </h3>
                <div className="relative mb-8">
                  {/* Timeline Line */}
                  <div className="absolute left-[40px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#74d1ea] to-transparent"></div>
                  
                  {/* Timeline Items */}
                  {getSelectedCampaignContents()
                    .sort((a, b) => 
                      new Date(a.deliveryDate || '').getTime() - new Date(b.deliveryDate || '').getTime()
                    )
                    .map((content, index) => (
                      <div key={index} className="flex mb-6 relative">
                        {/* Timeline Node */}
                        <div className="w-20 flex-shrink-0 text-center relative">
                          <div className="absolute left-10 top-0 w-4 h-4 bg-black border-2 border-[#74d1ea] rounded-full z-10"></div>
                          <div className="text-xs text-gray-400 absolute left-0 top-0">
                            {content.deliveryDate ? new Date(content.deliveryDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'Unscheduled'}
                          </div>
                        </div>
                        
                        {/* Content Card */}
                        <div className="bg-black border border-gray-800 rounded-lg p-4 ml-4 w-full hover:border-[#74d1ea]/50 transition-colors">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center mb-2">
                                <div className="h-5 w-5 rounded-md bg-[#0e131f] border border-gray-800 flex items-center justify-center mr-2">
                                  {contentTypeIcons[content.type] || <MessageSquare className="h-3 w-3" />}
                                </div>
                                <h4 className="text-white text-sm font-medium">{content.title}</h4>
                              </div>
                              <p className="text-xs text-gray-400 mb-2">{content.persona}</p>
                            </div>
                            <Badge variant="outline" className="bg-[#0e131f] text-[#74d1ea] border-[#74d1ea]/30 text-xs">
                              {content.type}
                            </Badge>
                          </div>
                          <div className="mt-2 overflow-hidden">
                            <div className="cursor-pointer" onClick={() => {
                              // Toggle expansion for this item in ContentList
                              const targetElement = document.getElementById(`content-item-${index}`);
                              if (targetElement) {
                                targetElement.click();
                              }
                            }}>
                              <p className="text-sm text-gray-300 line-clamp-2">
                                {content.content?.substring(0, 100)}...
                              </p>
                              <p className="text-[#74d1ea] text-xs mt-1">Click to view full content</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
                
                {/* Regular Content View */}
                <div className="mt-8 border-t border-gray-800 pt-6">
                  <h3 className="text-white font-medium mb-4">All Content Items</h3>
                  <ContentList contents={getSelectedCampaignContents()} />
                </div>
              </div>
              
              {/* Tone Profile */}
              <div>
                <h3 className="text-white font-medium mb-4 flex items-center">
                  <span className="inline-block w-2 h-2 rounded-full bg-[#74d1ea] mr-2"></span>
                  Tone Profile
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {Object.entries(getToneProfile()).map(([key, value]) => (
                    <div key={key} className="p-4 border border-gray-800 rounded-lg bg-zinc-900/30 relative overflow-hidden group hover:border-[#74d1ea]/30 transition-colors">
                      <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-[#74d1ea] to-[#5eead4]" style={{ width: `${value as number}%` }}></div>
                      <h4 className="text-xs text-gray-400 mb-1 capitalize">{key}</h4>
                      <div className="flex items-end justify-between">
                        <p className="text-white text-xl font-semibold">{value as number}<span className="text-xs text-gray-400 ml-0.5">%</span></p>
                        <div className="text-xs text-[#74d1ea] opacity-0 group-hover:opacity-100 transition-opacity">
                          {(value as number) >= 70 ? 'High' : (value as number) >= 40 ? 'Medium' : 'Low'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter className="border-t border-gray-800 pt-4 mt-2">
            <div className="flex w-full justify-between items-center">
              <div>
                {selectedCampaign && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-red-800/40 text-red-400 hover:bg-red-950/20 hover:text-red-300"
                    onClick={() => {
                      handleDeleteCampaign(selectedCampaign.id);
                      setIsDetailsModalOpen(false);
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Campaign
                  </Button>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-700 hover:bg-gray-900"
                  onClick={() => setIsDetailsModalOpen(false)}
                >
                  Close
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  className="bg-[#74d1ea] hover:bg-[#5db8d0] text-black shadow-[0_0_10px_rgba(116,209,234,0.2)]"
                  onClick={() => navigate('/campaign-factory')}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Campaign  
                </Button>
              </div>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}