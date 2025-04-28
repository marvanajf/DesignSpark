import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import { ArrowRight, FileText, Users, PenTool, CheckCircle, ChevronDown, BarChart3, MessageSquare, LineChart, Lightbulb, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuthModal } from "@/hooks/use-auth-modal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function HomePage() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const { openAuthModal } = useAuthModal();

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleGetStarted = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      openAuthModal();
    }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <div className="relative py-8 sm:py-10 lg:py-12 bg-black overflow-hidden">
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 border border-gray-700/60 rounded-lg py-8 shadow-[0_0_25px_rgba(116,209,234,0.15)]">
          <h1 className="text-4xl tracking-tight font-semibold sm:text-5xl md:text-6xl max-w-4xl mx-auto">
            <span className="block text-white">Transform your</span>
            <span className="block text-[#74d1ea]">content strategy</span>
          </h1>
          <p className="mt-6 text-base text-gray-400 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl max-w-3xl mx-auto">
            Analyze your brand's tone of voice, target specific personas, and 
            generate perfectly tailored content for LinkedIn and cold emails.
          </p>
          <div className="mt-8 sm:mt-12 flex flex-col items-center">
            <div className="rounded-md">
              <Button 
                onClick={handleGetStarted}
                className="w-full sm:w-auto px-8 py-3 md:py-4 md:text-lg md:px-10 bg-[#74d1ea] hover:bg-[#5db8d0] text-black shadow-[0_0_10px_rgba(116,209,234,0.4)]"
              >
                Get started free
              </Button>
            </div>
            <p className="mt-3 text-sm text-gray-400">
              No credit card required. Start generating in minutes.
            </p>
          </div>
        </div>
      </div>

      {/* Main Features Placeholder - replaced with detailed features below */}
      <div className="py-2 bg-black relative overflow-hidden">
        {/* This div serves as a small spacer between the hero and detailed features */}
      </div>

      {/* Platform Features Sections */}
      <div className="py-6 bg-black relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Tone Analysis Section */}
          <div className="mb-8 border border-gray-700/60 rounded-lg overflow-hidden shadow-[0_0_20px_rgba(116,209,234,0.15)]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
              <div className="p-8 flex flex-col justify-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-md bg-[#74d1ea]/20 mb-5 border border-[#74d1ea]/30">
                  <BarChart3 className="h-6 w-6 text-[#74d1ea]" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-4">Advanced Tone Analysis</h3>
                <p className="text-gray-400 mb-5">
                  Decode your brand's unique voice with our AI-powered tone analysis. Understand exactly how professional, conversational, technical, or formal your content appears to your audience.
                </p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-[#74d1ea] mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">Quantitative tone metrics across 5 key dimensions</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-[#74d1ea] mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">Identify your most common language patterns</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-[#74d1ea] mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">Content type recommendations based on your tone</span>
                  </li>
                </ul>
                <div>
                  <Button 
                    onClick={() => window.location.href = "/platform/tone-analysis"}
                    variant="outline"
                    className="border-[#74d1ea] text-[#74d1ea] hover:bg-[#74d1ea]/10"
                  >
                    Explore Tone Analysis
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="bg-gray-900/50 p-8 flex items-center justify-center">
                <div className="rounded-lg border border-gray-700/70 bg-black/60 p-6 shadow-[0_0_15px_rgba(116,209,234,0.10)] w-full max-w-md">
                  <h4 className="text-lg font-medium text-white mb-3">Tone Analysis Results</h4>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-300">Professional</span>
                        <span className="text-sm text-[#74d1ea]">85%</span>
                      </div>
                      <div className="w-full bg-gray-700/30 rounded-full h-2">
                        <div className="bg-[#74d1ea] h-2 rounded-full" style={{ width: "85%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-300">Conversational</span>
                        <span className="text-sm text-[#74d1ea]">72%</span>
                      </div>
                      <div className="w-full bg-gray-700/30 rounded-full h-2">
                        <div className="bg-[#74d1ea] h-2 rounded-full" style={{ width: "72%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-300">Technical</span>
                        <span className="text-sm text-[#74d1ea]">56%</span>
                      </div>
                      <div className="w-full bg-gray-700/30 rounded-full h-2">
                        <div className="bg-[#74d1ea] h-2 rounded-full" style={{ width: "56%" }}></div>
                      </div>
                    </div>
                    <div className="pt-3 border-t border-gray-700/50">
                      <h5 className="text-sm font-medium text-white mb-2">Common Phrases</h5>
                      <div className="flex flex-wrap gap-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#74d1ea]/10 text-[#74d1ea] border border-[#74d1ea]/20">
                          data-driven insights
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#74d1ea]/10 text-[#74d1ea] border border-[#74d1ea]/20">
                          strategic solutions
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#74d1ea]/10 text-[#74d1ea] border border-[#74d1ea]/20">
                          seamless integration
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Personas Section */}
          <div className="mb-8 border border-gray-700/60 rounded-lg overflow-hidden shadow-[0_0_20px_rgba(116,209,234,0.15)]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
              <div className="order-2 md:order-1 bg-gray-900/50 p-8 flex items-center justify-center">
                <div className="rounded-lg border border-gray-700/70 bg-black/60 p-6 shadow-[0_0_15px_rgba(116,209,234,0.10)] w-full max-w-md">
                  <h4 className="text-lg font-medium text-white mb-4">Target Personas</h4>
                  <div className="space-y-4">
                    <div className="border-l-2 border-[#74d1ea] pl-4 py-1">
                      <h5 className="text-white font-medium">Tech-Savvy Marketing Director</h5>
                      <p className="text-sm text-gray-400 mt-1">Seeks innovative solutions to scale content production while maintaining brand consistency.</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#74d1ea]/10 text-[#74d1ea] border border-[#74d1ea]/20">
                          <Lightbulb className="h-3 w-3 mr-1" />
                          marketing automation
                        </span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#74d1ea]/10 text-[#74d1ea] border border-[#74d1ea]/20">
                          <Lightbulb className="h-3 w-3 mr-1" />
                          roi measurement
                        </span>
                      </div>
                    </div>
                    <div className="border-l-2 border-gray-700/60 pl-4 py-1">
                      <h5 className="text-white font-medium">Startup Founder</h5>
                      <p className="text-sm text-gray-400 mt-1">Needs to establish credibility and generate leads with limited resources.</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-800 text-gray-400 border border-gray-700/50">
                          <Lightbulb className="h-3 w-3 mr-1" />
                          venture capital
                        </span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-800 text-gray-400 border border-gray-700/50">
                          <Lightbulb className="h-3 w-3 mr-1" />
                          growth hacking
                        </span>
                      </div>
                    </div>
                    <div className="border-l-2 border-gray-700/60 pl-4 py-1">
                      <h5 className="text-white font-medium">Sales Executive</h5>
                      <p className="text-sm text-gray-400 mt-1">Focused on building relationships and increasing conversions through personalized outreach.</p>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-gray-700/50 text-right">
                    <Button 
                      onClick={() => window.location.href = "/platform/personas"}
                      variant="ghost" 
                      className="text-xs text-[#74d1ea] hover:text-[#74d1ea] hover:bg-[#74d1ea]/10"
                    >
                      Create Custom Persona
                      <PenTool className="ml-1 h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
              <div className="order-1 md:order-2 p-8 flex flex-col justify-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-md bg-[#74d1ea]/20 mb-5 border border-[#74d1ea]/30">
                  <Users className="h-6 w-6 text-[#74d1ea]" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-4">Targeted Personas</h3>
                <p className="text-gray-400 mb-5">
                  Connect with your ideal audience using tailored personas. Our platform helps you create, manage, and target specific professional personas for more effective content.
                </p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-[#74d1ea] mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">Create AI-generated or custom personas</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-[#74d1ea] mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">Define interests, pain points, and motivations</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-[#74d1ea] mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">Generate content specifically tailored to each persona</span>
                  </li>
                </ul>
                <div>
                  <Button 
                    onClick={() => window.location.href = "/platform/personas"}
                    variant="outline"
                    className="border-[#74d1ea] text-[#74d1ea] hover:bg-[#74d1ea]/10"
                  >
                    Explore Personas
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Content Generation Section */}
          <div className="mb-8 border border-gray-700/60 rounded-lg overflow-hidden shadow-[0_0_20px_rgba(116,209,234,0.15)]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
              <div className="p-8 flex flex-col justify-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-md bg-[#74d1ea]/20 mb-5 border border-[#74d1ea]/30">
                  <Sparkles className="h-6 w-6 text-[#74d1ea]" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-4">Content Generation</h3>
                <p className="text-gray-400 mb-5">
                  Create compelling content that maintains your brand voice while resonating with your target audience. Tovably generates LinkedIn posts and cold emails that drive engagement and conversions.
                </p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-[#74d1ea] mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">Personalized LinkedIn posts that drive engagement</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-[#74d1ea] mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">Effective cold emails that increase response rates</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-[#74d1ea] mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">Content that perfectly balances your tone and persona needs</span>
                  </li>
                </ul>
                <div>
                  <Button 
                    onClick={() => window.location.href = "/platform/content-generator"}
                    variant="outline"
                    className="border-[#74d1ea] text-[#74d1ea] hover:bg-[#74d1ea]/10"
                  >
                    Explore Content Generation
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="bg-gray-900/50 p-8 flex items-center justify-center">
                <div className="rounded-lg border border-gray-700/70 bg-black/60 p-6 shadow-[0_0_15px_rgba(116,209,234,0.10)] w-full max-w-md">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-medium text-white">Generated Content</h4>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm" className="h-8 px-2 text-[#74d1ea]">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 px-2 text-[#74d1ea]">
                        <LineChart className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="rounded-lg bg-gray-900/70 p-4 mb-4 border border-gray-700/60">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-[#74d1ea]">LinkedIn Post</span>
                      <span className="text-xs text-gray-400">Tech-Savvy Marketing Director</span>
                    </div>
                    <p className="text-sm text-gray-300">
                      Excited to share how our marketing team increased content engagement by 43% last quarter through AI-powered personalization. The key? Balancing automation with authentic brand voice. Anyone else exploring this balance between efficiency and authenticity in their content strategy? #MarketingAutomation #ContentStrategy
                    </p>
                  </div>
                  <div className="rounded-lg bg-gray-900/40 p-4 border border-gray-700/40">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-gray-400">Cold Email</span>
                      <span className="text-xs text-gray-500">Sales Executive</span>
                    </div>
                    <p className="text-sm text-gray-400 opacity-70">
                      Hi [Name], <br/><br/>
                      I noticed [Company] has been expanding your content marketing efforts, and thought you might be interested in how similar companies are using AI to scale their production while maintaining quality...<span className="opacity-30">Read more</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div id="testimonials" className="py-6 bg-black relative overflow-hidden">
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center border border-gray-700/60 rounded-lg py-8 px-4 shadow-[0_0_20px_rgba(116,209,234,0.15)]">
            <h2 className="text-3xl font-semibold sm:text-4xl text-white">
              <span className="block">Trusted by content professionals</span>
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-400 mx-auto">
              See what marketing teams are saying about Tovably.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="bg-gray-900/30 backdrop-blur-sm rounded-lg p-6 border border-gray-700/60 shadow-[0_0_15px_rgba(116,209,234,0.15)]">
              <div className="flex items-center mb-4">
                <div className="text-[#74d1ea]">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-lg">★</span>
                  ))}
                </div>
              </div>
              <p className="text-gray-400 mb-4">
                "Tovably has transformed how we approach our LinkedIn content strategy. The tone analysis is spot-on and the content generation saves us hours every week."
              </p>
              <div className="flex items-center">
                <img 
                  className="h-10 w-10 rounded-full" 
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                  alt="Testimonial from Sarah Johnson" 
                />
                <div className="ml-3">
                  <p className="text-sm font-medium text-white">Sarah Johnson</p>
                  <p className="text-xs text-gray-400">Marketing Director, TechCorp</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-900/30 backdrop-blur-sm rounded-lg p-6 border border-gray-700/60 shadow-[0_0_15px_rgba(116,209,234,0.15)]">
              <div className="flex items-center mb-4">
                <div className="text-[#74d1ea]">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-lg">★</span>
                  ))}
                </div>
              </div>
              <p className="text-gray-400 mb-4">
                "Our cold email response rates have increased by 37% since we started using Tovably. The persona targeting feature is incredibly effective."
              </p>
              <div className="flex items-center">
                <img 
                  className="h-10 w-10 rounded-full" 
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                  alt="Testimonial from Michael Chen" 
                />
                <div className="ml-3">
                  <p className="text-sm font-medium text-white">Michael Chen</p>
                  <p className="text-xs text-gray-400">Sales Manager, GrowthFirm</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-900/30 backdrop-blur-sm rounded-lg p-6 border border-gray-700/60 shadow-[0_0_15px_rgba(116,209,234,0.15)]">
              <div className="flex items-center mb-4">
                <div className="text-[#74d1ea]">
                  {[...Array(4)].map((_, i) => (
                    <span key={i} className="text-lg">★</span>
                  ))}
                  <span className="text-[#74d1ea] opacity-30 text-lg">★</span>
                </div>
              </div>
              <p className="text-gray-400 mb-4">
                "As a content team of one, Tovably gives me the ability to scale my output while maintaining a consistent brand voice across all channels."
              </p>
              <div className="flex items-center">
                <img 
                  className="h-10 w-10 rounded-full" 
                  src="https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                  alt="Testimonial from Emma Rodriguez" 
                />
                <div className="ml-3">
                  <p className="text-sm font-medium text-white">Emma Rodriguez</p>
                  <p className="text-xs text-gray-400">Content Creator, Startup Inc.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-6 bg-black relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="border border-gray-700/60 rounded-lg py-8 px-6 shadow-[0_0_20px_rgba(116,209,234,0.15)]">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-1">
                <h2 className="text-2xl font-semibold text-white">
                  Frequently<br />
                  asked questions
                </h2>
              </div>
              
              <div className="md:col-span-2">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1" className="border-b border-gray-700/70">
                    <AccordionTrigger className="text-white hover:text-[#74d1ea] text-left py-4">
                      What content types does Tovably support?
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-400 pb-4">
                      Currently, Tovably supports LinkedIn posts and cold emails. We analyze your brand's tone and adapt it to these formats while targeting specific professional personas.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-2" className="border-b border-gray-700/70">
                    <AccordionTrigger className="text-white hover:text-[#74d1ea] text-left py-4">
                      How does tone analysis work?
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-400 pb-4">
                      Our AI analyzes your existing content to identify key characteristics of your brand's tone, including professionalism level, conversational style, technical complexity, and formality.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-3" className="border-b border-gray-700/70">
                    <AccordionTrigger className="text-white hover:text-[#74d1ea] text-left py-4">
                      How many personas can I create?
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-400 pb-4">
                      There's no limit to the number of personas you can create. You can generate AI-powered personas or create custom personas manually to target specific audience segments.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-4" className="border-b border-gray-700/70">
                    <AccordionTrigger className="text-white hover:text-[#74d1ea] text-left py-4">
                      Can I modify generated content?
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-400 pb-4">
                      Absolutely! All generated content can be edited, refined, and saved for future reference. You maintain full control over the final output.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-5" className="border-b border-gray-700/70">
                    <AccordionTrigger className="text-white hover:text-[#74d1ea] text-left py-4">
                      Is my content data secure?
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-400 pb-4">
                      Yes, we take data security seriously. Your content and analysis are kept private and secure. We don't use your content to train our models or share it with third parties.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-6" className="border-b border-gray-700/70">
                    <AccordionTrigger className="text-white hover:text-[#74d1ea] text-left py-4">
                      Can I export my generated content?
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-400 pb-4">
                      Yes, you can easily copy, download, or share your generated content directly from the platform to use in your marketing campaigns.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-6 bg-black relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="border border-gray-700/60 rounded-lg py-10 px-4 shadow-[0_0_30px_rgba(116,209,234,0.20)]">
            <h2 className="text-3xl font-semibold sm:text-4xl text-white">
              <span className="block mb-2">Ready to transform your</span>
              <span className="block text-[#74d1ea]">content strategy?</span>
            </h2>
            <p className="mt-6 text-xl text-gray-400 max-w-3xl mx-auto">
              Start generating perfectly tailored LinkedIn posts and cold emails today.
            </p>
            <div className="mt-8">
              <Button
                onClick={handleGetStarted}
                className="px-8 py-3 md:py-4 md:text-lg md:px-10 bg-[#74d1ea] hover:bg-[#5db8d0] text-black shadow-[0_0_10px_rgba(116,209,234,0.4)]"
              >
                Get started free
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
