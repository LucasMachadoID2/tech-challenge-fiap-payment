import { HttpResponse } from "../models/http-response-model";

export const ok = (data: any): HttpResponse => ({
  statusCode: 200,
  body: data,
});

export const created = (data: any): HttpResponse => ({
  statusCode: 201,
  body: data,
});

export const noContent = (): HttpResponse => ({
  statusCode: 204,
  body: null,
});

export const badRequest = (message: string): HttpResponse => ({
  statusCode: 400,
  body: { error: message },
});

export const serverError = (message = "Erro interno do servidor"): HttpResponse => ({
  statusCode: 500,
  body: { error: message },
});
