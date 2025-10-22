export interface Payer {
  email: string;
  first_name?: string;
  last_name?: string;
}

export interface Payment {
  id: string;
  amount: number;
  status: string;
  payer: Payer;
  createdAt: Date;
}

export interface CreatePaymentDTO {
  amount: number;
  payment_method: string;
  payer: Payer;
}

const payments: Payment[] = [];

export const savePayment = (payment: Payment): Payment => {
  payments.push(payment);
  return payment;
};

export const findPaymentById = (id: string): Payment | undefined =>
  payments.find((p) => p.id === id);
