import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
let openai: OpenAI | null = null;

// Only initialize OpenAI if API key is available
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

// Utility function to clean up markdown formatting from text
function cleanupMarkdownFormatting(text: string): string {
  // Remove asterisks used for bold or italic formatting
  return text.replace(/\*\*/g, '').replace(/\*/g, '');
}

// Type for tone analysis results
export interface ToneAnalysisResult {
  characteristics: {
    professional: number;
    conversational: number;
    technical: number;
    friendly: number;
    formal: number;
  };
  language_patterns: {
    sentence_structure: string;
    vocabulary: string;
    voice: string;
    common_phrases: string[];
  };
  summary: string;
  recommended_content_types: string[];
}

// Define the Persona Generator type
export interface GeneratedPersona {
  name: string;
  description: string;
  interests: string[];
}

// Analyze the tone of the content
export async function analyzeTone(content: string): Promise<ToneAnalysisResult> {
  try {
    // Check if OpenAI is initialized
    if (!openai) {
      throw new Error("OpenAI API key is not configured");
    }
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: 
            "You are a tone of voice expert. Analyze the provided content and extract the tone characteristics. " +
            "Measure these attributes on a scale of 0-100: Professional, Conversational, Technical, Friendly, Formal. " +
            "Also analyze sentence structure, vocabulary, voice (active vs passive), and common phrases. " +
            "Finally, provide a summary of the overall tone. " +
            "Output your response as a JSON object with the following structure: " +
            "{\n" +
            "  \"characteristics\": {\n" +
            "    \"professional\": number,\n" +
            "    \"conversational\": number,\n" +
            "    \"technical\": number,\n" +
            "    \"friendly\": number,\n" +
            "    \"formal\": number\n" +
            "  },\n" +
            "  \"language_patterns\": {\n" +
            "    \"sentence_structure\": string,\n" +
            "    \"vocabulary\": string,\n" +
            "    \"voice\": string,\n" +
            "    \"common_phrases\": string[]\n" +
            "  },\n" +
            "  \"summary\": string,\n" +
            "  \"recommended_content_types\": string[]\n" +
            "}"
        },
        {
          role: "user",
          content: content
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7
    });

    const responseContent = response.choices[0].message.content;
    if (!responseContent) {
      throw new Error("Empty response from OpenAI");
    }
    
    return JSON.parse(responseContent) as ToneAnalysisResult;
  } catch (error) {
    console.error("Error analyzing tone:", error);
    throw new Error("Failed to analyze tone");
  }
}

// Generate a persona based on the industry, role, or description
export async function generatePersona(description: string): Promise<GeneratedPersona> {
  try {
    // Check if OpenAI is initialized
    if (!openai) {
      throw new Error("OpenAI API key is not configured");
    }
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: 
            "You are a B2B marketing expert specializing in audience personas. " +
            "Based on the provided industry, role, or description, create a detailed professional persona. " +
            "The persona should be realistic, specific, and focused on professional attributes. " +
            "Output your response as a JSON object with the following structure: " +
            "{\n" +
            "  \"name\": string, // The job title/role name\n" +
            "  \"description\": string, // 1-2 sentences describing professional motivations and pain points\n" +
            "  \"interests\": string[], // 3-5 key professional interests/focus areas, each 1-3 words\n" +
            "}"
        },
        {
          role: "user",
          content: `Create a detailed professional persona for: ${description}`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7
    });

    const responseContent = response.choices[0].message.content;
    if (!responseContent) {
      throw new Error("Empty response from OpenAI");
    }
    
    return JSON.parse(responseContent) as GeneratedPersona;
  } catch (error) {
    console.error("Error generating persona:", error);
    throw new Error("Failed to generate persona");
  }
}

// Generate a LinkedIn post based on the tone, persona, and topic
export async function generateLinkedInPost(
  topic: string, 
  toneResults: ToneAnalysisResult, 
  personaName: string, 
  personaDescription: string,
  furtherDetails?: string
): Promise<string> {
  try {
    // Check if OpenAI is initialized
    if (!openai) {
      throw new Error("OpenAI API key is not configured");
    }
    
    // Extract dominant tone characteristics
    const toneCharacteristics = Object.entries(toneResults.characteristics)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2)
      .map(([key, value]) => `${key} (${value}%)`)
      .join(", ");
    
    const furtherDetailsPrompt = furtherDetails 
      ? `\n\nAdditional details to consider: ${furtherDetails}`
      : '';
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: 
            `You are an expert LinkedIn content creator who specializes in creating authentic, conversation-starter posts. 
            Create a compelling LinkedIn post about ${topic} that feels genuine and personal - like something a real person would write.
            The post should match this tone of voice: ${toneCharacteristics}, but ALWAYS leaning toward conversational rather than formal.
            Target audience: ${personaName} (${personaDescription}).
            
            IMPORTANT GUIDELINES:
            - Write in first person as if you are the professional sharing your thoughts
            - Use shorter sentences and paragraphs - LinkedIn is social media, not an essay 
            - Include personal opinions and a touch of vulnerability or storytelling
            - Add 2-3 relevant questions to engage readers
            - Use emojis sparingly but effectively (1-3 total)
            - Use 3-5 strategic hashtags, including at least one trending or industry-specific one
            - Keep it 100-200 words maximum
            - Add line breaks between paragraphs for readability
            - The call to action should feel natural, not salesy
            - Do NOT use markdown formatting like asterisks (*) for emphasis
            
            IMPORTANT CONTENT GUIDELINES:
            - NEVER use placeholder text like [Company Name], [Competitor Name], etc.
            - Be specific and authentic in your references without forcing mentions of specific companies
            - Use your judgment about whether to include specific examples based on context
            - You can refer to competitor characteristics without naming them if appropriate
            - Focus on industry trends and benefits where sensible
            - Be natural and genuine rather than generic - no placeholders of any kind
            
            NEVER sound like corporate marketing copy - the goal is authenticity, relatability and engagement.`
        },
        {
          role: "user",
          content: `Write a LinkedIn post about ${topic} as if you were a real ${personaName} sharing your personal thoughts and experience. Make it conversational and authentic.`
        }
      ],
      temperature: 0.8
    });

    const responseContent = response.choices[0].message.content;
    if (!responseContent) {
      throw new Error("Empty response from OpenAI");
    }
    
    return cleanupMarkdownFormatting(responseContent);
  } catch (error) {
    console.error("Error generating LinkedIn post:", error);
    throw new Error("Failed to generate LinkedIn post");
  }
}

// Generate a cold email based on the tone, persona, and topic
export async function generateColdEmail(
  topic: string, 
  toneResults: ToneAnalysisResult, 
  personaName: string, 
  personaDescription: string,
  furtherDetails?: string
): Promise<string> {
  try {
    // Check if OpenAI is initialized
    if (!openai) {
      throw new Error("OpenAI API key is not configured");
    }
    
    // Extract dominant tone characteristics
    const toneCharacteristics = Object.entries(toneResults.characteristics)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2)
      .map(([key, value]) => `${key} (${value}%)`)
      .join(", ");
    
    const furtherDetailsPrompt = furtherDetails 
      ? `\n\nAdditional details to consider: ${furtherDetails}`
      : '';
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: 
            `You are a professional email copywriter. Create a persuasive cold email about ${topic}. ` +
            `The email should match this tone of voice: ${toneCharacteristics}. ` +
            `Target recipient: ${personaName} (${personaDescription}). ` +
            `Include a clear subject line, personalized introduction, concise value proposition, relevant social proof, ` +
            `and a specific call to action. Avoid generic sales language. ` +
            `Format the email properly with subject, greeting, body, and signature. ` +
            `The email should be 200-300 words and look like a real email a business might send.` +
            `\n\nIMPORTANT GUIDELINES:` +
            `\n- NEVER use placeholder text like [Company Name], [Competitor Name], etc.` +
            `\n- Be specific and authentic in your references without forcing mentions of specific companies` +
            `\n- Use your judgment about whether to include specific examples based on context` +
            `\n- You can refer to competitor characteristics without naming them if appropriate` +
            `\n- Focus on industry trends and benefits where sensible` +
            `\n- Be natural and genuine rather than generic - no placeholders of any kind`
        },
        {
          role: "user",
          content: `Generate a cold email about ${topic} that would appeal to a ${personaName}.${furtherDetailsPrompt}`
        }
      ],
      temperature: 0.7
    });

    const responseContent = response.choices[0].message.content;
    if (!responseContent) {
      throw new Error("Empty response from OpenAI");
    }
    
    return cleanupMarkdownFormatting(responseContent);
  } catch (error) {
    console.error("Error generating cold email:", error);
    throw new Error("Failed to generate cold email");
  }
}

// Generate a webinar script/outline based on the tone, persona, and topic
export async function generateWebinar(
  topic: string, 
  toneResults: ToneAnalysisResult, 
  personaName: string, 
  personaDescription: string,
  furtherDetails?: string
): Promise<string> {
  try {
    // Check if OpenAI is initialized
    if (!openai) {
      throw new Error("OpenAI API key is not configured");
    }
    
    // Extract dominant tone characteristics
    const toneCharacteristics = Object.entries(toneResults.characteristics)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2)
      .map(([key, value]) => `${key} (${value}%)`)
      .join(", ");
    
    const furtherDetailsPrompt = furtherDetails 
      ? `\n\nAdditional details to consider: ${furtherDetails}`
      : '';
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: 
            `You are an expert webinar content strategist. Create a compelling webinar outline about ${topic}. ` +
            `The webinar should match this tone of voice: ${toneCharacteristics}. ` +
            `Target audience: ${personaName} (${personaDescription}). ` +
            `Include the following sections:
            
            1. A catchy webinar title that will attract registrations
            2. A brief description/promotional text (100 words max)
            3. 3-5 key learning objectives or takeaways
            4. A structured outline with 3-5 main sections and brief descriptions of content for each
            5. Ideas for audience engagement (polls, Q&A prompts, interactive elements)
            6. A compelling call-to-action for the end of the webinar
            
            IMPORTANT FORMATTING GUIDELINES:
            - Do NOT include markdown formatting like # symbols, asterisks, or other special characters
            - Use plain text formatting with clean section headers
            - Use dashes or bullet points for lists, not symbols or markdown
            - Clearly label each section with a simple title and colon (Example: "Webinar Title:" instead of "### Webinar Title")
            - Format should be clean and professional without any coding or markdown elements
            
            IMPORTANT CONTENT GUIDELINES:
            - NEVER use placeholder text like [Company Name], [Competitor Name], etc.
            - Be specific and authentic in your references without forcing mentions of specific companies
            - Use your judgment about whether to include specific examples based on context
            - You can refer to competitor characteristics without naming them if appropriate
            - Focus on industry trends and benefits where sensible
            - Be natural and genuine rather than generic - no placeholders of any kind
            
            The total length should be 400-600 words, structured for easy readability.`
        },
        {
          role: "user",
          content: `Create a webinar outline about ${topic} that would appeal to a ${personaName}.${furtherDetailsPrompt}`
        }
      ],
      temperature: 0.7
    });

    const responseContent = response.choices[0].message.content;
    if (!responseContent) {
      throw new Error("Empty response from OpenAI");
    }
    
    return cleanupMarkdownFormatting(responseContent);
  } catch (error) {
    console.error("Error generating webinar content:", error);
    throw new Error("Failed to generate webinar content");
  }
}

// Generate a workshop plan based on the tone, persona, and topic
export async function generateWorkshop(
  topic: string, 
  toneResults: ToneAnalysisResult, 
  personaName: string, 
  personaDescription: string,
  furtherDetails?: string
): Promise<string> {
  try {
    // Check if OpenAI is initialized
    if (!openai) {
      throw new Error("OpenAI API key is not configured");
    }
    
    // Extract dominant tone characteristics
    const toneCharacteristics = Object.entries(toneResults.characteristics)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2)
      .map(([key, value]) => `${key} (${value}%)`)
      .join(", ");
    
    const furtherDetailsPrompt = furtherDetails 
      ? `\n\nAdditional details to consider: ${furtherDetails}`
      : '';
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: 
            `You are a professional workshop facilitator and instructional designer. Create a workshop plan about ${topic}. ` +
            `The workshop content should match this tone of voice: ${toneCharacteristics}. ` +
            `Target participants: ${personaName} (${personaDescription}). ` +
            `Include the following elements:
            
            1. Workshop title and tagline
            2. Duration recommendation (30 min, 60 min, half-day, etc.)
            3. Learning objectives (3-5 specific outcomes)
            4. Materials/prerequisites needed
            5. Detailed agenda with timing for each section
            6. 2-3 interactive exercises or activities with instructions
            7. Key discussion questions
            8. Follow-up resources or action items
            
            IMPORTANT FORMATTING GUIDELINES:
            - Do NOT include markdown formatting like # symbols, asterisks, or other special characters
            - Use plain text formatting with clean section headers
            - Use dashes or bullet points for lists, not symbols or markdown
            - Clearly label each section with a simple title and colon (Example: "Workshop Title:" instead of "### Workshop Title")
            - Format should be clean and professional without any coding or markdown elements
            
            IMPORTANT CONTENT GUIDELINES:
            - NEVER use placeholder text like [Company Name], [Competitor Name], etc.
            - Be specific and authentic in your references without forcing mentions of specific companies
            - Use your judgment about whether to include specific examples based on context
            - You can refer to competitor characteristics without naming them if appropriate
            - Focus on industry trends and benefits where sensible
            - Be natural and genuine rather than generic - no placeholders of any kind
            
            Format the output with clear section headers and structure for easy implementation.
            The total length should be 500-700 words, written in a practical, actionable style.`
        },
        {
          role: "user",
          content: `Design a workshop plan about ${topic} for ${personaName} participants.${furtherDetailsPrompt}`
        }
      ],
      temperature: 0.7
    });

    const responseContent = response.choices[0].message.content;
    if (!responseContent) {
      throw new Error("Empty response from OpenAI");
    }
    
    return cleanupMarkdownFormatting(responseContent);
  } catch (error) {
    console.error("Error generating workshop plan:", error);
    throw new Error("Failed to generate workshop plan");
  }
}