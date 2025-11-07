import express, { Application } from "express";
import cors from "cors";
import paymentRoutes from "./routes/paymentRoutes";
import { API_VERSION } from "./config/constants";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger";

const createApp = (): Application => {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use(`/api/${API_VERSION}`, paymentRoutes);

  // Swagger docs
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  return app;
};

export default createApp;
