import { Server as SocketIOServer } from "socket.io";
import { setupJenkinsLogSocket } from "./controller/jenkinsController";

const io = new SocketIOServer();

io.on("connection", (socket) => {
  console.log("New client connected");
  // log.info("New client connected");
  //setupJenkinsLogSocket(socket);

  socket.on("disconnect", () => {
    console.log("Client disconnected");
    // log.info("Client disconnected");
  });
});
