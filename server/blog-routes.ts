import { Express, Request, Response } from "express";
import { storage } from "./storage";
import { format } from "date-fns";

// Function to seed default blog posts (only if none exist)
async function seedDefaultBlogPosts() {
  try {
    // Check if there are any blog posts in the database already
    const existingPosts = await storage.getAllBlogPosts();
    if (existingPosts.length > 0) {
      console.log("Blog posts already exist, skipping seeding");
      return;
    }
    
    // Get admin or demo user for author ID
    const admin = await storage.getUserByUsername("admin") || 
                  await storage.getUserByUsername("tovablyadmin") || 
                  await storage.getUserByUsername("demouser");
    
    if (!admin) {
      console.log("No admin user found for blog post seeding");
      return;
    }
    
    // Check if categories exist
    const categories = await storage.getAllBlogCategories();
    const categoryMap = new Map();
    
    for (const category of categories) {
      categoryMap.set(category.slug, category.id);
    }
    
    // Seed default blog posts
    const defaultPosts = [
      {
        title: "Introducing Tovably: Your AI Communication Assistant",
        slug: "introducing-tovably",
        excerpt: "Learn how Tovably can transform your professional communication with AI-powered tone analysis and content generation.",
        content: `# Introducing Tovably: Your AI Communication Assistant

Effective professional communication can make or break business relationships. Whether you're crafting emails, creating content for LinkedIn, or preparing presentations, the tone and style of your communication matters significantly.

## The Communication Challenge

Many professionals struggle with:

* Adapting their writing style to different contexts
* Maintaining consistency in company communications
* Creating engaging content that resonates with their audience
* Finding the right tone for sensitive situations

## How Tovably Solves These Problems

Tovably is an AI-powered platform designed specifically to enhance your professional communication:

### 1. Advanced Tone Analysis
Upload sample text from your website, emails, or documents, and Tovably will analyze the tone, providing insights into how your content is perceived. Understand if your communication comes across as professional, friendly, authoritative, or technical.

### 2. Persona-Based Content Generation
Create customized personas that match your target audience or company voice. Tovably will generate content that aligns with these personas, ensuring consistent communication across all channels.

### 3. Multi-Format Content Support
Generate various types of content:
* Professional emails
* Engaging LinkedIn posts
* Webinar outlines
* Workshop materials

### 4. Time-Saving Features
Stop spending hours crafting the perfect message. With Tovably, generate high-quality content in seconds that can be used immediately or as a solid starting point.

## Getting Started with Tovably

Getting started is simple:
1. Create an account
2. Upload sample content for tone analysis
3. Create personalized personas
4. Start generating professional content

Join thousands of professionals who are already transforming their communication with Tovably.`,
        author_id: admin.id,
        category_id: categoryMap.get("product-updates"),
        featured_image: "/blog-images/introducing-tovably.jpg",
        published: true,
        publish_date: new Date(),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        title: "5 Ways AI is Transforming Business Communication",
        slug: "5-ways-ai-transforming-business-communication",
        excerpt: "Discover how artificial intelligence is revolutionizing how businesses communicate internally and with customers.",
        content: `# 5 Ways AI is Transforming Business Communication

In the rapidly evolving landscape of business technology, artificial intelligence (AI) stands out as a transformative force in professional communication. From automating routine correspondence to providing sophisticated insights into customer interactions, AI is reshaping how businesses connect with their audiences.

## 1. Personalization at Scale

One of the most significant impacts of AI on business communication is the ability to personalize messages at scale. Traditional mass communication often sacrifices personalization for reach. With AI:

* Emails can be tailored to individual preferences while reaching thousands
* Content can adapt based on user behavior and previous interactions
* Marketing messages can reflect specific customer interests and history

This personalization leads to higher engagement rates and stronger customer relationships.

## 2. Tone and Style Analysis

AI systems can now analyze the tone and style of written communication, offering insights that help maintain brand consistency and appropriateness. Tools like Tovably provide:

* Detailed analysis of how your content is perceived
* Suggestions for adjusting tone to match target audiences
* Consistency checks across all company communications

## 3. Language Translation and Cultural Adaptation

For global businesses, AI has revolutionized cross-cultural communication:

* Real-time translation capabilities in multiple languages
* Cultural context adaptations that go beyond literal translation
* Nuance recognition that preserves intended meaning

These capabilities help businesses expand globally while maintaining authentic connections.

## 4. Predictive Responses and Suggestions

AI systems now anticipate communication needs:

* Email response suggestions based on content and context
* Predictive text that speeds up content creation
* Smart replies for common customer inquiries

These features significantly reduce the time spent on routine communications.

## 5. Content Generation and Optimization

Perhaps most revolutionary is AI's ability to generate and optimize content:

* Creating first drafts of emails, reports, and presentations
* Optimizing content for specific platforms (LinkedIn, Twitter, email)
* Suggesting improvements to make communication more effective

## The Future of AI in Business Communication

As AI technology continues to evolve, we can expect even more sophisticated applications:

* Emotion recognition in written and verbal communication
* Advanced sentiment analysis for customer feedback
* Hyper-personalized content streams for each stakeholder

Businesses that embrace these AI capabilities gain a significant competitive advantage through more effective, efficient, and personalized communication.`,
        author_id: admin.id,
        category_id: categoryMap.get("technology"),
        featured_image: "/blog-images/ai-business-communication.jpg",
        published: true,
        publish_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        updated_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      },
      {
        title: "How to Craft the Perfect Cold Email",
        slug: "how-to-craft-the-perfect-cold-email",
        excerpt: "Learn the essential techniques for writing effective cold emails that get responses.",
        content: `# How to Craft the Perfect Cold Email

Cold emailing remains one of the most effective ways to make new business connections, but only when done correctly. The difference between an email that generates a response and one that gets deleted often comes down to a few key elements.

## Understanding the Psychology of Cold Emails

Before diving into specific techniques, it's important to understand what makes people open and respond to cold emails:

* **Recognition of value**: Recipients need to quickly see what's in it for them
* **Authenticity**: People can spot generic templates a mile away
* **Respect for time**: Busy professionals appreciate concise communication
* **Personalization**: Evidence that you've done your homework about them

## Essential Components of Effective Cold Emails

### 1. Subject Lines That Drive Opens

Your subject line is the gateway to your email being read. Effective subject lines:
* Are specific rather than generic
* Create curiosity without being clickbait
* Mention mutual connections when possible
* Keep to 5-7 words for optimal open rates

Examples:
* "Your LinkedIn post about AI inspired this idea"
* "Question about your approach to [specific topic]"
* "[Mutual connection] suggested we connect"

### 2. Personalized Opening Lines

The first 2-3 sentences determine whether the recipient continues reading:
* Reference something specific about them or their work
* Explain why you're reaching out to them specifically
* Establish a legitimate connection or context

### 3. Clear Value Proposition

Quickly transition to why your message matters to them:
* Focus on their needs, not your features
* Be specific about the benefit you're offering
* Quantify value whenever possible

### 4. Concise Body Content

Keep the main content brief and scannable:
* Use short paragraphs (2-3 sentences maximum)
* Include bullet points for easy scanning
* Bold key points sparingly

### 5. Simple, Specific Call to Action

End with one clear next step:
* Ask a specific question that's easy to answer
* Suggest a brief (15-20 minute) call
* Offer a specific date/time rather than a vague request

## Common Cold Email Mistakes to Avoid

Even well-crafted emails can fail if they include these common pitfalls:

* **Being too self-focused**: Talking primarily about your company/product
* **Overwhelming with information**: Trying to explain everything in one email
* **Generic templates**: Failing to customize beyond inserting a name
* **Unclear purpose**: Leaving the recipient confused about what you want
* **Poor timing**: Sending at low-engagement times (Friday afternoons, etc.)

## Using AI to Enhance Cold Emails

Tools like Tovably can significantly improve your cold email effectiveness by:
* Analyzing the tone to ensure it matches your intention
* Generating personalized templates based on your target personas
* Providing suggestions for subject lines with high open rates
* Checking for elements that might trigger spam filters

## Measuring and Improving Results

The key to cold email success is continuous improvement:
* Track open rates, response rates, and conversion metrics
* A/B test different approaches with similar audiences
* Refine your messages based on what generates responses

By following these principles and continually refining your approach, cold emails can become one of your most valuable business development tools.`,
        author_id: admin.id,
        category_id: categoryMap.get("marketing-tips"),
        featured_image: "/blog-images/cold-email-guide.jpg",
        published: true,
        publish_date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
        created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        updated_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
      },
      {
        title: "Case Study: How TechFlow Improved Client Communication with AI",
        slug: "case-study-techflow-improved-communication",
        excerpt: "Learn how a growing tech company revolutionized their client communications using Tovably's AI tools.",
        content: `# Case Study: How TechFlow Improved Client Communication with AI

## Company Background

TechFlow is a software development agency specializing in custom solutions for e-commerce businesses. With a team of 35 developers and project managers, they serve clients across Europe and North America. 

### The Challenge

Despite delivering quality technical work, TechFlow was experiencing several communication challenges:

* **Inconsistent messaging**: Different project managers had vastly different communication styles
* **Client misunderstandings**: Technical details often got lost in translation
* **Scalability issues**: As the company grew, maintaining communication quality became difficult
* **Time constraints**: Project managers spent 15+ hours weekly drafting client emails and reports

According to Sarah Chen, TechFlow's Operations Director: "We were losing deals and experiencing project friction not because of our technical capabilities, but because of communication gaps."

## The Solution: Implementing Tovably

After researching various options, TechFlow implemented Tovably's AI communication platform as part of their client management workflow.

### Implementation Process

1. **Tone Analysis**: TechFlow uploaded samples of their most successful client communications
2. **Persona Creation**: They developed three key personas:
   * Technical Client Communication
   * Non-Technical Client Communication
   * Project Status Updates
3. **Team Training**: All project managers received training on using the AI tools
4. **Workflow Integration**: Tovably was integrated into their project management system

## Results

After six months of implementation, TechFlow saw measurable improvements:

### Quantitative Results

* **70% reduction** in time spent drafting client communications
* **32% increase** in positive client feedback scores
* **28% decrease** in clarification requests from clients
* **15% improvement** in project milestone completion rates

### Qualitative Improvements

* **More consistent messaging**: All client communications maintained a unified company voice
* **Better technical translation**: Complex concepts were communicated more clearly to non-technical clients
* **Improved client onboarding**: New client relationships started more smoothly
* **Faster response times**: Project managers could respond to client inquiries more quickly

## Key Features That Made the Difference

According to the TechFlow team, several specific Tovably features drove these improvements:

### 1. Tone Analysis
"The tone analysis helped us understand how our messages were being perceived. We discovered our technical team often came across as condescending without realizing it." - Dev Team Lead

### 2. Persona-Based Generation
"Having pre-built personas for different communication needs meant we could quickly generate appropriate drafts for any situation." - Project Manager

### 3. Content Library
"Building a library of successful communication templates that could be customized saved enormous amounts of time." - Operations Director

## Implementation Challenges

The transition wasn't without challenges:

* **Initial resistance**: Some team members were hesitant to use AI-generated content
* **Customization needs**: Early outputs sometimes needed significant editing
* **Learning curve**: It took time to create effective personas

## How They Overcame Obstacles

TechFlow addressed these challenges by:

* Starting with a pilot group of willing early adopters
* Creating a feedback loop to continuously improve the personas
* Developing clear guidelines for when and how to customize AI-generated content

## Long-Term Impact

One year later, TechFlow credits improved client communication as a significant factor in their business growth:

* Won 3 major clients who specifically cited clear communication as a differentiator
* Expanded their retainer contracts by 40%
* Reduced client churn by 25%

"Tovably didn't just improve our communications—it transformed our client relationships and directly impacted our bottom line," says Chen. "What started as a solution to a communication problem became a competitive advantage."

## Lessons Learned

TechFlow's experience offers valuable insights for other companies:

1. **Communication is technical**: Treat communication as a technical skill that can be analyzed and improved
2. **Consistency matters**: Clients value consistent communication as much as they value consistent technical delivery
3. **AI augmentation works**: The best results came from using AI to augment rather than replace human communication
4. **Measure the impact**: Tracking communication metrics revealed the business value of improved messaging

By systematically addressing their communication challenges with AI assistance, TechFlow transformed a weakness into a strength, proving that effective communication is as crucial to technical success as code quality.`,
        author_id: admin.id,
        category_id: categoryMap.get("case-studies"),
        featured_image: "/blog-images/techflow-case-study.jpg",
        published: true,
        publish_date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000), // 21 days ago
        created_at: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
        updated_at: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000)
      }
    ];
    
    // Create blog posts in the database
    for (const post of defaultPosts) {
      await storage.createBlogPost(post);
      console.log(`Created blog post: ${post.title}`);
    }
    
    console.log("Default blog posts have been seeded successfully");
  } catch (error) {
    console.error("Error seeding default blog posts:", error);
  }
}

export function registerBlogRoutes(app: Express) {
  // Seed default blog posts when the server starts
  seedDefaultBlogPosts();
  // RSS feed endpoint
  app.get("/api/blog-rss", async (_req: Request, res: Response) => {
    try {
      const posts = await storage.getAllBlogPosts({ published: true });
      
      // Generate RSS XML
      const hostname = process.env.NODE_ENV === 'production' ? 'https://tovably.com' : 'http://localhost:5000';
      
      const rssItems = posts.map((post: any) => {
        const postUrl = `${hostname}/blog/${post.slug}`;
        const pubDate = new Date(post.publish_date || post.created_at).toUTCString();
        
        return `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${postUrl}</link>
      <guid>${postUrl}</guid>
      <pubDate>${pubDate}</pubDate>
      <description><![CDATA[${post.excerpt}]]></description>
      <content:encoded><![CDATA[${post.content}]]></content:encoded>
    </item>`;
      }).join('\n');
      
      const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Tovably Blog</title>
    <link>${hostname}/blog</link>
    <description>News and Updates about Tovably</description>
    <atom:link href="${hostname}/api/blog-rss" rel="self" type="application/rss+xml" />
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>${rssItems}
  </channel>
</rss>`;

      res.header('Content-Type', 'application/xml');
      res.send(rssXml);
    } catch (error) {
      console.error("Error generating RSS feed:", error);
      res.status(500).json({ error: "Failed to generate RSS feed" });
    }
  });
  
  // Public blog routes
  
  // Get all blog categories
  app.get("/api/blog-categories", async (_req: Request, res: Response) => {
    try {
      const categories = await storage.getAllBlogCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch blog categories" });
    }
  });
  
  // Get a specific blog category by slug
  app.get("/api/blog-categories/:slug", async (req: Request, res: Response) => {
    try {
      const category = await storage.getBlogCategoryBySlug(req.params.slug);
      if (!category) {
        return res.status(404).json({ error: "Blog category not found" });
      }
      res.json(category);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch blog category" });
    }
  });
  
  // Get all published blog posts (with pagination and filtering)
  app.get("/api/blog-posts", async (req: Request, res: Response) => {
    try {
      const options = {
        published: true,
        limit: req.query.limit ? parseInt(req.query.limit as string, 10) : undefined,
        offset: req.query.offset ? parseInt(req.query.offset as string, 10) : undefined,
        categoryId: req.query.category_id ? parseInt(req.query.category_id as string, 10) : undefined
      };
      
      const posts = await storage.getAllBlogPosts(options);
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch blog posts" });
    }
  });
  
  // Get a specific blog post by slug
  app.get("/api/blog-posts/:slug", async (req: Request, res: Response) => {
    try {
      const post = await storage.getBlogPostBySlug(req.params.slug);
      if (!post) {
        return res.status(404).json({ error: "Blog post not found" });
      }
      
      // Only return published posts
      if (!post.published) {
        return res.status(404).json({ error: "Blog post not found" });
      }
      
      res.json(post);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch blog post" });
    }
  });
}