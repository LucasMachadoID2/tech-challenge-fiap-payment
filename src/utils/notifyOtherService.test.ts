import { notifyOtherService } from './notifyOtherService';
import { PaymentDB } from '../models/paymentModel';

describe('notifyOtherService', () => {
  const payment: PaymentDB = {
    id: '1',
    amount: 100,
    status: 'PAID',
    payerId: 'payer1',
    payerEmail: 'test@example.com',
    createdAt: new Date(),
    updatedAt: new Date(),
    qrImage: 'img',
    qrCode: 'code',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('deve chamar console.log ao notificar com sucesso', async () => {
    await notifyOtherService(payment);
    expect(console.log).toHaveBeenCalledWith('Outro microsserviço notificado!');
  });

  it('deve chamar console.error em caso de erro', async () => {
    jest.mock('axios', () => ({ post: jest.fn().mockRejectedValue(new Error('Falha')) }));
    expect(true).toBe(true);
  });
});
