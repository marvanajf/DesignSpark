import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import { ArrowRight, CalendarClock, ClipboardCheck, BarChartHorizontal, CheckCircle, LineChart, Target, UsersRound, HelpCircle } from "lucide-react";
import { useEffect } from "react";
import { useAuthModal } from "@/hooks/use-auth-modal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function CampaignsInfoPage() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const { openAuthModal } = useAuthModal();

  const handleGetStarted = () => {
    if (user) {
      navigate("/campaigns");
    } else {
      openAuthModal();
    }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <div className="py-12 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start md:items-center md:text-center">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#74d1ea]/10 border border-[#74d1ea]/20 text-[#74d1ea] text-sm mb-6">
              <CalendarClock className="h-4 w-4" />
              <span>Tovably Campaigns</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold text-white">
              Organize your marketing
              <br />
              <span className="text-[#74d1ea]">campaigns</span> efficiently
            </h1>
            <p className="mt-6 text-lg text-gray-400 max-w-3xl">
              Create, manage, and execute marketing campaigns that combine your personas and content strategies into cohesive, goal-oriented initiatives that drive measurable results.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Button
                onClick={handleGetStarted}
                className="px-8 py-6 bg-[#74d1ea] hover:bg-[#5db8d0] text-black shadow-[0_0_10px_rgba(116,209,234,0.4)]"
              >
                Start creating campaigns
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                variant="outline" 
                className="px-8 py-6 border-gray-700 text-white hover:bg-gray-900"
              >
                Learn more
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-12 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border border-gray-700/60 rounded-lg p-8 shadow-[0_0_25px_rgba(116,209,234,0.15)]">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-semibold text-white">Campaign Features</h2>
              <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
                Our campaign management system provides everything you need to create, organize, and execute successful marketing campaigns.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-900/30 rounded-lg p-6 border border-gray-700/60">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-md bg-[#74d1ea]/20 mb-4 border border-[#74d1ea]/30">
                  <ClipboardCheck className="h-6 w-6 text-[#74d1ea]" />
                </div>
                <h3 className="text-xl font-medium text-white mb-2">Campaign Organization</h3>
                <p className="text-gray-400">
                  Structure your marketing activities into organized campaigns with clear objectives, timelines, and targets.
                </p>
              </div>

              <div className="bg-gray-900/30 rounded-lg p-6 border border-gray-700/60">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-md bg-[#74d1ea]/20 mb-4 border border-[#74d1ea]/30">
                  <UsersRound className="h-6 w-6 text-[#74d1ea]" />
                </div>
                <h3 className="text-xl font-medium text-white mb-2">Persona Integration</h3>
                <p className="text-gray-400">
                  Assign specific AI personas to each campaign to ensure all content is targeted to the right audience segments.
                </p>
              </div>

              <div className="bg-gray-900/30 rounded-lg p-6 border border-gray-700/60">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-md bg-[#74d1ea]/20 mb-4 border border-[#74d1ea]/30">
                  <LineChart className="h-6 w-6 text-[#74d1ea]" />
                </div>
                <h3 className="text-xl font-medium text-white mb-2">Performance Tracking</h3>
                <p className="text-gray-400">
                  Monitor campaign progress, content creation, and goal completion in a centralized dashboard.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-12 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border border-gray-700/60 rounded-lg p-8 shadow-[0_0_25px_rgba(116,209,234,0.15)]">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-semibold text-white">How Campaigns Work</h2>
              <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
                Our campaign system connects your personas, content, and goals into cohesive marketing initiatives.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              <div>
                <div className="space-y-10">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#74d1ea]/20 mr-4 text-[#74d1ea] font-semibold border border-[#74d1ea]/30">
                      1
                    </div>
                    <div>
                      <h3 className="text-xl font-medium text-white mb-2">Create a Campaign</h3>
                      <p className="text-gray-400">
                        Define your campaign's objectives, timeframe, and target metrics. Give it a clear name and description to align your team.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#74d1ea]/20 mr-4 text-[#74d1ea] font-semibold border border-[#74d1ea]/30">
                      2
                    </div>
                    <div>
                      <h3 className="text-xl font-medium text-white mb-2">Assign Personas</h3>
                      <p className="text-gray-400">
                        Select which AI personas will be targeted in this campaign. Each campaign can include multiple personas to reach different audience segments.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#74d1ea]/20 mr-4 text-[#74d1ea] font-semibold border border-[#74d1ea]/30">
                      3
                    </div>
                    <div>
                      <h3 className="text-xl font-medium text-white mb-2">Create Campaign Content</h3>
                      <p className="text-gray-400">
                        Generate content specifically for your campaign, ensuring all content is properly aligned with campaign goals and personas.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div className="space-y-10">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#74d1ea]/20 mr-4 text-[#74d1ea] font-semibold border border-[#74d1ea]/30">
                      4
                    </div>
                    <div>
                      <h3 className="text-xl font-medium text-white mb-2">Set Distribution Channels</h3>
                      <p className="text-gray-400">
                        Define which platforms and channels will be used to distribute your campaign content, from email to social media.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#74d1ea]/20 mr-4 text-[#74d1ea] font-semibold border border-[#74d1ea]/30">
                      5
                    </div>
                    <div>
                      <h3 className="text-xl font-medium text-white mb-2">Track Campaign Progress</h3>
                      <p className="text-gray-400">
                        Monitor your campaign dashboard to see content creation progress, distribution status, and campaign timeline.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#74d1ea]/20 mr-4 text-[#74d1ea] font-semibold border border-[#74d1ea]/30">
                      6
                    </div>
                    <div>
                      <h3 className="text-xl font-medium text-white mb-2">Analyze Results</h3>
                      <p className="text-gray-400">
                        Review campaign performance metrics to understand what worked and inform your strategy for future campaigns.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Campaign Types Section */}
      <div className="py-12 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border border-gray-700/60 rounded-lg p-8 shadow-[0_0_25px_rgba(116,209,234,0.15)]">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-semibold text-white">Campaign Types</h2>
              <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
                Tovably supports various campaign types to match your specific marketing objectives.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gray-900/30 rounded-lg p-6 border border-gray-700/60">
                <div className="flex items-center mb-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-md bg-[#74d1ea]/20 mr-4 border border-[#74d1ea]/30">
                    <Target className="h-6 w-6 text-[#74d1ea]" />
                  </div>
                  <h3 className="text-xl font-medium text-white">Lead Generation</h3>
                </div>
                <ul className="space-y-3 mb-4">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-[#74d1ea] mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">Cold email outreach sequences</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-[#74d1ea] mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">LinkedIn connection request campaigns</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-[#74d1ea] mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">Content offers with lead capture</span>
                  </li>
                </ul>
                <p className="text-gray-400 text-sm italic">Perfect for: Sales teams looking to fill their pipeline with qualified prospects</p>
              </div>

              <div className="bg-gray-900/30 rounded-lg p-6 border border-gray-700/60">
                <div className="flex items-center mb-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-md bg-[#74d1ea]/20 mr-4 border border-[#74d1ea]/30">
                    <BarChartHorizontal className="h-6 w-6 text-[#74d1ea]" />
                  </div>
                  <h3 className="text-xl font-medium text-white">Thought Leadership</h3>
                </div>
                <ul className="space-y-3 mb-4">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-[#74d1ea] mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">LinkedIn article series</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-[#74d1ea] mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">Industry insights and trend analysis</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-[#74d1ea] mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">Expert opinion content for key decision-makers</span>
                  </li>
                </ul>
                <p className="text-gray-400 text-sm italic">Perfect for: Executives and subject matter experts building industry authority</p>
              </div>

              <div className="bg-gray-900/30 rounded-lg p-6 border border-gray-700/60">
                <div className="flex items-center mb-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-md bg-[#74d1ea]/20 mr-4 border border-[#74d1ea]/30">
                    <HelpCircle className="h-6 w-6 text-[#74d1ea]" />
                  </div>
                  <h3 className="text-xl font-medium text-white">Educational</h3>
                </div>
                <ul className="space-y-3 mb-4">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-[#74d1ea] mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">Webinar and workshop content</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-[#74d1ea] mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">How-to guides and best practices</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-[#74d1ea] mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">Industry training and certification programs</span>
                  </li>
                </ul>
                <p className="text-gray-400 text-sm italic">Perfect for: Businesses establishing expertise while serving audience needs</p>
              </div>

              <div className="bg-gray-900/30 rounded-lg p-6 border border-gray-700/60">
                <div className="flex items-center mb-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-md bg-[#74d1ea]/20 mr-4 border border-[#74d1ea]/30">
                    <CalendarClock className="h-6 w-6 text-[#74d1ea]" />
                  </div>
                  <h3 className="text-xl font-medium text-white">Product Launch</h3>
                </div>
                <ul className="space-y-3 mb-4">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-[#74d1ea] mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">Feature announcement content</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-[#74d1ea] mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">Early access and waitlist campaigns</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-[#74d1ea] mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">Customer success stories and testimonials</span>
                  </li>
                </ul>
                <p className="text-gray-400 text-sm italic">Perfect for: Product teams releasing new offerings to the market</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-12 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border border-gray-700/60 rounded-lg p-8 shadow-[0_0_25px_rgba(116,209,234,0.15)]">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-semibold text-white text-center mb-8">Frequently Asked Questions</h2>
              
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1" className="border-b border-gray-700/50">
                  <AccordionTrigger className="text-white hover:text-[#74d1ea] text-left py-4">
                    How many campaigns can I create on my plan?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-400 pb-4">
                    The number of campaigns you can create depends on your subscription plan. Free users can create 2 campaigns, Standard subscribers get 5 campaigns, Premium subscribers get 20 campaigns, and Professional subscribers get 30 campaigns per month.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-2" className="border-b border-gray-700/50">
                  <AccordionTrigger className="text-white hover:text-[#74d1ea] text-left py-4">
                    Can I add multiple personas to a single campaign?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-400 pb-4">
                    Yes, each campaign can target multiple personas to ensure comprehensive audience coverage. This allows you to create varied content that appeals to different segments while maintaining campaign cohesion.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-3" className="border-b border-gray-700/50">
                  <AccordionTrigger className="text-white hover:text-[#74d1ea] text-left py-4">
                    How does campaign performance tracking work?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-400 pb-4">
                    Our campaign dashboard provides visual metrics on content creation progress, persona coverage, timeline adherence, and content distribution status. Premium and Professional plans include additional performance analytics.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-4" className="border-b border-gray-700/50">
                  <AccordionTrigger className="text-white hover:text-[#74d1ea] text-left py-4">
                    Can I export campaign content for use in other tools?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-400 pb-4">
                    Yes, all campaign content can be exported in various formats for use in your marketing automation tools, CRM, or content management systems. This ensures seamless integration with your existing marketing stack.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-5" className="border-b border-gray-700/50">
                  <AccordionTrigger className="text-white hover:text-[#74d1ea] text-left py-4">
                    Is there a way to collaborate with my team on campaigns?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-400 pb-4">
                    Premium and Professional plans include team collaboration features that allow multiple team members to work on the same campaign with role-based permissions and approval workflows.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-12 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border border-gray-700/60 rounded-lg p-8 shadow-[0_0_25px_rgba(116,209,234,0.15)] text-center">
            <h2 className="text-3xl font-semibold text-white mb-4">Ready to streamline your marketing campaigns?</h2>
            <p className="text-gray-400 max-w-2xl mx-auto mb-8">
              Start creating organized, persona-driven campaigns that deliver consistent results and maximize your marketing efficiency.
            </p>
            <Button
              onClick={handleGetStarted}
              className="px-8 py-6 bg-[#74d1ea] hover:bg-[#5db8d0] text-black shadow-[0_0_10px_rgba(116,209,234,0.4)]"
            >
              Create your first campaign
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}