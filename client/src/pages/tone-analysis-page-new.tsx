import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { formatDistanceToNow } from "date-fns";
import { 
  Loader2, 
  BarChart2,
  Upload,
  Link as LinkIcon,
  FileText,
  BarChart,
  FileQuestion,
  Globe,
  CheckCircle,
  ExternalLink,
  PieChart,
  TrendingUp,
  List,
  ArrowRight,
  RefreshCw,
  MessageSquare,
  Sparkles,
  AlignLeft,
  BookMarked,
  Save,
  PlusCircle
} from "lucide-react";
import { SiLinkedin } from "react-icons/si";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import Layout from "@/components/Layout";
import { ToneAnalysis } from "@shared/schema";

export default function ToneAnalysisPage() {
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [sampleText, setSampleText] = useState("");
  const [analysisMethod, setAnalysisMethod] = useState<string>("url");
  const [currentAnalysisId, setCurrentAnalysisId] = useState<number | null>(null);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [analysisName, setAnalysisName] = useState("");
  const { toast } = useToast();
  const [, navigate] = useLocation();

  // Fetch all tone analyses for the user
  const { 
    data: userAnalyses,
    isLoading: isLoadingUserAnalyses,
  } = useQuery<ToneAnalysis[]>({
    queryKey: ["/api/tone-analyses"],
    throwOnError: false,
  });

  // State to track if we're creating a new analysis
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  // If we have analyses but no current one selected, select the most recent
  // But only if we're not deliberately creating a new analysis
  useEffect(() => {
    if (userAnalyses?.length && !currentAnalysisId && !isCreatingNew) {
      // Sort by created_at descending to get the most recent
      const sortedAnalyses = [...userAnalyses].sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      setCurrentAnalysisId(sortedAnalyses[0].id);
    }
  }, [userAnalyses, currentAnalysisId, isCreatingNew]);

  // Fetch the current analysis if we have an ID
  const { 
    data: toneAnalysis, 
    isLoading: isLoadingAnalysis,
  } = useQuery<ToneAnalysis>({
    queryKey: [`/api/tone-analyses/${currentAnalysisId}`],
    enabled: !!currentAnalysisId,
    throwOnError: false,
  });

  const toneAnalysisMutation = useMutation({
    mutationFn: async (data: { websiteUrl?: string; sampleText?: string; name?: string }) => {
      const res = await apiRequest("POST", "/api/tone-analysis", data);
      return res.json();
    },
    onSuccess: (data) => {
      // Generate a default name based on URL or date
      const defaultName = data.website_url 
        ? `Analysis of ${data.website_url.replace(/^https?:\/\//, '').replace(/^www\./, '')}` 
        : `Text Analysis ${new Date().toLocaleDateString()}`;
      
      // Auto-save the analysis with a default name
      if (data.id) {
        saveAnalysisMutation.mutate({ 
          id: data.id, 
          name: defaultName 
        });
      }

      // Reset isCreatingNew flag after successful analysis
      setIsCreatingNew(false);
      
      // Refresh the list and set current analysis
      queryClient.invalidateQueries({ queryKey: ["/api/tone-analyses"] });
      setCurrentAnalysisId(data.id);
    },
    onError: (error: Error) => {
      toast({
        title: "Analysis failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Mutation for saving/updating analysis name
  const saveAnalysisMutation = useMutation({
    mutationFn: async (data: { id: number; name: string }) => {
      const res = await apiRequest("PATCH", `/api/tone-analyses/${data.id}`, { name: data.name });
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Tone analysis saved successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/tone-analyses"] });
      queryClient.invalidateQueries({ queryKey: [`/api/tone-analyses/${currentAnalysisId}`] });
      setSaveDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Save failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Add a function to validate URL format
  const isValidUrl = (url: string): boolean => {
    try {
      // If URL doesn't start with http or https, we'll prepend https:// on the server
      // Just do a basic check here to make sure it's reasonably correct
      return url.length > 0;
    } catch (e) {
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (analysisMethod === "url" && !websiteUrl) {
      toast({
        title: "Missing URL",
        description: "Please enter a website URL to analyze",
        variant: "destructive",
      });
      return;
    }
    
    if (analysisMethod === "url" && !websiteUrl.includes('.')) {
      toast({
        title: "Invalid URL Format",
        description: "Please enter a valid website URL (e.g., example.com or https://example.com)",
        variant: "destructive",
      });
      return;
    }
    
    if (analysisMethod === "text" && !sampleText) {
      toast({
        title: "Missing text",
        description: "Please enter or paste text content to analyze",
        variant: "destructive",
      });
      return;
    }
    
    // Prepend https:// if the URL doesn't have a protocol
    let finalUrl = websiteUrl;
    if (analysisMethod === "url" && !websiteUrl.startsWith('http')) {
      finalUrl = `https://${websiteUrl}`;
    }
    
    toneAnalysisMutation.mutate({
      websiteUrl: analysisMethod === "url" ? finalUrl : undefined,
      sampleText: analysisMethod === "text" ? sampleText : undefined,
    });
  };

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
                  <span>Tone Analysis</span>
                </div>
                <h1 className="text-2xl font-semibold text-white mt-1">Tone Analysis</h1>
              </div>
            </div>
          </div>

          {/* Tone Analysis Section Title */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white">Tone Analysis</h2>
            <p className="text-sm text-gray-400 mt-1">Analyze your brand's unique communication style</p>
          </div>

          {/* Tone Analysis Promo Banner */}
          <div className="mb-8 bg-[#0a0c10] border border-gray-800/60 rounded-xl p-8 relative overflow-hidden shadow-[0_0_25px_rgba(116,209,234,0.05)]">
            <div className="absolute inset-0 bg-gradient-to-t from-[#0e1b33]/60 via-transparent to-transparent pointer-events-none"></div>
            
            <div className="relative z-10 flex items-start">
              <div className="mr-6 bg-[#0e131f] border border-[#74d1ea]/20 rounded-lg p-3 shadow-[0_0_15px_rgba(116,209,234,0.15)]">
                <BarChart2 className="h-6 w-6 text-[#74d1ea]" />
              </div>
              
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-white mb-3">Advanced Tone Analysis</h2>
                <p className="text-gray-300 mb-6 max-w-3xl">
                  Discover the unique characteristics of your brand's communication style with our AI-powered tone analysis. Extract valuable insights about your language patterns and content effectiveness.
                </p>
                
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="text-[#74d1ea] mr-3">✓</div>
                    <span className="text-gray-300">Detailed analysis of language patterns and tone characteristics</span>
                  </div>
                  <div className="flex items-center">
                    <div className="text-[#74d1ea] mr-3">✓</div>
                    <span className="text-gray-300">Professional content recommendations based on your brand voice</span>
                  </div>
                  <div className="flex items-center">
                    <div className="text-[#74d1ea] mr-3">✓</div>
                    <span className="text-gray-300">Key phrase extraction to highlight your brand's vocabulary</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Saved Analyses Panel - Left Column */}
            <div className="md:col-span-1">
              <div className="bg-black border border-gray-800/60 rounded-xl overflow-hidden shadow-[0_0_25px_rgba(116,209,234,0.05)]">
                <div className="p-4 border-b border-gray-800/60">
                  <h3 className="text-lg font-semibold text-white">Saved Analyses</h3>
                </div>
                <div className="max-h-[600px] overflow-y-auto p-2">
                  {isLoadingUserAnalyses ? (
                    <div className="flex items-center justify-center p-6">
                      <Loader2 className="h-6 w-6 animate-spin text-[#74d1ea]" />
                    </div>
                  ) : userAnalyses && userAnalyses.length > 0 ? (
                    <div className="space-y-2">
                      {userAnalyses.map((analysis) => (
                        <div
                          key={analysis.id}
                          className={`p-3 rounded-lg cursor-pointer transition-all ${
                            currentAnalysisId === analysis.id
                              ? "bg-[#182030] border border-[#74d1ea]/30"
                              : "bg-black border border-gray-800/60 hover:bg-gray-900"
                          }`}
                          onClick={() => {
                            setCurrentAnalysisId(analysis.id);
                            // Reset isCreatingNew when selecting a saved analysis
                            setIsCreatingNew(false);
                          }}
                        >
                          <h4 className="font-medium text-sm text-white mb-1 truncate">
                            {analysis.name || (analysis.website_url 
                              ? `Analysis of ${analysis.website_url.replace(/^https?:\/\//, '').replace(/^www\./, '')}` 
                              : `Text Analysis ${new Date(analysis.created_at).toLocaleDateString()}`)}
                          </h4>
                          <div className="flex justify-between items-center text-xs text-gray-400">
                            <span>
                              {analysis.website_url 
                                ? analysis.website_url.replace(/^https?:\/\//, '').replace(/^www\./, '').substring(0, 20) + (analysis.website_url.length > 25 ? '...' : '')
                                : "Text Analysis"}
                            </span>
                            <span>{formatDistanceToNow(new Date(analysis.created_at), { addSuffix: true })}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center p-6 text-gray-400">
                      <FileQuestion className="h-8 w-8 mx-auto mb-2 text-gray-600" />
                      <p>No saved analyses yet</p>
                      <p className="text-sm mt-1">Complete an analysis to see it here</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Main Content - Right Column */}
            <div className="md:col-span-3">
              {currentAnalysisId && toneAnalysis ? (
                <div className="space-y-8">
                  {/* Tone Analysis Results - Enhanced with platform style */}
                  <div className="group relative bg-black border border-gray-800/60 rounded-xl overflow-hidden transition-all duration-300 shadow-[0_0_25px_rgba(116,209,234,0.05)]">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#74d1ea]/5 via-transparent to-transparent pointer-events-none opacity-50"></div>
                    
                    {/* Header */}
                    <div className="p-6 border-b border-gray-800/60">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="bg-[#0e131f] border border-[#74d1ea]/20 h-12 w-12 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(116,209,234,0.15)] mr-4">
                            <BarChart2 className="h-6 w-6 text-[#74d1ea]" />
                          </div>
                          <div>
                            <h2 className="text-xl font-bold text-white">
                              {toneAnalysis.website_url ? (
                                <>Website Analysis Results</>
                              ) : (
                                <>Text Analysis Results</>
                              )}
                            </h2>
                            <div className="text-sm text-gray-400 mt-1">
                              {toneAnalysis.website_url ? toneAnalysis.website_url : "Sample text analysis"}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                          <div className="flex flex-wrap items-center gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="border-[#74d1ea]/30 text-[#74d1ea] hover:bg-[#182030] hover:text-[#74d1ea]"
                              onClick={() => {
                                setAnalysisName(toneAnalysis.name || (toneAnalysis.website_url ? 
                                  `Analysis of ${toneAnalysis.website_url.replace(/^https?:\/\//, '').replace(/^www\./, '')}` : 
                                  `Text Analysis ${new Date().toLocaleDateString()}`));
                                setSaveDialogOpen(true);
                              }}
                            >
                              <Save className="h-4 w-4 mr-1" />
                              Rename
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="border-[#74d1ea]/30 text-[#74d1ea] hover:bg-[#182030] hover:text-[#74d1ea]"
                              onClick={() => {
                                // Reset form fields
                                setWebsiteUrl("");
                                setSampleText("");
                                
                                // Set isCreatingNew to true to prevent auto-loading
                                setIsCreatingNew(true);
                                
                                // Clear current analysis ID to show the form
                                setCurrentAnalysisId(null);
                                setAnalysisMethod("url");
                                
                                // Scroll to form
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }}
                            >
                              <PlusCircle className="h-4 w-4 mr-1" />
                              Create New
                            </Button>
                          </div>
                          <div className="flex items-center gap-3 ml-auto">
                            <p className="text-sm text-gray-500">
                              {formatDistanceToNow(new Date(toneAnalysis.created_at), { addSuffix: true })}
                            </p>
                            <Badge className="bg-[#182030] text-[#74d1ea] border border-[#74d1ea]/30 px-3 py-1">
                              <CheckCircle className="h-3 w-3 mr-1" /> Complete
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-8">
                      {/* Tone Characteristics - Enhanced design */}
                      <div className="mb-10">
                        <div className="mb-6">
                          <h3 className="text-lg font-semibold text-white">Tone Characteristics</h3>
                          <p className="text-gray-400 text-sm mt-0.5">Key tone indicators detected in your content</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                          <div className="space-y-6">
                            {Object.entries(toneAnalysis.tone_results.characteristics).slice(0, 3).map(([key, value]) => (
                              <div key={key}>
                                <div className="flex justify-between items-center mb-1.5">
                                  <span className="text-sm font-medium capitalize text-white">{key}</span>
                                  <span className="text-sm font-medium text-[#74d1ea]">{value}%</span>
                                </div>
                                <div className="relative h-2 bg-gray-800/60 rounded-full overflow-hidden">
                                  <div className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-[#74d1ea] to-[#4983ab]" style={{ width: `${value}%` }}></div>
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          <div className="space-y-6">
                            {Object.entries(toneAnalysis.tone_results.characteristics).slice(3).map(([key, value]) => (
                              <div key={key}>
                                <div className="flex justify-between items-center mb-1.5">
                                  <span className="text-sm font-medium capitalize text-white">{key}</span>
                                  <span className="text-sm font-medium text-[#74d1ea]">{value}%</span>
                                </div>
                                <div className="relative h-2 bg-gray-800/60 rounded-full overflow-hidden">
                                  <div className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-[#74d1ea] to-[#4983ab]" style={{ width: `${value}%` }}></div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Analysis Results */}
                      <div className="mb-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Keywords section (renamed from Common Phrases) */}
                          <div className="md:col-span-2 bg-black border border-[#74d1ea]/10 rounded-xl p-6 shadow-[0_0_15px_rgba(116,209,234,0.05)]">
                            <div className="mb-5">
                              <h3 className="text-lg font-semibold text-white">Keywords</h3>
                              <p className="text-gray-400 text-sm mt-0.5">Key phrases that define your brand's voice</p>
                            </div>
                            
                            {Array.isArray(toneAnalysis.tone_results.language_patterns.common_phrases) ? (
                              toneAnalysis.tone_results.language_patterns.common_phrases.length > 0 ? (
                                <div className="flex flex-wrap gap-3 mt-8">
                                  {toneAnalysis.tone_results.language_patterns.common_phrases.slice(0, 10).map((phrase, i) => (
                                    <div 
                                      key={i} 
                                      className="rounded-full bg-gradient-to-r from-[#74d1ea] to-[#4983ab] text-black font-medium px-5 py-2.5 text-sm shadow-[0_0_15px_rgba(116,209,234,0.15)]"
                                    >
                                      {phrase}
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="bg-black border border-gray-800/60 rounded-lg p-4 text-center mt-2">
                                  <p className="text-gray-400">No keywords detected in your content</p>
                                </div>
                              )
                            ) : null}
                          </div>
                          
                          {/* Language Patterns Section */}
                          <div className="md:col-span-2 mt-6">
                            <div className="flex items-center space-x-3 mb-6">
                              <div className="bg-[#0e131f] border border-[#74d1ea]/20 rounded-lg p-2.5 shadow-[0_0_15px_rgba(116,209,234,0.15)]">
                                <AlignLeft className="h-5 w-5 text-[#74d1ea]" />
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold text-white">Language Patterns</h3>
                                <p className="text-gray-400 text-sm mt-0.5">Detailed analysis of your writing style</p>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                              {Object.entries(toneAnalysis.tone_results.language_patterns)
                                .filter(([key]) => key !== 'common_phrases')
                                .map(([key, value]) => (
                                  <div key={key} className="bg-black rounded-xl border border-gray-800/60 p-5 hover:bg-[#0e131f]/30 transition-colors">
                                    <div className="flex items-center mb-3">
                                      <div className="bg-[#182030] rounded-lg p-2 mr-3">
                                        {key === 'sentence_structure' ? (
                                          <AlignLeft className="h-4 w-4 text-[#74d1ea]" />
                                        ) : key === 'vocabulary' ? (
                                          <BookMarked className="h-4 w-4 text-[#74d1ea]" />
                                        ) : (
                                          <MessageSquare className="h-4 w-4 text-[#74d1ea]" />
                                        )}
                                      </div>
                                      <span className="text-sm font-medium capitalize text-white">{key.replace('_', ' ')}</span>
                                    </div>
                                    <p className="text-gray-300 text-sm">{value}</p>
                                  </div>
                                ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Recommended Content Types */}
                      <div className="mb-6">
                        <div className="flex items-center space-x-3 mb-6">
                          <div className="bg-[#0e131f] border border-[#74d1ea]/20 rounded-lg p-2.5 shadow-[0_0_15px_rgba(116,209,234,0.15)]">
                            <FileText className="h-5 w-5 text-[#74d1ea]" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-white">Recommended Content Types</h3>
                            <p className="text-gray-400 text-sm mt-0.5">Content formats that best match your tone</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                          {Array.isArray(toneAnalysis.tone_results.recommended_content_types) ? 
                            toneAnalysis.tone_results.recommended_content_types.map((type, i) => (
                              <div key={i} className="bg-black border border-[#74d1ea]/10 rounded-lg p-4 flex items-center space-x-3">
                                <div className="bg-[#182030] rounded-lg p-1.5">
                                  <FileText className="h-5 w-5 text-[#74d1ea]" />
                                </div>
                                <span className="text-white">{type}</span>
                              </div>
                            )) : null}
                        </div>
                        
                        <div className="mt-8 flex justify-center">
                          <Button 
                            onClick={() => navigate('/content-generator')}
                            className="bg-[#74d1ea] hover:bg-[#5db8d0] text-black font-medium shadow-[0_0_25px_rgba(116,209,234,0.25)]"
                          >
                            <Sparkles className="mr-2 h-5 w-5" />
                            Generate Content Based on Analysis
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Left column - Form with dashboard styling */}
                  <div className="group relative bg-black border border-gray-800/60 rounded-xl overflow-hidden transition-all duration-300 shadow-[0_0_25px_rgba(116,209,234,0.05)]">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#74d1ea]/5 via-transparent to-transparent pointer-events-none opacity-50"></div>
                    <div className="p-6">
                      <div className="flex items-center space-x-3 mb-6">
                        <div className="bg-[#0e131f] border border-[#74d1ea]/20 rounded-lg p-2.5 shadow-[0_0_15px_rgba(116,209,234,0.15)]">
                          <BarChart2 className="h-5 w-5 text-[#74d1ea]" />
                        </div>
                        <h3 className="text-lg font-semibold text-white">Analyze Your Content</h3>
                      </div>
                      
                      <div>
                        <form onSubmit={handleSubmit}>
                          <Tabs defaultValue="url" className="mb-8" onValueChange={(value) => setAnalysisMethod(value)}>
                            <TabsList className="bg-black/50 border border-gray-800/60 rounded-lg p-1 mb-6">
                              <TabsTrigger 
                                value="url" 
                                className="rounded-md data-[state=active]:bg-[#182030] data-[state=active]:text-[#74d1ea] data-[state=active]:shadow-[0_0_10px_rgba(116,209,234,0.15)]"
                              >
                                <Globe className="mr-2 h-4 w-4" />
                                Website URL
                              </TabsTrigger>
                              <TabsTrigger 
                                value="text" 
                                className="rounded-md data-[state=active]:bg-[#182030] data-[state=active]:text-[#74d1ea] data-[state=active]:shadow-[0_0_10px_rgba(116,209,234,0.15)]"
                              >
                                <FileText className="mr-2 h-4 w-4" />
                                Text Sample
                              </TabsTrigger>
                            </TabsList>
                            
                            <TabsContent value="url">
                              <div className="space-y-4">
                                <div>
                                  <Label htmlFor="website-url" className="text-white block mb-2">
                                    Website URL
                                  </Label>
                                  <div className="relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                      <LinkIcon className="h-4 w-4" />
                                    </div>
                                    <Input 
                                      id="website-url"
                                      placeholder="e.g., example.com"
                                      className="pl-10 bg-black/70 border-gray-800 text-white focus:border-[#74d1ea] focus:ring-1 focus:ring-[#74d1ea] focus:shadow-[0_0_10px_rgba(116,209,234,0.3)]"
                                      value={websiteUrl}
                                      onChange={(e) => setWebsiteUrl(e.target.value)}
                                    />
                                  </div>
                                  <p className="mt-2 text-xs text-gray-400">
                                    Enter the URL of a website or webpage you want to analyze
                                  </p>
                                </div>
                                
                                <Button 
                                  type="submit" 
                                  className="w-full bg-[#74d1ea] hover:bg-[#5db8d0] text-black font-medium shadow-[0_0_25px_rgba(116,209,234,0.25)]" 
                                  disabled={toneAnalysisMutation.isPending}
                                >
                                  {toneAnalysisMutation.isPending ? (
                                    <>
                                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                                      Analyzing...
                                    </>
                                  ) : (
                                    <>
                                      <BarChart className="mr-2 h-4 w-4" /> 
                                      Analyze Website
                                    </>
                                  )}
                                </Button>
                              </div>
                            </TabsContent>
                            
                            <TabsContent value="text">
                              <div className="space-y-4">
                                <div>
                                  <Label htmlFor="sample-text" className="text-white block mb-2">
                                    Sample Text
                                  </Label>
                                  <Textarea 
                                    id="sample-text"
                                    placeholder="Paste your text content here..."
                                    className="min-h-[200px] bg-black/70 border-gray-800 text-white focus:border-[#74d1ea] focus:ring-1 focus:ring-[#74d1ea] focus:shadow-[0_0_10px_rgba(116,209,234,0.3)]"
                                    value={sampleText}
                                    onChange={(e) => setSampleText(e.target.value)}
                                  />
                                  <p className="mt-2 text-xs text-gray-400">
                                    Paste in any text content you want to analyze (e.g., website copy, blog post, email)
                                  </p>
                                </div>
                                
                                <Button 
                                  type="submit" 
                                  className="w-full bg-[#74d1ea] hover:bg-[#5db8d0] text-black font-medium shadow-[0_0_25px_rgba(116,209,234,0.25)]" 
                                  disabled={toneAnalysisMutation.isPending}
                                >
                                  {toneAnalysisMutation.isPending ? (
                                    <>
                                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                                      Analyzing...
                                    </>
                                  ) : (
                                    <>
                                      <BarChart className="mr-2 h-4 w-4" /> 
                                      Analyze Text
                                    </>
                                  )}
                                </Button>
                              </div>
                            </TabsContent>
                          </Tabs>
                        </form>
                      </div>
                    </div>
                  </div>
                  
                  {/* Right column - Tips and info card */}
                  <div className="group relative bg-black border border-gray-800/60 rounded-xl overflow-hidden transition-all duration-300 shadow-[0_0_25px_rgba(116,209,234,0.05)]">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#74d1ea]/5 via-transparent to-transparent pointer-events-none opacity-50"></div>
                    <div className="p-6">
                      <div className="flex items-center space-x-3 mb-6">
                        <div className="bg-[#0e131f] border border-[#74d1ea]/20 rounded-lg p-2.5 shadow-[0_0_15px_rgba(116,209,234,0.15)]">
                          <FileText className="h-5 w-5 text-[#74d1ea]" />
                        </div>
                        <h3 className="text-lg font-semibold text-white">Analysis Tips</h3>
                      </div>
                      
                      <div className="space-y-6">
                        <div className="bg-black border border-gray-800/60 rounded-xl p-5">
                          <div className="flex items-center mb-3">
                            <div className="h-8 w-8 rounded-full bg-[#182030] border border-[#74d1ea]/20 flex items-center justify-center mr-3">
                              <span className="text-[#74d1ea] font-semibold">1</span>
                            </div>
                            <h4 className="font-medium text-white">Choose Quality Content</h4>
                          </div>
                          <p className="text-gray-400 text-sm">
                            For best results, analyze content that truly reflects your brand voice. Website copy, blog posts, and emails are all excellent sources.
                          </p>
                        </div>
                        
                        <div className="bg-black border border-gray-800/60 rounded-xl p-5">
                          <div className="flex items-center mb-3">
                            <div className="h-8 w-8 rounded-full bg-[#182030] border border-[#74d1ea]/20 flex items-center justify-center mr-3">
                              <span className="text-[#74d1ea] font-semibold">2</span>
                            </div>
                            <h4 className="font-medium text-white">Sufficient Text Length</h4>
                          </div>
                          <p className="text-gray-400 text-sm">
                            Include at least 200-300 words of text to get the most accurate analysis. Shorter texts may yield limited insights.
                          </p>
                        </div>
                        
                        <div className="bg-black border border-gray-800/60 rounded-xl p-5">
                          <div className="flex items-center mb-3">
                            <div className="h-8 w-8 rounded-full bg-[#182030] border border-[#74d1ea]/20 flex items-center justify-center mr-3">
                              <span className="text-[#74d1ea] font-semibold">3</span>
                            </div>
                            <h4 className="font-medium text-white">Analyze Multiple Sources</h4>
                          </div>
                          <p className="text-gray-400 text-sm">
                            For a comprehensive brand tone profile, analyze different content types and compare the results.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Rename Dialog */}
      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogContent className="bg-black border border-gray-800 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">Save Tone Analysis</DialogTitle>
            <DialogDescription className="text-gray-400">
              Give this analysis a name to help you identify it later.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Label htmlFor="analysis-name" className="text-white mb-2 block">
              Analysis Name
            </Label>
            <Input
              id="analysis-name"
              placeholder="E.g., Company Website Analysis"
              value={analysisName}
              onChange={(e) => setAnalysisName(e.target.value)}
              className="bg-black border-gray-700 text-white focus:border-[#74d1ea] focus:ring-1 focus:ring-[#74d1ea] focus:shadow-[0_0_10px_rgba(116,209,234,0.3)]"
            />
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSaveDialogOpen(false)}
              className="border-gray-700 text-gray-300 hover:bg-gray-900 hover:text-white"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={!analysisName}
              className="bg-[#74d1ea] hover:bg-[#5db8d0] text-black font-medium"
              onClick={() => {
                if (toneAnalysis && analysisName) {
                  saveAnalysisMutation.mutate({ 
                    id: toneAnalysis.id, 
                    name: analysisName 
                  });
                }
              }}
            >
              {toneAnalysis?.name ? "Update" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}