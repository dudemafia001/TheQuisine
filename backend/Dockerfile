# Build backend
FROM node:18-alpine AS backend-builder
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci --only=production

# Build frontend
FROM node:18-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# Production backend
FROM node:18-alpine AS backend
WORKDIR /app
COPY --from=backend-builder /app/backend/node_modules ./node_modules
COPY backend/ ./
EXPOSE 5000
CMD ["node", "server.js"]