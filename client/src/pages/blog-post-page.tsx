import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Link, useRoute } from "wouter";
import { ArrowLeft, Calendar, User, Tag, Share2, Twitter, Linkedin, FacebookIcon, MailIcon } from "lucide-react";

export default function BlogPostPage() {
  const [, params] = useRoute("/blog/:id");
  const postId = params?.id;
  const [isShareMenuOpen, setIsShareMenuOpen] = useState(false);

  // This would normally be fetched from an API based on the postId
  const post = {
    id: postId,
    title: "The Evolution of AI-Generated Content for Marketing",
    date: "April 25, 2025",
    author: {
      name: "Emma Wilson",
      avatar: "",
      title: "Senior Content Strategist"
    },
    category: "Technology",
    readTime: "6 min read",
    content: `
      <p class="mb-4 text-lg">Artificial intelligence has fundamentally transformed how marketing teams approach content creation, enabling unprecedented levels of personalization, efficiency, and analysis.</p>
      
      <p class="mb-4">For decades, content creation was largely a manual process, requiring significant time investment from skilled writers and creatives. While the quality was often high, the approach was inherently limited in scale and customization. The emergence of AI-powered content tools has changed this paradigm.</p>
      
      <h2 class="text-2xl font-semibold text-white mt-8 mb-4">The Current State of AI-Generated Marketing Content</h2>
      
      <p class="mb-4">Today's AI tools can generate everything from email campaigns and social media posts to long-form articles and product descriptions. These tools analyze vast datasets of successful content, understanding patterns in engagement, tone, and effectiveness across different audience segments.</p>
      
      <p class="mb-4">The most sophisticated platforms now offer:</p>
      
      <ul class="list-disc pl-5 mb-6 space-y-2 text-gray-300">
        <li>Personalized content generation based on user behavior and preferences</li>
        <li>Tone analysis to ensure brand consistency across all communications</li>
        <li>Multilingual capabilities that maintain nuance across languages</li>
        <li>SEO optimization built directly into the generation process</li>
        <li>Content adaptation for multiple formats and platforms</li>
      </ul>
      
      <h2 class="text-2xl font-semibold text-white mt-8 mb-4">Challenges and Ethical Considerations</h2>
      
      <p class="mb-4">Despite these advancements, the rise of AI-generated content brings important considerations. Content authenticity, intellectual property questions, and the potential for reduced diversity of expression are all valid concerns as organizations increasingly rely on algorithms for creative work.</p>
      
      <p class="mb-4">The most successful implementations of AI content tools have found a balance—using technology to handle routine content needs while maintaining human oversight for strategy, creativity, and emotional intelligence that AI still struggles to replicate authentically.</p>
      
      <h2 class="text-2xl font-semibold text-white mt-8 mb-4">The Human-AI Collaboration Model</h2>
      
      <p class="mb-4">Moving forward, the most effective content strategies will likely center on human-AI collaboration. In this model, AI handles content generation, optimization, and performance analytics, while human creators focus on strategy, creative direction, and injecting the authentic brand voice that resonates on a human level.</p>
      
      <p class="mb-4">This collaboration allows marketing teams to dramatically increase their output while maintaining quality and strategic alignment. It also frees creative professionals from repetitive tasks, enabling them to focus on higher-value content initiatives.</p>
      
      <h2 class="text-2xl font-semibold text-white mt-8 mb-4">Looking Ahead: The Future of Content Generation</h2>
      
      <p class="mb-4">As AI systems continue to evolve, we can expect even more sophisticated capabilities in the coming years. Multimodal content generation—creating cohesive campaigns across text, image, video, and interactive formats—represents the next frontier for marketing AI.</p>
      
      <p class="mb-4">Organizations that strategically implement these technologies while maintaining their unique brand voices will gain significant advantages in content personalization, production efficiency, and marketing effectiveness.</p>
      
      <p class="mb-4">The evolution of AI-generated content isn't about replacing human creativity—it's about augmenting it, scaling it, and allowing marketers to connect with audiences in more personalized and efficient ways than ever before.</p>
    `,
    relatedPosts: [
      {
        id: 2,
        title: "Introducing Enhanced Tone Analysis Features",
        excerpt: "We are excited to announce new tone analysis capabilities that help you better understand audience perception.",
        category: "Product"
      },
      {
        id: 3,
        title: "5 Ways to Optimize Your LinkedIn Content Strategy",
        excerpt: "Learn how to leverage data-driven insights to create more engaging content that resonates with your audience.",
        category: "Strategy"
      }
    ]
  };

  useEffect(() => {
    // Scroll to top when page loads
    window.scrollTo(0, 0);
  }, []);

  return (
    <Layout>
      <div className="bg-black min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Breadcrumbs */}
          <div className="mb-8">
            <Link href="/blog">
              <a className="inline-flex items-center text-gray-400 hover:text-[#74d1ea]">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Blog
              </a>
            </Link>
          </div>

          {/* Article Header */}
          <article>
            <header className="mb-8 pb-8 border-b border-gray-800">
              <h1 className="text-3xl md:text-4xl font-semibold text-white mb-6">
                {post.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
                <div className="flex items-center text-gray-400">
                  <User className="h-4 w-4 mr-2" />
                  <span>{post.author.name}</span>
                </div>
                <div className="flex items-center text-gray-400">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>{post.date}</span>
                </div>
                <div className="flex items-center text-[#74d1ea]">
                  <Tag className="h-4 w-4 mr-2" />
                  <span>{post.category}</span>
                </div>
                <div className="text-gray-400">
                  {post.readTime}
                </div>
                
                {/* Share Menu */}
                <div className="relative ml-auto">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-gray-400 hover:text-white"
                    onClick={() => setIsShareMenuOpen(!isShareMenuOpen)}
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                  
                  {isShareMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-gray-900 ring-1 ring-black ring-opacity-5 p-1 z-50 border border-gray-700">
                      <div className="py-1">
                        <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white rounded-md">
                          <Twitter className="h-4 w-4 mr-3 text-[#74d1ea]" />
                          Twitter
                        </a>
                        <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white rounded-md">
                          <Linkedin className="h-4 w-4 mr-3 text-[#74d1ea]" />
                          LinkedIn
                        </a>
                        <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white rounded-md">
                          <FacebookIcon className="h-4 w-4 mr-3 text-[#74d1ea]" />
                          Facebook
                        </a>
                        <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white rounded-md">
                          <MailIcon className="h-4 w-4 mr-3 text-[#74d1ea]" />
                          Email
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </header>

            {/* Article Content */}
            <div 
              className="prose prose-invert prose-lg max-w-none prose-headings:text-white prose-p:text-gray-300"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Author Bio */}
            <div className="mt-12 p-6 bg-gray-900/30 rounded-lg border border-gray-700/60 shadow-[0_0_15px_rgba(116,209,234,0.15)]">
              <div className="flex items-start">
                <Avatar className="h-12 w-12 bg-gray-700 text-white">
                  <div className="uppercase">{post.author.name.charAt(0)}</div>
                </Avatar>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-white">{post.author.name}</h3>
                  <p className="text-[#74d1ea]">{post.author.title}</p>
                  <p className="mt-2 text-gray-400">
                    Emma specializes in content strategy for technology companies, with a focus on AI-driven marketing solutions. With over 10 years of experience in digital marketing, she helps brands leverage new technologies to enhance their content strategies.
                  </p>
                </div>
              </div>
            </div>
          </article>

          {/* Related Posts */}
          <div className="mt-16">
            <h2 className="text-2xl font-semibold text-white mb-6">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {post.relatedPosts.map((relatedPost) => (
                <Link key={relatedPost.id} href={`/blog/${relatedPost.id}`}>
                  <a className="block group">
                    <div className="border-t border-[#74d1ea]/30 pt-6">
                      <div className="text-[#74d1ea] text-sm mb-2">{relatedPost.category}</div>
                      <h3 className="text-xl font-medium text-white mb-2 group-hover:text-[#74d1ea] transition-colors">
                        {relatedPost.title}
                      </h3>
                      <p className="text-gray-400 mb-3">{relatedPost.excerpt}</p>
                      <div className="flex items-center text-[#74d1ea]">
                        <span className="mr-2">Read more</span>
                        <ArrowLeft className="h-4 w-4 rotate-180" />
                      </div>
                    </div>
                  </a>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}