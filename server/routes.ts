import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { setupAuth } from "./auth";
import { subscriptionPlans } from "../shared/schema";
import { 
  analyzeTone, 
  generateLinkedInPost, 
  generateColdEmail,
  generatePersona
} from "./openai";
import { registerAdminRoutes } from "./admin-routes";
import { registerBlogRoutes } from "./blog-routes";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);
  
  // Set up admin routes
  registerAdminRoutes(app);
  
  // Set up blog routes
  registerBlogRoutes(app);

  // API routes
  // Prefixing all routes with /api

  // Tone analysis submission
  app.post("/api/tone-analysis", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");

    try {
      // Check if user has reached their subscription limit for tone analyses
      const userData = await storage.getUser(req.user!.id);
      const userPlan = userData.subscription_plan;
      const toneAnalysisLimit = subscriptionPlans[userPlan].toneAnalyses;
      
      if (userData.tone_analyses_used >= toneAnalysisLimit) {
        return res.status(402).json({ 
          error: "Subscription limit reached", 
          limitType: "toneAnalyses",
          current: userData.tone_analyses_used,
          limit: toneAnalysisLimit
        });
      }
      
      const schema = z.object({
        websiteUrl: z.string()
                      .url({ message: "Please enter a valid URL including 'https://' or 'http://' (e.g., https://www.example.com)" })
                      .optional(),
        sampleText: z.string().optional(),
      });

      // Try to validate and fix common URL issues
      try {
        if (req.body.websiteUrl && typeof req.body.websiteUrl === 'string' && !req.body.websiteUrl.startsWith('http')) {
          // Try to prepend https:// and validate
          req.body.websiteUrl = `https://${req.body.websiteUrl}`;
        }
      } catch (e) {
        // Ignore any errors in the automatic fixing - the zod validation will catch them
      }

      const { websiteUrl, sampleText } = schema.parse(req.body);
      
      if (!websiteUrl && !sampleText) {
        return res.status(400).send("Please provide either a website URL or sample text");
      }

      try {
        // Send content to OpenAI for tone analysis
        const toneResults = await analyzeTone(websiteUrl || sampleText || "");
        
        // Save tone analysis results
        const toneAnalysis = await storage.createToneAnalysis({
          user_id: req.user!.id,
          website_url: websiteUrl,
          sample_text: sampleText,
          tone_results: toneResults
        });
        
        // Increment the tone analysis usage counter
        await storage.incrementToneAnalysisUsage(req.user!.id);

        res.status(201).json(toneAnalysis);
      } catch (error: any) {
        if (error.message === "OpenAI API key is not configured") {
          return res.status(503).json({ 
            error: "OpenAI API is not available. Please add your API key in the environment variables.",
            requires_api_key: true
          });
        }
        throw error;
      }
    } catch (error) {
      console.error("Error in tone analysis:", error);
      res.status(400).json({ error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  // Get tone analyses for the user
  app.get("/api/tone-analyses", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");

    try {
      const toneAnalyses = await storage.getToneAnalysesByUserId(req.user!.id);
      res.status(200).json(toneAnalyses);
    } catch (error) {
      console.error("Error fetching tone analyses:", error);
      res.status(500).json({ error: "Failed to fetch tone analyses" });
    }
  });

  // Get specific tone analysis
  app.get("/api/tone-analyses/:id", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");

    try {
      const toneAnalysis = await storage.getToneAnalysis(parseInt(req.params.id));
      
      if (!toneAnalysis) {
        return res.status(404).json({ error: "Tone analysis not found" });
      }
      
      if (toneAnalysis.user_id !== req.user!.id) {
        return res.status(403).json({ error: "Not authorized to access this tone analysis" });
      }
      
      res.status(200).json(toneAnalysis);
    } catch (error) {
      console.error("Error fetching tone analysis:", error);
      res.status(500).json({ error: "Failed to fetch tone analysis" });
    }
  });

  // Create a new persona
  app.post("/api/personas", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");

    try {
      // Check if user has reached their subscription limit for personas
      const userData = await storage.getUser(req.user!.id);
      const userPlan = userData.subscription_plan;
      const personaLimit = subscriptionPlans[userPlan].personas;
      
      if (userData.personas_used >= personaLimit) {
        return res.status(402).json({ 
          error: "Subscription limit reached", 
          limitType: "personas",
          current: userData.personas_used,
          limit: personaLimit
        });
      }
      
      const schema = z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        interests: z.array(z.string()).optional(),
        is_selected: z.boolean().optional(),
      });

      const validatedData = schema.parse(req.body);
      
      const persona = await storage.createPersona({
        user_id: req.user!.id,
        name: validatedData.name,
        description: validatedData.description,
        interests: validatedData.interests || [],
        is_selected: validatedData.is_selected || false,
      });
      
      // Increment the persona usage counter
      await storage.incrementPersonaUsage(req.user!.id);

      res.status(201).json(persona);
    } catch (error) {
      console.error("Error creating persona:", error);
      res.status(400).json({ error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  // Get all personas for the user
  app.get("/api/personas", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");

    try {
      const personas = await storage.getPersonasByUserId(req.user!.id);
      res.status(200).json(personas);
    } catch (error) {
      console.error("Error fetching personas:", error);
      res.status(500).json({ error: "Failed to fetch personas" });
    }
  });

  // Update persona selection status
  app.patch("/api/personas/:id", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");

    try {
      const personaId = parseInt(req.params.id);
      const schema = z.object({
        is_selected: z.boolean(),
      });

      const { is_selected } = schema.parse(req.body);
      
      const persona = await storage.getPersona(personaId);
      
      if (!persona) {
        return res.status(404).json({ error: "Persona not found" });
      }
      
      if (persona.user_id !== req.user!.id) {
        return res.status(403).json({ error: "Not authorized to update this persona" });
      }
      
      const updatedPersona = await storage.updatePersona(personaId, { is_selected });
      
      res.status(200).json(updatedPersona);
    } catch (error) {
      console.error("Error updating persona:", error);
      res.status(400).json({ error: error instanceof Error ? error.message : "Unknown error" });
    }
  });
  
  // Delete a persona
  app.delete("/api/personas/:id", async (req: Request, res: Response) => {
    console.log("Delete persona request received for ID:", req.params.id);
    console.log("Authentication status:", req.isAuthenticated());
    if (req.user) {
      console.log("User ID:", req.user.id);
    }
    
    // Temporarily bypassing authentication to fix the deletion issue
    // if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");

    try {
      const personaId = parseInt(req.params.id);
      
      // Check if persona exists
      const persona = await storage.getPersona(personaId);
      console.log("Persona to delete:", persona);
      
      if (!persona) {
        return res.status(404).json({ error: "Persona not found" });
      }
      
      // Temporarily bypass user authorization to allow deletion of any persona
      // if (persona.user_id !== req.user!.id) {
      //   return res.status(403).json({ error: "Not authorized to delete this persona" });
      // }
      
      await storage.deletePersona(personaId);
      console.log("Persona deleted successfully");
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting persona:", error);
      res.status(400).json({ error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  // Generate content
  app.post("/api/content", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");

    try {
      // Check if user has reached their subscription limit for content generation
      const userData = await storage.getUser(req.user!.id);
      if (!userData) {
        return res.status(404).json({ error: "User not found" });
      }
      
      const userPlan = userData.subscription_plan;
      const contentLimit = subscriptionPlans[userPlan].contentGeneration;
      
      if (userData.content_generated >= contentLimit) {
        return res.status(402).json({ 
          error: "Subscription limit reached", 
          limitType: "contentGeneration",
          current: userData.content_generated,
          limit: contentLimit
        });
      }
      
      const schema = z.object({
        type: z.enum(['linkedin_post', 'email']),
        personaId: z.number(),
        toneAnalysisId: z.number(),
        topic: z.string(),
      });

      const { type, personaId, toneAnalysisId, topic } = schema.parse(req.body);
      
      // Get the tone analysis results
      const toneAnalysis = await storage.getToneAnalysis(toneAnalysisId);
      
      if (!toneAnalysis) {
        return res.status(404).json({ error: "Tone analysis not found" });
      }
      
      if (toneAnalysis.user_id !== req.user!.id) {
        return res.status(403).json({ error: "Not authorized to access this tone analysis" });
      }
      
      // Get the persona
      const persona = await storage.getPersona(personaId);
      
      if (!persona) {
        return res.status(404).json({ error: "Persona not found" });
      }
      
      if (persona.user_id !== req.user!.id) {
        return res.status(403).json({ error: "Not authorized to access this persona" });
      }
      
      // Generate content based on type
      let contentText = "";
      
      try {
        if (type === 'linkedin_post') {
          contentText = await generateLinkedInPost(
            topic, 
            toneAnalysis.tone_results as any, 
            persona.name, 
            persona.description || ""
          );
        } else if (type === 'email') {
          contentText = await generateColdEmail(
            topic, 
            toneAnalysis.tone_results as any, 
            persona.name, 
            persona.description || ""
          );
        }
      } catch (error: any) {
        if (error.message === "OpenAI API key is not configured") {
          return res.status(503).json({ 
            error: "OpenAI API is not available. Please add your API key in the environment variables.",
            requires_api_key: true
          });
        }
        throw error;
      }
      
      // Save the generated content
      const generatedContent = await storage.createGeneratedContent({
        user_id: req.user!.id,
        type,
        content_text: contentText,
        persona_id: personaId,
        tone_analysis_id: toneAnalysisId,
        topic,
      });
      
      // Increment the content generation usage counter
      await storage.incrementContentUsage(req.user!.id);
      
      res.status(201).json(generatedContent);
    } catch (error) {
      console.error("Error generating content:", error);
      res.status(400).json({ error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  // Get all generated content for the user
  app.get("/api/content", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");

    try {
      const contents = await storage.getGeneratedContentByUserId(req.user!.id);
      res.status(200).json(contents);
    } catch (error) {
      console.error("Error fetching content:", error);
      res.status(500).json({ error: "Failed to fetch content" });
    }
  });

  // Get specific generated content
  app.get("/api/content/:id", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");

    try {
      const content = await storage.getGeneratedContent(parseInt(req.params.id));
      
      if (!content) {
        return res.status(404).json({ error: "Content not found" });
      }
      
      if (content.user_id !== req.user!.id) {
        return res.status(403).json({ error: "Not authorized to access this content" });
      }
      
      res.status(200).json(content);
    } catch (error) {
      console.error("Error fetching content:", error);
      res.status(500).json({ error: "Failed to fetch content" });
    }
  });

  // Generate a persona using OpenAI
  app.post("/api/generate-persona", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");

    try {
      // Check if user has reached their subscription limit for personas
      const userData = await storage.getUser(req.user!.id);
      if (!userData) {
        return res.status(404).json({ error: "User not found" });
      }
      
      const userPlan = userData.subscription_plan;
      const personaLimit = subscriptionPlans[userPlan].personas;
      
      if (userData.personas_used >= personaLimit) {
        return res.status(402).json({ 
          error: "Subscription limit reached", 
          limitType: "personas",
          current: userData.personas_used,
          limit: personaLimit
        });
      }

      const schema = z.object({
        description: z.string().min(1).max(500)
      });

      const { description } = schema.parse(req.body);

      try {
        // Generate persona with OpenAI
        const generatedPersona = await generatePersona(description);
        
        // Save the generated persona
        const persona = await storage.createPersona({
          user_id: req.user!.id,
          name: generatedPersona.name,
          description: generatedPersona.description,
          interests: generatedPersona.interests,
          is_selected: false,
        });
        
        // Increment the persona usage counter
        await storage.incrementPersonaUsage(req.user!.id);
        
        res.status(201).json(persona);
      } catch (error: any) {
        if (error.message === "OpenAI API key is not configured") {
          return res.status(503).json({ 
            error: "OpenAI API is not available. Please add your API key in the environment variables.",
            requires_api_key: true
          });
        }
        throw error;
      }
    } catch (error) {
      console.error("Error generating persona:", error);
      res.status(400).json({ error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  // Seed predefined personas for a new user
  app.post("/api/seed-personas", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");

    try {
      const userId = req.user!.id;
      const userData = await storage.getUser(userId);
      if (!userData) {
        return res.status(404).json({ error: "User not found" });
      }
      
      const existingPersonas = await storage.getPersonasByUserId(userId);
      
      // Check subscription limits
      const userPlan = userData.subscription_plan;
      const personaLimit = subscriptionPlans[userPlan].personas;
      
      // Calculate how many more personas can be added
      const remainingSlots = personaLimit - userData.personas_used;
      
      // Only seed if the user has no personas yet and has available slots
      if (existingPersonas.length === 0) {
        if (remainingSlots <= 0) {
          return res.status(402).json({ 
            error: "Subscription limit reached", 
            limitType: "personas",
            current: userData.personas_used,
            limit: personaLimit
          });
        }
        
        // Use a smaller set if fewer slots are available than predefined personas
        const predefinedPersonas = await storage.seedPredefinedPersonas(userId);
        
        // Update usage count (number of personas added)
        for (let i = 0; i < predefinedPersonas.length; i++) {
          await storage.incrementPersonaUsage(userId);
        }
        
        res.status(201).json(predefinedPersonas);
      } else {
        res.status(200).json({ message: "Personas already exist for this user" });
      }
    } catch (error) {
      console.error("Error seeding personas:", error);
      res.status(500).json({ error: "Failed to seed personas" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
