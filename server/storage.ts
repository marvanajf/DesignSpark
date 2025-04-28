import { 
  users, 
  toneAnalyses, 
  personas, 
  generatedContent,
  blogCategories,
  blogPosts,
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
  updateUserSubscription(id: number, plan: string): Promise<User>;
  incrementPersonaUsage(id: number): Promise<User>;
  incrementToneAnalysisUsage(id: number): Promise<User>;
  incrementContentUsage(id: number): Promise<User>;
  
  // Tone analysis methods
  createToneAnalysis(analysis: InsertToneAnalysis): Promise<ToneAnalysis>;
  getToneAnalysis(id: number): Promise<ToneAnalysis | undefined>;
  getToneAnalysesByUserId(userId: number): Promise<ToneAnalysis[]>;
  
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
  private userIdCounter: number;
  private toneAnalysisIdCounter: number;
  private personaIdCounter: number;
  private contentIdCounter: number;
  private blogCategoryIdCounter: number;
  private blogPostIdCounter: number;
  sessionStore: session.Store;

  constructor() {
    this.users = new Map();
    this.toneAnalyses = new Map();
    this.personas = new Map();
    this.generatedContents = new Map();
    this.blogCategories = new Map();
    this.blogPosts = new Map();
    this.userIdCounter = 1;
    this.toneAnalysisIdCounter = 1;
    this.personaIdCounter = 1;
    this.contentIdCounter = 1;
    this.blogCategoryIdCounter = 1;
    this.blogPostIdCounter = 1;
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
  
  async updateUserSubscription(id: number, plan: string): Promise<User> {
    const user = this.users.get(id);
    if (!user) {
      throw new Error(`User with id ${id} not found`);
    }
    
    const updatedUser = {
      ...user,
      subscription_plan: plan
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
}

export const storage = new MemStorage();
