# Empirica Cybersecurity Experiment - Docker Image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    git

# Copy all files first (Empirica needs full structure)
COPY . .

# Install server dependencies
WORKDIR /app/server
RUN npm ci --only=production

# Build server
RUN npm run build

# Install client dependencies
WORKDIR /app/client
RUN npm ci --only=production

# Build client
RUN npm run build

# Back to root
WORKDIR /app

# Expose Empirica default port
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Start Empirica server
CMD ["node", "server/dist/index.js"]
