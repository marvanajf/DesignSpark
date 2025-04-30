import { db } from './db';
import { sql } from 'drizzle-orm';

// Add Stripe-related columns to users table
export async function migrateStripeFields() {
  try {
    console.log('Running Stripe fields migration...');
    
    // Check if stripe_customer_id column exists
    const columnsResult = await db.execute(sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users' AND column_name = 'stripe_customer_id'
    `);
    
    // If the column doesn't exist, add all Stripe-related columns
    if (columnsResult.rows.length === 0) {
      await db.execute(sql`
        ALTER TABLE users
        ADD COLUMN stripe_customer_id TEXT,
        ADD COLUMN stripe_subscription_id TEXT,
        ADD COLUMN subscription_status TEXT DEFAULT 'inactive',
        ADD COLUMN subscription_period_end TIMESTAMP
      `);
      console.log('Added Stripe columns to users table');
    } else {
      console.log('Stripe columns already exist in users table');
    }
    
    return true;
  } catch (error) {
    console.error('Error during Stripe fields migration:', error);
    return false;
  }
}