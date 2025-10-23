import { Request, Response } from "express";
import * as PaymentService from "../services/paymentService";
import { HttpResponse } from "../models/http-response-model";
import { CreatePaymentDTO } from "../models/paymentModel";

export const createPayment = async (req: Request, res: Response): Promise<void> => {
  const paymentData: CreatePaymentDTO = req.body;
  const httpResponse: HttpResponse = await PaymentService.createPayment(paymentData);
  res.status(httpResponse.statusCode).json(httpResponse.body);
};


export const findAllPayment = async (req: Request, res: Response): Promise<void> => {
  const httpResponse: HttpResponse = await PaymentService.getAllPayments();
  res.status(httpResponse.statusCode).json(httpResponse.body);
};

export const paymentWebhook = async (req: Request, res: Response): Promise<void> => {
  try {
    const mpPayment = req.body;
    const httpResponse: HttpResponse = await PaymentService.handleWebhook(mpPayment);
    res.status(httpResponse.statusCode).json(httpResponse.body);
  } catch (error: any) {
    console.error("Erro no webhook:", error);
    res.status(500).json({ message: "Erro interno no webhook" });
  }
};


