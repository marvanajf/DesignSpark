import { Express, Request, Response } from "express";
import { storage } from "./storage";
import { requireAdmin } from "./middleware/admin";
import { 
  insertBlogCategorySchema, 
  insertBlogPostSchema 
} from "@shared/schema";
import { ZodError } from "zod";

export function registerAdminRoutes(app: Express) {
  // Protected admin routes
  
  // User admin routes
  app.patch("/api/admin/users/:id/role", requireAdmin, async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.id, 10);
      const { role } = req.body;
      
      if (!role || !["user", "admin"].includes(role)) {
        return res.status(400).json({ error: "Invalid role value" });
      }
      
      const updatedUser = await storage.updateUserRole(userId, role);
      res.json(updatedUser);
    } catch (error) {
      if (error.message?.includes("not found")) {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: "Failed to update user role" });
    }
  });
  
  // Blog category routes
  app.post("/api/admin/blog-categories", requireAdmin, async (req: Request, res: Response) => {
    try {
      const categoryData = insertBlogCategorySchema.parse(req.body);
      const category = await storage.createBlogCategory(categoryData);
      res.status(201).json(category);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create blog category" });
    }
  });
  
  app.patch("/api/admin/blog-categories/:id", requireAdmin, async (req: Request, res: Response) => {
    try {
      const categoryId = parseInt(req.params.id, 10);
      const updates = req.body;
      
      const updatedCategory = await storage.updateBlogCategory(categoryId, updates);
      res.json(updatedCategory);
    } catch (error) {
      if (error.message?.includes("not found")) {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: "Failed to update blog category" });
    }
  });
  
  app.delete("/api/admin/blog-categories/:id", requireAdmin, async (req: Request, res: Response) => {
    try {
      const categoryId = parseInt(req.params.id, 10);
      await storage.deleteBlogCategory(categoryId);
      res.status(204).end();
    } catch (error) {
      if (error.message?.includes("not found")) {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: "Failed to delete blog category" });
    }
  });
  
  // Blog post routes
  app.post("/api/admin/blog-posts", requireAdmin, async (req: Request, res: Response) => {
    try {
      const postData = insertBlogPostSchema.parse(req.body);
      const post = await storage.createBlogPost(postData);
      res.status(201).json(post);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create blog post" });
    }
  });
  
  app.patch("/api/admin/blog-posts/:id", requireAdmin, async (req: Request, res: Response) => {
    try {
      const postId = parseInt(req.params.id, 10);
      const updates = req.body;
      
      const updatedPost = await storage.updateBlogPost(postId, updates);
      res.json(updatedPost);
    } catch (error) {
      if (error.message?.includes("not found")) {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: "Failed to update blog post" });
    }
  });
  
  app.delete("/api/admin/blog-posts/:id", requireAdmin, async (req: Request, res: Response) => {
    try {
      const postId = parseInt(req.params.id, 10);
      await storage.deleteBlogPost(postId);
      res.status(204).end();
    } catch (error) {
      if (error.message?.includes("not found")) {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: "Failed to delete blog post" });
    }
  });
}