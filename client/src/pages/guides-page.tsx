import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import {
  Loader2,
  Book,
  Sparkles,
  Bot,
  Lightbulb,
  MessageSquare,
  FileText,
  ExternalLink,
  FileCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import Layout from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function GuidesPage() {
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
                  <span>Guides</span>
                </div>
                <h1 className="text-2xl font-semibold text-white mt-1">AI Communication Guides</h1>
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
                  <h2 className="text-lg font-semibold text-white">AI-Powered Communication Mastery</h2>
                </div>
                <p className="text-gray-300 mb-4">
                  Welcome to our comprehensive guide on leveraging AI for professional communication. These resources will help you understand how Tovably can transform your content creation process, as well as provide broader insights into AI communication strategies.
                </p>
                <p className="text-gray-400">
                  Whether you're new to AI writing tools or looking to advance your skills, these guides offer practical advice for creating more effective, targeted content.
                </p>
              </div>
            </div>
          </div>

          {/* Tabbed Guide Section */}
          <Tabs defaultValue="tovably" className="mb-10">
            <TabsList className="grid w-full grid-cols-2 mb-8 bg-[#0e131f] border border-gray-800/60">
              <TabsTrigger value="tovably" className="data-[state=active]:bg-[#74d1ea]/10 data-[state=active]:text-[#74d1ea]">
                Using Tovably
              </TabsTrigger>
              <TabsTrigger value="ai" className="data-[state=active]:bg-[#74d1ea]/10 data-[state=active]:text-[#74d1ea]">
                AI Writing Mastery
              </TabsTrigger>
            </TabsList>
            
            {/* Tovably Usage Guides */}
            <TabsContent value="tovably">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Tone Analysis Guide */}
                <Card className="group relative bg-[#0a0c10] border border-gray-800/60 rounded-xl overflow-hidden transition-all duration-300 shadow-[0_0_25px_rgba(116,209,234,0.05)]">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#74d1ea]/5 via-transparent to-transparent pointer-events-none opacity-50"></div>
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="bg-[#0e131f] border border-[#74d1ea]/20 rounded-lg p-2.5 shadow-[0_0_15px_rgba(116,209,234,0.15)]">
                        <FileText className="h-5 w-5 text-[#74d1ea]" />
                      </div>
                    </div>
                    <CardTitle className="text-xl font-bold text-white">Tone Analysis Masterclass</CardTitle>
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

                {/* Persona Development Guide */}
                <Card className="group relative bg-[#0a0c10] border border-gray-800/60 rounded-xl overflow-hidden transition-all duration-300 shadow-[0_0_25px_rgba(116,209,234,0.05)]">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#74d1ea]/5 via-transparent to-transparent pointer-events-none opacity-50"></div>
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="bg-[#0e131f] border border-[#74d1ea]/20 rounded-lg p-2.5 shadow-[0_0_15px_rgba(116,209,234,0.15)]">
                        <MessageSquare className="h-5 w-5 text-[#74d1ea]" />
                      </div>
                    </div>
                    <CardTitle className="text-xl font-bold text-white">Audience Persona Creation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 mb-4">
                      Discover how to leverage AI to build detailed audience personas that drive more effective content strategies.
                    </p>
                    <ul className="space-y-3 mb-6">
                      <li className="flex items-start">
                        <div className="text-[#74d1ea] mr-3 mt-0.5">✓</div>
                        <span className="text-sm text-gray-300">Define key characteristics of your target audience</span>
                      </li>
                      <li className="flex items-start">
                        <div className="text-[#74d1ea] mr-3 mt-0.5">✓</div>
                        <span className="text-sm text-gray-300">Generate AI personas based on market research</span>
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

                {/* Content Generation Guide */}
                <Card className="group relative bg-[#0a0c10] border border-gray-800/60 rounded-xl overflow-hidden transition-all duration-300 shadow-[0_0_25px_rgba(116,209,234,0.05)]">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#74d1ea]/5 via-transparent to-transparent pointer-events-none opacity-50"></div>
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="bg-[#0e131f] border border-[#74d1ea]/20 rounded-lg p-2.5 shadow-[0_0_15px_rgba(116,209,234,0.15)]">
                        <Sparkles className="h-5 w-5 text-[#74d1ea]" />
                      </div>
                    </div>
                    <CardTitle className="text-xl font-bold text-white">Smart Content Generation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 mb-4">
                      Learn the techniques behind generating high-converting content aligned with your tone and targeted audience personas.
                    </p>
                    <ul className="space-y-3 mb-6">
                      <li className="flex items-start">
                        <div className="text-[#74d1ea] mr-3 mt-0.5">✓</div>
                        <span className="text-sm text-gray-300">Create integrated multi-channel content strategies</span>
                      </li>
                      <li className="flex items-start">
                        <div className="text-[#74d1ea] mr-3 mt-0.5">✓</div>
                        <span className="text-sm text-gray-300">Generate LinkedIn posts optimized for algorithm preferences</span>
                      </li>
                      <li className="flex items-start">
                        <div className="text-[#74d1ea] mr-3 mt-0.5">✓</div>
                        <span className="text-sm text-gray-300">Create outreach emails with higher response rates</span>
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

                {/* Content Management Guide */}
                <Card className="group relative bg-[#0a0c10] border border-gray-800/60 rounded-xl overflow-hidden transition-all duration-300 shadow-[0_0_25px_rgba(116,209,234,0.05)]">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#74d1ea]/5 via-transparent to-transparent pointer-events-none opacity-50"></div>
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="bg-[#0e131f] border border-[#74d1ea]/20 rounded-lg p-2.5 shadow-[0_0_15px_rgba(116,209,234,0.15)]">
                        <FileCheck className="h-5 w-5 text-[#74d1ea]" />
                      </div>
                    </div>
                    <CardTitle className="text-xl font-bold text-white">Content Management & Iteration</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 mb-4">
                      Master the art of organizing, iterating, and reusing your AI-generated content for maximum effectiveness.
                    </p>
                    <ul className="space-y-3 mb-6">
                      <li className="flex items-start">
                        <div className="text-[#74d1ea] mr-3 mt-0.5">✓</div>
                        <span className="text-sm text-gray-300">Organize content by campaign, persona, and channel</span>
                      </li>
                      <li className="flex items-start">
                        <div className="text-[#74d1ea] mr-3 mt-0.5">✓</div>
                        <span className="text-sm text-gray-300">Implement effective content revision workflows</span>
                      </li>
                      <li className="flex items-start">
                        <div className="text-[#74d1ea] mr-3 mt-0.5">✓</div>
                        <span className="text-sm text-gray-300">Track performance and adjust strategies accordingly</span>
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
              </div>
            </TabsContent>
            
            {/* AI Writing Mastery Guides */}
            <TabsContent value="ai">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* AI Fundamentals */}
                <Card className="group relative bg-[#0a0c10] border border-gray-800/60 rounded-xl overflow-hidden transition-all duration-300 shadow-[0_0_25px_rgba(116,209,234,0.05)]">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#74d1ea]/5 via-transparent to-transparent pointer-events-none opacity-50"></div>
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="bg-[#0e131f] border border-[#74d1ea]/20 rounded-lg p-2.5 shadow-[0_0_15px_rgba(116,209,234,0.15)]">
                        <Bot className="h-5 w-5 text-[#74d1ea]" />
                      </div>
                    </div>
                    <CardTitle className="text-xl font-bold text-white">AI Writing Fundamentals</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 mb-4">
                      Understand the principles behind effective AI-assisted writing and how to balance automation with creativity.
                    </p>
                    <ul className="space-y-3 mb-6">
                      <li className="flex items-start">
                        <div className="text-[#74d1ea] mr-3 mt-0.5">✓</div>
                        <span className="text-sm text-gray-300">Core principles of Language Model functionality</span>
                      </li>
                      <li className="flex items-start">
                        <div className="text-[#74d1ea] mr-3 mt-0.5">✓</div>
                        <span className="text-sm text-gray-300">Crafting effective prompts for better AI outputs</span>
                      </li>
                      <li className="flex items-start">
                        <div className="text-[#74d1ea] mr-3 mt-0.5">✓</div>
                        <span className="text-sm text-gray-300">Understanding AI biases and limitations</span>
                      </li>
                    </ul>
                    <p className="text-sm text-gray-400 mt-3">
                      The AI landscape continues to evolve rapidly. Understanding these fundamentals helps you adapt to new technologies.
                    </p>
                  </CardContent>
                </Card>

                {/* Advanced Prompt Techniques */}
                <Card className="group relative bg-[#0a0c10] border border-gray-800/60 rounded-xl overflow-hidden transition-all duration-300 shadow-[0_0_25px_rgba(116,209,234,0.05)]">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#74d1ea]/5 via-transparent to-transparent pointer-events-none opacity-50"></div>
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="bg-[#0e131f] border border-[#74d1ea]/20 rounded-lg p-2.5 shadow-[0_0_15px_rgba(116,209,234,0.15)]">
                        <Lightbulb className="h-5 w-5 text-[#74d1ea]" />
                      </div>
                    </div>
                    <CardTitle className="text-xl font-bold text-white">Advanced Prompt Engineering</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 mb-4">
                      Master the art of prompt engineering to get more precise, creative and effective results from AI language models.
                    </p>
                    <ul className="space-y-3 mb-6">
                      <li className="flex items-start">
                        <div className="text-[#74d1ea] mr-3 mt-0.5">✓</div>
                        <span className="text-sm text-gray-300">Create structured prompts with clear constraints</span>
                      </li>
                      <li className="flex items-start">
                        <div className="text-[#74d1ea] mr-3 mt-0.5">✓</div>
                        <span className="text-sm text-gray-300">Use precision language and technical frameworks</span>
                      </li>
                      <li className="flex items-start">
                        <div className="text-[#74d1ea] mr-3 mt-0.5">✓</div>
                        <span className="text-sm text-gray-300">Implement chain-of-thought and reasoning techniques</span>
                      </li>
                    </ul>
                    <p className="text-sm text-gray-400 mt-3">
                      Even when using automated tools like Tovably, understanding these principles helps with customization.
                    </p>
                  </CardContent>
                </Card>

                {/* AI Ethics */}
                <Card className="group relative bg-[#0a0c10] border border-gray-800/60 rounded-xl overflow-hidden transition-all duration-300 shadow-[0_0_25px_rgba(116,209,234,0.05)]">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#74d1ea]/5 via-transparent to-transparent pointer-events-none opacity-50"></div>
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="bg-[#0e131f] border border-[#74d1ea]/20 rounded-lg p-2.5 shadow-[0_0_15px_rgba(116,209,234,0.15)]">
                        <FileText className="h-5 w-5 text-[#74d1ea]" />
                      </div>
                    </div>
                    <CardTitle className="text-xl font-bold text-white">Ethical AI Usage</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 mb-4">
                      Navigate the ethical considerations of using AI for professional communications and content creation.
                    </p>
                    <ul className="space-y-3 mb-6">
                      <li className="flex items-start">
                        <div className="text-[#74d1ea] mr-3 mt-0.5">✓</div>
                        <span className="text-sm text-gray-300">Transparency best practices in AI-assisted content</span>
                      </li>
                      <li className="flex items-start">
                        <div className="text-[#74d1ea] mr-3 mt-0.5">✓</div>
                        <span className="text-sm text-gray-300">Avoiding potential biases in AI communication</span>
                      </li>
                      <li className="flex items-start">
                        <div className="text-[#74d1ea] mr-3 mt-0.5">✓</div>
                        <span className="text-sm text-gray-300">Balancing automation with human oversight</span>
                      </li>
                    </ul>
                    <p className="text-sm text-gray-400 mt-3">
                      Building trust with your audience requires ethical consideration of how AI is deployed in your communications.
                    </p>
                  </CardContent>
                </Card>

                {/* Industry Resources */}
                <Card className="group relative bg-[#0a0c10] border border-gray-800/60 rounded-xl overflow-hidden transition-all duration-300 shadow-[0_0_25px_rgba(116,209,234,0.05)]">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#74d1ea]/5 via-transparent to-transparent pointer-events-none opacity-50"></div>
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="bg-[#0e131f] border border-[#74d1ea]/20 rounded-lg p-2.5 shadow-[0_0_15px_rgba(116,209,234,0.15)]">
                        <ExternalLink className="h-5 w-5 text-[#74d1ea]" />
                      </div>
                    </div>
                    <CardTitle className="text-xl font-bold text-white">Learning Resources</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 mb-4">
                      Explore additional resources to deepen your understanding of AI communication technologies and strategies.
                    </p>
                    <ul className="space-y-3 mb-6">
                      <li className="flex items-start">
                        <div className="text-[#74d1ea] mr-3 mt-0.5">✓</div>
                        <span className="text-sm text-gray-300">Industry publications on AI writing advancements</span>
                      </li>
                      <li className="flex items-start">
                        <div className="text-[#74d1ea] mr-3 mt-0.5">✓</div>
                        <span className="text-sm text-gray-300">Research papers on communication effectiveness</span>
                      </li>
                      <li className="flex items-start">
                        <div className="text-[#74d1ea] mr-3 mt-0.5">✓</div>
                        <span className="text-sm text-gray-300">Professional communities for AI communicators</span>
                      </li>
                    </ul>
                    <p className="text-sm text-gray-400 mt-3">
                      The field of AI communication is evolving rapidly - staying current with research helps maximize results.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          {/* Additional Resources */}
          <div className="mb-10">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-white">Expert Webinars & Training</h2>
              <p className="text-sm text-gray-400 mt-1">In-depth educational content from communication professionals</p>
            </div>
            
            <div className="group relative bg-[#0a0c10] border border-gray-800/60 rounded-xl overflow-hidden transition-all duration-300 shadow-[0_0_25px_rgba(116,209,234,0.05)]">
              <div className="absolute inset-0 bg-gradient-to-t from-[#74d1ea]/5 via-transparent to-transparent pointer-events-none opacity-50"></div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Webinar Card 1 */}
                  <div className="bg-[#111] border border-gray-800/80 rounded-lg overflow-hidden">
                    <div className="h-40 bg-[#182030] flex items-center justify-center">
                      <div className="bg-[#0e131f] border border-[#74d1ea]/20 h-16 w-16 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(116,209,234,0.15)]">
                        <Bot className="h-8 w-8 text-[#74d1ea]" />
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-md font-semibold text-white mb-2">AI Writing Masterclass</h3>
                      <p className="text-xs text-gray-400 mb-3">Expert techniques for leveraging AI in professional communications</p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-[#74d1ea]">45 minutes</span>
                        <Button variant="link" className="text-xs text-[#74d1ea] hover:text-[#5db8d0] p-0 h-auto">
                          Coming Soon
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Webinar Card 2 */}
                  <div className="bg-[#111] border border-gray-800/80 rounded-lg overflow-hidden">
                    <div className="h-40 bg-[#182030] flex items-center justify-center">
                      <div className="bg-[#0e131f] border border-[#74d1ea]/20 h-16 w-16 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(116,209,234,0.15)]">
                        <MessageSquare className="h-8 w-8 text-[#74d1ea]" />
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-md font-semibold text-white mb-2">Tone & Voice Workshop</h3>
                      <p className="text-xs text-gray-400 mb-3">Building brand consistency through AI-powered tone analysis</p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-[#74d1ea]">60 minutes</span>
                        <Button variant="link" className="text-xs text-[#74d1ea] hover:text-[#5db8d0] p-0 h-auto">
                          Coming Soon
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Webinar Card 3 */}
                  <div className="bg-[#111] border border-gray-800/80 rounded-lg overflow-hidden">
                    <div className="h-40 bg-[#182030] flex items-center justify-center">
                      <div className="bg-[#0e131f] border border-[#74d1ea]/20 h-16 w-16 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(116,209,234,0.15)]">
                        <Lightbulb className="h-8 w-8 text-[#74d1ea]" />
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-md font-semibold text-white mb-2">Advanced Persona Targeting</h3>
                      <p className="text-xs text-gray-400 mb-3">Strategies for persona-based content optimization</p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-[#74d1ea]">50 minutes</span>
                        <Button variant="link" className="text-xs text-[#74d1ea] hover:text-[#5db8d0] p-0 h-auto">
                          Coming Soon
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}