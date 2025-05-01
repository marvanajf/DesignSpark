import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { migrateStripeFields } from "./migrations";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

// Global unhandled promise rejection handler for database connection issues
process.on('unhandledRejection', async (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  const reasonStr = String(reason);
  
  // Check if this is a database connection issue
  if (reasonStr.includes('ECONNREFUSED') || 
      reasonStr.includes('database') || 
      reasonStr.includes('connection') ||
      reasonStr.includes('timeout')) {
    
    console.error('Critical: Unhandled database connection error detected');
    
    try {
      console.log('Attempting emergency database recovery...');
      // Import database utilities
      const { recreatePool, testConnection } = await import('./db');
      
      // Try to recreate the pool
      const recoveryResult = await recreatePool();
      
      if (recoveryResult) {
        console.log('Database pool recovery successful after unhandled rejection');
        
        // Verify the recovery worked
        const testResult = await testConnection();
        console.log('Post-recovery connection test:', testResult ? 'success' : 'failed');
      } else {
        console.error('Database pool recovery failed after unhandled rejection');
      }
    } catch (recoveryError) {
      console.error('Failed to recover from unhandled database error:', recoveryError);
    }
  }
});

// Application initialization with enhanced error handling
(async () => {
  try {
    // Run database migrations
    await migrateStripeFields();
    
    // Set up email service with Gmail
    try {
      import('./email').then(emailModule => {
        emailModule.setupEmailService();
      }).catch(err => {
        console.warn('Failed to import email module:', err);
      });
    } catch (error) {
      console.warn('Failed to set up email service:', error);
    }
    
    const server = await registerRoutes(app);

    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";

      res.status(status).json({ message });
      console.error('Express error handler caught:', err);
    });

    // importantly only setup vite in development and after
    // setting up all the other routes so the catch-all route
    // doesn't interfere with the other routes
    if (app.get("env") === "development") {
      await setupVite(app, server);
    } else {
      serveStatic(app);
    }

    // ALWAYS serve the app on port 5000
    // this serves both the API and the client.
    // It is the only port that is not firewalled.
    const port = 5000;
    server.listen({
      port,
      host: "0.0.0.0",
      reusePort: true,
    }, () => {
      log(`serving on port ${port}`);
    });
  } catch (startupError) {
    console.error('Critical application startup error:', startupError);
    
    // Check if this is a database connection issue
    const errorStr = String(startupError);
    if (errorStr.includes('database') || errorStr.includes('connection')) {
      console.error('Database connection error during startup - attempting recovery');
      
      try {
        const { recreatePool } = await import('./db');
        await recreatePool();
        
        // Retry application startup after a short delay
        console.log('Retrying application startup in 5 seconds...');
        setTimeout(() => {
          console.log('Restarting application after database recovery...');
          // This will restart the application in this environment
          process.exit(1);
        }, 5000);
      } catch (recoveryError) {
        console.error('Failed to recover from startup database error:', recoveryError);
        process.exit(1);
      }
    } else {
      // Non-database error, exit with error code
      process.exit(1);
    }
  }
})();
