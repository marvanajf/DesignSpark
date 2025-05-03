import { pool } from './db';

/**
 * Apply schema updates to ensure database compatibility
 * Run this at startup to ensure the database schema matches the application code
 */
export async function applySchemaPatches() {
  console.log("Checking database schema...");
  
  // Add campaign-related columns if needed
  await ensureCampaignColumns();
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