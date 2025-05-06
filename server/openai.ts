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
      contentPurpose, // Added content purpose parameter
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
        contentPurpose, // Add the content purpose to the context
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
---CAMPAIGN BRIEF (PRIMARY SOURCE OF INFORMATION - DO NOT REFERENCE DIRECTLY)---
${prompt}

---WRITING TASK---
Create exceptional ${contentType} content${contentPurpose ? ` for ${contentPurpose}` : ''} that addresses the specific needs and concerns of the audience described above.
Your content must be informed primarily by the campaign brief while being tailored to the specific format requirements.
Extract key themes, specific pain points, and industry insights from the campaign brief to create highly relevant content.
Focus on their pain points and aspirations without directly mentioning the campaign brief or using any meta-language.
Be specific, engaging, compelling, and publication-ready with absolutely professional quality.
Ensure each piece of content has its own distinct purpose and maintains a cohesive connection to the overall campaign objective.
`;
      
      // Customize the request based on the content type
      let messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ];
      
      // Add specific instructions based on content type
      let responseFormat: { type: "json_object" } | undefined = undefined;
      
      // Add format-specific instructions for each content type
      if (contentType === 'email') {
        messages.push({
          role: "system",
          content: `Format your email response with clean, plain text formatting:

1. Start with "Subject:" followed by a clear, compelling subject line
2. Next add "Preview:" with a brief preview of the email content 
3. Finally add the full email body
          
DO NOT use markdown formatting of any kind.
DO NOT use numbered sections like "1." or "1:" at the beginning of paragraphs.
DO NOT start lines with numbers followed by periods or colons.
NEVER use hash symbols (#) anywhere in the content - not for headers or hashtags.
NEVER use asterisks (*) or markdown anywhere in your response.
DO NOT add section numbers like "1. Section Name" - use plain text headings without numbers.
DO NOT include placeholder text like "[Name]" - simply write the email as if to the specific recipient.
Ensure the content is well-structured with clear paragraphs and spacing.`
        });
      } 
      // If social post, give specific instructions
      else if (contentType === 'social') {
        messages.push({
          role: "system",
          content: `Format your social media post response as plain text:
          
1. First, write the main content of the post without any markdown or formatting
2. Instead of adding hashtags with # symbols, simply include keywords naturally in the text
          
DO NOT use markdown formatting of any kind.
DO NOT use numbered sections like "1." or "1:" at the beginning of paragraphs.
DO NOT start lines with numbers followed by periods or colons.
NEVER use hash symbols (#) anywhere in the content - not for headers or hashtags.
NEVER use asterisks (*) or markdown anywhere in your response.
DO NOT add section numbers like "1. Section Name" - use plain text headings without numbers.
Make sure the post is appropriate for LinkedIn, not Twitter or other platforms.
Use professional language and focus on business value.`
        });
      }
      // If blog post, format with clear headings and sections
      else if (contentType === 'blog') {
        messages.push({
          role: "system",
          content: `Format your blog post response as plain text with clear structure:
          
1. Start with a clear title on its own line
2. Follow with an introductory paragraph
3. Add sections with headings followed by paragraphs (don't use numbers or symbols before headings)
4. Use blank lines between sections for clarity
          
DO NOT use markdown formatting of any kind.
DO NOT use numbered sections like "1." or "1:" at the beginning of paragraphs.
DO NOT start lines with numbers followed by periods or colons.
NEVER use hash symbols (#) anywhere in the content - not for headers or hashtags.
NEVER use asterisks (*) or markdown anywhere in your response.
DO NOT add section numbers like "1. Section Name" - use plain text headings without numbers.
Instead, structure the blog with clear section titles on their own lines.
Make sure each section has a clear heading followed by relevant content.`
        });
      }
      // If webinar, structure in a clear, readable format
      else if (contentType === 'webinar') {
        messages.push({
          role: "system",
          content: `Format your webinar description as clean, plain text:
          
1. Start with a clear, compelling webinar title
2. Include key webinar details as plain text paragraphs, not markdown
          
DO NOT use markdown formatting of any kind.
DO NOT use numbered sections like "1." or "1:" at the beginning of paragraphs.
DO NOT start lines with numbers followed by periods or colons.
NEVER use hash symbols (#) anywhere in the content - not for headers or hashtags.
NEVER use asterisks (*) or markdown anywhere in your response.
DO NOT add section numbers like "1. Section Name" - use plain text headings without numbers.
Structure the content with clear sections and blank lines for readability.
Focus on making the value proposition and audience benefits very clear.`
        });
      }
      
      // Generate content using OpenAI with enhanced context
      const completion = await openai.chat.completions.create({
        // The newest OpenAI model is "gpt-4o" which was released May 13, 2024
        // Do not change this unless explicitly requested by the user
        model: "gpt-4o",
        messages,
        max_tokens: Math.min(maxLength, 4000), // Ensure we don't exceed API limits
        temperature: 0.7, // Higher creativity for more intelligent content
      });
      
      // Extract the generated content
      const generatedContent = completion.choices[0].message.content || '';
      
      // Apply an aggressive cleaning to remove ALL markdown and unwanted formatting
      let cleanedContent = generatedContent;
      
      // First, remove anything that looks like a header or section marker
      cleanedContent = cleanedContent
        // Remove any line starting with hashtags
        .replace(/^#+\s*(.*)/gm, '$1')
        // Remove any lines starting with #number format
        .replace(/^#\s*\d+[\.:]?\s*(.*)/gm, '$1')
        // Remove hashtag and number combinations
        .replace(/^#+\s*\d+[\.:]?\s*(.*)/gm, '$1');
      
      // Remove any asterisks used for emphasis/bold
      cleanedContent = cleanedContent
        .replace(/\*\*([^*]+)\*\*/g, '$1')        // Bold (**word**)
        .replace(/\*([^*]+)\*/g, '$1')            // Italic (*word*)
        .replace(/^\*\s+(.*)/gm, '• $1')          // List items with asterisk
        .replace(/^\s*\*\s+(.*)/gm, '• $1');      // List items with space + asterisk
          
      // Clean up any remaining markdown elements
      cleanedContent = cleanedContent
        .replace(/^-\s+(.+)/gm, '• $1')           // List items with dash
        .replace(/^\s*-\s+(.+)/gm, '• $1')        // List items with space + dash
        .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // Links [text](url)
        .replace(/^>\s+(.*)/gm, '$1')             // Blockquotes
        .replace(/`([^`]+)`/g, '$1');             // Inline code
        
      // Remove any standalone hashtags throughout the content
      cleanedContent = cleanedContent
        // Remove hashtags at the end of text
        .replace(/\s+(#\w+\s*)+$/g, '')
        // Remove any hashtags in the middle of text
        .replace(/#(\w+)/g, '$1')
        // Specifically remove any hashtag at the beginning of a line
        .replace(/^#(\w+)/gm, '$1');
        
      // Final removal of any markdown or formatting characters that might have been missed
      cleanedContent = cleanedContent
        .replace(/^>\s+/gm, '')     // Any remaining blockquote markers
        .replace(/^#+\s*/gm, '')    // Any remaining header markers
        .replace(/\*+/g, '')        // Any remaining asterisks
        .replace(/`+/g, '')         // Any remaining backticks
        .replace(/~+/g, '')         // Any remaining tildes
        .replace(/^\d+\.\s+/gm, '') // Numbered list items at start of line
        .replace(/=+/g, '')         // Equal signs (sometimes used for headers)
        .replace(/-+$/gm, '');      // Dash lines (sometimes used for headers)
      
      // Return the cleaned plain text content
      res.json({ content: cleanedContent });
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
  contentPurpose?: string; // Add content purpose to the interface
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

QUALITY STANDARDS:
- All content must be absolutely top-tier professional quality
- Every word and sentence must have purpose and impact
- Content must be ready for immediate publication without further editing
- Follow the latest best practices for ${ctx.contentType} marketing content
- Be highly specific to this industry and audience - avoid generic statements
- Always include concrete examples and specifics rather than vague claims
- Content should demonstrate insider knowledge of ${ctx.industry} challenges

AUTHENTICITY REQUIREMENTS:
- NEVER use phrases like "in today's fast-paced world" or "in the dynamic landscape"
- AVOID clichés like "in this digital age" or any variation that sounds generic
- DO NOT use "now more than ever" or similar time-based urgency phrases
- AVOID mentioning "changing consumer expectations" or similar generalizations
- REMOVE any reference to "the current climate" or "the modern business environment"
- WRITE as a human would write, not as AI tends to write
- CUT all filler phrases that don't add specific value (e.g., "it's important to note that")
- AVOID theoretical framing like "studies show" or "research indicates" without specifics
- USE direct, concrete language focused on specific problems and solutions

CRITICAL INSTRUCTIONS:
1. The campaign brief is your PRIMARY source of information - extract key insights from it
2. Focus ENTIRELY on the audience's perspective - what they care about, their goals, and their challenges
3. NEVER mention "campaign objectives," "marketing goals," or refer to a "campaign brief" in your content
4. Address the audience's pain points directly and position solutions as enablers of their goals
5. Use specific, concrete language and examples rather than vague generalities
6. Do not mention Microsoft, Microsoft 365, or any other brand unless specifically mentioned in the instructions
7. Make the content genuinely valuable to the reader - educational, insightful, and actionable
8. Each content piece should have its own distinct purpose and value proposition
9. Emphasize benefits over features and focus on ROI, time savings, or competitive advantage
10. DO NOT use HTML tags or other markup in your responses - use plain text only
11. For formatting, use simple text-based approaches (like * for bullet points, blank lines between paragraphs)
12. Never add class names, div tags, or any other HTML elements in your output

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
3. A concise opening paragraph (2-3 sentences) that immediately addresses a key pain point from the campaign brief
4. 2-3 short body paragraphs highlighting specific, tangible benefits of ${ctx.product} for ${ctx.industry} professionals
5. Bullet points (if appropriate) to highlight key advantages or results that directly relate to the campaign brief
6. A single, clear call-to-action focusing on the next step
7. A professional sign-off with a name placeholder

EMAIL EFFECTIVENESS REQUIREMENTS:
- The subject line must have immediate relevance to the recipient's role and challenges
- The opening must hook the reader without using clichés like "in today's world" or "in the current landscape"
- The email should create a sense of credibility and appropriate urgency without being pushy
- Every word must be purposeful - ${ctx.persona}s receive dozens of emails daily
- Create professional curiosity by hinting at valuable insights, but don't reveal everything
- Ensure the email clearly conveys "what's in it for them" within the first paragraph
- Focus more on their pains and goals than on product descriptions
- AVOID starting sentences with "As a ${ctx.persona}" or similar role-based generalizations
- DO NOT use the phrase "I hope this email finds you well" or similar generic openings
- NEVER include phrases like "changing market dynamics" or "evolving industry landscape"

The email should be 250-350 words total and formatted for easy mobile reading with short paragraphs.
Make every sentence count - decision-makers in ${ctx.industry} have limited time and need to immediately see relevance.

HUMAN WRITING PATTERN:
- Write like a real person, not like marketing copy
- Use varied sentence structures (not all starting with same pattern)
- Incorporate casual transitions that feel natural
- Add small details that make the writing feel personally written
- Balance direct statements with thoughtful observations`;
      
    case 'social':
      return `${basePrompt}
CONTENT FORMAT REQUIREMENTS: 
Create an engaging LinkedIn post appropriate for a company page that would resonate with ${ctx.persona}s in the ${ctx.industry} sector.

Include:
1. A compelling opening that draws the reader in with a relevant statistic, question, or insight about ${ctx.industry} challenges
2. A concise, value-packed middle section highlighting the importance of ${ctx.benefit} in addressing key challenges identified in the campaign brief
3. A clear value proposition that emphasizes outcomes specific to the campaign brief, not features
4. At least one thought-provoking question to encourage engagement that relates to the core message
5. A clear but soft call-to-action directing readers to learn more
6. 3-5 relevant hashtags that would reach your target audience of ${ctx.persona}s in the ${ctx.industry}

LINKEDIN POST EFFECTIVENESS REQUIREMENTS:
- Optimize for LinkedIn's algorithm by creating conversation-starting content
- Ensure the first 2-3 lines are extremely compelling to hook readers before the "see more" cutoff
- Structure content for easy mobile viewing with short paragraphs and strategic line breaks
- Use a conversational yet authoritative voice that positions the author as a helpful industry expert
- Include one specific, memorable data point or insight that readers will remember and potentially share
- Write in a way that encourages comments by posing thoughtful questions or inviting experiences
- Avoid overly promotional language - focus on providing genuine value through education or insight
- AVOID cliché openings like "Did you know..." or "I'm excited to share..."
- DO NOT use phrases like "I'm thrilled to announce" or other overused LinkedIn expressions
- NEVER begin with "As businesses navigate the challenges of..."
- AVOID closing with generic phrases like "What are your thoughts?" or "What's your experience?"

AUTHENTICITY REQUIREMENTS:
- Sound like a real person, not a corporate entity or marketing department
- Use natural language patterns that feel like they come from an actual professional
- Include specific details that demonstrate genuine industry knowledge
- Vary sentence structures and lengths to create natural rhythm
- Incorporate subtle conversational elements (thoughtful pauses, brief asides)
- Balance professionalism with personality to avoid generic corporate tone

The post should be 150-270 words and formatted for easy scanning with short paragraphs, strategic line breaks, and a professional tone that balances authority with approachability.
Make sure the content would fit naturally in a LinkedIn feed and would encourage shares among ${ctx.industry} professionals.`;
      
    case 'blog':
      return `${basePrompt}
CONTENT FORMAT REQUIREMENTS:
Create a structured outline for an informative blog post that would provide genuine value to ${ctx.persona}s in the ${ctx.industry} sector.

Include:
1. An engaging title that incorporates ${ctx.benefit} and ${ctx.industry} (12 words maximum)
2. A brief introduction (100-150 words) that establishes the specific industry context and primary challenge from the campaign brief
3. 4-6 main sections with engaging subheadings and brief content descriptions (150-200 words each)
4. Key statistics or data points to support main arguments (cite relevant industry benchmarks)
5. Practical advice that applies directly to the ${ctx.region} market and ${ctx.useCaseName}
6. A conclusion that summarizes key takeaways and offers clear next steps
7. A brief author/company bio paragraph at the end that establishes credibility

BLOG EFFECTIVENESS REQUIREMENTS:
- Structure for online readability with short paragraphs, subheadings, and scannable sections
- Use SEO-friendly principles including proper heading structure and relevant keywords
- Include at least one unexpected insight or contrary perspective to conventional wisdom
- Ensure all statistics and data points directly support your key arguments
- Create a narrative flow that guides the reader logically through the topic
- Every section should have a clear takeaway that readers can implement immediately
- The introduction must clearly communicate the value proposition of reading the entire piece
- Make sure the blog format suits business readers who are seeking solutions rather than entertainment

The blog should demonstrate deep expertise in ${ctx.industry} challenges while providing actionable insights specifically related to ${ctx.benefit} and ${ctx.useCaseName}.
Ensure the content is educational first and promotional second - it should provide standalone value even if the reader never becomes a customer.`;
      
    case 'webinar':
      return `${basePrompt}
CONTENT FORMAT REQUIREMENTS:
Create a compelling webinar outline that would attract ${ctx.persona}s from the ${ctx.industry} sector specifically addressing the needs identified in the campaign brief.

Include:
1. An engaging, benefit-focused webinar title (under 10 words) that directly addresses the campaign brief
2. Clear webinar details: duration (45 minutes + Q&A), target audience specifications, and interactive format
3. A persuasive description (100-120 words) explaining why this topic is crucial for ${ctx.industry} professionals right now
4. 5-6 specific agenda points that promise valuable, actionable content directly tied to the campaign brief
5. 3-4 concrete, specific key takeaways participants will gain (not vague promises)
6. Brief presenter information emphasizing relevant expertise in ${ctx.industry} and ${ctx.benefit}
7. Registration incentives that specifically address the pain points mentioned in the campaign brief

WEBINAR EFFECTIVENESS REQUIREMENTS:
- Position the webinar as a high-value educational experience, not a sales presentation
- Include at least one proprietary framework, process, or methodology that attendees can't get elsewhere
- Ensure the title creates a sense of timeliness and relevance (e.g., "new approach," "latest trends")
- Clearly articulate why this webinar is different from standard industry presentations
- Focus on solving specific problems mentioned in the campaign brief rather than generic industry issues
- The description should create a sense of exclusivity and limited opportunity
- Make sure each agenda item promises practical, implementable knowledge rather than theory
- Emphasize ROI-focused content that helps justify the time investment to attend

The entire webinar description should be 250-350 words and position the event as a premium educational opportunity rather than a sales pitch.
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