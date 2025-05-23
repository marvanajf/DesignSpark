import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useLocation, Link } from "wouter";
import { Campaign, GeneratedContent } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { Loader2, ArrowLeft, Plus, Folder, FileText } from "lucide-react";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import SavedContentListItem from "../components/SavedContentListItem";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

export default function CampaignPage() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isAddContentDialogOpen, setIsAddContentDialogOpen] = useState(false);
  const [selectedContentIds, setSelectedContentIds] = useState<number[]>([]);
  
  const campaignId = parseInt(id);
  
  const { data: campaign, isLoading: isLoadingCampaign } = useQuery<Campaign>({
    queryKey: [`/api/campaigns/${campaignId}`],
    staleTime: 1000 * 60, // 1 minute
    enabled: !isNaN(campaignId),
  });

  const { data: campaignContents, isLoading: isLoadingContents } = useQuery<GeneratedContent[]>({
    queryKey: [`/api/campaigns/${campaignId}/contents`],
    staleTime: 1000 * 60, // 1 minute
    enabled: !isNaN(campaignId),
  });

  const { data: allContents, isLoading: isLoadingAllContents } = useQuery<GeneratedContent[]>({
    queryKey: ["/api/content"],
    staleTime: 1000 * 60, // 1 minute
    enabled: isAddContentDialogOpen, // Only fetch when dialog is open
  });

  const addContentMutation = useMutation({
    mutationFn: async (contentId: number) => {
      const res = await apiRequest("POST", "/api/campaign-contents", {
        campaign_id: campaignId,
        content_id: contentId,
      });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/campaigns/${campaignId}/contents`] });
    },
    onError: (error) => {
      toast({
        title: "Failed to add content",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const removeContentMutation = useMutation({
    mutationFn: async (contentId: number) => {
      await apiRequest("DELETE", `/api/campaign-contents/${campaignId}/${contentId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/campaigns/${campaignId}/contents`] });
      toast({
        title: "Content removed",
        description: "The content was removed from this campaign",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to remove content",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const batchAddContentMutation = useMutation({
    mutationFn: async (contentIds: number[]) => {
      // Add all selected content to the campaign
      const promises = contentIds.map(contentId =>
        addContentMutation.mutateAsync(contentId)
      );
      return Promise.all(promises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/campaigns/${campaignId}/contents`] });
      toast({
        title: "Content added",
        description: `Added ${selectedContentIds.length} content items to this campaign`,
      });
      setSelectedContentIds([]);
      setIsAddContentDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Failed to add content",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    // Redirect if campaign ID is not a valid number
    if (isNaN(campaignId)) {
      navigate("/saved-content");
    }
  }, [campaignId, navigate]);

  const handleRemoveContent = (contentId: number) => {
    removeContentMutation.mutate(contentId);
  };

  const handleContentSelect = (contentId: number, checked: boolean) => {
    if (checked) {
      setSelectedContentIds(prev => [...prev, contentId]);
    } else {
      setSelectedContentIds(prev => prev.filter(id => id !== contentId));
    }
  };

  const handleAddSelectedContent = () => {
    if (selectedContentIds.length === 0) {
      toast({
        title: "No content selected",
        description: "Please select at least one content item to add",
        variant: "destructive",
      });
      return;
    }

    batchAddContentMutation.mutate(selectedContentIds);
  };

  if (isLoadingCampaign || isLoadingContents) {
    return (
      <div className="container py-8">
        <div className="flex justify-center items-center h-[300px]">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="container py-8">
        <div className="flex flex-col items-center justify-center space-y-4 py-12">
          <Folder className="h-16 w-16 text-muted-foreground" />
          <h2 className="text-2xl font-bold">Campaign not found</h2>
          <p className="text-muted-foreground">The campaign you're looking for doesn't exist or you don't have access to it.</p>
          <Button asChild>
            <Link href="/saved-content">Go to Saved Content</Link>
          </Button>
        </div>
      </div>
    );
  }

  const availableContents = allContents?.filter(content => {
    // Filter out content already in the campaign
    return !campaignContents?.some(cc => cc.id === content.id);
  }) || [];

  return (
    <div className="container py-6">
      {/* Header section */}
      <div className="mb-8">
        <Button variant="ghost" className="mb-4 -ml-3 gap-1 hover:bg-[#181c25]" asChild>
          <Link href="/saved-content">
            <ArrowLeft className="h-4 w-4" /> Back to Saved Content
          </Link>
        </Button>
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <span className="flex items-center justify-center h-10 w-10 rounded-full bg-[#181c25]">
                <span className="text-base font-medium uppercase text-[#74d1ea]">
                  {campaign.name.substring(0, 2)}
                </span>
              </span>
              {campaign.name}
            </h1>
            {campaign.description && (
              <p className="text-muted-foreground mt-2 max-w-2xl">{campaign.description}</p>
            )}
          </div>
          <Button 
            className="gap-1" 
            style={{ backgroundColor: "#74d1ea", color: "black" }}
            onClick={() => setIsAddContentDialogOpen(true)}
          >
            <Plus className="h-4 w-4" /> Add Content
          </Button>
        </div>
      </div>

      {/* Campaign overview card */}
      <div className="mb-8 p-6 rounded-xl bg-[#0e1015] border-0">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-3">Campaign Details</h3>
            <div className="space-y-2 mt-2">
              <div className="text-sm">
                <span className="text-xs uppercase font-semibold text-[#74d1ea] block mb-2">KEY DETAILS</span>
              </div>
              <div className="grid gap-3">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Created:</span>
                  <span>{new Date(campaign.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Content items:</span>
                  <span>{campaignContents?.length || 0}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Status:</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#181c25] text-[#74d1ea]">
                    {campaign.status || 'Active'}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-3">Campaign Organization</h3>
            <p className="text-muted-foreground mb-6">
              Campaigns allow you to organize related content into collections for easier management and access.
            </p>
            <Button 
              variant="outline" 
              className="gap-1 border-[#74d1ea]/30" 
              onClick={() => setIsAddContentDialogOpen(true)}
            >
              <Plus className="h-4 w-4" /> Add More Content
            </Button>
          </div>
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
                  {availableContents.map(content => (
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

      {/* Campaign Content */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Campaign Content</h2>
        
        {!campaignContents || campaignContents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-4 border border-[#1a1e29] bg-[#0e1015] rounded-lg overflow-hidden">
            <FileText className="h-14 w-14 text-muted-foreground" />
            <h2 className="text-xl font-semibold">No content in this campaign</h2>
            <p className="text-muted-foreground text-center max-w-md">
              This campaign doesn't have any content yet. Add some from your saved content.
            </p>
            <Button 
              onClick={() => setIsAddContentDialogOpen(true)}
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
            <div className="grid gap-4">
              {campaignContents.map((content) => (
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
  );
}