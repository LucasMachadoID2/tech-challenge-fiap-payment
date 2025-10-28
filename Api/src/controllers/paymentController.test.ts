import { Request, Response } from 'express';
import * as PaymentController from "./paymentController";
import * as PaymentService from "../services/paymentService";
import { HttpResponse } from "../models/http-response-model";
import { CreatePaymentDTO } from "../models/paymentModel";
import { jest } from '@jest/globals';

const mockRequest = (body: any) => {
  return {
    body,
  } as Partial<Request> as Request;
};

const mockResponse = () => {
  const res: Partial<Response> = {
    status: jest.fn().mockReturnThis() as unknown as Response['status'],
    json: jest.fn().mockReturnThis() as unknown as Response['json']
  };
  return res as Response;
};

describe('Payment Controller', () => {
  let req: Request;
  let res: Response;

  beforeEach(() => {
    res = mockResponse();
    jest.clearAllMocks();
  });

  describe('createPayment', () => {
    test('deve criar um pagamento e retornar 201', async () => {
      // Arrange
      const mockBody: CreatePaymentDTO = {
        amount: 100,
        payment_method: 'credit_card',
        payer: {
          email: 'test@example.com'
        }
      };
      req = mockRequest(mockBody);

      const mockHttpResponse: HttpResponse = {
        statusCode: 201,
        body: { id: 'mp-123', status: 'approved', amount: 100 }
      };

      jest.spyOn(PaymentService, 'createPayment')
        .mockResolvedValueOnce(mockHttpResponse);

      // Act
      await PaymentController.createPayment(req, res);

      // Assert
      expect(PaymentService.createPayment).toHaveBeenCalledWith(mockBody);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockHttpResponse.body);
    });

    test('deve retornar 400 se o serviço retornar bad request', async () => {
      // Arrange
      const mockBody = { payment_method: 'credit_card' }; // amount missing
      req = mockRequest(mockBody);

      const mockHttpResponse: HttpResponse = {
        statusCode: 400,
        body: { message: 'Dados incompletos para criar o pagamento.' }
      };

      jest.spyOn(PaymentService, 'createPayment')
        .mockResolvedValueOnce(mockHttpResponse);

      // Act
      await PaymentController.createPayment(req, res);

      // Assert
      expect(PaymentService.createPayment).toHaveBeenCalledWith(mockBody);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(mockHttpResponse.body);
    });

    test('deve retornar 500 se o serviço retornar erro', async () => {
      // Arrange
      const mockBody: CreatePaymentDTO = {
        amount: 100,
        payment_method: 'credit_card',
        payer: {
          email: 'test@example.com'
        }
      };
      req = mockRequest(mockBody);

      const mockHttpResponse: HttpResponse = {
        statusCode: 500,
        body: { message: 'Falha ao criar pagamento.' }
      };

      jest.spyOn(PaymentService, 'createPayment')
        .mockResolvedValueOnce(mockHttpResponse);

      // Act
      await PaymentController.createPayment(req, res);

      // Assert
      expect(PaymentService.createPayment).toHaveBeenCalledWith(mockBody);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(mockHttpResponse.body);
    });
  });
});