import { Express, Request, Response } from "express";
import { storage } from "./storage";

export function registerBlogRoutes(app: Express) {
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