import { pool } from './db';

/**
 * Apply schema updates to ensure database compatibility
 * Run this at startup to ensure the database schema matches the application code
 */
export async function applySchemaPatches() {
  console.log("Checking database schema...");
  
  // Add campaign-related columns if needed
  await ensureCampaignColumns();
  
  // Add campaign factory usage column if needed
  await ensureCampaignFactoryColumn();
}

/**
 * Check if persona_id and tone_analysis_id columns exist in campaigns table
 * Add them if they don't exist
 */
export async function ensureCampaignColumns() {
  const client = await pool.connect();
  try {
    console.log("Checking campaign table schema...");
    
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
      console.log("Adding missing campaign columns...");
      
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
      
      console.log("Campaign schema update complete");
    } else {
      console.log("Campaign schema is up to date");
    }
  } catch (error) {
    console.error("Error during schema check:", error);
  } finally {
    client.release();
  }
}

/**
 * Check if campaign_factory_used column exists in users table
 * Add it if it doesn't exist
 */
export async function ensureCampaignFactoryColumn() {
  const client = await pool.connect();
  try {
    console.log("Checking users table for campaign_factory_used column...");
    
    // Check if campaign_factory_used column exists
    const columnResult = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users' AND column_name = 'campaign_factory_used';
    `);
    
    const hasCampaignFactoryColumn = columnResult.rows.length > 0;
    
    // Add the column if it doesn't exist
    if (!hasCampaignFactoryColumn) {
      console.log("Adding campaign_factory_used column to users table");
      await client.query(`
        ALTER TABLE users
        ADD COLUMN campaign_factory_used INTEGER NOT NULL DEFAULT 0;
      `);
      console.log("Successfully added campaign_factory_used column to users table");
    } else {
      console.log("campaign_factory_used column already exists in users table");
    }
  } catch (error) {
    console.error("Error during campaign factory schema check:", error);
  } finally {
    client.release();
  }
}