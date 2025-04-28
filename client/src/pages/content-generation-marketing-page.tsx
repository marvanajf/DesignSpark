import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import { ArrowRight, FileText, Users, PenTool, Zap } from "lucide-react";
import { useEffect } from "react";
import { useAuthModal } from "@/hooks/use-auth-modal";

export default function ContentGenerationMarketingPage() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const { openAuthModal } = useAuthModal();

  const handleGetStarted = () => {
    if (user) {
      navigate("/content-generator");
    } else {
      openAuthModal();
    }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <div className="relative py-20 bg-black overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-left max-w-3xl">
            <div className="inline-flex items-center mb-4 text-[#74d1ea]">
              <span className="flex h-2 w-2 bg-[#74d1ea] rounded-full mr-2"></span>
              <span className="text-sm font-medium">Tovably Content Generation</span>
            </div>
            <h1 className="text-4xl tracking-tight font-semibold sm:text-5xl md:text-6xl text-white mb-6">
              Generate <span className="text-[#74d1ea]">tailored content</span> that resonates with your audience
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mb-8">
              Create compelling LinkedIn posts and cold emails that maintain your brand voice
              while perfectly targeting your specific audience personas.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button 
                onClick={handleGetStarted}
                className="px-8 py-3 bg-[#74d1ea] hover:bg-[#5db8d0] text-black shadow-[0_0_10px_rgba(116,209,234,0.4)]"
              >
                Get started
              </Button>
              <Button 
                variant="outline"
                className="px-8 py-3 text-white border-gray-700 hover:bg-gray-900"
              >
                Contact us
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-black py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="border-t border-[#74d1ea]/30 pt-6">
              <div className="h-10 w-10 bg-[#74d1ea]/10 rounded-full flex items-center justify-center mb-4">
                <FileText className="h-5 w-5 text-[#74d1ea]" />
              </div>
              <h3 className="text-xl font-medium text-white mb-3">Maintain Brand Voice</h3>
              <p className="text-gray-400">
                Generate content that consistently reflects your brand's unique tone and style.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="border-t border-[#74d1ea]/30 pt-6">
              <div className="h-10 w-10 bg-[#74d1ea]/10 rounded-full flex items-center justify-center mb-4">
                <Users className="h-5 w-5 text-[#74d1ea]" />
              </div>
              <h3 className="text-xl font-medium text-white mb-3">Target Key Personas</h3>
              <p className="text-gray-400">
                Create content specifically designed to resonate with your target audience personas.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="border-t border-[#74d1ea]/30 pt-6">
              <div className="h-10 w-10 bg-[#74d1ea]/10 rounded-full flex items-center justify-center mb-4">
                <PenTool className="h-5 w-5 text-[#74d1ea]" />
              </div>
              <h3 className="text-xl font-medium text-white mb-3">Multiple Content Types</h3>
              <p className="text-gray-400">
                Generate LinkedIn posts and cold emails with content perfectly adapted to each platform.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="border-t border-[#74d1ea]/30 pt-6">
              <div className="h-10 w-10 bg-[#74d1ea]/10 rounded-full flex items-center justify-center mb-4">
                <Zap className="h-5 w-5 text-[#74d1ea]" />
              </div>
              <h3 className="text-xl font-medium text-white mb-3">Save Time & Effort</h3>
              <p className="text-gray-400">
                Create high-quality content in minutes instead of hours while maintaining consistency.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-black py-16 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-semibold text-white mb-4">How Content Generation Works</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Our AI-powered platform creates content that's aligned with your tone and targets specific personas
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-900/30 backdrop-blur-sm rounded-lg p-6 border border-gray-700/60 shadow-[0_0_15px_rgba(116,209,234,0.15)]">
              <div className="bg-[#74d1ea]/20 rounded-full h-14 w-14 flex items-center justify-center mb-6 border border-[#74d1ea]/30">
                <span className="text-[#74d1ea] font-medium text-lg">1</span>
              </div>
              <h3 className="text-xl font-medium text-white mb-3">Select Your Tone</h3>
              <p className="text-gray-400">
                Choose from your analyzed tone profiles or start with a new tone analysis to determine your brand's voice.
              </p>
            </div>
            
            <div className="bg-gray-900/30 backdrop-blur-sm rounded-lg p-6 border border-gray-700/60 shadow-[0_0_15px_rgba(116,209,234,0.15)]">
              <div className="bg-[#74d1ea]/20 rounded-full h-14 w-14 flex items-center justify-center mb-6 border border-[#74d1ea]/30">
                <span className="text-[#74d1ea] font-medium text-lg">2</span>
              </div>
              <h3 className="text-xl font-medium text-white mb-3">Choose Your Persona</h3>
              <p className="text-gray-400">
                Pick from predefined personas or create custom ones to represent your target audience segments.
              </p>
            </div>
            
            <div className="bg-gray-900/30 backdrop-blur-sm rounded-lg p-6 border border-gray-700/60 shadow-[0_0_15px_rgba(116,209,234,0.15)]">
              <div className="bg-[#74d1ea]/20 rounded-full h-14 w-14 flex items-center justify-center mb-6 border border-[#74d1ea]/30">
                <span className="text-[#74d1ea] font-medium text-lg">3</span>
              </div>
              <h3 className="text-xl font-medium text-white mb-3">Generate & Refine</h3>
              <p className="text-gray-400">
                Create tailored content for LinkedIn or email, then edit and save your creations for future reference.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Examples Section */}
      <div className="bg-black py-16 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-semibold text-white mb-4">Content Examples</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              See how our AI creates unique content tailored to different audiences while maintaining your brand voice
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="border border-gray-700/60 rounded-lg overflow-hidden shadow-[0_0_15px_rgba(116,209,234,0.15)]">
              <div className="px-6 py-4 bg-gray-900/30 border-b border-gray-700/60">
                <h3 className="text-lg font-medium text-white">LinkedIn Post</h3>
                <p className="text-sm text-gray-400">Technical audience, professional tone</p>
              </div>
              <div className="p-6 text-gray-300">
                <p className="mb-4">
                  Excited to announce our new API integration capabilities! 🚀 We've enhanced our platform to seamlessly connect with your existing tech stack, reducing implementation time by 65%.
                </p>
                <p>
                  Have you been struggling with integration bottlenecks? Let me know in the comments how this could help your development workflow.
                </p>
              </div>
            </div>
            
            <div className="border border-gray-700/60 rounded-lg overflow-hidden shadow-[0_0_15px_rgba(116,209,234,0.15)]">
              <div className="px-6 py-4 bg-gray-900/30 border-b border-gray-700/60">
                <h3 className="text-lg font-medium text-white">Cold Email</h3>
                <p className="text-sm text-gray-400">Decision-maker persona, conversational tone</p>
              </div>
              <div className="p-6 text-gray-300">
                <p className="mb-4">
                  Hi [First Name],
                </p>
                <p className="mb-4">
                  I noticed that [Company] has been expanding its digital marketing efforts, and I thought you might be interested in how we recently helped a similar company in your industry increase their conversion rates by 34%.
                </p>
                <p className="mb-4">
                  Would you be open to a quick 15-minute call next Tuesday to discuss how we could achieve similar results for your team?
                </p>
                <p>
                  Best regards,<br />
                  [Your Name]
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-black py-16 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-semibold text-white mb-4">Why Choose Tovably</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Our content generation provides unique advantages over typical AI writers
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="border border-gray-700/60 rounded-lg p-8 shadow-[0_0_15px_rgba(116,209,234,0.15)]">
              <h3 className="text-xl font-medium text-white mb-4">Beyond Generic AI Writers</h3>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-start">
                  <ArrowRight className="h-5 w-5 text-[#74d1ea] mr-3 mt-0.5 flex-shrink-0" />
                  <span>Maintains your unique brand voice instead of generic AI content</span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-5 w-5 text-[#74d1ea] mr-3 mt-0.5 flex-shrink-0" />
                  <span>Targets specific professional personas with tailored messaging</span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-5 w-5 text-[#74d1ea] mr-3 mt-0.5 flex-shrink-0" />
                  <span>Integrates tone analysis insights to maintain consistency</span>
                </li>
              </ul>
            </div>
            
            <div className="border border-gray-700/60 rounded-lg p-8 shadow-[0_0_15px_rgba(116,209,234,0.15)]">
              <h3 className="text-xl font-medium text-white mb-4">Proven Results</h3>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-start">
                  <ArrowRight className="h-5 w-5 text-[#74d1ea] mr-3 mt-0.5 flex-shrink-0" />
                  <span>Average 37% increase in engagement on LinkedIn posts</span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-5 w-5 text-[#74d1ea] mr-3 mt-0.5 flex-shrink-0" />
                  <span>29% higher response rates on cold emails</span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-5 w-5 text-[#74d1ea] mr-3 mt-0.5 flex-shrink-0" />
                  <span>Save an average of 5 hours per week on content creation</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-black py-16 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="border border-gray-700/60 rounded-lg py-12 px-6 shadow-[0_0_30px_rgba(116,209,234,0.20)]">
            <h2 className="text-3xl font-semibold text-white mb-6">
              Ready to transform your content strategy?
            </h2>
            <p className="text-xl text-gray-400 mb-8 max-w-3xl mx-auto">
              Start generating perfectly tailored LinkedIn posts and cold emails today.
            </p>
            <Button 
              onClick={handleGetStarted}
              className="px-8 py-3 md:py-4 md:text-lg md:px-10 bg-[#74d1ea] hover:bg-[#5db8d0] text-black shadow-[0_0_10px_rgba(116,209,234,0.4)]"
            >
              Generate content now
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}