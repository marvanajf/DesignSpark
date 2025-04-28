import { Check, HelpCircle } from "lucide-react";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import Layout from "@/components/Layout";
import { subscriptionPlans } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

export default function PricingPage() {
  const [billingInterval, setBillingInterval] = useState<"monthly" | "yearly">("monthly");
  const { toast } = useToast();
  const { user } = useAuth();
  
  // 20% discount for yearly
  const yearlyDiscount = 0.8;
  
  // These would be realistic usage amounts for each subscription tier
  const featuresByPlan = {
    // Display prices
    free: "Free",
    standard: billingInterval === "monthly" ? "£9.99/mo" : `£${Math.round(9.99 * 12 * yearlyDiscount)}/yr`,
    professional: billingInterval === "monthly" ? "£24.99/mo" : `£${Math.round(24.99 * 12 * yearlyDiscount)}/yr`,
    premium: billingInterval === "monthly" ? "£39.99/mo" : `£${Math.round(39.99 * 12 * yearlyDiscount)}/yr`,
    agency: "Coming Soon",
    enterprise: "Contact us"
  };
  
  // Feature availability by plan
  const featureAvailability = {
    free: {
      advancedAnalytics: false,
      teamAccess: false,
      apiAccess: false,
      customBranding: false,
      prioritySupport: false,
      bulkGeneration: false
    },
    standard: {
      advancedAnalytics: false,
      teamAccess: false,
      apiAccess: false,
      customBranding: false,
      prioritySupport: false,
      bulkGeneration: false
    },
    professional: {
      advancedAnalytics: true,
      teamAccess: true,
      apiAccess: false,
      customBranding: false,
      prioritySupport: true,
      bulkGeneration: true
    },
    premium: {
      advancedAnalytics: true,
      teamAccess: true,
      apiAccess: true,
      customBranding: true,
      prioritySupport: true,
      bulkGeneration: true
    },
    agency: {
      advancedAnalytics: true,
      teamAccess: true,
      apiAccess: true,
      customBranding: true,
      prioritySupport: true,
      bulkGeneration: true
    },
    enterprise: {
      advancedAnalytics: true,
      teamAccess: true,
      apiAccess: true,
      customBranding: true,
      prioritySupport: true,
      bulkGeneration: true
    }
  };
  
  const handleUpgrade = (plan: string) => {
    toast({
      title: "Upgrade Initiated",
      description: `We'll redirect you to complete your upgrade to the ${plan} plan shortly.`,
    });
    
    // In a real implementation, this would redirect to a payment page
  };
  
  return (
    <Layout>
      <div className="mt-12 px-4 md:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white">Simple, Transparent Pricing</h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Choose the plan that works best for you. All plans include core features like tone analysis, audience personas, and content generation.
          </p>
          
          <div className="mt-6">
            <Tabs defaultValue="monthly" className="inline-flex mx-auto bg-black border border-gray-700/60 rounded-md p-1">
              <TabsList className="bg-black">
                <TabsTrigger 
                  value="monthly" 
                  className="text-sm data-[state=active]:bg-gray-800 data-[state=active]:text-white"
                  onClick={() => setBillingInterval("monthly")}
                >
                  Monthly
                </TabsTrigger>
                <TabsTrigger 
                  value="yearly" 
                  className="text-sm data-[state=active]:bg-gray-800 data-[state=active]:text-white"
                  onClick={() => setBillingInterval("yearly")}
                >
                  Yearly <span className="ml-1 px-1.5 py-0.5 text-xs bg-[#74d1ea]/20 text-[#74d1ea] rounded-sm">Save 20%</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {/* Free Plan */}
          <Card className="bg-black border border-gray-700/60 hover:border-[#74d1ea]/40 hover:shadow-[0_0_15px_rgba(116,209,234,0.15)] transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-xl text-white">{subscriptionPlans.free.name}</CardTitle>
              <div className="mt-1">
                <span className="text-2xl font-bold text-white">{featuresByPlan["free"]}</span>
              </div>
              <CardDescription className="text-gray-400">For individuals just getting started</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-300 mb-2">Includes:</p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <Check className="h-4 w-4 text-[#74d1ea] mr-2 mt-0.5 flex-shrink-0" />
                    <span><span className="font-medium">{subscriptionPlans.free.personas}</span> audience personas</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-4 w-4 text-[#74d1ea] mr-2 mt-0.5 flex-shrink-0" />
                    <span><span className="font-medium">{subscriptionPlans.free.toneAnalyses}</span> tone analyses per month</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-4 w-4 text-[#74d1ea] mr-2 mt-0.5 flex-shrink-0" />
                    <span><span className="font-medium">{subscriptionPlans.free.contentGeneration}</span> content generations per month</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-4 w-4 text-[#74d1ea] mr-2 mt-0.5 flex-shrink-0" />
                    <span>Basic email support</span>
                  </li>
                </ul>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-[#74d1ea]/10 hover:bg-[#74d1ea]/20 text-[#74d1ea] border border-[#74d1ea]/30"
                disabled={user?.subscription_plan === "free"}
              >
                {user?.subscription_plan === "free" ? "Current Plan" : "Get Started"}
              </Button>
            </CardFooter>
          </Card>
          
          {/* Standard Plan */}
          <Card className="bg-black border border-gray-700/60 hover:border-[#74d1ea]/40 hover:shadow-[0_0_15px_rgba(116,209,234,0.15)] transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-xl text-white">{subscriptionPlans.standard.name}</CardTitle>
              <div className="mt-1">
                <span className="text-2xl font-bold text-white">{featuresByPlan["standard"]}</span>
                {billingInterval === "yearly" && (
                  <span className="ml-2 text-sm text-gray-400 line-through">£119.88/yr</span>
                )}
              </div>
              <CardDescription className="text-gray-400">For individuals and small projects</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-300 mb-2">Everything in Free, plus:</p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <Check className="h-4 w-4 text-[#74d1ea] mr-2 mt-0.5 flex-shrink-0" />
                    <span><span className="font-medium">{subscriptionPlans.standard.personas}</span> audience personas</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-4 w-4 text-[#74d1ea] mr-2 mt-0.5 flex-shrink-0" />
                    <span><span className="font-medium">{subscriptionPlans.standard.toneAnalyses}</span> tone analyses per month</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-4 w-4 text-[#74d1ea] mr-2 mt-0.5 flex-shrink-0" />
                    <span><span className="font-medium">{subscriptionPlans.standard.contentGeneration}</span> content generations per month</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-4 w-4 text-[#74d1ea] mr-2 mt-0.5 flex-shrink-0" />
                    <span>Email support</span>
                  </li>
                </ul>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-[#74d1ea]/10 hover:bg-[#74d1ea]/20 text-[#74d1ea] border border-[#74d1ea]/30"
                onClick={() => handleUpgrade("Standard")}
                disabled={user?.subscription_plan === "standard"}
              >
                {user?.subscription_plan === "standard" ? "Current Plan" : "Choose Plan"}
              </Button>
            </CardFooter>
          </Card>
          
          {/* Professional Plan */}
          <Card className="bg-black border border-[#74d1ea]/30 shadow-[0_0_20px_rgba(116,209,234,0.2)] hover:shadow-[0_0_25px_rgba(116,209,234,0.3)] transition-all duration-300">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl text-white">{subscriptionPlans.professional.name}</CardTitle>
                <span className="px-2 py-1 rounded-full bg-[#74d1ea]/10 text-[#74d1ea] text-xs font-medium">Popular</span>
              </div>
              <div className="mt-1">
                <span className="text-2xl font-bold text-white">{featuresByPlan["professional"]}</span>
                {billingInterval === "yearly" && (
                  <span className="ml-2 text-sm text-gray-400 line-through">£299.88/yr</span>
                )}
              </div>
              <CardDescription className="text-gray-400">For professionals and growing businesses</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-300 mb-2">Everything in Standard, plus:</p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <Check className="h-4 w-4 text-[#74d1ea] mr-2 mt-0.5 flex-shrink-0" />
                    <span><span className="font-medium">{subscriptionPlans.professional.personas}</span> audience personas</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-4 w-4 text-[#74d1ea] mr-2 mt-0.5 flex-shrink-0" />
                    <span><span className="font-medium">{subscriptionPlans.professional.toneAnalyses}</span> tone analyses per month</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-4 w-4 text-[#74d1ea] mr-2 mt-0.5 flex-shrink-0" />
                    <span><span className="font-medium">{subscriptionPlans.professional.contentGeneration}</span> content generations per month</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-4 w-4 text-[#74d1ea] mr-2 mt-0.5 flex-shrink-0" />
                    <span>Priority email support</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-4 w-4 text-[#74d1ea] mr-2 mt-0.5 flex-shrink-0" />
                    <span>Advanced analytics</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-4 w-4 text-[#74d1ea] mr-2 mt-0.5 flex-shrink-0" />
                    <span>Team access (up to 3 users)</span>
                  </li>
                </ul>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-[#74d1ea] hover:bg-[#5db8d0] text-black shadow-[0_0_10px_rgba(116,209,234,0.4)]"
                onClick={() => handleUpgrade("Professional")}
                disabled={user?.subscription_plan === "professional"}
              >
                {user?.subscription_plan === "professional" ? "Current Plan" : "Choose Plan"}
              </Button>
            </CardFooter>
          </Card>
          
          {/* Premium Plan */}
          <Card className="bg-black border border-gray-700/60 hover:border-[#74d1ea]/40 hover:shadow-[0_0_15px_rgba(116,209,234,0.15)] transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-xl text-white">{subscriptionPlans.premium.name}</CardTitle>
              <div className="mt-1">
                <span className="text-2xl font-bold text-white">{featuresByPlan["premium"]}</span>
                {billingInterval === "yearly" && (
                  <span className="ml-2 text-sm text-gray-400 line-through">£479.88/yr</span>
                )}
              </div>
              <CardDescription className="text-gray-400">For power users and larger teams</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-300 mb-2">Everything in Professional, plus:</p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <Check className="h-4 w-4 text-[#74d1ea] mr-2 mt-0.5 flex-shrink-0" />
                    <span><span className="font-medium">{subscriptionPlans.premium.personas}</span> audience personas</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-4 w-4 text-[#74d1ea] mr-2 mt-0.5 flex-shrink-0" />
                    <span><span className="font-medium">{subscriptionPlans.premium.toneAnalyses}</span> tone analyses per month</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-4 w-4 text-[#74d1ea] mr-2 mt-0.5 flex-shrink-0" />
                    <span><span className="font-medium">{subscriptionPlans.premium.contentGeneration}</span> content generations per month</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-4 w-4 text-[#74d1ea] mr-2 mt-0.5 flex-shrink-0" />
                    <span>Dedicated support</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-4 w-4 text-[#74d1ea] mr-2 mt-0.5 flex-shrink-0" />
                    <span>Team access (up to 10 users)</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-4 w-4 text-[#74d1ea] mr-2 mt-0.5 flex-shrink-0" />
                    <span>API access</span>
                  </li>
                </ul>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-[#74d1ea]/10 hover:bg-[#74d1ea]/20 text-[#74d1ea] border border-[#74d1ea]/30"
                onClick={() => handleUpgrade("Premium")}
                disabled={user?.subscription_plan === "premium"}
              >
                {user?.subscription_plan === "premium" ? "Current Plan" : "Choose Plan"}
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="max-w-3xl mx-auto mb-20">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2 text-white">Compare All Features</h2>
            <p className="text-gray-400">See exactly what's included in each plan</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-700/60">
                  <th className="py-4 px-6 font-medium text-white">Features</th>
                  <th className="py-4 px-6 font-medium text-white text-center">Free</th>
                  <th className="py-4 px-6 font-medium text-white text-center">Standard</th>
                  <th className="py-4 px-6 font-medium text-white text-center">Professional</th>
                  <th className="py-4 px-6 font-medium text-white text-center">Premium</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/60">
                <tr>
                  <td className="py-4 px-6 text-gray-300">Audience Personas</td>
                  <td className="py-4 px-6 text-center">{subscriptionPlans.free.personas}</td>
                  <td className="py-4 px-6 text-center">{subscriptionPlans.standard.personas}</td>
                  <td className="py-4 px-6 text-center">{subscriptionPlans.professional.personas}</td>
                  <td className="py-4 px-6 text-center">{subscriptionPlans.premium.personas}</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 text-gray-300">Tone Analyses</td>
                  <td className="py-4 px-6 text-center">{subscriptionPlans.free.toneAnalyses}/mo</td>
                  <td className="py-4 px-6 text-center">{subscriptionPlans.standard.toneAnalyses}/mo</td>
                  <td className="py-4 px-6 text-center">{subscriptionPlans.professional.toneAnalyses}/mo</td>
                  <td className="py-4 px-6 text-center">{subscriptionPlans.premium.toneAnalyses}/mo</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 text-gray-300">Content Generations</td>
                  <td className="py-4 px-6 text-center">{subscriptionPlans.free.contentGeneration}/mo</td>
                  <td className="py-4 px-6 text-center">{subscriptionPlans.standard.contentGeneration}/mo</td>
                  <td className="py-4 px-6 text-center">{subscriptionPlans.professional.contentGeneration}/mo</td>
                  <td className="py-4 px-6 text-center">{subscriptionPlans.premium.contentGeneration}/mo</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 text-gray-300 flex items-center">
                    Advanced Analytics
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="h-4 w-4 text-gray-500 ml-2" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="w-[200px] text-xs">Detailed insights about your audience and content performance with exportable reports.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </td>
                  <td className="py-4 px-6 text-center">
                    {featureAvailability.free.advancedAnalytics ? (
                      <Check className="h-5 w-5 text-[#74d1ea] mx-auto" />
                    ) : (
                      <span className="text-gray-500">—</span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-center">
                    {featureAvailability.standard.advancedAnalytics ? (
                      <Check className="h-5 w-5 text-[#74d1ea] mx-auto" />
                    ) : (
                      <span className="text-gray-500">—</span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-center">
                    {featureAvailability.professional.advancedAnalytics ? (
                      <Check className="h-5 w-5 text-[#74d1ea] mx-auto" />
                    ) : (
                      <span className="text-gray-500">—</span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-center">
                    {featureAvailability.premium.advancedAnalytics ? (
                      <Check className="h-5 w-5 text-[#74d1ea] mx-auto" />
                    ) : (
                      <span className="text-gray-500">—</span>
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 text-gray-300">Team Access</td>
                  <td className="py-4 px-6 text-center">
                    {featureAvailability.free.teamAccess ? (
                      <Check className="h-5 w-5 text-[#74d1ea] mx-auto" />
                    ) : (
                      <span className="text-gray-500">—</span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-center">
                    {featureAvailability.standard.teamAccess ? (
                      <Check className="h-5 w-5 text-[#74d1ea] mx-auto" />
                    ) : (
                      <span className="text-gray-500">—</span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-center">Up to 3 users</td>
                  <td className="py-4 px-6 text-center">Up to 10 users</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 text-gray-300">API Access</td>
                  <td className="py-4 px-6 text-center">
                    {featureAvailability.free.apiAccess ? (
                      <Check className="h-5 w-5 text-[#74d1ea] mx-auto" />
                    ) : (
                      <span className="text-gray-500">—</span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-center">
                    {featureAvailability.standard.apiAccess ? (
                      <Check className="h-5 w-5 text-[#74d1ea] mx-auto" />
                    ) : (
                      <span className="text-gray-500">—</span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-center">
                    {featureAvailability.professional.apiAccess ? (
                      <Check className="h-5 w-5 text-[#74d1ea] mx-auto" />
                    ) : (
                      <span className="text-gray-500">—</span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-center">
                    {featureAvailability.premium.apiAccess ? (
                      <Check className="h-5 w-5 text-[#74d1ea] mx-auto" />
                    ) : (
                      <span className="text-gray-500">—</span>
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 text-gray-300">Priority Support</td>
                  <td className="py-4 px-6 text-center">
                    {featureAvailability.free.prioritySupport ? (
                      <Check className="h-5 w-5 text-[#74d1ea] mx-auto" />
                    ) : (
                      <span className="text-gray-500">—</span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-center">
                    {featureAvailability.standard.prioritySupport ? (
                      <Check className="h-5 w-5 text-[#74d1ea] mx-auto" />
                    ) : (
                      <span className="text-gray-500">—</span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-center">
                    {featureAvailability.professional.prioritySupport ? (
                      <Check className="h-5 w-5 text-[#74d1ea] mx-auto" />
                    ) : (
                      <span className="text-gray-500">—</span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-center">Dedicated</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-[#121212] via-black to-[#121212] border border-gray-700/60 rounded-lg p-8 mb-16">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h2 className="text-2xl font-bold text-white">Need a custom plan for your enterprise?</h2>
              <p className="text-gray-400 mt-2">Contact us to discuss a tailored solution for your organization's needs.</p>
            </div>
            <Button 
              className="bg-[#74d1ea] hover:bg-[#5db8d0] text-black shadow-[0_0_10px_rgba(116,209,234,0.4)]"
              onClick={() => {
                toast({
                  title: "Enterprise Inquiry",
                  description: "We'll be in touch shortly to discuss your enterprise needs."
                });
              }}
            >
              Contact Sales
            </Button>
          </div>
        </div>
        
        <div className="max-w-3xl mx-auto mb-20">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold mb-2 text-white">Frequently Asked Questions</h2>
            <p className="text-gray-400">Have questions? We've got answers.</p>
          </div>
          
          <div className="space-y-6">
            <div className="border-b border-gray-700/60 pb-6">
              <h3 className="text-lg font-medium text-white mb-2">Can I change my plan later?</h3>
              <p className="text-gray-400">Yes, you can upgrade or downgrade your plan at any time. Changes to your subscription will take effect on your next billing cycle.</p>
            </div>
            <div className="border-b border-gray-700/60 pb-6">
              <h3 className="text-lg font-medium text-white mb-2">How do the monthly limits work?</h3>
              <p className="text-gray-400">Your plan includes a set number of tone analyses, content generations, and audience personas per month. These limits reset on your billing date. Unused quota does not roll over to the next month.</p>
            </div>
            <div className="border-b border-gray-700/60 pb-6">
              <h3 className="text-lg font-medium text-white mb-2">Is there a refund policy?</h3>
              <p className="text-gray-400">We offer a 14-day money-back guarantee for all paid plans. If you're not satisfied with our service, contact us within 14 days of your purchase for a full refund.</p>
            </div>
            <div className="border-b border-gray-700/60 pb-6">
              <h3 className="text-lg font-medium text-white mb-2">Do you offer custom enterprise solutions?</h3>
              <p className="text-gray-400">Absolutely! Our enterprise solutions include custom features, dedicated support, and flexible billing options. Contact our sales team to discuss your specific requirements.</p>
            </div>
            <div className="pb-6">
              <h3 className="text-lg font-medium text-white mb-2">How secure is my data?</h3>
              <p className="text-gray-400">Security is our top priority. We use industry-standard encryption to protect your data and never share your information with third parties without your consent. For more information, please see our Privacy Policy.</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}