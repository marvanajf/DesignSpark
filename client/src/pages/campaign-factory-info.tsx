import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Factory, Settings, Sparkles, CheckCircle, FileText, RadioTower, FileUp } from "lucide-react";
import { useAuthModal } from "@/hooks/use-auth-modal";
import Navbar from "@/components/Navbar";

export default function CampaignFactoryInfoPage() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const { openAuthModal } = useAuthModal();

  const handleGetStarted = () => {
    if (user) {
      navigate("/campaign-factory");
    } else {
      openAuthModal();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Navbar showDashboardLinks={false} />
      <main className="flex-1 overflow-y-auto bg-black">
        {/* Hero Section */}
        <div className="py-12 bg-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-start md:items-center md:text-center">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#74d1ea]/10 border border-[#74d1ea]/20 text-[#74d1ea] text-sm mb-6">
                <Factory className="h-4 w-4" />
                <span>Tovably Content Factory</span>
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold text-white">
                Streamline your <span className="text-[#74d1ea]">content creation</span> process
              </h1>
              <p className="mt-6 text-lg text-gray-400 max-w-3xl">
                Automate and scale your content production with our AI-powered content factory, delivering high-quality, personalized content for all your marketing channels.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Button
                  onClick={handleGetStarted}
                  className="px-8 py-6 bg-[#74d1ea] hover:bg-[#5db8d0] text-black shadow-[0_0_10px_rgba(116,209,234,0.4)]"
                >
                  Start creating content
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
                <h2 className="text-3xl font-semibold text-white">Content Factory Features</h2>
                <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
                  Our content factory provides powerful tools to automate and enhance your content creation workflow.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-gray-900/30 rounded-lg p-6 border border-gray-700/60">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-md bg-[#74d1ea]/20 mb-4 border border-[#74d1ea]/30">
                    <Settings className="h-6 w-6 text-[#74d1ea]" />
                  </div>
                  <h3 className="text-xl font-medium text-white mb-2">Automated Production</h3>
                  <p className="text-gray-400">
                    Create content templates and workflows that automatically generate personalized content at scale.
                  </p>
                </div>

                <div className="bg-gray-900/30 rounded-lg p-6 border border-gray-700/60">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-md bg-[#74d1ea]/20 mb-4 border border-[#74d1ea]/30">
                    <Sparkles className="h-6 w-6 text-[#74d1ea]" />
                  </div>
                  <h3 className="text-xl font-medium text-white mb-2">AI-Powered Insights</h3>
                  <p className="text-gray-400">
                    Leverage AI to analyze content performance and get recommendations for optimization.
                  </p>
                </div>

                <div className="bg-gray-900/30 rounded-lg p-6 border border-gray-700/60">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-md bg-[#74d1ea]/20 mb-4 border border-[#74d1ea]/30">
                    <FileText className="h-6 w-6 text-[#74d1ea]" />
                  </div>
                  <h3 className="text-xl font-medium text-white mb-2">Diverse Content Types</h3>
                  <p className="text-gray-400">
                    Generate various content formats from blog posts to social media updates with a single workflow.
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
                <h2 className="text-3xl font-semibold text-white">How The Content Factory Works</h2>
                <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
                  Our content factory turns your ideas into a streamlined production process.
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
                        <h3 className="text-xl font-medium text-white mb-2">Define Content Parameters</h3>
                        <p className="text-gray-400">
                          Set your target audience, content goals, tone, and format requirements to guide the content creation process.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#74d1ea]/20 mr-4 text-[#74d1ea] font-semibold border border-[#74d1ea]/30">
                        2
                      </div>
                      <div>
                        <h3 className="text-xl font-medium text-white mb-2">Create Content Templates</h3>
                        <p className="text-gray-400">
                          Develop reusable templates with predefined sections and AI prompts that ensure consistent quality and style.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#74d1ea]/20 mr-4 text-[#74d1ea] font-semibold border border-[#74d1ea]/30">
                        3
                      </div>
                      <div>
                        <h3 className="text-xl font-medium text-white mb-2">Generate Content in Bulk</h3>
                        <p className="text-gray-400">
                          Use AI to rapidly generate multiple content pieces that adhere to your templates and parameters.
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
                        <h3 className="text-xl font-medium text-white mb-2">Review and Refine</h3>
                        <p className="text-gray-400">
                          Easily edit and enhance the generated content with our intuitive tools and collaborative features.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#74d1ea]/20 mr-4 text-[#74d1ea] font-semibold border border-[#74d1ea]/30">
                        5
                      </div>
                      <div>
                        <h3 className="text-xl font-medium text-white mb-2">Schedule Distribution</h3>
                        <p className="text-gray-400">
                          Plan content publication across multiple channels with our integrated scheduling system.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#74d1ea]/20 mr-4 text-[#74d1ea] font-semibold border border-[#74d1ea]/30">
                        6
                      </div>
                      <div>
                        <h3 className="text-xl font-medium text-white mb-2">Analyze Performance</h3>
                        <p className="text-gray-400">
                          Track engagement metrics to understand content effectiveness and continuously improve your strategy.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Types Section */}
        <div className="py-12 bg-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="border border-gray-700/60 rounded-lg p-8 shadow-[0_0_25px_rgba(116,209,234,0.15)]">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-semibold text-white">Content Types</h2>
                <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
                  The Content Factory supports various content formats to match your marketing needs.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gray-900/30 rounded-lg p-6 border border-gray-700/60">
                  <div className="flex items-center mb-4">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-md bg-[#74d1ea]/20 mr-4 border border-[#74d1ea]/30">
                      <FileUp className="h-6 w-6 text-[#74d1ea]" />
                    </div>
                    <h3 className="text-xl font-medium text-white">Blog & Article Content</h3>
                  </div>
                  <ul className="space-y-3 mb-4">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-[#74d1ea] mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">Long-form thought leadership articles</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-[#74d1ea] mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">SEO-optimized blog posts</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-[#74d1ea] mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">Industry news analysis and commentary</span>
                    </li>
                  </ul>
                  <p className="text-gray-400 text-sm italic">Perfect for: Building brand authority and driving organic traffic</p>
                </div>

                <div className="bg-gray-900/30 rounded-lg p-6 border border-gray-700/60">
                  <div className="flex items-center mb-4">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-md bg-[#74d1ea]/20 mr-4 border border-[#74d1ea]/30">
                      <RadioTower className="h-6 w-6 text-[#74d1ea]" />
                    </div>
                    <h3 className="text-xl font-medium text-white">Social Media Content</h3>
                  </div>
                  <ul className="space-y-3 mb-4">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-[#74d1ea] mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">Engaging post series for multiple platforms</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-[#74d1ea] mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">LinkedIn thought leadership content</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-[#74d1ea] mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">Platform-specific content optimized for each audience</span>
                    </li>
                  </ul>
                  <p className="text-gray-400 text-sm italic">Perfect for: Building social presence and community engagement</p>
                </div>

                <div className="bg-gray-900/30 rounded-lg p-6 border border-gray-700/60">
                  <div className="flex items-center mb-4">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-md bg-[#74d1ea]/20 mr-4 border border-[#74d1ea]/30">
                      <FileText className="h-6 w-6 text-[#74d1ea]" />
                    </div>
                    <h3 className="text-xl font-medium text-white">Email Marketing</h3>
                  </div>
                  <ul className="space-y-3 mb-4">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-[#74d1ea] mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">Personalized nurture sequences</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-[#74d1ea] mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">Newsletter content tailored to segments</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-[#74d1ea] mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">Promotional campaigns with conversion focus</span>
                    </li>
                  </ul>
                  <p className="text-gray-400 text-sm italic">Perfect for: Nurturing leads and driving conversions</p>
                </div>

                <div className="bg-gray-900/30 rounded-lg p-6 border border-gray-700/60">
                  <div className="flex items-center mb-4">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-md bg-[#74d1ea]/20 mr-4 border border-[#74d1ea]/30">
                      <Settings className="h-6 w-6 text-[#74d1ea]" />
                    </div>
                    <h3 className="text-xl font-medium text-white">Technical Content</h3>
                  </div>
                  <ul className="space-y-3 mb-4">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-[#74d1ea] mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">Product documentation and guides</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-[#74d1ea] mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">Technical white papers and case studies</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-[#74d1ea] mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">Industry-specific technical explainers</span>
                    </li>
                  </ul>
                  <p className="text-gray-400 text-sm italic">Perfect for: Educating prospects and supporting customers</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="py-12 bg-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="border border-gray-700/60 rounded-lg p-8 shadow-[0_0_25px_rgba(116,209,234,0.15)]">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-semibold text-white">Content Factory Benefits</h2>
                <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
                  Transform your content creation with scalable, efficient AI-powered solutions
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="border border-gray-700/60 rounded-lg p-8 shadow-[0_0_15px_rgba(116,209,234,0.15)]">
                  <h3 className="text-xl font-medium text-white mb-4">Time and Resource Savings</h3>
                  <ul className="space-y-3 text-gray-400">
                    <li className="flex items-start">
                      <ArrowRight className="h-5 w-5 text-[#74d1ea] mr-3 mt-0.5 flex-shrink-0" />
                      <span>Reduce content creation time by up to 70%</span>
                    </li>
                    <li className="flex items-start">
                      <ArrowRight className="h-5 w-5 text-[#74d1ea] mr-3 mt-0.5 flex-shrink-0" />
                      <span>Scale content production without hiring more staff</span>
                    </li>
                    <li className="flex items-start">
                      <ArrowRight className="h-5 w-5 text-[#74d1ea] mr-3 mt-0.5 flex-shrink-0" />
                      <span>Focus your team on strategy rather than execution</span>
                    </li>
                  </ul>
                </div>
                
                <div className="border border-gray-700/60 rounded-lg p-8 shadow-[0_0_15px_rgba(116,209,234,0.15)]">
                  <h3 className="text-xl font-medium text-white mb-4">Quality and Consistency</h3>
                  <ul className="space-y-3 text-gray-400">
                    <li className="flex items-start">
                      <ArrowRight className="h-5 w-5 text-[#74d1ea] mr-3 mt-0.5 flex-shrink-0" />
                      <span>Maintain brand voice across all content pieces</span>
                    </li>
                    <li className="flex items-start">
                      <ArrowRight className="h-5 w-5 text-[#74d1ea] mr-3 mt-0.5 flex-shrink-0" />
                      <span>Ensure SEO best practices are followed automatically</span>
                    </li>
                    <li className="flex items-start">
                      <ArrowRight className="h-5 w-5 text-[#74d1ea] mr-3 mt-0.5 flex-shrink-0" />
                      <span>Deliver personalized content at scale</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-16 bg-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-[#090c15] to-[#111827] rounded-xl p-8 md:p-12 shadow-[0_0_30px_rgba(116,209,234,0.2)] border border-gray-700/60">
              <div className="md:flex md:items-center md:justify-between">
                <div className="md:max-w-2xl">
                  <h2 className="text-3xl font-semibold text-white mb-4">Ready to transform your content strategy?</h2>
                  <p className="text-lg text-gray-400">
                    Get started with Tovably's Content Factory today and see how automation can revolutionize your content creation process.
                  </p>
                </div>
                <div className="mt-8 md:mt-0 md:ml-8">
                  <Button onClick={handleGetStarted} className="w-full md:w-auto px-8 py-3 bg-[#74d1ea] hover:bg-[#5db8d0] text-black shadow-[0_0_10px_rgba(116,209,234,0.4)]">
                    Start now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}