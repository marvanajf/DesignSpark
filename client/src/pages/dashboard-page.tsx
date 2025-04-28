import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { 
  Loader2, 
  FileText, 
  Users, 
  Archive, 
  BarChart2, 
  Mail, 
  Linkedin,
  Filter,
  Calendar,
  ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import Layout from "@/components/Layout";
import { ToneAnalysis, Persona, GeneratedContent } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";
import { Progress } from "@/components/ui/progress";

export default function DashboardPage() {
  const { user } = useAuth();
  const [, navigate] = useLocation();

  // Fetch tone analyses
  const { data: toneAnalyses, isLoading: isLoadingTones } = useQuery<ToneAnalysis[]>({
    queryKey: ["/api/tone-analyses"],
  });

  // Fetch personas
  const { data: personas, isLoading: isLoadingPersonas } = useQuery<Persona[]>({
    queryKey: ["/api/personas"],
  });

  // Fetch generated content
  const { data: contentList, isLoading: isLoadingContent } = useQuery<GeneratedContent[]>({
    queryKey: ["/api/content"],
  });

  const isLoading = isLoadingTones || isLoadingPersonas || isLoadingContent;
  const selectedPersonas = personas?.filter(p => p.is_selected) || [];

  if (isLoading) {
    return (
      <Layout showSidebar={true}>
        <div className="flex justify-center items-center h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-[#74d1ea]" />
        </div>
      </Layout>
    );
  }

  // Content Type Data for the chart
  const contentTypes = [
    { label: "LinkedIn Posts", count: contentList?.filter(c => c.type === "linkedin_post").length || 0, percentage: 70, color: "#74d1ea" },
    { label: "Cold Emails", count: contentList?.filter(c => c.type === "cold_email").length || 0, percentage: 30, color: "#4983ab" },
  ];

  const topTones = [
    { tone: "Professional", score: 88 },
    { tone: "Conversational", score: 73 },
    { tone: "Technical", score: 70 },
    { tone: "Friendly", score: 55 },
    { tone: "Formal", score: 49 },
  ];

  return (
    <Layout showSidebar={true}>
      <div className="flex-1 overflow-y-auto bg-black">
        <div className="p-6">
          {/* Header Section with Filters */}
          <div className="mb-6">
            <div className="flex justify-between items-center">
              <div>
                <div className="flex items-center text-sm text-gray-400">
                  <span>Tovably</span>
                  <span className="mx-2">›</span>
                  <span>Dashboard</span>
                </div>
                <h1 className="text-2xl font-semibold text-white mt-1">Dashboard</h1>
              </div>
              <div className="flex space-x-3">
                <div className="flex items-center space-x-2 bg-[#111] border border-gray-800 rounded-md px-3 py-1.5 text-sm text-gray-300">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span>Last 24 hours</span>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </div>
                <Button variant="outline" className="text-sm h-9 border-gray-800 bg-[#111] hover:bg-gray-900">
                  <Filter className="h-4 w-4 mr-2" />
                  <span>Filter</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Dashboard Overview Section */}
          <div className="mb-8">
            <div className="mb-4">
              <h2 className="text-lg font-medium text-white">Dashboard Overview</h2>
              <p className="text-sm text-gray-400 mt-1">Content analytics and generation insights</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
              {/* Main Content Chart Area - 4 columns */}
              <Card className="lg:col-span-4 bg-[#111] border-gray-800 rounded-lg overflow-hidden">
                <CardHeader className="p-4 border-b border-gray-800">
                  <h3 className="font-medium text-white">Content Type Distribution</h3>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="h-64 flex items-center justify-center">
                    {contentList && contentList.length > 0 ? (
                      <div className="w-full">
                        {contentTypes.map((type, index) => (
                          <div key={index} className="mb-6">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm text-gray-300">{type.label}</span>
                              <span className="text-sm text-gray-400">{type.count}</span>
                            </div>
                            <Progress value={type.percentage} className="h-2 bg-gray-800" indicatorClassName={index === 0 ? "bg-[#74d1ea]" : "bg-[#4983ab]"} />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center text-gray-400">
                        <p>No content generated yet</p>
                        <Button 
                          onClick={() => navigate('/content-generator')}
                          className="mt-4 bg-[#74d1ea] hover:bg-[#5db8d0] text-black"
                        >
                          Generate Content
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Top Tones Section - 3 columns */}
              <Card className="lg:col-span-3 bg-[#111] border-gray-800 rounded-lg overflow-hidden">
                <CardHeader className="p-4 border-b border-gray-800">
                  <h3 className="font-medium text-white">Top Tones</h3>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    {topTones.map((tone, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="text-gray-300 w-8">{index + 1}</span>
                          <span className="text-white">{tone.tone}</span>
                        </div>
                        <span className="text-gray-400">{tone.score}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Quick Actions Section */}
          <div className="mb-8">
            <div className="mb-4">
              <h2 className="text-lg font-medium text-white">Quick Actions</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card 
                className="bg-[#111] border-gray-800 rounded-lg overflow-hidden cursor-pointer hover:bg-gray-900 transition-all duration-300" 
                onClick={() => navigate('/tone-analysis')}
              >
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-[#74d1ea]/10 flex items-center justify-center">
                      <BarChart2 className="h-5 w-5 text-[#74d1ea]" />
                    </div>
                    <p className="ml-3 text-white">New Tone Analysis</p>
                  </div>
                </CardContent>
              </Card>

              <Card 
                className="bg-[#111] border-gray-800 rounded-lg overflow-hidden cursor-pointer hover:bg-gray-900 transition-all duration-300" 
                onClick={() => navigate('/personas')}
              >
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-[#74d1ea]/10 flex items-center justify-center">
                      <Users className="h-5 w-5 text-[#74d1ea]" />
                    </div>
                    <p className="ml-3 text-white">Select Personas</p>
                  </div>
                </CardContent>
              </Card>

              <Card 
                className="bg-[#111] border-gray-800 rounded-lg overflow-hidden cursor-pointer hover:bg-gray-900 transition-all duration-300" 
                onClick={() => navigate('/content-generator')}
              >
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-[#74d1ea]/10 flex items-center justify-center">
                      <Linkedin className="h-5 w-5 text-[#74d1ea]" />
                    </div>
                    <p className="ml-3 text-white">LinkedIn Post</p>
                  </div>
                </CardContent>
              </Card>

              <Card 
                className="bg-[#111] border-gray-800 rounded-lg overflow-hidden cursor-pointer hover:bg-gray-900 transition-all duration-300" 
                onClick={() => navigate('/content-generator')}
              >
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-[#74d1ea]/10 flex items-center justify-center">
                      <Mail className="h-5 w-5 text-[#74d1ea]" />
                    </div>
                    <p className="ml-3 text-white">Cold Email</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Recent Content / Activity Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-medium text-white">Recent Content</h2>
                <p className="text-sm text-gray-400 mt-1">Your recently generated content</p>
              </div>
              <Button
                variant="ghost" 
                onClick={() => navigate('/saved-content')}
                className="text-sm text-[#74d1ea] hover:text-[#5db8d0] hover:bg-transparent"
              >
                View all
              </Button>
            </div>
            
            <Card className="bg-[#111] border-gray-800 rounded-lg overflow-hidden">
              {contentList && contentList.length > 0 ? (
                <div className="divide-y divide-gray-800">
                  {contentList.slice(0, 5).map((content) => (
                    <div key={content.id} className="p-4 hover:bg-gray-900">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center mb-1">
                            {content.type === "linkedin_post" ? (
                              <Linkedin className="h-4 w-4 text-[#74d1ea] mr-2" />
                            ) : (
                              <Mail className="h-4 w-4 text-[#74d1ea] mr-2" />
                            )}
                            <h4 className="font-medium text-white">{content.type === "linkedin_post" ? "LinkedIn Post" : "Cold Email"}</h4>
                          </div>
                          <p className="text-sm text-gray-400 line-clamp-1">{content.content_text.substring(0, 100)}...</p>
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(content.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <CardContent className="p-6 text-center">
                  <p className="text-gray-400 mb-4">You haven't generated any content yet.</p>
                  <Button 
                    onClick={() => navigate('/content-generator')}
                    className="bg-[#74d1ea] hover:bg-[#5db8d0] text-black"
                  >
                    Generate Your First Content
                  </Button>
                </CardContent>
              )}
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}