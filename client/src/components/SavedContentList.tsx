import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { 
  Loader2, 
  FileText, 
  Mail, 
  Copy, 
  Download, 
  Edit, 
  Search,
  FolderSearch,
  CheckCheck,
  Send
} from "lucide-react";
import { FaLinkedin } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { GeneratedContent, Persona } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";

export default function SavedContentList() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");

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
      title: "Copied to clipboard",
      description: "Content has been copied to your clipboard.",
    });
  };
  
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
        <Loader2 className="h-8 w-8 animate-spin text-[#74d1ea]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="group relative bg-[#0a0c10] border border-gray-800/60 rounded-xl overflow-hidden transition-all p-8 text-center">
        <div className="absolute inset-0 bg-gradient-to-t from-[#74d1ea]/5 via-transparent to-transparent pointer-events-none opacity-50"></div>
        <div className="relative z-10">
          <FolderSearch className="h-16 w-16 text-gray-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Error Loading Content</h2>
          <p className="text-gray-400 mb-4">
            {error instanceof Error ? error.message : "Failed to load your saved content"}
          </p>
          <Button 
            variant="outline"
            className="border-gray-700 text-gray-300"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </div>
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
    <div className="space-y-6">
      {/* Search and filter bar */}
      <Card className="bg-[#0a0c10] border-gray-800/60 rounded-xl overflow-hidden shadow-[0_0_15px_rgba(116,209,234,0.05)]">
        <CardContent className="p-4">
          <div className="flex items-center">
            <div className="relative flex-grow mr-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by topic, content or type..."
                className="pl-10 bg-black border-gray-700 text-gray-300 w-full"
              />
            </div>
            {searchQuery && (
              <Button 
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white"
                onClick={() => setSearchQuery("")}
              >
                Clear
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
      
      {!filteredContent || filteredContent.length === 0 ? (
        <div className="group relative bg-[#0a0c10] border border-gray-800/60 rounded-xl overflow-hidden transition-all p-8 text-center">
          <div className="absolute inset-0 bg-gradient-to-t from-[#74d1ea]/5 via-transparent to-transparent pointer-events-none opacity-50"></div>
          <div className="relative z-10">
            {searchQuery ? (
              <>
                <Search className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-white mb-2">No results found</h2>
                <p className="text-gray-400 mb-4">
                  No content matches your search query "{searchQuery}"
                </p>
                <Button 
                  variant="outline"
                  className="border-gray-700 text-gray-300"
                  onClick={() => setSearchQuery("")}
                >
                  Clear Search
                </Button>
              </>
            ) : (
              <>
                <FileText className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-white mb-2">No content yet</h2>
                <p className="text-gray-400 mb-4">
                  Generate some content in the Content Generator to see it here
                </p>
                <Button 
                  variant="default"
                  className="bg-[#74d1ea] hover:bg-[#5db8d0] text-black"
                  onClick={() => window.location.href = "/content-generator"}
                >
                  Go to Content Generator
                </Button>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          {filteredContent.map((content) => (
            <Card key={content.id} className="group relative bg-[#0a0c10] border border-gray-800/60 rounded-xl overflow-hidden transition-all duration-300 shadow-[0_0_25px_rgba(116,209,234,0.05)]">
              <div className="absolute inset-0 bg-gradient-to-t from-[#74d1ea]/5 via-transparent to-transparent pointer-events-none opacity-50"></div>
              <CardHeader className="py-3 px-5 border-b border-gray-800/60 relative z-10">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Badge className={`mr-2 bg-[#74d1ea]/20 text-[#74d1ea] border-0`}>
                      {content.type === 'linkedin_post' ? (
                        <FaLinkedin className="h-3 w-3 mr-1" />
                      ) : (
                        <Mail className="h-3 w-3 mr-1" />
                      )}
                      {content.type === 'linkedin_post' ? 'LinkedIn Post' : 'Cold Email'}
                    </Badge>
                    <span className="text-sm font-medium text-white">{content.topic}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {content.persona_id && personas && (
                      <div className="hidden md:flex items-center bg-gray-900 rounded-full px-3 py-1">
                        <Avatar className="h-5 w-5 mr-2">
                          <AvatarFallback className="text-xs bg-[#74d1ea]/20 text-[#74d1ea]">
                            {getPersonaName(content.persona_id).substring(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-gray-300">{getPersonaName(content.persona_id)}</span>
                      </div>
                    )}
                    <span className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(content.created_at), { addSuffix: true })}
                    </span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
                            <path d="M3.625 7.5C3.625 8.12132 3.12132 8.625 2.5 8.625C1.87868 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.87868 6.375 2.5 6.375C3.12132 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM13.625 7.5C13.625 8.12132 13.1213 8.625 12.5 8.625C11.8787 8.625 11.375 8.12132 11.375 7.5C11.375 6.87868 11.8787 6.375 12.5 6.375C13.1213 6.375 13.625 6.87868 13.625 7.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                          </svg>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-[#111] border-gray-800">
                        <DropdownMenuItem 
                          className="text-gray-300 hover:text-white focus:text-white cursor-pointer"
                          onClick={() => handleCopyContent(content.content_text)}
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Copy to clipboard
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-gray-300 hover:text-white focus:text-white cursor-pointer"
                        >
                          <Send className="h-4 w-4 mr-2" />
                          Share
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-gray-800" />
                        <DropdownMenuItem 
                          className="text-gray-300 hover:text-white focus:text-white cursor-pointer"
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Content
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="py-4 px-5 relative z-10">
                <div className="whitespace-pre-wrap text-gray-300 text-sm">
                  {content.content_text}
                </div>
              </CardContent>
              <CardFooter className="py-3 px-5 bg-black/20 border-t border-gray-800/60 flex justify-between relative z-10">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 border-gray-700 text-gray-400 hover:text-white"
                    onClick={() => handleCopyContent(content.content_text)}
                  >
                    <Copy className="h-3.5 w-3.5 mr-1" />
                    Copy
                  </Button>
                  {content.type === 'linkedin_post' && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 border-gray-700 text-gray-400 hover:text-white"
                    >
                      <FaLinkedin className="h-3.5 w-3.5 mr-1" />
                      Post to LinkedIn
                    </Button>
                  )}
                  {content.type === 'email' && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 border-gray-700 text-gray-400 hover:text-white"
                    >
                      <Mail className="h-3.5 w-3.5 mr-1" />
                      Send Email
                    </Button>
                  )}
                </div>
                <Badge variant="outline" className="bg-[#74d1ea]/10 text-[#74d1ea] border-0">
                  <CheckCheck className="h-3 w-3 mr-1" />
                  AI Generated
                </Badge>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
