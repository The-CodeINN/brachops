import express, { type Application } from "express";
import { Server as HttpServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import config from "config";
import cors from "cors";
import helmet from "helmet";
import { log } from "./utils/logger";
import { routes } from "./routes/routes";
import { notFoundMiddleware } from "./middlewares/notFoundMiddleware";
import { errorMiddleware } from "./middlewares/errorMiddleware";
import { setupJenkinsLogSocket } from "./controller/jenkinsController";

const app: Application = express();
const server = new HttpServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(helmet());
app.use(cors());
app.use(express.json());

app.locals.io = io;

const PORT = config.get<number>("port");

io.on("connection", (socket) => {
  console.log("New client connected");
  log.info("New client connected");
  setupJenkinsLogSocket(socket);

  socket.on("disconnect", () => {
    console.log("Client disconnected");
    log.info("Client disconnected");
  });
});

const startServer = () => {
  try {
    // routes
    routes(app);

    app.use(notFoundMiddleware);
    app.use(errorMiddleware);

    server.listen(PORT, () => {
      log.info(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    log.error(`Error starting server: ${error}`);
  }
};

startServer();
