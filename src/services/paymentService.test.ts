import { jest, describe, test, expect, beforeEach } from '@jest/globals';
import * as PaymentModel from '../models/paymentModel';
import * as HttpHelper from '../utils/http-helper';


import * as crypto from 'crypto'; // Importa o módulo real primeiro
const mockUUID = 'mock-uuid-12345'; // Define a constante do UUID

const actualCrypto = jest.requireActual('crypto') as typeof crypto;

jest.mock('crypto', () => ({
  ...actualCrypto, // Faz o spread do módulo real que importamos
  randomUUID: jest.fn(() => mockUUID), // Agora mockUUID está definida
}));

// 2. Mock do Mercado Pago Client
import { paymentClient } from '../config/mercado-pago.config';
jest.mock('../config/mercado-pago.config', () => ({
  paymentClient: {
    create: jest.fn(),
  },
}));
const mockedPaymentClient = paymentClient as jest.Mocked<typeof paymentClient>;

// 3. Mock do Repositório
import * as PaymentRepository from '../repositories/paymentRepository';
jest.mock('../repositories/paymentRepository', () => ({
  savePayment: jest.fn(),
  getAllPayments: jest.fn(),
  getPaymentById: jest.fn(),
  updatePayment: jest.fn(),
}));
const mockedRepo = PaymentRepository as jest.Mocked<typeof PaymentRepository>;

// 4. Mock do Notificador
import { notifyOtherService } from '../utils/notifyOtherService';
jest.mock('../utils/notifyOtherService', () => ({
  notifyOtherService: jest.fn(),
}));
const mockedNotifier = { notifyOtherService } as jest.Mocked<{ notifyOtherService: typeof notifyOtherService }>;

// --- Fim dos Mocks ---

// Importa o Service (DEPOIS dos mocks)
import * as paymentService from './paymentService';

// ---- Início dos Testes ----
describe('PaymentService', () => {
  // Limpa todos os mocks antes de cada teste
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Testes para createPayment
  describe('createPayment', () => {
    
    test('deve criar um pagamento com sucesso (caminho feliz)', async () => {
      // 1. Prepara (Arrange)
      const inputData: PaymentModel.CreatePaymentDTO = {
        amount: 100,
        payment_method: 'pix',
        payer: { email: 'test@example.com' },
      };

      // Mock da resposta do Mercado Pago (CORREÇÃO 2 APLICADA)
      const mockMpResponse = {
        id: 12345,
        status: 'CREATED',
        transaction_amount: 100,
        payer: { id: 'mp-payer-id', email: 'test@example.com' },
        date_created: '2023-01-01T10:00:00.000Z',
        date_last_updated: '2023-01-01T10:00:00.000Z',
        api_response: {},
        point_of_interaction: {
          transaction_data: {
            qr_code_base64: 'mockQrImage',
            qr_code: 'mockQrCode',
          }
        }
      };
      
      // Mock da resposta do nosso repositório
      const mockSavedPayment: PaymentModel.PaymentDB = {
  id: '12345',
  amount: 100,
  status: 'CREATED',
  payerId: 'mp-payer-id',
  payerEmail: 'test@example.com',
  createdAt: new Date('2023-01-01T10:00:00.000Z'),
  updatedAt: new Date('2023-01-01T10:00:00.000Z'),
  qrImage: 'mockQrImage',
  qrCode: 'mockQrCode',
      };

      // Configura os mocks para retornarem os valores esperados
      // Adicionamos 'as any' para contornar a checagem de tipo complexa do SDK
      mockedPaymentClient.create.mockResolvedValue(mockMpResponse as any); 
      mockedRepo.savePayment.mockResolvedValue(mockSavedPayment);

      // 2. Executa (Act)
      const result = await paymentService.createPayment(inputData);

      // 3. Verifica (Assert)
      
      // Verificou se o client do MP foi chamado com os dados certos
      expect(mockedPaymentClient.create).toHaveBeenCalledTimes(1);
      expect(mockedPaymentClient.create).toHaveBeenCalledWith({
        body: {
          transaction_amount: 100,
          description: 'Pagamento via API',
          payment_method_id: 'pix',
          external_reference: mockUUID, // Verifica se usou o UUID mockado
          notification_url: 'https://seuservico.com/api/payments/webhook',
          payer: { email: 'test@example.com' },
        },
      });

      // Verificou se o repositório foi chamado com os dados MAPEADOS
      expect(mockedRepo.savePayment).toHaveBeenCalledTimes(1);
      expect(mockedRepo.savePayment).toHaveBeenCalledWith(mockSavedPayment);

      // Verificou se a resposta foi um 201 Created
      expect(result.statusCode).toBe(201);
      expect(result.body).toEqual(mockSavedPayment); // Retorna o objeto salvo no banco
    });

    test('deve retornar 400 (Bad Request) se os dados estiverem incompletos', async () => {
      // 1. Prepara (com dados inválidos)
      const inputData: any = {
        amount: 100,
        payment_method: 'pix',
        // payer.email está faltando
      };

      // 2. Executa
      const result = await paymentService.createPayment(inputData);

      // 3. Verifica
      expect(result.statusCode).toBe(400);
      expect(result.body).toEqual({ error: 'Dados incompletos para criar o pagamento.' });
      
      // Garante que nenhuma API externa foi chamada
      expect(mockedPaymentClient.create).not.toHaveBeenCalled();
      expect(mockedRepo.savePayment).not.toHaveBeenCalled();
    });

    test('deve retornar 500 (Server Error) se o Mercado Pago falhar', async () => {
      // 1. Prepara
      const inputData: PaymentModel.CreatePaymentDTO = {
        amount: 100,
        payment_method: 'pix',
        payer: { email: 'test@example.com' },
      };
      
      // Configura o mock para REJEITAR (dar erro)
      const mpError = new Error('Falha na API do MP');
      mockedPaymentClient.create.mockRejectedValue(mpError);
      
      // 2. Executa
      const result = await paymentService.createPayment(inputData);
      
      // 3. Verifica
      expect(result.statusCode).toBe(500);
      expect(result.body).toEqual({ error: 'Falha na API do MP' });
      
      // Garante que o repositório não foi chamado
      expect(mockedRepo.savePayment).not.toHaveBeenCalled();
    });
  });

  // Testes para getAllPayments
  describe('getAllPayments', () => {
    
    test('deve retornar uma lista de pagamentos com sucesso (caminho feliz)', async () => {
      // 1. Prepara
      const mockPaymentList: PaymentModel.PaymentDB[] = [
        { id: '1', status: 'PAID' } as PaymentModel.PaymentDB,
        { id: '2', status: 'pending' } as PaymentModel.PaymentDB,
      ];
      mockedRepo.getAllPayments.mockResolvedValue(mockPaymentList);

      // 2. Executa
      const result = await paymentService.getAllPayments();

      // 3. Verifica
      expect(mockedRepo.getAllPayments).toHaveBeenCalledTimes(1);
      expect(result.statusCode).toBe(200);
      expect(result.body).toEqual(mockPaymentList);
    });

    test('deve retornar 500 (Server Error) se o repositório falhar', async () => {
      // 1. Prepara
      const dbError = new Error('Falha no banco');
      mockedRepo.getAllPayments.mockRejectedValue(dbError);

      // 2. Executa
      const result = await paymentService.getAllPayments();

      // 3. Verifica
      expect(result.statusCode).toBe(500);
      expect(result.body).toEqual({ error: 'Falha no banco' });
    });
  });

  // Testes para handleWebhook
  describe('handleWebhook', () => {
    
    test('deve atualizar o pagamento e notificar se o status mudou para "PAID"', async () => {
      // 1. Prepara
      const mpPayment = { id: '123', status: 'PAID' };
      const existingPayment = { id: '123', status: 'pending', /* ... */ } as PaymentModel.PaymentDB;

      mockedRepo.getPaymentById.mockResolvedValue(existingPayment);
      mockedRepo.updatePayment.mockResolvedValue({ ...existingPayment, status: 'PAID' });
      
      // CORREÇÃO 3 APLICADA
      mockedNotifier.notifyOtherService.mockResolvedValue(undefined); // Mocka a notificação

      // 2. Executa
      const result = await paymentService.handleWebhook(mpPayment);
      
      // 3. Verifica
      expect(mockedRepo.getPaymentById).toHaveBeenCalledWith('123');
      expect(mockedRepo.updatePayment).toHaveBeenCalledTimes(1);
      // Verifica se o status e o updatedAt foram atualizados
      expect(mockedRepo.updatePayment).toHaveBeenCalledWith(expect.objectContaining({
        id: '123',
        status: 'PAID',
        updatedAt: expect.any(Date), // Verifica se um novo Date foi setado
      }));
      
      // Verifica se o notificador foi chamado
      expect(mockedNotifier.notifyOtherService).toHaveBeenCalledTimes(1);
      
      expect(result.statusCode).toBe(200);
      expect(result.body).toEqual(expect.objectContaining({ message: 'Pagamento atualizado com sucesso' }));
    });

    test('deve retornar 400 (Bad Request) se o payload do webhook for inválido', async () => {
      const invalidPayload = { status: 'PAID' }; // Faltando ID
      const result = await paymentService.handleWebhook(invalidPayload);
      
      expect(result.statusCode).toBe(400);
      expect(result.body).toEqual({ error: 'Payload de webhook inválido.' });
      expect(mockedRepo.getPaymentById).not.toHaveBeenCalled();
    });

    test('deve retornar 404 (Not Found) se o pagamento não existir no banco', async () => {
      const mpPayment = { id: '123', status: 'PAID' };
      mockedRepo.getPaymentById.mockResolvedValue(null); // Pagamento não encontrado

      const result = await paymentService.handleWebhook(mpPayment);

      expect(result.statusCode).toBe(404);
      expect(result.body).toEqual({ error: 'Pagamento com id 123 não encontrado.' });
      expect(mockedRepo.updatePayment).not.toHaveBeenCalled();
    });
    
    test('NÃO deve atualizar nem notificar se o status não mudou', async () => {
      const mpPayment = { id: '123', status: 'PAID' };
      const existingPayment = { id: '123', status: 'PAID' } as PaymentModel.PaymentDB; // Status já era 'PAID'

      mockedRepo.getPaymentById.mockResolvedValue(existingPayment);

      const result = await paymentService.handleWebhook(mpPayment);
      
      expect(mockedRepo.updatePayment).not.toHaveBeenCalled();
      expect(mockedNotifier.notifyOtherService).not.toHaveBeenCalled();
      expect(result.statusCode).toBe(200);
      expect(result.body).toEqual(expect.objectContaining({ message: 'Nenhuma alteração de status' }));
    });

    test('deve atualizar mas NÃO notificar se o status mudou para "rejected"', async () => {
      const mpPayment = { id: '123', status: 'rejected' };
      const existingPayment = { id: '123', status: 'pending' } as PaymentModel.PaymentDB;

      mockedRepo.getPaymentById.mockResolvedValue(existingPayment);
      mockedRepo.updatePayment.mockResolvedValue({ ...existingPayment, status: 'rejected' });

      const result = await paymentService.handleWebhook(mpPayment);
      
      expect(mockedRepo.updatePayment).toHaveBeenCalledTimes(1); // Atualizou
      expect(mockedNotifier.notifyOtherService).not.toHaveBeenCalled(); // Mas não notificou
      expect(result.statusCode).toBe(200);
    });

    test('deve retornar 200 OK mesmo se a notificação falhar', async () => {
      // O webhook NÃO PODE falhar se a notificação falhar
      const mpPayment = { id: '123', status: 'PAID' };
      const existingPayment = { id: '123', status: 'pending' } as PaymentModel.PaymentDB;

      mockedRepo.getPaymentById.mockResolvedValue(existingPayment);
      mockedRepo.updatePayment.mockResolvedValue({ ...existingPayment, status: 'PAID' });
      // Mocka a notificação para dar erro
      mockedNotifier.notifyOtherService.mockRejectedValue(new Error('Falha ao notificar')); 

      const result = await paymentService.handleWebhook(mpPayment);
      
      expect(mockedRepo.updatePayment).toHaveBeenCalledTimes(1);
      expect(mockedNotifier.notifyOtherService).toHaveBeenCalledTimes(1); // Tentou notificar
      expect(result.statusCode).toBe(502); // Agora retorna erro 502 se falhar a notificação
    });
  });
});