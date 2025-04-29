import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { formatDistanceToNow } from "date-fns";
import { 
  Loader2, 
  BarChart2,
  Calendar,
  ChevronDown,
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
  BookMarked
} from "lucide-react";
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
import Layout from "@/components/Layout";
import { ToneAnalysis } from "@shared/schema";

export default function ToneAnalysisPage() {
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [sampleText, setSampleText] = useState("");
  const [analysisMethod, setAnalysisMethod] = useState<string>("url");
  const [currentAnalysisId, setCurrentAnalysisId] = useState<number | null>(null);
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

  // If we have analyses but no current one selected, select the most recent
  useEffect(() => {
    if (userAnalyses?.length && !currentAnalysisId) {
      // Sort by created_at descending to get the most recent
      const sortedAnalyses = [...userAnalyses].sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      setCurrentAnalysisId(sortedAnalyses[0].id);
    }
  }, [userAnalyses, currentAnalysisId]);

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
    mutationFn: async (data: { websiteUrl?: string; sampleText?: string }) => {
      const res = await apiRequest("POST", "/api/tone-analysis", data);
      return res.json();
    },
    onSuccess: (data) => {
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
                <h1 className="text-2xl font-semibold text-white mt-1">Analyze Your Brand's Tone</h1>
              </div>
              <div className="flex space-x-3">
                <div className="flex items-center space-x-2 bg-[#111] border border-gray-800 rounded-md px-3 py-1.5 text-sm text-gray-300">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span>Today</span>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
          </div>

          {currentAnalysisId && toneAnalysis ? (
            <div className="space-y-8">
              {/* Tone Analysis Results - Enhanced with platform style */}
              <div className="group relative bg-[#0a0c10] border border-gray-800/60 rounded-xl overflow-hidden transition-all duration-300 shadow-[0_0_25px_rgba(116,209,234,0.05)]">
                <div className="absolute inset-0 bg-gradient-to-t from-[#0e1b33]/60 via-transparent to-transparent pointer-events-none"></div>
                
                {/* Header */}
                <div className="p-6 border-b border-gray-800/60">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="bg-[#182030] border border-[#74d1ea]/20 h-12 w-12 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(116,209,234,0.15)] mr-4">
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
                    <div className="flex items-center space-x-4">
                      <p className="text-sm text-gray-500">
                        {formatDistanceToNow(new Date(toneAnalysis.created_at), { addSuffix: true })}
                      </p>
                      <Badge className="bg-[#182030] text-[#74d1ea] border border-[#74d1ea]/30 px-3 py-1">
                        <CheckCircle className="h-3 w-3 mr-1" /> Complete
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="p-8">
                  {/* Tone Characteristics - Enhanced design */}
                  <div className="mb-10">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="bg-[#0e131f] border border-[#74d1ea]/20 rounded-lg p-2.5 shadow-[0_0_15px_rgba(116,209,234,0.15)]">
                        <BarChart2 className="h-5 w-5 text-[#74d1ea]" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">Tone Characteristics</h3>
                        <p className="text-gray-400 text-sm mt-0.5">Key tone indicators detected in your content</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                      <div className="space-y-6">
                        {Object.entries(toneAnalysis.tone_results.characteristics).slice(0, 3).map(([key, value]) => (
                          <div key={key}>
                            <div className="flex justify-between items-center mb-2">
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
                            <div className="flex justify-between items-center mb-2">
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

                  {/* Language Patterns - Enhanced design */}
                  <div className="mb-10">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="bg-[#0e131f] border border-[#74d1ea]/20 rounded-lg p-2.5 shadow-[0_0_15px_rgba(116,209,234,0.15)]">
                        <MessageSquare className="h-5 w-5 text-[#74d1ea]" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">Language Patterns</h3>
                        <p className="text-gray-400 text-sm mt-0.5">Analysis of your communication style and word choices</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                      {/* Common phrases section */}
                      <div className="md:col-span-2 bg-[#0e131f]/50 border border-[#74d1ea]/20 rounded-xl p-6 shadow-[0_0_15px_rgba(116,209,234,0.05)]">
                        <div className="flex items-center mb-5">
                          <div className="bg-[#182030] border border-[#74d1ea]/20 h-10 w-10 rounded-lg flex items-center justify-center mr-3 shadow-[0_0_10px_rgba(116,209,234,0.1)]">
                            <Sparkles className="h-5 w-5 text-[#74d1ea]" />
                          </div>
                          <div>
                            <h4 className="text-white font-semibold">Common Phrases</h4>
                            <p className="text-gray-400 text-xs mt-0.5">Key phrases that define your brand's voice</p>
                          </div>
                        </div>
                        
                        {Array.isArray(toneAnalysis.tone_results.language_patterns.common_phrases) ? (
                          toneAnalysis.tone_results.language_patterns.common_phrases.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                              {toneAnalysis.tone_results.language_patterns.common_phrases.map((phrase, i) => (
                                <div key={i} className="bg-[#182030] border border-[#74d1ea]/10 p-4 rounded-lg flex items-start">
                                  <div className="bg-[#74d1ea]/10 w-8 h-8 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                                    <MessageSquare className="h-4 w-4 text-[#74d1ea]" />
                                  </div>
                                  <div>
                                    <p className="text-white text-sm font-medium">{phrase}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="bg-black/30 rounded-lg p-4 text-center mt-2">
                              <p className="text-gray-400">No common phrases detected in your content</p>
                            </div>
                          )
                        ) : null}
                      </div>
                      
                      {/* Other language patterns */}
                      {Object.entries(toneAnalysis.tone_results.language_patterns)
                        .filter(([key]) => key !== 'common_phrases')
                        .map(([key, value]) => (
                          <div key={key} className="bg-black/20 rounded-xl border border-gray-800/60 p-5 hover:bg-[#0e131f]/30 transition-colors">
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
                              <h4 className="text-white font-medium capitalize">{key.replace('_', ' ')}</h4>
                            </div>
                            <p className="text-sm text-gray-300 leading-relaxed">
                              {value as string}
                            </p>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Summary section - Enhanced design */}
                  <div className="mb-10">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="bg-[#0e131f] border border-[#74d1ea]/20 rounded-lg p-2.5 shadow-[0_0_15px_rgba(116,209,234,0.15)]">
                        <PieChart className="h-5 w-5 text-[#74d1ea]" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">Summary</h3>
                        <p className="text-gray-400 text-sm mt-0.5">Overall assessment of your communication style</p>
                      </div>
                    </div>
                    
                    <div className="bg-[#0e131f]/50 border border-[#74d1ea]/10 rounded-xl p-5 mt-4">
                      <div className="flex">
                        <div className="bg-[#182030] self-start rounded-lg p-2 mr-4 mt-0.5">
                          <FileText className="h-4 w-4 text-[#74d1ea]" />
                        </div>
                        <p className="text-gray-300 leading-relaxed">
                          {toneAnalysis.tone_results.summary}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Recommended Content Types - Enhanced design */}
                  <div className="mb-10">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="bg-[#0e131f] border border-[#74d1ea]/20 rounded-lg p-2.5 shadow-[0_0_15px_rgba(116,209,234,0.15)]">
                        <List className="h-5 w-5 text-[#74d1ea]" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">Recommended Content</h3>
                        <p className="text-gray-400 text-sm mt-0.5">Content types that match your brand's voice</p>
                      </div>
                    </div>
                    
                    <div className="bg-[#0e131f]/40 rounded-xl border border-[#74d1ea]/20 p-6 mt-4">
                      <div className="flex flex-wrap gap-3">
                        {toneAnalysis.tone_results.recommended_content_types.map((type, i) => (
                          <div key={i} className="bg-[#182030] border border-[#74d1ea]/20 px-4 py-3 rounded-lg flex items-center">
                            <div className="bg-[#74d1ea]/10 w-8 h-8 rounded-lg flex items-center justify-center mr-3">
                              <CheckCircle className="h-4 w-4 text-[#74d1ea]" />
                            </div>
                            <span className="text-white">{type}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Action buttons - Enhanced design */}
                  <div className="flex justify-between items-center border-t border-gray-800/60 px-2 pt-8">
                    <Button 
                      variant="outline" 
                      className="border-gray-800/80 bg-black/30 hover:bg-[#0e131f] text-white h-10"
                      onClick={() => {
                        setCurrentAnalysisId(null);
                        navigate("/tone-analysis");
                      }}
                    >
                      <RefreshCw className="h-4 w-4 mr-2 text-[#74d1ea]" />
                      New Analysis
                    </Button>
                    
                    <div className="flex items-center space-x-3">
                      <Button 
                        variant="outline" 
                        className="border-gray-800/80 bg-black/30 hover:bg-[#0e131f] text-white h-10"
                        onClick={() => {
                          toneAnalysisMutation.mutate({
                            websiteUrl: toneAnalysis.website_url ?? undefined,
                            sampleText: toneAnalysis.sample_text ?? undefined,
                          });
                        }}
                      >
                        <RefreshCw className="h-4 w-4 mr-2 text-[#74d1ea]" />
                        Run Again
                      </Button>
                      
                      <Button 
                        className="bg-[#0e131f] hover:bg-[#182030] text-white h-10 border border-[#74d1ea]/20 shadow-[0_0_25px_rgba(116,209,234,0.25)]"
                        onClick={() => navigate("/personas")}
                      >
                        Continue to Persona
                        <ArrowRight className="h-4 w-4 ml-2 text-[#74d1ea]" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Analysis Input Form - Enhanced with platform style */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <div className="group relative bg-[#0a0c10] border border-gray-800/60 rounded-xl overflow-hidden transition-all duration-300 shadow-[0_0_25px_rgba(116,209,234,0.05)]">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0e1b33]/60 via-transparent to-transparent pointer-events-none"></div>
                    <div className="p-6">
                      <div className="flex items-center space-x-3 mb-6">
                        <div className="bg-[#0e131f] border border-[#74d1ea]/20 rounded-lg p-2.5 shadow-[0_0_15px_rgba(116,209,234,0.15)]">
                          <BarChart2 className="h-5 w-5 text-[#74d1ea]" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">Analyze Your Brand's Tone</h3>
                          <p className="text-gray-400 text-sm mt-0.5">Decode your brand's unique voice with AI-powered tone analysis</p>
                        </div>
                      </div>

                      <form onSubmit={handleSubmit}>
                        <Tabs defaultValue="url" className="mb-8" onValueChange={(value) => setAnalysisMethod(value)}>
                          <TabsList className="bg-black/50 border border-gray-800/60 rounded-lg p-1 mb-6">
                            <TabsTrigger 
                              value="url" 
                              className="rounded-md data-[state=active]:bg-[#182030] data-[state=active]:text-[#74d1ea] data-[state=active]:shadow-[0_0_10px_rgba(116,209,234,0.15)]"
                            >
                              <Globe className="h-4 w-4 mr-2" />
                              Website URL
                            </TabsTrigger>
                            <TabsTrigger 
                              value="text" 
                              className="rounded-md data-[state=active]:bg-[#182030] data-[state=active]:text-[#74d1ea] data-[state=active]:shadow-[0_0_10px_rgba(116,209,234,0.15)]"
                            >
                              <FileText className="h-4 w-4 mr-2" />
                              Sample Text
                            </TabsTrigger>
                          </TabsList>
                          
                          <TabsContent value="url" className="mt-4 space-y-6">
                            <div className="space-y-4">
                              <div>
                                <label htmlFor="websiteUrl" className="block text-sm font-medium text-white mb-2">
                                  Website URL
                                </label>
                                <div className="relative">
                                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <LinkIcon className="h-4 w-4 text-[#74d1ea]" />
                                  </div>
                                  <Input
                                    id="websiteUrl"
                                    type="text"
                                    className="pl-10 bg-black/30 border-gray-800/60 focus:border-[#74d1ea]/50 focus:ring-[#74d1ea]/20 h-11"
                                    placeholder="e.g., example.com or https://example.com"
                                    value={websiteUrl}
                                    onChange={(e) => setWebsiteUrl(e.target.value)}
                                  />
                                </div>
                                <p className="mt-2 text-xs text-gray-500">
                                  Enter your website URL to analyze the tone and language patterns
                                </p>
                              </div>
                              
                              <div className="bg-[#0e131f]/50 border border-[#74d1ea]/10 rounded-lg p-4 mt-6">
                                <div className="flex items-start">
                                  <div className="bg-[#182030] border border-[#74d1ea]/20 rounded-md p-1.5 mr-3">
                                    <FileQuestion className="h-4 w-4 text-[#74d1ea]" />
                                  </div>
                                  <div>
                                    <h4 className="text-sm font-medium text-white">How website analysis works</h4>
                                    <p className="text-xs text-gray-400 mt-1">
                                      Our AI will extract and analyze the main content from your website, identifying tone characteristics
                                      and language patterns that define your brand's voice.
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <Button 
                              type="submit" 
                              className="bg-[#8ce1f7] hover:bg-[#74d1ea] text-black font-medium shadow-[0_0_25px_rgba(116,209,234,0.25)]"
                              disabled={toneAnalysisMutation.isPending}
                            >
                              {toneAnalysisMutation.isPending ? (
                                <>
                                  <Loader2 className="mr-2 h-5 w-5 animate-spin text-black" />
                                  Analyzing...
                                </>
                              ) : (
                                <>
                                  <BarChart className="mr-2 h-5 w-5" />
                                  Analyze Website Tone
                                </>
                              )}
                            </Button>
                          </TabsContent>
                          
                          <TabsContent value="text" className="mt-4 space-y-6">
                            <div className="space-y-4">
                              <div>
                                <label htmlFor="sampleText" className="block text-sm font-medium text-white mb-2">
                                  Sample Text
                                </label>
                                <Textarea
                                  id="sampleText"
                                  className="min-h-[200px] bg-black/30 border-gray-800/60 focus:border-[#74d1ea]/50 focus:ring-[#74d1ea]/20"
                                  placeholder="Paste your content here to analyze tone and language patterns..."
                                  value={sampleText}
                                  onChange={(e) => setSampleText(e.target.value)}
                                />
                                <p className="mt-2 text-xs text-gray-500">
                                  Paste sample text from your content, blog posts, or marketing materials
                                </p>
                              </div>
                              
                              <div className="bg-[#0e131f]/50 border border-[#74d1ea]/10 rounded-lg p-4 mt-6">
                                <div className="flex items-start">
                                  <div className="bg-[#182030] border border-[#74d1ea]/20 rounded-md p-1.5 mr-3">
                                    <FileQuestion className="h-4 w-4 text-[#74d1ea]" />
                                  </div>
                                  <div>
                                    <h4 className="text-sm font-medium text-white">How text analysis works</h4>
                                    <p className="text-xs text-gray-400 mt-1">
                                      Our AI will analyze your text to identify tone characteristics, language patterns, 
                                      and provide recommendations for content types that match your brand's voice.
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <Button 
                              type="submit" 
                              className="bg-[#8ce1f7] hover:bg-[#74d1ea] text-black font-medium shadow-[0_0_25px_rgba(116,209,234,0.25)]"
                              disabled={toneAnalysisMutation.isPending}
                            >
                              {toneAnalysisMutation.isPending ? (
                                <>
                                  <Loader2 className="mr-2 h-5 w-5 animate-spin text-black" />
                                  Analyzing...
                                </>
                              ) : (
                                <>
                                  <BarChart className="mr-2 h-5 w-5" />
                                  Analyze Text Tone
                                </>
                              )}
                            </Button>
                          </TabsContent>
                        </Tabs>
                      </form>
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="group relative bg-[#0a0c10] border border-gray-800/60 rounded-xl overflow-hidden transition-all duration-300 shadow-[0_0_25px_rgba(116,209,234,0.05)] h-full">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0e1b33]/60 via-transparent to-transparent pointer-events-none"></div>
                    <div className="p-6">
                      <div className="flex items-center space-x-3 mb-6">
                        <div className="bg-[#0e131f] border border-[#74d1ea]/20 rounded-lg p-2.5 shadow-[0_0_15px_rgba(116,209,234,0.15)]">
                          <BarChart className="h-5 w-5 text-[#74d1ea]" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">Previous Analyses</h3>
                          <p className="text-gray-400 text-sm mt-0.5">View your recent tone analysis results</p>
                        </div>
                      </div>
                      
                      {isLoadingUserAnalyses ? (
                        <div className="flex justify-center items-center py-12">
                          <Loader2 className="h-8 w-8 animate-spin text-[#74d1ea]" />
                        </div>
                      ) : userAnalyses && userAnalyses.length > 0 ? (
                        <div className="space-y-3 mt-4">
                          {[...userAnalyses]
                            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                            .map((analysis) => (
                              <div 
                                key={analysis.id} 
                                className={`p-4 rounded-lg border transition-all duration-200 cursor-pointer ${
                                  currentAnalysisId === analysis.id 
                                    ? 'bg-[#182030] border-[#74d1ea]/30 shadow-[0_0_15px_rgba(116,209,234,0.1)]' 
                                    : 'bg-black/30 border-gray-800/60 hover:bg-[#0e131f]/80 hover:border-gray-700/60'
                                }`}
                                onClick={() => setCurrentAnalysisId(analysis.id)}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 ${
                                      currentAnalysisId === analysis.id 
                                        ? 'bg-[#74d1ea]/20' 
                                        : 'bg-black/40'
                                    }`}>
                                      {analysis.website_url ? (
                                        <Globe className={`h-4 w-4 ${
                                          currentAnalysisId === analysis.id 
                                            ? 'text-[#74d1ea]' 
                                            : 'text-gray-400'
                                        }`} />
                                      ) : (
                                        <FileText className={`h-4 w-4 ${
                                          currentAnalysisId === analysis.id 
                                            ? 'text-[#74d1ea]' 
                                            : 'text-gray-400'
                                        }`} />
                                      )}
                                    </div>
                                    <span className={`text-sm font-medium truncate max-w-[140px] ${
                                      currentAnalysisId === analysis.id 
                                        ? 'text-[#74d1ea]' 
                                        : 'text-white'
                                    }`}>
                                      {analysis.website_url || "Text Sample"}
                                    </span>
                                  </div>
                                  <Badge variant="outline" className={`text-xs ${
                                    currentAnalysisId === analysis.id 
                                      ? 'bg-[#74d1ea]/10 text-[#74d1ea] border-[#74d1ea]/30' 
                                      : 'bg-black/20 border-gray-700'
                                  }`}>
                                    {new Date(analysis.created_at).toLocaleDateString()}
                                  </Badge>
                                </div>
                              </div>
                            ))}
                        </div>
                      ) : (
                        <div className="py-12 text-center">
                          <div className="mb-3 inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#0e131f] border border-[#74d1ea]/20 shadow-[0_0_15px_rgba(116,209,234,0.15)]">
                            <FileQuestion className="h-6 w-6 text-[#74d1ea]" />
                          </div>
                          <h4 className="text-white font-medium mb-2">No analyses yet</h4>
                          <p className="text-gray-400 text-sm max-w-[220px] mx-auto">
                            Submit a URL or text sample to analyze your brand's tone
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}