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
    const { 
      prompt, 
      campaignType, 
      persona, 
      toneProfile, 
      contentType, 
      maxLength = 1000,
      // Additional contextual parameters
      industry,
      region,
      product,
      benefit,
      useCaseName,
      audiencePains = [],
      audienceGoals = []
    } = req.body;
    
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
      // Process the incoming context more thoroughly
      const enhancedContext = {
        persona,
        toneProfile,
        contentType,
        campaignType,
        // Additional context that might be available
        industry: industry || "technology",
        region: region || "global",
        product: product || "solution",
        benefit: benefit || "improved efficiency",
        useCaseName: useCaseName || "strategic initiative",
        audiencePains: Array.isArray(audiencePains) ? audiencePains : [],
        audienceGoals: Array.isArray(audienceGoals) ? audienceGoals : []
      };
      
      // Build enhanced prompt based on all available context
      const systemPrompt = buildEnhancedSystemPrompt(enhancedContext);
      
      // Construct a comprehensive user prompt that extracts key information
      const userPrompt = `
---CONTEXT FOR THE AI (NOT TO BE MENTIONED DIRECTLY IN CONTENT)---
${prompt}

---WRITING TASK---
Create ${contentType} content that addresses the needs and concerns of the audience described above.
Focus on their pain points and aspirations without directly mentioning the campaign brief.
Be specific, engaging, and compelling while maintaining the appropriate professional tone.
`;
      
      // Generate content using OpenAI with enhanced context
      const completion = await openai.chat.completions.create({
        // The newest OpenAI model is "gpt-4o" which was released May 13, 2024
        // Do not change this unless explicitly requested by the user
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
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

/**
 * Enhanced system prompt builder with comprehensive context
 */
interface EnhancedContext {
  contentType: string;
  campaignType: string;
  persona: string;
  toneProfile: any;
  industry: string;
  region: string;
  product: string;
  benefit: string;
  useCaseName: string;
  audiencePains: string[];
  audienceGoals: string[];
}

/**
 * Build a comprehensive, detailed system prompt using all available context
 */
function buildEnhancedSystemPrompt(ctx: EnhancedContext): string {
  // Default professional tone if none provided
  const tone = ctx.toneProfile || {
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
  
  // Construct a comprehensive understanding of the audience
  const audienceInsight = buildAudienceInsight(ctx);
  
  // Base prompt with enhanced context for all content types
  let basePrompt = `
You are an exceptional marketing copywriter specializing in creating high-impact ${ctx.contentType} content for B2B audiences.

TARGET AUDIENCE PROFILE:
${audienceInsight}

WRITING STYLE AND TONE:
- Your writing should be primarily ${primaryTone} and secondarily ${secondaryTone}
- Use vocabulary and reference points familiar to ${ctx.persona} in the ${ctx.industry} sector
- Make your content specific, practical and actionable - avoid generic marketing language
- Your writing must convey deep expertise in the subject matter

PRODUCT/SERVICE CONTEXT:
- You're writing about ${ctx.product} solutions that deliver ${ctx.benefit}
- The content relates to the ${ctx.region} market
- Focus on the ${ctx.useCaseName} use case that is relevant to this audience

CRITICAL INSTRUCTIONS:
1. Focus ENTIRELY on the audience's perspective - what they care about, their goals, and their challenges
2. NEVER mention "campaign objectives," "marketing goals," or refer to a "campaign brief" in your content
3. Address the audience's pain points directly and position solutions as enablers of their goals
4. Use specific, concrete language and examples rather than vague generalities
5. Do not mention Microsoft, Microsoft 365, or any other brand unless specifically mentioned in the instructions
6. Make the content genuinely valuable to the reader - educational, insightful, and actionable

`;

  // Content-specific instructions using enhanced context
  switch (ctx.contentType) {
    case 'email':
      return `${basePrompt}
CONTENT FORMAT REQUIREMENTS:
Create a compelling marketing email that would motivate a ${ctx.persona} in the ${ctx.industry} sector to take action.

Include:
1. An attention-grabbing subject line with 6-10 words mentioning ${ctx.benefit} for ${ctx.industry}
2. A personalized greeting addressing the ${ctx.persona} role directly
3. A concise opening paragraph (2-3 sentences) that immediately addresses a key pain point
4. 2-3 short body paragraphs highlighting specific, tangible benefits of ${ctx.product} for ${ctx.industry} professionals
5. Bullet points (if appropriate) to highlight key advantages or results
6. A single, clear call-to-action focusing on the next step
7. A professional sign-off with a name placeholder

The email should be 250-350 words total and create a sense of credibility and urgency without being pushy.
Make every sentence count - decision-makers in ${ctx.industry} have limited time and need to immediately see relevance.`;
      
    case 'social':
      return `${basePrompt}
CONTENT FORMAT REQUIREMENTS: 
Create an engaging LinkedIn post appropriate for a company page that would resonate with ${ctx.persona}s in the ${ctx.industry} sector.

Include:
1. A compelling opening that draws the reader in with a relevant statistic, question, or insight about ${ctx.industry} challenges
2. A concise, value-packed middle section highlighting the importance of ${ctx.benefit} in addressing key challenges
3. A clear value proposition that emphasizes outcomes, not features
4. At least one thought-provoking question to encourage engagement
5. A clear but soft call-to-action directing readers to learn more
6. 3-5 relevant hashtags that would reach your target audience of ${ctx.persona}s

The post should be 150-270 words and be formatted for easy scanning with short paragraphs, bullet points where appropriate, and a professional tone that balances authority with approachability.
Make sure the content would fit naturally in a LinkedIn feed and would encourage shares among ${ctx.industry} professionals.`;
      
    case 'blog':
      return `${basePrompt}
CONTENT FORMAT REQUIREMENTS:
Create a structured outline for an informative blog post that would provide genuine value to ${ctx.persona}s in the ${ctx.industry} sector.

Include:
1. An engaging title that incorporates ${ctx.benefit} and ${ctx.industry} (12 words maximum)
2. A brief introduction (100-150 words) that establishes the industry context and primary challenge
3. 4-6 main sections with engaging subheadings and brief content (150-200 words each)
4. Key statistics or data points to support main arguments (cite industry benchmarks)
5. Practical advice that applies directly to the ${ctx.region} market
6. A conclusion that summarizes key takeaways and offers next steps
7. A brief author/company bio paragraph at the end

The outline should demonstrate expertise in ${ctx.industry} challenges while providing actionable insights specifically related to ${ctx.benefit} and ${ctx.useCaseName}.
Ensure the content is educational first and promotional second - it should provide standalone value even if the reader never becomes a customer.`;
      
    case 'webinar':
      return `${basePrompt}
CONTENT FORMAT REQUIREMENTS:
Create a compelling webinar outline that would attract ${ctx.persona}s from the ${ctx.industry} sector.

Include:
1. An engaging, benefit-focused webinar title (under 10 words)
2. Clear webinar details: duration (45 minutes + Q&A), target audience, and format
3. A persuasive description (100-120 words) explaining why this topic is crucial for ${ctx.industry} professionals
4. 5-6 specific agenda points that promise valuable, actionable content
5. 3-4 specific key takeaways participants will gain
6. Brief presenter information emphasizing expertise in ${ctx.industry} and ${ctx.benefit}
7. Registration incentives (e.g., resources, toolkits, or follow-up consultation)

The entire webinar description should be 250-350 words and position the event as an educational opportunity rather than a sales pitch.
Focus on the practical knowledge and actionable strategies participants will gain related to ${ctx.useCaseName} that would be valuable to ${ctx.persona}s in the ${ctx.industry} sector.`;
    
    default:
      return basePrompt;
  }
}

/**
 * Build a detailed audience insight profile based on all available context
 */
function buildAudienceInsight(ctx: EnhancedContext): string {
  const { persona, industry, region, audiencePains, audienceGoals } = ctx;
  
  // Construct a detailed audience profile
  let audienceProfile = `
Role: ${persona} in the ${industry} sector (${region} region)

Key Pain Points:`;

  // Add pain points with interpretation
  if (audiencePains && audiencePains.length > 0) {
    audienceProfile += `\n${audiencePains.map(pain => `- ${pain}`).join('\n')}`;
  } else {
    audienceProfile += `
- Managing complexity and increasing demands with limited resources
- Ensuring security, compliance, and operational efficiency simultaneously
- Staying competitive in a rapidly evolving ${industry} landscape
- Demonstrating ROI on technology investments to stakeholders`;
  }
  
  audienceProfile += `\n\nKey Goals:`;
  
  // Add goals with interpretation
  if (audienceGoals && audienceGoals.length > 0) {
    audienceProfile += `\n${audienceGoals.map(goal => `- ${goal}`).join('\n')}`;
  } else {
    audienceProfile += `
- Improving operational efficiency and reducing costs
- Enhancing ${industry}-specific outcomes and KPIs
- Developing more agile, responsive business capabilities
- Minimizing risk while maximizing innovation opportunities`;
  }
  
  return audienceProfile;
}

/**
 * Legacy system prompt builder (kept for backward compatibility)
 */
function buildSystemPrompt(
  contentType: string, 
  campaignType: string, 
  persona: string, 
  toneProfile: any
): string {
  // Create a simplified context object to use with the enhanced function
  const simplifiedContext: EnhancedContext = {
    contentType,
    campaignType,
    persona,
    toneProfile,
    industry: "technology",
    region: "global",
    product: "solution",
    benefit: "improved efficiency",
    useCaseName: "strategic initiative",
    audiencePains: [],
    audienceGoals: []
  };
  
  // Delegate to the enhanced prompt builder
  return buildEnhancedSystemPrompt(simplifiedContext);
}