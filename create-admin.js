/**
 * Admin Account Creation Script
 * 
 * This script creates an admin user account for the Tovably application.
 * 
 * USAGE:
 * - Development: node create-admin.js (uses default email with ADMIN_PASSWORD)
 * - Production: ADMIN_EMAIL=sales@tovably.com ADMIN_USERNAME=tovablyadmin ADMIN_PASSWORD=yourSecurePassword node create-admin.js
 * 
 * Required Environment Variables:
 * - DATABASE_URL: PostgreSQL connection string 
 * - ADMIN_PASSWORD: Secure password for the admin account
 * 
 * Optional Environment Variables:
 * - ADMIN_EMAIL: Email for the admin account (defaults to sales@tovably.com)
 * - ADMIN_USERNAME: Username for the admin account (defaults to tovablyadmin)
 */

import { Pool, neonConfig } from '@neondatabase/serverless';
import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';
import ws from 'ws';

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL must be set");
  process.exit(1);
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const scryptAsync = promisify(scrypt);

async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const buf = await scryptAsync(password, salt, 64);
  return `${buf.toString("hex")}.${salt}`;
}

async function createAdminUser() {
  try {
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
      console.log("Production admin user already exists. Updating role to 'admin'...");
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
        (username, email, password, role, subscription_plan, personas_used, tone_analyses_used, content_generated, created_at, stripe_customer_id, stripe_subscription_id, subscription_status, subscription_period_end, company, full_name) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) 
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
          new Date(), 
          null, 
          null, 
          null, 
          null,
          "Tovably Ltd",
          "Tovably Admin"
        ]
      );
      
      console.log(`Production admin user created with id: ${result.rows[0].id}`);
    }

    console.log("\nYou can now log in with:");
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: ${securePassword}`);
    
  } catch (error) {
    console.error("Error creating admin user:", error);
  } finally {
    await pool.end();
  }
}

createAdminUser();