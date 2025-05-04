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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Plus, Search, FileText, User, BarChart, Trash2, Rocket, Zap, Mail, Sparkles, LineChart } from "lucide-react";
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
  const availableContents = allContents?.filter(content => {
    // Filter out content already in the campaign
    return !campaignContents?.some(cc => cc.id === content.id);
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

  const handleCreateCampaign = () => {
    if (!campaignName.trim()) {
      toast({
        title: "Campaign name required",
        description: "Please enter a name for your campaign",
        variant: "destructive",
      });
      return;
    }
    
    createCampaignMutation.mutate({
      name: campaignName,
      description: campaignDescription.trim() || undefined
    });
  };

  // If it's create mode, show the creation form
  if (mode === 'create') {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-2xl">Create New Campaign</DialogTitle>
            <DialogDescription>
              Create a new campaign to organize your marketing content
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Campaign Name</Label>
              <input
                id="name"
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                className="w-full p-2 rounded-md border border-gray-700 bg-black focus:outline-none focus:ring-2 focus:ring-[#74d1ea] focus:border-transparent"
                placeholder="Enter campaign name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <textarea
                id="description"
                value={campaignDescription}
                onChange={(e) => setCampaignDescription(e.target.value)}
                className="w-full p-2 rounded-md border border-gray-700 bg-black h-24 focus:outline-none focus:ring-2 focus:ring-[#74d1ea] focus:border-transparent"
                placeholder="Enter campaign description"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateCampaign} 
              disabled={createCampaignMutation.isPending}
              style={{ backgroundColor: "#74d1ea", color: "black" }}
            >
              {createCampaignMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...
                </>
              ) : "Create Campaign"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  // For edit/view mode, check if campaign is loaded
  if (isLoadingCampaign || !campaign) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[900px]">
          <div className="flex justify-center items-center h-[200px]">
            <Loader2 className="h-8 w-8 animate-spin text-[#74d1ea]" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-3 text-2xl">
              <span className="flex items-center justify-center h-8 w-8 rounded-full bg-[#181c25]">
                <span className="text-base font-medium uppercase text-[#74d1ea]">
                  {campaign.name.substring(0, 2)}
                </span>
              </span>
              {campaign.name}
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
              onClick={handleDeleteCampaign}
              title="Delete campaign"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
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

        <div className="space-y-6 mt-2">
          {/* Campaign overview card */}
          <div className="p-4 rounded-xl bg-[#0e1015] border-0">
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

          {/* Tabs for Content, Persona, Tone Analysis, and Campaign Factory */}
          <Tabs defaultValue="content" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="content" className="gap-2">
                <FileText className="h-4 w-4" /> Content
              </TabsTrigger>
              <TabsTrigger value="persona" className="gap-2">
                <User className="h-4 w-4" /> Persona
              </TabsTrigger>
              <TabsTrigger value="tone" className="gap-2">
                <BarChart className="h-4 w-4" /> Tone Analysis
              </TabsTrigger>
              <TabsTrigger value="campaign-factory" className="gap-2">
                <Rocket className="h-4 w-4" /> Campaign Factory
              </TabsTrigger>
            </TabsList>
            
            {/* Content Tab */}
            <TabsContent value="content" className="space-y-4">
              <h3 className="text-xl font-bold mb-4">Campaign Content</h3>
              
              {isLoadingContents ? (
                <div className="flex justify-center items-center h-[200px]">
                  <Loader2 className="h-8 w-8 animate-spin text-[#74d1ea]" />
                </div>
              ) : !campaignContents || campaignContents.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 space-y-4 border border-[#1a1e29] bg-[#0e1015] rounded-lg overflow-hidden">
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
                  <ScrollArea className="h-[400px]">
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
            </TabsContent>
            
            {/* Persona Tab */}
            <TabsContent value="persona" className="space-y-4">
              <h3 className="text-xl font-bold mb-4">Campaign Persona</h3>
              
              {isLoadingPersonas ? (
                <div className="flex justify-center items-center h-[200px]">
                  <Loader2 className="h-8 w-8 animate-spin text-[#74d1ea]" />
                </div>
              ) : !personas || personas.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 space-y-4 border border-[#1a1e29] bg-[#0e1015] rounded-lg overflow-hidden">
                  <User className="h-10 w-10 text-muted-foreground" />
                  <h3 className="text-lg font-semibold">No personas available</h3>
                  <p className="text-muted-foreground text-center max-w-md text-sm">
                    You haven't created any personas yet. Create personas to associate with this campaign.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="persona-select">Select a persona for this campaign</Label>
                    <Select 
                      value={selectedPersonaId?.toString() || (campaign.persona_id?.toString() || '0')}
                      onValueChange={(value) => setSelectedPersonaId(value === "0" ? null : parseInt(value))}
                    >
                      <SelectTrigger id="persona-select" className="w-full">
                        <SelectValue placeholder="Select a persona" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem key="none" value="0">None</SelectItem>
                        {personas.map((persona) => (
                          <SelectItem key={persona.id} value={persona.id.toString()}>
                            {persona.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground mt-1">
                      Associating a persona helps maintain consistent audience targeting across all campaign content.
                    </p>
                  </div>
                  
                  {(selectedPersonaId || campaign.persona_id) && personas.length > 0 && (
                    <div className="p-4 border border-[#1a1e29] rounded-lg bg-[#0e1015]">
                      <h4 className="font-medium mb-2">
                        {personas.find(p => p.id === (selectedPersonaId || campaign.persona_id))?.name}
                      </h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        {personas.find(p => p.id === (selectedPersonaId || campaign.persona_id))?.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {personas.find(p => p.id === (selectedPersonaId || campaign.persona_id))?.interests?.map((interest: string, i: number) => (
                          <span 
                            key={i} 
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#181c25] text-[#74d1ea]"
                          >
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-end">
                    <Button
                      onClick={() => {
                        updateCampaignMutation.mutate({
                          campaignId, 
                          personaId: selectedPersonaId !== null ? selectedPersonaId : campaign.persona_id
                        });
                      }}
                      disabled={updateCampaignMutation.isPending}
                      style={{ backgroundColor: "#74d1ea", color: "black" }}
                    >
                      {updateCampaignMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...
                        </>
                      ) : (
                        "Update Persona"
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>
            
            {/* Tone Analysis Tab */}
            <TabsContent value="tone" className="space-y-4">
              <h3 className="text-xl font-bold mb-4">Campaign Tone Analysis</h3>
              
              {isLoadingToneAnalyses ? (
                <div className="flex justify-center items-center h-[200px]">
                  <Loader2 className="h-8 w-8 animate-spin text-[#74d1ea]" />
                </div>
              ) : !toneAnalyses || toneAnalyses.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 space-y-4 border border-[#1a1e29] bg-[#0e1015] rounded-lg overflow-hidden">
                  <BarChart className="h-10 w-10 text-muted-foreground" />
                  <h3 className="text-lg font-semibold">No tone analyses available</h3>
                  <p className="text-muted-foreground text-center max-w-md text-sm">
                    You haven't created any tone analyses yet. Create tone analyses to associate with this campaign.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="tone-select">Select a tone analysis for this campaign</Label>
                    <Select 
                      value={selectedToneAnalysisId?.toString() || (campaign.tone_analysis_id?.toString() || '0')}
                      onValueChange={(value) => setSelectedToneAnalysisId(value === "0" ? null : parseInt(value))}
                    >
                      <SelectTrigger id="tone-select" className="w-full">
                        <SelectValue placeholder="Select a tone analysis" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem key="none-tone" value="0">None</SelectItem>
                        {toneAnalyses.map((tone) => (
                          <SelectItem key={tone.id} value={tone.id.toString()}>
                            {tone.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground mt-1">
                      Associating a tone analysis ensures consistent voice and tone across all campaign materials.
                    </p>
                  </div>
                  
                  {(selectedToneAnalysisId || campaign.tone_analysis_id) && toneAnalyses.length > 0 && (
                    <div className="p-4 border border-[#1a1e29] rounded-lg bg-[#0e1015]">
                      <h4 className="font-medium mb-2">
                        {toneAnalyses.find(t => t.id === (selectedToneAnalysisId || campaign.tone_analysis_id))?.name}
                      </h4>
                      {toneAnalyses.find(t => t.id === (selectedToneAnalysisId || campaign.tone_analysis_id))?.tone_results && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {toneAnalyses.find(t => t.id === (selectedToneAnalysisId || campaign.tone_analysis_id))?.tone_results?.keywords?.slice(0, 6)?.map((keyword: string, i: number) => (
                            <span 
                              key={i} 
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#181c25] text-[#74d1ea]"
                            >
                              {keyword}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="flex justify-end">
                    <Button
                      onClick={() => {
                        updateCampaignMutation.mutate({
                          campaignId, 
                          toneAnalysisId: selectedToneAnalysisId !== null ? selectedToneAnalysisId : campaign.tone_analysis_id
                        });
                      }}
                      disabled={updateCampaignMutation.isPending}
                      style={{ backgroundColor: "#74d1ea", color: "black" }}
                    >
                      {updateCampaignMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...
                        </>
                      ) : (
                        "Update Tone Analysis"
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>
            
            {/* Campaign Factory Tab */}
            <TabsContent value="campaign-factory" className="space-y-4">
              <h3 className="text-xl font-bold mb-4">Campaign Factory Output</h3>
              
              <div className="bg-[#0e1015] border border-[#1a1e29] rounded-lg p-5 space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-medium flex items-center gap-2">
                      <Rocket className="h-5 w-5 text-[#74d1ea]" /> Campaign Factory Details
                    </h4>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-[#74d1ea] hover:bg-[#74d1ea]/10 border-[#74d1ea]/30"
                      onClick={() => window.open('/campaign-factory', '_blank')}
                    >
                      Launch Campaign Factory
                    </Button>
                  </div>
                  
                  <p className="text-sm text-gray-400">
                    The Campaign Factory creates comprehensive, multi-channel content based on your target audience and brand voice.
                  </p>
                </div>
                
                {/* Factory Output Summary */}
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Campaign Strategy */}
                    <div className="bg-black/40 border border-gray-800 rounded-lg p-4 space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="bg-[#0e131f] p-2 rounded-md">
                          <Sparkles className="h-4 w-4 text-[#74d1ea]" />
                        </div>
                        <h5 className="font-medium">Campaign Strategy</h5>
                      </div>
                      
                      <p className="text-sm text-gray-400">
                        {campaign?.description || "This campaign was created to target specific audience segments with consistent messaging across channels."}
                      </p>
                    </div>
                    
                    {/* Channels Used */}
                    <div className="bg-black/40 border border-gray-800 rounded-lg p-4 space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="bg-[#0e131f] p-2 rounded-md">
                          <LineChart className="h-4 w-4 text-[#74d1ea]" />
                        </div>
                        <h5 className="font-medium">Channels Used</h5>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        <div className="flex items-center gap-1 text-sm bg-[#181c25] px-2 py-1 rounded-md">
                          <Mail className="h-3.5 w-3.5 text-[#74d1ea]" /> Email
                        </div>
                        <div className="flex items-center gap-1 text-sm bg-[#181c25] px-2 py-1 rounded-md">
                          <SiLinkedin className="h-3.5 w-3.5 text-[#0A66C2]" /> LinkedIn
                        </div>
                        <div className="flex items-center gap-1 text-sm bg-[#181c25] px-2 py-1 rounded-md">
                          <FileText className="h-3.5 w-3.5 text-[#74d1ea]" /> Blog
                        </div>
                      </div>
                    </div>
                    
                    {/* Performance Metrics */}
                    <div className="bg-black/40 border border-gray-800 rounded-lg p-4 space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="bg-[#0e131f] p-2 rounded-md">
                          <Zap className="h-4 w-4 text-[#74d1ea]" />
                        </div>
                        <h5 className="font-medium">Generation Details</h5>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Content Items:</span>
                          <span>{campaignContents?.length || 0}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Persona Used:</span>
                          <span className="text-[#74d1ea]">{personas?.find(p => p.id === campaign.persona_id)?.name || 'None'}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Tone Analysis:</span>
                          <span className="text-[#74d1ea]">{toneAnalyses?.find(t => t.id === campaign.tone_analysis_id)?.name || 'None'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Campaign Content Preview */}
                  <div className="mt-4">
                    <h5 className="font-medium mb-3">Generated Content Overview</h5>
                    
                    {!campaignContents || campaignContents.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-6 space-y-3 border border-gray-800 rounded-lg bg-black/20">
                        <FileText className="h-8 w-8 text-gray-500" />
                        <div className="text-center">
                          <h6 className="font-medium text-gray-300">No Campaign Factory content yet</h6>
                          <p className="text-sm text-gray-500 max-w-md mt-1">
                            Use the Campaign Factory to generate comprehensive, multi-channel content for this campaign.
                          </p>
                        </div>
                        
                        <Button
                          onClick={() => window.open('/campaign-factory', '_blank')}
                          className="mt-2 bg-[#74d1ea] hover:bg-[#5db8d0] text-black"
                          size="sm"
                        >
                          <Rocket className="h-3.5 w-3.5 mr-2" /> Generate Content
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="border border-gray-800 rounded-lg bg-black/20 p-4">
                          <ScrollArea className="h-[200px]">
                            <div className="space-y-3">
                              {campaignContents.map((content: any) => (
                                <div key={content.id} className="p-3 border border-gray-800/60 rounded-md bg-black/30">
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                      {content.type === 'email' && <Mail className="h-3.5 w-3.5 text-[#74d1ea]" />}
                                      {content.type === 'linkedin_post' && <SiLinkedin className="h-3.5 w-3.5 text-[#0A66C2]" />}
                                      {content.type === 'blog_post' && <FileText className="h-3.5 w-3.5 text-[#74d1ea]" />}
                                      <span className="font-medium text-sm capitalize">{content.type.replace('_', ' ')}</span>
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      {new Date(content.created_at).toLocaleDateString()}
                                    </div>
                                  </div>
                                  <p className="text-sm text-gray-300 line-clamp-2">{content.content_text.substring(0, 120)}...</p>
                                </div>
                              ))}
                            </div>
                          </ScrollArea>
                        </div>
                        
                        <div className="flex justify-end">
                          <Button
                            onClick={() => setActiveTab("content")}
                            variant="outline"
                            size="sm"
                            className="text-[#74d1ea] border-[#74d1ea]/30 hover:bg-[#74d1ea]/10"
                          >
                            View All Content <ArrowRight className="ml-2 h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Add Content Dialog */}
        <Dialog open={isAddContentDialogOpen} onOpenChange={setIsAddContentDialogOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Add Content to Campaign</DialogTitle>
              <DialogDescription>
                Select content to add to this campaign
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              {isLoadingAllContents ? (
                <div className="flex justify-center items-center h-[200px]">
                  <Loader2 className="h-8 w-8 animate-spin text-[#74d1ea]" />
                </div>
              ) : availableContents.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No available content</h3>
                  <p className="text-sm text-muted-foreground">
                    All your content is already in this campaign or you haven't created any content yet.
                  </p>
                </div>
              ) : (
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-2">
                    {availableContents.map((content: any) => (
                      <div
                        key={content.id}
                        className="flex items-start space-x-4 p-4 rounded-lg border border-[#1a1e29] bg-[#0e1015] hover:bg-[#181c25]"
                      >
                        <Checkbox
                          id={`content-${content.id}`}
                          checked={selectedContentIds.includes(content.id)}
                          onCheckedChange={(checked) => handleContentSelect(content.id, checked === true)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <Label
                            htmlFor={`content-${content.id}`}
                            className="flex flex-col cursor-pointer"
                          >
                            <span className="font-medium truncate">
                              {content.topic || 'Untitled Content'}
                            </span>
                            <span className="text-xs text-[#74d1ea] capitalize">
                              {content.type.replace('_', ' ')}
                            </span>
                            <div className="mt-1 text-sm line-clamp-2 text-muted-foreground">
                              {content.content_text}
                            </div>
                          </Label>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </div>
            <DialogFooter className="gap-2 sm:gap-0">
              <div className="mr-auto text-sm text-muted-foreground">
                {selectedContentIds.length} item{selectedContentIds.length !== 1 ? 's' : ''} selected
              </div>
              <Button variant="outline" onClick={() => setIsAddContentDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleAddSelectedContent}
                disabled={selectedContentIds.length === 0 || batchAddContentMutation.isPending}
                style={{ backgroundColor: "#74d1ea", color: "black" }}
              >
                {batchAddContentMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Adding...
                  </>
                ) : (
                  "Add to Campaign"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
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