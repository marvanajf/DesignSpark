import { sql } from 'drizzle-orm';
import { db } from './db';

export async function migrateCampaignFields() {
  console.log('Running campaign fields migration...');

  try {
    // Check if the status_display column already exists
    const checkStatusDisplayResult = await db.execute(sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'campaigns' AND column_name = 'status_display'
    `);

    // Check if we have any results
    const hasStatusDisplay = (checkStatusDisplayResult.rows && checkStatusDisplayResult.rows.length > 0);
    
    if (!hasStatusDisplay) {
      console.log('Adding new campaign fields...');
      
      // Create campaign_status enum if it doesn't exist
      await db.execute(sql`
        DO $$
        BEGIN
          IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'campaign_status') THEN
            CREATE TYPE campaign_status AS ENUM ('draft', 'active', 'planning', 'running', 'completed', 'archived');
          END IF;
        END$$;
      `);

      // Add new columns to the campaigns table
      await db.execute(sql`
        ALTER TABLE campaigns
        ADD COLUMN IF NOT EXISTS status_display TEXT NOT NULL DEFAULT 'Draft',
        ADD COLUMN IF NOT EXISTS personas_count INTEGER NOT NULL DEFAULT 0,
        ADD COLUMN IF NOT EXISTS content_count INTEGER NOT NULL DEFAULT 0,
        ADD COLUMN IF NOT EXISTS channels_count INTEGER NOT NULL DEFAULT 0,
        ADD COLUMN IF NOT EXISTS start_date TIMESTAMP,
        ADD COLUMN IF NOT EXISTS end_date TIMESTAMP;
      `);

      // Update the default status for new columns instead of converting existing ones
      await db.execute(sql`
        ALTER TABLE campaigns 
        ADD COLUMN IF NOT EXISTS status_enum campaign_status NOT NULL DEFAULT 'draft';
      `);

      console.log('Campaign fields migration completed successfully');
    } else {
      console.log('Campaign fields already added, skipping migration');
    }
  } catch (error) {
    console.error('Error in campaign fields migration:', error);
    throw error;
  }
}