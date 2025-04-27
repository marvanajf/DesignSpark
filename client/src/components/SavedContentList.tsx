import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Linkedin, Mail, Copy, Download, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GeneratedContent, Persona } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";

export default function SavedContentList() {
  const { toast } = useToast();

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
  });

  // Fetch personas for display
  const { data: personas } = useQuery<Persona[]>({
    queryKey: ["/api/personas"],
  });

  const handleCopyContent = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Content copied",
      description: "Content has been copied to your clipboard",
    });
  };

  if (isLoadingContent) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-bold text-destructive">Error loading content</h2>
        <p className="text-muted-foreground mt-2">
          {error instanceof Error ? error.message : "Failed to load your saved content"}
        </p>
      </div>
    );
  }

  if (!contentList || contentList.length === 0) {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl font-semibold mb-2">No content yet</h2>
        <p className="text-muted-foreground">
          Generate some content to see it here
        </p>
      </div>
    );
  }

  // Get persona name by ID
  const getPersonaName = (personaId: number | null) => {
    if (!personaId || !personas) return "Unknown";
    const persona = personas.find(p => p.id === personaId);
    return persona ? persona.name : "Unknown";
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Your Content</h2>
      </div>
      
      <div className="bg-card rounded-lg shadow overflow-hidden">
        <ul className="divide-y divide-border">
          {contentList.map((content) => (
            <li key={content.id}>
              <div className="px-6 py-4 flex items-center">
                <div className="flex-shrink-0">
                  {content.type === 'linkedin_post' ? (
                    <Linkedin className="h-5 w-5 text-blue-500" />
                  ) : (
                    <Mail className="h-5 w-5 text-yellow-500" />
                  )}
                </div>
                <div className="ml-4 flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium truncate w-full md:w-96">
                        {content.content_text.split('\n')[0].substring(0, 80)}...
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {content.type === 'linkedin_post' ? 'LinkedIn Post' : 'Cold Email'} • 
                        {content.persona_id && personas ? ` ${getPersonaName(content.persona_id)} Persona` : ''} • 
                        {content.topic ? ` Topic: ${content.topic}` : ''}
                      </p>
                    </div>
                    <div className="flex space-x-3">
                      <button 
                        className="p-1 rounded-full text-muted-foreground hover:text-foreground"
                        onClick={() => {/* Edit functionality would be implemented here */}}
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        className="p-1 rounded-full text-muted-foreground hover:text-foreground"
                        onClick={() => handleCopyContent(content.content_text)}
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                      <button 
                        className="p-1 rounded-full text-muted-foreground hover:text-foreground"
                        onClick={() => {/* Download functionality would be implemented here */}}
                      >
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2 hidden sm:block">
                    Created {formatDistanceToNow(new Date(content.created_at), { addSuffix: true })}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
