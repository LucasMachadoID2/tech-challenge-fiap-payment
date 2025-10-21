# tech-challenge-fiap-payment

## 🧩 Estrutura de Endpoints do Microsserviço de Pagamentos

| Método  | Endpoint                   | Descrição                              |
| ------- | -------------------------- | -------------------------------------- |
| `POST`  | `/api/payments`            | Cria pagamento no provedor             |
| `GET`   | `/api/payments/:id`        | Consulta status de pagamento           |
| `POST`  | `/api/payments/webhook`    | Recebe notificações externas           |
| `PATCH` | `/api/payments/:id/status` | Atualiza status manualmente (opcional) |
