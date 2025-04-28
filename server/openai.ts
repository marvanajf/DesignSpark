import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
let openai: OpenAI | null = null;

// Only initialize OpenAI if API key is available
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
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
  personaDescription: string
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
    
    return responseContent;
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
  personaDescription: string
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
            `The email should be 200-300 words and look like a real email a business might send.`
        },
        {
          role: "user",
          content: `Generate a cold email about ${topic} that would appeal to a ${personaName}.`
        }
      ],
      temperature: 0.7
    });

    const responseContent = response.choices[0].message.content;
    if (!responseContent) {
      throw new Error("Empty response from OpenAI");
    }
    
    return responseContent;
  } catch (error) {
    console.error("Error generating cold email:", error);
    throw new Error("Failed to generate cold email");
  }
}