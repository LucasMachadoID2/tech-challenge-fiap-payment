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
    qrImage: mpPayment.qrImage,
    qrCode: mpPayment.qrCode,
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

export const getPaymentById = async (id: string): Promise<PaymentModel.PaymentDB | null> => {
  return prisma.payment.findUnique({
    where: { id },
  });
};

export const updatePayment = async (payment: PaymentModel.PaymentDB) => {
  return prisma.payment.update({
    where: { id: payment.id },
    data: {
      status: payment.status,
      updatedAt: payment.updatedAt,
    },
  });
};

