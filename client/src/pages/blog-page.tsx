import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { Link } from "wouter";
import { ArrowRight, RssIcon } from "lucide-react";

// Blog post types
interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  author: {
    name: string;
    avatar: string;
  };
  category: string;
  imageUrl?: string;
}

export default function BlogPage() {
  // Sample blog posts data
  const blogPosts: BlogPost[] = [
    {
      id: 1,
      title: "The Evolution of AI-Generated Content for Marketing",
      excerpt: "How artificial intelligence is transforming content creation for marketers, enabling personalization at scale and automating routine tasks.",
      date: "April 25, 2025",
      author: {
        name: "Emma Wilson",
        avatar: "",
      },
      category: "Technology",
    },
    {
      id: 2,
      title: "Introducing Enhanced Tone Analysis Features",
      excerpt: "We are excited to announce new tone analysis capabilities that help you better understand audience perception of your messaging across channels.",
      date: "April 18, 2025",
      author: {
        name: "Michael Chen",
        avatar: "",
      },
      category: "Product",
    },
    {
      id: 3,
      title: "5 Ways to Optimize Your LinkedIn Content Strategy",
      excerpt: "Learn how to leverage data-driven insights to create more engaging content that resonates with your professional audience on LinkedIn.",
      date: "April 10, 2025",
      author: {
        name: "Sarah Johnson",
        avatar: "",
      },
      category: "Strategy",
    },
    {
      id: 4,
      title: "The Psychology Behind Effective Email Communication",
      excerpt: "Understanding how tone, timing, and personalization affect email engagement rates and how to apply these insights to your campaigns.",
      date: "April 3, 2025",
      author: {
        name: "David Rodriguez",
        avatar: "",
      },
      category: "Research",
    },
  ];

  return (
    <Layout>
      <div className="bg-black min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Blog Header */}
          <div className="pb-12 border-b border-gray-800 flex justify-between items-center">
            <div>
              <div className="text-gray-400 mb-3">Blog</div>
              <h1 className="text-4xl md:text-5xl font-semibold text-white mb-3">
                News and Updates about <span className="text-[#74d1ea]">Tovably</span>
              </h1>
            </div>
            <a href="#" className="hidden md:flex items-center text-gray-400 hover:text-[#74d1ea]">
              <RssIcon className="h-4 w-4 mr-2" />
              RSS Feed
            </a>
          </div>

          {/* Blog Grid */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-12">
            {blogPosts.map((post) => (
              <div key={post.id} className="border-t border-[#74d1ea]/30 pt-6 group">
                {/* Post Header with Author and Date */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 bg-gray-700 text-white">
                      <div className="uppercase">{post.author.name.charAt(0)}</div>
                    </Avatar>
                    <span className="ml-3 text-gray-400 text-sm">{post.author.name}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-500 text-sm">{post.date}</span>
                    <span className="mx-2 text-gray-600">|</span>
                    <span className="text-[#74d1ea] text-sm">{post.category}</span>
                  </div>
                </div>

                {/* Post Title and Excerpt */}
                <Link href={`/blog/${post.id}`}>
                  <a className="block">
                    <h2 className="text-2xl font-medium text-white mb-3 group-hover:text-[#74d1ea] transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-gray-400 mb-4">{post.excerpt}</p>
                    <div className="flex items-center text-[#74d1ea]">
                      <span className="mr-2">Read more</span>
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </a>
                </Link>
              </div>
            ))}
          </div>

          {/* Load More Button */}
          <div className="mt-16 text-center">
            <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-900 hover:text-white">
              Load more articles
            </Button>
          </div>

          {/* Newsletter Subscription */}
          <div className="mt-20 bg-gray-900/30 rounded-lg p-8 border border-gray-700/60 shadow-[0_0_15px_rgba(116,209,234,0.15)]">
            <div className="text-center max-w-2xl mx-auto">
              <h3 className="text-xl font-medium text-white mb-2">Never miss an update</h3>
              <p className="text-gray-400 mb-6">Get all the news and updates about Tovably directly to your inbox.</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Input 
                  type="email" 
                  placeholder="Your email address" 
                  className="bg-black border-gray-700 text-white" 
                />
                <Button className="bg-[#74d1ea] hover:bg-[#5db8d0] text-black shadow-[0_0_10px_rgba(116,209,234,0.4)]">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>

          {/* Categories Section */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="border-t border-[#74d1ea]/30 pt-6">
              <h3 className="text-lg font-medium text-white mb-3">Technology</h3>
              <p className="text-gray-400">AI, machine learning, and tech innovation insights.</p>
              <a href="#" className="mt-3 inline-flex items-center text-[#74d1ea]">
                <span className="mr-2">View all</span>
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
            <div className="border-t border-[#74d1ea]/30 pt-6">
              <h3 className="text-lg font-medium text-white mb-3">Product</h3>
              <p className="text-gray-400">Updates, new features, and product announcements.</p>
              <a href="#" className="mt-3 inline-flex items-center text-[#74d1ea]">
                <span className="mr-2">View all</span>
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
            <div className="border-t border-[#74d1ea]/30 pt-6">
              <h3 className="text-lg font-medium text-white mb-3">Strategy</h3>
              <p className="text-gray-400">Content marketing and audience engagement tactics.</p>
              <a href="#" className="mt-3 inline-flex items-center text-[#74d1ea]">
                <span className="mr-2">View all</span>
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
            <div className="border-t border-[#74d1ea]/30 pt-6">
              <h3 className="text-lg font-medium text-white mb-3">Research</h3>
              <p className="text-gray-400">Data-driven insights and communication research.</p>
              <a href="#" className="mt-3 inline-flex items-center text-[#74d1ea]">
                <span className="mr-2">View all</span>
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}