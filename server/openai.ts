import OpenAI from "openai";
import { Express } from "express";

// Initialize OpenAI client
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Create a reusable system prompt template
const getSystemPrompt = (params: {
  campaignType: string;
  persona: string;
  toneProfile: any;
  contentType: string;
}) => {
  const { campaignType, persona, toneProfile, contentType } = params;
  
  // Determine tone instructions based on profile 
  let toneInstructions = "Use a professional and persuasive tone.";
  
  if (toneProfile) {
    const toneElements = [];
    
    if (toneProfile.professional > 70) {
      toneElements.push("professional (data-driven, precise, authoritative)");
    }
    
    if (toneProfile.conversational > 70) {
      toneElements.push("conversational (friendly, relatable, using 'you' and 'we')");
    }
    
    if (toneProfile.persuasive > 70) {
      toneElements.push("persuasive (compelling, action-oriented, emphasizing benefits)");
    }
    
    if (toneProfile.educational > 70) {
      toneElements.push("educational (informative, thorough, explanatory)");
    }
    
    if (toneProfile.enthusiastic > 70) {
      toneElements.push("enthusiastic (energetic, passionate, dynamic)");
    }
    
    if (toneElements.length > 0) {
      toneInstructions = `Use a tone that is ${toneElements.join(", ")}.`;
    }
  }
  
  // Base system prompt
  let systemPrompt = `You are an expert ${campaignType} campaign content creator for ${persona} audiences.
${toneInstructions}
Focus on creating compelling, highly relevant content specifically tailored to the campaign brief.
Extract key concepts, industry terms, and benefits from the brief to create targeted messaging.`;

  // Add content-specific instructions
  switch (contentType) {
    case 'email':
      systemPrompt += `
Create a persuasive marketing email that:
- Has a compelling subject line
- Addresses the reader directly with a clear value proposition
- Includes specific benefits and pain points relevant to the campaign brief
- Ends with a clear call to action
- Format as "Subject: [subject line]" followed by the email content
- Keep professional and concise, with proper email structure`;
      break;
    case 'social':
      systemPrompt += `
Create a LinkedIn post that:
- Starts with an attention-grabbing statement or statistic
- Presents a clear value proposition related to the campaign brief
- Includes bullet points highlighting key benefits
- Ends with a question to engage followers or a clear call to action
- Includes 3-5 relevant hashtags
- Is formatted for easy reading with short paragraphs and spacing`;
      break;
    case 'blog':
      systemPrompt += `
Create a blog post overview that:
- Has a compelling title directly related to the campaign brief
- Includes an introduction that clearly states the problem or opportunity
- Has 3-5 subheadings with brief content under each
- Each section should specifically address aspects of the campaign brief
- Ends with a conclusion and call to action
- Format with proper Markdown headings and structure`;
      break;
    case 'webinar':
      systemPrompt += `
Create a webinar description that:
- Has an attention-grabbing title related to the campaign brief
- Includes a compelling description of what attendees will learn
- Lists 3-5 specific topics or agenda items
- Specifies webinar duration and format
- Highlights speaker expertise relevant to the topic
- Ends with benefits of attending and registration instructions`;
      break;
  }
  
  return systemPrompt;
};

// Register OpenAI-related routes
export function registerOpenAIRoutes(app: Express) {
  app.post("/api/openai/generate", async (req, res) => {
    try {
      const { 
        prompt, 
        campaignType, 
        persona, 
        toneProfile, 
        contentType,
        maxLength = 1000
      } = req.body;
      
      if (!prompt) {
        return res.status(400).json({ error: "Missing required parameter: prompt" });
      }
      
      const systemPrompt = getSystemPrompt({
        campaignType: campaignType || "marketing",
        persona: persona || "business decision makers",
        toneProfile,
        contentType: contentType || "general"
      });
      
      // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Create ${contentType} content for a campaign with this brief: "${prompt}"` }
        ],
        max_tokens: Math.min(maxLength, 2000),
        temperature: 0.7,
      });
      
      const generatedContent = response.choices[0].message.content;
      
      res.json({ content: generatedContent });
    } catch (error: any) {
      console.error("OpenAI API error:", error.message);
      res.status(500).json({ error: "Failed to generate content" });
    }
  });
}