# Render Deployment Instructions

## Critical Database Fix

We've made critical fixes to the database connection code to handle Render's self-signed certificates. The key changes:

1. Added `NODE_TLS_REJECT_UNAUTHORIZED='0'` at the top of key server files
2. Fixed SSL configuration to use `{ rejectUnauthorized: false }` for the PostgreSQL connection
3. Created initialization scripts for database tables and admin user

## Setup Steps for Render Deployment

1. **Deploy the latest code to Render**
   - The code now contains critical fixes for Render's environment
   - Make sure the changes to `server/db.ts` and `server/index.ts` are included

2. **Set Environment Variables**
   - Make sure all required environment variables are set in Render
   - Required variables: DATABASE_URL, SESSION_SECRET, OPENAI_API_KEY, STRIPE_SECRET_KEY, VITE_STRIPE_PUBLIC_KEY
   - Optional variables: GMAIL_EMAIL, GMAIL_APP_PASSWORD, SENDGRID_API_KEY

3. **Initialize Database Tables**
   - After deployment, connect to your Render shell and run:
   ```bash
   node -r tsx/register server/init-db.ts
   ```
   - This will create all the necessary database tables

4. **Create Admin User**
   - After tables are created, run the admin user creation script:
   ```bash
   ADMIN_PASSWORD=YourSecurePassword node -r tsx/register create-admin-fixed.js
   ```
   - This will create an admin user with email sales@tovably.com

5. **Verify Deployment**
   - Check the logs to confirm successful database connection
   - Visit your deployed site and attempt to log in with the admin credentials

## Common Issues and Solutions

- **Database Connection Errors**: If you still see database connection errors, verify the DATABASE_URL environment variable is correct
- **Self-signed Certificate Errors**: The code should automatically handle Render's self-signed certificates now
- **Missing Tables**: If tables are missing, run the initialization script as described above

## Production Monitoring

- The application includes health monitoring endpoints at /api/db-health
- Database connections now include retry mechanisms and circuit breakers for reliability
- Connection pools are configured for optimal performance in production

For any emergency issues, the fastest way to recover is to run the initialization scripts through the Render shell.