import { Request, Response, NextFunction, Express } from "express";
import { storage } from "./storage";
import { z } from "zod";
import { SubscriptionPlanType } from "@shared/schema";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

// This should be the same function used in auth.ts
async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

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
  
  // Delete user
  app.delete("/api/admin/users/:id", requireAdmin, async (req: Request, res: Response) => {
    try {
      const userId = Number(req.params.id);
      
      // Don't allow admins to delete themselves
      if (req.user.id === userId) {
        return res.status(400).json({ error: "Cannot delete your own account" });
      }
      
      const result = await storage.deleteUser(userId);
      
      if (result) {
        res.json({ success: true, message: "User deleted successfully" });
      } else {
        res.status(404).json({ error: "User not found or could not be deleted" });
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ error: "Failed to delete user" });
    }
  });
  
  // Create new user (admin function)
  app.post("/api/admin/users", requireAdmin, async (req: Request, res: Response) => {
    try {
      const userSchema = z.object({
        username: z.string().min(3),
        email: z.string().email(),
        password: z.string().min(6),
        full_name: z.string(),
        company: z.string().optional(),
        role: z.enum(["user", "admin"]).optional().default("user"),
        subscription_plan: z.enum(["free", "standard", "professional", "premium"]).optional().default("free")
      });
      
      const userData = userSchema.parse(req.body);
      
      // Check if user with this email or username already exists
      const existingEmailUser = await storage.getUserByEmail(userData.email);
      if (existingEmailUser) {
        return res.status(400).json({ error: "Email is already in use" });
      }
      
      const existingUsernameUser = await storage.getUserByUsername(userData.username);
      if (existingUsernameUser) {
        return res.status(400).json({ error: "Username is already in use" });
      }
      
      // Create a new user
      const hashedPassword = await hashPassword(userData.password);
      
      const newUser = await storage.adminCreateUser({
        ...userData,
        password: hashedPassword,
      });
      
      // Automatically update the subscription if it's not free
      if (userData.subscription_plan !== "free") {
        await storage.updateUserSubscription(newUser.id, {
          plan: userData.subscription_plan as SubscriptionPlanType
        });
      }
      
      // Return the user without the password
      const userWithoutPassword = {
        ...newUser,
        password: undefined
      };
      
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      console.error("Error creating user:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create user" });
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

  // Get all blog posts (including unpublished)
  app.get("/api/admin/blog-posts", requireAdmin, async (_req: Request, res: Response) => {
    try {
      const posts = await storage.getAllBlogPosts();
      res.json(posts);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      res.status(500).json({ error: "Failed to fetch blog posts" });
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