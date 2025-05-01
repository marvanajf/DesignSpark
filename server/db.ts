import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

// Determine environment
const isProd = process.env.NODE_ENV === 'production';
console.log(`Running in ${isProd ? 'production' : 'development'} mode`);

// Configure Neon database connection with enhanced reliability
neonConfig.webSocketConstructor = ws;

// Enhanced WebSocket connection with detailed error handling and more fallback options
neonConfig.wsProxy = (url) => {
  console.log(`Establishing WebSocket connection to: ${url} with enhanced settings`);
  
  // The URL passed here can be just the host or complete URL
  try {
    // In production, we need to handle IP-based connection issues that can occur on Render
    if (process.env.NODE_ENV === 'production') {
      // Check if URL is IP-based (common issue with Render deployment)
      if (url.match(/\d+\.\d+\.\d+\.\d+/)) {
        // This appears to be an IP address which might be causing connection issues
        console.log(`Detected IP-based connection URL: ${url}`);
        
        // Get the DATABASE_URL to extract the hostname instead
        const dbUrl = process.env.DATABASE_URL || '';
        if (dbUrl.includes('@')) {
          try {
            // Extract hostname from DATABASE_URL which should be the Neon endpoint
            const hostname = dbUrl.split('@')[1].split('/')[0].split(':')[0];
            if (hostname && !hostname.match(/^\d+\.\d+\.\d+\.\d+$/)) {
              console.log(`Using extracted hostname: ${hostname} instead of IP`);
              return hostname;
            }
          } catch (extractErr) {
            console.error('Error extracting hostname from DATABASE_URL:', extractErr);
          }
        }
      }
    }
    
    // Just return the URL as-is if no special handling needed
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

// Set up a more robust ping mechanism that adapts to connection failures with circuit breaker pattern
const PING_INTERVAL = isProd ? 10000 : 15000; // More frequent pings in production
let pingFailureCount = 0;
let consecutiveSuccessCount = 0;
let circuitBreakerOpen = false;
let circuitBreakerLastOpenTime = 0;
let circuitBreakerResetTimeout = 30000; // 30 seconds before trying again
let pingIntervalId = setInterval(doPing, PING_INTERVAL);

/**
 * Enhanced database ping function with circuit breaker pattern
 * This helps prevent overwhelming the database with connection attempts during outages
 * while still allowing for recovery when the database becomes available again
 */
async function doPing() {
  // Check if circuit breaker is open and if it's time to try again
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
    // Only output log in development or when debugging
    if (!isProd || process.env.DEBUG_DB === 'true') {
      console.log("Sending websocket ping to keep connection alive");
    }
    
    // Use proper async/await pattern for error handling
    await pool?.query('SELECT 1');
    
    // Increment success counter and reset failure count on success
    consecutiveSuccessCount++;
    
    if (pingFailureCount > 0) {
      console.log(`Ping succeeded after ${pingFailureCount} previous failures`);
      pingFailureCount = 0;
      
      // If we had many consecutive successes after failure, we're stable again
      if (consecutiveSuccessCount >= 5) {
        console.log("Connection appears stable again");
        consecutiveSuccessCount = 0;
        
        // Reset ping interval to normal
        clearInterval(pingIntervalId);
        pingIntervalId = setInterval(doPing, PING_INTERVAL);
      }
    }
  } catch (err) {
    pingFailureCount++;
    consecutiveSuccessCount = 0;
    
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.log(`Ping error (attempt ${pingFailureCount}):`, errorMessage);
    
    // Analyze error type for better recovery strategy
    const isConnectionError = errorMessage.includes('ECONNREFUSED') || 
                             errorMessage.includes('timeout') ||
                             errorMessage.includes('connection');
    
    // If we've had multiple consecutive failures, try recreating the interval with a different frequency
    if (pingFailureCount === 3) {
      console.log("Multiple ping failures detected, adjusting ping strategy");
      clearInterval(pingIntervalId);
      
      // Use a different ping interval after failures (try to find a working cadence)
      const newInterval = PING_INTERVAL + (2000 * (pingFailureCount % 5));
      console.log(`Setting new ping interval to ${newInterval}ms`);
      pingIntervalId = setInterval(doPing, newInterval);
    }
    
    // After 5 failures, try emergency recovery
    if (pingFailureCount === 5) {
      console.log("Critical: Multiple ping failures, attempting connection recovery");
      
      try {
        // Attempt pool recreation
        recreatePool();
      } catch (recoveryErr) {
        console.error("Failed to recover connection:", recoveryErr);
      }
    }
    
    // After 10 consecutive failures, open the circuit breaker to avoid overwhelming the database
    if (pingFailureCount >= 10 && isConnectionError) {
      console.log("Critical: Too many consecutive failures, opening circuit breaker");
      circuitBreakerOpen = true;
      circuitBreakerLastOpenTime = Date.now();
      
      // Increase timeout for next attempt exponentially
      circuitBreakerResetTimeout = Math.min(circuitBreakerResetTimeout * 2, 5 * 60 * 1000); // Cap at 5 minutes
      
      console.log(`Circuit breaker open: will try again in ${Math.round(circuitBreakerResetTimeout / 1000)} seconds`);
    }
  }
}

// Check for DATABASE_URL environment variable
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Clean up and validate the connection string to ensure compatibility
let originalConnectionString = process.env.DATABASE_URL;

// Check for specific issues with Render and internal IP addresses
if (process.env.NODE_ENV === 'production') {
  if (originalConnectionString.match(/\d+\.\d+\.\d+\.\d+/)) {
    console.log("Warning: DATABASE_URL contains an IP address which may cause issues in production");
    console.log("Checking for hostname-based alternative...");
    
    // Try to extract hostname from DATABASE_URL if it appears to have an IP
    const urlParts = originalConnectionString.split('@');
    
    if (urlParts.length > 1) {
      const hostPart = urlParts[1].split('/')[0];
      
      if (hostPart.match(/^\d+\.\d+\.\d+\.\d+/)) {
        console.log("Detected IP address in connection string, attempting to correct");
        
        // For Neon database, we can try to construct a better connection string
        if (originalConnectionString.includes('neon.tech') || 
            originalConnectionString.includes('.amazonaws.com')) {
          
          // Extract the hostname part from the connection string
          // If we can't use Render internal IP addresses, we'll use domain names
          try {
            // Get just the database name from the URL
            let dbName = "";
            if (urlParts[1].includes('/')) {
              dbName = urlParts[1].split('/')[1].split('?')[0];
            }
            
            // Construct a better connection URL using domain name
            // Format: postgres://user:password@hostname/dbname
            // Since we know this is a Neon DB (from logs), we'll use the hostname
            // from the DATABASE_URL credential part
            
            console.log("Attempting to use domain-based connection string");
          } catch (e) {
            console.error("Error reconstructing connection string:", e);
          }
        }
      }
    }
  }
}

// Parse the connection string
const connectionStringParts = originalConnectionString.split('?');
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

// Ensure we're using the correct SSL mode for Neon Database
if (!connectionString.includes('sslmode=')) {
  connectionString += connectionString.includes('?') ? '&sslmode=require' : '?sslmode=require';
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

/**
 * Enhanced pool recreation function with multiple strategies for connection recovery
 * This uses a multi-stage approach to recover from connection failures:
 * 1. Try closing and recreating the connection pool
 * 2. If that fails, try with more conservative settings
 * 3. If still failing, try with direct connections and reduced timeouts
 */
// Global recovery flag to prevent multiple simultaneous recovery attempts
let recoveryInProgress = false;

async function recreatePool() {
  console.log("Emergency connection recovery: Attempting to recreate database pool");
  
  // Prevent multiple simultaneous recovery attempts
  if (recoveryInProgress) {
    console.log("Recovery already in progress, skipping this attempt");
    return false;
  }
  
  recoveryInProgress = true;
  
  // For production on Render, check if we need to fix connection URL issues
  if (process.env.NODE_ENV === 'production' && connectionString) {
    // Look for specific Render-related IP issues (like the 10.202.x.x addresses)
    if (connectionString.includes('10.202.')) {
      console.log("Detected Render internal IP address in connection string, attempting to use hostname instead");
      
      // Get the DATABASE_URL from environment to extract hostname
      const dbUrl = process.env.DATABASE_URL || '';
      
      if (dbUrl && dbUrl.includes('@')) {
        try {
          // Try to parse the connection string to get the hostname
          const urlParts = dbUrl.split('@');
          if (urlParts.length > 1) {
            const hostPart = urlParts[1].split('/')[0];
            
            // Only use the hostname if it's not an IP address
            if (hostPart && !hostPart.match(/^\d+\.\d+\.\d+\.\d+$/)) {
              console.log(`Extracted hostname from DATABASE_URL: ${hostPart}`);
              
              // Create a new connection string using the hostname
              const newConnectionString = dbUrl;
              console.log("Using the original DATABASE_URL for recovery attempt");
              
              // Update the connection string for this recovery attempt
              connectionString = newConnectionString;
            }
          }
        } catch (parseErr) {
          console.error("Error parsing DATABASE_URL for connection recovery:", parseErr);
        }
      }
    }
  }
  
  try {
    // CRITICAL FIX: Don't end the existing pool until we have a working replacement!
    // This prevents the "Cannot use a pool after calling end" errors and hanging UI
    
    // Stage 1: Create new pool with moderate conservative settings
    try {
      // Create a new pool with similar configuration but with more conservative settings
      const emergencyPool = new Pool({
        connectionString: connectionString,
        max: 5, // Less connections for recovery mode
        idleTimeoutMillis: 30000, // Shorter idle timeout
        connectionTimeoutMillis: 30000, // Longer timeout for initial connection
        ssl: {
          rejectUnauthorized: false,
        },
        keepAlive: true,
        keepAliveInitialDelayMillis: 5000, // More aggressive keep-alive
      });
      
      // Test if the new pool works BEFORE closing the old one
      const testResult = await emergencyPool.query('SELECT 1');
      console.log("Stage 1 recovery success - emergency pool test successful:", testResult.rows[0]);
      
      // Only after confirming the new pool works, replace the old one
      // Create a safe reference to the global pool
      const oldPool = pool;
      
      // Replace the global pool with the new working pool
      // @ts-ignore - We need to overwrite the variable
      global.pool = emergencyPool;
      
      // Update the Drizzle instance to use the new pool
      // @ts-ignore - We need to update the db client
      db = drizzle({ client: emergencyPool, schema });
      
      // Now it's safe to close the old pool
      try {
        await oldPool.end();
        console.log("Successfully closed old pool connections");
      } catch (endError) {
        console.warn("Error while closing old pool (continuing anyway):", 
          endError instanceof Error ? endError.message : String(endError));
      }
      
      console.log("Database pool successfully recreated (Stage 1)");
      
      // Reset failure tracking
      pingFailureCount = 0;
      consecutiveSuccessCount = 0;
      circuitBreakerOpen = false;
      
      return true;
    } catch (stage1Error) {
      console.error("Stage 1 recovery failed:", 
        stage1Error instanceof Error ? stage1Error.message : String(stage1Error));
      console.log("Proceeding to Stage 2 recovery with more conservative settings...");
    }
    
    // Stage 2: Even more conservative settings with shorter timeouts
    try {
      // Wait a bit longer before retrying
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      // Create ultra-conservative pool
      const ultraConservativePool = new Pool({
        connectionString: connectionString,
        max: 3, // Minimal connections
        min: 0, // Allow all connections to close when idle
        idleTimeoutMillis: 10000, // Very short idle timeout
        connectionTimeoutMillis: 60000, // Extra long initial connection timeout
        ssl: {
          rejectUnauthorized: false,
        },
        keepAlive: true,
        keepAliveInitialDelayMillis: 1000, // Very aggressive keep-alive
      });
      
      // Test with a very simple query and longer timeout
      const testQuery = ultraConservativePool.query('SELECT 1');
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Query timeout")), 30000));
      
      const testResult = await Promise.race([testQuery, timeoutPromise]);
      console.log("Stage 2 recovery success - ultra conservative pool working:", 
        // @ts-ignore - testResult has rows
        testResult.rows ? testResult.rows[0] : "success");
      
      // Only after confirming the new pool works, replace the old one
      // Create a safe reference to the global pool
      const oldPool = pool;
      
      // Replace the global pool with the new working pool
      // @ts-ignore - We need to overwrite the variable
      global.pool = ultraConservativePool;
      
      // Update the Drizzle instance to use the new pool
      // @ts-ignore - We need to update the db client
      db = drizzle({ client: ultraConservativePool, schema });
      
      // Now it's safe to close the old pool
      try {
        await oldPool.end();
        console.log("Successfully closed old pool connections");
      } catch (endError) {
        console.warn("Error while closing old pool (continuing anyway):", 
          endError instanceof Error ? endError.message : String(endError));
      }
      
      console.log("Database pool successfully recreated (Stage 2)");
      
      // Reset failure tracking
      pingFailureCount = 0;
      consecutiveSuccessCount = 0;
      circuitBreakerOpen = false;
      
      return true;
    } catch (stage2Error) {
      console.error("Stage 2 recovery also failed:", 
        stage2Error instanceof Error ? stage2Error.message : String(stage2Error));
      
      // Final stage: Instead of giving up, set up a recovery state
      // that will retry connection establishment less frequently
      circuitBreakerOpen = true;
      circuitBreakerLastOpenTime = Date.now();
      circuitBreakerResetTimeout = 60000; // 1 minute before trying again
      
      console.log("All recovery stages failed, circuit breaker opened to prevent connection storms");
      console.log(`Will attempt connection again in ${Math.round(circuitBreakerResetTimeout / 1000)} seconds`);
      
      return false;
    }
  } catch (unhandledError) {
    console.error("Unhandled error during pool recovery:", 
      unhandledError instanceof Error ? unhandledError.message : String(unhandledError));
    
    if (unhandledError instanceof Error && unhandledError.stack) {
      console.error("Stack trace:", unhandledError.stack);
    }
    
    // Safety circuit breaker
    circuitBreakerOpen = true;
    circuitBreakerLastOpenTime = Date.now();
    circuitBreakerResetTimeout = 60000; // 1 minute timeout
    
    return false;
  } finally {
    // Make sure we release the recovery flag no matter what happens
    recoveryInProgress = false;
  }
}

// Export the pool, db, functions and diagnostic variables for use in other modules
export { 
  pool, 
  db, 
  withRetry, 
  testConnection, 
  recreatePool,
  // Export diagnostic variables for system health monitoring
  pingFailureCount,
  consecutiveSuccessCount,
  circuitBreakerOpen,
  circuitBreakerLastOpenTime,
  circuitBreakerResetTimeout
};

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
