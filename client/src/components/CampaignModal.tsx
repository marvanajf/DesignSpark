import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Persona, ToneAnalysis } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { 
  Loader2, Plus, Search, FileText, User, BarChart, Trash2, Rocket, Zap, Mail, 
  Sparkles, LineChart, ArrowRight, Calendar, Clock, Settings, BarChart2, 
  PenTool, Target, MessageSquare, Share2, ListChecks, ChevronDown, Pencil
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { SiLinkedin } from "react-icons/si";
import SavedContentListItem from "./SavedContentListItem";
import { SubscriptionLimitModal } from "@/components/SubscriptionLimitModal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CampaignModalProps {
  campaignId?: number;
  isOpen: boolean;
  onClose: () => void;
  mode?: 'create' | 'edit' | 'view';
}

export function CampaignModal({ campaignId, isOpen, onClose, mode = 'create' }: CampaignModalProps) {
  const [isAddContentDialogOpen, setIsAddContentDialogOpen] = useState(false);
  const [selectedContentIds, setSelectedContentIds] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState("content");
  const [selectedPersonaId, setSelectedPersonaId] = useState<number | null>(null);
  const [selectedToneAnalysisId, setSelectedToneAnalysisId] = useState<number | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [campaignStatus, setCampaignStatus] = useState<string>("draft");
  const [activeCampaignTab, setActiveCampaignTab] = useState("overview");
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Subscription limit modal state
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [limitData, setLimitData] = useState<{
    limitType: "campaigns";
    currentUsage: number;
    limit: number;
    currentPlan: string;
  } | null>(null);

  // Get campaign details
  const { data: campaign, isLoading: isLoadingCampaign } = useQuery({
    queryKey: [`/api/campaigns/${campaignId}`],
    queryFn: getQueryFn({ onError: () => {} }),
    enabled: !!campaignId,
  });

  // Get campaign contents
  const { data: campaignContents, isLoading: isLoadingContents } = useQuery({
    queryKey: [`/api/campaigns/${campaignId}/contents`],
    queryFn: getQueryFn({ onError: () => {} }),
    enabled: !!campaignId,
  });

  // Get all contents for adding to campaign
  const { data: allContents, isLoading: isLoadingAllContents } = useQuery({
    queryKey: ["/api/content"],
    queryFn: getQueryFn({ onError: () => {} }),
    enabled: isAddContentDialogOpen,
  });
  
  // Get all personas
  const { data: personas, isLoading: isLoadingPersonas } = useQuery<Persona[]>({
    queryKey: ["/api/personas"],
    queryFn: getQueryFn({ onError: () => {} }),
    enabled: activeTab === "persona" || !!campaign?.persona_id,
  });
  
  // Get all tone analyses
  const { data: toneAnalyses, isLoading: isLoadingToneAnalyses } = useQuery<ToneAnalysis[]>({
    queryKey: ["/api/tone-analyses"],
    queryFn: getQueryFn({ onError: () => {} }),
    enabled: activeTab === "tone" || !!campaign?.tone_analysis_id,
  });

  // Add content to campaign mutation
  const batchAddContentMutation = useMutation({
    mutationFn: async (contentIds: number[]) => {
      try {
        // Create an array of promises that add each content one by one
        const promises = contentIds.map(async contentId => {
          const res = await fetch("/api/campaign-contents", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              campaign_id: campaignId,
              content_id: contentId
            }),
            credentials: "include"
          });
          
          // Check if we hit a subscription limit (402 Payment Required)
          if (res.status === 402) {
            const limitData = await res.json();
            throw { 
              isLimitError: true, 
              limitData: {
                limitType: "campaigns" as const,
                currentUsage: limitData.current || limitData.currentUsage, 
                limit: limitData.limit,
                currentPlan: user?.subscription_plan || "free" 
              }
            };
          }
          
          // Check for other errors
          if (!res.ok) {
            const errorText = await res.text();
            try {
              const errorJson = JSON.parse(errorText);
              throw new Error(errorJson.error || errorJson.message || "An error occurred");
            } catch (e) {
              throw new Error(errorText || res.statusText || "An error occurred");
            }
          }
          
          return await res.json();
        });
        
        // Wait for all promises to complete
        return await Promise.all(promises);
      } catch (error: any) {
        // If it's a limit error, rethrow it to be handled in onError
        if (error?.isLimitError) {
          throw error;
        }
        throw new Error(error.message || "Failed to add content to campaign");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/campaigns/${campaignId}/contents`] });
      setSelectedContentIds([]);
      setIsAddContentDialogOpen(false);
    },
    onError: (error: any) => {
      // Check if this was a subscription limit error
      if (error?.isLimitError && error?.limitData) {
        setLimitData(error.limitData);
        setShowLimitModal(true);
        setIsAddContentDialogOpen(false);
      }
    },
  });

  // Remove content from campaign mutation
  const removeContentMutation = useMutation({
    mutationFn: async (contentId: number) => {
      try {
        const res = await fetch(`/api/campaign-contents/${campaignId}/${contentId}`, {
          method: "DELETE",
          credentials: "include"
        });
        
        // Check if we hit a subscription limit (402 Payment Required)
        if (res.status === 402) {
          const limitData = await res.json();
          throw { 
            isLimitError: true, 
            limitData: {
              limitType: "campaigns" as const,
              currentUsage: limitData.current || limitData.currentUsage, 
              limit: limitData.limit,
              currentPlan: user?.subscription_plan || "free" 
            }
          };
        }
        
        // Check for other errors
        if (!res.ok) {
          const errorText = await res.text();
          try {
            const errorJson = JSON.parse(errorText);
            throw new Error(errorJson.error || errorJson.message || "An error occurred");
          } catch (e) {
            throw new Error(errorText || res.statusText || "An error occurred");
          }
        }
        
        return;
      } catch (error: any) {
        // If it's a limit error, rethrow it to be handled in onError
        if (error?.isLimitError) {
          throw error;
        }
        throw new Error(error.message || "Failed to remove content from campaign");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/campaigns/${campaignId}/contents`] });
    },
    onError: (error: any) => {
      // Check if this was a subscription limit error
      if (error?.isLimitError && error?.limitData) {
        setLimitData(error.limitData);
        setShowLimitModal(true);
        return;
      }
      
      toast({
        title: "Failed to remove content",
        description: error.message || "An error occurred",
        variant: "destructive",
      });
    }
  });
  
  // Update campaign mutation for persona or tone analysis
  const updateCampaignMutation = useMutation({
    mutationFn: async ({ 
      campaignId, 
      personaId, 
      toneAnalysisId 
    }: { 
      campaignId: number; 
      personaId?: number | null; 
      toneAnalysisId?: number | null; 
    }) => {
      try {
        const updateData: any = {};
        
        if (personaId !== undefined) {
          updateData.persona_id = personaId;
        }
        
        if (toneAnalysisId !== undefined) {
          updateData.tone_analysis_id = toneAnalysisId;
        }
        
        const res = await fetch(`/api/campaigns/${campaignId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updateData),
          credentials: "include"
        });
        
        // Check if we hit a subscription limit (402 Payment Required)
        if (res.status === 402) {
          const limitData = await res.json();
          throw { 
            isLimitError: true, 
            limitData: {
              limitType: "campaigns" as const,
              currentUsage: limitData.current || limitData.currentUsage, 
              limit: limitData.limit,
              currentPlan: user?.subscription_plan || "free" 
            }
          };
        }
        
        // Check for other errors
        if (!res.ok) {
          const errorText = await res.text();
          try {
            const errorJson = JSON.parse(errorText);
            throw new Error(errorJson.error || errorJson.message || "An error occurred");
          } catch (e) {
            throw new Error(errorText || res.statusText || "An error occurred");
          }
        }
        
        return await res.json();
      } catch (error: any) {
        // If it's a limit error, rethrow it to be handled in onError
        if (error?.isLimitError) {
          throw error;
        }
        throw new Error(error.message || "Failed to update campaign");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/campaigns/${campaignId}`] });
      toast({
        title: "Campaign updated",
        description: "The campaign associations have been updated successfully",
      });
    },
    onError: (error: any) => {
      // Check if this was a subscription limit error
      if (error?.isLimitError && error?.limitData) {
        setLimitData(error.limitData);
        setShowLimitModal(true);
        return;
      }
      
      toast({
        title: "Update failed",
        description: error.message || "Failed to update campaign",
        variant: "destructive",
      });
    },
  });

  const handleAddSelectedContent = async () => {
    if (selectedContentIds.length > 0) {
      await batchAddContentMutation.mutateAsync(selectedContentIds);
    }
  };

  const handleRemoveContent = async (contentId: number) => {
    await removeContentMutation.mutateAsync(contentId);
  };

  const handleContentSelect = (contentId: number, isSelected: boolean) => {
    if (isSelected) {
      setSelectedContentIds(prev => [...prev, contentId]);
    } else {
      setSelectedContentIds(prev => prev.filter(id => id !== contentId));
    }
  };

  const handleUpdateCampaign = async (
    campaignId: number,
    personaId?: number | null,
    toneAnalysisId?: number | null
  ) => {
    await updateCampaignMutation.mutateAsync({ campaignId, personaId, toneAnalysisId });
  };

  // Helper function to get fetch function with error handling
  function getQueryFn({ onError }: { onError: (error: Error) => void }) {
    return async ({ queryKey }: { queryKey: string[] }) => {
      try {
        const [url] = queryKey;
        const res = await apiRequest("GET", url);
        if (!res.ok) {
          throw new Error(`API error: ${res.status}`);
        }
        return await res.json();
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        onError(error);
        throw error;
      }
    };
  }

  // Filter available contents (not already in campaign)
  const availableContents = allContents?.filter((content: any) => {
    // Filter out content already in the campaign
    return !campaignContents?.some((cc: any) => cc.id === content.id);
  }) || [];

  // Reset selected content when dialog closes
  useEffect(() => {
    if (!isAddContentDialogOpen) {
      setSelectedContentIds([]);
    }
  }, [isAddContentDialogOpen]);

  // Delete campaign mutation
  const deleteCampaignMutation = useMutation({
    mutationFn: async (campaignId: number) => {
      try {
        const res = await fetch(`/api/campaigns/${campaignId}`, {
          method: "DELETE",
          credentials: "include"
        });
        
        // Check for errors
        if (!res.ok) {
          const errorText = await res.text();
          try {
            const errorJson = JSON.parse(errorText);
            throw new Error(errorJson.error || errorJson.message || "An error occurred");
          } catch (e) {
            throw new Error(errorText || res.statusText || "An error occurred");
          }
        }
        
        return;
      } catch (error: any) {
        throw new Error(error.message || "Failed to delete campaign");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/campaigns"] });
      toast({
        title: "Campaign deleted",
        description: "The campaign has been deleted successfully",
      });
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: "Deletion failed",
        description: error.message || "Failed to delete campaign",
        variant: "destructive",
      });
    },
  });

  const handleDeleteCampaign = () => {
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteCampaign = async () => {
    if (campaignId) {
      await deleteCampaignMutation.mutateAsync(campaignId);
    }
  };

  // Create campaign mutation
  const [campaignName, setCampaignName] = useState("");
  const [campaignDescription, setCampaignDescription] = useState("");
  
  const createCampaignMutation = useMutation({
    mutationFn: async (campaignData: { name: string; description?: string }) => {
      try {
        const res = await fetch("/api/campaigns", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(campaignData),
          credentials: "include"
        });
        
        // Check if we hit a subscription limit (402 Payment Required)
        if (res.status === 402) {
          const limitData = await res.json();
          throw { 
            isLimitError: true, 
            limitData: {
              limitType: "campaigns" as const,
              currentUsage: limitData.current || limitData.currentUsage, 
              limit: limitData.limit,
              currentPlan: user?.subscription_plan || "free" 
            }
          };
        }
        
        // Check for other errors
        if (!res.ok) {
          const errorText = await res.text();
          try {
            const errorJson = JSON.parse(errorText);
            throw new Error(errorJson.error || errorJson.message || "An error occurred");
          } catch (e) {
            throw new Error(errorText || res.statusText || "An error occurred");
          }
        }
        
        return await res.json();
      } catch (error: any) {
        // If it's a limit error, rethrow it to be handled in onError
        if (error?.isLimitError) {
          throw error;
        }
        throw new Error(error.message || "Failed to create campaign");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/campaigns"] });
      toast({
        title: "Campaign created",
        description: "Your new campaign has been created successfully",
      });
      onClose();
    },
    onError: (error: any) => {
      // Check if this was a subscription limit error
      if (error?.isLimitError && error?.limitData) {
        setLimitData(error.limitData);
        setShowLimitModal(true);
        return;
      }
      
      toast({
        title: "Creation failed",
        description: error.message || "Failed to create campaign",
        variant: "destructive",
      });
    },
  });

  // Show loading state if we're loading campaign data
  if (mode !== 'create' && isLoadingCampaign) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // If we're in edit/view mode but no campaign is found
  if (mode !== 'create' && !campaign) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Campaign Not Found</DialogTitle>
            <DialogDescription>
              The campaign you're looking for could not be found. It may have been deleted.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end mt-4">
            <Button onClick={onClose}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Handle create campaign mode
  if (mode === 'create') {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Campaign</DialogTitle>
            <DialogDescription>
              Create a new campaign to organize your content.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="campaign-name">Campaign Name</Label>
              <input
                id="campaign-name"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                placeholder="Enter campaign name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="campaign-description">Description (optional)</Label>
              <textarea
                id="campaign-description"
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={campaignDescription}
                onChange={(e) => setCampaignDescription(e.target.value)}
                placeholder="Enter campaign description"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button 
              onClick={() => createCampaignMutation.mutate({ 
                name: campaignName,
                description: campaignDescription || undefined
              })}
              disabled={!campaignName || createCampaignMutation.isPending}
              style={{ backgroundColor: "#74d1ea", color: "black" }}
            >
              {createCampaignMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>Create Campaign</>
              )}
            </Button>
          </DialogFooter>
          
          {/* Subscription Limit Modal */}
          <SubscriptionLimitModal
            isOpen={showLimitModal}
            onClose={() => setShowLimitModal(false)}
            limitData={limitData}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[1100px] w-[95vw] max-h-[90vh] bg-black border-gray-800">
        <DialogHeader>
          <div>
            <DialogTitle className="flex items-center gap-3 text-2xl">
              <div className="flex items-center justify-center h-10 w-10 rounded-md bg-[#181c25] text-base font-medium uppercase text-[#74d1ea]">
                {campaign.name.substring(0, 2)}
              </div>
              {campaign.name}
            </DialogTitle>
          </div>
          {campaign.description && (
            <DialogDescription className="mt-1">{campaign.description}</DialogDescription>
          )}
        </DialogHeader>
        
        {/* Delete Confirmation Dialog */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent className="bg-[#0a0c10] border border-gray-800 text-white">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-white">Delete Campaign</AlertDialogTitle>
              <AlertDialogDescription className="text-gray-400">
                Are you sure you want to delete the campaign "{campaign.name}"? This action cannot be undone 
                and will remove all campaign data and associations.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex space-x-2 pt-5">
              <AlertDialogCancel 
                className="text-gray-300 hover:text-white bg-[#1a1e29] hover:bg-[#272e3f] border-gray-700"
                onClick={() => setIsDeleteDialogOpen(false)}
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction 
                className="bg-red-600 hover:bg-red-700 text-white border-none"
                onClick={confirmDeleteCampaign}
                disabled={deleteCampaignMutation.isPending}
              >
                {deleteCampaignMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>Delete Campaign</>
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <ScrollArea className="max-h-[75vh]">
          <div className="space-y-6 pr-4 py-2">
            {/* Key Details Section */}
            <div className="bg-black rounded-xl p-4 border border-gray-800/30">
              <div className="flex flex-col md:flex-row gap-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">
                    <span className="text-xs uppercase font-semibold text-[#74d1ea]">KEY DETAILS</span>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Created: </span>
                      <span>{new Date(campaign.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Content items: </span>
                      <span>{campaignContents?.length || 0}</span>
                    </div>
                    {campaign.persona_id && personas?.length > 0 && (
                      <div className="text-sm">
                        <span className="text-muted-foreground">Persona: </span>
                        <span className="text-[#74d1ea]">
                          {personas.find(p => p.id === campaign.persona_id)?.name || 'None'}
                        </span>
                      </div>
                    )}
                    {campaign.tone_analysis_id && toneAnalyses?.length > 0 && (
                      <div className="text-sm">
                        <span className="text-muted-foreground">Tone: </span>
                        <span className="text-[#74d1ea]">
                          {toneAnalyses.find(t => t.id === campaign.tone_analysis_id)?.name || 'None'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="ml-auto">
                  <Button
                    onClick={() => setIsAddContentDialogOpen(true)}
                    className="gap-1"
                    style={{ backgroundColor: "#74d1ea", color: "black" }}
                  >
                    <Plus className="h-4 w-4" /> Add Content
                  </Button>
                </div>
              </div>
            </div>

            {/* Campaign Content Section */}
            <div className="space-y-8 mt-4">
              {/* Campaign Content */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <FileText className="h-5 w-5 text-[#74d1ea]" /> Campaign Content
                  </h3>
                </div>
                
                {isLoadingContents ? (
                  <div className="flex justify-center items-center h-[200px]">
                    <Loader2 className="h-8 w-8 animate-spin text-[#74d1ea]" />
                  </div>
                ) : !campaignContents || campaignContents.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 space-y-4 border border-[#1a1e29] bg-black rounded-lg overflow-hidden">
                    <FileText className="h-10 w-10 text-muted-foreground" />
                    <h3 className="text-lg font-semibold">No content in this campaign</h3>
                    <p className="text-muted-foreground text-center max-w-md text-sm">
                      This campaign doesn't have any content yet. Add some from your saved content.
                    </p>
                    <Button 
                      onClick={() => setIsAddContentDialogOpen(true)}
                      size="sm"
                      style={{ backgroundColor: "#74d1ea", color: "black" }}
                    >
                      <Plus className="mr-2 h-4 w-4" /> Add Content
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-muted-foreground mb-2">
                      <span>{campaignContents.length} item{campaignContents.length !== 1 ? 's' : ''}</span>
                    </div>
                    <ScrollArea className="h-[300px]">
                      <div className="grid gap-4 pr-2">
                        {campaignContents.map((content: any) => (
                          <SavedContentListItem
                            key={content.id}
                            content={content}
                            onRemoveFromCampaign={() => handleRemoveContent(content.id)}
                            showCampaignActions={true}
                          />
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                )}
              </div>
              
              {/* Persona and Tone Display Section */}
              {(campaign.persona_id || campaign.tone_analysis_id) && (
                <div className="border-t border-gray-800/30 pt-6">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <User className="h-5 w-5 text-[#74d1ea]" /> Campaign Strategy
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Persona Display */}
                    {campaign.persona_id && personas?.find(p => p.id === campaign.persona_id) && (
                      <div className="p-4 border border-[#1a1e29] rounded-lg bg-black">
                        <h4 className="text-base font-medium mb-2 flex items-center gap-2">
                          <User className="h-4 w-4 text-[#74d1ea]" /> Target Persona
                        </h4>
                        <div className="space-y-3">
                          <h5 className="font-medium text-[#74d1ea]">
                            {personas.find(p => p.id === campaign.persona_id)?.name}
                          </h5>
                          <p className="text-sm text-gray-300">
                            {personas.find(p => p.id === campaign.persona_id)?.description}
                          </p>
                          {personas.find(p => p.id === campaign.persona_id)?.interests?.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {personas.find(p => p.id === campaign.persona_id)?.interests?.map((interest: string, i: number) => (
                                <span 
                                  key={i} 
                                  className="text-xs py-1 px-2 rounded-full bg-[#1a1e29] text-white"
                                >
                                  {interest}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* Tone Analysis Display */}
                    {campaign.tone_analysis_id && toneAnalyses?.find(t => t.id === campaign.tone_analysis_id) && (
                      <div className="p-4 border border-[#1a1e29] rounded-lg bg-black">
                        <h4 className="text-base font-medium mb-2 flex items-center gap-2">
                          <BarChart className="h-4 w-4 text-[#74d1ea]" /> Tone Analysis
                        </h4>
                        <div className="space-y-3">
                          <h5 className="font-medium text-[#74d1ea]">
                            {toneAnalyses.find(t => t.id === campaign.tone_analysis_id)?.name}
                          </h5>
                          {toneAnalyses.find(t => t.id === campaign.tone_analysis_id)?.sample_text && (
                            <p className="text-sm text-gray-300">
                              {toneAnalyses.find(t => t.id === campaign.tone_analysis_id)?.sample_text?.substring(0, 150)}...
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Campaign Comprehensive Details */}
              <div className="border-t border-gray-800/30 pt-6">
                <h3 className="text-xl font-bold mb-4">
                  Campaign Management Hub
                </h3>
                
                <Tabs defaultValue="overview" className="w-full" value={activeCampaignTab} onValueChange={setActiveCampaignTab}>
                  <TabsList className="mb-4 flex bg-[#0e1015] border border-gray-800/60 rounded-md p-1">
                    <TabsTrigger value="overview" className="flex-1 data-[state=active]:bg-[#74d1ea] data-[state=active]:text-black">
                      <BarChart2 className="mr-2 h-4 w-4" />
                      Overview
                    </TabsTrigger>
                    <TabsTrigger value="content" className="flex-1 data-[state=active]:bg-[#74d1ea] data-[state=active]:text-black">
                      <FileText className="mr-2 h-4 w-4" />
                      Content
                    </TabsTrigger>
                    <TabsTrigger value="personas" className="flex-1 data-[state=active]:bg-[#74d1ea] data-[state=active]:text-black">
                      <User className="mr-2 h-4 w-4" />
                      Personas
                    </TabsTrigger>
                    <TabsTrigger value="tone" className="flex-1 data-[state=active]:bg-[#74d1ea] data-[state=active]:text-black">
                      <PenTool className="mr-2 h-4 w-4" />
                      Tone
                    </TabsTrigger>
                    <TabsTrigger value="schedule" className="flex-1 data-[state=active]:bg-[#74d1ea] data-[state=active]:text-black">
                      <Calendar className="mr-2 h-4 w-4" />
                      Schedule
                    </TabsTrigger>
                  </TabsList>
                  
                  {/* Overview Tab */}
                  <TabsContent value="overview" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {/* Campaign Status */}
                      <div className="border border-[#1a1e29] rounded-lg bg-black p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-sm font-medium">Campaign Status</h4>
                          <Badge 
                            className={
                              (campaignStatus || campaign?.status) === 'active' ? 'bg-green-600' : 
                              (campaignStatus || campaign?.status) === 'draft' ? 'bg-gray-600' : 
                              (campaignStatus || campaign?.status) === 'planning' ? 'bg-yellow-600' :
                              (campaignStatus || campaign?.status) === 'running' ? 'bg-blue-600' :
                              (campaignStatus || campaign?.status) === 'completed' ? 'bg-purple-600' :
                              'bg-gray-500'
                            }
                          >
                            {campaignStatus ? campaignStatus.charAt(0).toUpperCase() + campaignStatus.slice(1) : campaign?.status_display || 'Draft'}
                          </Badge>
                        </div>
                        <Select 
                          value={campaignStatus || campaign?.status || 'draft'}
                          onValueChange={(value) => {
                            setCampaignStatus(value);
                            // Save immediately when status is changed
                            fetch(`/api/campaigns/${campaignId}`, {
                              method: "PATCH",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ status: value }),
                              credentials: "include"
                            }).then(res => {
                              if (res.ok) {
                                queryClient.invalidateQueries({ queryKey: [`/api/campaigns/${campaignId}`] });
                                toast({
                                  title: "Status updated",
                                  description: `Campaign status set to ${value}`,
                                });
                              }
                            });
                          }}
                        >
                          <SelectTrigger className="w-full bg-black border-gray-800">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent className="bg-black border-gray-800">
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="planning">Planning</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="running">Running</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="archived">Archived</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {/* Campaign Timeline */}
                      <div className="border border-[#1a1e29] rounded-lg bg-black p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-sm font-medium">Campaign Timeline</h4>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6 rounded text-muted-foreground hover:text-[#74d1ea]"
                            onClick={() => setActiveCampaignTab('schedule')}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                        <div className="space-y-3">
                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs text-gray-400">Start Date</label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className="justify-start text-left font-normal h-8 text-sm border-gray-800 hover:bg-[#1a1e29] w-full"
                                >
                                  <Clock className="mr-2 h-3.5 w-3.5 text-gray-400" />
                                  {campaign?.start_date ? (
                                    format(new Date(campaign.start_date), "PPP")
                                  ) : (
                                    <span className="text-gray-400">Pick a start date</span>
                                  )}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0 bg-black border-gray-800">
                                <CalendarComponent
                                  mode="single"
                                  selected={startDate || (campaign?.start_date ? new Date(campaign.start_date) : undefined)}
                                  onSelect={(date) => {
                                    setStartDate(date);
                                    // Save immediately when selected
                                    if (date) {
                                      fetch(`/api/campaigns/${campaignId}`, {
                                        method: "PATCH",
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify({ start_date: date }),
                                        credentials: "include"
                                      }).then(res => {
                                        if (res.ok) {
                                          queryClient.invalidateQueries({ queryKey: [`/api/campaigns/${campaignId}`] });
                                          toast({
                                            title: "Start date updated",
                                            description: "Campaign timeline has been updated",
                                          });
                                        }
                                      });
                                    }
                                  }}
                                  className="bg-black"
                                />
                              </PopoverContent>
                            </Popover>
                          </div>
                          
                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs text-gray-400">End Date</label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className="justify-start text-left font-normal h-8 text-sm border-gray-800 hover:bg-[#1a1e29] w-full"
                                >
                                  <Calendar className="mr-2 h-3.5 w-3.5 text-gray-400" />
                                  {campaign?.end_date ? (
                                    format(new Date(campaign.end_date), "PPP")
                                  ) : (
                                    <span className="text-gray-400">Pick an end date</span>
                                  )}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0 bg-black border-gray-800">
                                <CalendarComponent
                                  mode="single"
                                  selected={endDate || (campaign?.end_date ? new Date(campaign.end_date) : undefined)}
                                  onSelect={(date) => {
                                    setEndDate(date);
                                    // Save immediately when selected
                                    if (date) {
                                      fetch(`/api/campaigns/${campaignId}`, {
                                        method: "PATCH",
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify({ end_date: date }),
                                        credentials: "include"
                                      }).then(res => {
                                        if (res.ok) {
                                          queryClient.invalidateQueries({ queryKey: [`/api/campaigns/${campaignId}`] });
                                          toast({
                                            title: "End date updated",
                                            description: "Campaign timeline has been updated",
                                          });
                                        }
                                      });
                                    }
                                  }}
                                  disabled={(date) => {
                                    const startDateValue = startDate || (campaign?.start_date ? new Date(campaign.start_date) : undefined);
                                    return startDateValue ? date < startDateValue : false;
                                  }}
                                  className="bg-black"
                                />
                              </PopoverContent>
                            </Popover>
                          </div>
                        </div>
                      </div>
                      
                      {/* Campaign Stats */}
                      <div className="border border-[#1a1e29] rounded-lg bg-black p-4">
                        <h4 className="text-sm font-medium mb-3">Campaign Assets</h4>
                        <div className="space-y-2">
                          <div className="grid grid-cols-[auto_1fr] gap-2 items-center">
                            <FileText className="h-4 w-4 text-gray-400" />
                            <div className="text-sm">
                              <span>Content: </span>
                              <span className="font-medium">{campaign?.content_count || 0}</span>
                            </div>
                          </div>
                          <div className="grid grid-cols-[auto_1fr] gap-2 items-center">
                            <User className="h-4 w-4 text-gray-400" />
                            <div className="text-sm">
                              <span>Personas: </span>
                              <span className="font-medium">{campaign?.personas_count || 0}</span>
                            </div>
                          </div>
                          <div className="grid grid-cols-[auto_1fr] gap-2 items-center">
                            <Share2 className="h-4 w-4 text-gray-400" />
                            <div className="text-sm">
                              <span>Channels: </span>
                              <span className="font-medium">{campaign?.channels_count || 0}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Campaign Actions */}
                    <div className="border border-[#1a1e29] rounded-lg bg-black p-4">
                      <h4 className="text-sm font-medium mb-3">Quick Actions</h4>
                      <div className="flex flex-wrap gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setIsAddContentDialogOpen(true)}
                          className="border-gray-800 hover:bg-[#1a1e29]"
                        >
                          <Plus className="mr-2 h-4 w-4" /> Add Content
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setActiveCampaignTab('schedule')}
                          className="border-gray-800 hover:bg-[#1a1e29]"
                        >
                          <Calendar className="mr-2 h-4 w-4" /> Set Timeline
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setActiveCampaignTab('personas')}
                          className="border-gray-800 hover:bg-[#1a1e29]"
                        >
                          <User className="mr-2 h-4 w-4" /> Manage Personas
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                  
                  {/* Content Tab */}
                  <TabsContent value="content" className="space-y-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-base font-medium">Campaign Content</h4>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setIsAddContentDialogOpen(true)}
                        className="border-gray-800 hover:bg-[#1a1e29]"
                      >
                        <Plus className="mr-2 h-4 w-4" /> Add Content
                      </Button>
                    </div>
                    
                    <div className="border border-[#1a1e29] rounded-lg bg-black p-5">
                      {(isLoadingContents || !campaignContents) ? (
                        <div className="flex justify-center items-center py-8">
                          <Loader2 className="h-8 w-8 animate-spin text-[#74d1ea]" />
                        </div>
                      ) : campaignContents.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10 space-y-4">
                          <FileText className="h-12 w-12 text-gray-500" />
                          <p className="text-gray-400 text-center max-w-md">
                            No content has been added to this campaign yet.
                            Click "Add Content" to start building your campaign with your existing content.
                          </p>
                          <Button 
                            onClick={() => setIsAddContentDialogOpen(true)} 
                            style={{ backgroundColor: "#74d1ea", color: "black" }}
                          >
                            <Plus className="mr-2 h-4 w-4" /> Add Content
                          </Button>
                        </div>
                      ) : (
                        <ScrollArea className="h-[350px]">
                          <div className="space-y-3">
                            {campaignContents.map((content: any) => (
                              <div key={content.id} className="p-3 border border-gray-800/60 rounded-md bg-black/30 hover:bg-black/50 group">
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    {content.type === 'linkedin_post' && <SiLinkedin className="text-[#0A66C2] h-4 w-4" />}
                                    {content.type === 'email' && <Mail className="text-[#74d1ea] h-4 w-4" />}
                                    {content.type === 'webinar' && <MessageSquare className="text-[#74d1ea] h-4 w-4" />}
                                    {content.type === 'workshop' && <Target className="text-[#74d1ea] h-4 w-4" />}
                                    <span className="font-medium text-sm capitalize">{content.type.replace('_', ' ')}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="text-xs text-gray-500">
                                      {new Date(content.created_at).toLocaleDateString()}
                                    </div>
                                    <button 
                                      onClick={() => handleRemoveContent(content.id)}
                                      className="text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </button>
                                  </div>
                                </div>
                                <p className="text-sm text-gray-300">{content.content_text}</p>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      )}
                    </div>
                  </TabsContent>
                  
                  {/* Personas Tab */}
                  <TabsContent value="personas" className="space-y-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-base font-medium">Target Personas</h4>
                    </div>
                    
                    <div className="border border-[#1a1e29] rounded-lg bg-black p-5">
                      {isLoadingPersonas ? (
                        <div className="flex justify-center items-center py-8">
                          <Loader2 className="h-8 w-8 animate-spin text-[#74d1ea]" />
                        </div>
                      ) : !personas || personas.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10 space-y-4">
                          <User className="h-12 w-12 text-gray-500" />
                          <p className="text-gray-400 text-center max-w-md">
                            You haven't created any personas yet.
                            Create personas to better target your campaign content.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <p className="text-sm text-gray-300 mb-4">
                            Select a persona to associate with this campaign. This helps target your content to a specific audience.
                          </p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {personas.map((persona) => (
                              <div 
                                key={persona.id}
                                onClick={() => handleUpdateCampaign(campaignId!, persona.id)}
                                className={`p-4 border ${campaign?.persona_id === persona.id ? 'border-[#74d1ea]' : 'border-gray-800/60'} rounded-md bg-black/30 cursor-pointer hover:bg-black/50`}
                              >
                                <div className="flex items-start gap-3">
                                  <div className="flex-shrink-0 mt-1">
                                    <div className="w-8 h-8 rounded-full bg-[#1a1e29] flex items-center justify-center">
                                      <User className="h-4 w-4 text-[#74d1ea]" />
                                    </div>
                                  </div>
                                  <div>
                                    <h5 className="font-medium text-base mb-1">{persona.name}</h5>
                                    <p className="text-xs text-gray-400">{persona.description}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  
                  {/* Tone Analysis Tab */}
                  <TabsContent value="tone" className="space-y-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-base font-medium">Tone Analysis</h4>
                    </div>
                    
                    <div className="border border-[#1a1e29] rounded-lg bg-black p-5">
                      {isLoadingToneAnalyses ? (
                        <div className="flex justify-center items-center py-8">
                          <Loader2 className="h-8 w-8 animate-spin text-[#74d1ea]" />
                        </div>
                      ) : !toneAnalyses || toneAnalyses.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10 space-y-4">
                          <PenTool className="h-12 w-12 text-gray-500" />
                          <p className="text-gray-400 text-center max-w-md">
                            You haven't created any tone analyses yet.
                            Create tone analyses to define the voice and style of your campaign.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <p className="text-sm text-gray-300 mb-4">
                            Select a tone analysis to associate with this campaign. This defines the voice and style of your content.
                          </p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {toneAnalyses.map((tone) => (
                              <div 
                                key={tone.id}
                                onClick={() => handleUpdateCampaign(campaignId!, undefined, tone.id)}
                                className={`p-4 border ${campaign?.tone_analysis_id === tone.id ? 'border-[#74d1ea]' : 'border-gray-800/60'} rounded-md bg-black/30 cursor-pointer hover:bg-black/50`}
                              >
                                <div className="flex items-start gap-3">
                                  <div className="flex-shrink-0 mt-1">
                                    <div className="w-8 h-8 rounded-full bg-[#1a1e29] flex items-center justify-center">
                                      <PenTool className="h-4 w-4 text-[#74d1ea]" />
                                    </div>
                                  </div>
                                  <div>
                                    <h5 className="font-medium text-base mb-1">{tone.name || 'Unnamed Analysis'}</h5>
                                    <p className="text-xs text-gray-400 truncate">
                                      {tone.website_url || tone.sample_text?.substring(0, 50) || 'No sample text'}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  
                  {/* Schedule Tab */}
                  <TabsContent value="schedule" className="space-y-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-base font-medium">Campaign Timeline</h4>
                    </div>
                    
                    <div className="border border-[#1a1e29] rounded-lg bg-black p-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Start Date Picker */}
                        <div className="space-y-4">
                          <h5 className="text-sm font-medium">Campaign Start Date</h5>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={`w-full justify-start text-left font-normal border-gray-800 ${!startDate && "text-muted-foreground"}`}
                              >
                                <Calendar className="mr-2 h-4 w-4" />
                                {startDate ? format(startDate, "PPP") : <span>Pick a start date</span>}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 bg-black border-gray-800">
                              <CalendarComponent
                                mode="single"
                                selected={startDate}
                                onSelect={setStartDate}
                                className="bg-black"
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        
                        {/* End Date Picker */}
                        <div className="space-y-4">
                          <h5 className="text-sm font-medium">Campaign End Date</h5>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={`w-full justify-start text-left font-normal border-gray-800 ${!endDate && "text-muted-foreground"}`}
                              >
                                <Calendar className="mr-2 h-4 w-4" />
                                {endDate ? format(endDate, "PPP") : <span>Pick an end date</span>}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 bg-black border-gray-800">
                              <CalendarComponent
                                mode="single"
                                selected={endDate}
                                onSelect={setEndDate}
                                className="bg-black"
                                disabled={(date) => 
                                  startDate ? date < startDate : false
                                }
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <Button 
                          onClick={() => {
                            // Update campaign with new dates
                            const updateData: any = {};
                            if (startDate) updateData.start_date = startDate;
                            if (endDate) updateData.end_date = endDate;
                            if (campaignStatus !== campaign?.status) updateData.status = campaignStatus;
                            
                            fetch(`/api/campaigns/${campaignId}`, {
                              method: "PATCH",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify(updateData),
                              credentials: "include"
                            }).then(res => {
                              if (res.ok) {
                                queryClient.invalidateQueries({ queryKey: [`/api/campaigns/${campaignId}`] });
                                toast({
                                  title: "Campaign updated",
                                  description: "Timeline and status have been updated successfully",
                                });
                                setActiveCampaignTab('overview');
                              }
                            });
                          }}
                          style={{ backgroundColor: "#74d1ea", color: "black" }}
                          className="w-full"
                        >
                          Save Timeline & Status
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Add Content Dialog */}
        <Dialog open={isAddContentDialogOpen} onOpenChange={setIsAddContentDialogOpen}>
          <DialogContent className="max-w-3xl bg-black border-gray-800">
            <DialogHeader>
              <DialogTitle>Add Content to Campaign</DialogTitle>
              <DialogDescription>
                Select content to add to this campaign
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4">
              {isLoadingAllContents ? (
                <div className="flex justify-center items-center h-[300px]">
                  <Loader2 className="h-8 w-8 animate-spin text-[#74d1ea]" />
                </div>
              ) : availableContents.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 space-y-4 border border-[#1a1e29] bg-black rounded-lg overflow-hidden">
                  <h3 className="text-lg font-semibold">No content available</h3>
                  <p className="text-muted-foreground text-center max-w-md text-sm">
                    You don't have any content that can be added to this campaign. All your content is already part of this campaign, or you haven't created any content yet.
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Search content..."
                        className="pl-9 h-10 w-full md:w-[300px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      />
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Selected: {selectedContentIds.length}</span>
                    </div>
                  </div>
                  
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-4 pr-2">
                      {availableContents.map((content: any) => (
                        <div key={content.id} className="flex gap-3">
                          <Checkbox
                            id={`content-${content.id}`}
                            checked={selectedContentIds.includes(content.id)}
                            onCheckedChange={(checked) => handleContentSelect(content.id, !!checked)}
                          />
                          <div className="flex-1">
                            <SavedContentListItem
                              content={content}
                              compact={true}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </>
              )}
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddContentDialogOpen(false)}>Cancel</Button>
              <Button 
                onClick={handleAddSelectedContent}
                disabled={selectedContentIds.length === 0 || batchAddContentMutation.isPending}
                style={{ backgroundColor: "#74d1ea", color: "black" }}
              >
                {batchAddContentMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>Add Selected ({selectedContentIds.length})</>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Delete Button */}
        <div className="border-t border-gray-800/30 mt-6 pt-4 flex justify-center">
          <Button
            variant="link"
            size="sm"
            className="text-gray-500 hover:text-red-500 transition-colors"
            onClick={handleDeleteCampaign}
          >
            <Trash2 className="mr-1 h-3.5 w-3.5" /> Delete Campaign
          </Button>
        </div>

        {/* Subscription Limit Modal */}
        {showLimitModal && limitData && (
          <SubscriptionLimitModal
            isOpen={showLimitModal}
            onClose={() => setShowLimitModal(false)}
            limitType={limitData.limitType}
            currentUsage={limitData.currentUsage}
            limit={limitData.limit}
            currentPlan={limitData.currentPlan}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}