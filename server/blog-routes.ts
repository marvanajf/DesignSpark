import { Express, Request, Response } from "express";
import { storage } from "./storage";

export function registerBlogRoutes(app: Express) {
  // RSS feed endpoint
  app.get("/api/blog-rss", async (_req: Request, res: Response) => {
    try {
      const posts = await storage.getAllBlogPosts({ published: true });
      
      // Generate RSS XML
      const hostname = process.env.NODE_ENV === 'production' ? 'https://tovably.com' : 'http://localhost:5000';
      
      const rssItems = posts.map((post: any) => {
        const postUrl = `${hostname}/blog/${post.slug}`;
        const pubDate = new Date(post.publish_date || post.created_at).toUTCString();
        
        return `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${postUrl}</link>
      <guid>${postUrl}</guid>
      <pubDate>${pubDate}</pubDate>
      <description><![CDATA[${post.excerpt}]]></description>
      <content:encoded><![CDATA[${post.content}]]></content:encoded>
    </item>`;
      }).join('\n');
      
      const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Tovably Blog</title>
    <link>${hostname}/blog</link>
    <description>News and Updates about Tovably</description>
    <atom:link href="${hostname}/api/blog-rss" rel="self" type="application/rss+xml" />
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>${rssItems}
  </channel>
</rss>`;

      res.header('Content-Type', 'application/xml');
      res.send(rssXml);
    } catch (error) {
      console.error("Error generating RSS feed:", error);
      res.status(500).json({ error: "Failed to generate RSS feed" });
    }
  });
  
  // Public blog routes
  
  // Get all blog categories
  app.get("/api/blog-categories", async (_req: Request, res: Response) => {
    try {
      const categories = await storage.getAllBlogCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch blog categories" });
    }
  });
  
  // Get a specific blog category by slug
  app.get("/api/blog-categories/:slug", async (req: Request, res: Response) => {
    try {
      const category = await storage.getBlogCategoryBySlug(req.params.slug);
      if (!category) {
        return res.status(404).json({ error: "Blog category not found" });
      }
      res.json(category);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch blog category" });
    }
  });
  
  // Get all published blog posts (with pagination and filtering)
  app.get("/api/blog-posts", async (req: Request, res: Response) => {
    try {
      const options = {
        published: true,
        limit: req.query.limit ? parseInt(req.query.limit as string, 10) : undefined,
        offset: req.query.offset ? parseInt(req.query.offset as string, 10) : undefined,
        categoryId: req.query.category_id ? parseInt(req.query.category_id as string, 10) : undefined
      };
      
      const posts = await storage.getAllBlogPosts(options);
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch blog posts" });
    }
  });
  
  // Get a specific blog post by slug
  app.get("/api/blog-posts/:slug", async (req: Request, res: Response) => {
    try {
      const post = await storage.getBlogPostBySlug(req.params.slug);
      if (!post) {
        return res.status(404).json({ error: "Blog post not found" });
      }
      
      // Only return published posts
      if (!post.published) {
        return res.status(404).json({ error: "Blog post not found" });
      }
      
      res.json(post);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch blog post" });
    }
  });
}