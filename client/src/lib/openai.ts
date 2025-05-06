// OpenAI API integration
// This file handles the communication with OpenAI's API for content generation

// API requests are proxied through the server to protect the API key
export async function generateCampaignContent(
  prompt: string,
  campaignType: string,
  persona: string,
  toneProfile: any,
  contentType: string,
  maxLength: number = 1000
): Promise<string> {
  try {
    const response = await fetch('/api/openai/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        campaignType,
        persona,
        toneProfile,
        contentType,
        maxLength
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data.content;
  } catch (error) {
    console.error('Error generating content with OpenAI:', error);
    return fallbackContent(contentType, prompt, campaignType);
  }
}

// Fallback content in case the API call fails
function fallbackContent(contentType: string, prompt: string, campaignType: string): string {
  switch (contentType) {
    case 'email':
      return `Subject: ${campaignType} - ${prompt}

Dear [Decision Maker],

I hope this email finds you well. I wanted to reach out about ${prompt} and how it can benefit your organization.

Our solution has been designed specifically to address the challenges faced by businesses like yours. I'd love to schedule a brief call to discuss how we can help.

Best regards,
[Your Name]`;
    case 'social':
      return `Exciting news! We're helping businesses with ${prompt}. 

Our approach delivers measurable results and addresses key business challenges. Contact us to learn more about how we can help your organization.

#Innovation #Business #Strategy`;
    case 'blog':
      return `# ${campaignType}: ${prompt}

In today's competitive landscape, organizations need innovative approaches to ${prompt}. This article explores how our solution helps businesses achieve their goals.

## Key Benefits

1. Improved efficiency and productivity
2. Cost savings and resource optimization
3. Enhanced customer experience
4. Competitive advantage

Contact us to learn more about how we can help your organization.`;
    default:
      return `Content about ${prompt} for ${campaignType} campaign.`;
  }
}