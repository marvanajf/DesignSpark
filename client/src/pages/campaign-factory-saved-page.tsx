import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { 
  Loader2, 
  Rocket, 
  Calendar, 
  Search, 
  Users, 
  MoreVertical, 
  Trash2,
  ChevronRight
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { formatDistanceToNow } from 'date-fns';
import Layout from '@/components/Layout';
import { CampaignFactoryCampaign } from '@/components/CampaignFactoryOverview';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare, ExternalLink } from 'lucide-react';

// Content Type Icon Mapping
const contentTypeIcons: Record<string, React.ReactNode> = {
  email: <MessageSquare className="h-4 w-4" />,
  social: <ExternalLink className="h-4 w-4" />,
  blog: <MessageSquare className="h-4 w-4" />,
  webinar: <Calendar className="h-4 w-4" />
};

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

export default function CampaignFactorySavedPage() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCampaign, setSelectedCampaign] = useState<CampaignFactoryCampaign | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [activeContentType, setActiveContentType] = useState<string>('all');
  
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

  // Handle search filtering
  const filteredCampaigns = campaigns.filter(campaign => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      campaign.name.toLowerCase().includes(query) ||
      campaign.objective.toLowerCase().includes(query) ||
      campaign.target_audience.some(audience => audience.toLowerCase().includes(query)) ||
      campaign.channels.some(channel => channel.toLowerCase().includes(query))
    );
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

  if (isLoading) {
    return (
      <Layout showSidebar={true}>
        <div className="flex justify-center items-center h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-[#74d1ea]" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout showSidebar={true}>
      <div className="flex-1 overflow-y-auto bg-black min-h-screen">
        <div className="p-6">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center text-sm text-gray-400 mb-1">
              <span>Tovably</span>
              <ChevronRight className="h-3 w-3 mx-1" />
              <span>Premium Features</span>
              <ChevronRight className="h-3 w-3 mx-1" />
              <span className="text-[#74d1ea]">Saved Campaigns</span>
            </div>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-semibold text-white">Saved Campaign Factory Campaigns</h1>
                <p className="text-gray-400 text-sm mt-1">
                  View, manage and repurpose your AI-generated marketing campaigns
                </p>
              </div>
              <Button 
                className="bg-[#74d1ea] hover:bg-[#5db8d0] text-black shadow-[0_0_10px_rgba(116,209,234,0.3)]"
                onClick={() => navigate('/campaign-factory')}
              >
                <Rocket className="h-4 w-4 mr-2" />
                Create New Campaign
              </Button>
            </div>
          </div>
          
          {/* Search and filter */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
              <Input
                className="pl-10 bg-zinc-900 border-gray-800 text-white"
                placeholder="Search campaigns by name, objective, audience, or channel..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          {/* Campaign List */}
          {filteredCampaigns.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredCampaigns.map((campaign) => (
                <Card 
                  key={campaign.id} 
                  className="bg-black border border-gray-800/60 hover:shadow-[0_0_15px_rgba(116,209,234,0.1)] transition-all duration-300 cursor-pointer"
                  onClick={() => handleViewCampaignDetails(campaign)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        <div className="mr-3 bg-[#0e131f] border border-[#74d1ea]/30 h-8 w-8 rounded-md flex items-center justify-center">
                          <Rocket className="h-4 w-4 text-[#74d1ea]" />
                        </div>
                        <div>
                          <CardTitle className="text-lg text-white">{campaign.name}</CardTitle>
                          <CardDescription className="text-xs text-gray-400">
                            {getTimeAgo(campaign.created_at)}
                          </CardDescription>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewCampaignDetails(campaign);
                            }}
                            className="cursor-pointer"
                          >
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteCampaign(campaign.id);
                            }}
                            className="cursor-pointer text-red-500"
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="text-sm text-gray-300 mb-3 h-10 overflow-hidden">
                      {campaign.objective}
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-2 mb-3">
                      <div className="flex items-center text-xs text-gray-300">
                        <Calendar className="h-3 w-3 mr-1 text-[#74d1ea]/70" />
                        <span>Duration: {getCampaignDuration(campaign)}</span>
                      </div>
                      <div className="flex items-center text-xs text-gray-300">
                        <Users className="h-3 w-3 mr-1 text-[#74d1ea]/70" />
                        <span>Audience: {campaign.target_audience.length}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
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
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant="link"
                      className="text-[#74d1ea] p-0 h-auto text-xs font-normal"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewCampaignDetails(campaign);
                      }}
                    >
                      View Campaign Details →
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 px-6 border border-dashed border-gray-700 rounded-xl">
              <Rocket className="h-12 w-12 text-gray-500 mx-auto mb-4" />
              <h3 className="text-white text-xl font-medium mb-2">
                {searchQuery ? 'No matching campaigns found' : 'No campaigns created yet'}
              </h3>
              <p className="text-gray-400 max-w-md mx-auto mb-6">
                {searchQuery 
                  ? 'Try adjusting your search query or clearing the search filter'
                  : 'Create your first AI-powered marketing campaign with Campaign Factory to get started'}
              </p>
              {searchQuery ? (
                <Button 
                  variant="outline" 
                  className="border-gray-700 text-white"
                  onClick={() => setSearchQuery('')}
                >
                  Clear Search
                </Button>
              ) : (
                <Button 
                  className="bg-[#74d1ea] hover:bg-[#5db8d0] text-black shadow-[0_0_10px_rgba(116,209,234,0.3)]"
                  onClick={() => navigate('/campaign-factory')}
                >
                  <Rocket className="h-4 w-4 mr-2" />
                  Launch Campaign Factory
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

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
                              <span className="text-xs text-gray-400">
                                {new Date(content.deliveryDate).toLocaleDateString()}
                              </span>
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
    </Layout>
  );
}