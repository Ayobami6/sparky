FROM node:21-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application source code
COPY . .

# Build the NestJS application
RUN npm run build

RUN cp ./src/utils/**/*.ejs ./dist/utils/

# Stage 2: Create the final image
FROM node:21-alpine

# Set working directory
WORKDIR /app

# Copy only the necessary files from the build stage
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.env.stage.local /app/.env.stage.local
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# Expose the application port
EXPOSE 4000

# Command to run the application
CMD ["node", "dist/main.js"]
