import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import {
  Book,
  Sparkles,
  Lightbulb,
  MessageSquare,
  FileText,
  ExternalLink,
  FileCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import Layout from "@/components/Layout";

export default function KnowledgeBasePage() {
  const { user } = useAuth();
  const [, navigate] = useLocation();

  return (
    <Layout showSidebar={true}>
      <div className="flex-1 overflow-y-auto bg-black">
        <div className="p-6">
          {/* Header Section */}
          <div className="mb-6">
            <div className="flex justify-between items-center">
              <div>
                <div className="flex items-center text-sm text-gray-400">
                  <span>Tovably</span>
                  <span className="mx-2">›</span>
                  <span>Knowledge Base</span>
                </div>
                <h1 className="text-2xl font-semibold text-white mt-1">Using Tovably</h1>
              </div>
            </div>
          </div>

          {/* Introduction */}
          <div className="mb-8">
            <div className="group relative bg-[#0a0c10] border border-gray-800/60 rounded-xl overflow-hidden transition-all duration-300 shadow-[0_0_25px_rgba(116,209,234,0.05)]">
              <div className="absolute inset-0 bg-gradient-to-t from-[#74d1ea]/5 via-transparent to-transparent pointer-events-none opacity-50"></div>
              <div className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-[#0e131f] border border-[#74d1ea]/20 rounded-lg p-2.5 shadow-[0_0_15px_rgba(116,209,234,0.15)]">
                    <Book className="h-5 w-5 text-[#74d1ea]" />
                  </div>
                  <h2 className="text-lg font-semibold text-white">Complete Platform Guide</h2>
                </div>
                <p className="text-gray-300 mb-4">
                  Welcome to our comprehensive guide on using Tovably. This resource will help you understand how to use every feature of the platform in a logical, step-by-step process to create effective, targeted content.
                </p>
                <p className="text-gray-400">
                  Follow the guides in order to learn the complete Tovably workflow, or jump to specific features as needed. Each guide includes practical tips and direct links to the relevant platform tools.
                </p>
              </div>
            </div>
          </div>

          {/* Guide Section */}
          <div className="mb-10">
            <h2 className="text-xl text-white font-semibold mb-8 flex items-center">
              <div className="bg-[#0e131f] border border-[#74d1ea]/20 rounded-lg p-2 shadow-[0_0_15px_rgba(116,209,234,0.15)] mr-3">
                <Book className="h-5 w-5 text-[#74d1ea]" />
              </div>
              Feature Guides in Chronological Order
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* 1. Tone Analysis Guide */}
              <Card className="group relative bg-[#0a0c10] border border-gray-800/60 rounded-xl overflow-hidden transition-all duration-300 shadow-[0_0_25px_rgba(116,209,234,0.05)]">
                <div className="absolute inset-0 bg-gradient-to-t from-[#74d1ea]/5 via-transparent to-transparent pointer-events-none opacity-50"></div>
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#0e131f] border border-[#74d1ea]/20 text-[#74d1ea] font-semibold text-sm shadow-[0_0_15px_rgba(116,209,234,0.15)]">
                      1
                    </div>
                    <div className="bg-[#0e131f] border border-[#74d1ea]/20 rounded-lg p-2.5 shadow-[0_0_15px_rgba(116,209,234,0.15)]">
                      <FileText className="h-5 w-5 text-[#74d1ea]" />
                    </div>
                  </div>
                  <CardTitle className="text-xl font-bold text-white">Getting Started with Tone Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-4">
                    Learn how to use our AI-powered tone analysis to decode your brand's unique voice and improve content effectiveness.
                  </p>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start">
                      <div className="text-[#74d1ea] mr-3 mt-0.5">✓</div>
                      <span className="text-sm text-gray-300">Identify your tone's strengths and weaknesses</span>
                    </li>
                    <li className="flex items-start">
                      <div className="text-[#74d1ea] mr-3 mt-0.5">✓</div>
                      <span className="text-sm text-gray-300">Optimize content for target audience expectations</span>
                    </li>
                    <li className="flex items-start">
                      <div className="text-[#74d1ea] mr-3 mt-0.5">✓</div>
                      <span className="text-sm text-gray-300">Apply tone metrics to improve engagement rates</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={() => navigate('/tone-analysis')}
                    className="bg-[#74d1ea] hover:bg-[#5db8d0] text-black px-4 py-2 rounded-md shadow-[0_0_15px_rgba(116,209,234,0.15)]"
                  >
                    Try Tone Analysis
                  </Button>
                </CardFooter>
              </Card>

              {/* 2. Persona Development Guide */}
              <Card className="group relative bg-[#0a0c10] border border-gray-800/60 rounded-xl overflow-hidden transition-all duration-300 shadow-[0_0_25px_rgba(116,209,234,0.05)]">
                <div className="absolute inset-0 bg-gradient-to-t from-[#74d1ea]/5 via-transparent to-transparent pointer-events-none opacity-50"></div>
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#0e131f] border border-[#74d1ea]/20 text-[#74d1ea] font-semibold text-sm shadow-[0_0_15px_rgba(116,209,234,0.15)]">
                      2
                    </div>
                    <div className="bg-[#0e131f] border border-[#74d1ea]/20 rounded-lg p-2.5 shadow-[0_0_15px_rgba(116,209,234,0.15)]">
                      <MessageSquare className="h-5 w-5 text-[#74d1ea]" />
                    </div>
                  </div>
                  <CardTitle className="text-xl font-bold text-white">Creating Audience Personas</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-4">
                    Discover how to create detailed audience personas that will help you target your content more effectively.
                  </p>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start">
                      <div className="text-[#74d1ea] mr-3 mt-0.5">✓</div>
                      <span className="text-sm text-gray-300">Define key characteristics of your target audience</span>
                    </li>
                    <li className="flex items-start">
                      <div className="text-[#74d1ea] mr-3 mt-0.5">✓</div>
                      <span className="text-sm text-gray-300">Create personas based on market research and data</span>
                    </li>
                    <li className="flex items-start">
                      <div className="text-[#74d1ea] mr-3 mt-0.5">✓</div>
                      <span className="text-sm text-gray-300">Match content approach to persona preferences</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={() => navigate('/personas')}
                    className="bg-[#74d1ea] hover:bg-[#5db8d0] text-black px-4 py-2 rounded-md shadow-[0_0_15px_rgba(116,209,234,0.15)]"
                  >
                    Create Personas
                  </Button>
                </CardFooter>
              </Card>

              {/* 3. Content Generation Guide */}
              <Card className="group relative bg-[#0a0c10] border border-gray-800/60 rounded-xl overflow-hidden transition-all duration-300 shadow-[0_0_25px_rgba(116,209,234,0.05)]">
                <div className="absolute inset-0 bg-gradient-to-t from-[#74d1ea]/5 via-transparent to-transparent pointer-events-none opacity-50"></div>
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#0e131f] border border-[#74d1ea]/20 text-[#74d1ea] font-semibold text-sm shadow-[0_0_15px_rgba(116,209,234,0.15)]">
                      3
                    </div>
                    <div className="bg-[#0e131f] border border-[#74d1ea]/20 rounded-lg p-2.5 shadow-[0_0_15px_rgba(116,209,234,0.15)]">
                      <Sparkles className="h-5 w-5 text-[#74d1ea]" />
                    </div>
                  </div>
                  <CardTitle className="text-xl font-bold text-white">Generating AI Content</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-4">
                    Learn how to generate various types of content perfectly tailored to your tone and target audience.
                  </p>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start">
                      <div className="text-[#74d1ea] mr-3 mt-0.5">✓</div>
                      <span className="text-sm text-gray-300">Generate multiple content types (LinkedIn, email, etc.)</span>
                    </li>
                    <li className="flex items-start">
                      <div className="text-[#74d1ea] mr-3 mt-0.5">✓</div>
                      <span className="text-sm text-gray-300">Customize content based on tone analysis results</span>
                    </li>
                    <li className="flex items-start">
                      <div className="text-[#74d1ea] mr-3 mt-0.5">✓</div>
                      <span className="text-sm text-gray-300">Target specific personas with tailored messaging</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={() => navigate('/content-generator')}
                    className="bg-[#74d1ea] hover:bg-[#5db8d0] text-black px-4 py-2 rounded-md shadow-[0_0_15px_rgba(116,209,234,0.15)]"
                  >
                    Generate Content
                  </Button>
                </CardFooter>
              </Card>

              {/* 4. Saved Content Management Guide */}
              <Card className="group relative bg-[#0a0c10] border border-gray-800/60 rounded-xl overflow-hidden transition-all duration-300 shadow-[0_0_25px_rgba(116,209,234,0.05)]">
                <div className="absolute inset-0 bg-gradient-to-t from-[#74d1ea]/5 via-transparent to-transparent pointer-events-none opacity-50"></div>
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#0e131f] border border-[#74d1ea]/20 text-[#74d1ea] font-semibold text-sm shadow-[0_0_15px_rgba(116,209,234,0.15)]">
                      4
                    </div>
                    <div className="bg-[#0e131f] border border-[#74d1ea]/20 rounded-lg p-2.5 shadow-[0_0_15px_rgba(116,209,234,0.15)]">
                      <FileCheck className="h-5 w-5 text-[#74d1ea]" />
                    </div>
                  </div>
                  <CardTitle className="text-xl font-bold text-white">Managing Your Content</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-4">
                    Learn how to organize, edit, and reuse your generated content for maximum efficiency.
                  </p>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start">
                      <div className="text-[#74d1ea] mr-3 mt-0.5">✓</div>
                      <span className="text-sm text-gray-300">Access and edit previously generated content</span>
                    </li>
                    <li className="flex items-start">
                      <div className="text-[#74d1ea] mr-3 mt-0.5">✓</div>
                      <span className="text-sm text-gray-300">Filter content by type and other parameters</span>
                    </li>
                    <li className="flex items-start">
                      <div className="text-[#74d1ea] mr-3 mt-0.5">✓</div>
                      <span className="text-sm text-gray-300">Copy content directly to your clipboard</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={() => navigate('/saved-content')}
                    className="bg-[#74d1ea] hover:bg-[#5db8d0] text-black px-4 py-2 rounded-md shadow-[0_0_15px_rgba(116,209,234,0.15)]"
                  >
                    Manage Content
                  </Button>
                </CardFooter>
              </Card>

              {/* 5. Campaigns Guide */}
              <Card className="group relative bg-[#0a0c10] border border-gray-800/60 rounded-xl overflow-hidden transition-all duration-300 shadow-[0_0_25px_rgba(116,209,234,0.05)]">
                <div className="absolute inset-0 bg-gradient-to-t from-[#74d1ea]/5 via-transparent to-transparent pointer-events-none opacity-50"></div>
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#0e131f] border border-[#74d1ea]/20 text-[#74d1ea] font-semibold text-sm shadow-[0_0_15px_rgba(116,209,234,0.15)]">
                      5
                    </div>
                    <div className="bg-[#0e131f] border border-[#74d1ea]/20 rounded-lg p-2.5 shadow-[0_0_15px_rgba(116,209,234,0.15)]">
                      <Lightbulb className="h-5 w-5 text-[#74d1ea]" />
                    </div>
                  </div>
                  <CardTitle className="text-xl font-bold text-white">Creating Campaigns</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-4">
                    Learn how to organize your content into cohesive campaigns for specific marketing initiatives.
                  </p>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start">
                      <div className="text-[#74d1ea] mr-3 mt-0.5">✓</div>
                      <span className="text-sm text-gray-300">Create targeted campaigns with specific goals</span>
                    </li>
                    <li className="flex items-start">
                      <div className="text-[#74d1ea] mr-3 mt-0.5">✓</div>
                      <span className="text-sm text-gray-300">Assign personas and tone analyses to campaigns</span>
                    </li>
                    <li className="flex items-start">
                      <div className="text-[#74d1ea] mr-3 mt-0.5">✓</div>
                      <span className="text-sm text-gray-300">Track campaign performance metrics</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={() => navigate('/campaigns')}
                    className="bg-[#74d1ea] hover:bg-[#5db8d0] text-black px-4 py-2 rounded-md shadow-[0_0_15px_rgba(116,209,234,0.15)]"
                  >
                    Manage Campaigns
                  </Button>
                </CardFooter>
              </Card>
              
              {/* 6. Account and Subscription Guide */}
              <Card className="group relative bg-[#0a0c10] border border-gray-800/60 rounded-xl overflow-hidden transition-all duration-300 shadow-[0_0_25px_rgba(116,209,234,0.05)]">
                <div className="absolute inset-0 bg-gradient-to-t from-[#74d1ea]/5 via-transparent to-transparent pointer-events-none opacity-50"></div>
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#0e131f] border border-[#74d1ea]/20 text-[#74d1ea] font-semibold text-sm shadow-[0_0_15px_rgba(116,209,234,0.15)]">
                      6
                    </div>
                    <div className="bg-[#0e131f] border border-[#74d1ea]/20 rounded-lg p-2.5 shadow-[0_0_15px_rgba(116,209,234,0.15)]">
                      <ExternalLink className="h-5 w-5 text-[#74d1ea]" />
                    </div>
                  </div>
                  <CardTitle className="text-xl font-bold text-white">Managing Your Account</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-4">
                    Learn how to manage your account settings, track usage, and upgrade your subscription.
                  </p>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start">
                      <div className="text-[#74d1ea] mr-3 mt-0.5">✓</div>
                      <span className="text-sm text-gray-300">Update your profile and account preferences</span>
                    </li>
                    <li className="flex items-start">
                      <div className="text-[#74d1ea] mr-3 mt-0.5">✓</div>
                      <span className="text-sm text-gray-300">Monitor your feature usage limits</span>
                    </li>
                    <li className="flex items-start">
                      <div className="text-[#74d1ea] mr-3 mt-0.5">✓</div>
                      <span className="text-sm text-gray-300">Compare subscription plans and upgrade</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={() => navigate('/account')}
                    className="bg-[#74d1ea] hover:bg-[#5db8d0] text-black px-4 py-2 rounded-md shadow-[0_0_15px_rgba(116,209,234,0.15)]"
                  >
                    Account Settings
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}