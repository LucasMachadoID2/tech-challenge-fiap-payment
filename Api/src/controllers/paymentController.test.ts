import { Request, Response } from 'express';
import * as PaymentController from "./paymentController";
import * as PaymentService from "../services/paymentService";

// Mock do PaymentService
jest.mock('../services/paymentService');

describe('PaymentController', () => {
  let req: Request;
  let res: Response;
  let mockCreatePayment: jest.SpyInstance;

  beforeEach(() => {
    // Mock da request
    req = {
      body: {}
    } as Request;

    // Mock da response
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    } as unknown as Response;

    // Mock do serviço
    mockCreatePayment = jest.spyOn(PaymentService, 'createPayment');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve criar pagamento com sucesso', async () => {
    // Prepara
    req.body = {
      amount: 100,
      payment_method: 'pix',
      payer: { email: 'test@test.com' }
    };

    mockCreatePayment.mockResolvedValue({
      statusCode: 201,
      body: { id: '123', status: 'pending' }
    });

    // Executa
    await PaymentController.createPayment(req, res);

    // Verifica
    expect(mockCreatePayment).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ id: '123', status: 'pending' });
  });

  it('deve retornar erro quando dados estiverem incompletos', async () => {
    // Prepara
    req.body = { payment_method: 'pix' }; // Sem amount

    mockCreatePayment.mockResolvedValue({
      statusCode: 400,
      body: { message: 'Dados incompletos' }
    });

    // Executa
    await PaymentController.createPayment(req, res);

    // Verifica
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Dados incompletos' });
  });
});