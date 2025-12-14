import { Router } from "express";
import * as PaymentController from "../controllers/paymentController";

const router = Router();


/**
 * @swagger
 * /payments:
 *   post:
 *     summary: Cria um novo pagamento
 *     tags:
 *       - Pagamentos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePaymentDTO'
 *     responses:
 *       201:
 *         description: Pagamento criado com sucesso
 *       400:
 *         description: Dados inválidos
 *       500:
 *         description: Erro interno
 */
router.post("/payments", PaymentController.createPayment);// criar pagamento
/**
 * @swagger
 * /payments:
 *   get:
 *     summary: Lista todos os pagamentos
 *     tags:
 *       - Pagamentos
 *     responses:
 *       200:
 *         description: Lista de pagamentos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PaymentDB'
 *       500:
 *         description: Erro interno
 */
router.get("/payments/", PaymentController.findAllPayment); // consultar all pagamentos
/**
 * @swagger
 * /payments/webhook:
 *   post:
 *     summary: Recebe resposta de pagamento do Mercado Pago
 *     tags:
 *       - Pagamentos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 example: "1325297372"
 *               status:
 *                 type: string
 *                 example: "PAID"
 *           example:
 *             id: "1325297372"
 *             status: "PAID"
 *     responses:
 *       200:
 *         description: Webhook recebido
 *       500:
 *         description: Erro interno
 */
router.post("/payments/webhook", PaymentController.paymentWebhook); // recebe resposta de pagamento

export default router;
