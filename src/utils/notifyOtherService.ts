import axios from "axios";
import { PaymentDB } from "../models/paymentModel";

export const notifyOtherService = async (payment: PaymentDB) => {
  const url = `http://app-order-service:8083/v1/orders/update-payment-status/${payment.id}?status=${payment.status}`;
  try {
    await axios.post(url);
    console.log("Order service notificado!");
  } catch (err) {
    console.error("Erro ao notificar order service:", err);
    throw new Error("Falha ao notificar order service");
  }
};
