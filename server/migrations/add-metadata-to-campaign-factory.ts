import { pool } from "../db";

export async function addMetadataToFactoryCampaign() {
  console.log("Checking campaign_factory_campaigns table for metadata column...");

  try {
    // Check if metadata column already exists
    const checkResult = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'campaign_factory_campaigns' 
      AND column_name = 'metadata';
    `);

    if (checkResult.rows.length === 0) {
      console.log("Adding metadata column to campaign_factory_campaigns table...");
      
      // Add the metadata column
      await pool.query(`
        ALTER TABLE campaign_factory_campaigns
        ADD COLUMN IF NOT EXISTS metadata JSONB;
      `);
      
      console.log("metadata column added to campaign_factory_campaigns table successfully");
    } else {
      console.log("metadata column already exists in campaign_factory_campaigns table");
    }
    
  } catch (error) {
    console.error('Error adding metadata column to campaign_factory_campaigns table:', error);
    throw error;
  }
}