import express, { type Request, type Response, type Application } from "express";
import config from "config";
import cors from "cors";
import helmet from "helmet";
import { log } from "./utils/logger";
import { routes } from "./routes/routes";

const app: Application = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

const PORT = config.get<number>("port");

const startServer = () => {
  try {
    // routes
    routes(app);

    app.listen(PORT, () => {
      log.info(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    log.error(`Error starting server: ${error}`);
  }
};

startServer();
