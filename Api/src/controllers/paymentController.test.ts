import { Request, Response } from 'express';
import * as PaymentController from "../controllers/paymentController"; // 1. Importa a função a ser testada
import * as PaymentService from "../services/paymentService";// 2. Importa a dependência que será mockada

// 3. DIZ AO JEST PARA MOCKAR O SERVIÇO
// O caminho deve ser relativo a *este* arquivo de teste.
jest.mock('../services/paymentService');

// 4. Criamos uma versão "tipada" do mock para o TypeScript nos ajudar
const mockedPaymentService = PaymentService as jest.Mocked<typeof PaymentService>;

// 5. FUNÇÕES HELPER PARA MOCKAR REQ E RES
const mockRequest = (body: any) => {
  // Usamos 'Partial' para não precisar mockar o objeto 'req' inteiro
  return {
    body,
  } as Partial<Request> as Request; // Truque de casting para o TypeScript aceitar
};

const mockResponse = () => {
  const res: Partial<Response> = {}; // Mock parcial do 'res'
  res.status = jest.fn().mockReturnThis();
  res.json = jest.fn().mockReturnThis();
  return res as Response;
};

// 6. SUÍTE DE TESTES
describe('Payment Controller - PaymentController', () => {
  let req: Request;
  let res: Response;

  // Roda antes de cada teste
  beforeEach(() => {
    res = mockResponse(); // Cria um 'res' limpo

    // Limpa o histórico de chamadas do mock do serviço
    (mockedPaymentService.createPayment as jest.Mock).mockClear();
  });

  // Teste 1: Caso de Sucesso (201)
  test('deve criar um pagamento e retornar 201', async () => {
    // Arrange (Organizar)
    const mockBody = { amount: 100, method: 'credit_card' };
    req = mockRequest(mockBody);

    const mockPaymentResult = { id: 'uuid-123', status: 'approved', amount: 100 };

    // Dizemos ao mock do serviço o que ele deve retornar
    (mockedPaymentService.createPayment as jest.Mock).mockResolvedValue(mockPaymentResult);

    // Act (Agir)
    await PaymentController.createPayment(req, res);

    // Assert (Verificar)
    expect(PaymentService.createPayment).toHaveBeenCalledWith(100, 'credit_card'); // Verificou se o serviço foi chamado
    expect(res.status).toHaveBeenCalledWith(201); // Verificou o status HTTP
    expect(res.json).toHaveBeenCalledWith(mockPaymentResult); // Verificou a resposta JSON
  });

  // Teste 2: Caso de Validação (400)
  test('deve retornar 400 se faltar "amount"', async () => {
    // Arrange
    const mockBody = { method: 'credit_card' }; // 'amount' está faltando
    req = mockRequest(mockBody);

    // Act
    await PaymentController.createPayment(req, res);

    // Assert
    expect(PaymentService.createPayment).not.toHaveBeenCalled(); // O serviço NÃO deve ser chamado
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Amount and method are required' });
  });

  // Teste 3: Caso de Erro Interno (500)
  test('deve retornar 500 se o serviço disparar um erro', async () => {
    // Arrange
    const mockBody = { amount: 100, method: 'credit_card' };
    req = mockRequest(mockBody);

    // Forçamos o serviço a disparar uma exceção
    (mockedPaymentService.createPayment as jest.Mock).mockRejectedValue(new Error('Database error'));

    // Act
    await PaymentController.createPayment(req, res);

    // Assert
    expect(PaymentService.createPayment).toHaveBeenCalledTimes(1); // O serviço foi chamado
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
  });
});