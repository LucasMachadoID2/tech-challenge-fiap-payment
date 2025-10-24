# Etapa 1 — build
FROM node:20-slim

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Etapa 2 — produção leve
FROM node:20-alpine

WORKDIR /app
COPY --from=build /app ./

# Instala o Prisma Client
RUN npx prisma generate

# Expõe a porta da API
EXPOSE 3000

# Rodar migrations + iniciar servidor automaticamente
CMD npx prisma migrate deploy && npm run start:watch
