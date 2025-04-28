import { 
  users, 
  toneAnalyses, 
  personas, 
  generatedContent, 
  type User, 
  type InsertUser, 
  type ToneAnalysis, 
  type InsertToneAnalysis, 
  type Persona, 
  type InsertPersona, 
  type GeneratedContent, 
  type InsertGeneratedContent,
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
  
  // Tone analysis methods
  createToneAnalysis(analysis: InsertToneAnalysis): Promise<ToneAnalysis>;
  getToneAnalysis(id: number): Promise<ToneAnalysis | undefined>;
  getToneAnalysesByUserId(userId: number): Promise<ToneAnalysis[]>;
  
  // Persona methods
  createPersona(persona: InsertPersona): Promise<Persona>;
  getPersona(id: number): Promise<Persona | undefined>;
  getPersonasByUserId(userId: number): Promise<Persona[]>;
  updatePersona(id: number, updates: Partial<InsertPersona>): Promise<Persona>;
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
  private userIdCounter: number;
  private toneAnalysisIdCounter: number;
  private personaIdCounter: number;
  private contentIdCounter: number;
  sessionStore: session.Store;

  constructor() {
    this.users = new Map();
    this.toneAnalyses = new Map();
    this.personas = new Map();
    this.generatedContents = new Map();
    this.userIdCounter = 1;
    this.toneAnalysisIdCounter = 1;
    this.personaIdCounter = 1;
    this.contentIdCounter = 1;
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
      created_at: now
    };
    this.users.set(id, user);
    return user;
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
}

export const storage = new MemStorage();
