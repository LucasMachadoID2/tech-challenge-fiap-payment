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

export interface PaymentDB {
  id: string;
  amount: number;
  status: string;
  payerId: string;
  payerEmail: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MercadoPagoPaymentResponse {
  id: number;
  transaction_amount: number;
  status: string;
  payer: {
    id: string;
    email: string | null;
  };
  date_created: string;
  date_last_updated: string;
}



const payments: Payment[] = [];

export const savePayment = (payment: Payment): Payment => {
  payments.push(payment);
  return payment;
};

export const findPaymentById = (id: string): Payment | undefined =>
  payments.find((p) => p.id === id);
