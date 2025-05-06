import { db } from '../db';
import { sql } from 'drizzle-orm';

export async function createCampaignFactoryTable() {
  console.log('Creating campaign_factory_campaigns table...');
  
  try {
    // Check if table exists
    const tableExists = await db.execute(sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'campaign_factory_campaigns'
      );
    `);
    
    if (tableExists.rows[0] && tableExists.rows[0].exists === true) {
      console.log('campaign_factory_campaigns table already exists');
      return;
    }
    
    // Create campaign_factory_campaigns table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS campaign_factory_campaigns (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        name TEXT NOT NULL,
        description TEXT,
        objective TEXT,
        target_audience JSONB,
        channels JSONB,
        timeline_start TEXT,
        timeline_end TEXT,
        contents JSONB,
        tone_profile JSONB,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);
    
    console.log('campaign_factory_campaigns table created successfully');
  } catch (error) {
    console.error('Error creating campaign_factory_campaigns table:', error);
    throw error;
  }
}