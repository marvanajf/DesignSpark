import { pgTable, text, serial, integer, jsonb, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export type SubscriptionPlanType = 'free' | 'standard' | 'professional' | 'premium';

export const subscriptionPlans: Record<SubscriptionPlanType, {
  name: string;
  personas: number;
  toneAnalyses: number;
  contentGeneration: number;
  price: number;
  currency: string;
  displayPrice: string;
  stripePrice?: string; // Stripe price ID
}> = {
  free: {
    name: "Free",
    personas: 5,
    toneAnalyses: 3,
    contentGeneration: 10,
    price: 0,
    currency: "GBP",
    displayPrice: "Free"
  },
  standard: {
    name: "Standard",
    personas: 10,
    toneAnalyses: 15,
    contentGeneration: 100,
    price: 9.99,
    currency: "GBP",
    displayPrice: "£9.99",
    stripePrice: "price_standard" // Replace with actual Stripe price ID
  },
  professional: {
    name: "Professional",
    personas: 25,
    toneAnalyses: 30,
    contentGeneration: 200,
    price: 24.99,
    currency: "GBP",
    displayPrice: "£24.99",
    stripePrice: "price_professional" // Replace with actual Stripe price ID
  },
  premium: {
    name: "Premium",
    personas: 50,
    toneAnalyses: 100,
    contentGeneration: 500,
    price: 39.99,
    currency: "GBP",
    displayPrice: "£39.99",
    stripePrice: "price_premium" // Replace with actual Stripe price ID
  }
};

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(), // Keeping for backward compatibility, but will deprecate in favor of email
  email: text("email").notNull().unique(), // Primary identifier moving forward
  password: text("password").notNull(),
  full_name: text("full_name"), // Added field
  company: text("company"), // Added field
  role: text("role").default("user").notNull(),
  subscription_plan: text("subscription_plan").default("free").notNull(),
  personas_used: integer("personas_used").default(0).notNull(),
  tone_analyses_used: integer("tone_analyses_used").default(0).notNull(),
  content_generated: integer("content_generated").default(0).notNull(),
  stripe_customer_id: text("stripe_customer_id"),
  stripe_subscription_id: text("stripe_subscription_id"),
  subscription_status: text("subscription_status").default("inactive"),
  subscription_period_end: timestamp("subscription_period_end"),
  created_at: timestamp("created_at").defaultNow().notNull()
});

export const toneAnalyses = pgTable("tone_analyses", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").notNull().references(() => users.id),
  name: text("name"),
  website_url: text("website_url"),
  sample_text: text("sample_text"),
  tone_results: jsonb("tone_results"),
  created_at: timestamp("created_at").defaultNow().notNull()
});

export const personas = pgTable("personas", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  description: text("description"),
  interests: jsonb("interests"),
  is_selected: boolean("is_selected").default(false),
  created_at: timestamp("created_at").defaultNow().notNull()
});

export const generatedContent = pgTable("generated_content", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").notNull().references(() => users.id),
  type: text("type").notNull(), // 'linkedin_post' or 'email'
  content_text: text("content_text").notNull(),
  persona_id: integer("persona_id").references(() => personas.id),
  tone_analysis_id: integer("tone_analysis_id").references(() => toneAnalyses.id),
  topic: text("topic"),
  created_at: timestamp("created_at").defaultNow().notNull()
});

export const blogCategories = pgTable("blog_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  created_at: timestamp("created_at").defaultNow().notNull()
});

export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt"),
  content: text("content").notNull(),
  author_id: integer("author_id").notNull().references(() => users.id),
  category_id: integer("category_id").references(() => blogCategories.id),
  featured_image: text("featured_image"),
  published: boolean("published").default(false).notNull(),
  publish_date: timestamp("publish_date"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull()
});

export const leadContacts = pgTable("lead_contacts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  company: text("company"),
  message: text("message").notNull(),
  status: text("status").default("new").notNull(), // new, contacted, qualified, converted
  notes: text("notes"),
  created_at: timestamp("created_at").defaultNow().notNull()
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  password: true,
  full_name: true,
  company: true
});

export const insertToneAnalysisSchema = createInsertSchema(toneAnalyses).pick({
  user_id: true,
  name: true,
  website_url: true,
  sample_text: true,
  tone_results: true
});

export const insertPersonaSchema = createInsertSchema(personas).pick({
  user_id: true,
  name: true,
  description: true,
  interests: true,
  is_selected: true
});

export const insertGeneratedContentSchema = createInsertSchema(generatedContent).pick({
  user_id: true,
  type: true,
  content_text: true,
  persona_id: true,
  tone_analysis_id: true,
  topic: true
});

export const insertBlogCategorySchema = createInsertSchema(blogCategories).pick({
  name: true,
  slug: true
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).pick({
  title: true,
  slug: true,
  excerpt: true,
  content: true,
  author_id: true,
  category_id: true,
  featured_image: true,
  published: true,
  publish_date: true
});

export const insertLeadContactSchema = createInsertSchema(leadContacts).pick({
  name: true,
  email: true,
  company: true,
  message: true,
  status: true,
  notes: true
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type ToneAnalysis = typeof toneAnalyses.$inferSelect;
export type InsertToneAnalysis = z.infer<typeof insertToneAnalysisSchema>;

export type Persona = typeof personas.$inferSelect;
export type InsertPersona = z.infer<typeof insertPersonaSchema>;

export type GeneratedContent = typeof generatedContent.$inferSelect;
export type InsertGeneratedContent = z.infer<typeof insertGeneratedContentSchema>;

export type BlogCategory = typeof blogCategories.$inferSelect;
export type InsertBlogCategory = z.infer<typeof insertBlogCategorySchema>;

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;

export type LeadContact = typeof leadContacts.$inferSelect;
export type InsertLeadContact = z.infer<typeof insertLeadContactSchema>;

// Create predefined personas for seed data
export const predefinedPersonas = [
  {
    name: "Chief Technology Officer",
    description: "Technically savvy executive focused on infrastructure, security, and technology roadmaps. Values efficiency and innovation.",
    interests: ["Cloud Infrastructure", "Security", "Digital Transformation"],
  },
  {
    name: "Marketing Manager",
    description: "Results-driven professional responsible for campaign performance, brand consistency, and audience engagement metrics.",
    interests: ["ROI Analytics", "Campaign Performance", "Customer Engagement"],
  },
  {
    name: "Small Business Owner",
    description: "Focused on practical solutions that deliver clear business value, cost efficiency, and ease of implementation.",
    interests: ["Cost Efficiency", "Growth Strategies", "Operations"],
  },
  {
    name: "IT Director",
    description: "Balances technical requirements with business needs, focusing on reliability, scalability, and integration capabilities.",
    interests: ["System Reliability", "Cybersecurity", "IT Budgeting"],
  }
];
