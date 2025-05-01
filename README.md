# Tovably - AI-Powered SaaS for Professional Communication

Tovably is an AI-native SaaS platform revolutionizing professional communication through intelligent content generation, advanced writing assistance, and smart workflow optimization.

## Features

- 🧠 **AI-Powered Tone Analysis**: Analyze your written content to understand its tone and characteristics
- 👤 **Persona Creation**: Create and manage targeted audience personas for tailored content
- ✍️ **Content Generation**: Generate professional content optimized for specific audiences and platforms
- 📊 **Admin Dashboard**: Comprehensive analytics and user management
- 💳 **Subscription Management**: Tiered subscription plans with Stripe integration
- 📱 **Responsive Design**: Beautiful user experience across all devices

## Technology Stack

- **Frontend**: React.js, TypeScript, Tailwind CSS, Shadcn UI
- **Backend**: Express.js, Node.js
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Passport.js with secure session management
- **AI Integration**: OpenAI GPT-4 API
- **Payments**: Stripe for subscription management
- **Email**: SendGrid/Gmail integration

## Deployment Options

### Option 1: Docker Deployment (Recommended)

The simplest and most reliable way to deploy Tovably is using Docker on Render:

1. Follow the detailed instructions in [RENDER_DOCKER_SETUP.md](./RENDER_DOCKER_SETUP.md)
2. Docker automatically handles database initialization, SSL issues, and admin user creation

### Option 2: Manual Deployment

If you prefer not to use Docker:

1. Deploy directly to Render or your preferred hosting platform
2. Follow the manual fix instructions in [RENDER_DEPLOYMENT_FIX.md](./RENDER_DEPLOYMENT_FIX.md) if you encounter issues

## Local Development

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Configure environment variables (see `.env.example`)
4. Initialize the database:
   ```
   npm run db:push
   ```
5. Start the development server:
   ```
   npm run dev
   ```

## Environment Variables

The following environment variables are required:

- `DATABASE_URL`: PostgreSQL connection string
- `SESSION_SECRET`: Secret for session encryption
- `OPENAI_API_KEY`: OpenAI API key
- `STRIPE_SECRET_KEY`: Stripe secret key
- `VITE_STRIPE_PUBLIC_KEY`: Stripe publishable key

## Admin Account Setup

An admin account can be created using:

```
ADMIN_PASSWORD=YourSecurePassword node -r tsx/register create-admin-fixed.js
```

Default admin credentials:
- Email: sales@tovably.com
- Username: tovablyadmin
- Password: (as specified in ADMIN_PASSWORD)

## License

This project is proprietary software. All rights reserved.

## Support

For support or inquiries, please contact sales@tovably.com