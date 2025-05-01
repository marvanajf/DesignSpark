// CRITICAL: Using standard pg for Render compatibility (no WebSockets)
// This approach completely bypasses all WebSocket-related issues on Render
import pg from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";

// Determine environment
const isProd = process.env.NODE_ENV === 'production';
console.log(`Running in ${isProd ? 'production' : 'development'} mode`);

// Set up database connection error handling and retry mechanisms
let pingFailureCount = 0;
let consecutiveSuccessCount = 0;
let circuitBreakerOpen = false;
let circuitBreakerLastOpenTime = 0;
let circuitBreakerResetTimeout = 30000; // 30 seconds before trying again

// Check for DATABASE_URL environment variable
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}

// Sanitize the connection string for logging
const sanitizeUrl = (url: string) => {
  try {
    const parts = url.split('@');
    if (parts.length >= 2) {
      return `postgres://****:****@${parts[1]}`;
    }
    return 'postgres://****:****@[hidden]';
  } catch (e) {
    return 'postgres://****:****@[hidden]';
  }
};

console.log(`Connecting to database: ${sanitizeUrl(process.env.DATABASE_URL)}`);
console.log('Using direct PostgreSQL connections (standard pg driver) - NO WebSockets');

// Initialize the connection pool with direct PostgreSQL connections
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Required for SSL connections in many hosted environments
  },
  max: isProd ? 10 : 20, // Maximum number of clients in the pool
  idleTimeoutMillis: isProd ? 30000 : 60000, // Close idle clients after this many milliseconds
  connectionTimeoutMillis: isProd ? 30000 : 15000, // Return an error after this many milliseconds if a connection cannot be established
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
const db = drizzle(pool, { schema });

// Health check function for database connection
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

// Periodic database ping to keep connections alive
const PING_INTERVAL = isProd ? 10000 : 20000; // More frequent pings in production
let pingIntervalId = setInterval(async () => {
  if (circuitBreakerOpen) {
    const now = Date.now();
    if (now - circuitBreakerLastOpenTime < circuitBreakerResetTimeout) {
      // Circuit breaker still open and cooling down
      console.log(`Circuit breaker open (${Math.round((now - circuitBreakerLastOpenTime) / 1000)}s/${Math.round(circuitBreakerResetTimeout / 1000)}s), skipping ping`);
      return;
    } else {
      // Time to try again
      console.log("Circuit breaker reset, attempting to reestablish database connection");
      circuitBreakerOpen = false;
    }
  }

  try {
    if (!isProd || process.env.DEBUG_DB === 'true') {
      console.log("Sending database ping to keep connection alive");
    }
    
    // Use proper async/await pattern for error handling
    await pool.query('SELECT 1');
    
    // Increment success counter and reset failure count on success
    consecutiveSuccessCount++;
    
    if (pingFailureCount > 0) {
      console.log(`Ping succeeded after ${pingFailureCount} previous failures`);
      pingFailureCount = 0;
      
      // If we had many consecutive successes after failure, we're stable again
      if (consecutiveSuccessCount >= 5) {
        console.log("Connection appears stable again");
        consecutiveSuccessCount = 0;
      }
    }
  } catch (err) {
    pingFailureCount++;
    consecutiveSuccessCount = 0;
    
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.log(`Ping error (attempt ${pingFailureCount}):`, errorMessage);
    
    // After 10 consecutive failures, open the circuit breaker
    if (pingFailureCount >= 10) {
      console.log("Critical: Too many consecutive failures, opening circuit breaker");
      circuitBreakerOpen = true;
      circuitBreakerLastOpenTime = Date.now();
      
      // Increase timeout for next attempt exponentially (max 5 minutes)
      circuitBreakerResetTimeout = Math.min(circuitBreakerResetTimeout * 2, 5 * 60 * 1000);
      
      console.log(`Circuit breaker open: will try again in ${Math.round(circuitBreakerResetTimeout / 1000)} seconds`);
    }
  }
}, PING_INTERVAL);

// Verify connection immediately
testConnection()
  .then(success => {
    if (success) {
      console.log("Database connection pool initialized successfully");
    } else {
      console.error("Database connection pool initialization FAILED - check your connection string");
    }
  })
  .catch(err => {
    console.error("Error during initial database connection test:", err);
  });

// Export the database objects and utilities
export { 
  pool, 
  db, 
  withRetry, 
  testConnection
};