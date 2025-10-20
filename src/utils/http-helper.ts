import { HttpResponse } from "../models/http-response-model";

export const ok = (data: any): HttpResponse => {
  return {
    statusCode: 200,
    body: data,
  };
};

export const noContent = (): HttpResponse => {
  return {
    statusCode: 204,
    body: "Sem conteúdo para exibir",
  };
};

export const serverError = (): HttpResponse => {
  return {
    statusCode: 500,
    body: "Erro no servidor",
  };
};

export const badRequest = (error: Error): HttpResponse => {
  return {
    statusCode: 400,
    body: error.message,
  };
};
