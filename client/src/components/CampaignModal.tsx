import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { Loader2, Plus, Search, FileText } from "lucide-react";
import SavedContentListItem from "./SavedContentListItem";

interface CampaignModalProps {
  campaignId: number;
  isOpen: boolean;
  onClose: () => void;
}

export function CampaignModal({ campaignId, isOpen, onClose }: CampaignModalProps) {
  const [isAddContentDialogOpen, setIsAddContentDialogOpen] = useState(false);
  const [selectedContentIds, setSelectedContentIds] = useState<number[]>([]);
  const queryClient = useQueryClient();

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

  // Add content to campaign mutation
  const batchAddContentMutation = useMutation({
    mutationFn: async (contentIds: number[]) => {
      // Create an array of promises that add each content one by one
      const promises = contentIds.map(contentId => 
        apiRequest("POST", "/api/campaign-contents", {
          campaign_id: campaignId,
          content_id: contentId
        })
      );
      // Wait for all promises to complete
      return await Promise.all(promises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/campaigns/${campaignId}/contents`] });
      setSelectedContentIds([]);
      setIsAddContentDialogOpen(false);
    },
  });

  // Remove content from campaign mutation
  const removeContentMutation = useMutation({
    mutationFn: async (contentId: number) => {
      return await apiRequest("DELETE", `/api/campaign-contents/${campaignId}/${contentId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/campaigns/${campaignId}/contents`] });
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
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <span className="flex items-center justify-center h-8 w-8 rounded-full bg-[#181c25]">
              <span className="text-base font-medium uppercase text-[#74d1ea]">
                {campaign.name.substring(0, 2)}
              </span>
            </span>
            {campaign.name}
          </DialogTitle>
          {campaign.description && (
            <DialogDescription className="mt-1">{campaign.description}</DialogDescription>
          )}
        </DialogHeader>

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

          {/* Campaign Content */}
          <div>
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
                <div className="grid gap-4 max-h-[400px] overflow-y-auto pr-2">
                  {campaignContents.map((content: any) => (
                    <SavedContentListItem
                      key={content.id}
                      content={content}
                      onRemoveFromCampaign={() => handleRemoveContent(content.id)}
                      showCampaignActions={true}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
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
      </DialogContent>
    </Dialog>
  );
}