import { v4 as uuidv4 } from "uuid";
import * as PaymentModel from "../models/paymentModel";
import * as HttpHelper from "../utils/http-helper";
import { paymentClient } from "../config/mercado-pago.config";

export const createPayment = async (data: PaymentModel.CreatePaymentDTO) => {
  try {
    const { amount, payment_method, payer } = data;

    if (!amount || !payment_method || !payer?.email) {
      return HttpHelper.badRequest("Dados incompletos para criar o pagamento.");
    }

    // Payload para PIX
    const body: any = {
      transaction_amount: Number(amount.toFixed(2)),
      description: "Pagamento via API",
      payment_method_id: payment_method, // será "pix"
      external_reference: uuidv4(),
      notification_url: "https://seuservico.com/api/payments/webhook",
      payer: { email: payer.email },
    };

    // Cria pagamento no Mercado Pago
    const response = await paymentClient.create({ body });

    // Persiste localmente
    const payment = PaymentModel.savePayment({
      id: response.id,
      amount: response.transaction_amount,
      status: response.status,
      payer: response.payer,
      payment_method: response.payment_method_id,
      qr_code: response.point_of_interaction?.transaction_data?.qr_code,
      qr_code_base64:
        response.point_of_interaction?.transaction_data?.qr_code_base64,
      createdAt: new Date(),
    });

    return HttpHelper.created(payment);
  } catch (error: any) {
    console.error("❌ Erro em createPayment ->", error);
    return HttpHelper.serverError(error.message || "Falha ao criar pagamento.");
  }
};
