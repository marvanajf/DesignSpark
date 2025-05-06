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
 * Transform markdown formatting from OpenAI responses into properly formatted text
 * Converts markdown to HTML/styled text that will render nicely in the UI
 * Preserves heading structure while maintaining a clean appearance
 */
function cleanMarkdownFormatting(content: string): string {
  if (!content) return '';

  // Convert GitHub Flavored Markdown style content to HTML
  const processMarkdownToHTML = (text: string): string => {
    return text
      // Headers
      .replace(/^# (.+)$/gm, '<h1>$1</h1>')
      .replace(/^## (.+)$/gm, '<h2>$1</h2>')
      .replace(/^### (.+)$/gm, '<h3>$1</h3>')
      
      // Emphasis (bold, italic)
      .replace(/\*\*\*([^*]+)\*\*\*/g, '<strong><em>$1</em></strong>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      
      // Lists
      .replace(/^\s*[-*+]\s+(.+)$/gm, '<li>$1</li>')
      .replace(/^(\d+)\.\s+(.+)$/gm, '<li>$1. $2</li>')
      
      // Wrap lists in ul/ol tags - simplified for compatibility
      .replace(/<li>[^<]*<\/li>/g, '<ul>$&</ul>')
      .replace(/<li>\d+\. [^<]*<\/li>/g, '<ol>$&</ol>')
      
      // Paragraphs (multiple newlines to paragraph breaks)
      .replace(/\n\n+/g, '</p><p>')
      
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
      
      // Remove excessive spacing
      .trim();
  };
  
  // Process email content specially
  if (content.includes('Subject Line:') || content.includes('Subject:')) {
    // Identify email parts
    const subjectMatch = content.match(/(?:\*\*)?Subject(?:\s+Line)?:(?:\*\*)?\s*(.*?)(?:\n|$)/i);
    const subject = subjectMatch ? subjectMatch[1].trim() : '';
    
    let emailText = content
      // Format subject line as a heading
      .replace(/(?:\*\*)?Subject(?:\s+Line)?:(?:\*\*)?\s*(.*?)(?:\n|$)/i, '<div class="email-subject">Subject: $1</div>\n')
      // Clean up greeting line
      .replace(/(?:\*\*)?Dear(?:\*\*)?\s+(.*?)(?:\*\*)?,/i, '<p>Dear $1,</p>')
      // Clean up other markdown
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      .replace(/(?:^|\n)#+\s+(.+)$/gm, '<h3>$1</h3>')
      .replace(/^- (.+)$/gm, '<li>$1</li>')
      .trim();
      
    // Ensure paragraphs are properly wrapped
    if (!emailText.includes('<p>') && !emailText.startsWith('<div class="email-subject">')) {
      const paragraphs = emailText.split('\n\n');
      emailText = paragraphs.map(p => `<p>${p}</p>`).join('');
    }
    
    return emailText;
  }
  
  // For social posts - simpler formatting with fewer HTML tags
  if (content.length < 500 && !content.includes('#')) {
    return content
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      .replace(/\n\n/g, '<br/><br/>')
      .replace(/^- (.+)$/gm, '• $1')
      .trim();
  }
  
  // For blog posts and longer content - full HTML formatting
  let processedContent = processMarkdownToHTML(content);
  
  // Make sure content starts with a paragraph tag if it doesn't have a header
  if (!processedContent.startsWith('<h') && !processedContent.startsWith('<p')) {
    processedContent = `<p>${processedContent}</p>`;
  }
  
  // Replace special placeholders
  processedContent = processedContent
    .replace(/\[Your Name\]/g, '<em>[Your Name]</em>')
    .replace(/\[Your Position\]/g, '<em>[Your Position]</em>')
    .replace(/\[Your Contact Information\]/g, '<em>[Your Contact Information]</em>')
    .replace(/\[Company Name\]/g, '<em>[Company Name]</em>');
  
  return processedContent;
}

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
    // Clean the content from excessive markdown formatting
    return cleanMarkdownFormatting(data.content);
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
  
  let content = '';
  
  switch (contentType) {
    case 'email':
      content = `<div class="email-subject">Subject: Innovative Solutions for ${industry} in the ${region} Region</div>

<p>Dear [${audienceRole}],</p>

<p>I hope this email finds you well. I wanted to reach out about our ${benefit} ${product} solutions and how they can benefit organizations in the ${industry} sector.</p>

<p>Our approach has been designed specifically to address the challenges faced by businesses in the ${region} region. I'd love to schedule a brief call to discuss how we can help.</p>

<p>Best regards,<br/>
<em>[Your Name]</em></p>`;
      break;
      
    case 'social':
      content = `<p><strong>"We've helped ${industry} organizations in the ${region} region achieve remarkable results with our ${benefit} approach."</strong></p>

<p>Our ${product} solutions deliver measurable improvements for ${audienceRole}s facing today's complex challenges.</p>

<p>Learn how our proven methodology can transform your operations: <a href="#">[Link]</a></p>

<p>#${industry.charAt(0).toUpperCase() + industry.slice(1)}Innovation #${benefit.charAt(0).toUpperCase() + benefit.slice(1)} #${region.charAt(0).toUpperCase() + region.slice(1)}Business</p>`;
      break;
      
    case 'blog':
      content = `<h1>Strategic Innovation for ${industry}: ${benefit} Solutions</h1>

<p>In today's competitive landscape, ${industry} organizations in the ${region} region need innovative approaches to stay ahead. This article explores how our ${product} solutions help businesses achieve their strategic goals.</p>

<h2>Key Benefits for ${audienceRole}s</h2>

<ol>
  <li>Improved operational efficiency</li>
  <li>Enhanced competitive positioning</li>
  <li>Better customer experiences</li>
  <li>Strategic advantage in the ${industry} marketplace</li>
</ol>

<p>Contact us to learn more about our proven approach for the ${region} region.</p>`;
      break;
      
    case 'webinar':
      content = `<h1>Strategic Innovation Framework for ${industry} Leaders</h1>

<p><strong>Duration:</strong> 45 minutes + 15-minute Q&A</p>

<p><strong>Target Audience:</strong> ${audienceRole}s and Decision Makers in the ${region} region</p>

<h2>Description:</h2>
<p>Join our industry specialists for a practical, hands-on webinar focused on implementing effective ${benefit} strategies using our ${product} solutions. This session will provide actionable frameworks specifically designed for the ${industry} sector.</p>

<h2>Key Takeaways:</h2>
<ul>
  <li>Practical implementation roadmap for your organization</li>
  <li>ROI calculation methodology</li>
  <li>Risk mitigation strategies</li>
  <li>Resource optimization techniques</li>
</ul>

<p><strong>Presenter:</strong><br/>
<em>[Industry Expert Name]</em>, with extensive experience helping organizations in the ${region} region transform their approach to ${industry}-specific challenges.</p>`;
      break;
      
    default:
      content = `<p>Content about ${product} solutions for ${audienceRole}s in the ${industry} sector (${region} region).</p>`;
  }
  
  return content;
}