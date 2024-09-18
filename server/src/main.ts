import express, { type Application } from "express";
import { Server as HttpServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import config from "config";
import cors from "cors";
import helmet from "helmet";
//import rateLimit from "express-rate-limit";
import { log } from "./utils/logger";
import { routes } from "./routes/routes";
import { notFoundMiddleware } from "./middlewares/notFoundMiddleware";
import { errorMiddleware } from "./middlewares/errorMiddleware";
import { NewJenkinsClient } from "./custom/customJenkinClients";

const app: Application = express();
// const server = new HttpServer(app);
// export const io = new SocketIOServer(server, {
//   cors: {
//     origin: "*",
//     methods: ["GET", "POST"],
//   },
// });

app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiting middleware
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // limit each IP to 100 requests per windowMs
//   message: "Too many requests from this IP, please try again later",
// });

//app.use(limiter);
const PORT = config.get<number>("port");

// io.on("connection", (socket) => {
//   log.info("New client connected");

//   socket.on("disconnect", () => {
//     log.info("Client disconnected");
//   });
// });

const startServer = () => {
  try {
    // routes
    routes(app);

    app.use(notFoundMiddleware);
    app.use(errorMiddleware);

    app.listen(PORT, () => {
      log.info(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    log.error(`Error starting server: ${error}`);
  }
};

startServer();
