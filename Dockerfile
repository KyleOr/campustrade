# Use official Node.js LTS image
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy app source
COPY . .

# Build the app (if using Next.js or similar)
RUN npm run build

# Expose port (e.g. 3000 for Next.js)
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
