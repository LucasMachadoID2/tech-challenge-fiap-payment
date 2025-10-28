FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install

# Copia TODO o resto do código para a imagem
COPY . .

FROM node:20-alpine
WORKDIR /app

# Copia apenas o necessário da etapa 'builder'
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma

COPY --from=builder /app/src ./src

EXPOSE 3333 
EXPOSE 5555

# O comando padrão será apenas iniciar o servidor.
# A migration/db-push será feita pelo 'command' do compose ou K8s
CMD ["npm", "run", "start"]