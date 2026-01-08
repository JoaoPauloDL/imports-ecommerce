FROM node:18-alpine

WORKDIR /app

# Copiar package do backend
COPY backend/package*.json ./

# Instalar dependências
RUN npm install

# Copiar todo o código do backend
COPY backend .

# Variáveis de ambiente
ENV NODE_ENV=production
EXPOSE 5000

# Rodar o backend
CMD ["node", "app.js"]
