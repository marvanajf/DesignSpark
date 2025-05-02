/**
 * Emergency Migration Script for Missing campaigns_used Column
 * 
 * This script adds the missing campaigns_used column to the users table.
 * Run this on your production database to fix the missing column.
 * 
 * Usage: node server/migrate-campaigns-column.js
 * 
 * Required Environment Variables:
 * - DATABASE_URL: PostgreSQL connection string
 */

// CommonJS format for better Docker compatibility
const pg = require('pg');
const crypto = require('crypto');
const { randomBytes } = crypto;

// Configure PostgreSQL connection with proper SSL settings
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

// Pool configuration with proper SSL settings
const poolConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: true,
    ca: neonRootCA,
  }
};

const pool = new pg.Pool(poolConfig);

// Function to safely execute SQL with retries
async function executeWithRetry(sql, params = [], maxRetries = 3) {
  let lastError;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await pool.query(sql, params);
    } catch (error) {
      console.error(`Database operation failed (attempt ${attempt}/${maxRetries}): ${error.message}`);
      lastError = error;
      
      if (attempt < maxRetries) {
        const delay = attempt * 1000; // Exponential backoff
        console.error(`Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw new Error(`Database operation failed after ${maxRetries} attempts: ${lastError.message}`);
}

async function addCampaignsUsedColumn() {
  try {
    console.log("Testing database connection...");
    const testResult = await executeWithRetry('SELECT NOW()');
    console.log("Database connection successful:", testResult.rows[0]);

    // Check if campaigns_used column exists
    console.log("Checking if campaigns_used column exists...");
    const checkResult = await executeWithRetry(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users' AND column_name = 'campaigns_used'
    `);
    
    if (checkResult.rows.length > 0) {
      console.log("The campaigns_used column already exists.");
      return true;
    }
    
    // Add the missing column
    console.log("Adding campaigns_used column to users table...");
    await executeWithRetry(`
      ALTER TABLE users
      ADD COLUMN campaigns_used INTEGER NOT NULL DEFAULT 0
    `);
    
    console.log("Successfully added campaigns_used column to users table.");
    
    // Verify the column was added
    const verifyResult = await executeWithRetry(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users' AND column_name = 'campaigns_used'
    `);
    
    if (verifyResult.rows.length > 0) {
      console.log("Verification successful: campaigns_used column exists.");
      return true;
    } else {
      console.error("Verification failed: campaigns_used column was not added.");
      return false;
    }
  } catch (error) {
    console.error("Error updating database:", error);
    console.error("Full error details:", error.stack);
    return false;
  } finally {
    await pool.end();
    console.log("Database connection closed.");
  }
}

// Run the migration function
addCampaignsUsedColumn()
  .then(success => {
    if (success) {
      console.log("Migration completed successfully!");
      process.exit(0);
    } else {
      console.error("Migration failed!");
      process.exit(1);
    }
  })
  .catch(err => {
    console.error("Migration failed with error:", err);
    process.exit(1);
  });