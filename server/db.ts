import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

// Configure Neon database connection
neonConfig.webSocketConstructor = ws;
// Increase WebSocket timeout for Neon connections
neonConfig.wsProxy = (url) => {
  console.log(`Establishing WebSocket connection to: ${url} with enhanced settings`);
  return url;
};
neonConfig.pipelineTLS = true;
neonConfig.useSecureWebSocket = true;
neonConfig.forceDisablePgSSL = true; // We'll handle SSL in the Pool config
// Set up a regular ping to keep the websocket connection alive
const PING_INTERVAL = 15000; // 15 seconds
setInterval(() => {
  try {
    console.log("Sending websocket ping to keep connection alive");
    // This is a workaround since webSocketPingInterval isn't directly supported
    // The pool.query will ensure the connection stays active
    pool?.query('SELECT 1').catch(err => console.log("Ping error (can be ignored):", err.message));
  } catch (err) {
    // Ignore errors during ping
  }
}, PING_INTERVAL);

// Check for DATABASE_URL environment variable
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Clean up the connection string to ensure compatibility
const connectionStringParts = process.env.DATABASE_URL.split('?');
const baseConnectionString = connectionStringParts[0];
const params = connectionStringParts[1] ? connectionStringParts[1].split('&') : [];

// Filter out any existing ssl or sslmode parameters
const filteredParams = params.filter(param => 
  !param.startsWith('ssl=') && !param.startsWith('sslmode=')
);

// Build the final connection string with consistent SSL settings
let connectionString = baseConnectionString;
if (filteredParams.length > 0) {
  connectionString += '?' + filteredParams.join('&');
}

// Log connection attempt (without sensitive details)
const sanitizedHost = connectionString.split('@')[1]?.split('/')[0] || 'unknown host';
console.log(`Attempting database connection to: ${sanitizedHost}`);

// Initialize database connection pool with comprehensive configuration for production
const pool = new Pool({ 
  connectionString: connectionString,
  max: 20, // Increased maximum number of clients in the pool
  idleTimeoutMillis: 60000, // Increased idle timeout to 1 minute
  connectionTimeoutMillis: 20000, // Increased connection timeout to 20 seconds
  ssl: {
    rejectUnauthorized: false, // Important for cloud hosting providers like Render
    // We're using the WebSocket connection for Neon, so we don't need additional SSL parameters
  },
  keepAlive: true, // Enable TCP keepalive
  keepAliveInitialDelayMillis: 10000, // 10 second delay before starting keepalive
});

// Setup error handler for connection pool
pool.on('error', (err) => {
  console.error('Unexpected database pool error:', err);
});

// Create a retry wrapper for database operations
const withRetry = async <T>(operation: () => Promise<T>, maxRetries = 3, delay = 1000): Promise<T> => {
  let lastError: Error | unknown;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (err: Error | unknown) {
      lastError = err;
      console.warn(`Database operation failed (attempt ${attempt}/${maxRetries}):`, 
        err instanceof Error ? err.message : String(err));
      if (attempt < maxRetries) {
        console.log(`Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        // Exponential backoff
        delay *= 2;
      }
    }
  }
  console.error(`Database operation failed after ${maxRetries} attempts:`, lastError);
  throw lastError;
};

// Initialize Drizzle ORM with the connection pool
const db = drizzle({ client: pool, schema });

// Test the connection to verify it's working
async function testConnection() {
  try {
    const result = await withRetry(() => pool.query('SELECT NOW()'));
    console.log("Database connection test successful:", result.rows[0]);
    return true;
  } catch (err) {
    console.error("Database connection test failed:", err);
    return false;
  }
}

// Export the pool, db, and testConnection function for use in other modules
export { pool, db, withRetry, testConnection };

// Verify connection immediately
testConnection()
  .then(success => {
    if (success) {
      console.log("Database connection pool initialized successfully");
    } else {
      console.error("Database connection pool initialization FAILED");
    }
  })
  .catch(err => {
    console.error("Error during initial database connection test:", err);
  });
