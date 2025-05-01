FROM node:20-slim

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY . .

# Disable certificate verification for Render compatibility
ENV NODE_TLS_REJECT_UNAUTHORIZED=0

# Set up entrypoint script
RUN echo '#!/bin/bash\n\
# Create database tables\n\
echo "Creating database tables..."\n\
node -r tsx/register server/init-db.ts\n\
\n\
# Create admin user if ADMIN_PASSWORD is set\n\
if [ -n "$ADMIN_PASSWORD" ]; then\n\
  echo "Creating admin user..."\n\
  node -r tsx/register create-admin-fixed.js\n\
fi\n\
\n\
# Start the application\n\
echo "Starting application..."\n\
npm run start\n\
' > /app/entrypoint.sh && chmod +x /app/entrypoint.sh

# Add start script to package.json if it doesn't exist
RUN if ! grep -q "\"start\":" package.json; then \
    sed -i 's/"scripts": {/"scripts": {\n    "start": "NODE_ENV=production tsx server\/index.ts",/' package.json; \
    fi

EXPOSE 5000

CMD ["/app/entrypoint.sh"]