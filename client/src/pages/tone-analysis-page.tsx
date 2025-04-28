import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
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
  Sparkles
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
              {/* Tone Analysis Results */}
              <div className="bg-[#111] border border-gray-800 rounded-lg overflow-hidden">
                <div className="p-6 border-b border-gray-800">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-[#74d1ea]/20 flex items-center justify-center mr-3">
                        <BarChart2 className="h-4 w-4 text-[#74d1ea]" />
                      </div>
                      <h2 className="text-xl font-semibold text-white">Tone Analysis Results</h2>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-[#74d1ea]/10 text-[#74d1ea] hover:bg-[#74d1ea]/20 px-3 py-1">
                        <CheckCircle className="h-3 w-3 mr-1" /> Complete
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  {/* Top themes/keywords section inspired by reference image */}
                  <div className="mb-8">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium text-white">Tone Characteristics</h3>
                      <div className="flex items-center text-xs">
                        <span className="flex items-center mr-3">
                          <span className="h-2 w-2 rounded-full bg-[#74d1ea] mr-1"></span>
                          <span className="text-gray-400">High</span>
                        </span>
                        <span className="flex items-center mr-3">
                          <span className="h-2 w-2 rounded-full bg-[#74d1ea]/70 mr-1"></span>
                          <span className="text-gray-400">Medium</span>
                        </span>
                        <span className="flex items-center">
                          <span className="h-2 w-2 rounded-full bg-[#74d1ea]/40 mr-1"></span>
                          <span className="text-gray-400">Low</span>
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        {Object.entries(toneAnalysis.tone_results.characteristics).slice(0, 3).map(([key, value]) => (
                          <div key={key} className="space-y-1">
                            <div className="flex justify-between">
                              <span className="text-sm font-medium capitalize text-white">{key}</span>
                              <span className="text-sm font-medium text-gray-400">{value}%</span>
                            </div>
                            <Progress 
                              value={value as number} 
                              className="h-2" 
                              indicatorClassName="bg-[#74d1ea]"
                            />
                          </div>
                        ))}
                      </div>
                      <div className="space-y-4">
                        {Object.entries(toneAnalysis.tone_results.characteristics).slice(3).map(([key, value]) => (
                          <div key={key} className="space-y-1">
                            <div className="flex justify-between">
                              <span className="text-sm font-medium capitalize text-white">{key}</span>
                              <span className="text-sm font-medium text-gray-400">{value}%</span>
                            </div>
                            <Progress 
                              value={value as number} 
                              className="h-2" 
                              indicatorClassName="bg-[#74d1ea]"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Language Patterns Section */}
                  <div className="mb-8">
                    <h3 className="text-lg font-medium text-white mb-4">Language Patterns</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Highlight Common Phrases specially */}
                      {Object.entries(toneAnalysis.tone_results.language_patterns)
                        .filter(([key]) => key === 'common_phrases')
                        .map(([key, value]) => (
                          <div key={key} className="md:col-span-2 bg-[#74d1ea]/5 border border-[#74d1ea]/20 rounded-lg p-5 shadow-[0_0_15px_rgba(116,209,234,0.05)]">
                            <div className="flex items-center mb-4">
                              <div className="w-10 h-10 rounded-full bg-[#74d1ea]/10 flex items-center justify-center mr-3">
                                <MessageSquare className="h-5 w-5 text-[#74d1ea]" />
                              </div>
                              <h4 className="text-lg font-medium text-white capitalize">
                                Common Phrases
                                <span className="ml-2 text-xs text-[#74d1ea] bg-[#74d1ea]/10 px-2 py-0.5 rounded">
                                  Brand Identifiers
                                </span>
                              </h4>
                            </div>
                            
                            {Array.isArray(value) && (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {value.map((phrase, i) => (
                                  <div 
                                    key={i} 
                                    className="bg-black/30 border border-gray-800 p-3 rounded-md flex items-start"
                                  >
                                    <div className="mr-3 mt-0.5">
                                      <Sparkles className="h-4 w-4 text-[#74d1ea]" />
                                    </div>
                                    <div>
                                      <p className="text-white text-sm font-medium mb-1">{phrase}</p>
                                      <p className="text-gray-400 text-xs">
                                        Distinctive phrase that helps define your brand voice
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                      ))}
                      
                      {/* Other language patterns */}
                      {Object.entries(toneAnalysis.tone_results.language_patterns)
                        .filter(([key]) => key !== 'common_phrases')
                        .map(([key, value]) => (
                          <div key={key} className="bg-black/20 border border-gray-800 rounded-lg p-4">
                            <h4 className="text-white font-medium capitalize mb-2">{key.replace('_', ' ')}</h4>
                            {Array.isArray(value) ? (
                              <ul className="space-y-1">
                                {value.map((item, i) => (
                                  <li key={i} className="text-gray-400 text-sm flex items-start">
                                    <span className="text-[#74d1ea] mr-2">•</span>
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-gray-400 text-sm">{value}</p>
                            )}
                          </div>
                      ))}
                    </div>
                  </div>

                  {/* Summary and Recommendations Section */}
                  <div className="mb-8">
                    <h3 className="text-lg font-medium text-white mb-4">Summary & Recommendations</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-black/20 border border-gray-800 rounded-lg p-4">
                        <div className="flex items-center mb-3">
                          <PieChart className="h-5 w-5 text-[#74d1ea] mr-2" />
                          <h4 className="text-white font-medium">Tone Summary</h4>
                        </div>
                        <p className="text-gray-400 text-sm">{toneAnalysis.tone_results.summary}</p>
                      </div>
                      
                      <div className="bg-black/20 border border-gray-800 rounded-lg p-4">
                        <div className="flex items-center mb-3">
                          <List className="h-5 w-5 text-[#74d1ea] mr-2" />
                          <h4 className="text-white font-medium">Recommended Content Types</h4>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {toneAnalysis.tone_results.recommended_content_types.map((type, i) => (
                            <Badge key={i} className="bg-[#74d1ea]/10 text-[#74d1ea] hover:bg-[#74d1ea]/20">
                              {type}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions Buttons Row */}
                  <div className="flex justify-between">
                    <Button 
                      variant="outline" 
                      className="space-x-2"
                      size="sm"
                      onClick={() => {
                        setCurrentAnalysisId(null);
                        navigate("/tone-analysis");
                      }}
                    >
                      <RefreshCw className="w-4 h-4" />
                      <span>New Analysis</span>
                    </Button>
                    
                    <div className="space-x-2">
                      <Button 
                        variant="outline" 
                        className="space-x-2 bg-transparent border-gray-700 hover:bg-gray-800"
                        size="sm"
                        onClick={() => {
                          toneAnalysisMutation.mutate({
                            websiteUrl: toneAnalysis.website_url,
                            sampleText: toneAnalysis.sample_text,
                          });
                        }}
                      >
                        <RefreshCw className="w-4 h-4" />
                        <span>Run Again</span>
                      </Button>
                      
                      <Button 
                        className="space-x-2 bg-[#74d1ea] hover:bg-[#74d1ea]/90"
                        size="sm"
                        onClick={() => navigate("/personas")}
                      >
                        <span>Continue to Persona</span>
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Analysis Input Form */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Card className="bg-[#111] border-gray-800">
                    <CardHeader>
                      <CardTitle className="text-xl text-white">Analyze Your Brand's Tone</CardTitle>
                      <CardDescription className="text-gray-400">
                        Enter your website URL or paste sample text to analyze the tone and language patterns.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleSubmit}>
                        <Tabs defaultValue="url" className="mb-6" onValueChange={(value) => setAnalysisMethod(value)}>
                          <TabsList className="bg-black/30 border border-gray-800">
                            <TabsTrigger value="url" className="data-[state=active]:bg-[#74d1ea]/10 data-[state=active]:text-[#74d1ea]">
                              <Globe className="h-4 w-4 mr-2" />
                              Website URL
                            </TabsTrigger>
                            <TabsTrigger value="text" className="data-[state=active]:bg-[#74d1ea]/10 data-[state=active]:text-[#74d1ea]">
                              <FileText className="h-4 w-4 mr-2" />
                              Sample Text
                            </TabsTrigger>
                          </TabsList>
                          
                          <TabsContent value="url" className="mt-4">
                            <div className="space-y-4">
                              <div>
                                <label htmlFor="websiteUrl" className="block text-sm font-medium text-gray-300 mb-1">
                                  Website URL
                                </label>
                                <div className="relative">
                                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <LinkIcon className="h-4 w-4 text-gray-400" />
                                  </div>
                                  <Input
                                    id="websiteUrl"
                                    type="text"
                                    className="pl-10 bg-black/30 border-gray-700 focus:border-[#74d1ea] focus:ring-[#74d1ea]/10 text-white"
                                    placeholder="e.g., example.com or https://example.com"
                                    value={websiteUrl}
                                    onChange={(e) => setWebsiteUrl(e.target.value)}
                                  />
                                </div>
                                <p className="mt-1 text-xs text-gray-400">
                                  Enter your website URL to analyze the tone and language patterns.
                                </p>
                              </div>
                              
                              <Button 
                                type="submit" 
                                className="bg-[#74d1ea] hover:bg-[#74d1ea]/90 text-black font-medium w-full"
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
                                    Analyze Website Tone
                                  </>
                                )}
                              </Button>
                            </div>
                          </TabsContent>
                          
                          <TabsContent value="text" className="mt-4">
                            <div className="space-y-4">
                              <div>
                                <label htmlFor="sampleText" className="block text-sm font-medium text-gray-300 mb-1">
                                  Sample Text
                                </label>
                                <Textarea
                                  id="sampleText"
                                  className="min-h-[200px] bg-black/30 border-gray-700 focus:border-[#74d1ea] focus:ring-[#74d1ea]/10 text-white"
                                  placeholder="Paste your content here to analyze tone and language patterns..."
                                  value={sampleText}
                                  onChange={(e) => setSampleText(e.target.value)}
                                />
                                <p className="mt-1 text-xs text-gray-400">
                                  Paste sample text from your content, blog posts, or marketing materials.
                                </p>
                              </div>
                              
                              <Button 
                                type="submit" 
                                className="bg-[#74d1ea] hover:bg-[#74d1ea]/90 text-black font-medium w-full"
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
                                    Analyze Text Tone
                                  </>
                                )}
                              </Button>
                            </div>
                          </TabsContent>
                        </Tabs>
                      </form>
                    </CardContent>
                  </Card>
                </div>
                
                <div>
                  <Card className="bg-[#111] border-gray-800 h-full">
                    <CardHeader>
                      <CardTitle className="text-xl text-white">Previous Analyses</CardTitle>
                      <CardDescription className="text-gray-400">
                        View your recent tone analysis results.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {isLoadingUserAnalyses ? (
                        <div className="flex justify-center items-center py-8">
                          <Loader2 className="h-8 w-8 animate-spin text-[#74d1ea]" />
                        </div>
                      ) : userAnalyses && userAnalyses.length > 0 ? (
                        <div className="space-y-3">
                          {[...userAnalyses]
                            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                            .map((analysis) => (
                              <div 
                                key={analysis.id} 
                                className={`p-3 rounded-md border cursor-pointer transition-colors ${
                                  currentAnalysisId === analysis.id 
                                    ? 'bg-[#74d1ea]/5 border-[#74d1ea]/20' 
                                    : 'bg-black/20 border-gray-800 hover:bg-black/30'
                                }`}
                                onClick={() => setCurrentAnalysisId(analysis.id)}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center">
                                    {analysis.website_url ? (
                                      <Globe className="h-4 w-4 text-gray-400 mr-2" />
                                    ) : (
                                      <FileText className="h-4 w-4 text-gray-400 mr-2" />
                                    )}
                                    <span className="text-sm font-medium text-white truncate max-w-[180px]">
                                      {analysis.website_url || "Text Analysis"}
                                    </span>
                                  </div>
                                  <Badge variant="outline" className="text-xs">
                                    {new Date(analysis.created_at).toLocaleDateString()}
                                  </Badge>
                                </div>
                              </div>
                            ))}
                        </div>
                      ) : (
                        <div className="py-8 text-center">
                          <FileQuestion className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                          <p className="text-gray-400 text-sm">No previous analyses found.</p>
                          <p className="text-gray-500 text-xs mt-1">Your analyses will appear here.</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}