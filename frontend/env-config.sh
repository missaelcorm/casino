#!/bin/sh

# Generate env.js with runtime environment variables
# This script runs at container startup to inject runtime configuration

ENV_FILE="/app/public/env.js"

# Use default value if API_BASE_URL is not set
API_URL="${API_BASE_URL:-http://localhost:3000/api}"

echo "Generating env.js with API_BASE_URL: $API_URL"

# Create the env.js file
cat > $ENV_FILE << EOF
// Runtime environment configuration
// This file is generated at container startup
window.ENV = {
    API_BASE_URL: '${API_URL}'
};
EOF

echo "Environment configuration complete"

# Start the http-server (without auto-open to avoid # in URL)
exec node server.js