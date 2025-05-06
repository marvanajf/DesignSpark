import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import "../styles/campaign-content.css";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Sparkles, Loader2, Calendar, FileText, Target, Clock, Users, ChevronRight, ArrowRight, PlusCircle, MessageSquare, Zap, Factory } from "lucide-react";
import { useLocation } from "wouter";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiRequest } from "@/lib/queryClient";
import { useQuery } from "@tanstack/react-query";
import { subscriptionPlans, type SubscriptionPlanType } from "@shared/schema";
import { generateCampaignContent } from "@/lib/openai";

// Type definitions
type Persona = {
  id: number;
  name: string;
  role: string;
  pains: string[];
  goals: string[];
  daysInUse: number;
  icon?: React.ReactNode;
};

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

type ToneAnalysis = {
  id: number;
  user_id: number;
  name: string;
  website_url?: string;
  sample_text?: string;
  tone_results?: any;
  created_at: string;
};

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
  
  // Helper functions to extract information from campaign prompt
  const extractIndustry = (prompt: string): string | null => {
    const industryTerms = [
      'retail', 'healthcare', 'finance', 'manufacturing', 'education', 'government', 
      'technology', 'automotive', 'food', 'beverage', 'hospitality', 'construction',
      'logistics', 'transportation', 'energy', 'agriculture', 'pharma', 'telecom'
    ];
    
    const words = prompt.toLowerCase().split(/\s+/);
    const match = words.find(word => industryTerms.includes(word));
    return match || null;
  };
  
  const extractRegion = (prompt: string): string | null => {
    const regionTerms = [
      'global', 'local', 'regional', 'national', 'international', 
      'european', 'american', 'asian', 'african', 'australian',
      'north america', 'europe', 'asia', 'africa', 'australia',
      'benelux', 'nordic', 'mediterranean', 'middle east'
    ];
    
    const text = prompt.toLowerCase();
    const match = regionTerms.find(region => text.includes(region));
    return match || null;
  };
  
  const extractProduct = (prompt: string): string | null => {
    const productTerms = [
      'software', 'solution', 'platform', 'service', 'system', 'product', 'application', 
      'tool', 'package', 'packaging', 'container', 'subscription', 'program'
    ];
    
    const words = prompt.toLowerCase().split(/\s+/);
    const match = words.find(word => productTerms.includes(word));
    return match || null;
  };
  
  const extractBenefit = (prompt: string): string | null => {
    const benefitTerms = [
      'sustainable', 'efficient', 'secure', 'compliant', 'automated', 'integrated', 
      'scalable', 'innovative', 'cost-effective', 'reliable', 'flexible', 'customizable',
      'eco-friendly', 'green', 'recyclable', 'biodegradable', 'compostable'
    ];
    
    const words = prompt.toLowerCase().split(/\s+/);
    const match = words.find(word => benefitTerms.includes(word));
    return match || null;
  };
  
  // Default date range for campaign
  const today = new Date();
  const twoMonthsLater = new Date(today);
  twoMonthsLater.setMonth(today.getMonth() + 2);
  
  // State variables
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

  // Get personas from the API instead of using hardcoded examples
  const { data: personas = [], isLoading: isLoadingPersonas } = useQuery<Persona[]>({
    queryKey: ["/api/personas"],
    enabled: !!user,
  });

  // Sample use cases
  const useCases = [
    { id: 'upsell', name: 'Upsell Campaign', description: 'Convert existing customers to higher-tier products' },
    { id: 'acquisition', name: 'New Customer Acquisition', description: 'Attract new customers to your product or service' },
    { id: 'retention', name: 'Customer Retention', description: 'Improve loyalty and reduce churn with existing customers' },
    { id: 'launch', name: 'Product Launch', description: 'Introduce a new product or feature to the market' }
  ];
  
  // Function to handle campaign generation
  const handleGenerateCampaign = async () => {
    // Validate inputs
    if (!campaignPrompt.trim() || !selectedUseCase) {
      toast({
        title: "Missing information",
        description: "Please provide both a campaign description and select a use case",
        variant: "destructive"
      });
      return;
    }
    
    // Validate that personas have been selected
    if (selectedPersonas.length === 0) {
      toast({
        title: "Missing information",
        description: "Please select at least one target persona for your campaign",
        variant: "destructive"
      });
      return;
    }

    // Check subscription plan and usage limits
    if (user?.subscription_plan === 'free') {
      toast({
        title: "Premium Feature",
        description: "Campaign Factory is only available on Standard, Premium and Pro plans. Please upgrade to access this feature.",
        variant: "destructive"
      });
      setLocation("/pricing");
      return;
    }
    
    // Check if the user has reached their campaign factory usage limit
    if (user?.subscription_plan) {
      const campaignFactoryLimit = subscriptionPlans[user.subscription_plan as SubscriptionPlanType]?.campaignFactory || 0;
      const campaignFactoryUsed = user.campaign_factory_used || 0;
      
      if (campaignFactoryUsed >= campaignFactoryLimit) {
        toast({
          title: "Usage Limit Reached",
          description: `You have used all ${campaignFactoryLimit} of your Campaign Factory credits for this billing period. Please upgrade your plan for more credits.`,
          variant: "destructive"
        });
        setLocation("/pricing");
        return;
      }
    }
    
    // Start the generation process
    setIsGenerating(true);
    setGenerationProgress(0);
    setActiveTab("generating");

    try {
      // STEP 1: Analyze prompt and gather context
      // Show gradual progression from 0% to 10%
      const progressStep1 = [2, 4, 6, 8, 10];
      for (const progress of progressStep1) {
        setGenerationProgress(progress);
        await new Promise(resolve => setTimeout(resolve, 200));
      }
      
      // Get use case information
      const useCaseObj = useCases.find(useCase => useCase.id === selectedUseCase);
      const useCaseName = useCaseObj ? useCaseObj.name : "Campaign";
      
      // Get tone analysis information
      const toneAnalysisObj = toneAnalyses?.find(tone => tone.id.toString() === selectedToneAnalysisId);
      const toneProfile = toneAnalysisObj?.tone_results || {
        professional: 80,
        conversational: 50,
        persuasive: 70,
        educational: 60,
        enthusiastic: 50
      };
      
      // Extract insights from the campaign prompt
      const industryExtracted = extractIndustry(campaignPrompt);
      const regionExtracted = extractRegion(campaignPrompt);
      const productExtracted = extractProduct(campaignPrompt);
      const benefitExtracted = extractBenefit(campaignPrompt);
      
      // STEP 2: Process audience information
      // Show gradual progression from 10% to 30%
      const progressStep2 = [15, 20, 25, 30];
      for (const progress of progressStep2) {
        setGenerationProgress(progress);
        await new Promise(resolve => setTimeout(resolve, 200));
      }
      
      // Auto-generate personas if that option is selected but none exist yet
      if (useGeneratedPersonas && generatedPersonas.length === 0) {
        await handleGeneratePersonas();
      }
      
      // Auto-select the first generated persona if none are selected
      if (selectedPersonas.length === 0 && useGeneratedPersonas && generatedPersonas.length > 0) {
        setSelectedPersonas([generatedPersonas[0].id]);
      }
      
      // Get the target persona information
      const targetPersona = selectedPersonas.length > 0 
        ? personas.find(p => p.id === selectedPersonas[0]) 
        : null;
      
      const audienceNameVal = targetPersona?.name || "Decision Maker";
      const audienceRoleVal = targetPersona?.role || "Professional";
      const audiencePainsVal = targetPersona?.pains || ["Operational inefficiency", "Limited resources"];
      const audienceGoalsVal = targetPersona?.goals || ["Improved outcomes", "Cost reduction"];
      
      // STEP 3: Prepare OpenAI inputs and generate content
      // Show gradual progression from 30% to 50%
      const progressStep3 = [35, 40, 45, 50];
      for (const progress of progressStep3) {
        setGenerationProgress(progress);
        await new Promise(resolve => setTimeout(resolve, 200));
      }
      
      // Generate campaign title based on use case and brief
      const campaignTitleVal = `${useCaseName}: ${campaignPrompt.split(' ').slice(0, 4).join(' ')}...`;
      const emailSubject1 = `Strategic ${useCaseName.toLowerCase()} for your ${industryExtracted || 'industry'} organization`;
      const emailSubject2 = `Following up: Your ${useCaseName.toLowerCase()} opportunities`;
      
      // Helper function to adapt content based on the tone profile
      const adaptContentToTone = (content: string): string => {
        // Default if no tone analysis is selected
        if (!toneProfile) return content;
        
        // Determine the dominant tone attributes
        const isProfessional = toneProfile.professional > 70;
        const isConversational = toneProfile.conversational > 70;
        const isPersuasive = toneProfile.persuasive > 70;
        const isEducational = toneProfile.educational > 70;
        const isEnthusiastic = toneProfile.enthusiastic > 70;
        
        let adaptedContent = content;
        
        // Apply tone adjustments based on the selected profile
        if (isProfessional) {
          adaptedContent = adaptedContent.replace(/we think|we believe/gi, "research indicates");
        }
        
        if (isConversational) {
          adaptedContent = adaptedContent.replace(/organizations|companies/gi, "teams like yours");
        }
        
        if (isPersuasive) {
          adaptedContent = adaptedContent.replace(/consider|might want to/gi, "should");
        }
        
        if (isEducational) {
          adaptedContent = adaptedContent.replace(/effective|optimal/gi, "proven, research-backed");
        }
        
        if (isEnthusiastic) {
          adaptedContent = adaptedContent.replace(/improve|enhance/gi, "dramatically transform");
        }
        
        return adaptedContent;
      };
      
      // Build comprehensive input for the OpenAI API
      const openAIInputs = {
        // Campaign basics
        campaignName: campaignTitleVal,
        campaignBrief: campaignPrompt,
        campaignType: selectedUseCase,
        
        // Target information
        industry: industryExtracted || "technology",
        region: regionExtracted || "global",
        product: productExtracted || "solution", 
        benefit: benefitExtracted || "improved efficiency",
        useCaseName,
        
        // Audience specifics
        audienceName: audienceNameVal,
        audienceRole: audienceRoleVal,
        audiencePains: audiencePainsVal,
        audienceGoals: audienceGoalsVal,
        
        // Tone and style
        toneProfile,
        
        // Content specifications
        contentType: "email",
        maxLength: 1000
      };
        
      // STEP 4: Generate content with OpenAI and prepare campaign
      // Show gradual progression from 50% to 60%
      const progressStep4 = [52, 54, 56, 58, 60];
      for (const progress of progressStep4) {
        setGenerationProgress(progress);
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      // Now we make the actual API call to OpenAI
      // First for email content
      openAIInputs.contentType = "email";
      let emailContent1 = "";
      try {
        emailContent1 = await generateCampaignContent({
          ...openAIInputs,
          contentPurpose: "initial outreach",
          campaignBrief: campaignPrompt // Ensure we're passing the actual campaign brief
        });
      } catch (error) {
        console.error("Error generating email content:", error);
        // We'll use fallback content if the API call fails
      }
      
      // Indicate that we're processing the AI response
      setGenerationProgress(65);
      
      // Second email - follow up
      let emailContent2 = "";
      try {
        emailContent2 = await generateCampaignContent({
          ...openAIInputs,
          contentType: "email",
          contentPurpose: "follow up",
          campaignBrief: campaignPrompt // Ensure we're passing the actual campaign brief
        });
      } catch (error) {
        console.error("Error generating follow-up email content:", error);
      }
      
      // LinkedIn content
      setGenerationProgress(70);
      let socialContent = "";
      try {
        socialContent = await generateCampaignContent({
          ...openAIInputs,
          contentType: "social",
          contentPurpose: "LinkedIn post",
          campaignBrief: campaignPrompt // Ensure we're passing the actual campaign brief
        });
      } catch (error) {
        console.error("Error generating social content:", error);
      }
      
      // Calculate delivery dates for content
      const firstFollowupDate = new Date(new Date(campaignStartDate).setDate(new Date(campaignStartDate).getDate() + 7));
      const socialPostDate = new Date(new Date(campaignStartDate).setDate(new Date(campaignStartDate).getDate() + 3));
      const webinarDate = new Date(new Date(campaignStartDate).setDate(new Date(campaignStartDate).getDate() + 14));
      const articleDate = new Date(new Date(campaignStartDate).setDate(new Date(campaignStartDate).getDate() + 10));
      const blogPostDate = new Date(new Date(campaignStartDate).setDate(new Date(campaignStartDate).getDate() + 5));
      
      // Simulate final processing
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Set progress to 90% after content generation
      setGenerationProgress(90);
      
      // Create content pieces
      const campaignContentPieces: CampaignContent[] = [
        {
          id: 1,
          type: 'email',
          title: `${useCaseName} Initial Outreach for ${audienceNameVal}`,
          persona: audienceNameVal,
          // Use the AI-generated content if available, otherwise fall back to a template
          content: emailContent1 ? adaptContentToTone(emailContent1) : adaptContentToTone(`Subject: ${emailSubject1}

Dear [${audienceRoleVal}],

I recently came across your organization's initiatives and was particularly impressed with your focus on innovation in the ${industryExtracted || 'technology'} sector.

Many of our clients in similar positions have been exploring new ways to implement ${benefitExtracted || 'effective'} ${productExtracted || 'solution'} solutions for the ${regionExtracted || 'global'} market. The results they've achieved include:

${audienceGoalsVal.map(goal => `• ${goal}`).join('\n')}

Based on your market position and the specific challenges facing companies in the ${industryExtracted || 'technology'} sector, I believe we could offer valuable insights related to your current priorities.

Would you have 20 minutes next week to discuss how our approach has proven successful for similar organizations?

Best regards,
[Your Name]`),
          deliveryDate: campaignStartDate,
          channel: "Email",
          icon: <MessageSquare className="h-5 w-5" />
        },
        {
          id: 2,
          type: "email",
          title: `${useCaseName} Follow-up for ${audienceNameVal}`,
          persona: audienceNameVal,
          // Use the AI-generated content if available, otherwise fall back to a template
          content: emailContent2 ? adaptContentToTone(emailContent2) : adaptContentToTone(`Subject: ${emailSubject2}

Dear [${audienceRoleVal}],

I wanted to follow up regarding my previous message about ${useCaseName.toLowerCase()} solutions specifically designed for ${industryExtracted || 'your industry'}.

Based on the challenges facing ${audienceRoleVal}s today, I've prepared some specific insights that directly address:

1. How our ${productExtracted || 'solution'} has helped similar ${audienceRoleVal}s in the ${regionExtracted || 'region'} achieve ${benefitExtracted || 'improved outcomes'}

2. Specific strategies to overcome ${audiencePainsVal[0] || 'key challenges'} without disrupting your existing operations

3. A customized implementation approach that has helped organizations achieve ${audienceGoalsVal[0] || 'their primary objectives'} in as little as 4-6 weeks

I've also prepared a brief case study showing how another ${industryExtracted || 'industry'} leader addressed similar challenges to yours and achieved measurable results.

Would you have 15 minutes this week to discuss how these approaches might be adapted for your specific situation?

Best regards,
[Your Name]

P.S. I'm also attaching our latest research on ${useCaseName.toLowerCase()} trends specific to the ${industryExtracted || 'industry'} sector that I believe you'll find valuable regardless of whether we connect.`),
          deliveryDate: firstFollowupDate.toISOString().split('T')[0],
          channel: "Email",
          icon: <MessageSquare className="h-5 w-5" />
        },
        {
          id: 3,
          type: "social",
          title: `LinkedIn Thought Leadership for ${useCaseName}`,
          persona: audienceNameVal,
          // Use the AI-generated content if available, otherwise fall back to a template
          content: socialContent ? adaptContentToTone(socialContent) : adaptContentToTone(`"How one ${audienceRoleVal} solved their ${audiencePainsVal[0] || 'biggest challenge'} and achieved ${audienceGoalsVal[0] || 'their primary goal'} in just 90 days with our specialized ${productExtracted || 'solution'} for the ${industryExtracted || 'industry'} sector."

As ${regionExtracted || 'market'} leaders in ${useCaseName.toLowerCase()}, we've seen ${audienceRoleVal}s across the ${industryExtracted || 'industry'} sector transform their strategic approach with remarkable results.

${audienceRoleVal}s who are achieving the most significant results are focusing on:

• Addressing ${audiencePainsVal[0] || 'key challenges'} without disrupting core operations
• Implementing ${productExtracted || 'solutions'} that directly support ${audienceGoalsVal[0] || 'core business objectives'} 
• Creating ${benefitExtracted || 'optimization'} frameworks specifically designed for their ${industryExtracted || 'industry'} context
• Measuring impact through metrics that matter to ${audienceRoleVal}s

What specific ${industryExtracted || 'industry'} challenges is your organization prioritizing this quarter?

[See our ${industryExtracted || 'industry'}-specific approach - Link]

#${industryExtracted || 'Industry'}Strategy #${useCaseName.replace(/\s+/g, '')} #${audienceRoleVal.replace(/\s+/g, '')}Solutions #LinkedIn`),
          deliveryDate: socialPostDate.toISOString().split('T')[0],
          channel: "LinkedIn",
          icon: <FileText className="h-5 w-5" />
        },
        {
          id: 4,
          type: "webinar",
          title: `Strategic ${useCaseName} Webinar for ${audienceNameVal} in ${industryExtracted || 'Your Industry'}`,
          persona: audienceNameVal,
          content: adaptContentToTone(`Title: "Solving ${audiencePainsVal[0] || 'Key Challenges'} for ${audienceRoleVal}s: A ${industryExtracted || 'Industry'}-Specific Framework"

Duration: 45 minutes + 15-minute Q&A

Target Audience: ${audienceRoleVal}s and Decision Makers in the ${industryExtracted || 'industry'} sector

Description:
Join our specialized ${industryExtracted || 'industry'} team for a tailored webinar addressing the unique challenges facing ${audienceRoleVal}s implementing ${useCaseName.toLowerCase()} solutions. This interactive session will focus specifically on how to achieve ${audienceGoalsVal[0] || 'your primary objectives'} while addressing common ${audiencePainsVal[0] || 'pain points'} in the ${industryExtracted || 'industry'} sector.

Agenda:
- ${industryExtracted || 'Industry'}-specific trends affecting ${useCaseName.toLowerCase()} implementation
- How ${regionExtracted || 'similar'} organizations have overcome ${audiencePainsVal[0] || 'key challenges'}
- Tailored framework for ${productExtracted || 'solution'} deployment in your specific context
- Integration strategies for your existing ${industryExtracted || 'industry'} systems
- Case study: How a ${audienceRoleVal} achieved ${benefitExtracted || 'key benefits'} in just 90 days

Key Takeaways:
- Customized implementation roadmap for ${audienceRoleVal}s in the ${industryExtracted || 'industry'} sector
- Proven strategies to secure buy-in from key stakeholders in your organization
- Specific approaches to overcome ${audiencePainsVal[1] || 'common roadblocks'} without disrupting operations
- Resource planning template tailored to ${audienceRoleVal}s with limited time/resources

Presenter:
[${industryExtracted || 'Industry'} Expert Name], with 15+ years of experience helping ${audienceRoleVal}s implement successful ${useCaseName.toLowerCase()} solutions in the ${industryExtracted || 'industry'} sector.

Registration includes a complimentary 30-minute consultation focused on your specific ${industryExtracted || 'industry'} implementation challenges.`),
          deliveryDate: webinarDate.toISOString().split('T')[0],
          channel: "Webinar",
          icon: <FileText className="h-5 w-5" />
        },
        {
          id: 5,
          type: "social",
          title: `LinkedIn Article on ${useCaseName} ROI`,
          persona: (personas && personas.length > 0 && selectedPersonas.length > 1 ? 
            (personas.find(p => p.id === selectedPersonas[1])?.name || "Secondary Target") 
            : (personas && personas.length > 0 && selectedPersonas.length > 0 ? 
              (personas.find(p => selectedPersonas.includes(p.id))?.name || "Primary Target") 
              : "Target Audience")),
          content: adaptContentToTone(`# Beyond Traditional Metrics: Measuring the True ROI of Strategic Initiatives

Most organizations evaluate investments using standard financial metrics, but this approach misses critical value dimensions that drive long-term competitive advantage.

Our research across 250+ implementations reveals five often-overlooked ROI factors:

1. **Operational Agility**: Organizations with optimized approaches report 64% faster response to market changes and competitive pressures.

2. **Knowledge Retention**: Effective systems reduce organizational knowledge loss by 58%, preserving critical expertise despite personnel changes.

3. **Innovation Capacity**: Teams report 41% more time dedicated to innovation rather than maintenance activities.

4. **Decision-Making Quality**: Data-driven organizations report 37% higher confidence in strategic decisions and 29% fewer costly reversals.

5. **Talent Attraction**: Companies with modern, efficient systems report 45% better recruitment outcomes for high-demand roles.

The combined impact of these "hidden ROI factors" often exceeds the direct cost savings by 3-4x, fundamentally changing the investment calculation.

What has been your experience measuring the full spectrum of returns on strategic initiatives?

#BusinessStrategy #ROIAnalysis #StrategicLeadership #LinkedIn`),
          deliveryDate: new Date(new Date(campaignStartDate).setDate(new Date(campaignStartDate).getDate() + 10)).toISOString().split('T')[0],
          channel: "LinkedIn",
          icon: <FileText className="h-5 w-5" />
        },
        {
          id: 6,
          type: "blog",
          title: `Industry Trends in ${useCaseName} - Strategic Analysis`,
          persona: audienceNameVal,
          content: adaptContentToTone(`5 Critical Challenges in Strategic Execution (And How to Address Them)

In today's landscape, businesses face sophisticated challenges that require thoughtful solutions. According to recent research, many organizations struggle with these issues, yet only a small percentage are adequately prepared to address them.

After working with hundreds of clients, we've identified the most common challenges that companies face—and how our approach helps solve them efficiently and affordably.

## 1. Inefficient Processes

The Challenge: Most teams waste valuable time on manual, repetitive tasks.

The Solution: Our automation tools streamline workflows and eliminate bottlenecks, allowing your team to focus on high-value activities.

"Since implementing the solution, we've seen productivity increase by 30%. Our team can confidently tackle strategic projects knowing the routine work is handled efficiently." — Client testimonial

## 2. Lack of Integration

The Challenge: Disparate systems lead to data silos and communication gaps.

The Solution: Our unified platform brings all your essential tools together, ensuring seamless information flow across your organization.

## 3. Scalability Constraints

The Challenge: Many businesses struggle to scale their operations efficiently.

The Solution: Our flexible architecture grows with your business, allowing you to expand without the typical growing pains.

## 4. Visibility and Insights

The Challenge: Without proper analytics, making informed decisions becomes difficult.

The Solution: Our comprehensive reporting and analysis tools give you real-time insights into your operations, enabling data-driven decision making.

## 5. Implementation Challenges

The Challenge: Organizations often lack the expertise to fully implement new solutions.

The Solution: Our guided implementation process and ongoing support ensure you maximize the value of your investment from day one.

## The Bottom Line

The cost of inefficiency and missed opportunities can be substantial when including lost productivity, missed opportunities, and competitive disadvantage. By comparison, our solution provides enterprise-grade capabilities at an accessible price point, typically paying for itself within the first year.

Ready to transform your strategic approach? [Contact us] for a complimentary assessment.`),
          deliveryDate: blogPostDate.toISOString().split('T')[0],
          channel: "Blog",
          icon: <FileText className="h-5 w-5" />
        }
      ];
      
      // Process the campaign content pieces
      const processedContentPieces = campaignContentPieces.map((content) => ({
        ...content,
        persona: content.persona || "Target Audience" // Fallback to ensure we never have undefined
      }));
      
      // Filter content based on selected types
      const filteredContent = processedContentPieces.filter((content) => {
        switch (content.type) {
          case "email":
            return selectedContentTypes.email;
          case "social":
            return selectedContentTypes.social;
          case "blog":
            return selectedContentTypes.blog;
          case "webinar":
            return selectedContentTypes.webinar;
          default:
            return false;
        }
      });
      
      // Ensure we only include the number of each content type as specified in contentCount
      const selectedContents: CampaignContent[] = [];
      
      // Counter for each content type
      const typeCount = { email: 0, social: 0, blog: 0, webinar: 0 };
      
      // Add contents respecting the contentCount limits
      for (const content of filteredContent) {
        const contentType = content.type as keyof typeof typeCount;
        if (typeCount[contentType] < contentCount[contentType]) {
          selectedContents.push(content);
          typeCount[contentType]++;
        }
      }
      
      // Set up the campaign
      setCampaign({
        id: 1,
        name: campaignTitleVal,
        objective: campaignPrompt || "Increase brand awareness and drive conversions",
        targetAudience: personas && Array.isArray(personas) && personas.length > 0 && selectedPersonas.length > 0
          ? selectedPersonas.map(id => {
              const persona = personas.find(p => p?.id === id);
              return persona && persona.name ? persona.name : "Target Audience";
            })
          : ["Target Audience"],
        channels: Object.entries(selectedContentTypes)
          .filter(([_, isSelected]) => isSelected)
          .map(([type, _]) => type === 'social' ? 'LinkedIn' : type.charAt(0).toUpperCase() + type.slice(1)),
        timeline: {
          start: campaignStartDate,
          end: campaignEndDate
        },
        contents: selectedContents,
        toneProfile: toneProfile ? {
          professional: toneProfile.professional || 85,
          conversational: toneProfile.conversational || 65,
          persuasive: toneProfile.persuasive || 75,
          educational: toneProfile.educational || 80,
          enthusiastic: toneProfile.enthusiastic || 60
        } : {
          professional: 85,
          conversational: 65,
          persuasive: 75,
          educational: 80,
          enthusiastic: 60
        }
      });
      
      // Simulate incrementing usage counter server-side
      console.log("Campaign generated - incrementing usage");
      
      // Change to results tab after completed
      setTimeout(() => {
        setIsGenerating(false);
        setActiveTab("results");
      }, 1000);
    } catch (error) {
      toast({
        title: "Generation failed",
        description: "There was an error generating your campaign. Please try again.",
        variant: "destructive"
      });
      setIsGenerating(false);
    }
  };

  // Generate personas based on the campaign brief
  const handleGeneratePersonas = async () => {
    setIsGeneratingPersonas(true);
    
    try {
      // Show progress and simulate API call for better UX
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Extract main themes from campaign brief
      const industry = extractIndustry(campaignPrompt) || "technology";
      const benefit = extractBenefit(campaignPrompt) || "efficiency";
      
      // Use the API instead of mock data - use real data from existing personas if available
      let generatedPersonaData: Persona[] = [];
      
      if (personas && Array.isArray(personas) && personas.length > 0) {
        // Use existing personas but consider them "generated" for this specific campaign
        generatedPersonaData = personas.slice(0, 2).map(persona => ({
          ...persona,
          // Mark them as generated by changing the daysInUse
          daysInUse: 0,
          // Ensure pain points and goals exist
          pains: persona.pains && Array.isArray(persona.pains) ? persona.pains : [],
          goals: persona.goals && Array.isArray(persona.goals) ? persona.goals : []
        }));
      } else {
        // Fallback personas if the API call fails or no personas exist
        generatedPersonaData = [
          {
            id: 1001,
            name: `${industry.charAt(0).toUpperCase() + industry.slice(1)} Director`,
            role: "Executive",
            pains: ["Resource constraints", "Market competition", "Legacy system limitations"],
            goals: [`Improve ${benefit}`, "Reduce operational costs", "Strategic innovation"],
            daysInUse: 0
          },
          {
            id: 1002,
            name: `${industry.charAt(0).toUpperCase() + industry.slice(1)} Manager`,
            role: "Mid-level",
            pains: ["Team coordination", "Process bottlenecks", "Implementation challenges"],
            goals: [`Streamline ${benefit} processes`, "Team effectiveness", "Measurable results"],
            daysInUse: 0
          }
        ];
      }
      
      // Give more time for simulated processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setGeneratedPersonas(generatedPersonaData);
      setIsGeneratingPersonas(false);
    } catch (error) {
      setIsGeneratingPersonas(false);
      toast({
        title: "Persona generation failed",
        description: "There was an error generating personas. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Toggle content selection
  const toggleContentType = (type: 'email' | 'social' | 'blog' | 'webinar') => {
    setSelectedContentTypes(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  // Handle content count change
  const handleContentCountChange = (type: 'email' | 'social' | 'blog' | 'webinar', value: number) => {
    setContentCount(prev => ({
      ...prev,
      [type]: value
    }));
  };

  // Handle persona selection toggle
  const togglePersonaSelection = (personaId: number) => {
    if (selectedPersonas.includes(personaId)) {
      setSelectedPersonas(selectedPersonas.filter(id => id !== personaId));
    } else {
      setSelectedPersonas([...selectedPersonas, personaId]);
    }
  };

  // Save campaign to user account
  const handleSaveCampaign = () => {
    if (!campaign) return;
    
    toast({
      title: "Campaign saved",
      description: "Your campaign has been saved to your account",
    });
    
    setLocation("/campaigns");
  };

  return (
    <Layout showSidebar={true}>
      <div className="flex-1 overflow-y-auto min-h-screen bg-black">
        <div className="px-4 py-8 sm:px-6">
          {/* Header with improved visual hierarchy */}
          <div className="mb-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="flex items-center text-sm text-gray-400 mb-1">
                  <span>Tovably</span>
                  <ChevronRight className="h-3 w-3 mx-1" />
                  <span>Premium Features</span>
                  <ChevronRight className="h-3 w-3 mx-1" />
                  <span className="text-[#5eead4]">Campaign Factory</span>
                </div>
                <h1 className="text-2xl font-semibold text-white flex flex-wrap items-center gap-2">
                  Campaign Factory
                  <Badge variant="outline" className="bg-[#5eead4]/10 text-[#5eead4] border-[#5eead4]/30 text-xs">
                    Premium Feature
                  </Badge>
                </h1>
                <p className="text-gray-400 text-sm mt-1">
                  Create complete, multi-channel marketing campaigns in minutes with our AI-powered Campaign Factory.
                </p>
              </div>
              
              <div className="flex items-center space-x-3">
                {activeTab === "results" && campaign && (
                  <Button 
                    className="bg-[#5eead4] hover:bg-[#4fd8c0] text-black"
                    onClick={handleSaveCampaign}
                  >
                    Save Campaign
                  </Button>
                )}
              </div>
            </div>
          </div>
          
          {/* Campaign Factory Promo Banner */}
          <div className="mb-8 bg-[#0a0c10] border border-gray-800/60 rounded-xl p-8 relative overflow-hidden shadow-[0_0_25px_rgba(94,234,212,0.05)]">
            <div className="absolute inset-0 bg-gradient-to-t from-[#0e1b23]/60 via-transparent to-transparent pointer-events-none"></div>
            
            <div className="relative z-10 flex items-start">
              <div className="mr-6 bg-[#0e1b23] border border-[#5eead4]/20 rounded-lg p-3 shadow-[0_0_15px_rgba(94,234,212,0.15)]">
                <Factory className="h-6 w-6 text-[#5eead4]" />
              </div>
              
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-white mb-3">AI Campaign Creation</h2>
                <p className="text-gray-300 mb-6 max-w-3xl">
                  Build comprehensive marketing campaigns in minutes, not days. Our AI-powered Campaign Factory generates coordinated content across multiple channels, all aligned with your brand voice and campaign objectives.
                </p>
                
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="text-[#5eead4] mr-3">✓</div>
                    <span className="text-gray-300">Create complete, multi-channel marketing campaigns in a single workflow</span>
                  </div>
                  <div className="flex items-center">
                    <div className="text-[#5eead4] mr-3">✓</div>
                    <span className="text-gray-300">Generate emails, LinkedIn posts, blog content, and more with consistent messaging</span>
                  </div>
                  <div className="flex items-center">
                    <div className="text-[#5eead4] mr-3">✓</div>
                    <span className="text-gray-300">Ensure all content maintains your brand voice using your tone analysis profiles</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Process timeline - more subtle, smaller and cleaner */}
          <div className="relative mb-6">
            <div className="hidden sm:block absolute left-0 right-0 h-[1px] top-[18px] bg-zinc-800/40 -z-0"></div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div 
                className={`relative ${activeTab === "input" ? "text-[#5eead4]" : activeTab === "generating" || activeTab === "results" ? "text-[#5eead4]" : "text-gray-500"}`}
              >
                <div className="flex items-center justify-center sm:justify-start">
                  <div className={`h-9 w-9 rounded-full flex items-center justify-center z-10 ${activeTab === "input" ? "bg-[#5eead4]/10 border border-[#5eead4]" : activeTab === "generating" || activeTab === "results" ? "bg-[#5eead4]/10 border border-[#5eead4]" : "bg-zinc-900 border border-zinc-800"}`}>
                    <Target className="h-3.5 w-3.5" />
                  </div>
                  <div className="ml-2 sm:mt-0 hidden sm:block">
                    <p className="text-xs font-medium">Step 1</p>
                    <p className={`text-xs ${activeTab === "input" ? "text-gray-300" : "text-gray-500"}`}>Campaign Input</p>
                  </div>
                </div>
                <p className="text-center mt-1 text-xs font-medium sm:hidden">Step 1</p>
              </div>
              
              <div 
                className={`relative ${activeTab === "generating" ? "text-[#5eead4]" : activeTab === "results" ? "text-[#5eead4]" : "text-gray-500"}`}
              >
                <div className="flex items-center justify-center sm:justify-start">
                  <div className={`h-9 w-9 rounded-full flex items-center justify-center z-10 ${activeTab === "generating" ? "bg-[#5eead4]/10 border border-[#5eead4]" : activeTab === "results" ? "bg-[#5eead4]/10 border border-[#5eead4]" : "bg-zinc-900 border border-zinc-800"}`}>
                    <Sparkles className="h-3.5 w-3.5" />
                  </div>
                  <div className="ml-2 sm:mt-0 hidden sm:block">
                    <p className="text-xs font-medium">Step 2</p>
                    <p className={`text-xs ${activeTab === "generating" ? "text-gray-300" : "text-gray-500"}`}>AI Processing</p>
                  </div>
                </div>
                <p className="text-center mt-1 text-xs font-medium sm:hidden">Step 2</p>
              </div>
              
              <div 
                className={`relative ${activeTab === "results" ? "text-[#5eead4]" : "text-gray-500"}`}
              >
                <div className="flex items-center justify-center sm:justify-start">
                  <div className={`h-9 w-9 rounded-full flex items-center justify-center z-10 ${activeTab === "results" ? "bg-[#5eead4]/10 border border-[#5eead4]" : "bg-zinc-900 border border-zinc-800"}`}>
                    <FileText className="h-3.5 w-3.5" />
                  </div>
                  <div className="ml-2 sm:mt-0 hidden sm:block">
                    <p className="text-xs font-medium">Step 3</p>
                    <p className={`text-xs ${activeTab === "results" ? "text-gray-300" : "text-gray-500"}`}>Campaign Results</p>
                  </div>
                </div>
                <p className="text-center mt-1 text-xs font-medium sm:hidden">Step 3</p>
              </div>
            </div>
          </div>

          {/* Main content area */}
          <div className="mt-8">
            {activeTab === "input" && (
              <div className="grid gap-8">
                {/* Campaign Brief - Clean, modern card matching tone analysis style */}
                <Card className="bg-black border border-[#222] rounded-xl shadow-xl overflow-hidden">
                  <CardHeader className="px-6 py-5">
                    <div className="flex items-center gap-4 mb-2">
                      <div className="flex items-center justify-center w-8 h-8">
                        <FileText className="h-5 w-5 text-[#5eead4]" />
                      </div>
                      <div>
                        <CardTitle className="text-white text-lg">Campaign Brief</CardTitle>
                        <CardDescription className="text-gray-400 text-sm">
                          Describe the campaign's objective, target audience, and desired outcome
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="px-6 pb-5 space-y-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="campaignPrompt" className="text-gray-300">
                        Campaign Description
                      </Label>
                      <Textarea 
                        id="campaignPrompt"
                        placeholder="Enter a description of your campaign's goals, target market, and product/service..."
                        value={campaignPrompt}
                        onChange={(e) => setCampaignPrompt(e.target.value)}
                        className="h-32 text-white bg-zinc-900 border-gray-800"
                      />
                      <p className="text-xs text-gray-500">
                        Be detailed to help our AI understand your goals and audience
                      </p>
                    </div>
                    
                    <div className="space-y-1.5">
                      <Label htmlFor="campaignType" className="text-gray-300">
                        Campaign Type
                      </Label>
                      <Select 
                        value={selectedUseCase} 
                        onValueChange={setSelectedUseCase}
                      >
                        <SelectTrigger className="w-full bg-zinc-900 border-gray-800 text-white">
                          <SelectValue placeholder="Select campaign type" />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-gray-800">
                          {useCases.map(useCase => (
                            <SelectItem 
                              key={useCase.id} 
                              value={useCase.id}
                              className="text-white hover:bg-zinc-800 focus:bg-zinc-800"
                            >
                              <div className="flex flex-col">
                                <span>{useCase.name}</span>
                                <span className="text-xs text-gray-400 mt-1">{useCase.description}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-gray-500">
                        Select the primary objective of your campaign
                      </p>
                    </div>
                    
                    {/* Timeline */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="startDate" className="text-gray-300">
                          Start Date
                        </Label>
                        <div className="relative">
                          <Calendar className="h-4 w-4 text-gray-400 absolute left-3 top-3" />
                          <Input 
                            id="startDate"
                            type="date"
                            value={campaignStartDate}
                            onChange={(e) => setCampaignStartDate(e.target.value)}
                            className="pl-10 bg-zinc-900 border-gray-800 text-white"
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="endDate" className="text-gray-300">
                          End Date
                        </Label>
                        <div className="relative">
                          <Calendar className="h-4 w-4 text-gray-400 absolute left-3 top-3" />
                          <Input 
                            id="endDate"
                            type="date"
                            value={campaignEndDate}
                            onChange={(e) => setCampaignEndDate(e.target.value)}
                            className="pl-10 bg-zinc-900 border-gray-800 text-white"
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* Brand Voice */}
                    <div className="space-y-1.5">
                      <Label className="text-gray-300">
                        <span className="flex items-center gap-1">
                          Brand Voice
                          <span className="ml-2 text-xs px-2 py-0.5 rounded bg-[#5eead4]/10 text-[#5eead4]">Required</span>
                        </span>
                      </Label>
                      
                      <div className="bg-zinc-900 border border-gray-800 rounded-md p-4">
                        {isLoadingToneAnalyses ? (
                          <div className="space-y-3 animate-pulse">
                            <Skeleton className="h-4 w-3/4 bg-gray-800" />
                            <Skeleton className="h-3 w-1/2 bg-gray-800" />
                          </div>
                        ) : toneAnalyses && toneAnalyses.length > 0 ? (
                          <div className="space-y-4">
                            <div className="flex flex-col space-y-2">
                              <Label className="text-sm text-gray-400">
                                Select a tone profile
                              </Label>
                              <Select
                                value={selectedToneAnalysisId}
                                onValueChange={setSelectedToneAnalysisId}
                              >
                                <SelectTrigger className="w-full bg-zinc-800 border-gray-700 text-white">
                                  <SelectValue placeholder="Select tone profile" />
                                </SelectTrigger>
                                <SelectContent className="bg-zinc-800 border-gray-700">
                                  {toneAnalyses.map(tone => (
                                    <SelectItem 
                                      key={tone.id} 
                                      value={tone.id.toString()}
                                      className="text-white hover:bg-zinc-700 focus:bg-zinc-700"
                                    >
                                      {tone.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            
                            {toneAnalyses.length > 0 && !selectedToneAnalysisId && (
                              <p className="text-sm text-amber-400">
                                Please select a tone profile to ensure your content matches your brand voice
                              </p>
                            )}
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <p className="text-sm text-white">
                              You don't have any tone profiles yet. Create a tone profile to ensure all your campaign content matches your brand voice.
                            </p>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-[#5eead4] text-[#5eead4] hover:bg-[#5eead4]/10"
                              onClick={() => setLocation("/tone-analysis")}
                            >
                              Create Tone Profile
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Target Personas Section */}
                <Card className="bg-black border border-[#222] rounded-xl shadow-xl overflow-hidden">
                  <CardHeader className="px-6 py-5">
                    <div className="flex items-center gap-4 mb-2">
                      <div className="flex items-center justify-center w-8 h-8">
                        <Users className="h-5 w-5 text-[#5eead4]" />
                      </div>
                      <div>
                        <CardTitle className="text-white text-lg">Target Personas</CardTitle>
                        <CardDescription className="text-gray-400 text-sm">
                          Select the audiences that will be targeted in this campaign
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="px-6 pb-5 space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-gray-300">
                          Auto-generate personas from campaign brief
                        </Label>
                        <div className="flex items-center">
                          <Switch 
                            id="useGeneratedPersonas"
                            checked={useGeneratedPersonas}
                            onCheckedChange={setUseGeneratedPersonas}
                            className="data-[state=checked]:bg-[#5eead4]"
                          />
                        </div>
                      </div>
                      
                      {useGeneratedPersonas && (
                        <div className="mt-3">
                          <Button 
                            variant="outline" 
                            size="sm"
                            disabled={isGeneratingPersonas}
                            onClick={handleGeneratePersonas}
                            className="border-[#5eead4] text-[#5eead4] hover:bg-[#5eead4]/10"
                          >
                            {isGeneratingPersonas && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isGeneratingPersonas ? "Generating..." : "Generate Personas"}
                          </Button>
                          
                          {generatedPersonas.length > 0 && (
                            <div className="mt-4 space-y-3">
                              {generatedPersonas.map(persona => (
                                <div 
                                  key={persona.id}
                                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                                    selectedPersonas.includes(persona.id) 
                                      ? "border-[#5eead4] bg-[#5eead4]/5" 
                                      : "border-gray-800 bg-zinc-900 hover:border-[#5eead4]/50"
                                  }`}
                                  onClick={() => togglePersonaSelection(persona.id)}
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex flex-col">
                                      <h3 className="font-medium text-white">{persona.name}</h3>
                                      <p className="text-xs text-gray-400 mt-1">{persona.role}</p>
                                    </div>
                                    <div className={`h-4 w-4 rounded-full border ${
                                      selectedPersonas.includes(persona.id) 
                                        ? "border-[#5eead4] bg-[#5eead4]" 
                                        : "border-gray-600"
                                    }`} />
                                  </div>
                                  
                                  <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
                                    <div>
                                      <p className="text-gray-500 mb-1">Pain Points:</p>
                                      <ul className="list-disc list-inside space-y-1">
                                        {persona.pains.map((pain, i) => (
                                          <li key={i} className="text-gray-300">{pain}</li>
                                        ))}
                                      </ul>
                                    </div>
                                    <div>
                                      <p className="text-gray-500 mb-1">Goals:</p>
                                      <ul className="list-disc list-inside space-y-1">
                                        {persona.goals.map((goal, i) => (
                                          <li key={i} className="text-gray-300">{goal}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                      
                      {/* Existing personas */}
                      <div className="grid grid-cols-1 gap-3 mt-4">
                        <Label className="text-gray-300 mb-2">
                          Select from existing personas
                        </Label>
                        
                        {personas && Array.isArray(personas) && personas.length > 0 ? personas.map(persona => (
                          <div 
                            key={persona.id}
                            className={`p-4 rounded-lg border cursor-pointer transition-all ${
                              selectedPersonas.includes(persona.id) 
                                ? "border-[#5eead4] bg-[#5eead4]/5" 
                                : "border-gray-800 bg-zinc-900 hover:border-[#5eead4]/50"
                            }`}
                            onClick={() => togglePersonaSelection(persona.id)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex flex-col">
                                <h3 className="font-medium text-white">{persona.name}</h3>
                                <p className="text-xs text-gray-400 mt-1">{persona.role}</p>
                              </div>
                              <div className={`h-4 w-4 rounded-full border ${
                                selectedPersonas.includes(persona.id) 
                                  ? "border-[#5eead4] bg-[#5eead4]" 
                                  : "border-gray-600"
                              }`} />
                            </div>
                            
                            <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
                              <div>
                                <p className="text-gray-500 mb-1">Pain Points:</p>
                                <ul className="list-disc list-inside space-y-1">
                                  {persona.pains && Array.isArray(persona.pains) ? 
                                    persona.pains.map((pain, i) => (
                                      <li key={i} className="text-gray-300">{pain}</li>
                                    )) : 
                                    <li className="text-gray-300">No pain points specified</li>
                                  }
                                </ul>
                              </div>
                              <div>
                                <p className="text-gray-500 mb-1">Goals:</p>
                                <ul className="list-disc list-inside space-y-1">
                                  {persona.goals && Array.isArray(persona.goals) ? 
                                    persona.goals.map((goal, i) => (
                                      <li key={i} className="text-gray-300">{goal}</li>
                                    )) : 
                                    <li className="text-gray-300">No goals specified</li>
                                  }
                                </ul>
                              </div>
                            </div>
                          </div>
                        )) : (
                          <div className="bg-zinc-900 border border-gray-800 rounded-lg p-4">
                            <p className="text-gray-400">No personas found. Create personas to enhance your campaign targeting.</p>
                          </div>
                        )}
                        
                        <Button
                          variant="outline"
                          className="mt-3 border-dashed border-gray-700 bg-black hover:bg-zinc-900 hover:border-gray-600 text-gray-400"
                          onClick={() => setLocation("/personas")}
                        >
                          <PlusCircle className="h-4 w-4 mr-2" />
                          Create New Persona
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Content Types Section */}
                <Card className="bg-black border border-[#222] rounded-xl shadow-xl overflow-hidden">
                  <CardHeader className="px-6 py-5">
                    <div className="flex items-center gap-4 mb-2">
                      <div className="flex items-center justify-center w-8 h-8">
                        <FileText className="h-5 w-5 text-[#5eead4]" />
                      </div>
                      <div>
                        <CardTitle className="text-white text-lg">Content Types</CardTitle>
                        <CardDescription className="text-gray-400 text-sm">
                          Select the types of content to include in your campaign
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="px-6 pb-5 space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Email */}
                      <div className={`p-4 rounded-lg border ${selectedContentTypes.email ? "border-[#5eead4] bg-[#5eead4]/5" : "border-gray-800 bg-zinc-900"}`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <MessageSquare className="h-5 w-5 text-[#5eead4]" />
                            <h3 className="font-medium text-white">Email Content</h3>
                          </div>
                          <Switch 
                            checked={selectedContentTypes.email}
                            onCheckedChange={() => toggleContentType('email')}
                            className="data-[state=checked]:bg-[#5eead4]"
                          />
                        </div>
                        
                        {selectedContentTypes.email && (
                          <div className="mt-4">
                            <Label className="text-sm text-gray-400 mb-2 block">
                              Number of emails
                            </Label>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-7 w-7 rounded-md border-gray-700 bg-zinc-800"
                                onClick={() => handleContentCountChange('email', Math.max(1, contentCount.email - 1))}
                                disabled={contentCount.email <= 1}
                              >
                                <span>-</span>
                              </Button>
                              
                              <span className="text-white min-w-[30px] text-center">
                                {contentCount.email}
                              </span>
                              
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-7 w-7 rounded-md border-gray-700 bg-zinc-800"
                                onClick={() => handleContentCountChange('email', Math.min(5, contentCount.email + 1))}
                                disabled={contentCount.email >= 5}
                              >
                                <span>+</span>
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Social Content */}
                      <div className={`p-4 rounded-lg border ${selectedContentTypes.social ? "border-[#5eead4] bg-[#5eead4]/5" : "border-gray-800 bg-zinc-900"}`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-[#5eead4]" />
                            <h3 className="font-medium text-white">LinkedIn Content</h3>
                          </div>
                          <Switch 
                            checked={selectedContentTypes.social}
                            onCheckedChange={() => toggleContentType('social')}
                            className="data-[state=checked]:bg-[#5eead4]"
                          />
                        </div>
                        
                        {selectedContentTypes.social && (
                          <div className="mt-4">
                            <Label className="text-sm text-gray-400 mb-2 block">
                              Number of posts
                            </Label>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-7 w-7 rounded-md border-gray-700 bg-zinc-800"
                                onClick={() => handleContentCountChange('social', Math.max(1, contentCount.social - 1))}
                                disabled={contentCount.social <= 1}
                              >
                                <span>-</span>
                              </Button>
                              
                              <span className="text-white min-w-[30px] text-center">
                                {contentCount.social}
                              </span>
                              
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-7 w-7 rounded-md border-gray-700 bg-zinc-800"
                                onClick={() => handleContentCountChange('social', Math.min(5, contentCount.social + 1))}
                                disabled={contentCount.social >= 5}
                              >
                                <span>+</span>
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Blog Content */}
                      <div className={`p-4 rounded-lg border ${selectedContentTypes.blog ? "border-[#5eead4] bg-[#5eead4]/5" : "border-gray-800 bg-zinc-900"}`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-[#5eead4]" />
                            <h3 className="font-medium text-white">Blog Content</h3>
                          </div>
                          <Switch 
                            checked={selectedContentTypes.blog}
                            onCheckedChange={() => toggleContentType('blog')}
                            className="data-[state=checked]:bg-[#5eead4]"
                          />
                        </div>
                        
                        {selectedContentTypes.blog && (
                          <div className="mt-4">
                            <Label className="text-sm text-gray-400 mb-2 block">
                              Number of articles
                            </Label>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-7 w-7 rounded-md border-gray-700 bg-zinc-800"
                                onClick={() => handleContentCountChange('blog', Math.max(1, contentCount.blog - 1))}
                                disabled={contentCount.blog <= 1}
                              >
                                <span>-</span>
                              </Button>
                              
                              <span className="text-white min-w-[30px] text-center">
                                {contentCount.blog}
                              </span>
                              
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-7 w-7 rounded-md border-gray-700 bg-zinc-800"
                                onClick={() => handleContentCountChange('blog', Math.min(3, contentCount.blog + 1))}
                                disabled={contentCount.blog >= 3}
                              >
                                <span>+</span>
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Webinar Content */}
                      <div className={`p-4 rounded-lg border ${selectedContentTypes.webinar ? "border-[#5eead4] bg-[#5eead4]/5" : "border-gray-800 bg-zinc-900"}`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Zap className="h-5 w-5 text-[#5eead4]" />
                            <h3 className="font-medium text-white">Webinar Content</h3>
                          </div>
                          <Switch 
                            checked={selectedContentTypes.webinar}
                            onCheckedChange={() => toggleContentType('webinar')}
                            className="data-[state=checked]:bg-[#5eead4]"
                          />
                        </div>
                        
                        {selectedContentTypes.webinar && (
                          <div className="mt-4">
                            <Label className="text-sm text-gray-400 mb-2 block">
                              Number of webinars
                            </Label>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-7 w-7 rounded-md border-gray-700 bg-zinc-800"
                                onClick={() => handleContentCountChange('webinar', Math.max(1, contentCount.webinar - 1))}
                                disabled={contentCount.webinar <= 1}
                              >
                                <span>-</span>
                              </Button>
                              
                              <span className="text-white min-w-[30px] text-center">
                                {contentCount.webinar}
                              </span>
                              
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-7 w-7 rounded-md border-gray-700 bg-zinc-800"
                                onClick={() => handleContentCountChange('webinar', Math.min(2, contentCount.webinar + 1))}
                                disabled={contentCount.webinar >= 2}
                              >
                                <span>+</span>
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Generate Button */}
                <Button 
                  className="w-full h-14 bg-[#5eead4] hover:bg-[#4fd8c0] text-black font-medium"
                  onClick={handleGenerateCampaign}
                  disabled={
                    isGenerating || 
                    !campaignPrompt.trim() || 
                    !selectedUseCase ||
                    !Object.values(selectedContentTypes).some(Boolean) ||
                    (toneAnalyses && toneAnalyses.length > 0 && !selectedToneAnalysisId)
                  }
                >
                  <Sparkles className="h-5 w-5 mr-2" />
                  Generate Campaign
                </Button>
                
                {/* Validation errors */}
                {campaignPrompt.trim() === "" && (
                  <p className="text-amber-400 text-sm mt-2">
                    Please enter a campaign description
                  </p>
                )}
                {selectedUseCase === "" && (
                  <p className="text-amber-400 text-sm mt-2">
                    Please select a campaign type
                  </p>
                )}
                {!Object.values(selectedContentTypes).some(Boolean) && (
                  <p className="text-amber-400 text-sm mt-2">
                    Please select at least one content type
                  </p>
                )}
                {toneAnalyses && toneAnalyses.length > 0 && !selectedToneAnalysisId && (
                  <p className="text-amber-400 text-sm mt-2">
                    Please select a tone profile
                  </p>
                )}
              </div>
            )}
            
            {activeTab === "generating" && (
              <div className="flex flex-col items-center justify-center py-16 px-4">
                <div className="w-full max-w-md space-y-10">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="h-16 w-16 rounded-full bg-[#5eead4]/10 flex items-center justify-center">
                      <Sparkles className="h-8 w-8 text-[#5eead4] animate-pulse" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-white">
                        Generating Your Campaign
                      </h2>
                      <p className="text-gray-400 mt-1 max-w-sm">
                        Our AI is analyzing your inputs and crafting personalized content for your campaign
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Progress</span>
                      <span className="text-white font-medium">{generationProgress}%</span>
                    </div>
                    <Progress 
                      value={generationProgress} 
                      className="h-2 bg-zinc-800" 
                      indicatorClassName="bg-[#5eead4]"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-300">
                      <Clock className="h-4 w-4 text-[#5eead4]" />
                      <span>Analyzing campaign brief</span>
                      {generationProgress >= 10 && <span className="text-[#5eead4] ml-auto">✓</span>}
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <Users className="h-4 w-4 text-[#5eead4]" />
                      <span>Processing audience information</span>
                      {generationProgress >= 30 && <span className="text-[#5eead4] ml-auto">✓</span>}
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <Target className="h-4 w-4 text-[#5eead4]" />
                      <span>Tailoring to your brand voice</span>
                      {generationProgress >= 50 && <span className="text-[#5eead4] ml-auto">✓</span>}
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <FileText className="h-4 w-4 text-[#5eead4]" />
                      <span>Generating content pieces</span>
                      {generationProgress >= 70 && <span className="text-[#5eead4] ml-auto">✓</span>}
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <Calendar className="h-4 w-4 text-[#5eead4]" />
                      <span>Building campaign timeline</span>
                      {generationProgress >= 90 && <span className="text-[#5eead4] ml-auto">✓</span>}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === "results" && campaign && (
              <div className="space-y-8">
                <Card className="bg-black border border-[#222] rounded-xl shadow-xl overflow-hidden">
                  <CardHeader className="px-6 py-5">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-8 h-8">
                          <FileText className="h-5 w-5 text-[#5eead4]" />
                        </div>
                        <div>
                          <CardTitle className="text-white text-lg">{campaign.name}</CardTitle>
                          <CardDescription className="text-gray-400 text-sm">
                            {campaign.objective.length > 120 
                              ? campaign.objective.substring(0, 120) + "..." 
                              : campaign.objective}
                          </CardDescription>
                        </div>
                      </div>
                      <Button 
                        className="bg-[#5eead4] hover:bg-[#4fd8c0] text-black"
                        onClick={handleSaveCampaign}
                      >
                        Save Campaign
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="px-6 pb-5 space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-800">
                        <div className="flex flex-col h-full">
                          <h3 className="text-gray-400 text-sm font-medium mb-1">Target Audience</h3>
                          <div className="flex-1">
                            {campaign.targetAudience.length > 0 ? (
                              <div className="flex flex-wrap gap-2 mt-2">
                                {campaign.targetAudience.map((audience, i) => (
                                  <Badge 
                                    key={i}
                                    variant="outline"
                                    className="bg-[#5eead4]/10 text-[#5eead4] border-[#5eead4]/30"
                                  >
                                    {audience}
                                  </Badge>
                                ))}
                              </div>
                            ) : (
                              <p className="text-gray-500 text-sm mt-2">No specific audience selected</p>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-800">
                        <div className="flex flex-col h-full">
                          <h3 className="text-gray-400 text-sm font-medium mb-1">Channels</h3>
                          <div className="flex-1">
                            <div className="flex flex-wrap gap-2 mt-2">
                              {campaign.channels.map((channel, i) => (
                                <Badge 
                                  key={i}
                                  variant="outline"
                                  className="bg-zinc-800 text-white border-zinc-700"
                                >
                                  {channel}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-800">
                        <div className="flex flex-col h-full">
                          <h3 className="text-gray-400 text-sm font-medium mb-1">Timeline</h3>
                          <div className="flex-1">
                            <div className="flex items-center justify-between text-sm text-white mt-2">
                              <div>
                                <span className="text-gray-500">Start:</span> {campaign.timeline.start}
                              </div>
                              <div>
                                <span className="text-gray-500">End:</span> {campaign.timeline.end}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      <h3 className="text-lg font-medium text-white">Campaign Content</h3>
                      
                      <Tabs defaultValue="all" className="w-full">
                        <TabsList className="bg-zinc-900 border-b border-zinc-800 p-0 h-12 rounded-lg mb-6">
                          <TabsTrigger 
                            value="all" 
                            className="flex-1 h-full data-[state=active]:bg-black data-[state=active]:border-t-2 data-[state=active]:border-t-[#5eead4] data-[state=active]:rounded-t-md data-[state=active]:shadow-none"
                          >
                            All Content
                          </TabsTrigger>
                          {selectedContentTypes.email && (
                            <TabsTrigger 
                              value="email" 
                              className="flex-1 h-full data-[state=active]:bg-black data-[state=active]:border-t-2 data-[state=active]:border-t-[#5eead4] data-[state=active]:rounded-t-md data-[state=active]:shadow-none"
                            >
                              Email
                            </TabsTrigger>
                          )}
                          {selectedContentTypes.social && (
                            <TabsTrigger 
                              value="social" 
                              className="flex-1 h-full data-[state=active]:bg-black data-[state=active]:border-t-2 data-[state=active]:border-t-[#5eead4] data-[state=active]:rounded-t-md data-[state=active]:shadow-none"
                            >
                              LinkedIn
                            </TabsTrigger>
                          )}
                          {selectedContentTypes.blog && (
                            <TabsTrigger 
                              value="blog" 
                              className="flex-1 h-full data-[state=active]:bg-black data-[state=active]:border-t-2 data-[state=active]:border-t-[#5eead4] data-[state=active]:rounded-t-md data-[state=active]:shadow-none"
                            >
                              Blog
                            </TabsTrigger>
                          )}
                          {selectedContentTypes.webinar && (
                            <TabsTrigger 
                              value="webinar" 
                              className="flex-1 h-full data-[state=active]:bg-black data-[state=active]:border-t-2 data-[state=active]:border-t-[#5eead4] data-[state=active]:rounded-t-md data-[state=active]:shadow-none"
                            >
                              Webinar
                            </TabsTrigger>
                          )}
                        </TabsList>
                        
                        <TabsContent value="all" className="space-y-6 mt-0">
                          {campaign.contents.map((content, i) => (
                            <div key={i} className="bg-zinc-900 rounded-lg border border-zinc-800 overflow-hidden">
                              <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  {content.icon}
                                  <div>
                                    <h4 className="font-medium text-white">{content.title}</h4>
                                    <div className="flex items-center gap-2 mt-1">
                                      <Badge variant="outline" className="bg-zinc-800 text-white border-zinc-700 text-xs">
                                        {content.channel || content.type}
                                      </Badge>
                                      <span className="text-xs text-gray-500">
                                        For: {content.persona}
                                      </span>
                                      {content.deliveryDate && (
                                        <span className="text-xs text-gray-500">
                                          Delivery: {content.deliveryDate}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="p-4">
                                <pre className="font-sans whitespace-pre-wrap overflow-auto text-white campaign-content">
                                  {content.content}
                                </pre>
                              </div>
                            </div>
                          ))}
                        </TabsContent>
                        
                        <TabsContent value="email" className="space-y-6 mt-0">
                          {campaign.contents.filter(c => c.type === 'email').map((content, i) => (
                            <div key={i} className="bg-zinc-900 rounded-lg border border-zinc-800 overflow-hidden">
                              <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <MessageSquare className="h-5 w-5 text-[#5eead4]" />
                                  <div>
                                    <h4 className="font-medium text-white">{content.title}</h4>
                                    <div className="flex items-center gap-2 mt-1">
                                      <Badge variant="outline" className="bg-zinc-800 text-white border-zinc-700 text-xs">
                                        {content.channel || content.type}
                                      </Badge>
                                      <span className="text-xs text-gray-500">
                                        For: {content.persona}
                                      </span>
                                      {content.deliveryDate && (
                                        <span className="text-xs text-gray-500">
                                          Delivery: {content.deliveryDate}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="p-4">
                                <pre className="font-sans whitespace-pre-wrap overflow-auto text-white campaign-content">
                                  {content.content}
                                </pre>
                              </div>
                            </div>
                          ))}
                        </TabsContent>
                        
                        <TabsContent value="social" className="space-y-6 mt-0">
                          {campaign.contents.filter(c => c.type === 'social').map((content, i) => (
                            <div key={i} className="bg-zinc-900 rounded-lg border border-zinc-800 overflow-hidden">
                              <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <FileText className="h-5 w-5 text-[#5eead4]" />
                                  <div>
                                    <h4 className="font-medium text-white">{content.title}</h4>
                                    <div className="flex items-center gap-2 mt-1">
                                      <Badge variant="outline" className="bg-zinc-800 text-white border-zinc-700 text-xs">
                                        {content.channel || content.type}
                                      </Badge>
                                      <span className="text-xs text-gray-500">
                                        For: {content.persona}
                                      </span>
                                      {content.deliveryDate && (
                                        <span className="text-xs text-gray-500">
                                          Delivery: {content.deliveryDate}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="p-4">
                                <pre className="font-sans whitespace-pre-wrap overflow-auto text-white campaign-content">
                                  {content.content}
                                </pre>
                              </div>
                            </div>
                          ))}
                        </TabsContent>
                        
                        <TabsContent value="blog" className="space-y-6 mt-0">
                          {campaign.contents.filter(c => c.type === 'blog').map((content, i) => (
                            <div key={i} className="bg-zinc-900 rounded-lg border border-zinc-800 overflow-hidden">
                              <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <FileText className="h-5 w-5 text-[#5eead4]" />
                                  <div>
                                    <h4 className="font-medium text-white">{content.title}</h4>
                                    <div className="flex items-center gap-2 mt-1">
                                      <Badge variant="outline" className="bg-zinc-800 text-white border-zinc-700 text-xs">
                                        {content.channel || content.type}
                                      </Badge>
                                      <span className="text-xs text-gray-500">
                                        For: {content.persona}
                                      </span>
                                      {content.deliveryDate && (
                                        <span className="text-xs text-gray-500">
                                          Delivery: {content.deliveryDate}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="p-4">
                                <pre className="font-sans whitespace-pre-wrap overflow-auto text-white campaign-content">
                                  {content.content}
                                </pre>
                              </div>
                            </div>
                          ))}
                        </TabsContent>
                        
                        <TabsContent value="webinar" className="space-y-6 mt-0">
                          {campaign.contents.filter(c => c.type === 'webinar').map((content, i) => (
                            <div key={i} className="bg-zinc-900 rounded-lg border border-zinc-800 overflow-hidden">
                              <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <Zap className="h-5 w-5 text-[#5eead4]" />
                                  <div>
                                    <h4 className="font-medium text-white">{content.title}</h4>
                                    <div className="flex items-center gap-2 mt-1">
                                      <Badge variant="outline" className="bg-zinc-800 text-white border-zinc-700 text-xs">
                                        {content.channel || content.type}
                                      </Badge>
                                      <span className="text-xs text-gray-500">
                                        For: {content.persona}
                                      </span>
                                      {content.deliveryDate && (
                                        <span className="text-xs text-gray-500">
                                          Delivery: {content.deliveryDate}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="p-4">
                                <pre className="font-sans whitespace-pre-wrap overflow-auto text-white campaign-content">
                                  {content.content}
                                </pre>
                              </div>
                            </div>
                          ))}
                        </TabsContent>
                      </Tabs>
                    </div>
                  </CardContent>
                  <CardFooter className="px-6 py-4 bg-zinc-950 border-t border-zinc-900 flex justify-between">
                    <Button 
                      variant="outline"
                      className="border-[#5eead4] text-[#5eead4] hover:bg-[#5eead4]/10"
                      onClick={() => setActiveTab("input")}
                    >
                      Edit Campaign
                    </Button>
                    
                    <Button 
                      className="bg-[#5eead4] hover:bg-[#4fd8c0] text-black"
                      onClick={handleSaveCampaign}
                    >
                      Save Campaign
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}