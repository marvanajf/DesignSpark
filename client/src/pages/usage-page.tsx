import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { subscriptionPlans } from "@shared/schema";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Lock, BarChart3 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { usePricingModal } from "@/hooks/use-pricing-modal";
import { Link } from "wouter";

export default function UsagePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { openPricingModal } = usePricingModal();

  // Refresh user data to get current usage
  const { data: userData, isLoading } = useQuery({
    queryKey: ["/api/user"],
    staleTime: 60 * 1000, // 1 minute
  });

  if (isLoading || !userData) {
    return (
      <Layout showSidebar={true}>
        <div className="flex justify-center items-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-[#74d1ea]" />
        </div>
      </Layout>
    );
  }

  const userPlan = userData.subscription_plan as keyof typeof subscriptionPlans;
  const plan = subscriptionPlans[userPlan];

  // Calculate usage percentages
  const personaUsagePercent = Math.min(100, Math.round((userData.personas_used / plan.personas) * 100));
  const toneAnalysisUsagePercent = Math.min(100, Math.round((userData.tone_analyses_used / plan.toneAnalyses) * 100));
  const contentUsagePercent = Math.min(100, Math.round((userData.content_generated / plan.contentGeneration) * 100));
  const campaignUsagePercent = Math.min(100, Math.round((userData.campaigns_used / plan.campaigns) * 100));

  const handleUpgrade = () => {
    openPricingModal("personas");
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
                  <span>Usage Dashboard</span>
                </div>
                <h1 className="text-2xl font-semibold text-white mt-1">Usage Dashboard</h1>
              </div>
              
              {userPlan !== "premium" && (
                <Button 
                  onClick={handleUpgrade}
                  style={{ backgroundColor: "#74d1ea", color: "black" }}
                >
                  Upgrade Plan
                </Button>
              )}
            </div>
          </div>
          
          {/* Usage Banner - styled like saved content page */}
          <div className="mb-8 bg-[#0a0c10] border border-gray-800/60 rounded-xl p-8 relative overflow-hidden shadow-[0_0_25px_rgba(116,209,234,0.05)]">
            <div className="absolute inset-0 bg-gradient-to-t from-[#0e1b33]/60 via-transparent to-transparent pointer-events-none"></div>
            
            <div className="relative z-10 flex items-start">
              <div className="mr-6 bg-[#0e131f] border border-[#74d1ea]/20 rounded-lg p-3 shadow-[0_0_15px_rgba(116,209,234,0.15)]">
                <BarChart3 className="h-6 w-6 text-[#74d1ea]" />
              </div>
              
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-white mb-3">
                  Current Subscription: <span className="text-[#74d1ea]">{plan.name}</span> - {plan.price > 0 ? plan.displayPrice : "Free"} {plan.price > 0 ? "/ month" : ""}
                </h2>
                <p className="text-gray-300 mb-6 max-w-3xl">
                  Monitor your current subscription usage and limits. Track your AI resources and upgrade your plan
                  when you need additional capacity for your professional communication needs.
                </p>
                
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="text-[#74d1ea] mr-3">✓</div>
                    <span className="text-gray-300">Track usage across AI personas, tone analyses, and content generations</span>
                  </div>
                  <div className="flex items-center">
                    <div className="text-[#74d1ea] mr-3">✓</div>
                    <span className="text-gray-300">Visualize remaining capacity with intuitive progress indicators</span>
                  </div>
                  <div className="flex items-center">
                    <div className="text-[#74d1ea] mr-3">✓</div>
                    <span className="text-gray-300">Upgrade at any time to increase your available resources</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Usage Cards */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Resource Usage</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <UsageCard 
                title="AI Personas" 
                current={userData.personas_used}
                limit={plan.personas}
                percentage={personaUsagePercent}
                linkTo="/personas"
              />
              
              <UsageCard 
                title="Tone Analyses" 
                current={userData.tone_analyses_used}
                limit={plan.toneAnalyses}
                percentage={toneAnalysisUsagePercent}
                linkTo="/tone-analyzer"
              />
              
              <UsageCard 
                title="Content Generations" 
                current={userData.content_generated}
                limit={plan.contentGeneration}
                percentage={contentUsagePercent}
                linkTo="/content-generator"
              />
              
              <UsageCard 
                title="Campaigns" 
                current={userData.campaigns_used}
                limit={plan.campaigns}
                percentage={campaignUsagePercent}
                linkTo="/saved-content"
              />
            </div>
          </div>

          {/* Features table */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-white mb-4">Plan Features</h2>
            <div className="bg-[#0a0c10] border border-gray-800/60 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800/60">
                      <th className="text-left py-4 px-6 font-medium text-white">Feature</th>
                      <th className="text-left py-4 px-6 font-medium text-white">Limit</th>
                      <th className="text-left py-4 px-6 font-medium text-white">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <FeatureRow 
                      feature="AI Personas" 
                      limit={plan.personas} 
                      status={userData.personas_used < plan.personas ? "Available" : "Limit Reached"} 
                    />
                    <FeatureRow 
                      feature="Tone Analyses" 
                      limit={plan.toneAnalyses} 
                      status={userData.tone_analyses_used < plan.toneAnalyses ? "Available" : "Limit Reached"} 
                    />
                    <FeatureRow 
                      feature="Content Generations" 
                      limit={plan.contentGeneration} 
                      status={userData.content_generated < plan.contentGeneration ? "Available" : "Limit Reached"} 
                    />
                    <FeatureRow 
                      feature="Campaigns" 
                      limit={plan.campaigns} 
                      status={userData.campaigns_used < plan.campaigns ? "Available" : "Limit Reached"} 
                    />
                    <FeatureRow 
                      feature="Support" 
                      limit="Unlimited" 
                      status="Available" 
                    />
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

function UsageCard({ 
  title, 
  current, 
  limit, 
  percentage,
  linkTo
}: { 
  title: string; 
  current: number; 
  limit: number; 
  percentage: number;
  linkTo: string;
}) {
  return (
    <div className="bg-[#0a0c10] border border-gray-800/60 rounded-xl overflow-hidden shadow-[0_0_15px_rgba(0,0,0,0.2)]">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-white">{title}</h3>
          <Button variant="link" asChild className="text-[#74d1ea] p-0 hover:text-[#74d1ea]/80">
            <Link href={linkTo}>
              GO TO {title.toUpperCase()}
            </Link>
          </Button>
        </div>
        
        <div className="flex justify-between items-center text-sm text-gray-400 mb-3">
          <span>Used: {current}</span>
          <span>Limit: {limit}</span>
        </div>
        
        <div className="h-2 bg-gray-800/60 rounded-full overflow-hidden mb-4">
          <div 
            className="h-full rounded-full bg-[#74d1ea]"
            style={{ width: `${percentage}%` }}
          />
        </div>
        
        <div className="text-sm">
          {current >= limit ? (
            <div className="flex items-center text-white">
              <Lock className="h-4 w-4 mr-1 text-red-400" />
              <span>At Limit! Consider upgrading.</span>
            </div>
          ) : percentage >= 90 ? (
            <div className="flex items-center text-white">
              <Lock className="h-4 w-4 mr-1 text-red-400" />
              <span>Almost at limit! Consider upgrading.</span>
            </div>
          ) : percentage >= 70 ? (
            <div className="flex items-center text-white">
              <span>Usage high, plan accordingly.</span>
            </div>
          ) : (
            <div className="flex items-center text-white">
              <span>Good usage level.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FeatureRow({ feature, limit, status }: { feature: string, limit: number | string, status: string }) {
  const statusColor = status === "Available" ? "text-green-400" : 
                     status === "Limit Reached" ? "text-red-400" : 
                     "text-yellow-400";
  
  return (
    <tr className="border-b border-gray-800/60 hover:bg-[#111318]">
      <td className="py-4 px-6 text-gray-300">{feature}</td>
      <td className="py-4 px-6 text-gray-300">{limit}</td>
      <td className={`py-4 px-6 ${statusColor}`}>{status}</td>
    </tr>
  );
}