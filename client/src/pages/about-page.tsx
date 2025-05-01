import { Helmet } from "react-helmet";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function AboutPage() {
  return (
    <Layout>
      <Helmet>
        <title>About | Tovably</title>
        <meta name="description" content="Learn about Tovably's mission to revolutionize brand communication with AI-powered tone analysis and content generation." />
      </Helmet>
      
      <div className="max-w-4xl mx-auto py-16 px-6">
        <h1 className="text-4xl font-semibold mb-8 text-center">About Tovably</h1>
        
        <div className="prose prose-invert max-w-none">
          <section className="mb-12">
            <h2 className="text-2xl font-medium mb-4">Our Mission</h2>
            <p className="text-gray-300">
              At Tovably, we're on a mission to revolutionize how brands communicate. We believe that 
              every brand has a unique voice that, when properly understood and consistently applied, 
              creates deeper connections with audiences. Our AI-powered platform is designed to help 
              businesses identify, refine, and leverage their distinctive tone of voice across all 
              communication channels.
            </p>
          </section>
          
          <section className="mb-12">
            <h2 className="text-2xl font-medium mb-4">Our Story</h2>
            <p className="text-gray-300">
              Tovably was born from a simple observation: even the most innovative companies struggle 
              to maintain a consistent tone of voice across their communications. This inconsistency 
              creates disconnects with audiences and weakens brand perception.
            </p>
            <p className="text-gray-300 mt-4">
              Founded by a team of communication experts and AI specialists, we set out to build a 
              solution that would make sophisticated tone of voice analysis and content generation 
              accessible to businesses of all sizes. After months of research, development, and testing, 
              Tovably emerged as a powerful yet intuitive platform that helps brands speak with clarity, 
              consistency, and conviction.
            </p>
          </section>
          
          <section className="mb-12">
            <h2 className="text-2xl font-medium mb-4">Our Approach</h2>
            <p className="text-gray-300">
              We take a human-centered approach to AI. Our technology is designed to enhance human 
              creativity, not replace it. We believe that the most effective communication comes from 
              the perfect balance of AI-powered analysis and human insight.
            </p>
            <p className="text-gray-300 mt-4">
              Our platform combines cutting-edge natural language processing with intuitive design to 
              deliver powerful insights in an accessible format. We're committed to continuous improvement, 
              regularly refining our algorithms based on user feedback and evolving communication trends.
            </p>
          </section>
          
          <section className="mb-12">
            <h2 className="text-2xl font-medium mb-4">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-800">
                <h3 className="text-xl font-medium text-[#74d1ea] mb-2">Innovation</h3>
                <p className="text-gray-300">
                  We push the boundaries of what's possible with AI and language analysis, continually 
                  evolving our platform to deliver new capabilities and insights.
                </p>
              </div>
              
              <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-800">
                <h3 className="text-xl font-medium text-[#74d1ea] mb-2">Accessibility</h3>
                <p className="text-gray-300">
                  We make sophisticated communication technology accessible to all businesses, 
                  regardless of size or technical expertise.
                </p>
              </div>
              
              <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-800">
                <h3 className="text-xl font-medium text-[#74d1ea] mb-2">Quality</h3>
                <p className="text-gray-300">
                  We're committed to excellence in every aspect of our platform, from the accuracy of 
                  our analysis to the usability of our interface.
                </p>
              </div>
              
              <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-800">
                <h3 className="text-xl font-medium text-[#74d1ea] mb-2">Transparency</h3>
                <p className="text-gray-300">
                  We believe in open communication with our users, providing clear explanations of 
                  how our technology works and how it can benefit their business.
                </p>
              </div>
            </div>
          </section>
          
          <section className="mb-12">
            <h2 className="text-2xl font-medium mb-4">Our Team</h2>
            <p className="text-gray-300">
              Tovably is powered by a diverse team of communication experts, AI specialists, designers, 
              and developers. United by a passion for effective communication, we bring together expertise 
              from various fields to create a truly innovative platform.
            </p>
            <p className="text-gray-300 mt-4">
              We're headquartered in London, with team members distributed across the UK and Europe.
            </p>
          </section>
        </div>
        
        <div className="mt-12 bg-zinc-900 p-8 rounded-lg border border-zinc-800 text-center">
          <h2 className="text-2xl font-medium mb-4">Ready to transform your brand communications?</h2>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Join the growing community of businesses using Tovably to refine their tone of voice 
            and create more impactful content.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/pricing">
              <Button className="bg-[#74d1ea] hover:bg-[#74d1ea]/80 text-black font-medium px-6 py-2">
                View Pricing Options
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" className="border-[#74d1ea] text-[#74d1ea] hover:bg-[#74d1ea]/10">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}