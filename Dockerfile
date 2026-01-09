# Build stage - use full Node.js image for building
FROM node:20 AS builder

# Set working directory
WORKDIR /app

# Install rsync for server build
RUN apt-get update && apt-get install -y rsync && rm -rf /var/lib/apt/lists/*

# Copy all files
COPY . .

# Build server
WORKDIR /app/server
RUN npm install --force
RUN npm rebuild
RUN npm run build

# Build client
WORKDIR /app/client
RUN npm install --force
RUN npm rebuild
RUN npm run build

# Production stage - use Alpine for smaller image
FROM node:20-alpine

WORKDIR /app

# Install build dependencies for native modules
RUN apk add --no-cache python3 make g++

# Copy built files from builder
COPY --from=builder /app/server/dist /app/server/dist
COPY --from=builder /app/server/package*.json /app/server/
COPY --from=builder /app/client/dist /app/client/dist
COPY --from=builder /app/client/package*.json /app/client/

# Install only production dependencies
WORKDIR /app/server
RUN npm ci --only=production

WORKDIR /app/client
RUN npm ci --only=production

# Back to root
WORKDIR /app

# Expose Empirica default port
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Start Empirica server
WORKDIR /app/server
CMD ["node", "dist/index.js"]
