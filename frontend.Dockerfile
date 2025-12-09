# Multi-stage build for React frontend
# Stage 1: Build
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Argument to specify which frontend to build (student/admin/employer)
ARG PROJECT_PATH

# Check if PROJECT_PATH is set
RUN if [ -z "$PROJECT_PATH" ]; then echo "PROJECT_PATH argument is required"; exit 1; fi

# Copy root package files
COPY package.json package-lock.json ./

# Copy specific frontend package files
COPY ${PROJECT_PATH}/package.json ${PROJECT_PATH}/package.json

# Install dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the specific frontend
# We need to run the build command from the specific directory or use a script that targets it.
# Assuming standard Vite build commands managed via root scripts or direct access.
WORKDIR /app/${PROJECT_PATH}
RUN npm install
RUN npm run build

# Stage 2: Serve
FROM nginx:alpine

# Copy built assets from builder stage
# Vite builds to 'dist' by default
ARG PROJECT_PATH
COPY --from=builder /app/${PROJECT_PATH}/dist /usr/share/nginx/html

# Copy custom Nginx configuration template
COPY nginx.conf.template /etc/nginx/templates/default.conf.template

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
