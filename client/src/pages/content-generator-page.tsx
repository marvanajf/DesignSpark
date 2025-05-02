import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { 
  Loader2, 
  ChevronRight, 
  Clipboard, 
  Send, 
  Globe, 
  FileText, 
  Mail, 
  RefreshCcw,
  Calendar,
  CheckCheck,
  Sparkles,
  Layers,
  Search,
  Filter,
  Video,
  ClipboardList
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { 
  ToneAnalysis, 
  Persona, 
  GeneratedContent 
} from "@shared/schema";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Layout from "@/components/Layout";
import { SiLinkedin } from "react-icons/si";

export default function ContentGeneratorPage() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [topic, setTopic] = useState("");
  const [contentType, setContentType] = useState<"linkedin_post" | "email" | "webinar" | "workshop">("linkedin_post");
  const [selectedPersonaId, setSelectedPersonaId] = useState<number | null>(null);
  const [selectedToneAnalysisId, setSelectedToneAnalysisId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [furtherDetails, setFurtherDetails] = useState("");
  const [prospectName, setProspectName] = useState("");
  const [nicheData, setNicheData] = useState("");
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  
  // Fetch tone analyses
  const { 
    data: toneAnalyses, 
    isLoading: isLoadingToneAnalyses 
  } = useQuery<ToneAnalysis[]>({
    queryKey: ["/api/tone-analyses"],
    onError: (err: Error) => {
      toast({
        title: "Failed to load tone analyses",
        description: err.message,
        variant: "destructive",
      });
    },
  });
  
  // Fetch personas
  const { 
    data: personas, 
    isLoading: isLoadingPersonas 
  } = useQuery<Persona[]>({
    queryKey: ["/api/personas"],
    onError: (err: Error) => {
      toast({
        title: "Failed to load personas",
        description: err.message,
        variant: "destructive",
      });
    },
  });
  
  // Fetch saved content
  const { 
    data: savedContent, 
    isLoading: isLoadingSavedContent
  } = useQuery<GeneratedContent[]>({
    queryKey: ["/api/content"],
    onError: (err: Error) => {
      toast({
        title: "Failed to load saved content",
        description: err.message,
        variant: "destructive",
      });
    },
  });
  
  // Generate content mutation
  const generateContentMutation = useMutation({
    mutationFn: async () => {
      if (!selectedPersonaId || !selectedToneAnalysisId || !topic.trim()) {
        throw new Error("Please select a persona, tone analysis, and enter a topic");
      }
      
      // Build additional details based on content type
      let additionalDetails = "";
      
      if (contentType === "email") {
        // Include prospect details in further details for cold emails
        if (prospectName) additionalDetails += `Prospect Name: ${prospectName}\n`;
        if (nicheData) additionalDetails += `Niche Data: ${nicheData}\n`;
      }
      
      // Combine user-entered further details with prospect details
      const combinedDetails = additionalDetails 
        ? (furtherDetails ? `${additionalDetails}\n\n${furtherDetails}` : additionalDetails).trim()
        : furtherDetails.trim();
      
      const res = await apiRequest("POST", "/api/content", {
        type: contentType,
        personaId: selectedPersonaId,
        toneAnalysisId: selectedToneAnalysisId,
        topic: topic.trim(),
        furtherDetails: combinedDetails || undefined,
      });
      
      return res.json();
    },
    onSuccess: (data: GeneratedContent) => {
      queryClient.invalidateQueries({ queryKey: ["/api/content"] });
      
      let contentTypeText;
      switch(contentType) {
        case "linkedin_post":
          contentTypeText = "LinkedIn post";
          break;
        case "email":
          contentTypeText = "cold email";
          break;
        case "webinar":
          contentTypeText = "webinar outline";
          break;
        case "workshop":
          contentTypeText = "workshop plan";
          break;
        default:
          contentTypeText = "content";
      }
      
      toast({
        title: "Content generated!",
        description: `Your ${contentTypeText} has been created.`,
      });
    },
    onError: (error: any) => {
      if (error.message?.includes("OpenAI API is not available")) {
        toast({
          title: "API Key Required",
          description: "An OpenAI API key is required to generate content. Please add your API key in the settings.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Failed to generate content",
          description: error.message,
          variant: "destructive",
        });
      }
    },
  });

  // Set initial selected persona from the ones that are already selected
  useEffect(() => {
    if (personas && personas.length > 0) {
      const selectedPersonas = personas.filter(p => p.is_selected);
      if (selectedPersonas.length > 0) {
        setSelectedPersonaId(selectedPersonas[0].id);
      }
    }
  }, [personas]);

  // Set initial selected tone analysis (most recent)
  useEffect(() => {
    if (toneAnalyses && toneAnalyses.length > 0) {
      // Sort by created_at in descending order and take the first one
      const sortedAnalyses = [...toneAnalyses].sort((a, b) => {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
      setSelectedToneAnalysisId(sortedAnalyses[0].id);
    }
  }, [toneAnalyses]);
  
  // Clear prospect fields when switching away from email content type
  useEffect(() => {
    if (contentType !== "email") {
      // Reset prospect-specific fields when not in email mode
      setProspectName("");
      setNicheData("");
      setShowAdvancedOptions(false);
    }
  }, [contentType]);

  // Handle copy to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        toast({
          title: "Copied to clipboard",
          description: "Content has been copied to your clipboard.",
        });
      })
      .catch(err => {
        toast({
          title: "Failed to copy",
          description: "Please try again or copy manually.",
          variant: "destructive",
        });
      });
  };

  // Filter saved content based on search query and content type
  const filteredContent = savedContent?.filter(content => {
    const matchesType = contentType === "all" || content.type === contentType;
    const matchesSearch = !searchQuery || 
      content.content_text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      content.topic.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  if (isLoadingToneAnalyses || isLoadingPersonas) {
    return (
      <Layout showSidebar={true}>
        <div className="flex-1 overflow-y-auto bg-black">
          <div className="flex justify-center items-center h-screen">
            <Loader2 className="h-8 w-8 animate-spin text-[#74d1ea]" />
          </div>
        </div>
      </Layout>
    );
  }

  // Check if we need to create tone analysis or personas first
  if ((!toneAnalyses || toneAnalyses.length === 0) && (!personas || personas.length === 0)) {
    return (
      <Layout showSidebar={true}>
        <div className="flex-1 overflow-y-auto bg-black p-6">
          <div className="max-w-3xl mx-auto mt-10">
            <Card className="bg-[#111] border-gray-800 rounded-lg overflow-hidden">
              <CardHeader>
                <CardTitle className="text-xl font-medium text-white">Setup Required</CardTitle>
                <CardDescription className="text-gray-400">
                  Before you can generate content, you need to complete two steps:
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-gray-900">
                      <Globe className="h-5 w-5 text-[#74d1ea]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-white">Run a Tone Analysis</h3>
                      <p className="mt-1 text-gray-400">
                        Analyze your content to understand your current tone of voice, which helps tailor your content.
                      </p>
                      <Button 
                        onClick={() => navigate('/tone-analysis')}
                        className="mt-3 bg-[#74d1ea] hover:bg-[#5db8d0] text-black"
                      >
                        Analyze Your Content
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-gray-900">
                      <Layers className="h-5 w-5 text-[#74d1ea]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-white">Select Target Personas</h3>
                      <p className="mt-1 text-gray-400">
                        Choose or create personas that represent your target audience to personalize content.
                      </p>
                      <Button 
                        onClick={() => navigate('/personas')}
                        className="mt-3 bg-[#74d1ea] hover:bg-[#5db8d0] text-black"
                      >
                        Manage Personas
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Layout>
    );
  }

  // Check if we need to create tone analysis first
  if (!toneAnalyses || toneAnalyses.length === 0) {
    return (
      <Layout showSidebar={true}>
        <div className="flex-1 overflow-y-auto bg-black p-6">
          <div className="max-w-3xl mx-auto mt-10">
            <Card className="bg-[#111] border-gray-800 rounded-lg overflow-hidden">
              <CardHeader>
                <CardTitle className="text-xl font-medium text-white">Tone Analysis Required</CardTitle>
                <CardDescription className="text-gray-400">
                  Before you can generate content, you need to analyze your tone of voice.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-start">
                  <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-gray-900">
                    <Globe className="h-5 w-5 text-[#74d1ea]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-white">Run a Tone Analysis</h3>
                    <p className="mt-1 text-gray-400">
                      Analyze your website or sample text to understand your current tone of voice, which helps us generate content that aligns with your brand voice.
                    </p>
                    <Button 
                      onClick={() => navigate('/tone-analysis')}
                      className="mt-4 bg-[#74d1ea] hover:bg-[#5db8d0] text-black"
                    >
                      Go to Tone Analysis
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Layout>
    );
  }

  // Check if we need to create personas first
  if (!personas || personas.length === 0) {
    return (
      <Layout showSidebar={true}>
        <div className="flex-1 overflow-y-auto bg-black p-6">
          <div className="max-w-3xl mx-auto mt-10">
            <Card className="bg-[#111] border-gray-800 rounded-lg overflow-hidden">
              <CardHeader>
                <CardTitle className="text-xl font-medium text-white">Personas Required</CardTitle>
                <CardDescription className="text-gray-400">
                  Before you can generate content, you need to select at least one target persona.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-start">
                  <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-gray-900">
                    <Layers className="h-5 w-5 text-[#74d1ea]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-white">Create & Select Personas</h3>
                    <p className="mt-1 text-gray-400">
                      Define your target audience by creating personas that represent your ideal customers or clients. This helps tailor the content to resonate with specific audience segments.
                    </p>
                    <Button 
                      onClick={() => navigate('/personas')}
                      className="mt-4 bg-[#74d1ea] hover:bg-[#5db8d0] text-black"
                    >
                      Go to Personas
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout showSidebar={true}>
      <div className="flex-1 overflow-y-auto bg-black">
        <div className="p-6">
          {/* Header Section with Breadcrumbs */}
          <div className="mb-6">
            <div className="flex justify-between items-center">
              <div>
                <div className="flex items-center text-sm text-gray-400">
                  <span>Tovably</span>
                  <span className="mx-2">›</span>
                  <span>Content Generator</span>
                </div>
                <h1 className="text-2xl font-semibold text-white mt-1">Content Generator</h1>
              </div>
            </div>
          </div>
          
          {/* Content Generator Promo Banner */}
          <div className="mb-8 bg-[#0a0c10] border border-gray-800/60 rounded-xl p-8 relative overflow-hidden shadow-[0_0_25px_rgba(116,209,234,0.05)]">
            <div className="absolute inset-0 bg-gradient-to-t from-[#0e1b33]/60 via-transparent to-transparent pointer-events-none"></div>
            
            <div className="relative z-10 flex items-start">
              <div className="mr-6 bg-[#0e131f] border border-[#74d1ea]/20 rounded-lg p-3 shadow-[0_0_15px_rgba(116,209,234,0.15)]">
                <Sparkles className="h-6 w-6 text-[#74d1ea]" />
              </div>
              
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-white mb-3">AI-Powered Content Generation</h2>
                <p className="text-gray-300 mb-6 max-w-3xl">
                  Generate professional, tailored content that perfectly matches your brand voice and resonates with your target audience. Our AI creates high-quality content optimized for specific platforms and business objectives.
                </p>
                
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="text-[#74d1ea] mr-3">✓</div>
                    <span className="text-gray-300">Personalized content aligned with your brand's unique tone</span>
                  </div>
                  <div className="flex items-center">
                    <div className="text-[#74d1ea] mr-3">✓</div>
                    <span className="text-gray-300">Audience-targeted messaging that drives engagement</span>
                  </div>
                  <div className="flex items-center">
                    <div className="text-[#74d1ea] mr-3">✓</div>
                    <span className="text-gray-300">Professional formats optimized for LinkedIn and email outreach</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Left Column: Content Generation Form */}
            <div className="xl:col-span-1">
              <Card className="bg-[#111] border-gray-800 rounded-lg overflow-hidden h-full">
                <CardHeader className="pb-3 border-b border-gray-800">
                  <CardTitle className="text-lg font-medium text-white">Generate New Content</CardTitle>
                  <CardDescription className="text-gray-400">
                    Create professional content based on your tone and target audience
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-5">
                  {/* Content Type Selection */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Content Type</label>
                    <Tabs 
                      defaultValue="linkedin_post" 
                      value={contentType}
                      onValueChange={(value) => setContentType(value as "linkedin_post" | "email" | "webinar" | "workshop")}
                      className="w-full"
                    >
                      <TabsList className="w-full bg-gray-900 p-1 grid grid-cols-2 md:grid-cols-4 gap-1">
                        <TabsTrigger 
                          value="linkedin_post" 
                          className="flex-1 data-[state=active]:bg-[#74d1ea] data-[state=active]:text-black"
                        >
                          <SiLinkedin className="h-4 w-4 mr-2" />
                          LinkedIn Post
                        </TabsTrigger>
                        <TabsTrigger 
                          value="email" 
                          className="flex-1 data-[state=active]:bg-[#74d1ea] data-[state=active]:text-black"
                        >
                          <Mail className="h-4 w-4 mr-2" />
                          Cold Email
                        </TabsTrigger>
                        <TabsTrigger 
                          value="webinar" 
                          className="flex-1 data-[state=active]:bg-[#74d1ea] data-[state=active]:text-black"
                        >
                          <Video className="h-4 w-4 mr-2" />
                          Webinar
                        </TabsTrigger>
                        <TabsTrigger 
                          value="workshop" 
                          className="flex-1 data-[state=active]:bg-[#74d1ea] data-[state=active]:text-black"
                        >
                          <ClipboardList className="h-4 w-4 mr-2" />
                          Workshop
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                  
                  {/* Topic Input */}
                  <div className="space-y-2">
                    <label htmlFor="topic" className="text-sm font-medium text-gray-300">Topic</label>
                    <Input
                      id="topic"
                      placeholder="E.g., New product launch, Industry trend, etc."
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      className="bg-black border-gray-700 text-white focus:border-[#74d1ea] focus:ring-1 focus:ring-[#74d1ea] focus:shadow-[0_0_10px_rgba(116,209,234,0.3)]"
                    />
                    <p className="text-xs text-gray-500">
                      Enter the main subject or theme of your content
                    </p>
                  </div>
                  
                  {/* Persona Selection */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Target Persona</label>
                    <Select
                      value={selectedPersonaId?.toString() || ""}
                      onValueChange={(value) => setSelectedPersonaId(parseInt(value))}
                    >
                      <SelectTrigger className="bg-black border-gray-700 text-white focus:border-[#74d1ea] focus:ring-1 focus:ring-[#74d1ea] focus:shadow-[0_0_10px_rgba(116,209,234,0.3)]">
                        <SelectValue placeholder="Select a persona" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#111] border-gray-800">
                        {personas.map((persona) => (
                          <SelectItem key={persona.id} value={persona.id.toString()}>
                            {persona.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="flex justify-between items-center">
                      <p className="text-xs text-gray-500">
                        Select who this content is targeting
                      </p>
                      <Button
                        variant="ghost"
                        className="h-auto p-0 text-xs text-[#74d1ea] hover:bg-transparent hover:text-[#9de0f0]"
                        onClick={() => navigate('/personas')}
                      >
                        Manage Personas
                      </Button>
                    </div>
                  </div>
                  
                  {/* Tone Analysis Selection */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Tone Analysis</label>
                    <Select
                      value={selectedToneAnalysisId?.toString() || ""}
                      onValueChange={(value) => setSelectedToneAnalysisId(parseInt(value))}
                    >
                      <SelectTrigger className="bg-black border-gray-700 text-white focus:border-[#74d1ea] focus:ring-1 focus:ring-[#74d1ea] focus:shadow-[0_0_10px_rgba(116,209,234,0.3)]">
                        <SelectValue placeholder="Select tone analysis" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#111] border-gray-800">
                        {toneAnalyses.map((analysis) => (
                          <SelectItem key={analysis.id} value={analysis.id.toString()}>
                            {analysis.website_url 
                              ? `Website: ${analysis.website_url.replace(/^https?:\/\//, '').substring(0, 30)}${analysis.website_url.length > 30 ? '...' : ''}`
                              : `Analysis #${analysis.id}`
                            }
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="flex justify-between items-center">
                      <p className="text-xs text-gray-500">
                        Select tone to match in generated content
                      </p>
                      <Button
                        variant="ghost"
                        className="h-auto p-0 text-xs text-[#74d1ea] hover:bg-transparent hover:text-[#9de0f0]"
                        onClick={() => navigate('/tone-analysis')}
                      >
                        Run New Analysis
                      </Button>
                    </div>
                  </div>
                  
                  {/* Cold Email Advanced Options - only shown for email type */}
                  {contentType === "email" && (
                    <div className="mt-4 mb-2">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-gray-300 flex items-center">
                          <span className="text-[#74d1ea] mr-2">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M12 16V12M12 8H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </span>
                          Advanced Options
                        </h3>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                          className="text-[#74d1ea] h-7 text-xs hover:bg-gray-800"
                        >
                          {showAdvancedOptions ? "Hide" : "Show"}
                        </Button>
                      </div>
                      {showAdvancedOptions && (
                        <div className="mt-3 p-4 border border-gray-800 rounded-lg bg-gray-900/40 space-y-4">
                          <div className="space-y-2">
                            <label htmlFor="prospectName" className="text-xs font-medium text-gray-300">
                              Prospect's Name (Optional)
                            </label>
                            <Input
                              id="prospectName"
                              value={prospectName}
                              onChange={(e) => setProspectName(e.target.value)}
                              placeholder="e.g., Sarah Johnson"
                              className="bg-black border-gray-700 text-white h-8 text-sm focus:border-[#74d1ea]"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <label htmlFor="nicheData" className="text-xs font-medium text-gray-300">
                              Niche Data? Add here (Optional)
                            </label>
                            <Input
                              id="nicheData"
                              value={nicheData}
                              onChange={(e) => setNicheData(e.target.value)}
                              placeholder="e.g., Tech startup, HR software, Recruitment automation"
                              className="bg-black border-gray-700 text-white h-8 text-sm focus:border-[#74d1ea]"
                            />
                          </div>
                          
                          <p className="text-xs text-gray-500 italic">
                            These details will help personalize the email for your specific prospect
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Further Details Input */}
                  <div className="space-y-2">
                    <label htmlFor="furtherDetails" className="text-sm font-medium text-gray-300">Further Details (Optional)</label>
                    <Textarea
                      id="furtherDetails"
                      placeholder="Add specific details, context, or instructions to refine the generated content..."
                      value={furtherDetails}
                      onChange={(e) => setFurtherDetails(e.target.value)}
                      className="bg-black border-gray-700 text-white min-h-[100px] focus:border-[#74d1ea] focus:ring-1 focus:ring-[#74d1ea] focus:shadow-[0_0_10px_rgba(116,209,234,0.3)]"
                    />
                    <p className="text-xs text-gray-500">
                      Include additional context or specific requirements for more tailored content
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="px-6 py-4 bg-black/20 border-t border-gray-800">
                  <Button
                    className="w-full bg-[#74d1ea] hover:bg-[#5db8d0] text-black"
                    disabled={
                      !selectedPersonaId || 
                      !selectedToneAnalysisId || 
                      !topic.trim() || 
                      generateContentMutation.isPending
                    }
                    onClick={() => generateContentMutation.mutate()}
                  >
                    {generateContentMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Generate Content
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </div>
            
            {/* Right Column: Generated Content */}
            <div className="xl:col-span-2">
              <Card className="bg-[#111] border-gray-800 rounded-lg overflow-hidden h-full">
                <CardHeader className="pb-3 border-b border-gray-800">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-lg font-medium text-white">Generated Content</CardTitle>
                      <CardDescription className="text-gray-400">
                        Your recent content ready to use
                      </CardDescription>
                    </div>
                    <div className="flex space-x-3">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search content..."
                          className="pl-10 bg-black border-gray-800 text-gray-300 w-[220px] focus:border-[#74d1ea] focus:ring-1 focus:ring-[#74d1ea] focus:shadow-[0_0_10px_rgba(116,209,234,0.3)]"
                        />
                      </div>
                      <Select
                        value={contentType === "linkedin_post" || contentType === "email" || contentType === "webinar" || contentType === "workshop" ? contentType : "all"}
                        onValueChange={(value) => {
                          if (value === "all") {
                            // Keep the current contentType for the generator, but show all content
                          } else {
                            setContentType(value as "linkedin_post" | "email" | "webinar" | "workshop");
                          }
                        }}
                      >
                        <SelectTrigger className="bg-black border-gray-800 text-gray-300 w-[150px] focus:border-[#74d1ea] focus:ring-1 focus:ring-[#74d1ea] focus:shadow-[0_0_10px_rgba(116,209,234,0.3)]">
                          <SelectValue placeholder="Filter type" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#111] border-gray-800">
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="linkedin_post">LinkedIn Posts</SelectItem>
                          <SelectItem value="email">Cold Emails</SelectItem>
                          <SelectItem value="webinar">Webinars</SelectItem>
                          <SelectItem value="workshop">Workshops</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  {isLoadingSavedContent ? (
                    <div className="flex justify-center items-center h-64">
                      <Loader2 className="h-8 w-8 animate-spin text-[#74d1ea]" />
                    </div>
                  ) : filteredContent && filteredContent.length > 0 ? (
                    <div className="space-y-5">
                      {filteredContent.map((content) => {
                        // Find the associated persona
                        const persona = personas.find(p => p.id === content.persona_id);
                        
                        return (
                          <Card key={content.id} className="bg-black border-gray-800 rounded-lg overflow-hidden">
                            <CardHeader className="py-3 px-5 bg-black/40 border-b border-gray-800">
                              <div className="flex justify-between items-center">
                                <div className="flex items-center">
                                  <Badge className={`mr-2 ${
                                    content.type === "linkedin_post" 
                                      ? "bg-blue-500/20 text-blue-400" 
                                      : content.type === "email"
                                      ? "bg-green-500/20 text-green-400"
                                      : content.type === "webinar"
                                      ? "bg-purple-500/20 text-purple-400"
                                      : "bg-amber-500/20 text-amber-400"
                                  } border-0`}>
                                    {content.type === "linkedin_post" ? (
                                      <SiLinkedin className="h-3 w-3 mr-1" />
                                    ) : content.type === "email" ? (
                                      <Mail className="h-3 w-3 mr-1" />
                                    ) : content.type === "webinar" ? (
                                      <Video className="h-3 w-3 mr-1" />
                                    ) : (
                                      <ClipboardList className="h-3 w-3 mr-1" />
                                    )}
                                    {content.type === "linkedin_post" 
                                      ? "LinkedIn Post" 
                                      : content.type === "email" 
                                      ? "Cold Email" 
                                      : content.type === "webinar" 
                                      ? "Webinar" 
                                      : "Workshop"}
                                  </Badge>
                                  <span className="text-sm font-medium text-white">{content.topic}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  {persona && (
                                    <div className="hidden md:flex items-center bg-gray-900 rounded-full px-3 py-1">
                                      <Avatar className="h-5 w-5 mr-2">
                                        <AvatarFallback className="text-xs bg-[#74d1ea]/20 text-[#74d1ea]">
                                          {persona.name.substring(0, 2)}
                                        </AvatarFallback>
                                      </Avatar>
                                      <span className="text-xs text-gray-300">{persona.name}</span>
                                    </div>
                                  )}
                                  <span className="text-xs text-gray-500">
                                    {new Date(content.created_at).toLocaleDateString()}
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
                                        onClick={() => copyToClipboard(content.content_text)}
                                      >
                                        <Clipboard className="h-4 w-4 mr-2" />
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
                                        <RefreshCcw className="h-4 w-4 mr-2" />
                                        Regenerate
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent className="py-4 px-5">
                              <div className="whitespace-pre-wrap text-gray-300 text-sm">
                                {content.content_text}
                              </div>
                            </CardContent>
                            <CardFooter className="py-3 px-5 bg-black/40 border-t border-gray-800 flex justify-between">
                              <div className="flex items-center space-x-4">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8 border-gray-700 text-gray-400 hover:text-white"
                                  onClick={() => copyToClipboard(content.content_text)}
                                >
                                  <Clipboard className="h-3.5 w-3.5 mr-1" />
                                  Copy
                                </Button>
                                {content.type === "linkedin_post" && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 border-gray-700 text-gray-400 hover:text-white"
                                  >
                                    <SiLinkedin className="h-3.5 w-3.5 mr-1" />
                                    Post to LinkedIn
                                  </Button>
                                )}
                                {content.type === "email" && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 border-gray-700 text-gray-400 hover:text-white"
                                  >
                                    <Mail className="h-3.5 w-3.5 mr-1" />
                                    Send Email
                                  </Button>
                                )}
                                {content.type === "webinar" && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 border-gray-700 text-gray-400 hover:text-white"
                                  >
                                    <Video className="h-3.5 w-3.5 mr-1" />
                                    Schedule Webinar
                                  </Button>
                                )}
                                {content.type === "workshop" && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 border-gray-700 text-gray-400 hover:text-white"
                                  >
                                    <ClipboardList className="h-3.5 w-3.5 mr-1" />
                                    Plan Workshop
                                  </Button>
                                )}
                              </div>
                              <Badge variant="outline" className="bg-[#74d1ea]/10 text-[#74d1ea] border-0">
                                <CheckCheck className="h-3 w-3 mr-1" />
                                AI Generated
                              </Badge>
                            </CardFooter>
                          </Card>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex flex-col justify-center items-center h-64 p-6 text-center">
                      {searchQuery ? (
                        <>
                          <Search className="h-12 w-12 text-gray-500 mb-4" />
                          <h3 className="text-lg font-medium text-white mb-2">No results found</h3>
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
                          <FileText className="h-12 w-12 text-gray-500 mb-4" />
                          <h3 className="text-lg font-medium text-white mb-2">No content yet</h3>
                          <p className="text-gray-400 mb-4">
                            Generate your first content by filling out the form and clicking "Generate Content"
                          </p>
                        </>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}