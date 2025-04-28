import React from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Check, X, HelpCircle } from "lucide-react";
import { subscriptionPlans } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function PricingPage() {
  const { user } = useAuth();
  
  // Features for each tier with tooltips
  const features = [
    {
      name: "Personas",
      tooltipText: "Create detailed audience personas to target your content",
      tiers: {
        free: `${subscriptionPlans.free.personas} personas`,
        standard: `${subscriptionPlans.standard.personas} personas`,
        professional: `${subscriptionPlans.professional.personas} personas`,
        premium: `${subscriptionPlans.premium.personas} personas`,
        agency: "Multiple clients with personas",
        enterprise: "Unlimited personas"
      }
    },
    {
      name: "Tone Analysis",
      tooltipText: "Analyze your brand's tone of voice with detailed insights",
      tiers: {
        free: `${subscriptionPlans.free.toneAnalyses} analyses`,
        standard: `${subscriptionPlans.standard.toneAnalyses} analyses`,
        professional: `${subscriptionPlans.professional.toneAnalyses} analyses`,
        premium: `${subscriptionPlans.premium.toneAnalyses} analyses`,
        agency: "Multiple tone profiles",
        enterprise: "Unlimited analyses"
      }
    },
    {
      name: "Content Generation",
      tooltipText: "Generate LinkedIn posts and cold emails tailored to your brand voice",
      tiers: {
        free: `${subscriptionPlans.free.contentGeneration} pieces/month`,
        standard: `${subscriptionPlans.standard.contentGeneration} pieces/month`,
        professional: `${subscriptionPlans.professional.contentGeneration} pieces/month`,
        premium: `${subscriptionPlans.premium.contentGeneration} pieces/month`,
        agency: "Multiple content types",
        enterprise: "Unlimited content generation"
      }
    },
    {
      name: "Content History",
      tooltipText: "Access to previously generated content",
      tiers: {
        free: "7 days",
        standard: "30 days",
        professional: "90 days",
        premium: "1 year",
        agency: "1 year",
        enterprise: "Unlimited"
      }
    },
    {
      name: "Priority Support",
      tooltipText: "Get faster responses from our support team",
      tiers: {
        free: false,
        standard: false,
        professional: true,
        premium: true,
        agency: true,
        enterprise: true
      }
    },
    {
      name: "Team Members",
      tooltipText: "Add team members to your account",
      tiers: {
        free: "1 user",
        standard: "1 user",
        professional: "3 users",
        premium: "10 users",
        agency: "25 users",
        enterprise: "Custom"
      }
    },
    {
      name: "Custom Branding",
      tooltipText: "Add your own branding to generated content",
      tiers: {
        free: false,
        standard: false,
        professional: false,
        premium: true,
        agency: true,
        enterprise: true
      }
    },
    {
      name: "API Access",
      tooltipText: "Integrate Tovably into your own applications",
      tiers: {
        free: false,
        standard: false,
        professional: false,
        premium: true,
        agency: true,
        enterprise: true
      }
    }
  ];

  const getButtonText = (plan: string) => {
    if (user?.subscription_plan === plan) {
      return "Current Plan";
    }
    return "Upgrade";
  };

  const isCurrentPlan = (plan: string) => {
    return user?.subscription_plan === plan;
  };

  return (
    <Layout>
      <div className="py-6 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              <span className="block">Choose the perfect plan</span>
            </h1>
            <p className="mt-4 text-lg text-gray-400 max-w-3xl mx-auto">
              Scale your content creation with our flexible plans. Get started for free and upgrade as your needs grow.
            </p>
          </div>

          <div className="mt-12 space-y-12">
            {/* Main pricing table */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6 overflow-x-auto">
              {/* Free tier */}
              <div className="border border-gray-700/60 rounded-lg p-6 flex flex-col bg-gray-900/30 shadow-[0_0_15px_rgba(116,209,234,0.10)]">
                <h3 className="text-xl font-semibold text-white">{subscriptionPlans.free.name}</h3>
                <p className="mt-2 text-gray-400 text-sm">Get started with basic features</p>
                <p className="mt-8 mb-4">
                  <span className="text-4xl font-bold text-white">{subscriptionPlans.free.displayPrice}</span>
                </p>
                <Button 
                  disabled={isCurrentPlan("free")}
                  className="w-full mt-auto shadow-[0_0_10px_rgba(116,209,234,0.4)] bg-[#74d1ea] hover:bg-[#5db8d0] text-black"
                >
                  {getButtonText("free")}
                </Button>
              </div>

              {/* Standard tier */}
              <div className="border border-[#74d1ea]/30 rounded-lg p-6 flex flex-col bg-[#74d1ea]/10 shadow-[0_0_25px_rgba(116,209,234,0.15)]">
                <div className="bg-[#74d1ea]/20 text-[#74d1ea] text-xs font-semibold px-2 py-1 rounded-full w-fit mb-2">
                  POPULAR
                </div>
                <h3 className="text-xl font-semibold text-white">{subscriptionPlans.standard.name}</h3>
                <p className="mt-2 text-gray-400 text-sm">Best for individual professionals</p>
                <p className="mt-8 mb-4">
                  <span className="text-4xl font-bold text-white">{subscriptionPlans.standard.displayPrice}</span>
                </p>
                <Button 
                  disabled={isCurrentPlan("standard")}
                  className="w-full mt-auto shadow-[0_0_10px_rgba(116,209,234,0.4)] bg-[#74d1ea] hover:bg-[#5db8d0] text-black"
                >
                  {getButtonText("standard")}
                </Button>
              </div>

              {/* Professional tier */}
              <div className="border border-gray-700/60 rounded-lg p-6 flex flex-col bg-gray-900/30 shadow-[0_0_15px_rgba(116,209,234,0.10)]">
                <h3 className="text-xl font-semibold text-white">{subscriptionPlans.professional.name}</h3>
                <p className="mt-2 text-gray-400 text-sm">Great for small teams</p>
                <p className="mt-8 mb-4">
                  <span className="text-4xl font-bold text-white">{subscriptionPlans.professional.displayPrice}</span>
                </p>
                <Button 
                  disabled={isCurrentPlan("professional")}
                  className="w-full mt-auto shadow-[0_0_10px_rgba(116,209,234,0.4)] bg-[#74d1ea] hover:bg-[#5db8d0] text-black"
                >
                  {getButtonText("professional")}
                </Button>
              </div>

              {/* Premium tier */}
              <div className="border border-gray-700/60 rounded-lg p-6 flex flex-col bg-gray-900/30 shadow-[0_0_15px_rgba(116,209,234,0.10)]">
                <h3 className="text-xl font-semibold text-white">{subscriptionPlans.premium.name}</h3>
                <p className="mt-2 text-gray-400 text-sm">For growing businesses</p>
                <p className="mt-8 mb-4">
                  <span className="text-4xl font-bold text-white">{subscriptionPlans.premium.displayPrice}</span>
                </p>
                <Button 
                  disabled={isCurrentPlan("premium")}
                  className="w-full mt-auto shadow-[0_0_10px_rgba(116,209,234,0.4)] bg-[#74d1ea] hover:bg-[#5db8d0] text-black"
                >
                  {getButtonText("premium")}
                </Button>
              </div>

              {/* Agency tier */}
              <div className="border border-gray-700/60 rounded-lg p-6 flex flex-col bg-gray-900/30 shadow-[0_0_15px_rgba(116,209,234,0.10)]">
                <h3 className="text-xl font-semibold text-white">Agency</h3>
                <p className="mt-2 text-gray-400 text-sm">Manage multiple clients</p>
                <p className="mt-8 mb-4">
                  <span className="text-4xl font-bold text-white">Coming soon</span>
                </p>
                <Button disabled className="w-full mt-auto shadow-[0_0_10px_rgba(116,209,234,0.4)] bg-[#74d1ea]/50 text-black/60">
                  Join Waitlist
                </Button>
              </div>

              {/* Enterprise tier */}
              <div className="border border-gray-700/60 rounded-lg p-6 flex flex-col bg-gray-900/30 shadow-[0_0_15px_rgba(116,209,234,0.10)]">
                <h3 className="text-xl font-semibold text-white">Enterprise</h3>
                <p className="mt-2 text-gray-400 text-sm">Custom solutions for large teams</p>
                <p className="mt-8 mb-4">
                  <span className="text-4xl font-bold text-white">Custom</span>
                </p>
                <Button className="w-full mt-auto shadow-[0_0_10px_rgba(116,209,234,0.4)] bg-[#74d1ea] hover:bg-[#5db8d0] text-black">
                  Contact Sales
                </Button>
              </div>
            </div>

            {/* Feature comparison table */}
            <div className="mt-16 border border-gray-700/60 rounded-lg overflow-hidden shadow-[0_0_25px_rgba(116,209,234,0.15)]">
              <table className="w-full divide-y divide-gray-700/60 overflow-x-auto">
                <thead className="bg-gray-900/50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-6 pr-3 text-left text-sm font-semibold text-white sm:pl-6">
                      Features
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">
                      Free
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">
                      Standard
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">
                      Professional
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">
                      Premium
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">
                      Agency
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">
                      Enterprise
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700/50 bg-black/50">
                  {features.map((feature, featureIdx) => (
                    <tr key={feature.name}>
                      <td className="whitespace-nowrap py-4 pl-6 pr-3 text-sm">
                        <div className="flex items-center">
                          <span className="font-medium text-white">{feature.name}</span>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <HelpCircle className="h-4 w-4 ml-1 text-gray-500" />
                              </TooltipTrigger>
                              <TooltipContent className="bg-gray-800 text-white border-gray-700">
                                <p>{feature.tooltipText}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </td>
                      {['free', 'standard', 'professional', 'premium', 'agency', 'enterprise'].map((tier) => (
                        <td key={tier} className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">
                          {typeof feature.tiers[tier] === 'boolean' ? (
                            feature.tiers[tier] ? (
                              <Check className="h-5 w-5 text-[#74d1ea]" />
                            ) : (
                              <X className="h-5 w-5 text-gray-500" />
                            )
                          ) : (
                            feature.tiers[tier]
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-16 border border-gray-700/60 rounded-lg p-8 shadow-[0_0_25px_rgba(116,209,234,0.15)]">
            <h2 className="text-2xl font-semibold text-white mb-6">Frequently asked questions</h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div>
                <h3 className="text-lg font-medium text-white">How do I upgrade my plan?</h3>
                <p className="mt-2 text-gray-400">
                  You can upgrade your plan at any time from your account settings. The changes will take effect immediately.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-white">Can I downgrade my plan?</h3>
                <p className="mt-2 text-gray-400">
                  Yes, you can downgrade your plan at any time. Changes will take effect at the end of your current billing cycle.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-white">Do you offer refunds?</h3>
                <p className="mt-2 text-gray-400">
                  We offer a 14-day money-back guarantee for all paid plans. Contact our support team for assistance.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-white">What happens if I go over my limits?</h3>
                <p className="mt-2 text-gray-400">
                  You'll be notified when you're approaching your limits. Once reached, you'll need to upgrade to continue using those features.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-16 border border-gray-700/60 rounded-lg text-center py-10 px-6 shadow-[0_0_30px_rgba(116,209,234,0.20)]">
            <h2 className="text-3xl font-semibold text-white">
              Ready to transform your content?
            </h2>
            <p className="mt-4 text-xl text-gray-400 max-w-3xl mx-auto">
              Join thousands of professionals who trust Tovably for their content needs
            </p>
            <div className="mt-8">
              <Button
                className="px-8 py-3 bg-[#74d1ea] hover:bg-[#5db8d0] text-black shadow-[0_0_10px_rgba(116,209,234,0.4)]"
              >
                Get started today
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}