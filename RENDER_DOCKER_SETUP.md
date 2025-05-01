# Tovably Docker Deployment Guide for Render

This guide explains how to deploy Tovably using Docker on Render, solving the database initialization issues for a reliable, consistent setup.

## Why Docker for Tovably?

The Docker-based deployment solves several critical issues:

1. **Automatic Database Initialization**: Tables are created on startup
2. **SSL Certificate Handling**: No more certificate errors with Render's PostgreSQL
3. **Reliable Admin Creation**: Admin user automatically created at startup
4. **Consistent Environment**: Same environment in development and production
5. **Simplified Deployment**: No need for manual database initialization steps

## Deployment Steps

### 1. Push Code to GitHub

Ensure your repository includes:
- `Dockerfile` - Container configuration
- `.dockerignore` - Excludes unnecessary files
- All application code

### 2. Create a Render Web Service

1. Go to the Render dashboard: https://dashboard.render.com/
2. Click "New" and select "Web Service"
3. Connect your GitHub repository
4. Choose the repository with your Tovably code

### 3. Configure Web Service Settings

- **Name**: Tovably (or your preferred name)
- **Runtime**: Docker
- **Branch**: main (or your preferred branch)
- **Root Directory**: (leave blank)
- **Instance Type**: Standard (512 MB) or higher recommended
- **Region**: Choose closest to your location
- **Auto-Deploy**: Enabled (recommended)

### 4. Set Environment Variables

These variables are required for proper operation:

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection URL | postgres://user:pass@host:port/db?sslmode=require |
| `SESSION_SECRET` | For securing sessions | any-random-secure-string |
| `OPENAI_API_KEY` | OpenAI API key | sk-abc123... |
| `STRIPE_SECRET_KEY` | Stripe secret key | sk_test_123abc... |
| `VITE_STRIPE_PUBLIC_KEY` | Stripe publishable key | pk_test_123abc... |
| `ADMIN_PASSWORD` | Password for admin user | your-secure-password |
| `NODE_TLS_REJECT_UNAUTHORIZED` | SSL verification control | 0 |

**Optional variables:**
| Variable | Description | Default |
|----------|-------------|---------|
| `ADMIN_EMAIL` | Admin user email | sales@tovably.com |
| `ADMIN_USERNAME` | Admin username | tovablyadmin |
| `SENDGRID_API_KEY` | For SendGrid email service | - |
| `GMAIL_EMAIL` | For Gmail email service | - |
| `GMAIL_APP_PASSWORD` | Gmail app password | - |

### 5. Deploy Your Service

1. Click "Create Web Service"
2. Wait for the build and deployment to complete (~5 minutes)
3. Once deployed, your app will be available at your Render URL
4. Log in with the admin credentials (username: tovablyadmin by default)

## What Happens During Deployment

The Docker container automatically:

1. **Installs Dependencies**: All required packages are installed
2. **Creates Database Tables**: Runs the initialization script to create all tables
3. **Creates Admin User**: Sets up an admin user with your specified password
4. **Configures SSL**: Properly handles SSL connections to PostgreSQL
5. **Starts Application**: Launches the app in production mode

## Monitoring and Troubleshooting

### Checking Logs

1. Go to your Render dashboard
2. Select your Tovably web service
3. Click on the "Logs" tab
4. Look for any error messages

### Common Issues and Solutions

| Issue | Solution |
|-------|----------|
| Database connection errors | Verify DATABASE_URL is correct and accessible from Render |
| Admin user not created | Ensure ADMIN_PASSWORD is set in environment variables |
| OpenAI features not working | Check that OPENAI_API_KEY is valid and has sufficient credits |
| Stripe features not working | Verify STRIPE_SECRET_KEY and VITE_STRIPE_PUBLIC_KEY are correct |

### Testing Your Deployment

1. Navigate to your Render app URL
2. Log in with admin credentials
3. Test all major features:
   - Tone analysis
   - Persona creation
   - Content generation
   - User management
   - Subscription functions

## Updating Your Deployment

When you push changes to your GitHub repository, Render will automatically rebuild and redeploy your application.

The Docker container will:
1. Pull your latest code
2. Rebuild the application
3. Run database initialization again (safely)
4. Start the updated application

## Need Help?

If you encounter any issues with your Docker deployment:

1. Check Render logs for specific error messages
2. Verify all environment variables are correctly set
3. Ensure your database is accessible from Render
4. Check that your API keys (OpenAI, Stripe) are valid and active