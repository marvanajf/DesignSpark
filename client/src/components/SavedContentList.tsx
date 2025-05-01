import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { 
  Loader2, 
  FileText, 
  Search,
  FolderSearch,
  Tabs,
  Grid,
  ListOrdered
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { GeneratedContent } from "@shared/schema";
import { useState } from "react";
import SavedContentListItem from "@/components/SavedContentListItem";
import { CampaignList } from "@/components/CampaignList";
import { Tabs as TabsComponent, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

export default function SavedContentList() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("content");

  // Fetch saved content
  const { data: contentList, isLoading: isLoadingContent, error } = useQuery<GeneratedContent[]>({
    queryKey: ["/api/content"],
    onError: (err: Error) => {
      toast({
        title: "Failed to load content",
        description: err.message,
        variant: "destructive",
      });
    },
    staleTime: 1000 * 60, // 1 minute
  });
  
  // Filter content based on search query
  const filteredContent = contentList?.filter(content => {
    if (!searchQuery) return true;
    
    return (
      (content.topic && content.topic.toLowerCase().includes(searchQuery.toLowerCase())) ||
      content.content_text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (content.type && content.type.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  if (isLoadingContent) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="border border-border rounded-xl overflow-hidden p-8 text-center">
        <FolderSearch className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">Error Loading Content</h2>
        <p className="text-muted-foreground mb-4">
          {error instanceof Error ? error.message : "Failed to load your saved content"}
        </p>
        <Button 
          variant="outline"
          onClick={() => window.location.reload()}
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <TabsComponent value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
          <TabsList>
            <TabsTrigger value="content" className="gap-2">
              <ListOrdered className="h-4 w-4" />
              <span>All Content</span>
            </TabsTrigger>
            <TabsTrigger value="campaigns" className="gap-2">
              <Grid className="h-4 w-4" />
              <span>Campaigns</span>
            </TabsTrigger>
          </TabsList>
          
          {activeTab === "content" && (
            <div className="w-full sm:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by topic, content or type..."
                  className="pl-10 w-full sm:w-[300px]"
                />
              </div>
            </div>
          )}
        </div>
        
        <Separator className="my-4" />
        
        <TabsContent value="content" className="mt-0 space-y-6">
          {!filteredContent || filteredContent.length === 0 ? (
            <div className="border border-dashed border-border rounded-xl overflow-hidden p-8 text-center">
              {searchQuery ? (
                <>
                  <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h2 className="text-xl font-semibold mb-2">No results found</h2>
                  <p className="text-muted-foreground mb-4">
                    No content matches your search query "{searchQuery}"
                  </p>
                  <Button 
                    variant="outline"
                    onClick={() => setSearchQuery("")}
                  >
                    Clear Search
                  </Button>
                </>
              ) : (
                <>
                  <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h2 className="text-xl font-semibold mb-2">No content yet</h2>
                  <p className="text-muted-foreground mb-4">
                    Generate some content in the Content Generator to see it here
                  </p>
                  <Button 
                    variant="default"
                    onClick={() => window.location.href = "/content-generator"}
                  >
                    Go to Content Generator
                  </Button>
                </>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredContent.map((content) => (
                <SavedContentListItem 
                  key={content.id} 
                  content={content} 
                />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="campaigns" className="mt-0">
          <CampaignList />
        </TabsContent>
      </TabsComponent>
    </div>
  );
}
