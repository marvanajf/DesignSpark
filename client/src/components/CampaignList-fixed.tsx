import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Campaign, InsertCampaign } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CampaignModal } from "@/components/CampaignModal";
import { SubscriptionLimitModal } from "@/components/SubscriptionLimitModal";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Loader2, 
  MoreVertical, 
  Pencil, 
  Plus, 
  Search, 
  Trash2, 
  FolderOpen,
  LayoutGrid
} from "lucide-react";

// Define custom error type
class LimitError extends Error {
  isLimitError: boolean;
  limitData: {
    limitType: "campaigns";
    currentUsage: number;
    limit: number;
    currentPlan: string;
  };

  constructor(message: string, limitData: any) {
    super(message);
    this.name = "LimitError";
    this.isLimitError = true;
    this.limitData = limitData;
  }
}

export function CampaignList() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCampaignId, setSelectedCampaignId] = useState<number | null>(null);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  // Subscription limit modal state
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [limitData, setLimitData] = useState<{
    limitType: "campaigns";
    currentUsage: number;
    limit: number;
    currentPlan: string;
  } | null>(null);

  // Get all campaigns for the user
  const { data: campaigns, isLoading } = useQuery<Campaign[]>({
    queryKey: ["/api/campaigns"],
    staleTime: 1000 * 60, // 1 minute
  });

  // Create a new campaign
  const createCampaignMutation = useMutation({
    mutationFn: async (data: Omit<InsertCampaign, "user_id">) => {
      try {
        const res = await fetch("/api/campaigns", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...data,
            user_id: user?.id,
            status: "active",
          }),
          credentials: "include"
        });

        // Check if we hit a subscription limit (402 Payment Required)
        if (res.status === 402) {
          const limitData = await res.json();
          // Instead of throwing a plain object, create a proper Error object with our custom class
          throw new LimitError("Subscription limit reached", {
            limitType: "campaigns" as const,
            currentUsage: limitData.current || limitData.currentUsage, 
            limit: limitData.limit,
            currentPlan: user?.subscription_plan || "free" 
          });
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
        // Rethrow all errors - the custom error type will be handled properly
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/campaigns"] });
      setIsCreateModalOpen(false);
      setFormData({ name: "", description: "" });
      toast({
        title: "Campaign created",
        description: "Your campaign has been created successfully",
      });
    },
    onError: (error: any) => {
      // Check if this was a subscription limit error
      if (error instanceof LimitError) {
        setLimitData(error.limitData);
        setShowLimitModal(true);
        setIsCreateModalOpen(false);
        return;
      }
      
      toast({
        title: "Failed to create campaign",
        description: error.message || "An error occurred",
        variant: "destructive",
      });
    },
  });

  // Update a campaign
  const updateCampaignMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Campaign> }) => {
      try {
        const res = await fetch(`/api/campaigns/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
          credentials: "include"
        });

        // Check if we hit a subscription limit (402 Payment Required)
        if (res.status === 402) {
          const limitData = await res.json();
          throw new LimitError("Subscription limit reached", {
            limitType: "campaigns" as const,
            currentUsage: limitData.current || limitData.currentUsage, 
            limit: limitData.limit,
            currentPlan: user?.subscription_plan || "free" 
          });
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
        // Rethrow all errors - the custom error type will be handled properly
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/campaigns"] });
      setIsEditModalOpen(false);
      setSelectedCampaign(null);
      toast({
        title: "Campaign updated",
        description: "Your campaign has been updated successfully",
      });
    },
    onError: (error: any) => {
      // Check if this was a subscription limit error
      if (error instanceof LimitError) {
        setLimitData(error.limitData);
        setShowLimitModal(true);
        setIsEditModalOpen(false);
        return;
      }
      
      toast({
        title: "Failed to update campaign",
        description: error.message || "An error occurred",
        variant: "destructive",
      });
    },
  });

  // Delete a campaign
  const deleteCampaignMutation = useMutation({
    mutationFn: async (id: number) => {
      try {
        const res = await fetch(`/api/campaigns/${id}`, {
          method: "DELETE",
          credentials: "include"
        });

        // Check if we hit a subscription limit (402 Payment Required)
        if (res.status === 402) {
          const limitData = await res.json();
          throw new LimitError("Subscription limit reached", {
            limitType: "campaigns" as const,
            currentUsage: limitData.current || limitData.currentUsage, 
            limit: limitData.limit,
            currentPlan: user?.subscription_plan || "free" 
          });
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
        // Rethrow all errors - the custom error type will be handled properly
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/campaigns"] });
      setIsDeleteModalOpen(false);
      setSelectedCampaignId(null);
      toast({
        title: "Campaign deleted",
        description: "The campaign has been deleted successfully",
      });
    },
    onError: (error: any) => {
      // Check if this was a subscription limit error
      if (error instanceof LimitError) {
        setLimitData(error.limitData);
        setShowLimitModal(true);
        setIsDeleteModalOpen(false);
        return;
      }
      
      toast({
        title: "Failed to delete campaign",
        description: error.message || "An error occurred",
        variant: "destructive",
      });
    },
  });

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createCampaignMutation.mutateAsync({
      name: formData.name,
      description: formData.description || null,
    });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCampaign) return;

    await updateCampaignMutation.mutateAsync({
      id: selectedCampaign.id,
      data: {
        name: formData.name,
        description: formData.description || null,
      },
    });
  };

  const handleDeleteConfirm = async () => {
    if (selectedCampaignId) {
      await deleteCampaignMutation.mutateAsync(selectedCampaignId);
    }
  };

  const openCampaignModal = (campaign: Campaign) => {
    setSelectedCampaignId(campaign.id);
  };

  const openEditModal = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setFormData({
      name: campaign.name,
      description: campaign.description || "",
    });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (id: number) => {
    setSelectedCampaignId(id);
    setIsDeleteModalOpen(true);
  };

  const filteredCampaigns = campaigns?.filter(campaign => {
    if (!searchQuery) return true;
    return (
      campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (campaign.description?.toLowerCase() || "").includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center mb-6">
        <div className="relative flex-1 w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search campaigns..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button 
          onClick={() => setIsCreateModalOpen(true)}
          className="gap-1 whitespace-nowrap"
          style={{ backgroundColor: "#74d1ea", color: "black" }}
        >
          <Plus className="h-4 w-4" /> New Campaign
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-10 w-10 animate-spin text-[#74d1ea]" />
        </div>
      ) : !campaigns || campaigns.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <div className="rounded-full bg-[#181c25] p-4">
            <LayoutGrid className="h-8 w-8 text-[#74d1ea]" />
          </div>
          <h2 className="text-xl font-bold">No campaigns yet</h2>
          <p className="text-muted-foreground text-center max-w-md">
            Create your first campaign to organize your content for different marketing initiatives
          </p>
          <Button 
            onClick={() => setIsCreateModalOpen(true)} 
            className="gap-1"
            style={{ backgroundColor: "#74d1ea", color: "black" }}
          >
            <Plus className="h-4 w-4" /> Create Your First Campaign
          </Button>
        </div>
      ) : filteredCampaigns?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <Search className="h-8 w-8 text-muted-foreground" />
          <h2 className="text-xl font-bold">No matching campaigns</h2>
          <p className="text-muted-foreground text-center max-w-md">
            No campaigns match your search query. Try a different search or clear the search field.
          </p>
          <Button 
            variant="outline" 
            onClick={() => setSearchQuery("")}
          >
            Clear Search
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {filteredCampaigns?.map((campaign) => (
            <Card key={campaign.id} className="overflow-hidden hover:bg-[#0e1015] transition-colors">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-[#181c25]">
                      <span className="text-base font-medium uppercase text-[#74d1ea]">
                        {campaign.name.substring(0, 2)}
                      </span>
                    </div>
                    <div>
                      <CardTitle className="text-lg">{campaign.name}</CardTitle>
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
                        onClick={() => openCampaignModal(campaign)}
                        className="cursor-pointer"
                      >
                        <FolderOpen className="mr-2 h-4 w-4" /> View Campaign
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => openEditModal(campaign)}
                        className="cursor-pointer"
                      >
                        <Pencil className="mr-2 h-4 w-4" /> Edit Campaign
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => openDeleteModal(campaign.id)}
                        className="cursor-pointer text-destructive focus:text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Delete Campaign
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="pb-3">
                {campaign.description ? (
                  <CardDescription className="line-clamp-3">{campaign.description}</CardDescription>
                ) : (
                  <CardDescription className="text-muted-foreground italic">No description</CardDescription>
                )}
              </CardContent>
              <CardFooter className="flex justify-between items-center pt-3 text-muted-foreground text-sm">
                <div>Status: {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}</div>
                <div>{new Date(campaign.created_at).toLocaleDateString()}</div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Create Campaign Dialog */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="bg-black border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>Create New Campaign</DialogTitle>
            <DialogDescription className="text-gray-400">
              Organize your content into a targeted marketing campaign.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Campaign Name</Label>
                <Input
                  id="name"
                  className="bg-black border-gray-700 text-white focus:border-[#74d1ea] focus:ring-1 focus:ring-[#74d1ea] focus:shadow-[0_0_10px_rgba(116,209,234,0.3)]"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="E.g., Q4 Product Launch"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  className="h-24 bg-black border-gray-700 text-white focus:border-[#74d1ea] focus:ring-1 focus:ring-[#74d1ea] focus:shadow-[0_0_10px_rgba(116,209,234,0.3)]"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of the campaign's purpose and goals"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={createCampaignMutation.isPending || !formData.name.trim()}
                style={{ backgroundColor: "#74d1ea", color: "black" }}
              >
                {createCampaignMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...
                  </>
                ) : (
                  "Create Campaign"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Campaign Dialog */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="bg-black border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>Edit Campaign</DialogTitle>
            <DialogDescription className="text-gray-400">
              Update your campaign details.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Campaign Name</Label>
                <Input
                  id="edit-name"
                  className="bg-black border-gray-700 text-white focus:border-[#74d1ea] focus:ring-1 focus:ring-[#74d1ea] focus:shadow-[0_0_10px_rgba(116,209,234,0.3)]"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description (Optional)</Label>
                <Textarea
                  id="edit-description"
                  className="h-24 bg-black border-gray-700 text-white focus:border-[#74d1ea] focus:ring-1 focus:ring-[#74d1ea] focus:shadow-[0_0_10px_rgba(116,209,234,0.3)]"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                type="button"
                onClick={() => setIsEditModalOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={updateCampaignMutation.isPending || !formData.name.trim()}
                style={{ backgroundColor: "#74d1ea", color: "black" }}
              >
                {updateCampaignMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...
                  </>
                ) : (
                  "Update Campaign"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Campaign Dialog */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="bg-black border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>Delete Campaign</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this campaign? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleDeleteConfirm} 
              disabled={deleteCampaignMutation.isPending}
              variant="destructive"
            >
              {deleteCampaignMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Deleting...
                </>
              ) : (
                "Delete Campaign"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Campaign Details Modal */}
      {selectedCampaignId && (
        <CampaignModal
          campaignId={selectedCampaignId}
          isOpen={!!selectedCampaignId}
          onClose={() => setSelectedCampaignId(null)}
        />
      )}

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
    </div>
  );
}