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
      <div className="relative py-16 sm:py-24 lg:py-32 bg-black">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-900/30 text-primary mb-6">
            <span className="h-2 w-2 rounded-full bg-primary mr-2"></span>
            Tone Analysis & Content Generator
          </div>
          <h1 className="text-4xl tracking-tight font-extrabold sm:text-5xl md:text-6xl max-w-4xl mx-auto">
            <span className="block text-white">Transform your</span>
            <span className="block text-primary">content strategy</span>
          </h1>
          <p className="mt-6 text-base text-gray-400 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl max-w-3xl mx-auto">
            Analyze your brand's tone of voice, target specific personas, and 
            generate perfectly tailored content for LinkedIn and cold emails.
          </p>
          <div className="mt-8 sm:mt-12 flex flex-col items-center">
            <div className="rounded-md">
              <Button 
                onClick={handleGetStarted}
                className="w-full sm:w-auto px-8 py-3 md:py-4 md:text-lg md:px-10 bg-green-600 hover:bg-green-700"
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
      <div id="features" className="py-16 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold sm:text-4xl text-white">
              <span className="block">How it works</span>
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-400 mx-auto">
              Generate content that resonates with your audience in three simple steps.
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
              <div className="text-center">
                <div className="bg-green-600 rounded-full h-14 w-14 flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-lg">1</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Upload your content</h3>
                <p className="text-gray-400 mb-6">
                  Enter your website URL or upload examples of your content for tone analysis.
                </p>
                <div className="flex justify-center">
                  <FileText className="h-10 w-10 text-green-500" />
                </div>
              </div>

              <div className="text-center">
                <div className="bg-green-600 rounded-full h-14 w-14 flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-lg">2</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Select target personas</h3>
                <p className="text-gray-400 mb-6">
                  Choose from a range of professional personas that match your target audience.
                </p>
                <div className="flex justify-center">
                  <Users className="h-10 w-10 text-green-500" />
                </div>
              </div>

              <div className="text-center">
                <div className="bg-green-600 rounded-full h-14 w-14 flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-lg">3</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Generate tailored content</h3>
                <p className="text-gray-400 mb-6">
                  Create LinkedIn posts and cold emails that match your tone and resonate with your target personas.
                </p>
                <div className="flex justify-center">
                  <PenTool className="h-10 w-10 text-green-500" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div id="testimonials" className="py-16 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold sm:text-4xl text-white">
              <span className="block">Trusted by content professionals</span>
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-400 mx-auto">
              See what marketing teams are saying about ContentPersona.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="bg-black rounded-lg p-6 border border-gray-800">
              <div className="flex items-center mb-4">
                <div className="text-green-500">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-2xl">★</span>
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

            <div className="bg-black rounded-lg p-6 border border-gray-800">
              <div className="flex items-center mb-4">
                <div className="text-green-500">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-2xl">★</span>
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

            <div className="bg-black rounded-lg p-6 border border-gray-800">
              <div className="flex items-center mb-4">
                <div className="text-green-500">
                  {[...Array(4)].map((_, i) => (
                    <span key={i} className="text-2xl">★</span>
                  ))}
                  <span className="text-2xl">☆</span>
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
      <div className="py-16 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold sm:text-4xl text-white">
            <span className="block mb-2">Ready to transform your</span>
            <span className="block text-green-500">content strategy?</span>
          </h2>
          <p className="mt-6 text-xl text-gray-400 max-w-3xl mx-auto">
            Start generating perfectly tailored LinkedIn posts and cold emails today.
          </p>
          <div className="mt-8">
            <Button
              onClick={handleGetStarted}
              className="px-8 py-3 md:py-4 md:text-lg md:px-10 bg-green-600 hover:bg-green-700"
            >
              Get started for free
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
