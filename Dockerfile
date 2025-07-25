# Stage 1: Build the React application
FROM node:18-slim AS build

WORKDIR /app

# Copy package.json AND package-lock.json
COPY package.json ./
COPY package-lock.json ./

# Clean up potential existing node_modules or dist folders from previous layers
RUN rm -rf node_modules dist

# Install dependencies using npm ci for deterministic builds
RUN npm ci # <--- Ensure this is 'npm ci'!

# Copy the rest of the application code
COPY . .

# Build the React app for production.
RUN npm run build

# Stage 2: Serve the React application with Nginx
FROM nginx:alpine

# Copy your custom Nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built React app from the 'dist' folder (from the 'build' stage)
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80 (Nginx default)
EXPOSE 80

# Command to start Nginx when the container launches
CMD ["nginx", "-g", "daemon off;"]