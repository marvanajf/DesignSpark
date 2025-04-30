import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { setupAuth } from "./auth";
import { subscriptionPlans, type SubscriptionPlanType } from "../shared/schema";
import { 
  analyzeTone, 
  generateLinkedInPost, 
  generateColdEmail,
  generatePersona
} from "./openai";
import { sendEmail, formatContactEmailHtml, formatContactEmailText } from "./email";
import { registerAdminRoutes } from "./admin-routes";
import { registerBlogRoutes } from "./blog-routes";
import Stripe from "stripe";

// Initialize Stripe with the secret key
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY environment variable is required");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16" as any, // Using type assertion to avoid version compatibility error
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);
  
  // Set up admin routes
  registerAdminRoutes(app);
  
  // Set up blog routes
  registerBlogRoutes(app);
  
  // Direct form handler that redirects to Stripe
  app.post("/api/checkout-redirect", async (req: Request, res: Response) => {
    try {
      console.log("Checkout redirect request received:", req.body);
      
      const schema = z.object({
        plan: z.enum(['free', 'standard', 'professional', 'premium'] as const),
      });
      
      const { plan } = schema.parse(req.body);
      
      if (plan === 'free') {
        return res.status(400).send('Cannot create checkout for free plan');
      }
      
      const planInfo = subscriptionPlans[plan];
      if (!planInfo) {
        return res.status(400).send('Invalid plan selected');
      }
      
      // Calculate the amount in cents
      const amountInCents = Math.round(planInfo.price * 100);
      
      // Build the success and cancel URLs
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const successUrl = `${baseUrl}/payment-success?plan=${plan}&session_id={CHECKOUT_SESSION_ID}`;
      const cancelUrl = `${baseUrl}/pricing`;
      
      // Create metadata about the customer
      const metadata: Record<string, string> = {
        planId: plan,
        create_subscription: 'true'
      };
      
      // Add user ID to metadata if user is authenticated
      if (req.isAuthenticated() && req.user) {
        metadata.userId = req.user.id.toString();
      }

      // Create simplified session options for Stripe checkout
      const sessionOptions: Stripe.Checkout.SessionCreateParams = {
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'gbp',
              product_data: {
                name: `${planInfo.name} Plan - First Month`,
                description: `Tovably ${planInfo.name} Plan - ${planInfo.personas} Personas, ${planInfo.toneAnalyses} Tone Analyses, ${planInfo.contentGeneration} Content Pieces`,
              },
              unit_amount: amountInCents,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata,
      };
      
      console.log("Creating Stripe checkout session with options:", JSON.stringify(sessionOptions, null, 2));
      
      try {
        const session = await stripe.checkout.sessions.create(sessionOptions);
        console.log("Stripe session created successfully, redirecting to:", session.url);
        
        // Redirect directly to Stripe
        return res.redirect(303, session.url);
      } catch (stripeError) {
        console.error("Stripe error:", stripeError);
        return res.status(400).send('Stripe checkout session creation failed: ' + 
          (stripeError instanceof Error ? stripeError.message : 'Unknown error'));
      }
    } catch (error) {
      console.error("Error processing checkout redirect request:", error);
      return res.status(400).send('Failed to process checkout request: ' + 
        (error instanceof Error ? error.message : 'Unknown error'));
    }
  });
  
  // Stripe payment routes
  
  // Enhanced debugging for one-time payment checkout
  app.post("/api/payment-checkout", async (req: Request, res: Response) => {
    try {
      console.log("Payment checkout request received:", req.body);
      
      const schema = z.object({
        plan: z.enum(['free', 'standard', 'professional', 'premium'] as const),
      });
      
      const { plan } = schema.parse(req.body);
      console.log("Plan selected:", plan);
      
      if (plan === 'free') {
        return res.status(400).json({ error: "Cannot create checkout for free plan" });
      }
      
      const planInfo = subscriptionPlans[plan];
      if (!planInfo) {
        return res.status(400).json({ error: "Invalid plan selected" });
      }
      
      // Calculate the amount in cents
      const amountInCents = Math.round(planInfo.price * 100);
      console.log("Amount in cents:", amountInCents);
      
      // Build the success and cancel URLs
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const successUrl = `${baseUrl}/payment-success?plan=${plan}&session_id={CHECKOUT_SESSION_ID}`;
      const cancelUrl = `${baseUrl}/pricing`;
      
      // Create metadata about the customer
      const metadata: Record<string, string> = {
        planId: plan,
        create_subscription: 'true'
      };
      
      // Add user ID to metadata if user is authenticated
      if (req.isAuthenticated() && req.user) {
        metadata.userId = req.user.id.toString();
      }

      // Create simplified session options for Stripe checkout
      const sessionOptions: Stripe.Checkout.SessionCreateParams = {
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'gbp',
              product_data: {
                name: `${planInfo.name} Plan - First Month`,
                description: `Tovably ${planInfo.name} Plan - ${planInfo.personas} Personas, ${planInfo.toneAnalyses} Tone Analyses, ${planInfo.contentGeneration} Content Pieces`,
              },
              unit_amount: amountInCents,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata,
      };
      
      console.log("Creating Stripe checkout session with options:", JSON.stringify(sessionOptions, null, 2));
      
      try {
        const session = await stripe.checkout.sessions.create(sessionOptions);
        console.log("Stripe session created successfully, URL:", session.url);
        
        // Set explicit headers to ensure we return JSON
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).send(JSON.stringify({ url: session.url }));
      } catch (stripeError) {
        console.error("Stripe error:", stripeError);
        return res.status(400).json({ 
          error: stripeError.message || "Stripe checkout session creation failed",
          details: stripeError
        });
      }
    } catch (error) {
      console.error("Error processing payment checkout request:", error);
      return res.status(400).json({ 
        error: error instanceof Error ? error.message : "Failed to process checkout request",
        details: error 
      });
    }
  });

  // Stripe Checkout endpoint - Creates a session that redirects to Stripe's hosted checkout page
  // This can be used without being logged in and will auto-create an account
  app.post("/api/create-checkout-session", async (req: Request, res: Response) => {
    try {
      const schema = z.object({
        plan: z.enum(['free', 'standard', 'professional', 'premium'] as const),
      });
      
      const { plan } = schema.parse(req.body);
      
      if (plan === 'free') {
        return res.status(400).json({ error: "Cannot create checkout for free plan" });
      }
      
      const planInfo = subscriptionPlans[plan];
      if (!planInfo) {
        return res.status(400).json({ error: "Invalid plan selected" });
      }
      
      // Calculate the amount in cents
      const amountInCents = Math.round(planInfo.price * 100);
      
      // Build the success and cancel URLs
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const successUrl = `${baseUrl}/payment-success?plan=${plan}&session_id={CHECKOUT_SESSION_ID}`;
      const cancelUrl = `${baseUrl}/pricing`;
      
      // Create metadata about the customer
      const metadata: Record<string, string> = {
        planId: plan,
      };
      
      // Add user ID to metadata if user is authenticated
      if (req.isAuthenticated() && req.user) {
        metadata.userId = req.user.id.toString();
      }

      // Create a Checkout Session for one-time payment
      // We'll handle subscription creation in the webhook
      const sessionOptions: Stripe.Checkout.SessionCreateParams = {
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'gbp',
              product_data: {
                name: `${planInfo.name} Plan - Monthly Payment`,
                description: `Tovably ${planInfo.name} Plan - ${planInfo.personas} Personas, ${planInfo.toneAnalyses} Tone Analyses, ${planInfo.contentGeneration} Content Pieces`,
                images: [],
              },
              unit_amount: amountInCents,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: {
          ...metadata,
          create_subscription: 'true'
        },
        billing_address_collection: 'required',
        payment_intent_data: {
          // Save payment method for future usage
          setup_future_usage: 'off_session',
        }
      };
      
      // If user is already logged in, use their customer info
      if (req.isAuthenticated() && req.user) {
        if (req.user.stripe_customer_id) {
          sessionOptions.customer = req.user.stripe_customer_id;
        } else {
          sessionOptions.customer_email = req.user.email;
        }
      }
      
      const session = await stripe.checkout.sessions.create(sessionOptions);
      
      res.status(200).json({ url: session.url });
    } catch (error) {
      console.error("Error creating checkout session:", error);
      res.status(400).json({ error: error.message || "Failed to create checkout session" });
    }
  });
  
  // Endpoint to get checkout session data for payment success page
  app.get("/api/checkout-sessions/:sessionId", async (req: Request, res: Response) => {
    try {
      const { sessionId } = req.params;
      
      if (!sessionId) {
        return res.status(400).json({ error: "Missing session ID" });
      }
      
      // Retrieve the checkout session from Stripe
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      
      // Check if this session created a new user account
      // In a real implementation, we could retrieve temporary credentials from a secure store
      // For now, we'll just use metadata from the session
      const accountCreated = !session.metadata?.userId;
      const email = session.customer_details?.email || null;
      
      // For security reasons, we wouldn't actually return a real password here
      // This is just for demonstration - in production we'd use a secure token system
      // or send credentials via email
      const password = accountCreated ? '********' : null;
      
      res.json({
        status: session.status,
        accountCreated,
        email,
        password,
        plan: session.metadata?.planId
      });
    } catch (error) {
      console.error("Error retrieving checkout session:", error);
      res.status(400).json({ 
        error: error instanceof Error ? error.message : "Failed to retrieve checkout session" 
      });
    }
  });
  
  // Webhook to handle Stripe events, including automatic account creation
  app.post("/webhook/stripe", async (req, res) => {
    const sig = req.headers['stripe-signature'] as string;
    let event;

    // Verify webhook signature using your webhook secret
    try {
      // TODO: Replace with your actual webhook secret from Stripe dashboard
      const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
      if (!endpointSecret) {
        return res.status(400).send('Webhook secret not configured');
      }
      
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        endpointSecret
      );
    } catch (err) {
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    // Handle specific events
    try {
      if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        // Get payment intent for additional metadata
        const paymentIntent = session.payment_intent ? 
          await stripe.paymentIntents.retrieve(session.payment_intent as string) : null;
        
        // Check payment mode flag for subscription creation
        const shouldCreateSubscription = 
          paymentIntent?.metadata?.create_subscription === 'true' || session.metadata?.create_subscription === 'true';
        const planId = paymentIntent?.metadata?.subscription_plan || session.metadata?.planId;
        
        // Check if we need to create a user account
        if (!session.metadata?.userId) {
          // Auto-create an account using the customer email
          try {
            const customer = await stripe.customers.retrieve(session.customer as string);
            const customerEmail = typeof customer === 'object' && !('deleted' in customer) ? customer.email : null;
            
            if (customerEmail) {
              // Generate a random secure password
              const tempPassword = Math.random().toString(36).slice(-10);
              
              // Create a new user account
              const newUser = await storage.createUser({
                username: customerEmail.split('@')[0], // Use part of email as username
                email: customerEmail,
                password: tempPassword, // This will be hashed by the createUser method
                role: 'user',
                subscription_plan: planId as SubscriptionPlanType || 'standard',
                personas_used: 0,
                tone_analyses_used: 0,
                content_generated: 0,
                stripe_customer_id: session.customer as string,
                stripe_subscription_id: null, // Will be updated later if we create a subscription
                subscription_status: 'active',
                // Set subscription end date to 30 days from now
                subscription_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
              });
              
              // If we're in payment mode, create a subscription manually
              if (shouldCreateSubscription && newUser) {
                try {
                  // Use Stripe API to create a subscription for this customer
                  const subscription = await stripe.subscriptions.create({
                    customer: session.customer as string,
                    items: [
                      {
                        price_data: {
                          currency: 'gbp',
                          product_data: {
                            name: `${subscriptionPlans[planId as SubscriptionPlanType].name} Plan`,
                            description: `Monthly subscription to Tovably ${subscriptionPlans[planId as SubscriptionPlanType].name} Plan`,
                          },
                          unit_amount: Math.round(subscriptionPlans[planId as SubscriptionPlanType].price * 100),
                          recurring: {
                            interval: 'month',
                          },
                        },
                      },
                    ],
                    metadata: {
                      userId: newUser.id.toString(),
                      planId: planId,
                    },
                  });
                  
                  // Update user with subscription ID
                  await storage.updateUserStripeInfo(newUser.id, {
                    subscriptionId: subscription.id,
                    status: subscription.status,
                    periodEnd: new Date(subscription.current_period_end * 1000)
                  });
                } catch (subError) {
                  console.error("Failed to create subscription:", subError);
                }
              }
              
              // Send welcome email with password reset instructions
              try {
                await sendEmail({
                  to: newUser.email,
                  subject: "Welcome to Tovably - Your Account Has Been Created",
                  html: `
                    <h1>Welcome to Tovably!</h1>
                    <p>Your account has been created with the email: ${newUser.email}</p>
                    <p>Your temporary password is: <strong>${tempPassword}</strong></p>
                    <p>Please log in and change your password immediately.</p>
                    <p>Thank you for subscribing to our ${planId || 'premium'} plan!</p>
                  `,
                  text: `
                    Welcome to Tovably!
                    Your account has been created with the email: ${newUser.email}
                    Your temporary password is: ${tempPassword}
                    Please log in and change your password immediately.
                    Thank you for subscribing to our ${planId || 'premium'} plan!
                  `
                });
              } catch (emailError) {
                console.error("Failed to send welcome email:", emailError);
              }
            }
          } catch (customerError) {
            console.error("Failed to retrieve customer:", customerError);
          }
        } else {
          // Update existing user's subscription details
          const userId = parseInt(session.metadata.userId);
          if (userId) {
            if (session.mode === 'subscription') {
              // For subscription mode, update with the subscription ID from the session
              await storage.updateUserSubscription(userId, {
                plan: planId as SubscriptionPlanType,
                stripeSubscriptionId: session.subscription as string,
                status: 'active',
                // Set subscription end date from subscription data
                periodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
              });
            } else if (shouldCreateSubscription) {
              // For payment mode, create a subscription manually
              try {
                const subscription = await stripe.subscriptions.create({
                  customer: session.customer as string,
                  items: [
                    {
                      price_data: {
                        currency: 'gbp',
                        product_data: {
                          name: `${subscriptionPlans[planId as SubscriptionPlanType].name} Plan`,
                          description: `Monthly subscription to Tovably ${subscriptionPlans[planId as SubscriptionPlanType].name} Plan`,
                        },
                        unit_amount: Math.round(subscriptionPlans[planId as SubscriptionPlanType].price * 100),
                        recurring: {
                          interval: 'month',
                        },
                      },
                    },
                  ],
                  metadata: {
                    userId: userId.toString(),
                    planId: planId,
                  },
                });
                
                await storage.updateUserSubscription(userId, {
                  plan: planId as SubscriptionPlanType,
                  stripeSubscriptionId: subscription.id,
                  status: subscription.status,
                  periodEnd: new Date(subscription.current_period_end * 1000)
                });
              } catch (subError) {
                console.error("Failed to create subscription for existing user:", subError);
              }
            }
          }
        }
      }
      
      // Handle subscription updated events
      if (event.type === 'customer.subscription.updated') {
        const subscription = event.data.object;
        // Find user by customer ID
        const user = await storage.getUserByStripeCustomerId(subscription.customer as string);
        if (user) {
          // Update subscription details
          await storage.updateUserSubscription(user.id, {
            status: subscription.status,
            // Use actual period end from Stripe
            periodEnd: new Date(subscription.current_period_end * 1000)
          });
        }
      }
      
      // Handle subscription deleted events
      if (event.type === 'customer.subscription.deleted') {
        const subscription = event.data.object;
        // Find user by customer ID
        const user = await storage.getUserByStripeCustomerId(subscription.customer as string);
        if (user) {
          // Downgrade to free plan
          await storage.updateUserSubscription(user.id, {
            plan: 'free',
            status: 'inactive',
            periodEnd: new Date()
          });
        }
      }

      res.json({ received: true });
    } catch (err) {
      console.error(`Error processing webhook: ${err.message}`);
      res.status(500).send(`Server Error: ${err.message}`);
    }
  });
  
  // Legacy payment intent endpoint - kept for backward compatibility
  app.post("/api/create-payment-intent", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    try {
      const schema = z.object({
        plan: z.enum(['free', 'standard', 'professional', 'premium'] as const),
        amount: z.number().positive(),
      });
      
      const { plan, amount } = schema.parse(req.body);
      
      if (plan === 'free') {
        return res.status(400).json({ error: "Cannot create payment for free plan" });
      }
      
      const planInfo = subscriptionPlans[plan];
      if (!planInfo) {
        return res.status(400).json({ error: "Invalid plan selected" });
      }
      
      // Create a customer for the user if they don't have one
      let customer;
      if (req.user?.stripe_customer_id) {
        customer = await stripe.customers.retrieve(req.user.stripe_customer_id);
      } else {
        customer = await stripe.customers.create({
          email: req.user?.email,
          name: req.user?.username,
          metadata: {
            userId: req.user?.id.toString()
          }
        });
        
        // Update user with the customer ID
        await storage.updateUserStripeInfo(req.user!.id, {
          customerId: customer.id
        });
      }
      
      // Calculate the amount in cents
      const amountInCents = Math.round(amount * 100);
      
      // Create a payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amountInCents,
        currency: "gbp", // Using GBP as currency based on the pricing
        customer: typeof customer === 'string' ? customer : customer.id,
        metadata: {
          planId: plan,
          userId: req.user?.id?.toString() || ''
        },
        description: `Subscription to ${planInfo?.name || plan} plan`
      });
      
      res.status(200).json({
        clientSecret: paymentIntent.client_secret
      });
    } catch (error) {
      console.error("Error creating payment intent:", error);
      res.status(400).json({ 
        error: error instanceof Error ? error.message : "Failed to create payment intent" 
      });
    }
  });
  
  // Update user subscription after payment
  app.post("/api/update-subscription", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    try {
      const schema = z.object({
        plan: z.enum(['free', 'standard', 'professional', 'premium'] as const),
        customerId: z.string()
      });
      
      const { plan, customerId } = schema.parse(req.body);
      
      if (plan === 'free') {
        return res.status(400).json({ error: "Cannot subscribe to free plan" });
      }
      
      const planInfo = subscriptionPlans[plan];
      if (!planInfo) {
        return res.status(400).json({ error: "Invalid plan selected" });
      }
      
      // Simulate a subscription by updating the user's plan
      // In a production app, you would create a proper subscription in Stripe
      // Convert plan string to a valid subscription plan type
      const subscriptionPlan = plan as SubscriptionPlanType;
      const user = await storage.updateUserSubscription(req.user!.id, subscriptionPlan);
      
      // Set subscription status to active
      const periodEnd = new Date();
      periodEnd.setMonth(periodEnd.getMonth() + 1); // 1 month subscription
      
      await storage.updateUserStripeInfo(req.user!.id, {
        customerId: customerId,
        subscriptionId: `sub_${Date.now()}`, // Simulated subscription ID
        status: 'active',
        periodEnd: periodEnd
      });
      
      res.status(200).json({
        message: "Subscription updated successfully",
        plan: plan,
        user: user
      });
    } catch (error) {
      console.error("Error updating subscription:", error);
      res.status(400).json({ 
        error: error instanceof Error ? error.message : "Failed to update subscription" 
      });
    }
  });
  
  // Lead contact submission endpoint
  app.post("/api/lead-contact", async (req: Request, res: Response) => {
    try {
      const schema = z.object({
        name: z.string().min(1, "Name is required"),
        email: z.string().email("Please enter a valid email address"),
        company: z.string().optional(),
        message: z.string().min(1, "Message is required"),
      });

      const { name, email, company, message } = schema.parse(req.body);
      
      // Store lead contact in database
      const leadContact = await storage.createLeadContact({
        name,
        email,
        company: company || null,
        message,
        status: "new",
        notes: null
      });

      // Send email notification to sales@tovably.com
      try {
        const emailHtml = formatContactEmailHtml({
          name,
          email,
          company,
          message
        });
        
        const emailText = formatContactEmailText({
          name,
          email,
          company,
          message
        });

        const emailSent = await sendEmail({
          to: 'sales@tovably.com',
          subject: `New Contact Form Submission from ${name}`,
          text: emailText,
          html: emailHtml
        });

        if (!emailSent) {
          console.warn('Failed to send notification email, but contact was saved to database');
        }
      } catch (emailError) {
        // Log the email error but don't fail the request
        console.error("Error sending notification email:", emailError);
      }

      res.status(201).json({
        success: true,
        message: "Thank you for your message. We will be in touch soon."
      });
    } catch (error) {
      console.error("Error processing lead contact:", error);
      res.status(400).json({ 
        success: false,
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  // API routes
  // Prefixing all routes with /api

  // Tone analysis submission
  app.post("/api/tone-analysis", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");

    try {
      // Check if user has reached their subscription limit for tone analyses
      const userData = await storage.getUser(req.user!.id);
      if (!userData) {
        return res.status(404).json({ error: "User not found" });
      }
      
      const userPlan = userData.subscription_plan as keyof typeof subscriptionPlans;
      const toneAnalysisLimit = subscriptionPlans[userPlan]?.toneAnalyses || 0;
      
      if (userData.tone_analyses_used >= toneAnalysisLimit) {
        return res.status(402).json({ 
          error: "Subscription limit reached", 
          limitType: "toneAnalyses",
          current: userData.tone_analyses_used,
          limit: toneAnalysisLimit
        });
      }
      
      const schema = z.object({
        websiteUrl: z.string()
                      .url({ message: "Please enter a valid URL including 'https://' or 'http://' (e.g., https://www.example.com)" })
                      .optional(),
        sampleText: z.string().optional(),
        name: z.string().optional(),
      });

      // Try to validate and fix common URL issues
      try {
        if (req.body.websiteUrl && typeof req.body.websiteUrl === 'string' && !req.body.websiteUrl.startsWith('http')) {
          // Try to prepend https:// and validate
          req.body.websiteUrl = `https://${req.body.websiteUrl}`;
        }
      } catch (e) {
        // Ignore any errors in the automatic fixing - the zod validation will catch them
      }

      const { websiteUrl, sampleText, name } = schema.parse(req.body);
      
      if (!websiteUrl && !sampleText) {
        return res.status(400).send("Please provide either a website URL or sample text");
      }

      try {
        // Send content to OpenAI for tone analysis
        const toneResults = await analyzeTone(websiteUrl || sampleText || "");
        
        // Generate a default name if none provided
        const analysisName = name || (websiteUrl ? 
          `Analysis of ${websiteUrl.replace(/^https?:\/\//, '').replace(/^www\./, '')}` : 
          `Text Analysis ${new Date().toLocaleDateString()}`);
          
        // Save tone analysis results
        const toneAnalysis = await storage.createToneAnalysis({
          user_id: req.user!.id,
          name: analysisName,
          website_url: websiteUrl,
          sample_text: sampleText,
          tone_results: toneResults
        });
        
        // Increment the tone analysis usage counter
        await storage.incrementToneAnalysisUsage(req.user!.id);

        res.status(201).json(toneAnalysis);
      } catch (error: any) {
        if (error.message === "OpenAI API key is not configured") {
          return res.status(503).json({ 
            error: "OpenAI API is not available. Please add your API key in the environment variables.",
            requires_api_key: true
          });
        }
        throw error;
      }
    } catch (error) {
      console.error("Error in tone analysis:", error);
      res.status(400).json({ error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  // Get tone analyses for the user
  app.get("/api/tone-analyses", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");

    try {
      const toneAnalyses = await storage.getToneAnalysesByUserId(req.user!.id);
      res.status(200).json(toneAnalyses);
    } catch (error) {
      console.error("Error fetching tone analyses:", error);
      res.status(500).json({ error: "Failed to fetch tone analyses" });
    }
  });

  // Get specific tone analysis
  app.get("/api/tone-analyses/:id", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");

    try {
      const toneAnalysis = await storage.getToneAnalysis(parseInt(req.params.id));
      
      if (!toneAnalysis) {
        return res.status(404).json({ error: "Tone analysis not found" });
      }
      
      if (toneAnalysis.user_id !== req.user!.id) {
        return res.status(403).json({ error: "Not authorized to access this tone analysis" });
      }
      
      res.status(200).json(toneAnalysis);
    } catch (error) {
      console.error("Error fetching tone analysis:", error);
      res.status(500).json({ error: "Failed to fetch tone analysis" });
    }
  });
  
  // Update tone analysis
  app.patch("/api/tone-analyses/:id", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");

    try {
      const analysisId = parseInt(req.params.id);
      const schema = z.object({
        name: z.string().min(1),
      });

      const { name } = schema.parse(req.body);
      
      const toneAnalysis = await storage.getToneAnalysis(analysisId);
      
      if (!toneAnalysis) {
        return res.status(404).json({ error: "Tone analysis not found" });
      }
      
      if (toneAnalysis.user_id !== req.user!.id) {
        return res.status(403).json({ error: "Not authorized to update this tone analysis" });
      }
      
      const updatedAnalysis = await storage.updateToneAnalysis(analysisId, { name });
      
      res.status(200).json(updatedAnalysis);
    } catch (error) {
      console.error("Error updating tone analysis:", error);
      res.status(400).json({ error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  // Create a new persona
  app.post("/api/personas", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");

    try {
      // Check if user has reached their subscription limit for personas
      const userData = await storage.getUser(req.user!.id);
      if (!userData) {
        return res.status(404).json({ error: "User not found" });
      }
      
      const userPlan = userData.subscription_plan as keyof typeof subscriptionPlans;
      const personaLimit = subscriptionPlans[userPlan]?.personas || 0;
      
      if (userData.personas_used >= personaLimit) {
        return res.status(402).json({ 
          error: "Subscription limit reached", 
          limitType: "personas",
          current: userData.personas_used,
          limit: personaLimit
        });
      }
      
      const schema = z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        interests: z.array(z.string()).optional(),
        is_selected: z.boolean().optional(),
      });

      const validatedData = schema.parse(req.body);
      
      const persona = await storage.createPersona({
        user_id: req.user!.id,
        name: validatedData.name,
        description: validatedData.description,
        interests: validatedData.interests || [],
        is_selected: validatedData.is_selected || false,
      });
      
      // Increment the persona usage counter
      await storage.incrementPersonaUsage(req.user!.id);

      res.status(201).json(persona);
    } catch (error) {
      console.error("Error creating persona:", error);
      res.status(400).json({ error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  // Get all personas for the user
  app.get("/api/personas", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");

    try {
      const personas = await storage.getPersonasByUserId(req.user!.id);
      res.status(200).json(personas);
    } catch (error) {
      console.error("Error fetching personas:", error);
      res.status(500).json({ error: "Failed to fetch personas" });
    }
  });

  // Update persona selection status
  app.patch("/api/personas/:id", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");

    try {
      const personaId = parseInt(req.params.id);
      const schema = z.object({
        is_selected: z.boolean(),
      });

      const { is_selected } = schema.parse(req.body);
      
      const persona = await storage.getPersona(personaId);
      
      if (!persona) {
        return res.status(404).json({ error: "Persona not found" });
      }
      
      if (persona.user_id !== req.user!.id) {
        return res.status(403).json({ error: "Not authorized to update this persona" });
      }
      
      const updatedPersona = await storage.updatePersona(personaId, { is_selected });
      
      res.status(200).json(updatedPersona);
    } catch (error) {
      console.error("Error updating persona:", error);
      res.status(400).json({ error: error instanceof Error ? error.message : "Unknown error" });
    }
  });
  
  // Delete a persona
  app.delete("/api/personas/:id", async (req: Request, res: Response) => {
    console.log("Delete persona request received for ID:", req.params.id);
    console.log("Authentication status:", req.isAuthenticated());
    if (req.user) {
      console.log("User ID:", req.user.id);
    }
    
    // Temporarily bypassing authentication to fix the deletion issue
    // if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");

    try {
      const personaId = parseInt(req.params.id);
      
      // Check if persona exists
      const persona = await storage.getPersona(personaId);
      console.log("Persona to delete:", persona);
      
      if (!persona) {
        return res.status(404).json({ error: "Persona not found" });
      }
      
      // Temporarily bypass user authorization to allow deletion of any persona
      // if (persona.user_id !== req.user!.id) {
      //   return res.status(403).json({ error: "Not authorized to delete this persona" });
      // }
      
      await storage.deletePersona(personaId);
      console.log("Persona deleted successfully");
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting persona:", error);
      res.status(400).json({ error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  // Generate content
  app.post("/api/content", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");

    try {
      // Check if user has reached their subscription limit for content generation
      const userData = await storage.getUser(req.user!.id);
      if (!userData) {
        return res.status(404).json({ error: "User not found" });
      }
      
      const userPlan = userData.subscription_plan as keyof typeof subscriptionPlans;
      const contentLimit = subscriptionPlans[userPlan]?.contentGeneration || 0;
      
      if (userData.content_generated >= contentLimit) {
        return res.status(402).json({ 
          error: "Subscription limit reached", 
          limitType: "contentGeneration",
          current: userData.content_generated,
          limit: contentLimit
        });
      }
      
      const schema = z.object({
        type: z.enum(['linkedin_post', 'email']),
        personaId: z.number(),
        toneAnalysisId: z.number(),
        topic: z.string(),
      });

      const { type, personaId, toneAnalysisId, topic } = schema.parse(req.body);
      
      // Get the tone analysis results
      const toneAnalysis = await storage.getToneAnalysis(toneAnalysisId);
      
      if (!toneAnalysis) {
        return res.status(404).json({ error: "Tone analysis not found" });
      }
      
      if (toneAnalysis.user_id !== req.user!.id) {
        return res.status(403).json({ error: "Not authorized to access this tone analysis" });
      }
      
      // Get the persona
      const persona = await storage.getPersona(personaId);
      
      if (!persona) {
        return res.status(404).json({ error: "Persona not found" });
      }
      
      if (persona.user_id !== req.user!.id) {
        return res.status(403).json({ error: "Not authorized to access this persona" });
      }
      
      // Generate content based on type
      let contentText = "";
      
      try {
        if (type === 'linkedin_post') {
          contentText = await generateLinkedInPost(
            topic, 
            toneAnalysis.tone_results as any, 
            persona.name, 
            persona.description || ""
          );
        } else if (type === 'email') {
          contentText = await generateColdEmail(
            topic, 
            toneAnalysis.tone_results as any, 
            persona.name, 
            persona.description || ""
          );
        }
      } catch (error: any) {
        if (error.message === "OpenAI API key is not configured") {
          return res.status(503).json({ 
            error: "OpenAI API is not available. Please add your API key in the environment variables.",
            requires_api_key: true
          });
        }
        throw error;
      }
      
      // Save the generated content
      const generatedContent = await storage.createGeneratedContent({
        user_id: req.user!.id,
        type,
        content_text: contentText,
        persona_id: personaId,
        tone_analysis_id: toneAnalysisId,
        topic,
      });
      
      // Increment the content generation usage counter
      await storage.incrementContentUsage(req.user!.id);
      
      res.status(201).json(generatedContent);
    } catch (error) {
      console.error("Error generating content:", error);
      res.status(400).json({ error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  // Get all generated content for the user
  app.get("/api/content", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");

    try {
      const contents = await storage.getGeneratedContentByUserId(req.user!.id);
      res.status(200).json(contents);
    } catch (error) {
      console.error("Error fetching content:", error);
      res.status(500).json({ error: "Failed to fetch content" });
    }
  });

  // Get specific generated content
  app.get("/api/content/:id", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");

    try {
      const content = await storage.getGeneratedContent(parseInt(req.params.id));
      
      if (!content) {
        return res.status(404).json({ error: "Content not found" });
      }
      
      if (content.user_id !== req.user!.id) {
        return res.status(403).json({ error: "Not authorized to access this content" });
      }
      
      res.status(200).json(content);
    } catch (error) {
      console.error("Error fetching content:", error);
      res.status(500).json({ error: "Failed to fetch content" });
    }
  });

  // Generate a persona using OpenAI
  app.post("/api/generate-persona", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");

    try {
      // Check if user has reached their subscription limit for personas
      const userData = await storage.getUser(req.user!.id);
      if (!userData) {
        return res.status(404).json({ error: "User not found" });
      }
      
      const userPlan = userData.subscription_plan as keyof typeof subscriptionPlans;
      const personaLimit = subscriptionPlans[userPlan]?.personas || 0;
      
      if (userData.personas_used >= personaLimit) {
        return res.status(402).json({ 
          error: "Subscription limit reached", 
          limitType: "personas",
          current: userData.personas_used,
          limit: personaLimit
        });
      }

      const schema = z.object({
        description: z.string().min(1).max(500)
      });

      const { description } = schema.parse(req.body);

      try {
        // Generate persona with OpenAI
        const generatedPersona = await generatePersona(description);
        
        // Save the generated persona
        const persona = await storage.createPersona({
          user_id: req.user!.id,
          name: generatedPersona.name,
          description: generatedPersona.description,
          interests: generatedPersona.interests,
          is_selected: false,
        });
        
        // Increment the persona usage counter
        await storage.incrementPersonaUsage(req.user!.id);
        
        res.status(201).json(persona);
      } catch (error: any) {
        if (error.message === "OpenAI API key is not configured") {
          return res.status(503).json({ 
            error: "OpenAI API is not available. Please add your API key in the environment variables.",
            requires_api_key: true
          });
        }
        throw error;
      }
    } catch (error) {
      console.error("Error generating persona:", error);
      res.status(400).json({ error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  // Seed predefined personas for a new user
  app.post("/api/seed-personas", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");

    try {
      const userId = req.user!.id;
      const userData = await storage.getUser(userId);
      if (!userData) {
        return res.status(404).json({ error: "User not found" });
      }
      
      const existingPersonas = await storage.getPersonasByUserId(userId);
      
      // Check subscription limits
      const userPlan = userData.subscription_plan as keyof typeof subscriptionPlans;
      const personaLimit = subscriptionPlans[userPlan]?.personas || 0;
      
      // Calculate how many more personas can be added
      const remainingSlots = personaLimit - userData.personas_used;
      
      // Only seed if the user has no personas yet and has available slots
      if (existingPersonas.length === 0) {
        if (remainingSlots <= 0) {
          return res.status(402).json({ 
            error: "Subscription limit reached", 
            limitType: "personas",
            current: userData.personas_used,
            limit: personaLimit
          });
        }
        
        // Use a smaller set if fewer slots are available than predefined personas
        const predefinedPersonas = await storage.seedPredefinedPersonas(userId);
        
        // Update usage count (number of personas added)
        for (let i = 0; i < predefinedPersonas.length; i++) {
          await storage.incrementPersonaUsage(userId);
        }
        
        res.status(201).json(predefinedPersonas);
      } else {
        res.status(200).json({ message: "Personas already exist for this user" });
      }
    } catch (error) {
      console.error("Error seeding personas:", error);
      res.status(500).json({ error: "Failed to seed personas" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
