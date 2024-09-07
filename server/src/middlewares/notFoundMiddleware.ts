import { type Request, type Response, type NextFunction } from "express";
import { createErrorResponse } from "$/utils/apiResponse";

export function notFoundMiddleware(req: Request, res: Response, next: NextFunction) {
  const errorResponse = createErrorResponse("Not Found", {
    details: `The ${req.method} request to ${req.originalUrl} could not be found.`,
  });
  res.status(404).json(errorResponse);
  next();
}
