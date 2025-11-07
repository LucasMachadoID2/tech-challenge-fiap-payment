import swaggerJSDoc from 'swagger-jsdoc';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Tech Challenge FIAP Payment API',
    version: '1.0.0',
    description: 'Documentação da API de pagamentos do Tech Challenge FIAP',
  },
  servers: [
    {
  url: 'http://localhost:3333',
      description: 'Servidor local',
    },
  ],
  components: {
    schemas: {
      CreatePaymentDTO: {
        type: 'object',
        required: ['amount', 'payment_method', 'payer'],
        properties: {
          amount: { type: 'number', example: 100.5 },
          payment_method: { type: 'string', example: 'pix' },
          payer: {
            type: 'object',
            properties: {
              email: { type: 'string', example: 'test@example.com' }
            }
          }
        }
      },
      PaymentDB: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '1' },
          amount: { type: 'number', example: 100.5 },
          status: { type: 'string', example: 'approved' },
          payerId: { type: 'string', example: 'payer1' },
          payerEmail: { type: 'string', example: 'test@example.com' },
          createdAt: { type: 'string', format: 'date-time', example: '2023-10-27T10:00:00.000Z' },
          updatedAt: { type: 'string', format: 'date-time', example: '2023-10-27T10:01:00.000Z' },
          qrImage: { type: 'string', example: 'img' },
          qrCode: { type: 'string', example: 'code' }
        }
      }
    }
  }
};

const options = {
  swaggerDefinition,
  apis: ['src/routes/*.ts', 'src/controllers/*.ts'], // Caminhos dos arquivos das rotas/controllers
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
