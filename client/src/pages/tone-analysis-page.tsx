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
                          <span className="h-2 w-2 rounded-full bg-amber-400 mr-1"></span>
                          <span className="text-gray-400">Medium</span>
                        </span>
                        <span className="flex items-center">
                          <span className="h-2 w-2 rounded-full bg-red-400 mr-1"></span>
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
                              indicatorClassName={
                                (value as number) > 70 
                                  ? "bg-[#74d1ea]" 
                                  : (value as number) > 30 
                                    ? "bg-amber-400" 
                                    : "bg-red-400"
                              }
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
                              indicatorClassName={
                                (value as number) > 70 
                                  ? "bg-[#74d1ea]" 
                                  : (value as number) > 30 
                                    ? "bg-amber-400" 
                                    : "bg-red-400"
                              }
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

                  {/* Previous Analyses Selector */}
                  {userAnalyses && userAnalyses.length > 1 && (
                    <div className="mb-8">
                      <h3 className="text-lg font-medium text-white mb-4">Saved Analyses</h3>
                      <div className="flex flex-wrap gap-3">
                        {userAnalyses.map((analysis) => {
                          const isActive = analysis.id === currentAnalysisId;
                          const analysisDate = new Date(analysis.created_at).toLocaleDateString();
                          const source = analysis.website_url ? 
                            new URL(analysis.website_url).hostname : 
                            analysis.sample_text ? 'Text sample' : 'Unknown source';
                          
                          return (
                            <Button
                              key={analysis.id}
                              variant={isActive ? "default" : "outline"}
                              size="sm"
                              className={
                                isActive 
                                  ? "bg-[#74d1ea] text-black hover:bg-[#5db8d0]" 
                                  : "border-gray-700 text-gray-300 hover:text-white"
                              }
                              onClick={() => setCurrentAnalysisId(analysis.id)}
                            >
                              <Calendar className="h-3.5 w-3.5 mr-1.5" />
                              {analysisDate} - {source}
                            </Button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex justify-end space-x-4">
                    <Button
                      variant="outline"
                      className="border-gray-700 text-gray-300 hover:text-white"
                      onClick={() => setCurrentAnalysisId(null)}
                    >
                      New Analysis
                    </Button>
                    
                    <Button
                      variant="outline"
                      className="border-[#74d1ea] text-[#74d1ea] hover:bg-[#74d1ea]/10"
                      onClick={() => {
                        if (toneAnalysis?.website_url) {
                          setWebsiteUrl(toneAnalysis.website_url);
                          setAnalysisMethod("url");
                        } else if (toneAnalysis?.sample_text) {
                          setSampleText(toneAnalysis.sample_text);
                          setAnalysisMethod("text");
                        }
                        // Run the analysis again with the same input
                        toneAnalysisMutation.mutate({
                          websiteUrl: toneAnalysis?.website_url || undefined,
                          sampleText: toneAnalysis?.sample_text || undefined
                        });
                      }}
                    >
                      <RefreshCw className="h-4 w-4 mr-1.5" />
                      Run Again
                    </Button>
                    
                    <Button
                      className="bg-[#74d1ea] hover:bg-[#5db8d0] text-black"
                      onClick={() => navigate("/personas")}
                    >
                      Continue to Personas 
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Analysis Form Section */}
              <div className="mb-8">
                <div className="mb-4">
                  <p className="text-sm text-gray-400">Let us understand your communication style to create perfectly matched content</p>
                </div>

                <Card className="bg-[#111] border-gray-800 rounded-lg overflow-hidden">
                  <CardHeader className="p-4 border-b border-gray-800">
                    <CardTitle className="text-lg font-medium text-white">How would you like your tone analyzed?</CardTitle>
                    <CardDescription className="text-sm text-gray-400">
                      Choose your preferred method for tone analysis
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <Tabs
                      defaultValue={analysisMethod}
                      onValueChange={(value) => setAnalysisMethod(value)}
                      className="w-full"
                    >
                      <TabsList className="grid w-full grid-cols-3 mb-8 bg-black/30">
                        <TabsTrigger 
                          value="url" 
                          className="data-[state=active]:bg-[#74d1ea]/10 data-[state=active]:text-[#74d1ea]"
                        >
                          <Globe className="h-4 w-4 mr-2" />
                          Website URL
                        </TabsTrigger>
                        <TabsTrigger 
                          value="file"
                          className="data-[state=active]:bg-[#74d1ea]/10 data-[state=active]:text-[#74d1ea]"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Upload File
                        </TabsTrigger>
                        <TabsTrigger 
                          value="text"
                          className="data-[state=active]:bg-[#74d1ea]/10 data-[state=active]:text-[#74d1ea]"
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          Text Input
                        </TabsTrigger>
                      </TabsList>

                      <form onSubmit={handleSubmit} className="space-y-6">
                        <TabsContent value="url" className="mt-0">
                          <div className="bg-black/20 border border-gray-800 rounded-lg p-5">
                            <div className="flex items-center mb-4">
                              <div className="w-10 h-10 rounded-full bg-[#74d1ea]/10 flex items-center justify-center">
                                <LinkIcon className="h-5 w-5 text-[#74d1ea]" />
                              </div>
                              <h3 className="ml-3 text-lg font-medium text-white">Website URL</h3>
                            </div>
                            <div className="space-y-4">
                              <div className="flex rounded-md shadow-sm">
                                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-700 bg-black text-gray-500 text-sm">
                                  https://
                                </span>
                                <Input
                                  type="text"
                                  id="website-url"
                                  value={websiteUrl}
                                  onChange={(e) => setWebsiteUrl(e.target.value)}
                                  className="rounded-l-none bg-black border-gray-700 text-white"
                                  placeholder="yourwebsite.com (no need for https://)"
                                />
                              </div>
                              <p className="text-sm text-gray-400">
                                We'll analyze public pages to determine your brand's tone
                              </p>
                            </div>
                          </div>
                        </TabsContent>

                        <TabsContent value="file" className="mt-0">
                          <div className="bg-black/20 border border-gray-800 rounded-lg p-5">
                            <div className="flex items-center mb-4">
                              <div className="w-10 h-10 rounded-full bg-[#74d1ea]/10 flex items-center justify-center">
                                <Upload className="h-5 w-5 text-[#74d1ea]" />
                              </div>
                              <h3 className="ml-3 text-lg font-medium text-white">Upload Files</h3>
                            </div>
                            <div className="flex justify-center px-4 py-5 border-2 border-dashed border-gray-700 rounded-md bg-black/30">
                              <div className="space-y-1 text-center">
                                <div className="flex flex-col items-center">
                                  <Upload className="h-10 w-10 text-gray-500 mb-2" />
                                  <div className="flex text-sm text-gray-400">
                                    <label htmlFor="file-upload" className="relative cursor-pointer text-[#74d1ea] hover:text-[#5db8d0]">
                                      <span>Upload files</span>
                                      <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple />
                                    </label>
                                    <p className="pl-1">or drag and drop</p>
                                  </div>
                                  <p className="text-xs text-gray-500 mt-1">
                                    .txt, .docx, .pdf up to 10MB
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </TabsContent>

                        <TabsContent value="text" className="mt-0">
                          <div className="bg-black/20 border border-gray-800 rounded-lg p-5">
                            <div className="flex items-center mb-4">
                              <div className="w-10 h-10 rounded-full bg-[#74d1ea]/10 flex items-center justify-center">
                                <FileText className="h-5 w-5 text-[#74d1ea]" />
                              </div>
                              <h3 className="ml-3 text-lg font-medium text-white">Content Sample</h3>
                            </div>
                            <div className="space-y-4">
                              <Textarea
                                id="content-sample"
                                value={sampleText}
                                onChange={(e) => setSampleText(e.target.value)}
                                rows={8}
                                className="bg-black border-gray-700 text-white"
                                placeholder="Paste your blog post, email, or other content samples here..."
                              />
                              <p className="text-sm text-gray-400">
                                For best results, provide at least 200 words
                              </p>
                            </div>
                          </div>
                        </TabsContent>

                        <div className="flex justify-end pt-5">
                          <Button 
                            type="button" 
                            variant="outline"
                            className="border-gray-700 text-gray-300 hover:text-white hover:bg-gray-900"
                            onClick={() => navigate('/dashboard')}
                          >
                            Cancel
                          </Button>
                          <Button 
                            type="submit"
                            className="ml-3 bg-[#74d1ea] hover:bg-[#5db8d0] text-black"
                            disabled={toneAnalysisMutation.isPending}
                          >
                            {toneAnalysisMutation.isPending ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Analyzing...
                              </>
                            ) : (
                              "Analyze Tone"
                            )}
                          </Button>
                        </div>
                      </form>
                    </Tabs>
                  </CardContent>
                </Card>
              </div>

              {/* Analysis Process Section */}
              <div>
                <div className="mb-4">
                  <h2 className="text-lg font-medium text-white">Our Analysis Process</h2>
                  <p className="text-sm text-gray-400 mt-1">How we evaluate your brand's tone</p>
                </div>
                
                <Card className="bg-[#111] border-gray-800 rounded-lg overflow-hidden">
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                      <div className="flex flex-col items-center text-center p-4">
                        <div className="w-12 h-12 rounded-full bg-[#74d1ea]/10 flex items-center justify-center mb-4">
                          <span className="text-[#74d1ea] font-medium">1</span>
                        </div>
                        <h3 className="text-white font-medium mb-2">Content Collection</h3>
                        <p className="text-gray-400 text-sm">We gather and process your provided content samples</p>
                      </div>
                      
                      <div className="flex flex-col items-center text-center p-4">
                        <div className="w-12 h-12 rounded-full bg-[#74d1ea]/10 flex items-center justify-center mb-4">
                          <span className="text-[#74d1ea] font-medium">2</span>
                        </div>
                        <h3 className="text-white font-medium mb-2">AI Analysis</h3>
                        <p className="text-gray-400 text-sm">Our AI engine identifies patterns and tone characteristics</p>
                      </div>
                      
                      <div className="flex flex-col items-center text-center p-4">
                        <div className="w-12 h-12 rounded-full bg-[#74d1ea]/10 flex items-center justify-center mb-4">
                          <span className="text-[#74d1ea] font-medium">3</span>
                        </div>
                        <h3 className="text-white font-medium mb-2">Detailed Report</h3>
                        <p className="text-gray-400 text-sm">You receive a comprehensive tone analysis with actionable insights</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}