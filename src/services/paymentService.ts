import * as crypto from 'crypto';
import * as PaymentModel from "../models/paymentModel";
import * as HttpHelper from "../utils/http-helper";
import { paymentClient } from "../config/mercado-pago.config";
import * as PaymentRepository from "../repositories/paymentRepository";
import { notifyOtherService } from "../utils/notifyOtherService";


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
      external_reference: crypto.randomUUID(),
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
      qrImage: mpPayment.point_of_interaction.transaction_data.qr_code_base64,
      qrCode: mpPayment.point_of_interaction.transaction_data.qr_code,
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
    if (!mpPayment?.id || !mpPayment?.status) {
      return HttpHelper.badRequest("Payload de webhook inválido.");
    }

    // Busca o pagamento existente no banco
    const existingPayment = await PaymentRepository.getPaymentById(mpPayment.id);
    if (!existingPayment) {
      return HttpHelper.notFound(`Pagamento com id ${mpPayment.id} não encontrado.`);
    }

    // Atualiza apenas se o status mudou
    const statusChanged = existingPayment.status !== mpPayment.status;
    let updatedPayment = existingPayment;

    if (statusChanged) {
      updatedPayment = {
        ...existingPayment,
        status: mpPayment.status,
        updatedAt: new Date(),
      };
      await PaymentRepository.updatePayment(updatedPayment);
    }

    // Dispara notificação se pago e se houver mudança de status
    if (statusChanged && updatedPayment.status === "approved") {
      try {
        await notifyOtherService(updatedPayment);
      } catch (err) {
        console.error("❌ Falha ao notificar outro microsserviço:", err);
      }
    }

    return HttpHelper.ok({message: statusChanged ? "Pagamento atualizado com sucesso": "Nenhuma alteração de status", id: mpPayment.id, });

  } catch (error: any) {
    console.error("❌ Erro em handleWebhook ->", error);
    return HttpHelper.serverError(error.message || "Falha ao processar webhook.");
  }
};


