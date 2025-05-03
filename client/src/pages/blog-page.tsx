import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { Link } from "wouter";
import { ArrowRight, RssIcon, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";

// Blog post types from API
interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author_id: number;
  category_id?: number;
  featured_image?: string;
  published: boolean;
  publish_date?: string;
  created_at: string;
  updated_at: string;
}

interface BlogCategory {
  id: number;
  name: string;
  slug: string;
  created_at: string;
}

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

export default function BlogPage() {
  // Fetch blog posts from API
  const {
    data: blogPosts = [],
    isLoading: isPostsLoading,
    error: postsError
  } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog-posts"],
    staleTime: 1000 * 60, // 1 minute
  });

  // Fetch blog categories
  const {
    data: categories = [],
    isLoading: isCategoriesLoading,
    error: categoriesError
  } = useQuery<BlogCategory[]>({
    queryKey: ["/api/blog-categories"],
    staleTime: 1000 * 60, // 1 minute
  });

  // State for users info (authors)
  const [authors, setAuthors] = useState<Record<number, User>>({});

  // Fetch users for authors info
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Extract unique author IDs
        const uniqueAuthorIdsSet = new Set<number>();
        blogPosts.forEach(post => {
          if (post.author_id) {
            uniqueAuthorIdsSet.add(post.author_id);
          }
        });
        
        const uniqueAuthorIds = Array.from(uniqueAuthorIdsSet);
        
        if (uniqueAuthorIds.length === 0) return;
        
        const authorsMap: Record<number, User> = {};
        
        // Since we don't have a specific API to fetch users by IDs, we'll use a simple approach
        // In a real app, you might want to create a dedicated endpoint for this
        const res = await fetch('/api/admin/users');
        if (res.ok) {
          const users = await res.json();
          for (const user of users) {
            if (uniqueAuthorIds.includes(user.id)) {
              authorsMap[user.id] = user;
            }
          }
          setAuthors(authorsMap);
        }
      } catch (error) {
        console.error('Error fetching authors:', error);
      }
    };
    
    if (blogPosts.length > 0) {
      fetchUsers();
    }
  }, [blogPosts]);

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
            <a href="/api/blog-rss" target="_blank" rel="noopener noreferrer" className="hidden md:flex items-center text-gray-400 hover:text-[#74d1ea]">
              <RssIcon className="h-4 w-4 mr-2" />
              RSS Feed
            </a>
          </div>

          {/* Blog Grid */}
          <div className="mt-12">
            {isPostsLoading || isCategoriesLoading ? (
              <div className="flex justify-center py-16">
                <div className="flex flex-col items-center">
                  <Loader2 className="h-10 w-10 animate-spin text-[#74d1ea] mb-4" />
                  <p className="text-gray-400">Loading blog posts...</p>
                </div>
              </div>
            ) : postsError || categoriesError ? (
              <div className="text-center py-16 text-red-500">
                <p>Error loading blog content. Please try again later.</p>
              </div>
            ) : blogPosts.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-400">No blog posts found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {blogPosts.map((post) => {
                  const author = authors[post.author_id] || { username: 'Unknown Author' };
                  const category = categories.find(c => c.id === post.category_id);
                  const postDate = post.publish_date || post.created_at;
                  
                  return (
                    <div key={post.id} className="border-t border-[#74d1ea]/30 pt-6 group">
                      {/* Post Header with Author and Date */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <Avatar className="h-10 w-10 bg-gray-700 text-white">
                            <div className="uppercase">{author.username.charAt(0)}</div>
                          </Avatar>
                          <span className="ml-3 text-gray-400 text-sm">{author.username}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-gray-500 text-sm">{format(new Date(postDate), "MMM d, yyyy")}</span>
                          {category && (
                            <>
                              <span className="mx-2 text-gray-600">|</span>
                              <span className="text-[#74d1ea] text-sm">{category.name}</span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Post Title and Excerpt */}
                      <Link href={`/blog/${post.slug}`}>
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
                  );
                })}
              </div>
            )}
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
        </div>
      </div>
    </Layout>
  );
}