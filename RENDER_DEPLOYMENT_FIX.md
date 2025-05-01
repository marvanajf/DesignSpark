# Tovably Deployment Solutions for Render

## Recommended Approach: Docker Deployment (Easiest)

We now **strongly recommend** using Docker for Render deployment. The Docker setup:

1. **Automatically creates database tables** on startup
2. **Automatically creates admin user** with no manual steps
3. **Properly handles SSL certificates** with no errors
4. Creates a **consistent environment** between development and production

**To deploy with Docker, follow the instructions in: [RENDER_DOCKER_SETUP.md](./RENDER_DOCKER_SETUP.md)**

## Alternative Approach: Manual Deployment Fix

If you prefer not to use Docker, follow these manual steps when deploying directly to Render:

### Problem 1: Self-Signed Certificate Verification Errors

This manifests as errors like:
```
Error [0]: Error: no pg_hba.conf entry for host "123.456.78.90", user "xxxxx", database "neondb", no encryption
Error [1]: Error: self-signed certificate
```

**Solution:**
1. Add environment variable in Render dashboard:
   - Key: `NODE_TLS_REJECT_UNAUTHORIZED`
   - Value: `0`
2. Redeploy your application

### Problem 2: "Relation does not exist" Errors

This appears in logs as:
```
Error [0]: Error: relation "users" does not exist
```

**Solution:**
1. In Render dashboard, go to "Shell"
2. Run: `node -r tsx/register server/init-db.ts`
3. Restart your web service

### Problem 3: Creating Admin User

**Solution:**
1. In Render shell, run:
   ```
   ADMIN_PASSWORD=YourSecurePasswordHere node -r tsx/register create-admin-fixed.js
   ```
2. This creates an admin user (default: `sales@tovably.com` / `tovablyadmin`)

## Verification

After applying fixes:
1. Restart your Render service
2. Navigate to your application URL
3. Log in with admin credentials
4. Verify all features work correctly

## Why Docker is Better

The Docker approach solves all these issues automatically in a single deployment:

- **No manual database initialization** - tables created automatically
- **No manual admin user creation** - admin user created on first start
- **No certificate errors** - SSL issues handled by container
- **Simplified deployment** - just push code and deploy
- **Consistent environment** - same setup in all environments

We highly recommend switching to Docker deployment for the best experience.