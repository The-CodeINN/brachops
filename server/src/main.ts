import express, { type Request, type Response, type Application } from "express";
import config from "config";
import cors from "cors";
import helmet from "helmet";
import { log } from "./utils/logger";

const app: Application = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get("/", (_req: Request, res: Response) => {
  res.send("Hello World!");
});

const PORT = config.get<number>("port");

const startServer = () => {
  try {
    app.listen(PORT, () => {
      log.info(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    log.error(`Error starting server: ${(error as Error).message}`);
  }
};

startServer();
