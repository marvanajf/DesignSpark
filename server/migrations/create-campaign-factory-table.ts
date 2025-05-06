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
      
      // Check if tone_profile column exists in the table
      const columnExists = await db.execute(sql`
        SELECT EXISTS (
          SELECT FROM information_schema.columns 
          WHERE table_name = 'campaign_factory_campaigns' 
          AND column_name = 'tone_profile'
        );
      `);
      
      if (columnExists.rows[0] && columnExists.rows[0].exists === false) {
        console.log('Adding tone_profile column to campaign_factory_campaigns table');
        
        // Add the tone_profile column to the existing table
        await db.execute(sql`
          ALTER TABLE campaign_factory_campaigns 
          ADD COLUMN tone_profile JSONB;
        `);
        
        console.log('tone_profile column added successfully');
      } else {
        console.log('tone_profile column already exists');
      }
      
      return;
    }
    
    // Create campaign_factory_campaigns table with tone_profile column
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