import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import { ArrowRight, FileText, Users, PenTool, CheckCircle } from "lucide-react";
import { useEffect } from "react";

export default function HomePage() {
  const { user } = useAuth();
  const [, navigate] = useLocation();

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleGetStarted = () => {
    navigate("/auth");
  };

  return (
    <Layout>
      {/* Hero Section */}
      <div className="relative py-16 sm:py-24 lg:py-32 bg-black overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-5">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
            <defs>
              <pattern id="dot-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1" fill="currentColor" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dot-pattern)" />
          </svg>
        </div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 opacity-10">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fill="#4ADE80" d="M38.6,-65.3C52.9,-60.5,69.3,-54.8,76.9,-43.2C84.5,-31.5,83.4,-15.8,81.3,-1.2C79.3,13.3,76.2,26.6,69.3,38.5C62.3,50.4,51.6,60.9,39.1,65.9C26.5,70.9,13.3,70.5,0.5,69.6C-12.2,68.8,-24.4,67.5,-35.1,62.3C-45.8,57.1,-54.9,48,-60.4,37.3C-65.9,26.5,-67.8,13.3,-68.4,-0.4C-69,-14,-68.3,-28,-62,-39.1C-55.7,-50.2,-43.7,-58.3,-31.3,-63.9C-19,-69.5,-6.3,-72.5,4.5,-70C15.3,-67.6,30.7,-59.9,38.6,-65.3Z" transform="translate(100 100)" />
          </svg>
        </div>
        <div className="absolute -top-24 -left-24 w-96 h-96 opacity-10">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fill="#4ADE80" d="M42.5,-75.1C52.9,-68.5,57.3,-51.1,61.9,-36.1C66.4,-21.1,71.1,-8.5,70.4,3.9C69.8,16.3,63.9,28.3,55.9,40.1C48,51.8,37.9,63.2,25.1,71C12.4,78.8,-3,83.1,-18.8,81.7C-34.5,80.3,-50.5,73.2,-59.6,60.7C-68.7,48.2,-70.9,30.5,-73.4,13.5C-76,-3.4,-78.9,-19.5,-74.2,-33.4C-69.5,-47.2,-57.3,-58.7,-43.4,-63.7C-29.5,-68.7,-14.7,-67.3,1.2,-69.5C17.2,-71.7,34.3,-77.6,42.5,-75.1Z" transform="translate(100 100)" />
          </svg>
        </div>
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-900/20 text-green-400 mb-6">
            <span className="h-2 w-2 rounded-full bg-green-400 mr-2"></span>
            Tone Analysis & Content Generator
          </div>
          <h1 className="text-4xl tracking-tight font-semibold sm:text-5xl md:text-6xl max-w-4xl mx-auto">
            <span className="block text-white">Transform your</span>
            <span className="block text-green-400">content strategy</span>
          </h1>
          <p className="mt-6 text-base text-gray-400 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl max-w-3xl mx-auto">
            Analyze your brand's tone of voice, target specific personas, and 
            generate perfectly tailored content for LinkedIn and cold emails.
          </p>
          <div className="mt-8 sm:mt-12 flex flex-col items-center">
            <div className="rounded-md">
              <Button 
                onClick={handleGetStarted}
                className="w-full sm:w-auto px-8 py-3 md:py-4 md:text-lg md:px-10 bg-green-500/90 hover:bg-green-500"
              >
                Get started free
              </Button>
            </div>
            <p className="mt-3 text-sm text-gray-400">
              No credit card required. Start generating in minutes.
            </p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-16 bg-black relative overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-5">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
            <defs>
              <pattern id="grid-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-pattern)" />
          </svg>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h2 className="text-3xl font-semibold sm:text-4xl text-white">
              <span className="block">How it works</span>
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-400 mx-auto">
              Generate content that resonates with your audience in three simple steps.
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
              <div className="text-center">
                <div className="bg-green-500/30 rounded-full h-14 w-14 flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-medium text-lg">1</span>
                </div>
                <h3 className="text-xl font-medium text-white mb-3">Upload your content</h3>
                <p className="text-gray-400 mb-6">
                  Enter your website URL or upload examples of your content for tone analysis.
                </p>
                <div className="flex justify-center">
                  <FileText className="h-8 w-8 text-green-400/80" />
                </div>
              </div>

              <div className="text-center">
                <div className="bg-green-500/30 rounded-full h-14 w-14 flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-medium text-lg">2</span>
                </div>
                <h3 className="text-xl font-medium text-white mb-3">Select target personas</h3>
                <p className="text-gray-400 mb-6">
                  Choose from a range of professional personas that match your target audience.
                </p>
                <div className="flex justify-center">
                  <Users className="h-8 w-8 text-green-400/80" />
                </div>
              </div>

              <div className="text-center">
                <div className="bg-green-500/30 rounded-full h-14 w-14 flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-medium text-lg">3</span>
                </div>
                <h3 className="text-xl font-medium text-white mb-3">Generate tailored content</h3>
                <p className="text-gray-400 mb-6">
                  Create LinkedIn posts and cold emails that match your tone and resonate with your target personas.
                </p>
                <div className="flex justify-center">
                  <PenTool className="h-8 w-8 text-green-400/80" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div id="testimonials" className="py-16 bg-black relative overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-5">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
            <defs>
              <pattern id="wave-pattern" x="0" y="0" width="100" height="20" patternUnits="userSpaceOnUse">
                <path d="M0 10 Q 12.5 0, 25 10 T 50 10 T 75 10 T 100 10" stroke="currentColor" fill="none" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#wave-pattern)" />
          </svg>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h2 className="text-3xl font-semibold sm:text-4xl text-white">
              <span className="block">Trusted by content professionals</span>
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-400 mx-auto">
              See what marketing teams are saying about ContentPersona.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="bg-gray-900/30 backdrop-blur-sm rounded-lg p-6 border border-gray-800">
              <div className="flex items-center mb-4">
                <div className="text-green-400/90">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-lg">★</span>
                  ))}
                </div>
              </div>
              <p className="text-gray-400 mb-4">
                "ContentPersona has transformed how we approach our LinkedIn content strategy. The tone analysis is spot-on and the content generation saves us hours every week."
              </p>
              <div className="flex items-center">
                <img 
                  className="h-10 w-10 rounded-full" 
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                  alt="Testimonial from Sarah Johnson" 
                />
                <div className="ml-3">
                  <p className="text-sm font-medium text-white">Sarah Johnson</p>
                  <p className="text-xs text-gray-400">Marketing Director, TechCorp</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-900/30 backdrop-blur-sm rounded-lg p-6 border border-gray-800">
              <div className="flex items-center mb-4">
                <div className="text-green-400/90">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-lg">★</span>
                  ))}
                </div>
              </div>
              <p className="text-gray-400 mb-4">
                "Our cold email response rates have increased by 37% since we started using ContentPersona. The persona targeting feature is incredibly effective."
              </p>
              <div className="flex items-center">
                <img 
                  className="h-10 w-10 rounded-full" 
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                  alt="Testimonial from Michael Chen" 
                />
                <div className="ml-3">
                  <p className="text-sm font-medium text-white">Michael Chen</p>
                  <p className="text-xs text-gray-400">Sales Manager, GrowthFirm</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-900/30 backdrop-blur-sm rounded-lg p-6 border border-gray-800">
              <div className="flex items-center mb-4">
                <div className="text-green-400/90">
                  {[...Array(4)].map((_, i) => (
                    <span key={i} className="text-lg">★</span>
                  ))}
                  <span className="text-lg opacity-30">★</span>
                </div>
              </div>
              <p className="text-gray-400 mb-4">
                "As a content team of one, ContentPersona gives me the ability to scale my output while maintaining a consistent brand voice across all channels."
              </p>
              <div className="flex items-center">
                <img 
                  className="h-10 w-10 rounded-full" 
                  src="https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                  alt="Testimonial from Emma Rodriguez" 
                />
                <div className="ml-3">
                  <p className="text-sm font-medium text-white">Emma Rodriguez</p>
                  <p className="text-xs text-gray-400">Content Creator, Startup Inc.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-black relative overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-5">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
            <defs>
              <pattern id="diamond-pattern" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M25,0 L50,25 L25,50 L0,25 Z" stroke="currentColor" strokeWidth="1" fill="none" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#diamond-pattern)" />
          </svg>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl font-semibold sm:text-4xl text-white">
            <span className="block mb-2">Ready to transform your</span>
            <span className="block text-green-400">content strategy?</span>
          </h2>
          <p className="mt-6 text-xl text-gray-400 max-w-3xl mx-auto">
            Start generating perfectly tailored LinkedIn posts and cold emails today.
          </p>
          <div className="mt-8">
            <Button
              onClick={handleGetStarted}
              className="px-8 py-3 md:py-4 md:text-lg md:px-10 bg-green-500/80 hover:bg-green-500"
            >
              Get started free
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
