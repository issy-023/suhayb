# Stage 1: Build Stage
FROM node:19-alpine AS builder

# Install required dependencies
RUN apk add --no-cache python3 make g++

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json to leverage Docker cache
COPY package*.json ./

# Install Vue CLI globally
RUN npm install -g @vue/cli

# Install dependencies
RUN npm install

# Copy the entire project (excluding files in .dockerignore)
COPY . .

# Build the Vue application
RUN npm run build

# Stage 2: Production Stage
FROM node:19-alpine

# Install `serve` for serving static files
RUN npm install -g serve

# Set working directory in production container
WORKDIR /app

# Copy the built app from the builder stage
COPY --from=builder /app/dist /app/dist

# Expose port for the app
EXPOSE 8080

# Start the application in production mode
CMD ["serve", "-s", "dist", "-l", "8080"]
