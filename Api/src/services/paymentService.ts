import { v4 as uuidv4 } from "uuid";
import * as PaymentModel from "../models/paymentModel";
import * as HttpHelper from "../utils/http-helper";
import { paymentClient } from "../config/mercado-pago.config";
import * as PaymentRepository from "../repositories/paymentRepository";


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
    const mpPayment = await paymentClient.create({ body }) as PaymentModel.MercadoPagoPaymentResponse;


    // Monta objeto para salvar no banco
    const paymentData: PaymentModel.PaymentDB = {
      id: mpPayment.id.toString(),
      amount: mpPayment.transaction_amount,
      status: mpPayment.status,
      payerId: mpPayment.payer.id,
      payerEmail: mpPayment.payer.email ?? "sem-email@mp.com", // fallback se email for null
      createdAt: new Date(mpPayment.date_created),
      updatedAt: new Date(mpPayment.date_last_updated),
    };

    //Salva no banco
    const savedPayment = await PaymentRepository.savePayment(paymentData);

    return HttpHelper.created(mpPayment); // Retorna diretamente o objeto da API
  } catch (error: any) {
    console.error("❌ Erro em createPayment ->", error);
    return HttpHelper.serverError(error.message || "Falha ao criar pagamento.");
  }
};


export const getAllPayments = async () => {
  try {
    const payments = await PaymentRepository.getAllPayments();
    return HttpHelper.ok(payments);
  } catch (error: any) {
    console.error("❌ Erro em getAllPayments ->", error);
    return HttpHelper.serverError(error.message || "Falha ao consultar pagamentos.");
  }
};


export const handleWebhook = async (mpPayment: any) => {
  try {
    // Validação mínima
    if (!mpPayment || !mpPayment.id || !mpPayment.status) {
      return HttpHelper.badRequest("Payload de webhook inválido.");
    }

    // Busca o pagamento existente no banco
    const existingPayment = await PaymentRepository.getPaymentById(mpPayment.id);

    if (!existingPayment) {
      // Caso o pagamento não exista, opcional: criar ou apenas ignorar
      return HttpHelper.notFound(`Pagamento com id ${mpPayment.id} não encontrado.`);
    }

    // Atualiza apenas se o status mudou
    if (existingPayment.status !== mpPayment.status) {
      const updatedPayment: PaymentModel.PaymentDB = {
        ...existingPayment,
        status: mpPayment.status,
        updatedAt: new Date(), // atualiza a data
      };

      await PaymentRepository.updatePayment(updatedPayment);
    }

    // Retorna sucesso
    return HttpHelper.ok({ message: "Pagamento atualizado com sucesso", id: mpPayment.id });
  } catch (error: any) {
    console.error("❌ Erro em handleWebhook ->", error);
    return HttpHelper.serverError(error.message || "Falha ao processar webhook.");
  }
};

