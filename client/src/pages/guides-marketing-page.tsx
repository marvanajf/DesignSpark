import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import { ArrowRight, BookOpen, Lightbulb, GraduationCap, Sparkles } from "lucide-react";
import { useAuthModal } from "@/hooks/use-auth-modal";

export default function GuidesMarketingPage() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const { openAuthModal } = useAuthModal();

  const handleGetStarted = () => {
    if (user) {
      navigate("/guides");
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
              <span className="text-sm font-medium">Tovably Expert Guides</span>
            </div>
            <h1 className="text-4xl tracking-tight font-semibold sm:text-5xl md:text-6xl text-white mb-6">
              Master <span className="text-[#74d1ea]">AI-powered</span> communication for your business
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mb-8">
              Comprehensive resources to help you leverage advanced AI technologies 
              for more effective content creation, audience targeting, and professional communication.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button 
                onClick={handleGetStarted}
                className="px-8 py-3 bg-[#74d1ea] hover:bg-[#5db8d0] text-black shadow-[0_0_10px_rgba(116,209,234,0.4)]"
              >
                Explore guides
              </Button>
              <Button 
                variant="outline"
                className="px-8 py-3 text-white border-gray-700 hover:bg-gray-900"
              >
                Join our community
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
                <BookOpen className="h-5 w-5 text-[#74d1ea]" />
              </div>
              <h3 className="text-xl font-medium text-white mb-3">Interactive Tutorials</h3>
              <p className="text-gray-400">
                Step-by-step guides to help you master AI communication tools for your business needs.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="border-t border-[#74d1ea]/30 pt-6">
              <div className="h-10 w-10 bg-[#74d1ea]/10 rounded-full flex items-center justify-center mb-4">
                <Lightbulb className="h-5 w-5 text-[#74d1ea]" />
              </div>
              <h3 className="text-xl font-medium text-white mb-3">Expert Strategies</h3>
              <p className="text-gray-400">
                Industry-proven approaches to enhance your brand's messaging and audience connection.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="border-t border-[#74d1ea]/30 pt-6">
              <div className="h-10 w-10 bg-[#74d1ea]/10 rounded-full flex items-center justify-center mb-4">
                <GraduationCap className="h-5 w-5 text-[#74d1ea]" />
              </div>
              <h3 className="text-xl font-medium text-white mb-3">Continuous Learning</h3>
              <p className="text-gray-400">
                Stay ahead with regularly updated guides reflecting the latest in AI communication.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="border-t border-[#74d1ea]/30 pt-6">
              <div className="h-10 w-10 bg-[#74d1ea]/10 rounded-full flex items-center justify-center mb-4">
                <Sparkles className="h-5 w-5 text-[#74d1ea]" />
              </div>
              <h3 className="text-xl font-medium text-white mb-3">Practical Examples</h3>
              <p className="text-gray-400">
                Real-world applications and case studies demonstrating successful implementation.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Guide Categories Section */}
      <div className="bg-black py-16 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-semibold text-white mb-4">Comprehensive Guide Library</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              From fundamental concepts to advanced techniques
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-900/30 backdrop-blur-sm rounded-lg p-6 border border-gray-700/60 shadow-[0_0_15px_rgba(116,209,234,0.15)]">
              <div className="h-14 w-14 bg-[#74d1ea]/10 rounded-full flex items-center justify-center mb-6 border border-[#74d1ea]/30">
                <BookOpen className="h-6 w-6 text-[#74d1ea]" />
              </div>
              <h3 className="text-xl font-medium text-white mb-3">Getting Started</h3>
              <p className="text-gray-400 mb-4">
                Essential guides for newcomers to AI-powered communication tools and methodologies.
              </p>
              <ul className="space-y-2">
                <li className="text-sm text-[#74d1ea]">• Introduction to AI Writing</li>
                <li className="text-sm text-[#74d1ea]">• Understanding Tone Analysis</li>
                <li className="text-sm text-[#74d1ea]">• Persona Creation Basics</li>
              </ul>
            </div>
            
            <div className="bg-gray-900/30 backdrop-blur-sm rounded-lg p-6 border border-gray-700/60 shadow-[0_0_15px_rgba(116,209,234,0.15)]">
              <div className="h-14 w-14 bg-[#74d1ea]/10 rounded-full flex items-center justify-center mb-6 border border-[#74d1ea]/30">
                <Lightbulb className="h-6 w-6 text-[#74d1ea]" />
              </div>
              <h3 className="text-xl font-medium text-white mb-3">Strategic Applications</h3>
              <p className="text-gray-400 mb-4">
                Learn how to integrate AI tools into your broader marketing and communication strategy.
              </p>
              <ul className="space-y-2">
                <li className="text-sm text-[#74d1ea]">• Content Calendar Planning</li>
                <li className="text-sm text-[#74d1ea]">• Multi-Channel Consistency</li>
                <li className="text-sm text-[#74d1ea]">• Brand Voice Development</li>
              </ul>
            </div>
            
            <div className="bg-gray-900/30 backdrop-blur-sm rounded-lg p-6 border border-gray-700/60 shadow-[0_0_15px_rgba(116,209,234,0.15)]">
              <div className="h-14 w-14 bg-[#74d1ea]/10 rounded-full flex items-center justify-center mb-6 border border-[#74d1ea]/30">
                <GraduationCap className="h-6 w-6 text-[#74d1ea]" />
              </div>
              <h3 className="text-xl font-medium text-white mb-3">Advanced Techniques</h3>
              <p className="text-gray-400 mb-4">
                Master sophisticated approaches for experienced practitioners looking to elevate their skills.
              </p>
              <ul className="space-y-2">
                <li className="text-sm text-[#74d1ea]">• Psychological Triggers in Copy</li>
                <li className="text-sm text-[#74d1ea]">• Data-Driven Content Optimization</li>
                <li className="text-sm text-[#74d1ea]">• Cross-Cultural Communication</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Use Cases Section */}
      <div className="bg-black py-16 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-semibold text-white mb-4">Who Benefits</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Our guides are tailored for professionals across various roles
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="border border-gray-700/60 rounded-lg p-8 shadow-[0_0_15px_rgba(116,209,234,0.15)]">
              <h3 className="text-xl font-medium text-white mb-4">Marketing Professionals</h3>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-start">
                  <ArrowRight className="h-5 w-5 text-[#74d1ea] mr-3 mt-0.5 flex-shrink-0" />
                  <span>Learn to create persona-targeted content that resonates with specific audience segments</span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-5 w-5 text-[#74d1ea] mr-3 mt-0.5 flex-shrink-0" />
                  <span>Develop a consistent brand voice across all marketing channels</span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-5 w-5 text-[#74d1ea] mr-3 mt-0.5 flex-shrink-0" />
                  <span>Master the art of AI-assisted content creation while maintaining authenticity</span>
                </li>
              </ul>
            </div>
            
            <div className="border border-gray-700/60 rounded-lg p-8 shadow-[0_0_15px_rgba(116,209,234,0.15)]">
              <h3 className="text-xl font-medium text-white mb-4">Business Leaders</h3>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-start">
                  <ArrowRight className="h-5 w-5 text-[#74d1ea] mr-3 mt-0.5 flex-shrink-0" />
                  <span>Understand how to implement AI tools to improve team productivity and output quality</span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-5 w-5 text-[#74d1ea] mr-3 mt-0.5 flex-shrink-0" />
                  <span>Learn strategic approaches to measure the impact of improved communication</span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-5 w-5 text-[#74d1ea] mr-3 mt-0.5 flex-shrink-0" />
                  <span>Discover how to cultivate a culture of effective communication within your organization</span>
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
              Ready to enhance your communication skills?
            </h2>
            <p className="text-xl text-gray-400 mb-8 max-w-3xl mx-auto">
              Explore our comprehensive guides and start transforming how you connect with your audience today.
            </p>
            <Button 
              onClick={handleGetStarted}
              className="px-8 py-3 md:py-4 md:text-lg md:px-10 bg-[#74d1ea] hover:bg-[#5db8d0] text-black shadow-[0_0_10px_rgba(116,209,234,0.4)]"
            >
              Access guides now
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black border-t border-gray-700/60">
        <div className="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
          <nav className="-mx-5 -my-2 flex flex-wrap justify-center" aria-label="Footer">
            <div className="px-5 py-2">
              <a href="#" className="text-base text-gray-400 hover:text-[#74d1ea]">
                About
              </a>
            </div>
            <div className="px-5 py-2">
              <a href="#" className="text-base text-gray-400 hover:text-[#74d1ea]">
                Features
              </a>
            </div>
            <div className="px-5 py-2">
              <a href="#" className="text-base text-gray-400 hover:text-[#74d1ea]">
                Pricing
              </a>
            </div>
            <div className="px-5 py-2">
              <a href="#" className="text-base text-gray-400 hover:text-[#74d1ea]">
                Blog
              </a>
            </div>
            <div className="px-5 py-2">
              <a href="#" className="text-base text-gray-400 hover:text-[#74d1ea]">
                Contact
              </a>
            </div>
          </nav>
          <div className="mt-8 flex justify-center space-x-6">
            <a href="#" className="text-gray-400 hover:text-[#74d1ea]">
              <span className="sr-only">LinkedIn</span>
              <i className="fab fa-linkedin fa-lg"></i>
            </a>
          </div>
          <p className="mt-8 text-center text-base text-gray-400">
            &copy; {new Date().getFullYear()} Tovably. All rights reserved.
          </p>
        </div>
      </footer>
    </Layout>
  );
}