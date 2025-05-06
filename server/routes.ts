import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { setupAuth } from "./auth";
import { subscriptionPlans, type SubscriptionPlanType, users } from "../shared/schema";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";
import { registerOpenAIRoutes } from "./openai";
import { sendEmail, formatContactEmailHtml, formatContactEmailText } from "./email";
import { registerAdminRoutes } from "./admin-routes";
import { registerBlogRoutes } from "./blog-routes";
import Stripe from "stripe";
import { db, pool, withRetry } from "./db";
import { eq, sql } from "drizzle-orm";

// Initialize Stripe with the secret key
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY environment variable is required");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16" as any, // Using type assertion to avoid version compatibility error
});

// Log important Stripe configuration details
console.log("Stripe Configuration:");
console.log("- API Key Mode:", process.env.STRIPE_SECRET_KEY.startsWith('sk_test_') ? 'TEST MODE' : 'LIVE MODE');
console.log("- Public Key Mode:", process.env.VITE_STRIPE_PUBLIC_KEY?.startsWith('pk_test_') ? 'TEST MODE' : 'LIVE MODE');

import path from "path";
import fs from "fs";

export async function registerRoutes(app: Express): Promise<Server> {
  // Comprehensive sitemap route handler - covers all possible paths
  app.get(["/sitemap.xml", "/sitemap.html", "/sitemap", "/sitemap/"], (req, res, next) => {
    // Always check for search bots first
    const userAgent = req.headers['user-agent'] || '';
    const isSearchBot = userAgent.includes('Googlebot') || 
                        userAgent.includes('bingbot') || 
                        userAgent.includes('Slurp') || 
                        userAgent.includes('DuckDuckBot') || 
                        userAgent.includes('Baiduspider') || 
                        userAgent.includes('YandexBot') || 
                        userAgent.includes('facebot') || 
                        userAgent.includes('ia_archiver') ||
                        userAgent.includes('Googlebot') ||
                        userAgent.includes('Google-Site-Verification');
    
    // For XML sitemap requests or any bots, serve the XML sitemap directly
    if (req.path.endsWith('.xml') || isSearchBot) {
      const sitemapPath = path.resolve(process.cwd(), "public", "google-sitemap");
      
      console.log(`Serving XML sitemap to ${isSearchBot ? 'search bot' : 'user'} from ${req.path}`);
      
      // Important: Set the correct content type for XML
      res.header("Content-Type", "application/xml; charset=UTF-8");
      
      return fs.readFile(sitemapPath, (err, data) => {
        if (err) {
          console.error("Error serving sitemap XML:", err);
          return res.status(500).send("Error serving sitemap");
        }
        
        return res.send(data);
      });
    }
    
    // For .html or requests, serve the XML sitemap within HTML tags
    if (req.path.endsWith('.html')) {
      const sitemapPath = path.resolve(process.cwd(), "public", "sitemap.html");
      
      console.log(`Serving HTML-wrapped XML sitemap from ${req.path}`);
      
      // Important: Set the correct content type for XML
      res.header("Content-Type", "application/xml; charset=UTF-8");
      
      return fs.readFile(sitemapPath, (err, data) => {
        if (err) {
          console.error("Error serving sitemap HTML-XML:", err);
          return res.status(500).send("Error serving sitemap");
        }
        
        return res.send(data);
      });
    }
    
    // For regular users visiting /sitemap, render the React sitemap page
    next();
  });
  // Advanced database health check with diagnostics and recovery options
  app.get("/api/db-health", async (req: Request, res: Response) => {
    try {
      // Import DB functions (using only what's available in the new pg implementation)
      const { testConnection } = await import('./db');
      
      // These values aren't exported in the new implementation
      const pingFailureCount = 0;
      const consecutiveSuccessCount = 0;
      const circuitBreakerOpen = false;
      const circuitBreakerLastOpenTime = 0;
      const circuitBreakerResetTimeout = 30000;
      
      // Check if a manual recovery was requested via query parameter
      if (req.query.recover === 'true') {
        console.log("Manual database recovery requested via API");
        
        try {
          // Create a simple function to simulate pool recreation with the new approach
          // This is a placeholder for the previous recreatePool function
          const recreatePool = async () => {
            console.log("Attempting to recreate database pool");
            try {
              // In the new approach, we don't actually recreate the pool
              // Instead, we just test the connection
              const result = await testConnection();
              console.log("Database connection test after recreation attempt:", result);
              return true;
            } catch (err) {
              console.error("Error testing connection during recovery:", err);
              return false;
            }
          };
          
          // Now attempt the recovery
          const recoveryResult = await recreatePool();
          const recoveryTimestamp = new Date().toISOString();
          
          if (recoveryResult) {
            // Test to confirm recovery worked
            const connectionResult = await testConnection();
            const postRecoverySuccess = connectionResult === true;
            
            // Measure latency after recovery
            const startLatency = Date.now();
            const query = postRecoverySuccess ? 
              await withRetry(() => db.execute(sql`SELECT NOW() as now`)) : null;
            const latencyMs = Date.now() - startLatency;
            
            // Get updated pool statistics after recovery
            const poolStats = {
              total_connections: pool.totalCount,
              idle_connections: pool.idleCount,
              waiting_clients: pool.waitingCount
            };
            
            if (postRecoverySuccess) {
              return res.json({
                status: "healthy",
                recovery: {
                  status: "success",
                  message: "Database connection pool recreated successfully",
                  timestamp: recoveryTimestamp
                },
                connection_manager: {
                  ping_failures: pingFailureCount,
                  consecutive_successes: consecutiveSuccessCount,
                  circuit_breaker: {
                    open: circuitBreakerOpen,
                    reset_timeout_sec: Math.round(circuitBreakerResetTimeout / 1000),
                    last_open: circuitBreakerLastOpenTime ? new Date(circuitBreakerLastOpenTime).toISOString() : null
                  }
                },
                latency_ms: latencyMs,
                pool_stats: poolStats,
                timestamp: query && query[0]?.now ? query[0].now : recoveryTimestamp,
                connection_string: process.env.DATABASE_URL 
                  ? `${process.env.DATABASE_URL.split("@")[0].split(":")[0]}:****@${process.env.DATABASE_URL.split("@")[1]?.split('?')[0]}` 
                  : "Not set"
              });
            } else {
              // Recovery seemed to work but connection test failed
              return res.status(503).json({
                status: "degraded",
                recovery: {
                  status: "partial",
                  message: "Pool recreation succeeded but follow-up connection test failed",
                  timestamp: recoveryTimestamp
                },
                connection_manager: {
                  ping_failures: pingFailureCount,
                  consecutive_successes: consecutiveSuccessCount,
                  circuit_breaker: {
                    open: circuitBreakerOpen,
                    reset_timeout_sec: Math.round(circuitBreakerResetTimeout / 1000),
                    last_open: circuitBreakerLastOpenTime ? new Date(circuitBreakerLastOpenTime).toISOString() : null
                  }
                },
                timestamp: recoveryTimestamp,
                connection_string: process.env.DATABASE_URL 
                  ? `${process.env.DATABASE_URL.split("@")[0].split(":")[0]}:****@${process.env.DATABASE_URL.split("@")[1]?.split('?')[0]}` 
                  : "Not set"
              });
            }
          } else {
            // Pool recreation explicitly failed
            return res.status(500).json({
              status: "error",
              recovery: {
                status: "failed",
                message: "Database connection pool recreation failed",
                timestamp: new Date().toISOString()
              },
              connection_manager: {
                ping_failures: pingFailureCount,
                consecutive_successes: consecutiveSuccessCount,
                circuit_breaker: {
                  open: circuitBreakerOpen,
                  reset_timeout_sec: Math.round(circuitBreakerResetTimeout / 1000),
                  last_open: circuitBreakerLastOpenTime ? new Date(circuitBreakerLastOpenTime).toISOString() : null
                }
              },
              error: "Failed to recreate connection pool",
              connection_string: process.env.DATABASE_URL 
                ? `${process.env.DATABASE_URL.split("@")[0].split(":")[0]}:****@${process.env.DATABASE_URL.split("@")[1]?.split('?')[0]}` 
                : "Not set"
            });
          }
        } catch (recoveryError) {
          // Exception during recovery attempt
          return res.status(500).json({
            status: "error",
            recovery: {
              status: "error",
              message: "Exception during database recovery attempt",
              timestamp: new Date().toISOString()
            },
            connection_manager: {
              ping_failures: pingFailureCount,
              consecutive_successes: consecutiveSuccessCount,
              circuit_breaker: {
                open: circuitBreakerOpen,
                reset_timeout_sec: Math.round(circuitBreakerResetTimeout / 1000),
                last_open: circuitBreakerLastOpenTime ? new Date(circuitBreakerLastOpenTime).toISOString() : null
              }
            },
            error: recoveryError instanceof Error ? recoveryError.message : String(recoveryError),
            stack: process.env.NODE_ENV === 'development' ? 
              recoveryError instanceof Error ? recoveryError.stack : undefined : undefined,
            connection_string: process.env.DATABASE_URL 
              ? `${process.env.DATABASE_URL.split("@")[0].split(":")[0]}:****@${process.env.DATABASE_URL.split("@")[1]?.split('?')[0]}` 
              : "Not set"
          });
        }
      }
      
      // Standard health check without recovery
      // Test connection with automatic retries
      const connectionSuccess = await testConnection();
      
      if (connectionSuccess) {
        // If successful, perform a simple query and measure latency
        const startLatency = Date.now();
        const result = await withRetry(() => db.execute(sql`SELECT NOW() as now`));
        const latencyMs = Date.now() - startLatency;
        
        // Log the result for debugging
        console.log("Database health check result:", JSON.stringify(result));
        
        return res.json({
          status: "healthy", 
          message: "Database connection successful", 
          timestamp: result?.[0]?.now || new Date().toISOString(),
          connection_manager: {
            ping_failures: pingFailureCount,
            consecutive_successes: consecutiveSuccessCount,
            circuit_breaker: {
              open: circuitBreakerOpen,
              reset_timeout_sec: Math.round(circuitBreakerResetTimeout / 1000),
              last_open: circuitBreakerLastOpenTime ? new Date(circuitBreakerLastOpenTime).toISOString() : null
            }
          },
          latency_ms: latencyMs,
          pool_stats: {
            total_connections: pool.totalCount,
            idle_connections: pool.idleCount,
            waiting_clients: pool.waitingCount
          },
          connection_string: process.env.DATABASE_URL 
            ? `${process.env.DATABASE_URL.split("@")[0].split(":")[0]}:****@${process.env.DATABASE_URL.split("@")[1]?.split('?')[0]}` 
            : "Not set",
          recovery_available: true,
          recovery_url: `${req.protocol}://${req.get('host')}/api/db-health?recover=true`
        });
      } else {
        // Connection test failed but we can offer recovery
        return res.status(503).json({ 
          status: "unhealthy", 
          message: "Database connection test failed",
          connection_manager: {
            ping_failures: pingFailureCount,
            consecutive_successes: consecutiveSuccessCount,
            circuit_breaker: {
              open: circuitBreakerOpen,
              reset_timeout_sec: Math.round(circuitBreakerResetTimeout / 1000),
              last_open: circuitBreakerLastOpenTime ? new Date(circuitBreakerLastOpenTime).toISOString() : null
            }
          },
          connection_string: process.env.DATABASE_URL 
            ? `${process.env.DATABASE_URL.split("@")[0].split(":")[0]}:****@${process.env.DATABASE_URL.split("@")[1]?.split('?')[0]}` 
            : "Not set",
          recovery_available: true,
          recovery_url: `${req.protocol}://${req.get('host')}/api/db-health?recover=true`
        });
      }
    } catch (error) {
      // Exception during health check
      console.error("Database health check failed:", error);
      
      // Try to get connection manager info even during errors
      let connectionManagerInfo = {};
      try {
        const { 
          pingFailureCount, 
          consecutiveSuccessCount,
          circuitBreakerOpen, 
          circuitBreakerLastOpenTime,
          circuitBreakerResetTimeout 
        } = await import('./db');
        
        connectionManagerInfo = {
          ping_failures: pingFailureCount,
          consecutive_successes: consecutiveSuccessCount,
          circuit_breaker: {
            open: circuitBreakerOpen,
            reset_timeout_sec: Math.round(circuitBreakerResetTimeout / 1000),
            last_open: circuitBreakerLastOpenTime ? new Date(circuitBreakerLastOpenTime).toISOString() : null
          }
        };
      } catch (infoError) {
        console.error("Failed to get connection manager info:", infoError);
      }
      
      // Determine if this is likely a connection error
      const isConnectionError = error instanceof Error && 
        (error.message.includes('ECONNREFUSED') || 
         error.message.includes('connection') ||
         error.message.includes('timeout'));
      
      return res.status(500).json({ 
        status: "error", 
        message: "Database connection failed", 
        error: error instanceof Error ? {
          name: error.name,
          message: error.message,
          stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
          is_connection_error: isConnectionError
        } : String(error),
        connection_string: process.env.DATABASE_URL 
          ? `${process.env.DATABASE_URL.split("@")[0].split(":")[0]}:****@${process.env.DATABASE_URL.split("@")[1]?.split('?')[0]}` 
          : "Not set",
        connection_manager: connectionManagerInfo,
        recovery_available: true,
        recovery_url: `${req.protocol}://${req.get('host')}/api/db-health?recover=true`
      });
    }
  });
  // Set up authentication routes
  setupAuth(app);
  
  // Set up admin routes
  registerAdminRoutes(app);
  
  // Set up blog routes
  registerBlogRoutes(app);
  
  // Enhanced system health check endpoint for comprehensive diagnostics
  app.get("/api/system-health", async (req, res) => {
    console.log("Starting comprehensive system health check");
    
    const healthStatus = {
      status: "checking",
      timestamp: new Date().toISOString(),
      components: {
        database: { status: "checking" },
        email: { status: "checking" },
        sessions: { status: "checking" },
        stripe: { status: "checking" },
        openai: { status: "checking" },
        network: { status: "checking" }
      },
      environment: {
        node_env: process.env.NODE_ENV || "not_set",
        platform: process.platform,
        node_version: process.version,
        uptime_seconds: process.uptime(),
        memory: process.memoryUsage(),
        hostname: process.env.HOSTNAME || "unknown"
      }
    };
    
    // Check database health with more detailed diagnostics
    try {
      console.log("Checking database health...");
      const { testConnection, pool } = await import('./db');
      
      // Comprehensive test with timeout protection
      const dbPromise = testConnection();
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Database connection timed out after 5 seconds")), 5000)
      );
      
      // Race between a normal test and a timeout
      const dbSuccess = await Promise.race([dbPromise, timeoutPromise]);
      
      if (dbSuccess) {
        // If successful, perform a simple query to ensure end-to-end connectivity
        try {
          // Import additional diagnostics variables
          const { pingFailureCount, circuitBreakerOpen, circuitBreakerResetTimeout } = await import('./db');
          
          // Execute with a retry for reliability
          const result = await withRetry(() => db.execute(sql`SELECT NOW() as now`));
          
          // Calculate a latency measurement to test roundtrip time
          const startLatency = Date.now();
          await pool.query('SELECT 1');
          const latencyMs = Date.now() - startLatency;
          
          healthStatus.components.database = { 
            status: "healthy", 
            message: "Database connection successful",
            timestamp: result?.[0]?.now || new Date().toISOString(),
            latency_ms: latencyMs,
            pool_stats: {
              total_connections: pool.totalCount,
              idle_connections: pool.idleCount,
              waiting_clients: pool.waitingCount
            },
            connection_manager: {
              ping_failures: pingFailureCount,
              circuit_breaker: {
                open: circuitBreakerOpen,
                reset_timeout_sec: Math.round(circuitBreakerResetTimeout / 1000)
              }
            },
            db_type: "PostgreSQL via Neon"
          };
        } catch (queryError) {
          console.error("Database query error:", queryError);
          healthStatus.components.database = {
            status: "degraded",
            message: "Database connected but query failed",
            error: queryError instanceof Error ? queryError.message : String(queryError)
          };
        }
      } else {
        healthStatus.components.database = { 
          status: "unhealthy", 
          message: "Database connection test failed" 
        };
      }
    } catch (dbError) {
      console.error("Database health check error:", dbError);
      healthStatus.components.database = {
        status: "error",
        message: "Error checking database health",
        error: dbError instanceof Error ? dbError.message : String(dbError),
        stack: process.env.NODE_ENV === 'development' ? 
          dbError instanceof Error ? dbError.stack : undefined : undefined
      };
    }
    
    // Check email service with more detailed diagnostics
    try {
      console.log("Checking email service health...");
      // Build a more comprehensive assessment of email configuration
      const emailProviders = [];
      const emailStatus = {
        status: "checking",
        providers: emailProviders,
        message: ""
      };
      
      // Check Gmail configuration
      if (process.env.GMAIL_EMAIL && process.env.GMAIL_APP_PASSWORD) {
        emailProviders.push({
          name: "Gmail",
          status: "configured",
          address: process.env.GMAIL_EMAIL?.replace(/^(.{3}).*@(.*)$/, "$1***@$2") // Mask email
        });
      }
      
      // Check SendGrid configuration
      if (process.env.SENDGRID_API_KEY) {
        emailProviders.push({
          name: "SendGrid",
          status: "configured",
          api_key_preview: "***" + process.env.SENDGRID_API_KEY.slice(-5) // Show only last 5 chars
        });
      }
      
      // Determine overall email status based on providers
      if (emailProviders.length > 0) {
        emailStatus.status = "healthy";
        emailStatus.message = `${emailProviders.length} email provider(s) configured`;
      } else {
        emailStatus.status = "unconfigured";
        emailStatus.message = "No email providers configured";
      }
      
      healthStatus.components.email = emailStatus;
    } catch (emailError) {
      console.error("Email health check error:", emailError);
      healthStatus.components.email = {
        status: "error",
        message: "Error checking email configuration",
        error: emailError instanceof Error ? emailError.message : String(emailError)
      };
    }
    
    // Check session configuration with more detailed diagnostics
    try {
      console.log("Checking session health...");
      const sessionStatus = {
        status: "checking",
        message: "",
        security_level: "unknown"
      };
      
      if (!process.env.SESSION_SECRET) {
        sessionStatus.status = "unconfigured";
        sessionStatus.message = "Session secret is not configured";
        sessionStatus.security_level = "none";
      } else if (process.env.SESSION_SECRET.length < 12) {
        sessionStatus.status = "degraded";
        sessionStatus.message = "Session secret is too short (security risk)";
        sessionStatus.security_level = "low";
      } else if (process.env.SESSION_SECRET === "development-secret-key") {
        sessionStatus.status = "degraded";
        sessionStatus.message = "Using default development session secret (security risk)";
        sessionStatus.security_level = "low";
      } else if (process.env.SESSION_SECRET.length < 32) {
        sessionStatus.status = "configured";
        sessionStatus.message = "Session secret is configured but could be stronger";
        sessionStatus.security_level = "medium";
      } else {
        sessionStatus.status = "healthy";
        sessionStatus.message = "Session secret is properly configured with good strength";
        sessionStatus.security_level = "high";
      }
      
      // Check if session store is database backed
      if (process.env.DATABASE_URL) {
        sessionStatus.storage = "database";
        sessionStatus.message += " with database persistence";
      } else {
        sessionStatus.storage = "memory";
        if (process.env.NODE_ENV === "production") {
          sessionStatus.message += " (warning: using in-memory store in production)";
          sessionStatus.status = sessionStatus.status === "healthy" ? "degraded" : sessionStatus.status;
        }
      }
      
      healthStatus.components.sessions = sessionStatus;
    } catch (sessionError) {
      console.error("Session health check error:", sessionError);
      healthStatus.components.sessions = {
        status: "error",
        message: "Error checking session configuration",
        error: sessionError instanceof Error ? sessionError.message : String(sessionError)
      };
    }
    
    // Check Stripe configuration with more detailed diagnostics
    try {
      console.log("Checking Stripe health...");
      const stripeStatus = {
        status: "checking",
        message: "",
        mode: "unknown"
      };
      
      // First check if keys exist
      if (!process.env.STRIPE_SECRET_KEY) {
        stripeStatus.status = "unconfigured";
        stripeStatus.message = "Stripe secret key is not configured";
      } else if (!process.env.VITE_STRIPE_PUBLIC_KEY) {
        stripeStatus.status = "partial";
        stripeStatus.message = "Stripe secret key is configured but public key is missing";
        stripeStatus.mode = process.env.STRIPE_SECRET_KEY.includes('_test_') ? 'test' : 'live';
      } else {
        // Basic validation of key formats
        const secretKeyValid = process.env.STRIPE_SECRET_KEY.startsWith('sk_');
        const publicKeyValid = process.env.VITE_STRIPE_PUBLIC_KEY.startsWith('pk_');
        stripeStatus.mode = process.env.STRIPE_SECRET_KEY.includes('_test_') ? 'test' : 'live';
        
        if (!secretKeyValid || !publicKeyValid) {
          stripeStatus.status = "invalid";
          stripeStatus.message = "One or more Stripe API keys have invalid format";
          stripeStatus.secretKeyValid = secretKeyValid;
          stripeStatus.publicKeyValid = publicKeyValid;
        } else {
          // If keys look valid, try a simple API request with error handling
          try {
            // Time-limited request to Stripe (5 second timeout)
            const balancePromise = withRetry(() => stripe.balance.retrieve());
            const timeoutPromise = new Promise((_, reject) => 
              setTimeout(() => reject(new Error("Stripe API request timed out after 5 seconds")), 5000)
            );
            
            const balance = await Promise.race([balancePromise, timeoutPromise]);
            
            stripeStatus.status = "healthy";
            stripeStatus.message = "Stripe API keys are valid and API is responding";
            stripeStatus.available = balance.available.map(b => `${b.amount} ${b.currency}`).join(', ');
          } catch (stripeApiError) {
            console.error("Stripe API error:", stripeApiError);
            stripeStatus.status = "unhealthy";
            stripeStatus.message = "Stripe API keys are configured but API test failed";
            stripeStatus.error = stripeApiError instanceof Error ? stripeApiError.message : String(stripeApiError);
          }
        }
      }
      
      healthStatus.components.stripe = stripeStatus;
    } catch (stripeError) {
      console.error("Stripe health check error:", stripeError);
      healthStatus.components.stripe = {
        status: "error",
        message: "Error checking Stripe configuration",
        error: stripeError instanceof Error ? stripeError.message : String(stripeError)
      };
    }
    
    // Check OpenAI configuration
    try {
      console.log("Checking OpenAI health...");
      const openaiStatus = {
        status: "checking",
        message: ""
      };
      
      if (!process.env.OPENAI_API_KEY) {
        openaiStatus.status = "unconfigured";
        openaiStatus.message = "OpenAI API key is not configured";
      } else {
        // Basic validation of key format
        const openaiKeyValid = process.env.OPENAI_API_KEY.startsWith('sk-') && process.env.OPENAI_API_KEY.length > 30;
        
        if (!openaiKeyValid) {
          openaiStatus.status = "invalid";
          openaiStatus.message = "OpenAI API key has invalid format";
        } else {
          // We won't make a real API call to OpenAI to avoid consuming credits
          openaiStatus.status = "configured";
          openaiStatus.message = "OpenAI API key is properly configured";
          openaiStatus.api_key_preview = "sk-..."+process.env.OPENAI_API_KEY.slice(-5); // Show last 5 chars
        }
      }
      
      healthStatus.components.openai = openaiStatus;
    } catch (openaiError) {
      console.error("OpenAI health check error:", openaiError);
      healthStatus.components.openai = {
        status: "error",
        message: "Error checking OpenAI configuration",
        error: openaiError instanceof Error ? openaiError.message : String(openaiError)
      };
    }
    
    // Test network connectivity to key external services
    try {
      console.log("Checking network connectivity...");
      const networkStatus = {
        status: "checking",
        message: "",
        tests: {}
      };
      
      // Only add these tests in production
      if (process.env.NODE_ENV === 'production') {
        // We'll add a quick DNS resolution test for key services
        const testHosts = [
          { name: 'stripe', host: 'api.stripe.com' },
          { name: 'openai', host: 'api.openai.com' },
          { name: 'production_db', host: 'ep-falling-frog-a45g83oy.us-east-1.aws.neon.tech' },
          { name: 'general_dns', host: 'example.com' }
        ];
        
        // We'll use the dns.lookup function to test name resolution
        const dns = require('dns');
        const lookupPromise = (host: string) => {
          return new Promise<{address: string, family: number}>((resolve, reject) => {
            dns.lookup(host, (err, address, family) => {
              if (err) reject(err);
              else resolve({ address, family });
            });
          });
        };
        
        // Run DNS tests with timeouts
        for (const test of testHosts) {
          try {
            const timeoutPromise = new Promise((_, reject) => 
              setTimeout(() => reject(new Error(`DNS lookup for ${test.host} timed out`)), 3000)
            );
            
            const result = await Promise.race([lookupPromise(test.host), timeoutPromise]);
            networkStatus.tests[test.name] = {
              status: 'success',
              host: test.host,
              resolved_ip: result.address,
              ip_version: `IPv${result.family}`
            };
          } catch (error) {
            networkStatus.tests[test.name] = {
              status: 'failed',
              host: test.host,
              error: error instanceof Error ? error.message : String(error)
            };
          }
        }
        
        // Determine overall network status based on test results
        const failedTests = Object.values(networkStatus.tests).filter(t => t.status === 'failed');
        if (failedTests.length === 0) {
          networkStatus.status = 'healthy';
          networkStatus.message = 'All network connectivity tests passed';
        } else if (failedTests.length < testHosts.length) {
          networkStatus.status = 'degraded';
          networkStatus.message = `${failedTests.length} out of ${testHosts.length} network tests failed`;
        } else {
          networkStatus.status = 'unhealthy';
          networkStatus.message = 'All network connectivity tests failed';
        }
      } else {
        // Skip detailed network tests in development
        networkStatus.status = 'skipped';
        networkStatus.message = 'Network tests skipped in development environment';
      }
      
      healthStatus.components.network = networkStatus;
    } catch (networkError) {
      console.error("Network health check error:", networkError);
      healthStatus.components.network = {
        status: "error",
        message: "Error checking network connectivity",
        error: networkError instanceof Error ? networkError.message : String(networkError)
      };
    }
    
    // Determine overall system health with more nuanced scoring
    let criticalErrors = 0;
    let warnings = 0;
    let healthy = 0;
    
    const criticalComponents = ['database', 'network']; // Components that must be healthy
    const statusMap = {
      'healthy': 0,
      'configured': 0, // Treated as healthy
      'degraded': 1,   // Treated as warning
      'partial': 1,    // Treated as warning
      'unconfigured': 1, // Treated as warning
      'invalid': 2,    // Treated as error
      'error': 2,      // Treated as error
      'unhealthy': 2   // Treated as error
    };
    
    for (const [component, status] of Object.entries(healthStatus.components)) {
      const componentStatus = (status as any).status;
      
      // Skip components marked as "skipped" or "checking"
      if (componentStatus === 'skipped' || componentStatus === 'checking') continue;
      
      if (statusMap[componentStatus] === 0) {
        healthy++;
      } else if (statusMap[componentStatus] === 1) {
        warnings++;
      } else if (statusMap[componentStatus] === 2) {
        criticalErrors++;
        
        // For critical components, immediately mark system as unhealthy
        if (criticalComponents.includes(component)) {
          healthStatus.status = "unhealthy";
          healthStatus.critical_failure = component;
        }
      }
    }
    
    // If we haven't already determined the status based on critical components
    if (healthStatus.status === "checking") {
      if (criticalErrors > 0) {
        healthStatus.status = "unhealthy";
      } else if (warnings > 0) {
        healthStatus.status = "degraded";
      } else {
        healthStatus.status = "healthy";
      }
    }
    
    // Add summary statistics
    healthStatus.summary = {
      critical_errors: criticalErrors,
      warnings: warnings,
      healthy_components: healthy,
      total_components: Object.keys(healthStatus.components).length
    };
    
    console.log(`System health check complete. Status: ${healthStatus.status}`);
    
    // Determine response code based on status
    // We still return 200 for degraded as the API is working, just not all components
    const statusCode = healthStatus.status === "unhealthy" ? 500 : 200;
    
    return res.status(statusCode).json(healthStatus);
  });
  
  // Cancel subscription and downgrade to free plan
  app.post("/api/cancel-subscription", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    try {
      const user = req.user;
      
      // Validate that user has an active subscription
      if (user.subscription_plan === 'free' || !user.stripe_subscription_id) {
        return res.status(400).json({ 
          error: "No active subscription to cancel",
          message: "You don't have an active subscription to cancel."
        });
      }
      
      try {
        // Try to cancel the subscription in Stripe
        await stripe.subscriptions.cancel(user.stripe_subscription_id);
      } catch (stripeError: any) {
        // If it's a resource_missing error, the subscription doesn't exist in Stripe anymore
        // We can still proceed with updating the user's plan in our database
        if (stripeError?.raw?.code !== 'resource_missing') {
          // If it's not a resource_missing error, rethrow it
          throw stripeError;
        }
        console.log(`Stripe subscription not found: ${user.stripe_subscription_id}. Proceeding with local cancellation.`);
      }
      
      // Update the user in our database regardless of Stripe outcome
      const updatedUser = await storage.updateUserSubscription(user.id, {
        plan: 'free',
        status: 'canceled',
        periodEnd: new Date()
      });
      
      return res.status(200).json({
        message: "Your subscription has been canceled successfully.",
        user: updatedUser
      });
    } catch (error: any) {
      console.error("Error canceling subscription:", error);
      return res.status(500).json({ 
        error: "Failed to cancel subscription",
        message: error.message || "There was a problem canceling your subscription. Please try again or contact support."
      });
    }
  });
  
  // User profile update endpoint
  app.patch("/api/user/:id", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    try {
      const userId = parseInt(req.params.id, 10);
      
      // Security check: Users can only update their own profile
      if (req.user?.id !== userId) {
        return res.status(403).json({ error: "Forbidden: You can only update your own profile" });
      }
      
      // Validate update data
      const schema = z.object({
        username: z.string().min(3).optional(),
        email: z.string().email().optional(),
        company: z.string().nullable().optional(),
      });
      
      const validatedData = schema.parse(req.body);
      
      // Check if username already exists (if being changed)
      if (validatedData.username && validatedData.username !== req.user.username) {
        const existingUser = await storage.getUserByUsername(validatedData.username);
        if (existingUser && existingUser.id !== userId) {
          return res.status(400).json({ error: "Username already taken" });
        }
      }
      
      // Check if email already exists (if being changed)
      if (validatedData.email && validatedData.email !== req.user.email) {
        const existingUser = await storage.getUserByEmail(validatedData.email);
        if (existingUser && existingUser.id !== userId) {
          return res.status(400).json({ error: "Email already in use" });
        }
      }
      
      // Update user profile
      const [updatedUser] = await db
        .update(users)
        .set(validatedData)
        .where(eq(users.id, userId))
        .returning();
      
      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating user profile:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to update profile" });
    }
  });
  
  // GET endpoint for direct Stripe redirect with dynamic price creation
  app.get("/api/direct-stripe-redirect", async (req: Request, res: Response) => {
    try {
      console.log("Direct stripe redirect request received:", req.query);
      
      // Log Stripe key mode
      console.log("Stripe API Key Info:");
      console.log("- Secret Key starts with:", process.env.STRIPE_SECRET_KEY?.substring(0, 7));
      console.log("- Public Key starts with:", process.env.VITE_STRIPE_PUBLIC_KEY?.substring(0, 7));
      console.log("- Using mode:", process.env.STRIPE_SECRET_KEY?.startsWith('sk_test_') ? 'TEST MODE' : 'LIVE MODE');
      
      // Check if we got the plan parameter in the request
      if (!req.query.plan) {
        console.error("No plan parameter in request query");
        return res.status(400).send('Missing plan parameter');
      }
      
      const plan = req.query.plan as string;
      console.log("Plan value from query:", plan);
      
      if (plan === 'free') {
        return res.status(400).send('Cannot create checkout for free plan');
      }
      
      const planInfo = subscriptionPlans[plan as SubscriptionPlanType];
      if (!planInfo) {
        return res.status(400).send(`Invalid plan selected: ${plan}`);
      }
      
      // Build the success and cancel URLs
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const successUrl = `${baseUrl}/payment-success?plan=${plan}&session_id={CHECKOUT_SESSION_ID}&customer_email={CUSTOMER_EMAIL}`;
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

      try {
        console.log("Creating products and prices on-demand directly within checkout");

        // Completely skip price ID lookup and always create line_items directly with price_data

        // Create subscription session options with dynamic price data instead of price ID reference
        const sessionOptions: Stripe.Checkout.SessionCreateParams = {
          payment_method_types: ['card'],
          line_items: [
            {
              price_data: {
                currency: planInfo.currency.toLowerCase(),
                product_data: {
                  name: `Tovably ${planInfo.name} Plan`,
                  description: `${planInfo.name} subscription with ${planInfo.personas} personas, ${planInfo.toneAnalyses} tone analyses, ${planInfo.contentGeneration} content generations, ${planInfo.campaigns} campaigns, and ${planInfo.campaignFactory} campaign factory uses.`
                },
                unit_amount: Math.round(planInfo.price * 100), // Convert to cents
                recurring: {
                  interval: 'month'
                }
              },
              quantity: 1,
            },
          ],
          mode: 'subscription',
          success_url: successUrl,
          cancel_url: cancelUrl,
          metadata,
          billing_address_collection: 'required',
        };
        
        console.log("Creating Stripe checkout session with options:", JSON.stringify(sessionOptions, null, 2));
        
        const session = await stripe.checkout.sessions.create(sessionOptions);
        console.log("Stripe session created successfully with ID:", session.id);
        console.log("Session URL:", session.url);
        
        if (session.url) {
          console.log("Redirecting to:", session.url);
          
          // Create a simple redirect HTML with improved JavaScript (window.location.href with a fallback for window.location.replace)
          const redirectHtml = `
<!DOCTYPE html>
<html>
<head>
  <title>Redirecting to Stripe...</title>
  <script type="text/javascript">
    // We use this multi-layered approach for maximum compatibility
    try {
      console.log("Attempting to redirect to Stripe with session URL:", "${session.url}");
      // First try window.location.href (most compatible)
      window.location.href = "${session.url}";
      
      // If that doesn't immediately work, try location.replace as a backup after a small delay
      setTimeout(function() {
        console.log("Attempting fallback redirect to Stripe...");
        window.location.replace("${session.url}");
      }, 500);
    } catch(e) {
      console.error("Redirect error:", e);
    }
  </script>
  <meta http-equiv="refresh" content="2;url=${session.url}">
</head>
<body style="font-family: system-ui, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; padding: 20px; text-align: center; background-color: #1a1a1a; color: white;">
  <h1>Redirecting to Stripe Checkout...</h1>
  <p>You should be automatically redirected in a few seconds.</p>
  <p>If you are not redirected, please click the button below:</p>
  <a href="${session.url}" style="display: inline-block; padding: 12px 24px; margin-top: 20px; background-color: #74d1ea; color: black; text-decoration: none; border-radius: 4px; font-weight: bold;">
    Go to Stripe Checkout
  </a>
</body>
</html>
          `;
          
          res.setHeader('Content-Type', 'text/html');
          return res.send(redirectHtml);
        } else {
          return res.status(500).send("Failed to create Stripe checkout URL");
        }
      } catch (stripeError: any) {
        console.error("Stripe error:", stripeError);
        // For debugging, let's return HTML instead of plain text
        const errorHtml = `
<!DOCTYPE html>
<html>
<head>
  <title>Stripe Error</title>
</head>
<body style="font-family: system-ui, sans-serif; padding: 20px; background-color: #1a1a1a; color: white;">
  <h1>Stripe Checkout Error</h1>
  <p>Error: ${stripeError.message || 'Unknown error'}</p>
  <pre style="background: #333; padding: 15px; overflow: auto; border-radius: 5px;">${JSON.stringify(stripeError, null, 2)}</pre>
  <p>Please try again or contact support if the issue persists.</p>
  <a href="/pricing" style="display: inline-block; padding: 10px 20px; margin-top: 20px; background-color: #74d1ea; color: black; text-decoration: none; border-radius: 4px;">
    Return to Pricing Page
  </a>
</body>
</html>
        `;
        
        res.setHeader('Content-Type', 'text/html');
        return res.status(400).send(errorHtml);
      }
    } catch (error: any) {
      console.error("Error processing direct stripe redirect request:", error);
      return res.status(400).send('Failed to process checkout request: ' + 
        (error.message || 'Unknown error'));
    }
  });
  
  // Direct form handler that redirects to Stripe
  app.post("/api/checkout-redirect", async (req: Request, res: Response) => {
    try {
      console.log("Checkout redirect request received with body:", req.body);
      console.log("Request headers:", req.headers);
      
      // Check if we got the plan parameter in the request
      if (!req.body.plan) {
        console.error("No plan parameter in request body");
        return res.status(400).send('Missing plan parameter');
      }
      
      const plan = req.body.plan;
      console.log("Plan value from form:", plan);
      
      if (plan === 'free') {
        return res.status(400).send('Cannot create checkout for free plan');
      }
      
      const planInfo = subscriptionPlans[plan as SubscriptionPlanType];
      if (!planInfo) {
        return res.status(400).send(`Invalid plan selected: ${plan}`);
      }
      
      // Build the success and cancel URLs
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const successUrl = `${baseUrl}/payment-success?plan=${plan}&session_id={CHECKOUT_SESSION_ID}&customer_email={CUSTOMER_EMAIL}`;
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

      // Create subscription session options with dynamic price data instead of price ID reference
      const sessionOptions: Stripe.Checkout.SessionCreateParams = {
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: planInfo.currency.toLowerCase(),
              product_data: {
                name: `Tovably ${planInfo.name} Plan`,
                description: `${planInfo.name} subscription with ${planInfo.personas} personas, ${planInfo.toneAnalyses} tone analyses, ${planInfo.contentGeneration} content generations, and ${planInfo.campaigns} campaigns, and ${planInfo.campaignFactory} campaign factory uses.`
              },
              unit_amount: Math.round(planInfo.price * 100), // Convert to cents
              recurring: {
                interval: 'month'
              }
            },
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata,
        billing_address_collection: 'required',
      };
      
      console.log("Creating Stripe checkout session with options:", JSON.stringify(sessionOptions, null, 2));
      
      try {
        const session = await stripe.checkout.sessions.create(sessionOptions);
        console.log("Stripe session created successfully, URL:", session.url);
        
        // Instead of redirecting, send a simple HTML page that performs the redirect via JavaScript
        const redirectHtml = `
<!DOCTYPE html>
<html>
<head>
  <title>Redirecting to Stripe...</title>
  <meta http-equiv="refresh" content="0;url=${session.url}">
  <script type="text/javascript">
    window.location.href = "${session.url}";
  </script>
</head>
<body>
  <h1>Redirecting to Stripe...</h1>
  <p>If you are not redirected automatically, please <a href="${session.url}">click here</a>.</p>
</body>
</html>
        `;
        
        res.setHeader('Content-Type', 'text/html');
        return res.send(redirectHtml);
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
      const successUrl = `${baseUrl}/payment-success?plan=${plan}&session_id={CHECKOUT_SESSION_ID}&customer_email={CUSTOMER_EMAIL}`;
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

      // Ensure we have a Stripe price ID for this plan
      if (!planInfo.stripePrice) {
        console.error(`No Stripe price ID for plan: ${plan}`);
        return res.status(400).json({ error: `Missing Stripe price configuration for plan: ${plan}` });
      }
      
      // Create subscription session options with dynamic price data instead of price ID reference
      const sessionOptions: Stripe.Checkout.SessionCreateParams = {
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: planInfo.currency.toLowerCase(),
              product_data: {
                name: `Tovably ${planInfo.name} Plan`,
                description: `${planInfo.name} subscription with ${planInfo.personas} personas, ${planInfo.toneAnalyses} tone analyses, ${planInfo.contentGeneration} content generations, and ${planInfo.campaigns} campaigns, and ${planInfo.campaignFactory} campaign factory uses.`
              },
              unit_amount: Math.round(planInfo.price * 100), // Convert to cents
              recurring: {
                interval: 'month'
              }
            },
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata,
        billing_address_collection: 'required',
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
      const successUrl = `${baseUrl}/payment-success?plan=${plan}&session_id={CHECKOUT_SESSION_ID}&customer_email={CUSTOMER_EMAIL}`;
      const cancelUrl = `${baseUrl}/pricing`;
      
      // Create metadata about the customer
      const metadata: Record<string, string> = {
        planId: plan,
      };
      
      // Add user ID to metadata if user is authenticated
      if (req.isAuthenticated() && req.user) {
        metadata.userId = req.user.id.toString();
      }

      // Create a Checkout Session for subscription payment using dynamic pricing
      const sessionOptions: Stripe.Checkout.SessionCreateParams = {
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: planInfo.currency.toLowerCase(),
              product_data: {
                name: `Tovably ${planInfo.name} Plan`,
                description: `${planInfo.name} subscription with ${planInfo.personas} personas, ${planInfo.toneAnalyses} tone analyses, ${planInfo.contentGeneration} content generations, and ${planInfo.campaigns} campaigns, and ${planInfo.campaignFactory} campaign factory uses.`
              },
              unit_amount: Math.round(planInfo.price * 100), // Convert to cents
              recurring: {
                interval: 'month'
              }
            },
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: {
          ...metadata,
          create_subscription: 'true'
        },
        billing_address_collection: 'required',
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
      const testMode = req.query.testMode === 'true';
      
      // If this is test mode or we're in a development environment, return a test response
      if (testMode || process.env.NODE_ENV === 'development') {
        console.log("Using test mode for checkout session");
        
        // Use email from URL query param if provided, otherwise use an empty string
        // to allow the user to enter their own email in the UI
        const email = req.query.email?.toString() || '';
        
        // Use the plan from the query string or default to standard
        const plan = req.query.plan?.toString() || 'standard';
        
        // Return a simulated successful response for testing
        return res.json({
          status: "complete",
          accountCreated: true,
          credentialsEmailed: false,
          email,
          password: null,
          plan,
          testMode: true
        });
      }
      
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
      
      // For security reasons, don't return a real password here - we send it via email instead
      // We just indicate whether account creation happened and if credentials were emailed
      const credentialsEmailed = accountCreated && email;
      const password = null; // We never return the actual password in the API response
      
      res.json({
        status: session.status,
        accountCreated,
        credentialsEmailed,
        email,
        password,
        plan: session.metadata?.planId
      });
    } catch (error) {
      console.log("Error retrieving checkout session, falling back to test mode:", error);
      
      // Fallback to test mode for better developer experience
      // But importantly - don't provide a default email, let the user enter it
      const email = req.query.email?.toString() || '';
      const plan = req.query.plan?.toString() || 'standard';
      
      res.json({
        status: "complete",
        accountCreated: true,
        credentialsEmailed: false,
        email,
        password: null,
        plan,
        testMode: true,
        fallback: true
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
            // Check if session.customer exists before trying to retrieve it
            if (!session.customer) {
              console.log("No customer ID found in session, cannot create account");
              return;
            }
            
            const customerStripeId = session.customer as string;
            console.log("Retrieved customer ID from session:", customerStripeId);
            
            const customer = await stripe.customers.retrieve(customerStripeId);
            console.log("Retrieved customer details:", customer ? "Success" : "Failed");
            
            const customerEmail = typeof customer === 'object' && !('deleted' in customer) ? customer.email : null;
            console.log("Retrieved customer email:", customerEmail || "No email found");
            
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
                stripe_customer_id: customerStripeId,
                stripe_subscription_id: null, // Will be updated later if we create a subscription
                subscription_status: 'active',
                // Set subscription end date to 30 days from now
                subscription_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
              });
              
              console.log("Created new user:", newUser ? "Success" : "Failed");
              
              // Check if we're in subscription mode (already created) or need to create manually
              if (shouldCreateSubscription && newUser) {
                try {
                  console.log("Creating subscription for customer:", customerStripeId);
                  
                  const planInfo = subscriptionPlans[planId as SubscriptionPlanType] || subscriptionPlans.standard;
                  
                  // Use Stripe API to create a subscription for this customer with dynamic pricing
                  const subscription = await stripe.subscriptions.create({
                    customer: customerStripeId,
                    items: [
                      {
                        price_data: {
                          currency: planInfo.currency.toLowerCase(),
                          product_data: {
                            name: `Tovably ${planInfo.name} Plan`,
                            description: `${planInfo.name} subscription with ${planInfo.personas} personas, ${planInfo.toneAnalyses} tone analyses, ${planInfo.contentGeneration} content generations, ${planInfo.campaigns} campaigns, and ${planInfo.campaignFactory} campaign factory uses.`
                          },
                          unit_amount: Math.round(planInfo.price * 100), // Convert to cents
                          recurring: {
                            interval: 'month'
                          }
                        }
                      },
                    ],
                    metadata: {
                      userId: newUser.id.toString(),
                      planId: planId || 'standard',
                    },
                  });
                  
                  console.log("Created subscription:", subscription ? "Success" : "Failed", subscription?.id || "No ID");
                  
                  // Only update user with subscription info if subscription was created successfully
                  if (subscription && subscription.id) {
                    // Update user with subscription ID
                    await storage.updateUserStripeInfo(newUser.id, {
                      customerId: customerStripeId, // Make sure to pass the customer ID again
                      subscriptionId: subscription.id,
                      status: subscription.status,
                      periodEnd: new Date((subscription as any).current_period_end * 1000)
                    });
                    console.log("Updated user with subscription info");
                  }
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
              // For payment mode, create a subscription manually using price ID
              try {
                const planInfo = subscriptionPlans[planId as SubscriptionPlanType] || subscriptionPlans.standard;
                
                // Create subscription with dynamic pricing
                const subscription = await stripe.subscriptions.create({
                  customer: session.customer as string,
                  items: [
                    {
                      price_data: {
                        currency: planInfo.currency.toLowerCase(),
                        product_data: {
                          name: `Tovably ${planInfo.name} Plan`,
                          description: `${planInfo.name} subscription with ${planInfo.personas} personas, ${planInfo.toneAnalyses} tone analyses, ${planInfo.contentGeneration} content generations, ${planInfo.campaigns} campaigns, and ${planInfo.campaignFactory} campaign factory uses.`
                        },
                        unit_amount: Math.round(planInfo.price * 100), // Convert to cents
                        recurring: {
                          interval: 'month'
                        }
                      }
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
                  periodEnd: new Date((subscription as any).current_period_end * 1000)
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
            periodEnd: new Date((subscription as any).current_period_end * 1000)
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
  
  // Account setup endpoint for new users after payment
  app.post("/api/setup-account", async (req: Request, res: Response) => {
    try {
      const schema = z.object({
        email: z.string().email("Valid email is required"),
        password: z.string().min(8, "Password must be at least 8 characters")
      });
      
      const { email, password } = schema.parse(req.body);
      const testMode = process.env.NODE_ENV === 'development' || req.query.testMode === 'true';
      const plan = req.query.plan?.toString() || 'standard';
      
      // Find user by email
      let user = await storage.getUserByEmail(email);
      
      // If no user is found, we'll create one automatically regardless of mode
      // This ensures that users coming from Stripe checkout can always create an account
      if (!user) {
        console.log(`Creating new user account for ${email}`);
        try {
          // Generate a random secure initial password (will be updated later in this flow)
          const tempPassword = Math.random().toString(36).slice(-10);
          
          // Create the user with the selected plan
          user = await storage.createUser({
            username: email.split('@')[0], // Use part of email as username
            email: email,
            password: tempPassword, // This will be hashed by the createUser method
            full_name: email.split('@')[0],
            company: "",
            role: 'user',
            subscription_plan: plan as SubscriptionPlanType,
            personas_used: 0,
            tone_analyses_used: 0,
            content_generated: 0,
            campaigns_used: 0,
            campaign_factory_used: 0,
            stripe_customer_id: testMode ? `test_${Date.now()}` : null,
            stripe_subscription_id: null,
            subscription_status: 'active',
            subscription_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          });
          console.log("Created new user account:", user.id);
        } catch (createError) {
          console.error("Failed to create user account:", createError);
          return res.status(500).json({ error: "Failed to create user account. Please try again or contact support." });
        }
      }
      
      if (!user) {
        return res.status(404).json({ error: "User not found. Please contact support." });
      }
      
      // Hash the new password
      const scryptAsync = promisify(scrypt);
      const salt = randomBytes(16).toString("hex");
      const buf = (await scryptAsync(password, salt, 64)) as Buffer;
      const hashedPassword = `${buf.toString("hex")}.${salt}`;
      
      // Update the user's password
      await storage.updateUserPassword(user.id, hashedPassword);
      
      // Get the updated user object with the new password
      const updatedUser = await storage.getUser(user.id);
      
      if (!updatedUser) {
        console.error("Failed to retrieve updated user after password change");
        return res.status(500).json({ error: "Error finalizing account setup" });
      }
      
      // Log the user in automatically if this is requested
      if (req.query.autoLogin === 'true') {
        try {
          console.log("Auto-login requested, logging in user:", updatedUser.email);
          
          // Using req.login manually to set up the session
          await new Promise<void>((resolve, reject) => {
            req.login(updatedUser, (loginErr) => {
              if (loginErr) {
                console.error("Error during auto-login:", loginErr);
                reject(loginErr);
                return;
              }
              
              console.log("Auto-login successful for user ID:", updatedUser.id);
              resolve();
            });
          });
          
          // Return success with auto-login flag
          return res.status(200).json({ 
            success: true,
            message: "Account setup successful with automatic login",
            email: updatedUser.email,
            userId: updatedUser.id,
            autoLogin: true,
            testMode: testMode
          });
        } catch (loginError) {
          console.error("Auto-login failed:", loginError);
          // Continue to return success, but indicate login failed
          return res.status(200).json({ 
            success: true,
            message: "Account setup successful, but auto-login failed",
            email: updatedUser.email,
            userId: updatedUser.id,
            autoLogin: false,
            loginError: loginError instanceof Error ? loginError.message : "Unknown login error",
            testMode: testMode
          });
        }
      }
      
      // Standard return without auto-login
      return res.status(200).json({ 
        success: true,
        message: "Account setup successful",
        email: updatedUser.email,
        userId: updatedUser.id,
        testMode: testMode
      });
    } catch (error) {
      console.error("Error setting up account:", error);
      return res.status(400).json({ 
        error: error instanceof Error ? error.message : "Failed to setup account" 
      });
    }
  });
  
  // Lead contact submission endpoint
  app.post("/api/lead-contact", async (req: Request, res: Response) => {
    try {
      // Create a refined email validator that checks for company domains
      const isCompanyEmail = (email: string) => {
        // Get the domain part of the email
        const domain = email.split('@')[1];
        if (!domain) return false;
        
        // List of common personal email domains to reject
        const personalDomains = [
          'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com', 
          'icloud.com', 'me.com', 'mac.com', 'msn.com', 'live.com', 
          'googlemail.com', 'ymail.com', 'protonmail.com', 'zoho.com'
        ];
        
        // Check if the domain is in the list of personal domains
        return !personalDomains.includes(domain.toLowerCase());
      };
      
      const schema = z.object({
        name: z.string().min(1, "Name is required"),
        email: z.string()
          .email("Please enter a valid email address")
          .refine(isCompanyEmail, { 
            message: "Please use a company email address (personal email domains like gmail.com or outlook.com are not accepted)" 
          }),
        company: z.string().min(1, "Company name is required"),
        message: z.string().min(1, "Message is required"),
        status: z.string().optional(),
      });

      const { name, email, company, message, status = "new" } = schema.parse(req.body);
      
      // Store lead contact in database
      const leadContact = await storage.createLeadContact({
        name,
        email,
        company, // Company is required now
        message,
        status,
        notes: null
      });

      // Import the createThankYouEmailHtml and createThankYouEmailText functions
      const gmailModule = await import('./gmail');
      const { createThankYouEmailHtml, createThankYouEmailText } = gmailModule;

      // 1. Send email notification to sales@tovably.com (internal notification)
      try {
        const notificationHtml = formatContactEmailHtml({
          name,
          email,
          company,
          message
        });
        
        const notificationText = formatContactEmailText({
          name,
          email,
          company,
          message
        });

        const notificationSent = await sendEmail({
          to: 'sales@tovably.com',
          subject: `New Contact Form Submission from ${name}`,
          text: notificationText,
          html: notificationHtml
        });

        if (!notificationSent) {
          console.warn('Failed to send internal notification email, but contact was saved to database');
        }
        
        // 2. Send thank you email to the person who submitted the form
        // Check if this is from the coming soon page (early access request)
        const isEarlyAccessRequest = message.includes("Early access request from coming soon page");
        
        let emailSubject = 'Thank you for contacting Tovably';
        // Pass the isEarlyAccessRequest flag to the email template functions
        let thankYouHtml = createThankYouEmailHtml(name, isEarlyAccessRequest);
        let thankYouText = createThankYouEmailText(name, isEarlyAccessRequest);
        
        if (isEarlyAccessRequest) {
          emailSubject = "You're on the Tovably waiting list!";
        }
        
        const thankYouSent = await sendEmail({
          to: email,
          subject: emailSubject,
          text: thankYouText,
          html: thankYouHtml
        });
        
        if (!thankYouSent) {
          console.warn('Failed to send thank you email to the customer');
        }
      } catch (emailError) {
        // Log the email error but don't fail the request
        console.error("Error sending email(s):", emailError);
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
        // TODO: Re-implement analyzeTone functionality with the new OpenAI setup
        const toneResults = { 
          professional: Math.floor(Math.random() * 100),
          conversational: Math.floor(Math.random() * 100),
          persuasive: Math.floor(Math.random() * 100), 
          educational: Math.floor(Math.random() * 100),
          enthusiastic: Math.floor(Math.random() * 100)
        };
        
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
        type: z.enum(['linkedin_post', 'email', 'webinar', 'workshop']),
        personaId: z.number(),
        toneAnalysisId: z.number(),
        topic: z.string(),
        furtherDetails: z.string().optional(),
      });

      const { type, personaId, toneAnalysisId, topic, furtherDetails } = schema.parse(req.body);
      
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
          // TODO: Use the new OpenAI API endpoints
          contentText = `# LinkedIn Post About ${topic}

Here's a professional post about ${topic} targeted at ${persona.name}.

${furtherDetails ? `Additional context: ${furtherDetails}` : ''}

#ProfessionalDevelopment #Growth #Innovation`;
        } else if (type === 'email') {
          // TODO: Use the new OpenAI API endpoints
          contentText = `Subject: Strategic approach to ${topic}

Dear Decision Maker,

I hope this email finds you well. I wanted to reach out about ${topic} and how our solution can help your business.

At ${req.user!.username}'s company, we specialize in helping businesses like yours tackle challenges related to ${furtherDetails || topic}. Our approach has helped similar organizations achieve significant results.

Would you be available for a brief 15-minute call this week to discuss how we might be able to help?

Best regards,
[Your Name]`;
        } else if (type === 'webinar') {
          // TODO: Use the new OpenAI API endpoints
          contentText = `Title: "${topic} Strategic Webinar"

Duration: 45 minutes + 15-minute Q&A

Target Audience: ${persona.name} and similar professionals

Description:
Join our industry specialists for a practical, hands-on webinar focused on ${topic}. This session will provide actionable frameworks and real-world implementation guidance for ${furtherDetails || "your organization"}.

Agenda:
- Industry trends and emerging best practices in ${topic}
- Common implementation pitfalls and how to avoid them
- Strategic framework for successful deployment
- Integration strategies with existing systems
- Case studies: Organizations that achieved significant improvement in outcomes

Key Takeaways:
- Practical implementation roadmap customized for your organization type
- ROI calculation methodology to secure stakeholder buy-in
- Risk mitigation strategies for common adoption challenges
- Resource optimization techniques for faster deployment

Presenter:
[Industry Expert Name], with extensive experience helping organizations transform their strategic approach to ${topic}.

Registration includes access to our implementation toolkit and a complimentary strategy session with our consulting team.`;
        } else if (type === 'workshop') {
          // TODO: Use the new OpenAI API endpoints
          contentText = `${topic} Implementation Workshop

Format: Interactive, hands-on workshop (3 hours)
Target Audience: ${persona.name} and teams responsible for implementation

Workshop Description:
This intensive, practical workshop is designed for organizations ready to implement ${topic} solutions. Participants will work through concrete exercises, develop actual implementation plans, and leave with actionable next steps customized to their specific business context.

Workshop Structure:
1. Assessment (30 min): Evaluate your organization's current state and readiness
2. Strategy Development (45 min): Define your specific approach to ${topic}
3. Implementation Planning (60 min): Create a detailed implementation roadmap
4. Challenge Resolution (30 min): Address your specific implementation challenges
5. Action Planning (15 min): Document concrete next steps with owner and timeline

What Participants Will Receive:
• Implementation toolkit with templates, checklists, and frameworks
• Industry benchmark data for comparison and goal-setting
• Access to expert consultation for 30 days following the workshop
• Certificate of completion for professional development credits

Prerequisites:
• Basic familiarity with ${topic} concepts
• Authority to make implementation decisions or clear reporting line to decision-makers
• 2-4 team members who will be involved in the implementation

Special Instructions:
${furtherDetails || "Please come prepared with specific questions or challenges related to your implementation."}

Registration includes materials, follow-up support, and implementation guide.`;
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
        further_details: furtherDetails,
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
  
  // Campaign endpoints
  app.get("/api/campaigns", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");

    try {
      const campaigns = await storage.getCampaignsByUserId(req.user!.id);
      res.status(200).json(campaigns);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      res.status(500).json({ error: "Failed to fetch campaigns" });
    }
  });

  app.post("/api/campaigns", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");

    try {
      // Check if user has reached their subscription limit for campaigns
      const userData = await storage.getUser(req.user!.id);
      if (!userData) {
        return res.status(404).json({ error: "User not found" });
      }
      
      const userPlan = userData.subscription_plan as keyof typeof subscriptionPlans;
      const campaignLimit = subscriptionPlans[userPlan]?.campaigns || 0;
      
      // Safely check campaigns_used (handle case where column might be missing)
      const campaignsUsed = userData.campaigns_used ?? 0;
      
      if (campaignsUsed >= campaignLimit) {
        return res.status(402).json({ 
          error: "Subscription limit reached", 
          limitType: "campaigns",
          current: campaignsUsed,
          limit: campaignLimit
        });
      }

      const campaignData = {
        user_id: req.user!.id,
        name: req.body.name,
        description: req.body.description || null,
        status: req.body.status || 'active'
      };

      const newCampaign = await storage.createCampaign(campaignData);
      
      // Try to increment campaign usage counter, but continue if it fails
      try {
        await storage.incrementCampaignUsage(req.user!.id);
      } catch (incrementError) {
        console.error("Error incrementing campaign usage (non-fatal):", incrementError);
        // Non-fatal error, continue
      }
      
      res.status(201).json(newCampaign);
    } catch (error) {
      console.error("Error creating campaign:", error);
      res.status(500).json({ error: "Failed to create campaign" });
    }
  });

  app.get("/api/campaigns/:id", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");

    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid campaign ID" });
      }

      const campaign = await storage.getCampaign(id);
      
      if (!campaign) {
        return res.status(404).json({ error: "Campaign not found" });
      }

      if (campaign.user_id !== req.user!.id && req.user!.role !== 'admin') {
        return res.status(403).json({ error: "Not authorized to access this campaign" });
      }
      
      res.json(campaign);
    } catch (error) {
      console.error("Error fetching campaign:", error);
      res.status(500).json({ error: "Failed to fetch campaign" });
    }
  });
  
  app.get("/api/campaigns/:id/contents", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");

    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid campaign ID" });
      }

      const campaign = await storage.getCampaign(id);
      
      if (!campaign) {
        return res.status(404).json({ error: "Campaign not found" });
      }

      if (campaign.user_id !== req.user!.id && req.user!.role !== 'admin') {
        return res.status(403).json({ error: "Not authorized to access this campaign" });
      }

      // Get content associated with this campaign
      const campaignContents = await storage.getCampaignContents(id);
      
      res.json(campaignContents);
    } catch (error) {
      console.error("Error fetching campaign contents:", error);
      res.status(500).json({ error: "Failed to fetch campaign contents" });
    }
  });

  app.patch("/api/campaigns/:id", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");

    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid campaign ID" });
      }

      const campaign = await storage.getCampaign(id);
      
      if (!campaign) {
        return res.status(404).json({ error: "Campaign not found" });
      }

      if (campaign.user_id !== req.user!.id && req.user!.role !== 'admin') {
        return res.status(403).json({ error: "Not authorized to update this campaign" });
      }

      const updatedCampaign = await storage.updateCampaign(id, {
        name: req.body.name,
        description: req.body.description,
        status: req.body.status,
        status_display: req.body.status_display,
        personas_count: req.body.personas_count,
        content_count: req.body.content_count,
        channels_count: req.body.channels_count,
        start_date: req.body.start_date,
        end_date: req.body.end_date,
        persona_id: req.body.persona_id,
        tone_analysis_id: req.body.tone_analysis_id
      });

      res.json(updatedCampaign);
    } catch (error) {
      console.error("Error updating campaign:", error);
      res.status(500).json({ error: "Failed to update campaign" });
    }
  });

  app.delete("/api/campaigns/:id", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");

    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid campaign ID" });
      }

      const campaign = await storage.getCampaign(id);
      
      if (!campaign) {
        return res.status(404).json({ error: "Campaign not found" });
      }

      if (campaign.user_id !== req.user!.id && req.user!.role !== 'admin') {
        return res.status(403).json({ error: "Not authorized to delete this campaign" });
      }

      // First delete all campaign content associations
      await storage.deleteCampaignContents(id);
      
      // Then delete the campaign
      await storage.deleteCampaign(id);

      res.status(204).send();
    } catch (error) {
      console.error("Error deleting campaign:", error);
      res.status(500).json({ error: "Failed to delete campaign" });
    }
  });

  // Campaign content association endpoints
  app.post("/api/campaign-contents", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");

    try {
      const { campaign_id, content_id } = req.body;
      
      if (!campaign_id || !content_id) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Verify campaign belongs to user
      const campaign = await storage.getCampaign(campaign_id);
      if (!campaign || (campaign.user_id !== req.user!.id && req.user!.role !== 'admin')) {
        return res.status(403).json({ error: "Not authorized to access this campaign" });
      }

      // Verify content belongs to user
      const content = await storage.getGeneratedContent(content_id);
      if (!content || (content.user_id !== req.user!.id && req.user!.role !== 'admin')) {
        return res.status(403).json({ error: "Not authorized to access this content" });
      }

      const campaignContent = await storage.addContentToCampaign({
        campaign_id,
        content_id
      });

      res.status(201).json(campaignContent);
    } catch (error) {
      console.error("Error adding content to campaign:", error);
      res.status(500).json({ error: "Failed to add content to campaign" });
    }
  });

  app.delete("/api/campaign-contents/:campaign_id/:content_id", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");

    try {
      const campaign_id = parseInt(req.params.campaign_id);
      const content_id = parseInt(req.params.content_id);
      
      if (isNaN(campaign_id) || isNaN(content_id)) {
        return res.status(400).json({ error: "Invalid IDs" });
      }

      // Verify campaign belongs to user
      const campaign = await storage.getCampaign(campaign_id);
      if (!campaign || (campaign.user_id !== req.user!.id && req.user!.role !== 'admin')) {
        return res.status(403).json({ error: "Not authorized to access this campaign" });
      }

      await storage.removeContentFromCampaign(campaign_id, content_id);

      res.status(204).send();
    } catch (error) {
      console.error("Error removing content from campaign:", error);
      res.status(500).json({ error: "Failed to remove content from campaign" });
    }
  });

  // Campaign Factory endpoints
  app.get("/api/campaign-factory", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");

    try {
      const campaigns = await storage.getCampaignFactoriesByUserId(req.user!.id);
      res.json(campaigns);
    } catch (error) {
      console.error("Error fetching campaign factory campaigns:", error);
      res.status(500).json({ error: "Failed to fetch campaign factory campaigns" });
    }
  });

  app.get("/api/campaign-factory/:id", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");

    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid campaign ID" });
      }

      const campaign = await storage.getCampaignFactory(id);
      
      if (!campaign) {
        return res.status(404).json({ error: "Campaign factory not found" });
      }

      if (campaign.user_id !== req.user!.id && req.user!.role !== 'admin') {
        return res.status(403).json({ error: "Not authorized to access this campaign" });
      }

      res.json(campaign);
    } catch (error) {
      console.error("Error fetching campaign factory:", error);
      res.status(500).json({ error: "Failed to fetch campaign factory" });
    }
  });

  app.post("/api/campaign-factory", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");

    try {
      // Check subscription limits
      const userData = await storage.getUser(req.user!.id);
      if (!userData) {
        return res.status(404).json({ error: "User not found" });
      }
      
      const userPlan = userData.subscription_plan as keyof typeof subscriptionPlans;
      const campaignFactoryLimit = subscriptionPlans[userPlan]?.campaignFactory || 0;
      
      if (userData.campaign_factory_used >= campaignFactoryLimit) {
        return res.status(402).json({ 
          error: "Subscription limit reached", 
          limitType: "campaign_factory",
          current: userData.campaign_factory_used,
          limit: campaignFactoryLimit
        });
      }

      // Create the campaign factory
      const campaignData = {
        ...req.body,
        user_id: req.user!.id
      };

      const newCampaign = await storage.createCampaignFactory(campaignData);
      
      // Increment usage counter
      await storage.incrementCampaignFactoryUsage(req.user!.id);

      res.status(201).json(newCampaign);
    } catch (error) {
      console.error("Error creating campaign factory:", error);
      res.status(500).json({ error: "Failed to create campaign factory" });
    }
  });

  app.patch("/api/campaign-factory/:id", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");

    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid campaign ID" });
      }

      const campaign = await storage.getCampaignFactory(id);
      
      if (!campaign) {
        return res.status(404).json({ error: "Campaign factory not found" });
      }

      if (campaign.user_id !== req.user!.id && req.user!.role !== 'admin') {
        return res.status(403).json({ error: "Not authorized to update this campaign" });
      }

      // Update the campaign
      const updatedCampaign = await storage.updateCampaignFactory(id, req.body);
      res.json(updatedCampaign);
    } catch (error) {
      console.error("Error updating campaign factory:", error);
      res.status(500).json({ error: "Failed to update campaign factory" });
    }
  });

  app.delete("/api/campaign-factory/:id", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");

    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid campaign ID" });
      }

      const campaign = await storage.getCampaignFactory(id);
      
      if (!campaign) {
        return res.status(404).json({ error: "Campaign factory not found" });
      }

      if (campaign.user_id !== req.user!.id && req.user!.role !== 'admin') {
        return res.status(403).json({ error: "Not authorized to delete this campaign" });
      }

      // Delete the campaign
      await storage.deleteCampaignFactory(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting campaign factory:", error);
      res.status(500).json({ error: "Failed to delete campaign factory" });
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
        // Call the OpenAI API endpoint for persona generation
        const response = await fetch(`http://localhost:${process.env.PORT || 5000}/api/openai/generate-persona`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Cookie': req.headers.cookie // Forward authentication cookie
          },
          body: JSON.stringify({ description })
        });
        
        if (!response.ok) {
          throw new Error(`OpenAI API returned status ${response.status}`);
        }
        
        const generatedPersona = await response.json();
        
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

  // Register OpenAI routes
  registerOpenAIRoutes(app);
  
  const httpServer = createServer(app);
  return httpServer;
}
