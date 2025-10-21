import { MercadoPagoConfig, Payment } from "mercadopago";
import { MERCADO_PAGO_TOKEN } from "./index";

const client = new MercadoPagoConfig({
  accessToken: MERCADO_PAGO_TOKEN,
  options: { timeout: 5000 },
});

export const paymentClient = new Payment(client);
