import { useQuery, useMutation } from "@tanstack/react-query";
import { Campaign, InsertCampaign } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { Loader2, Plus, Folder, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export function CampaignList() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentCampaign, setCurrentCampaign] = useState<Campaign | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const { data: campaigns, isLoading } = useQuery<Campaign[]>({
    queryKey: ["/api/campaigns"],
    staleTime: 1000 * 60, // 1 minute
  });

  const createCampaignMutation = useMutation({
    mutationFn: async (campaign: InsertCampaign) => {
      const res = await apiRequest("POST", "/api/campaigns", campaign);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/campaigns"] });
      toast({
        title: "Campaign created",
        description: "Your campaign was created successfully",
      });
      resetForm();
      setIsCreateDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Failed to create campaign",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateCampaignMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertCampaign> }) => {
      const res = await apiRequest("PATCH", `/api/campaigns/${id}`, data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/campaigns"] });
      toast({
        title: "Campaign updated",
        description: "Your campaign was updated successfully",
      });
      resetForm();
      setIsEditDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Failed to update campaign",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteCampaignMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/campaigns/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/campaigns"] });
      toast({
        title: "Campaign deleted",
        description: "Your campaign was deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to delete campaign",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleCreateCampaign = () => {
    if (!name) {
      toast({
        title: "Campaign name required",
        description: "Please enter a name for your campaign",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to create a campaign",
        variant: "destructive",
      });
      return;
    }

    createCampaignMutation.mutate({
      name,
      description: description || null,
      user_id: user.id,
      status: "active",
    });
  };

  const handleUpdateCampaign = () => {
    if (!currentCampaign) return;
    
    if (!name) {
      toast({
        title: "Campaign name required",
        description: "Please enter a name for your campaign",
        variant: "destructive",
      });
      return;
    }

    updateCampaignMutation.mutate({
      id: currentCampaign.id,
      data: {
        name,
        description: description || null,
      },
    });
  };

  const handleDelete = (id: number) => {
    deleteCampaignMutation.mutate(id);
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setCurrentCampaign(null);
  };

  const openEditDialog = (campaign: Campaign) => {
    setCurrentCampaign(campaign);
    setName(campaign.name);
    setDescription(campaign.description || "");
    setIsEditDialogOpen(true);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsCreateDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Your Campaigns</h2>
        <Button onClick={openCreateDialog} className="gap-1">
          <Plus className="h-4 w-4" /> New Campaign
        </Button>
      </div>

      {/* Create Campaign Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Campaign</DialogTitle>
            <DialogDescription>
              Organize your content by creating a new campaign.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="campaign-name">Name</Label>
              <Input
                id="campaign-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Campaign name"
                className="col-span-3"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="campaign-description">Description (optional)</Label>
              <Textarea
                id="campaign-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Campaign description"
                className="col-span-3 min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateCampaign} disabled={createCampaignMutation.isPending}>
              {createCampaignMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...
                </>
              ) : (
                "Create Campaign"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Campaign Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Campaign</DialogTitle>
            <DialogDescription>
              Update your campaign details.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-campaign-name">Name</Label>
              <Input
                id="edit-campaign-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Campaign name"
                className="col-span-3"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-campaign-description">Description (optional)</Label>
              <Textarea
                id="edit-campaign-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Campaign description"
                className="col-span-3 min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateCampaign} disabled={updateCampaignMutation.isPending}>
              {updateCampaignMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...
                </>
              ) : (
                "Update Campaign"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {campaigns && campaigns.length > 0 ? (
          campaigns.map((campaign) => (
            <Card key={campaign.id} className="overflow-hidden">
              <CardHeader className="bg-background/5 pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2">
                      <Folder className="h-5 w-5 text-primary" />
                      <span className="truncate">{campaign.name}</span>
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {campaign.description || "No description provided"}
                    </CardDescription>
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditDialog(campaign)}
                      className="h-8 w-8"
                    >
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Campaign</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this campaign? This action cannot be undone
                            and will remove all content associations.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(campaign.id)}
                            className="bg-destructive hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="text-sm text-muted-foreground">
                  Created: {new Date(campaign.created_at).toLocaleDateString()}
                </div>
              </CardContent>
              <CardFooter className="border-t bg-background/5 py-3">
                <Button
                  variant="default"
                  size="sm"
                  className="w-full"
                  asChild
                >
                  <a href={`/campaign/${campaign.id}`}>View Campaign</a>
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center p-8 border rounded-lg border-dashed">
            <Folder className="h-10 w-10 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-1">No campaigns yet</h3>
            <p className="text-sm text-muted-foreground text-center mb-4">
              Create your first campaign to organize your content
            </p>
            <Button onClick={openCreateDialog}>
              <Plus className="mr-2 h-4 w-4" />
              Create Campaign
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}