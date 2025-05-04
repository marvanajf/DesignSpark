import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useAuthModal } from "@/hooks/use-auth-modal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { subscriptionPlans } from "@shared/schema";
import tovablyLogo from "../assets/tovably-logo.png";
import { 
  ArrowRight, 
  Zap, 
  Users2, 
  BarChart2, 
  MessageSquareText, 
  Rocket, 
  Check, 
  Star, 
  BrainCircuit, 
  Clock, 
  Lightbulb, 
  Target,
  CalendarClock,
  X
} from "lucide-react";

export default function LandingPage() {
  const [, navigate] = useLocation();
  const { user, isLoading } = useAuth();
  const { openAuthModal } = useAuthModal();
  const [activeTab, setActiveTab] = useState<string>("personas");

  const features = [
    {
      id: "personas",
      title: "AI Persona Generation",
      description: "Create detailed buyer personas in seconds that inform all your marketing decisions",
      icon: <Users2 className="h-6 w-6 text-[#74d1ea]" />,
      benefits: [
        "Generate complete persona profiles with one click",
        "Build detailed customer segments based on real data",
        "Identify hidden insights about your target audience",
        "Personalize every campaign to specific audience needs"
      ],
      image: "/persona-generator.webp"
    },
    {
      id: "tone",
      title: "Tone Analysis",
      description: "Analyze and perfect your brand voice across all content to maintain consistency",
      icon: <MessageSquareText className="h-6 w-6 text-[#74d1ea]" />,
      benefits: [
        "Ensure brand voice consistency across channels",
        "Analyze competitor content for tone insights",
        "Adapt tone to different audience segments",
        "Fine-tune emotional impact of your messaging"
      ],
      image: "/tone-analysis.webp"
    },
    {
      id: "campaigns",
      title: "Campaign Factory",
      description: "Build complete marketing campaigns in minutes instead of days or weeks",
      icon: <CalendarClock className="h-6 w-6 text-[#74d1ea]" />,
      benefits: [
        "Create multi-channel campaigns with 70% less effort",
        "Generate coordinated content across platforms",
        "Save 35+ hours monthly on campaign planning",
        "Scale your marketing output without increasing headcount"
      ],
      image: "/campaign-factory.webp"
    },
    {
      id: "content",
      title: "AI Content Generation",
      description: "Create high-converting, SEO-optimized content for any channel",
      icon: <BrainCircuit className="h-6 w-6 text-[#74d1ea]" />,
      benefits: [
        "Generate SEO-optimized blog posts and articles",
        "Create engaging social media content in seconds",
        "Build email sequences that convert",
        "Produce ad copy that drives clicks and conversions"
      ],
      image: "/content-generation.webp"
    }
  ];

  const testimonials = [
    {
      quote: "We increased our content output by 300% while reducing time spent on campaign creation by 65%.",
      author: "Sarah Johnson",
      position: "Marketing Director",
      company: "TechNova Solutions",
      avatar: "/avatar1.webp"
    },
    {
      quote: "The Campaign Factory feature saved our team over 40 hours per month on campaign planning and execution.",
      author: "Michael Chen",
      position: "Growth Marketing Lead",
      company: "Elevate Brands",
      avatar: "/avatar2.webp"
    },
    {
      quote: "The detailed AI personas revolutionized how we target our audience. Our conversion rates are up 47%.",
      author: "Emma Rodriguez",
      position: "CMO",
      company: "Spark Digital",
      avatar: "/avatar3.webp"
    }
  ];



  return (
    <div className="bg-gradient-to-b from-black to-[#070b15] min-h-screen">
      {/* Navigation */}
      <nav className="border-b border-gray-800/60 bg-black/50 backdrop-blur-md fixed w-full z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0 cursor-pointer" onClick={() => navigate('/')}>
                <img className="h-8" src={tovablyLogo} alt="Tovably Logo" />
              </div>
              <div className="hidden md:block">
                <div className="ml-10 flex items-center space-x-6">
                  <a href="#features" className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium">
                    Features
                  </a>
                  <a href="#benefits" className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium">
                    Benefits
                  </a>
                  <a href="#testimonials" className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium">
                    Testimonials
                  </a>
                  <a href="#pricing" className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium">
                    Pricing
                  </a>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {user ? (
                <Button 
                  onClick={() => navigate('/dashboard')}
                  className="bg-[#74d1ea] hover:bg-[#5db8d0] text-black"
                >
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <>
                  <Button 
                    variant="ghost" 
                    className="text-white hover:text-[#74d1ea] hover:bg-black/30"
                    onClick={openAuthModal}
                  >
                    Login
                  </Button>
                  <Button 
                    onClick={openAuthModal}
                    className="bg-[#74d1ea] hover:bg-[#5db8d0] text-black"
                  >
                    Sign Up
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#74d1ea]/10 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-[#74d1ea]/5 via-transparent to-transparent"></div>
        
        <div className="max-w-7xl mx-auto relative text-center">
          <div className="max-w-3xl mx-auto">
            <div className="flex justify-center">
              <Badge className="mb-5 bg-[#74d1ea]/20 text-[#74d1ea] border-0 py-1.5 px-3 text-sm">
                AI-Powered Marketing Platform
              </Badge>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Build <span className="bg-gradient-to-r from-[#74d1ea] to-[#a3e6fa] text-transparent bg-clip-text">marketing campaigns</span> in minutes
            </h1>
            <p className="text-xl text-gray-300 mb-8 mx-auto">
              Generate personas, analyze tone, create content, and build full marketing campaigns in minutes instead of days with our intelligent AI platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={openAuthModal}
                className="bg-[#74d1ea] hover:bg-[#5db8d0] text-black px-8 py-6 text-lg rounded-lg shadow-[0_0_25px_rgba(116,209,234,0.25)]"
              >
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
            <div className="mt-6 text-sm text-gray-400">
              No credit card required • 14-day free trial • Cancel anytime
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y border-gray-800/60 bg-black/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">300%</div>
              <p className="text-gray-400">Increase in Content Production</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">35+</div>
              <p className="text-gray-400">Hours Saved Monthly</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">70%</div>
              <p className="text-gray-400">Higher Campaign Output</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-3 bg-[#74d1ea]/20 text-[#74d1ea] border-0 py-1 px-3 text-sm">
              FEATURES
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              How Our Platform Powers Your Marketing Success
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Our comprehensive platform provides all the tools you need to create, analyze, and optimize your marketing campaigns.
            </p>
          </div>

          {/* Features with Side-by-Side Columns, matching dashboard design */}
          {features.map((feature, index) => (
            <div 
              key={feature.id} 
              className={`mb-16 rounded-xl overflow-hidden relative border border-gray-800/60 ${index % 2 === 1 ? 'bg-[#050a15]' : 'bg-[#0a0d14]'}`}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2">
                {/* Text side - will be on the left for even indexes, right for odd */}
                <div className={`p-8 lg:p-12 ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                  <div className="flex items-center mb-6">
                    <div className="p-3 rounded-lg bg-[#74d1ea]/20 mr-4">
                      {feature.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-white">{feature.title}</h3>
                  </div>
                  
                  <p className="text-gray-300 mb-8">
                    {feature.description}
                  </p>
                  
                  <ul className="space-y-4 mb-8">
                    {feature.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start">
                        <div className="flex-shrink-0 w-5 h-5 rounded-full mr-3 flex items-center justify-center bg-[#74d1ea]/20">
                          <Check className="h-3 w-3 text-[#74d1ea]" />
                        </div>
                        <span className="text-gray-300">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className="bg-[#74d1ea] hover:bg-[#5db8d0] text-black shadow-[0_0_15px_rgba(116,209,234,0.2)]"
                    onClick={() => {
                      if (feature.id === 'personas') navigate('/personas-info');
                      else if (feature.id === 'tone') navigate('/tone-analysis-info');
                      else if (feature.id === 'campaigns') navigate('/campaign-factory-info');
                      else if (feature.id === 'content') navigate('/content-generation-info');
                    }}
                  >
                    Explore {feature.title}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
                
                {/* Visual side - will be on the right for even indexes, left for odd */}
                <div className={`bg-[#0e131f] p-8 flex items-center justify-center ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                  {feature.id === 'personas' ? (
                    <div className="w-full border border-gray-800 rounded-xl overflow-hidden bg-[#050a15]">
                      <div className="grid grid-cols-1 lg:grid-cols-2">
                        <div className="p-6 border-r border-gray-800/60">
                          <div className="space-y-6">
                            <div className="border-l-2 border-[#74d1ea] pl-4">
                              <h4 className="text-white font-semibold">Tech-Savvy Marketing Director</h4>
                              <p className="text-sm text-gray-400 mt-1">Seeks innovative solutions to scale content production while maintaining brand consistency.</p>
                              <div className="flex gap-2 mt-2">
                                <span className="text-xs bg-[#090e17] text-[#74d1ea] px-2 py-0.5 rounded-full border border-[#74d1ea]/30">marketing automation</span>
                                <span className="text-xs bg-[#090e17] text-[#74d1ea] px-2 py-0.5 rounded-full border border-[#74d1ea]/30">roi measurement</span>
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="text-white font-semibold">Startup Founder</h4>
                              <p className="text-sm text-gray-400 mt-1">Needs to establish credibility and generate leads with limited resources.</p>
                              <div className="flex gap-2 mt-2">
                                <span className="text-xs bg-[#090e17] text-gray-400 px-2 py-0.5 rounded-full border border-gray-700/50">venture capital</span>
                                <span className="text-xs bg-[#090e17] text-gray-400 px-2 py-0.5 rounded-full border border-gray-700/50">growth hacking</span>
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="text-white font-semibold">Sales Executive</h4>
                              <p className="text-sm text-gray-400 mt-1">Focused on building relationships and increasing conversions through personalized outreach.</p>
                              <div className="flex gap-2 mt-2">
                                <span className="text-xs bg-[#090e17] text-gray-400 px-2 py-0.5 rounded-full border border-gray-700/50">sales automation</span>
                                <span className="text-xs bg-[#090e17] text-gray-400 px-2 py-0.5 rounded-full border border-gray-700/50">lead generation</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-6 text-right">
                            <Button variant="link" className="text-[#74d1ea] text-sm p-0">
                              Create Custom Persona <ArrowRight className="ml-1 h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="p-6 flex flex-col">
                          <div className="p-2 bg-[#0e131f] rounded-lg mb-4 w-8 h-8 flex items-center justify-center">
                            <Users2 className="h-5 w-5 text-[#74d1ea]" />
                          </div>
                          
                          <h3 className="text-xl text-white font-bold mb-3">OpenAI Personas</h3>
                          
                          <p className="text-gray-400 text-sm mb-6">
                            Connect with your ideal audience using tailored personas. Our platform helps you create, manage, and target specific professional personas for more effective content.
                          </p>
                          
                          <ul className="space-y-3 flex-1">
                            <li className="flex items-center">
                              <div className="flex-shrink-0 mr-2 text-[#74d1ea]">
                                <Check className="h-4 w-4" /> 
                              </div>
                              <span className="text-gray-300 text-sm">Create OpenAI-generated or custom personas</span>
                            </li>
                            <li className="flex items-center">
                              <div className="flex-shrink-0 mr-2 text-[#74d1ea]">
                                <Check className="h-4 w-4" /> 
                              </div>
                              <span className="text-gray-300 text-sm">Define interests, pain points, and motivations</span>
                            </li>
                            <li className="flex items-center">
                              <div className="flex-shrink-0 mr-2 text-[#74d1ea]">
                                <Check className="h-4 w-4" /> 
                              </div>
                              <span className="text-gray-300 text-sm">Generate content specifically tailored to each persona</span>
                            </li>
                          </ul>
                          
                          <Button className="w-full mt-6 bg-[#74d1ea] hover:bg-[#5db8d0] text-black">
                            Explore Personas <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : feature.id === 'tone' ? (
                    <div className="w-full border border-gray-800 rounded-xl overflow-hidden bg-[#050a15]">
                      <div className="grid grid-cols-1 lg:grid-cols-2">
                        <div className="p-6 border-r border-gray-800/60">
                          <div className="space-y-6">
                            <div className="border-l-2 border-[#74d1ea] pl-4">
                              <h4 className="text-white font-semibold">Brand Voice Analysis</h4>
                              <p className="text-sm text-gray-400 mt-1">Marketing copy from website product page</p>
                              <div className="mt-3 bg-[#090e17] p-3 rounded-md border border-gray-800/60">
                                <p className="text-sm text-gray-300">Our cutting-edge solution empowers teams to deliver unprecedented results with maximum efficiency.</p>
                              </div>
                              <div className="flex flex-wrap gap-2 mt-3">
                                <div className="flex items-center bg-[#090e17] text-[#74d1ea] px-2 py-1 rounded-md border border-[#74d1ea]/30">
                                  <div className="w-1.5 h-1.5 bg-[#74d1ea] rounded-full mr-1.5"></div>
                                  <span className="text-xs">Professional 87%</span>
                                </div>
                                <div className="flex items-center bg-[#090e17] text-[#74d1ea] px-2 py-1 rounded-md border border-[#74d1ea]/30">
                                  <div className="w-1.5 h-1.5 bg-[#74d1ea] rounded-full mr-1.5"></div>
                                  <span className="text-xs">Confident 82%</span>
                                </div>
                                <div className="flex items-center bg-[#090e17] text-gray-400 px-2 py-1 rounded-md border border-gray-700/50">
                                  <div className="w-1.5 h-1.5 bg-gray-500 rounded-full mr-1.5"></div>
                                  <span className="text-xs">Technical 54%</span>
                                </div>
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="text-white font-semibold">Social Media Post</h4>
                              <p className="text-sm text-gray-400 mt-1">LinkedIn post promoting new product feature</p>
                              <div className="mt-3 bg-[#090e17] p-3 rounded-md border border-gray-800/60">
                                <p className="text-sm text-gray-300">Excited to launch our game-changing feature today! Can't wait to hear what you think! 🚀 #Innovation</p>
                              </div>
                              <div className="flex flex-wrap gap-2 mt-3">
                                <div className="flex items-center bg-[#090e17] text-gray-400 px-2 py-1 rounded-md border border-gray-700/50">
                                  <div className="w-1.5 h-1.5 bg-gray-500 rounded-full mr-1.5"></div>
                                  <span className="text-xs">Enthusiastic 91%</span>
                                </div>
                                <div className="flex items-center bg-[#090e17] text-gray-400 px-2 py-1 rounded-md border border-gray-700/50">
                                  <div className="w-1.5 h-1.5 bg-gray-500 rounded-full mr-1.5"></div>
                                  <span className="text-xs">Informal 76%</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-6 text-right">
                            <Button variant="link" className="text-[#74d1ea] text-sm p-0">
                              Analyze New Content <ArrowRight className="ml-1 h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="p-6 flex flex-col">
                          <div className="p-2 bg-[#0e131f] rounded-lg mb-4 w-8 h-8 flex items-center justify-center">
                            <MessageSquareText className="h-5 w-5 text-[#74d1ea]" />
                          </div>
                          
                          <h3 className="text-xl text-white font-bold mb-3">Tone Analysis</h3>
                          
                          <p className="text-gray-400 text-sm mb-6">
                            Analyze and perfect your brand voice across all content to maintain consistency and resonate with your target audience.
                          </p>
                          
                          <ul className="space-y-3 flex-1">
                            <li className="flex items-center">
                              <div className="flex-shrink-0 mr-2 text-[#74d1ea]">
                                <Check className="h-4 w-4" /> 
                              </div>
                              <span className="text-gray-300 text-sm">Ensure brand voice consistency across channels</span>
                            </li>
                            <li className="flex items-center">
                              <div className="flex-shrink-0 mr-2 text-[#74d1ea]">
                                <Check className="h-4 w-4" /> 
                              </div>
                              <span className="text-gray-300 text-sm">Adapt tone to different audience segments</span>
                            </li>
                            <li className="flex items-center">
                              <div className="flex-shrink-0 mr-2 text-[#74d1ea]">
                                <Check className="h-4 w-4" /> 
                              </div>
                              <span className="text-gray-300 text-sm">Fine-tune emotional impact of your messaging</span>
                            </li>
                          </ul>
                          
                          <Button className="w-full mt-6 bg-[#74d1ea] hover:bg-[#5db8d0] text-black">
                            Explore Tone Analysis <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : feature.id === 'campaigns' ? (
                    <div className="w-full border border-gray-800 rounded-xl overflow-hidden bg-[#050a15]">
                      <div className="grid grid-cols-1 lg:grid-cols-2">
                        <div className="p-6 border-r border-gray-800/60">
                          <div className="space-y-4">
                            <h4 className="text-white font-semibold">Product Launch Campaign</h4>
                            <div className="space-y-3">
                              <div className="bg-[#090e17] p-3 rounded-md border border-gray-800/60">
                                <div className="flex items-center mb-2">
                                  <div className="w-1.5 h-1.5 bg-[#74d1ea] rounded-full mr-1.5"></div>
                                  <span className="text-xs text-[#74d1ea] font-medium">Email Sequence</span>
                                </div>
                                <p className="text-sm text-gray-300 mb-1">• Initial Announcement (Day 1)</p>
                                <p className="text-sm text-gray-300 mb-1">• Preview Benefits (Day 3)</p>
                                <p className="text-sm text-gray-300">• Launch Day Offer (Day 7)</p>
                              </div>
                              
                              <div className="bg-[#090e17] p-3 rounded-md border border-gray-800/60">
                                <div className="flex items-center mb-2">
                                  <div className="w-1.5 h-1.5 bg-[#74d1ea] rounded-full mr-1.5"></div>
                                  <span className="text-xs text-[#74d1ea] font-medium">Social Media Content</span>
                                </div>
                                <p className="text-sm text-gray-300 mb-1">• Teaser Video Posts (2 weeks)</p>
                                <p className="text-sm text-gray-300 mb-1">• Customer Testimonials (1 week)</p>
                                <p className="text-sm text-gray-300">• Live Demo Announcement (Day 5)</p>
                              </div>
                              
                              <div className="bg-[#090e17] p-3 rounded-md border border-gray-800/60">
                                <div className="flex items-center mb-2">
                                  <div className="w-1.5 h-1.5 bg-[#74d1ea] rounded-full mr-1.5"></div>
                                  <span className="text-xs text-[#74d1ea] font-medium">Landing Page</span>
                                </div>
                                <p className="text-sm text-gray-300 mb-1">• Key Benefits Section</p>
                                <p className="text-sm text-gray-300 mb-1">• Feature Showcase</p>
                                <p className="text-sm text-gray-300">• Early-Bird Pricing CTA</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-6 text-right">
                            <Button variant="link" className="text-[#74d1ea] text-sm p-0">
                              Build New Campaign <ArrowRight className="ml-1 h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="p-6 flex flex-col">
                          <div className="p-2 bg-[#0e131f] rounded-lg mb-4 w-8 h-8 flex items-center justify-center">
                            <CalendarClock className="h-5 w-5 text-[#74d1ea]" />
                          </div>
                          
                          <h3 className="text-xl text-white font-bold mb-3">Campaign Factory</h3>
                          
                          <p className="text-gray-400 text-sm mb-6">
                            Build complete marketing campaigns in minutes instead of days or weeks. Our Campaign Factory streamlines your entire marketing workflow.
                          </p>
                          
                          <ul className="space-y-3 flex-1">
                            <li className="flex items-center">
                              <div className="flex-shrink-0 mr-2 text-[#74d1ea]">
                                <Check className="h-4 w-4" /> 
                              </div>
                              <span className="text-gray-300 text-sm">Create multi-channel campaigns with 70% less effort</span>
                            </li>
                            <li className="flex items-center">
                              <div className="flex-shrink-0 mr-2 text-[#74d1ea]">
                                <Check className="h-4 w-4" /> 
                              </div>
                              <span className="text-gray-300 text-sm">Generate coordinated content across platforms</span>
                            </li>
                            <li className="flex items-center">
                              <div className="flex-shrink-0 mr-2 text-[#74d1ea]">
                                <Check className="h-4 w-4" /> 
                              </div>
                              <span className="text-gray-300 text-sm">Save 35+ hours monthly on campaign planning</span>
                            </li>
                          </ul>
                          
                          <Button className="w-full mt-6 bg-[#74d1ea] hover:bg-[#5db8d0] text-black">
                            Explore Campaign Factory <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : feature.id === 'content' ? (
                    <div className="w-full border border-gray-800 rounded-xl overflow-hidden bg-[#050a15]">
                      <div className="grid grid-cols-1 lg:grid-cols-2">
                        <div className="p-6 border-r border-gray-800/60">
                          <div className="space-y-4">
                            <h4 className="text-white font-semibold">Generated Content Examples</h4>
                            
                            <div className="bg-[#090e17] p-3 rounded-md border border-gray-800/60">
                              <div className="flex items-center mb-2">
                                <div className="w-1.5 h-1.5 bg-[#74d1ea] rounded-full mr-1.5"></div>
                                <span className="text-xs text-[#74d1ea] font-medium">Blog Post Headline</span>
                              </div>
                              <p className="text-sm text-gray-300 font-medium">10 Ways AI Is Transforming Digital Marketing in 2025</p>
                              <div className="flex gap-2 mt-2">
                                <span className="text-xs bg-[#0d121c] text-gray-400 px-1.5 py-0.5 rounded border border-gray-700/50">SEO-Optimized</span>
                                <span className="text-xs bg-[#0d121c] text-gray-400 px-1.5 py-0.5 rounded border border-gray-700/50">High CTR</span>
                              </div>
                            </div>
                            
                            <div className="bg-[#090e17] p-3 rounded-md border border-gray-800/60">
                              <div className="flex items-center mb-2">
                                <div className="w-1.5 h-1.5 bg-[#74d1ea] rounded-full mr-1.5"></div>
                                <span className="text-xs text-[#74d1ea] font-medium">Ad Copy</span>
                              </div>
                              <p className="text-sm text-gray-300">Transform your marketing strategy today. Our AI-powered platform saves you 35+ hours every month while increasing campaign output by 70%.</p>
                              <div className="flex gap-2 mt-2">
                                <span className="text-xs bg-[#0d121c] text-gray-400 px-1.5 py-0.5 rounded border border-gray-700/50">Facebook</span>
                                <span className="text-xs bg-[#0d121c] text-gray-400 px-1.5 py-0.5 rounded border border-gray-700/50">LinkedIn</span>
                              </div>
                            </div>
                            
                            <div className="bg-[#090e17] p-3 rounded-md border border-gray-800/60">
                              <div className="flex items-center mb-2">
                                <div className="w-1.5 h-1.5 bg-[#74d1ea] rounded-full mr-1.5"></div>
                                <span className="text-xs text-[#74d1ea] font-medium">Email Subject Line</span>
                              </div>
                              <p className="text-sm text-gray-300 font-medium">[EXCLUSIVE] Unlock Your Marketing Potential with These AI Tools</p>
                              <div className="flex gap-2 mt-2">
                                <span className="text-xs bg-[#0d121c] text-gray-400 px-1.5 py-0.5 rounded border border-gray-700/50">58% Open Rate</span>
                                <span className="text-xs bg-[#0d121c] text-gray-400 px-1.5 py-0.5 rounded border border-gray-700/50">Personalized</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-6 text-right">
                            <Button variant="link" className="text-[#74d1ea] text-sm p-0">
                              Generate New Content <ArrowRight className="ml-1 h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="p-6 flex flex-col">
                          <div className="p-2 bg-[#0e131f] rounded-lg mb-4 w-8 h-8 flex items-center justify-center">
                            <BrainCircuit className="h-5 w-5 text-[#74d1ea]" />
                          </div>
                          
                          <h3 className="text-xl text-white font-bold mb-3">AI Content Generation</h3>
                          
                          <p className="text-gray-400 text-sm mb-6">
                            Create high-converting, SEO-optimized content for any channel in seconds with our advanced AI content generation tools.
                          </p>
                          
                          <ul className="space-y-3 flex-1">
                            <li className="flex items-center">
                              <div className="flex-shrink-0 mr-2 text-[#74d1ea]">
                                <Check className="h-4 w-4" /> 
                              </div>
                              <span className="text-gray-300 text-sm">Generate SEO-optimized blog posts and articles</span>
                            </li>
                            <li className="flex items-center">
                              <div className="flex-shrink-0 mr-2 text-[#74d1ea]">
                                <Check className="h-4 w-4" /> 
                              </div>
                              <span className="text-gray-300 text-sm">Create engaging social media content in seconds</span>
                            </li>
                            <li className="flex items-center">
                              <div className="flex-shrink-0 mr-2 text-[#74d1ea]">
                                <Check className="h-4 w-4" /> 
                              </div>
                              <span className="text-gray-300 text-sm">Produce ad copy that drives clicks and conversions</span>
                            </li>
                          </ul>
                          
                          <Button className="w-full mt-6 bg-[#74d1ea] hover:bg-[#5db8d0] text-black">
                            Explore Content Generation <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-lg overflow-hidden border border-gray-800 shadow-xl w-full max-h-[400px]">
                      <img 
                        src={feature.image || "placeholder.webp"} 
                        alt={feature.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback if image fails to load
                          e.currentTarget.src = "placeholder.webp";
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#070b15] to-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-3 bg-[#74d1ea]/20 text-[#74d1ea] border-0 py-1 px-3 text-sm">
              BENEFITS
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              What You'll Achieve With Our Platform
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Discover how our AI-powered platform can transform your marketing efforts and deliver measurable results.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-black/40 border border-gray-800/60 rounded-xl p-8 hover:border-gray-700/80 transition-colors">
              <div className="w-14 h-14 rounded-lg bg-[#0e131f] border border-[#74d1ea]/20 flex items-center justify-center mb-6">
                <Clock className="h-7 w-7 text-[#74d1ea]" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Save Countless Hours</h3>
              <p className="text-gray-400">
                Reduce campaign creation time by up to 70% with our AI-powered automation. Focus on strategy while our platform handles the execution.
              </p>
            </div>

            <div className="bg-black/40 border border-gray-800/60 rounded-xl p-8 hover:border-gray-700/80 transition-colors">
              <div className="w-14 h-14 rounded-lg bg-[#0e131f] border border-[#74d1ea]/20 flex items-center justify-center mb-6">
                <Target className="h-7 w-7 text-[#74d1ea]" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Enhance Targeting</h3>
              <p className="text-gray-400">
                Create detailed audience personas that help you understand your customers better and craft messages that resonate perfectly.
              </p>
            </div>

            <div className="bg-black/40 border border-gray-800/60 rounded-xl p-8 hover:border-gray-700/80 transition-colors">
              <div className="w-14 h-14 rounded-lg bg-[#0e131f] border border-[#74d1ea]/20 flex items-center justify-center mb-6">
                <BarChart2 className="h-7 w-7 text-[#74d1ea]" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Improve ROI</h3>
              <p className="text-gray-400">
                Achieve higher conversion rates and better campaign performance through AI-optimized content and strategic audience targeting.
              </p>
            </div>

            <div className="bg-black/40 border border-gray-800/60 rounded-xl p-8 hover:border-gray-700/80 transition-colors">
              <div className="w-14 h-14 rounded-lg bg-[#0e131f] border border-[#74d1ea]/20 flex items-center justify-center mb-6">
                <Rocket className="h-7 w-7 text-[#74d1ea]" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Scale Content Production</h3>
              <p className="text-gray-400">
                Generate high-quality content across multiple channels simultaneously, allowing you to scale your marketing efforts without increasing headcount.
              </p>
            </div>

            <div className="bg-black/40 border border-gray-800/60 rounded-xl p-8 hover:border-gray-700/80 transition-colors">
              <div className="w-14 h-14 rounded-lg bg-[#0e131f] border border-[#74d1ea]/20 flex items-center justify-center mb-6">
                <MessageSquareText className="h-7 w-7 text-[#74d1ea]" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Consistent Brand Voice</h3>
              <p className="text-gray-400">
                Maintain a consistent tone across all marketing channels with our advanced tone analysis and generation capabilities.
              </p>
            </div>

            <div className="bg-black/40 border border-gray-800/60 rounded-xl p-8 hover:border-gray-700/80 transition-colors">
              <div className="w-14 h-14 rounded-lg bg-[#0e131f] border border-[#74d1ea]/20 flex items-center justify-center mb-6">
                <Lightbulb className="h-7 w-7 text-[#74d1ea]" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Creative Breakthrough</h3>
              <p className="text-gray-400">
                Overcome creative blocks with AI-powered suggestions and innovative campaign ideas that push boundaries and captivate audiences.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0a0d14]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-3 bg-[#74d1ea]/20 text-[#74d1ea] border-0 py-1 px-3 text-sm">
              TESTIMONIALS
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              How Our Platform Changed Their Work
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              See what our customers are saying about how our platform has transformed their marketing operations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-black border border-gray-800/60 rounded-xl p-8 relative">
                <div className="absolute top-6 right-8 text-[#74d1ea]">
                  <svg width="40" height="30" viewBox="0 0 40 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.5 0C8.4 0 5.9 1.1 4 3.4C2.1 5.6 1 8.5 1 12C1 15.1 2.1 17.7 4.2 19.8C6.4 21.9 9.1 23 12.3 23C12.8 23 13.2 23 13.7 22.9C13.1 24.4 12.1 25.6 10.7 26.5C9.4 27.4 7.9 27.9 6.3 28C5.9 28 5.6 28.2 5.4 28.4C5.2 28.6 5.1 28.9 5.1 29.3C5.1 29.6 5.2 29.9 5.5 30.1C5.7 30.3 6 30.4 6.4 30.4C9.2 30.2 11.8 29.1 14.1 27C16.4 24.9 17.8 22.3 18.5 19.1C18.8 17.8 19 16.5 19 15.2V12.1C19 8.4 17.9 5.4 15.8 3.2C13.7 1.1 10.9 0 11.5 0ZM32.5 0C29.4 0 26.9 1.1 25 3.4C23.1 5.6 22 8.5 22 12C22 15.1 23.1 17.7 25.2 19.8C27.4 21.9 30.1 23 33.3 23C33.8 23 34.2 23 34.7 22.9C34.1 24.4 33.1 25.6 31.7 26.5C30.4 27.4 28.9 27.9 27.3 28C26.9 28 26.6 28.2 26.4 28.4C26.2 28.6 26.1 28.9 26.1 29.3C26.1 29.6 26.2 29.9 26.5 30.1C26.7 30.3 27 30.4 27.4 30.4C30.2 30.2 32.8 29.1 35.1 27C37.4 24.9 38.8 22.3 39.5 19.1C39.8 17.8 40 16.5 40 15.2V12.1C40 8.4 38.9 5.4 36.8 3.2C34.7 1.1 31.9 0 32.5 0Z" fill="currentColor" fillOpacity="0.2"/>
                  </svg>
                </div>
                <p className="text-gray-300 mb-6 text-lg">"{testimonial.quote}"</p>
                <div className="flex items-center">
                  <div>
                    <div className="text-white font-medium">- {testimonial.author}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-3 bg-[#74d1ea]/20 text-[#74d1ea] border-0 py-1 px-3 text-sm">
              PRICING
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              <span className="block text-white">Choose Your</span>
              <span className="block text-[#74d1ea]">Subscription Plan</span>
            </h2>
            <p className="text-gray-400 max-w-3xl mx-auto text-lg">
              Select the plan that best fits your needs. All plans include access to our AI-powered tone analysis
              and content generation. Premium tiers unlock our revolutionary <span className="text-[#74d1ea] font-semibold">Campaign Factory</span> feature
              that transforms how you create marketing campaigns.
            </p>
          </div>

          {/* Pricing cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {Object.entries(subscriptionPlans).map(([planId, plan], index) => {
              // Calculate different visual styling based on plan
              const isProPlan = planId === 'premium'; // Pro plan is now the premium tier
              const isPremiumPlan = planId === 'professional'; // Premium plan is now the professional tier
              const isFreePlan = planId === 'free';
              const isPaidPlan = !isFreePlan;
              
              return (
                <div 
                  key={planId} 
                  className={`relative group transform transition-all duration-300 hover:scale-105 bg-black rounded-lg overflow-hidden h-full ${
                    isProPlan 
                      ? 'border-[1.5px] border-[#74d1ea] shadow-[0_0_35px_rgba(116,209,234,0.4)]' 
                      : isPremiumPlan
                        ? 'border-[1.5px] border-[#5db8d0] shadow-[0_0_25px_rgba(116,209,234,0.25)]'
                        : 'border border-gray-700/60'
                  }`}
                >
                  {/* Glowing background effect */}
                  {isPaidPlan && (
                    <div 
                      className="absolute inset-0 opacity-5 bg-[#74d1ea] blur-3xl rounded-full -z-10 group-hover:opacity-10 transition-opacity"
                      style={{
                        width: '150%',
                        height: '150%',
                        top: '-25%',
                        left: '-25%',
                      }}
                    ></div>
                  )}
                  
                  {/* Top accent gradient */}
                  <div className={`h-2 w-full bg-gradient-to-r ${
                    isFreePlan ? 'from-gray-800 to-gray-700' :
                    planId === 'standard' ? 'from-[#53b0c9] to-[#74d1ea]' :
                    isProPlan ? 'from-[#74d1ea] via-[#53b0c9] to-[#74d1ea]' :
                    'from-[#74d1ea] via-[#53b0c9] to-[#40a3bd]'
                  }`}></div>
                  
                  {/* Premium plan highlighted styling with extra glow */}
                  {isProPlan && (
                    <>
                      {/* Top glow bar */}
                      <div className="absolute -top-1 -left-1 -right-1 h-1 bg-gradient-to-r from-[#74d1ea]/30 via-[#74d1ea] to-[#74d1ea]/30 blur-md"></div>
                      
                      {/* Subtle corner glows */}
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#74d1ea]/20 rounded-full blur-md"></div>
                      <div className="absolute -top-2 -left-2 w-8 h-8 bg-[#74d1ea]/20 rounded-full blur-md"></div>
                      
                      {/* Extra border brightness */}
                      <div className="absolute inset-0 border border-[#74d1ea]/30 rounded-[7px] pointer-events-none"></div>
                    </>
                  )}
                  
                  <div className="p-6 text-center mt-2">
                    {/* Plan name */}
                    <h3 className={`text-xl font-bold mb-2 ${isPaidPlan ? 'text-[#74d1ea]' : 'text-white'}`}>
                      {plan.name}
                    </h3>
                    
                    {/* Price display */}
                    <div className="text-center mb-3">
                      <span className="text-4xl font-bold text-white">{plan.displayPrice}</span>
                      {!isFreePlan && <span className="text-xl text-gray-400 ml-1">/month</span>}
                    </div>
                    
                    {/* Plan description */}
                    <p className="text-gray-400 text-sm mb-5 pb-3 border-b border-gray-800/50">
                      {isFreePlan ? 'Get started with basic features' : 
                      planId === 'standard' ? 'Perfect for professionals' : 
                      isProPlan ? 'Ideal for growing businesses' : 
                      'For demanding content creators'}
                    </p>
                    
                    {/* Features list */}
                    <ul className="space-y-3 text-sm text-left mb-8">
                      <li className="flex items-center">
                        <div className="flex-shrink-0 w-5 h-5 rounded-full mr-2 flex items-center justify-center bg-[#74d1ea]/20">
                          <Check className="h-3 w-3 text-[#74d1ea]" />
                        </div>
                        <span className="text-gray-300">{plan.personas} AI Personas</span>
                      </li>
                      <li className="flex items-center">
                        <div className="flex-shrink-0 w-5 h-5 rounded-full mr-2 flex items-center justify-center bg-[#74d1ea]/20">
                          <Check className="h-3 w-3 text-[#74d1ea]" />
                        </div>
                        <span className="text-gray-300">{plan.toneAnalyses} Tone Analyses</span>
                      </li>
                      <li className="flex items-center">
                        <div className="flex-shrink-0 w-5 h-5 rounded-full mr-2 flex items-center justify-center bg-[#74d1ea]/20">
                          <Check className="h-3 w-3 text-[#74d1ea]" />
                        </div>
                        <span className="text-gray-300">{plan.contentGeneration} Content Creations</span>
                      </li>
                      <li className="flex items-center">
                        <div className="flex-shrink-0 w-5 h-5 rounded-full mr-2 flex items-center justify-center bg-[#74d1ea]/20">
                          <Check className="h-3 w-3 text-[#74d1ea]" />
                        </div>
                        <span className="text-gray-300">{plan.campaigns} Campaigns</span>
                      </li>
                      <li className={`flex items-center ${plan.campaignFactory > 0 ? 'bg-[#74d1ea]/10 p-1.5 rounded-md -mx-1.5 my-2' : ''}`}>
                        <div className="flex-shrink-0 w-5 h-5 rounded-full mr-2 flex items-center justify-center bg-[#74d1ea]/20">
                          {plan.campaignFactory > 0 ? (
                            <Check className="h-3 w-3 text-[#74d1ea]" />
                          ) : (
                            <X className="h-3 w-3 text-red-500" />
                          )}
                        </div>
                        {plan.campaignFactory > 0 ? (
                          <span>
                            <span className="text-[#74d1ea] font-medium">
                              {plan.campaignFactory} Campaign Factory Credits
                            </span>
                            <span className="block text-xs text-gray-400 mt-0.5">Save 20+ hours per campaign!</span>
                          </span>
                        ) : (
                          <span className="text-gray-300">
                            No Campaign Factory Access
                          </span>
                        )}
                      </li>
                      <li className="flex items-center">
                        <div className="flex-shrink-0 w-5 h-5 rounded-full mr-2 flex items-center justify-center bg-[#74d1ea]/20">
                          <Check className="h-3 w-3 text-[#74d1ea]" />
                        </div>
                        <span className="text-gray-300">{planId === 'free' ? 'Standard Support' : 'Priority Support'}</span>
                      </li>
                    </ul>
                  </div>

                  <div className="px-6 pb-6">
                    <Button 
                      className={`w-full font-medium transition-all duration-300 ${
                        !isFreePlan 
                          ? 'bg-[#74d1ea] hover:bg-[#5db8d0] text-black shadow-[0_0_15px_rgba(116,209,234,0.4)] hover:shadow-[0_0_20px_rgba(116,209,234,0.6)]' 
                          : 'bg-transparent border border-[#74d1ea]/30 hover:border-[#74d1ea] text-[#74d1ea] hover:text-white hover:shadow-[0_0_15px_rgba(116,209,234,0.3)]'
                      }`}
                      onClick={() => {
                        // For free plan, open auth modal. For paid plans, go directly to Stripe checkout
                        if (isFreePlan) {
                          openAuthModal();
                        } else {
                          // Use the direct Stripe redirect endpoint
                          window.location.href = `/api/direct-stripe-redirect?plan=${planId}`;
                        }
                      }}
                    >
                      {isFreePlan ? "Get Started" : `Get ${plan.name}`}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Enterprise & Agency Plans Section */}
          <div className="mb-16">
            <div className="relative overflow-hidden bg-black border border-gray-700/60 rounded-lg shadow-xl transform transition-all duration-300 hover:shadow-[0_0_35px_rgba(116,209,234,0.15)]">
              <div className="absolute inset-0 opacity-5 bg-gradient-to-r from-[#74d1ea] via-black to-[#74d1ea] blur-md"></div>
              
              {/* Top accent gradient */}
              <div className="h-1 w-full bg-gradient-to-r from-[#74d1ea] via-[#53b0c9] to-[#74d1ea]"></div>
              
              <div className="px-6 py-12 md:px-12 text-center md:text-left flex flex-col md:flex-row items-center justify-between relative z-10">
                <div className="md:max-w-2xl mb-8 md:mb-0">
                  <h2 className="text-3xl font-bold text-white mb-4">Need a Custom Enterprise or Agency Solution?</h2>
                  <p className="text-gray-300 text-lg mb-4">
                    We offer tailored plans for agencies and enterprise clients with custom volumes, dedicated support, and specialized features.
                  </p>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6 text-left">
                    <li className="flex items-center">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full mr-2 flex items-center justify-center bg-[#74d1ea]/20">
                        <Check className="h-3 w-3 text-[#74d1ea]" />
                      </div>
                      <span className="text-gray-300">Customizable usage limits</span>
                    </li>
                    <li className="flex items-center">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full mr-2 flex items-center justify-center bg-[#74d1ea]/20">
                        <Check className="h-3 w-3 text-[#74d1ea]" />
                      </div>
                      <span className="text-gray-300">Dedicated account manager</span>
                    </li>
                    <li className="flex items-center">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full mr-2 flex items-center justify-center bg-[#74d1ea]/20">
                        <Check className="h-3 w-3 text-[#74d1ea]" />
                      </div>
                      <span className="text-gray-300">API access</span>
                    </li>
                    <li className="flex items-center">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full mr-2 flex items-center justify-center bg-[#74d1ea]/20">
                        <Check className="h-3 w-3 text-[#74d1ea]" />
                      </div>
                      <span className="text-gray-300">Custom integrations</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <Button 
                    className="bg-[#74d1ea] hover:bg-[#5db8d0] text-black px-6 py-3 font-medium rounded-lg shadow-[0_0_15px_rgba(116,209,234,0.4)] hover:shadow-[0_0_20px_rgba(116,209,234,0.6)]" 
                    onClick={() => navigate('/contact')}
                  >
                    Contact Sales
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0a0d14] border-t border-gray-800/60">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            When Will You Transform Your Marketing?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Join thousands of marketing professionals who are creating better content faster with our AI-powered platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={openAuthModal}
              className="bg-[#74d1ea] hover:bg-[#5db8d0] text-black px-8 py-6 text-lg rounded-lg shadow-[0_0_25px_rgba(116,209,234,0.25)]"
            >
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
          <div className="mt-6 text-sm text-gray-400">
            Start transforming your marketing today. No credit card required.
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-gray-700/60">
        <div className="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
          <div className="flex justify-center mb-8">
            <div className="cursor-pointer" onClick={() => navigate('/')}>
              <img className="h-8" src={tovablyLogo} alt="Tovably Logo" />
            </div>
          </div>
          <nav className="-mx-5 -my-2 flex flex-wrap justify-center" aria-label="Footer">
            <div className="px-5 py-2">
              <a href="/about" className="text-base text-gray-400 hover:text-[#74d1ea]">
                About
              </a>
            </div>
            <div className="px-5 py-2">
              <a href="/features" className="text-base text-gray-400 hover:text-[#74d1ea]">
                Features
              </a>
            </div>
            <div className="px-5 py-2">
              <a href="/pricing" className="text-base text-gray-400 hover:text-[#74d1ea]">
                Pricing
              </a>
            </div>
            <div className="px-5 py-2">
              <a href="/blog" className="text-base text-gray-400 hover:text-[#74d1ea]">
                Blog
              </a>
            </div>
            <div className="px-5 py-2">
              <a href="/contact" className="text-base text-gray-400 hover:text-[#74d1ea]">
                Contact
              </a>
            </div>
            <div className="px-5 py-2">
              <a href="/privacy-policy" className="text-base text-gray-400 hover:text-[#74d1ea]">
                Privacy Policy
              </a>
            </div>
          </nav>
          <p className="mt-8 text-center text-base text-gray-400">
            &copy; {new Date().getFullYear()} Tovably. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}