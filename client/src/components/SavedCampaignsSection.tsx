import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { formatDistanceToNow } from 'date-fns';
import { 
  FileText, 
  Calendar, 
  MessageSquare,
  ExternalLink,
  Rocket, 
  Loader2, 
  Clock,
  Users,
  ArrowRight,
  Trash2
} from 'lucide-react';

// Content Type Icon Mapping
const contentTypeIcons: Record<string, React.ReactNode> = {
  email: <MessageSquare className="h-4 w-4" />,
  social: <ExternalLink className="h-4 w-4" />,
  blog: <FileText className="h-4 w-4" />,
  webinar: <Calendar className="h-4 w-4" />
};

export interface CampaignFactoryCampaign {
  id: number;
  name: string;
  description?: string;  // Added description field
  objective: string;
  target_audience: string[];
  channels: string[];
  timeline_start: string;
  timeline_end: string;
  created_at: string;
  contents: string;
  tone_profile: string;
  user_id: number;
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

export default function SavedCampaignsSection() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [selectedCampaign, setSelectedCampaign] = useState<CampaignFactoryCampaign | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [activeContentType, setActiveContentType] = useState<string>('all');
  
  // Fetch campaign factory campaigns
  const { 
    data: campaigns = [], 
    isLoading,
    error 
  } = useQuery<CampaignFactoryCampaign[]>({
    queryKey: ['/api/campaign-factory']
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
      
      // Close modal if open
      if (isDetailsModalOpen) {
        setIsDetailsModalOpen(false);
      }
    },
    onError: (error) => {
      toast({
        title: 'Error deleting campaign',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive'
      });
    }
  });

  // View campaign details
  const handleViewCampaignDetails = (campaign: CampaignFactoryCampaign) => {
    setSelectedCampaign(campaign);
    setIsDetailsModalOpen(true);
  };

  // Handle delete campaign
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

  // Filter content by selected type
  const getFilteredContents = (): CampaignContent[] => {
    const contents = getSelectedCampaignContents();
    if (activeContentType === 'all') return contents;
    return contents.filter(content => content.type === activeContentType);
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

  // Loading state
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card 
            key={i} 
            className="bg-black border border-gray-800/60 animate-pulse"
          >
            <CardHeader className="pb-3">
              <div className="h-6 bg-gray-800/60 rounded-md w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-800/40 rounded-md w-1/2"></div>
            </CardHeader>
            <CardContent className="pb-3">
              <div className="h-16 bg-gray-800/30 rounded-md mb-4"></div>
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="h-4 bg-gray-800/40 rounded-md"></div>
                <div className="h-4 bg-gray-800/40 rounded-md"></div>
              </div>
              <div className="flex gap-1">
                <div className="h-5 w-16 bg-gray-800/40 rounded-md"></div>
                <div className="h-5 w-16 bg-gray-800/40 rounded-md"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="border border-red-800/30 bg-red-900/10 rounded-xl p-6 text-center">
        <p className="text-red-400">
          Error loading campaigns: {error instanceof Error ? error.message : 'Unknown error'}
        </p>
      </div>
    );
  }

  // Empty state
  if (campaigns.length === 0) {
    return (
      <div className="border border-dashed border-gray-800 rounded-xl p-6 text-center">
        <Rocket className="h-12 w-12 text-gray-600 mx-auto mb-4" />
        <h3 className="text-white text-lg font-medium mb-2">No campaigns created yet</h3>
        <p className="text-gray-400 max-w-md mx-auto mb-6">
          Create your first AI-powered marketing campaign to see it displayed here
        </p>
        <Button
          className="bg-[#5eead4] hover:bg-[#4ed8c4] text-zinc-900 shadow-[0_0_10px_rgba(94,234,212,0.3)]"
          onClick={() => navigate('/campaign-factory')}
        >
          <Rocket className="h-4 w-4 mr-2" />
          Create Your First Campaign
        </Button>
      </div>
    );
  }

  // Campaigns grid
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {campaigns.slice(0, 6).map((campaign) => (
          <Card 
            key={campaign.id} 
            className="bg-black border border-gray-800/60 hover:shadow-[0_0_15px_rgba(94,234,212,0.05)] transition-all duration-300 cursor-pointer group"
            onClick={() => handleViewCampaignDetails(campaign)}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center space-x-3">
                <div className="bg-[#0e131f] border border-[#5eead4]/20 h-8 w-8 rounded-md flex items-center justify-center">
                  <Rocket className="h-4 w-4 text-[#5eead4]" />
                </div>
                <div>
                  <CardTitle className="text-white text-md line-clamp-1">{campaign.name}</CardTitle>
                  <p className="text-xs text-gray-400">
                    {getTimeAgo(campaign.created_at)}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="line-clamp-2 text-sm text-gray-300 mb-3">
                {campaign.description || campaign.objective}
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2 mb-3 text-xs text-gray-400">
                <div className="flex items-center">
                  <Calendar className="h-3 w-3 mr-1.5 text-[#5eead4]/70" />
                  <span>{getCampaignDuration(campaign)}</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-3 w-3 mr-1.5 text-[#5eead4]/70" />
                  <span>{campaign.target_audience.length} audience{campaign.target_audience.length !== 1 ? 's' : ''}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-1">
                {campaign.channels.slice(0, 3).map((channel, index) => (
                  <Badge 
                    key={index}
                    variant="outline"
                    className="bg-[#0e131f] text-[#5eead4] border-[#5eead4]/30 text-xs"
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
            </CardContent>
            <CardFooter className="pt-2">
              <div className="flex items-center text-[#5eead4] text-xs ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="mr-1">View Details</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      {campaigns.length > 6 && (
        <div className="mt-4 text-center">
          <Button
            variant="outline"
            className="text-[#5eead4] border-[#5eead4]/30 hover:bg-[#5eead4]/10"
            onClick={() => navigate('/campaign-factory/saved')}
          >
            View All {campaigns.length} Campaigns
          </Button>
        </div>
      )}

      {/* Campaign Details Modal */}
      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-black border border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-xl text-white">
              {selectedCampaign?.name}
            </DialogTitle>
            {selectedCampaign?.description && (
              <DialogDescription className="mt-2 text-gray-400">
                {selectedCampaign.description}
              </DialogDescription>
            )}
          </DialogHeader>
          
          {selectedCampaign && (
            <div className="space-y-6">
              {/* Campaign Overview Section - Horizontal Layout */}
              <div className="space-y-5">
                <div className="p-4 border border-gray-800 rounded-lg bg-zinc-900/30">
                  <div className="flex flex-col sm:flex-row gap-6">
                    <div className="flex-1">
                      <h3 className="text-sm text-gray-400 mb-2 font-medium">Objective</h3>
                      <p className="text-white text-sm">{selectedCampaign.objective}</p>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm text-gray-400 mb-2 font-medium">Timeline</h3>
                      <p className="text-white text-sm">
                        {new Date(selectedCampaign.timeline_start).toLocaleDateString()} to {new Date(selectedCampaign.timeline_end).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm text-gray-400 mb-2 font-medium">Channels</h3>
                      <div className="flex flex-wrap gap-1">
                        {selectedCampaign.channels.map((channel, index) => (
                          <Badge 
                            key={index}
                            variant="outline"
                            className="bg-[#0e131f] text-[#5eead4] border-[#5eead4]/30 text-xs"
                          >
                            {channel}
                          </Badge>
                        ))}
                      </div>
                    </div>
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
              
              {/* Content Overview */}
              <div>
                <h3 className="text-white font-medium mb-3">Generated Content</h3>
                
                <Tabs defaultValue="all" value={activeContentType} onValueChange={setActiveContentType}>
                  <TabsList className="bg-zinc-900/50 mb-4">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="email">Email</TabsTrigger>
                    <TabsTrigger value="social">Social</TabsTrigger>
                    <TabsTrigger value="blog">Blog</TabsTrigger>
                    <TabsTrigger value="webinar">Webinar</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value={activeContentType} className="mt-0">
                    <ScrollArea className="h-[400px] pr-4">
                      <div className="space-y-3">
                        {getFilteredContents().map((content, index) => (
                          <div 
                            key={index}
                            className="p-4 border border-gray-800 rounded-lg bg-zinc-900/30 group hover:bg-zinc-900/70 transition-colors"
                          >
                            <div className="flex justify-between items-start mb-2">
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
                                <div className="flex items-center text-xs text-gray-400">
                                  <Clock className="h-3 w-3 mr-1" />
                                  <span>
                                    {new Date(content.deliveryDate).toLocaleDateString()}
                                  </span>
                                </div>
                              )}
                            </div>
                            
                            <div className="mt-3 text-sm text-gray-200 whitespace-pre-wrap">
                              {content.content}
                            </div>
                          </div>
                        ))}
                        
                        {getFilteredContents().length === 0 && (
                          <div className="text-center py-6 border border-dashed border-gray-800 rounded-lg">
                            <p className="text-gray-400">
                              No {activeContentType !== 'all' ? activeContentType : ''} content found in this campaign
                            </p>
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  </TabsContent>
                </Tabs>
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
                }}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Campaign
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}