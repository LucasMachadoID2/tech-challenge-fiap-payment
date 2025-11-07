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
};

const options = {
  swaggerDefinition,
  apis: ['src/routes/*.ts', 'src/controllers/*.ts'], // Caminhos dos arquivos das rotas/controllers
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
