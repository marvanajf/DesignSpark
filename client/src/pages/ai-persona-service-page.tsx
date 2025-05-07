import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { 
  ArrowRight, 
  Check, 
  Users, 
  Sparkles, 
  UserCircle, 
  Building2,
  ChevronRight,
  Star,
  Zap,
  Shield,
  Brain
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { IndustrySelector } from "@/components/IndustrySelector";
import { Industry } from "@/lib/industries";
import { FeatureCard } from "@/components/FeatureCard";
import { PricingCard } from "@/components/PricingCard";

export default function AIPersonaServicePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [personaDescription, setPersonaDescription] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState<Industry | null>(null);
  const [generateTab, setGenerateTab] = useState<'description' | 'industry'>('description');
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false);

  const handleGeneratePersona = () => {
    // This would integrate with your existing persona generation functionality
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login or sign up to generate personas",
        variant: "destructive",
      });
      return;
    }
    
    // Demo behavior - just close the dialog since we're just previewing the UI
    toast({
      title: "Persona Generation",
      description: "This is a preview of the AI Persona Service. Integration would be implemented in the full version.",
    });
    setIsGenerateDialogOpen(false);
  };

  const handleIndustrySelect = (industry: Industry) => {
    setSelectedIndustry(industry);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0e17] to-black text-white">
      {/* Navigation Bar */}
      <nav className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/">
                <a className="flex items-center">
                  <span className="text-xl font-bold text-[#74d1ea]">Tovably</span>
                  <span className="mx-2 text-gray-500">|</span>
                  <span className="text-gray-300">AI Persona Service</span>
                </a>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/pricing">
                <a className="text-sm text-gray-300 hover:text-[#74d1ea]">Pricing</a>
              </Link>
              <Link href="/docs">
                <a className="text-sm text-gray-300 hover:text-[#74d1ea]">Documentation</a>
              </Link>
              {user ? (
                <Link href="/dashboard">
                  <Button className="bg-[#74d1ea] hover:bg-[#5db8d0] text-black">
                    Dashboard
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              ) : (
                <Link href="/auth">
                  <Button className="bg-[#74d1ea] hover:bg-[#5db8d0] text-black">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/persona-bg-pattern.svg')] opacity-5"></div>
        <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-[#74d1ea]/10 to-transparent"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-28">
          <div className="text-center max-w-3xl mx-auto">
            <Badge className="mb-4 bg-[#74d1ea]/20 text-[#74d1ea] border-0 py-1.5 px-3 text-sm">
              <Sparkles className="mr-1 h-3.5 w-3.5" />
              Powered by Advanced AI
            </Badge>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              Generate Perfect Audience Personas
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Create detailed, realistic personas for your target audience in seconds. 
              Craft content that speaks directly to your ideal customers.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Dialog open={isGenerateDialogOpen} onOpenChange={setIsGenerateDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-[#74d1ea] hover:bg-[#5db8d0] text-black text-lg px-8 py-6">
                    <Sparkles className="mr-2 h-5 w-5" />
                    Try it Free
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-[#0a0e17] border border-gray-800 text-white max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">Generate Your Persona</DialogTitle>
                    <DialogDescription className="text-gray-400">
                      Create a detailed target persona with our AI assistant.
                    </DialogDescription>
                  </DialogHeader>
                  
                  {/* Tabs */}
                  <div className="flex space-x-4 border-b border-gray-800 mb-6">
                    <button
                      className={`px-4 py-2 ${generateTab === 'description' ? 'text-[#74d1ea] border-b-2 border-[#74d1ea]' : 'text-gray-400'}`}
                      onClick={() => setGenerateTab('description')}
                    >
                      Describe Your Audience
                    </button>
                    <button
                      className={`px-4 py-2 ${generateTab === 'industry' ? 'text-[#74d1ea] border-b-2 border-[#74d1ea]' : 'text-gray-400'}`}
                      onClick={() => setGenerateTab('industry')}
                    >
                      Select Industry
                    </button>
                  </div>
                  
                  {/* Description Tab */}
                  {generateTab === 'description' && (
                    <div>
                      <div className="mb-4">
                        <label htmlFor="persona-description" className="block text-sm font-medium text-gray-300 mb-1">
                          Describe your target audience in detail
                        </label>
                        <Textarea
                          id="persona-description"
                          value={personaDescription}
                          onChange={(e) => setPersonaDescription(e.target.value)}
                          placeholder="E.g. Marketing directors, age 35-45, at mid-sized tech companies who are interested in improving their digital marketing strategies."
                          className="bg-[#111827] border-gray-800 text-gray-300 h-40 resize-none"
                        />
                      </div>
                      
                      <div className="bg-[#111827]/50 border border-gray-800/80 rounded-lg p-4 mb-6">
                        <h3 className="text-sm font-medium text-gray-300 mb-2 flex items-center">
                          <Sparkles className="h-4 w-4 mr-2 text-[#74d1ea]" />
                          Tips for better personas
                        </h3>
                        <ul className="text-xs text-gray-400 space-y-2 list-disc pl-5">
                          <li>Include demographic details: age range, job titles, industries</li>
                          <li>Mention specific challenges and pain points they face</li>
                          <li>Add information about goals and motivations</li>
                          <li>Describe their technical expertise and comfort level</li>
                          <li>Include any relevant purchasing behaviors or decision factors</li>
                        </ul>
                      </div>
                    </div>
                  )}
                  
                  {/* Industry Tab */}
                  {generateTab === 'industry' && (
                    <div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Select the industry your audience works in
                        </label>
                        <IndustrySelector 
                          selectedIndustry={selectedIndustry}
                          onSelectIndustry={handleIndustrySelect}
                        />
                      </div>
                      
                      {selectedIndustry && (
                        <div className="bg-[#111827]/50 border border-gray-800/80 rounded-lg p-4 mb-6">
                          <h3 className="text-sm font-medium text-gray-300 flex items-center mb-2">
                            <Building2 className="h-4 w-4 mr-2 text-[#74d1ea]" />
                            Selected: {selectedIndustry.name}
                          </h3>
                          <p className="text-xs text-gray-400">
                            Our AI will generate a realistic persona for a typical decision-maker in the {selectedIndustry.name} industry, including demographics, goals, challenges, and interests.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsGenerateDialogOpen(false)}
                      className="border-gray-700 text-gray-300"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleGeneratePersona}
                      className="bg-[#74d1ea] hover:bg-[#5db8d0] text-black"
                    >
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate Persona
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
              <Link href="/pricing">
                <Button variant="outline" className="border-[#74d1ea] text-[#74d1ea] hover:bg-[#74d1ea]/10 text-lg px-8 py-6">
                  View Pricing
                  <ChevronRight className="ml-1 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Key Features Section */}
      <section className="py-20 bg-gradient-to-b from-black to-[#0a0e17]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Use AI-Generated Personas?</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Our AI persona generation tool helps marketers and content creators build detailed audience profiles to create more effective, targeted content.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Users className="h-6 w-6 text-[#74d1ea]" />}
              title="Detailed Demographics"
              description="Create realistic audience profiles with accurate age ranges, job roles, income levels, and educational backgrounds."
            />
            
            <FeatureCard
              icon={<Brain className="h-6 w-6 text-[#74d1ea]" />}
              title="Psychographic Insights"
              description="Understand interests, motivations, values, and lifestyles of your target personas to create content that resonates."
            />
            
            <FeatureCard
              icon={<Sparkles className="h-6 w-6 text-[#74d1ea]" />}
              title="AI-Powered Generation"
              description="Leverage advanced machine learning to instantly create detailed, realistic personas based on minimal input."
            />
            
            <FeatureCard
              icon={<Star className="h-6 w-6 text-[#74d1ea]" />}
              title="Industry-Specific"
              description="Generate personas tailored to specific industries with relevant pain points, goals, and technical knowledge."
            />
            
            <FeatureCard
              icon={<Zap className="h-6 w-6 text-[#74d1ea]" />}
              title="Save Time & Effort"
              description="Create in seconds what would typically take hours of research and multiple stakeholder interviews."
            />
            
            <FeatureCard
              icon={<Shield className="h-6 w-6 text-[#74d1ea]" />}
              title="Privacy Focused"
              description="Generate fictional yet realistic personas without compromising real customer data or privacy."
            />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 bg-gradient-to-b from-[#0a0e17] to-black relative">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-[#74d1ea]/20 text-[#74d1ea] border-0 py-1.5 px-3 text-sm">
              Flexible Pricing
            </Badge>
            <h2 className="text-3xl font-bold mb-4">Choose Your Plan</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Select the plan that fits your needs, from occasional persona creation to enterprise-level audience management.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Free Plan */}
            <PricingCard
              title="Free"
              description="Perfect for individuals or small businesses just getting started."
              price="$0"
              periodLabel="Forever free"
              features={[
                "3 AI persona generations per month",
                "Basic persona demographics",
                "Downloadable PDF exports",
                "Single user access",
                "Community support"
              ]}
              buttonText={user ? "Current Plan" : "Get Started Free"}
              buttonHref={user ? "/dashboard" : "/auth"}
              isPopular={false}
              isDisabled={user !== null}
              footnote="All quotas refresh monthly"
            />
            
            {/* Standard Plan */}
            <PricingCard
              title="Standard"
              description="For growing businesses needing more detailed personas and higher limits."
              price="$29"
              periodLabel="per month"
              features={[
                "25 AI persona generations per month",
                "Advanced demographics & psychographics",
                "Interests and pain point analysis",
                "Persona organization and tagging",
                "Team sharing (up to 3 users)",
                "Priority email support"
              ]}
              buttonText="Upgrade to Standard"
              buttonHref={user ? "/billing" : "/auth?plan=standard"}
              isPopular={true}
              footnote="All quotas refresh monthly"
            />
            
            {/* Pro Plan */}
            <PricingCard
              title="Pro"
              description="For marketing teams and agencies working with multiple clients and brands."
              price="$89"
              periodLabel="per month"
              features={[
                "Unlimited AI persona generations",
                "Complete demographic & psychographic profiles",
                "Custom fields and attributes",
                "Behavioral pattern analysis",
                "Personality trait mapping",
                "Workspace organization (multi-brand)",
                "Team collaboration (up to 10 users)",
                "Priority phone & email support"
              ]}
              buttonText="Upgrade to Pro"
              buttonHref={user ? "/billing" : "/auth?plan=pro"}
              isPopular={false}
              footnote="All quotas refresh monthly"
            />
          </div>
          
          <div className="mt-12 text-center">
            <p className="text-gray-400">
              Need a custom enterprise plan with advanced features and higher limits?
            </p>
            <Link href="/contact">
              <Button variant="link" className="text-[#74d1ea] hover:underline mt-2">
                Contact our sales team
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#0e131f] to-[#131b2e]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Create Your First AI Persona?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Start generating detailed, realistic audience personas today and transform your marketing strategy.
          </p>
          
          <Dialog open={isGenerateDialogOpen} onOpenChange={setIsGenerateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#74d1ea] hover:bg-[#5db8d0] text-black text-lg px-8 py-6">
                <Sparkles className="mr-2 h-5 w-5" />
                Generate Your First Persona
              </Button>
            </DialogTrigger>
          </Dialog>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold text-white mb-4">Tovably</h3>
              <p className="text-gray-400 text-sm">
                AI-powered tools for modern marketers and content creators.
              </p>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-gray-300 mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/features" className="text-gray-400 hover:text-[#74d1ea]">Features</a></li>
                <li><a href="/pricing" className="text-gray-400 hover:text-[#74d1ea]">Pricing</a></li>
                <li><a href="/roadmap" className="text-gray-400 hover:text-[#74d1ea]">Roadmap</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-gray-300 mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/docs" className="text-gray-400 hover:text-[#74d1ea]">Documentation</a></li>
                <li><a href="/guides" className="text-gray-400 hover:text-[#74d1ea]">Guides</a></li>
                <li><a href="/api" className="text-gray-400 hover:text-[#74d1ea]">API</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-gray-300 mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/about" className="text-gray-400 hover:text-[#74d1ea]">About Us</a></li>
                <li><a href="/contact" className="text-gray-400 hover:text-[#74d1ea]">Contact</a></li>
                <li><a href="/privacy" className="text-gray-400 hover:text-[#74d1ea]">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} Tovably. All rights reserved.
            </p>
            
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-[#74d1ea]">
                <span className="sr-only">Twitter</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-[#74d1ea]">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}