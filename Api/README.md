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
docker compose up -d

# Verificar se o container está rodando
docker ps

# Rodar as migrations do Prisma
docker compose exec api npx prisma migrate dev --name init

# Abrir o Prisma Studio
docker compose exec api npx prisma studio

```
