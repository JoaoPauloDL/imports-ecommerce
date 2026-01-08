# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY backend/package*.json ./
RUN npm install
COPY backend .

# Production stage
FROM node:18-alpine
WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app /app

ENV NODE_ENV=production
EXPOSE 5000

CMD ["node", "app.js"]
