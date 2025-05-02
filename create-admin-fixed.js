/**
 * Admin Account Creation Script (EMERGENCY FIX VERSION)
 * 
 * This script creates an admin user account for the Tovably application
 * with proper SSL certificate handling for Render environment.
 * 
 * USAGE:
 * - Development: node create-admin-fixed.js (uses default email with ADMIN_PASSWORD)
 * - Production: ADMIN_EMAIL=sales@tovably.com ADMIN_USERNAME=tovablyadmin ADMIN_PASSWORD=yourSecurePassword node create-admin-fixed.js
 * 
 * Required Environment Variables:
 * - DATABASE_URL: PostgreSQL connection string 
 * - ADMIN_PASSWORD: Secure password for the admin account
 * 
 * Optional Environment Variables:
 * - ADMIN_EMAIL: Email for the admin account (defaults to sales@tovably.com)
 * - ADMIN_USERNAME: Username for the admin account (defaults to tovablyadmin)
 */

// We now use proper certificate verification instead of disabling it completely.
// The following is the CA certificate for Neon database.

// CommonJS format for better Docker compatibility
const pg = require('pg');
const crypto = require('crypto');
const { scrypt, randomBytes } = crypto;
const { promisify } = require('util');

// Configure PostgreSQL connection
const isRenderPg = process.env.DATABASE_URL?.includes('dpg-');

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL must be set");
  process.exit(1);
}

// The Neon root certificate for proper verification
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
9lQczQUbtP8prPuGZw+JDKjR1D7CXQFecyjhgQhNvgIOvnIWQJOja5nGfMndeMtl
3Cl4vdm/8xOx+G3XGhpZF9JLu3D7wZ2fAzf6NeJ2gClAO1z0qS7+qFuEKIRohwID
AQABo0IwQDAPBgNVHRMBAf8EBTADAQH/MB0GA1UdDgQWBBRXnYGGb/LTCGrVHN1O
hwB4QM0qIDAOBgNVHQ8BAf8EBAMCAoQwDQYJKoZIhvcNAQEMBQADggGBAHLpXQqA
CpxisqQZOE3GXqnSNsIAF/pzv+mIlbFkQZ4LxnJlzrJX6HV0aDnGHnTgcGIPorF9
l7hz8OWvAW5xM0ULBqQgC/RyGzCZRWCLPkzF+uEJMvHDJdJnSKGxiAkAG7+X8eHM
+CmYPvfGS+JRt0Bk1ol9Z8TK/BoSJVZ9YlU3aKrRITwUEjJYrbLh5jW3jYLYHVEL
xkPxc1Oz9VdJ1NKFq9Zz3MQxIxt4VJAVdFdPzLvBxwZGLQmFxuPUIXXMGP6Bvmf+
ij1srbnYRnnPoDFZzGLYzUB7+HZ7ZmHihA4QPA234YAJpCFbeHN3hUkFDZnk2Jnf
teLv0NYMHuYMNW5cYBfqQXn6cOSkVHHfMzGJIRdSVP7S2yJk5EZnijjKWQCjYIXR
O8Bn7+ADUKqbTkZCZJm+dJR2mMKHjSvr/HT0TkF7h/+jzWXcKIwYXZM5GxQ9maCM
CvXrIYjqjQmF9izFZpKYEgiJxKmABu+XRnYFAGHfNQoH8bLQCxnRzw==
-----END CERTIFICATE-----
`;

// Create a pool configuration with proper SSL settings that maintains security
const poolConfig = {
  connectionString: process.env.DATABASE_URL,
  // Secure approach: use the CA certificate for verification
  ssl: {
    rejectUnauthorized: true,
    ca: neonRootCA,
  }
};

console.log(`Creating database connection pool with ${isRenderPg ? 'Render-specific' : 'standard'} configuration`);
const pool = new pg.Pool(poolConfig);
const scryptAsync = promisify(scrypt);

async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const buf = await scryptAsync(password, salt, 64);
  return `${buf.toString("hex")}.${salt}`;
}

async function createAdminUser() {
  try {
    console.log("Testing database connection...");
    const testResult = await pool.query('SELECT NOW()');
    console.log("Database connection successful:", testResult.rows[0]);

    // Get admin credentials from environment variables, with defaults for development
    const adminEmail = process.env.ADMIN_EMAIL || "sales@tovably.com";
    const adminUsername = process.env.ADMIN_USERNAME || "tovablyadmin";
    const securePassword = process.env.ADMIN_PASSWORD;
    
    if (!securePassword) {
      console.error("Error: ADMIN_PASSWORD environment variable must be set");
      process.exit(1);
    }

    // Check if the admin user already exists
    const checkResult = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [adminEmail]
    );

    if (checkResult.rows.length > 0) {
      console.log("Admin user already exists. Updating role to 'admin'...");
      await pool.query(
        "UPDATE users SET role = 'admin' WHERE email = $1",
        [adminEmail]
      );
      console.log("Admin role updated.");
    } else {
      // Create a new admin user
      const hashedPassword = await hashPassword(securePassword);
      
      const result = await pool.query(
        `INSERT INTO users 
        (username, email, password, role, subscription_plan, personas_used, tone_analyses_used, content_generated, campaigns_used, created_at, stripe_customer_id, stripe_subscription_id, subscription_status, subscription_period_end, company, full_name) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) 
        RETURNING id`,
        [
          adminUsername, 
          adminEmail, 
          hashedPassword, 
          "admin", 
          "premium", 
          0, 
          0, 
          0, 
          0,
          new Date(), 
          null, 
          null, 
          null, 
          null,
          "Tovably Ltd",
          "Tovably Admin"
        ]
      );
      
      console.log(`Admin user created with id: ${result.rows[0].id}`);
    }

    console.log("\nYou can now log in with:");
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: ${securePassword}`);
    
  } catch (error) {
    console.error("Error creating admin user:", error);
    console.error("Full error details:", error.stack);
  } finally {
    await pool.end();
  }
}

createAdminUser();