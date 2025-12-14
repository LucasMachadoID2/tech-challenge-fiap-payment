// Mock do Mercado Pago
import 'dotenv/config';
import sinon from 'sinon';
import { paymentClient } from '../../src/config/mercado-pago.config';
import { Given, When, Then, Before, After } from "@cucumber/cucumber";
let mpCreateStub: sinon.SinonStub;

Before(function () {
  // Mocka o método create do Mercado Pago para sempre retornar sucesso
  const uniqueId = Math.floor(Math.random() * 1000000);
  mpCreateStub = sinon.stub(paymentClient, 'create').resolves({
    id: uniqueId,
    transaction_amount: 100,
    status: 'PAID',
    payer: { id: 'payer-id', email: 'teste@teste.com' },
    point_of_interaction: {
      transaction_data: {
        qr_code: 'mocked-qr',
        qr_code_base64: 'mocked-qr-base64'
      }
    },
    date_created: new Date().toISOString(),
    date_last_updated: new Date().toISOString(),
    api_response: { status: 201, headers: [] }
  } as any);
});After(function () {
  // Restaura o método original após o teste
  if (mpCreateStub) mpCreateStub.restore();
});
import { expect } from "chai";
import request from "supertest";
import { Application } from "express";
import createApp from "../../src/app";
import { API_VERSION } from "../../src/config/constants";

let app: Application;
let api: any; 
let response: request.Response;

Before(function () {
  app = createApp();
  api = request(app);
});

// --- Implementação dos steps ---

// 1. Corresponde a "Given I have valid payment data"
Given("I have valid payment data", function () {
  // Nada a fazer aqui, os dados estão no 'When'
});

// 2. Corresponde a "When I send a POST request to {string}"
// (Esta é a versão que o terminal sugeriu e é a mais robusta)
When('I send a POST request to {string}', async function (path: string) {
  
  // 'path' vai receber o valor "/payments" do .feature
  const url = `${path}`;

  const dadosValidos = {
    amount: 100,
    payment_method: "pix",
    payer: {
      email: "teste@teste.com"
    }
  };

  response = await api.post(url).send(dadosValidos);
});

// 3. Corresponde a "Then I should receive a response with status {int}"
Then("I should receive a response with status {int}", function (statusCode: number) {
  // 'statusCode' vai receber o valor 201 do .feature
  expect(response.status).to.equal(statusCode);
});