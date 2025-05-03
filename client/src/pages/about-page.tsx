import { Helmet } from "react-helmet";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { 
  Sparkles, 
  Target, 
  Lightbulb, 
  BarChart3, 
  Users, 
  MessageCircle, 
  Globe, 
  Shield, 
  Code
} from "lucide-react";

export default function AboutPage() {
  return (
    <Layout>
      <Helmet>
        <title>About | Tovably</title>
        <meta name="description" content="Learn about Tovably's mission to revolutionize brand communication with AI-powered tone analysis and content generation." />
      </Helmet>
      
      {/* Hero Section */}
      <div className="relative py-20 bg-black overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#74d1ea]/10 to-transparent opacity-40"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="border border-gray-700/60 rounded-lg py-12 px-8 shadow-[0_0_25px_rgba(116,209,234,0.15)]">
            <div className="text-center mb-8">
              <div className="inline-flex items-center mb-4 text-[#74d1ea]">
                <span className="flex h-2 w-2 bg-[#74d1ea] rounded-full mr-2"></span>
                <span className="text-sm font-medium">Our Story</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
                The team behind <span className="text-[#74d1ea]">Tovably</span>
              </h1>
              <p className="mt-6 text-xl text-gray-300 max-w-3xl mx-auto">
                Revolutionizing how brands communicate with AI-powered tone analysis and content generation.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mission Section */}
      <div className="bg-black py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center mb-4 text-[#74d1ea]">
                <span className="flex h-2 w-2 bg-[#74d1ea] rounded-full mr-2"></span>
                <span className="text-sm font-medium">Our Mission</span>
              </div>
              <h2 className="text-3xl font-bold text-white mb-6">
                A new era of brand communication
              </h2>
              <p className="text-gray-300 text-lg mb-6">
                At Tovably, we're on a mission to revolutionize how brands communicate. We believe that 
                every brand has a unique voice that, when properly understood and consistently applied, 
                creates deeper connections with audiences.
              </p>
              <p className="text-gray-300 text-lg">
                Our AI-powered platform is designed to help businesses identify, refine, and leverage 
                their distinctive tone of voice across all communication channels.
              </p>
            </div>
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#74d1ea] to-[#74d1ea]/30 rounded-lg blur-sm opacity-30"></div>
              <div className="relative bg-black border border-gray-700/60 rounded-lg p-8 shadow-[0_0_25px_rgba(116,209,234,0.15)]">
                <div className="grid grid-cols-2 gap-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="h-12 w-12 bg-[#74d1ea]/10 rounded-full flex items-center justify-center mb-4 border border-[#74d1ea]/20">
                      <Sparkles className="h-6 w-6 text-[#74d1ea]" />
                    </div>
                    <h3 className="text-xl font-medium text-white">Innovation</h3>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <div className="h-12 w-12 bg-[#74d1ea]/10 rounded-full flex items-center justify-center mb-4 border border-[#74d1ea]/20">
                      <Target className="h-6 w-6 text-[#74d1ea]" />
                    </div>
                    <h3 className="text-xl font-medium text-white">Precision</h3>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <div className="h-12 w-12 bg-[#74d1ea]/10 rounded-full flex items-center justify-center mb-4 border border-[#74d1ea]/20">
                      <Lightbulb className="h-6 w-6 text-[#74d1ea]" />
                    </div>
                    <h3 className="text-xl font-medium text-white">Creativity</h3>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <div className="h-12 w-12 bg-[#74d1ea]/10 rounded-full flex items-center justify-center mb-4 border border-[#74d1ea]/20">
                      <Users className="h-6 w-6 text-[#74d1ea]" />
                    </div>
                    <h3 className="text-xl font-medium text-white">Community</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Our Story Section */}
      <div className="bg-black py-20 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 relative">
              <div className="bg-gradient-to-br from-[#74d1ea]/20 to-transparent absolute inset-0 rounded-xl opacity-20"></div>
              <div className="relative bg-black border border-gray-700/60 rounded-lg p-6 shadow-[0_0_25px_rgba(116,209,234,0.15)]">
                <div className="space-y-4">
                  <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-800">
                    <div className="flex items-start">
                      <div className="mt-1 h-8 w-8 bg-[#74d1ea]/10 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                        <span className="text-sm font-bold text-[#74d1ea]">01</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-white mb-2">The Problem</h3>
                        <p className="text-gray-300">
                          Even the most innovative companies struggle to maintain a consistent tone of voice
                          across their communications, creating disconnects with audiences.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-800">
                    <div className="flex items-start">
                      <div className="mt-1 h-8 w-8 bg-[#74d1ea]/10 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                        <span className="text-sm font-bold text-[#74d1ea]">02</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-white mb-2">The Vision</h3>
                        <p className="text-gray-300">
                          A platform that makes sophisticated tone analysis and content generation
                          accessible to businesses of all sizes.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-800">
                    <div className="flex items-start">
                      <div className="mt-1 h-8 w-8 bg-[#74d1ea]/10 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                        <span className="text-sm font-bold text-[#74d1ea]">03</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-white mb-2">The Solution</h3>
                        <p className="text-gray-300">
                          Tovably emerged as a powerful yet intuitive platform that helps brands speak with clarity,
                          consistency, and conviction.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center mb-4 text-[#74d1ea]">
                <span className="flex h-2 w-2 bg-[#74d1ea] rounded-full mr-2"></span>
                <span className="text-sm font-medium">Our Story</span>
              </div>
              <h2 className="text-3xl font-bold text-white mb-6">
                From concept to communication platform
              </h2>
              <p className="text-gray-300 text-lg mb-6">
                Tovably was born from a simple observation: even the most innovative companies struggle 
                to maintain a consistent tone of voice across their communications. This inconsistency 
                creates disconnects with audiences and weakens brand perception.
              </p>
              <p className="text-gray-300 text-lg">
                Founded by a team of communication experts and AI specialists, we set out to build a 
                solution that would make sophisticated tone of voice analysis and content generation 
                accessible to businesses of all sizes. After months of research, development, and testing, 
                Tovably emerged as a powerful yet intuitive platform that helps brands speak with clarity, 
                consistency, and conviction.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Our Approach Section */}
      <div className="bg-black py-20 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center mb-4 text-[#74d1ea]">
              <span className="flex h-2 w-2 bg-[#74d1ea] rounded-full mr-2"></span>
              <span className="text-sm font-medium">Our Approach</span>
            </div>
            <h2 className="text-3xl font-bold text-white mb-6">
              Human-centered AI technology
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              We take a human-centered approach to AI. Our technology is designed to enhance human 
              creativity, not replace it.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="bg-gray-900/30 backdrop-blur-sm rounded-lg p-8 border border-gray-700/60 shadow-[0_0_15px_rgba(116,209,234,0.15)]">
              <div className="h-16 w-16 bg-[#74d1ea]/10 rounded-full flex items-center justify-center mb-6 mx-auto border border-[#74d1ea]/30">
                <BarChart3 className="h-8 w-8 text-[#74d1ea]" />
              </div>
              <h3 className="text-xl font-medium text-white mb-4">Data-Driven Insights</h3>
              <p className="text-gray-300">
                Our platform analyzes language patterns and audience responses to provide actionable 
                insights for more effective communication.
              </p>
            </div>
            
            <div className="bg-gray-900/30 backdrop-blur-sm rounded-lg p-8 border border-gray-700/60 shadow-[0_0_15px_rgba(116,209,234,0.15)]">
              <div className="h-16 w-16 bg-[#74d1ea]/10 rounded-full flex items-center justify-center mb-6 mx-auto border border-[#74d1ea]/30">
                <MessageCircle className="h-8 w-8 text-[#74d1ea]" />
              </div>
              <h3 className="text-xl font-medium text-white mb-4">Intuitive Design</h3>
              <p className="text-gray-300">
                Complex language analysis delivered through an accessible interface that makes 
                powerful capabilities available to everyone.
              </p>
            </div>
            
            <div className="bg-gray-900/30 backdrop-blur-sm rounded-lg p-8 border border-gray-700/60 shadow-[0_0_15px_rgba(116,209,234,0.15)]">
              <div className="h-16 w-16 bg-[#74d1ea]/10 rounded-full flex items-center justify-center mb-6 mx-auto border border-[#74d1ea]/30">
                <Code className="h-8 w-8 text-[#74d1ea]" />
              </div>
              <h3 className="text-xl font-medium text-white mb-4">Continuous Evolution</h3>
              <p className="text-gray-300">
                Our algorithms are continuously refined based on user feedback and evolving communication 
                trends in the digital landscape.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Our Values Section */}
      <div className="bg-black py-20 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center mb-4 text-[#74d1ea]">
                <span className="flex h-2 w-2 bg-[#74d1ea] rounded-full mr-2"></span>
                <span className="text-sm font-medium">Our Values</span>
              </div>
              <h2 className="text-3xl font-bold text-white mb-6">
                Principles that guide our innovation
              </h2>
              <p className="text-gray-300 text-lg mb-6">
                Our values shape everything we do at Tovably, from product development to customer service. 
                They represent our commitment to excellence and our vision for the future of communication.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-900/30 backdrop-blur-sm rounded-lg p-6 border border-gray-700/60 shadow-[0_0_15px_rgba(116,209,234,0.15)]">
                <h3 className="text-xl font-medium text-[#74d1ea] mb-3">Innovation</h3>
                <p className="text-gray-300">
                  We push the boundaries of what's possible with AI and language analysis, continually 
                  evolving our platform to deliver new capabilities and insights.
                </p>
              </div>
              
              <div className="bg-gray-900/30 backdrop-blur-sm rounded-lg p-6 border border-gray-700/60 shadow-[0_0_15px_rgba(116,209,234,0.15)]">
                <h3 className="text-xl font-medium text-[#74d1ea] mb-3">Accessibility</h3>
                <p className="text-gray-300">
                  We make sophisticated communication technology accessible to all businesses, 
                  regardless of size or technical expertise.
                </p>
              </div>
              
              <div className="bg-gray-900/30 backdrop-blur-sm rounded-lg p-6 border border-gray-700/60 shadow-[0_0_15px_rgba(116,209,234,0.15)]">
                <h3 className="text-xl font-medium text-[#74d1ea] mb-3">Quality</h3>
                <p className="text-gray-300">
                  We're committed to excellence in every aspect of our platform, from the accuracy of 
                  our analysis to the usability of our interface.
                </p>
              </div>
              
              <div className="bg-gray-900/30 backdrop-blur-sm rounded-lg p-6 border border-gray-700/60 shadow-[0_0_15px_rgba(116,209,234,0.15)]">
                <h3 className="text-xl font-medium text-[#74d1ea] mb-3">Transparency</h3>
                <p className="text-gray-300">
                  We believe in open communication with our users, providing clear explanations of 
                  how our technology works and how it can benefit their business.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Our Team Section */}
      <div className="bg-black py-20 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center mb-4 text-[#74d1ea]">
              <span className="flex h-2 w-2 bg-[#74d1ea] rounded-full mr-2"></span>
              <span className="text-sm font-medium">Our Team</span>
            </div>
            <h2 className="text-3xl font-bold text-white mb-6">
              The minds behind Tovably
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Tovably is powered by a diverse team of communication experts, AI specialists, designers, 
              and developers from across the UK and Europe.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-gray-900/30 backdrop-blur-sm rounded-lg overflow-hidden border border-gray-700/60 shadow-[0_0_15px_rgba(116,209,234,0.15)]">
              <div className="h-60 bg-gradient-to-b from-[#74d1ea]/20 to-black flex items-center justify-center">
                <div className="h-24 w-24 bg-[#74d1ea]/10 rounded-full flex items-center justify-center border border-[#74d1ea]/30">
                  <Users className="h-12 w-12 text-[#74d1ea]" />
                </div>
              </div>
              <div className="p-6 text-center">
                <h3 className="text-xl font-medium text-white mb-1">Sarah Mitchell</h3>
                <p className="text-[#74d1ea] text-sm mb-4">Founder & CEO</p>
                <p className="text-gray-300 text-sm">
                  Communication strategist with 15+ years experience in brand development.
                </p>
              </div>
            </div>
            
            <div className="bg-gray-900/30 backdrop-blur-sm rounded-lg overflow-hidden border border-gray-700/60 shadow-[0_0_15px_rgba(116,209,234,0.15)]">
              <div className="h-60 bg-gradient-to-b from-[#74d1ea]/20 to-black flex items-center justify-center">
                <div className="h-24 w-24 bg-[#74d1ea]/10 rounded-full flex items-center justify-center border border-[#74d1ea]/30">
                  <Code className="h-12 w-12 text-[#74d1ea]" />
                </div>
              </div>
              <div className="p-6 text-center">
                <h3 className="text-xl font-medium text-white mb-1">David Chen</h3>
                <p className="text-[#74d1ea] text-sm mb-4">CTO</p>
                <p className="text-gray-300 text-sm">
                  AI specialist with background in computational linguistics and machine learning.
                </p>
              </div>
            </div>
            
            <div className="bg-gray-900/30 backdrop-blur-sm rounded-lg overflow-hidden border border-gray-700/60 shadow-[0_0_15px_rgba(116,209,234,0.15)]">
              <div className="h-60 bg-gradient-to-b from-[#74d1ea]/20 to-black flex items-center justify-center">
                <div className="h-24 w-24 bg-[#74d1ea]/10 rounded-full flex items-center justify-center border border-[#74d1ea]/30">
                  <Sparkles className="h-12 w-12 text-[#74d1ea]" />
                </div>
              </div>
              <div className="p-6 text-center">
                <h3 className="text-xl font-medium text-white mb-1">Emma Rodriguez</h3>
                <p className="text-[#74d1ea] text-sm mb-4">Head of Product</p>
                <p className="text-gray-300 text-sm">
                  Product design expert focused on creating intuitive user experiences.
                </p>
              </div>
            </div>
            
            <div className="bg-gray-900/30 backdrop-blur-sm rounded-lg overflow-hidden border border-gray-700/60 shadow-[0_0_15px_rgba(116,209,234,0.15)]">
              <div className="h-60 bg-gradient-to-b from-[#74d1ea]/20 to-black flex items-center justify-center">
                <div className="h-24 w-24 bg-[#74d1ea]/10 rounded-full flex items-center justify-center border border-[#74d1ea]/30">
                  <Globe className="h-12 w-12 text-[#74d1ea]" />
                </div>
              </div>
              <div className="p-6 text-center">
                <h3 className="text-xl font-medium text-white mb-1">James Wilson</h3>
                <p className="text-[#74d1ea] text-sm mb-4">Growth Director</p>
                <p className="text-gray-300 text-sm">
                  Marketing strategist specializing in SaaS and technology companies.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="bg-black py-20 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#74d1ea] to-[#74d1ea]/30 rounded-lg blur-md opacity-30"></div>
            <div className="relative border border-gray-700/60 rounded-lg py-16 px-8 shadow-[0_0_30px_rgba(116,209,234,0.20)] text-center">
              <h2 className="text-3xl font-bold text-white mb-6">
                Ready to transform your brand communications?
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                Join the growing community of businesses using Tovably to refine their tone of voice 
                and create more impactful content.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link href="/pricing">
                  <Button className="bg-[#74d1ea] hover:bg-[#74d1ea]/80 text-black font-medium px-8 py-3 text-lg">
                    View Pricing Options
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline" className="border-[#74d1ea] text-[#74d1ea] hover:bg-[#74d1ea]/10 px-8 py-3 text-lg">
                    Contact Us
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}