import * as PaymentModel from "../models/paymentModel";
import prisma from "../config/prisma";

export const savePayment = async (mpPayment: any) => {    
  console.log("mpPayment aqui");
    console.log(mpPayment);
  
  const paymentData: PaymentModel.PaymentDB = {
    id: mpPayment.id,
    amount: mpPayment.amount,
    status: mpPayment.status,
    payerId: mpPayment.payerId,
    payerEmail: mpPayment.payerEmail,
    createdAt: new Date(mpPayment.createdAt),
    updatedAt: new Date(mpPayment.updatedAt),
  };

  const savedPayment = await prisma.payment.create({
    data: paymentData,
  });

  return savedPayment;
};

export const getAllPayments = async () => {
  return prisma.payment.findMany({
    orderBy: { createdAt: "desc" }, // opcional: ordena do mais recente para o mais antigo
  });
};