import { pool, db } from './db';
import { sql } from 'drizzle-orm';

async function migrateCampaignFactory() {
  console.log('Running Campaign Factory Migration Script');
  
  try {
    // Check if the campaign_factory_campaigns table already exists
    const tableCheck = await db.execute(sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'campaign_factory_campaigns'
      ) as "exists";
    `);
    
    const tableExists = tableCheck.rows && tableCheck.rows[0] ? tableCheck.rows[0].exists : false;
    
    if (tableExists) {
      console.log('campaign_factory_campaigns table already exists, skipping creation.');
    } else {
      console.log('Creating campaign_factory_campaigns table...');
      
      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS "campaign_factory_campaigns" (
          "id" SERIAL PRIMARY KEY,
          "user_id" INTEGER NOT NULL REFERENCES "users"("id"),
          "name" TEXT NOT NULL,
          "description" TEXT,
          "objective" TEXT,
          "target_audience" JSONB,
          "channels" JSONB,
          "timeline_start" TEXT,
          "timeline_end" TEXT,
          "contents" JSONB,
          "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
          "updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
        )
      `);
      
      console.log('campaign_factory_campaigns table created successfully.');
    }
    
    // Check if the users table has campaign_factory_used column
    const columnCheck = await db.execute(sql`
      SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'campaign_factory_used'
      ) as "exists";
    `);
    
    const columnExists = columnCheck.rows && columnCheck.rows[0] ? columnCheck.rows[0].exists : false;
    
    if (columnExists) {
      console.log('campaign_factory_used column already exists in users table, skipping addition.');
    } else {
      console.log('Adding campaign_factory_used column to users table...');
      
      await db.execute(sql`
        ALTER TABLE "users" 
        ADD COLUMN IF NOT EXISTS "campaign_factory_used" INTEGER NOT NULL DEFAULT 0
      `);
      
      console.log('campaign_factory_used column added to users table successfully.');
    }
    
    console.log('Campaign Factory migration completed successfully!');
    await pool.end();
    return true;
  } catch (error) {
    console.error('Error during Campaign Factory migration:', error);
    await pool.end();
    return false;
  }
}

// Run the migration function
migrateCampaignFactory()
  .then(success => {
    if (success) {
      process.exit(0);
    } else {
      process.exit(1);
    }
  })
  .catch(err => {
    console.error('Fatal error during Campaign Factory migration:', err);
    process.exit(1);
  });