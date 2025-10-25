# Etapa 1: construir dependências
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Etapa 2: rodar app
FROM node:20-alpine
WORKDIR /app

COPY --from=builder /app /app

EXPOSE 3000

# Comando padrão: inicia o servidor
CMD ["npm", "run", "start"]
