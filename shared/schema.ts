import { pgTable, text, serial, integer, jsonb, timestamp, boolean, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const campaignStatusEnum = pgEnum('campaign_status', [
  'draft',
  'active', 
  'planning',
  'running',
  'completed',
  'archived'
]);

export type SubscriptionPlanType = 'free' | 'standard' | 'professional' | 'premium';

// Function to safely get environment variables or default values
// This approach works in both Node.js and browser environments
const getEnvVar = (key: string, defaultValue: string = ''): string => {
  // In Node.js environment
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key] as string;
  }
  
  // In browser environment with Vite
  if (typeof import.meta !== 'undefined' && import.meta.env && (import.meta.env as any)[key]) {
    return (import.meta.env as any)[key];
  }
  
  return defaultValue;
};

export const subscriptionPlans: Record<SubscriptionPlanType, {
  name: string;
  personas: number;
  toneAnalyses: number;
  contentGeneration: number;
  campaigns: number;
  campaignFactory: number;
  support: boolean;
  price: number;
  currency: string;
  displayPrice: string;
  stripePrice?: string; // Stripe price ID
}> = {
  free: {
    name: "Starter",
    personas: 5,
    toneAnalyses: 5,
    contentGeneration: 10,
    campaigns: 2,
    campaignFactory: 0,
    support: true,
    price: 0,
    currency: "GBP",
    displayPrice: "Free"
  },
  standard: {
    name: "Standard",
    personas: 20,
    toneAnalyses: 50,
    contentGeneration: 100,
    campaigns: 5,
    campaignFactory: 5,
    support: true,
    price: 4.99,
    currency: "GBP",
    displayPrice: "£4.99",
    // Use the environment variable if available, otherwise use a default (server will validate)
    stripePrice: getEnvVar('STRIPE_STANDARD_PRICE_ID', 'price_standard')
  },
  professional: {
    name: "Premium",
    personas: 30,
    toneAnalyses: 100,
    contentGeneration: 150,
    campaigns: 20,
    campaignFactory: 15,
    support: true,
    price: 19.99,
    currency: "GBP",
    displayPrice: "£19.99",
    // Use the environment variable if available, otherwise use a default (server will validate)
    stripePrice: getEnvVar('STRIPE_PREMIUM_PRICE_ID', 'price_premium')
  },
  premium: {
    name: "Pro",
    personas: 50,
    toneAnalyses: 200,
    contentGeneration: 300,
    campaigns: 30,
    campaignFactory: 30,
    support: true,
    price: 39.99,
    currency: "GBP",
    displayPrice: "£39.99",
    // Use the environment variable if available, otherwise use a default (server will validate)
    stripePrice: getEnvVar('STRIPE_PRO_PRICE_ID', 'price_pro')
  }
};

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").unique(), // Legacy field, keeping for backward compatibility
  email: text("email").notNull().unique(), // Primary identifier 
  password: text("password").notNull(),
  full_name: text("full_name").notNull(), // Required field
  company: text("company").notNull(), // Required field
  role: text("role").default("user").notNull(),
  subscription_plan: text("subscription_plan").default("free").notNull(),
  personas_used: integer("personas_used").default(0).notNull(),
  tone_analyses_used: integer("tone_analyses_used").default(0).notNull(),
  content_generated: integer("content_generated").default(0).notNull(),
  campaigns_used: integer("campaigns_used").default(0).notNull(),
  campaign_factory_used: integer("campaign_factory_used").default(0).notNull(),
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
  type: text("type").notNull(), // 'linkedin_post', 'email', 'webinar', 'workshop'
  content_text: text("content_text").notNull(),
  persona_id: integer("persona_id").references(() => personas.id),
  tone_analysis_id: integer("tone_analysis_id").references(() => toneAnalyses.id),
  topic: text("topic"),
  further_details: text("further_details"),
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

// Using previously defined campaignStatusEnum

export const campaigns = pgTable("campaigns", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  description: text("description"),
  status: campaignStatusEnum("status").default("draft").notNull(),
  status_display: text("status_display").default("Draft").notNull(), // Human readable status
  personas_count: integer("personas_count").default(0).notNull(),
  content_count: integer("content_count").default(0).notNull(),
  channels_count: integer("channels_count").default(0).notNull(),
  start_date: timestamp("start_date"),
  end_date: timestamp("end_date"),
  persona_id: integer("persona_id").references(() => personas.id),
  tone_analysis_id: integer("tone_analysis_id").references(() => toneAnalyses.id),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull()
});

export const campaignFactoryCampaigns = pgTable("campaign_factory_campaigns", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  description: text("description"),
  objective: text("objective"),
  target_audience: jsonb("target_audience"), // Array of audience strings
  channels: jsonb("channels"), // Array of channel strings
  timeline_start: text("timeline_start"),
  timeline_end: text("timeline_end"),
  contents: jsonb("contents"), // Array of content objects with type, title, content, delivery date
  tone_profile: jsonb("tone_profile"), // Tone profile percentages
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull()
});

export const campaignContents = pgTable("campaign_contents", {
  id: serial("id").primaryKey(),
  campaign_id: integer("campaign_id").notNull().references(() => campaigns.id),
  content_id: integer("content_id").notNull().references(() => generatedContent.id),
  created_at: timestamp("created_at").defaultNow().notNull()
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
export const insertUserSchema = createInsertSchema(users)
  .omit({ 
    id: true,
    personas_used: true, 
    tone_analyses_used: true, 
    content_generated: true,
    campaigns_used: true,
    campaign_factory_used: true,
    stripe_customer_id: true,
    stripe_subscription_id: true,
    subscription_status: true,
    subscription_period_end: true,
    created_at: true,
    subscription_plan: true
  })
  .extend({
    // Make username optional
    username: z.string().optional(),
    // Company domain email validation
    email: z.string().email().refine(
      (email) => {
        // This regex checks for common personal email domains and rejects them
        const personalEmailRegex = /@(gmail|yahoo|hotmail|outlook|aol|icloud|protonmail|zoho|gmx|mail|inbox|yandex|tutanota)\./i;
        return !personalEmailRegex.test(email);
      },
      {
        message: "Please use a company email address",
      }
    ),
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
  topic: true,
  further_details: true
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

export const insertCampaignSchema = createInsertSchema(campaigns).pick({
  user_id: true,
  name: true,
  description: true,
  status: true,
  status_display: true,
  personas_count: true,
  content_count: true,
  channels_count: true,
  start_date: true,
  end_date: true,
  persona_id: true,
  tone_analysis_id: true
});

export const insertCampaignContentSchema = createInsertSchema(campaignContents).pick({
  campaign_id: true,
  content_id: true
});

export const insertCampaignFactorySchema = createInsertSchema(campaignFactoryCampaigns).pick({
  user_id: true,
  name: true,
  description: true,
  objective: true,
  target_audience: true,
  channels: true,
  timeline_start: true,
  timeline_end: true,
  contents: true,
  tone_profile: true
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

export type Campaign = typeof campaigns.$inferSelect;
export type InsertCampaign = z.infer<typeof insertCampaignSchema>;

export type CampaignContent = typeof campaignContents.$inferSelect;
export type InsertCampaignContent = z.infer<typeof insertCampaignContentSchema>;

export type LeadContact = typeof leadContacts.$inferSelect;
export type InsertLeadContact = z.infer<typeof insertLeadContactSchema>;

export type CampaignFactory = typeof campaignFactoryCampaigns.$inferSelect;
export type InsertCampaignFactory = z.infer<typeof insertCampaignFactorySchema>;

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
