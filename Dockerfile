# Etapa 1: construir dependências (Builder)
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install

# Copia TODO o resto do código para a imagem
COPY . .

# (Opcional) Se você usa TypeScript e compila (ex: tsc),
# este é o momento de compilar:
# RUN npm run build

# ---

# Etapa 2: Imagem final (Production)
FROM node:20-alpine
WORKDIR /app

# Copia apenas o necessário da etapa 'builder'
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma

# Se você compilou (npm run build), copie a pasta /build
# COPY --from=builder /app/build ./build
# Se você NÃO compilou (usa tsx, como no seu log), copie a /src
COPY --from=builder /app/src ./src

EXPOSE 3333
EXPOSE 5555

# O comando padrão será apenas iniciar o servidor.
# A migration/db-push será feita pelo 'command' do compose ou K8s
CMD ["npm", "run", "start"]