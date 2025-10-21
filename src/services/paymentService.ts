import { MercadoPagoConfig, Payment } from "mercadopago";
import { v4 as uuidv4 } from "uuid";
import { HttpResponse } from "../models/http-response-model";
import * as PaymentModel from "../models/paymentModel";
import * as HttpHelper from "../utils/http-helper";
import { MERCADO_PAGO_TOKEN } from "../config";

// 🔹 Inicializa o cliente Mercado Pago
const client = new MercadoPagoConfig({
  accessToken: MERCADO_PAGO_TOKEN,
  options: { timeout: 5000 },
});

const paymentClient = new Payment(client);

export const createPayment = async (
  data: PaymentModel.CreatePaymentDTO
): Promise<HttpResponse> => {
  try {
    const { amount, payment_method, payer } = data;

    if (!amount || !payment_method || !payer?.email) {
      return HttpHelper.badRequest("Dados incompletos para criar o pagamento.");
    }

    // 🔹 Corpo da requisição para criar o pagamento direto
    const body: any = {
      transaction_amount: Number(amount.toFixed(2)),
      description: "Pagamento via API",
      payment_method_id: payment_method, // Ex: "pix", "credit_card"
      external_reference: uuidv4(),
      notification_url: "https://seuservico.com/api/payments/webhook",
      payer: {
        email: payer.email,
      },
    };

    // 🔹 Caso o método seja cartão, adiciona dados extras
    if (payment_method === "credit_card") {
      if (!payer.token) {
        return HttpHelper.badRequest(
          "Token do cartão é obrigatório para pagamentos com cartão."
        );
      }

      body.token = payer.token;
      body.installments = payer.installments || 1;
      body.statement_descriptor = "Minha Loja";
    }

    // 🔹 Cria o pagamento no Mercado Pago
    const response = await paymentClient.create({ body });

    // 🔹 Persiste localmente
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

    const message = error.message || "Falha ao criar pagamento no Mercado Pago.";
    return HttpHelper.serverError(message);
  }
};
