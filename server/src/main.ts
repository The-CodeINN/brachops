import express, { type Application } from "express";
import config from "config";
import cors from "cors";
import helmet from "helmet";
import { createServer } from "http";
import { Server } from "socket.io";
import { log } from "./utils/logger";
import { routes } from "./routes/routes";
import { notFoundMiddleware } from "./middlewares/notFoundMiddleware";
import { errorMiddleware } from "./middlewares/errorMiddleware";
import { setupJenkinsLogSocket } from "./controller/jenkinsLogController";

const app: Application = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: config.get<string>("clientUrl"), // Make sure to add this to your config
    methods: ["GET", "POST"],
  },
});

app.use(helmet());
app.use(cors());
app.use(express.json());

const PORT = config.get<number>("port");

const startServer = () => {
  try {
    // routes
    routes(app);

    app.use(notFoundMiddleware);
    app.use(errorMiddleware);

    // Set up Socket.IO connection
    io.on("connection", (socket) => {
      log.info(`New client connected: ${socket.id}`);
      setupJenkinsLogSocket(socket);

      socket.on("disconnect", () => {
        log.info(`Client disconnected: ${socket.id}`);
      });
    });

    httpServer.listen(PORT, () => {
      log.info(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    log.error(`Error starting server: ${error}`);
  }
};

startServer();
