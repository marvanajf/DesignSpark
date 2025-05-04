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
            <div className="mb-6">
              <h2 className="text-xl font-bold text-white">Campaign & Persona Management</h2>
              <p className="text-sm text-gray-400 mt-1">Manage your active campaigns and AI personas</p>
            </div>
            
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

          {/* Recent Content Section - Enhanced with platform style */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-white">Recent Content</h2>
                <p className="text-sm text-gray-400 mt-1">Your recently generated content</p>
              </div>
              <Button
                variant="outline" 
                onClick={() => navigate('/saved-content')}
                className="border border-[#74d1ea]/30 text-[#74d1ea] bg-transparent hover:bg-[#74d1ea]/10 hover:text-[#74d1ea]"
              >
                View all content
              </Button>
            </div>
            
            <div className="group relative bg-black border border-gray-800/60 rounded-xl overflow-hidden transition-all duration-300 shadow-[0_0_25px_rgba(116,209,234,0.05)]">
              <div className="absolute inset-0 bg-gradient-to-t from-[#74d1ea]/5 via-transparent to-transparent pointer-events-none opacity-50"></div>
              
              {contentList && contentList.length > 0 ? (
                <div>
                  {contentList.slice(0, 3).map((content, index) => (
                    <div 
                      key={content.id} 
                      className={`p-6 bg-black hover:bg-black/80 transition-colors duration-200 ${
                        index !== contentList.slice(0, 3).length - 1 ? 'border-b border-gray-800/60' : ''
                      }`}
                    >
                      <div className="flex items-start space-x-4">
                        <div className="bg-[#182030] border border-[#74d1ea]/20 rounded-lg h-12 w-12 flex items-center justify-center flex-shrink-0 shadow-[0_0_15px_rgba(116,209,234,0.15)]">
                          {content.type === "linkedin_post" ? (
                            <SiLinkedin className="h-5 w-5 text-[#74d1ea]" />
                          ) : (
                            <Mail className="h-5 w-5 text-[#74d1ea]" />
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-medium text-white truncate">
                              {content.type === "linkedin_post" ? "LinkedIn Post" : "Cold Email"}
                              {content.topic && ` - ${content.topic}`}
                            </h4>
                            <div className="flex items-center text-xs text-[#74d1ea] font-medium">
                              {formatDistanceToNow(new Date(content.created_at), { addSuffix: true })}
                            </div>
                          </div>
                          
                          <p className="text-sm text-gray-400 line-clamp-2 mb-3">{content.content_text}</p>
                          
                          <div className="flex items-center space-x-3">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-8 px-3 text-xs border-gray-700 bg-black/30 hover:bg-gray-900"
                              onClick={() => {
                                navigator.clipboard.writeText(content.content_text);
                              }}
                            >
                              <Copy className="h-3.5 w-3.5 mr-1.5" />
                              Copy
                            </Button>
                            
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-8 px-3 text-xs border-gray-700 bg-black/30 hover:bg-gray-900"
                              onClick={() => navigate(`/content/${content.id}`)}
                            >
                              <Edit className="h-3.5 w-3.5 mr-1.5" />
                              Edit
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center bg-black">
                  <div className="mb-3 inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#0e131f] border border-[#74d1ea]/20 shadow-[0_0_15px_rgba(116,209,234,0.15)]">
                    <FileText className="h-6 w-6 text-[#74d1ea]" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">No content yet</h3>
                  <p className="text-gray-400 mb-6 max-w-md mx-auto">Start by generating compelling LinkedIn posts or cold emails for your target audience</p>
                  <Button 
                    onClick={() => navigate('/content-generator')}
                    className="bg-[#74d1ea] hover:bg-[#5db8d0] text-black font-medium shadow-[0_0_25px_rgba(116,209,234,0.25)]"
                  >
                    Generate Your First Content
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}