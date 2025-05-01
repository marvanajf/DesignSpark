import { Request, Response, NextFunction, Express } from "express";
import { storage } from "./storage";
import { z } from "zod";
import { SubscriptionPlanType } from "@shared/schema";

// Middleware to check if user is an admin
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.isAuthenticated() || req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admin privileges required." });
  }
  next();
}

export function registerAdminRoutes(app: Express) {
  // Get all users
  app.get("/api/admin/users", requireAdmin, async (_req: Request, res: Response) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  // Update user role
  app.patch("/api/admin/users/:id/role", requireAdmin, async (req: Request, res: Response) => {
    try {
      const userId = Number(req.params.id);
      const schema = z.object({
        role: z.enum(["user", "admin"])
      });
      
      const { role } = schema.parse(req.body);
      
      const updatedUser = await storage.updateUserRole(userId, role);
      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating user role:", error);
      res.status(500).json({ error: "Failed to update user role" });
    }
  });
  
  // Update user subscription plan
  app.patch("/api/admin/users/:id/subscription", requireAdmin, async (req: Request, res: Response) => {
    try {
      const userId = Number(req.params.id);
      const schema = z.object({
        subscription_plan: z.enum(["free", "standard", "professional", "premium"])
      });
      
      const { subscription_plan } = schema.parse(req.body);
      
      // Call the updateUserSubscription method with the plan parameter
      const updatedUser = await storage.updateUserSubscription(userId, {
        plan: subscription_plan as SubscriptionPlanType
      });
      
      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating user subscription:", error);
      res.status(500).json({ error: "Failed to update user subscription" });
    }
  });

  // Get all lead contacts
  app.get("/api/admin/lead-contacts", requireAdmin, async (_req: Request, res: Response) => {
    try {
      const leads = await storage.getAllLeadContacts();
      res.json(leads);
    } catch (error) {
      console.error("Error fetching lead contacts:", error);
      res.status(500).json({ error: "Failed to fetch lead contacts" });
    }
  });

  // Update lead contact
  app.patch("/api/admin/lead-contacts/:id", requireAdmin, async (req: Request, res: Response) => {
    try {
      const leadId = Number(req.params.id);
      const schema = z.object({
        status: z.enum(["new", "contacted", "qualified", "converted"]).optional(),
        notes: z.string().nullable().optional()
      });
      
      const data = schema.parse(req.body);
      
      const updatedLead = await storage.updateLeadContact(leadId, data);
      res.json(updatedLead);
    } catch (error) {
      console.error("Error updating lead contact:", error);
      res.status(500).json({ error: "Failed to update lead contact" });
    }
  });

  // Delete lead contact
  app.delete("/api/admin/lead-contacts/:id", requireAdmin, async (req: Request, res: Response) => {
    try {
      const leadId = Number(req.params.id);
      await storage.deleteLeadContact(leadId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting lead contact:", error);
      res.status(500).json({ error: "Failed to delete lead contact" });
    }
  });

  // Create a blog category
  app.post("/api/admin/blog-categories", requireAdmin, async (req: Request, res: Response) => {
    try {
      const schema = z.object({
        name: z.string().min(1),
        slug: z.string().min(1)
      });
      
      const category = schema.parse(req.body);
      const newCategory = await storage.createBlogCategory(category);
      res.status(201).json(newCategory);
    } catch (error) {
      console.error("Error creating blog category:", error);
      res.status(500).json({ error: "Failed to create blog category" });
    }
  });

  // Update a blog category
  app.patch("/api/admin/blog-categories/:id", requireAdmin, async (req: Request, res: Response) => {
    try {
      const categoryId = Number(req.params.id);
      const schema = z.object({
        name: z.string().min(1).optional(),
        slug: z.string().min(1).optional()
      });
      
      const updates = schema.parse(req.body);
      const updatedCategory = await storage.updateBlogCategory(categoryId, updates);
      res.json(updatedCategory);
    } catch (error) {
      console.error("Error updating blog category:", error);
      res.status(500).json({ error: "Failed to update blog category" });
    }
  });

  // Delete a blog category
  app.delete("/api/admin/blog-categories/:id", requireAdmin, async (req: Request, res: Response) => {
    try {
      const categoryId = Number(req.params.id);
      await storage.deleteBlogCategory(categoryId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting blog category:", error);
      res.status(500).json({ error: "Failed to delete blog category" });
    }
  });

  // Create a blog post
  app.post("/api/admin/blog-posts", requireAdmin, async (req: Request, res: Response) => {
    try {
      const schema = z.object({
        title: z.string().min(1),
        slug: z.string().min(1),
        excerpt: z.string().optional(),
        content: z.string().min(1),
        author_id: z.number(),
        category_id: z.number().optional(),
        featured_image: z.string().optional(),
        published: z.boolean().optional(),
        publish_date: z.string().optional().transform(date => date ? new Date(date) : undefined)
      });
      
      const post = schema.parse(req.body);
      const newPost = await storage.createBlogPost(post);
      res.status(201).json(newPost);
    } catch (error) {
      console.error("Error creating blog post:", error);
      res.status(500).json({ error: "Failed to create blog post" });
    }
  });

  // Update a blog post
  app.patch("/api/admin/blog-posts/:id", requireAdmin, async (req: Request, res: Response) => {
    try {
      const postId = Number(req.params.id);
      const schema = z.object({
        title: z.string().min(1).optional(),
        slug: z.string().min(1).optional(),
        excerpt: z.string().optional(),
        content: z.string().min(1).optional(),
        category_id: z.number().optional(),
        featured_image: z.string().optional(),
        published: z.boolean().optional(),
        publish_date: z.string().optional().transform(date => date ? new Date(date) : undefined)
      });
      
      const updates = schema.parse(req.body);
      const updatedPost = await storage.updateBlogPost(postId, updates);
      res.json(updatedPost);
    } catch (error) {
      console.error("Error updating blog post:", error);
      res.status(500).json({ error: "Failed to update blog post" });
    }
  });

  // Delete a blog post
  app.delete("/api/admin/blog-posts/:id", requireAdmin, async (req: Request, res: Response) => {
    try {
      const postId = Number(req.params.id);
      await storage.deleteBlogPost(postId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting blog post:", error);
      res.status(500).json({ error: "Failed to delete blog post" });
    }
  });
}