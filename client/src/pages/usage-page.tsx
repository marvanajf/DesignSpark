import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { subscriptionPlans } from "@shared/schema";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Lock } from "lucide-react";
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
      <Layout>
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
    <Layout>
      <div className="container py-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Usage Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Monitor your current subscription usage and limits
            </p>
          </div>
          
          {userPlan !== "premium" && (
            <Button 
              onClick={handleUpgrade}
              className="mt-4 md:mt-0"
              style={{ backgroundColor: "#74d1ea", color: "black" }}
            >
              Upgrade Plan
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 gap-6">
          {/* Subscription Info */}
          <Card className="bg-[#0e1015] border-0">
            <CardHeader className="border-b border-[#1a1e29] pb-4">
              <CardTitle className="flex items-center">
                <div className="flex-1 flex flex-col md:flex-row md:items-center md:justify-between">
                  <span className="text-xl">
                    Current Subscription: <span className="text-[#74d1ea] font-semibold">{plan.name}</span>
                  </span>
                  <span className="text-lg font-medium mt-2 md:mt-0">
                    {plan.price > 0 ? plan.displayPrice : "Free"} {plan.price > 0 ? "/ month" : ""}
                  </span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
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
            </CardContent>
          </Card>

          {/* Features table */}
          <Card className="bg-[#0e1015] border-0 mt-6">
            <CardHeader className="border-b border-[#1a1e29] pb-4">
              <CardTitle>Plan Features</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#1a1e29]">
                      <th className="text-left py-3 px-4 font-medium text-lg">Feature</th>
                      <th className="text-left py-3 px-4 font-medium text-lg">Limit</th>
                      <th className="text-left py-3 px-4 font-medium text-lg">Status</th>
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
                      status={plan.price > 0 ? "Available" : "Upgrade Required"} 
                    />
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
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
    <Card className="bg-[#181c25] border-0">
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-xl font-semibold">{title}</h3>
          <Button variant="link" asChild className="text-[#74d1ea] p-0">
            <Link href={linkTo}>
              Go to {title.toLowerCase()}
            </Link>
          </Button>
        </div>
        
        <div className="flex justify-between items-center text-sm text-muted-foreground mb-2">
          <span>Used: {current}</span>
          <span>Limit: {limit}</span>
        </div>
        
        <Progress
          value={percentage}
          className="h-2 bg-[#232832]"
          indicatorClassName={percentage >= 90 ? "bg-red-500" : percentage >= 70 ? "bg-yellow-500" : "bg-[#74d1ea]"}
        />
        
        <div className="mt-4 text-sm">
          {current >= limit ? (
            <div className="flex items-center text-red-400">
              <Lock className="h-4 w-4 mr-1" />
              <span>At Limit! Consider upgrading.</span>
            </div>
          ) : percentage >= 90 ? (
            <div className="flex items-center text-red-400">
              <Lock className="h-4 w-4 mr-1" />
              <span>Almost at limit! Consider upgrading.</span>
            </div>
          ) : percentage >= 70 ? (
            <div className="flex items-center text-yellow-400">
              <span>Usage high, plan accordingly.</span>
            </div>
          ) : (
            <div className="flex items-center text-green-400">
              <span>Good usage level.</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function FeatureRow({ feature, limit, status }: { feature: string, limit: number | string, status: string }) {
  const statusColor = status === "Available" ? "text-green-400" : 
                     status === "Limit Reached" ? "text-red-400" : 
                     "text-yellow-400";
  
  return (
    <tr className="border-b border-[#1a1e29]">
      <td className="py-4 px-4">{feature}</td>
      <td className="py-4 px-4">{limit}</td>
      <td className={`py-4 px-4 ${statusColor}`}>{status}</td>
    </tr>
  );
}