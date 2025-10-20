import { Router } from "express";
import * as PaymentController from "../controllers/paymentController";

const router = Router();

// Criar pagamento
router.post("/payments", PaymentController.createPayment);

export default router;
