import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  Brain, 
  User, 
  BarChart3, 
  Target, 
  LineChart, 
  Settings, 
  MessageCircle,
  Lock,
  LucideIcon,
  ChevronRight,
  Layers
} from "lucide-react";

interface DifferentiatorCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  accent: string;
}

function DifferentiatorCard({ title, description, icon: Icon, accent }: DifferentiatorCardProps) {
  return (
    <div className="p-6 border border-gray-800 rounded-lg bg-gray-900/50 backdrop-blur-sm">
      <div className={`w-12 h-12 rounded-full ${accent} flex items-center justify-center mb-4`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
      <p className="text-gray-300 leading-relaxed">{description}</p>
    </div>
  );
}

export default function AIPersonaServicePage() {
  return (
    <>
      <Helmet>
        <title>AI Persona Service | Tovably</title>
        <meta
          name="description"
          content="Create detailed, customized personas using OpenAI technology. Understand your ideal customers deeply with Tovably's AI Persona Service."
        />
      </Helmet>

      <div className="min-h-screen bg-black text-white flex flex-col">
        <Navbar />

        <main className="flex-grow">
          {/* Hero Section */}
          <section className="relative pt-28 pb-20 overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6 relative z-10">
              {/* Subtle background effects */}
              <div className="absolute inset-0 z-0">
                <div className="absolute top-20 right-10 w-72 h-72 bg-blue-500/10 rounded-full filter blur-3xl"></div>
                <div className="absolute bottom-10 left-10 w-80 h-80 bg-indigo-500/10 rounded-full filter blur-3xl"></div>
              </div>
              
              <div className="text-left mb-4 relative">
                <div className="inline-flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <div className="text-blue-400 text-sm font-medium">Tovably AI Personas</div>
                </div>
              </div>

              <div className="max-w-3xl relative">
                <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white tracking-tight leading-tight">
                  Understand how your brand's <span className="text-blue-400">personas</span> connects with your audience
                </h1>
                <p className="text-lg text-gray-300 max-w-2xl leading-relaxed">
                  Analyze your content's tone, uncover patterns in your communication style, 
                  and discover how to enhance your brand's presence through precise language.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 mt-8">
                  <Button 
                    className="bg-blue-400 hover:bg-blue-500 text-black text-sm font-medium py-2.5 px-5 rounded-md"
                  >
                    Get started
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-gray-600 text-white hover:bg-gray-800 text-sm font-medium py-2.5 px-5 rounded-md"
                  >
                    Contact us
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* What Makes Us Different Section */}
          <section className="py-20 bg-black">
            <div className="container mx-auto px-4 sm:px-6">
              <div className="max-w-3xl mx-auto text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                  What Makes Our <span className="text-blue-400">Approach Different</span>
                </h2>
                <p className="text-gray-300 text-lg">
                  Tovably's AI personas go beyond basic demographics and segmentation, combining 
                  psychological profiling with advanced data analysis to create truly actionable insights.
                </p>
              </div>

              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                <DifferentiatorCard 
                  title="Psychological Depth"
                  description="Our personas include detailed psychological profiles based on behavioral science, rather than just demographic data points."
                  icon={Brain}
                  accent="bg-blue-600"
                />
                
                <DifferentiatorCard 
                  title="Multi-layered Analysis"
                  description="We analyze personas across 7 different dimensions to create holistic profiles that capture the full complexity of your audience."
                  icon={Layers}
                  accent="bg-purple-600"
                />
                
                <DifferentiatorCard 
                  title="Actionable Insights"
                  description="Every persona comes with specific messaging recommendations and content strategies tailored to their unique decision-making process."
                  icon={Target}
                  accent="bg-green-600"
                />
                
                <DifferentiatorCard 
                  title="Real-Time Adaptation"
                  description="Our personas evolve as markets change, integrating new data points to ensure your targeting stays relevant and effective."
                  icon={LineChart}
                  accent="bg-amber-600"
                />
                
                <DifferentiatorCard 
                  title="Cross-Channel Strategy"
                  description="Each persona includes specific channel preferences and content format recommendations to optimize your multi-channel approach."
                  icon={MessageCircle}
                  accent="bg-pink-600"
                />
                
                <DifferentiatorCard 
                  title="Privacy-First Design"
                  description="Unlike competitors who scrape personal data, our personas are generated using ethical AI techniques that respect privacy regulations."
                  icon={Lock}
                  accent="bg-teal-600"
                />
              </div>

              <div className="mt-16 text-center">
                <a href="#explore" className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors">
                  <span className="font-medium">See how our technology works</span>
                  <ChevronRight className="w-4 h-4 ml-1" />
                </a>
              </div>
            </div>
          </section>
          
          {/* Real Business Impact Section */}
          <section className="py-20 bg-gray-900">
            <div className="container mx-auto px-4 sm:px-6">
              <div className="max-w-3xl mx-auto text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                  Real <span className="text-blue-400">Business Impact</span>
                </h2>
                <p className="text-gray-300 text-lg">
                  Companies using our advanced persona technology see measurable improvements 
                  in campaign performance, engagement rates, and conversion metrics.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-black/40 backdrop-blur-sm p-8 rounded-lg border border-gray-800 text-center">
                  <div className="text-4xl md:text-5xl font-bold text-blue-400 mb-2">37%</div>
                  <p className="text-white font-medium mb-1">Higher Conversion Rates</p>
                  <p className="text-gray-400 text-sm">When messaging is aligned with our AI persona insights</p>
                </div>
                
                <div className="bg-black/40 backdrop-blur-sm p-8 rounded-lg border border-gray-800 text-center">
                  <div className="text-4xl md:text-5xl font-bold text-blue-400 mb-2">3.8x</div>
                  <p className="text-white font-medium mb-1">More Engagement</p>
                  <p className="text-gray-400 text-sm">On content created with persona-specific recommendations</p>
                </div>
                
                <div className="bg-black/40 backdrop-blur-sm p-8 rounded-lg border border-gray-800 text-center">
                  <div className="text-4xl md:text-5xl font-bold text-blue-400 mb-2">41%</div>
                  <p className="text-white font-medium mb-1">Lower Cost Per Acquisition</p>
                  <p className="text-gray-400 text-sm">Through targeted messaging and personalized strategies</p>
                </div>
              </div>
              
              <div className="mt-16 bg-black/30 backdrop-blur-sm border border-gray-800 rounded-xl p-6 md:p-8">
                <div className="flex flex-col md:flex-row items-start md:items-center">
                  <div className="md:flex-1">
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-3">How Our AI Personas Drive Results</h3>
                    <p className="text-gray-300 mb-6 md:mb-0 md:mr-8">
                      By providing deeper psychological profiles and motivation analysis, marketers can create hyper-targeted 
                      content that resonates on a personal level with each segment of their audience.
                    </p>
                  </div>
                  <div className="w-full md:w-auto">
                    <Button className="w-full md:w-auto bg-blue-500 hover:bg-blue-600 text-white font-medium py-2.5 px-6 rounded-md">
                      View Case Studies
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}