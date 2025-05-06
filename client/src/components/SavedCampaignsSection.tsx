import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { cleanContent } from '@/lib/utils';
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
  Trash2,
  Plus
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
  metadata?: string; // Added metadata field for campaign title, boilerplate, and objectives
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
  const [expandedContentIndex, setExpandedContentIndex] = useState<number | null>(null);
  
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

  // Filter content by selected type
  const getFilteredContents = (): CampaignContent[] => {
    const contents = getSelectedCampaignContents();
    if (activeContentType === 'all') return contents;
    return contents.filter(content => content.type === activeContentType);
  };

  // Helper to parse tone profile 
  const getToneProfile = () => {
    if (!selectedCampaign) return {};
    console.log('Tone profile type:', typeof selectedCampaign.tone_profile);
    console.log('Tone profile:', selectedCampaign.tone_profile);
    
    try {
      // Handle different formats of tone_profile
      if (typeof selectedCampaign.tone_profile === 'string') {
        // Try to parse the string as JSON
        try {
          return JSON.parse(selectedCampaign.tone_profile);
        } catch (parseError) {
          console.error('Error parsing tone profile string:', parseError);
          return {};
        }
      } else if (selectedCampaign.tone_profile && typeof selectedCampaign.tone_profile === 'object') {
        // It's already an object
        return selectedCampaign.tone_profile;
      }
      return {};
    } catch (e) {
      console.error('Error processing tone profile:', e);
      return {};
    }
  };
  
  // Helper to parse campaign metadata
  const getCampaignMetadata = () => {
    if (!selectedCampaign || !selectedCampaign.metadata) return null;
    console.log('Campaign metadata type:', typeof selectedCampaign.metadata);
    console.log('Campaign metadata:', selectedCampaign.metadata);
    
    try {
      // Handle different formats of metadata
      if (typeof selectedCampaign.metadata === 'string') {
        // Try to parse the string as JSON
        try {
          const metadata = JSON.parse(selectedCampaign.metadata);
          return metadata && typeof metadata === 'object' ? metadata : null;
        } catch (parseError) {
          console.error('Error parsing metadata string:', parseError);
          return null;
        }
      } else if (selectedCampaign.metadata && typeof selectedCampaign.metadata === 'object') {
        // It's already an object
        return selectedCampaign.metadata;
      }
      return null;
    } catch (e) {
      console.error('Error processing campaign metadata:', e);
      return null;
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
  
  // Toggle content expansion
  const toggleContentExpansion = (index: number) => {
    setExpandedContentIndex(expandedContentIndex === index ? null : index);
    
    // Find and scroll to the corresponding content item
    setTimeout(() => {
      const element = document.getElementById(`content-item-${index}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
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
                
                {/* Campaign Metadata Section */}
                {(() => {
                  const metadata = getCampaignMetadata();
                  if (!metadata) return null;
                  
                  return (
                    <div className="p-6 border border-gray-800 rounded-lg bg-zinc-900/30">
                      <h3 className="text-md font-medium text-white mb-3 flex items-center">
                        <span className="inline-block w-2 h-2 rounded-full bg-[#74d1ea] mr-2"></span>
                        Campaign Metadata
                      </h3>
                      
                      <div className="space-y-4">
                        {/* Campaign Title */}
                        {metadata.title && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-400 mb-1">Title</h4>
                            <p className="text-white text-sm bg-black/40 rounded-md px-3 py-2 border border-gray-800">
                              {metadata.title}
                            </p>
                          </div>
                        )}
                        
                        {/* Campaign Boilerplate */}
                        {metadata.boilerplate && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-400 mb-1">Boilerplate</h4>
                            <p className="text-gray-300 text-sm bg-black/40 rounded-md px-3 py-2 border border-gray-800">
                              {metadata.boilerplate}
                            </p>
                          </div>
                        )}
                        
                        {/* Campaign Objectives */}
                        {metadata.objectives && metadata.objectives.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-400 mb-1">Objectives</h4>
                            <ul className="list-disc pl-6 space-y-1 text-gray-300 text-sm bg-black/40 rounded-md px-3 py-2 border border-gray-800">
                              {metadata.objectives.map((objective, idx) => (
                                <li key={idx}>{objective}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()}
                
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
                  {/* Timeline Items */}
                  {getSelectedCampaignContents()
                    .sort((a, b) => 
                      new Date(a.deliveryDate || '').getTime() - new Date(b.deliveryDate || '').getTime()
                    )
                    .map((content, index) => (
                      <div key={index} className="pl-12 pb-8 relative">
                        {/* Date and node */}
                        <div className="absolute left-0 top-0">
                          <div className="absolute left-4 top-2 w-4 h-4 rounded-full border-2 border-[#74d1ea] bg-black z-10 -translate-x-1/2"></div>
                          <div className="absolute left-0 top-2 text-xs text-gray-400 w-[40px] text-right pr-6 -translate-y-1/2">
                            {content.deliveryDate ? new Date(content.deliveryDate).toLocaleDateString(undefined, {
                              day: 'numeric',
                              month: 'numeric'
                            }) : '-'}
                          </div>
                        </div>
                        
                        {/* Content card */}
                        <div className="bg-black border border-gray-800 rounded-lg p-4 hover:border-[#74d1ea]/50 transition-colors">
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
                            <div className="cursor-pointer" onClick={() => toggleContentExpansion(index)}>
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
                
                {/* Regular Content View */}
                <div className="mt-8 border-t border-gray-800 pt-6">
                  <h3 className="text-white font-medium mb-4 flex items-center">
                    <span className="inline-block w-2 h-2 rounded-full bg-[#5eead4] mr-2"></span>
                    All Content Items
                  </h3>
                  
                  <Tabs defaultValue="all" value={activeContentType} onValueChange={setActiveContentType}>
                    <TabsList className="bg-zinc-900/50 mb-4 p-1 border border-gray-800">
                      <TabsTrigger value="all" className="data-[state=active]:bg-[#0e131f] data-[state=active]:text-[#5eead4]">All</TabsTrigger>
                      <TabsTrigger value="email" className="data-[state=active]:bg-[#0e131f] data-[state=active]:text-[#5eead4]">Email</TabsTrigger>
                      <TabsTrigger value="social" className="data-[state=active]:bg-[#0e131f] data-[state=active]:text-[#5eead4]">Social</TabsTrigger>
                      <TabsTrigger value="blog" className="data-[state=active]:bg-[#0e131f] data-[state=active]:text-[#5eead4]">Blog</TabsTrigger>
                      <TabsTrigger value="webinar" className="data-[state=active]:bg-[#0e131f] data-[state=active]:text-[#5eead4]">Webinar</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value={activeContentType} className="mt-0">
                      <ScrollArea className="h-[400px] pr-4">
                        <div className="space-y-4">
                          {getFilteredContents().length > 0 ? (
                            getFilteredContents().map((content, index) => (
                              <div 
                                key={index}
                                id={`content-item-${index}`}
                                className="border border-gray-800 rounded-lg overflow-hidden bg-black shadow-lg"
                              >
                                {/* Content Header */}
                                <div className="p-4 border-b border-gray-800 bg-zinc-900/50">
                                  <div className="flex justify-between items-start">
                                    <div className="flex items-center">
                                      <div className="h-8 w-8 rounded-md bg-[#0e131f] border border-[#5eead4]/20 flex items-center justify-center mr-3 shadow-[0_0_10px_rgba(94,234,212,0.05)]">
                                        {contentTypeIcons[content.type] || <MessageSquare className="h-4 w-4 text-[#5eead4]" />}
                                      </div>
                                      <div>
                                        <h4 className="text-white font-medium">
                                          {content.title || `${content.type.charAt(0).toUpperCase() + content.type.slice(1)} Content`}
                                        </h4>
                                        <div className="flex items-center gap-3 mt-1">
                                          <span className="text-xs text-gray-400 flex items-center">
                                            <Users className="h-3 w-3 mr-1 text-gray-500" />
                                            {content.persona}
                                          </span>
                                          {content.deliveryDate && (
                                            <span className="text-xs text-gray-400 flex items-center">
                                              <Clock className="h-3 w-3 mr-1 text-gray-500" />
                                              {new Date(content.deliveryDate).toLocaleDateString()}
                                            </span>
                                          )}
                                          {content.channel && (
                                            <Badge variant="outline" className="bg-[#0e131f] text-[#5eead4] border-[#5eead4]/30 text-xs">
                                              {content.channel}
                                            </Badge>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                
                                {/* Content Body */}
                                <div className="p-5 text-sm text-gray-200 whitespace-pre-wrap bg-gradient-to-b from-zinc-900/10 to-black">
                                  {cleanContent(content.content)}
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-8 border border-dashed border-gray-800 rounded-lg">
                              <MessageSquare className="h-10 w-10 text-gray-600 mx-auto mb-2" />
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
    </>
  );
}