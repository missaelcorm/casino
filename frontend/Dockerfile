FROM node:18-alpine

WORKDIR /app

RUN apk add --no-cache curl

# Copy package files
COPY package*.json ./

# Copy server.js
COPY server.js ./

# Install dependencies (http-server will be installed)
RUN npm ci --omit=dev && \
    npm cache clean --force

# Copy the public directory (static files to serve)
COPY public ./public

# Copy the environment configuration script
COPY env-config.sh ./

# Make the script executable
RUN chmod +x env-config.sh

# Expose the port the app runs on
EXPOSE 8080

# Run the env-config script which generates env.js and starts http-server
CMD ["./env-config.sh"]
