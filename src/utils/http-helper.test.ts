import { describe, test, expect } from '@jest/globals';

import {
  ok,
  created,
  noContent,
  badRequest,
  notFound,
  serverError,
} from './http-helper';

// Importa o type para referência
import { HttpResponse } from '../models/http-response-model';

// Bloco principal de testes para este arquivo
describe('HttpHelper', () => {
  // Testa a função ok (200)
  test('deve retornar uma resposta 200 (OK) com os dados corretos', () => {
    const data = { id: 1, name: 'Teste' };
    const response: HttpResponse = ok(data);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(data); 
  });

  // Testa a função created (201)
  test('deve retornar uma resposta 201 (Created) com os dados corretos', () => {
    const data = { message: 'Criado com sucesso' };
    const response: HttpResponse = created(data);

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual(data);
  });

  // Testa a função noContent (204)
  test('deve retornar uma resposta 204 (No Content) com body nulo', () => {
    const response: HttpResponse = noContent();

    expect(response.statusCode).toBe(204);
    expect(response.body).toBeNull(); 
  });

  // Testa a função badRequest (400)
  test('deve retornar uma resposta 400 (Bad Request) com a mensagem de erro', () => {
    const errorMessage = 'Parâmetro inválido';
    const response: HttpResponse = badRequest(errorMessage);

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({ error: errorMessage });
  });

  // Testa a função notFound (404)
  test('deve retornar uma resposta 404 (Not Found) com a mensagem de erro', () => {
    const errorMessage = 'Recurso não encontrado';
    const response: HttpResponse = notFound(errorMessage);

    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({ error: errorMessage });
  });

  // Testa a função serverError (500) com mensagem customizada
  test('deve retornar uma resposta 500 (Server Error) com uma mensagem de erro customizada', () => {
    const errorMessage = 'Falha no banco de dados';
    const response: HttpResponse = serverError(errorMessage);

    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({ error: errorMessage });
  });

  // Testa a função serverError (500) com mensagem padrão
  test('deve retornar uma resposta 500 (Server Error) com a mensagem padrão', () => {
    const response: HttpResponse = serverError(); // Sem passar parâmetro

    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({ error: 'Erro interno do servidor' });
  });
});