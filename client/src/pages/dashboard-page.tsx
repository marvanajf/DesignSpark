import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Loader2, FileText, Users, PenTool, Archive, BarChart2, Mail, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Layout from "@/components/Layout";
import SavedContentList from "@/components/SavedContentList";
import { ToneAnalysis, Persona, GeneratedContent } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";

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
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout showSidebar={true}>
      <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            <h1 className="text-2xl font-semibold">Dashboard</h1>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            <div className="py-4">
              {/* Stats Section */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-primary rounded-md p-3">
                        <FileText className="h-5 w-5 text-white" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-muted-foreground truncate">Content Generated</dt>
                          <dd>
                            <div className="text-lg font-medium">{contentList?.length || 0}</div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                        <BarChart2 className="h-5 w-5 text-white" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-muted-foreground truncate">Tone Analyses</dt>
                          <dd>
                            <div className="text-lg font-medium">{toneAnalyses?.length || 0}</div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                        <Users className="h-5 w-5 text-white" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-muted-foreground truncate">Active Personas</dt>
                          <dd>
                            <div className="text-lg font-medium">{selectedPersonas.length}</div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <div className="mt-8">
                <h2 className="text-lg font-medium mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  <Card className="bg-gradient-to-br from-card to-card border border-border overflow-hidden shadow cursor-pointer hover:from-green-900/30 hover:to-card transition-all duration-300" onClick={() => navigate('/tone-analysis')}>
                    <CardContent className="p-4">
                      <div className="flex items-center">
                        <BarChart2 className="h-5 w-5 text-primary" />
                        <p className="ml-3 text-base font-medium">New Tone Analysis</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-card to-card border border-border overflow-hidden shadow cursor-pointer hover:from-green-900/30 hover:to-card transition-all duration-300" onClick={() => navigate('/personas')}>
                    <CardContent className="p-4">
                      <div className="flex items-center">
                        <Users className="h-5 w-5 text-blue-500" />
                        <p className="ml-3 text-base font-medium">Select Personas</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-card to-card border border-border overflow-hidden shadow cursor-pointer hover:from-green-900/30 hover:to-card transition-all duration-300" onClick={() => navigate('/content-generator')}>
                    <CardContent className="p-4">
                      <div className="flex items-center">
                        <Linkedin className="h-5 w-5 text-blue-600" />
                        <p className="ml-3 text-base font-medium">Generate LinkedIn Post</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-card to-card border border-border overflow-hidden shadow cursor-pointer hover:from-green-900/30 hover:to-card transition-all duration-300" onClick={() => navigate('/content-generator')}>
                    <CardContent className="p-4">
                      <div className="flex items-center">
                        <Mail className="h-5 w-5 text-yellow-500" />
                        <p className="ml-3 text-base font-medium">Generate Cold Email</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Recent Content */}
              <div className="mt-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-medium">Recent Content</h2>
                  <Button
                    variant="link" 
                    onClick={() => navigate('/saved-content')}
                    className="text-sm text-primary hover:text-primary/80"
                  >
                    View all
                  </Button>
                </div>
                
                {contentList && contentList.length > 0 ? (
                  <SavedContentList />
                ) : (
                  <Card>
                    <CardContent className="p-6 text-center">
                      <p className="text-muted-foreground mb-4">You haven't generated any content yet.</p>
                      <Button onClick={() => navigate('/content-generator')}>
                        Generate Your First Content
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
