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
  
  // Flag to generate campaign metadata (title, boilerplate, objectives)
  generateCampaignMetadata?: boolean;
}

/**
 * Interface for campaign metadata (title, boilerplate, objectives)
 */
export interface CampaignMetadata {
  title: string;      // Concise campaign title 
  boilerplate: string; // Brief summary of the campaign (2-3 sentences)
  objectives: string[]; // List of campaign objectives (3-5 items)
}

/**
 * Transform markdown formatting from OpenAI responses into properly formatted text and structure
 * Removes markdown syntax but preserves structure for different content types
 */
function cleanMarkdownFormatting(content: string): string {
  if (!content) return '';
  
  // Common markdown cleaning function
  const cleanBaseMarkdown = (text: string): string => {
    return text
      // Remove bold formatting
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      // Remove italic formatting
      .replace(/\*([^*]+)\*/g, '$1')
      // Remove header formatting
      .replace(/^#{1,6}\s+(.+)$/gm, '$1')
      // Replace markdown bullet points with simple bullets
      .replace(/^\s*[-*+]\s+(.+)$/gm, '• $1')
      // Clean up leading/trailing spaces
      .trim();
  };
  
  // Process email content specially
  if (content.includes('Subject Line:') || content.includes('Subject:')) {
    // Extract subject line
    const subjectMatch = content.match(/(?:\*\*)?Subject(?:\s+Line)?:(?:\*\*)?\s*(.*?)(?:\n|$)/i);
    const subject = subjectMatch ? subjectMatch[1].trim() : '';
    
    // Extract preview text (first paragraph after subject)
    let previewText = '';
    const contentWithoutSubject = content.replace(/(?:\*\*)?Subject(?:\s+Line)?:(?:\*\*)?\s*(.*?)(?:\n|$)/i, '');
    const firstParagraphMatch = contentWithoutSubject.trim().match(/^(.*?)(?:\n\s*\n|$)/);
    if (firstParagraphMatch) {
      previewText = cleanBaseMarkdown(firstParagraphMatch[1].trim());
    }
    
    // Clean the full message body
    const bodyText = cleanBaseMarkdown(contentWithoutSubject);
    
    // Return structured email object
    return JSON.stringify({
      type: 'email',
      subject: subject,
      preview: previewText,
      body: bodyText
    });
  }
  
  // For social posts - very minimal formatting with special handling
  if (content.length < 600 && (content.includes('#') || !content.includes('\n\n'))) {
    // Extract hashtags if present
    const hashtags: string[] = [];
    const contentLines = content.split('\n');
    let mainContent = content;
    
    // Check last lines for hashtags
    for (let i = contentLines.length - 1; i >= 0; i--) {
      const line = contentLines[i].trim();
      if (line.startsWith('#') && !line.startsWith('##')) {
        // Extract hashtags from the line
        const tags = line.match(/#\w+/g);
        if (tags) {
          hashtags.push(...tags);
          // Remove this line from the main content
          contentLines.splice(i, 1);
        }
      }
    }
    
    mainContent = contentLines.join('\n');
    
    // Return structured social post object
    return JSON.stringify({
      type: 'social',
      content: cleanBaseMarkdown(mainContent),
      hashtags: hashtags
    });
  }
  
  // For blog posts and longer content - preserve structure but remove markdown
  if (content.includes('##') || content.length > 600) {
    // Extract title/headline
    const titleMatch = content.match(/^#\s+(.+)$|^(.+)\n[=]+$/m);
    const title = titleMatch ? (titleMatch[1] || titleMatch[2]).trim() : '';
    
    // Extract sections by looking for ## headers
    const sections = [];
    // This is a simpler approach that doesn't use matchAll
    const contentLines = content.split('\n');
    let currentHeading = '';
    let currentContent = '';
    
    for (let i = 0; i < contentLines.length; i++) {
      const line = contentLines[i];
      
      // Check if this line is a heading
      const headingMatch = line.match(/^##\s+(.+)$/);
      
      if (headingMatch) {
        // If we already had a heading, save the previous section
        if (currentHeading) {
          sections.push({
            heading: currentHeading,
            content: cleanBaseMarkdown(currentContent.trim())
          });
        }
        
        // Start a new section
        currentHeading = headingMatch[1].trim();
        currentContent = '';
      } else if (currentHeading) {
        // Add to the current section
        currentContent += line + '\n';
      }
    }
    
    // Add the last section if there was one
    if (currentHeading) {
      sections.push({
        heading: currentHeading,
        content: cleanBaseMarkdown(currentContent.trim())
      });
    }
    
    // Extract main intro (content before first ## section)
    let intro = '';
    if (title) {
      const introMatch = content.match(new RegExp(`(?:^#\\s+${title}\\s*$|^${title}\\n[=]+\\s*$)([\\s\\S]*?)(?=^##\\s+|\\n*$)`, 'm'));
      intro = introMatch ? cleanBaseMarkdown(introMatch[1].trim()) : '';
    } else {
      // If no title, just take everything before the first ## section
      const introMatch = content.match(/^([\s\S]*?)(?=^##\s+|\n*$)/m);
      intro = introMatch ? cleanBaseMarkdown(introMatch[1].trim()) : '';
    }
    
    // Return structured blog object
    return JSON.stringify({
      type: 'blog',
      title: title,
      intro: intro,
      sections: sections
    });
  }
  
  // For webinar content
  if (content.includes('Duration:') || content.includes('Target Audience:')) {
    // Extract title
    const titleMatch = content.match(/^#\s+(.+)$|^(.+)\n[=]+$/m);
    const title = titleMatch ? (titleMatch[1] || titleMatch[2]).trim() : '';
    
    // Extract details
    const durationMatch = content.match(/Duration:(.+?)(?:\n|$)/i);
    const duration = durationMatch ? durationMatch[1].trim() : '';
    
    const audienceMatch = content.match(/Target Audience:(.+?)(?:\n|$)/i);
    const audience = audienceMatch ? audienceMatch[1].trim() : '';
    
    // Return structured webinar object
    return JSON.stringify({
      type: 'webinar',
      title: title,
      duration: duration,
      audience: audience,
      details: cleanBaseMarkdown(content)
    });
  }
  
  // Default fallback - just clean the markdown
  return cleanBaseMarkdown(content);
}

export async function generateCampaignContent(
  inputs: CampaignInputs
): Promise<string | CampaignMetadata> {
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
      maxLength = 1000,
      generateCampaignMetadata = false
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
    
    console.log("Generating content for type:", contentType);
    
    // If generating campaign metadata, change content type to 'campaign_metadata'
    const apiContentType = generateCampaignMetadata ? 'campaign_metadata' : contentType;
    
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
        contentType: apiContentType,
        contentPurpose: inputs.contentPurpose,
        maxLength,
        // Additional metadata to help the server-side processing
        industry,
        region,
        product,
        benefit,
        useCaseName,
        audiencePains,
        audienceGoals,
        generateCampaignMetadata
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    
    // Handle campaign metadata response
    if (generateCampaignMetadata) {
      try {
        if (data.campaignMetadata) {
          return data.campaignMetadata as CampaignMetadata;
        }
        
        // If the response didn't include the structured metadata, try to parse it from content
        if (data.content) {
          // Try to parse as JSON if the content is already in JSON format
          try {
            const parsed = JSON.parse(data.content);
            if (parsed.title && parsed.boilerplate && parsed.objectives) {
              return parsed as CampaignMetadata;
            }
          } catch (e) {
            // Not JSON, try to extract manually
            const lines = data.content.split('\n');
            const metadata: Partial<CampaignMetadata> = {
              title: '',
              boilerplate: '',
              objectives: []
            };
            
            // Find title, boilerplate and objectives in text response
            let currentSection = '';
            for (const line of lines) {
              if (line.includes('Title:') || line.includes('Campaign Title:')) {
                metadata.title = line.split(':').slice(1).join(':').trim();
                currentSection = 'title';
              } else if (line.includes('Boilerplate:')) {
                metadata.boilerplate = line.split(':').slice(1).join(':').trim();
                currentSection = 'boilerplate';
              } else if (line.includes('Objectives:')) {
                currentSection = 'objectives';
              } else if (currentSection === 'objectives' && line.trim().startsWith('-')) {
                metadata.objectives!.push(line.trim().substring(1).trim());
              } else if (currentSection === 'title' && !metadata.title) {
                metadata.title = line.trim();
              } else if (currentSection === 'boilerplate' && !metadata.boilerplate) {
                metadata.boilerplate = line.trim();
              }
            }
            
            // If we've extracted at least partial metadata, return it
            if (metadata.title) {
              return {
                title: metadata.title,
                boilerplate: metadata.boilerplate || 'Campaign boilerplate text',
                objectives: metadata.objectives?.length ? metadata.objectives : ['Campaign objective']
              };
            }
          }
        }
        
        // Fallback metadata if we couldn't parse from response
        return {
          title: campaignName || 'Campaign Title',
          boilerplate: 'This campaign aims to address key challenges in the industry.',
          objectives: ['Increase brand awareness', 'Generate qualified leads', 'Drive conversions']
        };
      } catch (error) {
        console.error('Error parsing campaign metadata:', error);
        return {
          title: campaignName || 'Campaign Title',
          boilerplate: 'This campaign aims to address key challenges in the industry.',
          objectives: ['Increase brand awareness', 'Generate qualified leads', 'Drive conversions']
        };
      }
    }
    
    console.log("Raw API response:", data.content.substring(0, 100) + "...");
    
    // Return the cleaned content directly from the server
    return data.content;
  } catch (error) {
    console.error('Error generating content with OpenAI:', error);
    if (inputs.generateCampaignMetadata) {
      return {
        title: inputs.campaignName || 'Campaign Title',
        boilerplate: 'This campaign aims to address key challenges in the industry.',
        objectives: ['Increase brand awareness', 'Generate qualified leads', 'Drive conversions']
      };
    }
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
  
  let content = '';
  
  switch (contentType) {
    case 'email': {
      return `Subject: Innovative Solutions for ${industry} in the ${region} Region
Preview: I hope this email finds you well. I wanted to reach out about our ${benefit} ${product} solutions.

Dear ${audienceRole},

I hope this email finds you well. I wanted to reach out about our ${benefit} ${product} solutions and how they can benefit organizations in the ${industry} sector.

Our approach has been designed specifically to address the challenges faced by businesses in the ${region} region. I'd love to schedule a brief call to discuss how we can help.

Best regards,
[Your Name]`;
    }
      
    case 'social': {
      return `We've helped ${industry} organizations in the ${region} region achieve remarkable results with our ${benefit} approach.

Our ${product} solutions deliver measurable improvements for ${audienceRole}s facing today's complex challenges.

Learn how our proven methodology can transform your operations: [Link]

#${industry.charAt(0).toUpperCase() + industry.slice(1)}Innovation #${benefit.charAt(0).toUpperCase() + benefit.slice(1)} #${region.charAt(0).toUpperCase() + region.slice(1)}Business`;
    }
      
    case 'blog': {
      return `Strategic Innovation for ${industry}: ${benefit} Solutions

In today's competitive landscape, ${industry} organizations in the ${region} region need innovative approaches to stay ahead. This article explores how our ${product} solutions help businesses achieve their strategic goals.

Key Benefits for ${audienceRole}s

1. Improved operational efficiency
2. Enhanced competitive positioning
3. Better customer experiences
4. Strategic advantage in the ${industry} marketplace

Contact us to learn more about our proven approach for the ${region} region.`;
    }
      
    case 'webinar': {
      return `Strategic Innovation Framework for ${industry} Leaders

Duration: 45 minutes + 15-minute Q&A

Target Audience: ${audienceRole}s and Decision Makers in the ${region} region

Description:
Join our industry specialists for a practical, hands-on webinar focused on implementing effective ${benefit} strategies using our ${product} solutions. This session will provide actionable frameworks specifically designed for the ${industry} sector.

Key Takeaways:
• Practical implementation roadmap for your organization
• ROI calculation methodology
• Risk mitigation strategies
• Resource optimization techniques

Presenter:
[Industry Expert Name], with extensive experience helping organizations in the ${region} region transform their approach to ${industry}-specific challenges.`;
    }
      
    default:
      content = `Content about ${product} solutions for ${audienceRole}s in the ${industry} sector (${region} region).`;
      return content;
  }
}