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
tsx server/init-db.ts\n\
\n\
# Create admin user if ADMIN_PASSWORD is set\n\
if [ -n "$ADMIN_PASSWORD" ]; then\n\
  echo "Creating admin user..."\n\
  tsx create-admin-fixed.js\n\
fi\n\
\n\
# Start the application\n\
echo "Starting application..."\n\
NODE_ENV=production tsx server/index.ts\n\
' > /app/entrypoint.sh && chmod +x /app/entrypoint.sh

# Make sure TSX is installed globally
RUN npm install -g tsx

# Port 5000 is used by the server
ENV PORT=5000
EXPOSE 5000

CMD ["/app/entrypoint.sh"]