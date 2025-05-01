import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

// Determine environment
const isProd = process.env.NODE_ENV === 'production';
console.log(`Running in ${isProd ? 'production' : 'development'} mode`);

// Configure Neon database connection with enhanced reliability
neonConfig.webSocketConstructor = ws;

// Enhanced WebSocket connection with detailed error handling
neonConfig.wsProxy = (url) => {
  console.log(`Establishing WebSocket connection to: ${url} with enhanced settings`);
  
  // The URL passed here can be just the host or complete URL
  try {
    // Just return the URL as-is - don't modify it
    // This is important as Neon's internal code expects specific formatting
    console.log(`Using WebSocket URL as provided: ${url}`);
    
    // Return the URL directly
    return url;
  } catch (err) {
    console.error('Error processing WebSocket URL:', err);
    // Fallback to default behavior
    return url;
  }
};

// Optimize Neon connection settings for improved reliability
neonConfig.pipelineTLS = true;
neonConfig.useSecureWebSocket = true;

// Different SSL handling strategy based on environment
if (isProd) {
  console.log('Using production-optimized database connection settings');
  neonConfig.forceDisablePgSSL = false; // Use both WebSocket and regular SSL in production
  neonConfig.connectionTimeoutMillis = 60000; // 60 seconds timeout
} else {
  console.log('Using development-optimized database connection settings');
  neonConfig.forceDisablePgSSL = true; // We'll handle SSL in the Pool config for dev
  neonConfig.connectionTimeoutMillis = 30000; // 30 seconds timeout
}

// Set up a more robust ping mechanism that adapts to connection failures
const PING_INTERVAL = isProd ? 10000 : 15000; // More frequent pings in production
let pingFailureCount = 0;
let pingIntervalId = setInterval(doPing, PING_INTERVAL);

// This function performs a database ping and tracks failures
async function doPing() {
  try {
    console.log("Sending websocket ping to keep connection alive");
    // Use proper async/await pattern for error handling
    await pool?.query('SELECT 1');
    
    // Reset failure count on success
    if (pingFailureCount > 0) {
      console.log(`Ping succeeded after ${pingFailureCount} previous failures`);
      pingFailureCount = 0;
    }
  } catch (err) {
    pingFailureCount++;
    console.log(`Ping error (attempt ${pingFailureCount}):`, err instanceof Error ? err.message : String(err));
    
    // If we've had multiple consecutive failures, try recreating the interval with a different frequency
    if (pingFailureCount === 5) {
      console.log("Multiple ping failures detected, adjusting ping strategy");
      clearInterval(pingIntervalId);
      
      // Use a different ping interval after failures (try to find a working cadence)
      const newInterval = PING_INTERVAL + (2000 * (pingFailureCount % 5));
      console.log(`Setting new ping interval to ${newInterval}ms`);
      pingIntervalId = setInterval(doPing, newInterval);
    }
    
    // If we have persistent failures, try emergency recovery
    if (pingFailureCount === 10) {
      console.log("Critical: Multiple ping failures, attempting connection recovery");
      // After 10 failures, attempt to recreate the pool
      try {
        recreatePool();
      } catch (recoveryErr) {
        console.error("Failed to recover connection:", recoveryErr);
      }
    }
  }
}

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

// Create environment-specific connection pool options
let poolOptions: any = {
  connectionString: connectionString,
  ssl: {
    rejectUnauthorized: false, // Important for cloud hosting providers like Render
  },
  keepAlive: true // Enable TCP keepalive
};

// Different settings for development vs production
if (isProd) {
  console.log("Using production-specific connection pool settings");
  
  // Enhanced settings for production to work around possible firewall issues
  poolOptions = {
    ...poolOptions,
    max: 10, // Fewer connections in production to avoid overwhelming resources
    idleTimeoutMillis: 30000, // Shorter idle timeout in production
    connectionTimeoutMillis: 30000, // Longer connection timeout for initial connection
    allowExitOnIdle: false, // Don't exit when pool is idle
    // Try to connect directly to the IP if possible (this can bypass some DNS issues)
    keepAliveInitialDelayMillis: 5000, // More aggressive keep-alive
    
    // Add production-specific error handling
    async onError(err: any) {
      console.error("Production database pool error:", err);
      
      // If we're seeing ECONNREFUSED errors repeatedly, try to take recovery actions
      if (err.message?.includes("ECONNREFUSED") || err.code === "ECONNREFUSED") {
        console.error("Critical: Connection refused error detected in production");
        console.error("Attempting to refresh database pool on next connection attempt");
        
        // Flag for pool refresh
        pingFailureCount += 5; // Accelerate toward recovery mode
      }
    }
  };
} else {
  // Development settings - more lenient
  poolOptions = {
    ...poolOptions,
    max: 20, // More connections for development
    idleTimeoutMillis: 60000, // Longer idle timeout for development
    connectionTimeoutMillis: 15000, // Standard connection timeout
    keepAliveInitialDelayMillis: 10000, // Standard keep-alive delay
  };
}

// Add node-postgres instrumentation for better debugging
if (process.env.DEBUG_DB === 'true') {
  console.log("Database debugging enabled");
  
  // Log all queries if debugging enabled
  const oldQuery = Pool.prototype.query;
  // @ts-ignore - Override the query method
  Pool.prototype.query = function() {
    console.log("QUERY:", arguments[0]);
    // @ts-ignore - Call the original method
    return oldQuery.apply(this, arguments);
  };
}

console.log("Initializing database connection pool with optimized settings");
// Initialize the connection pool
const pool = new Pool(poolOptions);

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

// Pool recreation function to recover from persistent connection failures
async function recreatePool() {
  console.log("Emergency connection recovery: Attempting to recreate database pool");
  
  try {
    // End the existing pool
    await pool.end();
    console.log("Successfully closed existing pool connections");
  } catch (endError) {
    console.warn("Error while closing existing pool (continuing anyway):", endError);
  }
  
  try {
    // Short pause before recreating
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Create a new pool with the same configuration but with more conservative settings
    const emergencyPool = new Pool({
      connectionString: connectionString,
      max: 5, // Less connections for recovery mode
      idleTimeoutMillis: 30000, // Shorter idle timeout
      connectionTimeoutMillis: 30000, // Longer timeout for initial connection
      ssl: {
        rejectUnauthorized: false,
      },
      keepAlive: true,
    });
    
    // Test if the new pool works
    const testResult = await emergencyPool.query('SELECT 1');
    console.log("Emergency pool test successful:", testResult.rows[0]);
    
    // Replace the original pool with the emergency one
    // @ts-ignore - We need dynamic replacement
    Object.assign(pool, emergencyPool);
    
    console.log("Database pool successfully recreated");
    
    // Reset failures
    pingFailureCount = 0;
    
    return true;
  } catch (recreateError) {
    console.error("Failed to recreate database pool:", recreateError);
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
      
      // In production, attempt immediate recovery
      if (isProd) {
        console.log("Attempting immediate connection recovery due to initial failure");
        recreatePool().catch(err => {
          console.error("Emergency connection recovery also failed:", err);
        });
      }
    }
  })
  .catch(err => {
    console.error("Error during initial database connection test:", err);
  });
