import { Router } from "express";
import * as PaymentController from "../controllers/paymentController";

const router = Router();


router.post("/payments", PaymentController.createPayment);// criar pagamento
router.get("/payments/:id", PaymentController.getPaymentById); // consulta pagamento

export default router;
