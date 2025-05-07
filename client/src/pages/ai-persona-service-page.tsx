import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet";
import { Link } from "wouter";
import { useEffect } from "react";
import { 
  BarChart3, 
  BrainCircuit,
  Building2,
  CheckCircle,
  Code,
  Compass,
  Layout,
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

export default function AIPersonaServicePage() {
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>AI Persona Service | Tovably</title>
        <meta
          name="description"
          content="Create detailed, customized audience personas using OpenAI technology. Understand your ideal customers deeply with Tovably's AI Persona Service."
        />
      </Helmet>

      <div className="min-h-screen bg-black text-white flex flex-col">
        <Navbar />

        <main className="flex-grow">
          {/* Hero Section */}
          <section className="relative py-20 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-[#091425] to-black z-0"></div>
            <div className="absolute inset-0 bg-[url('/persona-pattern.svg')] opacity-20 z-0"></div>
            
            {/* Glow effect */}
            <div className="absolute top-40 left-1/4 w-96 h-96 bg-[#74d1ea] rounded-full filter blur-[150px] opacity-20 z-0"></div>
            <div className="absolute bottom-20 right-1/4 w-64 h-64 bg-[#74d1ea] rounded-full filter blur-[120px] opacity-10 z-0"></div>
            
            <div className="container mx-auto px-4 sm:px-6 relative z-10">
              <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-[#74d1ea]">
                  AI-Powered Audience Personas
                </h1>
                <p className="text-xl md:text-2xl mb-10 text-gray-300">
                  Create detailed, customized audience profiles to power your marketing strategy
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    className="bg-[#74d1ea] hover:bg-[#5db8d0] text-black text-lg py-6 px-8"
                    onClick={() => window.location.href = "#pricing"}
                  >
                    Get Started
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-[#74d1ea] text-[#74d1ea] hover:bg-[#74d1ea]/10 text-lg py-6 px-8"
                    onClick={() => window.location.href = "#features"}
                  >
                    Explore Features
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Key Features */}
          <section id="features" className="py-20 bg-black relative">
            <div className="container mx-auto px-4 sm:px-6">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Create Professional-Grade <span className="text-[#74d1ea]">Audience Personas</span>
                </h2>
                <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                  Our AI Persona Service helps you develop comprehensive audience profiles that power your marketing strategy
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <FeatureCard 
                  icon={<BrainCircuit className="h-6 w-6 text-[#74d1ea]" />}
                  title="AI-Powered Persona Creation" 
                  description="Generate detailed personas based on industry, demographics, and psychographics using OpenAI's advanced language models."
                />
                <FeatureCard 
                  icon={<Microscope className="h-6 w-6 text-[#74d1ea]" />}
                  title="Deep Audience Insights" 
                  description="Understand motivations, pain points, goals, and behavior patterns of your target audience with psychological depth."
                />
                <FeatureCard 
                  icon={<Layout className="h-6 w-6 text-[#74d1ea]" />}
                  title="Visual Persona Profiles" 
                  description="Create beautifully formatted persona documents with structured information in an easy-to-reference format."
                />
                <FeatureCard 
                  icon={<Target className="h-6 w-6 text-[#74d1ea]" />}
                  title="Industry-Specific Targeting" 
                  description="Choose from over 20 industry categories to generate personas specifically tailored to your business sector."
                />
                <FeatureCard 
                  icon={<MessagesSquare className="h-6 w-6 text-[#74d1ea]" />}
                  title="Content Strategy Guidance" 
                  description="Get recommendations for content topics, formats, and channels that will resonate with each persona."
                />
                <FeatureCard 
                  icon={<Settings className="h-6 w-6 text-[#74d1ea]" />}
                  title="Customizable Attributes" 
                  description="Fine-tune generated personas by adjusting attributes, goals, and characteristics to match your business needs."
                />
              </div>
            </div>
          </section>

          {/* How It Works */}
          <section className="py-20 bg-gradient-to-b from-black to-[#040a13] relative">
            <div className="container mx-auto px-4 sm:px-6">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  How It <span className="text-[#74d1ea]">Works</span>
                </h2>
                <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                  Creating AI personas is simple with our streamlined process
                </p>
              </div>
              
              <div className="max-w-5xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#74d1ea]/20 mb-5 border border-[#74d1ea]/30">
                      <span className="text-2xl font-bold text-[#74d1ea]">1</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-3">Select Your Industry</h3>
                    <p className="text-gray-400">
                      Choose from over 20 industry categories or describe your specific business niche
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#74d1ea]/20 mb-5 border border-[#74d1ea]/30">
                      <span className="text-2xl font-bold text-[#74d1ea]">2</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-3">Generate Personas</h3>
                    <p className="text-gray-400">
                      Our AI creates detailed personas complete with demographics, goals, pain points, and behaviors
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#74d1ea]/20 mb-5 border border-[#74d1ea]/30">
                      <span className="text-2xl font-bold text-[#74d1ea]">3</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-3">Refine & Download</h3>
                    <p className="text-gray-400">
                      Customize the generated personas and save them for use in your marketing strategy
                    </p>
                  </div>
                </div>
                
                <div className="mt-16 text-center">
                  <Button 
                    className="bg-[#74d1ea] hover:bg-[#5db8d0] text-black text-lg py-6 px-8"
                    onClick={() => window.location.href = "#pricing"}
                  >
                    Start Creating Personas
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Use Cases */}
          <section className="py-20 bg-[#040a13] relative">
            <div className="container mx-auto px-4 sm:px-6">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Powerful <span className="text-[#74d1ea]">Use Cases</span>
                </h2>
                <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                  Discover how our AI personas can transform your marketing strategy
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                <div className="bg-black/50 border border-gray-800 rounded-lg p-6 hover:border-[#74d1ea]/30 transition-all duration-300">
                  <div className="flex items-start mb-4">
                    <div className="bg-[#74d1ea]/20 p-2 rounded mr-4">
                      <Target className="h-6 w-6 text-[#74d1ea]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Content Targeting</h3>
                      <p className="text-gray-400">
                        Create content specifically tailored to the needs, interests, and pain points of your target audience, increasing engagement and conversion rates.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-black/50 border border-gray-800 rounded-lg p-6 hover:border-[#74d1ea]/30 transition-all duration-300">
                  <div className="flex items-start mb-4">
                    <div className="bg-[#74d1ea]/20 p-2 rounded mr-4">
                      <Compass className="h-6 w-6 text-[#74d1ea]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Product Development</h3>
                      <p className="text-gray-400">
                        Guide product development and feature prioritization based on deep understanding of customer needs and preferences.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-black/50 border border-gray-800 rounded-lg p-6 hover:border-[#74d1ea]/30 transition-all duration-300">
                  <div className="flex items-start mb-4">
                    <div className="bg-[#74d1ea]/20 p-2 rounded mr-4">
                      <Building2 className="h-6 w-6 text-[#74d1ea]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Market Expansion</h3>
                      <p className="text-gray-400">
                        Identify and understand new market segments to inform your expansion strategy and messaging approach.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-black/50 border border-gray-800 rounded-lg p-6 hover:border-[#74d1ea]/30 transition-all duration-300">
                  <div className="flex items-start mb-4">
                    <div className="bg-[#74d1ea]/20 p-2 rounded mr-4">
                      <Users className="h-6 w-6 text-[#74d1ea]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Sales Enablement</h3>
                      <p className="text-gray-400">
                        Equip your sales team with detailed buyer personas to improve prospecting, conversations, and closing rates.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Pricing Section */}
          <section id="pricing" className="py-20 bg-gradient-to-b from-[#040a13] to-black relative">
            <div className="container mx-auto px-4 sm:px-6">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Simple, Transparent <span className="text-[#74d1ea]">Pricing</span>
                </h2>
                <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                  Choose the plan that fits your business needs
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                <PricingCard
                  title="Starter"
                  description="Perfect for small businesses and freelancers"
                  price="$29"
                  periodLabel="/month"
                  features={[
                    "5 AI-generated personas per month",
                    "Basic industry templates",
                    "Downloadable PDF exports",
                    "Email support",
                    "Persona library access"
                  ]}
                  buttonText="Get Started"
                  buttonHref="/auth"
                  footnote="All quotas refresh monthly"
                />
                
                <PricingCard
                  title="Professional"
                  description="Ideal for growing marketing teams"
                  price="$79"
                  periodLabel="/month"
                  features={[
                    "15 AI-generated personas per month",
                    "Advanced industry templates",
                    "Custom attributes configuration",
                    "Priority email support",
                    "Content strategy recommendations",
                    "Collaborative workspace"
                  ]}
                  buttonText="Get Started"
                  buttonHref="/auth"
                  isPopular={true}
                  footnote="All quotas refresh monthly"
                />
                
                <PricingCard
                  title="Enterprise"
                  description="For agencies and large organizations"
                  price="$199"
                  periodLabel="/month"
                  features={[
                    "Unlimited AI-generated personas",
                    "Custom industry templates",
                    "Advanced persona analytics",
                    "Dedicated account manager",
                    "API access for integration",
                    "Team collaboration tools",
                    "Training and onboarding"
                  ]}
                  buttonText="Contact Sales"
                  buttonHref="/contact"
                  footnote="All quotas refresh monthly"
                />
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="py-20 bg-black relative">
            <div className="container mx-auto px-4 sm:px-6">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Frequently Asked <span className="text-[#74d1ea]">Questions</span>
                </h2>
                <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                  Find answers to common questions about our AI Persona Service
                </p>
              </div>
              
              <div className="max-w-3xl mx-auto">
                <div className="space-y-6">
                  <div className="border border-gray-800 rounded-lg p-6 bg-black/50">
                    <h3 className="text-xl font-semibold mb-3">How accurate are the AI-generated personas?</h3>
                    <p className="text-gray-400">
                      Our AI personas are based on industry research, market data, and advanced language models. While they provide a strong starting point, we recommend refining them with your specific business knowledge and customer insights for maximum accuracy.
                    </p>
                  </div>
                  
                  <div className="border border-gray-800 rounded-lg p-6 bg-black/50">
                    <h3 className="text-xl font-semibold mb-3">Can I customize the personas after they're generated?</h3>
                    <p className="text-gray-400">
                      Yes, all generated personas can be customized. You can edit demographics, goals, pain points, behaviors, and other attributes to better match your specific target audience.
                    </p>
                  </div>
                  
                  <div className="border border-gray-800 rounded-lg p-6 bg-black/50">
                    <h3 className="text-xl font-semibold mb-3">Do I need technical skills to use this service?</h3>
                    <p className="text-gray-400">
                      No technical skills are required. Our intuitive interface guides you through the process with simple selections and clear instructions. You'll be able to generate professional personas in minutes.
                    </p>
                  </div>
                  
                  <div className="border border-gray-800 rounded-lg p-6 bg-black/50">
                    <h3 className="text-xl font-semibold mb-3">How do I integrate these personas with my marketing strategy?</h3>
                    <p className="text-gray-400">
                      Each persona includes recommendations for content types, messaging approaches, and channels that work best for that audience. You can use these insights to tailor your marketing campaigns, product messaging, and sales approaches.
                    </p>
                  </div>
                  
                  <div className="border border-gray-800 rounded-lg p-6 bg-black/50">
                    <h3 className="text-xl font-semibold mb-3">Can I use this as a standalone service, or do I need the full Tovably platform?</h3>
                    <p className="text-gray-400">
                      The AI Persona Service is available as a standalone offering with its own pricing plans. While it integrates seamlessly with the full Tovably platform for enhanced capabilities, you don't need to subscribe to other Tovably services to use it.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20 bg-gradient-to-b from-black to-[#091425] relative">
            <div className="absolute inset-0 bg-[url('/persona-pattern.svg')] opacity-10 z-0"></div>
            <div className="container mx-auto px-4 sm:px-6 relative z-10">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Ready to Understand Your Audience on a <span className="text-[#74d1ea]">Deeper Level</span>?
                </h2>
                <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
                  Start creating detailed, AI-powered personas today and transform your marketing strategy with deeper audience insights.
                </p>
                <Button 
                  className="bg-[#74d1ea] hover:bg-[#5db8d0] text-black text-lg py-6 px-8"
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