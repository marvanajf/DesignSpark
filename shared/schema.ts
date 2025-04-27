import { pgTable, text, serial, integer, jsonb, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull()
});

export const toneAnalyses = pgTable("tone_analyses", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").notNull().references(() => users.id),
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

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  password: true
});

export const insertToneAnalysisSchema = createInsertSchema(toneAnalyses).pick({
  user_id: true,
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

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type ToneAnalysis = typeof toneAnalyses.$inferSelect;
export type InsertToneAnalysis = z.infer<typeof insertToneAnalysisSchema>;

export type Persona = typeof personas.$inferSelect;
export type InsertPersona = z.infer<typeof insertPersonaSchema>;

export type GeneratedContent = typeof generatedContent.$inferSelect;
export type InsertGeneratedContent = z.infer<typeof insertGeneratedContentSchema>;

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
