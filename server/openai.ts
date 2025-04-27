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
            `You are a professional content creator specialized in LinkedIn posts. Create a compelling LinkedIn post about ${topic}. ` +
            `The post should match this tone of voice: ${toneCharacteristics}. ` +
            `Target audience: ${personaName} (${personaDescription}). ` +
            `Use clear, concise language with appropriate hashtags. ` +
            `The post should be 150-250 words with a strategic call to action. ` +
            `Avoid generic, templated content. Make it sound authentic and specific to the topic.`
        },
        {
          role: "user",
          content: `Generate a LinkedIn post about ${topic} that would resonate with a ${personaName}.`
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
