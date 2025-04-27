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
      <div className="relative py-16 sm:py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center lg:text-left">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-6">
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-900/30 text-primary mb-4">
                <span className="h-2 w-2 rounded-full bg-primary mr-2"></span>
                Tone Analysis & Content Generator
              </div>
              <h1 className="text-4xl tracking-tight font-extrabold sm:text-5xl md:text-6xl">
                <span className="block">Transform your</span>
                <span className="block text-primary">content strategy</span>
              </h1>
              <p className="mt-3 text-base text-muted-foreground sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                Analyze your brand's tone of voice, target specific personas, and generate perfectly tailored content for LinkedIn and cold emails.
              </p>
              <div className="mt-8 sm:mt-12">
                <div className="rounded-md">
                  <Button 
                    onClick={handleGetStarted}
                    className="w-full sm:w-auto px-8 py-3 md:py-4 md:text-lg md:px-10"
                  >
                    Get started free
                  </Button>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">
                  No credit card required. Start generating in minutes.
                </p>
              </div>
            </div>
            <div className="mt-12 lg:mt-0 lg:col-span-6">
              <div className="relative mx-auto w-full rounded-lg overflow-hidden bg-card border border-border shadow-xl">
                <div className="aspect-w-16 aspect-h-9 lg:aspect-none relative">
                  <img 
                    className="h-full w-full object-cover rounded-t-lg" 
                    src="https://images.unsplash.com/photo-1542744173-05336fcc7ad4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
                    alt="Content analysis dashboard" 
                  />
                  <div className="p-5 bg-gradient-to-t from-background to-transparent absolute bottom-0 left-0 right-0">
                    <p className="text-sm font-medium">Tone analysis in action</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-12 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold sm:text-4xl">
              <span className="block">How it works</span>
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-muted-foreground mx-auto">
              Generate content that resonates with your audience in three simple steps.
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="pt-6 relative">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary rounded-full h-12 w-12 flex items-center justify-center">
                  <span className="text-white font-bold">1</span>
                </div>
                <div className="bg-background rounded-lg px-6 pb-8 h-full flex flex-col">
                  <h3 className="mt-8 text-xl font-medium tracking-tight">Upload your content</h3>
                  <p className="mt-4 flex-grow text-base text-muted-foreground">
                    Enter your website URL or upload examples of your content for tone analysis.
                  </p>
                  <div className="mt-4 flex items-center">
                    <FileText className="h-8 w-8 text-primary" />
                  </div>
                </div>
              </div>

              <div className="pt-6 relative">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary rounded-full h-12 w-12 flex items-center justify-center">
                  <span className="text-white font-bold">2</span>
                </div>
                <div className="bg-background rounded-lg px-6 pb-8 h-full flex flex-col">
                  <h3 className="mt-8 text-xl font-medium tracking-tight">Select target personas</h3>
                  <p className="mt-4 flex-grow text-base text-muted-foreground">
                    Choose from a range of professional personas that match your target audience.
                  </p>
                  <div className="mt-4 flex items-center">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                </div>
              </div>

              <div className="pt-6 relative">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary rounded-full h-12 w-12 flex items-center justify-center">
                  <span className="text-white font-bold">3</span>
                </div>
                <div className="bg-background rounded-lg px-6 pb-8 h-full flex flex-col">
                  <h3 className="mt-8 text-xl font-medium tracking-tight">Generate tailored content</h3>
                  <p className="mt-4 flex-grow text-base text-muted-foreground">
                    Create LinkedIn posts and cold emails that match your tone and resonate with your target personas.
                  </p>
                  <div className="mt-4 flex items-center">
                    <PenTool className="h-8 w-8 text-primary" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div id="testimonials" className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold sm:text-4xl">
              <span className="block">Trusted by content professionals</span>
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-muted-foreground mx-auto">
              See what marketing teams are saying about ContentPersona.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="bg-card rounded-lg p-6 border border-border">
              <div className="flex items-center mb-4">
                <div className="text-primary">
                  {[...Array(5)].map((_, i) => (
                    <i key={i} className="fas fa-star"></i>
                  ))}
                </div>
              </div>
              <p className="text-muted-foreground mb-4">
                "ContentPersona has transformed how we approach our LinkedIn content strategy. The tone analysis is spot-on and the content generation saves us hours every week."
              </p>
              <div className="flex items-center">
                <img 
                  className="h-10 w-10 rounded-full" 
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                  alt="Testimonial from Sarah Johnson" 
                />
                <div className="ml-3">
                  <p className="text-sm font-medium">Sarah Johnson</p>
                  <p className="text-xs text-muted-foreground">Marketing Director, TechCorp</p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg p-6 border border-border">
              <div className="flex items-center mb-4">
                <div className="text-primary">
                  {[...Array(5)].map((_, i) => (
                    <i key={i} className="fas fa-star"></i>
                  ))}
                </div>
              </div>
              <p className="text-muted-foreground mb-4">
                "Our cold email response rates have increased by 37% since we started using ContentPersona. The persona targeting feature is incredibly effective."
              </p>
              <div className="flex items-center">
                <img 
                  className="h-10 w-10 rounded-full" 
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                  alt="Testimonial from Michael Chen" 
                />
                <div className="ml-3">
                  <p className="text-sm font-medium">Michael Chen</p>
                  <p className="text-xs text-muted-foreground">Sales Manager, GrowthFirm</p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg p-6 border border-border">
              <div className="flex items-center mb-4">
                <div className="text-primary">
                  {[...Array(4)].map((_, i) => (
                    <i key={i} className="fas fa-star"></i>
                  ))}
                  <i className="fas fa-star-half-alt"></i>
                </div>
              </div>
              <p className="text-muted-foreground mb-4">
                "As a content team of one, ContentPersona gives me the ability to scale my output while maintaining a consistent brand voice across all channels."
              </p>
              <div className="flex items-center">
                <img 
                  className="h-10 w-10 rounded-full" 
                  src="https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                  alt="Testimonial from Emma Rodriguez" 
                />
                <div className="ml-3">
                  <p className="text-sm font-medium">Emma Rodriguez</p>
                  <p className="text-xs text-muted-foreground">Content Creator, Startup Inc.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-gradient-to-r from-green-900/30 to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-card rounded-lg shadow-xl overflow-hidden lg:grid lg:grid-cols-2 lg:gap-4">
            <div className="pt-10 pb-12 px-6 sm:pt-16 sm:px-16 lg:py-16 lg:pr-0 xl:py-20 xl:px-20">
              <div className="lg:self-center">
                <h2 className="text-3xl font-extrabold sm:text-4xl">
                  <span className="block">Ready to transform your</span>
                  <span className="block text-primary">content strategy?</span>
                </h2>
                <p className="mt-4 text-lg text-muted-foreground">
                  Start generating perfectly tailored LinkedIn posts and cold emails today.
                </p>
                <Button
                  onClick={handleGetStarted}
                  className="mt-8"
                >
                  Get started for free
                </Button>
              </div>
            </div>
            <div className="relative aspect-video md:aspect-auto">
              <img 
                className="transform translate-x-6 translate-y-6 rounded-md object-cover object-left-top sm:translate-x-16 lg:translate-y-20" 
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
                alt="App screenshot" 
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
