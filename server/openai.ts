import { Express, Request, Response } from "express";
import OpenAI from "openai";

// Initialize OpenAI client
let openai: OpenAI | null = null;

// Initialize OpenAI with API key from environment variables
const initializeOpenAI = () => {
  if (!process.env.OPENAI_API_KEY) {
    console.warn("OpenAI API key not found in environment variables");
    return false;
  }
  
  try {
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    console.log("OpenAI API client initialized successfully");
    return true;
  } catch (error) {
    console.error("Error initializing OpenAI API client:", error);
    return false;
  }
};

// Setup OpenAI routes for content generation
export function registerOpenAIRoutes(app: Express) {
  console.log("Registering OpenAI routes");
  
  // Initialize OpenAI client if API key is available
  const isInitialized = initializeOpenAI();
  if (!isInitialized) {
    console.warn("OpenAI features will be unavailable");
  }
  
  // Route for generating campaign content
  app.post("/api/openai/generate", async (req: Request, res: Response) => {
    // Check authentication
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    // Validate required parameters
    const { prompt, campaignType, persona, toneProfile, contentType, maxLength = 1000 } = req.body;
    
    if (!prompt || !contentType) {
      return res.status(400).json({ error: "Missing required parameters (prompt, contentType)" });
    }
    
    // If OpenAI is not initialized, return error
    if (!openai) {
      return res.status(503).json({ 
        error: "OpenAI service is not available. Please check your API key.",
        requires_api_key: true
      });
    }
    
    try {
      // Build prompt based on content type and campaign info
      const systemPrompt = buildSystemPrompt(contentType, campaignType, persona, toneProfile);
      
      // Generate content using OpenAI
      const completion = await openai.chat.completions.create({
        // The newest OpenAI model is "gpt-4o" which was released May 13, 2024
        // Do not change this unless explicitly requested by the user
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt }
        ],
        max_tokens: Math.min(maxLength, 4000), // Ensure we don't exceed API limits
        temperature: 0.7, // Higher creativity for more intelligent content
      });
      
      // Extract the generated content
      const generatedContent = completion.choices[0].message.content;
      
      // Return the generated content
      res.json({ content: generatedContent });
    } catch (error: any) {
      console.error("Error generating content with OpenAI:", error);
      
      if (error.response?.status === 401) {
        return res.status(401).json({ 
          error: "Invalid OpenAI API key. Please provide a valid API key.",
          requires_api_key: true 
        });
      }
      
      res.status(500).json({ 
        error: "Error generating content", 
        details: error.message 
      });
    }
  });
  
  // Route for analyzing tone
  app.post("/api/openai/analyze-tone", async (req: Request, res: Response) => {
    // Check authentication
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    // Validate required parameters
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: "Missing required parameter: text" });
    }
    
    // If OpenAI is not initialized, return error
    if (!openai) {
      return res.status(503).json({ 
        error: "OpenAI service is not available. Please check your API key.",
        requires_api_key: true
      });
    }
    
    try {
      // Generate tone analysis using OpenAI
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { 
            role: "system", 
            content: `Analyze the tone of the following text and provide scores (0-100) for the following dimensions:
              - professional: How formal and business-appropriate the tone is
              - conversational: How casual and approachable the tone is
              - persuasive: How convincing and influential the tone is
              - educational: How informative and instructional the tone is
              - enthusiastic: How energetic and passionate the tone is
              Respond in JSON format only with these five dimensions as keys and scores as values.` 
          },
          { role: "user", content: text }
        ],
        temperature: 0.3, // More consistent results
        response_format: { type: "json_object" },
      });
      
      // Parse the JSON response
      const toneResults = JSON.parse(completion.choices[0].message.content || "{}");
      
      // Return the tone analysis
      res.json(toneResults);
    } catch (error: any) {
      console.error("Error analyzing tone with OpenAI:", error);
      
      if (error.response?.status === 401) {
        return res.status(401).json({ 
          error: "Invalid OpenAI API key. Please provide a valid API key.",
          requires_api_key: true 
        });
      }
      
      res.status(500).json({ 
        error: "Error analyzing tone", 
        details: error.message 
      });
    }
  });
  
  // Route for generating personas
  app.post("/api/openai/generate-persona", async (req: Request, res: Response) => {
    // Check authentication
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    // Validate required parameters
    const { description } = req.body;
    
    if (!description) {
      return res.status(400).json({ error: "Missing required parameter: description" });
    }
    
    // If OpenAI is not initialized, return error
    if (!openai) {
      return res.status(503).json({ 
        error: "OpenAI service is not available. Please check your API key.",
        requires_api_key: true
      });
    }
    
    try {
      // Generate persona using OpenAI
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { 
            role: "system", 
            content: `Create a buyer persona based on the description. Include:
              - name: A professional name appropriate for the role
              - role: Their job title
              - pains: 4-5 specific pain points they face in their role (as an array of strings)
              - goals: 4-5 specific goals they want to achieve (as an array of strings)
              
              Respond in JSON format with these fields.` 
          },
          { role: "user", content: description }
        ],
        temperature: 0.7,
        response_format: { type: "json_object" },
      });
      
      // Parse the JSON response
      const personaData = JSON.parse(completion.choices[0].message.content || "{}");
      
      // Return the generated persona
      res.json(personaData);
    } catch (error: any) {
      console.error("Error generating persona with OpenAI:", error);
      
      if (error.response?.status === 401) {
        return res.status(401).json({ 
          error: "Invalid OpenAI API key. Please provide a valid API key.",
          requires_api_key: true 
        });
      }
      
      res.status(500).json({ 
        error: "Error generating persona", 
        details: error.message 
      });
    }
  });
}

// Helper function to build system prompts based on content type
function buildSystemPrompt(
  contentType: string, 
  campaignType: string, 
  persona: string, 
  toneProfile: any
): string {
  // Default professional tone if none provided
  const tone = toneProfile || {
    professional: 80,
    conversational: 50,
    persuasive: 70,
    educational: 60,
    enthusiastic: 50
  };
  
  // Determine primary tone characteristics based on highest scores
  const toneEntries = Object.entries(tone) as [string, number][];
  const sortedTones = toneEntries.sort((a, b) => b[1] - a[1]);
  const primaryTone = sortedTones[0][0];
  const secondaryTone = sortedTones[1][0];
  
  // Base prompt for all content types
  let basePrompt = `You are an expert marketing copywriter specializing in ${contentType} content for ${campaignType} campaigns.
  
Your primary audience is: ${persona}

Your writing style should be primarily ${primaryTone} and secondarily ${secondaryTone}.
Ensure the content is highly relevant, specific, and tailored to your audience's needs, not your marketing objectives.
Focus on WHAT THE READER CARES ABOUT - never mention your campaign objectives or brief in the content itself.
Avoid generic statements and focus on specifics from the prompt.
DO NOT mention Microsoft, Microsoft 365, or any other product/brand unless specifically mentioned in the prompt.
If regions are mentioned in the prompt, be sure to reference them in your content.
Extract key details from the prompt but NEVER mention the campaign objectives directly in the content.
`;

  // Content-specific instructions
  switch (contentType) {
    case 'email':
      return `${basePrompt}
Create a professional marketing email that resonates with the target audience.
Include a subject line, greeting, body, and sign-off.
The email should be concise (250-400 words) and include a clear call to action.
Focus on benefits rather than features and create a sense of urgency.`;
      
    case 'social':
      return `${basePrompt}
Create an engaging LinkedIn post (not a tweet) that would be appropriate for a company page.
Include relevant hashtags (3-5) at the end.
The post should be 150-300 words and include a thought-provoking question or call to action.
Make it visually scannable with bullet points, numbers, or other formatting as appropriate.`;
      
    case 'blog':
      return `${basePrompt}
Create a professional blog post outline with an engaging title and 4-6 main sections with brief content for each.
Include an introduction and conclusion.
The blog should be informative, providing valuable insights related to the campaign topic.
Use subheadings, bullet points, and other formatting to improve readability.
Include statistics or data points where relevant (you can make these up realistically).`;
      
    case 'webinar':
      return `${basePrompt}
Create a webinar outline including title, duration, target audience, description, agenda (5-6 points), and key takeaways.
The webinar should be educational and provide actionable insights.
Include information about the presenter and registration benefits.
Keep the total word count between 200-350 words.`;
    
    default:
      return basePrompt;
  }
}