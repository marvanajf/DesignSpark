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
import { Sparkles, Loader2, Calendar, FileText, Target, Clock, Users, ChevronRight, ArrowRight, PlusCircle, MessageSquare, Zap, Factory } from "lucide-react";
import { useLocation } from "wouter";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiRequest } from "@/lib/queryClient";
import { useQuery } from "@tanstack/react-query";
import { subscriptionPlans, type SubscriptionPlanType } from "@shared/schema";

// Type definitions (preserved from original)
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
  
  // Default date range for campaign
  const today = new Date();
  const twoMonthsLater = new Date(today);
  twoMonthsLater.setMonth(today.getMonth() + 2);
  
  // State variables (preserved from original)
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
      daysInUse: 120
    },
    {
      id: 2, 
      name: "Small Business Owner", 
      role: "CEO/Founder", 
      pains: ["Limited IT resources", "Productivity challenges", "Growth bottlenecks"],
      goals: ["Business scalability", "Employee enablement", "Competitive advantage"],
      daysInUse: 45
    },
    {
      id: 3, 
      name: "Operations Manager", 
      role: "Manager", 
      pains: ["Team collaboration issues", "Process inefficiencies", "Remote work challenges"],
      goals: ["Workflow optimization", "Team productivity", "Unified communications"],
      daysInUse: 80
    }
  ];

  // Sample use cases
  const useCases = [
    { id: 'upsell', name: 'Upsell Campaign', description: 'Convert existing customers to higher-tier products' },
    { id: 'acquisition', name: 'New Customer Acquisition', description: 'Attract new customers to your product or service' },
    { id: 'retention', name: 'Customer Retention', description: 'Improve loyalty and reduce churn with existing customers' },
    { id: 'launch', name: 'Product Launch', description: 'Introduce a new product or feature to the market' }
  ];
  
  // Function to handle campaign generation (preserved from original)
  const handleGenerateCampaign = async () => {
    if (!campaignPrompt.trim() || !selectedUseCase) {
      toast({
        title: "Missing information",
        description: "Please provide both a campaign description and select a use case",
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
        
        // Generate mock campaign data that's based on the input from Step 1
        // Get the selected use case name
        const selectedUseCaseObj = useCases.find(useCase => useCase.id === selectedUseCase);
        const useCaseName = selectedUseCaseObj ? selectedUseCaseObj.name : "Campaign";
        
        // Get the tone analysis if selected
        const selectedToneAnalysisObj = toneAnalyses?.find(tone => tone.id.toString() === selectedToneAnalysisId);
        const toneAnalysisName = selectedToneAnalysisObj ? selectedToneAnalysisObj.name : "Professional";
        
        // Extract tone profile from the selected analysis
        const selectedToneResults = selectedToneAnalysisObj?.tone_results || null;
        
        // Helper function to adapt content to the selected tone
        const adaptContentToTone = (content: string): string => {
          if (!selectedToneResults) return content;
          
          // Determine the dominant tone attributes (highest scores)
          const tones = selectedToneResults;
          const isProfessional = tones.professional > 70;
          const isConversational = tones.conversational > 70;
          const isPersuasive = tones.persuasive > 70;
          const isEducational = tones.educational > 70;
          const isEnthusiastic = tones.enthusiastic > 70;
          
          let adaptedContent = content;
          
          // Modify content based on the tone profile
          if (isProfessional) {
            // More formal language, data-driven
            adaptedContent = adaptedContent.replace(
              /we think|we believe/gi, 
              "research indicates"
            );
          }
          
          if (isConversational) {
            // More personal, direct language
            adaptedContent = adaptedContent.replace(
              /organizations|companies/gi, 
              "teams like yours"
            );
          }
          
          if (isPersuasive) {
            // More action-oriented language
            adaptedContent = adaptedContent.replace(
              /consider|might want to/gi, 
              "should"
            );
          }
          
          if (isEducational) {
            // More explanatory, thorough
            adaptedContent = adaptedContent.replace(
              /effective|optimal/gi, 
              "proven, research-backed"
            );
          }
          
          if (isEnthusiastic) {
            // More energetic language
            adaptedContent = adaptedContent.replace(
              /improve|enhance/gi, 
              "dramatically transform"
            );
          }
          
          return adaptedContent;
        };
        
        // Generate a descriptive campaign name based on user inputs
        const campaignName = `${useCaseName}: ${campaignPrompt.split(' ').slice(0, 4).join(' ')}...`;
        
        // Intelligently process the campaign prompt and selected use case
        // Generate more detailed content titles and subjects based on the campaign type
        
        // Extract key information from campaign prompt
        const words = campaignPrompt.split(' ');
        const isShortPrompt = words.length < 10;
        
        // Generate more intelligent email subjects based on use case
        let emailSubject1 = '';
        let emailSubject2 = '';
        
        // Get the target audience name and role for more personalized content
        const targetPersona = personas.find(p => selectedPersonas.includes(p.id));
        const audienceName = targetPersona?.name || "Target Audience";
        const audienceRole = targetPersona?.role || "Decision Maker";
        
        // Create subject lines based on use case type instead of just repeating prompt
        switch(selectedUseCase) {
          case 'upsell':
            emailSubject1 = `Enhance your results with our premium ${words.slice(0, 3).join(' ')} solution`;
            emailSubject2 = `Following up: Upgrade opportunity for your ${words.slice(0, 2).join(' ')} needs`;
            break;
          case 'acquisition':
            emailSubject1 = `Solve your ${words.slice(0, 3).join(' ')} challenges with our proven approach`;
            emailSubject2 = `Quick question about your ${words.slice(0, 2).join(' ')} strategy`;
            break;
          case 'retention':
            emailSubject1 = `Maximizing the value of your current ${words.slice(0, 3).join(' ')} investment`;
            emailSubject2 = `Exclusive benefits for our valued ${words.slice(0, 2).join(' ')} customers`;
            break;
          case 'launch':
            emailSubject1 = `Introducing our innovative ${words.slice(0, 3).join(' ')} solution`;
            emailSubject2 = `Early access: Be the first to experience our new ${words.slice(0, 2).join(' ')} offering`;
            break;
          default:
            // Fallback if no use case selected
            emailSubject1 = `Strategic approach to ${words.slice(0, 3).join(' ')}`;
            emailSubject2 = `Follow-up: ${words.slice(0, 3).join(' ')} opportunities`;
        }
        
        // Extract key information from campaign prompt for more targeted content
        const keyTerms = campaignPrompt.toLowerCase().split(' ');
        
        // Identify potential product/service types
        const productTerms = [
          'software', 'solution', 'platform', 'service', 'system', 'product', 'application', 
          'tool', 'package', 'packaging', 'container', 'subscription', 'program'
        ];
        
        // Identify potential industries/sectors
        const industryTerms = [
          'retail', 'healthcare', 'finance', 'manufacturing', 'education', 'government', 
          'technology', 'automotive', 'food', 'beverage', 'hospitality', 'construction',
          'logistics', 'transportation', 'energy', 'agriculture', 'pharma', 'telecom'
        ];
        
        // Identify potential features/benefits
        const benefitTerms = [
          'sustainable', 'efficient', 'secure', 'compliant', 'automated', 'integrated', 
          'scalable', 'innovative', 'cost-effective', 'reliable', 'flexible', 'customizable',
          'eco-friendly', 'green', 'recyclable', 'biodegradable', 'compostable'
        ];
        
        // Identify potential regions/locations
        const regionTerms = [
          'global', 'local', 'regional', 'national', 'international', 
          'european', 'american', 'asian', 'african', 'australian',
          'north america', 'europe', 'asia', 'africa', 'australia',
          'benelux', 'nordic', 'mediterranean', 'middle east'
        ];
        
        // Extract product/service from campaign prompt
        const productMatches = keyTerms.filter(term => productTerms.includes(term));
        const product = productMatches.length > 0 ? productMatches[0] : 'solution';
        
        // Extract industry from campaign prompt
        const industryMatches = keyTerms.filter(term => industryTerms.includes(term));
        const industry = industryMatches.length > 0 ? industryMatches[0] : 'industry';
        
        // Extract benefits from campaign prompt
        const benefitMatches = keyTerms.filter(term => benefitTerms.includes(term));
        const benefit = benefitMatches.length > 0 ? benefitMatches[0] : 'effective';
        
        // Extract region from campaign prompt
        const regionMatches = keyTerms.filter(term => regionTerms.includes(term));
        const region = regionMatches.length > 0 ? regionMatches[0] : 'market';
        
        // Generate expanded content from the brief prompt
        // For short prompts, intelligently expand based on context and use case
        let expandedPrompt = campaignPrompt;
        
        if (isShortPrompt) {
          // Expand the short prompt based on the selected use case
          switch(selectedUseCase) {
            case 'upsell':
              expandedPrompt = `Helping existing customers upgrade to more advanced ${product} for ${campaignPrompt}, providing additional value and enhanced capabilities for ${industry} businesses in the ${region} region.`;
              break;
            case 'acquisition':
              expandedPrompt = `Attracting new customers by showcasing how our ${benefit} ${product} solutions address key ${industry} pain points and deliver measurable business outcomes for organizations in the ${region} region.`;
              break;
            case 'retention':
              expandedPrompt = `Strengthening relationships with existing ${industry} customers by demonstrating continued value in our ${benefit} ${product} offerings and providing exceptional support to businesses in the ${region} region.`;
              break;
            case 'launch':
              expandedPrompt = `Introducing our innovative new ${benefit} ${product} solution designed specifically for the ${industry} sector in the ${region} region, addressing emerging market needs with cutting-edge technology and proven methodologies.`;
              break;
            default:
              expandedPrompt = `Strategic approach to ${campaignPrompt} that delivers measurable results and addresses key ${industry} business challenges in the ${region} region.`;
          }
        }
        
        // Generate persona-specific benefits based on the selected persona's pains/goals
        const personaBenefits = targetPersona ? 
          targetPersona.goals.map(goal => `• ${goal}`) :
          [
            "• Improved operational efficiency",
            "• Reduced costs and resource requirements",
            "• Enhanced team productivity and collaboration",
            "• Better strategic decision-making capabilities"
          ];
        
        // Generate persona-specific pain points addressed
        const personaPains = targetPersona ? 
          targetPersona.pains.map(pain => `• Eliminates ${pain.toLowerCase()}`) :
          [
            "• Eliminates workflow bottlenecks",
            "• Addresses security and compliance concerns",
            "• Resolves data management challenges",
            "• Mitigates implementation and adoption risks"
          ];
        
        // Generate content using predefined templates
        const allContentPieces = [
          {
            id: 1,
            type: "email" as const,
            title: `${useCaseName} Initial Outreach for ${audienceName}`,
            persona: audienceName,
            content: adaptContentToTone(`Subject: ${emailSubject1}

Dear [${audienceRole}],

I recently came across your organization's initiatives and was particularly impressed with your focus on innovation in the ${industry} sector.

Many of our clients in similar positions have been exploring new ways to implement ${benefit} ${product} solutions for the ${region} region. The results they've achieved include:

${personaBenefits.join('\n')}

Based on your market position and the specific challenges facing companies in the ${industry} sector, I believe we could offer valuable insights related to your current priorities.

Would you have 20 minutes next week to discuss how our ${benefit} approach has proven successful for similar organizations in the ${region} region?

Best regards,
[Your Name]`),
            deliveryDate: campaignStartDate,
            channel: "Email",
            icon: <MessageSquare className="h-5 w-5" />
          },
          {
            id: 2,
            type: "email" as const,
            title: `${useCaseName} Follow-up for ${audienceName}`,
            persona: audienceName,
            content: adaptContentToTone(`Subject: ${emailSubject2}

Dear [${audienceRole}],

I wanted to follow up on my previous message regarding innovative solutions for your organization.

Recent ${industry} research highlights that organizations in the ${region} region taking a proactive approach to ${benefit} ${product} solutions are seeing significant results - 27% improvement in overall performance and 32% reduction in operational costs on average.

Based on common challenges in the ${industry} sector, our approach could help with:

${personaPains.join('\n')}

Would you be available for a brief 15-minute conversation this Thursday or Friday? I'd be happy to share relevant case studies from companies in the ${region} region similar to yours.

Looking forward to your response,
[Your Name]`),
            deliveryDate: new Date(new Date(campaignStartDate).setDate(new Date(campaignStartDate).getDate() + 7)).toISOString().split('T')[0],
            channel: "Email",
            icon: <MessageSquare className="h-5 w-5" />
          },
          {
            id: 3,
            type: "social" as const,
            title: `LinkedIn Thought Leadership for ${useCaseName}`,
            persona: audienceName,
            content: adaptContentToTone(`"We reduced implementation time by 65% and improved team adoption by 83% within the first month for our clients in the ${region} region."

This is what our clients in the ${industry} sector are achieving with our ${benefit} ${product} solutions.

Organizations in the ${region} region that consistently outperform their competition are prioritizing:

• Cross-functional collaboration with integrated platforms
• Data-driven decision making with real-time analytics
• Streamlined processes for improved efficiency
• Robust ${benefit} frameworks tailored to ${industry} needs

What strategies is your organization implementing to stay ahead of ${industry} changes in the ${region} region?

[Learn more about our proven approach - Link]

#${industry.charAt(0).toUpperCase() + industry.slice(1)}Innovation #${benefit.charAt(0).toUpperCase() + benefit.slice(1)} #${region.charAt(0).toUpperCase() + region.slice(1)}Business #LinkedIn`),
            deliveryDate: new Date(new Date(campaignStartDate).setDate(new Date(campaignStartDate).getDate() + 3)).toISOString().split('T')[0],
            channel: "LinkedIn",
            icon: <FileText className="h-5 w-5" />
          },
          {
            id: 4,
            type: "webinar" as const,
            title: `Strategic ${useCaseName} Webinar for ${audienceName}`,
            persona: audienceName,
            content: adaptContentToTone(`Title: "Strategic Innovation Framework for Industry Leaders"

Duration: 45 minutes + 15-minute Q&A

Target Audience: ${audienceRole}s and Strategic Decision Makers

Description:
Join our industry specialists for a practical, hands-on webinar focused on implementing effective strategies for competitive advantage in today's rapidly evolving marketplace. This session will provide actionable frameworks and real-world implementation guidance.

Agenda:
- Industry trends and emerging best practices
- Common implementation pitfalls and how to avoid them
- Strategic framework for successful deployment
- Integration strategies with existing systems
- Case studies: Organizations that achieved 40%+ improvement in outcomes

Key Takeaways:
- Practical implementation roadmap customized for your organization type
- ROI calculation methodology to secure stakeholder buy-in
- Risk mitigation strategies for common adoption challenges
- Resource optimization techniques for faster deployment

Presenter:
[Industry Expert Name], with extensive experience helping organizations transform their strategic approach to industry-specific challenges.

Registration includes access to our implementation toolkit and a complimentary strategy session with our consulting team.`),
            deliveryDate: new Date(new Date(campaignStartDate).setDate(new Date(campaignStartDate).getDate() + 14)).toISOString().split('T')[0],
            channel: "Webinar",
            icon: <FileText className="h-5 w-5" />
          },
          {
            id: 5,
            type: "social" as const,
            title: `LinkedIn Article on ${useCaseName} ROI`,
            persona: (personas.find(p => selectedPersonas[1]) ? personas.find(p => p.id === selectedPersonas[1])?.name : personas.find(p => selectedPersonas.includes(p.id))?.name) || "Target Audience",
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
            type: "blog" as const,
            title: `Industry Trends in ${useCaseName} - Strategic Analysis`,
            persona: audienceName,
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
            deliveryDate: new Date(new Date(campaignStartDate).setDate(new Date(campaignStartDate).getDate() + 5)).toISOString().split('T')[0],
            channel: "Blog",
            icon: <FileText className="h-5 w-5" />
          }
        ];
        
        // Ensure all pieces have valid personas (fixing any potential undefined values)
        const sanitizedContentPieces = allContentPieces.map(content => ({
          ...content,
          persona: content.persona || "Target Audience" // Fallback to ensure we never have undefined
        }));
        
        // Filter content based on selected types
        const filteredContent = sanitizedContentPieces.filter((content) => {
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
          if (typeCount[content.type] < contentCount[content.type]) {
            selectedContents.push(content);
            typeCount[content.type]++;
          }
        }
        
        setCampaign({
          id: 1,
          name: campaignName,
          objective: campaignPrompt || "Increase brand awareness and drive conversions",
          targetAudience: selectedPersonas.map(id => {
            const persona = personas.find(p => p.id === id);
            return persona ? persona.name : "Target Audience";
          }),
          channels: Object.entries(selectedContentTypes)
            .filter(([_, isSelected]) => isSelected)
            .map(([type, _]) => type === 'social' ? 'LinkedIn' : type.charAt(0).toUpperCase() + type.slice(1)),
          timeline: {
            start: campaignStartDate,
            end: campaignEndDate
          },
          contents: selectedContents,
          toneProfile: selectedToneResults ? {
            professional: selectedToneResults.professional || 85,
            conversational: selectedToneResults.conversational || 65,
            persuasive: selectedToneResults.persuasive || 75,
            educational: selectedToneResults.educational || 80,
            enthusiastic: selectedToneResults.enthusiastic || 60
          } : {
            professional: 85,
            conversational: 65,
            persuasive: 75,
            educational: 80,
            enthusiastic: 60
          }
        });
        
        // Simulate incrementing usage counter server-side
        // In a real app, this would be a call to the backend API
        console.log("Campaign generated - incrementing usage");
        
        // Change to results tab after completed
        setTimeout(() => {
          setIsGenerating(false);
          setActiveTab("results");
        }, 1000);
      };
      
      await mockGeneration();
    } catch (error) {
      toast({
        title: "Generation failed",
        description: "There was an error generating your campaign. Please try again.",
        variant: "destructive"
      });
      setIsGenerating(false);
    }
  };

  // Generate personas (preserved from original)
  const handleGeneratePersonas = async () => {
    setIsGeneratingPersonas(true);
    
    try {
      // Simulate persona generation
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      // Mock generated personas
      const mockGeneratedPersonas: Persona[] = [
        {
          id: 4,
          name: "Enterprise Security Architect",
          role: "Technical Leader",
          pains: ["Increasing attack surface", "Compliance challenges", "Legacy system vulnerabilities"],
          goals: ["Zero-trust architecture", "Automated threat response", "Security skills development"],
          daysInUse: 0
        },
        {
          id: 5,
          name: "Mid-size Business IT Manager",
          role: "IT Manager",
          pains: ["Limited security staff", "Multi-cloud complexity", "Budget justification"],
          goals: ["Simplified management", "Automated compliance reporting", "Threat visibility"],
          daysInUse: 0
        }
      ];
      
      setGeneratedPersonas(mockGeneratedPersonas);
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

  // Save campaign to user account (preserved from original)
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
                        <CardTitle className="text-xl text-white font-medium">Campaign Brief</CardTitle>
                        <CardDescription>
                          Provide information about your marketing campaign
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-6 space-y-8">
                    {/* Campaign Description */}
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="campaign-prompt" className="text-white font-medium flex items-center">
                          Campaign Description 
                          <span className="text-[#5eead4] ml-2 text-sm font-normal">(Required)</span>
                        </Label>
                        <p className="text-gray-400 text-sm mb-2">
                          What is your campaign about? Include goals, target audience, key messages, and any specific requirements.
                        </p>
                        <Textarea 
                          id="campaign-prompt"
                          placeholder="E.g., A campaign to promote our new cloud security product to IT managers at mid-size companies. We want to emphasize easy deployment, cost savings, and regulatory compliance..."
                          className="h-32 bg-zinc-900 border-zinc-700 focus-visible:ring-[#5eead4]"
                          value={campaignPrompt}
                          onChange={(e) => setCampaignPrompt(e.target.value)}
                        />
                      </div>
                      
                      {/* Campaign Type */}
                      <div>
                        <Label htmlFor="campaign-type" className="text-white font-medium flex items-center">
                          Campaign Type
                          <span className="text-[#5eead4] ml-2 text-sm font-normal">(Required)</span>
                        </Label>
                        <p className="text-gray-400 text-sm mb-3">
                          Select the primary purpose of your campaign
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          {useCases.map(useCase => (
                            <div 
                              key={useCase.id}
                              className={`p-4 rounded-lg border cursor-pointer transition-all ${
                                selectedUseCase === useCase.id 
                                  ? "border-[#5eead4] bg-[#5eead4]/10" 
                                  : "border-zinc-800 bg-zinc-900/50 hover:border-zinc-600"
                              }`}
                              onClick={() => setSelectedUseCase(useCase.id)}
                            >
                              <div className="flex flex-col h-full">
                                <h3 className={`font-medium mb-2 ${
                                  selectedUseCase === useCase.id ? "text-[#5eead4]" : "text-white"
                                }`}>
                                  {useCase.name}
                                </h3>
                                <p className="text-gray-400 text-sm">{useCase.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Brand Voice (Required) */}
                      <div>
                        <Label htmlFor="brand-voice" className="text-white font-medium flex items-center">
                          Brand Voice
                          <span className="text-[#5eead4] ml-2 text-sm font-normal">(Required)</span>
                        </Label>
                        <p className="text-gray-400 text-sm mb-3">
                          Select a tone analysis to apply your brand voice to the campaign content
                        </p>
                        <div className="max-w-full">
                          <Select 
                            value={selectedToneAnalysisId} 
                            onValueChange={setSelectedToneAnalysisId}
                          >
                            <SelectTrigger className="bg-zinc-900 border-zinc-700 focus:ring-[#5eead4] focus-visible:ring-[#5eead4]">
                              <SelectValue placeholder="Select a tone analysis" />
                            </SelectTrigger>
                            <SelectContent className="bg-zinc-900 border-zinc-700">
                              {isLoadingToneAnalyses ? (
                                <div className="flex items-center justify-center p-4">
                                  <Loader2 className="h-4 w-4 text-[#5eead4] animate-spin" />
                                </div>
                              ) : (
                                toneAnalyses && toneAnalyses.length > 0 ? (
                                  toneAnalyses?.map(tone => (
                                    <SelectItem key={tone.id} value={tone.id.toString()}>
                                      {tone.name}
                                    </SelectItem>
                                  ))
                                ) : (
                                  <div className="p-2 text-center">
                                    <p className="text-gray-400 mb-2">No tone analyses found</p>
                                    <Button 
                                      variant="link" 
                                      className="text-[#5eead4] p-0" 
                                      onClick={() => setLocation('/tone-analysis')}
                                    >
                                      Create a tone analysis
                                    </Button>
                                  </div>
                                )
                              )}
                            </SelectContent>
                          </Select>
                          {!selectedToneAnalysisId && !isLoadingToneAnalyses && (
                            <div className="mt-2 flex items-center">
                              <Button 
                                variant="link" 
                                className="text-[#5eead4] p-0 h-auto" 
                                onClick={() => setLocation('/tone-analysis')}
                              >
                                Create a new tone analysis
                                <ArrowRight className="h-3 w-3 ml-1" />
                              </Button>
                            </div>
                          )}
                          <p className="text-gray-400 text-xs mt-2">
                            A tone analysis helps maintain consistent brand voice across all content
                          </p>
                        </div>
                      </div>
                      
                      {/* Campaign Timeline */}
                      <div>
                        <h3 className="text-white font-medium mb-3">Campaign Timeline</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <Label htmlFor="start-date" className="text-gray-300 mb-2 block">Start Date</Label>
                            <Input 
                              id="start-date"
                              type="date"
                              className="bg-zinc-900 border-zinc-700 focus-visible:ring-[#5eead4]"
                              value={campaignStartDate}
                              onChange={(e) => setCampaignStartDate(e.target.value)}
                            />
                          </div>
                          <div>
                            <Label htmlFor="end-date" className="text-gray-300 mb-2 block">End Date</Label>
                            <Input 
                              id="end-date"
                              type="date"
                              className="bg-zinc-900 border-zinc-700 focus-visible:ring-[#5eead4]"
                              value={campaignEndDate}
                              onChange={(e) => setCampaignEndDate(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Content Configuration */}
                <Card className="bg-black border border-[#222] rounded-xl shadow-xl overflow-hidden">
                  <CardHeader className="px-6 py-5">
                    <div className="flex items-center gap-4 mb-2">
                      <div className="flex items-center justify-center w-8 h-8">
                        <MessageSquare className="h-5 w-5 text-[#5eead4]" />
                      </div>
                      <div>
                        <CardTitle className="text-xl text-white font-medium">Content Configuration</CardTitle>
                        <CardDescription>
                          Select the types of content you want in your campaign
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      {/* Content Selection */}
                      <div>
                        <h3 className="text-white font-medium mb-4">Content Types</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                          {/* Email Content */}
                          <div className={`p-5 rounded-lg border ${selectedContentTypes.email ? "border-[#5eead4] bg-[#5eead4]/10" : "border-zinc-800 bg-zinc-900/50"}`}>
                            <div className="flex justify-between items-center mb-3">
                              <h4 className="font-medium text-white">Email</h4>
                              <Switch 
                                checked={selectedContentTypes.email} 
                                onCheckedChange={() => toggleContentType('email')}
                                className="data-[state=checked]:bg-[#5eead4]"
                              />
                            </div>
                            {selectedContentTypes.email && (
                              <div className="mt-4">
                                <Label htmlFor="email-count" className="text-gray-300 text-sm block mb-2">Number of Emails</Label>
                                <Select 
                                  value={contentCount.email.toString()} 
                                  onValueChange={(value) => handleContentCountChange('email', parseInt(value))}
                                >
                                  <SelectTrigger className="bg-zinc-900 border-zinc-700 focus:ring-[#5eead4] focus-visible:ring-[#5eead4]">
                                    <SelectValue placeholder="Select" />
                                  </SelectTrigger>
                                  <SelectContent className="bg-zinc-900 border-zinc-700">
                                    <SelectItem value="1">1 Email</SelectItem>
                                    <SelectItem value="2">2 Emails</SelectItem>
                                    <SelectItem value="3">3 Emails</SelectItem>
                                    <SelectItem value="4">4 Emails</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            )}
                          </div>
                          
                          {/* LinkedIn Content */}
                          <div className={`p-5 rounded-lg border ${selectedContentTypes.social ? "border-[#5eead4] bg-[#5eead4]/10" : "border-zinc-800 bg-zinc-900/50"}`}>
                            <div className="flex justify-between items-center mb-3">
                              <h4 className="font-medium text-white">LinkedIn</h4>
                              <Switch 
                                checked={selectedContentTypes.social} 
                                onCheckedChange={() => toggleContentType('social')}
                                className="data-[state=checked]:bg-[#5eead4]"
                              />
                            </div>
                            {selectedContentTypes.social && (
                              <div className="mt-4">
                                <Label htmlFor="social-count" className="text-gray-300 text-sm block mb-2">Number of Posts</Label>
                                <Select 
                                  value={contentCount.social.toString()} 
                                  onValueChange={(value) => handleContentCountChange('social', parseInt(value))}
                                >
                                  <SelectTrigger className="bg-zinc-900 border-zinc-700 focus:ring-[#5eead4] focus-visible:ring-[#5eead4]">
                                    <SelectValue placeholder="Select" />
                                  </SelectTrigger>
                                  <SelectContent className="bg-zinc-900 border-zinc-700">
                                    <SelectItem value="1">1 Post</SelectItem>
                                    <SelectItem value="2">2 Posts</SelectItem>
                                    <SelectItem value="3">3 Posts</SelectItem>
                                    <SelectItem value="4">4 Posts</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            )}
                          </div>
                          
                          {/* Blog Content */}
                          <div className={`p-5 rounded-lg border ${selectedContentTypes.blog ? "border-[#5eead4] bg-[#5eead4]/10" : "border-zinc-800 bg-zinc-900/50"}`}>
                            <div className="flex justify-between items-center mb-3">
                              <h4 className="font-medium text-white">Blog</h4>
                              <Switch 
                                checked={selectedContentTypes.blog} 
                                onCheckedChange={() => toggleContentType('blog')}
                                className="data-[state=checked]:bg-[#5eead4]"
                              />
                            </div>
                            {selectedContentTypes.blog && (
                              <div className="mt-4">
                                <Label htmlFor="blog-count" className="text-gray-300 text-sm block mb-2">Number of Articles</Label>
                                <Select 
                                  value={contentCount.blog.toString()} 
                                  onValueChange={(value) => handleContentCountChange('blog', parseInt(value))}
                                >
                                  <SelectTrigger className="bg-zinc-900 border-zinc-700 focus:ring-[#5eead4] focus-visible:ring-[#5eead4]">
                                    <SelectValue placeholder="Select" />
                                  </SelectTrigger>
                                  <SelectContent className="bg-zinc-900 border-zinc-700">
                                    <SelectItem value="1">1 Article</SelectItem>
                                    <SelectItem value="2">2 Articles</SelectItem>
                                    <SelectItem value="3">3 Articles</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            )}
                          </div>
                          
                          {/* Webinar Content */}
                          <div className={`p-5 rounded-lg border ${selectedContentTypes.webinar ? "border-[#5eead4] bg-[#5eead4]/10" : "border-zinc-800 bg-zinc-900/50"}`}>
                            <div className="flex justify-between items-center mb-3">
                              <h4 className="font-medium text-white">Webinar</h4>
                              <Switch 
                                checked={selectedContentTypes.webinar} 
                                onCheckedChange={() => toggleContentType('webinar')}
                                className="data-[state=checked]:bg-[#5eead4]"
                              />
                            </div>
                            {selectedContentTypes.webinar && (
                              <div className="mt-4">
                                <Label htmlFor="webinar-count" className="text-gray-300 text-sm block mb-2">Number of Webinars</Label>
                                <Select 
                                  value={contentCount.webinar.toString()} 
                                  onValueChange={(value) => handleContentCountChange('webinar', parseInt(value))}
                                >
                                  <SelectTrigger className="bg-zinc-900 border-zinc-700 focus:ring-[#5eead4] focus-visible:ring-[#5eead4]">
                                    <SelectValue placeholder="Select" />
                                  </SelectTrigger>
                                  <SelectContent className="bg-zinc-900 border-zinc-700">
                                    <SelectItem value="1">1 Webinar</SelectItem>
                                    <SelectItem value="2">2 Webinars</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Advanced Settings (collapsible) */}
                      <div className="mt-8 border-t border-zinc-800/60 pt-6">
                        <h3 className="text-white font-medium mb-4">Advanced Settings (Optional)</h3>
                        
                        {/* Persona Selection */}
                        <div className="mb-6">
                          <div className="flex justify-between items-center mb-3">
                            <div>
                              <h4 className="text-white text-sm font-medium">Use AI-Generated Personas</h4>
                              <p className="text-gray-400 text-xs mt-1">
                                Let the AI create personas based on your campaign brief
                              </p>
                            </div>
                            <Switch 
                              checked={useGeneratedPersonas} 
                              onCheckedChange={setUseGeneratedPersonas}
                              className="data-[state=checked]:bg-[#5eead4]"
                            />
                          </div>
                          
                          {!useGeneratedPersonas && (
                            <div className="mt-4">
                              <div className="flex justify-between items-center mb-3">
                                <Label className="text-gray-300 text-sm">Select Target Personas</Label>
                                <Button 
                                  variant="link" 
                                  className="text-[#5eead4] p-0 h-auto" 
                                  onClick={() => setLocation('/personas')}
                                >
                                  Create new persona
                                  <ArrowRight className="h-3 w-3 ml-1" />
                                </Button>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                {personas.map(persona => (
                                  <div 
                                    key={persona.id}
                                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                                      selectedPersonas.includes(persona.id) 
                                        ? "border-[#5eead4] bg-[#5eead4]/10" 
                                        : "border-zinc-800 bg-zinc-900/50 hover:border-zinc-600"
                                    }`}
                                    onClick={() => togglePersonaSelection(persona.id)}
                                  >
                                    <div>
                                      <h3 className="font-medium text-white">{persona.name}</h3>
                                      <p className="text-gray-400 text-xs mt-1">{persona.role}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {useGeneratedPersonas && generatedPersonas.length > 0 && (
                            <div className="mt-4">
                              <Label className="text-gray-300 text-sm block mb-3">AI-Generated Personas</Label>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {generatedPersonas.map(persona => (
                                  <div 
                                    key={persona.id}
                                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                                      selectedPersonas.includes(persona.id) 
                                        ? "border-[#5eead4] bg-[#5eead4]/10" 
                                        : "border-zinc-800 bg-zinc-900/50 hover:border-zinc-600"
                                    }`}
                                    onClick={() => togglePersonaSelection(persona.id)}
                                  >
                                    <div>
                                      <h3 className="font-medium text-white">{persona.name}</h3>
                                      <p className="text-gray-400 text-xs mt-1">{persona.role}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {useGeneratedPersonas && isGeneratingPersonas && (
                            <div className="mt-4 flex items-center justify-center p-6">
                              <div className="flex flex-col items-center">
                                <Loader2 className="h-8 w-8 text-[#5eead4] animate-spin mb-3" />
                                <p className="text-gray-300">Generating personas based on your campaign...</p>
                              </div>
                            </div>
                          )}
                          
                          {useGeneratedPersonas && !isGeneratingPersonas && generatedPersonas.length === 0 && (
                            <div className="mt-4 flex justify-center">
                              <Button 
                                className="bg-[#5eead4]/10 hover:bg-[#5eead4]/20 text-[#5eead4] border border-[#5eead4]/20"
                                onClick={handleGeneratePersonas}
                              >
                                <Sparkles className="h-4 w-4 mr-2" />
                                Generate Targeted Personas
                              </Button>
                            </div>
                          )}
                        </div>
                        
                        {/* This is now moved to the Campaign Brief section */}
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="border-t border-[#222] px-6 py-4">
                    <Button 
                      className="bg-[#5eead4] hover:bg-[#5eead4]/90 text-black font-medium w-full md:w-auto"
                      onClick={handleGenerateCampaign}
                      disabled={!campaignPrompt.trim() || !selectedUseCase || !selectedToneAnalysisId}
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generate Campaign
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            )}
            
            {/* AI Processing Tab with improved visual feedback */}
            {activeTab === "generating" && (
              <div className="flex flex-col items-center justify-center py-16 px-4">
                <div className="max-w-md w-full text-center">
                  <div className="mb-6">
                    <div className="relative h-32 w-32 mx-auto">
                      <div className="absolute inset-0 rounded-full bg-[#5eead4]/10 animate-ping"></div>
                      <div className="relative h-32 w-32 rounded-full flex items-center justify-center bg-black border-2 border-[#5eead4]">
                        <Sparkles className="h-10 w-10 text-[#5eead4]" />
                      </div>
                    </div>
                  </div>
                  
                  <h2 className="text-2xl font-bold text-white mb-2">Generating Your Campaign</h2>
                  <p className="text-gray-400 mb-8">
                    Our AI is crafting your campaign content based on your inputs. This may take a few moments.
                  </p>
                  
                  <Progress value={generationProgress} className="h-2 mb-8 bg-zinc-800 [&>div]:bg-[#5eead4]" />
                  
                  <div className="space-y-4">
                    <div className={`flex items-center ${generationProgress >= 10 ? "text-[#5eead4]" : "text-gray-500"}`}>
                      <div className={`h-6 w-6 rounded-full flex items-center justify-center mr-3 ${generationProgress >= 10 ? "bg-[#5eead4]/10 border border-[#5eead4]" : "bg-zinc-800 border border-zinc-700"}`}>
                        {generationProgress >= 10 ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <span className="text-xs">1</span>
                        )}
                      </div>
                      <span>Analyzing campaign brief</span>
                    </div>
                    
                    <div className={`flex items-center ${generationProgress >= 30 ? "text-[#5eead4]" : "text-gray-500"}`}>
                      <div className={`h-6 w-6 rounded-full flex items-center justify-center mr-3 ${generationProgress >= 30 ? "bg-[#5eead4]/10 border border-[#5eead4]" : "bg-zinc-800 border border-zinc-700"}`}>
                        {generationProgress >= 30 ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <span className="text-xs">2</span>
                        )}
                      </div>
                      <span>Creating target personas</span>
                    </div>
                    
                    <div className={`flex items-center ${generationProgress >= 50 ? "text-[#5eead4]" : "text-gray-500"}`}>
                      <div className={`h-6 w-6 rounded-full flex items-center justify-center mr-3 ${generationProgress >= 50 ? "bg-[#5eead4]/10 border border-[#5eead4]" : "bg-zinc-800 border border-zinc-700"}`}>
                        {generationProgress >= 50 ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <span className="text-xs">3</span>
                        )}
                      </div>
                      <span>Building campaign structure</span>
                    </div>
                    
                    <div className={`flex items-center ${generationProgress >= 70 ? "text-[#5eead4]" : "text-gray-500"}`}>
                      <div className={`h-6 w-6 rounded-full flex items-center justify-center mr-3 ${generationProgress >= 70 ? "bg-[#5eead4]/10 border border-[#5eead4]" : "bg-zinc-800 border border-zinc-700"}`}>
                        {generationProgress >= 70 ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <span className="text-xs">4</span>
                        )}
                      </div>
                      <span>Creating content for each channel</span>
                    </div>
                    
                    <div className={`flex items-center ${generationProgress >= 90 ? "text-[#5eead4]" : "text-gray-500"}`}>
                      <div className={`h-6 w-6 rounded-full flex items-center justify-center mr-3 ${generationProgress >= 90 ? "bg-[#5eead4]/10 border border-[#5eead4]" : "bg-zinc-800 border border-zinc-700"}`}>
                        {generationProgress >= 90 ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <span className="text-xs">5</span>
                        )}
                      </div>
                      <span>Finalizing campaign</span>
                    </div>
                    
                    <div className={`flex items-center ${generationProgress >= 100 ? "text-[#5eead4]" : "text-gray-500"}`}>
                      <div className={`h-6 w-6 rounded-full flex items-center justify-center mr-3 ${generationProgress >= 100 ? "bg-[#5eead4]/10 border border-[#5eead4]" : "bg-zinc-800 border border-zinc-700"}`}>
                        {generationProgress >= 100 ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <span className="text-xs">6</span>
                        )}
                      </div>
                      <span>Campaign ready!</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Results with improved layout and interaction */}
            {activeTab === "results" && campaign && (
              <div className="space-y-8">
                {/* Campaign Overview */}
                <Card className="bg-black border border-zinc-800 shadow-[0_4px_20px_rgba(0,0,0,0.3)] overflow-hidden">
                  <CardHeader className="border-b border-zinc-800/60 bg-gradient-to-r from-[#0e1b33] to-black px-6">
                    <div className="flex justify-between flex-wrap gap-4">
                      <div>
                        <CardTitle className="text-xl text-white flex items-center">
                          <div className="h-8 w-8 mr-3 flex items-center justify-center rounded-md bg-[#5eead4]/10 border border-[#5eead4]/30">
                            <Zap className="h-5 w-5 text-[#5eead4]" />
                          </div>
                          {campaign.name}
                        </CardTitle>
                        <CardDescription>Campaign Overview</CardDescription>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button 
                          className="bg-[#5eead4] hover:bg-[#5eead4]/90 text-black"
                          onClick={handleSaveCampaign}
                        >
                          Save Campaign
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-0">
                    <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-zinc-800/60">
                      {/* Campaign Info */}
                      <div className="p-6">
                        <h3 className="text-white font-medium mb-4 flex items-center">
                          <Target className="h-4 w-4 mr-2 text-[#5eead4]" />
                          Campaign Details
                        </h3>
                        
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-gray-400 text-sm">Objective</h4>
                            <p className="text-white mt-1">{campaign.objective}</p>
                          </div>
                          
                          <div>
                            <h4 className="text-gray-400 text-sm">Target Audience</h4>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {campaign.targetAudience.map((audience, idx) => (
                                <Badge key={idx} variant="outline" className="bg-zinc-900">
                                  {audience}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Timeline */}
                      <div className="p-6">
                        <h3 className="text-white font-medium mb-4 flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-[#5eead4]" />
                          Timeline
                        </h3>
                        
                        <div className="space-y-4">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex items-center justify-center rounded-md bg-[#5eead4]/10 mr-3">
                              <Clock className="h-5 w-5 text-[#5eead4]" />
                            </div>
                            <div>
                              <p className="text-gray-400 text-sm">Duration</p>
                              <p className="text-white">
                                {new Date(campaign.timeline.start).toLocaleDateString()} - {new Date(campaign.timeline.end).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex items-center justify-center rounded-md bg-[#5eead4]/10 mr-3">
                              <Users className="h-5 w-5 text-[#5eead4]" />
                            </div>
                            <div>
                              <p className="text-gray-400 text-sm">Channels</p>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {campaign.channels.map((channel, idx) => (
                                  <Badge key={idx} variant="outline" className="bg-zinc-900">
                                    {channel}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Content Summary */}
                      <div className="p-6">
                        <h3 className="text-white font-medium mb-4 flex items-center">
                          <FileText className="h-4 w-4 mr-2 text-[#5eead4]" />
                          Content Summary
                        </h3>
                        
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-3">
                            <div className="bg-zinc-900 rounded-lg p-3 border border-zinc-800">
                              <p className="text-[#5eead4] text-lg font-bold">{campaign.contents.filter(c => c.type === 'email').length}</p>
                              <p className="text-gray-400 text-sm">Emails</p>
                            </div>
                            
                            <div className="bg-zinc-900 rounded-lg p-3 border border-zinc-800">
                              <p className="text-[#5eead4] text-lg font-bold">{campaign.contents.filter(c => c.type === 'social').length}</p>
                              <p className="text-gray-400 text-sm">LinkedIn Posts</p>
                            </div>
                            
                            <div className="bg-zinc-900 rounded-lg p-3 border border-zinc-800">
                              <p className="text-[#5eead4] text-lg font-bold">{campaign.contents.filter(c => c.type === 'blog').length}</p>
                              <p className="text-gray-400 text-sm">Blog Articles</p>
                            </div>
                            
                            <div className="bg-zinc-900 rounded-lg p-3 border border-zinc-800">
                              <p className="text-[#5eead4] text-lg font-bold">{campaign.contents.filter(c => c.type === 'webinar').length}</p>
                              <p className="text-gray-400 text-sm">Webinars</p>
                            </div>
                          </div>
                          
                          <Button 
                            className="w-full bg-[#5eead4] hover:bg-[#4fd8c0] text-black"
                            onClick={handleSaveCampaign}
                          >
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Save to Campaigns
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Campaign Content */}
                <Card className="bg-black border border-zinc-800 shadow-[0_4px_20px_rgba(0,0,0,0.3)] overflow-hidden">
                  <CardHeader className="border-b border-zinc-800/60 bg-gradient-to-r from-[#0e1b33] to-black px-6">
                    <CardTitle className="text-xl text-white flex items-center">
                      <div className="h-8 w-8 mr-3 flex items-center justify-center rounded-md bg-[#5eead4]/10 border border-[#5eead4]/30">
                        <FileText className="h-5 w-5 text-[#5eead4]" />
                      </div>
                      {campaign.name} Content
                    </CardTitle>
                    <CardDescription>
                      Review and customize your generated content pieces
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="p-0">
                    <Tabs defaultValue="all" className="w-full">
                      <div className="border-b border-zinc-800/60">
                        <div className="px-6">
                          <TabsList className="bg-black h-14">
                            <TabsTrigger value="all" className="data-[state=active]:bg-[#5eead4]/10 data-[state=active]:text-[#5eead4]">
                              All Content
                            </TabsTrigger>
                            <TabsTrigger value="email" className="data-[state=active]:bg-[#5eead4]/10 data-[state=active]:text-[#5eead4]">
                              Email
                            </TabsTrigger>
                            <TabsTrigger value="social" className="data-[state=active]:bg-[#5eead4]/10 data-[state=active]:text-[#5eead4]">
                              LinkedIn
                            </TabsTrigger>
                            <TabsTrigger value="blog" className="data-[state=active]:bg-[#5eead4]/10 data-[state=active]:text-[#5eead4]">
                              Blog
                            </TabsTrigger>
                            <TabsTrigger value="webinar" className="data-[state=active]:bg-[#5eead4]/10 data-[state=active]:text-[#5eead4]">
                              Webinar
                            </TabsTrigger>
                          </TabsList>
                        </div>
                      </div>
                      
                      <TabsContent value="all" className="p-6 space-y-6">
                        {campaign.contents.map((content) => (
                          <div key={content.id} className="border border-zinc-800 rounded-lg overflow-hidden">
                            <div className="bg-zinc-900 p-4 flex justify-between items-center">
                              <div className="flex items-center">
                                <div className="h-8 w-8 flex items-center justify-center rounded-md bg-[#5eead4]/10 mr-3">
                                  {content.icon}
                                </div>
                                <div>
                                  <h3 className="text-white font-medium">{content.title}</h3>
                                  <div className="flex items-center text-sm space-x-2 mt-1">
                                    <Badge variant="outline" className="bg-zinc-800 text-gray-300">
                                      {content.type === 'social' ? 'LinkedIn' : content.type.charAt(0).toUpperCase() + content.type.slice(1)}
                                    </Badge>
                                    <span className="text-gray-500">•</span>
                                    <span className="text-gray-400">{content.persona}</span>
                                    {content.deliveryDate && (
                                      <>
                                        <span className="text-gray-500">•</span>
                                        <span className="text-gray-400">{new Date(content.deliveryDate).toLocaleDateString()}</span>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex items-center space-x-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="border-zinc-700 hover:bg-zinc-800"
                                >
                                  Edit
                                </Button>
                              </div>
                            </div>
                            
                            <div className="p-4 bg-black">
                              <pre className="text-sm text-gray-300 whitespace-pre-wrap bg-black font-sans">
                                {content.content}
                              </pre>
                            </div>
                          </div>
                        ))}
                      </TabsContent>
                      
                      <TabsContent value="email" className="p-6 space-y-6">
                        {campaign.contents.filter(c => c.type === 'email').map((content) => (
                          <div key={content.id} className="border border-zinc-800 rounded-lg overflow-hidden">
                            <div className="bg-zinc-900 p-4 flex justify-between items-center">
                              <div className="flex items-center">
                                <div className="h-8 w-8 flex items-center justify-center rounded-md bg-[#5eead4]/10 mr-3">
                                  <MessageSquare className="h-5 w-5 text-[#5eead4]" />
                                </div>
                                <div>
                                  <h3 className="text-white font-medium">{content.title}</h3>
                                  <div className="flex items-center text-sm space-x-2 mt-1">
                                    <Badge variant="outline" className="bg-zinc-800 text-gray-300">
                                      Email
                                    </Badge>
                                    <span className="text-gray-500">•</span>
                                    <span className="text-gray-400">{content.persona}</span>
                                    {content.deliveryDate && (
                                      <>
                                        <span className="text-gray-500">•</span>
                                        <span className="text-gray-400">{new Date(content.deliveryDate).toLocaleDateString()}</span>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex items-center space-x-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="border-zinc-700 hover:bg-zinc-800"
                                >
                                  Edit
                                </Button>
                              </div>
                            </div>
                            
                            <div className="p-4 bg-black">
                              <pre className="text-sm text-gray-300 whitespace-pre-wrap bg-black font-sans">
                                {content.content}
                              </pre>
                            </div>
                          </div>
                        ))}
                        
                        {campaign.contents.filter(c => c.type === 'email').length === 0 && (
                          <div className="text-center py-12">
                            <p className="text-gray-400">No email content in this campaign</p>
                          </div>
                        )}
                      </TabsContent>
                      
                      <TabsContent value="social" className="p-6 space-y-6">
                        {campaign.contents.filter(c => c.type === 'social').map((content) => (
                          <div key={content.id} className="border border-zinc-800 rounded-lg overflow-hidden">
                            <div className="bg-zinc-900 p-4 flex justify-between items-center">
                              <div className="flex items-center">
                                <div className="h-8 w-8 flex items-center justify-center rounded-md bg-[#5eead4]/10 mr-3">
                                  <FileText className="h-5 w-5 text-[#5eead4]" />
                                </div>
                                <div>
                                  <h3 className="text-white font-medium">{content.title}</h3>
                                  <div className="flex items-center text-sm space-x-2 mt-1">
                                    <Badge variant="outline" className="bg-zinc-800 text-gray-300">
                                      LinkedIn
                                    </Badge>
                                    <span className="text-gray-500">•</span>
                                    <span className="text-gray-400">{content.persona}</span>
                                    {content.deliveryDate && (
                                      <>
                                        <span className="text-gray-500">•</span>
                                        <span className="text-gray-400">{new Date(content.deliveryDate).toLocaleDateString()}</span>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex items-center space-x-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="border-zinc-700 hover:bg-zinc-800"
                                >
                                  Edit
                                </Button>
                              </div>
                            </div>
                            
                            <div className="p-4 bg-black">
                              <pre className="text-sm text-gray-300 whitespace-pre-wrap bg-black font-sans">
                                {content.content}
                              </pre>
                            </div>
                          </div>
                        ))}
                        
                        {campaign.contents.filter(c => c.type === 'social').length === 0 && (
                          <div className="text-center py-12">
                            <p className="text-gray-400">No LinkedIn content in this campaign</p>
                          </div>
                        )}
                      </TabsContent>
                      
                      <TabsContent value="blog" className="p-6 space-y-6">
                        {campaign.contents.filter(c => c.type === 'blog').map((content) => (
                          <div key={content.id} className="border border-zinc-800 rounded-lg overflow-hidden">
                            <div className="bg-zinc-900 p-4 flex justify-between items-center">
                              <div className="flex items-center">
                                <div className="h-8 w-8 flex items-center justify-center rounded-md bg-[#5eead4]/10 mr-3">
                                  <FileText className="h-5 w-5 text-[#5eead4]" />
                                </div>
                                <div>
                                  <h3 className="text-white font-medium">{content.title}</h3>
                                  <div className="flex items-center text-sm space-x-2 mt-1">
                                    <Badge variant="outline" className="bg-zinc-800 text-gray-300">
                                      Blog
                                    </Badge>
                                    <span className="text-gray-500">•</span>
                                    <span className="text-gray-400">{content.persona}</span>
                                    {content.deliveryDate && (
                                      <>
                                        <span className="text-gray-500">•</span>
                                        <span className="text-gray-400">{new Date(content.deliveryDate).toLocaleDateString()}</span>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex items-center space-x-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="border-zinc-700 hover:bg-zinc-800"
                                >
                                  Edit
                                </Button>
                              </div>
                            </div>
                            
                            <div className="p-4 bg-black">
                              <pre className="text-sm text-gray-300 whitespace-pre-wrap bg-black font-sans">
                                {content.content}
                              </pre>
                            </div>
                          </div>
                        ))}
                        
                        {campaign.contents.filter(c => c.type === 'blog').length === 0 && (
                          <div className="text-center py-12">
                            <p className="text-gray-400">No blog content in this campaign</p>
                          </div>
                        )}
                      </TabsContent>
                      
                      <TabsContent value="webinar" className="p-6 space-y-6">
                        {campaign.contents.filter(c => c.type === 'webinar').map((content) => (
                          <div key={content.id} className="border border-zinc-800 rounded-lg overflow-hidden">
                            <div className="bg-zinc-900 p-4 flex justify-between items-center">
                              <div className="flex items-center">
                                <div className="h-8 w-8 flex items-center justify-center rounded-md bg-[#5eead4]/10 mr-3">
                                  <FileText className="h-5 w-5 text-[#5eead4]" />
                                </div>
                                <div>
                                  <h3 className="text-white font-medium">{content.title}</h3>
                                  <div className="flex items-center text-sm space-x-2 mt-1">
                                    <Badge variant="outline" className="bg-zinc-800 text-gray-300">
                                      Webinar
                                    </Badge>
                                    <span className="text-gray-500">•</span>
                                    <span className="text-gray-400">{content.persona}</span>
                                    {content.deliveryDate && (
                                      <>
                                        <span className="text-gray-500">•</span>
                                        <span className="text-gray-400">{new Date(content.deliveryDate).toLocaleDateString()}</span>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex items-center space-x-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="border-zinc-700 hover:bg-zinc-800"
                                >
                                  Edit
                                </Button>
                              </div>
                            </div>
                            
                            <div className="p-4 bg-black">
                              <pre className="text-sm text-gray-300 whitespace-pre-wrap bg-black font-sans">
                                {content.content}
                              </pre>
                            </div>
                          </div>
                        ))}
                        
                        {campaign.contents.filter(c => c.type === 'webinar').length === 0 && (
                          <div className="text-center py-12">
                            <p className="text-gray-400">No webinar content in this campaign</p>
                          </div>
                        )}
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                  
                  <CardFooter className="border-t border-zinc-800/60 px-6 py-4 flex justify-between">
                    <Button 
                      variant="outline" 
                      className="border-zinc-700 hover:bg-zinc-800"
                      onClick={() => setActiveTab("input")}
                    >
                      <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
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