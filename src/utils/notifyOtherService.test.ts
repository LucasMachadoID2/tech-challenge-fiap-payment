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
    jest.spyOn(require('axios'), 'post').mockResolvedValue({});
    await notifyOtherService(payment);
    expect(console.log).toHaveBeenCalledWith('Order service notificado!');
  });

  it('deve chamar console.error e lançar erro em caso de falha', async () => {
    jest.spyOn(require('axios'), 'post').mockRejectedValue(new Error('Falha'));
    await expect(notifyOtherService(payment)).rejects.toThrow('Falha ao notificar order service');
    expect(console.error).toHaveBeenCalledWith(
      'Erro ao notificar order service:', expect.any(Error)
    );
  });
});
