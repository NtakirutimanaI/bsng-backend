# Use Node 20 for NestJS 11 compatibility
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all source files
COPY . .

# Build the NestJS app
RUN npm run build

# Expose port (optional, Render uses process.env.PORT)
EXPOSE 3000

# Start in production mode
CMD ["npm", "run", "start:prod"]
