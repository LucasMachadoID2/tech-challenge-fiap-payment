import { Router } from "express";
import * as PaymentController from "../controllers/paymentController";

const router = Router();


router.post("/payments", PaymentController.createPayment);// criar pagamento
router.get("/payments/", PaymentController.findAllPayment); // consultar all pagamentos
router.post("/payments/webhook", PaymentController.paymentWebhook); // recebe resposata de pagamento

export default router;
