import { type Request, type Response, type NextFunction } from "express";
import * as logService from "$/service/jenkinsLogService";
import { log } from "$/utils/logger";
import { type GetBuildLogInput, type StreamBuildLogInput } from "$/schema";
import { Socket } from "socket.io";

export const getBuildLogHandler = async (
  req: Request<GetBuildLogInput["params"], object, object, GetBuildLogInput["query"]>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { jobName, buildNumber } = req.params;
    const { start, type, meta } = req.query;

    const logOptions: logService.LogOptions = {
      name: jobName,
      number: parseInt(buildNumber, 10),
      start: start ? parseInt(start, 10) : undefined,
      type: type as "text" | "html" | undefined,
      meta: meta === "true",
    };

    const logData = await logService.getBuildLog(logOptions);
    console.log(logData);
    res.json(logData);
  } catch (error) {
    log.error(error);
    next(error);
  }
};

export const streamBuildLogHandler = async (
  req: Request<StreamBuildLogInput["params"], object, object, StreamBuildLogInput["query"]>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { jobName, buildNumber } = req.params;
    const { type, delay } = req.query;

    const streamOptions: logService.StreamOptions = {
      name: jobName,
      number: parseInt(buildNumber, 10),
      type: type as "text" | "html" | undefined,
      delay: delay ? parseInt(delay, 10) : undefined,
    };

    const logStream = await logService.getBuildLogStream(streamOptions); // Await the stream
    console.log("Log stream initialized");

    res.setHeader("Content-Type", "text/plain");
    res.setHeader("Transfer-Encoding", "chunked");

    const timeout = setTimeout(() => {
      res.status(504).end("Log streaming timed out");
      logStream.destroy(); // Clean up the stream
    }, 10000); // 10 seconds timeout

    logStream.on("data", (chunk) => {
      clearTimeout(timeout); // If data is received, clear the timeout
      console.log("Received data chunk: ", chunk.toString());
      res.write(chunk);
    });

    logStream.on("end", () => {
      clearTimeout(timeout); // Ensure timeout is cleared when the stream ends
      console.log("Log stream ended.");
      res.end();
    });

    logStream.on("error", (error) => {
      console.error("Error in log stream:", error);
      log.error(error);
      res.status(500).end("Error occurred while streaming log");
    });
  } catch (error) {
    log.error(error);
    next(error);
  }
};

export const setupJenkinsLogSocket = (socket: Socket) => {
  socket.on("subscribe_log", async (data: { jobName: string; buildNumber: number }) => {
    const { jobName, buildNumber } = data;
    log.info(`Client subscribed to log for job ${jobName}, build ${buildNumber}`);

    try {
      const streamOptions: logService.StreamOptions = {
        name: jobName,
        number: buildNumber,
        type: "text",
        delay: 1000, // 1 second delay between chunks
      };

      const logStream = await logService.getBuildLogStream(streamOptions);

      logStream.on("data", (chunk) => {
        socket.emit("log_update", { jobName, buildNumber, log: chunk.toString() });
      });

      logStream.on("end", () => {
        socket.emit("log_end", { jobName, buildNumber });
      });

      logStream.on("error", (error) => {
        log.error(`Error streaming log for ${jobName} #${buildNumber}: ${error}`);
        socket.emit("log_error", { jobName, buildNumber, error: error.message });
      });

      socket.on("unsubscribe_log", () => {
        logStream.destroy();
        log.info(`Client unsubscribed from log for job ${jobName}, build ${buildNumber}`);
      });
    } catch (error) {
      log.error(`Failed to setup log stream for ${jobName} #${buildNumber}: ${error}`);
      socket.emit("log_error", { jobName, buildNumber, error: "Failed to setup log stream" });
    }
  });
};
