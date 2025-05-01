import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

// Configure Neon database connection
neonConfig.webSocketConstructor = ws;

// Check for DATABASE_URL environment variable
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Ensure connection string has sslmode=require for production environments
let connectionString = process.env.DATABASE_URL;
if (!connectionString.includes('sslmode=')) {
  // Add sslmode=require if not already present
  connectionString += connectionString.includes('?') ? '&sslmode=require' : '?sslmode=require';
  console.log("Added SSL mode requirement to database connection string");
}

// Log connection attempt (without sensitive details)
console.log(`Attempting database connection to: ${connectionString.split('@')[1]?.split('/')[0] || 'unknown host'}`);

// Initialize database connection pool with improved configuration for production
const pool = new Pool({ 
  connectionString: connectionString,
  max: 10, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // How long a client is allowed to remain idle before being closed
  connectionTimeoutMillis: 10000, // How long to wait for a connection
  ssl: {
    rejectUnauthorized: false // Important for some hosting providers (like Render)
  }
});

// Initialize Drizzle ORM with the connection pool
const db = drizzle({ client: pool, schema });

// Export the pool and db for use in other modules
export { pool, db };

// Log successful connection
console.log("Database connection pool initialized successfully");
