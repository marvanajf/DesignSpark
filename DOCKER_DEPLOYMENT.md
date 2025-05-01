# Docker Deployment Instructions

## Building and Deploying with Docker

1. **Build the Docker image:**
   ```bash
   docker build -t tovably-app .
   ```

2. **Run the Docker container:**
   ```bash
   docker run -p 5000:5000 \
     -e DATABASE_URL="your-database-url" \
     -e SESSION_SECRET="your-session-secret" \
     -e OPENAI_API_KEY="your-openai-key" \
     -e STRIPE_SECRET_KEY="your-stripe-secret" \
     -e VITE_STRIPE_PUBLIC_KEY="your-stripe-public" \
     -e ADMIN_PASSWORD="your-admin-password" \
     tovably-app
   ```

3. **For Render deployment with Docker:**
   - Push your code to GitHub with the Dockerfile
   - In Render dashboard, create a new Web Service
   - Choose "Build and deploy from a Git repository"
   - Select your repository
   - Choose "Docker" as the Runtime
   - Add all your environment variables
   - Set Root Directory to / (or leave empty)
   - Deploy!

## Docker Benefits

1. **Automatic Table Creation:**
   - The Docker setup automatically creates database tables on startup
   - No need to run separate initialization scripts

2. **Admin User Creation:**
   - Automatically creates admin user when ADMIN_PASSWORD is provided
   - Email defaults to sales@tovably.com

3. **Consistent Environment:**
   - Same environment in development and production
   - All SSL certificate issues are handled automatically

## Environment Variables

Required variables:
- `DATABASE_URL`: Your PostgreSQL connection string
- `SESSION_SECRET`: Secret for session encryption
- `OPENAI_API_KEY`: Your OpenAI API key
- `STRIPE_SECRET_KEY`: Your Stripe secret key
- `VITE_STRIPE_PUBLIC_KEY`: Your Stripe public key
- `ADMIN_PASSWORD`: Password for the admin user

Optional variables:
- `ADMIN_EMAIL`: Email for admin (default: sales@tovably.com)
- `ADMIN_USERNAME`: Username for admin (default: tovablyadmin)
- `GMAIL_EMAIL`: For Gmail email service
- `GMAIL_APP_PASSWORD`: For Gmail email service
- `SENDGRID_API_KEY`: For SendGrid email service