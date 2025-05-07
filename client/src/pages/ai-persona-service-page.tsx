import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet";
import { Link } from "wouter";
import { useEffect, useState } from "react";
import { 
  BarChart3, 
  BrainCircuit,
  Building2,
  CheckCircle,
  Check,
  Code,
  Compass,
  Layout,
  Loader2,
  MessagesSquare,
  Microscope,
  Settings,
  Sparkles,
  Target,
  User,
  Users,
  Zap,
} from "lucide-react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FeatureCard } from "@/components/FeatureCard";
import { PricingCard } from "@/components/PricingCard";
import { IndustrySelector } from "@/components/IndustrySelector";
import { Industry } from "@/lib/industries";
import { Card, CardContent } from "@/components/ui/card";
import { apiRequest } from "@/lib/queryClient";

// Inline styles for clean typography and unified design

export default function AIPersonaServicePage() {
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  // State for demo persona generation
  const [selectedIndustry, setSelectedIndustry] = useState<Industry | null>(null);
  const [demoPersona, setDemoPersona] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Function to generate a demo persona
  const generateDemoPersona = async () => {
    if (!selectedIndustry) {
      setError("Please select an industry first");
      return;
    }
    
    setIsGenerating(true);
    setError(null);
    
    try {
      const response = await apiRequest('POST', '/api/demo/generate-persona', {
        industry: selectedIndustry.name
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate persona');
      }
      
      const persona = await response.json();
      setDemoPersona(persona);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      console.error("Error generating demo persona:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>AI Persona Service | Tovably</title>
        <meta
          name="description"
          content="Create detailed, customized audience personas using OpenAI technology. Understand your ideal customers deeply with Tovably's AI Persona Service."
        />
      </Helmet>

      <div className="min-h-screen bg-white text-gray-900 flex flex-col"
           style={{
             fontFamily: "-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, sans-serif",
             fontSize: "14px",
             lineHeight: "1.4",
             letterSpacing: "-0.011em"
           }}>
        <Navbar />

        <main className="flex-grow">
          {/* Hero Section */}
          <section className="relative pt-28 pb-20 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/30 to-white z-0"></div>
            <div className="container mx-auto px-4 sm:px-6 relative z-10">
              <div className="text-center mb-4">
                <div className="inline-block bg-gray-100 text-black px-3 py-1 rounded-full text-xs font-medium tracking-wide">AI-Powered Personas</div>
              </div>

              <div className="max-w-3xl mx-auto text-center mb-10">
                <h1 className="text-4xl md:text-5xl font-bold mb-6 text-black tracking-tight leading-tight">
                  Create data-driven audience <span className="text-black">personas</span> in seconds
                </h1>
                <p className="text-lg text-black max-w-2xl mx-auto leading-relaxed">
                  Generate detailed, AI-powered customer profiles tailored to your industry that drive engagement and boost conversions.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
                  <Button 
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2.5 px-5 rounded-md"
                    onClick={() => window.location.href = "#demo"}
                  >
                    Try it now
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-gray-300 text-gray-700 hover:bg-gray-50 text-sm font-medium py-2.5 px-5 rounded-md"
                    onClick={() => window.location.href = "#pricing"}
                  >
                    View pricing
                  </Button>
                </div>
              </div>
              
              {/* AI Persona Generator Showcase */}
              <div className="max-w-6xl mx-auto mt-14 bg-white rounded-xl border border-gray-200 shadow-md overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 bg-gray-100 rounded-md flex items-center justify-center">
                      <BrainCircuit className="h-3 w-3 text-black" />
                    </div>
                    <span className="text-sm font-medium">AI Persona Generator</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    </div>
                    <span className="text-xs text-gray-500">Live</span>
                  </div>
                </div>
                
                <div className="p-5">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                    {/* Left Column - Input */}
                    <div className="bg-gray-50 rounded-md border border-gray-200 p-4">
                      <div className="text-xs font-medium text-black mb-3">Industry Selection</div>
                      
                      <div className="bg-white rounded-md border border-gray-200 p-3 mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Building2 className="h-3.5 w-3.5 text-black" />
                          <div className="text-sm font-medium">SaaS / Technology</div>
                        </div>
                        <div className="text-xs text-black leading-relaxed">
                          Generate personas for software as a service products and technology services
                        </div>
                      </div>
                      
                      <div className="text-xs font-medium text-black mb-3">Target Market</div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-white rounded border border-gray-200 p-2">
                          <div className="text-xs font-medium">B2B</div>
                        </div>
                        <div className="bg-white rounded border border-gray-200 p-2 opacity-50">
                          <div className="text-xs font-medium">B2C</div>
                        </div>
                      </div>
                      
                      <div className="text-xs font-medium text-black mb-3 mt-4">Persona Type</div>
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        <div className="bg-white rounded border border-gray-200 p-2">
                          <div className="text-xs font-medium">Decision Maker</div>
                        </div>
                        <div className="bg-white rounded border border-gray-200 p-2 opacity-50">
                          <div className="text-xs font-medium">Influencer</div>
                        </div>
                      </div>
                      
                      <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-xs py-2">
                        Generate Persona
                      </Button>
                    </div>
                    
                    {/* Center Column - Persona Card */}
                    <div className="lg:border-x lg:border-gray-100 lg:px-5">
                      <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center text-black font-medium">
                              AC
                            </div>
                            <div>
                              <div className="text-sm font-medium">Alex Chen</div>
                              <div className="text-xs text-black">CTO at MidSize Tech</div>
                            </div>
                          </div>
                          <div className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded-full">
                            Decision Maker
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <div>
                            <div className="flex items-center gap-1.5 mb-1.5">
                              <Users className="h-3 w-3 text-black" />
                              <div className="text-xs font-medium text-black">Demographics</div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <div className="text-xs text-gray-500">Age</div>
                                <div className="text-xs font-medium">35-45</div>
                              </div>
                              <div>
                                <div className="text-xs text-gray-500">Location</div>
                                <div className="text-xs font-medium">Urban Tech Hubs</div>
                              </div>
                              <div>
                                <div className="text-xs text-gray-500">Education</div>
                                <div className="text-xs font-medium">MS in CS/Engineering</div>
                              </div>
                              <div>
                                <div className="text-xs text-gray-500">Income</div>
                                <div className="text-xs font-medium">$150-200K</div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="pt-2 border-t border-gray-100">
                            <div className="flex items-center gap-1.5 mb-1.5">
                              <Target className="h-3 w-3 text-black" />
                              <div className="text-xs font-medium text-black">Goals & Motivations</div>
                            </div>
                            <ul className="space-y-1">
                              <li className="flex gap-1.5 items-baseline">
                                <div className="h-1 w-1 rounded-full bg-indigo-500 mt-1"></div>
                                <div className="text-xs text-gray-600">Implement scalable tech solutions</div>
                              </li>
                              <li className="flex gap-1.5 items-baseline">
                                <div className="h-1 w-1 rounded-full bg-indigo-500 mt-1"></div>
                                <div className="text-xs text-gray-600">Reduce operational costs</div>
                              </li>
                              <li className="flex gap-1.5 items-baseline">
                                <div className="h-1 w-1 rounded-full bg-indigo-500 mt-1"></div>
                                <div className="text-xs text-gray-600">Enhance security infrastructure</div>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Right Column - Premium Features */}
                    <div className="relative">
                      <div className="lg:absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-10 rounded-md">
                        <div className="p-4 text-center">
                          <BrainCircuit className="h-8 w-8 text-indigo-500 mx-auto mb-3" />
                          <h3 className="text-sm font-medium text-gray-900 mb-1">Unlock Premium Insights</h3>
                          <p className="text-xs text-gray-500 mb-3">
                            Premium plans include detailed psychological profiles, behavior patterns, and strategic recommendations.
                          </p>
                          <Button 
                            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs py-1.5 px-3 rounded"
                            onClick={() => window.location.href = "#pricing"}
                          >
                            View Pricing
                          </Button>
                        </div>
                      </div>
                      
                      {/* Background Content (Visible on Hover or Premium) */}
                      <div className="bg-white border border-gray-200 rounded-md p-4">
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <MessagesSquare className="h-3 w-3 text-gray-500" />
                          <div className="text-xs font-medium text-gray-700">Pain Points</div>
                        </div>
                        <ul className="space-y-1 mb-4">
                          <li className="flex gap-1.5 items-baseline">
                            <div className="h-1 w-1 rounded-full bg-red-500 mt-1"></div>
                            <div className="text-xs text-gray-600">Legacy systems integration challenges</div>
                          </li>
                          <li className="flex gap-1.5 items-baseline">
                            <div className="h-1 w-1 rounded-full bg-red-500 mt-1"></div>
                            <div className="text-xs text-gray-600">Talent acquisition & retention</div>
                          </li>
                        </ul>
                        
                        <div className="flex items-center gap-1.5 mb-1.5 pt-2 border-t border-gray-100">
                          <BarChart3 className="h-3 w-3 text-gray-500" />
                          <div className="text-xs font-medium text-gray-700">Buying Behavior</div>
                        </div>
                        <ul className="space-y-1">
                          <li className="flex gap-1.5 items-baseline">
                            <div className="h-1 w-1 rounded-full bg-violet-500 mt-1"></div>
                            <div className="text-xs text-gray-600">Research-driven decision making</div>
                          </li>
                          <li className="flex gap-1.5 items-baseline">
                            <div className="h-1 w-1 rounded-full bg-violet-500 mt-1"></div>
                            <div className="text-xs text-gray-600">Values ROI metrics & case studies</div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 text-xs text-gray-500 text-center">
                  This is a preview of our AI persona generator. Sign up to access full features.
                </div>
              </div>
            </div>
          </section>

          {/* Key Features */}
          <section id="features" className="py-20 bg-white relative">
            <div className="container mx-auto px-4 sm:px-6">
              <div className="text-center mb-14">
                <div className="text-xs font-medium text-black tracking-wide uppercase mb-3">Features</div>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 text-black tracking-tight leading-tight">
                  Create Professional-Grade <span className="text-black">Audience Personas</span>
                </h2>
                <p className="text-base md:text-lg text-black max-w-2xl mx-auto">
                  Build detailed, actionable profiles that drive your marketing strategy
                </p>
              </div>
              
              <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
                  <div className="bg-white p-4 rounded-md border border-gray-100 shadow-sm hover:shadow-md transition-all">
                    <div className="h-8 w-8 bg-indigo-50 rounded-lg flex items-center justify-center mb-3">
                      <BrainCircuit className="h-4 w-4 text-indigo-600" />
                    </div>
                    <h3 className="font-medium text-sm text-gray-900 mb-1.5">AI-Powered Creation</h3>
                    <p className="text-gray-600 text-xs leading-relaxed">Generate detailed personas using advanced language models.</p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-md border border-gray-100 shadow-sm hover:shadow-md transition-all">
                    <div className="h-8 w-8 bg-purple-50 rounded-lg flex items-center justify-center mb-3">
                      <Microscope className="h-4 w-4 text-purple-600" />
                    </div>
                    <h3 className="font-medium text-sm text-gray-900 mb-1.5">Deep Audience Insights</h3>
                    <p className="text-gray-600 text-xs leading-relaxed">Understand motivations, pain points, and goals with psychological depth.</p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-md border border-gray-100 shadow-sm hover:shadow-md transition-all">
                    <div className="h-8 w-8 bg-blue-50 rounded-lg flex items-center justify-center mb-3">
                      <Layout className="h-4 w-4 text-blue-600" />
                    </div>
                    <h3 className="font-medium text-sm text-gray-900 mb-1.5">Visual Profiles</h3>
                    <p className="text-gray-600 text-xs leading-relaxed">Create beautifully formatted persona documents in an easy-to-reference format.</p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-md border border-gray-100 shadow-sm hover:shadow-md transition-all">
                    <div className="h-8 w-8 bg-green-50 rounded-lg flex items-center justify-center mb-3">
                      <Target className="h-4 w-4 text-green-600" />
                    </div>
                    <h3 className="font-medium text-sm text-gray-900 mb-1.5">Industry Targeting</h3>
                    <p className="text-gray-600 text-xs leading-relaxed">Choose from 20+ industry categories tailored to your business sector.</p>
                  </div>
                </div>
                
                <div className="mt-14 grid md:grid-cols-2 gap-6">
                  {/* Card 1 */}
                  <div className="bg-white border border-gray-200 rounded-lg p-5 md:p-6 relative">
                    <div className="flex items-center mb-4">
                      <div className="h-7 w-7 rounded-md bg-indigo-50 flex items-center justify-center mr-3">
                        <Users className="h-3.5 w-3.5 text-indigo-600" />
                      </div>
                      <h3 className="text-sm font-medium text-gray-900">Comprehensive Persona Profiles</h3>
                    </div>
                    
                    <p className="text-xs text-gray-600 mb-4 leading-relaxed">
                      Create detailed audience personas with demographic data, pain points, goals, and psychological profiles.
                    </p>
                    
                    <div className="grid grid-cols-2 gap-3 mt-4">
                      <div className="flex items-start">
                        <CheckCircle className="h-3 w-3 text-green-600 mt-0.5 mr-1.5 flex-shrink-0" />
                        <span className="text-xs text-gray-700">Demographic Data</span>
                      </div>
                      <div className="flex items-start">
                        <CheckCircle className="h-3 w-3 text-green-600 mt-0.5 mr-1.5 flex-shrink-0" />
                        <span className="text-xs text-gray-700">Psychographic Profiling</span>
                      </div>
                      <div className="flex items-start">
                        <CheckCircle className="h-3 w-3 text-green-600 mt-0.5 mr-1.5 flex-shrink-0" />
                        <span className="text-xs text-gray-700">Behavior Analysis</span>
                      </div>
                      <div className="flex items-start">
                        <CheckCircle className="h-3 w-3 text-green-600 mt-0.5 mr-1.5 flex-shrink-0" />
                        <span className="text-xs text-gray-700">Pain Points & Goals</span>
                      </div>
                    </div>
                    
                    <div className="absolute top-3 right-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-50 text-indigo-700">
                        Core
                      </span>
                    </div>
                  </div>
                  
                  {/* Card 2 */}
                  <div className="bg-white border border-gray-200 rounded-lg p-5 md:p-6 relative">
                    <div className="flex items-center mb-4">
                      <div className="h-7 w-7 rounded-md bg-violet-50 flex items-center justify-center mr-3">
                        <Target className="h-3.5 w-3.5 text-violet-600" />
                      </div>
                      <h3 className="text-sm font-medium text-gray-900">Persona-Driven Marketing</h3>
                    </div>
                    
                    <p className="text-xs text-gray-600 mb-4 leading-relaxed">
                      Turn audience insights into actionable marketing strategies and content plans that convert.
                    </p>
                    
                    <div className="grid grid-cols-2 gap-3 mt-4">
                      <div className="flex items-start">
                        <CheckCircle className="h-3 w-3 text-green-600 mt-0.5 mr-1.5 flex-shrink-0" />
                        <span className="text-xs text-gray-700">Content Preferences</span>
                      </div>
                      <div className="flex items-start">
                        <CheckCircle className="h-3 w-3 text-green-600 mt-0.5 mr-1.5 flex-shrink-0" />
                        <span className="text-xs text-gray-700">Channel Strategy</span>
                      </div>
                      <div className="flex items-start">
                        <CheckCircle className="h-3 w-3 text-green-600 mt-0.5 mr-1.5 flex-shrink-0" />
                        <span className="text-xs text-gray-700">Messaging & Tone</span>
                      </div>
                      <div className="flex items-start">
                        <CheckCircle className="h-3 w-3 text-green-600 mt-0.5 mr-1.5 flex-shrink-0" />
                        <span className="text-xs text-gray-700">Buyer Journey Mapping</span>
                      </div>
                    </div>
                    
                    <div className="absolute top-3 right-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-violet-50 text-violet-700">
                        Advanced
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-center mt-16">
                <Button 
                  className="bg-black hover:bg-gray-800 text-white py-3 px-6 rounded-md"
                  onClick={() => window.location.href = "#demo"}
                >
                  See it in action
                </Button>
              </div>
            </div>
          </section>

          {/* How It Works */}
          <section className="py-20 bg-gray-50 relative">
            <div className="container mx-auto px-4 sm:px-6">
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                  <div className="text-xs font-medium text-black tracking-wide uppercase mb-3">How it works</div>
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 text-black tracking-tight leading-tight">
                    Blazingly fast, <span className="text-black">amazingly flexible</span>
                  </h2>
                  <p className="text-base text-black max-w-2xl mx-auto">
                    Our AI persona service helps you build the perfect customer profiles for your marketing needs
                  </p>
                </div>
                
                <div className="relative mt-16">
                  {/* Timeline connector line */}
                  <div className="absolute left-0 md:left-[4.5rem] top-0 h-full w-px bg-gray-200 hidden md:block"></div>
                  
                  <div className="space-y-16">
                    {/* Step 1 */}
                    <div className="flex flex-col md:flex-row items-start">
                      <div className="md:w-36 flex-shrink-0 mb-4 md:mb-0 flex md:block">
                        <div className="relative">
                          <div className="h-8 w-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-medium z-10 relative">1</div>
                          <div className="hidden md:block h-8 w-8 rounded-full bg-indigo-100 absolute top-0 left-0 transform -translate-x-1/2 z-0"></div>
                        </div>
                        <div className="hidden md:block mt-2 text-xs text-gray-500 font-medium">SELECT</div>
                      </div>
                      
                      <div className="md:pl-6 lg:pl-10 flex-1">
                        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                          <h3 className="text-sm font-semibold mb-3 text-gray-900">Select Your Industry</h3>
                          <p className="text-xs text-gray-600 mb-4 leading-relaxed">
                            Choose from over 20 industry categories or describe your specific business niche. Our AI will customize the persona generation based on industry-specific insights.
                          </p>
                          
                          <div className="border border-gray-100 rounded-md p-3 bg-gray-50">
                            <div className="flex items-center mb-2">
                              <div className="h-5 w-5 bg-indigo-50 rounded-md flex items-center justify-center mr-2">
                                <Building2 className="h-3 w-3 text-indigo-600" />
                              </div>
                              <div className="text-xs font-medium text-gray-700">Industry Selected</div>
                            </div>
                            <div className="text-xs font-medium text-gray-900">Technology / SaaS</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Step 2 */}
                    <div className="flex flex-col md:flex-row items-start">
                      <div className="md:w-36 flex-shrink-0 mb-4 md:mb-0 flex md:block">
                        <div className="relative">
                          <div className="h-8 w-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-medium z-10 relative">2</div>
                          <div className="hidden md:block h-8 w-8 rounded-full bg-indigo-100 absolute top-0 left-0 transform -translate-x-1/2 z-0"></div>
                        </div>
                        <div className="hidden md:block mt-2 text-xs text-gray-500 font-medium">GENERATE</div>
                      </div>
                      
                      <div className="md:pl-6 lg:pl-10 flex-1">
                        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                          <h3 className="text-sm font-semibold mb-3 text-gray-900">Generate Detailed Personas</h3>
                          <p className="text-xs text-gray-600 mb-4 leading-relaxed">
                            Our AI creates comprehensive personas in seconds with demographics, goals, pain points, and behaviors tailored to your target market.
                          </p>
                          
                          <div className="border border-gray-100 rounded-md p-3 bg-gray-50">
                            <div className="flex items-center mb-2">
                              <div className="h-5 w-5 bg-purple-50 rounded-md flex items-center justify-center mr-2">
                                <Users className="h-3 w-3 text-purple-600" />
                              </div>
                              <div className="text-xs font-medium text-gray-700">Persona Created</div>
                            </div>
                            <div className="text-xs font-medium text-gray-900">Sarah Chen, CTO at Enterprise Tech</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Step 3 */}
                    <div className="flex flex-col md:flex-row items-start">
                      <div className="md:w-36 flex-shrink-0 mb-4 md:mb-0 flex md:block">
                        <div className="relative">
                          <div className="h-8 w-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-medium z-10 relative">3</div>
                          <div className="hidden md:block h-8 w-8 rounded-full bg-indigo-100 absolute top-0 left-0 transform -translate-x-1/2 z-0"></div>
                        </div>
                        <div className="hidden md:block mt-2 text-xs text-gray-500 font-medium">IMPLEMENT</div>
                      </div>
                      
                      <div className="md:pl-6 lg:pl-10 flex-1">
                        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                          <h3 className="text-sm font-semibold mb-3 text-gray-900">Customize & Implement</h3>
                          <p className="text-xs text-gray-600 mb-4 leading-relaxed">
                            Fine-tune your personas and use them to guide content creation, marketing campaigns, and sales strategies with greater precision.
                          </p>
                          
                          <div className="border border-gray-100 rounded-md p-3 bg-gray-50">
                            <div className="flex flex-wrap gap-2">
                              <div className="flex items-center px-2 py-1 bg-white rounded border border-gray-200">
                                <div className="text-xs font-medium">Export PDF</div>
                              </div>
                              <div className="flex items-center px-2 py-1 bg-white rounded border border-gray-200">
                                <div className="text-xs font-medium">Share</div>
                              </div>
                              <div className="flex items-center px-2 py-1 bg-white rounded border border-gray-200">
                                <div className="text-xs font-medium">API Access</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="text-center mt-16">
                  <Button 
                    className="bg-black hover:bg-gray-800 text-white text-sm font-medium py-2.5 px-5 rounded-md"
                    onClick={() => window.location.href = "#pricing"}
                  >
                    Start creating personas
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Use Cases */}
          <section className="py-20 bg-white relative">
            <div className="container mx-auto px-4 sm:px-6">
              <div className="text-center mb-12">
                <div className="text-xs font-medium text-black tracking-wide uppercase mb-3">Use Cases</div>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 text-black tracking-tight leading-tight">
                  Powerful Applications for <span className="text-black">Every Business</span>
                </h2>
                <p className="text-base text-black max-w-2xl mx-auto">
                  Discover how our AI personas can transform your marketing strategy
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
                <div className="bg-white border border-gray-200 rounded-md p-5 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-8 w-8 bg-indigo-50 rounded-md flex items-center justify-center">
                      <Target className="h-4 w-4 text-indigo-600" />
                    </div>
                    <h3 className="text-sm font-medium text-gray-900">Content Targeting</h3>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Create content specifically tailored to your target audience's needs and pain points, increasing engagement and conversion rates.
                  </p>
                  <div className="mt-3 flex">
                    <div className="text-xs font-medium text-indigo-600 flex items-center">
                      <span>Learn more</span>
                      <div className="h-3 w-3 ml-1 flex items-center justify-center">
                        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-md p-5 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-8 w-8 bg-purple-50 rounded-md flex items-center justify-center">
                      <Compass className="h-4 w-4 text-purple-600" />
                    </div>
                    <h3 className="text-sm font-medium text-gray-900">Product Development</h3>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Guide product development and feature prioritization based on deep understanding of customer needs and preferences.
                  </p>
                  <div className="mt-3 flex">
                    <div className="text-xs font-medium text-purple-600 flex items-center">
                      <span>Learn more</span>
                      <div className="h-3 w-3 ml-1 flex items-center justify-center">
                        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-md p-5 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-8 w-8 bg-blue-50 rounded-md flex items-center justify-center">
                      <Building2 className="h-4 w-4 text-blue-600" />
                    </div>
                    <h3 className="text-sm font-medium text-gray-900">Market Expansion</h3>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Identify and understand new market segments to inform your expansion strategy and messaging approach.
                  </p>
                  <div className="mt-3 flex">
                    <div className="text-xs font-medium text-blue-600 flex items-center">
                      <span>Learn more</span>
                      <div className="h-3 w-3 ml-1 flex items-center justify-center">
                        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-md p-5 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-8 w-8 bg-green-50 rounded-md flex items-center justify-center">
                      <Users className="h-4 w-4 text-green-600" />
                    </div>
                    <h3 className="text-sm font-medium text-gray-900">Sales Enablement</h3>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Equip your sales team with detailed buyer personas to improve prospecting, conversations, and closing rates.
                  </p>
                  <div className="mt-3 flex">
                    <div className="text-xs font-medium text-green-600 flex items-center">
                      <span>Learn more</span>
                      <div className="h-3 w-3 ml-1 flex items-center justify-center">
                        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-14 max-w-6xl mx-auto">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 md:p-8">
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="md:w-2/3">
                      <div className="text-indigo-600 text-xs font-medium mb-2">CASE STUDY</div>
                      <h3 className="text-lg font-semibold mb-3">How TechSoft increased conversions by 47% with AI personas</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        By implementing detailed AI-generated personas into their marketing strategy, TechSoft was able to create hyper-targeted content that resonated with their ideal customers.
                      </p>
                      <div className="flex items-center gap-4">
                        <div className="flex -space-x-2">
                          <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-medium text-indigo-700">T</div>
                          <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs font-medium text-blue-700">S</div>
                        </div>
                        <div className="text-xs text-gray-500">TechSoft, B2B SaaS</div>
                      </div>
                    </div>
                    <div className="md:w-1/3 flex justify-end">
                      <Button 
                        variant="outline"
                        className="text-xs font-medium py-2 px-4 rounded-md border-gray-200 text-gray-700"
                      >
                        Read case study
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Pricing Section */}
          <section id="pricing" className="py-20 bg-white relative">
            <div className="container mx-auto px-4 sm:px-6">
              <div className="text-center mb-12">
                <div className="text-xs font-medium text-black tracking-wide uppercase mb-3">Pricing</div>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 text-black tracking-tight leading-tight">
                  <span className="text-black">Simple pricing</span>, for everyone
                </h2>
                <p className="text-base text-black max-w-2xl mx-auto">
                  No hidden fees, no contracts, cancel anytime
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden p-8">
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Basic</h3>
                    <p className="text-gray-500 text-sm">For individuals</p>
                  </div>
                  
                  <div className="mb-6">
                    <p className="text-3xl font-bold text-gray-900">$49</p>
                    <p className="text-gray-500 text-sm">per month</p>
                  </div>
                  
                  <Button className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 py-2 rounded-md mb-6">
                    Get started
                  </Button>

                  <div className="border-t border-gray-100 pt-6">
                    <p className="font-medium text-sm mb-4">Basic includes:</p>
                    <ul className="space-y-3">
                      {[
                        "10 AI-generated personas per month",
                        "Industry-specific insights",
                        "Basic demographic analysis",
                        "Core persona attributes only",
                        "PDF export functionality",
                        "Email support"
                      ].map((feature, i) => (
                        <li className="flex items-center text-sm" key={i}>
                          <CheckCircle className="h-4 w-4 text-indigo-600 mr-2 flex-shrink-0" />
                          <span className="text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="text-gray-500 text-xs mt-4">All quotas refresh monthly</p>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg border-2 border-indigo-600 shadow-md overflow-hidden p-8 relative">
                  <div className="absolute top-0 inset-x-0 bg-indigo-600 text-white text-xs py-1 text-center font-medium">
                    MOST POPULAR
                  </div>
                  <div className="mb-6 pt-3">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Premium</h3>
                    <p className="text-gray-500 text-sm">For marketers</p>
                  </div>
                  
                  <div className="mb-6">
                    <p className="text-3xl font-bold text-gray-900">$149</p>
                    <p className="text-gray-500 text-sm">per month</p>
                  </div>
                  
                  <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md mb-6">
                    Get started
                  </Button>

                  <div className="border-t border-gray-100 pt-6">
                    <p className="font-medium text-sm mb-4">Everything in Basic, plus:</p>
                    <ul className="space-y-3">
                      {[
                        "30 AI-generated personas per month",
                        "Advanced psychographic analysis",
                        "Market segment customization",
                        "Regional adaptation options",
                        "Buying stage customization",
                        "Decision style profiling",
                        "Priority email & chat support"
                      ].map((feature, i) => (
                        <li className="flex items-center text-sm" key={i}>
                          <CheckCircle className="h-4 w-4 text-indigo-600 mr-2 flex-shrink-0" />
                          <span className="text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="text-gray-500 text-xs mt-4">All quotas refresh monthly</p>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden p-8">
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Enterprise</h3>
                    <p className="text-gray-500 text-sm">For organizations</p>
                  </div>
                  
                  <div className="mb-6">
                    <p className="text-3xl font-bold text-gray-900">$499</p>
                    <p className="text-gray-500 text-sm">per month</p>
                  </div>
                  
                  <Button className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 py-2 rounded-md mb-6">
                    Contact sales
                  </Button>

                  <div className="border-t border-gray-100 pt-6">
                    <p className="font-medium text-sm mb-4">Everything in Premium, plus:</p>
                    <ul className="space-y-3">
                      {[
                        "Unlimited AI-generated personas",
                        "Content strategy integration",
                        "Competitive positioning analysis",
                        "Objection prediction & countering",
                        "Full persona API access",
                        "Training and onboarding",
                        "Dedicated account manager"
                      ].map((feature, i) => (
                        <li className="flex items-center text-sm" key={i}>
                          <CheckCircle className="h-4 w-4 text-indigo-600 mr-2 flex-shrink-0" />
                          <span className="text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="text-gray-500 text-xs mt-4">All quotas refresh monthly</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-16 max-w-3xl mx-auto">
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                  <h3 className="text-xl font-semibold mb-4 text-gray-900">Feature Comparison</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="pb-3 text-left text-sm font-medium text-gray-500">Customization Feature</th>
                          <th className="pb-3 text-center text-sm font-medium text-gray-500">Basic</th>
                          <th className="pb-3 text-center text-sm font-medium text-gray-500">Premium</th>
                          <th className="pb-3 text-center text-sm font-medium text-gray-500">Enterprise</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-gray-200">
                          <td className="py-2 text-sm text-gray-600">Industry Selection</td>
                          <td className="py-2 text-center text-sm text-gray-600">✓</td>
                          <td className="py-2 text-center text-sm text-gray-600">✓</td>
                          <td className="py-2 text-center text-sm text-gray-600">✓</td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="py-2 text-sm text-gray-600">Market Segment Targeting</td>
                          <td className="py-2 text-center text-sm text-gray-600"></td>
                          <td className="py-2 text-center text-sm text-gray-600">✓</td>
                          <td className="py-2 text-center text-sm text-gray-600">✓</td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="py-2 text-sm text-gray-600">Regional Adaptation</td>
                          <td className="py-2 text-center text-sm text-gray-600"></td>
                          <td className="py-2 text-center text-sm text-gray-600">✓</td>
                          <td className="py-2 text-center text-sm text-gray-600">✓</td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="py-2 text-sm text-gray-600">Buying Stage Customization</td>
                          <td className="py-2 text-center text-sm text-gray-600"></td>
                          <td className="py-2 text-center text-sm text-gray-600">✓</td>
                          <td className="py-2 text-center text-sm text-gray-600">✓</td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="py-2 text-sm text-gray-600">Decision Style Profiling</td>
                          <td className="py-2 text-center text-sm text-gray-600"></td>
                          <td className="py-2 text-center text-sm text-gray-600">✓</td>
                          <td className="py-2 text-center text-sm text-gray-600">✓</td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="py-2 text-sm text-gray-600">Content Strategy Integration</td>
                          <td className="py-2 text-center text-sm text-gray-600"></td>
                          <td className="py-2 text-center text-sm text-gray-600"></td>
                          <td className="py-2 text-center text-sm text-gray-600">✓</td>
                        </tr>
                        <tr>
                          <td className="py-2 text-sm text-gray-600">Competitive Positioning Analysis</td>
                          <td className="py-2 text-center text-sm text-gray-600"></td>
                          <td className="py-2 text-center text-sm text-gray-600"></td>
                          <td className="py-2 text-center text-sm text-gray-600">✓</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          {/* Try Before You Buy Demo Section */}
          <section id="demo" className="py-20 bg-gray-50 relative">
            <div className="container mx-auto px-4 sm:px-6">
              <div className="text-center mb-12">
                <div className="text-xs font-medium text-black tracking-wide uppercase mb-3">Interactive Demo</div>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 text-black tracking-tight leading-tight">
                  Try it <span className="text-black">yourself</span>
                </h2>
                <p className="text-base text-black max-w-2xl mx-auto">
                  Experience our AI persona generation technology with this interactive demo
                </p>
              </div>
              
              <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Persona Generation Column */}
                  <div className="bg-white p-6 lg:p-8 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="text-2xl font-semibold mb-6 text-gray-900">Create a Persona</h3>
                    
                    <div className="mb-4">
                      <h4 className="text-lg font-medium mb-3 text-gray-900">Select an Industry</h4>
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <IndustrySelector 
                          selectedIndustry={selectedIndustry} 
                          onSelectIndustry={(industry) => {
                            setSelectedIndustry(industry);
                            setDemoPersona(null);
                          }} 
                        />
                      </div>
                    </div>
                    
                    <h4 className="text-lg font-medium mb-3 text-gray-900">Customization Options</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
                      {/* Market Segment */}
                      <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                        <label className="flex items-center justify-between text-sm text-gray-700 mb-2">
                          <span>Market Segment</span>
                          <span className="text-xs text-indigo-600 bg-indigo-50 py-1 px-2 rounded">Premium</span>
                        </label>
                        <select 
                          className="w-full bg-white border border-gray-300 rounded p-2 text-gray-500 text-sm"
                          disabled
                        >
                          <option>Enterprise (250+ employees)</option>
                          <option>Mid-Market (50-249 employees)</option>
                          <option>Small Business (1-49 employees)</option>
                          <option>Consumer</option>
                        </select>
                      </div>
                      
                      {/* Regional Adaptation */}
                      <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                        <label className="flex items-center justify-between text-sm text-gray-700 mb-2">
                          <span>Regional Adaptation</span>
                          <span className="text-xs text-indigo-600 bg-indigo-50 py-1 px-2 rounded">Premium</span>
                        </label>
                        <select 
                          className="w-full bg-white border border-gray-300 rounded p-2 text-gray-500 text-sm"
                          disabled
                        >
                          <option>North America</option>
                          <option>Europe</option>
                          <option>Asia-Pacific</option>
                          <option>Latin America</option>
                          <option>Middle East & Africa</option>
                        </select>
                      </div>
                      
                      {/* Buying Stage */}
                      <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                        <label className="flex items-center justify-between text-sm text-gray-700 mb-2">
                          <span>Buying Stage</span>
                          <span className="text-xs text-indigo-600 bg-indigo-50 py-1 px-2 rounded">Business</span>
                        </label>
                        <select 
                          className="w-full bg-white border border-gray-300 rounded p-2 text-gray-500 text-sm"
                          disabled
                        >
                          <option>Awareness</option>
                          <option>Consideration</option>
                          <option>Decision</option>
                          <option>Post-Purchase</option>
                        </select>
                      </div>
                      
                      {/* Psychographic Profile */}
                      <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                        <label className="flex items-center justify-between text-sm text-gray-700 mb-2">
                          <span>Decision Style</span>
                          <span className="text-xs text-indigo-600 bg-indigo-50 py-1 px-2 rounded">Business</span>
                        </label>
                        <select 
                          className="w-full bg-white border border-gray-300 rounded p-2 text-gray-500 text-sm"
                          disabled
                        >
                          <option>Analytical</option>
                          <option>Collaborative</option>
                          <option>Competitive</option>
                          <option>Spontaneous</option>
                          <option>Risk-Averse</option>
                        </select>
                      </div>
                      
                      {/* Content Strategy */}
                      <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                        <label className="flex items-center justify-between text-sm text-gray-700 mb-2">
                          <span>Content Strategy Focus</span>
                          <span className="text-xs text-indigo-600 bg-indigo-50 py-1 px-2 rounded">Enterprise</span>
                        </label>
                        <select 
                          className="w-full bg-white border border-gray-300 rounded p-2 text-gray-500 text-sm"
                          disabled
                        >
                          <option>Educational Content</option>
                          <option>Problem-Solution Mapping</option>
                          <option>Case Studies & Testimonials</option>
                          <option>ROI & Metrics Focus</option>
                        </select>
                      </div>
                      
                      {/* Competitive Analysis */}
                      <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                        <label className="flex items-center justify-between text-sm text-gray-700 mb-2">
                          <span>Competitive Positioning</span>
                          <span className="text-xs text-indigo-600 bg-indigo-50 py-1 px-2 rounded">Enterprise</span>
                        </label>
                        <select 
                          className="w-full bg-white border border-gray-300 rounded p-2 text-gray-500 text-sm"
                          disabled
                        >
                          <option>Feature Comparison Focus</option>
                          <option>Price Sensitivity Analysis</option>
                          <option>Vendor Relationship History</option>
                          <option>Innovation Adoption Timeline</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100 mb-5">
                      <div className="flex items-start">
                        <div className="mr-3 mt-1">
                          <Sparkles className="h-5 w-5 text-indigo-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">
                            <span className="text-indigo-600 font-medium">Premium features</span> allow you to tailor 
                            personas for specific market segments and regional considerations. 
                            <span className="text-indigo-600 font-medium"> Business features</span> include buying stage 
                            customization and decision-making style profiles. 
                            <span className="text-indigo-600 font-medium"> Enterprise features</span> provide advanced content 
                            strategy and competitive positioning insights.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {error && (
                      <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
                        {error}
                      </div>
                    )}
                    
                    <div className="flex justify-center mt-6">
                      <Button
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-8 py-3 text-lg rounded-md shadow-sm"
                        onClick={generateDemoPersona}
                        disabled={isGenerating || !selectedIndustry}
                      >
                        {isGenerating ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Generating Basic Persona...
                          </>
                        ) : (
                          'Generate Basic Persona'
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  {/* Persona Display Column */}
                  <div className="bg-white p-6 lg:p-8 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="text-2xl font-semibold mb-6 text-gray-900">
                      {demoPersona ? `Meet ${demoPersona.name}` : 'Your Generated Persona'}
                    </h3>
                    
                    {!demoPersona && !isGenerating ? (
                      <div className="flex flex-col items-center justify-center h-[400px] text-center">
                        <Sparkles className="h-16 w-16 text-indigo-300 mb-4" />
                        <p className="text-gray-500 max-w-md">
                          Select an industry from the list on the left and click "Generate Persona" 
                          to create a detailed buyer persona for your marketing.
                        </p>
                      </div>
                    ) : isGenerating ? (
                      <div className="flex flex-col items-center justify-center h-[400px] text-center">
                        <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                        <p className="text-gray-700">
                          Creating your persona...
                        </p>
                        <p className="text-gray-500 text-sm mt-2">
                          This typically takes 10-15 seconds
                        </p>
                      </div>
                    ) : (
                      <div className="overflow-y-auto max-h-[500px] pr-2">
                        <div className="bg-gradient-to-r from-gray-50 to-white p-5 rounded-lg border border-gray-200 mb-6">
                          <div className="flex items-center mb-4">
                            <div className="bg-indigo-100 p-2.5 rounded-full mr-4">
                              <Users className="h-6 w-6 text-indigo-600" />
                            </div>
                            <div>
                              <h4 className="text-xl font-medium text-gray-900">{demoPersona.name}</h4>
                              <p className="text-indigo-600">{demoPersona.role}</p>
                            </div>
                          </div>
                          
                          {/* Persona Card in Same Style as Hero Section */}
                          <div className="mt-6">
                            <div className="bg-white px-5 py-4 rounded-md border border-gray-200 w-full max-w-md mx-auto">
                              <div className="flex items-center gap-2 mb-4">
                                <div className="h-5 w-5 bg-indigo-100 rounded-md flex items-center justify-center">
                                  <Users className="h-3 w-3 text-indigo-600" />
                                </div>
                                <span className="text-sm font-medium text-indigo-700">Persona</span>
                                <div className="flex-1 text-right">
                                  <span className="text-xs text-gray-400">Custom</span>
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-x-5 gap-y-4">
                                <div>
                                  <div className="text-xs text-gray-500 mb-1">Name</div>
                                  <div className="text-sm font-medium">{demoPersona.name}</div>
                                </div>
                                
                                <div>
                                  <div className="text-xs text-gray-500 mb-1">Role</div>
                                  <div className="text-sm font-medium">{demoPersona.role || demoPersona.title}</div>
                                </div>
                                
                                <div>
                                  <div className="text-xs text-gray-500 mb-1">Company</div>
                                  <div className="text-sm font-medium">{demoPersona.company}</div>
                                </div>
                                
                                <div>
                                  <div className="text-xs text-gray-500 mb-1">Industry</div>
                                  <div className="text-sm font-medium">{selectedIndustry?.name}</div>
                                </div>
                              </div>
                              
                              {/* Related Models with Connecting Elements */}
                              <div className="mt-8 mb-4">
                                <div className="flex items-center mb-3">
                                  <div className="h-[1px] bg-gray-200 flex-1"></div>
                                  <div className="px-3 text-xs text-gray-400">Related Models</div>
                                  <div className="h-[1px] bg-gray-200 flex-1"></div>
                                </div>
                                
                                <div className="flex flex-wrap gap-3 justify-between">
                                  {/* Demographics Card */}
                                  {demoPersona.demographics && typeof demoPersona.demographics === 'object' && (
                                    <div className="bg-white px-4 py-3 rounded-md border border-gray-200 w-[175px]">
                                      <div className="flex items-center gap-2 mb-2">
                                        <div className="h-5 w-5 bg-blue-100 rounded-md flex items-center justify-center">
                                          <Users className="h-3 w-3 text-blue-600" />
                                        </div>
                                        <span className="text-xs font-medium text-blue-700">Demographics</span>
                                      </div>
                                      
                                      {Object.entries(demoPersona.demographics).slice(0, 2).map(([key, value]) => (
                                        <div className="mb-2" key={key}>
                                          <div className="text-xs text-gray-500 capitalize">{key}</div>
                                          <div className="text-xs font-medium truncate">{String(value)}</div>
                                        </div>
                                      ))}
                                      
                                      <div className="flex items-center text-xs text-gray-500 pt-1">
                                        <div className="h-3 w-3 rounded-full border border-gray-300 flex items-center justify-center mr-1.5">
                                          <span className="text-gray-400 text-[8px]">+</span>
                                        </div>
                                        <span>{Object.keys(demoPersona.demographics).length - 2} More</span>
                                      </div>
                                    </div>
                                  )}
                                  
                                  {/* Goals Card */}
                                  {demoPersona.goals && demoPersona.goals.length > 0 && (
                                    <div className="bg-white px-4 py-3 rounded-md border border-gray-200 w-[175px]">
                                      <div className="flex items-center gap-2 mb-2">
                                        <div className="h-5 w-5 bg-green-100 rounded-md flex items-center justify-center">
                                          <Target className="h-3 w-3 text-green-600" />
                                        </div>
                                        <span className="text-xs font-medium text-green-700">Goals</span>
                                      </div>
                                      
                                      {demoPersona.goals.slice(0, 2).map((goal: string, i: number) => (
                                        <div className="mb-2" key={i}>
                                          <div className="text-xs text-gray-500">Goal {i+1}</div>
                                          <div className="text-xs font-medium truncate" title={goal}>{goal}</div>
                                        </div>
                                      ))}
                                      
                                      <div className="flex items-center text-xs text-gray-500 pt-1">
                                        <div className="h-3 w-3 rounded-full border border-gray-300 flex items-center justify-center mr-1.5">
                                          <span className="text-gray-400 text-[8px]">+</span>
                                        </div>
                                        <span>{demoPersona.goals.length - 2} More</span>
                                      </div>
                                    </div>
                                  )}
                                  
                                  {/* Pain Points Card */}
                                  {demoPersona.pains && demoPersona.pains.length > 0 && (
                                    <div className="bg-white px-4 py-3 rounded-md border border-gray-200 w-[175px]">
                                      <div className="flex items-center gap-2 mb-2">
                                        <div className="h-5 w-5 bg-red-100 rounded-md flex items-center justify-center">
                                          <MessagesSquare className="h-3 w-3 text-red-600" />
                                        </div>
                                        <span className="text-xs font-medium text-red-700">Pain Points</span>
                                      </div>
                                      
                                      {demoPersona.pains.slice(0, 2).map((pain: string, i: number) => (
                                        <div className="mb-2" key={i}>
                                          <div className="text-xs text-gray-500">Challenge {i+1}</div>
                                          <div className="text-xs font-medium truncate" title={pain}>{pain}</div>
                                        </div>
                                      ))}
                                      
                                      <div className="flex items-center text-xs text-gray-500 pt-1">
                                        <div className="h-3 w-3 rounded-full border border-gray-300 flex items-center justify-center mr-1.5">
                                          <span className="text-gray-400 text-[8px]">+</span>
                                        </div>
                                        <span>{demoPersona.pains.length - 2} More</span>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              {/* Premium Features */}
                              <div className="mt-6 pt-4 border-t border-gray-100">
                                <div className="text-xs text-gray-500 mb-3">Premium Features</div>
                                <div className="flex flex-wrap gap-3">
                                  <div className="relative w-[140px] p-3 border border-gray-200 rounded-md bg-white/80 backdrop-blur-sm">
                                    <div className="absolute inset-0 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-md">
                                      <div className="flex flex-col items-center">
                                        <div className="bg-gray-100 p-1.5 rounded-full mb-1.5">
                                          <Settings className="h-3 w-3 text-gray-400" />
                                        </div>
                                        <span className="text-[10px] text-gray-500">Premium feature</span>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2 mb-2">
                                      <div className="h-4 w-4 bg-amber-100 flex items-center justify-center rounded-sm">
                                        <Zap className="h-2.5 w-2.5 text-amber-600" />
                                      </div>
                                      <span className="text-xs font-medium text-amber-700">Behaviors</span>
                                    </div>
                                  </div>
                                  
                                  <div className="relative w-[140px] p-3 border border-gray-200 rounded-md bg-white/80 backdrop-blur-sm">
                                    <div className="absolute inset-0 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-md">
                                      <div className="flex flex-col items-center">
                                        <div className="bg-gray-100 p-1.5 rounded-full mb-1.5">
                                          <Settings className="h-3 w-3 text-gray-400" />
                                        </div>
                                        <span className="text-[10px] text-gray-500">Premium feature</span>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2 mb-2">
                                      <div className="h-4 w-4 bg-purple-100 flex items-center justify-center rounded-sm">
                                        <BrainCircuit className="h-2.5 w-2.5 text-purple-600" />
                                      </div>
                                      <span className="text-xs font-medium text-purple-700">Psychology</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-center">
                          <p className="text-gray-600 mb-4">
                            This is just a sample of what our AI can generate. Sign up for a full account to create, 
                            save, and use personas in your marketing campaigns.
                          </p>
                          <Button
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2 rounded-md shadow-sm"
                            onClick={() => window.location.href = "#pricing"}
                          >
                            View Pricing Plans
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="py-20 bg-gray-50 relative">
            <div className="container mx-auto px-4 sm:px-6">
              <div className="text-center mb-12">
                <div className="text-xs font-medium text-indigo-600 tracking-wide uppercase mb-3">FAQ</div>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 text-gray-900 tracking-tight">
                  Frequently Asked <span className="text-indigo-600">Questions</span>
                </h2>
                <p className="text-base text-gray-600 max-w-2xl mx-auto">
                  Find answers to common questions about our AI Persona Service
                </p>
              </div>
              
              <div className="max-w-3xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-md border border-gray-200 p-5 shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="h-6 w-6 bg-indigo-50 rounded-md flex items-center justify-center">
                        <CheckCircle className="h-3 w-3 text-indigo-600" />
                      </div>
                      <h3 className="text-sm font-medium text-gray-900">How accurate are the personas?</h3>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Our AI personas are based on industry research, market data, and advanced language models. While they provide a strong starting point, we recommend refining them with your specific business knowledge for maximum accuracy.
                    </p>
                  </div>
                  
                  <div className="bg-white rounded-md border border-gray-200 p-5 shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="h-6 w-6 bg-purple-50 rounded-md flex items-center justify-center">
                        <Settings className="h-3 w-3 text-purple-600" />
                      </div>
                      <h3 className="text-sm font-medium text-gray-900">Can I customize the personas?</h3>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Yes, all generated personas can be customized. You can edit demographics, goals, pain points, behaviors, and other attributes to better match your specific target audience needs.
                    </p>
                  </div>
                  
                  <div className="bg-white rounded-md border border-gray-200 p-5 shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="h-6 w-6 bg-green-50 rounded-md flex items-center justify-center">
                        <Code className="h-3 w-3 text-green-600" />
                      </div>
                      <h3 className="text-sm font-medium text-gray-900">Do I need technical skills?</h3>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      No technical skills are required. Our intuitive interface guides you through the process with simple selections and clear instructions. You'll generate professional personas in minutes.
                    </p>
                  </div>
                  
                  <div className="bg-white rounded-md border border-gray-200 p-5 shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="h-6 w-6 bg-blue-50 rounded-md flex items-center justify-center">
                        <Target className="h-3 w-3 text-blue-600" />
                      </div>
                      <h3 className="text-sm font-medium text-gray-900">How do I use these in marketing?</h3>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Each persona includes recommendations for content types, messaging approaches, and channels that work best for that audience. Use these insights to tailor your marketing campaigns and content strategy.
                    </p>
                  </div>
                  
                  <div className="bg-white rounded-md border border-gray-200 p-5 shadow-sm hover:shadow-md transition-all duration-300 md:col-span-2">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="h-6 w-6 bg-amber-50 rounded-md flex items-center justify-center">
                        <Zap className="h-3 w-3 text-amber-600" />
                      </div>
                      <h3 className="text-sm font-medium text-gray-900">Is this a standalone service?</h3>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      The AI Persona Service is available as a standalone offering with its own pricing plans. While it integrates seamlessly with the full Tovably platform for enhanced capabilities, you don't need to subscribe to other Tovably services to use it.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-16 bg-indigo-600 relative">
            <div className="absolute inset-0 bg-[url('/dots-pattern.svg')] opacity-10 z-0"></div>
            <div className="container mx-auto px-4 sm:px-6 relative z-10">
              <div className="max-w-4xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-center">
                  <div className="lg:col-span-3">
                    <div className="text-xs font-medium text-indigo-200 tracking-wide uppercase mb-3">Get Started Today</div>
                    <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white tracking-tight">
                      Ready to Understand Your Audience on a <span className="text-indigo-200">Deeper Level</span>?
                    </h2>
                    <p className="text-indigo-100 mb-6 max-w-xl leading-relaxed">
                      Start creating detailed, AI-powered personas today and transform your marketing strategy with deeper audience insights.
                    </p>
                    
                    <div className="flex flex-wrap gap-3">
                      <Button 
                        className="bg-white hover:bg-gray-100 text-indigo-600 font-medium py-2.5 px-5 rounded-md shadow-sm"
                        onClick={() => window.location.href = "#pricing"}
                      >
                        Get Started Now
                      </Button>
                      <Button 
                        variant="outline" 
                        className="bg-transparent border-white text-white hover:bg-indigo-700 font-medium py-2.5 px-5 rounded-md"
                      >
                        Request Demo
                      </Button>
                    </div>
                  </div>
                  
                  <div className="lg:col-span-2">
                    <div className="bg-white/10 backdrop-blur-sm p-5 md:p-8 rounded-lg border border-indigo-400/20 shadow-lg">
                      <div className="flex items-center mb-4">
                        <div className="bg-white/20 p-2 rounded-md mr-3">
                          <Users className="h-5 w-5 text-white" />
                        </div>
                        <div className="text-sm font-semibold text-white">Testimonial</div>
                      </div>
                      <p className="text-white/90 text-sm italic mb-5 leading-relaxed">
                        "The personas generated by Tovably's AI service were spot-on for our target market. They've revolutionized how we approach our marketing strategy and helped us increase conversion rates by 37%."
                      </p>
                      <div className="flex items-center">
                        <div className="h-9 w-9 bg-indigo-400/30 rounded-full flex items-center justify-center text-white font-medium mr-3">JR</div>
                        <div>
                          <div className="text-white text-sm font-medium">Jamie Rodriguez</div>
                          <div className="text-indigo-200 text-xs">Marketing Director, TechForward</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}