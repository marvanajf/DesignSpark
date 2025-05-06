import React, { useState, useEffect } from 'react';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, FileText, MessageSquare, Link as LinkIcon, Zap, Clock, ArrowRight } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

// Define Campaign types
interface Campaign {
  id: number;
  name: string;
  description: string;
  status: string;
  content_count: number;
  created_at: string;
}

interface CampaignContent {
  id: number;
  type: 'email' | 'social' | 'blog' | 'webinar';
  title: string;
  content: string;
  persona: string;
  deliveryDate?: string;
  channel?: string;
}

interface CampaignDetail {
  id: number;
  name: string;
  objective: string;
  targetAudience: string[];
  channels: string[];
  timeline: {
    start: string;
    end: string;
  };
  contents: CampaignContent[];
  toneProfile: {
    professional: number;
    conversational: number;
    persuasive: number;
    educational: number;
    enthusiastic: number;
  };
}

export function CampaignTimelineDashboard() {
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>("");
  const [campaignData, setCampaignData] = useState<CampaignDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Use typed query to get all campaigns
  const { 
    data: campaigns = [],
    isLoading: campaignsLoading,
    error: campaignsError
  } = useQuery<Campaign[]>({
    queryKey: ['/api/campaigns'],
  });

  // Fetch campaign factory campaigns
  const { 
    data: factoryCampaigns = [],
    isLoading: factoryCampaignsLoading,
    error: factoryCampaignsError
  } = useQuery<CampaignDetail[]>({
    queryKey: ['/api/campaign-factory-campaigns'],
  });

  // Combine all campaign options
  const allCampaignOptions = [
    ...factoryCampaigns.map(c => ({ id: `factory-${c.id}`, name: c.name })),
    ...campaigns.map(c => ({ id: `standard-${c.id}`, name: c.name }))
  ];

  // Effect to fetch campaign data when selection changes
  useEffect(() => {
    if (!selectedCampaignId) return;

    const fetchCampaignData = async () => {
      setIsLoading(true);
      try {
        if (selectedCampaignId.startsWith('factory-')) {
          const id = selectedCampaignId.replace('factory-', '');
          const response = await apiRequest('GET', `/api/campaign-factory/${id}`);
          const data = await response.json();
          setCampaignData(data);
        } else {
          // For standard campaigns - might need different API route
          const id = selectedCampaignId.replace('standard-', '');
          const response = await apiRequest('GET', `/api/campaigns/${id}`);
          const data = await response.json();
          setCampaignData(data);
        }
      } catch (error) {
        console.error("Error fetching campaign data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCampaignData();
  }, [selectedCampaignId]);

  // Helper function to get icon based on content type
  const getIconForContentType = (type: string) => {
    switch(type) {
      case 'email':
        return <MessageSquare className="h-4 w-4 text-[#5eead4]" />;
      case 'social':
        return <LinkIcon className="h-4 w-4 text-[#5eead4]" />;
      case 'blog':
        return <FileText className="h-4 w-4 text-[#5eead4]" />;
      case 'webinar':
        return <Zap className="h-4 w-4 text-[#5eead4]" />;
      default:
        return <FileText className="h-4 w-4 text-[#5eead4]" />;
    }
  };

  // Loading state for the entire component
  const isComponentLoading = campaignsLoading || factoryCampaignsLoading;

  return (
    <Card className="border-[#1a1e29] shadow-lg bg-black">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-xl font-bold">
            Campaign Timeline
          </CardTitle>
          <CardDescription>
            Visualize your content delivery schedule
          </CardDescription>
        </div>
        <Link href="/campaign-factory">
          <Button variant="outline" className="gap-1" size="sm">
            <Calendar className="h-4 w-4" /> Create Campaign
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {isComponentLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-10 w-full rounded" />
            <Skeleton className="h-40 w-full rounded" />
          </div>
        ) : allCampaignOptions.length === 0 ? (
          <div className="text-center py-8 space-y-3">
            <Calendar className="h-10 w-10 mx-auto text-muted-foreground" />
            <div className="text-lg font-medium">No campaigns available</div>
            <p className="text-sm text-muted-foreground max-w-xs mx-auto">
              Create a campaign first to visualize your content timeline.
            </p>
            <Button 
              asChild
              className="mt-2 gap-1"
              style={{ backgroundColor: "#74d1ea", color: "black" }}
            >
              <Link href="/campaign-factory">
                <Calendar className="h-4 w-4" /> Create Campaign
              </Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Select
                value={selectedCampaignId}
                onValueChange={setSelectedCampaignId}
              >
                <SelectTrigger className="bg-black border-[#1a1e29]">
                  <SelectValue placeholder="Select a campaign" />
                </SelectTrigger>
                <SelectContent className="bg-[#0e131f] border-[#1a1e29]">
                  {allCampaignOptions.map((campaign) => (
                    <SelectItem key={campaign.id} value={campaign.id}>
                      {campaign.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {isLoading ? (
              <Skeleton className="h-40 w-full rounded" />
            ) : selectedCampaignId && campaignData ? (
              <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-800">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between text-sm text-white mb-4">
                    <div>
                      <span className="text-gray-500">Start:</span> {campaignData.timeline?.start || 'N/A'}
                    </div>
                    <div>
                      <span className="text-gray-500">End:</span> {campaignData.timeline?.end || 'N/A'}
                    </div>
                  </div>
                  
                  {/* Campaign Waterfall Chart */}
                  <div className="campaign-waterfall mt-4 overflow-x-auto">
                    <div className="relative min-h-[150px] pb-6">
                      {/* Timeline base */}
                      <div className="absolute left-0 right-0 h-1 bg-zinc-800 top-[50%]"></div>
                      
                      {/* Timeline nodes with content preview */}
                      {campaignData.contents?.map((content, i) => {
                        // Calculate positions based on delivery date
                        // For demo, we'll spread them evenly
                        const positionPercent = (i / (campaignData.contents.length - 1 || 1)) * 100;
                        const isEven = i % 2 === 0;
                        
                        // Get icon based on content type
                        const icon = getIconForContentType(content.type);
                        
                        return (
                          <div 
                            key={i}
                            className="absolute transform -translate-x-1/2"
                            style={{ left: `${positionPercent}%`, top: isEven ? '5px' : 'auto', bottom: isEven ? 'auto' : '5px' }}
                          >
                            {/* Vertical line to node */}
                            <div 
                              className={`w-[2px] bg-[#5eead4]/50 absolute left-1/2 -translate-x-1/2 ${isEven ? 'top-0 h-[50px]' : 'bottom-0 h-[50px]'}`}
                            ></div>
                            
                            {/* Node */}
                            <div 
                              className="h-4 w-4 rounded-full bg-[#5eead4] absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 z-10"
                            ></div>
                            
                            {/* Content card */}
                            <div 
                              className={`w-[180px] bg-zinc-800 border border-zinc-700 rounded-md p-2 absolute left-1/2 -translate-x-1/2 ${
                                isEven ? 'top-[60px]' : 'bottom-[60px]'
                              }`}
                            >
                              <div className="flex items-center gap-1 mb-1">
                                {icon}
                                <span className="text-xs font-medium capitalize text-white">{content.type}</span>
                              </div>
                              <div className="text-xs text-gray-400 truncate">
                                {content.title || (content.type === 'email' ? 'Email Campaign' : 
                                  content.type === 'social' ? 'LinkedIn Post' : 
                                  content.type === 'blog' ? 'Blog Article' : 'Webinar')}
                              </div>
                              <div className="text-xs text-[#5eead4] mt-1">
                                {content.deliveryDate || 'Delivery TBD'}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                Select a campaign to view its timeline
              </div>
            )}

            <Button
              variant="ghost"
              className="w-full text-[#74d1ea] justify-between mt-2"
              asChild
            >
              <Link href="/campaign-factory">
                Manage all campaigns
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}