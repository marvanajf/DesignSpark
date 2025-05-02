import { sql } from 'drizzle-orm';
import { db, pool } from './db';

export async function migrateCampaignsColumn() {
  console.log('Running campaigns_used column migration check...');
  
  try {
    // Check if campaigns_used column exists
    const checkResult = await db.execute(sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users' AND column_name = 'campaigns_used'
    `);
    
    if (checkResult.rows && checkResult.rows.length > 0) {
      console.log('The campaigns_used column already exists - no migration needed');
      return;
    }
    
    // Add the missing column
    console.log('Column is missing, adding campaigns_used column to users table...');
    await db.execute(sql`
      ALTER TABLE users
      ADD COLUMN campaigns_used INTEGER NOT NULL DEFAULT 0
    `);
    
    console.log('Successfully added campaigns_used column to users table.');
    
    // Verify the column was added
    const verifyResult = await db.execute(sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users' AND column_name = 'campaigns_used'
    `);
    
    if (verifyResult.rows && verifyResult.rows.length > 0) {
      console.log('Verification successful: campaigns_used column exists.');
    } else {
      console.error('Verification failed: campaigns_used column was not added.');
    }
  } catch (error) {
    console.error('Error during campaigns_used column migration:', error);
    throw error;
  }
}