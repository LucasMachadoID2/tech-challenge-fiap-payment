import { jest, describe, test, expect, beforeEach } from '@jest/globals';
import * as PaymentModel from '../models/paymentModel';

import prisma from '../config/prisma';

import * as paymentRepository from './paymentRepository';

jest.mock('../config/prisma', () => ({
  __esModule: true,
  default: {
    payment: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  },
}));

const mockPrisma = prisma as jest.Mocked<typeof prisma>;

// Bloco principal de testes
describe('PaymentRepository', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Testes para savePayment
  describe('savePayment', () => {
    test('deve salvar e retornar o pagamento formatado corretamente', async () => {
      // 1. Prepara os dados de entrada
      const mpPayment = {
  id: '12345',
  amount: 100.5,
  status: 'approved',
  payerId: 'payer123',
  payerEmail: 'payer@example.com',
  createdAt: '2023-10-27T10:00:00.000Z',
  updatedAt: '2023-10-27T10:01:00.000Z',
  qrImage: 'mockQrImage',
  qrCode: 'mockQrCode',
      };

      // 2. Prepara os dados que esperamos que o prisma.create retorne
      const expectedSavedPayment: PaymentModel.PaymentDB = {
  id: '12345',
  amount: 100.5,
  status: 'approved',
  payerId: 'payer123',
  payerEmail: 'payer@example.com',
  createdAt: new Date('2023-10-27T10:00:00.000Z'),
  updatedAt: new Date('2023-10-27T10:01:00.000Z'),
  qrImage: 'mockQrImage',
  qrCode: 'mockQrCode',
      };
      
      // 3. Configura o mock: "Quando o prisma.payment.create for chamado,
      mockPrisma.payment.create.mockResolvedValue(expectedSavedPayment);

      // 4. Executa a função
      const result = await paymentRepository.savePayment(mpPayment);

      // 5. Verifica os resultados
      // Verifica se o prisma.create foi chamado 1 vez
      expect(mockPrisma.payment.create).toHaveBeenCalledTimes(1);
      
      // Verifica se o prisma.create foi chamado com os dados JÁ FORMATADOS
      expect(mockPrisma.payment.create).toHaveBeenCalledWith({
        data: expectedSavedPayment, // A função deve ter convertido as datas de string para Date
      });
      
      // Verifica se a função retornou o que o prisma (mockado) retornou
      expect(result).toEqual(expectedSavedPayment);
    });
  });

  // Testes para getAllPayments
  describe('getAllPayments', () => {
    test('deve retornar uma lista de pagamentos', async () => {
      // 1. Prepara os dados
      const mockPaymentList: PaymentModel.PaymentDB[] = [
        { id: '1', status: 'approved', /* ...outros campos */ } as PaymentModel.PaymentDB,
        { id: '2', status: 'pending', /* ...outros campos */ } as PaymentModel.PaymentDB,
      ];

      // 2. Configura o mock
      mockPrisma.payment.findMany.mockResolvedValue(mockPaymentList);

      // 3. Executa
      const result = await paymentRepository.getAllPayments();

      // 4. Verifica
      expect(mockPrisma.payment.findMany).toHaveBeenCalledTimes(1);
      // Verifica se a ordenação foi incluída
      expect(mockPrisma.payment.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          qrImage: true,
          qrCode: true,
          status: true
        }
      });
      expect(result).toEqual(mockPaymentList);
    });
  });

  // Testes para getPaymentById
  describe('getPaymentById', () => {
    test('deve retornar um pagamento pelo ID', async () => {
      // 1. Prepara
      const paymentId = 'existing-id';
      const mockPayment = { id: paymentId, status: 'approved', /* ... */ } as PaymentModel.PaymentDB;
      
      // 2. Configura mock
      mockPrisma.payment.findUnique.mockResolvedValue(mockPayment);

      // 3. Executa
      const result = await paymentRepository.getPaymentById(paymentId);

      // 4. Verifica
      expect(mockPrisma.payment.findUnique).toHaveBeenCalledTimes(1);
      expect(mockPrisma.payment.findUnique).toHaveBeenCalledWith({
        where: { id: paymentId },
      });
      expect(result).toEqual(mockPayment);
    });

    test('deve retornar null se o pagamento não for encontrado', async () => {
      // 1. Prepara
      const paymentId = 'non-existing-id';
      
      // 2. Configura mock (para retornar nulo)
      mockPrisma.payment.findUnique.mockResolvedValue(null);

      // 3. Executa
      const result = await paymentRepository.getPaymentById(paymentId);

      // 4. Verifica
      expect(mockPrisma.payment.findUnique).toHaveBeenCalledTimes(1);
      expect(mockPrisma.payment.findUnique).toHaveBeenCalledWith({
        where: { id: paymentId },
      });
      expect(result).toBeNull();
    });
  });

  // Testes para updatePayment
  describe('updatePayment', () => {
    test('deve atualizar o status e updatedAt do pagamento', async () => {
      // 1. Prepara
      const paymentToUpdate: PaymentModel.PaymentDB = {
  id: '123',
  status: 'approved',
  updatedAt: new Date(),
  amount: 100,
  payerEmail: 'test@test.com',
  payerId: 'p1',
  createdAt: new Date('2023-01-01'),
  qrImage: 'mockQrImage',
  qrCode: 'mockQrCode',
      };
      
      const updatedPayment = { ...paymentToUpdate }; // O retorno mockado

      // 2. Configura mock
      mockPrisma.payment.update.mockResolvedValue(updatedPayment);

      // 3. Executa
      const result = await paymentRepository.updatePayment(paymentToUpdate);

      // 4. Verifica
      expect(mockPrisma.payment.update).toHaveBeenCalledTimes(1);
      expect(mockPrisma.payment.update).toHaveBeenCalledWith({
        where: { id: paymentToUpdate.id },
        data: { // Verifica se APENAS status e updatedAt foram enviados
          status: paymentToUpdate.status,
          updatedAt: paymentToUpdate.updatedAt,
        },
      });
      expect(result).toEqual(updatedPayment);
    });
  });

});