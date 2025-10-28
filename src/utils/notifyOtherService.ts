import axios from "axios";
import { PaymentDB } from "../models/paymentModel";

export const notifyOtherService = async (payment: PaymentDB) => {
  try {
    // await axios.post("http://outro-microsservico.local/pagamentos", {
    //   id: payment.id,
    //   amount: payment.amount,
    //   payerId: payment.payerId,
    //   status: payment.status,
    // });
    console.log("Outro microsserviço notificado!");
  } catch (err) {
    console.error("Erro ao notificar outro microsserviço:", err);
  }
};
