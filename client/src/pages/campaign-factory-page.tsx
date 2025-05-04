import React, { useState, useEffect } from "react";
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
import { Sparkles, Loader2, Calendar, FileText, Lightbulb, Target, Clock, Users, Copy, Check, ChevronRight, Clipboard, ArrowRight, X, PlusCircle, Save, PlayCircle, BarChart3, SlidersHorizontal, MessageSquare, Settings, Shield, Server as ServerIcon } from "lucide-react";
import { useLocation } from "wouter";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiRequest } from "@/lib/queryClient";
import { useQuery } from "@tanstack/react-query";

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
  type: 'email' | 'social' | 'blog' | 'webinar';
  title: string;
  content: string;
  persona: string;
  deliveryDate?: string;
  channel?: string;
  icon?: React.ReactNode;
};

// Tone Analysis type from the database
type ToneAnalysis = {
  id: number;
  user_id: number;
  name: string;
  website_url?: string;
  sample_text?: string;
  tone_results?: any;
  created_at: string;
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

export default function CampaignFactoryPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("input");
  // Format dates as YYYY-MM-DD for inputs
  const formatDateForInput = (date: Date) => {
    return date.toISOString().split('T')[0];
  };
  
  // Default date range for campaign
  const today = new Date();
  const twoMonthsLater = new Date(today);
  twoMonthsLater.setMonth(today.getMonth() + 2);
  
  const [campaignPrompt, setCampaignPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedUseCase, setSelectedUseCase] = useState<string>("");
  const [generationProgress, setGenerationProgress] = useState(0);
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [selectedPersonas, setSelectedPersonas] = useState<number[]>([]);
  const [personaBalance, setPersonaBalance] = useState<"equal" | "weighted">("equal");
  const [useGeneratedPersonas, setUseGeneratedPersonas] = useState<boolean>(false);
  const [isGeneratingPersonas, setIsGeneratingPersonas] = useState<boolean>(false);
  const [generatedPersonas, setGeneratedPersonas] = useState<Persona[]>([]);
  const [campaignStartDate, setCampaignStartDate] = useState<string>(formatDateForInput(new Date()));
  const [campaignEndDate, setCampaignEndDate] = useState<string>(formatDateForInput(twoMonthsLater));
  const [selectedContentTypes, setSelectedContentTypes] = useState<{ 
    email: boolean, social: boolean, blog: boolean, webinar: boolean 
  }>({ email: true, social: true, blog: true, webinar: false });

  const [contentCount, setContentCount] = useState<{ email: number, social: number, blog: number, webinar: number }>(
    { email: 2, social: 3, blog: 1, webinar: 1 }
  );
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [selectedToneAnalysisId, setSelectedToneAnalysisId] = useState<string>("");
  
  // Fetch tone analyses for the user
  const { data: toneAnalyses, isLoading: isLoadingToneAnalyses } = useQuery<ToneAnalysis[]>({
    queryKey: ["/api/tone-analyses"],
    enabled: !!user,
  });

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
  

  // Function to handle campaign generation
  const handleGenerateCampaign = async () => {
    if (!campaignPrompt.trim() || !selectedUseCase) {
      toast({
        title: "Missing information",
        description: "Please provide both a campaign description and select a use case",
        variant: "destructive"
      });
      return;
    }

    // Check subscription plan
    if (user?.subscription_plan === 'free' || user?.subscription_plan === 'standard') {
      toast({
        title: "Premium Feature",
        description: "Campaign Factory is only available on Premium and Pro plans. Please upgrade to access this feature.",
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
        
        // Step 2: Use or generate personas
        setGenerationProgress(30);
        // Auto-generate personas if that option is selected but none exist yet
        if (useGeneratedPersonas && generatedPersonas.length === 0) {
          await handleGeneratePersonas();
        }
        
        // Auto-select the first generated persona if none are selected
        if (selectedPersonas.length === 0 && useGeneratedPersonas && generatedPersonas.length > 0) {
          setSelectedPersonas([generatedPersonas[0].id]);
        }
        
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
        const allContentPieces = [
          {
            id: 1,
            type: "email" as const,
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
            deliveryDate: campaignStartDate,
            channel: "Email",
            icon: <MessageSquare className="h-5 w-5" />
          },
          {
            id: 2,
            type: "email" as const,
            title: "Follow-up Email for IT Decision Makers",
            persona: "IT Decision Maker",
            content: `Subject: Following Up: Microsoft 365 Security Assessment

Dear [IT Decision Maker],

I wanted to follow up on my previous email about Microsoft 365 Business Premium's enhanced security features.

In light of recent high-profile ransomware attacks targeting organizations in your industry, I thought you might be interested in our latest security assessment tool that can identify potential vulnerabilities in your current setup.

Would you be available for a brief 15-minute demo this Thursday or Friday? I'd be happy to show you how other companies similar to yours have strengthened their security posture with minimal disruption to operations.

Looking forward to your response,
[Your Name]`,
            deliveryDate: new Date(new Date(campaignStartDate).setDate(new Date(campaignStartDate).getDate() + 7)).toISOString().split('T')[0],
            channel: "Email",
            icon: <MessageSquare className="h-5 w-5" />
          },
          {
            id: 3,
            type: "social" as const,
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

#SmallBusinessTech #ProductivityTools #MicrosoftPartner #LinkedIn`,
            deliveryDate: new Date(new Date(campaignStartDate).setDate(new Date(campaignStartDate).getDate() + 3)).toISOString().split('T')[0],
            channel: "LinkedIn",
            icon: <FileText className="h-5 w-5" />
          },
          {
            id: 4,
            type: "webinar" as const,
            title: "Advanced Security Webinar for IT Professionals",
            persona: "IT Decision Maker",
            content: `Title: "Modern Threat Defense: Building Resilient Security with Microsoft 365 Business Premium"

Duration: 45 minutes + 15-minute Q&A

Target Audience: IT Decision Makers and Security Professionals

Description:
Join our Microsoft security specialists for an in-depth webinar on enhancing your organization's security posture through Microsoft 365 Business Premium. In this session, we'll demonstrate how Business Premium's advanced security features create a comprehensive defense system against modern threats.

Agenda:
- The evolving threat landscape for small and mid-sized businesses in 2025
- Live demonstration of Microsoft Defender for Office 365's threat detection capabilities
- Device management best practices with Intune for hybrid/remote workforces
- Implementing zero-trust security principles with Conditional Access
- Case study: How Company X reduced security incidents by 73% in 90 days

Key Takeaways:
- Understanding of specific threat vectors targeting businesses like yours
- Actionable configuration steps for maximizing security with Business Premium
- Custom assessment methodology to identify your most critical security gaps
- Implementation roadmap template for security enhancement

Presenter:
[Security Specialist Name], Microsoft Security Solutions Architect with 15+ years of experience in cybersecurity implementation for SMBs.

Registration includes a complimentary security assessment consultation and access to our Business Premium implementation guide.`,
            deliveryDate: new Date(new Date(campaignStartDate).setDate(new Date(campaignStartDate).getDate() + 14)).toISOString().split('T')[0],
            channel: "Webinar",
            icon: <PlayCircle className="h-5 w-5" />
          },
          {
            id: 5,
            type: "social" as const,
            title: "LinkedIn Article on Security ROI",
            persona: "Operations Manager",
            content: `# The True ROI of Advanced Security: Beyond Preventing Breaches

When calculating the return on investment for security solutions, most businesses focus only on breach prevention. But advanced security delivers value far beyond avoiding attackers.

Here are 5 unexpected ways Microsoft 365 Business Premium's security features drive operational efficiency:

1. **Reduced IT firefighting**: Automated threat response means your IT team spends 62% less time on security incidents and more time on strategic initiatives.

2. **Simplified compliance**: Built-in compliance tools reduce audit preparation time by 78% on average.

3. **Accelerated employee onboarding**: Streamlined device management cuts provisioning time in half while maintaining security standards.

4. **Enhanced productivity**: Employees experience 27% fewer disruptions from security-related issues.

5. **Reduced shadow IT**: When security tools are intuitive, employees are 84% less likely to seek unauthorized workarounds.

What's your perspective? Has your organization quantified the operational benefits of advanced security beyond breach prevention?

#SecurityROI #BusinessProductivity #MicrosoftSecurity #LinkedIn`,
            deliveryDate: new Date(new Date(campaignStartDate).setDate(new Date(campaignStartDate).getDate() + 17)).toISOString().split('T')[0],
            channel: "LinkedIn",
            icon: <FileText className="h-5 w-5" />
          },
          {
            id: 6,
            type: "blog" as const,
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
            id: 7,
            type: "email" as const,
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
        ];

        // Get the selected use case display name
        const selectedUseCaseObj = useCases.find(uc => uc.id === selectedUseCase);
        
        // Get all available personas - either default or AI-generated based on user selection
        const availablePersonas = useGeneratedPersonas ? generatedPersonas : personas;
        
        // Get the names of the selected personas 
        const selectedPersonaNames = selectedPersonas.map(id => {
            const persona = availablePersonas.find(p => p.id === id);
            return persona ? persona.name : "";
        }).filter(name => name !== "");
        
        // Filter content based on selected content types
        const filteredContents = allContentPieces.filter(content => {
            // First, check if the content type is selected
            const isTypeSelected = selectedContentTypes[content.type as keyof typeof selectedContentTypes];
            
            // For 'All' personas, always include if type is selected
            if (content.persona === "All") {
                return isTypeSelected;
            }
            
            // For specific personas, check if it's one of the selected ones or related
            const isPersonaRelevant = selectedPersonaNames.some(name => 
                content.persona === name || 
                content.persona.includes(name) ||
                name.includes(content.persona)
            );
            
            return isTypeSelected && (isPersonaRelevant || selectedPersonaNames.length === 0);
        });

        const mockedCampaign: Campaign = {
          id: 1,
          name: `${selectedUseCaseObj?.name || ""} - ${campaignPrompt.split(".")[0]}`.trim(),
          objective: campaignPrompt || `${selectedUseCaseObj?.description || ""} campaign targeting specific personas with customized content.`,
          targetAudience: selectedPersonaNames.length > 0 ? selectedPersonaNames : ["IT Decision Makers", "Small Business Owners", "Operations Managers"],
          channels: Object.entries(selectedContentTypes)
            .filter(([_, isSelected]) => isSelected)
            .map(([type, _]) => {
              switch(type) {
                case 'email': return "Email";
                case 'social': return "LinkedIn";
                case 'blog': return "Blog";
                case 'webinar': return "Webinar";
                default: return "";
              }
            })
            .filter(channel => channel !== ""),
          timeline: {
            start: campaignStartDate,
            end: campaignEndDate,
          },
          toneProfile: {
            professional: 90,
            conversational: 65,
            persuasive: 80,
            educational: 85,
            enthusiastic: 55,
          },
          contents: filteredContents
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
  
  // Function to generate personas based on campaign brief
  const handleGeneratePersonas = async () => {
    if (!campaignPrompt.trim() || !selectedUseCase) {
      toast({
        title: "Missing information",
        description: "Please provide both a campaign description and select a use case to generate relevant personas",
        variant: "destructive"
      });
      return;
    }
    
    setIsGeneratingPersonas(true);
    
    try {
      // Simulate API call to generate personas
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate mock personas based on the campaign brief or selected use case
      const generatedPersonasMock: Persona[] = [
        {
          id: 101,
          name: "Enterprise Security Director",
          role: "CISO",
          pains: [
            "Advanced persistent threats", 
            "Compliance with industry regulations", 
            "Securing remote workforce",
            "Limited security budget"
          ],
          goals: [
            "Implement zero-trust architecture", 
            "Improve threat detection", 
            "Streamline security operations",
            "Secure cloud migration"
          ],
          daysInUse: 0,
          icon: <Shield className="h-5 w-5" />
        },
        {
          id: 102,
          name: "Digital Transformation Leader",
          role: "VP of Digital Strategy",
          pains: [
            "Legacy system integration", 
            "Change management resistance", 
            "Technical skill gaps",
            "Budget constraints for innovation"
          ],
          goals: [
            "Accelerate cloud adoption", 
            "Implement AI/ML solutions", 
            "Improve customer digital experience",
            "Data-driven decision making"
          ],
          daysInUse: 0,
          icon: <Lightbulb className="h-5 w-5" />
        },
        {
          id: 103,
          name: "IT Infrastructure Manager",
          role: "IT Manager",
          pains: [
            "System reliability issues", 
            "Scaling infrastructure", 
            "Talent retention",
            "Managing hybrid infrastructure"
          ],
          goals: [
            "Infrastructure automation", 
            "Cost optimization", 
            "Improved system performance",
            "Simplified management"
          ],
          daysInUse: 0,
          icon: <ServerIcon className="h-5 w-5" />
        }
      ];
      
      setGeneratedPersonas(generatedPersonasMock);
      
      // Get the selected use case display name
      const selectedUseCaseObj = useCases.find(uc => uc.id === selectedUseCase);
      
      toast({
        title: "Personas generated",
        description: `AI has generated 3 relevant personas based on your campaign brief and ${selectedUseCaseObj?.name || ''} use case`,
      });
    } catch (error) {
      console.error("Error generating personas:", error);
      toast({
        title: "Generation failed",
        description: "Failed to generate personas. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingPersonas(false);
    }
  };

  const handleSaveCampaign = () => {
    toast({
      title: "Campaign saved",
      description: "Your campaign has been saved and is ready to use.",
    });
    // Here we would save the campaign to the database
  };
  
  const handleAddToCampaignHub = () => {
    toast({
      title: "Added to Campaign Hub",
      description: "Your campaign has been added to your Campaign Hub and is ready to manage.",
    });
    // Here we would add the campaign to the campaign hub collection
    setLocation("/campaigns");
  };

  return (
    <Layout showSidebar={true}>
      <div className="flex-1 overflow-y-auto bg-black" style={{backgroundImage: 'none'}}>
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
                  <span>Campaign Factory</span>
                </div>
                <h1 className="text-2xl font-semibold text-white mt-1 flex items-center">
                  Campaign Factory
                  <Badge variant="outline" className="ml-3 bg-[#74d1ea]/10 text-[#74d1ea] border-[#74d1ea]/30">
                    Premium
                  </Badge>
                </h1>
              </div>
            </div>
          </div>
          
          {/* Campaign Factory Promo Banner */}
          <div className="mb-8 bg-[#0a0c10] border border-gray-800/60 rounded-xl p-8 relative overflow-hidden shadow-[0_0_25px_rgba(116,209,234,0.05)]">
            <div className="absolute inset-0 bg-gradient-to-t from-[#0e1b33]/60 via-transparent to-transparent pointer-events-none"></div>
            
            <div className="relative z-10 flex items-start">
              <div className="mr-6 bg-[#0e131f] border border-[#74d1ea]/20 rounded-lg p-3 shadow-[0_0_15px_rgba(116,209,234,0.15)]">
                <Sparkles className="h-6 w-6 text-[#74d1ea]" />
              </div>
              
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-white mb-3">AI-Powered Campaign Generation</h2>
                <p className="text-gray-300 mb-6 max-w-3xl">
                  Create comprehensive, multi-channel marketing campaigns in minutes with our AI Campaign Factory. Define your goals and target audience once, then let our advanced AI generate cohesive content across multiple platforms.
                </p>
                
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="text-[#74d1ea] mr-3">✓</div>
                    <span className="text-gray-300">Generate complete campaigns including Email, LinkedIn, Blog, and Webinar content</span>
                  </div>
                  <div className="flex items-center">
                    <div className="text-[#74d1ea] mr-3">✓</div>
                    <span className="text-gray-300">AI-generated personas based on your campaign brief and target audience</span>
                  </div>
                  <div className="flex items-center">
                    <div className="text-[#74d1ea] mr-3">✓</div>
                    <span className="text-gray-300">Consistent messaging and brand voice across all campaign elements</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border border-gray-700/60 rounded-lg p-6 shadow-[0_0_25px_rgba(116,209,234,0.15)] mb-8">
            <Tabs defaultValue="input" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3 mb-8 bg-black border border-gray-700/60" style={{backgroundImage: 'none'}}>
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
                <Card className="bg-black border-gray-700/60 shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
                  <CardHeader className="border-b border-gray-800">
                    <CardTitle className="text-white text-xl flex items-center">
                      <div className="h-5 w-5 mr-2 text-[#74d1ea] flex items-center justify-center bg-[#74d1ea]/10 rounded-md">
                        <FileText className="h-4 w-4" />
                      </div>
                      Campaign Brief
                    </CardTitle>
                    <CardDescription>Provide information about the campaign you'd like to create</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-8 pt-6">
                    {/* Step 1: Campaign Type */}
                    <div className="bg-gray-900/30 rounded-lg p-5 border border-gray-800">
                      <h3 className="text-white font-medium mb-4 flex items-center">
                        <div className="flex items-center justify-center h-9 w-9 rounded-md bg-gradient-to-br from-[#74d1ea]/20 to-[#74d1ea]/5 shadow-sm border border-[#74d1ea]/10 mr-3">
                          <div className="h-6 w-6 flex items-center justify-center rounded-md bg-[#74d1ea]/10">
                            <Target className="h-4 w-4 text-[#74d1ea]" />
                          </div>
                        </div>
                        Step 1: Campaign Type & Content 
                      </h3>
                      
                      <div className="grid md:grid-cols-2 gap-8">
                        <div>
                          <Label htmlFor="campaign-prompt" className="text-white mb-2 block">Campaign Description</Label>
                          <Textarea 
                            id="campaign-prompt"
                            placeholder="Describe your campaign goals, target audience, key messaging points, and any specific requirements..."
                            className="bg-black/60 border-gray-700 resize-none text-white h-32"
                            value={campaignPrompt}
                            onChange={(e) => setCampaignPrompt(e.target.value)}
                          />
                          <p className="text-xs text-gray-400 mt-1.5">
                            Be detailed about your target audience, objectives, and desired messaging style
                          </p>
                        </div>

                        <div className="space-y-5">
                          <div>
                            <Label className="text-white mb-2 block">Select a Use Case</Label>
                            <div className="grid grid-cols-2 gap-3">
                              {useCases.map((useCase) => (
                                <div 
                                  key={useCase.id}
                                  className={`border rounded-lg p-3 cursor-pointer transition-all duration-200 ${
                                    selectedUseCase === useCase.id 
                                    ? "border-[#74d1ea] bg-[#74d1ea]/10 text-white shadow-[0_0_10px_rgba(116,209,234,0.15)]" 
                                    : "border-gray-700 text-gray-300 hover:border-gray-500"
                                  }`}
                                  onClick={() => setSelectedUseCase(useCase.id)}
                                >
                                  <div className="font-medium text-sm">{useCase.name}</div>
                                  <div className="text-xs mt-1 text-gray-400">{useCase.description}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <Label className="text-white mb-2 block">Content Types</Label>
                            <div className="grid grid-cols-2 gap-3">
                              <div className="flex items-center space-x-3 border border-gray-800 rounded-md p-2.5">
                                <Switch 
                                  id="email-content"
                                  checked={selectedContentTypes.email}
                                  onCheckedChange={(checked) => setSelectedContentTypes({...selectedContentTypes, email: checked})}
                                />
                                <Label htmlFor="email-content" className="text-sm cursor-pointer">Email</Label>
                              </div>
                              <div className="flex items-center space-x-3 border border-gray-800 rounded-md p-2.5">
                                <Switch 
                                  id="social-content" 
                                  checked={selectedContentTypes.social}
                                  onCheckedChange={(checked) => setSelectedContentTypes({...selectedContentTypes, social: checked})}
                                />
                                <Label htmlFor="social-content" className="text-sm cursor-pointer">LinkedIn</Label>
                              </div>
                              <div className="flex items-center space-x-3 border border-gray-800 rounded-md p-2.5">
                                <Switch 
                                  id="blog-content" 
                                  checked={selectedContentTypes.blog}
                                  onCheckedChange={(checked) => setSelectedContentTypes({...selectedContentTypes, blog: checked})}
                                />
                                <Label htmlFor="blog-content" className="text-sm cursor-pointer">Blog</Label>
                              </div>
                              <div className="flex items-center space-x-3 border border-gray-800 rounded-md p-2.5">
                                <Switch 
                                  id="webinar-content" 
                                  checked={selectedContentTypes.webinar}
                                  onCheckedChange={(checked) => setSelectedContentTypes({...selectedContentTypes, webinar: checked})}
                                />
                                <Label htmlFor="webinar-content" className="text-sm cursor-pointer">Webinar</Label>
                              </div>
                            </div>
                            <p className="text-xs text-gray-400 mt-2">
                              Select the content types you want to include in your campaign (maximum 20 pieces per type)
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Step 2: Target Personas */}
                    <div className="bg-gray-900/30 rounded-lg p-5 border border-gray-800">
                      <h3 className="text-white font-medium mb-4 flex items-center">
                        <div className="flex items-center justify-center h-9 w-9 rounded-md bg-gradient-to-br from-[#74d1ea]/20 to-[#74d1ea]/5 shadow-sm border border-[#74d1ea]/10 mr-3">
                          <div className="h-6 w-6 flex items-center justify-center rounded-md bg-[#74d1ea]/10">
                            <Users className="h-4 w-4 text-[#74d1ea]" />
                          </div>
                        </div>
                        Step 2: Target Personas
                      </h3>
                      
                      {/* Toggle between existing and AI-generated personas */}
                      <div className="flex items-center justify-start mb-4 bg-black/30 p-3 rounded-md border border-gray-800">
                        <div className="mr-4 flex items-center">
                          <Switch 
                            id="use-generated-personas"
                            checked={useGeneratedPersonas}
                            onCheckedChange={setUseGeneratedPersonas}
                            className="mr-2"
                          />
                          <Label htmlFor="use-generated-personas" className="text-sm cursor-pointer">
                            Generate AI personas based on campaign brief
                          </Label>
                        </div>
                        
                        {useGeneratedPersonas && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={handleGeneratePersonas}
                            disabled={isGeneratingPersonas}
                            className="text-xs border-[#74d1ea]/30 text-[#74d1ea] hover:bg-[#74d1ea]/10"
                          >
                            {isGeneratingPersonas ? (
                              <>
                                <Loader2 className="mr-1.5 h-3 w-3 animate-spin" />
                                Generating...
                              </>
                            ) : (
                              <>
                                <Sparkles className="mr-1.5 h-3 w-3" />
                                Generate Personas
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                      
                      <div className="grid md:grid-cols-3 gap-4">
                        {/* If using AI-generated personas, show those instead of predefined personas */}
                        {(useGeneratedPersonas ? generatedPersonas : personas).map((persona) => (
                          <div 
                            key={persona.id}
                            className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 relative ${
                              selectedPersonas.includes(persona.id) 
                              ? "border-[#74d1ea] bg-[#74d1ea]/10 shadow-[0_0_15px_rgba(116,209,234,0.15)]" 
                              : "border-gray-700 hover:border-gray-500"
                            }`}
                            onClick={() => handleSelectPersona(persona.id)}
                          >
                            {selectedPersonas.includes(persona.id) && (
                              <Badge className="absolute top-3 right-3 bg-[#74d1ea] text-black">
                                Selected
                              </Badge>
                            )}
                            <div className="flex items-center mb-3">
                              <div className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center text-[#74d1ea]">
                                {persona.icon}
                              </div>
                              <div className="ml-3">
                                <div className="font-medium text-white">{persona.name}</div>
                                <div className="text-xs text-gray-400">{persona.role}</div>
                              </div>
                            </div>
                            
                            <div className="space-y-3 text-sm">
                              <div>
                                <Label className="text-[#74d1ea] text-xs mb-1 flex items-center">
                                  <Target className="h-3.5 w-3.5 mr-1" />
                                  Key Pains
                                </Label>
                                <ul className="text-gray-300 text-xs list-disc pl-4 space-y-1">
                                  {persona.pains.map((pain, i) => (
                                    <li key={i}>{pain}</li>
                                  ))}
                                </ul>
                              </div>
                              
                              <div>
                                <Label className="text-[#74d1ea] text-xs mb-1 flex items-center">
                                  <Lightbulb className="h-3.5 w-3.5 mr-1" />
                                  Key Goals
                                </Label>
                                <ul className="text-gray-300 text-xs list-disc pl-4 space-y-1">
                                  {persona.goals.map((goal, i) => (
                                    <li key={i}>{goal}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        {/* Empty state when using AI personas but none are generated yet */}
                        {useGeneratedPersonas && generatedPersonas.length === 0 && (
                          <div className="col-span-3 border border-dashed border-gray-700 rounded-lg p-8 text-center">
                            <Sparkles className="h-10 w-10 text-[#74d1ea] mb-3 mx-auto opacity-70" />
                            <p className="text-gray-300 mb-2">No AI personas generated yet</p>
                            <p className="text-xs text-gray-500 mb-4">Generate personas based on your campaign brief to see them here</p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Step 3: Additional Settings */}
                    <div className="bg-gray-900/30 rounded-lg p-5">
                      <h3 className="text-white font-medium mb-4 flex items-center">
                        <div className="flex items-center justify-center h-9 w-9 rounded-md bg-gradient-to-br from-[#74d1ea]/20 to-[#74d1ea]/5 mr-3">
                          <SlidersHorizontal className="h-5 w-5 text-[#74d1ea]" />
                        </div>
                        Step 3: Finishing Touches
                      </h3>
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-black/40 rounded-md p-5">
                          <Label className="text-white mb-4 block font-medium">Campaign Timeline</Label>
                          <div className="space-y-4">
                            <div>
                              <div className="flex justify-between items-center mb-1">
                                <Label htmlFor="start-date" className="text-sm text-gray-300">
                                  Start Date
                                </Label>
                              </div>
                              <Input 
                                id="start-date" 
                                type="date" 
                                className="bg-black border-gray-700 text-white"
                                value={campaignStartDate}
                                onChange={(e) => setCampaignStartDate(e.target.value)}
                              />
                            </div>
                            
                            <div>
                              <div className="flex justify-between items-center mb-1">
                                <Label htmlFor="end-date" className="text-sm text-gray-300">
                                  End Date
                                </Label>
                              </div>
                              <Input 
                                id="end-date" 
                                type="date" 
                                className="bg-black border-gray-700 text-white"
                                value={campaignEndDate}
                                onChange={(e) => setCampaignEndDate(e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <div className="bg-black/40 rounded-md p-5">
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="text-white text-sm font-medium">Include tone analysis</span>
                                <p className="text-xs text-gray-400">Apply your brand's tone from previous analyses</p>
                              </div>
                              <Switch defaultChecked />
                            </div>
                            <div className="mt-3">
                              <Label htmlFor="tone-selection" className="text-xs text-gray-400 mb-1 block">Select tone analysis</Label>
                              {isLoadingToneAnalyses ? (
                                <div className="flex items-center justify-center py-2">
                                  <Loader2 className="h-4 w-4 text-gray-400 animate-spin" />
                                </div>
                              ) : !toneAnalyses || toneAnalyses.length === 0 ? (
                                <div className="text-xs text-amber-500 py-2">
                                  No tone analyses available. Please perform a tone analysis in the Tone Analysis section first.
                                </div>
                              ) : (
                                <Select 
                                  value={selectedToneAnalysisId}
                                  onValueChange={(value) => setSelectedToneAnalysisId(value)}
                                >
                                  <SelectTrigger id="tone-selection" className="w-full bg-black border-gray-700 text-white h-9">
                                    <SelectValue placeholder="Select a tone analysis"/>
                                  </SelectTrigger>
                                  <SelectContent className="bg-black border-gray-700 text-white">
                                    {toneAnalyses.map((analysis) => (
                                      <SelectItem key={analysis.id} value={analysis.id.toString()}>
                                        {analysis.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              )}
                            </div>
                          </div>
                          <div className="bg-black/40 rounded-md p-5">
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="text-white text-sm font-medium">Generate all deliverables</span>
                                <p className="text-xs text-gray-400">Create full content for all campaign pieces</p>
                              </div>
                              <Switch defaultChecked />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

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
                              <span className="text-[#74d1ea] text-sm">Phase 3: Engagement & Follow-up</span>
                              <p className="text-white mt-0.5">June 15 - July 5, 2025</p>
                              <p className="text-gray-400 text-sm mt-1">Targeted follow-ups, social media amplification, blog content promotion</p>
                            </div>
                          </div>
                          
                          <div className="relative">
                            <div className="absolute -left-8 mt-1 w-3 h-3 rounded-full bg-[#74d1ea]/40"></div>
                            <div>
                              <span className="text-[#74d1ea] text-sm">Phase 4: Conversion Focus</span>
                              <p className="text-white mt-0.5">July 5 - July 15, 2025</p>
                              <p className="text-gray-400 text-sm mt-1">Final outreach, limited-time offers, decision facilitation</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Campaign Content by Type */}
                    <div>
                      <h3 className="text-lg font-medium text-white mb-4 flex items-center">
                        <FileText className="h-5 w-5 mr-2 text-[#74d1ea]" />
                        Campaign Deliverables
                      </h3>
                      
                      <div className="space-y-6">
                        {/* Group content by type */}
                        {(campaign.contents.some(c => c.type === "email")) && (
                          <div>
                            <h4 className="text-white font-medium mb-3 flex items-center">
                              <MessageSquare className="h-4 w-4 mr-2 text-[#74d1ea]" />
                              Email
                            </h4>
                            
                            <div className="grid sm:grid-cols-2 gap-4">
                              {campaign.contents
                                .filter(content => content.type === "email")
                                .map(content => (
                                  <div key={content.id} className="border border-gray-700/60 rounded-lg p-4 bg-black/90">
                                    <div className="flex justify-between items-start mb-3">
                                      <div>
                                        <Badge variant="outline" className="bg-gray-800/80 text-gray-300 mb-2">
                                          For: {content.persona}
                                        </Badge>
                                        <h5 className="text-white font-medium">{content.title}</h5>
                                      </div>
                                      <Button variant="ghost" className="h-8 w-8 p-0" onClick={() => {
                                        toast({
                                          title: "Copied to clipboard",
                                          description: "Email content has been copied to your clipboard",
                                        });
                                      }}>
                                        <Copy className="h-4 w-4" />
                                      </Button>
                                    </div>
                                    
                                    <div className="mb-2">
                                      <Label className="text-xs text-gray-400">Scheduled Date</Label>
                                      <p className="text-gray-300 text-sm flex items-center">
                                        <Calendar className="h-3.5 w-3.5 mr-1.5" />
                                        {content.deliveryDate}
                                      </p>
                                    </div>
                                    
                                    <pre className="text-gray-300 text-xs leading-relaxed overflow-auto p-2 border border-gray-800 rounded-md bg-gray-900/50 max-h-[200px]">
                                      {content.content}
                                    </pre>
                                  </div>
                                ))}
                            </div>
                          </div>
                        )}
                        
                        {(campaign.contents.some(c => c.type === "social")) && (
                          <div>
                            <h4 className="text-white font-medium mb-3 flex items-center">
                              <FileText className="h-4 w-4 mr-2 text-[#74d1ea]" />
                              LinkedIn
                            </h4>
                            
                            <div className="grid sm:grid-cols-2 gap-4">
                              {campaign.contents
                                .filter(content => content.type === "social")
                                .map(content => (
                                  <div key={content.id} className="border border-gray-700/60 rounded-lg p-4 bg-black/90">
                                    <div className="flex justify-between items-start mb-3">
                                      <div>
                                        <div className="flex space-x-2 mb-2">
                                          <Badge variant="outline" className="bg-gray-800/80 text-gray-300">
                                            For: {content.persona}
                                          </Badge>
                                          <Badge variant="outline" className="bg-gray-800/80 text-gray-300">
                                            {content.channel}
                                          </Badge>
                                        </div>
                                        <h5 className="text-white font-medium">{content.title}</h5>
                                      </div>
                                      <Button variant="ghost" className="h-8 w-8 p-0" onClick={() => {
                                        toast({
                                          title: "Copied to clipboard",
                                          description: "LinkedIn post content has been copied to your clipboard",
                                        });
                                      }}>
                                        <Copy className="h-4 w-4" />
                                      </Button>
                                    </div>
                                    
                                    <div className="mb-2">
                                      <Label className="text-xs text-gray-400">Scheduled Date</Label>
                                      <p className="text-gray-300 text-sm flex items-center">
                                        <Calendar className="h-3.5 w-3.5 mr-1.5" />
                                        {content.deliveryDate}
                                      </p>
                                    </div>
                                    
                                    <pre className="text-gray-300 text-xs leading-relaxed overflow-auto p-2 border border-gray-800 rounded-md bg-gray-900/50 max-h-[200px]">
                                      {content.content}
                                    </pre>
                                  </div>
                                ))}
                            </div>
                          </div>
                        )}
                        
                        {(campaign.contents.some(c => c.type === "blog")) && (
                          <div>
                            <h4 className="text-white font-medium mb-3 flex items-center">
                              <FileText className="h-4 w-4 mr-2 text-[#74d1ea]" />
                              Blog
                            </h4>
                            
                            <div className="grid sm:grid-cols-1 gap-4">
                              {campaign.contents
                                .filter(content => content.type === "blog")
                                .map(content => (
                                  <div key={content.id} className="border border-gray-700/60 rounded-lg p-4 bg-black/90">
                                    <div className="flex justify-between items-start mb-3">
                                      <div>
                                        <Badge variant="outline" className="bg-gray-800/80 text-gray-300 mb-2">
                                          For: {content.persona}
                                        </Badge>
                                        <h5 className="text-white font-medium">{content.title}</h5>
                                      </div>
                                      <Button variant="ghost" className="h-8 w-8 p-0" onClick={() => {
                                        toast({
                                          title: "Copied to clipboard",
                                          description: "Blog content has been copied to your clipboard",
                                        });
                                      }}>
                                        <Copy className="h-4 w-4" />
                                      </Button>
                                    </div>
                                    
                                    <div className="mb-2">
                                      <Label className="text-xs text-gray-400">Scheduled Date</Label>
                                      <p className="text-gray-300 text-sm flex items-center">
                                        <Calendar className="h-3.5 w-3.5 mr-1.5" />
                                        {content.deliveryDate}
                                      </p>
                                    </div>
                                    
                                    <pre className="text-gray-300 text-xs leading-relaxed overflow-auto p-2 border border-gray-800 rounded-md bg-gray-900/50 max-h-[400px]">
                                      {content.content}
                                    </pre>
                                  </div>
                                ))}
                            </div>
                          </div>
                        )}
                        
                        {(campaign.contents.some(c => c.type === "webinar")) && (
                          <div>
                            <h4 className="text-white font-medium mb-3 flex items-center">
                              <PlayCircle className="h-4 w-4 mr-2 text-[#74d1ea]" />
                              Webinar
                            </h4>
                            
                            <div className="grid sm:grid-cols-1 gap-4">
                              {campaign.contents
                                .filter(content => content.type === "webinar")
                                .map(content => (
                                  <div key={content.id} className="border border-gray-700/60 rounded-lg p-4 bg-black/90">
                                    <div className="flex justify-between items-start mb-3">
                                      <div>
                                        <Badge variant="outline" className="bg-gray-800/80 text-gray-300 mb-2">
                                          For: {content.persona}
                                        </Badge>
                                        <h5 className="text-white font-medium">{content.title}</h5>
                                      </div>
                                      <Button variant="ghost" className="h-8 w-8 p-0" onClick={() => {
                                        toast({
                                          title: "Copied to clipboard",
                                          description: "Webinar content has been copied to your clipboard",
                                        });
                                      }}>
                                        <Copy className="h-4 w-4" />
                                      </Button>
                                    </div>
                                    
                                    <div className="mb-2">
                                      <Label className="text-xs text-gray-400">Scheduled Date</Label>
                                      <p className="text-gray-300 text-sm flex items-center">
                                        <Calendar className="h-3.5 w-3.5 mr-1.5" />
                                        {content.deliveryDate}
                                      </p>
                                    </div>
                                    
                                    <pre className="text-gray-300 text-xs leading-relaxed overflow-auto p-2 border border-gray-800 rounded-md bg-gray-900/50 max-h-[400px]">
                                      {content.content}
                                    </pre>
                                  </div>
                                ))}
                            </div>
                          </div>
                        )}
                        

                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-4 pt-4">
                      <Button 
                        variant="outline" 
                        className="border-[#74d1ea] text-[#74d1ea] hover:bg-[#74d1ea]/10"
                        onClick={handleSaveCampaign}
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save Campaign
                      </Button>
                      
                      <Button 
                        className="bg-[#74d1ea] hover:bg-[#5db8d0] text-black shadow-[0_0_10px_rgba(116,209,234,0.4)]"
                        onClick={handleAddToCampaignHub}
                      >
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Add to Campaign Hub
                      </Button>
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