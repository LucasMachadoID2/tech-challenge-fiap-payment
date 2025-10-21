import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { HttpResponse } from "../models/http-response-model";
import * as PaymentModel from "../models/paymentModel";
import * as HttpHelper from "../utils/http-helper";
import { MERCADO_PAGO_TOKEN } from "../config";

export const createPayment = async (
  data: PaymentModel.CreatePaymentDTO
): Promise<HttpResponse> => {
  try {
    const { amount, payment_method, payer } = data;

    if (!amount || !payment_method || !payer?.email) {
      return HttpHelper.badRequest("Dados incompletos para criar o pagamento.");
    }

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
          "X-Idempotency-Key": uuidv4(), // ✅ Header obrigatório
        },
      }
    );

    const paymentData = response.data;

    const payment: PaymentModel.Payment = PaymentModel.savePayment({
      id: paymentData.id,
      amount: paymentData.transaction_amount,
      status: paymentData.status,
      payer: paymentData.payer,
      createdAt: new Date(),
    });

    return HttpHelper.created(payment);
  } catch (error: any) {
    console.error("❌ Erro em createPayment ->", error.response?.data || error.message);

    if (error.response && error.response.status) {
      const status = error.response.status;
      const message = error.response.data?.message || error.response.data || "Erro no pagamento";
      return {
        statusCode: status,
        body: { error: message },
      };
    }

    return HttpHelper.serverError("Falha ao criar pagamento no Mercado Pago.");
  }
};
