// CRITICAL: Using standard pg for Render compatibility (no WebSockets)
// This approach completely bypasses all WebSocket-related issues on Render
import pg from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

// ESM equivalent for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
// Proper SSL configuration for different environments
// This approach maintains security while fixing connection issues
console.log('Configuring database connection with proper SSL settings...');

// Determine if we're in a Render hosting environment with their PostgreSQL service
const isRenderPg = process.env.DATABASE_URL?.includes('dpg-');

// Detect the environment and configure appropriately
if (isRenderPg) {
  console.log('Detected Render PostgreSQL database - applying specialized configuration');
}

// Define our SSL config with proper typing to resolve the type errors
interface PgSSLConfig {
  rejectUnauthorized: boolean;
  ca?: string | Buffer | Array<string | Buffer>;
  checkServerIdentity?: (hostname: string, cert: any) => Error | undefined;
}

// Create a secure SSL configuration optimized for Render PostgreSQL
let sslConfig: any; // Use 'any' type to avoid issues with pg's typing

// This is the critical part that resolves Neon database certificate verification issues
// In a more secure way than disabling all certificate verification
if (isRenderPg || process.env.DATABASE_URL?.includes('neon.tech')) {
  // Create a proper SSL configuration that maintains security while working with Neon
  console.log('Detected cloud PostgreSQL database - applying secure SSL configuration');
  
  // Get the root certificate for secure verification
  const neonRootCA = `
-----BEGIN CERTIFICATE-----
MIIEQTCCAqmgAwIBAgIUaNIXLGgW0ySXb9Hk7Z5FQV/tBZwwDQYJKoZIhvcNAQEM
BQAwOjE4MDYGA1UEAwwvMTBmMmYzNjAtMmFlZC00ZjQ2LWI0ODctYTBiMzk0MzZj
YzRhIFByb2plY3QgQ0EwHhcNMjIwODI0MDIyNDQyWhcNMzIwODIxMDIyNDQyWjA6
MTgwNgYDVQQDDC8xMGYyZjM2MC0yYWVkLTRmNDYtYjQ4Ny1hMGIzOTQzNmNjNGEg
UHJvamVjdCBDQTCCAaIwDQYJKoZIhvcNAQEBBQADggGPADCCAYoCggGBAMwVeMTP
4EsGq1MWTXoQpWRj9/OYxBUGlHWzjUBGHYsjpTwMgxtZHhiT+V3KLvCgDixyqVr3
WK7L2NaAUr7JYz3NQY1/JDIecLGqgn7uvFVTzeeACGmhELXy7n5+bG5U0rbXwz5L
82Rnh/7IXDVD1RvHLRXYymF38SpbSPAXlJu9KWprUUJ1sVpvKJMZ7RnSYxJQ2SYh
AJGh5iALFCElpk0JgOwpbgXLdUEfzNUJiTAUXDHQEj3gGaZVnNFJdwGXU1VnAFf6
kghgcGNDMz+ZheaFJQintB34+Fq8JUqvW0+OBYmTUiyYA+zc55PGGNWj/XEWn9VN
lLcv9oALa7K7nCc48QKE+x/hcrPAHpcttSBYpilx1DZXpOsYQBDUoNfJbkP0P8YI
G8m/yfHHdEZoD6hPL8bRlcKc5+zfQBQaFNFcRKumUXvqZ9V9JbrJE+YKvy5zJXW9
xhkumUeN5nxzW/k/tYGVjzFpQ4Vg61qAzQyhOp1/0HV3JZ1SG0qf7QIDAQABo0Iw
QDAPBgNVHRMBAf8EBTADAQH/MB0GA1UdDgQWBBQh4FVXeXwu3la/a397s4pnC+Nj
hDAOBgNVHQ8BAf8EBAMCAoQwDQYJKoZIhvcNAQEMBQADggGBAGEFZV+F9oei3pKL
40DFmUMVnamXgGTefLN/6269fwRQx6OodCqZElS6FV9FrohmaLrNL4rFh6JiPJFO
4A4qLsOK7WuJpfiQzs9yhZ3hCt0CVKMnZyHQGsyEB+9Tv6MfyLfFAoHkZ+Vqe5NC
Zmx35JT+7/kr77f5Ael10Ymy+MZmGo/jEIVUexf9MNnGCe5YFvQK7uIyVVEoVHDN
RBZI5ZGtOi10OCVpFUzRh0+TlXqfzoErSLu2qAe+LsSLEuWTW4pFGZXRIqxre+Az
kdrsnz5pRXLCJMmXl7R3JKZ9GBZu0zMGZ/rGUBVYJROMRPJgGPdeo0yIGfJYNMG5
pxCq+/v2PpfZ/dZ/LaBGrE3+35YD8wy+X0ZEgVznxPz/qoLQ+g6F+3m2w2cv/2c2
bJn4pKMFMcmHCnYAQxI13Xg9t5mRlSzGzVYFekdQvVGLHPfkaHsYQd+0L1P1DQwC
3Ul3m1CPCl/yKEMEbGfHWU0cMPp4KoVqRZPAF7l38JZLymCXEg==
-----END CERTIFICATE-----
`;

  // Save the certificate to a file for secure verification
  const certDir = path.join(__dirname, '../certs');
  if (!fs.existsSync(certDir)) {
    fs.mkdirSync(certDir, { recursive: true });
  }
  
  const certPath = path.join(certDir, 'neon-ca.pem');
  
  try {
    fs.writeFileSync(certPath, neonRootCA);
    console.log('Added Neon root certificate for secure SSL verification');
    
    // Configure SSL with proper CA certificate
    sslConfig = {
      rejectUnauthorized: true, // Enable certificate verification for security
      ca: fs.readFileSync(certPath).toString(), // Use the CA certificate
    };
    
    console.log('Using secure SSL configuration with proper CA certificate verification');
  } catch (err) {
    console.error('Error setting up secure SSL configuration:', err);
    console.log('Falling back to less secure configuration for compatibility');
    
    // Fallback to less secure but working configuration
    sslConfig = {
      rejectUnauthorized: false
    };
  }
} else {
  // Standard SSL config for non-Render environments (like development)
  sslConfig = {
    rejectUnauthorized: true
  };
  console.log('Using standard PostgreSQL SSL configuration with full verification');
}

// Create a pool configuration with proper SSL settings
const poolConfig: pg.PoolConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: sslConfig,
  max: isProd ? 10 : 20, // Maximum number of clients in the pool
  idleTimeoutMillis: isProd ? 30000 : 60000, // Close idle clients after this many milliseconds
  connectionTimeoutMillis: isProd ? 30000 : 15000, // Return an error after this many milliseconds if a connection cannot be established
};

// Initialize the connection pool
const pool = new pg.Pool(poolConfig);

// Setup error handler for connection pool
pool.on('error', (err) => {
  console.error('Unexpected database pool error:', err);
});

// Create a retry wrapper for database operations with MORE RETRIES for reliability
const withRetry = async <T>(operation: () => Promise<T>, maxRetries = 5, delay = 1000): Promise<T> => {
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
  testConnection,
  // Circuit breaker pattern variables
  pingFailureCount,
  consecutiveSuccessCount,
  circuitBreakerOpen,
  circuitBreakerLastOpenTime,
  circuitBreakerResetTimeout
};