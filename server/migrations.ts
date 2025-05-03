import { db, pool } from './db';
import { sql } from 'drizzle-orm';

/**
 * Run database migrations that are safe to execute on startup
 * These migrations handle schema differences between development and production
 */
export async function runEmergencyMigrations() {
  console.log("Running emergency database migrations...");
  
  // Check and migrate campaigns table for persona_id column
  await migrateCampaignsPersonaFields();
  await migrateCampaignsUsedColumn();
}

/**
 * For backward compatibility with existing code
 */
export const migrateStripeFields = async () => {
  console.log("Running Stripe fields migration...");
  try {
    const client = await pool.connect();
    
    try {
      // Check if the Stripe columns exist
      const checkResult = await client.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'stripe_customer_id';
      `);
      
      const stripeColumnsExist = checkResult.rows.length > 0;
      
      if (!stripeColumnsExist) {
        console.log("Adding Stripe columns to users table");
        
        // Add Stripe columns
        await client.query(`
          ALTER TABLE users
          ADD COLUMN stripe_customer_id TEXT,
          ADD COLUMN stripe_subscription_id TEXT,
          ADD COLUMN subscription_status TEXT DEFAULT 'inactive',
          ADD COLUMN subscription_period_end TIMESTAMP;
        `);
        
        console.log("Stripe columns added successfully");
      } else {
        console.log("Stripe columns already exist in users table");
      }
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error during Stripe fields migration:", error);
    // Non-fatal error, app can still run without these fields
  }
};

/**
 * For backward compatibility with existing code
 */
export const migrateCampaignsColumn = migrateCampaignsUsedColumn;

/**
 * For backward compatibility with existing code
 */
export const migrateCampaignFields = migrateCampaignsPersonaFields;

/**
 * Check if persona_id and tone_analysis_id columns exist in campaigns table
 * Add them if they don't exist
 */
export async function migrateCampaignsPersonaFields() {
  const client = await pool.connect();
  try {
    console.log("Running campaign fields migration check...");
    
    // Check if persona_id column exists
    const personaResult = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'campaigns' AND column_name = 'persona_id';
    `);
    
    const hasPersonaId = personaResult.rows.length > 0;
    
    // Check if tone_analysis_id column exists
    const toneResult = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'campaigns' AND column_name = 'tone_analysis_id';
    `);
    
    const hasToneAnalysisId = toneResult.rows.length > 0;
    
    // Add missing columns if needed
    if (!hasPersonaId || !hasToneAnalysisId) {
      console.log("Missing campaign field columns detected. Running migration...");
      
      if (!hasPersonaId) {
        console.log("Adding persona_id column to campaigns table");
        await client.query(`
          ALTER TABLE campaigns 
          ADD COLUMN persona_id INTEGER REFERENCES personas(id);
        `);
      }
      
      if (!hasToneAnalysisId) {
        console.log("Adding tone_analysis_id column to campaigns table");
        await client.query(`
          ALTER TABLE campaigns 
          ADD COLUMN tone_analysis_id INTEGER REFERENCES tone_analyses(id);
        `);
      }
      
      console.log("Campaign field migration complete");
    } else {
      console.log("Campaign fields already added, skipping migration");
    }
  } catch (error) {
    console.error("Error during campaign fields migration:", error);
    // Non-fatal error, app can still run without these fields
  } finally {
    client.release();
  }
}

/**
 * Run migration to ensure campaigns_used column exists in users table
 */
export async function migrateCampaignsUsedColumn() {
  const client = await pool.connect();
  try {
    console.log("Running campaigns_used column migration check...");
    
    // Check if campaigns_used column exists
    const result = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users' AND column_name = 'campaigns_used';
    `);
    
    const hasCampaignsUsed = result.rows.length > 0;
    
    if (!hasCampaignsUsed) {
      console.log("Adding campaigns_used column to users table");
      await client.query(`
        ALTER TABLE users 
        ADD COLUMN campaigns_used INTEGER DEFAULT 0 NOT NULL;
      `);
      console.log("campaigns_used column added successfully");
    } else {
      console.log("The campaigns_used column already exists - no migration needed");
    }
  } catch (error) {
    console.error("Error during campaigns_used column migration:", error);
    // Non-fatal error, app can still run without this field
  } finally {
    client.release();
    console.log("Emergency column migration complete.");
  }
}