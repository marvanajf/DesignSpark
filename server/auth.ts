import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { User as SelectUser, insertUserSchema } from "@shared/schema";
import { z } from "zod";

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
    const existingUser = await storage.getUserByEmail("demo@tovably.com");
    
    if (!existingUser) {
      console.log("Creating default demo user for testing...");
      const hashedPassword = await hashPassword("password123");
      // Create the user with all needed fields
      await storage.createUser({
        username: "demouser",
        email: "demo@tovably.com",
        password: hashedPassword,
        full_name: "Demo User",
        company: "Tovably Demo",
        role: "user"
      });
      
      console.log("Default demo user created successfully");
    }
  } catch (error) {
    console.error("Error creating default user:", error);
  }
}

export function setupAuth(app: Express) {
  // Create default user for testing
  createDefaultUserIfNotExists();
  
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || "keyboard-cat-secret",
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
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
        const user = await storage.getUserByEmail(email);
        if (!user || !(await comparePasswords(password, user.password))) {
          return done(null, false);
        } else {
          return done(null, user);
        }
      } catch (err) {
        return done(err);
      }
    }),
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (err) {
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

      // Check if email already exists
      try {
        console.log("Checking if email already exists...");
        const existingEmail = await storage.getUserByEmail(validatedData.email);
        if (existingEmail) {
          console.log("Email already exists:", validatedData.email);
          return res.status(400).json({ message: "Email already exists" });
        }
        console.log("Email check passed, email is unique");
      } catch (emailCheckError) {
        console.error("Error checking existing email:", emailCheckError);
        return res.status(500).json({ 
          message: "Server error during email verification",
          error: process.env.NODE_ENV === 'development' ? emailCheckError.toString() : undefined
        });
      }

      // Generate a unique username from the email if none is provided
      let username = validatedData.username;
      try {
        console.log("Generating username...");
        if (!username) {
          // Create username from the part before @ in email
          username = validatedData.email.split('@')[0];
          
          // Check if this username exists, if so add a random suffix
          console.log("Checking if username exists:", username);
          const existingUsername = await storage.getUserByUsername(username);
          if (existingUsername) {
            const randomSuffix = Math.floor(Math.random() * 9000 + 1000);
            username = `${username}${randomSuffix}`;
            console.log("Generated unique username with suffix:", username);
          }
        }
        console.log("Final username:", username);
      } catch (usernameError) {
        console.error("Error generating username:", usernameError);
        return res.status(500).json({ 
          message: "Server error during username generation",
          error: process.env.NODE_ENV === 'development' ? usernameError.toString() : undefined
        });
      }

      try {
        console.log("Hashing password...");
        // Hash the password and create user
        const hashedPassword = await hashPassword(validatedData.password);
        console.log("Password hashed successfully");
        
        console.log("Creating user in database...");
        const user = await storage.createUser({
          ...validatedData,
          username,
          password: hashedPassword,
          role: "user", // Set default role for new users
        });
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
        console.error("Error creating user:", createError);
        return res.status(500).json({ 
          message: "Server error during user creation",
          error: process.env.NODE_ENV === 'development' ? createError.toString() : undefined
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

  app.post("/api/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) return next(err);
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      
      req.login(user, (err) => {
        if (err) return next(err);
        
        // Remove password from response
        const { password, ...userWithoutPassword } = user;
        return res.status(200).json(userWithoutPassword);
      });
    })(req, res, next);
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

  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    // Remove password from response
    const { password, ...userWithoutPassword } = req.user as SelectUser;
    res.json(userWithoutPassword);
  });
}
