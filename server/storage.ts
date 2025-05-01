import { 
  users, 
  toneAnalyses, 
  personas, 
  generatedContent,
  blogCategories,
  blogPosts,
  leadContacts,
  campaigns,
  campaignContents,
  type User, 
  type InsertUser, 
  type ToneAnalysis, 
  type InsertToneAnalysis, 
  type Persona, 
  type InsertPersona, 
  type GeneratedContent, 
  type InsertGeneratedContent,
  type BlogCategory,
  type InsertBlogCategory,
  type BlogPost,
  type InsertBlogPost,
  type LeadContact,
  type InsertLeadContact,
  type Campaign,
  type InsertCampaign,
  type CampaignContent,
  type InsertCampaignContent,
  type SubscriptionPlanType,
  predefinedPersonas
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

// modify the interface with any CRUD methods
// you might need
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserRole(id: number, role: string): Promise<User>;
  updateUserSubscription(id: number, updates: { 
    plan?: SubscriptionPlanType;
    stripeSubscriptionId?: string;
    status?: string;
    periodEnd?: Date;
  }): Promise<User>;
  updateUserStripeInfo(id: number, customerInfo: { 
    customerId: string; 
    subscriptionId?: string; 
    status?: string; 
    periodEnd?: Date; 
  }): Promise<User>;
  getUserByStripeCustomerId(customerId: string): Promise<User | undefined>;
  incrementPersonaUsage(id: number): Promise<User>;
  incrementToneAnalysisUsage(id: number): Promise<User>;
  incrementContentUsage(id: number): Promise<User>;
  getAllUsers(): Promise<User[]>;
  
  // Tone analysis methods
  createToneAnalysis(analysis: InsertToneAnalysis): Promise<ToneAnalysis>;
  getToneAnalysis(id: number): Promise<ToneAnalysis | undefined>;
  getToneAnalysesByUserId(userId: number): Promise<ToneAnalysis[]>;
  updateToneAnalysis(id: number, updates: Partial<InsertToneAnalysis>): Promise<ToneAnalysis>;
  
  // Persona methods
  createPersona(persona: InsertPersona): Promise<Persona>;
  getPersona(id: number): Promise<Persona | undefined>;
  getPersonasByUserId(userId: number): Promise<Persona[]>;
  updatePersona(id: number, updates: Partial<InsertPersona>): Promise<Persona>;
  deletePersona(id: number): Promise<void>;
  seedPredefinedPersonas(userId: number): Promise<Persona[]>;
  
  // Content methods
  createGeneratedContent(content: InsertGeneratedContent): Promise<GeneratedContent>;
  getGeneratedContent(id: number): Promise<GeneratedContent | undefined>;
  getGeneratedContentByUserId(userId: number): Promise<GeneratedContent[]>;
  
  // Blog category methods
  createBlogCategory(category: InsertBlogCategory): Promise<BlogCategory>;
  getBlogCategory(id: number): Promise<BlogCategory | undefined>;
  getBlogCategoryBySlug(slug: string): Promise<BlogCategory | undefined>;
  getAllBlogCategories(): Promise<BlogCategory[]>;
  updateBlogCategory(id: number, updates: Partial<InsertBlogCategory>): Promise<BlogCategory>;
  deleteBlogCategory(id: number): Promise<void>;
  
  // Blog post methods
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  getBlogPost(id: number): Promise<BlogPost | undefined>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  getAllBlogPosts(options?: { 
    published?: boolean; 
    limit?: number; 
    offset?: number;
    categoryId?: number;
  }): Promise<BlogPost[]>;
  updateBlogPost(id: number, updates: Partial<InsertBlogPost>): Promise<BlogPost>;
  deleteBlogPost(id: number): Promise<void>;
  
  // Campaign methods
  createCampaign(campaign: InsertCampaign): Promise<Campaign>;
  getCampaign(id: number): Promise<Campaign | undefined>;
  getCampaignsByUserId(userId: number): Promise<Campaign[]>;
  updateCampaign(id: number, updates: Partial<InsertCampaign>): Promise<Campaign>;
  deleteCampaign(id: number): Promise<void>;
  
  // Campaign content methods
  addContentToCampaign(campaignContent: InsertCampaignContent): Promise<CampaignContent>;
  getCampaignContents(campaignId: number): Promise<GeneratedContent[]>;
  removeContentFromCampaign(campaignId: number, contentId: number): Promise<void>;
  deleteCampaignContents(campaignId: number): Promise<void>;
  
  // Lead contact methods
  createLeadContact(contact: InsertLeadContact): Promise<LeadContact>;
  getLeadContact(id: number): Promise<LeadContact | undefined>;
  getAllLeadContacts(options?: {
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<LeadContact[]>;
  updateLeadContact(id: number, updates: Partial<InsertLeadContact>): Promise<LeadContact>;
  deleteLeadContact(id: number): Promise<void>;
  
  // Session store
  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private toneAnalyses: Map<number, ToneAnalysis>;
  private personas: Map<number, Persona>;
  private generatedContents: Map<number, GeneratedContent>;
  private blogCategories: Map<number, BlogCategory>;
  private blogPosts: Map<number, BlogPost>;
  private campaigns: Map<number, Campaign>;
  private campaignContents: Map<number, CampaignContent>;
  private leadContacts: Map<number, LeadContact>;
  private userIdCounter: number;
  private toneAnalysisIdCounter: number;
  private personaIdCounter: number;
  private contentIdCounter: number;
  private blogCategoryIdCounter: number;
  private blogPostIdCounter: number;
  private campaignIdCounter: number;
  private campaignContentIdCounter: number;
  private leadContactIdCounter: number;
  sessionStore: session.Store;

  constructor() {
    this.users = new Map();
    this.toneAnalyses = new Map();
    this.personas = new Map();
    this.generatedContents = new Map();
    this.blogCategories = new Map();
    this.blogPosts = new Map();
    this.campaigns = new Map();
    this.campaignContents = new Map();
    this.leadContacts = new Map();
    this.userIdCounter = 1;
    this.toneAnalysisIdCounter = 1;
    this.personaIdCounter = 1;
    this.contentIdCounter = 1;
    this.blogCategoryIdCounter = 1;
    this.blogPostIdCounter = 1;
    this.campaignIdCounter = 1;
    this.campaignContentIdCounter = 1;
    this.leadContactIdCounter = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const now = new Date();
    const user: User = { 
      ...insertUser, 
      id, 
      role: "user",
      subscription_plan: "free",
      personas_used: 0,
      tone_analyses_used: 0,
      content_generated: 0,
      created_at: now
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserRole(id: number, role: string): Promise<User> {
    const user = this.users.get(id);
    if (!user) {
      throw new Error(`User with id ${id} not found`);
    }
    
    const updatedUser = {
      ...user,
      role
    };
    
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  
  async updateUserSubscription(id: number, updates: { 
    plan?: SubscriptionPlanType;
    stripeSubscriptionId?: string;
    status?: string;
    periodEnd?: Date;
  }): Promise<User> {
    const user = this.users.get(id);
    if (!user) {
      throw new Error(`User with id ${id} not found`);
    }
    
    const updatedUser = {
      ...user,
      subscription_plan: updates.plan || user.subscription_plan,
      stripe_subscription_id: updates.stripeSubscriptionId || user.stripe_subscription_id,
      subscription_status: updates.status || user.subscription_status,
      subscription_period_end: updates.periodEnd || user.subscription_period_end
    };
    
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  
  async getUserByStripeCustomerId(customerId: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.stripe_customer_id === customerId
    );
  }
  
  async updateUserStripeInfo(id: number, customerInfo: { 
    customerId: string; 
    subscriptionId?: string; 
    status?: string; 
    periodEnd?: Date; 
  }): Promise<User> {
    const user = this.users.get(id);
    if (!user) {
      throw new Error(`User with id ${id} not found`);
    }
    
    const updatedUser = {
      ...user,
      stripe_customer_id: customerInfo.customerId,
      stripe_subscription_id: customerInfo.subscriptionId || null,
      subscription_status: customerInfo.status || 'inactive',
      subscription_period_end: customerInfo.periodEnd || null
    };
    
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  
  async incrementPersonaUsage(id: number): Promise<User> {
    const user = this.users.get(id);
    if (!user) {
      throw new Error(`User with id ${id} not found`);
    }
    
    const updatedUser = {
      ...user,
      personas_used: user.personas_used + 1
    };
    
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  
  async incrementToneAnalysisUsage(id: number): Promise<User> {
    const user = this.users.get(id);
    if (!user) {
      throw new Error(`User with id ${id} not found`);
    }
    
    const updatedUser = {
      ...user,
      tone_analyses_used: user.tone_analyses_used + 1
    };
    
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  
  async incrementContentUsage(id: number): Promise<User> {
    const user = this.users.get(id);
    if (!user) {
      throw new Error(`User with id ${id} not found`);
    }
    
    const updatedUser = {
      ...user,
      content_generated: user.content_generated + 1
    };
    
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  
  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values())
      .sort((a, b) => a.created_at.getTime() - b.created_at.getTime());
  }

  // Tone analysis methods
  async createToneAnalysis(analysis: InsertToneAnalysis): Promise<ToneAnalysis> {
    const id = this.toneAnalysisIdCounter++;
    const now = new Date();
    const toneAnalysis: ToneAnalysis = {
      ...analysis,
      id,
      created_at: now
    };
    this.toneAnalyses.set(id, toneAnalysis);
    return toneAnalysis;
  }

  async getToneAnalysis(id: number): Promise<ToneAnalysis | undefined> {
    return this.toneAnalyses.get(id);
  }

  async getToneAnalysesByUserId(userId: number): Promise<ToneAnalysis[]> {
    return Array.from(this.toneAnalyses.values())
      .filter(analysis => analysis.user_id === userId)
      .sort((a, b) => b.created_at.getTime() - a.created_at.getTime());
  }
  
  async updateToneAnalysis(id: number, updates: Partial<InsertToneAnalysis>): Promise<ToneAnalysis> {
    const analysis = this.toneAnalyses.get(id);
    if (!analysis) {
      throw new Error(`Tone analysis with id ${id} not found`);
    }
    
    const updatedAnalysis = {
      ...analysis,
      ...updates
    };
    
    this.toneAnalyses.set(id, updatedAnalysis);
    return updatedAnalysis;
  }

  // Persona methods
  async createPersona(persona: InsertPersona): Promise<Persona> {
    const id = this.personaIdCounter++;
    const now = new Date();
    const newPersona: Persona = {
      ...persona,
      id,
      created_at: now
    };
    this.personas.set(id, newPersona);
    return newPersona;
  }

  async getPersona(id: number): Promise<Persona | undefined> {
    return this.personas.get(id);
  }

  async getPersonasByUserId(userId: number): Promise<Persona[]> {
    return Array.from(this.personas.values())
      .filter(persona => persona.user_id === userId);
  }

  async updatePersona(id: number, updates: Partial<InsertPersona>): Promise<Persona> {
    const persona = this.personas.get(id);
    if (!persona) {
      throw new Error(`Persona with id ${id} not found`);
    }
    
    const updatedPersona = {
      ...persona,
      ...updates
    };
    
    this.personas.set(id, updatedPersona);
    return updatedPersona;
  }
  
  async deletePersona(id: number): Promise<void> {
    if (!this.personas.has(id)) {
      throw new Error(`Persona with id ${id} not found`);
    }
    this.personas.delete(id);
  }

  async seedPredefinedPersonas(userId: number): Promise<Persona[]> {
    const createdPersonas: Persona[] = [];
    
    for (const predefinedPersona of predefinedPersonas) {
      const persona = await this.createPersona({
        user_id: userId,
        name: predefinedPersona.name,
        description: predefinedPersona.description,
        interests: predefinedPersona.interests,
        is_selected: false
      });
      
      createdPersonas.push(persona);
    }
    
    return createdPersonas;
  }

  // Content methods
  async createGeneratedContent(content: InsertGeneratedContent): Promise<GeneratedContent> {
    const id = this.contentIdCounter++;
    const now = new Date();
    const newContent: GeneratedContent = {
      ...content,
      id,
      created_at: now
    };
    this.generatedContents.set(id, newContent);
    return newContent;
  }

  async getGeneratedContent(id: number): Promise<GeneratedContent | undefined> {
    return this.generatedContents.get(id);
  }

  async getGeneratedContentByUserId(userId: number): Promise<GeneratedContent[]> {
    return Array.from(this.generatedContents.values())
      .filter(content => content.user_id === userId)
      .sort((a, b) => b.created_at.getTime() - a.created_at.getTime());
  }

  // Blog category methods
  async createBlogCategory(category: InsertBlogCategory): Promise<BlogCategory> {
    const id = this.blogCategoryIdCounter++;
    const now = new Date();
    const newCategory: BlogCategory = {
      ...category,
      id,
      created_at: now
    };
    this.blogCategories.set(id, newCategory);
    return newCategory;
  }

  async getBlogCategory(id: number): Promise<BlogCategory | undefined> {
    return this.blogCategories.get(id);
  }

  async getBlogCategoryBySlug(slug: string): Promise<BlogCategory | undefined> {
    return Array.from(this.blogCategories.values()).find(
      (category) => category.slug === slug
    );
  }

  async getAllBlogCategories(): Promise<BlogCategory[]> {
    return Array.from(this.blogCategories.values())
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  async updateBlogCategory(id: number, updates: Partial<InsertBlogCategory>): Promise<BlogCategory> {
    const category = this.blogCategories.get(id);
    if (!category) {
      throw new Error(`Blog category with id ${id} not found`);
    }
    
    const updatedCategory = {
      ...category,
      ...updates
    };
    
    this.blogCategories.set(id, updatedCategory);
    return updatedCategory;
  }

  async deleteBlogCategory(id: number): Promise<void> {
    if (!this.blogCategories.has(id)) {
      throw new Error(`Blog category with id ${id} not found`);
    }
    this.blogCategories.delete(id);
  }

  // Blog post methods
  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const id = this.blogPostIdCounter++;
    const now = new Date();
    const newPost: BlogPost = {
      ...post,
      id,
      created_at: now,
      updated_at: now
    };
    this.blogPosts.set(id, newPost);
    return newPost;
  }

  async getBlogPost(id: number): Promise<BlogPost | undefined> {
    return this.blogPosts.get(id);
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    return Array.from(this.blogPosts.values()).find(
      (post) => post.slug === slug
    );
  }

  async getAllBlogPosts(options?: { 
    published?: boolean; 
    limit?: number; 
    offset?: number;
    categoryId?: number;
  }): Promise<BlogPost[]> {
    let posts = Array.from(this.blogPosts.values());
    
    // Filter by published status if specified
    if (options?.published !== undefined) {
      posts = posts.filter(post => post.published === options.published);
    }
    
    // Filter by category if specified
    if (options?.categoryId !== undefined) {
      posts = posts.filter(post => post.category_id === options.categoryId);
    }
    
    // Sort by publish date or created date, newest first
    posts = posts.sort((a, b) => {
      const dateA = a.publish_date || a.created_at;
      const dateB = b.publish_date || b.created_at;
      return dateB.getTime() - dateA.getTime();
    });
    
    // Apply pagination if specified
    if (options?.offset !== undefined || options?.limit !== undefined) {
      const offset = options?.offset || 0;
      const limit = options?.limit || posts.length;
      posts = posts.slice(offset, offset + limit);
    }
    
    return posts;
  }

  async updateBlogPost(id: number, updates: Partial<InsertBlogPost>): Promise<BlogPost> {
    const post = this.blogPosts.get(id);
    if (!post) {
      throw new Error(`Blog post with id ${id} not found`);
    }
    
    const updatedPost = {
      ...post,
      ...updates,
      updated_at: new Date()
    };
    
    this.blogPosts.set(id, updatedPost);
    return updatedPost;
  }

  async deleteBlogPost(id: number): Promise<void> {
    if (!this.blogPosts.has(id)) {
      throw new Error(`Blog post with id ${id} not found`);
    }
    this.blogPosts.delete(id);
  }
  
  // Lead contact methods
  async createLeadContact(contact: InsertLeadContact): Promise<LeadContact> {
    const id = this.leadContactIdCounter++;
    const now = new Date();
    const newContact: LeadContact = {
      ...contact,
      id,
      created_at: now
    };
    this.leadContacts.set(id, newContact);
    return newContact;
  }

  async getLeadContact(id: number): Promise<LeadContact | undefined> {
    return this.leadContacts.get(id);
  }

  async getAllLeadContacts(options?: {
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<LeadContact[]> {
    let contacts = Array.from(this.leadContacts.values());
    
    // Filter by status if specified
    if (options?.status !== undefined) {
      contacts = contacts.filter(contact => contact.status === options.status);
    }
    
    // Sort by created date, newest first
    contacts = contacts.sort((a, b) => b.created_at.getTime() - a.created_at.getTime());
    
    // Apply pagination if specified
    if (options?.offset !== undefined || options?.limit !== undefined) {
      const offset = options?.offset || 0;
      const limit = options?.limit || contacts.length;
      contacts = contacts.slice(offset, offset + limit);
    }
    
    return contacts;
  }

  async updateLeadContact(id: number, updates: Partial<InsertLeadContact>): Promise<LeadContact> {
    const contact = this.leadContacts.get(id);
    if (!contact) {
      throw new Error(`Lead contact with id ${id} not found`);
    }
    
    const updatedContact = {
      ...contact,
      ...updates
    };
    
    this.leadContacts.set(id, updatedContact);
    return updatedContact;
  }
  
  async deleteLeadContact(id: number): Promise<void> {
    if (!this.leadContacts.has(id)) {
      throw new Error(`Lead contact with id ${id} not found`);
    }
    this.leadContacts.delete(id);
  }
}

import { eq, and, desc, sql } from "drizzle-orm";
import { db } from "./db";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async getUserByStripeCustomerId(customerId: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.stripe_customer_id, customerId));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUserRole(id: number, role: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ role })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async updateUserSubscription(id: number, updates: { 
    plan?: SubscriptionPlanType;
    stripeSubscriptionId?: string;
    status?: string;
    periodEnd?: Date;
  }): Promise<User> {
    // Prepare update data based on which fields are provided
    const updateData: any = {};
    
    if (updates.plan !== undefined) {
      updateData.subscription_plan = updates.plan;
    }
    
    if (updates.stripeSubscriptionId !== undefined) {
      updateData.stripe_subscription_id = updates.stripeSubscriptionId;
    }
    
    if (updates.status !== undefined) {
      updateData.subscription_status = updates.status;
    }
    
    if (updates.periodEnd !== undefined) {
      updateData.subscription_period_end = updates.periodEnd;
    }
    
    const [user] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, id))
      .returning();
    return user;
  }
  
  async updateUserStripeInfo(id: number, customerInfo: { 
    customerId: string; 
    subscriptionId?: string; 
    status?: string; 
    periodEnd?: Date; 
  }): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ 
        stripe_customer_id: customerInfo.customerId,
        stripe_subscription_id: customerInfo.subscriptionId || null,
        subscription_status: customerInfo.status || 'inactive',
        subscription_period_end: customerInfo.periodEnd || null
      })
      .where(eq(users.id, id))
      .returning();
    
    return user;
  }

  async incrementPersonaUsage(id: number): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ 
        personas_used: sql`${users.personas_used} + 1` 
      })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async incrementToneAnalysisUsage(id: number): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ 
        tone_analyses_used: sql`${users.tone_analyses_used} + 1` 
      })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async incrementContentUsage(id: number): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ 
        content_generated: sql`${users.content_generated} + 1` 
      })
      .where(eq(users.id, id))
      .returning();
    return user;
  }
  
  async getAllUsers(): Promise<User[]> {
    return db
      .select()
      .from(users)
      .orderBy(users.created_at);
  }

  // Tone analysis methods
  async createToneAnalysis(analysis: InsertToneAnalysis): Promise<ToneAnalysis> {
    const [toneAnalysis] = await db
      .insert(toneAnalyses)
      .values(analysis)
      .returning();
    return toneAnalysis;
  }

  async getToneAnalysis(id: number): Promise<ToneAnalysis | undefined> {
    const [toneAnalysis] = await db
      .select()
      .from(toneAnalyses)
      .where(eq(toneAnalyses.id, id));
    return toneAnalysis;
  }

  async getToneAnalysesByUserId(userId: number): Promise<ToneAnalysis[]> {
    return db
      .select()
      .from(toneAnalyses)
      .where(eq(toneAnalyses.user_id, userId))
      .orderBy(desc(toneAnalyses.created_at));
  }

  async updateToneAnalysis(id: number, updates: Partial<InsertToneAnalysis>): Promise<ToneAnalysis> {
    const [toneAnalysis] = await db
      .update(toneAnalyses)
      .set(updates)
      .where(eq(toneAnalyses.id, id))
      .returning();
    
    if (!toneAnalysis) {
      throw new Error(`Tone analysis with id ${id} not found`);
    }
    
    return toneAnalysis;
  }

  // Persona methods
  async createPersona(persona: InsertPersona): Promise<Persona> {
    const [newPersona] = await db
      .insert(personas)
      .values(persona)
      .returning();
    return newPersona;
  }

  async getPersona(id: number): Promise<Persona | undefined> {
    const [persona] = await db
      .select()
      .from(personas)
      .where(eq(personas.id, id));
    return persona;
  }

  async getPersonasByUserId(userId: number): Promise<Persona[]> {
    return db
      .select()
      .from(personas)
      .where(eq(personas.user_id, userId));
  }

  async updatePersona(id: number, updates: Partial<InsertPersona>): Promise<Persona> {
    const [persona] = await db
      .update(personas)
      .set(updates)
      .where(eq(personas.id, id))
      .returning();
    
    if (!persona) {
      throw new Error(`Persona with id ${id} not found`);
    }
    
    return persona;
  }

  async deletePersona(id: number): Promise<void> {
    console.log("Delete persona request received for ID:", id);
    console.log("Authentication status:", !!process);

    const [personaToDelete] = await db
      .select()
      .from(personas)
      .where(eq(personas.id, id));
      
    if (!personaToDelete) {
      throw new Error(`Persona with id ${id} not found`);
    }
    
    console.log("User ID:", personaToDelete.user_id);
    console.log("Persona to delete:", personaToDelete);
    
    await db
      .delete(personas)
      .where(eq(personas.id, id));
      
    console.log("Persona deleted successfully");
  }

  async seedPredefinedPersonas(userId: number): Promise<Persona[]> {
    // Check if the user already has predefined personas
    const existingPersonas = await db
      .select()
      .from(personas)
      .where(eq(personas.user_id, userId));
    
    if (existingPersonas.length > 0) {
      return existingPersonas;
    }
    
    // Add predefined personas
    const personasToAdd = predefinedPersonas.map(p => ({
      ...p,
      user_id: userId
    }));
    
    return db
      .insert(personas)
      .values(personasToAdd)
      .returning();
  }

  // Content methods
  async createGeneratedContent(content: InsertGeneratedContent): Promise<GeneratedContent> {
    const [newContent] = await db
      .insert(generatedContent)
      .values(content)
      .returning();
    return newContent;
  }

  async getGeneratedContent(id: number): Promise<GeneratedContent | undefined> {
    const [content] = await db
      .select()
      .from(generatedContent)
      .where(eq(generatedContent.id, id));
    return content;
  }

  async getGeneratedContentByUserId(userId: number): Promise<GeneratedContent[]> {
    return db
      .select()
      .from(generatedContent)
      .where(eq(generatedContent.user_id, userId))
      .orderBy(desc(generatedContent.created_at));
  }

  // Blog category methods
  async createBlogCategory(category: InsertBlogCategory): Promise<BlogCategory> {
    const [newCategory] = await db
      .insert(blogCategories)
      .values(category)
      .returning();
    return newCategory;
  }

  async getBlogCategory(id: number): Promise<BlogCategory | undefined> {
    const [category] = await db
      .select()
      .from(blogCategories)
      .where(eq(blogCategories.id, id));
    return category;
  }

  async getBlogCategoryBySlug(slug: string): Promise<BlogCategory | undefined> {
    const [category] = await db
      .select()
      .from(blogCategories)
      .where(eq(blogCategories.slug, slug));
    return category;
  }

  async getAllBlogCategories(): Promise<BlogCategory[]> {
    return db.select().from(blogCategories);
  }

  async updateBlogCategory(id: number, updates: Partial<InsertBlogCategory>): Promise<BlogCategory> {
    const [category] = await db
      .update(blogCategories)
      .set(updates)
      .where(eq(blogCategories.id, id))
      .returning();
    
    if (!category) {
      throw new Error(`Blog category with id ${id} not found`);
    }
    
    return category;
  }

  async deleteBlogCategory(id: number): Promise<void> {
    await db
      .delete(blogCategories)
      .where(eq(blogCategories.id, id));
  }

  // Blog post methods
  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const [newPost] = await db
      .insert(blogPosts)
      .values(post)
      .returning();
    return newPost;
  }

  async getBlogPost(id: number): Promise<BlogPost | undefined> {
    const [post] = await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.id, id));
    return post;
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const [post] = await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.slug, slug));
    return post;
  }

  async getAllBlogPosts(options?: { 
    published?: boolean; 
    limit?: number; 
    offset?: number;
    categoryId?: number;
  }): Promise<BlogPost[]> {
    let query = db.select().from(blogPosts);
    
    if (options?.published !== undefined) {
      query = query.where(eq(blogPosts.published, options.published));
    }
    
    if (options?.categoryId !== undefined) {
      query = query.where(eq(blogPosts.category_id, options.categoryId));
    }
    
    query = query.orderBy(desc(blogPosts.created_at));
    
    if (options?.limit !== undefined) {
      query = query.limit(options.limit);
    }
    
    if (options?.offset !== undefined) {
      query = query.offset(options.offset);
    }
    
    return query;
  }

  async updateBlogPost(id: number, updates: Partial<InsertBlogPost>): Promise<BlogPost> {
    const [post] = await db
      .update(blogPosts)
      .set(updates)
      .where(eq(blogPosts.id, id))
      .returning();
    
    if (!post) {
      throw new Error(`Blog post with id ${id} not found`);
    }
    
    return post;
  }

  async deleteBlogPost(id: number): Promise<void> {
    await db
      .delete(blogPosts)
      .where(eq(blogPosts.id, id));
  }
  
  // Lead contact methods
  async createLeadContact(contact: InsertLeadContact): Promise<LeadContact> {
    const [newContact] = await db
      .insert(leadContacts)
      .values(contact)
      .returning();
    return newContact;
  }

  async getLeadContact(id: number): Promise<LeadContact | undefined> {
    const [contact] = await db
      .select()
      .from(leadContacts)
      .where(eq(leadContacts.id, id));
    return contact;
  }

  async getAllLeadContacts(options?: {
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<LeadContact[]> {
    let query = db.select().from(leadContacts);
    
    if (options?.status !== undefined) {
      query = query.where(eq(leadContacts.status, options.status));
    }
    
    query = query.orderBy(desc(leadContacts.created_at));
    
    if (options?.limit !== undefined) {
      query = query.limit(options.limit);
    }
    
    if (options?.offset !== undefined) {
      query = query.offset(options.offset);
    }
    
    return query;
  }

  async updateLeadContact(id: number, updates: Partial<InsertLeadContact>): Promise<LeadContact> {
    const [contact] = await db
      .update(leadContacts)
      .set(updates)
      .where(eq(leadContacts.id, id))
      .returning();
    
    if (!contact) {
      throw new Error(`Lead contact with id ${id} not found`);
    }
    
    return contact;
  }
  
  async deleteLeadContact(id: number): Promise<void> {
    const [contactToDelete] = await db
      .select()
      .from(leadContacts)
      .where(eq(leadContacts.id, id));
      
    if (!contactToDelete) {
      throw new Error(`Lead contact with id ${id} not found`);
    }
    
    await db
      .delete(leadContacts)
      .where(eq(leadContacts.id, id));
  }
}

// Use DatabaseStorage to persist data to Postgres
export const storage = new DatabaseStorage();
