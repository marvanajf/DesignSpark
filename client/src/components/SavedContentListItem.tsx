import { GeneratedContent } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { 
  Copy, 
  Trash2, 
  RefreshCw, 
  ExternalLink, 
  MoreHorizontal, 
  FileText, 
  FolderPlus, 
  FolderMinus 
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface SavedContentListItemProps {
  content: GeneratedContent;
  onRemoveFromCampaign?: () => void;
  showCampaignActions?: boolean;
}

export default function SavedContentListItem({ 
  content, 
  onRemoveFromCampaign,
  showCampaignActions = false 
}: SavedContentListItemProps) {
  const { toast } = useToast();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showAddToCampaignDialog, setShowAddToCampaignDialog] = useState(false);
  const [selectedCampaignIds, setSelectedCampaignIds] = useState<number[]>([]);
  
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/content/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/content"] });
      toast({
        title: "Content deleted",
        description: "Your content has been deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to delete content",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(content.content_text);
    toast({
      title: "Content copied",
      description: "The content has been copied to your clipboard",
    });
  };

  const handleDelete = () => {
    deleteMutation.mutate(content.id);
    setShowDeleteConfirm(false);
  };

  const getContentTypeIcon = () => {
    switch (content.type) {
      case "linkedin_post":
        return <Badge variant="outline" className="flex items-center gap-1 capitalize">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24">
            <path fill="#0A66C2" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037c-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85c3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065c0-1.138.92-2.063 2.063-2.063c1.14 0 2.064.925 2.064 2.063c0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
          LinkedIn Post
        </Badge>;
      case "cold_email":
        return <Badge variant="outline" className="flex items-center gap-1 capitalize">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="20" height="16" x="2" y="4" rx="2"/>
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
          </svg>
          Cold Email
        </Badge>;
      case "webinar":
        return <Badge variant="outline" className="flex items-center gap-1 capitalize">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="18" height="14" x="3" y="3" rx="2"/>
            <circle cx="12" cy="10" r="3"/>
            <path d="M7 21v-2a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2"/>
          </svg>
          Webinar
        </Badge>;
      case "workshop":
        return <Badge variant="outline" className="flex items-center gap-1 capitalize">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 3h20"/>
            <path d="M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3"/>
            <path d="m7 21 5-5 5 5"/>
          </svg>
          Workshop
        </Badge>;
      default:
        return <Badge variant="outline" className="flex items-center gap-1 capitalize">
          <FileText className="h-3 w-3" />
          {content.type.replace('_', ' ')}
        </Badge>;
    }
  };

  return (
    <Card className="overflow-hidden group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1.5">
            <div className="flex gap-2 flex-wrap">
              {getContentTypeIcon()}
            </div>
            <CardTitle className="line-clamp-1">{content.topic || 'Untitled Content'}</CardTitle>
            {content.further_details && (
              <CardDescription className="line-clamp-2">
                {content.further_details}
              </CardDescription>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">More options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleCopy}>
                <Copy className="mr-2 h-4 w-4" />
                Copy text
              </DropdownMenuItem>
              
              {!showCampaignActions && (
                <DropdownMenuItem onClick={() => setShowAddToCampaignDialog(true)}>
                  <FolderPlus className="mr-2 h-4 w-4" />
                  Add to campaign
                </DropdownMenuItem>
              )}

              {showCampaignActions && onRemoveFromCampaign && (
                <DropdownMenuItem onClick={onRemoveFromCampaign}>
                  <FolderMinus className="mr-2 h-4 w-4" />
                  Remove from campaign
                </DropdownMenuItem>
              )}
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem 
                onClick={() => setShowDeleteConfirm(true)}
                className="text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="text-sm">
        <div className="prose prose-sm prose-stone dark:prose-invert max-w-none line-clamp-4">
          {content.content_text}
        </div>
      </CardContent>
      <CardFooter className="border-t p-3 bg-background/5 flex justify-between items-center">
        <div className="text-xs text-muted-foreground">
          Created: {new Date(content.created_at).toLocaleDateString()}
        </div>
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleCopy}
            title="Copy text"
          >
            <Copy className="h-4 w-4" />
            <span className="sr-only">Copy</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => window.open(`/content/${content.id}`, '_blank')}
            title="Open in new tab"
          >
            <ExternalLink className="h-4 w-4" />
            <span className="sr-only">Open</span>
          </Button>
        </div>
      </CardFooter>

      {/* Delete confirmation dialog */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Content</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this content? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Add to Campaign Dialog */}
      <Dialog open={showAddToCampaignDialog} onOpenChange={setShowAddToCampaignDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add to Campaign</DialogTitle>
            <DialogDescription>
              Select campaigns to add this content to
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="text-center py-8">
              {/* This will be populated with campaign list when we implement the feature */}
              <FolderPlus className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">Coming Soon</h3>
              <p className="text-sm text-muted-foreground">
                Campaign functionality is currently being implemented.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddToCampaignDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}