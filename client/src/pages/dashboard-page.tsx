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
  Copy,
  Edit,
  Lightbulb,
  Sparkles
} from "lucide-react";
import { SiLinkedin } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import Layout from "@/components/Layout";
import { ToneAnalysis, Persona, GeneratedContent } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";
import { Progress } from "@/components/ui/progress";
import { CampaignOverviewDashboard } from "@/components/CampaignOverviewDashboard";
import { PersonasOverview } from "@/components/PersonasOverview";

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

  // Calculate content type distribution from real data
  const linkedInPostCount = contentList?.filter(c => c.type === "linkedin_post").length || 0;
  const coldEmailCount = contentList?.filter(c => c.type === "email").length || 0;
  const totalContent = linkedInPostCount + coldEmailCount;
  
  const contentTypes = [
    { 
      label: "LinkedIn Posts", 
      count: linkedInPostCount, 
      percentage: totalContent > 0 ? Math.round((linkedInPostCount / totalContent) * 100) : 0, 
      color: "#74d1ea" 
    },
    { 
      label: "Cold Emails", 
      count: coldEmailCount, 
      percentage: totalContent > 0 ? Math.round((coldEmailCount / totalContent) * 100) : 0, 
      color: "#4983ab" 
    },
  ];

  // Extract and aggregate tone characteristics from tone analyses
  const toneScores: Record<string, number[]> = {};
  
  toneAnalyses?.forEach(analysis => {
    if (analysis.tone_results) {
      // Safe access to characteristics with type assertion
      const characteristics = (analysis.tone_results as any).characteristics;
      if (characteristics) {
        Object.entries(characteristics).forEach(([tone, score]) => {
          if (!toneScores[tone]) {
            toneScores[tone] = [];
          }
          toneScores[tone].push(Number(score));
        });
      }
    }
  });
  
  // Calculate average scores and sort by highest score
  const topTones = Object.entries(toneScores)
    .map(([tone, scores]) => {
      const avgScore = scores.length > 0 
        ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length) 
        : 0;
      return { tone: tone.charAt(0).toUpperCase() + tone.slice(1), score: avgScore };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 5); // Just take top 5 tones
    
  // If we don't have any tone analysis yet, use empty array
  const finalTopTones = topTones.length > 0 ? topTones : [];

  return (
    <Layout showSidebar={true}>
      <div className="flex-1 overflow-y-auto bg-black">
        <div className="p-6">
          {/* Header Section */}
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
            </div>
          </div>

          {/* Campaign and Personas Overview Section */}
          <div className="mb-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <CampaignOverviewDashboard />
              <PersonasOverview />
            </div>
          </div>

          {/* Platform Feature Cards - Enhanced with platform style */}
          <div className="mb-10">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-white">AI-Powered Tools</h2>
              <p className="text-sm text-gray-400 mt-1">Leverage powerful AI to enhance your content strategy</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Advanced Tone Analysis Card */}
              <div 
                className="group relative bg-black border border-gray-800/60 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-[0_0_25px_rgba(116,209,234,0.15)] cursor-pointer"
                onClick={() => navigate('/tone-analysis')}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-[#0e1b33]/60 via-transparent to-transparent pointer-events-none"></div>
                <div className="p-6">
                  <div className="bg-[#0e131f] border border-[#74d1ea]/20 h-12 w-12 rounded-xl flex items-center justify-center mb-5 shadow-[0_0_15px_rgba(116,209,234,0.15)]">
                    <BarChart2 className="h-6 w-6 text-[#74d1ea]" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-3">Advanced Tone Analysis</h3>
                  <p className="text-gray-400 mb-5">Decode your brand's unique voice with our AI-powered tone analysis. Understand exactly how professional, conversational, or formal your content appears.</p>
                  
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start">
                      <div className="text-[#74d1ea] mr-3 mt-0.5">✓</div>
                      <span className="text-sm text-gray-300">Quantitative tone metrics across 5 key dimensions</span>
                    </li>
                    <li className="flex items-start">
                      <div className="text-[#74d1ea] mr-3 mt-0.5">✓</div>
                      <span className="text-sm text-gray-300">Identify your most common language patterns</span>
                    </li>
                    <li className="flex items-start">
                      <div className="text-[#74d1ea] mr-3 mt-0.5">✓</div>
                      <span className="text-sm text-gray-300">Content type recommendations based on your tone</span>
                    </li>
                  </ul>
                  
                  <Button variant="link" className="text-[#74d1ea] hover:text-[#5db8d0] p-0 h-auto">
                    Explore Tone Analysis →
                  </Button>
                </div>
              </div>
              
              {/* Campaign Factory Card - Premium Feature */}
              <div 
                className="group relative bg-black border border-gray-800/60 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-[0_0_25px_rgba(116,209,234,0.15)] cursor-pointer"
                onClick={() => navigate('/campaign-factory')}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-[#0e1b33]/60 via-transparent to-transparent pointer-events-none"></div>
                <div className="p-6">
                  <div className="flex justify-between items-center mb-5">
                    <div className="bg-[#0e131f] border border-[#74d1ea]/20 h-12 w-12 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(116,209,234,0.15)]">
                      <Sparkles className="h-6 w-6 text-[#74d1ea]" />
                    </div>
                    <div className="bg-[#74d1ea]/10 px-2 py-1 rounded-md text-xs text-[#74d1ea] border border-[#74d1ea]/30">
                      Premium Feature
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-3">Campaign Factory</h3>
                  <p className="text-gray-400 mb-5">Generate complete, strategic marketing campaigns from a single prompt. Create targeted content for multiple personas, tailored to your brand's voice.</p>
                  
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start">
                      <div className="text-[#74d1ea] mr-3 mt-0.5">✓</div>
                      <span className="text-sm text-gray-300">Multi-persona campaign strategy generation</span>
                    </li>
                    <li className="flex items-start">
                      <div className="text-[#74d1ea] mr-3 mt-0.5">✓</div>
                      <span className="text-sm text-gray-300">Full campaign content suite with email, social & ads</span>
                    </li>
                    <li className="flex items-start">
                      <div className="text-[#74d1ea] mr-3 mt-0.5">✓</div>
                      <span className="text-sm text-gray-300">Timeline & channel strategy recommendations</span>
                    </li>
                  </ul>
                  
                  <Button variant="link" className="text-[#74d1ea] hover:text-[#5db8d0] p-0 h-auto">
                    Access Campaign Factory →
                  </Button>
                </div>
              </div>
              
              {/* Target Personas Card */}
              <div 
                className="group relative bg-black border border-gray-800/60 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-[0_0_25px_rgba(116,209,234,0.15)] cursor-pointer"
                onClick={() => navigate('/personas')}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-[#0e1b33]/60 via-transparent to-transparent pointer-events-none"></div>
                <div className="p-6">
                  <div className="bg-[#0e131f] border border-[#74d1ea]/20 h-12 w-12 rounded-xl flex items-center justify-center mb-5 shadow-[0_0_15px_rgba(116,209,234,0.15)]">
                    <Users className="h-6 w-6 text-[#74d1ea]" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-3">AI Personas</h3>
                  <p className="text-gray-400 mb-5">Connect with your ideal audience using tailored AI personas. Our platform helps you create, manage, and target specific professional personas.</p>
                  
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start">
                      <div className="text-[#74d1ea] mr-3 mt-0.5">✓</div>
                      <span className="text-sm text-gray-300">Create AI-generated or custom personas</span>
                    </li>
                    <li className="flex items-start">
                      <div className="text-[#74d1ea] mr-3 mt-0.5">✓</div>
                      <span className="text-sm text-gray-300">Define interests, pain points, and motivations</span>
                    </li>
                    <li className="flex items-start">
                      <div className="text-[#74d1ea] mr-3 mt-0.5">✓</div>
                      <span className="text-sm text-gray-300">Generate content specifically tailored to each persona</span>
                    </li>
                  </ul>
                  
                  <Button variant="link" className="text-[#74d1ea] hover:text-[#5db8d0] p-0 h-auto">
                    Explore Personas →
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Saved Content Section */}
          <div className="mb-10">
            <div className="mb-6 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-white">Saved Content</h2>
                <p className="text-sm text-gray-400 mt-1">Quick access to your recent content</p>
              </div>
              {contentList && contentList.length > 0 && (
                <Button 
                  variant="outline" 
                  size="sm"
                  className="bg-transparent border-gray-700 hover:bg-gray-800 text-gray-300"
                  onClick={() => window.open('/saved-content', '_blank')}
                >
                  <Archive className="h-4 w-4 mr-2" />
                  View All
                </Button>
              )}
            </div>
            
            {contentList && contentList.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {contentList.slice(0, 3).map((content) => (
                  <Card key={content.id} className="bg-black border border-gray-800/60 hover:shadow-[0_0_15px_rgba(116,209,234,0.1)] transition-all duration-300">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          {content.type === 'linkedin_post' ? (
                            <div className="bg-[#0e131f] h-8 w-8 rounded-lg flex items-center justify-center mr-3">
                              <SiLinkedin className="h-4 w-4 text-[#0A66C2]" />
                            </div>
                          ) : (
                            <div className="bg-[#0e131f] h-8 w-8 rounded-lg flex items-center justify-center mr-3">
                              <Mail className="h-4 w-4 text-[#74d1ea]" />
                            </div>
                          )}
                          <CardTitle className="text-sm font-medium text-white">
                            {content.type === 'linkedin_post' ? 'LinkedIn Post' : 'Email'}
                          </CardTitle>
                        </div>
                        <div className="text-xs text-gray-500">
                          {content.created_at && formatDistanceToNow(new Date(content.created_at), { addSuffix: true })}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="text-sm text-gray-300 line-clamp-2">
                        {content.content_text.slice(0, 120)}...
                      </p>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2 pt-0">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 px-2 text-gray-400 hover:text-white hover:bg-gray-800"
                        onClick={() => {
                          navigator.clipboard.writeText(content.content_text);
                        }}
                      >
                        <Copy className="h-3.5 w-3.5 mr-1" />
                        <span className="text-xs">Copy</span>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 px-2 text-gray-400 hover:text-white hover:bg-gray-800"
                        onClick={() => window.open('/saved-content', '_blank')}
                      >
                        <Edit className="h-3.5 w-3.5 mr-1" />
                        <span className="text-xs">View</span>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 px-6 border border-dashed border-gray-700 rounded-xl">
                <Archive className="h-10 w-10 text-gray-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">No saved content yet</h3>
                <p className="text-sm text-gray-400 mb-4">
                  Use our Content Generator to create and save your marketing content
                </p>
                <Button 
                  onClick={() => navigate('/content-generator')}
                  className="bg-[#74d1ea] hover:bg-[#5db8d0] text-black"
                >
                  Create Content
                </Button>
              </div>
            )}
          </div>

        </div>
      </div>
    </Layout>
  );
}