import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { sql } from 'drizzle-orm';

export async function migrateCampaignFields(pool: Pool) {
  const db = drizzle(pool);
  console.log('Running campaign fields migration...');

  try {
    // Check if the status_display column already exists
    const checkStatusDisplayResult = await db.execute(sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'campaigns' AND column_name = 'status_display'
    `);

    if (checkStatusDisplayResult.length === 0) {
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

      // Convert existing status column to use the enum type
      await db.execute(sql`
        ALTER TABLE campaigns 
        ALTER COLUMN status TYPE campaign_status USING status::campaign_status;
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