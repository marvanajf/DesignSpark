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
          <section className="relative py-20 overflow-hidden">
            <div className="absolute inset-0 bg-gray-50 z-0"></div>
            <div className="absolute inset-0 bg-[url('/persona-pattern.svg')] opacity-10 z-0"></div>
            
            {/* Background dots pattern inspired by screenshots */}
            <div className="absolute right-0 top-0 w-1/2 h-full bg-[url('/dots-pattern.svg')] bg-no-repeat bg-right-top opacity-40 z-0"></div>
            
            <div className="container mx-auto px-4 sm:px-6 relative z-10">
              <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-900">
                  AI-Powered <span className="text-indigo-600">Audience Personas</span>
                </h1>
                <p className="text-xl md:text-2xl mb-10 text-gray-600">
                  Create detailed, customized audience profiles to power your marketing strategy
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-lg py-4 px-8 rounded-md shadow-md"
                    onClick={() => window.location.href = "#pricing"}
                  >
                    Start for free
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-gray-300 text-gray-700 hover:bg-gray-50 text-lg py-4 px-8 rounded-md"
                    onClick={() => window.location.href = "#features"}
                  >
                    Explore Features
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Key Features */}
          <section id="features" className="py-20 bg-white relative">
            <div className="container mx-auto px-4 sm:px-6">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
                  Create Professional-Grade <span className="text-indigo-600">Audience Personas</span>
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Our AI Persona Service helps you develop comprehensive audience profiles that power your marketing strategy
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
                  <div className="flex items-center mb-4">
                    <div className="bg-indigo-100 p-3 rounded-lg mr-4">
                      <BrainCircuit className="h-6 w-6 text-indigo-600" />
                    </div>
                    <h3 className="font-semibold text-xl text-gray-900">AI-Powered Creation</h3>
                  </div>
                  <p className="text-gray-600">Generate detailed personas based on industry, demographics, and psychographics using OpenAI's advanced language models.</p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
                  <div className="flex items-center mb-4">
                    <div className="bg-indigo-100 p-3 rounded-lg mr-4">
                      <Microscope className="h-6 w-6 text-indigo-600" />
                    </div>
                    <h3 className="font-semibold text-xl text-gray-900">Deep Audience Insights</h3>
                  </div>
                  <p className="text-gray-600">Understand motivations, pain points, goals, and behavior patterns of your target audience with psychological depth.</p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
                  <div className="flex items-center mb-4">
                    <div className="bg-indigo-100 p-3 rounded-lg mr-4">
                      <Layout className="h-6 w-6 text-indigo-600" />
                    </div>
                    <h3 className="font-semibold text-xl text-gray-900">Visual Profiles</h3>
                  </div>
                  <p className="text-gray-600">Create beautifully formatted persona documents with structured information in an easy-to-reference format.</p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
                  <div className="flex items-center mb-4">
                    <div className="bg-indigo-100 p-3 rounded-lg mr-4">
                      <Target className="h-6 w-6 text-indigo-600" />
                    </div>
                    <h3 className="font-semibold text-xl text-gray-900">Industry Targeting</h3>
                  </div>
                  <p className="text-gray-600">Choose from over 20 industry categories to generate personas specifically tailored to your business sector.</p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
                  <div className="flex items-center mb-4">
                    <div className="bg-indigo-100 p-3 rounded-lg mr-4">
                      <MessagesSquare className="h-6 w-6 text-indigo-600" />
                    </div>
                    <h3 className="font-semibold text-xl text-gray-900">Content Strategy</h3>
                  </div>
                  <p className="text-gray-600">Get recommendations for content topics, formats, and channels that will resonate with each persona.</p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
                  <div className="flex items-center mb-4">
                    <div className="bg-indigo-100 p-3 rounded-lg mr-4">
                      <Settings className="h-6 w-6 text-indigo-600" />
                    </div>
                    <h3 className="font-semibold text-xl text-gray-900">Customizable Attributes</h3>
                  </div>
                  <p className="text-gray-600">Fine-tune generated personas by adjusting attributes, goals, and characteristics to match your business needs.</p>
                </div>
              </div>
            </div>
          </section>

          {/* How It Works */}
          <section className="py-20 bg-gray-50 relative">
            <div className="container mx-auto px-4 sm:px-6">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
                  How It <span className="text-indigo-600">Works</span>
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Creating AI personas is simple with our streamlined process
                </p>
              </div>
              
              <div className="max-w-5xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="text-center bg-white p-8 rounded-lg shadow-sm border border-gray-100">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 mb-5">
                      <span className="text-xl font-bold text-indigo-600">1</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-gray-900">Select Your Industry</h3>
                    <p className="text-gray-600">
                      Choose from over 20 industry categories or describe your specific business niche
                    </p>
                  </div>
                  
                  <div className="text-center bg-white p-8 rounded-lg shadow-sm border border-gray-100">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 mb-5">
                      <span className="text-xl font-bold text-indigo-600">2</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-gray-900">Generate Personas</h3>
                    <p className="text-gray-600">
                      Our AI creates detailed personas complete with demographics, goals, pain points, and behaviors
                    </p>
                  </div>
                  
                  <div className="text-center bg-white p-8 rounded-lg shadow-sm border border-gray-100">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 mb-5">
                      <span className="text-xl font-bold text-indigo-600">3</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-gray-900">Refine & Download</h3>
                    <p className="text-gray-600">
                      Customize the generated personas and save them for use in your marketing strategy
                    </p>
                  </div>
                </div>
                
                <div className="mt-16 text-center">
                  <Button 
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-lg py-4 px-8 rounded-md shadow-md"
                    onClick={() => window.location.href = "#pricing"}
                  >
                    Start Creating Personas
                  </Button>
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
          <section id="pricing" className="py-20 bg-gray-50 relative">
            <div className="container mx-auto px-4 sm:px-6">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
                  Simple, Transparent <span className="text-indigo-600">Pricing</span>
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Choose the plan that fits your business needs
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900">Basic</h3>
                    <p className="text-gray-600 mb-4">Perfect for individuals and small businesses</p>
                    <p className="text-3xl font-bold text-gray-900 mb-4">$49<span className="text-lg text-gray-500 font-normal">/month</span></p>
                    <ul className="space-y-3 mb-6">
                      {[
                        "10 AI-generated personas per month",
                        "Industry-specific insights",
                        "Basic demographic analysis",
                        "Core persona attributes only",
                        "PDF export functionality",
                        "Email support"
                      ].map((feature, i) => (
                        <li className="flex items-center" key={i}>
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                          <span className="text-gray-600 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md">
                      Get Started
                    </Button>
                    <p className="text-gray-500 text-xs text-center mt-4">All quotas refresh monthly</p>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg border-2 border-indigo-600 shadow-md overflow-hidden relative">
                  <div className="absolute top-0 inset-x-0 bg-indigo-600 text-white text-xs py-1 text-center font-medium">
                    MOST POPULAR
                  </div>
                  <div className="p-6 pt-8">
                    <h3 className="text-lg font-semibold text-gray-900">Premium</h3>
                    <p className="text-gray-600 mb-4">For marketers needing advanced customization</p>
                    <p className="text-3xl font-bold text-gray-900 mb-4">$149<span className="text-lg text-gray-500 font-normal">/month</span></p>
                    <ul className="space-y-3 mb-6">
                      {[
                        "30 AI-generated personas per month",
                        "All Basic features",
                        "Advanced psychographic analysis",
                        "Market segment customization",
                        "Regional adaptation options",
                        "Buying stage customization",
                        "Decision style profiling",
                        "Priority email & chat support"
                      ].map((feature, i) => (
                        <li className="flex items-center" key={i}>
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                          <span className="text-gray-600 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md">
                      Get Started
                    </Button>
                    <p className="text-gray-500 text-xs text-center mt-4">All quotas refresh monthly</p>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900">Enterprise</h3>
                    <p className="text-gray-600 mb-4">For organizations needing deep audience insights</p>
                    <p className="text-3xl font-bold text-gray-900 mb-4">$499<span className="text-lg text-gray-500 font-normal">/month</span></p>
                    <ul className="space-y-3 mb-6">
                      {[
                        "Unlimited AI-generated personas",
                        "All Premium features",
                        "Content strategy integration",
                        "Competitive positioning analysis",
                        "Objection prediction & countering",
                        "Full persona API access",
                        "Training and onboarding"
                      ].map((feature, i) => (
                        <li className="flex items-center" key={i}>
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                          <span className="text-gray-600 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button className="w-full bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-md">
                      Contact Sales
                    </Button>
                    <p className="text-gray-500 text-xs text-center mt-4">All quotas refresh monthly</p>
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
          <section id="try-demo" className="py-20 bg-white relative">
            <div className="container mx-auto px-4 sm:px-6">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
                  <span className="text-indigo-600">Try</span> Before You Buy
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
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