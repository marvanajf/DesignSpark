import React, { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Sparkles, Loader2, Calendar, FileText, Lightbulb, Target, Clock, Users, Copy, Check, ChevronRight, Clipboard, ArrowRight, X, PlusCircle, Save, PlayCircle, BarChart3, SlidersHorizontal, MessageSquare, Settings } from "lucide-react";
import { useLocation } from "wouter";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiRequest } from "@/lib/queryClient";

// A sample persona type for demonstration purposes
type Persona = {
  id: number;
  name: string;
  role: string;
  pains: string[];
  goals: string[];
  daysInUse: number;
  icon?: React.ReactNode;
};

// Sample campaign content type
type CampaignContent = {
  id: number;
  type: 'email' | 'social' | 'blog' | 'ad';
  title: string;
  content: string;
  persona: string;
  deliveryDate?: string;
  channel?: string;
  icon?: React.ReactNode;
};

// Sample campaign type
type Campaign = {
  id: number;
  name: string;
  objective: string;
  targetAudience: string[];
  channels: string[];
  timeline: {
    start: string;
    end: string;
  };
  contents: CampaignContent[];
  toneProfile: {
    professional: number;
    conversational: number;
    persuasive: number;
    educational: number;
    enthusiastic: number;
  };
};

export default function ProspectingFactoryPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("input");
  const [campaignPrompt, setCampaignPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedUseCase, setSelectedUseCase] = useState<string>("");
  const [generationProgress, setGenerationProgress] = useState(0);
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [selectedPersonas, setSelectedPersonas] = useState<number[]>([]);
  const [personaBalance, setPersonaBalance] = useState<"equal" | "weighted">("equal");
  const [campaignStartDate, setCampaignStartDate] = useState<string>(formatDateForInput(new Date()));
  const [campaignEndDate, setCampaignEndDate] = useState<string>(formatDateForInput(twoMonthsLater));
  const [contentCount, setContentCount] = useState<{ email: number, social: number, blog: number }>(
    { email: 2, social: 3, blog: 1 }
  );
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  // Sample persona data
  const personas: Persona[] = [
    {
      id: 1, 
      name: "IT Decision Maker", 
      role: "CIO/CTO", 
      pains: ["Security concerns", "Budget constraints", "Legacy system integration"],
      goals: ["Operational efficiency", "Cost reduction", "Digital transformation"],
      daysInUse: 120,
      icon: <Settings className="h-5 w-5" />
    },
    {
      id: 2, 
      name: "Small Business Owner", 
      role: "CEO/Founder", 
      pains: ["Limited IT resources", "Productivity challenges", "Growth bottlenecks"],
      goals: ["Business scalability", "Employee enablement", "Competitive advantage"],
      daysInUse: 45,
      icon: <Users className="h-5 w-5" />
    },
    {
      id: 3, 
      name: "Operations Manager", 
      role: "Manager", 
      pains: ["Team collaboration issues", "Process inefficiencies", "Remote work challenges"],
      goals: ["Workflow optimization", "Team productivity", "Unified communications"],
      daysInUse: 80,
      icon: <SlidersHorizontal className="h-5 w-5" />
    }
  ];

  // Sample use cases
  const useCases = [
    { id: 'upsell', name: 'Upsell Campaign', description: 'Convert existing customers to higher-tier products' },
    { id: 'acquisition', name: 'New Customer Acquisition', description: 'Attract new customers to your product or service' },
    { id: 'retention', name: 'Customer Retention', description: 'Improve loyalty and reduce churn with existing customers' },
    { id: 'launch', name: 'Product Launch', description: 'Introduce a new product or feature to the market' }
  ];
  
  // Default date range for campaign
  const today = new Date();
  const twoMonthsLater = new Date(today);
  twoMonthsLater.setMonth(today.getMonth() + 2);
  
  // Format dates as YYYY-MM-DD for inputs
  const formatDateForInput = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  // Function to handle campaign generation
  const handleGenerateCampaign = async () => {
    if (!campaignPrompt.trim() && !selectedUseCase) {
      toast({
        title: "Missing information",
        description: "Please provide a campaign description or select a use case",
        variant: "destructive"
      });
      return;
    }

    // Check subscription plan
    if (user?.subscription_plan === 'free' || user?.subscription_plan === 'standard') {
      toast({
        title: "Premium Feature",
        description: "Prospecting Factory is only available on Premium and Pro plans. Please upgrade to access this feature.",
        variant: "destructive"
      });
      setLocation("/pricing");
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(0);
    setActiveTab("generating");

    try {
      // Simulate the generation process with progress updates
      const mockGeneration = async () => {
        // Step 1: Analyze prompt
        setGenerationProgress(10);
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Step 2: Generate personas
        setGenerationProgress(30);
        await new Promise(resolve => setTimeout(resolve, 1200));
        
        // Step 3: Create campaign structure
        setGenerationProgress(50);
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Step 4: Generate content
        setGenerationProgress(70);
        await new Promise(resolve => setTimeout(resolve, 1800));
        
        // Step 5: Finalize campaign
        setGenerationProgress(90);
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Complete
        setGenerationProgress(100);
        
        // Generate mock campaign data
        const mockedCampaign: Campaign = {
          id: 1,
          name: "Microsoft 365 Business Premium Upsell Campaign",
          objective: "Increase conversion rate of standard Microsoft 365 users to Business Premium tier by highlighting advanced security features, enhanced productivity tools, and comprehensive device management capabilities.",
          targetAudience: ["IT Decision Makers", "Small Business Owners", "Operations Managers"],
          channels: ["Email", "LinkedIn", "Webinar", "Case Study"],
          timeline: {
            start: "2025-05-15",
            end: "2025-07-15",
          },
          toneProfile: {
            professional: 90,
            conversational: 65,
            persuasive: 80,
            educational: 85,
            enthusiastic: 55,
          },
          contents: [
            {
              id: 1,
              type: "email",
              title: "Security Enhancements Email for IT Decision Makers",
              persona: "IT Decision Maker",
              content: `Subject: Strengthen Your Security Posture with Microsoft 365 Business Premium

Dear [IT Decision Maker],

As cyber threats continue to evolve, we've noticed your organization has been making great use of Microsoft 365's standard security features. However, with the increasing sophistication of ransomware and phishing attacks targeting businesses of your size, it may be time to consider enhancing your security posture.

Microsoft 365 Business Premium provides advanced security capabilities:

• Defender for Office 365: Advanced threat protection against sophisticated phishing and zero-day threats
• Conditional Access: Ensures only secure devices can access company data
• Intune Mobile Device Management: Secure company data across all devices
• Azure Information Protection: Advanced data loss prevention

I'd like to offer a personalized security assessment to identify how Business Premium could close potential security gaps in your current setup.

Would you have 20 minutes next Tuesday to discuss how these advanced security features could strengthen your defense against today's evolving threats?

Best regards,
[Your Name]`,
              deliveryDate: "2025-05-18",
              channel: "Email",
              icon: <MessageSquare className="h-5 w-5" />
            },
            {
              id: 2,
              type: "social",
              title: "LinkedIn Post for Small Business Owners",
              persona: "Small Business Owner",
              content: `"I was spending 5+ hours weekly on IT issues instead of growing my business. After upgrading to Microsoft 365 Business Premium, our team's productivity increased by 26% and I reclaimed those hours for strategic planning."

Small business owners: Are manual processes and basic tools limiting your growth?

Microsoft 365 Business Premium delivers:
• Automated workflows with Power Automate
• Advanced Teams collaboration features
• PC and mobile device management from one dashboard
• Enterprise-grade security without the enterprise price tag

Calculate your potential ROI with our Business Premium Value Calculator: [Link]

#SmallBusinessTech #ProductivityTools #MicrosoftPartner`,
              deliveryDate: "2025-05-25",
              channel: "LinkedIn",
              icon: <FileText className="h-5 w-5" />
            },
            {
              id: 3,
              type: "blog",
              title: "From Chaos to Clarity: How Microsoft 365 Business Premium Streamlines Operations",
              persona: "Operations Manager",
              content: `# From Chaos to Clarity: How Microsoft 365 Business Premium Streamlines Operations

For operations managers juggling multiple projects, teams, and workflows, the shift to hybrid work has created new challenges in maintaining productivity and process consistency. While standard collaboration tools provide basic functionality, they often lack the advanced features needed to truly optimize complex operational workflows.

## The Operation Manager's Daily Struggle

If you're responsible for operational efficiency, you likely face these challenges:

- **Disconnected communication channels** causing information silos
- **Manual approval processes** that create bottlenecks
- **Inconsistent document access** across devices and locations 
- **Security concerns** with remote and mobile workers
- **Limited automation capabilities** for repetitive tasks

## How Microsoft 365 Business Premium Transforms Operations

Microsoft 365 Business Premium addresses these challenges through a comprehensive suite of advanced tools:

### 1. Streamlined Workflow Automation

Business Premium includes Power Automate, which enables operations managers to:

- Create approval workflows without coding 
- Automate document routing and notifications
- Integrate with hundreds of business applications
- Reduce manual data entry with AI-powered automation

### 2. Enhanced Team Collaboration

Beyond basic Teams functionality, Business Premium offers:

- Webinar hosting capabilities with registration and reporting
- Enhanced breakout room features for team workshops
- Collaborative annotations on shared documents
- Integrated task management across the platform

### 3. Comprehensive Device Management

With Intune included in Business Premium, operations managers can:

- Apply consistent security policies across company and personal devices
- Remotely wipe company data without affecting personal information
- Ensure compliance with company policies on all endpoints
- Simplify onboarding and offboarding processes

## Real Results: Mid-Market Manufacturing Case Study

Precision Parts Inc., a manufacturing company with 120 employees, struggled with coordinating shop floor operations with office staff after implementing hybrid work policies. After upgrading to Microsoft 365 Business Premium:

- Production approval processes were reduced from 27 hours to 4 hours weekly
- Mobile device management reduced security incidents by 64%
- Automation of routine reports saved managers 6+ hours per week
- Cross-department collaboration improved by 37% according to internal surveys

## Is Business Premium Right for Your Operations?

The most successful upgrades to Business Premium share these characteristics:

- Organizations with 10-300 employees
- Hybrid or remote work environments
- Multiple devices per employee (computers, tablets, phones)
- Industry or regulatory compliance requirements
- Limited IT staff relative to company size

## Next Steps for Operations Excellence

Ready to transform your operational efficiency? Here are three ways to explore if Business Premium is right for your team:

1. **Request our Operations Efficiency Calculator** to quantify potential time savings
2. **Schedule a workflow assessment** with our solutions consultant
3. **Join our upcoming webinar:** "Automation Strategies for Operational Excellence"

*Don't let outdated tools limit your operational potential. Microsoft 365 Business Premium provides the advanced capabilities that modern operations require—all within a secure, integrated platform.*`,
              deliveryDate: "2025-06-10",
              channel: "Company Blog",
              icon: <FileText className="h-5 w-5" />
            },
            {
              id: 4,
              type: "ad",
              title: "Webinar Invitation for All Personas",
              persona: "All",
              content: `WEBINAR: MAXIMIZE YOUR MICROSOFT INVESTMENT

Join us for an exclusive webinar on getting more value from your Microsoft 365 subscription.

WHAT YOU'LL LEARN:
• Hidden premium features that boost productivity by 32%
• Security enhancements that protect against sophisticated threats
• Management tools that reduce IT workload by up to 60%
• How to calculate your ROI on a Business Premium upgrade

Date: June 15, 2025
Time: 11:00 AM ET / 8:00 AM PT
Duration: 45 minutes + Q&A

BONUS: All attendees receive our "Microsoft 365 Business Premium ROI Calculator" and a free 30-day trial.

REGISTER NOW: [Link]`,
              deliveryDate: "2025-06-05",
              channel: "Email & LinkedIn",
              icon: <Calendar className="h-5 w-5" />
            }
          ]
        };
        
        setCampaign(mockedCampaign);
        setActiveTab("results");
      };
      
      // Start the generation process
      await mockGeneration();
    } catch (error) {
      console.error("Error generating campaign:", error);
      toast({
        title: "Generation failed",
        description: "There was an error generating your campaign. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectPersona = (id: number) => {
    if (selectedPersonas.includes(id)) {
      setSelectedPersonas(selectedPersonas.filter(p => p !== id));
    } else {
      setSelectedPersonas([...selectedPersonas, id]);
    }
  };

  const handleSaveCampaign = () => {
    toast({
      title: "Campaign saved",
      description: "Your campaign has been saved and is ready to use.",
    });
    // Here we would save the campaign to the database
  };

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
                  <span>Premium Features</span>
                  <span className="mx-2">›</span>
                  <span>Prospecting Factory</span>
                </div>
                <h1 className="text-2xl font-semibold text-white mt-1 flex items-center">
                  Prospecting Factory
                  <Badge variant="outline" className="ml-3 bg-[#74d1ea]/10 text-[#74d1ea] border-[#74d1ea]/30">
                    Premium
                  </Badge>
                </h1>
              </div>
            </div>
          </div>

          <div className="border border-gray-700/60 rounded-lg p-6 shadow-[0_0_25px_rgba(116,209,234,0.15)] mb-8">
            <Tabs defaultValue="input" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger 
                  value="input" 
                  disabled={isGenerating}
                  className={`${activeTab === "input" ? "bg-[#74d1ea]/10 text-[#74d1ea]" : ""}`}
                >
                  1. Campaign Input
                </TabsTrigger>
                <TabsTrigger 
                  value="generating" 
                  disabled={!isGenerating}
                  className={`${activeTab === "generating" ? "bg-[#74d1ea]/10 text-[#74d1ea]" : ""}`}
                >
                  2. AI Processing
                </TabsTrigger>
                <TabsTrigger 
                  value="results" 
                  disabled={!campaign}
                  className={`${activeTab === "results" ? "bg-[#74d1ea]/10 text-[#74d1ea]" : ""}`}
                >
                  3. Campaign Results
                </TabsTrigger>
              </TabsList>

              <TabsContent value="input" className="space-y-8">
                <div>
                  <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <Lightbulb className="h-5 w-5 mr-2 text-[#74d1ea]" />
                    Describe Your Campaign
                  </h2>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="campaign-name" className="text-gray-300 mb-1.5 block">Campaign Brief</Label>
                        <Textarea 
                          id="campaign-brief" 
                          className="min-h-[150px] bg-black border-gray-700 text-white"
                          placeholder="Example: Build me a campaign for Microsoft 365 Business Premium - the aim is to upsell existing Office 365 users by highlighting advanced security features."
                          value={campaignPrompt}
                          onChange={(e) => setCampaignPrompt(e.target.value)}
                        />
                        <p className="text-xs text-gray-400 mt-1">Be specific about your target audience, campaign goals, and key selling points</p>
                      </div>

                      <div>
                        <Label className="text-gray-300 mb-1.5 block">Campaign Type</Label>
                        <div className="grid grid-cols-2 gap-3">
                          {useCases.map(useCase => (
                            <div 
                              key={useCase.id}
                              className={`
                                cursor-pointer rounded-lg border p-3 text-sm transition-colors
                                ${selectedUseCase === useCase.id 
                                  ? 'border-[#74d1ea] bg-[#74d1ea]/10 text-white' 
                                  : 'border-gray-700 bg-black text-gray-400 hover:bg-gray-900/50 hover:text-gray-300'
                                }
                              `}
                              onClick={() => setSelectedUseCase(useCase.id)}
                            >
                              <div className="font-medium text-white">{useCase.name}</div>
                              <div className="text-xs mt-1">{useCase.description}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-5">
                      <div>
                        <h3 className="text-white font-medium mb-2">Select Target Personas</h3>
                        <div className="space-y-3">
                          {personas.map(persona => (
                            <div 
                              key={persona.id}
                              className={`
                                flex items-center justify-between p-3 border rounded-lg cursor-pointer
                                ${selectedPersonas.includes(persona.id) 
                                  ? 'border-[#74d1ea] bg-[#74d1ea]/10' 
                                  : 'border-gray-700 hover:bg-gray-900/50'
                                }
                              `}
                              onClick={() => handleSelectPersona(persona.id)}
                            >
                              <div className="flex items-center">
                                <div className={`
                                  w-8 h-8 rounded-full flex items-center justify-center mr-3
                                  ${selectedPersonas.includes(persona.id) 
                                    ? 'bg-[#74d1ea]/20 text-[#74d1ea]' 
                                    : 'bg-gray-800 text-gray-400'
                                  }
                                `}>
                                  {persona.icon}
                                </div>
                                <div>
                                  <span className="text-white font-medium">{persona.name}</span>
                                  <p className="text-xs text-gray-400">{persona.role}</p>
                                </div>
                              </div>
                              <div className="flex items-center">
                                {selectedPersonas.includes(persona.id) && (
                                  <Check className="h-4 w-4 text-[#74d1ea]" />
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                        {selectedPersonas.length > 1 && (
                          <div className="mt-4">
                            <h3 className="text-white font-medium text-sm mb-2">Persona Balance</h3>
                            <div className="flex items-center justify-between border border-gray-700 rounded-lg p-3">
                              <div>
                                <span className="text-white text-sm">Weighted distribution</span>
                                <p className="text-xs text-gray-400">Prioritize primary persona in campaign</p>
                              </div>
                              <Switch
                                checked={personaBalance === "weighted"}
                                onCheckedChange={(checked) => 
                                  setPersonaBalance(checked ? "weighted" : "equal")
                                }
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      <div>
                        <h3 className="text-white font-medium mb-2">Additional Settings</h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between border border-gray-700 rounded-lg p-3">
                            <div>
                              <span className="text-white text-sm">Include tone analysis</span>
                              <p className="text-xs text-gray-400">Apply your brand's tone profile</p>
                            </div>
                            <Switch defaultChecked />
                          </div>
                          <div className="flex items-center justify-between border border-gray-700 rounded-lg p-3">
                            <div>
                              <span className="text-white text-sm">Generate all deliverables</span>
                              <p className="text-xs text-gray-400">Create full content for all campaign pieces</p>
                            </div>
                            <Switch defaultChecked />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button 
                    onClick={handleGenerateCampaign} 
                    className="bg-[#74d1ea] hover:bg-[#5db8d0] text-black shadow-[0_0_10px_rgba(116,209,234,0.4)]"
                    disabled={isGenerating}
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Campaign
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="generating" className="text-center py-10">
                <div className="max-w-md mx-auto">
                  <Sparkles className="h-12 w-12 text-[#74d1ea] mx-auto animate-pulse mb-4" />
                  <h2 className="text-xl font-semibold text-white mb-2">Creating Your Campaign</h2>
                  <p className="text-gray-400 mb-6">Our AI is generating a comprehensive campaign based on your input</p>
                  
                  <Progress value={generationProgress} className="h-2 mb-8" />
                  
                  <div className="space-y-3 text-left">
                    <div className={`flex items-center ${generationProgress >= 10 ? 'text-white' : 'text-gray-500'}`}>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${generationProgress >= 10 ? 'bg-[#74d1ea]/20 text-[#74d1ea]' : 'bg-gray-800'}`}>
                        {generationProgress >= 10 ? <Check className="h-4 w-4" /> : "1"}
                      </div>
                      <span>Analyzing campaign brief...</span>
                    </div>
                    
                    <div className={`flex items-center ${generationProgress >= 30 ? 'text-white' : 'text-gray-500'}`}>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${generationProgress >= 30 ? 'bg-[#74d1ea]/20 text-[#74d1ea]' : 'bg-gray-800'}`}>
                        {generationProgress >= 30 ? <Check className="h-4 w-4" /> : "2"}
                      </div>
                      <span>Profiling target personas...</span>
                    </div>
                    
                    <div className={`flex items-center ${generationProgress >= 50 ? 'text-white' : 'text-gray-500'}`}>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${generationProgress >= 50 ? 'bg-[#74d1ea]/20 text-[#74d1ea]' : 'bg-gray-800'}`}>
                        {generationProgress >= 50 ? <Check className="h-4 w-4" /> : "3"}
                      </div>
                      <span>Structuring campaign architecture...</span>
                    </div>
                    
                    <div className={`flex items-center ${generationProgress >= 70 ? 'text-white' : 'text-gray-500'}`}>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${generationProgress >= 70 ? 'bg-[#74d1ea]/20 text-[#74d1ea]' : 'bg-gray-800'}`}>
                        {generationProgress >= 70 ? <Check className="h-4 w-4" /> : "4"}
                      </div>
                      <span>Generating content deliverables...</span>
                    </div>
                    
                    <div className={`flex items-center ${generationProgress >= 90 ? 'text-white' : 'text-gray-500'}`}>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${generationProgress >= 90 ? 'bg-[#74d1ea]/20 text-[#74d1ea]' : 'bg-gray-800'}`}>
                        {generationProgress >= 90 ? <Check className="h-4 w-4" /> : "5"}
                      </div>
                      <span>Finalizing campaign roadmap...</span>
                    </div>
                    
                    <div className={`flex items-center ${generationProgress >= 100 ? 'text-white' : 'text-gray-500'}`}>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${generationProgress >= 100 ? 'bg-[#74d1ea]/20 text-[#74d1ea]' : 'bg-gray-800'}`}>
                        {generationProgress >= 100 ? <Check className="h-4 w-4" /> : "6"}
                      </div>
                      <span>Campaign ready!</span>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="results">
                {campaign && (
                  <div className="space-y-8">
                    {/* Campaign Overview Card */}
                    <div className="border border-gray-700/60 rounded-lg p-6 bg-black/90">
                      <div className="flex flex-col lg:flex-row justify-between gap-6">
                        <div className="space-y-4">
                          <Badge variant="outline" className="bg-[#74d1ea]/10 text-[#74d1ea] border-[#74d1ea]/30">
                            {selectedUseCase === 'upsell' ? 'Upsell Campaign' : 'Custom Campaign'}
                          </Badge>
                          <h2 className="text-2xl font-bold text-white">{campaign.name}</h2>
                          <p className="text-gray-400 max-w-3xl">{campaign.objective}</p>
                          
                          <div className="flex flex-wrap gap-2 pt-2">
                            {campaign.targetAudience.map((audience, i) => (
                              <Badge key={i} variant="outline" className="bg-gray-800/80 text-gray-300">
                                <Users className="h-3 w-3 mr-1" />
                                {audience}
                              </Badge>
                            ))}
                            {campaign.channels.map((channel, i) => (
                              <Badge key={i} variant="outline" className="bg-gray-800/80 text-gray-300">
                                {channel}
                              </Badge>
                            ))}
                            <Badge variant="outline" className="bg-gray-800/80 text-gray-300">
                              <Calendar className="h-3 w-3 mr-1" />
                              2 month campaign
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="sm:max-w-xs w-full">
                          <Card className="bg-black border-gray-700">
                            <CardHeader className="py-3 px-4">
                              <CardTitle className="text-sm text-white flex items-center">
                                <BarChart3 className="h-4 w-4 mr-2 text-[#74d1ea]" />
                                Tone Analysis
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="px-4 pb-4 pt-0 space-y-2">
                              {Object.entries(campaign.toneProfile).map(([key, value]) => (
                                <div key={key}>
                                  <div className="flex justify-between text-xs mb-1">
                                    <span className="text-gray-300 capitalize">{key}</span>
                                    <span className="text-[#74d1ea]">{value}%</span>
                                  </div>
                                  <div className="h-1.5 bg-gray-800 rounded-full">
                                    <div 
                                      className="h-1.5 bg-[#74d1ea] rounded-full" 
                                      style={{width: `${value}%`}}
                                    ></div>
                                  </div>
                                </div>
                              ))}
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    </div>
                    
                    {/* Campaign Timeline */}
                    <div>
                      <h3 className="text-lg font-medium text-white mb-4 flex items-center">
                        <Calendar className="h-5 w-5 mr-2 text-[#74d1ea]" />
                        Campaign Timeline
                      </h3>
                      
                      <div className="relative border border-gray-700/60 rounded-lg p-4 bg-black/90">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#74d1ea]/80 via-[#74d1ea]/30 to-transparent rounded-full mx-4 my-6"></div>
                        
                        <div className="pl-8 space-y-6">
                          <div className="relative">
                            <div className="absolute -left-8 mt-1 w-3 h-3 rounded-full bg-[#74d1ea]"></div>
                            <div>
                              <span className="text-[#74d1ea] text-sm">Phase 1: Campaign Setup</span>
                              <p className="text-white mt-0.5">May 15 - May 25, 2025</p>
                              <p className="text-gray-400 text-sm mt-1">Finalize targeting, content creation, and campaign setup</p>
                            </div>
                          </div>
                          
                          <div className="relative">
                            <div className="absolute -left-8 mt-1 w-3 h-3 rounded-full bg-[#74d1ea]/80"></div>
                            <div>
                              <span className="text-[#74d1ea] text-sm">Phase 2: Initial Outreach</span>
                              <p className="text-white mt-0.5">May 25 - June 15, 2025</p>
                              <p className="text-gray-400 text-sm mt-1">Email outreach, LinkedIn campaigns, and first webinar</p>
                            </div>
                          </div>
                          
                          <div className="relative">
                            <div className="absolute -left-8 mt-1 w-3 h-3 rounded-full bg-[#74d1ea]/60"></div>
                            <div>
                              <span className="text-[#74d1ea] text-sm">Phase 3: Follow-up & Conversion</span>
                              <p className="text-white mt-0.5">June 15 - July 5, 2025</p>
                              <p className="text-gray-400 text-sm mt-1">Targeted follow-ups, case studies, and personalized demos</p>
                            </div>
                          </div>
                          
                          <div className="relative">
                            <div className="absolute -left-8 mt-1 w-3 h-3 rounded-full bg-[#74d1ea]/40"></div>
                            <div>
                              <span className="text-[#74d1ea] text-sm">Phase 4: Final Push & Analysis</span>
                              <p className="text-white mt-0.5">July 5 - July 15, 2025</p>
                              <p className="text-gray-400 text-sm mt-1">Final conversion activity, reporting, and analysis</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Campaign Content */}
                    <div>
                      <h3 className="text-lg font-medium text-white mb-4 flex items-center">
                        <FileText className="h-5 w-5 mr-2 text-[#74d1ea]" />
                        Campaign Deliverables
                      </h3>
                      
                      <div className="space-y-4">
                        {campaign.contents.map((content) => (
                          <div key={content.id} className="border border-gray-700/60 rounded-lg overflow-hidden">
                            <div className="flex items-center justify-between bg-gray-900/50 px-4 py-3 border-b border-gray-700/60">
                              <div className="flex items-center">
                                <div className="h-8 w-8 rounded-full bg-[#74d1ea]/10 flex items-center justify-center mr-3">
                                  {content.icon || <FileText className="h-4 w-4 text-[#74d1ea]" />}
                                </div>
                                <div>
                                  <h4 className="text-white font-medium">{content.title}</h4>
                                  <div className="flex items-center text-xs text-gray-400 mt-0.5 space-x-3">
                                    <span>{content.type.charAt(0).toUpperCase() + content.type.slice(1)}</span>
                                    {content.persona && (
                                      <>
                                        <span>•</span>
                                        <span className="flex items-center">
                                          <Users className="h-3 w-3 mr-1" />
                                          {content.persona}
                                        </span>
                                      </>
                                    )}
                                    {content.deliveryDate && (
                                      <>
                                        <span>•</span>
                                        <span className="flex items-center">
                                          <Calendar className="h-3 w-3 mr-1" />
                                          {content.deliveryDate}
                                        </span>
                                      </>
                                    )}
                                    {content.channel && (
                                      <>
                                        <span>•</span>
                                        <span>{content.channel}</span>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div>
                                <Button variant="ghost" size="sm" className="h-8 text-[#74d1ea] hover:bg-[#74d1ea]/10">
                                  <Copy className="h-3.5 w-3.5 mr-1" />
                                  Copy
                                </Button>
                              </div>
                            </div>
                            <div className="p-4 bg-black">
                              <pre className="whitespace-pre-wrap text-gray-300 text-sm font-mono">{content.content}</pre>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex justify-between items-center pt-4">
                      <Button 
                        onClick={() => setActiveTab("input")}
                        variant="outline"
                        className="border-gray-700 text-gray-300 hover:bg-gray-800"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Regenerate
                      </Button>
                      
                      <div className="flex space-x-3">
                        <Button 
                          variant="outline"
                          className="border-[#74d1ea] text-[#74d1ea] hover:bg-[#74d1ea]/10"
                        >
                          <PlusCircle className="h-4 w-4 mr-2" />
                          Add to Campaign Hub
                        </Button>
                        
                        <Button 
                          onClick={handleSaveCampaign}
                          className="bg-[#74d1ea] hover:bg-[#5db8d0] text-black shadow-[0_0_10px_rgba(116,209,234,0.4)]"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          Save Campaign
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
}