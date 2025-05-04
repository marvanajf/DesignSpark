import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import { ArrowRight, FileText, Users, PenTool, CheckCircle, ChevronDown, BarChart3, MessageSquare, LineChart, Lightbulb, Sparkles, CalendarClock, Clock, Timer, Pencil, LayoutGrid } from "lucide-react";
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
      <div className="py-10 bg-black relative overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-[#74d1ea]/3 rounded-full blur-[100px] opacity-60" />
        <div className="absolute top-1/4 right-1/3 w-[25%] h-[25%] bg-[#74d1ea]/5 rounded-full blur-[80px] opacity-40" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="border border-gray-700/60 rounded-lg py-12 px-8 md:px-10 shadow-[0_0_25px_rgba(116,209,234,0.15)] backdrop-blur-sm bg-black/30 text-center">
            <h1 className="text-4xl tracking-tight font-semibold sm:text-5xl md:text-6xl max-w-4xl mx-auto leading-tight">
              <span className="block text-white mb-2">Build better campaigns with</span>
              <span className="block text-[#74d1ea] text-glow">AI-powered workflows</span>
            </h1>
            <p className="mt-6 text-base text-gray-300 sm:text-xl lg:text-lg xl:text-xl max-w-3xl mx-auto leading-relaxed">
              From tone analysis to complete campaign creation, our OpenAI-powered platform delivers
              targeted communications that engage, convert, and elevate your brand.
            </p>
            <div className="mt-8 sm:mt-10 flex flex-col items-center">
              <div className="rounded-md">
                <Button 
                  onClick={handleGetStarted}
                  className="w-full sm:w-auto px-10 py-4 text-lg bg-[#74d1ea] hover:bg-[#5db8d0] text-black font-medium shadow-[0_0_12px_rgba(116,209,234,0.4)] transition-all duration-200 hover:shadow-[0_0_18px_rgba(116,209,234,0.5)]"
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
      </div>

      {/* AI Native App Section */}
      <div className="py-8 bg-black relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="border border-gray-700/60 rounded-lg py-10 px-6 shadow-[0_0_25px_rgba(116,209,234,0.15)]">
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#74d1ea]/20 mb-4 border border-[#74d1ea]/30">
                <Sparkles className="h-8 w-8 text-[#74d1ea]" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-semibold text-white">AI-Native Platform</h2>
              <p className="mt-4 text-lg text-gray-400 max-w-3xl mx-auto">
                Built from the ground up with AI at its core, Tovably leverages cutting-edge machine learning to transform how you communicate.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-zinc-900/50 rounded-lg p-6 border border-gray-800/60">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-md bg-[#74d1ea]/10 mb-4 border border-[#74d1ea]/20">
                  <BarChart3 className="h-6 w-6 text-[#74d1ea]" />
                </div>
                <h3 className="text-xl font-medium text-white mb-2">OpenAI Powered Analysis</h3>
                <p className="text-gray-400">
                  Our platform utilizes the latest OpenAI models to precisely analyze content tone, identify patterns, and extract key insights.
                </p>
              </div>
              
              <div className="bg-zinc-900/50 rounded-lg p-6 border border-gray-800/60">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-md bg-[#74d1ea]/10 mb-4 border border-[#74d1ea]/20">
                  <Users className="h-6 w-6 text-[#74d1ea]" />
                </div>
                <h3 className="text-xl font-medium text-white mb-2">Dynamic Persona Engine</h3>
                <p className="text-gray-400">
                  Our intelligent persona system creates detailed audience profiles that evolve and improve with each interaction.
                </p>
              </div>
              
              <div className="bg-zinc-900/50 rounded-lg p-6 border border-gray-800/60">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-md bg-[#74d1ea]/10 mb-4 border border-[#74d1ea]/20">
                  <MessageSquare className="h-6 w-6 text-[#74d1ea]" />
                </div>
                <h3 className="text-xl font-medium text-white mb-2">Adaptive Content Creation</h3>
                <p className="text-gray-400">
                  Generate precisely tailored content that adapts to your brand voice and resonates with your target personas automatically.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Campaign Factory Promo Section */}
      <div className="py-10 bg-black relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="border border-gray-700/60 rounded-lg overflow-hidden shadow-[0_0_30px_rgba(116,209,234,0.20)]">
            <div className="bg-gradient-to-r from-black via-[#74d1ea]/5 to-black p-1">
              <div className="bg-black p-6 md:p-8 text-center md:text-left">
                <div className="grid grid-cols-1 md:grid-cols-7 gap-8 items-center">
                  <div className="md:col-span-4">
                    <div className="inline-flex items-center justify-center mb-4 px-3 py-1 bg-[#74d1ea]/10 border border-[#74d1ea]/30 rounded-full">
                      <Sparkles className="h-4 w-4 text-[#74d1ea] mr-2" />
                      <span className="text-[#74d1ea] text-sm font-medium">Premium Feature</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4">Campaign Factory</h2>
                    <p className="text-gray-300 text-lg mb-6 max-w-2xl">
                      Create complete marketing campaigns in minutes, not weeks. Our OpenAI-powered Campaign Factory automatically generates all the content you need across multiple channels.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 bg-[#74d1ea]/10 p-2 rounded-lg border border-[#74d1ea]/20 mr-3">
                          <Sparkles className="h-5 w-5 text-[#74d1ea]" />
                        </div>
                        <div>
                          <h3 className="text-white font-medium mb-1">Save 20+ hours</h3>
                          <p className="text-sm text-gray-400">Generate weeks of content in just minutes</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="flex-shrink-0 bg-[#74d1ea]/10 p-2 rounded-lg border border-[#74d1ea]/20 mr-3">
                          <LineChart className="h-5 w-5 text-[#74d1ea]" />
                        </div>
                        <div>
                          <h3 className="text-white font-medium mb-1">Multi-channel</h3>
                          <p className="text-sm text-gray-400">LinkedIn, blogs, emails, webinars & more</p>
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={() => window.location.href = "/pricing"}
                      className="bg-[#74d1ea] hover:bg-[#5db8d0] text-black font-medium px-6 py-2.5 rounded-md shadow-[0_0_12px_rgba(116,209,234,0.3)]"
                    >
                      Upgrade to unlock
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>

                  <div className="md:col-span-3 bg-zinc-900/50 rounded-lg p-4 border border-gray-800/60 shadow-[0_0_15px_rgba(116,209,234,0.10)]">
                    <div className="text-center mb-4">
                      <h3 className="text-white font-medium">What you get with Campaign Factory</h3>
                    </div>
                    <div className="space-y-3">
                      <div className="bg-black/40 rounded-md p-3 border border-gray-700/50">
                        <div className="flex items-center">
                          <div className="bg-[#74d1ea]/10 p-1.5 rounded mr-3">
                            <MessageSquare className="h-4 w-4 text-[#74d1ea]" />
                          </div>
                          <span className="text-sm text-white">LinkedIn posts (4-6 per campaign)</span>
                        </div>
                      </div>
                      <div className="bg-black/40 rounded-md p-3 border border-gray-700/50">
                        <div className="flex items-center">
                          <div className="bg-[#74d1ea]/10 p-1.5 rounded mr-3">
                            <FileText className="h-4 w-4 text-[#74d1ea]" />
                          </div>
                          <span className="text-sm text-white">Blog outline & full article</span>
                        </div>
                      </div>
                      <div className="bg-black/40 rounded-md p-3 border border-gray-700/50">
                        <div className="flex items-center">
                          <div className="bg-[#74d1ea]/10 p-1.5 rounded mr-3">
                            <MessageSquare className="h-4 w-4 text-[#74d1ea]" />
                          </div>
                          <span className="text-sm text-white">Email sequence (3 emails)</span>
                        </div>
                      </div>
                      <div className="bg-black/40 rounded-md p-3 border border-gray-700/50">
                        <div className="flex items-center">
                          <div className="bg-[#74d1ea]/10 p-1.5 rounded mr-3">
                            <Users className="h-4 w-4 text-[#74d1ea]" />
                          </div>
                          <span className="text-sm text-white">Webinar outline & key talking points</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Platform Features Sections */}
      <div className="py-6 bg-black relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Tone Analysis Section */}
          <div className="mb-8 border border-gray-700/60 rounded-lg overflow-hidden shadow-[0_0_25px_rgba(116,209,234,0.15)]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
              <div className="p-8 flex flex-col justify-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-md bg-[#74d1ea]/20 mb-5 border border-[#74d1ea]/30">
                  <BarChart3 className="h-6 w-6 text-[#74d1ea]" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-4">Advanced Tone Analysis</h3>
                <p className="text-gray-400 mb-5">
                  Decode your brand's unique voice with our OpenAI-powered tone analysis. Understand exactly how professional, conversational, technical, or formal your content appears to your audience.
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
                    onClick={() => window.location.href = "/tone-analysis-info"}
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
          <div className="mb-8 border border-gray-700/60 rounded-lg overflow-hidden shadow-[0_0_25px_rgba(116,209,234,0.15)]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
              <div className="order-2 md:order-1 bg-gray-900/50 p-8 flex items-center justify-center">
                <div className="rounded-lg border border-gray-700/70 bg-black/60 p-6 shadow-[0_0_15px_rgba(116,209,234,0.10)] w-full max-w-md">
                  <h4 className="text-lg font-medium text-white mb-4">OpenAI Personas</h4>
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
                      onClick={() => window.location.href = "/personas-info"}
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
                <h3 className="text-2xl font-semibold text-white mb-4">OpenAI Personas</h3>
                <p className="text-gray-400 mb-5">
                  Connect with your ideal audience using tailored personas. Our platform helps you create, manage, and target specific professional personas for more effective content.
                </p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-[#74d1ea] mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">Create OpenAI-generated or custom personas</span>
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
                    onClick={() => window.location.href = "/personas-info"}
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
          <div className="mb-8 border border-gray-700/60 rounded-lg overflow-hidden shadow-[0_0_25px_rgba(116,209,234,0.15)]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
              <div className="p-8 flex flex-col justify-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-md bg-[#74d1ea]/20 mb-5 border border-[#74d1ea]/30">
                  <Sparkles className="h-6 w-6 text-[#74d1ea]" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-4">OpenAI Content Generation</h3>
                <p className="text-gray-400 mb-5">
                  Generate powerful content that perfectly balances your brand voice with audience expectations. Create compelling LinkedIn posts, cold emails, blog articles, and more that drive engagement and conversions.
                </p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-[#74d1ea] mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">Multi-format content for social media, emails, and blogs</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-[#74d1ea] mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">Tone-matched writing based on your brand analysis</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-[#74d1ea] mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">Persona-targeted messaging that resonates with your audience</span>
                  </li>
                </ul>
                <div>
                  <Button 
                    onClick={() => window.location.href = "/content-generation-info"}
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
                    <div className="flex space-x-1">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#74d1ea]/10 text-[#74d1ea] border border-[#74d1ea]/20">
                        Professional
                      </span>
                    </div>
                  </div>
                  <div className="rounded-lg bg-gray-900/70 p-4 mb-4 border border-gray-700/60">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-[#74d1ea]">LinkedIn Post</span>
                      <span className="text-xs text-gray-400">For: Marketing Directors</span>
                    </div>
                    <p className="text-sm text-gray-300">
                      Excited to share how our marketing team increased content engagement by 43% last quarter through OpenAI-powered personalization. The key? Balancing automation with authentic brand voice. Anyone else exploring this balance between efficiency and authenticity in their content strategy? #MarketingAutomation #ContentStrategy
                    </p>
                    <div className="flex justify-end mt-2">
                      <Button variant="ghost" size="sm" className="h-6 px-2 text-[#74d1ea] hover:bg-[#74d1ea]/10">
                        <PenTool className="h-3 w-3 mr-1" />
                        <span className="text-xs">Edit</span>
                      </Button>
                    </div>
                  </div>
                  <div className="rounded-lg bg-gray-900/40 p-4 border border-gray-700/40">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-[#74d1ea]">Cold Email</span>
                      <span className="text-xs text-gray-400">For: Sales Prospects</span>
                    </div>
                    <p className="text-sm text-gray-300">
                      Hi [Name], <br/><br/>
                      I noticed [Company] has been expanding your content marketing efforts, and thought you might be interested in how similar companies are using OpenAI to scale their production while maintaining quality...
                    </p>
                    <div className="flex justify-end mt-2">
                      <Button variant="ghost" size="sm" className="h-6 px-2 text-[#74d1ea] hover:bg-[#74d1ea]/10">
                        <ArrowRight className="h-3 w-3 mr-1" />
                        <span className="text-xs">View full</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Campaigns Section */}
          <div className="mb-8 border border-gray-700/60 rounded-lg overflow-hidden shadow-[0_0_25px_rgba(116,209,234,0.15)]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
              <div className="order-2 md:order-1 bg-gray-900/50 p-8 flex items-center justify-center">
                <div className="rounded-lg border border-gray-700/70 bg-black/60 p-6 shadow-[0_0_15px_rgba(116,209,234,0.10)] w-full max-w-md">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-medium text-white">Campaign Dashboard</h4>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#74d1ea]/10 text-[#74d1ea] border border-[#74d1ea]/20">
                      2 Active
                    </span>
                  </div>
                  <div className="space-y-4">
                    <div className="rounded-lg bg-black p-4 border border-gray-700/60 shadow-[0_0_10px_rgba(116,209,234,0.05)]">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <div className="w-1 h-10 bg-[#74d1ea] rounded-full mr-3"></div>
                          <span className="text-white font-medium">Q2 Marketing Campaign</span>
                        </div>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#74d1ea]/10 text-[#74d1ea] border border-[#74d1ea]/20">
                          Active
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        <div>
                          <p className="text-xs text-gray-400">Timeframe</p>
                          <p className="text-sm text-white">Apr - Jun 2025</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Progress</p>
                          <div className="flex items-center space-x-2">
                            <div className="h-2 flex-grow bg-gray-700/50 rounded-full overflow-hidden">
                              <div className="h-full bg-[#74d1ea] rounded-full" style={{ width: "65%" }}></div>
                            </div>
                            <span className="text-xs text-[#74d1ea]">65%</span>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <p className="text-xs text-gray-400">Personas</p>
                          <p className="text-sm text-white">3</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Content</p>
                          <p className="text-sm text-white">12</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Channels</p>
                          <p className="text-sm text-white">2</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="rounded-lg bg-gray-900/40 p-4 border border-gray-700/40">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <div className="w-1 h-10 bg-gray-500 rounded-full mr-3"></div>
                          <span className="text-white font-medium">Product Launch</span>
                        </div>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-800 text-gray-400 border border-gray-700/50">
                          Planning
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mb-2">
                        <div>
                          <p className="text-xs text-gray-500">Timeframe</p>
                          <p className="text-sm text-gray-300">Jul - Sep 2025</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Progress</p>
                          <div className="flex items-center space-x-2">
                            <div className="h-2 flex-grow bg-gray-700/30 rounded-full overflow-hidden">
                              <div className="h-full bg-gray-500 rounded-full" style={{ width: "20%" }}></div>
                            </div>
                            <span className="text-xs text-gray-500">20%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="order-1 md:order-2 p-8 flex flex-col justify-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-md bg-[#74d1ea]/20 mb-5 border border-[#74d1ea]/30">
                  <CalendarClock className="h-6 w-6 text-[#74d1ea]" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-4">Campaign Management</h3>
                <p className="text-gray-400 mb-5">
                  Streamline your marketing strategy with our campaign management tools. Organize personas and content into structured campaigns, track performance metrics, and optimize results in one unified platform.
                </p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-[#74d1ea] mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">Plan and execute multi-channel marketing campaigns</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-[#74d1ea] mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">Connect personas to targeted content deliverables</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-[#74d1ea] mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">Track campaign performance with visual analytics</span>
                  </li>
                </ul>
                <div>
                  <Button 
                    onClick={() => window.location.href = "/campaigns-info"}
                    variant="outline"
                    className="border-[#74d1ea] text-[#74d1ea] hover:bg-[#74d1ea]/10"
                  >
                    Explore Campaigns
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits & Time Savings Section */}
      <div className="py-14 bg-black relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] bg-[#74d1ea]/3 rounded-full blur-[100px] opacity-40" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center mb-4 px-4 py-1.5 bg-[#74d1ea]/10 border border-[#74d1ea]/30 rounded-full">
              <Clock className="h-4 w-4 text-[#74d1ea] mr-2" />
              <span className="text-[#74d1ea] text-sm font-medium">Time-Saving Benefits</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4">Save hours every week with AI</h2>
            <p className="text-gray-300 text-lg max-w-3xl mx-auto">
              Our OpenAI-powered platform dramatically reduces the time spent on content creation, analysis, and campaign management.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-black/50 border border-gray-700/60 rounded-lg p-6 shadow-[0_0_20px_rgba(116,209,234,0.10)]">
              <div className="h-14 w-14 rounded-full bg-[#74d1ea]/10 border border-[#74d1ea]/30 flex items-center justify-center mb-4">
                <Timer className="h-7 w-7 text-[#74d1ea]" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">10+ hours saved</h3>
              <p className="text-gray-400 mb-4">
                Automated tone analysis completes in seconds, not hours, with machine learning identifying patterns human editors might miss.
              </p>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center">
                  <div className="w-full bg-gray-700/30 rounded-full h-2 w-48">
                    <div className="bg-[#74d1ea] h-2 rounded-full" style={{ width: "90%" }}></div>
                  </div>
                </div>
                <span className="text-[#74d1ea] text-sm">90% faster</span>
              </div>
            </div>
            
            <div className="bg-black/50 border border-gray-700/60 rounded-lg p-6 shadow-[0_0_20px_rgba(116,209,234,0.10)]">
              <div className="h-14 w-14 rounded-full bg-[#74d1ea]/10 border border-[#74d1ea]/30 flex items-center justify-center mb-4">
                <Pencil className="h-7 w-7 text-[#74d1ea]" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">5+ hours saved</h3>
              <p className="text-gray-400 mb-4">
                Content creation workflows that used to take days now happen in minutes, with persona-specific content generated instantly.
              </p>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center">
                  <div className="w-full bg-gray-700/30 rounded-full h-2 w-48">
                    <div className="bg-[#74d1ea] h-2 rounded-full" style={{ width: "85%" }}></div>
                  </div>
                </div>
                <span className="text-[#74d1ea] text-sm">85% faster</span>
              </div>
            </div>
            
            <div className="bg-black/50 border border-gray-700/60 rounded-lg p-6 shadow-[0_0_20px_rgba(116,209,234,0.10)]">
              <div className="h-14 w-14 rounded-full bg-[#74d1ea]/10 border border-[#74d1ea]/30 flex items-center justify-center mb-4">
                <LayoutGrid className="h-7 w-7 text-[#74d1ea]" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">20+ hours saved</h3>
              <p className="text-gray-400 mb-4">
                Campaign Factory builds entire multi-channel campaigns in minutes, eliminating weeks of planning, writing, and coordination.
              </p>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center">
                  <div className="w-full bg-gray-700/30 rounded-full h-2 w-48">
                    <div className="bg-[#74d1ea] h-2 rounded-full" style={{ width: "95%" }}></div>
                  </div>
                </div>
                <span className="text-[#74d1ea] text-sm">95% faster</span>
              </div>
            </div>
          </div>
          
          <div className="border border-gray-700/60 rounded-lg p-6 bg-black/60 text-center backdrop-blur-sm">
            <div className="max-w-3xl mx-auto">
              <h3 className="text-xl md:text-2xl font-semibold text-white mb-4">What would you do with 35+ extra hours per month?</h3>
              <p className="text-gray-300 mb-6">
                Our users are focusing on strategy, client relationships, and business growth instead of getting stuck in content creation cycles.
              </p>
              <Button
                onClick={() => window.location.href = "/pricing"}
                className="bg-[#74d1ea] hover:bg-[#5db8d0] text-black font-medium px-8 py-3 rounded-md shadow-[0_0_12px_rgba(116,209,234,0.3)]"
              >
                Start saving time today
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div id="testimonials" className="py-6 bg-black relative overflow-hidden">
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center border border-gray-700/60 rounded-lg py-8 px-4 shadow-[0_0_25px_rgba(116,209,234,0.15)]">
            <h2 className="text-3xl font-semibold sm:text-4xl text-white">
              <span className="block">Trusted by content professionals</span>
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-400 mx-auto">
              See what marketing teams are saying about Tovably.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="bg-gray-900/30 backdrop-blur-sm rounded-lg p-6 border border-gray-700/60 shadow-[0_0_15px_rgba(116,209,234,0.15)]">
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
                </div>
              </div>
            </div>

            <div className="bg-gray-900/30 backdrop-blur-sm rounded-lg p-6 border border-gray-700/60 shadow-[0_0_15px_rgba(116,209,234,0.15)]">
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
                </div>
              </div>
            </div>

            <div className="bg-gray-900/30 backdrop-blur-sm rounded-lg p-6 border border-gray-700/60 shadow-[0_0_15px_rgba(116,209,234,0.15)]">
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-6 bg-black relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="border border-gray-700/60 rounded-lg py-8 px-6 shadow-[0_0_25px_rgba(116,209,234,0.15)]">
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
                      Our platform uses OpenAI to analyze your existing content and identify key characteristics of your brand's tone, including professionalism level, conversational style, technical complexity, and formality.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-3" className="border-b border-gray-700/70">
                    <AccordionTrigger className="text-white hover:text-[#74d1ea] text-left py-4">
                      How many personas can I create?
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-400 pb-4">
                      There's no limit to the number of personas you can create. You can generate OpenAI-powered personas or create custom personas manually to target specific audience segments.
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
