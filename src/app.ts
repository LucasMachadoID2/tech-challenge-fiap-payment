import express from "express";
import routerV1 from "./routes/routesV1";
import cors from "cors";

function createApp() {
  const app = express();

  app.use(express.json());

  app.use("/api/v1.0", routerV1);

  app.use(cors());

  return app;
}

export default createApp;
