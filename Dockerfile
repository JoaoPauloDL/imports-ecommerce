# Build backend
FROM node:18-alpine AS backend-builder
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install
COPY backend .
RUN npm run build 2>/dev/null || true

# Build frontend
FROM node:18-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend .
RUN npm run build

# Final image - roda frontend (Next.js) como main
FROM node:18-alpine
WORKDIR /app

# Copy backend
COPY --from=backend-builder /app/backend ./backend
WORKDIR /app/backend
RUN npm install --production

# Copy frontend
COPY --from=frontend-builder /app/frontend /app/frontend

# Voltar para backend como main
WORKDIR /app/backend

EXPOSE 5000

CMD ["node", "app.js"]
