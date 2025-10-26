# tech-challenge-fiap-payment

## 🧩 Estrutura de Endpoints do Microsserviço de Pagamentos

| Método  | Endpoint                   | Descrição                              |
| ------- | -------------------------- | -------------------------------------- |
| `POST`  | `/api/payments`            | Cria pagamento no provedor             |
| `GET`   | `/api/payments/:id`        | Consulta status de pagamento           |
| `POST`  | `/api/payments/webhook`    | Recebe notificações externas           |
| `PATCH` | `/api/payments/:id/status` | Atualiza status manualmente (opcional) |

# Banco de Dados com Docker e Prisma

```bash
# Subir o banco de dados com Docker
docker compose up -d --build

# Verificar se o container está rodando
docker ps

# Rodar as migrations do Prisma
docker compose exec api npx prisma migrate dev --name init

# Abrir o Prisma Studio
docker compose exec api npx prisma studio

# remove volume do docker
docker compose down -v

docker compose logs -f api

#executar o k8s
kubectl apply -f k8s-deploy.yml

# Gerar imagem e enviar docker hub
docker build -t danilloagt/fiap-payment:latest .
docker push danilloagt/fiap-payment:latest


kubectl delete -f .



http://192.168.49.2:31215 #API
http://192.168.49.2:31966 #Prism

```
