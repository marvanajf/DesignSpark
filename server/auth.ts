import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express, Request, Response, NextFunction } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { User as SelectUser, insertUserSchema } from "@shared/schema";
import { z } from "zod";
import { withRetry } from "./db";

declare global {
  namespace Express {
    interface User extends SelectUser {}
  }
}

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

// Create a default user for testing if it doesn't exist
async function createDefaultUserIfNotExists() {
  try {
    // Import the withRetry utility for database operations
    const { withRetry } = await import('./db');
    
    // Use withRetry for resilient user fetching
    const existingUser = await withRetry(
      async () => storage.getUserByEmail("demo@tovably.com"),
      3, // 3 retries
      1000 // 1 second initial delay with exponential backoff
    );
    
    if (!existingUser) {
      console.log("Creating default demo user for testing...");
      const hashedPassword = await hashPassword("password123");
      
      // Create the user with all needed fields, with retry logic
      await withRetry(
        async () => storage.createUser({
          username: "demouser",
          email: "demo@tovably.com",
          password: hashedPassword,
          full_name: "Demo User",
          company: "Tovably Demo",
          role: "user"
        }),
        3, // 3 retries
        1000 // 1 second initial delay
      );
      
      console.log("Default demo user created successfully");
    }
  } catch (error) {
    console.error("Error creating default user:", 
      error instanceof Error ? error.message : String(error));
    if (error instanceof Error && error.stack) {
      console.error("Stack trace:", error.stack);
    }
  }
}

export function setupAuth(app: Express) {
  // Create default user for testing
  createDefaultUserIfNotExists();
  
  // Generate a random session secret if one is not provided
  if (!process.env.SESSION_SECRET) {
    console.warn("⚠️ No SESSION_SECRET provided, generating random one for this instance");
    process.env.SESSION_SECRET = Math.random().toString(36).substring(2, 15) + 
                               Math.random().toString(36).substring(2, 15);
  }
  
  // Configure session middleware with enhanced security
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    name: 'tovably.sid', // Custom cookie name for better security
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      httpOnly: true,
      sameSite: 'lax',
      path: '/'
    }
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password'
    }, async (email, password, done) => {
      try {
        // Import the withRetry utility for database operations
        const { withRetry } = await import('./db');
        
        // Use withRetry for resilient user fetching
        const user = await withRetry(
          async () => storage.getUserByEmail(email),
          3, // 3 retries
          1000 // 1 second initial delay with exponential backoff
        );
        
        if (!user || !(await comparePasswords(password, user.password))) {
          console.log("Authentication failed - invalid credentials");
          return done(null, false);
        } else {
          console.log("Authentication successful for user:", user.id);
          return done(null, user);
        }
      } catch (err) {
        console.error("Authentication error:", 
          err instanceof Error ? err.message : String(err));
          
        // Determine if this is a connection error
        if (err instanceof Error && 
           (err.message.includes('ECONNREFUSED') || 
            err.message.includes('connection') || 
            err.message.includes('network'))) {
          console.error('Database connection error during authentication');
        }
        
        return done(err);
      }
    }),
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id: number, done) => {
    try {
      // Import the withRetry utility for database operations
      const { withRetry } = await import('./db');
      
      // Use withRetry for resilient user fetching with exponential backoff
      const user = await withRetry(
        async () => storage.getUser(id),
        3, // 3 retries
        1000 // 1 second initial delay with exponential backoff
      );
      
      if (!user) {
        // Handle case where user doesn't exist anymore
        console.warn(`Session references non-existent user ID: ${id}, session will be invalidated`);
        return done(null, false);
      }
      
      done(null, user);
    } catch (err) {
      console.error(`Error deserializing user ID ${id}:`, 
        err instanceof Error ? err.message : String(err));
      
      // Determine if this is a connection error vs. other errors
      if (err instanceof Error && 
         (err.message.includes('ECONNREFUSED') || 
          err.message.includes('connection') || 
          err.message.includes('network'))) {
        console.error('Connection error during session deserialize - will retry on next request');
        // For connection errors, don't fail the request completely, return the session data
        // This allows the app to function during temporary outages
        return done(null, false);
      }
      
      done(err);
    }
  });

  app.post("/api/register", async (req, res, next) => {
    try {
      console.log("Registration attempt starting, validating input data...");
      
      // Extend the base schema with additional validation
      const extendedSchema = insertUserSchema.extend({
        password: z.string().min(8, "Password must be at least 8 characters"),
        full_name: z.string().min(2, "Full name is required"),
        company: z.string().min(2, "Company name is required"),
      });

      const validatedData = extendedSchema.parse(req.body);
      console.log("Data validation successful for email:", validatedData.email);

      // Check if email already exists with improved error handling
      try {
        console.log("Checking if email already exists:", validatedData.email);
        
        // Import the withRetry utility for database operations
        const { withRetry } = await import('./db');
        
        // Use withRetry for database operation with 5 retries and longer timeout
        const existingEmail = await withRetry(
          async () => storage.getUserByEmail(validatedData.email),
          5, // 5 retries
          2000 // 2 seconds initial delay with exponential backoff
        );
        
        if (existingEmail) {
          console.log("Email already exists:", validatedData.email);
          return res.status(400).json({ message: "Email already exists" });
        }
        
        console.log("Email check passed, email is unique");
      } catch (emailCheckError) {
        // More detailed error logging
        console.error("Error checking existing email:", 
          emailCheckError instanceof Error ? emailCheckError.message : String(emailCheckError));
        
        if (emailCheckError instanceof Error && emailCheckError.stack) {
          console.error("Stack trace:", emailCheckError.stack);
        }
        
        return res.status(500).json({ 
          message: "Server error during email verification",
          error: process.env.NODE_ENV === 'development' 
            ? (emailCheckError instanceof Error 
                ? {message: emailCheckError.message, stack: emailCheckError.stack} 
                : String(emailCheckError)) 
            : "Server error, please try again later"
        });
      }

      // Generate a unique username from the email if none is provided
      let username = validatedData.username;
      try {
        console.log("Generating username...");
        
        // Import the withRetry utility for database operations
        const { withRetry } = await import('./db');
        
        if (!username) {
          // Create username from the part before @ in email, ensure it's a string
          const emailUser = validatedData.email.split('@')[0] || "";
          username = emailUser;
          
          // Check if this username exists, if so add a random suffix, with retry logic
          console.log("Checking if username exists:", username);
          const existingUsername = await withRetry(
            async () => storage.getUserByUsername(username),
            5, // 5 retries
            2000 // 2 seconds initial delay with exponential backoff
          );
          
          if (existingUsername) {
            const randomSuffix = Math.floor(Math.random() * 9000 + 1000);
            username = `${username}${randomSuffix}`;
            console.log("Generated unique username with suffix:", username);
          }
        }
        console.log("Final username:", username);
      } catch (usernameError) {
        // More detailed error logging for username generation
        console.error("Error generating username:", 
          usernameError instanceof Error ? usernameError.message : String(usernameError));
        
        if (usernameError instanceof Error && usernameError.stack) {
          console.error("Stack trace:", usernameError.stack);
        }
        
        return res.status(500).json({ 
          message: "Server error during username generation",
          error: process.env.NODE_ENV === 'development' 
            ? (usernameError instanceof Error 
                ? {message: usernameError.message, stack: usernameError.stack} 
                : String(usernameError))
            : "Server error, please try again later"
        });
      }

      try {
        console.log("Hashing password...");
        // Hash the password and create user
        const hashedPassword = await hashPassword(validatedData.password);
        console.log("Password hashed successfully");
        
        // Import the withRetry utility for database operations
        const { withRetry } = await import('./db');
        
        console.log("Creating user in database with improved error handling...");
        const user = await withRetry(
          async () => storage.createUser({
            ...validatedData,
            username,
            password: hashedPassword,
            role: "user", // Set default role for new users
          }),
          5, // 5 retries
          2000 // 2 seconds initial delay with exponential backoff
        );
        
        console.log("User created successfully with ID:", user.id);

        // Remove password from response
        const { password, ...userWithoutPassword } = user;

        // Log the user in
        console.log("Logging in new user...");
        req.login(user, (err) => {
          if (err) {
            console.error("Error during login after registration:", err);
            return next(err);
          }
          console.log("Registration and login complete for user:", user.id);
          res.status(201).json(userWithoutPassword);
        });
      } catch (createError) {
        // More detailed error logging for user creation
        console.error("Error creating user:", 
          createError instanceof Error ? createError.message : String(createError));
        
        if (createError instanceof Error && createError.stack) {
          console.error("Stack trace:", createError.stack);
        }
        
        // Check for specific error types like unique constraint violations
        const errorMsg = String(createError);
        if (errorMsg.includes("unique constraint") || errorMsg.includes("duplicate key")) {
          if (errorMsg.includes("username")) {
            return res.status(400).json({
              message: "Username already exists. Please choose a different username.",
              error: errorMsg
            });
          } else if (errorMsg.includes("email")) {
            return res.status(400).json({
              message: "Email already exists. Please use a different email or sign in.",
              error: errorMsg
            });
          }
        }
        
        return res.status(500).json({ 
          message: "Server error during user creation",
          error: process.env.NODE_ENV === 'development' 
            ? (createError instanceof Error 
                ? {message: createError.message, stack: createError.stack} 
                : String(createError))
            : "Server error, please try again later"
        });
      }
    } catch (error) {
      console.error("Unhandled error in registration process:", error);
      
      if (error instanceof z.ZodError) {
        console.log("Validation error details:", JSON.stringify(error.errors));
        return res.status(400).json({ 
          message: "Validation failed",
          errors: error.errors 
        });
      }
      
      // Check if it's a connection error
      if (error instanceof Error && error.message.includes('ECONNREFUSED')) {
        console.error("Database connection error during registration:", error);
        return res.status(500).json({ 
          message: "Server error: Database connection failed",
          error: process.env.NODE_ENV === 'development' ? error.toString() : undefined
        });
      }
      
      return res.status(500).json({ 
        message: "Server error during registration",
        error: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.toString() : JSON.stringify(error)) : undefined
      });
    }
  });

  app.post("/api/login", async (req, res, next) => {
    try {
      // Implement custom authentication with retry mechanism
      const loginHandler = async () => {
        return new Promise((resolve, reject) => {
          passport.authenticate("local", (err, user, info) => {
            if (err) {
              console.error("Passport authentication error:", err);
              return reject(err);
            }
            
            if (!user) {
              console.log("Login failed - invalid credentials");
              return reject(new Error("Invalid email or password"));
            }
            
            req.login(user, (loginErr) => {
              if (loginErr) {
                console.error("Login session error:", loginErr);
                return reject(loginErr);
              }
              
              // Remove password from response
              const { password, ...userWithoutPassword } = user;
              resolve(userWithoutPassword);
            });
          })(req, res, next);
        });
      };
      
      // Import the withRetry utility
      const { withRetry } = await import('./db');
      
      // Execute login with retries
      const userResponse = await withRetry(
        loginHandler,
        3, // 3 retries
        1000 // 1 second initial delay
      );
      
      return res.status(200).json(userResponse);
    } catch (error) {
      console.error("Login error:", 
        error instanceof Error ? error.message : String(error));
      
      // Check if it's an invalid credentials error
      if (error instanceof Error && error.message === "Invalid email or password") {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      
      // Check if it's a connection error
      if (error instanceof Error && error.message.includes('ECONNREFUSED')) {
        return res.status(500).json({ 
          message: "Server error: Database connection failed",
          error: process.env.NODE_ENV === 'development' ? error.toString() : undefined
        });
      }
      
      return res.status(500).json({ 
        message: "Server error during login",
        error: process.env.NODE_ENV === 'development' 
          ? (error instanceof Error ? error.toString() : String(error))
          : "Server error, please try again later"
      });
    }
  });

  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      req.session.destroy((err) => {
        if (err) return next(err);
        res.clearCookie('connect.sid');
        res.sendStatus(200);
      });
    });
  });

  app.get("/api/user", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        console.log("User not authenticated for /api/user");
        return res.sendStatus(401);
      }
      
      // Get the latest user data from the database with retry
      try {
        const { withRetry } = await import('./db');
        
        // If we have a user ID, fetch the latest user data to ensure it's up to date
        if (req.user?.id) {
          console.log("Fetching latest user data for user ID:", req.user.id);
          
          const latestUser = await withRetry(
            async () => storage.getUser(req.user.id),
            3, // 3 retries
            1000 // 1 second initial delay
          );
          
          if (latestUser) {
            // Remove password from response
            const { password, ...userWithoutPassword } = latestUser;
            console.log("Successfully retrieved latest user data");
            return res.json(userWithoutPassword);
          } else {
            // This is an unusual case where the user is authenticated but not found in the DB
            console.error("Authenticated user not found in database, user ID:", req.user.id);
            req.logout((err) => {
              if (err) console.error("Error logging out stale user session:", err);
              return res.sendStatus(401);
            });
            return;
          }
        }
      } catch (error) {
        console.error("Error fetching latest user data:", 
          error instanceof Error ? error.message : String(error));
        // Continue to fallback
      }
      
      // Fallback to the user data in the session if database fetch fails
      console.log("Using session user data as fallback");
      const { password, ...userWithoutPassword } = req.user as SelectUser;
      res.json(userWithoutPassword);
      
    } catch (error) {
      console.error("Error in /api/user endpoint:", 
        error instanceof Error ? error.message : String(error));
      
      return res.status(500).json({
        message: "Server error retrieving user data",
        error: process.env.NODE_ENV === 'development' 
          ? (error instanceof Error ? error.toString() : String(error))
          : undefined
      });
    }
  });
}
