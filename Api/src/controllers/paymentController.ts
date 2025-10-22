import { Request, Response } from "express";
import * as PaymentService from "../services/paymentService";
import { HttpResponse } from "../models/http-response-model";
import { CreatePaymentDTO } from "../models/paymentModel";

export const createPayment = async (req: Request, res: Response): Promise<void> => {
  const paymentData: CreatePaymentDTO = req.body;

  const httpResponse: HttpResponse = await PaymentService.createPayment(paymentData);

  res.status(httpResponse.statusCode).json(httpResponse.body);
};


export const getPaymentById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const paymentId = Number(id);

  const httpResponse: HttpResponse = await PaymentService.getPayment(paymentId);

  res.status(httpResponse.statusCode).json(httpResponse.body);
};



