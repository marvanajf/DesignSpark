// OpenAI API integration
// This file handles the communication with OpenAI's API for content generation

/**
 * Interface for all campaign inputs needed for comprehensive content generation
 */
interface CampaignInputs {
  // Campaign basics
  campaignName: string;
  campaignBrief: string;
  campaignType: string;
  
  // Target information
  industry: string;
  region: string;
  product: string;
  benefit: string;
  useCaseName: string;
  
  // Audience specifics
  audienceName: string;
  audienceRole: string;
  audiencePains: string[];
  audienceGoals: string[];
  
  // Tone and style
  toneProfile: any;
  
  // Content specifications
  contentType: string;
  contentPurpose?: string; // Added this field for more specific content generation
  maxLength?: number;
}

/**
 * Generate campaign content using a comprehensive, context-aware approach
 * This builds a detailed prompt for the OpenAI API based on all campaign inputs
 */
export async function generateCampaignContent(
  inputs: CampaignInputs
): Promise<string> {
  try {
    // Extract all relevant inputs
    const {
      campaignName,
      campaignBrief,
      campaignType,
      industry,
      region,
      product,
      benefit,
      useCaseName,
      audienceName,
      audienceRole,
      audiencePains,
      audienceGoals,
      toneProfile,
      contentType,
      maxLength = 1000
    } = inputs;
    
    // Build a comprehensive context prompt that explains the business situation
    // WITHOUT directly mentioning it in the generated content
    const contextPrompt = `
    Campaign Name: ${campaignName}
    Campaign Type: ${campaignType}
    Brief: ${campaignBrief}
    
    Target Industry: ${industry}
    Target Region: ${region}
    Product/Service: ${product}
    Primary Benefit: ${benefit}
    Use Case: ${useCaseName}
    
    Target Audience:
    - Role: ${audienceRole}
    - Audience Type: ${audienceName}
    
    Audience Pain Points:
    ${audiencePains.map(pain => `- ${pain}`).join('\n')}
    
    Audience Goals:
    ${audienceGoals.map(goal => `- ${goal}`).join('\n')}
    `;
    
    // Send the comprehensive context to the API
    const response = await fetch('/api/openai/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: contextPrompt,
        campaignType,
        persona: `${audienceRole} (${audienceName})`,
        toneProfile,
        contentType,
        contentPurpose: inputs.contentPurpose, // Add the content purpose
        maxLength,
        // Additional metadata to help the server-side processing
        industry,
        region,
        product,
        benefit,
        useCaseName,
        audiencePains,
        audienceGoals
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data.content;
  } catch (error) {
    console.error('Error generating content with OpenAI:', error);
    return fallbackContent(inputs);
  }
}

// Fallback content in case the API call fails
function fallbackContent(inputs: CampaignInputs): string {
  const { 
    contentType, 
    campaignBrief, 
    campaignType, 
    industry, 
    region, 
    product, 
    benefit, 
    audienceRole 
  } = inputs;
  
  switch (contentType) {
    case 'email':
      return `Subject: Innovative Solutions for ${industry} in the ${region} Region

Dear [${audienceRole}],

I hope this email finds you well. I wanted to reach out about our ${benefit} ${product} solutions and how they can benefit organizations in the ${industry} sector.

Our approach has been designed specifically to address the challenges faced by businesses in the ${region} region. I'd love to schedule a brief call to discuss how we can help.

Best regards,
[Your Name]`;
    case 'social':
      return `"We've helped ${industry} organizations in the ${region} region achieve remarkable results with our ${benefit} approach."

Our ${product} solutions deliver measurable improvements for ${audienceRole}s facing today's complex challenges.

Learn how our proven methodology can transform your operations: [Link]

#${industry.charAt(0).toUpperCase() + industry.slice(1)}Innovation #${benefit.charAt(0).toUpperCase() + benefit.slice(1)} #${region.charAt(0).toUpperCase() + region.slice(1)}Business`;
    case 'blog':
      return `# Strategic Innovation for ${industry}: ${benefit} Solutions

In today's competitive landscape, ${industry} organizations in the ${region} region need innovative approaches to stay ahead. This article explores how our ${product} solutions help businesses achieve their strategic goals.

## Key Benefits for ${audienceRole}s

1. Improved operational efficiency
2. Enhanced competitive positioning
3. Better customer experiences
4. Strategic advantage in the ${industry} marketplace

Contact us to learn more about our proven approach for the ${region} region.`;
    case 'webinar':
      return `Title: "Strategic Innovation Framework for ${industry} Leaders"

Duration: 45 minutes + 15-minute Q&A

Target Audience: ${audienceRole}s and Decision Makers in the ${region} region

Description:
Join our industry specialists for a practical, hands-on webinar focused on implementing effective ${benefit} strategies using our ${product} solutions. This session will provide actionable frameworks specifically designed for the ${industry} sector.

Key Takeaways:
- Practical implementation roadmap for your organization
- ROI calculation methodology
- Risk mitigation strategies
- Resource optimization techniques

Presenter:
[Industry Expert Name], with extensive experience helping organizations in the ${region} region transform their approach to ${industry}-specific challenges.`;
    default:
      return `Content about ${product} solutions for ${audienceRole}s in the ${industry} sector (${region} region).`;
  }
}