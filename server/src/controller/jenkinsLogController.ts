import { type Request, type Response, type NextFunction } from "express";
import * as logService from "$/service/jenkinsLogService";
import { log } from "$/utils/logger";
import { type GetBuildLogInput, type StreamBuildLogInput } from "$/schema";

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
export function getBuildStageHandler(
  arg0: string,
  arg1: (req: Request, res: Response, next: NextFunction) => void,
  getBuildStageHandler: any
) {
  throw new Error("Function not implemented.");
}
