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
  campaignFactoryCampaigns,
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
  type CampaignFactory,
  type InsertCampaignFactory,
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
  incrementCampaignFactoryUsage(id: number): Promise<User>;
  getAllUsers(): Promise<User[]>;
  updateUserPassword(userId: number, hashedPassword: string): Promise<User>;
  deleteUser(id: number): Promise<boolean>;
  adminCreateUser(user: InsertUser): Promise<User>;
  
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
  
  // Campaign Factory methods
  createCampaignFactory(campaign: InsertCampaignFactory): Promise<CampaignFactory>;
  getCampaignFactory(id: number): Promise<CampaignFactory | undefined>;
  getCampaignFactoriesByUserId(userId: number): Promise<CampaignFactory[]>;
  updateCampaignFactory(id: number, updates: Partial<InsertCampaignFactory>): Promise<CampaignFactory>;
  deleteCampaignFactory(id: number): Promise<void>;
  
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
  private campaignFactories: Map<number, CampaignFactory>;
  private leadContacts: Map<number, LeadContact>;
  private userIdCounter: number;
  private toneAnalysisIdCounter: number;
  private personaIdCounter: number;
  private contentIdCounter: number;
  private blogCategoryIdCounter: number;
  private blogPostIdCounter: number;
  private campaignIdCounter: number;
  private campaignContentIdCounter: number;
  private campaignFactoryIdCounter: number;
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
    this.campaignFactories = new Map();
    this.leadContacts = new Map();
    this.userIdCounter = 1;
    this.toneAnalysisIdCounter = 1;
    this.personaIdCounter = 1;
    this.contentIdCounter = 1;
    this.blogCategoryIdCounter = 1;
    this.blogPostIdCounter = 1;
    this.campaignIdCounter = 1;
    this.campaignContentIdCounter = 1;
    this.campaignFactoryIdCounter = 1;
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
      campaigns_used: 0,
      campaign_factory_used: 0,
      stripe_customer_id: null,
      stripe_subscription_id: null,
      subscription_status: "inactive",
      subscription_period_end: null,
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
  
  async incrementCampaignFactoryUsage(id: number): Promise<User> {
    const user = this.users.get(id);
    if (!user) {
      throw new Error(`User with id ${id} not found`);
    }
    
    // If campaign_factory_used doesn't exist, initialize it
    const campaign_factory_used = user.campaign_factory_used || 0;
    
    const updatedUser = {
      ...user,
      campaign_factory_used: campaign_factory_used + 1
    };
    
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  
  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values())
      .sort((a, b) => a.created_at.getTime() - b.created_at.getTime());
  }
  
  async deleteUser(id: number): Promise<boolean> {
    try {
      const user = this.users.get(id);
      if (!user) {
        throw new Error(`User with id ${id} not found`);
      }
      
      // Delete related data
      // Personas
      for (const [personaId, persona] of this.personas.entries()) {
        if (persona.user_id === id) {
          this.personas.delete(personaId);
        }
      }
      
      // Tone analyses
      for (const [analysisId, analysis] of this.toneAnalyses.entries()) {
        if (analysis.user_id === id) {
          this.toneAnalyses.delete(analysisId);
        }
      }
      
      // Generated contents
      for (const [contentId, content] of this.generatedContents.entries()) {
        if (content.user_id === id) {
          this.generatedContents.delete(contentId);
        }
      }
      
      // Campaigns
      for (const [campaignId, campaign] of this.campaigns.entries()) {
        if (campaign.user_id === id) {
          // Delete campaign contents
          for (const [contentId, campaignContent] of this.campaignContents.entries()) {
            if (campaignContent.campaign_id === campaignId) {
              this.campaignContents.delete(contentId);
            }
          }
          this.campaigns.delete(campaignId);
        }
      }
      
      // Delete the user
      this.users.delete(id);
      
      return true;
    } catch (error) {
      console.error(`Error deleting user with ID ${id}:`, error);
      return false;
    }
  }
  
  async adminCreateUser(insertUser: InsertUser): Promise<User> {
    return this.createUser(insertUser);
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
  
  // Campaign methods
  async createCampaign(campaign: InsertCampaign): Promise<Campaign> {
    const id = this.campaignIdCounter++;
    const now = new Date();
    const newCampaign: Campaign = {
      ...campaign,
      id,
      created_at: now
    };
    this.campaigns.set(id, newCampaign);
    return newCampaign;
  }

  async getCampaign(id: number): Promise<Campaign | undefined> {
    return this.campaigns.get(id);
  }

  async getCampaignsByUserId(userId: number): Promise<Campaign[]> {
    return Array.from(this.campaigns.values())
      .filter(campaign => campaign.user_id === userId)
      .sort((a, b) => b.created_at.getTime() - a.created_at.getTime());
  }

  async updateCampaign(id: number, updates: Partial<InsertCampaign>): Promise<Campaign> {
    const campaign = this.campaigns.get(id);
    if (!campaign) {
      throw new Error(`Campaign with id ${id} not found`);
    }
    
    const updatedCampaign = {
      ...campaign,
      ...updates
    };
    
    this.campaigns.set(id, updatedCampaign);
    return updatedCampaign;
  }
  
  async deleteCampaign(id: number): Promise<void> {
    if (!this.campaigns.has(id)) {
      throw new Error(`Campaign with id ${id} not found`);
    }
    this.campaigns.delete(id);
  }
  
  // Campaign content methods
  async addContentToCampaign(campaignContent: InsertCampaignContent): Promise<CampaignContent> {
    const { campaign_id, content_id } = campaignContent;
    
    // Check if the relation already exists to avoid duplicates
    const existingRelation = Array.from(this.campaignContents.values()).find(
      cc => cc.campaign_id === campaign_id && cc.content_id === content_id
    );
    
    if (existingRelation) {
      return existingRelation;
    }
    
    const id = this.campaignContentIdCounter++;
    const now = new Date();
    const newRelation: CampaignContent = {
      id,
      campaign_id,
      content_id,
      created_at: now
    };
    
    this.campaignContents.set(id, newRelation);
    return newRelation;
  }
  
  async getCampaignContents(campaignId: number): Promise<GeneratedContent[]> {
    // First, get all campaign-content relations for this campaign
    const relations = Array.from(this.campaignContents.values())
      .filter(cc => cc.campaign_id === campaignId);
    
    // Then, fetch the actual content items
    const contentIds = relations.map(r => r.content_id);
    const contents = Array.from(this.generatedContents.values())
      .filter(content => contentIds.includes(content.id))
      .sort((a, b) => b.created_at.getTime() - a.created_at.getTime());
    
    return contents;
  }
  
  async removeContentFromCampaign(campaignId: number, contentId: number): Promise<void> {
    // Find the relation to remove
    const relationToRemove = Array.from(this.campaignContents.values()).find(
      cc => cc.campaign_id === campaignId && cc.content_id === contentId
    );
    
    if (!relationToRemove) {
      throw new Error(`Content with id ${contentId} is not associated with campaign ${campaignId}`);
    }
    
    this.campaignContents.delete(relationToRemove.id);
  }
  
  async deleteCampaignContents(campaignId: number): Promise<void> {
    // Find all relations for this campaign
    const relationsToRemove = Array.from(this.campaignContents.values())
      .filter(cc => cc.campaign_id === campaignId);
    
    // Delete each relation
    for (const relation of relationsToRemove) {
      this.campaignContents.delete(relation.id);
    }
  }
  
  // Campaign Factory methods
  async createCampaignFactory(campaign: InsertCampaignFactory): Promise<CampaignFactory> {
    const id = this.campaignFactoryIdCounter++;
    const now = new Date();
    const newCampaign: CampaignFactory = {
      ...campaign,
      id,
      created_at: now,
      updated_at: now
    };
    this.campaignFactories.set(id, newCampaign);
    return newCampaign;
  }

  async getCampaignFactory(id: number): Promise<CampaignFactory | undefined> {
    return this.campaignFactories.get(id);
  }

  async getCampaignFactoriesByUserId(userId: number): Promise<CampaignFactory[]> {
    return Array.from(this.campaignFactories.values())
      .filter(campaign => campaign.user_id === userId)
      .sort((a, b) => b.created_at.getTime() - a.created_at.getTime());
  }

  async updateCampaignFactory(id: number, updates: Partial<InsertCampaignFactory>): Promise<CampaignFactory> {
    const campaign = this.campaignFactories.get(id);
    if (!campaign) {
      throw new Error(`Campaign factory with id ${id} not found`);
    }
    
    const updatedCampaign = {
      ...campaign,
      ...updates,
      updated_at: new Date()
    };
    
    this.campaignFactories.set(id, updatedCampaign);
    return updatedCampaign;
  }
  
  async deleteCampaignFactory(id: number): Promise<void> {
    if (!this.campaignFactories.has(id)) {
      throw new Error(`Campaign factory with id ${id} not found`);
    }
    this.campaignFactories.delete(id);
  }
  
  async updateUserPassword(userId: number, hashedPassword: string): Promise<User> {
    const user = this.users.get(userId);
    
    if (!user) {
      throw new Error(`User with id ${userId} not found`);
    }
    
    const updatedUser = {
      ...user,
      password: hashedPassword
    };
    
    this.users.set(userId, updatedUser);
    return updatedUser;
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
  
  async incrementCampaignUsage(id: number): Promise<User> {
    try {
      // First, check if the column exists
      const columnCheck = await db.execute(sql`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'campaigns_used'
      `);
      
      if (!columnCheck.rows || columnCheck.rows.length === 0) {
        console.warn('Campaigns_used column missing, attempting to create it...');
        
        // Try to add the column if it doesn't exist
        try {
          await db.execute(sql`
            ALTER TABLE users
            ADD COLUMN campaigns_used INTEGER NOT NULL DEFAULT 0
          `);
          console.log('Successfully added campaigns_used column to users table.');
        } catch (migrationError) {
          console.error('Failed to add campaigns_used column:', migrationError);
          // Fall back to just returning the user without incrementing
          const [user] = await db
            .select()
            .from(users)
            .where(eq(users.id, id));
          return user;
        }
      }
      
      // Now try to increment the column
      const [user] = await db
        .update(users)
        .set({ 
          campaigns_used: sql`COALESCE(${users.campaigns_used}, 0) + 1` 
        })
        .where(eq(users.id, id))
        .returning();
      return user;
    } catch (error) {
      console.error('Error in incrementCampaignUsage:', error);
      // If anything fails, just return the user without incrementing
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, id));
      return user;
    }
  }
  
  async incrementCampaignFactoryUsage(id: number): Promise<User> {
    try {
      // First, check if the column exists
      const columnCheck = await db.execute(sql`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'campaign_factory_used'
      `);
      
      if (!columnCheck.rows || columnCheck.rows.length === 0) {
        console.warn('campaign_factory_used column missing, attempting to create it...');
        
        // Try to add the column if it doesn't exist
        try {
          await db.execute(sql`
            ALTER TABLE users
            ADD COLUMN campaign_factory_used INTEGER NOT NULL DEFAULT 0
          `);
          console.log('Successfully added campaign_factory_used column to users table.');
        } catch (migrationError) {
          console.error('Failed to add campaign_factory_used column:', migrationError);
          // Fall back to just returning the user without incrementing
          const [user] = await db
            .select()
            .from(users)
            .where(eq(users.id, id));
          return user;
        }
      }
      
      // Now try to increment the column
      const [user] = await db
        .update(users)
        .set({ 
          campaign_factory_used: sql`COALESCE(${users.campaign_factory_used}, 0) + 1` 
        })
        .where(eq(users.id, id))
        .returning();
      return user;
    } catch (error) {
      console.error('Error in incrementCampaignFactoryUsage:', error);
      // If anything fails, just return the user without incrementing
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, id));
      return user;
    }
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
  
  // Campaign methods
  async createCampaign(campaign: InsertCampaign): Promise<Campaign> {
    const [newCampaign] = await db
      .insert(campaigns)
      .values(campaign)
      .returning();
    return newCampaign;
  }

  async getCampaign(id: number): Promise<Campaign | undefined> {
    const [campaign] = await db
      .select()
      .from(campaigns)
      .where(eq(campaigns.id, id));
    return campaign;
  }

  async getCampaignsByUserId(userId: number): Promise<Campaign[]> {
    return db
      .select()
      .from(campaigns)
      .where(eq(campaigns.user_id, userId))
      .orderBy(desc(campaigns.created_at));
  }

  async updateCampaign(id: number, updates: Partial<InsertCampaign>): Promise<Campaign> {
    const [campaign] = await db
      .update(campaigns)
      .set(updates)
      .where(eq(campaigns.id, id))
      .returning();
    
    if (!campaign) {
      throw new Error(`Campaign with id ${id} not found`);
    }
    
    return campaign;
  }
  
  async deleteCampaign(id: number): Promise<void> {
    const [campaignToDelete] = await db
      .select()
      .from(campaigns)
      .where(eq(campaigns.id, id));
      
    if (!campaignToDelete) {
      throw new Error(`Campaign with id ${id} not found`);
    }
    
    await db
      .delete(campaigns)
      .where(eq(campaigns.id, id));
  }
  
  // Campaign content methods
  async addContentToCampaign(campaignContent: InsertCampaignContent): Promise<CampaignContent> {
    // Check if relation already exists to avoid duplicates
    const existing = await db
      .select()
      .from(campaignContents)
      .where(
        and(
          eq(campaignContents.campaign_id, campaignContent.campaign_id),
          eq(campaignContents.content_id, campaignContent.content_id)
        )
      );
    
    if (existing.length > 0) {
      return existing[0];
    }
    
    const [relation] = await db
      .insert(campaignContents)
      .values(campaignContent)
      .returning();
    
    return relation;
  }
  
  async getCampaignContents(campaignId: number): Promise<GeneratedContent[]> {
    // Get content items that are associated with this campaign
    const contents = await db
      .select({
        content: generatedContent
      })
      .from(campaignContents)
      .innerJoin(
        generatedContent,
        eq(campaignContents.content_id, generatedContent.id)
      )
      .where(eq(campaignContents.campaign_id, campaignId))
      .orderBy(desc(generatedContent.created_at));
    
    // Extract the content objects from the join result
    return contents.map(item => item.content);
  }
  
  async removeContentFromCampaign(campaignId: number, contentId: number): Promise<void> {
    const relation = await db
      .select()
      .from(campaignContents)
      .where(
        and(
          eq(campaignContents.campaign_id, campaignId),
          eq(campaignContents.content_id, contentId)
        )
      );
      
    if (relation.length === 0) {
      throw new Error(`Content with id ${contentId} is not associated with campaign ${campaignId}`);
    }
    
    await db
      .delete(campaignContents)
      .where(
        and(
          eq(campaignContents.campaign_id, campaignId),
          eq(campaignContents.content_id, contentId)
        )
      );
  }
  
  async deleteCampaignContents(campaignId: number): Promise<void> {
    await db
      .delete(campaignContents)
      .where(eq(campaignContents.campaign_id, campaignId));
  }
  
  // Campaign Factory methods
  async createCampaignFactory(campaign: InsertCampaignFactory): Promise<CampaignFactory> {
    const [newCampaign] = await db
      .insert(campaignFactoryCampaigns)
      .values(campaign)
      .returning();
    return newCampaign;
  }

  async getCampaignFactory(id: number): Promise<CampaignFactory | undefined> {
    const [campaign] = await db
      .select()
      .from(campaignFactoryCampaigns)
      .where(eq(campaignFactoryCampaigns.id, id));
    return campaign;
  }

  async getCampaignFactoriesByUserId(userId: number): Promise<CampaignFactory[]> {
    return await db
      .select()
      .from(campaignFactoryCampaigns)
      .where(eq(campaignFactoryCampaigns.user_id, userId))
      .orderBy(desc(campaignFactoryCampaigns.created_at));
  }

  async updateCampaignFactory(id: number, updates: Partial<InsertCampaignFactory>): Promise<CampaignFactory> {
    const [updatedCampaign] = await db
      .update(campaignFactoryCampaigns)
      .set({
        ...updates,
        updated_at: new Date()
      })
      .where(eq(campaignFactoryCampaigns.id, id))
      .returning();
    return updatedCampaign;
  }
  
  async deleteCampaignFactory(id: number): Promise<void> {
    await db
      .delete(campaignFactoryCampaigns)
      .where(eq(campaignFactoryCampaigns.id, id));
  }
  
  async updateUserPassword(userId: number, hashedPassword: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ password: hashedPassword })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async deleteUser(id: number): Promise<boolean> {
    try {
      console.log(`Starting deletion process for user ID ${id}`);
      
      // Begin a transaction to ensure all related data is deleted
      return await db.transaction(async (tx) => {
        // Get user to verify existence
        const [user] = await tx.select().from(users).where(eq(users.id, id));
        
        if (!user) {
          throw new Error(`User with id ${id} not found`);
        }
        
        console.log(`User found, preparing to delete all associated data for user ID ${id}`);
        
        // Get all campaigns for this user for logging purposes
        const userCampaigns = await tx.select().from(campaigns).where(eq(campaigns.user_id, id));
        console.log(`Found ${userCampaigns.length} campaigns to delete for user ID ${id}`);
        
        // First, delete any campaign_contents relationships
        for (const campaign of userCampaigns) {
          const contentRelations = await tx.select().from(campaignContents).where(eq(campaignContents.campaign_id, campaign.id));
          console.log(`Deleting ${contentRelations.length} campaign content relations for campaign ID ${campaign.id}`);
          
          // Delete each content relation
          for (const relation of contentRelations) {
            await tx.delete(campaignContents).where(eq(campaignContents.id, relation.id));
          }
        }
        
        // Now delete all user campaigns
        console.log(`Deleting all campaigns for user ID ${id}`);
        await tx.delete(campaigns).where(eq(campaigns.user_id, id));
        
        // Find and log all generated content
        const userContent = await tx.select().from(generatedContent).where(eq(generatedContent.user_id, id));
        console.log(`Deleting ${userContent.length} generated content items for user ID ${id}`);
        
        // Delete each content item individually to ensure deletion
        for (const content of userContent) {
          await tx.delete(generatedContent).where(eq(generatedContent.id, content.id));
        }
        
        // Find and log all tone analyses
        const userAnalyses = await tx.select().from(toneAnalyses).where(eq(toneAnalyses.user_id, id));
        console.log(`Deleting ${userAnalyses.length} tone analyses for user ID ${id}`);
        
        // Delete each tone analysis individually
        for (const analysis of userAnalyses) {
          await tx.delete(toneAnalyses).where(eq(toneAnalyses.id, analysis.id));
        }
        
        // Find and log all personas
        const userPersonas = await tx.select().from(personas).where(eq(personas.user_id, id));
        console.log(`Deleting ${userPersonas.length} personas for user ID ${id}`);
        
        // Delete each persona individually
        for (const persona of userPersonas) {
          await tx.delete(personas).where(eq(personas.id, persona.id));
        }
        
        // Find and log all blog posts by the user
        const userBlogPosts = await tx.select().from(blogPosts).where(eq(blogPosts.author_id, id));
        console.log(`Deleting ${userBlogPosts.length} blog posts authored by user ID ${id}`);
        
        // Delete each blog post individually
        for (const post of userBlogPosts) {
          await tx.delete(blogPosts).where(eq(blogPosts.id, post.id));
        }
        
        // Finally delete the user
        console.log(`Deleting user account with ID ${id}`);
        await tx.delete(users).where(eq(users.id, id));
        
        console.log(`Successfully completed deletion of user ID ${id} and all associated data`);
        return true;
      });
    } catch (error) {
      console.error(`Error deleting user with ID ${id}:`, error);
      console.error(error instanceof Error ? error.stack : String(error));
      return false;
    }
  }
  
  async adminCreateUser(insertUser: InsertUser): Promise<User> {
    // This is essentially the same as createUser, but separated to make it clear
    // that it's an admin operation and could have different behavior if needed
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
}

// Use DatabaseStorage to persist data to Postgres
export const storage = new DatabaseStorage();
