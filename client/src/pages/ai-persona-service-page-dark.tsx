import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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
              <div className="text-left mb-4">
                <div className="inline-flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <div className="text-blue-400 text-sm font-medium">Tovably AI Personas</div>
                </div>
              </div>

              <div className="max-w-3xl">
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
        </main>

        <Footer />
      </div>
    </>
  );
}