// EMERGENCY DATABASE INITIALIZATION FOR RENDER
// This script will initialize the database schema directly
// when the normal drizzle-kit push is not working

// We now use proper certificate verification with the Neon CA certificate
// instead of disabling certificate verification.

import { pool, db } from './db';
import * as schema from '../shared/schema';
import { sql } from 'drizzle-orm';

async function initializeDatabase() {
  console.log('🔥 EMERGENCY DATABASE INITIALIZATION SCRIPT 🔥');
  console.log('Creating database tables directly...');
  
  try {
    // USER TABLE
    console.log('Creating users table...');
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "users" (
        "id" SERIAL PRIMARY KEY,
        "username" TEXT UNIQUE,
        "email" TEXT NOT NULL UNIQUE,
        "password" TEXT NOT NULL,
        "full_name" TEXT NOT NULL,
        "company" TEXT NOT NULL,
        "role" TEXT NOT NULL DEFAULT 'user',
        "subscription_plan" TEXT NOT NULL DEFAULT 'free',
        "personas_used" INTEGER NOT NULL DEFAULT 0,
        "tone_analyses_used" INTEGER NOT NULL DEFAULT 0,
        "content_generated" INTEGER NOT NULL DEFAULT 0,
        "campaigns_used" INTEGER NOT NULL DEFAULT 0,
        "stripe_customer_id" TEXT,
        "stripe_subscription_id" TEXT,
        "subscription_status" TEXT DEFAULT 'inactive',
        "subscription_period_end" TIMESTAMP,
        "created_at" TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);
    
    // TONE ANALYSES TABLE
    console.log('Creating tone_analyses table...');
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "tone_analyses" (
        "id" SERIAL PRIMARY KEY,
        "user_id" INTEGER NOT NULL REFERENCES "users"("id"),
        "name" TEXT,
        "website_url" TEXT,
        "sample_text" TEXT,
        "tone_results" JSONB,
        "created_at" TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);
    
    // PERSONAS TABLE
    console.log('Creating personas table...');
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "personas" (
        "id" SERIAL PRIMARY KEY,
        "user_id" INTEGER NOT NULL REFERENCES "users"("id"),
        "name" TEXT NOT NULL,
        "description" TEXT,
        "interests" JSONB,
        "is_selected" BOOLEAN DEFAULT false,
        "created_at" TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);
    
    // GENERATED CONTENT TABLE
    console.log('Creating generated_content table...');
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "generated_content" (
        "id" SERIAL PRIMARY KEY,
        "user_id" INTEGER NOT NULL REFERENCES "users"("id"),
        "type" TEXT NOT NULL,
        "content_text" TEXT NOT NULL,
        "persona_id" INTEGER REFERENCES "personas"("id"),
        "tone_analysis_id" INTEGER REFERENCES "tone_analyses"("id"),
        "topic" TEXT,
        "further_details" TEXT,
        "created_at" TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);
    
    // BLOG CATEGORIES TABLE
    console.log('Creating blog_categories table...');
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "blog_categories" (
        "id" SERIAL PRIMARY KEY,
        "name" TEXT NOT NULL UNIQUE,
        "slug" TEXT NOT NULL UNIQUE,
        "created_at" TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);
    
    // BLOG POSTS TABLE
    console.log('Creating blog_posts table...');
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "blog_posts" (
        "id" SERIAL PRIMARY KEY,
        "title" TEXT NOT NULL,
        "slug" TEXT NOT NULL UNIQUE,
        "excerpt" TEXT,
        "content" TEXT NOT NULL,
        "author_id" INTEGER NOT NULL REFERENCES "users"("id"),
        "category_id" INTEGER REFERENCES "blog_categories"("id"),
        "featured_image" TEXT,
        "published" BOOLEAN NOT NULL DEFAULT false,
        "publish_date" TIMESTAMP,
        "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);
    
    // CAMPAIGNS TABLE
    console.log('Creating campaigns table...');
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "campaigns" (
        "id" SERIAL PRIMARY KEY,
        "user_id" INTEGER NOT NULL REFERENCES "users"("id"),
        "name" TEXT NOT NULL,
        "description" TEXT,
        "status" TEXT NOT NULL DEFAULT 'active',
        "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);
    
    // CAMPAIGN CONTENTS TABLE
    console.log('Creating campaign_contents table...');
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "campaign_contents" (
        "id" SERIAL PRIMARY KEY,
        "campaign_id" INTEGER NOT NULL REFERENCES "campaigns"("id"),
        "content_id" INTEGER NOT NULL REFERENCES "generated_content"("id"),
        "created_at" TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);
    
    // LEAD CONTACTS TABLE
    console.log('Creating lead_contacts table...');
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "lead_contacts" (
        "id" SERIAL PRIMARY KEY,
        "name" TEXT NOT NULL,
        "email" TEXT NOT NULL,
        "company" TEXT,
        "message" TEXT NOT NULL,
        "status" TEXT NOT NULL DEFAULT 'new',
        "notes" TEXT,
        "created_at" TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);
    
    // SESSION TABLE (for connect-pg-simple)
    console.log('Creating session table...');
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "session" (
        "sid" varchar NOT NULL COLLATE "default",
        "sess" json NOT NULL,
        "expire" timestamp(6) NOT NULL,
        CONSTRAINT "session_pkey" PRIMARY KEY ("sid")
      )
    `);
    
    console.log('Database initialization completed successfully!');
    
    // Close the connection
    await pool.end();
    
    console.log('Database connection closed.');
    return true;
  } catch (error) {
    console.error('Error initializing database:', error);
    await pool.end();
    return false;
  }
}

// Run the initialization function
initializeDatabase()
  .then(success => {
    if (success) {
      process.exit(0);
    } else {
      process.exit(1);
    }
  })
  .catch(err => {
    console.error('Fatal error during database initialization:', err);
    process.exit(1);
  });