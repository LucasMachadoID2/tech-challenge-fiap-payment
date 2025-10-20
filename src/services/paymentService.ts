import axios from "axios";
import { HttpResponse } from "../models/http-response-model";
import * as PaymentModel from "../models/paymentModel";
import * as HttpHelper from "../utils/http-helper";
import { MERCADO_PAGO_TOKEN } from "../config";

/**
 * Cria um pagamento no Mercado Pago e salva localmente.
 */
export const createPayment = async (  data: PaymentModel.CreatePaymentDTO): Promise<HttpResponse> => {
  try {
    const { amount, payment_method, payer } = data;

    // 🔍 Validação básica
    if (!amount || !payment_method || !payer?.email) {
      return HttpHelper.badRequest("Dados incompletos para criar o pagamento.");
    }

    // 💳 Criação do pagamento no Mercado Pago
    const response = await axios.post(
      "https://api.mercadopago.com/v1/payments",
      {
        transaction_amount: amount,
        payment_method_id: payment_method,
        payer,
      },
      {
        headers: {
          Authorization: `Bearer ${MERCADO_PAGO_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    const paymentData = response.data;

    // 💾 Mapeia e salva os dados do pagamento (mock local)
    const payment: PaymentModel.Payment = PaymentModel.savePayment({
      id: paymentData.id,
      amount: paymentData.transaction_amount,
      status: paymentData.status,
      payer: paymentData.payer,
      createdAt: new Date(),
    });

    // ✅ Retorno de sucesso
    return HttpHelper.created(payment);
  } catch (error: any) {
    console.error("❌ Erro em createPayment -> Falha ao criar pagamento:", error.response?.data || error.message);
    return HttpHelper.serverError("Falha ao criar pagamento no Mercado Pago.");
  }
};
