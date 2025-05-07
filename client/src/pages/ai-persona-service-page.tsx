import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet";
import { Link } from "wouter";
import { useEffect, useState } from "react";
import { 
  BarChart3, 
  BrainCircuit,
  Building2,
  CheckCircle,
  Code,
  Compass,
  Layout,
  Loader2,
  MessagesSquare,
  Microscope,
  Settings,
  Sparkles,
  Target,
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

      <div className="min-h-screen bg-white text-gray-900 flex flex-col">
        <Navbar />

        <main className="flex-grow">
          {/* Hero Section */}
          <section className="relative pt-28 pb-20 overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6">
              <div className="text-center mb-4">
                <div className="text-indigo-600 mb-3">AI for Marketing</div>
              </div>

              <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-gray-900 tracking-tight">
                  The data model for<br />
                  <span className="relative">
                    go-to-market magic.
                  </span>
                </h1>
                <p className="text-xl md:text-2xl mb-10 text-gray-600 max-w-3xl mx-auto">
                  Tovably gives you complete control and flexibility to build the perfect personas that drive revenue forward.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    className="bg-black hover:bg-gray-800 text-white text-base font-medium py-3 px-6 rounded-md"
                    onClick={() => window.location.href = "#pricing"}
                  >
                    Start for free
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-gray-300 text-gray-700 hover:bg-gray-50 text-base font-medium py-3 px-6 rounded-md"
                    onClick={() => window.location.href = "#features"}
                  >
                    Talk to sales
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Key Features */}
          <section id="features" className="py-20 bg-white relative">
            <div className="container mx-auto px-4 sm:px-6">
              <div className="text-center mb-20">
                <div className="inline-block bg-gray-100 text-indigo-600 font-medium px-4 py-2 rounded-md mb-6">Features</div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-gray-900">
                  Create Professional-Grade <span className="text-indigo-600">Audience Personas</span>
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Build detailed, actionable profiles that drive your marketing strategy
                </p>
              </div>
              
              <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-8">
                  <div className="bg-white p-6 rounded-lg transition-all duration-300">
                    <div className="flex flex-col mb-4">
                      <div className="mb-3">
                        <BrainCircuit className="h-6 w-6 text-indigo-600" />
                      </div>
                      <h3 className="font-semibold text-lg text-gray-900 mb-2">AI-Powered Creation</h3>
                    </div>
                    <p className="text-gray-600 text-sm">Generate detailed personas using OpenAI's advanced language models.</p>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg transition-all duration-300">
                    <div className="flex flex-col mb-4">
                      <div className="mb-3">
                        <Microscope className="h-6 w-6 text-indigo-600" />
                      </div>
                      <h3 className="font-semibold text-lg text-gray-900 mb-2">Deep Audience Insights</h3>
                    </div>
                    <p className="text-gray-600 text-sm">Understand motivations, pain points, and goals with psychological depth.</p>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg transition-all duration-300">
                    <div className="flex flex-col mb-4">
                      <div className="mb-3">
                        <Layout className="h-6 w-6 text-indigo-600" />
                      </div>
                      <h3 className="font-semibold text-lg text-gray-900 mb-2">Visual Profiles</h3>
                    </div>
                    <p className="text-gray-600 text-sm">Create beautifully formatted persona documents in an easy-to-reference format.</p>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg transition-all duration-300">
                    <div className="flex flex-col mb-4">
                      <div className="mb-3">
                        <Target className="h-6 w-6 text-indigo-600" />
                      </div>
                      <h3 className="font-semibold text-lg text-gray-900 mb-2">Industry Targeting</h3>
                    </div>
                    <p className="text-gray-600 text-sm">Choose from 20+ industry categories tailored to your business sector.</p>
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
          <section className="py-24 bg-gray-50 relative">
            <div className="container mx-auto px-4 sm:px-6">
              <div className="flex flex-col md:flex-row gap-16 max-w-7xl mx-auto">
                <div className="md:w-1/3">
                  <div className="sticky top-24">
                    <div className="inline-block bg-gray-100 text-indigo-600 font-medium px-4 py-2 rounded-md mb-6">How it works</div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
                      Blazingly fast,<br/>
                      <span className="text-indigo-600">amazingly flexible.</span>
                    </h2>
                    <p className="text-gray-600 mb-8">
                      Our AI persona service helps you build the perfect customer profiles for your marketing needs.
                    </p>
                    <Button 
                      className="bg-black hover:bg-gray-800 text-white text-base font-medium py-3 px-6 rounded-md"
                      onClick={() => window.location.href = "#pricing"}
                    >
                      Start for free
                    </Button>
                  </div>
                </div>
                
                <div className="md:w-2/3">
                  <div className="space-y-16">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="text-xl font-semibold text-gray-300 md:w-24 flex-shrink-0">01</div>
                      <div>
                        <h3 className="text-xl font-semibold mb-4 text-gray-900">Select Your Industry</h3>
                        <p className="text-gray-600 mb-6">
                          Choose from over 20 industry categories or describe your specific business niche to get started. Our AI will customize the persona generation based on industry-specific insights and trends.
                        </p>
                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                          <div className="text-sm text-gray-500 mb-2">Industry Selection</div>
                          <div className="text-gray-900 font-medium">Technology / SaaS</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="text-xl font-semibold text-gray-300 md:w-24 flex-shrink-0">02</div>
                      <div>
                        <h3 className="text-xl font-semibold mb-4 text-gray-900">Generate Personas</h3>
                        <p className="text-gray-600 mb-6">
                          Our AI creates detailed personas complete with demographics, goals, pain points, and behaviors in seconds. Each persona is crafted to give you actionable insights for your marketing strategy.
                        </p>
                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                          <div className="text-sm text-gray-500 mb-2">Persona Generated</div>
                          <div className="text-gray-900 font-medium">Sarah Chen, Tech Decision Maker</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="text-xl font-semibold text-gray-300 md:w-24 flex-shrink-0">03</div>
                      <div>
                        <h3 className="text-xl font-semibold mb-4 text-gray-900">Refine & Implement</h3>
                        <p className="text-gray-600 mb-6">
                          Fine-tune your personas to match your specific business needs and download them in your preferred format. Use these insights to create targeted content, optimize your sales approach, and drive marketing ROI.
                        </p>
                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                          <div className="text-sm text-gray-500 mb-2">Refinement Options</div>
                          <div className="text-gray-900 font-medium">Export as PDF, Share with team, API access</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Use Cases */}
          <section className="py-20 bg-white relative">
            <div className="container mx-auto px-4 sm:px-6">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
                  Powerful <span className="text-indigo-600">Use Cases</span>
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Discover how our AI personas can transform your marketing strategy
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="flex items-start mb-4">
                    <div className="bg-indigo-100 p-3 rounded-lg mr-4">
                      <Target className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2 text-gray-900">Content Targeting</h3>
                      <p className="text-gray-600">
                        Create content specifically tailored to the needs, interests, and pain points of your target audience, increasing engagement and conversion rates.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="flex items-start mb-4">
                    <div className="bg-indigo-100 p-3 rounded-lg mr-4">
                      <Compass className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2 text-gray-900">Product Development</h3>
                      <p className="text-gray-600">
                        Guide product development and feature prioritization based on deep understanding of customer needs and preferences.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="flex items-start mb-4">
                    <div className="bg-indigo-100 p-3 rounded-lg mr-4">
                      <Building2 className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2 text-gray-900">Market Expansion</h3>
                      <p className="text-gray-600">
                        Identify and understand new market segments to inform your expansion strategy and messaging approach.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="flex items-start mb-4">
                    <div className="bg-indigo-100 p-3 rounded-lg mr-4">
                      <Users className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2 text-gray-900">Sales Enablement</h3>
                      <p className="text-gray-600">
                        Equip your sales team with detailed buyer personas to improve prospecting, conversations, and closing rates.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Pricing Section */}
          <section id="pricing" className="py-20 bg-white relative">
            <div className="container mx-auto px-4 sm:px-6">
              <div className="text-center mb-10">
                <div className="inline-block bg-gray-100 text-indigo-600 font-medium px-4 py-2 rounded-md mb-6">Pricing</div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
                  <span className="text-indigo-600">Simple pricing</span>, for everyone
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
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
                          <Check className="h-4 w-4 text-indigo-600 mr-2 flex-shrink-0" />
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
                          <Check className="h-4 w-4 text-indigo-600 mr-2 flex-shrink-0" />
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
                          <Check className="h-4 w-4 text-indigo-600 mr-2 flex-shrink-0" />
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
              <div className="text-center mb-16">
                <div className="inline-block bg-gray-100 text-indigo-600 font-medium px-4 py-2 rounded-md mb-6">Demo</div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
                  Try it <span className="text-indigo-600">yourself</span>
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
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
                          
                          <div className="mb-4">
                            <div className="text-gray-500 text-sm mb-1">Company</div>
                            <div className="text-gray-900">{demoPersona.company}</div>
                          </div>
                          
                          {demoPersona.experience && (
                            <div className="mb-4">
                              <div className="text-gray-500 text-sm mb-1">Experience</div>
                              <div className="text-gray-900">{demoPersona.experience} years</div>
                            </div>
                          )}
                          
                          {demoPersona.demographics && (
                            <div className="mb-4">
                              <div className="text-gray-500 text-sm mb-1">Demographics</div>
                              <div className="text-gray-900">
                                {typeof demoPersona.demographics === 'string' 
                                  ? demoPersona.demographics 
                                  : typeof demoPersona.demographics === 'object' 
                                    ? Object.entries(demoPersona.demographics).map(([key, value]) => (
                                        <div key={key} className="mt-1">
                                          <span className="font-medium capitalize">{key}: </span>
                                          <span>{String(value)}</span>
                                        </div>
                                      ))
                                    : 'Not specified'}
                              </div>
                            </div>
                          )}
                          
                          <div className="mb-4">
                            <div className="text-gray-500 text-sm mb-1">Pain Points</div>
                            <ul className="text-gray-700 list-disc list-inside">
                              {demoPersona.pains?.map((pain: string, index: number) => (
                                <li key={index} className="my-1">{pain}</li>
                              ))}
                            </ul>
                          </div>
                          
                          <div className="mb-4">
                            <div className="text-gray-500 text-sm mb-1">Goals</div>
                            <ul className="text-gray-700 list-disc list-inside">
                              {demoPersona.goals?.map((goal: string, index: number) => (
                                <li key={index} className="my-1">{goal}</li>
                              ))}
                            </ul>
                          </div>
                          
                          <div>
                            <div className="text-gray-500 text-sm mb-1">Professional Interests</div>
                            <ul className="text-gray-700 list-disc list-inside">
                              {demoPersona.interests?.map((interest: string, index: number) => (
                                <li key={index} className="my-1">{interest}</li>
                              ))}
                            </ul>
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
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
                  Frequently Asked <span className="text-indigo-600">Questions</span>
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Find answers to common questions about our AI Persona Service
                </p>
              </div>
              
              <div className="max-w-3xl mx-auto">
                <div className="space-y-6">
                  <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
                    <h3 className="text-xl font-semibold mb-3 text-gray-900">How accurate are the AI-generated personas?</h3>
                    <p className="text-gray-600">
                      Our AI personas are based on industry research, market data, and advanced language models. While they provide a strong starting point, we recommend refining them with your specific business knowledge and customer insights for maximum accuracy.
                    </p>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
                    <h3 className="text-xl font-semibold mb-3 text-gray-900">Can I customize the personas after they're generated?</h3>
                    <p className="text-gray-600">
                      Yes, all generated personas can be customized. You can edit demographics, goals, pain points, behaviors, and other attributes to better match your specific target audience.
                    </p>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
                    <h3 className="text-xl font-semibold mb-3 text-gray-900">Do I need technical skills to use this service?</h3>
                    <p className="text-gray-600">
                      No technical skills are required. Our intuitive interface guides you through the process with simple selections and clear instructions. You'll be able to generate professional personas in minutes.
                    </p>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
                    <h3 className="text-xl font-semibold mb-3 text-gray-900">How do I integrate these personas with my marketing strategy?</h3>
                    <p className="text-gray-600">
                      Each persona includes recommendations for content types, messaging approaches, and channels that work best for that audience. You can use these insights to tailor your marketing campaigns, product messaging, and sales approaches.
                    </p>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
                    <h3 className="text-xl font-semibold mb-3 text-gray-900">Can I use this as a standalone service, or do I need the full Tovably platform?</h3>
                    <p className="text-gray-600">
                      The AI Persona Service is available as a standalone offering with its own pricing plans. While it integrates seamlessly with the full Tovably platform for enhanced capabilities, you don't need to subscribe to other Tovably services to use it.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20 bg-indigo-600 relative">
            <div className="absolute inset-0 bg-[url('/dots-pattern.svg')] opacity-10 z-0"></div>
            <div className="container mx-auto px-4 sm:px-6 relative z-10">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                  Ready to Understand Your Audience on a <span className="text-indigo-200">Deeper Level</span>?
                </h2>
                <p className="text-xl text-indigo-100 mb-10 max-w-2xl mx-auto">
                  Start creating detailed, AI-powered personas today and transform your marketing strategy with deeper audience insights.
                </p>
                <Button 
                  className="bg-white hover:bg-gray-100 text-indigo-600 font-medium text-lg py-4 px-8 rounded-md shadow-md"
                  onClick={() => window.location.href = "#pricing"}
                >
                  Get Started Now
                </Button>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}