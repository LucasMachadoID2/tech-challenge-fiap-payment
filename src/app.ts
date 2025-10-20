import express, { Application } from "express";
import cors from "cors";
import paymentRoutes from "./routes/paymentRoutes";
import { API_VERSION } from "./config";

const createApp = (): Application => {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use(`/api/${API_VERSION}`, paymentRoutes);

  return app;
};

export default createApp;
