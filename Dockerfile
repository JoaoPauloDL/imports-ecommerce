FROM node:18-alpine

# Definir diretório de trabalho como a raiz
WORKDIR /app

# Copiar apenas o backend (evita copiar frontend)
COPY backend/package*.json ./backend/
RUN cd backend && npm install --production

# Copiar o código do backend
COPY backend ./backend

# Variáveis de ambiente
ENV NODE_ENV=production
EXPOSE 5000

# Rodar o backend a partir do diretório backend
WORKDIR /app/backend
CMD ["node", "app.js"]
