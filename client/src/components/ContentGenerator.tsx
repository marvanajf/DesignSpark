import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { Loader2, Linkedin, Mail, Copy, Download, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ToneAnalysis, Persona, GeneratedContent } from "@shared/schema";

export default function ContentGenerator() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  
  const [contentType, setContentType] = useState<'linkedin_post' | 'email'>('linkedin_post');
  const [personaId, setPersonaId] = useState<string>("");
  const [toneAnalysisId, setToneAnalysisId] = useState<string>("");
  const [topic, setTopic] = useState<string>("");
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);

  // Fetch tone analyses
  const { data: toneAnalyses, isLoading: isLoadingTones } = useQuery<ToneAnalysis[]>({
    queryKey: ["/api/tone-analyses"],
    onError: (err: Error) => {
      toast({
        title: "Failed to load tone analyses",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  // Fetch selected personas
  const { data: personas, isLoading: isLoadingPersonas } = useQuery<Persona[]>({
    queryKey: ["/api/personas"],
    onError: (err: Error) => {
      toast({
        title: "Failed to load personas",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  // Generate content mutation
  const generateContentMutation = useMutation({
    mutationFn: async (data: { 
      type: 'linkedin_post' | 'email'; 
      personaId: number; 
      toneAnalysisId: number;
      topic: string;
    }) => {
      const res = await apiRequest("POST", "/api/content", data);
      return res.json();
    },
    onSuccess: (data: GeneratedContent) => {
      queryClient.invalidateQueries({ queryKey: ["/api/content"] });
      setGeneratedContent(data);
      toast({
        title: "Content generated",
        description: `Your ${contentType === 'linkedin_post' ? 'LinkedIn post' : 'cold email'} has been created`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Generation failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleContentTypeChange = (type: 'linkedin_post' | 'email') => {
    setContentType(type);
  };

  const handleGenerate = () => {
    if (!personaId) {
      toast({
        title: "Missing information",
        description: "Please select a target persona",
        variant: "destructive",
      });
      return;
    }

    if (!toneAnalysisId) {
      toast({
        title: "Missing information",
        description: "Please select a tone analysis",
        variant: "destructive",
      });
      return;
    }

    if (!topic) {
      toast({
        title: "Missing information",
        description: "Please enter a topic for your content",
        variant: "destructive",
      });
      return;
    }

    generateContentMutation.mutate({
      type: contentType,
      personaId: parseInt(personaId),
      toneAnalysisId: parseInt(toneAnalysisId),
      topic,
    });
  };

  const handleCopyContent = () => {
    if (generatedContent) {
      navigator.clipboard.writeText(generatedContent.content_text);
      toast({
        title: "Content copied",
        description: "Content has been copied to your clipboard",
      });
    }
  };

  const isLoading = isLoadingTones || isLoadingPersonas;
  const selectedPersonas = personas?.filter(p => p.is_selected) || [];

  // Attempt to auto-select values if there's only one option
  useEffect(() => {
    if (toneAnalyses && toneAnalyses.length === 1 && !toneAnalysisId) {
      setToneAnalysisId(toneAnalyses[0].id.toString());
    }
    
    if (selectedPersonas.length === 1 && !personaId) {
      setPersonaId(selectedPersonas[0].id.toString());
    }
  }, [toneAnalyses, selectedPersonas, toneAnalysisId, personaId]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-extrabold sm:text-4xl">Generate Content</h1>
        <p className="mt-3 text-xl text-muted-foreground">
          Create perfectly tailored content based on your brand's tone and selected personas.
        </p>
      </div>
      
      <Card className="mb-10">
        <CardHeader>
          <CardTitle>Generation Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
            <h2 className="text-lg font-medium">Content Parameters</h2>
          </div>
          
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Content Type */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Content Type
              </label>
              <div className="mt-1">
                <div className="flex rounded-md shadow-sm">
                  <Button
                    type="button"
                    variant={contentType === 'linkedin_post' ? 'default' : 'outline'}
                    onClick={() => handleContentTypeChange('linkedin_post')}
                    className="flex-1 rounded-r-none"
                  >
                    <Linkedin className="mr-2 h-4 w-4" />
                    LinkedIn Post
                  </Button>
                  <Button
                    type="button"
                    variant={contentType === 'email' ? 'default' : 'outline'}
                    onClick={() => handleContentTypeChange('email')}
                    className="flex-1 rounded-l-none"
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    Cold Email
                  </Button>
                </div>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Choose the type of content to generate
              </p>
            </div>
            
            {/* Selected Persona */}
            <div>
              <label htmlFor="selected-persona" className="block text-sm font-medium mb-2">
                Target Persona
              </label>
              <Select 
                value={personaId} 
                onValueChange={setPersonaId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a persona" />
                </SelectTrigger>
                <SelectContent>
                  {selectedPersonas.map((persona) => (
                    <SelectItem key={persona.id} value={persona.id.toString()}>
                      {persona.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="mt-1 text-xs text-muted-foreground">
                Content will be tailored for this audience
              </p>
            </div>
            
            {/* Tone Analysis */}
            <div>
              <label htmlFor="tone-analysis" className="block text-sm font-medium mb-2">
                Tone Analysis
              </label>
              <Select 
                value={toneAnalysisId} 
                onValueChange={setToneAnalysisId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a tone analysis" />
                </SelectTrigger>
                <SelectContent>
                  {toneAnalyses?.map((analysis) => (
                    <SelectItem key={analysis.id} value={analysis.id.toString()}>
                      {analysis.website_url ? `Website: ${analysis.website_url}` : 'Content Sample'} ({new Date(analysis.created_at).toLocaleDateString()})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="mt-1 text-xs text-muted-foreground">
                Choose which tone analysis to use
              </p>
            </div>
          </div>
          
          <div className="mt-6">
            <label htmlFor="content-topic" className="block text-sm font-medium mb-2">
              Topic/Subject
            </label>
            <Input
              id="content-topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Cybersecurity, AI Integration, Data Analytics"
              className="max-w-xl"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              What would you like to write about?
            </p>
          </div>
          
          <div className="mt-8">
            <Button 
              onClick={handleGenerate}
              disabled={generateContentMutation.isPending || !personaId || !toneAnalysisId || !topic}
            >
              {generateContentMutation.isPending ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
                  Generating...
                </>
              ) : (
                "Generate Content"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Generated Content */}
      {generatedContent && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="flex items-center">
              {contentType === 'linkedin_post' ? (
                <Linkedin className="h-5 w-5 text-blue-500 mr-3" />
              ) : (
                <Mail className="h-5 w-5 text-yellow-500 mr-3" />
              )}
              <CardTitle>
                Generated {contentType === 'linkedin_post' ? 'LinkedIn Post' : 'Cold Email'}
              </CardTitle>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setGeneratedContent(null);
                setTopic("");
              }}
            >
              <Loader2 className="mr-2 h-4 w-4" />
              Regenerate
            </Button>
          </CardHeader>
          <CardContent>
            <div className="bg-muted rounded-lg p-6">
              <div className="whitespace-pre-wrap text-foreground">
                {generatedContent.content_text}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex items-center justify-between">
            <div className="flex space-x-2">
              {personas && generatedContent.persona_id && (
                <Badge variant="outline" className="bg-muted text-muted-foreground">
                  {personas.find(p => p.id === generatedContent.persona_id)?.name || "Persona"}
                </Badge>
              )}
              <Badge variant="outline" className="bg-muted text-muted-foreground">
                {generatedContent.type === "linkedin_post" ? "LinkedIn Post" : "Cold Email"}
              </Badge>
              {generatedContent.topic && (
                <Badge variant="outline" className="bg-muted text-muted-foreground">
                  {generatedContent.topic}
                </Badge>
              )}
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={handleCopyContent}>
                <Copy className="mr-2 h-4 w-4" />
                Copy
              </Button>
              <Button size="sm">
                <Download className="mr-2 h-4 w-4" />
                Save Content
              </Button>
            </div>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
